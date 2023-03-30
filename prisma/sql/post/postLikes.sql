create or replace function postLikes(postId text)
  returns json
as
$body$
    -- GET POST (LIKES + USER)
    SELECT json_agg(likes) as "likes"
    FROM (
        SELECT l."id", l."createdAt", l."updatedAt", liked."name" as "userName", liked."image" as "userImage"
        FROM "public"."Like" l
            LEFT JOIN "User" liked ON liked.id = l."authorId"
        WHERE l."postId" = $1
        ) likes
$body$
language sql;
