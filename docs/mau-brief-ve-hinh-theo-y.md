# Brief trạm vẽ — HÌNH THEO Ý (kho Hình Luyện, lớp 8)

Bạn vẽ hình hình học phẳng bằng code cho MỘT gói bài. KHÔNG đụng DB, KHÔNG gắn ảnh, KHÔNG xoá/sửa tệp nào ngoài tệp của gói mình.

## Đọc trước (bắt buộc, đọc hết)
1. `docs/mau-brief-ve-lai-hinh.md` — nhất là **§4** (ký hiệu đoạn bằng nhau: tối đa 3 gạch, nhóm 4–6 dùng dấu × — gọi `tick(a,b,n)` là đủ) và **§5** (hình theo ý).
2. `scripts/anh/ve_hinh_lib.mjs` — bộ vẽ (dựng điểm `mid/foot/inter/rot/bisector/doiXung/reflect/lerp`, vẽ `seg/segDash/lineExt/circle/poly`, ký hiệu `tick/rightAngle/angleMark`, chữ `label/labelOut/num/sideText`, xuất `hinh(...)` + `await xuatTat(dir)` ở cuối).
3. **Mẫu đã được CEO duyệt:** `scripts/hinh-luyen/ve/K8-thu-1.mjs` (+ ảnh ra ở `scripts/hinh-luyen/ve/K8-thu-1/moi/`). Viết y khuôn đó.
4. `scripts/hinh-luyen/ve/<GÓI>/viec.md` — mỗi bài: giả thiết chung, từng ý (mã `HLY…`, câu hỏi, lời giải). Ảnh `*_cu_*.png` cùng thư mục = hình CŨ của nguồn (thường là hình lời giải gộp mọi ý) — chỉ để tham chiếu bố cục/tên điểm, KHÔNG chép nguyên.

## Làm
- Viết `scripts/hinh-luyen/ve/<GÓI>.mjs`, ra ảnh vào `scripts/hinh-luyen/ve/<GÓI>/moi/`. Chạy `node scripts/hinh-luyen/ve/<GÓI>.mjs`.
- Mỗi bài:
  - **`HLB….png`** = chỉ giả thiết chung. Bài MỘT Ý (không có giả thiết chung tách riêng): `HLB` vẽ theo toàn bộ đề của ý đó, và KHÔNG vẽ `HLY`.
  - **`HLY….png`** chỉ cho ý **có dựng thêm** điểm/đường (hoặc câu hỏi nhắc một đoạn chưa có trên hình — vd "tứ giác AECK" thì nối AE, CK). Ý không thêm gì ⇒ không tệp.
  - Cộng dồn từ các ý trước, TRỪ thứ mà câu hỏi lẫn lời giải của ý này không dùng tới (bỏ cho gọn).
  - **Không đánh dấu điều phải chứng minh** (không nối 3 điểm phải chứng minh thẳng hàng, không ký hiệu song song/bằng nhau/vuông góc mà ý đó bắt chứng minh, không vẽ điểm đồng quy phải chứng minh). Điều ĐÃ chứng minh ở ý trước được đánh dấu ở hình ý sau.
  - Dữ kiện đề cho (trung điểm, góc vuông, số đo, đoạn bằng nhau) đánh dấu từ hình bài.
  - Dựng ĐÚNG bằng hàm (trung điểm `mid`, chân vuông góc `foot`, giao `inter`, đối xứng `doiXung`), kiểm bằng `console.assert` như mẫu. Tam giác/tứ giác **lệch** cho tổng quát (đề không nói cân/đều thì đừng vẽ gần cân/đều); thoả các điều kiện như AB < AC.
  - Khung ≤ 520 × 400 px (lib cảnh báo khi vượt 560 × 420 — thu toạ độ lại).
- Sau khi chạy: chạy `node scripts/hinh-luyen/ve/to_soat.mjs <GÓI>` rồi MỞ từng `soat-*.png` (và ảnh lẻ khi cần) để soát: nhãn đè nét/đè nhau, gạch đè điểm, hình sai dữ kiện, thiếu đoạn câu hỏi nhắc. Sửa rồi chạy lại tới khi sạch.

## Báo cáo (ngắn, cuối cùng)
1. Danh sách tệp đã vẽ (HLB/HLY) và ý nào cố ý không vẽ.
2. Bài nào đề **mâu thuẫn / thiếu dữ kiện / nghi sai** (ghi mã + lý do) — KHÔNG tự sửa đề, vẽ theo cách hợp lý nhất và nêu ra.
3. Chỗ bạn KHÔNG chắc (để người soát nhìn kỹ).
