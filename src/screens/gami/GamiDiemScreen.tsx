// QUẢN LÝ ĐIỂM Elo/EXP. 2 view: BẢNG XẾP HẠNG (leaderboard per môn) · THEO CA HỌC (mỗi ca 1 mã, 2 bảng Elo lớp/ET).
// Hồ sơ 1 HS: Elo per môn · lịch sử Elo (bấm 1 dòng → mở bảng Elo của ca đó) · dòng EXP.
import { useEffect, useState } from 'react'
import { listGamiBangTong, listGamiMons, getDiemHS, listCaHoc, getEloBreakdown, type DiemRow, type DiemHS, type CaHoc, type EloBreakdown } from '../../lib/gami'

type Phase = 'ingame' | 'et'
const EXP_SRC: Record<string, string> = { rank_ingame: 'Hạng chấm bài', rank_et: 'Hạng ET', rank_mt: 'Hạng MT', attend_floor: 'Đi học (sàn)' }
const srcLbl = (s: string) => EXP_SRC[s] ?? s
const fmtNgay = (iso?: string | null) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—')
const phaseLbl = (p: Phase) => (p === 'et' ? 'Elo ET' : 'Elo lớp')
const Ava = ({ url, ten }: { url: string | null; ten: string }) => url
  ? <img src={url} alt="" className="h-8 w-8 rounded-lg object-cover" />
  : <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-[12px] font-bold text-white">{ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'}</span>

type BangRef = { buoiId: string; phase: Phase; title: string }

export default function GamiDiemScreen() {
  const [view, setView] = useState<'rank' | 'ca'>('rank')
  const [openHS, setOpenHS] = useState<DiemRow | null>(null)
  const [bang, setBang] = useState<BangRef | null>(null) // modal bảng Elo 1 ca/phase (dùng chung)
  const tab = (on: boolean) => `h-8 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Điểm số (Elo / EXP)</span>
        <button onClick={() => setView('rank')} className={tab(view === 'rank')}>Bảng xếp hạng</button>
        <button onClick={() => setView('ca')} className={tab(view === 'ca')}>Theo ca học</button>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto p-6">
        {view === 'rank' ? <RankView onOpenHS={setOpenHS} /> : <CaView onOpenBang={setBang} />}
      </div>
      {openHS && <HoSoDiem row={openHS} onClose={() => setOpenHS(null)} onOpenBang={setBang} />}
      {bang && <EloBangModal bang={bang} onClose={() => setBang(null)} />}
    </div>
  )
}

// ── BẢNG XẾP HẠNG (leaderboard per môn) ──
function RankView({ onOpenHS }: { onOpenHS: (r: DiemRow) => void }) {
  const [mons, setMons] = useState<string[]>([])
  const [mon, setMon] = useState<string>('')
  const [rows, setRows] = useState<DiemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  useEffect(() => { listGamiMons().then((m) => { setMons(m); if (m.length) setMon(m.includes('Toán') ? 'Toán' : m[0]) }).catch(() => {}) }, [])
  useEffect(() => { setLoading(true); listGamiBangTong(mon || undefined).then(setRows).finally(() => setLoading(false)) }, [mon])
  const shown = rows.filter((r) => !q.trim() || r.ho_ten.toLowerCase().includes(q.trim().toLowerCase()) || (r.ma_hs ?? '').toLowerCase().includes(q.trim().toLowerCase()))
  const tab = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {mons.length > 1 && <><span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>{mons.map((m) => <button key={m} onClick={() => setMon(m)} className={tab(mon === m)}>{m}</button>)}</>}
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">{shown.length} HS</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên / mã…" className="ml-auto h-7 w-44 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có HS nào có điểm. Điểm sinh khi đóng buổi.</div>
        : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-[12px] font-semibold text-slate-700"><tr>
                <th className="w-12 px-4 py-2.5 text-center">#</th><th className="px-3 py-2.5">Học sinh</th><th className="px-3">Khối</th>
                <th className="px-3 text-right">Elo</th><th className="px-3 text-right">EXP</th><th className="px-3 text-right">Số buổi</th><th className="px-3"></th>
              </tr></thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={r.hoc_sinh_id + r.mon} className="cursor-pointer border-t border-slate-100 hover:bg-indigo-50/40" onClick={() => onOpenHS(r)}>
                    <td className="px-4 py-2 text-center text-[13px] font-bold text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2"><span className="flex items-center gap-2.5"><Ava url={r.anh_url} ten={r.ho_ten} /><span><span className="font-medium text-slate-800">{r.ho_ten}</span>{r.ma_hs && <span className="ml-1.5 font-mono text-[11px] text-slate-400">{r.ma_hs}</span>}</span></span></td>
                    <td className="px-3 text-slate-500">{r.khoi ?? '—'}</td>
                    <td className="px-3 text-right font-semibold text-indigo-700">{r.elo}</td>
                    <td className="px-3 text-right font-medium text-violet-600">{r.exp.toLocaleString('vi-VN')}</td>
                    <td className="px-3 text-right text-slate-500">{r.sessions}</td>
                    <td className="px-3 text-right text-[13px] text-slate-300">›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}

// ── THEO CA HỌC: mỗi ca 1 mã, 2 bảng Elo (lớp / ET) ──
function CaView({ onOpenBang }: { onOpenBang: (b: BangRef) => void }) {
  const [rows, setRows] = useState<CaHoc[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  useEffect(() => { listCaHoc().then(setRows).finally(() => setLoading(false)) }, [])
  const shown = rows.filter((r) => !q.trim() || (r.ma_buoi ?? '').toLowerCase().includes(q.trim().toLowerCase()) || r.ten_lop.toLowerCase().includes(q.trim().toLowerCase()))
  const btn = (on: boolean, label: string, onClick: () => void) => on
    ? <button onClick={onClick} className="rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">{label}</button>
    : <span className="rounded-md border border-dashed border-slate-200 px-2.5 py-1 text-[12px] text-slate-300">{label} (chưa đóng)</span>
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">{shown.length} ca</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã ca / lớp…" className="ml-auto h-7 w-52 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có ca học nào.</div>
        : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-[12px] font-semibold text-slate-700"><tr>
                <th className="px-4 py-2.5">Mã ca</th><th className="px-3">Lớp</th><th className="px-3">Môn</th><th className="px-3">Ngày</th><th className="px-3">Trạng thái</th><th className="px-3 text-right">Bảng Elo</th>
              </tr></thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-2 font-mono text-[12px] text-violet-600">{c.ma_buoi ?? c.id.slice(0, 8)}</td>
                    <td className="px-3 font-medium text-slate-800">{c.ten_lop}</td>
                    <td className="px-3 text-slate-500">{c.mon ?? '—'}</td>
                    <td className="px-3 text-slate-500">{fmtNgay(c.ngay)}</td>
                    <td className="px-3"><span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${c.trang_thai === 'hoan_tat' ? 'bg-emerald-100 text-emerald-700' : c.trang_thai === 'huy' ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-700'}`}>{c.trang_thai === 'hoan_tat' ? 'Hoàn tất' : c.trang_thai === 'huy' ? 'Đã hủy' : 'Đang mở'}</span></td>
                    <td className="px-3 py-2"><div className="flex justify-end gap-1.5">
                      {btn(c.ingame_dong, 'Elo lớp', () => onOpenBang({ buoiId: c.id, phase: 'ingame', title: `${c.ten_lop} · ${fmtNgay(c.ngay)} · Elo lớp` }))}
                      {btn(c.et_dong, 'Elo ET', () => onOpenBang({ buoiId: c.id, phase: 'et', title: `${c.ten_lop} · ${fmtNgay(c.ngay)} · Elo ET` }))}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}

// ── Modal bảng tính Elo 1 ca/phase (dùng chung: từ Theo-ca + từ lịch sử HS) ──
function EloBangModal({ bang, onClose }: { bang: BangRef; onClose: () => void }) {
  const [rows, setRows] = useState<EloBreakdown[] | null>(null)
  useEffect(() => { getEloBreakdown(bang.buoiId, bang.phase).then(setRows).catch(() => setRows([])) }, [bang.buoiId, bang.phase])
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="flex max-h-[88vh] w-[860px] max-w-[96vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-3.5">
          <span className="text-base font-semibold text-slate-900">{bang.title}</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <p className="mb-3 text-[11px] text-slate-400">Δ = K·(Thực tế A − Kỳ vọng E), giới hạn ±40 · cả 2 Elo (lớp/ET) tính từ Elo TRƯỚC buổi (độc lập nhau).</p>
          {rows === null ? <p className="text-[12px] text-slate-400">Đang tải…</p>
            : rows.length === 0 ? <p className="text-[12px] text-slate-400">Chưa có dữ liệu Elo cho ca này.</p>
            : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead><tr className="bg-slate-100 text-left text-[12px] font-semibold text-slate-700">
                    <th className="border border-slate-200 px-3 py-2 text-center">Hạng</th><th className="border border-slate-200 px-3 py-2">Học sinh</th>
                    <th className="border border-slate-200 px-3 py-2 text-right">Điểm thô</th><th className="border border-slate-200 px-3 py-2 text-right">Kỳ vọng E</th>
                    <th className="border border-slate-200 px-3 py-2 text-right">Thực tế A</th><th className="border border-slate-200 px-3 py-2 text-right">A−E</th>
                    <th className="border border-slate-200 px-3 py-2 text-right">Δ Elo</th><th className="border border-slate-200 px-3 py-2 text-right">Elo</th><th className="border border-slate-200 px-3 py-2 text-right">+EXP</th>
                  </tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.hoc_sinh_id} className="hover:bg-slate-50/60">
                        <td className="border border-slate-200 px-3 py-1.5 text-center font-bold text-slate-700">{r.rank}</td>
                        <td className="border border-slate-200 px-3 py-1.5 font-medium text-slate-800">{r.ho_ten}</td>
                        <td className="border border-slate-200 px-3 py-1.5 text-right text-slate-600">{r.points}</td>
                        <td className="border border-slate-200 px-3 py-1.5 text-right text-slate-500">{r.coElo ? r.expected.toFixed(2) : '—'}</td>
                        <td className="border border-slate-200 px-3 py-1.5 text-right text-slate-500">{r.coElo ? r.actual.toFixed(1) : '—'}</td>
                        <td className="border border-slate-200 px-3 py-1.5 text-right text-slate-500">{r.coElo ? (r.actual - r.expected).toFixed(2) : '—'}</td>
                        <td className={`border border-slate-200 px-3 py-1.5 text-right font-semibold ${r.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{r.coElo ? (r.delta >= 0 ? '+' : '') + r.delta : '—'}</td>
                        <td className="border border-slate-200 px-3 py-1.5 text-right text-slate-600">{r.coElo ? `${r.eloBefore}→${r.eloAfter}` : '—'}</td>
                        <td className="border border-slate-200 px-3 py-1.5 text-right font-semibold text-violet-600">+{r.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

function HoSoDiem({ row, onClose, onOpenBang }: { row: DiemRow; onClose: () => void; onOpenBang: (b: BangRef) => void }) {
  const [d, setD] = useState<DiemHS | null>(null)
  useEffect(() => { getDiemHS(row.hoc_sinh_id).then(setD).catch(() => setD({ elo: [], hist: [], exp: [] })) }, [row.hoc_sinh_id])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[90vh] w-[760px] max-w-[96vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <Ava url={row.anh_url} ten={row.ho_ten} />
          <div><div className="text-base font-semibold text-slate-900">{row.ho_ten}</div><div className="text-[12px] text-slate-400">{row.ma_hs ?? ''} · khối {row.khoi ?? '—'}</div></div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        {!d ? <div className="p-8 text-sm text-slate-400">Đang tải…</div> : (
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-5 overflow-y-auto p-6">
            <div className="col-span-2 flex flex-wrap gap-3">
              {d.elo.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có điểm.</p> : d.elo.map((e) => (
                <div key={e.mon} className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">{e.mon}</div>
                  <div className="mt-1 flex items-end gap-3">
                    <span><span className="text-2xl font-bold text-indigo-700">{e.elo}</span> <span className="text-[11px] text-slate-400">Elo</span></span>
                    <span><span className="text-lg font-semibold text-violet-600">{e.exp.toLocaleString('vi-VN')}</span> <span className="text-[11px] text-slate-400">EXP</span></span>
                    <span className="text-[12px] text-slate-400">{e.sessions} buổi</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="min-h-0">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-600">Lịch sử Elo <span className="font-normal normal-case text-slate-400">(bấm để xem bảng ca)</span></div>
              {d.hist.length === 0 ? <p className="text-[12px] text-slate-400">—</p> : (
                <div className="space-y-1">
                  {d.hist.map((h, i) => (
                    <button key={i} onClick={() => onOpenBang({ buoiId: h.buoi_hoc_id, phase: (h.phase === 'et' ? 'et' : 'ingame'), title: `${h.lop ?? '?'} · ${fmtNgay(h.ngay)} · ${phaseLbl(h.phase === 'et' ? 'et' : 'ingame')}` })}
                      className="flex w-full items-center gap-2 rounded-md border border-slate-100 px-2.5 py-1.5 text-left text-[12px] hover:border-indigo-300 hover:bg-indigo-50/40">
                      <span className="text-slate-400">{fmtNgay(h.ngay)}</span>
                      <span className="text-slate-600">{h.lop ?? '?'}</span>
                      <span className="rounded bg-slate-100 px-1 text-[10px] text-slate-500">{h.phase === 'et' ? 'ET' : 'Lớp'}</span>
                      <span className="ml-auto text-slate-500">{h.elo_before}→<b className="text-slate-700">{h.elo_after}</b></span>
                      <span className={`w-10 text-right font-semibold ${h.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{h.delta >= 0 ? '+' : ''}{h.delta}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="min-h-0">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-600">Dòng EXP</div>
              {d.exp.length === 0 ? <p className="text-[12px] text-slate-400">—</p> : (
                <div className="space-y-1">
                  {d.exp.map((x, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md border border-slate-100 px-2.5 py-1.5 text-[12px]">
                      <span className="text-slate-400">{fmtNgay(x.ngay)}</span><span className="text-slate-600">{srcLbl(x.source)}</span>
                      {x.mon && <span className="rounded bg-slate-100 px-1 text-[10px] text-slate-500">{x.mon}</span>}
                      <span className="ml-auto font-semibold text-violet-600">+{x.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
