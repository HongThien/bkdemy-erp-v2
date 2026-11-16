// QUYỀN MÔN cho lib đọc thẳng bảng (không dùng được hook) — Thùy 16/11: "rà lại toàn bộ logic về môn".
// Nguồn = DB `fn_mon_cua_toi` (đọc cùng hồ sơ đăng nhập, cache 5 phút ở getMyProfile) — CÙNG luật với các hàm DB lọc bằng `_mon_xem_ds()`
// và với hook `useMonScope` ở màn. Danh sách đọc thẳng bảng (đợt đuổi, buổi bù/đuổi, không-bù, case yếu, lịch khối…) gắn lọc này vào CÂU TRUY VẤN.
// Đây chưa phải rào cứng (rào cứng = RLS theo môn); nó bảo đảm màn không bày dữ liệu môn khác ra cho người chỉ có một môn.
import { getMyProfile } from './nhansu'
import { CROSS_MON_TEAMS } from './mon'

/** null = không lọc (thấy mọi môn) · mảng = các môn được xem (rỗng = không môn nào). */
export async function monXemDuoc(): Promise<string[] | null> {
  const p = await getMyProfile().catch(() => null)
  if (!p) return []
  if (p.monQuyen) return p.monQuyen.tat_ca ? null : p.monQuyen.mon
  // chưa đọc được nguồn DB ⇒ luật cũ (giống useMonScope)
  if ((p.nhanSu as { la_admin_he_thong?: boolean }).la_admin_he_thong || p.teams.some((t) => CROSS_MON_TEAMS.includes(t.ma))) return null
  return p.mons
}

const KHONG_MON = '__khong_mon__'   // mảng rỗng ⇒ `in ()` không hợp lệ ở PostgREST — dùng giá trị không bao giờ khớp
/** Gắn `cot in (môn được xem)` vào câu truy vấn PostgREST; ds null ⇒ để nguyên. `cot` có thể là cột của bảng nhúng (vd 'lop.mon' — bảng nhúng phải `!inner`). */
// Q để trơn (không ràng buộc kiểu): kiểu builder của supabase-js lồng quá sâu, ràng buộc vào `.in` làm tsc báo TS2589.
export function locMon<Q>(q: Q, cot: string, ds: string[] | null): Q {
  return ds ? (q as unknown as { in: (c: string, v: string[]) => Q }).in(cot, ds.length ? ds : [KHONG_MON]) : q
}
/** `!inner` cho bảng nhúng khi có lọc môn (không lọc thì giữ left join như cũ — không rụng dòng thiếu lớp). */
export const inner = (ds: string[] | null) => (ds ? '!inner' : '')
