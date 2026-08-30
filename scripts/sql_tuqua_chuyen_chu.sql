-- TỦ QUÀ — chuyển chủ sở hữu cụm qlht_* (Hải) về claude_build. CHẠY TAY 1 LẦN trong Supabase SQL
-- Editor (role postgres — chủ hiện tại). Idempotent — chạy lại vô hại.
--
-- VÌ SAO: Thùy chốt 29/08 module quà VIẾT LẠI theo style ERP, và 30/08 xác nhận Hải DỪNG — ERP/app OPS
-- là đầu ghi duy nhất. Bảng qlht_* do postgres sở hữu (tạo tay, ngoài migration) nên:
--   (a) npm run migrate (role claude_build) KHÔNG alter/tạo policy/tạo view đè được → mọi thay đổi sau
--       này lại phải SQL tay — lặp đúng cái bẫy "object ngoài sổ" đã ghi ở CLAUDE §2.1;
--   (b) claude_build SELECT ra 0 dòng im lặng (điểm mù đã ghi nhận) — mọi parity check về xu/quà mù.
-- Chuyển owner một lần thì migration 2026083010xx_tu_qua_v1.sql (đi cùng đợt này) chạy được bằng
-- npm run migrate như mọi migration khác, và điểm mù đọc dữ liệu biến mất (owner bỏ qua RLS).
--
-- KHÔNG xoá gì, KHÔNG đổi dữ liệu, KHÔNG đổi hành vi app: policy/grant/hàm cũ của Hải giữ nguyên
-- (15 hàm qlht_* của Hải là SECURITY DEFINER chạy dưới postgres — vẫn chạy như cũ, giữ làm tham chiếu).

-- Supabase: postgres KHÔNG phải superuser — muốn gán owner mới thì phải là member của role đó.
-- postgres tạo ra claude_build nên có ADMIN OPTION → tự grant được. Idempotent.
grant claude_build to postgres;

alter table public.qlht_qua        owner to claude_build;
alter table public.qlht_qua_nhap   owner to claude_build;
alter table public.qlht_doi_qua    owner to claude_build;
alter table public.qlht_qua_order  owner to claude_build;
alter table public.qlht_xu_ledger  owner to claude_build;
alter table public.qlht_smoke_test owner to claude_build;

alter view public.qlht_v_so_du_xu owner to claude_build;
alter view public.qlht_v_ton_qua  owner to claude_build;

-- Kiểm sau khi chạy (phải ra 8 dòng owner = claude_build):
-- select c.relname, pg_get_userbyid(c.relowner) as owner
-- from pg_class c join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname='public' and c.relname like 'qlht%' and c.relkind in ('r','v') order by 1;
