KẾT LUẬN: ĐẠT

# Biên bản soát gói 8 — Nâng cao ƯCLN–BCNN (lý thuyết cấp dạng)

- Trạm soát: Opus, 14/10. Bản gốc trạm soạn: `out-8.goc.json`.
- Đã soát **4/4 dạng**: NDB00415, NDB00416, NDB00417, NDB00418.
- Cổng `kiem-goi.mjs`: ✔ đạt cổng (lý thuyết dạng 4 · ghi chú 6).

## Kiểm bằng máy (vét cạn, `node`)

| Khẳng định | Phạm vi vét | Kết quả |
|---|---|---|
| 415: mọi cặp $a<b$ có ƯCLN $=d$, BCNN $=M$ đúng bằng các cặp $(d.m;d.n)$ với $m.n=M:d$, $m$, $n$ nguyên tố cùng nhau | $d\le30$, $M\le600$ | khớp 100% |
| 415: số cặp $=2^{s-1}$ ($s$ = số thừa số nguyên tố khác nhau của $M:d>1$) | như trên | khớp 100% |
| 415: $M$ không chia hết cho $d$ ⇒ không có nghiệm | $d\le12$, $M\le200$ | đúng |
| 416: nghiệm = các $m<T:2$ có $\text{ƯCLN}(m,T)=1$, $T=S:d$ (và $S\not\vdots d$ ⇒ vô nghiệm) | $d\le12$, $S\le300$ | khớp 100% |
| 416: $T$ nguyên tố lẻ ⇒ mọi $m\le(T-1):2$ đều nguyên tố cùng nhau với $T-m$; $T=15$ loại $m=3;5;6$ | — | đúng |
| 417: liệt kê từng $k\in\text{ƯC}(M,h)$, chọn cặp tích $M:k$, hiệu $h:k$, nguyên tố cùng nhau ⇒ đúng tập nghiệm | $M\le400$, $h\le200$ | khớp 100% |
| 418: $\text{ƯC}(M,h)=\{1\}$ ⇒ cặp tích $M$ hiệu $h$ tự nguyên tố cùng nhau | như trên | đúng |
| Ví dụ trong `##CY`: $M=8,h=2$ (cặp $(4;2)$ bị loại, cả bài vô nghiệm); $M=60,h=5$ ($k=5$, nghiệm $(20;15)$); $M=15,h=14$ ⇒ $(15;1)$; $d=4$, $M=120$ có $(4;120)$ ⇒ loại vì 1 chữ số | — | đúng |
| 4 ví dụ hiện có của 417/418 (12,2 · 90,35 · 15,2 · 60,7) | — | đáp số đúng |

Phát hiện phụ (xác nhận ghi chú trạm soạn): trong toàn vùng vét, **mọi nghiệm đều có $k=\text{ƯCLN}(M,h)$**, không có bài nào hai giá trị $k$ cùng cho nghiệm.

## Bảng sửa

| NDB | loại lỗi | sửa gì | vì sao |
|---|---|---|---|
| NDB00415 | kiến thức | thêm lí do của "đúng $2^{s-1}$ cặp": mỗi luỹ thừa có 2 cách đặt ⇒ $2^s$ cách, đổi chỗ $m$, $n$ trùng ⇒ chia đôi | kết quả đếm không có trong whitelist K6 ⇒ phải tự lập luận, không viện như đã biết (k6.md §1 luật 2) |
| NDB00416 | thiếu điều kiện | `##PP` bước liệt kê thêm "riêng $S:d=2$ chỉ có $m=n=1$, $a=b=d$, chỉ nhận khi đề không đòi $a<b$" | PP chỉ liệt kê $m<n$ rồi "đổi chỗ"; với $S=2d$ và đề không thứ tự sẽ sót nghiệm $a=b=d$ |
| NDB00418 | không khớp ví dụ | `##PP` bước chọn cặp thêm "(cặp này tự nguyên tố cùng nhau, theo lí do ở trên)" | ví dụ có ghi "(hai số nguyên tố cùng nhau)" ở bước chọn cặp; PP nối với `##TC` "Không cần kiểm tra thêm" cho khớp |
| NDB00417 | — | không sửa | toán đúng, PP khớp 2 ví dụ (liệt kê từng $k$, kể cả $k=1$) |

Đã kiểm thêm, không có lỗi: định dạng (dấu nhân `.`, `\text{ƯC}`/`\text{ƯCLN}`/`\text{BCNN}`, không `##VD`, `##PP` mỗi dòng một bước, không gõ "Bước"); không chuyển vế / không dùng ƯCLN.BCNN$=a.b$; không chép nguyên lý thuyết nhóm (dạng thêm dấu hiệu, mẹo liệt kê, bẫy phân biệt BCNN / tổng / tích).

## Điểm còn nghi — gửi CEO

1. **NDB00417 vs NDB00418 (nhóm NNB00929):** về toán, $k$ cho nghiệm luôn là $\text{ƯCLN}(M,h)$ — "có 2 giá trị" chỉ là $\text{ƯC}(M,h)$ có 2 phần tử, giá trị nhỏ luôn bị loại. Hai dạng chỉ khác độ dài lời giải. CEO quyết: giữ 2 dạng như hiện tại / đổi tên / đưa lối tắt $k=\text{ƯCLN}(M,h)$ vào lý thuyết (lối tắt cần tự lập luận, ngoài whitelist).
2. **NDB00418 `cum_cu`** trùng cụm của 417 (`DCUM01490 … có 2 giá trị`) — có vẻ chép nhầm.
3. Lỗi chính tả "biết biết UCLN và tổng" ở tên NNB00928 / NDB00416.
