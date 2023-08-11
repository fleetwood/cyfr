import {MembershipType} from '@prisma/client'
import {useToast} from 'components/context/ToastContextProvider'
import {CheckBadge} from 'components/ui/icons'
import useDebug from 'hooks/useDebug'
import useApi from 'prisma/useApi'
import {cadenceInterval} from 'prisma/useApi/cyfrUser'
import {useEffect, useState} from 'react'
import {uniqueKey} from 'utils/helpers'

const { debug } = useDebug('UserBillingDetail')

const UserBillingDetail = () => {
  const { cyfrUser, isLoading, error, invalidate, updateUser, setMembership } = useApi.cyfrUser()
  const { notify } = useToast()
  const [ types, setTypes] = useState<MembershipType[]>()
  const [membershipType, setMembershipType] = useState<MembershipType|null>(types?.find(t => t.id === cyfrUser?.membership?.type.id) ?? (types ? types[0] : null))

  const isPlan = (p: MembershipType) => p.id === membershipType?.id ?? false
  const currentPlan = (p:MembershipType) => cyfrUser?.membership?.type.id === p.id

  const chooseMembership = async (typeId: string, cadence: cadenceInterval) => {
    debug('chooseMembership', { id: typeId, cadence })
    const result = await setMembership({typeId, cadence})
    if (result) {
      notify('Congratulations on your new membership!', 'success')
    }
    invalidate()
  }

  useEffect(() => {
    const getTypes = async() => {
      const t = await useApi.membership().types()
      if (t) {
        setTypes(() => t)
        setMembershipType(() => t.find((p) => p.id === cyfrUser?.membership?.type.id) ?? t[0])
      }
    }
    getTypes()
  }, [])

  return (
    <div className="lg:flex lg:flex-row items-center justify-between my-6 p-4 rounded-lg bg-base-200">
      <div className="lg:w-1/2 w-full">
        
        <p className="text-base leading-4 text-base-content text-opacity-70">
          Choose your plan</p>
        <h1 role="heading" className="md:text-5xl text-3xl font-bold leading-10 mt-3 text-base-content">
          Our pricing plan</h1>
        <p role="contentinfo" className="text-base leading-5 mt-5 text-base-content text-opacity-70">
          We’re working on a suite of tools to make writing a social effort, for
          everyone for free.</p>

        <div className="flex flex-col space-y-6 mt-6">
          {types && types.map((t:MembershipType) => (
            <div
              className={`w-full py-4 px-6 transition-all duration-200 flex justify-between
              text-base leading-none text-base-content text-opacity-70 bg-base-100 rounded-md 
              cursor-pointer shadow border-l-8
              hover:shadow-lg hover:border-primary
              ${isPlan(t) ? 'border-secondary' : 'border-base-100'}
            `}
              key={uniqueKey(cyfrUser, t)}
              onClick={() => setMembershipType(t)}
            >
              <h2 className="text-2xl font-semibold leading-6 text-base-content ">
                {t.name}
              </h2>
              {currentPlan(t) && (
                <span className="text-success text-xl">{CheckBadge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {membershipType &&
      <div className="xl:w-1/2 lg:w-7/12 relative w-full px-8 flex-grow">
        <h2 className="text-2xl font-semibold leading-6 text-base-content">
          {membershipType.name}
        </h2>
        <p className="md:w-80 text-base leading-6 mt-4 text-base-content text-opacity-70">
          {membershipType.description}
        </p>
        <div className="md:flex justify-between space-x-4">
          <div className="my-2 p-2 bg-base-100 rounded-md shadow flex-grow">
            <p className="font-semibold">Monthly</p>
            <h2 className="text-2xl font-semibold leading-6 text-base-content">
              ${membershipType.monthlyPrice}/mo
            </h2>
            <p className="my-2 text-sm flex-grow">{membershipType.monthlyDescription}</p>
            {membershipType.paid && (
              <button
                className="btn bg-base-content bottom-0"
                onClick={() => chooseMembership(membershipType.id, 'M')}
              >
                Choose {membershipType.name} monthly
              </button>
            )}
          </div>
          <div className="my-2 p-2 bg-base-100 rounded-md shadow flex-grow">
            <p className="font-semibold">Annually</p>
            <h2 className="text-2xl font-semibold leading-6 text-primary">
              ${membershipType.annualPrice}/yr
            </h2>
            <p className="my-2 text-sm flex-grow">{membershipType.annualDescription}</p>
            {membershipType.paid && (
              <button
                className="btn btn-success bottom-0"
                onClick={() => chooseMembership(membershipType.id, 'y')}
              >
                Choose {membershipType.name} annually
              </button>
            )}
          </div>
        </div>
        {!membershipType.paid && (
          <div>
            <button
              className="btn bg-base-content"
              onClick={() => chooseMembership(membershipType.id, 'M')}
            >
              Choose {membershipType.name}
            </button>
          </div>
        )}
      </div>
      }

    </div>
  )
}
export default UserBillingDetail
