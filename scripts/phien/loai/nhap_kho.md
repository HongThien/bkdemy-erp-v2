# Loại việc: NHẬP KHO & PHÂN DẠNG (Phase 3 — vòng xoáy xếp câu vào bản đồ)

Bản đồ khối đã có dạng + mô tả nhận biết (Phase 1–2). Việc của phiên này: **xếp các câu ĐÃ CÓ trong kho của khối vào
đúng dạng bài**, rồi cùng trưởng khối làm vòng xoáy tới khi hết câu chưa phân:

```
bạn phân câu ─┬─ CHẮC        → "cao"   : TỰ GÁN, không chờ ai (Thùy chốt: chấp nhận một phần sai, hậu kiểm sau)
              ├─ CHƯA CHẮC   → "vua"   : đề xuất, trưởng khối duyệt (ghi rõ phân vân giữa dạng nào)
              └─ KHÔNG HỢP   → "thieu" : bản đồ thiếu dạng cho câu này
→ gom câu "vua"/"thieu" thành CỤM theo lý do → đề xuất cho trưởng khối: thêm dạng / sửa mô tả
→ họ gật (hoặc tự sửa tay) → bạn thêm dạng / sửa mô tả → PHÂN LẠI các câu đó → lặp
```
**Đưa bài tập MỚI vào kho (Thùy 04/11):** người mở phiên đưa tài liệu / dán đề ⇒ bạn chép từng bài thành câu, giải
(nếu tài liệu chưa có lời giải), rồi `them_cau` — câu vào dạng chờ của khối, **chưa duyệt**, kèm `phan` để xếp luôn vào dạng
theo đúng luật cao / vua / thieu bên dưới. Câu trùng câu đã có trong kho thì DB không thêm, trả mã cũ. **Không có lệnh xoá.**
Câu có hình mà bạn không xem được hình ⇒ ghi rõ trong đề "[có hình — chưa đưa hình]" và không "cao".

**Ai mở phiên:** trưởng khối trở lên của đúng khối (người có Phòng làm việc).

## Thế nào là "cao" (chắc) — giữ chặt, vì câu "cao" đi thẳng tới học sinh

Chỉ "cao" khi **cả ba** đúng:
1. Câu khớp **mô tả nhận biết** của đúng một dạng (dấu hiệu đề, yêu cầu, công cụ giải).
2. **Không có dạng thứ hai** nào cũng hợp lý (đọc mô tả các dạng anh em trong cùng nhóm và nhóm cạnh).
3. Bạn đọc được trọn đề — câu **có hình** mà đề phụ thuộc hình (bạn không xem được ảnh) ⇒ **không** "cao".

Thiếu một điều ⇒ "vua" kèm lý do cụ thể (*"phân vân NDB012 (cùng mẫu) vs NDB013 (khác mẫu) vì đề không cho mẫu"*). Đề nghi
lỗi / không đọc được ⇒ đừng phân, liệt kê trong báo cáo để trưởng khối xem. **Thà "vua" còn hơn "cao" sai** — "cao" sai
chỉ lộ khi hậu kiểm hoặc học sinh làm sai câu đó.

## Công cụ

```
node scripts/phien/ban-do.mjs kho-tong                                   # bức tranh: còn bao nhiêu câu mỗi hàng
node scripts/phien/ban-do.mjs xem                                        # bản đồ + mô tả nhận biết từng dạng (đọc TRƯỚC khi phân)
node scripts/phien/ban-do.mjs doc '{"loai":"nhom","id":"NNB..."}'        # đủ lý thuyết/mô tả một nhóm khi cần soi kỹ
node scripts/phien/ban-do.mjs kho-cau '{"hang":"trong","limit":20}'      # câu chưa có dạng (hàng khác: de_xuat · thieu · mau)
node scripts/phien/ban-do.mjs kho-dang '{"dang_bai_id":"NDB..."}'        # câu đang nằm trong một dạng
node scripts/phien/ban-do.mjs phan_dang <<'HET'
[{"ma_cau":"T107...","ket_qua":"cao","dang_bai_id":"NDB..."},
 {"ma_cau":"T107...","ket_qua":"vua","dang_bai_id":"NDB...","ly_do":"..."},
 {"ma_cau":"T107...","ket_qua":"thieu","ly_do":"...","chu_de_id":"NCD..."}]
HET
node scripts/phien/ban-do.mjs them_cau <<'HET'                           # ≤ 20 bài tập MỚI vào kho (xem tro-giup để đủ trường)
[{"nhanh":"dai","loai_cau":"tu_luan","noi_dung":"...","loi_giai":"...","dap_an":"...","ten_de_goc":"tên tài liệu",
  "phan":{"ket_qua":"cao","dang_bai_id":"NDB..."}}]
HET
node scripts/phien/ban-do.mjs them_dang_bai '{"nhom_id":"...","ten":"...","mo_ta":"..."}'   # khi trưởng khối gật thêm dạng
node scripts/phien/ban-do.mjs sua '{"loai":"dang_bai","id":"...","mo_ta":"..."}'            # khi trưởng khối gật sửa mô tả
```
- Lời giải viết theo đúng định dạng kho (`kho-rules/` của khối nếu có) — đề và lời giải liền dòng, công thức trong `$…$`.
- Mỗi lô ≤ 50 câu (`them_cau` ≤ 20). Câu lỗi không kéo cả lô; đọc kết quả từng câu.
- Chỉ phân **câu gốc** (bản sao tự đi theo), không phân câu Đúng/Sai, chỉ câu của đúng khối — DB tự chặn.
- Câu **NGƯỜI đã quyết** (gán tay / đã kiểm mẫu) DB không cho đổi — đúng như thế, đừng tìm cách vòng.
- Câu Đại phân vào chủ đề vùng `toan`; câu Hình giải tích (nhánh `hgt`) vào chủ đề vùng `hgt`.
- **Phiên KHTN** (05/11): kho `khtn`, bản đồ KHTN không chia vùng — `them_cau` dùng `"nhanh":"khtn"` (bỏ trống cũng được),
  dạng bài mã `KDB…`, chủ đề mã của bản đồ KHTN. Câu Toán không phân được trong phiên KHTN và ngược lại (DB chặn).

## Cách làm một lượt

1. `kho-tong` + `xem` → báo trưởng khối: còn bao nhiêu câu chưa phân, bao nhiêu đề xuất / thiếu dạng đang chờ.
2. Lấy từng trang `kho-cau` hàng `trong` → phân → `phan_dang`. Đọc kỹ mô tả, đừng phân theo tên dạng cho nhanh.
3. Cuối lượt báo gọn: *phân N câu — cao a · vua b · thiếu c · còn d câu chưa phân*, rồi **gom cụm**:
   - **Cụm thiếu dạng**: các câu cùng hỏi một thứ mà bản đồ chưa có ⇒ đề xuất *thêm dạng "X" vào nhóm Y, mô tả: …* (n câu).
   - **Cụm phân vân**: hai dạng có mô tả chồng nhau ⇒ đề xuất *sửa mô tả dạng P thành … để tách khỏi Q* (n câu).
   Mỗi cụm kèm 1–2 mã câu tiêu biểu để họ mở xem.
4. Trưởng khối gật cụm nào ⇒ thêm dạng / sửa mô tả ⇒ **phân lại** đúng các câu của cụm (hàng `thieu` / `de_xuat`).
   Sửa mô tả dạng X ⇒ `kho-dang` dạng X và các dạng bị ảnh hưởng: câu bạn đã tự gán ("đang gán: AI") mà giờ không còn chắc
   ⇒ phân lại "vua" (DB tự bỏ gán AI cũ). Báo rõ câu nào bị chuyển.
5. Người bảo **chạy hết** và còn câu `trong` mà không có gì cần hỏi ⇒ kết thúc lượt bằng `[[TIEP]]` (xem luật chung).

## Hậu kiểm (để trưởng khối biết)

~10% câu bạn tự gán rơi vào hàng **mẫu** để trưởng khối kiểm ở màn **Bản đồ mới › Duyệt kho** (hoặc nhờ bạn đọc lại:
`kho-cau` hàng `mau`). Câu họ sửa ⇒ là chỗ bạn đã sai — đọc lý do, rút kinh nghiệm cho lượt sau, đề xuất ghi luật khối nếu
lặp lại.
