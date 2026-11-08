-- ============================================================================
-- APP HỌC SINH — Ôn thi: hiện tại CHỈ mở đề "Giữa kì I" (Thùy 20/10). Áp cả Đề cương lẫn Đề thi các trường.
-- Kỳ của đề = _de_thi_ky (mig 202610201623: đặt tay ở Kho đề thi, không thì suy từ tên).
-- MỘT chỗ khai báo kỳ đang mở: _hs_on_thi_ky_mo(). Sang kỳ sau chỉ sửa hàm này (migration mới), 4 hàm HS đọc từ đó:
--   fn_hs_on_thi_ds (danh sách) · fn_hs_on_thi_xem (đọc đề) · fn_hs_on_thi_luyen_sinh (luyện đề cương) · fn_hs_thi_thu_bat_dau (thi thử).
-- Thân hàm giữ nguyên bản đang chạy, chỉ thêm điều kiện kỳ.
-- ============================================================================
create or replace function public._hs_on_thi_ky_mo() returns text[]
language sql immutable as $$ select array['gk1']::text[] $$;

create or replace function public.fn_hs_on_thi_ds(p_mon text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with k as (select public._hs_on_thi_khoi(p_mon) khoi)
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', t.id, 'ten', t.ten,
      'tab', case when coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong' then 'de_cuong' else 'de_thi' end,
      'nguon', nullif(t.cau_hinh -> 'deThi' ->> 'nguon', ''),
      'nam', nullif(t.cau_hinh -> 'deThi' ->> 'nam', '')::int,
      'so_cau', (select count(*) from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id where p.tai_lieu_id = t.id and p.loai_phan = 'custom'),
      'thoi_gian_phut', coalesce(nullif(t.cau_hinh -> 'deThi' ->> 'thoiGianPhut', '')::int, 90),
      'bai_thi_id', bt.id,
      'da_nop', coalesce(bl.trang_thai = 'da_nop', false)
    ) order by t.updated_at desc), '[]'::jsonb)
  from tai_lieu t
  cross join k
  left join bai_test bt on bt.nguon_tai_lieu_id = t.id and bt.hoc_sinh_id = public.my_hoc_sinh_id() and bt.loai = 'thi_thu'
  left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = public.my_hoc_sinh_id()
  where k.khoi is not null and t.loai = 'de_thi' and t.mon = p_mon and t.khoi = k.khoi and t.duyet_at is not null
    and public._de_thi_ky(t.cau_hinh, t.ten) = any (public._hs_on_thi_ky_mo())
$function$;

create or replace function public.fn_hs_on_thi_xem(p_de uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  tl record; v_phans jsonb := '[]'::jsonb; r record; v jsonb; kho text; n int := 0; cau jsonb;
  v_cur uuid; v_cs jsonb := '[]'::jsonb; v_tt text;
begin
  select t.id, t.ten, t.mon, t.khoi, t.cau_hinh, t.nhanh into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and public._de_thi_ky(t.cau_hinh, t.ten) = any (public._hs_on_thi_ky_mo());
  if tl.id is null or public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then return null; end if;
  for r in
    select p.id pid, p.tieu_de ptd, c.ma_cau cma
      from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id
     where p.tai_lieu_id = p_de and p.loai_phan = 'custom' order by p.thu_tu, c.thu_tu
  loop
    if v_cur is distinct from r.pid then
      if v_cur is not null then v_phans := v_phans || jsonb_build_object('tieu_de', v_tt, 'cau', v_cs); end if;
      v_cur := r.pid; v_tt := r.ptd; v_cs := '[]'::jsonb;
    end if;
    kho := public._de_thi_kho(tl.cau_hinh, tl.nhanh, tl.mon, r.cma);
    v := null;
    if to_regclass('public.' || kho || '_cau_hoi') is not null then
      execute format('select to_jsonb(q) from %I q where q.ma_cau = $1 and q.xoa_at is null', kho || '_cau_hoi') into v using r.cma;
    end if;
    if v is null then continue; end if;
    n := n + 1;
    cau := jsonb_build_object('stt', n, 'ma_cau', r.cma, 'loai_cau', v -> 'loai_cau', 'noi_dung', v -> 'noi_dung',
      'lua_chon', v -> 'lua_chon', 'menh_de', v -> 'menh_de', 'dap_an', v -> 'dap_an', 'loi_giai', v -> 'loi_giai',
      'anh_de', v -> 'anh_de', 'anh_dap_an', v -> 'anh_dap_an');
    v_cs := v_cs || cau;
  end loop;
  if v_cur is not null then v_phans := v_phans || jsonb_build_object('tieu_de', v_tt, 'cau', v_cs); end if;
  return jsonb_build_object('id', tl.id, 'ten', tl.ten, 'phans', v_phans);
end $function$;

create or replace function public.fn_hs_on_thi_luyen_sinh(p_de uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_lop uuid; v_bt uuid; r record; n int := 0; v_tl int := 0;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong'
     and public._de_thi_ky(t.cau_hinh, t.ten) = any (public._hs_on_thi_ky_mo());
  if tl.id is null then raise exception 'Đề cương này chưa mở cho em.'; end if;
  if public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then raise exception 'Đề cương này không thuộc khối của em.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, tl.mon);
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', tl.mon; end if;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
  values (p_de, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'on_thi_luyen', tl.mon, 0, 'mo')
  returning id into v_bt;
  for r in select * from public.fn_de_thi_cau(p_de) where not xoa order by stt loop
    if r.loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') then
      n := n + 1;
      perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', public._kho_lt_dang_tbl(r.kho), r.ma_cau, n, null);
      update bai_test_cau set phan = r.phan_tieu_de where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
    else
      v_tl := v_tl + 1;   -- tự luận / loại máy chưa chấm: không đưa vào lượt luyện (chỉ đếm để báo)
    end if;
  end loop;
  if n = 0 then raise exception 'Đề cương này chưa có câu nào luyện được trên app.'; end if;
  update bai_test set so_cau = n where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', n, 'so_bo_qua', v_tl);
end $function$;

create or replace function public.fn_hs_thi_thu_bat_dau(p_de uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_lop uuid; v_bt uuid; r record; n int := 0; v_tl int := 0; v_bo int := 0; v_phut int;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi, t.cau_hinh into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') <> 'de_cuong'
     and public._de_thi_ky(t.cau_hinh, t.ten) = any (public._hs_on_thi_ky_mo());
  if tl.id is null then raise exception 'Đề thi này chưa mở cho em.'; end if;
  if public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then raise exception 'Đề thi này không thuộc khối của em.'; end if;
  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  if v_bt is not null then return jsonb_build_object('bai_test_id', v_bt, 'lai', true); end if;
  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề đang được thầy cô chỉnh sửa — em quay lại sau nhé.';
  end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, tl.mon);
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', tl.mon; end if;
  v_phut := coalesce(nullif(tl.cau_hinh -> 'deThi' ->> 'thoiGianPhut', '')::int, 90);
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, deadline, khoa_reveal, thoi_gian_phut, so_cau)
  values (p_de, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'thi_thu', tl.mon, null, false, v_phut, 0)
  returning id into v_bt;
  for r in select * from public.fn_de_thi_cau(p_de) where not xoa order by stt loop
    if r.loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan') then
      n := n + 1;
      if r.loai_cau = 'tu_luan' then v_tl := v_tl + 1; end if;
      perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', public._kho_lt_dang_tbl(r.kho), r.ma_cau, n, null);
      update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
       where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
      if r.loai_cau = 'tra_loi_ngan' then
        update bai_test_cau set loai_cau = 'tra_loi_ngan', lua_chon = null, lua_chon_rule = null,
               form_tn_id = null, form_tn_hgt_id = null, dap_an_key = to_jsonb(btrim(r.dap_an))
         where bai_test_id = v_bt and thu_tu = n and bien_the = 1 and loai_cau <> 'tra_loi_ngan';
      end if;
    else
      v_bo := v_bo + 1;   -- loại máy chưa hỗ trợ (vd kéo thả) — bỏ khỏi lượt thi
    end if;
  end loop;
  if n = 0 then raise exception 'Đề này chưa có câu nào thi được trên app.'; end if;
  update bai_test set so_cau = n where id = v_bt;
  update bai_test_cau set kieu_nhap = 'phieu_4o'
   where bai_test_id = v_bt and loai_cau = 'tra_loi_ngan' and public._de_thi_hop_le_4o(btrim(dap_an_key #>> '{}'));
  update bai_test_cau set ma_dang = null where bai_test_id = v_bt and public._kho_la_dang_cho(ma_dang);
  return jsonb_build_object('bai_test_id', v_bt, 'lai', false, 'so_cau', n, 'so_tu_luan', v_tl, 'so_bo_qua', v_bo);
exception when unique_violation then
  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  return jsonb_build_object('bai_test_id', v_bt, 'lai', true);
end $function$;
