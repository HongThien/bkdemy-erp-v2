-- ============================================================================
-- APP HS — NÚT "BẮT BUỘC CẬP NHẬT NGAY" (Thùy 03/11: "làm đi · chủ động nhé, khi nào t muốn mới bật")
-- App HS tự cập nhật khi em quay lại app / mỗi 30 phút (main-hs.tsx). Nút này để đẩy bản sửa GẤP: Thùy bấm ⇒ ghi mốc `luc`;
-- máy nào đang mở app từ TRƯỚC mốc đó (hỏi mỗi 30 giây khi màn đang hiện) sẽ tự kiểm bản mới rồi tải lại — chỉ lúc em đang ở
-- MÀN CHÍNH (không làm mất bài đang làm); đang ở màn khác thì đợi em về màn chính.
-- Không bấm thì không có gì xảy ra (chỉ là lượt hỏi nhẹ). Mốc chỉ có 1 dòng, mỗi lần bấm ghi đè + sổ nhật ký ai bấm lúc nào.
-- ============================================================================

create table if not exists public.hs_ep_cap_nhat (
  id  smallint primary key default 1 check (id = 1),
  luc timestamptz not null,
  boi uuid
);
alter table public.hs_ep_cap_nhat enable row level security;

create table if not exists public.hs_ep_cap_nhat_log (
  id  bigint generated always as identity primary key,
  luc timestamptz not null default now(),
  boi uuid
);
alter table public.hs_ep_cap_nhat_log enable row level security;

-- Máy hỏi: mốc bắt buộc gần nhất (null = chưa bấm lần nào). Nhẹ: đọc 1 dòng.
create or replace function public.fn_hs_ep_cap_nhat() returns timestamptz
language sql stable security definer set search_path to 'public' as $$
  select luc from hs_ep_cap_nhat where id = 1
$$;

-- Thùy bấm: cùng quyền với màn "Mở tính năng app HS" (co_quyen_ghi('tinh_nang')).
create or replace function public.fn_hs_ep_cap_nhat_bat() returns timestamptz
language plpgsql security definer set search_path to 'public' as $$
declare v_luc timestamptz := clock_timestamp(); v_ai uuid := public.jwt_uid();
begin
  if not public.co_quyen_ghi('tinh_nang') then raise exception 'Không có quyền bắt buộc cập nhật app học sinh' using errcode = '42501'; end if;
  insert into hs_ep_cap_nhat (id, luc, boi) values (1, v_luc, v_ai) on conflict (id) do update set luc = excluded.luc, boi = excluded.boi;
  insert into hs_ep_cap_nhat_log (luc, boi) values (v_luc, v_ai);
  return v_luc;
end $$;

revoke all on function public.fn_hs_ep_cap_nhat(), public.fn_hs_ep_cap_nhat_bat() from public, anon;
grant execute on function public.fn_hs_ep_cap_nhat(), public.fn_hs_ep_cap_nhat_bat() to authenticated;
