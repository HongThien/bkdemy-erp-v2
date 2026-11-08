# Biên bản SOÁT mù (02/11) — 6 câu Đường trung bình MỚI (HH00143) + VN5 Thales ý b) (HH00142)

Phạm vi: `draft_HH00143_N1.md` (TLt1–TLt3), `draft_HH00143_N2.md` (TLt4, VNt1, VNt2), `draft_HH00142_G3.md` khối VN5 (ý a, b).
Pha 1 (giải mù từ `de-moi.md`, chưa mở bản nháp): `soat_moi_pha1.mjs` — 910 PASS / 0 FAIL
(6 câu ĐTB: 5 tam giác ngẫu nhiên co về số đề cho; TLt4 dựng 40-50-30 bằng giao hai đường tròn; VN5: ~120 bộ tam giác + đường qua G ngẫu nhiên, B, C trên cạnh).
Chạy lại verify người soạn: `kiem_N1` 37/0 FAIL · `kiem_N2` 77/0 FAIL · `kiem_G3_vn5b` 242/0 FAIL.
Đo độ dài dòng hiển thị: `soat_dodai_moi.mjs`. Vẽ lại hình: `ve_N2_soat.mjs` (ghi đè `hinh_N2\TLt4.png`, `VNt2.png`).

Pha 1 VN5 b) (cách tự nghĩ): đặt $b=MB/MN$, $c=MC/MP$. Thalès trong $\triangle MNE$ ($BG\parallel NE$), $\triangle MPF$ ($CG\parallel PF$) ⇒ $ME=MG/b$, $MF=MG/c$.
$\triangle ANE=\triangle APF$ (g.c.g) ⇒ $A$ trung điểm $EF$, $E$, $F$ cùng nằm trên tia $MA$ (khác phía $M$ đối với $BC$) ⇒ $ME+MF=2MA$; $MG=\tfrac23MA$ ⇒ tổng $=3$.
**Thứ tự điểm:** $E$ nằm giữa $M$, $A$ ⇔ $b>\tfrac23$; $F$ nằm giữa ⇔ $c>\tfrac23$; vì $\tfrac1b+\tfrac1c=3$ nên đúng MỘT trong hai nằm trong đoạn $MA$ (máy: E trong 48 bộ, F trong 77 bộ), trừ ca $BC\parallel NP$ ($b=c=\tfrac23$, $E\equiv F\equiv A$).
⇒ Gợi ý trong `de-moi.md` ("E giữa M và A, F ngoài") chỉ là MỘT trường hợp; bản nháp đã xử lý đúng bằng "giả sử … trường hợp kia tương tự".

## Bảng từng câu
| nhãn | khớp Pha 1? | sửa gì |
|---|---|---|
| TLt1 | Khớp — $BC=14$ | **Phần 1 lộ phép tính đáp số**: Chú ý "$BC$ là $7\cdot2$ chứ không phải $7:2$" ⇒ "phải nhân đôi $MN$, không chia đôi". Hình đúng (gạch trung điểm là gt, $MN$ ghi 7 cm, $BC$ không số). |
| TLt2 | Khớp — $IK=7{,}5$ | Không sửa. Hình nghiêng đúng yêu cầu, $NP$ ghi 15 cm. |
| TLt3 | Khớp — $BC=72$ | Không sửa. Hình ao: $B$, $C$ trên bờ, $BC$ nét đứt xuyên ao, $A$ ngoài ao. |
| TLt4 | Khớp — $15+20+25=60$; không dùng Pythagore (chỉ đường trung bình) | **Đề**: câu không vị ngữ "Đường đi bao quanh mảnh đất nhỏ hình tam giác $MNP$." ⇒ trả về đúng đề CTO "Người ta làm đường đi bao quanh tam giác $MNP$.". **Trình bày**: Phần 1 dòng 109–161 ký tự ⇒ ngắt dòng (giữ nguyên chữ); Phần 2 tách 3 dòng "nên … (định nghĩa đường trung bình)." như N1. **Hình**: "40" đặt sát $AM$, "50" dưới $BN$, "30" cạnh $PC$ ⇒ đọc nhầm thành độ dài nửa đoạn ⇒ vẽ lại: số đo đặt trên cung đứt nét ôm CẢ cạnh (như TL2.2 Thales); không có ký hiệu góc vuông (đề không cho). |
| VNt1 | Khớp — $AB=4{,}8$ | **Trình bày**: ngắt dòng Phần 1 (105–123 ký tự), tách dòng "nên … (định nghĩa …)". Hình đúng (nghiêng, $AB$ không ngang, $x$ trên $AB$). |
| VNt2 | Khớp — $MN=2$, chu vi $BCNM=4+1{,}5+2+1{,}5=9$ | **Trình bày**: ngắt dòng Phần 1; 2 dòng "$MB=\dfrac12AB$…", "$NC=\dfrac12AC$…" thiếu chú thích kiến thức ⇒ thêm `(định nghĩa trung điểm)` và tách "Vì …(gt) / nên …". **Hình**: hai số "3" đặt sát nửa đoạn $AM$, $AN$ (đọc nhầm $AM=3$) ⇒ vẽ lại trên cung ôm cả $AB$, $AC$; $x$ đưa lên trên $MN$. |
| VN5 (a, b) | Khớp cả 2 ý, cùng cách (Thalès ×2 + g.c.g + trọng tâm); thứ tự $E$, $F$ xử lý đúng | **Toán/lý do**: Phần 1 "(đảo hai vế …)" sai tên phép biến đổi ⇒ "(nghịch đảo hai vế …)"; "(câu a)" ⇒ "(ý a)" (k8 §1.6) ở Phần 1 + Phần 2. **Thiếu ca suy biến** $BC\parallel NP$ ($\triangle ANE$, $\triangle APF$ không tồn tại) ⇒ thêm 1 dòng sau (3). **Chú thích**: thêm `(gt)` cho 2 dòng "$C$/$B$, $G$ thuộc đường thẳng $BC$", `(cmt)` cho "$E$, $F$ thuộc tia $MA$", "$MG=\tfrac23MA$ (cmt)" ở dòng kết; tách 2 dòng 62–65 ký tự. Hình đúng: chỉ gạch $NA=AP$ (gt), không đánh $AE=AF$; $MG/MA=2/3$ đo trên ảnh. |

**Tổng:** 7/7 câu khớp Pha 1. Sửa: toán 0 đáp số · đề 1 (TLt4) · lý do/chú thích 2 (VNt2, VN5) · lộ đáp số Phần 1 1 (TLt1) · hình 2 (TLt4, VNt2) · ngắt dòng 4 (TLt4, VNt1, VNt2, VN5).
Không câu nào dùng công cụ ngoài whitelist (ĐTB: chỉ định nghĩa + tính chất đường trung bình; VN5: Thalès, g.c.g, trọng tâm lớp 7, cùng/khác phía lớp 6).
Dòng trống: đề không có; lời giải câu TÍNH chỉ giữa các đoạn card Phần 1 (khuôn README §3) và trước `**Phần 2. Trình bày**`; VN5 chỉ trước `b) ` và Phần 2.

## Nghi vấn (không sửa, để CTO/Thùy quyết)
1. **N1 (TLt1–TLt3) không ghi $x$ lên đoạn cần tìm**, N2 (VNt1, VNt2) thì có `x` + đề "Tính $x=…$". BRIEF nói "đoạn cần tìm ghi `x`". Muốn thống nhất thì thêm $x$ vào hình N1 + đổi đề "Tính $x=BC$". Để nguyên vì hình hiện tại không sai, không lộ đáp số.
2. **VN5 sơ đồ** còn 3 dòng 68–71 ký tự (nhiều điều nối `·` trên 1 tầng — đúng khuôn §1.6); chưa tách.
3. **VN5 ý a)** "$G\in MF$ ($G$ thuộc trung tuyến $MA$, $F$ thuộc $MA$)" chỉ cho $G$ thuộc ĐƯỜNG THẲNG $MF$; Thalès cần $G$ trên cạnh $MF$ — điều này chỉ được chứng minh ở ý b). Ý a) đã qua soát 28/10 nên giữ; nếu muốn chặt thì thêm vào ý a) lý do "đường thẳng qua $C\in MP$ song song $PF$ cắt cạnh $MF$".
4. VN5 cách viết tắt "$E$, $F$ cùng phía với $N$, $P$" dựa trên khái niệm nửa mặt phẳng lớp 6 — trong whitelist, nhưng dài 8 dòng; bản nháp đã nêu có thể rút.
