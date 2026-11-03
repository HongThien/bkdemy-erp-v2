KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2526-thanh-am · phần Hình (trạm soát Opus, 03/11/2026)

- Số câu: 8 sau soát (trạm soạn 6 + trạm soát bổ sung 2), tất cả `tu_luan`, `kho=hinh_hoc`.
- Khớp Pha 1 ngay từ đầu: 6/6 câu trạm soạn đã làm (III.1 $\approx115{,}7$ m theo chữ · III.2 $\approx8{,}4$ m, $\approx12{,}0$ m, ra xa · III.3 $\approx2{,}1$ m · IV.1, IV.2, IV.3 cùng hướng chứng minh; IV.1c, IV.2c, IV.3c cùng đi qua $X=BN\cap MH$ / $D=AM\cap BC$ / trực tâm $\triangle ABH$, không dùng đường trung bình, góc nội tiếp).
- Số câu phải sửa: 6 (P1 Bài 1, P1 Bài 3, P2 Bài 1, P2 Bài 2, P2 Bài 3 — sửa nhỏ; P1 Bài 5, Bài 6 — sót bài, trạm soát soạn mới). P1 Bài 2 không sửa.
- Bài sót: 2 — III.5, III.6 (hình chữ nhật $MNPQ$ nội tiếp tam giác đều, diện tích lớn nhất). Trạm soạn coi là cực trị Đại số; tôi xếp là Hình: đề có hình vẽ, phải tính chiều cao cửa bằng $\tan60^\circ$ trong tam giác vuông $QBM$ (Chương IV) rồi mới ra biểu thức bậc hai — đúng định nghĩa brief soạn mục 1 ("tính độ dài / diện tích trên hình"), không phải "Đại số thuần". Đã soạn đủ 2 phần, vẽ hình đề, thêm vào `phanloai.json` (`khong_tt`). Nếu CEO muốn để hai bài này cho lượt Đại số thì chỉ cần bỏ hai mục `### Bài 5`, `### Bài 6`.
- Bài nhập nhầm: 0. III.4 (khách sạn, doanh thu lớn nhất) là Đại số thuần — đúng là không lấy.
- Đề chép đúng ảnh cả 6 câu trạm soạn ("so voi" → "so với", "căm chỉnh" → "căn chỉnh", "KMH = NMB" → $\widehat{KMH}=\widehat{NMB}$ đều đã có Ghi chú).
- III.1 phân xử ảnh (phóng to 260 dpi `z/kiem_III1_goc.png`, `z/kiem_III1_chu.png`): chữ in rõ $40^\circ$; hình in ghi rõ $50^\circ$ tại $B$, giữa đường bay $BC$ và mặt đất $BA$, và hình vẽ đúng khoảng $50^\circ$ (đo trên ảnh: $\arctan\frac{233}{195}\approx50^\circ$). Không phải lỗi in hiển nhiên có đáp án rõ: hai cách đọc cho hai kết luận ngược nhau (an toàn / không an toàn) ⇒ đúng ca "hai cách hiểu cho hai đáp số khác nhau" của brief soạn mục 7 ⇒ thêm `**Chưa chắc:**`, giữ lời giải theo chữ của trạm soạn.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (8 câu, hình 8, chưa chắc 1).
- Bản gốc trạm soạn: `CK-2526-thanh-am.hinh.soan.goc.md`; script vẽ gốc `<LV>\tam\ve_hinh.soan-goc.mjs`; phanloai gốc `<LV>\tam\phanloai.soan-goc.json`.
- Kiểm bằng máy: `<LV>\tam\kiem_mu.mjs` (giải mù, 20 000 cấu hình mỗi bài IV, 0 lỗi; III.5/III.6 quét $x$) + `ve_hinh.mjs` của trạm soạn chạy lại đạt (thêm phần kiểm III.5, III.6).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 5 | sót bài | Soạn mới: đề, Ghi chú, 2 phần, hình đề `de_P1B5.png` (vị trí hình chữ nhật bất kì, không vẽ vị trí lớn nhất), phanloai `khong_tt` | Bài Hình có hình vẽ + $\tan60^\circ$; trạm soạn bỏ sót. Đáp số $\dfrac{9\sqrt3}{2}\approx7{,}8\ \text{m}^2$ khi $BM=CN=1{,}5$ m |
| P1 Bài 6 | sót bài | Soạn mới tương tự, đặt $PQ=x$ đúng như hình in, hình đề `de_P1B6.png` giữ kí hiệu $x$, phanloai `khong_tt` | Như trên. Đáp số $32\sqrt3\approx55{,}4\ \text{dm}^2$ khi $PQ=8$ dm |
| P1 Bài 1 | đề (hai cách hiểu) | Thêm `**Chưa chắc:**` nêu kết quả phóng to và hai kết luận | Chữ $40^\circ$ / hình $50^\circ$ cho kết luận ngược nhau — cần CEO chốt, không tự chọn được |
| P1 Bài 3 | lập luận (làm tròn) | "$\approx2{,}5\cdot\tan58{,}66^\circ$" → "$=2{,}5\cdot\tan\widehat{ABD}$ … (dùng giá trị $\widehat{ABD}$ chưa làm tròn)" | Dòng cũ viết phép tính trên góc đã làm tròn (luật: không tính tiếp từ số đã làm tròn); đáp số không đổi |
| P2 Bài 1 | lập luận | Ý c: "Xét $\triangle HBX$ vuông tại $H$ nên $\widehat{HBX}$ nhọn, suy ra $X$ thuộc tia $BN$…" → "Vì $\widehat{ABN}$ nhọn (cmt) và $H$ thuộc đoạn $AB$ nên $X$ thuộc tia $BN$…" | Dòng cũ suy ngược (dùng tam giác $HBX$ trước khi biết $X$ nằm đâu) |
| P2 Bài 1 | định dạng | Ý a: tách dòng "có $HE$ là đường trung tuyến … ($E$ là trung điểm của $AM$ (gt))" thành 2 dòng | Dòng dài > 60 kí tự |
| P2 Bài 1 | hình | `giai_P2B1.png`: dời nhãn $Q$ sang phải điểm $Q$ | Nhãn $K$ và $Q$ dính nhau thành "KQ" |
| P2 Bài 2 | hình | `de_P2B2.png`: bỏ dấu góc vuông tại $H$ (giữ ở `giai_P2B2.png`) | $AB\perp OM$ là điều phải chứng minh ở ý b — hình đề lộ kết quả |
| P2 Bài 2 | định dạng | Tách 3 dòng dài (kết luận ý a; "Suy ra $\frac{AM}{AD}=\frac{AO}{AC}=\frac12$ (…; …)"; "Vì $B$, $M$ cùng phía … (…, …)") | Dòng dài > 60 kí tự |
| P2 Bài 3 | định dạng | Tách dòng kết luận ý a | Dòng dài |
| P2 Bài 3 | hình | `de_P2B3.png`: thêm dấu góc vuông tại $K$ | $AK\perp BH$ là giả thiết, hình cũ thiếu |
| Ghi chú người duyệt | định dạng | Cập nhật mục cuối tệp (8 bài, câu Chưa chắc) | Mục cũ ghi "6 bài", "không có Chưa chắc" |

Không sửa: P1 Bài 2 (đề, đáp số, lời giải, hai hình đúng). Phần 1 cả 6 câu trạm soạn: bước nghĩ thật, không lộ đáp số cuối. Kiến thức: không góc nội tiếp / tứ giác nội tiếp / đường trung bình / hệ thức đường cao dùng thẳng ($HM^2=HA\cdot HB$, $OA^2=OH\cdot OM$, $CH\cdot CA=2R^2$ đều suy từ tam giác đồng dạng); IV.2 nêu đúng tính chất hai tiếp tuyến cắt nhau ($MA=MB$ ⇒ $OM$ trung trực $AB$).

## Phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P1 Bài 1 | khong_tt |
| P1 Bài 2 | khong_tt |
| P1 Bài 3 | khong_tt |
| P1 Bài 5 | khong_tt |
| P1 Bài 6 | khong_tt |
| P2 Bài 1 | khong_tt |
| P2 Bài 2 | hai_tt |
| P2 Bài 3 | tt_khac |

(6 câu trạm soạn giữ nguyên phân loại — đều đúng; 2 câu bổ sung `khong_tt`.)

## Câu còn `Chưa chắc` (gửi CEO)

- **P1 Bài 1 (Flycam):** chữ đề ghi góc $40^\circ$, hình in ghi $50^\circ$ (cả hai rõ khi phóng to). Theo chữ: độ cao $\approx115{,}7$ m — an toàn; theo hình: $\approx137{,}9$ m — không an toàn. Lời giải đang theo chữ. CEO chốt theo chữ hay theo hình.
