import { useToast } from 'components/context/ToastContextProvider'
import { CheckBadge } from 'components/ui/icons'
import useDebug from 'hooks/useDebug'
import useApi from 'prisma/useApi'
import { cadenceInterval } from 'prisma/useApi/cyfrUser'
import { useState } from 'react'
import { uniqueKey } from 'utils/helpers'

const { debug } = useDebug('UserBillingDetail')

// TODO: This should pull from MembershipType instead, since these values can change. Will prolly need an API for that
type PlanType = {
  id:           string
  paid:         boolean
  label:        string
  description:  string
  cta: {
    monthly:  string
    annually: string
  }
  price: {
    monthly:  number
    annually: number
  }
}

// TODO: This should come from db
const plans: PlanType[] = [
  {
    id: '42755F765367489AB2BD7067247194F5',
    paid: false,
    label: 'Reader',
    description: `Just here for the books? Great! You're our favorite people!!!`,
    cta: {
      monthly: `What's better than free???`,
      annually: `What's better than free???`,
    },
    price: {
      monthly: 0,
      annually: 0,
    },
  },
  {
    id: '78D2A222D7E24DBA90F7895481AA621B',
    paid: true,
    label: 'Author',
    description: `Once your story is ready, switch to Author Tier to sell your book! Or use the additional
                  features to collaborate even more deeply during the writing process, including collaboration
                  groups, Agent prospecting, story and author dashboards, A/B testing and more!`,
    cta: {
      monthly: `Budget-friendly monthly subscription!`,
      annually: `Get two free months!! Eeeep!!`,
    },
    price: {
      monthly: 9,
      annually: 89,
    },
  },
  {
    id: 'AE54C97A0C604EAA9DA5B3ED4A9DFAAC',
    paid: true,
    label: 'Artist',
    description: `Whether you're an illustrator or a cover designer, or even if you're an author that illustrates
                  your own books, start here!`,
    cta: {
      monthly: `Budget-friendly monthly subscription!`,
      annually: `Get two free months!! Eeeep!!`,
    },
    price: {
      monthly: 9,
      annually: 89,
    },
  },
  {
    id: '38F97FF088CC487CA29A6C2C3AEA55B5',
    paid: true,
    label: 'Agent',
    description: `Interact with Authors: track your favorites, including collaboration and analytics, conduct
                  manuscript events and wishlists, and a submission form and tracker!`,
    cta: {
      monthly: ``,
      annually: `Get two months free!!! So much coolness!`,
    },
    price: {
      monthly: 49,
      annually: 499,
    },
  },
]

const UserBillingDetail = () => {
  const { cyfrUser, isLoading, error, invalidate, updateUser, setMembership } = useApi.cyfrUser()
  const {notify} = useToast()
  const [plan, setPlan] = useState<PlanType>(plans.find((p) => p.id === cyfrUser?.membership?.typeId) ?? plans[0])

  const isPlan = (p: PlanType) => p.id === plan.id
  const currentPlan = (p:PlanType) => cyfrUser?.membership?.typeId === p.id

  const choosePlan = async (typeId: string, cadence: cadenceInterval) => {
    debug('choosePlan', { id: typeId, cadence })
    const result = await setMembership({typeId, cadence})
    if (result) {
      notify('Congratulations on your new membership!')
    }
    invalidate()
  }

  return (
    <div className="lg:flex lg:flex-row items-center justify-between my-6 p-4 rounded-lg bg-base-200">
      <div className="lg:w-1/2 w-full">
        
        <p className="text-base leading-4 text-base-content text-opacity-70">
          Choose your plan</p>
        <h1 role="heading" className="md:text-5xl text-3xl font-bold leading-10 mt-3 text-base-content">
          Our pricing plan</h1>
        <p role="contentinfo" className="text-base leading-5 mt-5 text-base-content text-opacity-70">
          We’re working on a suite of tools to make writing a social effort, for
          everyone for free. <strong>TODO: Tie this to the db.</strong></p>

        <div className="flex flex-col space-y-6 mt-6">
          {plans.map((p) => (
            <div
              className={`w-full py-4 px-6 transition-all duration-200 flex justify-between
              text-base leading-none text-base-content text-opacity-70 bg-base-100 rounded-md 
              cursor-pointer shadow border-l-8
              hover:shadow-lg hover:border-primary
              ${isPlan(p) ? 'border-secondary' : 'border-base-100'}
            `}
              key={uniqueKey(cyfrUser, p)}
              onClick={() => setPlan(p)}
            >
              <h2 className="text-2xl font-semibold leading-6 text-base-content ">
                {p.label}
              </h2>
              {currentPlan(p) && (
                <span className="text-success text-xl">{CheckBadge}</span>
              )}
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
            <h2 className="text-2xl font-semibold leading-6 text-base-content">
              ${plan.price.monthly}/mo
            </h2>
            <p className="my-2 text-sm flex-grow">{plan.cta.monthly}</p>
            {plan.paid && (
              <button
                className="btn bg-base-content bottom-0"
                onClick={() => choosePlan(plan.id, 'M')}
              >
                Choose {plan.label} monthly
              </button>
            )}
          </div>
          <div className="my-2 p-2 bg-base-100 rounded-md shadow flex-grow">
            <p className="font-semibold">Annually</p>
            <h2 className="text-2xl font-semibold leading-6 text-primary">
              ${plan.price.annually}/yr
            </h2>
            <p className="my-2 text-sm flex-grow">{plan.cta.annually}</p>
            {plan.paid && (
              <button
                className="btn btn-success bottom-0"
                onClick={() => choosePlan(plan.id, 'y')}
              >
                Choose {plan.label} annually
              </button>
            )}
          </div>
        </div>
        {!plan.paid && (
          <div>
            <button
              className="btn bg-base-content"
              onClick={() => choosePlan(plan.id, 'M')}
            >
              Choose {plan.label}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
export default UserBillingDetail
