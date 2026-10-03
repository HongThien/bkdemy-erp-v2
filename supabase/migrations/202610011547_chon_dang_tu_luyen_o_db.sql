-- ============================================================================
-- CHỌN DẠNG CHO TỰ LUYỆN TỔNG HỢP + THỬ THÁCH ĐƯỢC XUỐNG DB (CLAUDE §2.0; spec-v1-app-hs.md hạng mục 4 "Rank hoàn chỉnh")
--
-- Trước: app (chonDangTuLuyen, JS) tự chọn 10 dạng rồi gửi `thu_thach_sinh(p_mon, p_dangs)` ⇒ học sinh tinh ý có thể tự CHỌN DẠNG DỄ NHẤT
-- cho Thử thách để lấy Điểm Rank, và công thức mức nắm nằm ở 2 nơi (JS + SQL). Nay SERVER chọn dạng:
--   • 60% mỗi câu rút từ NỬA DƯỚI dạng theo mức nắm (yếu trước) · 40% rút từ TOÀN BỘ dạng em đã có số đo — giữ đúng luật cũ.
--   • Mức nắm = fn_mastery_cells (cùng bộ đo màn "Tự luyện chủ đề" và bản đồ phiêu lưu), chỉ các dạng thuộc MÔN (mọi khối, mọi nhánh — registry kho).
--   • Đo trên 12 em thật: nửa yếu JS ∩ SQL = 83% (chênh ở các dạng điểm bằng nhau).
-- 2 BƯỚC AN TOÀN: mig này THÊM hàm mới (app mới gọi). Hàm cũ thu_thach_sinh(text, jsonb) / tu_luyen_sinh(text, jsonb, text) GIỮ NGUYÊN quyền để bản app
-- đang chạy nền không hỏng — SAU KHI deploy app HS thì thu hồi quyền authenticated của 2 hàm đó (xem HANDOFF "VIỆC SAU DEPLOY").
-- ============================================================================

create or replace function public._tu_luyen_chon_dang(p_hs uuid, p_mon text, p_so integer default 10)
returns jsonb language plpgsql volatile as $$
declare
  v_dangs text[]; v_all text[]; v_yeu text[]; v_out jsonb := '[]'::jsonb; i int;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- mọi dạng của môn (bản đồ gốc + nhánh hình) — cùng cách fn_nhiem_vu_hoan_thanh lấy danh sách dạng (§1.6)
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;
  select array_agg(m.ma_dang order by m.score asc, m.ma_dang) into v_all
    from public.fn_mastery_cells(array[p_hs], true, null, 5, 5, 3) m
   where m.hoc_sinh_id = p_hs and m.ma_dang = any(v_dangs) and m.score is not null;
  if v_all is null or cardinality(v_all) = 0 then return '[]'::jsonb; end if;   -- chưa có số đo nào ⇒ không có gì để luyện
  v_yeu := v_all[1 : greatest(1, ceil(cardinality(v_all) / 2.0)::int)];
  for i in 1..p_so loop
    v_out := v_out || to_jsonb(case when random() < 0.6 then v_yeu[1 + floor(random() * cardinality(v_yeu))::int]
                                    else v_all[1 + floor(random() * cardinality(v_all))::int] end);
  end loop;
  return v_out;
end $$;

-- Tự luyện Tổng hợp: server chọn dạng, rồi sinh câu bằng tu_luyen_sinh như cũ.
create or replace function public.fn_tu_luyen_sinh_tu_dong(p_mon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_dangs jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_dangs := public._tu_luyen_chon_dang(v_hs, p_mon, 10);
  if jsonb_array_length(v_dangs) = 0 then
    raise exception 'Chưa có dữ liệu học tập nào để tự luyện — học vài buổi đã rồi quay lại nhé.';
  end if;
  return public.tu_luyen_sinh(p_mon, v_dangs);
end $$;

-- Thử thách: server chọn dạng ⇒ học sinh KHÔNG còn chọn được dạng để lấy Điểm Rank.
create or replace function public.fn_thu_thach_sinh_tu_dong(p_mon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_dangs jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_dangs := public._tu_luyen_chon_dang(v_hs, p_mon, 10);
  if jsonb_array_length(v_dangs) = 0 then
    raise exception 'Chưa có dữ liệu học tập nào để làm Thử thách — học vài buổi đã rồi quay lại nhé.';
  end if;
  return public.thu_thach_sinh(p_mon, v_dangs);
end $$;

revoke all on function public._tu_luyen_chon_dang(uuid, text, integer) from public, anon, authenticated;
revoke all on function public.fn_tu_luyen_sinh_tu_dong(text) from public, anon;
grant execute on function public.fn_tu_luyen_sinh_tu_dong(text) to authenticated;
revoke all on function public.fn_thu_thach_sinh_tu_dong(text) from public, anon;
grant execute on function public.fn_thu_thach_sinh_tu_dong(text) to authenticated;
