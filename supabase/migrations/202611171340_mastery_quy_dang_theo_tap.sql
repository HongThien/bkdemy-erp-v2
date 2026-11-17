-- ============================================================================
-- 202611171340 — mastery_quy_dang_theo_tap
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 "Sửa đi" (sau khi mổ fn_tong_quan_hs — hàm người dùng gọi duy nhất còn > 1 s trên máy mới: tb 1,37 s × 66 lượt).
--   95 % thời gian nằm ở NGUỒN LẦN ĐO CHUNG `_mastery_luot_do_quy`, bước `cap`: gọi `_do_o_quy(…)` cho TỪNG cặp (câu, mã dạng chép)
--   — mỗi cặp ~1 ms vì đi qua chuỗi 5 hàm (`_btyeu_la_hinh_mh` → `_khtn_la_lan_do` → `_vatly_la_lan_do` → `_hoahoc_la_lan_do` → `_do_o_bdm`).
--   Một em có 800–1.200 cặp ⇒ 0,6–0,8 s. Hàm này dùng chung cho `_mastery_lan_d` / `_mastery_lan_do` / `_mastery_mon_d` (làm mới mastery nền)
--   và `fn_tong_quan_hs` (Report phụ huynh, thẻ báo cáo, vinh danh, màn kết quả HS). Đúng mẫu K8 / §12 mục 9: hàm chạy trên từng dòng của tập lớn.
--
--   Sửa: quy THEO TẬP cho "đường thường", phần còn lại vẫn qua hàm cũ (không đổi `_do_o_quy`, không đổi chữ ký):
--     cặp đi đường nhanh ⇔ p_bdm · có mã câu · câu có trong `dai_cau_hoi` · mã chép KHÔNG phải bài mô hình Hình (`hinh_baitoan`) ·
--       câu KHÔNG có trong `khtn_cau_hoi` / `vatly_cau_hoi` / `hoahoc_cau_hoi` · khối không giữ bản đồ cũ (`_bdm_khoi_giu_cu`) ·
--       (đã có dạng bài HOẶC câu chưa xoá)   ⇒ nhóm = `bdm_cau_dang.dang_bai_id` (đúng nhánh `return r.dang_bai_id` của `_do_o_bdm`).
--     Mọi cặp khác (câu đã xoá chưa quy, câu KHTN / Lý / Hoá, HGT, không mã câu, bài mô hình, p_bdm tắt) ⇒ `_do_o_quy` như cũ.
--   Vì sao tương đương: với cặp đi đường nhanh, `_do_o_quy` lần lượt trả: không phải bài mô hình → ba hàm `_*_la_lan_do` đều false
--     (câu ở kho Đại và không ở kho môn kia) → `_do_o_bdm` tìm thấy câu, khối không giữ cũ, và điều kiện `dang_bai_id is not null or not da_xoa`
--     đúng ⇒ trả `dang_bai_id`. `bdm_cau_dang` là view trên `kho_cau_dang` (khoá chính (kho, ma_cau)) ⇒ mỗi cặp đúng một dòng.
--   RLS: 7 bảng đường nhanh đọc đều cùng MỘT policy `la_thanh_vien()` ⇒ người gọi hoặc thấy hết (nhân sự, hàm definer, cron) hoặc không thấy gì
--     (học sinh gọi qua đường invoker ⇒ đường nhanh rỗng ⇒ mọi cặp rơi về hàm cũ, y như trước). ĐỔI policy của một trong 7 bảng này thì phải xem lại đây.
--   Đo thử (chỉ đọc, 3 HS, 16/11): bước quy 636–775 ms → 15–270 ms; lệch 0 / 2.309 cặp. Phép so đầy đủ (mọi cặp của cả hệ + mẫu HS) ghi ở DEVLOG trước khi áp.
--   File viết 16/11 (tên cũ 202611161722, chưa từng áp); 17/11 dựng lại trên thân hàm MỚI sau mig 202611171010 / 171244 (luật "chỉ bài test mới tính") — hai mốc thay vẫn khớp đúng một lần, chỉ đổi khoá md5.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì. Sửa thân MỘT hàm (thay chuỗi khớp đúng một lần, khoá md5 thân cũ); kết quả trả về không đổi.
-- ============================================================================
do $$
declare v_def text; v_src text;
  c1 constant text := E'  cap as materialized (   -- 24/10: KHÔNG để Postgres inline — inline thì quy dạng chạy lại cho TỪNG lượt đo';
  c2 constant text := E'    select d.kc, d.kd, public._do_o_quy(p_bdm, p_khtn_bdm, d.kc, d.kd) as nhom\n    from (select distinct coalesce(ma_cau, '''') as kc, coalesce(ma_dang, '''') as kd from mf) d';
  m1 constant text :=
       E'  cap_d as materialized (select distinct coalesce(ma_cau, '''') as kc, coalesce(ma_dang, '''') as kd from mf),\n'
    || E'  -- 16/11 (mig 202611171340): ĐƯỜNG NHANH theo tập — câu còn ở kho Đại, không phải câu KHTN / Lý / Hoá, mã chép không phải bài mô hình Hình:\n'
    || E'  -- nhóm = dạng bài trong bảng tra (đúng nhánh `return r.dang_bai_id` của _do_o_bdm). Cặp nào không đủ điều kiện thì vẫn qua _do_o_quy ở dưới.\n'
    || E'  -- 7 bảng đọc ở đây cùng một policy la_thanh_vien(): người gọi thấy hết hoặc không thấy gì (khi đó đường nhanh rỗng, mọi cặp về hàm cũ).\n'
    || E'  cap_n as materialized (\n'
    || E'    select d.kc, d.kd, cd.dang_bai_id as nhom\n'
    || E'      from cap_d d\n'
    || E'      join dai_cau_hoi c on c.ma_cau = d.kc\n'
    || E'      left join dai_ban_do b on b.ma_dang = c.dang_chinh\n'
    || E'      left join bdm_cau_dang cd on cd.kho = ''dai'' and cd.ma_cau = c.ma_cau\n'
    || E'     where p_bdm and d.kc <> ''''\n'
    || E'       and not exists (select 1 from hinh_baitoan hb where hb.ma = d.kd)\n'
    || E'       and not exists (select 1 from khtn_cau_hoi k1 where k1.ma_cau = d.kc)\n'
    || E'       and not exists (select 1 from vatly_cau_hoi k2 where k2.ma_cau = d.kc)\n'
    || E'       and not exists (select 1 from hoahoc_cau_hoi k3 where k3.ma_cau = d.kc)\n'
    || E'       and not public._bdm_khoi_giu_cu(b.khoi)\n'
    || E'       and (cd.dang_bai_id is not null or c.xoa_at is null)\n'
    || E'  ),\n';
  m2 constant text :=
       E'    select n.kc, n.kd, n.nhom from cap_n n\n'
    || E'    union all\n'
    || E'    select d.kc, d.kd, public._do_o_quy(p_bdm, p_khtn_bdm, d.kc, d.kd) as nhom\n'
    || E'    from cap_d d where not exists (select 1 from cap_n n2 where n2.kc = d.kc and n2.kd = d.kd)';
begin
  select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p
   where p.oid = 'public._mastery_luot_do_quy(boolean,boolean,uuid[],boolean,timestamptz,timestamptz)'::regprocedure;
  if md5(v_src) <> 'a0cfd8b77c560ddb1a914f3e09964dc6' then raise exception '_mastery_luot_do_quy đã khác bản lúc viết migration (17/11 13:40) — đọc lại trước khi áp.'; end if;
  if (length(v_def) - length(replace(v_def, c1, ''))) / length(c1) <> 1 then raise exception '_mastery_luot_do_quy: mốc 1 không khớp đúng một lần.'; end if;
  if (length(v_def) - length(replace(v_def, c2, ''))) / length(c2) <> 1 then raise exception '_mastery_luot_do_quy: mốc 2 không khớp đúng một lần.'; end if;
  v_def := replace(v_def, c2, m2);
  v_def := replace(v_def, c1, m1 || c1);
  execute v_def;
end $$;
