-- 202610101607 — hs_bao_loi_cau_con_lai: số báo cáo còn lại hôm nay đếm SAU khi ghi (báo lặp cùng lý do không đẻ dòng ⇒ trước đó trừ oan 1).
-- MẤT GÌ: không mất gì — thay thân 1 hàm.
create or replace function public.fn_hs_bao_loi_cau(p_bai_test_cau_id uuid, p_ly_do text, p_ghi_chu text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_ma text; v_mon text; v_bt uuid; v_ghi text := nullif(btrim(coalesce(p_ghi_chu, '')), '');
  v_da integer; v_id uuid;
  v_han constant integer := 10;   -- báo cáo / HS / ngày (Thùy 10/10)
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_ly_do not in ('thieu_du_kien', 'hinh_loi', 'cong_thuc_loi', 'dap_an_sai', 'loi_giai_sai', 'khac') then raise exception 'Lý do không hợp lệ.' using errcode = '22023'; end if;
  if p_ly_do = 'khac' and (v_ghi is null or length(v_ghi) < 5) then raise exception 'Em viết thêm vài chữ cho thầy cô hiểu nhé.' using errcode = '22023'; end if;
  if v_ghi is not null and length(v_ghi) > 500 then raise exception 'Ghi chú tối đa 500 chữ.' using errcode = '22023'; end if;

  select c.ma_cau, t.mon, t.id into v_ma, v_mon, v_bt
    from bai_test_cau c join bai_test t on t.id = c.bai_test_id
   where c.id = p_bai_test_cau_id
     and (t.hoc_sinh_id = v_hs or exists (select 1 from bai_lam b where b.bai_test_id = t.id and b.hoc_sinh_id = v_hs));
  if v_ma is null then raise exception 'Không tìm thấy câu này trong bài của em.' using errcode = 'P0002'; end if;

  select count(*) into v_da from bai_cau_bao_loi where hoc_sinh_id = v_hs and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  if v_da >= v_han then raise exception 'Hôm nay em đã báo % câu rồi, mai em báo tiếp nhé. Cảm ơn em!', v_han using errcode = 'P0001'; end if;

  insert into bai_cau_bao_loi (hoc_sinh_id, mon, ma_cau, bai_test_cau_id, ly_do, ghi_chu)
  values (v_hs, v_mon, v_ma, p_bai_test_cau_id, p_ly_do, v_ghi)
  on conflict (hoc_sinh_id, mon, ma_cau, ly_do) where trang_thai = 'moi' do update set ghi_chu = coalesce(excluded.ghi_chu, bai_cau_bao_loi.ghi_chu)
  returning id into v_id;
  select count(*) into v_da from bai_cau_bao_loi where hoc_sinh_id = v_hs and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  return jsonb_build_object('id', v_id, 'con_lai_hom_nay', greatest(0, v_han - v_da));
end $$;
