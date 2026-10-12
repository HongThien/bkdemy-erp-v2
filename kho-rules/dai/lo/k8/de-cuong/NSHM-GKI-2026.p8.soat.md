KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 · P8 (Bài 13, 14, 15 — Hình học) · trạm soát Opus · 12/10

- **Số câu:** 3 (3 tự luận, 0 trả lời ngắn — đúng phân loại: cả ba là bài chứng minh / tìm điều kiện).
- **Khớp lượt giải mù (Pha 1, `p8.kiem.md`) ngay từ đầu:** 3/3. Bài 14c cùng đáp: $\triangle ABC$ vuông cân tại $A$ ($AB=AC$); bản soạn chứng minh đủ cả chiều cần (chỉ ra $\triangle MFE$ không thể vuông tại $M$ hay $E$, góc vuông ở $F$ ⇒ $AMHN$ là hình vuông ⇒ $\widehat B=45^\circ$) lẫn chiều đủ ($AB=AC$ ⇒ $AMHN$ vuông ⇒ $\widehat{MFE}=90^\circ$, $\widehat{FME}=\widehat{MEF}=45^\circ$). Bài 13c, 15c bản soạn đi đường khác lượt mù nhưng đúng (13c qua $\triangle KBC=\triangle CHK$ và góc cùng phụ; 15c qua $HK\parallel AD$, $OE\parallel AD$ — trùng hướng lượt mù).
- **Đề:** cả ba chép đúng ảnh (đã phóng to trang 3–4). 13c "đường thẳng $AB$" đúng ảnh.
- **Luật kiến thức:** không có Pythagore, đồng dạng, Thalès. Hai chỗ đúng là đường trung bình (14b $OI=\dfrac12AN$; 15c $OE\parallel AD$ với $O$, $E$ là trung điểm $AF$, $FD$) đều đã **tự chứng minh bằng hình bình hành**, không dùng ngầm. Điểm phụ $T$ (14b): $ONTH$, $MOTH$ là hình bình hành ⇒ $OT=MH$; kiểm lại chiều véc-tơ đúng. 15c: $MOFE$ hình bình hành (hai cặp cạnh đối song song) ⇒ $ME=OF=AO$ ⇒ $AOEM$ hình bình hành — đúng. "Ba góc vuông" ở 14a, 15c đều đi qua tổng góc $360^\circ$ rồi bốn góc vuông. 15b dùng chiều đảo "trung tuyến bằng nửa cạnh ⇒ tam giác vuông" (C3 B4, được dùng).
- **Kiểm máy:** `<LV>\tam\soat_mu_p8.mjs` (Bài 13: 3 bộ; Bài 14: 4 bộ gồm $AB>AC$, $AB=AC$, $AB<AC$; Bài 15: 3 bộ) — mọi khẳng định đúng; 14c: $FM=FE$ ở mọi bộ, $\widehat F=90^\circ$ chỉ khi $AB=AC$.
- **Số câu phải sửa:** 1 câu sửa lời (Bài 13) + 2 hình giải sửa/bổ sung (Bài 14, 15) + 1 dòng Chưa chắc rút gọn (Bài 15). Không câu nào sai đáp số / sai luật kiến thức.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 13 | lập luận | c): lí do "tia $BC$ nằm giữa hai tia $BM$, $BK$" đổi từ "tia $BM$ nằm trong góc $ABD$ và $C$ nằm giữa $D$ và $K$" thành "$M$, $K$ nằm khác phía đối với đường thẳng $BC$ và cùng phía với $C$ đối với đường thẳng $AB$" | Lí do cũ không dẫn tới kết luận (tia $BM$ trong góc $ABD$ không nói gì về vị trí tia $BC$) |
| Bài 14 | hình | Nhãn $I$ dời xuống dưới $HN$ (trước đè lên đường $MP$; lần dời thứ nhất lên trên lại chạm $CH$ — đã phóng to kiểm); thêm điểm phụ $T$ và đoạn $OT$ của lời giải ý b ($T$ rơi đúng trung điểm $PH$) | Nhãn đè đường; lời giải dùng $T$ mà hình không có |
| Bài 15 | hình | Thêm tâm $O$ của hình chữ nhật $AHFK$ và đường chéo $HK$ (không kéo tới $E$, không đánh dấu điều phải chứng minh) | Lời giải ý c dựa vào $O$ ($OA=OH$, $OE\parallel AD$) mà hình không có |
| Bài 15 | ghi chú | Bỏ nửa sau dòng `Chưa chắc` ("vị trí $H$ giữa $A$, $B$; $K$, $D$ khác phía $AB$ đọc từ hình, không chứng minh chặt"); giữ nửa về đường trung bình. Cập nhật mục GHI CHÚ cho khớp | Đã kiểm chắc: $AF\parallel BC$ theo hướng từ $C$ về $B$ nên $F$ khác phía $C$ đối với $AB$ (⇒ $K$ trên tia đối $AC$, khác phía $D$); $AF=2ME<2MB=BC$ nên hình chiếu $H$ của $F$ nằm giữa $A$ và $B$ — luôn đúng khi $AB>AC$; mức chặt về thứ tự điểm này là mức thường gặp ở lớp 8, không phải chỗ CEO cần quyết |

Bản gốc trước sửa: `NSHM-GKI-2026.p8.soan.goc.md` · script vẽ gốc: `<LV>\tam\ve_p8.mjs.goc`. Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| Bài 14 | Ý b: $OI=\dfrac{1}{2}AN$ với $O$, $I$ là trung điểm hai cạnh $MN$, $HN$ của $\triangle MNH$ — dữ kiện đúng kiểu bài đường trung bình; lời giải tự chứng minh bằng hai hình bình hành. CEO quyết có cho dùng đường trung bình ở đề cương này không |
| Bài 15 | Ý c: $OE\parallel AD$ với $O$, $E$ là trung điểm $AF$, $FD$ của $\triangle AFD$ — cùng loại trên; lời giải tự chứng minh bằng hình bình hành |
