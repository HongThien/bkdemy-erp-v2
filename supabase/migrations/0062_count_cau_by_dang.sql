-- 0062: Đếm số câu theo dạng Ở POSTGRES (GROUP BY), trả 1 dòng jsonb.
-- LÝ DO: countCauByDang cũ = fetch MỌI câu (select dang_chinh) rồi group ở client. PostgREST cap
-- max-rows (~1000) → kho >1000 câu bị cắt → dạng mới (cuối heap) đếm 0 → thẻ "0/50" + "0%" dù kho đã có câu.
-- Trả jsonb (1 dòng { ma_dang: n }) nên KHÔNG bao giờ dính cap dòng, dù có bao nhiêu dạng.
-- SECURITY DEFINER + guard member (bypass RLS để COUNT nhanh, nhưng vẫn chỉ thành viên gọi được).
create or replace function public.count_cau_by_dang(p_tbl text)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
  execute format(
    'select coalesce(jsonb_object_agg(dang_chinh, n), ''{}''::jsonb)
       from (select dang_chinh, count(*) n from %I group by dang_chinh) t',
    p_tbl
  ) into result;
  return result;
end $$;

revoke all on function public.count_cau_by_dang(text) from public;
grant execute on function public.count_cau_by_dang(text) to authenticated;
