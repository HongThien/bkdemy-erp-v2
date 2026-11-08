-- ============================================================================
-- 202611041924 — bao_cao_ky_p7_btvn_nhom_khong_trung
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 04/11 thấy 4 ô BTVN cộng không ra tổng (16 + 1 + 1 + 2 ≠ 18): ô "không nghiêm túc" đếm THÁI ĐỘ, chồng lên "không làm" /
--   "nộp muộn" (đếm TRẠNG THÁI NỘP). Thùy duyệt đề xuất: chia thành nhóm không trùng — đạt chuẩn · đúng hạn nhưng chưa nghiêm túc · nộp
--   muộn · không làm · xin phép · chưa ghi trạng thái (cộng = tổng). Thêm 2 trường: dung_han_chua_nt, chua_ghi. Phần còn lại giữ mig 202611041900.
--
-- MẤT GÌ (Luật xoá): không — thay thân 1 hàm, thêm 2 trường jsonb.
-- ============================================================================

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
  )
  select jsonb_build_object(
    'phien_ban', 2,
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
                       'diem', round(l.diem, 1), 'tb', round(l.tb, 1), 'chenh', round(l.diem, 1) - round(l.tb, 1),
                       'n_mau', l.n_mau, 'hang', l.hang)
                     order by ct.stt) from lan l join cot ct using (loai, thang) where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'hang_tb', round(k.hang_tb, 1),
                                          'diem_tb', round(k.diem_tb, 1), 'so_lan', k.so_lan)
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
    -- PHẦN 4 — GV nhập
    'nang_luc', jsonb_build_object('diem', v_bc.diem_du_doan, 'sai_so', v_bc.sai_so),
    'nhan_xet', v_bc.nhan_xet,
    'ke_hoach', v_bc.ke_hoach,
    -- PHẦN 5 — Phụ lục: toàn bộ em cùng khối × môn có ≥1 lần thi trong kì, xếp theo hạng TB
    'phu_luc', jsonb_build_object(
      'cot', coalesce((select jsonb_agg(jsonb_build_object('nhan', nhan, 'ngay', ngay) order by stt) from cot), '[]'::jsonb),
      'hs', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ten', hs.ho_ten, 'lop', lh.ten_lop, 'la_em', k.hoc_sinh_id = p_hs,
                 'diem', (select jsonb_agg((select round(l.diem, 1) from lan l where l.hoc_sinh_id = k.hoc_sinh_id
                                              and l.loai = ct.loai and l.thang = ct.thang) order by ct.stt) from cot ct),
                 'hang_tb', round(k.hang_tb, 1), 'hang', k.hang)
               order by k.hang, hs.ho_ten)
          from ky_hang k join hoc_sinh hs on hs.id = k.hoc_sinh_id left join lop_hs lh on lh.hoc_sinh_id = k.hoc_sinh_id), '[]'::jsonb))
  ) into v_out;
  return v_out;
end
$function$;
