-- FUNCTION: public.userFollowers(text)

DROP FUNCTION IF EXISTS public.userFollowers(text);

CREATE OR REPLACE FUNCTION public.userFollowers(uid text)
    RETURNS table (
		userId text,
		userName text,
		userImage text
	)
    LANGUAGE 'sql'
AS $BODY$
  select u.id as "userId", u.name as "userName", u.image as "userImage" 
from "Follow" 
	LEFT JOIN "User" u on u.id = "Follow"."followerId"
where "followingId" = $1
$BODY$;

ALTER FUNCTION public.userFollowers(text)
    OWNER TO doadmin;
