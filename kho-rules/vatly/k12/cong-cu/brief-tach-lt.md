# Brief trạm XẾP KHỐI LÝ THUYẾT — nhóm (chung) vs dạng (riêng), bản đồ Vật lý 12

CEO chốt: **"Nhóm là lý thuyết chung. Từng dạng là lý thuyết riêng."**
Hiện toàn bộ lý thuyết (chép từ sách) đang nằm ở ô NHÓM. Việc của bạn: với từng khối lý thuyết `[Kn]` của mỗi nhóm, quyết định nó ở lại NHÓM hay chuyển xuống (các) DẠNG nào. **Bạn KHÔNG viết, không sửa, không tóm tắt chữ nào** — chỉ ra bảng xếp chỗ; máy sẽ ráp nguyên văn.

Đầu vào: file `khoi-<phan>.md` được giao (trong `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\vatly\k12\tach-lt\`). Mỗi nhóm có: đường dẫn, danh sách dạng con (mã — tên — mô tả nhận biết), các khối `[K0] [K1]…` (mỗi khối mở bằng thẻ `##ĐN/##ĐL/##TC/##CY/##PP/##NX`).

## Luật xếp
1. **Ở lại NHÓM ("N")** = kiến thức nền mà MỌI dạng trong nhóm (hoặc phần lớn) đều cần: định nghĩa khái niệm chính của nhóm, định luật gốc, kí hiệu/đơn vị chung, chú ý dùng chung.
2. **Xuống DẠNG** = kiến thức chỉ phục vụ một (hoặc vài) dạng: phương pháp giải (`##PP`) của dạng đó, công thức/tính chất chỉ dạng đó dùng, chú ý/bẫy riêng của dạng đó, bảng phân biệt chỉ dạng nhận biết đó cần. Đọc kĩ TÊN + MÔ TẢ NHẬN BIẾT của dạng để quyết.
   - Khối dùng cho 2–3 dạng (không phải tất cả) ⇒ ghi mảng các dạng đó (khối sẽ được CHÉP vào mỗi dạng).
   - Nhóm chỉ có 1 dạng: định nghĩa/định luật nền vẫn ở N; `##PP` và công thức tính cụ thể xuống dạng.
3. Mỗi khối phải được xếp **đúng một lần** (hoặc "N", hoặc mảng ≥1 mã dạng của CHÍNH nhóm đó). Không bỏ khối nào, không xếp sang nhóm khác.
4. Khối trộn cả chung lẫn riêng ⇒ xếp theo phần CHÍNH của khối, ghi vào `tron` để người duyệt biết.
5. Dạng không nhận được khối nào ⇒ ghi vào `dang_trong` kèm lý do (sách không có kiến thức riêng cho dạng đó). Không bịa.
6. Nhóm không có khối nào ⇒ bỏ qua.

## Đầu ra: `...\tach-lt\xep-<phan>.json` (ghi bằng Write tool, UTF-8)
```
{ "xep": { "LNB00034": { "K0": "N", "K1": ["LDB00068"], ... }, ... },
  "tron": [ { "nhom": "LNB…", "khoi": "K3", "ghi": "…" } ],
  "dang_trong": [ { "dang": "LDB…", "ly_do": "…" } ] }
```
Tự kiểm bằng `node -e` (đường dẫn kiểu `C:/Users/...`): JSON parse được; mọi nhóm có khối trong file đều có trong `xep`; mỗi nhóm đủ đúng số khối K0..Kn-1; mọi mã dạng ghi ra thuộc đúng nhóm đó (đối chiếu danh sách dạng con trong file .md). Không ghi DB, không sửa file khác.

## Trả lời cuối (≤ 80 từ)
Số khối ở N / xuống dạng · số dạng có ≥1 khối · dạng còn trống (mã) · số khối trộn.
