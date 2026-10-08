-- Thùy 08/10 (Nguyễn Thị Hà Thu 9A2 — yếu 7 dạng, máy chỉ đề xuất 3): "Cái chưa đủ 3 lần chỉ là ưu tiên thôi … KHÔNG coi số lần đo là
-- điều kiện xác nhận yếu mà là điều kiện để xếp ưu tiên" + "cứ yếu là phải bổ trợ cho dễ". Thay luật 23/09 (bỏ dạng <3 lần đo).
-- Sửa 2 hàm (dựng từ bản ĐANG CHẠY): bỏ điều kiện n >= 3, xếp dạng đủ 3 lần đo LÊN TRƯỚC rồi theo điểm.
--   fn_btyeu_dang_yeu_2_cua_so — đổ dạng cho case lúc mở/còn rỗng (vẫn giữ phạm vi 2 cửa sổ).
--   fn_btyeu_de_xuat_dang_moi  — nút "🤖 +N dạng yếu mới" ở màn Xếp (vẫn giữ: phải có lần đo mới sau ngày mở case).
-- Engine client (src/gami/danhgia.js · src/lib/danhgia.ts) đổi cùng luật trong cùng commit.
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                  left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = $1 and p.ma_dang = m.ma_dang and coalesce(b.ngay, g.graded_at::date) >= $2)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu')
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang = m.ma_dang and g.graded_at > cs.created_at)
      order by cs.case_id, (m.n >= 3) desc, m.score
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
end $function$;
