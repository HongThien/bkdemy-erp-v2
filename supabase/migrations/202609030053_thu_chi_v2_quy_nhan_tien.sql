-- ============================================================================
-- 202609030053 — thu_chi_v2_quy_nhan_tien
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- Thùy 03/09: (a) tài chính có lúc căng, Ngân không bù đủ cho Lộc → hệ phải biết Ngân đã trả bao nhiêu và
-- còn nợ Lộc bao nhiêu để lần sau bù tiếp; (b) quy tắc BK: Ngân LUÔN để ở chỗ Lộc một QUỸ 10tr để Lộc có tiền
-- chi; hoàn ứng = Ngân bù phần đã chi để Lộc về đủ 10tr. Ảnh Lộc gửi Ngân = phiếu QUYẾT TOÁN theo quỹ đó.
--
-- Mô hình (mọi con số tính ở DB — §2.0):
--   quỹ định mức  = chi_cau_hinh['quy_dinh_muc'] (10tr, Lộc/Thùy đổi được trên ERP, không hardcode)
--   tổng chi      = Σ chi_ky.tong_tien (chỉ kỳ ĐÃ CHỐT — quyết toán theo kỳ; phần chưa chốt hiển thị riêng)
--   tổng nhận     = Σ chi_nhan_tien.so_tien (Lộc ghi mỗi lần Ngân chuyển; KHÔNG gắn kỳ vì Ngân trả gộp/trả thiếu)
--   Ngân cần bù   = tổng chi − tổng nhận   (dương: Ngân nợ Lộc · âm: Ngân đã chuyển dư, Lộc giữ hộ)
--   Lộc đang giữ  = định mức − Ngân cần bù = định mức + nhận − chi
-- Phiếu một kỳ = chi kỳ này theo danh mục + NỢ CŨ tại thời điểm chốt (Σ chi các kỳ trước − Σ nhận trước lúc
-- chốt) + TỔNG Ngân cần chuyển. Nợ cũ tính theo mốc thời gian nên phiếu cũ mở lại vẫn ra đúng con số đã gửi.
--
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 3 bảng + hàm; redefine _chi_ky_json / fn_chi_tong_quan (thêm field).
-- ============================================================================

create table if not exists public.chi_cau_hinh (
  ma         text primary key,
  gia_tri    numeric not null,
  ghi_chu    text,
  updated_at timestamptz not null default now()
);
insert into public.chi_cau_hinh (ma, gia_tri, ghi_chu)
values ('quy_dinh_muc', 10000000, 'Quỹ Ngân để ở chỗ Lộc để chi (Thùy 03/09/2026)')
on conflict (ma) do nothing;

create table if not exists public.chi_nhan_tien (
  id         uuid primary key default gen_random_uuid(),
  so_tien    numeric not null check (so_tien > 0),
  ngay       date not null,
  ghi_chu    text,
  tao_boi    uuid references public.nhan_su(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chi_nhan_tien_ngay_idx on public.chi_nhan_tien(ngay desc, created_at desc);

-- Ghi vết mọi thay đổi dòng nhận tiền (sửa/xoá vẫn cho phép — Lộc gõ nhầm số là chuyện thường — nhưng không mất vết).
create table if not exists public.chi_nhan_tien_log (
  id           bigserial primary key,
  nhan_tien_id uuid not null,
  actor        uuid,
  at           timestamptz not null default now(),
  op           text not null,
  truoc        jsonb,
  sau          jsonb
);
create or replace function public.trg_chi_nhan_tien_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then new.updated_at := now(); end if;
  insert into chi_nhan_tien_log (nhan_tien_id, actor, op, truoc, sau)
  values (coalesce(new.id, old.id), public.chi_me_id(), tg_op,
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end);
  return coalesce(new, old);
end $$;
drop trigger if exists tg_chi_nhan_tien_log on public.chi_nhan_tien;
create trigger tg_chi_nhan_tien_log before insert or update or delete on public.chi_nhan_tien
  for each row execute function public.trg_chi_nhan_tien_log();

alter table public.chi_cau_hinh     enable row level security;
alter table public.chi_nhan_tien    enable row level security;
alter table public.chi_nhan_tien_log enable row level security;
drop policy if exists chi_cau_hinh_sel on public.chi_cau_hinh;
drop policy if exists chi_cau_hinh_all on public.chi_cau_hinh;
create policy chi_cau_hinh_sel on public.chi_cau_hinh for select to authenticated using (public.co_chuc_nang('thuchi'));
create policy chi_cau_hinh_all on public.chi_cau_hinh for all to authenticated
  using (public.co_quyen_ghi('thuchi')) with check (public.co_quyen_ghi('thuchi'));
drop policy if exists chi_nhan_tien_sel on public.chi_nhan_tien;
drop policy if exists chi_nhan_tien_all on public.chi_nhan_tien;
create policy chi_nhan_tien_sel on public.chi_nhan_tien for select to authenticated using (public.co_chuc_nang('thuchi'));
create policy chi_nhan_tien_all on public.chi_nhan_tien for all to authenticated
  using (public.co_quyen_ghi('thuchi')) with check (public.co_quyen_ghi('thuchi'));
drop policy if exists chi_nhan_tien_log_sel on public.chi_nhan_tien_log;
create policy chi_nhan_tien_log_sel on public.chi_nhan_tien_log for select to authenticated using (public.co_chuc_nang('thuchi'));
grant select, insert, update, delete on public.chi_cau_hinh, public.chi_nhan_tien to authenticated;
grant select, insert on public.chi_nhan_tien_log to authenticated;
grant usage, select on sequence public.chi_nhan_tien_log_id_seq to authenticated;

-- ── RPC ──
create or replace function public.fn_chi_nhan_tien_them(p_so_tien numeric, p_ngay date, p_ghi_chu text default null)
returns uuid language plpgsql as $$
declare v_id uuid;
begin
  if not public.co_quyen_ghi('thuchi') then raise exception 'Không có quyền ghi Thu chi'; end if;
  insert into chi_nhan_tien (so_tien, ngay, ghi_chu, tao_boi)
  values (p_so_tien, coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date), nullif(trim(coalesce(p_ghi_chu, '')), ''), public.chi_me_id())
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_chi_nhan_tien_list()
returns table (id uuid, so_tien numeric, ngay date, ghi_chu text, tao_boi_ten text, created_at timestamptz)
language sql stable as $$
  select t.id, t.so_tien, t.ngay, t.ghi_chu, n.ho_ten, t.created_at
  from chi_nhan_tien t left join nhan_su n on n.id = t.tao_boi
  where public.co_chuc_nang('thuchi')
  order by t.ngay desc, t.created_at desc limit 500;
$$;

-- Công nợ hiện tại giữa Ngân và Lộc.
create or replace function public.fn_chi_cong_no() returns jsonb language sql stable as $$
  with c as (
    select
      coalesce((select gia_tri from chi_cau_hinh where ma = 'quy_dinh_muc'), 0) as dinh_muc,
      coalesce((select sum(tong_tien) from chi_ky), 0)                          as chi_chot,
      coalesce((select sum(so_tien) from chi_so where ky_id is null), 0)        as chi_chua_chot,
      coalesce((select sum(so_tien) from chi_nhan_tien), 0)                     as nhan
  )
  select jsonb_build_object(
    'quy_dinh_muc', dinh_muc, 'tong_chi_chot', chi_chot, 'tong_chi_chua_chot', chi_chua_chot, 'tong_nhan', nhan,
    'can_bu', chi_chot - nhan,                              -- Ngân cần chuyển để Lộc về đủ quỹ (theo kỳ đã chốt)
    'so_du_sau_chot', dinh_muc + nhan - chi_chot,           -- tiền Lộc đang giữ theo sổ quyết toán
    'so_du_thuc', dinh_muc + nhan - chi_chot - chi_chua_chot -- tiền thực trong túi Lộc (đã trả cả phần chưa chốt)
  ) from c where public.co_chuc_nang('thuchi');
$$;

-- Phiếu kỳ: thêm quỹ định mức · nợ cũ tại thời điểm chốt · tổng Ngân cần chuyển · số dư Lộc sau khi Ngân chuyển đủ.
create or replace function public._chi_ky_json(p_ky uuid)
returns jsonb language sql stable as $$
  with ky as (
    select id, ma, tu_at, den_at, ghi_chu, chot_at, (select ho_ten from nhan_su where id = chot_boi) as chot_boi_ten
    from chi_ky where id = p_ky
    union all
    select null::uuid, null::text,
           coalesce((select max(den_at) from chi_ky), (select min(ghi_so_at) from chi_so where ky_id is null), now()),
           now(), null::text, null::timestamptz, null::text
    where p_ky is null
  ),
  dong as (
    select s.id, k.ma, n.ma_ns, n.ho_ten, s.ngay, s.so_tien, s.muc_dich, s.luu_y, s.ghi_so_at,
           s.danh_muc_id, d.ten as danh_muc_ten
    from chi_so s join chi_khoan k on k.id = s.chi_khoan_id join nhan_su n on n.id = k.nhan_su_id
    join chi_danh_muc d on d.id = s.danh_muc_id
    where (p_ky is not null and s.ky_id = p_ky) or (p_ky is null and s.ky_id is null)
  ),
  dm as (
    select danh_muc_id, ten_danh_muc, so_khoan, so_tien from chi_ky_danh_muc where ky_id = p_ky
    union all
    select danh_muc_id, danh_muc_ten, count(*)::int, sum(so_tien) from dong where p_ky is null group by 1, 2
  ),
  -- Nợ cũ tại mốc chốt: Σ các kỳ chốt TRƯỚC kỳ này − Σ nhận TRƯỚC lúc chốt (kỳ đang xem trước: mốc = now()).
  no as (
    select
      coalesce((select sum(y.tong_tien) from chi_ky y, ky where p_ky is null or y.den_at < ky.den_at), 0)
      - coalesce((select sum(t.so_tien) from chi_nhan_tien t, ky where p_ky is null or t.created_at <= ky.chot_at), 0) as no_cu,
      coalesce((select gia_tri from chi_cau_hinh where ma = 'quy_dinh_muc'), 0) as dinh_muc
  ),
  tong as (select coalesce((select sum(so_tien) from dong), 0) as ky_nay)
  select jsonb_build_object(
    'id', ky.id, 'ma', ky.ma, 'tu_at', ky.tu_at, 'den_at', ky.den_at, 'ghi_chu', ky.ghi_chu,
    'chot_at', ky.chot_at, 'chot_boi_ten', ky.chot_boi_ten,
    'so_khoan', (select count(*) from dong), 'tong_tien', tong.ky_nay,
    'quy_dinh_muc', no.dinh_muc, 'no_cu', no.no_cu, 'tong_can_chuyen', no.no_cu + tong.ky_nay,
    'so_du_truoc_bu', no.dinh_muc - no.no_cu - tong.ky_nay,
    'danh_muc', coalesce((select jsonb_agg(jsonb_build_object('danh_muc_id', danh_muc_id, 'ten', ten_danh_muc,
                    'so_khoan', so_khoan, 'so_tien', so_tien) order by so_tien desc) from dm), '[]'::jsonb),
    'khoan', coalesce((select jsonb_agg(to_jsonb(dong) order by dong.ghi_so_at) from dong), '[]'::jsonb)
  )
  from ky, no, tong
  where public.co_chuc_nang('thuchi');
$$;

create or replace function public.fn_chi_tong_quan() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'cho_duyet',       (select count(*) from chi_khoan where trang_thai = 'cho_duyet'),
    'cho_duyet_tien',  (select coalesce(sum(so_tien_bao), 0) from chi_khoan where trang_thai = 'cho_duyet'),
    'chua_chot',       (select count(*) from chi_so where ky_id is null),
    'chua_chot_tien',  (select coalesce(sum(so_tien), 0) from chi_so where ky_id is null),
    'ky_gan_nhat',     (select jsonb_build_object('ma', ma, 'den_at', den_at, 'tong_tien', tong_tien)
                        from chi_ky order by den_at desc limit 1),
    'can_bu',          (select coalesce(sum(tong_tien), 0) from chi_ky) - (select coalesce(sum(so_tien), 0) from chi_nhan_tien)
  );
$$;

grant execute on function public.fn_chi_nhan_tien_them(numeric, date, text), public.fn_chi_nhan_tien_list(),
  public.fn_chi_cong_no(), public._chi_ky_json(uuid), public.fn_chi_tong_quan() to authenticated;
