import { AudienceLevels } from "prisma/prismaContext"
import { useState } from "react"
import useDebug from "hooks/useDebug"
import { sendApi } from "utils/api"
import { uniqueKey } from "utils/helpers"
import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { CheckBadge } from "components/ui/icons"
import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"

const {debug} = useDebug("UserBillingDetail")

// TODO: This should pull from MembershipType instead, since these values can change. Will prolly need an API for that
type PlanType = {
    audience: AudienceLevels
    label: string
    description: string
    cta: {
        monthly: string
        annually: string
    }
    price: {
        monthly: number
        annually: number
    }
}
const plans:PlanType[] = [
    {
        audience: 'USER',
        label: 'Free Tier',
        description: 'Everything you need to write a story and get feedback from the larger Cyfr community!',
        cta: {
            monthly: `What's better than free???`,
            annually: `What's better than free???`,
        },
        price: {
            monthly: 0,
            annually: 0
        }
    },
    {
        audience: 'MEMBER',
        label: 'Author Tier',
        description: `Once your story is ready, switch to Author Tier to sell your book! Or use the additional
                      features to collaborate even more deeply during the writing process, including collaboration
                      groups, Agent prospecting, story and author dashboards, A/B testing and more!`,
        cta: {
            monthly: `Budget-friendly monthly subscription!`,
            annually: `Get two free months!! Eeeep!!`,
        },
        price: {
            monthly: 9,
            annually: 89
        }
    },
    {
        audience: 'AGENT',
        label: 'Agent',
        description: `Interact with Authors: track your favorites, including collaboration and analytics, conduct
                      manuscript events and wishlists, and a submission form and tracker!`,
        cta: {
            monthly: ``,
            annually: `Get two months free!!! So much coolness!`,
        },
        price: {
            monthly: 49,
            annually: 499
        }
    },
]

const UserBillingDetail = () => {
    const [cyfrUser, isLoading, error, invalidate] = useCyfrUserContext()
    const initialPlan = plans[cyfrUser.membership?.type?.level ?? 0]
    const [plan, setPlan] = useState<PlanType>(initialPlan)

    const isPlan = (plan:PlanType) => initialPlan

    const choosePlan = async (plan:PlanType, cadence: string) => {
        debug('choosePlan', {plan: plan.audience.toString(), cadence})
        // TODO: move this to user api
        const user = await sendApi('user/membership/choose', {audience: plan.audience, cadence})
        if (user && user.data.result) {
            debug('choosePlan', {result: user.data.result})
        }
        invalidate()
    }

  return (
    <div className="lg:flex lg:flex-row items-center justify-between my-6 p-4 rounded-lg bg-base-200">
      <div className="lg:w-1/2 w-full">
        <p className="text-base leading-4 text-base-content text-opacity-70">
          Choose your plan
        </p>
        <h1
          role="heading"
          className="md:text-5xl text-3xl font-bold leading-10 mt-3 text-base-content "
        >
          Our pricing plan
        </h1>
        <p
          role="contentinfo"
          className="text-base leading-5 mt-5 text-base-content text-opacity-70"
        >
          We’re working on a suite of tools to make writing a social effort, for everyone for free.
        </p>
        <div className="flex flex-col space-y-6 mt-6">
          {plans.map(p => (
            <div className={`w-full py-4 px-6 transition-all duration-200 flex justify-between
              text-base leading-none text-base-content text-opacity-70 bg-base-100 rounded-md 
              cursor-pointer shadow border-l-8
              hover:shadow-lg hover:border-primary
              ${p === plan 
                ? 'border-secondary' 
                : 'border-base-100'}
            `}
            key={uniqueKey(cyfrUser,p)}
            onClick={() => setPlan(p)}
            >
              <h2 className="text-2xl font-semibold leading-6 text-base-content ">{p.label}</h2>
              {p === initialPlan && <span className="text-success text-xl">{CheckBadge}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="xl:w-1/2 lg:w-7/12 relative w-full px-8 flex-grow">
        <h2 className="text-2xl font-semibold leading-6 text-base-content">
          {plan.label}
        </h2>
        <p className="md:w-80 text-base leading-6 mt-4 text-base-content text-opacity-70">
          {plan.description}
        </p>
        <div className="md:flex justify-between space-x-4">
          <div className="my-2 p-2 bg-base-100 rounded-md shadow flex-grow">
            <p className="font-semibold">Monthly</p>
            <h2 className="text-2xl font-semibold leading-6 text-base-content">${plan.price.monthly}/mo</h2>
            <p className="my-2 text-sm flex-grow">{plan.cta.monthly}</p>
            {plan.audience !== 'USER' && 
                <button className="btn bg-base-content bottom-0" onClick={() => choosePlan(plan, 'monthly')}>Choose {plan.label} monthly</button>
            }
          </div>
          <div className="my-2 p-2 bg-base-100 rounded-md shadow flex-grow">
              <p className="font-semibold">Annually</p>
              <h2 className="text-2xl font-semibold leading-6 text-primary">${plan.price.annually}/yr</h2>
              <p className="my-2 text-sm flex-grow">{plan.cta.annually}</p>
              {plan.audience !== 'USER' && 
              <button className="btn btn-success bottom-0" onClick={() => choosePlan(plan, 'annually')}>Choose {plan.label} annually</button>
              }
          </div>
        </div>
          {plan.audience === 'USER' && 
            <div><button className="btn bg-base-content" onClick={() => choosePlan(plan, 'free')}>Choose {plan.label}</button></div>
          }
      </div>
    </div>
  )
}
export default UserBillingDetail
