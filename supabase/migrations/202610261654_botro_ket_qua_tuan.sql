-- Thùy 26/10: "cần biết kết quả của bổ trợ — từng học sinh bổ trợ đã đạt được gì sau ca, ở tab Dashboard; bấm vào số ca ra chi tiết từng ca".
-- fn_botro_ket_qua_tuan(từ, đến): mọi ca BỔ TRỢ YẾU DIỄN RA (em có mặt) trong khoảng ngày — mỗi (ca × em): dạng ĐÃ HỌC, luyện/test cuối ca
-- đúng/tổng theo dạng, trạng thái dạng TRƯỚC ca (đo đến 00:00 ngày ca, p_den của fn_mastery_cells) và HIỆN NAY, nhãn tiến bộ.
-- "Giảm dạng yếu" = dạng yếu TRƯỚC ca → nay không còn yếu (so cùng một thước đo mastery, theo bản đồ của case). Dạng không yếu trước ca không tính là giảm.
-- Dạng ĐÃ HỌC = dạng case đánh dấu học ở buổi đó (bo_tro_yeu_dang.day_buoi_id) HOẶC dạng em đã trả lời ≥1 câu trong buổi (ca đang dở chưa đánh dấu).
-- Tính theo LÔ (mastery 1 lần/ngày-ca cho cả tuần) — nhanh hơn ~5 lần so với đo từng case. Chỉ nhân sự.

-- Danh sách (ca × em) bổ trợ yếu có mặt trong khoảng ngày.
create or replace function public._botro_ca_yeu_tuan(p_tu date, p_den date)
returns table(buoi uuid, ngay date, gio time, hs uuid, case_id uuid, ban_do text, mon text, nguoi_day uuid, hoan_tat boolean)
language sql stable security definer set search_path to 'public' as $$
  select b.id, b.ngay, b.gio_bat_dau, hh.hoc_sinh_id, y.id, y.ban_do, y.mon, b.nguoi_day_tg, b.danh_gia_xong_at is not null
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.diem_danh = 'co_mat'
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.loai = 'bo_tro_yeu' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den
$$;

create or replace function public.fn_botro_ket_qua_tuan(p_tu date, p_den date)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_truoc jsonb := '[]'::jsonb; v_nay jsonb := '[]'::jsonb; r record; v_ts timestamptz; v_out jsonb;
  v_hs_moi uuid[]; v_hs_cu uuid[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_tu is null or p_den is null or p_den < p_tu or p_den - p_tu > 31 then raise exception 'Khoảng ngày không hợp lệ (tối đa 32 ngày).'; end if;

  -- TRƯỚC ca: mastery đo đến 00:00 (giờ VN) ngày ca, gom theo (ngày, bản đồ)
  for r in select c.ngay, (c.ban_do = 'moi') as la_moi, array_agg(distinct c.hs) as hs from public._botro_ca_yeu_tuan(p_tu, p_den) c group by 1, 2 loop
    v_ts := r.ngay::timestamp at time zone 'Asia/Ho_Chi_Minh';
    if r.la_moi then
      v_truoc := v_truoc || coalesce((select jsonb_agg(jsonb_build_object('hs', m.hoc_sinh_id, 'ngay', r.ngay, 'ma_dang', m.ma_dang, 'muc', m.muc, 'score', m.score, 'n', m.n))
                                      from public.fn_mastery_cells_bdm(r.hs, true, p_den => v_ts) m), '[]'::jsonb);
    else
      v_truoc := v_truoc || coalesce((select jsonb_agg(jsonb_build_object('hs', m.hoc_sinh_id, 'ngay', r.ngay, 'ma_dang', m.ma_dang, 'muc', m.muc, 'score', m.score, 'n', m.n))
                                      from public.fn_mastery_cells(r.hs, true, p_den => v_ts) m), '[]'::jsonb);
    end if;
  end loop;

  -- HIỆN NAY: 1 lần cho mỗi bản đồ
  select array_agg(distinct c.hs) filter (where c.ban_do = 'moi'), array_agg(distinct c.hs) filter (where c.ban_do is distinct from 'moi')
    into v_hs_moi, v_hs_cu from public._botro_ca_yeu_tuan(p_tu, p_den) c;
  if v_hs_moi is not null then
    v_nay := v_nay || coalesce((select jsonb_agg(jsonb_build_object('hs', m.hoc_sinh_id, 'ma_dang', m.ma_dang, 'muc', m.muc, 'score', m.score, 'n', m.n)) from public.fn_mastery_cells_bdm(v_hs_moi, true) m), '[]'::jsonb);
  end if;
  if v_hs_cu is not null then
    v_nay := v_nay || coalesce((select jsonb_agg(jsonb_build_object('hs', m.hoc_sinh_id, 'ma_dang', m.ma_dang, 'muc', m.muc, 'score', m.score, 'n', m.n)) from public.fn_mastery_cells(v_hs_cu, true) m), '[]'::jsonb);
  end if;

  with ca as materialized (select * from public._botro_ca_yeu_tuan(p_tu, p_den)),
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
  ny as (select (x ->> 'hs')::uuid hs, x ->> 'ma_dang' ma_dang, x ->> 'muc' muc, (x ->> 'score')::numeric score, (x ->> 'n')::int n from jsonb_array_elements(v_nay) x),
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
      left join ny on ny.hs = ca.hs and ny.ma_dang = h.ma_dang
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
      'so_ca_huy', (select count(*) from buoi_hoc b where b.loai = 'bo_tro_yeu' and b.trang_thai = 'huy' and b.ngay between p_tu and p_den),
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
end $$;

revoke execute on function public._botro_ca_yeu_tuan(date, date), public.fn_botro_ket_qua_tuan(date, date) from public, anon;
grant execute on function public.fn_botro_ket_qua_tuan(date, date) to authenticated;
