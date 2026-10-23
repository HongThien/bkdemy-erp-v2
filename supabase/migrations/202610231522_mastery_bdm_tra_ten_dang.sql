-- ============================================================================
-- 202610231522 — mastery_bdm_tra_ten_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Mastery K6–12 sang bản đồ mới (PLAN-mastery-ban-do-moi.md, mig 202610231446): khi bật công tắc, ô mastery mang mã DẠNG BÀI
--   MỚI ('NDB…'). Mọi chỗ tra tên / chuyên đề của 1 mã dạng đều đi qua REGISTRY nhánh (`_kho_nhanh_cua_dang` → `_kho_ban_do_tbl`)
--   rồi đọc cột ma_dang / ten_dang / ma_chuyen_de / ten_chuyen_de / muc_do / khoi của bảng bản đồ. Thêm nhánh 'bdm' + VIEW
--   `bdm_ban_do` CÙNG KHUÔN CỘT với dai_ban_do ⇒ 11+ hàm tra tên (bổ trợ, BTVN trả, đuổi, TA…) hiểu mã NDB mà không sửa từng hàm
--   (1 chỗ dispatch — CLAUDE.md §1.6). Chỉ chủ đề nhánh 'toan' + 'hgt' (Đại + Hình giải tích); Hình–Luyện/Học giữ đường riêng.
--   Ánh xạ 4 tầng → khuôn cũ: chủ đề → ma/ten_chu_de · chuyên đề → ma/ten_chuyen_de · dạng bài → ma/ten_dang; thêm cột nhóm,
--   thứ tự từng tầng, nhanh_bdm ('toan'|'hgt'). muc_do / xoa_at / gop_vao = NULL (bản đồ mới không có).
--   Một chuyên đề có thể dùng chung ở nhiều chủ đề, nhưng nhóm (và dạng bài trong nhóm) thuộc ĐÚNG 1 (chủ đề, chuyên đề) ⇒ view
--   ra đúng 1 dòng / dạng bài.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm view + thêm nhánh vào 4 hàm registry (nhánh cũ giữ nguyên thứ tự xét).
-- ============================================================================

create or replace view bdm_ban_do as
  select db.id                as ma_dang,
         cd.khoi              as khoi,
         cd.id                as ma_chu_de,
         cd.ten               as ten_chu_de,
         ch.id                as ma_chuyen_de,
         ch.ten               as ten_chuyen_de,
         db.ten               as ten_dang,
         null::smallint       as muc_do,
         db.created_at        as created_at,
         null::text           as bac_toi_thieu,
         db.mo_ta             as mo_ta_ngan,
         null::timestamptz    as xoa_at,
         null::text           as gop_vao,
         n.id                 as ma_nhom,
         n.ten                as ten_nhom,
         cd.thu_tu            as thu_tu_chu_de,
         o.thu_tu             as thu_tu_chuyen_de,
         n.thu_tu             as thu_tu_nhom,
         db.thu_tu            as thu_tu_dang,
         cd.nhanh             as nhanh_bdm
    from dai_bdm_dang_bai db
    join dai_bdm_nhom n on n.id = db.nhom_id
    join dai_bdm_chu_de cd on cd.id = n.chu_de_id
    left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
    left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
   where cd.nhanh in ('toan', 'hgt');
grant select on bdm_ban_do to authenticated;

-- ── Registry: mã 'NDB…' (Toán) ⇒ nhánh 'bdm' (xét TRƯỚC các nhánh cũ; mã cũ không bao giờ bắt đầu bằng NDB) ──
create or replace function public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text) returns text
language sql stable as $function$
  select case when p_mon = 'Toán' and p_ma_dang like 'NDB%' then 'bdm'
              when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_baitoan where ma = p_ma_dang) then 'hinh_mo_hinh' -- 14/10: bài mô hình = KP (ma_dang = hinh_baitoan.ma)
              else null end
$function$;

create or replace function public._kho_ban_do_tbl(p_mon text, p_nhanh text default null) returns text
language sql immutable as $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_mon = 'Tiếng Anh' then 'anh_ban_do'
              when p_mon = 'TSA' then 'tsa_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai'
              when p_nhanh = 'hinh_mo_hinh' then 'hmh_ban_do'
              when p_nhanh = 'bdm' then 'bdm_ban_do'
              else 'dai_ban_do' end
$function$;

-- Trợ lý: tra tên theo mã ở mọi bản đồ (thêm bản đồ mới)
create or replace function public._troly_ten_dang(p_ma text) returns jsonb
language plpgsql stable as $function$
declare r record; v text;
begin
  if p_ma is null then return null; end if;
  for r in select * from (values ('Toán', 'bdm'), ('Toán', null::text), ('Toán', 'hinh_gt'), ('Toán', 'hinh_hoc'), ('KHTN', null)) t(mon, nhanh) loop
    execute format('select ten_dang from %I where ma_dang = $1 limit 1', public._kho_ban_do_tbl(r.mon, r.nhanh))
      into v using p_ma;
    if v is not null then return jsonb_build_object('mon', r.mon, 'ten', v); end if;
  end loop;
  return null;
end $function$;
