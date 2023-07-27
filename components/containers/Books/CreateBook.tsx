import { Box, Grid } from '@mui/material'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { useToast } from 'components/context/ToastContextProvider'
import { TailwindInput, TailwindTextarea } from 'components/forms'
import EZButton from 'components/ui/ezButton'
import { ArrowLeftIcon, ArrowRightIcon, CheckmarkIcon, CyfrLogo, SaveIcon } from 'components/ui/icons'
import Semibold from 'components/ui/semibold'
import useDebug from 'hooks/useDebug'
import { Genre, Image, Permission, Role, RoleString, RoleVals, UserStub, getRoles } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, { useEffect, useState } from 'react'
import { dedupe, now, uniqueKey } from 'utils/helpers'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
import GenreSelector from '../Genre/GenreSelector'
import UserSelector from '../User/UserSelector'
import BookPermissions from './BookPermissions'
import BookPermissionsDialog from './BookPermissionsDialog'
import ModalCheckbox, { ModalCloseButton, ModalOpenButton } from 'components/ui/modalCheckbox'
import useDebounce from 'hooks/useDebounce'
import Avatar from 'components/ui/avatar'

const {debug, info, jsonDialog} = useDebug("components/containers/Books/CreateBook",'DEBUG')
const createBookModal = 'createBookModal'

export const CreateBookModalButton = () => (
    <ModalOpenButton id={createBookModal} className='btn btn-info space-x-2' variant='component'>
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">New Book!</span>
    </ModalOpenButton>
)

const CreateBook = () => {
    const {notify} = useToast()
    const {isTitleUnique} = useApi.book()

    const [title, setTitle] = useState<string|null>(null)
    const [visible, setVisible] = useState(false)
    const [prospect, setProspect] = useState(false)
    const [fiction, setFiction] = useState()
    const [status, setStatus] = useState()
    const [cover, setCover] = useState()
    const [genreId, setGenreId] = useState()
    const [genre, setGenre] = useState<Genre>()
    // const [categories, setCategories] = useState<BookCategory[]>(book?.categories || [])
    const [hook, setHook] = useState<string|null>(null)
    const [synopsis, setSynopsis] = useState<string|null>(null)
    const [back, setBack] = useState<string|null>(null)
    const [authors, setAuthors] = useState<UserStub[]>([])
    const [permissions, setPermissions] = useState<Permission>({
        id: uniqueKey(),
        createdAt: now(),
        updatedAt: now(),
        agent : ['NONE'],
        fan : ['NONE'],
        follower : ['NONE'],
        friend : ['NONE'],
        member: ['NONE'],
        public: ['NONE']
    })
    
    const changeAgent = (perms:RoleString[]) => setPermissions(() => {return {...permissions, agent: perms.flatMap(a => a) as Role[]}})
    const changeArtist = (perms:RoleString[]) => setPermissions(() => {return {...permissions, artist: perms.flatMap(a => a) as Role[]}})
    const changeAuthor = (perms:RoleString[]) => setPermissions(() => {return {...permissions, author: perms.flatMap(a => a) as Role[]}})
    const changeEditor = (perms:RoleString[]) => setPermissions(() => {return {...permissions, editor: perms.flatMap(a => a) as Role[]}})
    const changeMember = (perms:RoleString[]) => setPermissions(() => {return {...permissions, member: perms.flatMap(a => a) as Role[]}})
    const changePublic = (perms:RoleString[]) => setPermissions(() => {return {...permissions, public: perms.flatMap(a => a) as Role[]}})
    const changeReader = (perms:RoleString[]) => setPermissions(() => {return {...permissions, reader: perms.flatMap(a => a) as Role[]}})
    
        const [titleError, setTitleError] = useState<string>()
    const [titleOK, setTitleOK] = useState(false)
    const checkTitle = useDebounce({value: title, ms: 500})
    const checkUnique = async () => {
        setTitleOK(() => false)
        if (checkTitle===null||checkTitle!.trim().length<=0) {
            setTitleError(() => 'Title is required')
            return
        }
        setTitleError(() => undefined)
        const isUnique = await isTitleUnique(checkTitle!)
        debug('checkUnique', {title, checkTitle, isUnique})
        if (!isUnique || isUnique !== true) {
            setTitleError(() => 'Title is not unique!')
        }
        else if (isUnique===true) {
            setTitleOK(() => true)
        }
    }

    useEffect(() => {
        checkUnique()
    }, [checkTitle])
    
    const addAuthor = (user:any) => setAuthors((a) => dedupe([...a, user], 'id'))
    const removeAuthor = (user:UserStub) => setAuthors((a) => a?.filter(a => a.id !== user.id))
    
    // const [characters, setCharacters] = useState<Character[]>(book?.characters || [])
    // const [gallery, setGallery] = useState<GalleryStub | null>(book?.gallery || null)
    const [images, setImages] = useState()

    const upsertProps = {
        title,
        visible,
        prospect,
        fiction,
        status,
        cover,
        genreId,
        genre,
        hook,
        synopsis,
        back,
        authors,
        permissions
    }

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const handleReset = () => setActiveStep(0)

  const showStep = (step:number) => step === activeStep ? 'inline' : 'hidden'

  const steps = ['Name', 'About', 'Access', 'Cover', 'Review']

  const {findCover} = useApi.cover()
  const [coversByGenre, setByGenre] = useState<string>()
  const [covers, setCovers] = useState<Image[]>([])
  const onGenreSelect = (genre:string) => {
    debug('onGenreSelect', genre)
    notify(genre ? `Genre selected ${genre}` : 'All genres selected')
    setByGenre(() => genre)
  }

  const getCovers = async () => {
    debug('getCovers', {coversByGenre})
    const found = await findCover(coversByGenre === 'All' ? '' : coversByGenre)
    if (found) {
      setCovers(() => found.map(c => c.image))
    } else {
      info('No covers found')
    }
  }

  useEffect(() => {
    getCovers()
  }, ['',coversByGenre])

  return (
    <>
    <ModalCheckbox id={createBookModal} />
    <div className="modal modal-middle">
      <div className="modal-box min-w-full min-h-screen bg-black bg-opacity-20 shadow-none overflow-visible scrollbar-hide">
        <ModalCloseButton id={createBookModal} />
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
                        <TailwindInput type='text' value={title} setValue={setTitle} label='Title' error={titleError} />
                        <span className={titleOK ? 'text-success' : 'opacity-0'}>{CheckmarkIcon}</span>
                        <p className='text-sm mt-4'>If you're co-authoring with another member of <Semibold>Cyfr</Semibold>, add them here. Note: this person will have <span className='font-semibold'>full access and privileges to the book</span>, so you have to be friends (as in: you Follow each other). Would be kinda weird otherwise.</p>
                        <Grid>
                            {authors?.map(a => 
                                <Avatar className='opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200' 
                                    sz='sm' 
                                    user={a} 
                                    onClick={() => removeAuthor(a)} 
                                    variant={['no-profile']} 
                                />
                            )}
                            <UserSelector label='Authors' onClick={addAuthor} select='UserStub' />
                        </Grid>
                    </Box>
                </div>

                <div className={showStep(1)}>
                    <h3 className='mt-2'>Entice your audience!</h3>
                    <Box className='flex flex-col'>
                        <p className='text-sm mt-4'>A short blurb to tease the book to readers.</p>
                        <TailwindTextarea value={hook} setValue={setHook} label='Hook' required={false} />
                        <p className='text-sm mt-4'>The summary that goes on the back cover. You may not have this yet, but if you do, great!</p>
                        <TailwindTextarea value={back} setValue={setBack} label='Back Panel' required={false} />
                    </Box>
                </div>
                <div className={showStep(2)}>
                    <div className='flex mt-2'>
                        <Grid container columns={12}>
                            <Grid columns={6}><h3>Share it or Not</h3></Grid>
                            <Grid columns={6}><BookPermissionsDialog /></Grid>
                        </Grid>
                    </div>
                    <Box className='flex flex-col'>
                        <BookPermissions level='Agents' onChange={changeAgent}><p>This will allow agents to interact with your book. This inlcudes <Semibold>submissions</Semibold>, so if you're shopping your book, give them <Semibold>Read</Semibold> access at a minimum.</p></BookPermissions>
                        <BookPermissions level='Author' onChange={changeAuthor}><p></p></BookPermissions>
                        <BookPermissions level='Artist' onChange={changeArtist}><p></p></BookPermissions>
                        <BookPermissions level='Editors' onChange={changeEditor}><p>Are you shopping for a good editor? Join the club! Better yet, invite them to yours! :)</p></BookPermissions>
                        <BookPermissions level='Members' onChange={changeMember}><p>This is anybody who is <Semibold>logged in</Semibold> to the site, which will exclude bots and search engines.</p></BookPermissions>
                        <BookPermissions level='Public' onChange={changePublic}><p>This is anybody who visits the site, including <Semibold>bots and search engines</Semibold>.</p></BookPermissions>
                        <BookPermissions level='Reader' onChange={changeReader}><p></p></BookPermissions>
                        {/* <BookPermissions level='Friends' onChange={changeFriend}><p>Only members who you <Semibold>mutually follow</Semibold>; meaning you follow them and they follow you back.</p></BookPermissions> */}
                        <>
                            <div className='text-primary font-bold my-4'>Communes</div>
                            <div className='text-sm -mt-4 mb-4'>Give specific members specific access. You can set it for the whole book, for certain chapters or certain characters; you can even create multiple communes for different situations. Set these up later once you have created the book!</div>
                        </>
                    </Box>

                </div>
                <div className={showStep(3)}>
                    <h3>Genre and Cover</h3>
                    <GenreSelector allowAll={true} genre={genre} setGenre={() => onGenreSelect} sendTitle={true} />
                    <GalleryPhotoswipe images={covers} onClick={setCover} />
                </div>
                <div className={showStep(4)}>
                    <h3>All Good?</h3>
                </div>
            </Box>
            
            <Box className='flex justify-evenly mt-8'>
                <EZButton className={activeStep>0 ? 'inline' : 'hidden'} label={ArrowLeftIcon} onClick={() => setActiveStep(activeStep-1)} />
                <Box sx={{ flex: '1 1 auto' }} />
                {jsonDialog(upsertProps)}
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

