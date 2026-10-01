-- ============================================================================
-- 202609290956 — troly_bao_cao_3_luong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09 (sau khi xem bản báo cáo theo ngày, mig 202609290201) chốt lại LOGIC báo cáo:
--     1. Có bao nhiêu việc đang CHẬM / đang MISS.
--     2. Nút "Detail" — bấm mới hiện từng việc: NGÀY nào, AI phụ trách.
--     3. Cảnh báo RỦI RO / BẤT THƯỜNG nếu có.
--   "Về cơ bản báo cáo sẽ cần có đủ 3 luồng này."
--
--   ⇒ Đổi đơn vị của báo cáo từ LỚP-trong-một-ngày sang VIỆC-có-người-phụ-trách. Bản trước
--     đếm "6/8 lớp có dữ liệu" nhưng không trả lời được "việc nào, của ai" — đọc xong vẫn phải
--     tự đi tìm người để nhắc. Mỗi việc có ngày riêng nên báo cáo gom việc còn treo của NHIỀU
--     ngày (cửa sổ mặc định 14 ngày), không bó trong một ngày.
--
--   NGƯỜI PHỤ TRÁCH + HẠN không định nghĩa lại ở đây: lấy từ `fn_viec_buoi_thuong` — cùng
--   nguồn với màn "Việc của tôi" và bảng hiệu suất/gậy. Báo cáo nói khác màn việc là hỏng.
--
--   PHÂN LOẠI một việc (thứ tự ưu tiên từ trên xuống):
--     miss      = việc hỏng về NỘI DUNG: buổi không có đề / không được gán bài · bấm đóng mà
--                 không có dòng dữ liệu nào · đã đóng nhưng còn em có mặt thiếu dữ liệu ·
--                 ca bổ trợ hoàn tất mà không test · ca bị huỷ vì học sinh không đến.
--     cham      = việc hỏng về THỜI GIAN: quá hạn mà chưa đóng.
--     xong_muon = đã đóng, đủ dữ liệu, nhưng đóng sau hạn. Đếm riêng, KHÔNG gộp vào "đang chậm"
--                 (việc đã xong thì không còn gì để nhắc; gộp vào là con số phồng lên vô ích).
--
--   "Không có đề" CHỈ tính là miss với lớp THẬT SỰ chạy khâu đó (≥60% buổi trong 60 ngày có
--   đề; lớp dưới 4 buổi coi như có chạy) — giữ nguyên luật đo CEO chốt 14/08 (SPEC-troly-nhansu
--   §2): thà sót còn hơn nêu tên người đang làm đúng. Luật này trước nằm ở client
--   (`troly-vanhanh.ts phanLoaiLopTheoKhau`), nay có bản ở DB.
--
--   Khâu "chấm bài trên lớp" KHÔNG xét "thiếu em": chấm trên lớp không bắt buộc chấm đủ cả lớp.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Chỉ thêm hàm. `fn_troly_bao_cao_ngay` (mig 202609290201) GIỮ NGUYÊN, không
--   drop — màn hình thôi không gọi nữa; muốn bỏ thì hỏi CEO rồi viết migration riêng.
-- ============================================================================

create or replace function public._troly_khoang(p interval) returns text
language sql immutable as $$
  select case when p < interval '1 hour' then greatest(1, (extract(epoch from p) / 60)::int) || ' phút'
              when p < interval '48 hours' then floor(extract(epoch from p) / 3600)::int || ' giờ'
              else floor(extract(epoch from p) / 86400)::int || ' ngày' end
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- LUỒNG 1+2 — VIỆC. Ba hàm cùng MỘT khuôn cột để gộp được bằng UNION ALL.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Việc sau buổi học thường: BTVN · ET · chấm bài trên lớp · đánh giá · MT ────
create or replace function public._troly_bc_viec_buoi(p_tu date, p_den date)
returns table(muc text, loai text, ngay date, doi_tuong text, viec text, phu_trach text,
              han timestamptz, xong_luc timestamptz, tinh_trang text)
language plpgsql stable as $$
#variable_conflict use_column
begin
  perform public._troly_gac();
  return query
  with moc as (select least(p_tu, p_den - 60) as tu_rong),
  b as (  -- cửa sổ RỘNG (60 ngày) để biết lớp nào thật sự chạy khâu nào
    select bh.id, bh.lop_id, bh.ngay, l.ten_lop
    from buoi_hoc bh join lop l on l.id = bh.lop_id, moc
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between moc.tu_rong and p_den
  ),
  tl as (
    select t.lop_id, t.ngay, bool_or(t.loai = 'et') as co_et, bool_or(t.loai = 'btvn') as co_btvn
    from tai_lieu t, moc
    where t.loai in ('et', 'btvn') and t.lop_id is not null and t.ngay between moc.tu_rong and p_den
    group by t.lop_id, t.ngay
  ),
  bt as (
    select x.lop_id, x.ngay, bool_or(x.loai = 'et') as co_et, bool_or(x.loai = 'btvn') as co_btvn
    from bai_test x, moc
    where x.loai in ('et', 'btvn') and x.ngay between moc.tu_rong and p_den
    group by x.lop_id, x.ngay
  ),
  gsp as (
    select sp.buoi_hoc_id, bool_or(sp.phase = 'et') as co_et, bool_or(sp.phase = 'btvn') as co_btvn,
           bool_or(sp.phase = 'ingame') as co_ingame
    from gami_session_problems sp where sp.buoi_hoc_id in (select id from b)
    group by sp.buoi_hoc_id
  ),
  de as (
    select b.id as buoi_id, b.lop_id, b.ngay, k.khau,
      case k.khau
        when 'et' then coalesce(tl.co_et, false) or coalesce(bt.co_et, false) or coalesce(gsp.co_et, false)
        when 'btvn' then coalesce(tl.co_btvn, false) or coalesce(bt.co_btvn, false) or coalesce(gsp.co_btvn, false)
        when 'ingame' then coalesce(gsp.co_ingame, false)
        else true end as co_de        -- đánh giá + MT: buổi đã sinh việc thì luôn phải làm
    from b cross join (values ('et'), ('btvn'), ('ingame'), ('danhgia'), ('mt')) k(khau)
    left join tl on tl.lop_id = b.lop_id and tl.ngay = b.ngay
    left join bt on bt.lop_id = b.lop_id and bt.ngay = b.ngay
    left join gsp on gsp.buoi_hoc_id = b.id
  ),
  chay as (
    select de.lop_id, de.khau, (count(*) < 4 or avg(de.co_de::int) >= 0.6) as chay
    from de where de.ngay >= p_den - 60 group by de.lop_id, de.khau
  ),
  v as (  -- việc + người phụ trách + hạn: NGUỒN DUY NHẤT là engine việc
    select f.buoi_id, f.tab, max(f.ten_lop) as ten_lop, max(f.ngay) as ngay,
           max(f.dong_at) as dong_at, max(f.han) as han,
           string_agg(distinct ns.ho_ten || case f.vai when 'gv' then ' (GV)' when 'tg' then ' (TA)'
                                                       when 'tk' then ' (trưởng khối)' else '' end, ', ') as phu_trach
    from public.fn_viec_buoi_thuong(p_tu, p_den, true) f
    join nhan_su ns on ns.id = f.nhan_su_id
    group by f.buoi_id, f.tab
  ),
  cm as (
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
    where h.buoi_hoc_id in (select buoi_id from v) and h.diem_danh = 'co_mat'
  ),
  co as (  -- (buổi, khâu, học sinh) ĐÃ có dữ liệu
    select sp.buoi_hoc_id, sp.phase as tab, g.hoc_sinh_id
      from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
     where sp.phase in ('et', 'ingame', 'mt') and sp.buoi_hoc_id in (select buoi_id from v)
    union
    select b.id, 'et', bl.hoc_sinh_id
      from b join bai_test x on x.loai = 'et' and x.lop_id = b.lop_id and x.ngay = b.ngay
      join bai_lam bl on bl.bai_test_id = x.id and bl.trang_thai = 'da_nop'
     where b.id in (select buoi_id from v)
    union
    select d.buoi_hoc_id, 'danhgia', d.hoc_sinh_id from buoi_danh_gia d where d.buoi_hoc_id in (select buoi_id from v)
    union
    select k.buoi_hoc_id, 'btvn', k.hoc_sinh_id from btvn_ket_qua k where k.buoi_hoc_id in (select buoi_id from v)
  ),
  thieu as (  -- em CÓ MẶT mà khâu đó chưa có dòng, hoặc dòng BTVN chưa tick đủ
    select cm.buoi_hoc_id, k.tab, cm.hoc_sinh_id
    from cm cross join (values ('et'), ('danhgia'), ('btvn'), ('mt')) k(tab)
    where not exists (select 1 from co where co.buoi_hoc_id = cm.buoi_hoc_id and co.tab = k.tab and co.hoc_sinh_id = cm.hoc_sinh_id)
    union
    select k.buoi_hoc_id, 'btvn', k.hoc_sinh_id from btvn_ket_qua k
    where k.buoi_hoc_id in (select buoi_id from v)
      and (k.trang_thai_nop is null or (k.thai_do is null and k.trang_thai_nop in ('nop_dung_han', 'nop_muon')))
  ),
  n as (select co.buoi_hoc_id, co.tab, count(*)::int as n from co group by co.buoi_hoc_id, co.tab),
  nt as (
    select t.buoi_hoc_id, t.tab, count(*)::int as n,
           left(string_agg(hs.ho_ten, ', ' order by hs.ho_ten), 240) as ten
    from thieu t join hoc_sinh hs on hs.id = t.hoc_sinh_id
    group by t.buoi_hoc_id, t.tab
  ),
  r as (
    select v.*, de.co_de, coalesce(ch.chay, true) as chay,
           coalesce(n.n, 0) as n_dl, coalesce(nt.n, 0) as n_thieu, nt.ten as ten_thieu,
      case
        when not de.co_de and coalesce(n.n, 0) = 0 then
             case when coalesce(ch.chay, true) and v.tab in ('et', 'btvn', 'ingame') then 'khong_co_de' end
        when v.dong_at is not null and coalesce(n.n, 0) = 0 then 'dong_ma_trong'
        when v.dong_at is not null and coalesce(nt.n, 0) > 0 and v.tab <> 'ingame' then 'thieu_hs'
        when v.dong_at is not null and v.han is not null and v.dong_at > v.han then 'xong_muon'
        when v.dong_at is null and v.han is not null and v.han < now() then 'cham'
      end as kq
    from v
    join de on de.buoi_id = v.buoi_id and de.khau = v.tab
    left join chay ch on ch.lop_id = de.lop_id and ch.khau = v.tab
    left join n on n.buoi_hoc_id = v.buoi_id and n.tab = v.tab
    left join nt on nt.buoi_hoc_id = v.buoi_id and nt.tab = v.tab
  )
  select
    case r.tab when 'ingame' then 'trong_buoi' when 'danhgia' then 'sau_buoi' else r.tab end,
    case r.kq when 'cham' then 'cham' when 'xong_muon' then 'xong_muon' else 'miss' end,
    r.ngay, r.ten_lop,
    case r.tab when 'et' then 'Chấm ET' when 'btvn' then 'Chấm BTVN' when 'ingame' then 'Chấm bài trên lớp'
               when 'danhgia' then 'Đánh giá sau buổi' else 'Chấm MT' end,
    r.phu_trach, r.han, r.dong_at,
    case r.kq
      when 'khong_co_de' then
        (case r.tab when 'et' then 'Buổi không có đề ET' when 'btvn' then 'Buổi không được gán BTVN'
                    else 'Buổi không có bài chấm trên lớp' end)
        || case when r.dong_at is not null then ' — task vẫn bị bấm đóng' else '' end
      when 'dong_ma_trong' then 'Đã bấm đóng nhưng không có dòng dữ liệu nào'
      when 'thieu_hs' then format('Đã đóng nhưng thiếu dữ liệu %s em: %s', r.n_thieu, r.ten_thieu)
        || case when r.han is not null and r.dong_at > r.han then format(' · đóng muộn %s', public._troly_khoang(r.dong_at - r.han)) else '' end
      when 'xong_muon' then format('Đóng muộn %s', public._troly_khoang(r.dong_at - r.han))
      else format('Quá hạn %s chưa đóng — %s', public._troly_khoang(now() - r.han),
                  case when r.n_dl > 0 then format('đã có dữ liệu %s em', r.n_dl) else 'chưa có dữ liệu' end)
    end
  from r where r.kq is not null;
end $$;

-- ── Việc bổ trợ BÙ ────────────────────────────────────────────────────────────
-- Luật 48h (CEO 12/08) chỉ áp cho lần nghỉ từ 10/08 — cùng mốc với `botro.ts`.
create or replace function public._troly_bc_viec_bu(p_tu date, p_den date)
returns table(muc text, loai text, ngay date, doi_tuong text, viec text, phu_trach text,
              han timestamptz, xong_luc timestamptz, tinh_trang text)
language plpgsql stable as $$
#variable_conflict use_column
declare v_nay date := public._troly_hom_nay();
begin
  perform public._troly_gac();
  return query
  with vang as (
    select b.ngay, l.ten_lop, hs.ho_ten,
      (exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                  and ((bb.trang_thai = 'hoan_tat' and x.diem_danh = 'co_mat') or bb.trang_thai = 'mo'))) as dang_co_buoi_bu,
      (exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id)) as tung_xep
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join lop l on l.id = b.lop_id
    join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
    where h.diem_danh in ('vang', 'vang_phep') and b.ngay between p_tu and p_den and b.ngay >= date '2026-08-10'
      and not exists (select 1 from bang_khong_bu kb where kb.buoi_hoc_hs_id = h.id)
  )
  select 'bo_tro_bu'::text, 'miss'::text, vang.ngay, vang.ho_ten || ' · ' || vang.ten_lop, 'Xếp bù lại'::text,
         'OPS (hệ chưa ghi ai xếp)'::text, null::timestamptz, null::timestamptz,
         format('Vắng %s — đã xếp bù nhưng trượt (vắng buổi bù hoặc buổi bù bị huỷ), chưa xếp lại', to_char(vang.ngay, 'DD/MM'))
  from vang where not vang.dang_co_buoi_bu and vang.tung_xep
  union all
  select 'bo_tro_bu', 'cham', vang.ngay, vang.ho_ten || ' · ' || vang.ten_lop, 'Xếp bù',
         'OPS (hệ chưa ghi ai xếp)',
         ((vang.ngay + 2)::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         format('Vắng %s, quá hạn xếp bù 48h — đã %s ngày chưa xếp', to_char(vang.ngay, 'DD/MM'), v_nay - vang.ngay)
  from vang where not vang.dang_co_buoi_bu and not vang.tung_xep and v_nay - vang.ngay > 2
  union all
  select 'bo_tro_bu', 'cham', b.ngay, hs.ho_ten, 'Đóng hồ sơ buổi bù',
         coalesce(nullif(concat_ws(', ', ns1.ho_ten, ns2.ho_ten), ''), 'chưa gán người dạy'),
         (b.ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         format('Buổi bù %s em đã học, hồ sơ còn khuyết: %s', to_char(b.ngay, 'DD/MM'),
                concat_ws(' · ', case when b.et_dong_at is null then 'ET' end, case when b.danh_gia_xong_at is null then 'đánh giá' end))
  from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id = b.id
  join hoc_sinh hs on hs.id = h.hoc_sinh_id
  left join nhan_su ns1 on ns1.id = b.nguoi_day left join nhan_su ns2 on ns2.id = b.nguoi_day_tg
  where b.loai = 'bu' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den and b.ngay < v_nay
    and h.diem_danh = 'co_mat' and (b.et_dong_at is null or b.danh_gia_xong_at is null);
end $$;

-- ── Việc bổ trợ YẾU: ca + retest ─────────────────────────────────────────────
create or replace function public._troly_bc_viec_yeu(p_tu date, p_den date)
returns table(muc text, loai text, ngay date, doi_tuong text, viec text, phu_trach text,
              han timestamptz, xong_luc timestamptz, tinh_trang text)
language plpgsql stable as $$
#variable_conflict use_column
declare v_nay date := public._troly_hom_nay();
begin
  perform public._troly_gac();
  return query
  select 'bo_tro_yeu'::text,
         case when c.ket_qua in ('khong_hop_le_khong_test', 'huy_hs_khong_den') then 'miss' else 'cham' end,
         c.ngay, c.ho_ten || coalesce(' · ' || c.ten_lop, ''),
         'Ca bổ trợ yếu ' || coalesce(to_char(c.gio, 'HH24:MI'), ''),
         coalesce(c.nguoi_day || ' (TA đứng ca)', 'chưa gán người đứng ca'),
         (c.ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         case c.ket_qua
           when 'khong_hop_le_khong_test' then 'Ca đã hoàn tất nhưng em KHÔNG làm test cuối ca — ca không hợp lệ'
           when 'huy_hs_khong_den' then 'Ca bị huỷ — học sinh không đến' || coalesce(' (' || left(c.ly_do_huy, 80) || ')', '')
           when 'co_mat_chua_dong_ca' then format('Em có mặt nhưng TA chưa đóng ca — đã %s ngày', v_nay - c.ngay)
           else format('Ca quá ngày không diễn ra mà chưa huỷ/xếp lại — đã %s ngày', v_nay - c.ngay) end
  from public._troly_bc_ca_yeu(p_tu, p_den) c
  where c.ket_qua in ('khong_hop_le_khong_test', 'huy_hs_khong_den')
     or (c.ket_qua in ('co_mat_chua_dong_ca', 'vang_chua_huy', 'qua_ngay_khong_dien_ra') and c.ngay < v_nay)
  union all
  select 'bo_tro_yeu', 'cham', x.ngay, hs.ho_ten || coalesce(' · ' || l.ten_lop, ''), 'Retest sau bổ trợ',
         coalesce((select ns.ho_ten || ' (TA lớp)' from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
                    where pc.lop_id = x.lop_id and pc.vai_tro = 'tg' order by pc.la_chinh desc nulls last limit 1),
                  'lớp chưa có TA'),
         (x.ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         format('Retest hẹn %s chưa làm — trễ %s ngày', to_char(x.ngay, 'DD/MM'), v_nay - x.ngay)
  from bai_test x join hoc_sinh hs on hs.id = x.hoc_sinh_id left join lop l on l.id = x.lop_id
  where x.loai = 'retest' and x.trang_thai = 'mo' and x.ngay between p_tu and p_den and x.ngay < v_nay
    and not exists (select 1 from bai_lam bl where bl.bai_test_id = x.id and bl.trang_thai = 'da_nop');
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- LUỒNG 3 — CẢNH BÁO rủi ro / bất thường. Trả { <mã mục>: [cảnh báo…] }.
-- Mỗi cảnh báo: { ma, muc_do (cao | vua | thieu_nguon), tieu_de, mo_ta, so, chi_tiet[{chinh, phu, noi_dung}] }.
-- Ngưỡng nằm NGAY trong từng khối; không có gì đáng nói thì KHÔNG sinh cảnh báo (đừng bới cho đủ).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public._troly_bc_canh_bao(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare
  g jsonb := public._troly_bc_gia_dinh();
  v_tl numeric := (public._troly_bc_gia_dinh()->>'ti_le_bao_dong')::numeric;
  v_ss int := (public._troly_bc_gia_dinh()->>'si_so_toi_thieu')::int;
  v_nay date := public._troly_hom_nay();
  cb jsonb := '{}'::jsonb; x jsonb; n int; n2 int; n3 int; d date; r record;
begin
  perform public._troly_gac();

  -- ── BTVN: không làm lặp lại ────────────────────────────────────────────────
  with k as (
    select kq.hoc_sinh_id, l.mon, l.ten_lop, b.ngay, kq.trang_thai_nop
    from btvn_ket_qua kq join buoi_hoc b on b.id = kq.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join lop l on l.id = b.lop_id
    where b.ngay between p_tu and p_den
  ),
  t as (
    select k.hoc_sinh_id, k.mon, max(k.ten_lop) as ten_lop, count(*)::int as so_bai,
           count(*) filter (where k.trang_thai_nop = 'khong_lam')::int as khong_lam,
           string_agg(to_char(k.ngay, 'DD/MM'), ', ' order by k.ngay) filter (where k.trang_thai_nop = 'khong_lam') as ngay_kl
    from k group by k.hoc_sinh_id, k.mon
  )
  select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', hs.ho_ten, 'phu', t.ten_lop,
           'noi_dung', format('không làm %s/%s bài (buổi giao %s)', t.khong_lam, t.so_bai, t.ngay_kl)
             || case when exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = t.hoc_sinh_id and y.mon = t.mon and y.trang_thai = 'dang_xu')
                     then ' · đang bổ trợ yếu' else '' end)
           order by t.khong_lam desc, hs.ho_ten), '[]'::jsonb)
    into n, x
  from t join hoc_sinh hs on hs.id = t.hoc_sinh_id where t.khong_lam >= 2;
  if n > 0 then
    cb := jsonb_set(cb, '{btvn}', coalesce(cb->'btvn', '[]'::jsonb) || jsonb_build_object(
      'ma', 'btvn_khong_lam', 'muc_do', 'cao', 'so', n,
      'tieu_de', format('%s học sinh không làm BTVN từ 2 lần trở lên', n),
      'mo_ta', 'Hệ chưa có chỗ ghi "đã tác động gì" (nhắc phụ huynh, gặp riêng…) nên chưa biết các em này đã được xử tới đâu.',
      'chi_tiet', x));
  end if;

  -- ── BTVN: thái độ lặp lại ──────────────────────────────────────────────────
  with t as (
    select kq.hoc_sinh_id, max(l.ten_lop) as ten_lop, count(*)::int as so_lan,
           count(*) filter (where kq.thai_do = 'chong_doi')::int as chong_doi
    from btvn_ket_qua kq join buoi_hoc b on b.id = kq.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join lop l on l.id = b.lop_id
    where b.ngay between p_tu and p_den and kq.thai_do in ('chua_nghiem_tuc', 'chong_doi')
    group by kq.hoc_sinh_id, l.mon
  )
  select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', hs.ho_ten, 'phu', t.ten_lop,
           'noi_dung', format('%s lần bị ghi thái độ chưa nghiêm túc/chống đối%s', t.so_lan,
                              case when t.chong_doi > 0 then format(' (chống đối %s lần)', t.chong_doi) else '' end))
           order by t.chong_doi desc, t.so_lan desc, hs.ho_ten), '[]'::jsonb)
    into n, x
  from t join hoc_sinh hs on hs.id = t.hoc_sinh_id where t.so_lan >= 2;
  if n > 0 then
    cb := jsonb_set(cb, '{btvn}', coalesce(cb->'btvn', '[]'::jsonb) || jsonb_build_object(
      'ma', 'btvn_thai_do', 'muc_do', 'vua', 'so', n,
      'tieu_de', format('%s học sinh có vấn đề thái độ làm BTVN lặp lại', n),
      'mo_ta', 'Bị ghi "chưa nghiêm túc" hoặc "chống đối" từ 2 lần trở lên trong khoảng báo cáo.',
      'chi_tiet', x));
  end if;

  -- ── BTVN + ET: điểm thấp hơn hẳn lớp, lặp lại (điểm % gọi fn_matrix_lop) ────
  begin
    for r in select * from (values ('btvn', 'BTVN'), ('et', 'ET')) t(pha, ten) loop
      with lop_cs as (
        select distinct b.lop_id, l.ten_lop from buoi_hoc b join lop l on l.id = b.lop_id
        where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den
      ),
      mx as (
        select lc.ten_lop, m.ngay, m.buoi_hoc_id, m.hoc_sinh_id, m.pct
        from lop_cs lc cross join lateral public._troly_matrix(lc.lop_id, r.pha, p_tu, p_den) m
        where m.status = 'done'
      ),
      tb as (select buoi_hoc_id, avg(pct) as tb, count(*) as si_so from mx group by buoi_hoc_id),
      thap as (
        select mx.hoc_sinh_id, mx.ten_lop, mx.ngay, mx.pct, round(tb.tb)::int as tb
        from mx join tb on tb.buoi_hoc_id = mx.buoi_hoc_id
        where tb.si_so >= v_ss and mx.pct < v_tl * tb.tb
      ),
      t as (
        select thap.hoc_sinh_id, max(thap.ten_lop) as ten_lop, count(*)::int as so_buoi,
               string_agg(format('%s: %s%% (lớp %s%%)', to_char(thap.ngay, 'DD/MM'), thap.pct, thap.tb), ' · ' order by thap.ngay) as ct
        from thap group by thap.hoc_sinh_id
      )
      select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', hs.ho_ten, 'phu', t.ten_lop,
               'noi_dung', format('%s buổi — %s', t.so_buoi, t.ct)) order by t.so_buoi desc, hs.ho_ten), '[]'::jsonb)
        into n, x
      from t join hoc_sinh hs on hs.id = t.hoc_sinh_id where t.so_buoi >= 2;
      if n > 0 then
        cb := jsonb_set(cb, array[r.pha], coalesce(cb->r.pha, '[]'::jsonb) || jsonb_build_object(
          'ma', r.pha || '_diem_thap', 'muc_do', 'cao', 'so', n,
          'tieu_de', format('%s học sinh có điểm %s thấp hơn hẳn lớp ở từ 2 buổi trở lên', n, r.ten),
          'mo_ta', format('Ngưỡng: điểm < %s%% × trung bình lớp của chính buổi đó (lớp có từ %s em có điểm). Chỉ xét buổi đã đóng khâu %s.',
                          round(v_tl * 100), v_ss, r.ten),
          'chi_tiet', x));
      end if;
    end loop;
  end;

  -- ── Đánh giá trong buổi: bấm đóng mà trống CÓ HỆ THỐNG ─────────────────────
  with b as (
    select bh.id, bh.ngay, l.ten_lop,
           exists (select 1 from gami_session_problems sp join gami_grades gg on gg.problem_id = sp.id
                    where sp.buoi_hoc_id = bh.id and sp.phase = 'ingame') as co_dl
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between p_tu and p_den
      and bh.ingame_dong_at is not null
  )
  select count(*)::int, count(*) filter (where not co_dl)::int into n, n2 from b;
  if n >= 5 and n2::numeric / n >= 0.3 then
    cb := jsonb_set(cb, '{trong_buoi}', coalesce(cb->'trong_buoi', '[]'::jsonb) || jsonb_build_object(
      'ma', 'ingame_dong_khong', 'muc_do', 'cao', 'so', n2,
      'tieu_de', format('%s/%s buổi bấm đóng "chấm bài trên lớp" mà không có dòng chấm nào (%s%%)', n2, n, round(n2 * 100.0 / n)),
      'mo_ta', 'Không phải vài lần sót mà là thói quen bấm cho xong: task tính là hoàn thành trong hiệu suất nhưng không sinh dữ liệu đo nào. Cần chốt: khâu này có bắt buộc không — nếu không thì bỏ task, nếu có thì chặn ở nút đóng.',
      'chi_tiet', '[]'::jsonb));
  end if;
  cb := jsonb_set(cb, '{trong_buoi}', coalesce(cb->'trong_buoi', '[]'::jsonb) || jsonb_build_object(
    'ma', 'ingame_thieu_toc_do', 'muc_do', 'thieu_nguon', 'so', 0,
    'tieu_de', 'Chưa có dữ liệu để báo "học sinh làm bài chậm hơn nhiều so với lớp"',
    'mo_ta', 'Hệ có ô tốc độ làm bài nhưng chưa ai từng chọn: 100% dòng chấm đang để mặc định "bình thường".',
    'chi_tiet', '[]'::jsonb));

  -- ── Đánh giá sau buổi: GV báo động ─────────────────────────────────────────
  with b as (
    select bh.id, bh.ngay, l.ten_lop from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between p_tu and p_den
  ),
  t as (
    select b.ten_lop, b.ngay, dg.hoc_sinh_id, 'mức ' || dg.muc_ma as ly_do, left(dg.nhan_xet, 160) as nx
    from buoi_danh_gia dg join b on b.id = dg.buoi_hoc_id
    where dg.muc is not null and dg.muc <= (g->>'muc_bao_dong')::int
    union all
    select b.ten_lop, b.ngay, c.hoc_sinh_id, 'GV bấm chuông', left(c.ghi_chu, 160)
    from canh_bao_yeu c join b on b.id = c.buoi_hoc_id where c.nguon = 'danhgia'
  ),
  gom as (
    select t.hoc_sinh_id, max(t.ten_lop) as ten_lop, count(distinct t.ngay)::int as so_buoi,
           string_agg(distinct to_char(t.ngay, 'DD/MM') || ' ' || t.ly_do, ' · ') as ct,
           (array_agg(t.nx order by t.ngay desc) filter (where t.nx is not null))[1] as nx
    from t group by t.hoc_sinh_id
  )
  select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', hs.ho_ten, 'phu', gom.ten_lop,
           'noi_dung', gom.ct || coalesce(' — "' || gom.nx || '"', '')) order by gom.so_buoi desc, hs.ho_ten), '[]'::jsonb)
    into n, x
  from gom join hoc_sinh hs on hs.id = gom.hoc_sinh_id;
  if n > 0 then
    cb := jsonb_set(cb, '{sau_buoi}', coalesce(cb->'sau_buoi', '[]'::jsonb) || jsonb_build_object(
      'ma', 'dg_bao_dong', 'muc_do', 'cao', 'so', n,
      'tieu_de', format('%s học sinh bị báo động qua đánh giá của giáo viên', n),
      'mo_ta', format('GV bấm chuông ở màn đánh giá, hoặc chấm mức ≤ %s.', g->>'muc_bao_dong'),
      'chi_tiet', x));
  end if;

  -- ── Đánh giá sau buổi: có dòng đánh giá mà không một nhận xét nào ───────────
  with t as (
    select l.ten_lop, bh.ngay, count(*)::int as so_dong
    from buoi_danh_gia dg join buoi_hoc bh on bh.id = dg.buoi_hoc_id and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
    join lop l on l.id = bh.lop_id
    where bh.ngay between p_tu and p_den
    group by l.ten_lop, bh.ngay, bh.id
    having count(*) filter (where nullif(btrim(dg.nhan_xet), '') is not null) = 0
  )
  select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', t.ten_lop, 'phu', to_char(t.ngay, 'DD/MM'),
           'noi_dung', format('%s em được chấm mức nhưng không em nào có nhận xét', t.so_dong)) order by t.ngay desc, t.ten_lop), '[]'::jsonb)
    into n, x from t;
  if n >= 3 then
    cb := jsonb_set(cb, '{sau_buoi}', coalesce(cb->'sau_buoi', '[]'::jsonb) || jsonb_build_object(
      'ma', 'dg_khong_nhan_xet', 'muc_do', 'vua', 'so', n,
      'tieu_de', format('%s buổi có đánh giá nhưng không có một dòng nhận xét nào', n),
      'mo_ta', 'Chỉ chọn mức rồi đóng. Phụ huynh và người bổ trợ không có gì để đọc.',
      'chi_tiet', x));
  end if;

  -- ── Buổi của lớp KHÔNG có người phụ trách: việc của buổi đó vô hình với mọi màn ──
  with t as (
    select l.ten_lop, count(*)::int as so_buoi,
           array_remove(array[
             case when not exists (select 1 from phan_cong_lop pc where pc.lop_id = l.id and pc.vai_tro = 'gv') then 'GV' end,
             case when not exists (select 1 from phan_cong_lop pc where pc.lop_id = l.id and pc.vai_tro = 'tg') then 'TA' end], null) as thieu
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between p_tu and p_den
    group by l.id, l.ten_lop
  )
  select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', t.ten_lop, 'phu', format('%s buổi', t.so_buoi),
           'noi_dung', 'chưa phân công ' || array_to_string(t.thieu, ' + ')) order by t.so_buoi desc, t.ten_lop), '[]'::jsonb)
    into n, x from t where cardinality(t.thieu) > 0;
  if n > 0 then
    cb := jsonb_set(cb, '{chung}', coalesce(cb->'chung', '[]'::jsonb) || jsonb_build_object(
      'ma', 'khong_phan_cong', 'muc_do', 'cao', 'so', n,
      'tieu_de', format('%s lớp có buổi học nhưng chưa phân công đủ người phụ trách', n),
      'mo_ta', 'Việc sau buổi sinh theo phân công lớp. Lớp thiếu GV thì không ai có việc đánh giá; thiếu TA thì không ai có việc chấm ET/BTVN — các buổi đó KHÔNG hiện trong báo cáo này lẫn màn Việc của tôi.',
      'chi_tiet', x));
  end if;

  -- ── Bổ trợ bù: tồn chưa xếp ────────────────────────────────────────────────
  select count(*)::int, min(b.ngay) into n, d
  from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
  join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
  where h.diem_danh in ('vang', 'vang_phep') and b.ngay >= date '2026-08-10' and b.ngay < p_tu
    and not exists (select 1 from bang_khong_bu kb where kb.buoi_hoc_hs_id = h.id)
    and not exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id);
  if n > 0 then
    cb := jsonb_set(cb, '{bo_tro_bu}', coalesce(cb->'bo_tro_bu', '[]'::jsonb) || jsonb_build_object(
      'ma', 'bu_ton_cu', 'muc_do', 'vua', 'so', n,
      'tieu_de', format('Còn %s lượt vắng CŨ HƠN khoảng báo cáo chưa từng được xếp bù', n),
      'mo_ta', format('Cũ nhất từ %s. Nằm ngoài khoảng báo cáo nên không có trong danh sách việc ở trên — không ai đụng thì nó nằm im mãi. Cần chốt: xử dần, hay ghi "không bù" hàng loạt.', to_char(d, 'DD/MM')),
      'chi_tiet', '[]'::jsonb));
  end if;

  -- ── Bổ trợ yếu: tỉ lệ ca hợp lệ ────────────────────────────────────────────
  select count(*) filter (where c.ngay < v_nay)::int, count(*) filter (where c.ket_qua = 'hop_le')::int,
         count(*) filter (where c.ket_qua = 'huy_hs_khong_den')::int
    into n, n2, n3
  from public._troly_bc_ca_yeu(p_tu, p_den) c where c.ket_qua <> 'huy_khac';
  if n >= 5 and n2::numeric / n < 0.5 then
    cb := jsonb_set(cb, '{bo_tro_yeu}', coalesce(cb->'bo_tro_yeu', '[]'::jsonb) || jsonb_build_object(
      'ma', 'yeu_ti_le_hop_le', 'muc_do', 'cao', 'so', n - n2,
      'tieu_de', format('Chỉ %s/%s lượt bổ trợ yếu đã xếp là hợp lệ (%s%%)', n2, n, round(n2 * 100.0 / n)),
      'mo_ta', format('%s lượt huỷ vì học sinh không đến. Công xếp lịch + báo phụ huynh đang mất phần lớn ở khâu học sinh có đến hay không.', n3),
      'chi_tiet', '[]'::jsonb));
  end if;

  -- ── Bổ trợ yếu: case cần xếp tồn ───────────────────────────────────────────
  with t as (
    select e->>'ho_ten' as ho_ten, e->>'lop' as lop, e->>'mon' as mon,
           v_nay - ((e->>'created_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date as so_ngay,
           (e->>'uu_tien')::int as uu_tien
    from jsonb_array_elements(public.fn_btyeu_trang_thai_ca(1)) e where e->>'buoc' = 'can_xep'
  )
  select count(*)::int, max(t.so_ngay)::int, (select coalesce(jsonb_agg(jsonb_build_object('chinh', y.ho_ten, 'phu', y.lop,
           'noi_dung', format('mở case %s ngày, chưa có buổi nào chờ học%s', y.so_ngay, case when y.uu_tien = 3 then ' · ƯU TIÊN CAO' else '' end))), '[]'::jsonb)
           from (select * from t order by t.uu_tien desc, t.so_ngay desc limit 30) y)
    into n, n2, x from t;
  if n > 0 then
    cb := jsonb_set(cb, '{bo_tro_yeu}', coalesce(cb->'bo_tro_yeu', '[]'::jsonb) || jsonb_build_object(
      'ma', 'yeu_can_xep', 'muc_do', case when n2 > 7 then 'cao' else 'vua' end, 'so', n,
      'tieu_de', format('%s case bổ trợ yếu đang chờ xếp lịch, lâu nhất %s ngày', n, n2),
      'mo_ta', 'Hệ chưa có hạn cho việc xếp lịch nên các case này không tính là "chậm" — nêu ở đây để không bị quên. Danh sách: ưu tiên cao trước, mở lâu trước (tối đa 30).',
      'chi_tiet', x));
  end if;

  -- ── Bổ trợ yếu: ngày duyệt nhiều mà không chốt ca nào ───────────────────────
  with t as (
    select (lg.created_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay, count(*)::int as so_luot,
           count(*) filter (where lg.level_chot >= 1)::int as chot,
           count(*) filter (where lg.level_may_de_xuat >= 1)::int as may_dx
    from hs_level_log lg where lg.loai = 'kien_thuc'
      and (lg.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
    group by 1
  )
  select count(*)::int, coalesce(jsonb_agg(jsonb_build_object('chinh', to_char(t.ngay, 'DD/MM'), 'phu', public._troly_thu(t.ngay),
           'noi_dung', format('%s lượt duyệt, máy đề xuất bổ trợ %s, chốt bổ trợ %s', t.so_luot, t.may_dx, t.chot)) order by t.ngay desc), '[]'::jsonb)
    into n, x from t where t.so_luot >= 10 and t.chot = 0;
  if n > 0 then
    cb := jsonb_set(cb, '{bo_tro_yeu}', coalesce(cb->'bo_tro_yeu', '[]'::jsonb) || jsonb_build_object(
      'ma', 'yeu_duyet_khong_chot', 'muc_do', 'vua', 'so', n,
      'tieu_de', format('%s ngày duyệt từ 10 lượt trở lên mà không chốt bổ trợ cho em nào', n),
      'mo_ta', 'Có thể đúng (các em thật sự không cần), cũng có thể là duyệt hàng loạt cho sạch hàng đợi. Đáng xem lại một lần.',
      'chi_tiet', x));
  end if;
  cb := jsonb_set(cb, '{bo_tro_yeu}', coalesce(cb->'bo_tro_yeu', '[]'::jsonb) || jsonb_build_object(
    'ma', 'yeu_thieu_hang_doi', 'muc_do', 'thieu_nguon', 'so', 0,
    'tieu_de', 'Chưa đếm được danh sách học sinh đang CHỜ duyệt bổ trợ',
    'mo_ta', 'Phần phát hiện (4 kênh) còn tính ở phía màn hình, chưa có ở Postgres. Xem tại Bổ trợ › Yếu › Duyệt.',
    'chi_tiet', '[]'::jsonb));

  return cb;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- CỬA CHÍNH
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.fn_troly_bao_cao(p_den date default null, p_so_ngay integer default 14) returns jsonb
language plpgsql stable as $$
declare
  v_nay date := public._troly_hom_nay();
  v_den date := least(coalesce(p_den, public._troly_hom_nay()), public._troly_hom_nay());
  v_n int := least(greatest(coalesce(p_so_ngay, 14), 1), 60);
  v_tu date; v_cb jsonb; v jsonb;
  c_tran constant int := 200;
begin
  perform public._troly_gac();
  v_tu := v_den - (v_n - 1);
  v_cb := public._troly_bc_canh_bao(v_tu, v_den);

  with t as (
    select * from public._troly_bc_viec_buoi(v_tu, v_den)
    union all select * from public._troly_bc_viec_bu(v_tu, v_den)
    union all select * from public._troly_bc_viec_yeu(v_tu, v_den)
  ),
  m(ma, ten, thu_tu) as (values
    ('btvn', 'BTVN', 1), ('et', 'ET', 2), ('trong_buoi', 'Đánh giá trong buổi học', 3),
    ('sau_buoi', 'Đánh giá sau buổi học', 4), ('mt', 'MT', 5),
    ('bo_tro_bu', 'Bổ trợ bù', 6), ('bo_tro_yeu', 'Bổ trợ yếu', 7)),
  mm as (
    select m.*,
      (select count(*) from t where t.muc = m.ma and t.loai = 'cham')::int as cham,
      (select count(*) from t where t.muc = m.ma and t.loai = 'miss')::int as miss,
      (select count(*) from t where t.muc = m.ma and t.loai = 'xong_muon')::int as xong_muon,
      coalesce(v_cb->m.ma, '[]'::jsonb) as canh_bao
    from m
  )
  select jsonb_build_object(
    'tu', v_tu, 'den', v_den, 'so_ngay', v_n,
    'tao_luc', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
    'tong', jsonb_build_object(
      'cham', (select count(*) from t where loai = 'cham'),
      'miss', (select count(*) from t where loai = 'miss'),
      'xong_muon', (select count(*) from t where loai = 'xong_muon'),
      'canh_bao', (select count(*) from jsonb_each(v_cb) e, jsonb_array_elements(e.value) c where c->>'muc_do' <> 'thieu_nguon')),
    'muc', (select jsonb_agg(jsonb_build_object(
        'ma', mm.ma, 'ten', mm.ten, 'cham', mm.cham, 'miss', mm.miss, 'xong_muon', mm.xong_muon,
        'canh_bao', mm.canh_bao,
        'da_cat', mm.cham + mm.miss + mm.xong_muon > c_tran,
        'viec', (select coalesce(jsonb_agg(jsonb_build_object(
                     'loai', y.loai, 'ngay', y.ngay, 'doi_tuong', y.doi_tuong, 'viec', y.viec, 'phu_trach', y.phu_trach,
                     'han', to_char(y.han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
                     'xong_luc', to_char(y.xong_luc at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
                     'tinh_trang', y.tinh_trang)), '[]'::jsonb)
                 from (select * from t where t.muc = mm.ma
                       order by array_position(array['cham', 'miss', 'xong_muon'], t.loai), t.ngay, t.doi_tuong
                       limit c_tran) y)
      ) order by mm.thu_tu)
      from mm
      -- MT chỉ hiện khi khoảng báo cáo có việc MT (đa số tuần không có)
      where mm.ma <> 'mt' or mm.cham + mm.miss + mm.xong_muon > 0),
    'canh_bao_chung', coalesce(v_cb->'chung', '[]'::jsonb),
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.cham + g.miss desc, g.phu_trach), '[]'::jsonb) from (
        -- gom theo NGƯỜI, bỏ nhãn vai "(GV)/(TA)/(TA đứng ca)…": một người hai vai vẫn là một người
        select regexp_replace(p.nguoi, '\s*\(.*\)$', '') as phu_trach,
               count(*) filter (where t.loai = 'cham')::int as cham,
               count(*) filter (where t.loai = 'miss')::int as miss,
               count(*) filter (where t.loai = 'xong_muon')::int as xong_muon
        from t cross join lateral regexp_split_to_table(t.phu_trach, ', ') p(nguoi)
        group by 1) g
      where g.cham + g.miss > 0),
    'cach_hieu', jsonb_build_array(
      'CHẬM = quá hạn mà chưa đóng. MISS = hỏng về nội dung: buổi không có đề / không gán bài, bấm đóng mà trống dữ liệu, đã đóng nhưng còn em có mặt thiếu dữ liệu, ca bổ trợ không test hoặc học sinh không đến.',
      '"Đóng muộn" (đã xong, đủ dữ liệu, nhưng sau hạn) đếm riêng, không tính vào đang chậm.',
      'Người phụ trách + hạn lấy từ phân công lớp, cùng nguồn với màn Việc của tôi. Hạn: ET / chấm bài trên lớp / đánh giá = giờ vào ca + 36 giờ · BTVN = giờ vào ca kế − 2 giờ · MT = + 72 giờ.',
      '"Không có đề" chỉ tính miss với lớp thật sự chạy khâu đó (từ 60% buổi trong 60 ngày có đề).',
      'Xếp bù và xếp lịch bổ trợ yếu: hệ chưa ghi ai là người xếp nên cột phụ trách ghi chung là OPS.')
  ) into v;
  return v;
end $$;

do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('_troly_khoang', '_troly_bc_viec_buoi', '_troly_bc_viec_bu', '_troly_bc_viec_yeu',
                        '_troly_bc_canh_bao', 'fn_troly_bao_cao')
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
end $$;

comment on function public.fn_troly_bao_cao(date, integer) is
  'Báo cáo trợ lý 3 luồng (CEO 29/09): ① đếm việc chậm/miss theo mục ② từng việc kèm ngày + người phụ trách ③ cảnh báo rủi ro/bất thường. Tất định, không qua model. Chỉ nhóm troly_duoc_dung().';
