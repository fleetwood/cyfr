
import { DatabaseIcon, FeatherIcon, GearIcon, HouseIcon, MuiWrenchIcon } from 'components/ui/icons'
import ShrinkableIconLink from 'components/ui/shrinkableIconLink'
import { __prod__ } from "utils/constants"

const LeftColumn = () => {
  return (
    <div className="sticky top-0 p-4 rounded-xl w-full h-full">
      <ul className="flex sm:flex-col overflow-hidden content-center justify-center">
        {!__prod__ && 
          <li>
          <ShrinkableIconLink
            href={"/"}
            target="_self"
            label="Home"
            icon={HouseIcon}
          />
        </li>
        }
        {!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"/test"}
              target="_self"
              label="Test Page"
              icon={FeatherIcon}
            />
          </li>
        }
        {!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"/admin"}
              target="_self"
              label="Admin Page"
              icon={GearIcon}
            />
          </li>
        }
        {!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"https://cloud.prisma.io/fleetwood/cyfrprisma"}
              target="_blank"
              label="Prisma IO"
              icon={DatabaseIcon}
            />
          </li>
        }
        {!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"https://mui.com/material-ui/getting-started/"}
              target="_blank"
              label="MUI Core"
              icon={<MuiWrenchIcon />}
            />
          </li>
        }
        
        <li>
          <a
            href="https://tailwindui.com/components"
            title="Tailwind Components"
            target='_blank'
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Tailwind Components
          </a>
        </li>
        <li>
          <a
            href="https://github.com/tailwindlabs/tailwindcss-forms/blob/master/index.html"
            title="Tailwind Forms Usage"
            target='_blank'
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Tailwind Forms
          </a>
        </li>
        <li>
          <a
            href="https://www.copyright.gov/dmca-directory/"
            title="TODO: Copyright Stuff"
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            TODO: Copyright Stuff
          </a>
        </li>
      </ul>
    </div>
  )
}

export default LeftColumn
