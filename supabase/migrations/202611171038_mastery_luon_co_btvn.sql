-- 17/11/2026 · Thùy "mastery luật mới tính BTVN nhé" → "Chuyển hết": MỘT mastery = bản CÓ BTVN (spec-mastery.md §2).
-- 4 hàm cuối cùng còn đọc bản chỉ ET + MT đổi sang có BTVN: trợ lý (thông tin học tập 1 HS) · ôn tập BTVN · thành tựu tháng · vinh danh HS.
-- Sinh bằng .tmp-claude/gen-mig2.mjs từ thân hàm ĐANG CHẠY; chỉ đổi cờ include_btvn false → true. Không đổi chữ ký, không đổi quyền.
do $$ begin
  if md5(pg_get_functiondef('public._troly_cc_hoc_tap_hoc_sinh'::regproc)) <> '62a16e7927ac3cd5f7a7e89ca9d5a80c' then raise exception 'Hàm _troly_cc_hoc_tap_hoc_sinh đã bị đổi sau lúc sinh migration — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_ontap_diem_dang'::regproc)) <> '5d94f3c36337ea442b03b7a17acb8fe4' then raise exception 'Hàm fn_ontap_diem_dang đã bị đổi sau lúc sinh migration — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_thanh_tuu_thang'::regproc)) <> '53ce8ac672ec1c200aa87f976d2d88c8' then raise exception 'Hàm fn_thanh_tuu_thang đã bị đổi sau lúc sinh migration — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_vinh_danh_hs'::regproc)) <> '155d41b41fa000955ce7bd7b313224d0' then raise exception 'Hàm fn_vinh_danh_hs đã bị đổi sau lúc sinh migration — sinh lại'; end if;
end $$;

CREATE OR REPLACE FUNCTION public._troly_cc_hoc_tap_hoc_sinh(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_hs jsonb; v_id uuid; v_mon text := nullif(btrim(p->>'mon'), '');
  v_den date; v_tu date; v jsonb;
begin
  perform public._troly_gac();
  v_hs := public._troly_chon_hs(p->>'ten_hoc_sinh', p->>'ten_lop');
  if v_hs ? 'loi' then return v_hs; end if;
  v_id := (v_hs->>'id')::uuid;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 60);
  if v_den - v_tu > 370 then v_tu := v_den - 370; end if;

  with lop_hs as (
    select distinct l.id, l.ten_lop, l.mon
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_id and (v_mon is null or l.mon = v_mon)
      and hl.ngay_vao <= v_den and (hl.ngay_roi is null or hl.ngay_roi >= v_tu)
  ),
  pha as (select unnest(array['et', 'btvn', 'mt']) as phase),
  mx as (
    select ph.phase, lh.ten_lop, lh.mon, m.ngay, m.buoi_hoc_id, m.pct, m.status
    from lop_hs lh cross join pha ph
    cross join lateral public._troly_matrix(lh.id, ph.phase, v_tu, v_den) m
    where m.hoc_sinh_id = v_id
  ),
  dem as (  -- số câu đúng/một phần/sai — đếm thô, không phải công thức
    select sp.phase, g.buoi_hoc_id,
           count(*) filter (where g.result = 'correct')::int as dung,
           count(*) filter (where g.result = 'partial')::int as mot_phan,
           count(*) filter (where g.result = 'wrong')::int as sai
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where g.hoc_sinh_id = v_id and sp.phase in ('et', 'btvn', 'mt')
      and g.buoi_hoc_id in (select buoi_hoc_id from mx)
    group by sp.phase, g.buoi_hoc_id
  ),
  ms as (
    select c.ma_dang, c.score, c.n, c.muc, c.tin, public._troly_ten_dang(c.ma_dang) as td
    from public.fn_mastery_cells_moi(array[v_id], true) c
  ),
  msl as (select * from ms where v_mon is null or td->>'mon' = v_mon or td is null)
  select jsonb_build_object(
    'hoc_sinh', v_hs - 'id' - 'phu_huynh_id',
    'mon_loc', v_mon,
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'elo', (select coalesce(jsonb_agg(jsonb_build_object('mon', e.mon, 'elo', e.elo, 'so_buoi_da_tinh', e.sessions_played) order by e.mon), '[]'::jsonb)
              from gami_elo e where e.hoc_sinh_id = v_id and (v_mon is null or e.mon = v_mon)),
    'mastery_tong', (select jsonb_build_object(
                        'so_dang_da_do', count(*),
                        'dat', count(*) filter (where muc = 'dat'),
                        'can_luyen', count(*) filter (where muc = 'can_luyen'),
                        'yeu', count(*) filter (where muc = 'yeu'),
                        'do_tin_thap', count(*) filter (where tin = 'thap')) from msl),
    'dang_yeu_va_can_luyen', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select ma_dang, td->>'ten' as ten_dang, td->>'mon' as mon, muc,
               round(score * 100)::int as diem_pct, n as so_lan_do, tin as do_tin
        from msl where muc in ('yeu', 'can_luyen') order by score, ma_dang limit 40) x),
    'et_tung_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select mx.ngay, mx.ten_lop, mx.mon, mx.pct as diem_pct, mx.status as trang_thai, d.dung, d.mot_phan, d.sai
        from mx left join dem d on d.phase = 'et' and d.buoi_hoc_id = mx.buoi_hoc_id
        where mx.phase = 'et' order by mx.ngay desc, mx.ten_lop limit 60) x),
    'btvn_tung_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select mx.ngay, mx.ten_lop, mx.mon, mx.pct as diem_pct, mx.status as trang_thai,
               k.trang_thai_nop, k.thai_do, d.dung, d.mot_phan, d.sai
        from mx left join dem d on d.phase = 'btvn' and d.buoi_hoc_id = mx.buoi_hoc_id
        left join btvn_ket_qua k on k.buoi_hoc_id = mx.buoi_hoc_id and k.hoc_sinh_id = v_id
        where mx.phase = 'btvn' order by mx.ngay desc, mx.ten_lop limit 60) x),
    'mt_tung_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select mx.ngay, mx.ten_lop, mx.mon, mx.pct as diem_pct, mx.status as trang_thai, d.dung, d.mot_phan, d.sai
        from mx left join dem d on d.phase = 'mt' and d.buoi_hoc_id = mx.buoi_hoc_id
        where mx.phase = 'mt' order by mx.ngay desc, mx.ten_lop limit 60) x),
    'diem_thi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select kt.ngay, kt.ten as ky_thi, kt.loai, kt.mon, dt.diem, dt.diem_co_ban, dt.diem_nang_cao, dt.verdict as ket_qua
        from diem_thi dt join ky_thi kt on kt.id = dt.ky_thi_id
        where dt.hoc_sinh_id = v_id and (v_mon is null or kt.mon = v_mon)
          and (kt.ngay is null or kt.ngay between v_tu and v_den)
        order by kt.ngay desc nulls last limit 30) x),
    'diem_danh', (select jsonb_build_object(
        'so_buoi', count(*),
        'co_mat', count(*) filter (where h.diem_danh = 'co_mat'),
        'vang', count(*) filter (where h.diem_danh = 'vang'),
        'vang_phep', count(*) filter (where h.diem_danh = 'vang_phep'),
        'ngay_vang', coalesce(jsonb_agg(jsonb_build_object('ngay', b.ngay, 'lop', l.ten_lop, 'loai', h.diem_danh) order by b.ngay desc)
                       filter (where h.diem_danh in ('vang', 'vang_phep')), '[]'::jsonb))
        from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
        left join lop l on l.id = b.lop_id
        where h.hoc_sinh_id = v_id and b.ngay between v_tu and v_den and (v_mon is null or l.mon = v_mon)),
    'danh_gia_sau_buoi', (select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) from (
        select b.ngay, l.ten_lop, dg.muc_ma as muc, dg.hoan_thanh_pct, left(dg.nhan_xet, 400) as nhan_xet
        from buoi_danh_gia dg join buoi_hoc b on b.id = dg.buoi_hoc_id left join lop l on l.id = b.lop_id
        where dg.hoc_sinh_id = v_id and b.ngay between v_tu and v_den and (v_mon is null or l.mon = v_mon)
        order by b.ngay desc limit 15) x),
    'ghi_chu', jsonb_build_array(
      'Điểm % từng buổi lấy từ ma trận lớp (đúng số hiển thị trên app), chỉ có buổi THƯỜNG mà khâu đó ĐÃ ĐÓNG. Buổi chưa đóng khâu thì không có dòng — không phải em không làm.',
      'trang_thai: done = có điểm · khong_lam = không làm/xin phép · vang = vắng buổi đó.',
      'Mastery (đạt/cần luyện/yếu) suy động từ MỌI lần đo của dạng tới hiện tại, KHÔNG cắt theo khoảng ngày. Dạng chưa đo thì không có trong danh sách — chưa đo KHÁC yếu.',
      'Chưa gồm mastery Hình học theo mô hình (nguồn riêng).')
  ) into v;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ontap_diem_dang(p_lop uuid, p_mon text, p_ma_dangs text[])
 RETURNS TABLE(ma_dang text, ten_dang text, dat integer, can_luyen integer, yeu integer, total integer, score numeric)
 LANGUAGE sql
 STABLE
AS $function$
  with hs as (select array_agg(hl.hoc_sinh_id) a from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'),
  bat as (select public._mastery_bdm_bat() b),
  -- ứng viên → các khoá mastery: tắt ⇒ chính nó; bật ⇒ NDB giữ nguyên, mã cũ ⇒ dạng bài mà câu CÒN SỐNG của nó quy về
  dich as (
    select c.ma, c.ma as khoa from unnest(p_ma_dangs) c(ma), bat where not bat.b or c.ma like 'NDB%'
    union
    select c.ma, k.khoa from unnest(p_ma_dangs) c(ma), bat
      cross join lateral (
        select public._do_o_bdm(q.ma_cau, c.ma) as khoa from dai_cau_hoi q where q.dang_chinh = c.ma and q.xoa_at is null
        union select public._do_o_bdm(h.ma_cau, c.ma) from hgt_cau_hoi h where h.dang_chinh = c.ma
        union select public._bdm_dang_cu_mot_dich(c.ma)) k
     where bat.b and c.ma not like 'NDB%' and k.khoa is not null
  ),
  o as (select m.ma_dang, m.muc from hs, public.fn_mastery_cells_moi(hs.a, true) m)
  select d.ma, public._kho_ten_dang(p_mon, d.ma),
         count(*) filter (where o.muc = 'dat')::int, count(*) filter (where o.muc = 'can_luyen')::int,
         count(*) filter (where o.muc = 'yeu')::int, count(*)::int,
         round((count(*) filter (where o.muc = 'yeu') + 0.5 * count(*) filter (where o.muc = 'can_luyen'))::numeric / count(*), 4)
    from (select distinct ma, khoa from dich) d join o on o.ma_dang = d.khoa
   group by d.ma
$function$;

CREATE OR REPLACE FUNCTION public.fn_thanh_tuu_thang(p_mon text, p_ym text, p_hs uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(hoc_sinh_id uuid, thanh_tuu_key text, ket_qua text)
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm
declare
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_tu timestamptz := (p_ym || '-01')::date::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den timestamptz := (((p_ym || '-01')::date + interval '1 month')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mua record; v_hs uuid[]; v_dangs text[]; v_khoi text; v_ym text;
begin
  select * into v_mua from gami_mua where p_ym between thang_dau and thang_cuoi limit 1;
  -- em "học tháng đó" = có dòng điểm danh ở buổi lớp môn trong tháng
  select array_agg(distinct h.hoc_sinh_id) into v_hs
  from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
  where l.mon = p_mon and b.ngay between v_ms and v_me and b.trang_thai <> 'huy'
    and (p_hs is null or h.hoc_sinh_id = any(p_hs));
  if v_hs is null then return; end if;
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I union select ma_dang from bdm_ban_do) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;

  -- Bảng đua tháng: chỉ các khối có em trong danh sách (1 HS ⇒ 1 khối)
  create temp table _dua (hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_khoi in select distinct l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id = any(v_hs) and l.khoi is not null loop
    insert into _dua select d.hoc_sinh_id, d.hang, d.so_em_co_diem from public.fn_rank_dua_thang(p_mon, v_khoi, p_ym) d;
  end loop;
  -- MT: tháng này + mốc (tháng MT đầu tiên của em trong mùa)
  create temp table _mt (ym text, hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series((coalesce(v_mua.thang_dau, p_ym) || '-01')::date, v_ms, interval '1 month') g loop
    insert into _mt select v_ym, m.hoc_sinh_id, m.hang, m.so_em from public.fn_mt_hang_thang(p_mon, v_ym) m where m.hoc_sinh_id = any(v_hs);
  end loop;

  return query
  with
  hs as materialized (select unnest(v_hs) as hs),
  dd as materialized (select h.hoc_sinh_id as hs, count(*) filter (where h.diem_danh = 'co_mat') as co, count(*) filter (where h.diem_danh in ('vang', 'vang_phep')) as vang
         from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and h.hoc_sinh_id = any(v_hs)
         group by 1),
  -- 06/11 (Thùy): BTVN làm ở ca HỌC BÙ tính cho BUỔI MẸ (môn + tháng của buổi mẹ), từ tháng 11/2026. Ca bù không có lớp nên
  -- 2 khối dưới (join lop) vốn không đếm nó — không trùng. Buổi mẹ đã có kết quả của chính em thì không lấy bù.
  bu as materialized (select x.* from public.fn_btvn_bu_theo_buoi_me(array(
           select b.id from buoi_hoc b join lop l on l.id = b.lop_id
            where p_ym >= '2026-11' and l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me)) x
         where x.hoc_sinh_id = any(v_hs)
           and not exists (select 1 from btvn_ket_qua k2 where k2.buoi_hoc_id = x.buoi_me_id and k2.hoc_sinh_id = x.hoc_sinh_id)),
  bt as materialized (select y.hs, count(*) as n, count(*) filter (where y.t = 'nop_dung_han') as dh from (
           select k.hoc_sinh_id as hs, k.trang_thai_nop as t
             from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id join lop l on l.id = b.lop_id
            where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and k.trang_thai_nop is not null and k.hoc_sinh_id = any(v_hs)
           union all
           select bu.hoc_sinh_id, bu.trang_thai_nop from bu where bu.trang_thai_nop is not null) y
         group by 1),
  bai as materialized (   -- tỉ lệ đúng từng bài (em × buổi × phase) — cùng quy đổi mastery
    select g.hoc_sinh_id as hs, sp.phase, g.buoi_hoc_id, avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as tl
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and g.hoc_sinh_id = any(v_hs)
    group by 1, 2, 3
    union all   -- 06/11: bài BTVN làm ở ca bù = 1 bài của buổi mẹ
    select bu.hoc_sinh_id, 'btvn', bu.buoi_me_id, bu.pct / 100.0 from bu where bu.pct is not null),
  tl as materialized (select bl.hoc_sinh_id as hs, count(*) as n
         from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt2 on bt2.id = bl.bai_test_id
         where bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc.verdict = 'correct' and bl.hoc_sinh_id = any(v_hs)
           and blc.cham_at >= v_tu and blc.cham_at < v_den
         group by 1),
  tt as materialized (select t.hoc_sinh_id as hs, count(distinct t.ngay) filter (where t.pass) as ngay_pass, count(*) filter (where t.so_dung = t.so_cau) as so_full
         from thu_thach_luot t where t.mon = p_mon and t.ngay between v_ms and v_me and t.hoc_sinh_id = any(v_hs) group by 1),
  mt_nay as materialized (select * from _mt where ym = p_ym),
  mt_moc as materialized (select distinct on (m.hoc_sinh_id) m.hoc_sinh_id, m.ym, m.hang, m.so_em from _mt m order by m.hoc_sinh_id, m.ym),
  ms0 as materialized (select m.hoc_sinh_id as hs, m.ma_dang from public.fn_mastery_cells_moi(v_hs, true, null, 5, 5, 3, v_tu) m
          where m.muc = 'yeu' and m.ma_dang = any(v_dangs)),
  ms1 as materialized (select m.hoc_sinh_id as hs, m.ma_dang, m.muc, m.tin from public.fn_mastery_cells_moi(v_hs, true, null, 5, 5, 3, v_den) m
          where m.ma_dang = any(v_dangs)),
  msdo as materialized (select distinct m.hoc_sinh_id as hs from public.fn_mastery_cells_moi(v_hs, true, v_tu, 5, 5, 3, v_den) m where m.ma_dang = any(v_dangs)),
  ll as materialized (select h.hs,
                exists (select 1 from ms0 join ms1 on ms1.hs = ms0.hs and ms1.ma_dang = ms0.ma_dang
                        where ms0.hs = h.hs and ms1.muc = 'dat' and ms1.tin in ('tb', 'cao')) as lap,
                not exists (select 1 from ms1 where ms1.hs = h.hs and ms1.muc = 'yeu') and exists (select 1 from msdo where msdo.hs = h.hs) as sach
         from hs h),
  tk as materialized (select * from thanh_tuu where mon = p_mon and active)
  select h.hs, tk.key,
    case
      when tk.mo_tu is not null and v_me < tk.mo_tu then 'khong_ap_dung'
      when tk.loai_chi_so = 'mt_hon_moc' and (select mm.ym from mt_moc mm where mm.hoc_sinh_id = h.hs) = p_ym then 'khong_ap_dung'
      when case tk.loai_chi_so
        when 'diem_danh_du'        then coalesce((select dd.co >= 1 and dd.vang = 0 from dd where dd.hs = h.hs), false)
        when 'btvn_dung_han_du'    then coalesce((select bt.n >= 1 and bt.dh = bt.n from bt where bt.hs = h.hs), false)
        when 'tu_luyen_cau_dung'   then coalesce((select tl.n >= (tk.tham_so->>'n')::int from tl where tl.hs = h.hs), false)
        when 'thu_thach_ngay_pass' then coalesce((select tt.ngay_pass >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'thu_thach_luot_full' then coalesce((select tt.so_full >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'et_ti_le_bai'        then coalesce((select count(*) >= 1 and count(*) filter (where bai.tl >= (tk.tham_so->>'ti_le')::numeric)
                                                         >= (tk.tham_so->>'phan')::numeric * count(*)
                                                  from bai where bai.hs = h.hs and bai.phase = 'et'), false)
        when 'btvn_ti_le_tb'       then coalesce((select avg(bai.tl) >= (tk.tham_so->>'ti_le')::numeric from bai where bai.hs = h.hs and bai.phase = 'btvn'), false)
        when 'mt_top_pct'          then coalesce((select m.hang <= ceil((tk.tham_so->>'pct')::numeric * m.so_em) from mt_nay m where m.hoc_sinh_id = h.hs), false)
        when 'mt_hon_moc'          then coalesce((select m.hang::numeric / m.so_em < mc.hang::numeric / mc.so_em
                                                         or m.hang <= ceil((tk.tham_so->>'top_pct')::numeric * m.so_em)
                                                  from mt_nay m join mt_moc mc on mc.hoc_sinh_id = m.hoc_sinh_id where m.hoc_sinh_id = h.hs), false)
        when 'lap_lo'              then coalesce((select ll.lap or ll.sach from ll where ll.hs = h.hs), false)
        when 'dua_thang_top_pct'   then coalesce((select d.hang <= ceil((tk.tham_so->>'pct')::numeric * d.so_em) from _dua d where d.hoc_sinh_id = h.hs), false)
        when 'giai_thuong'         then exists (select 1 from hs_giai_thuong g where g.hoc_sinh_id = h.hs and g.mon = p_mon and g.thang = v_ms)
      end then 'dat'
      else 'khong_dat'
    end
  from hs h cross join tk;
  drop table _dua; drop table _mt;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_vinh_danh_hs(p_hs uuid, p_mon text, p_ym text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_lop uuid; v_lop_ten text; v_khoi text;
  v_den timestamptz; v_tu date; v_den_mt date;
  v_tb numeric; v_rk_khoi int; v_tot_khoi int; v_rk_lop int; v_tot_lop int;
  v_ky text; v_dat int; v_do int;
  v_ho_ten text; v_anh text; v_ma_hs text; v_giai text;
begin
  if p_ym is null or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;

  select h.ho_ten, h.anh_url, h.ma_hs into v_ho_ten, v_anh, v_ma_hs from hoc_sinh h where h.id = p_hs;
  if v_ho_ten is null then raise exception 'Không thấy học sinh.'; end if;

  select l.id, l.ten_lop, l.khoi into v_lop, v_lop_ten, v_khoi
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;

  v_tu := (p_ym || '-25')::date;
  v_den_mt := ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date;   -- < ngày 11/(M+1)
  v_den := least(now(), make_timestamptz(extract(year from v_den_mt)::int, extract(month from v_den_mt)::int,
                                         extract(day from v_den_mt)::int, 0, 0, 0, 'Asia/Ho_Chi_Minh'));

  if v_lop is not null then
    select r.tb, r.rank_now, r.rank_total into v_tb, v_rk_khoi, v_tot_khoi
      from public.fn_rank_diem_mt_lop(v_lop, p_mon, p_ym) r where r.hoc_sinh_id = p_hs;
    select r.rank_now, r.rank_total into v_rk_lop, v_tot_lop
      from public.fn_rank_diem_mt(p_hs, array[v_lop], p_mon, p_ym) r;
  end if;

  select kt.ten into v_ky
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
   where dt.hoc_sinh_id = p_hs and dt.diem is not null and b.ngay >= v_tu and b.ngay < v_den_mt
   order by b.ngay desc limit 1;

  with m as (
    select x.nut, x.muc
      from public._mastery_lan_cap(public._mastery_bdm_bat(), array[p_hs], true, v_den - interval '30 days', v_den,
                                   array['dang'], 5, 5, 3) x
     where x.cap = 'dang'
  ), d as (
    select m.* from m join public._tq_dang_info(p_mon, (select array_agg(distinct nut) from m)) di on di.ma_dang = m.nut
  )
  select count(*) filter (where muc = 'dat'), count(*) into v_dat, v_do from d;

  select g.loai_giai into v_giai from giai_thuong g
   where g.hoc_sinh_id = p_hs and g.mon = p_mon and g.thang = (p_ym || '-01')::date
   order by g.duyet_at limit 1;

  return jsonb_build_object(
    'hoTen', v_ho_ten, 'anhChanDung', (select a.url from hoc_sinh_anh_chan_dung a where a.hoc_sinh_id = p_hs), 'maHs', v_ma_hs, 'anhUrl', v_anh, 'mon', p_mon, 'ym', p_ym,
    'lopId', v_lop, 'lop', v_lop_ten, 'khoi', v_khoi, 'loaiGiai', v_giai,
    'kyThi', v_ky, 'diemTest', round(v_tb, 1),
    'hangLop', v_rk_lop, 'tongLop', v_tot_lop, 'hangKhoi', v_rk_khoi, 'tongKhoi', v_tot_khoi,
    'dangDat', v_dat, 'dangDo', v_do,
    'masteryPct', case when v_do > 0 then round(100.0 * v_dat / v_do) end,
    'mocMastery', v_den
  );
end
$function$;
