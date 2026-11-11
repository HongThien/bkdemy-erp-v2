-- POPUP KẾ HOẠCH BỔ TRỢ: "Xem tất cả" nhóm (Thùy 11/11 — "5 cái ưu tiên cao nhất phải có nút mở rộng tất cả để trưởng khối chọn").
-- fn_btk_goi_y chỉ trả 5 nhóm % thấp nhất. Hàm này trả MỌI nhóm em đã đo (cùng hình dạng dòng, thấp → cao), chỉ gọi khi trưởng khối
-- bấm "Xem tất cả" (bấm đến đâu gọi đến đấy — CLAUDE §2.0). Cùng quyền với fn_btk_goi_y. fn_btk_luu vốn nhận mọi nhóm của bản đồ.
-- MẤT GÌ: không. Thêm 1 hàm đọc.
create or replace function public.fn_btk_goi_y_tat_ca(p_hs uuid, p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_lop record;
begin
  select * into v_lop from public._btk_lop_hs(p_hs, p_mon);
  if v_lop.khoi is null then raise exception 'Em không học lớp % nào đang mở.', p_mon; end if;
  if not (public._btk_la_tk(p_mon, v_lop.khoi) or public._btk_la_tbm(p_mon, v_lop.khoi)) then
    raise exception 'Không có quyền với khối % môn %', v_lop.khoi, p_mon using errcode = '42501';
  end if;
  return (
    with nh as (select * from public._btk_nhom_hs(array[p_hs], p_mon)),
    dg as (
      select coalesce(hh.ma_bai, db.nhom_id) as nhom, count(*) filter (where m.muc <> 'dat')::int as chua_dat, count(*)::int as da_do
        from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang'], 5, 5, 3) m
        left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
       where m.cap = 'dang' group by 1
    )
    select coalesce(jsonb_agg(jsonb_build_object('ma', z.ma, 'ten', z.ten, 'cha', z.cha, 'p', round(100 * z.score)::int, 'n', z.n,
                     'muc', z.muc, 'tin', z.tin, 'dang_chua_dat', coalesce(dg.chua_dat, 0), 'dang_da_do', coalesce(dg.da_do, 0), 'tick', z.muc = 'yeu')
                   order by z.score, z.ten), '[]'::jsonb)
      from nh z left join dg on dg.nhom = z.ma
  );
end $$;
revoke all on function public.fn_btk_goi_y_tat_ca(uuid, text) from public, anon;
grant execute on function public.fn_btk_goi_y_tat_ca(uuid, text) to authenticated, service_role;
