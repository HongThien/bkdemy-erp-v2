# Game trong buổi học — spec (DRAFT, chờ CEO duyệt)

> Thùy 27/09: sau sự kiện Trung thu, đưa game vào buổi học BK. **Mỗi game 2 phiên bản luật**: bản SỰ KIỆN (giữ nguyên
> cho sự kiện sau) và bản BUỔI HỌC (link thẳng lớp đang học, luật hợp lớp). Trạng thái: chờ duyệt — CHƯA code.

## 1. Quyết định đã chốt (27/09)

| # | Câu hỏi | Chốt |
|---|---|---|
| 1 | Game nào | **Đoán Số · Chiếm Đất · Mở Rương** (3 trò TV, GV điều khiển) |
| 2 | Thưởng bằng gì | **EXP của môn** — nguồn thứ 4 "Trên lớp", cuối tháng chốt EXP→xu như các nguồn khác |
| 3 | Kiểu | **Giữ game, đổi luật** (chưa gắn câu hỏi/nội dung học) |
| 4 | Vé | **GV thưởng lượt** — miễn phí, chỉ HS được GV phát lượt mới chơi. HS **không bao giờ mất EXP** |
| 5 | Khi nào | **GV tự quyết** — nút mở game luôn có trong màn Buổi học |
| 6 | Ngân sách EXP | Nguồn "Trên lớp" TB **~300 EXP/HS/buổi**, dải **200–500** (4 nguồn: ET 100 cố định · BTVN 200/bài · Tự luyện ngẫu nhiên · Trên lớp) |

> ⚠ R1: ET 100 / BTVN 200 là **ĐÍCH**; DB hiện (30 ngày) ET 200–300, BTVN 189–300, TB 525 EXP/HS/buổi. Chỉnh 2 nguồn đó = việc
> RIÊNG, không nằm trong spec này.

## 2. Kiến trúc — 1 bộ code, 2 bộ luật (KHÔNG copy file)

- Mỗi game đọc **chế độ** lúc mở: mặc định = SỰ KIỆN (y hệt hiện tại, 0 thay đổi); `?che_do=lop` = BUỔI HỌC.
  Lý do không tách file: mọi bản vá (chống văng, chạm iPad…) sẽ phải vá 2 nơi → 2 bản lệch nhau (bài học drift v1).
- **Bản BUỔI HỌC: kết quả RÚT Ở POSTGRES, TV chỉ diễn** (§2.0 — EXP là dữ liệu nghiệp vụ, không để trình duyệt TV bốc
  ngẫu nhiên rồi ghi). Giống vòng quay sự kiện: `fn_sk_quay` rút ở DB, TV quay dừng đúng ô.
- **Luồng** (tái dùng đúng mẫu quản trò sự kiện đã chạy thật 26/09):
  1. GV mở **Buổi học** (ERP, đã đăng nhập) → nút **🎮 Game** → chọn game → TV (laptop lớp) mở game `?che_do=lop` qua kênh realtime.
  2. GV **phát lượt** cho HS ngay trên màn buổi (bấm +1 cạnh tên HS có mặt). Danh sách = HS `co_mat` của buổi → tự đổ xuống TV, không gõ tên.
  3. Chơi: GV chọn HS có lượt trên TV/ERP → ERP gọi RPC → **DB rút kết quả + ghi `gami_exp_ledger` trong 1 transaction** → phát kết quả xuống TV → TV diễn (mở ô / mở rương / quay số).
- **Dữ liệu** (mọi thứ mang `mon` — §1.6; `mon` lấy từ `lop.mon` của buổi):
  - Bảng mới `game_luot` — 1 dòng = 1 lượt GV phát (buoi_hoc_id, hoc_sinh_id, game, mon, nguoi_phat, at). Lượt "còn" = phát − đã chơi (suy động, không cột đếm).
  - Kết quả = dòng `gami_exp_ledger` `source='exp_tren_lop'`, `ref_buoi_hoc_id`, `mon`, note = game + chi tiết; khoá unique theo lượt ⇒ bấm 2 lần / 2 máy không cộng đúp.
  - **Trần DB: 500 EXP game/HS/buổi** — vượt thì cắt ở hàm, không ở client.
- RPC (mẫu `fn_*`, security definer có cổng quyền GV của lớp): `fn_game_phat_luot` · `fn_game_choi` (rút + ghi, trả kết quả cho TV diễn) · `fn_game_tinh_hinh_buoi` (lượt còn/đã chơi/EXP từng HS).

## 3. Luật bản BUỔI HỌC (đề xuất số — CEO chỉnh)

Nguyên tắc: **mỗi lượt kỳ vọng ~100 EXP** ⇒ GV phát ~3 lượt/HS/buổi ≈ 300 EXP (dải thực tế ~200–500, trần 500).
Không vé, không "thua mất vốn": lượt nào cũng có EXP, chỉ khác nhiều hay ít.

**Chiếm Đất / Mở Rương — chọn mức RỦI RO, cùng kỳ vọng 100 EXP** (thay cho giá 5/10/15 xu):

| Mức | Chiếm Đất | Mở Rương | Nhận (EXP) | Ý nghĩa |
|---|---|---|---|---|
| An toàn | ô ★ | Rương Gỗ | 80 – 120 | chắc chắn, ít biến động |
| Vừa | ô ★★ | Rương Bạc | 40 – 200 | |
| Liều | ô ★★★ | Rương Vàng | 20 – 300 | hên thì to, xui thì ít |

Hình quà / thẻ quà giữ nguyên nguyên tắc 26/09: nhìn hình biết to/nhỏ, số hiện sau. Độc đắc: bỏ ở bản lớp (hoặc 1 ô
"+300" hiếm — CEO chốt).

**Đoán Số — cả lớp (HS có lượt) đoán cùng 1 lần quay**, DB rút số:

| Kết quả | EXP |
|---|---|
| Trúng đúng | 300 |
| Lệch 1–2 | 200 |
| Lệch 3–5 | 130 |
| Lệch ≥6 (sàn) | 90 |

Kỳ vọng ≈ 3 + 8 + 7,8 + 80 ≈ **99 EXP/lượt**. Hàng chục dừng trước, hàng đơn vị bò chậm (giữ như bản sự kiện).

## 4. Không làm (đợt này)

- Không gắn câu hỏi/nội dung học vào game (quyết định #3).
- Không đụng 5 game iPad, Catan, Đua, BK Escape.
- Không đổi EXP của ET/BTVN (việc riêng, xem ⚠ §1).
- Bản SỰ KIỆN: không sửa luật.

## 5. Còn chờ CEO chốt

1. Bảng số §3 (dải EXP từng mức, EXP Đoán Số) — hay chỉnh?
2. Mặc định GV phát bao nhiêu lượt/HS/buổi (đề xuất 3; trần EXP 500 vẫn chặn nếu phát nhiều)?
3. Độc đắc bản lớp: bỏ hẳn hay giữ 1 ô hiếm?
4. Tên nguồn EXP mới hiển thị cho HS/PH: "Trên lớp"?
5. TV lớp: dùng laptop GV nối máy chiếu (hub `?che_do=lop`) — đúng thiết bị thực tế ở lớp?
