-- PHÒNG LÀM VIỆC TRƯỞNG KHỐI — cảnh phòng có nhân vật = TA cấp dưới (Thùy 03/11).
-- Mỗi nhân vật = 1 TA của khối mình (spec-truong-khoi.md §2.3: cấp dưới SUY từ phân công lớp, không dựng cây tay).
-- Số hiện trên đầu = Hiệu suất TA THÁNG (đúng công thức fn_hsta_* đã chốt 08/10 — không viết công thức thứ hai).
-- Bấm nhân vật ⇒ việc tuần này (đang làm · đã xong · trễ hạn) + gậy tháng.
--
-- 1. _phong_cap_duoi_ds(): TA (phan_cong_lop.vai_tro='tg') của lớp đang học thuộc ô (môn × khối) trong phạm vi của tôi.
-- 2. _phong_la_cap_duoi(p_ns): người này có phải cấp dưới của tôi không.
-- 3. Nới CỔNG QUYỀN của fn_hsta_task/_bo_tro/_gay/_thang: thêm "trưởng khối xem đúng 1 TA cấp dưới (p_ns)".
--    Trước chỉ ai có màn Chất lượng vận hành (db_chatluong) mới gọi được ⇒ trưởng khối không thấy hiệu suất người của mình.
--    Không đổi công thức; thân hàm lấy từ bản ĐANG CHẠY.
-- 4. fn_phong_cap_duoi(): 1 dòng / TA — hiệu suất tháng + đếm việc tuần + gậy tháng (cho cảnh phòng).
-- 5. fn_phong_cap_duoi_chi_tiet(p_ns): jsonb chi tiết khi bấm vào nhân vật.
--
-- Định nghĩa VIỆC (Thùy 03/11, tạm — sửa ở đây là đổi mọi nơi): việc vận hành của TA = chấm BTVN · chấm ET (không tính ET online),
-- lấy từ fn_viec_buoi_thuong (nguồn invariant chung). Trạng thái theo LẦN ĐÓNG ĐẦU (_viec_dong_dau, cùng cách Gậy đo):
--   dang_lam = chưa đóng, chưa quá hạn · xong = đóng lần đầu đúng hạn · xong_tre = đóng lần đầu sau hạn · qua_han = chưa đóng, đã quá hạn.
-- "Tuần này" = buổi thứ 2 → CN tuần hiện tại (giờ VN) + việc TỒN (buổi 30 ngày trước đó, chưa đóng mà đã quá hạn).

create or replace function public._phong_cap_duoi_ds()
 returns table(nhan_su_id uuid, khoi text[])
 language sql stable security definer set search_path to 'public'
as $$
  select pc.nhan_su_id, array_agg(distinct l.khoi order by l.khoi)
    from phan_cong_lop pc
    join lop l on l.id = pc.lop_id
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
   where pc.vai_tro = 'tg' and l.trang_thai = 'dang_hoc' and l.khoi is not null
     and pc.nhan_su_id is distinct from public.current_nhan_su_id()
     and public._trong_pham_vi(l.mon, l.khoi)
   group by pc.nhan_su_id
$$;

create or replace function public._phong_la_cap_duoi(p_ns uuid)
 returns boolean
 language sql stable security definer set search_path to 'public'
as $$
  select exists (select 1 from public._phong_cap_duoi_ds() d where d.nhan_su_id = p_ns)
$$;

-- Việc vận hành của 1 TA quanh tuần này (tuần + tồn) — dùng chung cho bảng tổng và chi tiết, 1 nguồn trạng thái.
-- ── 3. Nới cổng quyền fn_hsta_* (sau khi đã có _phong_la_cap_duoi) ──
-- fn_hsta_task: thân lấy từ bản ĐANG CHẠY (pg_get_functiondef 03/11), chỉ đổi dòng cổng quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_task(p_tu date, p_den date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, dau_viec text, buoi_id uuid, ten_lop text, ngay date, han timestamp with time zone, dong_dau timestamp with time zone, dong_cuoi timestamp with time zone, so_mo_lai integer, tre_gio numeric, tru_tien_do integer, gay_chat_luong integer, gay_tre integer, tru_chat_luong integer, diem numeric, tinh boolean, ly_do_khong_tinh text, co text[], so_co_mat integer, so_kq integer, nop_dung_han integer, nop_muon integer, khong_lam integer, xin_phep integer, pct_dung_han numeric, pct_dung_han_lop_khac numeric, so_cau integer, o_can integer, o_cham integer, pct_o_cham numeric, so_hs_vang_co_diem integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with v as (
    select v.*, ns.ho_ten
    from public.fn_viec_buoi_thuong(p_tu, p_den, true) v
    join nhan_su ns on ns.id = v.nhan_su_id
    where v.vai = 'tg' and v.tab in ('btvn', 'et') and not (v.tab = 'et' and v.et_online)
      and not ns.an_xep_hang
      -- CHỈ lớp được phân công TRỰC TIẾP (TA chính) — CEO 08/10; khớp cách Gậy chọn người chịu (la_chinh)
      and exists (select 1 from phan_cong_lop pc where pc.lop_id = v.lop_id and pc.nhan_su_id = v.nhan_su_id
                    and pc.vai_tro = 'tg' and pc.la_chinh)
      and (p_ns is null or v.nhan_su_id = p_ns)
      and (v.dong_at is not null or v.han <= now())   -- chưa tới hạn mà chưa đóng = chưa phải việc để đo
  ),
  t as materialized (
    select v.*,
      -- lần đóng ĐẦU TIÊN: lịch sử phase (từ 23/09) + giá trị cũ khi mở lại/đổi mốc; trước đó chỉ còn dong_at
      public._viec_dong_dau(v.buoi_id, v.tab, v.dong_at) as dd,
      (select count(*) from buoi_hoc_phase_log l where l.buoi_hoc_id = v.buoi_id and l.phase = v.tab and l.su_kien = 'mo_lai')::int as mo_lai,
      exists (select 1 from ta_vang tv where tv.buoi_hoc_id = v.buoi_id and tv.nhan_su_id = v.nhan_su_id) as vang,
      (select count(*) from gami_session_problems p where p.buoi_hoc_id = v.buoi_id and p.phase = v.tab and not p.hidden)::int as n_cau,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g left join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and coalesce(lo.ma, '') <> 'cham_deadline')::int as g_cl,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and lo.ma = 'cham_deadline')::int as g_tre,
      exists (select 1 from gay_de_xuat d where d.ref_key = v.ref_key and d.trang_thai = 'cho') as g_cho,
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
      extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600 as tre,   -- trễ theo LẦN ĐÓNG ĐẦU (cùng cách hệ Gậy đo)
      -- TIẾN ĐỘ theo GẬY (CEO 08/10): CHỈ trừ khi có gậy Chậm deadline đã vào sổ; mức theo trễ lần đóng đầu.
      -- Gậy đã vào sổ mà lần đóng đầu đúng hạn (chốt trước khi sửa máy quét) ⇒ vẫn trừ mức thấp nhất + cờ để người chốt xem lại.
      case when t.g_tre > 0 then greatest(public._hsta_tru_tien_do((extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600)::numeric), 10) else 0 end as td,
      case when t.vang then 'TA vắng buổi này'
           when t.n_cau = 0 and t.g_tre + t.g_cl = 0 then case t.tab when 'btvn' then 'Buổi không có câu BTVN trên hệ thống' else 'Buổi không có câu ET trên hệ thống' end
           when t.han is null then 'Chưa xác định được hạn (không tìm thấy buổi kế tiếp)'
      end as khong_tinh
    from t
  )
  select s.nhan_su_id, s.ho_ten, s.tab, s.buoi_id, s.ten_lop, s.ngay,
    s.han, s.dd, s.dong_at, s.mo_lai,
    round(greatest(s.tre, 0)::numeric, 1),
    s.td,
    s.g_cl, s.g_tre,
    s.g_cl * public._hsta_tru_moi_gay(),
    case when s.khong_tinh is null
         then greatest(0, 100 - s.td - s.g_cl * public._hsta_tru_moi_gay())::numeric end,
    s.khong_tinh is null,
    s.khong_tinh,
    array_remove(array[
      case when s.dd is null then 'chua_dong' end,
      case when s.g_cho then 'gay_cho_chot' end,
      case when s.n_cau = 0 and s.g_tre + s.g_cl > 0 then 'khong_cau_co_gay' end,
      case when s.g_tre > 0 and s.dd is not null and s.dd <= s.han then 'gay_dau_dung_han' end,
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
end $function$;

-- fn_hsta_bo_tro: thân lấy từ bản ĐANG CHẠY (pg_get_functiondef 03/11), chỉ đổi dòng cổng quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_bo_tro(p_tu date, p_den date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, buoi_id uuid, loai text, ngay date, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, so_phut integer, khung text, hoc_sinh text[], so_co_mat integer, so_vang integer, lop_goc text, danh_gia_xong_at timestamp with time zone, bai_dau_at timestamp with time zone, so_gay integer, co text[])
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
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
end $function$;

-- fn_hsta_gay: thân lấy từ bản ĐANG CHẠY (pg_get_functiondef 03/11), chỉ đổi dòng cổng quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_gay(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(nguon text, id uuid, trang_thai text, ma_loi text, ten_loi text, so_gay integer, tre_phut integer, ly_do text, ref_key text, nguoi text, tao_at timestamp with time zone, thu_hoi_at timestamp with time zone, gan_voi text, buoi_id uuid, ngay_task date, ten_lop text, tinh_vao text, ly_do_khong_tinh text)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with g as (
    select 'so'::text as nguon, l.id, case when l.thu_hoi_at is null then 'da_vao_so' else 'da_thu_hoi' end as tt,
      lo.ma, lo.ten, l.so_gay, d.tre_phut, coalesce(l.ly_do, l.ref_mo_ta) as ly_do, l.ref_id, n.ho_ten as nguoi,
      l.created_at, l.thu_hoi_at, l.ky
    from gay_ledger l left join gay_loi lo on lo.id = l.loi_id left join gay_de_xuat d on d.ledger_id = l.id
    left join nhan_su n on n.id = l.nguoi_tao
    where l.nhan_su_id = p_ns and l.loai <> 'go' and l.so_gay > 0
    union all
    select 'de_xuat', d.id, 'cho_chot', 'cham_deadline', 'Chậm deadline trên ERP (đề xuất)', d.so_gay, d.tre_phut, d.mo_ta, d.ref_key,
      null, d.created_at, null, date_trunc('month', coalesce(d.deadline_at, d.created_at) at time zone 'Asia/Ho_Chi_Minh')::date
    from gay_de_xuat d where d.nhan_su_id = p_ns and d.trang_thai = 'cho'
  ),
  x as (
    select g.*, split_part(g.ref_id, '|', 2) as tab, b.id as bid, b.ngay as bngay, b.loai as bloai, (select lp.ten_lop from lop lp where lp.id = b.lop_id) as tlop,
      exists (select 1 from phan_cong_lop pc where pc.lop_id = b.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg' and pc.la_chinh) as ta_chinh
    from g left join buoi_hoc b
      on g.ref_id ~ '^vh:[0-9a-f-]{36}[|]' and b.id = substring(g.ref_id from 4 for 36)::uuid
  )
  select x.nguon, x.id, x.tt, x.ma, x.ten, x.so_gay, coalesce(td.tre_phut, x.tre_phut), x.ly_do, x.ref_id, x.nguoi, x.created_at, x.thu_hoi_at,
    case when x.bid is null then 'ngoai_task'
         when x.bloai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') then 'bo_tro'
         when x.tab in ('btvn', 'et') then x.tab
         else 'khac_' || x.tab end,
    x.bid, x.bngay, x.tlop,
    case when x.tt <> 'da_vao_so' then null
         when x.bid is null or x.bloai <> 'thuong' or x.tab not in ('btvn', 'et') or not x.ta_chinh then null
         when x.ma = 'cham_deadline' then 'tien_do' else 'chat_luong' end,
    case when x.tt = 'cho_chot' then 'Đề xuất chưa được xác nhận'
         when x.tt = 'da_thu_hoi' then 'Đã thu hồi'
         when x.bid is null then 'Không gắn buổi học nào'
         when x.bloai <> 'thuong' then 'Gậy của ca bổ trợ — bổ trợ chấm tay'
         when x.tab not in ('btvn', 'et') then 'Không thuộc Chấm BTVN / Chấm ET'
         when not x.ta_chinh then 'Không phải lớp TA chính của người này'
    end
  from x
  left join lateral public.fn_viec_tien_do(array[x.ref_id]) td on x.ma = 'cham_deadline'
  where (x.bid is not null and x.bngay between p_tu and p_den)
     or (x.bid is null and x.ky between date_trunc('month', p_tu)::date and p_den)
  order by coalesce(x.bngay, x.ky), x.created_at;
end $function$;

-- fn_hsta_thang: thân lấy từ bản ĐANG CHẠY (pg_get_functiondef 03/11), chỉ đổi dòng cổng quyền.
CREATE OR REPLACE FUNCTION public.fn_hsta_thang(p_ky date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, btvn_so_task integer, btvn_so_tinh integer, btvn_de_xuat numeric, btvn_so_co integer, et_so_task integer, et_so_tinh integer, et_de_xuat numeric, et_so_co integer, bt_so_ca integer, bt_gio_he_thong numeric, bt_gio_ghi_them numeric, bt_chi_tieu_gio numeric, bt_so_co integer, tong_de_xuat numeric, tong_du_3_dau_viec boolean, chot jsonb, so_ghi_them integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
declare
  v_tu  date := date_trunc('month', p_ky)::date;
  v_den date := (date_trunc('month', p_ky) + interval '1 month - 1 day')::date;
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
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
end $function$;

create or replace function public._phong_viec_ta(p_ns uuid)
 returns table(buoi_id uuid, ten_lop text, ngay date, tab text, han timestamptz, dong_dau timestamptz, trang_thai text, la_ton boolean)
 language sql stable security definer set search_path to 'public'
as $$
  with moc as (
    select date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date as tu
  ),
  v as (
    select x.*, public._viec_dong_dau(x.buoi_id, x.tab, x.dong_at) as dd, x.ngay < m.tu as ton
      from moc m, public.fn_viec_buoi_thuong(m.tu - 30, m.tu + 6, true) x
     where x.nhan_su_id = p_ns and x.vai = 'tg' and x.tab in ('btvn', 'et') and not (x.tab = 'et' and x.et_online)
  )
  select v.buoi_id, v.ten_lop, v.ngay, v.tab, v.han, v.dd,
         case when v.dd is null and (v.han is null or v.han >= now()) then 'dang_lam'
              when v.dd is null then 'qua_han'
              when v.han is not null and v.dd > v.han then 'xong_tre'
              else 'xong' end,
         v.ton
    from v
   where not v.ton or (v.dd is null and v.han < now())   -- buổi cũ chỉ lấy việc TỒN
$$;

create or replace function public.fn_phong_cap_duoi()
 returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[],
               hieu_suat numeric, hieu_suat_du boolean,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
#variable_conflict use_column
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_thang date := date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
begin
  return query
  with ds as (select * from public._phong_cap_duoi_ds()),
  hs as (select ds.nhan_su_id, h.tong_de_xuat, h.tong_du_3_dau_viec
           from ds cross join lateral public.fn_hsta_thang(v_hom_nay, ds.nhan_su_id) h),
  vi as (select ds.nhan_su_id,
                count(*) filter (where not w.la_ton)::int as tuan,
                count(*) filter (where w.trang_thai = 'dang_lam')::int as dl,
                count(*) filter (where w.trang_thai in ('xong', 'xong_tre'))::int as xg,
                count(*) filter (where w.trang_thai in ('xong_tre', 'qua_han'))::int as tr,
                count(*) filter (where w.trang_thai = 'qua_han')::int as qh
           from ds cross join lateral public._phong_viec_ta(ds.nhan_su_id) w
          group by ds.nhan_su_id),
  gy as (select g.nhan_su_id, g.con_lai::int as n
           from public.fn_gay_bang_khoang(v_thang, (v_thang + interval '1 month - 1 day')::date) g)
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         hs.tong_de_xuat, coalesce(hs.tong_du_3_dau_viec, false),
         coalesce(vi.tuan, 0), coalesce(vi.dl, 0), coalesce(vi.xg, 0), coalesce(vi.tr, 0), coalesce(vi.qh, 0), coalesce(gy.n, 0)
    from ds
    join nhan_su n on n.id = ds.nhan_su_id
    left join hs on hs.nhan_su_id = ds.nhan_su_id
    left join vi on vi.nhan_su_id = ds.nhan_su_id
    left join gy on gy.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten;
end $$;

create or replace function public.fn_phong_cap_duoi_chi_tiet(p_ns uuid)
 returns jsonb
 language plpgsql stable security definer set search_path to 'public'
as $$
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_thang date := date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
begin
  if not (public.co_chuc_nang('db_chatluong') or public._phong_la_cap_duoi(p_ns)) then
    raise exception 'Người này không phải cấp dưới của bạn';
  end if;
  return jsonb_build_object(
    'hieu_suat', (select to_jsonb(h) from public.fn_hsta_thang(v_hom_nay, p_ns) h limit 1),
    'viec', coalesce((select jsonb_agg(to_jsonb(w) order by w.ngay desc, w.tab) from public._phong_viec_ta(p_ns) w), '[]'::jsonb),
    'gay', coalesce((select jsonb_agg(jsonb_build_object('ten_loi', g.ten_loi, 'so_gay', g.so_gay, 'trang_thai', g.trang_thai,
                                                         'ten_lop', g.ten_lop, 'ngay', coalesce(g.ngay_task, (g.tao_at at time zone 'Asia/Ho_Chi_Minh')::date),
                                                         'ly_do', g.ly_do) order by g.tao_at desc)
                       from public.fn_hsta_gay(v_thang, (v_thang + interval '1 month - 1 day')::date, p_ns) g
                      where g.trang_thai <> 'da_thu_hoi'), '[]'::jsonb)
  );
end $$;

revoke execute on function public._phong_cap_duoi_ds() from public, anon;
revoke execute on function public._phong_la_cap_duoi(uuid) from public, anon;
revoke execute on function public._phong_viec_ta(uuid) from public, anon;
revoke execute on function public.fn_phong_cap_duoi() from public, anon;
revoke execute on function public.fn_phong_cap_duoi_chi_tiet(uuid) from public, anon;
grant execute on function public._phong_la_cap_duoi(uuid) to authenticated;
grant execute on function public.fn_phong_cap_duoi() to authenticated;
grant execute on function public.fn_phong_cap_duoi_chi_tiet(uuid) to authenticated;
