-- FUNCTION: public.canMessage(text)

DROP FUNCTION IF EXISTS public.canMessage(text);

CREATE OR REPLACE FUNCTION public.canMessage(uid text)
    RETURNS table (
		userId text,
		userName text,
		userImage text
	)
    LANGUAGE 'sql'
AS $BODY$

select * from userFollows($1)
where username in (
	select username from userFollowers($1)
)
union 
select * from userFollowers($1)
where username in (
	select username from userFollows($1)
)
union
select * from userFans($1)
where username in (
	select username from userStans($1)
)
union 
select * from userStans($1)
where username in (
	select username from userFans($1)
)

$BODY$;

ALTER FUNCTION public.canMessage(text)
    OWNER TO doadmin;

