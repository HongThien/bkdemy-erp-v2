-- ============================================================================
-- THẾ GIỚI BK — BÌNH LUẬN TỰ DO + BỘ LỌC TỪ BẬY (Thùy 03/11: "mở tính năng tự do bình luận, nhưng phải làm rule chặt khoá các từ bậy bạ")
--
-- Trước đây bình luận = câu soạn sẵn / sticker (the_gioi_danh_muc). Giờ thêm đường GÕ CHỮ, mọi luật nằm ở DB:
--   · tu_cam            = danh sách từ/cụm cấm, sửa bằng INSERT/UPDATE không cần deploy (bat=false để tạm tắt 1 mẫu).
--   · _bl_kiem(text)    = 1 hàm kiểm DUY NHẤT: chuẩn hoá (NFC, chữ thường, leet 0→o 1→i 3→e 4/@→a 5/$→s 7→t, bỏ ký tự chen,
--                         gộp chữ lặp "đéooo", nối chữ cái rời "đ ị t") rồi so 3 kiểu mẫu:
--                         tu_co_dau   = từ/cụm nguyên vẹn CÓ DẤU (từ mà bỏ dấu sẽ trùng từ lành: lồn≠lớn, buồi≠buổi, đéo≠đeo, ngu≠ngủ)
--                         tu_khong_dau= từ/cụm nguyên vẹn sau khi BỎ DẤU (teencode: dm, vcl, cc, clgt, loz…)
--                         dinh        = chuỗi con sau khi bỏ dấu + bỏ hết khoảng trắng (bắt "đ.ị.t.m.ẹ", "d i t m e", "fuuuck")
--                       + chặn link / tên mạng xã hội / @tài khoản / dãy ≥9 chữ số (bảo vệ thông tin cá nhân của em).
--                       Nguyên tắc: thà chặn nhầm (em viết lại) còn hơn lọt (§1.5 tinh thần "thà bỏ trống còn hơn đánh sai").
--   · the_gioi_bl_chan  = sổ các lần bị chặn (ai · tin nào · gõ gì · dính mẫu nào) — để thầy cô thấy + bổ sung danh sách.
--   · fn_the_gioi_binh_luan_chu = RPC gửi bình luận chữ. Bị chặn ⇒ TRẢ {ok:false} (không raise, để sổ chặn còn lại).
--   · tinh_nang 'binh_luan_tu_do' = công tắc (mở từ 03/11). Đóng ⇒ app quay về chỉ câu soạn sẵn/sticker.
-- Bình luận chữ lưu ở cột MỚI noi_dung_tu_do; noi_dung_ma chỉ còn cho câu/sticker — đúng 1 trong 2 có giá trị (CHECK).
-- ============================================================================

-- ── 1. Bảng từ cấm ──────────────────────────────────────────────────────────
create table if not exists public.tu_cam (
  mau        text primary key check (mau = lower(mau) and mau = btrim(mau) and mau ~ '^[a-zđàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ0-9 ]+$'),
  cach       text not null check (cach in ('tu_co_dau', 'tu_khong_dau', 'dinh')),
  nhom       text not null check (nhom in ('tuc_tiu', 'xuc_pham', 'nguoi_lon', 'tieng_anh')),
  bat        boolean not null default true,
  created_at timestamptz not null default now(),
  check (cach <> 'dinh' or mau !~ ' ')
);
alter table public.tu_cam enable row level security;

insert into public.tu_cam (mau, cach, nhom) values
  -- tục tĩu, phải CÓ DẤU mới chắc (bỏ dấu là trùng từ lành)
  ('lồn','tu_co_dau','tuc_tiu'), ('lìn','tu_co_dau','tuc_tiu'), ('buồi','tu_co_dau','tuc_tiu'), ('cặc','tu_co_dau','tuc_tiu'),
  ('kặc','tu_co_dau','tuc_tiu'), ('đụ','tu_co_dau','tuc_tiu'), ('địt','tu_co_dau','tuc_tiu'), ('đéo','tu_co_dau','tuc_tiu'),
  ('đếch','tu_co_dau','tuc_tiu'), ('đếu','tu_co_dau','tuc_tiu'), ('đĩ','tu_co_dau','tuc_tiu'), ('điếm','tu_co_dau','tuc_tiu'),
  ('cứt','tu_co_dau','tuc_tiu'), ('ỉa','tu_co_dau','tuc_tiu'), ('nứng','tu_co_dau','nguoi_lon'), ('dâm','tu_co_dau','nguoi_lon'),
  ('chịch','tu_co_dau','nguoi_lon'), ('xoạc','tu_co_dau','nguoi_lon'), ('đụ má','tu_co_dau','tuc_tiu'), ('đù má','tu_co_dau','tuc_tiu'),
  -- xúc phạm (có dấu)
  ('ngu','tu_co_dau','xuc_pham'), ('đần','tu_co_dau','xuc_pham'), ('đần độn','tu_co_dau','xuc_pham'), ('ngu học','tu_co_dau','xuc_pham'),
  ('óc chó','tu_co_dau','xuc_pham'), ('đồ chó','tu_co_dau','xuc_pham'), ('thằng chó','tu_co_dau','xuc_pham'), ('con chó cái','tu_co_dau','xuc_pham'),
  ('chó chết','tu_co_dau','xuc_pham'), ('chó má','tu_co_dau','xuc_pham'), ('mất dạy','tu_co_dau','xuc_pham'), ('vô học','tu_co_dau','xuc_pham'),
  ('khốn nạn','tu_co_dau','xuc_pham'), ('thằng khốn','tu_co_dau','xuc_pham'), ('đồ khốn','tu_co_dau','xuc_pham'), ('súc vật','tu_co_dau','xuc_pham'),
  ('thằng điên','tu_co_dau','xuc_pham'), ('con điên','tu_co_dau','xuc_pham'), ('đồ điên','tu_co_dau','xuc_pham'), ('đồ khùng','tu_co_dau','xuc_pham'),
  ('câm mồm','tu_co_dau','xuc_pham'), ('im mồm','tu_co_dau','xuc_pham'), ('câm miệng','tu_co_dau','xuc_pham'), ('cút','tu_co_dau','xuc_pham'),
  ('bố mày','tu_co_dau','xuc_pham'), ('mẹ mày','tu_co_dau','xuc_pham'), ('cha mày','tu_co_dau','xuc_pham'), ('ông mày','tu_co_dau','xuc_pham'),
  ('bà mày','tu_co_dau','xuc_pham'), ('con mẹ','tu_co_dau','xuc_pham'), ('mẹ kiếp','tu_co_dau','xuc_pham'), ('tiên sư','tu_co_dau','xuc_pham'),
  ('tổ sư','tu_co_dau','xuc_pham'), ('bố láo','tu_co_dau','xuc_pham'), ('láo toét','tu_co_dau','xuc_pham'), ('rác rưởi','tu_co_dau','xuc_pham'),
  ('chết đi','tu_co_dau','xuc_pham'), ('đồ ngu','tu_co_dau','xuc_pham'), ('thằng ngu','tu_co_dau','xuc_pham'), ('con ngu','tu_co_dau','xuc_pham'),
  -- teencode / viết tắt (so sau khi bỏ dấu, nguyên từ)
  ('dm','tu_khong_dau','tuc_tiu'), ('dmm','tu_khong_dau','tuc_tiu'), ('dcm','tu_khong_dau','tuc_tiu'), ('dkm','tu_khong_dau','tuc_tiu'),
  ('dmcs','tu_khong_dau','tuc_tiu'), ('dmvl','tu_khong_dau','tuc_tiu'), ('vcl','tu_khong_dau','tuc_tiu'), ('vkl','tu_khong_dau','tuc_tiu'),
  ('vl','tu_khong_dau','tuc_tiu'), ('vcc','tu_khong_dau','tuc_tiu'), ('vclm','tu_khong_dau','tuc_tiu'), ('vloz','tu_khong_dau','tuc_tiu'),
  ('cc','tu_khong_dau','tuc_tiu'), ('cl','tu_khong_dau','tuc_tiu'), ('clm','tu_khong_dau','tuc_tiu'), ('clgt','tu_khong_dau','tuc_tiu'),
  ('cmm','tu_khong_dau','tuc_tiu'), ('cmn','tu_khong_dau','tuc_tiu'), ('cmnr','tu_khong_dau','tuc_tiu'), ('dume','tu_khong_dau','tuc_tiu'),
  ('duma','tu_khong_dau','tuc_tiu'), ('loz','tu_khong_dau','tuc_tiu'), ('lozz','tu_khong_dau','tuc_tiu'), ('cak','tu_khong_dau','tuc_tiu'),
  ('dit','tu_khong_dau','tuc_tiu'), ('dek','tu_khong_dau','tuc_tiu'), ('oc cho','tu_khong_dau','xuc_pham'), ('do ngu','tu_khong_dau','xuc_pham'),
  ('thang ngu','tu_khong_dau','xuc_pham'), ('con me may','tu_khong_dau','xuc_pham'), ('mat day','tu_khong_dau','xuc_pham'),
  -- tiếng Anh
  ('fuck','tu_khong_dau','tieng_anh'), ('fck','tu_khong_dau','tieng_anh'), ('fuk','tu_khong_dau','tieng_anh'), ('fucking','tu_khong_dau','tieng_anh'),
  ('shit','tu_khong_dau','tieng_anh'), ('bitch','tu_khong_dau','tieng_anh'), ('dick','tu_khong_dau','tieng_anh'), ('pussy','tu_khong_dau','tieng_anh'),
  ('cunt','tu_khong_dau','tieng_anh'), ('asshole','tu_khong_dau','tieng_anh'), ('bastard','tu_khong_dau','tieng_anh'), ('wtf','tu_khong_dau','tieng_anh'),
  ('stfu','tu_khong_dau','tieng_anh'), ('motherfucker','tu_khong_dau','tieng_anh'), ('nigga','tu_khong_dau','tieng_anh'), ('nigger','tu_khong_dau','tieng_anh'),
  ('sex','tu_khong_dau','nguoi_lon'), ('sexy','tu_khong_dau','nguoi_lon'), ('porn','tu_khong_dau','nguoi_lon'), ('porno','tu_khong_dau','nguoi_lon'),
  ('xxx','tu_khong_dau','nguoi_lon'), ('hentai','tu_khong_dau','nguoi_lon'), ('jav','tu_khong_dau','nguoi_lon'),
  -- dính liền / chen ký tự (chuỗi con sau khi bỏ dấu + bỏ khoảng trắng) — chỉ mẫu không thể nằm trong câu lành
  ('ditme','dinh','tuc_tiu'), ('ditmay','dinh','tuc_tiu'), ('ditcon','dinh','tuc_tiu'), ('dmm','dinh','tuc_tiu'), ('dcm','dinh','tuc_tiu'),
  ('dkm','dinh','tuc_tiu'), ('vcl','dinh','tuc_tiu'), ('vkl','dinh','tuc_tiu'), ('clgt','dinh','tuc_tiu'), ('conmemay','dinh','xuc_pham'),
  ('dumemay','dinh','tuc_tiu'), ('dumamay','dinh','tuc_tiu'), ('occho','dinh','xuc_pham'), ('fuck','dinh','tieng_anh'), ('fck','dinh','tieng_anh'),
  ('shit','dinh','tieng_anh'), ('bitch','dinh','tieng_anh'), ('porn','dinh','nguoi_lon'), ('hentai','dinh','nguoi_lon'), ('nigg','dinh','tieng_anh')
on conflict (mau) do nothing;
-- 'dmm','dcm','dkm','vcl','vkl','clgt','fuck','fck','shit','bitch','porn','hentai' có cả 2 kiểu nhưng mau là khoá ⇒ bản 'dinh' không vào.
-- Kiểu 'dinh' đã bao luôn kiểu nguyên từ (chuỗi con của câu bỏ khoảng trắng), nên đổi các mẫu đó sang 'dinh'.
update public.tu_cam set cach = 'dinh' where mau in ('dmm','dcm','dkm','vcl','vkl','clgt','fuck','fck','shit','bitch','porn','hentai');

-- ── 2. Hàm kiểm ─────────────────────────────────────────────────────────────
create or replace function public._bl_bo_dau(p text) returns text
language sql immutable set search_path to 'public' as $$
  select translate(p, 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
    repeat('a', 17) || repeat('e', 11) || repeat('i', 5) || repeat('o', 17) || repeat('u', 11) || repeat('y', 5) || 'd')
$$;

-- Nối các chữ cái đứng rời liên tiếp thành 1 từ: "d i t m e" → "ditme", "l ồ n" → "lồn" (lách luật kiểu cách chữ)
create or replace function public._bl_noi_chu_roi(p text) returns text
language plpgsql immutable set search_path to 'public' as $$
declare t text; ra text[] := '{}'; cur text := '';
begin
  foreach t in array string_to_array(p, ' ') loop
    if length(t) = 1 then cur := cur || t;
    else
      if cur <> '' then ra := ra || cur; cur := ''; end if;
      if t <> '' then ra := ra || t; end if;
    end if;
  end loop;
  if cur <> '' then ra := ra || cur; end if;
  return array_to_string(ra, ' ');
end $$;

-- Trả NULL nếu sạch; ngược lại {ly_do: ngan|dai|lien_ket|so_dien_thoai|tu_cam, mau?}
create or replace function public._bl_kiem(p text) returns jsonb
language plpgsql stable set search_path to 'public' as $$
declare
  s text; a text; ac text; ar text; b text; bc text; br text; dinh text; dinhc text; r record;
begin
  s := regexp_replace(btrim(normalize(coalesce(p, ''), NFC)), '\s+', ' ', 'g');
  if length(s) < 2 then return jsonb_build_object('ly_do', 'ngan'); end if;
  if length(s) > 120 then return jsonb_build_object('ly_do', 'dai'); end if;
  -- thông tin liên lạc / dẫn ra ngoài
  if s ~* '(https?://|www\.|\m[a-z0-9-]+\.(com|vn|net|org|io|me|xyz|info|ly|gg|tk|link)\M|@[a-z0-9_.]{3,}|\mzalo\M|facebook|\mfb\M|instagram|\minsta\M|tiktok|discord|telegram|t\.me/)'
    then return jsonb_build_object('ly_do', 'lien_ket'); end if;
  if length(regexp_replace(s, '\D', '', 'g')) >= 9 then return jsonb_build_object('ly_do', 'so_dien_thoai'); end if;

  a  := lower(s);
  a  := translate(a, '0134@$57', 'oieaasst');
  a  := btrim(regexp_replace(a, '[^a-zđàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]+', ' ', 'g'));
  ac := regexp_replace(a, '(.)\1+', '\1', 'g');          -- "đéooo" → "đéo"
  ar := public._bl_noi_chu_roi(ac);                      -- "l ồ n" → "lồn"
  b  := public._bl_bo_dau(a); bc := public._bl_bo_dau(ac); br := public._bl_bo_dau(ar);
  dinh  := replace(b, ' ', '');
  dinhc := replace(bc, ' ', '');

  for r in select t.mau, t.cach from tu_cam t where t.bat order by length(t.mau) desc loop
    if (r.cach = 'tu_co_dau' and (' ' || a || ' ' like '% ' || r.mau || ' %' or ' ' || ac || ' ' like '% ' || r.mau || ' %' or ' ' || ar || ' ' like '% ' || r.mau || ' %'))
    or (r.cach = 'tu_khong_dau' and (' ' || b || ' ' like '% ' || r.mau || ' %' or ' ' || bc || ' ' like '% ' || r.mau || ' %' or ' ' || br || ' ' like '% ' || r.mau || ' %'))
    or (r.cach = 'dinh' and (position(r.mau in dinh) > 0 or position(r.mau in dinhc) > 0))
    then return jsonb_build_object('ly_do', 'tu_cam', 'mau', r.mau); end if;
  end loop;
  return null;
end $$;

-- ── 3. Bình luận chữ + sổ chặn ──────────────────────────────────────────────
alter table public.the_gioi_binh_luan alter column noi_dung_ma drop not null;
alter table public.the_gioi_binh_luan add column if not exists noi_dung_tu_do text check (noi_dung_tu_do is null or length(noi_dung_tu_do) between 2 and 120);
alter table public.the_gioi_binh_luan drop constraint if exists the_gioi_binh_luan_mot_noi_dung;
alter table public.the_gioi_binh_luan add constraint the_gioi_binh_luan_mot_noi_dung check ((noi_dung_ma is null) <> (noi_dung_tu_do is null));

create table if not exists public.the_gioi_bl_chan (
  id         uuid primary key default gen_random_uuid(),
  hs_id      uuid not null references public.hoc_sinh(id) on delete cascade,
  tin_khoa   text not null,
  noi_dung   text not null,
  ly_do      text not null check (ly_do in ('lien_ket', 'so_dien_thoai', 'tu_cam')),
  mau        text,
  created_at timestamptz not null default now()
);
create index if not exists the_gioi_bl_chan_hs_ngay on public.the_gioi_bl_chan (hs_id, created_at);
alter table public.the_gioi_bl_chan enable row level security;

create or replace function public._the_gioi_bl_json(b the_gioi_binh_luan, p_me uuid, p_ban uuid[])
returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object('id', b.id, 'at', b.created_at, 'loai', coalesce(d.loai, 'chu'), 'ma', d.ma, 'noi_dung', coalesce(b.noi_dung_tu_do, d.noi_dung),
    'nguoi', public._the_gioi_nguoi(b.hs_id, (select ten_lop from public._the_gioi_lop(b.hs_id, null)), b.hs_id = any(p_ban) or b.hs_id = p_me),
    'la_em', b.hs_id = p_me, 'an', b.an_at is not null)
  from (select 1) x left join the_gioi_danh_muc d on d.ma = b.noi_dung_ma
$$;

create or replace function public.fn_the_gioi_binh_luan_chu(p_khoa text, p_noi_dung text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  v_me uuid := public.my_hoc_sinh_id(); v_tin record; v_chu boolean; v_ban uuid[]; v_bl the_gioi_binh_luan;
  v_s text := regexp_replace(btrim(normalize(coalesce(p_noi_dung, ''), NFC)), '\s+', ' ', 'g');
  v_k jsonb; v_hom date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_toi_da_ngay constant int := 30;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới bình luận được'; end if;
  if not ('binh_luan_tu_do' = any(public.fn_hs_tinh_nang_mo())) then raise exception 'Bình luận tự do chưa mở, em chọn câu có sẵn nhé'; end if;
  select * into v_tin from public._the_gioi_tin_mo(p_khoa);
  v_chu := v_me = any(v_tin.thanh_vien);
  if not v_chu and exists (select 1 from the_gioi_an_tin a where a.tin_khoa = p_khoa and a.an) then raise exception 'Tin đã được chủ tin ẩn'; end if;
  if (select count(*) from the_gioi_binh_luan where tin_khoa = p_khoa and hs_id = v_me and go_at is null) >= 3 then
    raise exception 'Mỗi tin em bình luận tối đa 3 lần'; end if;
  if (select count(*) from the_gioi_binh_luan where hs_id = v_me and noi_dung_tu_do is not null and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom)
   + (select count(*) from the_gioi_bl_chan where hs_id = v_me and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom) >= v_toi_da_ngay then
    raise exception 'Hôm nay em đã viết % bình luận rồi, mai viết tiếp nhé!', v_toi_da_ngay; end if;

  v_k := public._bl_kiem(v_s);
  if v_k is not null then
    if v_k->>'ly_do' in ('lien_ket', 'so_dien_thoai', 'tu_cam') then
      insert into the_gioi_bl_chan (hs_id, tin_khoa, noi_dung, ly_do, mau) values (v_me, p_khoa, left(v_s, 300), v_k->>'ly_do', v_k->>'mau');
    end if;
    return jsonb_build_object('ok', false, 'loi', case v_k->>'ly_do'
      when 'ngan' then 'Em viết dài hơn một chút nhé.'
      when 'dai' then 'Bình luận dài quá (tối đa 120 chữ).'
      when 'lien_ket' then 'Bình luận không được có đường link, tên mạng xã hội hay tài khoản nhé.'
      when 'so_dien_thoai' then 'Bình luận không được có số điện thoại hay dãy số dài nhé.'
      else 'Bình luận có từ ngữ không phù hợp nên chưa gửi được. Em viết lại lịch sự hơn nhé!' end);
  end if;

  insert into the_gioi_binh_luan (tin_khoa, hs_id, noi_dung_tu_do) values (p_khoa, v_me, v_s) returning * into v_bl;
  v_ban := array(select public._ban_be_cua(v_me));
  return jsonb_build_object('ok', true, 'bl', public._the_gioi_bl_json(v_bl, v_me, v_ban), 'khen', public._the_gioi_khen_json(p_khoa, v_me, v_ban));
end $$;

revoke all on function public._bl_bo_dau(text), public._bl_noi_chu_roi(text), public._bl_kiem(text) from public, anon, authenticated;
revoke all on function public.fn_the_gioi_binh_luan_chu(text, text) from public, anon;
grant execute on function public.fn_the_gioi_binh_luan_chu(text, text) to authenticated;

-- ── 4. Công tắc: mở từ hôm nay (Thùy 03/11) ─────────────────────────────────
insert into public.tinh_nang (ma, ten, nhom, thu_tu, mo_tu, mo_ta)
values ('binh_luan_tu_do', 'Bình luận tự do (Thế giới BK)', 'choi', 126, date '2026-11-03',
        'Em gõ chữ bình luận dưới tin Thế giới BK (ngoài câu soạn sẵn/sticker). Lọc từ bậy ở DB (bảng tu_cam), lần bị chặn ghi the_gioi_bl_chan. Đóng = chỉ còn câu soạn sẵn.')
on conflict (ma) do nothing;
