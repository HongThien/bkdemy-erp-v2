import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
// (Ảnh gửi PH dùng html2canvas tải từ CDN TRONG popup — đúng pattern V1, không import vào bundle.)
import {
  buoiAoCuaNgay, moBuoi, getBuoi, huyBuoi, huyBuoiCuaNgay, setNguoiDay,
  getRoster, diemDanh, markBaoDen, xoaHSKhoiBuoi, dongBoSiSo, listProblems, addProblem, setProblemDang, ensureProblems, listGrades, gradeMuc, closePhase,
  loadETForBuoi, syncDocProblems, xepLuoiTheoDe, gradeET, deleteGrade, reopenPhase,
  loadBTVNForBuoi, syncBTVNProblems, getBtvnKetQua, setBtvnKetQua, listCanhBao, themCanhBao, xoaCanhBao, closeBTVN, reopenBTVN,
  type BtvnKQ, type CanhBao, type BtvnTrangThai, type BtvnThaiDo,
  getDanhGia, setDanhGiaDang, setNhanXet, setHoanThanhPct, HOAN_THANH_PCT_OPTS, dongDanhGia, moLaiDanhGia, setNoiDungBuoi,
  loadLiveTestForBuoi, getDangTen, loadMTForBuoi, syncMTProblems,
  type BuoiAo, type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type Phase, type DiemDanh, type DanhGiaHS, type DanhGiaDiem, type TabKey, type ETResult, type LuoiSync,
} from '../../lib/gami'
import { getLiveSnapshot, type BaiTest, type BaiTestCau, type BaiLam, type LiveAnswer } from '../../lib/testonline'
import type { MTPhanCaus } from '../../lib/mt'
import { getOrCreateKyThiMTChoBuoi, listDiemThiByKyThi, upsertDiemThi, currentMua, type KyThi, type DiemThi, type Verdict } from '../../lib/thanhtich'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listDaiDang, type CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import DangPickerOne from '../../components/DangPickerOne'
import { useIsMobile } from '../../hooks/useIsMobile'
import { tenHienThiDs, tenNganHS } from '../../lib/hoten'
import { useStore } from '../../store/useStore'

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
  const [open, setOpen] = useState<{ id: string; lopId: string } | null>(null)
  const [filter, setFilter] = useState<BuoiStatus>('chua')
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const myMons = me?.mons ?? []
  // Team ops điểm danh LIÊN MÔN (spine vận hành) — KHÔNG được quyết bởi `nhan_su_mon` (đó là chiều
  // scope④ gate KHO/tài liệu cho GV/TA, khác hẳn). Ops được backfill `nhan_su_mon='Toán'` mặc định
  // (06-29, cho MỌI nhân sự) vẫn phải thấy hết — suy trực tiếp từ biên chế team, giống `opsToanHe`
  // ở nhansu.ts `getMyScope()` (Thùy báo lỗi 07-15: lớp KHTN biến mất khỏi Buổi học của ops).
  const laOps = (me?.teams ?? []).some((t) => t.ma === 'ops')
  // OPS/người ngoài lớp không có việc "chấm bài như TA" — chỉ GV/TG của CHÍNH lớp đó (hoặc admin) mới
  // thấy đủ 4 tab; còn lại (OPS quản lý buổi qua leaf "Buổi học") chỉ thấy Điểm danh (đúng việc của họ).
  const myLopIds = new Set((me?.phanCong ?? []).map((pc) => pc.lop_id))

  async function reload() {
    setLoading(true); setErr(null)
    try { setList(await buoiAoCuaNgay(ngay)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [ngay]) // eslint-disable-line

  if (open) {
    const tabs = laAdmin || myLopIds.has(open.lopId) ? undefined : (['diemdanh'] as TabKey[])
    return <BuoiDetail id={open.id} tabs={tabs} onClose={() => { setOpen(null); reload() }} />
  }

  // Scope MÔN: GV/TA có môn → chỉ buổi môn mình; Ops/admin/chưa-gán-môn → thấy TẤT (điểm danh liên-môn).
  const view = (laAdmin || laOps || myMons.length === 0) ? list : list.filter((ba) => myMons.includes(ba.lop.mon))
  const cnt: Record<BuoiStatus, number> = { chua: 0, mo: 0, huy: 0 }
  for (const ba of view) cnt[statusOf(ba.buoi)]++
  const shown = view.filter((ba) => statusOf(ba.buoi) === filter)
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
          : view.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">{list.length > 0 && myMons.length > 0 ? `Không có buổi môn ${myMons.join('/')} ngày này.` : 'Không có buổi nào theo TKB ngày này (kiểm tra TKB + ngày khai giảng).'}</div>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có buổi “{FILTERS.find((f) => f.v === filter)?.lbl}” ngày này.</div>
          : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {shown.map((b) => <BuoiCard key={b.lop.id} ba={b} ngay={ngay} onOpened={(id, lopId) => setOpen({ id, lopId })} onChanged={reload} />)}
            </div>
          )}
      </div>
    </div>
  )
}

function BuoiCard({ ba, ngay, onOpened, onChanged }: { ba: BuoiAo; ngay: string; onOpened: (id: string, lopId: string) => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const b = ba.buoi
  const st = statusOf(b)
  const gio = `${ba.slot.gio_bat_dau?.slice(0, 5)}–${ba.slot.gio_ket_thuc?.slice(0, 5)}${ba.slot.phong ? ` · ${ba.slot.phong}` : ''}`
  async function open() {
    setBusy(true)
    try { const buoi = await moBuoi(ba.lop.id, ngay, ba.slot); onOpened(buoi.id, ba.lop.id) }
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
    <button onClick={() => onOpened(b!.id, ba.lop.id)} className="rounded-xl border border-indigo-300 bg-indigo-50/40 p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50">
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
// onlyHsId: chỉ hiện 1 HS (từ màn "Kết quả học tập" khi lọc theo học sinh) → lọc roster còn đúng em đó.
export function BuoiDetail({ id, onClose, tabs, initialTab, canManage = true, onlyHsId }: { id: string; onClose: () => void; tabs?: TabKey[]; initialTab?: TabKey; canManage?: boolean; onlyHsId?: string | null }) {
  const [buoi, setBuoi] = useState<(BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi?: string | null }; gv_chinh_id?: string | null }) | null>(null)
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [dsNS, setDsNS] = useState<NhanSu[]>([])
  const [dangOpts, setDangOpts] = useState<DangOpt[]>([])
  // 'live' KHÔNG phải TabKey (đó là task-scope engine getMyTasks/dashboard — xem live không phải "task"
  // có deadline/nghiệm thu) → chỉ mở rộng union CỤC BỘ ở đây, không đụng TabKey dùng chung.
  const [tab, setTab] = useState<TabKey | 'live'>(initialTab ?? tabs?.[0] ?? 'diemdanh')
  const isMobile = useIsMobile()

  async function reload() {
    const [b, r, ns] = await Promise.all([getBuoi(id), getRoster(id), listNhanSu()])
    setBuoi(b); setRoster(onlyHsId ? r.filter((x) => x.hoc_sinh_id === onlyHsId) : r); setDsNS(ns)
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
            {([['diemdanh', `Điểm danh (${soCoMat}/${roster.length})`], ['danhgia', 'Đánh giá sau buổi'], ['ingame', 'Chấm bài trên lớp'], ['et', 'ET'], ['btvn', 'BTVN'], ['mt', '🏆 MT']] as const).filter(([k]) => !tabs || tabs.includes(k)).map(([k, lbl]) => (
              <button key={k} onClick={() => setTab(k as any)} className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
            ))}
            {/* "Xem live" không phải task-scope tab (không có deadline/nghiệm thu) → chỉ hiện ở view ĐỦ (tabs=undefined,
                giống Ops/admin/GV-lớp-mình mở từ "Buổi học"), KHÔNG hiện khi mở từ task 1-tab của "Việc của tôi". */}
            {!tabs && (
              <button onClick={() => setTab('live')} className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium ${tab === 'live' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>👁 Xem live</button>
            )}
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
              : tab === 'mt'
              ? <MTTab buoiId={id} roster={roster} buoi={buoi} onChange={reload} />
              : tab === 'live'
              ? <LiveTab buoiId={id} roster={roster} />
              : <ChamTab buoiId={id} phase="ingame" roster={roster} buoi={buoi} dangOpts={dangOpts} onChange={reload} />}
          </div>
        </>
      )}
    </div>
  )
}

function DiemDanhTab({ roster, chuaDD, canManage, onChange }: { roster: BuoiHocHS[]; chuaDD: number; canManage: boolean; onChange: () => void }) {
  const [baoDen, setBaoDen] = useState(false)
  const chuaBao = roster.filter((r) => r.diem_danh === 'co_mat' && !r.bao_den_at) // co_mat & chưa báo PH
  // 2 HS trùng tên rút gọn (2 từ cuối) trong CÙNG roster → bung đủ họ tên cả 2 (Thùy 07-06).
  const tenHT = tenHienThiDs(roster.map((r) => r.hoc_sinh?.ho_ten))
  async function xoa(r: BuoiHocHS) {
    if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi này?\n\nChỉ dùng khi xếp NHẦM lớp (data sai). Sẽ chặn nếu HS đã có bài chấm / điểm thật.`)) return
    try { await xoaHSKhoiBuoi(r); onChange() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button onClick={() => { onChange(); setBaoDen(true) }}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500"
          title="Sinh tin nhắn “… đã đến” cho HS mới điểm danh có mặt (không lặp người đã báo)">📩 Báo đến PH{chuaBao.length ? ` (${chuaBao.length})` : ''}</button>
        {chuaDD > 0 && <span className="text-[12px] text-amber-600">Còn {chuaDD} HS chưa điểm danh.</span>}
      </div>
      {baoDen && <BaoDenModal roster={roster} onClose={() => setBaoDen(false)} onDone={onChange} />}
      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 2xl:grid-cols-3">
        {roster.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-800">{tenHT[i]}</span>
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

// Tin báo PH "… đã đến": chỉ gồm HS có mặt CHƯA báo (bao_den_at NULL). Copy xong → đánh dấu đã báo
// (markBaoDen set khi còn NULL) → lần bấm sau chỉ còn HS mới đến. State ở DB nên reload/đổi máy vẫn nhớ.
function BaoDenModal({ roster, onClose, onDone }: { roster: BuoiHocHS[]; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const chuaBao = roster.filter((r) => r.diem_danh === 'co_mat' && !r.bao_den_at)
  const daBao = roster.filter((r) => r.diem_danh === 'co_mat' && r.bao_den_at)
  // Tên = 2 từ CUỐI (vd "Nguyễn Thị Hồng Anh" → "Hồng Anh").
  const ten = (r: BuoiHocHS) => (r.hoc_sinh?.ho_ten ?? '?').trim().split(/\s+/).slice(-2).join(' ')
  const dsTen = chuaBao.map(ten).join(', ')
  // Tin ĐẦU (chưa ai được báo) = câu xác nhận đầy đủ; các tin SAU = câu ngắn.
  const msg = !chuaBao.length ? '' : daBao.length ? `${dsTen} đã đến lớp.` : `Trung tâm xác nhận buổi học hôm nay đã có ${dsTen} đã đến lớp.`

  async function copyAndMark() {
    if (!chuaBao.length || busy) return
    setBusy(true)
    try {
      try { await navigator.clipboard.writeText(msg) } catch { /* clipboard bị chặn → OPS copy tay từ ô */ }
      await markBaoDen(chuaBao.map((r) => r.id))
      setCopied(true); onDone()
      setTimeout(onClose, 700)
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[440px] max-w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-slate-900">📩 Tin báo phụ huynh</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {chuaBao.length === 0 ? (
          <div className="rounded-lg bg-slate-50 px-3 py-6 text-center text-[13px] text-slate-400">
            {daBao.length ? 'Tất cả HS có mặt đều đã được báo đến. Chưa có HS mới.' : 'Chưa có HS nào điểm danh “có mặt”.'}
          </div>
        ) : (
          <>
            <p className="mb-2 text-[12px] text-slate-500">{chuaBao.length} HS mới đến{daBao.length ? ` · ${daBao.length} đã báo trước đó` : ''}:</p>
            <textarea readOnly value={msg} rows={3} onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] leading-relaxed text-slate-800" />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={onClose} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Đóng</button>
              <button onClick={copyAndMark} disabled={busy}
                className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{copied ? '✓ Đã copy & đánh dấu' : busy ? '…' : 'Copy & đánh dấu đã gửi'}</button>
            </div>
          </>
        )}
        {daBao.length > 0 && (
          <details className="mt-3 text-[12px] text-slate-400">
            <summary className="cursor-pointer select-none hover:text-slate-600">Đã báo đến trước đó ({daBao.length})</summary>
            <div className="mt-1 leading-relaxed">{daBao.map(ten).join(', ')}</div>
          </details>
        )}
      </div>
    </div>, document.body)
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
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten)) // 2 HS trùng tên rút gọn → bung đủ (Thùy 07-06)
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
    try { const res = await closePhase(buoiId, phase); if (res.already) alert('Đã xác nhận rồi.'); else { if (res.khongCoDuLieu) alert('Đã đóng, nhưng KHÔNG tính Elo/EXP — chưa chấm ô nào. Muốn tính thì Mở lại, chấm rồi xác nhận lại.'); onChange() } }
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
      <div className="rounded-xl border border-slate-200">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-30 border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700">Học sinh</th>
              {probs.map((p) => (
                <th key={p.id} className="sticky top-0 z-10 min-w-[150px] border border-slate-200 bg-slate-100 px-2 py-2 text-center align-top">
                  <div className="text-[12px] font-bold text-slate-700">Bài {p.problem_no}</div>
                  <button onClick={() => setDangPick(p.id)} title="Chọn dạng cho bài này"
                    className={`mx-auto mt-1 block max-w-[140px] truncate rounded border px-2 py-0.5 text-[11px] font-medium ${p.ma_dang ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-dashed border-slate-300 text-slate-400 hover:border-indigo-400'}`}>{tenDang(p.ma_dang) ?? '+ chọn dạng'}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => (
              <tr key={r.id}>
                <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-2 text-left align-middle font-medium text-slate-800">{tenHT[i]}</td>
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
  // Tên gọn = 2 từ cuối; 2 HS trùng tên rút gọn trong CÙNG coMat → bung đủ cả 2 (Thùy 07-06).
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten))

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
        {coMat.map((r, i) => {
          const g = gradeOf(cur.id, r.hoc_sinh_id)
          return (
            <div key={r.id} className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 ${g ? 'border-slate-200' : 'border-amber-200'}`}>
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-slate-800">{tenHT[i]}</span>
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
  const [sync, setSync] = useState<LuoiSync | null>(null) // kết quả bám đề của lưới (xem syncDocProblems)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten)) // 2 HS trùng tên rút gọn → bung đủ (Thùy 07-06)
  const dongCol = buoi.et_dong_at

  // Lưới hiển thị THEO THỨ TỰ ĐỀ (khớp ô↔câu qua ma_cau), không theo problem_no — xem syncDocProblems.
  const causRef = useRef<CauHoi[]>([])
  async function reloadP() {
    const [p, g] = await Promise.all([listProblems(buoiId, 'et'), listGrades(buoiId)])
    setProbs(xepLuoiTheoDe(p, causRef.current)); setGrades(g)
  }
  useEffect(() => { (async () => {
    setLoading(true)
    try {
      const { etId, caus } = await loadETForBuoi(buoiId)
      causRef.current = caus
      if (!etId) { setEtMissing(true); setEtCaus([]); setSync(null); await reloadP(); return }
      setEtMissing(false); setEtCaus(caus)
      // Sync CHỦ ĐỘNG mỗi lần mở tab — lưới tự bám đề. Phase đã đóng thì chỉ báo, không sửa lén.
      const s = await syncDocProblems(buoiId, 'et', caus, !!buoi.et_dong_at)
      setSync(s); setProbs(s.probs)
      setGrades(await listGrades(buoiId))
    } catch { setEtMissing(true); setEtCaus([]); setSync(null) } finally { setLoading(false) }
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
    try { const res = await closePhase(buoiId, 'et'); if (res.already) alert('Đã xác nhận rồi.'); else { if (res.khongCoDuLieu) alert('Đã đóng, nhưng KHÔNG tính Elo/EXP — chưa chấm ô nào. Muốn tính thì Mở lại, chấm rồi xác nhận lại.'); onChange() } }
    finally { setClosing(false) }
  }
  async function moLai() { await reopenPhase(buoiId, 'et'); onChange() }

  if (loading) return <p className="text-[12px] text-slate-400">Đang tải ET…</p>
  if (etMissing) return <p className="text-[13px] text-slate-400">Chưa có ET cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Vào <b className="text-slate-600">Làm tài liệu → ET</b> tạo ET đúng lớp + ngày của buổi rồi quay lại.</p>
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt” — điểm danh trước khi chấm.</p>

  const tenDang = (md: string | null) => (md ? dangOpts.find((d) => d.ma_dang === md)?.ten ?? md : '—')
  // Đề của 1 ô = tra theo MÃ CÂU (không theo vị trí) — ô mồ côi thì không có đề, đúng bản chất.
  const cauOf = (p: Problem) => etCaus?.find((c) => c.ma_cau === p.ma_cau) ?? null
  const moCoiIds = new Set((sync?.moCoi ?? []).map((m) => m.problem.id))

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu (từ ET) · {coMat.length} HS · 1 click <b className="text-emerald-600">Đ</b>/<b className="text-amber-600">C</b>/<b className="text-rose-600">S</b> — C/S mở ô lỗi.</span>
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
      {anhPH && <EtAnhGuiPH buoiId={buoiId} coMat={coMat} probs={probs} gradeOf={gradeOf} buoi={buoi} onClose={() => setAnhPH(false)} />}

      {/* Lưới KHÔNG khớp đề — 3 tình huống, mỗi cái nói rõ mất gì / phải làm gì. Im lặng là điều DUY
          NHẤT không được phép ở đây (bug 07-21: lệch âm thầm suốt từ 20/07 tới lúc Thùy tự phát hiện). */}
      {sync?.doiCauTruc && (
        <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
          ⚠️ Đề ET đã đổi sau khi ET được xác nhận — lưới chấm giữ nguyên theo lúc chấm (Elo đã tính).
          Muốn lưới bám đề mới thì bấm <b>↩ Mở lại để sửa</b>, hệ sẽ tự đồng bộ.
        </div>
      )}
      {sync?.khongRoRang === 'lech_so' && (
        <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
          ⚠️ Lưới chấm này có từ trước bản vá 07-21 và <b>số ô ({probs.length}) khác số câu trong đề ({etCaus?.length ?? 0})</b>
          {' '}— hệ <b>không tự đoán</b> ô nào ứng câu nào để khỏi gắn điểm sai dạng. Cần người đối chiếu đề giấy rồi quyết.
        </div>
      )}
      {sync?.khongRoRang === 'lech_dang' && (
        <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
          ⚠️ Số ô và số câu bằng nhau, nhưng <b>dạng của ô không khớp dạng của câu</b> — nghĩa là đề đã bị
          {' '}<b>thay/bớt câu ở giữa</b> sau khi chấm, ô không còn ứng đúng câu nữa. Hệ <b>không đoán</b> để khỏi gắn
          {' '}điểm sai dạng (điểm vẫn giữ nguyên). Cần đối chiếu đề giấy đã phát cho HS rồi quyết.
        </div>
      )}
      {!!sync?.moCoi.length && (
        <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
          ⚠️ {sync.moCoi.length} ô có điểm nhưng câu tương ứng <b>đã bị bỏ khỏi đề</b>
          {' '}({sync.moCoi.map((m) => `câu ${m.problem.problem_no}: ${m.soDiem} điểm`).join(' · ')}).
          {' '}Điểm được <b>giữ nguyên</b>, ô xếp cuối bảng. Muốn bỏ hẳn thì xoá từng ô điểm trước.
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
        <table className="w-auto border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-30 whitespace-nowrap border border-slate-200 bg-slate-100 px-4 py-1.5 text-left text-[12px] font-semibold text-slate-700">Học sinh</th>
              {probs.map((p, idx) => {
                const c = cauOf(p)
                const moCoi = moCoiIds.has(p.id)
                return (
                  <th key={p.id} className={`sticky top-0 z-10 w-[150px] border border-slate-200 px-2 py-1.5 text-center align-top ${moCoi ? 'bg-rose-50' : 'bg-slate-100'}`}>
                    {/* Số câu = VỊ TRÍ TRONG ĐỀ (probs đã xếp theo đề), KHÔNG phải problem_no —
                        problem_no giờ chỉ là slot nội bộ, có thể thủng số sau khi bỏ/thêm câu. */}
                    <div className="text-[12px] font-bold text-slate-700">{moCoi ? 'Ngoài đề' : `Câu ${idx + 1}`}</div>
                    <div className="mx-auto max-w-[140px] truncate text-[11px] font-medium normal-case text-violet-600" title={tenDang(p.ma_dang)}>{tenDang(p.ma_dang)}</div>
                    {c && <button onClick={() => setPreview(c)} className="mt-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-normal normal-case text-slate-400 hover:border-indigo-300 hover:text-indigo-600">ⓘ đề</button>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => (
              <tr key={r.id}>
                <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-1 text-left align-middle font-medium text-slate-800">{tenHT[i]}</td>
                {probs.map((p) => {
                  const g = gradeOf(p.id, r.hoc_sinh_id)
                  const isEditing = editing?.problemId === p.id && editing?.hsId === r.hoc_sinh_id
                  const hasProblem = !!g && (g.result === 'partial' || g.result === 'wrong')
                  return (
                    <td key={p.id} className="border border-slate-200 px-2 py-1 align-middle">
                      <div className="flex justify-center gap-1">
                        {ET_KQ.map((k) => (
                          <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)} disabled={!!dongCol}
                            className={`h-7 w-8 rounded-lg border text-[13px] font-bold transition disabled:cursor-not-allowed ${g?.result === k.v ? k.sel : k.idle} ${dongCol && g?.result !== k.v ? 'opacity-50' : ''}`}>{k.lbl}</button>
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
// Màu (Thùy 07-19 lần 2: bản dịu trước "u ám" quá — tươi lên 1 nấc, vẫn giữ đúng hue-mapping xanh=Đ/cam=C/đỏ=S,
// không quay lại mức chói neon #10b981/#f59e0b/#f43f5e của bản gốc).
const ET_KQ_PH: Record<string, { l: string; hex: string; mo_ta: string }> = {
  correct: { l: 'Đ', hex: '#3fa172', mo_ta: 'Đúng' },
  partial: { l: 'C', hex: '#e2984a', mo_ta: 'Trình bày chưa hoàn thiện' },
  wrong: { l: 'S', hex: '#d6604a', mo_ta: 'Chưa biết làm' },
}
// Badge tròn Đ/C/S = SVG (circle + text căn tâm bằng dominant-baseline) → html2canvas render qua engine trình duyệt = pixel-perfect, KHỎI căn tay.
// Rút "2 chữ cuối" CHỈ cho câu kết luận cuối ảnh gửi PH (Thùy 07-19: "Đào Minh Quân" → "Minh Quân") — KHÁC
// tenHienThiDs (lib/hoten.ts, đã đảo về full-name 07-07 vì trùng tên gây nhầm khi DÙNG ĐỂ ĐỊNH DANH). Ở đây
// chỉ là câu văn ngắn gọn cho gọn ảnh, không phải định danh — chấp nhận trùng-tên-ngắn giữa 2 HS khác nhau.
function ten2TuCuoi(hoTen: string): string {
  const w = hoTen.trim().split(/\s+/)
  return w.slice(-2).join(' ')
}
function Badge({ hex, letter, size }: { hex: string; letter: string; size: number }) {
  const c = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx={c} cy={c} r={c} fill={hex} />
      {/* Chữ to hơn, vòng tròn giữ nguyên (Thùy 07-19): 0.52 → 0.64 tỉ lệ so với size. */}
      <text x={c} y={c} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.64} fontWeight={700} fill="#ffffff"
        fontFamily='system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'>{letter}</text>
    </svg>
  )
}
function EtAnhGuiPH({ buoiId, coMat, probs, gradeOf, buoi, onClose }: {
  buoiId: string; coMat: BuoiHocHS[]; probs: Problem[]; gradeOf: (pid: string, hsid: string) => Grade | undefined; buoi: BuoiHoc; onClose: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  // Đánh giá sau buổi (nhận xét + % hoàn thành) — Thùy 07-16: hiện thêm trên ảnh gửi PH, NHƯNG chỉ khi
  // có ít nhất 1 HS có dữ liệu (logic "có thì hiện không thì thôi" — tránh card trống-không ai viết gì).
  const [dg, setDg] = useState<Record<string, DanhGiaHS>>({})
  useEffect(() => { getDanhGia(buoiId).then(setDg).catch(() => setDg({})) }, [buoiId])
  if (!coMat.length) return null
  const lop = (buoi as any).lop?.ten_lop ?? ''
  const ngayVN = buoi.ngay ? buoi.ngay.split('-').reverse().join('/') : ''
  const ngayVNNgan = ngayVN.split('/').slice(0, 2).join('/') // dd/mm, không năm — cho dòng góc "Báo cáo buổi học 16/07 - 6S2"
  // Tên trên ảnh (Thùy 07-19 lần 6): CHỈ 2 chữ cuối (vd "Chu Bảo Ngọc" → "Bảo Ngọc") — KHÁC tenHienThiDs
  // (lib/hoten.ts, cố tình full-name để tránh nhầm KHI ĐỊNH DANH trong hệ thống). Ảnh gửi PH không phải chỗ
  // định danh nên rút gọn OK, NHƯNG nếu 2 HS trùng "2 chữ cuối" (vd Chu Bảo Ngọc + Hồ Bảo Ngọc) → phải phân
  // biệt: hiện phần còn lại (họ/tên đệm) ở DÒNG DƯỚI, trong ngoặc, cỡ chữ nhỏ hơn.
  const tenNgan = coMat.map((r) => ten2TuCuoi(tenNganHS(r.hoc_sinh?.ho_ten)))
  const demTenNgan = new Map<string, number>()
  for (const t of tenNgan) demTenNgan.set(t, (demTenNgan.get(t) ?? 0) + 1)
  const tenHT = coMat.map((r, i) => {
    const full = tenNganHS(r.hoc_sinh?.ho_ten)
    const short = tenNgan[i]
    const trung = (demTenNgan.get(short) ?? 0) > 1
    const conLai = full.trim().split(/\s+/).slice(0, -2).join(' ')
    return { short, phanBiet: trung && conLai ? conLai : null }
  })
  const coNhanXet = coMat.some((r) => !!dg[r.hoc_sinh_id]?.nhan_xet?.trim())
  const coHoanThanh = coMat.some((r) => dg[r.hoc_sinh_id]?.hoanThanhPct != null)
  // Câu kết luận (Thùy 07-19): HS có ≥1 câu C/S (chưa đạt) → nêu tên (2 chữ cuối) nhắc làm lại/chép lại đáp
  // án. "có thì hiện không thì thôi" — buổi cả lớp toàn Đ thì khỏi câu này.
  const canLamLai = coMat
    .filter((r) => probs.some((p) => { const kq = gradeOf(p.id, r.hoc_sinh_id)?.result; return kq === 'partial' || kq === 'wrong' }))
    .map((r) => ten2TuCuoi(tenNganHS(r.hoc_sinh?.ho_ten)))
  // Test Cuối giờ: ≤5 câu = 1 dòng; ≥6 câu = CHIA ĐÔI ĐỀU 2 dòng (6→3-3, 7→4-3, 8→4-4...) — Thùy 07-19 lần 7:
  // lần trước hiểu nhầm "cho thành 1 dòng thôi" là bỏ luôn chia-2-dòng, thực ra ý là CHỈ đổi tên header cho
  // ngắn/khỏi wrap chữ "Kết quả Test cuối giờ" → "Test Cuối giờ" — lưới badge vẫn phải chia 2 dòng khi ≥6 câu.
  const ITEM_W = 26, NAME_W = 100, NX_W = 230, HT_W = 68
  const KQ_COLS = probs.length <= 5 ? Math.max(probs.length, 1) : Math.ceil(probs.length / 2)
  // Cột hẹp (lớp ít câu, vd 1-2 câu) vẫn phải đủ rộng để header "Test Cuối giờ" KHÔNG xuống dòng (Thùy
  // 07-19) — đặt sàn KQ_MIN_W, tính vào cardW luôn (không chỉ set width cho <th>, kẻo bị cắt bởi
  // overflow:hidden của card khi bảng auto-layout tự giãn rộng hơn cardW).
  const KQ_MIN_W = 120
  const KQ_W = Math.max(ITEM_W * KQ_COLS, KQ_MIN_W)
  const cardW = Math.max(420, NAME_W + KQ_W + (coNhanXet ? NX_W : 0) + (coHoanThanh ? HT_W : 0) + 32)
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
<title>Báo cáo tình hình buổi học - Lớp ${lop}</title>
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
            ⚠ TẤT CẢ màu = inline hex/rgb (sRGB), KHÔNG class màu Tailwind v4 (compute oklch → html-to-image trắng xóa).
            Tông màu (Thùy 07-19 lần 2): bản trước "u ám" quá — nền card vẫn TRẮNG là chính nhưng header đổi
            gradient navy SÁNG hơn (bớt gần-đen) + viền/badge lên tông ấm-tươi hơn cho có sức sống, không
            còn dịu-tới-mức-xỉn như bản cũ. */}
        <div
          ref={cardRef}
          style={{
            margin: '0 auto', width: cardW, overflow: 'hidden', borderRadius: 16,
            background: '#ffffff', color: '#2b3947', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          }}
        >
          {/* Header redesign (Thùy 07-19 lần 8): bỏ dòng "Ngày · N học sinh"; tiêu đề cũ "Báo cáo tình hình
              buổi học - Lớp X" THU NHỎ dồn lên góc phải làm nhãn phụ; NỘI DUNG BUỔI HỌC lên làm chữ TO NHẤT,
              căn giữa — vì đây mới là thứ PH cần đọc trước tiên. Mô tả (nếu có) ra khỏi banner, nằm dưới. */}
          <div style={{ background: 'linear-gradient(120deg, #2c5891 0%, #1e3a5f 100%)', borderBottom: '3px solid #d1963c', padding: '12px 20px 18px', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              {/* Logo thay chữ "BK Academy" (Thùy 07-19) — logo chữ xám đậm, KHÔNG đọc được trên nền navy →
                  bọc pill nền trắng cho đủ tương phản. Src TUYỆT ĐỐI (location.origin) — popup Copy ảnh mở
                  bằng window.open('','_blank') rồi document.write, KHÔNG có origin thật (about:blank) nên
                  path tương đối/root-relative sẽ vỡ (giống bài học PrintView.tsx logoUrl). */}
              <div style={{ background: '#ffffff', borderRadius: 6, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', lineHeight: 0 }}>
                <img src={`${location.origin}/Logo.png`} alt="BK Academy" style={{ height: 16, display: 'block' }} />
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, textAlign: 'right', whiteSpace: 'nowrap' }}>Báo cáo buổi học {ngayVNNgan} - {lop || '—'}</div>
            </div>
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              {buoi.noi_dung_buoi?.trim() ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, letterSpacing: '0.03em' }}>Nội dung buổi học</div>
                  <div style={{ marginTop: 2, fontSize: 23, fontWeight: 800, lineHeight: 1.2 }}>{buoi.noi_dung_buoi}</div>
                </>
              ) : (
                <div style={{ fontSize: 23, fontWeight: 800, lineHeight: 1.2 }}>{`Lớp ${lop || '—'}`}</div>
              )}
            </div>
          </div>
          {/* Mô tả — nội bộ (GV/TA), nằm NGOÀI banner, chữ nhỏ. Chỉ hiện nếu có nhập. */}
          {!!buoi.mo_ta?.trim() && <div style={{ padding: '8px 20px', fontSize: 11.5, color: '#5b6b78', background: '#f7f4ee', borderBottom: '1px solid #e7ddc9' }}>{buoi.mo_ta}</div>}
          <div style={{ padding: '12px 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                {/* 1 hàng header duy nhất (Thùy 07-19: bỏ B1..B6 — "6 cột là hiểu 6 bài", 2 tầng nhìn rối).
                    Tất cả <th> cùng padding/verticalAlign → cao bằng nhau, chữ căn giữa từng cột. */}
                <tr style={{ color: '#5b6b78' }}>
                  <th style={{ borderBottom: '2px solid #d1963c', padding: '6px 4px', textAlign: 'center', fontWeight: 600, verticalAlign: 'middle' }}>Học sinh</th>
                  <th style={{ borderBottom: '2px solid #d1963c', padding: '6px 4px', textAlign: 'center', fontWeight: 600, verticalAlign: 'middle', width: KQ_W, whiteSpace: 'nowrap' }}>Test Cuối giờ</th>
                  {/* Nhận xét + % vẫn 2 CỘT DỮ LIỆU riêng (Thùy 07-19: tách để dễ đọc), nhưng chỉ 1 HEADER GỘP
                      "Đánh giá của giáo viên" (colSpan) — khỏi phải viết riêng "Mức độ hoàn thành". */}
                  {(coNhanXet || coHoanThanh) && (
                    <th colSpan={(coNhanXet ? 1 : 0) + (coHoanThanh ? 1 : 0)} style={{ borderBottom: '2px solid #d1963c', padding: '6px 4px', textAlign: 'center', fontWeight: 600, verticalAlign: 'middle' }}>Đánh giá của giáo viên</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {coMat.map((r, i) => {
                  const nx = dg[r.hoc_sinh_id]?.nhan_xet?.trim()
                  const pct = dg[r.hoc_sinh_id]?.hoanThanhPct
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #e7ddc9' }}>
                      {/* Tên HS: 2 chữ cuối, 1 dòng; nếu trùng "2 chữ cuối" với HS khác trong lớp → thêm dòng
                          dưới (ngoặc, nhỏ hơn) ghi phần còn lại để phân biệt. Căn TRÁI (Thùy 07-19), giữa THEO CHIỀU HÀNG. */}
                      <td style={{ padding: '6px 4px', fontWeight: 500, color: '#2b3947', whiteSpace: 'nowrap', verticalAlign: 'middle', textAlign: 'left' }}>
                        <div>{tenHT[i].short}</div>
                        {tenHT[i].phanBiet && <div style={{ fontSize: 10.5, fontWeight: 400, color: '#8a94a3' }}>({tenHT[i].phanBiet})</div>}
                      </td>
                      {/* Test Cuối giờ = grid, số cột = KQ_COLS (≤5 câu 1 dòng, ≥6 câu chia đôi 2 dòng). */}
                      <td style={{ padding: '6px 4px', verticalAlign: 'top' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${KQ_COLS}, ${ITEM_W}px)`, rowGap: 4 }}>
                          {probs.map((p) => {
                            const kq = gradeOf(p.id, r.hoc_sinh_id)?.result
                            const v = kq ? ET_KQ_PH[kq] : null
                            return (
                              <div key={p.id} style={{ display: 'flex', justifyContent: 'center' }}>
                                {v
                                  // Badge = SVG (circle + text dominant-baseline=central) → html2canvas render qua engine trình duyệt = căn tâm pixel-perfect.
                                  // (line-height/nudge KHÔNG chắc ăn: html2canvas đặt baseline lệch + bỏ qua position:relative inline.)
                                  // Thu nhỏ 24→18 (Thùy 07-19: "giảm diện tích cho đỡ chật").
                                  ? <Badge hex={v.hex} letter={v.l} size={18} />
                                  : <span style={{ color: '#c9bfa6' }}>–</span>}
                              </div>
                            )
                          })}
                        </div>
                      </td>
                      {coNhanXet && (
                        <td style={{ padding: '6px 4px', textAlign: 'left', verticalAlign: 'top', color: '#5b6b78', fontSize: 12, whiteSpace: 'normal', wordBreak: 'break-word', width: NX_W }}>
                          {nx || <span style={{ color: '#c9bfa6' }}>–</span>}
                        </td>
                      )}
                      {/* % tách cột riêng ở CUỐI bảng (Thùy 07-19 lần 3). */}
                      {coHoanThanh && (
                        <td style={{ padding: '6px 4px', textAlign: 'center', fontWeight: 700, color: '#c8792a', verticalAlign: 'top' }}>
                          {pct != null ? `${pct}%` : <span style={{ color: '#c9bfa6', fontWeight: 400 }}>–</span>}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {/* 2 khối tách RÕ bằng viền mỏng thay vì nền đậm (Thùy 07-19 lần 3: "background dậm quá,
                chuyển về trắng cho sáng, chỉ cần đậm hơn 1 tẹo hoặc viền mỏng") — nền gần trắng, chỉ
                khác nhau ở màu VIỀN để vẫn phân biệt được 2 loại thông tin, không nặng mắt. */}
            <div style={{ marginTop: 12, borderRadius: 10, background: '#fdfcfa', border: '1px solid #e7ddc9', padding: '10px 12px', fontSize: 12.5, color: '#5b6b78' }}>
              {Object.values(ET_KQ_PH).map((v) => (
                <span key={v.l} style={{ display: 'inline-block', marginRight: 14, whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <Badge hex={v.hex} letter={v.l} size={14} /><span style={{ marginLeft: 5 }}>{v.mo_ta}</span>
                </span>
              ))}
              {/* Chú thích % hoàn thành (Thùy 07-19 lần 2: đổi câu mẫu số cụ thể "80%..." cho dễ hiểu hơn câu định nghĩa chung chung) — chỉ hiện khi có ít nhất 1 HS có %. */}
              {coHoanThanh && <div style={{ marginTop: 4 }}>80% thể hiện rằng con đáp ứng được 80% mục tiêu của buổi học.</div>}
            </div>
            {/* Câu kết luận nhắc làm lại/chép lại đáp án (Thùy 07-19) — CHỈ hiện nếu có ≥1 HS có câu C/S.
                Thêm nhãn "Việc cần làm" (Thùy 07-19 lần 2) — phân biệt rõ với khối chú thích phía trên,
                không chỉ khác màu nền mà còn khác Ý NGHĨA (đây là hành động, không phải giải thích ký hiệu). */}
            {canLamLai.length > 0 && (
              <div style={{ marginTop: 8, borderRadius: 10, background: '#fefaf3', border: '1px solid #e8c27e', padding: '10px 12px', fontSize: 12.5, color: '#2b3947' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c8792a', marginBottom: 4 }}>Việc cần làm</div>
                <b>{canLamLai.join(', ')}</b> cần làm lại/chép lại đáp án các bài chưa đạt.
              </div>
            )}
          </div>
          <div style={{ borderTop: '2px solid #d1963c', background: '#ffffff', padding: '10px 20px', textAlign: 'center', fontSize: 11, color: '#5b6b78' }}>BK Academy · Tel : 0963.209.309 · 17A10 KĐT Geleximco</div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── XEM LIVE (giáo trình online, buổi đang học): lưới HS × Câu, verdict có NGAY lúc HS xác nhận đáp
// án (reveal-ngay) — KHÔNG cần chấm-ngầm như ET. Poll 7s (Thùy 07-07: 5-10s đủ dùng, không cần realtime).
const LIVE_TONE: Record<string, string> = { correct: 'bg-emerald-500 text-white', partial: 'bg-amber-400 text-white', wrong: 'bg-rose-500 text-white' }
const LIVE_LETTER: Record<string, string> = { correct: 'Đ', partial: 'C', wrong: 'S' }
function LiveTab({ buoiId, roster }: { buoiId: string; roster: BuoiHocHS[] }) {
  const [loading, setLoading] = useState(true)
  const [baiTest, setBaiTest] = useState<BaiTest | null>(null)
  const [caus, setCaus] = useState<BaiTestCau[]>([])
  const [baiLam, setBaiLam] = useState<Record<string, BaiLam>>({})
  const [answers, setAnswers] = useState<LiveAnswer[]>([])
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten)) // 2 HS trùng tên rút gọn → bung đủ (Thùy 07-06)

  useEffect(() => {
    let stop = false
    let found: { baiTest: BaiTest; caus: BaiTestCau[] } | null = null
    async function tick() {
      try {
        if (!found) found = await loadLiveTestForBuoi(buoiId)
        if (!found) { if (!stop) setLoading(false); return }
        const snap = await getLiveSnapshot(found.baiTest.id)
        if (stop) return
        setBaiTest(found.baiTest); setCaus(found.caus); setBaiLam(snap.baiLam); setAnswers(snap.answers); setLoading(false)
      } catch { if (!stop) setLoading(false) }
    }
    tick()
    const t = setInterval(tick, 7000)
    return () => { stop = true; clearInterval(t) }
  }, [buoiId])

  if (loading) return <p className="text-[12px] text-slate-400">Đang tải…</p>
  if (!baiTest) return <p className="text-[13px] text-slate-400">Chưa phát hành online cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Vào <b className="text-slate-600">Kho tài liệu</b> → 📱 Phát hành online giáo trình buổi này rồi quay lại.</p>
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh "có mặt".</p>

  const cellOf = (hsId: string, cauId: string) => answers.find((a) => a.hocSinhId === hsId && a.baiTestCauId === cauId)

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 text-[12px] text-slate-400">{caus.length} câu (giáo trình online) · {coMat.length} HS · tự làm mới ~7s.</div>
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
        <table className="w-auto border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-30 whitespace-nowrap border border-slate-200 bg-slate-100 px-4 py-1.5 text-left text-[12px] font-semibold text-slate-700">Học sinh</th>
              {caus.map((c) => (
                <th key={c.id} className="sticky top-0 z-10 w-[64px] border border-slate-200 bg-slate-100 px-2 py-1.5 text-center text-[12px] font-bold text-slate-700">Câu {c.thu_tu}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => {
              const lam = baiLam[r.hoc_sinh_id]
              return (
                <tr key={r.id}>
                  <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-1 text-left align-middle font-medium text-slate-800">
                    {tenHT[i]}{!lam && <span className="ml-1.5 text-[11px] font-normal text-slate-300">(chưa mở bài)</span>}
                  </td>
                  {caus.map((c) => {
                    const cell = cellOf(r.hoc_sinh_id, c.id)
                    return (
                      <td key={c.id} className="border border-slate-200 px-2 py-1.5 text-center align-middle">
                        {lam && (
                          <span className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${cell?.verdict ? LIVE_TONE[cell.verdict] : 'bg-slate-100 text-slate-300'}`}>
                            {cell?.verdict ? LIVE_LETTER[cell.verdict] : '·'}
                            {cell?.xemGoiY && <span className="absolute -right-1.5 -top-1.5 text-[10px]" title="Đã xem gợi ý câu này">💡</span>}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── CHẤM MT (kỳ thi lớn) — CÙNG buổi, CÙNG roster/điểm danh với các tab khác (Thùy 07-08: "phải
// hiện trong buổi học giống như chấm ET"). GIỮ cấu trúc PHẦN (Phần I/II…) đúng file MT đã gán —
// KHÔNG làm phẳng câu. Đóng phase = Elo K=60 (cột riêng `mt_dong_at`, KHÔNG đụng ingame_dong_at).
function MTTab({ buoiId, roster, buoi, onChange }: { buoiId: string; roster: BuoiHocHS[]; buoi: BuoiHoc & { lop?: { mon: string; ten_lop?: string; khoi?: string | null } }; onChange: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [phans, setPhans] = useState<MTPhanCaus[]>([])
  const [mtMissing, setMtMissing] = useState(false)
  const [dangTenMT, setDangTenMT] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<CauHoi | null>(null)
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [diemMTOpen, setDiemMTOpen] = useState(false)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten))
  const dongCol = buoi.mt_dong_at
  const caus = phans.flatMap((p) => p.caus)

  async function reloadP() {
    const [p, g] = await Promise.all([listProblems(buoiId, 'mt'), listGrades(buoiId)])
    setProbs(p); setGrades(g)
    const mds = [...new Set(p.map((x) => x.ma_dang).filter(Boolean))] as string[]
    if (mds.length) setDangTenMT(await getDangTen(mds, buoi.lop?.mon))
  }
  useEffect(() => { (async () => {
    setLoading(true)
    try {
      const { mtId, phans: ps, caus: c } = await loadMTForBuoi(buoiId)
      // Lưới MT cũng bám đề qua ma_cau (chung syncDocProblems với ET) — xem ghi chú bug 07-21.
      if (!mtId) { setMtMissing(true); setPhans([]) } else { setMtMissing(false); await syncMTProblems(buoiId, c, !!buoi.mt_dong_at); setPhans(ps) }
      await reloadP()
    } catch { setMtMissing(true); setPhans([]) } finally { setLoading(false) }
  })() }, [buoiId]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function pickKQ(pid: string, hsId: string, result: ETResult) {
    const g = gradeOf(pid, hsId)
    try { if (g?.result === result) await deleteGrade(pid, hsId); else await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: [] }); await reloadP() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function dong() {
    if (closing) return
    if (!confirm('Đóng chấm MT? Sẽ tính Elo (K=60) + EXP. Mở lại được nếu cần sửa.')) return
    setClosing(true)
    try { const res = await closePhase(buoiId, 'mt'); if (res.already) alert('Đã đóng rồi.'); else { if (res.khongCoDuLieu) alert('Đã đóng, nhưng KHÔNG tính Elo/EXP — chưa chấm ô nào. Muốn tính thì Mở lại, chấm rồi xác nhận lại.'); onChange() } }
    finally { setClosing(false) }
  }
  async function moLai() { await reopenPhase(buoiId, 'mt'); onChange() }

  if (loading) return <p className="text-[12px] text-slate-400">Đang tải MT…</p>
  if (mtMissing) return <p className="text-[13px] text-slate-400">Chưa có MT gán cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Vào <b className="text-slate-600">Làm tài liệu → MT</b> gán vào buổi này.</p>
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh "có mặt" — điểm danh trước khi chấm.</p>

  const tenDangOf = (md: string | null) => (md ? dangTenMT[md] ?? md : '—')
  const cauOf = (idx: number) => caus[idx] ?? null

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu ({phans.length} phần) · {coMat.length} HS · 1 click <b className="text-emerald-600">Đ</b>/<b className="text-amber-600">C</b>/<b className="text-rose-600">S</b>.</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setDiemMTOpen((v) => !v)} className={`rounded-md border px-3 py-1.5 text-[13px] font-medium ${diemMTOpen ? 'border-violet-400 bg-violet-100 text-violet-800' : 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100'}`}>🔢 Điểm MT</button>
          {dongCol ? (
            <>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">✓ Đã đóng MT (Elo K=60)</span>
              <button onClick={moLai} className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Mở lại để sửa</button>
            </>
          ) : (
            <button onClick={dong} disabled={!probs.length || closing} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{closing ? 'Đang lưu…' : '✓ Đóng chấm MT'}</button>
          )}
        </div>
      </div>
      {diemMTOpen && <DiemMTPanel buoiId={buoiId} buoi={buoi} coMat={coMat} tenHT={tenHT} />}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
        <table className="w-auto border-collapse text-sm">
          <thead>
            {/* Hàng nhóm PHẦN — đúng cấu trúc file MT đã gán (Phần I/II…), KHÔNG làm phẳng câu. */}
            <tr className="bg-violet-50">
              <th className="sticky left-0 top-0 z-30 border border-slate-200 bg-violet-50" />
              {phans.map((ph, pi) => (
                <th key={pi} colSpan={ph.caus.length} className="sticky top-0 z-10 border border-slate-200 bg-violet-50 px-2 py-1 text-center text-[12px] font-bold text-violet-700">{ph.tieuDe}</th>
              ))}
            </tr>
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-30 whitespace-nowrap border border-slate-200 bg-slate-100 px-4 py-1.5 text-left text-[12px] font-semibold text-slate-700">Học sinh</th>
              {probs.map((p, idx) => {
                const c = cauOf(idx)
                return (
                  <th key={p.id} className="sticky top-0 z-10 w-[130px] border border-slate-200 bg-slate-100 px-2 py-1.5 text-center align-top">
                    <div className="text-[12px] font-bold text-slate-700">Câu {p.problem_no}</div>
                    <div className="mx-auto max-w-[120px] truncate text-[11px] font-medium normal-case text-violet-600" title={tenDangOf(p.ma_dang)}>{tenDangOf(p.ma_dang)}</div>
                    {c && <button onClick={() => setPreview(c)} className="mt-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-normal normal-case text-slate-400 hover:border-indigo-300 hover:text-indigo-600">ⓘ đề</button>}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => (
              <tr key={r.id}>
                <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-1 text-left align-middle font-medium text-slate-800">{tenHT[i]}</td>
                {probs.map((p) => {
                  const g = gradeOf(p.id, r.hoc_sinh_id)
                  return (
                    <td key={p.id} className="border border-slate-200 px-2 py-1 align-middle">
                      <div className="flex justify-center gap-1">
                        {ET_KQ.map((k) => (
                          <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)} disabled={!!dongCol}
                            className={`h-7 w-8 rounded-lg border text-[13px] font-bold transition disabled:cursor-not-allowed ${g?.result === k.v ? k.sel : k.idle} ${dongCol && g?.result !== k.v ? 'opacity-50' : ''}`}>{k.lbl}</button>
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

// ── ĐIỂM MT (Thùy 07-14) — tách RIÊNG khỏi chấm Đ/C/S từng câu ở trên: 1 điểm số/HS/buổi, TÁI DÙNG hạ
// tầng ky_thi/diem_thi (loai='mt_sat_hach', buoi_hoc_id=buổi này — tìm-hoặc-tạo LẦN ĐẦU mở panel, các lần
// sau tái dùng). Cùng bảng với "Nhập điểm" ở Kết quả học tập › Điểm thi — nhập ở đây hiện luôn ở đó, KHÔNG
// tách data riêng. verdict vẫn bắt buộc (cột NOT NULL) nhưng bỏ "vượt band" (khái niệm sát hạch xếp lớp,
// không áp dụng cho điểm MT buổi học) — luôn ghi false.
function DiemMTPanel({ buoiId, buoi, coMat, tenHT }: { buoiId: string; buoi: BuoiHoc & { lop?: { mon: string; ten_lop?: string; khoi?: string | null } }; coMat: BuoiHocHS[]; tenHT: string[] }) {
  const [ky, setKy] = useState<KyThi | null>(null)
  const [diems, setDiems] = useState<DiemThi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getOrCreateKyThiMTChoBuoi(buoiId, `MT ${buoi.lop?.ten_lop ?? ''} ${buoi.ngay}`.trim(), buoi.lop?.mon ?? '', buoi.lop?.khoi ?? null, currentMua())
      .then(async (k) => { setKy(k); setDiems(await listDiemThiByKyThi([k.id])) })
      .finally(() => setLoading(false))
  }, [buoiId]) // eslint-disable-line

  const diemOf = (hsId: string) => diems.find((d) => d.hoc_sinh_id === hsId) ?? null
  async function save(hsId: string, verdict: Verdict, diem: number | null) {
    if (!ky) return
    await upsertDiemThi({ kyThiId: ky.id, hocSinhId: hsId, diem, bandLucThi: null, verdict, vuotBand: false })
    setDiems((prev) => [...prev.filter((d) => d.hoc_sinh_id !== hsId), { ky_thi_id: ky.id, hoc_sinh_id: hsId, diem, band_luc_thi: null, verdict, vuot_band: false }])
  }

  return (
    <div className="mb-3 rounded-xl border border-violet-200 bg-violet-50/40 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-violet-800">Điểm MT</span>
        <span className="text-[11px] text-slate-500">độc lập với chấm Đ/C/S từng câu · hiện ở Kết quả học tập › Điểm MT</span>
      </div>
      {loading || !ky ? <p className="text-[12px] text-slate-400">Đang tải…</p> : (
        <table className="w-full max-w-xl text-[13px]">
          <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
            <th className="py-1">Học sinh</th><th className="w-20">Điểm /10</th><th className="w-52">Verdict</th>
          </tr></thead>
          <tbody>
            {coMat.map((r, i) => <DiemMTRow key={r.hoc_sinh_id} ten={tenHT[i]} init={diemOf(r.hoc_sinh_id)} onSave={(v, d) => save(r.hoc_sinh_id, v, d)} />)}
          </tbody>
        </table>
      )}
    </div>
  )
}

const V_LABEL_MT: Record<Verdict, string> = { dat: 'Đạt', gan_dat: 'Gần', khong_dat: 'Không' }
const V_CLS_MT: Record<Verdict, string> = { dat: 'bg-emerald-500 text-white', gan_dat: 'bg-amber-500 text-white', khong_dat: 'bg-rose-500 text-white' }
function DiemMTRow({ ten, init, onSave }: { ten: string; init: DiemThi | null; onSave: (v: Verdict, d: number | null) => void }) {
  const [diem, setDiem] = useState(init?.diem != null ? String(init.diem) : '')
  const [verdict, setVerdict] = useState<Verdict | null>(init?.verdict ?? null)
  const d = () => (diem.trim() === '' ? null : Number(diem))
  const pick = (v: Verdict) => { setVerdict(v); onSave(v, d()) }
  return (
    <tr className="border-t border-violet-100">
      <td className="py-1 font-medium text-slate-700">{ten}</td>
      <td><input value={diem} onChange={(e) => setDiem(e.target.value)} onBlur={() => verdict && onSave(verdict, d())} inputMode="decimal" className="h-7 w-16 rounded border border-slate-300 px-2 text-[13px]" /></td>
      <td>
        <div className="flex gap-1">
          {(['dat', 'gan_dat', 'khong_dat'] as Verdict[]).map((v) => (
            <button key={v} onClick={() => pick(v)} className={`h-7 rounded px-2 text-[12px] font-medium ${verdict === v ? V_CLS_MT[v] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{V_LABEL_MT[v]}</button>
          ))}
        </div>
      </td>
    </tr>
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
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten)) // 2 HS trùng tên rút gọn → bung đủ (Thùy 07-06)
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
      else { setMissing(false); await syncBTVNProblems(buoiId, caus, !!buoi.btvn_dong_at) }
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
  if (coMat.length === 0) return <p className="text-[12px] text-slate-400">Chưa có HS nào điểm danh “có mặt”.</p>

  const cbOf = (hsId: string) => cb.filter((x) => x.hoc_sinh_id === hsId)
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu (từ BTVN) · {coMat.length} HS · chấm <b className="text-emerald-600">Đ</b>/<b className="text-amber-600">C</b>/<b className="text-rose-600">S</b> (tham khảo) · 🚨 báo động kém dạng.</span>
        {dong ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[13px] font-medium text-emerald-700">✓ BTVN đã đóng — đã thưởng EXP hoàn thành.</span>
            <button onClick={async () => { if (!confirm('Mở lại BTVN để sửa? EXP đã thưởng sẽ hoàn lại.')) return; await reopenBTVN(buoiId); onChange() }} className="rounded-md border border-amber-300 px-2.5 py-1 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Mở lại để sửa</button>
          </div>
        ) : (
          <button onClick={dong_} disabled={closing} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{closing ? 'Đang đóng…' : 'Đóng BTVN'}</button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-30 min-w-[430px] border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700">Học sinh · Nộp · Thái độ</th>
              {probs.map((p) => (
                <th key={p.id} className="sticky top-0 z-10 min-w-[120px] border border-slate-200 bg-slate-100 px-2 py-1.5 text-center align-top">
                  <div className="text-[12px] font-bold text-slate-700">Câu {p.problem_no}</div>
                  <div className="mx-auto max-w-[150px] truncate text-[11px] font-medium normal-case text-violet-600" title={tenDang(p.ma_dang)}>{tenDang(p.ma_dang)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => {
              const v = kq[r.hoc_sinh_id] ?? { trang_thai_nop: null, thai_do: null }
              return (
                <tr key={r.id} className="align-top">
                  <td className="sticky left-0 z-10 border border-slate-200 bg-white px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="min-w-[104px] flex-1 whitespace-nowrap font-medium text-slate-800">{tenHT[i]}</span>
                      <select value={v.trang_thai_nop ?? ''} disabled={dong} onChange={(e) => setKQField(r.hoc_sinh_id, { trang_thai_nop: e.target.value || null })} title="Trạng thái nộp" className={`h-7 w-[116px] shrink-0 rounded border px-1 text-[12px] disabled:opacity-60 ${v.trang_thai_nop ? 'border-slate-300 text-slate-700' : 'border-slate-200 text-slate-400'}`}>
                        <option value="">— Nộp —</option>{NOP_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                      <select value={v.thai_do ?? ''} disabled={dong} onChange={(e) => setKQField(r.hoc_sinh_id, { thai_do: e.target.value || null })} title="Thái độ" className={`h-7 w-[116px] shrink-0 rounded border px-1 text-[12px] disabled:opacity-60 ${v.thai_do ? 'border-slate-300 text-slate-700' : 'border-slate-200 text-slate-400'}`}>
                        <option value="">— Thái độ —</option>{THAIDO_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                      <button onClick={() => setAlertFor(r.hoc_sinh_id)} disabled={!dangBuoi.length || dong} className="shrink-0 rounded border border-rose-200 px-1.5 py-1 text-[12px] text-rose-600 hover:bg-rose-50 disabled:opacity-40" title="Báo động: HS kém 1 dạng">🚨</button>
                    </div>
                    {cbOf(r.hoc_sinh_id).length > 0 && (
                      <div className="mt-1 flex flex-wrap items-center gap-1 pl-[2px]">
                        {cbOf(r.hoc_sinh_id).map((c) => (
                          <span key={c.id} className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700" title={c.ghi_chu ?? ''}>{tenDang(c.ma_dang)}{!dong && <button onClick={async () => { await xoaCanhBao(c.id); reloadKq() }} className="text-rose-400 hover:text-rose-700">✕</button>}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  {probs.map((p) => {
                    const g = gradeOf(p.id, r.hoc_sinh_id)
                    return (
                      <td key={p.id} className="border border-slate-200 px-2 py-1 align-middle">
                        <div className="flex justify-center gap-1">
                          {ET_KQ.map((k) => (
                            <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)} disabled={dong} className={`h-7 w-8 rounded-lg border text-[13px] font-bold transition disabled:cursor-not-allowed ${g?.result === k.v ? k.sel : k.idle} ${dong && g?.result !== k.v ? 'opacity-50' : ''}`}>{k.lbl}</button>
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
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten)) // 2 HS trùng tên rút gọn → bung đủ (Thùy 07-06)
  const tenDang = (md: string) => dangOpts.find((d) => d.ma_dang === md)?.ten ?? md
  // dạng của buổi = ma_dang đã gắn ở "Chấm bài trên lớp" (ingame)
  const dangs = [...new Set(probs.map((p) => p.ma_dang).filter(Boolean))] as string[]

  // getDanhGia tách riêng try/catch: lỗi ở đây (vd cột mới hoan_thanh_pct chưa migrate) KHÔNG được kéo
  // sập luôn phần chấm-theo-dạng (probs/grades) — chỉ nhận xét/% hoàn thành tạm rỗng.
  async function reload() {
    setLoading(true)
    try {
      const [p, g] = await Promise.all([listProblems(buoiId, 'ingame'), listGrades(buoiId)])
      setProbs(p); setGrades(g)
      try { setData(await getDanhGia(buoiId)) } catch { setData({}) }
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [buoiId]) // eslint-disable-line

  async function setDiem(hsId: string, maDang: string, cur: DanhGiaDiem | undefined, val: DanhGiaDiem) {
    const next: DanhGiaDiem | null = cur === val ? null : val // bấm lại = bỏ chọn (về chưa-đánh-giá)
    setData((d) => { const hs = d[hsId] ?? { hoc_sinh_id: hsId, nhan_xet: null, hoanThanhPct: null, diemTheoDang: {} }; const dd = { ...hs.diemTheoDang }; if (next === null) delete dd[maDang]; else dd[maDang] = next; return { ...d, [hsId]: { ...hs, diemTheoDang: dd } } })
    try { await setDanhGiaDang(buoiId, hsId, maDang, next) } catch (e: any) { alert(e.message ?? String(e)); reload() }
  }
  async function saveNX(hsId: string, txt: string) { try { await setNhanXet(buoiId, hsId, txt) } catch (e: any) { alert(e.message ?? String(e)) } }
  async function saveHT(hsId: string, v: string) {
    const pct = v === '' ? null : Number(v)
    setData((d) => { const hs = d[hsId] ?? { hoc_sinh_id: hsId, nhan_xet: null, hoanThanhPct: null, diemTheoDang: {} }; return { ...d, [hsId]: { ...hs, hoanThanhPct: pct } } })
    try { await setHoanThanhPct(buoiId, hsId, pct) } catch (e: any) { alert(e.message ?? String(e)); reload() }
  }
  // Nội dung buổi học (hiện trên ảnh gửi PH) + Mô tả (nội bộ) — CẤP BUỔI, không riêng từng HS. Chuỗi rỗng → null (anti-NULL: "chưa nhập").
  async function saveND(txt: string) { try { await setNoiDungBuoi(buoiId, { noi_dung_buoi: txt.trim() || null }); onChange() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function saveMT(txt: string) { try { await setNoiDungBuoi(buoiId, { mo_ta: txt.trim() || null }); onChange() } catch (e: any) { alert(e.message ?? String(e)) } }

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
      {/* Nội dung buổi học + Mô tả — CẤP BUỔI (chung cả lớp, không riêng từng HS), Thùy 07-19. */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">Nội dung buổi học <span className="font-normal text-slate-400">(hiện trên ảnh gửi PH)</span></label>
          <input defaultValue={buoi.noi_dung_buoi ?? ''} onBlur={(e) => saveND(e.target.value)} disabled={xong} placeholder="vd: Số chẵn - Số lẻ"
            className="h-9 w-full rounded-md border border-slate-200 px-2.5 text-[13px] disabled:bg-slate-50 disabled:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">Mô tả <span className="font-normal text-slate-400">(nội bộ, không hiện trên ảnh)</span></label>
          <textarea defaultValue={buoi.mo_ta ?? ''} onBlur={(e) => saveMT(e.target.value)} disabled={xong} placeholder="vd: đây là nội dung nâng cao thuộc phần 10 điểm trong đề thi…"
            className="h-9 w-full resize-none rounded-md border border-slate-200 px-2.5 py-1.5 text-[13px] disabled:bg-slate-50 disabled:text-slate-500" />
        </div>
      </div>
      <p className="mb-2 text-[12px] text-slate-400">
        {dangs.length === 0
          ? <>Chưa có dạng nào — gắn dạng cho bài ở tab <b>Chấm bài trên lớp</b> sẽ tự hiện cột. Tạm thời chỉ nhập nhận xét.</>
          : <>Mỗi dạng: chip nhỏ = mức từng bài (tham khảo từ chấm bài) · nút màu = mức GV chốt (bấm lại để bỏ).</>}
      </p>
      <div className="rounded-xl border border-slate-200">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-30 border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700">Học sinh</th>
              {dangs.map((md) => <th key={md} className="sticky top-0 z-10 min-w-[160px] border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700"><div className="max-w-[200px] truncate" title={tenDang(md)}>{tenDang(md)}</div></th>)}
              <th className="sticky top-0 z-10 border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700" title="Ước lượng thô — hiện trên ảnh gửi PH nếu có HS nào được chọn">Hoàn thành buổi</th>
              <th className="sticky top-0 z-10 border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[12px] font-semibold text-slate-700">Nhận xét</th>
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => {
              const hsId = r.hoc_sinh_id; const hs = data[hsId]
              return (
                <tr key={r.id} className="align-top">
                  <td className="sticky left-0 z-10 whitespace-nowrap border border-slate-200 bg-white px-3 py-2 text-left align-middle font-medium text-slate-800">{tenHT[i]}</td>
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
                            <button key={s.v} onClick={() => setDiem(hsId, md, cur, s.v)} disabled={xong} title={s.v === 1 ? 'Đúng (hiểu)' : s.v === 0.5 ? 'Chưa đạt (một phần)' : 'Sai (chưa hiểu)'}
                              className={`h-8 w-9 rounded-lg border text-[13px] font-bold transition disabled:cursor-not-allowed ${cur === s.v ? s.sel : 'border-slate-200 text-slate-300 hover:bg-slate-100 hover:text-slate-500'} ${xong && cur !== s.v ? 'opacity-50' : ''}`}>{s.lbl}</button>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                  <td className="border border-slate-200 px-3 py-2">
                    <select value={hs?.hoanThanhPct ?? ''} onChange={(e) => saveHT(hsId, e.target.value)} disabled={xong}
                      className="h-8 w-24 rounded-md border border-slate-200 px-1.5 text-[12px] disabled:bg-slate-50 disabled:text-slate-500">
                      <option value="">— chưa chọn —</option>
                      {HOAN_THANH_PCT_OPTS.map((p) => <option key={p} value={p}>{p}%</option>)}
                    </select>
                  </td>
                  <td className="border border-slate-200 px-3 py-2">
                    <textarea defaultValue={hs?.nhan_xet ?? ''} onBlur={(e) => saveNX(hsId, e.target.value)} readOnly={xong} placeholder="nhận xét…"
                      className="h-12 w-96 rounded-md border border-slate-200 px-2 py-1 text-[12px] read-only:bg-slate-50 read-only:text-slate-500" />
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
