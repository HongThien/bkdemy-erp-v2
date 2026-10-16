-- ============================================================================
-- 202610161600 — nhan_su_plan_myplan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/10: cần MỘT chỗ để tự giao việc cho chính mình, lưu ý tưởng, và giữ lại những gì đã làm — KHÔNG nhét vào
--   "Việc phát triển" (task_phat_trien là cam kết 2 người: cấp trên giao, có hạn bắt buộc, cấp trên duyệt %, trễ ra cờ/gậy,
--   vào kết quả tháng — tự giao cho mình thì không ai duyệt, ý tưởng không có hạn, số liệu team bị bẩn).
--   ⇒ MyPlan "Kế hoạch của tôi": khuôn GTD (David Allen: ghi nhanh → phân loại → rà tuần) + Personal Kanban (Jim Benson: cột
--   trạng thái) + "Done list" (nhật ký đã xong). Thùy chốt 16/10: ① CHỈ MÌNH THẤY (kể cả quản lý/admin không xem) ·
--   ② thẻ có hạn được nhắc vào Hòm thư (chung lịch 8h sáng với nhắc hạn task) · ③ MỌI nhân sự đều có.
--
--   Thiết kế:
--   • 1 thẻ = 1 dòng `nhan_su_plan`, mã gốc = id (uuid, cấp lúc INSERT, không đổi). 5 trạng thái: y_tuong (ý tưởng / để sau) ·
--     se_lam · dang_lam · xong · bo (bỏ — thay cho xoá: KHÔNG có policy DELETE, thẻ bỏ vẫn khôi phục được).
--   • `xong_at` do TRIGGER đặt (vào 'xong' ⇒ now(); rời 'xong' ⇒ null = "không áp dụng"), app không tự ghi.
--   • Mỗi lần đổi trạng thái / hạn ⇒ TRIGGER đẻ 1 dòng `nhan_su_plan_log` (CLAUDE.md §4: app không tự nhớ ghi vết).
--   • `chuyen_thanh` = 'task:<id>' | 'order:<id>' khi thẻ được giao đi bằng fn_plan_giao_task / fn_plan_dat_order
--     (tạo task/order bằng ĐÚNG hàm sẵn có fn_task_giao / fn_order_tao — cùng luật cấp dưới, cùng thư báo); null = chưa giao.
--   • `thu_tu` số thực: kéo thả chèn giữa 2 thẻ = trung bình 2 số, không phải đánh lại cả cột.
--   • Nhắc hạn: `_plan_nhac_han()` — thẻ chưa xong/bỏ có hạn: trước 1 ngày + quá hạn, mỗi mốc 1 lần (sổ nhan_su_plan_nhac,
--     khoá thẻ × mốc × hạn — đổi hạn thì nhắc lại). Lịch chạy: `_nhac_han_hang_ngay()` gọi cả nhắc task lẫn nhắc kế hoạch;
--     cron đặt ở 202610141558 (SQL Editor, file đó đã sửa để gọi hàm gộp này — CHƯA chạy lần nào nên sửa được).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thêm bảng/hàm/trigger mới.
-- ============================================================================

create table if not exists nhan_su_plan (
  id uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null default public.current_nhan_su_id() references nhan_su(id) on delete cascade,
  noi_dung text not null check (length(btrim(noi_dung)) between 1 and 500),
  ghi_chu text check (ghi_chu is null or length(ghi_chu) <= 4000),
  trang_thai text not null default 'y_tuong' check (trang_thai in ('y_tuong', 'se_lam', 'dang_lam', 'xong', 'bo')),
  han date,                                  -- null = thẻ không có hạn (không áp dụng)
  thu_tu double precision not null default 0,
  xong_at timestamptz,                       -- trigger đặt; null khi thẻ không ở 'xong'
  chuyen_thanh text check (chuyen_thanh is null or chuyen_thanh ~ '^(task|order):[0-9a-f-]{36}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists nhan_su_plan_ns_idx on nhan_su_plan (nhan_su_id, trang_thai, thu_tu);
comment on table nhan_su_plan is
  'MyPlan — Kế hoạch của tôi: thẻ việc/ý tưởng TỰ GHI cho mình, chỉ chính chủ thấy (Thùy 16/10). Mig 202610161600.';

create table if not exists nhan_su_plan_log (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references nhan_su_plan(id) on delete cascade,
  nguoi_id uuid references nhan_su(id),
  trang_thai_cu text, trang_thai_moi text,
  han_cu date, han_moi date,
  created_at timestamptz not null default now()
);
create index if not exists nhan_su_plan_log_plan_idx on nhan_su_plan_log (plan_id, created_at);

create table if not exists nhan_su_plan_nhac (
  plan_id uuid not null references nhan_su_plan(id) on delete cascade,
  moc text not null check (moc in ('truoc_1_ngay', 'qua_han')),
  han date not null,
  gui_at timestamptz not null default now(),
  primary key (plan_id, moc, han)
);

-- ── RLS: chỉ chính chủ ───────────────────────────────────────────────────────
alter table nhan_su_plan      enable row level security;
alter table nhan_su_plan_log  enable row level security;
alter table nhan_su_plan_nhac enable row level security;   -- không policy: chỉ hàm hệ thống đụng

drop policy if exists nhan_su_plan_chu_doc on nhan_su_plan;
create policy nhan_su_plan_chu_doc on nhan_su_plan for select to authenticated using (nhan_su_id = public.current_nhan_su_id());
drop policy if exists nhan_su_plan_chu_them on nhan_su_plan;
create policy nhan_su_plan_chu_them on nhan_su_plan for insert to authenticated with check (nhan_su_id = public.current_nhan_su_id());
drop policy if exists nhan_su_plan_chu_sua on nhan_su_plan;
create policy nhan_su_plan_chu_sua on nhan_su_plan for update to authenticated
  using (nhan_su_id = public.current_nhan_su_id()) with check (nhan_su_id = public.current_nhan_su_id());
-- KHÔNG có policy DELETE: bỏ thẻ = trang_thai 'bo' (khôi phục được).

drop policy if exists nhan_su_plan_log_chu_doc on nhan_su_plan_log;
create policy nhan_su_plan_log_chu_doc on nhan_su_plan_log for select to authenticated
  using (exists (select 1 from nhan_su_plan p where p.id = plan_id and p.nhan_su_id = public.current_nhan_su_id()));

-- ── Trigger: xong_at + updated_at + lịch sử ──────────────────────────────────
create or replace function public._nhan_su_plan_truoc()
returns trigger language plpgsql set search_path to 'public' as $function$
begin
  if tg_op = 'UPDATE' then
    new.nhan_su_id := old.nhan_su_id;   -- thẻ không đổi chủ
    new.updated_at := now();
  end if;
  if new.trang_thai = 'xong' and (tg_op = 'INSERT' or old.trang_thai is distinct from 'xong') then new.xong_at := now();
  elsif new.trang_thai <> 'xong' then new.xong_at := null;
  end if;
  return new;
end $function$;
drop trigger if exists nhan_su_plan_truoc_trg on nhan_su_plan;
create trigger nhan_su_plan_truoc_trg before insert or update on nhan_su_plan
  for each row execute function public._nhan_su_plan_truoc();

create or replace function public._nhan_su_plan_ghi_log()
returns trigger language plpgsql security definer set search_path to 'public' as $function$
begin
  if tg_op = 'INSERT' then
    insert into nhan_su_plan_log (plan_id, nguoi_id, trang_thai_moi, han_moi) values (new.id, public.current_nhan_su_id(), new.trang_thai, new.han);
  elsif new.trang_thai is distinct from old.trang_thai or new.han is distinct from old.han then
    insert into nhan_su_plan_log (plan_id, nguoi_id, trang_thai_cu, trang_thai_moi, han_cu, han_moi)
    values (new.id, public.current_nhan_su_id(), old.trang_thai, new.trang_thai, old.han, new.han);
  end if;
  return null;
end $function$;
drop trigger if exists nhan_su_plan_log_trg on nhan_su_plan;
create trigger nhan_su_plan_log_trg after insert or update on nhan_su_plan
  for each row execute function public._nhan_su_plan_ghi_log();
revoke execute on function public._nhan_su_plan_ghi_log() from public, anon, authenticated;

-- ── Giao thẻ đi: thành task (cho cấp dưới) / thành order (cho bất kỳ ai) ─────
-- INVOKER + RLS: chỉ đọc/sửa được thẻ của chính mình. Tạo task/order bằng hàm sẵn có (cùng luật + cùng thư báo).
-- Thẻ đã giao ⇒ 'xong' + ghi chuyen_thanh (phía mình: việc "giao đi" đã làm xong; theo dõi tiếp ở Việc phát triển / Bảng Order).
create or replace function public.fn_plan_giao_task(p_plan uuid, p_nguoi_lam uuid, p_han date)
returns uuid language plpgsql set search_path to 'public' as $function$
declare p nhan_su_plan%rowtype; v_id uuid;
begin
  select * into p from nhan_su_plan where id = p_plan for update;
  if not found then raise exception 'Không tìm thấy thẻ kế hoạch'; end if;
  if p.chuyen_thanh is not null then raise exception 'Thẻ này đã được giao đi rồi'; end if;
  v_id := public.fn_task_giao(p_nguoi_lam, p.noi_dung, p.ghi_chu, p_han);
  update nhan_su_plan set trang_thai = 'xong', chuyen_thanh = 'task:' || v_id::text where id = p.id;
  return v_id;
end $function$;

create or replace function public.fn_plan_dat_order(p_plan uuid, p_nguoi_nhan uuid, p_han date default null)
returns uuid language plpgsql set search_path to 'public' as $function$
declare p nhan_su_plan%rowtype; v_id uuid;
begin
  select * into p from nhan_su_plan where id = p_plan for update;
  if not found then raise exception 'Không tìm thấy thẻ kế hoạch'; end if;
  if p.chuyen_thanh is not null then raise exception 'Thẻ này đã được giao đi rồi'; end if;
  v_id := public.fn_order_tao(p_nguoi_nhan, p.noi_dung || coalesce(E'\n' || nullif(btrim(p.ghi_chu), ''), ''), p_han);
  update nhan_su_plan set trang_thai = 'xong', chuyen_thanh = 'order:' || v_id::text where id = p.id;
  return v_id;
end $function$;
revoke execute on function public.fn_plan_giao_task(uuid, uuid, date) from public, anon;
revoke execute on function public.fn_plan_dat_order(uuid, uuid, date) from public, anon;
grant execute on function public.fn_plan_giao_task(uuid, uuid, date) to authenticated;
grant execute on function public.fn_plan_dat_order(uuid, uuid, date) to authenticated;

-- ── Nhắc hạn thẻ kế hoạch vào Hòm thư ────────────────────────────────────────
create or replace function public._plan_nhac_han()
returns integer language plpgsql security definer set search_path to 'public' as $function$
declare v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date; t record; v_n integer := 0;
begin
  for t in select id, nhan_su_id, noi_dung, han from nhan_su_plan
           where trang_thai in ('y_tuong', 'se_lam', 'dang_lam') and han = v_hom_nay + 1 loop
    insert into nhan_su_plan_nhac (plan_id, moc, han) values (t.id, 'truoc_1_ngay', t.han) on conflict do nothing;
    if found then
      perform public._hom_thu_gui(t.nhan_su_id, 'viec', 'Kế hoạch tới hạn ngày mai (' || to_char(t.han, 'DD/MM') || ')', t.noi_dung, 'myplan', null);
      v_n := v_n + 1;
    end if;
  end loop;
  for t in select id, nhan_su_id, noi_dung, han from nhan_su_plan
           where trang_thai in ('y_tuong', 'se_lam', 'dang_lam') and han < v_hom_nay loop
    insert into nhan_su_plan_nhac (plan_id, moc, han) values (t.id, 'qua_han', t.han) on conflict do nothing;
    if found then
      perform public._hom_thu_gui(t.nhan_su_id, 'viec', 'Kế hoạch đã quá hạn ' || to_char(t.han, 'DD/MM'),
        t.noi_dung || E'\nLàm xong thì kéo sang Đã xong, chưa kịp thì dời hạn trong Kế hoạch của tôi.', 'myplan', null);
      v_n := v_n + 1;
    end if;
  end loop;
  return v_n;
end $function$;

-- Một hàm cho lịch 8h sáng: nhắc task + nhắc kế hoạch (cron gọi hàm này — xem 202610141558).
create or replace function public._nhac_han_hang_ngay()
returns integer language plpgsql security definer set search_path to 'public' as $function$
begin
  return public._task_nhac_han() + public._plan_nhac_han();
end $function$;

revoke execute on function public._plan_nhac_han() from public, anon, authenticated;
revoke execute on function public._nhac_han_hang_ngay() from public, anon, authenticated;
grant execute on function public._plan_nhac_han() to postgres;
grant execute on function public._nhac_han_hang_ngay() to postgres;
