-- ============================================================================
-- dai_ban_do: XOÁ MỀM dạng (xoa_at + gop_vao) — spec-ban-do-4-tang.md §P1 (expand, CHỈ cộng).
--
-- Vì sao: PK ma_dang không bao giờ đổi / không xoá cứng (tham chiếu bằng TEXT không có FK —
-- dai_mcq_rule.ap_dung, log, form_tn… — xoá cứng là rụng im lặng). Dạng thừa sau khi dựng bản đồ
-- mới ⇒ đánh dấu xoa_at (+ gop_vao = dạng nhận thay thế, nếu có), KHÔNG xoá dòng.
--
-- Migration này CHỈ thêm 2 cột (null) + CHECK; mọi chỗ đọc hiện tại không đổi hành vi.
-- Chỗ đọc muốn ẩn dạng đã xoá phải tự thêm `xoa_at is null` (làm ở bước B5 chuyển bản đồ).
-- Dữ liệu: đánh dấu xoá mềm T112040307 (CEO duyệt 10/10; 0 câu — có guard).
-- ============================================================================
alter table dai_ban_do
  add column if not exists xoa_at timestamptz,
  add column if not exists gop_vao text references dai_ban_do(ma_dang);

alter table dai_ban_do drop constraint if exists dai_ban_do_xoa_mem_check;
alter table dai_ban_do add constraint dai_ban_do_xoa_mem_check
  check ((gop_vao is null or xoa_at is not null) and gop_vao is distinct from ma_dang);

comment on column dai_ban_do.xoa_at  is 'Xoá mềm: có giá trị = dạng đã bỏ khỏi bản đồ (mã KHÔNG cấp lại, dòng KHÔNG xoá). Chỗ đọc muốn ẩn phải lọc xoa_at is null.';
comment on column dai_ban_do.gop_vao is 'Dạng nhận thay thế khi xoá mềm (null = bỏ hẳn, không có dạng thay). Chỉ có khi xoa_at is not null.';

do $$
declare n int;
begin
  select count(*) into n from dai_cau_hoi where dang_chinh = 'T112040307';
  if n > 0 then
    raise exception 'T112040307 còn % câu — không xoá mềm', n;
  end if;
  update dai_ban_do set xoa_at = now() where ma_dang = 'T112040307' and xoa_at is null;
end $$;
