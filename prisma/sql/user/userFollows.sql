-- FUNCTION: public.userFollows(text)

DROP FUNCTION IF EXISTS public.userFollows(text);

CREATE OR REPLACE FUNCTION public.userFollows(uid text)
    RETURNS table (
		userId text,
		userName text,
		userImage text
	)
    LANGUAGE 'sql'
AS $BODY$
  select u.id as "userId", u.name as "userName", u.image as "userImage" 
from "Follow" 
	LEFT JOIN "User" u on u.id = "Follow"."followingId"
where "followerId" = $1
$BODY$;

ALTER FUNCTION public.userFollows(text)
    OWNER TO doadmin;
