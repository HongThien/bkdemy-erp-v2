# SPEC — Cụm bài + Tiền đề (Đại + KHTN)

> **Phạm vi:** tầng dưới của Dạng trong Kho — nhóm các bài **thay thế được cho nhau**, và quan hệ
> **thứ tự học** giữa các node (tiền đề). Áp cho **2 nhánh: Đại (`dai_*`) và KHTN (`khtn_*`)** — cùng shape.
> **KHÔNG bao gồm:** Hình (`hinh_*` có mô hình/bổ đề riêng, đã có "họ mô hình" của nó) · Hình-giải-tích
> (`hgt_*` — cùng shape, thêm sau khi cần, hiện 0 câu lẻ nên không gấp).
> **Duyệt:** Thùy (13/08/2026). Tên gọi **"Cụm bài"** do CEO chốt.

---

## 0. Vấn đề đang sửa

Kho có **2 luồng vào**: ① clone biến thể từ 1 bài gốc · ② nhập tài liệu ngoài (từng bài rời).

Hôm nay khái niệm "họ" **không có object riêng** — nó được *suy* ra từ `parent_ma_cau ?? ma_cau`
(2 chỗ: [`made.ts:29`](src/lib/made.ts) `rootOf`, [`tailieu.ts:218`](src/lib/tailieu.ts) `nguonCuaCau`).
Hệ quả:

- Bài nhập lẻ (không clone) → mỗi bài tự thành một "họ" một-phần-tử. **Không sai về mặt dữ liệu**
  (chưa ai xác nhận nó tương đương bài nào), nhưng **thiếu chỗ để cất lời xác nhận đó** — không có
  thao tác gộp, không có nơi đặt tên, không có gì để trỏ tiền đề vào.
- **2 câu gốc tương đương nhau vẫn bị coi là 2 họ khác nhau** ⇒ mã đề không dám hoán đổi chúng, và
  tài liệu có thể lấy cả hai vào cùng một đề mà hệ không thấy đó là lặp nội dung.

**Số liệu thật lúc viết spec (13/08/2026):**

| bảng | tổng câu | clone | "họ" hiện tại | câu lẻ (họ 1 phần tử) |
|---|---:|---:|---:|---:|
| `dai_cau_hoi` | 12.161 | 9.592 | 2.857 | **1.587** (rải trong 123/325 dạng; dạng nặng nhất 120) |
| `khtn_cau_hoi` | 257 | 26 | 234 | **224** |
| `hgt_cau_hoi` | 101 | 95 | 6 | 0 |

---

## 1. Định nghĩa (chốt nghĩa trước khi code)

**Cụm bài** = lớp **tương đương** trong một Dạng: các bài trong cùng cụm được coi **thay thế được cho
nhau** ở các mã đề khác nhau, và **tính là một** khi chống lặp nội dung trong tài liệu.

Ba điều bắt buộc nhớ:

1. **Một cụm chứa được NHIỀU câu gốc.** Cụm ≠ chuỗi gốc-clone. Cụm A có thể gồm gốc A (+5 clone)
   **và** gốc B (+5 clone) sau khi người gộp lại.
2. **Gốc/clone là trục KHÁC, không bị thay thế.** `nguon` / `parent_ma_cau` / `nguon_giai` = *nguồn gốc*
   (ai đẻ ra, lời giải người hay AI, đã duyệt chưa). `ma_cum` = *tương đương*. Hai cột sống song song,
   **không cột nào thay cột nào**. Cấm dùng `parent_ma_cau` để biểu diễn "cùng cụm" — đó là nói dối về nguồn gốc.
3. **Công bằng trong cụm do team học thuật chịu** (CEO chốt). Hệ **không** phân hạng "cụm chặt / cụm gom tay",
   **không** cắm cờ cảnh báo ở mã đề. Ràng buộc máy giữ đúng một cái: **cụm thuộc đúng 1 dạng**.

**Tiền đề** = quan hệ **thứ tự học** (`A là tiền đề của B` ⇒ học A trước B). Có ở **2 tầng**:
- **Dạng ↔ Dạng** — dùng cho chẩn đoán (yếu dạng X vì hổng nền dạng Y) và sắp thứ tự giáo trình.
- **Cụm ↔ Cụm** — các "góc nhìn khác nhau của một dạng" (CEO), có góc phải dạy trước góc khác.

> ⚠ **RANH GIỚI BẤT DI DỊCH:** **KP đo mastery vẫn là DẠNG.** Tiền đề tầng cụm chỉ phục vụ *thứ tự dạy*
> và *builder tài liệu* — **cấm** đưa vào công thức mastery. Nếu để tiền đề-cụm chui vào đo, `mastery(dạng)`
> trở thành số trộn của nhiều trình độ khác nhau (đúng cái v2 sinh ra để tránh).

**Tên gọi — vì sao "Cụm" chứ không "Họ":** nhánh Hình đã dùng "họ mô hình" với nghĩa **ngược lại**
(cụm mô hình nối nhau bằng chính quan hệ tiền đề — `hinh_mo_hinh.la_goc_ho`, `Ho.tsx`, `SoDo.tsx`).
Bên Hình "họ" = quan hệ **thứ tự**; bên Đại nghĩa cần dùng là quan hệ **thay thế**. Trùng chữ, ngược nghĩa
⇒ đổi tên bên Đại/KHTN thành **Cụm bài**, nhánh Hình **giữ nguyên, không sửa một dòng nào**.

*(Thế giới gọi cụm này là **item family / isomorphs** trong AIG — Gierl; đồ thị tiền đề là
**prerequisite DAG** trong knowledge space theory — Doignon–Falmagne, ALEKS chạy đúng nó.)*

---

## 2. Schema

Prefix mã: Đại `DCUM…`, KHTN `KCUM…` (nhìn mã biết ngay nhánh nào, giống `DG`/`DC` vs `KG`/`KC`).

```sql
-- ── CỤM BÀI ──
create sequence dai_cum_seq;

create table dai_cum_bai (
  ma_cum      text primary key default 'DCUM' || lpad(nextval('dai_cum_seq')::text, 5, '0'),
  ma_dang     text not null references dai_ban_do(ma_dang) on delete cascade,
  ten         text,                    -- NULL = chưa đặt tên → UI hiển thị "Cụm {thu_tu}"
  thu_tu      smallint not null default 1,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
create index on dai_cum_bai (ma_dang);

alter table dai_cau_hoi add column ma_cum text references dai_cum_bai(ma_cum) on delete set null;
create index on dai_cau_hoi (ma_cum);
```

**`ma_cum` NULLABLE — có chủ ý, và đây là quyết định quan trọng nhất của spec.**
NULL = **"chưa ai phân cụm"**, KHÔNG phải "cụm rỗng". 1.587 câu lẻ hiện có **không phải 1.587 cụm** —
chúng là *việc tồn đọng*. Backfill đẻ cụm giả cho chúng = ghi 1.587 lời khẳng định bịa vào DB, và mất
luôn cách phân biệt "cụm thật có 1 bài" với "chưa gom".
Đúng tiền lệ `ma_loi` ở CLAUDE.md §1.5: *nhãn phân loại chưa chắc thì để trống, đừng đánh bừa*.

- **`ten` cũng để NULL khi backfill** — tên cụm là **người đặt** (CEO), hệ không bịa. UI suy `Cụm {thu_tu}`.
- **`on delete set null`**: xoá cụm ⇒ câu **về rổ chưa phân cụm**, không mất câu. (Luật xoá: xoá cụm phải
  hiện trước "cụm này đang chứa N câu, xoá xong N câu về rổ chưa phân cụm".)
- **`on delete cascade` từ dạng**: đã có luật cấm xoá dạng còn câu treo ⇒ đường này gần như không chạy.

```sql
-- ── TIỀN ĐỀ — 2 tầng, mỗi tầng 1 bảng cạnh ──
create table dai_dang_tien_de (
  ma_dang      text not null references dai_ban_do(ma_dang) on delete cascade,
  tien_de_ma_dang text not null references dai_ban_do(ma_dang) on delete cascade,
  primary key (ma_dang, tien_de_ma_dang),
  check (ma_dang <> tien_de_ma_dang)          -- chặn tự-trỏ; chu trình dài hơn chặn ở app (§4)
);
create index on dai_dang_tien_de (tien_de_ma_dang);

create table dai_cum_tien_de (
  ma_cum         text not null references dai_cum_bai(ma_cum) on delete cascade,
  tien_de_ma_cum text not null references dai_cum_bai(ma_cum) on delete cascade,
  primary key (ma_cum, tien_de_ma_cum),
  check (ma_cum <> tien_de_ma_cum)
);
create index on dai_cum_tien_de (tien_de_ma_cum);
```

KHTN: **y hệt**, đổi `dai_` → `khtn_`, prefix `KCUM`, seq `khtn_cum_seq`. Bảng riêng theo §1.6
(mỗi môn = 1 bounded context, không gộp).

RLS: bật, policy `for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())` —
copy nguyên mẫu `dai_cau_hoi_member_all` đang chạy.

### Hàm bao đóng (soi gương nhánh Hình)

Mỗi bảng cạnh 2 hàm, mảng `duong` chống lặp vô hạn — **copy đúng shape** của
`hinh_mo_hinh_hau_due` / `hinh_mo_hinh_to_tien` ([`202607241923_kho_hinh_v3_derive.sql`](supabase/migrations/202607241923_kho_hinh_v3_derive.sql)):

- `dai_dang_tien_de_bao_dong(goc text)` → tổ tiên (mọi dạng phải học trước), `do_sau` = số bước lùi tối thiểu ⇒ **sắp topo**.
- `dai_dang_hau_due(goc text)` → mọi dạng phụ thuộc vào nó ⇒ **chặn chu trình lúc nối** (§4) + "học xong mở khoá gì".
- `dai_cum_tien_de_bao_dong(goc text)` / `dai_cum_hau_due(goc text)` — tương tự cho tầng cụm.
- ×2 cho KHTN ⇒ **8 hàm**. Lặp SQL nhưng tường minh, không dynamic SQL (dynamic + RLS = bẫy).

---

## 3. KHÔNG backfill — cụm là thủ công 100%

**Chốt (Thùy 14/08):** *cụm là thủ công — người tạo cụm, đặt tên, rồi mới gán bài vào.* Hệ **không**
tự sinh cụm nào, kể cả từ các chuỗi gốc-clone.

Migration đầu (`202608131918`) có backfill 1.279 cụm Đại + 10 KHTN từ chuỗi clone; đã **gỡ sạch** bằng
`202608141314_go_backfill_cum.sql`. Hai lý do:

1. **Sai nguyên tắc.** Hệ tự khẳng định "đây là một cụm" thay cho người — đúng cái §2 cấm khi nói về
   câu lẻ, rồi vi phạm ngay với chuỗi clone.
2. **Thừa.** Lý do duy nhất để backfill là giữ hành vi mã đề — nhưng khoá tiêu thụ là
   `ma_cum ?? parent_ma_cau ?? ma_cau`, **tầng `parent_ma_cau` ở giữa đã tự giữ nguyên hành vi cũ**.
   Cụm rỗng hoàn toàn thì `cumKey` rơi xuống đúng chuỗi gốc-clone như trước khi có tính năng.

⇒ Trạng thái xuất phát: **0 cụm ở mọi dạng, mọi câu nằm ở tab "Chưa phân cụm"**, mã đề + tài liệu chạy
y hệt trước migration. Hành vi chỉ đổi từ bài gốc đầu tiên mà người gom vào chung một cụm (§5).

---

## 4. Chặn chu trình

Tiền đề là **DAG**. `check (a <> b)` chỉ chặn tự-trỏ; vòng dài hơn (A→B→C→A) chặn ở tầng app **trước khi
insert**, giống hình đang làm: gọi `*_hau_due(node_đang_sửa)` → nếu tiền đề định thêm nằm trong tập hậu duệ
⇒ **từ chối + báo đường đi** ("thêm cái này tạo vòng: A → B → C → A").
Hàm recursive đã có mảng `duong` nên **kể cả lỡ có vòng trong DB, query vẫn không treo** — sai nhưng không chết.

---

## 5. Đổi khoá ở tầng tiêu thụ — 2 dòng

| chỗ | trước | sau |
|---|---|---|
| [`made.ts:29`](src/lib/made.ts) `rootOf` | `c.parent_ma_cau ?? c.ma_cau` | `c.ma_cum ?? c.ma_cau` |
| [`tailieu.ts:218`](src/lib/tailieu.ts) `nguonCuaCau` | `c.parent_ma_cau ?? c.ma_cau` | `c.ma_cum ?? c.ma_cau` |

Fallback `?? c.ma_cau` là thứ giữ cho câu **chưa phân cụm** hoạt động y hệt hôm nay (tự là cụm của chính nó).

**Bất biến mã đề phải viết lại** — comment hiện ở [`made.ts:12`](src/lib/made.ts) ghi *"mọi câu ở mọi mã đề
của 1 vị trí phải cùng `parent_ma_cau`"*. Sau spec này nghĩa đúng là **cùng `ma_cum`**. Để nguyên comment cũ
= để lại một lời nói dối trong code.

**Hai thay đổi hành vi có chủ ý, xuất hiện ngay khi gộp cụm đầu tiên:**
- *Mã đề (lợi):* cụm chỉ có gốc + 1 clone hiện phải **dùng lại chính nó** cho đề 2/3 (nhánh `dup`,
  [`made.ts:44`](src/lib/made.ts)). Gộp cụm xong là có câu thật để rút → hết trùng.
- *Tài liệu (lợi):* `pickRoundRobinByNguon` xoay vòng theo cụm ⇒ 2 gốc tương đương **không còn lọt chung
  một đề**. Đánh đổi: dạng ít cụm thì câu thứ 4–6 sẽ cùng cụm với 1–3 — code tự quay vòng, không vỡ, và
  đó là **sự thật đúng**: dạng đó thật sự chỉ có ngần ấy bài khác nhau.

---

## 6. UI

### 6.1 Trong màn Dạng (`DangHub`) — thay bộ lọc "Câu gốc" hiện tại

Bộ lọc `Tất cả | Câu gốc` đổi thành **3 tab**:

**① Tab "Cụm bài"** (mặc định) — mỗi cụm 1 card:
- Đầu card: tên cụm (`ten ?? "Cụm {thu_tu}"`, bấm sửa tại chỗ) · số bài · **＋ Thêm bài** · 🔗 Tiền đề ·
  ⤵ Gộp · Xoá cụm.
- Thân card: **liệt kê MỌI câu gốc trong cụm** (không phải 1 gốc làm mặt — cụm có nhiều gốc), mỗi dòng
  kèm dropdown chuyển cụm + nút **Gỡ**.
- Toggle **`Hiện cả biến thể clone`**: mặc định chỉ gốc; bật thì clone hiện lồng dưới gốc của nó (kèm
  badge 🤖 AI giải để còn duyệt).
- Nút **＋ Cụm mới** tạo **cụm RỖNG + đặt tên trước**, gán bài vào sau.

**② Tab "Chưa phân cụm"** (CEO yêu cầu tab riêng, không nhét cuối trang) — hàng đợi việc chính:
mỗi dòng có checkbox + **dropdown "gán vào cụm"**; chọn nhiều → *Gom thành cụm mới* / *Thêm N bài vào cụm ▾*.

**③ Tab "Toàn bộ kho"** — danh sách phẳng như hiện nay (gốc + clone), không đổi.

### 6.2 Gán 2 CHIỀU (CEO chốt) — gom tay, không AI gợi ý

Cùng đổ về một hàm `ganCumBai`, khác chỗ bắt đầu:

| chiều | đường đi |
|---|---|
| **BÀI → CỤM** | dropdown "gán vào cụm" ngay trên từng dòng (tab Chưa phân cụm & trong card cụm) |
| **CỤM → BÀI** | nút **＋ Thêm bài** trên card cụm → modal picker (có ô tìm) chọn nhiều bài từ hàng đợi |

- **Gộp 2 cụm** → chọn cụm đích, giữ tên cụm đích, mọi câu (gốc + clone) chuyển sang.
- **Gỡ câu khỏi cụm** → về tab Chưa phân cụm. (Gom tay chắc chắn có nhầm ⇒ đường lùi có từ ngày đầu.)
- **Clone luôn đi theo gốc** khi gán/gỡ/gộp — clone tương đương gốc của nó, không có ca nào nó ở lại
  cụm khác mà đúng.
- Clone **tự thừa kế `ma_cum` của gốc** lúc sinh (`saveCloneBatch`).
- Mọi dropdown **chỉ liệt kê cụm trong đúng dạng của câu đó**.

### 6.3 Tiền đề

- **Tầng dạng:** trong màn Dạng — "Tiền đề: [+ thêm dạng]", hiện danh sách dạng phải học trước
  và (đọc-thêm) danh sách dạng phụ thuộc vào nó.
- **Tầng cụm:** trong card cụm — "[+ tiền đề]", chỉ chọn được cụm **cùng dạng**.
- Thêm mà tạo vòng → chặn + in đường đi (§4).

---

## 7. Không làm trong đợt này

- **AI gợi ý cụm** (clustering câu lẻ) — CEO chốt gom tay, vì tên cụm là người đặt.
- **`hgt_*`** (hình giải tích) — cùng shape, thêm khi cần.
- **Builder xoay quanh cụm** — spec riêng; đợt này chỉ dựng nền dữ liệu để builder có cái mà dựa.
- **Đưa tiền đề vào công thức mastery** — cấm (§1).
