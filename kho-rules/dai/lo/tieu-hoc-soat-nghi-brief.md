# Brief — soát câu kho tiểu học bị máy nghi đáp số (05/11)

Mỗi câu trong `lo-<X>.json` là một câu kho Toán tiểu học (khối 3, 4, 4T, 5, 5T) mà lượt kiểm máy trước đó NGHI đáp số
(lý do ở `kiem_may_ghi`, đa số câu là CLONE sinh từ khuôn — khuôn hay lỗi hệ thống). Việc: phân xử từng câu, đề xuất bản sửa tối thiểu.
KHÔNG ghi DB, KHÔNG sửa tệp nào khác ngoài tệp kết quả.

## Cách làm từng câu

1. Đọc `noi_dung` (+ `lua_chon` nếu trắc nghiệm). **Tự giải độc lập trước** — chưa nhìn `dap_an`, `loi_giai`, `kiem_may_ghi`. Mọi phép tính
   chạy bằng `node -e` (số thập phân, phân số: dùng phân số chính xác, đừng tin số thực dấu phẩy động).
2. So với `dap_an` kho và với lời phê `kiem_may_ghi`. Kết luận một trong:
   - `kho_dung` — đáp án + lời giải kho đúng (máy nghi nhầm). Lời giải có lỗi nhỏ thì vẫn sửa ở `loi_giai_moi`.
   - `kho_sai` — đề dùng được, đáp án/lời giải kho sai ⇒ đưa `dap_an_moi` + `loi_giai_moi` đúng.
   - `de_hong` — đề không có đáp án đúng / 2 đáp án đúng / khuôn sinh ra đề vô nghĩa. Nếu sửa TỐI THIỂU được (đổi 1 phương án nhiễu
     thành đáp án đúng, đổi 1 số trong đề) thì đưa bản sửa (`noi_dung_moi` / `lua_chon_moi`) + đáp án + lời giải; không sửa được thì `bo` = true.
3. Lời giải mới: giữ ĐÚNG phong cách lời giải đang có của câu (dòng ngắn, xuống dòng đơn `\n`, LaTeX trong `$…$` nếu câu đang dùng),
   kiến thức tiểu học (không gọi ẩn, không chuyển vế, không ⇒), dấu nhân `\times` hoặc `×` như câu đang dùng, chia `:`.
   Trắc nghiệm: `dap_an_moi` là chữ cái A–D; phải khớp ĐÚNG MỘT phương án.
4. `dap_an` nhiều ý (vd `=\n>`) giữ đúng khuôn: mỗi ý một dòng.

## Tệp kết quả `ket-<X>.json`

Mảng, mỗi câu một object:
```
{ "ma_cau": "...", "ket_luan": "kho_dung|kho_sai|de_hong", "giai_doc_lap": "<đáp số tự giải ở bước 1>",
  "dap_an_moi": "..." | null, "loi_giai_moi": "..." | null, "noi_dung_moi": "..." | null, "lua_chon_moi": [..4..] | null,
  "bo": false, "ly_do": "<1–2 câu, có số liệu>" }
```
`null` = giữ nguyên trường đó. Với `kho_dung` mà lời giải không cần sửa: mọi trường *_moi = null.

## Trả lời cuối
Đếm theo kết luận · danh sách câu `de_hong` (mã + cách sửa / bỏ) · câu nào còn chưa chắc.
