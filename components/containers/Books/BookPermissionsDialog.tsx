import { DialogFooter } from '@material-tailwind/react'
import {
    Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import EZButton from 'components/ui/ezButton'
import { XIcon } from 'components/ui/icons'
import Semibold from 'components/ui/semibold'
import React from 'react'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />
})

const BookPermissionsDialog = () => {
  const [open, setOpen] = React.useState(false)
  const [whichDialog, setWhichDialog] = React.useState('')
  const toggleDialog = (setTo = !open) => {
    setOpen(setTo)
  }
  const openDialog = (which: string) => {
    setWhichDialog(() => which)
    toggleDialog(true)
  }

  return (
    <>
      <Grid container columns={12}>
        <Grid xs={4}>
          <span className="text-sm">What do each of the permissions mean?</span>
        </Grid>
        <Grid xs={2}>
          <EZButton
            label="READ"
            className='btn-sm'
            onClick={() => openDialog('READ')}
            variant="info"
            />
        </Grid>
        <Grid xs={2}>
          <EZButton
            label="SHARE"
            className='btn-sm'
            onClick={() => openDialog('SHARE')}
            variant="info"
            />
        </Grid>
        <Grid xs={2}>
          <EZButton
            label="COMMENT"
            className='btn-sm'
            onClick={() => openDialog('COMMENT')}
            variant="info"
            />
        </Grid>
        <Grid xs={2}>
          <EZButton
            label="FEEDBACK"
            className='btn-sm'
            onClick={() => openDialog('FEEDBACK')}
            variant="info"
          />
        </Grid>
      </Grid>

      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => toggleDialog()}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Box className='flex justify-evenly'>
                <>{whichDialog}</>
                <Box sx={{ flex: '1 1 auto' }} />
                <EZButton label={XIcon} variant='secondary' className='btn-sm btn-circle text-base-content -mt-2 -mr-4' onClick={() => toggleDialog()}/>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className="flex flex-col space-y-3">
                {whichDialog === 'READ' && (
                  <>
                    <p>
                      This allows viewing of your book, regardless of its
                      current status, whether DRAFT, MANUSCRIPT or otherwise.
                    </p>
                    <p>
                      If another member Shares your book, it will show up in
                      this person's feed, but does not convey Share privileges.
                      Just reading.
                    </p>
                    <p>
                      This includes all visible Chapters, Characters and
                      Galleries.
                    </p>
                  </>
                )}
                {whichDialog === 'SHARE' && (
                  <>
                    <p>
                      This allows the member to share your book on{' '}
                      <Semibold>Cyfr</Semibold>.
                    </p>
                    <p>
                      Shares show up in feeds throughout the site, which will
                      provide a link to those with <Semibold>READ</Semibold>{' '}
                      access to follow.
                    </p>
                    <p>
                      Note that you can't prohibit from copying your book's url
                      and sharing it somewhere else on the internet. But if you
                      don't allow <Semibold>READ</Semibold> access to the
                      public, then anybody who follows an external link to your
                      book will still be prohibited from seeing it.
                    </p>
                    <p>
                      This includes all visible Chapters, Characters and
                      Galleries.
                    </p>
                  </>
                )}
                {whichDialog === 'COMMENT' && (
                  <>
                    <p>
                      This allows a reader to leave a comment on a selection of
                      your <Semibold>Book, Chapter, Character, etc</Semibold>.
                      It's great for getting quick responses/reactions from your
                      readers.
                    </p>
                    <p>
                      It allows the reader to see comments left by others, and
                      participate in comment threads as well. Readers who do not
                      have <Semibold>COMMENT</Semibold> access will not be able
                      add comments, nor see comment threads.
                    </p>
                    <p>
                      Comments are available regardless of the book's{' '}
                      <Semibold>status</Semibold>.
                    </p>
                    <p>
                      This includes all visible Chapters, Characters and
                      Galleries.
                    </p>
                  </>
                )}
                {whichDialog === 'FEEDBACK' && (
                  <>
                    <p>
                      Feedback is a way of getting responses tailored to the
                      craft of writing.
                    </p>
                    <p>
                      For <Semibold>Readers and Friends</Semibold>, Feedback is
                      only available in{' '}
                      <Semibold>DRAFTS and MANUSCRIPTS</Semibold>
                    </p>
                    <p>
                      <Semibold>Agents</Semibold> can see and provide Feedback
                      in <Semibold>SUBMISSIONS</Semibold> as well.
                    </p>
                    <p>
                      Once a book is <Semibold>PUBLISHED</Semibold>, Feedback is
                      no longer available to anybody except for the book's{' '}
                      <Semibold>Authors</Semibold>.
                    </p>
                    <p>
                      This includes all visible Chapters, Characters and
                      Galleries.
                    </p>
                  </>
                )}
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default BookPermissionsDialog