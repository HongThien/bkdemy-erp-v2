-- ============================================================================
-- nt_xu_bo_tran_ngay — NÔNG TRẠI: BỎ TRẦN XU THEO NGÀY, CHỈ GIỮ 20 XU/THÁNG (Thùy 13/10)
-- ----------------------------------------------------------------------------
-- Thùy: "1 ngày có thể 10 phút. Không có trần 1 ngày do có cây trồng 3 ngày mới xong mà. Nhưng trung bình 1 tháng 20 xu là được."
--   ⇒ cây 3 ngày mới chín nên xu về theo cục, trần ngày sẽ cắt oan. Giữ MỘT trần: xu_toi_da_thang (20).
--   Điều kiện còn lại: tháng đó em đã có ≥ 1 ngày chơi ≥ xu_phut_toi_thieu phút (server tự đo ở nt_gio_choi) — chặn tài khoản không chơi mà vẫn nhận.
-- THAY ĐỔI: xu_toi_da_ngay = 0 nghĩa là KHÔNG GIỚI HẠN THEO NGÀY (đặt 0 làm mặc định) · thay thân fn_nt_xu_dong_bo. Không động dòng ví nào.
-- ============================================================================
alter table public.nt_cau_hinh alter column xu_toi_da_ngay set default 0;
update public.nt_cau_hinh set xu_toi_da_ngay = 0 where id = 1;

create or replace function public.fn_nt_xu_dong_bo(p_thang_k integer, p_ra integer)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); c nt_cau_hinh; v_ngay date := public._nt_ngay(clock_timestamp());
  v_ym text; v_k integer; v_ngay_choi integer; v_tran integer; v_duoc integer; v_da integer; v_them integer;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.' using errcode = '42501'; end if;
  if p_ra is null or p_ra < 0 or p_ra > 100000 then raise exception 'Số liệu không hợp lệ.' using errcode = '22023'; end if;
  select * into c from nt_cau_hinh where id = 1;
  v_ym := to_char(v_ngay, 'YYYY-MM');
  v_k := extract(year from v_ngay)::int * 12 + extract(month from v_ngay)::int - 1;
  if p_thang_k is distinct from v_k then return jsonb_build_object('ok', false, 'loi', 'lech_thang'); end if;
  perform pg_advisory_xact_lock(hashtext('nt_xu:' || v_hs::text));
  select count(*)::int into v_ngay_choi from nt_gio_choi
   where hoc_sinh_id = v_hs and to_char(ngay, 'YYYY-MM') = v_ym and giay >= c.xu_phut_toi_thieu * 60;
  select da_nhan into v_da from nt_xu where hoc_sinh_id = v_hs and thang = v_ym;
  v_da := coalesce(v_da, 0);
  -- trần tháng; nếu cấu hình còn đặt trần ngày (>0) thì áp thêm, 0 = không giới hạn ngày
  v_tran := case when v_ngay_choi = 0 then 0
                 when c.xu_toi_da_ngay > 0 then least(c.xu_toi_da_thang, v_ngay_choi * c.xu_toi_da_ngay)
                 else c.xu_toi_da_thang end;
  v_duoc := least(v_tran, p_ra);
  v_them := greatest(0, v_duoc - v_da);
  if v_them > 0 then
    insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, thang) values (v_hs, v_them, 'nong_trai', 'Nông trại BK', v_ym);
    insert into nt_xu (hoc_sinh_id, thang, da_nhan) values (v_hs, v_ym, v_da + v_them)
      on conflict (hoc_sinh_id, thang) do update set da_nhan = excluded.da_nhan, cap_nhat = now();
    v_da := v_da + v_them;
  end if;
  return jsonb_build_object('ok', true, 'da_nhan', v_da, 'nhan_them', v_them, 'tran_thang', c.xu_toi_da_thang,
                            'xu_moi_ngay', c.xu_toi_da_ngay, 'ngay_choi', v_ngay_choi, 'duoc_toi_nay', v_tran);
end $$;
