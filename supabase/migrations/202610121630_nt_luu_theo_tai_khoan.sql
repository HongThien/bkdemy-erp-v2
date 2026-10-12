-- ============================================================================
-- 202610121630 — nt_luu_theo_tai_khoan: NÔNG TRẠI BK — LƯU TIẾN ĐỘ THEO TÀI KHOẢN HỌC SINH (bước 1 "hoàn thiện game", Thùy 12/10)
-- ----------------------------------------------------------------------------
-- VÌ SAO: bản thử lưu ở localStorage của trình duyệt ⇒ đổi máy / xoá dữ liệu là mất, và 2 em dùng chung 1 máy dùng chung 1 nông trại.
-- MÔ HÌNH (§1.5): 1 dòng / HS = bản lưu hiện tại (chưa chơi ⇒ KHÔNG có dòng). `cap_nhat` làm "phiên bản" để phát hiện 2 thiết bị
--   ghi đè nhau (khoá lạc quan): ghi kèm cap_nhat đã đọc; lệch ⇒ KHÔNG ghi, trả bản đang có để app báo em.
-- GHI CHÚ TRUNG THỰC: state do CLIENT gửi (game web) ⇒ bước này mới chỉ giải bài toán MẤT/LẪN tiến độ, KHÔNG chống gian lận.
--   Luật kinh tế/hái trộm chạy phía server (fn_nt_*) là bước sau (xem spec-nong-trai-nhip-ngay.md §7).
-- QUYỀN: HS chỉ đọc/ghi của CHÍNH MÌNH qua 2 hàm; bảng không mở trực tiếp. Giới hạn 256KB/bản lưu.
-- MẤT GÌ: không xoá/thu hẹp gì — thêm 1 bảng + 2 hàm.
-- ============================================================================
create table if not exists public.nt_luu (
  hoc_sinh_id uuid primary key references public.hoc_sinh(id) on delete cascade,
  state       jsonb not null,
  cap_nhat    timestamptz not null default now(),
  check (octet_length(state::text) <= 262144)
);
alter table public.nt_luu enable row level security;
revoke all on public.nt_luu from anon, authenticated;

create or replace function public.fn_nt_luu_doc()
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('state', l.state, 'cap_nhat', l.cap_nhat) from nt_luu l where l.hoc_sinh_id = public.my_hoc_sinh_id()
$$;
revoke all on function public.fn_nt_luu_doc() from public;
revoke execute on function public.fn_nt_luu_doc() from anon;
grant execute on function public.fn_nt_luu_doc() to authenticated;

-- p_cap_nhat = mốc đã đọc/ghi lần trước (NULL = chưa có bản lưu nào). Lệch mốc ⇒ {ok:false, state, cap_nhat} (không ghi).
create or replace function public.fn_nt_luu_ghi(p_state jsonb, p_cap_nhat timestamptz default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_cu nt_luu; v_moi timestamptz;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_state is null or jsonb_typeof(p_state) <> 'object' or (p_state->>'v') is distinct from '2' then raise exception 'Bản lưu không hợp lệ.' using errcode = '22023'; end if;
  if octet_length(p_state::text) > 262144 then raise exception 'Bản lưu quá lớn.' using errcode = '22023'; end if;

  select * into v_cu from nt_luu where hoc_sinh_id = v_hs for update;
  if not found then
    if p_cap_nhat is not null then   -- app tưởng đã có bản lưu mà server không có: coi như xung đột an toàn (không tự tạo đè)
      return jsonb_build_object('ok', false, 'state', null, 'cap_nhat', null);
    end if;
    insert into nt_luu (hoc_sinh_id, state) values (v_hs, p_state) returning cap_nhat into v_moi;
    return jsonb_build_object('ok', true, 'cap_nhat', v_moi);
  end if;
  if p_cap_nhat is distinct from v_cu.cap_nhat then
    return jsonb_build_object('ok', false, 'state', v_cu.state, 'cap_nhat', v_cu.cap_nhat);
  end if;
  update nt_luu set state = p_state, cap_nhat = clock_timestamp() where hoc_sinh_id = v_hs returning cap_nhat into v_moi;
  return jsonb_build_object('ok', true, 'cap_nhat', v_moi);
end $$;
revoke all on function public.fn_nt_luu_ghi(jsonb, timestamptz) from public;
revoke execute on function public.fn_nt_luu_ghi(jsonb, timestamptz) from anon;
grant execute on function public.fn_nt_luu_ghi(jsonb, timestamptz) to authenticated;
