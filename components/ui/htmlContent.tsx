import ReactHtmlParser from 'react-html-parser'

type HtmlContentProps = {
  content: string
  className?: string
}

export const HtmlContent = ({ content, className }: HtmlContentProps) => <div className={className} >{content && ReactHtmlParser(content)}</div>
export default HtmlContent
