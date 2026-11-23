# spec-ban-do-toan.md — BẢN ĐỒ KIẾN THỨC TOÁN: Đại · Giải tích · Hình (Học + Luyện) (spec #2 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17/11/2026** ("Chốt theo đề xuất" — mọi dòng ❓ ở §12 lấy đề xuất CTO, trừ L12/L13/L15 Thùy trả lời riêng). **Spec này là nguồn đúng**; file nguồn đã chuyển `_luu-tru/` (trừ `spec-cum-bai.md` — còn hiệu lực cho KHTN + Hình–Học, chờ spec #14).
> Việc DB / app phát sinh từ các quyết định ở §12 **chỉ làm khi Thùy ra lệnh riêng** (danh sách §12b).
> **Gộp từ:** `spec-ban-do-4-tang.md` · `spec-ban-do-k12.md` · `spec-cum-bai.md` · `spec-format-noidung.md` (CHỈ phần lý thuyết / thẻ `##`) · `spec-hinh-cay-nhanh.md` ·
> `spec-hinh-luyen.md` · `spec-kho-hinh-v3.md` (phần cấu trúc lưới / kho bài–ý) · mục bản đồ trong `HANDOFF.md` (8T, 4T/5T) · memory bản đồ (20/10, 21/10, 22/10, 05/11).
> **Cập nhật 21/11 (Thùy):** Hình–Luyện **bỏ phân biệt nhánh chính / phụ — chỉ còn "nhánh"** (§10.2) · K7 Tam giác bằng nhau dựng lại cây + hình + lời giải (§10.9). Code màn Cây nhánh chưa theo (§12b #8).
> **Đối chiếu DB 17/11** (role `claude_build`, chỉ SELECT, `pg_get_functiondef` / `pg_trigger` / đếm dòng). Chỗ nguồn nói một đằng, DB một nẻo ⇒ ghi ở §12, **không tự sửa**.
> **Không thuộc spec này:** công thức đo / mastery / dạng yếu (→ `spec-mastery.md`; ở đây chỉ trỏ) · hiển thị CÂU HỎI, lời giải, "Bài tập tự luyện", MCQ / điền ô (→ `spec-kho-cau-hoi.md`) ·
> giải bài, soạn nội dung lý thuyết / ví dụ theo từng khối, bóc đề (→ `spec-giai-bai.md`) · builder / giáo trình / in đề ET–MT (→ `spec-builder.md`) · bản đồ KHTN / Lý / Hoá (→ #14–#16) · bản đồ phiêu lưu app HS (→ `spec-app-hs.md`).
> **Đọc file này TRƯỚC khi** thêm / sửa bảng, hàm, màn của bản đồ Toán (`dai_bdm_*`, `hgt_bdm_*`, `hinh_hoc_*`, `hinh_mo_hinh*`, `hinh_baitoan*`, `hinh_bai`, `hinh_y`), hoặc ghi lý thuyết / ví dụ vào bản đồ.

---

## 0. Đích

- Bản đồ = **khung tri thức (canonical) của môn Toán**: mọi câu trong kho phải có đúng một chỗ trên bản đồ; mọi lần đo quy về nút của bản đồ (CLAUDE §1, §3).
- **Bản đồ là việc của Thùy / trưởng khối** (người dựng, người quyết). Claude **đề xuất**, điền ô rỗng, xếp câu; không tự đổi cấu trúc người đã dựng.
- Một môn Toán, **hai khuôn** (CLAUDE §1.6 sửa 13/11 — "riêng theo khuôn, chung trong cùng khuôn"):
  - **dạng–câu** (Đại · Giải tích · Hình giải tích): 4 tầng chủ đề → chuyên đề → nhóm bài → dạng bài; câu là lá.
  - **mô hình–bài–ý** (Hình học): phần **Học** (bài học → câu) và phần **Luyện** (cây mô hình → bài mô hình; bài kho nhiều ý gán vào).
- Đổi bản đồ (chuyển, gộp, đổi tên, đổi thứ tự) **không làm hỏng gì phía sau**: mọi tham chiếu bám mã gốc; số đo đi theo câu (`spec-mastery.md` §3).

## 1. Vùng — một bảng chủ đề chung, mỗi vùng một khuôn màn

| Vùng (`dai_bdm_chu_de.nhanh`) | Cấu trúc dưới chủ đề | Bảng | Đo ở (chi tiết: `spec-mastery`) |
|---|---|---|---|
| `toan` — Đại · Giải tích | chuyên đề → nhóm bài → dạng bài → câu | `dai_bdm_*` + `dai_cau_hoi` | nhóm (chính) · dạng (phụ) |
| `hgt` — Hình giải tích (Vectơ, Oxyz, lượng giác…) | như `toan` | `dai_bdm_*` + `hgt_cau_hoi`, gán ở `hgt_bdm_*` | như `toan` |
| `hinh` — Hình học | **Học:** bài học → câu · **Luyện:** mô hình → nhánh/giả thiết → bài mô hình (nốt); bài kho → ý | `hinh_hoc_*` · `hinh_mo_hinh*` · `hinh_baitoan*` · `hinh_bai` · `hinh_y` | Học: bài học · Luyện: bài mô hình |

- **Một chủ đề Hình chứa cả phần Học lẫn phần Luyện** (Thùy 27/10, mig `202610271625`): hai vùng `hinh_hoc` / `hinh_luyen` đã gộp về `hinh`; giá trị cũ chỉ còn trong CHECK cho log, trigger từ chối ghi mới.
- **Khoá vùng** (`trg_bdm_chu_de_khoa_vung`, Thùy 27/10): chủ đề đã có nội dung (ô · nhóm · bài học · mô hình · kho Đ/S) **không đổi được vùng**; chủ đề rỗng (tạo nhầm) sửa được.
- **Dispatch vùng → khuôn màn = MỘT registry**, không rải `if` (CEO 14/10). Kéo thả giữa hai vùng / hai khuôn = **cấm** (khác bảng, khác bounded context).
- Bài tập phần **Học** và phần **Luyện độc lập** ("học là học, luyện là luyện", CEO 14/10): không dây "bài Luyện cần bài học nào", không kéo câu Học sang Luyện; kho Luyện nhập riêng (từ đề thi).
- Mọi khối Toán (3 · 4 · 4T · 5 · 5T · 6 · 7 · 8 · 8T · 9 · 10 · 11 · 12) đang chạy **bản đồ mới** (`_kho_ds_nhanh_khoi('Toán', k)` = `{bdm, hinh_hoc}` cho mọi k, công tắc `mastery_ban_do_moi` BẬT — đo 17/11). Bản đồ cũ: §5.

## 2. Luật chung (mọi vùng)

1. **Mã gốc bất biến** (CLAUDE §2, CEO 14/10). Cấp một lần lúc INSERT, không mang vị trí / phân cấp có thể đổi; mã đã xoá không cấp lại. Tiền tố:
   chủ đề `NCD…` · chuyên đề `NCH…` · nhóm bài `NNB…` · dạng bài `NDB…` · bài học Hình `HH…` · bài nhiều ý Hình–Học `HHB…` · mô hình `MH.nnn` · bài mô hình `BT.<khối>.<mh gốc>.<stt>` · bài kho Luyện `HLB…` · ý `HLY…`.
   **B5 không đổi mã** (CEO 17/10): *"mã chủ yếu để tạo ra sự duy nhất; mọi dữ liệu đánh giá trỏ về câu hỏi."*
2. **Số hiển thị suy ra, không lưu, không làm khoá**: số thứ tự 3 tầng trên box (DB đánh theo `thu_tu`), `1.6.1.1` / `B1, B2…` của Hình–Luyện (`fn_hl_so_hien_thi`), nhãn A, B, C của sự kiện. Vị trí trên màn không phải dữ liệu.
3. **Chuyển = sửa con trỏ cha**, một RPC transactional; không có bước "cập nhật thông tin phụ thuộc". Trả về phần tử vừa đổi để màn **vá tại chỗ** (CLAUDE §2 React).
4. **Xoá:** FK chặn khi còn con; câu đã gán chặn xoá dạng bài; xoá dạng / nhóm thì đối ứng cũ tự gỡ. Tham chiếu bằng chữ ⇒ kho rác (`xoa_at`), cấm xoá cứng. Mọi xoá theo **Luật xoá** (liệt kê trước).
5. **Vết:** trigger ghi mọi thêm / sửa / xoá kèm người làm (`dai_bdm_log`, cả nhóm mô hình Hình). App không tự ghi log. Đổi nội dung con ⇒ bump `updated_at` cha.
6. **Thiếu = không có dòng** (CLAUDE §1.5): câu chưa gán dạng bài = không dòng ở bảng gán; bài mô hình "1.1 … 1.40 để trống" = không dòng `hinh_baitoan`; ô lý thuyết trống = chuỗi rỗng, không bịa.
7. **Đo đi theo câu**: dạng của một lần đo = dạng HIỆN TẠI của câu ⇒ chuyển / gộp / gán lại không phải sửa số. Công thức, cache: `spec-mastery.md`. **Tiền đề không bao giờ vào công thức đo.**
8. **Phân vai:** bản đồ (cấu trúc) = Thùy / trưởng khối · Claude đề xuất 4 tầng khi được yêu cầu, điền ô rỗng (`coalesce(btrim(col),'')=''` ngay trong câu UPDATE), xếp câu · dòng do người quyết (`nguon='nguoi'`) không bao giờ bị máy ghi đè hay xoá. Cách xin phép trước khi ghi: §12 L6.

## 3. Đại · Giải tích — 4 tầng (CEO 07/10, chốt hoá 08/10–11/10)

### 3.1 Mô hình

```
Chủ đề      theo KHỐI, chỉ để gom và nhìn               Số tự nhiên K6        Phân số K6
Chuyên đề   DÙNG CHUNG, không khối ── Tìm x ──────────────┼─────────────────────┤
Nhóm bài    CẤP CHÍNH: kết luận · bổ trợ · lý thuyết chung  "Tìm x với số TN"     "Tìm x với phân số"
Dạng bài    đơn vị DẠY · ví dụ · lý thuyết riêng · cấp phụ   DB1 → DB2 …           DB1 → DB2 …
Câu         lá; thuộc đúng 1 dạng bài
```

- **Ô (chủ đề × chuyên đề)** (`dai_bdm_o`) = chỗ một chuyên đề có mặt trong một chủ đề — phần "đồ thị" của bản đồ nằm duy nhất ở đây. Không có "chủ đề cha chính" (CEO 07/10 Q5).
- **Nhóm bài thuộc đúng 1 ô · dạng bài thuộc đúng 1 nhóm · câu thuộc đúng 1 dạng bài.** Từ ô trở xuống là cây. Khối của nhóm suy từ chủ đề.
- **Luật chuẩn: MỌI câu phải thuộc 1 dạng bài** (CEO 08/10). Bản đồ mới **4 tầng, dạng là tầng cuối, không có cụm** (Thùy 29/10 — §3.5).
- Nhóm bài chứa lý thuyết chung; dạng bài có lý thuyết riêng + ví dụ (§8). In = lý thuyết nhóm, rồi từng dạng bài theo thứ tự.
- Chủ đề "không quá quan trọng" — đánh giá từ chuyên đề trở xuống (Q5). Cấp chính để kết luận / bổ trợ = **nhóm** (Thùy 10/11, `spec-mastery` §0).
- Đứng trên vai (R7): *Knowledge Component* (KLI — Koedinger) cho nhóm; *faceted classification* (Ranganathan) cho chủ đề × chuyên đề; *item family* (Gierl) cho dạng bài.

### 3.2 Thứ tự học

- **"Thứ tự là đủ"** (CEO 11/10): bỏ nối tiền đề giữa các nhóm. Thứ tự học = thứ tự chủ đề → thứ tự ô (chuyên đề trong chủ đề) → thứ tự nhóm → thứ tự dạng bài (`thu_tu`, đổi bằng ◀ ▶ / phím ← →).
- `dai_bdm_nhom_tien_de` giữ nguyên, **không tham gia tính số** (đo 17/11: 10 cạnh — K6 5 · K7 5; trigger chặn chéo ô + vòng vẫn chạy).
- "Học xong nhóm" (Q7) = đã được dạy **và đã được đo** (ô HS × nhóm khác `chưa-đo`). Mở khoá tự học theo thứ tự + bổ trợ "gốc trước ngọn sau" (Q8): **chưa build** (§12 L2).
- Thứ tự xuyên khối (lớp 6 → 7): phase sau.

### 3.3 Thao tác trên màn (mọi thao tác = 1 RPC, ghi log)

| Thao tác | RPC | Luật |
|---|---|---|
| Đọc cây một khối | `fn_bdm_cay(khoi)` | đọc **cây lưu sẵn** `dai_bdm_cay_nho` (khối × vùng, có `ban`, `tinh_at`), trigger hoãn `trg_bdm_cay_ban` đánh dấu khi bản đồ / gán câu đổi. Đếm "chưa gán" 1 lần/khối (75 s → < 0,15 s, 08/10) |
| Sắp lại trong cùng cha | `fn_bdm_sap_xep` | chỉ đổi thứ tự hiển thị |
| Nhóm sang ô khác | `fn_bdm_chuyen_nhom` | 1 dòng; mã không đổi; đo giữ nguyên |
| Dạng bài sang nhóm khác | `fn_bdm_chuyen_dang_bai` | câu đi theo dạng bài (đo đi theo câu) |
| Chuyển cả chuyên đề sang chủ đề khác | `fn_bdm_chuyen_o` | trùng thì dồn |
| Gộp chuyên đề X vào Y (thành dùng chung) | `fn_bdm_gop_chuyen_de` | mỗi chủ đề giữ nhóm của nó; tổng khối không đổi |
| **Hạ nhóm** A vào nhóm B (kéo A thả VÀO TRONG B) | `fn_bdm_ha_nhom` | A thành 1 dạng bài của B (tên · mô tả · lý thuyết → ví dụ/lý thuyết dạng), dạng con của A sang B ngay sau nó, câu đi theo nguyên vẹn (CEO 11/10 "rất nhiều nhóm sẽ bị hạ") |
| Nâng dạng bài thành nhóm | `fn_bdm_nang_dang_bai` | ví dụ → lý thuyết |
| Xoá chủ đề / ô / nhóm | `fn_bdm_xoa_chu_de` · `fn_bdm_xoa_o` · `fn_bdm_xoa_nhom` | câu đã gán chặn; đối ứng cũ tự gỡ (mig `202610081348`) |

- **Màn** `Kho › 🆕 Bản đồ mới` (`src/screens/kho/BanDoMoi.tsx`, `src/lib/kho/banDoMoi.ts`; cũng mở từ Phòng trưởng khối): mỗi màn 1 chủ đề (thanh chủ đề trên cùng, kéo để sắp) · thanh chuyên đề trái → phải = thứ tự học, nhãn ⇆N nếu dùng chung · vùng chính = 1 chuyên đề, nhóm bài là box, **dạng bài là card** trong box, số thứ tự 3 tầng trên box · khung chi tiết: tên · **mô tả nhận biết** · 📖 lý thuyết / 📝 ví dụ (`LyThuyetModal`) · chuyển sang… · nâng / hạ · gỡ / xoá.
- Luật màn: vá đúng card tại chỗ, nhớ khối / chủ đề / vị trí cuộn / card đang mở khi rời màn, báo lưu ~2 s, không `alert()`.

### 3.4 Gán câu → dạng bài ("khớp")

- **Một nguồn** "câu thuộc dạng bài nào": `_bdm_cau_giai` — gán câu (chính nó → câu gốc; **bản sao đi theo gốc**) > gán cụm cũ (`dai_bdm_doi_ung_cum`) > dạng cũ gắn đúng 1 chỗ là dạng bài (`dai_bdm_doi_ung`). Không ra ⇒ **chưa gán**. Bảng tra hợp nhất cho đọc nhanh: `kho_cau_dang` → view `bdm_cau_dang` (kho `dai` · `hgt`).
- `dai_bdm_gan_cau.nguon`: `nguoi` · `ai` · `cum` · `doi_ung`. **Câu Đúng/Sai** không gán dạng bài — gán **chủ đề** ở `dai_bdm_kho_ds` (trigger `trg_dai_bdm_gan_cau_cam_ds` chặn).
- **B4 Duyệt khớp (Thùy 16/10):** AI mức **cao** = gán thẳng (`nguon='ai'`), chấp nhận ~1,3 % sai, **hậu kiểm bằng KIỂM MẪU ~10 %** (cố định theo hash mã câu; `fn_bdm_khop_dem` đo độ chính xác thật) · mức **chưa chắc** ⇒ `dai_bdm_de_xuat` · bản đồ **thiếu dạng** ⇒ `dai_bdm_cau_thieu_dang` (kèm lý do) · không có dòng = kho tạm.
  Người quyết qua `fn_bdm_khop_quyet` (`nguon='nguoi'`). Màn: nút **✅ Duyệt kho** ngay trong Bản đồ mới (bản đồ trái · hàng đợi phải, `KhopBanDoMoiTab.tsx`, lọc theo chủ đề đang xem, «↗ Xem trên bản đồ») — **không** ở hub Duyệt kho. 4 hàng: Chưa chắc · Chưa có dạng · Thiếu dạng · Kiểm mẫu. Khối "xong" khi 4 hàng về 0.
- **Quyền ở DB:** `_bdm_duyet_duoc(khoi, chu_de)` theo `dai_bdm_duyet_pham_vi` (khối + chủ đề; `chu_de_id NULL` = phần còn lại của khối). Ai có quyền GHI `duyetloigiai` mà chưa được giao phạm vi ⇒ duyệt mọi khối (Thùy 18/10). Đo 17/11: **0 dòng phạm vi** ⇒ đang chạy theo luật mở.
- **Dây chuyền máy (B3)** — `bdm-b3-xuat-lo.mjs` (lô ≤ 70 câu gốc + trộn 90 câu MẪU, chỉ đọc) → agent Sonnet theo `kho-rules/dai/lo/b3/brief.md` → `bdm-b3-gop-lo.mjs` (kiểm + đo) → `bdm-b3-lech-mau.mjs` (**phân xử từng câu mẫu lệch**) → ngưỡng ≥ 97 % mức cao thật ⇒ `bdm-b3-ghi-de-xuat.mjs` + `bdm-b3-nap-de-xuat.mjs` (thử ROLLBACK rồi `--ghi`). Bài học: câu MẪU để **ngoài** thư mục agent đọc (`b3/_mau/`) · agent tự nhận "cao có thể sai" ⇒ hạ xuống vừa · nhãn mẫu từ đối ứng cụm cũ là **thô** — lệch phải phân xử, không tin nhãn mẫu.
- **Vòng lặp "Thùy sửa bản đồ → máy phân lại"** (Thùy 21/10): phát hiện dạng/nhóm mới hoặc ô rỗng → điền (chỉ ô rỗng) → **phân lại 1 lượt** câu ở hàng duyệt (`--hang`, `--lai-ai "<regex>"` cho phép câu AI cũ sang dạng mới) → `cao` gán thẳng · `vừa` → đề xuất · trống → thiếu dạng · **chỉ đụng dòng `nguon='ai'`**, rút dòng hàng đợi của đúng câu vừa gán; mẫu lệch < 100 % ⇒ DỪNG báo. Đề thi / đề cương mới nhập xong ⇒ chạy đợt bổ sung (vì `--dot` bỏ câu đang ở hàng duyệt). Xin phép trước khi chạy: §12 L6.
- **Kho đề thi đọc bản đồ mới** (mig `202610201623` + `…1632`): câu thường ⇒ dạng bài · Đ/S ⇒ chủ đề; "chưa có dạng" trong đề chỉ cảnh báo, không chặn duyệt; người chọn tay `fn_de_thi_gan_dang_moi`. Đo "chưa phân dạng" phải tách 3 phần: *chờ duyệt* · *thiếu dạng* · *chưa ai xét* (chỉ phần cuối là việc của máy).
- Trigger tự duyệt `_bdm_tu_duyet_sau_gan` (gán mức cao + có đáp án ⇒ `da_duyet`): điều kiện đích ở `spec-giai-bai.md` §C6.

### 3.5 Cụm bài — ĐÃ BỎ khỏi bản đồ mới (Thùy 29/10)

- *"Bản đồ mới 4 tầng, dạng là tầng cuối, không có cụm … Dọn cụm đi, ko dùng nữa rồi."* Mig `202610291703`: xoá `dai_cau_hoi.ma_cum` của mọi câu đã có dạng bài (bản lưu `bdm_ma_cum_luu_20261029`, câu lệnh hoàn lại ghi trong comment bảng). Bảng `dai_cum_bai` (355) · `dai_cum_tien_de` (20) · `bai_test_cau.ma_cum` (lịch sử) giữ nguyên. Đo 17/11: còn **106** câu mang `ma_cum`.
- Hai nguyên tắc của `spec-cum-bai.md` **vẫn đúng** nơi nào còn dùng cụm (KHTN `khtn_cum_bai` → spec #14 · Hình–Học `hinh_hoc_cum_bai` 15 cụm):
  1. **Tương đương ≠ nguồn gốc.** `ma_cum` = "thay thế được cho nhau" (item family / isomorph); `parent_ma_cau` / `nguon` = ai đẻ ra. Cấm dùng `parent_ma_cau` để nói "cùng cụm".
  2. Cụm **thủ công 100 %**, không backfill, không AI gợi ý; `ma_cum NULL` = "chưa ai phân", không phải "cụm rỗng". Cụm thuộc đúng 1 dạng.
- Mã đề + tài liệu chống lặp dùng `cumKey = ma_cum ?? parent_ma_cau ?? ma_cau` (`src/lib/kho/api.ts`) ⇒ câu bản đồ mới rơi về chuỗi gốc–clone. Hệ quả: §12 L8.

### 3.6 Số liệu bản đồ mới (đo 17/11, `kho='dai'`)

Tổng: **79 chủ đề · 189 chuyên đề · 193 ô · 568 nhóm · 1.533 dạng bài** (đo lại 17/11 tối — bản đồ đang được sửa, số nhích ±2). Chuyên đề dùng chung ≥ 2 chủ đề: **2/189** ("Tìm x" K8 · "Kiến thức cơ bản" K8T).

| Khối (`toan`) | 3 | 4 | 4T | 5 | 5T | 6 | 7 | 8 | 8T | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| chủ đề · chuyên đề | 2·6 | 1·9 | 6·23 | 10·12 | 5·18 | 5·19 | 2·10 | 3·13 | 5·16 | 8·15 | 4·9 | 4·11 | 5·15 |
| nhóm · dạng bài | 14·51 | 27·88 | 34·104 | 49·102 | 55·160 | 70·162 | 31·72 | 28·67 | 48·56 | 46·110 | 30·109 | 51·168 | 55·175 |
| nhóm có lý thuyết | 12 | 26 | 30 | 25 | 1 | 68 | 17 | 6 | 0 | 24 | 19 | 46 | 55 |
| dạng có ví dụ | 49 | 86 | 99 | 98 | 160 | 153 | 72 | 56 | 0 | 75 | 108 | 157 | 175 |
| câu gốc có dạng bài / câu gốc | 2.088/2.090 | 2.007/2.007 | 1.394/1.772 | 1.768/1.775 | 1.284/1.357 | 3.975/4.046 | 1.586/2.440 | 1.118/2.823 | 999/1.070 | 1.929/3.616 | 3.164/11.948 | 5.560/13.822 | 11.525/14.642 |

HGT (`hgt`): K6 2·2·4·8 · K9 2·4·4·11 · K10 1·3·11·37 · K12 (Oxyz) 1·5·12·51 (chủ đề · chuyên đề · nhóm · dạng).
Gán câu Đại: 41.807 dòng (ai 27.414 · đối ứng 8.818 · cụm 3.776 · người 1.809) · đề xuất chờ 4.044 · thiếu dạng 1.211 · kiểm mẫu đã xem 205 · Đ/S gán chủ đề 1.659 (K10 150 · K11 388 · K12 1.121). HGT: gán 4.440 · đề xuất 483 · thiếu 467.
*(Cột "câu gốc": khối theo dạng cũ của câu; "có dạng bài" theo `bdm_cau_dang`, gồm 2.374 câu chỉ có đề xuất mức vừa.)*

## 4. Theo khối — luật riêng đã chốt

- **K12** (`spec-ban-do-k12.md` + Thùy 05/11):
  - **Bản chuẩn = cây dựng 03/11 theo ĐỀ THI THẬT** ("nguồn bản đồ phải lấy từ đề thi, không từ sách"): Hàm số `NCD00094` · NH-TP `NCD00095` · Vectơ `NCD00096` · XS có điều kiện `NCD00097` · Số đặc trưng ghép nhóm `NCD00098` + Oxyz `NCD00099` (vùng `hgt`). Bản v3.2 (99/50 dạng, 22/10) **bị thay, không đẩy**; chỉ bổ sung dạng cũ khi Thùy nêu cụ thể. Luật 12/10 "chỉ NH-TP là chuẩn" **hết hiệu lực**.
  - Nguyên tắc cắt (28/09, vẫn dùng): **khung theo SGK nhưng không sao chép** — SGK cắt theo bài học (để dạy), bản đồ cắt theo **kiến thức đo được** (HS × KP); hai cách cho cùng kết quả thì theo SGK. Không chủ đề-thùng "Ôn tập / Đề thi" cho K12 (câu đề thi vào đúng chuyên đề). "Thực tế" là vỏ bối cảnh, nhưng **CEO giữ chuyên đề thực tiễn** (28/09 vòng 2: L1 không gật) — bản 03/11 có "Bài toán thực tế" ở Hàm số, "Ứng dụng thực tế" ở Vectơ, "Bài toán thực tế ứng dụng toạ độ" ở Oxyz (0 nhóm).
  - Mỗi dạng mới phải có **mô tả nhận biết** ngay lúc tạo (84/84 lỗi gán dạng 28/09 vẫn đúng chuyên đề ⇒ thiếu mô tả là đòn bẩy số 1).
- **K6 — chủ đề Số nguyên** (`NCD00189`, Thùy 21/10, ngoại lệ do Thùy yêu cầu Claude dựng): 5 chuyên đề · 22 nhóm · 50 dạng; nguồn SGK KNTT 6 Ch III + sách Củng cố + 150 câu thật. Tên có ℤ đổi thành chữ; **giá trị tuyệt đối không có dạng riêng** (SGK không dạy); nhóm 0 câu vẫn giữ (có trong sách). Chi tiết dựng + việc còn hở: `spec-ban-do-4-tang.md` §14.3.
- **K8 — dạng còn thiếu** (20/10): 259 câu thiếu dạng, máy đề xuất 17 dạng D1–D17 (`kho-rules/dai/ban-do-moi-k8-de-xuat-dang-thieu.md`) — **chờ Thùy** (§12 L9).
- **8T:** Đại 5 chủ đề · 17 chuyên đề · 48 nhóm, tầng dạng hiện = nhóm (1 dạng/nhóm, 07/11) trừ AM–GM (11 dạng nội dung soạn sẵn, chưa ghi); đề xuất 170 dạng thật chưa dựng. Hình–Học 8T: §9.
- **4T · 5T:** giải và gán dạng là 2 việc độc lập — lượt giải ghi câu vào dạng chờ `…000000`, lượt gán chạy sau khi bản đồ khối xong (CEO 08/10).

## 5. Bản đồ cũ (`dai_ban_do`, `hgt_ban_do`) — còn sống, không phát triển thêm

- Bảng cũ: tầng "dạng" cũ (`ma_dang` `T1…`, 823 dòng sống, 13 dạng chờ `…000000`) — câu vẫn mang `dang_chinh` trỏ vào đây; `dai_dang_ly_thuyet` 397 · `dai_chuyen_de_ly_thuyet` 108 · `dai_chuyen_de_thu_tu` 19 (K12 cũ). Màn cũ `Kho › Bản đồ` (`BanDo.tsx`) vẫn mở.
- **Đối ứng cũ → mới** (giữ công khi sắp lại): `dai_bdm_doi_ung` 585 (dạng cũ → dạng bài ① / nhóm ② / ô ③; chỉ ① đúng 1 chỗ thì câu tự rơi) · `dai_bdm_doi_ung_cum` 229. Nâng dạng bài ⇒ ①→② tự đổi; hạ nhóm ⇒ ②→①.
- Vỏ bản đồ cũ đã chép sang bản mới 08/10 (`scripts/bdm-chep-vo.mjs`), rồi CEO **dựng lại từ đầu** ("sửa trên vỏ cũ còn mất công hơn"): màn soạn tắt phần tham chiếu cũ (`HIEN_KHOP_CU = false`).
- Mastery đọc bản đồ mới qua công tắc `mastery_ban_do_moi` (BẬT từ 24/10) — `spec-mastery.md` §3, §11. Khối có bản đồ mới bỏ 💡 Đề xuất + 🎯 Gán mẫu của bản đồ cũ (Thùy 26/10).
- **Bảng `dai_de_xuat*` (đề xuất dạng/cụm trên bản đồ cũ, 28/09) và `fn_kho_pham_vi` (phạm vi C8 theo `dai_chuyen_de_thu_tu`) vẫn trỏ bản đồ cũ** — §12 L2, L10.

## 6. Môn khác cùng khuôn dạng–câu

KHTN · Vật lý · Hoá học dùng cùng khuôn 4 tầng nhưng bảng / spec riêng (#14–#16). Luật §2–§3 viết sao cho chạy y hệt ở đó (symmetry test CLAUDE §1.6); hàm mới của khuôn dạng–câu nhận `kho` / `mon`, không chép theo nhánh.

## 7. Hình — vùng chung

- Chủ đề Hình (`nhanh='hinh'`) mang cả bài học (Học) lẫn mô hình (Luyện). Đo 17/11: 13 chủ đề Hình (K7 3 · K8 2 · 8T 5 · K9 2 · K11 1).
- **Luật chia (Thùy 14/11, 8T):** MỘT chiều = **KIẾN THỨC** (đối tượng / định lí có lý thuyết riêng). "Yêu cầu của đề" (chứng minh vuông góc, tính góc…) **không** là tầng bản đồ. Câu xếp theo kiến thức lời giải thật sự cần ("dạng sau thắng"). Mỗi chuyên đề nằm trọn một phía của một kiến thức then chốt (vd chuyên đề Thalès **cấm** đồng dạng / hệ thức lượng / diện tích).
- **Thang đo Hình = 3 lần** (CEO 14/10) cho cả Học lẫn Luyện — công thức ở `spec-mastery.md` §1, §6.

## 8. Lý thuyết · ví dụ trên bản đồ (từ `spec-format-noidung.md`)

### 8.1 Nằm ở đâu

| Nút | Lý thuyết | Ví dụ | Mô tả nhận biết |
|---|---|---|---|
| Nhóm bài | `dai_bdm_nhom.ly_thuyet` (+ file) — kiến thức chung | — (nhóm không có ô ví dụ) | `dai_bdm_nhom.mo_ta` |
| Dạng bài | `dai_bdm_dang_bai.ly_thuyet` — phần riêng của dạng | `dai_bdm_dang_bai.vi_du` (+ file) | `dai_bdm_dang_bai.mo_ta` |
| Bài học Hình | `hinh_hoc_bai_ly_thuyet.noi_dung` | `hinh_hoc_bai.vi_du` | `hinh_hoc_bai.mo_ta` |
| Mô hình Hình–Luyện | `hinh_mo_hinh_ly_thuyet` (2 dòng) | — | `gia_thiet` |
| Bản đồ cũ | `dai_dang_ly_thuyet` · `dai_chuyen_de_ly_thuyet` · `hgt_/khtn_dang_ly_thuyet` | | `dai_ban_do.mo_ta_ngan` |

- **Bài Hình–Học đủ 5 phần** (Thùy 05/11): lý thuyết · ví dụ (`##VD`) · mô tả · kho trên lớp (`hinh_hoc_cau_lop`) · kho luyện.
- **Lý thuyết nhóm và dạng KHÔNG chứa ví dụ** (Thùy 19/10): ví dụ chỉ ở ô `vi_du` của dạng bài; ví dụ cũ nằm trong lý thuyết nhóm ⇒ chuyển sang dạng bài khớp nhất (trùng thì bỏ). *(Khác luật K6 — §12 L5.)*

### 8.2 Cú pháp thẻ (admonition đầu dòng — một parser cho mọi môn)

Người soạn gõ text liền mạch trong textarea; thêm một dòng thẻ **ngay trước** đoạn cần đóng khung. Khối = mọi dòng sau thẻ **tới dòng trống kế tiếp**.

| Thẻ | Loại | Luật riêng |
|---|---|---|
| `##ĐN` | Định nghĩa (vàng `#c89b52`) | |
| `##ĐL` | Định lý (tím `#7c5cbf`) — kể cả Bézout, chia có dư | |
| `##TC` | Tính chất / công thức / quy tắc / "Kiến thức cần nhớ" (xanh `#2D9CDB`; không tách 2 loại) | |
| `##CY` | Chú ý (cam) — bẫy thật | |
| `##PP` | Phương pháp (xám) | **mỗi dòng không trống = 1 bước**, tự đánh số + timeline; **không** gõ "Bước N" / ①②③ (parser tự bỏ "Bước N:" / "- " đầu dòng) |
| `##VD` | Ví dụ (hồng `#b23a72`) | tag **luôn "Ví dụ N"** tự đếm (đè mọi tiêu đề khác); **chỉ đề bài trong khung**, dòng "Bài giải/Lời giải/Giải" + `.`/`:` tách ra NGOÀI khung (`splitViDu`); **toàn bộ đề (cả a, b, c) liền nhau không dòng trống**; dòng trống chỉ được trước ý b/c/d của LỜI GIẢI |
| `##NX` | Nhận xét (xanh ngọc) | |
| `##BT` | Bài tập tự giải (xanh BK `#4c6fff`) | không lời giải, không khung màu; nhiều `##BT` liền nhau gộp dưới **một** tiêu đề "BÀI TẬP TỰ LUYỆN", tag "Câu N" đếm riêng. *Không phải* chỗ chính của "Bài tập tự luyện" (đó là câu thật — spec kho) |

- Thẻ có thể kèm tiêu đề cùng dòng (`##VD Ví dụ 1`); thẻ trần ⇒ parser **tự bóc nhãn có sẵn** ("Ví dụ 1.", "Định lý 2:") lên tag và xoá khỏi thân (`LEADING_LABEL_RE`).
- Đoạn không thẻ ⇒ render phẳng như cũ. Ảnh để đoạn riêng ngoài khung (trừ khi xen giữa các ý). Khối mơ hồ (a/b/c, "Loại 1") để nguyên.
- Nhãn lời giải: mọi "Giải" / "Lời giải" / "Bài giải" (kể cả `**Giải:**`) **hiện** là "Bài giải:" căn giữa + gạch chân + đậm (`tachNhanGiai`); dữ liệu đã chuẩn hoá mig `202609261247`.
- **Không có thẻ hình** — hình vẽ / ô vẽ / bảng điền là "chức năng bật" ở cấp câu (builder), không đi qua cơ chế thẻ.
- **Bắt buộc khi GHI:** mọi đoạn lý thuyết mở bằng thẻ (`##ĐN/ĐL/TC/CY/PP`), mỗi `##VD` có "Bài giải"; **script ghi phải tự chặn đoạn thiếu thẻ** (mẫu `kho-rules/hinh/lo/k7-tgbn/lt-gan-the.mjs`) — áp mọi bảng lý thuyết, kể cả Hình–Học (Thùy nhắc 19/10 + 05/11). Nội dung soạn theo từng khối (độ dài, số ví dụ, kiểm số bằng máy, phạm vi lớp, dấu nhân): `spec-giai-bai.md`.
- AI bóc OCR (`buildLyThuyetPrompt` / `buildTheoryIngestPrompt`) được tự gắn thẻ khi **rõ ràng**, mơ hồ thì để nguyên; kết quả vào textarea, người thấy khung trong preview và sửa trước khi Lưu (AI gợi ý → người xác nhận).

### 8.3 Render — một parser, nhiều nơi gọi

- Parser `src/lib/lythuyetBlocks.ts` (`parseLyThuyetBlocks`, `splitPhuongPhapBuoc`, `splitViDu`, `laDauNhomBaiTap`) — không biết môn (§1.6). Nơi gọi: preview `LyThuyetBlocksPreview` (`src/screens/kho/ui.tsx`, trong `LyThuyetModal`) · PDF `LyThuyetBody` (`tailieu/PrintView.tsx`) · `HinhPrintView.tsx` · `loiGiaiBuoc.ts` · `ta/SauGioCa.tsx`.
- **In:** đoạn phẳng được vỡ dòng để né mồ côi; **khối có khung `break-inside: avoid`** (thà đẩy sang trang sau); `##PP` quá một trang thì vỡ giữa các BƯỚC. **Chống mồ côi đầu khung:** gộp đầu khung + nội dung đầu tiên vào một khối avoid (paged.js chỉ xét `break-after:avoid` của phần tử liền sau).
- Không có lớp bọc "Lý thuyết · Ví dụ" bên ngoài (CEO 26/09) — khối render thẳng trong thân card; nền chỉ nằm trong từng khung.
- **Bài học grep:** sửa cách hiện lý thuyết ⇒ grep MỌI nơi render (`pv-box-lt`, `hp-box-lt`, `MathText` quanh "Lý thuyết") trong toàn repo, không sửa một file rồi coi là xong.
- Đo 17/11: nhóm có lý thuyết 341, trong đó 281 có thẻ · dạng có ví dụ 1.382, 1.380 có `##VD` · lý thuyết dạng 1.345, 1.206 có thẻ · Hình–Học 49 bài có lý thuyết, 47 có thẻ.

## 9. Hình–Học — bài học là nút (khuôn 3 tầng)

- **Chủ đề → bài học → câu** (`hinh_hoc_bai` → `hinh_hoc_cau_hoi`). Không tầng chuyên đề giả, không ép vào 4 tầng Đại, **không có mô hình** (CEO 14/10).
- **Đo ở BÀI HỌC, không ở bài tập** (bài tập hình gần như duy nhất): bài học = dạng = nhóm = chuyên đề khi cuộn lên (`hinh_hoc_bai.ma_dang = ma_bai`, 0 lệch đo 17/11). **Đơn vị là bài học (kiến thức), không phải buổi** — buổi nào dạy bài nào là việc của giáo trình.
- Bài học lên bản đồ mới qua `hinh_hoc_bai.chu_de_id → dai_bdm_chu_de` (vùng `hinh`); `ma_chuyen_de` / `ten_chuyen_de` chỉ là cột bản đồ cũ.
- **Bài nhiều ý** (Thùy 09/11, đảo luật 21/09 "Hình không tách ý"): `hinh_hoc_bai_y` (`HHB…`, lời dẫn + hình chung, thuộc 1 bài học); mỗi ý = 1 câu `hinh_hoc_cau_hoi` có `bai_y` · `nhan_y` · `cau_hoi_y` (+ `da_biet`); trigger **ghép** `noi_dung` + **ép** `anh_de` / `dang_chinh` theo bài ⇒ mọi nơi đọc câu chạy như cũ, mỗi ý là 1 ô chấm; sửa thẳng `noi_dung` của ý bị từ chối. "Về đánh giá không khác — mọi ý thuộc bài học đó." Câu cả bài cũ giữ cho tài liệu / điểm cũ, rút khỏi kho (không xoá). UI giả thiết của ý: tô nền, không ghi chữ "Đã biết" (Thùy 16/11).
  - **⚠ Câu GỐC đã tách ý luôn `rut_khoi_kho=true`** (giữ cho tài liệu / điểm cũ; các ý là bản vào kho) — bật nhầm gốc ⇒ kho hiện trùng cả bài + ý (lỗi 23/11, `hh-k8-goc-chuoi-rut-khoi-kho.mjs`). **⚠ LUẬT DỜI BÀI (lỗi 23/11 — đọc trước khi đẩy câu Hình vào bài khác):** câu đã tách ý thì **bài nằm ở THẺ Ý** (`hinh_hoc_bai_y.dang_chinh`), không ở câu gốc; trigger `_trg_hh_y_ghep` ép `dang_chinh` của mọi ý theo thẻ, và `count_cau_by_bai_hh` (màn kho) **ẩn câu gốc đã có thẻ ý, đếm / hiện các ý**. Muốn dời cả chuỗi sang bài khác: (1) `update hinh_hoc_bai_y set dang_chinh = <bài mới>` — trigger `trg_hh_bai_y_lan` tự lan sang mọi ý; (2) đổi luôn `dang_chinh` câu gốc cho khớp (câu gốc giữ cho tài liệu / điểm cũ); (3) duyệt các ý (`da_duyet`), không chỉ câu gốc; (4) đọc lại bằng chính công thức đếm của `count_cau_by_bai_hh`, không tin đếm câu gốc. Chỉ đổi câu gốc ⇒ kho bài đích báo "chưa có câu" còn ý kẹt ở bài cũ (đã dính 23/11: 136 câu cuối kì 1 K8). **Hình vẽ của chuỗi ở `hinh_hoc_bai_y.anh_de`** (trigger ép cho mọi ý) — câu nhập từ đề thi thường để hình ở `anh_dap_an` (ảnh dưới lời giải) nên khi đẩy vào kho phải gán `anh_de` của thẻ ý := `anh_dap_an` của câu gốc, không thì kho không hiện hình (`hh-k8-cuoi-ki-hinh-vao-de.mjs`, 23/11) — **và gán luôn `anh_de` của câu gốc** (danh sách kho vẫn liệt kê câu gốc; `hh-k8-hinh-goc-theo-the-y.mjs`). Lời dẫn / chữ đề của câu đã tách ý sửa ở thẻ ý (`loi_dan`) hoặc `cau_hoi_y`, không sửa `noi_dung` (bị từ chối). Script máy được ghi dù bản đồ khoá; mẫu: `scripts/kho/hh-k8-cuoi-ki-doi-the-y.mjs`.
- **Độ khó Hình–Học (CEO 27/09, ghi spec 23/11):** độ khó nằm **ở BÀI HỌC**, không ở câu và không ở nút khác — Hình không có tầng "dạng bài" riêng (bài học = dạng, xem trên), nên **thay hẳn bậc S/A/B/C** của Đại bằng **độ khó 1–5** (`hinh_hoc_bai.muc_do`, smallint, NULL = chưa đánh — "chưa đánh" là trạng thái thật, không đoán, không mặc định 3; khác Đại/KHTN `muc_do ?? 3`).
  - **Đặt:** chip tròn góc phải header thẻ bài (`BaiCard`, `KhoHinhHocScreen.tsx`): bấm xoay **1→2→3→4→5→bỏ→1**, ghi ngay `updateHinhHocBai(ma_bai, {muc_do})` rồi tải lại; tooltip "Độ khó N. Bấm xoay…".
  - **Màu** (ramp ấm, đồng bộ `MUCDO_TONE` của Đại): 1 emerald · 2 lime · 3 amber · 4 orange · 5 rose (chữ trắng); chưa đánh = xám nhạt, chữ "?".
  - **Dùng:** `muc_do` truyền sang bộ chọn dạng (`DangPicker.mucDo`, `hinhhoc.ts` `leafTen/mucDo`) để lọc / ghi snapshot khi gán đề (`detest.ts` `mucDo`); `api.ts` ghi chú "Hình: độ khó ở Bài, không ở node".
  - **Hình–Luyện có nhãn độ khó RIÊNG** (1–5, **trên bài mô hình** — nốt `hinh_baitoan`, bảng `hinh_baitoan_do_kho`, ghi qua `fn_hl_bai_do_kho_dat`, đọc `fn_hl_bai_nhan_cay`; ý trong kho kế thừa từ nốt) — §10.5; hai thang độc lập, **không quy đổi** giữa độ khó bài học (Học) và độ khó nốt (Luyện).
  - Đo 23/11: `muc_do` có giá trị ở **1/86** bài học Hình (K9) — các khối còn lại chưa đánh · nhãn độ khó nốt Luyện **0** dòng ⇒ chức năng đã build, **chưa có dữ liệu** (việc của trưởng khối Hình, cùng loại L14).
- **Hình–Học KHÔNG có tầng dạng bài riêng (Thùy 23/11 — chốt, thay lời "ba tầng có tên khác nhau" cùng ngày):** *bài học vừa là chuyên đề, vừa là nhóm bài*; "Hình học không cần dạng bài — nếu cần phải có thì giống nhóm luôn" ⇒ giữ luật 28/10 (bài học = dạng = nhóm = chuyên đề cùng tên), **không đổi DB, không đổi hàm cuộn lên mastery**. Đánh giá HS ở các tầng khác nhau vẫn có qua chủ đề → bài học.
- **Bốn + sáu bài "Chuyên đề" K8 (Thùy 23/11):** là **chuyên đề NÂNG CAO gắn với CÂU CUỐI của bài hình nhiều câu** — logic xếp câu Hình thi theo **đích của ý cuối** (ngoại lệ luật 14/11 §7 "yêu cầu của đề không là tầng bản đồ" — Thùy chốt cho phép). Chủ đề Thales (NCD00209), thứ tự 17–26: HH00173 vuông góc · HH00174 song song · HH00175 thẳng hàng – đồng quy · HH00176 hệ thức · HH00183 tứ giác đặc biệt · HH00184 tìm điều kiện để tứ giác đặc biệt · HH00185 trung điểm · HH00186 yếu tố đặc biệt trong tam giác (phân giác · cân · trọng tâm · trực tâm) · HH00187 tính độ dài – tỉ số – diện tích · HH00188 bài toán thực tế. Kho của chúng là kho thường như Thales / đường trung bình (câu `hinh_hoc_cau_hoi.dang_chinh`). Đã đẩy **136/136 câu cuối kì 1 K8** (nguồn: `k8-de-thi.json`, 136 câu "cuối học kì 1") vào kho chuẩn — câu lẻ HHC015574 ("Chứng minh BK=CE") xếp vào HH00176 hệ thức. **Duyệt câu 23/11 (Thùy "tự duyệt luôn"):** 136/136 câu `da_duyet=true`, `duyet_nguon='ai'`, `duyet_boi` NULL — trong đó 2 câu máy nghi đề gốc lỗi được **sửa chữ đề rồi duyệt** (Thùy 23/11 "Sửa rồi duyệt"): HHC015483 thêm định nghĩa E ("Gọi D, E lần lượt là điểm đối xứng với H qua AB và AC"), HHC015613 ý a "DECF" → "EMCF"; bản lùi `_luu-tru/du-lieu/hh-k8-sua-de-2-cau-loi-23-11.json`. 10 bài chuyên đề đều `da_duyet=true` (HH00183–188 do Claude duyệt, `duyet_boi` NULL). Đa số câu đề thi Hình không kèm hình (HS tự vẽ) — chỉ 8/136 có `anh_de`; cả 136 có lời giải. **Lưu ý kỹ thuật:** 136 câu này đã TÁCH Ý (`hinh_hoc_bai_y`) — màn kho ẩn câu gốc, hiện thẻ ý (434 ý) nên dời bài phải đổi `hinh_hoc_bai_y.dang_chinh` (trigger lan sang các ý), không chỉ câu gốc (`hh-k8-cuoi-ki-doi-the-y.mjs`). Script `scripts/kho/hh-k8-cuoi-ki-*.mjs`, bản lùi `_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json`. Cách xếp: vế "Chứng minh…" cuối của ý cuối (hoặc khẳng định trần ở ý cuối); đề "Tính / Tìm điều kiện / thực tế" xếp theo từ khoá ở ý cuối; chỉ dời khi chắc.
- **Độ khó 10 bài chuyên đề K8 (Thùy 23/11, theo đề xuất của Claude — Thùy sửa được bằng chip):** HH00173 vuông góc **4** · HH00174 song song **3** · HH00175 thẳng hàng – đồng quy **5** · HH00176 hệ thức **5** · HH00183 tứ giác đặc biệt **3** · HH00184 tìm điều kiện **4** · HH00185 trung điểm **3** · HH00186 yếu tố đặc biệt trong tam giác **4** · HH00187 tính độ dài – tỉ số – diện tích **3** · HH00188 bài toán thực tế **2**. Thang 1–5 tương đối trong nhóm chuyên đề nâng cao; các bài học K8 cũ vẫn chưa đánh (NULL). Script `scripts/kho/hh-k8-chuyen-de-duyet-cau-do-kho.mjs`.
- Cụm Hình–Học: `hinh_hoc_cum_bai` (15) + `hinh_hoc_cum_tien_de` (0) — luật cụm §3.5.
- Màn: `KhoHinhHocScreen` (tái dùng `LyThuyetModal`). **Lối vào đích: chỉ còn Bản đồ mới** (CEO 14/10); lối cũ Kho › Hình học (Học | Luyện) chạy song song tới khi Bản đồ mới ổn định, không phát triển thêm.
- Đo 17/11: **82 bài học** (K7 24 · K8 16 · K9 12 · K11 9 · 8T 21), 56 bài gắn chủ đề bản đồ mới · **9.139 câu sống** (trên 70 bài) · 937 bài nhiều ý. 8T: 5 chủ đề · 20 bài có mô tả, **0 lý thuyết + ví dụ** (Thùy 14/11 cần đủ 5 phần).

## 10. Hình–Luyện — cây mô hình (khuôn mô hình–bài–ý)

### 10.1 Các tầng (Thùy 09/11 — thay "nhóm mô hình" 18/10)

| Tầng | Là gì | Đánh giá? | Ứng với Đại (báo cáo) | DB |
|---|---|---|---|---|
| **Chủ đề** | gom | gom | chủ đề | `dai_bdm_chu_de` (`hinh`) · `hinh_mo_hinh.chu_de_id` chỉ ở gốc |
| **Mô hình** | gốc cây: bó giả thiết gốc + hình | **CÓ — tầng chính**, gộp mọi nốt | chuyên đề | `hinh_mo_hinh` `phan='luyen'`, `la_mo_hinh`, không cha |
| **Trọng điểm** | **nhóm bài** (luôn là trọng điểm) **hoặc** một nốt được đánh dấu | **CÓ — đánh giá sâu** | dạng bài | nút `vai='nhom_bai'` · `hinh_baitoan.la_trong_diem` |
| Nhánh / giả thiết | cấu trúc dựng đề (giả thiết hiệu lực) | không — báo cáo không hiện | — | `hinh_mo_hinh` `la_mo_hinh=false` + cạnh `hinh_mo_hinh_cha(chinh)` |
| **Nốt (bài mô hình)** | bài toán nhỏ / tính chất chuẩn (B1, B2…) | hạt đo (thang 3) | câu | `hinh_baitoan` |
| Bài kho · ý | đề thi thật nhiều ý · từng ý | đo ở ý, quy về nốt | — | `hinh_bai` (`HLB`) · `hinh_y` (`HLY`) |

- "Trọng điểm có thể không có nhóm bài, nhưng nhóm bài chắc chắn là trọng điểm." Đánh dấu trọng điểm: **trưởng khối trở lên** bật / tắt trên bản đồ (`fn_hl_trong_diem_dat`).
- **Mô hình con kiểu cũ** (viền đứt, đi vào màn riêng): `la_mo_hinh=true` có cha.
- Đứng trên vai (R7): *rooted ordered tree* + *path-condition* (symbolic execution) cho giả thiết hiệu lực · định lý & định lý đảo / *two-out-of-three* cho nhóm bài · *anchor tasks* (learning progressions) cho trọng điểm · *testlet* (Wainer & Kiely) cho bài kho nhiều ý · *problem family* (Pólya).

### 10.2 Luật cây (Thùy 22/10 — THAY "rẽ nhánh từ bài mẹ" 14/10)

- **Giả thiết nối giả thiết, bài nối bài.** Giả thiết mô hình (gốc chuỗi) và mỗi giả thiết thêm là CÙNG một kiểu nút. Nhánh rẽ ra từ **giả thiết**, không từ bài. **Không bao giờ bài nối vào giả thiết**; bài chỉ nối bài theo trước → sau (tiền đề, AND, nhiều cái được).
- Cạnh cha: `hinh_mo_hinh_cha(mo_hinh_id → cha_id, chinh)`; **một cha** (unique). ⭐ **Bỏ nhánh chính / phụ** [21/11 · Thùy: "chỉ là nhánh thôi, vì có nhiều bài không sâu nhưng rất rộng — nhiều nhánh"]: các nhánh con của một giả thiết là **song song, ngang hàng**; không còn "nhánh chính". Cột `chinh` **giữ nguyên trong DB** (không xoá) nhưng chuỗi dựng từ 21/11 luôn `chinh=false`; luật cũ "`chinh=true` ≤ 1/cha" hết hiệu lực. Các cạnh `chinh=true` cũ (K8 · K9) để nguyên tới khi sửa code (§12b #8).
- RPC: `fn_hl_them_gia_thiet(cha, ten, gt_them, chinh)` · `fn_hl_doi_cha_gia_thiet` · `fn_hl_them_bai` / `fn_hl_them_bai_sau` · `fn_hl_sua_bai` (bài + cách giải mặc định + tiền đề trong 1 transaction; tiền đề phải cùng cây) · `fn_hl_chuyen_bai` (cùng cây; cấm vòng) · `fn_hl_doi_thu_tu` · `fn_hl_tao_mo_hinh` (sinh `phan='luyen'`). `fn_hl_re_nhanh*` / `fn_hl_doi_neo` **đã khoá** (raise). Chuyển bài sang cây khác: cấm.
- **Giả thiết hiệu lực** của bài = `gia_thiet` gốc + `gia_thiet_them` của từng nút trên đường gốc → nút của bài + `gia_thiet_rieng` của bài (`_hl_duong_mo_hinh`, `fn_hl_gia_thiet_hieu_luc`, `fn_hl_gia_thiet_phan`). `gt_thay_the=true` ⇒ thay thế thay vì cộng. Con thấy cha, **anh em không thấy nhau**. Luật 17/08 "bài kế thừa giả thiết bài cha" **bỏ**. Tính ở DB; TS chỉ gọi RPC / render.
- **Bất biến "nhánh chứa tiền đề":** mọi tiền đề *t* của bài *b* nằm trên đường gốc → nút(*b*). Vi phạm ⇒ cờ vàng **⚠ sai nhánh** (`fn_hl_sai_nhanh`), **không chặn lưu**, nhưng builder / in đề **từ chối** bài sai nhánh; cờ nổi ở mọi mức gập. Tiền đề lấy từ cách giải mặc định (`hinh_cach_tien_de`) — **tiền đề gắn ở CÁCH GIẢI**, không ở bài (v3).
- **Mã:** `BT.<khối>.<mh gốc>.<stt>` — bám mô hình GỐC của cây, stt = max cả cây + 1, không tái dùng; trigger `hinh_baitoan_gen_ma` **ép `ma = old.ma` ở mọi UPDATE** (đã sửa, đo 17/11 ✅). Mã không mã hoá nhánh / cành. Số hiển thị **B1, B2…** theo thứ tự tạo trong cả cây (`fn_hl_so_hien_thi`).

### 10.3 Nhóm bài — "nhiều mặt của một bài toán" (Thùy 09/11)

- Một **nền** + bộ **sự kiện** A, B, C…; mỗi **thành viên** là một bài CÓ THẬT "cho mọi sự kiện trừ một, hỏi cái còn lại"; **đầu ra** = nền + đủ sự kiện = giả thiết để chuỗi đi tiếp. Ca "tách ra rồi nhập lại" cũng là nhóm bài (mỗi đường tách = một thành viên). Khuôn khác "n−1 ⇒ 1" chưa biết có — cấu trúc không chặn.
- Nhóm bài có thể là gốc mô hình hoặc giữa chuỗi; một mô hình nhiều nhóm bài được. Thành viên nhiều ý (mỗi ý một nốt; cùng nội dung ở 3 thành viên = 3 nốt, đo riêng).
- **Giữ cây** (không đổi sang nhiều cha): cột `hinh_mo_hinh.vai` ∈ `thuong` · `nhom_bai` · `thanh_vien`. Nút `nhom_bai`: giả thiết = đầu ra; bài đi tiếp treo dưới nó. Nút `thanh_vien`: con của nút nhóm, `gt_thay_the=true`, giả thiết = **nguyên văn đề thật**.
- Sự kiện `hinh_nhom_bai_su_kien` (mã bất biến; nhãn A, B, C suy từ `thu_tu`) · cho/hỏi `hinh_thanh_vien_su_kien(vai ∈ cho|hoi)` — **chỉ có dòng cho bài thật**, không tự đẻ đủ tổ hợp.
- **Hai luật ở DB:** (1) **thành viên KHÔNG có nhánh con** (RPC từ chối cha `thanh_vien`; trigger `_hl_canh_vai_chk`); (2) thành viên đứng **trước** nút nhóm khi xét đường đi và khi in. Cờ sai nhánh tự bắt nốt ngoài nhóm dựa vào nốt thành viên.

### 10.4 Chọn ý (MT · ET · giáo trình) và in

- Tick **từng ý** trên bản đồ (`ChonYTuCay.tsx`). **Đường hợp lệ:** từ ý đầu tới ý cuối đi một đường theo chiều mũi tên, không quay lại, bỏ qua ý giữa được. Sai: 2 thành viên cùng nhóm · ý ở 2 nhánh anh em ⇒ **chỉ CẢNH BÁO, không chặn** (Thùy 09/11). *Luật cũ "rẽ nhánh phụ tối đa 1 lần" gắn với nhánh chính / phụ ⇒ **bỏ theo 21/11** (hệ quả; chờ Thùy xác nhận khi sửa `ChonYTuCay.tsx`).*
- **In** (`fn_hl_ghep_y`, `mucGhep`): có ý thành viên ⇒ in giả thiết thành viên, ý thành viên đứng đầu, rồi giả thiết thêm của các nhánh sau nút nhóm (không in lại đầu ra); không tick thành viên ⇒ in thẳng đầu ra. Giả thiết thêm của mỗi nhánh in ngay trước ý đầu tiên của nhánh. **Thứ tự ý cố định LÚC CHỌN** — lúc in không xếp lại (ô chấm ET đi theo đúng thứ tự đó).
- **In chuỗi** (🖨, `ChuoiHinhPrintView.tsx`, 23/10): mỗi giả thiết có bài = 1 khối (nhãn nhánh + giả thiết + hình), xếp theo số B nhỏ nhất; "Bài N." = số B; sao độ khó; bản GV thêm lời giải.

### 10.5 Hiển thị — màn Cây nhánh (`CayNhanh.tsx`)

- **Tab ① Chuỗi:** chỉ hai hướng — **XUỐNG** và **SANG PHẢI** (không vòng trái, không rẽ lên). **Các nhánh con của một giả thiết ngang hàng: rẽ sang PHẢI, xếp dọc** (Thùy 21/11 + 23/11: không còn nhánh chính / phụ; "những cái rẽ nhánh vẫn làm như cũ"; menu chỉ còn "Thêm nhánh", `laChinh` luôn false); trong mỗi giả thiết **chuỗi bài nằm ngang**: cột = cấp theo tiền đề cùng giả thiết, bài con ĐẦU TIÊN (theo số) đi tiếp cùng hàng, mỗi bài con sau xuống một hàng mới; tiền đề còn lại ghi ở góc thẻ; **mũi tên đi trong khe, không đè thẻ**. Nhánh phía sau ưu tiên gần trên, nhánh phía trước vướng thì lùi xuống — không bao giờ đè. Xếp chỗ thuần hiển thị (client, `xepGiaThiet`).
- **Nhóm bài trên màn (Thùy 23/11):** chuỗi là các node nối nhau; **một bài có nhiều cách hỏi = MỘT node to (nhóm) chứa các thành viên** (vd MH.126: B1·B2·B3 là MỘT node; B4, B5, B6 là các bài riêng đi tiếp). **KHUNG "Nhóm bài (A·B·C)" (cam) ôm CHỈ các thành viên và nằm TRONG hàng chuỗi của khối, giữa ô hình và các bài đi tiếp, có mũi tên sang các bài đó**; thẻ giả thiết (kèm hình) là giả thiết đầu ra, hiện như thẻ thường, **KHÔNG mang nhãn / viền nhóm bài** (ở tab Nhóm và màn chọn ý chỉ ghi nhỏ "đầu ra của nhóm bài"). **Các thành viên của nhóm có hình giống nhau ⇒ KHÔNG vẽ hình riêng từng thành viên: cả nhóm dùng MỘT hình đại diện = hình của giả thiết đầu ra (đủ tính chất mọi thành viên), nằm ngay bên trái khung (Thùy 23/11).** Thẻ thành viên chỉ có chữ giả thiết + bài của nó. Chỗ LƯU vẫn như §10.3 (nút `vai='nhom_bai'` giữ giả thiết đầu ra + các bài đi tiếp, thành viên là con) — chỉ cách HIỂN THỊ đổi. Trước 23/11 màn tô cả thẻ có B4–B6 thành "Nhóm bài" và đẩy thành viên sang phải — hiểu sai.
- **Thẻ:** bài = trắng bo góc, viền màu nhánh, số + tên 1 dòng, cờ ⚠ · giả thiết thêm = **lục giác màu đặc** (khác hẳn thẻ bài), bấm = gập / mở · mô hình con = viền đứt xanh lá · ô gập = viền chấm "▸ N bài" + ⚠. Mỗi nhánh một dải nền nhạt; dây tiền đề xuyên nhánh **mặc định không vẽ** (chỉ bài đang chọn: xanh; sai nhánh: đỏ đứt).
- **Popup bài:** đề · đáp án · lời giải · **hình** (theo giả thiết hiệu lực; bản thật = `anh_de` của bài / ý, resolve như `fn_hl_bai_full`; chưa có hình thì khung "chưa có hình", không chặn) · giả thiết hiệu lực (gốc → nhánh → riêng) · tiền đề (bấm nhảy) · cờ sai nhánh + nút chuyển · **Nhãn**: Độ khó 1–5 · Dạng bài · Bổ đề (danh mục `hinh_dang` / `hinh_bo_de`, khối nhãn ≤ khối mô hình; `fn_hl_bai_nhan_dat`, `fn_hl_bai_do_kho_dat`, đọc `fn_hl_bai_nhan_cay`).
- **Gập:** không có ngưỡng tự gập (CEO 14/10); người dùng tự gập, mặc định mở hết, nhớ theo người dùng. **Tập trung:** chọn bài ⇒ phần ngoài đường gốc → bài và cây con mờ đi. **Tab ② Nhóm:** card lồng theo cây, select "Chuyển nhánh" vá tại chỗ. **Tab ③ Kho bài:** kho của mô hình, mỗi chuỗi ý một dòng. Nhóm bài: khung nền + sự kiện + thành viên cho/hỏi, một mũi tên "đầu ra".
- Giữ trạng thái màn: module-level bộ lọc + cây đã vá + scrollTop + nhánh gập + bài đang chọn. Layout / màn mới ⇒ **mockup HTML cho Thùy duyệt TRƯỚC khi code** (mockup chốt: `docs/mockup-hinh-gia-thiet-mh072.html`, `docs/mockup-hinh-nhieu-cua.html`).

### 10.6 Kho Luyện — bài kho nhiều ý (`spec-hinh-luyen.md` + `spec-kho-hinh-v3.md`)

- **Bài kho** `hinh_bai` = đề thi thật nguyên văn (chữ cái của đề gốc, không chuẩn hoá); `gia_thiet_chung` (phần trước ý a) · `huong_dan` · `loai_cau` · `nguon_ma_cau` (khoá chống nhập trùng) · bỏ qua có log (`hinh_bai_trang_thai_log`). **Ý** `hinh_y` = bản thể hiện: câu hỏi nguyên văn · `gia_thiet_them` (dữ kiện xuất hiện LẦN ĐẦU ở ý đó, không đưa ngược lên giả thiết chung) · `anh_de` riêng (NULL = hình gần nhất phía trước) · đáp án / lời giải · `da_duyet` · `baitoan_id` (gán nốt) · `co_thieu_node` + `mo_ta_thieu` (hàng chờ).
- Quan hệ ý–ý: tuyến tính theo `thu_tu` (ý sau dùng mọi ý trước). Giả thiết hiệu lực của ý *i* = chung + ∪ thêm (*j* ≤ *i*) (`fn_hl_bai_full`). Chọn tập ý bất kỳ (D3): ý bỏ chọn nằm trước ý chọn **nở thành bước** trong lời giải (`fn_hl_chon_y`).
- **Vào kho của mô hình chỉ cần gán BÀI KHO vào MÔ HÌNH** (CEO 14/10) — gán từng ý vào nốt **không** là điều kiện. "Chưa phân mô hình" = bài chưa có `hinh_bai.mo_hinh_id` và không ý nào đã gán nốt. Một ý dùng được (in · giao · đo) khi có câu hỏi + đáp án/lời giải + `da_duyet`.
- **Luật lá (v3 + 13/10, vẫn đúng):** gán ở **tầng ý** · **màn gán không tạo nốt** (gặp ý chưa có nốt ⇒ cờ thiếu + hàng chờ; vị trí lưới không suy được từ đề) · **không ánh xạ / thay chữ** giữa đề gốc và nốt chuẩn · lá lưu nguyên văn, phần trùng mô hình suy lúc gán, không lưu kép · ý có GT thiếu so với mô hình ⇒ gán lên cha, thừa ⇒ con (mô hình tối thiểu) · **ý đã gán KẾ THỪA nhãn của nốt** (suy lúc đọc `fn_hl_y_nhan_hieu_luc`, DB chặn dán nhãn riêng).
- **Builder hai nguồn, không trộn trong một đề:** *Cành* (tick nốt, ghép xuyên nốt cùng cây vì cùng bộ chữ) · *Lá* (tick ý của **một** bài kho; ghép ý của 2 bài kho khác nhau = cấm). Muốn ghép ý trường X với ý trường Y ⇒ đi qua cành.
- **Đáp án hai bậc** (v3): ý có lời giải riêng = chuẩn xác; trống ⇒ rơi về lời giải cách mặc định của nốt (khác tên điểm, có nhãn bậc); chưa duyệt chỉ GV xem.
- **Nhập** (`scripts/hinh-luyen/nhap_tu_de_thi.mjs --khoi <k>` khô · `--thu` · `--ghi`): máy chỉ tách phần chắc — mốc `a) b) c)` / `1) 2) 3)` nối tiếp · trước mốc đầu = giả thiết chung · câu dẫn kết thúc ":" chép vào đầu từng ý · "Phần 1. Hướng dẫn" → `huong_dan` · "Phần 2. Trình bày" tách theo cùng mốc → `loi_giai` · số ý ≠ số đoạn lời giải hoặc câu Đúng/Sai ⇒ không tách, cờ `can_tach_tay`. Câu Hình của đề thi ở kho Học ⇒ **chép** sang kho Luyện thành bài + ý mới, không dời dòng cũ. Luật bóc / giải: `spec-giai-bai.md`.
- **41 mô hình + 367 bài cũ (`phan IS NULL`, xây top-down trước 14/10): ẨN làm tham khảo**, không sửa, không xoá; màn Cây nhánh chỉ đọc `phan='luyen'`; không ẩn ở `loadLuoi` vì 507 lượt làm bài và tài liệu MT/ET cũ phải hiện được (§12 L13).
- Đo: lượt làm bài quy về nốt, ở `_mastery_cells_hinh_tai` (`spec-mastery` §6); lịch sử ý không đổi khi gán ý → nốt (spec v3 dặn mọi ô chấm Hình mang mã ý — chưa kiểm lại hook 17/11). Dashboard: chuyên đề Hình = mô hình gốc, nhóm = trọng điểm (`H:N:<nút nhóm>` · `H:T:<nốt>` · `H:<gốc>`, mig `202611091750`).

### 10.7 Nhóm mô hình — BỎ HẲN (Thùy 09/11 bỏ khỏi màn · 17/11 "xoá hẳn", gật danh sách xoá)

- Lý do: chỉ để hiển thị, 8/15 nhóm có đúng 1 mô hình. **Nhóm chỉ gom** (không kế thừa giả thiết, không đo riêng).
- **Bước 1 (không xoá gì) — ĐÃ BUILD 09/11:** gỡ nhóm khỏi màn bản đồ, tạo mô hình không cần nhóm, báo cáo / dashboard mới lấy cấp "chuyên đề" Hình = mô hình; `_dgcc_nut` · `_phien_hinh_khoi` · `_bdm_chu_de_co_noi_dung` còn dùng nhóm làm dự phòng tra chủ đề.
- **Bước 2 — Thùy gật 17/11.** Đo lại: chỉ **17** báo cáo tuần đã nộp có mục `H:<nhóm>` (con số 135 cũ là mọi mục Hình) và cả 17 đã lưu sẵn tên trong `du_lieu` ⇒ không phải chép tên, không có bảng từ điển. Bản chép 16 nhóm (tên · mô tả · mô hình): `_luu-tru/du-lieu/hinh_nhom_mo_hinh-17-11.json`.
  - **2a ĐÃ ÁP 17/11** (mig `202611171835`): gỡ dự phòng nhóm khỏi 6 hàm (`_bdm_chu_de_co_noi_dung` · `_dbht_cau` · `_dgcc_nut` · `_phien_hinh_khoi` · `_tl_hl_dong_bo_bai` · `fn_bc_ky_tinh`) — đo trước: 27/27 mô hình có chủ đề riêng khớp nhóm ⇒ không đổi số. Client thôi đọc nhóm (`chuyenDeHinh.ts`, `hinhCay.ts` bỏ 7 hàm nhóm, `hinh.ts`, `CayNhanh.tsx`, `ChuyenDeHinhBuilder.tsx`); xoá `scripts/kho/test_nhom_mo_hinh.mjs`.
  - **2b CHỜ DEPLOY ERP rồi mới áp:** `supabase/cho-ap/bo_nhom_mo_hinh_buoc2.sql` — xoá bảng `hinh_nhom_mo_hinh`, cột `hinh_mo_hinh.nhom_mh_id`, 3 trigger, 5 hàm. Giữ 34 dòng `dai_bdm_log` (vết).

### 10.8 Số liệu Hình–Luyện (đo 17/11)

- Mô hình gốc `phan='luyen'`: **27** (K7 13 · K8 10 · K9 4), đủ chủ đề · nút giả thiết `luyen` khác: 27 thường · 4 nhóm bài (1 là gốc) · 10 thành viên · cạnh cha 60 (16 chính) · sự kiện 10 · cho/hỏi 26.
- Nốt `hinh_baitoan` của cây luyện: **93**; trọng điểm bật: **0** · nhãn độ khó / dạng / bổ đề: **0 dòng**; danh mục `hinh_dang` / `hinh_bo_de`: **0**.
- Kho Luyện: **792 bài** (K7 60 · K8 224 · K9 508) · **1.878 ý** (duyệt 187) · 223 bài đã gán mô hình · **1 ý** đã gán nốt.

- **Đo 21/11:** mô hình gốc luyện K7 **12** (MH.133 xoá) · tổng gốc luyện 27 · cạnh cha 59 (6 còn `chinh=true`, thuộc K8 · K9) · nốt cây luyện 107.

### 10.9 K7 "Tam giác bằng nhau" — dựng lại theo `Documents\Mô hình 7.docx` (Thùy 21/11)

- **Phạm vi:** 4 mô hình gốc **MH.126** Phân giác trong tam giác vuông · **MH.130** … tam giác nhọn · **MH.131** Tam giác cụng đầu · **MH.132** Tam giác cân. **MH.133** "Hai trung điểm" BỎ. 8 mô hình "Đường thẳng song song" (MH.076, 085–091) chưa có file chuỗi — giữ nguyên.
- **Cấu trúc (đọc lại DB 21/11):** MH.126 8 nút (2 nhóm bài · 5 thành viên) · 11 bài · 4 tiền đề · MH.130 3 · 7 · 6 · MH.131 9 · 14 · 12 · MH.132 7 · 27 · 27; sai nhánh 0. "Nhóm" của file chỉ là **nhóm bài ở MH.126** (nhóm 1 ba thành viên: ba cách phát biểu; nhóm 2 hai kiểu điểm F); mọi chỗ khác "nhóm" trong file = các nhánh giả thiết song song. **Tam giác cân = 3 nhánh riêng** (hai đường cao · hai phân giác · hai trung tuyến), không gộp nhóm. Bài ngoài nhóm không được dựa vào bài thành viên (§10.3) ⇒ tiền đề "(B6.1, B6.2) → B7" của MH.126 **bỏ** [Thùy 21/11].
- **Hình** (nút nào có bài thì có `anh_cau_hinh`; 27/27 nút): `scripts/anh/ve_hinh_k7_tam_giac_v2.mjs` → `gan_hinh.mjs --bang mohinh`. Hình một nút **cộng dồn** giả thiết trên đường gốc → nút; chỉ vẽ dữ kiện + đoạn đề nhắc tên, **không vẽ điều phải chứng minh**; thành viên nhóm bài chỉ vẽ đúng điều đề thành viên đó cho. Hình bài riêng (`anh_chuan`) chưa làm — bài lấy hình của nút chứa nó.
- **Lời giải** (59/59 bài, `da_duyet=false`): `scripts/kho/hl-loi-giai-k7-tam-giac-v1.mjs`; luật `spec-giai-bai.md` Khối 7 Hình (b) mục "Hình–Luyện cây". Mỗi khẳng định đã kiểm toạ độ (`…-kiem.mjs`, 69.008 phép, 0 FAIL). Tiền đề MH.131: nhánh N,P ← B2 · nhánh L,Q ← B1 [Thùy 21/11 "Đổi tiền đề"].
- **Còn mở:** B4 cụng đầu — file ghi "AD ∥ BC và AD = BC" (sai hình học), cây giữ "AC ∥ BD và AC = BD", **chờ Thùy xác nhận** · sơ đồ tư duy cho bài chứng minh (cây Luyện chưa có chỗ lưu — spec-giai-bai §A6 chỉ có ở `hinh_hoc_cau_so_do`) · duyệt lời giải · xem trên app thật.

## 11. Bản đồ code

| Phần | DB | Màn / client |
|---|---|---|
| Cây Đại / HGT | `dai_bdm_chu_de` · `_chuyen_de` · `_o` · `_nhom` · `_dang_bai` · `_nhom_tien_de` · `_log` · `_cay_nho` · `fn_bdm_cay` · `_bdm_cay_tinh` · `_bdm_so_nhom` · `_bdm_thu_tu` · `fn_bdm_sap_xep` / `_chuyen_*` / `_nang_dang_bai` / `_ha_nhom` / `_gop_chuyen_de` / `_xoa_*` · trigger `trg_bdm_*` | `kho/BanDoMoi.tsx` · `lib/kho/banDoMoi.ts` · `phongtk/PhongTruongKhoiScreen.tsx` |
| Khớp câu | `dai_bdm_gan_cau` · `_de_xuat` · `_cau_thieu_dang` · `_kiem_mau` · `_tu_choi` · `_cau_chua_khop` · `_duyet_pham_vi` · `_kho_ds` · `hgt_bdm_*` · `kho_cau_dang` / `bdm_cau_dang` · `_bdm_cau_giai` · `fn_bdm_khop_*` · `fn_bdm_gan_cau` · `_bdm_tu_duyet_sau_gan` · `fn_de_thi_gan_dang_moi` | `duyetloigiai/KhopBanDoMoiTab.tsx` · `lib/kho/bdmKhop.ts` · `scripts/bdm-b3-*.mjs` |
| Chọn khối / bản đồ | `_kho_ds_nhanh_khoi` · `_bdm_khoi_giu_cu` · `fn_bdm_dang_chon` · công tắc `mastery_ban_do_moi` | `khoiChayBanDoMoi` (`lib/kho/api.ts`) · `DangPickerOne.tsx` · `lib/tailieu.ts` |
| Bản đồ cũ | `dai_ban_do` · `dai_dang_ly_thuyet` · `dai_chuyen_de_*` · `dai_cum_*` · `dai_bdm_doi_ung*` · `dai_de_xuat*` · `fn_dai_chuyen_dang` / `_chuyen_de` · `fn_kho_pham_vi` | `kho/BanDo.tsx` · `DeXuatPanel.tsx` · `CumBaiTab.tsx` · `TienDeBox.tsx` |
| Lý thuyết | các cột / bảng §8.1 | `lib/lythuyetBlocks.ts` · `kho/ui.tsx` · `LyThuyetModal` (`BanDo.tsx`) · `tailieu/PrintView.tsx` · `kho/hinh/HinhPrintView.tsx` |
| Hình–Học | `hinh_hoc_bai` · `_bai_ly_thuyet` · `_bai_y` · `_cau_hoi` · `_cau_lop` · `_cum_bai` · trigger `trg_hh_bai_y_*` | `kho/hinh/KhoHinhHocScreen.tsx` · `lib/kho/hinhhoc.ts` |
| Hình–Luyện cây | `hinh_mo_hinh` · `_cha` · `_ly_thuyet` · `hinh_baitoan` · `hinh_cach_giai` · `hinh_cach_tien_de` · `hinh_nhom_bai_su_kien` · `hinh_thanh_vien_su_kien` · `hinh_baitoan_do_kho/_dang/_bo_de` · `fn_hl_*` / `_hl_*` (≈ 80 hàm) · `hinh_baitoan_gen_ma` | `kho/hinh/CayNhanh.tsx` · `ChonYTuCay.tsx` · `ChuoiHinhPrintView.tsx` · `lib/kho/hinhCay.ts` · `lib/kho/hinh.ts` |
| Kho Luyện | `hinh_bai` · `hinh_y` · `hinh_y_*` · `fn_hl_bai_full` · `fn_hl_chon_y` · `fn_hl_kho_chua_phan` · `fn_hl_gan_y` · `fn_hl_gan_bai_mo_hinh` · `fn_hl_tien_do` · `fn_hl_duyet_bai` | `kho/hinh/KhoHinhScreen.tsx` · `KhoTam.tsx` · `HangCho.tsx` · `DonMoHinh.tsx` · `scripts/hinh-luyen/` |
| Nhóm mô hình (đang bỏ) | `hinh_nhom_mo_hinh` · `nhom_mh_id` · `fn_hl_nhom_mh_*` · `fn_hl_tao_mo_hinh_trong_nhom` · `trg_hl_nhom_mh_*` · `trg_hl_mo_hinh_khop_nhom` | `chuyenDeHinh.ts` · `ChuyenDeHinhBuilder.tsx` |

## 12. Lệch phát hiện (đối chiếu 17/11) + câu hỏi chờ Thùy

> Mỗi dòng: lệch → đề xuất CTO. **Thùy chốt 17/11: "Chốt theo đề xuất"** ⇒ dòng ✅ = đề xuất ở cột phải là QUYẾT ĐỊNH (L12, L13, L15: Thùy trả lời riêng, ghi trong dòng). Dòng không dấu = ghi nhận.

| # | Lệch | Đề xuất CTO |
|---|---|---|
| **L1 ✅** | `fn_dai_chuyen_dang` / `fn_dai_chuyen_chuyen_de` (**sinh mã mới, ghi đè khoá chính**, sửa tay danh sách 7–8 bảng) và `fn_dai_gop_cau_dang` vẫn sống, `authenticated` gọi được, màn cũ `BanDo.tsx` còn modal gọi. CLAUDE §2 ghi "chờ CEO quyết" từ 14/10; spec 4 tầng định "ngừng gọi từ P1". | Mọi khối đã chạy bản đồ mới ⇒ **thu quyền gọi** của 3 hàm (không xoá) + ẩn 2 modal ở `BanDo.tsx`. Xoá hẳn để đợt dọn bản đồ cũ (Luật xoá). |
| **L2 ✅** | Kế hoạch P1/B5/P3/P5/P6 của `spec-ban-do-4-tang` (bảng `dai_chu_de`/`dai_chuyen_de` thật, `fn_ban_do_mo_khoa`, `_ban_do_thu_tu_*`, mở khoá tự học theo thứ tự, bổ trợ "gốc trước ngọn sau") **không build**; thực tế bảng "nháp" `dai_bdm_*` đã thành bản đồ thật + công tắc mastery. | Chốt: `dai_bdm_*` là bản đồ thật, bỏ các pha tạo bảng. Hỏi: **mở khoá tự học theo thứ tự** và **bổ trợ gốc → ngọn** còn là đích không? (đề xuất: giữ ở "để sau", không build bây giờ). |
| **L3 ✅** | Mô tả công tắc `mastery_ban_do_moi` ghi "**Cấp 1 luôn bản đồ cũ**", `spec-mastery` §10.6 ghi "K3·4·5 quy theo bản đồ cũ, tính sau"; nhưng DB: `_bdm_khoi_giu_cu()` = `false` hằng ⇒ `_kho_ds_nhanh_khoi` trả bản đồ mới cho **mọi khối kể cả 3 · 4 · 5 · 4T · 5T**. | Hỏi: cấp 1 chạy bản đồ mới là đúng ý chưa? Nếu đúng ⇒ sửa mô tả công tắc + `spec-mastery` §10.6; nếu không ⇒ bật lại `_bdm_khoi_giu_cu` cho 3/4/5. |
| L4 | Spec 4 tầng mô tả bảng `dai_cum_ly_thuyet` cho ví dụ dạng bài; DB: ví dụ + lý thuyết riêng nằm thẳng ở `dai_bdm_dang_bai.vi_du` / `.ly_thuyet`. Tiền đề nhóm "bỏ 11/10" nhưng còn 10 cạnh + trigger. | Ghi theo DB (đã ghi §3.2, §8.1). |
| **L5 ✅** | Lý thuyết nhóm có ví dụ không: `spec-giai-bai` (K6) "nhóm không có dạng: thêm 2 `##VD` cuối" ↔ Thùy 19/10 "lý thuyết nhóm và dạng KHÔNG chứa ví dụ". Dấu nhân: `spec-ban-do-4-tang` §14.2 "dấu nhân = `.` (cấm `\cdot` `\times`)" ↔ `spec-giai-bai` K7 "`\cdot` hoặc `.` đúng như nguồn". | Đề xuất: lấy luật 19/10 (không ví dụ trong lý thuyết; nhóm nào không có dạng thì tạo 1 dạng bài để chứa ví dụ); dấu nhân theo luật từng khối ở `spec-giai-bai` (xoá câu "cấm `\cdot`" khỏi spec bản đồ). Hai luật này chuyển hẳn sang `spec-giai-bai`. |
| **L6 ✅** | Ghi vào bản đồ — 3 lời Thùy chồng nhau: 20/10 "điền LT/VD/gán dạng chỉ là ĐỀ XUẤT trong HTML, ghi khi nói 'ghi'" · 21/10 "mỗi lần t sửa bản đồ, tự điền + phân lại 1 lượt, không hỏi" · 09/11 "chỉ làm khi ra lệnh, nói rõ scope". | Đề xuất: **phân lại câu** (chỉ dòng `nguon='ai'`, quy trình §3.4) = tự làm sau khi Thùy sửa bản đồ, nhưng **báo scope (khối, số câu) trước một dòng**; **điền lý thuyết / ví dụ / mô tả** = đề xuất HTML, ghi khi Thùy nói "ghi". |
| **L7 ✅** | App HS hiện lý thuyết bằng `MathText` trần (`hocsinh/HocTuDau.tsx` `LyThuyetHTD`), không qua parser ⇒ HS thấy `##TC` trần (281/341 lý thuyết nhóm đã có thẻ). Đã nêu từ 26/09, chưa ai quyết. | Áp khung thẻ cho app HS theo style (`KhungHS`), không bê CSS in ấn. Cần Thùy gật vì là app HS. |
| **L8 ✅** | Dọn cụm 29/10 ⇒ câu bản đồ mới không còn `ma_cum`; `cumKey` mã đề / chống lặp tài liệu lùi về chuỗi gốc–clone ⇒ hai câu GỐC tương đương không còn được biết. `spec-cum-bai` hết hiệu lực với Đại; vẫn áp cho KHTN + Hình–Học. | Đề xuất: **không** dùng dạng bài NDB làm "cụm" (dạng bài rộng hơn isomorph); chấp nhận fallback gốc–clone; nếu cần lại "tương đương" thì làm ở mức câu (bảng cặp tương đương), việc riêng. Hỏi: đồng ý? |
| **L9 ✅** | Việc treo đã có đề xuất, chưa Thùy chốt: K8 17 dạng thiếu (D1–D17) + 4 câu (a)–(d) (`spec-ban-do-4-tang` §15.3) · K6 Số nguyên các ví dụ "chưa chắc" (§14.3) · 8T AM–GM 11 dạng nội dung soạn sẵn + 170 dạng đề xuất · Hình–Học 8T 20 bài 0 lý thuyết / ví dụ. | Giữ nguyên trong danh sách chờ; spec này chỉ trỏ. |
| **L10 ✅** | `fn_kho_pham_vi` (luật phạm vi C8 "chỉ dùng kiến thức chủ đề đó và phía trước") còn đọc `dai_chuyen_de_thu_tu` của **bản đồ cũ** (19 dòng K12 cũ); bản đồ mới chưa có hàm phạm vi. | Viết lại theo thứ tự chủ đề → ô của bản đồ mới (cùng khối + mọi khối dưới) khi có lệnh; hỏi: còn dùng luật C8 ở dây chuyền giải không (`spec-giai-bai`)? |
| L11 | `spec-hinh-cay-nhanh` §10 "nới CHECK `hinh` → `hinh_hoc` · `hinh_luyen`" đã làm rồi **gộp lại** 27/10 (một chủ đề Hình chứa cả Học + Luyện, khoá vùng). §4.2 thuật toán "nhánh rẽ từ bài mẹ / làn bài" và §1.1 `neo_baitoan_id` bị 22/10 thay. | Ghi theo DB + luật 22/10 (§1, §10.2, §10.5). |
| **L12 ✅** | K11 Hình: chủ đề `NCD00208` (vùng `hinh`) có 1 ô + 1 nhóm kiểu Đại (`NNB02044`, 2 dạng bài) — khuôn 4 tầng nằm trong vùng Hình, cạnh 7 bài học. K7 `NCD00255` "Thẳng hàng" rỗng. | ✅ **Thùy chốt 17/11: "K11 là Hình"** ⇒ nhóm `NNB02044` thuộc Hình — chuyển thành bài học Hình–Học (việc DB, làm khi có lệnh). |
| **L13 ✅** | 41 mô hình + 367 bài cũ (`phan NULL`) ẩn từ 14/10 "xoá hay không quyết sau"; nhóm mô hình bước 2 chờ gật (16 nhóm vẫn gắn 27/27 gốc). | **Thùy 17/11:** (a) *"bài thuần t tự dựng lại thì bỏ, câu nào đẩy được vào kho mới thì ok"* — đo 17/11: 367 bài cũ (K7 151 · K8 107 · K9 109), 138 bài có 571 lượt HS làm, chỉ 7 bài trùng chữ với cây mới ⇒ đang làm rõ cách phân; (b) **bỏ hẳn tầng nhóm mô hình, xoá hẳn** — Thùy gật danh sách xoá 17/11; bước 2a đã áp, 2b chờ deploy (§10.7). (a) Thùy chọn **cách A**: bài đã dựng lại ⇒ xoá bản cũ + chuyển lượt HS sang bài mới; bài chưa có ⇒ đẩy vào cây mới — bảng đối chiếu đang lập, Thùy duyệt trước khi ghi. |
| L14 | Tính năng Hình–Luyện đã build nhưng chưa có dữ liệu: trọng điểm 0 · nhãn bài 0 · danh mục dạng / bổ đề Hình 0 · ý gán nốt 1/1.878. `spec-hinh-cay-nhanh` §13.7 ghi ca mẫu MH.126 "chờ duyệt" — DB đã có 4 nhóm bài + 10 thành viên. | Ghi nhận; danh mục dạng / bổ đề Hình là việc của trưởng khối Hình. |
| **L15 ✅** | Hình–Học bài nhiều ý (`hinh_hoc_bai_y`, mig `202611091550`) được áp khi phương án **chưa chốt** (HANDOFF ⛔ 09/11), máy cắt cả K7 · K8 · K8T · K9 (đo 17/11: 937 bài-ý); Thùy đã chỉnh hiển thị 16/11. | ✅ **Thùy chốt 17/11: luật chính thức** (§9). |
| L16 | `spec-kho-hinh-v3` §6 "bảng dữ liệu DISABLE RLS" trái `spec-kien-truc` (mọi bảng bật RLS + policy); v3 "bài không nối bài" nghe trái 22/10 "bài nối bài" — thực ra v3 cấm quan hệ cha–con giữa bài, 22/10 là nối theo tiền đề (đã có từ v3 qua cách giải). | Theo `spec-kien-truc`; ghi rõ ở §10.2. Phần M0–M9 / cổng 1–2 / NGUONG_DO_KHO của v3 là màn cũ, không phát triển thêm (lối vào đích = Bản đồ mới). |
| L17 | Chuyên đề **dùng chung** là đích Q5 nhưng thực tế 2/189; câu chuyên đề K12 "Bài toán thực tế ứng dụng toạ độ" 0 nhóm. | Ghi nhận; không phải lỗi. |

**Đưa sang spec khác khi gộp:** buổi bù không có phần Hình (`ensureBuoiBuETProblems` chỉ chép câu Đại — `spec-ban-do-4-tang` §12) ⇒ `spec-builder` / vận hành · gắn lại câu cho 1.392 ô ET buổi bù trước 29/09 + 57 ô mất thật ("lỗi B") ⇒ `spec-mastery` (việc dữ liệu đo) · bản đồ phiêu lưu app HS (lục địa = chủ đề, khu vực = ô, màn = nhóm, quái = dạng) ⇒ `spec-app-hs` · đường trung bình chỉ đề Ngôi Sao Hoàng Mai ⇒ `spec-giai-bai`.

## 12b. Việc phát sinh — CHỈ làm khi Thùy ra lệnh riêng (một bước một lần)

| # | Việc | Từ |
|---|---|---|
| 1 | Thu quyền `authenticated` của `fn_dai_chuyen_dang` · `fn_dai_chuyen_chuyen_de` · `fn_dai_gop_cau_dang` + ẩn 2 modal ở `BanDo.tsx` (không xoá hàm) | L1 |
| 2 | Sửa mô tả công tắc `mastery_ban_do_moi` ("Cấp 1 luôn bản đồ cũ" → mọi khối bản đồ mới) | L3 |
| 3 | Khung thẻ lý thuyết cho app HS theo style (`KhungHS`) — thay `MathText` trần ở `LyThuyetHTD` | L7 |
| 4 | Viết lại `fn_kho_pham_vi` (luật C8) theo thứ tự chủ đề → ô của bản đồ mới | L10 |
| 5 | Chuyển nhóm `NNB02044` (K11) thành bài học Hình–Học | L12 |
| 6 | Bỏ nhóm mô hình bước 2b: áp `supabase/cho-ap/bo_nhom_mo_hinh_buoc2.sql` SAU khi deploy ERP | L13 |
| 7 | Bài Hình–Luyện cũ: `supabase/cho-ap/hinh_luyen_chep_loi_giai_xoa_36_bai_cu.sql` (chưa có lệnh áp); phần còn lại Thùy "bỏ" 17/11 | L13 |
| 8 | Bỏ nhánh chính / phụ ở code (Thùy 21/11). **ĐÃ LÀM 23/11 phía màn Chuỗi / Nhóm / chọn ý:** nhãn "Nhánh", menu "Thêm nhánh", bỏ nút chọn chính/phụ, `laChinh` luôn false, layout mọi nhánh rẽ phải. **CÒN:** `ChonYTuCay.tsx` luật rẽ phụ ≤ 1 (đã bỏ nhãn, luật cảnh báo chưa xét lại) · tham số `chinh` của `fn_hl_them_gia_thiet` / `fn_hl_doi_cha_gia_thiet` (app luôn gửi false) · 6 cạnh `chinh=true` còn lại ở K8 · K9 (layout đã bỏ qua; đổi về false khi Thùy gật) | §10.2 |

## 13. Khi Thùy duyệt

- ✅ 17/11: 6 nguồn → `_luu-tru/` (`git mv`; `spec-cum-bai.md` giữ ở gốc cho KHTN + Hình–Học), bảng B `SPEC-INDEX.md`, CLAUDE.md §7 trỏ sang spec này. L3 đã sửa `spec-mastery.md` §10 dòng 6; L5 đã sửa `spec-giai-bai.md` (lý thuyết nhóm không chứa ví dụ).
- Câu trả lời L1–L15 ghi vào bảng §12 (cột "Thùy chốt"), như `spec-mastery.md` §10.
