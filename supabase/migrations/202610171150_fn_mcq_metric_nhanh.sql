-- fn_mcq_metric NHANH (17/10). Hiện trạng: qua phiên đăng nhập thật (authenticated, trần 8s) hàm timeout ⇒ ô số đo ở
-- Duyệt kho › Trắc nghiệm AI không hiện (client đã .catch(() => null) để danh sách không trắng).
-- Nguyên nhân (EXPLAIN ANALYZE):
--   (1) hàm là INVOKER ⇒ RLS chạy TỪNG DÒNG trên bai_lam_cau (~68k: EXISTS bai_lam … OR la_thanh_vien()) và
--       bai_test_cau (~72k: EXISTS bai_test … _btc_trang_thai(…) OR la_thanh_vien()) — la_thanh_vien() là SECURITY
--       DEFINER nên không inline/không gom được, gọi lại cho mỗi dòng. Chạy bằng owner (bỏ qua RLS) chỉ ~0,4–1,2s.
--   (2) planner ước jsonb_typeof(dap_an_hs)='number' còn 321 dòng (thật 61k) ⇒ chọn nested loop 61k lần index
--       bai_test_cau_pkey; không có index form_tn_id ⇒ lẽ ra hash join phải seq scan cả bảng bai_test_cau (rộng, 11k trang).
--   (3) CTE f = select * (dòng rộng ~635B, ghi temp) dù chỉ cần vài cột.
-- Sửa — KẾT QUẢ Y HỆT (đã so jsonb cũ = mới trong BEGIN…ROLLBACK cho dai/hgt/khtn, có/không lọc ngày; tsa/hinh_hoc
-- vẫn bị _mcq_kiem_kho chặn y như cũ):
--   (1) SECURITY DEFINER + chặn 1 lần ở đầu `la_thanh_vien()` — số đo kho là dữ liệu nội bộ, nhân sự vốn đọc được TOÀN
--       BỘ các bảng này qua policy *_staff/*_member_all (la_thanh_vien()), nên kết quả cho nhân sự không đổi. Thu quyền
--       public/anon (trước đây PUBLIC execute được).
--   (2) thống kê biểu thức jsonb_typeof(dap_an_hs) cho planner + index phủ bai_test_cau(form_tn_id) include (id).
--   (3) f chỉ lấy đúng cột cần.
--   Thêm khoá phụ cho thứ tự mảng (ly_do / ma_cau) khi trùng số — trước đây thứ tự các phần tử bằng nhau tuỳ plan.

create statistics if not exists public.bai_lam_cau_dap_an_kieu_stx on (jsonb_typeof(dap_an_hs)) from public.bai_lam_cau;
create index if not exists bai_test_cau_form_tn_idx on public.bai_test_cau (form_tn_id) include (id) where form_tn_id is not null;
analyze public.bai_lam_cau;
analyze public.bai_test_cau;

create or replace function public.fn_mcq_metric(p_kho text, p_tu date default null, p_den date default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.' using errcode = '42501'; end if;
  perform public._mcq_kiem_kho(p_kho);
  if to_regclass(p_kho || '_cau_form_tn') is null then return '{}'::jsonb; end if;
  execute format($q$
    with f as materialized (
      select id, ma_cau, dap_an, xoa_at, da_duyet, sua_truoc_duyet, tu_choi_boi, tu_choi_ly_do
      from %1$I
      where ($1::date is null or (sinh_at at time zone 'Asia/Ho_Chi_Minh')::date >= $1)
        and ($2::date is null or (sinh_at at time zone 'Asia/Ho_Chi_Minh')::date <= $2)
    ),
    tk as (
      select count(*)::int tong,
             count(*) filter (where xoa_at is null and not da_duyet)::int cho_duyet,
             count(*) filter (where da_duyet)::int duyet,
             count(*) filter (where da_duyet and not sua_truoc_duyet)::int duyet_khong_sua,
             count(*) filter (where da_duyet and sua_truoc_duyet)::int sua,
             -- CHỈ đếm TỪ CHỐI THẬT (có người + lý do) — xoá-kho-rác để sinh lại (tu_choi_boi null) KHÔNG tính.
             count(*) filter (where xoa_at is not null and not da_duyet and tu_choi_boi is not null)::int tu_choi
      from f
    ),
    ld as (
      select coalesce(jsonb_agg(jsonb_build_object('ly_do', ly_do, 'n', n) order by n desc, ly_do), '[]'::jsonb) j
      from (select tu_choi_ly_do ly_do, count(*)::int n from f where xoa_at is not null and tu_choi_boi is not null and tu_choi_ly_do is not null group by 1) s
    ),
    pb as (
      select coalesce(jsonb_object_agg(dap_an, n), '{}'::jsonb) j
      from (select dap_an, count(*)::int n from f where xoa_at is null group by 1) s
    ),
    dl as (
      select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'luot', luot, 'chon', chon) order by luot desc, ma_cau), '[]'::jsonb) j
      from (
        select f.ma_cau, count(blc.id)::int luot,
               jsonb_build_array(
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 0),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 1),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 2),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 3)) chon
        from f
        join bai_test_cau btc on btc.form_tn_id = f.id
        join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and jsonb_typeof(blc.dap_an_hs) = 'number'
        group by f.ma_cau
        having count(blc.id) >= 30
      ) s
    )
    select jsonb_build_object(
      'tong', tk.tong, 'cho_duyet', tk.cho_duyet, 'duyet', tk.duyet, 'duyet_khong_sua', tk.duyet_khong_sua,
      'sua', tk.sua, 'tu_choi', tk.tu_choi,
      'precision', case when tk.duyet + tk.tu_choi = 0 then null else round(tk.duyet_khong_sua::numeric / (tk.duyet + tk.tu_choi), 3) end,
      'ti_le_sua', case when tk.duyet = 0 then null else round(tk.sua::numeric / tk.duyet, 3) end,
      'ly_do_tu_choi', ld.j, 'phan_bo', pb.j, 'do_lua', dl.j)
    from tk, ld, pb, dl
  $q$, p_kho || '_cau_form_tn') into v using p_tu, p_den;
  return v;
end $$;

revoke execute on function public.fn_mcq_metric(text, date, date) from public, anon;
grant execute on function public.fn_mcq_metric(text, date, date) to authenticated;
