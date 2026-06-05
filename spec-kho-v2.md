# SPEC — Kho v2: Canonical Knowledge (Đại số + Hình học)

> **Phạm vi spec này:** schema + CRUD nhập/sửa/lọc cho Lớp Canonical Knowledge của ERP v2 (cả nhánh Đại và Hình).
> **KHÔNG bao gồm** (spec riêng sau): pipeline AI tách câu từ file → duyệt; auto-chấm (accepted answers); công thức đo mastery (Measurement).
> **Thực thi:** Claude Code dựng trên **Supabase project MỚI** (v2). Không migrate từ v1 — bản đồ được nhập tay theo cấu trúc mới.
> **Người duyệt spec:** Thùy. Claude Code code theo spec, không tự ý phình.

---

## 0. Hai nhánh — vì sao tách

Đại và Hình **khác nhau về số chiều**, không phải khác về số tầng:

| | ĐẠI | HÌNH |
|---|---|---|
| Đơn vị kho | **Câu** | **Bài** (gồm nhiều Ý) |
| Cây tri thức | 4 tầng cứng, lá = **Dạng** | 3 tầng, lá = **Dạng-hình (câu hỏi+phương pháp)** |
| Phân loại | 1 chiều: mỗi câu = 1 Dạng | 3 chiều: mô hình × câu-hỏi × bổ đề |
| Treo gì vào đâu | Câu → 1 Dạng (+ bổ đề opt-in) | Bài → Mô hình; mỗi Ý → 1 Dạng-hình + n Bổ đề |
| Clone bài tương tự | Được (nhiều bài/dạng) | Không (giao 3 chiều gần như độc nhất) → **không có tầng-4** |
| Mục đích đo | **Kết luận** (mastery theo Dạng) | **Định hướng** (tỉ lệ theo từng chiều, mẫu lớn, chấp nhận sai số) |

Cùng một cơ chế lưu (đối tượng + bảng tag có danh mục kiểm soát), khác bộ danh mục.

---

## 1. Luật nền (Claude Code BẮT BUỘC tuân)

1. **Không đoán schema.** Trước khi viết query/migration đụng bảng có sẵn, verify bằng `information_schema.columns` + `pg_tables.rowsecurity`. Không nhớ, không suy.
2. **Mọi tính toán đặt ở Postgres** (view / function), không tính ở client.
3. **`.limit(10000)` trên mọi truy vấn danh sách** ở tầng app.
4. **FK tường minh ở mọi quan hệ.** Không quan hệ ngầm.
5. **RLS = OFF** cho toàn bộ bảng dữ liệu trong spec này (chưa có `staffs` trong phạm vi Kho; khi thêm `staffs` ở scope khác thì bảng đó bật RLS).
6. **`khoi` không lưu rời** nếu suy được từ tên lớp/đề — nhưng trong Kho, `khoi` là thuộc tính phân loại của node bản đồ → lưu trực tiếp (không có "tên lớp" để suy ở đây).
7. Khi deploy ADR đổi schema/UX: **grep toàn repo tìm mọi nơi dùng schema/component cũ TRƯỚC khi deploy**; ưu tiên tách component dùng chung hơn copy-paste.

---

## 2. Quy ước chung toàn Kho

- **Khóa chính = text tự sinh**, có prefix dễ đọc, sinh tự động qua sequence (người nhập không phải nghĩ mã). Mẫu: `PREFIX || lpad(nextval(seq)::text, 5, '0')`.
- **Câu/Bài vào kho = mặc định đã duyệt.** Không có cờ `da_verify` (cờ duyệt nếu cần sẽ nằm ở tầng draft của pipeline — spec sau).
- **Ảnh đi theo cặp:** có `anh_de` thì phải có `anh_dap_an` (ràng ở tầng app, không ràng cứng DB).
- **Từ vựng (mô hình / bổ đề / thuộc tính) luôn chọn từ danh mục có sẵn (dropdown).** Thiếu thì tạo mới vào danh mục rồi mới gắn. Không nhập text tự do.
- **Xóa một mục danh mục → gỡ sạch mọi liên kết đang trỏ tới nó** (`ON DELETE CASCADE` trên bảng nối). Ít khi xóa, nhưng xóa là dọn sạch.
- **Xóa node cây (dạng) đang có câu/bài/ý treo → CHẶN** (`ON DELETE RESTRICT`). Tránh mồ côi nội dung.

---

## 3. NHÁNH ĐẠI

### 3.1 Cây tri thức — 4 tầng cứng, lưu phẳng

Chương → Chủ đề → Chuyên đề → **Dạng** (lá). Mỗi dòng = 1 Dạng; 3 tầng trên denormalize vào cùng dòng (chấp nhận lặp tên — DB app đọc, không phải mắt người).

`muc_do` (1–5) đặt ở **Dạng** — các câu trong cùng một Dạng đồng nhất độ khó (lệch ≤ 1 bậc là dung sai chấp nhận; lệch quá → tách Dạng).

```sql
create sequence dai_dang_seq;

create table dai_ban_do (
  ma_dang        text primary key default 'DG' || lpad(nextval('dai_dang_seq')::text, 5, '0'),
  khoi           text not null,              -- '3'..'12', '4T', '5T'
  ma_chuong      text not null,
  ten_chuong     text not null,
  ma_chu_de      text not null,
  ten_chu_de     text not null,
  ma_chuyen_de   text not null,
  ten_chuyen_de  text not null,
  ten_dang       text not null,             -- tên Dạng (lá)
  muc_do         smallint not null check (muc_do between 1 and 5),
  created_at     timestamptz not null default now()
);
create index on dai_ban_do (khoi, ma_chuong, ma_chu_de, ma_chuyen_de);
```

### 3.2 Thuộc tính của Dạng (danh mục kiểm soát + bảng nối)

Toán đa chiều: 1 bài có thể thuộc 2 dạng. Xếp **1 dạng chính** (= phương pháp, suy từ câu hỏi — khách quan, một cha), phần còn lại thành **thuộc tính**. Thuộc tính gắn ở **Dạng**.
- Quy tắc "tối đa 3 thuộc tính / dạng" là **luật cho giáo viên**, KHÔNG ràng buộc DB. DB cho gắn không giới hạn.

```sql
create sequence dai_tt_seq;

create table dai_danh_muc_thuoc_tinh (   -- nguồn của dropdown
  id    text primary key default 'TT' || lpad(nextval('dai_tt_seq')::text, 4, '0'),
  ten   text not null unique
);

create table dai_dang_thuoc_tinh (       -- nối Dạng ↔ thuộc tính
  ma_dang          text not null references dai_ban_do(ma_dang) on delete cascade,
  id_thuoc_tinh    text not null references dai_danh_muc_thuoc_tinh(id) on delete cascade,
  primary key (ma_dang, id_thuoc_tinh)
);
```

### 3.3 Câu hỏi Đại

Đơn vị kho của Đại. Treo vào **đúng 1 Dạng** (`dang_chinh`). `bo_de` = làm-giàu, **opt-in, để trống được**, chỉ phục vụ lọc/chẩn đoán (KHÔNG đo mastery theo bổ đề ở Đại).

```sql
create sequence dai_cau_seq;
create sequence dai_bd_seq;

create table dai_danh_muc_bo_de (        -- kỹ năng / bổ đề Đại (dropdown)
  id   text primary key default 'BD' || lpad(nextval('dai_bd_seq')::text, 4, '0'),
  ten  text not null unique
);

create table dai_cau_hoi (
  ma_cau       text primary key default 'DC' || lpad(nextval('dai_cau_seq')::text, 6, '0'),
  dang_chinh   text not null references dai_ban_do(ma_dang) on delete restrict,
  loai_cau     text not null,            -- 'tra_loi_ngan' | 'trac_nghiem' | 'dung_sai' | 'tu_luan'
  noi_dung     text not null,            -- đề bài
  lua_chon     jsonb,                    -- chỉ trắc nghiệm
  menh_de      jsonb,                    -- chỉ đúng-sai
  dap_an       text,                     -- đáp án chuẩn (1 cái). Biến thể-chấp-nhận → spec auto-chấm sau
  loi_giai     text,
  anh_de       text,                     -- URL
  anh_dap_an   text,                     -- URL; bắt buộc nếu có anh_de (ràng app)
  created_at   timestamptz not null default now()
);
create index on dai_cau_hoi (dang_chinh);

create table dai_cau_bo_de (             -- nối Câu ↔ bổ đề (opt-in, 0..n)
  ma_cau     text not null references dai_cau_hoi(ma_cau) on delete cascade,
  id_bo_de   text not null references dai_danh_muc_bo_de(id) on delete cascade,
  primary key (ma_cau, id_bo_de)
);
```

---

## 4. NHÁNH HÌNH

### 4.1 Cây tri thức — 3 tầng, lá = tầng-3

Mảng kiến thức → Loại câu hỏi → **Dạng-hình (câu hỏi + phương pháp)** = lá. **KHÔNG có tầng-4** (dưới tầng-3 mỗi tổ hợp chỉ vài bài, không clone được → không gom thành dạng).

Ví dụ: `Tam giác đồng dạng → Chứng minh thẳng hàng → Thẳng hàng bằng Ơ-clit`.

`muc_do` **KHÔNG** đặt ở node cây Hình (bài dưới cùng một dạng-hình rất khác nhau, không đồng nhất độ khó). Độ khó đặt ở **Bài** (4.3).

```sql
create sequence hinh_dang_seq;

create table hinh_ban_do (
  ma_dang_hinh   text primary key default 'HD' || lpad(nextval('hinh_dang_seq')::text, 5, '0'),
  khoi           text not null,
  ma_mang        text not null,
  ten_mang       text not null,              -- tầng 1
  ma_loai_ch     text not null,
  ten_loai_ch    text not null,              -- tầng 2: loại câu hỏi (cm thẳng hàng...)
  ten_dang       text not null,              -- tầng 3 (lá): câu hỏi + phương pháp
  created_at     timestamptz not null default now()
);
create index on hinh_ban_do (khoi, ma_mang, ma_loai_ch);
```

### 4.2 Danh mục 3 chiều của Hình

Ba trục đo độc lập, mỗi trục một danh mục kiểm soát. (Trục **Dạng-hình** chính là cây `hinh_ban_do` ở 4.1; hai trục còn lại là danh mục phẳng dưới đây.)

```sql
create sequence hinh_mh_seq;
create sequence hinh_bd_seq;

create table hinh_danh_muc_mo_hinh (     -- chiều 1: mô hình (trực tâm, nội tiếp...)
  id   text primary key default 'MH' || lpad(nextval('hinh_mh_seq')::text, 4, '0'),
  ten  text not null unique
);

create table hinh_danh_muc_bo_de (       -- chiều 3: bổ đề (Ptolemy, trung tuyến cạnh huyền...)
  id   text primary key default 'HB' || lpad(nextval('hinh_bd_seq')::text, 4, '0'),
  ten  text not null unique
);
```

### 4.3 Bài hình

Object riêng, **không tách rời**. Giữ **Mô hình** (giả thiết chung cả hình) + độ khó tổng + đề/ảnh chung. Gom các Ý.
- Bài → Mô hình: cấu trúc **1..n** (chịu được nhiều), nhưng **luật nhập hiện tại = 1 mô hình/bài** (để cửa mở, khỏi đập schema khi sau này cần n).

```sql
create sequence hinh_bai_seq;

create table hinh_bai (
  ma_bai       text primary key default 'HBai' || lpad(nextval('hinh_bai_seq')::text, 5, '0'),
  muc_do       smallint not null check (muc_do between 1 and 5),  -- độ khó tổng của bài
  noi_dung     text not null,            -- đề chung: giả thiết + mô tả hình
  anh_de       text,
  anh_dap_an   text,
  created_at   timestamptz not null default now()
);

create table hinh_bai_mo_hinh (          -- nối Bài ↔ mô hình (rule app: đúng 1)
  ma_bai      text not null references hinh_bai(ma_bai) on delete cascade,
  id_mo_hinh  text not null references hinh_danh_muc_mo_hinh(id) on delete cascade,
  primary key (ma_bai, id_mo_hinh)
);
```

### 4.4 Ý — con của Bài

Ý **không sống độc lập**, không tái dùng tách khỏi bài (xóa bài → xóa ý). Mỗi Ý: 1 **Dạng-hình** + 0..n **Bổ đề** + đề/đáp án/lời giải riêng của ý.
- **`thu_tu` = vị trí ý (1,2,3 = a,b,c)**, đồng thời là **gradient độ khó** (a dễ → c khó; mô hình + bổ đề phần lớn phục vụ ý cuối). Đây là "tầng ý" mà không cần object nặng — thứ tự tự mang nhãn ý.

```sql
create sequence hinh_y_seq;

create table hinh_y (
  ma_y          text primary key default 'HY' || lpad(nextval('hinh_y_seq')::text, 6, '0'),
  ma_bai        text not null references hinh_bai(ma_bai) on delete cascade,
  thu_tu        smallint not null,        -- 1=a, 2=b, 3=c...
  dang_hinh     text not null references hinh_ban_do(ma_dang_hinh) on delete restrict,
  noi_dung_y    text not null,
  dap_an_y      text,
  loi_giai_y    text,
  unique (ma_bai, thu_tu)
);
create index on hinh_y (ma_bai);
create index on hinh_y (dang_hinh);

create table hinh_y_bo_de (              -- nối Ý ↔ bổ đề (0..n)
  ma_y       text not null references hinh_y(ma_y) on delete cascade,
  id_bo_de   text not null references hinh_danh_muc_bo_de(id) on delete cascade,
  primary key (ma_y, id_bo_de)
);
```

---

## 5. Tổng hợp quan hệ

```
ĐẠI
  dai_ban_do (Dạng, lá cây 4 tầng)
     ├─< dai_dang_thuoc_tinh >── dai_danh_muc_thuoc_tinh
     └─< dai_cau_hoi (dang_chinh)
              └─< dai_cau_bo_de >── dai_danh_muc_bo_de

HÌNH
  hinh_ban_do (Dạng-hình, lá cây 3 tầng)
  hinh_bai
     ├─< hinh_bai_mo_hinh >── hinh_danh_muc_mo_hinh        (mô hình @ Bài)
     └─< hinh_y (dang_hinh → hinh_ban_do)                  (dạng @ Ý)
              └─< hinh_y_bo_de >── hinh_danh_muc_bo_de     (bổ đề @ Ý)
```

13 bảng. Mỗi bảng có lý do tồn tại; không gộp được nếu không mất thông tin.

---

## 6. Chức năng cần build (CRUD)

**Bản đồ Đại** — nhập tay cây 4 tầng:
- Tạo/sửa/xóa node Dạng (kèm 3 tầng trên). Xóa bị chặn nếu có câu treo.
- Gắn/gỡ thuộc tính cho Dạng qua **dropdown** (`dai_danh_muc_thuoc_tinh`); thiếu thì "tạo mới" thêm vào danh mục. Cảnh báo mềm khi vượt 3 (không chặn).

**Câu hỏi Đại:**
- Tạo/sửa/xóa câu; chọn `dang_chinh` từ cây; chọn `loai_cau`; nhập đề/đáp án/lời giải/ảnh (ảnh đề ↔ ảnh đáp án đi cặp).
- Gắn bổ đề opt-in qua dropdown (`dai_danh_muc_bo_de`).
- **Lọc:** theo khối/chương/chủ đề/chuyên đề/dạng, theo `muc_do`, theo thuộc tính, theo bổ đề, theo `loai_cau`.

**Bản đồ Hình** — nhập tay cây 3 tầng (dừng ở lá tầng-3).

**Bài + Ý Hình:**
- Tạo Bài: chọn **1 mô hình** (dropdown), `muc_do`, đề chung + ảnh.
- Thêm các Ý theo `thu_tu`; mỗi Ý chọn `dang_hinh` (từ cây) + bổ đề (dropdown, 0..n) + đề/đáp án/lời giải ý.
- **Lọc:** theo mô hình, theo dạng-hình (qua ý), theo bổ đề (qua ý), theo `muc_do`, theo khối — phục vụ ra đề / giao bài.

**Quản lý danh mục:** màn quản trị cho 4 danh mục (thuộc tính Đại, bổ đề Đại, mô hình Hình, bổ đề Hình): thêm/sửa/xóa (xóa = cascade gỡ liên kết).

---

## 7. Quyết định mặc định — XÁC NHẬN hoặc SỬA trước khi Code chạy

1. **Prefix mã** (DG/DC/HD/HBai/HY/TT/BD/MH...): tùy chọn, đổi được. Nếu Thùy muốn format khác → sửa default ở DDL.
2. **`bo_de` Đại dùng danh mục kiểm soát (dropdown).** Suy từ nguyên tắc "dropdown chống sai từ". Nếu Thùy muốn bổ đề Đại trỏ thẳng vào node Dạng khác (thay vì danh mục riêng) → đổi `dai_danh_muc_bo_de` thành FK tới `dai_ban_do`.
3. **Bổ đề Đại và bổ đề Hình là 2 danh mục riêng.** Có thể gộp 1 danh mục dùng chung nếu sau thấy trùng nhiều — chưa gộp ở bản này.
4. **`muc_do` Hình ở Bài, không ở node cây.** (Lý do: bài cùng dạng-hình không đồng đều độ khó.)
5. **Hình không có `loai_cau`** (mặc định tự luận/chứng minh). Thêm nếu cần.
6. **Mô hình Hình hiện 1/bài** (cấu trúc đã chịu n).

---

## 8. CHỪA RA — spec riêng sau (đừng build trong sprint này)

- **Pipeline AI:** upload file đề → AI tách câu → hàng đợi duyệt → promote vào kho. (Tầng nhập liệu, là cỗ máy riêng.)
- **Auto-chấm:** bảng biến-thể-đáp-án-chấp-nhận (`accepted_answers`), chuẩn hóa, đối khớp. Thuộc Measurement/ET.
- **Công thức đo mastery:** derive-only, không lưu điểm sẵn. Thuộc lớp Measurement.

---

## 9. Ghi chú gối đầu cho spec ĐO (Measurement) — không làm giờ, nhưng đừng quên

- **Đại:** đo mastery theo **Dạng** (`dang_chinh`) → kết luận được (dạng đồng nhất, nhiều bài tương tự). Bổ đề KHÔNG đo, chỉ lọc/chẩn đoán.
- **Hình:** đo theo **từng chiều độc lập trên mẫu lớn** (mô hình / dạng-hình / bổ đề), mỗi chiều cả trăm bài → đủ tín hiệu. Mục đích **định hướng** ("yếu chiều nào → luyện trước"), **chấp nhận sai số** — vẫn hơn hẳn hiện trạng "sai mà không biết do đâu".
- **Đánh giá Hình phải theo TỪNG Ý** (không chỉ đúng/sai cả bài). Cấu trúc Kho đã sẵn sàng: `hinh_y.thu_tu` ↔ ý, `hinh_y.dang_hinh` + `hinh_y_bo_de` ↔ chiều của ý. Khâu chấm tới-ý là cái **mở khóa** đo sạch theo chiều.
- **Trần đo của Hình (ghi để không kỳ vọng nhầm):** tách được tới **cụm chiều của một ý**; KHÔNG tách được giữa các chiều **luôn đi cùng nhau** trong mọi bài (vd nếu một bổ đề luôn xuất hiện kèm một mô hình). Độ tin tăng dần khi kho lớn & đa dạng tổ hợp.
