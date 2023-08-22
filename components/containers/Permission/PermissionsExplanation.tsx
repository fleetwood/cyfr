import {MuiQuestionIcon} from 'components/ui/icons'
import Label from 'components/ui/label'
import OpenDialog from 'components/ui/openDialog'
import Semibold from 'components/ui/semibold'
import React from 'react'

const PermissionsExplanation = () => {
  return (
    <OpenDialog
      label={<MuiQuestionIcon />}
      title="VISIBILITY AND STATUS"
      btnClassname="btn-xs text-xs btn-circle"
      content={
        <div>
          <p>
            The Visibility and Status settings operate separately from each
            other, and it's important to understand how you control who can
            interact with your book and when.
          </p>
          <Label className="mt-2">Visibility: HIDDEN</Label>
          <p className="text-sm">
            Your book will show up <Semibold>nowhere</Semibold> on the site
            except in your (and any co-authors) Books, regardless of the book's{' '}
            <Semibold>Status</Semibold> or
            <Semibold>Permissions</Semibold>. It cannot be searched, it cannot
            be read, it cannot be shared, there will be no notifications sent
            when you make an update. Simply put, only the author(s) can see it,
            no matter what.
          </p>
          <Label className="mt-2">Visibility: PUBLIC</Label>
          <p className="text-sm">
            The only people who can interact with your book are those whom you
            give explicit access to in <Semibold>Permissions</Semibold>. Even if
            somebody shares your book, it will still only appear in the feeds of
            others who have permission to see it. The same applies of course to
            Comments, Feedback, et al.
          </p>
          <hr className="mt-2" />
          <Label className="mt-2">Visibility: PUBLIC | Status: PRIVATE</Label>
          <p className="text-sm">
            Your book is visible to your <Semibold>Communes only</Semibold>,
            i.e. only to individual members that you control access to, not to
            entire groups such as Readers or Author. Nor can it be shared and or
            show up in any feeds. Only your Communes will receive notifications
            on updates your book.
          </p>
          <Label className="mt-2">Visibility: PUBLIC | Status: DRAFT</Label>
          <p className="text-sm">
            DRAFTS are a work-in-progress, intended for you to gather comments
            and feedback. Your book will now show up in feeds so that Cyfr users
            can interact with it according to your Permission settings, but
            since DRAFTS are not yet ready to start shopping around for an Agent
            or Publisher,{' '}
            <Semibold>Agents and Publishers cannot see DRAFTS</Semibold> unless
            they are given explicit Permissions.
          </p>
          <Label className="mt-2">
            Visibility: PUBLIC | Status: MANUSCRIPT
          </Label>
          <p className="text-sm">
            Your book has been edited and proofread, and is now a polished
            MANUSCRIPT, ready for Agents and Publishers. At this stage and
            beyond, Comments are still allowed, but Feedback can no longer be
            provided or even visible except by Agents, Publishers, or private{' '}
            <Semibold>Communes</Semibold>.
          </p>
          <Label className="mt-2">Visibility: PUBLIC | Status: PUBLISHED</Label>
          <p className="text-sm">
            A book may not be sold on the Market until it is PUBLIC and
            PUBLISHED. To do so you must provide an ISBN number, and list your
            Publisher (which can of course be "SELF"). Feedback is no longer
            allowed or visible to anybody but the Authors, though anybody who
            buys your book can leave Comments or Share it.
          </p>
        </div>
      }
    />
  )
}

export default PermissionsExplanation