import React from "react";
import { MainFeed } from "../../../prisma/types";
import BookStubComponent from "./BookStubComponent";
import useDebug from "../../../hooks/useDebug";
const { debug, jsonBlock } = useDebug(
  "components/containers/Books/BookFeedView",
  "DEBUG"
);

type BookFeedViewProps = {
  item: MainFeed;
};

const BookFeedView = ({ item }: BookFeedViewProps) => {
  const { book, isShare, author } = item;
  return (
    <>{jsonBlock(book)}</>
    // <BookStubComponent book={book!} />
  );
};

export default BookFeedView;
