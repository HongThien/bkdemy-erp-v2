// ChamBuoi — màn chấm 1 buổi trong app TA (PLAN-app-ta.md §4). Header quay-về + 3 tab chấm
// (Bài trên lớp / ET / BTVN). Logic ghi = CÙNG seam lib/gami với ERP (1 sự thật, 2 UI —
// trade-off đã ghi ở PLAN-app-ops §3); UI viết mới cho CHẠM (nút ≥44px), KHÔNG import
// BuoiHocScreen (file nóng 2100 dòng kéo theo kho/soạn tài liệu).
import { useEffect, useRef, useState } from 'react'
import {
  getBuoi, getRoster, getDangTen, listProblems, listGrades, addProblem, setProblemDang,
  ensureProblems, gradeMuc, gradeET, gradeETBulk, deleteGrade, closePhase, reopenPhase,
  loadETForBuoi, syncDocProblems, loadHinhForBuoiPhase, syncHinhProblems, xepLuoiTheoDe,
  type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type ETResult, type LuoiSync,
} from '../../lib/gami'
import { tenHienThiDs } from '../../lib/hoten'
import DangPickerOne from '../../components/DangPickerOne'
import ChamBtvn from './ChamBtvn'
import type { BuoiView } from './TaHome'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

export const ET_KQ: { v: ETResult; lbl: string; idle: string; sel: string }[] = [
  { v: 'correct', lbl: 'Đ', idle: 'border-slate-200 text-emerald-700', sel: 'border-transparent bg-emerald-600 text-white' },
  { v: 'partial', lbl: 'C', idle: 'border-slate-200 text-amber-700', sel: 'border-transparent bg-amber-500 text-white' },
  { v: 'wrong', lbl: 'S', idle: 'border-slate-200 text-rose-700', sel: 'border-transparent bg-rose-600 text-white' },
]
const ET_LOI = ['E01', 'E02', 'E03', 'E04', 'E05', 'E06']
const MUC_IDLE = 'border-slate-200 text-slate-300'
const MUC: { v: number; sel: string }[] = [
  { v: 1, sel: 'bg-rose-600 text-white border-transparent' },
  { v: 2, sel: 'bg-orange-500 text-white border-transparent' },
  { v: 3, sel: 'bg-amber-500 text-white border-transparent' },
  { v: 4, sel: 'bg-lime-600 text-white border-transparent' },
  { v: 5, sel: 'bg-emerald-600 text-white border-transparent' },
]

type TabKey = 'ingame' | 'et' | 'btvn'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'ingame', label: 'Bài trên lớp' }, { key: 'et', label: 'ET' }, { key: 'btvn', label: 'BTVN' },
]

export type BuoiFull = BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi: string | null }; gv_chinh_id: string | null }

export default function ChamBuoi({ view, onBack }: { view: BuoiView; onBack: () => void }) {
  const [tab, setTab] = useState<TabKey>(view.tab)
  const [buoi, setBuoi] = useState<BuoiFull | null>(null)
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [tenDangMap, setTenDangMap] = useState<Record<string, string>>({})

  async function reload() {
    const b = await getBuoi(view.buoiId)
    setBuoi(b as BuoiFull)
    setRoster(await getRoster(view.buoiId))
  }
  useEffect(() => { reload().catch((e) => alert(e.message ?? String(e))) }, [view.buoiId]) // eslint-disable-line

  // tra tên dạng theo MÔN của lớp (17 mã trùng số giữa Toán/KHTN — bài học 07-07)
  async function napTenDang(maDangs: (string | null)[]) {
    const mds = [...new Set(maDangs.filter(Boolean))] as string[]
    const thieu = mds.filter((m) => !(m in tenDangMap))
    if (!thieu.length) return
    const map = await getDangTen(thieu, buoi?.lop?.mon).catch(() => ({} as Record<string, string>))
    setTenDangMap((cur) => ({ ...cur, ...map }))
  }
  const tenDang = (md: string | null) => (md ? tenDangMap[md] ?? md : '—')

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="border-b border-slate-200/60 bg-white px-3 pb-0" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[860px]">
          <div className="flex items-center gap-2 pb-1.5">
            <button onClick={onBack} className="rounded-lg px-2 py-1.5 text-[14px] font-semibold text-teal-700 active:bg-teal-50">‹ Việc của tôi</button>
            <div className="min-w-0 flex-1 text-center leading-tight">
              <p className="truncate text-[14.5px] font-bold text-slate-800">{view.lop}</p>
              <p className="text-[11px] text-slate-400">{thuCuaNgay(view.ngay)} · {ddmmVN(view.ngay)}{buoi?.lop?.mon ? ` · ${buoi.lop.mon}` : ''}</p>
            </div>
            <span className="w-[104px]" />
          </div>
          <div className="flex gap-1.5 pb-2">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`min-h-[36px] flex-1 rounded-xl text-[13px] font-semibold transition ${tab === t.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 active:bg-slate-200'}`}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-[860px] px-3 py-3 pb-10">
          {!buoi ? <p className="text-[13px] text-slate-400">Đang tải buổi…</p> : (
            <>
              {tab === 'ingame' && <IngamePanel buoi={buoi} roster={roster} tenDang={tenDang} napTenDang={napTenDang} onChange={reload} />}
              {tab === 'et' && <EtPanel buoi={buoi} roster={roster} tenDang={tenDang} napTenDang={napTenDang} onChange={reload} />}
              {tab === 'btvn' && <ChamBtvn buoi={buoi} roster={roster} tenDang={tenDang} napTenDang={napTenDang} onChange={reload} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Thanh trạng thái đóng/mở phase dùng chung 3 panel ──
export function DongBar({ dong, dongLbl, onDong, onMoLai, closing, disabled }: {
  dong: boolean; dongLbl: string; onDong: () => void; onMoLai: () => void; closing: boolean; disabled?: boolean
}) {
  return dong ? (
    <div className="flex items-center gap-2">
      <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">✓ Đã xác nhận</span>
      <button onClick={onMoLai} className="min-h-[36px] rounded-lg border border-amber-300 px-2.5 text-[12.5px] font-semibold text-amber-700 active:bg-amber-50">↩ Mở lại</button>
    </div>
  ) : (
    <button onClick={onDong} disabled={closing || disabled}
      className="min-h-[36px] rounded-lg bg-teal-600 px-3.5 text-[13px] font-semibold text-white active:bg-teal-500 disabled:opacity-40">{closing ? 'Đang lưu…' : dongLbl}</button>
  )
}

// ── CHẤM BÀI TRÊN LỚP: 1 bài/màn (như ChamMobile ERP) — HS làm các bài khác nhau, TA đi quanh lớp ──
function IngamePanel({ buoi, roster, tenDang, napTenDang, onChange }: {
  buoi: BuoiFull; roster: BuoiHocHS[]; tenDang: (md: string | null) => string
  napTenDang: (mds: (string | null)[]) => Promise<void>; onChange: () => void
}) {
  const buoiId = buoi.id
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [idx, setIdx] = useState(0)
  const [dangPick, setDangPick] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten))
  const dong = !!buoi.ingame_dong_at

  async function reloadP() {
    const [p, g] = await Promise.all([listProblems(buoiId, 'ingame'), listGrades(buoiId)])
    setProbs(p); setGrades(g); napTenDang(p.map((x) => x.ma_dang))
  }
  useEffect(() => { (async () => { try { await ensureProblems(buoiId, 'ingame', 10) } catch { /* */ } reloadP() })() }, [buoiId]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  const p = probs[Math.min(idx, Math.max(0, probs.length - 1))]
  const daCham = p ? coMat.filter((r) => gradeOf(p.id, r.hoc_sinh_id)).length : 0

  async function setMucHS(hsId: string, muc: number) {
    if (!p) return
    try {
      if (gradeOf(p.id, hsId)?.muc === muc) await deleteGrade(p.id, hsId)
      else await gradeMuc({ buoiId, problemId: p.id, hocSinhId: hsId, muc })
      await reloadP()
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function dong_() {
    if (closing) return
    if (!confirm('Xác nhận chấm bài trên lớp? Sẽ tính EXP hạng. Mở lại được nếu cần sửa.')) return
    setClosing(true)
    try { const r = await closePhase(buoiId, 'ingame'); if (r.already) alert('Đã xác nhận rồi.'); else { if (r.khongCoDuLieu) alert('Đã đóng, nhưng chưa chấm ô nào.'); onChange() } }
    catch (e: any) { alert(e?.message ?? String(e)) } finally { setClosing(false) }
  }

  if (coMat.length === 0) return <p className="text-[13px] text-slate-400">Chưa có HS điểm danh "có mặt" — OPS điểm danh trước.</p>
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 text-[15px] font-bold text-slate-600 disabled:opacity-30">‹</button>
        <button onClick={() => p && !dong && setDangPick(p.id)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-center">
          <span className="block text-[14px] font-bold text-slate-800">Bài {p?.problem_no ?? '—'} / {probs.length}</span>
          <span className={`block truncate text-[11.5px] ${p?.ma_dang ? 'text-violet-600' : 'text-slate-400'}`}>{p?.ma_dang ? tenDang(p.ma_dang) : dong ? '—' : '+ chọn dạng'}</span>
        </button>
        <button onClick={() => setIdx((i) => Math.min(probs.length - 1, i + 1))} disabled={idx >= probs.length - 1} className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 text-[15px] font-bold text-slate-600 disabled:opacity-30">›</button>
      </div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">Đã chấm {daCham}/{coMat.length} HS · bấm mức 1→5, bấm lại = bỏ</span>
        <div className="ml-auto flex items-center gap-2">
          {!dong && <button onClick={async () => { await addProblem(buoiId, 'ingame'); await reloadP(); setIdx(probs.length) }} className="min-h-[36px] rounded-lg border border-slate-200 bg-white px-2.5 text-[12.5px] font-semibold text-slate-600">+ Bài</button>}
          <DongBar dong={dong} dongLbl="✓ Xác nhận" onDong={dong_} onMoLai={async () => { await reopenPhase(buoiId, 'ingame'); onChange() }} closing={closing} disabled={!probs.length} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {coMat.map((r, i) => {
          const g = p ? gradeOf(p.id, r.hoc_sinh_id) : undefined
          return (
            <div key={r.id} className="flex min-h-[52px] items-center gap-2 rounded-2xl border border-slate-200/70 bg-white px-3 py-1.5">
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-slate-800">{tenHT[i]}</span>
              <div className="flex gap-1">
                {MUC.map((m) => (
                  <button key={m.v} onClick={() => setMucHS(r.hoc_sinh_id, m.v)} disabled={dong}
                    className={`h-11 w-11 rounded-xl border text-[15px] font-bold transition ${g?.muc === m.v ? m.sel : MUC_IDLE} ${dong && g?.muc !== m.v ? 'opacity-40' : ''}`}>{m.v}</button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {dangPick && <DangPickerOne khoi={buoi.lop?.khoi ?? ''} mon={buoi.lop?.mon} onClose={() => setDangPick(null)}
        onPick={async (md) => { const pid = dangPick; setDangPick(null); await setProblemDang(pid, md); reloadP() }} />}
    </div>
  )
}

// ── CHẤM ET: lưới bám đề (khớp ô↔câu qua ma_cau — bài học 07-21), Đ/C/S + ô lỗi, đóng = Elo+EXP ──
function EtPanel({ buoi, roster, tenDang, napTenDang, onChange }: {
  buoi: BuoiFull; roster: BuoiHocHS[]; tenDang: (md: string | null) => string
  napTenDang: (mds: (string | null)[]) => Promise<void>; onChange: () => void
}) {
  const buoiId = buoi.id
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [etMissing, setEtMissing] = useState(false)
  const [sync, setSync] = useState<LuoiSync | null>(null)
  const [editing, setEditing] = useState<{ problemId: string; hsId: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten))
  const dong = !!buoi.et_dong_at
  const causRef = useRef<{ ma_cau: string }[]>([])

  async function reloadP() {
    const [p, g] = await Promise.all([listProblems(buoiId, 'et'), listGrades(buoiId)])
    setProbs(xepLuoiTheoDe(p, causRef.current as any)); setGrades(g); napTenDang(p.map((x) => x.ma_dang))
  }
  useEffect(() => { (async () => {
    setLoading(true)
    try {
      const { etId, caus } = await loadETForBuoi(buoiId)
      causRef.current = caus
      // TUẦN TỰ — Đại + Hình chia sẻ slot problem_no (bài học 21/08), phase đã đóng chỉ báo không sửa.
      const s = await syncDocProblems(buoiId, 'et', caus, !!buoi.et_dong_at)
      const { dapAn: hinhDapAn } = await loadHinhForBuoiPhase(buoiId, 'et')
      const sh = await syncHinhProblems(buoiId, 'et', hinhDapAn, !!buoi.et_dong_at)
      if (!etId && !hinhDapAn.length) { setEtMissing(true); setSync(null); await reloadP(); return }
      setEtMissing(false)
      const merged: LuoiSync = { probs: [...s.probs, ...sh.probs], moCoi: [...s.moCoi, ...sh.moCoi], khongRoRang: s.khongRoRang ?? sh.khongRoRang, doiCauTruc: s.doiCauTruc || sh.doiCauTruc }
      setSync(merged); setProbs(merged.probs); setGrades(await listGrades(buoiId)); napTenDang(merged.probs.map((x) => x.ma_dang))
    } catch { setEtMissing(true); setSync(null) } finally { setLoading(false) }
  })() }, [buoiId]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function pickKQ(pid: string, hsId: string, result: ETResult) {
    const g = gradeOf(pid, hsId)
    try {
      if (g?.result === result) { await deleteGrade(pid, hsId); setEditing(null); await reloadP(); return }
      if (result === 'correct') { await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: [] }); setEditing(null) }
      else { await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: g?.loi ?? [] }); setEditing({ problemId: pid, hsId }) }
      await reloadP()
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function bulkRow(hsId: string, result: ETResult) {
    if (!probs.length) return
    const daCham = probs.filter((p) => gradeOf(p.id, hsId)).length
    if (daCham > 0 && !confirm(`HS này đã có ${daCham}/${probs.length} câu — GHI ĐÈ tất cả thành "${ET_KQ.find((k) => k.v === result)?.lbl}"?`)) return
    try { await gradeETBulk({ buoiId, hocSinhId: hsId, problemIds: probs.map((p) => p.id), result }); setEditing(null); await reloadP() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function toggleLoi(pid: string, hsId: string, code: string) {
    const g = gradeOf(pid, hsId); if (!g) return
    const next = (g.loi ?? []).includes(code) ? (g.loi ?? []).filter((x) => x !== code) : [...(g.loi ?? []), code]
    try { await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result: g.result as ETResult, loi: next }); setEditing(null); await reloadP() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function dong_(khongCoDe = false) {
    if (closing) return
    if (!confirm(khongCoDe ? 'Buổi KHÔNG có đề ET — đóng để hết treo ở Việc của tôi?' : 'Xác nhận ET? Sẽ tính Elo + EXP. Mở lại được nếu cần sửa.')) return
    setClosing(true)
    try { const r = await closePhase(buoiId, 'et'); if (r.already) alert('Đã xác nhận rồi.'); else { if (r.khongCoDuLieu) alert('Đã đóng, nhưng KHÔNG tính Elo/EXP — chưa chấm ô nào.'); onChange() } }
    catch (e: any) { alert(e?.message ?? String(e)) } finally { setClosing(false) }
  }

  if (loading) return <p className="text-[13px] text-slate-400">Đang tải ET…</p>
  if (etMissing) return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-slate-400">Chưa có ET cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>). Nếu buổi <b className="text-slate-600">không có ET</b>, đóng để hết treo.</p>
      <DongBar dong={dong} dongLbl="✓ Không có ET — đóng" onDong={() => dong_(true)} onMoLai={async () => { await reopenPhase(buoiId, 'et'); onChange() }} closing={closing} />
    </div>
  )
  if (coMat.length === 0) return <p className="text-[13px] text-slate-400">Chưa có HS điểm danh "có mặt".</p>

  const moCoiIds = new Set((sync?.moCoi ?? []).map((m) => m.problem.id))
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu · {coMat.length} HS · Đ/C/S — C/S mở ô lỗi</span>
        <div className="ml-auto"><DongBar dong={dong} dongLbl="✓ Xác nhận ET" onDong={() => dong_()} onMoLai={async () => { await reopenPhase(buoiId, 'et'); onChange() }} closing={closing} disabled={!probs.length} /></div>
      </div>
      {/* Cảnh báo lưới lệch đề — so NỘI DUNG không so số lượng (bài học 07-21), không bao giờ im lặng */}
      {sync?.doiCauTruc && <CanhBaoLuoi mau="amber" text="Đề ET đã đổi sau khi xác nhận — lưới giữ theo lúc chấm (Elo đã tính). Muốn bám đề mới: ↩ Mở lại, hệ tự đồng bộ." />}
      {sync?.khongRoRang === 'lech_so' && <CanhBaoLuoi mau="rose" text={`Số ô (${probs.length}) khác số câu trong đề — hệ KHÔNG tự đoán ô nào ứng câu nào. Đối chiếu trên ERP desktop.`} />}
      {sync?.khongRoRang === 'lech_dang' && <CanhBaoLuoi mau="rose" text="Dạng của ô không khớp dạng của câu (đề bị thay/bớt câu ở giữa sau khi chấm) — hệ không đoán. Đối chiếu trên ERP desktop." />}
      {!!sync?.moCoi.length && <CanhBaoLuoi mau="rose" text={`${sync.moCoi.length} ô có điểm nhưng câu đã bị bỏ khỏi đề — điểm giữ nguyên, ô xếp cuối.`} />}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-left text-[12px] font-semibold text-slate-600">Học sinh</th>
              {probs.map((p) => (
                <th key={p.id} className={`min-w-[128px] border-b border-slate-200 px-2 py-1.5 text-center align-top ${p.hinh_baitoan_id ? 'bg-violet-50' : ''} ${moCoiIds.has(p.id) ? 'bg-rose-50' : ''}`}>
                  <div className="text-[12px] font-bold text-slate-700">{p.hinh_baitoan_id ? `Bài ${p.hinh_nhan}` : `Câu ${p.problem_no}`}</div>
                  <div className="mx-auto max-w-[120px] truncate text-[10.5px] font-medium text-violet-600">{p.hinh_baitoan_id ? 'Hình' : tenDang(p.ma_dang)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coMat.map((r, i) => (
              <tr key={r.id} className="align-top">
                <td className="sticky left-0 z-10 whitespace-nowrap border-b border-r border-slate-200 bg-white px-3 py-1.5">
                  <div className="text-[13px] font-semibold text-slate-800">{tenHT[i]}</div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Tất cả</span>
                    {ET_KQ.map((k) => (
                      <button key={k.v} onClick={() => bulkRow(r.hoc_sinh_id, k.v)} disabled={dong}
                        className={`h-7 w-7 rounded-lg border text-[11.5px] font-bold ${k.idle} disabled:opacity-40`}>{k.lbl}</button>
                    ))}
                  </div>
                </td>
                {probs.map((p) => {
                  const g = gradeOf(p.id, r.hoc_sinh_id)
                  const isEditing = editing?.problemId === p.id && editing?.hsId === r.hoc_sinh_id
                  return (
                    <td key={p.id} className="border-b border-slate-200 px-1.5 py-1.5 align-middle">
                      <div className="flex justify-center gap-1">
                        {ET_KQ.map((k) => (
                          <button key={k.v} onClick={() => pickKQ(p.id, r.hoc_sinh_id, k.v)} disabled={dong}
                            className={`h-10 w-10 rounded-xl border text-[14px] font-bold transition ${g?.result === k.v ? k.sel : k.idle} ${dong && g?.result !== k.v ? 'opacity-40' : ''}`}>{k.lbl}</button>
                        ))}
                      </div>
                      {(isEditing || (g?.loi?.length ?? 0) > 0) && g && g.result !== 'correct' && (
                        <div className="mt-1 flex flex-wrap justify-center gap-1">
                          {ET_LOI.map((code) => (
                            <button key={code} onClick={() => toggleLoi(p.id, r.hoc_sinh_id, code)} disabled={dong}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${g.loi?.includes(code) ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{code}</button>
                          ))}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CanhBaoLuoi({ mau, text }: { mau: 'amber' | 'rose'; text: string }) {
  return (
    <div className={`mb-2.5 rounded-xl border px-3 py-2 text-[12px] ${mau === 'amber' ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-rose-300 bg-rose-50 text-rose-800'}`}>⚠️ {text}</div>
  )
}
