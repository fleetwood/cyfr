import ReactHtmlParser from 'react-html-parser'

type HtmlContentProps = {
  content: string
}

export const HtmlContent = ({ content }: HtmlContentProps) => <div>{content && ReactHtmlParser(content)}</div>
export default HtmlContent
