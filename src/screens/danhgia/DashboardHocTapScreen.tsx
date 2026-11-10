// Dashboard học tập (leaf `db_hoctap`) — DỰNG LẠI 23/10 (Thùy: "hủy toàn bộ chức năng cũ"; luồng duyệt level / mở case cũ
// bỏ khỏi lá này, hàm + bảng DB cũ giữ nguyên). Bảng giống MT - Khảo sát: Tên · Lớp · mỗi Chuyên đề / Nhóm bài BẢN ĐỒ MỚI
// 1 cột, % = TB ≤5 LẦN gần nhất (1 lần = 1 bài làm; Thùy 10/11 thay 10 câu) trong 2–4 tuần. Bấm ô ⇒ CỬA SỔ NỔI lịch sử ô đó (kéo thả, mở nhiều cái cùng lúc).
// Kênh song song với mastery (công thức khác có chủ ý — xem mig 202610231524). Mọi con số từ DB (§2.0); client chỉ lọc lớp,
// sắp cột đang bấm, định dạng.
import { Fragment, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import { bangDashboardHocTap, lichSuO, TEN_KENH, type BangDB, type CapDB, type HSDB, type LichSuO } from '../../lib/dashboardHocTap'
import { NHAN_TT } from '../../lib/boTroTk'
import BoTroPopup from '../phongtk/BoTroPopup'

// Dùng trong PHÒNG TRƯỞNG KHỐI (Thùy 10/11): chỉ các ô (môn, khối) trong phạm vi · cột Bổ trợ · bấm tên ⇒ Hồ sơ học tập.
// dau: khối đặt ĐẦU thanh lọc (vd thanh 4 mục của Chất lượng) — Thùy 10/11: dồn hết thanh đầu về 1 dòng
export type DashboardPhong = { o: { mon: string; khoi: string }[]; onMoHoSo?: (hsId: string, mon: string) => void; dau?: ReactNode }

type Cua = { id: string; hs: HSDB; cap: CapDB; ma: string; tenCot: string; x: number; y: number; z: number; data?: LichSuO; loi?: string }

// Rời tab quay lại = đúng chỗ cũ, kể cả các cửa sổ đang mở (CLAUDE §React).
const NHO: {
  mon: string; khoi: string | null; soTuan: number; cap: CapDB; lopId: string | null; sap: { cot: string; tang: boolean }
  bang: BangDB | null; khoaBang: string; cua: Cua[]; zMax: number
} = { mon: 'Toán', khoi: null, soTuan: 4, cap: 'chuyen_de', lopId: null, sap: { cot: 'lop', tang: true }, bang: null, khoaBang: '', cua: [], zMax: 60 }

const TEN_CAP: Record<CapDB, string> = { chu_de: 'chủ đề', chuyen_de: 'chuyên đề', nhom: 'nhóm bài' }
const mauPct = (p: number | undefined) => p == null ? 'text-slate-300'
  : p >= 80 ? 'bg-emerald-100 text-emerald-800' : p >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
const so = (v: number) => Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })
const thO = 'border-b border-slate-200 px-1.5 py-1 text-center font-semibold'
const tdO = 'border-b border-slate-100 px-1.5 py-1'
const ngayVN = (d: string | null) => d ? d.split('-').reverse().slice(0, 2).join('/') : ''
const gioVN = (t: string) => new Date(t).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })

export default function DashboardHocTapScreen({ phong }: { phong?: DashboardPhong } = {}) {
  const [mons, setMons] = useState<string[]>([])
  const [khois, setKhois] = useState<string[]>([])
  const [mon, setMon] = useState(NHO.mon)
  const [khoi, setKhoi] = useState<string | null>(NHO.khoi)
  const [soTuan] = useState(NHO.soTuan)   // 10/11: ô = mastery theo lần, không lọc tuần nữa — giữ tham số cho chữ ký hàm DB
  const [cap, setCap] = useState<CapDB>(NHO.cap)
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [sap, setSap] = useState(NHO.sap)
  const [bang, setBang] = useState<BangDB | null>(NHO.bang)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [cua, setCua] = useState<Cua[]>(NHO.cua)
  const [lamMoi, setLamMoi] = useState(0)
  const [boTro, setBoTro] = useState<HSDB | null>(null)
  const goc = useRef<HTMLDivElement>(null)
  // App có thể bọc trong khung `zoom` (cỡ chữ) ⇒ toạ độ fixed bên trong bị nhân theo; quy toạ độ chuột về đơn vị của khung.
  const tiLe = () => { const el = goc.current; return el && el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1 }
  useEffect(() => { Object.assign(NHO, { mon, khoi, soTuan, cap, lopId, sap, bang, cua }) }, [mon, khoi, soTuan, cap, lopId, sap, bang, cua])

  // danh sách môn / khối = lớp đang học (chỉ để dựng nút lọc)
  useEffect(() => {
    if (phong) {   // phòng: chỉ ô trong phạm vi của ghế
      setMons([...new Set(phong.o.map((x) => x.mon))].sort((a, b) => a.localeCompare(b, 'vi')))
      const ks = [...new Set(phong.o.filter((x) => x.mon === mon).map((x) => x.khoi))].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
      setKhois(ks)
      if (!ks.length && phong.o.length && phong.o[0].mon !== mon) { setMon(phong.o[0].mon); return }
      if (!khoi || !ks.includes(khoi)) setKhoi(ks[0] ?? null)
      return
    }
    let alive = true
    supabase.from('lop').select('mon, khoi').eq('trang_thai', 'dang_hoc').limit(1000).then(({ data }) => {
      if (!alive) return
      const ds = (data ?? []) as { mon: string; khoi: string | null }[]
      setMons([...new Set(ds.map((l) => l.mon))].sort((a, b) => a.localeCompare(b, 'vi')))
      const ks = [...new Set(ds.filter((l) => l.mon === mon && l.khoi).map((l) => l.khoi as string))]
        .sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
      setKhois(ks)
      if (!khoi || !ks.includes(khoi)) setKhoi(ks.find((k) => k === '6') ?? ks[0] ?? null)
    })
    return () => { alive = false }
  }, [mon, phong]) // eslint-disable-line react-hooks/exhaustive-deps

  // Đổi ngữ cảnh (môn/khối/tuần/cấp) ⇒ tải lại bảng; quay lại tab cùng ngữ cảnh ⇒ dùng bảng đã nhớ
  useEffect(() => {
    if (!khoi) return
    const khoa = [mon, khoi, soTuan, cap].join('|')
    if (lamMoi === 0 && NHO.bang && NHO.khoaBang === khoa) return
    let alive = true
    setLoi(null); setDangTai(true)
    if (NHO.khoaBang !== khoa) setBang(null)
    bangDashboardHocTap(mon, khoi, soTuan, cap)
      .then((b) => { if (alive) { NHO.khoaBang = khoa; setBang(b) } })
      .catch((e) => alive && setLoi('Không tải được bảng: ' + (e?.message ?? e)))
      .finally(() => alive && setDangTai(false))
    return () => { alive = false }
  }, [mon, khoi, soTuan, cap, lamMoi])

  const lops = bang ? [...new Map(bang.hs.map((h) => [h.lop_id, h.lop])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi', { numeric: true })) : []
  const hien = (bang?.hs ?? []).filter((h) => !lopId || h.lop_id === lopId)
  const giaTri = (h: HSDB, cot: string): number | string | null => cot === 'ten' ? h.ten : cot === 'lop' ? h.lop : cot === 'ny' ? (h.nhom_yeu ?? null) : (h.o[cot]?.p ?? null)
  const sapXep = [...hien].sort((a, b) => {
    const x = giaTri(a, sap.cot), y = giaTri(b, sap.cot)
    if (x == null && y == null) return a.ten.localeCompare(b.ten, 'vi')
    if (x == null) return 1
    if (y == null) return -1
    const s = typeof x === 'string' ? x.localeCompare(String(y), 'vi', { numeric: true }) : (x as number) - (y as number)
    return (sap.tang ? s : -s) || a.ten.localeCompare(b.ten, 'vi')
  })
  const bamCot = (cot: string) => setSap((s) => s.cot === cot ? { cot, tang: !s.tang } : { cot, tang: cot === 'ten' || cot === 'lop' })
  // sau khi lưu 1 em ⇒ vá đúng dòng đó tại chỗ (CLAUDE §React: không tải lại cả bảng)
  const vaBt = (hsId: string, bt: HSDB['bt']) => setBang((b) => b && ({ ...b, hs: b.hs.map((h) => h.id === hsId ? { ...h, bt } : h) }))
  const muiTen = (cot: string) => sap.cot === cot ? (sap.tang ? ' ▲' : ' ▼') : ''
  const th = 'sticky top-0 z-10 cursor-pointer select-none border-b border-slate-200 bg-slate-50 px-2 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100'

  // ── cửa sổ nổi ──
  const lenTren = (id: string) => setCua((cs) => cs.map((c) => c.id === id ? { ...c, z: ++NHO.zMax } : c))
  const dong = (id: string) => setCua((cs) => cs.filter((c) => c.id !== id))
  const doi = (id: string, va: Partial<Cua>) => setCua((cs) => cs.map((c) => c.id === id ? { ...c, ...va } : c))
  const moCua = (h: HSDB, ma: string, tenCot: string, ev: MouseEvent) => {
    const id = [h.id, cap, ma, soTuan].join('|')
    if (cua.some((c) => c.id === id)) { lenTren(id); return }
    const z = tiLe(), W = 540
    const x = Math.max(8, Math.min(ev.clientX / z + 12, window.innerWidth / z - W - 8))
    const y = Math.max(8, Math.min(ev.clientY / z - 40, window.innerHeight / z - 420))
    setCua((cs) => [...cs, { id, hs: h, cap, ma, tenCot, x, y, z: ++NHO.zMax }])
    lichSuO(h.id, mon, cap, ma, soTuan)
      .then((d) => doi(id, { data: d }))
      .catch((e) => doi(id, { loi: String(e?.message ?? e) }))
  }

  const nut = (on: boolean) => `h-8 px-2.5 text-[12.5px] font-semibold ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`
  return (
    <div ref={goc} className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {phong?.dau}
        {mons.length > 1 ? (
          <select value={mon} onChange={(e) => { setMon(e.target.value); setLopId(null) }} className="h-8 rounded border border-slate-300 bg-white px-2 text-[13px] font-semibold text-slate-800">
            {mons.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        ) : <span className="px-1 text-[13px] font-semibold text-slate-700">{mon}</span>}
        <select value={khoi ?? ''} onChange={(e) => { setKhoi(e.target.value || null); setLopId(null) }} className="h-8 rounded border border-slate-300 bg-white px-2 text-[13px] text-slate-800">
          {khois.length === 0 && <option value="">Chưa có lớp</option>}
          {khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {([['chu_de', 'Chủ đề'], ['chuyen_de', 'Chuyên đề'], ['nhom', 'Nhóm bài']] as [CapDB, string][]).map(([v, l]) => (
            <button key={v} onClick={() => { setCap(v); if (sap.cot !== 'ten' && sap.cot !== 'lop') setSap({ cot: 'lop', tang: true }) }} className={nut(cap === v)}>{l}</button>
          ))}
        </div>
        {lops.length > 1 && (
          <select value={lopId ?? ''} onChange={(e) => setLopId(e.target.value || null)} className="h-8 rounded border border-slate-300 bg-white px-2 text-[13px] text-slate-800">
            <option value="">Cả khối</option>
            {lops.map(([id, ten]) => <option key={id} value={id}>Lớp {ten}</option>)}
          </select>
        )}
        <button onClick={() => setLamMoi((x) => x + 1)} title="Đọc lại" className="h-8 rounded-md px-2 text-[14px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻</button>
        {cua.length > 0 && <button onClick={() => setCua([])} className="ml-auto h-7 rounded-md px-3 text-[12px] font-semibold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">Đóng {cua.length} cửa sổ</button>}
      </div>
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {!bang ? (dangTai ? <p className="text-sm text-slate-500">Đang tính bảng…</p> : null)
        : bang.cot.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Khối này chưa có lần đo nào theo bản đồ mới.</div>
        : (
          <>
            <div className={`max-h-[calc(100vh-230px)] overflow-auto rounded-xl border border-slate-200 bg-white ${dangTai ? 'opacity-60' : ''}`}>
              <table className="min-w-full border-separate border-spacing-0 text-[12.5px]">
                <thead>
                  <tr>
                    <th onClick={() => bamCot('ten')} className={`${th} sticky left-0 z-20 min-w-[170px] text-left`}>Tên{muiTen('ten')}</th>
                    <th onClick={() => bamCot('ny')} title="Số NHÓM bài đang yếu (mastery 5 lần gần nhất) · số nhỏ = số DẠNG yếu" className={`${th} whitespace-nowrap text-center`}>Nhóm yếu{muiTen('ny')}</th>
                    <th onClick={() => bamCot('lop')} className={`${th} text-left`}>Lớp{muiTen('lop')}</th>
                    {bang.cot.map((c) => (
                      <th key={c.ma} onClick={() => bamCot(c.ma)} title={c.cha ? `${c.cha} › ${c.ten}` : c.ten} className={`${th} w-[92px] min-w-[92px] align-bottom`}>
                        {c.cha && <div className="mb-0.5 line-clamp-1 text-center text-[10px] font-normal text-slate-400">{c.cha}</div>}
                        <div className="line-clamp-3 text-center leading-tight">{c.ten}{muiTen(c.ma)}</div>
                      </th>
                    ))}
                    {phong && <th className={`${th} sticky right-0 z-20 cursor-default whitespace-nowrap text-center`}>Bổ trợ</th>}
                  </tr>
                </thead>
                <tbody>
                  {sapXep.map((h) => (
                    <tr key={h.id} className="hover:bg-indigo-50/30">
                      <td className="sticky left-0 z-[5] border-b border-slate-100 bg-white px-2 py-1 font-medium text-slate-800">
                        {phong?.onMoHoSo ? <button onClick={() => phong.onMoHoSo!(h.id, mon)} title="Mở hồ sơ học tập" className="text-left hover:text-indigo-700 hover:underline">{h.ten}</button> : h.ten}
                        {h.bao_dong && <span title={`Báo động ${h.bao_dong.so} lần trong 30 ngày — gần nhất: ${h.bao_dong.ghi_chu}`} className="ml-1 cursor-help">🚨</span>}
                      </td>
                      <td className="whitespace-nowrap border-b border-slate-100 px-2 py-1 text-center tabular-nums">
                        {h.nhom_yeu == null ? <span className="text-slate-300">—</span> : <span className={`font-bold ${h.nhom_yeu > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{h.nhom_yeu}</span>}
                        {h.dang_yeu != null && <span className="ml-1 text-[10.5px] text-slate-400" title="Số dạng yếu">· {h.dang_yeu} dạng</span>}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1 text-slate-600">{h.lop}</td>
                      {bang.cot.map((c) => {
                        const o = h.o[c.ma]
                        const mo = cua.some((w) => w.id === [h.id, cap, c.ma, soTuan].join('|'))
                        return (
                          <td key={c.ma} className="border-b border-slate-100 px-1 py-0.5 text-center">
                            {o == null ? <span className="text-slate-300">—</span> : (
                              <button onClick={(e) => moCua(h, c.ma, c.cha ? `${c.cha} › ${c.ten}` : c.ten, e)} title={`Trung bình ${Math.min(o.n, 5)} lần gần nhất (đã đo ${o.n} lần) · ${o.muc === 'dat' ? 'đạt' : o.muc === 'yeu' ? 'yếu' : 'cần luyện'}${o.tin === 'thap' ? ' · độ tin thấp' : ''} · bấm xem từng lần`}
                                className={`w-full rounded px-1 py-0.5 font-semibold tabular-nums hover:ring-2 hover:ring-indigo-300 ${mauPct(o.p)} ${mo ? 'ring-2 ring-indigo-500' : ''}`}>
                                {o.p}%<XuHuong d={o.d} dk={o.dk} />
                              </button>
                            )}
                          </td>
                        )
                      })}
                      {phong && (
                        <td className="sticky right-0 z-[5] border-b border-slate-100 bg-white px-1.5 py-0.5 text-center">
                          {!h.bt ? <button onClick={() => setBoTro(h)} className="whitespace-nowrap rounded-md bg-indigo-600 px-2.5 py-1 text-[11.5px] font-bold text-white shadow-sm hover:bg-indigo-700">Bổ trợ</button>
                            : <button onClick={() => h.bt!.tt !== 'dang_bo_tro' && setBoTro(h)} className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold ${NHAN_TT[h.bt.tt].cls}`}>{NHAN_TT[h.bt.tt].t}</button>}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400">
              {bang.hs.length} HS · {bang.cot.length} {TEN_CAP[cap]}{bang.tinh_at ? ` · số tính lúc ${gioVN(bang.tinh_at)}` : ''}. Ô = MASTERY THEO LẦN (Thùy 10/11): trung bình 5 lần làm bài gần nhất của em ở {TEN_CAP[cap]} đó (Hình–Học 3 lần); 1 lần = 1 bài làm, % lần = trung bình các câu của bài thuộc ô; mọi lần ngang nhau.
              Kênh: ET · BTVN · MT / khảo sát · phiếu và test bổ trợ (không tính tự luyện, trừ cấp 1). {TEN_CAP[cap]} theo bản đồ mới; Hình–Học: bài học = chuyên đề = nhóm bài. Nhóm yếu = số nhóm bài đang yếu. Số đọc từ bảng chụp mastery (tự làm mới 5 phút/lần khi có điểm mới).
            </p>
          </>
        )}
      {boTro && <BoTroPopup hs={{ id: boTro.id, ten: boTro.ten, lop: boTro.lop }} mon={mon} onDong={() => setBoTro(null)}
        onXong={(kq) => { vaBt(boTro.id, { id: kq.id, tt: kq.tt }); setBoTro(null) }} />}
      {cua.map((c) => <CuaSoO key={c.id} c={c} onDong={() => dong(c.id)} onLen={() => lenTren(c.id)} onDoi={(x, y) => doi(c.id, { x, y })} tiLe={tiLe} />)}
    </div>
  )
}

// Mũi tên xu hướng trong ô: % hiện tại so với đầu kỳ (mờ + nghiêng khi mốc là lượt đầu trong cửa sổ — em chưa đo trước đó).
function XuHuong({ d, dk }: { d: number | null; dk: boolean }) {
  if (d == null) return null
  const cls = d > 0 ? 'text-emerald-700' : d < 0 ? 'text-rose-700' : 'text-slate-400'
  return <span className={`ml-1 text-[10.5px] font-bold ${cls} ${dk ? '' : 'italic opacity-60'}`}>{d > 0 ? `▲${d}` : d < 0 ? `▼${-d}` : '='}</span>
}

// ── Cửa sổ nổi: lịch sử 1 ô ──
function CuaSoO({ c, onDong, onLen, onDoi, tiLe }: { c: Cua; onDong: () => void; onLen: () => void; onDoi: (x: number, y: number) => void; tiLe: () => number }) {
  const keo = useRef<{ dx: number; dy: number; z: number } | null>(null)
  const [moLuot, setMoLuot] = useState<number | null>(null)
  const batDauKeo = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    const z = tiLe()
    keo.current = { dx: e.clientX / z - c.x, dy: e.clientY / z - c.y, z }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    onLen()
  }
  const dangKeo = (e: PointerEvent) => {
    if (!keo.current) return
    const { dx, dy, z } = keo.current
    const x = Math.max(-300, Math.min(e.clientX / z - dx, window.innerWidth / z - 80))
    const y = Math.max(0, Math.min(e.clientY / z - dy, window.innerHeight / z - 40))
    onDoi(x, y)
  }
  const d = c.data
  return (
    <div onPointerDown={onLen} style={{ left: c.x, top: c.y, zIndex: c.z }}
      className="fixed flex max-h-[70vh] w-[540px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
      <div onPointerDown={batDauKeo} onPointerMove={dangKeo} onPointerUp={() => { keo.current = null }}
        className="flex cursor-move select-none items-start gap-2 bg-slate-800 px-3 py-2 text-white">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold">{c.hs.ten} · {c.hs.lop}</div>
          <div className="truncate text-[11px] text-slate-300" title={c.tenCot}>{c.tenCot}</div>
        </div>
        <button onClick={onDong} className="h-6 w-6 shrink-0 rounded text-[16px] leading-none text-slate-300 hover:bg-white/10 hover:text-white">×</button>
      </div>
      <div className="flex-1 overflow-auto px-3 py-2 text-[12.5px]">
        {c.loi ? <p className="text-rose-600">Không tải được: {c.loi}</p>
          : !d ? <p className="text-slate-500">Đang tải…</p>
          : (
            <>
              {d.luot.length === 0 && !d.dau_ky ? <p className="text-slate-500">Không có lượt nào trong cửa sổ.</p> : (
                <table className="w-full border-separate border-spacing-0 text-[12px]">
                  <thead>
                    <tr className="text-[10.5px] uppercase tracking-wide text-slate-500">
                      <th className={thO + ' text-left'}>Ngày</th>
                      <th className={thO + ' text-left'}>Hoạt động</th>
                      <th className={thO}>Đúng</th>
                      <th className={thO}>% lần</th>
                      <th className={thO} title="% của lượt so với % tích luỹ ngay trước lượt (lượt đầu: so với đầu kỳ)">Tăng / giảm</th>
                      <th className={thO} title="Hiện tại tính trên bao nhiêu lần gần nhất (tối đa 5)">Số lần tính</th>
                      <th className={thO}>Hiện tại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.dau_ky && <tr className="bg-slate-50 text-slate-500">
                      <td className={tdO + ' font-mono'}>&lt; {ngayVN(d.tu)}</td>
                      <td className={tdO + ' font-semibold'}>Đầu kỳ</td>
                      <td className={tdO} /><td className={tdO} /><td className={tdO} />
                      <td className={tdO + ' text-center'}>{d.dau_ky ? `${d.dau_ky.n} lần` : ''}</td>
                      <td className={tdO + ' text-center'}>{d.dau_ky ? <span className={`rounded px-1.5 font-semibold ${mauPct(d.dau_ky.p)}`}>{d.dau_ky.p}%</span> : <span className="text-slate-400">chưa đo</span>}</td>
                    </tr>}
                    {d.luot.map((l, i) => (
                      <Fragment key={i}>
                        <tr onClick={() => setMoLuot(moLuot === i ? null : i)} className="cursor-pointer hover:bg-indigo-50/40">
                          <td className={tdO + ' font-mono text-slate-500'}>{ngayVN(l.ngay)}</td>
                          <td className={tdO + ' font-semibold text-slate-700'}>{moLuot === i ? '▾ ' : '▸ '}{TEN_KENH[l.kenh] ?? l.kenh}</td>
                          <td className={tdO + ' text-center tabular-nums'}>{so(l.dung)}/{l.tong}</td>
                          <td className={tdO + ' text-center tabular-nums text-slate-600'}>{l.p_luot}%</td>
                          <td className={`${tdO} text-center font-semibold tabular-nums ${l.delta == null || l.delta === 0 ? 'text-slate-400' : l.delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                            title={l.delta == null ? '' : `Lượt này ${l.p_luot}% so với ${l.p_truoc}% ${i === 0 ? 'đầu kỳ' : 'tích luỹ trước đó'}`}>
                            {l.delta == null ? '' : l.delta > 0 ? `▲${l.delta}` : l.delta < 0 ? `▼${-l.delta}` : '='}
                          </td>
                          <td className={tdO + ' text-center tabular-nums'}>{l.so_lan5} lần</td>
                          <td className={tdO + ' text-center'}><span className={`rounded px-1.5 font-semibold tabular-nums ${mauPct(l.p)}`}>{l.p}%</span></td>
                        </tr>
                        {moLuot === i && (
                          <tr><td colSpan={7} className="border-b border-slate-100 bg-slate-50/70 px-2 py-1">
                            <ul className="text-[11.5px]">
                              {l.cau.map((q, k) => (
                                <li key={k} className="flex items-start gap-2 py-0.5">
                                  <span className={`w-6 shrink-0 text-center font-bold ${q.g >= 1 ? 'text-emerald-600' : q.g <= 0 ? 'text-rose-600' : 'text-amber-600'}`}>{q.g >= 1 ? 'Đ' : q.g <= 0 ? 'S' : so(q.g)}</span>
                                  <span className="min-w-0 flex-1 text-slate-600">{q.dang}</span>
                                  <span className="shrink-0 font-mono text-[10.5px] text-slate-400">{q.ma_cau ?? ''}</span>
                                </li>
                              ))}
                            </ul>
                          </td></tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              )}
              <p className="mt-2 text-[11px] text-slate-400">Tăng / giảm = % lần này so với "hiện tại" ngay trước (lần đầu: so với đầu kỳ). Hiện tại = trung bình tối đa 5 lần gần nhất. Bấm dòng để xem từng câu.</p>
            </>
          )}
      </div>
    </div>
  )
}
