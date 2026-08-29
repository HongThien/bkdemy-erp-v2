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
- [ ] Phase 1 đợt 2: hiệu suất nghiệm thu (`nghiemThu` + `duyetMot/HangLoat` + ops — 1 fn duy nhất)
- [ ] Phase 1 đợt 3: `chotKy` (RPC transactional)
- [ ] Phase 1 đợt 4: Elo/EXP (`closePhase`/`recomputeExpThang`/`reopenPhase` — RPC transaction)
- [ ] Phase 1 đợt 5: gậy (`quetGayTuDong`/`chotThang`) + `mt.ts ganMT` + testonline chấm lại
- [ ] Phase 2 · Phase 3 · Phase 4 (xem lộ trình dưới)

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
