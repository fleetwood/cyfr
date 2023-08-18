import { Box, Grid } from '@mui/material'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { useToast } from 'components/context/ToastContextProvider'
import { Dropzone, TailwindInput, TailwindTextarea } from 'components/forms'
import EZButton from 'components/ui/ezButton'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckmarkIcon,
  MuiBookIcon,
  MuiCoverIcon,
  MuiInfoIcon,
  MuiManageAccountsIcon,
  MuiQuestionIcon,
  SaveIcon,
} from 'components/ui/icons'
import Semibold from 'components/ui/semibold'
import useDebounce from 'hooks/useDebounce'
import useDebug from 'hooks/useDebug'
import {
  Author,
  AuthorStub,
  BookCreateProps,
  BookStatus,
  BookUpsertProps,
  CoverStub,
  Genre,
  GenreStub,
  Image,
  Permission,
  PermissionCreateProps,
  Role,
  RoleString,
  UserStub,
} from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, { useEffect, useState } from 'react'
import { dedupe, now, toSlug, uniqueKey } from 'utils/helpers'
import GenreSelector from '../Genre/GenreSelector'
import UserSelector from '../User/UserSelector'
import EditRole from '../Permission/EditRole'
import BookPermissionsDialog from './BookPermissionsDialog'

import UserAvatar from 'components/ui/avatar/userAvatar'
import BinarySelector from 'components/ui/binarySelect'
import FullScreenDialog from 'components/ui/fullScreenDialog'
import { cloudinary } from 'utils/cloudinary'
import CoverList from '../Cover/CoverList'
import CoverStubView from '../Cover/CoverStubView'
import AuthorAvatar from 'components/ui/avatar/authorAvatar'
import { map } from 'prisma/maps'
import { useRouter } from 'next/router'
import EditPermission from '../Permission/EditPermission'
import Ital from 'components/ui/ital'
import { DefaultPermissionProps } from 'prisma/maps/permission.map'
import Label from 'components/ui/label'
import DropdownMenu from 'components/ui/dropdownMenu'
import { KeyVal } from 'types/props'
import OpenDialog from 'components/ui/openDialog'
import PermissionsExplanation from '../Permission/PermissionsExplanation'

const { debug, info, jsonDialog, jsonBlock } = useDebug(
  'components/containers/Books/CreateBook',
  'DEBUG'
)

const CreateBook = () => {
  const { cyfrUser } = useApi.cyfrUser()
  const { notify, notifyError } = useToast()
  const { isTitleUnique, create: createBook } = useApi.book()
  const { upsert: upsertCover } = useApi.cover()
  const router = useRouter()

  // PROPS
  const [title, setTitle] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [prospect, setProspect] = useState(false)
  const [fiction, setFiction] = useState(true)

  const statuses: KeyVal[] = [
    {
      key: 'PRIVATE',
      description: (
        <span className="text-xs">
          This is a failsafe for the Public/Private setting.
          <br /> Making extra sure your work is not visible unless you want it
          to be.
        </span>
      ),
    },
    {
      key: 'DRAFT',
      description: (
        <span className="text-xs">
          This is a work in progress, and <Semibold>will</Semibold> change.
          <br /> Agents cannot see DRAFTS unless you give them explicit access.
        </span>
      ),
    },
    {
      key: 'MANUSCRIPT',
      description: (
        <span className="text-xs">
          This is a completed work: edited, proofread and{' '}
          <Semibold>ready for publication</Semibold>.<br /> Many agents prefer a
          polished manuscript.
        </span>
      ),
    },
    {
      key: 'PUBLISHED',
      description: (
        <span className="text-xs">Congratulations! You did it!</span>
      ),
    },
  ]
  const [status, setStatus] = useState<BookStatus>('DRAFT')

  const [cover, setCover] = useState<CoverStub | null>(null)
  const [genre, setGenre] = useState<Genre>()
  // const [categories, setCategories] = useState<BookCategory[]>(book?.categories || [])
  const [hook, setHook] = useState<string | null>(null)
  const [synopsis, setSynopsis] = useState<string | null>(null)
  const [back, setBack] = useState<string | null>(null)
  const [authors, setAuthors] = useState<AuthorStub[]>([
    cyfrUser.author as AuthorStub,
  ])
  const [completeAt, setCompleteAt] = useState<Date>()
  const [permission, setPermission] = useState<PermissionCreateProps>(
    DefaultPermissionProps
  )

  const [titleError, setTitleError] = useState<string>()
  const [titleOK, setTitleOK] = useState(false)
  const checkTitle = useDebounce({ value: title, ms: 500 })
  const checkUnique = async () => {
    setTitleOK(() => false)
    if (checkTitle === null || checkTitle!.trim().length <= 0) {
      setTitleError(() => 'Title is required')
      return
    }
    setTitleError(() => undefined)
    const isUnique = await isTitleUnique(checkTitle!)
    debug('checkUnique', { title, checkTitle, isUnique })
    if (!isUnique || isUnique !== true) {
      setTitleError(() => 'Title is not unique!')
    } else if (isUnique === true) {
      setTitleOK(() => true)
    }
  }

  useEffect(() => {
    checkUnique()
  }, [checkTitle])

  const addAuthor = (user: AuthorStub) =>
    setAuthors((a) => dedupe([...a, user], 'id'))
  const removeAuthor = (user: AuthorStub) => {
    if (user.user.id === cyfrUser.id) return // can't remove yourself
    // dedupe so can't add more than once
    setAuthors((a) =>
      dedupe(
        a?.filter((a) => a.id !== user.id),
        'id'
      )
    )
  }

  // const [characters, setCharacters] = useState<Character[]>(book?.characters || [])
  // const [gallery, setGallery] = useState<GalleryStub | null>(book?.gallery || null)
  const [images, setImages] = useState()

  const upsertProps = {
    ownerId: cyfrUser?.id,
    genreId: genre?.id,
    coverId: cover?.id,
    title: title,
    visible,
    fiction,
    prospect,
    status,
    permission,
    authors: authors,
    completeAt,
    back: back ?? undefined,
    hook: hook ?? undefined,
    synopsis: synopsis ?? undefined,
  }

  const [activeStep, setActiveStep] = React.useState(0)
  const stepClassName = (index: number) =>
    'cursor-pointer hover:text-base-100 ' +
    (index === activeStep
      ? 'text-base-100'
      : index > activeStep
      ? 'text-info'
      : 'text-base-100 text-opacity-50')
  const showStep = (step: number) => (step === activeStep ? 'inline' : 'hidden')
  const steps = [
    { label: 'Name', icon: <MuiBookIcon /> },
    { label: 'About', icon: <MuiInfoIcon /> },
    { label: 'Access', icon: <MuiManageAccountsIcon /> },
    { label: 'Cover', icon: <MuiCoverIcon /> },
    { label: 'Review', icon: <MuiQuestionIcon /> },
  ]

  const { findCover } = useApi.cover()
  const [covers, setCovers] = useState<CoverStub[]>([])

  const [showCoverSelect, setShowCoverSelect] = useState(cover === undefined)
  const onCoverSelected = async (cover: CoverStub) => {
    debug('onCoverSelected', cover)
    setCover(() => cover)
    setShowCoverSelect(() => false)
  }

  const onCoverImageAdded = async (files: Image[]) => {
    const image = files[0]
    debug('onCoverImageAdded', { files, image })
    const uploadedCover = await upsertCover({
      creatorId: cyfrUser.id,
      imageId: image.id,
      visible: true,
      exclusive: true, // ths is the user's own cover, nobody else can use it
      description: title ?? image.title ?? undefined,
    })
    if (uploadedCover) {
      debug('success', { uploadedCover })
      setCover(() => uploadedCover)
      setShowCoverSelect(() => false)
      notify('Your cover has been added! Bellissimo!')
      return
    }
    notifyError()
  }

  const onGenreSelect = async (genre: Genre | GenreStub) => {
    debug('onGenreSelect', genre)
    notify(genre ? `Genre selected ${genre}` : 'All genres selected')
    setGenre(() => genre)
    const genreCovers = await findCover(genre?.title ?? 'All')
    if (genreCovers) {
      setCovers(() => genreCovers)
    }
  }

  const onSaveBook = async () => {}

  const saveBook = async () => {
    const props = {
      ...upsertProps,
      authors: map.toAuthor(upsertProps.authors),
    } as BookCreateProps
    debug('saveBook', props)
    const result = await createBook(props)
    if (result) {
      notify(`Created ${title}! Happy writing!!`)
      router.push(`/book/${toSlug(props.title)}`)
    } else {
      debug('Did not get right result?', { upsertProps, result })
      notifyError()
    }
  }

  const Summary = ({
    label,
    children,
  }: {
    label: string
    empty?: boolean
    children?: React.ReactNode
  }) => (
    <Grid container spacing={2}>
      <Grid item xs={2} className="font-semibold">
        {label}
      </Grid>
      <Grid item xs={8}>
        {children ?? (
          <span className="italic text-info opacity-50">Not Provided</span>
        )}
      </Grid>
    </Grid>
  )

  const StepItem = ({
    index,
    children,
  }: {
    index: number
    children: React.ReactNode
  }) => (
    <div onClick={() => setActiveStep(index)} className={stepClassName(index)}>
      {children}
    </div>
  )

  return (
    <FullScreenDialog
      openLabel="Start a Book"
      scroll="paper"
      menu={
        <Grid container flexGrow={1} flexDirection="column">
          {/* STEPPER */}
          <div className="py-2 mt-1">
            <Stepper alternativeLabel activeStep={activeStep}>
              {steps.map((step, index) => (
                <Step key={index + '-' + step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <StepItem index={index}>{step.icon}</StepItem>
                    )}
                  >
                    <StepItem index={index}>{step.label}</StepItem>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          {/* NAVBAR */}
          <div className="flex justify-evenly mt-1 py-2">
            <EZButton
              className={(activeStep > 0 ? 'inline' : 'hidden') + ' btn-sm'}
              label={ArrowLeftIcon}
              onClick={() => setActiveStep(activeStep - 1)}
            />
            <Box sx={{ flex: '1 1 auto' }} />
            {jsonDialog(upsertProps)}
            <EZButton
              className={(activeStep < 4 ? 'inline' : 'hidden') + ' btn-sm'}
              label={ArrowRightIcon}
              onClick={() => setActiveStep(activeStep + 1)}
            />
            <EZButton
              className={(activeStep == 4 ? 'inline' : 'hidden') + ' btn-sm'}
              label={SaveIcon}
              onClick={saveBook}
            />
          </div>
        </Grid>
      }
    >
      <Box>
        {/* Name And Author */}
        <div className={`${showStep(0)} flex flex-col space-y-2`}>
          <h3 className="mt-2">Name and Author</h3>
          <Box className="flex flex-col">
            <p className="text-sm mt-4">
              Give your book a{' '}
              <span className="font-semibold">unique name.</span>
            </p>
            <TailwindInput
              type="text"
              value={title}
              setValue={setTitle}
              label="Title"
              error={titleError}
            />
            <span className={titleOK ? 'text-success' : 'opacity-0'}>
              {CheckmarkIcon}
            </span>
            <p className="text-sm mt-4">
              If you're co-authoring with another member of{' '}
              <Semibold>Cyfr</Semibold>, add them here. Note: this person will
              have{' '}
              <span className="font-semibold">
                full access and privileges to the book
              </span>
              , so you have to be friends (as in: you Follow each other). Would
              be kinda weird otherwise.
            </p>
            <Grid>
              {authors?.map((a) => (
                <AuthorAvatar
                  className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200"
                  sz="sm"
                  author={a}
                  onClick={() => removeAuthor(a)}
                  variant={['no-profile']}
                />
              ))}
              <UserSelector
                id={cyfrUser.id}
                label="Authors"
                onClick={addAuthor}
                userTypes={['Author']}
                followerTypes={['Friends']}
                returnType={'Author'}
              />
            </Grid>
          </Box>
        </div>

        {/* Hook and Back Panel */}
        <div className={showStep(1)}>
          <h3 className="mt-2">Entice your audience!</h3>
          <Box className="flex flex-col">
            <p className="text-sm mt-4">
              A short blurb to tease the book to readers.
            </p>
            <TailwindTextarea
              value={hook}
              setValue={setHook}
              label="Hook"
              required={false}
            />
            <p className="text-sm mt-4">
              The summary that goes on the back cover. You may not have this
              yet, but if you do, great!
            </p>
            <TailwindTextarea
              value={back}
              setValue={setBack}
              label="Back Panel"
              required={false}
            />
          </Box>
        </div>

        {/* Permissions */}
        <div className={showStep(2)}>
          <Grid container>
            <Grid columns={3}>
              <h3>Share it or Not</h3>
            </Grid>
            <Grid flexGrow={1} />
            <Grid columns={6} justifyItems={'flex-end'}>
              <BookPermissionsDialog />
            </Grid>
          </Grid>

          <Grid container columnSpacing={1}>
            <Grid item xs={6}>
              <div className="flex">
                <Label>
                  <h3 className="text-neutral">Visibility and Status</h3>
                </Label>
                <PermissionsExplanation />
              </div>
              <div>
                <Label>Visibility</Label>
                <BinarySelector
                  left={{ label: 'Public', value: true }}
                  right={{ label: 'Hidden', value: false, variant: 'warning' }}
                  value={visible}
                  setValue={setVisible}
                />
              </div>

              <div>
                <Label>Status</Label>
                <p className="text-sm">Where are you in the writing process?</p>
                <DropdownMenu
                  className="border border-neutral border-opacity-50"
                  items={statuses}
                  value={status}
                  setValue={setStatus}
                />
              </div>
            </Grid>

            <Grid item xs={6}>
              <EditPermission
                label={<h3 className="text-neutral">Permissions</h3>}
                className="pb-12"
                value={permission}
                setValue={setPermission}
              />
            </Grid>
          </Grid>
        </div>

        {/* Genre and Cover */}
        <div className={showStep(3)}>
          <h3>Genre and Cover</h3>
          <GenreSelector genre={genre} setGenre={onGenreSelect} />
          <label className="pt-2 font-semibold text-primary">
            Fiction/Non-fiction
          </label>
          <BinarySelector
            spacing={2}
            value={fiction}
            setValue={setFiction}
            left={{ label: 'Fiction', variant: 'secondary' }}
            right={{ label: 'Non-Fiction', variant: 'secondary' }}
          />
          {genre && (
            <Grid>
              <label className="pt-2 font-semibold text-primary">Cover</label>
              {cover && (
                <div>
                  <img
                    src={cloudinary.resize({
                      url: cover.image.url,
                      height: 320,
                    })}
                    srcSet={cloudinary.resize({
                      url: cover.image.url,
                      height: 320,
                    })}
                    alt={cover.creator?.name}
                    loading="eager"
                  />
                </div>
              )}
              <div>
                <EZButton
                  label={cover ? 'Change' : 'Find or Create Your Cover!'}
                  onClick={() => setShowCoverSelect((s) => !s)}
                />
              </div>
              {showCoverSelect && (
                <div>
                  <Dropzone limit={1} onDropComplete={onCoverImageAdded} />
                  {covers && covers.length > 0 && (
                    <span>OR choose from the following</span>
                  )}
                  {covers && covers.length > 0 && (
                    <CoverList
                      covers={covers}
                      height={174}
                      onSelect={onCoverSelected}
                    />
                  )}
                  {!covers ||
                    (covers.length < 1 && (
                      <div>
                        Sorry, there are no covers available for this genre.{' '}
                        <Semibold>TODO: allow default cover</Semibold>
                      </div>
                    ))}
                </div>
              )}
            </Grid>
          )}
        </div>

        {/* Review and Save */}
        <div className={`${showStep(4)} flex flex-col`}>
          <h3>All Good?</h3>
          <div className="flex flex-col space-y-2 pl-2 border">
            <Summary label="Title">
              <h2>{title}</h2>
            </Summary>
            {/* <Summary label={`Author${authors.length > 1 ? 's' : ''}`}>
              {authors.map((u: UserStub) => (
                <div className="flex rounded-full border border-primary max-w-fit p-0 pr-2">
                  <UserAvatar
                    user={u}
                    sz="xs"
                    variant={['no-profile', 'no-link']}
                  />
                  <span className="font-semibold text-sm text-primary pl-2">
                    {u.name}
                  </span>
                </div>
              ))}
            </Summary> */}
            <Summary label="Genre">{genre?.title}</Summary>
            <Summary label="Cover">
              {cover ? (
                <CoverStubView cover={cover} height={160} />
              ) : (
                'None selected'
              )}
            </Summary>
            <Summary label="Hook">{hook}</Summary>
            <Summary label="Back Panel">{back}</Summary>
            <Summary label="Permissions">
              <Summary label="Agents">
                {permission.agent.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Editors">
                {permission.editor.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Authors">
                {permission.author.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Artists">
                {permission.artist.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Members">
                {permission.member.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Public">
                {permission.public.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>

              <Summary label="Friends">
                {permission.friend.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Stans">
                {permission.stan.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Following">
                {permission.following.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Fans">
                {permission.fan.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
              <Summary label="Followers">
                {permission.follower.map((r: Role) => (
                  <span className="px-2">{r}</span>
                ))}
              </Summary>
            </Summary>
          </div>

          <div></div>
        </div>
      </Box>
    </FullScreenDialog>
  )
}

export default CreateBook
