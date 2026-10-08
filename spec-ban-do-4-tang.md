# SPEC — Bản đồ kiến thức 4 tầng (Chủ đề · Chuyên đề · Nhóm bài · Dạng bài) + thứ tự học

> **Trạng thái:** CEO đã chốt quyết định qua 3 vòng sparring (07/10/2026); spec này là bản viết lại hoàn chỉnh. **Chưa build gì.**
> **Phạm vi đợt này:** nhánh **Đại** (`dai_*`). HGT/KHTN cùng khuôn ⇒ áp sau qua registry. Hình (`hinh_*`) và Tiếng Anh tự cấu trúc riêng (§1.6 CLAUDE.md), không nằm trong spec này.
> **Thay thế một phần:** `spec-cum-bai.md` (định nghĩa "cụm") và `spec-luong-kho.md` §2 (phân tầng Dạng / Cụm / Biến thể). Hai file đó vẫn đúng ở các phần khác.
> Số liệu đo trên DB live 07/10 trong phiên read-only.

---

## 1. Quyết định CEO (07/10)

| # | Quyết định | Hệ quả kỹ thuật |
|---|---|---|
| Q1 | 4 tầng **Chủ đề → Chuyên đề → Nhóm bài → Dạng bài**. Bỏ hẳn chữ "Cụm". | Tầng 3 = "dạng" cũ, tầng 4 = "cụm" cũ, **đổi tên trên giao diện**. §2 |
| Q2 | **Mastery đo chính ở tầng 3 (Nhóm bài)**, vì cần đủ số câu. Tầng 4 chỉ có ý nghĩa khi học bổ trợ. | KP **giữ nguyên** chỗ cũ ⇒ 49 bảng, 124 hàm và 183k dòng đo không phải chuyển. |
| Q3 | Tầng 3 và tầng 4 **không độc lập**. Nhóm bài chứa lý thuyết chung của mọi dạng bài bên trong; lý thuyết của dạng bài chính là **ví dụ**. In ra = lý thuyết nhóm + ví dụ từng dạng bài. Ví dụ hiện đang nằm trong lý thuyết tầng 3 cũ, **CEO tự tách**. | Tầng 4 có ô lý thuyết (ví dụ) riêng. §8 |
| Q4 | **Mã cố định từ lúc sinh**: chuyển đi đâu cũng không đổi. Mã chỉ máy đọc. Mã "có logic" để làm sau khi bản đồ hoàn thiện. | Khoá chính không bao giờ đổi. Mã logic sau này = cột hiển thị, sinh lại được. §3.2 |
| Q5 | **Chuyên đề dùng chung nhiều chủ đề.** Vd chuyên đề "Tìm x" có mặt ở chủ đề Số tự nhiên lẫn Phân số; mỗi chủ đề có **nhóm bài riêng** của nó. Không có "chủ đề cha chính". Chủ đề không quá quan trọng, **đánh giá từ tầng chuyên đề trở xuống**. | Nhóm bài nằm ở đúng 1 **ô (chủ đề × chuyên đề)**. §2 |
| Q6 | Thứ tự học: quy định cái gì dạy trước cái gì dạy sau. **Đợt này chỉ xét trong 1 khối**, bắt đầu từ tầng chuyên đề. Thứ tự xuyên khối (lớp 6 → lớp 7) làm ở phase sau. | Tiền đề 3 tầng, cấm cạnh xuyên khối ở đợt này. §6 |
| Q7 | "Học xong A" = **đã được dạy, và bằng chứng là đã được đo**. | Xong ⟺ ô (HS × nhóm bài) không còn ở trạng thái `chưa-đo`. §6.2 |
| Q8 | Chặn thứ tự chủ yếu ở **tự học trên app** (GV đã tự nắm thứ tự). Bổ trợ yếu nhiều dạng ⇒ học **gốc trước, ngọn sau**, áp **cả 2 tầng**: giữa các nhóm bài và giữa các dạng bài trong nhóm. | §6.3 · §7 |
| Q9 | Bổ trợ **chưa** tự kéo nhóm tiền đề đang yếu/chưa đo vào case. | Chỉ xếp lại thứ tự những gì đã có trong case. |
| Q10 | Chuyển dạng bài sang nhóm khác ⇒ **lịch sử đo đi theo câu**. | §10, bật ở P1 kèm báo cáo trước/sau. |

---

## 2. Mô hình

```
Chủ đề      (theo KHỐI; chỉ để gom và nhìn)        Số tự nhiên K6         Phân số K6
                                                        │                      │
Chuyên đề   (DÙNG CHUNG, không có khối) ── Tìm x ───────┼──────────────────────┤
                                                        ▼                      ▼
Nhóm bài    T3 = KP · mastery · lý thuyết       "Tìm x với số TN"      "Tìm x với phân số"
                                                        │                      │
Dạng bài    T4 = ví dụ · bổ trợ · thứ tự trong nhóm  DB1 → DB2 …            DB1 → DB2 …
```

- **Ô (chủ đề × chuyên đề)** = chỗ một chuyên đề "có mặt" trong một chủ đề. Một chuyên đề có bao nhiêu ô cũng được. Phần đồ thị của bản đồ nằm **duy nhất** ở đây.
- **Nhóm bài thuộc đúng 1 ô.** **Dạng bài thuộc đúng 1 nhóm.** Từ ô trở xuống là cây.
- **Khối gắn với chủ đề.** Khối của nhóm bài suy ra từ chủ đề của ô chứa nó. Chuyên đề không có khối: "Tìm x" trải từ lớp 4 tới lớp 9.
- **Câu** gắn nhóm bài (`dang_chinh`, bắt buộc), và gắn dạng bài nếu đã phân (`ma_cum`, nullable: NULL = *chưa phân*, không phải "dạng bài rỗng", đúng §1.5). Bất biến: dạng bài của câu phải nằm trong đúng nhóm của câu. Hiện **5.864/5.864 câu đã đúng** bất biến này.

### 2.1 Bảng đối chiếu tên — BẮT BUỘC đọc

Giữ nguyên tên vật lý trong DB vì KP không đổi chỗ (Q2). Đổi tên vật lý thì phải đụng 49 bảng và 124 hàm, đổi lấy rủi ro mà không được lợi gì.

| Giao diện (CEO) | Tầng | DB (bảng · khoá) | Ghi chú |
|---|---|---|---|
| Chủ đề | 1 | `dai_chu_de.ma_chu_de` | **bảng mới** |
| Chuyên đề | 2 | `dai_chuyen_de.ma_chuyen_de` | **bảng mới** |
| *(ô)* | — | `dai_chu_de_chuyen_de (ma_chu_de, ma_chuyen_de)` | **bảng mới** |
| **Nhóm bài** | 3 | `dai_ban_do.ma_dang` · câu: `dang_chinh` | ⚠ trong DB vẫn tên "dang" |
| **Dạng bài** | 4 | `dai_cum_bai.ma_cum` · câu: `ma_cum` | ⚠ trong DB vẫn tên "cum" |

⇒ CLAUDE.md §1 sửa câu "KP = dạng (`ma_dang`)" thành **"KP = Nhóm bài (DB: `ma_dang`)"** và chép bảng này lên đầu.
Bảng mới tạo từ nay **không** dùng chữ `dang` hay `cum` với nghĩa mới.

---

## 3. Hiện trạng (DB 07/10) và 2 lỗi đang có

| Hạng mục | Số |
|---|---|
| Chủ đề · chuyên đề · nhóm bài (Đại) | 97 · 232 · 734 |
| Dạng bài (cụm cũ) | 134, nằm trên 134 nhóm. **407 nhóm có câu nhưng chưa có dạng bài nào** |
| Câu có dạng bài | 5.864 / 29.154 (20%) |
| Chuyên đề | Hiện là **cột chữ chép lại trên mỗi dòng nhóm bài**, chưa có bảng. Mỗi chuyên đề đúng 1 chủ đề |
| Tên chuyên đề trùng nhau | 232 mã chỉ có 206 tên (vd "Rút gọn biểu thức" vừa ở Đơn thức–đa thức vừa ở Hằng đẳng thức, K8) ⇒ **ứng viên gộp** thành chuyên đề dùng chung |
| "Tìm x" | **Chưa phải chuyên đề.** Đang rải thành nhóm lẻ trong "Các phép tính với số TN", "Thực hiện phép tính số hữu tỉ", "Luỹ thừa"… |
| Tiền đề | nhóm↔nhóm **0** · dạng bài↔dạng bài **20** (cả 20 cạnh đều nằm trong cùng nhóm) · `dai_chuyen_de_thu_tu` 19 dòng (K12, thứ tự thẳng hàng) |
| Lý thuyết tầng 3 | 376 bài, **210** bài có chữ "ví dụ" (phần CEO sẽ tách sang tầng 4) |
| Lý thuyết chuyên đề | 65 |

### 3.1 Lỗi A — mã mang vị trí và hàm chuyển đổi khoá chính

- **734/734** mã nhóm bài theo mẫu `T1·khối·chủ đề·chuyên đề·số` (vd `T108050102`). Mã chuyên đề và mã chủ đề cũng vậy.
- Hai hàm chuyển hiện có, `fn_dai_chuyen_dang` và `fn_dai_chuyen_chuyen_de`, **sinh mã mới rồi ghi đè khoá chính**. Sau đó chúng sửa tay một danh sách cứng 7–8 bảng tham chiếu bằng chữ.
- Danh sách cứng đó thiếu `hoc_tu_dau_dang`, `bt_grades` và mọi bảng thêm sau này. Đây đúng là lỗi "danh tính bám vị trí" mà CLAUDE.md §2 cấm.

### 3.2 Lỗi B — 2.077 dòng đang trỏ tới nhóm bài không còn tồn tại

| Bảng | Mồ côi / tổng | Chủ yếu |
|---|---|---|
| `bai_test_cau` | 852 / 49.985 | K7, K6 |
| `tu_luyen_dang_lan` | 780 / 44.524 | K7, K6 |
| `gami_session_problems` | 346 / 28.337 | K7, K11 |
| `buoi_danh_gia_dang` | 31 / 3.009 | K7 |
| `bo_tro_yeu_dang` · `bo_tro_duoi_dang` · `ca_test_cau` · `hoc_tu_dau_dang` | 28 · 15 · 24 · 1 | |

Toàn bộ là mã Đại (`T106…`, `T107…`, `T111…`, `T112…`).

**Đính chính 08/10, sau khi đào gốc:** đây **không phải dữ liệu mất**, mà là **nhãn cũ**.
- `bai_test_cau`: **852/852** dòng có câu, câu vẫn còn và đang thuộc một nhóm đang sống.
- `gami_session_problems`: **272/329** dòng cũng vậy.

Gốc rễ: thiết kế nói "mastery đi theo câu", nhưng **`fn_mastery_cells` đang đọc mã nhóm chép trên ô chấm** (`sp.ma_dang`, `btc.ma_dang`), không đọc nhóm hiện tại của câu. Câu đổi dạng (4.715 lần trong `kho_doi_dang_log`) hoặc nhóm bị gộp/xoá thì nhãn chép trên ô chấm đứng yên ⇒ cũ dần. Hiện các lần đo này đúng là đang rụng khỏi mastery, nhưng **chuyển sang đọc theo câu (§10) thì tự lành**.

Mất thật chỉ còn **57** ô `gami_session_problems` không có câu, trỏ vào mã đã mất (với `tu_luyen_dang_lan` và các bảng vận hành thì xử lý ở việc riêng).

**Nguồn sinh ra mã mất** (phiên kiểm lỗi B, `docs/bao-cao-loi-b-ma-mo-coi.md`):
- **11/16 mã** do thao tác "Gộp câu" (`fn_dai_gop_cau_dang`, chỉ đổi `dang_chinh` của câu) rồi **xoá cứng** dòng nhóm (`deleteDaiDang` trong `src/lib/kho/api.ts`).
- Hai hàm chuyển thì có sửa đủ 8 bảng.
- Đối chiếu bằng 2 nhân chứng độc lập (`dang_chinh` hiện tại của câu + lần đổi cuối trong `kho_doi_dang_log`): **1.879/1.879** dòng có câu khớp, 0 lệch.

⇒ **Luật mới:**
- Khoá chính không bao giờ đổi. Mọi lần "chuyển" chỉ sửa **con trỏ cha**.
- **Cấm xoá cứng nhóm bài:** dùng `xoa_at` (kho rác) và `gop_vao` (§4).
- Hai hàm chuyển, `deleteDaiDang` và đường xoá cứng trong `api.ts` ngừng được gọi từ P1 (thu quyền ở DB, không chỉ ẩn nút). Bản thân hàm xoá theo Luật xoá ở P6.

---

## 4. Schema (Đại)

```sql
-- ── Tầng 1: Chủ đề (mang KHỐI) ──
create sequence dai_chu_de_seq;
create table dai_chu_de (
  ma_chu_de  text primary key default 'DCD' || lpad(nextval('dai_chu_de_seq')::text, 5, '0'),
  khoi       text not null,
  ten        text not null,
  thu_tu     smallint not null default 0,
  xoa_at     timestamptz,                     -- kho rác (§2 CLAUDE: tham chiếu bằng chữ ⇒ cấm xoá cứng)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Tầng 2: Chuyên đề (DÙNG CHUNG, không khối) ──
create sequence dai_chuyen_de_seq;
create table dai_chuyen_de (
  ma_chuyen_de text primary key default 'DCH' || lpad(nextval('dai_chuyen_de_seq')::text, 5, '0'),
  ten          text not null,
  xoa_at       timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Ô: chuyên đề có mặt trong chủ đề ──
create table dai_chu_de_chuyen_de (
  ma_chu_de    text not null references dai_chu_de(ma_chu_de),
  ma_chuyen_de text not null references dai_chuyen_de(ma_chuyen_de),
  thu_tu       smallint not null default 0,  -- thứ tự HIỂN THỊ/giáo trình trong chủ đề (≠ tiền đề)
  primary key (ma_chu_de, ma_chuyen_de)
);

-- ── Tầng 3: Nhóm bài = dai_ban_do (giữ nguyên bảng + khoá) ──
alter table dai_ban_do
  add constraint dai_ban_do_o_fk foreign key (ma_chu_de, ma_chuyen_de)
      references dai_chu_de_chuyen_de (ma_chu_de, ma_chuyen_de),
  add column bat_buoc   boolean not null default true,   -- false = không chặn "xong chuyên đề" (nâng cao, ôn tập, thùng)
  add column xoa_at     timestamptz,                     -- kho rác: CẤM xoá cứng (tham chiếu bằng chữ ở 43 cột)
  add column gop_vao    text references dai_ban_do(ma_dang), -- biển chỉ đường: nhóm đã gộp ⇒ đo không có câu tính về đây
  add column updated_at timestamptz not null default now(),
  add constraint dai_ban_do_gop_chi_khi_xoa check (gop_vao is null or xoa_at is not null);
revoke delete on dai_ban_do from authenticated, anon;  -- xoá = đặt xoa_at qua RPC
-- ten_chu_de · ten_chuyen_de · khoi: GIỮ làm bản chép tương thích, do TRIGGER điền từ bảng cha (§4.1)

-- ── Tầng 4: Dạng bài = dai_cum_bai (giữ nguyên) ──
alter table dai_cum_bai add column updated_at timestamptz not null default now();
create table dai_cum_ly_thuyet (                 -- "ví dụ" của dạng bài; chỉ có dòng khi có nội dung (§1.5)
  ma_cum      text primary key references dai_cum_bai(ma_cum) on delete cascade,
  noi_dung    text not null,
  cap_nhat_at timestamptz not null default now()
);

-- ── Tiền đề ──
create table dai_chuyen_de_tien_de (            -- MỚI
  ma_chuyen_de         text not null references dai_chuyen_de(ma_chuyen_de),
  tien_de_ma_chuyen_de text not null references dai_chuyen_de(ma_chuyen_de),
  primary key (ma_chuyen_de, tien_de_ma_chuyen_de),
  check (ma_chuyen_de <> tien_de_ma_chuyen_de)
);
-- dai_dang_tien_de (nhóm ↔ nhóm, đã có, 0 dòng)       + trigger: CÙNG KHỐI (đợt này) + chống vòng
-- dai_cum_tien_de  (dạng bài ↔ dạng bài, đã có, 20 dòng) + trigger: CÙNG NHÓM + chống vòng
```

**Backfill (P1), khớp 1–1 với dữ liệu hiện tại, không suy đoán:**
- 97 chủ đề, 232 chuyên đề, 232 ô sinh từ `distinct` trên `dai_ban_do`, **giữ nguyên mã cũ** làm khoá.
- Khối của chủ đề lấy từ `dai_ban_do.khoi`. Đã kiểm: 0 chuyên đề trải 2 khối.
- `dai_chuyen_de_thu_tu.thu_tu` (19 dòng K12) chép vào `dai_chu_de_chuyen_de.thu_tu`.
- **Không tự gộp** 26 chuyên đề trùng tên: chúng chỉ hiện thành gợi ý trên màn (§9). Người kéo thì mới tính.
- Mã sinh mới từ nay là mã mờ (`DCD…`, `DCH…`, `DG…`), không mang nghĩa vị trí. `fn_dai_sinh_ma_*` ngừng dùng cho đối tượng mới.

### 4.1 Trigger

| Trigger | Việc |
|---|---|
| `dai_ban_do` BEFORE INSERT/UPDATE OF `ma_chu_de, ma_chuyen_de` | Điền `ten_chu_de`, `ten_chuyen_de`, `khoi` từ cha. Nhờ đó 25 hàm và 36 file đang đọc cột chữ **vẫn chạy** trong thời gian chuyển đổi |
| `dai_chu_de` / `dai_chuyen_de` AFTER UPDATE OF `ten, khoi` | Lan bản chép xuống `dai_ban_do` |
| Đổi cha ở `dai_ban_do`, `dai_cum_bai`, `dai_chu_de_chuyen_de` | Ghi `dai_ban_do_log` (actor, thời điểm, cha cũ → cha mới). App không tự ghi log (§4 CLAUDE.md) |
| 3 bảng tiền đề | Chống vòng (hàm bao đóng, mẫu `hinh_mo_hinh_to_tien`). Nhóm: 2 đầu cùng khối. Dạng bài: 2 đầu cùng nhóm |
| `dai_cau_hoi` INSERT/UPDATE OF `ma_cum, dang_chinh` | Giữ bất biến: nhóm của dạng bài phải bằng `dang_chinh` |
| Sửa `dai_cum_ly_thuyet` | Bump `dai_cum_bai.updated_at` và `dai_ban_do.updated_at` (§2 CLAUDE: đổi nội dung con thì bump cha) |

---

## 5. Luật chuyển card (mọi lần chuyển = 1 RPC transactional)

| Thao tác | RPC | Cái gì đổi | Chặn / hỏi lại |
|---|---|---|---|
| Thêm chuyên đề vào chủ đề | `fn_ban_do_gan_chuyen_de(chu_de, chuyen_de)` | thêm 1 ô | — |
| Gỡ chuyên đề khỏi chủ đề | `fn_ban_do_go_chuyen_de` | xoá 1 ô | Chỉ gỡ được khi **ô rỗng** |
| Gộp chuyên đề X vào Y | `fn_ban_do_gop_chuyen_de(x, y)` | Ô và nhóm của X chuyển sang Y; tiền đề của X dồn sang Y; X vào kho rác | Hỏi lại khi cả X lẫn Y đều có lý thuyết chuyên đề |
| Nhóm bài sang ô khác | `fn_ban_do_chuyen_nhom(nhom, chu_de, chuyen_de)` | **1 dòng** (`ma_chu_de`, `ma_chuyen_de`). Trigger điền tên và khối. Ô đích chưa có thì tự thêm. **Mastery giữ nguyên** vì `ma_dang` không đổi | Đổi khối ⇒ phải xác nhận. Còn cạnh tiền đề nhóm sẽ thành xuyên khối ⇒ từ chối và liệt kê các cạnh |
| Dạng bài sang nhóm khác | `fn_ban_do_chuyen_dang_bai(dang_bai, nhom)` | `dai_cum_bai.ma_dang` và `dang_chinh` của **mọi câu thuộc dạng bài**, trong cùng transaction (trigger sẵn có `trg_log_doi_dang` ghi vết từng câu). Lý thuyết (ví dụ) đi theo. Nhóm cũ được nêu cờ "lý thuyết cần xem lại" | Dạng bài còn cạnh tiền đề ⇒ từ chối và liệt kê, người gỡ trước |
| Sắp lại trong cùng cha | sửa `thu_tu` | chỉ thứ tự hiển thị | — |
| Kéo sang nhánh khác (Đại → Hình…) | — | — | **Cấm** (khác bảng, khác bounded context) |

**Không có bước "cập nhật thông tin phụ thuộc".** Con trỏ cha bằng khoá cố định, nên chuyển xong mọi thứ tự đúng theo. Phần duy nhất phải lan ra là bản chép chữ tương thích, và trigger đã lo việc đó.

---

## 6. Thứ tự học

### 6.1 Ba tầng tiền đề (đợt này: trong 1 khối)

| Tầng | Kiểu | Nghĩa |
|---|---|---|
| Chuyên đề | Cặp "A trước B" (DAG) | **Áp trong từng chủ đề.** Ở chủ đề C, mọi nhóm bắt buộc thuộc ô (C, A) phải xong trước khi mở các nhóm thuộc ô (C, B). Khai báo một cạnh, áp ở mọi chủ đề có cả hai chuyên đề. Dùng **bao đóng**: nếu A→B→D mà chủ đề C không có B, thì D ở C vẫn cần A |
| Nhóm bài | Cặp "A trước B" (DAG) | Nối tự do, kể cả xuyên chủ đề, nhưng **cùng khối** (đợt này) |
| Dạng bài | Cặp "A trước B" (DAG) trong cùng nhóm, cộng `thu_tu` | Gốc → ngọn cho bổ trợ. `thu_tu` dùng khi hai dạng bài không có quan hệ, và là thứ tự in ví dụ |

- **Tiền đề ≠ thứ tự giáo trình.** Tiền đề nói cái gì *bắt buộc* phải trước. `thu_tu` của ô hay của dạng bài là *một* cách xếp mà trung tâm chọn trong số các cách hợp lệ (linear extension của DAG). Hai thứ giữ riêng.
- Chỉ dùng luật **AND** (xong mọi tiền đề). Kiểu OR như các cách giải bên Hình chưa cần cho Đại.

### 6.2 "Xong" (Q7)

- HS **xong nhóm bài N** ⟺ (HS × N) có ≥1 lần đo trong các nguồn mà `fn_mastery_cells` đang đọc, tức ô đó là `đạt` hoặc `yếu`, không còn `chưa-đo`. Bài test của "Học từ đầu" cũng tính.
- Hai trường hợp **không chặn**:
  - nhóm `bat_buoc = false`;
  - nhóm **chưa có câu nào dùng được**: không đo được thì không được phép khoá ai.
- ⚠ HS vào giữa năm chưa từng được đo các chuyên đề cũ sẽ bị khoá thật. Hiện chấp nhận. Lối gỡ là **test đầu vào** (đã là nguồn đo).

### 6.3 Mở khoá tự học trên app (Q8)

`fn_ban_do_mo_khoa(p_hs, p_mon)` trả về mỗi nhóm bài kèm `da_xong` / `mo` / `khoa` và danh sách `thieu` (nhóm nào chưa xong đang chặn nó). Hàm tính thuần, không có bảng trạng thái.
- Nhóm N mở ⟺ (1) mọi nhóm tiền đề của N đã xong, **và** (2) trong chủ đề của N, mọi nhóm bắt buộc thuộc các chuyên đề tổ tiên của chuyên đề của N đã xong.
- **Bên dùng:** `htd_lo_trinh` (Học từ đầu) thêm trạng thái khoá. App HS hiện ổ khoá và "học X trước" theo `skin/KhungHS.tsx` và `skin/loi.ts`. Tự luyện và game vốn đã giới hạn ở "dạng em đã học" (`spec-che-do-game.md`), nên không phải đổi.

---

## 7. Bổ trợ yếu: gốc trước, ngọn sau (Q8, Q9)

- **Giữa các nhóm trong 1 case:** sắp topo theo tiền đề nhóm cộng tiền đề chuyên đề (áp trong chủ đề, §6.1). Hai nhóm không có quan hệ thì giữ thứ tự hiện nay.
- **Trong 1 nhóm:** câu đi theo dạng bài, sắp topo theo `dai_cum_tien_de`, hoà thì theo `thu_tu`. Câu chưa phân dạng bài xếp **cuối** vì chưa biết vị trí gốc–ngọn (CTO chọn).
- **Một nguồn thứ tự duy nhất:** `_ban_do_thu_tu_nhom(ma_dang[])` và `_ban_do_thu_tu_dang_bai(ma_dang)`, dùng chung cho bổ trợ (`fn_btyeu_luyen_sinh`, `fn_btyeu_in_sinh`, `fn_btyeu_chi_tiet_case`) và cho in tài liệu (§8).
- **Không** tự kéo nhóm tiền đề đang yếu/chưa đo vào case (Q9). Muốn làm thì đó là việc đổi luật phát hiện ở `spec-bo-tro.md`, tách thành bước riêng.
- Vẫn giữ MCQ tuyệt đối (`_kho_dk_mcq_sql`), luật trong `spec-bo-tro.md` không đổi.

---

## 8. Lý thuyết · ví dụ · in

- **Nhóm bài:** `dai_dang_ly_thuyet`, như hiện nay, là lý thuyết chung.
- **Dạng bài:** `dai_cum_ly_thuyet` chứa ví dụ, cùng định dạng nội dung (`spec-format-noidung.md`).
- **In** = lý thuyết nhóm, rồi ví dụ từng dạng bài theo `_ban_do_thu_tu_dang_bai`.
- **Tách ví dụ (CEO làm):** 210 bài lý thuyết tầng 3 có ví dụ. Tuỳ chọn: Claude **đề xuất** bản tách (ví dụ nào thuộc dạng bài nào) vào màn duyệt, CEO bấm nhận. Không ghi thẳng (§5 CLAUDE: AI gợi ý → người xác nhận).

---

## 9. Màn bản đồ kéo thả (Kho › Bản đồ, `src/screens/kho/BanDo.tsx`, thêm chế độ "Card")

- **Lọc theo khối**, mỗi lần một khối.
- **Bố cục:** mỗi chủ đề là một cột. Trong cột là các card chuyên đề (ô), trong đó là card nhóm bài, trong đó là chip dạng bài.
  - Chuyên đề dùng chung thì hiện ở mọi chủ đề có nó, kèm huy hiệu "có ở N chủ đề".
  - Mỗi card nhóm hiện: số câu · có lý thuyết hay chưa · số dạng bài · số câu chưa phân dạng bài · `bat_buoc`.
- **Kéo:** nhóm sang ô khác · dạng bài sang nhóm khác · chuyên đề từ thư viện bên trái thả vào một chủ đề (thêm ô) · sắp lại trong cùng cha.
- **Gợi ý gộp:** danh sách chuyên đề trùng hoặc gần trùng tên. CEO kéo X vào Y để gộp.
- **Chế độ "Thứ tự":** sơ đồ tiền đề của khối, một cấp mỗi lần (chuyên đề / nhóm / dạng bài trong 1 nhóm). Kéo mũi tên A → B để tạo cạnh. Vòng tròn bị DB từ chối và màn báo lại nguyên văn.
- Luật màn theo CLAUDE.md §2 React:
  - Sau khi chuyển thì **vá đúng card tại chỗ**, không tải lại cả bản đồ.
  - Nhớ khối đang xem, vị trí cuộn và card đang mở khi rời màn rồi quay lại.
  - Có báo lưu ~2s, không dùng `alert()`.
- **Thư viện:** `@dnd-kit/core` cho card, `@xyflow/react` + `dagre` cho sơ đồ tiền đề. Là dependency mới.
- **Đổi nhãn:** "Dạng" → "Nhóm bài", "Cụm" → "Dạng bài". Màn Kho đổi ở P2. Các màn còn lại (bổ trợ, app HS, GV) đổi ở P6, trước đó ghi chú tạm để không có hai bộ từ chạy song song không giải thích.

---

## 10. Mastery "đi theo câu" (Q10 — CEO 08/10: "câu đang thuộc dạng nào thì tính về dạng đó")

- **Hiện nay:** `fn_mastery_cells` lấy `ma_dang` từ **bản chép lưu trên dòng đo** (`gami_session_problems`, `bai_test_cau`, `bt_grades`).
- **Luật phân giải nhóm của một lần đo** (một hàm duy nhất `_do_nhom_cua_o(ma_cau, ma_dang_chep)`):
  1. Có `ma_cau`, câu **còn trong kho** (không `xoa_at`), và nhóm hiện tại của câu là **nhóm thật** (không phải dạng chờ "Chưa phân dạng", không `xoa_at`) ⇒ tính về **nhóm hiện tại của câu**.
  2. Ngược lại (không có câu · câu đã vào rác hoặc biến mất · câu đang nằm dạng chờ) ⇒ dùng **mã chép trên ô chấm**, rồi đi theo chuỗi `gop_vao` tới nhóm còn sống.
  - Lý do của điều kiện ở (1): 4 mã `T1120301xx` (chuyên đề xoá 24/09) có câu đã dồn về dạng chờ `T112000000`. Đi theo câu mà không lọc thì **157 lượt chấm** thành mastery của "Chưa phân dạng". Có 2 ô mang `ma_cau` mà câu đã biến khỏi `dai_cau_hoi` ⇒ phải giữ mã chép.
- **Phủ:** 94% `gami_grades` (128.305/136.055) và 96% `bai_test_cau` có câu.
- **Lượt chấm không có câu (7.750).** Phần thật sự vào mastery Đại nhỏ hơn con số này:
  - **`ingame` 4.746:** pha này không ghi câu, **và `fn_mastery_cells` không tính `ingame`** ⇒ không ảnh hưởng mastery.
  - **ET/BTVN/MT tháng 6–7, trước mig `0106`:** ô chấm chưa có cột câu. Backfill khi đó chỉ map khi số ô bằng số câu.
  - **ET buổi bù trước 29/09: 1.392 ô.** `ensureBuoiBuETProblems` (`src/lib/botro.ts`) chép ô ET của buổi mẹ sang từng em nhưng **không ghi `ma_cau`**. Sửa ở `d7ebbd6a` (29/09); từ 30/09 ô nào cũng có câu. Có thể **gắn lại câu** bằng 2 nhân chứng (thứ tự ô của em ↔ ô buổi mẹ đã có `ma_cau`, **và** dãy `ma_dang` khớp 100%, **và** đề buổi mẹ không sửa sau ngày chép). Lệch dù 1 ô thì bỏ cả em đó. Việc riêng, chỉ ghi khi CEO gật.
    - ⚠ Nhân chứng "dãy `ma_dang`" phải so **qua log gộp** (`kho_doi_dang_log` `dang_cu → dang_moi`), không so thẳng với `dang_chinh` hiện tại. Lý do: một số ô mang mã đã chết do gộp, so thẳng thì sẽ báo lệch giả.
    - Việc này cũng xử lý luôn **26 ô** mồ côi không câu (`T107010102`, `T107010202`, `T1110101xx`, `T1120103xx`; 30/06–14/09) mà phiên lỗi B chuyển sang. Phiên đó còn giữ 29 ô của buổi thường (BTVN 17 + ingame 12, tháng 7) để trống.
  - Ô Hình mang `hinh_baitoan_id`, không có `ma_dang` ⇒ không vào mastery Đại (đo riêng ở `fn_mastery_cells_hinh`).
- **Gộp** A vào B ⇒ `A.gop_vao = B` (A vào rác), nên đo không có câu của A tính về B.
- **Tách** A thành A + A′ ⇒ đo không có câu ở lại nhóm **giữ mã A** (không chia được thì không đoán, §1.5).
- **Không chỉ `fn_mastery_cells`:** các hàm sau cũng đọc mã chép trên ô chấm lịch sử, nên phải chuyển sang `_do_nhom_cua_o`. Danh sách lọc bằng mắt, phải rà lại lúc build:
  - `fn_btyeu_dang_yeu_2_cua_so` · `fn_btyeu_de_xuat_dang_moi` · `fn_btyeu_lich_su_hs`
  - `fn_hs_bu_dang` · `fn_thanh_tuu_thang` · `fn_hs_xep_hang_ti_le_dat`
  - `_troly_cc_hoc_tap_hoc_sinh` · `_bxh_gia_tri` · `hs_dang_evals`
- **Báo cáo trước/sau** tách riêng nhóm "nhãn cũ do gộp" (gsp 249 + btc 845, đã khớp 2 nhân chứng, CEO không phải soi lại) với phần còn lại.
- **Bật ở P1**, trước khi CEO xếp lại, vì các thao tác gộp và tách chỉ an toàn khi đã có luật này.
  - Hôm nay có **366** dòng `gami_session_problems` và **1.129** dòng `bai_test_cau` mà bản chép khác nhóm hiện tại của câu ⇒ mastery các ô đó đổi ngay khi bật.
  - Kèm báo cáo trước/sau theo (HS × nhóm) để CEO xem. Không phải cổng chờ duyệt.
  - Cũng chữa được phần lớn lỗi B (§3.2) đối với các dòng có `ma_cau`.

---

## 11. Lộ trình (expand → contract)

| Pha | Việc | Phá cũ? | Xong khi |
|---|---|---|---|
| **P1 Nền DB** | Sao lưu ra file · §4: bảng, backfill, trigger, RPC §5 (gồm gộp/tách), chống vòng, `xoa_at` + `gop_vao`, cấm xoá cứng · ngừng gọi 2 hàm chuyển cũ + `fn_dai_gop_cau_dang` + `deleteDaiDang` · **§10 `_do_nhom_cua_o` cho `fn_mastery_cells` và 9 hàm kia**, kèm báo cáo trước/sau | Không (mastery đổi đúng chỗ nhãn cũ) | Bản chép chữ trên `dai_ban_do` **không đổi dòng nào** so với trước backfill. 25 hàm cũ chạy y nguyên. Báo cáo §10 gửi CEO. `npm run schema` |
| **P2 Màn Card** | §9 phần cây, kéo thả, gợi ý gộp, đổi nhãn trong Kho | Không | CEO tự kéo được và dồn "Tìm x" K6 về 1 chuyên đề trên app thật |
| **P3 Thứ tự** | §9 chế độ Thứ tự, 3 tầng tiền đề, cảnh báo | Không | CEO khai xong thứ tự 1 khối mẫu |
| **P4 Lý thuyết tầng 4** | `dai_cum_ly_thuyet`, màn sửa, in (§8), tuỳ chọn đề xuất tách | Không | In được 1 nhóm = lý thuyết + N ví dụ |
| **P5 Bên dùng** | `fn_ban_do_mo_khoa` → Học từ đầu · bổ trợ gốc→ngọn | Đổi hành vi | Soi bằng tài khoản HS thật |
| **P6 Thu gọn** | Chuyển 25 hàm và 36 file sang bảng mới, đổi nhãn toàn app, rồi **xoá** cột chữ cũ, 2 hàm chuyển cũ, `dai_chuyen_de_thu_tu` | **Có** | Theo Luật xoá: liệt kê chính xác, CEO gật rồi mới làm |

---

## 12. Để phase sau (đã biết, cố ý chưa làm)

- Tiền đề **xuyên khối** (Tìm x lớp 6 → lớp 7). Khi làm: gỡ ràng buộc "cùng khối" ở trigger nhóm bài.
- **Mã có logic** (Q4): cột `ma_hien_thi` sinh từ vị trí, sinh lại được bất cứ lúc nào, không đụng khoá chính.
- Áp khuôn cho **HGT, KHTN** qua registry `_kho_*`.
- Chẩn đoán gốc rễ ("yếu B vì hổng A") và bổ trợ tự kéo tiền đề (Q9).
- **Hình, ghi nhận lúc đào gốc 08/10 (ngoài phạm vi spec này):**
  - **Buổi bù không có phần Hình.** `ensureBuoiBuETProblems` chỉ chép câu Đại của ET buổi mẹ. 0 ô Hình nào thuộc buổi bù; 12 lượt em bù có buổi mẹ chứa Hình ET ⇒ các em này **không bao giờ được chấm Hình** của buổi đó. Lỗi vẫn đang có.
  - **Mastery Hình đo theo BÀI TOÁN** (`fn_mastery_cells_hinh` nhóm theo `hinh_baitoan_id`), không theo dạng. Mỗi bài thường chỉ đo 1 lần ⇒ điểm nắm không cộng dồn qua các buổi, trái mô hình lõi (HS × KP). Cần chốt KP của Hình cùng với cấu trúc Hình mới.
- Sửa **lỗi B** (2.077 dòng mồ côi): việc riêng, cần nhân chứng thứ hai.
- Bản đồ phiêu lưu app HS (`spec-v1-app-hs.md` §4) đổi theo mô hình mới: lục địa = chủ đề, khu vực = ô, màn = nhóm bài, quái = dạng bài. Chuyên đề dùng chung thì hiện thành khu vực ở nhiều lục địa.

---

## 13. Đứng trên vai (R7)

- **Knowledge Component** (Koedinger, KLI): Nhóm bài là đơn vị đo. **Item family / isomorph** (Gierl, Automatic Item Generation): ý nghĩa gốc của dạng bài và câu.
- **Faceted classification** (Ranganathan): chủ đề (mảng nội dung) × chuyên đề (kiểu bài) là hai trục, nhóm bài nằm ở giao điểm. Đó là lý do không có "cha chính".
- **Knowledge Space Theory** (Doignon–Falmagne; ALEKS): tiền đề là DAG, "sẵn sàng học" = mọi tiền đề đã nắm (*outer fringe*), thứ tự giáo trình là một *linear extension*.
- **Expand–contract / parallel change** (Fowler): dựng cái mới song song, chuyển bên dùng, rồi mới gỡ cái cũ.
