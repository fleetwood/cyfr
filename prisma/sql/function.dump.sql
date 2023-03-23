-- //////////////////
-- FUNCTION USER FANS
CREATE OR REPLACE FUNCTION public.f_user_fans(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
SELECT json_agg(da) as "fans" 
FROM (
	select u.id as "userId", u.name as "userName", u.image as "userImage" 
	from "Fan" 
		LEFT JOIN "User" u on u.id = "Fan"."fanId"
	where "fanOfId" = $1
)da
$function$

-- //////////////////
-- FUNCTION USER FOLLOWERS
CREATE OR REPLACE FUNCTION public.f_user_followers(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  
SELECT json_agg(da) as "followers" 
FROM (
	select u.id as "userId", u.name as "userName", u.image as "userImage" 
	from "Follow" 
		LEFT JOIN "User" u on u.id = "Follow"."followerId"
	where "followingId" = $1
)da;
$function$

-- //////////////////
-- FUNCTION USER STANS
CREATE OR REPLACE FUNCTION public.f_user_stans(uid text)
 RETURNS TABLE(userid text, username text, userimage text)
 LANGUAGE sql
AS $function$
select u.id as "userId", u.name as "userName", u.image as "userImage" 
from "Fan" 
	LEFT JOIN "User" u on u.id = "Fan"."fanOfId"
where "fanId" = $1
$function$

-- //////////////////
-- FUNCTION USER FOLLOWS
CREATE OR REPLACE FUNCTION public.f_user_follows(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(da) as "follows" 
FROM (
	select u.id as "userId", u.name as "userName", u.image as "userImage" 
	from "Follow" 
		LEFT JOIN "User" u on u.id = "Follow"."followingId"
	where "followerId" = $1
)da;

$function$

-- //////////////////
-- FUNCTION ALL USER INFO
CREATE OR REPLACE FUNCTION public.f_user_infoall(l integer DEFAULT 100, o integer DEFAULT 0)
 RETURNS TABLE(id text, name text, email text, image text, membership json, posts json, galleries json)
 LANGUAGE sql
AS $function$
	SELECT *
	FROM (
		SELECT u."id", u."name", u."email", u."image",
		  to_json(membership) as "membership",
		(
			-- GET USER POSTS
		  SELECT json_agg(posts) as "posts"
		  FROM (
			SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
				(
					-- GET POST (LIKES + USER)
					SELECT json_agg(likes) as "likes"
					FROM (
						SELECT l."id", l."createdAt", l."updatedAt", liked."name" as "userName", liked."image" as "userImage"
						FROM "public"."Like" l
							LEFT JOIN "User" liked ON liked.id = l."authorId"
						WHERE l."postId" = p."id"
					  ) likes
				),
			  (
					-- GET POST (SHARES + USER)
					SELECT json_agg(shares) as "shares"
					FROM (
						SELECT s."id", s."createdAt", s."updatedAt", shared."name" as "userName", shared."image" as "userImage"
						FROM "public"."Share" s
							LEFT JOIN "User" shared ON shared.id = s."authorId"
						WHERE s."postId" = p."id"
					  ) shares
				)
			FROM "public"."Post" p
			WHERE p."authorId" = u."id"
			AND p."visible" = true
		  ) posts
		),
		(
		  SELECT usergalleries(u."id") as "galleries"
		)
	FROM "public"."User" u
		LEFT JOIN "public"."Membership" membership on membership.id = u."membershipId"
    
		) usr
	LIMIT $1
	OFFSET $2
$function$

-- //////////////////
-- FUNCTION USER CAN MENTION
CREATE OR REPLACE FUNCTION public.f_can_mention(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

select json_agg(mention) as "canMention"
from(
	select * from f_user_Followers($1)
	union
	select * from f_user_Fans($1)
)mention
$function$

-- //////////////////
-- FUNCTION USER GALLERIES
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

-- //////////////////
-- FUNCTION POST SHARES
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

-- //////////////////
-- FUNCTION USER CAN MESSAGE
CREATE OR REPLACE FUNCTION public.f_can_message(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
select json_agg(messagable) as "messagable"
from (
	
select * from f_user_Follows($1)
where username in (
	select username from f_user_Followers($1)
)
union 
select * from f_user_Followers($1)
where username in (
	select username from f_user_Follows($1)
)
union
select * from f_user_Fans($1)
where username in (
	select username from f_user_Stans($1)
)
union 
select * from f_user_Stans($1)
where username in (
	select username from f_user_Fans($1)
)
)messagable

$function$

-- //////////////////
-- FUNCTION CYFRUSER
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
)usr
$function$

-- //////////////////
-- FUNCTION USER INFO
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

-- //////////////////
-- FUNCTION USER POSTS
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
