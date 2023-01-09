import ShrinkableIconLink from "../ui/shrinkableIconLink";
import { ClipbardIcon, QuestionMarkIcon } from "../ui/icons";

const LeftColumn = () => {
  return (
    <div className="sticky top-0 p-4 rounded-xl w-full h-full">
      <ul className="flex sm:flex-col overflow-hidden content-center justify-center">
        <li>
          <ShrinkableIconLink
            href={"/about"}
            target="_self"
            label="About Us"
            icon={QuestionMarkIcon}
          />
        </li>
        <li>
          <ShrinkableIconLink
            href="https://hypercolor.dev/generator"
            target="_blank"
            label="Gradients"
            icon={ClipbardIcon}
          />
        </li>
        <li>
          <a href="https://materialdesignicons.com/" title="Material Icons">
            Material Designs
          </a>
        </li>
        <li>
          <a
            href="https://unpkg.com/browse/@heroicons/react@2.0.13/24/outline/"
            title="Heroicon List"
          >
            Heroicon List
          </a>
        </li>
        <li>
          <a
            href="https://tailwindui.com/components"
            title="Tailwind Components"
          >
            Tailwind Components
          </a>
        </li>
      </ul>
    </div>
  );
};

export default LeftColumn;
