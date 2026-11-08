-- ============================================================================
-- 202611012151 — PHIÊN CLAUDE · Phase 3: loại việc NHẬP KHO & PHÂN DẠNG (spec-phong-truong-khoi.md §2)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 01/11): "Claude chắc chắn thì tự duyệt, chấp nhận một phần sai sót, hậu kiểm sau. Làm tiếp phase 3."
--   Phase 3 = xếp câu ĐÃ CÓ trong kho của khối vào dạng bài của bản đồ mới. Câu Claude chắc ⇒ TỰ GÁN (không chờ người);
--   câu không chắc / không có dạng hợp ⇒ hàng của trưởng khối; trưởng khối sửa mô tả / thêm dạng ⇒ bảo Claude phân lại;
--   lặp tới khi hết câu chưa phân. Hậu kiểm = kiểm mẫu ~10% câu Claude tự gán (hàng 'mau' sẵn có) + báo sai về sau.
--
--   DÙNG LẠI NGUYÊN luồng "khớp bản đồ mới" B3/B4 (mig 202610161046 · 202610221734), KHÔNG đẻ bảng mới — luồng đó đã
--   chốt đúng luật này 16/10: *"mức cao (AI chắc) = coi như đã gán (gan_cau nguon='ai'); chấp nhận ~1,3% sai, sửa hậu
--   kiểm bằng kiểm mẫu; chưa chắc ⇒ kho tạm (de_xuat); bản đồ thiếu dạng ⇒ cau_thieu_dang"*. Trưởng khối duyệt ở chỗ
--   sẵn có: màn Bản đồ mới › Duyệt kho (fn_bdm_khop_*), hoặc ra lệnh cho Claude trong phiên.
--
--   ⚠ Đưa câu MỚI từ tài liệu vào kho (giải + ghi câu) KHÔNG nằm ở đây — đó là việc Thùy PHÁT ĐỘNG (kho-rules dây chuyền),
--   chưa giao (Thùy 01/11). Phiên này xếp những câu đã có.
--
--   Câu của Toán đi 2 nhánh kho (Đại dai_cau_hoi · Hình giải tích hgt_cau_hoi) cùng đổ vào bản đồ dai_bdm_* ⇒ dispatch
--   theo câu qua 1 registry `_phien_kho_nhanh`. Luật ghi:
--     · chỉ CÂU GỐC (bản sao đi theo gốc — _bdm_cau_giai), không câu Đúng/Sai (xếp theo chủ đề, đường kho_ds riêng),
--       câu phải thuộc ĐÚNG khối của phiên (khối của bản đồ cũ theo dang_chinh, như fn_bdm_khop_quyet);
--     · dạng đích phải thuộc khối + đúng vùng (Đại → chủ đề vùng 'toan', HGT → 'hgt');
--     · KHÔNG đụng câu NGƯỜI đã quyết (gán nguon='nguoi', hoặc đã kiểm mẫu) — đó là quyết định của người;
--     · 'cao' ⇒ gán nguon='ai' (xoá đề xuất/thiếu dạng cũ) · 'vua' ⇒ đề xuất (bỏ gán AI cũ nếu có — Claude phân lại sau khi
--       mô tả đổi mà thấy không còn chắc) · 'thieu' ⇒ báo thiếu dạng (bắt buộc lý do).
--   Một khối chỉ MỘT phiên sửa bản đồ: Nhập kho vào nhóm đó (được thêm dạng / sửa mô tả ngay trong vòng xoáy). Thay vì
--   thêm index cho mỗi loại, mở phiên khoá theo (môn, khối) bằng pg_advisory_xact_lock.
--
--   Phân quyền duyệt khớp `_bdm_duyet_duoc` đang đọc bảng giao tay `dai_bdm_duyet_pham_vi` (nguồn phạm vi thứ hai) ⇒
--   THÊM vế "trưởng khối trở lên của Toán khối đó" (một nguồn `_truong_khoi_tro_len`, spec-truong-khoi) — chỉ mở thêm,
--   không bớt quyền ai.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. Thay thân fn_phien_mo / fn_phien_mo_lai / fn_phien_bd_ghi / _phien_loai_* /
--   _bdm_duyet_duoc (cùng chữ ký, chỉ mở rộng), thêm 7 hàm. Lệnh 'vua' xoá dòng gán nguon='ai' của chính AI khi Claude
--   phân lại — đúng đường fn_bdm_khop_quyet vẫn xoá đề xuất; dòng gán của NGƯỜI không bao giờ bị đụng.
-- ============================================================================

create or replace function public._phien_loai_dang_mo()
returns text[] language sql immutable as $$ select array['ban_do', 'ly_thuyet', 'nhap_kho'] $$;
create or replace function public._phien_loai_sua_ban_do()
returns text[] language sql immutable as $$ select array['ban_do', 'ly_thuyet', 'nhap_kho'] $$;

-- Duyệt khớp: thêm trưởng khối trở lên (Toán — bảng dai_bdm_* là bản đồ của môn Toán).
create or replace function public._bdm_duyet_duoc(p_khoi text, p_chu_de text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select la_admin from my_quyen()), false)
      or public._truong_khoi_tro_len('Toán', p_khoi)
      or exists (
        select 1 from dai_bdm_duyet_pham_vi v
         where v.tai_khoan_id = jwt_uid() and v.khoi = p_khoi
           and (v.chu_de_id = p_chu_de
                or (v.chu_de_id is null
                    and not exists (select 1 from dai_bdm_duyet_pham_vi w where w.khoi = p_khoi and w.chu_de_id = p_chu_de)))
      )
      or (not exists (select 1 from dai_bdm_duyet_pham_vi v where v.tai_khoan_id = jwt_uid())
          and co_quyen_ghi('duyetloigiai'))
$$;

create or replace function public.fn_phien_mo(p_loai text, p_mon text, p_khoi text, p_tieu_de text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_ns uuid := public.current_nhan_su_id(); v_ten text;
  v_dang record;
begin
  if v_ns is null or public.jwt_uid() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự.'; end if;
  if not (p_loai = any (public._phien_loai_dang_mo())) then
    raise exception 'Loại việc "%" chưa mở trong bản thử.', p_loai;
  end if;
  if not public._truong_khoi_tro_len(p_mon, p_khoi) then
    raise exception 'Chỉ trưởng khối trở lên của % khối % mới mở phiên được.', p_mon, p_khoi;
  end if;
  if p_loai = 'nhap_kho' and not (p_mon = any (public._phien_kho_mon())) then
    raise exception 'Môn % chưa nối luồng phân dạng câu vào bản đồ mới (mới có Toán) — chưa mở phiên Nhập kho được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and not exists (select 1 from public._phien_bdm_bang(p_mon)) then
    raise exception 'Môn % chưa có bản đồ mới trên hệ — chưa mở phiên này được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) then
    -- Khoá theo (môn, khối) trong transaction: hai người bấm mở cùng lúc thì người sau chờ rồi thấy phiên của người trước.
    -- Chặn bằng khoá thay vì thêm index một-phiên cho mỗi loại việc mới.
    perform pg_advisory_xact_lock(hashtext('claude_phien:' || p_mon || '|' || p_khoi));
    select p.id, p.loai, ns.ho_ten into v_dang
      from claude_phien p left join nhan_su ns on ns.id = p.nhan_su_id
     where p.loai = any (public._phien_loai_sua_ban_do()) and p.mon = p_mon and p.khoi = p_khoi and p.trang_thai <> 'dong'
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
  insert into claude_phien (loai, mon, khoi, tieu_de, nguoi_mo, nhan_su_id)
  values (p_loai, p_mon, p_khoi, v_ten, public.jwt_uid(), v_ns)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_phien_mo_lai(p_phien uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien for update;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'dong' then return; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if v_p.loai = any (public._phien_loai_sua_ban_do()) then
    perform pg_advisory_xact_lock(hashtext('claude_phien:' || v_p.mon || '|' || v_p.khoi));
  end if;
  if v_p.loai = any (public._phien_loai_sua_ban_do())
     and exists (select 1 from claude_phien where loai = any (public._phien_loai_sua_ban_do()) and mon = v_p.mon and khoi = v_p.khoi
                  and trang_thai <> 'dong' and id <> p_phien) then
    raise exception 'Bản đồ % khối % đang có phiên sửa khác mở — đóng phiên đó trước.', v_p.mon, v_p.khoi;
  end if;
  update claude_phien set trang_thai = 'mo' where id = p_phien;
end $$;

create or replace function public.fn_phien_bd_ghi(p_phien uuid, p_viec text, p_ts jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_p claude_phien; b text; v_vung boolean; v_khoi text;
  v_id text; v_id2 text; v_kq jsonb; v_ten text; v_mo_ta text; v_loai text;
  v_ids text[]; v_i integer; v_cha text; v_n integer; v_set text[] := '{}';
begin
  v_p := public._phien_bd_vao(p_phien);
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
end $$;

-- Môn đã nối luồng phân dạng câu vào bản đồ mới (thêm môn = thêm phần tử + dòng ở _phien_kho_nhanh_ds).
create or replace function public._phien_kho_mon()
returns text[] language sql immutable as $$ select array['Toán'] $$;

-- ── REGISTRY nhánh kho của một câu (Toán: Đại · HGT cùng đổ vào bản đồ dai_bdm_*) ───────────────────
-- Thêm nhánh = thêm 1 dòng. ma_cau giữa các nhánh không trùng (đã đo 22/10: 0 giao).
create or replace function public._phien_kho_nhanh_ds()
returns table (nhanh text, cau text, ban_do_cu text, gan text, de_xuat text, thieu text, kiem_mau text, vung text) language sql immutable as $$
  select * from (values
    ('dai', 'dai_cau_hoi', 'dai_ban_do', 'dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'dai_bdm_cau_thieu_dang', 'dai_bdm_kiem_mau', 'toan'),
    ('hgt', 'hgt_cau_hoi', 'hgt_ban_do', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', 'hgt_bdm_cau_thieu_dang', 'hgt_bdm_kiem_mau', 'hgt')
  ) r(nhanh, cau, ban_do_cu, gan, de_xuat, thieu, kiem_mau, vung)
$$;

-- Vào phiên Nhập kho: đúng loại + điều kiện chung của _phien_bd_vao (mở · đóng vai · quyền · môn có bản đồ).
create or replace function public._phien_kho_vao(p_phien uuid)
returns claude_phien language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  v_p := public._phien_bd_vao(p_phien);
  if v_p.loai <> 'nhap_kho' then raise exception 'Lệnh kho chỉ dùng trong phiên Nhập kho & phân dạng.'; end if;
  if not (v_p.mon = any (public._phien_kho_mon())) then raise exception 'Môn % chưa nối luồng phân dạng câu vào bản đồ mới (mới có Toán: Đại + HGT).', v_p.mon; end if;
  return v_p;
end $$;

-- ĐỌC: đếm các hàng + một trang câu — chính hàm màn Duyệt kho dùng (cùng số với người nhìn trên màn).
create or replace function public.fn_phien_kho_tong(p_phien uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  v_p := public._phien_kho_vao(p_phien);
  return jsonb_build_object('khoi', v_p.khoi, 'dem', public.fn_bdm_khop_dem(v_p.khoi));
end $$;

create or replace function public.fn_phien_kho_hang(p_phien uuid, p_hang text, p_limit integer default 20, p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  v_p := public._phien_kho_vao(p_phien);
  if p_hang not in ('trong', 'de_xuat', 'thieu', 'mau') then raise exception 'hang phải là trong · de_xuat · thieu · mau.'; end if;
  return public.fn_bdm_khop_hang(v_p.khoi, p_hang, least(greatest(coalesce(p_limit, 20), 1), 50), greatest(coalesce(p_offset, 0), 0));
end $$;

-- Câu ĐANG nằm trong một dạng bài (để rà lại câu Claude đã tự gán khi mô tả dạng đổi) — đúng hàm ngăn 📚 Kho câu của màn Bản đồ mới.
create or replace function public.fn_phien_kho_dang(p_phien uuid, p_dang_bai text, p_limit integer default 30, p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  v_p := public._phien_kho_vao(p_phien);
  perform public._phien_bd_kiem_khoi('dai_bdm_', 'dang_bai', p_dang_bai, v_p.khoi);
  return coalesce((select jsonb_agg(to_jsonb(r)) from public.fn_bdm_kho_cau('dang_bai', p_dang_bai, 'tat_ca',
                     least(greatest(coalesce(p_limit, 30), 1), 50), greatest(coalesce(p_offset, 0), 0)) r), '[]'::jsonb);
end $$;

-- GHI: phân 1 câu. p_ket_qua: 'cao' (tự gán) · 'vua' (đề xuất, chờ trưởng khối) · 'thieu' (bản đồ thiếu dạng).
create or replace function public._phien_kho_phan1(p_p claude_phien, p_ma_cau text, p_ket_qua text, p_dang_bai text, p_ly_do text, p_chu_de text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  r record; v_q jsonb; v_khoi text; v_gan_nguon text; v_gan_db text; v_mau boolean; v_cd text; v_ly text := btrim(coalesce(p_ly_do, ''));
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    exit when v_q is not null;
  end loop;
  if v_q is null then raise exception 'Không có câu %.', p_ma_cau; end if;
  if v_q->>'xoa_at' is not null then raise exception 'Câu % đang ở kho rác.', p_ma_cau; end if;
  if v_q->>'parent_ma_cau' is not null then raise exception 'Câu % là bản sao của % — phân câu gốc, bản sao tự đi theo.', p_ma_cau, v_q->>'parent_ma_cau'; end if;
  if v_q->>'loai_cau' = 'dung_sai' then raise exception 'Câu % là Đúng/Sai — xếp theo chủ đề (đường riêng), không xếp theo dạng.', p_ma_cau; end if;
  execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
  if v_khoi is distinct from p_p.khoi then raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi; end if;

  execute format('select nguon, dang_bai_id from %I where ma_cau = $1', r.gan) into v_gan_nguon, v_gan_db using p_ma_cau;
  execute format('select exists (select 1 from %I where ma_cau = $1)', r.kiem_mau) into v_mau using p_ma_cau;
  if v_gan_nguon is not null and (v_gan_nguon <> 'ai' or v_mau) then
    raise exception 'Câu % đã được NGƯỜI quyết (gán dạng / kiểm mẫu) — Claude không đổi. Muốn đổi thì trưởng khối làm ở màn Duyệt kho.', p_ma_cau;
  end if;

  if p_ket_qua in ('cao', 'vua') then
    select cd.id into v_cd
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = p_p.khoi and cd.nhanh = r.vung;
    if v_cd is null then raise exception 'Dạng bài % không thuộc vùng % của khối % (câu % là nhánh %).', coalesce(p_dang_bai, '?'), r.vung, p_p.khoi, p_ma_cau, r.nhanh; end if;
  end if;

  if p_ket_qua = 'cao' then
    execute format($q$insert into %I (ma_cau, dang_bai_id, nguon) values ($1, $2, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.gan)
      using p_ma_cau, p_dang_bai;
    execute format('delete from %I where ma_cau = $1', r.de_xuat) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'vua' then
    if v_ly = '' then raise exception 'Đề xuất (chưa chắc) phải kèm lý do phân vân.'; end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.gan) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, dang_bai_id, chac, ly_do, nguon) values ($1, $2, 'vua', $3, 'ai')
                     on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, chac = 'vua', ly_do = excluded.ly_do, nguon = 'ai', at = now()$q$, r.de_xuat)
      using p_ma_cau, p_dang_bai, v_ly;
    execute format('delete from %I where ma_cau = $1', r.thieu) using p_ma_cau;
  elsif p_ket_qua = 'thieu' then
    if v_ly = '' then raise exception 'Báo thiếu dạng phải kèm lý do (câu này hỏi gì mà bản đồ chưa có).'; end if;
    -- chủ đề của hàng "thiếu": chủ đề Claude nêu (nếu có, phải đúng khối + vùng) — để trưởng khối thấy câu ở đúng chỗ.
    if p_chu_de is not null then
      select cd.id into v_cd from dai_bdm_chu_de cd where cd.id = p_chu_de and cd.khoi = p_p.khoi and cd.nhanh = r.vung;
      if v_cd is null then raise exception 'Chủ đề % không thuộc vùng % của khối %.', p_chu_de, r.vung, p_p.khoi; end if;
    end if;
    execute format('delete from %I where ma_cau = $1 and nguon = ''ai''', r.gan) using p_ma_cau;
    execute format('delete from %I where ma_cau = $1', r.de_xuat) using p_ma_cau;
    execute format($q$insert into %I (ma_cau, chu_de_id, ly_do, nguon) values ($1, $2, $3, 'ai')
                     on conflict (ma_cau) do update set chu_de_id = excluded.chu_de_id, ly_do = excluded.ly_do, nguon = 'ai', actor = public.jwt_uid(), at = now()$q$, r.thieu)
      using p_ma_cau, v_cd, v_ly;
  else
    raise exception 'ket_qua phải là cao · vua · thieu.';
  end if;
  return jsonb_build_object('ma_cau', p_ma_cau, 'ket_qua', p_ket_qua, 'dang_bai_id', case when p_ket_qua = 'thieu' then null else p_dang_bai end,
                            'nhanh', r.nhanh, 'truoc', case when v_gan_db is not null then 'ai_gan:' || v_gan_db else null end);
end $$;

-- Phân một LÔ câu (≤ 50). Mỗi câu một savepoint: câu lỗi không kéo cả lô; trả kết quả từng câu.
create or replace function public.fn_phien_kho_phan(p_phien uuid, p_ds jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_mot jsonb; v_ok integer := 0; v_loi integer := 0;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu: [{"ma_cau":..,"ket_qua":"cao|vua|thieu","dang_bai_id":..,"ly_do":..,"chu_de_id":<chỉ khi thieu, tuỳ chọn>}]'; end if;
  if jsonb_array_length(p_ds) > 50 then raise exception 'Mỗi lô tối đa 50 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
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
end $$;

do $$
declare f text;
begin
  foreach f in array array['public._phien_kho_vao(uuid)', 'public.fn_phien_kho_tong(uuid)', 'public.fn_phien_kho_hang(uuid, text, integer, integer)', 'public.fn_phien_kho_dang(uuid, text, integer, integer)',
                           'public._phien_kho_phan1(claude_phien, text, text, text, text, text)', 'public.fn_phien_kho_phan(uuid, jsonb)'] loop
    execute format('revoke all on function %s from public', f);
    execute format('revoke all on function %s from anon', f);
    execute format('revoke all on function %s from authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;
