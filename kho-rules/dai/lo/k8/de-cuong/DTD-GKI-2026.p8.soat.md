KẾT LUẬN: ĐẠT

# DTD-GKI-2026 — Phần 8 (B. Hình học, Bài 44–48) — biên bản soát

- Số câu: **5** (1 trả lời ngắn: Bài 47 · 4 tự luận).
- Khớp lượt giải mù (Pha 1, `DTD-GKI-2026.p8.kiem.md`) ngay từ đầu: **5/5** — 44b chân phân giác góc $A$ · 45 a) HCN b) HBH c) thoi · 46 ba ý · 47 $30^\circ$ · 48 6 con bù nhìn, 420 kg.
- Số câu phải sửa: **1** (Bài 45). Bản gốc trước khi sửa: `DTD-GKI-2026.p8.soan.goc.md`.
- Đề: đối chiếu `<LV>\trang\p-6.png` + lớp chữ `pdftotext` trang 6 — 5/5 chép đúng (Bài 48 ảnh in "đuôi chim", bản gõ sửa thành "đuổi" — lỗi chính tả hiển nhiên, không đổi nghĩa).
- Kiến thức: đọc từng dòng Phần 1 + Phần 2. Không dùng (kể cả ngầm) đường trung bình / Thalès / đồng dạng / Pythagore / lượng giác. Bài 47 đi đúng đường trung tuyến ứng cạnh huyền ⇒ $\triangle ABM$ đều. Bài 46 dùng hình vuông (trong phạm vi DTD: Chương III trọn). Bài 48 tính chu vi / diện tích, không Pythagore.
- Hình giải: mở cả 4 tệp (`giai_bai44..47.png`) — đúng dữ kiện (44: $ME\parallel AB$, $MF\parallel AC$, $M$ tuỳ ý; 45: $EI\parallel BF$, $I$ trên đường $GF$ với $FI=GF$; 46: tỉ lệ $AB=2BC$, đủ $S,\ R$; 47: $AC:AB\approx\sqrt{3}$, điểm phụ $M$), chỉ đánh dấu giả thiết, nhãn không đè. Không sửa.
- Toạ độ số: `<LV>\tam\soat_p8.mjs` (mọi khẳng định OK).
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: **✔ đạt cổng**.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 45 | ghi chú (cờ thừa) | Xoá dòng `**Chưa chắc:** ý a: dữ kiện đúng là bài đường trung bình…`; sửa mục GHI CHÚ CHO NGƯỜI DUYỆT tương ứng | Lời giải ý a đi bằng trung tuyến ứng cạnh huyền ($GA=GB=GC$) ⇒ $\triangle GAB$, $\triangle GAC$ cân ⇒ trung tuyến $GE$, $GF$ là đường cao ⇒ ba góc vuông + tổng góc $360^\circ$. Không phải "tự chứng minh đường trung bình", không ngầm dùng nó; ý b, c chỉ dùng HCN/HBH. Không còn gì để CEO quyết |
| Bài 45 | lập luận | Phần 2 b): "nên $AB\parallel GF$" → "nên $AE\parallel GF$, mà $E\in AB$ nên $AB\parallel GF$" | HCN $AEGF$ cho cạnh đối $AE\parallel GF$; thiếu một nhịp từ $AE$ sang đường thẳng $AB$ |
| Bài 45 | lời Phần 1 | Câu **Chú ý** viết lại: bỏ "ý c cũng không chứng minh $F$ là trung điểm của $GI$…" | Câu đó nói về cách lời giải KHÔNG làm, không phải bẫy cho học sinh; giữ ý chính "không viết $GE$, $GF$ là đường trung bình" |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 48** — số liệu đề tự mâu thuẫn: hình thang cân đáy $26$, $34$, cao $20$ thì cạnh bên là cạnh huyền của tam giác vuông có hai cạnh góc vuông $4$ và $20$ ⇒ cạnh bên $<24$ (bất đẳng thức tam giác; thật ra $\approx 20{,}4$), không thể bằng $30$ = nửa tổng hai đáy. (Nếu giữ cạnh bên $30$, cao $20$ thì đáy lớn phải $\approx 70{,}7$.) Lời giải làm theo ý người ra đề: chu vi $120$ m ⇒ 6 con bù nhìn; diện tích $600\ \text{m}^2$ ⇒ 420 kg thóc. Trạm soát kiểm lại bằng máy, giữ cờ của trạm soạn.
