-- FUNCTION: public.userinfoall(text)

-- DROP FUNCTION IF EXISTS public.userinfoall(text);

CREATE OR REPLACE FUNCTION public.userinfoall(
	l int = 100,
	o int = 0)
    RETURNS table (
		id text
		, name text
		, email text
		, image text
		, membership json
		, posts json
		, galleries json
	)
    LANGUAGE 'sql'
AS $BODY$
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
$BODY$;

ALTER FUNCTION public.userinfoall(text)
    OWNER TO doadmin;
