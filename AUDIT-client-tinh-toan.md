# AUDIT — "Client không tính toán, DB tính, client chỉ lấy số" (29-30/08/2026)

> Quét toàn bộ `src/lib` + `src/screens` trên `main` (`ceb2d09`) bằng 3 lượt đọc song song.
> Luật gốc: CLAUDE.md §2 — *"DB là source of truth runtime, tính ở Postgres. Client chỉ
> query + hiển thị. Không derive ở client rồi ghi lại DB."*

## Tổng kết

| Phạm vi | NẶNG | VỪA | NHẸ | Tổng |
|---|---|---|---|---|
| `src/lib` a→k (kèm `kho/`) | 43 | 28 | 12 | 83 |
| `src/lib` l→z | 27 | 25 | 7 | 59 |
| `src/screens` | 12 | 15 | 8 | 35 |
| **Cộng** | **82** | **68** | **27** | **177** |

⚠ Một phần đếm TRÙNG GỐC: screen gọi hàm lib vi phạm thì cả hai cùng bị đếm — số *vị trí*
là 177 nhưng số *gốc bệnh* ít hơn nhiều; sửa lib là dập được screen ăn theo.

Trả lời câu hỏi trực tiếp "các dashboard/hàm đã dùng đường DB-tính chưa": **phần lớn CHƯA.**
Cả hệ chỉ ~8 chỗ đi qua RPC đúng chuẩn (`xepHangTuLuyen`, `count_cau_by_dang`,
`hs_cham_tln_ai`, `giaoviec_housekeeping`, `hs_dang_evals` — nhưng cái cuối vẫn tính nốt ở
client). `xepHangTuLuyen` là mẫu tham chiếu tốt nhất hiện có.

## 4 nhóm bệnh (xếp theo độ nguy hiểm)

### ① Tính ở client rồi GHI NGƯỢC DB (~15 gốc — nhóm hư dữ liệu vĩnh viễn)
Client sai / đổi công thức / chết giữa chừng ⇒ DB giữ số không tái tạo được, các thế hệ số lẫn nhau.
- **Tiền:** `hocphi.ts:696 chotKy` (hoá đơn đông cứng từ phép tính JS) · `hocphi.ts:720 ghiThanhToan` (suy trạng thái thu rồi UPDATE — 2 tab song song ghi đè nhau) · `gay.ts:131 quetGayTuDong` + `gay.ts:310 chotThang` (tiền phạt; đồng hồ client quyết số phút trễ)
- **Điểm số:** `thanhtich.ts:20→103 tinhDiemMT→upsertDiemThi` (điểm + verdict → nuôi Level → xu lương) · `gami.ts:727 recomputeExpThang` (DELETE+INSERT ledger — đứt giữa chừng là ledger tháng rỗng) · `gami.ts:831 closePhase` / `gami.ts:1456 reopenPhase` (Elo N update rời không transaction) · `detest.ts:170 chamCauTest` (diem nên là generated column) · `testonline.ts:503 suaKeyVaChamLai` + `:410 chapNhanDapAn` (chấm lại N+1 update)
- **Hiệu suất nhân sự:** `giaoviec.ts:323 nghiemThu` · `vanhanh.ts:160/178 duyetMot/HangLoat` · `opsvanhanh.ts:278 duyetOpsHangLoat` — công thức `tinhHieuSuat` tồn tại 2 BẢN song song (vanhanh vs opsvanhanh)
- Khác: `mt.ts:80 ganMTVaoBuoi` (nội dung đề phụ thuộc code browser) · `gami.ts:954 recomputeHoanTat` (trạng thái buổi nên là trigger)

### ② Engine tiền `hocphi.ts` — 16 NẶNG, 3 bản công thức song song
`getPhieuAo` / `listHocPhiTheoHocSinhVaMon` / `tinhTamTinhTheoPH` là 3 bản của cùng phép
tính tiền; công nợ/tín dụng trừ tay ở client; `fetchAllBhh` quét toàn trường phân trang.
Comment tại `hocphi.ts:1122` tự thú đã có **bug tiền thật** vì limit cắt cụt — nguyên nhân
gốc là aggregate ở client. ⚠ Branch `fix/hocphi-heso-tailieu` (chưa merge, worktree
`wt-hocphi-heso-tailieu`) đã RPC-hoá `listHocPhiTheoMonV2` — merge nó là bước 1 có sẵn.

### ③ Engine đo lường (mastery/đánh giá) chạy trong browser
CLAUDE.md §1 nói "mastery suy động" — nhưng đang suy Ở CLIENT: `mastery.ts` (11 vi phạm,
`masteryOfDang` + tổng quan + ma trận lớp + completion 38 lớp), `danhgia.ts:169
getStatSheetLop` (nguyên rule engine đánh giá), `report.ts:123 rankByDiemMT` (xếp hạng =
kéo điểm cả khối về browser đếm tay), `troly.ts:62 nguongTuCohort` (percentile JS — comment
còn ghi "phải khớp percentile_disc của Postgres"). Hầu hết file khác import từ đây ⇒ sửa
`mastery.ts` dập được ~20 mục ăn theo.

### ④ Quét bảng lớn về client thay cho 1 câu aggregate
`gami.ts:684 fetchBtvnAcc` (200k dòng) · `gami.ts:1354 listOpsDiemDanhTeam` (100k dòng cho
1 phép đếm) · `kho/api.ts:284 listCauRac` + `ontap.ts:66` (limit 500k) · `testonline.ts:461`
(10k, group-having) · `troly.ts:774` (20k dòng để test exists) · `PhDangNhapScreen` (10k
dòng ra 4 con số) · `botro.ts:63` (2 bảng lớn nhất không filter).

## Tiến độ chiến dịch (cập nhật mỗi đợt)

- [x] **Phase 0** — Luật §2.0 vào CLAUDE.md (30/08, `ce8cb0e`)
- [x] **Phase 1 đợt 1/5** (mig `202608300221`): ①`chamCauTest` ②`ghiThanhToan` ③`tinhDiemMT→upsertDiemThi`
      → 3 trigger `fn_ca_test_kq_diem` / `fn_hoa_don_cap_nhat_trang_thai` / `fn_diem_thi_tinh`.
      Parity 0 lệch trên data thật · smoke-test rollback cả 3 · client mỏng (detest/hocphi/thanhtich/2 screen).
- [x] **Phase 1 đợt 2** (mig `202608300228`): hiệu suất nghiệm thu → `fn_gv_tien_do/tran_chat_luong/phan_tram`
      + `fn_vh_hieu_suat` + 2 trigger (`viec` nghiệm thu · `viec_van_hanh_duyet`). Parity bắt được 1 dòng
      lệch THẬT của housekeeping (viec d4e18725) — đúng bệnh công-thức-2-nơi; từ nay trigger đè mọi đường ghi.
      Client: nghiemThu gửi điểm thô, duyet* bỏ tự tính. (vh_ops_task không có cột hiệu suất — đọc-derive, sang Phase 4.)
- [x] **Phase 1 đợt 3** (mig `202608300232`): bảng gậy + chốt tháng → `fn_gay_bang` (đọc, đơn giá 20k
      vào SQL) + `fn_gay_chot_thang` (RPC transactional, snapshot jsonb trong DB, nguoi_chot từ jwt).
      Smoke synthetic: 3 đánh/1 gỡ/1 thu hồi → 3·1·2·40k + snapshot 3 dòng, đúng người chốt. Client
      bangGay chỉ còn ghép entries hiển thị; chotThang = 1 rpc. (`quetGayTuDong` đi cùng task-engine Phase 4.)
- [x] **Phase 2a** — merge `fix/hocphi-heso-tailieu` (RPC `hoc_phi_theo_mon_ky` đã áp DB từ 27/08,
      client listHocPhiTheoMonV2 dùng RPC). **Phase 2b** (mig `202608300306`): công nợ + tín dụng →
      `fn_hocphi_no_theo_ph` / `fn_hocphi_so_du_no` / `fn_hocphi_tin_dung_con_lai` (parity tổng nợ
      66.801.500đ khớp kiểm chéo). **Phase 2c** (mig `202608300311`): `fn_hocphi_phieu_ao` (đứng trên
      hoc_phi_theo_mon_ky — phiếu PH & bảng HS-theo-môn cùng 1 nguồn số) + `fn_hocphi_chot_ky`
      (1 transaction). Parity 238 hoá đơn kỳ 07: **225 khớp tuyệt đối**, 13 lệch truy được từng ca về
      data đổi SAU chốt (bù 09/08 sau chốt 05/08...). hocphi.ts cắt ~170 dòng engine.
- [x] **Phase 1 đợt 4** (mig `202608300240` + `202608300243`): engine Elo/EXP → 4 RPC transactional
      `fn_dong_phase` / `fn_mo_lai_phase` / `fn_recompute_exp_thang` / `fn_dong_btvn` (+ fn_jsround vì
      Math.round JS ≠ round SQL với số âm, fn_exp_*, fn_buoi_recompute_hoan_tat). Parity: 1439/1439 dòng
      history mùa này khớp công thức delta; test vàng reopen+reclose buổi thật — mọi số Elo khớp per-HS,
      lệch hạng CHỈ trong nhóm hoà tuyệt đối (JS cũ xếp hên xui theo thứ tự fetch — nay TẤT ĐỊNH theo
      hoc_sinh_id), chạy lặp ra y hệt. Client gami.ts: 4 hàm thành 4 rpc, cắt ~170 dòng engine + dead code.
- [x] **Phase 1 đợt 5a** (mig `202608300251` + `202608300254`): `fn_tln_normalize` + `fn_chap_nhan_dap_an`
      (cache + backfill + resolve report, 1 transaction). **Parity harness tóm bug THẬT của JS**: \b ASCII
      bóc "đơn vị" ngay trong chữ có dấu ("10 học sinh"→"10ọcsinh") — vá cả 2 phía về đặc tả unicode chung,
      chuẩn hoá lại 4 dòng cache; parity v2 = 615/615. dap_an_hs jsonb phải bóc bằng `#>>'{}'`.
- [x] **Phase 1 đợt 5b** (mig `202608300301`): `fn_sua_key_va_cham_lai` — sửa key + chấm lại cả lớp + log
      trong 1 transaction; bộ chấm 3 loại câu port sang SQL (fn_tln_check + fn_js_parsefloat nhân bản
      parseFloat ăn-prefix của JS; bẫy substring-trả-nhóm-ngoặc của PG). Parity regrade 983/983 verdict
      khớp trên bài làm thật. → **PHASE 1 XONG** (còn `quetGayTuDong` đi cùng task-engine Phase 4;
      `ganMT` xét lại phân loại Phase 4; `chotKy` thuộc Phase 2).
- [x] **Phase 2d** (mig `202608300729`): hệ số gợi ý + hiệu lực (`fn_hocphi_he_so_goi_y` — parity
      292/293 với hệ số đã xác nhận · `fn_hocphi_he_so_hieu_luc` DISTINCT ON thay trò dựa-thứ-tự-PostgREST)
      + `fn_hocphi_chi_tiet_ky`/`fn_hocphi_tong_hop_ky` (cross-check 242/242 vs phiếu ảo). Xoá 3 hàm chết
      (listHocPhiTheoHocSinhVaMon, tinhTamTinhTheoPH, selectByIdsBatched — batching hết lý do tồn tại:
      không còn mảng UUID trên URL). → **PHASE 2 XONG** — hocphi.ts giờ là seam mỏng gọi rpc.
- [ ] Phase 3 (mastery) · Phase 4 (quét lớn + vừa/nhẹ)

## Lộ trình đề xuất (chưa làm — chờ chốt)

1. **Chặn chảy máu (nhóm ①):** chuyển 15 gốc ghi-ngược thành RPC/trigger/generated column
   — mỗi cái là 1 migration + xoá hàm client. Ưu tiên: chotKy/ghiThanhToan → tinhDiemMT →
   closePhase/recomputeExpThang → nghiemThu/duyet* → gậy.
2. **Merge `fix/hocphi-heso-tailieu`** rồi RPC-hoá nốt phần tiền còn lại theo cùng mẫu.
3. **Hạ mastery xuống DB:** 1 view/RPC `mastery_cells` (+ rollup) — sửa 1 chỗ, ~20 chỗ khỏi.
4. Nhóm ④ chuyển dần thành RPC đếm/aggregate (mỗi cái ~30'), nhóm VỪA/NHẸ xử theo cơ hội
   khi đụng file.

Chi tiết từng vị trí (177 mục đầy đủ theo file:line): xem output 3 lượt audit trong DEVLOG
phiên 29-30/08 hoặc hỏi lại bot Hỏi hệ thống.
