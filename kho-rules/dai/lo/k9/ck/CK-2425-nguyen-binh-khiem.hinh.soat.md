KẾT LUẬN: ĐẠT

# Biên bản SOÁT — CK-2425-nguyen-binh-khiem · phần Hình (THCS Nguyễn Bỉnh Khiêm, 2024–2025)

Trạm soát Opus, 03/11/2026. Giải mù: `CK-2425-nguyen-binh-khiem.hinh.kiem.md` (máy: `<LV>\tam\kiem_mu.mjs`). Bản trước khi sửa: `CK-2425-nguyen-binh-khiem.hinh.soan.goc.md` (phanloai gốc + script vẽ gốc: `<LV>\tam\phanloai.goc.json`, `<LV>\tam\ve_hinh.goc.mjs`).

- Số câu: **5** (P1 Bài 1–4: tỉ số lượng giác thực tế / bánh đà · P2 Bài 5: hình vuông + tiếp tuyến).
- Khớp Pha 1 ngay từ đầu (đề + đáp số / hướng chứng minh): **5/5** — $574{,}4$ m · $60{,}6$ m · $MA=MB\approx31{,}6$ cm, $\widehat{AMB}\approx50^\circ45'$, $\widehat{AOB}\approx129^\circ15'$ · $258$ m · Bài 5 đúng cả hai ý (máy 3000 hình vuông, 0 lỗi).
- Số câu phải sửa: **1** (P1 Bài 3 — hình đề). Ngoài ra sửa chữ phần `ghi` của P2 Bài 5 trong phanloai.json (giá trị `tt` không đổi).
- Bài sót: **0** (Pha 0: đề cương có đúng 5 bài Hình — Dạng 5 Bài 1–4, Dạng 6 Bài 5; Bài 7 thửa ruộng tam giác vuông và Bài 21 căng dây hình chữ nhật là Đại số thuần, không lấy). Bài nhập nhầm: **0**.
- Kiến thức: không góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / sin–côsin / đường trung bình / hệ thức đường cao dùng thẳng (Bài 5: $BM\cdot MK=MO^2$ suy từ $\triangle MBO\backsim\triangle MOK$) / `⇔`. Dấu hiệu tiếp tuyến (Bài 5b) và tính chất hai tiếp tuyến cắt nhau (Bài 3, Bài 5) nêu đúng. Phần 1 không lộ đáp số. Làm tròn theo đề (Bài 1, 2, 3 đề đều nêu).
- Phân loại: Bài 2 `tra_loi_ngan` `60,6` · Bài 4 `tra_loi_ngan` `258` đúng luật (một số ≤ 4 kí tự); Bài 1 ($574{,}4$, 5 kí tự), Bài 3, Bài 5 `tu_luan` đúng.
- Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ **✔ đạt cổng** (5 câu · 2 TLN · 3 tự luận · hình 5 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 3 | hình | Hình đề `de_P1B3.png`: thêm bán kính $OA$ và nhãn "15 cm" (sửa `ve_hinh.mjs`, vẽ lại); cập nhật dòng `**Ghi chú:**` (hình giải giờ chỉ thêm $OB$ + hai góc vuông) | Đề cho bán kính $15$ cm nhưng hình đề chỉ ghi $OM=35$ cm — thiếu số đo đề cho. Hình gốc trong đề cương cũng vẽ $OA$, $OB$. Không lộ kết quả (tiếp tuyến ⊥ bán kính chưa đánh dấu ở hình đề). |
| P2 Bài 5 | phân loại (chữ `ghi`) | `ghi` đổi từ "dùng BA = BM, KM = KD" thành "dùng tính chất hai tiếp tuyến cắt nhau tại B và K (OB, OK phân giác hai góc kề bù) ⇒ OB ⊥ OK, rồi BM·MK = OM²" | Lời giải không dùng $BA=BM$, $KM=KD$; `ghi` phải mô tả đúng tính chất lời giải dùng. `tt=ba_tt` giữ nguyên (đúng mẫu: tiếp tuyến tại hai đầu đường kính $AD$ + tiếp tuyến thứ ba tại $M$). |

Hình đã mở kiểm hết (9 tệp): đúng tỉ lệ (Bài 1 $\tan\approx0{,}122$; Bài 2 tỉ số $1{,}73$; Bài 3 $OM:OA=35:15$, $OA\perp MA$; Bài 4 cân $45^\circ$; Bài 5 $DK=\tfrac{AB}{4}$, $M$ là tiếp điểm thật), nhãn không đè, canvas ≤ 450 px, hình đề không lộ kết quả (Bài 5 hình đề không vẽ $OK$, không đánh góc vuông tại $O$).

## Phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P1 Bài 1 | khong_tt |
| P1 Bài 2 | khong_tt |
| P1 Bài 3 | hai_tt |
| P1 Bài 4 | khong_tt |
| P2 Bài 5 | ba_tt |

Đếm: hai_tt 1 · ba_tt 1 · tt_khac 0 · khong_tt 3.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
