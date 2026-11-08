KẾT LUẬN: ĐẠT

# TC-GKI-2026 — Phần 9 (Hình Bài 6, 7, 8, 9) — biên bản soát (Opus, 19/10)

- Số câu: **4** (4 tự luận, kho `hinh_hoc`, không tách ý).
- Khớp Pha 1 ngay từ đầu: **4/4** (cả bốn bài cùng hướng chứng minh với lượt giải mù `TC-GKI-2026.p9.kiem.md`; mọi khẳng định kiểm bằng toạ độ số ≥ 2 bộ).
- Đề chép đúng ảnh `t-4.png` / `t-5.png` (tên điểm, thứ tự trung điểm, "$K$ nằm giữa $D$ và $E$", "cắt cạnh", ý c Bài 8 ở đầu trang 5).
- Luật kiến thức: không đường trung bình / Thalès / đồng dạng / Pythagore / lượng giác, kể cả ngầm. Bài 9b dùng **trọng tâm** ($M$ trọng tâm $\triangle ACD$, $N$ trọng tâm $\triangle ABC$, tỉ số $\dfrac{2}{3}$ — lớp 7, hợp lệ); kiểm từng dòng: không có bước nào dựa vào "đoạn nối trung điểm song song / bằng nửa". Bài 6b dùng trung tuyến ứng cạnh huyền (Chương III, được dùng theo phụ lục). Bài 8b: $\triangle DME=\triangle BNF$ (g.c.g) — đồng vị đúng chiều (kiểm $\vec{EM}=\vec{NF}$ bằng số).
- Số câu phải sửa: **3** (Bài 6 hình · Bài 7 hình · Bài 9 định dạng/lời Phần 1). Không đổi đáp số / lập luận nào.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Hình Bài 6 | hình | Bỏ hai gạch đơn $AB=AC$ trong `giai_hinh6.png` (sửa `tam\ve_p9.mjs`, vẽ lại) | Gạch của $AC$ rơi trên đoạn $IC$ (đã có 3 gạch) ⇒ $IC$ trông 4 gạch, $AI$ 3 gạch ⇒ đọc thành $AI\ne IC$. Góc vuông tại $A$ vẫn giữ |
| Hình Bài 7 | hình | Dời nhãn $E$ sang phải điểm (`label(E,'E',24,8)`), vẽ lại | Nhãn cũ chạm đường $CE$ |
| Hình Bài 9 | định dạng (Chưa chắc) + lời Phần 1 | Dòng `Chưa chắc` viết lại đúng câu chuẩn của brief kèm ý ("ý b — dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết …"); Bước 2 bỏ câu "bài này tự chứng minh, không dùng đường trung bình", thay bằng mắt xích nghĩ thật ($\dfrac{1}{3}DB=\dfrac{2}{3}\cdot\dfrac{1}{2}DB$ gợi trọng tâm) | Brief: câu chuẩn, không giải thích dài; câu cũ là lời bình chứ không phải bước nghĩ |

Hình giải kiểm bằng mắt sau khi vẽ lại: `giai_hinh6..9.png` đúng dữ kiện (trung điểm, song song $AC$, vuông góc, $DK=BE$ với $K$ gần $D$), đủ điểm mọi ý, không đánh dấu điều phải chứng minh, nhãn không đè / không cụt.

Cổng: `dung-de-tu-soan.mjs … TC-GKI-2026.p9.soan.md --khoi 8 --chi-kiem` ⇒ **✔ đạt cổng** (4 câu tự luận, chưa chắc 1).

## Câu còn `Chưa chắc` (gửi CEO)

- **Hình Bài 9 (ý b, $DM=MN=NB$)** — dữ kiện đúng kiểu bài đường trung bình (cùng câu hỏi chờ CEO với 5 đề GKI Hà Nội / LTV / ĐTĐ). Toán học thì CHẮC: lời giải bằng trọng tâm lớp 7 đúng, trọn trong phạm vi, máy kiểm khớp. Cờ chỉ để CEO quyết có cho dùng đường trung bình ở đề cương Thành Công không (nếu cho thì vẫn có thể giữ lời giải trọng tâm).
