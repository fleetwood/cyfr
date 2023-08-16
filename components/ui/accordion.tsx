import {
    Accordion,
    AccordionBody,
    AccordionHeader,
} from "@material-tailwind/react";
import { useState } from "react";
import {MuiArrowDownIcon, MuiArrowLeftIcon} from "./icons";
import {Grid} from "@mui/material";

const MaterialAccordion = (props: { children: any }) => {
  const [open, setOpen] = useState(0)
  const handleOpen = (value:number) => setOpen(open === value ? -1 : value)

  const items = Array.isArray(props.children) ? props.children : [props.children]
 
  return (
    <>
      {items.map((c, idx) => (
        <Accordion
          open={open === idx}
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          <AccordionHeader
            className={c.props.children[0].props.className ?? ''}
            onClick={() => handleOpen(idx)}
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <Grid container>
              <Grid item>
                <MuiArrowDownIcon
                  className={`${
                    open === idx
                      ? ' animate-flip-right rotate-180'
                      : ' animate-flip-left rotate-0'
                  }`}
                />
              </Grid>
              <Grid item xs>
                {c.props.children[0]}
              </Grid>
            </Grid>
          </AccordionHeader>
          <AccordionBody className={c.props.children[1].props.className ?? ''}>
            {c.props.children[1]}
          </AccordionBody>
        </Accordion>
      ))}
    </>
  )
}
export default MaterialAccordion