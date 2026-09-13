-- ============================================================================
-- 202609131720 — Phát hành giáo trình theo TỪNG DẠNG (Thùy 13/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: 1 buổi cấp 3 có 4-5 dạng bài. GV cần chủ động NHỊP HỌC — publish giáo trình online chỉ
--   mở DẠNG 1 → cả lớp làm cùng dạng 1 → khi GV giảng xong dạng 1 mới bấm "▶ Phát hành dạng 2".
--   Tránh HS nhanh nhảy vọt sang dạng chưa giảng.
--
-- ẢNH HƯỞNG: CHỈ giáo trình online (bai_test.loai='giao_trinh'). ET/BTVN không đụng (ET nộp 1 lần
--   toàn bài, BTVN ở nhà không cần nhịp cả lớp).
--
-- CÁCH LÀM:
--  1. Bảng `bai_test_dang_phat_hanh(bai_test_id, ma_dang, phat_hanh_at, phat_hanh_by)` — 1 dòng =
--     1 dạng ĐÃ MỞ. HS đọc bảng qua RLS để biết câu nào được thấy.
--  2. Trigger `tg_bt_dang_ph_auto_dang1` — khi câu ĐẦU TIÊN (thu_tu=1) của 1 giáo trình được insert
--     (client publish flow), TỰ ĐỘNG phát hành DẠNG của câu đó. GV chỉ chủ động dạng 2 trở đi.
--  3. RPC `fn_bt_phat_hanh_dang(p_bt, p_ma_dang)` + `fn_bt_thu_hoi_dang` cho LiveTab GV.
--  4. HS filter câu theo dạng đã phát hành — làm ở CLIENT (sửa getBaiTestFull), không đụng RLS
--     hiện tại (RLS `bai_test_cau_hs_read` phức tạp, filter client an toàn hơn cho giai đoạn đầu).
--
-- MẤT GÌ: không mất data. Bảng mới + 2 RPC + 1 trigger. Không drop.
-- ============================================================================

create table if not exists bai_test_dang_phat_hanh (
  bai_test_id uuid not null references bai_test(id) on delete cascade,
  ma_dang text not null,
  phat_hanh_at timestamptz not null default now(),
  phat_hanh_by uuid references nhan_su(id),
  primary key (bai_test_id, ma_dang)
);
comment on table bai_test_dang_phat_hanh is 'Dạng của giáo trình online ĐÃ PHÁT HÀNH cho HS thấy. Publish = auto mở dạng câu 1; GV chủ động mở dạng 2+ ở màn LIVE (Thùy 13/09).';
create index if not exists bai_test_dang_phat_hanh_bt_idx on bai_test_dang_phat_hanh (bai_test_id);

alter table bai_test_dang_phat_hanh enable row level security;
-- HS đọc được (để filter câu). Staff đọc + ghi.
drop policy if exists bai_test_dang_phat_hanh_read on bai_test_dang_phat_hanh;
create policy bai_test_dang_phat_hanh_read on bai_test_dang_phat_hanh for select to authenticated using (true);
drop policy if exists bai_test_dang_phat_hanh_staff_all on bai_test_dang_phat_hanh;
create policy bai_test_dang_phat_hanh_staff_all on bai_test_dang_phat_hanh for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── Trigger tự phát hành DẠNG của câu ĐẦU TIÊN khi publish giáo trình ──────────────────────────
-- Chỉ khi:
--   · Câu vừa insert có thu_tu = 1 (câu đầu tiên bài)
--   · bai_test.loai = 'giao_trinh'
--   · ma_dang không NULL
-- Đảm bảo: publish giáo trình → HS thấy ngay dạng 1, GV chủ động dạng 2+ trên màn LIVE.
create or replace function public.fn_bt_tu_phat_hanh_dang1() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if NEW.thu_tu <> 1 or NEW.ma_dang is null then return NEW; end if;
  if not exists (select 1 from bai_test where id = NEW.bai_test_id and loai = 'giao_trinh') then
    return NEW;
  end if;
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    values (NEW.bai_test_id, NEW.ma_dang, null)
    on conflict do nothing;
  return NEW;
end $$;

drop trigger if exists tg_bt_dang_ph_auto_dang1 on bai_test_cau;
create trigger tg_bt_dang_ph_auto_dang1
  after insert on bai_test_cau
  for each row execute function public.fn_bt_tu_phat_hanh_dang1();

-- Backfill: giáo trình ĐÃ publish trước migration — mở dạng câu thu_tu=1 để không kẹt HS đang làm.
insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_at)
  select btc.bai_test_id, btc.ma_dang, coalesce(bt.mo_at, now())
  from bai_test_cau btc
  join bai_test bt on bt.id = btc.bai_test_id
  where btc.thu_tu = 1 and btc.ma_dang is not null and bt.loai = 'giao_trinh'
  on conflict do nothing;

-- ── RPC phát hành 1 dạng (staff/GV) ─────────────────────────────────────────────────────────────
create or replace function public.fn_bt_phat_hanh_dang(p_bt uuid, p_ma_dang text)
returns timestamptz language plpgsql as $$
declare
  v_nhan_su uuid := public.current_nhan_su_id();
  v_at timestamptz;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự phát hành được.'; end if;
  if not exists (select 1 from bai_test where id = p_bt and loai = 'giao_trinh') then
    raise exception 'Chỉ giáo trình online mới phát hành theo dạng.';
  end if;
  if not exists (select 1 from bai_test_cau where bai_test_id = p_bt and ma_dang = p_ma_dang) then
    raise exception 'Bài không có câu nào ở dạng %.', p_ma_dang;
  end if;
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    values (p_bt, p_ma_dang, v_nhan_su)
    on conflict (bai_test_id, ma_dang) do update set phat_hanh_at = excluded.phat_hanh_at, phat_hanh_by = excluded.phat_hanh_by
    returning phat_hanh_at into v_at;
  return v_at;
end $$;
grant execute on function public.fn_bt_phat_hanh_dang(uuid, text) to authenticated;
revoke execute on function public.fn_bt_phat_hanh_dang(uuid, text) from anon;

-- ── RPC thu hồi (GV lỡ tay bấm nhầm) ────────────────────────────────────────────────────────────
create or replace function public.fn_bt_thu_hoi_dang(p_bt uuid, p_ma_dang text)
returns void language plpgsql as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự thu hồi được.'; end if;
  delete from bai_test_dang_phat_hanh where bai_test_id = p_bt and ma_dang = p_ma_dang;
end $$;
grant execute on function public.fn_bt_thu_hoi_dang(uuid, text) to authenticated;
revoke execute on function public.fn_bt_thu_hoi_dang(uuid, text) from anon;
