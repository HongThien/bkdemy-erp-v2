-- ============================================================================
-- 202609031903 — xu_luy_tien_theo_khuc_exp
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO chốt 03/09 muốn lũy tiến theo khúc (luong_bac); sau đó chốt 07/09
--   ĐỔI Ý — phiên bản này dùng công thức CỐ ĐỊNH ĐƠN GIẢN: xu = ceil(EXP / 100).
--   Không đọc `luong_bac` nữa (bảng + màn "Khúc quy đổi" trên ChotXuScreen tạm
--   ngưng tác dụng, CHƯA xoá — chờ gật riêng theo Luật xoá).
--   §2.0: công thức chỉ ở Postgres (fn_xu_tu_exp); tổng EXP tháng per (HS×môn)
--   cũng ở DB (fn_gami_exp_xu_thang) thay cho expThangPerHsMon + reduce ở client.
--
-- MẤT GÌ: không mất gì. Không drop/delete. Chỉ tạo/thay 2 function.
-- ============================================================================

-- Quy 1 số EXP → xu: cố định EXP/100, làm tròn LÊN. NULL/âm coi như 0.
create or replace function public.fn_xu_tu_exp(p_exp integer) returns integer
language sql immutable as $$
  select ceil(greatest(coalesce(p_exp, 0), 0) / 100.0)::integer
$$;
grant execute on function public.fn_xu_tu_exp(integer) to authenticated;

-- EXP tháng per (HS×môn) + xu theo công thức hiện tại + mốc kế (bội số 100 kế tiếp,
-- cho thanh tiến độ màn Thành tích).
-- Nguồn EXP: note-keyed (exp_thang/exp_et/exp_btvn/exp_btvn_thang) lọc note = p_ym — KHÔNG theo created_at, vì
-- recompute có thể chạy ở tháng khác (reset đầu mùa recompute tháng cũ đúng ngày 1 tháng mới);
-- attend_floor (bù, không note) lọc created_at trong cửa sổ tháng VN. (Cùng luật với
-- EXP_NOTE_SOURCES ở src/lib/gami.ts — thêm source mới thì sửa CẢ HAI.)
-- mon NULL trả '' (khớp khoá hoc_sinh_id|mon phía client). security invoker → RLS bảng gốc áp như cũ.
create or replace function public.fn_gami_exp_xu_thang(
  p_ym text, p_hoc_sinh_id uuid default null, p_mon text default null
) returns table (
  hoc_sinh_id uuid, mon text, exp integer, xu integer, moc_ke integer, xu_moc_ke integer
) language sql stable as $$
  with cua_so as (
    select ((p_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((p_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ), tong as (
    select l.hoc_sinh_id, coalesce(l.mon, '') as mon, sum(l.amount)::integer as exp
    from public.gami_exp_ledger l, cua_so w
    where (p_hoc_sinh_id is null or l.hoc_sinh_id = p_hoc_sinh_id)
      and (p_mon is null or l.mon = p_mon)
      and (
        (l.source in ('exp_thang', 'exp_et', 'exp_btvn', 'exp_btvn_thang') and l.note = p_ym)
        or (l.source = 'attend_floor' and l.created_at >= w.tu and l.created_at < w.den)
      )
    group by 1, 2
  ), ke as (
    select t.*, ((floor(greatest(t.exp, 0) / 100.0) + 1) * 100)::integer as moc_ke
    from tong t
  )
  select k.hoc_sinh_id, k.mon, k.exp, public.fn_xu_tu_exp(k.exp), k.moc_ke, public.fn_xu_tu_exp(k.moc_ke)
  from ke k
$$;
grant execute on function public.fn_gami_exp_xu_thang(text, uuid, text) to authenticated;
