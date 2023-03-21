create or replace function cyfrUser(uid text)
  returns table(
	id text,
	name text,
	email text,
	image text,
	membership json,
	galleries json,
	canMention json,
	canMessage json,
	posts json
  )
as
$body$
  SELECT 
	u."id"
	, u."name"
	, u."email"
	, u."image",
	-- USER MEMBERSHIP
	to_json(membership) as "membership",
	-- USER GALLERIES
	to_json(usergalleries($1)) as "galleries",
	-- USER CANMENTION
	(SELECT json_agg(mentions) as "canMention"
	FROM (
		SELECT * FROM canMention($1)
	) mentions),
	-- USER CANMESSAGE
	(SELECT json_agg(messages) as "canMessage"
	FROM (
		SELECT * FROM canMessage($1)
	) messages),
	-- USER POSTS
	(SELECT json_agg(posts) as "posts"
		FROM (
			SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
			-- POST LIKES
			(SELECT json_agg(likes) as likes
				FROM(
					select postLikes(p."id")
				)likes
			),
			-- POST SHARES
			(SELECT json_agg(shares) as shares
				FROM(
					select postShares(p."id")
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
$body$
language sql;