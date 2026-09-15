-- ============================================================================
-- SIẾT NHÓM ① — TIỀN: hoá đơn · học phí · lương.
--
-- HIỆN TRẠNG (đo 15/08): 8 bảng tiền đều có policy `*_member_all` với điều kiện
-- `la_thanh_vien()` — tức **bất kỳ nhân sự nào đăng nhập cũng đọc VÀ GHI được**
-- 234 hoá đơn, 686 dòng thu, 25 công thức học phí, 7 bậc lương. Không phải lỗ hổng
-- lý thuyết: đó là mặc định đang chạy.
--
-- CEO chốt 15/08: nhóm được xem tiền = Thùy (NS001) · Lộc (NS003) · Thuỳ Trang (NS002).
--
-- ⭐ KHÔNG hardcode 3 người — nghịch luật repo "quyền bám GHẾ, không bám người".
--   Policy đọc CHÍNH bảng phân quyền đang chạy (`vai_tro_chuc_nang.chuc_nang = 'hocphi'`),
--   nên hôm nay khớp đúng ba người đó (đã kiểm: không ai khác có quyền này), và mai cấp
--   cho người thứ tư vẫn là TICK ở màn Phân quyền — DB tự theo, không cần migration.
--   ⇒ UI và DB nói CÙNG MỘT luật, không còn hai nguồn sự thật về quyền.
--
-- ⚠ VÌ SAO PHẢI XOÁ POLICY CŨ CHỨ KHÔNG THÊM CÁI MỚI: policy trong Postgres cộng dồn
--   kiểu HOẶC (permissive). Để `*_member_all` nằm đó thì mọi policy chặt thêm vào đều
--   vô nghĩa — ai đã là nhân sự vẫn lọt qua cửa cũ.
--
-- KIỂM TRƯỚC KHI XOÁ QUYỀN GHI: chỉ NS005 (tài khoản admin) và NS003 (Lộc) từng tạo
--   hoá đơn — cả hai đều còn quyền sau khi siết (NS005 có `la_admin_he_thong`). Không ai
--   khác đang nhập hoá đơn ⇒ không gãy việc của ai.
--
-- KHÔNG đụng dữ liệu. Chỉ đổi ai đọc/ghi được.
-- ============================================================================

-- ① Hàm kiểm quyền — bám ĐÚNG khuôn `my_quyen()` đang chạy: resolve nhân sự qua
--    tai_khoan.id = jwt_uid() HOẶC nhan_su.email = jwt_email() (người chưa có dòng
--    tai_khoan vẫn nhận được quyền — đúng bài học "cờ quyền theo NGƯỜI, không theo uid").
create or replace function public.co_chuc_nang(p_chuc_nang text)
returns boolean language sql stable security definer set search_path = public as $$
  with me as (
    select coalesce(
      (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
      (select id from nhan_su where email is not null
         and lower(email) = public.jwt_email() and public.jwt_email() <> '')
    ) as ns_id
  )
  select
    -- Founder / admin hệ thống bỏ qua mọi cổng (giữ nguyên hành vi hiện tại).
    coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id = me.ns_id), false)
    or exists (
      select 1 from me
      join vi_tri v             on v.nhan_su_id = me.ns_id
      join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
      where vc.chuc_nang = p_chuc_nang
    );
$$;

-- Quyền GHI chặt hơn quyền ĐỌC: ai được cấp dạng "chỉ xem" thì đọc được, KHÔNG ghi được.
-- (`vai_tro_chuc_nang.chi_xem` đã có sẵn và `my_quyen()` đang dùng — tái dùng, không đẻ khái niệm mới.)
create or replace function public.co_quyen_ghi(p_chuc_nang text)
returns boolean language sql stable security definer set search_path = public as $$
  with me as (
    select coalesce(
      (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
      (select id from nhan_su where email is not null
         and lower(email) = public.jwt_email() and public.jwt_email() <> '')
    ) as ns_id
  )
  select
    coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id = me.ns_id), false)
    or exists (
      select 1 from me
      join vi_tri v             on v.nhan_su_id = me.ns_id
      join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
      where vc.chuc_nang = p_chuc_nang and coalesce(vc.chi_xem, false) = false
    );
$$;

grant execute on function public.co_chuc_nang(text) to authenticated;
grant execute on function public.co_quyen_ghi(text) to authenticated;

-- ② Thay policy trên 8 bảng tiền: xoá cổng nhị phân, dựng cổng theo chức năng 'hocphi'.
do $$
declare
  bang text;
  ds text[] := array[
    'hoa_don', 'hoa_don_dong', 'hoa_don_log',
    'hoc_phi_cong_thuc', 'hoc_phi_phat_sinh', 'hoc_phi_tin_dung', 'hoc_phi_xet_duyet',
    'luong_bac'
  ];
begin
  foreach bang in array ds loop
    execute format('drop policy if exists %I on public.%I', bang || '_member_all', bang);
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.co_chuc_nang(''hocphi''))',
      bang || '_tien_read', bang);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.co_quyen_ghi(''hocphi'')) with check (public.co_quyen_ghi(''hocphi''))',
      bang || '_tien_write', bang);
    raise notice 'đã siết %', bang;
  end loop;
end $$;

-- ③ Chốt: không còn cổng nhị phân nào sót lại trên nhóm tiền.
do $$
declare sot text;
begin
  select string_agg(tablename || '.' || policyname, ', ') into sot
  from pg_policies
  where schemaname = 'public'
    and tablename in ('hoa_don','hoa_don_dong','hoa_don_log','hoc_phi_cong_thuc',
                      'hoc_phi_phat_sinh','hoc_phi_tin_dung','hoc_phi_xet_duyet','luong_bac')
    and qual ilike '%la_thanh_vien%';
  if sot is not null then
    raise exception 'HỎNG: còn policy cổng-nhị-phân trên nhóm tiền: %', sot;
  end if;
end $$;
