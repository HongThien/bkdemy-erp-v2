-- Ôn thi giữa kì I — PHA 2: THI THỬ đề trường (spec-on-thi-gk1.md, Thùy 16/10).
-- loai mới 'thi_thu': bài thi CÁ NHÂN sinh từ 1 đề thi đã duyệt. Đi đường LamET/et_de/et_nop sẵn có (đồng hồ + chấm server + khoá giờ),
-- KHÔNG ghi mastery. Tự luận chưa vào lượt thi (pha 3: nộp ảnh).

alter table bai_test drop constraint bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check check (loai = any (array[
  'et','btvn','giao_trinh','de_thi','tu_luyen','bo_tro','bo_tro_test','retest','htd_luyen','htd_test','bu_luyen','bu_test','on_thi_luyen','thi_thu']));

-- Mỗi HS 1 lượt thi thử / đề (lượt duy nhất tính hạng; chặn tạo trùng khi bấm đúp).
create unique index if not exists bai_test_thi_thu_uniq on bai_test (nguon_tai_lieu_id, hoc_sinh_id) where loai = 'thi_thu';

-- RLS: HS KHÔNG đọc thẳng bai_test_cau của bài thi (lộ đáp án) — thêm 'thi_thu' vào danh sách chặn; đề đọc qua et_de.
drop policy bai_test_cau_hs_read on bai_test_cau;
create policy bai_test_cau_hs_read on bai_test_cau for select using (exists (
  select 1 from bai_test bt
   where bt.id = bai_test_cau.bai_test_id
     and bt.loai <> all (array['et','de_thi','bo_tro_test','retest','thi_thu'])
     and (hs_o_lop(bt.lop_id) or bt.hoc_sinh_id = my_hoc_sinh_id())
     and (bt.loai <> 'giao_trinh' or _btc_trang_thai(bai_test_cau.id, bai_test_cau.bai_test_id, bai_test_cau.ma_dang) <> 'chua')));

-- Vá hàm bằng THÂN ĐANG CHẠY (pg_get_functiondef) — không chép tay.
do $$
declare f record; def text; moi text;
  -- (tên hàm, regex tìm, thay bằng)
  cap text[][] := array[
    ['_trg_bai_lam_thi',      '\(''et'', ''de_thi'', ''bo_tro_test'', ''retest''\)', '(''et'', ''de_thi'', ''bo_tro_test'', ''retest'', ''thi_thu'')'],
    ['_trg_bai_lam_cau_thi',  '\(''et'', ''de_thi'', ''bo_tro_test'', ''retest''\)', '(''et'', ''de_thi'', ''bo_tro_test'', ''retest'', ''thi_thu'')'],
    ['et_de',                 'bt\.loai in \(''bo_tro_test'', ''retest''\)',         'bt.loai in (''bo_tro_test'', ''retest'', ''thi_thu'')'],
    ['fn_mastery_cells',      'bt\.loai <> ''on_thi_luyen''',                        'bt.loai not in (''on_thi_luyen'', ''thi_thu'')'],
    ['hs_dang_evals',         'bt\.loai <> ''on_thi_luyen''',                        'bt.loai not in (''on_thi_luyen'', ''thi_thu'')'],
    ['fn_hs_xep_hang_ti_le_dat', 'bt\.loai <> ''on_thi_luyen''',                     'bt.loai not in (''on_thi_luyen'', ''thi_thu'')'],
    ['_bxh_gia_tri',          'bt\.loai <> ''on_thi_luyen''',                        'bt.loai not in (''on_thi_luyen'', ''thi_thu'')']];
  i int;
begin
  for i in 1 .. array_length(cap, 1) loop
    for f in select p.oid from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = cap[i][1] loop
      def := pg_get_functiondef(f.oid);
      if def like '%''thi_thu''%' then continue; end if;   -- đã vá
      moi := regexp_replace(def, cap[i][2], cap[i][3], 'g');
      if moi = def then raise exception 'Không tìm thấy điều kiện để vá trong %', cap[i][1]; end if;
      execute moi;
    end loop;
  end loop;
end $$;

-- Danh sách đề của HS: thêm thời gian, lượt thi thử đã có (bai_thi_id), đã nộp chưa.
create or replace function public.fn_hs_on_thi_ds(p_mon text)
returns jsonb language sql stable security definer set search_path to 'public' as $$
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
$$;

create or replace function public.fn_hs_thi_thu_bat_dau(p_de uuid)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_lop uuid; v_bt uuid; r record; n int := 0; v_tl int := 0; v_phut int;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi, t.cau_hinh into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') <> 'de_cuong';
  if tl.id is null then raise exception 'Đề thi này chưa mở cho em.'; end if;
  if public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then raise exception 'Đề thi này không thuộc khối của em.'; end if;

  -- 1 lượt / đề: đã có thì trả lại (làm tiếp hoặc xem lại), không sinh lượt mới.
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
    if r.loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') then
      n := n + 1;
      perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', public._kho_lt_dang_tbl(r.kho), r.ma_cau, n, null);
      update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
       where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
      if r.loai_cau = 'tra_loi_ngan' then   -- giữ form đề gốc (như fn_de_thi_mo): trả lời ngắn + đáp số, không tự hiện 4 phương án
        update bai_test_cau set loai_cau = 'tra_loi_ngan', lua_chon = null, lua_chon_rule = null,
               form_tn_id = null, form_tn_hgt_id = null, dap_an_key = to_jsonb(btrim(r.dap_an))
         where bai_test_id = v_bt and thu_tu = n and bien_the = 1 and loai_cau <> 'tra_loi_ngan';
      end if;
    else
      v_tl := v_tl + 1;   -- tự luận: pha 3 (nộp ảnh)
    end if;
  end loop;
  if n = 0 then raise exception 'Đề này chưa có câu nào thi được trên app.'; end if;
  update bai_test set so_cau = n where id = v_bt;

  -- Phần còn lại của fn_de_thi_hoan_thien_bai_test (hàm đó chỉ cho nhân sự): ô nhập 4 ô · bỏ dạng chờ · tên phần.
  update bai_test_cau set kieu_nhap = 'phieu_4o'
   where bai_test_id = v_bt and loai_cau = 'tra_loi_ngan' and public._de_thi_hop_le_4o(btrim(dap_an_key #>> '{}'));
  update bai_test_cau set ma_dang = null where bai_test_id = v_bt and public._kho_la_dang_cho(ma_dang);
  return jsonb_build_object('bai_test_id', v_bt, 'lai', false, 'so_cau', n, 'so_tu_luan', v_tl);
exception when unique_violation then
  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  return jsonb_build_object('bai_test_id', v_bt, 'lai', true);
end $$;

revoke execute on function public.fn_hs_on_thi_ds(text), public.fn_hs_thi_thu_bat_dau(uuid) from public, anon;
grant execute on function public.fn_hs_on_thi_ds(text), public.fn_hs_thi_thu_bat_dau(uuid) to authenticated;
