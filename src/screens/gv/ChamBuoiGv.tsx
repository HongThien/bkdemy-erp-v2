// ChamBuoiGv — màn chấm 1 buổi trong app GV (PLAN-app-gv.md §2). Header quay-về + 2 tab
// (Bài trên lớp / Đánh giá sau buổi). Logic ghi = CÙNG seam lib/gami với ERP (1 sự thật, 2 UI);
// UI viết mới cho CHẠM (nút ≥44px), KHÔNG import BuoiHocScreen (file nóng 2100 dòng — luật bundle).
// Ingame port gần nguyên từ app TA (ChamBuoi.tsx) đổi tông lá cây; DanhGiaPanel VIẾT MỚI:
// mức 1-5 + nhãn muc_ma + verdict Đ/C/S per dạng + nhận xét + 🚨 CHUÔNG ĐỎ bổ trợ
// (nguon='danhgia', ghi chú BẮT BUỘC — CEO 31/08; kênh "báo động vào thẳng" luật duyệt bổ trợ ≥2/4).
// Tab thứ 3 "Trước buổi" (CEO 04/09) = TruocBuoiTab dùng chung với ERP (compact cho điện thoại).
import { useEffect, useState } from 'react'
import TruocBuoiTab from '../gami/TruocBuoiTab'
import {
  getBuoi, getRoster, getDangTen, listProblems, listGrades, addProblem, setProblemDang,
  ensureProblems, gradeMuc, deleteGrade, closePhase, reopenPhase,
  getDanhGia, setDanhGiaDang, setNhanXet, setMuc, MUC_CATALOG, MUC_OPTS, nhanMuc,
  dongDanhGia, moLaiDanhGia, setNoiDungBuoi, listCanhBao, themCanhBao, xoaCanhBao,
  type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type DanhGiaHS, type DanhGiaDiem, type CanhBao,
} from '../../lib/gami'
import { tenHienThiDs } from '../../lib/hoten'
import DangPickerOne from '../../components/DangPickerOne'
import type { BuoiViewGv } from './GvHome'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

const MUC_IDLE = 'border-slate-200 text-slate-300'
const MUC: { v: number; sel: string }[] = [
  { v: 1, sel: 'bg-rose-600 text-white border-transparent' },
  { v: 2, sel: 'bg-orange-500 text-white border-transparent' },
  { v: 3, sel: 'bg-amber-500 text-white border-transparent' },
  { v: 4, sel: 'bg-lime-600 text-white border-transparent' },
  { v: 5, sel: 'bg-emerald-600 text-white border-transparent' },
]
// Đ/C/S đánh giá per dạng — thống nhất quy tắc với ERP DanhGiaTab (Đ=1 hiểu · C=0.5 một phần · S=0 chưa).
const DG_SCORES: { v: DanhGiaDiem; lbl: string; sel: string }[] = [
  { v: 1, lbl: 'Đ', sel: 'bg-emerald-600 text-white border-transparent' },
  { v: 0.5, lbl: 'C', sel: 'bg-amber-500 text-white border-transparent' },
  { v: 0, lbl: 'S', sel: 'bg-rose-600 text-white border-transparent' },
]
// Chip tham khảo từ chấm bài trên lớp = mức 1-5 (màu theo mức) — như ERP MUC_REF.
const MUC_REF = (muc?: number | null) => muc == null ? 'bg-slate-100 text-slate-300'
  : muc >= 4 ? 'bg-emerald-100 text-emerald-700' : muc === 3 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'

type TabKey = 'ingame' | 'danhgia' | 'truocbuoi'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'ingame', label: 'Bài trên lớp' }, { key: 'danhgia', label: 'Đánh giá' }, { key: 'truocbuoi', label: 'Trước buổi' },
]

export type BuoiFull = BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi: string | null }; gv_chinh_id: string | null }

export default function ChamBuoiGv({ view, onBack }: { view: BuoiViewGv; onBack: () => void }) {
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
        <div className="mx-auto max-w-[1000px]">
          <div className="flex items-center gap-2 pb-1.5">
            <button onClick={onBack} className="rounded-lg px-2 py-1.5 text-[14px] font-semibold text-green-700 active:bg-green-50">‹ Việc của tôi</button>
            <div className="min-w-0 flex-1 text-center leading-tight">
              <p className="truncate text-[14.5px] font-bold text-slate-800">{view.lop}</p>
              <p className="text-[11px] text-slate-400">{thuCuaNgay(view.ngay)} · {ddmmVN(view.ngay)}{buoi?.lop?.mon ? ` · ${buoi.lop.mon}` : ''}</p>
            </div>
            <span className="w-[104px]" />
          </div>
          <div className="flex gap-1.5 pb-2">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`min-h-[36px] flex-1 rounded-xl text-[13px] font-semibold transition ${tab === t.key ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500 active:bg-slate-200'}`}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-[1000px] px-3 py-3 pb-10">
          {!buoi ? <p className="text-[13px] text-slate-400">Đang tải buổi…</p> : (
            <>
              {tab === 'ingame' && <IngamePanel buoi={buoi} roster={roster} tenDang={tenDang} napTenDang={napTenDang} onChange={reload} />}
              {tab === 'danhgia' && <DanhGiaPanel buoi={buoi} roster={roster} tenDang={tenDang} napTenDang={napTenDang} onChange={reload} />}
              {tab === 'truocbuoi' && (buoi.lop_id
                ? <TruocBuoiTab compact lopId={buoi.lop_id} ngayBuoi={buoi.ngay} mon={buoi.lop?.mon ?? ''} />
                : <p className="text-[13px] text-slate-400">Buổi này không gắn lớp — không có "Trước buổi".</p>)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Thanh trạng thái đóng/mở dùng chung 2 panel (tông lá cây) ──
function DongBar({ dong, dongLbl, onDong, onMoLai, closing, disabled }: {
  dong: boolean; dongLbl: string; onDong: () => void; onMoLai: () => void; closing: boolean; disabled?: boolean
}) {
  return dong ? (
    <div className="flex items-center gap-2">
      <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[12.5px] font-semibold text-emerald-700">✓ Đã xác nhận</span>
      <button onClick={onMoLai} className="min-h-[36px] rounded-lg border border-amber-300 px-2.5 text-[12.5px] font-semibold text-amber-700 active:bg-amber-50">↩ Mở lại</button>
    </div>
  ) : (
    <button onClick={onDong} disabled={closing || disabled}
      className="min-h-[36px] rounded-lg bg-green-600 px-3.5 text-[13px] font-semibold text-white active:bg-green-500 disabled:opacity-40">{closing ? 'Đang lưu…' : dongLbl}</button>
  )
}

// ── CHẤM BÀI TRÊN LỚP: 1 bài/màn — port từ app TA (ChamBuoi.tsx), đổi tông màu ──
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
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
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

// ── ĐÁNH GIÁ SAU BUỔI — khâu ĐẶC TRƯNG của GV, VIẾT MỚI touch-first (card per HS) ──
// Dạng để đánh giá = dạng đã gắn ở tab Bài trên lớp. Chip nhỏ = mức từng bài (tham khảo).
// Đóng = dongDanhGia (mốc định tính, không Elo) → recomputeHoanTat chạy trong seam.
function DanhGiaPanel({ buoi, roster, tenDang, napTenDang, onChange }: {
  buoi: BuoiFull; roster: BuoiHocHS[]; tenDang: (md: string | null) => string
  napTenDang: (mds: (string | null)[]) => Promise<void>; onChange: () => void
}) {
  const buoiId = buoi.id
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [data, setData] = useState<Record<string, DanhGiaHS>>({})
  const [canhBaos, setCanhBaos] = useState<CanhBao[]>([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const xong = !!buoi.danh_gia_xong_at
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const tenHT = tenHienThiDs(coMat.map((r) => r.hoc_sinh?.ho_ten))
  const dangs = [...new Set(probs.map((p) => p.ma_dang).filter(Boolean))] as string[]

  async function reload() {
    setLoading(true)
    try {
      const [p, g, cb] = await Promise.all([listProblems(buoiId, 'ingame'), listGrades(buoiId), listCanhBao(buoiId).catch(() => [] as CanhBao[])])
      setProbs(p); setGrades(g); setCanhBaos(cb); napTenDang(p.map((x) => x.ma_dang))
      // tách try: lỗi đọc buoi_danh_gia không được kéo sập phần chấm-theo-dạng (bài học ERP DanhGiaTab)
      try { setData(await getDanhGia(buoiId)) } catch { setData({}) }
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [buoiId]) // eslint-disable-line

  async function setDiem(hsId: string, maDang: string, cur: DanhGiaDiem | undefined, val: DanhGiaDiem) {
    const next: DanhGiaDiem | null = cur === val ? null : val // bấm lại = bỏ chọn (về chưa-đánh-giá)
    setData((d) => { const hs = d[hsId] ?? { hoc_sinh_id: hsId, nhan_xet: null, hoanThanhPct: null, muc: null, mucMa: null, diemTheoDang: {} }; const dd = { ...hs.diemTheoDang }; if (next === null) delete dd[maDang]; else dd[maDang] = next; return { ...d, [hsId]: { ...hs, diemTheoDang: dd } } })
    try { await setDanhGiaDang(buoiId, hsId, maDang, next) } catch (e: any) { alert(e.message ?? String(e)); reload() }
  }
  async function saveNX(hsId: string, txt: string) { try { await setNhanXet(buoiId, hsId, txt) } catch (e: any) { alert(e.message ?? String(e)) } }
  async function saveMuc(hsId: string, v: string) {
    const ma = v === '' ? null : v
    const muc = ma ? Number(ma[0]) : null
    setData((d) => { const hs = d[hsId] ?? { hoc_sinh_id: hsId, nhan_xet: null, hoanThanhPct: null, muc: null, mucMa: null, diemTheoDang: {} }; return { ...d, [hsId]: { ...hs, muc, mucMa: ma } } })
    try { await setMuc(buoiId, hsId, ma) } catch (e: any) { alert(e.message ?? String(e)); reload() }
  }
  async function saveND(txt: string) { try { await setNoiDungBuoi(buoiId, { noi_dung_buoi: txt.trim() || null }); onChange() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function saveMT(txt: string) { try { await setNoiDungBuoi(buoiId, { mo_ta: txt.trim() || null }); onChange() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function dong_() {
    if (closing) return
    if (!confirm('Hoàn thành đánh giá buổi này? Mở lại được nếu cần sửa.')) return
    setClosing(true)
    try { await dongDanhGia(buoiId); onChange() } catch (e: any) { alert(e?.message ?? String(e)) } finally { setClosing(false) }
  }

  // Đã điền = HS có nhận xét không rỗng HOẶC ≥1 ô chấm dạng (cùng công thức danhGiaTienDo ở gami.ts).
  const daDien = coMat.filter((r) => { const d = data[r.hoc_sinh_id]; return !!d && (!!(d.nhan_xet ?? '').trim() || Object.keys(d.diemTheoDang).length > 0) }).length

  if (loading) return <p className="text-[13px] text-slate-400">Đang tải…</p>
  if (coMat.length === 0) return <p className="text-[13px] text-slate-400">Chưa có HS điểm danh "có mặt" — OPS điểm danh trước.</p>

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className={`text-[12px] font-medium ${daDien >= coMat.length ? 'text-amber-600' : 'text-slate-400'}`}>
          Đã điền {daDien}/{coMat.length} HS{!xong && daDien >= coMat.length ? ' — chưa chốt thì hệ vẫn tính là CHƯA đánh giá' : ''}
        </span>
        <div className="ml-auto"><DongBar dong={xong} dongLbl="✓ Hoàn thành đánh giá" onDong={dong_} onMoLai={async () => { await moLaiDanhGia(buoiId); onChange() }} closing={closing} /></div>
      </div>

      {/* Nội dung buổi + Mô tả — CẤP BUỔI (chung cả lớp), Thùy 07-19. */}
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-2.5">
          <label className="mb-1 block text-[11.5px] font-semibold text-slate-500">Nội dung buổi học <span className="font-normal text-slate-400">(hiện trên ảnh gửi PH)</span></label>
          <input defaultValue={buoi.noi_dung_buoi ?? ''} onBlur={(e) => saveND(e.target.value)} disabled={xong} placeholder="vd: Số chẵn - Số lẻ"
            className="h-10 w-full rounded-lg border border-slate-200 px-2.5 text-[13px] disabled:bg-slate-50 disabled:text-slate-500" />
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-2.5">
          <label className="mb-1 block text-[11.5px] font-semibold text-slate-500">Mô tả <span className="font-normal text-slate-400">(nội bộ)</span></label>
          <input defaultValue={buoi.mo_ta ?? ''} onBlur={(e) => saveMT(e.target.value)} disabled={xong} placeholder="vd: nội dung nâng cao phần 10 điểm…"
            className="h-10 w-full rounded-lg border border-slate-200 px-2.5 text-[13px] disabled:bg-slate-50 disabled:text-slate-500" />
        </div>
      </div>

      {dangs.length === 0 && (
        <p className="mb-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
          Chưa có dạng nào — gắn dạng cho bài ở tab <b>Bài trên lớp</b> sẽ tự hiện phần chấm theo dạng. Tạm thời chỉ nhập mức + nhận xét.</p>
      )}

      <div className="flex flex-col gap-2">
        {coMat.map((r, i) => {
          const hsId = r.hoc_sinh_id; const hs = data[hsId]
          const cbHs = canhBaos.filter((c) => c.hoc_sinh_id === hsId)
          return (
            <div key={r.id} className="rounded-2xl border border-slate-200/70 bg-white p-3">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-slate-800">{tenHT[i]}</span>
                <ChuongDo buoiId={buoiId} hsId={hsId} hsTen={tenHT[i]} dangBuoi={dangs} khoi={buoi.lop?.khoi ?? ''} mon={buoi.lop?.mon}
                  tenDang={tenDang} napTenDang={napTenDang} cb={cbHs} onChanged={reload} />
              </div>
              {dangs.length > 0 && (
                <div className="mb-2 flex flex-col gap-1.5">
                  {dangs.map((md) => {
                    const cur = hs?.diemTheoDang[md]
                    const baiDang = probs.filter((p) => p.ma_dang === md)
                    return (
                      <div key={md} className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-slate-600">{tenDang(md)}</p>
                          <div className="mt-0.5 flex flex-wrap gap-0.5">
                            {baiDang.map((p) => {
                              const g = grades.find((x) => x.problem_id === p.id && x.hoc_sinh_id === hsId)
                              return <span key={p.id} title={`Bài ${p.problem_no}`} className={`inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-semibold ${MUC_REF(g?.muc)}`}>{g?.muc ?? '·'}</span>
                            })}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {DG_SCORES.map((s) => (
                            <button key={s.v} onClick={() => setDiem(hsId, md, cur, s.v)} disabled={xong}
                              className={`h-10 w-10 rounded-xl border text-[14px] font-bold transition ${cur === s.v ? s.sel : 'border-slate-200 text-slate-300'} ${xong && cur !== s.v ? 'opacity-40' : ''}`}>{s.lbl}</button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <MucPicker hsTen={tenHT[i]} muc={hs?.muc ?? null} mucMa={hs?.mucMa ?? null} disabled={xong} onPick={(ma) => saveMuc(hsId, ma ?? '')} />
                <textarea defaultValue={hs?.nhan_xet ?? ''} onBlur={(e) => saveNX(hsId, e.target.value)} readOnly={xong} placeholder="nhận xét…"
                  className="h-10 min-w-0 rounded-lg border border-slate-200 px-2.5 py-2 text-[12.5px] read-only:bg-slate-50 read-only:text-slate-500" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Chọn "Mức buổi" = POPUP FULL CHIỀU NGANG (CEO 31/08 — select hẹp đọc nhãn nhận xét khó).
// Sheet đáy màn: 11 nhãn MUC_CATALOG nhóm theo mức 5→1, mỗi nhãn 1 hàng full-width, wrap đủ dòng.
// Buổi chấm bằng bộ nhãn CŨ (có muc, chưa có mã): hiện trên nút là "(nhãn cũ)" — chọn nhãn mới = ghi đè.
const MUC_BADGE: Record<number, string> = {
  5: 'bg-emerald-600', 4: 'bg-lime-600', 3: 'bg-amber-500', 2: 'bg-orange-500', 1: 'bg-rose-600',
}
function MucPicker({ hsTen, muc, mucMa, disabled, onPick }: {
  hsTen: string; muc: number | null; mucMa: string | null; disabled: boolean; onPick: (ma: string | null) => void
}) {
  const [mo, setMo] = useState(false)
  const nhan = nhanMuc(muc, mucMa)
  return (
    <>
      <button onClick={() => !disabled && setMo(true)} disabled={disabled}
        className="flex min-h-[44px] w-full items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-left disabled:bg-slate-50">
        {muc != null && <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold text-white ${MUC_BADGE[muc]}`}>{muc}</span>}
        <span className={`min-w-0 flex-1 text-[12.5px] leading-snug ${nhan ? 'text-slate-700' : 'text-slate-400'}`}>
          {nhan ? `${nhan}${muc != null && !mucMa ? ' (nhãn cũ)' : ''}` : 'Mức buổi: chưa chọn'}</span>
        {!disabled && <span className="shrink-0 text-slate-300">▾</span>}
      </button>
      {mo && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40" onClick={() => setMo(false)}>
          <div className="max-h-[82dvh] w-full overflow-auto rounded-t-2xl bg-white p-3 shadow-2xl" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-1.5 flex items-center gap-2 px-1">
              <p className="min-w-0 flex-1 truncate text-[14px] font-bold text-slate-900">Mức buổi · {hsTen}</p>
              <button onClick={() => setMo(false)} className="rounded-lg px-2.5 py-1 text-[13px] text-slate-400 active:bg-slate-100">Đóng</button>
            </div>
            {mucMa != null && (
              <button onClick={() => { onPick(null); setMo(false) }}
                className="mb-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-[13px] text-slate-500 active:bg-slate-50">✕ Bỏ chọn (chưa chấm mức)</button>
            )}
            {MUC_OPTS.map((m) => (
              <div key={m} className="mb-1">
                {MUC_CATALOG.filter((it) => it.muc === m).map((it) => (
                  <button key={it.ma} onClick={() => { onPick(it.ma); setMo(false) }}
                    className={`mb-1 flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left active:bg-slate-50 ${mucMa === it.ma ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold text-white ${MUC_BADGE[m]}`}>{m}</span>
                    <span className="min-w-0 flex-1 text-[13px] leading-snug text-slate-700">{it.nhan}</span>
                    {mucMa === it.ma && <span className="shrink-0 font-bold text-green-600">✓</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// 🚨 chuông đỏ "HS kém dạng" ngay trong đánh giá (CEO 31/08) — tín hiệu NGƯỜI-confirm, KHÔNG vào
// điểm; nguon='danhgia' chảy thẳng vào luật duyệt bổ trợ (≥2/4 kênh HOẶC báo động). Khác chuông
// BTVN của TA: GHI CHÚ BẮT BUỘC (chốt 31/08 — GV phải nói kém chỗ nào).
// ⭐ Fix 04/09 (CEO: "không ấn được chuông"): nút từng `disabled` khi buổi chưa gắn dạng ở tab Bài trên
// lớp — mà thực tế 41/44 buổi từ 25/08 KHÔNG gắn dạng nào ⇒ chuông chết gần như mọi buổi (0 dòng
// nguon='danhgia' trong DB). Giờ luôn bấm được: dạng của buổi (nếu có) = chip bấm nhanh, còn lại chọn
// bất kỳ dạng nào trong kho khối/môn qua DangPickerOne (cùng popup với gắn dạng bài).
function ChuongDo({ buoiId, hsId, hsTen, dangBuoi, khoi, mon, tenDang, napTenDang, cb, onChanged }: {
  buoiId: string; hsId: string; hsTen: string; dangBuoi: string[]; khoi: string; mon?: string
  tenDang: (md: string | null) => string; napTenDang: (mds: (string | null)[]) => Promise<void>
  cb: CanhBao[]; onChanged: () => void
}) {
  const [mo, setMo] = useState(false)
  const [pick, setPick] = useState(false)
  const [maDang, setMaDang] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  const dangNgoai = !!maDang && !dangBuoi.includes(maDang) // dạng chọn từ kho, không thuộc buổi
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {cb.map((c) => (
        <span key={c.id} className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-1 text-[10.5px] font-semibold text-rose-700" title={c.ghi_chu ?? ''}>{tenDang(c.ma_dang)}
          <button onClick={async () => { await xoaCanhBao(c.id); onChanged() }} className="text-rose-400">✕</button></span>
      ))}
      <button onClick={() => { setMaDang(dangBuoi[0] ?? ''); setGhiChu(''); setMo(true) }}
        className="min-h-[38px] rounded-lg border border-rose-200 px-2.5 text-[12.5px] font-semibold text-rose-600 active:bg-rose-50">🚨 Báo bổ trợ</button>
      {mo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setMo(false)}>
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-1 text-[14px] font-bold text-slate-900">🚨 {hsTen} đang kém dạng</p>
            <p className="mb-2 text-[11.5px] text-slate-400">Tín hiệu này KHÔNG vào điểm — hệ thống dùng để xét bổ trợ cho con.</p>
            <p className="mb-1 text-[11.5px] font-semibold text-slate-500">Kém dạng nào?{dangBuoi.length ? <span className="font-normal text-slate-400"> · dạng của buổi này:</span> : null}</p>
            {dangBuoi.length > 0 && (
              <div className="mb-1.5 flex flex-wrap gap-1.5">
                {dangBuoi.map((md) => (
                  <button key={md} onClick={() => setMaDang(md)}
                    className={`min-h-[36px] max-w-full rounded-lg border px-2.5 text-left text-[12.5px] font-medium ${maDang === md ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 active:bg-slate-50'}`}>
                    <span className="line-clamp-2">{tenDang(md)}</span></button>
                ))}
              </div>
            )}
            <button onClick={() => setPick(true)}
              className={`mb-2 flex min-h-[44px] w-full items-center gap-2 rounded-lg border px-2.5 text-left ${dangNgoai ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`}>
              <span className={`min-w-0 flex-1 text-[13px] leading-snug ${dangNgoai ? 'font-medium text-rose-700' : 'text-slate-400'}`}>
                {dangNgoai ? tenDang(maDang) : dangBuoi.length ? '… hoặc chọn dạng khác trong kho' : 'Chọn dạng trong kho'}</span>
              <span className="shrink-0 text-slate-300">▾</span>
            </button>
            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (bắt buộc): con kém chỗ nào, biểu hiện gì…" className="mb-3 h-20 w-full rounded-lg border border-slate-300 px-2 py-1 text-[13px]" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setMo(false)} className="min-h-[40px] rounded-lg px-3 text-[13px] text-slate-500">Huỷ</button>
              <button disabled={busy || !maDang || !ghiChu.trim()} onClick={async () => {
                setBusy(true)
                try { await themCanhBao({ buoiId, hocSinhId: hsId, maDang, ghiChu: ghiChu.trim(), nguon: 'danhgia' }); setMo(false); setGhiChu(''); onChanged() }
                catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
              }} className="min-h-[40px] rounded-lg bg-rose-600 px-4 text-[13px] font-semibold text-white disabled:opacity-40">Gửi báo động</button>
            </div>
          </div>
        </div>
      )}
      {pick && <DangPickerOne khoi={khoi} mon={mon} onClose={() => setPick(false)}
        onPick={async (md) => { setPick(false); setMaDang(md); await napTenDang([md]) }} />}
    </div>
  )
}
