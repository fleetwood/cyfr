import React from "react";
import { MainFeed } from "../../../prisma/types";
import BookStubComponent from "./BookStubComponent";
import useDebug from "../../../hooks/useDebug";
import BookCover, { BookCoverVariant } from "./BookCover";
import Avatar from "../../ui/avatar";
import { timeDifference, uniqueKey } from "../../../utils/helpers";
import FeedHeader from "../Feed/FeedHeader";
import HtmlContent from "../../ui/htmlContent";
const { debug, jsonBlock } = useDebug(
  "components/containers/Books/BookFeedView",
  "DEBUG"
);

type BookFeedViewProps = {
  item: MainFeed;
};

const BookFeedView = ({ item }: BookFeedViewProps) => {
  const { book, isShare, author } = item;
  return book ?
    <div>
      
      <div className="font-semibold">Book</div>
      <h2>{book.title}</h2>

      {book.authors && book.authors.length > 1 && 
        <div className="flex my-4">
          <span>by </span>
          {book.authors.map((author) => 
            <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
          )}
        </div>
      }
      {book.hook &&
        <div><HtmlContent content={book.hook} /></div>
      }

      {book.cover &&
        <BookCover book={book} variant={BookCoverVariant.COVER} link={false} />
      }
      {jsonBlock(book)}
    </div>
  : <>{jsonBlock(item)}</>
};

export default BookFeedView;
