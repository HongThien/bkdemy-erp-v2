# Soát lô Hình 8T — chuyên đề Thalès (14/11)

Opus (phiên chính) soát từng trạm: đối chiếu đề với ảnh trang sách, đọc lời giải, mở bảng hình.

| Trạm | Kết quả | Sửa khi soát |
|---|---|---|
| G1 NĐT H1.19–23 | đạt (đối chiếu p113–114) | — |
| G3 NĐT H3.1–5 | đạt | đáp án quan hệ ⇒ tự luận (H3.5a, script tự đổi) |
| G5 NĐT H3.10–14 | đạt (đối chiếu p169) | đáp án quan hệ ⇒ tự luận (H3.10, 13a, 14a) |
| G4 NĐT H3.6–9 | đạt | — |
| G2 NĐT H1.24–27b | đạt | câu tự luận bỏ dap_an (27a) — script tự bỏ |
| G8 TCHH CĐ5 B7–12 | đạt | Bài 7 HH00128 → **HH00127**: lời giải chỉ dùng hệ quả Thalès + so le trong, không dùng tính chất đường phân giác (luật "kiến thức lời giải thật sự cần"). Bài 8 DE_SAU (cần đồng dạng / tâm nội tiếp) |

Luật script `nhap_lo.mjs` thêm khi soát: đáp án trả lời ngắn là một QUAN HỆ (vế phải còn chữ in hoa / ∥ / ⊥) ⇒ câu tự luận; câu tự luận không lưu dap_an; đáp án số về dạng phẳng như kho K8.
| G6 NĐT H3.15–18 | đạt | 18b, 18d DE_SAU (phương pháp diện tích) |
| G7 TCHH CĐ5 B1–6 | đạt | B1 DE_SAU (đồng dạng); B4, B5 giải lại không đồng dạng; B6 chỉ cần định nghĩa tia phân giác ⇒ HH00127 |
| G9 TCHH CĐ5 B13–17 | đạt | B15 DE_SAU (giả thiết toàn góc ⇒ đồng dạng); B17 đề sách thiếu "d không song song AB" — thêm (có phản ví dụ); B16 ⇒ HH00162 bổ đề hình thang |

**Sơ đồ tư duy (luật Thùy 14/11, README §3):** giữa lô mới biết luật — 4 trạm Sonnet đổi khuôn mọi câu chứng minh (drafts → drafts_v2), cổng
`nhap_lo.mjs --chi-kiem` (luật chép từ `docSoDo`) 0 lỗi; Opus đọc mẫu sơ đồ G1, G6, G7, G9: ô là mốc thật, "từ" đúng.

**Đã ghi 14/11:** 59 câu (47 bài, 12 bài nhiều ý) — HH00127 Thalès 37 · HH00161 Đường trung bình 16 · HH00131 Mê-nê-la-uýt/Xê-va 4 · HH00162 Bổ đề hình thang 2;
47 sơ đồ tư duy; 76 ảnh vẽ lại đã đẩy lên kho-anh; tự duyệt (8T). 5 bài DE_SAU (TCHH-5.1, 5.8, 5.15 · NĐT H3.18b, 18d) — lô Đồng dạng / Diện tích làm.
Trang duyệt: `kho-rules/hinh/k8T-thales-lo1-duyet.html`. Bản nháp + script vẽ/kiểm của trạm: `drafts/`, `ve/`.

## Lô 2 (15/11) — Thalès + đường trung bình, nguồn còn lại
12 trạm Sonnet (G10–G21): TCHH CĐ3 phần II (VD1–10, Bài 1–45) · VHB2 §13–14 (VD31–35, BT 171–218) · VHB1 §2 (BT 14–20). Luật thêm: KHÔNG đồng dạng (Thùy 14/11); bài chỉ cần Tứ giác / tam giác lớp 7 ghi `KHAC`; bài trùng lô 1 ghi `TRUNG`.
Phiên bị ngắt giữa chừng, 6 trạm mất bản nháp ⇒ resume bằng SendMessage; bản nháp ghi file sớm.
Soát: Opus đọc mẫu sơ đồ + hình (G16, G20 bài 216…); cổng `nhap_lo.mjs --chi-kiem` 0 lỗi. Bỏ khỏi lô: TCHH-3.II.18 (ý b cực trị bằng Cô-si ⇒ chuyên đề Cực trị). Đáp án quan hệ ⇒ tự luận; căn thức giữ LaTeX `$…$`; "35 hoặc 10" ⇒ "35; 10".
**Đã ghi:** 103 câu (79 bài): Thalès +70 · Đường trung bình +20 · Phân giác +9 · Bổ đề hình thang +3 · Mê-nê-la-uýt +1; 88 sơ đồ tư duy; 139 ảnh; tự duyệt.
**Để riêng (43 khối, trong nháp):** DE_SAU (đồng dạng / diện tích / cực trị) · KHAC (tam giác lớp 7, hình chữ nhật…) · TRUNG · bài sách không lời giải.
Trang xem: lô 2A (TCHH) https://claude.ai/artifact/KcLUMiACR1XoQkW1dk4GVa · lô 2B (VHB) https://claude.ai/artifact/6xej727EgonVfkBAEcfcb3.

## Lô 3 (22/11) — đẩy thêm bài tập vào Phân giác · Mê-nê-la-uýt/Xê-va (Thùy: "Đẩy thêm bài tập vào các phần vừa rồi")
4 trạm Sonnet (G22 NĐT Hình III §3 bài 19–27 · G23 VHB2 §15 VD36 + BT 219–228 · G24 TCHH CĐ4 Bài 1–7 · G25 TCHH CĐ4 Bài 8–13 + 10 bài tự luyện); 2 trạm Opus soát độc lập (đối chiếu đề với ảnh trang, đọc từng dòng lời giải, mở bảng hình): tìm 3 lỗi toán/đề (TCHH 4.4 lập luận vòng, 4.8 "H∈AO", NĐT 26 đề thừa ngoặc), 2 lỗi khuôn, 1 lỗi hình — đã sửa. Cổng `nhap_lo.mjs --chi-kiem` 0 lỗi; máy kiểm toạ độ 32.400+ phép 0 FAIL.
**Đã ghi:** 30 câu (23 bài) — Phân giác +20 (9 → 29) · Mê-nê-la-uýt/Xê-va +9 (5 → 14) · Thalès +1 (107 → 108); 19 sơ đồ tư duy; 43 ảnh; tự duyệt. `--bo VHB2-226` (trùng NĐT-H3.26).
**Để riêng (trong nháp `lo3/drafts`):** DE_SAU — NĐT-H3.20 (diện tích → HH00166) · VHB2-222 (quỹ tích → HH00135) · VHB2-227* (diện tích → HH00132) · TCHH-4.7 (bổ đề ba trực tâm — Opus nghi giải được chỉ bằng Thalès, chờ Thùy quyết) · TCHH-4.12 (đồng dạng) · KHAC (Tứ giác): TCHH-4.1, 4.9 (HH00093) · 4.3, 4.6 (HH8T000000) · TRUNG: NĐT-H3.22, H3.23, VHB2-226, TCHH-4.TL6 · KHONG_NHAP: TCHH-4.TL1–5, TL7–10 (sách không lời giải).
Bản nháp + script vẽ/kiểm của trạm: `lo3/drafts`, `lo3/ve`.
