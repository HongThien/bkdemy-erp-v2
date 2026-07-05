# BKdemy Website — Build Spec

**Domain:** `bkacademy.edu.vn`
**Đối tượng chính:** phụ huynh (300+ HS, 1 cơ sở, cơ sở 2 dự kiến > 1 năm nữa)
**Vai trò của web:** hạ tầng thương hiệu + cổng dẫn vào các app đã có. KHÔNG phải máy bán hàng (hiện tại tuyển sinh qua referral, chốt ~99%).
**Triết lý build:** *build to win, not perfect (8/10)*. Ưu tiên: sạch, đúng, tự-cập-nhật-từ-dữ-liệu, không mục. Không over-engineer.

> Đọc file này trước khi code. Khi dựng UI, ĐỌC skill `frontend-design` và tuân theo. KHÔNG dùng phong cách scifi-HUD của ERP — web này ấm, hướng phụ huynh.

---

## 0. Nguyên tắc định vị (đọc kỹ, ngấm vào toàn bộ copy)

- Định vị: **một hệ thống dạy toán bài bản** — không phải "một ông thầy giỏi", cũng không hô hào "tập đoàn/chuỗi/nhượng quyền" (chưa đúng quy mô, nghe rỗng).
- "Chất hệ thống" phát ra **ngầm**, bằng ngôn ngữ phụ huynh hiểu:
  - KHÔNG viết "chúng tôi có ERP" → viết *"phụ huynh xem được kết quả học của con bất cứ lúc nào"*.
  - KHÔNG viết "quy trình chuẩn hoá" → viết *"lộ trình rõ ràng, minh bạch, theo dõi bằng dữ liệu"*.
  - Sự chuyên nghiệp thể hiện qua chính chất lượng web (sạch, đúng, dữ liệu thật tự cập nhật), không qua khẩu hiệu.
- **Không bịa số liệu.** Không "50 thủ khoa", không "15 năm" nếu chưa đúng. Con số phải do người vận hành cung cấp (xem §10). Chỗ chưa có số → dùng câu định tính, đừng phịa.

---

## 1. Phạm vi

**IN (làm ngay):**
Trang chủ · Giới thiệu · Chương trình học (5 cấp) · Đội ngũ GV · Bảng vàng (dữ liệu động) · Tra cứu kết quả (dẫn sang cổng PH) · Tin tức (khung tối thiểu) · Tuyển dụng · Liên hệ. Nút Zalo/Hotline nổi mọi trang.

**OUT (chưa làm — chờ trigger):**
- Máy nội dung SEO / blog dày → chờ khi bật marketing chủ động.
- Form lead → CRM pipeline → chờ khi tuyển sinh chủ động (referral chưa cần).
- Trang nhượng quyền/đối tác → chờ khi thật sự có cơ sở 2 + ý định franchise. **Nhưng chừa sẵn khe** (xem §8).
- Đa ngôn ngữ. Chỉ tiếng Việt.
- ERP, cổng phụ huynh, surface làm bài của học sinh → **KHÔNG nằm trong repo này**. Chúng là app riêng trên subdomain (xem §2).

---

## 2. Kiến trúc tên miền (quan trọng — không gộp làm một app)

Một brand, một tên miền gốc, nhiều app độc lập trên subdomain:

| Subdomain | App | Trạng thái | Repo này? |
|---|---|---|---|
| `bkacademy.edu.vn` | Marketing + tin tức (spec này) | Làm mới | ✅ |
| `ph.bkacademy.edu.vn` | Cổng phụ huynh (bkdemy-ph) | Đã có | ❌ chỉ link sang |
| `erp.bkacademy.edu.vn` | ERP nhân sự | Đã có | ❌ không nhắc công khai |
| `hoc.bkacademy.edu.vn` | Surface làm bài HS (ET online, mastery) | **Đã có** (HS-realm trong ERP, login HS xong 07-04) | ❌ chỉ link sang |

**Ràng buộc bảo mật (bất di bất dịch):**
- Repo marketing này **KHÔNG BAO GIỜ** kết nối tới Supabase của ERP. Zero quyền chạm.
- Dữ liệu động (bảng vàng, khai giảng) đọc từ project **bkdemy-ph** qua **view công khai chỉ-đọc**, anon key, chỉ các cột an toàn. Không service role trong repo này.
- Không nhúng ERP/cổng PH bằng iframe. Chỉ **link ra ngoài**.

---

## 3. Stack & hạ tầng

- **Next.js (App Router) + TypeScript + Tailwind CSS.**
- Render: **tĩnh/ISR** ưu tiên tối đa (SEO + rẻ + không mục). Trang dữ liệu động (bảng vàng, khai giảng) dùng ISR `revalidate: 3600`.
- Deploy: **Vercel**, gắn `bkacademy.edu.vn`.
- Dữ liệu: `@supabase/supabase-js` client anon, trỏ tới **project bkdemy-ph**. Chỉ đọc view công khai.
- Ảnh: `next/image`. Font: `next/font`.
- Không dùng `localStorage`/state phức tạp — site gần như tĩnh.
- Env:
  ```
  NEXT_PUBLIC_SUPABASE_URL=<BKDEMY_PH_SUPABASE_URL>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<BKDEMY_PH_ANON_KEY>
  NEXT_PUBLIC_PH_PORTAL_URL=https://ph.bkacademy.edu.vn
  NEXT_PUBLIC_HOC_URL=https://hoc.bkacademy.edu.vn   # HS-realm làm bài (ET online) — ĐÃ CÓ trong ERP
  NEXT_PUBLIC_ZALO_URL=<...>
  NEXT_PUBLIC_HOTLINE=<...>
  ```

---

## 4. Design system

> Đây là **hướng**, không phải luật cứng. Chạy quy trình của skill `frontend-design`: brainstorm → chốt token → tự phê bình xem có bị generic không → mới code. Tránh 3 look AI mặc định (cream+terracotta, near-black+acid-green, broadsheet).

**Thế giới của brand:** toán học — lưới toạ độ, đường cong tăng trưởng, sự chính xác có trật tự — nhưng **ấm và đáng tin** cho phụ huynh, không lạnh như phần mềm.

**Palette (đề xuất, 5 màu — tinh chỉnh được):**
- `--ink` navy mực `#1E3A5F` — màu thương hiệu, độ sâu/tin cậy (đồng bộ với ERP).
- `--gold` đồng ánh vàng `#C08A2E` — điểm nhấn thành tựu, buộc dây với "**bảng vàng**". Dùng tiết chế.
- `--paper` trắng ngà ấm `#FBF9F5` — nền chính (KHÔNG dùng đúng #F4F1EA để tránh tell AI).
- `--sky` xanh navy nhạt `#4C6B8A` — phụ, cho đồ hoạ/đường lưới.
- `--slate` `#2C3A47` — chữ thân.

**Typography (pairing có chủ đích, phải hỗ trợ dấu tiếng Việt):**
- Display: một serif học thuật có cá tính, subset Vietnamese (vd *Lora* hoặc *Playfair Display*) — gợi truyền thống hiếu học, uy tín.
- Thân + UI: **Be Vietnam Pro** (đồng bộ brand, VN-native, hiện đại).
- Số liệu/nhãn: Be Vietnam Pro medium (hoặc 1 mono nếu hợp).
- Cặp serif-học-thuật × sans-hiện-đại = "học thuật nhưng không cũ kỹ".

**Signature (một thứ để nhớ — dồn boldness vào đây, xung quanh giữ yên):**
Motif **đường cong tiến bộ trên lưới toạ độ** — một đường "điểm số/năng lực theo thời gian" vẽ tay tinh tế, xuất hiện ở hero và làm xương sống thị giác. Vừa nói "toán", vừa nói "chúng tôi theo dõi tiến bộ bằng dữ liệu" — đúng chất hệ thống ngầm. Dùng đúng 1–2 chỗ, không rải.

**Sàn chất lượng:** responsive tới mobile, focus bàn phím hiện rõ, tôn trọng `prefers-reduced-motion`, tương phản đạt AA.

---

## 5. Cấu trúc route

```
/                     Trang chủ
/gioi-thieu           Về BKdemy            (khe tương lai: mảng "hệ thống/đối tác")
/chuong-trinh         Tổng quan chương trình
/chuong-trinh/tieu-hoc
/chuong-trinh/vao-6
/chuong-trinh/thcs
/chuong-trinh/vao-10
/chuong-trinh/thpt
/doi-ngu              Đội ngũ giáo viên
/bang-vang            Bảng vàng            (ISR, đọc dữ liệu)
/tra-cuu             Tra cứu kết quả       (giải thích + nút sang cổng PH)
/tin-tuc             Danh sách tin         (khung tối thiểu, MDX)
/tin-tuc/[slug]      Bài viết
/tuyen-dung          Tuyển dụng           (khe tương lai: "gia nhập hệ thống")
/lien-he             Liên hệ + bản đồ
```

**Nav chính:** Giới thiệu · Chương trình · Đội ngũ · Bảng vàng · Tin tức · Tuyển dụng · Liên hệ.
**Nút nổi bật tách riêng:** `Tra cứu kết quả` (CTA sang cổng PH).
**Floating góc phải:** Zalo + Hotline (mọi trang).

---

## 6. Đặc tả từng trang

### `/` Trang chủ
1. **Hero** — headline ấm (định vị hệ thống, không khẩu hiệu tập đoàn) + subline + CTA đôi ("Xem chương trình" / "Tra cứu kết quả"). Nền: signature đường-cong-tiến-bộ.
2. **Con số thật** — 3 chỉ số do vận hành cung cấp (§10). Nếu chưa có → thay bằng 3 câu giá trị định tính. KHÔNG bịa.
3. **4 khối chương trình** — card dẫn tới 5 trang cấp (gộp Tiểu học nếu muốn 4 card).
4. **Vì sao BKdemy** — 3–4 điểm, nói bằng lợi ích phụ huynh (lộ trình rõ, minh bạch bằng dữ liệu, theo sát từng con, đội ngũ bài bản).
5. **Bảng vàng (preview)** — cuộn ngang 6–8 mục mới nhất, đọc từ dữ liệu, nút "Xem tất cả".
6. **Dải Tra cứu** — mời phụ huynh dùng cổng theo dõi con.
7. **Footer** — cơ sở, map mini, Zalo/hotline, link nội bộ.

### `/gioi-thieu`
Câu chuyện + triết lý dạy ("học để thắng, không cầu toàn" diễn giải cho phụ huynh) + cam kết. **Chừa 1 section trống có comment `{/* FUTURE: mảng Hệ thống/Đối tác nhượng quyền */}`** để sau đắp, giờ ẩn.

### `/chuong-trinh` + 5 trang cấp
Trang tổng quan: lưới 5 cấp. Mỗi trang cấp: mục tiêu cấp học · lộ trình/nội dung chính · đối tượng · **lịch khai giảng** (đọc dữ liệu nếu có, không thì "Liên hệ để biết lịch") · CTA liên hệ. Template dùng chung, data theo cấp.

### `/doi-ngu`
Lưới GV: ảnh, tên, học vấn, chuyên môn, 1 dòng giới thiệu. Dữ liệu để trong file cấu hình (`content/teachers.ts`) — vận hành điền, KHÔNG bịa người.

### `/bang-vang`  *(ISR, dữ liệu động)*
Lọc theo khối/kỳ. Mỗi mục: tên HS (chỉ tên an toàn), thành tích, kỳ/năm. Đọc từ view `public_bang_vang` (xem §7). Rỗng → empty state lịch sự, không vỡ.

### `/tra-cuu` — HAI lối vào (2 hệ auth tách biệt, đừng gộp)
- **Card 1 — Phụ huynh: theo dõi con.** Kết quả học, điểm, chuyên cần, TKB → nút sang `NEXT_PUBLIC_PH_PORTAL_URL` (bkdemy-ph, auth theo SĐT).
- **Card 2 — Học sinh: vào làm bài.** ET online / xem tiến bộ → nút sang `NEXT_PUBLIC_HOC_URL` (HS-realm trong ERP, login `tai_khoan.hoc_sinh_id` — **đã có**).

Hai card riêng, nhãn rõ đối tượng. Marketing site **không nhúng, không tự làm auth** cho bên nào — chỉ link ra.

### `/tin-tuc` + `[slug]`
Khung tối thiểu, bài viết dạng **MDX trong repo** (`content/posts/*.mdx`). Không cần CMS. Trống thì hiện empty state. (Đây là hạt giống SEO, chưa đẩy mạnh.)

### `/tuyen-dung`
Vị trí đang tuyển (TA/GV — nối lộ trình TA đã có), mô tả, quyền lợi, nút nộp (link Google Form hiện có hoặc mailto). **Comment `{/* FUTURE: 'Gia nhập hệ thống' cho đối tác */}`.**

### `/lien-he`
Địa chỉ cơ sở, bản đồ nhúng (Google Maps embed công khai — không cần API key), Zalo, hotline, giờ làm việc.

---

## 7. Tích hợp dữ liệu + bảo mật

**Nguồn:** project Supabase **bkdemy-ph** (tầng dữ liệu hướng-ra-ngoài đã có). KHÔNG phải ERP.

**Cần tạo 2 view công khai chỉ-đọc trong project bkdemy-ph:**
```sql
-- Chỉ phơi cột an toàn. RLS: cho phép anon SELECT trên đúng 2 view này.
create view public.public_bang_vang as
  select id, ten_hoc_sinh_hien_thi, thanh_tich, khoi, ky_thi, nam
  from <bảng thanh_tich_cong_khai>
  where trang_thai = 'duyet' and dong_y = true   -- 2 cổng: người DUYỆT + phụ huynh ĐỒNG Ý
  order by nam desc, id desc;

create view public.public_khai_giang as
  select id, ten_lop, cap, ngay_khai_giang, ghi_chu
  from <bảng lớp/khai giảng>
  where ngay_khai_giang >= now();
```
**⚠ Bảng vàng = auto ĐỀ CỬ, người DUYỆT, phụ huynh ĐỒNG Ý — 3 vai tách bạch.** Không thể xổ 40 HS "nhất lớp" lên bảng — hết tính vinh danh. Chia vai:
- **Máy (auto từ ERP)** quét mastery/điểm/kết quả thi → sinh **danh sách đề cử** (`trang_thai='de_cu'`). Chỉ là ứng viên, KHÔNG bao giờ tự lên web.
- **Người (nhân viên)** tick chọn ai thật sự lên bảng + biên câu thành tích cho ra chất ("Thủ khoa vào 10 THPT X", không phải "mastery 0.94") → `trang_thai='duyet'`.
- **Phụ huynh** đồng ý nêu tên con → `dong_y=true`. **Đề cử ≠ đồng ý** — hai cờ độc lập.

Nhân viên cũng thêm tay được (`nguon='thu_cong'`) cho thành tích máy không biết (giải thi ngoài…). View chỉ phơi `trang_thai='duyet' AND dong_y=true`. Bảng + view + policy + RPC đề-cử: xem **§13 (SQL)**. Curate ở phía ERP; chỉ **sync dòng đã duyệt+đồng ý** sang PH. `ten_hoc_sinh_hien_thi` = tên an toàn theo mức đồng ý (vd "Nguyễn Minh A.").

**Ghi chú dependency (không chặn build):** sync hiện tại của bkdemy-ph phủ `phu_huynh/hoc_sinh/lop/tkb/diem`. Cần **bổ sung** `thanh_tich_cong_khai` (dòng đã đồng ý) + `khai_giang` vào pipeline sync (`sync.js` / Edge Function). Trong lúc chờ, dùng **seed JSON** (`content/_mock/bangvang.json`, `khaigiang.json`) để site build & render ngay; đổi sang view live sau bằng cách thay 1 lớp data-access.

**Data-access layer:** gói mọi truy vấn trong `lib/data.ts` — mỗi hàm có nhánh "live view" và fallback "mock", chọn qua env `NEXT_PUBLIC_USE_MOCK`. Để đổi live/mock chỉ ở 1 chỗ.

---

## 8. Khe mở rộng tương lai (làm sẵn, tốn ~0, ẩn đi)

- Nav & router chừa chỗ cho `/nhuong-quyen` (chưa tạo trang, chỉ để cấu trúc điều hướng dễ chèn).
- `/gioi-thieu` và `/tuyen-dung`: comment đánh dấu chỗ đắp mảng "hệ thống/đối tác" sau này.
- Data layer tách biệt → khi có cơ sở 2, thêm bộ lọc "cơ sở" không phải đập lại.

---

## 9. SEO & metadata

- `metadata` mỗi route (title, description, OG image), `lang="vi"`.
- `app/sitemap.ts` + `robots.ts`.
- OG image mặc định + per-page cho bài tin.
- Schema.org `EducationalOrganization` ở layout gốc (tên, địa chỉ, hotline).
- Ảnh có `alt` tiếng Việt.

---

## 10. Nội dung cần vận hành cung cấp (KHÔNG bịa)

Đánh dấu `TODO(content)` tại mọi chỗ này, dựng UI với placeholder rõ ràng:
- 3 con số social proof thật (số HS, số năm, tỉ lệ đạt nguyện vọng… — chỉ ghi cái có thật).
- Câu chuyện/triết lý ở `/gioi-thieu`.
- Danh sách GV (`content/teachers.ts`): ảnh, học vấn, chuyên môn.
- Nội dung 5 trang cấp học.
- Địa chỉ cơ sở, hotline, Zalo, link Google Form tuyển dụng, toạ độ map.
- Dữ liệu bảng vàng/khai giảng (qua view hoặc seed).

---

## 11. Các bước build (thứ tự cho Claude Code)

1. `npx create-next-app@latest` (TS, Tailwind, App Router). Cấu trúc `app/`, `components/`, `content/`, `lib/`.
2. **Đọc skill `frontend-design`**, chạy quy trình brainstorm→token→critique, chốt design plan (palette/type/signature ở §4), tự kiểm tra không bị generic.
3. Layout gốc: nav, footer, floating Zalo/hotline, font, CSS tokens, schema.org.
4. Component nền: Section, Card, Button, Stat, Badge, TeacherCard, BangVangItem, EmptyState.
5. `lib/data.ts` + seed JSON mock. `lib/supabase.ts` (anon client, chỉ đọc).
6. Dựng trang theo thứ tự: `/` → `/chuong-trinh` (+5 cấp, template chung) → `/doi-ngu` → `/bang-vang` (ISR) → `/tra-cuu` → `/gioi-thieu` → `/tuyen-dung` → `/lien-he` → `/tin-tuc` (khung).
7. SEO: sitemap, robots, metadata, OG.
8. Chốt responsive/focus/reduced-motion. Tự chụp màn hình phê bình lại (nếu môi trường cho).
9. Cắm domain Vercel, env, deploy.

---

## 12. Định nghĩa "xong" (Definition of Done)

- Tất cả route ở §5 render, không lỗi console, không placeholder rác kiểu "Add anything here" / `http://url`.
- Bảng vàng & khai giảng chạy từ data layer (mock hoặc live), rỗng vẫn đẹp.
- Không có bất kỳ tham chiếu nào tới Supabase ERP. Chỉ anon key của PH.
- Responsive mobile, focus rõ, reduced-motion tôn trọng, tương phản AA.
- Design KHÔNG phải template generic, KHÔNG phải scifi-HUD; ấm, đáng tin, có signature riêng.
- Mọi số liệu/tên người là thật hoặc `TODO(content)` — không có số/người bịa.
- Lighthouse SEO & Best Practices ≥ 90.
- Deploy sống trên `bkacademy.edu.vn`.

---

## 13. SQL — bảng vàng (đề cử → duyệt → đồng ý) + khai giảng

> Chạy trên project **bkdemy-ph** (KHÔNG phải ERP). Đây là DDL tham chiếu — verify tên bảng nguồn thực tế trước khi chạy (grep `information_schema.columns`). RPC đề-cử giả định mastery/điểm đã sync sang PH; nếu chưa, để nhân viên thêm tay trước, cắm RPC sau.

### 13.1 Bảng curate
```sql
create table if not exists public.thanh_tich_cong_khai (
  id                     uuid primary key default gen_random_uuid(),
  hoc_sinh_id            uuid,                       -- FK tới hoc_sinh (nội bộ; KHÔNG phơi ra view)
  ten_hoc_sinh_hien_thi  text not null,              -- tên an toàn theo mức đồng ý ("Nguyễn Minh A.")
  thanh_tich             text not null,              -- câu vinh danh nhân viên biên
  khoi                   text,
  ky_thi                 text,
  nam                    int,
  nguon                  text not null default 'thu_cong'
                          check (nguon in ('auto','thu_cong')),
  trang_thai             text not null default 'de_cu'
                          check (trang_thai in ('de_cu','duyet','tu_choi')),
  dong_y                 boolean not null default false,   -- phụ huynh đồng ý nêu tên
  ly_do_de_cu            text,                       -- máy ghi vì sao đề cử (mastery/điểm…)
  nguoi_duyet            uuid,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index on public.thanh_tich_cong_khai (trang_thai, dong_y);
create unique index if not exists ux_ttck_auto
  on public.thanh_tich_cong_khai (hoc_sinh_id, ky_thi, nam)
  where nguon = 'auto';        -- máy không đề cử trùng 1 HS/kỳ/năm
```

### 13.2 View công khai (marketing đọc bằng anon)
```sql
create or replace view public.public_bang_vang as
  select id, ten_hoc_sinh_hien_thi, thanh_tich, khoi, ky_thi, nam
  from public.thanh_tich_cong_khai
  where trang_thai = 'duyet' and dong_y = true
  order by nam desc nulls last, created_at desc;

create or replace view public.public_khai_giang as
  select id, ten_lop, cap, ngay_khai_giang, ghi_chu
  from public.<bảng lớp/khai giảng>       -- verify tên thật
  where ngay_khai_giang >= now()
  order by ngay_khai_giang asc;
```

### 13.3 RLS + quyền anon (chỉ đọc 2 view, KHÔNG chạm bảng gốc)
```sql
alter table public.thanh_tich_cong_khai enable row level security;
-- không policy cho anon trên bảng gốc → anon KHÔNG đọc được cột nhạy (hoc_sinh_id, trang_thai…)
-- nhân viên (authenticated) curate:
create policy ttck_staff_all on public.thanh_tich_cong_khai
  for all to authenticated using (true) with check (true);

-- anon chỉ đọc đúng 2 view an toàn:
grant select on public.public_bang_vang, public.public_khai_giang to anon;
-- views chạy security_invoker=off (mặc định) → đọc bảng gốc qua quyền owner, anon không cần policy bảng gốc.
```
> Kiểm tra: `set role anon; select * from public.thanh_tich_cong_khai;` phải **fail**; `select * from public.public_bang_vang;` phải **chạy**.

### 13.4 RPC đề-cử từ mastery (máy lọc → đổ vào `de_cu`)
```sql
-- Gọi định kỳ (cron/Edge Function). Đề cử HS vượt ngưỡng, KHÔNG tự duyệt, KHÔNG tự đồng ý.
create or replace function public.de_cu_bang_vang(nguong numeric default 0.9, ky text default null, nam_in int default null)
returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  insert into public.thanh_tich_cong_khai
    (hoc_sinh_id, ten_hoc_sinh_hien_thi, thanh_tich, khoi, ky_thi, nam, nguon, trang_thai, ly_do_de_cu)
  select m.hoc_sinh_id,
         hs.ho_ten,                                   -- tên đầy đủ nội bộ; nhân viên sửa thành tên an toàn khi duyệt
         'Đề cử tự động',                             -- placeholder; nhân viên biên lại lúc duyệt
         hs.khoi, ky, nam_in, 'auto', 'de_cu',
         'mastery TB = ' || round(m.diem_tb, 3)
  from <bảng mastery đã sync> m
  join <bảng hoc_sinh> hs on hs.id = m.hoc_sinh_id
  where m.diem_tb >= nguong
  on conflict (hoc_sinh_id, ky_thi, nam) where nguon='auto' do nothing;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.de_cu_bang_vang(numeric, text, int) from anon;
```

### 13.5 Sync sang PH (nếu curate ở ERP)
Nếu chọn curate phía ERP thay vì trong PH: giữ `thanh_tich_cong_khai` ở ERP, sync **chỉ dòng `trang_thai='duyet' AND dong_y=true`** sang bảng đối ứng ở PH; view `public_bang_vang` ở PH đọc bảng đã-sync đó. Nguyên tắc bất biến giữ nguyên: marketing đọc PH, không chạm ERP.

> **Mở đầu = ứng viên, không phải người được vinh danh.** Không đường nào để dòng `de_cu` hoặc `dong_y=false` lọt ra view công khai.

---

## Goal / Kickoff

> Kick bằng 1 câu trong phiên Claude Code (auto mode): *"Đọc BKDEMY_WEB_SPEC.md, làm theo Goal cuối file."*

**NHIỆM VỤ:** Build hoàn chỉnh web bkacademy.edu.vn theo spec này, tới khi đạt HẾT "Definition of Done" (§13... dùng đúng mục Definition of Done trong file).

**ĐỌC TRƯỚC:** toàn bộ spec này + skill `frontend-design` (chạy quy trình brainstorm→token→critique, KHÔNG dùng look generic/scifi-HUD).

**KỶ LUẬT:**
- Build to win not perfect (8/10). Không mạ vàng.
- TUYỆT ĐỐI không kết nối Supabase ERP — chỉ anon key project PH.
- View/data chưa sẵn → dùng seed JSON mock (đổi live sau ở 1 chỗ `lib/data.ts`). Không chặn build.
- KHÔNG bịa số liệu/tên người — chỗ chưa có để `TODO(content)`.

**VÒNG LÀM** (theo mục "Các bước build", từng bước, tự lặp tới hết): implement → build/lint sạch → tự review đúng spec chưa → commit rõ ràng → sang bước tiếp.

**DỪNG & HỎI khi:** quyết định thiết kế spec không cover · cần nội dung thật (số liệu/GV) · PH view/key chưa có. Chưa chắc thì hỏi, đừng đoán.

**XONG khi:** mọi Definition of Done đạt + build sạch + deploy được. Báo tao khi xong hoặc kẹt.
