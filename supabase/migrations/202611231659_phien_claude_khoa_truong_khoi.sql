-- ============================================================================
-- 202611231659 — phien_claude_khoa_truong_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
-- ============================================================================

-- ============================================================================
-- VÌ SAO (Thùy 23/11, nguyên văn): "Khóa quyền tự động được thêm sửa xóa của trưởng khối đối với bản đồ kiến thức. Trưởng khối muốn thao tác phải
--   gửi 1 ticket để để cho t duyệt - t duyệt thì claude mới chạy." · "trước mắt khóa luôn chức năng phiên claude với tất cả trưởng khối".
-- Làm (bước trước mắt): công tắc he_thong_cong_tac 'phien_claude_truong_khoi' (mặc định TẮT = khoá). Khi tắt, CHỈ admin hệ thống (la_admin_he_thong)
--   mở / mở lại / nhắn phiên được; mọi lệnh ghi của Claude trong phiên (đi qua _phien_bd_vao, đóng vai người mở phiên) bị chặn nếu người mở không phải admin
--   ⇒ phiên trưởng khối đang mở cũng dừng, kể cả nút "Vào kho" trong phiên. Đọc lịch sử phiên vẫn được. Không xoá phiên / tin nào.
-- Bật lại: fn_he_thong_cong_tac_dat('phien_claude_truong_khoi', true). Luồng ticket → Thùy duyệt → Claude chạy làm ở bước sau.
-- ============================================================================

insert into he_thong_cong_tac (ma, bat, mo_ta) values ('phien_claude_truong_khoi', false,
  'Phiên Claude cho trưởng khối (mở / nhắn / Claude ghi bản đồ + kho). Tắt = chỉ admin hệ thống dùng được — Thùy khoá 23/11.')
on conflict (ma) do update set bat = false, mo_ta = excluded.mo_ta, updated_at = now();

create or replace function public._phien_kiem_khoa()
returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if coalesce((select bat from he_thong_cong_tac where ma = 'phien_claude_truong_khoi'), false) then return; end if;
  if coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false) then return; end if;
  raise exception 'Phiên Claude đang tạm khoá với trưởng khối (Thùy 23/11). Cần sửa bản đồ / kho thì gửi đề xuất cho Thùy duyệt.' using errcode = '42501';
end $$;
revoke execute on function public._phien_kiem_khoa() from public, anon;

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
  perform public._phien_kiem_khoa();   -- 23/11 Thùy: khoá phiên Claude với trưởng khối
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
end $function$
;

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
  perform public._phien_kiem_khoa();   -- 23/11 Thùy: khoá phiên Claude với trưởng khối
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  update claude_phien set trang_thai = 'mo' where id = p_phien;
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_phien_gui(p_phien uuid, p_noi_dung text, p_anh jsonb, p_tep jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_p claude_phien; v_id bigint; v_n int; v_m int; v_a jsonb; v_i int := 0; v_tong int := 0; v_tong_tep int := 0;
  v_nd text := nullif(trim(coalesce(p_noi_dung, '')), '');
  v_hom timestamptz;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng — mở lại phiên để nhắn tiếp.'; end if;
  perform public._phien_kiem_khoa();   -- 23/11 Thùy: khoá phiên Claude với trưởng khối
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if p_anh is null or jsonb_typeof(p_anh) <> 'array' then raise exception 'Danh sách ảnh không hợp lệ.'; end if;
  if p_tep is null or jsonb_typeof(p_tep) <> 'array' then raise exception 'Danh sách tệp không hợp lệ.'; end if;
  v_n := jsonb_array_length(p_anh);
  v_m := jsonb_array_length(p_tep);
  if v_n > 5 then raise exception 'Mỗi tin gửi tối đa 5 ảnh.'; end if;
  if v_m > 3 then raise exception 'Mỗi tin gửi tối đa 3 tệp.'; end if;
  if v_nd is null and v_n = 0 and v_m = 0 then raise exception 'Tin nhắn trống.'; end if;
  if v_n > 0 then
    for v_a in select * from jsonb_array_elements(p_anh) loop
      if coalesce(v_a->>'mime', '') not in ('image/jpeg', 'image/png', 'image/webp')
         or coalesce(v_a->>'du_lieu', '') = '' or coalesce(v_a->>'thu', '') = '' then
        raise exception 'Ảnh số % không hợp lệ (cần mime, thu, du_lieu).', v_i + 1;
      end if;
      if length(v_a->>'du_lieu') > 1500000 then raise exception 'Ảnh số % quá lớn (tối đa ~1,1 MB sau nén).', v_i + 1; end if;
      if length(v_a->>'thu') > 60000 then raise exception 'Ảnh thu nhỏ số % quá lớn.', v_i + 1; end if;
      v_tong := v_tong + length(v_a->>'du_lieu'); v_i := v_i + 1;
    end loop;
    if v_tong > 5000000 then raise exception 'Tổng dung lượng ảnh của tin quá lớn — bớt ảnh hoặc chụp nhỏ lại.'; end if;
  end if;
  if v_m > 0 then
    v_i := 0;
    for v_a in select * from jsonb_array_elements(p_tep) loop
      v_i := v_i + 1;
      if coalesce(v_a->>'mime', '') not in ('application/pdf', 'text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/x-tex') then
        raise exception 'Tệp số %: chỉ nhận PDF và tệp chữ (txt, md, csv, json, tex). Word / Excel: lưu thành PDF rồi gửi.', v_i;
      end if;
      if coalesce(v_a->>'du_lieu', '') = '' or coalesce(btrim(v_a->>'ten'), '') = '' then raise exception 'Tệp số % không hợp lệ (cần ten, mime, du_lieu).', v_i; end if;
      if v_a->>'du_lieu' !~ '^[A-Za-z0-9+/]+=*$' then raise exception 'Tệp số % không đúng định dạng.', v_i; end if;
      if length(v_a->>'du_lieu') > 4200000 then raise exception 'Tệp số % quá lớn (tối đa khoảng 3 MB) — tách nhỏ hoặc gửi từng phần.', v_i; end if;
      v_tong_tep := v_tong_tep + length(v_a->>'du_lieu');
    end loop;
    if v_tong_tep > 6500000 then raise exception 'Tổng dung lượng tệp của tin quá lớn — gửi thành nhiều tin.'; end if;
  end if;
  if v_n > 0 or v_m > 0 then
    v_hom := date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh';
    if (select count(*) from claude_phien_tin
         where vai = 'nguoi' and nguoi_gui = public.jwt_uid() and (so_anh > 0 or so_tep > 0) and created_at >= v_hom)
       >= public._phien_gioi_han_anh_ngay() then
      raise exception 'Hôm nay bạn đã gửi % tin có ảnh / tệp (mức tối đa) — mai gửi tiếp.', public._phien_gioi_han_anh_ngay();
    end if;
  end if;
  insert into claude_phien_tin (phien_id, vai, nguoi_gui, noi_dung, trang_thai, so_anh, so_tep)
  values (p_phien, 'nguoi', public.jwt_uid(), coalesce(v_nd, case when v_n > 0 then '(chỉ gửi ảnh)' else '(chỉ gửi tệp)' end), 'cho', v_n, v_m)
  returning id into v_id;
  v_i := 0;
  if v_n > 0 then
    for v_a in select * from jsonb_array_elements(p_anh) loop
      v_i := v_i + 1;
      insert into claude_phien_anh (phien_id, tin_id, thu_tu, mime, thu, du_lieu, kich_thuoc)
      values (p_phien, v_id, v_i, v_a->>'mime', v_a->>'thu', v_a->>'du_lieu', length(v_a->>'du_lieu'));
    end loop;
  end if;
  v_i := 0;
  if v_m > 0 then
    for v_a in select * from jsonb_array_elements(p_tep) loop
      v_i := v_i + 1;
      insert into claude_phien_tep (phien_id, tin_id, thu_tu, ten, mime, du_lieu, kich_thuoc)
      values (p_phien, v_id, v_i,
              left(regexp_replace(btrim(v_a->>'ten'), '[[:cntrl:]]', ' ', 'g'), 160),   -- tên chỉ để hiển thị: bỏ ký tự điều khiển / xuống dòng
              v_a->>'mime', v_a->>'du_lieu', octet_length(decode(v_a->>'du_lieu', 'base64')));
    end loop;
  end if;
  return v_id;
end
$function$
;

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
  perform public._phien_kiem_khoa();   -- 23/11 Thùy: khoá phiên Claude với trưởng khối
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
end $function$
;
