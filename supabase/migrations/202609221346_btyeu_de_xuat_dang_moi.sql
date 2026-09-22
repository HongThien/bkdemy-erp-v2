-- 22/09 — ĐÍNH CHÍNH ngay sau 202609221344: KHÔNG tự gộp. Đo thật: `fn_btyeu_gop_dang_may('Toán')` lần đầu sẽ nhét 116 dạng vào 63 case —
-- đó là dạng yếu CÓ SẴN mà người duyệt đã CỐ Ý không chọn ở bước Nội dung, không phải "dạng mới". Tự gộp = đè quyết định của người.
-- Đúng ý CEO ("đang bổ trợ mà có thêm dạng mới"): "mới" = yếu + ≥3 lần đo + CÓ LẦN ĐO SAU KHI MỞ CASE (gami_grades.graded_at > case.created_at).
-- Máy chỉ ĐỀ XUẤT (p_thuc_hien=false); người bấm "Thêm" cho 1 case (p_thuc_hien=true, p_case) ⇒ ghi nguon='may'. Máy đề xuất, người chốt.
drop function if exists public.fn_btyeu_gop_dang_may(text);

create or replace function public.fn_btyeu_de_xuat_dang_moi(p_mon text default null, p_case uuid default null, p_thuc_hien boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu' and c.n >= 3)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join %1$I bd on bd.ma_dang = m.ma_dang
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang = m.ma_dang and g.graded_at > cs.created_at)
      order by cs.case_id, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $$;
grant execute on function public.fn_btyeu_de_xuat_dang_moi(text, uuid, boolean) to authenticated;
