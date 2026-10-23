-- ============================================================================
-- 202610231718 — mastery_bdm_cau_xoa_theo_ma_chep (thực chất: câu đã xoá theo câu anh em cùng dạng cũ)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Phiên B3 đo 23/10: 108/255 câu đã đo (K6–8, K10–12) chưa quy được về dạng bài mới là câu ĐÃ XOÁ khỏi kho (xoa_at) — 1.369 lượt
--   HS làm thật. Màn duyệt không hiện câu đã xoá ⇒ không gán/đề xuất được cho chúng (ghi dòng đề xuất khuất = không ai duyệt — từ chối).
--   Đo: dạng cũ của các câu này gắn vào NHÓM (không phải 1 dạng bài) ⇒ luật mã chép không cứu được câu nào. Thêm luật ANH EM:
--   mọi câu CÒN SỐNG cùng dạng cũ đã quy về ĐÚNG 1 dạng bài ⇒ câu ĐÃ XOÁ chưa quy được theo dạng bài đó (37 câu · 263 lượt); anh em rải ≥2
--   dạng bài ⇒ để trống (71 câu · ~1.100 lượt — xếp phải đọc nội dung, mà câu đã xoá không lên màn duyệt). Ngoài ra như mastery CŨ
--   (tính qua mã dạng CHÉP lúc đo). Đã thử đường MÃ CHÉP cho câu chưa quy được: cứu 0 câu mà làm chậm (7A1 1,5 s → 7,5 s) ⇒ BỎ;
--   chỉ giữ luật anh em, và chỉ cho câu ĐÃ XOÁ. Cấp 1 giữ nguyên.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay thân _do_o_bdm; câu đã quy được KHÔNG đổi (chỉ câu đang NULL có thêm đường).
-- ============================================================================

create or replace function _do_o_bdm(p_ma_cau text, p_ma_dang_chep text) returns text
language plpgsql stable security definer set search_path to 'public' as $$
declare r record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select b.khoi, d.dang_bai_id, c.xoa_at is not null as da_xoa into r
      from dai_cau_hoi c
      left join dai_ban_do b on b.ma_dang = c.dang_chinh
      left join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if r.khoi in ('3', '4', '4T', '5', '5T') then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      -- câu ĐÃ XOÁ chưa quy được (không lên màn duyệt): mọi câu CÒN SỐNG cùng dạng cũ đã quy về ĐÚNG 1 dạng bài ⇒ theo dạng bài đó;
      -- anh em rải ≥2 dạng bài ⇒ NULL (không đoán — §1.5)
      -- Anh em = câu CÒN SỐNG cùng dạng cũ, đọc THẲNG bảng gán + đề xuất (index) — qua view bdm_cau_dang thì mỗi lần gọi tra lại
      -- view cho từng anh em (7A1: 1,5 s → 7 s). Bỏ qua anh em chỉ quy được qua câu gốc / cụm (hiếm, chấp nhận).
      select min(x.db) into v
        from dai_cau_hoi c
        join dai_cau_hoi s on s.dang_chinh = c.dang_chinh and s.xoa_at is null
        cross join lateral (select g.dang_bai_id as db from dai_bdm_gan_cau g where g.ma_cau = s.ma_cau
                            union all select dx.dang_bai_id from dai_bdm_de_xuat dx where dx.ma_cau = s.ma_cau) x
       where c.ma_cau = p_ma_cau
      having count(distinct x.db) = 1;
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
  if v_khoi is null or v_khoi in ('3', '4', '4T', '5', '5T') then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $$;
