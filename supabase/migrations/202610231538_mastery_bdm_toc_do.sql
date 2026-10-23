-- ============================================================================
-- 202610231538 — mastery_bdm_toc_do
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Đo 23/10: mastery theo bản đồ mới chậm 4–8 lần bản cũ (11A1, 13 HS: cũ 1,6 s · mới 12 s — quá trần 8 s của app). Nghẽn ở
--   `_do_o_bdm` gọi cho TỪNG cặp (câu, mã chép): view `bdm_cau_dang` gom (GROUP BY) cả bảng dai_bdm_doi_ung mỗi lần gọi; hàm chạy
--   3–4 câu lệnh / cặp. Sửa: (1) bước "dạng cũ gắn đúng 1 dạng bài" thành LATERAL tra đúng mã dạng (index dai_bdm_doi_ung_uniq
--   bắt đầu bằng ma_dang_cu); (2) `_do_o_bdm` gộp tra câu Đại + dạng bài vào 1 câu lệnh, HGT 1 câu lệnh. Kết quả KHÔNG đổi
--   (kiểm lại 3000 cặp + scripts/_test_mastery_bdm*.mjs).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay định nghĩa view + thân 2 hàm, cùng kết quả.
-- ============================================================================

create or replace view bdm_cau_dang as
  select q.ma_cau, 'dai'::text as kho,
         coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db, dx.dang_bai_id) as dang_bai_id,
         case when gc.ma_cau is not null or gg.ma_cau is not null then 'gan_cau'
              when cu.ma_cum_cu is not null then 'gan_cum'
              when mot.db is not null then 'doi_ung'
              when dx.ma_cau is not null then 'de_xuat' end as nguon
    from dai_cau_hoi q
    left join dai_cau_hoi g on g.ma_cau = q.parent_ma_cau
    left join dai_bdm_gan_cau gc on gc.ma_cau = q.ma_cau
    left join dai_bdm_gan_cau gg on gg.ma_cau = q.parent_ma_cau
    left join dai_bdm_doi_ung_cum cu on cu.ma_cum_cu = coalesce(q.ma_cum, g.ma_cum)
    left join lateral (   -- dạng cũ gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài
      select min(d.dich_dang_bai) as db from dai_bdm_doi_ung d where d.ma_dang_cu = q.dang_chinh
      having count(*) = 1 and count(d.dich_dang_bai) = 1
    ) mot on true
    left join dai_bdm_de_xuat dx on dx.ma_cau = q.ma_cau
   where coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db, dx.dang_bai_id) is not null
  union all
  select h.ma_cau, 'hgt', coalesce(gc.dang_bai_id, dx.dang_bai_id),
         case when gc.ma_cau is not null then 'gan_cau' else 'de_xuat' end
    from hgt_cau_hoi h
    left join hgt_bdm_gan_cau gc on gc.ma_cau = h.ma_cau
    left join hgt_bdm_de_xuat dx on dx.ma_cau = h.ma_cau
   where coalesce(gc.dang_bai_id, dx.dang_bai_id) is not null;

create or replace function _do_o_bdm(p_ma_cau text, p_ma_dang_chep text) returns text
language plpgsql stable security definer set search_path to 'public' as $$
declare r record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select b.khoi, d.dang_bai_id into r
      from dai_cau_hoi c
      left join dai_ban_do b on b.ma_dang = c.dang_chinh
      left join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if r.khoi in ('3', '4', '4T', '5', '5T') then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      return r.dang_bai_id;
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
