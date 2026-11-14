-- SỬA LỖI HIỆU NĂNG do mig 202611132043 / 132053 (bảng tra kho_cau_dang, 13/11) gây ra — phát hiện 14/11 khi đo thống kê câu lệnh.
-- Triệu chứng: mỗi dòng chèn / sửa / xoá ở <nhánh>_bdm_gan_cau, _bdm_de_xuat, _cau_hoi tốn thêm ~128 ms vì trigger đồng bộ bảng tra.
--   Đo: chèn 1 dòng dai_bdm_gan_cau 143 ms (trigger kho_cau_dang_gan 128 ms); chèn 50 dòng 7,2 s (6,7 s là trigger này).
--   Phiên nhập kho / phân dạng đang chạy bị chậm theo (lệnh chèn lô 65 s).
-- Nguyên nhân: (1) _kho_cau_dang_tinh viết một câu cho cả hai kiểu gọi với điều kiện "(p_ma is null or … = any(p_ma) or parent = any(p_ma))"
--   ⇒ không đi được index, quét cả ~96 nghìn câu mỗi lượt (~61 ms); (2) _kho_cau_dang_lam_lai xoá bằng "ma_cau = any(…) OR ma_cau in (truy vấn con)"
--   ⇒ quét cả bảng tra mỗi lượt.
-- Sửa: gọi CÓ khoá (kho + danh sách mã) ⇒ câu nhắm đích đi index (mã câu ∪ câu con của nó); gọi KHÔNG khoá (đối chiếu toàn bộ) ⇒ câu cũ nguyên văn.
--   Đo trước khi viết (chỉ đọc, 258 câu mẫu ở 3 kho, từng câu + cả lô): kết quả khớp 100%, ~61 ms → ~4 ms / lượt.
-- KHÔNG đổi: bảng, trigger, chữ ký hàm, kết quả. fn_kho_cau_dang_lech() (mục cứng của check:kien-truc) vẫn dùng nhánh câu cũ ⇒ là nhân chứng độc lập.

create or replace function public._kho_cau_dang_tinh(p_kho text default null::text, p_ma text[] default null::text[])
 returns table(kho text, ma_cau text, dang_bai_id text, nguon text)
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
begin
  if p_kho is not null and p_ma is not null then
    -- nhắm đích: các câu trong danh sách + các câu là bản sao của chúng (kế thừa dạng từ câu gốc)
    return query
    with q as (
      select x.kho, x.ma_cau, x.parent_ma_cau from public.v_kho_cau_hoi x where x.kho = p_kho and x.ma_cau = any (p_ma)
      union
      select x.kho, x.ma_cau, x.parent_ma_cau from public.v_kho_cau_hoi x where x.kho = p_kho and x.parent_ma_cau = any (p_ma)
    )
    select q.kho, q.ma_cau,
           coalesce(g.dang_bai_id, gg.dang_bai_id, d.dang_bai_id, dg.dang_bai_id),
           case when g.ma_cau is not null or gg.ma_cau is not null then 'gan_cau' else 'de_xuat' end
      from q
      left join public.v_kho_bdm_gan_cau g  on g.kho  = q.kho and g.ma_cau  = q.ma_cau
      left join public.v_kho_bdm_gan_cau gg on gg.kho = q.kho and gg.ma_cau = q.parent_ma_cau
      left join public.v_kho_bdm_de_xuat d  on d.kho  = q.kho and d.ma_cau  = q.ma_cau
      left join public.v_kho_bdm_de_xuat dg on dg.kho = q.kho and dg.ma_cau = q.parent_ma_cau
     where coalesce(g.ma_cau, gg.ma_cau, d.ma_cau, dg.ma_cau) is not null;
  else
    -- toàn bộ / cả một kho: câu cũ nguyên văn
    return query
    select q.kho, q.ma_cau,
           coalesce(g.dang_bai_id, gg.dang_bai_id, d.dang_bai_id, dg.dang_bai_id),
           case when g.ma_cau is not null or gg.ma_cau is not null then 'gan_cau' else 'de_xuat' end
      from public.v_kho_cau_hoi q
      left join public.v_kho_bdm_gan_cau g  on g.kho  = q.kho and g.ma_cau  = q.ma_cau
      left join public.v_kho_bdm_gan_cau gg on gg.kho = q.kho and gg.ma_cau = q.parent_ma_cau
      left join public.v_kho_bdm_de_xuat d  on d.kho  = q.kho and d.ma_cau  = q.ma_cau
      left join public.v_kho_bdm_de_xuat dg on dg.kho = q.kho and dg.ma_cau = q.parent_ma_cau
     where (p_kho is null or q.kho = p_kho)
       and (p_ma is null or q.ma_cau = any (p_ma) or q.parent_ma_cau = any (p_ma))
       and coalesce(g.ma_cau, gg.ma_cau, d.ma_cau, dg.ma_cau) is not null;
  end if;
end
$function$;

create or replace function public._kho_cau_dang_lam_lai(p_kho text, p_ma text[])
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_ah text[];   -- mã bị ảnh hưởng = danh sách + câu con (bản sao) của chúng
begin
  v_ah := p_ma || array(select q.ma_cau from public.v_kho_cau_hoi q where q.kho = p_kho and q.parent_ma_cau = any (p_ma));
  with moi as materialized (select * from public._kho_cau_dang_tinh(p_kho, p_ma)),
  xoa as (
    delete from public.kho_cau_dang t
     where t.kho = p_kho and t.ma_cau = any (v_ah)
       and not exists (select 1 from moi m where m.ma_cau = t.ma_cau)
    returning 1)
  insert into public.kho_cau_dang as t (kho, ma_cau, dang_bai_id, nguon)
  select m.kho, m.ma_cau, m.dang_bai_id, m.nguon from moi m
  on conflict (kho, ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon
   where t.dang_bai_id is distinct from excluded.dang_bai_id or t.nguon is distinct from excluded.nguon;
end
$function$;
