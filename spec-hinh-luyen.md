# SPEC — Bản đồ kiến thức HÌNH · phần LUYỆN (kho bài nhiều ý → mô hình)

> **⚠ 14/10: tầng MÔ HÌNH/NHÁNH/BÀI + cách hiển thị đã chuyển sang `spec-hinh-cay-nhanh.md` (CEO duyệt mockup). Trong file này: §0 bảng khái niệm, §2.5 luật 1 phần "bài kế thừa GT bài cha", §2.6 (cành nhỏ `hinh_mo_hinh_nhom`) đã BỊ THAY — đọc spec mới. Phần kho bài/ý/pipeline nhập (§1, §3, §4) vẫn đúng.**
> **Trạng thái 13/10/2026:** bản đề xuất CTO theo cập nhật khái niệm *mô hình* của CEO ngày 13/10. **Chưa build.** Bốn chỗ cần CEO gật ở §9.
> **Quan hệ với spec cũ:** `spec-kho-hinh-v3.md` vẫn đúng về *mô hình* (§0.2 ①②③④) và *schema* `hinh_bai`/`hinh_y` (§1). File này **đảo thứ tự xây** (§5 cũ "lưới trước, gán sau" ⇒ nay "kho trước, lưới sau") và bổ sung phần *tách ý tự động*. Phần Học (`hinh_hoc_*`, `docs/luong-kho-kieu-1-hinh-hoc.md`) không đụng.
> Số liệu DB live 13/10: 41 mô hình · 366 bài-trong-mô-hình (`hinh_baitoan`) · `hinh_bai`/`hinh_y` **0 dòng** · 1.826 câu phần Học (291 có nhãn mô hình).

---

## 0. Khái niệm (CEO 13/10) ↔ bảng DB

| CEO nói | Nghĩa | Bảng |
|---|---|---|
| **Mô hình** | một cấu hình hình học (bó giả thiết + hình); quanh nó có *vài → vài chục* bài, liên kết nhau | `hinh_mo_hinh` (có) |
| **Bài 1.1, 1.2 … 1.40 của mô hình** | bài toán nhỏ / tính chất chuẩn của mô hình; mã `BT.<khối>.<mh>.<stt>` | `hinh_baitoan` (có) — gọi là **bài mô hình** |
| **Bài toán thi thực tế** | một đề nguyên văn từ đề trường X, có 2–4 ý | `hinh_bai` — gọi là **bài kho** |
| **Ý** của bài kho | a) b) c) tách riêng: câu hỏi · giả thiết riêng · đáp án · lời giải · hình riêng | `hinh_y` |
| "ý a là 1.1, ý b là 1.3, ý c là 1.11" | gán **ở tầng ý**: `hinh_y.baitoan_id` | cột có sẵn, nullable |

**Bản chất (CEO 13/10): tầng mô hình = tầng THAM CHIẾU = cành cây; bài toán = lá.** Giống Đại (chủ đề → chuyên đề → nhóm bài → dạng = cành; câu = lá) về vai trò, khác ở độ phức tạp của cành: cành Hình là **bó giả thiết lồng nhau (DAG)**, không phải cây phẳng. Hệ quả: cành **luôn mở** để gắn lá — không có ngưỡng "đủ N lá mới được dựng cành"; cành dựng tới đâu, lá gắn tới đó, lá chưa có cành thì nằm ở kho (nhãn phỏng đoán) chờ.

Hai luật giữ nguyên từ spec v3: **gán ở tầng ý** (§2.10) · **không tạo bài mô hình từ màn gán** (§2.2).

**Đứng trên vai ai (R7):** cách làm "kho ví dụ trước, khung sau" là *exemplar-first / bottom-up ontology* (grounded theory); mỗi bài kho = *testlet* nhiều item phụ thuộc nhau (Wainer & Kiely, IRT); mô hình với các bài xoay quanh = "problem family" của Pólya. Không phát minh gì mới, chỉ gọi đúng tên.

---

## 1. Hai phase — luật bất biến

```
PHASE 1 — KHO                                PHASE 2 — MÔ HÌNH CHI TIẾT
mô hình = vỏ (tên · giả thiết · hình)        từ N bài kho ⇒ Thùy/GV dựng bài mô hình 1.1 … 1.k
bài kho nhập vào, gắn NHÃN mô hình phỏng đoán   gán từng ý → bài mô hình (M3 có sẵn)
ý tách riêng, dùng được ngay (in · giao · đo)   mastery theo BÀI MÔ HÌNH suy động từ lịch sử ý
```

- **P1 không đẻ slot.** "Bài 1.1 … 1.40 để trống" = **không có dòng** `hinh_baitoan` (CLAUDE.md §1.5), chỉ hiện số đếm "mô hình này đã có N bài kho". Bài mô hình chỉ ra đời ở P2 khi "đã đủ logic".
- **41 mô hình + 366 bài mô hình đang có** (xây top-down trước) **đang LẪN Học và Luyện** (CEO 13/10: K8 26 mô hình đều là Học; K7 nhiều mô hình có câu phần Học trỏ vào). ⇒ **Bước DỌN thủ công của Thùy** (§6 B0.5) trước khi Hình luyện dùng: phân loại từng mô hình `luyen` / `hoc`; cái không thuộc đâu thì xoá thật theo luật xoá. Không tạo thêm bài mô hình trước P2.
- **Đo ở ý, KP = bài mô hình.** Mọi lần làm bài ghi `hinh_y_id` (hook có sẵn ở `gami_session_problems`/`canh_bao_yeu`). P1 chỉ có lịch sử theo ý; P2 gán xong thì mastery theo bài mô hình **tự có** từ lịch sử cũ (không chấm lại). Giống Q10 bản đồ Đại: lịch sử đi theo câu.
- **Một ý dùng được ở P1** khi: có câu hỏi + đáp án/lời giải + `da_duyet`. **Không** cần `baitoan_id`. (= "cổng 1" spec v3 nới: cổng vào kho chính P1 là *duyệt*, không phải *gán đủ*.)

---

## 2. Schema — chỉ THÊM cột, không bảng mới

Hai bảng đang 0 dòng nên sửa tự do; **giữ tên** `hinh_bai`/`hinh_y` (code + hook đã trỏ vào), **đổi tiền tố mã** để hết nhầm với phần Học (`HH00001` vs `HH.0001` — đã nhầm 27/09).

```sql
-- hinh_bai = BÀI KHO (đề thi thực tế, nhiều ý)
alter table hinh_bai
  alter column ma_bai set default 'HLB' || lpad(nextval('hinh_bai_v3_seq')::text, 5, '0'),
  add column gia_thiet_chung text,          -- phần đề TRƯỚC ý a) ("Cho △ABC nhọn, …") — tách từ de_bai
  alter column anh_de drop not null;        -- NULL = chưa có hình = việc treo (§4 invariant), không chặn nhập
-- có sẵn, giữ nghĩa: de_bai (nguyên văn trọn bài) · nguon · khoi · mo_hinh_id (= NHÃN PHỎNG ĐOÁN P1, 1 bài 1 nhãn chính)
--                    trang_thai tam|chinh · da_duyet/duyet_boi/duyet_at
comment on table hinh_bai is 'HÌNH LUYỆN · bài kho = đề thi thực tế nhiều ý. KHÔNG phải hinh_baitoan (bài mô hình), KHÔNG phải hinh_hoc_bai (phần Học).';

-- hinh_y = Ý của bài kho
alter table hinh_y
  alter column ma_y set default 'HLY' || lpad(nextval('hinh_y_ma_seq')::text, 5, '0'),
  add column gia_thiet_them text,           -- giả thiết RIÊNG của ý ("Gọi M là trung điểm BC…"); NULL = ý không thêm gì (đúng nghĩa "không áp dụng")
  add column anh_de text;                   -- hình RIÊNG của ý; NULL = dùng hình gần nhất phía trước (ý trước có hình → hình bài)
-- có sẵn, giữ nghĩa: thu_tu · nhan_hien_thi · noi_dung (= CÂU HỎI của ý, nguyên văn) · dap_an · loi_giai · anh_loi_giai
--                    da_duyet · baitoan_id (NULL = chưa gán, P2) · co_thieu_node/mo_ta_thieu (hàng chờ P2) · ma_y
```

```sql
-- hinh_mo_hinh — phân loại để DỌN (B0.5). NULL = Thùy chưa xem.
alter table hinh_mo_hinh add column phan text check (phan in ('luyen','hoc'));
-- Hình luyện (màn + fn_hl_*) CHỈ đọc phan='luyen'. Phần Học không đổi gì (câu Học vẫn giữ mo_hinh_id).
-- Xoá thật một mô hình = RPC fn_hl_xoa_mo_hinh(id): liệt kê trước (bài mô hình · cách giải · biến thể · câu Học/bài kho sẽ mất nhãn)
-- rồi xoá lá → gốc trong 1 transaction. Chỉ Thùy bấm, từng cái, không xoá hàng loạt.
```

Quan hệ ý–ý ở P1: **tuyến tính theo `thu_tu`** (ý sau được dùng kết quả mọi ý trước). Không thêm cột phụ thuộc; P2 phụ thuộc thật đến từ tiền đề của bài mô hình.

### 2.5 Giả thiết CHUNG / RIÊNG — ba tầng, một luật chữ cái (CEO lưu ý 13/10)

Các bài cùng mô hình có giả thiết gần giống nhau: phần chung (= mô hình) + phần riêng (của bài / của ý). Xử lý **ở ba tầng**, hai tầng trên đã có và đang chạy:

| Tầng | Phần CHUNG | Phần RIÊNG | Derive |
|---|---|---|---|
| **Cành — mô hình ↔ mô hình cha** | `gia_thiet` của base (node tự phát biểu sâu nhất) | `gia_thiet_them` từng đời; `gt_thay_the` khi con là đặc-biệt-hoá có tên (HBH ⊃ hình thang) | `giaThietDayDu` (có) |
| **Cành — bài mô hình ↔ mô hình** | GT của **bài cha** (tiền đề chính); không cha ⇒ GT mô hình | `gia_thiet_rieng` (cộng) · `gt_thay_the` (thay) · `gia_thiet_phu` (vẽ thêm; van `keo_gt_phu` per cạnh kéo lên đề) | `giaThietBaiToan` · `noDapAn` (có) |
| **Lá — bài kho ↔ ý** | `hinh_bai.gia_thiet_chung` (phần đề trước ý a) | `hinh_y.gia_thiet_them` (dữ kiện xuất hiện lần đầu ở ý đó) | `fn_hl_bai_full`: GT hiệu lực của ý *i* = chung + ∪ thêm(*j* ≤ *i*) (mới) |

**Luật 1 — lá lưu nguyên văn, KHÔNG tách "phần trùng mô hình" ra cột riêng.** Phần chung giữa lá và cành là thứ **suy ra lúc gán** (người so hai cột GT cạnh nhau ở M3), không lưu kép — lưu kép là hai chỗ nói một chuyện, lệch là không ai thấy (CLAUDE.md §2.0 "công thức một nơi"). Lá giữ chữ cái của đề gốc; cành giữ chữ cái chuẩn của họ (spec v3 §2.9); **không ánh xạ chữ** (§0.3).

**Luật 2 — builder có HAI nguồn, không trộn trong một đề:**

| Nguồn | Chọn gì | Giả thiết của đề in ra | Ghép được gì |
|---|---|---|---|
| **Cành** (đề chuẩn — có sẵn) | tick bài mô hình, nhiều node cùng họ | `giaThietBaiToan` của node sâu nhất + gt phụ theo van; ý ẩn nở thành bước | ghép **xuyên bài mô hình** cùng họ — được, vì cùng bộ chữ |
| **Lá** (bài kho — mới) | tick ý của **một** bài kho | `gia_thiet_chung` + `gia_thiet_them` của mọi ý ≤ ý tick cao nhất; ý bỏ tick nở thành bước (D3) | chỉ ghép ý **trong cùng một bài kho**. Ghép ý của 2 bài kho khác nhau vào 1 đề = **cấm** (khác tên điểm, khác hình) |

Muốn "lấy ý b của đề trường X ghép ý c của đề trường Y" ⇒ **đi qua cành**: hai ý đó đã gán vào bài mô hình nào thì tick hai bài mô hình đó, ra đề chuẩn. Đây chính là *lý do cành phải tồn tại*: lá nào cũng đứng riêng theo chữ của đề gốc, chỉ cành mới có bộ chữ chung để ghép. (Đề in từ lá vẫn giá trị: HS thi gặp đúng lời văn/hình thật.)

**Luật 3 — gán ý → bài mô hình (P2) dùng chung/riêng làm gợi ý, không làm điều kiện cứng:** ý có `gia_thiet_them` ⇒ ứng viên là node ở **mô hình con** (có `gia_thiet_them` tương ứng) hoặc node có `gia_thiet_rieng`; ý không có ⇒ node của mô hình nhãn. Màn M3 hiện cạnh nhau *GT hiệu lực của ý* và *`giaThietBaiToan` của node* để người so; máy không so text. Lá có GT **thiếu** so với mô hình ⇒ gán lên mô hình **cha**; **thừa** ⇒ mô hình **con** — đúng luật "mô hình tối thiểu" (spec v3 §2.6), không sửa lá cho khớp.

**Luật 4 — dựng cành từ lá (P2, Thùy):** đọc N lá cùng nhãn: dữ kiện lặp ở nhiều lá ⇒ `gia_thiet` mô hình; chỉ ở một vài lá ⇒ `gia_thiet_them` mô hình con hoặc `gia_thiet_rieng` bài mô hình. Hỗ trợ: màn M2 có ngăn "lá cùng nhãn" hiện `gia_thiet_chung` + `gia_thiet_them` các lá xếp cột cạnh nhau (chỉ xem). Không máy tự gom.

### 2.6 Chuẩn bị tầng CÀNH NHỎ trong mô hình (CEO 13/10 — "sau này chắc chắn có, chưa cần ngay")

Mô hình có 10–30 bài mô hình nhưng không phải lá nào cũng thông nhau: cành chia thành **cành nhỏ 3–4 lá**. Bản chất = phân tầng như Đại:

| Đại (spec-ban-do-4-tang) | Hình luyện | Bảng | Trạng thái |
|---|---|---|---|
| Chủ đề | Họ mô hình (gốc `la_goc_ho`) | `hinh_mo_hinh` | có |
| Chuyên đề | Mô hình (bó giả thiết, DAG cha–con) | `hinh_mo_hinh` + `_cha` | có |
| **Nhóm bài** (KP, mastery) | **Cành nhỏ** — cụm 3–4 bài mô hình thông nhau | `hinh_mo_hinh_nhom` | **CHƯA — để dành** |
| Dạng bài | Bài mô hình | `hinh_baitoan` | có |
| Câu | Ý của bài kho | `hinh_y` | spec này |

Khác Đại ở một điểm: cành nhỏ **không mang giả thiết mới** (nếu mang ⇒ đó là mô hình con, đã có DAG). Cành nhỏ chỉ là *gom + đặt tên + thứ tự* — như "Nhóm bài" Đại sau khi CEO bỏ nối tiền đề 11/10.

**Dữ liệu gợi ý đã có:** đồ thị tiền đề `hinh_cach_tien_de` trong một mô hình ⇒ **thành phần liên thông** (`chuoiKetNoi`) ≈ cành nhỏ tự nhiên. Khi dựng tầng này, M2 gợi ý "cụm thông nhau" từ đồ thị, Thùy đặt tên/sửa — máy gợi, người quyết.

**Chuẩn bị NGAY (0 migration, chỉ quy ước) — ba điều CẤM để sau không phải phá:**
1. **Mã bài mô hình KHÔNG mã hoá cành nhỏ.** Giữ `BT.<khối>.<mh>.<stt>`; cấm mở rộng thành `BT.k.mh.nhom.stt` (chuyển bài sang cành khác sẽ phải cấp mã lại — policy 1a đã đủ đau ở tầng mô hình).
2. **Mọi hàm đo/rollup nhận TẬP `baitoan_id`**, không nhận `mo_hinh_id`: `fn_hl_mastery(hs, baitoan_id)` là nguyên tử; rollup = gọi trên tập — tập của cành nhỏ / mô hình / họ dùng **cùng một hàm**. Không viết `fn_..._theo_mo_hinh` riêng.
3. **UI M2/M3/builder không giả định 2 tầng** (mô hình → bài). Danh sách bài trong mô hình render từ một hàm "nhóm bài theo …" — nay trả 1 nhóm, mai trả N nhóm, màn không đổi.

**Khi tới lúc (1 migration, ~1 ngày):**
```sql
create table hinh_mo_hinh_nhom (id uuid pk, mo_hinh_id uuid not null references hinh_mo_hinh(id), mon text not null default 'Toán',
  ten text not null, thu_tu int not null default 0, ghi_chu text, created_at timestamptz default now());
alter table hinh_baitoan add column nhom_id uuid references hinh_mo_hinh_nhom(id) on delete set null;  -- NULL = chưa xếp (như ma_cum Đại)
-- bất biến: nhom.mo_hinh_id = baitoan.mo_hinh_id (trigger kiểm) · KP đo có thể dời từ bài mô hình lên cành nhỏ bằng rollup, lịch sử ý không đổi
```
+ M2 thêm swimlane cành nhỏ (kéo thả bài vào, như BanDoMoi) · builder nguồn cành: tick cả cành nhỏ = tick mọi bài trong nó.

Hàm Postgres (CLAUDE.md §2.0 — tính ở DB):
- `fn_hl_bai_full(bai_id)` → jsonb bài + mảng ý, mỗi ý đã **resolve hình** (`anh_de` của ý ∨ ý trước ∨ bài) và **giả thiết hiệu lực** (`gia_thiet_chung` + mọi `gia_thiet_them` của ý ≤ nó).
- `fn_hl_chon_y(bai_id, y_ids uuid[])` → khung in khi người dùng chọn tập ý: ý **không chọn** mà nằm trước ý chọn ⇒ nở thành **bước** trong ý chọn kế tiếp (đúng luật `noDapAn` hiện có, áp lên chuỗi tuyến tính). Chọn `{b}` của bài a,b,c ⇒ đề = giả thiết chung + gt thêm của a,b; lời giải b mở đầu bằng lời giải a dưới nhãn "bước".
- `fn_hl_tien_do(khoi)` → mỗi mô hình: số bài kho · số ý · số ý chưa duyệt · số ý chưa gán · số bài chưa hình.
- `fn_hl_mastery(hs_id, baitoan_id)` (P2) → từ lịch sử ý có `baitoan_id` đó, công thức 5 lần gần nhất Đ/C/S như Đại.

Trigger `updated_at` của `hinh_bai` bump khi sửa `hinh_y` (CLAUDE.md §2 "đổi con bump cha").

---

## 3. Pipeline NHẬP — tài liệu → bài kho đã tách ý (P1)

Tái dùng trọn luồng kho kiểu 1, chỉ khác **đầu ra có cấu trúc ý**:

| Bước | Công cụ | Có / Mới |
|---|---|---|
| B1 trích Word/PDF | `scripts/anh/docx_trich.mjs` | có |
| B2 **tách** (subagent Sonnet, nhóm ≤6 bài) | brief mới `docs/mau-brief-tach-y-hinh-luyen.md` | **mới** |
| B3 soát | `bang_hinh.mjs` + đọc nghi vấn | có |
| B4 nhập 1 transaction | `scripts/anh/nhap_hl_tu_draft.mjs` (clone `nhap_hh_tu_draft`) | **mới** |
| B5 gắn hình | `gan_hinh.mjs` mở rộng nhận `hinh_y.anh_de` | sửa nhỏ |
| B6 duyệt | ERP màn Kho › Hình luyện | **mới** (§4) |

**Subagent tách phải trả, cho mỗi bài:**

```
## BÀI <n> · nguồn: <đề trường / năm>   · mô hình phỏng đoán: <tên hoặc "?">
GIẢ THIẾT CHUNG: <phần đề trước ý a, nguyên văn>
HÌNH: hinh/b<n>.png                       ← vẽ bằng code theo dữ kiện giả thiết chung (ve_hinh_lib)
### a)
HỎI: <nguyên văn>
GT THÊM: —                                ← "—" = không có (ghi NULL)
ĐÁP ÁN: … / LỜI GIẢI: …
HÌNH: —                                   ← "—" = dùng hình bài
### b)
HỎI: …
GT THÊM: Gọi M là trung điểm BC.          ← dữ kiện xuất hiện LẦN ĐẦU ở ý này
HÌNH: hinh/b<n>b.png                      ← vẽ lại = hình bài + điểm mới; chỉ khi có GT THÊM làm đổi hình
…
NGHI VẤN: …
```

Luật tách (ghi vào brief): giả thiết xuất hiện lần đầu ở ý nào thì thuộc `GT THÊM` của ý đó, **không** đưa ngược lên giả thiết chung · hình ý = hình bài + dựng thêm, **không** vẽ sẵn thứ cần chứng minh · nguyên văn, không đổi tên điểm · ý "a) … b) …" mà sách gộp 2 hỏi trong 1 nhãn ⇒ tách 2 dòng `hinh_y`, `nhan_hien_thi` cùng chữ (cột có sẵn cho đúng ca này) · R1/R2 định dạng như phần Học.

**Nguồn P1:** file đề thi Word/PDF (chính) · 291 câu phần Học đã có `mo_hinh_id` = **ứng viên đưa vào pipeline tách** (nhập lại qua B2, không copy thẳng vì ý còn dính chung).

---

## 4. Màn ERP — Kho › Hình › tab **Hình luyện**

Vận hành theo **invariant**, không bảng việc (CLAUDE.md §4):

| Invariant | "Việc" sinh ra | Ai |
|---|---|---|
| ∀ bài kho ⇒ ∃ `anh_de` | bài chưa hình | người vẽ / Claude |
| ∀ ý ⇒ `da_duyet` | ý chờ duyệt | Thùy / học thuật |
| (P2) ∀ ý đã duyệt ⇒ ∃ `baitoan_id` ∨ `co_thieu_node` | ý chưa gán · hàng chờ node | TA gán / Thùy đặt node |

Màn:
1. **Kho bài** — lọc khối × mô hình (nhãn phỏng đoán) × trạng thái. Card: thumbnail hình bài · mã `HLB…` · nguồn · số ý · chip trạng thái từng ý (duyệt / chưa). Mở ⇒ đề chung + từng ý (câu hỏi · gt thêm · hình ý · đáp án) — sửa tại chỗ, vá phần tử (CLAUDE.md §2 React).
2. **Duyệt** — hàng đợi ý chưa duyệt, mẫu `DuyetBoTroYeuScreen` (nhớ vị trí, vá tại chỗ).
3. **Mô hình (vỏ)** — `Ho.tsx` có sẵn, thêm dòng "N bài kho · M ý" từ `fn_hl_tien_do`; **không** có nút tạo bài mô hình ở đây ở P1.
4. **(P2) Gán ý** — `KhoTam.tsx` M3 + `HangCho.tsx` M5 dùng nguyên.

**Builder tài liệu** (`SoanTaiLieu.tsx`): thêm nguồn **"Bài kho luyện"** cạnh nguồn "chuỗi node": chọn bài ⇒ popup tick ý (tái dùng `CayTickPopup` vẽ tuyến tính) ⇒ `hinh_gt_bai.loai='y'`, `ref_id = hinh_y.id` (cột có sẵn) ⇒ in qua `fn_hl_chon_y`. Giấy = app (memory `giay-va-app-giong-het-khong-xao`).

---

## 5. Phase 2 — dựng cành chi tiết, gắn lá

**P2 mở sẵn, không ngưỡng** (CEO 13/10). "Phase" chỉ là thứ tự việc tự nhiên: có lá mới thấy cành cần mọc thế nào — nhưng Thùy dựng bài mô hình lúc nào cũng được, gán ý lúc nào cũng được. Hai việc chạy song song với nhập kho.
1. Thùy/GV đọc N bài kho ⇒ dựng bài mô hình 1.1 … 1.k ở M2 (`SoDo.tsx`), mã tự sinh `BT.<khối>.<mh>.<stt>`.
2. TA gán `hinh_y.baitoan_id` ở M3; thiếu node ⇒ hàng chờ ⇒ Thùy đặt node ⇒ gán tiếp (vòng bottom-up spec v3 §0.5).
3. Gán tới đâu mastery theo bài mô hình hiện tới đó (`fn_hl_mastery`), lịch sử ý cũ **không mất**.
4. Mô hình của bài kho từ đây = **derive** từ ý đã gán (có thể nhiều); `hinh_bai.mo_hinh_id` chỉ còn là nhãn gốc lúc nhập.

---

## 6. Thứ tự build

| Bước | Việc | Xong khi |
|---|---|---|
| B0 | migration §2 + 3 hàm `fn_hl_*` P1 + comment bảng | `npm run schema` sạch; `fn_hl_chon_y` đúng với bài 3 ý chọn `{b}`, `{a,c}`, `{a,b,c}` |
| **B0.5** | **Màn "Dọn mô hình" — Thùy làm tay.** Lọc theo khối; mỗi dòng: mã · tên · số bài mô hình · số câu phần Học trỏ vào · số bài kho; 3 nút **Luyện / Học / Xoá** (Xoá hiện danh sách sẽ mất rồi mới xác nhận). Nút "Cả khối → Học" cho ca K8 nhưng vẫn ghi từng dòng | 41 mô hình không còn `phan` NULL; Hình luyện chỉ còn thấy mô hình `luyen` |
| B1 | brief tách + `nhap_hl_tu_draft.mjs` + mở rộng `gan_hinh.mjs` | nhập thật **1 đề 5 bài** của K7 (mô hình Trực tâm hoặc Hai tiếp tuyến) — 5 `hinh_bai`, ~15 `hinh_y`, hình ý b/c vẽ code đúng dữ kiện, `da_duyet=false` |
| B2 | màn Kho bài + Duyệt | Thùy duyệt 15 ý trên ERP, sửa 1 ý tại chỗ không reload list |
| B3 | builder nguồn "Bài kho luyện" | in 1 phiếu chọn ý `{b}` ra đúng đề + bước a |
| B4 | nhập hàng loạt K7 → mục tiêu 30 bài/mô hình cho 2 mô hình | `fn_hl_tien_do` hiện 2 mô hình ≥30 |
| P2 | §5 — màn M2 (dựng bài mô hình) + M3 (gán ý) + M5 (hàng chờ) có sẵn, **mở ngay cùng B2**, chỉ kiểm lại chúng đọc đúng `hinh_y` mới + `phan='luyen'` | mastery theo bài mô hình hiện cho 1 HS thật |

---

## 7. OUT (không làm đợt này)
Đổi tên bảng `hinh_bai`/`hinh_y` · AI tự gán ý → bài mô hình · biến thể/lứa đổi đỉnh cho bài kho · MCQ hoá ý hình · app HS làm bài Hình luyện (chờ P1 có data) · kéo tự động 291 câu phần Học.

---

## 8. Done-when toàn spec (P1)
- [ ] Migration áp, `schema.md` commit cùng.
- [ ] 1 đề Word → 5 bài kho đã tách ý, có gt thêm + hình riêng ý, Thùy duyệt trên ERP.
- [ ] Chọn ý bất kỳ ⇒ đề + lời giải in đúng (ý bỏ chọn thành bước).
- [ ] Mô hình hiện "N bài kho" mà **không** có dòng `hinh_baitoan` mới nào ra đời.
- [ ] Làm bài trên app/giấy ghi được `hinh_y_id` (hook có sẵn, chỉ kiểm lại).

---

## 9. Bốn chỗ cần CEO gật (R1 — đích, không phải kỹ thuật)

| # | Câu hỏi | CTO đề xuất |
|---|---|---|
| D1 | Giữ tên bảng `hinh_bai`/`hinh_y`, chỉ đổi tiền tố mã `HLB`/`HLY`? | **Giữ** (0 dòng nhưng code + hook đo đã trỏ vào; đổi tên = churn, không đổi gì về nghĩa) |
| D2 ✅ | 366 bài mô hình + 41 mô hình đã xây top-down: giữ hay dọn? | **CEO 13/10: đang lẫn Học/Luyện (K8 toàn Học) ⇒ giữ nhưng phải có bước THỦ CÔNG để Thùy loại cái không phù hợp** → B0.5 + cột `phan` |
| D3 ✅ | Chọn ý: bất kỳ tập hay chỉ tiền tố? | **CEO 13/10: bất kỳ** — ý bỏ chọn nở thành bước |
| D4 ✅ | Ngưỡng mở P2? | **CEO 13/10: không ngưỡng, mở sẵn.** Mô hình = tầng tham chiếu (cành), bài = lá; cành luôn có để gắn lá. Đề xuất ngưỡng của CTO là sai bản chất — bỏ |
