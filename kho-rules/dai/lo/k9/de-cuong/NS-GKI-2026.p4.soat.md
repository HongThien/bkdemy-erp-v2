KẾT LUẬN: ĐẠT

# Biên bản soát — NS-GKI-2026 · Phần 4 (A. Đại số: Bài 7a–l, 8a, 9a–b, 10, 11)

- Trạm soát: Opus (giải mù trước, `NS-GKI-2026.p4.kiem.md`), soát bản soạn của Sonnet. Bản soạn gốc trước khi sửa: `NS-GKI-2026.p4.soan.goc.md`.
- Số câu: **17** (1 trả lời ngắn · 16 tự luận), tất cả `kho=dai`, không có hình.
- Khớp Pha 1 ngay từ đầu (đề + đáp số): **17 / 17**.
- Số câu phải sửa: **3** (đều là sửa nhẹ lời văn / thêm một dòng trung gian; không câu nào sai đáp số, sai chép đề hay sai luật kiến thức).
- Thử lại bằng máy (phân số chính xác, `<LV>/tam/soat_p4.mjs`): mỗi bất phương trình thử chính biên, hai phía biên và lưới $x=\dfrac{k}{360}$; Bài 9 quét lưới nghiệm chung; Bài 10 quét $m=\dfrac{k}{60}$ với $-100\le m\le100$ (chỉ $m=1$ và $m=\dfrac{23}{3}$ thoả; $m=\pm2$ hệ vô nghiệm); Bài 11 quét $m=\dfrac{k}{100}$. Tất cả khớp.
- Cổng `dung-de-tu-soan.mjs --khoi 9 --chi-kiem`: ✔ đạt cổng.

## Từng câu

| Câu | Đáp số bản soạn | Pha 1 | Chép đề (so ảnh, đã phóng to 260 dpi) | Lời giải + luật | Kết quả |
|---|---|---|---|---|---|
| Bài 7a | $x>9$ | khớp | đúng | đúng | đạt |
| Bài 7b | $x\le-\dfrac12$ | khớp | đúng | chia $-8<0$ có nói đổi chiều | đạt |
| Bài 7c | $x<\dfrac92$ | khớp | đúng | đúng | đạt |
| Bài 7d | $x\ge0$ | khớp | đúng | chia $-2<0$ có nói đổi chiều | đạt |
| Bài 7e | $x\le5$ | khớp | đúng (ảnh in nhãn "c)" lần hai — là ý e) | chia $-2<0$ có nói đổi chiều | đạt |
| Bài 7f | $x>1$ | khớp | đúng | đúng | đạt |
| Bài 7g | $x<-\dfrac34$ | khớp | đúng | đúng; sửa thuật ngữ ở Mấu chốt | đạt (đã sửa) |
| Bài 7h | $x<\dfrac{15}{16}$ | khớp | đúng: $\dfrac23(2x+3)<7-4x$ | nhân $3>0$, mỗi phép một dòng | đạt |
| Bài 7i | $x\le\dfrac95$ | khớp | đúng: $\dfrac12(x-3)\le3-2x$ | nhân $2>0$ | đạt |
| Bài 7j | $x>-\dfrac25$ | khớp | đúng: $\dfrac{8-3x}{2}-x<5$ | nhân $2>0$; chia $-5<0$ có nói đổi chiều | đạt |
| Bài 7k | $x>-\dfrac{60}{61}$ | khớp | đúng: $0{,}7x+\dfrac{6+4x}{3}>0$ | nhân $30>0$ | đạt |
| Bài 7l | $x>\dfrac{35}{18}$ | khớp | đúng: $0{,}7x+\dfrac{2x-4}{3}-\dfrac{x}{6}>1$ | nhân $30>0$ | đạt |
| Bài 8a | $1$ (`tra_loi_ngan`) | khớp | đúng; ý 8b đề in thiếu dấu và vế phải — không nhập là đúng | chia $-5<0$ có nói đổi chiều; sửa lời Bước 3 | đạt (đã sửa) |
| Bài 9a | $\dfrac45<x<\dfrac92$ | khớp | đúng | giải riêng từng bất phương trình rồi lấy phần chung | đạt |
| Bài 9b | $x>25$ | khớp | đúng: $\dfrac23x+5>9$ và $\dfrac{x-18}{7}>1$ | có giải thích "lớn hơn $25$ thì cũng lớn hơn $6$" | đạt |
| Bài 10 | $m=1$ hoặc $m=\dfrac{23}{3}$ | khớp | xác nhận cách sửa lỗi gõ "$mx+4)y=9$" thành $mx+4y=9$ | xét $m=\pm2$ trước (hệ vô nghiệm), phương pháp thế, phân tích nhân tử $(m-1)(3m-23)=0$, không $\Delta$, có đối chiếu $m\ne\pm2$; thêm một dòng trung gian | đạt (đã sửa) |
| Bài 11 | $m>-2$ | khớp | đúng ("$(1)$" là số thứ tự phương trình) | đúng | đạt |

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 7g | lập luận (thuật ngữ, Phần 1) | Mấu chốt: "hệ số $-3x$ … đổi thành hạng tử dương" → "hạng tử $-3x$ … khi chuyển sang vế trái thì đổi dấu thành $+3x$" | $-3x$ là hạng tử, không phải hệ số; câu cũ dùng lẫn hai từ |
| Bài 8a | kiến thức (lời văn, Phần 1) | Bước 3: bỏ "khoảng nghiệm", "thuộc khoảng đó" → "điều kiện của $x$ vừa tìm được", "các số nguyên thoả mãn nằm sát số biên" | Lớp 9 (KNTT) chưa học khái niệm khoảng; `dai/k9.md` §1 không dùng khoảng cho nghiệm bất phương trình |
| Bài 10 | định dạng (mỗi phép biến đổi một dòng) | Thêm dòng "Chuyển vế $8m$, ta được $-m^2y+4y=9-8m$." trước dòng $(4-m^2)y=9-8m$ | Dòng cũ gộp chuyển vế và đặt nhân tử chung trong một bước |

## Ghi nhận không sửa

- Bài 7k, 7l: Phần 1 nói "đổi số thập phân thành phân số" để chọn số nhân $30$; Phần 2 nhân thẳng $30\cdot0{,}7x$ — đúng toán, giữ.
- Bài 9a: dòng chia kèm rút gọn phân số ("$x>\dfrac{12}{15}$, tức là $x>\dfrac45$") — rút gọn phân số không phải phép biến đổi bất phương trình, giữ.
- Bài 10: `**Ghi chú:**` của người gõ đề giữ nguyên. Cách đọc khác của dòng in lỗi là $(mx+4)y=9$ cho hệ không bậc nhất và không liên quan mẫu $m^2-4$; đọc $mx+4y=9$ thì $m^2-4$ đúng là hệ số xuất hiện khi khử ẩn ⇒ cách xử lí của người gõ là đúng.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Việc chờ ngoài phần này: **Bài 8b** chưa nhập vì đề cương in thiếu dấu bất đẳng thức và vế phải (ghi ở `**Ghi chú:**` của Bài 8a) — cần bản đề đủ.
