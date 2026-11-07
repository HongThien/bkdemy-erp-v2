-- ============================================================================
-- bao_cao_ky_p17_phu_luc_bo_em_da_nghi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 07/11 "những bạn đã nghỉ thì không đưa vào phụ lục". Đo lúc viết: 14 em trong phụ lục không còn học lớp nào của môn
--   (KHTN K9 5 · Toán K6 4 · K7 2 · K8 2 · K9 1). Phụ lục ghi `lop` = lớp ĐANG HỌC của môn (fn_bc_ky_tinh, CTE lop_hs) ⇒ `lop` NULL = đã nghỉ môn.
-- SỬA: _bc_ky_xep_hang_lai bỏ dòng phụ lục có lop NULL (trừ chính em — không bao giờ tự bỏ) TRƯỚC khi xếp hạng (luật top 10 ≥ 70% giữ nguyên),
--   "Cả học kì" lấy hạng/tổng trên tập đã lọc. Áp qua fn_bc_ky_du_lieu như cũ ⇒ cả số liệu đã chốt, không chốt lại.
--   Điểm/TB/hạng TỪNG LẦN THI giữ nguyên (em đã nghỉ vẫn thật sự dự lần thi đó).
-- MẤT GÌ (Luật xoá): không — thay thân 1 hàm.
-- ============================================================================
create or replace function public._bc_ky_xep_hang_lai(p jsonb)
returns jsonb language sql immutable set search_path to 'public' as $$
  with cot as (select greatest(jsonb_array_length(coalesce(p -> 'phu_luc' -> 'cot', '[]'::jsonb)), 1) as n),
  hs as (
    select e.v, (e.v ->> 'hang_tb')::numeric as hang_tb,
           (select count(*) from jsonb_array_elements(coalesce(e.v -> 'diem', '[]'::jsonb)) x where x <> 'null'::jsonb) as so_lan
      from jsonb_array_elements(coalesce(p -> 'phu_luc' -> 'hs', '[]'::jsonb)) e(v)
     where (e.v ->> 'lop') is not null or coalesce((e.v ->> 'la_em')::boolean, false)   -- bỏ em đã nghỉ môn (Thùy 07/11)
  ),
  a as (select hs.*, hs.so_lan >= 0.7 * (select n from cot) as du from hs),
  b as (select a.*, rank() over (partition by a.du order by a.hang_tb) as r from a),
  c as (select b.*, (b.du and b.r <= 10) as top from b),
  nt as (select count(*) filter (where top) as n from c),
  e as (
    select c.*, case when c.top then c.r::int
                     else (select n from nt)::int + (rank() over (partition by c.top order by c.hang_tb))::int end as hang
      from c
  )
  select case
    when p -> 'phu_luc' is null or jsonb_array_length(coalesce(p -> 'phu_luc' -> 'hs', '[]'::jsonb)) = 0 then p
    else jsonb_set(
           case when p -> 'hang_ky' is not null and p -> 'hang_ky' <> 'null'::jsonb
                     and exists (select 1 from e where (e.v ->> 'la_em')::boolean)
                then jsonb_set(jsonb_set(p, '{hang_ky,hang}', to_jsonb((select hang from e where (e.v ->> 'la_em')::boolean limit 1))),
                               '{hang_ky,tong}', to_jsonb((select count(*) from e)))
                else p end,
           '{phu_luc,hs}',
           coalesce((select jsonb_agg(e.v || jsonb_build_object('hang', e.hang) order by e.hang, e.v ->> 'ten') from e), '[]'::jsonb))
  end
$$;
revoke execute on function public._bc_ky_xep_hang_lai(jsonb) from public, anon;
grant execute on function public._bc_ky_xep_hang_lai(jsonb) to authenticated, service_role;
