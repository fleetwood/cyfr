import parse from "html-react-parser"
import ReactHtmlParser from 'react-html-parser'
import Mention from "./mention"

type HtmlContentProps = {
  content: string
}

export const HtmlContent = ({ content }: HtmlContentProps) => {
  const transform = (node:any) => {
    if (node.type === 'tag' && node.name === 'span' && node.attribs.class && node.attribs.class === 'mention-link') {
        const {userid: userId, username: userName} = node.attribs
        return <Mention {...{userId, userName}}>{node.attribs.username}</Mention>
    }
  }
  return <div>{content && ReactHtmlParser(content, {transform})}</div>
}
export default HtmlContent
