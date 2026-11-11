-- ============================================================================
-- 202611112203 — sau_gio_ta_nhap_dcs
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 11/11): app TA "màn hình chính hiện Bổ trợ sau giờ. Click vào hiện 1 tab có học sinh và từng câu tương ứng điền DCS"
--   (TA không mở ca — GV đã mở + in; TA chỉ nhập kết quả bài test giống chấm ET).
--   fn_btnhe_ta_nhap_ds()            — ĐỌC: các em sau giờ của TA (TA cùng làm, hoặc người mở ca; admin thấy hết), ngày ≤ hôm nay,
--                                       đã có bài test, chưa xong — kèm từng câu + kết quả đã nhập (D/C/S). Thêm em đã xong HÔM NAY để xem lại.
--   fn_btnhe_nhap_dcs(câu, 'D'|'C'|'S'|null) — GHI 1 ô: Đ = đúng (1) · C = chưa trọn (0,5) · S = sai (0) · null = xoá ô nhập nhầm.
--   Nộp từng em = fn_btyeu_giay_nop (sẵn có: ô trống tính sai, nộp ⇒ có mặt + xong ca sau giờ, mig 202611111627).
--   Kết quả = bai_lam_cau của bài 'bo_tro_test' ⇒ mastery kênh ET như cũ (partial = 0,5).
-- MẤT GÌ (Luật xoá): không mất gì — thêm 2 hàm. (Xoá ô = chỉ bỏ dòng bai_lam_cau do chính TA vừa nhập, bài chưa nộp.)
-- ============================================================================

create or replace function public.fn_btnhe_ta_nhap_ds()
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_hom date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select coalesce(la_admin, false) into v_admin from public.my_quyen();
  return coalesce((
    select jsonb_agg(x order by x.ngay, x.ten_lop, x.ho_ten) from (
      select b.id as buoi_id, b.ngay, b.gio_bat_dau, l.ten_lop, h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, cn.mon,
             bt.id as bai_test_id, b.danh_gia_xong_at is not null as xong,
             exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') as da_nop,
             (select jsonb_agg(jsonb_build_object('id', k.id, 'thu_tu', k.thu_tu, 'loai_cau', k.loai_cau,
                       'kq', (select case blc.verdict when 'correct' then 'D' when 'partial' then 'C' when 'wrong' then 'S' end
                                from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id
                               where bl.bai_test_id = bt.id and blc.bai_test_cau_id = k.id limit 1))
                     order by k.thu_tu)
                from bai_test_cau k where k.bai_test_id = bt.id) as caus
        from buoi_hoc b
        join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id and cn.trang_thai <> 'huy'
        join lop l on l.id = cn.lop_id
        join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
        join hoc_sinh h on h.id = hh.hoc_sinh_id
        join bai_test bt on bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'
       where b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay <= v_hom
         and (v_admin or cn.ta_id = v_ns or b.nguoi_day_tg = v_ns)
         and (b.danh_gia_xong_at is null or b.ngay = v_hom)
    ) x), '[]'::jsonb);
end $$;
revoke execute on function public.fn_btnhe_ta_nhap_ds() from public, anon;
grant execute on function public.fn_btnhe_ta_nhap_ds() to authenticated;

create or replace function public.fn_btnhe_nhap_dcs(p_bai_test_cau uuid, p_kq text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare k record; v_bl uuid; v_tt text; v_verdict text; v_diem numeric;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả.'; end if;
  if p_kq is not null and p_kq not in ('D', 'C', 'S') then raise exception 'Kết quả phải là D / C / S.'; end if;
  select btc.id, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.loai, b.loai as buoi_loai
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id left join buoi_hoc b on b.id = bt.buoi_hoc_id
   where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.loai <> 'bo_tro_test' or k.buoi_loai is distinct from 'bo_tro_nhe' then raise exception 'Chỉ nhập Đ/C/S cho bài test bổ trợ sau giờ.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id, trang_thai into v_bl, v_tt;
  if v_tt = 'da_nop' then raise exception 'Bài đã nộp — không sửa kết quả được nữa.'; end if;
  if p_kq is null then
    delete from bai_lam_cau where bai_lam_id = v_bl and bai_test_cau_id = k.id;
    return jsonb_build_object('kq', null);
  end if;
  v_verdict := case p_kq when 'D' then 'correct' when 'C' then 'partial' else 'wrong' end;
  v_diem := case p_kq when 'D' then coalesce(k.diem, 1) when 'C' then coalesce(k.diem, 1) * 0.5 else 0 end;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (v_bl, k.id, to_jsonb(p_kq || ' (TA nhập)'), v_verdict, v_diem, 'manual', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual', cham_at = now();
  return jsonb_build_object('kq', p_kq);
end $$;
revoke execute on function public.fn_btnhe_nhap_dcs(uuid, text) from public, anon;
grant execute on function public.fn_btnhe_nhap_dcs(uuid, text) to authenticated;
