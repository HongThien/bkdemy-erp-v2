-- ============================================================================
-- 202610101403 — k8t_ban_do_3_tang
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 10/10 duyệt đề xuất chia tầng bản đồ khối 8T (kho-rules/dai/k8T.md §6.2): "OK Chia như thế đi. Xong add các bài vào kho đi."
--   8T học nâng cao là chính, bản đồ thô hơn khối 8: Đại – Số học – Tổ hợp = 5 chủ đề · 14 chuyên đề · 37 nhóm bài
--   (3 chuyên đề + 3 nhóm đã có giữ nguyên mã); Hình = 6 chuyên đề · 18 bài (6 bài đã có giữ nguyên mã).
--   Câu trong kho trỏ `dai_cau_hoi.dang_chinh → dai_ban_do.ma_dang` (bản đồ đang chạy), còn CEO soạn ở bản nháp `dai_bdm_*`
--   ⇒ mỗi nhóm bài mới phải có MẶT Ở CẢ HAI NƠI + một dòng đối ứng ② (dạng cũ → nhóm), đúng cách `scripts/bdm-chep-vo.mjs` đã làm
--   cho các khối khác — nếu chỉ thêm một bên thì câu nhập vào sẽ hiện "chưa gắn" ở màn Bản đồ mới.
--   Thêm luôn 2 dạng chờ của khối 8T (`T18T000000`, `HH8T000000` — đúng quy ước `_kho_dang_cho`) cho câu chưa chắc nhóm.
--
--   `muc_do` / `bac_toi_thieu` của 34 dạng mới: hai cột NOT NULL, CEO chưa cho giá trị ⇒ tạm 4 / 'A' (mức phổ biến nhất của
--   dạng nâng cao; 'A' không ẩn dạng với lớp nào trên bậc A). CEO chỉnh từng dạng ở màn Bản đồ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không xoá gì. ĐỔI TÊN 4 dòng (tên cũ ghi lại đây):
--   dai_ban_do T18T010101 + dai_bdm_nhom NNB01382: "Các bài toán ứng dụng hằng đẳng thức bình phương của tổng hiệu"
--   dai_ban_do T18T010301 + dai_bdm_nhom NNB01384: "Biến đổi các biểu thức đặc biệt" (tên CHUYÊN ĐỀ giữ nguyên)
--   hinh_hoc_bai HH00089: "Hình thang" · HH00094: "Đối xứng tâm"
--   Và đổi thứ tự ô chuyên đề "Biến đổi các biểu thức đặc biệt" trong chủ đề 1 của bản nháp: 3 → 5.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- ── A. ĐẠI SỐ · SỐ HỌC · TỔ HỢP ─────────────────────────────────────────────
create temp table _k8t (
  ma_dang text primary key, cd_tt int, cd_ten text, ch_tt int, ch_ten text, n_tt int, n_ten text
) on commit drop;

insert into _k8t (ma_dang, cd_tt, cd_ten, ch_tt, ch_ten, n_tt, n_ten) values
  ('T18T010101', 1, 'Biến đổi biểu thức', 1, 'Hằng đẳng thức', 1, 'Ứng dụng hằng đẳng thức: tính, rút gọn, chứng minh đẳng thức'),
  ('T18T010102', 1, 'Biến đổi biểu thức', 1, 'Hằng đẳng thức', 2, 'Đưa về tổng các bình phương'),
  ('T18T010201', 1, 'Biến đổi biểu thức', 2, 'Phân tích đa thức thành nhân tử', 1, 'Các phương pháp phân tích cơ bản'),
  ('T18T010202', 1, 'Biến đổi biểu thức', 2, 'Phân tích đa thức thành nhân tử', 2, 'Tách hạng tử, thêm bớt hạng tử'),
  ('T18T010203', 1, 'Biến đổi biểu thức', 2, 'Phân tích đa thức thành nhân tử', 3, 'Đổi biến, hệ số bất định, nhẩm nghiệm'),
  ('T18T010204', 1, 'Biến đổi biểu thức', 2, 'Phân tích đa thức thành nhân tử', 4, 'Đa thức nhiều biến: hoán vị vòng, đa thức đặc biệt'),
  ('T18T010401', 1, 'Biến đổi biểu thức', 3, 'Đa thức và phép chia đa thức', 1, 'Tìm dư: định lí Bê-du, sơ đồ Hoóc-ne'),
  ('T18T010402', 1, 'Biến đổi biểu thức', 3, 'Đa thức và phép chia đa thức', 2, 'Tìm hệ số để chia hết; chứng minh đa thức chia hết cho đa thức'),
  ('T18T010501', 1, 'Biến đổi biểu thức', 4, 'Phân thức đại số', 1, 'Rút gọn phân thức và các câu hỏi kèm theo'),
  ('T18T010502', 1, 'Biến đổi biểu thức', 4, 'Phân thức đại số', 2, 'Tổng, tích có quy luật'),
  ('T18T010301', 1, 'Biến đổi biểu thức', 5, 'Biến đổi các biểu thức đặc biệt', 1, 'Tính giá trị biểu thức có điều kiện'),
  ('T18T010302', 1, 'Biến đổi biểu thức', 5, 'Biến đổi các biểu thức đặc biệt', 2, 'Chứng minh đẳng thức có điều kiện'),
  ('T18T020101', 2, 'Phương trình và bất phương trình', 1, 'Phương trình một ẩn', 1, 'Phương trình đưa về bậc nhất, phương trình tích, chứa ẩn ở mẫu'),
  ('T18T020102', 2, 'Phương trình và bất phương trình', 1, 'Phương trình một ẩn', 2, 'Phương trình bậc cao'),
  ('T18T020103', 2, 'Phương trình và bất phương trình', 1, 'Phương trình một ẩn', 3, 'Phương trình có tham số'),
  ('T18T020104', 2, 'Phương trình và bất phương trình', 1, 'Phương trình một ẩn', 4, 'Phương trình chứa dấu giá trị tuyệt đối'),
  ('T18T020201', 2, 'Phương trình và bất phương trình', 2, 'Giải bài toán bằng cách lập phương trình', 1, 'Toán chuyển động'),
  ('T18T020202', 2, 'Phương trình và bất phương trình', 2, 'Giải bài toán bằng cách lập phương trình', 2, 'Năng suất – công việc và các loại khác'),
  ('T18T020301', 2, 'Phương trình và bất phương trình', 3, 'Bất phương trình', 1, 'Bất phương trình bậc nhất, có tham số'),
  ('T18T020302', 2, 'Phương trình và bất phương trình', 3, 'Bất phương trình', 2, 'Bất phương trình tích, thương, chứa dấu giá trị tuyệt đối'),
  ('T18T030101', 3, 'Bất đẳng thức và cực trị', 1, 'Chứng minh bất đẳng thức', 1, 'Xét hiệu, biến đổi tương đương'),
  ('T18T030102', 3, 'Bất đẳng thức và cực trị', 1, 'Chứng minh bất đẳng thức', 2, 'Dùng bất đẳng thức quen thuộc (Cô-si, Bu-nhi-a-cốp-xki)'),
  ('T18T030103', 3, 'Bất đẳng thức và cực trị', 1, 'Chứng minh bất đẳng thức', 3, 'Làm trội, phản chứng và các kỹ thuật khác'),
  ('T18T030201', 3, 'Bất đẳng thức và cực trị', 2, 'Giá trị lớn nhất, giá trị nhỏ nhất', 1, 'Giá trị lớn nhất, nhỏ nhất của đa thức'),
  ('T18T030202', 3, 'Bất đẳng thức và cực trị', 2, 'Giá trị lớn nhất, giá trị nhỏ nhất', 2, 'Giá trị lớn nhất, nhỏ nhất của phân thức, biểu thức chứa dấu giá trị tuyệt đối'),
  ('T18T030203', 3, 'Bất đẳng thức và cực trị', 2, 'Giá trị lớn nhất, giá trị nhỏ nhất', 3, 'Giá trị lớn nhất, nhỏ nhất có điều kiện ràng buộc'),
  ('T18T040101', 4, 'Số học', 1, 'Chia hết', 1, 'Chứng minh chia hết'),
  ('T18T040102', 4, 'Số học', 1, 'Chia hết', 2, 'Số dư, chữ số tận cùng, đồng dư'),
  ('T18T040103', 4, 'Số học', 1, 'Chia hết', 3, 'Tìm số, tìm điều kiện để chia hết'),
  ('T18T040201', 4, 'Số học', 2, 'Số nguyên tố, số chính phương', 1, 'Số nguyên tố, hợp số'),
  ('T18T040202', 4, 'Số học', 2, 'Số nguyên tố, số chính phương', 2, 'Chứng minh một số là (không là) số chính phương'),
  ('T18T040203', 4, 'Số học', 2, 'Số nguyên tố, số chính phương', 3, 'Tìm số để biểu thức là số chính phương'),
  ('T18T040301', 4, 'Số học', 3, 'Phương trình nghiệm nguyên', 1, 'Đưa về tích, dùng tính chia hết'),
  ('T18T040302', 4, 'Số học', 3, 'Phương trình nghiệm nguyên', 2, 'Dùng bất đẳng thức, xét số dư'),
  ('T18T040303', 4, 'Số học', 3, 'Phương trình nghiệm nguyên', 3, 'Dùng tính chất số chính phương'),
  ('T18T050101', 5, 'Tổ hợp và suy luận', 1, 'Nguyên lí Đi-rích-lê, nguyên lí cực hạn', 1, 'Đi-rích-lê trong số học và suy luận'),
  ('T18T050102', 5, 'Tổ hợp và suy luận', 1, 'Nguyên lí Đi-rích-lê, nguyên lí cực hạn', 2, 'Đi-rích-lê trong hình học tổ hợp');

do $$
declare
  r record; v_cd text; v_ch text; v_nh text;
begin
  -- A1. Bản đồ đang chạy: dạng chờ + dạng mới + đổi tên 2 dạng cũ
  insert into public.dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
  values ('T18T000000', '8T', 'T18T00', 'Chưa phân dạng', 'T18T0000', 'Chưa phân dạng', 'Chưa phân dạng', 1, 'C',
          'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).')
  on conflict (ma_dang) do nothing;

  insert into public.dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu)
  select k.ma_dang, '8T', left(k.ma_dang, 6), k.cd_ten, left(k.ma_dang, 8), k.ch_ten, k.n_ten, 4, 'A'
    from _k8t k
   where not exists (select 1 from public.dai_ban_do b where b.ma_dang = k.ma_dang);

  update public.dai_ban_do b set ten_dang = k.n_ten
    from _k8t k where k.ma_dang = b.ma_dang and b.ten_dang is distinct from k.n_ten;

  -- A2. Bản nháp "Bản đồ mới": chủ đề → chuyên đề (ô) → nhóm + đối ứng ②
  for r in select distinct cd_tt, cd_ten from _k8t order by cd_tt loop
    select id into v_cd from public.dai_bdm_chu_de where khoi = '8T' and ten = r.cd_ten;
    if v_cd is null then
      insert into public.dai_bdm_chu_de (khoi, ten, thu_tu) values ('8T', r.cd_ten, r.cd_tt) returning id into v_cd;
    end if;
  end loop;

  for r in select distinct cd_ten, ch_tt, ch_ten from _k8t order by cd_ten, ch_tt loop
    select id into v_cd from public.dai_bdm_chu_de where khoi = '8T' and ten = r.cd_ten;
    select o.chuyen_de_id into v_ch
      from public.dai_bdm_o o join public.dai_bdm_chuyen_de c on c.id = o.chuyen_de_id
     where o.chu_de_id = v_cd and c.ten = r.ch_ten;
    if v_ch is null then
      insert into public.dai_bdm_chuyen_de (ten) values (r.ch_ten) returning id into v_ch;
      insert into public.dai_bdm_o (chu_de_id, chuyen_de_id, thu_tu) values (v_cd, v_ch, r.ch_tt);
    else
      update public.dai_bdm_o set thu_tu = r.ch_tt where chu_de_id = v_cd and chuyen_de_id = v_ch and thu_tu is distinct from r.ch_tt;
    end if;
  end loop;

  for r in select * from _k8t order by ma_dang loop
    select id into v_cd from public.dai_bdm_chu_de where khoi = '8T' and ten = r.cd_ten;
    select o.chuyen_de_id into v_ch
      from public.dai_bdm_o o join public.dai_bdm_chuyen_de c on c.id = o.chuyen_de_id
     where o.chu_de_id = v_cd and c.ten = r.ch_ten;
    select d.dich_nhom into v_nh from public.dai_bdm_doi_ung d where d.ma_dang_cu = r.ma_dang and d.dich_nhom is not null;
    if v_nh is null then
      insert into public.dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, thu_tu) values (v_cd, v_ch, r.n_ten, r.n_tt) returning id into v_nh;
      insert into public.dai_bdm_doi_ung (ma_dang_cu, dich_nhom) values (r.ma_dang, v_nh);
    else
      update public.dai_bdm_nhom set ten = r.n_ten, thu_tu = r.n_tt
       where id = v_nh and (ten is distinct from r.n_ten or thu_tu is distinct from r.n_tt);
    end if;
  end loop;
end $$;

-- ── B. HÌNH HỌC (hinh_hoc_bai: chuyên đề → bài; ma_dang / ten_dang là cột SINH — không chèn tay) ──
insert into public.hinh_hoc_bai (ma_bai, khoi, ten_bai, thu_tu, da_duyet)
values ('HH8T000000', '8T', 'Chưa phân dạng — Hình học 8T', 0, false)
on conflict (ma_bai) do nothing;

update public.hinh_hoc_bai set ten_bai = 'Hình thang, đường trung bình' where ma_bai = 'HH00089' and ten_bai = 'Hình thang';
update public.hinh_hoc_bai set ten_bai = 'Đối xứng trục, đối xứng tâm' where ma_bai = 'HH00094' and ten_bai = 'Đối xứng tâm';
update public.hinh_hoc_bai set ma_chuyen_de = 'HH8T01', ten_chuyen_de = 'Tứ giác'
 where khoi = '8T' and ma_bai in ('HH00089', 'HH00090', 'HH00091', 'HH00092', 'HH00093', 'HH00094');

insert into public.hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet, ma_chuyen_de, ten_chuyen_de)
select '8T', v.ten_bai, v.thu_tu, false, v.ma_cd, v.ten_cd
  from (values
    ( 7, 'HH8T02', 'Tam giác', 'Tam giác cân, tam giác đều, tam giác vuông cân'),
    ( 8, 'HH8T02', 'Tam giác', 'Tính số đo góc (kẻ thêm hình)'),
    ( 9, 'HH8T03', 'Định lí Thalès và tam giác đồng dạng', 'Định lí Thalès'),
    (10, 'HH8T03', 'Định lí Thalès và tam giác đồng dạng', 'Tính chất đường phân giác'),
    (11, 'HH8T03', 'Định lí Thalès và tam giác đồng dạng', 'Tam giác đồng dạng'),
    (12, 'HH8T04', 'Chứng minh quan hệ hình học', 'Vuông góc, song song'),
    (13, 'HH8T04', 'Chứng minh quan hệ hình học', 'Thẳng hàng, đồng quy'),
    (14, 'HH8T05', 'Diện tích và tính toán', 'Diện tích đa giác, phương pháp diện tích'),
    (15, 'HH8T05', 'Diện tích và tính toán', 'Tính độ dài, góc (đặt ẩn, lập phương trình)'),
    (16, 'HH8T06', 'Cực trị và tập hợp điểm', 'Cực trị hình học'),
    (17, 'HH8T06', 'Cực trị và tập hợp điểm', 'Tìm tập hợp điểm'),
    (18, 'HH8T06', 'Cực trị và tập hợp điểm', 'Dựng hình')
  ) as v(thu_tu, ma_cd, ten_cd, ten_bai)
 where not exists (select 1 from public.hinh_hoc_bai b where b.khoi = '8T' and b.ten_bai = v.ten_bai)
 order by v.thu_tu;
