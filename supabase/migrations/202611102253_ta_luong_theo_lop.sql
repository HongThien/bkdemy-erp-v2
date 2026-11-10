-- ============================================================================
-- 202611102253 — ta_luong_theo_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 10/11: "nên có 1 bảng lương trợ giảng của từng lớp thì sẽ dễ hơn việc tính rule chung" · "OK, subtab cạnh
--   Đơn giá · lương tháng 10 tính theo cái này luôn".
--   · Bảng ta_luong_lop: mỗi lớp một MỨC LƯƠNG THÁNG, có hiệu lực từ tháng (ngày 01). Mức này THAY "bậc lương lớp" (bậc theo sĩ số
--     trung bình) trong công thức — cách chia giữ nguyên: 40% TG × tỉ lệ buổi · 20% BTVN × tỉ lệ chấm · 40% bổ trợ theo chỉ tiêu.
--   · Áp từ tháng có chấm công ERP (_ta_moc_cham_cong = 10/2026). Tháng 9 trở về giữ bậc theo sĩ số (không đổi quá khứ đã trả).
--   · Khởi tạo: mọi lớp đang học hoặc có buổi trong tháng 10 ⇒ mức = đúng bậc tháng 10 đang tính (sĩ số TB tháng 10) ⇒ lương T10
--     KHÔNG đổi một đồng khi áp; đổi chỉ khi người sửa mức. Từ đó mức KHÔNG tự đổi theo sĩ số nữa.
--   · Lớp chưa có mức ⇒ 0đ + cờ thieu_muc (báo đỏ trên màn) — không đoán theo sĩ số (§1.5).
--   · Sửa/xoá bị khoá nếu dòng đang chi phối tháng đã chốt (dùng chung _ta_don_gia_ky_khoa); xoá = xoá mềm; ghi vết ta_cong_log.
--   · Chốt kỳ chụp thêm 'luong_lop' vào thong_so.
-- MẤT GÌ (Luật xoá): không xoá gì. Thay CTE lop_bac của _ta_luong_tinh (bậc theo sĩ số chỉ còn cho tháng trước mốc).
-- ============================================================================

create table public.ta_luong_lop (
  id uuid primary key default gen_random_uuid(),
  lop_id uuid not null references public.lop(id),
  muc numeric not null check (muc >= 0),
  hieu_luc_tu date not null check (extract(day from hieu_luc_tu) = 1),
  ghi_chu text not null default '',
  tao_boi uuid references public.nhan_su(id),
  tao_at timestamptz not null default now(),
  xoa_at timestamptz,
  xoa_boi uuid references public.nhan_su(id),
  ly_do_xoa text
);
create unique index ta_luong_lop_mot_muc_moi_thang on public.ta_luong_lop(lop_id, hieu_luc_tu) where xoa_at is null;
alter table public.ta_luong_lop enable row level security;   -- chỉ đọc/ghi qua fn_ta_luong_lop_* (security definer)

create or replace function public._ta_luong_lop_kiem() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_ky date;
begin
  if tg_op = 'DELETE' then raise exception 'Không xoá cứng mức lương lớp — dùng Xoá (ẩn dòng, giữ lịch sử)'; end if;
  if tg_op = 'INSERT' then
    v_ky := public._ta_don_gia_ky_khoa(new.hieu_luc_tu);
  else
    if (new.lop_id, new.hieu_luc_tu) is distinct from (old.lop_id, old.hieu_luc_tu) then
      raise exception 'Không đổi lớp / tháng hiệu lực của dòng — đặt mức mới cho tháng khác';
    end if;
    if old.xoa_at is not null then raise exception 'Dòng đã xoá — không sửa được'; end if;
    v_ky := public._ta_don_gia_ky_khoa(old.hieu_luc_tu);
  end if;
  if v_ky is not null then
    raise exception 'Mức này đang dùng cho tháng % đã chốt lương — mở lại kỳ, hoặc đặt mức mới từ tháng sau', to_char(v_ky, 'MM/YYYY');
  end if;
  return new;
end $$;
create trigger ta_luong_lop_kiem before insert or update or delete on public.ta_luong_lop
  for each row execute function public._ta_luong_lop_kiem();
create trigger ta_luong_lop_log after insert or update on public.ta_luong_lop
  for each row execute function public._ta_cong_ghi_log();

-- Khởi tạo = bậc tháng 10 đúng như công thức đang tính (sĩ số TB tháng 10) ⇒ lương T10 không đổi khi áp
do $$
begin
  insert into public.ta_luong_lop (lop_id, muc, hieu_luc_tu, ghi_chu)
  with dg as (
    select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
      from ta_don_gia d where d.hieu_luc_tu <= date '2026-10-01' and d.xoa_at is null
     order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
  ), l as (
    select l.id,
           (select avg(x.c) from generate_series(date '2026-10-01', date '2026-10-31', interval '1 day') d(d),
              lateral (select count(*)::int as c from hoc_sinh_lop h where h.lop_id = l.id and h.ngay_vao <= d.d::date
                        and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x) as si
      from lop l
     where l.trang_thai = 'dang_hoc'
        or exists (select 1 from buoi_hoc b where b.lop_id = l.id and b.loai = 'thuong' and b.ngay between date '2026-10-01' and date '2026-10-31')
  )
  select l.id,
         coalesce((select b.gia_tri from dg b where b.ma = 'bac_luong' and round(coalesce(l.si, 0))::int >= b.si_tu
                     and (b.si_den is null or round(coalesce(l.si, 0))::int <= b.si_den) order by b.si_tu desc limit 1),
                  (select min(gia_tri) from dg where ma = 'bac_luong')),
         date '2026-10-01', 'Khởi tạo 10/11 = bậc theo sĩ số TB tháng 10'
    from l;
end $$;

-- Màn: danh sách lớp (đang học hoặc đã có mức) với mức hiệu lực tại tháng p_ky + sĩ số TB tháng đó + bậc theo sĩ số (tham khảo)
create or replace function public.fn_ta_luong_lop_ds(p_ky date)
returns table (lop_id uuid, ten_lop text, mon text, trang_thai text, si_tb numeric, bac_si_so numeric,
               muc_id uuid, muc numeric, hieu_luc_tu date, ghi_chu text, nguoi_dat text, dat_at timestamptz, khoa_ky date, lich_su jsonb)
language plpgsql stable security definer set search_path = public as $$
declare v_tu date := date_trunc('month', p_ky)::date;
        v_den date := (date_trunc('month', p_ky) + interval '1 month' - interval '1 day')::date;
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem lương lớp'; end if;
  return query
  with dg as (
    select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
      from ta_don_gia d where d.hieu_luc_tu <= v_tu and d.xoa_at is null
     order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
  ), ds as (
    select l.id, l.ten_lop, l.mon, l.trang_thai,
           (select avg(x.c) from generate_series(v_tu, least(v_den, (now() at time zone 'Asia/Ho_Chi_Minh')::date), interval '1 day') d(d),
              lateral (select count(*)::int as c from hoc_sinh_lop h where h.lop_id = l.id and h.ngay_vao <= d.d::date
                        and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x)::numeric as si
      from lop l
     where l.trang_thai = 'dang_hoc' or exists (select 1 from ta_luong_lop m where m.lop_id = l.id and m.xoa_at is null)
  )
  select ds.id, ds.ten_lop, ds.mon, ds.trang_thai, round(ds.si, 1),
         (select b.gia_tri from dg b where b.ma = 'bac_luong' and round(coalesce(ds.si, 0))::int >= b.si_tu
            and (b.si_den is null or round(coalesce(ds.si, 0))::int <= b.si_den) order by b.si_tu desc limit 1),
         m.id, m.muc, m.hieu_luc_tu, m.ghi_chu, n.ho_ten, m.tao_at,
         case when m.id is not null then public._ta_don_gia_ky_khoa(m.hieu_luc_tu) end,
         coalesce((select jsonb_agg(jsonb_build_object('id', h.id, 'muc', h.muc, 'hieu_luc_tu', h.hieu_luc_tu, 'ghi_chu', h.ghi_chu,
                                    'khoa_ky', public._ta_don_gia_ky_khoa(h.hieu_luc_tu)) order by h.hieu_luc_tu desc)
                     from ta_luong_lop h where h.lop_id = ds.id and h.xoa_at is null), '[]'::jsonb)
    from ds
    left join lateral (select * from ta_luong_lop m where m.lop_id = ds.id and m.xoa_at is null and m.hieu_luc_tu <= v_tu
                        order by m.hieu_luc_tu desc limit 1) m on true
    left join nhan_su n on n.id = m.tao_boi
   order by (ds.trang_thai = 'dang_hoc') desc, ds.ten_lop;
end $$;
revoke all on function public.fn_ta_luong_lop_ds(date) from public, anon;
grant execute on function public.fn_ta_luong_lop_ds(date) to authenticated;

-- Đặt mức cho lớp từ tháng p_tu (ngày bất kỳ trong tháng ⇒ quy về 01). Đã có dòng đúng tháng đó ⇒ sửa dòng đó; chưa có ⇒ thêm.
create or replace function public.fn_ta_luong_lop_dat(p_lop uuid, p_muc numeric, p_tu date, p_ghi_chu text default '')
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tu date := date_trunc('month', p_tu)::date; v_id uuid;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền đặt lương lớp'; end if;
  if p_muc is null or p_muc < 0 then raise exception 'Mức lương phải ≥ 0'; end if;
  select id into v_id from ta_luong_lop where lop_id = p_lop and hieu_luc_tu = v_tu and xoa_at is null for update;
  if v_id is not null then
    update ta_luong_lop set muc = p_muc, ghi_chu = coalesce(p_ghi_chu, ghi_chu) where id = v_id;
  else
    insert into ta_luong_lop (lop_id, muc, hieu_luc_tu, ghi_chu, tao_boi)
    values (p_lop, p_muc, v_tu, coalesce(p_ghi_chu, ''), public.current_nhan_su_id()) returning id into v_id;
  end if;
  return v_id;
end $$;
revoke all on function public.fn_ta_luong_lop_dat(uuid, numeric, date, text) from public, anon;
grant execute on function public.fn_ta_luong_lop_dat(uuid, numeric, date, text) to authenticated;

create or replace function public.fn_ta_luong_lop_xoa(p_id uuid, p_ly_do text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền xoá mức lương lớp'; end if;
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Xoá phải ghi lý do'; end if;
  update ta_luong_lop set xoa_at = now(), xoa_boi = public.current_nhan_su_id(), ly_do_xoa = btrim(p_ly_do)
   where id = p_id and xoa_at is null;
  if not found then raise exception 'Không thấy dòng (hoặc đã xoá)'; end if;
end $$;
revoke all on function public.fn_ta_luong_lop_xoa(uuid, text) from public, anon;
grant execute on function public.fn_ta_luong_lop_xoa(uuid, text) to authenticated;

-- Chốt kỳ chụp thêm mức lương lớp đang hiệu lực
create or replace function public._ta_thong_so_ky(p_ky date) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'chup_at', now(),
    'don_gia', coalesce((select jsonb_agg(jsonb_build_object('ma', x.ma, 'ten', x.ten, 'si_tu', x.si_tu, 'si_den', x.si_den,
                                   'gia_tri', x.gia_tri, 'don_vi', x.don_vi, 'hieu_luc_tu', x.hieu_luc_tu) order by x.ma, x.si_tu nulls first)
                         from (select distinct on (d.ma, coalesce(d.si_tu, -1)) d.*
                                 from ta_don_gia d
                                where d.xoa_at is null and d.hieu_luc_tu <= date_trunc('month', p_ky)::date
                                order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc) x), '[]'::jsonb),
    'loai_viec', coalesce((select jsonb_agg(to_jsonb(l) order by l.thu_tu, l.ma) from ta_loai_viec l), '[]'::jsonb),
    'luong_lop', coalesce((select jsonb_agg(jsonb_build_object('lop', lp.ten_lop, 'lop_id', x.lop_id, 'muc', x.muc, 'hieu_luc_tu', x.hieu_luc_tu) order by lp.ten_lop)
                          from (select distinct on (m.lop_id) m.* from ta_luong_lop m
                                 where m.xoa_at is null and m.hieu_luc_tu <= date_trunc('month', p_ky)::date
                                 order by m.lop_id, m.hieu_luc_tu desc) x join lop lp on lp.id = x.lop_id), '[]'::jsonb))
$$;
revoke all on function public._ta_thong_so_ky(date) from public, anon, authenticated;

-- ── _ta_luong_tinh: lop_bac lấy mức từ ta_luong_lop (từ mốc chấm công ERP) — phần dưới do script ghép ──
CREATE OR REPLACE FUNCTION public._ta_luong_tinh(p_ky date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric, ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
with
k as (
  select date_trunc('month', p_ky)::date as tu,
         (date_trunc('month', p_ky)::date + interval '1 month' - interval '1 day')::date as den
),
cv_ok as (   -- việc được tính lương: đã duyệt VÀ ca có mặt của nó đã duyệt (việc nhập hộ / nạp cũ không gắn ca: chỉ cần việc đã duyệt)
  select cv.* from ta_cong_viec cv, k
   where cv.ky = k.tu and cv.trang_thai = 'da_duyet'
     and (cv.cham_cong_id is null
          or exists (select 1 from ta_cham_cong cc where cc.id = cv.cham_cong_id and cc.duyet = 'da_duyet'))
),
dg as (   -- đơn giá đang hiệu lực tại đầu kỳ (dòng mới nhất có hieu_luc_tu <= đầu kỳ)
  select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
    from ta_don_gia d, k where d.hieu_luc_tu <= k.tu and d.xoa_at is null
   order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
),
cfg as (
  select (select gia_tri from dg where ma = 'he_so_tg')            as w_tg,
         (select gia_tri from dg where ma = 'he_so_btvn')          as w_btvn,
         (select gia_tri from dg where ma = 'he_so_bo_tro')        as w_bt,
         (select gia_tri from dg where ma = 'chi_tieu_bo_tro_gio') as chi_tieu,
         (select gia_tri from dg where ma = 'btvn_lop_8_buoi')     as btvn_8,
         (select gia_tri from dg where ma = 'btvn_lop_4_buoi')     as btvn_4
),
ta_sel as (
  select x.nhan_su_id from (
    select pk.nhan_su_id from public._ta_pc_khoang() pk, k where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
    union
    select cv.nhan_su_id from cv_ok cv
  ) x where p_ns is null or x.nhan_su_id = p_ns
),
lop_cua as (
  -- Lớp thuộc về TA được phân công (la_chu) giữ BTVN + chỉ tiêu bổ trợ + bậc lương, kể cả khi nhờ người dạy hộ.
  -- Lớp TA có công TG mà không được phân công = dạy hộ: tiền TG của buổi đó đi theo người dạy (CEO 12/10).
  select x.nhan_su_id, x.lop_id, bool_or(x.chu) as la_chu, bool_or(x.la_chinh) as la_chinh
    from (
      -- Lớp chủ = được phân công vào BẤT KỲ NGÀY NÀO trong kỳ (theo log): phân công SAU kỳ không tính vào kỳ này
      -- (Tùng 6A3, Vân Anh 7S3 phân 11–12/10); TA bị rút giữa kỳ vẫn giữ lớp cho kỳ đó (Thùy 14/10).
      select pk.nhan_su_id, pk.lop_id, true as chu,
             coalesce((select lg.la_chinh from phan_cong_lop_log lg
                        where lg.nhan_su_id = pk.nhan_su_id and lg.lop_id = pk.lop_id and lg.vai_tro = 'tg'
                          and lg.hanh_dong in ('them', 'doi_chinh') and (lg.ts at time zone 'Asia/Ho_Chi_Minh')::date <= k.den
                        order by lg.ts desc limit 1), false) as la_chinh
        from public._ta_pc_khoang() pk join ta_sel s on s.nhan_su_id = pk.nhan_su_id, k
       where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
      union all
      select cv.nhan_su_id, cv.lop_id, false, false
        from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
        join ta_sel s on s.nhan_su_id = cv.nhan_su_id
       where lv.tinh_vao = 'tg' and cv.lop_id is not null
    ) x
   group by x.nhan_su_id, x.lop_id
),
lop_stat as (
  select lc.nhan_su_id, lc.lop_id, l.ten_lop, lc.la_chu, lc.la_chinh,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
        and b.ngay between k.tu and k.den)::int as so_buoi,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong'
        and b.ngay between k.tu and k.den)::int as so_buoi_lich,
    -- BTVN thật (CEO 12/10): buổi lớp mình mà CHÍNH TA này đã chấm (gami_grades.graded_by → tai_khoan → nhan_su)
    -- trong hạn duyệt của kỳ. Buổi MT/thi không có câu BTVN ⇒ không có dòng chấm ⇒ không tính;
    -- BTVN online TA chưa chấm (hoặc chấm sau hạn) ⇒ không tính.
    (select count(*) from buoi_hoc b, k
      where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between k.tu and k.den
        and exists (select 1 from gami_session_problems p
                      join gami_grades g on g.problem_id = p.id and g.buoi_hoc_id = b.id
                      join tai_khoan tk on tk.id = g.graded_by
                     where p.buoi_hoc_id = b.id and p.phase = 'btvn' and not p.hidden and tk.nhan_su_id = lc.nhan_su_id
                       and g.graded_at < ((k.tu + interval '1 month')
                             + make_interval(days => coalesce((select gia_tri::int from dg where ma = 'han_duyet_ngay'), 3)))
                             ::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int as btvn_lam,
    (select avg(x.c) from k, generate_series(k.tu, k.den, interval '1 day') d(d),
        lateral (select count(*)::int as c from hoc_sinh_lop h
                  where h.lop_id = lc.lop_id and h.ngay_vao <= d.d::date
                    and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x) as si_tb,
    -- TG: từ CHẤM CÔNG đã duyệt (K2), theo ngày. Trông thi ở LỚP MÌNH nằm trong công TG: cùng ngày chỉ tính
    -- một lần vào TG (không trả tiền trông thi riêng — xem ngoai_dong), kể cả khi hôm đó chỉ có dòng trông thi.
    (select count(distinct cv.ngay) from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
      where cv.nhan_su_id = lc.nhan_su_id and cv.lop_id = lc.lop_id
        and lv.tinh_vao in ('tg', 'trong_thi'))::int as tg_lam
    from lop_cua lc join lop l on l.id = lc.lop_id
),
lop_bac0 as (
  -- Thùy 10/11: từ tháng có chấm công ERP (T10), mức lương lớp = bảng ta_luong_lop (đặt tay từng lớp, hiệu lực theo tháng);
  -- lớp chưa có mức ⇒ 0đ + cờ thieu_muc (không đoán theo sĩ số). Tháng trước mốc giữ bậc theo sĩ số (bac_luong).
  select ls.*,
    case when (select tu from k) >= public._ta_moc_cham_cong()
      then (select m.muc from ta_luong_lop m, k where m.lop_id = ls.lop_id and m.xoa_at is null and m.hieu_luc_tu <= k.tu
             order by m.hieu_luc_tu desc limit 1)
      else coalesce(
        (select b.gia_tri from dg b
          where b.ma = 'bac_luong'
            and round(coalesce(ls.si_tb, 0))::int >= b.si_tu
            and (b.si_den is null or round(coalesce(ls.si_tb, 0))::int <= b.si_den)
          order by b.si_tu desc limit 1),
        (select min(gia_tri) from dg where ma = 'bac_luong')) end as luong0
    from lop_stat ls
),
lop_bac as (
  select b.*, coalesce(b.luong0, 0) as luong, b.luong0 is null as thieu_muc from lop_bac0 b
),
chinh as (
  select distinct on (lb.nhan_su_id) lb.nhan_su_id, lb.lop_id as chinh_lop, lb.ten_lop as chinh_ten, lb.luong as chinh_luong
    from lop_bac lb
   -- lớp chính = lớp TA THỰC SỰ có công TG (bằng chứng), rồi mới tới cờ la_chinh trong phân công
   order by lb.nhan_su_id, lb.la_chu desc, (lb.tg_lam > 0) desc, lb.la_chinh desc, lb.luong desc, lb.ten_lop
),
lop_tien as (
  select lb.*, lb.tg_lam as tg_tinh,
         case when lb.so_buoi_lich <= 5 then c.btvn_4 else c.btvn_8 end as btvn_dm,
         c.w_tg, c.w_btvn
    from lop_bac lb, cfg c
),
lop_kq as (
  select lt.*,
         case when lt.so_buoi > 0 then lt.tg_tinh::numeric / lt.so_buoi else 0 end as ti_le_tg,
         case when lt.btvn_dm > 0 then lt.btvn_lam::numeric / lt.btvn_dm else 0 end as ti_le_btvn
    from lop_tien lt
),
lop_tong as (
  select lk.nhan_su_id,
         sum(round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn)))::numeric as tien,
         -- Lớp chủ chỉ vào chỉ tiêu bổ trợ khi TA CÓ HOẠT ĐỘNG ở lớp đó trong kỳ (có công TG hoặc đã chấm BTVN).
         -- Chặn phân công "treo" (phụ, chưa làm gì) làm tăng chỉ tiêu oan; sau này chấm công thay hẳn bước này.
         (count(*) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)))::int as n_chu,
         coalesce(sum(lk.luong) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)), 0)::numeric as sum_bac_chu,
         (count(*) filter (where lk.tg_lam > 0))::int as n_lop_tg,
         coalesce(sum(lk.luong) filter (where lk.tg_lam > 0), 0)::numeric as sum_bac_tg,
         coalesce(sum(lk.tg_lam) filter (where not lk.la_chu), 0)::int as tg_ho,
         jsonb_agg(jsonb_build_object(
           'lop', lk.ten_lop, 'la_chu', lk.la_chu, 'co_hoat_dong', (lk.tg_lam > 0 or lk.btvn_lam > 0), 'si_tb', round(lk.si_tb::numeric, 2), 'bac', lk.luong, 'thieu_muc', lk.thieu_muc,
           'tg_lam', lk.tg_tinh, 'so_buoi', lk.so_buoi, 'ti_le_tg', round(lk.ti_le_tg, 4),
           'btvn_lam', lk.btvn_lam, 'btvn_dinh_muc', lk.btvn_dm, 'ti_le_btvn', round(lk.ti_le_btvn, 4),
           'tien', round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn))) order by lk.ten_lop) as ds
    from lop_kq lk group by lk.nhan_su_id
),
bo_ngay as (   -- mỗi (TA × ngày): giờ khai cộng thẳng + tập khoảng giờ hợp lại (chồng nhau chỉ còn 1)
  select cv.nhan_su_id, cv.ngay,
         sum(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric as gio_khai,
         range_agg(tsrange(cv.ngay + cv.gio_bat_dau, cv.ngay + cv.gio_ket_thuc)) filter (where cv.gio_ket_thuc > cv.gio_bat_dau) as mr
    from cv_ok cv join ta_loai_viec lv on lv.ma = cv.loai_viec
   where lv.tinh_vao = 'bo_tro'
     and cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null
   group by cv.nhan_su_id, cv.ngay
),
bo as (
  -- Thùy 04/11: các việc bổ trợ CHỒNG GIỜ (kèm em bù/yếu/đuổi ngay trong giờ trực khối, 2 em cùng lúc, 2 buổi xếp trùng)
  -- chỉ tính GIỜ CÓ MẶT THẬT — mỗi khoảng giờ 1 lần. Áp từ tháng có chấm công trên ERP; tháng trước đó giữ cộng thẳng như cũ.
  select bn.nhan_su_id,
         sum(bn.gio_khai)::numeric as gio_khai,
         sum(case when (select tu from k) >= public._ta_moc_cham_cong()
                  then coalesce((select sum(extract(epoch from (upper(r) - lower(r))) / 3600.0) from unnest(bn.mr) r), 0)
                  else bn.gio_khai end)::numeric as gio
    from bo_ngay bn
   group by bn.nhan_su_id
),
ngoai_dong as (
  select cv.nhan_su_id, lv.ma as loai, cv.ngay, l.ten_lop,
         case lv.don_vi when 'gio' then coalesce(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0, 0)
                        else 1 end as so_luong,
         (select gia_tri from dg where dg.ma = 'gia_' || lv.ma) as don_gia
    from cv_ok cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    left join lop l on l.id = cv.lop_id
   where lv.nhom = 'ngoai_package'
     -- trông thi lớp mình nằm trong công TG, không tính riêng
     and not (lv.tinh_vao = 'trong_thi' and exists (
            select 1 from lop_cua lc where lc.nhan_su_id = cv.nhan_su_id and lc.lop_id = cv.lop_id))
),
ngoai as (
  select nd.nhan_su_id,
         sum(round(nd.so_luong * coalesce(nd.don_gia, 0)))::numeric as tien,
         jsonb_agg(jsonb_build_object('loai', nd.loai, 'ngay', nd.ngay, 'lop', nd.ten_lop,
                   'so_luong', round(nd.so_luong::numeric, 2), 'don_gia', nd.don_gia,
                   'thieu_don_gia', nd.don_gia is null) order by nd.ngay) as ds
    from ngoai_dong nd group by nd.nhan_su_id
),
ket as (
  select s.nhan_su_id,
         coalesce(lt.tien, 0) as package_lop,
         coalesce(bo.gio, 0) as bo_tro_gio,
         coalesce(bo.gio_khai, 0) as bo_tro_gio_khai,
         -- Mỗi lớp có phần bổ trợ riêng (8 giờ, 40% bậc lớp ấy): chỉ tiêu = 8 × số lớp được phân công (không có thì
         -- theo lớp có TG); tiền = 0,4 × giờ ÷ chỉ tiêu × Σ bậc các lớp đó. Giờ dùng chung, không gắn lớp.
         case when n_bt.n = 0 then 0
              else round(c.w_bt * coalesce(bo.gio, 0) / nullif(c.chi_tieu * n_bt.n, 0) * n_bt.bac) end as bo_tro_tien,
         n_bt.n as n_lop_bt,
         n_bt.bac as bac_bt,
         coalesce(ng.tien, 0) as ngoai_package,
         coalesce((select g.tien_phat from gay_chot_thang g, k where g.ky = k.tu and g.nhan_su_id = s.nhan_su_id), 0) as tien_phat,
         lt.ds as ds_lop, ng.ds as ds_ngoai, ch.chinh_ten, ch.chinh_luong,
         coalesce(lt.tg_ho, 0) as day_thay, c.chi_tieu
    from ta_sel s
    left join lop_tong lt on lt.nhan_su_id = s.nhan_su_id
    left join chinh ch on ch.nhan_su_id = s.nhan_su_id
    left join bo on bo.nhan_su_id = s.nhan_su_id
    left join ngoai ng on ng.nhan_su_id = s.nhan_su_id, cfg c
    cross join lateral (
      select case when coalesce(lt.n_chu, 0) > 0 then lt.n_chu else coalesce(lt.n_lop_tg, 0) end as n,
             case when coalesce(lt.n_chu, 0) > 0 then lt.sum_bac_chu else coalesce(lt.sum_bac_tg, 0) end as bac) n_bt
)
select kt.nhan_su_id, n.ho_ten, kt.package_lop, round(kt.bo_tro_gio, 2), kt.bo_tro_tien, kt.ngoai_package,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package,
       kt.tien_phat,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package - kt.tien_phat,
       jsonb_build_object('lop', coalesce(kt.ds_lop, '[]'::jsonb),
                          'bo_tro', jsonb_build_object('gio', round(kt.bo_tro_gio, 2),
                                    'gio_khai', round(kt.bo_tro_gio_khai, 2),
                                    'gio_trung', round(kt.bo_tro_gio_khai - kt.bo_tro_gio, 2),
                                    'so_lop', kt.n_lop_bt, 'chi_tieu_moi_lop', kt.chi_tieu,
                                    'chi_tieu', kt.chi_tieu * kt.n_lop_bt,
                                    'ti_le', round(kt.bo_tro_gio / nullif(kt.chi_tieu * kt.n_lop_bt, 0), 4),
                                    'tong_bac', kt.bac_bt, 'lop_chinh', kt.chinh_ten, 'tien', kt.bo_tro_tien),
                          'ngoai_package', coalesce(kt.ds_ngoai, '[]'::jsonb),
                          'day_thay', kt.day_thay,
                          'tien_phat', kt.tien_phat)
  from ket kt join nhan_su n on n.id = kt.nhan_su_id
 where (p_ns is not null or kt.package_lop + kt.bo_tro_tien + kt.ngoai_package + kt.tien_phat <> 0)
   -- Thùy 15/10: GV kiêm TA KHÔNG nhận lương TA — từ tháng có chấm công trên ERP (tháng 9 trở về giữ nguyên)
   and not (p_ky >= public._ta_moc_cham_cong() and public._la_gv_kiem_ta(kt.nhan_su_id))
 order by n.ho_ten
$function$;
