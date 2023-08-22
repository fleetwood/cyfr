import ReactHtmlParser from 'react-html-parser'

type HtmlContentProps = {
  content: string
  className?: string
  limit?: number
}

export const HtmlContent = ({ content, className, limit }: HtmlContentProps) => <div className={className} >{content && ReactHtmlParser(content)}</div>
export default HtmlContent
