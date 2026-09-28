-- ============================================================================
-- 202609282350 — huy_hieu_chot_nhanh_chi_admin
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy bấm "Chốt tháng 7" ở màn Huy hiệu ⇒ "canceling statement due to statement timeout" (trần role authenticated = 8s).
--   Đo 28/09 (transaction + ROLLBACK, claude_build, KHÔNG qua RLS):
--     • fn_thanh_tuu_thang cả tháng Toán: 70,8s (T7) · 69,0s (T8) · 71,8s (T9) — lúc khác đo được 4–7s: planner lúc INLINE các CTE
--       (fn_mastery_cells, bảng đo) vào subquery TƯƠNG QUAN chạy cho từng (em × thành tựu) ⇒ gọi lại hàng trăm lần.
--     • Ép MATERIALIZED 13 CTE ⇒ 1,96s · 3,06s · 4,02s; khối 9 riêng: 9,28s → 0,56s.
--     • Kết quả cũ vs mới T7, T9: 0 dòng khác (so bằng EXCEPT 2 chiều).
--   Thêm: hàm chốt chạy invoker ⇒ app gọi phải qua RLS `la_thanh_vien()` trên từng dòng buoi_hoc_hs/gami_grades/bai_lam_cau…
--   ⇒ chuyển SECURITY DEFINER (chặn quyền ngay đầu hàm).
--   Thùy 28/09: "chốt 1 tháng 1 lần, bấm tay được — ý t là KHÔNG CẦN GIÁO VIÊN" ⇒ chốt chỉ người có quyền GHI chức năng 'huyhieu'
--   (admin); GV chỉ trao bản cứng qua lá riêng 'huyhieu_trao' (fn_huy_hieu_trao giữ nguyên).
--   Đã thử `SET statement_timeout` gắn vào hàm: KHÔNG vượt được trần phiên (đo bằng hàm pg_temp) ⇒ phải làm nhanh, không nới trần.
--   Sửa thân hàm bằng pg_get_functiondef + replace có ASSERT (không chép đè — bài học HANDOFF 27/09).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu. Thu hẹp QUYỀN: nhân sự thường (la_thanh_vien) KHÔNG còn chốt tháng được, chỉ người co_quyen_ghi('huyhieu').
-- ============================================================================

-- ① fn_thanh_tuu_thang: ép MATERIALIZED cho mọi CTE (mỗi CTE tính đúng 1 lần)
do $$
declare
  d text := pg_get_functiondef('public.fn_thanh_tuu_thang(text,text,uuid[])'::regprocedure);
  c text; tok text; n int;
begin
  foreach c in array array['hs','dd','bt','bai','tl','tt','mt_nay','mt_moc','ms0','ms1','msdo','ll','tk'] loop
    tok := ' ' || c || ' as (';
    n := (length(d) - length(replace(d, tok, ''))) / length(tok);
    if n <> 1 then raise exception 'fn_thanh_tuu_thang: CTE % xuất hiện % lần (cần đúng 1) — thân hàm đã đổi, dừng.', c, n; end if;
    d := replace(d, tok, ' ' || c || ' as materialized (');
  end loop;
  execute d;
end $$;

-- ② fn_huy_hieu_chot_thang: cổng quyền = admin Huy hiệu, chạy SECURITY DEFINER
do $$
declare
  d text := pg_get_functiondef('public.fn_huy_hieu_chot_thang(text,text)'::regprocedure);
  cu text := 'if not public.la_thanh_vien() then raise exception ''Chỉ nhân sự được chốt huy hiệu.''; end if;';
  moi text := 'if not public.co_quyen_ghi(''huyhieu'') then raise exception ''Chỉ admin (quyền ghi Huy hiệu) được chốt tháng.''; end if;';
begin
  if (length(d) - length(replace(d, cu, ''))) / length(cu) <> 1 then
    raise exception 'fn_huy_hieu_chot_thang: không thấy đúng 1 cổng quyền cũ — thân hàm đã đổi, dừng.';
  end if;
  execute replace(d, cu, moi);
end $$;
alter function public.fn_huy_hieu_chot_thang(text, text) security definer set search_path = public;
revoke all on function public.fn_huy_hieu_chot_thang(text, text) from public, anon;
grant execute on function public.fn_huy_hieu_chot_thang(text, text) to authenticated;

-- ③ Tự kiểm (2 chiều quyền — bài học 18/09)
do $$
declare v_def text := pg_get_functiondef('public.fn_thanh_tuu_thang(text,text,uuid[])'::regprocedure);
begin
  if (length(v_def) - length(replace(v_def, 'as materialized (', ''))) / length('as materialized (') <> 13 then
    raise exception 'Tự kiểm: fn_thanh_tuu_thang chưa đủ 13 CTE materialized';
  end if;
  if not (select prosecdef from pg_proc where oid = 'public.fn_huy_hieu_chot_thang(text,text)'::regprocedure) then
    raise exception 'Tự kiểm: fn_huy_hieu_chot_thang chưa security definer';
  end if;
  if position('co_quyen_ghi(''huyhieu'')' in pg_get_functiondef('public.fn_huy_hieu_chot_thang(text,text)'::regprocedure)) = 0 then
    raise exception 'Tự kiểm: cổng quyền chốt chưa đổi';
  end if;
  if has_function_privilege('anon', 'public.fn_huy_hieu_chot_thang(text,text)', 'EXECUTE') then
    raise exception 'Tự kiểm: anon còn gọi được fn_huy_hieu_chot_thang';
  end if;
  if not has_function_privilege('authenticated', 'public.fn_huy_hieu_chot_thang(text,text)', 'EXECUTE') then
    raise exception 'Tự kiểm: authenticated mất quyền gọi fn_huy_hieu_chot_thang';
  end if;
end $$;
