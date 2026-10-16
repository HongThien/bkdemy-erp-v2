-- Ôn thi giữa kì I — PHA 1: LUYỆN TẬP đề cương (spec-on-thi-gk1.md, Thùy 16/10).
-- loai mới 'on_thi_luyen': bài CÁ NHÂN sinh từ 1 đề cương đã duyệt, làm như tự luyện (chấm ngay từng câu) nhưng
-- KHÔNG ghi mastery: mọi hàm mastery/_hs_dang_da_hoc lọc theo DANH SÁCH loai tường minh nên loai mới tự nằm ngoài (đã soi 16/10).
-- RLS bai_test_cau_hs_read chỉ chặn et/de_thi/bo_tro_test/retest ⇒ loai mới đọc được qua hoc_sinh_id (như tu_luyen).

alter table bai_test drop constraint bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check check (loai = any (array[
  'et','btvn','giao_trinh','de_thi','tu_luyen','bo_tro','bo_tro_test','retest','htd_luyen','htd_test','bu_luyen','bu_test','on_thi_luyen']));

create or replace function public.fn_hs_on_thi_luyen_sinh(p_de uuid)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_lop uuid; v_bt uuid; r record; n int := 0; v_tl int := 0;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong';
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
end $$;

revoke execute on function public.fn_hs_on_thi_luyen_sinh(uuid) from public, anon;
grant execute on function public.fn_hs_on_thi_luyen_sinh(uuid) to authenticated;

-- ── Chặn 'on_thi_luyen' khỏi mastery / tỉ lệ đạt (đã soi pg_proc 16/10) ──────────────────────────────────────────
-- 4 hàm KHÔNG lọc loai bằng whitelist mà bằng "not in ('et','de_thi') or da_nop" ⇒ loai nào cũng lọt vào, kể cả loai mới:
--   fn_mastery_cells (src 'btvn' khi p_include_btvn) · hs_dang_evals · fn_hs_xep_hang_ti_le_dat · _bxh_gia_tri (A3).
-- Vá bằng cách lấy THÂN TỪ BẢN ĐANG CHẠY (pg_get_functiondef) rồi thêm 1 điều kiện — không chép tay thân hàm (phiên khác có thể đã sửa).
do $$
declare f record; def text; moi text;
begin
  for f in select p.oid, p.proname from pg_proc p
            where p.pronamespace = 'public'::regnamespace
              and p.proname in ('fn_mastery_cells', 'hs_dang_evals', 'fn_hs_xep_hang_ti_le_dat', '_bxh_gia_tri')
  loop
    def := pg_get_functiondef(f.oid);
    if def like '%on_thi_luyen%' then continue; end if;   -- đã vá (chạy lại không sao)
    moi := regexp_replace(def, '\(bt\.loai not in \(''et'',\s*''de_thi''\) or bl\.trang_thai = ''da_nop''\)',
                          '(bt.loai not in (''et'', ''de_thi'') or bl.trang_thai = ''da_nop'') and bt.loai <> ''on_thi_luyen''', 'g');
    if moi = def then raise exception 'Không tìm thấy điều kiện loai để vá trong %', f.proname; end if;
    execute moi;
  end loop;
end $$;
