# Loại việc: LÝ THUYẾT DẠNG (Phase 2 — lý thuyết · ví dụ · mô tả nhận biết)

Bản đồ khối đã có cấu trúc (Phase 1). Việc của phiên này: **soạn nội dung** cho từng nhóm bài và dạng bài, trưởng
khối đọc, sửa (tay trên màn Bản đồ hoặc ra lệnh cho bạn), lặp tới khi họ chốt. Nội dung này in vào giáo trình, hiện
trên app học sinh, và **mô tả nhận biết là căn cứ để phân dạng câu hỏi ở Phase 3** — viết cẩn thận.

## Ô nào chứa gì (spec-ban-do-4-tang.md §1 Q3)

| Ô | Nội dung |
|---|---|
| **Nhóm bài · ly_thuyet** | Lý thuyết **chung** của mọi dạng trong nhóm: định nghĩa, công thức, tính chất (`##ĐN`, `##TC`, `##ĐL`…) |
| **Dạng bài · ly_thuyet** | Cái **riêng** của dạng: dấu hiệu nhận ra → `##PP` phương pháp 3–6 bước → `##CY` bẫy thật. **Không chép lại lý thuyết nhóm.** Không đặt ví dụ ở đây |
| **Dạng bài · vi_du** | **2 ví dụ có lời giải**: ví dụ 1 cơ bản đúng dạng, ví dụ 2 khó hơn một bậc. Mỗi ví dụ mở bằng `##VD`, có dòng `Bài giải:` |
| **mo_ta** (nhóm / dạng) | **Mô tả nhận biết**: dấu hiệu đề bài · yêu cầu · công cụ giải — sao cho phân biệt được với các dạng anh em |

## Định dạng (spec-format-noidung.md · khuôn K9/K11 trong `kho-rules/dai/k11.md` §4)

```
##TC Tên tính chất / công thức
- mỗi ý một dòng "- "

##PP Tên phương pháp
mỗi dòng một bước trọn ý — KHÔNG ghi "Bước 1" (app tự đánh số)

##CY
bẫy thật hay gặp

##VD
<đề ví dụ>

Bài giải:
<mỗi phép biến đổi một dòng, liền dòng, không dòng trống bên trong>
Vậy …
```
Công thức trong `$…$` (không `$$`, không `\(`), nhân dùng `\cdot`, phân số `\dfrac`, thập phân `2{,}5`, chữ trong công thức
`\text{…}`, chỉ `**đậm**`, không emoji. Kí hiệu khối chỉ: `##ĐL ##ĐN ##TC ##CY ##PP ##VD ##NX`. Công cụ tự kiểm và chặn lỗi định dạng.

**Phạm vi kiến thức theo khối**: chỉ dùng kiến thức tới hết bài của dạng + các lớp dưới. Đọc file luật khối (ghi trong
thông tin phiên) nếu có — ở đó có danh sách CẤM (vd K11 chương 1–2 không dùng đạo hàm). Chưa có file luật khối thì
bám chương trình 2018 của đúng lớp đó, gặp chỗ không chắc thì **hỏi trưởng khối**.

## Công cụ

```
node scripts/phien/ban-do.mjs xem                                   # cây + cờ LT✓ VD✓ — biết chỗ nào còn trống
node scripts/phien/ban-do.mjs doc '{"loai":"nhom","id":"NNB00056"}'  # ĐỦ nội dung nhóm + mọi dạng bên trong, kèm md5 từng ô
node scripts/phien/ban-do.mjs ghi_noi_dung '{"loai":"dang_bai","id":"NDB00078","truong":"vi_du","md5_cu":"<md5 nếu ô đang có chữ>"}' <<'HET'
##VD
...
HET
node scripts/phien/ban-do.mjs thay-doi                              # trưởng khối vừa sửa tay gì
node scripts/phien/ban-do.mjs sua '{"loai":"dang_bai","id":"...","ten":"..."}'   # đổi tên được; đổi cấu trúc thì KHÔNG (phiên Bản đồ)
```
- Nội dung đưa qua **heredoc có nháy** (`<<'HET'`) để `$` và `\` giữ nguyên.
- **Ô đang có chữ ⇒ phải `doc` trước và gửi `md5_cu`.** Bị từ chối vì md5 lệch nghĩa là trưởng khối vừa sửa tay — `doc`
  lại, đọc kỹ bản của họ, **giữ ý họ**, rồi mới ghi. Không bao giờ ghi đè chữ của người mà chưa đọc.
- Không xoá trắng ô (công cụ chặn). Ô có **file đính kèm** (doc báo "có FILE") — đừng soạn trùng, hỏi trưởng khối.

## Cách làm

1. **Đầu phiên**: `xem` → báo trưởng khối bức tranh (bao nhiêu nhóm/dạng còn trống LT, VD, mô tả) → hỏi làm phần nào
   trước nếu họ chưa nói.
2. **Theo từng NHÓM**: `doc` nhóm → soạn lý thuyết nhóm (nếu trống) + lý thuyết, ví dụ, mô tả từng dạng → ghi → báo
   gọn: nhóm nào, ô nào đã ghi, có gì cần họ xem kỹ. Một lượt vừa đủ để họ đọc (1–2 nhóm), đừng đổ cả chương một lần.
3. **Ví dụ phải đúng 100%.** Bạn không có máy tính — tính lại từng bước, thử ngược đáp số. Ví dụ nào không chắc ⇒ **đừng
   ghi**, nói rõ "ví dụ này em chưa chắc ở bước…, anh/chị xem giúp". Thà bỏ trống còn hơn ghi sai.
4. **Trưởng khối sửa tay rồi nhắn "làm tiếp"**: `thay-doi` → xem họ đổi gì → nếu là sửa cách viết/phương pháp thì áp
   cùng tinh thần cho các dạng còn lại và **đề xuất ghi thành luật khối** (xem luật chung #8).
5. Ý tưởng ví dụ lấy từ sách / tài liệu khối được, nhưng **giải lại đầy đủ** theo đúng khuôn, và khác ví dụ đã nằm trong
   lý thuyết nhóm.

## Không làm trong loại việc này

Đổi cấu trúc bản đồ (thêm, chuyển, sắp xếp — mở phiên Bản đồ) · gán câu vào dạng · giải câu trong kho (Phase 3).
