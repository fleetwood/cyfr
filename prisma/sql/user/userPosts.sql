--//////////////////////////////////
-- OLDOLDOLDOLD
-- create or replace function userPosts(userId text)
--   returns json
-- as
-- $body$
--     SELECT json_agg(posts) as "posts"
-- 	  FROM (
-- 		SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
-- 		  ( select postLikes(p."id") as likes),
-- 		  ( select postShares(p."id") as shares)
-- 		FROM "public"."Post" p
-- 		WHERE p."authorId" = $1
-- 		AND p."visible" = true
-- 	  ) posts
-- $body$
-- language sql;

-- FUNCTION: public.f_user_posts(text)

-- DROP FUNCTION IF EXISTS public.f_user_posts(text);
-- OLDOLDOLDOLD
--//////////////////////////////////

CREATE OR REPLACE FUNCTION public.f_user_posts(
	userid text)
    RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, content text, shareid text, commentid text, authorid text, shares json, likes json) 
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

SELECT *
FROM (
	SELECT *,
	(
		select json_agg(agg) as shares
			 FROM (
				 select f_post_Shares(post."id") as "share"
		 )agg
	),
	(
		select json_agg(lk) as likes
			 FROM (
				 select f_post_Likes(post."id") as "like"
			 )lk 
	)
	FROM "public"."Post" post
	WHERE 	post."authorId" = $1
	AND 	post."visible" = true
) posts;

$BODY$;

ALTER FUNCTION public.f_user_posts(text)
    OWNER TO doadmin;
