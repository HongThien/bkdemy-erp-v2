-- ============================================================================
-- 202610151915 — so_do_ta_khoi_67_8
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 15/10: "Đổi lại cấu trúc phân công tổ chức: Hà Giang trưởng khối 6 7 · Cường khối 8 · Hải vẫn khối 9."
--   Sơ đồ team Trợ giảng (nguồn duy nhất của Trưởng/Phó khối — mig 202610151151):
--   · Ô "Trưởng khối 6" (Hà Giang) ⇒ "Trưởng khối 6 7", khoi_quan_ly {6,7}.
--   · Mọi ô con của "Trưởng khối 7" (Phó khối 7 Quỳnh Trang + TA khối 7) ⇒ dưới "Trưởng khối 6 7"; riêng ô TA của chính
--     Hà Giang (không thể nằm dưới chính mình) ⇒ dưới Quản lý trợ giảng (như ô TA của Hải).
--   · Ô "Trưởng khối 8": người giữ Phạm Thị Thùy Trang ⇒ Tạ Quốc Cường; gắn vai trò "Trợ giảng" (chép từ ô Trưởng khối 7
--     Cường đang giữ) để Cường không mất quyền app khi rời ô cũ.
--   · Ô "Trưởng khối 7" cũ ⇒ BỎ TRỐNG (không người, không khối) — CHƯA XOÁ, chờ Thùy gật (Luật xoá).
--   Hệ quả: Chấm MT + bot tag khối 7 ⇒ Trưởng Hà Giang (Chấm MT vẫn ưu tiên Phó khối 7 Quỳnh Trang); khối 8 ⇒ Phó Thảo
--   Nguyên (MT) · Trưởng Cường (bot).
-- MẤT GÌ (Luật xoá): không xoá gì. Thùy Trang thôi giữ ô Trưởng khối 8 (vẫn là Quản lý trợ giảng + các ô khác).
-- ============================================================================

do $$
declare v_t6 uuid := '1a4b167d-ddeb-4360-8243-1e3f032d2c97';
        v_t7 uuid := '292481ff-34ce-4f92-93f4-aa85a7914744';
        v_t8 uuid := '0989bb7e-ffe1-449f-8403-987617264730';
        v_giang uuid := '1fbe3d7f-986c-4cac-8e5f-cd5af9ff823b';
        v_cuong uuid := '240555bd-35fb-4aaa-8a3a-084bf7088f52';
        v_ql uuid; v_role uuid;
begin
  select v.id into v_ql from vi_tri v join team t on t.id = v.team_id and t.ma = 'ta' where v.ten = 'Quản lý trợ giảng';
  select vai_tro_id into v_role from vi_tri where id = v_t7;
  if v_ql is null then raise exception 'không thấy ô Quản lý trợ giảng'; end if;

  update vi_tri set ten = 'Trưởng khối 6 7', khoi_quan_ly = array['6', '7'] where id = v_t6 and nhan_su_id = v_giang;
  update vi_tri set cha_id = v_ql where cha_id = v_t7 and nhan_su_id = v_giang;          -- ô TA của chính Hà Giang
  update vi_tri set cha_id = v_t6 where cha_id = v_t7;                                    -- Phó khối 7 + TA khối 7
  update vi_tri set nhan_su_id = v_cuong, vai_tro_id = coalesce(vai_tro_id, v_role) where id = v_t8;
  update vi_tri set nhan_su_id = null, khoi_quan_ly = '{}' where id = v_t7 and nhan_su_id = v_cuong;
end $$;
