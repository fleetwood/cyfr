-- FUNCTION: public.userFans(text)

DROP FUNCTION IF EXISTS public.userFans(text);

CREATE OR REPLACE FUNCTION public.userFans(uid text)
    RETURNS table (
		userId text,
		userName text,
		userImage text
	)
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
select u.id as "userId", u.name as "userName", u.image as "userImage" 
from "Fan" 
	LEFT JOIN "User" u on u.id = "Fan"."fanId"
where "fanOfId" = $1
$BODY$;

ALTER FUNCTION public.userFans(text)
    OWNER TO doadmin;
