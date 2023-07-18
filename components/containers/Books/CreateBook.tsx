import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide } from '@mui/material'
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
import BookPermissions from './BookPermissions'
import Semibold from 'components/ui/semibold'
import { TransitionProps } from '@mui/material/transitions'
import BookPermissionsDialog from './BookPermissionsDialog'
import { Role, Permission } from 'prisma/prismaContext'
import { now, uniqueKey } from 'utils/helpers'

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
    const [permissions, setPermissions] = useState<Permission>({
        id: uniqueKey(),
        createdAt: now(),
        updatedAt: now(),
        public: [Role.NONE],
        member: [Role.NONE],
        reader: [Role.NONE],
        editor: [Role.NONE],
        author: [Role.NONE],
        artist: [Role.NONE],
        agent : [Role.NONE]
    })
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
                        <p className='text-sm mt-4'>If you're co-authoring with another member of <Semibold>Cyfr</Semibold>, add them here. Note: this person will have <span className='font-semibold'>full access and privileges to the book</span>, so you have to be friends (as in: you Follow each other). Would be kinda weird otherwise.</p>
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
                    <div className='flex mt-2'>
                        <Grid container columns={12}>
                            <Grid xs={6}><h3>Share it or Not</h3></Grid>
                            <Grid xs={6}><BookPermissionsDialog /></Grid>
                        </Grid>
                    </div>
                    <Box className='flex flex-col'>
                        <BookPermissions level='Public'><p>This is anybody who visits the site, including <Semibold>bots and search engines</Semibold>.</p></BookPermissions>
                        <BookPermissions level='Members'><p>This is anybody who is <Semibold>logged in</Semibold> to the site, which will exclude bots and search engines.</p></BookPermissions>
                        <BookPermissions level='Friends'><p>Only members who you <Semibold>mutually follow</Semibold>; meaning you follow them and they follow you back.</p></BookPermissions>
                        <BookPermissions level='Editors'><p>Are you shopping for a good editor? Join the club! Better yet, invite them to yours! :)</p></BookPermissions>
                        <BookPermissions level='Agents'><p>This will allow agents to interact with your book. This inlcudes <Semibold>submissions</Semibold>, so if you're shopping your book, give them <Semibold>Read</Semibold> access at a minimum.</p></BookPermissions>
                        <>
                            <div className='text-primary font-bold my-4'>Communes</div>
                            <div className='text-sm -mt-4 mb-4'>Give specific members specific access. You can set it for the whole book, for certain chapters or certain characters; you can even create multiple communes for different situations. Set these up later once you have created the book!</div>
                        </>
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