-- CHẠY Ở SUPABASE SQL EDITOR (role postgres). Không chạy bằng npm run migrate.
-- VÌ SAO: mig 202611161844 được áp tay qua SQL Editor ⇒ _mtt_buoi_tuan thuộc owner `postgres`,
-- còn fn_mtt_trung_tam (security definer) thuộc `claude_build`. Sau `revoke ... from public` thì claude_build
-- không còn quyền gọi hàm trợ giúp ⇒ "permission denied for function _mtt_buoi_tuan".
-- Hàm trợ giúp này lại gọi _gtt_ca (owner claude_build, ACL không có postgres) nên đổi owner là cách gọn nhất.
-- MẤT GÌ: không mất dữ liệu; chỉ đổi owner 1 hàm.

alter function public._mtt_buoi_tuan(uuid, date) owner to claude_build;
revoke execute on function public._mtt_buoi_tuan(uuid, date) from public, anon, authenticated;

-- kiểm: owner phải là claude_build
select proname, pg_get_userbyid(proowner) as owner, proacl::text from pg_proc where proname = '_mtt_buoi_tuan';
