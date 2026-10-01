-- ============================================================================
-- 202609281833 — khung_ban_do_k12
-- ----------------------------------------------------------------------------
-- P1 LUỒNG KHO — Bản đồ khối 12 theo khung CEO chốt 28/09 (spec-ban-do-k12.md §2, §2b, §6):
--   chủ đề = CHƯƠNG SGK Kết nối tri thức · chuyên đề = BÀI SGK, lệch có chủ đích: L2 gộp 2 bài
--   thống kê thành 1 chuyên đề · L3 giữ Đơn điệu / Cực trị là 2 chuyên đề · L4 mọi dạng "góc" về
--   chuyên đề Công thức tính góc. (L1 "bỏ chuyên đề thực tế" CEO KHÔNG gật ⇒ giữ chuyên đề B5.)
--
-- QUY TẮC KHO (CEO 12/09): ma_dang phải bắt đầu bằng ma_chuyen_de, ma_chuyen_de bằng ma_chu_de —
-- UI suy cây từ tiền tố mã. ⇒ "dời dạng" = đánh số lại + re-point. KHÔNG viết tay 20 câu update:
-- dùng 2 RPC đã có `fn_dai_chuyen_chuyen_de` (mig 202609181233) và `fn_dai_chuyen_dang`
-- (mig 202609181123) — FK cascade + text-ref + lý thuyết chuyên đề đều nằm trong đó.
-- Hai RPC chưa biết 3 bảng text-ref mới hơn (hoc_tu_dau_dang · bai_test_dang_phat_hanh ·
-- dai_cau_hoi_clone_cho_duyet) ⇒ §0 KIỂM 0 dòng trước khi dời, có dòng thì DỪNG.
--
-- MẤT GÌ (Luật xoá — CEO gật 28/09 qua AskUserQuestion "Xoá cả 3"):
--   - dạng T112070106 (tên ".", 0 câu sống) · dạng T112060201 "Kĩ năng bó" (0 câu sống) ⇒ chủ đề T11206
--     "Xác suất cổ điển" biến mất theo · 2 dòng dai_chuyen_de_ly_thuyet rỗng (T1120602, T1120301).
--     ⚠ 19 câu ĐÃ XOÁ MỀM (kho rác, da_duyet=false) vẫn trỏ 2 dạng này — FK on delete RESTRICT chặn (dry-run
--     28/09 bắt được). Không xoá cứng câu rác (chưa gật); dời chúng về dạng chờ T112000000 (trigger log ghi vết),
--     kho rác vẫn resolve được. Đây là điểm khác duy nhất so với "0 câu" trong câu hỏi đã gật.
--   - Dòng lý thuyết chuyên đề T1120402 (rỗng, khong_can) sau khi 2 dạng của nó dời về Nguyên hàm.
--   - KHÔNG xoá câu, KHÔNG xoá dạng có câu. 2 dạng "thực tế" cũ (673 câu) GIỮ, đổi mã theo chuyên đề
--     mới, gắn nhãn "(đang phân lại — lô đầu)"; xoá sau khi lô đầu đưa 673 câu về 8 dạng mới.
--
-- Đánh số chủ đề MỚI: T11209 (chương III) · T11210 (chương V). KHÔNG dùng lại T11203/T11206 đã xoá
-- (mã đã xoá cấp lại cho bản ghi khác = bẫy CLAUDE.md §2; kho_doi_dang_log còn 99 dòng trỏ T11203xx).
-- Thứ tự hiển thị/phạm vi KHÔNG nằm trong mã ⇒ bảng dai_chuyen_de_thu_tu (§7) + fn_kho_pham_vi.
--
-- Bảng đối chiếu MÃ CŨ → MỚI (ghi để truy lại; RPC bảo tồn 2 số STT cuối khi dời cả chuyên đề):
--   T1120201 (bậc 3)       → T1120105 "Khảo sát và vẽ đồ thị hàm số"   T112020103/04/05 → T112010503/04/05
--   T1120202 (b1/b1) 3 dạng → vào T1120105, STT max+1 (06,07,08)
--   T1120203 (b2/b1) 5 dạng → vào T1120105, STT max+1 (09..13)
--   T1120204 (thực tế)     → T1120106 "Ứng dụng đạo hàm…thực tiễn"     T112020401/02 → T112010601/02
--   T1120502 (tính TP)     → T1120403 "Tích phân"                       T112050201..04 → T112040301..04
--   T1120503 (TP thực tế) 3 dạng → vào T1120403, STT max+1 (05,06,07)
--   T1120501 (ƯD hình học) → T1120404 "Ứng dụng hình học của tích phân"  T112050101..06 → T112040401..06
--   T1120402 (NH thực tế) 2 dạng → vào T1120401 "Nguyên hàm", STT max+1 (07,08); mã chuyên đề T1120402 nghỉ
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 0) KIỂM TRƯỚC — sai một điều kiện là DỪNG cả file, không dời nửa chừng
-- ────────────────────────────────────────────────────────────────────────────
do $$
declare n int;
begin
  -- 3 thứ sắp xoá phải đúng là rỗng (câu SỐNG); câu đã xoá mềm còn trỏ tới thì phải là chưa duyệt (dời được về dạng chờ)
  select count(*) into n from dai_cau_hoi where dang_chinh in ('T112070106','T112060201') and xoa_at is null;
  if n > 0 then raise exception 'K12: dạng rác còn % câu sống — không xoá', n; end if;
  select count(*) into n from dai_cau_hoi where dang_chinh in ('T112070106','T112060201') and da_duyet;
  if n > 0 then raise exception 'K12: % câu rác đã duyệt trỏ dạng rác — không tự dời về dạng chờ được', n; end if;
  if not exists (select 1 from dai_ban_do where ma_dang = 'T112000000') then raise exception 'K12: thiếu dạng chờ T112000000'; end if;
  -- chuyên đề nguồn phải tồn tại đúng như lúc thiết kế
  select count(distinct ma_chuyen_de) into n from dai_ban_do
   where ma_chuyen_de in ('T1120201','T1120202','T1120203','T1120204','T1120401','T1120402','T1120501','T1120502','T1120503','T1120801');
  if n <> 10 then raise exception 'K12: thiếu chuyên đề nguồn (thấy %/10) — bản đồ đã đổi so với thiết kế 28/09', n; end if;
  -- mã đích chưa bị chiếm
  if exists (select 1 from dai_ban_do where ma_chu_de in ('T11209','T11210') or ma_chuyen_de in ('T1120105','T1120106','T1120403','T1120404')) then
    raise exception 'K12: mã đích đã có người dùng';
  end if;
  -- 3 bảng text-ref mà RPC dời KHÔNG biết: phải 0 dòng cho các dạng sắp đổi mã
  select (select count(*) from hoc_tu_dau_dang where ma_dang like 'T11202%' or ma_dang like 'T11205%' or ma_dang like 'T1120402%')
       + (select count(*) from bai_test_dang_phat_hanh where ma_dang like 'T11202%' or ma_dang like 'T11205%' or ma_dang like 'T1120402%')
       + (select count(*) from dai_cau_hoi_clone_cho_duyet where dang_chinh like 'T11202%' or dang_chinh like 'T11205%' or dang_chinh like 'T1120402%')
    into n;
  if n > 0 then raise exception 'K12: % dòng ở hoc_tu_dau_dang/bai_test_dang_phat_hanh/dai_cau_hoi_clone_cho_duyet trỏ dạng sắp đổi mã — RPC không re-point bảng này, phải bổ sung trước', n; end if;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 1) XOÁ RÁC (đã gật)
-- ────────────────────────────────────────────────────────────────────────────
-- câu rác (xoa_at not null) trỏ 2 dạng rác → dạng chờ; kho rác vẫn hiện đủ, trigger trg_log_doi_dang ghi vết
update dai_cau_hoi set dang_chinh = 'T112000000' where dang_chinh in ('T112070106','T112060201') and xoa_at is not null;
delete from dai_dang_ly_thuyet where ma_dang in ('T112070106','T112060201');
delete from dai_ban_do where ma_dang in ('T112070106','T112060201');
delete from dai_chuyen_de_ly_thuyet where ma_chuyen_de in ('T1120602','T1120301') and coalesce(noi_dung,'') = '' and file_url is null;

-- ────────────────────────────────────────────────────────────────────────────
-- 2) CHƯƠNG I — chủ đề T11201 nhận thêm 2 chuyên đề từ T11202 (T11202 tự biến mất)
-- ────────────────────────────────────────────────────────────────────────────
update dai_ban_do set ten_chu_de = 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số' where ma_chu_de in ('T11201','T11202');
update dai_ban_do set ten_chuyen_de = 'Đường tiệm cận của đồ thị hàm số'                where ma_chuyen_de = 'T1120103';
update dai_ban_do set ten_chuyen_de = 'Giá trị lớn nhất và giá trị nhỏ nhất của hàm số' where ma_chuyen_de = 'T1120104';

do $$
declare v_cd text; v_ma text; r record;
begin
  -- 2a. Bậc 3 → chuyên đề mới T1120105 (RPC: max STT+1 trong T11201 = 05)
  -- RPC tạo temp table _cd_map "on commit drop"; gọi nhiều lần trong CÙNG transaction phải tự drop trước.
  drop table if exists _cd_map;
  v_cd := fn_dai_chuyen_chuyen_de('T1120201', 'T11201');
  if v_cd <> 'T1120105' then raise exception 'K12: mã chuyên đề Khảo sát ra % (mong T1120105)', v_cd; end if;
  update dai_ban_do set ten_chuyen_de = 'Khảo sát và vẽ đồ thị hàm số' where ma_chuyen_de = v_cd;

  -- 2b. b1/b1 + b2/b1: từng dạng vào T1120105 (giữ đúng thứ tự mã cũ)
  for r in select ma_dang from dai_ban_do where ma_chuyen_de in ('T1120202','T1120203') order by ma_dang loop
    v_ma := fn_dai_chuyen_dang(r.ma_dang, v_cd);
  end loop;

  -- 2c. Lý thuyết chuyên đề: T1120201 đã theo RPC sang T1120105; nối thêm 02 + 03 rồi xoá 2 dòng cũ
  update dai_chuyen_de_ly_thuyet dst
     set noi_dung = dst.noi_dung
                 || E'\n\n## Hàm số phân thức bậc nhất trên bậc nhất\n\n' || coalesce((select noi_dung from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1120202'), '')
                 || E'\n\n## Hàm số phân thức bậc hai trên bậc nhất\n\n'  || coalesce((select noi_dung from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1120203'), ''),
         cap_nhat_at = now()
   where dst.ma_chuyen_de = v_cd;
  update dai_chuyen_de_ly_thuyet set noi_dung = E'## Hàm số bậc ba\n\n' || noi_dung, cap_nhat_at = now() where ma_chuyen_de = v_cd;
  delete from dai_chuyen_de_ly_thuyet where ma_chuyen_de in ('T1120202','T1120203');

  -- 2d. Thực tế → chuyên đề T1120106 (giữ 2 dạng cũ tới khi lô đầu phân xong)
  drop table if exists _cd_map;
  v_cd := fn_dai_chuyen_chuyen_de('T1120204', 'T11201');
  if v_cd <> 'T1120106' then raise exception 'K12: mã chuyên đề Thực tiễn ra % (mong T1120106)', v_cd; end if;
  update dai_ban_do set ten_chuyen_de = 'Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn' where ma_chuyen_de = v_cd;
  update dai_ban_do set ten_dang = ten_dang || ' (đang phân lại — lô đầu)' where ma_dang in ('T112010601','T112010602');
end $$;

-- 2e. 8 dạng mới của chuyên đề Thực tiễn (spec-ban-do-k12.md §3b ①–⑧). muc_do/bac lấy theo đa số K12 (3/C), học thuật chỉnh sau.
insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan) values
 ('T112010603','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tối ưu khi hàm số đã cho sẵn',3,'C','Đề cho sẵn biểu thức (chi phí, lợi nhuận, doanh thu, nồng độ…); chỉ cần tìm GTLN/GTNN của hàm đó trên miền đề cho. Không phải lập hàm.'),
 ('T112010604','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tối ưu phải lập hàm từ hình học',3,'C','Phải tự lập hàm từ tình huống hình học (hộp không nắp, máng tôn, thang tựa tường, dây uốn hình, cửa sổ, chóp…) rồi tìm GTLN/GTNN. Dấu hiệu: có kích thước, diện tích, thể tích, chu vi.'),
 ('T112010605','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tối ưu phải lập hàm từ kinh tế',3,'C','Phải tự lập hàm doanh thu/chi phí/lợi nhuận từ mô tả (giảm giá thì thêm khách, chia đợt nhập hàng, số trạm/ống, lương – năng suất) rồi tìm GTLN/GTNN.'),
 ('T112010606','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tối ưu quãng đường – thời gian',3,'C','Chọn điểm/đường đi để quãng đường, thời gian hoặc chi phí di chuyển nhỏ nhất (bơi + đi bộ, hai xã bên bờ sông, sa mạc, đường ống); hàm thường chứa căn thức.'),
 ('T112010607','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Chuyển động: quãng đường – vận tốc – gia tốc',2,'C','Cho s(t); tính v = s′, a = v′ tại thời điểm, hoặc tìm thời điểm v/a đạt lớn nhất, nhỏ nhất, bằng 0. Dấu hiệu: chất điểm, vật chuyển động, phương trình quãng đường.'),
 ('T112010608','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tốc độ thay đổi của một đại lượng',3,'C','Đại lượng theo thời gian (dân số, số ca bệnh, nồng độ thuốc, doanh số logistic…); hỏi ý nghĩa/dấu của f′, tốc độ tại thời điểm, hoặc lúc nào tăng nhanh nhất (max f′).'),
 ('T112010609','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tốc độ liên quan giữa hai đại lượng',4,'C','Hai đại lượng ràng buộc bởi công thức (thể tích – chiều cao nước trong nón, bóng – khoảng cách); biết tốc độ đại lượng này, tính tốc độ đại lượng kia bằng đạo hàm hàm hợp.'),
 ('T112010610','12','T11201','Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số','T1120106','Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn','Tiệm cận và giới hạn dài hạn trong mô hình',3,'C','Mô hình có ngưỡng "không bao giờ vượt/đạt tới" (dân số bão hoà, logistic, chi phí C(x)=k·x/(100−x)); thực chất là tìm tiệm cận ngang/đứng hoặc giới hạn của hàm mô hình.');

-- ────────────────────────────────────────────────────────────────────────────
-- 3) CHƯƠNG IV — gộp T11205 (Tích phân) vào T11204, thành 3 bài SGK
-- ────────────────────────────────────────────────────────────────────────────
update dai_ban_do set ten_chu_de = 'Nguyên hàm và tích phân' where ma_chu_de in ('T11204','T11205');
update dai_ban_do set ten_chuyen_de = 'Nguyên hàm' where ma_chuyen_de = 'T1120401';

do $$
declare v_cd text; v_ma text; r record;
begin
  -- 3a. Tính tích phân → T1120403 (dời TRƯỚC khi T1120402 rỗng, để không cấp lại mã 02)
  drop table if exists _cd_map;
  v_cd := fn_dai_chuyen_chuyen_de('T1120502', 'T11204');
  if v_cd <> 'T1120403' then raise exception 'K12: mã chuyên đề Tích phân ra % (mong T1120403)', v_cd; end if;
  update dai_ban_do set ten_chuyen_de = 'Tích phân' where ma_chuyen_de = v_cd;
  -- 3b. Tích phân thực tế: 3 dạng vào Tích phân
  for r in select ma_dang from dai_ban_do where ma_chuyen_de = 'T1120503' order by ma_dang loop
    v_ma := fn_dai_chuyen_dang(r.ma_dang, v_cd);
  end loop;
  -- 3c. Ứng dụng hình học → T1120404
  drop table if exists _cd_map;
  v_cd := fn_dai_chuyen_chuyen_de('T1120501', 'T11204');
  if v_cd <> 'T1120404' then raise exception 'K12: mã chuyên đề ƯD hình học ra % (mong T1120404)', v_cd; end if;
  update dai_ban_do set ten_chuyen_de = 'Ứng dụng hình học của tích phân' where ma_chuyen_de = v_cd;
  -- 3d. Nguyên hàm thực tế: 2 dạng vào Nguyên hàm; mã chuyên đề T1120402 nghỉ
  for r in select ma_dang from dai_ban_do where ma_chuyen_de = 'T1120402' order by ma_dang loop
    v_ma := fn_dai_chuyen_dang(r.ma_dang, 'T1120401');
  end loop;
  delete from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1120402' and coalesce(noi_dung,'') = '' and file_url is null;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 4) CHƯƠNG III — MỚI: 1 chuyên đề (L2 gộp 2 bài SGK), 7 dạng
-- ────────────────────────────────────────────────────────────────────────────
insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan) values
 ('T112090101','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','Tính khoảng biến thiên của mẫu số liệu ghép nhóm',1,'C','R = đầu mút phải nhóm cuối − đầu mút trái nhóm đầu (chỉ tính nhóm có tần số > 0). Đề cho bảng tần số ghép nhóm, hỏi khoảng biến thiên.'),
 ('T112090102','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','Tính tứ phân vị và khoảng tứ phân vị của mẫu ghép nhóm',2,'C','Tìm nhóm chứa Q1/Q3 theo tần số tích luỹ, nội suy công thức Qk, rồi ΔQ = Q3 − Q1. Dấu hiệu: hỏi Q1, Q3, khoảng tứ phân vị.'),
 ('T112090103','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','Tính phương sai và độ lệch chuẩn của mẫu ghép nhóm',2,'C','Lấy giá trị đại diện mỗi nhóm, tính số trung bình rồi s² = Σnᵢ(xᵢ − x̄)²/n và s = √s². Dấu hiệu: hỏi phương sai, độ lệch chuẩn.'),
 ('T112090104','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','So sánh độ phân tán của hai mẫu số liệu',3,'C','Hai mẫu (hai lớp, hai máy, hai vận động viên…); tính cùng một số đặc trưng (R, ΔQ hoặc s) cho cả hai rồi kết luận mẫu nào đồng đều/ổn định hơn.'),
 ('T112090105','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','Ý nghĩa và lựa chọn số đặc trưng phù hợp',3,'C','Hỏi số đặc trưng nào phản ánh đúng độ phân tán trong tình huống (có giá trị bất thường ⇒ dùng ΔQ; cần mọi giá trị ⇒ dùng s) hoặc nhận xét đúng/sai về ý nghĩa.'),
 ('T112090106','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','Lập bảng ghép nhóm từ số liệu thô rồi tính số đặc trưng',3,'C','Đề cho dãy số liệu rời rạc, yêu cầu ghép nhóm theo độ dài cho trước rồi mới tính R, ΔQ, s². Có bước lập bảng trước.'),
 ('T112090107','12','T11209','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','T1120901','Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm','Phát hiện giá trị bất thường bằng tứ phân vị',3,'C','Dùng ngưỡng Q1 − 1,5ΔQ và Q3 + 1,5ΔQ để kết luận một giá trị/nhóm có bất thường không.');

-- ────────────────────────────────────────────────────────────────────────────
-- 5) CHƯƠNG V — MỚI: 4 chuyên đề theo 4 bài SGK, 19 dạng (L4: mọi dạng góc ở T1121003)
-- ────────────────────────────────────────────────────────────────────────────
insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan) values
 -- Bài 14 — Phương trình mặt phẳng
 ('T112100101','12','T11210','Phương pháp toạ độ trong không gian','T1121001','Phương trình mặt phẳng','Xác định vectơ pháp tuyến và điểm thuộc mặt phẳng',1,'C','Từ phương trình Ax+By+Cz+D=0 đọc VTPT, kiểm tra điểm thuộc/không thuộc, tìm hệ số còn thiếu khi biết điểm thuộc. Không phải viết phương trình.'),
 ('T112100102','12','T11210','Phương pháp toạ độ trong không gian','T1121001','Phương trình mặt phẳng','Viết phương trình mặt phẳng khi biết một điểm và một vectơ pháp tuyến',2,'C','Đề cho (hoặc suy ngay ra) VTPT: qua điểm vuông góc với đường thẳng/đoạn thẳng, song song mặt phẳng cho trước, mặt phẳng trung trực.'),
 ('T112100103','12','T11210','Phương pháp toạ độ trong không gian','T1121001','Phương trình mặt phẳng','Viết phương trình mặt phẳng bằng tích có hướng của cặp vectơ chỉ phương',3,'C','Phải tìm VTPT bằng [a, b]: qua 3 điểm, qua 2 điểm và song song/vuông góc với đường/mặt khác, chứa đường thẳng và song song đường khác.'),
 ('T112100104','12','T11210','Phương pháp toạ độ trong không gian','T1121001','Phương trình mặt phẳng','Vị trí tương đối của hai mặt phẳng',2,'C','Xét song song, trùng, cắt, vuông góc giữa hai mặt phẳng qua VTPT; tìm tham số để hai mặt phẳng song song hoặc vuông góc.'),
 ('T112100105','12','T11210','Phương pháp toạ độ trong không gian','T1121001','Phương trình mặt phẳng','Khoảng cách từ điểm đến mặt phẳng và giữa hai mặt phẳng song song',2,'C','Áp dụng công thức d(M,(P)); khoảng cách hai mặt phẳng song song; tìm điểm/tham số thoả điều kiện khoảng cách.'),
 ('T112100106','12','T11210','Phương pháp toạ độ trong không gian','T1121001','Phương trình mặt phẳng','Bài toán thực tiễn về mặt phẳng',3,'C','Gắn hệ trục vào tình huống thật (mái nhà, tấm pin, mặt dốc, camera) rồi lập phương trình mặt phẳng hoặc tính khoảng cách tới mặt phẳng.'),
 -- Bài 15 — Phương trình đường thẳng trong không gian
 ('T112100201','12','T11210','Phương pháp toạ độ trong không gian','T1121002','Phương trình đường thẳng trong không gian','Xác định vectơ chỉ phương và điểm thuộc đường thẳng',1,'C','Đọc VTCP, điểm thuộc từ phương trình tham số/chính tắc; kiểm tra điểm thuộc đường; tìm toạ độ điểm trên đường theo tham số.'),
 ('T112100202','12','T11210','Phương pháp toạ độ trong không gian','T1121002','Phương trình đường thẳng trong không gian','Viết phương trình đường thẳng',2,'C','Qua 2 điểm; qua điểm và song song đường/vuông góc mặt phẳng; giao tuyến hai mặt phẳng; qua điểm và vuông góc với 2 đường (dùng tích có hướng).'),
 ('T112100203','12','T11210','Phương pháp toạ độ trong không gian','T1121002','Phương trình đường thẳng trong không gian','Vị trí tương đối giữa hai đường thẳng, giữa đường thẳng và mặt phẳng',2,'C','Song song, cắt, chéo, trùng; đường thẳng cắt/song song/nằm trong mặt phẳng; tìm giao điểm, tham số thoả vị trí tương đối.'),
 ('T112100204','12','T11210','Phương pháp toạ độ trong không gian','T1121002','Phương trình đường thẳng trong không gian','Hình chiếu vuông góc và điểm đối xứng qua đường thẳng, mặt phẳng',3,'C','Tìm hình chiếu của điểm lên đường thẳng/mặt phẳng, điểm đối xứng, hình chiếu của đường thẳng lên mặt phẳng; khoảng cách từ điểm đến đường thẳng.'),
 ('T112100205','12','T11210','Phương pháp toạ độ trong không gian','T1121002','Phương trình đường thẳng trong không gian','Bài toán thực tiễn về đường thẳng',3,'C','Toạ độ hoá đường bay, tia sáng, đường đi của vật để hỏi vị trí, thời điểm gặp, khoảng cách gần nhất, điểm chạm mặt phẳng.'),
 -- Bài 16 — Công thức tính góc trong không gian (L4: MỌI dạng góc về đây)
 ('T112100301','12','T11210','Phương pháp toạ độ trong không gian','T1121003','Công thức tính góc trong không gian','Góc giữa hai đường thẳng',2,'C','cos = |u₁·u₂| / (|u₁||u₂|) với hai VTCP; kể cả khi đề cho đường thẳng qua hai điểm hoặc cạnh của hình.'),
 ('T112100302','12','T11210','Phương pháp toạ độ trong không gian','T1121003','Công thức tính góc trong không gian','Góc giữa đường thẳng và mặt phẳng',2,'C','sin = |u·n| / (|u||n|) với VTCP và VTPT; tìm tham số để góc bằng giá trị cho trước.'),
 ('T112100303','12','T11210','Phương pháp toạ độ trong không gian','T1121003','Công thức tính góc trong không gian','Góc giữa hai mặt phẳng',2,'C','cos = |n₁·n₂| / (|n₁||n₂|) với hai VTPT; góc nhị diện của hình đã toạ độ hoá.'),
 ('T112100304','12','T11210','Phương pháp toạ độ trong không gian','T1121003','Công thức tính góc trong không gian','Bài toán thực tiễn về góc trong không gian',3,'C','Góc nghiêng mái, góc giữa dốc và mặt đất, góc của tia sáng/đường bay với mặt phẳng — gắn hệ trục rồi áp công thức góc.'),
 -- Bài 17 — Phương trình mặt cầu
 ('T112100401','12','T11210','Phương pháp toạ độ trong không gian','T1121004','Phương trình mặt cầu','Xác định tâm và bán kính mặt cầu',1,'C','Từ dạng (x−a)²+(y−b)²+(z−c)²=R² hoặc dạng khai triển; điều kiện để phương trình là mặt cầu; điểm thuộc mặt cầu.'),
 ('T112100402','12','T11210','Phương pháp toạ độ trong không gian','T1121004','Phương trình mặt cầu','Viết phương trình mặt cầu',2,'C','Biết tâm và bán kính; đường kính AB; tâm và đi qua điểm; tâm và tiếp xúc mặt phẳng/trục/đường thẳng; qua 4 điểm.'),
 ('T112100403','12','T11210','Phương pháp toạ độ trong không gian','T1121004','Phương trình mặt cầu','Vị trí tương đối của mặt cầu với điểm, mặt phẳng, đường thẳng',3,'C','So sánh d(I,(P)) hoặc d(I,d) với R; đường tròn giao tuyến (tâm, bán kính); điều kiện tiếp xúc; điểm trong/ngoài mặt cầu.'),
 ('T112100404','12','T11210','Phương pháp toạ độ trong không gian','T1121004','Phương trình mặt cầu','Bài toán thực tiễn về mặt cầu',3,'C','Vùng phủ sóng, quả cầu, trạm radar, mái vòm — toạ độ hoá rồi hỏi điểm trong/ngoài, khoảng cách, giao với mặt phẳng.');

-- ────────────────────────────────────────────────────────────────────────────
-- 6) CHƯƠNG VI — bổ sung 3 dạng cho Xác suất có điều kiện (T1120801 đang có 1 dạng)
-- ────────────────────────────────────────────────────────────────────────────
update dai_ban_do set ten_chu_de = 'Xác suất có điều kiện' where ma_chu_de = 'T11208';
update dai_ban_do set ten_chuyen_de = 'Xác suất có điều kiện' where ma_chuyen_de = 'T1120801';
update dai_ban_do set ten_chuyen_de = 'Công thức xác suất toàn phần và công thức Bayes' where ma_chuyen_de = 'T1120802';
insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan) values
 ('T112080102','12','T11208','Xác suất có điều kiện','T1120801','Xác suất có điều kiện','Tính xác suất có điều kiện từ bảng số liệu hoặc dữ kiện đếm',2,'C','Đề cho bảng hai chiều/số lượng (nam–nữ, đạt–không đạt…); P(A|B) = n(A∩B)/n(B) bằng đếm trực tiếp trên tập thu hẹp.'),
 ('T112080103','12','T11208','Xác suất có điều kiện','T1120801','Xác suất có điều kiện','Công thức nhân xác suất và sơ đồ hình cây',2,'C','P(A∩B) = P(B)·P(A|B); lấy lần lượt không hoàn lại, chuỗi sự kiện nối tiếp; vẽ sơ đồ cây rồi nhân dọc nhánh.'),
 ('T112080104','12','T11208','Xác suất có điều kiện','T1120801','Xác suất có điều kiện','Kiểm tra tính độc lập của hai biến cố',3,'C','So P(A|B) với P(A) hoặc P(A∩B) với P(A)P(B) để kết luận độc lập; câu hỏi Đ/S về độc lập.');

-- Chương II — chỉ chuẩn tên theo SGK (mã giữ nguyên)
update dai_ban_do set ten_chu_de = 'Vectơ và hệ trục toạ độ trong không gian' where ma_chu_de = 'T11207';
update dai_ban_do set ten_chuyen_de = 'Vectơ trong không gian'                       where ma_chuyen_de = 'T1120701';
update dai_ban_do set ten_chuyen_de = 'Hệ trục toạ độ trong không gian'               where ma_chuyen_de = 'T1120702';
update dai_ban_do set ten_chuyen_de = 'Biểu thức toạ độ của các phép toán vectơ'      where ma_chuyen_de = 'T1120703';

-- ────────────────────────────────────────────────────────────────────────────
-- 7) THỨ TỰ CHUYÊN ĐỀ + LUẬT PHẠM VI (C8) — thứ tự KHÔNG nằm trong mã
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.dai_chuyen_de_thu_tu (
  ma_chuyen_de text primary key,
  khoi         text not null,
  thu_tu       smallint not null,
  la_thung     boolean not null default false,   -- chủ đề-thùng ("ôn tập", "đề thi"): phạm vi = cả khối
  ghi_chu      text,
  unique (khoi, thu_tu)
);
comment on table public.dai_chuyen_de_thu_tu is 'Thứ tự học của chuyên đề trong khối (theo SGK) — nguồn cho luật phạm vi C8 (spec-luong-kho.md) và thứ tự hiển thị. Mã là danh tính, thứ tự ở đây.';
alter table public.dai_chuyen_de_thu_tu enable row level security;
drop policy if exists dai_chuyen_de_thu_tu_select on public.dai_chuyen_de_thu_tu;
create policy dai_chuyen_de_thu_tu_select on public.dai_chuyen_de_thu_tu for select to authenticated using (true);
grant select on public.dai_chuyen_de_thu_tu to authenticated;

insert into public.dai_chuyen_de_thu_tu (ma_chuyen_de, khoi, thu_tu, ghi_chu) values
 ('T1120101','12', 1,'I · B1 Tính đơn điệu (L3: tách đơn điệu / cực trị)'),
 ('T1120102','12', 2,'I · B1 Cực trị'),
 ('T1120104','12', 3,'I · B2 GTLN–GTNN'),
 ('T1120103','12', 4,'I · B3 Đường tiệm cận'),
 ('T1120105','12', 5,'I · B4 Khảo sát và vẽ đồ thị'),
 ('T1120106','12', 6,'I · B5 Ứng dụng thực tiễn'),
 ('T1120701','12', 7,'II · B6 Vectơ trong không gian'),
 ('T1120702','12', 8,'II · B7 Hệ trục toạ độ'),
 ('T1120703','12', 9,'II · B8 Biểu thức toạ độ của phép toán vectơ'),
 ('T1120901','12',10,'III · B9+B10 (L2 gộp)'),
 ('T1120401','12',11,'IV · B11 Nguyên hàm'),
 ('T1120403','12',12,'IV · B12 Tích phân'),
 ('T1120404','12',13,'IV · B13 Ứng dụng hình học của tích phân'),
 ('T1121001','12',14,'V · B14 Phương trình mặt phẳng'),
 ('T1121002','12',15,'V · B15 Phương trình đường thẳng'),
 ('T1121003','12',16,'V · B16 Công thức tính góc (L4)'),
 ('T1121004','12',17,'V · B17 Phương trình mặt cầu'),
 ('T1120801','12',18,'VI · B18 Xác suất có điều kiện'),
 ('T1120802','12',19,'VI · B19 Toàn phần và Bayes')
on conflict (ma_chuyen_de) do update set khoi = excluded.khoi, thu_tu = excluded.thu_tu, ghi_chu = excluded.ghi_chu;

-- Phạm vi kiến thức được dùng khi giải câu của một chuyên đề (V3-2: mọi chuyên đề đứng trước trong khối
-- + toàn bộ khối dưới; chuyên đề-thùng ⇒ cả khối). Chỉ nhánh Đại. Khối tính theo số (khối chữ như 4T/5T/8T
-- xếp theo phần số của nó). Chuyên đề CHƯA có trong bảng thứ tự ⇒ trả về rỗng (không đoán).
create or replace function public.fn_kho_pham_vi(p_ma_chuyen_de text)
returns table (ma_chuyen_de text, khoi text, thu_tu smallint)
language sql stable set search_path = public as $$
  with goc as (
    select t.khoi, t.thu_tu, t.la_thung,
           nullif(regexp_replace(t.khoi, '\D', '', 'g'), '')::int as khoi_so
      from dai_chuyen_de_thu_tu t where t.ma_chuyen_de = p_ma_chuyen_de
  )
  select t.ma_chuyen_de, t.khoi, t.thu_tu
    from dai_chuyen_de_thu_tu t, goc g
   where nullif(regexp_replace(t.khoi, '\D', '', 'g'), '')::int < g.khoi_so
      or (t.khoi = g.khoi and (g.la_thung or t.thu_tu <= g.thu_tu))
   order by 2, 3
$$;
revoke all on function public.fn_kho_pham_vi(text) from public, anon;
grant execute on function public.fn_kho_pham_vi(text) to authenticated;

-- ────────────────────────────────────────────────────────────────────────────
-- 8) KIỂM SAU — cây K12 phải nhất quán theo tiền tố mã; mọi chuyên đề K12 có thứ tự
-- ────────────────────────────────────────────────────────────────────────────
do $$
declare n int; v text;
begin
  select count(*) into n from dai_ban_do where khoi = '12' and (ma_dang not like ma_chuyen_de || '%' or ma_chuyen_de not like ma_chu_de || '%');
  if n > 0 then raise exception 'K12: % dạng có mã lệch tiền tố chuyên đề/chủ đề', n; end if;
  select string_agg(distinct ma_chuyen_de, ',') into v from dai_ban_do
   where khoi = '12' and ma_dang not like '%000000' and ma_chuyen_de not in (select ma_chuyen_de from dai_chuyen_de_thu_tu);
  if v is not null then raise exception 'K12: chuyên đề chưa có thứ tự: %', v; end if;
  if exists (select 1 from dai_ban_do where ma_chu_de in ('T11202','T11205','T11206')) then raise exception 'K12: chủ đề cũ vẫn còn dạng'; end if;
  select count(*) into n from dai_ban_do where khoi = '12' and ma_dang not like '%000000';
  raise notice 'K12 sau migration: % dạng · % chuyên đề · % chủ đề', n,
    (select count(distinct ma_chuyen_de) from dai_ban_do where khoi = '12' and ma_dang not like '%000000'),
    (select count(distinct ma_chu_de)   from dai_ban_do where khoi = '12' and ma_dang not like '%000000');
end $$;
