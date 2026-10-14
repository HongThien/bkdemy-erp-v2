-- ============================================================================
-- 202610141237 — hinh_luyen_gan_bai_mo_hinh
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "chưa thấy nút nào để gán mô hình cho bài cần duyệt". Màn Duyệt kho chỉ cho gán Ý → BÀI của mô hình;
--   mô hình vừa tạo chưa có bài (MH.072, MH.073 khối 8: 0 bài) thì không có gì để chọn ⇒ trông như "không có nút".
--   Thêm tầng gán BÀI KHO → MÔ HÌNH (hinh_bai.mo_hinh_id — cột có sẵn, spec-hinh-luyen §2 "nhãn mô hình"), làm được
--   NGAY cả khi mô hình chưa có bài; gán ý → bài mô hình vẫn như cũ (lọc theo mô hình đã gán).
--   Hàng đợi trả thêm mo_hinh_id để màn hiện mô hình đã gán.
--
-- MẤT GÌ: không. fn_hl_kho_chua_phan: thân lấy từ bản ĐANG CHẠY (pg_get_functiondef), chỉ thêm khoá 'mo_hinh_id'.
-- ============================================================================
create or replace function fn_hl_kho_chua_phan(p_khoi text, p_gioi_han integer default 30, p_bo_qua integer default 0)
returns jsonb language sql stable set search_path to 'public' as $function$
  with b as (
    select hb.* from hinh_bai hb
     where (p_khoi is null or hb.khoi = p_khoi)
       and exists (select 1 from hinh_y y where y.bai_id = hb.id and y.baitoan_id is null)
     order by hb.created_at, hb.ma_bai
     limit greatest(1, least(coalesce(p_gioi_han, 30), 200)) offset greatest(0, coalesce(p_bo_qua, 0))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'ma_bai', b.ma_bai, 'khoi', b.khoi, 'nguon', b.nguon, 'nguon_ma_cau', b.nguon_ma_cau,
    'de_bai', b.de_bai, 'gia_thiet_chung', b.gia_thiet_chung, 'huong_dan', b.huong_dan, 'anh_de', b.anh_de,
    'can_tach_tay', b.can_tach_tay, 'mo_hinh_id', b.mo_hinh_id,
    'y', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', y.id, 'ma_y', y.ma_y, 'thu_tu', y.thu_tu, 'nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung,
            'gia_thiet_them', y.gia_thiet_them, 'dap_an', y.dap_an, 'loi_giai', y.loi_giai, 'anh_loi_giai', y.anh_loi_giai,
            'anh_de', y.anh_de, 'da_duyet', y.da_duyet, 'baitoan_id', y.baitoan_id) order by y.thu_tu), '[]'::jsonb)
            from hinh_y y where y.bai_id = b.id)
  ) order by b.created_at, b.ma_bai), '[]'::jsonb) from b
$function$;

-- mô hình LUYỆN (gốc cây) của một khối, kèm số bài cả cây — danh sách để gán bài kho
create or replace function fn_hl_mo_hinh_luyen(p_khoi text)
returns table(id uuid, ma text, ten text, chu_de_id text, so_bai bigint)
language sql stable set search_path = public as $$
  select g.id, g.ma, g.ten, g.chu_de_id,
         (select count(*) from fn_hl_so_hien_thi(g.id))
    from hinh_mo_hinh g
   where g.phan = 'luyen' and g.neo_baitoan_id is null and (p_khoi is null or g.khoi = p_khoi)
   order by g.ma
$$;

-- GÁN BÀI KHO → MÔ HÌNH (p_mo_hinh = NULL để gỡ). Chỉ nhận mô hình LUYỆN gốc cây.
create or replace function fn_hl_gan_bai_mo_hinh(p_bai uuid, p_mo_hinh uuid)
returns void language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài kho không tồn tại'; end if;
  if p_mo_hinh is not null and not exists (
       select 1 from hinh_mo_hinh where id = p_mo_hinh and phan = 'luyen' and neo_baitoan_id is null) then
    raise exception 'Chỉ gán được vào mô hình LUYỆN (mô hình gốc, không phải nhánh)';
  end if;
  update hinh_bai set mo_hinh_id = p_mo_hinh, updated_at = now() where id = p_bai;
end $$;

revoke execute on function fn_hl_mo_hinh_luyen(text), fn_hl_gan_bai_mo_hinh(uuid, uuid) from public, anon;
grant execute on function fn_hl_mo_hinh_luyen(text), fn_hl_gan_bai_mo_hinh(uuid, uuid) to authenticated;
