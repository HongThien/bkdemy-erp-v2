-- ============================================================================
-- 202611091902 — hh_kho_an_cau_da_tach_y
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 09/11 "Vụ tách ý cho kho bài tập của hình học lớp 7 và 8 chạy đi". Bài nhiều ý tách thành các ý (mig 202611091550);
--   câu cả bài cũ GIỮ NGUYÊN (tài liệu / điểm cũ trỏ vào) và rút khỏi chọn câu (kho_chuan=false). Popup 📚 kho (fn_hh_kho_cau) và
--   số câu trên cây (count_cau_by_bai_hh) đọc mọi câu chưa xoá ⇒ sẽ hiện/đếm TRÙNG bài cũ + các ý. Ẩn câu là ma_cau_goc của
--   một bài nhiều ý còn sống. Thân hàm giữ nguyên, chỉ thêm điều kiện đó.
-- MẤT GÌ (Luật xoá): Không. CREATE OR REPLACE 2 hàm, cùng chữ ký / quyền.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_hh_kho_cau(p_loai text, p_id text, p_loc text DEFAULT 'tat_ca'::text, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0)
 RETURNS TABLE(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text, bai_y text, nhan_y text, cau_hoi_y text, da_biet text, loi_dan text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_khoi text; v_cho text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_hh_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai not in ('dang_bai', 'dung_sai', 'de_xuat', 'chua_khop') then raise exception 'fn_hh_kho_cau: p_loai không hợp lệ %', p_loai; end if;

  if p_loai = 'dang_bai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'hinh_hoc'::text, b.ma_bai, b.ten_bai, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where c.dang_chinh = p_id and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by coalesce(c.bai_y, c.parent_ma_cau, c.ma_cau), c.nhan_y nulls first, c.parent_ma_cau is not null, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  select cd.khoi into v_khoi from dai_bdm_chu_de cd where cd.id = p_id;
  if v_khoi is null then return; end if;
  v_cho := 'HH' || v_khoi || '000000';

  if p_loai = 'dung_sai' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'dung_sai'::text, null::text, null::text, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
        from hinh_hoc_kho_ds k join hinh_hoc_cau_hoi c on c.ma_cau = k.ma_cau and c.xoa_at is null left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where k.chu_de_id = p_id
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  if p_loai = 'de_xuat' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'de_xuat:vua'::text, b.ma_bai, b.ten_bai, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
        from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_ai_de_xuat and b.chu_de_id = p_id left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
       where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by b.thu_tu, c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  -- chua_khop: còn ở bài chờ, chưa có đề xuất của chủ đề này, không phải Đ/S
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'chua_khop'::text, null::text, null::text, null::text, c.bai_y, c.nhan_y, c.cau_hoi_y, c.da_biet, hy.loi_dan
      from hinh_hoc_cau_hoi c left join hinh_hoc_bai_y hy on hy.ma_bai_y = c.bai_y
     where c.dang_chinh = v_cho and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
       and not exists (select 1 from hinh_hoc_bai b2 where b2.ma_bai = c.dang_ai_de_xuat and b2.chu_de_id = p_id)
       and not exists (select 1 from hinh_hoc_kho_ds k where k.ma_cau = c.ma_cau)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by c.ma_cau limit p_limit offset p_offset;
end $function$;

CREATE OR REPLACE FUNCTION public.count_cau_by_bai_hh(p_khoi text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  select coalesce(jsonb_object_agg(dang_chinh, n), '{}'::jsonb)
    into result
    from (
      select c.dang_chinh, count(*) n
        from hinh_hoc_cau_hoi c
        join hinh_hoc_bai b on b.ma_bai = c.dang_chinh
       where c.xoa_at is null and b.khoi = p_khoi
         and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)  -- câu cả bài đã tách ý: ẩn (thẻ các ý thay)
       group by c.dang_chinh
    ) t;
  return result;
end $function$;
