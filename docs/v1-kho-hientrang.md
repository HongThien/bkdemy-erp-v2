# Hiện trạng KHO v1 (does-exist) — input để bàn spec Kho v2

> Mục đích: phần *thực-tế-đang-có* để mang sang Claude chat bàn spec "Kho — Canonical Knowledge" v2.
> Số liệu đọc trực tiếp từ DB v1 (read-only) ngày làm việc. Không phải ước lượng.

## 1. Kho v1 = 4 mảnh

```
knowledge_map ──(ma_dang)──< question_bank >──(ma_cau)── question_accepted_answers
   (danh mục dạng/KP)          (kho câu hỏi)              (đáp án chấp nhận, auto-chấm)
                                    ▲
                          question_drafts (AI tách từ file → duyệt → vào bank)
```

- **`knowledge_map`** = danh mục **dạng (KP)**. Cột: `ma_dang`, `khoi`, `chuong`, `chu_de`, `ma_chu_de`, `ten_dang`, `phan_loai`, `muc_do`. → đây là **Lớp Canonical Knowledge** của v2.
- **`question_bank`** = kho câu hỏi, mỗi câu gắn `ma_dang`. Hỗ trợ nhiều loại: `loai_cau`, `lua_chon` (jsonb, trắc nghiệm), `menh_de` (jsonb, đúng-sai), `dap_an`, `loi_giai_ai`, `image_url`, `da_verify`, `muc_do`, `thinking_level`, `ma_doc`.
- **`question_drafts`** = câu nháp tách từ file (AI): `draft_status` (pending/approved/rejected), `doc_meta`, `source_file`, cùng các trường nội dung như bank.
- **`question_accepted_answers`** = biến thể đáp án chấp nhận cho auto-chấm: `answer_normalized`, `hit_count`, `source`, `ai_reason`.

## 2. Số liệu THẬT (điểm mấu chốt)

| Mảng | Con số |
|---|---|
| **Danh mục dạng** (`knowledge_map`) | **821 dạng**, khối 3→12 (cả 4T/5T), **39 chương · 168 chủ đề** |
| Phân bố dạng theo khối | 8:109 · 6:106 · 11:100 · 7:91 · 5T:83 · 9:76 · 5:67 · 4:59 · 12:48 · 3:44 · 4T:26 · 10:12 |
| **Kho câu hỏi** (`question_bank`) | **878 câu** — **tất cả đã verify** |
| …loại câu | **100% `tra_loi_ngan`** (chưa có trắc nghiệm/đúng-sai/tự luận dù schema đỡ) |
| …khối | **100% khối 5** |
| …độ phủ dạng | gắn **44 dạng** / 821 → **chỉ phủ ~5%** danh mục |
| …media | 1 câu có ảnh · 878 câu có lời giải AI |
| **Drafts** (`question_drafts`) | **7.196** total: approved 3.936 · rejected 3.193 · pending 67 |
| **Đáp án chấp nhận** | 268 |
| Exams / exam_questions | 6 / 44 (gần như chưa dùng) |
| `documents` | **0** (trống, dù `question_bank.ma_doc` trỏ tới) |

## 3. Quan sát → câu hỏi cho spec (bàn ở chat)

1. **Tài sản lớn = taxonomy dạng (821).** Đây là phần đáng giá nhất, công phu nhất → v2 chắc chắn kế thừa. *Spec cần: giữ nguyên cây khối→chương→chủ đề→dạng, hay tinh chỉnh?*
2. **Bank rất mỏng & lệch:** 878 câu, chỉ khối 5, chỉ `tra_loi_ngan`, phủ 44/821 dạng. → *Mục tiêu kho v2 thực chất là **build coverage** (lấp câu cho 821 dạng), không phải quản lý cái đã đầy.* Tool phải tối ưu cho **nhập nhanh + phủ rộng**.
3. **Pipeline drafts đã chạy mạnh (7.196 xử lý) nhưng bank chỉ 878.** Gap lớn giữa "approved 3.936" và "bank 878". → *Quan hệ draft→bank là gì? Approved có tự vào bank không? Bottleneck ở khâu duyệt?* Đây là câu spec quan trọng nhất — nó quyết "tool làm kho" có phải chủ yếu là **pipeline AI nhập→duyệt** hay không.
4. **Schema đỡ nhiều loại câu** (trắc nghiệm/đúng-sai/tự luận) **nhưng mới dùng 1 loại.** → *v2 có cần đủ loại ngay không, hay vẫn tra_loi_ngan trước?*
5. **`documents` trống** dù bank trỏ `ma_doc`. → *Nguồn gốc câu (file đề) có cần lưu/truy vết trong v2 không?*
6. **Auto-chấm:** `question_accepted_answers` (268) cho thấy v1 đã có cơ chế chấm tự động theo đáp án chuẩn hoá → liên quan trực tiếp tới Pilot ET sau này.

## 4. Hệ quả execution (quyết ở Code, không cần chat)

- **Copy sang v2 (cross-schema, vài giây):** `knowledge_map` (821) + `question_bank` (878) + `question_accepted_answers` (268) = có kho thật ngay để dev.
- **Cân nhắc KHÔNG copy:** `question_drafts` (7.196, phần lớn rejected — là rác lịch sử) — chỉ giữ nếu spec cần lại pipeline.
- Map v2: `knowledge_map` → Lớp Canonical Knowledge; `question_bank` → nội dung gắn KP; `accepted_answers` → phục vụ Measurement (auto-chấm ET).
