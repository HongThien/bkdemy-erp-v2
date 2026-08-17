// Màn "Duyệt chấm online" (spec test-online §7) — vòng học TRẢ LỜI NGẮN:
// hệ auto-chấm sai → TA review → HS thật ra ĐÚNG → đáp án vào question_accepted_answers
// (lần sau auto đúng, cham_boi='cache') + BACKFILL mọi bài làm cùng câu+đáp án Sai→Đúng.
// Mastery đọc bai_lam_cau LIVE (suy động) → tự đúng theo, không sync gì thêm.
// Nhóm 2 tầng: CÂU (theo ma_cau) → từng ĐÁP ÁN HS distinct (đơn vị duyệt).
import { useEffect, useMemo, useState } from 'react'
import { listTLNSai, listAcceptedAnswers, chapNhanDapAn, tuChoiReports, type TLNSaiRow } from '../../lib/testonline'
import { smartNormalize } from '../../gami/testgrade'
import { MathText } from '../kho/ui'
import { tenHienThiDs } from '../../lib/hoten'
import ChamLaiKeyPanel from './ChamLaiKeyPanel'

type AnsGroup = { norm: string; raw: string; rows: TLNSaiRow[]; repsMoi: { id: string }[] }
type CauGroup = { key: string; maCau: string | null; noiDung: string | null; dapAnKey: string; loiGiai: string | null; answers: AnsGroup[]; repsMoi: number }

const fmtNgay = (iso: string) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
const LOAI_LABEL: Record<string, string> = { et: 'ET', btvn: 'BTVN', giao_trinh: 'Giáo trình' }

export default function DuyetChamScreen() {
  const [rows, setRows] = useState<TLNSaiRow[]>([])
  const [accepted, setAccepted] = useState<Map<string, string[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [filter, setFilter] = useState<'baosai' | 'all' | 'keysai'>('baosai')
  const [busy, setBusy] = useState<string | null>(null) // norm key đang xử lý
  const [flash, setFlash] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const r = await listTLNSai()
      setRows(r)
      setAccepted(await listAcceptedAnswers([...new Set(r.map((x) => x.cau.ma_cau).filter(Boolean) as string[])]))
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  // Nhóm CÂU → ĐÁP ÁN (distinct theo smartNormalize — cùng đơn vị với cache/backfill).
  const groups = useMemo<CauGroup[]>(() => {
    const byCau = new Map<string, CauGroup>()
    for (const r of rows) {
      const key = r.cau.ma_cau ?? r.cau.id
      let g = byCau.get(key)
      if (!g) { g = { key, maCau: r.cau.ma_cau, noiDung: r.cau.noi_dung, dapAnKey: r.cau.dapAnKey, loiGiai: r.cau.loi_giai, answers: [], repsMoi: 0 }; byCau.set(key, g) }
      const norm = smartNormalize(r.dapAnHs)
      let a = g.answers.find((x) => x.norm === norm)
      if (!a) { a = { norm, raw: r.dapAnHs, rows: [], repsMoi: [] }; g.answers.push(a) }
      a.rows.push(r)
      for (const rep of r.reports) if (rep.trang_thai === 'moi') { a.repsMoi.push({ id: rep.id }); g.repsMoi++ }
    }
    const out = [...byCau.values()]
    for (const g of out) g.answers.sort((x, y) => y.repsMoi.length - x.repsMoi.length || y.rows.length - x.rows.length)
    // Câu có báo sai lên đầu, rồi câu nhiều lượt sai.
    out.sort((x, y) => y.repsMoi - x.repsMoi || y.answers.reduce((s, a) => s + a.rows.length, 0) - x.answers.reduce((s, a) => s + a.rows.length, 0))
    return out
  }, [rows])

  const totalRepsMoi = useMemo(() => groups.reduce((s, g) => s + g.repsMoi, 0), [groups])
  const shown = filter === 'baosai' ? groups.filter((g) => g.repsMoi > 0) : groups

  async function onChapNhan(g: CauGroup, a: AnsGroup) {
    if (!g.maCau) return
    setBusy(g.key + a.norm)
    try {
      const { backfilled } = await chapNhanDapAn(g.maCau, a.raw)
      setFlash(`Đã chấp nhận "${a.raw}" — sửa ${backfilled} bài làm Sai → Đúng.`)
      await reload()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  async function onGiuSai(g: CauGroup, a: AnsGroup) {
    setBusy(g.key + a.norm)
    try {
      await tuChoiReports(a.repsMoi.map((r) => r.id))
      setFlash('Đã đóng báo sai (giữ nguyên Sai).')
      await reload()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  const tab = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Duyệt chấm online</span>
        <button onClick={() => setFilter('baosai')} className={tab(filter === 'baosai')}>🚩 HS báo sai{totalRepsMoi ? ` (${totalRepsMoi})` : ''}</button>
        <button onClick={() => setFilter('all')} className={tab(filter === 'all')}>Tất cả câu bị chấm sai ({groups.length})</button>
        {/* Đường THỨ HAI, đừng lẫn với hai tab trên: trên = key đúng/HS viết khác · đây = KEY SAI. */}
        <button onClick={() => setFilter('keysai')} className={tab(filter === 'keysai')}>⚠ Nghi sai đáp án — chấm lại</button>
        <button onClick={reload} className="rounded-md border border-slate-300 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">↻ Tải lại</button>
        <span className="ml-auto text-[12px] text-slate-400">
          {filter === 'keysai' ? 'Cả lớp cùng sai 1 câu ⇒ nghi ĐÁP ÁN sai trước, nghi HS sau.' : 'Chấp nhận đúng = thêm vào bộ đáp án (lần sau tự đúng) + sửa mọi bài làm trùng.'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {flash && <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700">{flash}</div>}
        {err && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
        {filter === 'keysai' ? <ChamLaiKeyPanel />
          : loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">
              {filter === 'baosai' ? 'Không có báo sai nào đang chờ duyệt. 🎉' : 'Không có câu trả lời ngắn nào đang bị chấm sai.'}
            </div>
          ) : (
            <div className="mx-auto max-w-[980px] space-y-4">
              {shown.map((g) => (
                <div key={g.key} className={`rounded-2xl border bg-white shadow-sm ${g.repsMoi ? 'border-l-4 border-slate-200 border-l-rose-400' : 'border-slate-200'}`}>
                  {/* ── Câu ── */}
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
                      {g.maCau && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{g.maCau}</span>}
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200">Đáp án: <MathText className="inline">{g.dapAnKey}</MathText></span>
                      {(accepted.get(g.maCau ?? '') ?? []).map((s, i) => (
                        <span key={i} className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700 ring-1 ring-sky-200">cũng đúng: {s}</span>
                      ))}
                      {g.repsMoi > 0 && <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-600 ring-1 ring-rose-200">🚩 {g.repsMoi} báo sai</span>}
                    </div>
                    <div className="text-[14px] leading-relaxed text-slate-800"><MathText>{g.noiDung}</MathText></div>
                  </div>
                  {/* ── Từng đáp án HS (đơn vị duyệt) ── */}
                  <div className="divide-y divide-slate-100">
                    {(filter === 'baosai' ? g.answers.filter((a) => a.repsMoi.length > 0) : g.answers).map((a) => {
                      const k = g.key + a.norm
                      const yKiens = a.rows.flatMap((r) => r.reports.filter((x) => x.trang_thai === 'moi' && x.y_kien).map((x) => x.y_kien!))
                      return (
                        <div key={a.norm} className="flex flex-wrap items-center gap-3 px-5 py-2.5">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[14px] font-semibold text-slate-800">{a.raw}</span>
                          <span className="text-[12px] text-slate-500">
                            {a.rows.length} HS: {tenHienThiDs(a.rows.slice(0, 6).map((r) => r.hocSinh.ho_ten)).join(', ')}{a.rows.length > 6 ? '…' : ''}
                            {' · '}{[...new Set(a.rows.map((r) => `${r.test.lopTen} ${LOAI_LABEL[r.test.loai] ?? r.test.loai} ${fmtNgay(r.test.ngay)}`))].slice(0, 3).join(' · ')}
                          </span>
                          {a.repsMoi.length > 0 && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">🚩 {yKiens[0] ?? 'Em nghĩ mình đúng'}</span>}
                          <span className="ml-auto flex shrink-0 gap-2">
                            <button disabled={busy === k || !g.maCau} onClick={() => onChapNhan(g, a)}
                              title={g.maCau ? 'Đáp án này ĐÚNG — thêm vào bộ đáp án + sửa mọi bài làm trùng' : 'Câu không còn mã kho — không backfill được'}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-40">
                              {busy === k ? '…' : '✓ Chấp nhận đúng'}
                            </button>
                            {a.repsMoi.length > 0 && (
                              <button disabled={busy === k} onClick={() => onGiuSai(g, a)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-40">
                                ✕ Vẫn sai
                              </button>
                            )}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
