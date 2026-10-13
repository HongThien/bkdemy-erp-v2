-- ============================================================================
-- 202610140141 — hinh_cay_nhanh_tao_sua   (spec-hinh-cay-nhanh.md §2 — bổ sung)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "tao làm mô hình trước" — làm LẠI từ đầu trên màn Cây nhánh. Màn mới chỉ xem/sắp bài có sẵn,
--   chưa TẠO được gì. Tạo/sửa một bài đụng 3 bảng (bài + cách giải mặc định + tiền đề) ⇒ phải là RPC trong
--   cùng transaction (CLAUDE.md §2.0), không để client ghi 3 lần rời.
--   Mô hình mới sinh ra có `phan = 'luyen'`. 41 mô hình cũ đang `phan IS NULL` ⇒ màn Cây nhánh chỉ đọc
--   `phan = 'luyen'` là đủ ẨN chúng (CEO: "ẩn làm tham khảo, không dùng") — KHÔNG sửa/xoá dòng cũ nào,
--   lịch sử đo (507 lượt gami_session_problems) và các màn cũ không bị đụng.
--
-- MẤT GÌ: `fn_hl_sua_bai` THAY tập tiền đề của CÁCH GIẢI MẶC ĐỊNH của đúng bài đang sửa
--   (xoá các dòng hinh_cach_tien_de của cách đó rồi ghi lại theo danh sách người dùng vừa chọn) —
--   đây là hành vi "lưu form", không xoá bài / cách giải / lời giải nào.
-- ============================================================================

-- tạo MÔ HÌNH GỐC mới cho Hình luyện
create or replace function fn_hl_tao_mo_hinh(p_khoi text, p_ten text, p_gia_thiet text, p_anh text default null)
returns uuid language plpgsql set search_path = public as $$
declare v_id uuid;
begin
  if coalesce(btrim(p_ten), '') = '' then raise exception 'Chưa đặt tên mô hình'; end if;
  if coalesce(btrim(p_khoi), '') = '' then raise exception 'Chưa chọn khối'; end if;
  insert into hinh_mo_hinh(ten, gia_thiet, anh_cau_hinh, khoi, phan, la_goc_ho, la_mo_hinh)
  values (btrim(p_ten), coalesce(btrim(p_gia_thiet), ''), nullif(btrim(coalesce(p_anh, '')), ''), btrim(p_khoi), 'luyen', true, true)
  returning id into v_id;
  return v_id;
end $$;

-- ghi cách giải mặc định + tiền đề cho một bài (dùng chung cho thêm / sửa)
create or replace function _hl_ghi_loi_giai(p_bai uuid, p_loi_giai text, p_tien_de uuid[])
returns void language plpgsql set search_path = public as $$
declare
  v_cach uuid;
  v_goc  uuid;
  v_la   uuid;
begin
  select fn_hl_goc_mo_hinh(mo_hinh_id) into v_goc from hinh_baitoan where id = p_bai;
  -- tiền đề phải là bài KHÁC, thuộc CÙNG cây
  foreach v_la in array coalesce(p_tien_de, '{}'::uuid[]) loop
    if v_la = p_bai then raise exception 'Bài không thể là tiền đề của chính nó'; end if;
    if not exists (select 1 from hinh_baitoan t where t.id = v_la and fn_hl_goc_mo_hinh(t.mo_hinh_id) = v_goc) then
      raise exception 'Tiền đề phải là bài trong CÙNG mô hình';
    end if;
  end loop;

  select g.id into v_cach from hinh_cach_giai g where g.baitoan_id = p_bai order by g.la_mac_dinh desc, g.thu_tu limit 1;
  if v_cach is null then
    insert into hinh_cach_giai(baitoan_id, loi_giai, la_mac_dinh, thu_tu)
    values (p_bai, nullif(btrim(coalesce(p_loi_giai, '')), ''), true, 0) returning id into v_cach;
  elsif (select loi_giai from hinh_cach_giai where id = v_cach) is distinct from nullif(btrim(coalesce(p_loi_giai, '')), '') then
    update hinh_cach_giai set loi_giai = nullif(btrim(coalesce(p_loi_giai, '')), ''), updated_at = now() where id = v_cach;
  end if;

  delete from hinh_cach_tien_de where cach_id = v_cach and not (tien_de_id = any(coalesce(p_tien_de, '{}'::uuid[])));
  insert into hinh_cach_tien_de(cach_id, tien_de_id)
  select v_cach, x from unnest(coalesce(p_tien_de, '{}'::uuid[])) x
  where not exists (select 1 from hinh_cach_tien_de t where t.cach_id = v_cach and t.tien_de_id = x);
end $$;

-- THÊM BÀI vào cuối một làn (thân hoặc nhánh)
create or replace function fn_hl_them_bai(p_nhanh uuid, p_phat_bieu text, p_gia_thiet_rieng text default null,
  p_loi_giai text default null, p_anh text default null, p_tien_de uuid[] default '{}')
returns jsonb language plpgsql set search_path = public as $$
declare
  v_id  uuid;
  v_cap int;
begin
  if not exists (select 1 from hinh_mo_hinh where id = p_nhanh) then raise exception 'Nhánh không tồn tại'; end if;
  if coalesce(btrim(p_phat_bieu), '') = '' then raise exception 'Chưa nhập câu hỏi của bài'; end if;
  select coalesce(max(cap), 0) + 1 into v_cap from hinh_baitoan where id = any(coalesce(p_tien_de, '{}'::uuid[]));
  insert into hinh_baitoan(mo_hinh_id, phat_bieu, cap, gia_thiet_rieng, anh_chuan, thu_tu)
  values (p_nhanh, btrim(p_phat_bieu), v_cap, nullif(btrim(coalesce(p_gia_thiet_rieng, '')), ''),
          nullif(btrim(coalesce(p_anh, '')), ''),
          coalesce((select max(thu_tu) from hinh_baitoan where mo_hinh_id = p_nhanh), 0) + 1)
  returning id into v_id;
  perform _hl_ghi_loi_giai(v_id, p_loi_giai, p_tien_de);
  update hinh_mo_hinh set updated_at = now() where id = p_nhanh;
  return _hl_ket_qua(fn_hl_goc_mo_hinh(p_nhanh)) || jsonb_build_object('bai_moi', v_id);
end $$;

-- SỬA BÀI (mã KHÔNG đổi — trigger hinh_baitoan_gen_ma ép về mã cũ)
create or replace function fn_hl_sua_bai(p_bai uuid, p_phat_bieu text, p_gia_thiet_rieng text default null,
  p_loi_giai text default null, p_anh text default null, p_tien_de uuid[] default '{}')
returns jsonb language plpgsql set search_path = public as $$
declare v_mh uuid;
begin
  select mo_hinh_id into v_mh from hinh_baitoan where id = p_bai;
  if v_mh is null then raise exception 'Bài không tồn tại'; end if;
  if coalesce(btrim(p_phat_bieu), '') = '' then raise exception 'Chưa nhập câu hỏi của bài'; end if;
  update hinh_baitoan
     set phat_bieu = btrim(p_phat_bieu),
         gia_thiet_rieng = nullif(btrim(coalesce(p_gia_thiet_rieng, '')), ''),
         anh_chuan = nullif(btrim(coalesce(p_anh, '')), ''),
         updated_at = now()
   where id = p_bai;
  perform _hl_ghi_loi_giai(p_bai, p_loi_giai, p_tien_de);
  update hinh_mo_hinh set updated_at = now() where id = v_mh;
  return _hl_ket_qua(fn_hl_goc_mo_hinh(v_mh)) || jsonb_build_object('bai_moi', p_bai);
end $$;

revoke execute on function fn_hl_tao_mo_hinh(text, text, text, text), _hl_ghi_loi_giai(uuid, text, uuid[]),
  fn_hl_them_bai(uuid, text, text, text, text, uuid[]), fn_hl_sua_bai(uuid, text, text, text, text, uuid[]) from public, anon;
-- INVOKER ⇒ người đăng nhập phải chạy được CẢ hàm phụ (bài học 14/10: thiếu grant hàm phụ là "permission denied" trên app)
grant execute on function fn_hl_tao_mo_hinh(text, text, text, text), _hl_ghi_loi_giai(uuid, text, uuid[]),
  fn_hl_them_bai(uuid, text, text, text, text, uuid[]), fn_hl_sua_bai(uuid, text, text, text, text, uuid[]) to authenticated;
