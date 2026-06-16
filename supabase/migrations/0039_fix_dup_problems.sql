-- Bài bị TRÙNG (seed chạy 2 lần: StrictMode + insert không idempotent). Dedupe rồi chặn cứng bằng unique.
-- Giữ dòng CÓ điểm chấm trước, else id nhỏ nhất; xoá phần dư.
with ranked as (
  select p.id, row_number() over (
    partition by p.buoi_hoc_id, p.phase, p.problem_no
    order by (exists (select 1 from gami_grades g where g.problem_id = p.id)) desc, p.id asc
  ) rn
  from gami_session_problems p
)
delete from gami_session_problems where id in (select id from ranked where rn > 1);

alter table gami_session_problems add constraint gami_session_problems_uq unique (buoi_hoc_id, phase, problem_no);
