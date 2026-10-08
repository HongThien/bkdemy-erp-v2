-- ============================================================================
-- 202610081121 — hs_tutorial_tien_do: TIẾN ĐỘ TUTORIAL (Lộc dẫn) THEO TÀI KHOẢN HỌC SINH
-- ----------------------------------------------------------------------------
-- VÌ SAO: spec-v1-app-hs.md hạng mục 1 — "gắn vào luồng thật: tự mở lần đầu + nút mở lại, lưu tiến độ ở DB". Tutorial demo chỉ giữ trong bộ nhớ.
--   Và vì app MỞ DẦN từng tính năng (tinh_nang_mo_dan): khi 1 tính năng mới mở, em phải được Lộc kể ĐÚNG phần mới đó (học đúng lúc cần), không dẫn lại từ đầu
--   ⇒ cần biết em đã xem / đã bỏ qua chặng nào. Chặng nào chưa có dòng ⇒ chưa nói với em.
--
-- MÔ HÌNH (§1.5 không placeholder): 1 dòng = em đã XEM hết chặng đó, hoặc BỎ QUA (nút Bỏ qua). Chưa gặp ⇒ KHÔNG có dòng.
--   Khoá (hoc_sinh_id, chuong); `chuong` = mã chặng ở tutorial/noiDungTutorial.ts (text, không FK — danh mục chặng sống ở app).
-- QUYỀN: HS chỉ đọc/ghi của CHÍNH MÌNH qua 3 hàm (security definer + my_hoc_sinh_id()); bảng không mở trực tiếp.
-- MẤT GÌ: không xoá/thu hẹp gì — thêm 1 bảng + 3 hàm.
-- ============================================================================

create table if not exists public.hs_tutorial (
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  chuong      text not null check (length(chuong) between 1 and 40),
  kieu        text not null check (kieu in ('xem', 'bo_qua')),
  luc         timestamptz not null default now(),
  primary key (hoc_sinh_id, chuong)
);
alter table public.hs_tutorial enable row level security;
revoke all on public.hs_tutorial from anon, authenticated;

-- Mã các chặng em đã xem hoặc bỏ qua
create or replace function public.fn_hs_tutorial_cua_toi()
returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(chuong order by luc), '{}'::text[]) from hs_tutorial where hoc_sinh_id = public.my_hoc_sinh_id()
$$;
revoke all on function public.fn_hs_tutorial_cua_toi() from public;
revoke execute on function public.fn_hs_tutorial_cua_toi() from anon;
grant execute on function public.fn_hs_tutorial_cua_toi() to authenticated;

-- Ghi nhận 1 hay nhiều chặng (idempotent: đã có thì GIỮ dòng cũ — "xem" không bị "bỏ qua" ghi đè)
create or replace function public.fn_hs_tutorial_ghi(p_chuong text[], p_kieu text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Không phải tài khoản học sinh' using errcode = '42501'; end if;
  if p_kieu not in ('xem', 'bo_qua') then raise exception 'kieu không hợp lệ: %', p_kieu using errcode = '22023'; end if;
  if coalesce(array_length(p_chuong, 1), 0) > 40 then raise exception 'Quá nhiều chặng' using errcode = '22023'; end if;
  insert into hs_tutorial (hoc_sinh_id, chuong, kieu)
  select v_hs, c, p_kieu from unnest(p_chuong) as c where c is not null and length(c) between 1 and 40
  on conflict (hoc_sinh_id, chuong) do update set kieu = 'xem', luc = now() where hs_tutorial.kieu = 'bo_qua' and excluded.kieu = 'xem';
end $$;
revoke all on function public.fn_hs_tutorial_ghi(text[], text) from public;
revoke execute on function public.fn_hs_tutorial_ghi(text[], text) from anon;
grant execute on function public.fn_hs_tutorial_ghi(text[], text) to authenticated;
