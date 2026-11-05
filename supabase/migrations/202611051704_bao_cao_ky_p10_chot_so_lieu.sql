-- ============================================================================
-- 202611051704 — bao_cao_ky_p10_chot_so_lieu
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 "dữ liệu đánh giá học kì snap luôn từ bây giờ, không cần tổng kết realtime lại nữa".
--   Số liệu của báo cáo kì (đánh giá kiến thức · thi · hạng · thái độ · phụ lục · gợi ý) được CHỐT 1 lần vào bc_ky_so_lieu;
--   từ đó màn GV, bản gửi PH và lúc công bố đều đọc bản chốt (không tính lại). Phần GV nhập (điểm năng lực, nhận xét, kế hoạch)
--   vẫn đọc trực tiếp từ bao_cao_ph_ky — ghép bằng _bc_ky_phan_gv (một nguồn cho cả bản tính sống lẫn bản chốt).
--   Chưa chốt ⇒ vẫn tính sống như cũ. Chốt lại (admin) ⇒ bản cũ vào bc_ky_so_lieu_log (không mất).
--   Gợi ý "Cẩn thận" tính lại theo sai số GV đã nhập (ngưỡng ở danh mục) — số liệu chốt chỉ giữ sai số gợi ý.
-- MẤT GÌ (Luật xoá): không — thêm bảng + hàm, thay thân hàm (phần GV chuyển chỗ, kết quả y cũ).
-- ============================================================================

create table public.bc_ky_so_lieu (
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  mon         text not null,
  ky_id       uuid not null references public.ky_hoc(id),
  du_lieu     jsonb not null,            -- fn_bc_ky_tinh lúc chốt, BỎ phần GV nhập
  chot_at     timestamptz not null default now(),
  chot_boi    uuid default public.jwt_uid(),
  primary key (hoc_sinh_id, mon, ky_id)
);
create table public.bc_ky_so_lieu_log (
  id          bigserial primary key,
  hoc_sinh_id uuid not null,
  mon         text not null,
  ky_id       uuid not null,
  du_lieu_cu  jsonb not null,
  chot_at_cu  timestamptz not null,
  chot_boi_cu uuid,
  actor       uuid default public.jwt_uid(),
  at          timestamptz not null default now()
);
create or replace function public._bc_ky_so_lieu_log() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into bc_ky_so_lieu_log (hoc_sinh_id, mon, ky_id, du_lieu_cu, chot_at_cu, chot_boi_cu)
  values (old.hoc_sinh_id, old.mon, old.ky_id, old.du_lieu, old.chot_at, old.chot_boi);
  return new;
end $$;
create trigger trg_bc_ky_so_lieu_log before update or delete on public.bc_ky_so_lieu
  for each row execute function public._bc_ky_so_lieu_log();
alter table public.bc_ky_so_lieu enable row level security;
alter table public.bc_ky_so_lieu_log enable row level security;
create policy bc_ky_so_lieu_doc on public.bc_ky_so_lieu for select to authenticated using ((select public.la_thanh_vien()));
create policy bc_ky_so_lieu_them on public.bc_ky_so_lieu for insert to authenticated with check ((select public._bc_ky_la_admin()));
create policy bc_ky_so_lieu_sua on public.bc_ky_so_lieu for update to authenticated using ((select public._bc_ky_la_admin())) with check ((select public._bc_ky_la_admin()));
create policy bc_ky_so_lieu_log_doc on public.bc_ky_so_lieu_log for select to authenticated using ((select public.la_thanh_vien()));
grant select, insert, update on public.bc_ky_so_lieu to authenticated;
grant select on public.bc_ky_so_lieu_log to authenticated;

-- Phần GV nhập của báo cáo — MỘT nguồn (bản tính sống + bản chốt). p_goi_y = gợi ý của phần số liệu.
create or replace function public._bc_ky_phan_gv(p_hs uuid, p_mon text, p_ky uuid, p_goi_y jsonb)
returns jsonb language plpgsql stable set search_path to 'public' as $$
declare v_bc bao_cao_ph_ky; v_g jsonb := p_goi_y; v_cc jsonb;
begin
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  -- "Cẩn thận" 🤖 theo sai số GV đã nhập (em ≥ 2 lần thi)
  if v_bc.sai_so is not null and v_g is not null and coalesce((v_g ->> 'so_lan')::int, 0) >= 2 then
    select jsonb_object_agg(m.ma, jsonb_build_object(
             'muc_do', case when v_bc.sai_so <= m.nguong_tot then 'tot' when v_bc.sai_so >= m.nguong_chua_tot then 'chua_tot' else 'on' end,
             'khoa', null, 'so', jsonb_build_object('sai_so', v_bc.sai_so, 'tu_gv', true, 'so_lan', (v_g ->> 'so_lan')::int)))
      into v_cc from bc_ky_nx_muc m where m.goi_y = 'can_than' and m.xoa_at is null;
    if v_cc is not null then v_g := v_g || jsonb_build_object('muc', coalesce(v_g -> 'muc', '{}'::jsonb) || v_cc); end if;
  end if;
  return jsonb_build_object(
    'nang_luc', jsonb_build_object('diem', v_bc.diem_du_doan, 'sai_so', v_bc.sai_so),
    'nhan_xet', v_bc.nhan_xet,     -- ô "nhận xét thêm" (không bắt buộc)
    'ke_hoach', v_bc.ke_hoach,     -- ô "viết thêm" của kế hoạch
    -- nhận xét theo thang (Thùy 05/11): mục to → mục nhỏ GV đã chọn, chữ resolve từ danh mục (loại đã vào kho rác vẫn đọc được)
    'nhan_xet_chon', coalesce((
      select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'con', x.con) order by t.thu_tu, t.ma)
        from bc_ky_nx_muc t
        cross join lateral (
          select jsonb_agg(jsonb_build_object('ma', m.ma, 'ten', m.ten, 'muc_do', v_bc.nx_chon -> m.ma ->> 'muc_do', 'noi_dung', lc.noi_dung)
                           order by m.thu_tu, m.ma) as con
            from bc_ky_nx_muc m
            left join bc_ky_nx_lua_chon lc on lc.ma = v_bc.nx_chon -> m.ma ->> 'lc'
           where m.cha = t.ma and m.xoa_at is null and v_bc.nx_chon ? m.ma) x
       where t.cha is null and t.xoa_at is null and x.con is not null), '[]'::jsonb),
    'ke_hoach_chon', coalesce((
      select jsonb_agg(k.noi_dung order by e.ord)
        from jsonb_array_elements_text(v_bc.kh_chon) with ordinality e(ma, ord) join bc_ky_kh_mau k on k.ma = e.ma), '[]'::jsonb),
    'goi_y', v_g);
end $$;
revoke execute on function public._bc_ky_phan_gv(uuid, text, uuid, jsonb) from public, anon;
grant execute on function public._bc_ky_phan_gv(uuid, text, uuid, jsonb) to authenticated, service_role;

create or replace function public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb
language plpgsql stable
set search_path to 'public'
as $function$
declare
  v_ky ky_hoc;
  v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu date; v_het date; v_cuoi date; v_60 date;
  v_lop record; v_hs record; v_gv text; v_bc bao_cao_ph_ky;
  v_out jsonb;
begin
  select * into v_ky from ky_hoc where id = p_ky;
  if v_ky.id is null then raise exception 'Không có kì %', p_ky; end if;
  v_tu   := (v_ky.tu_thang || '-01')::date;
  v_het  := ((v_ky.den_thang || '-01')::date + interval '1 month')::date;
  v_cuoi := least(v_het - 1, v_homnay);
  v_60   := v_cuoi - 59;   -- 60 ngày tính cả ngày cuối (Thùy 04/11: đếm theo LẦN nên nới từ 45)
  select h.id, h.ho_ten, h.ma_hs into v_hs from hoc_sinh h where h.id = p_hs;
  select l.id, l.ten_lop, l.khoi into v_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;
  select ns.ho_ten into v_gv from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
   where pc.lop_id = v_lop.id and pc.vai_tro = 'gv' and pc.la_chinh limit 1;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;

  with c as materialized (
    select x.* from public._dbht_cau(array[p_hs], least(v_tu, v_60), p_mon) x where x.ngay <= v_cuoi
  ),
  dv_cd as (select distinct chu_de_id as ma from c),
  dv_ch as (select distinct chuyen_de_id as ma, chu_de_id as chu_de from c),   -- 1 chuyên đề có thể ở nhiều chủ đề ⇒ theo CẶP
  -- LUẬT ĐÁNH GIÁ (Thùy 04/11, đo trên K9 so với luật đếm câu): đếm theo LẦN đánh giá (1 buổi ET/BTVN/MT hay 1 bài app = 1 lần, nhiều câu
  -- trong lần vẫn 1 phiếu; điểm lần = TB các câu của đơn vị trong lần). Chủ đề: 10 lần gần nhất, trọng số 6-6-4-4-4-4-3-3-3-3; chuyên đề:
  -- 5 lần gần nhất, trọng số 6-4-4-3-3 (lần gần nhất nặng nhất). Cửa sổ 60 ngày cuối kì. Tính cho MỌI em cùng khối × môn ⇒ hạng của em
  -- trong từng đơn vị (chỉ xếp em có lần đánh giá ở đơn vị đó, bằng % thì cùng hạng); % của em lấy từ chính tập này (một nơi tính).
  ds_khoi as (
    select array(select distinct x from unnest(array_agg(hl.hoc_sinh_id) || array[p_hs]) x) as ids
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_lop.khoi
  ),
  ck as materialized (
    select x.* from public._dbht_cau((select ids from ds_khoi), v_60, p_mon) x where x.ngay <= v_cuoi
  ),
  lan_cd as (   -- 1 dòng / (em, chủ đề, lần)
    select hoc_sinh_id, chu_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, luot
  ),
  lan_ch as (   -- 1 dòng / (em, chủ đề, chuyên đề, lần)
    select hoc_sinh_id, chu_de_id as chu_de, chuyen_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, chuyen_de_id, luot
  ),
  r_cd as (select l.*, row_number() over (partition by hoc_sinh_id, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_cd l),
  r_ch as (select l.*, row_number() over (partition by hoc_sinh_id, chu_de, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_ch l),
  k_cd as (
    select z.*, rank() over (partition by ma order by p desc)::int as hang, count(*) over (partition by ma)::int as tong
      from (select hoc_sinh_id, ma,
                   round(100 * sum(g * (array[6,6,4,4,4,4,3,3,3,3])[rn]) / sum((array[6,6,4,4,4,4,3,3,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_cd where rn <= 10 group by hoc_sinh_id, ma) z
  ),
  k_ch as (
    select z.*, rank() over (partition by chu_de, ma order by p desc)::int as hang, count(*) over (partition by chu_de, ma)::int as tong
      from (select hoc_sinh_id, chu_de, ma,
                   round(100 * sum(g * (array[6,4,4,3,3])[rn]) / sum((array[6,4,4,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_ch where rn <= 5 group by hoc_sinh_id, chu_de, ma) z
  ),
  p_cd as (select ma, p, n, hang, tong from k_cd where hoc_sinh_id = p_hs),
  p_ch as (select ma, chu_de, p, n, hang, tong from k_ch where hoc_sinh_id = p_hs),
  t_cd as (
    select dv.ma,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join dai_bdm_chu_de dc on dc.id = case when dv.ma like 'H:%' then substr(dv.ma, 3) else dv.ma end
  ),
  -- Tag Cơ bản / Nâng cao cho chuyên đề ĐẠI SỐ (nhánh 'toan'; Hình, HGT, KHTN không tag — Thùy 04/11): theo ĐA SỐ độ khó các dạng bài
  -- của cặp (chủ đề, chuyên đề) trên bản đồ (muc_do ≤3 cơ bản, ≥4 nâng cao — cùng ngưỡng report tháng); hoà ⇒ nâng cao; không dạng nào có độ khó ⇒ không tag.
  tag as (
    select n.chu_de_id as chu_de, n.chuyen_de_id as ma,
           case when count(db.muc_do) = 0 then null
                when count(*) filter (where db.muc_do >= 4) >= count(*) filter (where db.muc_do <= 3) then 'nang_cao' else 'co_ban' end as muc
      from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.nhanh = 'toan'
      join dai_bdm_dang_bai db on db.nhom_id = n.id
     where n.chu_de_id in (select chu_de from dv_ch)
     group by n.chu_de_id, n.chuyen_de_id
  ),
  t_ch as (
    select dv.ma, dv.chu_de,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, nmh.ten, dch.ten, dv.ma) as ten,
           coalesce(ko.thu_tu, nmh.thu_tu, dbo.thu_tu, 9999) as tt
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join hinh_nhom_mo_hinh nmh on dv.ma like 'H:%' and nmh.id::text = substr(dv.ma, 3)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join dai_bdm_o dbo on dbo.chuyen_de_id = dv.ma and dbo.chu_de_id = dv.chu_de
  ),
  -- LẦN THI trong kì của KHỐI em (mọi em của khối — dùng cho hạng, TB lần thi và phụ lục)
  kt as (
    select k.id, k.loai, coalesce(k.ngay, b.ngay) as ngay,
           public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, b.ngay)) as thang
      from ky_thi k left join buoi_hoc b on b.id = k.buoi_hoc_id
     where k.loai in ('mt_sat_hach', 'khao_sat_thang') and k.mon = p_mon and k.khoi = v_lop.khoi
       and coalesce(k.ngay, b.ngay) is not null
  ),
  kt2 as (select * from kt where thang between v_ky.tu_thang and v_ky.den_thang),
  d as (
    select kt2.loai, kt2.thang, dt.hoc_sinh_id, avg(dt.diem) as diem, min(kt2.ngay) as ngay
      from diem_thi dt join kt2 on kt2.id = dt.ky_thi_id
     where dt.diem is not null
     group by kt2.loai, kt2.thang, dt.hoc_sinh_id
  ),
  lan as (
    select d.*, rank() over (partition by loai, thang order by diem desc)::int as hang,
           count(*) over (partition by loai, thang)::int as n_mau,
           avg(diem) over (partition by loai, thang) as tb
      from d
  ),
  cot0 as (select loai, thang, min(ngay) as ngay from lan group by loai, thang),
  cot as (   -- các lần thi của khối, theo thời gian (cột phụ lục + trục đồ thị). Nhãn cho PH (Thùy 04/11): MT = "T8", khảo sát = "Khảo sát 1, 2…" theo thứ tự trong kì
    select loai, thang, ngay,
           case loai when 'mt_sat_hach' then 'T' || ltrim(substr(thang, 6, 2), '0')
                else 'KS' || row_number() over (partition by loai order by ngay, thang) end as nhan,   -- Thùy 04/11: viết tắt, cột không bị phình
           row_number() over (order by ngay, loai) as stt
      from cot0
  ),
  hang_tb as (   -- hạng TB các lần em ĐÃ thi ⇒ xếp hạng lại (Thùy 04/11)
    select hoc_sinh_id, avg(hang) as hang_tb, avg(diem) as diem_tb, count(*)::int as so_lan from lan group by hoc_sinh_id
  ),
  ky_hang as (
    select h.*, rank() over (order by h.hang_tb asc)::int as hang, count(*) over ()::int as tong from hang_tb h
  ),
  lop_hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id in (select hoc_sinh_id from ky_hang)
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  cc as (
    select count(*) filter (where h.diem_danh = 'vang')::int as vang,
           count(*) filter (where h.diem_danh = 'vang_phep')::int as vang_phep,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(h.diem_danh)::int as tong
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai is distinct from 'huy'
      join lop l on l.id = b.lop_id and l.mon = p_mon
     where h.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
  ),
  bt as (   -- BTVN: buổi thường của lớp môn này + ca bù cho buổi của môn này
    select k.trang_thai_nop, k.thai_do
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.trang_thai is distinct from 'huy'
      left join lop l on l.id = b.lop_id
     where k.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
       and ((b.loai = 'thuong' and l.mon = p_mon)
         or (b.loai = 'bu' and exists (select 1 from buoi_hoc_hs hh join buoi_hoc me on me.id = hh.bu_cho_buoi_id
                                                join lop lm on lm.id = me.lop_id and lm.mon = p_mon
                                        where hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = p_hs)))
       and (k.trang_thai_nop is not null or k.thai_do is not null)
  ),
  -- GỢI Ý (spec §D, Thùy 05/11) — GV duyệt trên màn nhập, không tự ghi vào báo cáo.
  em_lan as (   -- các lần thi CỦA EM trong kì
    select l.diem, l.diem - l.tb as chenh, l.hang, l.n_mau,
           row_number() over (order by l.ngay desc, l.loai) as rn_moi,
           row_number() over (order by l.ngay asc, l.loai) as rn_cu,
           count(*) over () as n
      from lan l where l.hoc_sinh_id = p_hs
  ),
  dd as (
    -- điểm dự đoán = TB điểm, trọng số lần gần nhất 6-4-3-3 · sai số = max(0,75; 1,5 × độ lệch chuẩn của CHÊNH so TB lần thi), 1 lần ⇒ 1,0
    -- (backtest T10, 254 em: lệch TB 0,97; 65% lọt khoảng). Bội 0,25.
    -- tang = chênh TB nửa sau kì − nửa đầu kì (mỗi nửa = floor(n/2) lần; lẻ thì bỏ lần giữa) · top = mọi lần trong top 20%.
    select count(*)::int as n,
           least(10, greatest(0, round(4 * sum(diem * (case rn_moi when 1 then 6 when 2 then 4 else 3 end))
                                      / nullif(sum(case rn_moi when 1 then 6 when 2 then 4 else 3 end), 0)) / 4)) as du_doan,
           case when count(*) < 2 then 1.0 else greatest(0.75, round(4 * 1.5 * stddev_pop(chenh)) / 4) end as sai_so,
           avg(chenh) filter (where rn_moi <= floor(n / 2.0)) - avg(chenh) filter (where rn_cu <= floor(n / 2.0)) as tang,
           bool_and(hang::numeric / n_mau <= 0.2) as top
      from em_lan
  ),
  bt_so as (   -- BTVN cho gợi ý "Về nhà": mẫu = buổi đã ghi trạng thái nộp, bỏ xin phép
    select count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int as dat,
           count(*) filter (where trang_thai_nop is not null and trang_thai_nop <> 'xin_phep')::int as mau,
           count(*) filter (where trang_thai_nop = 'khong_lam')::int as kl,
           count(*) filter (where trang_thai_nop = 'nop_muon')::int as nm,
           count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int as knt
      from bt
  ),
  gy as (   -- mức gợi ý cho mục 🤖 — ngưỡng đọc từ danh mục (Thùy sửa trên ERP)
    select m.ma,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 then null
                               when 100.0 * b.dat / b.mau >= m.nguong_tot then 'tot'
                               when 100.0 * b.dat / b.mau < m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'can_than' then case when d.n < 2 then null
                               when coalesce(v_bc.sai_so, d.sai_so) <= m.nguong_tot then 'tot'
                               when coalesce(v_bc.sai_so, d.sai_so) >= m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'tien_bo_diem' then case when d.n < 2 then null
                               when d.top or d.tang >= m.nguong_tot then 'tot'
                               when d.tang <= m.nguong_chua_tot then 'chua_tot' else 'on' end
      end as muc_do,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 or b.kl + b.nm + b.knt = 0 then null
                              when b.kl >= b.nm and b.kl >= b.knt then 'khong_lam'
                              when b.nm >= b.knt then 'nop_muon' else 'khong_nghiem_tuc' end
        when 'tien_bo_diem' then case when d.n >= 2 and d.top then 'top' end
      end as khoa,
      case m.goi_y
        when 'btvn' then jsonb_build_object('dat', b.dat, 'mau', b.mau, 'khong_lam', b.kl, 'nop_muon', b.nm, 'chua_nghiem_tuc', b.knt)
        when 'can_than' then jsonb_build_object('sai_so', coalesce(v_bc.sai_so, d.sai_so), 'tu_gv', v_bc.sai_so is not null, 'so_lan', d.n)
        when 'tien_bo_diem' then jsonb_build_object('tang', round(d.tang, 2), 'top', d.top, 'so_lan', d.n)
      end as so
      from bc_ky_nx_muc m cross join bt_so b cross join dd d
     where m.goi_y is not null and m.xoa_at is null
  )
  select jsonb_build_object(
    'phien_ban', 3,
    'tinh_luc', now(),
    'hs', jsonb_build_object('id', v_hs.id, 'ho_ten', v_hs.ho_ten, 'ma_hs', v_hs.ma_hs),
    'lop', jsonb_build_object('id', v_lop.id, 'ten', v_lop.ten_lop, 'khoi', v_lop.khoi),
    'mon', p_mon,
    'gv', v_gv,
    'ky', jsonb_build_object('id', v_ky.id, 'ten', v_ky.ten, 'tu_thang', v_ky.tu_thang, 'den_thang', v_ky.den_thang),
    -- PHẦN 1 — Đánh giá: cây chủ đề → chuyên đề
    'danh_gia', jsonb_build_object(
      'tu', v_60, 'den', v_cuoi, 'n_chu_de', 10, 'n_chuyen_de', 5, 'luat', 'lan',
      'chu_de', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ma', t.ma, 'ten', t.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 10, 'hang', p.hang, 'tong', p.tong,
                 'chuyen_de', coalesce((
                   select jsonb_agg(jsonb_build_object('ma', ch.ma, 'ten', ch.ten, 'p', pc.p, 'n', coalesce(pc.n, 0), 'n_toi_da', 5, 'muc', tg.muc,
                                                      'hang', pc.hang, 'tong', pc.tong)
                                    order by ch.tt, ch.ten)
                     from t_ch ch left join p_ch pc on pc.ma = ch.ma and pc.chu_de = ch.chu_de
                     left join tag tg on tg.ma = ch.ma and tg.chu_de = ch.chu_de
                    where ch.chu_de = t.ma), '[]'::jsonb))
               order by t.tt, t.ten)
          from t_cd t left join p_cd p on p.ma = t.ma), '[]'::jsonb)),
    -- PHẦN 2 — Kết quả thi của em (bảng + đồ thị) và hạng cả kì theo HẠNG TB
    'thi', coalesce((select jsonb_agg(jsonb_build_object(
                       'loai', l.loai, 'nhan', ct.nhan, 'thang', l.thang, 'ngay', l.ngay,
                       'diem', round(l.diem, 2), 'tb', round(l.tb, 2), 'chenh', round(l.diem, 2) - round(l.tb, 2),   -- điểm 2 chữ số (Thùy 04/11)
                       'n_mau', l.n_mau, 'hang', l.hang)
                     order by ct.stt) from lan l join cot ct using (loai, thang) where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'hang_tb', round(k.hang_tb, 1),
                                          'diem_tb', round(k.diem_tb, 2), 'so_lan', k.so_lan)
                  from ky_hang k where k.hoc_sinh_id = p_hs),
    -- PHẦN 3 — Thái độ học tập
    'thai_do', jsonb_build_object(
      'chuyen_can', (select to_jsonb(cc) from cc),
      'btvn', (select jsonb_build_object(
                 'tong', count(*)::int,
                 -- đạt chuẩn = nộp đúng hạn + thái độ không bị ghi chưa nghiêm túc / chống đối (Thùy 04/11)
                 'dat_chuan', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                 and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 -- NHÓM KHÔNG TRÙNG (Thùy 04/11 — PH cộng các ô phải ra đúng tổng): dat_chuan + dung_han_chua_nt + nop_muon + khong_lam
                 -- + xin_phep + chua_ghi = tong. khong_nghiem_tuc / chong_doi bên dưới là số ĐẾM CHỒNG (chỉ để ghi chú "trong đó…").
                 'dung_han_chua_nt', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                        and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chua_ghi', count(*) filter (where trang_thai_nop is null)::int,
                 'khong_lam', count(*) filter (where trang_thai_nop = 'khong_lam')::int,
                 'nop_muon', count(*) filter (where trang_thai_nop = 'nop_muon')::int,
                 'xin_phep', count(*) filter (where trang_thai_nop = 'xin_phep')::int,
                 'khong_nghiem_tuc', count(*) filter (where thai_do in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chong_doi', count(*) filter (where thai_do = 'chong_doi')::int) from bt)),
    -- PHẦN 4 — GV nhập: KHÔNG ở đây — ghép bằng _bc_ky_phan_gv lúc trả (mig 202611051704, để số liệu chốt dùng chung)
    'goi_y', (select jsonb_build_object(
                'du_doan', case when d.n > 0 then d.du_doan end,
                'sai_so', case when d.n > 0 then d.sai_so end,
                'so_lan', d.n,
                'muc', coalesce((select jsonb_object_agg(g.ma, jsonb_build_object('muc_do', g.muc_do, 'khoa', g.khoa, 'so', g.so)) from gy g), '{}'::jsonb))
                from dd d),
    -- PHẦN 5 — Phụ lục: toàn bộ em cùng khối × môn có ≥1 lần thi trong kì, xếp theo hạng TB
    'phu_luc', jsonb_build_object(
      'cot', coalesce((select jsonb_agg(jsonb_build_object('nhan', nhan, 'ngay', ngay) order by stt) from cot), '[]'::jsonb),
      'hs', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ten', hs.ho_ten, 'lop', lh.ten_lop, 'la_em', k.hoc_sinh_id = p_hs,
                 'diem', (select jsonb_agg((select round(l.diem, 2) from lan l where l.hoc_sinh_id = k.hoc_sinh_id
                                              and l.loai = ct.loai and l.thang = ct.thang) order by ct.stt) from cot ct),
                 'hang_tb', round(k.hang_tb, 1), 'hang', k.hang)
               order by k.hang, hs.ho_ten)
          from ky_hang k join hoc_sinh hs on hs.id = k.hoc_sinh_id left join lop_hs lh on lh.hoc_sinh_id = k.hoc_sinh_id), '[]'::jsonb))
  ) into v_out;
  return v_out || public._bc_ky_phan_gv(p_hs, p_mon, p_ky, v_out -> 'goi_y');
end
$function$;


-- Số liệu của báo cáo: bản CHỐT nếu có (+ so_lieu_chot_at), chưa chốt ⇒ tính sống. Luôn ghép phần GV nhập mới nhất.
create or replace function public.fn_bc_ky_du_lieu(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb language plpgsql stable set search_path to 'public' as $$
declare v jsonb;
begin
  select s.du_lieu || jsonb_build_object('so_lieu_chot_at', s.chot_at) into v
    from bc_ky_so_lieu s where s.hoc_sinh_id = p_hs and s.mon = p_mon and s.ky_id = p_ky;
  if v is null then return public.fn_bc_ky_tinh(p_hs, p_mon, p_ky); end if;
  return v || public._bc_ky_phan_gv(p_hs, p_mon, p_ky, v -> 'goi_y');
end $$;

create or replace function public.fn_bc_ky_xem(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb language plpgsql stable set search_path to 'public' as $$
declare v_bc bao_cao_ph_ky;
begin
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  if v_bc.cong_bo_at is not null then
    return jsonb_build_object('cong_bo_at', v_bc.cong_bo_at, 'du_lieu', v_bc.snapshot);
  end if;
  return jsonb_build_object('cong_bo_at', null, 'du_lieu', public.fn_bc_ky_du_lieu(p_hs, p_mon, p_ky));
end $$;

create or replace function public.fn_bc_ky_cong_bo(p_hs uuid, p_mon text, p_ky uuid)
returns timestamptz language plpgsql volatile set search_path to 'public' as $$
declare v_snap jsonb; v_at timestamptz := now(); v_bc bao_cao_ph_ky; v_thieu text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  if v_bc.cong_bo_at is not null then raise exception 'Báo cáo kì này đã công bố.'; end if;
  v_thieu := public._bc_ky_thieu(v_bc);
  if v_thieu is not null then raise exception '%', v_thieu; end if;
  v_snap := public.fn_bc_ky_du_lieu(p_hs, p_mon, p_ky) || jsonb_build_object('cong_bo_at', v_at);   -- số đã chốt ⇒ dùng đúng số đó
  update bao_cao_ph_ky set snapshot = v_snap, cong_bo_at = v_at, cong_bo_boi = public.jwt_uid()
   where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  return v_at;
end $$;

-- Chốt số liệu 1 em (admin). Đã chốt ⇒ ghi đè, bản cũ vào log (trigger).
create or replace function public.fn_bc_ky_chot_hs(p_hs uuid, p_mon text, p_ky uuid)
returns timestamptz language plpgsql volatile set search_path to 'public' as $$
declare v_at timestamptz := now();
begin
  if not public._bc_ky_la_admin() then raise exception 'Chỉ admin chốt số liệu kì.'; end if;
  insert into bc_ky_so_lieu (hoc_sinh_id, mon, ky_id, du_lieu, chot_at, chot_boi)
  values (p_hs, p_mon, p_ky,
          public.fn_bc_ky_tinh(p_hs, p_mon, p_ky) - array['nang_luc', 'nhan_xet', 'ke_hoach', 'nhan_xet_chon', 'ke_hoach_chon'],
          v_at, public.jwt_uid())
  on conflict (hoc_sinh_id, mon, ky_id) do update
     set du_lieu = excluded.du_lieu, chot_at = excluded.chot_at, chot_boi = excluded.chot_boi;
  return v_at;
end $$;
revoke execute on function public.fn_bc_ky_du_lieu(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_xem(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) from public, anon;
revoke execute on function public.fn_bc_ky_chot_hs(uuid, text, uuid) from public, anon;
grant execute on function public.fn_bc_ky_du_lieu(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_xem(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) to authenticated, service_role;
grant execute on function public.fn_bc_ky_chot_hs(uuid, text, uuid) to authenticated, service_role;
