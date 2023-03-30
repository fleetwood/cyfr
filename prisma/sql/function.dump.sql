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


CREATE OR REPLACE FUNCTION public.f_post_shares(postid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    -- GET (SHARES + USER)
	SELECT json_agg(sh) as "shares"
	FROM (
		SELECT l."id", l."createdAt", l."updatedAt", shared."name" as "userName", shared."image" as "userImage"
		FROM "public"."Share" l
			LEFT JOIN "User" shared ON shared.id = l."authorId"
		WHERE l."postId" = $1
	) sh
	
$function$



CREATE OR REPLACE FUNCTION public.f_post_likes(postid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    -- GET (LIKES + USER)
	SELECT json_agg(lk) as "likes"
	FROM (
		SELECT l."id", l."createdAt", l."updatedAt", liked."name" as "userName", liked."image" as "userImage"
		FROM "public"."Like" l
			LEFT JOIN "User" liked ON liked.id = l."authorId"
		WHERE l."postId" = $1
	) lk
$function$

CREATE OR REPLACE FUNCTION public.f_user_follows(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(da) as "follows" 
FROM (
	select u.id, u.name, u.image
	from "Follow" 
		LEFT JOIN "User" u on u.id = "Follow"."followingId"
	where "followerId" = $1
)da;

$function$

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


CREATE OR REPLACE FUNCTION public.f_user_galleries(userid text)
 RETURNS json
 LANGUAGE sql
AS $function$
SELECT json_agg(galleries) as "galleries"
FROM (
	SELECT g."id", g."createdAt", g."updatedAt"
	FROM "public"."Gallery" g
	WHERE g."authorId" = $1
	AND g."visible" = true
) galleries
$function$

CREATE OR REPLACE FUNCTION public.f_user_followers(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  
SELECT json_agg(da) as "followers" 
FROM (
	select u.id, u.name, u.image
	from "Follow" 
		LEFT JOIN "User" u on u.id = "Follow"."followerId"
	where "followingId" = $1
)da;
$function$



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
$function$


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
$function$



CREATE OR REPLACE FUNCTION public.f_post_feed(lmt integer DEFAULT 100, oft integer DEFAULT 0)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, content text, author json, likes json, shares json)
 LANGUAGE sql
AS $function$

	select post."id", post."createdAt", post."updatedAt", post."visible", post."content"
		, to_json(author) as "author"
		, f_post_likes(post."id") as "likes"
		, f_post_shares(post."id") as "shares"
	from "Post" post
		LEFT JOIN "User" author on post."authorId" = author."id"
	where "post"."visible" = true
	-- and author is not blocked by user
	order by "updatedAt" desc
	LIMIT (lmt)
	OFFSET (oft)
	
$function$



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
	to_json(f_user_Galleries($1)) as "galleries",
	-- USER CANMENTION
	(SELECT f_can_mention($1) as "canMention"),
	-- USER CANMESSAGE
	(SELECT f_can_message($1) as "messagable"),
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
			WHERE p."authorId" = $1
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
$function$

-- //////////////////
-- // IDX

CREATE INDEX "FollowingId_key" ON public."Follow" USING btree ("followingId", "followerId");
CREATE UNIQUE INDEX "LikePost_key" ON public."Like" USING btree (id, "postId");
CREATE UNIQUE INDEX "Post_id_key" ON public."Post" USING btree (id);
CREATE UNIQUE INDEX "SharePost_key" ON public."Share" USING btree (id, "postId");
CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);
