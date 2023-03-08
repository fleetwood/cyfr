import {
  Book,
  BookCreateProps,
  BookDeleteProps,
  BookDetail,
  BookDetailInclude,
  PrismaGenre,
} from "../prismaContext";
import useDebug from "../../hooks/useDebug";

const { debug, info, todo, fileMethod } = useDebug({
  fileName: "entities/prismaBook",
});

const byId = async (id: string): Promise<BookDetail | null> => {
  try {
    return (await prisma.book.findFirst({
      where: {
        id: id,
        active: true,
      },
      include: BookDetailInclude,
    })) as unknown as BookDetail;
  } catch (error) {
    throw { code: fileMethod("byId"), message: "No book was returned!" };
  }
};

const byUser = async (id: string): Promise<BookDetail[]> => {
  try {
    const books = await prisma.book.findMany({
      where: {
        authors: {
          some: {
            id,
          },
        },
        active: true,
      },
      include: BookDetailInclude,
    });
    if (books) {
      return books as unknown as BookDetail[];
    }
    throw {
      code: fileMethod("byUser"),
      message: `Failed to find books for ${id}`,
    };
  } catch (error) {
    info(fileMethod("byUser"), { id, error });
    return [];
  }
};

const createBook = async (props:BookCreateProps): Promise<BookDetail|null> => {
    try {
        const data =  {
            cover: PrismaGenre.covers(props.genreId),
            authors: {
              connect: {
                id: props.authorId
              }
            },
            back: props.back,
            genre: {
              connect: {
                id: props.genreId
              }
            },
            status: 'DRAFT',
            words: 0,
            ...{props}
        }
        debug('createBook', {data, props})
        todo('createBook',`
            1. assure user information
            2. if a cover hasn't been uploaded, obtain the default for the genre
            3. add default covers to Genre
            4. categories, oy
        `)
        throw({code: fileMethod('createBook'), message: 'Not yet implemented'})
    } catch (error) {
        info('createBook', {error})
        return null
    }
}

const deleteBook = async ({bookId,authorId,}: BookDeleteProps): Promise<Book | undefined> => {
  try {
    debug("deleteBook", { bookId, authorId })
    todo("deleteBook", "Make sure author deleting the book is an owner.");
    throw { code: fileMethod("deleteBook"), message: "Not implemented" };
  } catch (error) {
    info("deleteBook ERROR: ", error);
    throw { code: fileMethod("deleteBook"), message: "Book was not deleted!" };
  }
};

export const PrismaBook = { byId, byUser, createBook, deleteBook };
