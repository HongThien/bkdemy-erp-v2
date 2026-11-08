KẾT LUẬN: ĐẠT

# Biên bản soát PDP-CKI-2025 khúc 2 (tr.5–9 đầu) — trạm soát Opus, 28/10

- Số câu: 54 (PHẦN 21: 8 bài hình KG tự luận · PHẦN 22: 29 câu giới hạn tự luận · PHẦN 23: 17 câu TN; Câu 6 bỏ).
- Khớp Pha 1 ngay từ đầu (đáp số / kết luận): 54/54. Mọi tỉ lệ hình KG (Bài 3c, 4c, 6d, 6e, 7b, 8c, 10b) đã kiểm bằng toạ độ số (`tam\soat_mu_p2.mjs`), đúng cả.
- Đề gõ đối chiếu ảnh tr.5–9: khớp, không thiếu / thừa câu.
- Câu phải sửa: 9 câu khác nhau — hình giải vẽ lại 8 (Bài 3–10) · lập luận 1 (Bài 7) · định dạng 2 (Bài 6 bỏ Chưa chắc, Câu 11 lời Mấu chốt). Không câu nào sai đáp số / chép đề / phân loại.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng. Bản gốc: `PDP-CKI-2025.p2.soan.goc.md`; script hình gốc: `tam\ve_p2.goc.mjs`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P21 Bài 7 | lập luận | Thay câu "Vì $FJ\parallel B'D'$ nên $B'$ là trung điểm của $A'K$" bằng hai tam giác bằng nhau $FB'K=FC'J$ ⇒ $B'K=C'J=\frac12AB$ | $B'$ KHÔNG là trung điểm $A'K$ ($A'K=\frac32A'B'$); giá trị $B'K$ đúng nhưng căn cứ sai |
| P21 Bài 6 | định dạng | Bỏ dòng `**Chưa chắc:**` ý e, giữ Ghi chú "đề sai" + Lưu ý | Đề sai đã kiểm chắc bằng số (3 hình chóp ⇒ tỉ số 0,71 · 0,86 · 0,56); không phải ca hai cách hiểu |
| P23 Câu 11 | định dạng | Mấu chốt: "công thức hạ bậc" → "công thức nhân đôi" | $\cos2b=1-2\sin^2b$ là công thức nhân đôi |
| P21 Bài 3 (hình) | hình | Dời $C$ ra ngoài bóng mặt $SAB$; chỉ $AC$, $MQ$, $NP$, $CN$ khuất; $NT$, $ST$ nét liền | Hình cũ: $C$ nằm trong bóng tam giác $SAB$ mà $SC$, $BC$ vẽ nét liền |
| P21 Bài 4 (hình) | hình | Dời $D$ ra ngoài bóng $ABC$, đổi góc nhìn cho thiết diện $EFLH$ không bị dẹt; thêm $Q$ (trung điểm $AB$) và $CQ$; $AN$ nét liền | Hình cũ: $AD$, $CD$ liền nhưng $BD$ khuất (mâu thuẫn vì $D$ trong bóng); lời giải dùng $Q$ mà hình thiếu |
| P21 Bài 5 (hình) | hình | Đặt đáy lớn $AD$ ở phía sau (chỉ $AD$ khuất), bỏ $M$/$SM$ không dùng trong lời giải | Hình cũ: $B$, $C$ trong bóng $SAD$ mà $SB$, $SC$, $AB$, $CD$ liền, $BC$ khuất |
| P21 Bài 6 (hình) | hình | $SD$ khuất; thêm $DQ$ (qua $G$), $X$, $Y$, $Z$, $K$, $L$ cùng $BX$, $BY$, $OZ$, $KL$ | $D$ trong bóng hình chóp; lời giải dùng các điểm này mà hình thiếu |
| P21 Bài 7 (hình) | hình | Thêm $K$ (trên tia $A'B'$), $H$ (trung điểm $BC$), các đoạn $FK$, $IK$, $EH$, $HF$ | Lời giải dùng $K$, $H$ mà hình thiếu |
| P21 Bài 8 (hình) | hình | Dời $C$ ra sau-phải (chỉ $AC$ và mặt $ACC'A'$ khuất); thêm $O'$; $RP$, $BC'$, $PK$ nét liền | Hình cũ: $C$ trong bóng mặt trước mà $CC'$, $BC$ liền; $PR$ trong mặt khuất lại liền |
| P21 Bài 9 (hình) | hình | Cùng khung tứ diện mới của Bài 4 (chỉ $BD$ khuất), $AK$ liền | Cùng lỗi nét khuất như Bài 4 |
| P21 Bài 10 (hình) | hình | Cùng khung lăng trụ mới của Bài 8; $NP'$, $P'I$, $B'C$ liền, $PP'$, $MN$ khuất | Hình cũ: $C$ trong bóng mặt trước mà $CC'$, $BC$ liền |

## Đã kiểm, không sửa
- Câu 6 PHẦN 23 bỏ đúng: trên ảnh cả bốn phương án đều sai ($\cos(a-b)$ in dấu trừ, $\cos(a+b)$ dấu cộng, $\sin(a-b)$ dấu cộng, $\sin(a+b)$ dấu trừ và thiếu $b$).
- Bài 10: ý a, b cùng nói về $B'C$ (Ghi chú của trạm soạn đúng); $\frac{KB'}{KC}=3$ khớp toạ độ.
- Bài 6e: $\frac{SE}{SA}=\frac{SF}{SC}=\frac45$ khớp toạ độ; tỉ số diện tích $DQF/DBC$ đổi theo hình chóp ⇒ đề sai.
- Tỉ lệ tính tay: Bài 3c ($N$ trung điểm $CT$), 4c ($\frac{HA}{HD}=\frac12$), 6d ($\frac{ID}{IA}=\frac12$), 7b ($I$, $J$ trung điểm), 8c ($\frac{KB}{BC'}=\frac14$), 10b (3) — đều khớp máy.
- Giới hạn 1a–5d, TN 1–18: khớp Pha 1; không dùng đạo hàm / L'Hôpital.

## Gửi CEO (đề sai / chưa chắc)
- **P21 Bài 6 ý e — đề sai:** hai tam giác $DQF$, $DBC$ không cùng mặt phẳng nên tỉ số diện tích không xác định; lời giải xác định $E$, $F$ và $\frac{SE}{SA}=\frac{SF}{SC}=\frac45$. Có thể đề định hỏi tỉ số khác (vd $SEF$ với $SAC$ là $\frac{16}{25}$) — CEO xem.
- **P23 Câu 6 — bỏ:** không có phương án đúng.
- Không còn câu `Chưa chắc`.
