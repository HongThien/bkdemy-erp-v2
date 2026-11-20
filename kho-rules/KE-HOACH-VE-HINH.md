# KẾ HOẠCH VẼ LẠI HÌNH KHO — chờ Thùy duyệt TỪNG ĐỢT

> Lập 21/11/2026. Luật: `spec-giai-bai` §A8 (gốc ổn GIỮ · gốc tệ mã a–f VẼ LẠI · có lệnh VẼ LẠI), §C12 (bộ đếm), §C10 mục 13; dây chuyền: `spec-kho-cau-hoi` §13.
> Số đo: truy vấn CHỈ ĐỌC (transaction read only), `fn_kho_hinh_dem('Toán')` + đếm URL. Sổ máy sinh: `kho-rules/SO-HINH.md` (đã dựng lại 21/11).
> **Chưa có lệnh vẽ nào được ra, chưa ghi `anh_de` nào. Mọi đợt dưới đây ở trạng thái ĐỀ XUẤT.**

## 1. Hiện trạng (đo 21/11)

| Chỉ số | Số |
|---|---|
| Câu có hình đề (6 kho đếm) | **14.692** (HANDOFF 20/11 ghi 14.462 → +230 do nhập kho mới) |
| Nhãn `goc` / `ve_lai` / `ve_lenh` | **0 / 0 / 0** |
| Nhãn `ve_moi` | 24 (đều `hinh_hoc` K7, 16/11) |
| **Chưa rõ nguồn** | **14.668** (≈ 99,8 %) — checklist chưa dùng được |
| Lệnh vẽ đang chờ | 0 |

Theo kho × khối (có hình đề; "chưa rõ" = bằng số đó trừ 24 `ve_moi` ở Hình–Học K7):

| Kho | Khối: số hình đề |
|---|---|
| Đại `dai` (8.774) | 3: 535 · 4: 605 · 4T: 37 · 5: 581 · 5T: 72 · **6: 26** · 7: 128 · 8: 105 · 9: 44 · 10: 1.665 · 11: 941 · 12: 4.007 |
| Hình giải tích `hgt` (1.160) | "6": 365 · "9": 37 · 10: 425 · 12: 333 (*) |
| Hình–Học `hinh_hoc` (3.909) | 7: 977 · 8: 397 · 8T: 162 · 9: 1.439 · 11: 934 |
| Hình trên lớp `hinh_hoc_lop` (84) | 7: 50 · 8: 34 |
| Hình–Luyện bài `hinh_luyen` (636) | 7: 44 · 8: 204 · 9: 388 |
| Hình–Luyện ý `hinh_luyen_y` (157) | 7: 20 · 8: 137 |

(*) Bộ đếm suy khối HGT từ ký tự 3–4 của `dang_chinh` (mã `T3060`, `T3090`, `T3100`, `T3120`) ⇒ ra "6/9/10/12". Chưa chắc "6" và "9" là khối thật của HGT; cần đối chiếu bản đồ trước khi dùng cột khối HGT làm cơ sở xếp đợt (xem §5).

Theo loại hình (đếm URL, Đại / HGT / Hình–Học):

- **Hình đã vẽ bằng code** (`kho-anh/hinh_hoc/`): Hình–Học K7 843 · K8 236 · K8T 162 · K9 521; HGT 70 (K10). Đã qua đợt 13/10 — KHÔNG đụng.
- **Ảnh cắt từ tài liệu** (`kho-anh/nhap_kho/…`): Đại K10 1.511 · K11 645 · K12 3.687 · K7 119 · K8 105 · K6 26; HGT 884; Hình–Học K7 133 · K8 161 · K9 917 · K11 919.
- **Ảnh cũ nguồn khác** (không phải `nhap_kho`/`hinh_hoc`): Đại K3–5T ≈ 1.790 (sách tiểu học, `trung-diem`, `hbh-thoi`, …), Đại K10–12 770 (`sach/`, `cau-hinh`, …).

Câu **có chữ "[hình…]" mà thiếu `anh_de`** (đã bị `_kho_dk_du_hinh_sql` loại khỏi mọi bài; không xoá, đính hình là tự quay lại):

| Kho | Khối | Tổng | Kho chuẩn |
|---|---|---|---|
| Đại | 9: 6 · 10: 4 · 12: 13 | 23 | 15 |
| HGT | 9: 3 · 10: 3 | 6 | 6 |
| Hình–Học | 11: 12 | 12 | 12 |
| **Cộng** | | **41** | **33** |

(HANDOFF 13/10 đo 31 câu; nay 41. Số tăng vì câu mới nhập.)

Riêng K6 Đại (kho phiên Chuẩn bị kho câu hỏi đang fill): 26 câu có hình đề (15 kho chuẩn, 15 đã duyệt, đều dạng `T106000000`, ảnh `nhap_kho`) + 10 câu nhắc "hình vẽ / như hình / trục số / bảng sau" mà không có ảnh (8 kho chuẩn) — ứng viên `ve_moi` sau khi người đọc xác nhận.

## 2. Vì sao bị kẹt, và nguyên tắc của kế hoạch

1. **Không biết hình nào tệ**: 14.668 hình chưa được ai xét. Vẽ hàng loạt = lãng phí (luật 15/11: "gốc ổn GIỮ"). ⇒ mỗi đợt có **bước RÀ trước** (đọc ảnh, gán `goc` hoặc `ve_lai:<mã>`), chỉ **vẽ** những hình bị `ve_lai`. Hình gán `goc` được ghi nhãn để bộ đếm tiến lên.
2. Ghi nhãn `goc` cũng là ghi DB (`kho_hinh_nguon`, thêm dòng, không đụng `anh_de`) — vẫn chỉ làm sau khi Thùy duyệt đợt đó.
3. Câu có hình đề **không clone đổi số**. Muốn clone được câu có hình phải có máy vẽ tham số hoá theo dạng (việc riêng, §6) — kế hoạch này chỉ vẽ lại ĐÚNG hình của câu hiện có.
4. Không Haiku cho đọc/vẽ hình. Rà = Sonnet đọc ảnh; hình khó (hình không gian, đồ thị) Sonnet vẽ rồi điều phối mở bảng soát từng hình.
5. Mỗi đợt: chạy thử ROLLBACK trước; không chạy lượt nặng 17–22 h; không hai lượt ghi song song; `gan_hinh.mjs --thay --nguon …` (script chặn thiếu nhãn); URL cũ lưu biên bản; không xoá ảnh cũ.

## 3. Ngân sách token (ước lượng — chốt bằng lô mẫu)

Giả định (CHƯA đo, lô mẫu để đo): đọc 1 ảnh để rà ≈ 1,5–2k token; vẽ lại 1 hình (xuất gói + viết mã + xuất PNG + soát) ≈ 8–12k token; tỉ lệ cần vẽ lại giả định 20–30 % (chưa có cơ sở — lô mẫu đo tỉ lệ này).

| Hạng mục | Đơn giá ước |
|---|---|
| Rà 1 hình | ~2k |
| Vẽ lại 1 hình (kể cả soát) | ~10k |
| 1 gói vẽ (≤ 6–8 hình) | ~60–80k |

## 4. Các đợt đề xuất (thứ tự ưu tiên + ngân sách)

| Đợt | Phạm vi | Số hình | Việc | Ngân sách (ước) | Vì sao thứ tự này |
|---|---|---|---|---|---|
| **1 — LÔ MẪU** | Đại K6 `T106000000` (26 hình đề) + 10 câu K6 nhắc hình thiếu ảnh | 26 + 10 | Rà 26 (nhãn `goc` / `ve_lai:mã`); vẽ lại tối đa 8 hình tệ; xem 10 câu thiếu ảnh có thật cần hình không → `ve_moi` ≤ 6 | **≈ 150k token** (rà ~50k + vẽ ≤ 8×10k + ve_moi ≤ 6×10k ≈ 190k trần; dừng ở 150k) | Nhỏ; K6 đang fill nên gỡ nghẽn cho phiên kho; Đại K6 là hình phẳng/đơn giản ⇒ đo được tỉ lệ tệ và đơn giá thật |
| 2 | 41 câu "[hình…]" thiếu ảnh (Đại 23 · HGT 6 · Hình–Học K11 12) | 41 | Người đọc đối chiếu tài liệu gốc: có ảnh gốc → cắt `kho_anh.mjs cat` (`goc`); không có → `ve_moi` | ≈ 250–350k | Mở khoá 33 câu kho chuẩn đang bị loại khỏi bài |
| 3 | Hình–Học K11 (934, hình không gian) | 934 | Rà theo bài (hình gắn bài nhiều ý), vẽ lại hình tệ | rà ~1,9M; vẽ theo tỉ lệ đo ở đợt 1 — **chia ≥ 8 lô nhỏ** | Chưa có luật vẽ hình không gian riêng (`spec-kho-cau-hoi` §13.4); cần Thùy chốt trước |
| 4 | Hình–Học K9 `nhap_kho` (917) + K7/K8 `nhap_kho` (294) | 1.211 | Rà → vẽ lại hình tệ | rà ~2,4M | Ảnh nhập sau 13/10, chưa từng xét |
| 5 | Hình–Luyện bài/ý + Hình trên lớp (877) | 877 | Rà (phần lớn đã là code) | ~1,7M | Đa số đã vẽ code; ưu tiên thấp |
| 6 | Đại K7–K9 (277) rồi K10–K12 (6.613) | 6.890 | Rà đồ thị/bảng; chỉ vẽ lại khi có máy vẽ đúng loại | rà ~14M | Đồ thị/bảng chưa có máy vẽ ⇒ nếu tệ chỉ gắn `**Chưa chắc:**` |
| 7 | HGT (1.160) | 1.160 | Rà → vẽ bằng `ve_lai_xuat_hgt.mjs` | ~2,3M + vẽ | Cần chốt khối HGT (xem §5) |
| 8 | Đại K3–K5T (≈ 1.830) | 1.830 | Rà | ~3,7M | Ảnh sách tiểu học; cấp 1–2 là người dùng iPad/PC ⇒ hiển thị quan trọng |

Mỗi đợt từ 3 trở đi **không chạy hết một lượt**: cắt lô ≤ 60 hình rà / ≤ 8 hình vẽ mỗi gói, Thùy duyệt đợt rồi mới ra lệnh.

## 5. Điều cần Thùy chốt

1. **Duyệt đợt 1 (lô mẫu Đại K6)?** Duyệt = cho phép (a) ghi nhãn nguồn hình (`kho_hinh_nguon`) cho 26 hình, (b) vẽ lại ≤ 8 hình tệ và `gan_hinh.mjs --thay --nguon ve_lai:… --ghi` (chạy thử ROLLBACK trước), (c) `ve_moi` ≤ 6 sau khi người xác nhận câu cần hình. Không xoá gì.
2. Khối thật của HGT `T3060` / `T3090` (bộ đếm hiện ra "6" / "9").
3. Đợt 3: có luật vẽ hình không gian lớp 11 chưa (spec ghi "chưa có luật").
4. Clone câu có hình (đổi số kèm vẽ lại hình theo số) — làm hay không? Hiện cấm; nếu làm là việc code riêng (máy vẽ tham số theo dạng), không thuộc kế hoạch này.

## 6. Nợ code ghi nhận (không làm trong phiên này)

- §C10 mục 13: các đường tạo câu có hình đề chỉ `gan_hinh.mjs` và `ghi.mjs` ghi nhãn; đường khác (nhập trên ERP, `nhap_hh_tu_draft`, các script chép) chưa mặc định `goc` ⇒ 118 câu mới sau 15/11 không nhãn (spec-kho-cau-hoi §13.4, §8 L16). Cần đợt sửa code riêng, kể cả backfill `goc` cho câu mới sau 15/11.
- `kho-rules/SO-HINH.md` do máy sinh; nhớ dựng lại sau mỗi lượt ghi hình.

## 7. KẾT QUẢ đợt Đại K6–K8 (21/11, Thùy ra lệnh "làm hết 678", không duyệt riêng từng đợt)

- Phạm vi: `dai_cau_hoi` K6 26 + K7 128 + K8 105 = 259 câu có hình đề. Công cụ ghi: `scripts/anh/gan_hinh_dai.mjs` (mới; chạy thử ROLLBACK rồi `--ghi`; URL cũ ở `scripts/anh/bien_ban/gan-hinh-dai-2026-11-21-01-40-15.json`; ảnh cũ không xoá).
- Rà: Sonnet rà 259 → Opus kiểm mù 20% (52 câu) lệch 8/52, toàn là Sonnet cho "giữ gốc" mà Opus thấy cần vẽ lại (chữ quá nhỏ ở 360px, mất cột, scan bẩn) ⇒ Opus rà lại TOÀN BỘ phần "giữ gốc" còn lại (175 câu). Bài học: trạm Sonnet rà quá dễ tính (~19% sót); lô sau nên để Opus rà hình, Sonnet chỉ vẽ.
- Kết quả ghi DB: **vẽ lại 85 hình** (nhãn `ve_lai`, mã lỗi a–f) · **giữ gốc 159** (nhãn `goc`). Opus kiểm mù 20% hình mới (18): 16 đạt, 2 lỗi nhẹ (T108000000321 thiếu nét đứt; T1070000001619 hoa văn trùng) ⇒ 2 câu đó giữ lại chưa áp.
- **15 câu GIỮ LẠI, chưa đổi hình, chưa ghi nhãn** (cần người xác nhận / đọc lại nguồn; danh sách + lý do ở `giu-lai.json` trong thư mục ghi chú phiên): T1080000001478 · T1080000001659 (số/phép gán suy ra) · T1070000001042 (12 giá trị đọc bằng mắt) · T1080000001383 · T107000000257 · T108000000865 · T1080000002311 · T1070000001644 · T107010102007 (đáp án nghi sai: C=0,5 nhưng hình ~0,25) · T106000000365 (infographic) · T1070000001045 · T107000000072 · T107000000398 (đề/ảnh thiếu dữ kiện) · T108000000321 · T1070000001619.
- Chưa làm: K9 Đại (44) và các kho khác; `SO-HINH.md` đã dựng lại sau lượt ghi.
