-- ///////////////////////////////
-- // DO NOT DELETE //////////////
-- // SELECT FNS and IDX /////////
SELECT pg_get_functiondef(f.oid)
FROM pg_catalog.pg_proc f
INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
WHERE n.nspname = 'public';

SELECT indexdef||';' 
AS idxdef 
FROM pg_indexes 
WHERE schemaname <>'pg_catalog'
ORDER BY 1;
-- // DO NOT DELETE //////////////
-- ///////////////////////////////


CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$

CREATE OR REPLACE FUNCTION public.f_user_fans(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
SELECT json_agg(da) as ""fans"" 
FROM (
	select u.id, u.name, u.image
	from ""Fan"" 
		LEFT JOIN ""User"" u on u.id = ""Fan"".""fanId""
	where ""fanOfId"" = $1
)da
$function$

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$

CREATE OR REPLACE FUNCTION public.f_post_likes(postid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    -- GET (LIKES + USER)
	SELECT json_agg(lk) as ""likes""
	FROM (
		SELECT l.""id"", l.""createdAt"", l.""updatedAt"", liked.""name"" as ""userName"", liked.""image"" as ""userImage""
		FROM ""public"".""Like"" l
			LEFT JOIN ""User"" liked ON liked.id = l.""authorId""
		WHERE l.""postId"" = $1
	) lk
$function$

CREATE OR REPLACE FUNCTION public.f_user_follows(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(da) as ""follows"" 
FROM (
	select u.id, u.name, u.image
	from ""Follow"" 
		LEFT JOIN ""User"" u on u.id = ""Follow"".""followingId""
	where ""followerId"" = $1
)da;

$function$

CREATE OR REPLACE FUNCTION public.f_can_message(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
select json_agg(messagable) as ""messagable""
from (
	--  mutual followers
	SELECT DISTINCT u.id, u.""name"", u.""image""
	FROM ""Follow"" x
		INNER JOIN ""Follow"" y ON (y.""followerId"" = x.""followingId"" AND y.""followingId"" = x.""followerId"")
		INNER JOIN ""User"" u ON u.id = x.""followerId""
	WHERE x.""followingId"" = $1
)messagable

$function$

CREATE OR REPLACE FUNCTION public.f_user_infoall(l integer DEFAULT 100, o integer DEFAULT 0)
 RETURNS TABLE(id text, name text, email text, image text, membership json, posts json, galleries json)
 LANGUAGE sql
AS $function$
	SELECT *
	FROM (
		SELECT u.""id"", u.""name"", u.""email"", u.""image"",
		  to_json(membership) as ""membership"",
		(
			-- GET USER POSTS
		  SELECT json_agg(posts) as ""posts""
		  FROM (
			SELECT p.""id"", p.""createdAt"", p.""updatedAt"", p.""visible"", p.""content"",
				(
					-- GET POST (LIKES + USER)
					SELECT json_agg(likes) as ""likes""
					FROM (
						SELECT l.""id"", l.""createdAt"", l.""updatedAt"", liked.""name"" as ""userName"", liked.""image"" as ""userImage""
						FROM ""public"".""Like"" l
							LEFT JOIN ""User"" liked ON liked.id = l.""authorId""
						WHERE l.""postId"" = p.""id""
					  ) likes
				),
			  (
					-- GET POST (SHARES + USER)
					SELECT json_agg(shares) as ""shares""
					FROM (
						SELECT s.""id"", s.""createdAt"", s.""updatedAt"", shared.""name"" as ""userName"", shared.""image"" as ""userImage""
						FROM ""public"".""Share"" s
							LEFT JOIN ""User"" shared ON shared.id = s.""authorId""
						WHERE s.""postId"" = p.""id""
					  ) shares
				)
			FROM ""public"".""Post"" p
			WHERE p.""authorId"" = u.""id""
			AND p.""visible"" = true
		  ) posts
		),
		(
		  SELECT usergalleries(u.""id"") as ""galleries""
		)
	FROM ""public"".""User"" u
		LEFT JOIN ""public"".""Membership"" membership on membership.id = u.""membershipId""
    
		) usr
	LIMIT $1
	OFFSET $2
$function$

CREATE OR REPLACE FUNCTION public.f_user_galleries(userid text)
 RETURNS json
 LANGUAGE sql
AS $function$
SELECT json_agg(galleries) as ""galleries""
FROM (
	SELECT g.""id"", g.""createdAt"", g.""updatedAt""
	FROM ""public"".""Gallery"" g
	WHERE g.""authorId"" = $1
	AND g.""visible"" = true
) galleries
$function$

CREATE OR REPLACE FUNCTION public.f_post_shares(postid text)
 RETURNS json
 LANGUAGE sql
AS $function$
    -- GET (SHARES + USER)
	SELECT json_agg(sh) as ""shares""
	FROM (
		SELECT l.""id"", l.""createdAt"", l.""updatedAt"", shared.""name"" as ""userName"", shared.""image"" as ""userImage""
		FROM ""public"".""Share"" l
			LEFT JOIN ""User"" shared ON shared.id = l.""authorId""
		WHERE l.""postId"" = $1
	) sh
	
$function$

CREATE OR REPLACE FUNCTION public.f_user_followers(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  
SELECT json_agg(da) as ""followers"" 
FROM (
	select u.id, u.name, u.image
	from ""Follow"" 
		LEFT JOIN ""User"" u on u.id = ""Follow"".""followerId""
	where ""followingId"" = $1
)da;
$function$

CREATE OR REPLACE FUNCTION public.f_can_mention(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

select json_agg(mention) as ""canMention""
from(
	select u.id, u.name, u.image
	from ""Follow"" 
		LEFT JOIN ""User"" u on u.id = ""Follow"".""followerId""
	where ""followingId"" = $1
	INTERSECT
	select u.id, u.name, u.image
	from ""Fan"" 
		LEFT JOIN ""User"" u on u.id = ""Fan"".""fanId""
	where ""fanOfId"" = $1
)mention
$function$

CREATE OR REPLACE FUNCTION public.f_user_info(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
  SELECT to_json(usr) as ""user""
	FROM (
		SELECT u.""id"", u.""name"", u.""email"", u.""image"",
		to_json(membership) as ""membership"",
		f_user_posts(u.""id"") as ""posts"",
		f_user_galleries(u.""id"") as ""galleries""
	FROM ""public"".""User"" u
		LEFT JOIN ""public"".""Membership"" membership on membership.id = u.""membershipId""
    WHERE u.id = $1
		) usr
$function$

CREATE OR REPLACE FUNCTION public.f_user_posts(userid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(ds) as ""posts""
FROM (
	SELECT *
		, f_post_shares(p.""id"") as ""shares""
		, f_post_likes(p.""id"") as ""likes""
	FROM ""public"".""Post"" p
    WHERE p.""authorId"" = $1
		AND p.""visible"" = true
) ds

$function$

CREATE OR REPLACE FUNCTION public.f_post_feed(lmt integer DEFAULT 100, oft integer DEFAULT 0)
 RETURNS TABLE(id text, createdat text, updatedat text, visible boolean, content text, author json, likes json, shares json)
 LANGUAGE sql
AS $function$

	select post.""id"", post.""createdAt"", post.""updatedAt"", post.""visible"", post.""content""
		, to_json(author) as ""author""
		, f_post_likes(post.""id"") as ""likes""
		, f_post_shares(post.""id"") as ""shares""
	from ""Post"" post
		LEFT JOIN ""User"" author on post.""authorId"" = author.""id""
	where ""post"".""visible"" = true
	-- and author is not blocked by user
	order by ""updatedAt"" desc
	LIMIT (lmt)
	OFFSET (oft)
	
$function$

CREATE OR REPLACE FUNCTION public.f_cyfruser(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$
select to_json(usr) as ""cyfrUser""
FROM (
	  SELECT 
	u.""id""
	, u.""name""
	, u.""email""
	, u.""image"",
	-- USER MEMBERSHIP
	to_json(membership) as ""membership"",
	-- USER GALLERIES
	to_json(f_user_Galleries($1)) as ""galleries"",
	-- USER CANMENTION
	(SELECT f_can_mention($1) as ""canMention""),
	-- USER CANMESSAGE
	(SELECT f_can_message($1) as ""messagable""),
	-- USER POSTS
	(SELECT json_agg(posts) as ""posts""
		FROM (
			SELECT p.""id"", p.""createdAt"", p.""updatedAt"", p.""visible"", p.""content"",
			-- POST LIKES
			(SELECT json_agg(likes) as likes
				FROM(
					select f_post_Likes(p.""id"")
				)likes
			),
			-- POST SHARES
			(SELECT json_agg(shares) as shares
				FROM(
					select f_post_Shares(p.""id"")
				)shares
			)
			FROM ""public"".""Post"" p
			WHERE p.""authorId"" = $1
			AND p.""visible"" = true
		) posts	
	)
	-- END OF SUBQUERIES YEESH
	FROM ""public"".""User"" u
		LEFT JOIN ""public"".""Membership"" membership on membership.id = u.""membershipId""
	WHERE u.id = $1
)usr
$function$

CREATE OR REPLACE FUNCTION public.f_user_stans(uid text)
 RETURNS json
 LANGUAGE sql
AS $function$

SELECT json_agg(da) as ""follows"" 
FROM (
	select u.id, u.name, u.image
	from ""Fan"" 
		LEFT JOIN ""User"" u on u.id = ""Fan"".""fanOfId""
	where ""fanId"" = $1
)da;

$function$

CREATE OR REPLACE FUNCTION public.f_cyfruser_byName(
	uid text)
    RETURNS json
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

SELECT (select f_cyfruser(u.id))
FROM "User" u 
WHERE LOWER(u.name) = LOWER($1)

$BODY$;

ALTER FUNCTION public.f_cyfruser_byName(text)
    OWNER TO doadmin;


CREATE OR REPLACE FUNCTION public.f_cyfruser_byEmail(
	uid text)
    RETURNS json
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

SELECT (select f_cyfruser(u.id))
FROM "User" u 
WHERE LOWER(u.email) = LOWER($1)

$BODY$;

ALTER FUNCTION public.f_cyfruser_byEmail(text)
    OWNER TO doadmin;

-- //////////////////
-- // IDX
CREATE INDEX ""_book_categories_B_index"" ON public._book_categories USING btree (""B"");
CREATE INDEX ""_book_characters_B_index"" ON public._book_characters USING btree (""B"");
CREATE INDEX ""_chapter_characters_B_index"" ON public._chapter_characters USING btree (""B"");
CREATE INDEX ""FollowingId_key"" ON public.""Follow"" USING btree (""followingId"", ""followerId"");
CREATE INDEX ""_user_books_B_index"" ON public._user_books USING btree (""B"");
CREATE INDEX ""_user_chats_B_index"" ON public._user_chats USING btree (""B"");
CREATE UNIQUE INDEX ""Account_pkey"" ON public.""Account"" USING btree (id);
CREATE UNIQUE INDEX ""Account_provider_providerAccountId_key"" ON public.""Account"" USING btree (provider, ""providerAccountId"");
CREATE UNIQUE INDEX ""Block_pkey"" ON public.""Block"" USING btree (id);
CREATE UNIQUE INDEX ""_book_categories_AB_unique"" ON public._book_categories USING btree (""A"", ""B"");
CREATE UNIQUE INDEX ""BookCategory_pkey"" ON public.""BookCategory"" USING btree (id);
CREATE UNIQUE INDEX ""_book_characters_AB_unique"" ON public._book_characters USING btree (""A"", ""B"");
CREATE UNIQUE INDEX ""Book_galleryId_key"" ON public.""Book"" USING btree (""galleryId"");
CREATE UNIQUE INDEX ""Book_pkey"" ON public.""Book"" USING btree (id);
CREATE UNIQUE INDEX ""_chapter_characters_AB_unique"" ON public._chapter_characters USING btree (""A"", ""B"");
CREATE UNIQUE INDEX ""Chapter_galleryId_key"" ON public.""Chapter"" USING btree (""galleryId"");
CREATE UNIQUE INDEX ""Chapter_pkey"" ON public.""Chapter"" USING btree (id);
CREATE UNIQUE INDEX ""Character_galleryId_key"" ON public.""Character"" USING btree (""galleryId"");
CREATE UNIQUE INDEX ""Character_pkey"" ON public.""Character"" USING btree (id);
CREATE UNIQUE INDEX ""ChatMessage_pkey"" ON public.""ChatMessage"" USING btree (id);
CREATE UNIQUE INDEX ""ChatRoom_party_key"" ON public.""ChatRoom"" USING btree (party);
CREATE UNIQUE INDEX ""ChatRoom_pkey"" ON public.""ChatRoom"" USING btree (id);
CREATE UNIQUE INDEX ""Comment_pkey"" ON public.""Comment"" USING btree (id);
CREATE UNIQUE INDEX ""CommentThread_pkey"" ON public.""CommentThread"" USING btree (id);
CREATE UNIQUE INDEX ""Commune_galleryId_key"" ON public.""Commune"" USING btree (""galleryId"");
CREATE UNIQUE INDEX ""Commune_pkey"" ON public.""Commune"" USING btree (id);
CREATE UNIQUE INDEX ""Commune_threadId_key"" ON public.""Commune"" USING btree (""threadId"");
CREATE UNIQUE INDEX ""CommuneUser_pkey"" ON public.""CommuneUser"" USING btree (id);
CREATE UNIQUE INDEX ""Covers_pkey"" ON public.""Covers"" USING btree (id);
CREATE UNIQUE INDEX ""FanId_key"" ON public.""Fan"" USING btree (""fanId"", ""fanOfId"");
CREATE UNIQUE INDEX ""Fan_pkey"" ON public.""Fan"" USING btree (id);
CREATE UNIQUE INDEX ""Follow_pkey"" ON public.""Follow"" USING btree (id);
CREATE UNIQUE INDEX ""Gallery_pkey"" ON public.""Gallery"" USING btree (id);
CREATE UNIQUE INDEX ""Genre_pkey"" ON public.""Genre"" USING btree (id);
CREATE UNIQUE INDEX ""Genre_title_key"" ON public.""Genre"" USING btree (title);
CREATE UNIQUE INDEX ""Image_pkey"" ON public.""Image"" USING btree (id);
CREATE UNIQUE INDEX ""Like_pkey"" ON public.""Like"" USING btree (id);
CREATE UNIQUE INDEX ""LikePost_key"" ON public.""Like"" USING btree (id, ""postId"");
CREATE UNIQUE INDEX ""Membership_pkey"" ON public.""Membership"" USING btree (id);
CREATE UNIQUE INDEX ""News_pkey"" ON public.""News"" USING btree (id);
CREATE UNIQUE INDEX ""News_postId_key"" ON public.""News"" USING btree (""postId"");
CREATE UNIQUE INDEX ""Post_id_key"" ON public.""Post"" USING btree (id);
CREATE UNIQUE INDEX ""Post_pkey"" ON public.""Post"" USING btree (id);
CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);
CREATE UNIQUE INDEX ""Session_pkey"" ON public.""Session"" USING btree (id);
CREATE UNIQUE INDEX ""Session_sessionToken_key"" ON public.""Session"" USING btree (""sessionToken"");
CREATE UNIQUE INDEX ""Share_pkey"" ON public.""Share"" USING btree (id);
CREATE UNIQUE INDEX ""SharePost_key"" ON public.""Share"" USING btree (id, ""postId"");
CREATE UNIQUE INDEX ""_user_books_AB_unique"" ON public._user_books USING btree (""A"", ""B"");
CREATE UNIQUE INDEX ""_user_chats_AB_unique"" ON public._user_chats USING btree (""A"", ""B"");
CREATE UNIQUE INDEX ""User_email_key"" ON public.""User"" USING btree (email);
CREATE UNIQUE INDEX ""User_id_key"" ON public.""User"" USING btree (id);
CREATE UNIQUE INDEX ""User_membershipId_key"" ON public.""User"" USING btree (""membershipId"");
CREATE UNIQUE INDEX ""User_pkey"" ON public.""User"" USING btree (id);
CREATE UNIQUE INDEX ""VerificationToken_identifier_token_key"" ON public.""VerificationToken"" USING btree (identifier, token);
CREATE UNIQUE INDEX ""VerificationToken_token_key"" ON public.""VerificationToken"" USING btree (token);