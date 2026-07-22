// Popup multi-select câu từ kho (theo 1..N dạng), lọc loại câu + badge usage + khoá câu đã dùng cùng buổi.
// Tách riêng khỏi TaiLieuBuilder.tsx (nơi cũ) để dùng chung được ở nơi khác (vd OnTapEditor) mà không
// vòng import ngược screen↔component.
import { useEffect, useState } from 'react'
import { listCauByDang, LOAI_CAU, type CauHoi } from '../lib/kho/api'
import { cauUsage } from '../lib/tailieu'
import { MathText } from '../screens/kho/ui'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
function MaCau({ ma }: { ma: string }) {
  return <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500" title="Mã câu">{ma}</span>
}

export function KhoPicker({ maDangs, selected, disabled = [], cauTbl = 'dai_cau_hoi', onClose, onConfirm }: { maDangs: string[]; selected: string[]; disabled?: string[]; cauTbl?: string; onClose: () => void; onConfirm: (m: string[]) => void }) {
  const [groups, setGroups] = useState<{ maDang: string; caus: CauHoi[] }[]>([])
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [fLoai, setFLoai] = useState<Set<string>>(new Set())
  const [usage, setUsage] = useState<Map<string, number>>(new Map()) // số lượt câu đã dùng trong MỌI tài liệu (chỉ báo)
  const [loading, setLoading] = useState(true)
  // Câu đã dùng ở buổi này/buổi trước (cùng giáo trình) → KHOÁ; trừ câu đang chọn ở chính phần này.
  const blocked = new Set(disabled.filter((m) => !selected.includes(m)))
  useEffect(() => {
    Promise.all(maDangs.map(async (md) => ({ maDang: md, caus: await listCauByDang(md, cauTbl) }))).then(async (g) => {
      setGroups(g); setLoading(false)
      setUsage(await cauUsage(g.flatMap((x) => x.caus.map((c) => c.ma_cau))))
    }).catch(() => setLoading(false))
  }, []) // eslint-disable-line
  const toggle = (ma: string) => { if (blocked.has(ma)) return; setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n }) }
  const toggleLoai = (v: string) => setFLoai((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n })
  function confirm() {
    const all = groups.flatMap((g) => g.caus.map((c) => c.ma_cau))
    const ordered = [...selected.filter((s) => sel.has(s)), ...all.filter((m) => sel.has(m) && !selected.includes(m))]
    onConfirm(ordered)
  }
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[12%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn câu từ kho</h3>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-6 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lọc loại:</span>
          {LOAI_CAU.map((l) => (
            <button key={l.value} onClick={() => toggleLoai(l.value)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${fLoai.has(l.value) ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700'}`}>{l.label}</button>
          ))}
          {fLoai.size > 0 && <button onClick={() => setFLoai(new Set())} className="ml-1 text-[12px] font-medium text-slate-400 hover:text-rose-600">Xoá lọc</button>}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : groups.every((g) => !g.caus.length) ? <p className="text-sm text-slate-400">Kho các dạng này chưa có câu nào.</p>
            : groups.map((g) => {
              const caus = fLoai.size ? g.caus.filter((c) => fLoai.has(c.loai_cau)) : g.caus
              return (
                <div key={g.maDang} className="mb-4">
                  {maDangs.length > 1 && <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">Dạng {g.maDang}</div>}
                  <div className="space-y-1">
                    {caus.map((c) => {
                      const isBlocked = blocked.has(c.ma_cau)
                      const n = usage.get(c.ma_cau) ?? 0
                      return (
                      <label key={c.ma_cau} title={isBlocked ? 'Câu này đã dùng trong buổi này / buổi trước — không chọn lại' : undefined}
                        className={`flex items-start gap-2 rounded-md border px-2.5 py-1.5 ${isBlocked ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-55' : sel.has(c.ma_cau) ? 'cursor-pointer border-indigo-300 bg-indigo-50/40' : 'cursor-pointer border-slate-100 hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={sel.has(c.ma_cau)} disabled={isBlocked} onChange={() => toggle(c.ma_cau)} className="mt-1" />
                        <MaCau ma={c.ma_cau} />
                        <span className="min-w-0 flex-1 text-[14px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                        {isBlocked
                          ? <span className="shrink-0 rounded bg-rose-100 px-1.5 text-[10px] font-semibold text-rose-600">đã dùng</span>
                          : <span className={`shrink-0 rounded px-1.5 text-[10px] font-medium ${n > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`} title="Số lượt câu này đã dùng trong các tài liệu ở Kho">{n > 0 ? `dùng ${n}×` : 'chưa dùng'}</span>}
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
                      </label>
                    )})}
                    {caus.length === 0 && <div className="px-1 py-1 text-[12px] italic text-slate-400">— không có câu khớp lọc —</div>}
                  </div>
                </div>
              )
            })}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={confirm} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Dùng {sel.size} câu</button>
        </div>
      </div>
    </div>
  )
}
