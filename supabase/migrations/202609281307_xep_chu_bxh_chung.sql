-- Xếp Chữ (games-site/xep-chu.html) — BẢNG XẾP HẠNG CHUNG mọi máy (Thùy 28/09: "chơi chung mà").
--
-- GAME GIẢI TRÍ, KHÔNG phải dữ liệu học tập ⇒ không nhãn `mon` (§1.6), không gắn học sinh (HS tự gõ tên, máy công cộng, không đăng nhập).
-- LUẬT (Thùy 28/09): mỗi người góp mặt 1 lần trên mỗi bảng = LẦN ĐẦU TIÊN chơi (chơi lại đã biết đáp án ⇒ luyện tập).
--   · game_xep_chu_cau: lần đầu của 1 người ở 1 câu. PK (bo, cau, ten_key) ⇒ DB tự giữ "lần đầu" (on conflict do nothing).
--   · game_xep_chu_man: lần đầu của 1 người ở 1 màn (bộ × mức). Dòng ra đời sau câu ĐẦU TIÊN làm xong (có kết quả thật, §1.5),
--     cập nhật dần theo từng câu của CHÍNH lượt đó (khoá bằng `luot` uuid máy sinh lúc bắt đầu màn). Lượt khác không ghi đè được.
--     Bỏ giữa chừng thì lượt đó vẫn là lần đầu (chặn "chơi thử rồi chơi thật").
-- Điểm do game tính (luật chơi nằm ở game, không phải nghiệp vụ); DB chỉ kiểm biên + xếp hạng (xếp hạng ở DB theo §2.0).
-- Truy cập: máy chơi dùng anon key ⇒ bảng bật RLS, KHÔNG policy cho anon; chỉ qua 4 hàm security definer bên dưới.
-- MẤT GÌ (Luật xoá): KHÔNG. Chỉ thêm 2 bảng + 4 hàm mới.

create table if not exists game_xep_chu_cau (
  bo       text not null check (bo in ('vn','kd','en')),
  cau      text not null check (length(cau) between 1 and 60),
  ten_key  text not null,
  ten      text not null check (length(ten) between 1 and 20),
  diem     int  not null check (diem between 0 and 1000),
  ms       int  not null check (ms between 0 and 86400000),
  dung     boolean not null,
  at       timestamptz not null default now(),
  primary key (bo, cau, ten_key)
);
comment on table game_xep_chu_cau is 'Xếp Chữ: LẦN ĐẦU của mỗi người ở mỗi câu (game giải trí, không phải dữ liệu học tập). Xếp hạng câu = dòng dung=true, điểm giảm dần, thời gian tăng dần.';

create table if not exists game_xep_chu_man (
  bo       text not null check (bo in ('vn','kd','en')),
  muc      text not null check (muc in ('de','vua','kho')),
  ten_key  text not null,
  ten      text not null check (length(ten) between 1 and 20),
  luot     uuid not null,
  diem     int  not null check (diem between 0 and 10000),
  ms       int  not null check (ms between 0 and 86400000),
  giai     smallint not null check (giai between 0 and 10),
  xong     smallint not null check (xong between 1 and 10),
  at       timestamptz not null default now(),
  sua_at   timestamptz not null default now(),
  check (giai <= xong),
  primary key (bo, muc, ten_key)
);
comment on table game_xep_chu_man is 'Xếp Chữ: LẦN ĐẦU của mỗi người ở mỗi màn (bộ × mức, 10 câu). luot = mã lượt đầu; chỉ lượt đó được cập nhật tiếp. xong = số câu đã làm của lượt đó.';

alter table game_xep_chu_cau enable row level security;
alter table game_xep_chu_man enable row level security;
revoke all on game_xep_chu_cau, game_xep_chu_man from anon, authenticated;

-- Chuẩn hoá tên: gộp khoảng trắng; khoá so khớp không phân biệt hoa thường.
create or replace function public._xep_chu_ten(p text) returns text language sql immutable as
$$ select left(regexp_replace(btrim(coalesce(p,'')), '\s+', ' ', 'g'), 20) $$;

-- ---------- ghi 1 câu vừa xong (+ tổng màn của lượt này) ----------
create or replace function public.fn_xep_chu_ghi(
  p_bo text, p_muc text, p_cau text, p_ten text, p_luot uuid,
  p_diem int, p_ms int, p_dung boolean,
  p_man_diem int, p_man_ms int, p_man_giai int, p_man_xong int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ten text := _xep_chu_ten(p_ten); v_key text; v_cau_moi boolean; v_man record; v_man_moi boolean := false;
begin
  if v_ten = '' then raise exception 'Thiếu tên người chơi.'; end if;
  v_key := lower(v_ten);
  insert into game_xep_chu_cau (bo, cau, ten_key, ten, diem, ms, dung)
  values (p_bo, p_cau, v_key, v_ten, case when p_dung then p_diem else 0 end, p_ms, p_dung)
  on conflict do nothing;
  v_cau_moi := found;

  select * into v_man from game_xep_chu_man where bo = p_bo and muc = p_muc and ten_key = v_key for update;
  if not found then
    insert into game_xep_chu_man (bo, muc, ten_key, ten, luot, diem, ms, giai, xong)
    values (p_bo, p_muc, v_key, v_ten, p_luot, p_man_diem, p_man_ms, p_man_giai, p_man_xong)
    on conflict do nothing;
    v_man_moi := found;
  elsif v_man.luot = p_luot and p_man_xong > v_man.xong then
    update game_xep_chu_man set diem = p_man_diem, ms = p_man_ms, giai = p_man_giai, xong = p_man_xong, sua_at = now()
    where bo = p_bo and muc = p_muc and ten_key = v_key;
    v_man_moi := true;
  end if;
  return jsonb_build_object('cau_tinh', v_cau_moi, 'man_tinh', v_man_moi);
end $$;

-- ---------- lượt này có phải lần đầu không (gọi lúc bắt đầu màn) ----------
-- man_luot: mã lượt đầu đã ghi (null = chưa chơi màn này) · cau_da_choi: các câu trong p_caus người này đã có lần đầu.
create or replace function public.fn_xep_chu_da_choi(p_bo text, p_muc text, p_ten text, p_caus text[])
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'man_luot', (select luot from game_xep_chu_man where bo = p_bo and muc = p_muc and ten_key = lower(_xep_chu_ten(p_ten))),
    'cau_da_choi', coalesce((select jsonb_agg(cau) from game_xep_chu_cau
                    where bo = p_bo and ten_key = lower(_xep_chu_ten(p_ten)) and cau = any(p_caus)), '[]'::jsonb))
$$;

-- ---------- bảng xếp hạng: 'cau' (p_ma = đáp án) hoặc 'man' (p_ma = mức) ----------
-- Trả top p_top + dòng của p_ten (kể cả ngoài top) + tổng số người trên bảng + phá đảo nhanh nhất (màn).
create or replace function public.fn_xep_chu_bxh(p_loai text, p_bo text, p_ma text, p_ten text, p_top int default 10)
returns jsonb language sql stable security definer set search_path = public as $$
  with ds as (
    select ten, ten_key, diem, ms, null::smallint as giai, at from game_xep_chu_cau
     where p_loai = 'cau' and bo = p_bo and cau = p_ma and dung
    union all
    select ten, ten_key, diem, ms, giai, at from game_xep_chu_man
     where p_loai = 'man' and bo = p_bo and muc = p_ma
  ), xh as (
    select row_number() over (order by diem desc, ms asc, at asc) as hang, * from ds
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang',hang,'ten',ten,'diem',diem,'ms',ms,'giai',giai) order by hang)
                     from xh where hang <= least(greatest(p_top,1),50)), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang',hang,'ten',ten,'diem',diem,'ms',ms,'giai',giai)
              from xh where ten_key = lower(_xep_chu_ten(p_ten))),
    'tong', (select count(*) from xh),
    'pha_dao', (select jsonb_build_object('ten',ten,'ms',ms) from xh where giai = 10 order by ms, at limit 1))
$$;

-- ---------- sảnh: mỗi mức của 1 bộ — người đứng đầu + phá đảo nhanh nhất ----------
create or replace function public.fn_xep_chu_sanh(p_bo text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(m.muc, jsonb_build_object(
    'top1', (select jsonb_build_object('ten',ten,'diem',diem) from game_xep_chu_man
              where bo = p_bo and muc = m.muc order by diem desc, ms, at limit 1),
    'pha_dao', (select jsonb_build_object('ten',ten,'ms',ms) from game_xep_chu_man
              where bo = p_bo and muc = m.muc and giai = 10 order by ms, at limit 1))), '{}'::jsonb)
  from (values ('de'),('vua'),('kho')) m(muc)
$$;

-- Quyền: máy chơi (anon) + người đăng nhập gọi được 4 hàm; hàm phụ _xep_chu_ten dùng nội bộ.
revoke all on function public._xep_chu_ten(text) from public, anon, authenticated;
revoke all on function public.fn_xep_chu_ghi(text,text,text,text,uuid,int,int,boolean,int,int,int,int) from public;
revoke all on function public.fn_xep_chu_da_choi(text,text,text,text[]) from public;
revoke all on function public.fn_xep_chu_bxh(text,text,text,text,int) from public;
revoke all on function public.fn_xep_chu_sanh(text) from public;
grant execute on function public.fn_xep_chu_ghi(text,text,text,text,uuid,int,int,boolean,int,int,int,int) to anon, authenticated;
grant execute on function public.fn_xep_chu_da_choi(text,text,text,text[]) to anon, authenticated;
grant execute on function public.fn_xep_chu_bxh(text,text,text,text,int) to anon, authenticated;
grant execute on function public.fn_xep_chu_sanh(text) to anon, authenticated;
