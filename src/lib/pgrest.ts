// ⚠ BUG THẬT tìm thấy 09-09 (Thùy: "đã cập nhật MT các lớp, kiểm tra bổ trợ yếu chạy đúng chưa"):
// PostgREST/Supabase project này HARD-CAP 1000 dòng/query BẤT KỂ `.limit()` client gửi lên — đo
// thật `select('id').limit(10000)` trên gami_grades (88k dòng) vẫn chỉ trả về ĐÚNG 1000, không lỗi.
// `napLanDo` (danhgia.ts) không có `.order()` nên 1000 dòng "trúng" là KHÔNG XÁC ĐỊNH (UUID PK,
// không theo thời gian) — kiểm 1 lớp thật (6A1, 14 HS, lịch sử từ tháng 7): 1000/1000 dòng, 0 dòng
// là MT vừa chấm hôm nay ⇒ toàn bộ engine (mastery/chuyên đề/kênh 3/4) MÙ với dữ liệu mới nhất.
// Đo phạm vi: 33/46 lớp đang học (72%) vượt 1000 dòng — lớp nặng nhất (8B1) 7654 dòng, engine chỉ
// thấy ~13%. Đây LÀ đúng bẫy CLAUDE.md §2 đã cảnh "luôn .limit()/paginate (không xài default 1000)".
//
// Cách dùng: truyền builder trả query đã `.order(...)` TẤT ĐỊNH rồi `.range(from, to)` — không có
// order ổn định thì `.range()` giữa các trang có thể lặp/thiếu dòng (đặc biệt bảng PK UUID).
// Fix tạm đúng luật; đích cuối theo §2.0 vẫn là đẩy aggregate xuống RPC (AUDIT-client-tinh-toan.md).
export async function fetchAllRows<T>(build: (from: number, to: number) => any): Promise<T[]> {
  const PAGE = 1000
  let out: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as T[]
    out = out.concat(rows)
    if (rows.length < PAGE) break
  }
  return out
}
