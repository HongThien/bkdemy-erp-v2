-- ============================================================================
-- 202610261929 — kho_dung_sai_chu_de_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 trả lời điểm Đ/S: "Để tạm vào kho của chủ đề đã". Ở khối chạy bản đồ mới (Toán K6–12):
--   · Ý (mệnh đề) của câu Đúng/Sai KHÔNG gắn dạng ⇒ duyệt ý không đòi dạng (ý chưa có dạng / dạng không còn ⇒ dạng chờ
--     của khối, chỉ là lưu trữ); trigger chặn duyệt nới cho bảng mệnh đề ở khối mới.
--   · Câu Đ/S thuộc KHO Đ/S CỦA CHỦ ĐỀ (*_bdm_kho_ds) ⇒ duyệt câu chỉ cần CHỦ ĐỀ: fn_kho_duyet_cau_ds nhận p_sua.chu_de
--     (người chọn ⇒ nguon 'nguoi'), thiếu chủ đề thì chặn; câu cha ở dạng chờ mà có chủ đề ⇒ trigger cho duyệt.
--   · Hàng duyệt Đ/S trả chủ đề kho Đ/S (cả HGT) thay cho gán dạng bài (Đ/S không có dạng bài — trigger cấm).
--   Cấp 1 / công tắc tắt: y hệt cũ (mọi nhánh mới chặn bằng _kho_ds_nhanh_khoi).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ create/replace hàm (cùng kiểu trả), không đụng dữ liệu.
-- ============================================================================

-- Dạng (mã bản đồ cũ của câu/ý) thuộc khối đang chạy bản đồ mới chưa — kho Đại/HGT
create or replace function public._bdm_dang_o_khoi_moi(p_kho text, p_dang text) returns boolean
language plpgsql stable set search_path to 'public' as $$
declare v_khoi text;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') or p_dang is null then return false; end if;
  execute format('select khoi from %I where ma_dang = $1', p_kho || '_ban_do') into v_khoi using p_dang;
  return v_khoi is not null and coalesce('bdm' = any(public._kho_ds_nhanh_khoi('Toán', v_khoi)), false);
end $$;

-- Câu Đ/S đã nằm trong kho Đ/S của một chủ đề chưa (dòng của chính câu hoặc câu gốc)
create or replace function public._bdm_cau_ds_co_chu_de(p_kho text, p_ma_cau text, p_parent text) returns boolean
language plpgsql stable set search_path to 'public' as $$
declare v boolean;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') then return false; end if;
  execute format('select exists (select 1 from %I where ma_cau in ($1, $2))', p_kho || '_bdm_kho_ds') into v using p_ma_cau, p_parent;
  return v;
end $$;

-- NGƯỜI chọn chủ đề kho Đ/S cho 1 câu Đ/S ⇒ nguon 'nguoi'. Ghi vào dòng ĐANG HIỆU LỰC: dòng của chính câu nếu có, không thì
-- dòng câu gốc (cùng chỗ fn_de_thi_gan_dang_moi ghi) — bản sao đi theo gốc.
create or replace function public._bdm_nguoi_gan_chu_de_ds(p_kho text, p_ma_cau text, p_chu_de text) returns void
language plpgsql set search_path to 'public' as $$
declare v_loai text; v_goc text; v_dang text; v_nhanh text; v_tu boolean;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') then raise exception 'Kho % chưa có bản đồ mới', coalesce(p_kho, '∅'); end if;
  execute format('select loai_cau, coalesce(parent_ma_cau, ma_cau), dang_chinh from %I where ma_cau = $1 and xoa_at is null', p_kho || '_cau_hoi')
    into v_loai, v_goc, v_dang using p_ma_cau;
  if v_goc is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if v_loai is distinct from 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai — câu thường gán dạng bài', p_ma_cau; end if;
  if not public._bdm_dang_o_khoi_moi(p_kho, v_dang) then raise exception 'Khối của câu % chưa chạy bản đồ mới', p_ma_cau; end if;
  v_nhanh := case p_kho when 'dai' then 'toan' else 'hgt' end;
  if not exists (select 1 from dai_bdm_chu_de cd where cd.id = p_chu_de and cd.nhanh = v_nhanh) then
    raise exception 'Chủ đề % không thuộc bản đồ mới nhánh %', p_chu_de, case v_nhanh when 'toan' then 'Đại số' else 'Hình giải tích' end;
  end if;
  execute format('select exists (select 1 from %I where ma_cau = $1)', p_kho || '_bdm_kho_ds') into v_tu using p_ma_cau;
  execute format($q$insert into %1$I as k (ma_cau, chu_de_id, nguon) values ($1, $2, 'nguoi')
                    on conflict (ma_cau) do update set chu_de_id = excluded.chu_de_id, nguon = 'nguoi', actor = public.jwt_uid(), at = now()
                    where (k.chu_de_id, k.nguon) is distinct from (excluded.chu_de_id, 'nguoi')$q$, p_kho || '_bdm_kho_ds')
    using case when v_tu then p_ma_cau else v_goc end, p_chu_de;
end $$;

create or replace function public._trg_chan_duyet_dang_cho()
 returns trigger
 language plpgsql
as $function$
begin
  if new.da_duyet and public._kho_la_dang_cho(new.dang_chinh)
     and coalesce(current_setting('kho.duyet_noi_dung', true), '') <> 'on' then   -- duyệt ĐỀ (nội dung) được phép, phân dạng sau
    -- Bản đồ mới (mig 202610261856 + 202610261929) — khối chạy bản đồ mới, Đại/HGT:
    --   câu thường đã GÁN dạng bài = đã phân dạng · câu Đ/S có CHỦ ĐỀ kho Đ/S = đã phân · ý Đ/S không gắn dạng (dạng chờ chỉ là lưu trữ)
    if tg_table_name in ('dai_cau_hoi', 'hgt_cau_hoi') then
      if new.loai_cau = 'dung_sai' then
        if public._bdm_dang_o_khoi_moi(left(tg_table_name, 3), new.dang_chinh)
           and public._bdm_cau_ds_co_chu_de(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau) then return new; end if;
      elsif public._bdm_cau_co_dang_bai(left(tg_table_name, 3), new.ma_cau, new.parent_ma_cau, new.dang_chinh) then return new;
      end if;
    elsif tg_table_name in ('dai_cau_menh_de', 'hgt_cau_menh_de') then
      if public._bdm_dang_o_khoi_moi(left(tg_table_name, 3), new.dang_chinh) then return new; end if;
    end if;
    raise exception 'Chưa phân dạng: % đang ở dạng chờ % — chọn dạng thật trước khi duyệt', tg_table_name, new.dang_chinh
      using errcode = 'check_violation';
  end if;
  return new;
end $function$;

-- ── Ba hàm duyệt Đ/S: thân cũ + vá (bản đồ mới) ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.fn_kho_duyet_menh_de(p_mon text, p_ma_cau text, p_thu_tu integer, p_nguoi uuid, p_sua jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_con text;
  r record; k record; e jsonb;
  v_dang text; v_nd text; v_dung boolean; v_lg text; v_id uuid; v_ten_dang text; v_ten_cd text; v_khoi text; v_ok boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_menh_de: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  if r.menh_de is null or jsonb_typeof(r.menh_de) <> 'array' or p_thu_tu < 1 or p_thu_tu > jsonb_array_length(r.menh_de) then
    raise exception 'Câu % không có mệnh đề thứ %', p_ma_cau, p_thu_tu;
  end if;
  e := r.menh_de -> (p_thu_tu - 1);

  execute format('select * from %I where ma_cau_cha = $1 and thu_tu = $2', v_con) into k using p_ma_cau, p_thu_tu;

  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), k.dang_chinh, e->>'ma_dang');
  -- Bản đồ mới (Thùy 26/10 "để tạm vào kho của chủ đề"): ý Đ/S KHÔNG gắn dạng ⇒ chưa có / dạng không còn ⇒ dạng chờ của khối
  if public._bdm_dang_o_khoi_moi(t, r.dang_chinh) then
    if v_dang is not null then execute format('select exists (select 1 from %I where ma_dang = $1)', v_ban_do) into v_ok using v_dang; end if;
    if v_dang is null or not coalesce(v_ok, false) then
      execute format('select khoi from %I where ma_dang = $1', v_ban_do) into v_khoi using r.dang_chinh;
      v_dang := public._kho_dang_cho(t, v_khoi);
    end if;
  end if;
  if v_dang is null then raise exception 'Mệnh đề % chưa có dạng — chọn dạng trước khi duyệt', p_thu_tu; end if;
  execute format('select ten_dang, ten_chuyen_de from %I where ma_dang = $1', v_ban_do) into v_ten_dang, v_ten_cd using v_dang;
  if v_ten_dang is null then raise exception 'Dạng % không có trong bản đồ % — chọn dạng khác', v_dang, v_ban_do; end if;

  v_nd   := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else coalesce(k.noi_dung, e->>'noi_dung') end;
  if v_nd is null then raise exception 'Nội dung mệnh đề không được trống'; end if;
  v_dung := case when p_sua ? 'dung' then (p_sua->>'dung')::boolean else coalesce(k.dung, coalesce(e->>'dap_an','S') = 'D') end;
  v_lg   := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else coalesce(k.loi_giai, e->>'loi_giai') end;

  -- Đoạn ghi đôi (bảng con + jsonb cha): tắt trigger sync CHỈ trong đoạn này.
  perform set_config('kho.skip_sync_menh_de', '1', true);
  execute format($q$
    insert into %I (ma_cau_cha, thu_tu, dang_chinh, dang_ai_de_xuat, noi_dung, dung, loi_giai,
                    da_duyet, duyet_boi, duyet_at, duyet_nguon, kiem_may, kiem_may_at, xoa_at)
    values ($1, $2, $3, $4, $5, $6, $7, true, $8, now(), 'nguoi', 'khop', now(), null)
    on conflict (ma_cau_cha, thu_tu) do update set
      dang_chinh = excluded.dang_chinh, noi_dung = excluded.noi_dung, dung = excluded.dung, loi_giai = excluded.loi_giai,
      da_duyet = true, duyet_boi = excluded.duyet_boi, duyet_at = now(), duyet_nguon = 'nguoi',
      kiem_may = 'khop', kiem_may_at = now(), xoa_at = null
    returning id$q$, v_con)
    into v_id using p_ma_cau, p_thu_tu, v_dang, coalesce(k.dang_ai_de_xuat, e->>'ma_dang'), v_nd, v_dung, v_lg, p_nguoi;

  execute format($q$update %I set menh_de = jsonb_set(menh_de, array[$2::text], $3::jsonb, false) where ma_cau = $1$q$, v_cau)
    using p_ma_cau, (p_thu_tu - 1),
          jsonb_build_object('noi_dung', v_nd, 'dap_an', case when v_dung then 'D' else 'S' end, 'ma_dang', v_dang, 'loi_giai', v_lg);
  perform set_config('kho.skip_sync_menh_de', '0', true);

  return jsonb_build_object('id', v_id, 'thu_tu', p_thu_tu, 'dang_chinh', v_dang, 'ten_dang', v_ten_dang, 'ten_chuyen_de', v_ten_cd,
                            'noi_dung', v_nd, 'dung', v_dung, 'loi_giai', v_lg, 'da_duyet', true, 'duyet_at', now(),
                            'dang_ai_de_xuat', coalesce(k.dang_ai_de_xuat, e->>'ma_dang'));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_kho_duyet_cau_ds(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb DEFAULT '{}'::jsonb, p_duyet_het boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_con text; r record; v_n int; v_ok int; i int; kq jsonb; v_moi boolean; v_cd text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau_ds: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select ma_cau, loai_cau, menh_de, dang_chinh, parent_ma_cau from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  v_n := coalesce(jsonb_array_length(r.menh_de), 0);
  if v_n < 2 then raise exception 'Câu % có % mệnh đề — câu Đúng/Sai cần ít nhất 2', p_ma_cau, v_n; end if;

  -- Bản đồ mới: câu Đ/S thuộc KHO Đ/S của CHỦ ĐỀ — duyệt chỉ cần chủ đề (p_sua.chu_de = người chọn ⇒ ghi nguon 'nguoi')
  v_moi := public._bdm_dang_o_khoi_moi(t, r.dang_chinh);
  if v_moi then
    v_cd := nullif(trim(p_sua->>'chu_de'), '');
    if v_cd is not null then perform public._bdm_nguoi_gan_chu_de_ds(t, p_ma_cau, v_cd); end if;
    if not public._bdm_cau_ds_co_chu_de(t, p_ma_cau, r.parent_ma_cau) then
      raise exception 'Câu Đúng/Sai % chưa có chủ đề (kho Đúng/Sai của chủ đề) — chọn chủ đề trước khi duyệt', p_ma_cau using errcode = 'check_violation';
    end if;
  end if;

  if p_duyet_het then
    for i in 1..v_n loop perform public.fn_kho_duyet_menh_de(p_mon, p_ma_cau, i, p_nguoi, '{}'::jsonb); end loop;
  end if;

  execute format('select count(*) from %I where ma_cau_cha = $1 and xoa_at is null and da_duyet', v_con) into v_ok using p_ma_cau;
  if v_ok < v_n then
    raise exception 'Còn %/% mệnh đề chưa duyệt (hoặc chưa gán dạng) — duyệt từng mệnh đề trước', v_n - v_ok, v_n;
  end if;

  kq := public.fn_kho_duyet_cau(p_mon, p_ma_cau, p_nguoi, p_sua);
  return kq || jsonb_build_object('so_menh_de', v_n, 'chu_de', v_cd);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_kho_hang_duyet_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_limit integer DEFAULT 300, p_offset integer DEFAULT 0)
 RETURNS TABLE(ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, noi_dung text, loi_giai text, anh_de text, anh_dap_an text, nguon text, nguon_giai text, created_at timestamp with time zone, ma_cum text, ten_cum text, da_duyet boolean, kho_chuan boolean, dang_ai_de_xuat text, ten_de_goc text, so_menh_de integer, so_da_duyet integer, so_thieu_dang integer, menh_de_hop jsonb, bdm_chu_de text, bdm_chuyen_de text, bdm_nhom text, bdm_dang_bai text, bdm_dang_bai_id text, bdm_trang_thai text, bdm_ly_do text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t text := public.fn_kho_tbl(p_mon); v_bdm boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet_ds: môn không hợp lệ %', p_mon; end if;
  if to_regclass(t || '_cau_menh_de') is null then
    raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề (chưa có bảng %_cau_menh_de)', p_mon, t;
  end if;
  v_bdm := t in ('dai', 'hgt');   -- mig 202610261929: cột bdm_* = CHỦ ĐỀ kho Đ/S (bdm_trang_thai 'kho_ds'), Đ/S không có dạng bài
  return query execute format($q$
    with cau as (
      select c.*, b.ten_dang, b.ten_chuyen_de, b.khoi as b_khoi, m.ten as ten_cum_
      from %1$I c
      join %2$I b on b.ma_dang = c.dang_chinh
      left join %3$I m on m.ma_cum = c.ma_cum
      where c.xoa_at is null and c.loai_cau = 'dung_sai' and not c.da_duyet
        and ($1::text is null or b.khoi = $1)
      order by b.khoi, c.dang_chinh, c.ma_cau
      limit $2 offset $3
    ),
    md as (
      select k.ma_cau_cha, k.thu_tu, k.id, k.dang_chinh, bd.ten_dang, bd.ten_chuyen_de,
             k.noi_dung, k.dung, k.loi_giai, k.da_duyet, k.duyet_at, k.dang_ai_de_xuat
      from %4$I k join %2$I bd on bd.ma_dang = k.dang_chinh
      where k.xoa_at is null and k.ma_cau_cha in (select ma_cau from cau)
    ),
    hop as (
      select c.ma_cau,
             jsonb_agg(jsonb_build_object(
               'thu_tu', e.ord, 'noi_dung', e.elem->>'noi_dung', 'dap_an', e.elem->>'dap_an',
               'ma_dang', e.elem->>'ma_dang', 'loi_giai', e.elem->>'loi_giai',
               'con', case when md.id is null then null else jsonb_build_object(
                 'id', md.id, 'dang_chinh', md.dang_chinh, 'ten_dang', md.ten_dang, 'ten_chuyen_de', md.ten_chuyen_de,
                 'noi_dung', md.noi_dung, 'dung', md.dung, 'loi_giai', md.loi_giai,
                 'da_duyet', md.da_duyet, 'duyet_at', md.duyet_at, 'dang_ai_de_xuat', md.dang_ai_de_xuat) end
             ) order by e.ord) as menh_de_hop,
             count(*)::int as so_md,
             count(*) filter (where md.da_duyet)::int as so_duyet,
             count(*) filter (where %7$s)::int as so_thieu
      from cau c
      cross join lateral jsonb_array_elements(coalesce(c.menh_de, '[]'::jsonb)) with ordinality as e(elem, ord)
      left join md on md.ma_cau_cha = c.ma_cau and md.thu_tu = e.ord
      group by c.ma_cau
    )
    select c.ma_cau, c.dang_chinh, c.ten_dang, c.ten_chuyen_de, c.b_khoi,
           c.noi_dung, c.loi_giai, c.anh_de, c.anh_dap_an, c.nguon, c.nguon_giai, c.created_at,
           c.ma_cum, c.ten_cum_, c.da_duyet, c.kho_chuan, c.dang_ai_de_xuat, c.ten_de_goc,
           coalesce(h.so_md, 0), coalesce(h.so_duyet, 0), coalesce(h.so_thieu, 0), coalesce(h.menh_de_hop, '[]'::jsonb),
           %5$s
    from cau c left join hop h on h.ma_cau = c.ma_cau
    %6$s
    order by c.b_khoi, c.dang_chinh, c.ma_cau
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cum_bai', t || '_cau_menh_de',
       case when v_bdm
         then $s$bcd.ten, null::text, null::text, bcd.ten, bcd.id, case when bcd.id is not null then 'kho_ds' end, null::text$s$
         else 'null::text, null::text, null::text, null::text, null::text, null::text, null::text' end,
       case when v_bdm
         then format($j$left join lateral (select k.chu_de_id from %1$I k where k.ma_cau in (c.ma_cau, c.parent_ma_cau)
                                       order by (k.ma_cau = c.ma_cau) desc limit 1) bkd on true
                 left join dai_bdm_chu_de bcd on bcd.id = bkd.chu_de_id$j$, t || '_bdm_kho_ds')
         else '' end,
       -- ý "thiếu dạng": bản đồ mới không đòi dạng từng ý (Thùy 26/10)
       case when v_bdm
         then '(not (c.b_khoi in (select unnest(public._bdm_ds_khoi_chay()))) and (md.id is null or public._kho_la_dang_cho(md.dang_chinh)))'
         else 'md.id is null or public._kho_la_dang_cho(md.dang_chinh)' end
  ) using p_khoi, p_limit, p_offset;
end $function$;
