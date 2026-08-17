-- ============================================================================
-- SIẾT GHI SAU HẠN — bịt lỗ "deadline chỉ chặn ở UI".
--
-- Trước migration này: policy HS trên `bai_lam`/`bai_lam_cau` là `for all` với điều
-- kiện DUY NHẤT "đúng HS của mình" ⇒ nút disabled ở app là rào duy nhất. Gọi thẳng
-- PostgREST là sửa được đáp án sau hạn. Không chấp nhận được khi ET online sắp tính
-- vào mastery: điểm đã chốt mà vẫn sửa được thì phép đo vô nghĩa.
--
-- CÁCH: tách policy `for all` thành SELECT / INSERT / UPDATE riêng, gắn điều kiện
-- CÒN HẠN vào hai đường GHI. ĐỌC giữ nguyên tự do — HS phải xem lại được bài cũ.
--
-- KHÔNG đụng policy staff (`la_thanh_vien`): chấm lại, duyệt báo sai, backfill cache
-- đều phải chạy được sau hạn — đó là việc của người, có actor.
-- `et_nop` là SECURITY DEFINER và chủ bảng bỏ qua RLS ⇒ chấm lúc nộp vẫn chạy.
--
-- ⚠ ĐỒNG THỜI BỎ QUYỀN XOÁ CỦA HS (lỗ có sẵn, phát hiện khi rà policy): policy cũ
-- `for all` cho HS xoá `bai_lam`/`bai_lam_cau` của mình bất cứ lúc nào — tức xoá
-- được chính phép đo của mình. Không code nào trong app làm việc đó (đã grep), nên
-- bỏ là không mất chức năng. Bản mới KHÔNG khai policy DELETE cho HS ⇒ mặc định cấm.
-- ============================================================================

-- Test còn nhận bài không? NULL (không thấy test) → chỗ gọi coalesce về false.
-- SECURITY DEFINER để không phụ thuộc HS có đọc được `bai_test` hay không.
create or replace function bai_test_con_han(p_bai_test uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select bt.trang_thai = 'mo' and (bt.deadline is null or now() <= bt.deadline)
  from bai_test bt where bt.id = p_bai_test
$$;

comment on function bai_test_con_han(uuid) is
  'Test còn nhận bài? (chưa bị staff đóng tay VÀ chưa quá deadline). NULL nếu không có test.';

grant execute on function bai_test_con_han(uuid) to authenticated;

-- ── bai_lam ────────────────────────────────────────────────────────────────
drop policy if exists bai_lam_hs on bai_lam;

create policy bai_lam_hs_read on bai_lam for select to authenticated
  using (hoc_sinh_id = my_hoc_sinh_id());

-- Mở bài (tạo slot) chỉ khi test còn hạn.
create policy bai_lam_hs_insert on bai_lam for insert to authenticated
  with check (hoc_sinh_id = my_hoc_sinh_id() and coalesce(bai_test_con_han(bai_test_id), false));

-- Nộp bài / cập nhật slot chỉ khi còn hạn.
create policy bai_lam_hs_update on bai_lam for update to authenticated
  using (hoc_sinh_id = my_hoc_sinh_id() and coalesce(bai_test_con_han(bai_test_id), false))
  with check (hoc_sinh_id = my_hoc_sinh_id() and coalesce(bai_test_con_han(bai_test_id), false));

-- ── bai_lam_cau (đáp án + verdict = PHÉP ĐO) ───────────────────────────────
drop policy if exists bai_lam_cau_hs on bai_lam_cau;

create policy bai_lam_cau_hs_read on bai_lam_cau for select to authenticated
  using (exists (select 1 from bai_lam bl
                 where bl.id = bai_lam_cau.bai_lam_id and bl.hoc_sinh_id = my_hoc_sinh_id()));

create policy bai_lam_cau_hs_insert on bai_lam_cau for insert to authenticated
  with check (exists (select 1 from bai_lam bl
                      where bl.id = bai_lam_cau.bai_lam_id
                        and bl.hoc_sinh_id = my_hoc_sinh_id()
                        and coalesce(bai_test_con_han(bl.bai_test_id), false)));

create policy bai_lam_cau_hs_update on bai_lam_cau for update to authenticated
  using (exists (select 1 from bai_lam bl
                 where bl.id = bai_lam_cau.bai_lam_id
                   and bl.hoc_sinh_id = my_hoc_sinh_id()
                   and coalesce(bai_test_con_han(bl.bai_test_id), false)))
  with check (exists (select 1 from bai_lam bl
                      where bl.id = bai_lam_cau.bai_lam_id
                        and bl.hoc_sinh_id = my_hoc_sinh_id()
                        and coalesce(bai_test_con_han(bl.bai_test_id), false)));
