-- Sao lưu thân hàm TRƯỚC khi dọn bản đồ cũ (28/10). Chạy lại file này để khôi phục.

-- _btyeu_dang_con_yeu(p_case uuid)
CREATE OR REPLACE FUNCTION public._btyeu_dang_con_yeu(p_case uuid)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_mon text; v_bd text;
begin
  select y.hoc_sinh_id, y.mon, y.ban_do into v_hs, v_mon, v_bd from bo_tro_yeu y where y.id = p_case;
  if v_hs is null then return; end if;
  return query
    select r.ma_dang, r.ten_dang, r.score, r.n
    from (select * from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, v_mon) where v_bd = 'moi'
          union all select * from public.fn_btyeu_dang_yeu_2_cua_so(v_hs, v_mon) where v_bd is distinct from 'moi') r
    where exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = p_case and d.ma_dang = r.ma_dang and d.day_at is not null);
end $function$
;

-- fn_btyeu_fill_dang_yeu(p_case uuid)
CREATE OR REPLACE FUNCTION public.fn_btyeu_fill_dang_yeu(p_case uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_mon text; v_bd text; v_n integer := 0; r record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hoc_sinh_id, mon, ban_do into v_hs, v_mon, v_bd from bo_tro_yeu where id = p_case and trang_thai = 'dang_xu';
  if v_hs is null then raise exception 'Case không mở.'; end if;
  -- ca mở SAU khi bật mastery bản đồ mới ⇒ dạng yếu theo bản đồ mới; ca cũ chạy hết theo bản đồ cũ (Thùy 24/10)
  for r in select * from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, v_mon) where v_bd = 'moi'
           union all select * from public.fn_btyeu_dang_yeu_2_cua_so(v_hs, v_mon) where v_bd is distinct from 'moi' loop
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
      values (p_case, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
    if found then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $function$
;

-- fn_botro_ket_qua_tuan(p_tu date, p_den date)
CREATE OR REPLACE FUNCTION public.fn_botro_ket_qua_tuan(p_tu date, p_den date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
end $function$
;

-- fn_btyeu_de_xuat_dang_moi(p_mon text, p_case uuid, p_thuc_hien boolean)
CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at, y.ban_do from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n, 'cu'::text as ban_do from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs where ban_do is distinct from 'moi'), true) c
            where c.muc = 'yeu'
            union all  -- ca mở sau khi bật bản đồ mới (Thùy 24/10)
            select c.hoc_sinh_id, c.ma_dang, c.score, c.n, 'moi' from public.fn_mastery_cells_bdm((select array_agg(hoc_sinh_id) from cs where ban_do = 'moi'), true) c
            where c.muc = 'yeu'),
      -- 12/10: dạng CÓ ĐO sau khi mở case, tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — 1 lần cho mỗi cặp câu–mã chép của từng case
      gan as materialized (
        select cs.case_id, case when cs.ban_do = 'moi' then public._do_o_bdm(d.ma_cau, d.ma_dang) else public._do_nhom_cua_o(d.ma_cau, d.ma_dang) end as md
        from cs cross join lateral (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang is not null and g.graded_at > cs.created_at) d)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id and m.ban_do = case when cs.ban_do = 'moi' then 'moi' else 'cu' end
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gan where gan.case_id = cs.case_id and gan.md = m.ma_dang)
      order by cs.case_id, (m.n >= 3) desc, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
    -- 14/10: bài mô hình Hình yếu, có đo SAU khi mở case (ET/BTVN/MT) hoặc từ kết quả bổ trợ — cùng luật dạng thường.
    for r in
      select y.id as case_id, y.hoc_sinh_id, hb.ma as ma_dang, public._kho_ten_dang(v_mon, hb.ma) as ten_dang, h.score, h.n
      from bo_tro_yeu y
      cross join lateral public.fn_mastery_cells_hinh(array[y.hoc_sinh_id], true) h
      join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = v_mon
      where y.mon = v_mon and y.trang_thai = 'dang_xu' and (p_case is null or y.id = p_case) and h.muc = 'yeu'
        and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.ma_dang = hb.ma)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = y.hoc_sinh_id and p.hinh_baitoan_id = hb.id and g.graded_at > y.created_at)
      order by y.id, (h.n >= 2) desc, h.score
    loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $function$
;

-- fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_nhom_cua_o(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
  -- 14/10: dạng = bài mô hình Hình (ma_dang = hinh_baitoan.ma) — yếu + có đo trong 2 cửa sổ gần nhất, cùng luật "cứ yếu là bổ trợ".
  return query
    select hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public.fn_mastery_cells_hinh(array[p_hs], true) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = p_hs and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc)
    order by (h.n >= 2) desc, h.score;
end $function$
;

-- fn_mastery_rollup(p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone)
CREATE OR REPLACE FUNCTION public.fn_mastery_rollup(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, dat bigint, can_luyen bigint, yeu bigint, tin_thap bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select c.hoc_sinh_id,
         count(*) filter (where c.muc = 'dat'),
         count(*) filter (where c.muc = 'can_luyen'),
         count(*) filter (where c.muc = 'yeu'),
         count(*) filter (where c.tin = 'thap')
  from public.fn_mastery_cells(p_hs, p_include_btvn, p_since) c
  group by c.hoc_sinh_id
$function$
;

-- fn_mastery_cells(p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_window integer, p_tin_cao integer, p_tin_tb integer, p_den timestamp with time zone)
CREATE OR REPLACE FUNCTION public.fn_mastery_cells(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = _do_nhom_cua_o(câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as (
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  ),
  mg as (
    select mf.hoc_sinh_id, cap.nhom as ma_dang, mf.value, mf.t, mf.src
    from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           -- Độ tin scale cùng tỉ lệ (3/2 thay 5/3) — cùng bộ số với Hình–Luyện (fn_mastery_cells_hinh, 21/08).
           -- "Là Hình–Học" = dạng nằm trong hinh_hoc_bai (KP = bài học). Đại / Hình giải tích giữ nguyên tham số.
           case when hh.ma_bai is not null then least(p_window, 3)  else p_window  end as cs,
           case when hh.ma_bai is not null then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh.ma_bai is not null then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from mg mf
    left join hinh_hoc_bai hh on hh.ma_bai = mf.ma_dang
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$function$
;

