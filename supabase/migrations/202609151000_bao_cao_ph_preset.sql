-- Preset nhận xét cho Report PH: 2 trục (kien_thuc / thai_do).
-- Mỗi preset có mức 1..5 + text. Dropdown ở Report PH load từ bảng này thay vì hard-code.
-- Text HS đã lưu ở bao_cao_ph.kien_thuc_ky_nang / thai_do là SNAPSHOT — sửa/xoá preset về sau KHÔNG đổi báo cáo cũ.
-- Chia sẻ chung toàn trung tâm; ai đăng nhập cũng CRUD được (chưa phân quyền hẹp, cần thì siết sau).

create table if not exists bao_cao_ph_preset (
  id          uuid primary key default gen_random_uuid(),
  truc        text not null check (truc in ('kien_thuc', 'thai_do')),
  muc         int  not null check (muc between 1 and 5),
  noi_dung    text not null check (btrim(noi_dung) <> ''),
  thu_tu      int  not null default 0,          -- override sort trong cùng mức (ASC); mặc định 0.
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists bao_cao_ph_preset_truc_muc_idx
  on bao_cao_ph_preset (truc, muc desc, thu_tu, created_at);

-- Seed: 12 preset hiện đang hard-code trong ReportPHScreen.tsx (Thùy chốt 14/09).
-- Chèn có điều kiện — nếu bảng đã có preset của trục đó thì bỏ qua (idempotent với chạy lại).
insert into bao_cao_ph_preset (truc, muc, noi_dung, thu_tu)
select * from (values
  ('kien_thuc'::text, 5, 'Với những dạng bài đã được học, con làm lại chính xác gần như tuyệt đối, bài của con trình bày đủ ý, đúng thứ tự.', 0),
  ('kien_thuc',       4, 'Các bài con đã nắm được phương pháp làm rồi thì gần như có thể trình bày lại được chuẩn, đôi lúc còn tính sai.', 0),
  ('kien_thuc',       4, 'Các bài con hiểu rồi thì gần như có thể trình bày lại được chuẩn, thi thoảng con còn quên câu kết luận hoặc đơn vị.', 1),
  ('kien_thuc',       3, 'Bài làm của con thường xuyên gặp các lỗi sai về tính toán; nên dù có nắm được cách làm bài nhưng vẫn mất nhiều điểm.', 0),
  ('kien_thuc',       3, 'Bài làm của con thường xuyên gặp các lỗi sai về trình bày thiếu ý/tắt, chưa khoa học, nên dù có nắm được cách làm bài nhưng vẫn mất nhiều điểm.', 1),
  ('kien_thuc',       2, 'Bài làm của con thường xuyên gặp tình trạng tính sai và trình bày tắt. Nên ngay cả khi biết cách làm thì vẫn mất rất nhiều điểm.', 0),
  ('thai_do',         5, 'Con hoàn thành tốt các yêu cầu: Nộp bài tập về nhà đúng hạn, Đi học đúng giờ, Tập trung làm bài luyện trên lớp. Ngoài ra con rất chủ động hỏi bài khi chưa hiểu, chưa biết.', 0),
  ('thai_do',         4, 'Con hoàn thành tốt các yêu cầu: Nộp bài tập về nhà đúng hạn, Đi học đúng giờ, Tập trung làm bài luyện trên lớp.', 0),
  ('thai_do',         3, 'Con nộp BTVN muộn một số buổi.', 0),
  ('thai_do',         3, 'Chưa tập trung làm Bài luyện trên lớp, còn nói chuyện, đùa nghịch với các bạn.', 1),
  ('thai_do',         3, 'Con thường xuyên đi học muộn vì lí do chủ quan.', 2),
  ('thai_do',         2, 'Con thường xuyên nộp muộn BTVN hoặc thiếu BTVN một số buổi.', 0)
) as v(truc, muc, noi_dung, thu_tu)
where not exists (select 1 from bao_cao_ph_preset limit 1);

-- Trigger tự cập nhật updated_at khi UPDATE.
create or replace function bao_cao_ph_preset_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_bao_cao_ph_preset_touch on bao_cao_ph_preset;
create trigger trg_bao_cao_ph_preset_touch
  before update on bao_cao_ph_preset
  for each row execute function bao_cao_ph_preset_touch();
