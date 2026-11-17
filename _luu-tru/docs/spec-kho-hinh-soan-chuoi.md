# Spec — Kho Hình: soạn tài liệu theo CHUỖI / CÂY node (2026-08-08)

> Chốt qua brainstorm CEO(Thùy)–CTO. Đọc trước khi code phần soạn tài liệu Hình theo mô hình.
> Bổ sung cho HANDOFF ① mục "Kho Hình 08-07". Nguồn logic: hội thoại 08-07→08.

## 1. Mô hình 4 tầng

```
Mô hình TO (hub)                                    ~ chuyên đề (Đại)
 └─ Mô hình VỆ TINH
     └─ CÂY node (nối nhau qua tiền đề)              ~ dạng (Đại)
         └─ BIẾN THỂ / lứa (đề chuẩn + bản đổi đỉnh) ~ bài gốc + clone (Đại)
```

Khác Đại về BẢN CHẤT: node trong cây **kế thừa nhau** (chọn node này kéo theo đáp án node kia).
⇒ KHÔNG bê cơ chế least-used của Đại; "chọn câu" ở Hình = chọn tập node trên cây + chọn bản/lứa.

## 2. Cấu trúc 1 BÀI (đã chốt)

- **1 bài = đúng 1 ĐÍCH.** Đích = node ngọn (không làm tiền đề cho ai). Tree của bài = đích + **bao đóng
  tiền đề hội tụ** về nó (`chuoiTienDe` đã có).
- **HỘI TỤ, cấm PHÂN KỲ.** Tick xuyên nhánh phân kỳ ⇒ tách bài khác. (Ví dụ {1,4,5} phân kỳ = không hợp lệ.)
- **Node lẻ = chuỗi 1 node** (một luồng chung, không tách UI riêng).
- **ĐÍCH = SUY, không lưu:** lúc in lấy node `cap` cao nhất trong tập tick làm đích rồi tính bao đóng.
  (Bỏ tick node ngọn ⇒ bài dừng ở node được-hỏi-cao-nhất — đúng ý.)

## 3. Cơ chế NỞ đáp án (logic cốt lõi — MỚI)

Ký hiệu: node **tick** = ý được hỏi; node **ẩn** = trong bao đóng nhưng không tick.

- Bản HS: chỉ hiện các **ý** (node tick).
- Bản GV/đáp án: node tick = ý; node ẩn nở thành **bước con** trong ý phụ thuộc nó.
- **Cắt tại node tick:** nở bao đóng của một ý, gặp node tick khác thì **DỪNG** (viện dẫn "theo [tên tính
  chất]", KHÔNG dùng nhãn a/b/c — nhãn động theo tập tick). Node ẩn nở **đúng một lần** (ở ý đầu tiên cần),
  thứ tự bước theo `cap`.
- Ví dụ canonical: node 1–8, tick {2,4,8} → 3 ý; đáp án phủ trọn 1–8, không lặp (ý-4 nở node-3 rồi dừng ở
  node-2; ý-8 nở 5-6-7 rồi dừng ở node-4).
- **Quy ước soạn (kỷ luật):** lời giải mỗi node viện dẫn tiền đề THEO TÊN tính chất, KHÔNG "theo ý a/b/c"
  (nhãn đổi theo tập tick ⇒ tham chiếu nhãn = vỡ âm thầm, đúng bài học DANH-TÍNH-khoá-tự-nhiên).

## 4. Giả thiết phụ + VAN (MỚI)

- **Giả thiết phụ** = dữ kiện lẻ gắn 1 node, đa số là **vẽ thêm** ("gọi I = AC∩BD"). Bám node, hiện NGAY
  chỗ node xuất hiện: node tick → ở ĐỀ của ý; node ẩn → ở đầu BƯỚC trong đáp án. (Cùng lời giải node đó
  khi nở xuống.)
- **VAN tuỳ chọn (mặc định TẮT):** cờ trên **cạnh tiền đề** — bật ⇒ giả thiết phụ của tiền đề **trồi lên
  ĐỀ** của ý phụ thuộc (cho sẵn đường phụ = giảm độ khó). Truyền bắc cầu theo các cạnh BẬT liên tiếp, DỪNG
  ở cạnh tắt hoặc node tick. (Soi gương cơ chế §3: lời giải LUÔN nở; giả thiết phụ chỉ nở-lên-đề khi van bật.)
- **Ý nghĩa:** van = nút chỉnh ĐỘ KHÓ (cho sẵn vẽ thêm ở đề vs để HS tự dựng).
- **Nhắc (không chặn):** một bài kéo quá vài giả thiết phụ lên đề ⇒ gợi ý "cân nhắc tách mô hình".
- **An toàn:** quy tắc mặc-định-ở-đáp-án đúng VÌ giả thiết phụ là vẽ-thêm (HS tự dựng được). Nếu là DỮ KIỆN
  THẬT (không dựng được) mà để node ẩn ⇒ HS thiếu — người soạn phải bật van HOẶC nâng thành giả thiết chung.

## 5. Lưu trữ & reload (`hinh_gt_bai`)

**ĐÃ đủ (không đẻ lại):** `loai='ghep'` + `ghep_node_ids[]` (tập tick) + `lua_id` (bản) chịu được "tập con +
lứa". `ganLopSnapshot` copy nguyên các cột ⇒ snapshot OK.

**Cần:**
- Node ẩn **KHÔNG lưu** — derive lúc in từ bao đóng của node sâu nhất trong `ghep_node_ids`.
- `mucGhep`/`mucGhepLua` hiện ghép MỌI node thành ý (không có khái niệm ẩn) ⇒ **viết lại**: phân biệt
  tick/ẩn + nở bước (cắt tại tick) + gắn giả thiết phụ + van trồi-lên-đề.
- Reload builder (`GiaoTrinhScreen.loadBuoiToDraft`) phải khôi phục tick-set + `lua_id`. Verify dựng lại đúng.

## 6. Hợp nhất luồng + đơn vị tree

- Gộp `NodeRow` (node lẻ) và `ChuoiRow` (chuỗi) về MỘT (node lẻ = chuỗi 1 node).
- Đổi đơn vị hiển thị từ `chuoiKetNoi` (component 2 chiều, gom cả phân kỳ) sang **liệt kê các ĐÍCH → mỗi
  đích + `chuoiTienDe`** (tự hội tụ, loại phân kỳ từ gốc).
- **Popup cây to:** hiện tree của 1 đích, tick node ngay trên cây (thay checkbox phẳng). *(Làm luôn đợt này.)*

## 7. Schema MỚI (verify `npm run schema` TRƯỚC khi áp — schema.md đang stale, thiếu `hinh_gt_bai.so_dong`)

1. `hinh_baitoan.gia_thiet_phu text NULL` — giả thiết phụ của node.
2. `hinh_cach_tien_de.keo_gt_phu boolean NOT NULL DEFAULT false` — van trồi giả thiết lên đề (trên CẠNH).
3. Đích = SUY, KHÔNG thêm cột.

## 8. KHÔNG đụng

Luồng in Đại (`CauList`/`PrintView` Đại), `BTPrintView`/`DeThiPrintView`, lứa/đổi-đỉnh đã build
(`saveLuaBienThe`, `ChuoiDoiDinhPopup`), gán lớp snapshot.

## 9. Thứ tự thực thi

1. `npm run schema` (lấy sự thật DB) → 2 migration (§7) → áp (`_apply_one`) → `npm run schema` lại.
2. Logic nở `mucGhep`/`mucGhepLua` (tick/ẩn, cắt-tại-tick, nhãn động).
3. Giả thiết phụ + van (render đề/đáp án + form nhập + cờ cạnh).
4. Hợp nhất luồng + đơn vị tree (`chuoiTienDe` theo đích) + popup cây to.
5. Reload builder + verify in (dev pane thật).
