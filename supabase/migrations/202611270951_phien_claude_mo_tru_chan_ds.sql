-- ============================================================================
-- 202611270951 — phien_claude_mo_tru_chan_ds
-- VÌ SAO (Thùy 27/11): "Tạm thời chưa cần duyệt. Chỉ có mình Lộ Thị Dương dùng không đúng cách thôi. Mở khoá các trưởng khối khác trừ Dương."
--   Gỡ khoá 23/11 (mig 202611231659 + 202611231711) cho mọi người trong phạm vi quản lý khối, TRỪ những ai nằm trong bảng phien_claude_chan.
--   Phiếu sửa bản đồ vẫn còn nguyên (không bắt buộc nữa), công tắc phien_claude_truong_khoi chuyển sang BẬT.
-- Hai lớp khoá đều đọc cùng một danh sách chặn:
--   A. _phien_kiem_khoa  (mở / mở lại / nhắn / Claude ghi trong phiên)
--   B. _ban_do_duoc_ghi  (trigger trg_ban_do_khoa trên 34 bảng cấu trúc bản đồ — sửa tay trên màn)
-- Ai được chặn: người trong phien_claude_chan (kể cả có chức trưởng khối), TRỪ admin hệ thống. Bỏ chặn = xoá dòng (chỉ admin, qua SQL).
-- MẤT GÌ: không xoá / thu hẹp gì ở dữ liệu. Chỉ nới hàm khoá + thêm 1 bảng nhỏ.
-- ============================================================================

create table if not exists public.phien_claude_chan (
  nhan_su_id uuid primary key references public.nhan_su(id),
  ly_do      text not null,
  chan_at    timestamptz not null default now(),
  chan_boi   uuid default public.jwt_uid()
);
alter table public.phien_claude_chan enable row level security;
-- không có policy ⇒ client không đọc / ghi được; hàm security definer đọc thay.
revoke all on public.phien_claude_chan from anon, authenticated;

insert into public.phien_claude_chan (nhan_su_id, ly_do)
select n.id, 'Thùy 27/11: dùng phiên Claude / sửa bản đồ không đúng cách — chặn riêng, chưa mở'
from public.nhan_su n where n.ma_ns = 'NS035' and n.ho_ten = 'Lộ Thị Dương'
on conflict (nhan_su_id) do nothing;

-- Người đang đăng nhập có bị chặn không (admin hệ thống không bao giờ bị chặn).
create or replace function public._phien_bi_chan()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from phien_claude_chan c where c.nhan_su_id = public.current_nhan_su_id())
     and not coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
$$;
revoke execute on function public._phien_bi_chan() from public, anon, authenticated;

-- A. Phiên Claude: mở cho mọi trưởng khối trừ người bị chặn. Công tắc TẮT vẫn là "khoá hết trừ admin" (đường lùi nhanh).
create or replace function public._phien_kiem_khoa()
returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if public._phieu_dang_chay() then return; end if;
  if coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false) then return; end if;
  if public._phien_bi_chan() then
    raise exception 'Tài khoản của bạn đang bị tạm chặn dùng phiên Claude (Thùy 27/11). Cần việc gì thì nhắn Thùy.' using errcode = '42501';
  end if;
  if coalesce((select bat from he_thong_cong_tac where ma = 'phien_claude_truong_khoi'), false) then return; end if;
  raise exception 'Phiên Claude đang tạm khoá với trưởng khối (Thùy 23/11). Cần sửa bản đồ / kho thì gửi đề xuất cho Thùy duyệt.' using errcode = '42501';
end $$;
revoke execute on function public._phien_kiem_khoa() from public, anon, authenticated;

-- Màn hỏi "đang tạm dừng với tôi không" — cùng điều kiện với _phien_kiem_khoa.
create or replace function public.fn_phien_tam_dung()
returns boolean
language sql stable security definer set search_path = public as $$
  select not coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
     and ( public._phien_bi_chan()
           or not coalesce((select bat from he_thong_cong_tac where ma = 'phien_claude_truong_khoi'), false) )
$$;
revoke execute on function public.fn_phien_tam_dung() from public, anon;
grant execute on function public.fn_phien_tam_dung() to authenticated;

-- B. Ghi bản đồ: như trước khi khoá cho người trong phạm vi quản lý khối (trưởng · phó · quản lý môn · toàn hệ), trừ người bị chặn.
--    Người ngoài phạm vi (TA, GV thường…) vẫn bị chặn như từ 23/11 — chỉ mở cho đúng nhóm Thùy nói.
create or replace function public._ban_do_duoc_ghi()
returns boolean
language sql stable security definer set search_path = public as $$
  select public._phieu_dang_chay()
      or coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') <> 'authenticated'   -- tác vụ nền / script máy / service_role không đóng vai
      or coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
      or ( not public._phien_bi_chan()
           and coalesce((select bat from he_thong_cong_tac where ma = 'phien_claude_truong_khoi'), false)
           and exists (select 1 from public.fn_pham_vi_cua_toi()) )
$$;

-- Bật công tắc (ghi log nhờ trigger trg_he_thong_cong_tac_log).
update public.he_thong_cong_tac set bat = true, updated_at = now(),
  mo_ta = 'Phiên Claude + ghi bản đồ cho trưởng khối. BẬT từ 27/11 (trừ người trong phien_claude_chan). Tắt = khoá hết, chỉ admin.'
where ma = 'phien_claude_truong_khoi';
