KẾT LUẬN: ĐẠT

# GKI-36 — THCS Vạn Phúc (Thanh Trì), 2024–2025 — biên bản soát (Pha 2)

- Số câu: **15** (8 trắc nghiệm · Bài 1a, 1b, 1c · Bài 2 · Bài 3 · Bài 4 · Bài 5). Đề gốc 8 câu trắc nghiệm + 5 bài tự luận, không sót câu, không sót ý.
- Khớp đáp án / đáp số Pha 1 (giải mù, `GKI-36.kiem.md`) ngay từ đầu: **15 / 15**. Đề không in bảng đáp án.
- Số câu phải sửa: **6** (Câu 1, Câu 8, Bài 1c, Bài 2, Bài 4, Bài 5) — không câu nào sai đáp số hay chép sai đề; 1 chỗ hổng lập luận (Bài 4d), còn lại là câu chữ. Bản trước khi sửa: `GKI-36.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (15 câu · chưa chắc 0).
- Chép đề: đối chiếu từng câu với ảnh trang (số mũ, dấu, phân số, phương án, tên điểm) — đúng hết.
- Phân loại: kho, loại, tách ý đúng luật (Bài 1 "Rút gọn" 3 ý độc lập ⇒ tách; Bài 2 ba ý ba loại khác nhau, Bài 3 lời văn, Bài 4 hình ⇒ giữ một câu; Bài 5 đáp số nguyên 0 ⇒ `tra_loi_ngan`).
- Kiến thức: đề có hằng đẳng thức (Câu 4, Bài 2) và hình chữ nhật (Câu 8, Bài 4a, 4d) ⇒ được dùng HĐT, hình chữ nhật, trung tuyến ứng với cạnh huyền. Không thấy đường trung bình / Thalès / Pythagore / phân tích nhân tử, kể cả dùng ngầm.

## Soát riêng Bài 4 (theo lưu ý của người giao)

- **Ý b** dùng "trung tuyến ứng với cạnh huyền": đề có hỏi tới hình chữ nhật ⇒ được dùng ⇒ **đã xoá dòng `Chưa chắc`** của trạm soạn (lí do thứ hai của dòng đó — "dữ kiện gợi bài đường trung bình" — cũng không cần giữ: $D$, $E$ không phải trung điểm cho sẵn mà là hình chiếu; bài giải trọn trong kiến thức bài Hình chữ nhật, không phải loại bài "dữ kiện đúng là đường trung bình" như GKI-17, GKI-21).
- **Ý c** — đọc từng dòng, không có chỗ nào ngầm dùng đường trung bình:
  $MA=MB$ (trung tuyến ứng cạnh huyền) ⇒ $\triangle MAB$ cân tại $M$, đường cao $MD$ là trung tuyến ⇒ $D$ là trung điểm $AB$ (tam giác cân, lớp 7) → $EM=AD=DB$, $EM\parallel AB$ (cạnh đối hình chữ nhật $ADME$) → $\widehat{EMQ}=\widehat{DBP}$ (đồng vị) → $BP=MQ$ → $\triangle DBP=\triangle EMQ$ (c.g.c) → $\widehat{DPB}=\widehat{EQB}$ đồng vị ⇒ $DP\parallel EQ$. Không có bước "$DP\parallel AM$ vì $D$, $P$ là trung điểm".
- **Ý d** — $DPQE$ là hình bình hành từ $DP\parallel EQ$, $DP=EQ$ (ý c); điều kiện $AB=AC$ chứng minh cả hai chiều qua $\triangle DBM$ cân / đường trung trực của $BM$. Không dùng "$DE\parallel BC$" hay "$DE=\dfrac{1}{2}BC=PQ$" kiểu đường trung bình. **Hổng:** bản soạn dùng "$E$ là trung điểm $AC$" mà chưa chứng minh ở đâu ⇒ đã thêm (tam giác cân $MAC$, đường cao $ME$).
- Toạ độ (3 bộ $AB$, $AC$ trong `<LV>\tam\soat-mu.mjs`): $DE=\dfrac{1}{2}BC$, $DP\parallel EQ$, $DP=EQ$ luôn đúng; $DP\perp PQ$ chỉ khi $AB=AC$.
- **Hình giải** `giai_bai4.png`: dựng đúng dữ kiện (vuông tại $A$, $M$, $P$, $Q$ là trung điểm, $D$, $E$ là chân đường vuông góc), đủ 8 điểm, tam giác không cân (không gợi sẵn đáp án ý d), không đánh dấu song song $DP$, $EQ$, nhãn không đè. Giữ nguyên, không vẽ lại.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | lập luận (câu chữ) | Phần 2: "đều là hiệu của hai hạng tử" → "đều có phép trừ nối các hạng tử với nhau" | $x^2-\dfrac{x+3}{5}$ không phải hiệu của hai hạng tử (số trừ là một đa thức) |
| Câu 8 | lập luận (câu chữ) | Phần 2, phương án B: viết lại thành "hình thang có một góc vuông là hình thang vuông; hình thang vuông có hai đáy khác nhau thì chỉ có hai góc vuông…" | Câu cũ "hình thang vuông chỉ có hai góc vuông" sai với trường hợp hình chữ nhật |
| Bài 1c | định dạng (câu chữ) | Phần 1 Bước 3: "ở tử … ở số chia" → "ở hạng tử bị chia … ở đơn thức chia" | Phép chia viết bằng dấu `:` không có "tử" |
| Bài 2 | lập luận (Phần 1) | Mấu chốt: "ba ý đều xoay quanh bình phương của một hiệu" → "ý a và ý b …; còn ý c …" | Ý c không liên quan hằng đẳng thức — câu cũ tự mâu thuẫn |
| Bài 4 | kiến thức (dòng `Chưa chắc`) | Xoá dòng `**Chưa chắc:**` | Đề có hỏi hình chữ nhật ⇒ trung tuyến ứng cạnh huyền được dùng; đã kiểm ý c, d không dùng đường trung bình |
| Bài 4 | lập luận | Ý d Phần 2: thêm chứng minh "$E$ là trung điểm của $AC$" (tam giác $MAC$ cân tại $M$, đường cao $ME$); đưa $DB=\dfrac{1}{2}AB$, $DM=AE=\dfrac{1}{2}AC$ ra trước, không để trong mệnh đề "Nếu $AB=AC$" | $E$ là trung điểm $AC$ được dùng mà chưa chứng minh; hai đẳng thức đó đúng với mọi tam giác và chiều ngược lại cũng cần chúng |
| Bài 4 | lập luận (Phần 1) | Mấu chốt viết lại (ba góc vuông ⇒ góc thứ tư vuông; $D$, $E$ là trung điểm nhờ tam giác cân, nói rõ chưa được dùng đường trung bình); Bước 6 bỏ đáp số "$AB=AC$" | Câu cũ "có ba góc vuông nên là hình chữ nhật" là dấu hiệu không có trong SGK và nói $D$, $E$ là trung điểm "từ hình chữ nhật" là sai nguồn; Phần 1 không lộ đáp số cuối |
| Bài 5 | lập luận (thiếu bước) | Phần 2: thêm dòng $=x^2+2(x^2-2xy+y^2)$ trước khi viết $2(x-y)^2$ | Bước đặt thừa số 2 rồi mới dùng hằng đẳng thức bị nhảy cóc |
| Ghi chú cuối tệp | — | Thêm một gạch đầu dòng về Bài 4 (được dùng trung tuyến ứng cạnh huyền, không dùng đường trung bình) | Thay cho dòng `Chưa chắc` đã xoá, để người duyệt vẫn biết |

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

## Ghi nhận (không sửa)

- Bài 2 Phần 1: đoạn `Chú ý` có "Thử lại ý a: với $x=0$ thì $A=…=4$" — là phép thử lại (brief cho phép), giữ.
- Bài 4c: có cách ngắn hơn (trung tuyến ứng cạnh huyền trong $\triangle BDM$, $\triangle CEM$ ⇒ $\widehat{DPM}=2\widehat{B}$, $\widehat{EQM}=2\widehat{C}$, tổng $180^\circ$, trong cùng phía) — cách của bản soạn đúng và trong whitelist nên không đổi.
- Hình giải: đoạn $BP$ vừa có 1 gạch (dấu $BM=MC$, đặt sát $B$) vừa có 2 gạch (dấu $BP=PM$) — đúng dữ kiện, hơi rối mắt, không sai.
