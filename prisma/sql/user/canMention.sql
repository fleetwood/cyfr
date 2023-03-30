-- FUNCTION: public.canMention(text)

DROP FUNCTION IF EXISTS public.canMention(text);

CREATE OR REPLACE FUNCTION public.canMention(uid text)
    RETURNS table (
		userId text,
		userName text,
		userImage text
	)
    LANGUAGE 'sql'
AS $BODY$

select * from userFollowers($1)
union
select * from userFans($1)

$BODY$;

ALTER FUNCTION public.canMention(text)
    OWNER TO doadmin;
