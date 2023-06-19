import {
    Accordion,
    AccordionBody,
    AccordionHeader,
} from "@material-tailwind/react";
import { useState } from "react";

const MaterialAccordion = (props: { children: any[] }) => {
  const [open, setOpen] = useState(0)
  const handleOpen = (value:number) => setOpen(open === value ? -1 : value)

  const items = Array.isArray(props.children) ? props.children : [...props.children]
 
  return <>
    {items.map((c,idx) => (
        <Accordion open={open === idx} nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
            <AccordionHeader className={c.props.children[0].props.className??''} onClick={() => handleOpen(idx)} nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                {c.props.children[0]}
            </AccordionHeader>
            <AccordionBody className={c.props.children[1].props.className??''} >
                {c.props.children[1]}
            </AccordionBody>
        </Accordion>
    ))}
    </>
}
export default MaterialAccordion