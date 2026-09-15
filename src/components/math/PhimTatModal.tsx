// Trang gán PHÍM TẮT cho mẫu công thức — CÁ NHÂN (nhan_su.phim_tat_cong_thuc jsonb), không bộ mặc định.
// Mỗi mẫu 1 ô "bấm tổ hợp phím để gán". Gán trùng tổ hợp đã dùng / tổ hợp dành riêng → báo NGAY, không nhận.
// Backspace/Delete trong ô = bỏ gán. Bấm Lưu mới ghi DB (+ cập nhật store để mọi ô soạn dùng ngay).
import { useState } from 'react'
import { Shell, MathText } from '../../screens/kho/ui'
import { MATH_TABS, MATH_TEMPLATES, MATH_TEMPLATE_BY_ID, toPreview } from '../../lib/math/templates'
import { COMBO_RESERVED, comboFromEvent, findTemplateByCombo, type PhimTatMap } from '../../lib/math/phimtat'
import { useStore, usePhimTat } from '../../store/useStore'
import { updatePhimTatCongThuc } from '../../lib/nhansu'

export default function PhimTatModal({ onClose }: { onClose: () => void }) {
  const me = useStore((s) => s.me)
  const setPhimTat = useStore((s) => s.setPhimTatCongThuc)
  const current = usePhimTat()
  const [draft, setDraft] = useState<PhimTatMap>({ ...current })
  const [err, setErr] = useState<Record<string, string>>({})
  const [focusId, setFocusId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onKey = (id: string, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab' || e.key === 'Escape') return
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      setDraft((d) => { const n = { ...d }; delete n[id]; return n })
      setErr((x) => ({ ...x, [id]: '' }))
      return
    }
    e.preventDefault()
    const combo = comboFromEvent(e)
    if (!combo) {
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) setErr((x) => ({ ...x, [id]: 'Cần kèm Ctrl / Alt (hoặc phím F1–F12) để không đụng lúc gõ chữ' }))
      return
    }
    if (COMBO_RESERVED[combo]) { setErr((x) => ({ ...x, [id]: `${combo} dành riêng (${COMBO_RESERVED[combo]}) — không gán được` })); return }
    const dup = findTemplateByCombo(draft, combo)
    if (dup && dup !== id) { setErr((x) => ({ ...x, [id]: `${combo} đã gán cho «${MATH_TEMPLATE_BY_ID[dup]?.ten ?? dup}» — chọn tổ hợp khác` })); return }
    setDraft((d) => ({ ...d, [id]: combo }))
    setErr((x) => ({ ...x, [id]: '' }))
  }

  async function save() {
    if (!me) { setError('Tài khoản chưa gắn hồ sơ nhân sự — không lưu được phím tắt.'); return }
    setBusy(true); setError(null); setSaved(false)
    try {
      await updatePhimTatCongThuc(me.nhanSu.id, draft)
      setPhimTat(draft)
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (e: any) { setError(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  const soGan = Object.keys(draft).length

  return (
    <Shell title="Phím tắt công thức (cá nhân)" onClose={onClose}>
      <p className="mb-3 text-[12px] text-slate-500">
        Bấm vào ô của mẫu rồi <b>nhấn tổ hợp phím</b> muốn gán (kèm Ctrl / Alt, hoặc phím F). Không có bộ mặc định — mỗi người tự gán, lưu theo tài khoản.
        Backspace trong ô = bỏ gán. <b>Ctrl+M</b> luôn là mở ô công thức.
      </p>
      <div className="max-h-[58vh] overflow-y-auto pr-1">
        {MATH_TABS.map((tab) => (
          <div key={tab.id} className="mb-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{tab.ten}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {MATH_TEMPLATES.filter((t) => t.tab === tab.id).map((t) => {
                const combo = draft[t.id]
                const e = err[t.id]
                return (
                  <div key={t.id} className="flex flex-col">
                    <div className="flex items-center gap-2 py-0.5">
                      <span className="flex h-8 w-[72px] shrink-0 items-center justify-center overflow-hidden rounded border border-slate-100 bg-slate-50 text-[13px]"><MathText>{`$${toPreview(t)}$`}</MathText></span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-700" title={t.ten}>{t.ten}</span>
                      <div tabIndex={0} role="button" onFocus={() => setFocusId(t.id)} onBlur={() => setFocusId((f) => (f === t.id ? null : f))} onKeyDown={(ev) => onKey(t.id, ev)}
                        className={`flex h-7 w-[118px] shrink-0 items-center justify-center rounded border px-1 font-mono text-[11px] outline-none ${
                          focusId === t.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20' : combo ? 'border-slate-300 bg-white text-slate-800' : 'border-dashed border-slate-300 bg-white text-slate-400'}`}>
                        {focusId === t.id ? (combo ? combo : 'bấm phím…') : (combo || 'chưa gán')}
                      </div>
                    </div>
                    {e && <div className="pb-1 pl-[80px] text-[11px] text-rose-600">{e}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="mr-auto text-[12px] text-slate-400">{soGan} mẫu đã gán</span>
        {saved && <span className="text-[12px] font-medium text-emerald-600">✓ Đã lưu</span>}
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Đóng</button>
        <button onClick={save} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu'}</button>
      </div>
    </Shell>
  )
}
