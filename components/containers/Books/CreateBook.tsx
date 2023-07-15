import { Box } from '@mui/material'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { TailwindInput, TailwindTextarea } from 'components/forms'
import EZButton from 'components/ui/ezButton'
import { ArrowLeftIcon, ArrowRightIcon, CyfrLogo, SaveIcon } from 'components/ui/icons'
import Toggler from 'components/ui/toggler'
import useDebug from 'hooks/useDebug'
import React, { useState } from 'react'
import GenreSelector from '../Genre/GenreSelector'
import UserSelector from '../User/UserSelector'
import UserPermissionsGridItem from './UserPermissionsGridItem'
import Semibold from 'components/ui/semibold'

const {debug} = useDebug("components/containers/Books/CreateBook")
const createBookModal = 'createBookModal'

export const CreateBookModalButton = () => (
    <label htmlFor={createBookModal} className="btn btn-info space-x-2">
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">New Book!</span>
    </label>
)

const CreateBook = () => {
    const [title, setTitle] = useState<string|null>(null)
    const [visible, setVisible] = useState(false)
    const [prospect, setProspect] = useState(false)
    const [fiction, setFiction] = useState()
    const [status, setStatus] = useState()
    const [cover, setCover] = useState()
    const [genreId, setGenreId] = useState()
    // const [categories, setCategories] = useState<BookCategory[]>(book?.categories || [])
    const [hook, setHook] = useState<string|null>(null)
    const [synopsis, setSynopsis] = useState<string|null>(null)
    const [back, setBack] = useState<string|null>(null)
    const [authors, setAuthors] = useState()
    // const [chapters, setChapters] = useState<Chapter[]>(book?.chapters || [])
    // const [characters, setCharacters] = useState<Character[]>(book?.characters || [])
    // const [gallery, setGallery] = useState<GalleryStub | null>(book?.gallery || null)
    const [images, setImages] = useState()

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const handleReset = () => setActiveStep(0)

  const showStep = (step:number) => step === activeStep ? 'inline' : 'hidden'

  const steps = ['Name', 'About', 'Access', 'Cover', 'Review']

  const toggleModal = (show?:boolean) => {
    const createModal = document.getElementById(createBookModal)
    // @ts-ignore
    createModal!.checked = show || false
  }

  return (
    <>
    <input type="checkbox" id={createBookModal} className="modal-toggle" />
    <div className="modal modal-middle">
      <div className="modal-box min-w-full min-h-screen bg-black bg-opacity-20 shadow-none overflow-visible scrollbar-hide">
        <label htmlFor={createBookModal} className="btn btn-sm btn-circle btn-warning absolute right-0 top-6">✕</label>
        <div className="mb-3 rounded-xl w-full h-full bg-gray-100 text-primary-content m-4 p-4">
            <Stepper activeStep={activeStep}>{steps.map((label, index) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}</Stepper>

            <Box>
                <div className={`${showStep(0)} flex flex-col space-y-2`}>
                    <h3 className='mt-2'>Name and Author</h3>
                    <Box className='flex flex-col'>
                        <p className='text-sm mt-4'>Give your book a <span className='font-semibold'>unique name.</span></p>
                        <TailwindInput type='text' value={title} setValue={setTitle} label='Title' />
                        <p className='text-sm mt-4'>If you're collaborating with another member of <Semibold>Cyfr</Semibold>, add them here. Note: this person will have <span className='font-semibold'>full access and privileges to the book</span>, so you have to be friends (as in: you Follow each other). Would be kinda weird otherwise.</p>
                        <UserSelector label='Authors' />
                    </Box>
                </div>

                <div className={showStep(1)}>
                    <h3 className='mt-2'>Entice your audience!</h3>
                    <Box className='flex flex-col'>
                        <GenreSelector required={true} className='mt-4' />
                        <p className='text-sm mt-4'>A short blurb to tease the book to readers.</p>
                        <TailwindTextarea value={hook} setValue={setHook} label='Hook' required={false} />
                        <p className='text-sm mt-4'>The summary that goes on the back cover. You may not have this yet, but if you do, great!</p>
                        <TailwindTextarea value={back} setValue={setBack} label='Back Panel' required={false} />
                    </Box>
                </div>
                <div className={showStep(2)}>
                    <h3 className='mt-2 text-sm'>Share it or Not</h3>
                    <Box className='flex flex-col'>
                        <UserPermissionsGridItem level='Public'><p>This is anybody who visits the site, including <Semibold>bots and search engines</Semibold>.</p></UserPermissionsGridItem>
                        <UserPermissionsGridItem level='Members'><p>This is anybody who is <Semibold>logged in</Semibold> to the site, which will exclude bots and search engines.</p></UserPermissionsGridItem>
                        <UserPermissionsGridItem level='Friends'><p>Only members who you <Semibold>mutually follow</Semibold>; you follow them and they follow you back.</p></UserPermissionsGridItem>
                        <UserPermissionsGridItem level='Agents'><p>This will allow agents to interact with your book. Note that they must have at least <Semibold>Read</Semibold> permissions in order to be able to see submissions.</p></UserPermissionsGridItem>
                        <UserPermissionsGridItem level='Commune'><p>Only specific members will be allowed specific access to your book.</p></UserPermissionsGridItem>
                    </Box>
                </div>
                <div className={showStep(3)}>
                    <h3>Pick a Cover</h3>
                </div>
                <div className={showStep(4)}>
                    <h3>All Good?</h3>
                </div>
            </Box>
            
            <Box className='flex justify-evenly mt-8'>
                <EZButton className={activeStep>0 ? 'inline' : 'hidden'} label={ArrowLeftIcon} onClick={() => setActiveStep(activeStep-1)} />
                <Box sx={{ flex: '1 1 auto' }} />
                <EZButton className={activeStep<4 ? 'inline' : 'hidden'} label={ArrowRightIcon} onClick={() => setActiveStep(activeStep+1)}  />
                <EZButton className={activeStep==4 ? 'inline' : 'hidden'} label={SaveIcon} />
            </Box>
        </div>
        </div>
    </div>
    </>
  )
}

export default CreateBook