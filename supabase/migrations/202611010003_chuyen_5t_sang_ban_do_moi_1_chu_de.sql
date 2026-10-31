-- Chuyển bản đồ 5T cũ (dai_ban_do: chủ đề › chuyên đề › dạng) sang bản đồ MỚI với 1 chủ đề duy nhất
-- "Bài toán tỉ số" (Thùy chốt 31/10, gật xoá 01/11):
--   bản mới:  Chủ đề (1)  ›  Chuyên đề  ›  Nhóm bài  ›  Dạng bài
--   từ bản cũ:            ‹ chủ đề cũ › ‹ chuyên đề cũ › ‹ dạng cũ ›
-- Xoá phần bản đồ mới 5T đang có (2 chủ đề NCD00145/NCD00146 + ô + 22 nhóm + 12 dạng bài + 160 câu gán + 5 đề xuất
-- + 7 đối ứng cụm + chuyên đề mồ côi) rồi dựng lại từ bản cũ. Câu giữ nguyên mã; câu đi theo dạng cũ qua dai_bdm_doi_ung.
-- Mã chủ đề/chuyên đề/nhóm/dạng bài sinh mới 1 lần (mã gốc bất biến, CLAUDE.md §2).

do $$
declare
  v_cd   text;
  v_old  text[] := array['NCD00145','NCD00146'];
  r_cd   record;
  r_ch   record;
  r_dang record;
  v_ch   text;
  v_nhom text;
  v_db   text;
  i_cd   int := 0;
  i_ch   int;
  i_dang int;
  n_dang int := 0;
  n_chk  int;
begin
  -- 1. XOÁ bản đồ mới 5T đang có (lá → gốc)
  delete from dai_bdm_gan_cau     where dang_bai_id in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = any(v_old));
  delete from dai_bdm_de_xuat     where dang_bai_id in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = any(v_old));
  delete from dai_bdm_doi_ung_cum where dang_bai_id in (select d.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = any(v_old));
  delete from dai_bdm_dang_bai    where nhom_id in (select id from dai_bdm_nhom where chu_de_id = any(v_old));
  delete from dai_bdm_nhom_tien_de where nhom_id in (select id from dai_bdm_nhom where chu_de_id = any(v_old))
                                      or tien_de_nhom_id in (select id from dai_bdm_nhom where chu_de_id = any(v_old));
  delete from dai_bdm_nhom        where chu_de_id = any(v_old);
  create temp table _ch_cu on commit drop as select chuyen_de_id from dai_bdm_o where chu_de_id = any(v_old);
  delete from dai_bdm_o           where chu_de_id = any(v_old);
  delete from dai_bdm_chu_de      where id = any(v_old);
  delete from dai_bdm_chuyen_de   where id in (select chuyen_de_id from _ch_cu)
                                    and not exists (select 1 from dai_bdm_o o where o.chuyen_de_id = dai_bdm_chuyen_de.id);

  -- 2. DỰNG: 1 chủ đề
  insert into dai_bdm_chu_de (khoi, ten, nhanh) values ('5T', 'Bài toán tỉ số', 'toan') returning id into v_cd;

  -- chủ đề cũ → chuyên đề ; chuyên đề cũ → nhóm bài ; dạng cũ → dạng bài
  for r_cd in
    select ma_chu_de, min(ten_chu_de) ten from dai_ban_do
     where khoi = '5T' and xoa_at is null and ma_chu_de <> 'T15T00' group by ma_chu_de order by ma_chu_de
  loop
    i_cd := i_cd + 1;
    insert into dai_bdm_chuyen_de (ten) values (r_cd.ten) returning id into v_ch;
    insert into dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values (v_cd, v_ch, i_cd);
    i_ch := 0;
    for r_ch in
      select b.ma_chuyen_de, min(b.ten_chuyen_de) ten, (array_agg(lt.noi_dung) filter (where lt.noi_dung is not null))[1] lt
        from dai_ban_do b left join dai_chuyen_de_ly_thuyet lt on lt.ma_chuyen_de = b.ma_chuyen_de
       where b.khoi = '5T' and b.xoa_at is null and b.ma_chu_de = r_cd.ma_chu_de
       group by b.ma_chuyen_de order by b.ma_chuyen_de
    loop
      i_ch := i_ch + 1;
      insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, ly_thuyet, thu_tu)
      values (v_cd, v_ch, r_ch.ten, coalesce(r_ch.lt, ''), i_ch) returning id into v_nhom;
      i_dang := 0;
      for r_dang in
        select b.ma_dang, b.ten_dang, b.muc_do, b.bac_toi_thieu, b.mo_ta_ngan,
               coalesce(l.noi_dung, '') lt, l.file_url, l.ten_file
          from dai_ban_do b left join dai_dang_ly_thuyet l on l.ma_dang = b.ma_dang
         where b.khoi = '5T' and b.xoa_at is null and b.ma_chuyen_de = r_ch.ma_chuyen_de
         order by b.ma_dang
      loop
        i_dang := i_dang + 1;
        insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, muc_do, bac_toi_thieu, thu_tu)
        values (v_nhom, r_dang.ten_dang, coalesce(r_dang.mo_ta_ngan, ''), r_dang.lt, r_dang.file_url, r_dang.ten_file,
                r_dang.muc_do, r_dang.bac_toi_thieu, i_dang)
        returning id into v_db;
        -- câu đi theo dạng cũ → dạng bài mới (không đụng dang_chinh, không ghi từng câu)
        insert into dai_bdm_doi_ung (ma_dang_cu, dich_dang_bai) values (r_dang.ma_dang, v_db);
        n_dang := n_dang + 1;
      end loop;
    end loop;
  end loop;

  -- 3. KIỂM: số dạng bài mới = số dạng cũ (trừ "Chưa phân dạng")
  select count(*) into n_chk from dai_ban_do where khoi = '5T' and xoa_at is null and ma_chu_de <> 'T15T00';
  if n_dang <> n_chk or n_dang <> 28 then
    raise exception 'Chuyển 5T lệch: dựng % dạng bài, bản cũ có % (kỳ vọng 28)', n_dang, n_chk;
  end if;
end $$;
