import {Grid} from '@mui/material'
import EditPermission from 'components/containers/Permission/EditPermission'
import EditRole from 'components/containers/Permission/EditRole'
import PermissionsExplanation from 'components/containers/Permission/PermissionsExplanation'
import BinarySelector from 'components/ui/binarySelect'
import DropdownMenu from 'components/ui/dropdownMenu'
import {MuiCheckIcon,MuiCloseIcon} from 'components/ui/icons'
import Label from 'components/ui/label'
import Semibold from 'components/ui/semibold'
import {
  DefaultEffectivePermissionProps,
  DefaultPermissionProps,
} from 'prisma/maps/permission.map'
import {
  BookStatus,
  PermissionCreateProps,
  Role
} from 'prisma/prismaContext'
import {useEffect,useState} from 'react'
import {KeyVal} from 'types/props'
import AdminLayout from '../components/layouts/AdminLayout'
import useDebug from '../hooks/useDebug'

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

  const [defaultPermissions, setDefaultPermissions] =
    useState<PermissionCreateProps>(DefaultPermissionProps)
  const [effectivePermissions, setEffectivePermissions] =
    useState<PermissionCreateProps>(DefaultEffectivePermissionProps)
  const [allowedRoles, setAllowedRoles] = useState(DefaultEffectivePermissionProps)

  const [commune, setCommune] = useState<Role[]>([])

  const setPermissions = () => {
    let p = DefaultPermissionProps
    if (visible) {
      switch (status) {
        case 'DRAFT':
          p = {
            agent: [],
            artist: ['READ', 'SHARE', 'COMMENT'],
            author: ['READ', 'SHARE', 'COMMENT'],
            editor: ['READ', 'SHARE', 'COMMENT', 'FEEDBACK'],
            fan: ['READ', 'SHARE', 'COMMENT'],
            follower: ['READ', 'SHARE', 'COMMENT'],
            stan: ['READ', 'SHARE', 'COMMENT'],
            following: ['READ', 'SHARE', 'COMMENT'],
            friend: ['READ', 'SHARE', 'COMMENT'],
            member: ['READ', 'SHARE', 'COMMENT'],
            public: [],
          }
          break
        case 'MANUSCRIPT':
          p = {
            agent: ['READ', 'SHARE', 'COMMENT', 'FEEDBACK'],
            artist: ['READ', 'SHARE', 'COMMENT'],
            author: ['READ', 'SHARE', 'COMMENT'],
            editor: ['READ', 'SHARE', 'COMMENT', 'FEEDBACK'],
            fan: ['READ', 'SHARE', 'COMMENT'],
            follower: ['READ', 'SHARE', 'COMMENT'],
            stan: ['READ', 'SHARE', 'COMMENT'],
            following: ['READ', 'SHARE', 'COMMENT'],
            friend: ['READ', 'SHARE', 'COMMENT'],
            member: ['READ', 'SHARE', 'COMMENT'],
            public: [],
          }
          break
        case 'PUBLISHED':
          p = {
            agent: ['READ', 'SHARE', 'COMMENT'],
            artist: ['READ', 'SHARE', 'COMMENT'],
            author: ['READ', 'SHARE', 'COMMENT'],
            editor: ['READ', 'SHARE', 'COMMENT'],
            fan: ['READ', 'SHARE', 'COMMENT'],
            follower: ['READ', 'SHARE', 'COMMENT'],
            stan: ['READ', 'SHARE', 'COMMENT'],
            following: ['READ', 'SHARE', 'COMMENT'],
            friend: ['READ', 'SHARE', 'COMMENT'],
            member: ['READ', 'SHARE', 'COMMENT'],
            public: ['READ'],
          }
          break
        default:
        case 'PRIVATE':
          p = {
            agent: [],
            artist: [],
            author: [],
            editor: [],
            fan: [],
            follower: [],
            stan: [],
            following: [],
            friend: [],
            member: [],
            public: [],
          }
          break
      }
    }

    setDefaultPermissions(() => p)
    setEffectivePermissions(() => visible ? p : DefaultEffectivePermissionProps)
    setAllowedRoles(() =>
      visible ? p : DefaultEffectivePermissionProps
    )
  }

  const PermCheck = ({ role, perm }: { role: Role[]; perm: Role }) => {
    const has = role.find((r) => r === perm) !== undefined
    return (
      <Grid
        item
        xs
        className={`text-center ${has ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {has ? <MuiCheckIcon /> : <MuiCloseIcon />}
      </Grid>
    )
  }

  useEffect(() => {
    setPermissions()
  }, [visible, status])

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

      <div>
        <Label className="text-accent">Set your own Permissions</Label>
        <div>
          <EditPermission
            className="pb-12"
            value={effectivePermissions}
            setValue={setEffectivePermissions}
            allowedRoles={allowedRoles}
          />
          <EditRole role="Commune" value={commune} setValue={setCommune}>
            <p>Create your own commune(s)</p>
          </EditRole>
        </div>
      </div>

      {/* <div>
        
        <div>
          <h3>Default Permissions</h3>
          <p className="text-sm mt-6 border-b border-neutral border-opacity-50">
            These are the permissions that are applied to each User Type or
            Follower Type by default. You can modify your Permissions settings,
            of course, though in some cases the defaults will take precedence.
          </p>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <Grid
              container
              columns={16}
              className="font-semibold bg-slate-300 mt-2"
            >
              <Grid item xs={4}>
                User Type
              </Grid>
              <Grid item xs className="text-center">
                Read
              </Grid>
              <Grid item xs className="text-center">
                Share
              </Grid>
              <Grid item xs className="text-center">
                Comment
              </Grid>
              <Grid item xs className="text-center">
                Feedback
              </Grid>
            </Grid>

            {map.toUI(defaultPermissions).map((r) => (
              <Grid
                container
                columns={16}
                className="odd:bg-base-200 mt-0.5 hover:text-base-100 hover:bg-sky-500 transition-all duration-200"
                key={uuid()}
              >
                <Grid item xs={4}>
                  {r.label} (DEFAULT)
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="READ" />
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="SHARE" />
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="COMMENT" />
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="FEEDBACK" />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div> */}

      {/* <div>
        <div>
          <h3>Effective Permissions</h3>
          <p className="text-sm mt-6 border-b border-neutral border-opacity-50">
            These are the permissions that are applied to each User Type or
            Follower Type by default. You can modify your Permissions settings,
            of course, though in some cases the defaults will take precedence.
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
              <Grid item xs className="text-center">
                Read
              </Grid>
              <Grid item xs className="text-center">
                Share
              </Grid>
              <Grid item xs className="text-center">
                Comment
              </Grid>
              <Grid item xs className="text-center">
                Feedback
              </Grid>
            </Grid>
            {map.toUI(effectivePermissions).map((r) => (
              <Grid
                container
                columns={16}
                className="odd:bg-base-200 mt-0.5 hover:text-base-100 hover:bg-sky-500 transition-all duration-200"
                key={uuid()}
              >
                <Grid item xs={4}>
                  {r.label} (EFFECTIVE)
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="READ" />
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="SHARE" />
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="COMMENT" />
                </Grid>
                <Grid item xs>
                  <PermCheck role={r.role} perm="FEEDBACK" />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div> */}

    </AdminLayout>
  )
}

export default Test
