-- ============================================================================
-- 202610261837 — bdm_dang_chon_chung
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10: công cụ vận hành chọn dạng theo bản đồ mới (chuông báo động, chấm buổi TA/GV, màn buổi học trước; builder,
--   kho sau). Bộ chọn dạng dùng chung (DangPickerOne) cần 1 nguồn "dạng bài của (môn, khối)" — agent đuổi đã làm đúng việc
--   này trong fn_duoi_dang_chon; đưa thân lên hàm CHUNG fn_bdm_dang_chon, hàm đuổi gọi lại (1 nguồn, không chép).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 1 hàm, thân fn_duoi_dang_chon gọi sang (kết quả y hệt).
-- ============================================================================

-- Dạng bài bản đồ mới của (môn, khối) cho các bộ chọn dạng; (môn, khối) chưa chạy bản đồ mới ⇒ {ban_do:'cu'} (client giữ bộ chọn cũ)
create or replace function fn_bdm_dang_chon(p_mon text, p_khoi text) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not coalesce('bdm' = any(public._kho_ds_nhanh_khoi(p_mon, p_khoi)), false) then
    return jsonb_build_object('ban_do', 'cu', 'dangs', '[]'::jsonb);
  end if;
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma_dang', b.ma_dang, 'ten_dang', b.ten_dang, 'muc_do', b.muc_do, 'bac_toi_thieu', b.bac_toi_thieu,
             'ma_chu_de', b.ma_chu_de, 'ten_chu_de', b.ten_chu_de,
             'ma_chuyen_de', b.ma_chuyen_de, 'ten_chuyen_de', b.ten_chuyen_de,
             'ma_nhom', b.ma_nhom, 'ten_nhom', b.ten_nhom)
           order by b.thu_tu_chu_de, b.ma_chu_de, b.thu_tu_chuyen_de, b.ma_chuyen_de, b.thu_tu_nhom, b.ma_nhom, b.thu_tu_dang, b.ma_dang), '[]'::jsonb)
      from %I b where b.khoi = $1
  $q$, public._kho_ban_do_tbl(p_mon, 'bdm')) into v_out using p_khoi;
  return jsonb_build_object('ban_do', 'moi', 'dangs', v_out);
end $$;
revoke execute on function fn_bdm_dang_chon(text, text) from public, anon;
grant execute on function fn_bdm_dang_chon(text, text) to authenticated;

create or replace function fn_duoi_dang_chon(p_mon text, p_khoi text) returns jsonb
language sql stable security definer set search_path to 'public' as $$ select public.fn_bdm_dang_chon(p_mon, p_khoi) $$;
