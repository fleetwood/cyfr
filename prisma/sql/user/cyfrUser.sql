-- FUNCTION: public.f_cyfruser(text)

-- DROP FUNCTION IF EXISTS public.f_cyfruser(text);

CREATE OR REPLACE FUNCTION public.f_cyfruser(
	uid text)
    RETURNS TABLE(id text, name text, email text, image text, membership json, galleries json, canmention json, canmessage json, posts json) 
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
	(SELECT json_agg(mentions) as "canMention"
	FROM (
		SELECT * FROM f_can_mention($1)
	) mentions),
	-- USER CANMESSAGE
	(SELECT json_agg(messages) as "canMessage"
	FROM (
		SELECT * FROM f_can_message($1)
	) messages),
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
$BODY$;

ALTER FUNCTION public.f_cyfruser(text)
    OWNER TO doadmin;
