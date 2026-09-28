# Game trong buổi học — spec (DRAFT, chờ CEO duyệt)

> Thùy 27/09: sau sự kiện Trung thu, đưa game vào buổi học BK. **Mỗi game 2 phiên bản luật**: bản SỰ KIỆN (giữ nguyên
> cho sự kiện sau) và bản BUỔI HỌC (link thẳng lớp đang học, luật hợp lớp). Trạng thái: NHÁP — CHƯA code.
> **Thùy 27/09: "đừng chốt cái gì — t đề xuất kịch bản, luật chơi t viết".** CTO chỉ lo: hỏi OUTPUT + đường nối ERP (§6).

## 1. Quyết định đã chốt (27/09)

| # | Câu hỏi | Chốt |
|---|---|---|
| 1 | Game nào | **Đoán Số · Chiếm Đất · Mở Rương** (3 trò TV, GV điều khiển) |
| 2 | Thưởng bằng gì | **EXP của môn** — nguồn thứ 4 "Trên lớp", cuối tháng chốt EXP→xu như các nguồn khác |
| 3 | Kiểu | **Giữ game, đổi luật** (chưa gắn câu hỏi/nội dung học) |
| 4 | Vé | **GV thưởng lượt** — miễn phí, chỉ HS được GV phát lượt mới chơi. HS **không bao giờ mất EXP** |
| 5 | Khi nào | **GV tự quyết** — nút mở game luôn có trong màn Buổi học |
| 6 | Ngân sách EXP | Nguồn "Trên lớp" TB **~300 EXP/HS/buổi**, dải **200–500** (4 nguồn: ET 100 cố định · BTVN 200/bài · Tự luyện ngẫu nhiên · Trên lớp) |

> ⚠ R1: ET 100 / BTVN 200 là **ĐÍCH**; DB hiện (30 ngày) ET 200–300, BTVN 189–300, TB 525 EXP/HS/buổi. Chỉnh 2 nguồn đó = việc
> RIÊNG, không nằm trong spec này.

## 2. Kiến trúc — 1 bộ code, 2 bộ luật (KHÔNG copy file)

- Mỗi game đọc **chế độ** lúc mở: mặc định = SỰ KIỆN (y hệt hiện tại, 0 thay đổi); `?che_do=lop` = BUỔI HỌC.
  Lý do không tách file: mọi bản vá (chống văng, chạm iPad…) sẽ phải vá 2 nơi → 2 bản lệch nhau (bài học drift v1).
- **Bản BUỔI HỌC: kết quả RÚT Ở POSTGRES, TV chỉ diễn** (§2.0 — EXP là dữ liệu nghiệp vụ, không để trình duyệt TV bốc
  ngẫu nhiên rồi ghi). Giống vòng quay sự kiện: `fn_sk_quay` rút ở DB, TV quay dừng đúng ô.
- **Luồng** (tái dùng đúng mẫu quản trò sự kiện đã chạy thật 26/09):
  1. GV mở **Buổi học** (ERP, đã đăng nhập) → nút **🎮 Game** → chọn game → TV (laptop lớp) mở game `?che_do=lop` qua kênh realtime.
  2. GV **phát lượt** cho HS ngay trên màn buổi (bấm +1 cạnh tên HS có mặt). Danh sách = HS `co_mat` của buổi → tự đổ xuống TV, không gõ tên.
  3. Chơi: GV chọn HS có lượt trên TV/ERP → ERP gọi RPC → **DB rút kết quả + ghi `gami_exp_ledger` trong 1 transaction** → phát kết quả xuống TV → TV diễn (mở ô / mở rương / quay số).
- **Dữ liệu** (mọi thứ mang `mon` — §1.6; `mon` lấy từ `lop.mon` của buổi):
  - Bảng mới `game_luot` — 1 dòng = 1 lượt GV phát (buoi_hoc_id, hoc_sinh_id, game, mon, nguoi_phat, at). Lượt "còn" = phát − đã chơi (suy động, không cột đếm).
  - Kết quả = dòng `gami_exp_ledger` `source='exp_tren_lop'`, `ref_buoi_hoc_id`, `mon`, note = game + chi tiết; khoá unique theo lượt ⇒ bấm 2 lần / 2 máy không cộng đúp.
  - **Trần DB: 500 EXP game/HS/buổi** — vượt thì cắt ở hàm, không ở client.
- RPC (mẫu `fn_*`, security definer có cổng quyền GV của lớp): `fn_game_phat_luot` · `fn_game_choi` (rút + ghi, trả kết quả cho TV diễn) · `fn_game_tinh_hinh_buoi` (lượt còn/đã chơi/EXP từng HS).

## 3. Luật bản BUỔI HỌC — ⛔ THÙY VIẾT (số dưới chỉ là nháp CTO để hình dung, KHÔNG dùng)

Nguyên tắc: **mỗi lượt kỳ vọng ~100 EXP** ⇒ GV phát ~3 lượt/HS/buổi ≈ 300 EXP (dải thực tế ~200–500, trần 500).
Không vé, không "thua mất vốn": lượt nào cũng có EXP, chỉ khác nhiều hay ít.

**Chiếm Đất / Mở Rương — chọn mức RỦI RO, cùng kỳ vọng 100 EXP** (thay cho giá 5/10/15 xu):

| Mức | Chiếm Đất | Mở Rương | Nhận (EXP) | Ý nghĩa |
|---|---|---|---|---|
| An toàn | ô ★ | Rương Gỗ | 80 – 120 | chắc chắn, ít biến động |
| Vừa | ô ★★ | Rương Bạc | 40 – 200 | |
| Liều | ô ★★★ | Rương Vàng | 20 – 300 | hên thì to, xui thì ít |

Hình quà / thẻ quà giữ nguyên nguyên tắc 26/09: nhìn hình biết to/nhỏ, số hiện sau. Độc đắc: bỏ ở bản lớp (hoặc 1 ô
"+300" hiếm — CEO chốt).

**Đoán Số — cả lớp (HS có lượt) đoán cùng 1 lần quay**, DB rút số:

| Kết quả | EXP |
|---|---|
| Trúng đúng | 300 |
| Lệch 1–2 | 200 |
| Lệch 3–5 | 130 |
| Lệch ≥6 (sàn) | 90 |

Kỳ vọng ≈ 3 + 8 + 7,8 + 80 ≈ **99 EXP/lượt**. Hàng chục dừng trước, hàng đơn vị bò chậm (giữ như bản sự kiện).

## 4. Không làm (đợt này)

- Không gắn câu hỏi/nội dung học vào game (quyết định #3).
- Không đụng 5 game iPad, Catan, Đua, BK Escape.
- Không đổi EXP của ET/BTVN (việc riêng, xem ⚠ §1).
- Bản SỰ KIỆN: không sửa luật.

## 5. Còn chờ CEO chốt

1. Bảng số §3 (dải EXP từng mức, EXP Đoán Số) — hay chỉnh?
2. Mặc định GV phát bao nhiêu lượt/HS/buổi (đề xuất 3; trần EXP 500 vẫn chặn nếu phát nhiều)?
3. Độc đắc bản lớp: bỏ hẳn hay giữ 1 ô hiếm?
4. Tên nguồn EXP mới hiển thị cho HS/PH: "Trên lớp"?
5. TV lớp: dùng laptop GV nối máy chiếu (hub `?che_do=lop`) — đúng thiết bị thực tế ở lớp?

## 5b. XẾP HẠNG BUỔI HỌC → giải → lượt game (kịch bản Thùy 27/09)

Thùy: trong phần chấm bài trên lớp có tính năng mới **xếp hạng buổi học** (bạn nào xuất sắc nhất hôm đó). Hệ thống
đề xuất từ dữ liệu trên lớp (không đầy đủ), GV duyệt/sửa. Mỗi lớp: **Nhất · Nhì · còn lại Giải 3** — ứng 3 mức của game.

| # | Câu hỏi | Thùy chốt 27/09 |
|---|---|---|
| 1 | Đề xuất dựa vào đâu | **Chỉ điểm bài trên lớp (phase `ingame`) của chính buổi**. KHÔNG dùng ET (thưởng chốt TRƯỚC ET; ET buổi trước thì sai logic) |
| 2 | Buổi không có dữ liệu | **GV tự chọn** |
| 3 | GV duyệt ra gì | **Chỉ chọn Nhất + Nhì**; HS có mặt còn lại = Giải 3 |
| 4 | HS vắng | Không có giải |
| 5 | Sau duyệt | **Khoá**. GV muốn sửa thì **mở lại** |
| 6 | Ảnh hưởng Elo | **Tạm thời không** (Elo vẫn chỉ từ ET) |
| 7 | Giải → game | **Lượt chơi mang mức giải của HS** |
| 8 | Số lượng giải | **1 Nhất**. Nhì: 1; lớp **trên 10 HS** được chọn **tối đa 2 Nhì** |
| 9 | Số lượt | **1 lượt / HS / buổi** |
| 10 | Chọn game | **GV chọn** game cho buổi |
| 11 | Mở lại khi đã chơi | **Đã có EXP ghi (có HS chơi) ⇒ KHÔNG mở lại được nữa** |

| 12 | "Lớp trên 10" tính theo | **Số HS có mặt** buổi đó |

**LUẬT MỞ RƯƠNG BẢN LỚP (Thùy duyệt 27/09)** — giải nào mở rương đó, EXP bước 20, TB cả lớp ~200 EXP/HS/buổi:

| Giải → Rương | EXP : tỉ lệ % | TB |
|---|---|---|
| Nhất → Vàng (200–400) | 200:2 · 220:4 · 240:7 · 260:10 · 280:14 · 300:26 · 320:14 · 340:10 · 360:7 · 380:4 · 400:2 | 300 |
| Nhì → Bạc (200–300) | 200:10 · 220:15 · 240:25 · 260:25 · 280:15 · 300:10 | 250 |
| Giải 3 → Gỗ (100–200) | 100:4 · 120:6 · 140:9 · 160:14 · 180:25 · 200:42 | 175 |

TB/HS theo số có mặt: 3→242 · 5→215 · **8→200** · 10→195 · 11(1 Nhì)→193 · 11(2 Nhì)→200 · 12(2 Nhì)→198 · 14(2 Nhì)→195.
Thùy yêu cầu đầu tiên "TB 250" — không đạt được với 3 khoảng này (lớp 8 bạn, tất cả ra MAX mới 238) ⇒ Thùy hạ mục tiêu còn 200.

**Luồng dữ liệu (cách nối — CTO, theo 11 điểm trên):**
1. Khung **🏆 Xếp hạng buổi** trong phần chấm bài trên lớp: gợi ý từ điểm `ingame` của buổi (hoà hiện là hoà), không dữ liệu ⇒ trống.
2. GV chọn Nhất + Nhì → **Chốt** (khoá) / **Mở lại** (chỉ khi chưa HS nào chơi). Mỗi lần chốt/mở lại: trigger ghi lịch sử (ai, lúc nào).
3. Chỉ lưu dòng cho Nhất/Nhì; **Giải 3 = có mặt − Nhất − Nhì (suy động)** ⇒ HS điểm danh muộn tự vào Giải 3; HS có giải bị sửa thành vắng ⇒ nêu cờ cho GV.
4. Sau chốt: mỗi HS có mặt có **1 lượt** mang mức giải; GV chọn game → TV mở game `?che_do=lop` → mỗi lượt chơi: DB rút + ghi EXP (nguồn mới, 1 transaction, khoá 1 lượt/HS/buổi) → TV diễn.
5. EXP ghi đúng `mon` của lớp, `note` = tháng của ngày buổi; thêm nguồn mới vào đủ 4 chỗ liệt kê cứng (§6).

Sự thật đo 27/09 (30 ngày, 253 buổi thường): bài trên lớp có đề 208 buổi nhưng **có chấm chỉ 25 buổi (~12%)**, TB 26 ô
chấm/buổi; điểm ô 20/40/60/80/100. ⇒ đa số buổi đề xuất TRỐNG, GV tự chọn. `fn_dong_phase('ingame')` hiện đã xếp theo
tổng điểm (chỉ để hiện, exp 0) — hoà điểm thì xếp theo `hoc_sinh_id` (≈ ngẫu nhiên) ⇒ đề xuất mới phải hiện HOÀ là hoà, để GV chọn.

## 5c. ĐÃ BUILD (27/09) — Xếp hạng buổi + Mở Rương bản lớp

- DB (áp): mig `202609272045_xep_hang_buoi_va_game_lop` · `202609272048_recompute_exp_thang_khong_xoa_exp_tren_lop` ·
  `202609272053_game_choi_tra_min_max_khi_choi_lai`. **CHỜ Thùy chạy SQL Editor:** `202609272045_exp_tren_lop_vao_chot_xu_thang.sql`
  (fn_gami_exp_xu_thang owner postgres) — chưa chạy thì EXP game KHÔNG được chốt thành xu cuối tháng.
- ERP: khung **🏆 Xếp hạng buổi** đầu tab "Chấm bài trên lớp" (chỉ buổi thường) — `src/screens/gami/XepHangBuoi.tsx`,
  RPC ở `src/lib/gameLop.ts`. Sau chốt: chọn game, "📺 Mở màn TV", đèn "● TV đã nối" (presence), nút "Mở cho bạn này" từng HS, "↻ TV" chiếu lại.
- TV: `games-site/mo-ruong.html?che_do=lop&buoi=<id>` — kênh `bk-lop:<buổi>`, hàng chờ lệnh, giải → rương (Nhất Vàng · Nhì Bạc ·
  Giải 3 Gỗ), đơn vị EXP, không sổ xu. Hình quà bí ẩn theo EXP tuyệt đối, ngưỡng chung mọi giải: ≤140 hộp to · ≤200 thỏi vàng ·
  ≤280 đống vàng · >280 núi vàng. Bản sự kiện (không `?che_do`) giữ nguyên.
- Nhãn nguồn: ví xu HS → card "🎮 Hoạt động trên lớp" (nguồn `exp_tren_lop`); bảng điểm gami "Trên lớp (game)"; `EXP_NOTE_SOURCES`.
- Link TV dùng `VITE_GAMES_URL`, mặc định **`https://game.bkacademy.edu.vn`** (domain thật, đo 28/09 qua `vercel project ls` — project `bkdemy-erp-v2-2ogm`). Mặc định cũ `bkdemy-games.vercel.app` là đoán, trả 404.
- Chưa làm: Đoán Số bản lớp (chờ luật Thùy — luật sự kiện là cả nhóm đoán chung 1 lần quay, giải không có chỗ tác động;
  Thùy chọn 1 trong: giải quyết định EXP mỗi mức lệch / số lần đoán / độ rộng vùng trúng) — ô chọn game khoá "(chờ luật)".

## 5d. ĐÃ BUILD (28/09) — Chiếm Đất bản lớp + quà đặc biệt 🧋 trà sữa (Thùy chốt 28/09)

**Luật Thùy:** Chiếm Đất — 3 loại ô = 3 mức giải: **Giải 3 → ô ★ · Nhì → ô ★★ · Nhất → ô ★★★**. Thưởng EXP **y hệt Mở Rương**
(cùng bảng §5b). Mỗi HS **chọn ô bất kì**, không giới hạn (không cần sát đất đã mở, không độc đắc).
**Trà sữa** (cả Mở Rương + Chiếm Đất): rút THÊM, độc lập với EXP — **Nhất 0,1% · Nhì 0,05% · Giải 3 0,01%** mỗi lượt.
Trúng thì vẫn nhận EXP như thường + 1 trà sữa (quà thật, trao tay).

- DB (mig `202609281021_chiem_dat_lop_va_tra_sua`, đã áp qua `npm run migrate --only`):
  - `game_lop_thuong` thêm `game='chiem_dat'` = chép nguyên 23 dòng `mo_ruong` (TB Nhất 300 · Nhì 250 · Giải 3 175).
  - `game_lop_qua_dac_biet(qua, giai, ti_le_pt numeric %)` — seed `tra_sua` 0.1/0.05/0.01, **Thùy 28/09 nhân 5 ⇒ 0,5 / 0,25 / 0,05 (mig `202609281044`) rồi gấp đôi ⇒ 1 / 0,5 / 0,1 (mig `202609281052`)** — ≈ 7 ly/tháng toàn trung tâm (300 buổi, lớp 10 bạn), mỗi lớp ~1,5 năm 1 lần; Thùy: "jackpot thì phải khó". Đổi số ở đây, không sửa code. Áp mọi game.
  - `buoi_game_qua(luot_id PK → buoi_game_luot, buoi_hoc_id, hoc_sinh_id, qua, trao_at, trao_boi)` — dòng CHỈ khi trúng (§1.5);
    `trao_at` NULL = chưa trao tay.
  - `fn_buoi_game_choi`: sau khi rút EXP, duyệt `game_lop_qua_dac_biet` theo giải, `random()*100 < ti_le_pt` ⇒ insert
    `buoi_game_qua` (cùng transaction). Trả thêm `qua` (null = không trúng). Nhánh đã-chơi trả `qua` của lượt cũ (không rút lại).
  - `fn_buoi_giai_tinh_hinh`: mỗi HS thêm `qua`, `qua_trao_at`; tổng `so_qua_chua_trao`.
  - `fn_buoi_game_qua_trao(p_buoi, p_hoc_sinh)`: khép quà (set `trao_at`/`trao_boi`); lỗi nếu bạn đó không có quà chưa trao.
  - Verify: chạy toàn bộ trong transaction ROLLBACK trên buổi thật (chốt → chơi Nhất chiem_dat 320 EXP → chơi lại trả `da_choi`
    cùng số → ép tỉ lệ 100% để đi nhánh trúng → `buoi_game_qua` 1 dòng → trao → lỗi đúng khi trao bạn không có quà);
    mô phỏng 20.000 lượt Nhất TB 299,8 ≈ 300.
- ERP (`gameLop.ts` · `XepHangBuoi.tsx`): Chiếm Đất mở khoá; payload xuống TV thêm `game` (TV lọc đúng game — GV mở 2 tab TV vẫn
  đúng) + `qua`; ERP báo "🧋 X TRÚNG Trà sữa!" + khung hồng "có N bạn trúng quà chưa trao" + nút **"🧋 Trà sữa · Đã trao"** cạnh tên
  (bấm ⇒ RPC trao ⇒ thay thành "🧋 Trà sữa ✓"). Vá tại chỗ từ RPC, không reload khung.
- TV `chiem-dat.html?che_do=lop&buoi=<id>` (bản sự kiện không đổi — đã đối chiếu: 14/12/10 ô, xu, sát đất, độc đắc):
  bản đồ **18 ô ★ · 15 ô ★★ · 3 ô ★★★**, không độc đắc, lưu `localStorage bk-chiemdat-lop:<buổi>` (F5 giữ). Huy hiệu ô ghi
  G.3/NHÌ/NHẤT thay giá xu; chú giải "★ Giải 3 · ★★ Nhì · ★★★ Nhất". Nhận lệnh ⇒ hàng chờ; tới lượt ⇒ chỉ các ô CHƯA MỞ ĐÚNG CẤP
  sáng, hint "<Tên> (🥇 Nhất) — chọn 1 ô ★★★ bất kì"; bấm ô sai cấp ⇒ toast; bấm đúng ⇒ mở ngay (không hộp thoại thu xu), thẻ
  "+340 EXP · SIÊU QUÀ · Giải Nhất · EXP đã vào tài khoản"; Space/Enter ⇒ bạn tiếp. Hình quà theo EXP tuyệt đối như Mở Rương
  (≤140 nhỏ · ≤200 ngon · ≤280 lớn · >280 siêu quà). Hết ô đúng cấp ⇒ hint đỏ "bấm 🗺 Bản đồ mới" (nút vẫn hiện ở bản lớp).
  Trúng trà sữa ⇒ overlay to "🧋 TRÚNG TRÀ SỮA!" + pháo giấy. Mở Rương bản lớp: dòng phụ banner đổi thành "🧋 TRÚNG TRÀ SỮA!…".
- CHƯA: test 1 lớp thật (như Mở Rương) · deploy bkdemy-games + ERP · Đoán Số bản lớp (chờ luật).

## 5d. MÀN TRÌNH CHIẾU 1 MÀN (Thùy 28/09)

- "Không cần 2 màn — cast laptop sang TV; màn quay hiện danh sách từng HS để so." ⇒ sau chốt, nút **🖥 Trình chiếu** mở overlay
  toàn màn TRONG ERP: game (iframe `game.bkacademy.edu.vn/<game>.html?che_do=lop&buoi=`) + cột danh sách cả lớp theo giải (+EXP, 🧋),
  GV bấm "Mở" trên tên. Trang game không đổi (vẫn nghe kênh `bk-lop:<buổi>`). "tab riêng" còn cho ca 2 màn.

## 6. Đường nối ERP (đã dò DB/code thật 27/09 — sự thật, không phải đề xuất)

- **Buổi → lớp → môn:** `buoi_hoc.lop_id` → `lop.mon` (lop có cột `mon`, `khoi`). Danh sách + điểm danh: `getRoster(buoiId)` (src/lib/gami.ts:203), đổi điểm danh `diemDanh` (:270).
- **Sổ EXP:** `gami_exp_ledger` (hoc_sinh_id, source, amount, ref_buoi_hoc_id, note, mon). Nguồn đang có dữ liệu: exp_et 2822 · exp_btvn 2443 · exp_btvn_thang 611 · attend_floor 327 · exp_thang 284 · rank_et 122 · btvn 98 · rank_ingame 64 dòng.
- ⚠ **BẪY: nguồn EXP bị LIỆT KÊ CỨNG ở 4 chỗ** — thêm nguồn mới mà quên 1 chỗ thì EXP game **không bao giờ thành xu / không hiện**, im lặng không lỗi:
  - `fn_gami_exp_xu_thang` (chốt xu tháng) · `fn_gami_exp_chi_tiet_thang` · `fn_hs_vi_xu_cua_toi` (ví xu trên app HS): `source in ('exp_thang','exp_et','exp_btvn','exp_btvn_thang') and note = <tháng>` + `attend_floor` theo khoảng ngày.
  - `EXP_NOTE_SOURCES` src/lib/gami.ts:830 (comment trong mig 202609031903 đã cảnh báo "sửa CẢ HAI").
  - Tháng của 1 dòng EXP xác định bằng **`note = 'YYYY-MM'`**, không phải created_at ⇒ nguồn game phải ghi note = tháng của NGÀY BUỔI HỌC.
  - (`fn_hs_vi_xu_cua_toi` hiện KHÔNG có `exp_thang` trong danh sách — khác 2 hàm kia; ghi nhận, chưa rõ cố ý hay sót.)
- **Điều khiển TV từ ERP:** đã có mẫu chạy thật (quản trò sự kiện 26/09): máy ERP đã đăng nhập ↔ TV game qua kênh Supabase Realtime (gửi tên theo slot, nghe kết quả, ghi DB qua RPC, khoá theo ván chống cộng đúp).
- **Chỗ đặt nút mở game:** màn Buổi học `src/screens/gami/BuoiHocScreen.tsx` (GV/TA đang dùng để điểm danh/chấm).
- **Hiệu ứng trúng trà sữa (Thùy 28/09: "phải thật bùng nổ")** — `games-site/lib/bk-tra-sua.js`, 1 file dùng chung mọi game bản lớp
  (`window.bkTraSua({ten,giai,exp,sound})`, game nạp khi vào `?che_do=lop`; chưa nạp kịp thì dùng overlay cũ). Kịch bản ~1,3s hồi hộp
  (hộp quà rung + phóng to + trống dồn, "QUÀ ĐẶC BIỆT…") → BÙM: chớp trắng, rung màn, ly 🧋 nổ to rồi nhún, chữ "TRÚNG TRÀ SỮA!"
  từng chữ bật ra đổi màu cầu vồng, nền tia sáng xoay đổi màu, pháo hoa dồn dập ~6s rồi thưa dần, pháo giấy 2 góc, mưa ly trà sữa +
  trân châu nảy đáy, kèn vàng 3 lần. Nút "Tuyệt vời ▶" hiện sau 2,8s (chống bấm lỡ); Space/Enter/Esc/chạm đều đóng và **bị chặn không
  xuống game** (không nhảy sang bạn tiếp). Xem thử không dữ liệu: **Ctrl+Shift+M** trên TV bản lớp.
