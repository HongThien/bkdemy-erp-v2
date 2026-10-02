# THỬ THÁCH = ĐẤU TRƯỜNG 3 TRẬN (Thùy chốt 02/10/2026)

> Thay luật A2 cũ của `spec-thanh-tuu-nhiem-vu.md` (1 lượt 10 câu, pass ≥80%, lượt vô hạn). Làm trong luồng App HS V1.0 (`spec-v1-app-hs.md` §4 "Thử thách = Đấu trường").
> Trạng thái: **ĐÃ CHỐT LUẬT · CHƯA CODE.** Phần DB giao luồng Số liệu (§7), phần màn + hoạt cảnh thuộc luồng Giao diện.

## 1. Luật chơi

1. Em chọn **môn** → vào Đấu trường → đánh **3 trận liên tiếp**. **Thắng cả 3 = VƯỢT Thử thách.**
2. Mỗi trận **5 câu trắc nghiệm** (chỉ MCQ — luật MCQ tuyệt đối của `spec-mcq-form.md`, chọn câu qua `_kho_dk_mcq_sql`). Làm đủ 5 câu rồi mới tính thắng thua (không kết thúc sớm).
3. **Ngưỡng thắng:** trận 1 ≥ 60% (3/5) · trận 2 ≥ 80% (4/5) · trận 3 = 100% (5/5).
4. **Thua trận nào là DỪNG luôn** (boss thắng, kết thúc lượt). Muốn thử lại thì bắt đầu lại từ trận 1 bằng bộ câu mới.
5. **Giới hạn: 2 lượt Thử thách / ngày** (ngày giờ VN, tính theo MÔN hay chung — xem §8 câu mở). Lượt tính từ lúc BẮT ĐẦU (kể cả bỏ cuộc/hết giờ). Hết lượt: nút xám "Mai làm tiếp".
6. **Nút "Bỏ cuộc"** có trên mọi màn câu hỏi ⇒ tính thua, boss thắng, lượt vẫn bị trừ. Thoát app giữa chừng ⇒ lượt lưu ở DB, mở lại tiếp tục đúng trận/đúng câu; **quá 30 phút không làm ⇒ server tự tính thua** (đề xuất, chờ Thùy xác nhận số).
7. Mọi câu đã làm (thắng hay thua) vẫn tính mastery + Điểm Dạng như tự luyện thường. "Lượt học thật" (≥5/10 câu · TB ≥6 giây/câu) áp như cũ cho chuỗi/nhiệm vụ.

## 2. Chọn câu (15 câu / lượt, server chọn một lần)

- **Nguồn dạng:** chỉ dạng em **đã học = có ≥3 lần đo** (độ tin đủ). Ít hơn **N dạng (đề xuất N = 5)** ⇒ khoá Thử thách, báo "cần học thêm".
- **Mỗi trận 5 câu theo tỉ lệ 40–40–20 = 2 thấp · 2 vừa · 1 cao.** Độ khó của câu **= độ khó của DẠNG** chứa câu (mức độ dạng). Sau này mỗi câu có độ khó riêng thì đổi nguồn, luật giữ nguyên. 3 trận cùng phân bố; chỉ ngưỡng thắng tăng dần.
- **Ngẫu nhiên.** **Không trùng câu** trong 15 câu của lượt; và theo luật chung `spec-v1-app-hs.md` §2.2: không ra lại câu em từng gặp khi kho dạng đó chưa hết, hết thì ra câu gặp LÂU NHẤT trước.
- **Dạng hạn chế trùng:** xoay vòng — dùng hết các dạng đã học (xáo ngẫu nhiên) rồi mới lặp lại dạng đã dùng. Dạng ít hơn 15 thì lặp tối thiểu.
- **Sinh cả 15 câu MỘT LẦN lúc bắt đầu lượt** (chống trùng chắc chắn), chia sẵn 3 trận; client chỉ nhận trận hiện tại (không tải trước đáp án trận sau).

## 3. Điểm Rank

Giữ thang cũ, đổi cách đo: **thắng 1 trận = 10 · thắng 2 trận = 20 · vượt cả 3 = 30** (Điểm Rank/lượt; thua trận 1 = 0). Trần ngày/tháng của Thử thách (`spec-thanh-tuu-nhiem-vu.md` D2) giữ; với 2 lượt/ngày thì tối đa 60/ngày/… ⇒ xem §8.

## 4. Trải nghiệm (Giao diện)

```
Chọn môn → [Đấu trường: cổng + 3 ô trận (khoá/đang/đã thắng)] → Trận 1 (5 câu) → hoạt cảnh → Trận 2 → hoạt cảnh → Trận 3 → hoạt cảnh lớn → Kết quả
```
- Tận dụng màn làm bài nhúng (`LamBai` chế độ `nhung`) + khung đấu 2D như "Săn quái lang thang". Thanh máu quái có **vạch ngưỡng** ("cần 3/5"); đúng = quái mất máu, sai = quái hồi (luật cũ, hero không có máu).
- **Hoạt cảnh sau MỖI trận (~2 giây):** thắng = quái ngã; thua = em bị đẩy lùi, boss cười. **Cuối lượt (dài hơn):** vượt = boss gục + hạt vàng + chibi giơ sách; thua = màn tối dần, boss tiến lên, chibi mờ đi.
- **Đồ họa 2D** (ảnh tĩnh + hoạt ảnh bằng code: rung, lóe, hạt). Boss/quái: **DÙNG TẠM** boss Thùy 6 tư thế (`boss_thuy_*`) cho cả 3 trận; đủ quái Thùy thiết kế thì thay qua `nguonQuai`/sổ boss. Nền: nền đấu trường theo style. Nhân vật em: chibi theo giới tính.
- **Màn kết quả:** 3 ô trận (✔ ✔ ✖) · Điểm Rank được · số lượt còn hôm nay · nút "Thử lại" (xám khi hết lượt).

## 5. Ảnh hưởng tới các luật khác (cần sửa theo)

| Chỗ | Cũ | Mới |
|---|---|---|
| `spec-thanh-tuu-nhiem-vu.md` A2 | 1 lượt 10 câu · pass ≥80% · lượt vô hạn | theo file này |
| Nhiệm vụ N1 (pass 1 lượt) · T3 (4 ngày) · M2 (15 ngày) | "pass" | "VƯỢT Thử thách" (3 trận). Với trần 2 lượt/ngày, "ngày pass" vẫn tính 1 ngày |
| Huy hiệu Hercules ("≥5 lượt 10/10") · chỉ số `thu_thach_luot_full` | lượt 10/10 | **lượt vượt cả 3 trận** (đổi tên chỉ số cho rõ: `thu_thach_luot_vuot`) |
| Chuỗi · Điểm Rank 4 nguồn · Rank dua thắng | đếm lượt Thử thách | giữ, chỉ đổi định nghĩa "pass" |
| Tutorial (chặng Thử thách) | mô tả cũ | viết lại lời thoại |

## 6. Việc của Giao diện (sau khi DB có)

Màn Đấu trường (cổng + tiến độ 3 trận) · bọc `LamBai` nhung theo trận · hoạt cảnh 2D (sau trận + cuối) · nút Bỏ cuộc + xác nhận · màn kết quả mới · trạng thái "hết lượt hôm nay" / "chưa đủ dạng" · cập nhật tile Thử thách ở Tự luyện + nút "Đấu trường" ở hub phiêu lưu · cập nhật tutorial.

## 7. Việc của Số liệu (gửi vào hộp thư `spec-v1-app-hs.md` §13.6)

- RPC **bắt đầu lượt** (chọn môn; kiểm 2 lượt/ngày + đủ N dạng; sinh 15 câu theo §2 một lần; trả trận 1) · RPC **nộp trận** (chấm 5 câu, thắng/thua theo ngưỡng, trả trận kế hoặc kết quả cuối) · RPC **bỏ cuộc** · job/hàm tự tính thua sau 30 phút.
- Tất cả tính ở Postgres (`fn_*`/RPC transactional, CLAUDE §2.0). Bảng lượt có trạng thái trận (không `NULL` "chưa làm": dòng trận chỉ ra đời khi nộp).
- Điểm Rank 10/20/30 + trần giữ; cập nhật `fn_rank_*`, nhiệm vụ N1/T3/M2, huy hiệu Hercules theo §5. Thêm CHECK nếu có cột trạng thái mới.
- Màn kết quả cần: số trận thắng · điểm · lượt còn lại hôm nay · lý do thua (thua trận mấy / bỏ cuộc / hết giờ).

## 8. Câu còn mở

1. **2 lượt/ngày tính CHUNG mọi môn hay MỖI môn?** (Đề xuất: mỗi môn 2 lượt — em học 2 môn thì 4.)
2. **Trần Điểm Rank ngày** có còn cần không khi đã chặn 2 lượt (tối đa 60/ngày/môn)? (Đề xuất: bỏ trần ngày, giữ trần tháng.)
3. **Thoát giữa chừng 30 phút ⇒ thua** — Thùy xác nhận con số.
4. N tối thiểu số dạng đã học để mở Thử thách (đề xuất 5).
