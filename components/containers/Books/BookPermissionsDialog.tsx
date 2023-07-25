import {
    Grid
} from '@mui/material'
import OpenDialog from 'components/ui/openDialog'
import Semibold from 'components/ui/semibold'
import useDebug from 'hooks/useDebug'
import React from 'react'

const {debug} = useDebug('BookPermissionsDialog','DEBUG')

const BookPermissionsDialog = () => (
    <>
      <Grid container columns={12}>
        <Grid columns={4}>
          <span className="text-sm">What do each of the permissions mean?</span>
        </Grid>
        <Grid columns={2}>
          <OpenDialog
            label="READ"
            title="READ"
            content={
              <>
                <p>
                  This allows viewing of your book, regardless of its current
                  status, whether DRAFT, MANUSCRIPT or otherwise.
                </p>
                <p>
                  If another member Shares your book, it will show up in this
                  person's feed, but does not convey Share privileges. Just
                  reading.
                </p>
                <p>
                  This includes all visible Chapters, Characters and Galleries.
                </p>
                <p>Note that all of the subsequent permissions, <Semibold>SHARE, COMMENT and FEEDBACK</Semibold> require READ. If you enable one of them, READ will also be enabled. Conversely, if you disable READ, it will disable the others.</p>
              </>
            }
          />
        </Grid>
        <Grid columns={2}>
          <OpenDialog
            direction='left'
            label="SHARE"
            title="SHARE"
            content={
              <>
                <p>
                  This allows the member to share your book on{' '}
                  <Semibold>Cyfr</Semibold>.
                </p>
                <p>
                  Shares show up in feeds throughout the site, which will
                  provide a link to those with <Semibold>READ</Semibold> access
                  to follow.
                </p>
                <p>
                  Note that you can't prohibit from copying your book's url and
                  sharing it somewhere else on the internet. But if you don't
                  allow <Semibold>READ</Semibold> access to the public, then
                  anybody who follows an external link to your book will still
                  be prohibited from seeing it.
                </p>
                <p>
                  This includes all visible Chapters, Characters and Galleries.
                </p>
              </>
            }
          />
        </Grid>
        <Grid columns={2}>
          <OpenDialog
            direction='right'
            label="COMMENT"
            title="COMMENT"
            content={
              <>
                <p>
                  This allows a reader to leave a comment on a selection of your{' '}
                  <Semibold>Book, Chapter, Character, etc</Semibold>. It's great
                  for getting quick responses/reactions from your readers.
                </p>
                <p>
                  It allows the reader to see comments left by others, and
                  participate in comment threads as well. Readers who do not
                  have <Semibold>COMMENT</Semibold> access will not be able add
                  comments, nor see comment threads.
                </p>
                <p>
                  Comments are available regardless of the book's{' '}
                  <Semibold>status</Semibold>.
                </p>
                <p>
                  This includes all visible Chapters, Characters and Galleries.
                </p>
              </>
            }
          />
        </Grid>
        <Grid columns={2}>
          <OpenDialog
            direction='down'
            label="FEEDBACK"
            title="FEEDBACK"
            content={
              <>
                <p>
                  Feedback is a way of getting responses tailored to the craft
                  of writing.
                </p>
                <p>
                  For <Semibold>Readers and Friends</Semibold>, Feedback is only
                  available in <Semibold>DRAFTS and MANUSCRIPTS</Semibold>
                </p>
                <p>
                  <Semibold>Agents</Semibold> can see and provide Feedback in{' '}
                  <Semibold>SUBMISSIONS</Semibold> as well.
                </p>
                <p>
                  Once a book is <Semibold>PUBLISHED</Semibold>, Feedback is no
                  longer available to anybody except for the book's{' '}
                  <Semibold>Authors</Semibold>.
                </p>
                <p>
                  This includes all visible Chapters, Characters and Galleries.
                </p>
              </>
            }
          />
        </Grid>
      </Grid>
    </>
  )

export default BookPermissionsDialog
