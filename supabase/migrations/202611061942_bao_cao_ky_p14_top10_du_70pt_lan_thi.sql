-- ============================================================================
-- 202611061942 — bao_cao_ky_p14_top10_du_70pt_lan_thi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 06/11 (xem PDF thử 9A1): "những bạn chỉ có 1 đầu điểm thì cao nhất là xếp thứ 10 — Top 10 nhất định phải đủ ít nhất
--   70% số lần thi". Phụ lục xếp theo hạng TB các lần ĐÃ thi ⇒ em chỉ thi 1 lần điểm cao lọt top.
-- LUẬT: "số lần thi" = số cột lần thi của khối × môn trong kì (phụ lục). Em ĐỦ = số lần đã thi ≥ 70% số cột (K9 5 lần ⇒ ≥ 4).
--   Hạng 1..10 chỉ dành cho em ĐỦ (xếp theo hạng TB như cũ, bằng nhau cùng hạng). Mọi em còn lại (đủ nhưng ngoài 10 + chưa đủ) xếp
--   tiếp sau nhóm top theo hạng TB. Áp cho hạng phụ lục và "Cả học kì" của em.
-- CHỖ ÁP: _bc_ky_xep_hang_lai(jsonb) — chạy trong fn_bc_ky_du_lieu (cả bản tính sống lẫn số liệu ĐÃ CHỐT) ⇒ không phải chốt lại 412 em;
--   xem / công bố / PDF đều đi qua đây. Hàm tính lại từ hang_tb + mảng điểm trong jsonb nên chạy lại nhiều lần vẫn ra một kết quả.
-- MẤT GÌ (Luật xoá): không — thêm 1 hàm, thay thân fn_bc_ky_du_lieu.
-- ============================================================================

create or replace function public._bc_ky_xep_hang_lai(p jsonb)
returns jsonb language sql immutable set search_path to 'public' as $$
  with cot as (select greatest(jsonb_array_length(coalesce(p -> 'phu_luc' -> 'cot', '[]'::jsonb)), 1) as n),
  hs as (
    select e.v, (e.v ->> 'hang_tb')::numeric as hang_tb,
           (select count(*) from jsonb_array_elements(coalesce(e.v -> 'diem', '[]'::jsonb)) x where x <> 'null'::jsonb) as so_lan
      from jsonb_array_elements(coalesce(p -> 'phu_luc' -> 'hs', '[]'::jsonb)) e(v)
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
                then jsonb_set(p, '{hang_ky,hang}', to_jsonb((select hang from e where (e.v ->> 'la_em')::boolean limit 1)))
                else p end,
           '{phu_luc,hs}',
           (select jsonb_agg(e.v || jsonb_build_object('hang', e.hang) order by e.hang, e.v ->> 'ten') from e))
  end
$$;

create or replace function public.fn_bc_ky_du_lieu(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb language plpgsql stable set search_path to 'public' as $$
declare v jsonb;
begin
  select s.du_lieu || jsonb_build_object('so_lieu_chot_at', s.chot_at) into v
    from bc_ky_so_lieu s where s.hoc_sinh_id = p_hs and s.mon = p_mon and s.ky_id = p_ky;
  if v is null then return public._bc_ky_xep_hang_lai(public.fn_bc_ky_tinh(p_hs, p_mon, p_ky)); end if;
  return public._bc_ky_xep_hang_lai(v || public._bc_ky_phan_gv(p_hs, p_mon, p_ky, v -> 'goi_y'));
end $$;
revoke execute on function public._bc_ky_xep_hang_lai(jsonb) from public, anon;
grant execute on function public._bc_ky_xep_hang_lai(jsonb) to authenticated, service_role;
revoke execute on function public.fn_bc_ky_du_lieu(uuid, text, uuid) from public, anon;
grant execute on function public.fn_bc_ky_du_lieu(uuid, text, uuid) to authenticated, service_role;
