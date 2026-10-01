-- ============================================================================
-- 202609291215 — troly_tong_ket_tuan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09 thêm tính năng thứ hai của trợ lý: TỔNG KẾT TUẦN — "làm cái dashboard… các
--   thông số toàn cảnh của trung tâm để t nhìn được":
--     · BTVN · ET · đánh giá sau buổi: tỉ lệ hoàn thành ĐÚNG CHUẨN, tỉ lệ CHẬM, tỉ lệ THIẾU;
--       Detail = xếp hạng giáo viên – TA theo nghiệp vụ tương ứng ("ko tính Thùy và Trang Phạm").
--     · Bổ trợ: số ca CẦN bổ trợ · số ĐÃ LÊN LỊCH + tỉ lệ · số ĐÃ BỔ TRỢ + tỉ lệ · số ca có SỰ
--       CỐ (huỷ, chuyển lịch…) + tỉ lệ.
--     · Thời gian trung bình mỗi giai đoạn: duyệt → xếp lịch, xếp lịch → diễn ra.
--
--   Báo cáo Sư phạm trả lời "việc nào đang hỏng, của ai" (để đi nhắc). Tổng kết tuần trả lời
--   "cả hệ chạy tốt tới đâu" (để nhìn xu hướng) ⇒ cần cả việc ĐÚNG CHUẨN làm mẫu số, thứ mà
--   báo cáo Sư phạm không trả.
--
--   ⭐ MỘT NGUỒN PHÂN LOẠI. Luật "việc này đúng chuẩn / chậm / thiếu" trước nằm trong
--   `_troly_bc_viec_buoi`. Viết thêm bản thứ hai cho tổng kết tuần = hai công thức rồi lệch
--   nhau (CLAUDE.md §2.0) ⇒ tách ra hàm GỐC `_troly_viec_buoi_goc` trả MỌI việc kèm nhãn;
--   `_troly_bc_viec_buoi` thành lớp mỏng lọc từ hàm gốc. Tương tự `_troly_ca_yeu_goc` cho ca
--   bổ trợ yếu. Thân hai hàm gốc lấy từ bản ĐANG CHẠY (`pg_get_functiondef`), không lấy từ
--   file migration cũ. Đã so JSON báo cáo Sư phạm trước/sau khi tách: không đổi.
--
--   ĐỊNH NGHĨA (mẫu số = việc ĐÃ TỚI HẠN hoặc đã đóng; việc còn trong hạn để riêng):
--     đúng chuẩn = đã đóng, đúng hạn, đủ dữ liệu
--     chậm       = đóng sau hạn (đủ dữ liệu)  +  quá hạn mà chưa đóng
--     thiếu      = buổi không có đề/không gán bài · bấm đóng mà trống · đóng mà thiếu dữ liệu em
--
--   "Ca CẦN bổ trợ" của một tuần = case bổ trợ yếu còn ít nhất một dạng phải dạy trong tuần
--   đó (dạng có từ trước cuối tuần, chưa dạy hoặc dạy trong/sau tuần, chưa đóng trước tuần).
--   Dùng mốc thời gian của từng dạng nên tính lại được cho tuần CŨ, không phụ thuộc trạng
--   thái hôm nay.
--
--   ⚠ "CHUYỂN LỊCH" chưa đo được chính xác: hệ không ghi vết đổi ngày/giờ của buổi bổ trợ.
--   Thứ gần nhất là buổi bị huỷ với lý do "OPS gỡ ở Lịch phòng" — báo cáo gọi đúng tên đó.
--
--   Người bị loại khỏi XẾP HẠNG (không loại khỏi tổng số việc của trung tâm) khai ở MỘT chỗ:
--   `_troly_bc_gia_dinh().xep_hang_bo_qua`, bằng mã nhân sự.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Thêm hàm mới; thay THÂN 3 hàm đang có (`_troly_bc_gia_dinh` thêm 1 khoá,
--   `_troly_bc_viec_buoi` và `_troly_bc_ca_yeu` thành lớp mỏng, kiểu trả về giữ nguyên).
--   Bảng `troly_bao_cao_luu` dùng lại, thêm dòng với bo = 'tuan'.
-- ============================================================================

create or replace function public._troly_bc_gia_dinh() returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'ti_le_bao_dong', 0.8,      -- điểm < 80% TB lớp
    'si_so_toi_thieu', 3,       -- lớp dưới 3 em có điểm thì không so với TB
    'muc_bao_dong', 2,          -- mức đánh giá ≤ 2
    'ngay_nhin_lai', 30,
    'ingame_bat_buoc_tu', '2026-10-01',   -- CEO 29/09: chấm bài trên lớp bắt buộc từ tháng 10
    'btvn_ti_le_nop_toi_thieu', 0.7,      -- CEO chốt 29/09: lớp có tỉ lệ nộp đạt chuẩn dưới 70% = "tệ"
    'xep_hang_bo_qua', jsonb_build_array('NS001', 'NS002'))  -- CEO 29/09: xếp hạng GV–TA "ko tính Thùy và Trang Phạm"
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- HÀM GỐC 1 — MỌI việc sau buổi học thường, mỗi (buổi × khâu) một dòng, kèm nhãn `kq`:
--   dung_chuan · xong_muon · cham · khong_co_de · dong_ma_trong · thieu_hs · con_han · bo_qua
--   (bo_qua = buổi không có đề ở lớp vốn KHÔNG chạy khâu đó — không phải việc của ai)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public._troly_viec_buoi_goc(p_tu date, p_den date)
returns table(buoi_id uuid, tab text, ten_lop text, ngay date, dong_at timestamptz, han timestamptz,
              phu_trach text, nguoi_ids uuid[], n_dl integer, n_thieu integer, ten_thieu text, kq text)
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
                                                       when 'tk' then ' (trưởng khối)' else '' end, ', ') as phu_trach,
           array_agg(distinct f.nhan_su_id) as nguoi_ids
    from public.fn_viec_buoi_thuong(p_tu, p_den, true) f
    join nhan_su ns on ns.id = f.nhan_su_id
    -- CEO 29/09: chấm bài trên lớp chỉ BẮT BUỘC từ tháng 10 ⇒ buổi trước mốc không sinh việc
    where f.tab <> 'ingame' or f.ngay >= (public._troly_bc_gia_dinh()->>'ingame_bat_buoc_tu')::date
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
  )
  select v.buoi_id, v.tab, v.ten_lop, v.ngay, v.dong_at, v.han, v.phu_trach, v.nguoi_ids,
         coalesce(n.n, 0), coalesce(nt.n, 0), nt.ten,
    case
      when not de.co_de and coalesce(n.n, 0) = 0 then
           case when coalesce(ch.chay, true) and v.tab in ('et', 'btvn', 'ingame') then 'khong_co_de' else 'bo_qua' end
      when v.dong_at is not null and coalesce(n.n, 0) = 0 then 'dong_ma_trong'
      when v.dong_at is not null and coalesce(nt.n, 0) > 0 and v.tab <> 'ingame' then 'thieu_hs'
      when v.dong_at is not null and v.han is not null and v.dong_at > v.han then 'xong_muon'
      when v.dong_at is null and v.han is not null and v.han < now() then 'cham'
      when v.dong_at is not null then 'dung_chuan'
      else 'con_han'
    end
  from v
  join de on de.buoi_id = v.buoi_id and de.khau = v.tab
  left join chay ch on ch.lop_id = de.lop_id and ch.khau = v.tab
  left join n on n.buoi_hoc_id = v.buoi_id and n.tab = v.tab
  left join nt on nt.buoi_hoc_id = v.buoi_id and nt.tab = v.tab;
end $$;

-- Lớp mỏng cho BÁO CÁO SƯ PHẠM: chỉ việc có vấn đề, kèm câu tình trạng. Kiểu trả về giữ nguyên.
create or replace function public._troly_bc_viec_buoi(p_tu date, p_den date)
returns table(muc text, loai text, ngay date, doi_tuong text, viec text, phu_trach text,
              han timestamptz, xong_luc timestamptz, tinh_trang text)
language plpgsql stable as $$
#variable_conflict use_column
begin
  perform public._troly_gac();
  return query
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
  from public._troly_viec_buoi_goc(p_tu, p_den) r
  where r.kq in ('khong_co_de', 'dong_ma_trong', 'thieu_hs', 'xong_muon', 'cham');
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- HÀM GỐC 2 — mọi LƯỢT ca bổ trợ yếu (1 dòng = 1 học sinh × 1 buổi), kèm mã case + lúc xếp.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public._troly_ca_yeu_goc(p_tu date, p_den date)
returns table(case_id uuid, case_mo_luc timestamptz, xep_luc timestamptz,
              ngay date, gio time, mon text, nguoi_day text, ho_ten text, ten_lop text,
              ket_qua text, ly_do_huy text, khoa_ca text)
language sql stable as $$
  select y.id, y.created_at, hh.created_at,
    b.ngay, b.gio_bat_dau, y.mon, ns.ho_ten, hs.ho_ten,
    (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
      where hl.hoc_sinh_id = hs.id and l.mon = y.mon and hl.trang_thai = 'dang_hoc' limit 1),
    case
      when b.trang_thai = 'huy' and (b.ly_do_huy ilike '%vắng%' or b.ly_do_huy ilike 'Không diễn ra%') then 'huy_hs_khong_den'
      when b.trang_thai = 'huy' then 'huy_khac'
      when b.danh_gia_xong_at is not null and exists (
             select 1 from bai_test t join bai_lam bl on bl.bai_test_id = t.id
              where t.buoi_hoc_id = b.id and t.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop') then 'hop_le'
      when b.danh_gia_xong_at is not null then 'khong_hop_le_khong_test'
      when hh.diem_danh = 'co_mat' then 'co_mat_chua_dong_ca'
      when hh.diem_danh in ('vang', 'vang_phep') then 'vang_chua_huy'
      when b.ngay < public._troly_hom_nay() then 'qua_ngay_khong_dien_ra'
      else 'cho_hoc' end,
    b.ly_do_huy,
    b.ngay::text || '|' || coalesce(b.gio_bat_dau::text, '') || '|' || y.mon || '|' || coalesce(b.nguoi_day_tg::text, '')
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  join hoc_sinh hs on hs.id = hh.hoc_sinh_id
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  where b.loai = 'bo_tro_yeu' and b.ngay between p_tu and p_den
    and public.troly_duoc_dung()   -- hàm sql không raise được: ngoài nhóm thì ra 0 dòng
$$;

create or replace function public._troly_bc_ca_yeu(p_tu date, p_den date)
returns table(ngay date, gio time, mon text, nguoi_day text, ho_ten text, ten_lop text, ket_qua text, ly_do_huy text, khoa_ca text)
language sql stable as $$
  select g.ngay, g.gio, g.mon, g.nguoi_day, g.ho_ten, g.ten_lop, g.ket_qua, g.ly_do_huy, g.khoa_ca
  from public._troly_ca_yeu_goc(p_tu, p_den) g
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- CÁC CON SỐ của MỘT tuần (gọi 2 lần: tuần xem + tuần liền trước để có chênh lệch).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public._troly_tuan_so(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  with g as (select * from public._troly_viec_buoi_goc(p_tu, p_den) where kq <> 'bo_qua'),
  k(ma, ten, thu_tu) as (values
    ('btvn', 'BTVN', 1), ('et', 'ET', 2), ('danhgia', 'Đánh giá sau buổi', 3),
    ('ingame', 'Đánh giá trong buổi (chấm bài trên lớp)', 4), ('mt', 'MT', 5)),
  kk as (
    select k.ma, k.ten, k.thu_tu,
      count(g.buoi_id)::int as tong,
      count(*) filter (where g.kq = 'con_han')::int as con_han,
      count(*) filter (where g.kq = 'dung_chuan')::int as dung_chuan,
      count(*) filter (where g.kq = 'xong_muon')::int as dong_muon,
      count(*) filter (where g.kq = 'cham')::int as qua_han_chua_dong,
      count(*) filter (where g.kq = 'khong_co_de')::int as khong_co_de,
      count(*) filter (where g.kq = 'dong_ma_trong')::int as dong_ma_trong,
      count(*) filter (where g.kq = 'thieu_hs')::int as thieu_hs
    from k left join g on g.tab = k.ma
    group by k.ma, k.ten, k.thu_tu
  ),
  bh as (
    select b.id, b.lop_id from buoi_hoc b
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den
  ),
  dd as (
    select h.diem_danh from buoi_hoc_hs h where h.buoi_hoc_id in (select id from bh)
  ),
  ca as (select * from public._troly_ca_yeu_goc(p_tu, p_den)),
  can as (  -- case CẦN bổ trợ trong tuần: còn dạng phải dạy trong khoảng tuần đó
    select distinct y.id
    from bo_tro_yeu y join bo_tro_yeu_dang d on d.bo_tro_yeu_id = y.id
    where (y.created_at at time zone 'Asia/Ho_Chi_Minh')::date <= p_den
      and (y.hoan_thanh_at is null or (y.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date >= p_tu)
      and (d.created_at at time zone 'Asia/Ho_Chi_Minh')::date <= p_den
      and (d.day_at is null or (d.day_at at time zone 'Asia/Ho_Chi_Minh')::date >= p_tu)
      and (d.dong_at is null or (d.dong_at at time zone 'Asia/Ho_Chi_Minh')::date >= p_tu)
    union
    select distinct ca.case_id from ca   -- có lượt xếp trong tuần thì chắc chắn là đang cần
  ),
  xep1 as (  -- lần xếp lịch ĐẦU TIÊN của từng case (mọi thời)
    select hh.bo_tro_yeu_id as case_id, min(hh.created_at) as xep_luc
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
    where hh.bo_tro_yeu_id is not null and b.loai = 'bo_tro_yeu'
    group by hh.bo_tro_yeu_id
  ),
  t1 as (  -- duyệt → xếp lịch: case có lần xếp ĐẦU rơi vào tuần
    select extract(epoch from (x.xep_luc - y.created_at)) / 86400.0 as ngay
    from xep1 x join bo_tro_yeu y on y.id = x.case_id
    where (x.xep_luc at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
  ),
  t2 as (  -- xếp lịch → diễn ra: lượt ĐÃ DIỄN RA trong tuần
    select (ca.ngay - (ca.xep_luc at time zone 'Asia/Ho_Chi_Minh')::date)::numeric as ngay
    from ca where ca.ket_qua in ('hop_le', 'khong_hop_le_khong_test', 'co_mat_chua_dong_ca')
  ),
  vang as (
    select
      -- "chưa xếp" / "trượt" tính Y HỆT _troly_bc_viec_bu (đang có buổi bù = buổi bù hoàn tất có mặt,
      -- hoặc buổi bù còn mở). Ở đây chỉ tách thêm nhóm tốt thành "đã học" và "đã xếp, chờ học".
      case when kb.id is not null then 'khong_bu'
           when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                         where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                           and bb.trang_thai <> 'huy' and x.diem_danh = 'co_mat') then 'da_hoc_bu'
           when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                         where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id and bb.trang_thai = 'mo') then 'da_xep_chua_hoc'
           when exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id) then 'truot'
           else 'chua_xep' end as tt
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
    left join bang_khong_bu kb on kb.buoi_hoc_hs_id = h.id
    where h.diem_danh in ('vang', 'vang_phep') and b.ngay between p_tu and p_den
      and b.ngay >= date '2026-08-10'   -- cùng mốc với _troly_bc_viec_bu
  ),
  bu as (
    select b.trang_thai, h.diem_danh from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id = b.id
    where b.loai = 'bu' and b.ngay between p_tu and p_den
  )
  select jsonb_build_object(
    'tu', p_tu, 'den', p_den,
    'quy_mo', jsonb_build_object(
      'so_buoi', (select count(*) from bh),
      'so_lop', (select count(distinct lop_id) from bh),
      'luot_co_mat', (select count(*) from dd where diem_danh = 'co_mat'),
      'luot_vang', (select count(*) from dd where diem_danh in ('vang', 'vang_phep')),
      'chua_diem_danh', (select count(*) from dd where diem_danh is null),
      'chuyen_can_pct', (select round(count(*) filter (where diem_danh = 'co_mat') * 100.0
                           / nullif(count(*) filter (where diem_danh is not null), 0), 1) from dd)),
    'khau', (select jsonb_agg(jsonb_build_object(
        'ma', kk.ma, 'ten', kk.ten,
        'tong', kk.tong, 'con_han', kk.con_han, 'da_toi_han', kk.tong - kk.con_han,
        'dung_chuan', kk.dung_chuan,
        'cham', kk.dong_muon + kk.qua_han_chua_dong,
        'thieu', kk.khong_co_de + kk.dong_ma_trong + kk.thieu_hs,
        'chi_tiet', jsonb_build_object('dong_muon', kk.dong_muon, 'qua_han_chua_dong', kk.qua_han_chua_dong,
                     'khong_co_de', kk.khong_co_de, 'dong_ma_trong', kk.dong_ma_trong, 'thieu_du_lieu_hs', kk.thieu_hs),
        'pct_dung_chuan', round(kk.dung_chuan * 100.0 / nullif(kk.tong - kk.con_han, 0), 1),
        'pct_cham', round((kk.dong_muon + kk.qua_han_chua_dong) * 100.0 / nullif(kk.tong - kk.con_han, 0), 1),
        'pct_thieu', round((kk.khong_co_de + kk.dong_ma_trong + kk.thieu_hs) * 100.0 / nullif(kk.tong - kk.con_han, 0), 1)
      ) order by kk.thu_tu) from kk
      -- khâu chưa bắt buộc / không có việc trong tuần (chấm bài trên lớp trước 01/10, MT) thì không bày
      where kk.ma in ('btvn', 'et', 'danhgia') or kk.tong > 0),
    'bo_tro_yeu', (select jsonb_build_object(
        'can_bo_tro', (select count(*) from can),
        'da_len_lich', count(distinct ca.case_id),
        'da_bo_tro', count(distinct ca.case_id) filter (where ca.ket_qua in ('hop_le', 'khong_hop_le_khong_test', 'co_mat_chua_dong_ca')),
        'pct_len_lich', round(count(distinct ca.case_id) * 100.0 / nullif((select count(*) from can), 0), 1),
        'pct_da_bo_tro', round(count(distinct ca.case_id) filter (where ca.ket_qua in ('hop_le', 'khong_hop_le_khong_test', 'co_mat_chua_dong_ca'))
                          * 100.0 / nullif((select count(*) from can), 0), 1),
        'luot_xep', count(*),
        'luot_dien_ra', count(*) filter (where ca.ket_qua in ('hop_le', 'khong_hop_le_khong_test', 'co_mat_chua_dong_ca')),
        'luot_hop_le', count(*) filter (where ca.ket_qua = 'hop_le'),
        'luot_khong_test', count(*) filter (where ca.ket_qua = 'khong_hop_le_khong_test'),
        'luot_ta_chua_dong_ca', count(*) filter (where ca.ket_qua = 'co_mat_chua_dong_ca'),
        'luot_cho_hoc', count(*) filter (where ca.ket_qua = 'cho_hoc'),
        'su_co', count(*) filter (where ca.ket_qua in ('huy_hs_khong_den', 'huy_khac', 'vang_chua_huy', 'qua_ngay_khong_dien_ra')),
        'pct_su_co', round(count(*) filter (where ca.ket_qua in ('huy_hs_khong_den', 'huy_khac', 'vang_chua_huy', 'qua_ngay_khong_dien_ra'))
                      * 100.0 / nullif(count(*), 0), 1),
        -- Tách theo LÝ DO THẬT ghi trên buổi: "qua ngày không điểm danh" (hệ tự huỷ) KHÔNG phải
        -- bằng chứng em không đến — chỉ biết là không ai điểm danh ⇒ để riêng, không gộp vào HS vắng.
        'su_co_chi_tiet', jsonb_build_object(
          'hs_khong_den', count(*) filter (where ca.ket_qua = 'vang_chua_huy'
              or (ca.ket_qua = 'huy_hs_khong_den' and ca.ly_do_huy not ilike '%qua ngày không điểm danh%')),
          'khong_diem_danh', count(*) filter (where ca.ket_qua = 'qua_ngay_khong_dien_ra'
              or (ca.ket_qua = 'huy_hs_khong_den' and ca.ly_do_huy ilike '%qua ngày không điểm danh%')),
          'ops_go_khoi_lich', count(*) filter (where ca.ket_qua = 'huy_khac' and ca.ly_do_huy ilike 'OPS gỡ%'),
          'huy_ly_do_khac', count(*) filter (where ca.ket_qua = 'huy_khac' and coalesce(ca.ly_do_huy, '') not ilike 'OPS gỡ%'))
      ) from ca),
    'btvn_hs', public._troly_bc_btvn_ti_le(p_tu, p_den) - 'lop' - 'cach_tinh',
    'thoi_gian', jsonb_build_object(
      'duyet_den_xep', (select jsonb_build_object('so_mau', count(*),
          'tb_ngay', round(avg(ngay)::numeric, 1),
          'trung_vi_ngay', round((percentile_cont(0.5) within group (order by ngay))::numeric, 1),
          'lau_nhat_ngay', round(max(ngay)::numeric, 1)) from t1),
      'xep_den_dien_ra', (select jsonb_build_object('so_mau', count(*),
          'tb_ngay', round(avg(ngay)::numeric, 1),
          'trung_vi_ngay', round((percentile_cont(0.5) within group (order by ngay))::numeric, 1),
          'lau_nhat_ngay', round(max(ngay)::numeric, 1)) from t2)),
    'bo_tro_bu', jsonb_build_object(
      'luot_vang', (select count(*) from vang),
      'da_xep', (select count(*) from vang where tt in ('da_hoc_bu', 'da_xep_chua_hoc', 'truot')),
      'da_hoc_bu', (select count(*) from vang where tt = 'da_hoc_bu'),
      'khong_bu', (select count(*) from vang where tt = 'khong_bu'),
      'chua_xep', (select count(*) from vang where tt = 'chua_xep'),
      'su_co', (select count(*) from vang where tt = 'truot'),
      'pct_da_xep', (select round(count(*) filter (where tt in ('da_hoc_bu', 'da_xep_chua_hoc', 'truot')) * 100.0
                       / nullif(count(*) filter (where tt <> 'khong_bu'), 0), 1) from vang),
      'pct_da_hoc_bu', (select round(count(*) filter (where tt = 'da_hoc_bu') * 100.0
                       / nullif(count(*) filter (where tt <> 'khong_bu'), 0), 1) from vang),
      'buoi_bu_luot', (select count(*) from bu),
      'buoi_bu_co_mat', (select count(*) from bu where trang_thai <> 'huy' and diem_danh = 'co_mat'),
      'buoi_bu_vang', (select count(*) from bu where trang_thai <> 'huy' and diem_danh in ('vang', 'vang_phep')),
      'buoi_bu_huy', (select count(*) from bu where trang_thai = 'huy'))
  ) into v;
  return v;
end $$;

-- XẾP HẠNG giáo viên – TA theo từng nghiệp vụ trong tuần.
create or replace function public._troly_tuan_xep_hang(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb;
begin
  perform public._troly_gac();
  with g as (
    select r.tab, r.kq, u.nguoi_id
    from public._troly_viec_buoi_goc(p_tu, p_den) r
    cross join lateral unnest(r.nguoi_ids) u(nguoi_id)
    where r.kq not in ('bo_qua', 'con_han')
  ),
  p as (
    select g.tab, ns.id, ns.ho_ten, ns.ma_ns,
      count(*)::int as tong,
      count(*) filter (where g.kq = 'dung_chuan')::int as dung_chuan,
      count(*) filter (where g.kq in ('xong_muon', 'cham'))::int as cham,
      count(*) filter (where g.kq in ('khong_co_de', 'dong_ma_trong', 'thieu_hs'))::int as thieu
    from g join nhan_su ns on ns.id = g.nguoi_id
    where not (public._troly_bc_gia_dinh()->'xep_hang_bo_qua') ? coalesce(ns.ma_ns, '')
    group by g.tab, ns.id, ns.ho_ten, ns.ma_ns
  ),
  x as (
    select p.*, round(p.dung_chuan * 100.0 / p.tong, 1) as pct_dung_chuan,
           rank() over (partition by p.tab order by p.dung_chuan * 1.0 / p.tong desc, p.tong desc)::int as hang
    from p
  )
  select coalesce(jsonb_object_agg(t.tab, t.ds), '{}'::jsonb) into v
  from (
    select x.tab, jsonb_agg(jsonb_build_object('hang', x.hang, 'ho_ten', x.ho_ten, 'ma_ns', x.ma_ns,
             'tong', x.tong, 'dung_chuan', x.dung_chuan, 'cham', x.cham, 'thieu', x.thieu,
             'pct_dung_chuan', x.pct_dung_chuan) order by x.hang, x.ho_ten) as ds
    from x group by x.tab) t;
  return v;
end $$;

-- Phần TÍNH của tổng kết tuần (không lưu). p_tuan = ngày bất kỳ trong tuần muốn xem.
create or replace function public.fn_troly_tuan(p_tuan date) returns jsonb
language plpgsql stable as $$
declare
  v_nay date := public._troly_hom_nay();
  v_tu date := public._troly_dau_tuan(p_tuan);
  v_den date := public._troly_dau_tuan(p_tuan) + 6;
begin
  perform public._troly_gac();
  if v_tu > v_nay then raise exception 'Tuần này chưa bắt đầu.'; end if;
  return jsonb_build_object(
    'bo', 'tuan', 'ten', 'Tổng kết tuần',
    'tu', v_tu, 'den', v_den,
    'da_ket_thuc', v_den < v_nay,
    'tao_luc', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI'),
    'so', public._troly_tuan_so(v_tu, least(v_den, v_nay)),
    'truoc', public._troly_tuan_so(v_tu - 7, v_tu - 1),
    'xep_hang', public._troly_tuan_xep_hang(v_tu, least(v_den, v_nay)),
    'xep_hang_bo_qua', (select coalesce(jsonb_agg(ns.ho_ten order by ns.ma_ns), '[]'::jsonb) from nhan_su ns
                         where (public._troly_bc_gia_dinh()->'xep_hang_bo_qua') ? coalesce(ns.ma_ns, '')),
    'cach_tinh', jsonb_build_array(
      'Mẫu số của các tỉ lệ = việc đã tới hạn hoặc đã đóng. Việc còn trong hạn mà chưa đóng để riêng, không tính vào tỉ lệ.',
      'ĐÚNG CHUẨN = đóng đúng hạn và đủ dữ liệu. CHẬM = đóng sau hạn, hoặc quá hạn mà chưa đóng. THIẾU = buổi không có đề / không gán bài, bấm đóng mà trống, hoặc đóng mà còn em có mặt thiếu dữ liệu.',
      'Một việc có nhiều người phụ trách thì tính cho từng người ở bảng xếp hạng, nhưng chỉ tính MỘT lần ở con số của trung tâm.',
      'Bổ trợ yếu — "cần bổ trợ" = case còn ít nhất một dạng phải dạy trong tuần. "Đã lên lịch" / "đã bổ trợ" đếm theo CASE; "sự cố" đếm theo LƯỢT xếp (1 học sinh × 1 buổi).',
      '"Chuyển lịch" chưa đo được chính xác vì hệ không ghi vết đổi ngày/giờ buổi bổ trợ; con số gần nhất là lượt bị "OPS gỡ khỏi lịch phòng".',
      'Duyệt → xếp lịch: tính trên case có LẦN XẾP ĐẦU rơi vào tuần. Xếp lịch → diễn ra: tính trên lượt đã diễn ra trong tuần.',
      'Sự cố "không ai điểm danh" = buổi qua ngày mà không có điểm danh nên hệ tự huỷ; không biết em có đến hay không, nên để riêng với "học sinh không đến".',
      'Bổ trợ bù tính theo LƯỢT VẮNG của tuần: tới lúc tính thì lượt vắng đó đã được xếp bù / đã học bù chưa. Tuần càng mới thì số "đã học bù" càng thấp vì buổi bù chưa tới ngày.',
      'BTVN của học sinh: một em đạt chuẩn khi đã nộp + có thái độ + có điểm chấm; "xin phép" vẫn tính là chưa nộp.',
      'Chấm bài trên lớp chỉ bắt buộc từ 01/10/2026 nên trước đó không có trong tổng kết.'));
end $$;

-- CỬA màn hình gọi: lấy bản lưu của tuần, chưa có / cũ / bấm tính lại thì tính rồi ghi đè.
-- Bản lưu dùng lại khi: tính trong HÔM NAY, hoặc tuần đã qua trên 7 ngày và bản lưu được tính
-- sau mốc đó (số của tuần cũ không còn đổi đáng kể). SECURITY DEFINER — lý do như fn_troly_bao_cao_lay.
create or replace function public.fn_troly_tuan_lay(p_tuan date default null, p_tinh_lai boolean default false)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_nay date := public._troly_hom_nay();
  v_tu date := public._troly_dau_tuan(coalesce(p_tuan, public._troly_hom_nay() - 7));   -- mặc định: tuần vừa rồi
  v_ns uuid := public.current_nhan_su_id();
  r troly_bao_cao_luu%rowtype;
  v jsonb; t0 timestamptz; v_ms int;
begin
  perform public._troly_gac();

  if not coalesce(p_tinh_lai, false) then
    select * into r from troly_bao_cao_luu l where l.bo = 'tuan' and l.ngay = v_tu and l.so_ngay = 7;
    if r.bo is not null
       and (r.tinh_luc at time zone 'Asia/Ho_Chi_Minh')::date <> v_nay
       and not (v_tu + 6 + 7 < v_nay and (r.tinh_luc at time zone 'Asia/Ho_Chi_Minh')::date > v_tu + 6 + 7) then
      r := null;   -- bản lưu đã cũ so với dữ liệu còn đang đổi ⇒ tính lại
    end if;
  end if;

  if r.bo is null then
    t0 := clock_timestamp();
    v := public.fn_troly_tuan(v_tu);
    v_ms := (extract(epoch from clock_timestamp() - t0) * 1000)::int;
    insert into troly_bao_cao_luu as l (bo, ngay, so_ngay, ket_qua, tinh_luc, tinh_boi, tinh_mat_ms, so_lan_tinh)
      values ('tuan', v_tu, 7, v, now(), v_ns, v_ms, 1)
    on conflict (bo, ngay, so_ngay) do update
      set ket_qua = excluded.ket_qua, tinh_luc = excluded.tinh_luc, tinh_boi = excluded.tinh_boi,
          tinh_mat_ms = excluded.tinh_mat_ms, so_lan_tinh = l.so_lan_tinh + 1
    returning l.* into r;
  end if;

  return r.ket_qua || jsonb_build_object('luu', jsonb_build_object(
    'vua_tinh', t0 is not null,
    'tinh_luc', to_char(r.tinh_luc at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM'),
    'tinh_boi', (select ns.ho_ten from nhan_su ns where ns.id = r.tinh_boi),
    'tinh_mat_ms', r.tinh_mat_ms,
    'so_lan_tinh', r.so_lan_tinh));
end $$;

-- Quyền: chỉ 2 cửa `_lay` (definer) mở cho authenticated; mọi hàm tính bên trong thì thu.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig, p.proname
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('_troly_viec_buoi_goc', '_troly_ca_yeu_goc', '_troly_bc_viec_buoi', '_troly_bc_ca_yeu',
                        '_troly_bc_gia_dinh', '_troly_tuan_so', '_troly_tuan_xep_hang', 'fn_troly_tuan', 'fn_troly_tuan_lay')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', r.sig);
    if r.proname = 'fn_troly_tuan_lay' then
      execute format('grant execute on function %s to authenticated', r.sig);
    end if;
  end loop;
end $$;

comment on function public.fn_troly_tuan_lay(date, boolean) is
  'Cửa màn hình gọi để lấy TỔNG KẾT TUẦN của trợ lý (dashboard toàn cảnh, CEO 29/09). Trả bản lưu; chưa có / đã cũ / p_tinh_lai thì tính rồi ghi đè. Chỉ nhóm troly_duoc_dung().';
