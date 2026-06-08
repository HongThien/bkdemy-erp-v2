-- 0009 — Lý thuyết theo NỘI DUNG (text + LaTeX, render như bài tập) thay vì chỉ file.
-- noi_dung = nội dung chính; file_url/ten_file thành ĐÍNH KÈM tuỳ chọn (nullable).
alter table dai_dang_ly_thuyet add column if not exists noi_dung text not null default '';
alter table dai_dang_ly_thuyet alter column file_url drop not null;
