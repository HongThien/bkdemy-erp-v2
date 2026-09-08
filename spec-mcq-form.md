# Spec — Phiên bản TRẮC NGHIỆM (MCQ) của câu tính toán, distractor theo lỗi

> Trạng thái: **CEO chốt hướng 08/09/2026**, spec để build. Pool 1 = Toán lớp 7, chủ đề "Số hữu tỉ",
> nhóm tính toán. Đọc `CLAUDE.md` §1.5 (chống NULL), §1.6 (nhãn môn), §2.0 (tính ở Postgres) trước khi code.
> Spec này là *cách đi* (CTO). *Đích* và các quyết định đã chốt ở §0 là của CEO, không bàn lại trong code.

---

## 0. Quyết định đã chốt (CEO, 08/09)

1. **MCQ ưu tiên trước** trả lời ngắn (TLN) cho app học sinh. Lý do: HS chưa quen thì TLN "làm đúng gõ sai"
   là trải nghiệm hỏng; và **HS chọn distractor = xác định lỗi chắc hơn TLN**.
2. **MCQ là phiên bản THÊM của câu, không làm lại câu.** Câu gốc trong kho bất động.
3. TLN chỉ làm sau, và chỉ khi **khoá được cấu trúc đáp án** (answer type như Khan). Ngoài phạm vi spec này.
4. Tự luận (chứng minh): sau này AI chấm, TA duyệt. Ngoài phạm vi spec này.
5. Pool 1: **lớp 7, "Số hữu tỉ", các dạng thuần tính toán**. Toán thực tế và dãy phân số nâng cao để đợt 2.
6. Sau spec: **clone thêm câu để đảm bảo độ đa dạng** (§9).

## 1. Mục tiêu và điều KHÔNG làm

**Mục tiêu:** mỗi câu tính toán trong pool có 1 phiên bản 4 phương án, trong đó **mỗi phương án sai sinh
từ 1 lỗi có tên** (misconception-based distractor). HS chọn phương án sai ⇒ hệ ghi được lỗi đó với độ
chắc 100% (đúng luật §1.5 "chỉ gán lỗi khi chắc 100%"), không cần AI hay người đoán.

**Không làm trong spec này:**
- Không đổ `lua_chon` vào câu gốc. Lý do: `etFormOf` (`src/lib/tailieu.ts`) coi "có `lua_chon`" = trắc
  nghiệm, nên đổ vào gốc sẽ làm mọi ET in giấy / mã đề 2/3 / phiếu chấm đang dùng câu đó **tự đổi form**.
- Không dựng taxonomy lỗi chung toàn hệ. Chỉ có **bảng rule lỗi của pool** (§4), taxonomy sau này nổi lên từ data.
- Không đổi công thức mastery. MCQ chấm `correct`/`wrong` như trắc nghiệm hiện có.
- Không sinh MCQ cho câu nhiều ý (a/b), câu chứng minh, câu đáp số là công thức.

## 2. Pool 1 — số thật trong kho (đọc DB 08/09)

| Chuyên đề | Dạng (`ma_dang`) | Số câu | Có đáp số | Đang là `tu_luan` |
|---|---|---|---|---|
| Tính toán với số hữu tỉ | T107010201 Cộng trừ | 24 | 24 | 24 |
| | T107010202 Nhân chia | 58 | 58 | 40 |
| | T107010203 Tìm x (cộng trừ nhân chia) | 54 | 54 | 36 |
| | T107010206 Cộng trừ thuận tiện | 61 | 61 | 44 |
| | T107010207 Nhân chia thuận tiện | 52 | 52 | 23 |
| Thứ tự thực hiện, quy tắc chuyển vế | T107010401 Tính theo thứ tự | 69 | 69 | 30 |
| | T107010403 Tìm x (thứ tự, chuyển vế) | 71 | 71 | 30 |
| | T107010404 Tìm x có luỹ thừa | 59 | 59 | 24 |
| Luỹ thừa số hữu tỉ | T107010301 Tính biểu thức luỹ thừa | 49 | 49 | 31 |
| **Tổng pool 1** | | **497** | **497** | **282** |

Đợt 2 (không sinh bây giờ): T107010205 Toán thực tế (67, nhiều câu 2 ý) · nhóm dãy phân số nâng cao
T1070105xx (117, đáp số là công thức, có câu chứng minh) · nhóm nhận biết/so sánh/trục số (75, đo cái khác).

**Hai sự thật quyết định thiết kế:**
- **0/497 câu có phương án sẵn.** Toàn bộ phương án là AI sinh + người duyệt.
- **282/497 câu đang là `tu_luan`** ⇒ RPC `tu_luyen_sinh` và `_btyeu_chon_cau` **không bao giờ chọn** chúng
  (điều kiện `loai_cau in ('trac_nghiem','tra_loi_ngan')`). Form MCQ đã duyệt = mở khoá 282 câu này cho tự luyện.

Định nghĩa pool bằng SQL (dùng trong script, không hard-code danh sách mã):

```sql
select q.ma_cau, q.dang_chinh, q.noi_dung, q.dap_an, q.loi_giai
from dai_cau_hoi q
where q.xoa_at is null
  and q.dang_chinh in ('T107010201','T107010202','T107010203','T107010206','T107010207',
                       'T107010401','T107010403','T107010404','T107010301')
  and q.dap_an is not null and q.dap_an <> ''
  and q.lua_chon is null and q.menh_de is null
  and not exists (select 1 from dai_cau_form_tn f where f.ma_cau = q.ma_cau and f.xoa_at is null);
```

## 3. Schema

Mỗi môn một bộ bảng, dispatch qua registry (§1.6). Pool 1 chỉ tạo bộ `dai_*`; KHTN/HGT tạo cùng DDL khi
cần (symmetry test: cùng code chạy y hệt). Registry cần thêm: `khoCuaMon(...).formTnTbl` (TS) và
`_kho_form_tn_tbl(p_mon, p_nhanh)` (SQL) cạnh `_kho_cau_tbl`.

### 3.1 `dai_mcq_rule` — bảng rule lỗi (canonical, theo môn)

```sql
create table dai_mcq_rule (
  ma          text primary key,              -- 'R01'..'R25' (§4)
  ten         text not null,
  mo_ta       text not null,                 -- mô tả cách sai
  vi_du       text,                          -- LaTeX
  nhom        text not null check (nhom in ('khai_niem','tinh')),
  ap_dung     text[] not null default '{}',  -- ma_dang gợi ý (không ràng buộc cứng)
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
```

`nhom`: `khai_niem` = sai quy tắc (dạy lại) · `tinh` = tính ẩu (luyện cẩn thận). Hai cách sửa khác nhau,
tách ngay từ đầu để thống kê sau không phải relabel.

### 3.2 `dai_cau_form_tn` — phiên bản MCQ của câu

```sql
create table dai_cau_form_tn (
  id            uuid primary key default gen_random_uuid(),
  ma_cau        text not null references dai_cau_hoi(ma_cau),
  lua_chon      jsonb not null,   -- MẢNG 4 phần tử, thứ tự = thứ tự hiện, mỗi phần tử:
                                  -- { "text": "$\\dfrac{-5}{4}$", "dung": true }
                                  -- { "text": "...", "dung": false, "rule": "R19", "duong_sai": "chuyển vế không đổi dấu → ..." }
  dap_an        text not null check (dap_an in ('A','B','C','D')),
  key_gia_tri   text not null,    -- đáp số đã CHUẨN HOÁ (§5.0) — nhân chứng thứ hai để verify
  nguon         text not null default 'ai' check (nguon in ('ai','nguoi')),
  ai_model      text,
  sinh_at       timestamptz not null default now(),
  da_duyet      boolean not null default false,
  duyet_boi     uuid references nhan_su(id),
  duyet_at      timestamptz,
  sua_truoc_duyet boolean not null default false,  -- người sửa phương án rồi mới duyệt → metric §7
  tu_choi_ly_do text,
  xoa_at        timestamptz,      -- kho rác (§2): từ chối = set xoa_at, KHÔNG delete
  updated_at    timestamptz not null default now()
);
create unique index dai_cau_form_tn_1_hieu_luc on dai_cau_form_tn(ma_cau) where xoa_at is null;
```

- **1 form hiệu lực / câu** (partial unique). Muốn sinh lại: set `xoa_at` bản cũ rồi insert bản mới.
- CHECK ở DB (không chỉ ở script): `jsonb_array_length(lua_chon) = 4`, đúng 1 phần tử `dung = true`,
  vị trí phần tử `dung` khớp `dap_an`, mọi phần tử `dung = false` có `rule` tồn tại trong `dai_mcq_rule`.
  Viết thành `constraint` + trigger `before insert or update` (rule tồn tại không CHECK được, dùng trigger).
- Trigger `updated_at` như các bảng khác. Không có `updated_at` trên `dai_cau_hoi` nên không bump cha;
  ghi chú này để không ai đi tìm.

### 3.3 Snapshot vào `bai_test_cau` — thêm 2 cột

```sql
alter table bai_test_cau
  add column form_tn_id   uuid references dai_cau_form_tn(id),
  add column lua_chon_rule text[];   -- song song lua_chon: null = phương án đúng, 'R19' = phương án sai theo rule
```

Vì sao song song theo vị trí (đi ngược §2 "danh tính bám khoá tự nhiên"): hai cột **ghi trong cùng một
INSERT, cùng dòng, không bao giờ sửa riêng**, và `form_tn_id` giữ đường về bản gốc để đối chiếu. Không
đổi shape `lua_chon` (string[]) vì mọi renderer TN hiện có đọc string[].

### 3.4 Ghi lỗi khi HS trả lời

`bai_lam_cau.dap_an_hs` đã lưu index HS chọn. Lỗi = `bai_test_cau.lua_chon_rule[dap_an_hs + 1]`.
**Không thêm cột vào `bai_lam_cau`** (suy được từ 2 cột cùng dòng liên quan ⇒ view, §2.0):

```sql
create view v_mcq_loi_hs as
select bl.hoc_sinh_id, bt.mon, btc.ma_dang, btc.ma_cau, btc.form_tn_id,
       btc.lua_chon_rule[(blc.dap_an_hs #>> '{}')::int + 1] as rule_ma,
       blc.cham_at
from bai_lam_cau blc
join bai_test_cau btc on btc.id = blc.bai_test_cau_id
join bai_lam bl on bl.id = blc.bai_lam_id
join bai_test bt on bt.id = bl.bai_test_id
where btc.form_tn_id is not null and blc.verdict = 'wrong';
```

Hàm tổng hợp `fn_mcq_loi_theo_hs(p_hoc_sinh, p_mon)` / `fn_mcq_loi_theo_dang(p_ma_dang)` trả jsonb đếm
theo rule, kèm `nhom`. Client chỉ render.

## 4. Bảng rule lỗi — pool 1 (seed `dai_mcq_rule`)

`nhom`: K = khái niệm · T = tính. `ap_dung` = dạng gợi ý.

| Mã | Nhóm | Tên | Ví dụ sai | Áp dụng |
|---|---|---|---|---|
| R01 | K | Phá ngoặc không đổi dấu | $a-(b-c)=a-b-c$ | 0401, 0403, 0206 |
| R02 | K | Luỹ thừa thành nhân | $3^2=6$ | 0301, 0401, 0404 |
| R03 | K | Số âm mũ chẵn ra âm | $(-\tfrac25)^2=-\tfrac4{25}$ | 0301, 0404 |
| R04 | K | Cộng số âm lấy dấu sai | $-9+4=5$ | mọi dạng |
| R05 | T | Sai phép cộng/trừ có nhớ | $-43+16=-37$ | mọi dạng |
| R06 | K | Cộng tử với tử, mẫu với mẫu | $\tfrac12+\tfrac13=\tfrac25$ | 0201, 0206, 0203 |
| R07 | K | Quy đồng đổi mẫu, quên nhân tử | $\tfrac12+\tfrac13=\tfrac16+\tfrac16$ | 0201, 0206 |
| R08 | K | Chia phân số không nghịch đảo | $\tfrac ab:\tfrac cd=\tfrac{ac}{bd}$ | 0202, 0207, 0203 |
| R09 | K | Nghịch đảo nhầm phân số thứ nhất | $\tfrac ab:\tfrac cd=\tfrac ba\cdot\tfrac cd$ | 0202, 0203 |
| R10 | K | Dấu nhân chia sai | $(-)\cdot(-)=(-)$ hoặc $(-)\cdot(+)=(+)$ | 0202, 0207, 0401 |
| R11 | K | Đổi thập phân sang phân số sai | $0{,}4=\tfrac4{100}$; $0{,}25=\tfrac1{25}$ | 0202, 0401, 0403 |
| R12 | K | Tính trái sang phải, cộng trước nhân | $2+3\cdot4=20$ | 0401, 0403 |
| R13 | K | Bỏ ưu tiên luỹ thừa | $2\cdot3^2=36$ | 0401, 0301 |
| R14 | K | $a^0$ sai | $a^0=0$ hoặc $a^0=a$ | 0401, 0301 |
| R15 | K | $-a^2$ coi là $(-a)^2$ | $-3^2=9$ | 0301, 0401 |
| R16 | K | Mũ tử, quên mũ mẫu | $(\tfrac ab)^n=\tfrac{a^n}b$ | 0301, 0404 |
| R17 | K | Lẫn cộng/nhân số mũ | $(a^m)^n=a^{m+n}$; $a^m\cdot a^n=a^{mn}$ | 0301 |
| R18 | K | Số âm mũ lẻ ra dương | $(-1)^5=1$ | 0301, 0401 |
| R19 | K | Chuyển vế không đổi dấu | $x+3=5\Rightarrow x=8$ | 0203, 0403, 0404 |
| R20 | K | Chia ngược khi tìm x | $a:x=b\Rightarrow x=ab$; $x\cdot a=b\Rightarrow x=\tfrac ab$ | 0203, 0403 |
| R21 | K | Thiếu nghiệm âm khi $x^2=k$ | $x^2=\tfrac{49}{81}\Rightarrow x=\tfrac79$ | 0404 |
| R22 | K | Mất dấu ở căn bậc lẻ | $x^3=-\tfrac18\Rightarrow x=\tfrac12$ | 0404 |
| R23 | K | Phân phối sai | $ab+ac=a(bc)$; $a(b+c)=ab+c$ | 0206, 0207 |
| R24 | K | Sót một hạng tử / một thừa số | bỏ quên $+\tfrac38$ cuối biểu thức | mọi dạng (dự phòng) |
| R25 | T | Rút gọn sai | $\tfrac{12}{18}=\tfrac34$ | mọi dạng (dự phòng) |

| R26 | K | Bỏ qua dấu âm ở mẫu/tử | $\tfrac{3}{-21}$ coi như $\tfrac{3}{21}$ | 0201, 0202, 0203, 0206 |
| R27 | K | Đổi hỗn số sai | $2\tfrac34 = 2\cdot\tfrac34$ | 0202, 0206, 0207 |

R24, R25 là **dự phòng**: chỉ dùng khi không đủ 3 rule khái niệm cho câu, tối đa 1 trong 3 distractor.
R26, R27 thêm 08/09 đêm khi máy sinh cả pool (mig 202609080318). R05 máy dùng làm dự phòng thứ hai (lệch 1 đơn vị tử số).

> **Chỗ CEO bổ sung "form tính toán có thực trong đề thi":** thêm dòng **R28+** vào bảng này theo cùng
> 5 cột. Mỗi form mới nên kèm 1 câu mẫu thật trong đề để AI bám (đưa vào §5.2 mục "mẫu").

## 5. Pipeline sinh

Theo pattern `scripts/hangdoi-giai.mjs` (Claude Code quota, không API trả phí): script `scripts/mcq-sinh.mjs`
với 3 lệnh `--list` / `--verify` / `--ghi`. Claude Code sinh trong chat theo lô 30–40 câu.

### 5.0 Chuẩn hoá đáp số (bắt buộc trước khi sinh, và là nền của verify)

Đáp số kho **lộn xộn**: `-$\dfrac{17}{2}$`, `\dfrac{7}{3}` (không `$`), `$\dfrac{-1}{27}; \dfrac{-8}{27}$`
(2 nghiệm), `a) 36000 b) 72000` (nhiều ý). Hàm `parseHuuTi(text)` trong script (thuần, có test):

- Nhận: số nguyên · thập phân `0,25` / `0.25` · `\dfrac{a}{b}` / `\frac{a}{b}` / `a/b` · dấu `-` đứng trước
  hoặc trong tử hoặc trong mẫu · tập nghiệm tách bằng `;` hoặc `,` (khi có ≥2 giá trị).
- Trả: **phân số tối giản dạng chuẩn** `p/q` với `q>0`, hoặc tập `{p1/q1, p2/q2}` đã sắp. Ghi vào
  `key_gia_tri` (vd `-17/2`, `{-8/27,-1/27}`).
- Không parse được (chữ, `%`, đơn vị, nhiều ý) ⇒ **loại khỏi lô, ghi log lý do**. Không đoán (§1.5).

### 5.1 `--list [--dang T107010201] [--n 40] --out lo.json`

Xuất: câu pool (§2) + `loi_giai` (AI cần đường giải đúng để suy đường sai) + `key_gia_tri` + bảng rule
§4 + **2 form mẫu đã duyệt** (khi đã có) cùng dạng để bám phong cách.

### 5.2 Prompt sinh (Claude Code đọc `lo.json`, viết `kq.json`)

Với mỗi câu, xuất:

```json
{ "ma_cau": "T107010401006", "dap_an": "C",
  "lua_chon": [
    { "text": "$-\\dfrac{3}{4}$",  "dung": false, "rule": "R01", "duong_sai": "phá ngoặc vuông không đổi dấu, +\\dfrac{1}{5} thành -\\dfrac{1}{5}" },
    { "text": "$\\dfrac{5}{4}$",   "dung": false, "rule": "R15", "duong_sai": "coi (-5)^2 thành -25 → dấu cả biểu thức đảo" },
    { "text": "$-\\dfrac{5}{4}$",  "dung": true },
    { "text": "$-\\dfrac{7}{4}$",  "dung": false, "rule": "R11", "duong_sai": "đổi \\dfrac{1}{20} thành 0,2" }
  ] }
```

Luật sinh (đưa nguyên văn vào prompt):
1. **3 distractor = 3 rule KHÁC NHAU**, ưu tiên rule có trong `ap_dung` của dạng. Mỗi distractor phải là
   **kết quả thật khi làm theo đường sai đó** (tính ra, không bịa số).
2. **Cùng hình thức với đáp án đúng**: đáp án là phân số thì 4 phương án đều phân số, mẫu cỡ tương đương;
   đáp án số nguyên thì 4 số nguyên cùng cỡ. Không để 3 phân số + 1 số nguyên.
3. Câu 2 nghiệm: 4 phương án đều là **tập 2 giá trị**; distractor = thiếu nghiệm (R21), sai dấu 1 nghiệm,
   hoặc sai 1 nghiệm theo rule khác.
4. Không dùng giá trị **tương đương** đáp án (`4/8` vs `1/2`, `0,5` vs `1/2`, `-a/b` vs `a/-b`) làm distractor.
5. Không đủ 3 rule khái niệm ⇒ được 1 distractor R24/R25. Vẫn không đủ ⇒ **bỏ câu**, ghi `"bo": "lý do"`.
6. `dap_an` (vị trí đúng): chọn để **cân bằng A/B/C/D trong cả lô** (script `--list` in phân bố hiện có của
   pool để AI bù). Không đảo vị trí lúc snapshot; HS thấy đúng thứ tự trong form.
7. `duong_sai` 1 câu, viết cho **TA đọc hiểu trong 3 giây**, không phải cho HS.

### 5.3 `--verify kq.json` (máy, deterministic, không AI)

Fail bất kỳ điều nào ⇒ câu bị loại khỏi `--ghi`, in lý do:
- Đúng 4 phương án; đúng 1 `dung=true`; vị trí khớp `dap_an`.
- `parseHuuTi(text đúng) == key_gia_tri` (nhân chứng thứ hai: AI không được tự đổi đáp án).
- 4 giá trị parse được và **khác nhau đôi một sau chuẩn hoá** (bắt ca `4/8` vs `1/2`).
- 3 `rule` tồn tại, `active`, khác nhau; ≤1 rule nhóm dự phòng.
- Cùng hình thức: tất cả cùng "kiểu" (nguyên / phân số / tập) theo parse.
- Phân bố `dap_an` cả lô: không chữ nào > 40%.

### 5.4 `--ghi kq.json`

Mỗi câu 1 transaction: insert `dai_cau_form_tn` (`nguon='ai'`, `ai_model`, `da_duyet=false`). Câu đã có
form hiệu lực ⇒ bỏ qua, không đè.

## 6. Duyệt

- Nơi: màn "Duyệt lời giải AI" đã có tab theo nguồn ⇒ thêm tab **"Trắc nghiệm AI"** (ưu tiên tái dùng
  màn/tab hơn đẻ màn mới — memory `popup-to-full-width-tai-dung-component`). Danh sách lọc theo dạng.
- Một dòng: đề (render LaTeX) · 4 phương án, phương án đúng tô xanh, mỗi phương án sai kèm `rule` + `duong_sai`.
- Hành động: **Duyệt** · **Sửa rồi duyệt** (sửa text/rule/đường sai, đổi vị trí đúng; set `sua_truoc_duyet=true`)
  · **Từ chối** (lý do bắt buộc ⇒ `xoa_at`, câu quay lại pool để sinh lại).
- Người duyệt: TA/GV Toán (Delegation §6: cấp thấp nhất làm được).
- Duyệt **100% ở pool 1** (CEO chốt). Nới sang duyệt mẫu chỉ khi metric §7 đủ.

## 7. Metric (log per câu, không tổng hợp ở client)

`fn_mcq_metric(p_tu date, p_den date)` trả jsonb:

| Chỉ số | Công thức | Dùng để |
|---|---|---|
| precision sinh | duyệt không sửa / (duyệt + từ chối) | quyết định nới duyệt mẫu |
| tỉ lệ sửa | `sua_truoc_duyet` / duyệt | AI gần đúng nhưng chưa đạt, soi lỗi hệ thống |
| lý do từ chối | nhóm theo `tu_choi_ly_do` | sửa prompt §5.2 |
| độ "lừa" của distractor | với form đã có ≥30 lượt làm: % HS chọn mỗi phương án sai | distractor không ai chọn = không đo được gì, sinh lại |
| phân bố vị trí đúng | đếm `dap_an` | bắt thiên lệch AI |

Cùng tinh thần `kho-ingest-ai-accuracy-metric` (đo precision AI gán dạng khi nhập kho).

## 8. Tiêu thụ

### 8.1 Tự luyện (app HS) — điểm cắm chính

- `tu_luyen_sinh` (và `_btyeu_chon_cau`) mở rộng tập ứng viên:
  `(điều kiện cũ) OR exists (form_tn đã duyệt, xoa_at null)`.
- Snapshot: chuyển `tu_luyen_sinh` sang gọi `_kho_snapshot_cau(..., p_form)` (việc dọn đã ghi sẵn trong
  migration `202609030307`). Khi câu có form TN đã duyệt ⇒ **ưu tiên form TN** (CEO: MCQ trước):
  `loai_cau='trac_nghiem'`, `lua_chon` = texts, `dap_an_key` = chữ cái, `form_tn_id`, `lua_chon_rule`.
- App HS **không đổi UI** để làm bài (renderer TN có sẵn, `HocSinhApp.tsx`). **CEO chốt 08/09: KHÔNG hiện
  `duong_sai` cho HS** — HS đọc lời giải chi tiết bên dưới là tự thấy sai ở đâu. `rule`/`duong_sai` chỉ để
  staff phân tích (§8.3). Vì vậy `duong_sai` không bao giờ đi vào `bai_test_cau`, chỉ `lua_chon_rule` (mã).
- Nút "🚩 Em nghĩ đề hoặc đáp án sai" dùng chung luồng TN hiện có.

### 8.2 ET / BTVN online và in giấy

- `canBeETForm(c, 'trac_nghiem')` thêm nhánh: câu không có `lua_chon` nhưng có form TN đã duyệt ⇒ true.
  Kéo `lua_chon` từ form khi snapshot (`snap` trong `testonline.ts`) và khi in (`DeThiPrintView`).
- Mặc định form của câu **không đổi** (`etFormOf` giữ nguyên) ⇒ 0 regression cho tài liệu cũ. Người soạn
  muốn MCQ thì chọn form `trac_nghiem` như hiện nay.

### 8.3 Đo lường

- Chấm như TN thường (`gradeTracNghiem`). Mastery không đổi công thức.
- Lỗi HS: view `v_mcq_loi_hs` + 2 hàm `fn_mcq_loi_*` (§3.4). Màn staff "hồ sơ HS" hiện top rule theo dạng.
- Ghi chú để sau: MCQ có 25% đoán ⇒ 1 lần đúng là bằng chứng yếu hơn TLN. Khi đủ data, cân nhắc trọng số
  theo `loai_cau` trong `MASTERY_CONFIG`. Ngoài phạm vi.

## 9. Clone thêm câu cho đa dạng (CEO yêu cầu sau spec)

- Dùng pipeline có sẵn: `dai_cau_hoi_yeu_cau_clone` → `dai_cau_hoi_clone_cho_duyet` → duyệt.
- Mục tiêu tối thiểu **60 câu/dạng** ở pool 1. Thiếu nhiều nhất: Cộng trừ (24), Luỹ thừa (49), Nhân chia
  thuận tiện (52), Tìm x cộng trừ nhân chia (54).
- **Thứ tự bắt buộc: clone được duyệt trước → mới sinh MCQ cho clone.** Không sinh form cho clone chờ duyệt
  (tránh sinh rồi clone bị từ chối). Query pool §2 đã tự bắt vì clone chưa duyệt không nằm trong `dai_cau_hoi`.
- Clone phải **đổi số, giữ cấu trúc phép tính** để rule lỗi §4 vẫn áp được y hệt.

## 10. Lộ trình và tiêu chí xong

> **Trạng thái 08/09 đêm:** M1 ✅ (mig 202609080230, lô 1: 35 form tính tay) · M2 ✅ (mig 202609080246, tab "Trắc nghiệm AI") ·
> M3 ✅ (mig 202609080259, tự luyện + bổ trợ yếu ưu tiên form đã duyệt) · **M4 ✅** (`scripts/mcq-auto.mjs` máy sinh 453/462
> câu còn lại, 0 FAIL verify · `mcq-clone-doi-so.mjs` 56 clone chờ duyệt · ET online lấy form khi GV chọn trắc nghiệm ·
> in giấy chưa kéo form). **488 form chờ duyệt, 0 đã duyệt.** 2 đáp số kho sai máy phát hiện: T107010202053 (13/16 → 37/24),
> T107010403036 (8/5 → 8/3). Luật hình thức §5.2/§5.3 đã NỚI: đáp án đúng phải có ≥1 phương án cùng kiểu, không cần cả 4.
> Chi tiết: DEVLOG 08/09.

| Mốc | Việc | Xong khi |
|---|---|---|
| M1 | Migration §3 + seed rule §4 + `mcq-sinh.mjs` + `parseHuuTi` có test + lô đầu 40 câu dạng T107010401 | `--verify` pass, 40 form `da_duyet=false` trong DB, `npm run schema` commit |
| M2 | Tab duyệt §6 + `fn_mcq_metric` | TA duyệt hết lô đầu, có số precision |
| M3 | Cắm tự luyện §8.1 (mở rộng ứng viên + snapshot) | HS lớp 7 gặp câu MCQ trong lượt tự luyện, `v_mcq_loi_hs` có dòng |
| M4 | Sinh hết pool 1 theo lô, clone §9, ET/BTVN §8.2, feedback đường sai (nếu CEO bật) | ≥90% pool 1 có form duyệt |

Rủi ro chính:
- **Distractor tương đương đáp án** ⇒ HS đúng bị chấm sai. Chặn ở `--verify` (so giá trị, không so chuỗi) và
  ở CHECK/trigger DB. Không bao giờ dựa vào AI tự kiểm.
- **AI đặt đáp án đúng lệch về B/C** ⇒ HS học mẹo. Chặn ở verify phân bố + metric.
- **Sinh MCQ cho câu đáp số parse sai** ⇒ verify fail hàng loạt. Chạy `--list` với báo cáo parse trước,
  sửa đáp số kho (qua UI kho, có vết) rồi mới sinh.

## 11. Câu hỏi mở cho CEO (không chặn M1)

1. ~~Bật feedback "đường sai" cho HS?~~ **Đã chốt 08/09: không.** HS đọc lời giải chi tiết; lỗi để staff phân tích.
2. Form tính toán thật trong đề thi (CEO đang gom) ⇒ thêm rule R26+ vào §4 trước khi chạy lô 2.
