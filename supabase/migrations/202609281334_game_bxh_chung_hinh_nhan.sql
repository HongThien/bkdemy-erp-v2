-- BẢNG XẾP HẠNG CHUNG cho các game giải trí chơi-riêng ở games-site (bắt đầu: Hình Nhân Nhảy Múa — Thùy 28/09 "bảng xếp hạng riêng").
--
-- Tổng quát hoá từ Xếp Chữ (mig 202609281307): cùng luật, thêm cột `game` ⇒ game sau chỉ cần thêm tên vào CHECK, không đẻ bảng/hàm mới.
-- (Xếp Chữ vẫn chạy trên bảng riêng game_xep_chu_* — dời sang đây là việc riêng, cần Thùy gật vì phải bỏ bảng/hàm cũ.)
-- GAME GIẢI TRÍ, KHÔNG phải dữ liệu học tập ⇒ không nhãn `mon` (§1.6), không gắn học sinh (tên tự gõ, máy công cộng, không đăng nhập).
-- LUẬT: mỗi người góp mặt 1 lần trên mỗi bảng = LẦN ĐẦU TIÊN chơi.
--   · game_bxh_cau: lần đầu 1 người ở 1 câu — PK (game,bo,cau,ten_key) ⇒ on conflict do nothing giữ lần đầu.
--   · game_bxh_man: lần đầu 1 người ở 1 màn (game × bộ × mức) — dòng ra đời khi câu đầu xong (kết quả thật, §1.5), chỉ lượt đầu
--     (khoá `luot` uuid) cập nhật tiếp. Bỏ giữa chừng vẫn là lần đầu.
-- Điểm do game tính (luật chơi), DB kiểm biên + xếp hạng (§2.0). Máy chơi dùng anon key ⇒ bảng RLS không policy anon, chỉ qua 4 hàm definer.
-- MẤT GÌ (Luật xoá): KHÔNG. Chỉ thêm 2 bảng + 5 hàm mới.

create table if not exists game_bxh_cau (
  game     text not null check (game in ('hinh_nhan')),
  bo       text not null check (bo ~ '^[a-z]{2,4}$'),
  cau      text not null check (length(cau) between 1 and 80),
  ten_key  text not null,
  ten      text not null check (length(ten) between 1 and 20),
  diem     int  not null check (diem between 0 and 2000),
  ms       int  not null check (ms between 0 and 86400000),
  dung     boolean not null,
  at       timestamptz not null default now(),
  primary key (game, bo, cau, ten_key)
);
comment on table game_bxh_cau is 'BXH game giải trí (games-site): LẦN ĐẦU của mỗi người ở mỗi câu. Xếp hạng câu = dòng dung=true, điểm giảm dần, thời gian tăng dần.';

create table if not exists game_bxh_man (
  game     text not null check (game in ('hinh_nhan')),
  bo       text not null check (bo ~ '^[a-z]{2,4}$'),
  muc      text not null check (muc in ('de','vua','kho')),
  ten_key  text not null,
  ten      text not null check (length(ten) between 1 and 20),
  luot     uuid not null,
  diem     int  not null check (diem between 0 and 20000),
  ms       int  not null check (ms between 0 and 86400000),
  giai     smallint not null check (giai between 0 and 10),
  xong     smallint not null check (xong between 1 and 10),
  at       timestamptz not null default now(),
  sua_at   timestamptz not null default now(),
  check (giai <= xong),
  primary key (game, bo, muc, ten_key)
);
comment on table game_bxh_man is 'BXH game giải trí (games-site): LẦN ĐẦU của mỗi người ở mỗi màn (game × bộ × mức, 10 câu). luot = mã lượt đầu; chỉ lượt đó cập nhật tiếp.';

alter table game_bxh_cau enable row level security;
alter table game_bxh_man enable row level security;
revoke all on game_bxh_cau, game_bxh_man from anon, authenticated;

create or replace function public._game_bxh_ten(p text) returns text language sql immutable as
$$ select left(regexp_replace(btrim(coalesce(p,'')), '\s+', ' ', 'g'), 20) $$;

-- ---------- ghi 1 câu vừa xong (+ tổng màn của lượt này) ----------
create or replace function public.fn_game_bxh_ghi(
  p_game text, p_bo text, p_muc text, p_cau text, p_ten text, p_luot uuid,
  p_diem int, p_ms int, p_dung boolean,
  p_man_diem int, p_man_ms int, p_man_giai int, p_man_xong int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ten text := _game_bxh_ten(p_ten); v_key text; v_cau_moi boolean; v_man record; v_man_moi boolean := false;
begin
  if v_ten = '' then raise exception 'Thiếu tên người chơi.'; end if;
  v_key := lower(v_ten);
  insert into game_bxh_cau (game, bo, cau, ten_key, ten, diem, ms, dung)
  values (p_game, p_bo, p_cau, v_key, v_ten, case when p_dung then p_diem else 0 end, p_ms, p_dung)
  on conflict do nothing;
  v_cau_moi := found;

  select * into v_man from game_bxh_man where game = p_game and bo = p_bo and muc = p_muc and ten_key = v_key for update;
  if not found then
    insert into game_bxh_man (game, bo, muc, ten_key, ten, luot, diem, ms, giai, xong)
    values (p_game, p_bo, p_muc, v_key, v_ten, p_luot, p_man_diem, p_man_ms, p_man_giai, p_man_xong)
    on conflict do nothing;
    v_man_moi := found;
  elsif v_man.luot = p_luot and p_man_xong > v_man.xong then
    update game_bxh_man set diem = p_man_diem, ms = p_man_ms, giai = p_man_giai, xong = p_man_xong, sua_at = now()
    where game = p_game and bo = p_bo and muc = p_muc and ten_key = v_key;
    v_man_moi := true;
  end if;
  return jsonb_build_object('cau_tinh', v_cau_moi, 'man_tinh', v_man_moi);
end $$;

-- ---------- lúc vào màn: màn này + các câu này người này đã có lần đầu chưa (chỉ để hiện nhãn) ----------
create or replace function public.fn_game_bxh_da_choi(p_game text, p_bo text, p_muc text, p_ten text, p_caus text[])
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'man_luot', (select luot from game_bxh_man where game = p_game and bo = p_bo and muc = p_muc and ten_key = lower(_game_bxh_ten(p_ten))),
    'cau_da_choi', coalesce((select jsonb_agg(cau) from game_bxh_cau
                    where game = p_game and bo = p_bo and ten_key = lower(_game_bxh_ten(p_ten)) and cau = any(p_caus)), '[]'::jsonb))
$$;

-- ---------- bảng xếp hạng: 'cau' (p_ma = đáp án) hoặc 'man' (p_ma = mức) ----------
create or replace function public.fn_game_bxh(p_game text, p_loai text, p_bo text, p_ma text, p_ten text, p_top int default 10)
returns jsonb language sql stable security definer set search_path = public as $$
  with ds as (
    select ten, ten_key, diem, ms, null::smallint as giai, at from game_bxh_cau
     where p_loai = 'cau' and game = p_game and bo = p_bo and cau = p_ma and dung
    union all
    select ten, ten_key, diem, ms, giai, at from game_bxh_man
     where p_loai = 'man' and game = p_game and bo = p_bo and muc = p_ma
  ), xh as (
    select row_number() over (order by diem desc, ms asc, at asc) as hang, * from ds
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang',hang,'ten',ten,'diem',diem,'ms',ms,'giai',giai) order by hang)
                     from xh where hang <= least(greatest(p_top,1),50)), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang',hang,'ten',ten,'diem',diem,'ms',ms,'giai',giai)
              from xh where ten_key = lower(_game_bxh_ten(p_ten))),
    'tong', (select count(*) from xh),
    'pha_dao', (select jsonb_build_object('ten',ten,'ms',ms) from xh where giai = 10 order by ms, at limit 1))
$$;

-- ---------- sảnh: mỗi mức của 1 bộ — người đứng đầu + phá đảo nhanh nhất ----------
create or replace function public.fn_game_bxh_sanh(p_game text, p_bo text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(m.muc, jsonb_build_object(
    'top1', (select jsonb_build_object('ten',ten,'diem',diem) from game_bxh_man
              where game = p_game and bo = p_bo and muc = m.muc order by diem desc, ms, at limit 1),
    'pha_dao', (select jsonb_build_object('ten',ten,'ms',ms) from game_bxh_man
              where game = p_game and bo = p_bo and muc = m.muc and giai = 10 order by ms, at limit 1))), '{}'::jsonb)
  from (values ('de'),('vua'),('kho')) m(muc)
$$;

revoke all on function public._game_bxh_ten(text) from public, anon, authenticated;
revoke all on function public.fn_game_bxh_ghi(text,text,text,text,text,uuid,int,int,boolean,int,int,int,int) from public;
revoke all on function public.fn_game_bxh_da_choi(text,text,text,text,text[]) from public;
revoke all on function public.fn_game_bxh(text,text,text,text,text,int) from public;
revoke all on function public.fn_game_bxh_sanh(text,text) from public;
grant execute on function public.fn_game_bxh_ghi(text,text,text,text,text,uuid,int,int,boolean,int,int,int,int) to anon, authenticated;
grant execute on function public.fn_game_bxh_da_choi(text,text,text,text,text[]) to anon, authenticated;
grant execute on function public.fn_game_bxh(text,text,text,text,text,int) to anon, authenticated;
grant execute on function public.fn_game_bxh_sanh(text,text) to anon, authenticated;
