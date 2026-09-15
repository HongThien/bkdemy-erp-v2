-- 202609060200 — Vá 3 fn của 202609060122 (viết file MỚI, không sửa file đã áp).
-- Bẫy plpgsql lộ lúc test e2e 06/09: `EXECUTE 'update …'` KHÔNG có RETURNING thì FOUND LUÔN = false ("EXECUTE sets FOUND
-- true if it produces one or more rows") → fn_giaibai_tra / luu_nhap / nop ném "Không lưu được…" dù UPDATE đã chạy.
-- Đúng cách với SQL động: GET DIAGNOSTICS n = ROW_COUNT. (fn_giaibai_duyet dùng EXECUTE … INTO nên FOUND đúng; tu_choi dùng
-- RETURNING … INTO nên kiểm null — 2 hàm đó không dính.)
-- MẤT GÌ (Luật xoá): không — replace 3 function cùng chữ ký.

create or replace function public.fn_giaibai_tra(p_nhanh text, p_id uuid, p_me uuid) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_tra: nhánh không hợp lệ %', p_nhanh; end if;
  execute format('update %I set xu_ly_at = now(), trang_thai = ''da_tra'' where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'')', r.yc) using p_id, p_me;
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Không trả được — bài không còn ở trạng thái đang giải của bạn.'; end if;
end $$;

create or replace function public.fn_giaibai_luu_nhap(p_nhanh text, p_id uuid, p_me uuid, p_loi_giai text, p_anh text, p_dap_an text) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_luu_nhap: nhánh không hợp lệ %', p_nhanh; end if;
  execute format('update %I set loi_giai_nhap = nullif($3, ''''), anh_nhap = nullif($4, ''''), dap_an_nhap = nullif($5, ''''), cap_nhat_at = now()
                  where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and (han_at is null or han_at >= now())', r.yc)
    using p_id, p_me, p_loi_giai, p_anh, p_dap_an;
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Không lưu được — bài đã quá hạn, đã nộp hoặc không phải của bạn.'; end if;
end $$;

create or replace function public.fn_giaibai_nop(p_nhanh text, p_id uuid, p_me uuid, p_loi_giai text, p_anh text, p_dap_an text) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_nop: nhánh không hợp lệ %', p_nhanh; end if;
  if nullif(p_loi_giai, '') is null and nullif(p_anh, '') is null then raise exception 'Cần lời giải text hoặc ảnh lời giải.'; end if;
  execute format('update %I set loi_giai_nhap = nullif($3, ''''), anh_nhap = nullif($4, ''''), dap_an_nhap = nullif($5, ''''), cap_nhat_at = now(),
                    trang_thai = ''cho_duyet'', nop_at = coalesce(nop_at, now()), han_at = null
                  where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and (han_at is null or han_at >= now())', r.yc)
    using p_id, p_me, p_loi_giai, p_anh, p_dap_an;
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Không nộp được — bài đã quá hạn, đã nộp hoặc không phải của bạn.'; end if;
end $$;
