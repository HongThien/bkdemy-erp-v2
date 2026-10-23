-- ============================================================================
-- 202610231525 — mastery_bdm_kho_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Mastery K6–12 sang bản đồ mới (PLAN-mastery-ban-do-moi.md). Sau khi bật công tắc, ô yếu / dạng tự luyện mang mã dạng bài
--   'NDB…' ⇒ các luồng CHỌN CÂU theo dạng (bổ trợ yếu `_btyeu_chon_cau`, tự luyện, in phiếu, snapshot câu vào bài test) phải
--   lấy được câu của 1 dạng bài mới. Các luồng đó chạy SQL ĐỘNG `select … from <bảng câu của nhánh> c where c.dang_chinh = $dạng`,
--   suy bảng phụ bằng QUY ƯỚC TÊN (`_cau_hoi` → `_ban_do` · `_cau_form_tn` · `_cau_menh_de` · `_cum_bai` · lý thuyết qua _kho_lt_tbl).
--   ⇒ Nhánh 'bdm' = bộ VIEW cùng quy ước tên: `bdm_cau_hoi` (câu Đại + HGT, dang_chinh = dạng bài mới) · `bdm_cau_form_tn` ·
--   `bdm_cau_menh_de` · `bdm_cum_bai` · `bdm_dang_ly_thuyet`. Mọi SQL động có sẵn chạy NGUYÊN cho mã NDB, không viết lại từng hàm.
--   Quy câu → dạng bài mới = MỘT nguồn: view `bdm_cau_dang` (thứ tự như builder `_bdm_cau_giai`: gán câu → gán câu gốc → gán cụm cũ →
--   dạng cũ gắn đúng 1 dạng bài → AI đề xuất; HGT: gán → đề xuất). `_do_o_bdm` (mig 202610231446) đọc lại từ view này — bỏ bản
--   plpgsql chép tay (công thức 1 nơi — CLAUDE.md §2.0).
--   Câu kho trên lớp (dai_cau_lop) KHÔNG vào (không đo, không luyện). Câu cấp 1 không có dạng bài mới ⇒ tự rơi ra.
--   Đã biết, chấp nhận (Thùy "sai sót đoạn này chấp nhận được"): snapshot câu qua view không ghi form_tn_id / form_tn_hgt_id
--   (hàm snapshot suy cột theo tên bảng form) — đáp án + phương án vẫn chụp đủ, chấm không ảnh hưởng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm view; _do_o_bdm thay THÂN (cùng kết quả, đọc từ view); thêm nhánh 'bdm' vào _kho_cau_tbl / _kho_lt_tbl.
-- ============================================================================

-- ── 1. MỘT nguồn: câu → dạng bài mới ──
create or replace view bdm_cau_dang as
  with mot as (   -- dạng cũ gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài
    select d.ma_dang_cu, min(d.dich_dang_bai) as db
      from dai_bdm_doi_ung d group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_dang_bai) = 1
  )
  select q.ma_cau, 'dai'::text as kho,
         coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db, dx.dang_bai_id) as dang_bai_id,
         case when gc.ma_cau is not null or gg.ma_cau is not null then 'gan_cau'
              when cu.ma_cum_cu is not null then 'gan_cum'
              when mot.db is not null then 'doi_ung'
              when dx.ma_cau is not null then 'de_xuat' end as nguon
    from dai_cau_hoi q
    left join dai_cau_hoi g on g.ma_cau = q.parent_ma_cau
    left join dai_bdm_gan_cau gc on gc.ma_cau = q.ma_cau
    left join dai_bdm_gan_cau gg on gg.ma_cau = q.parent_ma_cau
    left join dai_bdm_doi_ung_cum cu on cu.ma_cum_cu = coalesce(q.ma_cum, g.ma_cum)
    left join mot on mot.ma_dang_cu = q.dang_chinh
    left join dai_bdm_de_xuat dx on dx.ma_cau = q.ma_cau
   where coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db, dx.dang_bai_id) is not null
  union all
  select h.ma_cau, 'hgt', coalesce(gc.dang_bai_id, dx.dang_bai_id),
         case when gc.ma_cau is not null then 'gan_cau' else 'de_xuat' end
    from hgt_cau_hoi h
    left join hgt_bdm_gan_cau gc on gc.ma_cau = h.ma_cau
    left join hgt_bdm_de_xuat dx on dx.ma_cau = h.ma_cau
   where coalesce(gc.dang_bai_id, dx.dang_bai_id) is not null;
grant select on bdm_cau_dang to authenticated;

-- _do_o_bdm: cùng kết quả, đọc từ view (cấp 1 / Hình / KHTN / mã chép giữ nguyên logic)
create or replace function _do_o_bdm(p_ma_cau text, p_ma_dang_chep text) returns text
language plpgsql stable security definer set search_path to 'public' as $$
declare v text; v_khoi text; v_kho text;
begin
  if p_ma_cau is not null then
    select 'dai', b.khoi into v_kho, v_khoi from dai_cau_hoi c left join dai_ban_do b on b.ma_dang = c.dang_chinh where c.ma_cau = p_ma_cau;
    if v_kho is null and exists (select 1 from hgt_cau_hoi h where h.ma_cau = p_ma_cau) then v_kho := 'hgt'; end if;
    if v_kho is not null then
      if v_khoi in ('3', '4', '4T', '5', '5T') then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      select d.dang_bai_id into v from bdm_cau_dang d where d.ma_cau = p_ma_cau;
      return v;
    end if;
  end if;
  -- lượt đo không có mã câu, hoặc câu không (còn) ở kho Đại/HGT: theo mã dạng chép lúc đo — quy về dạng cũ CÒN SỐNG trước.
  v := _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep);
  select b.khoi into v_khoi from dai_ban_do b where b.ma_dang = v;
  if v_khoi is null or v_khoi in ('3', '4', '4T', '5', '5T') then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $$;

-- ── 2. Bộ view kho câu nhánh 'bdm' (cùng quy ước tên) ──
create or replace view bdm_cau_hoi as
  select q.ma_cau, d.dang_bai_id as dang_chinh, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.anh_dap_an,
         q.nguon, q.nguon_giai, q.parent_ma_cau, q.clone_method, q.created_at, q.xoa_at, q.ma_cum, q.da_duyet, q.duyet_boi, q.duyet_at,
         q.giai_method, q.loi_giai_ai, q.dap_an_ai, q.ai_model, q.ai_de_xuat_at, q.kiem_may, q.kiem_may_at, q.kiem_may_boi, q.kiem_may_ghi,
         q.duyet_nguon, q.dang_ai_de_xuat, q.kiem_may_lo, q.kho_chuan, q.ten_de_goc, 'dai'::text as kho_goc
    from bdm_cau_dang d join dai_cau_hoi q on q.ma_cau = d.ma_cau where d.kho = 'dai'
  union all
  select q.ma_cau, d.dang_bai_id, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.anh_dap_an,
         q.nguon, q.nguon_giai, q.parent_ma_cau, q.clone_method, q.created_at, q.xoa_at, q.ma_cum, q.da_duyet, q.duyet_boi, q.duyet_at,
         q.giai_method, q.loi_giai_ai, q.dap_an_ai, q.ai_model, q.ai_de_xuat_at, q.kiem_may, q.kiem_may_at, q.kiem_may_boi, q.kiem_may_ghi,
         q.duyet_nguon, q.dang_ai_de_xuat, q.kiem_may_lo, q.kho_chuan, q.ten_de_goc, 'hgt'
    from bdm_cau_dang d join hgt_cau_hoi q on q.ma_cau = d.ma_cau where d.kho = 'hgt';
grant select on bdm_cau_hoi to authenticated;

create or replace view bdm_cau_form_tn as
  select id, ma_cau, lua_chon, dap_an, key_gia_tri, nguon, ai_model, sinh_at, da_duyet, duyet_boi, duyet_at, sua_truoc_duyet,
         tu_choi_ly_do, tu_choi_boi, xoa_at, updated_at from dai_cau_form_tn
  union all
  select id, ma_cau, lua_chon, dap_an, key_gia_tri, nguon, ai_model, sinh_at, da_duyet, duyet_boi, duyet_at, sua_truoc_duyet,
         tu_choi_ly_do, tu_choi_boi, xoa_at, updated_at from hgt_cau_form_tn;
grant select on bdm_cau_form_tn to authenticated;

create or replace view bdm_cau_menh_de as
  select * from dai_cau_menh_de union all select * from hgt_cau_menh_de;
grant select on bdm_cau_menh_de to authenticated;

create or replace view bdm_cum_bai as select * from dai_cum_bai;   -- cụm cũ (HGT không có bảng cụm)
grant select on bdm_cum_bai to authenticated;

-- lý thuyết dạng bài mới (khuôn dai_dang_ly_thuyet)
create or replace view bdm_dang_ly_thuyet as
  select db.id as ma_dang, db.ly_thuyet_file_url as file_url, db.ly_thuyet_ten_file as ten_file, db.updated_at as cap_nhat_at, db.ly_thuyet as noi_dung
    from dai_bdm_dang_bai db;
grant select on bdm_dang_ly_thuyet to authenticated;

-- ── 3. Registry ──
create or replace function public._kho_cau_tbl(p_mon text, p_nhanh text default null) returns text
language sql immutable as $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_mon = 'Tiếng Anh' then 'anh_cau_hoi'
              when p_mon = 'TSA' then 'tsa_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_hoi'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_cau_hoi'
              when p_nhanh = 'bdm' then 'bdm_cau_hoi'
              else 'dai_cau_hoi' end
$function$;

create or replace function public._kho_lt_tbl(p_mon text, p_nhanh text default null) returns text
language sql immutable as $function$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_mon = 'Tiếng Anh' then 'anh_dang_ly_thuyet'
              when p_mon = 'TSA' then 'tsa_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai_ly_thuyet'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_dang_ly_thuyet'
              when p_nhanh = 'bdm' then 'bdm_dang_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$function$;
