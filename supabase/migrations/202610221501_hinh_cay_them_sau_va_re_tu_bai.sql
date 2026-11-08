-- ============================================================================
-- CÂY NHÁNH HÌNH — thao tác TỪ MỘT BÀI (Thùy 22/10: "chọn 1 bài toán — có nút tạo bài phía sau của nó trong chuỗi luôn";
-- rẽ nhánh phải là chức năng của từng bài như màn cũ, không phải tick rồi rẽ "từ bài đứng trước").
--   fn_hl_them_bai_sau(bai_truoc, …)          — bài mới chèn NGAY SAU bài_truoc, cùng làn (không phải cuối làn)
--   fn_hl_re_nhanh_tu_bai(bai_me, ten, gt, …) — nhánh mới neo vào CHÍNH bài_me + bài đầu tiên của nhánh, 1 transaction
-- Cả hai dùng lại fn_hl_them_bai (bài + lời giải + tiền đề) và fn_hl_doi_thu_tu; mã bài/nhánh sinh lúc INSERT, không đổi.
-- Trả như các RPC cây khác: _hl_ket_qua (số hiển thị mới) + bai_moi để client vá tại chỗ.
-- ============================================================================
create or replace function public.fn_hl_them_bai_sau(p_bai_truoc uuid, p_phat_bieu text, p_gia_thiet_rieng text DEFAULT NULL::text,
                                                     p_loi_giai text DEFAULT NULL::text, p_anh text DEFAULT NULL::text, p_tien_de uuid[] DEFAULT '{}'::uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_mh uuid; v_kq jsonb; v_moi uuid; v_vt int;
begin
  select mo_hinh_id into v_mh from hinh_baitoan where id = p_bai_truoc;
  if v_mh is null then raise exception 'Bài đứng trước không tồn tại'; end if;
  v_kq := public.fn_hl_them_bai(v_mh, p_phat_bieu, p_gia_thiet_rieng, p_loi_giai, p_anh, p_tien_de);   -- vào cuối làn
  v_moi := (v_kq ->> 'bai_moi')::uuid;
  perform public._hl_dong_thu_tu(v_mh);
  select thu_tu + 1 into v_vt from hinh_baitoan where id = p_bai_truoc;
  return public.fn_hl_doi_thu_tu(v_moi, v_vt) || jsonb_build_object('bai_moi', v_moi);                -- rồi dời lên ngay sau
end $function$;
revoke all on function public.fn_hl_them_bai_sau(uuid, text, text, text, text, uuid[]) from public;
grant execute on function public.fn_hl_them_bai_sau(uuid, text, text, text, text, uuid[]) to authenticated;

create or replace function public.fn_hl_re_nhanh_tu_bai(p_bai_me uuid, p_ten text, p_gia_thiet_them text, p_phat_bieu text,
                                                        p_gia_thiet_rieng text DEFAULT NULL::text, p_loi_giai text DEFAULT NULL::text,
                                                        p_anh text DEFAULT NULL::text, p_tien_de uuid[] DEFAULT '{}'::uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare v_mh uuid; v_goc uuid; v_phan text; v_khoi text; v_n uuid; v_kq jsonb;
begin
  select mo_hinh_id into v_mh from hinh_baitoan where id = p_bai_me;
  if v_mh is null then raise exception 'Bài mẹ không tồn tại'; end if;
  if coalesce(btrim(p_phat_bieu), '') = '' then raise exception 'Chưa nhập câu hỏi của bài đầu tiên trong nhánh'; end if;
  v_goc := public.fn_hl_goc_mo_hinh(v_mh);
  select phan, khoi into v_phan, v_khoi from hinh_mo_hinh where id = v_goc;
  -- y khuôn fn_hl_re_nhanh, chỉ khác: neo vào CHÍNH bài mẹ (không phải "bài đứng trước")
  insert into hinh_mo_hinh(ten, gia_thiet, gia_thiet_them, la_mo_hinh, neo_baitoan_id, phan, khoi, thu_tu)
  values (coalesce(nullif(btrim(p_ten), ''), 'Nhánh mới'), '', nullif(btrim(coalesce(p_gia_thiet_them, '')), ''),
          false, p_bai_me, v_phan, v_khoi,
          coalesce((select max(thu_tu) from hinh_mo_hinh where neo_baitoan_id = p_bai_me), 0) + 1)
  returning id into v_n;
  v_kq := public.fn_hl_them_bai(v_n, p_phat_bieu, p_gia_thiet_rieng, p_loi_giai, p_anh, p_tien_de);
  update hinh_mo_hinh set updated_at = now() where id in (v_mh, v_n);
  return public._hl_ket_qua(v_goc, v_n) || jsonb_build_object('bai_moi', v_kq -> 'bai_moi');
end $function$;
revoke all on function public.fn_hl_re_nhanh_tu_bai(uuid, text, text, text, text, text, text, uuid[]) from public;
grant execute on function public.fn_hl_re_nhanh_tu_bai(uuid, text, text, text, text, text, text, uuid[]) to authenticated;
