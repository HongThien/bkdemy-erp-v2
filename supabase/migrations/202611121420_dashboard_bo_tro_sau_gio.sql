-- ============================================================================
-- 202611121420 — dashboard_bo_tro_sau_gio
-- VÌ SAO (Thùy 12/11): "bổ trợ sau giờ là 1 loại bổ trợ riêng như Yếu, cần có dashboard, detail như bổ trợ yếu".
--   (1) Tiến độ bổ trợ (fn_bo_tro_dashboard_tuan): thêm loại bo_tro_nhe. Sau giờ TA không điểm danh ⇒ nộp test = hoàn tất (nộp ghi có mặt +
--       danh_gia_xong), đã in test chưa nhập = đang dở, ca huỷ = không diễn ra, quá ngày chưa in test = quá ngày. Lớp lấy từ ca_bo_tro_nhe.
--   (2) Kết quả trước → sau ca: tách _botro_ca_tuan / fn_botro_ket_qua_tuan_loai theo LOẠI (yếu | sau giờ) — cùng 1 công thức;
--       fn_botro_ket_qua_tuan + _botro_ca_yeu_tuan giữ chữ ký, gọi bản theo loại với 'bo_tro_yeu' (Yếu không đổi kết quả).
-- MẤT GÌ (Luật xoá): không mất gì — create or replace + thêm 2 hàm.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_bo_tro_dashboard_tuan(p_den date DEFAULT NULL::date, p_so_tuan integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with hn as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as ngay),
  moc as (select date_trunc('week', coalesce(p_den, (select ngay from hn))::timestamp)::date as t2_cuoi,
                 greatest(1, least(coalesce(p_so_tuan, 3), 12)) as n),
  tuan as (select (m.t2_cuoi - 7 * g.i) as tu, (m.t2_cuoi - 7 * g.i + 6) as den, g.i as lui
           from moc m cross join lateral generate_series(0, m.n - 1) as g(i)),
  luot as (
    select t.tu, b.loai, b.id as buoi_id, b.ngay, b.gio_bat_dau, b.ly_do_huy, hs.ho_ten, hs.ma_hs,
           coalesce(ns.ho_ten, ns2.ho_ten) as nguoi,
           coalesce(
             (select l.ten_lop from buoi_hoc g join lop l on l.id = g.lop_id where g.id = hh.bu_cho_buoi_id),
             (select l.ten_lop from bo_tro_duoi d join lop l on l.id = d.lop_id where d.id = hh.bo_tro_duoi_id),
             (select l.ten_lop from bo_tro_yeu y join hoc_sinh_lop hl on hl.hoc_sinh_id = y.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                join lop l on l.id = hl.lop_id and l.mon = y.mon where y.id = hh.bo_tro_yeu_id order by hl.ngay_vao desc limit 1),
             (select l.ten_lop from bo_tro_hinh yh join hoc_sinh_lop hl on hl.hoc_sinh_id = yh.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                join lop l on l.id = hl.lop_id and l.mon = yh.mon where yh.id = hh.bo_tro_hinh_id order by hl.ngay_vao desc limit 1),
             (select l.ten_lop from ca_bo_tro_nhe cn join lop l on l.id = cn.lop_id where cn.id = b.ca_bo_tro_nhe_id)) as lop,   -- 12/11 sau giờ
           case
             when b.trang_thai = 'huy' and b.ly_do_huy ilike 'OPS gỡ%' then 'go'
             when hh.diem_danh = 'vang' then 'vang'
             -- 12/11 SAU GIỜ: TA không điểm danh — nộp test = hoàn tất; đã in test chưa nhập = đang dở
             when b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.danh_gia_xong_at is null
                  and exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test') then 'dang_do'
             when hh.diem_danh = 'co_mat' or b.trang_thai = 'hoan_tat' or (b.danh_gia_xong_at is not null and b.trang_thai <> 'huy')
               then case when b.danh_gia_xong_at is not null or b.trang_thai = 'hoan_tat' then 'hoan_tat' else 'dang_do' end
             when b.trang_thai = 'huy' then 'khong_dien_ra'
             when b.ngay < (select ngay from hn) then 'qua_han'
             else 'cho' end as tt
    from tuan t
    join buoi_hoc b on b.ngay between t.tu and t.den and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh', 'bo_tro_nhe')
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
    join hoc_sinh hs on hs.id = hh.hoc_sinh_id and hs.trang_thai is distinct from 'test'
    left join nhan_su ns on ns.id = b.nguoi_day_tg
    left join nhan_su ns2 on ns2.id = b.nguoi_day
  ),
  dem as (
    select tu, loai,
           count(*) filter (where tt <> 'go') as chot,
           count(*) filter (where tt in ('hoan_tat', 'dang_do')) as da_chay,
           count(*) filter (where tt = 'hoan_tat') as hoan_tat,
           count(*) filter (where tt = 'dang_do') as dang_do,
           count(*) filter (where tt = 'vang') as vang,
           count(*) filter (where tt = 'khong_dien_ra') as khong_dien_ra,
           count(*) filter (where tt = 'qua_han') as qua_han,
           count(*) filter (where tt = 'cho') as cho,
           count(*) filter (where tt = 'go') as go
    from luot group by tu, loai
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'tu', t.tu, 'den', t.den, 'dang_chay', (select ngay from hn) between t.tu and t.den, 'tuong_lai', t.tu > (select ngay from hn),
    'tong', (select jsonb_build_object('chot', coalesce(sum(d.chot), 0), 'da_chay', coalesce(sum(d.da_chay), 0)) from dem d where d.tu = t.tu),
    'loai', (select coalesce(jsonb_object_agg(k.loai, jsonb_build_object(
               'chot', coalesce(d.chot, 0), 'da_chay', coalesce(d.da_chay, 0), 'hoan_tat', coalesce(d.hoan_tat, 0), 'dang_do', coalesce(d.dang_do, 0),
               'vang', coalesce(d.vang, 0), 'khong_dien_ra', coalesce(d.khong_dien_ra, 0), 'qua_han', coalesce(d.qua_han, 0),
               'cho', coalesce(d.cho, 0), 'go', coalesce(d.go, 0))), '{}'::jsonb)
             from (values ('bo_tro_yeu'), ('bu'), ('bo_tro_duoi'), ('bo_tro_hinh'), ('bo_tro_nhe')) k(loai) left join dem d on d.tu = t.tu and d.loai = k.loai),
    'ds', (select coalesce(jsonb_agg(jsonb_build_object('loai', l.loai, 'tt', l.tt, 'buoi_id', l.buoi_id, 'ngay', l.ngay, 'gio_bat_dau', l.gio_bat_dau,
               'ho_ten', l.ho_ten, 'ma_hs', l.ma_hs, 'lop', l.lop, 'nguoi', l.nguoi, 'ly_do', l.ly_do_huy)
               order by l.ngay, l.gio_bat_dau nulls last, l.ho_ten), '[]'::jsonb) from luot l where l.tu = t.tu)
  ) order by t.tu desc), '[]'::jsonb) end
  from tuan t
$function$;

CREATE OR REPLACE FUNCTION public._botro_ca_tuan(p_tu date, p_den date, p_loai text)
 RETURNS TABLE(buoi uuid, ngay date, gio time without time zone, hs uuid, case_id uuid, ban_do text, mon text, nguoi_day uuid, hoan_tat boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select b.id, b.ngay, b.gio_bat_dau, hh.hoc_sinh_id, y.id, y.ban_do, y.mon, b.nguoi_day_tg, b.danh_gia_xong_at is not null
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.diem_danh = 'co_mat'
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.loai = p_loai and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den
$function$;

CREATE OR REPLACE FUNCTION public.fn_botro_ket_qua_tuan_loai(p_tu date, p_den date, p_loai text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_truoc jsonb := '[]'::jsonb; v_nay jsonb := '[]'::jsonb; r record; v_ts timestamptz; v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('bo_tro_yeu', 'bo_tro_nhe') then raise exception 'Loại phải là bo_tro_yeu | bo_tro_nhe.'; end if;
  if p_tu is null or p_den is null or p_den < p_tu or p_den - p_tu > 31 then raise exception 'Khoảng ngày không hợp lệ (tối đa 32 ngày).'; end if;

  -- TRƯỚC ca: mastery đo đến 00:00 (giờ VN) ngày ca; SAU ca: đo đến hết ngày ca (khoá theo ngày ca, Thùy 28/10)
  for r in select c.ngay, array_agg(distinct c.hs) as hs from public._botro_ca_tuan(p_tu, p_den, p_loai) c group by 1 loop
    v_ts := r.ngay::timestamp at time zone 'Asia/Ho_Chi_Minh';
      v_truoc := v_truoc || coalesce((select jsonb_agg(jsonb_build_object('hs', m.hoc_sinh_id, 'ngay', r.ngay, 'ma_dang', m.ma_dang, 'muc', m.muc, 'score', m.score, 'n', m.n))
                                      from public.fn_mastery_cells_bdm(r.hs, true, p_den => v_ts) m), '[]'::jsonb);
    -- SAU ca: mastery đo đến HẾT ngày ca (gồm luyện + test của chính ca; không gồm lần đo từ hôm sau) — kết quả CỐ ĐỊNH, không đổi theo lúc xem
    v_nay := v_nay || coalesce((select jsonb_agg(jsonb_build_object('hs', m.hoc_sinh_id, 'ngay', r.ngay, 'ma_dang', m.ma_dang, 'muc', m.muc, 'score', m.score, 'n', m.n))
                                from public.fn_mastery_cells_bdm(r.hs, true, p_den => ((r.ngay + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh')) m), '[]'::jsonb);
  end loop;

  with ca as materialized (select * from public._botro_ca_tuan(p_tu, p_den, p_loai)),
  hoc as (   -- dạng đã học của từng (ca × em)
    select ca.buoi, ca.hs, d.ma_dang from ca join bo_tro_yeu_dang d on d.bo_tro_yeu_id = ca.case_id and d.day_buoi_id = ca.buoi
    union
    select ca.buoi, ca.hs, c.ma_dang
      from ca join bai_test bt on bt.buoi_hoc_id = ca.buoi and bt.loai in ('bo_tro', 'bo_tro_test')
      join bai_test_cau c on c.bai_test_id = bt.id and c.ma_dang is not null
      join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = ca.hs
      join bai_lam_cau blc on blc.bai_lam_id = bl.id and blc.bai_test_cau_id = c.id
  ),
  kq as (    -- luyện / test đúng-tổng theo (ca × em × dạng)
    select ca.buoi, ca.hs, c.ma_dang, bt.loai,
           count(*) as tong, count(*) filter (where blc.verdict = 'correct') as dung
      from ca join bai_test bt on bt.buoi_hoc_id = ca.buoi and bt.loai in ('bo_tro', 'bo_tro_test')
      join bai_test_cau c on c.bai_test_id = bt.id and c.ma_dang is not null
      join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = ca.hs
      join bai_lam_cau blc on blc.bai_lam_id = bl.id and blc.bai_test_cau_id = c.id
     group by 1, 2, 3, 4
  ),
  tr as (select (x ->> 'hs')::uuid hs, (x ->> 'ngay')::date ngay, x ->> 'ma_dang' ma_dang, x ->> 'muc' muc, (x ->> 'score')::numeric score, (x ->> 'n')::int n from jsonb_array_elements(v_truoc) x),
  ny as (select (x ->> 'hs')::uuid hs, (x ->> 'ngay')::date ngay, x ->> 'ma_dang' ma_dang, x ->> 'muc' muc, (x ->> 'score')::numeric score, (x ->> 'n')::int n from jsonb_array_elements(v_nay) x),
  ct as (    -- (ca × em × dạng) kèm trước/nay + nhãn tiến bộ
    select ca.buoi, ca.hs, h.ma_dang,
           tr.muc as truoc_muc, tr.score as truoc_score, tr.n as truoc_n, ny.muc as nay_muc, ny.score as nay_score, ny.n as nay_n,
           coalesce((select k.dung from kq k where k.buoi = ca.buoi and k.hs = ca.hs and k.ma_dang = h.ma_dang and k.loai = 'bo_tro'), 0) as luyen_dung,
           coalesce((select k.tong from kq k where k.buoi = ca.buoi and k.hs = ca.hs and k.ma_dang = h.ma_dang and k.loai = 'bo_tro'), 0) as luyen_tong,
           coalesce((select k.dung from kq k where k.buoi = ca.buoi and k.hs = ca.hs and k.ma_dang = h.ma_dang and k.loai = 'bo_tro_test'), 0) as test_dung,
           coalesce((select k.tong from kq k where k.buoi = ca.buoi and k.hs = ca.hs and k.ma_dang = h.ma_dang and k.loai = 'bo_tro_test'), 0) as test_tong,
           case when tr.muc is null then 'chua_do'
                when tr.muc = 'yeu' and coalesce(ny.muc, 'khong_o') <> 'yeu' then 'giam'
                when tr.muc = 'yeu' then 'van_yeu'
                else 'khac' end as tien_bo,
           public._kho_ten_dang(ca.mon, h.ma_dang) as ten_dang
      from ca join hoc h on h.buoi = ca.buoi and h.hs = ca.hs
      left join tr on tr.hs = ca.hs and tr.ngay = ca.ngay and tr.ma_dang = h.ma_dang
      left join ny on ny.hs = ca.hs and ny.ngay = ca.ngay and ny.ma_dang = h.ma_dang
  ),
  moi_em as (   -- mỗi (em × dạng) tính MỘT lần cho tóm tắt (em học cùng dạng ở 2 buổi trong tuần không bị đếm đôi)
    select distinct on (hs, ma_dang) hs, ma_dang, truoc_muc, nay_muc, tien_bo from ct order by hs, ma_dang, (tien_bo = 'giam') desc
  ),
  em_ca as (
    select ca.buoi, ca.ngay, ca.gio, ca.hs, ca.case_id, ca.mon, ca.nguoi_day, ca.hoan_tat,
           h.ho_ten, h.ma_hs, h.khoi,
           (select string_agg(l.ten_lop, ', ' order by l.ten_lop) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = ca.hs and hl.trang_thai = 'dang_hoc' and l.mon = ca.mon) as lop,
           y.created_at::date as mo_ngay, y.trang_thai as case_tt, y.ket_qua as case_kq,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = ca.case_id) as so_dang_case,
           exists (select 1 from bai_test t where t.buoi_hoc_id = ca.buoi and t.loai = 'bo_tro_test') as co_test,
           exists (select 1 from bai_test t join bai_lam bl on bl.bai_test_id = t.id and bl.trang_thai = 'da_nop' where t.buoi_hoc_id = ca.buoi and t.loai = 'bo_tro_test' and bl.hoc_sinh_id = ca.hs) as test_da_nop,
           (select jsonb_build_object('nguon', td.nguon, 'trang_thai', td.trang_thai, 'vao_at', td.vao_at) from bo_tro_theo_doi td where td.hoc_sinh_id = ca.hs and td.mon = ca.mon order by td.vao_at desc limit 1) as theo_doi
      from ca join hoc_sinh h on h.id = ca.hs join bo_tro_yeu y on y.id = ca.case_id
  )
  select jsonb_build_object(
    'tu', p_tu, 'den', p_den,
    'tom_tat', jsonb_build_object(
      'so_ca', (select count(distinct buoi) from em_ca),
      'so_ca_co_hoc', (select count(distinct buoi) from ct),
      'so_ca_huy', (select count(*) from buoi_hoc b where b.loai = p_loai and b.trang_thai = 'huy' and b.ngay between p_tu and p_den),
      'so_hs', (select count(distinct hs) from em_ca),
      'so_hs_co_hoc', (select count(distinct hs) from ct),
      'so_dang_hoc', (select count(*) from moi_em),
      'so_dang_yeu_truoc', (select count(*) from moi_em where truoc_muc = 'yeu'),
      'so_dang_giam', (select count(*) from moi_em where tien_bo = 'giam'),
      'so_dang_van_yeu', (select count(*) from moi_em where tien_bo = 'van_yeu'),
      'so_dang_khong_yeu_truoc', (select count(*) from moi_em where tien_bo = 'khac'),
      'so_dang_chua_do_truoc', (select count(*) from moi_em where tien_bo = 'chua_do'),
      'so_dang_con_yeu_nay', (select count(*) from moi_em where nay_muc = 'yeu'),
      'so_hs_co_giam', (select count(distinct hs) from moi_em where tien_bo = 'giam'),
      'so_hs_het_yeu_dang_hoc', (select count(distinct hs) from moi_em where hs not in (select hs from moi_em where nay_muc = 'yeu')),
      'so_hs_con_yeu', (select count(distinct hs) from moi_em where nay_muc = 'yeu'),
      'luyen_dung', (select coalesce(sum(dung), 0) from kq where loai = 'bo_tro'), 'luyen_tong', (select coalesce(sum(tong), 0) from kq where loai = 'bo_tro'),
      'test_dung', (select coalesce(sum(dung), 0) from kq where loai = 'bo_tro_test'), 'test_tong', (select coalesce(sum(tong), 0) from kq where loai = 'bo_tro_test')
    ),
    'ca', coalesce((select jsonb_agg(jsonb_build_object(
        'buoi_id', e.buoi, 'ngay', e.ngay, 'gio_bat_dau', e.gio, 'hoc_sinh_id', e.hs, 'ho_ten', e.ho_ten, 'ma_hs', e.ma_hs, 'khoi', e.khoi, 'lop', e.lop,
        'nguoi_day', (select n.ho_ten from nhan_su n where n.id = e.nguoi_day), 'hoan_tat', e.hoan_tat,
        'mo_ngay', e.mo_ngay, 'case_tt', e.case_tt, 'case_kq', e.case_kq, 'so_dang_case', e.so_dang_case,
        'co_test', e.co_test, 'test_da_nop', e.test_da_nop, 'theo_doi', e.theo_doi,
        'dang', coalesce((select jsonb_agg(jsonb_build_object(
              'ma_dang', c.ma_dang, 'ten_dang', coalesce(c.ten_dang, c.ma_dang), 'tien_bo', c.tien_bo,
              'truoc_muc', c.truoc_muc, 'truoc_score', c.truoc_score, 'truoc_n', c.truoc_n, 'nay_muc', c.nay_muc, 'nay_score', c.nay_score, 'nay_n', c.nay_n,
              'luyen_dung', c.luyen_dung, 'luyen_tong', c.luyen_tong, 'test_dung', c.test_dung, 'test_tong', c.test_tong)
            order by (c.tien_bo = 'van_yeu') desc, (c.tien_bo = 'giam') desc, c.ten_dang) from ct c where c.buoi = e.buoi and c.hs = e.hs), '[]'::jsonb))
      order by e.ngay, e.gio, e.ho_ten) from em_ca e), '[]'::jsonb)
  ) into v_out;
  return v_out;
end $function$;

-- hàm cũ của Yếu giữ nguyên chữ ký, đi qua hàm theo loại (1 nguồn công thức)
create or replace function public.fn_botro_ket_qua_tuan(p_tu date, p_den date)
returns jsonb language sql stable security definer set search_path to 'public' as $$ select public.fn_botro_ket_qua_tuan_loai(p_tu, p_den, 'bo_tro_yeu') $$;
create or replace function public._botro_ca_yeu_tuan(p_tu date, p_den date)
returns table(buoi uuid, ngay date, gio time, hs uuid, case_id uuid, ban_do text, mon text, nguoi_day uuid, hoan_tat boolean)
language sql stable security definer set search_path to 'public' as $$ select * from public._botro_ca_tuan(p_tu, p_den, 'bo_tro_yeu') $$;
revoke execute on function public._botro_ca_tuan(date, date, text) from public, anon;
revoke execute on function public.fn_botro_ket_qua_tuan_loai(date, date, text) from public, anon;
grant execute on function public.fn_botro_ket_qua_tuan_loai(date, date, text) to authenticated;
