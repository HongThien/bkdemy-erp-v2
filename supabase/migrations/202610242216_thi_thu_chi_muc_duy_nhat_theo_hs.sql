-- ============================================================================
-- thi_thu_chi_muc_duy_nhat_theo_hs
-- ----------------------------------------------------------------------------
-- VÌ SAO (HS cấp 3 báo 24/10: bấm "Thi thử" bị đá ra màn hình chính): chỉ mục duy nhất uq_bai_test_doc
--   (nguon_tai_lieu_id, lop_id, ngay, loai) sinh ra cho bài PHÁT HÀNH CẢ LỚP (et/btvn/giáo trình: 1 đề × 1 lớp × 1 ngày).
--   Bài CÁ NHÂN từ đề (thi_thu, on_thi_luyen — có hoc_sinh_id) cũng dính chỉ mục đó ⇒ em thứ 2 của cùng lớp
--   làm cùng đề trong cùng ngày bị unique_violation. fn_hs_thi_thu_bat_dau nuốt lỗi, trả bai_test_id = null ⇒
--   app (HocSinhApp: direct='on_thi_thi' && onThiBt) rơi qua mọi nhánh về màn chính. Luyện tập đề cương thì báo
--   'duplicate key'. Đã có chỉ mục riêng cho cá nhân: bai_test_thi_thu_uniq (nguon, hoc_sinh) cho thi_thu.
-- SỬA: uq_bai_test_doc chỉ áp bài KHÔNG cá nhân (hoc_sinh_id is null) — bài lớp giữ nguyên ràng buộc;
--   handler thi thử không còn trả null. (Luyện tập đề cương: em luyện lại đề ở ngày khác vốn hợp lệ ⇒ KHÔNG thêm chỉ mục riêng.)
-- MẤT GÌ (Luật xoá): drop index uq_bai_test_doc rồi tạo lại CÙNG cột nhưng chỉ áp bài lớp (hoc_sinh_id is null). Không mất dòng dữ liệu nào;
--   bài lớp (et/btvn/giao_trinh, đều hoc_sinh_id null) vẫn bị chặn trùng y như cũ.
-- ============================================================================

drop index if exists public.uq_bai_test_doc;
create unique index uq_bai_test_doc on public.bai_test (nguon_tai_lieu_id, lop_id, ngay, loai)
  where nguon_tai_lieu_id is not null and hoc_sinh_id is null;

CREATE OR REPLACE FUNCTION public.fn_hs_thi_thu_bat_dau(p_de uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_lop uuid; v_bt uuid; r record; n int := 0; v_tl int := 0; v_bo int := 0; v_phut int;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi, t.cau_hinh into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') <> 'de_cuong'
     and public._de_thi_ky(t.cau_hinh, t.ten) = any (public._hs_on_thi_ky_mo());
  if tl.id is null then raise exception 'Đề thi này chưa mở cho em.'; end if;
  if public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then raise exception 'Đề thi này không thuộc khối của em.'; end if;
  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  if v_bt is not null then return jsonb_build_object('bai_test_id', v_bt, 'lai', true); end if;
  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề đang được thầy cô chỉnh sửa — em quay lại sau nhé.';
  end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, tl.mon);
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', tl.mon; end if;
  v_phut := coalesce(nullif(tl.cau_hinh -> 'deThi' ->> 'thoiGianPhut', '')::int, 90);
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, deadline, khoa_reveal, thoi_gian_phut, so_cau)
  values (p_de, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'thi_thu', tl.mon, null, false, v_phut, 0)
  returning id into v_bt;
  for r in select * from public.fn_de_thi_cau(p_de) where not xoa order by stt loop
    if r.loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan') then
      n := n + 1;
      if r.loai_cau = 'tu_luan' then v_tl := v_tl + 1; end if;
      perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', public._kho_lt_dang_tbl(r.kho), r.ma_cau, n, null);
      update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
       where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
      if r.loai_cau = 'tra_loi_ngan' then
        update bai_test_cau set loai_cau = 'tra_loi_ngan', lua_chon = null, lua_chon_rule = null,
               form_tn_id = null, form_tn_hgt_id = null, dap_an_key = to_jsonb(btrim(r.dap_an))
         where bai_test_id = v_bt and thu_tu = n and bien_the = 1 and loai_cau <> 'tra_loi_ngan';
      end if;
    else
      v_bo := v_bo + 1;   -- loại máy chưa hỗ trợ (vd kéo thả) — bỏ khỏi lượt thi
    end if;
  end loop;
  if n = 0 then raise exception 'Đề này chưa có câu nào thi được trên app.'; end if;
  update bai_test set so_cau = n where id = v_bt;
  update bai_test_cau set kieu_nhap = 'phieu_4o'
   where bai_test_id = v_bt and loai_cau = 'tra_loi_ngan' and public._de_thi_hop_le_4o(btrim(dap_an_key #>> '{}'));
  update bai_test_cau set ma_dang = null where bai_test_id = v_bt and public._kho_la_dang_cho(ma_dang);
  return jsonb_build_object('bai_test_id', v_bt, 'lai', false, 'so_cau', n, 'so_tu_luan', v_tl, 'so_bo_qua', v_bo);
exception when unique_violation then
  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  -- KHÔNG trả null: trước 24/10 trùng khoá của em KHÁC cùng lớp/ngày ⇒ v_bt null ⇒ app rơi về màn chính không báo lỗi.
  if v_bt is null then raise exception 'Không mở được bài thi lúc này — em thử lại, nếu vẫn lỗi báo thầy cô nhé.'; end if;
  return jsonb_build_object('bai_test_id', v_bt, 'lai', true);
end $function$
;
