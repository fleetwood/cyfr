import React, { FormEvent, useRef, useState } from 'react'
import useDebug from 'hooks/useDebug'
import { BookDetail, BookDetailHook, Character } from 'prisma/prismaContext'
import { sendApi } from 'utils/api'
import ModalCheckbox, { ModalCloseButton, ModalOpenButton } from 'components/ui/modalCheckbox'
import useApi from 'prisma/useApi'
import { useToast } from 'components/context/ToastContextProvider'
import Spinner from 'components/ui/spinner'
import { TailwindInput, InlineTextarea } from 'components/forms'
import EZButton from 'components/ui/ezButton'
import { LoggedIn } from 'components/ui/toasty'
const {debug} = useDebug("components/containers/Character/CreateCharacterModal")

const createCharacterModal = 'createCharacterModal'

export const OpenCharacterModalButton = () => <ModalOpenButton id={createCharacterModal} label='Create Character' />
export const OpenCharacterModalPlus = () => <ModalOpenButton id={createCharacterModal} variant='plus' />

type CreateCharacterModalType = {
  bookDetail: BookDetail
}

const CreateCharacterModal = ({bookDetail}:CreateCharacterModalType) => {
  const {cyfrUser, isLoading, error} = useApi.cyfrUser()
  const { notify } = useToast()
  const container = useRef<HTMLDivElement>(null)

  const [name, setName] = useState<string|null>(null)
  const [familyName, setFamilyName] = useState<string>('')
  const [givenName, setGivenName] = useState<string>('')
  const [middleName, setMiddleName] = useState<string>('')
  const [thumbnail, setThumbnail] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [archetype, setArchetype] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [backstory, setBackstory] = useState<string>('')
  const [active, setActive] = useState<boolean>(true)

  const displayName = name || [givenName, familyName].join(' ').trim()

  const steps = ['Bio', 'Appearance', 'Backstory', 'Thumbnail', 'Done']
  const [currentStep, setCurrentStep] = useState(0)

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    
    // const result = await (await sendApi('character/upsert', {
    //   name: displayName,
    //   givenName,
    //   middleName: middleName??'',
    //   familyName,
    //   title: title??'',
    //   age: age??'',
    //   description,
    //   role: role??'',
    //   archetype: archetype??'',
    //   backstory,
    //   thumbnail: thumbnail??'',
    //   active,
    //   bookId: bookDetail!.id
    // })).data
    // if (result) {
    //   const {name, givenName, familyName} = result as Character
    //   let char = givenName || name || null
    //   if (char === null) {
    //     char = 'Your character'
    //   }
    //   else if (givenName && familyName) {
    //     char += ' ' + familyName
    //   }
    //   notify(`${char} was added to ${bookDetail?.title}!`)
    //   closeModal()
    // } else {
    //   notify('Hm, that dint work', 'warning')
    // }
    notify('No Implemented', 'warning')
    closeModal()
  }

  const buttonGotThis = (e: { preventDefault: () => void }) => {
    e.preventDefault()
  }

  const closeModal = (e?:any) => {
    debug('closeModal needs manual toggle')
  }

  return (
    <>
    <ModalCheckbox id={createCharacterModal} />
    <div ref={container} id='createCharacterModalContainer' className="modal bg-opacity-0 modal-bottom sm:modal-middle">
      <div className="modal-box shadow-none scrollbar-hide">
        <ModalCloseButton id={createCharacterModal} />
        <div className="mb-3 rounded-xl w-full bg-primary text-primary-content  md:bg-blend-hard-light md:bg-opacity-80 max-h-fit">
          {isLoading && <Spinner />}
          {!isLoading && !cyfrUser &&
            <LoggedIn />
          }
          {cyfrUser && (
            <div className="w-full mx-auto m-4 p-2 sm:p-6 lg:p-4 bg-base-300 rounded-lg">
              
              <ul className="steps steps-vertical lg:steps-horizontal bg-base-100">
                {steps.map((step,idx) => (
                  <li className={`cursor-pointer hover:step-success step ${currentStep>=idx ? 'step-secondary':''}`} onClick={() => setCurrentStep(idx)} key={step+idx}>{step}</li>
                ))}
              </ul>
              
              <form className={`min-h-full relative`} onSubmit={buttonGotThis}>

                <TailwindInput type='text' label='Name' value={displayName} setValue={setName} required={true} />
                <TailwindInput type='text' label='Given Name' value={givenName} setValue={setGivenName} required={true} />
                <TailwindInput type='text' label='Middle Name' value={middleName} setValue={setMiddleName} required={true} />
                <TailwindInput type='text' label='Family Name' value={familyName} setValue={setFamilyName} required={true} />
                <TailwindInput type='text' label='Title' value={title} setValue={setTitle} required={true} />

                <TailwindInput type='text' label='Age' value={age} setValue={setAge} required={true} />
                <InlineTextarea label='Description' content={description} setContent={setDescription} required={true} />

                <TailwindInput type='text' label='Role' value={role} setValue={setRole} required={true} />
                <TailwindInput type='text' label='Archetype' value={archetype} setValue={setArchetype} required={true} />
                <InlineTextarea label='Backstory' content={backstory} setContent={setBackstory} required={true} />

                <EZButton disabled={false} label='Create' onClick={handleSubmit} />

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default CreateCharacterModal