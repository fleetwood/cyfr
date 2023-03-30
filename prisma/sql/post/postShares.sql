create or replace function postShares(postId text)
  returns json
as
$body$
    -- GET POST (SHARES + USER)
    SELECT json_agg(shares) as "shares"
    FROM (
        SELECT l."id", l."createdAt", l."updatedAt", shared."name" as "userName", shared."image" as "userImage"
        FROM "public"."Share" l
            LEFT JOIN "User" shared ON shared.id = l."authorId"
        WHERE l."postId" = $1
        ) shares
$body$
language sql;
