-- 202609041835 — Nối tiếp 202609041826 (viết file MỚI, không sửa file đã áp).
-- Test rollback lúc 18:30 lộ ca: node đã có dòng hinh_cach_giai MẶC ĐỊNH nhưng RỖNG nội dung (cách giải là
-- CẤU TRÚC — giữ tiền đề/bổ đề — nên được phép tồn tại không lời giải). fn cũ INSERT thêm dòng mới ⇒ node có
-- 2 cách: mặc định-rỗng + mới-có-lời-giải ⇒ dapAnHaiBac lấy cách mặc định → vẫn trống. Sửa: có dòng rỗng thì
-- ĐIỀN vào dòng đó (ưu tiên la_mac_dinh, rồi thu_tu); không có dòng nào mới insert (la_mac_dinh=true).
-- Gom 1 hàm ghi chung `fn_hinh_ghi_loi_giai(loai, id, loi_giai, anh, nguon)` cho cả người ('nguoi') lẫn
-- Claude ('ai' → giai_method='claude_code', da_duyet=false) — worker gọi hàm này, không tự viết UPDATE.
-- MẤT GÌ (Luật xoá): không — replace function.

create or replace function public.fn_hinh_ghi_loi_giai(p_loai text, p_id uuid, p_loi_giai text, p_anh text, p_nguon text)
returns void
language plpgsql as $$
declare v_cg uuid; v_method text; v_duyet boolean;
begin
  if nullif(p_loi_giai, '') is null and nullif(p_anh, '') is null then
    raise exception 'Cần lời giải text hoặc ảnh lời giải.';
  end if;
  if p_nguon not in ('nguoi', 'ai') then raise exception 'fn_hinh_ghi_loi_giai: nguon không hợp lệ %', p_nguon; end if;
  v_method := case when p_nguon = 'ai' then 'claude_code' else null end;
  v_duyet := false;
  if p_loai = 'baitoan' then
    if not exists (select 1 from hinh_baitoan where id = p_id) then raise exception 'Không thấy bài toán %', p_id; end if;
    if exists (select 1 from hinh_cach_giai where baitoan_id = p_id and (loi_giai is not null or anh_loi_giai is not null)) then
      raise exception 'Bài toán % đã có cách giải có nội dung — không ghi đè.', p_id;
    end if;
    select id into v_cg from hinh_cach_giai where baitoan_id = p_id order by la_mac_dinh desc, thu_tu limit 1;
    if v_cg is not null then
      update hinh_cach_giai set loi_giai = nullif(p_loi_giai, ''), anh_loi_giai = nullif(p_anh, ''),
        nguon_giai = p_nguon, giai_method = v_method, da_duyet = v_duyet, updated_at = now() where id = v_cg;
    else
      insert into hinh_cach_giai (baitoan_id, dang_id, loi_giai, anh_loi_giai, la_mac_dinh, thu_tu, nguon_giai, giai_method, da_duyet)
      values (p_id, null, nullif(p_loi_giai, ''), nullif(p_anh, ''), true, 0, p_nguon, v_method, v_duyet);
    end if;
    update hinh_baitoan set updated_at = now() where id = p_id;
    if p_nguon = 'nguoi' then delete from hinh_baitoan_yeu_cau_giai where baitoan_id = p_id and xu_ly_at is null;
    else update hinh_baitoan_yeu_cau_giai set xu_ly_at = now() where baitoan_id = p_id and xu_ly_at is null; end if;
  elsif p_loai = 'bien_the' then
    update hinh_baitoan_bien_the
      set loi_giai = nullif(p_loi_giai, ''), anh_loi_giai = nullif(p_anh, ''), nguon_giai = p_nguon, giai_method = v_method, da_duyet = v_duyet, updated_at = now()
      where id = p_id and loi_giai is null and anh_loi_giai is null;
    if not found then raise exception 'Biến thể % không tồn tại hoặc đã có lời giải — không ghi đè.', p_id; end if;
    if p_nguon = 'nguoi' then delete from hinh_bien_the_yeu_cau_giai where bien_the_id = p_id and xu_ly_at is null;
    else update hinh_bien_the_yeu_cau_giai set xu_ly_at = now() where bien_the_id = p_id and xu_ly_at is null; end if;
  else
    raise exception 'fn_hinh_ghi_loi_giai: loai không hợp lệ %', p_loai;
  end if;
end $$;
grant execute on function public.fn_hinh_ghi_loi_giai(text, uuid, text, text, text) to authenticated;

-- Người tự giải = wrapper (giữ tên đã dùng ở client).
create or replace function public.fn_hinh_luu_loi_giai_nguoi(p_loai text, p_id uuid, p_loi_giai text, p_anh text)
returns void
language sql as $$
  select public.fn_hinh_ghi_loi_giai(p_loai, p_id, p_loi_giai, p_anh, 'nguoi')
$$;
grant execute on function public.fn_hinh_luu_loi_giai_nguoi(text, uuid, text, text) to authenticated;
