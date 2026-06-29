// Tìm câu trong kho (để SỬA câu sai nhanh) — THEO KHO ĐANG XEM (per cauTbl, KHÔNG xuyên môn).
// Tìm theo MÃ (prefix) hoặc NỘI DUNG (chứa). Kết quả → nút Sửa: câu thường mở CauModal, câu Đúng/Sai mở DungSaiModal.
import { useEffect, useRef, useState } from 'react'
import { searchCau, listDangOptions, LOAI_CAU, type CauTimThay } from '../../lib/kho/api'
import { Code, MathText, inp } from './ui'
import { CauModal } from './DangHub'
import { DungSaiModal } from './DungSaiBank'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v

export default function SearchCau({ cauTbl, onClose }: { cauTbl: string; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<CauTimThay[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [editing, setEditing] = useState<CauTimThay | null>(null)
  const [dangOpts, setDangOpts] = useState<{ id: string; label: string; sub: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const reqId = useRef(0)

  useEffect(() => { inputRef.current?.focus() }, [])
  // dangOpts cho editor Đúng/Sai — nạp 1 lần theo môn
  useEffect(() => { listDangOptions(cauTbl).then(setDangOpts).catch(() => {}) }, [cauTbl])

  // debounce 300ms, chống race bằng reqId
  useEffect(() => {
    const term = q.trim()
    if (!term) { setRows([]); setSearched(false); setErr(null); return }
    const my = ++reqId.current
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const r = await searchCau(term, cauTbl)
        if (my === reqId.current) { setRows(r); setSearched(true); setErr(null) }
      } catch (e: any) {
        if (my === reqId.current) setErr(e.message ?? String(e))
      } finally {
        if (my === reqId.current) setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [q, cauTbl])

  async function reload() {
    const term = q.trim()
    if (!term) return
    try { setRows(await searchCau(term, cauTbl)) } catch { /* */ }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f5f7] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Thanh tìm */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <span className="text-[15px] font-semibold text-slate-900">Tìm câu</span>
          <div className="relative ml-1 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Nhập mã câu (vd 07010103001) hoặc nội dung…"
              className={`${inp} h-10 w-full pl-9 text-[14px]`} />
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        {/* Kết quả */}
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <div className="mx-auto max-w-[1000px]">
            {!q.trim() ? (
              <div className="py-16 text-center text-[13px] text-slate-400">Gõ mã câu hoặc một đoạn nội dung để tìm. Chỉ tìm trong kho đang xem.</div>
            ) : loading ? (
              <div className="py-10 text-center text-[13px] text-slate-400">Đang tìm…</div>
            ) : err ? (
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {err}</div>
            ) : searched && rows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-[13px] text-slate-400">Không tìm thấy câu nào khớp.</div>
            ) : (
              <>
                <div className="mb-3 text-[12px] font-medium text-slate-500">{rows.length} câu{rows.length >= 200 ? '+ (giới hạn 200 — gõ cụ thể hơn)' : ''}</div>
                <div className="space-y-2.5">
                  {rows.map((c) => (
                    <div key={c.ma_cau} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <Code>{c.ma_cau}</Code>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[12px] font-medium text-slate-600">{loaiLabel(c.loai_cau)}</span>
                        <span className="rounded bg-violet-50 px-2 py-0.5 text-[12px] font-medium text-violet-600" title={c.dang_chinh}>{c.dangTen}</span>
                        {c.nguon_giai === 'ai' && <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] font-medium text-amber-700" title="Lời giải do AI — cần duyệt">🤖 AI</span>}
                        <button onClick={() => setEditing(c)} className="ml-auto rounded-md border border-slate-200 px-3 py-1 text-[13px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">Sửa</button>
                      </div>
                      <div className="text-[15px] leading-relaxed text-slate-800"><MathText>{c.noi_dung}</MathText></div>
                      {c.anh_de && <img src={c.anh_de} alt="" className="mt-2 max-h-32 rounded-lg border border-slate-100" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editor — câu Đúng/Sai dùng DungSaiModal, còn lại CauModal */}
      {editing && (editing.loai_cau === 'dung_sai' ? (
        <DungSaiModal cau={editing} dangChinhMoi={null} tbl={cauTbl} dangOpts={dangOpts}
          onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload() }} />
      ) : (
        <CauModal editing={editing} cauTbl={cauTbl}
          onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload() }} />
      ))}
    </div>
  )
}
