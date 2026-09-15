-- ============================================================================
-- 202609070151 — ta_vang_et_online_tich_luy_shop  (Của tôi app TA — Đợt 2)
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 07/09, sau phản biện):
--   ① CHẤM CÔNG TA = ngoại lệ, không check-in: 99% TA có mặt, vắng thì đã xin phép
--      lead. Chỉ cần 1 chỗ lead ghi "TA X vắng buổi Y" (bảng ta_vang, dòng chỉ ra
--      đời khi có vắng thật — §1.5). Mặc định = có mặt. Tiến trình: buổi thực =
--      buổi đã diễn ra − buổi có dòng vắng.
--   ② ET ONLINE (máy chấm) KHÔNG tính cho TA và KHÔNG hiện việc "Xác nhận ET" nữa
--      → lọc ngay tại fn_viec_buoi_thuong (1 nguồn cho task/gậy/dashboard).
--      ⚠ Hệ quả: fn_dong_phase khoá ET tuần tự theo lớp — buổi ET-online không còn
--      ai đóng et_dong_at ⇒ phải MIỄN buổi ET-online khỏi khoá (giống buổi MT) —
--      làm ở migration kế tiếp (202609070152) vì phải chép nguyên thân hàm từ DB.
--      Lớp mà MỌI ET trong tháng đều online → chuẩn ET của lớp đó = 0 (không "thiếu 7").
--   ③ Chỉ care TA CHÍNH (la_chinh) — lớp gán ≥2 TA mà không ai chính → hiện cờ
--      "chưa rõ TA chính", không đoán.
--   ④ ĐIỂM TÍCH LŨY: mỗi NGÀY CÓ VIỆC mà 100% đạt = +100 điểm, chuỗi liên tiếp
--      (ngày không việc trung tính); trượt 1 ngày → về 0 tính lại (điểm tháng =
--      100 × chuỗi hiện tại — VD 15 ngày rồi trượt, 17→30 hoàn hảo = 1400). Ngày
--      chỉ tính khi đã qua (hôm qua trở về trước); việc chưa tới hạn bỏ qua, tới
--      hạn rồi trễ thì ngày đó lật ngược (pure-derive). Cutoff theo tháng. Chỉ
--      điểm ĐÃ CHỐT THÁNG mới xài — không bao giờ âm. Dùng chung MỌI vai trò (gộp
--      việc TA/GV/OPS như xếp hạng chung).
--   ⑤ SHOP: vật phẩm giá theo điểm (admin đặt; 100 điểm ≈ 1k chỉ để định giá),
--      đổi = transaction kiểm dư → đẻ đơn cho_giao; giao/đánh dấu ở ERP sau.
--
-- MẤT GÌ (Luật xoá): không xoá gì. CREATE OR REPLACE fn_viec_buoi_thuong (thêm 1
-- điều kiện lọc, cùng cột) + fn_ta_tien_trinh; 4 bảng mới; 4 hàm mới.
-- ============================================================================

-- ── ① TA vắng buổi (lead ghi) ──────────────────────────────────────────────
create table if not exists ta_vang (
  id uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references buoi_hoc(id),
  nhan_su_id uuid not null references nhan_su(id),
  ly_do text,
  nguoi_ghi uuid not null references nhan_su(id),
  created_at timestamptz not null default now(),
  unique (buoi_hoc_id, nhan_su_id)
);
comment on table ta_vang is 'TA vắng 1 buổi (lead ghi, đã xin phép). Mặc định không có dòng = có mặt. Tiến trình trừ buổi này.';
alter table ta_vang enable row level security;
drop policy if exists ta_vang_member_all on ta_vang;
create policy ta_vang_member_all on ta_vang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── ② fn_viec_buoi_thuong: bỏ hẳn việc ET của buổi có ET online (cùng thân 202609062344) ──
create or replace function public.fn_viec_buoi_thuong(p_tu date default null, p_den date default null, p_tat_ca boolean default false)
returns table (
  nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date,
  vai text, tab text, dong_at timestamptz, han timestamptz, et_online boolean, ref_key text
)
language sql
stable
as $$
  with me as (select public.current_nhan_su_id() as id),
  b as (
    select bh.id, bh.lop_id, l.ten_lop, l.khoi, l.mon, bh.ngay, bh.gio_bat_dau,
           bh.ingame_dong_at, bh.et_dong_at, bh.danh_gia_xong_at, bh.btvn_dong_at, bh.mt_dong_at,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt,
           exists (select 1 from bai_test bt where bt.lop_id = bh.lop_id and bt.ngay = bh.ngay and bt.loai = 'et') as et_online
    from buoi_hoc bh
    join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and (p_tu is null or bh.ngay >= p_tu)
      and (p_den is null or bh.ngay <= p_den)
  ),
  thuong as (
    select pc.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           pc.vai_tro as vai, t.tab, b.gio_bat_dau, b.et_online,
           case t.tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at
                      when 'danhgia' then b.danh_gia_xong_at else b.btvn_dong_at end as dong_at,
           case pc.vai_tro when 'gv' then 1 else 2 end as uu_tien
    from b
    join phan_cong_lop pc on pc.lop_id = b.lop_id
    cross join lateral (
      select unnest(case pc.vai_tro when 'gv' then array['danhgia', 'ingame'] else array['ingame', 'et', 'btvn'] end) as tab
    ) t
    where not b.co_mt
  ),
  mt_tk as (
    select pk.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'tk'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 0 as uu_tien
    from b
    join phan_cong_khoi pk on pk.khoi = b.khoi and pk.mon = b.mon
    where b.co_mt
  ),
  mt_gv as (
    select pc.nhan_su_id, b.id as buoi_id, b.lop_id, b.ten_lop, b.ngay,
           'gv'::text as vai, 'mt'::text as tab, b.gio_bat_dau, b.et_online,
           b.mt_dong_at as dong_at, 1 as uu_tien
    from b
    join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.vai_tro = 'gv'
    where b.co_mt
      and not exists (select 1 from mt_tk k where k.buoi_id = b.id)
      and (pc.la_chinh or not exists (
            select 1 from phan_cong_lop p2 where p2.lop_id = b.lop_id and p2.vai_tro = 'gv' and p2.la_chinh))
  ),
  tat_ca as (
    select * from thuong union all select * from mt_tk union all select * from mt_gv
  ),
  dedup as (
    select distinct on (nhan_su_id, buoi_id, tab) *
    from tat_ca
    order by nhan_su_id, buoi_id, tab, uu_tien
  )
  select d.nhan_su_id, d.buoi_id, d.lop_id, d.ten_lop, d.ngay, d.vai, d.tab, d.dong_at,
         public.fn_han_viec(d.lop_id, d.ngay, d.gio_bat_dau, d.tab) as han, d.et_online,
         ('vh:' || d.buoi_id::text || '|' || d.tab || '|' || d.nhan_su_id::text) as ref_key
  from dedup d, me
  where (p_tat_ca or d.nhan_su_id = me.id)
    and not (d.tab = 'et' and d.et_online)   -- CEO 07/09: ET online máy chấm — TA không còn việc này
$$;
comment on function public.fn_viec_buoi_thuong(date, date, boolean) is
  'Việc nhân sự trên buổi thường (pure-derive). vai gv/tg theo phan_cong_lop; buổi có MT chỉ 1 việc mt. ET của buổi có ET online KHÔNG sinh việc (CEO 07/09). han = fn_han_viec. ref_key = khoá gậy tự động.';
grant execute on function public.fn_viec_buoi_thuong(date, date, boolean) to authenticated;
revoke execute on function public.fn_viec_buoi_thuong(date, date, boolean) from anon;

-- ── ③ fn_ta_tien_trinh v2: TA chính · trừ vắng · ET online không tính ──────
create or replace function public.fn_ta_tien_trinh(p_ym text)
returns jsonb language plpgsql stable as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_den_thuc date;
  k_buoi numeric; k_btvn numeric; k_et numeric; k_botro numeric;
  v_lop jsonb; v_botro jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
  v_den_thuc := least(v_den, v_today);

  select gia_tri into k_buoi  from ta_dinh_muc where ma = 'buoi_x_tuan';
  select gia_tri into k_btvn  from ta_dinh_muc where ma = 'btvn';
  select gia_tri into k_et    from ta_dinh_muc where ma = 'et';
  select gia_tri into k_botro from ta_dinh_muc where ma = 'botro_gio';

  with tg as (   -- lớp tôi là TA; đếm tổng TA + có ai chính không → chỉ care TA CHÍNH
    select pc.lop_id, pc.la_chinh,
      count(*) over (partition by pc.lop_id) as so_tg,
      bool_or(pc.la_chinh) over (partition by pc.lop_id) as co_chinh
    from phan_cong_lop pc where pc.vai_tro = 'tg'
  ),
  lop_toi as (
    select l.id, l.ten_lop,
      (t.so_tg > 1 and not t.co_chinh) as khong_ro_chinh
    from tg t join lop l on l.id = t.lop_id
    where l.trang_thai = 'dang_hoc'
      and exists (select 1 from phan_cong_lop p where p.lop_id = t.lop_id and p.nhan_su_id = v_me and p.vai_tro = 'tg')
      and (t.la_chinh or t.so_tg = 1 or (t.so_tg > 1 and not t.co_chinh))
      and exists (select 1 from phan_cong_lop p where p.lop_id = t.lop_id and p.nhan_su_id = v_me and p.vai_tro = 'tg' and (p.la_chinh or t.so_tg = 1 or not t.co_chinh))
  ),
  lop_uniq as (select distinct id, ten_lop, khong_ro_chinh from lop_toi),
  tuan as (
    select lu.id as lop_id, count(distinct t.thu) as buoi_tuan
    from lop_uniq lu join thoi_khoa_bieu t on t.lop_id = lu.id
    where t.hieu_luc_tu <= v_den and (t.hieu_luc_den is null or t.hieu_luc_den >= v_tu)
    group by lu.id
  ),
  thuc as (
    select lu.id as lop_id,
      count(*) filter (where b.ngay <= v_den_thuc
        and not exists (select 1 from ta_vang v where v.buoi_hoc_id = b.id and v.nhan_su_id = v_me)) as buoi_thuc,
      count(*) filter (where b.ngay <= v_den_thuc
        and exists (select 1 from ta_vang v where v.buoi_hoc_id = b.id and v.nhan_su_id = v_me)) as buoi_vang,
      count(*) filter (where b.btvn_dong_at is not null) as btvn_thuc,
      count(*) filter (where b.et_dong_at is not null
        and not exists (select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et')) as et_thuc,
      count(*) filter (where b.ngay <= v_den_thuc) as buoi_dien_ra,
      count(*) filter (where b.ngay <= v_den_thuc
        and exists (select 1 from bai_test bt where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'et')) as buoi_et_online
    from lop_uniq lu left join buoi_hoc b
      on b.lop_id = lu.id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
    group by lu.id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'lop_id', lu.id, 'ten_lop', lu.ten_lop, 'khong_ro_chinh', lu.khong_ro_chinh,
      'buoi_tuan', coalesce(tu.buoi_tuan, 0),
      'buoi_chuan', coalesce(tu.buoi_tuan, 0) * k_buoi, 'buoi_thuc', coalesce(th.buoi_thuc, 0), 'buoi_vang', coalesce(th.buoi_vang, 0),
      'btvn_chuan', k_btvn, 'btvn_thuc', coalesce(th.btvn_thuc, 0),
      -- lớp mà MỌI buổi đã diễn ra đều ET online → ET không phải việc TA → chuẩn 0
      'et_online', (coalesce(th.buoi_dien_ra, 0) > 0 and coalesce(th.buoi_et_online, 0) = coalesce(th.buoi_dien_ra, 0)),
      'et_chuan', case when coalesce(th.buoi_dien_ra, 0) > 0 and coalesce(th.buoi_et_online, 0) = coalesce(th.buoi_dien_ra, 0) then 0 else k_et end,
      'et_thuc', coalesce(th.et_thuc, 0)
    ) order by lu.ten_lop), '[]'::jsonb)
  into v_lop
  from lop_uniq lu left join tuan tu on tu.lop_id = lu.id left join thuc th on th.lop_id = lu.id;

  select jsonb_build_object(
      'chuan_gio', k_botro, 'so_ca', count(*),
      'thuc_gio', round(coalesce(sum(coalesce(extract(epoch from (b.gio_ket_thuc - b.gio_bat_dau)) / 3600, 1)), 0)::numeric, 1))
  into v_botro
  from buoi_hoc b
  where b.loai = 'bo_tro_yeu' and b.trang_thai <> 'huy' and b.nguoi_day_tg = v_me and b.ngay between v_tu and v_den_thuc;

  return jsonb_build_object('ym', p_ym, 'lop', v_lop, 'botro', v_botro,
    'dinh_muc', jsonb_build_object('buoi_x_tuan', k_buoi, 'btvn', k_btvn, 'et', k_et, 'botro_gio', k_botro));
end $$;
grant execute on function public.fn_ta_tien_trinh(text) to authenticated;
revoke execute on function public.fn_ta_tien_trinh(text) from anon;

-- ── ④ ĐIỂM TÍCH LŨY ────────────────────────────────────────────────────────
insert into ta_dinh_muc (ma, gia_tri, mo_ta) values ('diem_moi_ngay', 100, 'Điểm tích lũy cho 1 ngày có việc đạt 100%')
on conflict (ma) do nothing;

create table if not exists tich_luy_chot_thang (
  ky date not null,                       -- ngày 1 của tháng
  nhan_su_id uuid not null references nhan_su(id),
  diem integer not null,
  chuoi integer not null,
  nguoi_chot uuid not null references nhan_su(id),
  chot_at timestamptz not null default now(),
  primary key (ky, nhan_su_id)
);
comment on table tich_luy_chot_thang is 'Snapshot điểm tích lũy cuối tháng (chỉ điểm này mới xài được). Chốt lại = ghi đè kỳ đó.';
alter table tich_luy_chot_thang enable row level security;
drop policy if exists tich_luy_chot_thang_member_all on tich_luy_chot_thang;
create policy tich_luy_chot_thang_member_all on tich_luy_chot_thang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

create table if not exists shop_vat_pham (
  id uuid primary key default gen_random_uuid(),
  ten text not null,
  mo_ta text,
  anh_url text,
  gia_diem integer not null check (gia_diem > 0),
  active boolean not null default true,
  thu_tu integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table shop_vat_pham is 'Vật phẩm đổi bằng điểm tích lũy (Trà sữa, Kem, Tokbokki…). Giá theo điểm, admin đặt.';
alter table shop_vat_pham enable row level security;
drop policy if exists shop_vat_pham_member_all on shop_vat_pham;
create policy shop_vat_pham_member_all on shop_vat_pham for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

create table if not exists shop_don (
  id uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null references nhan_su(id),
  vat_pham_id uuid references shop_vat_pham(id),
  ten_vat_pham text not null,               -- chụp tên lúc đổi (vật phẩm đổi tên/xoá không phá lịch sử)
  gia_diem integer not null,                -- chụp giá lúc đổi
  trang_thai text not null default 'cho_giao' check (trang_thai in ('cho_giao', 'da_giao', 'huy')),
  created_at timestamptz not null default now(),
  giao_at timestamptz,
  nguoi_giao uuid references nhan_su(id),
  ghi_chu text
);
comment on table shop_don is 'Đơn đổi vật phẩm. Trừ điểm = mọi đơn không huỷ (suy động, không lưu số dư).';
alter table shop_don enable row level security;
drop policy if exists shop_don_member_all on shop_don;
create policy shop_don_member_all on shop_don for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- Chuỗi + điểm tháng của 1 người (nội bộ; dùng cho cả xem lẫn chốt). Ngày có việc = ngày buổi (bảng
-- fn_*_viec_thang); chỉ xét ngày < hôm nay; việc còn 'cho' bỏ qua; có 1 việc khong_dat → ngày trượt.
create or replace function public._tich_luy_cua(p_ns uuid, p_ym text)
returns table (diem_thang integer, chuoi integer, ngay_cuoi date, ngay_trot date)
language plpgsql stable as $$
declare
  v_tu date; v_den date; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  k_diem integer; r record; v_chuoi integer := 0; v_cuoi date := null; v_trot date := null;
begin
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
  select gia_tri::integer into k_diem from ta_dinh_muc where ma = 'diem_moi_ngay';
  for r in
    with viec as (
      select ngay, kq from public.fn_ta_viec_thang(v_tu, v_den) where nhan_su_id = p_ns
      union all select ngay, kq from public.fn_gv_viec_thang(v_tu, v_den) where nhan_su_id = p_ns
      union all select ngay, kq from public.fn_ops_viec_thang(v_tu, v_den) where nhan_su_id = p_ns
    )
    select ngay, bool_or(kq = 'khong_dat') as trot
    from viec where ngay < v_today and kq <> 'cho'
    group by ngay order by ngay
  loop
    if r.trot then v_chuoi := 0; v_trot := r.ngay; else v_chuoi := v_chuoi + 1; end if;
    v_cuoi := r.ngay;
  end loop;
  return query select v_chuoi * coalesce(k_diem, 100), v_chuoi, v_cuoi, v_trot;
end $$;

create or replace function public.fn_tich_luy(p_ym text)
returns jsonb language plpgsql stable as $$
declare
  v_me uuid := public.current_nhan_su_id();
  t record; v_chot integer; v_tieu integer; k_diem integer;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  select * into t from public._tich_luy_cua(v_me, p_ym);
  select coalesce(sum(diem), 0) into v_chot from tich_luy_chot_thang where nhan_su_id = v_me;
  select coalesce(sum(gia_diem), 0) into v_tieu from shop_don where nhan_su_id = v_me and trang_thai <> 'huy';
  select gia_tri::integer into k_diem from ta_dinh_muc where ma = 'diem_moi_ngay';
  return jsonb_build_object('ym', p_ym, 'diem_thang', t.diem_thang, 'chuoi', t.chuoi, 'ngay_cuoi', t.ngay_cuoi,
    'ngay_trot', t.ngay_trot, 'xai_duoc', v_chot - v_tieu, 'diem_moi_ngay', coalesce(k_diem, 100));
end $$;
grant execute on function public.fn_tich_luy(text) to authenticated;
revoke execute on function public.fn_tich_luy(text) from anon;

-- Chốt tháng (admin/lead gọi từ ERP, CHỈ cho tháng đã kết thúc). Chốt lại = ghi đè kỳ đó.
create or replace function public.fn_tich_luy_chot_thang(p_ky date)
returns integer language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id(); v_ym text; v_tu date; v_den date; r record; t record; n integer := 0;
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  if p_ky <> date_trunc('month', p_ky)::date then raise exception 'p_ky phải là ngày 1 của tháng'; end if;
  if p_ky >= date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date then
    raise exception 'Chỉ chốt tháng ĐÃ KẾT THÚC.'; end if;
  v_ym := to_char(p_ky, 'YYYY-MM'); v_tu := p_ky; v_den := (p_ky + interval '1 month' - interval '1 day')::date;
  for r in
    select distinct nhan_su_id from (
      select nhan_su_id from public.fn_ta_viec_thang(v_tu, v_den)
      union all select nhan_su_id from public.fn_gv_viec_thang(v_tu, v_den)
      union all select nhan_su_id from public.fn_ops_viec_thang(v_tu, v_den)) x
  loop
    select * into t from public._tich_luy_cua(r.nhan_su_id, v_ym);
    insert into tich_luy_chot_thang (ky, nhan_su_id, diem, chuoi, nguoi_chot, chot_at)
      values (p_ky, r.nhan_su_id, t.diem_thang, t.chuoi, v_me, now())
      on conflict (ky, nhan_su_id) do update set diem = excluded.diem, chuoi = excluded.chuoi, nguoi_chot = excluded.nguoi_chot, chot_at = now();
    n := n + 1;
  end loop;
  return n;
end $$;
grant execute on function public.fn_tich_luy_chot_thang(date) to authenticated;
revoke execute on function public.fn_tich_luy_chot_thang(date) from anon;

-- ── ⑤ SHOP ─────────────────────────────────────────────────────────────────
create or replace function public.fn_shop_don_cua_toi()
returns setof shop_don language sql stable as $$
  select * from shop_don where nhan_su_id = public.current_nhan_su_id() order by created_at desc limit 200
$$;
grant execute on function public.fn_shop_don_cua_toi() to authenticated;
revoke execute on function public.fn_shop_don_cua_toi() from anon;

-- Đổi vật phẩm: khoá theo người (chặn bấm đúp/2 tab), kiểm dư từ chốt − đơn, đẻ đơn cho_giao.
create or replace function public.fn_shop_doi(p_vat_pham uuid)
returns shop_don language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id(); vp record; v_chot integer; v_tieu integer; d shop_don;
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  perform pg_advisory_xact_lock(hashtext('shop:' || v_me::text));
  select * into vp from shop_vat_pham where id = p_vat_pham and active;
  if vp is null then raise exception 'Vật phẩm không còn bán.'; end if;
  select coalesce(sum(diem), 0) into v_chot from tich_luy_chot_thang where nhan_su_id = v_me;
  select coalesce(sum(gia_diem), 0) into v_tieu from shop_don where nhan_su_id = v_me and trang_thai <> 'huy';
  if v_chot - v_tieu < vp.gia_diem then
    raise exception 'Không đủ điểm: có % (đã chốt), cần %.', v_chot - v_tieu, vp.gia_diem; end if;
  insert into shop_don (nhan_su_id, vat_pham_id, ten_vat_pham, gia_diem)
    values (v_me, vp.id, vp.ten, vp.gia_diem) returning * into d;
  return d;
end $$;
grant execute on function public.fn_shop_doi(uuid) to authenticated;
revoke execute on function public.fn_shop_doi(uuid) from anon;
