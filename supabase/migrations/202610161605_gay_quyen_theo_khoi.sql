-- ============================================================================
-- gay_quyen_theo_khoi — Thùy 16/10: mở rộng quyền đánh gậy theo KHỐI của lớp.
-- ----------------------------------------------------------------------------
-- Trước: quyền chốt/bỏ qua/đánh/gỡ gậy chỉ theo CÂY vị trí (người dưới ghế mình).
-- GV nằm ở nhánh Giáo viên nên trưởng khối bên Trợ giảng không xử lý được task của
-- GV dạy lớp khối mình (vd BTVN 4A1/5A1 của Lộ Thị Dương).
-- Nay thêm trục thứ hai: người có dòng trong gay_quyen_khoi được xử lý
--   · đề xuất gậy 'cho' mà buổi gốc thuộc lớp có lop.khoi ∈ khoi của mình;
--   · đánh/gỡ/thu hồi cho nhân sự có phân công lớp thuộc các khối đó.
-- toan_quyen = như admin trong màn Gậy (mọi người, mọi đề xuất).
-- KHÔNG ai tự xử lý gậy của chính mình theo trục khối.
-- Trục cây cũ GIỮ NGUYÊN — client gộp hai trục (hợp).
-- ============================================================================

create table if not exists public.gay_quyen_khoi (
  nhan_su_id  uuid primary key references public.nhan_su(id),
  toan_quyen  boolean not null default false,
  khoi        text[]  not null default '{}',
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
alter table public.gay_quyen_khoi enable row level security;
drop policy if exists gay_quyen_khoi_member_read on public.gay_quyen_khoi;
create policy gay_quyen_khoi_member_read on public.gay_quyen_khoi
  for select to authenticated using (public.la_thanh_vien());

-- Thùy 16/10: Hà Giang 6·7 · Cường 8 · Hải 9 · Đạt 10·11·12 · Trang Phạm toàn quyền.
-- 8T là lớp khối 8 nâng cao ⇒ đi cùng khối 8.
insert into public.gay_quyen_khoi (nhan_su_id, toan_quyen, khoi, ghi_chu) values
  ('1fbe3d7f-986c-4cac-8e5f-cd5af9ff823b', false, '{6,7}',        'Nguyễn Hà Giang — Thùy 16/10'),
  ('240555bd-35fb-4aaa-8a3a-084bf7088f52', false, '{8,8T}',       'Tạ Quốc Cường — Thùy 16/10'),
  ('e2253835-ec57-46e0-b351-a26065501547', false, '{9}',          'Nguyễn Công Hải — Thùy 16/10'),
  ('980f2aca-69dc-4764-9902-60bce642edad', false, '{10,11,12}',   'Trần Hoàng Đạt — Thùy 16/10'),
  ('e8573f34-65cf-4069-808c-44f10ee39c2e', true,  '{}',           'Phạm Thị Thùy Trang — toàn quyền, Thùy 16/10')
on conflict (nhan_su_id) do update set toan_quyen = excluded.toan_quyen, khoi = excluded.khoi, ghi_chu = excluded.ghi_chu;

-- Phạm vi gậy theo khối của NGƯỜI ĐANG ĐĂNG NHẬP.
--   ns_ids      = nhân sự có phân công lớp thuộc khối của tôi (trừ tôi)
--   de_xuat_ids = đề xuất 'cho' có buổi gốc thuộc lớp khối của tôi (trừ đề xuất của tôi)
-- ref_key vận hành: 'vh:<buoi_hoc_id>|<tab>|<nhan_su_id>'.
create or replace function public.fn_gay_pham_vi_khoi()
returns jsonb
language sql stable
set search_path = public
as $$
  with toi as (
    select q.nhan_su_id, q.toan_quyen, q.khoi
    from gay_quyen_khoi q where q.nhan_su_id = public.current_nhan_su_id()
  )
  select coalesce((
    select jsonb_build_object(
      'toan_quyen', t.toan_quyen,
      'khoi', to_jsonb(t.khoi),
      'ns_ids', coalesce((
        select jsonb_agg(distinct pc.nhan_su_id)
        from phan_cong_lop pc join lop l on l.id = pc.lop_id
        where l.khoi = any(t.khoi) and pc.nhan_su_id <> t.nhan_su_id), '[]'::jsonb),
      'de_xuat_ids', coalesce((
        select jsonb_agg(d.id)
        from gay_de_xuat d
        join buoi_hoc b on b.id::text = substring(d.ref_key from '^vh:([0-9a-f-]{36})[|]')
        join lop l on l.id = b.lop_id
        where d.trang_thai = 'cho' and l.khoi = any(t.khoi) and d.nhan_su_id <> t.nhan_su_id), '[]'::jsonb))
    from toi t),
    jsonb_build_object('toan_quyen', false, 'khoi', '[]'::jsonb, 'ns_ids', '[]'::jsonb, 'de_xuat_ids', '[]'::jsonb));
$$;

revoke execute on function public.fn_gay_pham_vi_khoi() from public;
revoke execute on function public.fn_gay_pham_vi_khoi() from anon;
grant execute on function public.fn_gay_pham_vi_khoi() to authenticated;
