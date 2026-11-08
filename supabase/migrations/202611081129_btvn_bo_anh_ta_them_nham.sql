-- BỎ ẢNH TRỢ GIẢNG THÊM NHẦM (CEO 08/11/2026: "thêm nhầm ảnh mà không có nút xoá để chọn lại").
-- Ảnh bài nộp là bằng chứng + được trỏ bằng id không FK (btvn_ai_lan.thu_tu_anh) ⇒ KHÔNG xoá cứng
-- (CLAUDE.md §2 "kho rác"): đánh dấu bo_at/bo_boi NGAY TRONG btvn_nop_anh, mọi chỗ đọc lọc bo_at is null.
-- File ảnh vẫn nằm trong bucket (bucket không có policy delete).
-- Chỉ bỏ được ảnh TRỢ GIẢNG tự thêm (path 'ta/…' — fn_btvn_nop_ta_them / app TA) khi bài CHƯA trả phụ huynh.
-- Ảnh phụ huynh nộp (đường app PH) không bỏ được từ đây.

alter table btvn_nop_anh add column if not exists bo_at timestamptz;
alter table btvn_nop_anh add column if not exists bo_boi uuid;

create or replace function public.fn_btvn_anh_bo(p_anh_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare a record;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select * into a from btvn_nop_anh where id = p_anh_id for update;
  if a is null then raise exception 'Không thấy ảnh.'; end if;
  if a.bo_at is not null then return; end if;
  if a.path not like 'ta/%' then
    raise exception 'Chỉ bỏ được ảnh trợ giảng tự thêm — ảnh phụ huynh nộp được giữ làm bằng chứng.';
  end if;
  if exists (select 1 from btvn_nop n where n.hoc_sinh_id = a.hoc_sinh_id and n.buoi_hoc_id = a.buoi_hoc_id and n.tra_at is not null) then
    raise exception 'Bài đã trả cho phụ huynh — không bỏ ảnh được nữa.';
  end if;
  update btvn_nop_anh set bo_at = now(), bo_boi = public.jwt_uid() where id = p_anh_id;
end $$;
revoke execute on function public.fn_btvn_anh_bo(uuid) from public, anon;
grant execute on function public.fn_btvn_anh_bo(uuid) to authenticated;

-- ── Mọi chỗ đọc ảnh: bỏ qua ảnh đã bỏ ──
create or replace view public.v_btvn_tra_anh as
  select a.hoc_sinh_id, a.buoi_hoc_id, a.thu_tu, coalesce(a.path_cham, a.path) as path
  from btvn_nop_anh a
  join btvn_nop n on n.hoc_sinh_id = a.hoc_sinh_id and n.buoi_hoc_id = a.buoi_hoc_id
  where n.tra_at is not null and a.bo_at is null;

create or replace view public.v_btvn_nop_ph as
  select n.hoc_sinh_id, n.buoi_hoc_id, b.ngay, l.mon, l.ten_lop, n.nop_at, n.tra_at,
         (select count(*) from btvn_nop_anh a
          where a.hoc_sinh_id = n.hoc_sinh_id and a.buoi_hoc_id = n.buoi_hoc_id and a.bo_at is null) as so_anh,
         n.buoi_xac_nhan_at is not null as buoi_da_chot
  from btvn_nop n
  join buoi_hoc b on b.id = n.buoi_hoc_id
  left join lop l on l.id = b.lop_id;

create or replace function public._btvn_hs_xem_anh(p_name text)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists (
    select 1 from btvn_nop_anh a
    join btvn_nop n on n.hoc_sinh_id = a.hoc_sinh_id and n.buoi_hoc_id = a.buoi_hoc_id
    where n.hoc_sinh_id = public.my_hoc_sinh_id() and n.tra_at is not null and a.bo_at is null
      and (a.path = p_name or a.path_cham = p_name)
  )
$$;

create or replace function public.fn_btvn_ai_yeu_cau(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v timestamptz;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  if not exists (select 1 from btvn_nop_anh where buoi_hoc_id = p_buoi_hoc_id and hoc_sinh_id = p_hoc_sinh_id and bo_at is null) then
    raise exception 'Chưa có ảnh bài làm — thêm ảnh trước khi gửi chấm.';
  end if;
  insert into btvn_ai_yeu_cau (buoi_hoc_id, hoc_sinh_id, yeu_cau_at, yeu_cau_boi)
  values (p_buoi_hoc_id, p_hoc_sinh_id, now(), public.jwt_uid())
  on conflict (buoi_hoc_id, hoc_sinh_id) do update set yeu_cau_at = now(), yeu_cau_boi = public.jwt_uid()
  returning yeu_cau_at into v;
  return v;
end $$;

create or replace function public.fn_btvn_ai_du_lieu(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  select jsonb_build_object(
    'lop', l.ten_lop, 'khoi', l.khoi, 'mon', l.mon, 'ngay', b.ngay,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'problem_id', sp.id, 'so', sp.problem_no, 'ma_cau', sp.ma_cau, 'ma_dang', sp.ma_dang,
        'hinh', sp.hinh_baitoan_id is not null, 'hinh_nhan', sp.hinh_nhan,
        'loai_cau', coalesce(d.loai_cau, k.loai_cau),
        'de_bai', coalesce(d.noi_dung, k.noi_dung),
        'lua_chon', coalesce(d.lua_chon, k.lua_chon),
        'menh_de', coalesce(d.menh_de, k.menh_de),
        'dap_an', coalesce(d.dap_an, k.dap_an),
        'loi_giai', coalesce(d.loi_giai, k.loi_giai)) order by sp.problem_no)
      from gami_session_problems sp
      left join dai_cau_hoi d on l.mon = 'Toán' and d.ma_cau = sp.ma_cau
      left join khtn_cau_hoi k on l.mon = 'KHTN' and k.ma_cau = sp.ma_cau
      where sp.buoi_hoc_id = b.id and sp.phase = 'btvn' and not sp.ngoai_de), '[]'::jsonb),
    'anh', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'path', a.path) order by a.thu_tu, a.created_at)
      from btvn_nop_anh a where a.buoi_hoc_id = b.id and a.hoc_sinh_id = p_hoc_sinh_id and a.bo_at is null), '[]'::jsonb))
  into v
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.id = p_buoi_hoc_id;
  if v is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  return v;
end $$;
