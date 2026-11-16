-- ============================================================================
-- 202611161926 — clone_giao_trinh_rieng_5a1
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11: "t xóa cái trùng rồi. 5A1 5A2 đang dùng chung cái giáo trình. m clone ra 1 cái riêng của 5A1 đi".
--   Luật 1 giáo trình = 1 lớp (spec-giao-trinh-tuan §2). "Giáo trình 5A2" (ca112473…, gắn 5A2) có 2 buổi (Buổi 30, 31) và CẢ 5A1 lẫn 5A2
--   đã dạy cả hai (5A1: 10/11 · 13/11; 5A2: 09/11 · 16/11).
--   (1) Tạo "Giáo trình 5A1" (cùng khối / môn / nhánh / theme / cấu hình in), copy từng buổi bằng ĐÚNG hàm của builder fn_tl_bdm_copy_buoi
--       (không viết bộ chép thứ hai; phần luyện lại bám giáo trình nguồn không chép — như nút "Lấy buổi từ lớp khác").
--   (2) Chuyển các dòng lịch sử CỦA 5A1 (bản chép giao_trinh_buoi + phiếu btvn) đang trỏ giáo trình chung sang trỏ bản clone (buổi tương ứng)
--       ⇒ lịch sử 5A1 nằm trọn trong giáo trình 5A1, "buổi kế tiếp" của 5A1 không đề xuất dạy lại Buổi 30. Nội dung hai buổi giống hệt
--       (vừa chép) nên chỉ đổi NGUỒN tham chiếu, không đổi bài đã giao. Trigger trg_gtt_theo_ngay_day tự đẻ liên kết ca cho 2 ngày đó.
--   Dòng của 5A2 giữ nguyên. Đổi trước–sau ghi bằng RAISE NOTICE (migrate in ra) + DEVLOG.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Ghi đè nguon_id / nguon_buoi của tối đa 4 dòng tai_lieu của 5A1 (giao_trinh_buoi + btvn ngày 10/11, 13/11):
--   nguon_id ca112473-15bb-4274-8b9f-367ae493b1bf → giáo trình 5A1 mới; nguon_buoi 5e3a62e4-6d82-4525-985a-15c09bfa4e1d (Buổi 30) /
--   e3837cc6-90d5-424c-98e2-795090b50fb6 (Buổi 31) → buổi tương ứng trong bản clone.
-- ============================================================================

set local lock_timeout = '3s';

do $$
declare
  v_src uuid := 'ca112473-15bb-4274-8b9f-367ae493b1bf';
  v_lop uuid; v_moi uuid; v_map jsonb := '{}'::jsonb; r record; v_n int;
begin
  select l.id into v_lop from lop l where l.ten_lop = '5A1' and l.mon = 'Toán' and l.trang_thai = 'dang_hoc';
  if v_lop is null then raise exception 'Không thấy lớp 5A1 đang học.'; end if;
  if not exists (select 1 from tai_lieu where id = v_src and loai = 'giao_trinh' and ban_do = 'moi') then
    raise exception 'Không thấy giáo trình nguồn.';
  end if;
  if exists (select 1 from tai_lieu t where t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.lop_id = v_lop and t.luu_tru_tu is null
               and t.nhanh is not distinct from (select nhanh from tai_lieu where id = v_src)) then
    raise exception '5A1 đã có giáo trình cùng nhánh — không clone chồng.';
  end if;

  insert into tai_lieu (loai, ten, khoi, mon, nhanh, theme, cau_hinh, ban_do, lop_id, created_by)
  select s.loai, 'Giáo trình 5A1', s.khoi, s.mon, s.nhanh, s.theme, s.cau_hinh, s.ban_do, v_lop, s.created_by
    from tai_lieu s where s.id = v_src
  returning id into v_moi;

  for r in select p.id from tai_lieu_phan p where p.tai_lieu_id = v_src and p.loai_phan = 'buoi' order by p.thu_tu, p.id loop
    v_map := v_map || jsonb_build_object(r.id::text, (select c.buoi_moi_id from public.fn_tl_bdm_copy_buoi(r.id, v_moi, null) c)::text);
  end loop;
  raise notice 'Giáo trình 5A1 = % · buổi cũ → mới: %', v_moi, v_map;

  update tai_lieu t
     set nguon_id = v_moi, nguon_buoi = v_map ->> t.nguon_buoi
   where t.nguon_id = v_src and t.lop_id = v_lop and t.loai in ('giao_trinh_buoi', 'btvn') and v_map ? t.nguon_buoi;
  get diagnostics v_n = row_count;
  raise notice 'Chuyển % dòng lịch sử của 5A1 sang giáo trình 5A1.', v_n;
end $$;
