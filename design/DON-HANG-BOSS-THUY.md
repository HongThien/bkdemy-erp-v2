# Đơn ChatGPT — Boss mẫu "Thùy" (CHIBI, giữ khuôn mặt) — soạn 01/10/2026

> Thùy chốt 01/10: **mặt là chính**, làm **chibi** sao cho vẫn **nhận ra khuôn mặt**; quần áo không quan trọng.
> Flow tổng: `design/FLOW-NPC-BOSS-CUOI.md` (§A = cách làm asset). Ảnh gốc: `design/bk-ui-src/anh_thuy.jpg`.

## Cách gửi
1. Context ChatGPT MỚI → dán `design/CHATGPT-UI-KIT.md`.
2. Dán nguyên khối ĐƠN dưới.
3. Đính kèm 2 ảnh: `anh_thuy.jpg` (mặt) + `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png` (CHỈ lấy nét vẽ/ánh sáng của style RPG).
4. Mỗi hình xong: tải về `design/bk-ui-src/boss/thuy/`, gõ "tiếp". **Hình #2 phải được Thùy duyệt mới làm tiếp.**

## Các nét nhận dạng của khuôn mặt (từ ảnh — Claude đọc)

Phải GIỮ ở mọi pose (đây là thứ làm người xem nhận ra):
- **Kính gọng nửa** (chỉ viền kim loại mảnh phía trên, không viền dưới), mắt nhìn thẳng.
- **Tóc đen ngắn**, mái chải gọn lên, trán lộ, đường chân tóc hơi vuông.
- **Mặt hơi vuông-tròn, gò má cao**, cằm đầy; **nụ cười mở lộ hàng răng trên**, má đẩy lên.
- Lông mày thẳng, hơi đậm.
Có thể BỎ/ĐỔI tự do: quần áo, tay chân, phụ kiện, nền.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            boss-cuoi-thuy-mau
Mô tả:          Nhân vật boss cuối của app học sinh trung tâm dạy thêm BK Academy, style Anime RPG. Dựa trên ảnh chân dung đính kèm
                (người thật, chính chủ đã đồng ý) nhưng vẽ thành CHIBI: đầu to khoảng 1/2 chiều cao thân, thân nhỏ, tay chân ngắn mập.
                ƯU TIÊN SỐ 1 = khuôn mặt vẫn NHẬN RA được là người trong ảnh: giữ kính gọng nửa, tóc đen ngắn chải gọn lên, mặt hơi vuông,
                nụ cười lộ răng. Mắt chibi vẽ to vừa phải, KHÔNG biến thành mắt long lanh kiểu nữ tính, không đổi tuổi, không làm trẻ con hoá.
                Quần áo tuỳ ý, hợp style RPG (áo choàng/giáp nhẹ, màu xanh navy + vàng làm điểm nhấn), miễn gọn ôm thân, không cánh/đuôi.
                Thần thái: tự tin, hóm hỉnh, công bằng; KHÔNG dữ, KHÔNG đáng sợ (đối tượng là học sinh 8–18 tuổi).
Phong cách:     Anime RPG như ảnh tham chiếu thứ hai: nét viền rõ, tô khối mềm, ánh sáng từ trái-trên, bảng màu ấm. Thiết kế gốc,
                không giống nhân vật/logo của game nào.
Phiên bản kit:  v2

══ CÁCH GIAO HÀNG (bắt buộc) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng bằng code/SVG/ghép khối. Vẽ bằng công cụ tạo ảnh.
- MỖI LƯỢT = ĐÚNG 1 HÌNH. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#02 boss_thuy_goc". Vẽ xong dừng, chờ tôi gõ "tiếp".
- Ảnh tôi tải ra LÀ file giao.
- Bỏ qua logo/dấu sao nhỏ ở góc dưới phải ảnh gốc, không vẽ lại nó.

══ CHUẨN ══
- Nhân vật: vuông 1254×1254, nền TRONG SUỐT thật (không viền trắng), toàn thân, ở GIỮA chiếm ~80% khung, không chữ/số.
- Mọi pose: cùng cỡ đầu, cùng gương mặt, cùng trang phục, cùng nguồn sáng (trái-trên), cùng độ chi tiết.
- Pose gốc: đứng thẳng, hơi chéo 3/4, tay hơi dang xuống (A-pose) — để sau này dùng làm model 3D nếu cần.

══ DANH SÁCH GIAO (đúng thứ tự) ══
#01 concept_a — 1 ảnh gồm 3 phương án chibi khác nhau (khác độ "chibi" và trang phục), CHỈ để chọn, không cắt dùng. → DỪNG, chờ Thùy chọn.
#02 boss_thuy_goc — phương án đã chọn, pose gốc. → DỪNG, Thùy duyệt, KHOÁ làm hình gốc.
Từ #03 trở đi: mỗi lượt đính lại hình gốc #02 và vẽ cùng nhân vật ở pose mới:
#03 boss_thuy_noi    — đang nói, miệng mở, 1 tay giơ lên như đang giảng
#04 boss_thuy_chieu  — gồng chiêu: người nghiêng ra trước, 2 tay tụ sáng, mắt sáng sau cặp kính
#05 boss_thuy_trung  — trúng đòn: nhắm 1 mắt, nhăn nhẹ, hơi lùi (KHÔNG đau đớn, KHÔNG máu)
#06 boss_thuy_gian   — "nghiêm túc hơn": hào quang vàng bùng lên, cùng mặt cùng áo, cười nhếch tự tin
#07 boss_thuy_ha     — bị hạ: mỉm cười công nhận, giơ 2 ngón cái (như ảnh gốc), tan thành các hạt sáng ở chân
#08 boss_thuy_chandung — chân dung từ ngực trở lên 1024×1024, nhìn thẳng, cười, dùng cho khung hội thoại
```

## Claude kiểm khi nhận hình
- Mặt: kính gọng nửa · tóc ngắn · nụ cười lộ răng còn nhận ra; **đặt cạnh ảnh gốc cho Thùy tự chấm "có nhận ra không"** (đây là phép thử thật, không có số).
- Alpha thật, cùng cỡ đầu (±3%) giữa #02–#07, không chữ, không halo trắng.
- Nếu pose nào lệch mặt: sinh lại từ #02, không sửa tiếp trên hình lệch.
