-- ============================================================================
-- 202610081414 — hieu_suat_ta_theo_gay
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 08/10 (sau bản 202610081343):
--   ① Trợ giảng CHỈ tính lớp được phân công TRỰC TIẾP = TA chính (phan_cong_lop.la_chinh). Đo: 4 phân công
--     TA không chính (Hoàng Thị Quỳnh Trang ở 7B1 · 7B2, Nguyễn Mai Trang ở 9E1…) — bản trước tính cả.
--   ② Tiến độ VÀ chất lượng đều lấy từ HỆ GẬY, không tự đo lại: không có gậy = 100. Có gậy "Chậm deadline"
--     ⇒ trừ tiến độ theo số phút trễ gậy đã ghi (gay_de_xuat.tre_phut: ≤6h −10 · 6–12h −20 · 12–24h −30 · >24h −40);
--     gậy loại khác ⇒ −15 mỗi gậy. Giờ trễ tự đo vẫn hiện để tham khảo nhưng không vào điểm.
--   ③ fn_hsta_gay: liệt kê MỌI gậy của TA (đã vào sổ + đề xuất còn chờ) và gậy đó gắn task nào —
--     để đối chiếu 1-1 với màn Gậy, gậy không gắn task chấm nào vẫn hiện (không rơi mất).
--   ④ Buổi không có câu nhưng ĐÃ có gậy xác nhận ⇒ task có thật (người đã xác nhận) ⇒ vẫn tính. Đo: 3 gậy Trang chốt ở 12B1.
--   Giữ nguyên chữ ký fn_hsta_task (create or replace) — fn_hsta_thang / fn_hsta_chot dùng lại không đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không có.
-- ============================================================================

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
      -- CHỈ lớp được phân công TRỰC TIẾP (TA chính) — CEO 08/10; khớp cách Gậy chọn người chịu (la_chinh)
      and exists (select 1 from phan_cong_lop pc where pc.lop_id = v.lop_id and pc.nhan_su_id = v.nhan_su_id
                    and pc.vai_tro = 'tg' and pc.la_chinh)
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
      -- số phút trễ do hệ Gậy ghi lúc đề xuất (gay_de_xuat.tre_phut) — KHÔNG tự đo lại
      (select max(d.tre_phut) from gay_ledger g join gay_loi lo on lo.id = g.loi_id join gay_de_xuat d on d.ledger_id = g.id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and lo.ma = 'cham_deadline') as g_tre_phut,
      exists (select 1 from gay_ledger g join gay_loi lo on lo.id = g.loi_id left join gay_de_xuat d on d.ledger_id = g.id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and lo.ma = 'cham_deadline' and d.tre_phut is null) as g_tre_khong_ro,
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
      extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600 as tre,   -- chỉ để HIỂN THỊ tham khảo, không vào điểm
      -- TIẾN ĐỘ theo GẬY (CEO 08/10): có gậy Chậm deadline mới trừ, mức theo số phút gậy ghi; gậy không ghi phút ⇒ mức thấp nhất
      case when t.g_tre > 0 then greatest(public._hsta_tru_tien_do(t.g_tre_phut / 60.0), 10) else 0 end as td,
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
      case when s.g_tre > 0 and s.g_tre_khong_ro then 'gay_khong_ro_phut' end,
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
-- ĐỌC 4: mọi gậy của 1 TA trong tháng ↔ task nó gắn (đối chiếu với màn Gậy)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function fn_hsta_gay(p_tu date, p_den date, p_ns uuid)
returns table (
  nguon text, id uuid, trang_thai text, ma_loi text, ten_loi text, so_gay integer, tre_phut integer,
  ly_do text, ref_key text, nguoi text, tao_at timestamptz, thu_hoi_at timestamptz,
  gan_voi text, buoi_id uuid, ngay_task date, ten_lop text, tinh_vao text, ly_do_khong_tinh text
)
language plpgsql stable as $$
#variable_conflict use_column
begin
  if not public.co_chuc_nang('db_chatluong') then raise exception 'Không có quyền xem hiệu suất'; end if;
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
  select x.nguon, x.id, x.tt, x.ma, x.ten, x.so_gay, x.tre_phut, x.ly_do, x.ref_id, x.nguoi, x.created_at, x.thu_hoi_at,
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
  where (x.bid is not null and x.bngay between p_tu and p_den)
     or (x.bid is null and x.ky between date_trunc('month', p_tu)::date and p_den)
  order by coalesce(x.bngay, x.ky), x.created_at;
end $$;

revoke execute on function fn_hsta_gay(date, date, uuid) from public, anon;
grant execute on function fn_hsta_gay(date, date, uuid) to authenticated;
