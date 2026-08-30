-- ============================================================================
-- APP TA / PH NỘP BTVN — phần KHÔNG chạy được bằng claude_build (role + storage).
-- DÁN 1 LẦN trong Supabase Dashboard → SQL Editor → Run (điện thoại cũng được).
-- Chạy TRƯỚC hay SAU `npm run migrate` đều được — migration 202608302120 guard
-- `if exists role` nên không phụ thuộc thứ tự; nếu dán SAU migrate thì chạy thêm
-- khối GRANT cuối file này (đã gộp sẵn, cứ Run cả file).
-- ============================================================================

-- ① ROLE ph_nop — đường GHI hẹp cho server bkdemy-ph (API route nộp bài).
--    ⚠ THAY 'DOI_MAT_KHAU_NAY' bằng mật khẩu mạnh TỰ ĐẶT, rồi đưa vào env SERVER
--    của bkdemy-ph (PH_NOP_DATABASE_URL) — KHÔNG commit, KHÔNG đưa xuống client.
--    Rào cứng: role này KHÔNG SELECT được bảng nào, chỉ EXECUTE đúng 1 hàm nộp.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'ph_nop') then
    create role ph_nop login password 'DOI_MAT_KHAU_NAY' noinherit;
  end if;
end $$;
revoke all on all tables in schema public from ph_nop;
revoke all on schema public from ph_nop;
grant usage on schema public to ph_nop;

-- ② BUCKET btvn-nop — PRIVATE (ảnh bài làm học sinh nhỏ, khác kho-anh public).
--    Staff (app TA / ERP) đọc + ghi bản chấm qua authenticated.
--    PH xem ảnh qua SIGNED URL do server bkdemy-ph tạo (service key server-side).
--    Upload ảnh nộp: server bkdemy-ph dùng service key CHỈ trong API route nộp
--    (storage REST không nhận DB role — đây là chỗ duy nhất phải dùng service key,
--    đã ghi rõ trade-off ở PLAN-app-ta.md §3).
insert into storage.buckets (id, name, public)
values ('btvn-nop', 'btvn-nop', false)
on conflict (id) do update set public = false;

drop policy if exists "btvn_nop_read"   on storage.objects;
drop policy if exists "btvn_nop_insert" on storage.objects;
drop policy if exists "btvn_nop_update" on storage.objects;
-- ⚠ SIẾT (audit 30/08): `authenticated` bên ERP gồm CẢ tài khoản HỌC SINH → phải gate
-- la_thanh_vien() (staff), không thì HS đọc được ảnh bài làm của nhau. Server bkdemy-ph
-- dùng service key nên bypass policy, không ảnh hưởng.
create policy "btvn_nop_read"   on storage.objects for select to authenticated using (bucket_id = 'btvn-nop' and public.la_thanh_vien());
create policy "btvn_nop_insert" on storage.objects for insert to authenticated with check (bucket_id = 'btvn-nop' and public.la_thanh_vien());
create policy "btvn_nop_update" on storage.objects for update to authenticated using (bucket_id = 'btvn-nop' and public.la_thanh_vien());
-- KHÔNG có policy delete: ảnh bài nộp là bằng chứng, không xoá từ app (luật xoá CLAUDE.md).

-- ③ GRANT cho ph_nop (no-op nếu migration 202608302120 chưa áp — Run lại file sau migrate).
do $$ begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'fn_btvn_nop_tao') then
    grant execute on function public.fn_btvn_nop_tao(uuid, uuid, text[]) to ph_nop;
  end if;
end $$;
