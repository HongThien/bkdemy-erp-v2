-- ============================================================================
-- 202610071300 — vi_xu_nguon_moi   (áp: `node scripts/migrate.mjs --only <file này>`)
-- VÌ SAO (K9): Ví xu liệt kê EXP theo nguồn. Hệ mới 06–07/10: (1) dòng NHIỆM VỤ còn ghi "Chặng + rương" (cấp/rương luôn 0) ⇒ trả ĐHT kiếm trong tháng thay vào đó;
--   (2) thêm nguồn THÀNH TỰU (exp_thanh_tuu — mỗi bậc em đã nhận quà, theo tháng nhận). Huy hiệu giữ nguyên (lịch sử; sao nay không còn thưởng nên dòng này sẽ không phát sinh).
-- MẤT GÌ: không xoá/sửa dữ liệu. Thay thân hàm fn_hs_vi_xu_cua_toi (sinh từ định nghĩa live); khoá JSON 'cap'/'so_ruong' của dòng exp_nhiem_vu bị BỎ (app đã đổi sang 'dht').
-- ============================================================================
CREATE OR REPLACE FUNCTION public.fn_hs_vi_xu_cua_toi(p_ym text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ym text := coalesce(p_ym, to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'));
  v_so_du integer;
  v_mua jsonb;
  v_hoat_dong jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;

  select coalesce(sum(amount), 0)::int into v_so_du
  from qlht_xu_ledger where hoc_sinh_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'ten_qua', q.ten, 'anh_url', q.anh_url, 'so_luong', d.so_luong,
    'xu_tru', d.xu_tru, 'trang_thai', d.trang_thai, 'created_at', d.created_at, 'giao_luc', d.giao_luc
  ) order by d.created_at desc), '[]'::jsonb) into v_mua
  from (
    select * from qlht_doi_qua where hoc_sinh_id = v_me order by created_at desc limit 30
  ) d
  join qlht_qua q on q.id = d.qua_id;

  with cua_so as (
    select ((v_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((v_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ),
  dong as (
    select jsonb_build_object('loai', 'exp', 'nguon', l.source, 'mon', l.mon, 'so', l.amount,
             'created_at', l.created_at, 'ngay', b.ngay, 'lop', lp.ten_lop) as x, l.created_at as t
    from gami_exp_ledger l
    cross join cua_so w
    left join buoi_hoc b on b.id = l.ref_buoi_hoc_id
    left join lop lp on lp.id = b.lop_id
    where l.hoc_sinh_id = v_me and (
      -- exp_thang = nguồn gộp cũ (trước khi tách ET/BTVN), vẫn có `note` đúng tháng — vá bug 27/09.
      (l.source in ('exp_et', 'exp_btvn', 'exp_btvn_thang', 'exp_tren_lop', 'exp_thang') and l.note = v_ym)
      -- attend_floor + 3 nguồn legacy một-lần (rank_et/rank_ingame/btvn) đều KHÔNG có `note` → lọc theo ngày.
      or (l.source in ('attend_floor', 'rank_et', 'rank_ingame', 'btvn') and l.created_at >= w.tu and l.created_at < w.den)
    )
    union all
    select jsonb_build_object('loai', 'may_man', 'nguon', 'may_man', 'mon', m.mon, 'so', m.exp,
             'created_at', m.created_at, 'ngay', m.ngay, 'lop', null), m.created_at
    from may_man_hs_luot m
    where m.hoc_sinh_id = v_me and to_char(m.ngay, 'YYYY-MM') = v_ym
    union all
    -- Quy đổi EXP→xu (Thùy 06/10: tự động, nhiều lần/ngày): GỘP 1 dòng / môn theo `thang` của EXP.
    select jsonb_build_object('loai', 'xu', 'nguon', 'chot_thang', 'mon', nullif(x.mon, ''), 'so', sum(x.amount)::int,
             'created_at', max(x.created_at), 'ngay', null, 'lop', null), max(x.created_at)
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me and x.loai in ('chot_thang', 'chot_lai') and x.thang = v_ym
    group by x.mon
    having sum(x.amount) <> 0
    union all
    -- Cộng/trừ TAY — doi_qua/hoan là giao dịch mua, đã hiện ở lich_su_mua (Thùy 23/09).
    select jsonb_build_object('loai', 'xu', 'nguon', x.loai, 'mon', x.mon, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me
      and x.loai in ('cong_tay', 'tru_tay')
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- EXP nhiệm vụ (luật 06/10: lượt Luyện dạng yếu đạt + việc tuần/tháng; đã cắt trần 2.000): gộp theo THÁNG, mỗi môn đang bật. dht = ĐHT kiếm được cùng tháng. Nguồn số = fn_nhiem_vu_chang_thang (cùng nguồn đổi xu).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_nhiem_vu', 'mon', c.mon, 'so', n.exp,
             'created_at', k.t, 'ngay', null, 'lop', null, 'dht', n.diem_chang), k.t
    from nhiem_vu_cau_hinh c
    cross join lateral public.fn_nhiem_vu_chang_thang(c.mon, v_ym, array[v_me]) n
    cross join lateral (select least(now(), (((v_ym || '-01')::date + interval '1 month')::timestamp at time zone 'Asia/Ho_Chi_Minh') - interval '1 second') as t) k
    where c.bat and n.exp > 0
    union all
    -- EXP huy hiệu: mỗi huy hiệu đạt trong tháng (tính vào tháng ĐẠT, giờ VN — như fn_exp_app_thang).
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_huy_hieu', 'mon', h.mon, 'so', s.exp,
             'created_at', h.dat_at, 'ngay', (h.dat_at at time zone 'Asia/Ho_Chi_Minh')::date, 'lop', null, 'sao', h.sao, 'ten', hh.ten), h.dat_at
    from hs_huy_hieu_dat h
    join huy_hieu_thang_sao s on s.mon = h.mon and s.sao = h.sao
    left join huy_hieu hh on hh.mon = h.mon and hh.key = h.huy_hieu_key
    where h.hoc_sinh_id = v_me and s.exp > 0
      and to_char(h.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
    union all
    -- EXP THÀNH TỰU (đã BẤM NHẬN QUÀ; tính vào tháng nhận = thanh_tuu_dat.thang — mig 202610071126)
    select jsonb_build_object('loai', 'exp', 'nguon', 'exp_thanh_tuu', 'mon', nullif(t.mon, ''), 'so', t.exp,
             'created_at', t.chot_at, 'ngay', (t.chot_at at time zone 'Asia/Ho_Chi_Minh')::date, 'lop', null, 'bac', t.bac, 'ten', lo.ten), t.chot_at
    from thanh_tuu_dat t
    join thanh_tuu_loai lo on lo.ma = t.ma
    where t.hoc_sinh_id = v_me and t.exp > 0 and t.thang = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;

  return jsonb_build_object('ym', v_ym, 'so_du', v_so_du, 'lich_su_mua', v_mua, 'hoat_dong', v_hoat_dong);
end $function$
;
