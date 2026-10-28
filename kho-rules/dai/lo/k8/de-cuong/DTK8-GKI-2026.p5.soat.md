KẾT LUẬN: ĐẠT

# DTK8-GKI-2026 — P5 (Bài 17–21, Hình) — biên bản soát (trạm Opus, 24/10)

- Số câu: **5** (5 tự luận, kho `hinh_hoc`, không tách ý) · khớp Pha 1 ngay từ đầu: **5/5** (17c cân tại $A$ · 18 · 19c vuông cân tại $A$ · 20a hình chữ nhật, 20c $DE=DF$ trái giả thiết · 21) · số câu phải sửa: **4** (17, 18, 20, 21) — không đổi đáp số / kết luận nào.
- Đề chép đúng ảnh (đối chiếu `t-4.png` + phóng to 260 dpi `z/soat_p5_a-4.png`, `soat_p5_b-4.png`).
- Kiến thức: không đường trung bình (18c đi qua chiều đảo trung tuyến ứng cạnh huyền thay cho "$HM\parallel KC$"; 19 không dùng $MI=\tfrac12AB$; 20b qua hình bình hành $DHMF$), không Thalès / đồng dạng / Pythagore, kể cả ngầm. Trọng tâm lớp 7 ($AG=2GM$) và trung tuyến ứng cạnh huyền (cả chiều đảo, 18c, 21c) đúng phạm vi. "Ba góc vuông" (20a, 21a) đi qua tổng góc $360^\circ$ — đúng luật.
- Toạ độ số: `<LV>\tam\soat_p5_kiem.mjs` (Pha 1, 2–5 bộ số mỗi bài) — mọi khẳng định của bản soạn OK; thêm: $EF=AB$ ở 17 luôn đúng; 21c đúng cả ca $N\equiv E$ ($D$ đối xứng $A$ qua $M$).
- Cổng: `✔ đạt cổng` (5 câu · 0 chưa chắc).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 17 | hình | Vẽ lại `giai_bai17.png`: bỏ cặp dấu × đánh "$AG=GF$" | Dấu trên $GF$ đặt ở $t=0{,}78$ rơi vào đoạn $MF$ ⇒ hình đọc thành $AG=MF$ (sai, $AG=2MF$) và cùng lúc gợi điều phải chứng minh $MG=MF$. $M$ là trung điểm $GF$ nên không đặt được gạch giữa $GF$ ⇒ bỏ cặp dấu |
| Bài 18 | hình | Vẽ lại `giai_bai18.png`: nhãn $M$ dời xuống dưới điểm | Bản gốc nhãn $M$ bị đường $BE$ và nét đứt $MK$ cắt ngang |
| Bài 20 | định dạng (Phần 1 lộ đáp số) | `**Chú ý:**` "điều kiện tìm được ở ý c không thể xảy ra cùng giả thiết $DE>DF$" → "đối chiếu điều kiện tìm được với giả thiết $DE>DF$ (xem Lưu ý đầu Phần 2)"; thêm dòng kết cuối ý c: với $DE>DF$ thì điều kiện không xảy ra, $DKMN$ không thể là hình vuông | Câu cũ ngầm lộ đáp số ($DE=DF$) ngay ở Phần 1; Phần 2 cần kết luận cả theo giả thiết của đề (luật "đề sai: giải bình thường") |
| Bài 21 | lập luận + hình | (1) Phần 2 ý c: thêm một dòng chứng minh $N\ne F$ (nếu $N\equiv F$ thì $MF\perp EF$, cùng $AD\perp EF$ ⇒ $MF\equiv AD$ ⇒ $F\in AD$, vô lí); dời "$\triangle ENF$ vuông tại $N$" vào nhánh "$N$ khác $E$" (khi $N\equiv E$ không có góc $ENF$). (2) `**Chú ý:**` Phần 1 bỏ câu "không cần xét riêng" (mâu thuẫn Phần 2 có xét riêng), nêu rõ ca $N\equiv E$ xảy ra khi nào. (3) Vẽ lại `giai_bai21.png`: bỏ cặp gạch "$AB=AC$", nhãn $M$ dời lên trên, nhãn $O$ sang trái | (1) Bản cũ khẳng định "$N$ khác $F$" không lí do, và viết $\widehat{ENF}=90^\circ$ trước khi tách ca $N\equiv E$. (3) Hai gạch đặt ở $0{,}3$ cạnh $AB$, $AC$ nằm trên đoạn $AE$, $AF$ ⇒ đọc thành $AE=AF$ — điều phải chứng minh ở ý a; nhãn $M$ bị $MF$, $CB$ cắt, nhãn $O$ chạm $EF$ |

Bản gốc: `DTK8-GKI-2026.p5.soan.goc.md`; ảnh gốc: `<LV>\tam\soat_p5_giai_bai{17,18,21}_truoc.png`; script vẽ lại: `<LV>\tam\ve_soat_p5.mjs` (`ve_p5.mjs` giữ nguyên). Hình 19, 20 mở kiểm: đủ điểm, đúng tên, không đánh dấu điều phải chứng minh, nhãn không đè — giữ.

## Đề sai / Chưa chắc

- **Bài 20 — "Đề sai" (giữ, đúng luật 24/10):** $DKMN$ là hình vuông ⇔ $DN=DK$ ⇔ $DE=DF$ (máy: $e=f$ thì $MN=MK$, $e\ne f$ thì không), trái giả thiết $DE>DF$ ⇒ với đề đã cho không có tam giác nào thoả ý c. Nhận định của trạm soạn đúng; cách xử lý hợp luật mục 2 phụ lục 24/10: giải bình thường (tìm điều kiện $DE=DF$, kết luận thêm "với $DE>DF$ thì không xảy ra"), `**Ghi chú:** Đề sai: …` + một dòng `Lưu ý:` đầu Phần 2, không có dòng `Chưa chắc`.
- Chưa chắc: **0**.
- Ngoài lề (không sửa): 21b — khi $D$ đối xứng $A$ qua $M$ thì $EF$ trùng $BC$ (không còn "song song" theo nghĩa hẹp); 18 hình vẽ $BE$ thành một đoạn thẳng qua $I$ (đúng, $I$ là trung điểm $BE$).
