-- =========================================================
--  Обзвон · схема общей базы данных (PostgreSQL / Supabase)
--  Вставить целиком в SQL Editor проекта Supabase и выполнить.
-- =========================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
--  Таблицы
-- ------------------------------------------------------------
create table if not exists obzvon_profiles (
  id          text primary key,
  nick        text not null default '',
  role        text not null default 'Администратор',
  active      boolean not null default true,
  note        text not null default '',
  created_at  timestamptz not null default now(),
  last_login  timestamptz,
  logins      integer not null default 0
);

create table if not exists obzvon_owner (
  id          integer primary key default 1,
  salt        text not null,
  hash        text not null,
  iterations  integer not null default 2000,
  created_at  timestamptz not null default now(),
  constraint obzvon_owner_singleton check (id = 1)
);

create table if not exists obzvon_sessions (
  token       text primary key,
  profile_id  text,
  is_owner    boolean not null default false,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);

create table if not exists obzvon_workspaces (
  profile_id  text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create index if not exists obzvon_sessions_expires_idx on obzvon_sessions (expires_at);

-- Прямой доступ к таблицам закрыт: работаем только через функции.
alter table obzvon_profiles   enable row level security;
alter table obzvon_owner      enable row level security;
alter table obzvon_sessions   enable row level security;
alter table obzvon_workspaces enable row level security;

revoke all on table obzvon_profiles   from anon, authenticated;
revoke all on table obzvon_owner      from anon, authenticated;
revoke all on table obzvon_sessions   from anon, authenticated;
revoke all on table obzvon_workspaces from anon, authenticated;

-- ------------------------------------------------------------
--  Хеширование пароля владельца (совпадает с клиентским алгоритмом)
-- ------------------------------------------------------------
create or replace function obzvon_hash(p_password text, p_salt text, p_iter integer)
returns text
language plpgsql
immutable
as $$
declare
  v_hash text := p_salt || '|' || p_password;
  v_i    integer;
begin
  for v_i in 0 .. greatest(p_iter, 1) - 1 loop
    v_hash := encode(digest(v_hash || '|' || v_i, 'sha256'), 'hex');
  end loop;
  return v_hash;
end $$;

-- ------------------------------------------------------------
--  Проверка токена
--  '__owner__' — служебный профиль владельца
-- ------------------------------------------------------------
create or replace function obzvon_check_token(p_token text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sess obzvon_sessions%rowtype;
  v_prof obzvon_profiles%rowtype;
begin
  if p_token is null or p_token = '' then return null; end if;

  select * into v_sess from obzvon_sessions where token = p_token and expires_at > now();
  if not found then return null; end if;

  if v_sess.is_owner then return '__owner__'; end if;
  if v_sess.profile_id is null then return null; end if;

  select * into v_prof from obzvon_profiles where id = v_sess.profile_id;
  if not found or not v_prof.active then return null; end if;

  return v_prof.id;
end $$;

create or replace function obzvon_require_owner(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if obzvon_check_token(p_token) is distinct from '__owner__' then
    raise exception 'NO_ACCESS';
  end if;
end $$;

-- ------------------------------------------------------------
--  Владелец
-- ------------------------------------------------------------
create or replace function obzvon_owner_status()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from obzvon_owner where id = 1);
$$;

create or replace function obzvon_owner_setup(p_password text, p_owner_id text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_salt  text := encode(gen_random_bytes(16), 'hex');
  v_hash  text;
  v_token text;
begin
  if exists (select 1 from obzvon_owner where id = 1) then
    raise exception 'OWNER_EXISTS';
  end if;
  if p_password is null or length(p_password) < 4 then
    raise exception 'WEAK_PASSWORD';
  end if;

  v_hash := obzvon_hash(p_password, v_salt, 2000);
  insert into obzvon_owner (id, salt, hash, iterations) values (1, v_salt, v_hash, 2000);

  if p_owner_id is not null and length(trim(p_owner_id)) > 0 then
    insert into obzvon_profiles (id, nick, role, active)
    values (trim(p_owner_id), 'Владелец', 'Администратор', true)
    on conflict (id) do update set active = true, role = 'Администратор';
  end if;

  v_token := encode(gen_random_bytes(24), 'hex');
  insert into obzvon_sessions (token, profile_id, is_owner, expires_at)
  values (v_token, null, true, now() + interval '30 days');
  return v_token;
end $$;

create or replace function obzvon_owner_login(p_password text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_o     obzvon_owner%rowtype;
  v_token text;
begin
  select * into v_o from obzvon_owner where id = 1;
  if not found then raise exception 'NO_OWNER'; end if;
  if obzvon_hash(p_password, v_o.salt, v_o.iterations) <> v_o.hash then
    raise exception 'BAD_PASSWORD';
  end if;

  v_token := encode(gen_random_bytes(24), 'hex');
  insert into obzvon_sessions (token, profile_id, is_owner, expires_at)
  values (v_token, null, true, now() + interval '30 days');
  return v_token;
end $$;

create or replace function obzvon_owner_change_password(p_token text, p_old text, p_new text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_o    obzvon_owner%rowtype;
  v_salt text;
begin
  perform obzvon_require_owner(p_token);
  if p_new is null or length(p_new) < 4 then raise exception 'WEAK_PASSWORD'; end if;
  select * into v_o from obzvon_owner where id = 1;
  if obzvon_hash(p_old, v_o.salt, v_o.iterations) <> v_o.hash then
    raise exception 'BAD_PASSWORD';
  end if;
  v_salt := encode(gen_random_bytes(16), 'hex');
  update obzvon_owner
     set salt = v_salt,
         hash = obzvon_hash(p_new, v_salt, 2000),
         iterations = 2000
   where id = 1;
end $$;

-- ------------------------------------------------------------
--  Вход сотрудника
-- ------------------------------------------------------------
create or replace function obzvon_login(p_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prof obzvon_profiles%rowtype;
  v_token text;
begin
  if p_id is null or length(trim(p_id)) = 0 then raise exception 'NO_ACCESS'; end if;

  select * into v_prof from obzvon_profiles where lower(trim(id)) = lower(trim(p_id));
  if not found then raise exception 'NO_ACCESS'; end if;
  if not v_prof.active then raise exception 'DISABLED'; end if;

  update obzvon_profiles set last_login = now(), logins = logins + 1 where id = v_prof.id;

  v_token := encode(gen_random_bytes(24), 'hex');
  insert into obzvon_sessions (token, profile_id, is_owner, expires_at)
  values (v_token, v_prof.id, false, now() + interval '30 days');
  return v_token;
end $$;

create or replace function obzvon_logout(p_token text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from obzvon_sessions where token = p_token;
$$;

create or replace function obzvon_resume(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text;
  v_res jsonb;
begin
  v_id := obzvon_check_token(p_token);
  if v_id is null then return null; end if;

  if v_id = '__owner__' then
    return jsonb_build_object(
      'id', '__owner__', 'nick', 'Владелец', 'role', 'Администратор',
      'isOwner', true, 'active', true, 'logins', 0, 'created_at', now()
    );
  end if;

  select jsonb_build_object(
      'id', p.id, 'nick', p.nick, 'role', p.role, 'active', p.active,
      'created_at', p.created_at, 'last_login', p.last_login, 'logins', p.logins
    )
    into v_res
    from obzvon_profiles p where p.id = v_id;

  return v_res;
end $$;

-- ------------------------------------------------------------
--  Управление профилями (только владелец)
-- ------------------------------------------------------------
create or replace function obzvon_list_profiles(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_res jsonb;
begin
  perform obzvon_require_owner(p_token);
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'nick', p.nick, 'role', p.role, 'active', p.active,
      'created_at', p.created_at, 'last_login', p.last_login, 'logins', p.logins
    ) order by p.created_at), '[]'::jsonb)
    into v_res
    from obzvon_profiles p;
  return v_res;
end $$;

create or replace function obzvon_upsert_profile(
  p_token text, p_id text, p_nick text default null, p_role text default null, p_active boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform obzvon_require_owner(p_token);
  if p_id is null or length(trim(p_id)) = 0 then raise exception 'NO_ACCESS'; end if;

  insert into obzvon_profiles (id, nick, role, active)
  values (trim(p_id), coalesce(nullif(p_nick, ''), trim(p_id)), coalesce(nullif(p_role, ''), 'Администратор'), coalesce(p_active, true))
  on conflict (id) do update
    set nick = case when p_nick is null then obzvon_profiles.nick else p_nick end,
        role = case when p_role is null then obzvon_profiles.role else p_role end,
        active = coalesce(p_active, obzvon_profiles.active);
end $$;

create or replace function obzvon_delete_profile(p_token text, p_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform obzvon_require_owner(p_token);
  delete from obzvon_sessions where profile_id = p_id;
  delete from obzvon_profiles  where id = p_id;
end $$;

create or replace function obzvon_bulk_add(p_token text, p_ids text[], p_role text default 'Администратор')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id   text;
  v_role text := coalesce(p_role, 'Администратор');
  v_added integer := 0;
begin
  perform obzvon_require_owner(p_token);
  foreach v_id in array coalesce(p_ids, '{}') loop
    v_id := trim(v_id);
    if v_id = '' then continue; end if;
    insert into obzvon_profiles (id, nick, role, active)
    values (v_id, v_id, v_role, true)
    on conflict (id) do nothing;
    if found then v_added := v_added + 1; end if;
  end loop;
  return v_added;
end $$;

create or replace function obzvon_export_base(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_res jsonb;
begin
  perform obzvon_require_owner(p_token);
  select jsonb_build_object(
      'exported_at', now(),
      'users', coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id, 'nick', p.nick, 'role', p.role, 'active', p.active, 'logins', p.logins
      )), '[]'::jsonb)
    )
    into v_res from obzvon_profiles p;
  return v_res;
end $$;

create or replace function obzvon_import_base(p_token text, p_users jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item  jsonb;
  v_added integer := 0;
begin
  perform obzvon_require_owner(p_token);
  for v_item in select jsonb_array_elements(coalesce(p_users, '[]'::jsonb)) loop
    insert into obzvon_profiles (id, nick, role, active)
    values (
      trim(v_item->>'id'),
      coalesce(nullif(v_item->>'nick', ''), trim(v_item->>'id')),
      coalesce(nullif(v_item->>'role', ''), 'Администратор'),
      coalesce((v_item->>'active')::boolean, true)
    )
    on conflict (id) do nothing;
    if found then v_added := v_added + 1; end if;
  end loop;
  return v_added;
end $$;

-- ------------------------------------------------------------
--  Рабочее пространство (анкета, отметки, заметки)
-- ------------------------------------------------------------
create or replace function obzvon_get_state(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text;
  v_data jsonb;
begin
  v_id := obzvon_check_token(p_token);
  if v_id is null then raise exception 'NO_ACCESS'; end if;

  select data into v_data from obzvon_workspaces where profile_id = v_id;
  return coalesce(v_data, '{}'::jsonb);
end $$;

create or replace function obzvon_save_state(p_token text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text;
begin
  v_id := obzvon_check_token(p_token);
  if v_id is null then raise exception 'NO_ACCESS'; end if;

  insert into obzvon_workspaces (profile_id, data, updated_at)
  values (v_id, coalesce(p_data, '{}'::jsonb), now())
  on conflict (profile_id) do update
    set data = excluded.data, updated_at = now();
end $$;

create or replace function obzvon_set_nick(p_token text, p_nick text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text;
begin
  v_id := obzvon_check_token(p_token);
  if v_id is null or v_id = '__owner__' then raise exception 'NO_ACCESS'; end if;
  update obzvon_profiles set nick = p_nick where id = v_id;
end $$;

-- ------------------------------------------------------------
--  Права на вызов функций
-- ------------------------------------------------------------
grant execute on function obzvon_owner_status() to anon, authenticated;
grant execute on function obzvon_owner_setup(text, text) to anon, authenticated;
grant execute on function obzvon_owner_login(text) to anon, authenticated;
grant execute on function obzvon_owner_change_password(text, text, text) to anon, authenticated;
grant execute on function obzvon_login(text) to anon, authenticated;
grant execute on function obzvon_logout(text) to anon, authenticated;
grant execute on function obzvon_resume(text) to anon, authenticated;
grant execute on function obzvon_list_profiles(text) to anon, authenticated;
grant execute on function obzvon_upsert_profile(text, text, text, text, boolean) to anon, authenticated;
grant execute on function obzvon_delete_profile(text, text) to anon, authenticated;
grant execute on function obzvon_bulk_add(text, text[], text) to anon, authenticated;
grant execute on function obzvon_export_base(text) to anon, authenticated;
grant execute on function obzvon_import_base(text, jsonb) to anon, authenticated;
grant execute on function obzvon_get_state(text) to anon, authenticated;
grant execute on function obzvon_save_state(text, jsonb) to anon, authenticated;
grant execute on function obzvon_set_nick(text, text) to anon, authenticated;
