// Dashboard học tập (leaf `db_hoctap`) — DỰNG LẠI 23/10 (Thùy: "hủy toàn bộ chức năng cũ"; luồng duyệt level / mở case cũ
// bỏ khỏi lá này, hàm + bảng DB cũ giữ nguyên). Bảng giống MT - Khảo sát: Tên · Lớp · mỗi Chuyên đề / Nhóm bài BẢN ĐỒ MỚI
// 1 cột, % trên ≤10 câu gần nhất trong 2–4 tuần. Bấm ô ⇒ CỬA SỔ NỔI lịch sử ô đó (kéo thả, mở nhiều cái cùng lúc).
// Kênh song song với mastery (công thức khác có chủ ý — xem mig 202610231524). Mọi con số từ DB (§2.0); client chỉ lọc lớp,
// sắp cột đang bấm, định dạng.
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { bangDashboardHocTap, lichSuO, TEN_KENH, type BangDB, type CapDB, type HSDB, type LichSuO } from '../../lib/dashboardHocTap'

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
const ngayVN = (d: string) => d ? d.split('-').reverse().slice(0, 2).join('/') : ''

export default function DashboardHocTapScreen() {
  const [mons, setMons] = useState<string[]>([])
  const [khois, setKhois] = useState<string[]>([])
  const [mon, setMon] = useState(NHO.mon)
  const [khoi, setKhoi] = useState<string | null>(NHO.khoi)
  const [soTuan, setSoTuan] = useState(NHO.soTuan)
  const [cap, setCap] = useState<CapDB>(NHO.cap)
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [sap, setSap] = useState(NHO.sap)
  const [bang, setBang] = useState<BangDB | null>(NHO.bang)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [cua, setCua] = useState<Cua[]>(NHO.cua)
  const [lamMoi, setLamMoi] = useState(0)
  const goc = useRef<HTMLDivElement>(null)
  // App có thể bọc trong khung `zoom` (cỡ chữ) ⇒ toạ độ fixed bên trong bị nhân theo; quy toạ độ chuột về đơn vị của khung.
  const tiLe = () => { const el = goc.current; return el && el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1 }
  useEffect(() => { Object.assign(NHO, { mon, khoi, soTuan, cap, lopId, sap, bang, cua }) }, [mon, khoi, soTuan, cap, lopId, sap, bang, cua])

  // danh sách môn / khối = lớp đang học (chỉ để dựng nút lọc)
  useEffect(() => {
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
  }, [mon]) // eslint-disable-line react-hooks/exhaustive-deps

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
  const giaTri = (h: HSDB, cot: string): number | string | null => cot === 'ten' ? h.ten : cot === 'lop' ? h.lop : (h.o[cot]?.p ?? null)
  const sapXep = [...hien].sort((a, b) => {
    const x = giaTri(a, sap.cot), y = giaTri(b, sap.cot)
    if (x == null && y == null) return a.ten.localeCompare(b.ten, 'vi')
    if (x == null) return 1
    if (y == null) return -1
    const s = typeof x === 'string' ? x.localeCompare(String(y), 'vi', { numeric: true }) : (x as number) - (y as number)
    return (sap.tang ? s : -s) || a.ten.localeCompare(b.ten, 'vi')
  })
  const bamCot = (cot: string) => setSap((s) => s.cot === cot ? { cot, tang: !s.tang } : { cot, tang: cot === 'ten' || cot === 'lop' })
  const muiTen = (cot: string) => sap.cot === cot ? (sap.tang ? ' ▲' : ' ▼') : ''
  const th = 'sticky top-0 z-10 cursor-pointer select-none border-b border-slate-200 bg-slate-50 px-2 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100'

  // ── cửa sổ nổi ──
  const lenTren = (id: string) => setCua((cs) => cs.map((c) => c.id === id ? { ...c, z: ++NHO.zMax } : c))
  const dong = (id: string) => setCua((cs) => cs.filter((c) => c.id !== id))
  const doi = (id: string, va: Partial<Cua>) => setCua((cs) => cs.map((c) => c.id === id ? { ...c, ...va } : c))
  const moCua = (h: HSDB, ma: string, tenCot: string, ev: MouseEvent) => {
    const id = [h.id, cap, ma, soTuan].join('|')
    if (cua.some((c) => c.id === id)) { lenTren(id); return }
    const z = tiLe(), W = 460
    const x = Math.max(8, Math.min(ev.clientX / z + 12, window.innerWidth / z - W - 8))
    const y = Math.max(8, Math.min(ev.clientY / z - 40, window.innerHeight / z - 420))
    setCua((cs) => [...cs, { id, hs: h, cap, ma, tenCot, x, y, z: ++NHO.zMax }])
    lichSuO(h.id, mon, cap, ma, soTuan)
      .then((d) => doi(id, { data: d }))
      .catch((e) => doi(id, { loi: String(e?.message ?? e) }))
  }

  const nut = (on: boolean) => `h-8 px-3 text-[12.5px] font-semibold ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`
  return (
    <div ref={goc} className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {mons.map((m) => <button key={m} onClick={() => { setMon(m); setLopId(null) }} className={`h-7 rounded-md px-3 text-[13px] font-semibold ${mon === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{m}</button>)}
        <select value={khoi ?? ''} onChange={(e) => { setKhoi(e.target.value || null); setLopId(null) }} className="h-8 rounded border border-slate-300 bg-white px-2 text-[13px]">
          {khois.length === 0 && <option value="">Chưa có lớp</option>}
          {khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {([['chu_de', 'Chủ đề'], ['chuyen_de', 'Chuyên đề'], ['nhom', 'Nhóm bài']] as [CapDB, string][]).map(([v, l]) => (
            <button key={v} onClick={() => { setCap(v); if (sap.cot !== 'ten' && sap.cot !== 'lop') setSap({ cot: 'lop', tang: true }) }} className={nut(cap === v)}>{l}</button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {[2, 3, 4].map((n) => <button key={n} onClick={() => setSoTuan(n)} className={nut(soTuan === n)}>{n} tuần</button>)}
        </div>
        <button onClick={() => setLamMoi((x) => x + 1)} title="Quét lại" className="h-8 rounded-md px-2 text-[14px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻</button>
        {bang && <span className="text-[12px] text-slate-500">Từ {ngayVN(bang.tu)} · {bang.hs.length} HS · {bang.cot.length} {TEN_CAP[cap]} có dữ liệu</span>}
        {cua.length > 0 && <button onClick={() => setCua([])} className="ml-auto h-7 rounded-md px-3 text-[12px] font-semibold text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">Đóng {cua.length} cửa sổ</button>}
      </div>
      {lops.length > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Lớp</span>
          <button onClick={() => setLopId(null)} className={`h-7 rounded-md px-3 text-[12px] font-semibold ${!lopId ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>Cả khối</button>
          {lops.map(([id, ten]) => <button key={id} onClick={() => setLopId(id)} className={`h-7 rounded-md px-3 text-[12px] font-semibold ${lopId === id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>{ten}</button>)}
        </div>
      )}
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {!bang ? (dangTai ? <p className="text-sm text-slate-500">Đang tính bảng…</p> : null)
        : bang.cot.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Khối này chưa có câu nào đo được theo bản đồ mới trong {soTuan} tuần gần nhất.</div>
        : (
          <>
            <div className={`max-h-[calc(100vh-280px)] overflow-auto rounded-xl border border-slate-200 bg-white ${dangTai ? 'opacity-60' : ''}`}>
              <table className="border-separate border-spacing-0 text-[12.5px]">
                <thead>
                  <tr>
                    <th onClick={() => bamCot('ten')} className={`${th} sticky left-0 z-20 min-w-[170px] text-left`}>Tên{muiTen('ten')}</th>
                    <th onClick={() => bamCot('lop')} className={`${th} text-left`}>Lớp{muiTen('lop')}</th>
                    {bang.cot.map((c) => (
                      <th key={c.ma} onClick={() => bamCot(c.ma)} title={c.cha ? `${c.cha} › ${c.ten}` : c.ten} className={`${th} w-[92px] min-w-[92px] align-bottom`}>
                        {c.cha && <div className="mb-0.5 line-clamp-1 text-center text-[10px] font-normal text-slate-400">{c.cha}</div>}
                        <div className="line-clamp-3 text-center leading-tight">{c.ten}{muiTen(c.ma)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sapXep.map((h) => (
                    <tr key={h.id} className="hover:bg-indigo-50/30">
                      <td className="sticky left-0 z-[5] border-b border-slate-100 bg-white px-2 py-1 font-medium text-slate-800">{h.ten}</td>
                      <td className="border-b border-slate-100 px-2 py-1 text-slate-600">{h.lop}</td>
                      {bang.cot.map((c) => {
                        const o = h.o[c.ma]
                        const mo = cua.some((w) => w.id === [h.id, cap, c.ma, soTuan].join('|'))
                        return (
                          <td key={c.ma} className="border-b border-slate-100 px-1 py-0.5 text-center">
                            {o == null ? <span className="text-slate-300">—</span> : (
                              <button onClick={(e) => moCua(h, c.ma, c.cha ? `${c.cha} › ${c.ten}` : c.ten, e)} title={`${o.n} câu trong ${soTuan} tuần${o.d == null ? '' : ` · ${o.d > 0 ? '+' : ''}${o.d} điểm % so với ${o.dk ? 'đầu kỳ' : 'sau lượt đầu (chưa đo trước kỳ)'}`} · bấm xem lịch sử`}
                                className={`w-full rounded px-1 py-0.5 font-semibold tabular-nums hover:ring-2 hover:ring-indigo-300 ${mauPct(o.p)} ${mo ? 'ring-2 ring-indigo-500' : ''}`}>
                                {o.p}%<XuHuong d={o.d} dk={o.dk} />
                              </button>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400">
              % = trên tối đa 10 câu gần nhất trong {soTuan} tuần (mỗi câu nặng như nhau; câu có điểm lẻ tính điểm đạt / điểm tối đa). Kênh: ET · BTVN · MT / khảo sát · test bổ trợ / bù / đuổi
              (không tính luyện bổ trợ, tự luyện, game). {TEN_CAP[cap]} theo bản đồ mới; câu chưa gán dạng bài chưa vào ô. Hình có cột riêng (chủ đề Hình · nhóm mô hình · mô hình); câu Hình chưa có tầng đang xem thì dồn vào cột “Hình”. ▲▼ = % hiện tại so với đầu kỳ (10 câu gần nhất trước cửa sổ); chữ nghiêng mờ = em chưa đo trước kỳ, so với sau lượt đầu. Kênh quan sát song song — khác công thức mastery.
            </p>
          </>
        )}
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
      className="fixed flex max-h-[70vh] w-[460px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
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
              <div className="mb-2 rounded-md bg-slate-50 px-2 py-1.5 text-slate-600">
                Đầu kỳ (trước {ngayVN(d.tu)}): {d.dau_ky ? <b className="text-slate-800">{d.dau_ky.p}%</b> : <span className="text-slate-400">chưa đo</span>}
                {d.dau_ky && <span className="text-slate-400"> · trên {d.dau_ky.n} câu gần nhất</span>}<div className="text-[11px] text-slate-400">▲▼ = % của lượt so với % tích luỹ ngay trước lượt (lượt đầu: so với đầu kỳ) · → = tích luỹ trên ≤10 câu gần nhất</div>
              </div>
              {d.luot.length === 0 ? <p className="text-slate-500">Không có lượt nào trong cửa sổ.</p> : (
                <ol className="space-y-1">
                  {d.luot.map((l, i) => (
                    <li key={i} className="rounded-md border border-slate-100">
                      <button onClick={() => setMoLuot(moLuot === i ? null : i)} className="flex w-full items-start gap-2 px-2 py-1.5 text-left hover:bg-slate-50">
                        <span className="w-10 shrink-0 font-mono text-slate-500">{ngayVN(l.ngay)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="font-semibold text-slate-700">{TEN_KENH[l.kenh] ?? l.kenh}</span> đúng {so(l.dung)}/{l.tong}
                          <span className="text-slate-500"> ({l.p_luot}%)</span>
                          {l.delta != null && (
                            <span title={`Lượt này ${l.p_luot}% so với ${l.p_truoc}% ${i === 0 ? 'đầu kỳ' : 'tích luỹ trước đó'}`}
                              className={`ml-1 font-semibold tabular-nums ${l.delta === 0 ? 'text-slate-400' : l.delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {l.delta > 0 ? `▲${l.delta}` : l.delta < 0 ? `▼${-l.delta}` : '='}
                            </span>
                          )}
                          {' → '}
                          {l.tl_tong > 10
                            ? <>tổng {so(l.tl_dung)}/{l.tl_tong}, 10 câu gần nhất <b>{so(l.dung10)}/10</b></>
                            : <b>{so(l.dung10)}/{l.tong10}</b>}
                        </span>
                        <span className={`shrink-0 rounded px-1.5 font-semibold tabular-nums ${mauPct(l.p)}`}>{l.p}%</span>
                      </button>
                      {moLuot === i && (
                        <ul className="border-t border-slate-100 bg-slate-50/60 px-2 py-1 text-[11.5px]">
                          {l.cau.map((q, k) => (
                            <li key={k} className="flex items-start gap-2 py-0.5">
                              <span className={`w-6 shrink-0 text-center font-bold ${q.g >= 1 ? 'text-emerald-600' : q.g <= 0 ? 'text-rose-600' : 'text-amber-600'}`}>{q.g >= 1 ? 'Đ' : q.g <= 0 ? 'S' : so(q.g)}</span>
                              <span className="min-w-0 flex-1 text-slate-600">{q.dang}</span>
                              <span className="shrink-0 font-mono text-[10.5px] text-slate-400">{q.ma_cau ?? ''}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
      </div>
    </div>
  )
}
