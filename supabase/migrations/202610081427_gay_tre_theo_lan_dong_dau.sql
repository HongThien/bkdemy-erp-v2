-- ============================================================================
-- 202610081427 — gay_tre_theo_lan_dong_dau
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 08/10: "Sửa lại gậy theo logic vừa bảo" = trễ tính theo LẦN ĐÓNG ĐẦU TIÊN, không phải lần đóng cuối;
--   "phải có ghi chú lịch sử về việc đóng task để view".
--   Máy quét gậy (gay.ts quetGayTuDong) đo trễ ở JS bằng dong_at HIỆN TẠI (= lần đóng cuối, mở lại rồi đóng lại là đè)
--   và CHỤP tre_phut lúc quét (task chưa đóng ⇒ số phút đông cứng). Đo 08/10 trên 119 đề xuất vận hành đang chờ:
--   25 cái lần đóng đầu ĐÚNG HẠN (trễ chỉ do mở lại), 28 cái số phút lệch; 18 gậy đã chốt: 1 đúng hạn lần đầu, 11 lệch phút.
--   ⇒ (1) _viec_dong_dau: MỘT nguồn "lần đóng đầu" (phase log + giá trị cũ khi mở lại/đổi mốc; trước 23/09 chỉ còn dong_at).
--     (2) fn_viec_tien_do(ref_keys): hạn · đóng đầu · đóng cuối · số lần mở lại · phút trễ — tính ở Postgres, dùng cho máy
--         quét gậy, màn Gậy (ghi chú lịch sử đóng ngay trên dòng), màn hiệu suất.
--     (3) fn_gay_de_xuat_tinh_lai(): mỗi lần quét, đề xuất ĐANG CHỜ của task buổi học được đo lại theo lần đóng đầu —
--         đúng hạn ⇒ máy tự RÚT (bo_qua, lý do ghi rõ, nguoi_quyet NULL = máy); lệch phút ⇒ cập nhật. trg_log_gay_de_xuat
--         tự ghi vết mọi thay đổi. Gậy ĐÃ CHỐT (vào sổ) KHÔNG đụng — người chốt tự xem lại (màn hiệu suất có cờ).
--     (4) fn_hsta_task / fn_hsta_gay dùng cùng nguồn đó.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không xoá dòng nào.
--   Đề xuất 'cho' có lần đóng đầu đúng hạn chuyển sang 'bo_qua' (đổi trạng thái, có log, đổi lại được).
-- ============================================================================

-- ── (1) Lần đóng đầu — một nguồn ──
create or replace function _viec_dong_dau(p_buoi uuid, p_tab text, p_dong_at timestamptz) returns timestamptz
language sql stable as $$
  select least(p_dong_at,
    (select min(l.at) from buoi_hoc_phase_log l where l.buoi_hoc_id = p_buoi and l.phase = p_tab and l.su_kien = 'dong'),
    (select min(l.cu) from buoi_hoc_phase_log l where l.buoi_hoc_id = p_buoi and l.phase = p_tab and l.su_kien in ('mo_lai', 'doi_moc')))
$$;

-- ── (2) Tiến độ từng task buổi học (khoá vh:<buổi>|<tab>|<ns>) ──
create or replace function fn_viec_tien_do(p_ref_keys text[])
returns table (ref_key text, han timestamptz, dong_dau timestamptz, dong_cuoi timestamptz, so_mo_lai integer, tre_phut integer)
language sql stable as $$
  with k as (select distinct unnest(p_ref_keys) as rk),
  p as (select k.rk, substring(k.rk from 4 for 36)::uuid as bid, split_part(k.rk, '|', 2) as tab
        from k where k.rk ~ '^vh:[0-9a-f-]{36}[|]'),
  b as (select p.rk, p.bid, p.tab, bh.lop_id, bh.ngay, bh.gio_bat_dau,
          case p.tab when 'ingame' then bh.ingame_dong_at when 'et' then bh.et_dong_at when 'btvn' then bh.btvn_dong_at
                     when 'danhgia' then bh.danh_gia_xong_at when 'mt' then bh.mt_dong_at end as dc
        from p join buoi_hoc bh on bh.id = p.bid and bh.loai = 'thuong'),
  x as (select b.*, public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, b.tab) as h,
          public._viec_dong_dau(b.bid, b.tab, b.dc) as dd,
          (select count(*) from buoi_hoc_phase_log l where l.buoi_hoc_id = b.bid and l.phase = b.tab and l.su_kien = 'mo_lai')::int as ml
        from b)
  select x.rk, x.h, x.dd, x.dc, x.ml,
    case when x.h is null then null
         else greatest(0, ceil(extract(epoch from (coalesce(x.dd, now()) - x.h)) / 60))::int end
  from x
$$;

-- ── (3) Đo lại đề xuất đang chờ theo lần đóng đầu ──
create or replace function fn_gay_de_xuat_tinh_lai() returns jsonb
language plpgsql as $$
declare v_rut int; v_sua int;
begin
  update gay_de_xuat d set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null,
         ly_do_bo_qua = 'Máy tự rút (CEO 08/10): lần đóng đầu ĐÚNG HẠN — trễ chỉ do mở lại rồi đóng lại (đã mở lại '
                        || x.so_mo_lai || ' lần)'
  from public.fn_viec_tien_do(array(
         select c.ref_key from gay_de_xuat c
         where c.trang_thai = 'cho' and c.nguon = 'vanhanh' and c.ref_key ~ '^vh:[0-9a-f-]{36}[|]')) x
  where x.ref_key = d.ref_key and d.trang_thai = 'cho' and x.han is not null and x.dong_dau is not null and x.tre_phut = 0;
  get diagnostics v_rut = row_count;

  update gay_de_xuat d set tre_phut = x.tre_phut, deadline_at = x.han
  from public.fn_viec_tien_do(array(
         select c.ref_key from gay_de_xuat c
         where c.trang_thai = 'cho' and c.nguon = 'vanhanh' and c.ref_key ~ '^vh:[0-9a-f-]{36}[|]')) x
  where x.ref_key = d.ref_key and d.trang_thai = 'cho' and x.han is not null and x.tre_phut > 0
    and (d.tre_phut is distinct from x.tre_phut or d.deadline_at is distinct from x.han);
  get diagnostics v_sua = row_count;

  return jsonb_build_object('rut', v_rut, 'sua', v_sua);
end $$;

-- ── (4) Hiệu suất TA dùng cùng nguồn ──
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
end $$;

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
end $$;

revoke execute on function _viec_dong_dau(uuid, text, timestamptz), fn_viec_tien_do(text[]), fn_gay_de_xuat_tinh_lai() from public, anon;
grant execute on function _viec_dong_dau(uuid, text, timestamptz), fn_viec_tien_do(text[]), fn_gay_de_xuat_tinh_lai() to authenticated;
