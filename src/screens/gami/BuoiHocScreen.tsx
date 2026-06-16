import { useEffect, useState } from 'react'
import {
  buoiAoCuaNgay, moBuoi, getBuoi, huyBuoi, huyBuoiCuaNgay, setNguoiDay,
  getRoster, diemDanh, dongBoSiSo, listProblems, addProblem, setProblemDang, ensureProblems, listGrades, gradeMuc, closePhase,
  loadETForBuoi, ensureETProblems, resyncETProblems, gradeET, deleteGrade,
  getDanhGia, setDanhGiaDang, setNhanXet,
  type BuoiAo, type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type Phase, type DiemDanh, type RevealRow, type DanhGiaHS, type DanhGiaDiem, type TabKey, type ETResult,
} from '../../lib/gami'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listDaiDang, type CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import DangPickerOne from '../../components/DangPickerOne'

type DangOpt = { ma_dang: string; ten: string }

const todayVN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const DD_LABEL: Record<DiemDanh, string> = { co_mat: 'Có mặt', vang: 'Vắng', vang_phep: 'Vắng phép' }
const DD_TONE: Record<DiemDanh, string> = { co_mat: 'bg-emerald-600 text-white', vang: 'bg-rose-500 text-white', vang_phep: 'bg-amber-500 text-white' }

// Trạng thái buổi cho filter: chưa mở (chưa có dòng) · đã mở (mo/hoan_tat) · đã hủy.
type BuoiStatus = 'chua' | 'mo' | 'huy'
const statusOf = (b: BuoiHoc | null): BuoiStatus => !b ? 'chua' : b.trang_thai === 'huy' ? 'huy' : 'mo'
const FILTERS: { v: BuoiStatus; lbl: string }[] = [{ v: 'chua', lbl: 'Chưa mở' }, { v: 'mo', lbl: 'Đã mở' }, { v: 'huy', lbl: 'Đã hủy' }]

export default function BuoiHocScreen() {
  const [ngay, setNgay] = useState(todayVN())
  const [list, setList] = useState<BuoiAo[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<BuoiStatus>('chua')

  async function reload() {
    setLoading(true); setErr(null)
    try { setList(await buoiAoCuaNgay(ngay)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [ngay]) // eslint-disable-line

  if (openId) return <BuoiDetail id={openId} onClose={() => { setOpenId(null); reload() }} />

  const cnt: Record<BuoiStatus, number> = { chua: 0, mo: 0, huy: 0 }
  for (const ba of list) cnt[statusOf(ba.buoi)]++
  const shown = list.filter((ba) => statusOf(ba.buoi) === filter)
  const tab = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Buổi học</span>
        <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="rounded-md border border-slate-200 px-2 py-1 text-[13px]" />
        <div className="ml-2 flex items-center gap-1">
          {FILTERS.map((f) => <button key={f.v} onClick={() => setFilter(f.v)} className={tab(filter === f.v)}>{f.lbl} <span className={filter === f.v ? 'opacity-80' : 'text-slate-400'}>{cnt[f.v]}</span></button>)}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có buổi nào theo TKB ngày này (kiểm tra TKB + ngày khai giảng).</div>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có buổi “{FILTERS.find((f) => f.v === filter)?.lbl}” ngày này.</div>
          : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {shown.map((b) => <BuoiCard key={b.lop.id} ba={b} ngay={ngay} onOpened={(id) => setOpenId(id)} onChanged={reload} />)}
            </div>
          )}
      </div>
    </div>
  )
}

function BuoiCard({ ba, ngay, onOpened, onChanged }: { ba: BuoiAo; ngay: string; onOpened: (id: string) => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const b = ba.buoi
  const st = statusOf(b)
  const gio = `${ba.slot.gio_bat_dau?.slice(0, 5)}–${ba.slot.gio_ket_thuc?.slice(0, 5)}${ba.slot.phong ? ` · ${ba.slot.phong}` : ''}`
  async function open() {
    setBusy(true)
    try { const buoi = await moBuoi(ba.lop.id, ngay, ba.slot); onOpened(buoi.id) }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  async function huy() {
    const ly = prompt('Lý do hủy buổi?'); if (!ly) return
    setBusy(true)
    try { await huyBuoiCuaNgay(ba.lop.id, ngay, ba.slot, ly); onChanged() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  const head = (
    <>
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-slate-900">{ba.lop.ten_lop}</span>
        <span className="text-[12px] text-slate-400">{ba.lop.mon}{ba.lop.khoi ? ` · K${ba.lop.khoi}` : ''}</span>
        {st === 'mo' && <span className={`ml-auto rounded px-1.5 py-0.5 text-[11px] font-medium ${b!.trang_thai === 'hoan_tat' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{b!.trang_thai === 'hoan_tat' ? 'Hoàn tất' : 'Đang mở'}</span>}
        {st === 'huy' && <span className="ml-auto rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">Đã hủy</span>}
      </div>
      <div className="mt-1 text-[12px] text-slate-500">{gio}</div>
    </>
  )

  // Đã mở → cả CARD bấm vào để vào buổi (không cần nút riêng).
  if (st === 'mo') return (
    <button onClick={() => onOpened(b!.id)} className="rounded-xl border border-indigo-300 bg-indigo-50/40 p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50">
      {head}
      <div className="mt-3 text-[12px] font-medium text-indigo-600">Vào chấm / điểm danh →</div>
    </button>
  )
  if (st === 'huy') return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-80">
      {head}
      <div className="mt-2 text-[12px] text-slate-400">Lý do: {b!.ly_do_huy}</div>
    </div>
  )
  // Chưa mở → Mở buổi + Hủy buổi (kế hoạch).
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {head}
      <div className="mt-3 flex gap-2">
        <button onClick={open} disabled={busy} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? '…' : 'Mở buổi'}</button>
        <button onClick={huy} disabled={busy} className="rounded-md border border-rose-200 px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">Hủy buổi</button>
      </div>
    </div>
  )
}

// tabs: giới hạn tab theo vai (GV/TG mở từ "Việc của tôi"); bỏ trống = đủ 4 (OPS/admin).
// canManage = đổi GV (dạy thay) + Hủy buổi — chỉ OPS/admin. GV/TA mở từ "Việc của tôi" = false (GV read-only).
export function BuoiDetail({ id, onClose, tabs, initialTab, canManage = true }: { id: string; onClose: () => void; tabs?: TabKey[]; initialTab?: TabKey; canManage?: boolean }) {
  const [buoi, setBuoi] = useState<(BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi?: string | null }; gv_chinh_id?: string | null }) | null>(null)
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [dsNS, setDsNS] = useState<NhanSu[]>([])
  const [dangOpts, setDangOpts] = useState<DangOpt[]>([])
  const [tab, setTab] = useState<TabKey>(initialTab ?? tabs?.[0] ?? 'diemdanh')

  async function reload() {
    const [b, r, ns] = await Promise.all([getBuoi(id), getRoster(id), listNhanSu()])
    setBuoi(b); setRoster(r); setDsNS(ns)
    // dạng theo khối của lớp (cho picker chấm bài + tên dạng ở đánh giá). Hiện chỉ Toán (dai_ban_do).
    const khoi = (b as any).lop?.khoi
    if (khoi) { try { setDangOpts((await listDaiDang(khoi)).map((d) => ({ ma_dang: d.ma_dang, ten: d.ten_dang }))) } catch { /* */ } }
  }
  // Mở buổi: đồng bộ sĩ số (thêm HS ghi danh sau lúc mở) RỒI tải. Sau đó các reload (điểm danh…) không sync lại.
  useEffect(() => { (async () => { try { await dongBoSiSo(id) } catch { /* */ } reload() })() }, [id]) // eslint-disable-line
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
          {/* mặc định = GV chính của lớp; chỉ ghi nguoi_day khi đổi (dạy thay) */}
          {(() => { const gvHienThi = buoi.nguoi_day ?? buoi.gv_chinh_id ?? null; const gv = dsNS.find((n) => n.id === gvHienThi); return canManage ? (
            <div className="w-52"><SearchSelect value={gvHienThi} onChange={async (nid) => { await setNguoiDay(id, nid); reload() }} placeholder="người dạy" avatars
              options={dsNS.map((n) => ({ id: n.id, label: n.ho_ten, img: n.anh_url }))} /></div>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              {gv?.anh_url ? <img src={gv.anh_url} alt="" className="h-5 w-5 rounded-full object-cover" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-600">{(gv?.ho_ten ?? '?').charAt(0)}</span>}
              {gv?.ho_ten ?? '(chưa gán GV chính)'}{!buoi.nguoi_day && gvHienThi ? ' (chính)' : ''}
            </span>
          ) })()}
        </div>
        {canManage && buoi.trang_thai !== 'huy' && buoi.trang_thai !== 'hoan_tat' && (
          <button onClick={async () => { const ly = prompt('Lý do hủy buổi?'); if (ly) { await huyBuoi(id, ly); reload() } }}
            className="ml-auto rounded-md border border-rose-200 px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Hủy buổi</button>
        )}
      </div>

      {buoi.trang_thai === 'huy' ? (
        <div className="p-8 text-center text-sm text-slate-400">Buổi đã hủy — {buoi.ly_do_huy}. Mọi việc chấm/điểm danh đã ngừng.</div>
      ) : (
        <>
          <div className="flex gap-1 border-b border-slate-200 bg-white px-6">
            {([['diemdanh', `Điểm danh (${soCoMat}/${roster.length})`], ['danhgia', 'Đánh giá sau buổi'], ['ingame', 'Chấm bài trên lớp'], ['et', 'ET']] as const).filter(([k]) => !tabs || tabs.includes(k)).map(([k, lbl]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-6">
            {tab === 'diemdanh'
              ? <DiemDanhTab roster={roster} chuaDD={chuaDD} onChange={reload} />
              : tab === 'danhgia'
              ? <DanhGiaTab buoiId={id} roster={roster} dangOpts={dangOpts} />
              : tab === 'et'
              ? <ETChamTab buoiId={id} roster={roster} buoi={buoi} dangOpts={dangOpts} onChange={reload} />
              : <ChamTab buoiId={id} phase="ingame" roster={roster} buoi={buoi} dangOpts={dangOpts} onChange={reload} />}
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

// Chấm bài trên lớp: 1 mức 1-5 (gộp 3 chiều). 1=yếu → 5=xuất sắc. 1 click.
// idle = xám nhạt (đỡ chói); click mới lên màu theo mức.
const MUC_IDLE = 'border-slate-200 text-slate-300 hover:bg-slate-100 hover:text-slate-500'
const MUC: { v: number; sel: string }[] = [
  { v: 1, sel: 'bg-rose-600 text-white border-transparent' },
  { v: 2, sel: 'bg-orange-500 text-white border-transparent' },
  { v: 3, sel: 'bg-amber-500 text-white border-transparent' },
  { v: 4, sel: 'bg-lime-600 text-white border-transparent' },
  { v: 5, sel: 'bg-emerald-600 text-white border-transparent' },
]

function ChamTab({ buoiId, phase, roster, buoi, dangOpts, onChange }: { buoiId: string; phase: Phase; roster: BuoiHocHS[]; buoi: BuoiHoc; dangOpts: DangOpt[]; onChange: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [reveal, setReveal] = useState<RevealRow[] | null>(null)
  const [dangPick, setDangPick] = useState<string | null>(null) // problemId đang chọn dạng (popup to)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const dongCol = buoi.ingame_dong_at
  const khoi = (buoi as any).lop?.khoi ?? ''

  async function reloadP() { const [p, g] = await Promise.all([listProblems(buoiId, phase), listGrades(buoiId)]); setProbs(p); setGrades(g) }
  // Chấm bài trên lớp: hiện sẵn bảng 10 bài (slot).
  useEffect(() => { (async () => { try { await ensureProblems(buoiId, 'ingame', 10) } catch { /* */ } reloadP() })() }, [buoiId, phase]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function setMuc(pid: string, hsId: string, muc: number) {
    try {
      if (gradeOf(pid, hsId)?.muc === muc) await deleteGrade(pid, hsId) // click lại mức đang chọn = bỏ chấm
      else await gradeMuc({ buoiId, problemId: pid, hocSinhId: hsId, muc })
      await reloadP()
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function dong() {
    if (!confirm('Đóng buổi học? Sẽ tính Elo + EXP, không sửa được sau.')) return
    const res = await closePhase(buoiId, phase)
    if (res.already) alert('Phase này đã đóng.')
    else { setReveal(res.reveal ?? []); onChange() }
  }

  if (dongCol) return <RevealView buoiId={buoiId} phase={phase} roster={roster} reveal={reveal} />
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước khi chấm.</p>
  const tenDang = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : null)

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button onClick={async () => { await addProblem(buoiId, phase); reloadP() }} className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400">+ Thêm bài</button>
        <span className="text-[12px] text-slate-400">{probs.length} bài · {coMat.length} HS · 1 click mức <b className="text-rose-600">1</b>→<b className="text-emerald-600">5</b>.</span>
        <button onClick={dong} disabled={!probs.length} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Đóng buổi học</button>
      </div>
      {/* cuộn NGANG khi nhiều bài; cột Học sinh ghim trái */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 z-10 border border-slate-200 bg-slate-100 px-3 py-2 text-center text-[12px] font-semibold text-slate-700">Học sinh</th>
              {probs.map((p) => (
                <th key={p.id} className="min-w-[150px] border border-slate-200 px-2 py-2 text-center align-top">
                  <div className="text-[12px] font-bold text-slate-700">Bài {p.problem_no}</div>
                  <button onClick={() => setDangPick(p.id)} title="Chọn dạng cho bài này"
                    className={`mx-auto mt-1 block max-w-[140px] truncate rounded border px-2 py-0.5 text-[11px] font-medium ${p.ma_dang ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-dashed border-slate-300 text-slate-400 hover:border-indigo-400'}`}>{tenDang(p.ma_dang) ?? '+ chọn dạng'}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r) => (
              <tr key={r.id}>
                <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-2 text-center align-middle font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</td>
                {probs.map((p) => {
                  const g = gradeOf(p.id, r.hoc_sinh_id)
                  return (
                    <td key={p.id} className="border border-slate-200 px-2 py-2">
                      <div className="flex justify-center gap-1">
                        {MUC.map((m) => (
                          <button key={m.v} onClick={() => setMuc(p.id, r.hoc_sinh_id, m.v)}
                            className={`h-9 w-8 rounded-lg border text-[14px] font-bold transition ${g?.muc === m.v ? m.sel : MUC_IDLE}`}>{m.v}</button>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {dangPick && <DangPickerOne khoi={khoi} onClose={() => setDangPick(null)} onPick={async (md) => { const pid = dangPick; setDangPick(null); await setProblemDang(pid, md); reloadP() }} />}
    </div>
  )
}

// ── CHẤM ET: 1-click 3 mức Đ/C/S; C/S mở 6 ô lỗi E01..E06 (tick → tự ẩn). Bảng kẻ ô to. ──
const ET_KQ: { v: ETResult; lbl: string; idle: string; sel: string }[] = [
  { v: 'correct', lbl: 'Đ', idle: 'border-slate-200 text-emerald-700 hover:bg-emerald-50', sel: 'border-transparent bg-emerald-600 text-white' },
  { v: 'partial', lbl: 'C', idle: 'border-slate-200 text-amber-700 hover:bg-amber-50', sel: 'border-transparent bg-amber-500 text-white' },
  { v: 'wrong', lbl: 'S', idle: 'border-slate-200 text-rose-700 hover:bg-rose-50', sel: 'border-transparent bg-rose-600 text-white' },
]
const ET_LOI = ['E01', 'E02', 'E03', 'E04', 'E05', 'E06']

function ETChamTab({ buoiId, roster, buoi, dangOpts, onChange }: { buoiId: string; roster: BuoiHocHS[]; buoi: BuoiHoc; dangOpts: DangOpt[]; onChange: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [etCaus, setEtCaus] = useState<CauHoi[] | null>(null)
  const [etMissing, setEtMissing] = useState(false)
  const [reveal, setReveal] = useState<RevealRow[] | null>(null)
  const [editing, setEditing] = useState<{ problemId: string; hsId: string } | null>(null) // ô đang mở bảng lỗi
  const [preview, setPreview] = useState<CauHoi | null>(null)
  const [loading, setLoading] = useState(true)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const dongCol = buoi.et_dong_at

  async function reloadP() { const [p, g] = await Promise.all([listProblems(buoiId, 'et'), listGrades(buoiId)]); setProbs(p); setGrades(g) }
  useEffect(() => { (async () => {
    setLoading(true)
    try {
      const { etId, caus } = await loadETForBuoi(buoiId)
      if (!etId) { setEtMissing(true); setEtCaus([]) }
      else { setEtMissing(false); await ensureETProblems(buoiId, caus); setEtCaus(caus) }
      await reloadP()
    } catch { setEtMissing(true); setEtCaus([]) } finally { setLoading(false) }
  })() }, [buoiId]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function pickKQ(pid: string, hsId: string, result: ETResult) {
    const g = gradeOf(pid, hsId)
    try {
      if (g?.result === result) { await deleteGrade(pid, hsId); setEditing(null); await reloadP(); return } // click lại = bỏ chấm
      const cur = g?.loi ?? []
      if (result === 'correct') { await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: [] }); setEditing(null) }
      else { await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: cur }); setEditing({ problemId: pid, hsId }) } // C/S → mở bảng lỗi
      await reloadP()
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function toggleLoi(pid: string, hsId: string, code: string) {
    const g = gradeOf(pid, hsId); if (!g) return
    const cur = g.loi ?? []
    const next = cur.includes(code) ? cur.filter((x) => x !== code) : [...cur, code]
    try { await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result: g.result as ETResult, loi: next }); setEditing(null); await reloadP() } // tick xong tự ẩn
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function dong() {
    if (!confirm('Đóng ET? Không sửa được sau.')) return
    const res = await closePhase(buoiId, 'et')
    if (res.already) alert('ET đã đóng.')
    else { setReveal(res.reveal ?? []); onChange() }
  }
  async function dongBoET() { try { await resyncETProblems(buoiId, etCaus ?? []); await reloadP() } catch (e: any) { alert(e.message ?? String(e)) } }

  if (loading) return <p className="text-[12px] text-slate-400">Đang tải ET…</p>
  if (dongCol) return <RevealView buoiId={buoiId} phase="et" roster={roster} reveal={reveal} />
  if (etMissing) return <p className="text-[13px] text-slate-400">Chưa có ET cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Vào <b className="text-slate-600">Làm tài liệu → ET</b> tạo ET đúng lớp + ngày của buổi rồi quay lại.</p>
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước khi chấm.</p>

  const tenDang = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : '—')
  const cauOf = (idx: number) => etCaus?.[idx] ?? null
  const mismatch = etCaus != null && etCaus.length !== probs.length

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu (từ ET) · {coMat.length} HS · 1 click <b className="text-emerald-600">Đ</b>/<b className="text-amber-600">C</b>/<b className="text-rose-600">S</b> — C/S mở ô lỗi.</span>
        {mismatch && <button onClick={dongBoET} title="ET đổi số câu — nạp lại (chỉ khi chưa chấm)" className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↻ Đồng bộ từ ET</button>}
        <button onClick={dong} disabled={!probs.length} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Đóng ET</button>
      </div>
      <div className="overflow-auto rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 z-10 border border-slate-200 bg-slate-100 px-3 py-2 text-center text-[12px] font-semibold text-slate-700">Học sinh</th>
              {probs.map((p, idx) => {
                const c = cauOf(idx)
                return (
                  <th key={p.id} className="min-w-[140px] border border-slate-200 px-2 py-2 text-center align-top">
                    <div className="text-[12px] font-bold text-slate-700">Câu {p.problem_no}</div>
                    <div className="mx-auto max-w-[180px] truncate text-[11px] font-medium normal-case text-violet-600" title={tenDang(p.ma_dang)}>{tenDang(p.ma_dang)}</div>
                    {c && <button onClick={() => setPreview(c)} className="mt-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-normal normal-case text-slate-400 hover:border-indigo-300 hover:text-indigo-600">ⓘ đề</button>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r) => (
              <tr key={r.id}>
                <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-2 text-center align-middle font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</td>
                {probs.map((p) => {
                  const g = gradeOf(p.id, r.hoc_sinh_id)
                  const isEditing = editing?.problemId === p.id && editing?.hsId === r.hoc_sinh_id
                  const hasProblem = !!g && (g.result === 'partial' || g.result === 'wrong')
                  return (
                    <td key={p.id} className="border border-slate-200 px-2 py-2 align-top">
                      <div className="flex justify-center gap-1.5">
                        {ET_KQ.map((k) => (
                          <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)}
                            className={`h-8 w-9 rounded-lg border text-[13px] font-bold transition ${g?.result === k.v ? k.sel : k.idle}`}>{k.lbl}</button>
                        ))}
                      </div>
                      {isEditing ? (
                        <div className="mt-2 grid grid-cols-3 gap-1">
                          {ET_LOI.map((code) => {
                            const on = g?.loi?.includes(code)
                            return <button key={code} onClick={() => toggleLoi(p.id, r.hoc_sinh_id, code)}
                              className={`rounded border px-1 py-1 text-[11px] font-medium transition ${on ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600'}`}>{code}</button>
                          })}
                        </div>
                      ) : hasProblem && g?.loi?.length ? (
                        <button onClick={() => setEditing({ problemId: p.id, hsId: r.hoc_sinh_id })} title="Bấm để sửa lỗi" className="mt-1.5 flex w-full flex-wrap justify-center gap-1">
                          {g.loi.map((code) => <span key={code} className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">{code}</span>)}
                        </button>
                      ) : hasProblem ? (
                        <button onClick={() => setEditing({ problemId: p.id, hsId: r.hoc_sinh_id })} className="mt-1.5 block w-full text-center text-[10px] text-slate-300 hover:text-rose-500">+ gắn lỗi</button>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[80vh] w-[640px] max-w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center gap-2"><span className="text-[12px] font-semibold uppercase tracking-wide text-violet-600">Đề câu</span><button onClick={() => setPreview(null)} className="ml-auto text-slate-400 hover:text-slate-600">✕</button></div>
            <div className="text-[14px] leading-relaxed text-slate-800"><MathText>{preview.noi_dung}</MathText></div>
            {preview.lua_chon?.length ? <div className="mt-3 space-y-1 text-[13px] text-slate-600">{preview.lua_chon.map((lc, i) => <div key={i}><b>{String.fromCharCode(65 + i)}.</b> <MathText>{lc}</MathText></div>)}</div> : null}
          </div>
        </div>
      )}
    </div>
  )
}

// ── ĐÁNH GIÁ SAU BUỔI: per-HS nhận xét + verdict per-dạng {0/0.5/1} ──
// Đ/C/S = thống nhất quy tắc với ET (Đ=1 hiểu · C=0.5 một phần · S=0 chưa). idle xám, click lên màu.
const DG_SCORES: { v: DanhGiaDiem; lbl: string; sel: string }[] = [
  { v: 1, lbl: 'Đ', sel: 'bg-emerald-600 text-white border-transparent' },
  { v: 0.5, lbl: 'C', sel: 'bg-amber-500 text-white border-transparent' },
  { v: 0, lbl: 'S', sel: 'bg-rose-600 text-white border-transparent' },
]
// Chip tham khảo từ chấm bài trên lớp = mức 1-5 (màu theo mức).
const MUC_REF = (muc?: number | null) => muc == null ? 'bg-slate-100 text-slate-300'
  : muc >= 4 ? 'bg-emerald-100 text-emerald-700' : muc === 3 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
function DanhGiaTab({ buoiId, roster, dangOpts }: { buoiId: string; roster: BuoiHocHS[]; dangOpts: DangOpt[] }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [data, setData] = useState<Record<string, DanhGiaHS>>({})
  const [loading, setLoading] = useState(true)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenDang = (md: string) => dangOpts.find((d) => d.ma_dang === md)?.ten ?? md
  // dạng của buổi = ma_dang đã gắn ở "Chấm bài trên lớp" (ingame)
  const dangs = [...new Set(probs.map((p) => p.ma_dang).filter(Boolean))] as string[]

  async function reload() { setLoading(true); try { const [p, g, d] = await Promise.all([listProblems(buoiId, 'ingame'), listGrades(buoiId), getDanhGia(buoiId)]); setProbs(p); setGrades(g); setData(d) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [buoiId]) // eslint-disable-line

  async function setDiem(hsId: string, maDang: string, cur: DanhGiaDiem | undefined, val: DanhGiaDiem) {
    const next: DanhGiaDiem | null = cur === val ? null : val // bấm lại = bỏ chọn (về chưa-đánh-giá)
    setData((d) => { const hs = d[hsId] ?? { hoc_sinh_id: hsId, nhan_xet: null, diemTheoDang: {} }; const dd = { ...hs.diemTheoDang }; if (next === null) delete dd[maDang]; else dd[maDang] = next; return { ...d, [hsId]: { ...hs, diemTheoDang: dd } } })
    try { await setDanhGiaDang(buoiId, hsId, maDang, next) } catch (e: any) { alert(e.message ?? String(e)); reload() }
  }
  async function saveNX(hsId: string, txt: string) { try { await setNhanXet(buoiId, hsId, txt) } catch (e: any) { alert(e.message ?? String(e)) } }

  if (loading) return <p className="text-[13px] text-slate-400">Đang tải…</p>
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước.</p>

  return (
    <div>
      <p className="mb-2 text-[12px] text-slate-400">
        {dangs.length === 0
          ? <>Chưa có dạng nào — gắn dạng cho bài ở tab <b>Chấm bài trên lớp</b> sẽ tự hiện cột. Tạm thời chỉ nhập nhận xét.</>
          : <>Mỗi dạng: chip nhỏ = mức từng bài (tham khảo từ chấm bài) · nút màu = mức GV chốt (bấm lại để bỏ).</>}
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 z-10 border border-slate-200 bg-slate-100 px-3 py-2 text-center text-[12px] font-semibold text-slate-700">Học sinh</th>
              {dangs.map((md) => <th key={md} className="min-w-[160px] border border-slate-200 px-3 py-2 text-left text-[12px] font-semibold text-slate-700"><div className="max-w-[200px] truncate" title={tenDang(md)}>{tenDang(md)}</div></th>)}
              <th className="border border-slate-200 px-3 py-2 text-left text-[12px] font-semibold text-slate-700">Nhận xét</th>
            </tr>
          </thead>
          <tbody>
            {coMat.map((r) => {
              const hsId = r.hoc_sinh_id; const hs = data[hsId]
              return (
                <tr key={r.id} className="align-top">
                  <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-2 text-center align-middle font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</td>
                  {dangs.map((md) => {
                    const cur = hs?.diemTheoDang[md]
                    const baiDang = probs.filter((p) => p.ma_dang === md)
                    return (
                      <td key={md} className="border border-slate-200 px-3 py-2">
                        <div className="mb-1.5 flex flex-wrap gap-0.5">
                          {baiDang.length === 0 ? <span className="text-[10px] text-slate-300">—</span> : baiDang.map((p) => {
                            const g = grades.find((x) => x.problem_id === p.id && x.hoc_sinh_id === hsId)
                            return <span key={p.id} title={`Bài ${p.problem_no}`} className={`inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-semibold ${MUC_REF(g?.muc)}`}>{g?.muc ?? '·'}</span>
                          })}
                        </div>
                        <div className="flex gap-1">
                          {DG_SCORES.map((s) => (
                            <button key={s.v} onClick={() => setDiem(hsId, md, cur, s.v)} title={s.v === 1 ? 'Đúng (hiểu)' : s.v === 0.5 ? 'Chưa đạt (một phần)' : 'Sai (chưa hiểu)'}
                              className={`h-8 w-9 rounded-lg border text-[13px] font-bold transition ${cur === s.v ? s.sel : 'border-slate-200 text-slate-300 hover:bg-slate-100 hover:text-slate-500'}`}>{s.lbl}</button>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                  <td className="border border-slate-200 px-3 py-2">
                    <textarea defaultValue={hs?.nhan_xet ?? ''} onBlur={(e) => saveNX(hsId, e.target.value)} placeholder="nhận xét…"
                      className="h-12 w-96 rounded-md border border-slate-200 px-2 py-1 text-[12px]" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
