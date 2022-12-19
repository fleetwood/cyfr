import Link from "next/link";
import { GoogleSVG } from "../ui/svgs";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import { ClipbardIcon, QuestionMarkIcon } from "../ui/icons";


const LeftMenu = () => {
  return (
  <div className="fixed mt-32">
    <ul className="ml-4 space-y-6 text-lg font-medium">
      <li>
        <ShrinkableIconLink href={'/about'} target="_self" label="About Us" icon={QuestionMarkIcon} />
      </li>
      <li>
        <ShrinkableIconLink href="https://hypercolor.dev/generator" target="_blank" label="Gradients" icon={ClipbardIcon} />
      </li>
      <li>
        <Link href="https://materialdesignicons.com/" title="Material Icons"><GoogleSVG /></Link>
      </li>
      <li>
        <Link href="https://unpkg.com/browse/@heroicons/react@2.0.13/24/outline/" title="Heroicon List">Heroicon List</Link>
      </li>
      <li>
        <Link href="https://tailwindui.com/components" title="Tailwind Components">Tailwind Components</Link>
      </li>
    </ul>
  </div>
)};

export default LeftMenu;
