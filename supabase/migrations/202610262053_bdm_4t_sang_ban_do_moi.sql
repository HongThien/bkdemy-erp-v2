-- ============================================================================
-- 202610262053 — bdm_4t_sang_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10: "4T1 t làm bản đồ mới rồi mà… riêng 4T1 áp bản đồ mới". 4T1 là lớp Toán DUY NHẤT của khối 4T ⇒ bật theo khối 4T
--   (khối 3/4/5/5T vẫn giữ bản đồ cũ). Trước khi bật: Thùy thêm 5 dạng bài Tổng hiệu (NDB01623–27), 122 câu Tổng hiệu xếp vào
--   theo ngữ cảnh đề (scripts/_th4t_xep.mjs). Luật "khối nào giữ bản đồ cũ" trước nằm rải ở 3 hàm (registry nhánh, quy dạng
--   mastery, quy dạng dashboard) ⇒ gom về MỘT hàm _bdm_khoi_giu_cu. Danh sách CẤP 1 của luật đo (tự luyện luôn tính —
--   _mastery_lan_do, fn_tong_quan_hs, client CAP1_KHOI) là chính sách khác, KHÔNG đổi: 4T vẫn là cấp 1 về luật đo.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 1 hàm, thay thân 3 hàm (chỉ đổi danh sách khối).
-- ============================================================================

-- Khối nào còn GIỮ bản đồ cũ (mastery/registry nhánh/quy dạng) — MỘT nơi duy nhất. Bật thêm khối = bỏ khỏi danh sách.
create or replace function _bdm_khoi_giu_cu(p_khoi text) returns boolean
language sql immutable as $$ select coalesce(p_khoi, '') in ('3', '4', '5', '5T') $$;

CREATE OR REPLACE FUNCTION public._kho_ds_nhanh_khoi(p_mon text, p_khoi text)
 RETURNS text[]
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_mon = 'Toán' and public._mastery_bdm_bat() and coalesce(p_khoi, '') <> '' and not public._bdm_khoi_giu_cu(p_khoi)
              then array['bdm', 'hinh_hoc']
              else public._kho_ds_nhanh(p_mon) end
$function$;

CREATE OR REPLACE FUNCTION public._do_o_bdm(p_ma_cau text, p_ma_dang_chep text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select b.khoi, d.dang_bai_id, c.xoa_at is not null as da_xoa into r
      from dai_cau_hoi c
      left join dai_ban_do b on b.ma_dang = c.dang_chinh
      left join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if public._bdm_khoi_giu_cu(r.khoi) then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      -- câu ĐÃ XOÁ chưa quy được (không lên màn duyệt): mọi câu CÒN SỐNG cùng dạng cũ đã quy về ĐÚNG 1 dạng bài ⇒ theo dạng bài đó;
      -- anh em rải ≥2 dạng bài ⇒ NULL (không đoán — §1.5)
      -- Anh em = câu CÒN SỐNG cùng dạng cũ, đọc THẲNG bảng gán + đề xuất (index) — qua view bdm_cau_dang thì mỗi lần gọi tra lại
      -- view cho từng anh em (7A1: 1,5 s → 7 s). Bỏ qua anh em chỉ quy được qua câu gốc / cụm (hiếm, chấp nhận).
      select min(x.db) into v
        from dai_cau_hoi c
        join dai_cau_hoi s on s.dang_chinh = c.dang_chinh and s.xoa_at is null
        cross join lateral (select g.dang_bai_id as db from dai_bdm_gan_cau g where g.ma_cau = s.ma_cau
                            union all select dx.dang_bai_id from dai_bdm_de_xuat dx where dx.ma_cau = s.ma_cau) x
       where c.ma_cau = p_ma_cau
      having count(distinct x.db) = 1;
      return v;
    end if;
    select d.dang_bai_id into r
      from hgt_cau_hoi h left join bdm_cau_dang d on d.kho = 'hgt' and d.ma_cau = h.ma_cau
     where h.ma_cau = p_ma_cau;
    if found then return r.dang_bai_id; end if;
  end if;
  -- lượt đo không có mã câu, hoặc câu không (còn) ở kho Đại/HGT: theo mã dạng chép lúc đo — quy về dạng cũ CÒN SỐNG trước.
  v := _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep);
  select b.khoi into v_khoi from dai_ban_do b where b.ma_dang = v;
  if v_khoi is null or public._bdm_khoi_giu_cu(v_khoi) then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $function$;

CREATE OR REPLACE FUNCTION public._do_o_bdm_core(p_ma_cau text, p_ma_dang_chep text, p_cap1_cu boolean)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select b.khoi, d.dang_bai_id into r
      from dai_cau_hoi c
      left join dai_ban_do b on b.ma_dang = c.dang_chinh
      left join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if p_cap1_cu and public._bdm_khoi_giu_cu(r.khoi) then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      return r.dang_bai_id;
    end if;
    select d.dang_bai_id into r
      from hgt_cau_hoi h left join bdm_cau_dang d on d.kho = 'hgt' and d.ma_cau = h.ma_cau
     where h.ma_cau = p_ma_cau;
    if found then return r.dang_bai_id; end if;
  end if;
  -- lượt đo không có mã câu, hoặc câu không (còn) ở kho Đại/HGT: theo mã dạng chép lúc đo — quy về dạng cũ CÒN SỐNG trước.
  v := _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep);
  select b.khoi into v_khoi from dai_ban_do b where b.ma_dang = v;
  if v_khoi is null or (p_cap1_cu and public._bdm_khoi_giu_cu(v_khoi)) then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $function$;
