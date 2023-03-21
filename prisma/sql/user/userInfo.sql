create or replace function userInfo(uid text)
  returns json
as
$body$
  SELECT to_json(usr) as "user"
	FROM (
		SELECT u."id", u."name", u."email", u."image",
		  to_json(membership) as "membership",
		(
			-- GET USER POSTS
		  SELECT json_agg(posts) as "posts"
		  FROM (
			SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
			  ( select postLikes(p."id) as likes ),
			  ( select postShares(p."id) as shares )
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
    WHERE u.id = $1
		) usr
$body$
language sql;