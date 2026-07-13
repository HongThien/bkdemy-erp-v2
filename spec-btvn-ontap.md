# SPEC — Khối "Ôn tập" trong BTVN (spaced repetition tầng LỚP)

> Repo: bkdemy ERP v2 (Kho/tài liệu). Đọc kèm `CLAUDE.md` + `HANDOFF.md` trước khi code.
> Trạng thái: **CHỐT** các quyết định §1. Câu hỏi mở §10 — hỏi Thùy trước khi tự quyết.

---

## 0. Một câu tóm tắt

Khi **gán buổi giáo trình cho lớp** (TrichPanel), hệ gợi ý ≤2 dạng đã học từ các buổi trước mà **cả lớp** đang cần/yếu (đọc từ mastery rollup), GV liếc–sửa–xác nhận → doc BTVN sinh ra có thêm **khối "Ôn tập"** ở cuối phiếu, chấm chung luồng BTVN hiện tại. Config ôn tập sống ở bảng riêng để **sống sót re-trích**.

## 1. Quyết định đã CHỐT (Thùy, 07-13)

- **Tầng LỚP, không per-HS.** Ôn tập = chống quên cho cả lớp. Chữa yếu cá nhân = pipeline **bổ trợ yếu** (feature khác, KHÔNG thuộc spec này).
- **Cap CỐ ĐỊNH (Thùy chốt 07-13): 2 câu/phiếu, thuộc 2 dạng khác nhau (1 câu/dạng).** Shape config vẫn cho phép ≤2 câu/dạng để sau nới, nhưng UI/engine đợt này cố định 2×1.
- **Vị trí trong luồng: TrichPanel, ngay lúc gán buổi→ngày cho lớp.** KHÔNG đụng builder master (master = bản phát triển chung nhiều lớp, giữ nguyên trinh nguyên). KHÔNG mở đường edit builder cho doc vận hành.
- **GV pick, hệ gợi ý.** Auto-suggest điền sẵn, GV tick/bỏ/đổi. Full-auto để sau khi tin engine.
- **Đo lường:** câu ôn tập chấm Đ/C/S trong tab BTVN như câu BTVN thường → chảy vào nguồn `btvn` (tham khảo, toggle mastery như hiện tại). KHÔNG Elo, KHÔNG phase mới, KHÔNG đổi công thức mastery.
- **In giấy là đường chính** (cấp 1-2 cần trình bày). Online: câu ôn tập đi kèm khi phát hành BTVN online như câu thường (xem §7).

## 2. Non-goals (đừng làm)

- Không BTVN riêng per-HS (đã chốt bỏ, chuyển sang bổ trợ yếu).
- Không đụng công thức mastery, không đưa BTVN vào mastery mặc định.
- Không sửa builder master (`TaiLieuBuilder`) — chỉ THÊM ở TrichPanel + 1 modal sửa nhỏ.
- Không tự động escalation sang bổ trợ (spec bổ trợ riêng).
- Không làm cho ET / giáo trình buổi — CHỈ doc `loai='btvn'`.

## 3. Data model

### 3.1 Migration (số tiếp theo sau 0073 — kiểm tra thực tế trước)

> ⚠ **RULE SQL migration (SỬA 07-13 — bản cũ chép nhầm convention V1):** v2 ENABLE RLS TOÀN BỘ bảng + policy `la_thanh_vien()` to authenticated (verify thật qua `pg_tables.rowsecurity`: tai_lieu/tai_lieu_phan/tai_lieu_cau đều true). Bảng mới theo mẫu mig 0094–0099. Số migration tiếp theo: **0100** (không phải sau 0073 — spec gốc viết trên snapshot cũ).

**(a) Nới `tai_lieu_phan.loai_phan`:** thêm giá trị `'ontap'` vào CHECK (hiện ∈ {buoi, dang, btvn} + legacy `lt_chuyen_de`/`custom`). Soi constraint thật trong DB trước khi ALTER.

**(b) Bảng config mới `btvn_ontap_config`** (lý do: `trichXuatBuoi` là **xoá-rồi-tạo** khi re-trích — mig 0054; config sống trong `cau_hinh` của doc sẽ bay theo doc. Bài học "việc phải sống sót reload/xoá → DB, không phải state tạm"):

```
btvn_ontap_config
  id            uuid pk
  nguon_id      uuid  not null   -- tai_lieu master (giáo trình)
  nguon_buoi    ...              -- định danh buổi trong master (CÙNG KIỂU với cột đang dùng ở listTrichXuat — soi code thật)
  lop_id        uuid  not null
  config        jsonb not null   -- xem 3.2
  updated_at / updated_by
  UNIQUE (nguon_id, nguon_buoi, lop_id)
```

RLS: **enable + policy `la_thanh_vien()`** theo convention v2 (mẫu 0094–0099).
FACTS đã verify 07-13 trên repo/DB thật: `tai_lieu` ĐÃ CÓ SẴN `nguon_id uuid` + `nguon_buoi text` (doc trích tự trỏ về master+buổi → modal §8 tra config thẳng từ dòng doc); `getBTVNCaus` filter cứng `loai_phan==='btvn'` → nới thêm 'ontap' là ăn cả chấm + phát hành online; `trichXuatBuoi(masterId, buoiPhanId, opts)` khớp key config; rollup mastery per lớp tái dùng `loadMasteryCells`.
⚠ Edge case: `nguon_buoi` = id phan buổi trong master — buổi bị XOÁ-TẠO-LẠI trong builder (khác sửa) → id đổi → config mồ côi. Chấp nhận (hiếm), nhưng khi trích thấy config theo (lop, buổi) không khớp → toast báo GV cấu hình lại.

### 3.2 Shape `config` (jsonb)

```jsonc
{
  "dangs": [
    {
      "ma_dang": "D07.03",
      "cau_ids": ["uuid1", "uuid2"],      // ≤2
      "linesByCau": { "uuid1": 6 }         // số dòng kẻ, same cơ chế btvnLinesByCau
    }
  ],                                        // ≤2 phần tử
  "skipped": false                          // GV chủ động bấm "Không ôn tập buổi này"
}
```

### 3.3 Cấu trúc phan trong doc BTVN

Nhất quán với BTVN hiện tại (per-dạng): **mỗi dạng ôn tập = 1 `tai_lieu_phan(loai_phan='ontap', ref = ma_dang)`**, câu nằm ở `tai_lieu_cau` với `thu_tu` nối sau các phan `btvn`. Số dòng kẻ ghi vào `cau_hinh.btvnLinesByCau` của doc (cơ chế sẵn có, PrintView đọc được luôn không sửa).

## 4. Engine gợi ý — `src/lib/ontap.ts` (seam mới, UI không gọi supabase trực tiếp)

### 4.1 `goiYOnTap(nguonId, buoiId, lopId, mon): Promise<GoiY[]>`

**Bước 1 — Ứng viên dạng.** Dạng đã xuất hiện trong giáo trình master ở các buổi **TRƯỚC** buổi đang gán (quét `tai_lieu_phan` của master theo thứ tự buổi), **LOẠI**: dạng thuộc chính buổi đang gán (cả khối `dang` lẫn `btvn` của nó — luật cứng).

**Bước 2 — Chấm điểm nhu cầu theo LỚP.** Với mỗi dạng ứng viên, rollup mastery toàn HS đang học của lớp (tái dùng logic pivot view ④ / `getMasteryHS` gom lại — nếu đã có hàm rollup per-lớp thì dùng thẳng, đừng viết lại):

```
score = (số HS yếu × 1 + số HS cần_luyện × 0.5) / số HS đã_đo
điều kiện tin (Thùy chốt 07-13): đã_đo ≥ ⌈0.8 × sĩ_số⌉  -- 80% số bạn đã được đo dạng đó mới tính
```

Dạng chưa đủ đã_đo → KHÔNG gợi ý (GV vẫn pick tay được, xem §5).

**Bước 3 — Xếp hạng THEO CỬA SỔ THỜI GIAN (Thùy chốt 07-13 — thay hẳn tie-break cũ).** Cycle học-thi 2–2.5 tháng; trong 30 ngày HS còn nhớ. Tính `ngayHoc` của dạng = max(`ngay`) các doc `giao_trinh_buoi` CỦA LỚP có chứa dạng đó (ngày lớp học thật, không phải thứ tự master):
1. **Ưu tiên 1:** dạng lớp học **0–21 ngày** trước ngày gán.
2. **Ưu tiên 2:** dạng học **22–42 ngày** trước.
3. **>42 ngày: LOẠI** (quá xa — để chu kỳ MT/chiến dịch lo, không nhét vào ôn tập buổi).

Trong TỪNG cửa sổ: sort theo `score` yếu giảm dần ("ưu chọn dạng học sinh yếu nhiều nhất trước"). Lấy đủ 2 dạng từ Ưu tiên 1 trước, thiếu mới lấn sang Ưu tiên 2. (Tie-break tiên-quyết: bảng link chưa có trong v2 → `// TODO(tienquyet)`.)

**Bước 4 — Chọn câu (1 câu/dạng — Thùy chốt 07-13).** Pool = câu của dạng trong kho môn tương ứng, lọc:
- **Cứng:** né câu đã dùng trong CÙNG buổi này (`usedCausOfBuoi` — luật scope-buổi 07-04).
- **Mềm 1:** né câu đã xuất hiện trong bất kỳ tài liệu nào **của lớp này trong 60 ngày** (join `tai_lieu_cau` × doc `lop_id` + `ngay`) — khớp cycle học-thi 2–2.5 tháng Thùy xác nhận 07-13.
- Sort còn lại theo **least-used** (`cauUsage`/`cmpUsageLe` sẵn có).
- **ƯU TIÊN TỰ LUẬN (Thùy chốt 07-13: "BTVN dạng này gần như luôn là tự luận")** — chọn câu tự luận/TLN trước, chỉ rơi về trắc nghiệm khi dạng không còn câu tự luận nào qua được filter.

**Output:** `GoiY[] = [{ma_dang, ten_dang, score, ly_do: 'yeu_lop'|'tien_quyet', caus: [...] }]`. Lớp chưa có data đo → trả `[]` (UI hiện "Chưa đủ dữ liệu — chọn tay hoặc bỏ qua").

### 4.2 CRUD config

`getOnTapConfig(nguonId, nguonBuoi, lopId)` · `saveOnTapConfig(...)` — upsert theo unique key.

## 5. UI — TrichPanel (điểm chạm chính)

Trong `TrichPanel`, khi 1 buổi được chọn lớp + ngày để gán:

- Khối **"Ôn tập — [tên lớp]"** hiện dưới phần chọn ngày:
  - Loading: gọi `goiYOnTap` async — ⚠ chống race (reqId pattern như `SearchCau`) vì user đổi buổi/lớp nhanh; **không** để loading placeholder thay thế toàn panel (bài học scroll-reset).
  - Mỗi dạng gợi ý = 1 card: tên dạng + badge lý do (`lớp yếu 43%` / `tiên quyết buổi 12`) + 2 câu (mã + preview, badge least-used sẵn có) + nút ✎ đổi câu (**KhoPicker**, blocked = câu đã dùng cùng buổi) + nút ✕ bỏ dạng.
  - Nút **"+ Dạng"** → `DangPickerOne` (browse cả khối, GV pick tay dạng bất kỳ đã học — kể cả dạng engine không gợi ý vì thiếu data; disable khi đã đủ 2).
  - Nút **"Không ôn tập buổi này"** → `skipped: true` (phân biệt với "chưa cấu hình" — re-trích không hỏi lại).
  - Đã có config cũ (re-gán/re-trích) → load config hiển thị thay vì gợi ý mới, kèm nút "↻ Gợi ý lại".
- Bấm **Gán** → `saveOnTapConfig` TRƯỚC → rồi `trichXuatBuoi` (thứ tự này để trích luôn đọc được config).
- **Không hỏi lại bất kỳ thuộc tính nào của buổi/lớp** (giờ/phòng/GV...) — form gắn-X-vào-Y chỉ hỏi cái nó sở hữu.

## 6. `trichXuatBuoi` — mở rộng

Sau khi sinh doc "BTVN X" (giữ nguyên luồng xoá-rồi-tạo + unique `(lop_id, ngay, loai)`):

1. Đọc `btvn_ontap_config` theo `(nguon_id, nguon_buoi, lop_id)`. Không có hoặc `skipped` → xong, doc như cũ.
2. **Revalidate từng câu** trong config còn tồn tại trong kho (câu bị xoá/sửa mã): câu chết → bỏ khỏi phan, đánh dấu vào kết quả trả về để UI toast "1 câu ôn tập không còn trong kho, mở ✎ để thay".
3. Append per-dạng: `tai_lieu_phan(loai_phan='ontap')` + `tai_lieu_cau` với `thu_tu` nối tiếp sau khối btvn cuối + merge `btvnLinesByCau` vào `cau_hinh`.

Idempotent theo thiết kế sẵn (xoá-rồi-tạo) — config là nguồn sự thật, doc là derive thuần.

## 7. Render, chấm, online

### 7.1 PrintView (phiếu BTVN)

- Phan `ontap` render **cuối phiếu BTVN**, sau toàn bộ khối btvn.
- **Header khối riêng**: dải/tiêu đề "PHẦN ÔN TẬP" (nhỏ hơn dải Buổi N; style tái dùng, đủ để HS/PH phân biệt bài mới vs ôn lại).
- Trong khối: nhóm theo dạng như BTVN thường; **số câu đánh LIÊN TỤC** nối tiếp phần chính (cơ chế đếm xuyên dạng sẵn có).
- Dòng kẻ tự luận/TLN theo `btvnLinesByCau` (sẵn có) · trắc nghiệm không kẻ · bản GV = đáp án.
- Scope `btvn` + doc btvn trích xuất: giữ nguyên các gate hiện tại (bỏ cover, header "Lớp X · ngày", footer BK Academy).

### 7.2 Chấm (BtvnTab)

- `getBTVNCaus` phải trả **cả câu phan `ontap`**, xếp sau câu chính theo `thu_tu`. Kiểm tra query hiện tại có filter theo `loai_phan` không — nếu có, nới thêm `'ontap'`.
- Chấm Đ/C/S per câu như hiện tại, `phase='btvn'` (CHECK đã nới ở 0046, không cần migration thêm phía chấm).
- `closeBTVN`/EXP/trạng thái nộp/thái độ: **không đổi gì**.
- ⚠ Kiểm tra CHÉO theo bài học §658: câu ontap không tạo loại task/route mới — nó sống trong task "Chấm BTVN" sẵn có. Xác nhận `getMyTasks` không cần đụng.

### 7.3 Test online

- `phatHanhTest(btvn)` → `getBTVNCaus` đã gồm câu ontap → tự đi kèm, snapshot + lý thuyết dạng như câu thường, reveal-ngay như BTVN. **Không code riêng** — chỉ verify.
- Mastery đọc online: câu ontap là src `btvn` (toggle) — đúng luật, không sửa `mastery.ts`.

## 8. Modal "✎ Ôn tập" (sửa sau khi gán)

Ở `KhoTaiLieuScreen`, hàng doc `loai='btvn'` có config ôn tập (hoặc chưa có): nút **✎ Ôn tập** mở modal nhỏ:
- Nội dung = đúng khối UI trong TrichPanel (extract component chung `OnTapEditor` — **Method A shared component, cấm copy-paste 2 bản**, bài học ADR-017).
- Lưu = `saveOnTapConfig` + **rebuild tại chỗ**: xoá phan `ontap` cũ của doc + insert lại từ config (KHÔNG re-trích cả doc — không đụng khối BTVN gốc + tránh reset các thứ khác).
- Doc đã có bài làm online / đã chấm → **CẢNH BÁO rồi cho đổi, KHÔNG chặn cứng** (Thùy chốt 07-13 — điểm đã chấm không mất; thực tế in rồi thì hầu như không đổi).
- ⚠ **BẮT BUỘC (thêm 07-13 — spec gốc viết trước link-PDF đời 2):** sau rebuild tại chỗ phải gọi `enqueueLinkGen(docId, 'btvn')` (store) — đổi nội dung doc mà không re-enqueue thì link PDF công khai thành bản cũ vĩnh viễn. Đường trích xuất KHÔNG cần thêm gì (TrichPanel đã enqueue sau `trichXuatBuoi`).

## 9. Thứ tự build + acceptance

1. Migration (nới CHECK `loai_phan` + bảng `btvn_ontap_config`) — theo RULE SQL.
2. `src/lib/ontap.ts`: engine gợi ý + CRUD config. Verify bằng script node trên data thật (chọn 1 lớp có data đo, soi top-2 dạng có hợp lý mắt người không — kiểu verify "N.L.Bảo Ngọc" của mastery).
3. `trichXuatBuoi` append + revalidate.
4. PrintView render phan `ontap` → **soi PDF bằng mắt** (header khối, số câu liên tục, dòng kẻ, bản GV) — không tin build xanh.
5. TrichPanel UI (`OnTapEditor` component chung).
6. BtvnTab: verify câu ontap hiện + chấm được + đóng BTVN bình thường.
7. Modal ✎ ở KhoTaiLieuScreen.
8. E2E tay: gán buổi có ôn tập → in → chấm → re-trích cùng buổi → khối ôn tập TỰ DỰNG LẠI từ config → phát hành online → HS thấy đủ câu.

**Acceptance:**
- Re-trích không mất lựa chọn ôn tập của GV (config sống sót).
- Buổi không cấu hình / skipped → doc BTVN y hệt hiện tại, byte-level không khác gì (không regress lớp không dùng feature).
- Master builder không đổi 1 dòng nào.
- Câu ôn tập không trùng câu bất kỳ trong CÙNG buổi.
- Lớp chưa có data → panel vẫn dùng được (pick tay / bỏ qua), không crash, không treo loading.

## 10. Câu hỏi mở — ĐÃ CHỐT HẾT (Thùy 07-13)

1. ~~Ngưỡng tin~~ → **CHỐT: đã_đo ≥ 80% sĩ số.**
2. ~~Cửa sổ né câu 60 ngày~~ → **GIỮ 60 ngày** (khớp cycle 2–2.5 tháng). Kèm chốt LỚN hơn: chọn DẠNG theo 2 cửa sổ 0–21 / 22–42 ngày, >42 loại (xem §4.1 bước 3).
3. ~~Cân loại câu~~ → **CHỐT: ưu tiên tự luận** (gần như luôn tự luận; trắc nghiệm chỉ khi hết lựa chọn).
4. ~~Sửa khi đã có phép đo~~ → **CHỐT: cảnh báo, không chặn.**
5. ~~Số dòng kẻ mặc định~~ → **CHỐT 10 dòng** (Thùy 07-13), GV vẫn đổi được từng câu.
