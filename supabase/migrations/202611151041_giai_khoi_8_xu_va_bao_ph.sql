-- ============================================================================
-- 202611151041 — Giải tháng: LỚP 8 cũng có xu (phần 1/2; phần báo app phụ huynh ở mig 202611151055)
-- Thùy 15/11 (sau khi đã bấm "Chốt kết quả tháng" tháng 10 lúc 10:21): "M hãy làm thông báo cho App HS và app PH luôn đi" · "lớp 8 cũng có xu giải nhé".
-- ----------------------------------------------------------------------------
-- (1) giai_thuong_gia_tri: khối 3–7 → 3–8, vẫn 30 xu/giải. Áp cho lượt công bố từ nay + vá lượt tháng 10 vừa công bố:
--     9 giải lớp 8 tháng 10 đang 'khong_xu' ⇒ 'tu_dong' 30 xu, ghi sổ xu (ref_id = giai_thuong_id, on conflict không cộng trùng),
--     sửa lời tin app HS (chưa em nào đọc) thêm câu "Phần thưởng 30 xu đã vào ví của em." KHÔNG cộng bù tháng 8, 9 (lớp 8 khi đó trao tiền mặt).
-- (2) Báo app phụ huynh tách sang mig 202611151055: bảng thong_bao_ph do postgres sở hữu (tạo ở SQL Editor) ⇒ claude_build không ALTER/INSERT được.
-- MẤT GÌ (Luật xoá): không xoá gì. Sửa 1 dòng cấu hình, sửa 9 dòng hs_giai_thuong + 9 lời tin app HS, thêm 9 dòng sổ xu (270 xu).
-- ============================================================================

-- (1) Lớp 8 có xu
do $$
declare n int;
begin
  update public.giai_thuong_gia_tri set khoi_den = 8,
         ghi_chu = 'Mỗi giải tháng khối 3–8 = 30 xu (Thùy 17/10; thêm lớp 8 ngày 15/11). Khối 9–12 trao tiền mặt ⇒ không có dòng = 0 xu.'
   where khoi_tu = 3 and khoi_den = 7;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'giai_thuong_gia_tri: % ≠ 1 dòng', n; end if;
end $$;

-- Vá tháng 10: 9 giải lớp 8 ⇒ 30 xu + lời tin app HS
do $$
declare n int;
begin
  with g as (
    update public.hs_giai_thuong set xu = 30, xu_ghi = 'tu_dong'
     where thang = '2026-10-01' and xu_ghi = 'khong_xu' and public._giai_xu(khoi) > 0
    returning giai_thuong_id, hoc_sinh_id, thang, loai_giai
  ), so as (
    insert into public.qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, ref_id, ref_loai)
    select g.hoc_sinh_id, 30, 'giai_thuong',
           'Giải ' || case g.loai_giai when 'xuat_sac' then 'Xuất sắc' when 'tien_bo' then 'Tiến bộ' else 'Chăm chỉ' end
             || ' tháng ' || to_char(g.thang, 'FMMM') || '/' || to_char(g.thang, 'YYYY'),
           g.giai_thuong_id, 'giai_thuong'
    from g
    on conflict (ref_id) where loai = 'giai_thuong' do nothing
    returning 1
  ), tin as (
    update public.hs_tin_moi t set noi_dung = t.noi_dung || ' Phần thưởng 30 xu đã vào ví của em.'
    from g where t.hoc_sinh_id = g.hoc_sinh_id and t.ref = 'giai:' || g.giai_thuong_id and t.noi_dung not like '%xu đã vào ví%'
    returning 1
  )
  select (select count(*) from so) into n;
  if n <> 9 then raise exception 'lớp 8 tháng 10: cộng % ≠ 9 giải', n; end if;
end $$;

