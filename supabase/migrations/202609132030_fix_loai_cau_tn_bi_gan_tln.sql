-- ============================================================================
-- 202609132030 — Fix DATA BUG: câu có 4 phương án nhưng loai_cau='tra_loi_ngan' (Thùy 13/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy phản ánh giáo trình K12 publish có câu render "Nhập đáp án" thay vì 4 nút A/B/C/D.
--   Query DB: kho hgt_cau_hoi có nhiều câu:
--     · loai_cau = 'tra_loi_ngan'   (SAI)
--     · lua_chon = jsonb array 4 phương án   (đúng dạng TN)
--     · dap_an = 'A'/'B'/'C'/'D'   (đúng dạng TN)
--   Kho BUILDER render dựa vào lua_chon → hiện đủ 4 nút (đúng ý người soạn). Nhưng _kho_snapshot_cau
--   lấy loai_cau THÔ từ kho → INSERT bai_test_cau với loai_cau='tra_loi_ngan' → app HS render input.
--   Bug NHẬP KHO — lúc INSERT quên set loai_cau='trac_nghiem'.
--
-- FIX: (1) BACKFILL hgt_cau_hoi/dai_cau_hoi/khtn_cau_hoi — chuẩn hoá câu có dạng TN nhưng bị gán TLN.
--      (2) BACKFILL bai_test_cau đã publish trước migration này — HS không phải chờ GV publish lại.
--
-- ĐIỀU KIỆN NHẬN DIỆN "câu này là TN thật":
--   loai_cau = 'tra_loi_ngan' AND lua_chon IS NOT NULL AND jsonb_typeof(lua_chon)='array'
--   AND jsonb_array_length(lua_chon) >= 2 AND dap_an ~ '^[A-Fa-f]$'   ← đáp án là 1 chữ ABCDEF
--
-- MẤT GÌ: dữ liệu không mất, chỉ sửa loai_cau. Bản in giấy cũng có thể bị ảnh hưởng (câu này lâu nay
--   in ra với loai_cau TLN — nhưng builder hiện lua_chon nên bản in vẫn đúng 4 nút).
-- ============================================================================

-- (1) Kho — 3 bảng câu
update hgt_cau_hoi set loai_cau = 'trac_nghiem'
where loai_cau = 'tra_loi_ngan' and lua_chon is not null and jsonb_typeof(lua_chon) = 'array'
  and jsonb_array_length(lua_chon) >= 2 and dap_an ~ '^[A-Fa-f]$';

update dai_cau_hoi set loai_cau = 'trac_nghiem'
where loai_cau = 'tra_loi_ngan' and lua_chon is not null and jsonb_typeof(lua_chon) = 'array'
  and jsonb_array_length(lua_chon) >= 2 and dap_an ~ '^[A-Fa-f]$';

update khtn_cau_hoi set loai_cau = 'trac_nghiem'
where loai_cau = 'tra_loi_ngan' and lua_chon is not null and jsonb_typeof(lua_chon) = 'array'
  and jsonb_array_length(lua_chon) >= 2 and dap_an ~ '^[A-Fa-f]$';

-- (2) BACKFILL bai_test_cau đã snapshot trước đó (giáo trình/ET/BTVN/đề thi/tự luyện đều dùng chung)
update bai_test_cau set loai_cau = 'trac_nghiem'
where loai_cau = 'tra_loi_ngan'
  and lua_chon is not null and jsonb_typeof(lua_chon) = 'array' and jsonb_array_length(lua_chon) >= 2
  and jsonb_typeof(dap_an_key) = 'string' and (dap_an_key #>> '{}') ~ '^[A-Fa-f]$';
