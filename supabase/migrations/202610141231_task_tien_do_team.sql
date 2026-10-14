-- ============================================================================
-- 202610141231 — task_tien_do_team
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 14/10: dashboard "Việc phát triển" trên Trang chính thêm 1 thanh bar % công việc TOÀN TEAM.
--   Con số là kết quả nghiệp vụ (trung bình) ⇒ tính ở DB (CLAUDE.md §2.0), client chỉ vẽ.
--   Định nghĩa (đổi được, ghi ở đây để không ai đoán): trên đúng tập task mà bảng team đang hiện
--   (fn_task_bang = đang mở + đã duyệt 14 ngày gần đây, bỏ huỷ), mỗi task góp 1 giá trị:
--     • đã duyệt  → kết quả % cấp trên chấm (ket_qua_pct)
--     • đang mở   → % tự báo gần nhất của người làm (chưa báo = 0)
--   Thanh = trung bình các giá trị đó (làm tròn). Nguồn duy nhất là fn_task_bang ⇒ lệch bảng là không thể.
--
-- MẤT GÌ: Không mất gì — chỉ THÊM 1 hàm đọc.
-- ============================================================================

create or replace function public.fn_task_tien_do_team()
returns table(so_task integer, so_dang_mo integer, so_da_duyet integer, so_qua_han integer, pct integer)
language sql stable security definer set search_path = public as $$
  select count(*)::int,
         count(*) filter (where b.trang_thai in ('dang_lam', 'cho_duyet'))::int,
         count(*) filter (where b.trang_thai = 'da_duyet')::int,
         count(*) filter (where b.qua_han)::int,
         coalesce(round(avg(case when b.trang_thai = 'da_duyet' then b.ket_qua_pct else coalesce(b.tien_do_bao_cao, 0) end)), 0)::int
    from public.fn_task_bang() b
   where b.trang_thai <> 'huy'   -- task huỷ không tính vào tiến độ
$$;

revoke all on function public.fn_task_tien_do_team() from public, anon;
grant execute on function public.fn_task_tien_do_team() to authenticated;
