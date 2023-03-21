-- FUNCTION: public.usergalleries(text)

DROP FUNCTION IF EXISTS public.usergalleries(text);

CREATE OR REPLACE FUNCTION public.usergalleries(
	userid text)
    RETURNS json
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
		  SELECT json_agg(galleries) as "galleries"
		  FROM (
			SELECT g."id", g."createdAt", g."updatedAt"
			FROM "public"."Gallery" g
			WHERE g."authorId" = $1
			AND g."visible" = true
		 ) galleries
$BODY$;

ALTER FUNCTION public.usergalleries(text)
    OWNER TO doadmin;
