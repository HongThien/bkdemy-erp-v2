-- ============================================================================
-- 202610101427 — k8t_kien_thuc_co_ban
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 10/10 (sau khi xem lô 1 của kho 8T):
--   (2) "Có [nhập bài cơ bản]. Chỉ là không chung với khối 8 thường. Bài tập cơ bản cho vào 1 chuyên đề — gọi là kiến thức cơ bản đi."
--       ⇒ MỘT chuyên đề dùng chung "Kiến thức cơ bản" (mô hình 4 tầng cho phép một chuyên đề có mặt ở nhiều chủ đề —
--       spec-ban-do-4-tang.md Q5), đứng đầu mỗi chủ đề; mỗi chủ đề có nhóm bài riêng theo bài học. Câu thuộc tầng "Bài tập cơ bản"
--       của sách xếp vào nhóm của BÀI HỌC chứa nó (luật máy, không cần hai lượt gán nhóm) — kho-rules/dai/k8T.md §6.2.
--       Trên bản đồ đang chạy (`dai_ban_do`) chuyên đề nằm trong một chủ đề ⇒ hai mã chuyên đề: T18T0106 (chủ đề 1), T18T0204 (chủ đề 2).
--       34 câu tầng cơ bản của lô 1 (bài 27–32, 39–43, 49–53 quyển Nguyễn Đức Tấn) đang nằm rải ở nhóm nâng cao ⇒ chuyển về nhóm cơ bản.
--   (4) "Đổi đi" — 12 câu CHỨNG MINH trong 50 câu cũ đang nằm ở nhóm "Tính giá trị biểu thức có điều kiện" ⇒ chuyển sang nhóm
--       "Chứng minh đẳng thức có điều kiện" (T18T010302). Mã câu KHÔNG đổi (mã cố định từ lúc sinh); trigger trg_log_doi_dang ghi vết.
--   `muc_do` / `bac_toi_thieu` của 7 nhóm cơ bản: tạm 2 / 'A' (hai cột NOT NULL) — CEO chỉnh ở màn Bản đồ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không xoá gì. ĐỔI `dang_chinh` của 46 câu (34 + 12) —
--   dạng cũ của từng câu nằm trong `kho_doi_dang_log`. Đổi thứ tự ô chuyên đề trong bản nháp của chủ đề 1 và 2 (lùi 1 để chuyên đề mới đứng đầu).
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

create temp table _k8t_cb (ma_dang text primary key, cd_ten text, n_tt int, n_ten text) on commit drop;
insert into _k8t_cb values
  ('T18T010601', 'Biến đổi biểu thức', 1, 'Cơ bản: Nhân, chia đa thức'),
  ('T18T010602', 'Biến đổi biểu thức', 2, 'Cơ bản: Hằng đẳng thức'),
  ('T18T010603', 'Biến đổi biểu thức', 3, 'Cơ bản: Phân tích đa thức thành nhân tử'),
  ('T18T010604', 'Biến đổi biểu thức', 4, 'Cơ bản: Phân thức đại số'),
  ('T18T020401', 'Phương trình và bất phương trình', 1, 'Cơ bản: Phương trình'),
  ('T18T020402', 'Phương trình và bất phương trình', 2, 'Cơ bản: Giải bài toán bằng cách lập phương trình'),
  ('T18T020403', 'Phương trình và bất phương trình', 3, 'Cơ bản: Bất phương trình');

do $$
declare
  r record; v_cd text; v_ch text; v_nh text; n int;
begin
  -- 1. bản đồ đang chạy
  insert into public.dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu)
  select k.ma_dang, '8T', left(k.ma_dang, 6), k.cd_ten, left(k.ma_dang, 8), 'Kiến thức cơ bản', k.n_ten, 2, 'A'
    from _k8t_cb k where not exists (select 1 from public.dai_ban_do b where b.ma_dang = k.ma_dang);

  -- 2. bản nháp: MỘT chuyên đề dùng chung, đứng đầu từng chủ đề
  select c.id into v_ch from public.dai_bdm_chuyen_de c
   where c.ten = 'Kiến thức cơ bản'
     and exists (select 1 from public.dai_bdm_o o join public.dai_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = c.id and cd.khoi = '8T');
  if v_ch is null then
    insert into public.dai_bdm_chuyen_de (ten, mo_ta) values ('Kiến thức cơ bản', 'Bài tập cơ bản của từng bài học (khối 8T) — xếp theo bài học chứa nó, không theo phương pháp')
    returning id into v_ch;
  end if;
  for r in select distinct cd_ten from _k8t_cb loop
    select id into v_cd from public.dai_bdm_chu_de where khoi = '8T' and ten = r.cd_ten;
    if v_cd is null then raise exception 'không thấy chủ đề 8T "%"', r.cd_ten; end if;
    if not exists (select 1 from public.dai_bdm_o where chu_de_id = v_cd and chuyen_de_id = v_ch) then
      update public.dai_bdm_o set thu_tu = thu_tu + 1 where chu_de_id = v_cd;
      insert into public.dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values (v_cd, v_ch, 1);
    end if;
  end loop;
  for r in select * from _k8t_cb order by ma_dang loop
    select id into v_cd from public.dai_bdm_chu_de where khoi = '8T' and ten = r.cd_ten;
    select d.dich_nhom into v_nh from public.dai_bdm_doi_ung d where d.ma_dang_cu = r.ma_dang and d.dich_nhom is not null;
    if v_nh is null then
      insert into public.dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, thu_tu) values (v_cd, v_ch, r.n_ten, r.n_tt) returning id into v_nh;
      insert into public.dai_bdm_doi_ung (ma_dang_cu, dich_nhom) values (r.ma_dang, v_nh);
    end if;
  end loop;

  -- 3. 34 câu tầng cơ bản của lô 1 → nhóm "Cơ bản: Phân tích đa thức thành nhân tử"
  update public.dai_cau_hoi c set dang_chinh = 'T18T010603'
   where c.xoa_at is null and c.ten_de_goc like 'CĐ BD HSG Toán 8 – Nguyễn Đức Tấn · D1.%'
     and substring(c.ten_de_goc from 'D1\.(\d+)')::int in (27, 28, 29, 30, 31, 32, 39, 40, 41, 42, 43, 49, 50, 51, 52, 53)
     and c.dang_chinh is distinct from 'T18T010603';
  get diagnostics n = row_count;
  if n <> 34 then raise exception 'chuyển câu cơ bản lô 1: cần đúng 34 câu, thấy %', n; end if;

  -- 4. 12 câu chứng minh của 50 câu cũ → nhóm "Chứng minh đẳng thức có điều kiện"
  update public.dai_cau_hoi set dang_chinh = 'T18T010302'
   where dang_chinh = 'T18T010301'
     and ma_cau in ('T18T010301004', 'T18T010301023', 'T18T010301024', 'T18T010301029', 'T18T010301034', 'T18T010301044',
                    'T18T010301045', 'T18T010301046', 'T18T010301047', 'T18T010301048', 'T18T010301049', 'T18T010301050');
  get diagnostics n = row_count;
  if n <> 12 then raise exception 'chuyển câu chứng minh: cần đúng 12 câu, thấy %', n; end if;
end $$;
