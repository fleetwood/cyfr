-- ///////////////////////////////
-- // DO NOT DELETE //////////////
-- // SELECT FNS and IDX /////////
SELECT pg_get_functiondef(f.oid)
FROM pg_catalog.pg_proc f
INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
WHERE n.nspname = 'public';

SELECT indexdef||';' 
AS idxdef 
FROM pg_indexes 
WHERE schemaname <>'pg_catalog'
ORDER BY 1;
-- // DO NOT DELETE //////////////
-- ///////////////////////////////

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

$function$;

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
$function$;

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

$function$;

CREATE OR REPLACE FUNCTION public.f_user_info(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  SELECT to_json(usr) as "user"
	FROM (
		SELECT u."id", u."name", u."email", u."image",
		to_json(membership) as "membership",
		f_user_posts(u."id") as "posts",
		f_user_galleries(u."id") as "galleries"
	FROM "public"."User" u
		LEFT JOIN "public"."Membership" membership on membership.id = u."membershipId"
    WHERE u.id = $1
		) usr
$function$;

CREATE OR REPLACE FUNCTION public.f_user_infoall(l integer DEFAULT 100, o integer DEFAULT 0)
 RETURNS TABLE(id text, name text, email text, image text, membership json, posts json, galleries json)
 LANGUAGE sql
AS $function$
	SELECT *
	FROM (
		SELECT u."id", u."name", u."email", u."image",
		  to_json(membership) as "membership",
		(SELECT f_user_posts(u."id") as "posts"),
		(SELECT f_user_galleries(u."id") as "galleries")
		FROM "public"."User" u
			LEFT JOIN "public"."Membership" membership on membership.id = u."membershipId"
	) usr
	LIMIT $1
	OFFSET $2
$function$;

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
$function$;

CREATE OR REPLACE FUNCTION public.f_user_followers(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  
SELECT json_agg(da) as "followers" 
FROM (
	SELECT distinct
	u."name"
	, u."id"
	, u."image"
	, followers."isFan"
	FROM "Follow" followers 
	INNER JOIN  "User" u 
		ON followers."followerId" = u."id"
	WHERE followers."followingId" = $1
)da;
$function$;

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
	
$function$;

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

$function$;

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
	
$function$;

CREATE OR REPLACE FUNCTION public.f_user_galleries_data(userid text)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, title text, description text, images "Image"[])
 LANGUAGE sql
AS $function$

SELECT g."id"
	, g."createdAt"
	, g."updatedAt"
	, g."visible"
	, g."title"
	, g."description"
	, array_agg(images) as "images"
FROM "public"."Gallery" g
	LEFT JOIN "Image" images on images."galleryId" = g."id"
WHERE g."authorId" = $1
AND g."visible" = true
GROUP BY g.id

$function$;

CREATE OR REPLACE FUNCTION public.f_user_galleries(userid text)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, title text, description text, images "Image"[])
 LANGUAGE sql
AS $function$

SELECT g."id"
	, g."createdAt"
	, g."updatedAt"
	, g."visible"
	, g."title"
	, g."description"
	, array_agg(images) as "images"
FROM "public"."Gallery" g
	LEFT JOIN "Image" images on images."galleryId" = g."id"
WHERE g."authorId" = $1
AND g."visible" = true
GROUP BY g.id

$function$;

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
	-- USER MEMBERSHIP
	to_json(membership) as "membership",
	-- USER GALLERIES
	( SELECT json_agg(glry) as "galleries"
	 	FROM (SELECT * FROM f_user_galleries(u."id") as gallery) glry
	 ),
	
	-- USER FOLLOWS
	(SELECT f_user_follows(u."id") as "follows"),
	-- USER FOLLOWERS
	(SELECT f_user_followers(u."id") as "followers"),
	
	-- USER CANMENTION
	(SELECT f_can_mention(u."id") as "canMention"),
	-- USER CANMESSAGE
	(SELECT f_can_message(u."id") as "messagable"),
	-- USER POSTS
	(SELECT json_agg(posts) as "posts"
		FROM (
			SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
			-- POST LIKES
			(SELECT json_agg(likes) as likes
				FROM(
					select f_post_Likes(p."id")
				)likes
			),
			-- POST SHARES
			(SELECT json_agg(shares) as shares
				FROM(
					select f_post_Shares(p."id")
				)shares
			)
			FROM "public"."Post" p
			WHERE p."authorId" = u."id"
			AND p."visible" = true
		) posts	
	)
	-- END OF SUBQUERIES YEESH
	FROM "public"."User" u
		LEFT JOIN "public"."Membership" membership on membership.id = u."membershipId"
	WHERE u.id = $1
	OR LOWER(u."name") = LOWER($1)
	OR LOWER(u."email") = LOWER($1)
)usr
$function$;

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

$function$;

CREATE OR REPLACE FUNCTION public.f_share_posts(lmt integer, oft integer)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, authorid text, postid text, galleryid text, imageid text, author json, post json)
 LANGUAGE sql
AS $function$

SELECT "share".*
	, to_json(author) AS "author"
	, to_json(f_post_detail("share"."postId")) AS "post"
FROM "Share" "share"
	LEFT JOIN "User" author 
		ON "share"."authorId" = author."id"
	-- and author is not blocked by user
WHERE "share"."postId" NOTNULL
ORDER BY "updatedAt" DESC
LIMIT (lmt)
OFFSET (oft)
	
$function$;

CREATE OR REPLACE FUNCTION public.f_genre_all()
 RETURNS TABLE(id text, createdat timestamp without time zone, updatedat timestamp without time zone, title text, description text, fiction boolean, covers json)
 LANGUAGE sql
AS $function$

select genre.* 
	, json_agg(covers) as "covers"
FROM "Genre" genre
	LEFT JOIN "Covers" covers on genre."id" = covers."genreId"
GROUP BY genre."id"

$function$;

CREATE OR REPLACE FUNCTION public.f_genre_detail(genreid text, bookstatus "BookStatus")
 RETURNS TABLE(id text, createdat timestamp without time zone, updatedat timestamp without time zone, title text, description text, fiction boolean, covers json, books json)
 LANGUAGE sql
AS $function$

select genre.* 
	, json_agg(covers) as "covers"
	, json_agg(book) as "books"
FROM "Genre" genre
	LEFT JOIN "Covers" covers on genre."id" = covers."genreId"
	LEFT JOIN "Book" book on genre."id" = book."genreId"
		AND book."status" = bookStatus
		-- AND author is in good standing
WHERE LOWER(genre."title") = LOWER(genreId)
	OR genre."id" = genreId
GROUP BY genre."id"
$function$;

-- //////////////////
-- // IDX

CREATE INDEX FollowingId_key ON public.Follow USING btree (followingId, followerId);
CREATE UNIQUE INDEX LikePost_key ON public.Like USING btree (id, postId);
CREATE UNIQUE INDEX Post_id_key ON public.Post USING btree (id);
CREATE UNIQUE INDEX SharePost_key ON public.Share USING btree (id, postId);
CREATE UNIQUE INDEX User_id_key ON public.User USING btree (id);
