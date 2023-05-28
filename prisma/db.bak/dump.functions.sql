-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_book_wordcount(bookid text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE "Book" 
    SET words = (
        SELECT sum(words) FROM "Chapter" WHERE "bookId" = $1
    )
    WHERE id = $1;
    return 0;
END;
$function$

-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_can_mention(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

select json_agg(mention) as "canMention"
from(
	select u.id, u.name, u.image
	from "Follow" 
		LEFT JOIN "User" u on u.id = "Follow"."followerId"
	where "followingId" = $1
)mention
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_can_message(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
select json_agg(messagable) as "messagable"
from (
	--  mutual followers
	SELECT DISTINCT u.id, u."name", u."image"
	FROM "Follow" x
		INNER JOIN "Follow" y ON (y."followerId" = x."followingId" AND y."followingId" = x."followerId")
		INNER JOIN "User" u ON u.id = x."followerId"
	WHERE x."followingId" = $1
)messagable

$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_cyfruser(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
select to_json(usr) as "cyfrUser"
FROM (
	  SELECT 
	u."id"
	, u."name"
	, u."email"
	, u."image",
	
	to_json(membership) as "membership",	
	
	(SELECT f_user_follows(u."id") as "follows"),
	
	(SELECT f_user_followers(u."id") as "followers"),
		
	(SELECT f_can_mention(u."id") as "canMention"),
	
	(SELECT f_can_message(u."id") as "messagable"),
		
 	
	( SELECT json_agg(glry) as "galleries"
	 	FROM (SELECT * FROM f_user_galleries(u."id") as gallery) glry
	 ),

 	
	(SELECT json_agg(b)
    FROM (
        SELECT stubs.*
        FROM v_book_stub as stubs
            CROSS JOIN LATERAL json_array_elements(authors) a
        WHERE a->>'id' = u."id"
    ) b)  as "books",

 	
	(SELECT json_agg(posts) as "posts"
		FROM (
			SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
			
			(SELECT json_agg(likes) as likes
				FROM(
					select f_post_Likes(p."id")
				)likes
			),
			
			(SELECT json_agg(shares) as shares
				FROM(
					select f_post_Shares(p."id")
				)shares
			)
			FROM "public"."Post" p
			WHERE p."authorId" = u."id"
		) posts	
	)
	
	FROM "public"."User" u
		LEFT JOIN "public"."Membership" membership on membership.id = u."membershipId"
	WHERE u.id = $1
	OR LOWER(u."name") = LOWER($1)
	OR LOWER(u."email") = LOWER($1)
)usr
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_gallery_detail(galleryid text)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, title text, description text, author json, images json, likes json, shares json)
 LANGUAGE sql
AS $function$

SELECT g."id"
	, g."createdAt"
	, g."updatedAt"
	, g."visible"
	, g."title"
	, g."description"
    , to_json(u) as "author"
	, json_agg(images) as "images"
    , (SELECT * FROM f_gallery_likes(g.id)) as "likes"
    , (SELECT * FROM f_gallery_shares(g.id)) as "shares"
FROM "public"."Gallery" g
	LEFT JOIN "Image" images on images."galleryId" = g."id"
    LEFT JOIN "User" u on g."authorId" = u."id"
WHERE g."id" = $1
AND g."visible" = true
GROUP BY g.id, u.id

$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_gallery_likes(galleryid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    
	SELECT json_agg(lk) as "likes"
	FROM (
		SELECT author."id", author."name", author."image"
		FROM "public"."Like" l
			LEFT JOIN "User" author ON author.id = l."authorId"
		WHERE l."galleryId" = $1
	) lk
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_gallery_shares(galleryid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    
	SELECT json_agg(sh) as "shares"
	FROM (
		SELECT author."id", author."name", author."image"
		FROM "public"."Share" "share"
			LEFT JOIN "User" author ON author.id = "share"."authorId"
		WHERE "share"."galleryId" = $1
	) sh
	
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_genre_all()
 RETURNS TABLE(id text, "createdAt" timestamp without time zone, "updatedAt" timestamp without time zone, slug text, title text, description text, "galleryId" text, gallery json)
 LANGUAGE sql
AS $function$

SELECT genre.* 
	, json_agg(gallery) as "gallery"
FROM "Genre" genre
	LEFT JOIN (
        SELECT gallery."id"
            , gallery."createdAt"
            , gallery."updatedAt"
            , gallery."visible"
            , gallery."title"
            , gallery."description"
            , json_agg(images) as "images"
        FROM "Gallery" gallery
            LEFT JOIN "Image" images 
            ON images."galleryId" = gallery."id"
        GROUP BY gallery."id"
    ) gallery on gallery."id" = genre."galleryId"
GROUP BY genre."id"

$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_genre_detail(genreid text, bookstatus "BookStatus")
 RETURNS TABLE(id text, createdat timestamp without time zone, updatedat timestamp without time zone, slug text, title text, description text, galleryid text, gallery json, books json)
 LANGUAGE sql
AS $function$

SELECT genre.* 
	, json_agg(gallery) as "gallery"
	, json_agg(book) as "books"
FROM "Genre" genre
	LEFT JOIN (
        SELECT gallery."id"
            , gallery."createdAt"
            , gallery."updatedAt"
            , gallery."visible"
            , gallery."title"
            , gallery."description"
            , json_agg(images) as "images"
        FROM "Gallery" gallery
            LEFT JOIN "Image" images 
            ON images."galleryId" = gallery."id"
        GROUP BY gallery."id"
    ) gallery on gallery."id" = genre."galleryId"
	LEFT JOIN "Book" book on genre."id" = book."genreId"
		AND book."status" = bookStatus
		-- AND author is in good standing
WHERE LOWER(genre."title") = LOWER(genreid)
	OR genre."id" = genreid
GROUP BY genre."id"
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_post_detail(postid text)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, content text, sharedid text, commentid text, authorid text, author json, shares json, likes json, images json)
 LANGUAGE sql
AS $function$

SELECT p.*
		, to_json(u) as "author"
		, (SELECT * FROM f_post_shares(p."id")) as "shares"
		, (SELECT * FROM f_post_likes(p."id")) as "likes"
		, json_agg(images) as "images"
	FROM "public"."Post" p
	LEFT JOIN "Image" images on images."postId" = p."id"
		AND images."visible" = true
	LEFT JOIN "User" u on u."id" = p."authorId"
    WHERE p."id" = $1
		AND p."visible" = true
	GROUP BY p."id", u."id"

$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_post_feed(lmt integer DEFAULT 100, oft integer DEFAULT 0)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, content text, author json, shares json, likes json, images json)
 LANGUAGE sql
AS $function$

SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content"
	, to_json(u) as "author"
	, (SELECT * FROM f_post_shares(p."id")) as "shares"
	, (SELECT * FROM f_post_likes(p."id")) as "likes"
	, json_agg(images) as "images"
FROM "public"."Post" p
LEFT JOIN "Image" images on images."postId" = p."id"
	AND images."visible" = true
LEFT JOIN "User" u on u."id" = p."authorId"
WHERE p."visible" = true
GROUP BY p."id", u."id"
LIMIT (lmt)
OFFSET (oft)
	
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_post_likes(postid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    -- GET (LIKES + USER)
	SELECT json_agg(lk) as "likes"
	FROM (
		SELECT author."id", author."name", author."image"
		FROM "public"."Like" l
			LEFT JOIN "User" author ON author.id = l."authorId"
		WHERE l."postId" = $1
	) lk
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_post_shares(postid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    -- GET (SHARES + USER)
	SELECT json_agg(sh) as "shares"
	FROM (
		SELECT author."id", author."name", author."image"
		FROM "public"."Share" "share"
			LEFT JOIN "User" author ON author.id = "share"."authorId"
		WHERE "share"."postId" = $1
	) sh
	
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_share_posts(lmt integer, oft integer)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, authorid text, postid text, author json, post json)
 LANGUAGE sql
AS $function$

SELECT "share".id
	, share."createdAt"
	, share."updatedAt"
	, share.visible
	, share."authorId"
	, share."postId"
	, to_json(author) AS "author"
	, to_json(f_post_detail("share"."postId")) AS "post"
FROM "Share" "share"
	LEFT JOIN "User" author 
		ON "share"."authorId" = author."id"
	
WHERE "share"."postId" NOTNULL
ORDER BY "updatedAt" DESC
LIMIT (lmt)
OFFSET (oft)
	
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_user_followers(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  
SELECT json_agg(da) as "followers" 
FROM (
	SELECT distinct
	follower."name"
	, follower."id"
	, follower."image"
	, followers."isFan"
	FROM "Follow" followers 
	INNER JOIN  "User" follower 
		ON followers."followerId" = follower."id"
	INNER JOIN  "User" "following" 
		ON followers."followingId" = "following"."id"
	WHERE "following"."id" = $1
        OR LOWER("following"."name" ) = LOWER($1)
)da;
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_user_follows(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(da) as "follows" 
FROM (
	SELECT distinct
	u."name"
	, u."id"
	, u."image"
	, followers."isFan"
	FROM "Follow" followers 
	INNER JOIN  "User" u 
		ON followers."followingId" = u."id"
	WHERE followers."followerId" = $1
)da;

$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_user_galleries(userid text)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, title text, description text, images json)
 LANGUAGE sql
AS $function$

SELECT g."id"
	, g."createdAt"
	, g."updatedAt"
	, g."visible"
	, g."title"
	, g."description"
	, json_agg(images) as "images"
FROM "public"."Gallery" g
	LEFT JOIN "Image" images 
		on images."galleryId" = g."id"
		AND images."visible" = true
    LEFT JOIN "User" u on g."authorId" = u."id"
WHERE u."id" = $1
    OR LOWER(u."name") = LOWER($1)
    OR LOWER(u."slug") = LOWER($1)
AND g."visible" = true
GROUP BY g.id

$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_user_info(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  SELECT to_json(u) as "user"
	FROM (
		SELECT usr."id"
		, usr."name"
		, usr."email"
		, usr."image"
		, COUNT(DISTINCT p.id) as posts
		, COUNT(DISTINCT f.id) as followers
		, COUNT(DISTINCT f.id) filter (WHERE f."isFan" = true) as fans
		, COUNT(DISTINCT ff.id) as follows
		, COUNT(DISTINCT ff.id) filter (WHERE ff."isFan" = true) as stans
		, COUNT(DISTINCT(book."bookId")) as books
		, COUNT(DISTINCT(gallery.id)) as galleries
		, to_json(membership) as "membership"
	FROM "User" usr
		LEFT JOIN (
			SELECT u.id as "userId"
				, book.id as "bookId"
			FROM "User" u
			JOIN _user_books ub ON u.id = ub."B"
			JOIN "Book" book ON ub."A" = book.id
		) book ON book."userId" = usr.id
		LEFT JOIN "Membership" membership on membership.id = usr."membershipId"
		LEFT JOIN "Gallery" gallery ON gallery."authorId" = usr.id AND gallery.visible = true
		LEFT JOIN "Post" p ON p."authorId" = usr.id AND p.visible = true
		LEFT JOIN "Follow" f ON f."followingId" = usr.id
		LEFT JOIN "Follow" ff ON ff."followerId" = usr.id
    WHERE usr.id = $1
        OR LOWER(usr."name") = LOWER($1)
	GROUP BY usr."id", membership."id"
	) u
$function$


-- ////////////////////////////////////////////////
-- ////////////////////////////////////////////////
-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public
CREATE OR REPLACE FUNCTION public.f_user_posts(userid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(ds) as "posts"
FROM (
	SELECT *
		, f_post_shares(p."id") as "shares"
		, f_post_likes(p."id") as "likes"
	FROM "public"."Post" p
    WHERE p."authorId" = $1
		AND p."visible" = true
) ds

$function$
