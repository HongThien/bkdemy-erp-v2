-- CHẠY Ở SUPABASE SQL EDITOR (role postgres). Không chạy bằng npm run migrate.
-- VÌ SAO: 5 hàm Mục tiêu tuần được áp tay qua SQL Editor nên thuộc owner `postgres`; claude_build (role áp migration) không sửa được
-- ("must be owner of function _mtt_dang_nhom") ⇒ không vá được luật Phần 1 mới. Đổi owner về claude_build như mọi hàm _mtt_* còn lại.
-- postgres là thành viên của claude_build nên lệnh chạy được. Không đổi quyền gọi, không mất dữ liệu.
alter function public._mtt_dang_nhom(uuid, text, jsonb, timestamptz, boolean) owner to claude_build;
alter function public._mtt_nhom_cua_o(text) owner to claude_build;
alter function public._mtt_o_buoi(uuid, date, uuid) owner to claude_build;
alter function public._mtt_o_lui(uuid, date) owner to claude_build;
alter function public.fn_mtt_ds_lop(uuid, date) owner to claude_build;

select proname, pg_get_userbyid(proowner) as owner from pg_proc where proname in ('_mtt_dang_nhom','_mtt_nhom_cua_o','_mtt_o_buoi','_mtt_o_lui','fn_mtt_ds_lop');
