-- ============================================================================
-- 202611041633 — phien_nhan_su_dua_bai_vao_kho
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 04/11 — "t cần nhân sự có quyền dùng Claude để đưa bài tập vào bản đồ và kho" (thêm được, không xoá).
--   Trước: phiên Claude chỉ trưởng khối trở lên mở được, và Claude chỉ XẾP câu đã có trong kho — không thêm được bài tập mới.
-- CÁCH:
--   • claude_phien.sua_cau_truc (true = người mở là trưởng khối trở lên lúc mở phiên). Phiên cũ = true.
--   • fn_phien_mo: loại 'nhap_kho' mở cho MỌI nhân sự; loại khác giữ trưởng khối trở lên. "Mỗi bản đồ một phiên sửa" chỉ tính
--     phiên sua_cau_truc ⇒ nhiều nhân sự nhập song song, không chặn trưởng khối.
--   • _phien_bd_vao: phiên của nhân sự kiểm "còn là nhân sự đang làm"; phiên trưởng khối kiểm như cũ.
--   • fn_phien_bd_ghi (thêm/sửa/chuyển/xếp bản đồ): phiên của nhân sự bị chặn — thiếu dạng thì Claude báo 'thieu' cho trưởng khối.
--   • fn_phien_kho_them (MỚI): Claude đưa bài tập mới vào kho qua đúng fn_bdm_nhap_cau, lọc trùng, rồi xếp bằng _phien_kho_phan1.
--   • fn_phien_pham_vi: thêm khối nhân sự mở được (tk = false).
-- MẤT GÌ: không xoá/drop gì. Thêm 1 cột. Viết lại (create or replace) fn_phien_mo · _phien_bd_vao · fn_phien_bd_ghi · fn_phien_pham_vi.
-- ============================================================================

alter table claude_phien add column if not exists sua_cau_truc boolean not null default true;

CREATE OR REPLACE FUNCTION public.fn_phien_mo(p_loai text, p_mon text, p_khoi text, p_tieu_de text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_id uuid; v_ns uuid := public.current_nhan_su_id(); v_ten text;
  v_dang record; v_tk boolean;
begin
  if v_ns is null or public.jwt_uid() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự.'; end if;
  if not (p_loai = any (public._phien_loai_dang_mo())) then
    raise exception 'Loại việc "%" chưa mở trong bản thử.', p_loai;
  end if;
  v_tk := public._truong_khoi_tro_len(p_mon, p_khoi);
  -- 04/11 (Thùy): NHÂN SỰ được mở phiên Nhập kho (đưa bài tập vào kho + xếp vào dạng có sẵn); loại khác vẫn trưởng khối trở lên.
  if not v_tk and p_loai <> 'nhap_kho' then
    raise exception 'Chỉ trưởng khối trở lên của % khối % mới mở phiên được.', p_mon, p_khoi;
  end if;
  if p_loai = 'nhap_kho' and not (p_mon = any (public._phien_kho_mon())) then
    raise exception 'Môn % chưa nối luồng phân dạng câu vào bản đồ mới (mới có Toán) — chưa mở phiên Nhập kho được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and not exists (select 1 from public._phien_bdm_bang(p_mon)) then
    raise exception 'Môn % chưa có bản đồ mới trên hệ — chưa mở phiên này được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and v_tk then
    -- Khoá theo (môn, khối) trong transaction: hai người bấm mở cùng lúc thì người sau chờ rồi thấy phiên của người trước.
    -- Chặn bằng khoá thay vì thêm index một-phiên cho mỗi loại việc mới.
    perform pg_advisory_xact_lock(hashtext('claude_phien:' || p_mon || '|' || p_khoi));
    select p.id, p.loai, ns.ho_ten into v_dang
      from claude_phien p left join nhan_su ns on ns.id = p.nhan_su_id
     where p.loai = any (public._phien_loai_sua_ban_do()) and p.sua_cau_truc and p.mon = p_mon and p.khoi = p_khoi and p.trang_thai <> 'dong'
     limit 1;
    if found then
      raise exception 'Bản đồ % khối % đang có một phiên % mở (của %). Mỗi bản đồ chỉ một phiên sửa — vào phiên đó, hoặc đóng nó trước.',
        p_mon, p_khoi, case v_dang.loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết' else 'Nhập kho' end, coalesce(v_dang.ho_ten, '?');
    end if;
  end if;
  v_ten := coalesce(nullif(trim(p_tieu_de), ''),
    case p_loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết dạng' when 'nhap_kho' then 'Nhập kho & phân dạng'
                when 'bao_sai' then 'Câu bị báo sai' else 'Giải bài' end
    || ' · ' || p_mon || ' ' || p_khoi);
  insert into claude_phien (loai, mon, khoi, tieu_de, nguoi_mo, nhan_su_id, sua_cau_truc)
  values (p_loai, p_mon, p_khoi, v_ten, public.jwt_uid(), v_ns, v_tk)
  returning id into v_id;
  return v_id;
end $function$;

CREATE OR REPLACE FUNCTION public._phien_bd_vao(p_phien uuid)
 RETURNS claude_phien
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found then raise exception 'Không có phiên %.', p_phien; end if;
  if not (v_p.loai = any (public._phien_loai_sua_ban_do())) then
    raise exception 'Phiên này là loại "%" — không có lệnh bản đồ.', v_p.loai;
  end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng / đang đóng — không ghi được nữa.'; end if;
  -- ĐÓNG VAI người mở phiên trong transaction này: jwt_uid() / current_nhan_su_id() / trigger log đều thấy họ.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_p.nguoi_mo, 'role', 'authenticated')::text, true);
  if v_p.sua_cau_truc and not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Người mở phiên không còn là trưởng khối trở lên của % khối % — dừng.', v_p.mon, v_p.khoi;
  end if;
  if not v_p.sua_cau_truc and public.current_nhan_su_id() is null then
    raise exception 'Người mở phiên không còn là nhân sự đang làm — dừng.';
  end if;
  if not exists (select 1 from public._phien_bdm_bang(v_p.mon)) then
    raise exception 'Môn % chưa có bản đồ mới.', v_p.mon;
  end if;
  return v_p;
end $function$;

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
  -- Phiên Lý thuyết chỉ được đổi tên / mô tả. Phiên Bản đồ và Nhập kho được đổi cấu trúc (vòng xoáy Phase 3: thiếu dạng ⇒ thêm dạng).
  if v_p.loai = 'ly_thuyet' and p_viec <> 'sua' then
    raise exception 'Phiên Lý thuyết chỉ sửa tên / mô tả. Đổi cấu trúc (thêm, chuyển, sắp xếp) thì đóng phiên này và mở phiên Bản đồ.';
  end if;
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

  else
    raise exception 'Lệnh không có: % (them_chu_de · them_chuyen_de · them_nhom · them_dang_bai · sua · chuyen_nhom · chuyen_dang_bai · sap_xep). Không có lệnh xoá — đề xuất để trưởng khối xoá tay.', p_viec;
  end if;

  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, p_viec, p_ts, v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_pham_vi()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- tk = trưởng khối trở lên (mọi loại việc) · tk false = nhân sự: chỉ phiên Nhập kho, mọi khối của môn đã nối luồng kho (04/11)
  with tk as (select distinct p.mon, p.khoi from public.fn_pham_vi_cua_toi() p where p.vai in ('toan_he', 'quan_ly_mon', 'truong')),
  ns as (select m.mon, k.khoi from unnest(public._phien_kho_mon()) m(mon) cross join unnest(public._bdm_ds_khoi_chay()) k(khoi)
          where public.current_nhan_su_id() is not null and not exists (select 1 from tk where tk.mon = m.mon and tk.khoi = k.khoi)),
  ds as (select mon, khoi, true as la_tk from tk union all select mon, khoi, false from ns)
  select coalesce(jsonb_agg(jsonb_build_object('mon', d.mon, 'khoi', d.khoi, 'tk', d.la_tk,
                    'co_ban_do', exists (select 1 from public._phien_bdm_bang(d.mon)))
                  order by d.mon, coalesce(substring(d.khoi from '^[0-9]+')::int, 0), d.khoi), '[]'::jsonb)
    from ds d
$function$;

-- ── Claude đưa BÀI TẬP MỚI vào kho (phiên Nhập kho) — 04/11 ──────────────────
-- Một câu = {nhanh: 'dai'|'hgt', loai_cau, noi_dung, lua_chon?, menh_de?, dap_an?, loi_giai?, ten_de_goc?,
--            phan?: {ket_qua: 'cao'|'vua'|'thieu', dang_bai_id?, ly_do?, chu_de_id?}}
-- · Vào kho bằng ĐÚNG hàm màn Nhập kho đang dùng (fn_bdm_nhap_cau: dạng chờ của khối, mã = dạng chờ + STT, da_duyet = false).
-- · Lọc trùng như scripts/_kho_insert.mjs: noi_dung + lua_chon + menh_de (lower, bỏ khoảng trắng) so với kho chưa xoá ⇒ không thêm, trả mã cũ.
-- · Có `phan` ⇒ xếp ngay bằng _phien_kho_phan1 (cao = tự gán nguon ai · vua = chờ trưởng khối duyệt · thieu = báo thiếu dạng).
-- · Lời giải Claude viết ⇒ nguon_giai 'ai'. Không có lệnh xoá. Mỗi câu một savepoint; lô ≤ 20 câu.
create or replace function public.fn_phien_kho_them(p_phien uuid, p_ds jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_ok int := 0; v_trung int := 0; v_loi int := 0;
        v_nh text; v_tbl text; v_ma text; v_cu text; v_k text; v_phan jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu (xem tro-giup).'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lô tối đa 20 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      v_nh := coalesce(nullif(x->>'nhanh', ''), 'dai');
      if v_nh not in ('dai', 'hgt') then raise exception 'nhanh phải là dai hoặc hgt.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      execute format($q$select min(c.ma_cau) from %I c where c.xoa_at is null
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1$q$, v_tbl)
        into v_cu using v_k;
      if v_cu is not null then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'trung', true, 'ma_cau', v_cu));
        v_trung := v_trung + 1;
        continue;
      end if;
      v_ma := public.fn_bdm_nhap_cau(case v_nh when 'dai' then 'toan' else 'hgt' end, v_p.khoi,
                                     x || jsonb_build_object('nguon_giai', case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end),
                                     null, null);
      if nullif(trim(x->>'ten_de_goc'), '') is not null then
        execute format('update %I set ten_de_goc = $2 where ma_cau = $1', v_tbl) using v_ma, trim(x->>'ten_de_goc');
      end if;
      v_phan := null;
      if jsonb_typeof(x->'phan') = 'object' and x->>'loai_cau' <> 'dung_sai' then
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
end $$;
revoke execute on function public.fn_phien_kho_them(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.fn_phien_kho_them(uuid, jsonb) to service_role;
