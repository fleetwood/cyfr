import { Chapter } from "../../prisma/prismaContext";
export { isAuthor } from "./book";

/**
 * Takes a chapter with a new chapter order, and resorts the current
 * chapters from the order specified by the *sortChapter*. Note that 
 * when adding the first chapter to a book, the current list might be
 * *undefined*, so *bookChapters* param allows for *undefined || null*
 * @param bookChapters {@link Chapter}[] The current chapter order
 * @param sortChapter {@link Chapter} The changed chapter
 * @returns 
 */
export const sortChapters = async (
  bookChapters: Chapter[]|undefined|null,
  sortChapter: Chapter
) => {
  let chapters:Chapter[] = [...bookChapters||[]]
  return [
    ...chapters
      .filter((a) => a.id !== sortChapter.id)
      .sort((a, b) => (a.order > b.order ? 1 : -1))
      .map((a, idx) => {
        return {
          ...a,
          order: idx + 1 >= sortChapter.order ? idx + 2 : idx + 1,
        };
      }),
    sortChapter,
  ].sort((a, b) => (a.order > b.order ? 1 : -1));
};
