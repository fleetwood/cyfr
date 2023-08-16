import { Grid } from '@mui/material'
import EditPermission from 'components/containers/Permission/EditPermission'
import BinarySelector from 'components/ui/binarySelect'
import DropdownMenu from 'components/ui/dropdownMenu'
import { MuiCheckIcon, MuiCloseIcon } from 'components/ui/icons'
import Label from 'components/ui/label'
import Semibold from 'components/ui/semibold'
import { DefaultPermissionProps } from 'prisma/maps/permission.map'
import {
  BookStatus,
  PermissionCreateProps,
  Role,
  RoleString,
} from 'prisma/prismaContext'
import { useEffect, useState } from 'react'
import { KeyVal } from 'types/props'
import AdminLayout from '../components/layouts/AdminLayout'
import useDebug from '../hooks/useDebug'
import { uuid } from 'utils/helpers'
import EditRole from 'components/containers/Permission/EditRole'
import MaterialAccordion from 'components/ui/accordion'
import PermissionsExplanation from 'components/containers/Permission/PermissionsExplanation'

const { debug, info, fileMethod } = useDebug('test', 'DEBUG')

const Test = ({}) => {
  const w = 600

  const [visible, setVisible] = useState(false)

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

  const [permission, setPermission] = useState<PermissionCreateProps>(
    DefaultPermissionProps
  )
  const [commune, setCommune] = useState<Role[]>(['NONE'])
  const changeCommune = (perms: RoleString[]) =>
    setCommune(() => perms.flatMap((a) => a) as Role[])

  const defaultPerms: { label: string; perm: Role[] }[] = [
    { label: 'Agent', perm: ['NONE'] },
    { label: 'Artist', perm: ['NONE'] },
    { label: 'Author', perm: ['NONE'] },
    { label: 'Editor', perm: ['NONE'] },
    { label: 'Fan', perm: ['NONE'] },
    { label: 'Follower', perm: ['NONE'] },
    { label: 'Stan', perm: ['NONE'] },
    { label: 'Following', perm: ['NONE'] },
    { label: 'Friend', perm: ['NONE'] },
    { label: 'Member', perm: ['NONE'] },
    { label: 'Commune', perm: commune },
    { label: 'Public', perm: ['NONE'] },
  ]
  const [perms, setPerms] =
    useState<{ label: string; perm: Role[] }[]>(defaultPerms)

  const setPermissions = () => {
    let p = perms
    if (!visible) {
      p = perms.map((p) => {
        return { ...p, perm: ['NONE'] as Role[] }
      })
      setPermission(() => DefaultPermissionProps)
    } else {
      switch (status) {
        case 'DRAFT':
          p = [
            { label: 'Agent', perm: ['NONE'] },
            { label: 'Artist', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Author', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Editor', perm: ['READ', 'SHARE', 'COMMENT', 'FEEDBACK'] },
            { label: 'Fan', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Follower', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Stan', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Following', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Friend', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Member', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Commune', perm: commune },
            { label: 'Public', perm: ['NONE'] },
          ]
          break
        case 'MANUSCRIPT':
          p = [
            { label: 'Agent', perm: ['READ', 'SHARE', 'COMMENT', 'FEEDBACK'] },
            { label: 'Artist', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Author', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Editor', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Fan', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Follower', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Stan', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Following', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Friend', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Member', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Commune', perm: commune },
            { label: 'Public', perm: ['NONE'] },
          ]
          break
        case 'PUBLISHED':
          p = [
            { label: 'Agent', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Artist', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Author', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Editor', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Fan', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Follower', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Stan', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Following', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Friend', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Member', perm: ['READ', 'SHARE', 'COMMENT'] },
            { label: 'Commune', perm: ['NONE'] },
            { label: 'Public', perm: ['READ'] },
          ]
          break
        default:
        case 'PRIVATE':
          p = [
            { label: 'Agent', perm: ['NONE'] },
            { label: 'Artist', perm: ['NONE'] },
            { label: 'Author', perm: ['NONE'] },
            { label: 'Editor', perm: ['NONE'] },
            { label: 'Fan', perm: ['NONE'] },
            { label: 'Follower', perm: ['NONE'] },
            { label: 'Stan', perm: ['NONE'] },
            { label: 'Following', perm: ['NONE'] },
            { label: 'Friend', perm: ['NONE'] },
            { label: 'Member', perm: ['NONE'] },
            { label: 'Commune', perm: commune },
            { label: 'Public', perm: ['NONE'] },
          ]
          break
      }
    }

    setPerms(() => p)
  }

  const PermCheck = ({ role, perm }: { role: Role[]; perm: Role }) => {
    const has = role.find((r) => r === perm) !== undefined
    return (
      <Grid xs className={`text-center ${has ? 'bg-green-500' : 'bg-red-500'}`}>
        {has ? <MuiCheckIcon /> : <MuiCloseIcon />}
      </Grid>
    )
  }

  useEffect(() => {
    setPermissions()
  }, [visible, status, permission, commune])

  return (
    <AdminLayout sectionTitle="InlineTextArea">
      <Grid container>
        <Grid item xs={2}>
          <Label>
            Visibility <PermissionsExplanation />
          </Label>
          <BinarySelector
            left={{ label: 'Public', value: true }}
            right={{ label: 'Private', value: false, variant: 'warning' }}
            value={visible}
            setValue={setVisible}
          />
        </Grid>
        <Grid item xs>
          <Label>Status</Label>
          <DropdownMenu items={statuses} value={status} setValue={setStatus} />
        </Grid>
      </Grid>

      <MaterialAccordion>
        <>
          <Label className="text-accent">Set your own Permissions</Label>
          <div>
            <EditPermission
              className="pb-12"
              permission={permission}
              setPermission={setPermission}
            />
            <EditRole role="Commune" value={commune} setValue={changeCommune}>
              <p>Create your own commune(s)</p>
            </EditRole>
          </div>
        </>
      </MaterialAccordion>

      <MaterialAccordion>
        <>
          <div>
            <h3>Default Permissions</h3>
            <p className="text-sm mt-6 border-b border-neutral border-opacity-50">
              These are the permissions that are applied to each User Type or
              Follower Type by default. You can modify your Permissions
              settings, of course, though in some cases the defaults will take
              precedence.
            </p>
          </div>
          <Grid>
            <Grid item xs={12}>
              <Grid
                container
                columns={16}
                className="font-semibold bg-slate-300 mt-2"
              >
                <Grid item xs={4}>
                  User Type
                </Grid>
                <Grid xs={2} className="text-center">
                  Feed
                </Grid>
                <Grid xs={2} className="text-center">
                  Read
                </Grid>
                <Grid xs={2} className="text-center">
                  Share
                </Grid>
                <Grid xs={2} className="text-center">
                  Comment
                </Grid>
                <Grid xs={2} className="text-center">
                  Feedback
                </Grid>
                <Grid xs={2} className="text-center">
                  Notifications
                </Grid>
              </Grid>

              {perms.map((r: { label: string; perm: Role[] }) => (
                <Grid
                  container
                  columns={16}
                  className="odd:bg-base-200 mt-0.5 hover:text-base-100 hover:bg-sky-500 transition-all duration-200"
                  key={uuid()}
                >
                  <Grid item xs={4}>
                    {r.label} (DEFAULT)
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="READ" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="READ" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="SHARE" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="COMMENT" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="FEEDBACK" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="READ" />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </>

        <>
          <div>
            <h3>Effective Permissions</h3>
            <p className="text-sm mt-6 border-b border-neutral border-opacity-50">
              These are the permissions that are applied to each User Type or
              Follower Type by default. You can modify your Permissions
              settings, of course, though in some cases the defaults will take
              precedence.
            </p>
          </div>
          <Grid>
            <Grid item xs={12}>
              <Grid
                container
                columns={16}
                className="font-semibold bg-slate-300 mt-2"
              >
                <Grid item xs={4}>
                  User Type
                </Grid>
                <Grid xs={2} className="text-center">
                  Feed
                </Grid>
                <Grid xs={2} className="text-center">
                  Read
                </Grid>
                <Grid xs={2} className="text-center">
                  Share
                </Grid>
                <Grid xs={2} className="text-center">
                  Comment
                </Grid>
                <Grid xs={2} className="text-center">
                  Feedback
                </Grid>
                <Grid xs={2} className="text-center">
                  Notifications
                </Grid>
              </Grid>
              {[
                { label: 'Agent', perm: permission.agent },
                { label: 'Artist', perm: permission.artist },
                { label: 'Author', perm: permission.author },
                { label: 'Editor', perm: permission.editor },
                { label: 'Fan', perm: permission.fan },
                { label: 'Follower', perm: permission.follower },
                { label: 'Stan', perm: permission.stan },
                { label: 'Following', perm: permission.following },
                { label: 'Friend', perm: permission.friend },
                { label: 'Member', perm: permission.member },
                { label: 'Commune', perm: commune },
                { label: 'Public', perm: permission.public },
              ].map((r: { label: string; perm: Role[] }) => (
                <Grid
                  container
                  columns={16}
                  className="odd:bg-base-200 mt-0.5 hover:text-base-100 hover:bg-sky-500 transition-all duration-200"
                  key={uuid()}
                >
                  <Grid item xs={4}>
                    {r.label} (EFFECTIVE)
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="READ" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="READ" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="SHARE" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="COMMENT" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="FEEDBACK" />
                  </Grid>
                  <Grid xs>
                    <PermCheck role={r.perm} perm="READ" />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </>
      </MaterialAccordion>
    </AdminLayout>
  )
}

export default Test
