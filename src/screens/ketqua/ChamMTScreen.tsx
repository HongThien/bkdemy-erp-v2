// CHẤM MT — lá riêng ở Quản lý chất lượng (Thùy 08/10). Thay "Nhập điểm MT (theo tháng)" + "Chấm MT chi tiết" cũ.
// 23/10: chấm cả KHẢO SÁT GIỮA THÁNG ở đây (đề loại 'khao_sat_giua_thang' — cùng đường MT, điểm tổng vào kỳ khảo sát, DB tự
// phân loại theo đề gốc); đề khảo sát gắn nhãn KHẢO SÁT trong danh sách và trên đầu màn.
//   · Chọn lớp → đề MT (mặc định: đề khảo sát cuối tháng GẦN NHẤT còn HS chưa chấm xong) → HS (có mặt).
//   · TOÀN BỘ câu trên 1 màn, 2 cột, mỗi câu 1 dòng: [Câu N | Đ C S | điểm | 💬]. Số câu = số trên phiếu.
//   · Điểm câu: Đ = full · S = 0 · C = người chấm chọn — luật ở DB (trigger tg_gami_grades_mt_diem), màn này
//     KHÔNG tự tính. Điểm MT tổng (Cơ bản/Nâng cao) DB tự cộng khi HS đủ điểm mọi câu (fn_mt_cham_hs).
//   · Cùng dữ liệu với tab MT ở Buổi học (gami_grades phase='mt') — chấm bên nào cũng hiện bên kia.
//   · Chấm cả bài 1 phát (Đ/C/S hết) rồi sửa riêng câu lệch — như "Tất cả" ở tab MT cũ.
// Rời màn quay lại = đúng chỗ cũ (NHO module-level, CLAUDE §React).
import { useEffect, useState } from 'react'
import { listLop, type Lop } from '../../lib/nhansu'
import { supabase } from '../../lib/supabase'
import { chuanBiLuoiMT, listProblems, gradeMTChiTiet, deleteGrade, type Problem, type Grade, type ETResult } from '../../lib/gami'
import { dsBuoiChamMT, dsKyKhaoSat, dsHSChamMT, chamCaBaiMT, luuTongMT, dungDiemTuCauMT, type MTBuoiCham, type MTHSCham } from '../../lib/chamMT'
import { listMT, mtMeta, mtLoaiDeLabel, ganMTVaoBuoi, taoKyKhaoSat } from '../../lib/mt'
import type { TaiLieu } from '../../lib/tailieu'
import { laMaHinh, MT_DIEM_OPTS } from '../../lib/tailieu'
import type { MTPhanCaus } from '../../lib/mt'
import BangChuyenDeView from './BangChuyenDeView'

const MON_CO_KHO = ['Toán', 'KHTN']
// che: 'mt' = MT theo lớp (đề gán vào buổi của lớp) · 'ks' = KHẢO SÁT CHUNG (Thùy 23/10: thi chung cả khối, không theo lớp).
type Che = 'mt' | 'ks'
const NHO: { che: Che; mon: string; lopId: string | null; buoiId: string | null; hsId: string | null; lopLoc: string | null } = { che: 'mt', mon: 'Toán', lopId: null, buoiId: null, hsId: null, lopLoc: null }
const homNayVN = () => { const v = new Date(Date.now() + 7 * 3600 * 1000); return `${v.getUTCFullYear()}-${String(v.getUTCMonth() + 1).padStart(2, '0')}-${String(v.getUTCDate()).padStart(2, '0')}` }

type Dong = { p: Problem; nhom: string; hinh: string | null }
const KQ: { v: ETResult; lbl: string; on: string; off: string }[] = [
  { v: 'correct', lbl: 'Đ', on: 'bg-emerald-600 text-white', off: 'text-emerald-600 hover:bg-emerald-50' },
  { v: 'partial', lbl: 'C', on: 'bg-amber-500 text-white', off: 'text-amber-600 hover:bg-amber-50' },
  { v: 'wrong', lbl: 'S', on: 'bg-rose-600 text-white', off: 'text-rose-600 hover:bg-rose-50' },
]
const fmt = (n: number | null | undefined) => (n == null ? '—' : Number(Number(n).toFixed(2)).toString())
const mucDiem = (max: number | null | undefined, cur: number | null | undefined): number[] => {
  const s = new Set<number>([0])
  // Câu < 1đ: bước 0.125 (câu 0.25đ làm được một nửa = 0.125 — không thì C chỉ còn 0 hoặc full).
  if (max != null) { const buoc = max < 1 ? 0.125 : 0.25; for (let v = buoc; v <= max + 1e-9; v += buoc) s.add(Math.round(v * 1000) / 1000); s.add(Number(max)) }
  else MT_DIEM_OPTS.forEach((v) => s.add(v))
  if (cur != null) s.add(Number(cur))
  return [...s].sort((a, b) => a - b)
}
const laKS = (b: MTBuoiCham) => b.loai_de === 'khao_sat_giua_thang'
const xong = (h: MTHSCham) => h.so_cau > 0 && h.so_cham === h.so_cau && h.so_thieu_diem === 0

// 23/10 (Thùy): lá "Chấm MT - Khảo sát" = 1 lá chung (chỉ khác đề) + dashboard "Kết quả theo chuyên đề" ở ngay trong lá.
const NHO_TAB: { tab: 'cham' | 'chuyen_de' } = { tab: 'cham' }
export default function ChamMTScreen() {
  const [tab, setTab] = useState(NHO_TAB.tab)
  useEffect(() => { NHO_TAB.tab = tab }, [tab])
  const nut = (on: boolean) => `h-8 border-b-2 px-3 text-[13px] font-semibold ${on ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b border-slate-200 px-4 pt-2">
        <button onClick={() => setTab('cham')} className={nut(tab === 'cham')}>Chấm điểm</button>
        <button onClick={() => setTab('chuyen_de')} className={nut(tab === 'chuyen_de')}>Kết quả theo chuyên đề</button>
      </div>
      {tab === 'cham' ? <ChamMTBody /> : <div className="min-h-0 flex-1 overflow-auto p-4"><BangChuyenDeView /></div>}
    </div>
  )
}

function ChamMTBody() {
  const [che, setChe] = useState<Che>(NHO.che)
  const [lopLoc, setLopLoc] = useState<string | null>(NHO.lopLoc) // khảo sát chung: lọc HS theo lớp (chỉ xem)
  const [them, setThem] = useState(false)
  const [lanDs, setLanDs] = useState(0) // tăng ⇒ tải lại danh sách đề/kỳ (sau khi thêm)
  const [mon, setMon] = useState(NHO.mon)
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [buois, setBuois] = useState<MTBuoiCham[]>([])
  const [buoiId, setBuoiId] = useState<string | null>(NHO.buoiId)
  const [phans, setPhans] = useState<MTPhanCaus[]>([])
  const [probs, setProbs] = useState<Problem[]>([])
  const [hsList, setHsList] = useState<MTHSCham[]>([])
  const [hsId, setHsId] = useState<string | null>(NHO.hsId)
  const [grades, setGrades] = useState<Grade[]>([])
  const [loadingBuoi, setLoadingBuoi] = useState(false)
  const [loadingDe, setLoadingDe] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [moNX, setMoNX] = useState<string | null>(null)   // problem_id đang mở ô nhận xét
  const [moTL, setMoTL] = useState(false)                  // khối thi lại
  const [lanLoi, setLanLoi] = useState(0)
  useEffect(() => { Object.assign(NHO, { che, mon, lopId, buoiId, hsId, lopLoc }) }, [che, mon, lopId, buoiId, hsId, lopLoc])

  useEffect(() => {
    listLop().then((l) => setLops((l as Lop[]).filter((x) => x.trang_thai === 'dang_hoc' && x.mon === mon))).catch(() => setLops([]))
  }, [mon])

  // MT: lớp → đề đã gán · Khảo sát chung: môn → các kỳ. Mặc định: đề cuối tháng / khảo sát gần nhất còn HS chưa chấm xong.
  useEffect(() => {
    if (che === 'mt' && !lopId) { setBuois([]); setBuoiId(null); return }
    let alive = true
    setLoadingBuoi(true)
    ;(che === 'ks' ? dsKyKhaoSat(mon) : dsBuoiChamMT(lopId!)).then((bs) => {
      if (!alive) return
      setBuois(bs)
      if (bs.some((b) => b.buoi_id === NHO.buoiId)) { setBuoiId(NHO.buoiId); return }
      const cho = (b: MTBuoiCham) => !b.dong && b.so_hs_xong < b.so_hs
      const kyChinh = (b: MTBuoiCham) => b.loai_de === 'khao_sat_thang' || b.loai_de === 'khao_sat_giua_thang' // MT cuối tháng / khảo sát giữa tháng
      const macDinh = bs.find((b) => kyChinh(b) && cho(b)) ?? bs.find(cho) ?? bs[0]
      setBuoiId(macDinh?.buoi_id ?? null)
    }).catch((e) => alive && setLoi('Không tải được danh sách đề: ' + (e?.message ?? e))).finally(() => alive && setLoadingBuoi(false))
    return () => { alive = false }
  }, [che, lopId, mon, lanDs]) // eslint-disable-line

  const buoi = buois.find((b) => b.buoi_id === buoiId) ?? null
  const dong = !!buoi?.dong

  // Đề → dựng lưới (Đại + Hình, số theo phiếu, điểm tối đa từ đề — DB) + danh sách HS có mặt.
  useEffect(() => {
    setPhans([]); setProbs([]); setHsList([]); setGrades([]); setLoi(null); setMoNX(null)
    if (!buoiId) return
    let alive = true
    setLoadingDe(true)
    ;(async () => {
      const { phans: ps } = await chuanBiLuoiMT(buoiId, dong)
      const [pr, hs] = await Promise.all([listProblems(buoiId, 'mt'), dsHSChamMT(buoiId)])
      if (!alive) return
      setPhans(ps); setProbs(pr); setHsList(hs)
      if (!hs.some((h) => h.hoc_sinh_id === NHO.hsId)) setHsId((hs.find((h) => !xong(h)) ?? hs[0])?.hoc_sinh_id ?? null)
      else setHsId(NHO.hsId)
    })().catch((e) => alive && setLoi('Không tải được đề MT: ' + (e?.message ?? e))).finally(() => alive && setLoadingDe(false))
    return () => { alive = false }
  }, [buoiId]) // eslint-disable-line

  useEffect(() => {
    setGrades([]); setMoNX(null); setMoTL(false)
    if (!buoiId || !hsId) return
    let alive = true
    supabase.from('gami_grades').select('*').eq('buoi_hoc_id', buoiId).eq('hoc_sinh_id', hsId).limit(500)
      .then(({ data, error }) => { if (alive) { if (error) setLoi(error.message); else setGrades((data ?? []) as Grade[]) } })
    return () => { alive = false }
  }, [buoiId, hsId])

  // Sau mỗi lần ghi: tải lại tiến độ/điểm cả lớp ở NỀN (giữ danh sách cũ tới khi có mới — không trắng màn).
  const tongLai = () => { if (buoiId) dsHSChamMT(buoiId).then(setHsList).catch(() => {}) }
  const baoLoi = (e: unknown) => { setLoi('Lưu không được: ' + ((e as { message?: string })?.message ?? String(e))); setLanLoi((n) => n + 1) }
  const gradeOf = (pid: string) => grades.find((g) => g.problem_id === pid) ?? null
  const va = (g: Grade) => setGrades((gs) => [...gs.filter((x) => x.problem_id !== g.problem_id), g])

  async function chonKQ(p: Problem, r: ETResult) {
    if (!buoiId || !hsId || dong) return
    const g = gradeOf(p.id)
    setLoi(null)
    try {
      if (g?.result === r) {
        if (g.nhan_xet && !confirm('Bỏ chấm câu này sẽ xoá luôn nhận xét đã ghi. Tiếp tục?')) return
        await deleteGrade(p.id, hsId); setGrades((gs) => gs.filter((x) => x.problem_id !== p.id))
      } else va(await gradeMTChiTiet({ buoiId, problemId: p.id, hocSinhId: hsId, result: r, loi: [] }))
      tongLai()
    } catch (e) { baoLoi(e) }
  }
  async function chonDiem(p: Problem, v: number | null) {
    if (!buoiId || !hsId || !gradeOf(p.id)) return
    setLoi(null)
    try { va(await gradeMTChiTiet({ buoiId, problemId: p.id, hocSinhId: hsId, diemDat: v })); tongLai() } catch (e) { baoLoi(e) }
  }
  async function luuNX(p: Problem, text: string) {
    if (!buoiId || !hsId || !gradeOf(p.id)) return
    setLoi(null)
    try { va(await gradeMTChiTiet({ buoiId, problemId: p.id, hocSinhId: hsId, nhanXet: text.trim() || null })); setMoNX(null) } catch (e) { baoLoi(e) }
  }
  async function caBai(r: ETResult) {
    if (!buoiId || !hsId || dong) return
    const daCham = grades.length
    const lbl = KQ.find((k) => k.v === r)!.lbl
    if (daCham > 0 && !confirm(`HS này đã chấm ${daCham} câu — ghi đè TẤT CẢ thành "${lbl}"? (Câu đang đúng "${lbl}" giữ nguyên điểm đã chọn.)`)) return
    setLoi(null)
    try {
      await chamCaBaiMT(buoiId, hsId, r)
      const { data, error } = await supabase.from('gami_grades').select('*').eq('buoi_hoc_id', buoiId).eq('hoc_sinh_id', hsId).limit(500)
      if (error) throw error
      setGrades((data ?? []) as Grade[]); tongLai()
    } catch (e) { baoLoi(e) }
  }

  // ── Dòng chấm = ô theo problem_no (= số trên phiếu); ô Hình → hàng Hình thứ k của đề (cùng quy ước thuTuMTTheoDe).
  const hinhHang: string[] = []
  const phanCuaCau = new Map<string, string>()
  for (const ph of phans) {
    for (const ma of ph.maCaus) if (laMaHinh(ma)) hinhHang.push(ph.tieuDe)
    for (const c of ph.caus) if (!phanCuaCau.has(c.ma_cau)) phanCuaCau.set(c.ma_cau, ph.tieuDe)
  }
  const soY = new Map<number, number>(); const gapY = new Map<number, number>()
  for (const p of probs) if (p.hinh_baitoan_id) { const k = parseInt(p.hinh_nhan ?? '', 10); soY.set(k, (soY.get(k) ?? 0) + 1) }
  const dongs: Dong[] = [...probs].sort((a, b) => a.problem_no - b.problem_no).map((p) => {
    if (p.hinh_baitoan_id) {
      const k = parseInt(p.hinh_nhan ?? '', 10); const i = gapY.get(k) ?? 0; gapY.set(k, i + 1)
      return { p, nhom: hinhHang[k - 1] ?? 'Hình (thêm ở buổi học)', hinh: `H${Number.isNaN(k) ? '?' : k}${(soY.get(k) ?? 1) > 1 ? String.fromCharCode(97 + i) : ''}` }
    }
    return { p, nhom: p.ngoai_de ? '⚠ Không còn trong đề' : (phanCuaCau.get(p.ma_cau ?? '') ?? '—'), hinh: null }
  })
  const nhoms: { ten: string; dongs: Dong[] }[] = []
  for (const d of dongs) { const last = nhoms[nhoms.length - 1]; if (last && last.ten === d.nhom) last.dongs.push(d); else nhoms.push({ ten: d.nhom, dongs: [d] }) }

  // Khảo sát chung: lọc theo lớp chỉ để xem/chấm lần lượt (không đổi dữ liệu).
  const hsHien = che === 'ks' && lopLoc ? hsList.filter((h) => h.ten_lop === lopLoc) : hsList
  const lopKs = [...new Set(hsList.map((h) => h.ten_lop).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
  const hs = hsList.find((h) => h.hoc_sinh_id === hsId) ?? null
  const hsIdx = hs ? hsHien.indexOf(hs) : -1
  const soXong = hsHien.filter(xong).length
  const sortedLops = [...lops].sort((a, b) => (a.khoi ?? '').localeCompare(b.khoi ?? '', 'vi', { numeric: true }) || a.ten_lop.localeCompare(b.ten_lop, 'vi', { numeric: true }))
  const thieuDiem = grades.filter((g) => g.diem_dat == null).length

  return (
    <div className="flex min-h-0 flex-1 gap-3 p-4">
      {/* ── CỘT TRÁI: lớp → đề → HS ── */}
      <div className="flex w-64 shrink-0 flex-col gap-2">
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {([['mt', 'MT · theo lớp'], ['ks', 'Khảo sát · thi chung']] as [Che, string][]).map(([v, l]) => (
            <button key={v} onClick={() => { if (v !== che) { setChe(v); setBuoiId(null); setHsId(null) } }}
              className={`h-8 flex-1 text-[12.5px] font-semibold ${che === v ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}>{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {MON_CO_KHO.map((m) => <button key={m} onClick={() => { setMon(m); setLopId(null) }} className={`h-7 rounded-md px-3 text-[13px] font-semibold ${mon === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{m}</button>)}
        </div>
        {che === 'mt' && (
          <select value={lopId ?? ''} onChange={(e) => setLopId(e.target.value || null)} className="h-8 w-full rounded border border-slate-300 px-2 text-[13px]">
            <option value="">— chọn lớp —</option>
            {sortedLops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop}{l.khoi ? ` · K${l.khoi}` : ''}</option>)}
          </select>
        )}
        {(che === 'ks' || lopId) && (
          <div className="flex gap-1">
            <select value={buoiId ?? ''} onChange={(e) => setBuoiId(e.target.value || null)} className="h-8 min-w-0 flex-1 rounded border border-slate-300 px-2 text-[12.5px]">
              {loadingBuoi ? <option value="">Đang tải…</option> : buois.length === 0 ? <option value="">{che === 'ks' ? 'Chưa có kỳ khảo sát nào' : 'Lớp chưa có đề MT nào được gán'}</option> : null}
              {buois.map((b) => <option key={b.buoi_id} value={b.buoi_id}>{b.ngay.split('-').reverse().slice(0, 2).join('/')} · {che === 'mt' && laKS(b) ? 'KHẢO SÁT · ' : ''}{che === 'ks' && b.khoi ? `K${b.khoi} · ` : ''}{b.ten} · {b.so_hs_xong}/{b.so_hs}{b.dong ? ' · đã đóng' : ''}</option>)}
            </select>
            <button onClick={() => setThem(true)} title={che === 'ks' ? 'Thêm kỳ khảo sát chung (đề + ngày thi)' : 'Gán đề MT cho lớp này (đề + ngày thi)'}
              className="h-8 shrink-0 rounded border border-indigo-300 bg-indigo-50 px-2 text-[12.5px] font-semibold text-indigo-700 hover:bg-indigo-100">+ Đề</button>
          </div>
        )}
        {che === 'ks' && buoiId && lopKs.length > 1 && (
          <select value={lopLoc ?? ''} onChange={(e) => setLopLoc(e.target.value || null)} className="h-8 w-full rounded border border-slate-300 px-2 text-[12.5px]">
            <option value="">Mọi lớp</option>
            {lopKs.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        )}
        {buoiId && (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1">
            <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">{che === 'ks' ? 'Học sinh của khối' : 'Học sinh có mặt'} · xong {soXong}/{hsHien.length}</div>
            {hsHien.map((h) => {
              const on = h.hoc_sinh_id === hsId
              const tt = h.nguon === 'tay' ? { t: `tay ${fmt(h.diem)}`, c: 'bg-amber-100 text-amber-800' }
                : xong(h) ? { t: fmt(h.diem), c: 'bg-emerald-100 text-emerald-700' }
                : h.so_cham === 0 ? { t: 'chưa', c: 'bg-slate-100 text-slate-400' }
                : { t: `còn ${h.so_cau - h.so_cham + h.so_thieu_diem}`, c: 'bg-rose-100 text-rose-700' }
              return (
                <button key={h.hoc_sinh_id} onClick={() => setHsId(h.hoc_sinh_id)}
                  className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-[13px] ${on ? 'bg-indigo-600 font-semibold text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <span className="truncate">{h.ho_ten}{che === 'ks' && !lopLoc && h.ten_lop ? <span className={`ml-1 text-[10.5px] font-normal ${on ? 'text-indigo-100' : 'text-slate-400'}`}>{h.ten_lop}</span> : null}</span>
                  <span className={`shrink-0 rounded px-1.5 text-[10.5px] font-semibold ${on ? 'bg-white/20 text-white' : tt.c}`}>{tt.t}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── BÊN PHẢI: toàn bộ câu của 1 HS ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {loi && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
        {them && <ThemDe che={che} mon={mon} lop={lops.find((l) => l.id === lopId) ?? null} onDong={() => setThem(false)}
          onXong={(id) => { setThem(false); NHO.buoiId = id; setBuoiId(id); setLanDs((n) => n + 1) }} />}
        {che === 'mt' && !lopId ? <Trong>Chọn lớp bên trái.</Trong>
          : !buoiId ? <Trong>{loadingBuoi ? 'Đang tải…' : che === 'ks' ? 'Chưa có kỳ khảo sát nào — bấm "+ Đề" để thêm (chọn đề + ngày thi).' : 'Lớp này chưa có đề MT nào được gán — bấm "+ Đề" để gán.'}</Trong>
          : loadingDe ? <p className="text-sm text-slate-500">Đang tải đề…</p>
          : !hs ? <Trong>{hsList.length ? 'Chọn 1 học sinh.' : che === 'ks' ? 'Khối của đề chưa có HS đang học môn này.' : 'Buổi này chưa có HS điểm danh "có mặt".'}</Trong>
          : (
            <>
              <div className="mb-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => hsIdx > 0 && setHsId(hsHien[hsIdx - 1].hoc_sinh_id)} disabled={hsIdx <= 0} className="h-7 w-7 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30" title="HS trước">‹</button>
                  <span className="text-[15px] font-semibold text-slate-800">{hs.ho_ten}</span>
                  {che === 'ks' && hs.ten_lop && <span className="text-[12px] text-slate-500">{hs.ten_lop}</span>}
                  {buoi && (che === 'ks' || laKS(buoi)) && <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[11px] font-bold text-teal-800" title="Đề khảo sát giữa tháng — điểm vào Xếp hạng khảo sát, không tính Level/xu">KHẢO SÁT</span>}
                  <button onClick={() => hsIdx < hsHien.length - 1 && setHsId(hsHien[hsIdx + 1].hoc_sinh_id)} disabled={hsIdx >= hsHien.length - 1} className="h-7 w-7 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30" title="HS sau">›</button>
                  <span className="ml-2 text-[12px] text-slate-500">Chấm cả bài:</span>
                  <div className="flex overflow-hidden rounded border border-slate-300">
                    {KQ.map((k) => <button key={k.v} onClick={() => caBai(k.v)} disabled={dong || !probs.length} className={`h-7 w-9 border-r border-slate-200 text-[12.5px] font-bold last:border-r-0 disabled:opacity-40 ${k.off}`} title={`Tất cả câu = ${k.lbl}, sau đó sửa riêng câu lệch`}>{k.lbl}</button>)}
                  </div>
                  <DiemTong hs={hs} dong={dong} thieuDiem={thieuDiem}
                    onDungCau={async () => { if (!buoiId) return; if (!confirm('Bỏ điểm nhập tay, dùng điểm cộng từ các câu đã chấm?')) return; try { await dungDiemTuCauMT(buoiId, hs.hoc_sinh_id); tongLai() } catch (e) { baoLoi(e) } }} />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
                  {dong && <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-800">MT đã đóng (Elo đã tính) — khoá Đ/C/S; điểm câu, nhận xét, thi lại vẫn sửa được. Sửa Đ/C/S: tab MT ở buổi học → Mở lại.</span>}
                  <label className="flex items-center gap-1"><input type="checkbox" checked={hs.full_diem} onChange={(e) => luuTong({ full: e.target.checked })} className="h-3.5 w-3.5 accent-violet-600" />Full (10đ)</label>
                  <button onClick={() => setMoTL((v) => !v)} className={`rounded px-2 py-0.5 font-medium ${hs.diem_thi_lai != null || moTL ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}>Thi lại{hs.diem_thi_lai != null ? `: ${fmt(hs.diem_thi_lai)}` : ''}</button>
                  {moTL && <ThiLai key={`${hs.hoc_sinh_id}|${lanLoi}`} hs={hs} onLuu={(cb, nc, f) => luuTong({ tlCoBan: cb, tlNangCao: nc, fullThiLai: f })} />}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <div className="gap-4 [column-width:21rem]">
                  {nhoms.map((nh, ni) => (
                    <div key={ni} className="mb-2 break-inside-avoid-column">
                      <div className="px-1 pb-0.5 pt-1 text-[11.5px] font-semibold text-slate-500">{nh.ten}</div>
                      {nh.dongs.map((d) => <DongCau key={`${hsId}|${d.p.id}`} d={d} g={gradeOf(d.p.id)} dong={dong} moNX={moNX === d.p.id} lanLoi={lanLoi}
                        onKQ={(r) => chonKQ(d.p, r)} onDiem={(v) => chonDiem(d.p, v)} onMoNX={() => setMoNX(moNX === d.p.id ? null : d.p.id)} onNX={(t) => luuNX(d.p, t)} />)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  )

  async function luuTong(patch: { full?: boolean; tlCoBan?: number | null; tlNangCao?: number | null; fullThiLai?: boolean }) {
    if (!buoiId || !hs) return
    setLoi(null)
    try {
      await luuTongMT(buoiId, hs.hoc_sinh_id, {
        full: patch.full ?? hs.full_diem,
        tlCoBan: patch.tlCoBan !== undefined ? patch.tlCoBan : hs.tl_co_ban,
        tlNangCao: patch.tlNangCao !== undefined ? patch.tlNangCao : hs.tl_nang_cao,
        fullThiLai: patch.fullThiLai ?? hs.full_thi_lai,
      })
      tongLai()
    } catch (e) { baoLoi(e) }
  }
}

function Trong({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">{children}</div>
}

// Điểm MT tổng của HS — số do DB tính (fn_mt_cham_hs). Nhập tay (trước 08/10) giữ nguyên tới khi người chấm chuyển.
function DiemTong({ hs, dong, thieuDiem, onDungCau }: { hs: MTHSCham; dong: boolean; thieuDiem: number; onDungCau: () => void }) {
  void dong
  const khung = (k: number | null) => (k == null ? '' : `/${fmt(k)}`)
  const chuaCham = hs.so_cau - hs.so_cham
  return (
    <div className="ml-auto flex flex-wrap items-center gap-2 text-[12.5px]">
      {hs.nguon === 'tay' ? (
        <>
          <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-800" title="Điểm nhập tay trước 08/10 — không tự đổi theo câu">Nhập tay: CB {fmt(hs.diem_co_ban)} · NC {fmt(hs.diem_nang_cao)} · <b>{fmt(hs.diem)}</b></span>
          <span className="text-slate-500">từ câu: {fmt(hs.tinh_co_ban)} + {fmt(hs.tinh_nang_cao)}{chuaCham + hs.so_thieu_diem > 0 ? ' (chưa đủ)' : ''}</span>
          <button onClick={onDungCau} className="rounded border border-amber-300 px-2 py-0.5 text-[12px] font-medium text-amber-800 hover:bg-amber-50">Dùng điểm từ câu</button>
        </>
      ) : (
        <>
          <span className="text-slate-600">Cơ bản <b className="text-slate-800">{fmt(hs.tinh_co_ban)}</b>{khung(hs.khung_co_ban)}</span>
          <span className="text-slate-600">Nâng cao <b className="text-slate-800">{fmt(hs.tinh_nang_cao)}</b>{khung(hs.khung_nang_cao)}</span>
          {chuaCham + thieuDiem > 0
            ? <span className="rounded bg-rose-50 px-2 py-0.5 font-medium text-rose-700">Chưa đủ: {chuaCham > 0 ? `${chuaCham} câu chưa chấm` : ''}{chuaCham > 0 && thieuDiem > 0 ? ' · ' : ''}{thieuDiem > 0 ? `${thieuDiem} câu chưa có điểm` : ''}</span>
            : <span className="rounded bg-violet-100 px-2 py-0.5 text-violet-800">Điểm MT <b>{fmt(hs.diem)}</b></span>}
        </>
      )}
    </div>
  )
}

function ThiLai({ hs, onLuu }: { hs: MTHSCham; onLuu: (cb: number | null, nc: number | null, full: boolean) => void }) {
  const [cb, setCb] = useState(hs.tl_co_ban != null ? String(hs.tl_co_ban) : '')
  const [nc, setNc] = useState(hs.tl_nang_cao != null ? String(hs.tl_nang_cao) : '')
  const [full, setFull] = useState(hs.full_thi_lai)
  const so = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')))
  const inp = 'h-7 w-14 rounded border border-amber-300 bg-amber-50/40 px-1.5 text-[12.5px]'
  return (
    <span className="flex items-center gap-2">
      <label className="flex items-center gap-1">CB <input value={cb} onChange={(e) => setCb(e.target.value)} inputMode="decimal" className={inp} /></label>
      <label className="flex items-center gap-1">NC <input value={nc} onChange={(e) => setNc(e.target.value)} inputMode="decimal" className={inp} /></label>
      <label className="flex items-center gap-1"><input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} className="h-3.5 w-3.5 accent-amber-600" />Full</label>
      <button onClick={() => onLuu(so(cb), so(nc), full)} className="rounded bg-amber-600 px-2 py-0.5 text-[12px] font-medium text-white hover:bg-amber-500">Lưu thi lại</button>
    </span>
  )
}

function DongCau({ d, g, dong, moNX, lanLoi, onKQ, onDiem, onMoNX, onNX }: {
  d: Dong; g: Grade | null; dong: boolean; moNX: boolean; lanLoi: number
  onKQ: (r: ETResult) => void; onDiem: (v: number | null) => void; onMoNX: () => void; onNX: (t: string) => void
}) {
  const max = d.p.diem_toi_da ?? null
  const canChon = !!g && g.diem_dat == null   // C (hoặc ý Hình đề cũ) chưa có điểm ⇒ người chấm phải chọn
  return (
    <div className={`mb-[3px] rounded-md border px-1.5 py-px ${d.hinh ? 'border-amber-100 bg-amber-50/40' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-center gap-1.5">
        <span className="w-[52px] shrink-0 text-[12.5px] font-bold text-violet-600" title={`${d.p.ma_cau ?? 'Hình'} · tối đa ${max == null ? 'tự cho' : fmt(max) + 'đ'}`}>Câu {d.p.problem_no}</span>
        <div className="flex shrink-0 overflow-hidden rounded border border-slate-300">
          {KQ.map((k) => {
            const on = g?.result === k.v
            return <button key={k.v} onClick={() => onKQ(k.v)} disabled={dong} className={`h-6 w-8 border-r border-slate-200 text-[12px] font-bold last:border-r-0 disabled:cursor-not-allowed ${on ? k.on : k.off} ${dong && !on ? 'opacity-40' : ''}`}>{k.lbl}</button>
          })}
        </div>
        <select value={g?.diem_dat != null ? String(Number(g.diem_dat)) : ''} onChange={(e) => onDiem(e.target.value === '' ? null : Number(e.target.value))} disabled={!g}
          title={!g ? 'Chọn Đ/C/S trước' : canChon ? 'Câu C — chọn điểm HS đạt' : `Điểm HS đạt (tối đa ${max == null ? 'tự cho' : fmt(max) + 'đ'})`}
          className={`h-6 w-[68px] shrink-0 rounded border bg-white px-0.5 text-[12px] font-medium disabled:bg-slate-50 disabled:text-slate-300 ${canChon ? 'border-amber-400 bg-amber-50 text-amber-800 ring-1 ring-amber-300' : 'border-slate-300 text-slate-700'}`}>
          <option value="">{canChon ? 'chọn…' : '—'}</option>
          {mucDiem(max, g?.diem_dat ?? null).map((v) => <option key={v} value={String(v)}>{fmt(v)}đ</option>)}
        </select>
        <span className="w-[34px] shrink-0 text-[10.5px] text-slate-400">{max == null ? '' : `/${fmt(max)}`}</span>
        {d.hinh && <span className="shrink-0 rounded bg-amber-100 px-1 text-[10px] font-semibold text-amber-700" title="Ý bài Hình">{d.hinh}</span>}
        <button onClick={onMoNX} disabled={!g} title={g?.nhan_xet ? g.nhan_xet : g ? 'Thêm nhận xét riêng cho câu này' : 'Chọn Đ/C/S trước'}
          className={`ml-auto h-6 shrink-0 rounded px-1.5 text-[12px] disabled:opacity-30 ${g?.nhan_xet ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:bg-slate-100'}`}>💬</button>
      </div>
      {moNX && g && (
        <input key={lanLoi} autoFocus defaultValue={g.nhan_xet ?? ''} placeholder="Nhận xét câu này — Enter để lưu"
          onKeyDown={(e) => { if (e.key === 'Enter') onNX(e.currentTarget.value); if (e.key === 'Escape') onMoNX() }}
          onBlur={(e) => { if (e.target.value.trim() !== (g.nhan_xet ?? '')) onNX(e.target.value) }}
          className="mb-0.5 mt-0.5 h-7 w-full rounded border border-violet-300 px-2 text-[12.5px]" />
      )}
      {!moNX && g?.nhan_xet && <div className="truncate pl-[58px] text-[11.5px] italic text-violet-600">{g.nhan_xet}</div>}
    </div>
  )
}

// ── THÊM ĐỀ (Thùy 23/10: "cho người dùng tự add đề thi vào") ─────────────────────────────────
// MT: gán đề vào buổi của LỚP đang chọn (cùng hàm "Gán vào buổi" ở màn soạn MT) · Khảo sát: tạo kỳ THI CHUNG (đề + ngày),
// danh sách chấm = mọi HS của khối đề. Đề nào cũng chọn được; danh sách ưu tiên đúng loại đề theo chế độ.
function ThemDe({ che, mon, lop, onDong, onXong }: { che: Che; mon: string; lop: Lop | null; onDong: () => void; onXong: (buoiId: string) => void }) {
  const [tim, setTim] = useState('')
  const [ds, setDs] = useState<TaiLieu[]>([])
  const [deId, setDeId] = useState<string | null>(null)
  const [ngay, setNgay] = useState(homNayVN())
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    const t = setTimeout(() => { listMT(mon, tim.trim() ? { search: tim } : undefined).then((r) => { if (alive) setDs(r) }).catch(() => {}) }, 250)
    return () => { alive = false; clearTimeout(t) }
  }, [mon, tim])
  const dungLoai = (d: TaiLieu) => (mtMeta(d).loaiDe === 'khao_sat_giua_thang') === (che === 'ks')
  const hien = [...ds].filter((d) => che === 'ks' || !lop?.khoi || !d.khoi || d.khoi === lop.khoi).sort((a, b) => Number(dungLoai(b)) - Number(dungLoai(a)))
  async function luu() {
    if (!deId) return
    setDang(true); setLoi(null)
    try {
      const id = che === 'ks' ? await taoKyKhaoSat(deId, ngay) : (await ganMTVaoBuoi(deId, { lopId: lop!.id, ngay })).buoiId
      onXong(id)
    } catch (e) { setLoi((e as { message?: string })?.message ?? String(e)) } finally { setDang(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" onClick={onDong}>
      <div className="flex max-h-[85vh] w-[560px] max-w-full flex-col rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[15px] font-semibold text-slate-900">{che === 'ks' ? 'Thêm kỳ khảo sát chung' : `Gán đề MT cho lớp ${lop?.ten_lop ?? ''}`}</div>
        <div className="mb-3 text-[12px] text-slate-500">{che === 'ks'
          ? 'Thi chung cả khối: danh sách chấm = mọi HS đang học môn này ở khối của đề. Cùng đề + cùng ngày thì mở lại đúng kỳ đã có.'
          : 'Gán đề vào buổi của lớp vào ngày thi (như "Gán vào buổi" ở màn soạn MT). Gán lại cùng đề cho lớp này thì thay ngày cũ.'}</div>
        <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm đề theo tên…" className="mb-2 h-9 w-full rounded-lg border border-slate-300 px-3 text-[13px]" autoFocus />
        <div className="min-h-[160px] flex-1 overflow-y-auto rounded-lg border border-slate-200">
          {hien.length === 0 ? <p className="p-4 text-center text-[12px] text-slate-400">Không có đề nào{tim ? ' khớp' : ''}.</p>
            : hien.map((d) => (
              <button key={d.id} onClick={() => setDeId(d.id)} className={`flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2 text-left text-[13px] last:border-0 ${deId === d.id ? 'bg-indigo-50 font-semibold text-indigo-800' : 'hover:bg-slate-50'}`}>
                <span className="min-w-0 flex-1 truncate">{d.ten}</span>
                {d.khoi && <span className="shrink-0 text-[11px] text-slate-400">K{d.khoi}</span>}
                <span className={`shrink-0 rounded px-1.5 text-[10.5px] font-semibold ${mtMeta(d).loaiDe === 'khao_sat_giua_thang' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>{mtLoaiDeLabel(mtMeta(d).loaiDe) || 'Chưa gắn loại'}</span>
              </button>
            ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="flex items-center gap-2 text-[13px] text-slate-600">Ngày thi
            <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="h-9 rounded-lg border border-slate-300 px-2 text-[13px]" />
          </label>
          {loi && <span className="text-[12px] text-rose-700">{loi}</span>}
          <button onClick={onDong} className="ml-auto rounded-lg px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={luu} disabled={!deId || !ngay || dang || (che === 'mt' && !lop)} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">{dang ? 'Đang thêm…' : 'Thêm'}</button>
        </div>
      </div>
    </div>
  )
}
