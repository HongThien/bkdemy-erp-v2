# SPEC — Kho Hình học (nhánh `hinh`) · BKdemy ERP v2

> **BẢN CUỐI. Thay thế hoàn toàn `spec-kho-hinh.md` (v1) và `spec-kho-hinh-v2.md` (v2).** Nếu hai file kia còn trong repo → xoá, chúng sai tầng model.
> **Tham chiếu hình ảnh:** `mockup-kho-hinh-v4.html` — mở file này trước khi build UI. Spec mô tả *cái gì*, mockup cho thấy *trông ra sao*.
> **Phạm vi:** schema + hai lưới + kho nhập + hai chế độ soạn tài liệu.
> **ADR-mon §1.6:** mọi dữ liệu học tập mang `mon`. Hình = nhánh riêng của Toán, họ bảng `hinh_*`. **Cấm `if mon==='Toán'`.**

---

## §0. MODEL — đọc hết phần này trước khi viết dòng code đầu tiên

### 0.1 Ẩn dụ chi phối toàn bộ thiết kế

Giả thiết của bài toán = **một xô nước**. Đổ nước → chảy xuống được **một số nhánh** trong cây. Muốn đi sâu hơn phải **đổ thêm nước** (thêm giả thiết). Ra đề chỉ được chọn câu mà **nước đã chạm tới**.

### 0.2 Bốn tầng

```
① HỌ MÔ HÌNH — các họ ĐỘC LẬP với nhau, không nối sang nhau
     vd: họ Trực tâm · họ Hai tiếp tuyến · họ Tứ giác nội tiếp

② LƯỚI MÔ HÌNH (trong một họ)          ← NGƯỜI xây, top-down
     Node = bó giả thiết. Con = cha + giả thiết mới.
     Kế thừa: cha có tính chất gì, con dùng được hết.
     DAG (cho phép nhiều cha), thực tế v1 thường 1 cha.

③ LƯỚI BÀI TOÁN NHỎ                    ← NGƯỜI xây, top-down. LƯỚI RIÊNG, độc lập ②
     Node = một tính chất / bài toán nhỏ / "ý chuẩn".
     · thuộc mô hình TỐI THIỂU (nơi nước lần đầu chạm tới)
     · nhiều CÁCH GIẢI; mỗi cách có bộ tiền đề + dạng + bổ đề riêng
     · tiền đề ĐI XUYÊN MÔ HÌNH TỰ DO
       (node ở mô hình con link thẳng về node của mô hình ông — hợp lệ)
     · cấp độ = số tính chất phải CM trước nó. TOÀN CỤC, không reset theo mô hình.

④ KHO BÀI VẬT LÝ                       ← ÁNH XẠ từ lưới. KHÔNG phải node của lưới nào.
     Bài = tổ hợp ý đã dùng thực tế + nguồn (đề trường X, năm Y).
     Ý = BẢN THỂ HIỆN: nguyên văn + hình riêng của đề gốc + con trỏ tới node ③.
```

### 0.3 Bảng cấm — mỗi dòng là một lỗi đã xảy ra trong quá trình thiết kế

| SAI | ĐÚNG |
|---|---|
| Bài nối bài (cha–con giữa các bài) | Bài **toả ra** từ mô hình. Bài không nối bài. 10 bài hỏi 10 phương diện của cùng cấu hình thì không thể xếp cha–con — chính chỗ đó đẻ ra khái niệm mô hình |
| Cấp độ reset về 1 trong mỗi mô hình con | Cấp độ **toàn cục**, đếm xuyên mô hình |
| Cấp độ cộng thêm độ sâu mô hình | Độc lập. **Mô hình con cấp 5 vẫn có bài cấp 1** (câu suy thẳng từ giả thiết mới) |
| Độ sâu mô hình quyết độ khó | Độ khó ← **cấp độ**. Độ sâu chỉ để **định vị cấu trúc** |
| Đẻ node lưới từ màn gán bài | Gặp ý chưa có node → **cờ thiếu + hàng chờ**. Vị trí lưới **không suy được** từ đề bài |
| Tiền đề gắn ở bài toán | Tiền đề gắn ở **cách giải**. Nhiều cách giải = nhiều bộ tiền đề |
| Ánh xạ tên điểm để thay chữ trong lời giải | **Không thay chữ.** Tài liệu chuẩn dùng bộ chữ cái chuẩn nhất quán, HS tự đối chiếu |
| Chuẩn hoá ý về node rồi in theo chữ node | In bài thật theo **nguyên văn đề gốc** |
| Gán ở tầng bài | Gán ở **tầng ý** |
| Một cổng duy nhất "gán đủ mới dùng được" | **Hai cổng** — xem §2.4 |

### 0.4 Hai hành vi phải TÁCH — nguyên tắc quan trọng nhất

| | Xây lưới | Gán bài |
|---|---|---|
| Bản chất | chuyên môn, cân nhắc vị trí | tra cứu, cơ học |
| Ai làm | Thùy / GV cứng | TA giao được |
| Màn | M1, M2 | M3 |
| Được tạo node? | **CÓ** | **KHÔNG** |

Lý do cấm: bài mới có thể cách bài cũ **mấy lớp** trong lưới. Tạo node lúc gán = đoán vị trí. Rác trong lưới đắt hơn rác trong kho bài rất nhiều lần.

### 0.5 Top-down và bottom-up chạy song song

- **Top-down**: Thùy xây trước một phần lưới theo năng lực chuyên môn.
- **Bottom-up**: ý không tìm được node → **hàng chờ** → cho biết lưới **còn thiếu gì** → Thùy vào M2 đặt node đúng chỗ → bài tự nối được.

Bottom-up **cấp tín hiệu**, **không cấp quyền ghi** vào lưới.

---

## §1. SCHEMA

Ảnh: bucket `kho-anh`, DB lưu URL.

```sql
-- ══════════ ② LƯỚI MÔ HÌNH ══════════
hinh_mo_hinh (
  id            uuid pk default gen_random_uuid(),
  mon           text not null default 'Toán',
  ma            text not null unique,       -- MÃ TRƠ. CẤM mã hoá thứ bậc ("MH.1.1.2" là sai)
  ten           text not null,              -- "Trực tâm" / "Trực tâm + EF∩BC=M"
  gia_thiet     text not null,              -- bó giả thiết đầy đủ, text + LaTeX $...$
  gia_thiet_them text,                      -- phần CỘNG so với cha (mô tả ngắn, hiện trên cạnh lưới)
  anh_cau_hinh  text,                       -- hình chuẩn của mô hình
  la_goc_ho     boolean not null default false,  -- gốc của một họ (không cha)
  cap_mo_hinh   smallint check (cap_mo_hinh between 1 and 4),  -- 1 = lớn nhất. NGƯỜI đặt, null = chưa xếp
  khoi          text,
  ghi_chu       text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

hinh_mo_hinh_cha (                          -- DAG: cho phép nhiều cha
  mo_hinh_id uuid not null references hinh_mo_hinh(id) on delete cascade,
  cha_id     uuid not null references hinh_mo_hinh(id) on delete cascade,
  primary key (mo_hinh_id, cha_id),
  check (mo_hinh_id <> cha_id)
);
-- chặn chu trình ở tầng service (tái dùng logic descendant của OrgChartScreen)

-- ══════════ ③ LƯỚI BÀI TOÁN NHỎ ══════════
hinh_baitoan (                              -- = tính chất = "ý chuẩn"
  id          uuid pk default gen_random_uuid(),
  mon         text not null default 'Toán',
  ma          text not null unique,         -- MÃ TRƠ
  phat_bieu   text not null,                -- phát biểu CHUẨN HOÁ (bộ chữ cái chuẩn của họ)
  mo_hinh_id  uuid not null references hinh_mo_hinh(id),  -- mô hình TỐI THIỂU (§2 luật 6)
  cap         smallint not null,            -- NHẬP TAY. Toàn cục, xuyên mô hình
  de_bai_chuan text,                        -- đề bài chuẩn (hiện ở detail panel + tài liệu chuẩn)
  anh_chuan   text,                         -- hình chuẩn
  ghi_chu     text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

hinh_cach_giai (                            -- v1 mỗi node điền 1 cách (ngắn nhất); cấu trúc mở sẵn cho nhiều
  id          uuid pk default gen_random_uuid(),
  baitoan_id  uuid not null references hinh_baitoan(id) on delete cascade,
  ten         text,                         -- "cách ngắn nhất" / "bằng phương tích"
  dang_id     uuid not null references hinh_dang(id),   -- ĐÚNG 1, trỏ LÁ (cap='dang')
  loi_giai    text,
  anh_loi_giai text,
  la_mac_dinh boolean not null default false,
  thu_tu      int default 0
);

hinh_cach_tien_de (                         -- tiền đề THUỘC CÁCH GIẢI
  cach_id     uuid not null references hinh_cach_giai(id) on delete cascade,
  tien_de_id  uuid not null references hinh_baitoan(id) on delete cascade,
  primary key (cach_id, tien_de_id)
);
-- ĐI XUYÊN MÔ HÌNH tự do. Chặn chu trình ở service.

hinh_cach_bo_de (
  cach_id  uuid not null references hinh_cach_giai(id) on delete cascade,
  bo_de_id uuid not null references hinh_bo_de(id) on delete cascade,
  primary key (cach_id, bo_de_id)
);

-- ══════════ CATALOG ══════════
hinh_dang (                                 -- 2 tầng: loại câu hỏi › cách xử lý
  id uuid pk default gen_random_uuid(),
  mon text not null default 'Toán',
  ma text not null unique,
  ten text not null,
  cap text not null check (cap in ('loai_ch','dang')),
  cha_id uuid references hinh_dang(id),     -- dang → loai_ch
  thu_tu int default 0
);

hinh_bo_de (                                -- PHẲNG
  id uuid pk default gen_random_uuid(),
  mon text not null default 'Toán',
  ma text not null unique,
  ten text not null,
  phat_bieu text,
  thu_tu int default 0
);

-- ══════════ ④ KHO BÀI VẬT LÝ ══════════
hinh_bai (
  id         uuid pk default gen_random_uuid(),
  mon        text not null default 'Toán',
  ma_bai     text not null unique,
  de_bai     text not null,                 -- NGUYÊN VĂN đề gốc (chữ cái của đề, KHÔNG chuẩn hoá)
  anh_de     text not null,                 -- BẮT BUỘC
  nguon      text,                          -- "THCS Cầu Giấy — HK1 2025"
  khoi       text,
  trang_thai text not null default 'tam' check (trang_thai in ('tam','chinh')),
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

hinh_y (                                    -- BẢN THỂ HIỆN của một bài toán nhỏ
  id            uuid pk default gen_random_uuid(),
  bai_id        uuid not null references hinh_bai(id) on delete cascade,
  thu_tu        int not null,               -- 1=a, 2=b, 3=c
  nhan_hien_thi text,                       -- "b" khi 2 ý nguyên tử in chung một nhãn
  noi_dung      text not null,              -- NGUYÊN VĂN đề gốc
  dap_an        text,
  loi_giai      text,                       -- NULLABLE → trống thì lấy từ node (§3)
  anh_loi_giai  text,                       -- NULLABLE → trống thì lấy anh_chuan của node
  da_duyet      boolean not null default false,   -- chỉ in cho HS khi đã duyệt
  baitoan_id    uuid references hinh_baitoan(id), -- NULL = chưa gán
  co_thieu_node boolean not null default false,
  mo_ta_thieu   text,                       -- người gán mô tả → hàng chờ
  unique (bai_id, thu_tu)
);
```

**Index:** `hinh_baitoan(mo_hinh_id)` · `hinh_baitoan(cap)` · `hinh_cach_giai(baitoan_id)` · `hinh_cach_tien_de(tien_de_id)` · `hinh_mo_hinh_cha(cha_id)` · `hinh_mo_hinh(la_goc_ho)` · `hinh_y(bai_id)` · `hinh_y(baitoan_id)` · `hinh_y(co_thieu_node) where co_thieu_node` · `hinh_bai(trang_thai)` · `hinh_dang(cha_id)`

### 1.1 Derive — KHÔNG lưu cột

| Giá trị | Cách tính |
|---|---|
| độ sâu mô hình | từ `hinh_mo_hinh_cha` |
| họ của một mô hình | truy lên tới `la_goc_ho` |
| mô hình của một **bài** | hợp mô hình của các node mà ý trỏ tới (một bài có thể mang **nhiều** tag mô hình) |
| lý thuyết của mô hình | mọi `hinh_baitoan` của nó **+ kế thừa toàn bộ từ tổ tiên**, nhóm theo `cap` |
| **cấp gợi ý** | `1 + max(cap tiền đề)` theo cách mặc định; không tiền đề ⇒ 1. **Chỉ đối chiếu & cảnh báo lệch — KHÔNG ghi đè `cap` nhập tay** |
| `muc_do` của ý | tra `NGUONG_DO_KHO` từ `cap` của node; **+1 bậc nếu cách giải có bổ đề**; người ghim đè được |
| bao đóng tiền đề | đệ quy `hinh_cach_tien_de` theo cách mặc định |
| vùng chưa khai thác | mô hình có ít/không có `hinh_baitoan` ở dải cấp nào đó |

```ts
// src/lib/kho/hinhConfig.ts — PROVISIONAL. Sửa Ở MỘT CHỖ, toàn kho tính lại.
export const NGUONG_DO_KHO = [
  { do_kho: 1, cap_tu: 1, cap_den: 2 },
  { do_kho: 2, cap_tu: 2, cap_den: 3 },
  { do_kho: 3, cap_tu: 3, cap_den: 4 },
  { do_kho: 4, cap_tu: 5, cap_den: 7 },
  { do_kho: 5, cap_tu: 8, cap_den: 99 },
];
```

---

## §2. LUẬT BẤT BIẾN

1. **Mã trơ.** `ma` không mã hoá vị trí. Ghép cha mới = thêm cạnh, không đánh lại mã.
2. **Cấm đẻ node từ M3.** Chỉ M1/M2 tạo được node lưới. Màn gán **không có nút tạo node**.
3. **Không chặn nhập liệu.** Ý chưa gán được → cờ thiếu, bài vẫn lưu ở kho tạm.
4. **Hai cổng:**
   - **Cổng 1 → kho chính:** mọi ý đã gán `baitoan_id`. Qua cổng là bài **dùng được** (in, giao, soạn phiếu ôn tập).
   - **Cổng 2 (làm dần theo nhánh, KHÔNG chặn cổng 1):** nối tiền đề + chốt cấp. Mở khoá: tài liệu chuẩn + soạn giáo trình theo mạch.
5. **Tiền đề gắn ở CÁCH GIẢI**, không ở bài toán.
6. **`mo_hinh_id` = mô hình TỐI THIỂU** — nơi nước lần đầu chạm tới, **KHÔNG phải mô hình của đề đang nhập**. Sai luật này ⇒ cùng một tính chất bị khai ở cả cha lẫn mọi con.
7. **Search-before-create ở M2**: tạo node mới phải hiện node gần giống (cùng mô hình + cha/con). **Nhắc, không chặn** — trùng thì lọc sau.
8. **Chặn chu trình** cả hai lưới.
9. **Bộ chữ cái chuẩn thống nhất trong một họ** (họ Trực tâm luôn `△ABC`, trực tâm `H`, chân đường cao `D·E·F`). Bài thật giữ nguyên văn đề gốc.
10. **Gán ở tầng Ý.**
11. Seam: UI **không** gọi `supabase` trực tiếp, chỉ qua `src/lib/kho/api.ts` section `hinh_*`. `.limit(10000)` mọi list. Business logic ở Postgres.

---

## §3. ĐÁP ÁN HAI BẬC

| Bậc | Nguồn | Khi nào |
|---|---|---|
| **Chuẩn xác** | `hinh_y.loi_giai` / `anh_loi_giai` có giá trị | GV gõ riêng cho bài đó |
| **Tham chiếu** | rơi về `hinh_baitoan` (đề chuẩn + `anh_chuan`) + lời giải của cách mặc định | ý để trống — **mặc định** |

Nhập một bài chỉ cần **đề + hình đề + gán node**; đáp án lấy từ node, miễn phí. Bậc tham chiếu **khác tên điểm** so với đề gốc — chấp nhận được, đủ tính tham chiếu. **Không thay chữ, không ánh xạ điểm.**

`da_duyet` = false thì bậc tham chiếu chỉ GV xem, không in cho HS.

---

## §4. MÀN HÌNH

Gu UI staff: clean/modern nhiều màu, **KHÔNG sci-fi**.
Mã màu xuyên suốt: **mô hình = teal · bài toán nhỏ = xanh dương · dạng = tím · bổ đề = hổ phách**.
**Tham chiếu bố cục: `mockup-kho-hinh-v4.html`.**

### M0 — Chọn họ mô hình gốc
Lưới card các họ (Trực tâm, Hai tiếp tuyến, Tứ giác nội tiếp…). Card: hình cấu hình lớn · mã · tên · giả thiết · số mô hình con · số bài toán · dải cấp. Các họ **độc lập**, không nối sang nhau.

### M1 + M2 — Sơ đồ của một họ, HAI VIEW (toggle)
Cùng một graph, chiếu thành hai mặt phẳng 2D:

**View bài toán** (chiếu bỏ trục giả thiết → còn trục suy luận)
- Cột = **cấp độ** (Cấp 1, 2, 3, 4…). Node xếp trong cột theo cấp.
- Node của **mô hình con** hiện viền teal **ngay trong cùng cột** — cấp là toàn cục, không reset.
- Cạnh = tiền đề. Cạnh **xuyên mô hình** vẽ nét đứt màu teal.
- Detail panel: phát biểu · mã · cấp (nhập tay) · **cấp gợi ý + cảnh báo lệch** · mô hình · **đề bài chuẩn** · **đáp án đầy đủ** · hình chuẩn · danh sách cách giải (dạng + bổ đề + tiền đề) · **các ý thực tế đang trỏ tới node này** (mã bài + nguồn).
- Tạo node: search-before-create.

**View mô hình** (chiếu bỏ trục suy luận → còn trục giả thiết)
- Cột = **tầng** (độ sâu trong họ). Card = mô hình.
- Detail panel: giả thiết · giả thiết cộng thêm · hình cấu hình · **danh sách bài toán trong mô hình đó, nhóm theo cấp** · dòng kế thừa ("mô hình con dùng được toàn bộ N bài toán này").

### M3 — Kho tạm + màn gán  *(cơ học, TA làm được)*
Trái: đề bài nguyên văn + hình đề + **mô hình derive** từ các ý đã gán.
Phải: từng ý — nguyên văn · hình đáp án · **ô gán** (search theo phát biểu chuẩn; phạm vi gợi ý = mô hình của các ý đã gán + tổ tiên/hậu duệ, mở rộng toàn kho được).
- Gán được → hiện cấp + dạng + bổ đề + độ khó đọc từ node (**chỉ xem, không sửa ở đây**).
- Không thấy → nút **"Thiếu node trong sơ đồ"** + ô mô tả → hàng chờ. **KHÔNG có nút tạo node.**
- Thanh tiến độ `n/m ý đã gán`. Đủ → nút **Chuyển sang kho chính** sáng.
- Ghi chú UI: đề dùng `MNP/K`, node chuẩn dùng `ABC/H` — biến thể điểm, gán bình thường.

### M4 — Kho chính
Bài đã gán đủ. Card: thumbnail hình đề · mã · nguồn · **tag mô hình (derive, có thể nhiều)** · dải cấp · dải độ khó · số ý. Lọc theo mô hình / dạng / cấp / độ khó.

### M5 — Hàng chờ  *(kênh bottom-up)*
Ý gắn cờ thiếu node, gom theo mô hình phỏng đoán, kèm mô tả người gán. Mỗi dòng có nút **"Đặt node"** → nhảy sang M2 với mô tả điền sẵn.

### M6 — Danh sách dạng bài
2 tầng (loại câu hỏi › cách xử lý). Tra ngược: chọn dạng → các **bài toán nhỏ** dùng dạng đó, **kèm tag mô hình** (một dạng trải nhiều họ). Ghi chú rollup: đọc tầng trên = mẫu lớn tín hiệu chắc; đọc ở lá = dè dặt.

### M7 — Danh sách bổ đề
Phẳng, có phát biểu. Tra ngược: chọn bổ đề → các bài toán nhỏ dùng nó, kèm cấp + mô hình.

### M8 — Tài liệu chuẩn  *(cần cổng 2)*
Trái: **danh sách chuỗi** (không phải danh sách bài), mỗi chuỗi ghi phục vụ bao nhiêu bài thật.
Phải: bản in — **đề chuẩn** (giả thiết lấy từ **mô hình sâu nhất mà chuỗi chạm tới**) + **hình chuẩn** (của node sâu nhất) + **lời giải liền mạch** theo chuỗi tiền đề, các bước không có trong đề gắn nhãn *"không có trong đề"*.
Đầu trang ghi rõ: **"Bài tương đương — tên điểm theo hệ thống"**. Cache theo chuỗi, tái dùng cho mọi bài đi cùng chuỗi.

### M9 — Soạn tài liệu, HAI CHẾ ĐỘ (toggle)

**Chế độ Giảng dạy** — rút từ **node chuẩn**
- Cấu hình: **Từ A → Đến B**. Một buổi = **một khúc**, không in lại từ cấp 1.
- Nội dung khúc = các node giữa A và B (bao đóng tiền đề của B, giới hạn trong khúc), sắp topo theo cấp.
- **Nhắc lại đầu buổi**: tiền đề nằm **dưới A** ⇒ buổi trước đã dạy ⇒ đưa vào mục nhắc lại.
- **Cảnh báo khúc hở**: tiền đề **không nằm dưới A** ⇒ HS chưa học ⇒ báo đỏ, nút *"Thêm vào buổi"* / *"Đánh dấu đã học"*.
- **Tự chia chương**: đường đi cắt biên mô hình ⇒ chèn mốc *"Nay cho thêm: EF cắt BC tại M"*.
- **Chuỗi buổi**: chọn nhiều mốc → chia cả giáo trình thành các buổi.

**Chế độ Ôn tập** — rút từ **bài thật** trong kho chính
- Chọn **dạng bài**, **không ràng buộc mô hình** (chip "mọi mô hình").
- Kết quả = các **ý** thuộc dạng đó, trải nhiều họ — khác hình vẽ, khác lời văn, khác tên điểm. Đó chính là điều ôn tập cần.
- Tick từng ý. Giỏ đếm: số ý · **số họ mô hình phủ được** · độ khó TB.

---

## §5. THỨ TỰ BUILD — theo phase, không làm một lượt

| Phase | Nội dung | Điều kiện xong |
|---|---|---|
| **P1** | Schema + `api.ts` seam + M6/M7 (catalog dạng, bổ đề) | migration sạch, CRUD catalog chạy |
| **P2** | M0 (chọn họ) + M1/M2 (hai view sơ đồ) | dựng được 1 họ 3 tầng, ≥10 bài toán trải ≥4 cấp, ≥1 cạnh tiền đề xuyên mô hình |
| **P3** | M3 (kho tạm + gán) + M5 (hàng chờ) | nhập 3 bài thật, gán được, vòng bottom-up chạy trọn |
| **P4** | M4 (kho chính) + M9 chế độ **Ôn tập** | lọc theo dạng ra ý từ nhiều họ |
| **P5** | M9 chế độ **Giảng dạy** + M8 (tài liệu chuẩn) | cần cổng 2 có data — làm sau cùng |

⚠ **Lưới trước, gán sau.** Gán chỉ là ánh xạ — không có lưới thì không ánh xạ vào đâu.
⚠ **P5 phụ thuộc dữ liệu tiền đề**, đừng build khi lưới còn rỗng.

**Seed:** mã `915xx` kho V1 ("Mô hình Hai tiếp tuyến", "Ba tiếp tuyến", "Tiếp tuyến–Dây cung") → `hinh_mo_hinh`. ⚠ Chúng là node **giữa** lưới, không phải gốc họ; gốc phải dựng thêm.

---

## §6. BẮT BUỘC TRƯỚC MIGRATION

Luật cố định của Thùy — vi phạm = sai quy trình:

1. Dump `information_schema.columns` cho mọi bảng sẽ join **và** cho `dai_ban_do` + `dai_cau_hoi` → `hinh_*` mirror đúng convention cột họ `dai_*` (tên cột, kiểu, default, timestamps).
2. Dump `pg_tables.rowsecurity` → convention BKdemy: **bảng dữ liệu DISABLE RLS, chỉ `staffs` ENABLE**. Không đoán.
3. Grep toàn codebase trước khi đụng shared component (`branches.ts`, `khoCuaMon`, `MON_TABS`, `DangPickerOne`) — ưu tiên **trích shared component**, cấm copy-paste patch. (ADR-017 sót HomePage inline copy → hai form cùng tồn tại production.)

---

## §7. DONE WHEN

- [ ] Migration sạch: 10 bảng `hinh_*` + index, mirror convention `dai_*`, RLS đúng convention.
- [ ] `api.ts` section `hinh_*`: CRUD đầy đủ + derive (độ sâu, họ, kế thừa lý thuyết, cấp gợi ý, `muc_do` từ ngưỡng, bao đóng tiền đề). **UI không gọi `supabase` trực tiếp.**
- [ ] M0: các họ hiện đúng, độc lập.
- [ ] M1/M2: toggle hai view chạy; view bài toán xếp cột theo cấp, node mô hình con nằm **cùng cột** với viền teal; **≥1 cạnh tiền đề xuyên mô hình** vẽ đúng; cảnh báo lệch cấp hiện đúng; search-before-create hoạt động.
- [ ] M3: nhập 1 bài thật (đề + hình đề + 3 ý nguyên văn); gán ý → node; **không tồn tại đường nào tạo node từ M3**; ý không gán được → hàng chờ.
- [ ] M5 → M2 → quay lại gán: vòng bottom-up chạy trọn.
- [ ] Cổng: bài chỉ sang kho chính khi mọi ý đã gán; **cổng 2 không chặn cổng 1**.
- [ ] Đáp án 2 bậc: ý để trống `loi_giai` thì hiển thị bản của node, có nhãn phân biệt bậc.
- [ ] M4: lọc theo mô hình / dạng / cấp / độ khó; bài nhiều mô hình hiện **nhiều tag**.
- [ ] M6/M7: tra ngược ra danh sách bài toán nhỏ kèm mô hình.
- [ ] M9 Ôn tập: chọn dạng → ra ý từ **≥2 họ mô hình khác nhau**.
- [ ] M9 Giảng dạy: khúc A→B in đúng; **nhắc lại** và **cảnh báo hở** phân loại đúng theo "tiền đề có nằm dưới A hay không"; mốc chuyển chương chèn đúng chỗ cắt biên mô hình.
- [ ] M8: chuỗi sinh được đề chuẩn + hình chuẩn + lời giải liền mạch, bước trung gian gắn nhãn.
- [ ] `tsc` + `build` sạch.

---

## §8. OUT — spec riêng, KHÔNG làm ở lần này

Sinh đề tự động (gợi ý a·b từ chuỗi tiền đề của c) · kiểm tra "đề thiếu giả thiết" tự động · công thức Measurement 3 trục · in ấn/PDF bản Hình (`PrintView` — layout hình đề + hình đáp án theo ý, khác hẳn Đại) · AI parse đề Hình · tách giả thiết thành thực thể nguyên tử · full mọi cách giải · quy chuẩn 4 bậc cấp mô hình.

> **Hook reserve NGAY (rẻ lúc dựng, không cứu được nếu quên):** ref vận hành (chấm / ET / BTVN / `canh_bao_yeu`) trỏ vào Hình phải mang `ma_y` **và** `ngu_canh_luot ∈ {mo_hinh, dang, luyen_de}` — lượt dạy nào sinh ra quan sát. Thiếu field này thì Measurement sau phải chấm lại từ đầu.
>
> Lý do: buổi lượt-1 (dạy mô hình) scaffold sẵn dạng+bổ đề → ý sai ⇒ quy về **mô hình**; buổi lượt-2 (dạy dạng) mô hình đã quen → sai ⇒ quy về **dạng**. Không có nhãn ngữ cảnh thì ba trục chồng lên một quan sát, không gỡ được.
