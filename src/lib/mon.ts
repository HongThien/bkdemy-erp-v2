// Danh mục MÔN của hệ thống — 1 NGUỒN duy nhất. Thêm môn = sửa đúng ở đây.
// Giá trị = chuỗi hiển thị, khớp lop.mon / ung_vien.mon trong DB.
export const MON_LIST = ['Toán', 'KHTN', 'Tiếng Anh', 'Văn'] as const
export type Mon = typeof MON_LIST[number]

// ⭐ Scope④ — GATE NỘI DUNG THEO MÔN (Thùy chốt 08-08, áp TOÀN BỘ màn Kho/Làm-tài-liệu, không riêng 1 hub).
// Cross-môn: admin hệ thống (`quyen.laAdmin`) + 3 team LIÊN-MÔN theo bản chất việc (KHÔNG dạy/soạn nội
// dung 1 môn cụ thể) — **Ops** (spine vận hành, cùng khuôn `laOps` đã dùng ở BuoiHocScreen cho scope vận
// hành) + **Media/Marketing** (cần browse tài liệu MỌI môn để truyền thông — Thùy: "coi như 1 kiểu ops").
// GV/TA/TG/Học thuật KHÔNG cross-môn — scope CHẶT theo `nhan_su_mon` (me.mons), STRICT: chưa gán môn nào
// = KHÔNG thấy môn nào (không phải "thấy hết"). Dùng hook NÀY ở mọi màn Kho/Làm tài liệu thay vì tự suy
// laAdmin/mons tại chỗ — trước khi có hook này, 6 màn tự viết tay bản sao-dán LỆCH NHAU (4 màn thiếu hẳn
// bypass Ops; KhoTaiLieuScreen còn có BUG: coi "chưa gán môn" = "thấy hết" cho MỌI người, không riêng
// Media/Marketing — ngược strict-deny).
import { useStore } from '../store/useStore'
const CROSS_MON_TEAMS = ['ops', 'media', 'marketing']
export function useMonScope(): { allowedMons: string[]; isAll: boolean; allowed: (mon: string) => boolean } {
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const crossMon = (me?.teams ?? []).some((t) => CROSS_MON_TEAMS.includes(t.ma))
  const isAll = laAdmin || crossMon
  const allowedMons = isAll ? [...MON_LIST] : (me?.mons ?? [])
  return { allowedMons, isAll, allowed: (mon: string) => isAll || allowedMons.includes(mon) }
}
