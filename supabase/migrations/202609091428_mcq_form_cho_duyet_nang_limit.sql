-- MCQ FORM — nâng limit fn_mcq_form_cho_duyet: 500 → 5000 (Thùy hỏi "nâng có ảnh hưởng gì không").
-- 500 KHÔNG phải giới hạn hiệu năng — chỉ là số phòng thủ theo thói quen luôn .limit() (CLAUDE.md §2, chống
-- default-1000 của PostgREST), chọn từ lúc chưa có nhiều câu chờ duyệt. Đo THẬT trước khi nâng (09/09):
-- 700 câu 'dai' đang chờ duyệt, EXPLAIN ANALYZE limit 5000 = 6ms (dùng index dai_cau_form_tn_1_hieu_luc sẵn có),
-- payload ước lượng CẢ 700 câu chỉ ~450KB. Nâng vô hại — vẫn giữ MỘT giới hạn tường minh (không xoá hẳn), đúng
-- luật §2 "luôn .limit()/paginate". Màn "Trắc nghiệm AI" đã tự phân trang 20 câu/trang ở client (mig 09/09 trước),
-- 5000 chỉ là trần AN TOÀN chống truy vấn không đáy nếu backlog phình bất thường, không phải trần thao tác thật.
create or replace function public.fn_mcq_form_cho_duyet(p_kho text, p_khoi text default null, p_da_duyet boolean default false)
returns table (
  id uuid, ma_cau text, dang_chinh text, ten_dang text, khoi text, noi_dung text, anh_de text, loi_giai text,
  dap_an_kho text, lua_chon jsonb, dap_an text, key_gia_tri text, ai_model text, sinh_at timestamptz,
  da_duyet boolean, sua_truoc_duyet boolean)
language plpgsql stable as $$
begin
  perform public._mcq_kiem_kho(p_kho);
  if to_regclass(p_kho || '_cau_form_tn') is null then return; end if;
  return query execute format($q$
    select f.id, f.ma_cau, q.dang_chinh, b.ten_dang, b.khoi, q.noi_dung, q.anh_de, q.loi_giai,
           q.dap_an, f.lua_chon, f.dap_an, f.key_gia_tri, f.ai_model, f.sinh_at, f.da_duyet, f.sua_truoc_duyet
    from %1$I f join %2$I q on q.ma_cau = f.ma_cau join %3$I b on b.ma_dang = q.dang_chinh
    where f.xoa_at is null and f.da_duyet = $1 and ($2::text is null or b.khoi = $2)
    order by q.dang_chinh, f.ma_cau
    limit 5000
  $q$, p_kho || '_cau_form_tn', p_kho || '_cau_hoi', p_kho || '_ban_do') using p_da_duyet, p_khoi;
end $$;
