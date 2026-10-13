KẾT LUẬN: ĐẠT

# LTV-GKI-2026 — Phần 6 (Bài 28, 29, 30) — biên bản soát

- Số câu: **3** (3 tự luận, kho `hinh_hoc`, đều có hình giải).
- Khớp Pha 1 ngay từ đầu: **3/3** (cả ba bài cùng hướng chứng minh với lượt giải mù `….p6.kiem.md`; đề chép đúng ảnh `trang/p-6.png`).
- Câu phải sửa: **3** (Bài 29 sửa lập luận; Bài 28, 29 gỡ cờ `Chưa chắc`; Bài 30 bổ sung kí hiệu trên hình). Bản gốc: `LTV-GKI-2026.p6.soan.goc.md`.
- Luật kiến thức: soát từng dòng — không đường trung bình (kể cả ngầm), không Pythagore, không đồng dạng, không hình thoi / hình vuông. "Ba góc vuông" đều đi qua tổng góc tứ giác $=360^\circ$ ⇒ bốn góc vuông.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 29 | lập luận / kiến thức | Viết lại đoạn chứng minh "$A$ nằm giữa $Q$ và $P$" (Phần 2) và Bước 5 (Phần 1): gọi $E$ trung điểm $BC$, $\widehat{EAC}=\widehat{C}<45^\circ$ ($AB<AC$) ⇒ $\widehat{MAC}<45^\circ$ ($BM>MC$) ⇒ $\widehat{MAN}>45^\circ$ ⇒ $\widehat{MAP}=2\widehat{MAN}>90^\circ$ ($\triangle AMP$ cân tại $A$) ⇒ $Q$ không thể thuộc tia $AP$ (tổng hai góc của $\triangle AQM$ vượt $180^\circ$) | Bản soạn dùng điểm $E$ **chưa được đặt tên** trong bài này và trích "$EA=EB$ (câu b)" — là câu b của Bài 28, không phải Bài 29; ngoài ra dựa hai lần vào "đường xiên lớn hơn thì hình chiếu lớn hơn" (không chắc có trong KNTT 7 — KNTT chỉ có đường vuông góc ngắn hơn đường xiên). Bản mới chỉ dùng tam giác cân, tổng ba góc, quan hệ góc – cạnh đối diện, trung tuyến ứng cạnh huyền; ngắn hơn (5 dòng thay 9) |
| Bài 29 | ghi chú | Gỡ 2 dòng `Chưa chắc` (đường trung bình ý c; "có giữ đoạn chứng minh vị trí $Q$ không") | (1) $O$ trung điểm $QM$ đi bằng $NQ=NM$ (trung tuyến ứng cạnh huyền — kiến thức chính của bài Hình chữ nhật, mà ý sau CŨNG cần $NQ=NP$) + đường cao tam giác cân: đây là cách giải tự nhiên, không phải đi vòng tránh đường trung bình ⇒ quyết định của CEO về đường trung bình không đổi lời giải này. (2) Quyết GIỮ đoạn vị trí: kiểm toạ độ 30 cấu hình — trong điều kiện đề luôn $\widehat{AQN}=\widehat{ADN}$; bỏ điều kiện ($AB>AC$ với $M$ gần trung điểm, hoặc $BM<MC$) thì hai góc **bù nhau**. Không có đoạn này thì lời giải không dùng tới hai điều kiện của đề và sai ở cấu hình khác — giữ, dạng gọn |
| Bài 28 | ghi chú | Gỡ dòng `Chưa chắc` "đường trung bình" ở ý b | Lời giải ý b đi bằng $EA=EB$ (trung tuyến ứng cạnh huyền) + đường cao tam giác cân $EAB$ là trung tuyến — không cần và không ngầm dùng đường trung bình; đây là cách giải chuẩn của bài Hình chữ nhật. Ý c cũng không cần ý b ($DF=DE=AH$ từ hình chữ nhật) |
| Bài 30 | hình | Thêm kí hiệu $CO=OD$ (4 gạch) vào `giai_bai30.png` (sửa `tam/ve_p6.mjs`, vẽ lại) | Brief: đánh dấu giả thiết — "$O$ là trung điểm $CD$" là dữ kiện của ý c |

Hình giải đã mở từng tệp: `giai_bai28.png` ($AB>AC$, đủ $A,B,C,E,D,H,F,O$, gạch $BE=EC$, $ED=DF$, ba góc vuông cho trước, không đánh dấu $D$ trung điểm $AB$) · `giai_bai29.png` ($AB<AC$, $BM=0{,}6\,BC$, $A$ nằm giữa $Q$ và $P$ đúng như lời giải, gạch $PN=NM$, góc vuông tại $A$, $N$, $D$, $Q$) · `giai_bai30.png` (sau khi sửa). Nhãn không đè, không cụt.

**Câu còn `Chưa chắc`:** không có.
