// Thùy 29/09: "Quản lý có thể chỉnh sửa ưu tiên và trạng thái của học sinh ở bất kì chỗ nào — trạng thái là dạng derive".
// ⇒ 1 NGUỒN: mức = hs_level (đổi qua fn_btyeu_doi_level), ưu tiên = bo_tro_yeu.uu_tien (trigger chặn quá 20 em Cao).
// Mọi màn (Xếp · Trạng thái ca · Lịch phòng) dùng CHUNG control này ⇒ sửa ở đâu cũng ghi cùng chỗ, màn khác đọc lại là thấy.
// Giai đoạn (Cần xếp / Đã xếp / Hoàn thành) KHÔNG sửa tay — suy từ buổi + case.
import { useState } from 'react'
import { doiLevelCase, datUuTienCase, UU_TIEN_TEN, RETEST_BAT, type UuTienCase } from '../../lib/botro_yeu'

export const MUC_TEN: Record<number, string> = { 1: 'Mức 1 · trước/sau giờ', 2: 'Mức 2 · buổi riêng (TA)', 3: 'Mức 3 · buổi riêng (GV cao cấp)' }
export const MUC_CLS: Record<number, string> = { 0: 'bg-slate-50 text-slate-400', 1: 'bg-slate-100 text-slate-600', 2: 'bg-amber-50 text-amber-700', 3: 'bg-rose-50 text-rose-700' }
export const UU_CLS: Record<UuTienCase, string> = { 3: 'bg-rose-600 text-white', 2: 'bg-slate-100 text-slate-600', 1: 'bg-slate-50 text-slate-400' }

export type DoiMucUuTien = { level: number; uuTien: UuTienCase; dongCase: boolean }

export default function MucUuTienCase({ caseId, hoTen, level, uuTien, dong, onDoi }: {
  caseId: string; hoTen: string; level: number; uuTien: UuTienCase
  dong?: boolean // case đã đóng ⇒ chỉ hiện, không sửa (mở lại = Duyệt bổ trợ)
  onDoi: (kq: DoiMucUuTien) => void
}) {
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const chan = (e: { stopPropagation: () => void }) => e.stopPropagation() // nằm trong card bấm mở popup

  async function doiMuc(lv: number) {
    if (lv === level) return
    let ly: string | null = null
    if (lv === 0) {
      ly = prompt(`Hạ ${hoTen} về L0 — HẾT YẾU, DỪNG BỔ TRỢ?\nCase sẽ đóng, buổi đã xếp chưa học bị huỷ${RETEST_BAT ? ', retest chưa làm bị đóng' : ''} — trả 1 chỗ trong trần 50.\n\nLý do:`, 'Tự luyện thêm, hết yếu')
      if (ly === null) return
    }
    setBusy(true); setLoi(null)
    try {
      const r = await doiLevelCase(caseId, lv, ly)
      onDoi({ level: lv, uuTien, dongCase: r.dong_case })
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  async function doiUu() {
    const moi = (uuTien === 3 ? 1 : uuTien + 1) as UuTienCase // Thường → Cao → Thấp → Thường
    setBusy(true); setLoi(null)
    try { await datUuTienCase(caseId, moi); onDoi({ level, uuTien: moi, dongCase: false }) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  if (dong) return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${MUC_CLS[level] ?? MUC_CLS[1]}`}>{level ? MUC_TEN[level] : 'L0'}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${UU_CLS[uuTien]}`}>{UU_TIEN_TEN[uuTien]}</span>
    </span>
  )
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5" onClick={chan} onKeyDown={chan}>
      <select value={level} disabled={busy} onChange={(e) => doiMuc(Number(e.target.value))} title="Đổi mức bổ trợ (L0 = hết yếu, dừng bổ trợ)"
        className={`cursor-pointer rounded-full border-0 px-2 py-0.5 text-[11px] font-semibold outline-none disabled:opacity-50 ${MUC_CLS[level] ?? MUC_CLS[1]}`}>
        <option value={0}>L0 · hết yếu — dừng bổ trợ</option>
        <option value={1}>{MUC_TEN[1]}</option><option value={2}>{MUC_TEN[2]}</option><option value={3}>{MUC_TEN[3]}</option>
      </select>
      <button type="button" disabled={busy} onClick={doiUu} title="Bấm để đổi ưu tiên (Thường → Cao → Thấp). Tối đa 20 em Cao."
        className={`rounded-full px-2 py-0.5 text-[11px] font-bold disabled:opacity-50 ${UU_CLS[uuTien]}`}>{uuTien === 3 ? '▲ ' : uuTien === 1 ? '▼ ' : ''}{UU_TIEN_TEN[uuTien]}</button>
      {loi && <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200">⛔ {loi}</span>}
    </span>
  )
}
