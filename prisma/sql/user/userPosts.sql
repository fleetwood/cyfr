create or replace function userPosts(userId text)
  returns json
as
$body$
    SELECT json_agg(posts) as "posts"
	  FROM (
		SELECT p."id", p."createdAt", p."updatedAt", p."visible", p."content",
		  ( select postLikes(p."id") as likes),
		  ( select postShares(p."id") as shares)
		FROM "public"."Post" p
		WHERE p."authorId" = $1
		AND p."visible" = true
	  ) posts
$body$
language sql;