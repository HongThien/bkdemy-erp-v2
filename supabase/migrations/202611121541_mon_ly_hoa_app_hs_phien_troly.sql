-- ============================================================================
-- Môn LÝ HÓA, đợt 4 — app học sinh (mở kho) · phiên Claude / phòng trưởng khối · trợ lý (Thùy 12/11)
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_ly_hoa_dot4.mjs từ DB đang chạy — đừng sửa tay, sửa script rồi sinh lại.
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   (1) _kho_co_mon: cổng "môn có kho" của app HS (thanh chọn môn, tự luyện, sổ tay…) — thêm Lý hóa. Lớp Lý hóa chỉ khối 10–12
--       (_mon_khoi_hop_le, mig 202611121420) nên chỉ em khối 10–12 có lớp Lý hóa mới thấy.
--   (2) Phiên Claude (spec-phong-truong-khoi.md): registry bảng bản đồ mới + nhánh kho + các hàm rẽ "KHTN ⇒ khtn_*, còn lại ⇒ Toán"
--       — thêm Lý hóa để trưởng khối Lý hóa mở phiên bản đồ / nhập kho như KHTN. Rào cứng giữ nguyên (đúng môn, đúng khối, không xoá).
--   (3) Trợ lý: tra tên dạng + enum môn trong danh mục công cụ.
-- MẤT GÌ (Luật xoá): không mất gì — create or replace hàm (giữ chữ ký, ACL).
-- ============================================================================
set local check_function_bodies = off;

-- _kho_co_mon(p_mon text)
CREATE OR REPLACE FUNCTION public._kho_co_mon(p_mon text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select p_mon in ('Toán', 'KHTN', 'Lý hóa', 'Tiếng Anh', 'TSA')
$function$
;
-- _phien_kho_mon()
CREATE OR REPLACE FUNCTION public._phien_kho_mon()
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
AS $function$ select array['Toán', 'KHTN', 'Lý hóa'] $function$
;
-- _phien_bdm_bang(p_mon text)
CREATE OR REPLACE FUNCTION public._phien_bdm_bang(p_mon text)
 RETURNS TABLE(bang text, ham text, co_vung boolean)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select r.bang, r.ham, r.co_vung from (values
    ('Toán', 'dai_bdm_',  'fn_bdm_',      true),
    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false),
    ('Lý hóa', 'lyhoa_bdm_', 'fn_lyhoa_bdm_', false)
  ) r(mon, bang, ham, co_vung) where r.mon = p_mon
$function$
;
-- _phien_bd_kiem_khoi(p_bang text, p_loai text, p_id text, p_khoi text)
CREATE OR REPLACE FUNCTION public._phien_bd_kiem_khoi(p_bang text, p_loai text, p_id text, p_khoi text)
 RETURNS void
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v text; v_ok boolean;
begin
  if nullif(trim(coalesce(p_id, '')), '') is null then raise exception 'Thiếu mã % .', p_loai; end if;
  v := public._phien_bd_khoi(p_bang, p_loai, p_id);
  if v is null then raise exception 'Không có % mã %.', p_loai, p_id; end if;
  if v = '*' then
    execute format('select coalesce(bool_and(public._truong_khoi_tro_len(%L, c.khoi)), false) from %I o join %I c on c.id = o.chu_de_id where o.chuyen_de_id = $1',
                   case when p_bang = 'khtn_bdm_' then 'KHTN' when p_bang = 'lyhoa_bdm_' then 'Lý hóa' else 'Toán' end, p_bang || 'o', p_bang || 'chu_de') into v_ok using p_id;
    if not v_ok then raise exception 'Chuyên đề % dùng chung với khối bạn không quản — nhờ trưởng khối đó hoặc cấp trên.', p_id; end if;
    return;
  end if;
  if v <> p_khoi then raise exception '% % thuộc khối %, ngoài phạm vi phiên (khối %).', p_loai, p_id, v, p_khoi; end if;
end $function$
;
-- _phien_kho_nhanh_ds()
CREATE OR REPLACE FUNCTION public._phien_kho_nhanh_ds()
 RETURNS TABLE(nhanh text, cau text, ban_do_cu text, gan text, de_xuat text, thieu text, kiem_mau text, vung text)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select * from (values
    ('dai', 'dai_cau_hoi', 'dai_ban_do', 'dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'dai_bdm_cau_thieu_dang', 'dai_bdm_kiem_mau', 'toan'),
    ('hgt', 'hgt_cau_hoi', 'hgt_ban_do', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', 'hgt_bdm_cau_thieu_dang', 'hgt_bdm_kiem_mau', 'hgt'),
    ('khtn', 'khtn_cau_hoi', 'khtn_ban_do', 'khtn_bdm_gan_cau', 'khtn_bdm_de_xuat', 'khtn_bdm_cau_thieu_dang', 'khtn_bdm_kiem_mau', 'khtn'),
    ('lyhoa', 'lyhoa_cau_hoi', 'lyhoa_ban_do', 'lyhoa_bdm_gan_cau', 'lyhoa_bdm_de_xuat', 'lyhoa_bdm_cau_thieu_dang', 'lyhoa_bdm_kiem_mau', 'lyhoa')
  ) r(nhanh, cau, ban_do_cu, gan, de_xuat, thieu, kiem_mau, vung)
$function$
;
-- _phien_kho_cau(p_p claude_phien, p_ma_cau text)
CREATE OR REPLACE FUNCTION public._phien_kho_cau(p_p claude_phien, p_ma_cau text)
 RETURNS TABLE(tbl text, nhanh text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_q jsonb; v_khoi text;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    if (case r.nhanh when 'khtn' then 'KHTN' when 'lyhoa' then 'Lý hóa' else 'Toán' end) <> p_p.mon then continue; end if;   -- 12/11: mỗi môn đúng bảng của môn
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    if v_q is not null then
      execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := r.cau; nhanh := r.nhanh; return next; return;
    end if;
  end loop;
  -- 07/11: kho Hình–Học (câu HHC…, dạng = bài học hinh_hoc_bai) — phiên Toán
  if p_p.mon = 'Toán' then
    select hb.khoi into v_khoi from hinh_hoc_cau_hoi c join hinh_hoc_bai hb on hb.ma_bai = c.dang_chinh where c.ma_cau = p_ma_cau;
    if found then
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := 'hinh_hoc_cau_hoi'; nhanh := 'hinh_hoc'; return next; return;
    end if;
  end if;
  raise exception 'Không có câu % trong kho % của phiên.', p_ma_cau, p_p.mon;
end $function$
;
-- _phien_kho_phan1(p_p claude_phien, p_ma_cau text, p_ket_qua text, p_dang_bai text, p_ly_do text, p_chu_de text)
CREATE OR REPLACE FUNCTION public._phien_kho_phan1(p_p claude_phien, p_ma_cau text, p_ket_qua text, p_dang_bai text, p_ly_do text, p_chu_de text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; v_q jsonb; v_khoi text; v_gan_nguon text; v_gan_db text; v_mau boolean; v_cd text; v_ly text := btrim(coalesce(p_ly_do, '')); v_nguoi boolean;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    exit when v_q is not null;
  end loop;
  if v_q is null then raise exception 'Không có câu %.', p_ma_cau; end if;
  -- 05/11: KHTN nối vào cùng luồng — câu phải đúng môn của phiên (bảng khtn_* chỉ cho phiên KHTN).
  if (case r.nhanh when 'khtn' then 'KHTN' when 'lyhoa' then 'Lý hóa' else 'Toán' end) <> p_p.mon then raise exception 'Câu % không thuộc môn % của phiên.', p_ma_cau, p_p.mon; end if;
  if v_q->>'xoa_at' is not null then raise exception 'Câu % đang ở kho rác.', p_ma_cau; end if;
  if v_q->>'parent_ma_cau' is not null then raise exception 'Câu % là bản sao của % — phân câu gốc, bản sao tự đi theo.', p_ma_cau, v_q->>'parent_ma_cau'; end if;
  if v_q->>'loai_cau' = 'dung_sai' then raise exception 'Câu % là Đúng/Sai — xếp theo chủ đề (đường riêng), không xếp theo dạng.', p_ma_cau; end if;
  execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
  if v_khoi is distinct from p_p.khoi then raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi; end if;

  execute format('select nguon, dang_bai_id from %I where ma_cau = $1', r.gan) into v_gan_nguon, v_gan_db using p_ma_cau;
  execute format('select exists (select 1 from %I where ma_cau = $1)', r.kiem_mau) into v_mau using p_ma_cau;
  if v_gan_nguon is not null and (v_gan_nguon <> 'ai' or v_mau) and coalesce(current_setting('phien.ghi_de', true), '') <> 'on' then
    raise exception 'Câu % đã được NGƯỜI quyết (gán dạng / kiểm mẫu) — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;
  -- 04/11 (Thùy: "thêm được, không được xoá"): dòng chờ duyệt / thiếu dạng do NGƯỜI nhập cũng là người đã quyết ⇒ Claude không đụng.
  execute format('select exists (select 1 from %I where ma_cau = $1 and nguon is distinct from ''ai'')
                      or exists (select 1 from %I where ma_cau = $1 and nguon is distinct from ''ai'')', r.de_xuat, r.thieu)
    into v_nguoi using p_ma_cau;
  if v_nguoi and coalesce(current_setting('phien.ghi_de', true), '') <> 'on' then
    raise exception 'Câu % đang có dòng chờ duyệt / thiếu dạng do NGƯỜI nhập — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;

  if p_ket_qua in ('cao', 'vua') and r.nhanh = 'khtn' then
    select cd.id into v_cd
      from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi;
    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ KHTN khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;
  elsif p_ket_qua in ('cao', 'vua') and r.nhanh = 'lyhoa' then
    select cd.id into v_cd
      from lyhoa_bdm_dang_bai d join lyhoa_bdm_nhom n on n.id = d.nhom_id join lyhoa_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi;
    if v_cd is null then raise exception 'Dạng bài % không thuộc bản đồ Lý hóa khối %.', coalesce(p_dang_bai, '?'), p_p.khoi; end if;
  elsif p_ket_qua in ('cao', 'vua') then
    select cd.id into v_cd
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi and cd.nhanh = r.vung;
    if v_cd is null then raise exception 'Dạng bài % không thuộc vùng % của khối % (câu % là nhánh %).', coalesce(p_dang_bai, '?'), r.vung, p_p.khoi, p_ma_cau, r.nhanh; end if;
  end if;

  if p_ket_qua = 'cao' then
    if r.nhanh = 'khtn' then
      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)
    elsif r.nhanh = 'lyhoa' then
      perform public._lyhoa_bdm_gan(p_ma_cau, p_dang_bai, 'ai');
    else
    execute format($q$insert into %I (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.gan)
      using p_ma_cau, p_dang_bai;
    end if;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.de_xuat) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'vua' then
    if v_ly = '' then raise exception 'Đề xuất (chưa chắc) phải kèm lý do phân vân.'; end if;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.gan) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'vua', $3, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = 'vua', ly_do = excluded.ly_do, nguon = 'ai', at = now()$q$, r.de_xuat)
      using p_ma_cau, p_dang_bai, v_ly;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'thieu' then
    if v_ly = '' then raise exception 'Báo thiếu dạng phải kèm lý do (câu này hỏi gì mà bản đồ chưa có).'; end if;
    -- chủ đề của hàng "thiếu": chủ đề Claude nêu (nếu có, phải đúng khối + vùng) — để trưởng khối thấy câu ở đúng chỗ.
    if p_chu_de is not null then
      if r.nhanh = 'khtn' then select cd.id into v_cd from khtn_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;
      elsif r.nhanh = 'lyhoa' then select cd.id into v_cd from lyhoa_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi;
      else select cd.id into v_cd from dai_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi and cd.nhanh = r.vung; end if;
      if v_cd is null then raise exception 'Chủ đề % không thuộc vùng % của khối %.', p_chu_de, r.vung, p_p.khoi; end if;
    end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.gan) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1 and (nguon = ''ai'' or current_setting(''phien.ghi_de'', true) = ''on'')', r.de_xuat) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, chu_de_id, ly_do, nguon) values ($1, $2, $3, 'ai')
                     on conflict (ma_cau) do update set chu_de_id = excluded.chu_de_id, ly_do = excluded.ly_do, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.thieu)
      using p_ma_cau, v_cd, v_ly;
  else
    raise exception 'ket_qua phải là cao · vua · thieu.';
  end if;
  return jsonb_build_object('ma_cau', p_ma_cau, 'ket_qua', p_ket_qua, 'dang_bai_id', case when p_ket_qua = 'thieu' then null else p_dang_bai end,
                            'nhanh', r.nhanh, 'truoc', case when v_gan_db is not null then 'ai_gan:' || v_gan_db else null end);
end $function$
;
-- fn_phien_kho_dang(p_phien uuid, p_dang_bai text, p_limit integer, p_offset integer)
CREATE OR REPLACE FUNCTION public.fn_phien_kho_dang(p_phien uuid, p_dang_bai text, p_limit integer DEFAULT 30, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_l int; v_o int;
begin
  v_p := public._phien_kho_vao(p_phien);
  v_l := least(greatest(coalesce(p_limit, 30), 1), 50); v_o := greatest(coalesce(p_offset, 0), 0);
  if v_p.mon = 'KHTN' then
    perform public._phien_bd_kiem_khoi('khtn_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_khtn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
  end if;
  if v_p.mon = 'Lý hóa' then
    perform public._phien_bd_kiem_khoi('lyhoa_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
    return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_lyhoa_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
  end if;
  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
  return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca', v_l, v_o) r), '[]'::jsonb);
end $function$
;
-- fn_phien_kho_hang(p_phien uuid, p_hang text, p_limit integer, p_offset integer)
CREATE OR REPLACE FUNCTION public.fn_phien_kho_hang(p_phien uuid, p_hang text, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_l int; v_o int;
begin
  v_p := public._phien_kho_vao(p_phien);
  if p_hang not in ('trong', 'de_xuat', 'thieu', 'mau') then raise exception 'hang phải là trong · de_xuat · thieu · mau.'; end if;
  v_l := least(greatest(coalesce(p_limit, 20), 1), 50); v_o := greatest(coalesce(p_offset, 0), 0);
  if v_p.mon = 'KHTN' then return public.fn_khtn_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;
  if v_p.mon = 'Lý hóa' then return public.fn_lyhoa_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o); end if;
  return public.fn_bdm_khop_hang(v_p.khoi, p_hang, v_l, v_o);
end $function$
;
-- fn_phien_kho_tong(p_phien uuid)
CREATE OR REPLACE FUNCTION public.fn_phien_kho_tong(p_phien uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  v_p := public._phien_kho_vao(p_phien);
  return jsonb_build_object('khoi', v_p.khoi, 'mon', v_p.mon,
    'dem', case when v_p.mon = 'KHTN' then public.fn_khtn_bdm_khop_dem(v_p.khoi) when v_p.mon = 'Lý hóa' then public.fn_lyhoa_bdm_khop_dem(v_p.khoi) else public.fn_bdm_khop_dem(v_p.khoi) end);
end $function$
;
-- fn_phien_kho_duyet(p_phien uuid, p_ts jsonb)
CREATE OR REPLACE FUNCTION public.fn_phien_kho_duyet(p_phien uuid, p_ts jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_ma text[]; m text; c record; v_duyet boolean := coalesce((p_ts->>'duyet')::boolean, true);
        v_ok int := 0; v_loi int := 0; v_kq jsonb := '[]'::jsonb; b text; v_gan text[]; v_tmp text[];
begin
  v_p := public._phien_kho_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  v_gan := case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau'] when v_p.mon = 'Lý hóa' then array['lyhoa_bdm_gan_cau'] else array['dai_bdm_gan_cau', 'hgt_bdm_gan_cau'] end;
  if jsonb_typeof(p_ts->'ma_cau') = 'array' then
    v_ma := array(select jsonb_array_elements_text(p_ts->'ma_cau'));
  elsif p_ts ? 'ma_bai' then   -- 07/11: cả một bài học Hình–Học
    if not exists (select 1 from hinh_hoc_bai where ma_bai = p_ts->>'ma_bai' and khoi = v_p.khoi) then
      raise exception 'Bài % không phải bài học Hình của khối %.', p_ts->>'ma_bai', v_p.khoi;
    end if;
    v_ma := array(select hc.ma_cau from hinh_hoc_cau_hoi hc where hc.dang_chinh = p_ts->>'ma_bai' and hc.xoa_at is null and hc.parent_ma_cau is null);
  elsif p_ts ? 'dang_bai_id' or p_ts ? 'nhom_id' then
    if p_ts ? 'dang_bai_id' then perform public._phien_bd_kiem_khoi(b, 'dang_bai', p_ts->>'dang_bai_id', v_p.khoi);
    else perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_p.khoi); end if;
    v_ma := '{}';
    foreach m in array v_gan loop
      execute format($q$select coalesce(array_agg(g.ma_cau), '{}') from %I g join %I d on d.id = g.dang_bai_id
                        where ($1::text is not null and d.id = $1) or ($2::text is not null and d.nhom_id = $2)$q$, m, b || 'dang_bai')
        into v_tmp using p_ts->>'dang_bai_id', p_ts->>'nhom_id';
      v_ma := v_ma || v_tmp;
    end loop;
  else
    raise exception 'Cần {"ma_cau":[...]} hoặc {"dang_bai_id":".."} hoặc {"nhom_id":".."} hoặc {"ma_bai":".."} (bài học Hình).';
  end if;
  if cardinality(v_ma) = 0 then return jsonb_build_object('ok', 0, 'loi', 0, 'ghi_chu', 'Không có câu nào.'); end if;
  if cardinality(v_ma) > 1000 then raise exception 'Mỗi lần tối đa 1000 câu (đang %).', cardinality(v_ma); end if;
  foreach m in array v_ma loop
    begin
      select * into c from public._phien_kho_cau(v_p, m);
      -- bản sao đi theo câu gốc (cùng như màn duyệt: duyệt gốc ⇒ duyệt bản sao)
      execute format($q$update %I set da_duyet = $2, duyet_boi = case when $2 then public.current_nhan_su_id() end,
                          duyet_at = case when $2 then now() end, duyet_nguon = case when $2 then 'nguoi' end
                        where (ma_cau = $1 or parent_ma_cau = $1) and xoa_at is null and da_duyet is distinct from $2$q$, c.tbl) using m, v_duyet;   -- câu đã đúng trạng thái: giữ người duyệt cũ
      v_ok := v_ok + 1;
    exception when others then
      v_loi := v_loi + 1; v_kq := v_kq || jsonb_build_array(jsonb_build_object('ma_cau', m, 'loi', sqlerrm));
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, case when v_duyet then 'duyet_cau' else 'bo_duyet_cau' end, p_ts, jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$
;
-- fn_phien_kho_them(p_phien uuid, p_ds jsonb)
CREATE OR REPLACE FUNCTION public.fn_phien_kho_them(p_phien uuid, p_ds jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_ok int := 0; v_trung int := 0; v_loi int := 0;
        v_nh text; v_tbl text; v_ma text; v_cu text; v_k text; v_phan jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu (xem tro-giup).'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lô tối đa 20 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' when v_p.mon = 'Lý hóa' then 'lyhoa' else 'dai' end);
      if v_p.mon = 'KHTN' and v_nh <> 'khtn' then raise exception 'Phiên KHTN: nhanh phải là khtn.'; end if;
      if v_p.mon = 'Lý hóa' and v_nh <> 'lyhoa' then raise exception 'Phiên Lý hóa: nhanh phải là lyhoa.'; end if;
      if v_p.mon not in ('KHTN', 'Lý hóa') and v_nh not in ('dai', 'hgt', 'hinh_hoc') then raise exception 'nhanh phải là dai · hgt · hinh_hoc.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      -- 11/11: md5(khoá) = md5($1) chỉ để đi index <bảng>_khoa_trung_idx (mig 202611112136); so khoá đầy đủ vẫn giữ.
      execute format($q$select min(c.ma_cau) from %I c where c.xoa_at is null
                         and md5(regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g')) = md5($1)
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1$q$, v_tbl)
        into v_cu using v_k;
      if v_cu is not null then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'trung', true, 'ma_cau', v_cu));
        v_trung := v_trung + 1;
        continue;
      end if;
      if v_nh = 'hinh_hoc' then   -- 07/11: câu Hình–Học vào thẳng bài học (dạng = bài), chưa duyệt
        if not exists (select 1 from hinh_hoc_bai where ma_bai = x->>'ma_bai' and khoi = v_p.khoi) then
          raise exception 'Câu Hình–Học cần "ma_bai" là bài học Hình của khối %.', v_p.khoi;
        end if;
        if nullif(trim(x->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
        insert into hinh_hoc_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, nguon, nguon_giai, da_duyet, dang_ai_de_xuat)
        values (x->>'ma_bai', x->>'loai_cau', trim(x->>'noi_dung'),
                case when jsonb_typeof(x->'lua_chon') = 'array' then x->'lua_chon' end,
                case when jsonb_typeof(x->'menh_de') = 'array' then x->'menh_de' end,
                nullif(trim(x->>'dap_an'), ''), nullif(trim(x->>'loi_giai'), ''), 'le',
                case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end, false, x->>'ma_bai')
        returning ma_cau into v_ma;
      else
      v_ma := public.fn_bdm_nhap_cau(case v_nh when 'dai' then 'toan' else v_nh end, v_p.khoi,
                                     x || jsonb_build_object('nguon_giai', case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end),
                                     null, null);
      end if;
      if nullif(trim(x->>'ten_de_goc'), '') is not null and v_nh <> 'hinh_hoc' then
        execute format('update %I set ten_de_goc = $2 where ma_cau = $1', v_tbl) using v_ma, trim(x->>'ten_de_goc');
      end if;
      v_phan := null;
      if jsonb_typeof(x->'phan') = 'object' and x->>'loai_cau' <> 'dung_sai' and v_nh <> 'hinh_hoc' then
        v_phan := public._phien_kho_phan1(v_p, v_ma, x->'phan'->>'ket_qua', x->'phan'->>'dang_bai_id', x->'phan'->>'ly_do', x->'phan'->>'chu_de_id');
      end if;
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'ma_cau', v_ma, 'nhanh', v_nh, 'phan', v_phan));
      v_ok := v_ok + 1;
    exception when others then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', false, 'loi', sqlerrm, 'dau_de', left(coalesce(x->>'noi_dung', ''), 60)));
      v_loi := v_loi + 1;
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'them_cau', jsonb_build_object('so_cau', jsonb_array_length(p_ds)),
          jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$
;
-- fn_phien_bd_ghi(p_phien uuid, p_viec text, p_ts jsonb)
CREATE OR REPLACE FUNCTION public.fn_phien_bd_ghi(p_phien uuid, p_viec text, p_ts jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_p claude_phien; b text; v_vung boolean; v_khoi text;
  v_id text; v_id2 text; v_kq jsonb; v_ten text; v_mo_ta text; v_loai text;
  v_ids text[]; v_i integer; v_cha text; v_n integer; v_set text[] := '{}';
begin
  v_p := public._phien_bd_vao(p_phien);
  -- 04/11: phiên của nhân sự (không phải trưởng khối) chỉ THÊM câu + XẾP câu vào dạng có sẵn — không đổi bản đồ.
  if not v_p.sua_cau_truc then
    raise exception 'Phiên này của nhân sự: chỉ đưa bài tập vào kho và xếp vào dạng có sẵn. Thiếu dạng thì báo "thieu" để trưởng khối thêm.';
  end if;
  -- 05/11 (Thùy): trưởng khối làm ĐỦ mọi việc với bản đồ khối mình trong MỌI loại phiên — loại phiên chỉ là nhãn việc.
  v_khoi := v_p.khoi;
  select bang, co_vung into b, v_vung from public._phien_bdm_bang(v_p.mon);
  p_ts := coalesce(p_ts, '{}'::jsonb);
  v_ten := nullif(trim(coalesce(p_ts->>'ten', '')), '');
  v_mo_ta := p_ts->>'mo_ta';

  if p_viec = 'them_chu_de' then
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    if v_vung then
      execute format('insert into %I (khoi, ten, nhanh) values ($1, $2, $3) returning id', b || 'chu_de')
        into v_id using v_khoi, v_ten, coalesce(nullif(p_ts->>'nhanh', ''), 'toan');
    else
      execute format('insert into %I (khoi, ten) values ($1, $2) returning id', b || 'chu_de') into v_id using v_khoi, v_ten;
    end if;
    v_kq := jsonb_build_object('chu_de_id', v_id);

  elsif p_viec = 'them_chuyen_de' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (ten, mo_ta) values ($1, $2) returning id', b || 'chuyen_de')
      into v_id using v_ten, coalesce(v_mo_ta, '');
    execute format('insert into %I (chu_de_id, chuyen_de_id) values ($1, $2)', b || 'o') using p_ts->>'chu_de_id', v_id;
    v_kq := jsonb_build_object('chuyen_de_id', v_id, 'chu_de_id', p_ts->>'chu_de_id');

  elsif p_viec = 'them_nhom' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (chu_de_id, chuyen_de_id, ten, mo_ta) values ($1, $2, $3, $4) returning id', b || 'nhom')
      into v_id using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('nhom_id', v_id);

  elsif p_viec = 'them_dang_bai' then
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (nhom_id, ten, mo_ta) values ($1, $2, $3) returning id', b || 'dang_bai')
      into v_id using p_ts->>'nhom_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('dang_bai_id', v_id);

  elsif p_viec = 'sua' then
    -- Chỉ tên + mô tả nhận biết. Lý thuyết / ví dụ thuộc loại việc 'ly_thuyet' (chưa mở). Mã không bao giờ đổi.
    v_loai := p_ts->>'loai';
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_khoi);
    if p_ts ? 'ten' then
      if v_ten is null then raise exception 'ten không được trống.'; end if;
      v_set := v_set || format('ten = %L', v_ten);
    end if;
    if p_ts ? 'mo_ta' then
      if v_loai = 'chu_de' then raise exception 'Chủ đề không có mô tả.'; end if;
      v_set := v_set || format('mo_ta = %L', coalesce(v_mo_ta, ''));
    end if;
    if cardinality(v_set) = 0 then raise exception 'Không có gì để sửa (chỉ sửa được ten, mo_ta).'; end if;
    execute format('update %I set %s where id = $1', b || v_loai, array_to_string(v_set, ', ')) using v_id;
    v_kq := jsonb_build_object('loai', v_loai, 'id', v_id);

  elsif p_viec = 'chuyen_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    execute format('update %I set chu_de_id = $2, chuyen_de_id = $3,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where chu_de_id = $2 and chuyen_de_id = $3)
                    where id = $1', b || 'nhom', b || 'nhom')
      using v_id, p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    v_kq := jsonb_build_object('nhom_id', v_id, 'chu_de_id', p_ts->>'chu_de_id', 'chuyen_de_id', p_ts->>'chuyen_de_id');

  elsif p_viec = 'chuyen_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    execute format('update %I set nhom_id = $2,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where nhom_id = $2)
                    where id = $1', b || 'dang_bai', b || 'dang_bai')
      using v_id, p_ts->>'nhom_id';
    v_kq := jsonb_build_object('dang_bai_id', v_id, 'nhom_id', p_ts->>'nhom_id');

  elsif p_viec = 'sap_xep' then
    -- Đặt lại thứ tự theo đúng mảng ids; mọi id phải cùng một cha và thuộc khối của phiên.
    v_loai := p_ts->>'loai';
    select array_agg(x) into v_ids from jsonb_array_elements_text(coalesce(p_ts->'ids', '[]'::jsonb)) x;
    if coalesce(cardinality(v_ids), 0) = 0 then raise exception 'Thiếu ids.'; end if;
    if v_loai = 'chu_de' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi); end loop;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'chu_de') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'o' then  -- thứ tự chuyên đề trong 1 chủ đề
      v_cha := p_ts->>'chu_de_id';
      perform public._phien_bd_kiem_khoi(b, 'chu_de', v_cha, v_khoi);
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $3 where chu_de_id = $1 and chuyen_de_id = $2', b || 'o') using v_cha, v_ids[v_i], v_i;
        get diagnostics v_n = row_count;
        if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', v_ids[v_i], v_cha; end if;
      end loop;
    elsif v_loai = 'nhom' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi); end loop;
      execute format('select count(distinct (chu_de_id, chuyen_de_id)) from %I where id = any($1)', b || 'nhom') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các nhóm không cùng một chuyên đề — sắp xếp từng chuyên đề một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'nhom') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'dang_bai' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi); end loop;
      execute format('select count(distinct nhom_id) from %I where id = any($1)', b || 'dang_bai') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các dạng bài không cùng một nhóm — sắp xếp từng nhóm một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'dang_bai') using v_ids[v_i], v_i;
      end loop;
    else
      raise exception 'sap_xep: loai phải là chu_de · o · nhom · dang_bai.';
    end if;
    v_kq := jsonb_build_object('loai', v_loai, 'so', cardinality(v_ids));

  -- 05/11 XOÁ (Thùy: trưởng khối có đủ quyền xử lý bản đồ) — cùng hàm màn sửa tay đang dùng. Nút còn câu đã gán thì DB báo số câu:
  -- chuyển câu đi (phan_dang) rồi xoá. Log bản đồ (*_bdm_log, trigger) giữ vết từng dòng xoá, actor = người mở phiên.
  elsif p_viec = 'xoa_chu_de' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi);
    execute format('select public.%I($1)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_chu_de' when b = 'lyhoa_bdm_' then 'fn_lyhoa_bdm_xoa_chu_de' else 'fn_bdm_xoa_chu_de' end) into v_kq using v_id;
    v_kq := jsonb_build_object('chu_de_id', v_id) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_chuyen_de' then
    v_id := p_ts->>'chu_de_id'; v_id2 := p_ts->>'chuyen_de_id';
    perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi);
    execute format('select public.%I($1, $2)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_o' when b = 'lyhoa_bdm_' then 'fn_lyhoa_bdm_xoa_o' else 'fn_bdm_xoa_o' end) into v_kq using v_id, v_id2;
    v_kq := jsonb_build_object('chu_de_id', v_id, 'chuyen_de_id', v_id2) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    execute format('select public.%I($1)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_nhom' when b = 'lyhoa_bdm_' then 'fn_lyhoa_bdm_xoa_nhom' else 'fn_bdm_xoa_nhom' end) into v_kq using v_id;
    v_kq := jsonb_build_object('nhom_id', v_id) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    execute format('select count(*) from %I where dang_bai_id = $1', case when b = 'khtn_bdm_' then 'khtn_bdm_gan_cau' when b = 'lyhoa_bdm_' then 'lyhoa_bdm_gan_cau' else 'dai_bdm_gan_cau' end)
      into v_n using v_id;
    if b = 'dai_bdm_' then v_n := v_n + (select count(*) from hgt_bdm_gan_cau where dang_bai_id = v_id); end if;
    if v_n > 0 then raise exception 'Dạng bài % còn % câu đã gán — chuyển câu sang dạng khác (phan_dang) rồi xoá.', v_id, v_n; end if;
    execute format('delete from %I where dang_bai_id = $1', b || 'de_xuat') using v_id;
    if b = 'dai_bdm_' then delete from hgt_bdm_de_xuat where dang_bai_id = v_id; end if;
    execute format('delete from %I where id = $1', b || 'dang_bai') using v_id;
    v_kq := jsonb_build_object('dang_bai_id', v_id, 'xoa', true);
  else
    raise exception 'Lệnh không có: % (them_chu_de · them_chuyen_de · them_nhom · them_dang_bai · sua · chuyen_nhom · chuyen_dang_bai · sap_xep · xoa_chu_de · xoa_chuyen_de · xoa_nhom · xoa_dang_bai).', p_viec;
  end if;

  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, p_viec, p_ts, v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $function$
;
-- _troly_ten_dang(p_ma text)
CREATE OR REPLACE FUNCTION public._troly_ten_dang(p_ma text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare r record; v text;
begin
  if p_ma is null then return null; end if;
  for r in select * from (values ('Toán', 'bdm'), ('Toán', null::text), ('Toán', 'hinh_gt'), ('Toán', 'hinh_hoc'), ('KHTN', null), ('Lý hóa', null)) t(mon, nhanh) loop
    execute format('select ten_dang from %I where ma_dang = $1 limit 1', public._kho_ban_do_tbl(r.mon, r.nhanh))
      into v using p_ma;
    if v is not null then return jsonb_build_object('mon', r.mon, 'ten', v); end if;
  end loop;
  return null;
end $function$
;
-- fn_troly_danh_muc()
CREATE OR REPLACE FUNCTION public.fn_troly_danh_muc()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  perform public._troly_gac();
  return $cat$[
  {"name":"hoc_tap_hoc_sinh",
   "mo_ta":"Hồ sơ học tập của MỘT học sinh theo tên: Elo, mastery (số dạng đạt/cần luyện/yếu + danh sách dạng yếu), điểm ET / BTVN / MT TỪNG BUỔI, điểm các kỳ thi, điểm danh, đánh giá + nhận xét sau buổi. Dùng cho mọi câu hỏi về 1 em cụ thể.",
   "tham_so":{"type":"object","properties":{
     "ten_hoc_sinh":{"type":"string","description":"Tên học sinh (hoặc mã HS), nguyên văn người dùng gõ, không dấu cũng được."},
     "ten_lop":{"type":"string","description":"Tên lớp nếu người dùng có nói, để phân biệt khi trùng tên."},
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Lý hóa"],"description":"Chỉ điền khi người dùng nói rõ môn."},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = 60 ngày gần nhất."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}},
     "required":["ten_hoc_sinh"]}},
  {"name":"ket_qua_lop",
   "mo_ta":"Kết quả của MỘT lớp theo từng buổi và từng học sinh, cho 1 loại: et (bài kiểm tra cuối buổi) | btvn (bài tập về nhà) | mt (kiểm tra định kỳ). ET, BTVN, MT là BA thứ khác nhau — chọn đúng loại người dùng hỏi.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string","description":"Tên lớp, vd 9A1."},
     "loai":{"type":"string","enum":["et","btvn","mt"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = 30 ngày gần nhất."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}},
     "required":["ten_lop","loai"]}},
  {"name":"tinh_trang_buoi",
   "mo_ta":"Tình trạng dữ liệu của các BUỔI HỌC trong một ngày hoặc khoảng ngày: buổi nào đã/chưa điểm danh, đã/chưa nhập ET, BTVN, đánh giá, MT; buổi nào bấm đóng mà không có dữ liệu (đóng khống, đóng không nhận xét); lớp nào có lịch mà chưa mở buổi. Dùng cho câu hỏi kiểu: hôm nay/hôm qua lớp nào còn thiếu gì, lớp nào chưa nhập BTVN, còn bao nhiêu buổi chưa đóng.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = bằng den_ngay (hỏi 1 ngày)."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_lop":{"type":"string"},"khoi":{"type":"string","description":"vd 8"},
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Lý hóa"]},
     "chi_buoi_co_van_de":{"type":"boolean","description":"true = chỉ liệt kê buổi thiếu/đóng khống. Bỏ trống: hỏi ≤7 ngày thì liệt kê hết, dài hơn thì chỉ buổi có vấn đề."}}}},
  {"name":"viec_van_hanh",
   "mo_ta":"Việc vận hành sau buổi học theo NGƯỜI (giáo viên, trợ giảng, trưởng khối): ai còn nợ khâu nào (đánh giá, chấm bài trên lớp, ET, BTVN, MT) của buổi nào, quá hạn hay chưa. Dùng cho câu hỏi: ai đang nợ việc, việc tuần trước chưa hoàn thành, việc quá hạn của một người hoặc một lớp.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "ten_lop":{"type":"string"},
     "tu_ngay":{"type":"string","description":"Ngày BUỔI HỌC, YYYY-MM-DD. Bỏ trống = 14 ngày trước den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "trang_thai":{"type":"string","enum":["chua_xong","qua_han","da_xong","tat_ca"],"description":"Bỏ trống = chua_xong."}}}},
  {"name":"viec_phat_trien",
   "mo_ta":"Việc phát triển (việc giao tay qua module Giao việc): đang mở, quá hạn, chờ nghiệm thu, đã xong — theo người làm, người giao, khoảng hạn.",
   "tham_so":{"type":"object","properties":{
     "ten_nguoi_lam":{"type":"string"},"ten_nguoi_giao":{"type":"string"},
     "trang_thai":{"type":"string","enum":["dang_mo","qua_han","cho_nghiem_thu","da_xong","tat_ca"],"description":"Bỏ trống = dang_mo."},
     "han_tu_ngay":{"type":"string","description":"Lọc theo HẠN của việc, YYYY-MM-DD."},
     "han_den_ngay":{"type":"string","description":"YYYY-MM-DD."}}}},
  {"name":"ket_qua_viec_thang",
   "mo_ta":"Kết quả việc vận hành của nhân viên trong MỘT tháng: số việc đạt / không đạt / chưa tới hạn, và danh sách việc không đạt kèm lý do (trễ, nợ quá hạn). Dùng cho câu hỏi về tình trạng làm việc, ai miss, ai làm tốt.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."}}}},
  {"name":"vang_hoc",
   "mo_ta":"Học sinh vắng (có phép / không phép) theo lớp, khối, môn trong khoảng ngày; kèm danh sách em vắng nhiều.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string"},"khoi":{"type":"string"},"mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Lý hóa"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = thứ Hai tuần này."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}}}},
  {"name":"thieu_btvn",
   "mo_ta":"Học sinh thiếu BTVN (không làm / nộp muộn / xin phép) theo lớp, khối, môn trong khoảng ngày, kèm từng buổi thiếu của từng em.",
   "tham_so":{"type":"object","properties":{
     "ten_lop":{"type":"string"},"khoi":{"type":"string"},"mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Lý hóa"]},
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = thứ Hai tuần này."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."}}}},
  {"name":"bo_tro",
   "mo_ta":"Tình hình bổ trợ. loai = bu (lượt vắng và tình trạng xếp bù) | duoi (đợt học đuổi đang mở, tiến độ) | yeu (case bổ trợ yếu đang xử, kết quả case đã đóng). Có thể hỏi riêng 1 học sinh.",
   "tham_so":{"type":"object","properties":{
     "loai":{"type":"string","enum":["bu","duoi","yeu"]},
     "ten_hoc_sinh":{"type":"string"},"ten_lop":{"type":"string","description":"Để phân biệt khi trùng tên HS."},
     "tu_ngay":{"type":"string","description":"Chỉ dùng cho loai=bu: lượt vắng từ ngày này. Bỏ trống = 30 ngày gần nhất."}},
     "required":["loai"]}},
  {"name":"hoc_phi_hoc_sinh",
   "mo_ta":"Học phí của MỘT học sinh trong 1 tháng: chi tiết theo lớp (số buổi, đơn giá, học liệu, học đuổi, thành tiền) và hoá đơn của phụ huynh.",
   "tham_so":{"type":"object","properties":{
     "ten_hoc_sinh":{"type":"string"},"ten_lop":{"type":"string"},
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."}},
     "required":["ten_hoc_sinh"]}},
  {"name":"hoc_phi_no",
   "mo_ta":"Danh sách hoá đơn học phí CHƯA THU ĐỦ (chưa thu / thu một phần / quá hạn) theo phụ huynh, tổng theo kỳ.",
   "tham_so":{"type":"object","properties":{
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = mọi kỳ còn nợ."}}}},
  {"name":"tuyen_sinh",
   "mo_ta":"Tuyển sinh: đếm ứng viên theo level và trạng thái; chuỗi test đầu vào (test → scan → chấm → trả kết quả) và danh sách ca đang kẹt ở khâu nào, ai dự kiến chấm/trả.",
   "tham_so":{"type":"object","properties":{
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Lý hóa"]},"khoi":{"type":"string"}}}},
  {"name":"xep_hang",
   "mo_ta":"Bảng xếp hạng Elo + EXP của học sinh đang học, lọc theo môn / khối / lớp.",
   "tham_so":{"type":"object","properties":{
     "mon":{"type":"string","enum":["Toán","Văn","Anh","KHTN","Lý hóa"]},"khoi":{"type":"string"},"ten_lop":{"type":"string"},
     "top":{"type":"integer","description":"Số dòng, mặc định 20, tối đa 50."}}}}
  ]$cat$::jsonb;
end $function$
;
