-- TỦ QUÀ v1 — viết lại DB layer hệ quà theo style ERP (Thùy chốt 29/08; 30/08 xác nhận Hải DỪNG,
-- ERP/app OPS là đầu ghi duy nhất). Bảng/dữ liệu của Hải GIỮ NGUYÊN làm nền; 15 hàm qlht_* cũ để
-- tham chiếu, client từ nay CHỈ gọi fn_tuqua_* dưới đây.
--
-- ⚠ TIỀN ĐỀ: chạy tay scripts/sql_tuqua_chuyen_chu.sql (SQL Editor, role postgres) TRƯỚC —
--   chuyển owner cụm qlht_* về claude_build. Guard đầu file sẽ chặn nếu chưa chạy.
--
-- Sửa so với bản Hải (spec-qlht-hien-trang.md §"Phần CHƯA LÀM XONG"):
--   1. Vá 2 RACE: mọi fn đụng ví/tồn khoá dòng theo THỨ TỰ CỐ ĐỊNH hoc_sinh → qlht_qua → phiếu/đơn
--      (cùng thứ tự ở mọi fn để không deadlock) rồi mới check số dư/tồn.
--   2. Đủ đường trạng thái: đổi quà có giao/hủy-hoàn-xu; order có về-hàng/giao/từ-chối/hủy-hoàn.
--   3. Actor map chuẩn ERP: tai_khoan.id = jwt_uid() → nhan_su (KHÔNG map qua email như
--      current_nhan_su_id() của Hải — email lệch là từ chối im lặng).
--   4. Vết bắt buộc (CLAUDE §4): bảng qlht_log + trigger tự đẻ dòng lịch sử trên 4 bảng trạng thái.
--   5. View số dư/tồn gate lại bằng la_thanh_vien() (gate email cũ chặn nhầm nhân sự lệch email).
-- Số dư xu = Σ qlht_xu_ledger.amount (CHECK loai chỉ có 6 giá trị, tất cả đều thuộc số dư) —
-- CÔNG THỨC 1 NGUỒN tại fn_tuqua_so_du, view đứng trên cùng logic.

-- ── 0) Guard tiền đề ownership ───────────────────────────────────────────────
do $$
begin
  if (select pg_get_userbyid(relowner) from pg_class
      where relname = 'qlht_doi_qua' and relnamespace = 'public'::regnamespace) <> current_user then
    raise exception 'qlht_* chưa thuộc role %. Chạy tay scripts/sql_tuqua_chuyen_chu.sql trong Supabase SQL Editor (role postgres) rồi npm run migrate lại.', current_user;
  end if;
end $$;

-- ── 1) Cột bổ sung (giao/hủy có vết đọc nhanh; NULL = "không áp dụng", đúng §1.5) ──
alter table qlht_doi_qua
  add column if not exists giao_luc   timestamptz,
  add column if not exists nguoi_giao uuid references nhan_su(id),
  add column if not exists ly_do_huy  text;

alter table qlht_qua_order
  add column if not exists ve_luc     timestamptz,
  add column if not exists giao_luc   timestamptz,
  add column if not exists nguoi_giao uuid references nhan_su(id),
  add column if not exists ly_do_huy  text;

alter table qlht_qua_nhap
  add column if not exists ly_do_huy  text;

-- ── 2) Vết trạng thái: qlht_log + 1 trigger chung 4 bảng (khuôn gay_log) ─────
create table if not exists qlht_log (
  id         uuid primary key default gen_random_uuid(),
  bang       text not null,
  row_id     uuid not null,
  hanh_dong  text not null,          -- 'tao' | trạng thái mới | 'sua'
  truoc      jsonb,
  sau        jsonb,
  actor      uuid,                   -- auth uid (jwt_uid) — map ra nhân sự khi cần đọc
  created_at timestamptz not null default now()
);
create index if not exists idx_qlht_log_row on qlht_log(bang, row_id);
alter table qlht_log enable row level security;
drop policy if exists qlht_log_member_sel on qlht_log;
create policy qlht_log_member_sel on qlht_log for select to authenticated using (public.la_thanh_vien());
grant select on qlht_log to authenticated;

create or replace function public.log_qlht() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif (to_jsonb(old)->>'trang_thai') is distinct from (to_jsonb(new)->>'trang_thai')
    then hd := coalesce(to_jsonb(new)->>'trang_thai', 'sua');
  else hd := 'sua';
  end if;
  insert into qlht_log (bang, row_id, hanh_dong, truoc, sau, actor)
  values (tg_table_name, new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;

drop trigger if exists trg_log_qlht_qua on qlht_qua;
create trigger trg_log_qlht_qua after insert or update on qlht_qua
  for each row execute function public.log_qlht();
drop trigger if exists trg_log_qlht_qua_nhap on qlht_qua_nhap;
create trigger trg_log_qlht_qua_nhap after insert or update on qlht_qua_nhap
  for each row execute function public.log_qlht();
drop trigger if exists trg_log_qlht_doi_qua on qlht_doi_qua;
create trigger trg_log_qlht_doi_qua after insert or update on qlht_doi_qua
  for each row execute function public.log_qlht();
drop trigger if exists trg_log_qlht_qua_order on qlht_qua_order;
create trigger trg_log_qlht_qua_order after insert or update on qlht_qua_order
  for each row execute function public.log_qlht();

-- ── 3) Đọc: policy member-gate BỔ SUNG (OR với policy cũ của Hải — không drop đồ cũ) ──
-- Policy select cũ có thể gate qua current_nhan_su_id() (email) → nhân sự lệch email đọc 0 dòng im lặng.
drop policy if exists qlht_qua_member_sel        on qlht_qua;
create policy qlht_qua_member_sel        on qlht_qua        for select to authenticated using (public.la_thanh_vien());
drop policy if exists qlht_qua_nhap_member_sel   on qlht_qua_nhap;
create policy qlht_qua_nhap_member_sel   on qlht_qua_nhap   for select to authenticated using (public.la_thanh_vien());
drop policy if exists qlht_doi_qua_member_sel    on qlht_doi_qua;
create policy qlht_doi_qua_member_sel    on qlht_doi_qua    for select to authenticated using (public.la_thanh_vien());
drop policy if exists qlht_qua_order_member_sel  on qlht_qua_order;
create policy qlht_qua_order_member_sel  on qlht_qua_order  for select to authenticated using (public.la_thanh_vien());
drop policy if exists qlht_xu_ledger_member_sel  on qlht_xu_ledger;
create policy qlht_xu_ledger_member_sel  on qlht_xu_ledger  for select to authenticated using (public.la_thanh_vien());
grant select on qlht_qua, qlht_qua_nhap, qlht_doi_qua, qlht_qua_order, qlht_xu_ledger to authenticated;
-- GHI: KHÔNG mở policy ghi — sổ xu/kho chỉ ghi qua fn_tuqua_* (security definer). Ngoại lệ giữ nguyên:
-- policy INSERT dòng chốt xu của sql_chot_xu_qlht.sql (luồng Chốt xu tháng ERP đang chạy).

-- ── 4) View gate lại + thêm cột nhận diện HS (cột cũ giữ nguyên tên/kiểu/thứ tự) ──
create or replace view qlht_v_so_du_xu as
select hs.id as hoc_sinh_id,
    hs.ho_ten,
    coalesce(e.exp_total, 0::bigint) as exp_total,
    coalesce(k.xu_chot, 0)::integer as xu_kiem,
    coalesce(l.dieu_chinh, 0::bigint) as xu_dieu_chinh,
    (coalesce(k.xu_chot, 0) + coalesce(l.dieu_chinh, 0))::bigint as so_du,
    hs.ma_hs,
    hs.khoi,
    hs.anh_url,
    hs.trang_thai
  from hoc_sinh hs
    left join (select gami_exp_ledger.hoc_sinh_id, sum(gami_exp_ledger.amount) as exp_total
               from gami_exp_ledger group by gami_exp_ledger.hoc_sinh_id) e on e.hoc_sinh_id = hs.id
    left join (select qlht_xu_ledger.hoc_sinh_id, sum(qlht_xu_ledger.amount) as xu_chot
               from qlht_xu_ledger where qlht_xu_ledger.loai in ('chot_thang','chot_lai')
               group by qlht_xu_ledger.hoc_sinh_id) k on k.hoc_sinh_id = hs.id
    left join (select qlht_xu_ledger.hoc_sinh_id, sum(qlht_xu_ledger.amount) as dieu_chinh
               from qlht_xu_ledger where qlht_xu_ledger.loai in ('cong_tay','tru_tay','doi_qua','hoan')
               group by qlht_xu_ledger.hoc_sinh_id) l on l.hoc_sinh_id = hs.id
  where public.la_thanh_vien();

create or replace view qlht_v_ton_qua as
select q.id as qua_id,
    q.ten,
    q.gia_xu,
    q.anh_url,
    q.mo_ta,
    q.dang_ban,
    coalesce(n.nhap, 0::bigint) - coalesce(d.giao, 0::bigint) as ton
  from qlht_qua q
    left join (select qlht_qua_nhap.qua_id, sum(coalesce(qlht_qua_nhap.so_luong_thuc, qlht_qua_nhap.so_luong)) as nhap
               from qlht_qua_nhap where qlht_qua_nhap.trang_thai = 'da_vao_kho'
               group by qlht_qua_nhap.qua_id) n on n.qua_id = q.id
    left join (select qlht_doi_qua.qua_id, sum(qlht_doi_qua.so_luong) as giao
               from qlht_doi_qua where qlht_doi_qua.trang_thai <> 'huy'
               group by qlht_doi_qua.qua_id) d on d.qua_id = q.id
  where public.la_thanh_vien();
grant select on qlht_v_so_du_xu, qlht_v_ton_qua to authenticated;

-- ── 5) Helper actor + số dư + tồn ────────────────────────────────────────────
-- Actor = nhân sự của tài khoản đăng nhập (chuẩn ERP). NULL = không phải nhân sự → mọi fn ghi từ chối.
create or replace function public.fn_tuqua_actor() returns uuid
language sql stable security definer set search_path = public as $$
  select nhan_su_id from tai_khoan where id = public.jwt_uid() and nhan_su_id is not null
$$;

-- CÔNG THỨC SỐ DƯ 1 NGUỒN: Σ toàn bộ sổ (CHECK loai = đúng 6 loại, đều thuộc số dư).
create or replace function public.fn_tuqua_so_du(p_hoc_sinh_id uuid) returns integer
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự được xem số dư xu'; end if;
  return (select coalesce(sum(amount), 0)::int from qlht_xu_ledger where hoc_sinh_id = p_hoc_sinh_id);
end $$;

-- Tồn 1 quà (cùng công thức view). Fn ghi gọi hàm này SAU KHI đã khoá dòng qlht_qua.
create or replace function public.fn_tuqua_ton(p_qua_id uuid) returns integer
language sql stable security definer set search_path = public as $$
  select (coalesce((select sum(coalesce(so_luong_thuc, so_luong)) from qlht_qua_nhap
                    where qua_id = p_qua_id and trang_thai = 'da_vao_kho'), 0)
        - coalesce((select sum(so_luong) from qlht_doi_qua
                    where qua_id = p_qua_id and trang_thai <> 'huy'), 0))::int
$$;

-- ── 6) Đổi quà tại tủ ────────────────────────────────────────────────────────
-- p_giao_ngay=true (mặc định, story "HS đứng tại tủ"): trừ xu + da_giao 1 phát.
-- p_giao_ngay=false: giữ cho_giao (ca đặc biệt — quà hết hàng trưng bày, hẹn lấy sau).
create or replace function public.fn_tuqua_doi(p_hoc_sinh_id uuid, p_qua_id uuid, p_so_luong integer default 1, p_giao_ngay boolean default true)
returns table(doi_qua_id uuid, so_du_moi integer)
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_du int; v_gia int; v_ton int; v_tong int; v_id uuid; v_ten text; v_ban boolean;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if p_so_luong <= 0 then raise exception 'Số lượng phải lớn hơn 0'; end if;

  perform 1 from hoc_sinh where id = p_hoc_sinh_id for update;          -- khoá ví (thứ tự 1)
  if not found then raise exception 'Không tìm thấy học sinh'; end if;
  select ten, gia_xu, dang_ban into v_ten, v_gia, v_ban
    from qlht_qua where id = p_qua_id for update;                       -- khoá tồn (thứ tự 2)
  if not found then raise exception 'Quà không tồn tại'; end if;
  if not v_ban then raise exception 'Quà "%" đang ngừng bán', v_ten; end if;

  v_ton := public.fn_tuqua_ton(p_qua_id);
  if v_ton < p_so_luong then raise exception 'Không đủ tồn kho (còn %)', v_ton; end if;
  v_tong := v_gia * p_so_luong;
  v_du := (select coalesce(sum(amount), 0) from qlht_xu_ledger where hoc_sinh_id = p_hoc_sinh_id);
  if v_du < v_tong then raise exception 'Không đủ xu (cần %, còn %)', v_tong, v_du; end if;

  insert into qlht_doi_qua (hoc_sinh_id, qua_id, so_luong, xu_tru, nguoi_tao, trang_thai, giao_luc, nguoi_giao)
  values (p_hoc_sinh_id, p_qua_id, p_so_luong, v_tong, v_ns,
          case when p_giao_ngay then 'da_giao' else 'cho_giao' end,
          case when p_giao_ngay then now() end,
          case when p_giao_ngay then v_ns end)
  returning id into v_id;

  insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai, nguoi_tao)
  values (p_hoc_sinh_id, -v_tong, 'doi_qua', 'Đổi quà: ' || v_ten || ' ×' || p_so_luong, v_id, 'doi_qua', v_ns);

  return query select v_id, (v_du - v_tong)::int;
end $$;

-- Giao lượt đổi đang chờ (cho_giao → da_giao)
create or replace function public.fn_tuqua_doi_giao(p_doi_qua_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  select trang_thai into v_tt from qlht_doi_qua where id = p_doi_qua_id for update;
  if not found then raise exception 'Không tìm thấy lượt đổi'; end if;
  if v_tt <> 'cho_giao' then raise exception 'Lượt đổi đang ở trạng thái %', v_tt; end if;
  update qlht_doi_qua set trang_thai = 'da_giao', giao_luc = now(), nguoi_giao = v_ns
   where id = p_doi_qua_id;
end $$;

-- Hủy lượt đổi (hoàn xu + quà tự trả về tồn vì công thức tồn loại trừ 'huy').
-- Cho hủy CẢ khi đã giao (thực tế nhầm lộ sau khi trao) — bắt buộc lý do, vết đầy đủ ở qlht_log.
create or replace function public.fn_tuqua_doi_huy(p_doi_qua_id uuid, p_ly_do text)
returns table(so_du_moi integer)
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text; v_hs uuid; v_xu int;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Hủy phải có lý do'; end if;
  select trang_thai, hoc_sinh_id, xu_tru into v_tt, v_hs, v_xu
    from qlht_doi_qua where id = p_doi_qua_id for update;
  if not found then raise exception 'Không tìm thấy lượt đổi'; end if;
  if v_tt = 'huy' then raise exception 'Lượt đổi đã hủy rồi'; end if;

  update qlht_doi_qua set trang_thai = 'huy', ly_do_huy = btrim(p_ly_do) where id = p_doi_qua_id;
  insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai, nguoi_tao)
  values (v_hs, v_xu, 'hoan', 'Hủy đổi quà: ' || btrim(p_ly_do), p_doi_qua_id, 'doi_qua', v_ns);
  return query select (select coalesce(sum(amount), 0)::int from qlht_xu_ledger where hoc_sinh_id = v_hs);
end $$;

-- ── 7) Order quà theo yêu cầu (đặt trước → duyệt chốt giá TRỪ XU NGAY → quà về → ra tủ nhận) ──
create or replace function public.fn_tuqua_order_tao(p_hoc_sinh_id uuid, p_mo_ta text, p_link text default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_id uuid;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if btrim(coalesce(p_mo_ta, '')) = '' then raise exception 'Mô tả quà không được trống'; end if;
  if not exists (select 1 from hoc_sinh where id = p_hoc_sinh_id) then
    raise exception 'Không tìm thấy học sinh';
  end if;
  insert into qlht_qua_order (hoc_sinh_id, mo_ta, link_tham_khao, nguoi_tao)
  values (p_hoc_sinh_id, btrim(p_mo_ta), nullif(btrim(coalesce(p_link, '')), ''), v_ns)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_tuqua_order_duyet(p_order_id uuid, p_gia_xu integer)
returns table(so_du_moi integer)
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_hs uuid; v_tt text; v_du int;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if p_gia_xu is null or p_gia_xu <= 0 then raise exception 'Giá xu phải lớn hơn 0'; end if;
  select hoc_sinh_id, trang_thai into v_hs, v_tt from qlht_qua_order where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn'; end if;
  if v_tt <> 'cho_duyet' then raise exception 'Đơn đang ở trạng thái %', v_tt; end if;

  perform 1 from hoc_sinh where id = v_hs for update;                   -- khoá ví
  v_du := (select coalesce(sum(amount), 0) from qlht_xu_ledger where hoc_sinh_id = v_hs);
  if v_du < p_gia_xu then raise exception 'Không đủ xu (cần %, còn %)', p_gia_xu, v_du; end if;

  update qlht_qua_order
     set gia_xu = p_gia_xu, trang_thai = 'da_duyet', nguoi_duyet = v_ns, duyet_luc = now()
   where id = p_order_id;
  insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai, nguoi_tao)
  values (v_hs, -p_gia_xu, 'doi_qua', 'Đặt quà: duyệt đơn', p_order_id, 'order', v_ns);
  return query select (v_du - p_gia_xu)::int;
end $$;

create or replace function public.fn_tuqua_order_tu_choi(p_order_id uuid, p_ly_do text) returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Từ chối phải có lý do'; end if;
  select trang_thai into v_tt from qlht_qua_order where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn'; end if;
  if v_tt <> 'cho_duyet' then raise exception 'Chỉ từ chối được đơn chờ duyệt (hiện %)', v_tt; end if;
  update qlht_qua_order set trang_thai = 'tu_choi', ly_do_huy = btrim(p_ly_do) where id = p_order_id;
end $$;

create or replace function public.fn_tuqua_order_ve(p_order_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  select trang_thai into v_tt from qlht_qua_order where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn'; end if;
  if v_tt <> 'da_duyet' then raise exception 'Chỉ đánh dấu quà về cho đơn đã duyệt (hiện %)', v_tt; end if;
  update qlht_qua_order set trang_thai = 'da_ve', ve_luc = now() where id = p_order_id;
end $$;

create or replace function public.fn_tuqua_order_giao(p_order_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  select trang_thai into v_tt from qlht_qua_order where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn'; end if;
  if v_tt <> 'da_ve' then raise exception 'Quà phải về kho (da_ve) mới giao được (hiện %)', v_tt; end if;
  update qlht_qua_order set trang_thai = 'da_giao', giao_luc = now(), nguoi_giao = v_ns
   where id = p_order_id;
end $$;

-- Hủy đơn: cho_duyet (chưa trừ xu — không hoàn) / da_duyet / da_ve (đã trừ — hoàn đủ).
create or replace function public.fn_tuqua_order_huy(p_order_id uuid, p_ly_do text)
returns table(so_du_moi integer)
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text; v_hs uuid; v_gia int;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Hủy phải có lý do'; end if;
  select trang_thai, hoc_sinh_id, gia_xu into v_tt, v_hs, v_gia
    from qlht_qua_order where id = p_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn'; end if;
  if v_tt not in ('cho_duyet', 'da_duyet', 'da_ve') then
    raise exception 'Không hủy được đơn ở trạng thái %', v_tt;
  end if;

  update qlht_qua_order set trang_thai = 'huy', ly_do_huy = btrim(p_ly_do) where id = p_order_id;
  if v_tt in ('da_duyet', 'da_ve') and v_gia is not null then
    insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai, nguoi_tao)
    values (v_hs, v_gia, 'hoan', 'Hủy đặt quà: ' || btrim(p_ly_do), p_order_id, 'order', v_ns);
  end if;
  return query select (select coalesce(sum(amount), 0)::int from qlht_xu_ledger where hoc_sinh_id = v_hs);
end $$;

-- ── 8) Catalog quà ───────────────────────────────────────────────────────────
create or replace function public.fn_tuqua_qua_them(p_ten text, p_gia_xu integer, p_anh_url text default null, p_mo_ta text default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_id uuid;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if coalesce(p_gia_xu, 0) <= 0 then raise exception 'Giá xu phải lớn hơn 0'; end if;
  if btrim(coalesce(p_ten, '')) = '' then raise exception 'Tên quà không được trống'; end if;
  if exists (select 1 from qlht_qua where lower(btrim(ten)) = lower(btrim(p_ten))) then
    raise exception 'Đã có quà tên "%" — dùng Nhập hàng thay vì tạo quà mới', btrim(p_ten);
  end if;
  insert into qlht_qua (ten, gia_xu, anh_url, mo_ta, dang_ban)
  values (btrim(p_ten), p_gia_xu, p_anh_url, p_mo_ta, true) returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_tuqua_qua_sua(p_qua_id uuid, p_ten text, p_gia_xu integer, p_anh_url text default null, p_mo_ta text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if coalesce(p_gia_xu, 0) <= 0 then raise exception 'Giá xu phải lớn hơn 0'; end if;
  if btrim(coalesce(p_ten, '')) = '' then raise exception 'Tên quà không được trống'; end if;
  if exists (select 1 from qlht_qua where lower(btrim(ten)) = lower(btrim(p_ten)) and id <> p_qua_id) then
    raise exception 'Đã có quà khác tên "%"', btrim(p_ten);
  end if;
  update qlht_qua set ten = btrim(p_ten), gia_xu = p_gia_xu, anh_url = p_anh_url, mo_ta = p_mo_ta
   where id = p_qua_id;
  if not found then raise exception 'Quà không tồn tại'; end if;
end $$;

create or replace function public.fn_tuqua_qua_dang_ban(p_qua_id uuid, p_dang_ban boolean) returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  update qlht_qua set dang_ban = p_dang_ban where id = p_qua_id;
  if not found then raise exception 'Quà không tồn tại'; end if;
end $$;

-- ── 9) Nhập/xuất kho ─────────────────────────────────────────────────────────
-- Dương = phiếu chờ vào kho (xác nhận số thực mới cộng tồn). Âm = xuất/hao hụt trừ tồn NGAY
-- (khoá dòng quà chống race với đổi quà; bắt buộc ghi chú lý do).
create or replace function public.fn_tuqua_nhap_tao(p_qua_id uuid, p_so_luong integer, p_ghi_chu text default null)
returns table(nhap_id uuid, trang_thai_moi text)
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_ton int; v_tt text; v_id uuid;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if coalesce(p_so_luong, 0) = 0 then raise exception 'Số lượng phải khác 0'; end if;

  perform 1 from qlht_qua where id = p_qua_id for update;               -- khoá tồn
  if not found then raise exception 'Quà không tồn tại'; end if;

  if p_so_luong > 0 then
    v_tt := 'cho_vao_kho';
  else
    if btrim(coalesce(p_ghi_chu, '')) = '' then raise exception 'Xuất/giảm tồn phải có ghi chú lý do'; end if;
    v_tt := 'da_vao_kho';
    v_ton := public.fn_tuqua_ton(p_qua_id);
    if v_ton + p_so_luong < 0 then raise exception 'Tồn kho không đủ (còn %, giảm %)', v_ton, abs(p_so_luong); end if;
  end if;

  insert into qlht_qua_nhap (qua_id, so_luong, nguoi_tao, ghi_chu, trang_thai, nguoi_xac_nhan, xac_nhan_luc)
  values (p_qua_id, p_so_luong, v_ns, nullif(btrim(coalesce(p_ghi_chu, '')), ''), v_tt,
          case when v_tt = 'da_vao_kho' then v_ns end,
          case when v_tt = 'da_vao_kho' then now() end)
  returning id into v_id;
  return query select v_id, v_tt;
end $$;

create or replace function public.fn_tuqua_nhap_xac_nhan(p_nhap_id uuid, p_so_luong_thuc integer default null)
returns table(ton_moi integer)
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text; v_qua uuid;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if p_so_luong_thuc is not null and p_so_luong_thuc <= 0 then
    raise exception 'Số lượng thực phải lớn hơn 0 (phiếu sai hẳn thì Hủy phiếu)';
  end if;
  select trang_thai, qua_id into v_tt, v_qua from qlht_qua_nhap where id = p_nhap_id for update;
  if not found then raise exception 'Không tìm thấy phiếu nhập'; end if;
  if v_tt <> 'cho_vao_kho' then raise exception 'Phiếu đang ở trạng thái %', v_tt; end if;
  update qlht_qua_nhap
     set trang_thai = 'da_vao_kho', so_luong_thuc = p_so_luong_thuc, nguoi_xac_nhan = v_ns, xac_nhan_luc = now()
   where id = p_nhap_id;
  return query select public.fn_tuqua_ton(v_qua);
end $$;

create or replace function public.fn_tuqua_nhap_huy(p_nhap_id uuid, p_ly_do text default null) returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid; v_tt text;
begin
  v_ns := public.fn_tuqua_actor();
  if v_ns is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  select trang_thai into v_tt from qlht_qua_nhap where id = p_nhap_id for update;
  if not found then raise exception 'Không tìm thấy phiếu nhập'; end if;
  if v_tt <> 'cho_vao_kho' then raise exception 'Chỉ hủy được phiếu đang chờ (hiện %)', v_tt; end if;
  update qlht_qua_nhap set trang_thai = 'huy', ly_do_huy = nullif(btrim(coalesce(p_ly_do, '')), '')
   where id = p_nhap_id;
end $$;
