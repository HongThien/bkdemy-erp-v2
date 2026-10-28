-- 5 bước checklist Quy trình HS mới ban đầu (Thùy 28/10). Sau này sửa ở tab Checklist, không qua migration.
-- Chạy lại không đẻ trùng: chỉ thêm bước chưa có (cùng tên, chưa xoá).
insert into public.hs_moi_buoc (ten, mau, thu_tu)
select v.ten, v.mau, v.thu_tu
  from (values
    ('Add phụ huynh vào nhóm lớp',                              '#3b82f6', 1),
    ('Add trợ giảng, giáo viên vào nhóm riêng',                 '#8b5cf6', 2),
    ('Gửi Cẩm nang đi học',                                     '#f59e0b', 3),
    ('Xác nhận phụ huynh đã nắm được thông tin trong cẩm nang', '#14b8a6', 4),
    ('Hỏi phụ huynh sau khi đi học buổi đầu',                   '#22c55e', 5)
  ) v(ten, mau, thu_tu)
 where not exists (select 1 from public.hs_moi_buoc b where b.ten = v.ten and b.xoa_at is null);
