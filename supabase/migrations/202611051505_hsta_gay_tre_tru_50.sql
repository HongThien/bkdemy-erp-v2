-- ============================================================================
-- hsta_gay_tre_tru_50
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 (nối mig 202611051457) — gậy Chậm deadline "cũng trừ 50", bỏ thang −10/−20/−30/−40 theo giờ trễ.
--   Điểm task = 100 − (số gậy Chậm deadline + số gậy khác) × _hsta_tru_moi_gay() (= 50), sàn 0.
--   Thân fn_hsta_task chép từ DB live 05/11, CHỈ đổi dòng tính `td`. _hsta_tru_tien_do giữ nguyên (không còn ai gọi).
--
-- MẤT GÌ (Luật xoá): không có.
-- ============================================================================

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
    from public.fn_viec_buoi_thuong_lh(p_tu, p_den) v
    join nhan_su ns on ns.id = v.nhan_su_id
    where v.vai = 'tg' and v.tab in ('btvn', 'et') and not (v.tab = 'et' and v.et_online)
      and not ns.an_xep_hang
      -- CHỈ lớp được phân công TRỰC TIẾP (TA chính) — CEO 08/10; khớp cách Gậy chọn người chịu (la_chinh).
      -- Việc ĐÃ tới hạn: fn_viec_buoi_thuong_lh đã chọn đúng 1 TA (duy nhất / chính) LÚC HẠN — không xét lại theo
      -- phân công hiện tại (Thùy 04/11). Việc đóng sớm, chưa tới hạn: TA chính hiện tại như cũ.
      and (v.han <= now() or exists (select 1 from phan_cong_lop pc where pc.lop_id = v.lop_id and pc.nhan_su_id = v.nhan_su_id
                    and pc.vai_tro = 'tg' and pc.la_chinh))
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
      t.g_tre * public._hsta_tru_moi_gay() as td,   -- Thùy 05/11: mỗi gậy Chậm deadline −50 như gậy khác
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
end $function$
;
