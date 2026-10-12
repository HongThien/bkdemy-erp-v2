KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 11 (Bài 23–27, số chính phương nâng cao) — trạm soát Opus, 12/10

- Số câu: **5** (0 TLN · 5 tự luận).
- Khớp Pha 1 (giải mù, `NSHM-GKI-2026.p11.kiem.md`) ngay từ đầu: **5/5** — Bài 23 $n\in\{2011;2017\}$ · Bài 24 $n\in\{-3;2\}$ · Bài 25 $k\in\{1;3\}$ · Bài 26 $(1;1)$ · Bài 27 không tồn tại.
- Đề chép đúng ảnh: 5/5 (phóng to ×6 số mũ Bài 23: $2^{2008},\ 2^{2012},\ 2^{2013},\ 2^{2014}$).
- Phân loại: 5/5 đúng (`tu_luan`, `dap_an=—`). Kiến thức: không dùng gì ngoài phạm vi (hằng đẳng thức, hiệu hai bình phương, số dư, kẹp giữa hai bình phương liên tiếp).
- Câu phải sửa: **2** (Bài 23, Bài 27) — đều sửa nhỏ, không đổi đáp số. Bản gốc: `NSHM-GKI-2026.p11.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 23 | lập luận | Phần 2 thêm lí do cho hai khẳng định số dư: bảng bình phương các số dư mod 7; "$2^3=8$ chia 7 dư 1" | Khẳng định nêu không lí do; Bài 26, 27 đều chứng minh số dư của số chính phương nên giữ cùng mức |
| Bài 23 | định dạng (Chưa chắc) | Viết lại câu giải thích chỗ hở: "Ramanujan–Nagell tổng quát $x^2+D=2^m$, ở đây $D=-113$"; bỏ cụm mơ hồ "lớp $m\equiv3$ và $m\equiv9$" (không nêu mođun); thêm dòng xác nhận của trạm soát | Bản cũ ghi dạng $x^2+D=2^m$ mà không nói $D$ âm, và nói lớp đồng dư không có mođun — nội dung đúng nhưng câu chữ sai lệch |
| Bài 27 | lập luận (Phần 1) | Bước 4: "để chỉ ra mâu thuẫn ở cả hai trường hợp" ⇒ chỉ trường hợp $p$ lẻ | Trường hợp $p$ chẵn mâu thuẫn ở Bước 2 (tính chẵn lẻ), không qua phép nhân ba số dư — bước nghĩ cũ không khớp Phần 2 |

## Kiểm riêng Bài 23 (theo yêu cầu)

- Phần "đã chứng minh được" **đúng thật**: tổng $=2^{2008}(113+2^m)$ ✓; tương đương "tổng chính phương ⇔ $113+2^m$ chính phương" ✓ (chiều thuận qua $2^{1004}\mid s$); $m$ chẵn vô nghiệm qua $(s-2^k)(s+2^k)=113$ nguyên tố ✓; mod 7: $1+2^m$ dư 3, 5 khi $m\equiv1,2\pmod3$ (không là số dư chính phương), nên $m\equiv0\pmod3$ ✓; $m=1,5,7,11$ loại đúng số (115, 145, 241, 2161 kẹp đúng); $m=3,\ 9$ thoả ✓.
- Dòng `Chưa chắc` **nói thật chỗ hở**: còn thiếu chứng minh không có $m\ge15$, $m\equiv3\pmod6$. Hai nghiệm $m=3$ ($11+2\sqrt2$) và $m=9$ ($25+16\sqrt2=(11-2\sqrt2)(3+2\sqrt2)$) thuộc hai họ nghiệm khác nhau của $s^2-2t^2=113$ — loại hết phần còn lại cần số học vành $\mathbb{Z}[\sqrt2]$/p-adic, ngoài lớp 8. Không ai bịa chứng minh đủ. Máy: soạn vét $m\le30000$, soát vét độc lập $m\le3000$ + kiểm thẳng tổng gốc $n\le2100$ — chỉ $n=2011,\ 2017$.
- Gợi ý "đề kinh điển $2^{2008}+2^{2011}+2^n$ ⇒ $n=2012$" kiểm đúng ($(s-3)(s+3)=2^m$). Ghi nhận thêm: nếu số mũ thứ ba là $2^{2015}$ thì máy cho duy nhất $n=2012$ — nhưng ảnh đọc rõ $2013$, không coi là lỗi in.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 23** — lời giải chưa trọn vẹn: chứng minh được $m$ chẵn vô nghiệm, $m$ lẻ chia hết cho 3, tìm được $n=2011,\ 2017$ (vét máy tới $n\le32008$ không có nghiệm khác), nhưng không có chứng minh sơ cấp lớp 8 loại hết $m=15,21,27,\dots$. CEO quyết: giữ bài với lời giải nói rõ chỗ hở / thay đề kinh điển / bỏ.
