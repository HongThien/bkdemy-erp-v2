-- Tự nạp pool giải bài: (1) BỎ QUA KHỐI theo danh sách (Thùy 09/09: "bỏ qua khối 12"); (2) KHÔNG nạp lại bài
-- Claude đã --bo (lỗ rò 08–09/09: yêu cầu đóng không ghi ⇒ bài rơi lại pool ⇒ lượt sau nạp lại ⇒ bỏ lại;
-- DC000016 bị nạp 26 lần, 54/140 lượt-bài là lặp vô ích).
-- Thêm 2 tham số CÓ DEFAULT vào fn_giaibai_pool nên caller cũ (UI giaibai.ts gọi 4 tham số tên) giữ nguyên hành vi;
-- chỉ auto-nap-hang-doi.mjs truyền thêm. Phải DROP chữ ký cũ trước — create or replace với chữ ký khác sẽ tạo
-- overload ⇒ gọi 4 tham số thành "function is not unique".
-- Điều kiện "Claude đã bỏ" = tồn tại yêu cầu ĐÃ ĐÓNG của đúng (nhanh,key) có ghi_chu chứa '[Claude bỏ:' (mẫu do
-- hangdoi-giai.mjs --bo ghi). Người sửa đề xong muốn cho chạy lại thì xoá/đổi ghi_chu yêu cầu đó (hoặc tự giải).
drop function if exists public.fn_giaibai_pool(text[], text, integer, text);
create function public.fn_giaibai_pool(
  p_nhanh text[], p_khoi text, p_limit integer default 500, p_che_do text default 'giai',
  p_bo_khoi text[] default null, p_bo_claude_da_bo boolean default false)
returns setof public.v_giaibai_bai
language plpgsql stable as $$
begin
  if p_che_do = 'hoan_thien' then
    return query select v.* from public.v_giaibai_hoan_thien v
      where v.nhanh = any(p_nhanh) and (p_khoi is null or v.khoi = p_khoi) and v.yc_id is null
        and (p_bo_khoi is null or v.khoi is null or v.khoi <> all(p_bo_khoi))
        and (not p_bo_claude_da_bo or not exists (
          select 1 from public.v_giaibai_nhan n
          where n.nhanh = v.nhanh and n.key = v.key and n.xu_ly_at is not null and n.ghi_chu ilike '%Claude bỏ%'))
      order by (v.khoi in ('6','7','8','9')) desc, v.nhanh, v.nhom_ma, v.ma limit p_limit;
  else
    return query select v.* from public.v_giaibai_bai v
      where v.nhanh = any(p_nhanh) and (p_khoi is null or v.khoi = p_khoi) and v.yc_id is null
        and (p_bo_khoi is null or v.khoi is null or v.khoi <> all(p_bo_khoi))
        and (not p_bo_claude_da_bo or not exists (
          select 1 from public.v_giaibai_nhan n
          where n.nhanh = v.nhanh and n.key = v.key and n.xu_ly_at is not null and n.ghi_chu ilike '%Claude bỏ%'))
      order by (v.khoi in ('6','7','8','9')) desc, v.nhanh, v.nhom_ma, v.ma limit p_limit;
  end if;
end $$;
grant execute on function public.fn_giaibai_pool(text[], text, integer, text, text[], boolean) to authenticated;
