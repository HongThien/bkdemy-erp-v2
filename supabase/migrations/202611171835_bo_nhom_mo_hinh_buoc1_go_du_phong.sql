-- Bỏ tầng NHÓM MÔ HÌNH — bước 1/2: gỡ phần dự phòng qua nhóm trong 6 hàm (Thùy 17/11 "bỏ tầng này, xoá hẳn").
-- Đo 17/11 trước khi viết: 27/27 mô hình có nhóm đều có chu_de_id riêng, khớp chu_de của nhóm (0 thiếu, 0 lệch) ⇒ nhánh dự phòng
-- trong _dbht_cau / _dgcc_nut chưa bao giờ đổi kết quả. fn_bc_ky_tinh: báo cáo mới dùng mã 'H:<mô hình>'; 17 báo cáo đã nộp có mục
-- 'H:<nhóm>' đều đã lưu sẵn tên trong du_lieu ⇒ không cần tra bảng nhóm. _tl_hl_dong_bo_bai: phần mô hình mới đặt cạnh phần đang chứa bài.
-- Thân hàm = pg_get_functiondef bản đang chạy 17/11, chỉ thay đúng các dòng nhóm. Bước 2 (drop bảng/cột/trigger/hàm nhóm) áp SAU khi
-- client không còn đọc nhom_mh_id được deploy: supabase/cho-ap/bo_nhom_mo_hinh_buoc2.sql.

CREATE OR REPLACE FUNCTION public._bdm_chu_de_co_noi_dung(p_id text)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select exists (select 1 from dai_bdm_o where chu_de_id = p_id)
      or exists (select 1 from dai_bdm_nhom where chu_de_id = p_id)
      or exists (select 1 from hinh_hoc_bai where chu_de_id = p_id)
      or exists (select 1 from hinh_mo_hinh where chu_de_id = p_id)
      or exists (select 1 from dai_bdm_kho_ds where chu_de_id = p_id)
      or exists (select 1 from hgt_bdm_kho_ds where chu_de_id = p_id)
$function$;

CREATE OR REPLACE FUNCTION public._dbht_cau(p_hs uuid[], p_tu date, p_mon text)
 RETURNS TABLE(hoc_sinh_id uuid, ngay date, t timestamp with time zone, kenh text, luot text, thu_tu integer, ma_cau text, gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text, chu_de_id text, ten_dang text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy (+ bản sao câu app — ngày = ngày nộp)
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           sp.hinh_baitoan_id as bt_id,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang, null::uuid,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  k as (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd, bt_id from m),
  -- HÌNH: nhận diện + quy về mô hình / bài học
  hk as materialized (
    select k.kc, k.kd, k.bt_id,
           coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id) as mh_id,
           public.fn_hl_goc_mo_hinh(coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id)) as goc_id,   -- 09/11: gốc tính 1 lần mỗi khoá
           coalesce(bt1.id, bt2.id) as bt_ref,
           coalesce(hc.dang_chinh, hb.ma_bai) as hh_bai
      from k
      left join hinh_baitoan bt1 on bt1.id = k.bt_id
      left join hinh_baitoan bt2 on k.bt_id is null and bt2.ma = nullif(k.kd, '')
      left join hinh_hoc_cau_hoi hc on hc.ma_cau = nullif(k.kc, '')
      left join hinh_hoc_bai hb on hb.ma_bai = nullif(k.kd, '')
     where bt1.id is not null or bt2.id is not null or hc.ma_cau is not null or hb.ma_bai is not null
  ),
  -- ⭐ 09/11 (spec-hinh-cay-nhanh §13.1/§13.5/§13.6 bước 1): tầng Hình = Chủ đề → MÔ HÌNH (cấp chuyên đề, thay nhóm mô hình)
  --   → TRỌNG ĐIỂM (cấp nhóm). Nốt quy về mô hình GỐC của cây (trước đây lấy thẳng nút chứa nốt ⇒ nốt ở nhánh rơi vào 'HINH').
  --   Cấp nhóm: nốt trong thành viên nhóm bài ⇒ 'H:N:<nút nhóm>' · nốt trọng điểm ⇒ 'H:T:<nốt>' · còn lại ⇒ 'H:<gốc>'.
  hcap as (
    select hk.kc, hk.kd, hk.bt_id,
           coalesce(case when mh.vai = 'thanh_vien' then 'H:N:' || (select c.cha_id::text from hinh_mo_hinh_cha c where c.mo_hinh_id = mh.id limit 1) end,
                    case when btr.la_trong_diem then 'H:T:' || btr.id::text end,
                    'H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as nhom_id,
           coalesce('H:' || g.id::text, 'HH:' || hhb.ma_bai, 'HINH') as chuyen_de_id,
           coalesce('H:' || coalesce(g.chu_de_id, hhb.chu_de_id), 'HINH') as chu_de_id,
           coalesce(mh.ten, hhb.ten_bai, 'Hình') as ten_dang
      from hk
      left join hinh_mo_hinh mh on mh.id = hk.mh_id
      left join hinh_baitoan btr on btr.id = hk.bt_ref
      left join hinh_mo_hinh g on g.id = hk.goc_id
      left join hinh_hoc_bai hhb on hhb.ma_bai = hk.hh_bai
  ),
  -- KHTN (04/11): dạng bài bản đồ mới KHTN — cùng luật quy câu với tổng quan HS (`_khtn_do_o_bdm`)
  kk as (
    select k.kc, k.kd, k.bt_id, public._khtn_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._khtn_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- Vật lý (12/11): như KHTN
  k_vatly as (
    select k.kc, k.kd, k.bt_id, public._vatly_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._vatly_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- Hóa học (12/11): như KHTN
  k_hoahoc as (
    select k.kc, k.kd, k.bt_id, public._hoahoc_do_o_bdm(nullif(k.kc, ''), nullif(k.kd, '')) as o
      from k
     where (k.kc <> '' or k.kd <> '') and k.bt_id is null
       and public._hoahoc_la_lan_do(nullif(k.kc, ''), nullif(k.kd, ''))
  ),
  -- ĐẠI + HGT: dạng bài bản đồ mới (cấp 1 cũng theo bản đồ mới)
  dcap as (
    select k.kc, k.kd, k.bt_id, public._do_o_bdm_core(nullif(k.kc, ''), nullif(k.kd, ''), false) as o
      from k
     where (k.kc <> '' or k.kd <> '')
       and not exists (select 1 from hcap where hcap.kc = k.kc and hcap.kd = k.kd and hcap.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from kk where kk.kc = k.kc and kk.kd = k.kd and kk.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from k_vatly z where z.kc = k.kc and z.kd = k.kd and z.bt_id is not distinct from k.bt_id)
       and not exists (select 1 from k_hoahoc z where z.kc = k.kc and z.kd = k.kd and z.bt_id is not distinct from k.bt_id)
  ),
  cap as (
    select dcap.kc, dcap.kd, dcap.bt_id, db.id as dang_bai_id, n.id as nhom_id, n.chuyen_de_id, n.chu_de_id, db.ten as ten_dang
      from dcap join dai_bdm_dang_bai db on db.id = dcap.o join dai_bdm_nhom n on n.id = db.nhom_id
    union all
    select kk.kc, kk.kd, kk.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from kk join khtn_bdm_dang_bai db on db.id = kk.o join khtn_bdm_nhom n on n.id = db.nhom_id
    union all
    select z.kc, z.kd, z.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from k_vatly z join vatly_bdm_dang_bai db on db.id = z.o join vatly_bdm_nhom n on n.id = db.nhom_id
    union all
    select z.kc, z.kd, z.bt_id, db.id, n.id, n.chuyen_de_id, n.chu_de_id, db.ten
      from k_hoahoc z join hoahoc_bdm_dang_bai db on db.id = z.o join hoahoc_bdm_nhom n on n.id = db.nhom_id
    union all
    select kc, kd, bt_id, null, nhom_id, chuyen_de_id, chu_de_id, ten_dang from hcap
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri,
         cap.dang_bai_id, cap.nhom_id, cap.chuyen_de_id, cap.chu_de_id, cap.ten_dang
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '') and cap.bt_id is not distinct from m.bt_id
   where p_tu is null or m.ngay >= p_tu
$function$;

CREATE OR REPLACE FUNCTION public._dgcc_nut(p_ma_cau text, p_ma_dang text, p_hbt uuid, p_cu boolean)
 RETURNS TABLE(chu_de text, chuyen_de text, nhom text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mh uuid; v_cd text; v text; v_bai text; i integer := 0;
begin
  -- Hình luyện: bài mô hình → mô hình → chủ đề (của mô hình, nhóm mô hình, hoặc mô hình cha chính)
  if p_hbt is not null then select hb.mo_hinh_id into v_mh from hinh_baitoan hb where hb.id = p_hbt; end if;
  if v_mh is null and p_ma_dang is not null then
    select hb.mo_hinh_id into v_mh from hinh_baitoan hb where hb.ma = p_ma_dang order by hb.id limit 1;
  end if;
  if v_mh is not null then
    loop
      select mh.chu_de_id into v_cd
        from hinh_mo_hinh mh where mh.id = v_mh;
      exit when v_cd is not null or i >= 8;
      select c.cha_id into v_mh from hinh_mo_hinh_cha c where c.mo_hinh_id = v_mh and c.chinh limit 1;
      exit when v_mh is null;
      i := i + 1;
    end loop;
    if v_cd is not null then return query select v_cd, null::text, null::text; end if;
    return;
  end if;

  -- Hình học: câu → bài học → chủ đề; bài học = chuyên đề = nhóm (Thùy 28/10, cùng tên)
  select hb.ma_bai, hb.chu_de_id into v_bai, v_cd from hinh_hoc_bai hb
   where hb.ma_bai = coalesce((select c.dang_chinh from hinh_hoc_cau_hoi c where c.ma_cau = p_ma_cau), p_ma_dang);
  if found then
    return query select v_cd, v_bai, v_bai;
    return;
  end if;

  -- Đại / HGT
  if p_cu then
    v := _do_nhom_cua_o(p_ma_cau, p_ma_dang);
    return query select b.ma_chu_de, b.ma_chuyen_de, null::text from dai_ban_do b
                  where b.ma_dang = v and b.xoa_at is null and not _kho_la_dang_cho(b.ma_dang);
    return;
  end if;
  v := _do_o_bdm(p_ma_cau, p_ma_dang);
  return query select n.chu_de_id, n.chuyen_de_id, n.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where d.id = v;
end $function$;

CREATE OR REPLACE FUNCTION public._phien_hinh_khoi(p_v text)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(
    (select m.khoi from hinh_mo_hinh m where m.id::text = p_v),
    (select m.khoi from hinh_baitoan b join hinh_mo_hinh m on m.id = b.mo_hinh_id where b.id::text = p_v),
    (select b.khoi from hinh_bai b where b.id::text = p_v),
    (select b.khoi from hinh_y y join hinh_bai b on b.id = y.bai_id where y.id::text = p_v),
    (select hb.khoi from hinh_hoc_bai hb where hb.ma_bai = p_v),
    (select hb.khoi from hinh_hoc_cau_hoi c join hinh_hoc_bai hb on hb.ma_bai = c.dang_chinh where c.ma_cau = p_v),
    (select cd.khoi from dai_bdm_chu_de cd where cd.id = p_v and cd.nhanh = 'hinh'))
$function$;

CREATE OR REPLACE FUNCTION public._tl_hl_dong_bo_bai(p_tai_lieu uuid, p_ma_bai text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_mh uuid; r record; v_dich uuid; v_phan uuid; v_doi boolean := false;
begin
  select b.mo_hinh_id into v_mh from hinh_bai b where b.ma_bai = p_ma_bai;
  for r in
    select tc.id, tc.phan_id, p.cha_id, p.loai_phan, p.ref_ma
      from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
     where p.tai_lieu_id = p_tai_lieu and tc.ma_cau = p_ma_bai and p.loai_phan in ('hl_mo_hinh', 'hl_khac')
  loop
    if (v_mh is null and r.loai_phan = 'hl_khac') or (v_mh is not null and r.ref_ma = v_mh::text) then continue; end if;
    v_dich := null;
    if v_mh is null then
      select p.id into v_dich from tai_lieu_phan p where p.cha_id = r.cha_id and p.loai_phan = 'hl_khac' limit 1;
      if v_dich is null then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, cha_id) values (p_tai_lieu, 2147483000, 'hl_khac', r.cha_id) returning id into v_dich;
      end if;
    else
      select p.id into v_dich from tai_lieu_phan p join tai_lieu_phan b on b.id = p.cha_id
       where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'hl_mo_hinh' and p.ref_ma = v_mh::text
       order by (p.cha_id = r.cha_id) desc, b.thu_tu, p.thu_tu limit 1;
      if v_dich is null then
        v_phan := r.cha_id;   -- 17/11: tầng nhóm mô hình đã bỏ ⇒ phần mới đặt cạnh phần đang chứa bài
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (p_tai_lieu, (select coalesce(max(p.thu_tu), 0) + 1 from tai_lieu_phan p where p.cha_id = v_phan and p.loai_phan = 'hl_mo_hinh'), 'hl_mo_hinh', v_mh::text, v_phan)
        returning id into v_dich;   -- sau mô hình cuối phần
        -- _tl_hl_xep đã đánh số lại cả tài liệu ⇒ khối "chưa có mô hình" có thể trùng số với khối mới: đẩy về cuối phần như fn_tl_hl_dat_mo_hinh
        update tai_lieu_phan set thu_tu = 2147483000 where cha_id = v_phan and loai_phan = 'hl_khac';
      end if;
    end if;
    delete from tai_lieu_cau where id = r.id;
    if not exists (select 1 from tai_lieu_cau where phan_id = v_dich and ma_cau = p_ma_bai) then
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu)
      values (v_dich, p_ma_bai, (select coalesce(max(thu_tu), -1) + 1 from tai_lieu_cau where phan_id = v_dich));
    end if;
    v_doi := true;
  end loop;
  if v_doi then
    perform _tl_hl_xep(p_tai_lieu);
    update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  end if;
  return v_doi;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare
  v_ky ky_hoc;
  v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu date; v_het date; v_cuoi date; v_60 date;
  v_lop record; v_hs record; v_gv text; v_bc bao_cao_ph_ky;
  v_out jsonb;
begin
  select * into v_ky from ky_hoc where id = p_ky;
  if v_ky.id is null then raise exception 'Không có kì %', p_ky; end if;
  v_tu   := (v_ky.tu_thang || '-01')::date;
  v_het  := ((v_ky.den_thang || '-01')::date + interval '1 month')::date;
  v_cuoi := least(v_het - 1, v_homnay);
  v_60   := v_cuoi - 59;   -- 60 ngày tính cả ngày cuối (Thùy 04/11: đếm theo LẦN nên nới từ 45)
  select h.id, h.ho_ten, h.ma_hs into v_hs from hoc_sinh h where h.id = p_hs;
  select l.id, l.ten_lop, l.khoi into v_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;
  select ns.ho_ten into v_gv from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
   where pc.lop_id = v_lop.id and pc.vai_tro = 'gv' and pc.la_chinh limit 1;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;

  with c as materialized (
    select x.* from public._dbht_cau(array[p_hs], least(v_tu, v_60), p_mon) x where x.ngay <= v_cuoi
  ),
  dv_cd as (select distinct chu_de_id as ma from c),
  dv_ch as (select distinct chuyen_de_id as ma, chu_de_id as chu_de from c),   -- 1 chuyên đề có thể ở nhiều chủ đề ⇒ theo CẶP
  -- LUẬT ĐÁNH GIÁ (Thùy 04/11, đo trên K9 so với luật đếm câu): đếm theo LẦN đánh giá (1 buổi ET/BTVN/MT hay 1 bài app = 1 lần, nhiều câu
  -- trong lần vẫn 1 phiếu; điểm lần = TB các câu của đơn vị trong lần). Chủ đề: 10 lần gần nhất, trọng số 6-6-4-4-4-4-3-3-3-3; chuyên đề:
  -- 5 lần gần nhất, trọng số 6-4-4-3-3 (lần gần nhất nặng nhất). Cửa sổ 60 ngày cuối kì. Tính cho MỌI em cùng khối × môn ⇒ hạng của em
  -- trong từng đơn vị (chỉ xếp em có lần đánh giá ở đơn vị đó, bằng % thì cùng hạng); % của em lấy từ chính tập này (một nơi tính).
  ds_khoi as (
    select array(select distinct x from unnest(array_agg(hl.hoc_sinh_id) || array[p_hs]) x) as ids
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_lop.khoi
  ),
  ck as materialized (
    select x.* from public._dbht_cau((select ids from ds_khoi), v_60, p_mon) x where x.ngay <= v_cuoi
  ),
  lan_cd as (   -- 1 dòng / (em, chủ đề, lần)
    select hoc_sinh_id, chu_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, luot
  ),
  lan_ch as (   -- 1 dòng / (em, chủ đề, chuyên đề, lần)
    select hoc_sinh_id, chu_de_id as chu_de, chuyen_de_id as ma, luot, avg(gia_tri) as g, max(ngay) as ngay, max(_dbht_kenh_tt(kenh)) as kt, max(t) as t
      from ck group by hoc_sinh_id, chu_de_id, chuyen_de_id, luot
  ),
  r_cd as (select l.*, row_number() over (partition by hoc_sinh_id, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_cd l),
  r_ch as (select l.*, row_number() over (partition by hoc_sinh_id, chu_de, ma order by ngay desc, kt desc, t desc, luot desc) as rn from lan_ch l),
  k_cd as (
    select z.*, rank() over (partition by ma order by p desc)::int as hang, count(*) over (partition by ma)::int as tong
      from (select hoc_sinh_id, ma,
                   round(100 * sum(g * (array[6,6,4,4,4,4,3,3,3,3])[rn]) / sum((array[6,6,4,4,4,4,3,3,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_cd where rn <= 10 group by hoc_sinh_id, ma) z
  ),
  k_ch as (
    select z.*, rank() over (partition by chu_de, ma order by p desc)::int as hang, count(*) over (partition by chu_de, ma)::int as tong
      from (select hoc_sinh_id, chu_de, ma,
                   round(100 * sum(g * (array[6,4,4,3,3])[rn]) / sum((array[6,4,4,3,3])[rn]))::int as p,
                   count(*)::int as n
              from r_ch where rn <= 5 group by hoc_sinh_id, chu_de, ma) z
  ),
  p_cd as (select ma, p, n, hang, tong from k_cd where hoc_sinh_id = p_hs),
  p_ch as (select ma, chu_de, p, n, hang, tong from k_ch where hoc_sinh_id = p_hs),
  t_cd as (
    select dv.ma,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, vatly_cd.ten, hoahoc_cd.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, vatly_cd.thu_tu, hoahoc_cd.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join vatly_bdm_chu_de vatly_cd on vatly_cd.id = dv.ma
      left join hoahoc_bdm_chu_de hoahoc_cd on hoahoc_cd.id = dv.ma
      left join dai_bdm_chu_de dc on dc.id = case when dv.ma like 'H:%' then substr(dv.ma, 3) else dv.ma end
  ),
  -- Tag Cơ bản / Nâng cao cho chuyên đề ĐẠI SỐ (nhánh 'toan'; Hình, HGT, KHTN không tag — Thùy 04/11): theo ĐA SỐ độ khó các dạng bài
  -- của cặp (chủ đề, chuyên đề) trên bản đồ (muc_do ≤3 cơ bản, ≥4 nâng cao — cùng ngưỡng report tháng); hoà ⇒ nâng cao; không dạng nào có độ khó ⇒ không tag.
  tag as (
    select n.chu_de_id as chu_de, n.chuyen_de_id as ma,
           case when count(db.muc_do) = 0 then null
                when count(*) filter (where db.muc_do >= 4) >= count(*) filter (where db.muc_do <= 3) then 'nang_cao' else 'co_ban' end as muc
      from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.nhanh = 'toan'
      join dai_bdm_dang_bai db on db.nhom_id = n.id
     where n.chu_de_id in (select chu_de from dv_ch)
     group by n.chu_de_id, n.chuyen_de_id
  ),
  t_ch as (
    select dv.ma, dv.chu_de,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, vatly_ch.ten, hoahoc_ch.ten, hmh.ten, dch.ten, dv.ma) as ten,
           coalesce(ko.thu_tu, vatly_o.thu_tu, hoahoc_o.thu_tu, hmh.thu_tu, dbo.thu_tu, 9999) as tt
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join vatly_bdm_chuyen_de vatly_ch on vatly_ch.id = dv.ma
      left join hoahoc_bdm_chuyen_de hoahoc_ch on hoahoc_ch.id = dv.ma
      left join hinh_mo_hinh hmh on dv.ma like 'H:%' and hmh.id::text = substr(dv.ma, 3)      -- 09/11: chuyên đề Hình = mô hình (§13.6)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join vatly_bdm_o vatly_o on vatly_o.chuyen_de_id = dv.ma and vatly_o.chu_de_id = dv.chu_de
      left join hoahoc_bdm_o hoahoc_o on hoahoc_o.chuyen_de_id = dv.ma and hoahoc_o.chu_de_id = dv.chu_de
      left join dai_bdm_o dbo on dbo.chuyen_de_id = dv.ma and dbo.chu_de_id = dv.chu_de
  ),
  -- LẦN THI trong kì của KHỐI em (mọi em của khối — dùng cho hạng, TB lần thi và phụ lục)
  kt as (
    select k.id, k.loai, coalesce(k.ngay, b.ngay) as ngay,
           public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, b.ngay)) as thang
      from ky_thi k left join buoi_hoc b on b.id = k.buoi_hoc_id
     where k.loai in ('mt_sat_hach', 'khao_sat_thang') and k.mon = p_mon and k.khoi = v_lop.khoi
       and coalesce(k.ngay, b.ngay) is not null
  ),
  kt2 as (select * from kt where thang between v_ky.tu_thang and v_ky.den_thang),
  d as (
    select kt2.loai, kt2.thang, dt.hoc_sinh_id, avg(dt.diem) as diem, min(kt2.ngay) as ngay
      from diem_thi dt join kt2 on kt2.id = dt.ky_thi_id
     where dt.diem is not null
     group by kt2.loai, kt2.thang, dt.hoc_sinh_id
  ),
  lan as (
    select d.*, rank() over (partition by loai, thang order by diem desc)::int as hang,
           count(*) over (partition by loai, thang)::int as n_mau,
           avg(diem) over (partition by loai, thang) as tb
      from d
  ),
  cot0 as (select loai, thang, min(ngay) as ngay from lan group by loai, thang),
  cot as (   -- các lần thi của khối, theo thời gian (cột phụ lục + trục đồ thị). Nhãn cho PH (Thùy 04/11): MT = "T8", khảo sát = "Khảo sát 1, 2…" theo thứ tự trong kì
    select loai, thang, ngay,
           case loai when 'mt_sat_hach' then 'T' || ltrim(substr(thang, 6, 2), '0')
                else 'KS' || row_number() over (partition by loai order by ngay, thang) end as nhan,   -- Thùy 04/11: viết tắt, cột không bị phình
           row_number() over (order by ngay, loai) as stt
      from cot0
  ),
  hang_tb as (   -- hạng TB các lần em ĐÃ thi ⇒ xếp hạng lại (Thùy 04/11)
    select hoc_sinh_id, avg(hang) as hang_tb, avg(diem) as diem_tb, count(*)::int as so_lan from lan group by hoc_sinh_id
  ),
  ky_hang as (
    select h.*, rank() over (order by h.hang_tb asc)::int as hang, count(*) over ()::int as tong from hang_tb h
  ),
  lop_hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id in (select hoc_sinh_id from ky_hang)
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  cc as (
    select count(*) filter (where h.diem_danh = 'vang')::int as vang,
           count(*) filter (where h.diem_danh = 'vang_phep')::int as vang_phep,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(h.diem_danh)::int as tong
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai is distinct from 'huy'
      join lop l on l.id = b.lop_id and l.mon = p_mon
     where h.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
  ),
  bt as (   -- BTVN: buổi thường của lớp môn này + ca bù cho buổi của môn này
    select k.trang_thai_nop, k.thai_do
      from btvn_ket_qua k
      join buoi_hoc b on b.id = k.buoi_hoc_id and b.trang_thai is distinct from 'huy'
      left join lop l on l.id = b.lop_id
     where k.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
       and ((b.loai = 'thuong' and l.mon = p_mon)
         or (b.loai = 'bu' and exists (select 1 from buoi_hoc_hs hh join buoi_hoc me on me.id = hh.bu_cho_buoi_id
                                                join lop lm on lm.id = me.lop_id and lm.mon = p_mon
                                        where hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = p_hs)))
       and (k.trang_thai_nop is not null or k.thai_do is not null)
  ),
  -- GỢI Ý (spec §D, Thùy 05/11) — GV duyệt trên màn nhập, không tự ghi vào báo cáo.
  em_lan as (   -- các lần thi CỦA EM trong kì
    select l.diem, l.diem - l.tb as chenh, l.hang, l.n_mau,
           row_number() over (order by l.ngay desc, l.loai) as rn_moi,
           row_number() over (order by l.ngay asc, l.loai) as rn_cu,
           count(*) over () as n
      from lan l where l.hoc_sinh_id = p_hs
  ),
  dd as (
    -- điểm dự đoán = TB điểm, trọng số lần gần nhất 6-4-3-3 · sai số = max(0,75; 1,5 × độ lệch chuẩn của CHÊNH so TB lần thi), 1 lần ⇒ 1,0
    -- (backtest T10, 254 em: lệch TB 0,97; 65% lọt khoảng). Bội 0,25.
    -- tang = chênh TB nửa sau kì − nửa đầu kì (mỗi nửa = floor(n/2) lần; lẻ thì bỏ lần giữa) · top = mọi lần trong top 20%.
    select count(*)::int as n,
           least(10, greatest(0, round(4 * sum(diem * (case rn_moi when 1 then 6 when 2 then 4 else 3 end))
                                      / nullif(sum(case rn_moi when 1 then 6 when 2 then 4 else 3 end), 0)) / 4)) as du_doan,
           case when count(*) < 2 then 1.0 else greatest(0.75, round(4 * 1.5 * stddev_pop(chenh)) / 4) end as sai_so,
           avg(chenh) filter (where rn_moi <= floor(n / 2.0)) - avg(chenh) filter (where rn_cu <= floor(n / 2.0)) as tang,
           bool_and(hang::numeric / n_mau <= 0.2) as top
      from em_lan
  ),
  bt_so as (   -- BTVN cho gợi ý "Về nhà": mẫu = buổi đã ghi trạng thái nộp, bỏ xin phép
    select count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int as dat,
           count(*) filter (where trang_thai_nop is not null and trang_thai_nop <> 'xin_phep')::int as mau,
           count(*) filter (where trang_thai_nop = 'khong_lam')::int as kl,
           count(*) filter (where trang_thai_nop = 'nop_muon')::int as nm,
           count(*) filter (where trang_thai_nop = 'nop_dung_han' and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int as knt
      from bt
  ),
  gy as (   -- mức gợi ý cho mục 🤖 — ngưỡng đọc từ danh mục (Thùy sửa trên ERP)
    select m.ma,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 then null
                               when 100.0 * b.dat / b.mau >= m.nguong_tot then 'tot'
                               when 100.0 * b.dat / b.mau < m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'can_than' then case when d.n < 2 then null
                               when coalesce(v_bc.sai_so, d.sai_so) <= m.nguong_tot then 'tot'
                               when coalesce(v_bc.sai_so, d.sai_so) >= m.nguong_chua_tot then 'chua_tot' else 'on' end
        when 'tien_bo_diem' then case when d.n < 2 then null
                               when d.top or d.tang >= m.nguong_tot then 'tot'
                               when d.tang <= m.nguong_chua_tot then 'chua_tot' else 'on' end
      end as muc_do,
      case m.goi_y
        when 'btvn' then case when b.mau = 0 or b.kl + b.nm + b.knt = 0 then null
                              when b.kl >= b.nm and b.kl >= b.knt then 'khong_lam'
                              when b.nm >= b.knt then 'nop_muon' else 'khong_nghiem_tuc' end
        when 'tien_bo_diem' then case when d.n >= 2 and d.top then 'top' end
      end as khoa,
      case m.goi_y
        when 'btvn' then jsonb_build_object('dat', b.dat, 'mau', b.mau, 'khong_lam', b.kl, 'nop_muon', b.nm, 'chua_nghiem_tuc', b.knt)
        when 'can_than' then jsonb_build_object('sai_so', coalesce(v_bc.sai_so, d.sai_so), 'tu_gv', v_bc.sai_so is not null, 'so_lan', d.n)
        when 'tien_bo_diem' then jsonb_build_object('tang', round(d.tang, 2), 'top', d.top, 'so_lan', d.n)
      end as so
      from bc_ky_nx_muc m cross join bt_so b cross join dd d
     where m.goi_y is not null and m.xoa_at is null
  )
  select jsonb_build_object(
    'phien_ban', 3,
    'tinh_luc', now(),
    'hs', jsonb_build_object('id', v_hs.id, 'ho_ten', v_hs.ho_ten, 'ma_hs', v_hs.ma_hs),
    'lop', jsonb_build_object('id', v_lop.id, 'ten', v_lop.ten_lop, 'khoi', v_lop.khoi),
    'mon', p_mon,
    'gv', v_gv,
    'ky', jsonb_build_object('id', v_ky.id, 'ten', v_ky.ten, 'tu_thang', v_ky.tu_thang, 'den_thang', v_ky.den_thang),
    -- PHẦN 1 — Đánh giá: cây chủ đề → chuyên đề
    'danh_gia', jsonb_build_object(
      'tu', v_60, 'den', v_cuoi, 'n_chu_de', 10, 'n_chuyen_de', 5, 'luat', 'lan',
      'chu_de', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ma', t.ma, 'ten', t.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 10, 'hang', p.hang, 'tong', p.tong,
                 'chuyen_de', coalesce((
                   select jsonb_agg(jsonb_build_object('ma', ch.ma, 'ten', ch.ten, 'p', pc.p, 'n', coalesce(pc.n, 0), 'n_toi_da', 5, 'muc', tg.muc,
                                                      'hang', pc.hang, 'tong', pc.tong)
                                    order by ch.tt, ch.ten)
                     from t_ch ch left join p_ch pc on pc.ma = ch.ma and pc.chu_de = ch.chu_de
                     left join tag tg on tg.ma = ch.ma and tg.chu_de = ch.chu_de
                    where ch.chu_de = t.ma), '[]'::jsonb))
               order by t.tt, t.ten)
          from t_cd t left join p_cd p on p.ma = t.ma), '[]'::jsonb)),
    -- PHẦN 2 — Kết quả thi của em (bảng + đồ thị) và hạng cả kì theo HẠNG TB
    'thi', coalesce((select jsonb_agg(jsonb_build_object(
                       'loai', l.loai, 'nhan', ct.nhan, 'thang', l.thang, 'ngay', l.ngay,
                       'diem', round(l.diem, 2), 'tb', round(l.tb, 2), 'chenh', round(l.diem, 2) - round(l.tb, 2),   -- điểm 2 chữ số (Thùy 04/11)
                       'n_mau', l.n_mau, 'hang', l.hang)
                     order by ct.stt) from lan l join cot ct using (loai, thang) where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'hang_tb', round(k.hang_tb, 1),
                                          'diem_tb', round(k.diem_tb, 2), 'so_lan', k.so_lan)
                  from ky_hang k where k.hoc_sinh_id = p_hs),
    -- PHẦN 3 — Thái độ học tập
    'thai_do', jsonb_build_object(
      'chuyen_can', (select to_jsonb(cc) from cc),
      'btvn', (select jsonb_build_object(
                 'tong', count(*)::int,
                 -- đạt chuẩn = nộp đúng hạn + thái độ không bị ghi chưa nghiêm túc / chống đối (Thùy 04/11)
                 'dat_chuan', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                 and coalesce(thai_do, '') not in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 -- NHÓM KHÔNG TRÙNG (Thùy 04/11 — PH cộng các ô phải ra đúng tổng): dat_chuan + dung_han_chua_nt + nop_muon + khong_lam
                 -- + xin_phep + chua_ghi = tong. khong_nghiem_tuc / chong_doi bên dưới là số ĐẾM CHỒNG (chỉ để ghi chú "trong đó…").
                 'dung_han_chua_nt', count(*) filter (where trang_thai_nop = 'nop_dung_han'
                                                        and coalesce(thai_do, '') in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chua_ghi', count(*) filter (where trang_thai_nop is null)::int,
                 'khong_lam', count(*) filter (where trang_thai_nop = 'khong_lam')::int,
                 'nop_muon', count(*) filter (where trang_thai_nop = 'nop_muon')::int,
                 'xin_phep', count(*) filter (where trang_thai_nop = 'xin_phep')::int,
                 'khong_nghiem_tuc', count(*) filter (where thai_do in ('chua_nghiem_tuc', 'chong_doi'))::int,
                 'chong_doi', count(*) filter (where thai_do = 'chong_doi')::int) from bt)),
    -- PHẦN 4 — GV nhập: KHÔNG ở đây — ghép bằng _bc_ky_phan_gv lúc trả (mig 202611051704, để số liệu chốt dùng chung)
    'goi_y', (select jsonb_build_object(
                'du_doan', case when d.n > 0 then d.du_doan end,
                'sai_so', case when d.n > 0 then d.sai_so end,
                'so_lan', d.n,
                'muc', coalesce((select jsonb_object_agg(g.ma, jsonb_build_object('muc_do', g.muc_do, 'khoa', g.khoa, 'so', g.so)) from gy g), '{}'::jsonb))
                from dd d),
    -- PHẦN 5 — Phụ lục: toàn bộ em cùng khối × môn có ≥1 lần thi trong kì, xếp theo hạng TB
    'phu_luc', jsonb_build_object(
      'cot', coalesce((select jsonb_agg(jsonb_build_object('nhan', nhan, 'ngay', ngay) order by stt) from cot), '[]'::jsonb),
      'hs', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'ten', hs.ho_ten, 'lop', lh.ten_lop, 'la_em', k.hoc_sinh_id = p_hs,
                 'diem', (select jsonb_agg((select round(l.diem, 2) from lan l where l.hoc_sinh_id = k.hoc_sinh_id
                                              and l.loai = ct.loai and l.thang = ct.thang) order by ct.stt) from cot ct),
                 'hang_tb', round(k.hang_tb, 1), 'hang', k.hang)
               order by k.hang, hs.ho_ten)
          from ky_hang k join hoc_sinh hs on hs.id = k.hoc_sinh_id left join lop_hs lh on lh.hoc_sinh_id = k.hoc_sinh_id), '[]'::jsonb))
  ) into v_out;
  return v_out || public._bc_ky_phan_gv(p_hs, p_mon, p_ky, v_out -> 'goi_y');
end
$function$;
