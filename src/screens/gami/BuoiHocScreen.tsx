import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
// (Ảnh gửi PH dùng html2canvas tải từ CDN TRONG popup — đúng pattern V1, không import vào bundle.)
import {
  buoiAoCuaNgay, moBuoi, getBuoi, huyBuoi, huyBuoiCuaNgay, setNguoiDay,
  getRoster, diemDanh, xoaHSKhoiBuoi, dongBoSiSo, listProblems, addProblem, setProblemDang, ensureProblems, listGrades, gradeMuc, closePhase,
  loadETForBuoi, ensureETProblems, resyncETProblems, gradeET, deleteGrade, reopenPhase,
  loadBTVNForBuoi, ensureBTVNProblems, getBtvnKetQua, setBtvnKetQua, listCanhBao, themCanhBao, xoaCanhBao, closeBTVN, reopenBTVN,
  type BtvnKQ, type CanhBao, type BtvnTrangThai, type BtvnThaiDo,
  getDanhGia, setDanhGiaDang, setNhanXet, dongDanhGia, moLaiDanhGia,
  type BuoiAo, type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type Phase, type DiemDanh, type DanhGiaHS, type DanhGiaDiem, type TabKey, type ETResult,
} from '../../lib/gami'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listDaiDang, type CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import DangPickerOne from '../../components/DangPickerOne'
import { useIsMobile } from '../../hooks/useIsMobile'

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
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
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
  const isMobile = useIsMobile()

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
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <button onClick={onClose} className="text-[13px] text-slate-500 hover:text-indigo-600">← Buổi học</button>
        <span className="text-sm font-semibold text-slate-900">{buoi.lop?.ten_lop} · {buoi.ngay}</span>
        {!isMobile && <span className="font-mono text-[11px] text-slate-400">{buoi.ma_buoi}</span>}
        {!isMobile && <div className="flex items-center gap-1 text-[12px] text-slate-500">GV:
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
        </div>}
        {canManage && buoi.trang_thai !== 'huy' && buoi.trang_thai !== 'hoan_tat' && (
          <button onClick={async () => { const ly = prompt('Lý do hủy buổi?'); if (ly) { await huyBuoi(id, ly); reload() } }}
            className="ml-auto rounded-md border border-rose-200 px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Hủy buổi</button>
        )}
      </div>

      {buoi.trang_thai === 'huy' ? (
        <div className="p-8 text-center text-sm text-slate-400">Buổi đã hủy — {buoi.ly_do_huy}. Mọi việc chấm/điểm danh đã ngừng.</div>
      ) : (
        <>
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-6">
            {([['diemdanh', `Điểm danh (${soCoMat}/${roster.length})`], ['danhgia', 'Đánh giá sau buổi'], ['ingame', 'Chấm bài trên lớp'], ['et', 'ET'], ['btvn', 'BTVN']] as const).filter(([k]) => !tabs || tabs.includes(k)).map(([k, lbl]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
            ))}
          </div>
          <div className={`min-h-0 min-w-0 flex-1 overflow-auto ${isMobile ? 'p-3' : 'p-6'}`}>
            {tab === 'diemdanh'
              ? <DiemDanhTab roster={roster} chuaDD={chuaDD} canManage={canManage} onChange={reload} />
              : tab === 'danhgia'
              ? <DanhGiaTab buoiId={id} roster={roster} dangOpts={dangOpts} buoi={buoi} onChange={reload} />
              : tab === 'et'
              ? <ETChamTab buoiId={id} roster={roster} buoi={buoi} dangOpts={dangOpts} onChange={reload} />
              : tab === 'btvn'
              ? <BtvnTab buoiId={id} roster={roster} buoi={buoi} dangOpts={dangOpts} onChange={reload} />
              : <ChamTab buoiId={id} phase="ingame" roster={roster} buoi={buoi} dangOpts={dangOpts} onChange={reload} />}
          </div>
        </>
      )}
    </div>
  )
}

function DiemDanhTab({ roster, chuaDD, canManage, onChange }: { roster: BuoiHocHS[]; chuaDD: number; canManage: boolean; onChange: () => void }) {
  async function xoa(r: BuoiHocHS) {
    if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi này?\n\nChỉ dùng khi xếp NHẦM lớp (data sai). Sẽ chặn nếu HS đã có bài chấm / điểm thật.`)) return
    try { await xoaHSKhoiBuoi(r); onChange() } catch (e: any) { alert(e.message ?? String(e)) }
  }
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
            {canManage && (
              <button onClick={() => xoa(r)} title="Gỡ HS khỏi buổi (xếp nhầm lớp / data sai)"
                className="ml-0.5 rounded px-1.5 py-1 text-[12px] text-slate-300 transition hover:bg-rose-50 hover:text-rose-600">✕</button>
            )}
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
  const [dangPick, setDangPick] = useState<string | null>(null) // problemId đang chọn dạng (popup to)
  const [closing, setClosing] = useState(false)
  const isMobile = useIsMobile()
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
  // "Xác nhận" = chốt buổi (tính Elo + EXP, task rời "Việc của tôi"). Bảng GIỮ NGUYÊN, khoá lại; "Mở lại" để sửa.
  async function dong() {
    if (closing) return
    if (!confirm('Xác nhận chấm bài trên lớp? Sẽ tính Elo + EXP. Mở lại được nếu cần sửa.')) return
    setClosing(true)
    try { const res = await closePhase(buoiId, phase); if (res.already) alert('Đã xác nhận rồi.'); else onChange() }
    finally { setClosing(false) }
  }
  async function moLai() { await reopenPhase(buoiId, phase); onChange() } // mở lại để sửa → hoàn Elo/EXP, xác nhận lại sau
  // In PHIẾU CHẤM (lưới HS × bài, ô trống để GV tích tay trong lớp). Khổ A4 ngang, ≤16 HS/trang (tự sang trang nếu hơn).
  function inPhieu() {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const dn = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : '')
    const lop = (buoi as any).lop?.ten_lop ?? ''
    const mon = (buoi as any).lop?.mon ?? ''
    const head = probs.map((p) => `<th class="b">Bài ${p.problem_no}${p.ma_dang ? `<div class="d">${esc(dn(p.ma_dang))}</div>` : ''}</th>`).join('')
    const body = coMat.map((r, i) => `<tr><td class="n">${i + 1}</td><td class="t">${esc(r.hoc_sinh?.ho_ten ?? '?')}</td>${probs.map(() => '<td class="c"></td>').join('')}</tr>`).join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Phiếu chấm ${esc(lop)}</title><style>
      @page{size:A4 landscape;margin:10mm}*{font-family:Arial,Helvetica,sans-serif}
      h1{font-size:15px;margin:0 0 2px}.sub{font-size:11px;color:#444;margin:0 0 8px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #333;padding:3px 4px;font-size:11px}
      thead th{background:#eee}.b{text-align:center}.d{font-size:9px;color:#555;font-weight:normal;margin-top:1px}
      .n{width:22px;text-align:center}.t{text-align:left;white-space:nowrap}.c{height:24px}
      tr{break-inside:avoid}.lg{font-size:10px;color:#555;margin-top:6px}</style></head><body>
      <h1>PHIẾU CHẤM BÀI TRÊN LỚP</h1>
      <div class="sub">Lớp <b>${esc(lop)}</b>${mon ? ` · ${esc(mon)}` : ''} · Ngày: ${esc(buoi.ngay)} · GV: ____________ · Sĩ số có mặt: ${coMat.length}</div>
      <table><thead><tr><th class="n">#</th><th class="t">Họ tên</th>${head}</tr></thead><tbody>${body}</tbody></table>
      <div class="lg">Thang mức: 1 (yếu) · 2 · 3 · 4 · 5 (xuất sắc) — ghi mức vào ô.</div></body></html>`
    const w = window.open('', '_blank', 'width=1100,height=800')
    if (!w) { alert('Trình duyệt chặn cửa sổ in — cho phép pop-up rồi thử lại.'); return }
    w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 350)
  }

  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước khi chấm.</p>
  const tenDang = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : null)

  // ── MOBILE: 1 bài/màn, nút chuyển nhanh, danh sách HS + mức 1→5 (HS làm các bài khác nhau) ──
  if (isMobile) return (
    <>
      <ChamMobile probs={probs} coMat={coMat} gradeOf={gradeOf} tenDang={tenDang}
        onSetMuc={setMuc} onAddBai={async () => { await addProblem(buoiId, phase); reloadP() }}
        onPickDang={setDangPick} onDong={dong} onMoLai={moLai} locked={!!dongCol} closing={closing} />
      {dangPick && <DangPickerOne khoi={khoi} onClose={() => setDangPick(null)} onPick={async (md) => { const pid = dangPick; setDangPick(null); await setProblemDang(pid, md); reloadP() }} />}
    </>
  )

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button onClick={async () => { await addProblem(buoiId, phase); reloadP() }} className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400">+ Thêm bài</button>
        <button onClick={inPhieu} className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400" title="In phiếu chấm trống để tích tay trong lớp">🖨 In phiếu</button>
        <span className="text-[12px] text-slate-400">{probs.length} bài · {coMat.length} HS · 1 click mức <b className="text-rose-600">1</b>→<b className="text-emerald-600">5</b>.</span>
        {dongCol ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">✓ Đã xác nhận</span>
            <button onClick={moLai} className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Mở lại để sửa</button>
          </div>
        ) : (
          <button onClick={dong} disabled={!probs.length || closing} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{closing ? 'Đang lưu…' : '✓ Xác nhận'}</button>
        )}
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
                          <button key={m.v} onClick={() => setMuc(p.id, r.hoc_sinh_id, m.v)} disabled={!!dongCol}
                            className={`h-9 w-8 rounded-lg border text-[14px] font-bold transition disabled:cursor-not-allowed ${g?.muc === m.v ? m.sel : MUC_IDLE} ${dongCol && g?.muc !== m.v ? 'opacity-50' : ''}`}>{m.v}</button>
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

// ── MOBILE chấm bài trên lớp: 1 bài/màn, chuyển nhanh, danh sách HS + mức 1→5 ──
// GV đi quanh lớp, HS làm các bài khác nhau → chọn đúng bài đó rồi chấm cả lớp.
function ChamMobile({ probs, coMat, gradeOf, tenDang, onSetMuc, onAddBai, onPickDang, onDong, onMoLai, locked, closing }: {
  probs: Problem[]; coMat: BuoiHocHS[]
  gradeOf: (pid: string, hsid: string) => Grade | undefined
  tenDang: (md: string | null) => string | null
  onSetMuc: (pid: string, hsId: string, muc: number) => void
  onAddBai: () => void; onPickDang: (pid: string) => void
  onDong: () => void; onMoLai: () => void; locked: boolean; closing: boolean
}) {
  const [pi, setPi] = useState(0)
  // clamp khi số bài đổi (thêm/bớt bài)
  useEffect(() => { setPi((i) => Math.max(0, Math.min(i, probs.length - 1))) }, [probs.length])

  if (probs.length === 0) return <p className="text-[13px] text-slate-400">Đang tải bài…</p>
  const idx = Math.max(0, Math.min(pi, probs.length - 1))
  const cur = probs[idx]
  const chamRoi = (pid: string) => coMat.filter((r) => gradeOf(pid, r.hoc_sinh_id)).length
  const done = chamRoi(cur.id)
  // tên gọn = 2 từ cuối (vd "Nguyễn Thị Hồng Anh" → "Hồng Anh")
  const tenGon = (s?: string | null) => (s ?? '?').trim().split(/\s+/).slice(-2).join(' ')

  return (
    <div className="flex flex-col gap-2">
      {/* FREEZE: 1 hàng GỌN — ‹ Bài N/total › + đã chấm X/Y. Dính đỉnh khi cuộn. */}
      <div className="sticky top-0 z-20 -mx-3 -mt-3 flex items-center gap-2 border-b border-slate-200 bg-[#fafafb] px-3 py-2 shadow-sm">
        <button onClick={() => setPi(idx - 1)} disabled={idx === 0} className="h-9 w-10 shrink-0 rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-600 disabled:opacity-30">‹</button>
        <div className="text-[15px] font-bold text-slate-800">Bài {cur.problem_no}<span className="text-[12px] font-normal text-slate-400">/{probs.length}</span></div>
        <button onClick={() => setPi(idx + 1)} disabled={idx === probs.length - 1} className="h-9 w-10 shrink-0 rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-600 disabled:opacity-30">›</button>
        <span className="ml-auto text-[13px] text-slate-500">Đã chấm <b className="text-slate-800">{done}/{coMat.length}</b></span>
      </div>

      {/* Danh sách HS — mỗi HS 1 hàng: tên (2 từ cuối) + nút mức 1→5 nhỏ, cùng dòng */}
      <div className="flex flex-col gap-1.5">
        {coMat.map((r) => {
          const g = gradeOf(cur.id, r.hoc_sinh_id)
          return (
            <div key={r.id} className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 ${g ? 'border-slate-200' : 'border-amber-200'}`}>
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-slate-800">{tenGon(r.hoc_sinh?.ho_ten)}</span>
              <div className="flex shrink-0 gap-1">
                {MUC.map((m) => (
                  <button key={m.v} onClick={() => onSetMuc(cur.id, r.hoc_sinh_id, m.v)} disabled={locked}
                    className={`h-9 w-9 rounded-lg border text-[14px] font-bold transition disabled:cursor-not-allowed ${g?.muc === m.v ? m.sel : MUC_IDLE} ${locked && g?.muc !== m.v ? 'opacity-50' : ''}`}>{m.v}</button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Chân: chọn dạng cho bài này + thêm bài + đóng buổi (đẩy khỏi header cho gọn) */}
      <div className="mt-1 flex items-center gap-2 border-t border-slate-200 pt-3">
        <button onClick={() => onPickDang(cur.id)} className={`min-w-0 flex-1 truncate rounded-md border px-2 py-1.5 text-[12px] font-medium ${cur.ma_dang ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-dashed border-slate-300 text-slate-400'}`}>{tenDang(cur.ma_dang) ?? '+ chọn dạng'}</button>
        <button onClick={onAddBai} className="shrink-0 rounded-md border border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-600">+ Bài</button>
        {locked
          ? <button onClick={onMoLai} className="shrink-0 rounded-md border border-amber-300 px-3 py-1.5 text-[13px] font-medium text-amber-700">↩ Mở lại</button>
          : <button onClick={onDong} disabled={closing} className="shrink-0 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{closing ? '…' : '✓ Xác nhận'}</button>}
      </div>
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
  const [editing, setEditing] = useState<{ problemId: string; hsId: string } | null>(null) // ô đang mở bảng lỗi
  const [preview, setPreview] = useState<CauHoi | null>(null)
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [anhPH, setAnhPH] = useState(false) // overlay ảnh kết quả ET gửi phụ huynh
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
  // "Xác nhận ET" = chốt (tính Elo + EXP). Bảng GIỮ NGUYÊN, khoá; "Mở lại" để sửa (hoàn Elo).
  async function dong() {
    if (closing) return
    if (!confirm('Xác nhận ET? Sẽ tính Elo + EXP. Mở lại được nếu cần sửa.')) return
    setClosing(true)
    try { const res = await closePhase(buoiId, 'et'); if (res.already) alert('Đã xác nhận rồi.'); else onChange() }
    finally { setClosing(false) }
  }
  async function moLai() { await reopenPhase(buoiId, 'et'); onChange() }
  async function dongBoET() { try { await resyncETProblems(buoiId, etCaus ?? []); await reloadP() } catch (e: any) { alert(e.message ?? String(e)) } }

  if (loading) return <p className="text-[12px] text-slate-400">Đang tải ET…</p>
  if (etMissing) return <p className="text-[13px] text-slate-400">Chưa có ET cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Vào <b className="text-slate-600">Làm tài liệu → ET</b> tạo ET đúng lớp + ngày của buổi rồi quay lại.</p>
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước khi chấm.</p>

  const tenDang = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : '—')
  const cauOf = (idx: number) => etCaus?.[idx] ?? null
  const mismatch = etCaus != null && etCaus.length !== probs.length

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu (từ ET) · {coMat.length} HS · 1 click <b className="text-emerald-600">Đ</b>/<b className="text-amber-600">C</b>/<b className="text-rose-600">S</b> — C/S mở ô lỗi.</span>
        {mismatch && !dongCol && <button onClick={dongBoET} title="ET đổi số câu — nạp lại (chỉ khi chưa chấm)" className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↻ Đồng bộ từ ET</button>}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setAnhPH(true)} title="Tạo ảnh kết quả ET (dọc) để chụp gửi phụ huynh" className="rounded-md border border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400">📷 Ảnh gửi PH</button>
          {dongCol ? (
            <>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">✓ Đã xác nhận ET</span>
              <button onClick={moLai} className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Mở lại để sửa</button>
            </>
          ) : (
            <button onClick={dong} disabled={!probs.length || closing} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{closing ? 'Đang lưu…' : '✓ Xác nhận ET'}</button>
          )}
        </div>
      </div>
      {anhPH && <EtAnhGuiPH coMat={coMat} probs={probs} gradeOf={gradeOf} buoi={buoi} onClose={() => setAnhPH(false)} />}
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
                          <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)} disabled={!!dongCol}
                            className={`h-8 w-9 rounded-lg border text-[13px] font-bold transition disabled:cursor-not-allowed ${g?.result === k.v ? k.sel : k.idle} ${dongCol && g?.result !== k.v ? 'opacity-50' : ''}`}>{k.lbl}</button>
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
                        <button onClick={() => !dongCol && setEditing({ problemId: p.id, hsId: r.hoc_sinh_id })} disabled={!!dongCol} title={dongCol ? '' : 'Bấm để sửa lỗi'} className="mt-1.5 flex w-full flex-wrap justify-center gap-1">
                          {g.loi.map((code) => <span key={code} className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">{code}</span>)}
                        </button>
                      ) : hasProblem && !dongCol ? (
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

// ── Ảnh kết quả ET gửi phụ huynh (TẠM THỜI — dashboard sau): ẢNH CẢ LỚP (bảng dọc HS × Bài) để CHỤP gửi PH.
// Chỉ hiện Bài 1/2/3… + Đ/C/S (KHÔNG đề/dạng).
// hex (sRGB) — KHÔNG dùng class màu Tailwind v4 ở card export vì compute ra oklch() → html-to-image trắng xóa.
const ET_KQ_PH: Record<string, { l: string; hex: string; mo_ta: string }> = {
  correct: { l: 'Đ', hex: '#10b981', mo_ta: 'Đúng' },
  partial: { l: 'C', hex: '#f59e0b', mo_ta: 'Trình bày chưa hoàn thiện' },
  wrong: { l: 'S', hex: '#f43f5e', mo_ta: 'Chưa biết làm' },
}
// Badge tròn Đ/C/S = SVG (circle + text căn tâm bằng dominant-baseline) → html2canvas render qua engine trình duyệt = pixel-perfect, KHỎI căn tay.
function Badge({ hex, letter, size }: { hex: string; letter: string; size: number }) {
  const c = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx={c} cy={c} r={c} fill={hex} />
      <text x={c} y={c} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.52} fontWeight={700} fill="#ffffff"
        fontFamily='system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'>{letter}</text>
    </svg>
  )
}
function EtAnhGuiPH({ coMat, probs, gradeOf, buoi, onClose }: {
  coMat: BuoiHocHS[]; probs: Problem[]; gradeOf: (pid: string, hsid: string) => Grade | undefined; buoi: BuoiHoc; onClose: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  if (!coMat.length) return null
  const lop = (buoi as any).lop?.ten_lop ?? ''
  const ngayVN = buoi.ngay ? buoi.ngay.split('-').reverse().join('/') : ''
  // COPY ảnh — ĐÚNG pattern V1 (TabSatHach.handleCopy / openReportPopup, chạy production ổn định):
  // MỞ POPUP chứa HTML phiếu + nút "Copy ảnh" NGAY TRONG popup. Bấm Copy trong popup = user-gesture trong
  // context popup → html2canvas (CDN) + clipboard.write chạy ngon (paste Zalo); fallback tải file CHỈ khi clipboard bị chặn.
  // Card đã inline-hex (tự mô tả) → KHÔNG nhúng stylesheet app (né oklch Tailwind v4). Kèm nút In / Lưu PDF.
  function handleCopy() {
    const el = cardRef.current
    if (!el) { alert('Chưa render được phiếu'); return }
    const cardHTML = el.outerHTML
    const fname = `KetQuaET_${lop || 'lop'}_${ngayVN.replace(/\//g, '-')}.png`
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<base href="${location.origin}/">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kết quả ET — Lớp ${lop}</title>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"><\/script>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f3f4f6;padding:12px;display:flex;flex-direction:column;align-items:center;min-height:100vh}
  .btn-row{display:flex;gap:8px;margin-bottom:12px;width:100%;max-width:480px}
  .btn{flex:1;padding:10px 12px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-copy{background:#16a34a;color:#fff}.btn-print{background:#2563eb;color:#fff}.btn:hover{opacity:.85}
  #msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px;text-align:center;width:100%}
  @media print{.btn-row,#msg{display:none!important}}
  #report-content{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)}
</style></head><body>
<div class="btn-row">
  <button class="btn btn-copy" onclick="copyImg()">📋 Copy ảnh (paste vào Zalo)</button>
  <button class="btn btn-print" onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>
<div id="report-content">${cardHTML}</div>
<p id="msg"></p>
<script>
async function copyImg(){
  var msg=document.getElementById('msg');msg.textContent='⏳ Đang xử lý...';
  try{
    var node=document.getElementById('report-content');
    var canvas=await html2canvas(node,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,scrollX:0,scrollY:0,windowWidth:node.scrollWidth,windowHeight:node.scrollHeight,width:node.scrollWidth,height:node.scrollHeight});
    canvas.toBlob(async function(blob){
      try{ await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]); msg.textContent='✅ Đã copy! Paste (Ctrl+V) vào Zalo.'; }
      catch(e){ var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=${JSON.stringify(fname)};a.click();URL.revokeObjectURL(url); msg.textContent='✅ Đã tải file ảnh!'; }
    },'image/png');
  }catch(e){ msg.textContent='Lỗi: '+e.message; }
}
<\/script>
</body></html>`
    const popup = window.open('', '_blank', 'width=560,height=900,scrollbars=yes')
    if (!popup) { alert('Trình duyệt chặn popup. Bật "Allow pop-ups" cho site này.'); return }
    popup.document.write(html)
    popup.document.close()
  }
  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-900/70" onClick={onClose}>
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold">Ảnh kết quả ET cả lớp — gửi phụ huynh</span>
        <button onClick={handleCopy} className="ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500">📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        {/* ẢNH CẢ LỚP — "Copy ảnh" chụp đúng cái này.
            ⚠ TẤT CẢ màu = inline hex/rgb (sRGB), KHÔNG class màu Tailwind v4 (compute oklch → html-to-image trắng xóa). */}
        <div
          ref={cardRef}
          style={{
            margin: '0 auto', width: 440, maxWidth: '100%', overflow: 'hidden', borderRadius: 16,
            background: '#ffffff', color: '#1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          }}
        >
          <div style={{ background: 'linear-gradient(90deg, #E91E8C 0%, #F7941E 50%, #2D9CDB 100%)', padding: '16px 20px', color: '#ffffff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.9 }}>BK Academy</div>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15 }}>Kết quả ET — Lớp {lop || '—'}</div>
            <div style={{ fontSize: 12, opacity: 0.95 }}>Ngày {ngayVN} · {coMat.length} học sinh</div>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#64748b' }}>
                  <th style={{ borderBottom: '2px solid #e2e8f0', padding: '6px 4px', textAlign: 'left', fontWeight: 600 }}>Học sinh</th>
                  {probs.map((p) => <th key={p.id} style={{ borderBottom: '2px solid #e2e8f0', padding: '6px 4px', textAlign: 'center', fontWeight: 600 }}>B{p.problem_no}</th>)}
                </tr>
              </thead>
              <tbody>
                {coMat.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 4px', fontWeight: 500, color: '#1e293b' }}>{r.hoc_sinh?.ho_ten ?? '?'}</td>
                    {probs.map((p) => {
                      const kq = gradeOf(p.id, r.hoc_sinh_id)?.result
                      const v = kq ? ET_KQ_PH[kq] : null
                      return (
                        <td key={p.id} style={{ padding: '6px 4px', textAlign: 'center' }}>
                          {v
                            // Badge = SVG (circle + text dominant-baseline=central) → html2canvas render qua engine trình duyệt = căn tâm pixel-perfect.
                            // (line-height/nudge KHÔNG chắc ăn: html2canvas đặt baseline lệch + bỏ qua position:relative inline.)
                            ? <Badge hex={v.hex} letter={v.l} size={24} />
                            : <span style={{ color: '#cbd5e1' }}>–</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, fontSize: 10.5, color: '#64748b' }}>
              {Object.values(ET_KQ_PH).map((v) => (
                <span key={v.l} style={{ display: 'inline-block', marginRight: 12, whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <Badge hex={v.hex} letter={v.l} size={16} /><span style={{ marginLeft: 4 }}>{v.mo_ta}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '10px 20px', textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>BK Academy · Tel : 0963.209.309 · 17A10 KĐT Geleximco</div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── CHẤM BTVN (buổi sau): câu Đ/C/S như ET (THAM KHẢO, không mastery/Elo) + trạng thái nộp + thái độ + báo động ──
const NOP_OPTS: { v: BtvnTrangThai; l: string }[] = [
  { v: 'nop_dung_han', l: 'Nộp đúng hạn' }, { v: 'nop_muon', l: 'Nộp muộn' }, { v: 'xin_phep', l: 'Đã xin phép' }, { v: 'khong_lam', l: 'Không làm bài' },
]
const THAIDO_OPTS: { v: BtvnThaiDo; l: string }[] = [
  { v: 'nghiem_tuc', l: 'Nghiêm túc' }, { v: 'chua_het_suc', l: 'Chưa hết sức' }, { v: 'chua_nghiem_tuc', l: 'Chưa nghiêm túc' }, { v: 'chong_doi', l: 'Chống đối' },
]
function BtvnTab({ buoiId, roster, buoi, dangOpts, onChange }: { buoiId: string; roster: BuoiHocHS[]; buoi: BuoiHoc; dangOpts: DangOpt[]; onChange: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [missing, setMissing] = useState(false)
  const [kq, setKq] = useState<Record<string, BtvnKQ>>({})
  const [cb, setCb] = useState<CanhBao[]>([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [alertFor, setAlertFor] = useState<string | null>(null) // hsId đang mở popup báo động
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const dong = !!buoi.btvn_dong_at
  const tenDang = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : '—')
  const dangBuoi = [...new Set(probs.map((p) => p.ma_dang).filter(Boolean))] as string[] // dạng có trong BTVN (cho báo động)

  async function reloadP() { const [p, g] = await Promise.all([listProblems(buoiId, 'btvn'), listGrades(buoiId)]); setProbs(p); setGrades(g) }
  async function reloadKq() { setKq(await getBtvnKetQua(buoiId)); setCb(await listCanhBao(buoiId)) }
  useEffect(() => { (async () => {
    setLoading(true)
    try {
      const { btvnId, caus } = await loadBTVNForBuoi(buoiId)
      if (!btvnId) setMissing(true)
      else { setMissing(false); await ensureBTVNProblems(buoiId, caus) }
      await reloadP(); await reloadKq()
    } catch { setMissing(true) } finally { setLoading(false) }
  })() }, [buoiId]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function pickKQ(pid: string, hsId: string, result: ETResult) {
    const g = gradeOf(pid, hsId)
    try { if (g?.result === result) await deleteGrade(pid, hsId); else await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: [] }); await reloadP() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function setKQField(hsId: string, patch: Partial<BtvnKQ>) {
    setKq((m) => { const base = m[hsId] ?? { trang_thai_nop: null, thai_do: null }; return { ...m, [hsId]: { ...base, ...patch } } })
    try { await setBtvnKetQua(buoiId, hsId, patch) } catch (e: any) { alert(e.message ?? String(e)); reloadKq() }
  }
  async function dong_() {
    if (closing) return
    if (!confirm('Đóng BTVN? Sẽ thưởng EXP hoàn thành theo trạng thái nộp.')) return
    setClosing(true)
    try { const r = await closeBTVN(buoiId); if (r.already) alert('BTVN đã đóng.'); else { alert(`Đã đóng BTVN — thưởng EXP cho ${r.thuong} HS.`); onChange() } }
    finally { setClosing(false) }
  }

  if (loading) return <p className="text-[12px] text-slate-400">Đang tải BTVN…</p>
  if (missing) return <p className="text-[13px] text-slate-400">Chưa có BTVN cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Trích xuất BTVN từ giáo trình hoặc tạo BTVN cho lớp+ngày của buổi rồi quay lại.</p>
  if (dong) return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">✓ BTVN đã đóng — đã thưởng EXP hoàn thành.</span>
        <button onClick={async () => { if (!confirm('Mở lại BTVN để sửa? EXP đã thưởng sẽ hoàn lại.')) return; await reopenBTVN(buoiId); onChange() }} className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Mở lại để sửa</button>
      </div>
      {cb.length > 0 && <p className="text-[12px] text-slate-500">Báo động đã gửi: {cb.length} (HS kém dạng).</p>}
    </div>
  )
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt”.</p>

  const cbOf = (hsId: string) => cb.filter((x) => x.hoc_sinh_id === hsId)
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu (từ BTVN) · {coMat.length} HS · chấm <b className="text-emerald-600">Đ</b>/<b className="text-amber-600">C</b>/<b className="text-rose-600">S</b> (tham khảo) · 🚨 báo động kém dạng.</span>
        <button onClick={dong_} disabled={closing} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{closing ? 'Đang đóng…' : 'Đóng BTVN'}</button>
      </div>
      <div className="overflow-auto rounded-xl border border-slate-200">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 z-10 min-w-[260px] border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700">Học sinh · Trạng thái · Thái độ</th>
              {probs.map((p) => (
                <th key={p.id} className="min-w-[120px] border border-slate-200 px-2 py-2 text-center align-top">
                  <div className="text-[12px] font-bold text-slate-700">Câu {p.problem_no}</div>
                  <div className="mx-auto max-w-[150px] truncate text-[11px] font-medium normal-case text-violet-600" title={tenDang(p.ma_dang)}>{tenDang(p.ma_dang)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r) => {
              const v = kq[r.hoc_sinh_id] ?? { trang_thai_nop: null, thai_do: null }
              return (
                <tr key={r.id} className="align-top">
                  <td className="sticky left-0 z-10 border border-slate-200 bg-white px-3 py-2">
                    <div className="font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</div>
                    <div className="mt-1.5 flex flex-col gap-1">
                      <select value={v.trang_thai_nop ?? ''} onChange={(e) => setKQField(r.hoc_sinh_id, { trang_thai_nop: e.target.value || null })} className="h-7 rounded border border-slate-300 px-1 text-[12px]">
                        <option value="">— trạng thái nộp —</option>{NOP_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                      <select value={v.thai_do ?? ''} onChange={(e) => setKQField(r.hoc_sinh_id, { thai_do: e.target.value || null })} className="h-7 rounded border border-slate-300 px-1 text-[12px]">
                        <option value="">— thái độ —</option>{THAIDO_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                      <div className="flex flex-wrap items-center gap-1">
                        <button onClick={() => setAlertFor(r.hoc_sinh_id)} disabled={!dangBuoi.length} className="rounded border border-rose-200 px-1.5 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40" title="Báo động: HS kém 1 dạng">🚨 Báo động</button>
                        {cbOf(r.hoc_sinh_id).map((c) => (
                          <span key={c.id} className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700" title={c.ghi_chu ?? ''}>{tenDang(c.ma_dang)}<button onClick={async () => { await xoaCanhBao(c.id); reloadKq() }} className="text-rose-400 hover:text-rose-700">✕</button></span>
                        ))}
                      </div>
                    </div>
                  </td>
                  {probs.map((p) => {
                    const g = gradeOf(p.id, r.hoc_sinh_id)
                    return (
                      <td key={p.id} className="border border-slate-200 px-2 py-2">
                        <div className="flex justify-center gap-1.5">
                          {ET_KQ.map((k) => (
                            <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)} className={`h-8 w-9 rounded-lg border text-[13px] font-bold transition ${g?.result === k.v ? k.sel : k.idle}`}>{k.lbl}</button>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {alertFor && (
        <AlertModal buoiId={buoiId} hocSinhId={alertFor} hsTen={coMat.find((r) => r.hoc_sinh_id === alertFor)?.hoc_sinh?.ho_ten ?? '?'}
          dangBuoi={dangBuoi} tenDang={tenDang} onClose={() => setAlertFor(null)} onSaved={() => { setAlertFor(null); reloadKq() }} />
      )}
    </div>
  )
}
// Popup báo động: chọn dạng HS kém + ghi chú → themCanhBao.
function AlertModal({ buoiId, hocSinhId, hsTen, dangBuoi, tenDang, onClose, onSaved }: {
  buoiId: string; hocSinhId: string; hsTen: string; dangBuoi: string[]; tenDang: (md: string | null) => string; onClose: () => void; onSaved: () => void
}) {
  const [maDang, setMaDang] = useState(dangBuoi[0] ?? '')
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  async function luu() { if (!maDang) return; setBusy(true); try { await themCanhBao({ buoiId, hocSinhId, maDang, ghiChu: ghiChu.trim() || undefined }); onSaved() } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) } }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-[14px] font-semibold text-slate-900">🚨 Báo động: <b>{hsTen}</b> đang kém dạng</div>
        <p className="mb-2 text-[12px] text-slate-400">Tín hiệu này KHÔNG vào điểm — là phán đoán của bạn để hệ thống biết HS cần hỗ trợ.</p>
        <select value={maDang} onChange={(e) => setMaDang(e.target.value)} className="mb-2 h-9 w-full rounded-md border border-slate-300 px-2 text-[13px]">
          {dangBuoi.map((md) => <option key={md} value={md}>{tenDang(md)}</option>)}
        </select>
        <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (tuỳ): kém chỗ nào…" className="mb-3 h-20 w-full rounded-md border border-slate-300 px-2 py-1 text-[13px]" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={luu} disabled={busy || !maDang} className="rounded-md bg-rose-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">{busy ? 'Đang gửi…' : 'Gửi báo động'}</button>
        </div>
      </div>
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
function DanhGiaTab({ buoiId, roster, dangOpts, buoi, onChange }: { buoiId: string; roster: BuoiHocHS[]; dangOpts: DangOpt[]; buoi: BuoiHoc; onChange: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [data, setData] = useState<Record<string, DanhGiaHS>>({})
  const [loading, setLoading] = useState(true)
  const xong = !!buoi.danh_gia_xong_at
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
      <div className="mb-2 flex items-center gap-2">
        {xong
          ? <><span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">✓ Đã hoàn thành đánh giá</span>
              <button onClick={async () => { await moLaiDanhGia(buoiId); onChange() }} className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Mở lại để sửa</button></>
          : <button onClick={async () => { await dongDanhGia(buoiId); onChange() }} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">✓ Hoàn thành đánh giá</button>}
      </div>
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
