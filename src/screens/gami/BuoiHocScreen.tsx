import { useEffect, useState } from 'react'
import {
  buoiAoCuaNgay, moBuoi, getBuoi, huyBuoi, setNguoiDay,
  getRoster, diemDanh, listProblems, addProblem, listGrades, gradeProblem, closePhase,
  type BuoiAo, type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type Phase, type DiemDanh, type RevealRow,
} from '../../lib/gami'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

const todayVN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const DD_LABEL: Record<DiemDanh, string> = { co_mat: 'Có mặt', vang: 'Vắng', vang_phep: 'Vắng phép' }
const DD_TONE: Record<DiemDanh, string> = { co_mat: 'bg-emerald-600 text-white', vang: 'bg-rose-500 text-white', vang_phep: 'bg-amber-500 text-white' }

export default function BuoiHocScreen() {
  const [ngay, setNgay] = useState(todayVN())
  const [list, setList] = useState<BuoiAo[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setList(await buoiAoCuaNgay(ngay)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [ngay]) // eslint-disable-line

  if (openId) return <BuoiDetail id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Buổi học</span>
        <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="rounded-md border border-slate-200 px-2 py-1 text-[13px]" />
        <span className="text-[12px] text-slate-400">Buổi suy từ TKB. OPS bấm “Mở buổi” để bắt đầu.</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có buổi nào theo TKB ngày này (kiểm tra TKB + ngày khai giảng).</div>
          : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {list.map((b) => <BuoiCard key={b.lop.id} ba={b} ngay={ngay} onOpened={(id) => setOpenId(id)} />)}
            </div>
          )}
      </div>
    </div>
  )
}

function BuoiCard({ ba, ngay, onOpened }: { ba: BuoiAo; ngay: string; onOpened: (id: string) => void }) {
  const [busy, setBusy] = useState(false)
  const b = ba.buoi
  const st = b?.trang_thai
  const tone = st === 'huy' ? 'border-slate-200 bg-slate-50 opacity-70' : st === 'hoan_tat' ? 'border-emerald-200 bg-emerald-50/40' : st === 'mo' ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-white'
  async function open() {
    setBusy(true)
    try { const buoi = await moBuoi(ba.lop.id, ngay, ba.slot); onOpened(buoi.id) }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-slate-900">{ba.lop.ten_lop}</span>
        <span className="text-[12px] text-slate-400">{ba.lop.mon}{ba.lop.khoi ? ` · K${ba.lop.khoi}` : ''}</span>
        {st && <span className={`ml-auto rounded px-1.5 py-0.5 text-[11px] font-medium ${st === 'huy' ? 'bg-slate-200 text-slate-500' : st === 'hoan_tat' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{st === 'huy' ? 'Đã hủy' : st === 'hoan_tat' ? 'Hoàn tất' : 'Đang mở'}</span>}
      </div>
      <div className="mt-1 text-[12px] text-slate-500">{ba.slot.gio_bat_dau?.slice(0, 5)}–{ba.slot.gio_ket_thuc?.slice(0, 5)}{ba.slot.phong ? ` · ${ba.slot.phong}` : ''}</div>
      <div className="mt-3">
        {!b ? <button onClick={open} disabled={busy} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? '…' : 'Mở buổi'}</button>
          : b.trang_thai === 'huy' ? <span className="text-[12px] text-slate-400">{b.ly_do_huy}</span>
          : <button onClick={() => onOpened(b.id)} className="rounded-md border border-indigo-300 px-3 py-1.5 text-[13px] font-medium text-indigo-700 hover:bg-indigo-50">Vào buổi →</button>}
      </div>
    </div>
  )
}

function BuoiDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const [buoi, setBuoi] = useState<(BuoiHoc & { lop?: { ten_lop: string; mon: string } }) | null>(null)
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [dsNS, setDsNS] = useState<NhanSu[]>([])
  const [tab, setTab] = useState<'diemdanh' | Phase>('diemdanh')

  async function reload() {
    const [b, r, ns] = await Promise.all([getBuoi(id), getRoster(id), listNhanSu()])
    setBuoi(b); setRoster(r); setDsNS(ns)
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line
  if (!buoi) return <div className="p-6 text-sm text-slate-400">Đang tải…</div>

  const soCoMat = roster.filter((r) => r.diem_danh === 'co_mat').length
  const chuaDD = roster.filter((r) => !r.diem_danh).length

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <button onClick={onClose} className="text-[13px] text-slate-500 hover:text-indigo-600">← Buổi học</button>
        <span className="text-sm font-semibold text-slate-900">{buoi.lop?.ten_lop} · {buoi.ngay}</span>
        <span className="font-mono text-[11px] text-slate-400">{buoi.ma_buoi}</span>
        <div className="flex items-center gap-1 text-[12px] text-slate-500">GV:
          <div className="w-44"><SearchSelect value={buoi.nguoi_day} onChange={async (nid) => { await setNguoiDay(id, nid); reload() }} placeholder="người dạy"
            options={dsNS.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns ?? undefined }))} /></div>
        </div>
        {buoi.trang_thai !== 'huy' && buoi.trang_thai !== 'hoan_tat' && (
          <button onClick={async () => { const ly = prompt('Lý do hủy buổi?'); if (ly) { await huyBuoi(id, ly); reload() } }}
            className="ml-auto rounded-md border border-rose-200 px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Hủy buổi</button>
        )}
      </div>

      {buoi.trang_thai === 'huy' ? (
        <div className="p-8 text-center text-sm text-slate-400">Buổi đã hủy — {buoi.ly_do_huy}. Mọi việc chấm/điểm danh đã ngừng.</div>
      ) : (
        <>
          <div className="flex gap-1 border-b border-slate-200 bg-white px-6">
            {([['diemdanh', `Điểm danh (${soCoMat}/${roster.length})`], ['ingame', 'Buổi học (chấm)'], ['et', 'ET']] as const).map(([k, lbl]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-6">
            {tab === 'diemdanh'
              ? <DiemDanhTab roster={roster} chuaDD={chuaDD} onChange={reload} />
              : <ChamTab buoiId={id} phase={tab} roster={roster} buoi={buoi} onChange={reload} />}
          </div>
        </>
      )}
    </div>
  )
}

function DiemDanhTab({ roster, chuaDD, onChange }: { roster: BuoiHocHS[]; chuaDD: number; onChange: () => void }) {
  return (
    <div>
      {chuaDD > 0 && <p className="mb-3 text-[12px] text-amber-600">Còn {chuaDD} HS chưa điểm danh.</p>}
      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 2xl:grid-cols-3">
        {roster.map((r) => (
          <div key={r.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</span>
            {(['co_mat', 'vang', 'vang_phep'] as DiemDanh[]).map((d) => (
              <button key={d} onClick={async () => { await diemDanh(r.id, d); onChange() }}
                className={`rounded px-2 py-1 text-[11px] font-medium transition ${r.diem_danh === d ? DD_TONE[d] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{DD_LABEL[d]}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const KQ = [['correct', 'Đúng'], ['partial', 'Đúng hướng'], ['wrong', 'Sai cách']] as const
const TB = [['clean', 'Chuẩn'], ['ok', 'Khá'], ['sloppy', 'Ẩu']] as const
const TD = [['fast', 'Nhanh'], ['normal', 'Vừa'], ['slow', 'Chậm']] as const

function ChamTab({ buoiId, phase, roster, buoi, onChange }: { buoiId: string; phase: Phase; roster: BuoiHocHS[]; buoi: BuoiHoc; onChange: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [cell, setCell] = useState<{ problemId: string; hocSinhId: string } | null>(null)
  const [reveal, setReveal] = useState<RevealRow[] | null>(null)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const dongCol = phase === 'et' ? buoi.et_dong_at : buoi.ingame_dong_at

  async function reloadP() { const [p, g] = await Promise.all([listProblems(buoiId, phase), listGrades(buoiId)]); setProbs(p); setGrades(g) }
  useEffect(() => { reloadP() }, [buoiId, phase]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function save(result: string, presentation: string, speed: string) {
    if (!cell) return
    await gradeProblem({ buoiId, problemId: cell.problemId, hocSinhId: cell.hocSinhId, result, presentation, speed })
    setCell(null); reloadP()
  }
  async function dong() {
    if (!confirm(`Đóng ${phase === 'et' ? 'ET' : 'buổi học'}? Sẽ tính Elo + EXP, không sửa được sau.`)) return
    const res = await closePhase(buoiId, phase)
    if (res.already) alert('Phase này đã đóng.')
    else { setReveal(res.reveal ?? []); onChange() }
  }

  if (dongCol) return <RevealView buoiId={buoiId} phase={phase} roster={roster} reveal={reveal} />
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước khi chấm.</p>

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button onClick={async () => { await addProblem(buoiId, phase); reloadP() }} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">+ Thêm bài</button>
        <span className="text-[12px] text-slate-400">{probs.length} bài · {coMat.length} HS có mặt</span>
        <button onClick={dong} disabled={!probs.length} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Đóng {phase === 'et' ? 'ET' : 'buổi học'}</button>
      </div>
      {probs.length === 0 ? <p className="text-[12px] text-slate-400">Chưa có bài. Bấm “+ Thêm bài”.</p> : (
        <table className="border-separate border-spacing-1 text-sm">
          <thead><tr><th className="px-2 text-left text-[11px] uppercase text-slate-400">Học sinh</th>{probs.map((p) => <th key={p.id} className="px-2 text-[11px] text-slate-500">Bài {p.problem_no}</th>)}</tr></thead>
          <tbody>
            {coMat.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-2 py-1 font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</td>
                {probs.map((p) => {
                  const g = gradeOf(p.id, r.hoc_sinh_id)
                  const tone = !g ? 'border-dashed border-slate-200 text-slate-300' : g.result === 'correct' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : g.result === 'partial' ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-rose-300 bg-rose-50 text-rose-700'
                  return <td key={p.id} className="px-0.5"><button onClick={() => setCell({ problemId: p.id, hocSinhId: r.hoc_sinh_id })} className={`h-9 w-14 rounded-md border text-center text-[12px] font-semibold ${tone}`}>{g ? g.points : '✎'}</button></td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cell && <ChamPopup onClose={() => setCell(null)} onSave={save} />}
    </div>
  )
}

function ChamPopup({ onClose, onSave }: { onClose: () => void; onSave: (r: string, p: string, s: string) => void }) {
  const [r, setR] = useState('correct'); const [p, setP] = useState('clean'); const [s, setS] = useState('normal')
  const Row = ({ opts, val, set }: { opts: readonly (readonly [string, string])[]; val: string; set: (v: string) => void }) => (
    <div className="flex gap-1.5">{opts.map(([k, lbl]) => <button key={k} onClick={() => set(k)} className={`h-9 flex-1 rounded-lg border text-[12px] font-semibold ${val === k ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{lbl}</button>)}</div>
  )
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" onClick={onClose}>
      <div className="w-[340px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Kết quả</div><Row opts={KQ} val={r} set={setR} />
        <div className="mb-2 mt-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Trình bày</div><Row opts={TB} val={p} set={setP} />
        <div className="mb-2 mt-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Tốc độ</div><Row opts={TD} val={s} set={setS} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onSave(r, p, s)} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">Lưu</button>
        </div>
      </div>
    </div>
  )
}

function RevealView({ phase, roster, reveal }: { buoiId: string; phase: Phase; roster: BuoiHocHS[]; reveal: RevealRow[] | null }) {
  const nameOf = (hsid: string) => roster.find((r) => r.hoc_sinh_id === hsid)?.hoc_sinh?.ho_ten ?? '?'
  if (!reveal) return <p className="text-[13px] text-emerald-600">✓ {phase === 'et' ? 'ET' : 'Buổi học'} đã đóng (Elo + EXP đã tính).</p>
  const rows = [...reveal].sort((a, b) => a.rank - b.rank)
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-emerald-600">✓ Đã đóng — kết quả:</p>
      <table className="text-sm">
        <thead><tr className="text-left text-[11px] uppercase text-slate-400"><th className="px-3">Hạng</th><th className="px-3">Học sinh</th><th className="px-3">Điểm thô</th><th className="px-3">+EXP</th><th className="px-3">Elo</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.hoc_sinh_id} className="border-t border-slate-100">
              <td className="px-3 py-1.5 font-bold text-slate-700">{r.rank || '—'}</td>
              <td className="px-3 font-medium text-slate-800">{nameOf(r.hoc_sinh_id)}</td>
              <td className="px-3 text-slate-500">{r.rawPoints}</td>
              <td className="px-3 font-semibold text-indigo-600">+{r.exp}</td>
              <td className="px-3 text-slate-500">{r.eloBefore != null ? `${r.eloBefore}→${r.eloAfter} (${r.delta! >= 0 ? '+' : ''}${r.delta})` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
