# SPEC — Bản đồ Hình = CÂY NHÁNH BÀI (Chủ đề → Mô hình → Nhánh → Bài)

> **Trạng thái 14/10/2026:** CEO đã duyệt mockup + chốt 3 điểm mở (§8) (`docs/mockup-hinh-mo-hinh-2tab.html`, bấm được). **Chưa build.**
> **Phạm vi:** Hình học Toán, phần LUYỆN (`hinh_mo_hinh` / `hinh_baitoan` / `hinh_bai` / `hinh_y`). Phần Học (`hinh_hoc_*`) không đụng.
> **Quan hệ spec cũ:** file này **thay** `spec-hinh-luyen.md` §0 (bảng khái niệm) · §2.5 luật 1 phần "bài kế thừa giả thiết bài cha" · **§2.6 (cành nhỏ `hinh_mo_hinh_nhom` — RÚT LẠI, không build)**.
> Phần *kho bài nhiều ý → tách ý* (§1 phase, §3 pipeline nhập, §4 màn Kho bài/Duyệt) của `spec-hinh-luyen.md` **vẫn đúng**.
> Nguồn quyết định: sparring CEO 13/10 chiều (D5–D8) + 4 vòng chỉnh mockup 14/10 (DEVLOG 14/10).

---

## 0. Đích & khái niệm

**Một mô hình Hình = một cây.** Thân là chuỗi bài 1.1 → 1.2 → …; mỗi lần **thêm một giả thiết** thì rẽ ra một **nhánh** từ một bài mẹ; nhánh lại rẽ tiếp. Số bài cho biết bài rẽ từ đâu (1.6.1 rẽ từ 1.6; 1.6.1.1 rẽ từ 1.6.1).

| Khái niệm | Nghĩa | DB |
|---|---|---|
| **Chủ đề** | nhóm mô hình cùng chủ đề (như Đại) | `dai_bdm_chu_de` (cột `nhanh='hinh'`, đã có, 0 dòng) |
| **Mô hình (gốc cây)** | bó giả thiết gốc + hình; thân = các bài của nó | `hinh_mo_hinh` với `neo_baitoan_id IS NULL` và không có cha |
| **Nhánh** | một giả thiết THÊM, rẽ ra từ một bài mẹ; chứa chuỗi bài của nó + nhánh con | `hinh_mo_hinh` với `neo_baitoan_id` ≠ NULL, `la_mo_hinh=false` |
| **Mô hình con** | nhánh đủ lớn để "đi vào" (màn riêng, mã bài riêng) | `hinh_mo_hinh` với `la_mo_hinh=true` (20 cạnh cha–con đang có trong `hinh_mo_hinh_cha`) |
| **Bài** | lá; thuộc đúng 1 nhánh | `hinh_baitoan` (`mo_hinh_id` = nhánh chứa nó) |

**Bản chất (R7):** *rooted ordered tree*; giả thiết hiệu lực = *path-condition* từ gốc (như symbolic execution: mỗi lần rẽ thêm một điều kiện). Cây thay đồ thị DAG tiền đề cũ ở tầng hiển thị: DAG vẫn còn ở tầng tiền đề (xem §3).

**Mastery:** KP = bài (`hinh_baitoan`); rollup lên nhánh / mô hình bằng cùng một hàm nhận **tập `baitoan_id`** (spec-hinh-luyen §2.6 điều cấm 2 vẫn giữ). Gán ý → bài, lịch sử ý không đổi.

---

## 1. Dữ liệu

### 1.1 Cột thêm (không bảng mới)

```sql
alter table hinh_mo_hinh
  add column chu_de_id        text references dai_bdm_chu_de(id),      -- chỉ gốc cây; nhánh = NULL (suy từ gốc)
  add column neo_baitoan_id   uuid references hinh_baitoan(id) on delete restrict,  -- bài mẹ nơi nhánh rẽ ra; NULL = gốc cây HOẶC mô hình con kiểu cũ
  add column la_mo_hinh       boolean not null default true,           -- true = mô hình/mô hình con (đi vào được); false = nhánh inline
  add column thu_tu           int;                                      -- thứ tự anh em cùng neo

alter table hinh_baitoan
  add column thu_tu           int;                                      -- thứ tự trong làn (nhánh); NULL tạm = theo ma
```

- `la_mo_hinh` mặc định **true** để 41 mô hình đang có giữ nghĩa cũ; nhánh inline tạo mới đặt `false`.
- **Cha của nhánh KHÔNG lưu riêng** (một nguồn): `cha(nhánh) = hinh_baitoan[neo_baitoan_id].mo_hinh_id`. `hinh_mo_hinh_cha` chỉ còn dùng cho mô hình con kiểu cũ (neo NULL) — cạnh cha–con; siết **`unique(mo_hinh_id)`** (đo 14/10: 20 cạnh, 0 mô hình có 2 cha, sâu ≤ 1).
- Một mô hình thuộc **đúng một** chủ đề (D5) — bỏ khái niệm "ô".

### 1.2 Số hiển thị ≠ mã — áp LUẬT TOÀN CỤC "mã gốc bất biến" (CLAUDE.md §2, CEO 14/10)

> **Mọi đối tượng sinh ra có đúng một mã gốc, không bao giờ đổi dưới bất kỳ hoạt động nào; đó là tham chiếu gốc. Số đếm hiển thị trên bản đồ chỉ để dễ hiểu, suy ra lúc hiển thị, không bao giờ làm khoá.**
> Với cây nhánh: *rẽ nhánh, chuyển bài, đổi thứ tự, đổi bài mẹ, gập/mở, chuyển chủ đề* đều **không được** đổi mã bài / mã nhánh / mã mô hình.


| | Số hiển thị `1.6.1.1` | Mã `BT.<khối>.<mh>.<stt>` |
|---|---|---|
| Là gì | **vị trí trên cây** | định danh bất biến |
| Đổi khi chuyển bài / đổi neo | **có**, tự tính lại | **không** |
| Lưu | **không** — suy bằng `fn_hl_so_hien_thi(goc_id)` | cột `ma` |
| Dùng cho | màn, in, nói chuyện | mọi FK, lịch sử đo, gán ý |

- Luật số: thân `1.k` (k = thứ tự trong làn); nhánh rẽ từ bài có số *X* ⇒ bài thứ k của nhánh là `X.k`.
- **Mã bám MÔ HÌNH GỐC của cây, không bám nhánh** (`<mh>` = mã gốc). Hệ quả bắt buộc sửa: trigger `hinh_baitoan_gen_ma_trg` hiện chạy cả `UPDATE OF mo_hinh_id` ⇒ chuyển bài sang nhánh khác sẽ **cấp lại mã** (vi phạm bất biến). Sửa: chỉ cấp mã khi INSERT (hoặc khi `ma IS NULL`), `<mh>` lấy từ gốc cây; chuyển bài trong cùng cây không động mã. *(Chuyển bài sang cây KHÁC = ngoài phạm vi, cấm ở RPC.)*

### 1.3 Giả thiết hiệu lực — thay luật 17/08

> **Giả thiết hiệu lực của bài = `gia_thiet` mô hình gốc + `gia_thiet_them` của từng nhánh trên đường gốc → nhánh của bài + `gia_thiet_rieng` của bài.**

- **BỎ** luật 17/08 "bài kế thừa giả thiết bài cha (tiền đề chính)". Nhánh thay vai: con thấy cha, **anh em không thấy giả thiết nhau**.
- `gt_thay_the` (nhánh là đặc-biệt-hoá có tên, thay thế thay vì cộng) giữ nguyên nghĩa.
- Cập nhật `src/lib/kho/hinh.ts` (`giaThietBaiToan`, `noDapAn`) **và** `fn_hl_*`: tính ở DB (CLAUDE.md §2.0), TS chỉ gọi RPC / render.
- Giả thiết của **lá** (bài kho / ý) vẫn theo `spec-hinh-luyen.md` §2.5: lưu nguyên văn, builder hai nguồn không trộn.

---

## 2. Thao tác (RPC transactional, ghi `updated_at` cha)

| RPC | Làm gì | Ràng buộc |
|---|---|---|
| `fn_hl_re_nhanh(bai_ids[], ten, gia_thiet_them)` | tạo nhánh mới neo vào **bài đứng ngay trước bài đầu được chọn trong làn**, chuyển các bài chọn vào | cùng một làn; không chọn bài đầu làn (không có bài đứng trước để neo); giữ thứ tự |
| `fn_hl_chuyen_bai(bai_id, nhanh_id)` | chuyển bài sang nhánh khác, **xếp cuối làn** | cùng cây; **cấm vòng**: nhánh đích không được nằm trong cây con rẽ ra từ chính bài đó; nhánh con neo vào bài này đi theo bài |
| `fn_hl_doi_thu_tu(bai_id, vi_tri)` | sắp lại trong làn | — |
| `fn_hl_doi_neo(nhanh_id, bai_moi)` | dời nhánh sang bài mẹ khác | bài mới thuộc cây; không vòng |
| `fn_hl_gap…` | **không có** — gập là trạng thái hiển thị, lưu người dùng (§4.6) | — |

Mọi RPC trả danh sách `{bai_id, so_hien_thi, nhanh_id, thu_tu}` vừa đổi để client vá tại chỗ (CLAUDE.md §2 "sau mutation không reload cả danh sách").

**Xoá** nhánh / bài: theo luật xoá — liệt kê trước (bài, nhánh con, ý đã gán, lượt HS) rồi mới xoá; `on delete restrict` ở `neo_baitoan_id`.

---

## 3. Bất biến "nhánh chứa tiền đề" + cờ sai nhánh

- Tiền đề giữa bài **giữ nguyên** (builder cần): lấy từ cách giải mặc định (`hinh_cach_tien_de`).
- **Bất biến:** với mọi tiền đề *t* của bài *b*: nhánh(*b*) nằm trong **cây con của nhánh(*t*)** (hay: đường gốc→nhánh(*b*) đi qua nhánh(*t*)) — bài dùng được mọi giả thiết mà tiền đề đã dùng.
- Vi phạm ⇒ **cờ vàng "⚠ sai nhánh"** + nút "Chuyển bài sang nhánh *…*" (popup). **Không chặn lưu**; nhưng:
  - builder / in đề **từ chối** bài sai nhánh;
  - `fn_hl_sai_nhanh(goc_id)` trả danh sách để Thùy dọn.
- Cờ **nổi ở mọi mức gập** (ô gập hiện ⚠ nếu bên trong có bài sai).

---

## 4. Hiển thị — hai tab, một dữ liệu

> Mọi quy tắc dưới đây đã chạy trong mockup; số liệu kiểm: mẫu 15 bài, **0 thẻ chồng nhau**.

### 4.1 Thẻ

| Thẻ | Hình | Nội dung tối giản |
|---|---|---|
| **Bài** | trắng, bo góc, viền theo màu nhánh | số hiển thị + tên rút gọn **1 dòng**; cờ ⚠; ô tick (để rẽ nhánh) |
| **Giả thiết thêm** (khởi tạo nhánh) | **lục giác màu đặc** (xanh / tím / cam theo nhánh) — khác hẳn thẻ bài | tên nhánh + "+ giả thiết · rẽ từ x.y"; bấm = gập/mở |
| **Mô hình con** | viền đứt xanh lá | tên + mã; bấm = đi vào (màn riêng cùng khuôn 2 tab) |
| **Ô gập** | viền chấm | "▸ N bài" + ⚠ nếu có |

**Popup (bấm thẻ bài)**: đề · đáp án · lời giải · **hình** (vẽ theo giả thiết hiệu lực: hình gốc + từng nhánh trên đường) · giả thiết hiệu lực (gốc → nhánh → riêng) · tiền đề (bấm nhảy) · cờ sai nhánh + nút chuyển. Hình bản thật = `anh_de` của bài/ý, resolve như `fn_hl_bai_full` (ý ∨ ý trước ∨ bài).

### 4.2 Tab ① CHUỖI — thuật toán xếp chỗ (thuần hiển thị, chạy ở client)

**Chỉ hai hướng đi: XUỐNG và SANG PHẢI. Không bao giờ vòng sang trái, không rẽ lên trên.**

- **Thân:** một hàng (hàng 0), bài nối nhau từ trái sang phải; mô hình con ở cuối hàng. Thân **không bao giờ bị đẩy**.
- **Nhánh = một HÀNG NGANG:** thẻ giả thiết thêm ở **cột của bài mẹ**, rồi các bài của nhánh chạy sang phải.
- **Ưu tiên 1 — càng ở phía sau càng gần hàng 1.** Trong cùng độ sâu, xếp từ nhánh có bài mẹ **xa bên phải nhất** trước; nó lấy hàng nhỏ nhất còn trống.
- **Ưu tiên 2 — nhánh phía trước không đè nhánh phía sau.** Nhánh sớm hơn vướng thì **lùi xuống hàng dưới**; dây đi thẳng xuống qua các ô trống (hành lang được giữ chỗ).
- **Hành lang thẳng xuống bị chặn** thì dời cả hàng sang phải 1…8 cột (dây: xuống → rẽ phải → xuống).
- Xếp theo **độ sâu** (nhánh nông trước), nhánh con luôn ở hàng > hàng của bài mẹ.

```text
cho mỗi nhánh n theo (depth tăng, cột bài mẹ GIẢM, hàng bài mẹ GIẢM):
  a = ô của bài mẹ;  len = 1 (thẻ giả thiết) + số bài (hoặc 1 nếu đang gập)
  với dc = 0..8:                                  # ưu tiên đi thẳng xuống
    với r = a.hàng+1 ...:
      nếu hành lang (a.cột+dc, a.hàng+1 .. r-1) có ô bị chiếm: break      # thử cột kế
      nếu ô (a.cột+dc .. +len-1, r) đều trống: đặt tại (a.cột+dc, r); xong
  giữ chỗ cả hành lang + các ô vừa đặt
```

Ví dụ chuẩn (đã kiểm): 1.7 → hàng 1 (⑂, 1.7.1, 1.7.2) · 1.6 vướng 1.7.1 ⇒ **hàng 2** (⑂, 1.6.1, 1.6.2) · 1.6.2.x **hàng 3** · 1.6.1.x **hàng 4**.

### 4.3 Dải màu & dây

- Mỗi nhánh một **dải nền nhạt** cùng tông thẻ giả thiết (nhìn là biết bài thuộc nhánh nào dù nhánh nhảy sang phải).
- Dây **chuỗi** xám; dây **rẽ nhánh** đậm, vuông góc.
- Dây **tiền đề** xuyên làn: **mặc định không vẽ**; chỉ vẽ cho bài đang chọn (xanh) và dây sai nhánh (đỏ đứt). Danh sách tiền đề luôn có trong popup.

### 4.4 Gập / mở

- Bấm thẻ giả thiết thêm ⇒ cả nhánh (kể cả nhánh con) gập thành "▸ N bài"; nhánh khác được dùng chỗ trống.
- **Không có ngưỡng tự gập** (CEO 14/10): hệ thống không bao giờ tự gập; **người dùng tự quyết** gập hay mở. Mặc định mở hết. Trạng thái gập **nhớ theo người dùng** (không phải dữ liệu mô hình).

### 4.5 Tập trung

Chọn một bài ⇒ phần ngoài *đường gốc → bài* và *cây con của nhánh bài* **mờ đi** (không ẩn, không dịch chỗ). Bật/tắt được.

### 4.6 Tab ② NHÓM

Card lồng nhau theo cây nhánh. Card đầu mỗi nhánh = "bài trực tiếp của nhánh" (không có NULL). Mỗi dòng bài: số · tên · cờ · select **Chuyển nhánh** (vá tại chỗ). Dòng giả thiết thêm dùng cùng màu đặc của thẻ lục giác. Tab này luôn có sẵn như một cách nhìn khác; không có ngưỡng tự chuyển.

### 4.7 Giữ trạng thái màn

Theo CLAUDE.md §2: nhớ module-level **bộ lọc + cây đã vá + scrollTop + nhánh đang gập + bài đang chọn**; mutation vá đúng phần tử, không `setRows([])`.

---

## 5. Tương thích với dữ liệu đang có

| Hiện trạng (14/10) | Xử lý |
|---|---|
| 41 mô hình · 366 `hinh_baitoan` (K7 153 / K8 107 / K9 106) | mô hình giữ `la_mo_hinh=true`; `chu_de_id` do CEO gán (B0.5 màn Dọn thêm cột chọn chủ đề) |
| 20 cạnh `hinh_mo_hinh_cha`, 0 mô hình 2 cha, sâu ≤ 1 | giữ làm "mô hình con kiểu cũ" (neo NULL, hiện ở cuối thân cha); siết `unique(mo_hinh_id)` |
| Bài đang kế thừa giả thiết bài cha (luật 17/08) | **phải đo trước khi bỏ luật**: bài nào có `gia_thiet` cha dùng mà nhánh không chứa ⇒ chuyển hoá thành `gia_thiet_rieng` hoặc tạo nhánh; script `scripts/_hl_do_ke_thua.mjs` liệt kê — **không tự ghi** |
| `phan` = luyen/hoc (B0.5) | giữ; chỉ cây `phan='luyen'` hiện ở Hình luyện |
| Mã `BT.k.mh.stt` | không đổi; trigger sửa như §1.2 |

---

## 6. Thứ tự build

| # | Việc | Xong khi |
|---|---|---|
| **C0** ✅ 14/10 | `scripts/_hl_do_ke_thua.mjs` (đo, chỉ đọc) → `reports/hl-c0-ke-thua-17-08.md`: **120/366 bài** đổi giả thiết, 34 đổi hình khi bỏ luật 17/08 | CEO duyệt cách chuyển hoá (§5) |
| **C1** ✅ 14/10 (mig `202610140048` ĐÃ ÁP, test 15/15, `scripts/_test_hl_cay_nhanh_c1.mjs`) | Migration: 4 cột §1.1 + `unique(mo_hinh_id)` ở `hinh_mo_hinh_cha` + sửa trigger mã (§1.2) + `fn_hl_so_hien_thi` + `fn_hl_sai_nhanh` + `fn_hl_gia_thiet_hieu_luc` | `npm run schema` sạch; test ROLLBACK: chuyển bài giữ mã, số đổi; bài sai nhánh bị báo |
| **C2** ✅ 14/10 (mig `202610140054` ĐÃ ÁP, test 18/18) | RPC §2 (`re_nhanh`, `chuyen_bai`, `doi_thu_tu`, `doi_neo`) + test vòng | test: chuyển vào cây con của chính nó bị từ chối |
| **C3** | `giaThietBaiToan` / `noDapAn` đọc `fn_hl_gia_thiet_hieu_luc`; builder từ chối bài sai nhánh | in 1 đề có bài sai nhánh ⇒ bị chặn, có lý do |
| **C4** 🟡 14/10 (màn `CayNhanh.tsx` dựng xong, ĐỌC đã kiểm bằng phiên đăng nhập thật; GHI chưa bấm thử trên dữ liệu thật) | Tab ① Chuỗi (thuật toán §4.2) + Tab ② Nhóm + popup, nối RPC thật | mở mô hình thật K7: 0 thẻ chồng, số khớp mockup |
| **C5** | Màn Dọn: chọn chủ đề cho mô hình gốc; chủ đề `nhanh='hinh'` hiện ở bản đồ | 41 mô hình có chủ đề |

*Kiểm UI bằng phiên đăng nhập thật* (RLS + giới hạn 8 giây của script không thấy) — CLAUDE.md §0 bài học troly.

---

## 7. Không làm đợt này

- Rẽ lên trên / vòng sang trái (đã cấm; không gian dưới luôn thừa).
- Tự đề xuất cây từ lá (AI gom ý → nhánh); chỉ "máy gợi, người quyết".
- Kéo-thả sắp xếp trực tiếp trên Tab ① (P1 dùng RPC + select ở Tab ②).
- Chuyển bài giữa hai cây khác nhau (đổi mã) — chưa có nhu cầu.
- Bảng `hinh_mo_hinh_nhom` (cành nhỏ) — **rút**, nhánh đã thay.

## 8. Còn mở (CTO sẽ không tự quyết)

1. ~~Bài đứng ở "bên trái 1.7.1"?~~ ✅ **CEO 14/10: bên PHẢI.** Chỉ hai hướng xuống · sang phải.
2. ~~Số hiển thị khi bài chen giữa~~ ✅ **CEO 14/10: OK** — số suy ra, đổi tự do; **mã gốc không đổi** (luật toàn cục ở §1.2).
3. ~~Ngưỡng gập / ngưỡng 40 bài~~ ✅ **CEO 14/10: không cần ngưỡng** — người dùng tự gập, không có chế độ tự chuyển tab.
4. Hình popup: bản thật cần `anh_de` đã vẽ lại (xong 13/10 cho 330 + 209 + 39 hình); bài chưa có hình hiện khung "chưa có hình" — không chặn.

## 9. Đứng trên vai ai (R7)

*Rooted ordered tree* + *path-condition* (symbolic execution) cho giả thiết hiệu lực; *Reingold–Tilford* / tidy-tree layout cho "mỗi nhánh một hàng, nhánh con bậc dần"; *testlet* (Wainer & Kiely) cho bài nhiều ý — đã nêu ở spec-hinh-luyen §0.

---

## 10. Ba khuôn của Bản đồ kiến thức Toán (CEO chốt 14/10 tối)

Chọn vùng nào thì **toàn bộ UI đổi theo vùng đó** — dispatch qua MỘT bảng đăng ký "vùng → khuôn màn", không rải `if`.

| Vùng | Cấu trúc | Đo (KP) ở | Bảng | Ghi chú |
|---|---|---|---|---|
| **Đại · Giải tích** | chủ đề → chuyên đề → nhóm → dạng | nhóm / dạng | `dai_bdm_*` | hai vùng cùng một logic |
| **Hình – Học** | (chương) → **bài học** → bài tập — **3 tầng** | **bài học** | `hinh_hoc_bai` · `hinh_hoc_cum_bai` · `hinh_hoc_cau_hoi` (bảng RIÊNG, đã có) | logic đơn giản nhất; "giống Đại" chỉ là cách nói. KHÔNG có mô hình |
| **Hình – Luyện** | chủ đề → mô hình → nhánh → bài; ý của bài kho gán vào bài | bài mô hình | `hinh_mo_hinh` · `hinh_baitoan` · `hinh_bai` · `hinh_y` | spec này §0–§9 |

**Quyết định:**
1. **Hình–Học đo ở BÀI HỌC, không đo ở bài tập** — bài tập hình gần như duy nhất, đánh giá ở mức bài tập không có nghĩa. (Đúng hiện trạng: `hinh_hoc_bai.ma_dang = ma_bai`.)
2. **Đơn vị là BÀI HỌC (kiến thức), không phải BUỔI (vận hành).** Buổi nào dạy bài nào là việc của giáo trình.
3. **Hình–Học là bảng riêng, 3 tầng** — không ép vào 4 tầng `dai_bdm_*`, không tầng chuyên đề giả (CLAUDE.md §1.6).
4. **Bài tập phần Học và phần Luyện ĐỘC LẬP** ("học là học, luyện là luyện"). ⇒ KHÔNG làm dây "bài Luyện cần bài học nào"; KHÔNG kéo câu Học sang Luyện; kho Luyện (`hinh_bai`/`hinh_y`) nhập riêng từ đề thi. Hệ quả: 291 câu Học đang mang `mo_hinh_id` là nhãn mồ côi — không dùng, không xoá (chờ CEO nếu muốn dọn).

**Vì sao tách (R7):** *blocked practice* (học theo khối — bài tập xoay quanh một bài) vs *interleaved practice* (thi tổng hợp) — Rohrer & Taylor.

**Việc kéo theo (chưa làm):** nới CHECK `dai_bdm_chu_de.nhanh` `hinh` → `hinh_hoc` · `hinh_luyen` (kèm migration) · bảng đăng ký vùng → khuôn màn trong Bản đồ mới · màn Hình–Học tái dùng `KhoHinhHocScreen`.

5. **Thang đo Hình = 3 bài, không phải 5** (CEO 14/10: "số bài tập hình làm được thấp hơn Đại nhiều"). Áp cho CẢ Hình–Học (đo ở bài học) lẫn Hình–Luyện (đo ở bài mô hình); độ tin scale theo: cao ≥ 3 lần, trung bình 2, thấp 1. Đại / Hình giải tích giữ 5 (tin 5/3). Ngưỡng đạt 0,8 / cần luyện 0,5 và trọng số nguồn không đổi.
   - Hình–Luyện: đã 3 từ 21/08 (`fn_mastery_cells_hinh`). Hình–Học: **mig `202610140130`** — `fn_mastery_cells` dùng cửa sổ 3 cho dạng thuộc `hinh_hoc_bai`.
   - Bản JS (`gami/mastery.js` `cfgMastery`) lấy cờ `thangDo3` từ registry nhánh (`NHANH_CUA_MON`), không đoán theo tiền tố mã.

---

## 11. Luồng làm lại từ đầu (CEO chốt 14/10 khuya)

1. **Claude đẩy bài có đáp án chi tiết vào kho Luyện** (`hinh_bai` + `hinh_y`), tách ý thành chuỗi đủ thông tin. **Nguồn: kho đề thi trên ERP, khối 7 trước.**
2. **CEO dựng mô hình TRƯỚC** trên màn Cây nhánh: tạo mô hình → thêm bài vào thân → rẽ nhóm. Không cần nhãn gom tạm cho bài kho.
3. **Xây tới đâu gán tới đó:** gán **cả bài kho vào MÔ HÌNH** — vậy là đủ để bài vào kho của mô hình (CEO 14/10: "thêm bài vào kho mô hình chỉ cần mô hình thôi"). Gán từng ý vào một bài cụ thể của mô hình **không** phải điều kiện vào kho.
   - "Chưa phân mô hình" (Duyệt kho) = bài chưa có `hinh_bai.mo_hinh_id` và không ý nào đã gán bài mô hình (mig `202610141248`).
   - Kho của mô hình = **tab ③ Kho bài** trên màn Cây nhánh, mỗi chuỗi (bài kho, ý a → b → c) một dòng (mig `202610141242`).

- **41 mô hình + 366 bài cũ: ẨN làm tham khảo, không dùng**; xoá hay không quyết sau khi làm xong. Cách ẩn: màn Cây nhánh chỉ đọc `phan = 'luyen'`; mô hình cũ đang `phan IS NULL` nên tự ẩn — **không sửa, không xoá dòng nào**. KHÔNG ẩn ở `loadLuoi` vì 507 lượt làm bài (`gami_session_problems`) và các tài liệu MT/ET cũ vẫn phải hiện được bài cũ.
- **Tạo/sửa trên màn (mig `202610140141`):** `fn_hl_tao_mo_hinh` (sinh `phan='luyen'`) · `fn_hl_them_bai` · `fn_hl_sua_bai` (bài + cách giải mặc định + tiền đề trong 1 transaction; tiền đề phải cùng cây; mã không đổi).
- **Hiện trạng nguồn (đo 14/10):** kho đề thi **khối 7 chỉ có 2 đề cương** (Ngôi Sao Hoàng Mai, Tây Mỗ) = **31 câu Hình**, đều có lời giải, đã gom 14 nhóm bài. Khối 6: 46 đề · khối 8: 42 · khối 9: 75. Câu Hình của đề thi hiện nằm ở kho Hình–Học (`hinh_hoc_cau_hoi`) ⇒ bước 1 là **chép sang kho Luyện thành bài + ý mới** (Học/Luyện độc lập, §10.4), không dời dòng cũ.

6. **Lối vào: sau này CHỈ CÒN Bản đồ mới** (CEO 14/10). Lối cũ Kho › Hình học (nút Học | Luyện, rail Sơ đồ/Dọn/Kho tạm…) **giữ chạy song song cho tới khi Bản đồ mới ổn định**, rồi mới chuyển hẳn — chưa gỡ gì bây giờ. Tính năng Hình mới chỉ thêm ở Bản đồ mới; lối cũ không phát triển thêm.

### 11.1 Bước 1 đã chạy cho LỚP 8 (14/10)

- **Nguồn:** 42 đề thi khối 8 trong kho đề thi = 238 câu Hình (149 trắc nghiệm · 76 tự luận · 12 trả lời ngắn · 1 trùng), 100% có lời giải.
- **Đã chép sang kho Luyện:** **88 bài (`hinh_bai`) · 223 ý (`hinh_y`)** — chỉ tự luận + trả lời ngắn. 67 bài nhiều ý (202 ý: 14 bài 2 ý · 40 bài 3 ý · 12 bài 4 ý · 1 bài 6 ý) · 19 bài một ý · **2 bài `can_tach_tay`** (câu Đúng/Sai nhiều mệnh đề, để nguyên 1 ý). Câu gốc ở kho Hình–Học KHÔNG bị đụng.
- **Trắc nghiệm (149 câu) CHƯA lấy** — chờ CEO: có đưa câu trắc nghiệm 1 ý vào kho Luyện không.
- **Công cụ:** `scripts/hinh-luyen/nhap_tu_de_thi.mjs --khoi <k>` (khô) · `--thu` (ghi rồi rollback) · `--ghi`. Chạy lại không nhập trùng (khoá `hinh_bai.nguon_ma_cau`). Biên bản tách: `scripts/hinh-luyen/nhap/k8-de-thi.json`.
- **Luật tách (máy chỉ làm phần chắc):** mốc ý `a) b) c)` hoặc `1) 2) 3)` nối tiếp · trước mốc đầu = giả thiết chung · câu dẫn kết thúc bằng ":" chép vào đầu từng ý · "Phần 1. Hướng dẫn" → `hinh_bai.huong_dan` · "Phần 2. Trình bày" tách theo cùng mốc → `hinh_y.loi_giai` · số ý đề ≠ số đoạn lời giải hoặc câu Đúng/Sai ⇒ không tách, gắn cờ. **Chưa làm:** `gia_thiet_them` của ý để trống (ranh giới "dữ kiện mới" ↔ "câu hỏi" cần người); ý lồng (2a, 2b) nằm chung trong ý 2; hình đề chỉ 9/88 bài có (đề gốc không kèm hình), hình lời giải 78/88.
- **Mô hình:** chưa gán ý nào (khối 8 chưa có mô hình luyện) ⇒ cả 223 ý ở **Duyệt kho › "Hình luyện · chưa phân mô hình"** (mig `202610140230`: `fn_hl_kho_chua_phan` · `fn_hl_dem_chua_phan` · `fn_hl_bai_mo_hinh_luyen` · `fn_hl_gan_y` — chỉ gán được vào bài của mô hình `phan='luyen'`). CEO gán tay, hoặc dựng mô hình rồi bảo Claude duyệt lại.
