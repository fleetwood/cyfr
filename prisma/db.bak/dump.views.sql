

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_author_detail
AS
( SELECT u.id,
    u.name,
    u.email,
    u."emailVerified",
    u.image,
    u.slug,
    u."membershipId",
    to_json(membership.*) AS membership,
    json_agg(posts.*) AS posts,
    json_agg(likes.*) AS likes,
    json_agg(shares.*) AS shares,
    ( SELECT json_agg(following.*) AS follows
           FROM ( SELECT DISTINCT usr.name,
                    usr.id,
                    usr.image
                   FROM ("Follow" following_1
                     JOIN "User" usr ON ((following_1."followingId" = usr.id)))
                  WHERE (following_1."followerId" = u.id)) following) AS follows,
    ( SELECT json_agg(stanning.*) AS stans
           FROM ( SELECT DISTINCT usr.name,
                    usr.id,
                    usr.image
                   FROM ("Follow" stanning_1
                     JOIN "User" usr ON (((stanning_1."followingId" = usr.id) AND (stanning_1."isFan" = true))))
                  WHERE (stanning_1."followerId" = u.id)) stanning) AS stans,
    ( SELECT json_agg(followed.*) AS followers
           FROM ( SELECT DISTINCT usr.name,
                    usr.id,
                    usr.image
                   FROM ("Follow" followed_1
                     JOIN "User" usr ON ((followed_1."followerId" = usr.id)))
                  WHERE (followed_1."followingId" = u.id)) followed) AS followers,
    ( SELECT json_agg(fanning.*) AS fans
           FROM ( SELECT DISTINCT usr.name,
                    usr.id,
                    usr.image
                   FROM ("Follow" fanning_1
                     JOIN "User" usr ON (((fanning_1."followerId" = usr.id) AND (fanning_1."isFan" = true))))
                  WHERE (fanning_1."followingId" = u.id)) fanning) AS fans,
    ( SELECT json_agg(bks.*) AS books
           FROM ( SELECT a.id,
                    a."createdAt",
                    a."updatedAt",
                    a."startedAt",
                    a."completeAt",
                    a.active,
                    a.status,
                    a.prospect,
                    a.fiction,
                    a.title,
                    a.slug,
                    a."genreId",
                    a.hook,
                    a.synopsis,
                    a.back,
                    a.words,
                    a."galleryId",
                    ub."A",
                    ub."B"
                   FROM ("Book" a
                     JOIN _user_books ub ON (((ub."A" = a.id) AND (ub."B" = u.id))))) bks) AS books,
    ( SELECT json_agg(gal.*) AS galleries
           FROM ( SELECT f_user_galleries.id,
                    f_user_galleries.createdat,
                    f_user_galleries.updatedat,
                    f_user_galleries.visible,
                    f_user_galleries.title,
                    f_user_galleries.description,
                    f_user_galleries.images
                   FROM f_user_galleries(u.id) f_user_galleries(id, createdat, updatedat, visible, title, description, images)) gal) AS galleries
   FROM (((("User" u
     LEFT JOIN "Membership" membership ON ((membership.id = u."membershipId")))
     LEFT JOIN "Post" posts ON (((posts."authorId" = u.id) AND (posts.visible = true))))
     LEFT JOIN "Like" likes ON ((likes."authorId" = u.id)))
     LEFT JOIN "Share" shares ON (((shares."authorId" = u.id) AND (shares.visible = true))))
  GROUP BY u.id, membership.id);


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_author_stub
AS
( SELECT u.id,
    u.name,
    u.email,
    u."emailVerified",
    u.image,
    u.slug,
    u."membershipId",
    to_json(membership.*) AS membership,
    count(DISTINCT posts.id) AS posts,
    count(DISTINCT likes.id) AS likes,
    count(DISTINCT shares.id) AS shares,
    (count(DISTINCT follows.id))::integer AS follows,
    (count(DISTINCT follows.id) FILTER (WHERE (follows."isFan" = true)))::integer AS stans,
    (count(DISTINCT followers.id))::integer AS followers,
    (count(DISTINCT followers.id) FILTER (WHERE (followers."isFan" = true)))::integer AS fans,
    ( SELECT json_agg(bks.*) AS books
           FROM ( SELECT a.id,
                    a."createdAt",
                    a."updatedAt",
                    a."startedAt",
                    a."completeAt",
                    a.active,
                    a.status,
                    a.prospect,
                    a.fiction,
                    a.title,
                    a.slug,
                    a."genreId",
                    a.hook,
                    a.synopsis,
                    a.back,
                    a.words,
                    a."galleryId",
                    ub."A",
                    ub."B"
                   FROM ("Book" a
                     JOIN _user_books ub ON (((ub."A" = a.id) AND (ub."B" = u.id))))) bks) AS books,
    ( SELECT json_agg(gal.*) AS galleries
           FROM ( SELECT f_user_galleries.id,
                    f_user_galleries.createdat,
                    f_user_galleries.updatedat,
                    f_user_galleries.visible,
                    f_user_galleries.title,
                    f_user_galleries.description,
                    f_user_galleries.images
                   FROM f_user_galleries(u.id) f_user_galleries(id, createdat, updatedat, visible, title, description, images)) gal) AS galleries
   FROM (((((("User" u
     LEFT JOIN "Membership" membership ON ((membership.id = u."membershipId")))
     LEFT JOIN "Post" posts ON (((posts."authorId" = u.id) AND (posts.visible = true))))
     LEFT JOIN "Like" likes ON ((likes."authorId" = u.id)))
     LEFT JOIN "Follow" follows ON ((follows."followerId" = u.id)))
     LEFT JOIN "Follow" followers ON ((followers."followingId" = u.id)))
     LEFT JOIN "Share" shares ON (((shares."authorId" = u.id) AND (shares.visible = true))))
  GROUP BY u.id, u.email, membership.id);

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_cover_stub
AS
( SELECT cover.id,
    cover."createdAt",
    cover."updatedAt",
    cover.active,
    cover."authorId",
    cover."bookId",
    cover."imageId",
    cover."genreId",
    to_json(usr.*) AS author,
    to_json(img.*) AS image,
    to_json(book.*) AS book,
    to_json(genre.*) AS genre
   FROM (((("Cover" cover
     LEFT JOIN "Image" img ON ((cover."imageId" = img.id)))
     LEFT JOIN "Genre" genre ON ((cover."genreId" = genre.id)))
     LEFT JOIN "Book" book ON ((cover."bookId" = book.id)))
     JOIN "User" usr ON ((cover."authorId" = usr.id))));



-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_book_detail
AS
( SELECT book.id,
    book."createdAt",
    book."updatedAt",
    book."startedAt",
    book."completeAt",
    book.active,
    book.status,
    book.prospect,
    book.fiction,
    book.title,
    book.slug,
    book."genreId",
    book.hook,
    book.synopsis,
    book.back,
    book.words,
    book."galleryId",
    to_json(genre.*) AS genre,
    to_json(gallery.*) AS gallery,
    ( SELECT json_agg(authors.*) AS json_agg) AS authors,
    to_json(cover.*) AS cover,
    ( SELECT json_agg(lk.*) AS likes
           FROM ( SELECT author.id,
                    author.name,
                    author.image
                   FROM ("Like" l
                     LEFT JOIN "User" author ON ((author.id = l."authorId")))
                  WHERE (l."bookId" = book.id)) lk) AS likes,
    ( SELECT json_agg(fl.*) AS follows
           FROM ( SELECT author.id,
                    author.name,
                    author.image,
                    f."isFan"
                   FROM ("Follow" f
                     LEFT JOIN "User" author ON ((author.id = f."followerId")))
                  WHERE (f."bookId" = book.id)) fl) AS follows,
    ( SELECT json_agg(sh.*) AS shares
           FROM ( SELECT author.id,
                    author.name,
                    author.image
                   FROM ("Share" s
                     LEFT JOIN "User" author ON ((author.id = s."authorId")))
                  WHERE (s."bookId" = book.id)) sh) AS shares,
    ( SELECT json_agg(ch.*) AS chapters
           FROM ( SELECT c.id,
                    c."createdAt",
                    c."updatedAt",
                    c.active,
                    c.content,
                    c.words,
                    c."bookId",
                    c."galleryId",
                    c."order",
                    c.title
                   FROM "Chapter" c
                  WHERE ((c."bookId" = book.id) AND (c.active = true))
                  ORDER BY c."order") ch) AS chapters,
    ( SELECT json_agg(chr.*) AS characters
           FROM ( SELECT c.id,
                    c."createdAt",
                    c."updatedAt",
                    c.active,
                    c.name,
                    c."familyName",
                    c."givenName",
                    c."middleName",
                    c.thumbnail,
                    c.age,
                    c.role,
                    c.description,
                    c.backstory,
                    c.title,
                    c.archetype,
                    c."galleryId"
                   FROM (("Character" c
                     LEFT JOIN _book_characters lookup ON ((lookup."B" = c.id)))
                     LEFT JOIN "Book" charbooks ON ((charbooks.id = lookup."A")))
                  WHERE (charbooks.id = book.id)
                  GROUP BY c.id) chr) AS characters,
    ( SELECT json_agg(categories.*) AS categories
           FROM (("Book" books
             LEFT JOIN _book_categories bc ON ((bc."A" = books.id)))
             LEFT JOIN "BookCategory" categories ON ((categories.id = bc."B")))) AS categories
   FROM ((((("Book" book
     JOIN _user_books ub ON ((book.id = ub."A")))
     LEFT JOIN "Genre" genre ON ((genre.id = book."genreId")))
     LEFT JOIN "Gallery" gallery ON ((gallery.id = book."galleryId")))
     LEFT JOIN ( SELECT u.id,
            u.name,
            u.email,
            u.image,
            ( SELECT f_user_follows(u.id) AS follows) AS follows,
            ( SELECT f_user_followers(u.id) AS followers) AS followers,
            ( SELECT count(p.id) AS count
                   FROM "Post" p
                  WHERE ((p."authorId" = u.id) AND (p.visible = true))) AS "postCount"
           FROM "User" u) authors ON ((authors.id = ub."B")))
     LEFT JOIN "Cover" cover ON ((cover."bookId" = book.id)))
  GROUP BY book.id, genre.id, cover.id, gallery.id);


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_book_stub
AS
( SELECT book.id,
    book."createdAt",
    book."updatedAt",
    book."startedAt",
    book."completeAt",
    book.active,
    book.status,
    book.prospect,
    book.fiction,
    book.title,
    book.slug,
    book.hook,
    book.synopsis,
    book.back,
    book.words,
    book."galleryId",
    book."genreId",
    to_json(genre.*) AS genre,
    ( SELECT json_agg(authors.*) AS json_agg) AS authors,
    to_json(cover.*) AS cover,
    ( SELECT json_agg(lk.*) AS likes
           FROM ( SELECT author.id,
                    author.name,
                    author.image
                   FROM ("Like" l
                     LEFT JOIN "User" author ON ((author.id = l."authorId")))
                  WHERE (l."bookId" = book.id)) lk) AS likes,
    ( SELECT json_agg(fl.*) AS follows
           FROM ( SELECT author.id,
                    author.name,
                    author.image,
                    f."isFan"
                   FROM ("Follow" f
                     LEFT JOIN "User" author ON ((author.id = f."followerId")))
                  WHERE (f."bookId" = book.id)) fl) AS follows,
    ( SELECT json_agg(sh.*) AS shares
           FROM ( SELECT author.id,
                    author.name,
                    author.image
                   FROM ("Share" s
                     LEFT JOIN "User" author ON ((author.id = s."authorId")))
                  WHERE (s."bookId" = book.id)) sh) AS shares,
    ( SELECT json_agg(ch.*) AS chapters
           FROM ( SELECT c.id,
                    c."createdAt",
                    c."updatedAt",
                    c.active,
                    c.words,
                    c."bookId",
                    c."galleryId",
                    c."order",
                    c.title
                   FROM "Chapter" c
                  WHERE ((c."bookId" = book.id) AND (c.active = true))
                  ORDER BY c."order") ch) AS chapters,
    ( SELECT json_agg(chr.*) AS characters
           FROM ( SELECT "character".id,
                    "character"."createdAt",
                    "character"."updatedAt",
                    "character".active,
                    "character".name,
                    "character"."familyName",
                    "character"."givenName",
                    "character"."middleName",
                    "character".thumbnail,
                    "character".age,
                    "character".role,
                    "character".title,
                    "character".archetype,
                    "character"."galleryId",
                    bc."A",
                    bc."B"
                   FROM ("Character" "character"
                     JOIN _book_characters bc ON (((bc."B" = "character".id) AND (bc."A" = book.id))))
                  WHERE ("character".active = true)) chr) AS characters,
    ( SELECT json_agg(categories.*) AS categories
           FROM (("Book" books
             LEFT JOIN _book_categories bc ON ((bc."A" = books.id)))
             LEFT JOIN "BookCategory" categories ON ((categories.id = bc."B")))) AS categories
   FROM (((("Book" book
     JOIN _user_books ub ON ((book.id = ub."A")))
     LEFT JOIN "Genre" genre ON ((genre.id = book."genreId")))
     LEFT JOIN ( SELECT u.id,
            u.name,
            u.email,
            u.image
           FROM "User" u) authors ON ((authors.id = ub."B")))
     LEFT JOIN "Cover" cover ON ((cover."bookId" = book.id)))
  GROUP BY book.id, genre.id, cover.id);

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_chapter_detail
AS
( SELECT chapter.id,
    chapter."createdAt",
    chapter."updatedAt",
    chapter.active,
    chapter.content,
    chapter.words,
    chapter."bookId",
    chapter."galleryId",
    chapter."order",
    chapter.title,
    ( SELECT to_json(bk.*) AS book
           FROM ( SELECT b.id,
                    b."createdAt",
                    b."updatedAt",
                    b."startedAt",
                    b."completeAt",
                    b.active,
                    b.status,
                    b.prospect,
                    b.fiction,
                    b.title,
                    b.slug,
                    b.hook,
                    b.synopsis,
                    b.back,
                    b.words,
                    b."galleryId",
                    b."genreId",
                    b.genre,
                    b.authors,
                    b.cover,
                    b.likes,
                    b.follows,
                    b.shares,
                    b.chapters,
                    b.characters,
                    b.categories
                   FROM v_book_stub b
                  WHERE (b.id = chapter."bookId")) bk) AS book,
    json_agg(ch.*) AS characters,
    ( SELECT to_json(vgs.*) AS gallery
           FROM ( SELECT g.id,
                    g."createdAt",
                    g."updatedAt",
                    g.visible,
                    g.title,
                    g.description,
                    json_agg(images.*) AS images
                   FROM ("Gallery" g
                     LEFT JOIN "Image" images ON ((images."galleryId" = g.id)))
                  GROUP BY g.id) vgs
          WHERE (vgs.id = chapter."galleryId")) AS gallery
   FROM ("Chapter" chapter
     LEFT JOIN ( SELECT ch_1.id,
            ch_1."createdAt",
            ch_1."updatedAt",
            ch_1.active,
            ch_1.name,
            ch_1."familyName",
            ch_1."givenName",
            ch_1."middleName",
            ch_1.thumbnail,
            ch_1.age,
            ch_1.role,
            ch_1.description,
            ch_1.backstory,
            ch_1.title,
            ch_1.archetype,
            ch_1."galleryId",
            cc."A" AS chapter_id
           FROM (_chapter_characters cc
             JOIN "Character" ch_1 ON ((cc."B" = ch_1.id)))
          WHERE (ch_1.active = true)) ch ON ((ch.chapter_id = chapter.id)))
  WHERE (chapter.active = true)
  GROUP BY chapter.id
  ORDER BY chapter."order");



-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_chapter_stub
AS
( SELECT chapter.id,
    chapter."createdAt",
    chapter."updatedAt",
    chapter.active,
    chapter.content,
    chapter.words,
    chapter."bookId",
    chapter."galleryId",
    chapter."order",
    chapter.title,
    json_agg(ch.*) AS characters,
    ( SELECT to_json(vgs.*) AS gallery
           FROM ( SELECT g.id,
                    g."createdAt",
                    g."updatedAt",
                    g.visible,
                    g.title,
                    g.description,
                    json_agg(images.*) AS images
                   FROM ("Gallery" g
                     LEFT JOIN "Image" images ON ((images."galleryId" = g.id)))
                  GROUP BY g.id) vgs
          WHERE (vgs.id = chapter."galleryId")) AS gallery
   FROM ("Chapter" chapter
     LEFT JOIN ( SELECT ch_1.id,
            ch_1."createdAt",
            ch_1."updatedAt",
            ch_1.active,
            ch_1.name,
            ch_1."familyName",
            ch_1."givenName",
            ch_1."middleName",
            ch_1.thumbnail,
            ch_1.age,
            ch_1.role,
            ch_1.description,
            ch_1.backstory,
            ch_1.title,
            ch_1.archetype,
            ch_1."galleryId",
            cc."A" AS chapter_id
           FROM (_chapter_characters cc
             JOIN "Character" ch_1 ON ((cc."B" = ch_1.id)))
          WHERE (ch_1.active = true)) ch ON ((ch.chapter_id = chapter.id)))
  WHERE (chapter.active = true)
  GROUP BY chapter.id
  ORDER BY chapter."order");
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_character_stub
AS
( SELECT characters.id,
    characters."createdAt",
    characters."updatedAt",
    characters.active,
    characters.name,
    characters."familyName",
    characters."givenName",
    characters."middleName",
    characters.thumbnail,
    characters.age,
    characters.role,
    characters.description,
    characters.backstory,
    characters.title,
    characters.archetype,
    characters."galleryId",
    json_agg(books.*) AS books,
    json_agg(chapters.*) AS chapters,
    to_json(gallery.*) AS gallery,
    to_json(likes.*) AS likes,
    to_json(shares.*) AS shares,
    to_json(follows.*) AS followers,
    to_json(fans.*) AS fans
   FROM ((((((((("Character" characters
     LEFT JOIN _book_characters bc ON ((bc."B" = characters.id)))
     LEFT JOIN "Book" books ON ((bc."A" = books.id)))
     LEFT JOIN _chapter_characters cc ON ((cc."B" = characters.id)))
     LEFT JOIN "Chapter" chapters ON ((cc."A" = chapters.id)))
     LEFT JOIN "Gallery" gallery ON ((gallery.id = characters."galleryId")))
     LEFT JOIN "Like" likes ON ((likes."characterId" = characters.id)))
     LEFT JOIN "Share" shares ON ((shares."characterId" = characters.id)))
     LEFT JOIN "Follow" follows ON ((follows."characterId" = characters.id)))
     LEFT JOIN "Follow" fans ON (((fans."characterId" = characters.id) AND (fans."isFan" = true))))
  GROUP BY characters.id, gallery.id, likes.id, shares.id, follows.id, fans.id);
  

  

     
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_follower_stub
AS
(
     SELECT f.id,
    f."createdAt",
    f."updatedAt",
    f."isFan",
    f."followerId",
    f."followingId",
    f."characterId",
    f."bookId",
    to_json("user".*) AS "user",
    to_json(book.*) AS book,
    to_json("character".*) AS "character"
   FROM ((("Follow" f
     LEFT JOIN "User" "user" ON ((f."followerId" = "user".id)))
     LEFT JOIN "Book" book ON ((f."bookId" = book.id)))
     LEFT JOIN "Character" "character" ON ((f."characterId" = "character".id)))
     );


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_following_stub
AS
( SELECT f.id,
    f."createdAt",
    f."updatedAt",
    f."isFan",
    f."followerId",
    f."followingId",
    f."characterId",
    f."bookId",
    to_json("user".*) AS "user",
    to_json(book.*) AS book,
    to_json("character".*) AS "character"
   FROM ((("Follow" f
     LEFT JOIN "User" "user" ON ((f."followingId" = "user".id)))
     LEFT JOIN "Book" book ON ((f."bookId" = book.id)))
     LEFT JOIN "Character" "character" ON ((f."characterId" = "character".id))));
     

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_gallery_detail
AS
( SELECT g.id,
    g."createdAt",
    g."updatedAt",
    g.visible,
    g.title,
    g.description,
    g."authorId",
    g."shareId",
    to_json(u.*) AS author,
    json_agg(images.*) AS images,
    ( SELECT f_gallery_likes.f_gallery_likes
           FROM f_gallery_likes(g.id) f_gallery_likes(f_gallery_likes)) AS likes,
    ( SELECT f_gallery_shares.f_gallery_shares
           FROM f_gallery_shares(g.id) f_gallery_shares(f_gallery_shares)) AS shares
   FROM (("Gallery" g
     LEFT JOIN "Image" images ON ((images."galleryId" = g.id)))
     LEFT JOIN "User" u ON ((g."authorId" = u.id)))
  WHERE (g.visible = true)
  GROUP BY g.id, u.id);



-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_gallery_stub
AS
( SELECT g.id,
    g."createdAt",
    g."updatedAt",
    g.visible,
    g.title,
    g.description,
    g."authorId",
    g."shareId",
    to_json(u.*) AS author,
    json_agg(images.*) AS images,
    ( SELECT f_gallery_likes.f_gallery_likes
           FROM f_gallery_likes(g.id) f_gallery_likes(f_gallery_likes)) AS likes,
    ( SELECT f_gallery_shares.f_gallery_shares
           FROM f_gallery_shares(g.id) f_gallery_shares(f_gallery_shares)) AS shares
   FROM (("Gallery" g
     LEFT JOIN "Image" images ON ((images."galleryId" = g.id)))
     LEFT JOIN "User" u ON ((g."authorId" = u.id)))
  WHERE (g.visible = true)
  GROUP BY g.id, u.id);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_genre_all
AS
( SELECT genre.id,
    genre."createdAt",
    genre."updatedAt",
    genre.slug,
    genre.title,
    genre.description,
    json_agg(books.*) AS books,
    ( SELECT (count("Book".id))::integer AS count
           FROM "Book"
          WHERE (("Book"."genreId" = genre.id) AND ("Book".active = true))) AS totalbooks,
    json_agg(books.cover) AS covers
   FROM (("Genre" genre
     LEFT JOIN ( SELECT stub.id,
            stub."createdAt",
            stub."updatedAt",
            stub."startedAt",
            stub."completeAt",
            stub.active,
            stub.status,
            stub.prospect,
            stub.fiction,
            stub.title,
            stub.slug,
            stub.hook,
            stub.synopsis,
            stub.back,
            stub.words,
            stub."galleryId",
            stub."genreId",
            stub.genre,
            stub.authors,
            stub.cover,
            stub.likes,
            stub.follows,
            stub.shares,
            stub.chapters,
            stub.characters,
            stub.categories
           FROM v_book_stub stub
          WHERE (stub.active = true)
          ORDER BY stub."createdAt" DESC) books ON ((books."genreId" = genre.id)))
     LEFT JOIN ( SELECT c.id,
            c."createdAt",
            c."updatedAt",
            c.active,
            c."authorId",
            c."bookId",
            c."imageId",
            c."genreId",
            to_json(img.*) AS image
           FROM ("Cover" c
             LEFT JOIN "Image" img ON ((c."imageId" = img.id)))) cover ON ((cover."genreId" = genre.id)))
  GROUP BY genre.id
  ORDER BY genre.title);


  

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_genre_detail
AS
( SELECT genre.id,
    genre."createdAt",
    genre."updatedAt",
    genre.slug,
    genre.title,
    genre.description,
    json_agg(books.*) AS books,
    count(DISTINCT books.id) AS totalbooks
   FROM ("Genre" genre
     LEFT JOIN v_book_stub books ON ((books."genreId" = genre.id)))
  GROUP BY genre.id
  ORDER BY genre.title);



  

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_genre_stub
AS
( SELECT genre.id,
    genre."createdAt",
    genre."updatedAt",
    genre.slug,
    genre.title,
    genre.description,
    json_agg(books.*) AS books,
    count(DISTINCT books.id) AS totalbooks
   FROM ("Genre" genre
     LEFT JOIN v_book_stub books ON (((books."genreId" = genre.id) AND (books.active = true))))
  GROUP BY genre.id
  ORDER BY genre.title);


  

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_like_detail
AS
( SELECT to_json(author.*) AS author,
    to_json(post.*) AS post,
    to_json(book.*) AS book,
    to_json("character".*) AS "character",
    to_json(comment.*) AS comment,
    to_json(author.image) AS image,
    to_json(gallery.*) AS gallery,
    l.id,
    l."authorId",
    l."postId",
    l."createdAt",
    l."updatedAt",
    l."galleryId",
    l."imageId",
    l."commentId",
    l."characterId",
    l."bookId"
   FROM ((((((("Like" l
     LEFT JOIN "Gallery" gallery ON ((gallery.id = l."galleryId")))
     LEFT JOIN "Image" image ON ((image.id = l."imageId")))
     LEFT JOIN "Comment" comment ON ((comment.id = l."commentId")))
     LEFT JOIN "Character" "character" ON (("character".id = l."characterId")))
     LEFT JOIN "Book" book ON ((book.id = l."bookId")))
     LEFT JOIN "Post" post ON ((post.id = l."postId")))
     LEFT JOIN "User" author ON ((author.id = l."authorId")))
  ORDER BY l."createdAt" DESC);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_like_stub
AS
( SELECT to_json(author.*) AS author,
    l.id,
    l."authorId",
    l."postId",
    l."createdAt",
    l."updatedAt",
    l."galleryId",
    l."imageId",
    l."commentId",
    l."characterId",
    l."bookId"
   FROM ("Like" l
     LEFT JOIN "User" author ON ((author.id = l."authorId")))
  ORDER BY l."createdAt" DESC);



-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_post_stub
AS
( SELECT p.id,
    p."createdAt",
    p."updatedAt",
    p.visible,
    p.content,
    p."authorId",
    p."shareId",
    to_json(u.*) AS author,
    json_agg(images.*) AS images,
    ( SELECT json_agg(lk.*) AS likes
           FROM ( SELECT liker.id,
                    liker.name,
                    liker.email,
                    liker."emailVerified",
                    liker.image,
                    liker.slug,
                    liker."membershipId"
                   FROM ("Like" likes
                     JOIN "User" liker ON ((liker.id = likes."authorId")))
                  WHERE (p.id = likes."postId")) lk) AS likes,
    ( SELECT json_agg(sh.*) AS shares
           FROM ( SELECT sharer.id,
                    sharer.name,
                    sharer.email,
                    sharer."emailVerified",
                    sharer.image,
                    sharer.slug,
                    sharer."membershipId"
                   FROM ("Share" share
                     JOIN "User" sharer ON ((sharer.id = share."authorId")))
                  WHERE (p.id = share."postId")) sh) AS shares
   FROM (("Post" p
     LEFT JOIN "User" u ON ((p."authorId" = u.id)))
     LEFT JOIN "Image" images ON (((images."postId" = p.id) AND (images.visible = true))))
  WHERE (p.visible = true)
  GROUP BY p.id, u.id
  ORDER BY p."updatedAt" DESC);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_share_detail
AS
( SELECT to_json(author.*) AS author,
    to_json("character".*) AS "character",
    to_json(author.image) AS image,
    to_json(gallery.*) AS gallery,
    to_json(post.*) AS post,
    to_json(book.*) AS book,
    l.id,
    l."createdAt",
    l."updatedAt",
    l.visible,
    l."authorId",
    l."postId",
    l."galleryId",
    l."imageId",
    l."bookId",
    l."characterId"
   FROM (((((("Share" l
     LEFT JOIN "User" author ON ((author.id = l."authorId")))
     LEFT JOIN "Book" book ON ((book.id = l."bookId")))
     LEFT JOIN "Post" post ON ((post.id = l."postId")))
     LEFT JOIN "Gallery" gallery ON ((gallery.id = l."galleryId")))
     LEFT JOIN "Image" image ON ((image.id = l."imageId")))
     LEFT JOIN "Character" "character" ON (("character".id = l."characterId")))
  ORDER BY l."updatedAt" DESC);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_share_stub
AS
( SELECT to_json(author.*) AS author,
    l.id,
    l."authorId",
    l."postId",
    l."createdAt",
    l."updatedAt",
    l."galleryId",
    l."imageId",
    NULL::text AS "commentId",
    l."characterId",
    l."bookId"
   FROM ("Share" l
     LEFT JOIN "User" author ON ((author.id = l."authorId")))
  ORDER BY l."createdAt" DESC);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_user_book_stub
AS
( SELECT u.id,
    to_json(u.*) AS author,
    to_json(book.*) AS book,
    to_json(genre.*) AS genre
   FROM ((("User" u
     JOIN _user_books ub ON ((u.id = ub."B")))
     JOIN "Book" book ON ((ub."A" = book.id)))
     JOIN "Genre" genre ON ((book."genreId" = genre.id))));
     
     
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_user_info
AS
( SELECT usr.id,
    usr.name,
    usr.email,
    usr.image,
    (count(DISTINCT p.id))::integer AS posts,
    (count(DISTINCT f.id))::integer AS followers,
    (count(DISTINCT f.id) FILTER (WHERE (f."isFan" = true)))::integer AS fans,
    (count(DISTINCT ff.id))::integer AS follows,
    (count(DISTINCT ff.id) FILTER (WHERE (ff."isFan" = true)))::integer AS stans,
    (count(DISTINCT book."bookId"))::integer AS books,
    (count(DISTINCT gallery.id))::integer AS galleries,
    to_json(membership.*) AS membership
   FROM (((((("User" usr
     LEFT JOIN ( SELECT u.id AS "userId",
            book_1.id AS "bookId"
           FROM (("User" u
             JOIN _user_books ub ON ((u.id = ub."B")))
             JOIN "Book" book_1 ON ((ub."A" = book_1.id)))) book ON ((book."userId" = usr.id)))
     LEFT JOIN "Membership" membership ON ((membership.id = usr."membershipId")))
     LEFT JOIN "Gallery" gallery ON (((gallery."authorId" = usr.id) AND (gallery.visible = true))))
     LEFT JOIN "Post" p ON (((p."authorId" = usr.id) AND (p.visible = true))))
     LEFT JOIN "Follow" f ON ((f."followingId" = usr.id)))
     LEFT JOIN "Follow" ff ON ((ff."followerId" = usr.id)))
  GROUP BY usr.id, membership.id);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_feed_post
AS
( SELECT p.id,
    p."createdAt",
    p."updatedAt",
    p.visible,
    ( SELECT to_json(a.*) AS author
           FROM ( SELECT u.id,
                    u.email,
                    u.image,
                    u.name,
                    u.slug) a) AS author,
    false AS "isShare",
    ( SELECT to_json(post.*) AS post
           FROM ( SELECT p.id,
                    p."createdAt",
                    p."updatedAt",
                    p.visible,
                    p.content,
                    p."shareId",
                    p."commentId",
                    p."authorId",
                    to_json(u.*) AS author,
                    json_agg(images.*) AS images,
                    ( SELECT json_agg(lk.*) AS likes
                           FROM ( SELECT lu.id,
                                    lu.name,
                                    lu.image,
                                    lu.slug
                                   FROM ("Like" lk_1
                                     JOIN "User" lu ON (((lk_1."authorId" = lu.id) AND (lk_1."postId" = p.id))))) lk) AS likes,
                    ( SELECT json_agg(sh.*) AS shares
                           FROM ( SELECT lu.id,
                                    lu.name,
                                    lu.image,
                                    lu.slug
                                   FROM ("Share" sh_1
                                     JOIN "User" lu ON (((sh_1."authorId" = lu.id) AND (sh_1."postId" = p.id))))) sh) AS shares) post) AS post,
    NULL::text AS gallery,
    NULL::text AS image,
    NULL::text AS "character",
    NULL::text AS book
   FROM (("Post" p
     LEFT JOIN "Image" images ON (((images."postId" = p.id) AND (images.visible = true))))
     LEFT JOIN "User" u ON ((u.id = p."authorId")))
  WHERE (p.visible = true)
  GROUP BY p.id, u.id);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_feed_share
AS
( SELECT share.id,
    share."createdAt",
    share."updatedAt",
    share.visible,
    to_json(author.*) AS author,
    true AS "isShare",
    to_json(post.*) AS post,
    to_json(gallery.*) AS gallery,
    to_json(author.image) AS image,
    to_json(ch.*) AS "character",
    to_json(book.*) AS book
   FROM (((((("Share" share
     LEFT JOIN "User" author ON ((share."authorId" = author.id)))
     LEFT JOIN v_post_stub post ON ((share."postId" = post.id)))
     LEFT JOIN v_gallery_stub gallery ON ((gallery.id = share."galleryId")))
     LEFT JOIN "Character" ch ON ((ch.id = share."characterId")))
     LEFT JOIN v_book_stub book ON ((book.id = share."bookId")))
     LEFT JOIN "Image" image ON ((image.id = share."imageId")))
  WHERE (share.visible = true)
  ORDER BY share."updatedAt" DESC);
  
  
-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_feed_main
AS
( SELECT p.id,
    p."createdAt",
    p."updatedAt",
    p.visible,
    p.author,
    p."isShare",
    (p.post)::text AS post,
    p.gallery,
    p."character",
    p.book
   FROM v_feed_post p
UNION ALL
 SELECT s.id,
    s."createdAt",
    s."updatedAt",
    s.visible,
    s.author,
    s."isShare",
    (s.post)::text AS post,
    (s.gallery)::text AS gallery,
    (s."character")::text AS "character",
    (s.book)::text AS book
   FROM v_feed_share s);



-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_canmessage
AS
( SELECT u.id,
    u.name,
    u.image,
    x."followingId" AS messagerid
   FROM (("Follow" x
     JOIN "Follow" y ON (((y."followerId" = x."followingId") AND (y."followingId" = x."followerId"))))
     JOIN "User" u ON ((u.id = x."followerId"))));



-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE VIEW v_cyfruser
AS
( SELECT usr.id,
    usr.name,
    usr.email,
    usr.image,
    usr.slug,
    (count(posts.*))::integer AS postcount,
    (count(DISTINCT followers."followerId"))::integer AS followercount,
    (count(DISTINCT followers."followerId") FILTER (WHERE (followers."isFan" = true)))::integer AS fancount,
    (count(DISTINCT follows."followingId"))::integer AS followcount,
    (count(DISTINCT follows."followingId") FILTER (WHERE (follows."isFan" = true)))::integer AS stancount,
    to_json(membership.*) AS membership,
    json_agg(chat.*) AS canmessage,
    json_agg(followers.*) AS followers,
    json_agg(books.follows) AS following,
    json_agg(galleries.*) AS galleries,
    json_agg(books.*) AS books,
    json_agg(posts.*) AS posts
   FROM ((((((("User" usr
     LEFT JOIN "Membership" membership ON ((membership.id = usr."membershipId")))
     LEFT JOIN v_post_stub posts ON (((posts."authorId" = usr.id) AND (posts.visible = true))))
     LEFT JOIN v_gallery_stub galleries ON (((galleries."authorId" = usr.id) AND (galleries.visible = true))))
     LEFT JOIN v_following_stub followers ON ((followers."followingId" = usr.id)))
     LEFT JOIN v_follower_stub follows ON ((follows."followerId" = usr.id)))
     LEFT JOIN v_canmessage chat ON ((chat.messagerid = usr.id)))
     LEFT JOIN ( SELECT b.id,
            b."createdAt",
            b."updatedAt",
            b."startedAt",
            b."completeAt",
            b.active,
            b.status,
            b.prospect,
            b.fiction,
            b.title,
            b.slug,
            b.hook,
            b.synopsis,
            b.back,
            b.words,
            b."galleryId",
            b."genreId",
            b.genre,
            b.authors,
            b.cover,
            b.likes,
            b.follows,
            b.shares,
            b.chapters,
            b.characters,
            b.categories,
            ub."B" AS authorid
           FROM (v_book_stub b
             JOIN _user_books ub ON ((ub."A" = b.id)))) books ON ((books.authorid = usr.id)))
  GROUP BY usr.id, membership.id);