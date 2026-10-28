-- ============================================================================
-- 202610261856 — kho_cong_cu_gan_dang_bai
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 "chuyển hẳn sang bản đồ và kho mới". Với khối chạy bản đồ mới (Toán K6–12, theo _kho_ds_nhanh_khoi),
--   DẠNG của câu = GÁN dạng bài (*_bdm_gan_cau); dang_chinh (dạng cũ) chỉ còn là lưu trữ. Các công cụ kho người dùng
--   (Duyệt kho › câu, Nhập kho) vẫn ghi dang_chinh ⇒ đổi sang ghi GÁN (nguon 'nguoi'):
--   (1) _bdm_nguoi_gan_cau / fn_bdm_nguoi_gan_cau — MỘT chỗ ghi "người chọn dạng bài cho 1 câu" (kiểm câu, khối, nhánh, Đ/S).
--   (2) fn_kho_duyet_cau nhận p_sua.dang_bai ⇒ gán + ký trong CÙNG transaction.
--   (3) "Chưa phân dạng" ở khối bản đồ mới = dạng chờ VÀ CHƯA GÁN dạng bài (câu chờ đã gán = đã phân dạng):
--       trigger chặn duyệt, bộ lọc hàng duyệt (_kho_loc_duyet_sql 2 tham số) + đếm badge dùng chung luật này.
--       Câu có dạng cũ thật mà chưa gán dạng bài: GIỮ như cũ (không tính "chưa phân dạng") — điểm chờ Thùy quyết.
--   (4) Hàng duyệt trả dạng bài cho cả HGT, kèm đề xuất (bdm_trang_thai 'de_xuat') và gán theo câu gốc.
--   (5) fn_bdm_nhap_cau — Nhập kho khối bản đồ mới: câu vào dạng chờ của khối (mã câu = mã chờ + STT, cấp ở DB có khoá),
--       người chọn dạng bài ⇒ gán 'nguoi'; câu Đ/S ⇒ kho Đ/S của chủ đề (không gán dạng bài, luật 18/10).
--   Cấp 1 (3/4/4T/5/5T) và khi công tắc tắt: y hệt cũ (mọi nhánh mới đều chặn bằng _kho_ds_nhanh_khoi).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ create/replace hàm (trả cùng kiểu cũ), không đụng dữ liệu, không xoá đề xuất nào.
-- ============================================================================

-- Khối đang chạy bản đồ mới (Toán) — 1 nguồn là _kho_ds_nhanh_khoi; dùng trong bộ lọc dạng như initplan (tính 1 lần / truy vấn)
create or replace function public._bdm_ds_khoi_chay() returns text[]
language sql stable set search_path to 'public' as $$
  select coalesce(array_agg(x.khoi order by x.khoi), '{}')
    from (select distinct b.khoi from dai_ban_do b) x
   where coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', x.khoi)), false)
$$;

-- Câu (Đại/HGT) đã có dạng bài ở khối chạy bản đồ mới chưa — gán của chính câu hoặc của câu gốc (bản sao theo gốc)
create or replace function public._bdm_cau_co_dang_bai(p_kho text, p_ma_cau text, p_parent text, p_dang_chinh text) returns boolean
language plpgsql stable set search_path to 'public' as $$
declare v_khoi text; v boolean;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') then return false; end if;
  execute format('select khoi from %I where ma_dang = $1', p_kho || '_ban_do') into v_khoi using p_dang_chinh;
  if v_khoi is null or not coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', v_khoi)), false) then return false; end if;
  execute format('select exists (select 1 from %I where ma_cau in ($1, $2))', p_kho || '_bdm_gan_cau') into v using p_ma_cau, p_parent;
  return v;
end $$;

-- Bộ lọc hàng duyệt theo kho: kho có bản đồ mới ⇒ "đang chờ phân dạng" = dạng chờ VÀ chưa gán dạng bài (khối chạy bản đồ mới).
-- Mảnh SQL dùng alias c (bảng câu) + b (bản đồ cũ của câu) như bản 1 tham số.
create or replace function public._kho_loc_duyet_sql(p_loc text, p_tbl text) returns text
language sql stable set search_path to 'public' as $$
  select case when p_tbl in ('dai', 'hgt')
    then replace(public._kho_loc_duyet_sql(p_loc), 'public._kho_la_dang_cho(c.dang_chinh)',
           format('(public._kho_la_dang_cho(c.dang_chinh) and not (b.khoi in (select unnest(public._bdm_ds_khoi_chay())) and exists (select 1 from %I g where g.ma_cau in (c.ma_cau, c.parent_ma_cau))))',
                  p_tbl || '_bdm_gan_cau'))
    else public._kho_loc_duyet_sql(p_loc) end
$$;

create or replace function public._trg_chan_duyet_dang_cho()
 returns trigger
 language plpgsql
as $function$
begin
  if new.da_duyet and public._kho_la_dang_cho(new.dang_chinh)
     and coalesce(current_setting('kho.duyet_noi_dung', true), '') <> 'on' then   -- duyệt ĐỀ (nội dung) được phép, phân dạng sau
    -- Bản đồ mới (mig 202610261856): câu Đại/HGT ở khối chạy bản đồ mới đã GÁN dạng bài = đã phân dạng (dạng cũ chờ chỉ là lưu trữ)
    if tg_table_name in ('dai_cau_hoi', 'hgt_cau_hoi') then
      if public._bdm_cau_co_dang_bai(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau, new.dang_chinh) then return new; end if;
    end if;
    raise exception 'Chưa phân dạng: % đang ở dạng chờ % — chọn dạng thật trước khi duyệt', tg_table_name, new.dang_chinh
      using errcode = 'check_violation';
  end if;
  return new;
end $function$;

-- NGƯỜI chọn dạng bài cho 1 câu thường (Đại/HGT) ở khối chạy bản đồ mới ⇒ gán nguon 'nguoi' (đè gán cũ mọi nguồn; log do trigger).
create or replace function public._bdm_nguoi_gan_cau(p_kho text, p_ma_cau text, p_dang_bai text) returns void
language plpgsql set search_path to 'public' as $$
declare v_loai text; v_khoi text; v_nhanh text;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') then raise exception 'Kho % chưa có bản đồ mới', coalesce(p_kho, '∅'); end if;
  execute format('select c.loai_cau, b.khoi from %I c join %I b on b.ma_dang = c.dang_chinh where c.ma_cau = $1 and c.xoa_at is null',
                 p_kho || '_cau_hoi', p_kho || '_ban_do') into v_loai, v_khoi using p_ma_cau;
  if v_khoi is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if v_loai = 'dung_sai' then
    raise exception 'Câu Đúng/Sai % không gán dạng bài (4 ý ứng 4 dạng) — dùng kho Đúng/Sai của chủ đề', p_ma_cau;
  end if;
  if not coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', v_khoi)), false) then
    raise exception 'Khối % chưa chạy bản đồ mới — chọn dạng ở bản đồ cũ', v_khoi;
  end if;
  v_nhanh := case p_kho when 'dai' then 'toan' else 'hgt' end;
  if not exists (select 1 from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                  where d.id = p_dang_bai and cd.nhanh = v_nhanh) then
    raise exception 'Dạng bài % không thuộc bản đồ mới nhánh % (câu %)', p_dang_bai,
      case v_nhanh when 'toan' then 'Đại số' else 'Hình giải tích' end, p_ma_cau;
  end if;
  execute format($q$insert into %1$I as g (ma_cau, dang_bai_id, nguon) values ($1, $2, 'nguoi')
                    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = public.jwt_uid(), at = now()
                    where (g.dang_bai_id, g.nguon) is distinct from (excluded.dang_bai_id, 'nguoi')$q$, p_kho || '_bdm_gan_cau')
    using p_ma_cau, p_dang_bai;
end $$;

-- RPC cho màn: gán 1 câu + trả dạng bài vừa gán (để màn vá tại chỗ). p_mon = mã kho phía client ('toan' | 'hgt').
create or replace function public.fn_bdm_nguoi_gan_cau(p_mon text, p_ma_cau text, p_dang_bai text) returns jsonb
language plpgsql set search_path to 'public' as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  perform public._bdm_nguoi_gan_cau(public.fn_kho_tbl(p_mon), p_ma_cau, p_dang_bai);
  select jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chuyen_de', ch.ten, 'chu_de', cd.ten) into v
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
    left join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
   where d.id = p_dang_bai;
  return v;
end $$;
revoke execute on function public.fn_bdm_nguoi_gan_cau(text, text, text) from public, anon;
grant execute on function public.fn_bdm_nguoi_gan_cau(text, text, text) to authenticated;

-- NHẬP KHO (màn Nhập kho) ở khối chạy bản đồ mới: câu vào DẠNG CHỜ của khối, mã = mã chờ + STT (khoá theo mã chờ; STT lớn nhất
-- tính trên MỌI câu từng mang tiền tố này kể cả kho rác — mã cũ không cấp lại). Câu thường có dạng bài ⇒ gán 'nguoi';
-- câu Đ/S ⇒ kho Đ/S của chủ đề p_chu_de (mệnh đề để dạng chờ — bản đồ mới chưa có chỗ gắn dạng từng ý). Trả ma_cau.
create or replace function public.fn_bdm_nhap_cau(p_mon text, p_khoi text, p_cau jsonb, p_dang_bai text, p_chu_de text) returns text
language plpgsql set search_path to 'public' as $$
declare t text := public.fn_kho_tbl(p_mon); v_cho text; v_ok boolean; v_seq int; v_ma text; v_loai text := p_cau->>'loai_cau';
        v_md jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null or t not in ('dai', 'hgt') then raise exception 'Kho % chưa có bản đồ mới', coalesce(p_mon, '∅'); end if;
  if not coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', p_khoi)), false) then
    raise exception 'Khối % chưa chạy bản đồ mới — nhập theo bản đồ cũ', p_khoi;
  end if;
  if nullif(trim(p_cau->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
  v_cho := public._kho_dang_cho(t, p_khoi);
  execute format('select exists (select 1 from %I where ma_dang = $1)', t || '_ban_do') into v_ok using v_cho;
  if not v_ok then raise exception 'Khối % chưa có dạng chờ % ở kho %', p_khoi, v_cho, t; end if;

  perform pg_advisory_xact_lock(hashtext(t || '_cau_hoi:' || v_cho));
  execute format($q$select coalesce(max(substr(ma_cau, length($1) + 1)::int), 0) from %I
                    where ma_cau like $1 || '%%' and substr(ma_cau, length($1) + 1) ~ '^[0-9]+$'$q$, t || '_cau_hoi')
    into v_seq using v_cho;
  v_ma := v_cho || lpad((v_seq + 1)::text, greatest(3, length((v_seq + 1)::text)), '0');   -- lpad CẮT chuỗi dài hơn 3 ⇒ phải nới

  if v_loai = 'dung_sai' then
    select coalesce(jsonb_agg(m || jsonb_build_object('ma_dang', v_cho) order by o), '[]'::jsonb) into v_md
      from jsonb_array_elements(coalesce(p_cau->'menh_de', '[]'::jsonb)) with ordinality e(m, o);
  end if;
  execute format($q$insert into %I (ma_cau, dang_chinh, loai_cau, noi_dung, dap_an, loi_giai, lua_chon, menh_de, anh_de, anh_dap_an, nguon, nguon_giai)
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'le', $11)$q$, t || '_cau_hoi')
    using v_ma, v_cho, v_loai, trim(p_cau->>'noi_dung'),
          case when v_loai = 'dung_sai' then null else nullif(trim(p_cau->>'dap_an'), '') end,
          nullif(trim(p_cau->>'loi_giai'), ''),
          case when jsonb_typeof(p_cau->'lua_chon') = 'array' then p_cau->'lua_chon' end,
          v_md, nullif(p_cau->>'anh_de', ''), nullif(p_cau->>'anh_dap_an', ''),
          coalesce(nullif(p_cau->>'nguon_giai', ''), 'nguoi');

  if v_loai = 'dung_sai' then
    if p_chu_de is not null then
      execute format($q$insert into %I (ma_cau, chu_de_id, nguon) values ($1, $2, 'nguoi')$q$, t || '_bdm_kho_ds') using v_ma, p_chu_de;
    end if;
  elsif p_dang_bai is not null then
    perform public._bdm_nguoi_gan_cau(t, v_ma, p_dang_bai);
  end if;
  return v_ma;
end $$;
revoke execute on function public.fn_bdm_nhap_cau(text, text, jsonb, text, text) from public, anon;
grant execute on function public.fn_bdm_nhap_cau(text, text, jsonb, text, text) to authenticated;

-- ── Ba hàm hàng duyệt: thân cũ + vá (bản đồ mới) ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.fn_kho_duyet_cau(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_cum_tbl text; v_form text;
  r record; v_dang text; v_cum text; v_dap text; v_lg text; v_de text; v_lua_chon jsonb;
  v_doi_dap boolean; v_doi_dang boolean; v_ok boolean; v_thu_hoi integer := 0;
  v_kiem_may text; v_kiem_boi text; v_kiem_ghi text; v_kiem_at timestamptz;
  v_opt jsonb; v_dang_bai text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_cum_tbl := t || '_cum_bai'; v_form := public._kho_form_tn_cua(v_cau);

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;

  -- Bản đồ mới (K6–12 Toán Đại/HGT — Thùy 26/10): người chọn DẠNG BÀI ⇒ ghi GÁN (nguon 'nguoi') TRƯỚC khi ký duyệt, cùng transaction.
  -- dang_chinh (dạng cũ) giữ nguyên = lưu trữ; trigger chặn duyệt nhận câu đã gán là đã phân dạng.
  v_dang_bai := nullif(trim(p_sua->>'dang_bai'), '');
  if v_dang_bai is not null then perform public._bdm_nguoi_gan_cau(t, p_ma_cau, v_dang_bai); end if;

  -- Dạng: phải có trong bản đồ của nhánh
  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), r.dang_chinh);
  execute format('select exists (select 1 from %I where ma_dang = $1)', v_ban_do) into v_ok using v_dang;
  if not v_ok then raise exception 'Dạng % không có trong bản đồ %', v_dang, v_ban_do; end if;
  v_doi_dang := v_dang is distinct from r.dang_chinh;

  -- Cụm: key có ⇒ lấy giá trị (null = bỏ cụm); vắng ⇒ giữ. Cụm phải THUỘC dạng đã chốt, không thì về null (cụm nằm gọn trong 1 dạng).
  v_cum := case when p_sua ? 'ma_cum' then nullif(trim(p_sua->>'ma_cum'), '') else r.ma_cum end;
  if v_cum is not null then
    execute format('select exists (select 1 from %I where ma_cum = $1 and ma_dang = $2)', v_cum_tbl) into v_ok using v_cum, v_dang;
    if not v_ok then
      if p_sua ? 'ma_cum' then raise exception 'Cụm % không thuộc dạng %', v_cum, v_dang; end if;
      v_cum := null;   -- cụm cũ theo dạng cũ ⇒ reset
    end if;
  end if;

  v_de  := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else r.noi_dung end;
  if v_de is null then raise exception 'Đề không được trống'; end if;
  v_dap := case when p_sua ? 'dap_an'   then nullif(trim(p_sua->>'dap_an'), '')   else r.dap_an end;
  v_lg  := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else r.loi_giai end;
  v_doi_dap := v_dap is distinct from r.dap_an;

  -- 4 phương án A/B/C/D (chỉ câu trắc nghiệm có cột này): key có ⇒ validate là mảng chuỗi không rỗng, cùng
  -- số lượng phương án gốc (đáp số đang trỏ theo CHỮ CÁI/vị trí, đổi số lượng phương án dễ lệch đáp số).
  if p_sua ? 'lua_chon' then
    v_lua_chon := p_sua->'lua_chon';
    if jsonb_typeof(v_lua_chon) is distinct from 'array' then raise exception 'lua_chon phải là mảng chuỗi'; end if;
    if r.lua_chon is null then raise exception 'Câu này không phải trắc nghiệm, không có phương án để sửa'; end if;
    if jsonb_array_length(v_lua_chon) is distinct from jsonb_array_length(r.lua_chon) then
      raise exception 'Số phương án phải giữ nguyên (%), không thêm/bớt A/B/C/D', jsonb_array_length(r.lua_chon);
    end if;
    for v_opt in select * from jsonb_array_elements(v_lua_chon) loop
      if jsonb_typeof(v_opt) is distinct from 'string' or trim(v_opt #>> '{}') = '' then
        raise exception 'Mỗi phương án phải là chuỗi khác rỗng';
      end if;
    end loop;
  else
    v_lua_chon := r.lua_chon;
  end if;

  -- Sửa đáp số ⇒ thu hồi mọi form trắc nghiệm của câu (phương án đúng đã sai) để sinh lại
  if v_doi_dap and v_form is not null then
    execute format($q$update %I set xoa_at = now(), tu_choi_boi = $2,
                      tu_choi_ly_do = 'thu hồi: người sửa đáp số câu khi duyệt (' || $3 || ' → ' || $4 || ')'
                    where ma_cau = $1 and xoa_at is null$q$, v_form)
      using p_ma_cau, p_nguoi, coalesce(r.dap_an, '∅'), coalesce(v_dap, '∅');
    get diagnostics v_thu_hoi = row_count;
  end if;

  -- Kết quả kiểm đáp số: người là nhân chứng cuối khi câu đang nghi/không kiểm/chưa kiểm hoặc người đổi đáp số;
  -- máy/AI đã ký khớp mà người không đổi ⇒ giữ (đo precision mẫu ở mức C).
  if v_doi_dap or r.kiem_may is distinct from 'khop' then
    v_kiem_may := 'khop'; v_kiem_boi := 'nguoi'; v_kiem_at := now();
    v_kiem_ghi := case when v_doi_dap then 'người sửa đáp số: ' || coalesce(r.dap_an, '∅') || ' → ' || coalesce(v_dap, '∅') else 'người xác nhận' end
               || case when r.kiem_may_ghi is not null then ' (trước: ' || r.kiem_may_ghi || ')' else '' end;
  else
    v_kiem_may := r.kiem_may; v_kiem_boi := r.kiem_may_boi; v_kiem_ghi := r.kiem_may_ghi; v_kiem_at := r.kiem_may_at;
  end if;

  execute format($q$update %I set noi_dung = $2, dap_an = $3, loi_giai = $4, dang_chinh = $5, ma_cum = $6,
                    lua_chon = $12,
                    da_duyet = true, duyet_boi = $7, duyet_at = now(), duyet_nguon = 'nguoi',
                    kiem_may = $8, kiem_may_boi = $9, kiem_may_ghi = $10, kiem_may_at = $11
                  where ma_cau = $1$q$, v_cau)
    using p_ma_cau, v_de, v_dap, v_lg, v_dang, v_cum, p_nguoi, v_kiem_may, v_kiem_boi, v_kiem_ghi, v_kiem_at, v_lua_chon;

  return jsonb_build_object('thu_hoi_form', v_thu_hoi, 'doi_dap_an', v_doi_dap, 'doi_dang', v_doi_dang or v_dang_bai is not null, 'dang_bai', v_dang_bai);
end
$function$;

CREATE OR REPLACE FUNCTION public.fn_kho_hang_duyet(p_mon text, p_loc text, p_khoi text DEFAULT NULL::text, p_limit integer DEFAULT 300, p_offset integer DEFAULT 0)
 RETURNS TABLE(ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, nguon text, nguon_giai text, giai_method text, created_at timestamp with time zone, ma_cum text, ten_cum text, da_duyet boolean, kho_chuan boolean, kiem_may text, kiem_may_boi text, kiem_may_ghi text, kiem_may_at timestamp with time zone, dang_ai_de_xuat text, bdm_chu_de text, bdm_chuyen_de text, bdm_nhom text, bdm_dang_bai text, bdm_dang_bai_id text, bdm_trang_thai text, bdm_ly_do text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t text := public.fn_kho_tbl(p_mon); v_dk text := public._kho_loc_duyet_sql(p_loc, public.fn_kho_tbl(p_mon));
        v_co_cum boolean; v_bdm boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet: môn không hợp lệ %', p_mon; end if;
  if v_dk is null then raise exception 'fn_kho_hang_duyet: bộ lọc không hợp lệ %', p_loc; end if;
  v_co_cum := to_regclass('public.' || t || '_cum_bai') is not null;   -- môn Anh chưa có bảng cụm
  v_bdm := t in ('dai', 'hgt');                                         -- kho có bản đồ mới: Toán Đại + HGT (mig 202610261856)
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai, c.anh_de, c.anh_dap_an,
           c.nguon, c.nguon_giai, c.giai_method, c.created_at,
           c.ma_cum, %5$s, c.da_duyet, c.kho_chuan,
           c.kiem_may, c.kiem_may_boi, c.kiem_may_ghi, c.kiem_may_at, c.dang_ai_de_xuat,
           %6$s
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    %3$s
    %7$s
    where c.xoa_at is null and %4$s and ($1::text is null or b.khoi = $1)
    order by b.khoi, c.dang_chinh, c.ma_cau
    limit $2 offset $3
  $q$, t || '_cau_hoi', t || '_ban_do',
       case when v_co_cum then format('left join %I m on m.ma_cum = c.ma_cum', t || '_cum_bai') else '' end,
       v_dk,
       case when v_co_cum then 'm.ten' else 'null::text' end,
       case when v_bdm
         then $s$coalesce(bcd.ten, bck.ten) as bdm_chu_de, bch.ten as bdm_chuyen_de, bnh.ten as bdm_nhom,
                 bdb.ten as bdm_dang_bai, bdb.id as bdm_dang_bai_id,
                 case when bg.dang_bai_id is not null then 'gan' when bx.dang_bai_id is not null then 'de_xuat'
                      when bk.ma_cau is not null then 'chua_khop' end as bdm_trang_thai,
                 case when bg.dang_bai_id is null and bx.dang_bai_id is not null then nullif(bx.ly_do, '') else bk.ly_do end as bdm_ly_do$s$
         else 'null::text, null::text, null::text, null::text, null::text, null::text, null::text' end,
       case when v_bdm
         then format($j$left join lateral (select g.dang_bai_id from %1$I g where g.ma_cau in (c.ma_cau, c.parent_ma_cau)
                                       order by (g.ma_cau = c.ma_cau) desc limit 1) bg on true
                 left join lateral (select x.dang_bai_id, x.ly_do from %2$I x where x.ma_cau in (c.ma_cau, c.parent_ma_cau)
                                       order by (x.ma_cau = c.ma_cau) desc limit 1) bx on true
                 left join dai_bdm_dang_bai bdb on bdb.id = coalesce(bg.dang_bai_id, bx.dang_bai_id)
                 left join dai_bdm_nhom bnh on bnh.id = bdb.nhom_id
                 left join dai_bdm_chuyen_de bch on bch.id = bnh.chuyen_de_id
                 left join dai_bdm_chu_de bcd on bcd.id = bnh.chu_de_id
                 %3$s$j$, t || '_bdm_gan_cau', t || '_bdm_de_xuat',
                 case when t = 'dai'
                   then 'left join dai_bdm_cau_chua_khop bk on bk.ma_cau = c.ma_cau left join dai_bdm_chu_de bck on bck.id = bk.chu_de_id'
                   else 'left join (select null::text ma_cau, null::text ly_do) bk on false left join (select null::text ten) bck on false' end)
         else '' end
  ) using p_khoi, p_limit, p_offset;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_kho_dem_hang_duyet(p_nhanh text[])
 RETURNS TABLE(loc text, khoi text, so_cau bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mon text; t text; v_loc text; v_sql text := '';
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  foreach v_mon in array p_nhanh loop
    t := public.fn_kho_tbl(v_mon);
    if t is null then continue; end if;   -- 'hinh' không có bảng câu dạng
    foreach v_loc in array array['cau_moi', 'moi', 'nghi', 'khong_kiem', 'ton_dong', 'chua_dang', 'dung_sai'] loop
      -- 'dung_sai' chỉ đếm ở nhánh có bảng con mệnh đề (dai/hgt). KHTN hold (memory doi-xung-cap-mon-vs-nhanh).
      if v_loc = 'dung_sai' and to_regclass(t || '_cau_menh_de') is null then continue; end if;
      v_sql := v_sql || case when v_sql = '' then '' else ' union all ' end
        || format($q$select %L::text loc, b.khoi, count(*) n from %I c join %I b on b.ma_dang = c.dang_chinh where c.xoa_at is null and %s group by b.khoi$q$,
                  v_loc, t || '_cau_hoi', t || '_ban_do', public._kho_loc_duyet_sql(v_loc, t));
    end loop;
  end loop;
  if v_sql = '' then return; end if;
  return query execute 'select d.loc, d.khoi, sum(d.n)::bigint from (' || v_sql || ') d group by grouping sets ((d.loc, d.khoi), (d.loc)) order by 1, 2 nulls first';
end $function$;
