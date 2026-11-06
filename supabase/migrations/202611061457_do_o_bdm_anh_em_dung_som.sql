-- "canceling statement due to statement timeout" khi Chốt tuần (Thùy 06/11, "rất hay gặp"). GỐC: fn_qlcl_lam_moi tính dạng yếu theo lô 10 em/1 câu lệnh (trần 8 s của role authenticated);
-- mỗi em Toán 12 tốn ~1,6 s vì _do_o_bdm quét cả 9.566 câu anh em của dạng cũ T112000000 cho từng câu ĐÃ XOÁ (kết quả luôn NULL). Lô quá 8 s ⇒ cả câu lệnh bị huỷ, KHÔNG lưu em nào ⇒ lần sau lặp lại y hệt.
-- Sửa _do_o_bdm: nhánh "câu đã xoá" dừng sớm khi thấy 2 dạng bài khác nhau (cùng kết quả, không đổi ngữ nghĩa).
CREATE OR REPLACE FUNCTION public._do_o_bdm(p_ma_cau text, p_ma_dang_chep text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select b.khoi, d.dang_bai_id, c.xoa_at is not null as da_xoa into r
      from dai_cau_hoi c
      left join dai_ban_do b on b.ma_dang = c.dang_chinh
      left join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if public._bdm_khoi_giu_cu(r.khoi) then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      -- câu ĐÃ XOÁ chưa quy được (không lên màn duyệt): mọi câu CÒN SỐNG cùng dạng cũ đã quy về ĐÚNG 1 dạng bài ⇒ theo dạng bài đó;
      -- anh em rải ≥2 dạng bài ⇒ NULL (không đoán — §1.5)
      -- Anh em = câu CÒN SỐNG cùng dạng cũ, đọc THẲNG bảng gán + đề xuất (index) — qua view bdm_cau_dang thì mỗi lần gọi tra lại
      -- view cho từng anh em (7A1: 1,5 s → 7 s). Bỏ qua anh em chỉ quy được qua câu gốc / cụm (hiếm, chấp nhận).
      -- 06/11: DỪNG SỚM — lấy 1 dạng bài bất kỳ rồi tìm 1 anh em KHÁC dạng; thấy là thôi (NULL). Trước đây quét hết anh em rồi count(distinct):
      -- dạng cũ chung T112000000 (Toán 12) có 9.566 anh em ⇒ 82 ms/lần × ~20 câu xoá/em = 1,6 s/em ⇒ lô 10 em > 8 s ⇒ "statement timeout" khi Chốt tuần.
      -- Cùng kết quả: đúng 1 dạng bài khác nhau ⇒ dạng đó; ≥2 hoặc 0 ⇒ NULL.
      select f.db into v
        from (select x.db
                from dai_cau_hoi c
                join dai_cau_hoi s on s.dang_chinh = c.dang_chinh and s.xoa_at is null
                cross join lateral (select g.dang_bai_id as db from dai_bdm_gan_cau g where g.ma_cau = s.ma_cau
                                    union all select dx.dang_bai_id from dai_bdm_de_xuat dx where dx.ma_cau = s.ma_cau) x
               where c.ma_cau = p_ma_cau and x.db is not null limit 1) f
       where not exists (select 1
                from dai_cau_hoi c2
                join dai_cau_hoi s2 on s2.dang_chinh = c2.dang_chinh and s2.xoa_at is null
                cross join lateral (select g2.dang_bai_id as db from dai_bdm_gan_cau g2 where g2.ma_cau = s2.ma_cau
                                    union all select dx2.dang_bai_id from dai_bdm_de_xuat dx2 where dx2.ma_cau = s2.ma_cau) x2
               where c2.ma_cau = p_ma_cau and x2.db is not null and x2.db <> f.db);
      return v;
    end if;
    select d.dang_bai_id into r
      from hgt_cau_hoi h left join bdm_cau_dang d on d.kho = 'hgt' and d.ma_cau = h.ma_cau
     where h.ma_cau = p_ma_cau;
    if found then return r.dang_bai_id; end if;
  end if;
  -- lượt đo không có mã câu, hoặc câu không (còn) ở kho Đại/HGT: theo mã dạng chép lúc đo — quy về dạng cũ CÒN SỐNG trước.
  v := _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep);
  select b.khoi into v_khoi from dai_ban_do b where b.ma_dang = v;
  if v_khoi is null or public._bdm_khoi_giu_cu(v_khoi) then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $function$;

-- Lớp chặn cấu trúc: fn_qlcl_lam_moi làm theo hộp thời gian (~4 s), lưu tiến độ từng em, client lặp tới khi hết em cũ.
CREATE OR REPLACE FUNCTION public.fn_qlcl_lam_moi(p_mon text, p_khoi text, p_toi_da integer DEFAULT 10)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_moc date := public._btyeu_moc_2_cua_so(); v_dang jsonb; v_t0 timestamptz := clock_timestamp();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  for v_hs in select hoc_sinh_id from public._qlcl_hs_can_tinh(p_mon, p_khoi) limit greatest(1, least(coalesce(p_toi_da, 10), 30)) loop
    -- 06/11 HỘP THỜI GIAN: role authenticated có trần 8 s/câu lệnh; quá trần là HUỶ CẢ LÔ (không lưu em nào ⇒ lần sau lặp y hệt). Tính xong em nào lưu em đó,
    -- hết ~4 s thì dừng và trả số em còn cũ — client gọi lại cho tới khi 0. Luôn tính ≥1 em mỗi lần gọi (để chắc chắn tiến).
    exit when clock_timestamp() - v_t0 > interval '4 seconds';
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', d.ma_dang, 'ten_dang', d.ten_dang, 'score', round(d.score, 2), 'n', d.n) order by d.score), '[]'::jsonb)
      into v_dang from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, p_mon) d;
    insert into dang_yeu_hien_tai (mon, hoc_sinh_id, so_dang_yeu, dang, moc, tinh_at)
      values (p_mon, v_hs, jsonb_array_length(v_dang), v_dang, v_moc, now())
      on conflict (mon, hoc_sinh_id) do update set so_dang_yeu = excluded.so_dang_yeu, dang = excluded.dang, moc = excluded.moc, tinh_at = excluded.tinh_at;
  end loop;
  return (select count(*) from public._qlcl_hs_can_tinh(p_mon, p_khoi));
end $function$;
