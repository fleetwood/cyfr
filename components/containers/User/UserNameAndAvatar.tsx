import { useToast } from 'components/context/ToastContextProvider'
import { Dropzone, TailwindInput } from 'components/forms'
import { SaveIcon } from 'components/ui/icons'
import Spinner from 'components/ui/spinner'
import useDebug from 'hooks/useDebug'
import { useCyfrUserApi } from 'prisma/hooks/useCyfrUserApi'
import { CyfrUser, Image } from 'prisma/prismaContext'
import React, { useEffect, useState } from 'react'
import { cloudinary } from 'utils/cloudinary'

const { debug } = useDebug('containers/User/UserNameAndAvatar')

export const UserNameAndAvatar = () => {
  const { cyfrUser, isLoading, error, invalidate, updateUser } =
    useCyfrUserApi()
  const { notify } = useToast()
  const [cyfrName, setCyfrName] = useState<string | null>(cyfrUser?.name)

  const onNameChange = async () => {
    if (cyfrName === null || cyfrName.length < 3) {
      return
    }
    const newCyfrUser = {
      ...cyfrUser,
      name: cyfrName,
      slug: cyfrName.replaceAll(' ','-').toLowerCase()
    } as unknown as CyfrUser
    const result = await updateUser(newCyfrUser)
    if (result) {
      notify('Updated!')
      invalidate()
    } else {
      notify('Ya that dint work sry', 'warning')
    }
  }

  const onFileComplete = async (files: Image[]) => {
    const file = files[0]
    if (files[0]) {
      debug(`onFileComplete`, file)
      const newCyfrUser = {
        ...cyfrUser,
        image: files[0].url,
      } as unknown as CyfrUser
      const result = await updateUser(newCyfrUser)
      if (result) {
        notify('Updated!')
        invalidate()
      } else {
        notify('Ya that dint work sry', 'warning')
      }
    }
  }

  useEffect(() => {
    if (cyfrUser) setCyfrName(() => cyfrUser.name)
  }, [cyfrUser])

  return (
    <div>
        {isLoading && <Spinner />}
        {cyfrUser && <>
            <TailwindInput
                label="Display Name"
                type="text"
                inputClassName="input input-bordered focus:border-primary"
                value={cyfrName}
                setValue={setCyfrName}
            />
            <button className="btn btn-primary btn-sm" onClick={onNameChange}>
                {SaveIcon}
            </button>
            <h3 className="h-title">Avatar</h3>
            <Dropzone onDropComplete={onFileComplete} limit={1} showUploadProgress={false}>
                <img src={cloudinary.resize({ url: cyfrUser.image!, width: 200 })} />
            </Dropzone>
        </>}
    </div>
  )
}
