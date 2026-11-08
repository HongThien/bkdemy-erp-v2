-- ============================================================================
-- 202610231543 — mastery_bdm_so_sanh
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Màn "Mastery bản đồ mới" (admin, PLAN-mastery-ban-do-moi.md bước 5): trước khi bấm công tắc (thứ Hai 27/10) Thùy xem từng lớp
--   mastery CŨ vs MỚI khác thế nào — mỗi HS đếm số ô đạt / cần luyện / yếu / độ tin thấp ở 2 bản đồ. Đếm ở DB (CLAUDE.md §2.0),
--   dùng đúng công thức `_mastery_cells_core` (p_bdm false / true). Thêm trạng thái công tắc + 10 lần bật/tắt gần nhất.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 1 hàm đọc.
-- ============================================================================

create or replace function fn_mastery_bdm_so_sanh(p_lop uuid) returns jsonb
language plpgsql stable as $$
declare v_hs uuid[]; v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  select coalesce(array_agg(hl.hoc_sinh_id), '{}') into v_hs from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc';
  with cu as (select * from public._mastery_cells_core(false, v_hs)),
       moi as (select * from public._mastery_cells_core(true, v_hs)),
       dem as (
         select x.hoc_sinh_id, x.ban,
                count(*)::int as o, count(*) filter (where x.muc = 'dat')::int as dat, count(*) filter (where x.muc = 'can_luyen')::int as can_luyen,
                count(*) filter (where x.muc = 'yeu')::int as yeu, count(*) filter (where x.tin = 'thap')::int as tin_thap,
                count(*) filter (where x.ma_dang like 'NDB%')::int as o_ndb
           from (select *, 'cu' as ban from cu union all select *, 'moi' from moi) x
          group by 1, 2)
  select coalesce(jsonb_agg(jsonb_build_object(
           'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten,
           'cu', (select to_jsonb(d) - 'hoc_sinh_id' - 'ban' from dem d where d.hoc_sinh_id = h.id and d.ban = 'cu'),
           'moi', (select to_jsonb(d) - 'hoc_sinh_id' - 'ban' from dem d where d.hoc_sinh_id = h.id and d.ban = 'moi'))
         order by h.ho_ten), '[]'::jsonb)
    into v_out from hoc_sinh h where h.id = any(v_hs);
  return jsonb_build_object(
    'bat', public._mastery_bdm_bat(),
    'log', (select coalesce(jsonb_agg(jsonb_build_object('at', l.at, 'moi', l.moi, 'ai', coalesce(ns.ho_ten, '?')) order by l.at desc), '[]'::jsonb)
              from (select * from he_thong_cong_tac_log where ma = 'mastery_ban_do_moi' order by at desc limit 10) l
              left join tai_khoan tk on tk.id = l.actor left join nhan_su ns on ns.id = tk.nhan_su_id),
    'hs', v_out);
end $$;
revoke execute on function fn_mastery_bdm_so_sanh(uuid) from public, anon;
grant execute on function fn_mastery_bdm_so_sanh(uuid) to authenticated;
