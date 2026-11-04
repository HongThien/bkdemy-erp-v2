KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-hoang-hoa-tham · phần Hình (trạm soát Opus, 03/11/2026)

- Số câu: **16** (P1: 24.1, 24.2, 24.3, 25.1, 25.2, 25.3, 26–33 · P2: 39, 40).
- Pha 0: tự lập danh sách bài Hình từ ảnh p-1…p-8 trước khi mở bản soạn → khớp đủ 16 câu. **Không sót bài, không nhập nhầm bài Đại số.** Tách 24 và 25 thành ba tình huống độc lập (.1 .2 .3) đúng luật tách ý độc lập; 24.3 giữ a, b chung dữ kiện.
- Pha 1 (giải mù, `CK-2425-hoang-hoa-tham.hinh.kiem.md`; máy `<LV>\tam\kiem_soat.mjs`, 3000 cấu hình mỗi bài chứng minh, 0 lỗi): **16/16 câu khớp đáp số / hướng chứng minh ngay từ đầu.**
- Số câu phải sửa: **7** (2 về lời giải / ghi chú, 5 về hình). Không câu nào sai đáp số, sai kiến thức hay sai phân loại.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (16 câu, 16 hình, chưa chắc 0).
- Bản gốc trạm soạn: `CK-2425-hoang-hoa-tham.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.soan.mjs`.

## Hai điểm được giao kiểm riêng

- **Bài 27 — sửa chữ đề "cắt $AB$ tại $H$" → "$OM$ cắt $AB$ tại $H$": ĐÚNG.** Đề in "Kẻ đường kính $AD$ của đường tròn $(O)$, cắt $AB$ tại $H$" vô nghĩa (đường kính $AD$ đã qua $A\in AB$). Ý 2 ($OHBI$ là hình chữ nhật) bắt buộc $\widehat{OHB}=90^\circ$, $H\in AB$ ⇒ $H$ là chân đường vuông góc từ $O$ xuống $AB$ = giao của $OM$ với $AB$. Máy kiểm với $H=OM\cap AB$: ý 2 (hình chữ nhật, $KD$ tiếp tuyến) và ý 3 ($K$ trung điểm $DQ$, $Q$ trên tia $AB$) đúng 3000/3000. Lời giải ý 3 của trạm soạn (đồng dạng ⇒ $ON\cdot OQ=OD^2$ ⇒ $QD\perp OD$ ⇒ $Q$ trên tiếp tuyến tại $D$; trung điểm $K'$ của $DQ$ nằm trên trung trực $BD$) đúng toán, không dùng công cụ cấm. Có `Ghi chú` đầy đủ.
- **Bài 40 — hình chữ nhật có bốn đỉnh trên đường tròn, giá trị nhỏ nhất: HỢP phạm vi Hình.** Bài thuộc mục "Mở rộng, nâng cao" nhưng là bài hình thật (đề có hình; dùng tính chất đường chéo hình chữ nhật, Pythagore, diện tích hình tròn — Chương V). Bước cực trị là bất đẳng thức đại số $AB^2+BC^2\ge2\cdot AB\cdot BC$, được **chứng minh từ $(AB-BC)^2\ge0$ ngay trong bài** (không dùng thẳng Cô-si) ⇒ đúng luật `dai/k9.md` §1.2. Không có "nội tiếp" như công cụ (chỉ là chữ mô tả trong Ghi chú cũ — đã đổi chữ cho khỏi lẫn). Đáp số $961\left(\dfrac{\pi}{2}-1\right)\approx548{,}54\ \text{m}^2$ khớp máy. Phân loại `khong_tt` đúng.

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| 24.2 | lập luận (làm tròn) | $BC=250\cdot\tan32^\circ$ giữ dạng đúng; $BD=250\cdot\tan32^\circ+3{,}2\approx159{,}4$ m (bỏ dòng cộng $156{,}2+3{,}2$) | Luật: không tính tiếp từ số đã làm tròn (đáp số không đổi: 159,417). |
| 40 | định dạng (Ghi chú) | "hình chữ nhật bất kì nội tiếp đường tròn" → "có bốn đỉnh nằm trên đường tròn" | "Nội tiếp" là kiến thức cấm ở lượt này; tránh để chữ đó trong dữ liệu câu. |
| 25.3 | hình | Nhãn bán kính 15/18/21/24 dời sát bên trong từng đường tròn, phía trên bán kính | Nhãn cũ nằm đè lên nét đường tròn (bị gạch ngang). |
| 30 | hình | Nhãn $H$ (đề + giải) dời lên góc trên-trái của điểm | Nhãn cũ nằm đè lên đoạn $OH$. |
| 31 | hình | Nhãn $H$ (hình giải) dời lên góc trên-trái | Nhãn cũ nằm đè lên đoạn $OH$. |
| 32 | hình | Hình đề thêm bán kính $OC$ (dấu góc vuông tại $C$ trước đó chỉ còn một cạnh); nhãn $S$ dời xuống ngay dưới điểm | Dấu góc vuông tại tiếp điểm $C$ thiếu cạnh $OC$; nhãn $S$ đè lên đoạn $SE$. |
| 33 | hình | Hình đề: nhãn $M$ dời sang phải điểm | Nhãn cũ đè lên tiếp tuyến $CD$. (Hình giải giữ chỗ cũ: phía phải bị $OC$ chắn, nhãn vẫn đọc được.) |

Mọi hình đã mở lại kiểm sau khi vẽ lại: đúng dữ kiện, đủ điểm, tiếp tuyến ⊥ bán kính, không lộ điều phải chứng minh (Bài 29 hình đề không vẽ $MB$; Bài 27 hình đề không vẽ $QD$).

## Phân loại tiếp tuyến cuối cùng (không đổi so với trạm soạn)

| Câu | tt |
|---|---|
| P1 Bài 24.1 | khong_tt |
| P1 Bài 24.2 | khong_tt |
| P1 Bài 24.3 | khong_tt |
| P1 Bài 25.1 | khong_tt |
| P1 Bài 25.2 | khong_tt |
| P1 Bài 25.3 | khong_tt |
| P1 Bài 26 | ba_tt |
| P1 Bài 27 | hai_tt |
| P1 Bài 28 | hai_tt |
| P1 Bài 29 | hai_tt |
| P1 Bài 30 | hai_tt |
| P1 Bài 31 | hai_tt |
| P1 Bài 32 | hai_tt |
| P1 Bài 33 | hai_tt |
| P2 Bài 39 | tt_khac |
| P2 Bài 40 | khong_tt |

Đếm: hai_tt 7 · ba_tt 1 · tt_khac 1 · khong_tt 7. (Bài 29: hai tiếp tuyến $MA$, $MB$ cắt nhau tại $M$, $OM$ là trung trực $AB$, $OI\cdot OM=R^2$ — đúng mô hình hai tiếp tuyến dù đề bắt chứng minh $MB$ là tiếp tuyến ⇒ giữ `hai_tt`.)

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Ghi thêm (không phải lỗi bản soạn): ảnh gốc Bài 24.1 đặt nhãn "6m" sát cạnh huyền $BC$, nhưng chữ đề nói rõ "cột đèn $AB$ cao 6m" ⇒ theo chữ ($\approx59^\circ45'$); hình vẽ lại ghi 6 m trên $AB$.
