KẾT LUẬN: ĐẠT

# Biên bản trạm SOÁT — CK-2425-thang-long (THCS Thăng Long, 2024–2025) · phần Hình

- Số câu sau soát: **12** (bản soạn 11 + 1 bài sót trạm soát bổ sung). Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (3 phần · 12 câu · 1 TLN · 11 tự luận · hình 12 · chưa chắc 0).
- Khớp Pha 1 ngay từ đầu: **11/11** câu của bản soạn (đáp số, hướng chứng minh đều trùng giải mù `CK-2425-thang-long.hinh.kiem.md`; máy kiểm `<LV>\tam\kiem_mu.mjs` — Dạng 6 mỗi bài 1000–3000 cấu hình ngẫu nhiên, sai số ≤ 2·10⁻¹¹).
- Số câu phải sửa: **8** (P1 Bài 1, 2, 3, 5 · P2 Bài 3, 4, 5, 6) — không câu nào sai đáp số cuối; lỗi là tính tiếp từ số đã làm tròn, Phần 1 lộ đáp số / bước vụn, hình (thiếu điểm, nhãn đè), chép đề. Bản gốc trạm soạn: `CK-2425-thang-long.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- **Bài sót: 1** — phần C "Một số bài toán đại số và hình học tối ưu" **Bài 3** (khu vui chơi hình chữ nhật nội tiếp nửa đường tròn bán kính $14$ m, có hình vẽ). Trạm soạn coi là cực trị Đại số; trạm soát lấy vì dữ kiện then chốt là hình học (đỉnh nằm trên nửa đường tròn ⇒ Pythagore với bán kính, chứng minh tâm là trung điểm cạnh đáy) — đã soạn bổ sung `## PHẦN 3`, vẽ `de_P3B3`, `giai_P3B3`, thêm vào phanloai. **Người ghép quyết có giữ không** (tiền lệ `CK-2526-nguyen-binh-khiem`: cực trị có hình minh hoạ ⇒ Đại số; bài này khác ở chỗ hình là dữ kiện, không chỉ minh hoạ). Phần C Bài 2 (khay inox, Cô-si ba số) và Bài 4 (hình hộp, $S$ lớn nhất) là cực trị bất đẳng thức trên hình hộp — không lấy.
- Bài nhập nhầm (Đại số thuần): 0.

## Phân xử P1 Bài 4 (quạt giấy — chữ đề không có "10 cm")

Đã phóng to hình đề ở 260 và 400 dpi (`<LV>\z\soat_quat.png`, `soat_quat2.png`): phần tô xám (giấy) chỉ nằm giữa cung trong và mép ngoài; mũi tên "10 cm" đi từ tâm tới cung trong, mũi tên "25 cm" từ tâm tới mép ngoài; phần trong bán kính $10$ cm để trắng, chỉ có nan. Hình là một phần của đề ⇒ **giải theo hình**: giấy mỗi mặt là phần hình quạt $150^\circ$ giữa hai bán kính $10$ cm và $25$ cm, hai mặt $=2\cdot\dfrac{3{,}14\cdot150\cdot(25^2-10^2)}{360}=1373{,}75\ \text{cm}^2$ (máy tính lại khớp). Trạm soạn làm đúng như vậy và đã có `Ghi chú`; không treo `Chưa chắc` (nếu bỏ qua hình thì $1635{,}42\ \text{cm}^2$ — ghi ở biên bản để CEO biết, không phải hai cách hiểu ngang nhau).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 1 | lập luận | $BC\approx21{,}84+1{,}55$ → $BC=13{,}65\cdot\tan58^\circ+1{,}55\approx23{,}39$ (m) | Tính tiếp từ số đã làm tròn (brief soát mục 5) — đáp số không đổi |
| P1 Bài 1 | hình | `giai_P1B1`: nhãn $N$ dời sang trái chân người | Nhãn chạm đường kích thước $13{,}65$ m |
| P1 Bài 2 | định dạng | Chú ý bỏ "$1648{,}5$ làm tròn lên thành $1649$" → quy tắc làm tròn chung; bỏ dòng `Ghi chú` về làm tròn | Phần 1 lộ đáp số cuối; `Ghi chú` chỉ dành cho đề lỗi / đề sai |
| P1 Bài 3 | định dạng | Bước 1 "Đọc đề để xác định $R$, $n$" → bước nghĩ (bán kính quạt = bán kính hình tròn, cung = góc ở tâm ⇒ dùng công thức quạt) | Bước vụn kiểu "đọc đề" |
| P1 Bài 5 | lập luận | $\widehat{AMB}\approx2\cdot25{,}38=50{,}76^\circ$ và $\widehat{AOB}\approx2\cdot64{,}62=129{,}24^\circ$ → $\widehat{AMO}\approx25{,}377^\circ$, $\widehat{AMB}\approx50{,}754^\circ\approx51^\circ$, $\widehat{AOB}=180^\circ-2\widehat{AMO}\approx129{,}246^\circ\approx129^\circ$; Bước 3 Phần 1 sửa theo | Nhân đôi số đã làm tròn cho ra chữ số thập phân sai ($50{,}76$ thay vì $50{,}75$; $129{,}24$ thay vì $129{,}25$) — đáp số làm tròn tới độ không đổi |
| P2 Bài 3 | hình | `de_P2B3`: thêm đường kính $AD$, cát tuyến $MD$, điểm $D$, $C$ (ý d); `de_P2B3`, `giai_P2B3`: nhãn $O$ (đè $OD$), $C$ (đè $MB$), $H$ ở hình giải (đè $HC$) dời chỗ | Hình đề thiếu điểm của ý d; nhãn đè đường |
| P2 Bài 4 | chép đề | Thêm `Ghi chú`: đề in "tia phân của $COA$" → đã sửa "tia phân giác của $\widehat{COA}$" | Lỗi in hiển nhiên đã sửa chữ nhưng chưa ghi |
| P2 Bài 5 | hình | `de_P2B5`, `giai_P2B5`: vẽ tia $Bx$ có nhãn $x$; nhãn $C$ dời xuống dưới (đè $AB$); nhãn $D$ dời sang phải | Đề có tia $Bx$; nhãn đè đường |
| P2 Bài 6 | hình | `de_P2B6`, `giai_P2B6`: nhãn $O$ dời sang trái dưới | Nhãn đè đường kính $AC$ |
| P3 Bài 3 | sót bài | Soạn mới (2 phần, $S_{\max}=196\ \text{m}^2$ khi $x=y=7\sqrt2$, BĐT từ $(x-y)^2\ge0$, không Cô-si thẳng), vẽ `de_P3B3` / `giai_P3B3`, `loai=tra_loi_ngan`, `dap_an=196` | Bài có hình, dữ kiện hình học (xem trên) |

Soát kiến thức các câu còn lại: không góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / đường trung bình; $MA^2=MC\cdot MD$, $MA^2=MH\cdot MO$, $DB^2=DH\cdot DO=DK\cdot DC$, $CA^2=CD\cdot CK$, $OC^2=OI\cdot OE$ đều suy từ tam giác đồng dạng; góc vuông "chắn nửa đường tròn" chứng minh bằng tam giác cân + tổng ba góc; tiếp tuyến chứng minh bằng dấu hiệu; hai tiếp tuyến cắt nhau nêu đúng tính chất. Không `\times`, `⇔`, "tập nghiệm".

## Phân loại tiếp tuyến cuối cùng (không đổi so với trạm soạn, thêm P3 Bài 3)

| Câu | tt |
|---|---|
| P1 Bài 1 | khong_tt |
| P1 Bài 2 | khong_tt |
| P1 Bài 3 | khong_tt |
| P1 Bài 4 | khong_tt |
| P1 Bài 5 | hai_tt |
| P2 Bài 1 | hai_tt |
| P2 Bài 2 | tt_khac |
| P2 Bài 3 | hai_tt |
| P2 Bài 4 | tt_khac |
| P2 Bài 5 | hai_tt |
| P2 Bài 6 | tt_khac |
| P3 Bài 3 | khong_tt |

Đếm: hai_tt 4 · ba_tt 0 · tt_khac 3 · khong_tt 5. (P2 Bài 2, 4: kết quả cuối có hai tiếp tuyến từ một điểm nhưng đề / lời giải chỉ CHỨNG MINH tiếp tuyến thứ hai bằng tam giác bằng nhau, không dùng tính chất hai tiếp tuyến cắt nhau ⇒ giữ `tt_khac`.)

## Câu còn `Chưa chắc` (gửi CEO)

Không có. Hai điểm cần CEO biết (không phải `Chưa chắc`): P3 Bài 3 là bài trạm soát bổ sung (giữ hay bỏ do người ghép quyết); P1 Bài 4 giải theo hình ($1373{,}75\ \text{cm}^2$).
