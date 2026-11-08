-- ============================================================================
-- _de_thi_dang_moi tra THẲNG từng khoá thay vì gọi _bdm_cau_giai (mig 202610201623).
-- Vì sao: _bdm_cau_giai quét MỌI câu của dạng cũ + RLS từng dòng; gọi cho từng câu × 25 đề trong fn_de_thi_ds
-- ⇒ phiên đăng nhập thật chạm trần 8s ("canceling statement due to statement timeout") khi lọc Khảo sát.
-- Cùng thứ tự ưu tiên như _bdm_cau_giai: gán câu > gán câu gốc > gán cụm (cụm của câu, không có thì của gốc)
-- > dạng cũ đối ứng ĐÚNG 1 chỗ và chỗ đó là dạng bài. Mọi bước là tra khoá có chỉ mục.
-- ============================================================================
create or replace function public._de_thi_dang_moi(p_kho text, p_ma_cau text)
returns table(he text, loai text, id text, ten text, chu_de_id text, chu_de text)
language plpgsql stable set search_path to 'public' as $$
declare v_loai text; v_goc text; v_dang text; v_cum text; v_id text;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') then he := 'cu'; return next; return; end if;
  he := 'moi';
  if p_kho = 'dai' then
    select c.loai_cau, coalesce(c.parent_ma_cau, c.ma_cau), c.dang_chinh, c.ma_cum into v_loai, v_goc, v_dang, v_cum
      from dai_cau_hoi c where c.ma_cau = p_ma_cau;
  else
    select c.loai_cau, coalesce(c.parent_ma_cau, c.ma_cau), c.dang_chinh into v_loai, v_goc, v_dang
      from hgt_cau_hoi c where c.ma_cau = p_ma_cau;
  end if;
  if not found then return next; return; end if;

  if v_loai = 'dung_sai' then
    loai := 'chu_de';
    if p_kho = 'dai' then
      select k.chu_de_id into v_id from dai_bdm_kho_ds k where k.ma_cau in (v_goc, p_ma_cau) order by (k.ma_cau = p_ma_cau) desc limit 1;
    else
      select k.chu_de_id into v_id from hgt_bdm_kho_ds k where k.ma_cau in (v_goc, p_ma_cau) order by (k.ma_cau = p_ma_cau) desc limit 1;
    end if;
    if v_id is not null then
      select cd.id, cd.ten, cd.id, cd.ten into id, ten, chu_de_id, chu_de from dai_bdm_chu_de cd where cd.id = v_id;
    end if;
  else
    loai := 'dang_bai';
    if p_kho = 'dai' then
      if v_cum is null and v_goc <> p_ma_cau then select g.ma_cum into v_cum from dai_cau_hoi g where g.ma_cau = v_goc; end if;
      select coalesce(
        (select a.dang_bai_id from dai_bdm_gan_cau a where a.ma_cau = p_ma_cau),
        (select b.dang_bai_id from dai_bdm_gan_cau b where b.ma_cau = v_goc and v_goc <> p_ma_cau),
        (select u.dang_bai_id from dai_bdm_doi_ung_cum u where u.ma_cum_cu = v_cum),
        (select min(d.dich_dang_bai) from dai_bdm_doi_ung d where d.ma_dang_cu = v_dang
          having count(*) = 1 and count(d.dich_dang_bai) = 1)
      ) into v_id;
    else
      select coalesce((select a.dang_bai_id from hgt_bdm_gan_cau a where a.ma_cau = p_ma_cau),
                      (select b.dang_bai_id from hgt_bdm_gan_cau b where b.ma_cau = v_goc and v_goc <> p_ma_cau)) into v_id;
    end if;
    if v_id is not null then
      select d.id, d.ten, cd.id, cd.ten into id, ten, chu_de_id, chu_de
        from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
       where d.id = v_id;
    end if;
  end if;
  return next;
end $$;
