// ⭐ Scope④ — GATE NỘI DUNG THEO MÔN (Thùy chốt 08-08, áp TOÀN BỘ màn Kho/Làm-tài-liệu, không riêng 1 hub).
// Cross-môn: admin hệ thống (`quyen.laAdmin`) + 3 team LIÊN-MÔN theo bản chất việc (KHÔNG dạy/soạn nội
// dung 1 môn cụ thể) — **Ops** (spine vận hành, cùng khuôn `laOps` đã dùng ở BuoiHocScreen cho scope vận
// hành) + **Media/Marketing** (cần browse tài liệu MỌI môn để truyền thông — Thùy: "coi như 1 kiểu ops").
// GV/TA/TG/Học thuật KHÔNG cross-môn — scope CHẶT theo `nhan_su_mon` (me.mons), STRICT: chưa gán môn nào
// = KHÔNG thấy môn nào (không phải "thấy hết"). Dùng hook NÀY ở mọi màn Kho/Làm tài liệu thay vì tự suy
// laAdmin/mons tại chỗ — trước khi có hook này, 6 màn tự viết tay bản sao-dán LỆCH NHAU.
// (08-29, app OPS: hook TÁCH từ lib/mon.ts ra đây — mon.ts phải là hằng số THUẦN vì lib data-layer
// import nó; hook dính useStore mà nằm chung file là mọi bundle import MON_LIST đều ăn mock/fixtures.)
import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { MON_LIST, CROSS_MON_TEAMS } from '../lib/mon'

export function useMonScope(): { allowedMons: string[]; isAll: boolean; allowed: (mon: string) => boolean } {
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const crossMon = (me?.teams ?? []).some((t) => CROSS_MON_TEAMS.includes(t.ma))
  // 16/11: NGUỒN là DB — fn_mon_cua_toi (đọc cùng hồ sơ lúc đăng nhập; cùng luật các hàm đọc dữ liệu học tập dùng để chặn).
  // Chưa đọc được (monQuyen null) ⇒ luật cũ tính ở client.
  const q = me?.monQuyen ?? null
  const isAll = q ? q.tat_ca : (laAdmin || crossMon)
  const allowedMons = isAll ? [...MON_LIST] : (q ? q.mon : (me?.mons ?? []))
  return { allowedMons, isAll, allowed: (mon: string) => isAll || allowedMons.includes(mon) }
}

// ⭐ BỘ CHỌN MÔN của màn dữ liệu HỌC TẬP (Thùy 16/11 — "nhân sự KHTN mở Dashboard vẫn thấy Toán, rất nhiều lần lẫn quyền môn").
// Mẫu sai đã lặp ở ≥ 12 màn: danh sách môn = hằng MON_CO_KHO / mọi lớp · môn đầu gõ cứng 'Toán' · nhớ ở module-level không gắn người đăng nhập.
// Dùng hook này thay cho `useState('Toán')` + `MON_CO_KHO.map`:  const { mons, mon, setMon } = useMonChon(MON_CO_KHO, NHO.mon)
//   mons = `ds` ∩ quyền môn (giữ thứ tự `ds`) · môn đầu = môn nhớ nếu còn trong quyền, không thì môn đầu của `mons` (KHÔNG gõ tên môn)
//   mon trả ra LUÔN nằm trong `mons` (hoặc '' khi không có môn nào) — màn không bao giờ gọi dữ liệu của môn ngoài quyền.
export function useMonChon(ds: readonly string[], nho?: string | null): { mons: string[]; mon: string; setMon: (m: string) => void } {
  const { allowed } = useMonScope()
  const mons = ds.filter((m) => allowed(m))
  const dau = mons[0] ?? ''
  const [chon, setChon] = useState(nho && mons.includes(nho) ? nho : dau)
  const hop = mons.includes(chon)
  useEffect(() => { if (!hop && chon !== dau) setChon(dau) }, [hop, chon, dau])
  return { mons, mon: hop ? chon : dau, setMon: setChon }
}
