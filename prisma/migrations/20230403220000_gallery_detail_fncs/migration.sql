-- Active: 1680234435741@@cyfr-db-digital-ocean-dev-do-user-13643467-0.b.db.ondigitalocean.com@25060@defaultdb@public

--//////////////////////////////////////////////////
--// GALLERY SHARES
DROP FUNCTION IF EXISTS public.f_gallery_shares(text);

CREATE OR REPLACE FUNCTION public.f_gallery_shares(
	galleryid text)
    RETURNS json
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    
	SELECT json_agg(sh) as "shares"
	FROM (
		SELECT author."id", author."name", author."image"
		FROM "public"."Share" "share"
			LEFT JOIN "User" author ON author.id = "share"."authorId"
		WHERE "share"."galleryId" = $1
	) sh
	
$BODY$;

ALTER FUNCTION public.f_gallery_shares(text)
    OWNER TO doadmin;



--//////////////////////////////////////////////////
--// GALLERY LIKES
DROP FUNCTION IF EXISTS public.f_gallery_likes(text);

CREATE OR REPLACE FUNCTION public.f_gallery_likes(
	galleryid text)
    RETURNS json
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    
	SELECT json_agg(lk) as "likes"
	FROM (
		SELECT author."id", author."name", author."image"
		FROM "public"."Like" l
			LEFT JOIN "User" author ON author.id = l."authorId"
		WHERE l."galleryId" = $1
	) lk
$BODY$;

ALTER FUNCTION public.f_gallery_likes(text)
    OWNER TO doadmin;


--//////////////////////////////////////////////////
--// GALLERY DETAIL
DROP FUNCTION IF EXISTS public.f_gallery_detail(text);

CREATE OR REPLACE FUNCTION public.f_gallery_detail(galleryId text)
 RETURNS TABLE(
      id text
    , createdat text
    , updatedat text
    , visible boolean
    , title text
    , description text
    , author json
    , images json
    , likes json
    , shares json
    )
 LANGUAGE sql
AS $function$

SELECT g."id"
	, g."createdAt"
	, g."updatedAt"
	, g."visible"
	, g."title"
	, g."description"
    , to_json(u) as "author"
	, json_agg(images) as "images"
    , (SELECT * FROM f_gallery_likes(g.id)) as "likes"
    , (SELECT * FROM f_gallery_shares(g.id)) as "shares"
FROM "public"."Gallery" g
	LEFT JOIN "Image" images on images."galleryId" = g."id"
    LEFT JOIN "User" u on g."authorId" = u."id"
WHERE g."id" = $1
AND g."visible" = true
GROUP BY g.id, u.id

$function$;

ALTER FUNCTION public.f_gallery_detail(text)
    OWNER TO doadmin;