-- ============================================================================
-- 202611131528 — sau_gio_theo_nhom_da_chot
-- VÌ SAO (Thùy 13/11, 4 lỗi bổ trợ sau giờ):
--  1. "Tài liệu in ra không giống cái giáo viên chọn mà hệ thống tự đề xuất. Logic chuẩn: dashboard hiện yếu, GV chốt nhóm, hệ thống in theo
--     dạng yếu trong nhóm đấy." Trước: fn_btnhe_fill_dang lấy MỌI dạng yếu của em (_sau_gio_dang), bỏ qua nhóm GV tick trong đề xuất.
--     Nay: _btnhe_dang_chot(hs, môn) = dạng YẾU trong đúng các nhóm của lượt chốt mới nhất (bo_tro_de_xuat L1 đã duyệt); nhóm GV chốt mà
--     không có dạng yếu ⇒ lấy 1 dạng chưa đạt điểm thấp nhất của nhóm (như fn_btk_duyet "nhóm quyết, dạng thực thi"); không có lượt chốt ⇒ rỗng.
--     fn_btnhe_fill_dang + _btnhe_dang_buoi đọc từ đây (một nguồn).
--  2. "Dashboard click vào nhóm cần thêm thông tin từng dạng": fn_btk_dang_nhom(hs, môn, nhóm) = mọi dạng của nhóm + đạt / cần luyện / yếu /
--     chưa đo + điểm + số lần đo (mastery theo lần, đọc cache qua _mastery_lan_cap_nhanh).
--  4. "Thu Giang 10A1 6 nhóm yếu mà 5 dạng yếu": popup đếm nhóm bằng mastery theo lần nhưng "dạng yếu" lại lấy dang_yeu_hien_tai (luật 2 cửa sổ
--     cũ) ⇒ 2 luật trên 1 dòng. fn_btk_goi_y: dang_yeu đếm CÙNG luật với nhóm (Thu Giang: 12; 7 trong 6 nhóm yếu) + mỗi nhóm có dang_yeu.
--  3. Builder tự lưu: bài LUYỆN cũng 1 bản / buổi như bài test (lưu lại = sửa bản đó, khi chưa ai làm) — trước mỗi lần lưu đẻ 1 bài luyện mới;
--     fn_btnhe_soan nạp lại bài luyện đã lưu (câu + cấu hình in).
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. fn_btnhe_luu_bai bài luyện: câu NHÁP của bài luyện chưa ai làm được thay khi lưu lại (như bài test).
-- ============================================================================

-- Dạng in sau giờ = dạng YẾU trong các nhóm GV đã chốt (lượt chốt mới nhất, L1 đã duyệt)
create or replace function public._btnhe_dang_chot(p_hs uuid, p_mon text)
returns table(ma_dang text, ten_dang text, nhom text, nhom_yeu boolean, score numeric, n integer, thu_tu integer)
language sql stable security definer set search_path to 'public' as $$
  with dx as (
    select d.nhom from bo_tro_de_xuat d
     where d.hoc_sinh_id = p_hs and d.mon = p_mon and d.trang_thai = 'da_duyet' and d.muc = 1
       and d.tao_at = (select max(d2.tao_at) from bo_tro_de_xuat d2 where d2.hoc_sinh_id = p_hs and d2.mon = p_mon)
  ),
  nchot as (select e->>'ma' as nhom, o::int as stt from dx, jsonb_array_elements(dx.nhom) with ordinality t(e, o)),
  m as materialized (
    select * from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang'], 5, 5, 3) where cap = 'dang'
  ),
  dg as (
    select m.nut as ma_dang, m.score, m.n, m.muc, coalesce(hh.ma_bai, db.nhom_id) as nhom
      from m left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
  ),
  x as (
    select dg.*, nc.stt,
           row_number() over (partition by dg.nhom order by dg.score, dg.n desc, dg.ma_dang) as rn,
           bool_or(dg.muc = 'yeu') over (partition by dg.nhom) as co_yeu
      from dg join nchot nc on nc.nhom = dg.nhom
  ),
  chon as (select * from x where x.muc = 'yeu' or (not x.co_yeu and x.rn = 1 and x.muc <> 'dat'))
  select c.ma_dang, t.ten_dang::text, c.nhom, true, c.score, c.n::int,
         (row_number() over (order by c.stt, c.score, c.ma_dang))::int
    from chon c cross join lateral (select public._kho_ten_dang(p_mon, c.ma_dang) as ten_dang) t
   where t.ten_dang is not null and not public._kho_dang_da_xoa_mem(c.ma_dang)
$$;
revoke execute on function public._btnhe_dang_chot(uuid, text) from public, anon;

-- Dashboard / popup chốt: bấm 1 nhóm ⇒ mọi dạng của nhóm + mức (đạt / cần luyện / yếu / chưa đo) + điểm + số lần đo
create or replace function public.fn_btk_dang_nhom(p_hs uuid, p_mon text, p_nhom text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_lop record; v jsonb;
begin
  select * into v_lop from public._btk_lop_hs(p_hs, p_mon);
  if v_lop.khoi is null then raise exception 'Em không học lớp % nào đang mở.', p_mon; end if;
  if not (public._btk_la_tk(p_mon, v_lop.khoi) or public._btk_la_tbm(p_mon, v_lop.khoi)) then
    raise exception 'Không có quyền với khối % môn %', v_lop.khoi, p_mon using errcode = '42501';
  end if;
  with ds as (
    select db.id as ma_dang, db.thu_tu from dai_bdm_dang_bai db where db.nhom_id = p_nhom
    union all
    select hh.ma_bai, 0 from hinh_hoc_bai hh where hh.ma_bai = p_nhom
  ),
  m as (select * from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang'], 5, 5, 3) where cap = 'dang')
  select coalesce(jsonb_agg(jsonb_build_object('ma_dang', ds.ma_dang, 'ten_dang', t.ten_dang,
           'muc', coalesce(m.muc, 'chua_do'), 'p', case when m.score is not null then round(100 * m.score)::int end, 'n', coalesce(m.n, 0))
         order by case coalesce(m.muc, 'chua_do') when 'yeu' then 0 when 'can_luyen' then 1 when 'dat' then 2 else 3 end, m.score nulls last, ds.thu_tu), '[]'::jsonb)
    into v
    from ds left join m on m.nut = ds.ma_dang
    cross join lateral (select public._kho_ten_dang(p_mon, ds.ma_dang) as ten_dang) t
   where t.ten_dang is not null and not public._kho_dang_da_xoa_mem(ds.ma_dang);
  return v;
end $$;
revoke execute on function public.fn_btk_dang_nhom(uuid, text, text) from public, anon;
grant execute on function public.fn_btk_dang_nhom(uuid, text, text) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_btnhe_fill_dang(p_case uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_mon text; v_n integer := 0; r record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hoc_sinh_id, mon into v_hs, v_mon from bo_tro_yeu where id = p_case and trang_thai = 'nhe_mo';
  if v_hs is null then raise exception 'Case sau giờ không mở.'; end if;
  for r in select * from public._btnhe_dang_chot(v_hs, v_mon) order by thu_tu loop   -- 13/11: dạng yếu trong nhóm GV đã chốt
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
      values (p_case, r.ma_dang, 'may', r.score, least(r.n, 32767)::smallint) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
    if found then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $function$;

CREATE OR REPLACE FUNCTION public._btnhe_dang_buoi(p_buoi uuid)
 RETURNS TABLE(ma_dang text, ten_dang text, nhom_yeu boolean, thu_tu integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with b as (select * from public._btyeu_buoi(p_buoi)),
  mo as (select d.ma_dang, d.diem_luc_mo, d.created_at from bo_tro_yeu_dang d, b where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null),
  sg as (select s.* from b cross join lateral public._btnhe_dang_chot(b.hoc_sinh_id, b.mon) s)   -- 13/11: nhóm GV đã chốt
  select mo.ma_dang, coalesce(sg.ten_dang, public._kho_ten_dang((select mon from b), mo.ma_dang))::text,
         coalesce(sg.nhom_yeu, false),
         (row_number() over (order by coalesce(sg.nhom_yeu, false) desc, sg.thu_tu nulls last, mo.diem_luc_mo nulls last, mo.created_at))::int
    from mo left join sg on sg.ma_dang = mo.ma_dang
$function$;

CREATE OR REPLACE FUNCTION public.fn_btk_goi_y(p_hs uuid, p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_lop record; v jsonb;
begin
  select * into v_lop from public._btk_lop_hs(p_hs, p_mon);
  if v_lop.khoi is null then raise exception 'Em không học lớp % nào đang mở.', p_mon; end if;
  if not (public._btk_la_tk(p_mon, v_lop.khoi) or public._btk_la_tbm(p_mon, v_lop.khoi)) then
    raise exception 'Không có quyền với khối % môn %', v_lop.khoi, p_mon using errcode = '42501';
  end if;
  with nh as (select * from public._btk_nhom_hs(array[p_hs], p_mon)),
  dg as (   -- dạng đã đo / chưa đạt trong nhóm — biết tick nhóm này sẽ đổ bao nhiêu dạng
    select coalesce(hh.ma_bai, db.nhom_id) as nhom, count(*) filter (where m.muc <> 'dat')::int as chua_dat, count(*)::int as da_do,
           count(*) filter (where m.muc = 'yeu')::int as yeu
      from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang'], 5, 5, 3) m
      left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
     where m.cap = 'dang' group by 1
  )
  select jsonb_build_object(
    'khoi', v_lop.khoi,
    'so_nhom_do', (select count(*) from nh),
    'so_nhom_yeu', (select count(*) from nh where muc = 'yeu'),
    'dang_yeu', (select coalesce(sum(yeu), 0)::int from dg),   -- 13/11: cùng luật với nhóm (mastery theo lần), không lấy dang_yeu_hien_tai (luật 2 cửa sổ)
    'dang_yeu_trong_nhom_yeu', (select coalesce(sum(dg.yeu), 0)::int from dg join nh on nh.ma = dg.nhom where nh.muc = 'yeu'),
    'nhom', coalesce((select jsonb_agg(jsonb_build_object('ma', z.ma, 'ten', z.ten, 'cha', z.cha, 'p', round(100 * z.score)::int, 'n', z.n,
                         'muc', z.muc, 'tin', z.tin, 'dang_chua_dat', coalesce(dg.chua_dat, 0), 'dang_da_do', coalesce(dg.da_do, 0), 'dang_yeu', coalesce(dg.yeu, 0), 'tick', z.muc = 'yeu')
                       order by z.score, z.ten)
                      from (select * from nh order by score, ten limit 5) z left join dg on dg.nhom = z.ma), '[]'::jsonb),
    'de_xuat', (select to_jsonb(dx) - 'tao_boi' - 'gui_boi' - 'duyet_boi' from bo_tro_de_xuat dx
                 where dx.hoc_sinh_id = p_hs and dx.mon = p_mon and dx.trang_thai in ('nhap', 'cho_duyet', 'tra_lai') limit 1),
    'dang_bo_tro', exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai = 'dang_xu')
  ) into v;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_luu_bai(p_buoi uuid, p_loai text, p_ds jsonb, p_cau_hinh jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_bt uuid; d jsonb; c text; i integer := 0; v_cautbl text; v_lttbl text; v_nhanh text; v_tl text[] := '{}'; v_ten text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('luyen', 'test') then raise exception 'Loại phải là luyen | test.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') then raise exception 'Không phải ca bổ trợ sau giờ.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  if jsonb_typeof(p_ds) <> 'array' or not exists (select 1 from jsonb_array_elements(p_ds) x where jsonb_array_length(coalesce(x->'caus', '[]'::jsonb)) > 0) then
    raise exception 'Bài chưa có câu nào.';
  end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;

  -- 13/11 (builder tự lưu): bài LUYỆN cũng 1 bản / buổi như bài test — lưu lại = sửa bản đó khi chưa ai làm
  if p_loai = 'luyen' then
    select bt.id into v_bt from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro'
       and not exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id) order by bt.created_at desc limit 1;
    if v_bt is not null then delete from bai_test_cau where bai_test_id = v_bt; end if;   -- câu nháp của bài chưa ai làm
  end if;
  if p_loai = 'test' then
    select id into v_bt from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
    if v_bt is not null then
      if exists (select 1 from bai_lam bl where bl.bai_test_id = v_bt) then raise exception 'Bài test đã nhập kết quả — không sửa câu được nữa.'; end if;
      delete from bai_test_cau where bai_test_id = v_bt;   -- câu nháp của bài chưa ai làm
      update bai_test set in_giay_at = now() where id = v_bt;
    end if;
  end if;
  if v_bt is null then
    insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
      values (null, v_lop, b.hoc_sinh_id, b.ngay, case when p_loai = 'test' then 'bo_tro_test' else 'bo_tro' end, b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid())
      returning id into v_bt;
  end if;

  perform set_config('bk.snap_khong_form', case when public._btnhe_uu_tu_luan(b.hoc_sinh_id) then '1' else '' end, true);   -- cấp 1–2: không hiện form TN
  for d in select * from jsonb_array_elements(p_ds) loop
    v_nhanh := public._kho_nhanh_cua_dang(b.mon, d->>'ma_dang');
    v_cautbl := public._kho_cau_tbl(b.mon, v_nhanh); v_lttbl := public._kho_lt_tbl(b.mon, v_nhanh);
    for c in select jsonb_array_elements_text(coalesce(d->'caus', '[]'::jsonb)) loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
      -- 12/11: TA nhập Đ/C/S cho MỌI loại câu (cả tự luận) ⇒ không còn chặn câu tự luận
    end loop;
    if p_loai = 'test' then
      update bo_tro_yeu_dang set day_at = coalesce(day_at, now()), day_buoi_id = coalesce(day_buoi_id, p_buoi)
       where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = d->>'ma_dang';
    end if;
  end loop;
  perform set_config('bk.snap_khong_form', '', true);
  if i = 0 then raise exception 'Bài chưa có câu nào.'; end if;
  if p_loai = 'test' and i > 10 then raise exception 'Bài test tối đa 10 câu (đang %). Bỏ bớt câu.', i; end if;   -- Thùy 11/11
  update bai_test set so_cau = i, cau_hinh_in = p_cau_hinh where id = v_bt;   -- cấu hình in như builder (dòng · cột · hình)
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_soan(p_buoi uuid, p_loai text, p_so integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tl boolean; b record; v_tru text[]; v_test uuid; v_luyen uuid; v_bai uuid; v_chi_nhom_yeu boolean; r record; v_cautbl text; v_caus text[]; v_out jsonb := '[]'::jsonb;
  v_n integer := greatest(1, least(coalesce(p_so, 3), 10));
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('luyen', 'test') then raise exception 'Loại phải là luyen | test.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') then raise exception 'Không phải ca bổ trợ sau giờ.'; end if;
  select id into v_test from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
  -- 13/11: bài luyện đã lưu (chưa ai làm) ⇒ builder mở lại đúng bản đó
  select bt.id into v_luyen from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro'
     and not exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id) order by bt.created_at desc limit 1;
  v_bai := case when p_loai = 'test' then v_test else v_luyen end;
  if p_loai = 'test' and v_test is not null and exists (select 1 from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id where bl.bai_test_id = v_test) then
    raise exception 'Bài test đã nhập kết quả — không sửa câu được nữa.';
  end if;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
   where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null and bt.id is distinct from v_bai;
  v_chi_nhom_yeu := exists (select 1 from public._btnhe_dang_buoi(p_buoi) where nhom_yeu);
  for r in select d.*, public._kho_nhanh_cua_dang(b.mon, d.ma_dang) as nhanh, db.nhom_id
             from public._btnhe_dang_buoi(p_buoi) d left join dai_bdm_dang_bai db on db.id = d.ma_dang
            where p_loai = 'luyen' or d.nhom_yeu or not v_chi_nhom_yeu
            order by d.thu_tu loop
    exit when p_loai = 'test' and (select coalesce(sum(jsonb_array_length(x->'caus')), 0) from jsonb_array_elements(v_out) x) >= 10;   -- test tối đa 10 câu
    if v_bai is not null then
      select coalesce(array_agg(k.ma_cau order by k.thu_tu), '{}') into v_caus from bai_test_cau k where k.bai_test_id = v_bai and k.ma_dang = r.ma_dang;
      -- câu snapshot theo dạng gốc của câu: dạng không khớp thì để trống, người chọn lại
    else
      v_cautbl := public._kho_cau_tbl(b.mon, r.nhanh);
      v_tl := coalesce(v_tl, public._btnhe_uu_tu_luan(b.hoc_sinh_id));   -- 12/11: cấp 1–2 tự luận trước, cấp 3 trắc nghiệm trước
      v_caus := public._btnhe_chon_cau(v_cautbl, r.ma_dang, v_tru, case when p_loai = 'test' then 1 else v_n end, v_tl, case when p_loai = 'luyen' then 1 else 0 end);
      if coalesce(array_length(v_caus, 1), 0) = 0 and p_loai = 'test' then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;   -- hết TL/TLN ⇒ trắc nghiệm
    end if;
    v_tru := v_tru || coalesce(v_caus, '{}');
    v_out := v_out || jsonb_build_object('ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'nhom_yeu', r.nhom_yeu, 'nhanh', r.nhanh,
                                         'nhom_id', r.nhom_id, 'caus', to_jsonb(coalesce(v_caus, '{}')));
  end loop;
  return jsonb_build_object('loai', p_loai, 'mon', b.mon, 'test_id', v_test, 'dang', v_out,
    'tu_luan', coalesce(v_tl, public._btnhe_uu_tu_luan(b.hoc_sinh_id)),   -- màn báo "dạng chưa có tự luận / trả lời ngắn"
    'bai_id', v_bai,
    'cau_hinh_in', (select cau_hinh_in from bai_test where id = v_bai),
    'da_in', (select coalesce(jsonb_agg(distinct btc.ma_cau), '[]'::jsonb) from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
               where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null and bt.id is distinct from v_bai));
end $function$;

-- ── DỮ LIỆU (Thùy gật scope): ca sau giờ CÒN MỞ, chưa nhập kết quả ⇒ tập dạng của case theo đúng nhóm đã chốt ──
--   · thêm dạng thiếu (nguon 'may', như lúc khởi tạo) · dạng ngoài nhóm chốt CHƯA dạy ⇒ đóng (dong_at = now(), không xoá dòng).
--   Bài đã soạn/in giữ nguyên câu cũ — GV mở builder soạn lại.
create temp table _sg_case on commit drop as
  select distinct y.id as case_id, y.hoc_sinh_id, y.mon
    from bo_tro_yeu y join buoi_hoc_hs hh on hh.bo_tro_yeu_id = y.id join buoi_hoc b on b.id = hh.buoi_hoc_id
    join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
   where y.nguon = 'nhe' and y.trang_thai = 'nhe_mo' and cn.trang_thai <> 'huy' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
     and not exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = b.id);
create temp table _sg_moi on commit drop as
  select s.case_id, x.ma_dang, x.score, x.n from _sg_case s cross join lateral public._btnhe_dang_chot(s.hoc_sinh_id, s.mon) x;
insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
  select m.case_id, m.ma_dang, 'may', m.score, least(m.n, 32767)::smallint from _sg_moi m
  on conflict (bo_tro_yeu_id, ma_dang) do update set dong_at = null where bo_tro_yeu_dang.day_at is null;
update bo_tro_yeu_dang d set dong_at = now()
  from _sg_case s
 where d.bo_tro_yeu_id = s.case_id and d.dong_at is null and d.day_at is null
   and not exists (select 1 from _sg_moi m where m.case_id = s.case_id and m.ma_dang = d.ma_dang);
