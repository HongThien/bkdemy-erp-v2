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
theo đúng luật cao / vua / thieu bên dưới. Câu trùng câu đã có trong kho thì DB không thêm, trả mã cũ.
Câu có hình mà bạn không xem được hình ⇒ ghi rõ trong đề "[có hình — chưa đưa hình]" và không "cao".
**Câu Hình phụ thuộc hình vẽ: VẼ NGAY bằng `dung_hinh` / `ve_hinh` (§Vẽ hình, §Dựng hình) trong cùng lượt nhập — KHÔNG để treo "chờ công cụ vẽ" (Thùy 10/11: công cụ vẽ đã bật, chạy được; không có gì phải chờ ai cho phép).**

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
node scripts/phien/ban-do.mjs duyet_cau '{"nhom_id":"NNB…"}'          # duyệt câu (cả nhóm / cả dạng / danh sách mã) — bo_duyet_cau ngược lại
node scripts/phien/ban-do.mjs sua_cau <<'HET'                          # sửa đề / phương án / đáp án / lời giải (chỉ trường có mặt)
[{"ma_cau":"…","dap_an":"…","loi_giai":"…"}]
HET
node scripts/phien/ban-do.mjs kho_rac <<'HET'                          # câu hỏng ⇒ kho rác (khôi phục được) — hỏi người mở phiên trước
[{"ma_cau":"…","ly_do":"…"}]
HET
node scripts/phien/ban-do.mjs anh_pdf '{"file":"<pdf>","trang":3,"vung":[0.1,0.2,0.6,0.5],"ten":"cau12"}'   # cắt hình từ PDF
node scripts/phien/ban-do.mjs anh_docx '{"file":"<docx>"}'                                                 # tách hình từ Word
node scripts/phien/ban-do.mjs gan_anh '{"ma_cau":"…","file":"<png vừa cắt>","o":"de"}'                   # gắn hình vào câu
node scripts/phien/ban-do.mjs them_dang_bai '{"nhom_id":"...","ten":"...","mo_ta":"..."}'   # khi trưởng khối gật thêm dạng
node scripts/phien/ban-do.mjs sua '{"loai":"dang_bai","id":"...","mo_ta":"..."}'            # khi trưởng khối gật sửa mô tả
```
- Lời giải viết theo đúng định dạng kho (`kho-rules/` của khối nếu có) — đề và lời giải liền dòng, công thức trong `$…$`.
- Mỗi lô ≤ 50 câu (`them_cau` ≤ 20). Câu lỗi không kéo cả lô; đọc kết quả từng câu.
- Chỉ phân **câu gốc** (bản sao tự đi theo), không phân câu Đúng/Sai, chỉ câu của đúng khối — DB tự chặn.
- Câu **NGƯỜI đã quyết** (gán tay / đã kiểm mẫu): mặc định DB không cho đổi. Chỉ khi người mở phiên BẢO đổi câu đó ⇒ thêm
  `"ghi_de": true` vào đúng câu đó trong `phan_dang`. Không tự thêm cờ này cho cả lô.
- Câu Đại phân vào chủ đề vùng `toan`; câu Hình giải tích (nhánh `hgt`) vào chủ đề vùng `hgt`.
- **Phiên KHTN** (05/11): kho `khtn`, bản đồ KHTN không chia vùng — `them_cau` dùng `"nhanh":"khtn"` (bỏ trống cũng được),
  dạng bài mã `KDB…`, chủ đề mã của bản đồ KHTN. Câu Toán không phân được trong phiên KHTN và ngược lại (DB chặn).
- **Phiên Vật lý / Hóa học** (12/11, khối 10–12, hai môn RIÊNG): y hệt KHTN — kho `vatly` / `hoahoc`, `"nhanh":"vatly"` / `"hoahoc"` (bỏ trống cũng được), dạng bài mã `LDB…` / `QDB…`, chủ đề `LCD…` / `QCD…`. Câu môn khác không phân được trong phiên (DB chặn).

## Ảnh của câu (06/11)

Câu có hình mà chưa gắn ⇒ tìm hình ở tài liệu gốc: PDF thì `anh_pdf` (đoán vùng theo tỉ lệ trang, cắt rộng một chút), Word thì
`anh_docx` (đọc `van_ban.md` để biết hình nằm sau câu nào). **Luôn Read ảnh vừa cắt để soát** đúng hình, đủ nhãn điểm, không dính
chữ câu khác — sai thì cắt lại với vùng khác. Đúng rồi mới `gan_anh`, rồi sửa đề bỏ dòng "[có hình — chưa đưa hình]" bằng `sua_cau`.

**Vẽ hình sạch (09/11)** — khi người mở phiên muốn "hình vẽ đẹp / bỏ watermark", hoặc ảnh sách mờ/có chữ đè: **vẽ lại** bằng
`ve_hinh` thay vì cắt. Bạn KHÔNG viết file hay chạy mã được — chỉ gửi phần thân SVG qua heredoc:
```
node scripts/phien/ban-do.mjs ve_hinh '{"ten":"cau12","w":420,"h":300,"luoi":30}' <<'HET'
<polyline points="60,240 120,120 210,180"/><circle cx="60" cy="240" r="4.5" fill="#222" stroke="none"/>
<text x="46" y="268" stroke="none" fill="#111" font-style="italic">A</text>
HET
```
- Thẻ được dùng: `g line polyline polygon path circle ellipse rect text tspan` (+ `defs marker` cho mũi tên). Mọi giá trị trong dấu nháy;
  chữ "<" trong nhãn viết `&lt;`. Khung sẵn: nền trắng, nét #222 dày 2, chữ Times 26 — chữ nhớ `stroke="none" fill="#111"`.
- `luoi` = cạnh ô lưới vuông (px) cho bài trên lưới ô vuông/giấy kẻ ô; bỏ trống = không lưới. Toạ độ gốc trên-trái, y hướng xuống.
- **Hình phải KHỚP dữ kiện đề** (độ dài theo số ô, vuông góc thật, chia đều thật) — tự tính toạ độ, đừng ước mắt. Đỉnh hình đặt đúng giao điểm lưới.
- **Read ảnh vừa vẽ để soát** (nhãn đủ, không chồng chữ, không lộ đáp án) rồi `gan_anh` (o `de`), cuối cùng `sua_cau` bỏ "[có hình — chưa đưa hình]".
- Hình lời giải (vd tô màu phần đáp án) vẽ riêng một ảnh, gắn `o` `dap_an`.

**Dựng hình lớp 6–12 (09/11)** — hình có quan hệ hình học (vuông góc, trung điểm, đường tròn, tiếp tuyến, toạ độ, đồ thị, hình
không gian): dùng `dung_hinh`, KHÔNG tự tính toạ độ nhẩm (`ve_hinh` chỉ cho hình lưới/đơn giản). Khai điểm bằng toạ độ toán hoặc phép
dựng, máy tính toạ độ chính xác, tự co khung, tự đặt nhãn né nét, in lại toạ độ đã tính:
```
node scripts/phien/ban-do.mjs dung_hinh <<'HET'
{"ten":"cau7",
 "diem":[["O",[0,0]],["M",[7,0]],["A",["tiep_diem","M","O",3,0]],["B",["tiep_diem","M","O",3,1]],["H",["giao","A","B","O","M"]]],
 "ve":[["duong_tron","O",3],["doan","M","A"],["doan","M","B"],["doan","A","B"],["doan","O","M"],["goc_vuong","H","A","M"],
       ["gach","M","A",1],["gach","M","B",1],["cham","tat_ca"],["nhan","tat_ca"]]}
HET
```
- **Toạ độ toán, y hướng LÊN.** `[x,y]` phẳng · `[x,y,z]` không gian (chiếu xiên: y vào sâu, z lên trên).
- **Phép dựng điểm** `["Tên", ["phép", …]]`: `trung_diem A B` · `chia A B t` (A + t·AB) · `chan P A B` (chân đường vuông góc từ P xuống AB) ·
  `giao A B C D` (giao AB và CD) · `quay P O độ` (ngược chiều kim đồng hồ) · `doi_xung_diem P O` · `doi_xung_truc P A B` · `tinh_tien P A B` ·
  `trong_tam A B C` · `tam_ngoai A B C` · `tam_noi A B C` · `truc_tam A B C` · `tren_tron O R độ` · `giao_tron_thang O R A B 0|1` ·
  `giao_hai_tron O1 R1 O2 R2 0|1` · `tiep_diem M O R 0|1` · `phan_giac V P Q dài` · `vuong_goc P A B dài` · `song_song P A B dài`.
  R = số hoặc tên một điểm trên đường tròn. Hình KHÔNG GIAN chỉ dùng phép giữ qua phép chiếu (trung_diem · chia · giao hai đường cùng
  mặt phẳng · trong_tam · tinh_tien); chân đường cao/tâm mặt cầu trong không gian thì tự tính toạ độ 3D rồi nhập thẳng.
- **Nét** `["loại", …, {tuỳ chọn}]`: `doan A B` · `duong_thang A B` (kéo dài 2 đầu) · `tia A B` · `vecto A B` · `da_giac [A,B,C] {"to":"#e6ecf5"}` ·
  `duong_tron O R` · `cung O A B` (từ A tới B ngược chiều kim đồng hồ) · `goc V P Q số_cung` · `goc_vuong V P Q` · `gach A B số_gạch` (đoạn bằng nhau) ·
  `cham [..]|"tat_ca"` · `nhan [..]|"tat_ca" {"huong":độ}` (tên có `_1` ⇒ chỉ số dưới) · `chu điểm|[x,y] "chữ"` ·
  `truc {"x":[-2,6],"y":[-2,5],"vach":1,"luoi":true}` · `do_thi "x^2-4x+3" x_đầu x_cuối`.
  Tuỳ chọn: `{"dut":true}` nét đứt (cạnh khuất) · `{"mau":"#dc2626"}` · `{"day":3}`. Cố định tỉ lệ (hình toạ độ): thêm `"ti_le":50` (px/đơn vị).
- Lỗi dựng (song song không giao, điểm trong đường tròn không kẻ được tiếp tuyến…) ⇒ máy báo rõ — sửa dữ kiện, đừng ép.
- Read ảnh để soát như mọi hình khác rồi `gan_anh`. Không vẽ chi tiết của LỜI GIẢI (đường phụ, điểm dựng thêm) vào hình ĐỀ.

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
