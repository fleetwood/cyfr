import ShrinkableIconLink from "../ui/shrinkableIconLink";
import { ClipbardIcon, PhotoIcon, QuestionMarkIcon, FeatherIcon, GearIcon, DatabaseIcon } from '../ui/icons';
import { __prod__ } from "../../utils/constants";

const LeftColumn = () => {
  return (
    <div className="sticky top-0 p-4 rounded-xl w-full h-full">
      <ul className="flex sm:flex-col overflow-hidden content-center justify-center">
        {!__prod__ && 
          <li>
          <ShrinkableIconLink
            href={"/dev"}
            target="_self"
            label="Dev"
            icon={QuestionMarkIcon}
          />
        </li>
        }
        {!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"/gallery/create"}
              target="_self"
              label="Create Gallery"
              icon={PhotoIcon}
            />
          </li>
        }{!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"/test"}
              target="_self"
              label="Test Page"
              icon={FeatherIcon}
            />
          </li>
        }{!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"/admin"}
              target="_self"
              label="Admin Page"
              icon={GearIcon}
            />
          </li>
        }{!__prod__ &&   
          <li>
            <ShrinkableIconLink
              href={"https://cloud.prisma.io/fleetwood/cyfrprisma"}
              target="_self"
              label="Prisma IO"
              icon={DatabaseIcon}
            />
          </li>
        }
        <li>
          <ShrinkableIconLink
            href="https://hypercolor.dev/generator"
            target="_blank"
            label="Gradients"
            icon={ClipbardIcon}
          />
        </li>
        <li>
          <a
            href="https://materialdesignicons.com/"
            title="Material Icons"
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Material Designs
          </a>
        </li>
        <li>
          <a
            href="https://unpkg.com/browse/@heroicons/react@2.0.13/24/outline/"
            title="Heroicon List"
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Heroicon List
          </a>
        </li>
        <li>
          <a
            href="https://tailwindui.com/components"
            title="Tailwind Components"
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Tailwind Components
          </a>
        </li>
        <li>
          <a
            href="https://github.com/tailwindlabs/tailwindcss-forms/blob/master/index.html"
            title="Tailwind Forms Usage"
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Tailwind Forms
          </a>
        </li>
        <li>
          <a
            href="https://angrytools.com/gradient/image/"
            title="Angry Tools Gradient Generator"
            className="text-secondary-content text-opacity-70 hover:text-opacity-100 transition-all ease-linear duration-200"
          >
            Angry Tools
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
  );
};

export default LeftColumn;
