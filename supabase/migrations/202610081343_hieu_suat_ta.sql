-- ============================================================================
-- 202610081343 — hieu_suat_ta
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Màn "Chất lượng vận hành" cũ (CL − (100 − TĐ), leader chấm CL tay, toán ở JS) đã outdate.
--   Hiệu suất TRỢ GIẢNG mới — CEO chốt 08/10 (spec-hieu-suat-ta.md):
--     · 3 đầu việc: Chấm BTVN 50% · Chấm ET 15% · Bổ trợ 35%.
--     · Mỗi task BTVN/ET = 100 − trừ tiến độ − 15 × số gậy CHẤT LƯỢNG (trừ thẳng điểm, sàn 0).
--       Tiến độ theo LẦN ĐÓNG ĐẦU TIÊN: trễ ≤6h −10 · 6–12h −20 · 12–24h −30 · >24h −40.
--       Gậy chất lượng = gậy đã vào sổ, chưa thu hồi, KHÁC loại "Chậm deadline" (trễ đã phạt ở tiến độ).
--     · Hiệu suất đầu việc = trung bình các task; tổng = trung bình có trọng số.
--     · Bổ trợ: chỉ tiêu 8 giờ/tháng, hệ thống CHƯA đo được giờ chính xác ⇒ chỉ HIỆN đủ số liệu
--       từng ca, KHÔNG đề xuất điểm; quản lý nhập tay.
--     · Kèm "tỉ lệ hoàn thành dữ liệu" để soi bất thường (đóng cho đủ điều kiện mà không chấm thật).
--     · Mọi con số: hệ thống ĐỀ XUẤT + quản lý CHỐT (TA × tháng × đầu việc), lưu cả số đề xuất lúc
--       chốt để sau đo độ chính xác của hệ thống. Có chỗ GHI THÊM việc ngoài hệ thống.
--   Task chỉ tồn tại khi buổi CÓ CÂU của phase đó (gami_session_problems): đo 09/2026 — 215/216 task
--   BTVN đã đóng có câu, 33/36 task "ảo" chưa đóng không có câu nào. Áp đối xứng cho ET.
--   Không sửa hàm/bảng cũ nào — màn cũ vẫn chạy được nếu cần đối chiếu.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không có.
-- ============================================================================

-- ── Tham số (MỘT chỗ duy nhất) ───────────────────────────────────────────────
create or replace function _hsta_tru_tien_do(p_tre_gio numeric) returns integer
language sql immutable as $$
  select case when p_tre_gio is null or p_tre_gio <= 0 then 0
              when p_tre_gio <= 6  then 10
              when p_tre_gio <= 12 then 20
              when p_tre_gio <= 24 then 30
              else 40 end
$$;
create or replace function _hsta_tru_moi_gay() returns integer language sql immutable as $$ select 15 $$;
create or replace function _hsta_ti_trong(p_dau_viec text) returns numeric language sql immutable as $$
  select case p_dau_viec when 'btvn' then 50 when 'et' then 15 when 'bo_tro' then 35 end::numeric
$$;
create or replace function _hsta_chi_tieu_gio_bo_tro() returns numeric language sql immutable as $$ select 8::numeric $$;

-- ── Bảng CHỐT: quản lý chốt điểm TA × tháng × đầu việc ─────────────────────────
create table hsta_chot (
  nhan_su_id    uuid not null references nhan_su(id),
  ky            date not null check (ky = date_trunc('month', ky)::date),
  dau_viec      text not null check (dau_viec in ('btvn', 'et', 'bo_tro', 'tong')),
  diem_he_thong numeric,                         -- số hệ thống đề xuất LÚC CHỐT; NULL = hệ thống không đề xuất (bổ trợ)
  diem_chot     numeric not null check (diem_chot between 0 and 100),
  ghi_chu       text not null default '',
  nguoi_chot    uuid references nhan_su(id),
  chot_at       timestamptz not null default now(),
  primary key (nhan_su_id, ky, dau_viec)
);

create table hsta_chot_log (
  id         uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null,
  ky         date not null,
  dau_viec   text not null,
  hanh_dong  text not null check (hanh_dong in ('chot', 'sua', 'bo_chot')),
  cu         jsonb,
  moi        jsonb,
  actor      uuid,
  at         timestamptz not null default now()
);
create index hsta_chot_log_idx on hsta_chot_log (nhan_su_id, ky);

create or replace function _hsta_chot_ghi_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into hsta_chot_log (nhan_su_id, ky, dau_viec, hanh_dong, cu, moi, actor)
  values (coalesce(new.nhan_su_id, old.nhan_su_id), coalesce(new.ky, old.ky), coalesce(new.dau_viec, old.dau_viec),
          case tg_op when 'INSERT' then 'chot' when 'UPDATE' then 'sua' else 'bo_chot' end,
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end,
          public.current_nhan_su_id());
  return null;
end $$;
create trigger trg_hsta_chot_log after insert or update or delete on hsta_chot
  for each row execute function _hsta_chot_ghi_log();

-- ── Bảng GHI THÊM: việc ngoài hệ thống (Trang ghi) ─────────────────────────────
create table hsta_ghi_them (
  id         uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null references nhan_su(id),
  ky         date not null check (ky = date_trunc('month', ky)::date),
  dau_viec   text not null check (dau_viec in ('btvn', 'et', 'bo_tro', 'khac')),
  noi_dung   text not null check (btrim(noi_dung) <> ''),
  so_gio     numeric check (so_gio > 0),         -- NULL = dòng này không phải giờ (không áp dụng)
  nguoi_ghi  uuid references nhan_su(id),
  created_at timestamptz not null default now(),
  xoa_at     timestamptz,                         -- kho rác (không xoá cứng)
  xoa_boi    uuid references nhan_su(id)
);
create index hsta_ghi_them_idx on hsta_ghi_them (nhan_su_id, ky) where xoa_at is null;

alter table hsta_chot     enable row level security;
alter table hsta_chot_log enable row level security;
alter table hsta_ghi_them enable row level security;
create policy hsta_chot_select     on hsta_chot     for select to authenticated using (la_thanh_vien());
create policy hsta_chot_ghi        on hsta_chot     for all    to authenticated using (co_quyen_ghi('db_chatluong')) with check (co_quyen_ghi('db_chatluong'));
create policy hsta_chot_log_select on hsta_chot_log for select to authenticated using (la_thanh_vien());
create policy hsta_ghi_them_select on hsta_ghi_them for select to authenticated using (la_thanh_vien());
create policy hsta_ghi_them_ghi    on hsta_ghi_them for all    to authenticated using (co_quyen_ghi('db_chatluong')) with check (co_quyen_ghi('db_chatluong'));

-- ════════════════════════════════════════════════════════════════════════════
-- ĐỌC 1: từng task BTVN / ET của TA trong khoảng ngày
-- ════════════════════════════════════════════════════════════════════════════
create or replace function fn_hsta_task(p_tu date, p_den date, p_ns uuid default null)
returns table (
  nhan_su_id uuid, ho_ten text, dau_viec text, buoi_id uuid, ten_lop text, ngay date,
  han timestamptz, dong_dau timestamptz, dong_cuoi timestamptz, so_mo_lai integer,
  tre_gio numeric, tru_tien_do integer, gay_chat_luong integer, gay_tre integer, tru_chat_luong integer,
  diem numeric, tinh boolean, ly_do_khong_tinh text, co text[],
  -- dữ liệu (BTVN)
  so_co_mat integer, so_kq integer, nop_dung_han integer, nop_muon integer, khong_lam integer, xin_phep integer,
  pct_dung_han numeric, pct_dung_han_lop_khac numeric,
  -- dữ liệu (ET)
  so_cau integer, o_can integer, o_cham integer, pct_o_cham numeric, so_hs_vang_co_diem integer
)
language plpgsql stable as $$
#variable_conflict use_column
begin
  if not public.co_chuc_nang('db_chatluong') then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with v as (
    select v.*, ns.ho_ten
    from public.fn_viec_buoi_thuong(p_tu, p_den, true) v
    join nhan_su ns on ns.id = v.nhan_su_id
    where v.vai = 'tg' and v.tab in ('btvn', 'et') and not (v.tab = 'et' and v.et_online)
      and not ns.an_xep_hang
      and (p_ns is null or v.nhan_su_id = p_ns)
      and (v.dong_at is not null or v.han <= now())   -- chưa tới hạn mà chưa đóng = chưa phải việc để đo
  ),
  t as materialized (
    select v.*,
      -- lần đóng ĐẦU TIÊN: lịch sử phase (từ 23/09) + giá trị cũ khi mở lại/đổi mốc; trước đó chỉ còn dong_at
      least(v.dong_at,
            (select min(l.at) from buoi_hoc_phase_log l where l.buoi_hoc_id = v.buoi_id and l.phase = v.tab and l.su_kien = 'dong'),
            (select min(l.cu) from buoi_hoc_phase_log l where l.buoi_hoc_id = v.buoi_id and l.phase = v.tab and l.su_kien in ('mo_lai', 'doi_moc'))) as dd,
      (select count(*) from buoi_hoc_phase_log l where l.buoi_hoc_id = v.buoi_id and l.phase = v.tab and l.su_kien = 'mo_lai')::int as mo_lai,
      exists (select 1 from ta_vang tv where tv.buoi_hoc_id = v.buoi_id and tv.nhan_su_id = v.nhan_su_id) as vang,
      (select count(*) from gami_session_problems p where p.buoi_hoc_id = v.buoi_id and p.phase = v.tab and not p.hidden)::int as n_cau,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g left join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and coalesce(lo.ma, '') <> 'cham_deadline')::int as g_cl,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and lo.ma = 'cham_deadline')::int as g_tre,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = v.buoi_id and h.diem_danh = 'co_mat')::int as n_co_mat
    from v
  ),
  -- materialized: ước lượng 1 dòng từ hàm set-returning ⇒ planner lặp lại cả CTE cho MỖI task (đo: 474 × 50ms = 25s)
  btvn as materialized (
    select t.buoi_id, t.nhan_su_id,
      count(k.*)::int as kq,
      count(*) filter (where k.trang_thai_nop = 'nop_dung_han')::int as dung,
      count(*) filter (where k.trang_thai_nop = 'nop_muon')::int as muon,
      count(*) filter (where k.trang_thai_nop = 'khong_lam')::int as khong,
      count(*) filter (where k.trang_thai_nop = 'xin_phep')::int as phep
    from t join btvn_ket_qua k on k.buoi_hoc_id = t.buoi_id
    where t.tab = 'btvn' group by t.buoi_id, t.nhan_su_id
  ),
  -- nhân chứng độc lập: CHÍNH các em đó nộp đúng hạn bao nhiêu ở LỚP KHÁC (TA khác chấm), ±90 ngày
  btvn_lop_khac as materialized (
    select t.buoi_id, t.nhan_su_id,
      count(*) as n,
      count(*) filter (where k2.trang_thai_nop = 'nop_dung_han') as dung
    from t
    join btvn_ket_qua k on k.buoi_hoc_id = t.buoi_id
    join btvn_ket_qua k2 on k2.hoc_sinh_id = k.hoc_sinh_id and k2.trang_thai_nop is not null and k2.trang_thai_nop <> 'xin_phep'
    join buoi_hoc b2 on b2.id = k2.buoi_hoc_id and b2.lop_id <> t.lop_id and b2.ngay between t.ngay - 90 and t.ngay + 30
    where t.tab = 'btvn' group by t.buoi_id, t.nhan_su_id
  ),
  et as materialized (
    select t.buoi_id, t.nhan_su_id,
      (select count(*) from buoi_hoc_hs h join gami_session_problems p on p.buoi_hoc_id = t.buoi_id and p.phase = 'et' and not p.hidden
                                                                      and (p.hoc_sinh_id is null or p.hoc_sinh_id = h.hoc_sinh_id)
        where h.buoi_hoc_id = t.buoi_id and h.diem_danh = 'co_mat')::int as can,
      -- đi qua câu của buổi (index buoi_hoc_id, phase) → điểm theo problem_id; gami_grades không có index buoi_hoc_id
      (select count(*) from gami_session_problems p join gami_grades g on g.problem_id = p.id
                                         join buoi_hoc_hs h on h.buoi_hoc_id = t.buoi_id and h.hoc_sinh_id = g.hoc_sinh_id and h.diem_danh = 'co_mat'
        where p.buoi_hoc_id = t.buoi_id and p.phase = 'et' and not p.hidden)::int as cham,
      (select count(distinct g.hoc_sinh_id) from gami_session_problems p join gami_grades g on g.problem_id = p.id
        where p.buoi_hoc_id = t.buoi_id and p.phase = 'et'
          and not exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = t.buoi_id and h.hoc_sinh_id = g.hoc_sinh_id and h.diem_danh = 'co_mat'))::int as hs_vang_co_diem
    from t where t.tab = 'et'
  ),
  s as (
    select t.*,
      extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600 as tre,
      case when t.vang then 'TA vắng buổi này'
           when t.n_cau = 0 then case t.tab when 'btvn' then 'Buổi không có câu BTVN trên hệ thống' else 'Buổi không có câu ET trên hệ thống' end
           when t.han is null then 'Chưa xác định được hạn (không tìm thấy buổi kế tiếp)'
      end as khong_tinh
    from t
  )
  select s.nhan_su_id, s.ho_ten, s.tab, s.buoi_id, s.ten_lop, s.ngay,
    s.han, s.dd, s.dong_at, s.mo_lai,
    round(greatest(s.tre, 0)::numeric, 1),
    public._hsta_tru_tien_do(s.tre::numeric),
    s.g_cl, s.g_tre,
    s.g_cl * public._hsta_tru_moi_gay(),
    case when s.khong_tinh is null
         then greatest(0, 100 - public._hsta_tru_tien_do(s.tre::numeric) - s.g_cl * public._hsta_tru_moi_gay())::numeric end,
    s.khong_tinh is null,
    s.khong_tinh,
    array_remove(array[
      case when s.dd is null then 'chua_dong' end,
      case when s.mo_lai > 0 then 'mo_lai' end,
      case when s.tab = 'btvn' and b.kq >= 3 and (b.muon + b.khong) * 1.0 / b.kq >= 0.4 then 'nop_muon_cao' end,
      case when s.tab = 'btvn' and b.kq >= 3 and lk.n >= 5
                and b.dung * 100.0 / b.kq < lk.dung * 100.0 / lk.n - 30 then 'lech_lop_khac' end,
      case when s.tab = 'btvn' and s.dd is not null and s.n_cau > 0 and coalesce(b.kq, 0) = 0 then 'dong_khong_du_lieu' end,
      case when s.tab = 'et' and s.dd is not null and s.n_cau > 0 and e.can > 0 and e.cham < e.can then 'et_thieu_o' end,
      case when s.tab = 'et' and s.dd is not null and s.n_cau = 0 then 'dong_khong_du_lieu' end,
      case when s.tab = 'et' and e.hs_vang_co_diem > 0 then 'hs_vang_co_diem' end
    ], null),
    s.n_co_mat,
    case when s.tab = 'btvn' then coalesce(b.kq, 0) end,
    b.dung, b.muon, b.khong, b.phep,
    case when b.kq > 0 then round(b.dung * 100.0 / b.kq, 0) end,
    case when lk.n >= 5 then round(lk.dung * 100.0 / lk.n, 0) end,
    s.n_cau,
    e.can, e.cham,
    case when e.can > 0 then round(e.cham * 100.0 / e.can, 0) end,
    e.hs_vang_co_diem
  from s
  left join btvn b on b.buoi_id = s.buoi_id and b.nhan_su_id = s.nhan_su_id
  left join btvn_lop_khac lk on lk.buoi_id = s.buoi_id and lk.nhan_su_id = s.nhan_su_id
  left join et e on e.buoi_id = s.buoi_id and e.nhan_su_id = s.nhan_su_id
  order by s.ho_ten, s.tab, s.ngay;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- ĐỌC 2: từng ca bổ trợ (bù · yếu · đuổi) — CHỈ số liệu, không chấm điểm
-- ════════════════════════════════════════════════════════════════════════════
create or replace function fn_hsta_bo_tro(p_tu date, p_den date, p_ns uuid default null)
returns table (
  nhan_su_id uuid, ho_ten text, buoi_id uuid, loai text, ngay date,
  gio_bat_dau time, gio_ket_thuc time, so_phut integer, khung text,
  hoc_sinh text[], so_co_mat integer, so_vang integer, lop_goc text,
  danh_gia_xong_at timestamptz, bai_dau_at timestamptz, so_gay integer, co text[]
)
language plpgsql stable as $$
#variable_conflict use_column
begin
  if not public.co_chuc_nang('db_chatluong') then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with b as (
    select bh.id, coalesce(bh.nguoi_day_tg, bh.nguoi_day) as ns, bh.loai, bh.ngay,
      coalesce(bh.gio_bat_dau, c.gio_bat_dau) as gbd, coalesce(bh.gio_ket_thuc, c.gio_ket_thuc) as gkt,
      bh.danh_gia_xong_at
    from buoi_hoc bh left join ca_bo_tro c on c.id = bh.ca_bo_tro_id
    where bh.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and bh.trang_thai <> 'huy'
      and bh.ngay between p_tu and p_den
      and coalesce(bh.nguoi_day_tg, bh.nguoi_day) is not null
      and (p_ns is null or coalesce(bh.nguoi_day_tg, bh.nguoi_day) = p_ns)
  ),
  x as (
    select b.*, ns.ho_ten as ten_ns,
      (select coalesce(array_agg(hs.ho_ten order by hs.ho_ten), '{}') from buoi_hoc_hs h join hoc_sinh hs on hs.id = h.hoc_sinh_id
        where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat') as ds_hs,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat')::int as co_mat,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh in ('vang', 'vang_phep'))::int as vang,
      (select string_agg(distinct l.ten_lop, ', ') from buoi_hoc_hs h join buoi_hoc g on g.id = h.bu_cho_buoi_id join lop l on l.id = g.lop_id
        where h.buoi_hoc_id = b.id) as lop_goc,
      (select min(least(t.mo_at, coalesce(t.in_giay_at, t.mo_at))) from bai_test t where t.buoi_hoc_id = b.id) as bai_dau,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g where g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
        and g.ref_id like 'vh:' || b.id::text || '|%')::int as gay
    from b join nhan_su ns on ns.id = b.ns
    where not ns.an_xep_hang
  )
  select x.ns, x.ten_ns, x.id, x.loai, x.ngay, x.gbd, x.gkt,
    case when x.gkt > x.gbd then (extract(epoch from (x.gkt - x.gbd)) / 60)::int end,
    x.ngay::text || ' ' || coalesce(x.gbd::text, '?') || '-' || coalesce(x.gkt::text, '?'),
    x.ds_hs, x.co_mat, x.vang, x.lop_goc, x.danh_gia_xong_at, x.bai_dau, x.gay,
    array_remove(array[
      case when x.co_mat = 0 then 'khong_hs' end,
      case when x.gbd is null or x.gkt is null then 'thieu_gio' end,
      case when x.gkt <= x.gbd then 'ket_thuc_le' end,
      case when x.gbd < time '07:00' or x.gkt > time '22:30' then 'gio_bat_thuong' end,
      case when x.co_mat > 0 and exists (select 1 from x x2 where x2.ns = x.ns and x2.id <> x.id and x2.co_mat > 0 and x2.ngay = x.ngay
                                          and x2.gbd < x.gkt and x.gbd < x2.gkt
                                          and (x2.gbd, x2.gkt) is distinct from (x.gbd, x.gkt)) then 'trung_khung' end,  -- cùng khung y hệt = 1 ca nhiều em (bình thường)
      case when x.co_mat > 0 and x.danh_gia_xong_at is null then 'chua_danh_gia' end
    ], null)
  from x
  order by x.ten_ns, x.ngay, x.gbd nulls last;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- ĐỌC 3: bảng tháng — mỗi TA 1 dòng: đề xuất + chốt + ghi thêm
-- ════════════════════════════════════════════════════════════════════════════
create or replace function fn_hsta_thang(p_ky date, p_ns uuid default null)
returns table (
  nhan_su_id uuid, ho_ten text,
  btvn_so_task integer, btvn_so_tinh integer, btvn_de_xuat numeric, btvn_so_co integer,
  et_so_task integer, et_so_tinh integer, et_de_xuat numeric, et_so_co integer,
  bt_so_ca integer, bt_gio_he_thong numeric, bt_gio_ghi_them numeric, bt_chi_tieu_gio numeric, bt_so_co integer,
  tong_de_xuat numeric, tong_du_3_dau_viec boolean,
  chot jsonb, so_ghi_them integer
)
language plpgsql stable as $$
#variable_conflict use_column
declare
  v_tu  date := date_trunc('month', p_ky)::date;
  v_den date := (date_trunc('month', p_ky) + interval '1 month - 1 day')::date;
begin
  if not public.co_chuc_nang('db_chatluong') then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with tk as (select * from public.fn_hsta_task(v_tu, v_den, p_ns)),
  bt as (select * from public.fn_hsta_bo_tro(v_tu, v_den, p_ns)),
  -- giờ bổ trợ tạm tính: HỢP các khoảng giờ hợp lệ có HS (gộp ca trùng khung — nhiều em chung 1 ca)
  bt_gio as (
    select r.nhan_su_id, sum(extract(epoch from (upper(m) - lower(m))) / 3600) as gio
    from (select bt.nhan_su_id, range_agg(tsrange(bt.ngay + bt.gio_bat_dau, bt.ngay + bt.gio_ket_thuc)) as mr
          from bt where bt.so_co_mat > 0 and bt.gio_ket_thuc > bt.gio_bat_dau
          group by bt.nhan_su_id) r
    cross join lateral unnest(r.mr) m
    group by r.nhan_su_id
  ),
  gt as (
    select g.nhan_su_id, count(*)::int as n, sum(g.so_gio) filter (where g.dau_viec = 'bo_tro') as gio
    from hsta_ghi_them g where g.ky = v_tu and g.xoa_at is null and (p_ns is null or g.nhan_su_id = p_ns)
    group by g.nhan_su_id
  ),
  ch as (
    select c.nhan_su_id, jsonb_object_agg(c.dau_viec, jsonb_build_object(
      'diem_chot', c.diem_chot, 'diem_he_thong', c.diem_he_thong, 'ghi_chu', c.ghi_chu,
      'nguoi_chot', n.ho_ten, 'chot_at', c.chot_at)) as j
    from hsta_chot c left join nhan_su n on n.id = c.nguoi_chot
    where c.ky = v_tu and (p_ns is null or c.nhan_su_id = p_ns)
    group by c.nhan_su_id
  ),
  ds as (
    select tk.nhan_su_id, tk.ho_ten from tk
    union select bt.nhan_su_id, bt.ho_ten from bt
    union select g.nhan_su_id, n.ho_ten from hsta_ghi_them g join nhan_su n on n.id = g.nhan_su_id
      where g.ky = v_tu and g.xoa_at is null and not n.an_xep_hang and (p_ns is null or g.nhan_su_id = p_ns)
  ),
  agg as (
    select ds.nhan_su_id, ds.ho_ten,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn')::int as b_n,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and tk.tinh)::int as b_t,
      (select round(avg(tk.diem), 1) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and tk.tinh) as b_d,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and (cardinality(tk.co) > 0 or not tk.tinh))::int as b_c,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et')::int as e_n,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and tk.tinh)::int as e_t,
      (select round(avg(tk.diem), 1) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and tk.tinh) as e_d,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and (cardinality(tk.co) > 0 or not tk.tinh))::int as e_c,
      (select count(*) from bt where bt.nhan_su_id = ds.nhan_su_id and bt.so_co_mat > 0)::int as t_n,
      (select round(g.gio::numeric, 1) from bt_gio g where g.nhan_su_id = ds.nhan_su_id) as t_gio,
      (select count(*) from bt where bt.nhan_su_id = ds.nhan_su_id and cardinality(bt.co) > 0)::int as t_c
    from (select distinct * from ds) ds
  ),
  mix as (
    -- tổng đề xuất: mỗi đầu việc lấy số ĐÃ CHỐT nếu có, không thì số hệ thống; bổ trợ chỉ có khi đã chốt
    select a.*, ch.j, gt.n as gt_n, gt.gio as gt_gio,
      coalesce((ch.j -> 'btvn' ->> 'diem_chot')::numeric, a.b_d) as b_x,
      coalesce((ch.j -> 'et' ->> 'diem_chot')::numeric, a.e_d) as e_x,
      (ch.j -> 'bo_tro' ->> 'diem_chot')::numeric as t_x
    from agg a left join ch on ch.nhan_su_id = a.nhan_su_id left join gt on gt.nhan_su_id = a.nhan_su_id
  )
  select m.nhan_su_id, m.ho_ten,
    m.b_n, m.b_t, m.b_d, m.b_c,
    m.e_n, m.e_t, m.e_d, m.e_c,
    m.t_n, coalesce(m.t_gio, 0), coalesce(m.gt_gio, 0), public._hsta_chi_tieu_gio_bo_tro(), m.t_c,
    round((coalesce(m.b_x * public._hsta_ti_trong('btvn'), 0) + coalesce(m.e_x * public._hsta_ti_trong('et'), 0) + coalesce(m.t_x * public._hsta_ti_trong('bo_tro'), 0))
      / nullif((case when m.b_x is not null then public._hsta_ti_trong('btvn') else 0 end)
             + (case when m.e_x is not null then public._hsta_ti_trong('et') else 0 end)
             + (case when m.t_x is not null then public._hsta_ti_trong('bo_tro') else 0 end), 0), 1),
    (m.b_x is not null and m.e_x is not null and m.t_x is not null),
    coalesce(m.j, '{}'::jsonb), coalesce(m.gt_n, 0)
  from mix m
  order by m.ho_ten;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- GHI: chốt / bỏ chốt · ghi thêm / xoá ghi thêm (RPC — tính số đề xuất trong CÙNG transaction)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function fn_hsta_chot(p_ns uuid, p_ky date, p_dau_viec text, p_diem numeric, p_ghi_chu text default '')
returns jsonb
language plpgsql as $$
declare
  v_ky date := date_trunc('month', p_ky)::date;
  v_b numeric; v_e numeric; v_t numeric;
  v_he_thong numeric;
begin
  if not public.co_quyen_ghi('db_chatluong') then raise exception 'Không có quyền chốt hiệu suất'; end if;
  if p_dau_viec not in ('btvn', 'et', 'bo_tro', 'tong') then raise exception 'Đầu việc không hợp lệ: %', p_dau_viec; end if;
  if p_diem is null then
    delete from hsta_chot where nhan_su_id = p_ns and ky = v_ky and dau_viec = p_dau_viec;
    return null;
  end if;
  if p_diem < 0 or p_diem > 100 then raise exception 'Điểm phải từ 0 đến 100'; end if;
  select t.btvn_de_xuat, t.et_de_xuat, t.tong_de_xuat into v_b, v_e, v_t from public.fn_hsta_thang(v_ky, p_ns) t limit 1;
  v_he_thong := case p_dau_viec when 'btvn' then v_b when 'et' then v_e when 'tong' then v_t else null end;
  insert into hsta_chot (nhan_su_id, ky, dau_viec, diem_he_thong, diem_chot, ghi_chu, nguoi_chot, chot_at)
  values (p_ns, v_ky, p_dau_viec, v_he_thong, p_diem, coalesce(p_ghi_chu, ''), public.current_nhan_su_id(), now())
  on conflict (nhan_su_id, ky, dau_viec) do update
    set diem_he_thong = excluded.diem_he_thong, diem_chot = excluded.diem_chot, ghi_chu = excluded.ghi_chu,
        nguoi_chot = excluded.nguoi_chot, chot_at = excluded.chot_at;
  return (select jsonb_build_object('diem_chot', c.diem_chot, 'diem_he_thong', c.diem_he_thong, 'ghi_chu', c.ghi_chu,
                                    'nguoi_chot', n.ho_ten, 'chot_at', c.chot_at)
          from hsta_chot c left join nhan_su n on n.id = c.nguoi_chot
          where c.nhan_su_id = p_ns and c.ky = v_ky and c.dau_viec = p_dau_viec);
end $$;

create or replace function fn_hsta_ghi_them_ds(p_ns uuid, p_ky date)
returns table (id uuid, dau_viec text, noi_dung text, so_gio numeric, nguoi_ghi text, created_at timestamptz)
language sql stable as $$
  select g.id, g.dau_viec, g.noi_dung, g.so_gio, n.ho_ten, g.created_at
  from hsta_ghi_them g left join nhan_su n on n.id = g.nguoi_ghi
  where g.nhan_su_id = p_ns and g.ky = date_trunc('month', p_ky)::date and g.xoa_at is null
  order by g.created_at
$$;

create or replace function fn_hsta_ghi_them(p_ns uuid, p_ky date, p_dau_viec text, p_noi_dung text, p_so_gio numeric default null)
returns jsonb
language plpgsql as $$
declare v_id uuid;
begin
  if not public.co_quyen_ghi('db_chatluong') then raise exception 'Không có quyền ghi'; end if;
  insert into hsta_ghi_them (nhan_su_id, ky, dau_viec, noi_dung, so_gio, nguoi_ghi)
  values (p_ns, date_trunc('month', p_ky)::date, p_dau_viec, btrim(p_noi_dung), p_so_gio, public.current_nhan_su_id())
  returning hsta_ghi_them.id into v_id;
  return (select to_jsonb(x) from public.fn_hsta_ghi_them_ds(p_ns, p_ky) x where x.id = v_id);
end $$;

create or replace function fn_hsta_ghi_them_xoa(p_id uuid)
returns void
language plpgsql as $$
begin
  if not public.co_quyen_ghi('db_chatluong') then raise exception 'Không có quyền xoá'; end if;
  update hsta_ghi_them set xoa_at = now(), xoa_boi = public.current_nhan_su_id() where id = p_id and xoa_at is null;
end $$;

revoke execute on function fn_hsta_task(date, date, uuid), fn_hsta_bo_tro(date, date, uuid), fn_hsta_thang(date, uuid),
  fn_hsta_chot(uuid, date, text, numeric, text), fn_hsta_ghi_them_ds(uuid, date),
  fn_hsta_ghi_them(uuid, date, text, text, numeric), fn_hsta_ghi_them_xoa(uuid)
  from public, anon;
grant execute on function fn_hsta_task(date, date, uuid), fn_hsta_bo_tro(date, date, uuid), fn_hsta_thang(date, uuid),
  fn_hsta_chot(uuid, date, text, numeric, text), fn_hsta_ghi_them_ds(uuid, date),
  fn_hsta_ghi_them(uuid, date, text, text, numeric), fn_hsta_ghi_them_xoa(uuid)
  to authenticated;
