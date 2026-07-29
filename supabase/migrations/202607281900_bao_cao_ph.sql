-- Report tháng gửi PHỤ HUYNH: nhận xét của GV cho mỗi (HS × môn × tháng). 3 ô: thái độ · kiến thức&kĩ năng · kết luận.
-- Số liệu (bảng theo buổi + tổng quan mastery) SUY ĐỘNG, không lưu ở đây — chỉ lưu phần nhận xét người viết.
create table if not exists bao_cao_ph (
  hoc_sinh_id       uuid not null references hoc_sinh(id) on delete cascade,
  mon               text not null,
  thang             text not null,          -- 'YYYY-MM'
  thai_do           text,                    -- nhận xét Thái độ học tập
  kien_thuc_ky_nang text,                    -- nhận xét Kiến thức & Kĩ năng
  ket_luan          text,                    -- Kết luận
  updated_by        uuid,
  updated_at        timestamptz not null default now(),
  primary key (hoc_sinh_id, mon, thang)
);
