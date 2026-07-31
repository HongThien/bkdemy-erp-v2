-- ============================================================================
-- 202607311326 — GIAO VIỆC & HIỆU SUẤT v2 (BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md v2)
-- ----------------------------------------------------------------------------
-- VÌ SAO: viết lại sau phiên kiến trúc. Thêm luồng Idea→Backlog→Weekly, tầng
--   hạng mục, BỎ task nhiều người, gộp về MỘT luật chấm. v1 (mig 0080) đã build
--   nhưng 4 bảng ĐỀU RỖNG (verify 07-31: 0 dòng) → drop + dựng lại sạch theo v2,
--   không alter chắp vá. Scope v1: chỉ đo việc PHÁT TRIỂN (chốt CEO 07-31).
--
-- MẤT GÌ (Luật xoá — đã xác nhận CEO 07-31, 4 bảng RỖNG nên KHÔNG mất data):
--   · loai_viec, viec, viec_nguoi_lam, viec_log  (0 dòng mỗi bảng)
--   · trigger trg_log_viec + function public.log_viec()
--   Dựng lại: loai_viec (bỏ phuong_thuc_cham/task_nho), viec (1 người, full
--   lifecycle), + MỚI: y_tuong, hang_muc, viec_log(v2). Ghi-công-idea = DERIVE
--   (viec.y_tuong_id + trang_thai='dat'), không bảng riêng. Hiệu suất kỳ = DERIVE.
-- ============================================================================

-- ── 0) DROP v1 (rỗng) — lá → gốc theo FK. Drop bảng viec CASCADE tự gỡ trigger,
--       nên KHÔNG cần "drop trigger ... on viec" (an toàn cả khi viec chưa tồn tại).
drop table if exists viec_nguoi_lam cascade;
drop table if exists viec_log cascade;
drop table if exists viec cascade;
drop table if exists loai_viec cascade;
drop function if exists public.log_viec() cascade;

-- ── 1) LOẠI VIỆC = bảng ĐỊNH LƯỢNG khối lượng (§6). Bỏ phuong_thuc_cham/task_nho ─
create table if not exists loai_viec (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null,
  thang_kl   jsonb not null default '[]',   -- [{ma,ten,kl}] mức khối lượng khách quan (loại × cỡ)
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── 2) HẠNG MỤC (epic/initiative) — §3. Backlog chứa hạng mục ───────────────
create table if not exists hang_muc (
  id          uuid primary key default gen_random_uuid(),
  ten         text not null,
  mo_ta       text,
  kieu        text not null check (kieu in ('mot_lan','lien_tuc')),
  trang_thai  text not null default 'backlog' check (trang_thai in ('backlog','dang_chay','xong','dung')),
  pham_vi     numeric,                       -- NULLABLE (§3.1): không biết tổng → để trống, đo bằng burn-up
  chan_troi   date,                          -- mốc BẮT BUỘC QUYẾT LẠI (§3.3), không phải deadline
  gia_tri     int check (gia_tri between 1 and 3),   -- WSJF thô (top-down CEO có thể chấm)
  co          int check (co between 1 and 3),
  tac_gia_id  uuid references nhan_su(id),    -- CEO tạo thẳng (top-down) hoặc null
  created_at  timestamptz not null default now()
  -- so_lat_da_ra = DERIVE: count(viec where hang_muc_id=? and trang_thai='dat')
);
create index if not exists idx_hang_muc_trang_thai on hang_muc(trang_thai);

-- ── 3) Ý TƯỞNG (idea) — §2. Idea→Backlog = ĐỔI TRẠNG THÁI (cùng dòng) ────────
create table if not exists y_tuong (
  id               uuid primary key default gen_random_uuid(),
  tieu_de          text not null,
  mo_ta            text,
  tac_gia_id       uuid not null references nhan_su(id),
  trang_thai       text not null default 'moi'
                     check (trang_thai in ('moi','backlog','da_trien_khai','ngu_dong','tu_choi')),
  ly_do_tu_choi    text,                      -- BẮT BUỘC khi từ chối, hiện cho tác giả (§2.1)
  gia_tri          int check (gia_tri between 1 and 3),   -- refinement trưởng nhánh (§2.2), null tới khi chấm
  co               int check (co between 1 and 3),
  ngay_vao_backlog date,                       -- set lúc chuyển 'backlog' → cửa ngủ đông 3 tháng (§2.3)
  hang_muc_id      uuid references hang_muc(id),  -- nullable: idea được nâng thành hạng mục liên tục
  created_at       timestamptz not null default now()
);
create index if not exists idx_y_tuong_trang_thai on y_tuong(trang_thai);

-- ── 4) VIỆC (task) — §4. 1 task = 1 NGƯỜI. Full lifecycle ────────────────────
create table if not exists viec (
  id                 uuid primary key default gen_random_uuid(),
  loai_viec_id       uuid references loai_viec(id),      -- nullable (phát sinh có thể không loại)
  hang_muc_id        uuid references hang_muc(id),       -- nullable (null = task lẻ/phát sinh)
  y_tuong_id         uuid references y_tuong(id),        -- nullable — nối để GHI CÔNG tác giả (§2.6)
  tieu_de            text not null,
  muc_tieu           text,
  output             text,                               -- output rõ để nghiệm thu (§0.6)
  mo_ta              text,
  nguoi_lam_id       uuid not null references nhan_su(id),   -- ⭐ 1 NGƯỜI (bỏ junction v1)
  nguoi_giao_id      uuid not null references nhan_su(id),
  khoi_luong         numeric not null,                   -- chốt LÚC GIAO (§6)
  nguon              text not null default 'ke_hoach' check (nguon in ('ke_hoach','phat_sinh')),
  trang_thai         text not null default 'moi_giao'
                       check (trang_thai in ('moi_giao','dang_lam','cho_nghiem_thu','dat','tra_lai','hold','huy','chuyen')),
  -- Tiến độ / hạn
  deadline           date,                               -- hiện hành (sau gia hạn nếu duyệt)
  deadline_goc       date,                               -- ⭐ BẤT BIẾN (§4.3) — luôn lưu để soi
  so_lan_gia_han     int not null default 0,             -- trần GIA_HAN_TOI_DA (§4.8)
  ngay_nop           date,                               -- ngày bấm hoàn thành LẦN ĐƯỢC DUYỆT ĐẠT (§4.8)
  ky_tuan            date,                               -- ⭐ = TUẦN PLAN (thứ 2 VN của tuần giao) — kỳ tính
  -- Chấm
  tien_do            numeric,                            -- 0-100 (máy tính từ ngay_nop vs deadline)
  chat_luong         numeric,                            -- 0-100 (leader chấm, trần theo so_lan_tra_lai)
  phan_tram          numeric,                            -- W_TIEN_DO×td + W_CHAT_LUONG×cl (dẫn xuất)
  so_lan_tra_lai     int not null default 0,             -- trần chất lượng 100/85/70 (§4.6)
  evidence           text,                               -- ⭐ NGƯỜI LÀM nộp lúc hoàn thành (§4.2)
  -- Huỷ / hold / chuyển
  phan_tram_ghi_nhan numeric,                            -- leader NHẬP TAY khi huỷ/chuyển (§4.8)
  ly_do_huy          text,
  ngay_hold          timestamptz,                        -- HOLD_CANH_BAO_TUAN quá 3 tuần → đỏ (§4.4)
  viec_ke_thua_id    uuid references viec(id),           -- task đẻ ra khi CHUYỂN người (§4.5)
  -- Vết thời gian
  ghi_chu_nghiem_thu text,
  created_at         timestamptz not null default now(),
  hoan_thanh_at      timestamptz,                        -- NS bấm "hoàn thành"
  nghiem_thu_at      timestamptz
);
create index if not exists idx_viec_nguoi_lam on viec(nguoi_lam_id);
create index if not exists idx_viec_nguoi_giao on viec(nguoi_giao_id);
create index if not exists idx_viec_ky_tuan on viec(ky_tuan);
create index if not exists idx_viec_hang_muc on viec(hang_muc_id);
create index if not exists idx_viec_trang_thai on viec(trang_thai);

-- ── 5) LOG đổi trạng thái (§4 — mọi đổi state ghi vết, TRIGGER ở DB) ─────────
create table if not exists viec_log (
  id        uuid primary key default gen_random_uuid(),
  viec_id   uuid not null references viec(id) on delete cascade,
  hanh_dong text not null,          -- tao | doi_trang_thai | nghiem_thu | gia_han | huy | hold | chuyen | sua
  truoc     jsonb,
  sau       jsonb not null,
  actor     uuid,
  ts        timestamptz not null default now()
);
create index if not exists idx_viec_log_viec on viec_log(viec_id);

create or replace function public.log_viec() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai = 'dat'     and old.trang_thai = 'cho_nghiem_thu' then hd := 'nghiem_thu';
  elsif new.trang_thai = 'tra_lai' and old.trang_thai = 'cho_nghiem_thu' then hd := 'nghiem_thu';
  elsif new.trang_thai = 'huy'     and old.trang_thai <> 'huy'    then hd := 'huy';
  elsif new.trang_thai = 'hold'    and old.trang_thai <> 'hold'   then hd := 'hold';
  elsif new.trang_thai = 'chuyen'  and old.trang_thai <> 'chuyen' then hd := 'chuyen';
  elsif new.so_lan_gia_han <> old.so_lan_gia_han then hd := 'gia_han';
  elsif new.trang_thai <> old.trang_thai then hd := 'doi_trang_thai';
  else hd := 'sua';
  end if;
  insert into viec_log (viec_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_viec on viec;
create trigger trg_log_viec after insert or update on viec
  for each row execute function public.log_viec();

-- ── 6) HOUSEKEEPING — auto-đóng chờ-nghiệm-thu quá hạn + auto ngủ-đông backlog ─
-- Gọi lazy (rpc) khi mở màn Review/Cá nhân. Idempotent. Hằng số ĐỒNG BỘ với
-- src/lib/giaoviec-config.ts (§4.8) — chỉ path auto-close cần bản SQL này:
--   TU_DONG_DONG_NGAY=7 · NGU_DONG_THANG=3 · TRE_MOI_NGAY=10 · SAN_TIEN_DO=40 · W_TIEN_DO=0.3 · W_CHAT_LUONG=0.7
create or replace function public.giaoviec_housekeeping() returns void
language plpgsql security definer set search_path = public as $$
begin
  -- (a) cho_nghiem_thu quá 7 ngày → TỰ ĐÓNG 'dat' mặc định (chất lượng 100). Lỗ đen là lỗi sếp (§4.6).
  update viec v set
    trang_thai   = 'dat',
    ngay_nop     = coalesce(v.ngay_nop, (v.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date),
    tien_do      = t.td,
    chat_luong   = (array[100,85,70])[least(v.so_lan_tra_lai,2)+1],
    phan_tram    = round((0.3 * t.td + 0.7 * (array[100,85,70])[least(v.so_lan_tra_lai,2)+1])::numeric, 1),
    nghiem_thu_at = now(),
    ghi_chu_nghiem_thu = coalesce(v.ghi_chu_nghiem_thu,'') || '[tự đóng: quá 7 ngày chờ nghiệm thu]'
  from (
    select id, case when d <= 0 then 100 else greatest(40, 100 - 10 * d) end as td
    from (
      select id, greatest(0, ((hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date - deadline)) as d
      from viec
      where trang_thai = 'cho_nghiem_thu'
        and hoan_thanh_at is not null
        and hoan_thanh_at < now() - interval '7 days'
    ) x
  ) t
  where v.id = t.id and v.trang_thai = 'cho_nghiem_thu';

  -- (b) backlog nằm quá 3 tháng chưa chọn → tự NGỦ ĐÔNG (không xoá, vẫn tra được §2.3)
  update y_tuong set trang_thai = 'ngu_dong'
  where trang_thai = 'backlog'
    and ngay_vao_backlog is not null
    and ngay_vao_backlog < (now() at time zone 'Asia/Ho_Chi_Minh')::date - interval '3 months';
end $$;

-- ── 7) RLS — gate thành viên (data DISABLE/staffs ENABLE = member gate) ──────
alter table loai_viec enable row level security;
alter table hang_muc  enable row level security;
alter table y_tuong   enable row level security;
alter table viec      enable row level security;
alter table viec_log  enable row level security;

-- drop-if-exists trước create: hang_muc/y_tuong KHÔNG bị drop ở §0 (bảng mới) nên
-- create policy sẽ trùng khi migrate chạy lại → phải gỡ trước cho idempotent.
drop policy if exists loai_viec_member_all on loai_viec;
drop policy if exists hang_muc_member_all  on hang_muc;
drop policy if exists y_tuong_member_all   on y_tuong;
drop policy if exists viec_member_all      on viec;
drop policy if exists viec_log_member_all  on viec_log;

create policy loai_viec_member_all on loai_viec for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hang_muc_member_all  on hang_muc  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy y_tuong_member_all   on y_tuong   for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy viec_member_all      on viec      for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy viec_log_member_all  on viec_log  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

grant select, insert, update, delete on loai_viec to authenticated;
grant select, insert, update, delete on hang_muc  to authenticated;
grant select, insert, update, delete on y_tuong   to authenticated;
grant select, insert, update, delete on viec      to authenticated;
grant select, insert on viec_log to authenticated;
grant execute on function public.giaoviec_housekeeping() to authenticated;
