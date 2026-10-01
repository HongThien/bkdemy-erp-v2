-- ============================================================================
-- 202609291033 — troly_btvn_chot_nguong_xin_phep
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/09 chốt 3 câu còn treo của phần "trợ giảng chấm BTVN" (mig 202609291026):
--     · Ngưỡng lớp "tệ" 70%: "70% ok"  ⇒ hết là số tạm, bỏ chữ "chờ chốt" khỏi báo cáo.
--     · Xin phép: "tính là hợp lệ về THÁI ĐỘ thôi, còn vẫn phải nộp bài mà. Nên vẫn tính."
--       ⇒ em xin phép VẪN là chưa nộp (tỉ lệ giữ nguyên cách tính), nhưng KHÔNG bị gắn cảnh
--         báo thái độ. Bản trước đếm cảnh báo thái độ trên mọi dòng, kể cả dòng xin phép.
--     · ET không cần phần tỉ lệ: "Học sinh đi học là có ET nhưng chưa chắc đã nộp BTVN."
--       ⇒ không xây gì thêm cho ET; ghi lại để lần sau không đề xuất lại.
--
--   `_troly_bc_canh_bao` và `_troly_bc_btvn_ti_le` phải chép lại NGUYÊN thân (plpgsql không vá
--   được từng dòng). Khác bản cũ đúng ở chỗ có đánh dấu "⟵ ĐỔI 202609291033".
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Thay thân 3 hàm đang có, không đổi khoá nào trong kết quả.
-- ============================================================================

create or replace function public._troly_bc_gia_dinh() returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'ti_le_bao_dong', 0.8,      -- điểm < 80% TB lớp
    'si_so_toi_thieu', 3,       -- lớp dưới 3 em có điểm thì không so với TB
    'muc_bao_dong', 2,          -- mức đánh giá ≤ 2
    'ngay_nhin_lai', 30,
    'ingame_bat_buoc_tu', '2026-10-01',   -- CEO 29/09: chấm bài trên lớp bắt buộc từ tháng 10
    'btvn_ti_le_nop_toi_thieu', 0.7)      -- CEO chốt 29/09: lớp có tỉ lệ nộp đạt chuẩn dưới 70% = "tệ"
$$;

create or replace function public._troly_bc_btvn_ti_le(p_tu date, p_den date) returns jsonb
language plpgsql stable as $$
declare v jsonb; v_ng numeric := (public._troly_bc_gia_dinh()->>'btvn_ti_le_nop_toi_thieu')::numeric;
begin
  perform public._troly_gac();
  with b0 as (
    select bh.id, bh.lop_id, bh.ngay, bh.btvn_dong_at, l.ten_lop, l.mon,
           public.fn_han_viec(bh.lop_id, bh.ngay, bh.gio_bat_dau, 'btvn') as han
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between p_tu and p_den
      and (exists (select 1 from tai_lieu t where t.loai = 'btvn' and t.lop_id = bh.lop_id and t.ngay = bh.ngay)
        or exists (select 1 from bai_test x where x.loai = 'btvn' and x.lop_id = bh.lop_id and x.ngay = bh.ngay)
        or exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = bh.id and sp.phase = 'btvn'))
  ),
  b as (select * from b0 where b0.btvn_dong_at is not null or (b0.han is not null and b0.han < now())),
  kq as (
    select k.buoi_hoc_id, k.hoc_sinh_id, k.trang_thai_nop, k.thai_do
    from btvn_ket_qua k where k.buoi_hoc_id in (select id from b)
  ),
  diem as (  -- (buổi, em) có ít nhất 1 câu BTVN được chấm, kèm người chấm
    select sp.buoi_hoc_id, g.hoc_sinh_id, g.graded_by
    from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
    where sp.phase = 'btvn' and sp.buoi_hoc_id in (select id from b)
  ),
  can as (  -- mẫu số: em có mặt buổi giao ∪ em có dòng BTVN
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
     where h.buoi_hoc_id in (select id from b) and h.diem_danh = 'co_mat'
    union
    select kq.buoi_hoc_id, kq.hoc_sinh_id from kq
  ),
  e as (  -- phán từng em
    select c.buoi_hoc_id, c.hoc_sinh_id, hs.ho_ten,
      case
        when kq.hoc_sinh_id is null then 'Chưa có dòng BTVN nào'
        when kq.trang_thai_nop is null then 'Chưa tick trạng thái nộp'
        when kq.trang_thai_nop = 'khong_lam' then 'Chưa nộp — không làm'
        when kq.trang_thai_nop = 'xin_phep' then 'Chưa nộp — xin phép'
        when concat_ws(' + ',
               case when kq.thai_do is null then 'thái độ' end,
               case when not exists (select 1 from diem d where d.buoi_hoc_id = c.buoi_hoc_id and d.hoc_sinh_id = c.hoc_sinh_id) then 'điểm chấm' end) <> ''
          then 'Đã nộp nhưng thiếu thông tin: ' || concat_ws(' + ',
               case when kq.thai_do is null then 'thái độ' end,
               case when not exists (select 1 from diem d where d.buoi_hoc_id = c.buoi_hoc_id and d.hoc_sinh_id = c.hoc_sinh_id) then 'điểm chấm' end)
      end as ly_do,   -- NULL = đạt chuẩn
      case when kq.hoc_sinh_id is null or kq.trang_thai_nop is null then 'thieu'
           when kq.trang_thai_nop in ('khong_lam', 'xin_phep') then 'chua_nop'
           else 'thieu' end as nhom
    from can c
    join hoc_sinh hs on hs.id = c.hoc_sinh_id
    left join kq on kq.buoi_hoc_id = c.buoi_hoc_id and kq.hoc_sinh_id = c.hoc_sinh_id
  ),
  bb as (  -- từng buổi
    select b.id, b.lop_id, b.ten_lop, b.mon, b.ngay, b.btvn_dong_at, b.han,
      (select count(*) from e where e.buoi_hoc_id = b.id)::int as can_co,
      (select count(*) from e where e.buoi_hoc_id = b.id and e.ly_do is null)::int as dat,
      (select count(*) from e where e.buoi_hoc_id = b.id and e.ly_do is not null and e.nhom = 'chua_nop')::int as chua_nop,
      (select count(*) from e where e.buoi_hoc_id = b.id and e.ly_do is not null and e.nhom = 'thieu')::int as thieu_thong_tin,
      (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', e.ho_ten, 'ly_do', e.ly_do, 'nhom', e.nhom)
                order by e.nhom desc, e.ho_ten), '[]'::jsonb)
         from e where e.buoi_hoc_id = b.id and e.ly_do is not null) as hs,
      (select string_agg(distinct ns.ho_ten, ', ') from diem d
         join tai_khoan tk on tk.id = d.graded_by join nhan_su ns on ns.id = tk.nhan_su_id
        where d.buoi_hoc_id = b.id) as nguoi_cham
    from b
  ),
  ll as (  -- từng lớp
    select bb.lop_id, max(bb.ten_lop) as ten_lop, max(bb.mon) as mon,
      count(*)::int as so_buoi, sum(bb.can_co)::int as can_co, sum(bb.dat)::int as dat,
      sum(bb.chua_nop)::int as chua_nop, sum(bb.thieu_thong_tin)::int as thieu_thong_tin,
      (select string_agg(ns.ho_ten, ', ' order by pc.la_chinh desc nulls last, ns.ho_ten)
         from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
        where pc.lop_id = bb.lop_id and pc.vai_tro = 'tg') as ta_phan_cong,
      jsonb_agg(jsonb_build_object(
        'ngay', bb.ngay,
        'han', to_char(bb.han at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'da_dong', bb.btvn_dong_at is not null,
        'dong_luc', to_char(bb.btvn_dong_at at time zone 'Asia/Ho_Chi_Minh', 'DD/MM HH24:MI'),
        'nguoi_cham', bb.nguoi_cham,
        'can_co', bb.can_co, 'dat', bb.dat, 'chua_nop', bb.chua_nop, 'thieu_thong_tin', bb.thieu_thong_tin,
        'ti_le_pct', case when bb.can_co > 0 then round(bb.dat * 100.0 / bb.can_co)::int end,
        'hs', bb.hs) order by bb.ngay desc) as buoi
    from bb group by bb.lop_id
  ),
  lx as (
    select ll.*, case when ll.can_co > 0 then round(ll.dat * 100.0 / ll.can_co)::int end as ti_le_pct,
           (ll.can_co > 0 and ll.dat::numeric / ll.can_co < v_ng) as duoi_nguong
    from ll
  )
  select jsonb_build_object(
    'nguong_pct', round(v_ng * 100)::int,
    'so_lop', (select count(*) from lx),
    'so_lop_duoi_nguong', (select count(*) from lx where duoi_nguong),
    'so_buoi', (select coalesce(sum(so_buoi), 0) from lx),
    'can_co', (select coalesce(sum(can_co), 0) from lx),
    'dat', (select coalesce(sum(dat), 0) from lx),
    'chua_nop', (select coalesce(sum(chua_nop), 0) from lx),
    'thieu_thong_tin', (select coalesce(sum(thieu_thong_tin), 0) from lx),
    'ti_le_pct', (select case when sum(can_co) > 0 then round(sum(dat) * 100.0 / sum(can_co))::int end from lx),
    'lop', (select coalesce(jsonb_agg(jsonb_build_object(
        'ten_lop', lx.ten_lop, 'mon', lx.mon, 'ta_phan_cong', lx.ta_phan_cong,
        'so_buoi', lx.so_buoi, 'can_co', lx.can_co, 'dat', lx.dat,
        'chua_nop', lx.chua_nop, 'thieu_thong_tin', lx.thieu_thong_tin,
        'ti_le_pct', lx.ti_le_pct, 'duoi_nguong', lx.duoi_nguong, 'buoi', lx.buoi)
        order by lx.ti_le_pct nulls last, lx.ten_lop), '[]'::jsonb) from lx),
    'cach_tinh', jsonb_build_array(
      'Một em ĐẠT CHUẨN khi đủ cả ba: đã nộp (đúng hạn hoặc muộn) · đã tick thái độ · có điểm chấm câu. Thiếu một trong ba là không đạt.',
      'Mẫu số = em có mặt ở buổi giao bài, cộng em vắng mà vẫn có dòng BTVN.',
      'Chỉ tính buổi đã bấm đóng BTVN hoặc đã quá hạn chấm (giờ vào ca kế − 2 giờ). Buổi còn trong hạn chưa tính.',
      -- ⟵ ĐỔI 202609291033: ngưỡng đã chốt + nói rõ luật xin phép
      '"Xin phép" chỉ hợp lệ về thái độ; bài thì vẫn phải nộp, nên em xin phép vẫn tính là chưa nộp.',
      format('Lớp "tệ" = tỉ lệ dưới %s%% (CEO chốt 29/09).', round(v_ng * 100)))
  ) into v;
  return v;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- LUỒNG 3 — CẢNH BÁO rủi ro / bất thường. Trả { <mã mục>: [cảnh báo…] }.
-- Mỗi cảnh báo: { ma, muc_do (cao | vua | thieu_nguon | ghi_chu), tieu_de, mo_ta, so, chi_tiet[{chinh, phu, noi_dung}] }.
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
      -- ⟵ ĐỔI 202609291033: xin phép là hợp lệ về thái độ (CEO 29/09) ⇒ không gắn cảnh báo thái độ
      and kq.trang_thai_nop is distinct from 'xin_phep'
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
      'mo_ta', 'Bị ghi "chưa nghiêm túc" hoặc "chống đối" từ 2 lần trở lên trong khoảng báo cáo. Lần em xin phép không tính.',
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
      and bh.ngay >= (g->>'ingame_bat_buoc_tu')::date     -- trước mốc khâu này chưa bắt buộc
  )
  select count(*)::int, count(*) filter (where not co_dl)::int into n, n2 from b;
  if n >= 5 and n2::numeric / n >= 0.3 then
    cb := jsonb_set(cb, '{trong_buoi}', coalesce(cb->'trong_buoi', '[]'::jsonb) || jsonb_build_object(
      'ma', 'ingame_dong_khong', 'muc_do', 'cao', 'so', n2,
      'tieu_de', format('%s/%s buổi bấm đóng "chấm bài trên lớp" mà không có dòng chấm nào (%s%%)', n2, n, round(n2 * 100.0 / n)),
      'mo_ta', 'Khâu này đã bắt buộc mà vẫn bấm đóng cho xong: task tính là hoàn thành nhưng không sinh dữ liệu đo nào.',
      'chi_tiet', '[]'::jsonb));
  end if;
  if p_tu < (g->>'ingame_bat_buoc_tu')::date then
    cb := jsonb_set(cb, '{trong_buoi}', coalesce(cb->'trong_buoi', '[]'::jsonb) || jsonb_build_object(
      'ma', 'ingame_chua_bat_buoc', 'muc_do', 'ghi_chu', 'so', 0,
      'tieu_de', format('Chấm bài trên lớp chỉ bắt buộc từ %s — buổi trước ngày đó không tính chậm / miss',
                        to_char((g->>'ingame_bat_buoc_tu')::date, 'DD/MM')),
      'mo_ta', 'Nên con số của mục này sẽ bằng 0 hoặc rất nhỏ cho tới khi khoảng báo cáo chạm tháng 10.',
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
      'mo_ta', format('Riêng học sinh không đến đã là %s lượt. Công xếp lịch + báo phụ huynh đang mất phần lớn ở khâu học sinh có đến hay không.', n3),
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
      'mo_ta', format('Người xếp lịch: %s (trưởng vận hành). Hệ chưa có hạn cho việc xếp lịch nên các case này không tính là "chậm" — nêu ở đây để không bị quên. Danh sách: ưu tiên cao trước, mở lâu trước (tối đa 30).', public._troly_truong_van_hanh()),
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

-- `create or replace` giữ nguyên quyền đã cấp; cấp lại cho chắc ở cả hai đường áp (migrate / SQL Editor).
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('_troly_bc_gia_dinh', '_troly_bc_btvn_ti_le', '_troly_bc_canh_bao')
  loop
    execute format('revoke all on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated', r.sig);
  end loop;
end $$;
