# Spec — Form ĐIỀN Ô: lời giải chi tiết có ô trống, mỗi ô 4 phương án

> CEO chốt 09/09/2026. Câu tự luận (tính toán, tìm x) không bắt HS gõ đáp án: hiện **lời giải chi tiết**, bỏ trống 2–3 chỗ
> quan trọng, mỗi chỗ **4 phương án**. Một câu tự luận thành 2–3 câu trắc nghiệm nhỏ **theo bước**.
> Tên trong lý thuyết: *completion problems / faded worked examples* (Sweller, Renkl); với chứng minh: *Proof Blocks*.
> Là form thứ ba của câu, cạnh TN (spec-mcq-form.md) và tự luận. Đi qua **cửa 2** (form) sau khi câu qua **cửa 1** (spec-kho-chuan.md).

---

## 0. Quyết định đã chốt (CEO 09/09)

1. **Đo theo CÂU** (không theo ô): đúng hết ô = **Đ**; đúng một phần = **C**; sai quá 60% ô = **S**. Log theo ô chỉ để chẩn đoán lỗi.
2. **Đến ô nào hiện đúng/sai ô đó** (kèm đáp án đúng) rồi mới mở ô sau. Xong bài HS đọc lời giải đầy đủ.
3. Hệ thống **tự đề xuất form** cho HS, phải có logic rõ. Giai đoạn đầu ưu tiên **TN 4 phương án và ĐIỀN Ô** (nhanh, HS không nản);
   TLN và tự luận ưu tiên sau. Tự luyện ưu tiên thứ HS thích làm.
4. **Tách bước theo dấu `=`**: mỗi biến đổi đi qua một dấu `=` nên máy đọc lời giải theo `=`, không ép "một dòng một bước".

## 0b. Nguyên tắc chung về hình thái câu (CEO 09/09) và phạm vi PHASE 1

**Mỗi câu rồi sẽ có đủ hình thái**: trắc nghiệm 4 phương án · trả lời ngắn · trắc nghiệm một phần trong bài (ĐIỀN Ô) · tự luận.
**Thứ tự xây theo độ dễ**: câu dễ trắc nghiệm ⇒ làm TN trước (đã xong pool 1, spec-mcq-form); câu **khó trắc nghiệm** ⇒ làm ĐIỀN Ô trước.

⇒ **Phase 1 của spec này = câu KHÔNG có đáp số: chứng minh hình và chứng minh đại số.** Câu có đáp số (đã/đang có form TN) bỏ qua
ở phase này; phần "ô giá trị bằng máy" (§1, §4) giữ nguyên làm phase 2.

Số liệu (09/09): lời giải hình 194 (khối 7: 74 · 8: 101 · 9: 19), 113 có lý do trong ngoặc "(hai góc so le trong)", 603 bước suy luận,
117 cụm lý do viết lộn xộn ("ch - gn", "cạnh huyền – góc nhọn", "so le trong"…); Đại chứng minh 160 câu (khối 7: 28).

### Chứng minh: ô, key, phương án sai

- **Danh mục lý do chuẩn** `scripts/mcq-lo/hinh-ly-do-catalog.json` (LD01–LD52 + GT/CT/TT không đục) — vai trò như bảng rule
  R01–R27: nguồn phương án sai + nhãn thống kê. Có `nhom` (GOC_SS, TG_BN, TU_GIAC…) để hoán đổi trong nhóm; `tuong_duong` để nhận
  diện cách viết cũ. **Lý do ngoài danh mục ⇒ phải đề xuất mục mới, không tự do.** CEO duyệt danh mục lần đầu.
- **5 nhãn lỗi chứng minh** E01–E05 (nhầm cặp góc · nhầm trường hợp bằng nhau · đảo chiều định lý · dùng điều chưa chứng minh ·
  nhầm đối tượng). Mỗi phương án sai gắn 1 nhãn.
- **Đơn vị = BƯỚC chứng minh = cặp "KẾT LUẬN (LÝ DO)"**, ví dụ `AB = AC (tam giác ABC cân tại A)`. Mỗi bước để trống được
  **một trong hai** (CEO 09/09: "có 2 kiểu: để trống AB = AC, và để trống lý do"), không để trống cả hai (mất mỏ neo).
  1. **Ô KẾT LUẬN** — mệnh đề: đẳng thức cạnh/góc, quan hệ $\parallel$/$\perp$, "tam giác … bằng nhau", "… là hình bình hành".
     Key = nguyên văn trong lời giải. Sai = **cùng hình thức, khác nội dung**, lấy từ chính hình vẽ của bài: cặp khác
     (`AB = BC`), quan hệ khác (`AB \perp AC`), góc khác (`\widehat{ABC} = \widehat{BAC}`), điều chưa chứng minh (E04, E05).
  2. **Ô LÝ DO** — phần "(…)"; key = mã LD trong danh mục; sai = 3 mã cùng `nhom` (E01/E02/E03).
  **Chọn ô ở PHẦN GIỮA chứng minh** (CEO 09/09: "bước nút thì ai cũng biết rồi; phần suy ra từ giả thiết và vận dụng biến đổi mới
  là key"). Cụ thể, một bài chia 3 phần và chỉ đục phần giữa:
  - *Mở đầu*: chép/đọc giả thiết, hình vẽ, "theo câu trên" — **không đục** (không phải suy luận).
  - *Giữa*: các bước **suy từ giả thiết** (áp định lý lên giả thiết để ra điều mới, không có trong đề) và **vận dụng biến đổi**
    (ghép hai kết quả, thay thế, tính góc/cạnh trung gian) — **đục ở đây**, 2–3 ô, xen kẽ ô kết luận và ô lý do.
  - *Kết*: điều phải chứng minh và bước "suy ra đpcm" — **không đục** (HS đã biết đích từ đề, chọn là chọn được).
  Tiêu chí máy kiểm được: kết luận của bước là ứng viên khi **không xuất hiện trong đề bài** (phát biểu/giả thiết) và **không phải**
  mệnh đề đề yêu cầu chứng minh. Ưu tiên bước mà kết luận là điều mới nhất so với đề (xa giả thiết, chưa chạm đích).
  **Mật độ (CEO 09/09 sau pilot khối 7): cứ 4–5 dòng lời giải có 1 ô; tối đa 4 ô / 1 bài tự luận.** Bài ngắn (≤3 bước suy luận)
  1–2 ô, bài dài 3–4 ô, không dày hơn.
  **Rule chọn ô theo KIỂU BÀI xây dần** (CEO: "mỗi kiểu bài có rule khác nhau, đi từ từ"): pilot khối 7 = kiểu "góc với hai đường
  thẳng song song / kề bù / đối đỉnh / phân giác"; kiểu tam giác bằng nhau (7–8), tứ giác (8), đường tròn (9) mỗi kiểu chốt rule
  riêng khi đến lượt, ghi vào §0c (bảng rule theo kiểu bài).
- **Ai sinh, ai kiểm**: không có máy tính key ⇒ **Claude đề xuất** (script `hinh-dien.mjs --list/--verify/--ghi`, khuôn hangdoi-giai:
  xuất lô gồm đề + hình + lời giải + danh mục → Claude ghi JSON ô + phương án + lý do từng phương án sai). Máy kiểm **cấu trúc**:
  key có nguyên văn trong lời giải (khoá = văn bản + lần xuất hiện, không phải index), phương án sai ≠ key, không trùng một lý do đúng
  ở chỗ khác trong cùng bài, mã LD tồn tại, không đục ô "theo câu trên"/giả thiết. **Người duyệt 100% ở pilot**, đo precision.
- **Hiển thị**: lời giải văn xuôi + hình vẽ (`anh_chuan`/`anh`), ô là chỗ trống trong câu, 4 nút; đến ô nào hiện đúng/sai ô đó.
- **Bảng form**: `hinh_form_dien` khoá theo `cach_giai_id` hoặc `bien_the_id` (kho hình không có `ma_cau`), `dai_cau_form_dien` cho
  Đại chứng minh; cùng cấu trúc `buoc`/`o` như §3.
- **Pilot**: hình khối 7 (74 lời giải) + Đại chứng minh khối 7 (28) ≈ 100 bài.
- **Đưa vào cửa 1 kho chuẩn**: lời giải chứng minh mỗi bước = "kết luận (lý do)", lý do thuộc danh mục ⇒ máy kiểm được lý do có
  trong danh mục và điều viện dẫn đã được chứng minh ở bước trước chưa.

## 1. Ô trống là gì — định nghĩa bằng máy (phase 2: câu tính toán)

Lời giải → chuỗi **bước** $B_0 = B_1 = \dots = B_n$ (tách theo `=`; với tìm x mỗi dòng `x = …` là một bước của vế phải).
**Ô** = một số/phân số trong $B_k$ là **giá trị của một biểu thức con không phải lá** trong $B_{k-1}$ — tức "vừa thực hiện xong
một phép tính con". Máy tìm bằng cách so cây biểu thức hai bước liên tiếp (đã đo được: `scripts/_do_dien_o.mjs`).

Ba loại ô, ba bộ sinh key:

| Loại | Key | Distractor | Ai làm |
|---|---|---|---|
| **Giá trị** (tính toán) | máy tính từ biểu thức con | rule lỗi (R01–R27) áp lên đúng biểu thức con đó | máy 100% |
| **Biểu thức sau chuyển vế** (tìm x) | dòng đúng | dòng sai theo R19/R20 in bằng mẫu | máy |
| **Lý do** (chứng minh hình) | tính chất/định lý viện dẫn | tính chất sai / điều chưa chứng minh | AI đề xuất, người duyệt (v2) |

Tiêu chí chọn ô (máy chấm điểm từng ứng viên, lấy tối đa 3):
- **Điểm quyết định**: tại phép tính con đó có ≥2 rule lỗi cho ra giá trị khác nhau (⇒ đủ distractor có nghĩa).
- **Không suy ra được từ xung quanh**: bỏ ô mà bước trước đã là cùng giá trị viết khác (rút gọn thuần), bỏ ô trùng giá trị với ô khác.
- Ưu tiên ô ở bước có rule thuộc `ap_dung` của dạng; ô cuối (đáp số) chỉ lấy khi còn chỗ.
- Mỗi ô 4 phương án cùng luật hình thức như form TN (đáp án đúng không được là kiểu duy nhất; ≥1 distractor cùng kiểu).

## 2. Chấm và đo

- `so_o` ô, HS đúng `d` ô. **Đ** khi `d = so_o` · **S** khi `d < 0,4·so_o` (sai quá 60%) · còn lại **C**.
  Điểm câu = `diem × d / so_o`. Hàm Postgres `fn_dien_cham(p_key jsonb, p_hs jsonb) → (verdict, ti_le)` — một nguồn công thức.
- Mastery đọc `verdict` như mọi câu khác (Đ/C/S đã có trong `bai_lam_cau.verdict`). Không đổi công thức mastery.
- Chẩn đoán lỗi: view `v_dien_loi_hs` = mỗi ô sai → rule của phương án HS chọn (giống `v_mcq_loi_hs`), gộp chung với TN trong
  `fn_mcq_loi_theo_hs/dang` (thêm cột `form`).

## 3. Schema (mỗi kho một bảng, dispatch registry như form TN)

```sql
create table dai_cau_form_dien (
  id uuid primary key default gen_random_uuid(),
  ma_cau text not null references dai_cau_hoi(ma_cau),
  loi_giai_bam text not null,            -- vân tay lời giải lúc sinh: lời giải đổi ⇒ form tự thu hồi (trigger set xoa_at)
  buoc jsonb not null,                   -- [{ "text": "$= \\dfrac{9}{4} + \\dfrac{-7}{6}\\cdot\\dfrac{3}{7}$" }, { "text": "$= \\dfrac{9}{4} + ⟦o1⟧$", "o": {...} }, …]
  o jsonb not null,                      -- [{ "id":"o1", "buoc":1, "key":"$\\dfrac{-1}{2}$", "key_gia_tri":"-1/2", "dap_an":"C",
                                         --    "phuong_an":[{ "text":"$\\dfrac{-1}{2}$","dung":true },{ "text":"$\\dfrac{1}{2}$","dung":false,"rule":"R10","duong_sai":"…" },…] }]
  nguon text not null default 'ai' check (nguon in ('ai','nguoi')), ai_model text, sinh_at timestamptz not null default now(),
  da_duyet boolean not null default false, duyet_boi uuid references nhan_su(id), duyet_at timestamptz,
  sua_truoc_duyet boolean not null default false, tu_choi_boi uuid references nhan_su(id), tu_choi_ly_do text,
  xoa_at timestamptz, updated_at timestamptz not null default now()
);
create unique index dai_cau_form_dien_1_hieu_luc on dai_cau_form_dien (ma_cau) where xoa_at is null;
```
- Trigger kiểm: 2–3 ô; mỗi ô 4 phương án, đúng 1 `dung`, `dap_an` khớp vị trí, rule tồn tại; `⟦oN⟧` trong `buoc` khớp danh sách `o`.
- Trigger trên `dai_cau_hoi`: `loi_giai` hoặc `dap_an` đổi ⇒ `update dai_cau_form_dien set xoa_at = now() where ma_cau = … and xoa_at is null`
  (và form TN cũng vậy khi `dap_an` đổi — bổ sung cho spec-mcq-form).
- **Snapshot** vào `bai_test_cau`: `loai_cau = 'dien_o'`, cột mới `dien jsonb` = `{buoc, o}` **đã lược `dung`/`rule`/`duong_sai`**
  (HS không thấy key), `dap_an_key` = `["C","A","D"]`, `form_dien_id`, `o_rule jsonb` = rule theo vị trí từng ô (staff).
  ET chế độ thi: `et_de()` trả `dien` như trên (không key) — cột liệt kê tường minh nên không lộ.
- `bai_lam_cau.dap_an_hs` = mảng index đã chọn theo ô, ví dụ `[2, 0, 1]`; `verdict` + `diem` do `fn_dien_cham`.

## 4. Pipeline sinh — `scripts/mcq-dien.mjs`, khuôn `mcq-sinh.mjs`

1. `--list --dang T107010401 --out lo.json`: câu **đã qua cửa 1** (`da_duyet`) có lời giải, chưa có form điền. Với mỗi câu:
   tách bước theo `=` (bỏ phần chữ ngoài `$…$`, giữ "TH1/TH2" thành nhánh), parse từng bước bằng `mcq-auto.parse`, kiểm **chuỗi
   nhất quán** (mọi bước cùng giá trị; tìm x: peel từng bước). Bước nào không đọc được ⇒ bỏ câu, ghi lý do (đưa về kho chuẩn sửa
   lời giải).
2. `--sinh`: máy tìm ứng viên ô, chấm điểm, chọn ≤3, sinh 4 phương án từ `evalRule` trên biểu thức con, cân vị trí đúng.
   **Không cần Claude cho ô giá trị/chuyển vế** — 100% máy. Ô lý do (hình) là lệnh riêng v2.
3. `--verify`: key = giá trị biểu thức con (máy tính lại), 4 phương án khác nhau đôi một theo giá trị, rule khác nhau, luật hình thức,
   `⟦oN⟧` khớp, phân bố vị trí đúng ≤40%.
4. `--ghi`: insert `da_duyet=false`, mỗi câu 1 transaction.
5. Xem nhanh: `mcq-xem.mjs --form dien` (HTML có ô tô màu) để CEO/TA lướt.

Đo trước (09/09, 491 câu lớp 7 có lời giải, tách theo dòng): 61% dòng đọc được, 140 câu có ô. Tách theo `=` và **quy ước lời giải
ở cửa 1** (mỗi bước qua một `=`, biểu thức trong `$…$`, chữ giải thích ở ngoài) sẽ kéo tỉ lệ lên. Máy kiểm từng bước lời giải
cũng chính là kiểm chất lượng lời giải cho kho chuẩn — hai luồng dùng chung một bộ đọc.

## 5. Duyệt (cửa 2)

Tab **"Điền ô AI"** cạnh "Trắc nghiệm AI" (cùng RPC khuôn `fn_mcq_form_*`, thêm `p_form = 'dien'`). Thẻ: lời giải đầy đủ với ô tô màu,
dưới mỗi ô 4 phương án, xanh = đúng, rule + đường sai. Sửa được text/rule/đường sai phương án sai; **đổi ô** (bỏ ô, thêm ô ở bước
khác) là sinh lại, không sửa tay. Từ chối có lý do. Metric chung `fn_mcq_metric(p_form)`.

## 6. App HS

- Component `DienOCau`: hiện các bước; bước có ô hiện `⟦ ? ⟧` với 4 nút bên dưới. Chọn → khoá ô, tô đúng/sai, hiện đáp án đúng vào
  chỗ trống, mở ô kế. Hết ô → gọi `traLoiCau` một lần với mảng index; hiện verdict Đ/C/S và lời giải đầy đủ (không có đường sai).
- Nút "🚩 Em nghĩ đề hoặc đáp án sai" dùng luồng TN (chỉ có key sai, không có "viết khác cũng đúng").
- ET chế độ thi: chọn hết ô mới nộp, không hiện đúng/sai từng ô (giấu key).

## 7. Logic chọn form cho HS (tự luyện) — phải nêu được lý do

Câu có thể có 1–3 form đã duyệt: **TN**, **ĐIỀN**, gốc (**TLN**/tự luận). Hàm `fn_chon_form(p_hoc_sinh, p_ma_dang, p_ma_cau)` trả
form + lý do (ghi vào `bai_test_cau.form_ly_do` để soát):

| Điều kiện (theo thứ tự) | Form | Lý do ghi |
|---|---|---|
| Dạng đang **yếu** với HS này (nửa dưới mastery, đúng `chonDangTuLuyen`) và có ĐIỀN | ĐIỀN | "dạng yếu → đỡ từng bước" |
| Lần trước HS làm câu cùng dạng ở form ĐIỀN đạt **Đ** | TN | "đã làm được từng bước → bỏ đỡ" |
| Có TN | TN | "mặc định giai đoạn đầu" |
| Có ĐIỀN | ĐIỀN | |
| Không có form nào | TLN/tự luận như hiện nay | "chưa có form" |

Giai đoạn đầu **không** đẩy TLN/tự luận khi có form khác (CEO). Metric "HS thích làm": tỉ lệ **bỏ dở** và thời gian/câu theo form,
đọc từ `bai_lam` chưa nộp — sau 2 tuần có số thì mới chỉnh bảng trên.

## 8. Lộ trình

| Mốc | Việc | Xong khi |
|---|---|---|
| D1 | Bộ đọc lời giải theo `=` + tìm ô + sinh phương án (mcq-dien.mjs `--list/--sinh/--verify`) trên 9 dạng pool 1 | HTML ≥100 câu có ô, verify 0 FAIL, CEO lướt duyệt |
| D2 | Migration bảng + trigger thu hồi + `fn_dien_cham` + snapshot + `--ghi` | Form chờ duyệt trong DB |
| D3 | Tab "Điền ô AI" + component HS + cắm `fn_chon_form` vào `tu_luyen_sinh` | HS làm được câu điền ô ở tự luyện |
| D4 | ET online, metric bỏ dở theo form, ô "lý do" cho hình (AI + người) | |

Rủi ro: (1) lời giải kho sai ở bước giữa ⇒ máy phát hiện vì chuỗi không nhất quán — bỏ câu, đẩy về kho chuẩn, không đục lỗ lên
lời giải sai; (2) ô quá dễ (chỉ rút gọn) ⇒ tiêu chí "không suy ra được" + metric "độ lừa" như form TN; (3) `verdict` C cho câu
điền ô và C của Đúng/Sai THPT cùng nhãn — mastery hiện coi C như nhau, chấp nhận giai đoạn đầu.

## 9. Ngoài phạm vi

Ô "lý do" cho chứng minh hình (`hinh_cach_giai`) — cùng khung, khác bộ sinh key, làm ở D4 sau khi có số từ đại số.
