-- Đợt 3 bước 6 — tinh_san_ban thành NHẬT KÝ CHỈ-CHÈN (spec-kien-truc.md §4, sửa 14/11). Thùy gật "Đổi đi".
-- Trước: khoá chính (so, khoa) ⇒ đánh dấu bẩn phải upsert ⇒ giao dịch dài giữ khoá dòng, chặn đường ghi nóng (HS nộp bài).
-- Sau: mỗi lần đánh dấu = chèn 1 dòng (so, khoa, at); "bẩn" = có dòng at > mốc của bảng lưu; dọn dòng dưới mốc sau khi tính (như mastery_ban_log).
-- Bảng CHƯA sổ nào dùng và phải đang rỗng — có dòng thì dừng, không đổi.
do $do$
begin
  if exists (select 1 from public.tinh_san_ban) then raise exception 'tinh_san_ban đang có dữ liệu — không đổi cấu trúc.'; end if;
end $do$;

alter table public.tinh_san_ban drop constraint tinh_san_ban_pkey;
alter table public.tinh_san_ban add column id bigint generated always as identity primary key;
drop index public.tinh_san_ban_so_at_idx;
create index tinh_san_ban_so_khoa_at_idx on public.tinh_san_ban (so, khoa, at);
comment on table public.tinh_san_ban is 'Sổ bẩn chung của các sổ tính sẵn — NHẬT KÝ CHỈ-CHÈN (so, khoa, at). Trigger nguồn chỉ INSERT, không upsert. Bẩn = có dòng at > mốc của bảng lưu.';
