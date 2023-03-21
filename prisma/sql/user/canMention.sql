-- FUNCTION: public.userStans(text)

DROP FUNCTION IF EXISTS public.userStans(text);

CREATE OR REPLACE FUNCTION public.userStans(uid text)
    RETURNS table (
		userId text,
		userName text,
		userImage text
	)
    LANGUAGE 'sql'
AS $BODY$
select u.id as "userId", u.name as "userName", u.image as "userImage" 
from "Fan" 
	LEFT JOIN "User" u on u.id = "Fan"."fanOfId"
where "fanId" = $1
$BODY$;

ALTER FUNCTION public.userStans(text)
    OWNER TO doadmin;
