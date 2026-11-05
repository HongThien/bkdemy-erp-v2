-- ============================================================================
-- 202611051726 — phien_truong_khoi_du_quyen
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 — "trưởng khối phải có đủ mọi quyền để xử lý bản đồ kiến thức, sao m cứ chặn này chặn kia".
--   Luật "không xoá" (04/11) là cho NHÂN SỰ; trưởng khối (người mở phiên) được làm đủ. Chốt còn giữ: đúng trưởng khối trở lên,
--   đúng khối (chuyên đề dùng chung thì phải quản mọi khối dùng nó), dữ liệu hợp lệ.
-- GỠ: (1) loại phiên không còn chặn việc — Lý thuyết đổi cấu trúc được, Bản đồ ghi lý thuyết được, lệnh kho chạy ở mọi phiên;
--   (2) bỏ "mỗi bản đồ một phiên" (mở mới + mở lại); (3) chuyên đề dùng chung sửa được nếu quản đủ các khối;
--   (4) câu NGƯỜI đã quyết: trưởng khối bảo thì Claude ghi đè được (cờ "ghi_de": true từng câu trong phan_dang).
-- THÊM: lệnh xoá xoa_chu_de · xoa_chuyen_de · xoa_nhom · xoa_dang_bai — gọi đúng hàm xoá màn sửa tay đang dùng.
-- MẤT GÌ: không xoá/drop gì lúc áp. Viết lại (create or replace) fn_phien_bd_ghi · fn_phien_lt_ghi · _phien_kho_vao · fn_phien_mo ·
--   fn_phien_mo_lai · _phien_bd_kiem_khoi · _phien_kho_phan1 · fn_phien_kho_phan — MỞ RỘNG việc trưởng khối làm được qua phiên.
-- ============================================================================

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
    execute format('select public.%I($1)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_chu_de' else 'fn_bdm_xoa_chu_de' end) into v_kq using v_id;
    v_kq := jsonb_build_object('chu_de_id', v_id) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_chuyen_de' then
    v_id := p_ts->>'chu_de_id'; v_id2 := p_ts->>'chuyen_de_id';
    perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi);
    execute format('select public.%I($1, $2)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_o' else 'fn_bdm_xoa_o' end) into v_kq using v_id, v_id2;
    v_kq := jsonb_build_object('chu_de_id', v_id, 'chuyen_de_id', v_id2) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    execute format('select public.%I($1)', case when b = 'khtn_bdm_' then 'fn_khtn_bdm_xoa_nhom' else 'fn_bdm_xoa_nhom' end) into v_kq using v_id;
    v_kq := jsonb_build_object('nhom_id', v_id) || coalesce(v_kq, '{}'::jsonb);
  elsif p_viec = 'xoa_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    execute format('select count(*) from %I where dang_bai_id = $1', case when b = 'khtn_bdm_' then 'khtn_bdm_gan_cau' else 'dai_bdm_gan_cau' end)
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
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_lt_ghi(p_phien uuid, p_ts jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_p claude_phien; b text; v_cu text; v_kq jsonb;
  v_loai text := p_ts->>'loai'; v_id text := p_ts->>'id'; v_truong text := p_ts->>'truong'; v_nd text := p_ts->>'noi_dung';
begin
  v_p := public._phien_bd_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  if not ((v_loai, v_truong) in (('chuyen_de', 'mo_ta'), ('nhom', 'mo_ta'), ('nhom', 'ly_thuyet'),
                                 ('dang_bai', 'mo_ta'), ('dang_bai', 'ly_thuyet'), ('dang_bai', 'vi_du'))) then
    raise exception 'Không ghi được ô "%" của "%". Ô cho phép: chuyen_de.mo_ta · nhom.mo_ta|ly_thuyet · dang_bai.mo_ta|ly_thuyet|vi_du.',
      coalesce(v_truong, '?'), coalesce(v_loai, '?');
  end if;
  if nullif(trim(coalesce(v_nd, '')), '') is null then
    raise exception 'Không ghi nội dung trống — xoá trắng một ô là việc trưởng khối làm tay trên màn Bản đồ.';
  end if;
  perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_p.khoi);
  execute format('select %I from %I where id = $1 for update', v_truong, b || v_loai) into v_cu using v_id;
  if coalesce(v_cu, '') <> '' and coalesce(p_ts->>'md5_cu', '') <> md5(v_cu) then
    raise exception 'Ô % của % % đang có nội dung (% ký tự) nhưng md5_cu không khớp bản hiện tại — có thể trưởng khối vừa sửa tay. Đọc lại bằng lệnh doc rồi gửi lại kèm md5_cu mới.',
      v_truong, v_loai, v_id, length(v_cu);
  end if;
  v_kq := jsonb_build_object('loai', v_loai, 'id', v_id, 'truong', v_truong, 'cu_ky_tu', length(coalesce(v_cu, '')), 'moi_ky_tu', length(v_nd));
  if coalesce(v_cu, '') = v_nd then return jsonb_build_object('ok', true, 'khong_doi', true) || v_kq; end if;
  execute format('update %I set %I = $2 where id = $1', b || v_loai, v_truong) using v_id, v_nd;
  -- Vết không chép cả nội dung (đã nằm trọn trong *_bdm_log cũ/mới) — chỉ ô nào, dài bao nhiêu.
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'ghi_noi_dung', jsonb_build_object('loai', v_loai, 'id', v_id, 'truong', v_truong), v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $function$;

CREATE OR REPLACE FUNCTION public._phien_kho_vao(p_phien uuid)
 RETURNS claude_phien
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  v_p := public._phien_bd_vao(p_phien);
  if not (v_p.mon = any (public._phien_kho_mon())) then raise exception 'Môn % chưa nối luồng phân dạng câu vào bản đồ mới (mới có Toán: Đại + HGT).', v_p.mon; end if;
  return v_p;
end $function$;

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
  -- 04/11 (Thùy sửa lại): mọi loại phiên — kể cả Nhập kho — chỉ trưởng khối trở lên (người có Phòng làm việc).
  if not v_tk then
    raise exception 'Chỉ trưởng khối trở lên của % khối % mới mở phiên được.', p_mon, p_khoi;
  end if;
  if p_loai = 'nhap_kho' and not (p_mon = any (public._phien_kho_mon())) then
    raise exception 'Môn % chưa nối luồng phân dạng câu vào bản đồ mới (mới có Toán) — chưa mở phiên Nhập kho được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and not exists (select 1 from public._phien_bdm_bang(p_mon)) then
    raise exception 'Môn % chưa có bản đồ mới trên hệ — chưa mở phiên này được.', p_mon;
  end if;
  -- 05/11 (Thùy): bỏ "mỗi bản đồ một phiên sửa" — trưởng khối mở bao nhiêu phiên cũng được (lý thuyết ghi đè vẫn kiểm md5).
  v_ten := coalesce(nullif(trim(p_tieu_de), ''),
    case p_loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết dạng' when 'nhap_kho' then 'Nhập kho & phân dạng'
                when 'bao_sai' then 'Câu bị báo sai' else 'Giải bài' end
    || ' · ' || p_mon || ' ' || p_khoi);
  insert into claude_phien (loai, mon, khoi, tieu_de, nguoi_mo, nhan_su_id, sua_cau_truc)
  values (p_loai, p_mon, p_khoi, v_ten, public.jwt_uid(), v_ns, v_tk)
  returning id into v_id;
  return v_id;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_mo_lai(p_phien uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien for update;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'dong' then return; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  update claude_phien set trang_thai = 'mo' where id = p_phien;
end $function$;

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
                   case when p_bang = 'khtn_bdm_' then 'KHTN' else 'Toán' end, p_bang || 'o', p_bang || 'chu_de') into v_ok using p_id;
    if not v_ok then raise exception 'Chuyên đề % dùng chung với khối bạn không quản — nhờ trưởng khối đó hoặc cấp trên.', p_id; end if;
    return;
  end if;
  if v <> p_khoi then raise exception '% % thuộc khối %, ngoài phạm vi phiên (khối %).', p_loai, p_id, v, p_khoi; end if;
end $function$;

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
  if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then raise exception 'Câu % không thuộc môn % của phiên.', p_ma_cau, p_p.mon; end if;
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
  elsif p_ket_qua in ('cao', 'vua') then
    select cd.id into v_cd
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi and cd.nhanh = r.vung;
    if v_cd is null then raise exception 'Dạng bài % không thuộc vùng % của khối % (câu % là nhánh %).', coalesce(p_dang_bai, '?'), r.vung, p_p.khoi, p_ma_cau, r.nhanh; end if;
  end if;

  if p_ket_qua = 'cao' then
    if r.nhanh = 'khtn' then
      perform public._khtn_bdm_gan(p_ma_cau, p_dang_bai, 'ai');   -- KHTN: bản sao đi theo câu gốc (cùng hàm màn KHTN)
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
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_phan(p_phien uuid, p_ds jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_mot jsonb; v_ok integer := 0; v_loi integer := 0;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu: [{"ma_cau":..,"ket_qua":"cao|vua|thieu","dang_bai_id":..,"ly_do":..,"chu_de_id":<chỉ khi thieu, tuỳ chọn>}]'; end if;
  if jsonb_array_length(p_ds) > 50 then raise exception 'Mỗi lô tối đa 50 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      perform set_config('phien.ghi_de', case when (x->>'ghi_de')::boolean then 'on' else '' end, true);
      v_mot := public._phien_kho_phan1(v_p, x->>'ma_cau', x->>'ket_qua', x->>'dang_bai_id', x->>'ly_do', x->>'chu_de_id');
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true) || v_mot);
      v_ok := v_ok + 1;
    exception when others then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', false, 'ma_cau', x->>'ma_cau', 'loi', sqlerrm));
      v_loi := v_loi + 1;
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'phan_dang',
          jsonb_build_object('so_cau', jsonb_array_length(p_ds),
                             'cao', (select count(*) from jsonb_array_elements(p_ds) e where e->>'ket_qua' = 'cao'),
                             'vua', (select count(*) from jsonb_array_elements(p_ds) e where e->>'ket_qua' = 'vua'),
                             'thieu', (select count(*) from jsonb_array_elements(p_ds) e where e->>'ket_qua' = 'thieu')),
          jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$;
