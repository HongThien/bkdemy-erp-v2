// DASHBOARD BỔ TRỢ › LẤP ĐẦY CA (Thùy 10/11): mỗi ca trực bổ trợ khối đo bằng 2 tỉ lệ — % theo HS (HS ÷ 3 mỗi TA) và % theo đơn vị (đã dùng ÷ đơn vị ca, 60' × 1 TA = 6).
// Để xếp lại nguồn lực: khung ca nào đông / vắng. Lọc tuần / tháng / tất cả + khối. Mọi con số tính ở DB (fn_botro_lap_day_ca); màn chỉ vẽ + sắp xếp.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { lapDayCa, type LapDayCa } from '../../lib/botro_lap_day'
import { congNgay, ddmmVN, homNayVN } from '../../lib/tuan'

type Kieu = 'tuan' | 'thang' | 'tatca'
const THU = ['', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const GIO = ['', 'Sáng (<12h)', 'Chiều (12–17h)', '17–18h', 'Tối (18h+)']
const KHOI_ORDER = (k: string) => parseFloat(k) * 10 + (/T/.test(k) ? 5 : 0)
const TAT_CA_TU = '2026-09-01'

const thuHai = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return congNgay(d, -((new Date(Date.UTC(y, m - 1, dd)).getUTCDay() + 6) % 7)) }
const dauThang = (d: string) => d.slice(0, 7) + '-01'
const cuoiThang = (d: string) => { const [y, m] = d.split('-').map(Number); const l = new Date(Date.UTC(y, m, 0)).getUTCDate(); return `${y}-${String(m).padStart(2, '0')}-${String(l).padStart(2, '0')}` }
const congThang = (d: string, n: number) => { const [y, m] = d.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1 + n, 1)); return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-01` }
const pc = (v: number | null) => (v == null ? '—' : `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}%`)

function khoang(kieu: Kieu, moc: string): { tu: string; den: string; nhan: string } {
  if (kieu === 'tuan') { const t = thuHai(moc); return { tu: t, den: congNgay(t, 6), nhan: `Tuần ${ddmmVN(t)} – ${ddmmVN(congNgay(t, 6))}` } }
  if (kieu === 'thang') return { tu: dauThang(moc), den: cuoiThang(moc), nhan: `Tháng ${moc.slice(5, 7)}/${moc.slice(0, 4)}` }
  return { tu: TAT_CA_TU, den: congNgay(homNayVN(), -1), nhan: 'Tất cả' }
}

// Rời màn rồi quay lại = đúng chỗ cũ (CLAUDE.md §2)
const NHO: { kieu: Kieu; moc: string | null; khoi: string; coMat: boolean; moCa: boolean; kq: Record<string, LapDayCa> } = { kieu: 'tuan', moc: null, khoi: '', coMat: false, moCa: false, kq: {} }

export default function LapDayCaBoTro({ toggle }: { toggle: ReactNode }) {
  const homQua = congNgay(homNayVN(), -1)
  const [kieu, setKieuS] = useState<Kieu>(NHO.kieu)
  const [moc, setMocS] = useState<string>(NHO.moc ?? thuHai(congNgay(thuHai(homNayVN()), -7))) // tuần ĐỦ gần nhất
  const [khoi, setKhoiS] = useState(NHO.khoi)
  const [coMat, setCoMatS] = useState(NHO.coMat)
  const [moCa, setMoCaS] = useState(NHO.moCa)
  const [kq, setKq] = useState<LapDayCa | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const lanRef = useRef(0)
  const k = khoang(kieu, moc)
  const set = <T,>(f: (v: T) => void, key: 'kieu' | 'moc' | 'khoi' | 'coMat' | 'moCa') => (v: T) => { (NHO as any)[key] = v; f(v) }
  const setKieu = set(setKieuS, 'kieu'), setMoc = set(setMocS, 'moc'), setKhoi = set(setKhoiS, 'khoi'), setCoMat = set(setCoMatS, 'coMat'), setMoCa = set(setMoCaS, 'moCa')

  useEffect(() => {
    const khoa = `${k.tu}|${k.den}|${khoi}|${coMat}`
    if (NHO.kq[khoa]) setKq(NHO.kq[khoa])
    const lan = ++lanRef.current
    setDangTai(true); setLoi(null)
    lapDayCa(k.tu, k.den, khoi || null, coMat)
      .then((r) => { NHO.kq[khoa] = r; if (lan === lanRef.current) setKq(r) }) // giữ số cũ tới khi có số mới — không trắng màn
      .catch((e: any) => { if (lan === lanRef.current) setLoi(e?.message ?? String(e)) })
      .finally(() => { if (lan === lanRef.current) setDangTai(false) })
  }, [k.tu, k.den, khoi, coMat])

  const buoc = (n: number) => { if (kieu === 'tuan') setMoc(congNgay(thuHai(moc), 7 * n)); else if (kieu === 'thang') setMoc(congThang(dauThang(moc), n)) }
  const khoiOpts = [...new Set([...(kq?.khoi ?? []).map((x) => x.khoi), ...(khoi ? [khoi] : [])])].sort((a, b) => KHOI_ORDER(a) - KHOI_ORDER(b))
  const t = kq?.tong

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#f5f5f7] px-6 py-3">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {toggle}
          <span className="ml-1 text-[12px] text-slate-500">Mỗi khung ca: <b className="text-slate-700">% theo HS</b> = HS ÷ (3 × TA) · <b className="text-slate-700">% theo đơn vị</b> = đã dùng ÷ đơn vị ca (ca 60' = 6)</span>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm">
          <Seg val={kieu} on={(v) => { setKieu(v); if (v === 'tuan') setMoc(thuHai(homQua)); if (v === 'thang') setMoc(dauThang(homQua)) }} opts={[['tuan', 'Tuần'], ['thang', 'Tháng'], ['tatca', 'Tất cả']]} />
          {kieu !== 'tatca' && <>
            <button onClick={() => buoc(-1)} className="rounded-lg border border-slate-200 px-2 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50">◀</button>
            <span className="min-w-[150px] text-center text-[13px] font-semibold text-slate-700">{k.nhan}</span>
            <button onClick={() => buoc(1)} disabled={k.den >= homQua} className="rounded-lg border border-slate-200 px-2 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50 disabled:opacity-35">▶</button>
            <button onClick={() => setMoc(kieu === 'tuan' ? thuHai(congNgay(thuHai(homNayVN()), -7)) : dauThang(homQua))} className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-[12.5px] font-semibold text-indigo-700 hover:bg-indigo-100">{kieu === 'tuan' ? 'Tuần đủ gần nhất' : 'Tháng này'}</button>
          </>}
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[12.5px]">
            <option value="">Tất cả khối</option>{khoiOpts.map((x) => <option key={x} value={x}>Khối {x}</option>)}
          </select>
          <Seg val={coMat ? 'cm' : 'xep'} on={(v) => setCoMat(v === 'cm')} opts={[['xep', 'Đã xếp'], ['cm', 'Chỉ có mặt']]} />
          <span className="ml-auto text-[11.5px] text-slate-400">{dangTai ? 'Đang tính…' : kq ? `Tính đến ${ddmmVN(kq.den_tinh)}` : ''}</span>
        </div>

        {loi && <p className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">Không tải được: {loi}</p>}
        {!kq && !loi && <p className="py-12 text-center text-[13px] text-slate-400">Đang tải…</p>}

        {kq && t && <>
          <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <The so={String(t.ca)} nhan="ca trực đã mở" />
            <The so={pc(t.pct_hs)} nhan={`lấp đầy theo HS (${t.hs}/${t.cap_hs})`} nhan2 />
            <The so={pc(t.pct_dv)} nhan={`lấp đầy theo đơn vị (${t.dv}/${t.cap_dv})`} nhan2 />
            <The so={`${t.trong}`} nhan={`ca không có HS (${t.ca ? Math.round((100 * t.trong) / t.ca) : 0}%)`} />
            <The so={String(t.day)} nhan="ca đầy (đủ HS hoặc đủ đơn vị)" />
          </div>
          <p className="mb-2 text-[11.5px] text-amber-800">Học NGOÀI ca trực trong khoảng này: <b>{kq.ngoai}</b> lượt HS (buổi bù/đuổi/yếu không trùng ngày · khối · giờ với ca trực nào) — không tính vào các bảng dưới.</p>

          <div className="grid gap-2 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <Bang ten="Theo khung ca (khối × thứ × giờ)" id="khung" defSort={{ i: 6, asc: false }}
              cot={['Khối', 'Thứ', 'Giờ', 'Trợ giảng', 'Ca', '% HS', '% đơn vị', 'Ca trống']}
              rows={kq.khung.map((x) => [
                { t: `K${x.khoi}`, v: KHOI_ORDER(x.khoi) }, { t: THU[x.thu], v: x.thu }, { t: `${x.bd}–${x.kt}`, v: x.bd }, { t: x.ta, v: x.ta, cls: 'max-w-[140px] truncate' },
                { t: String(x.ca), v: x.ca, n: 1 }, { bar: x.pct_hs, sub: `${x.hs}/${x.cap_hs}` }, { bar: x.pct_dv, sub: `${x.dv}/${x.cap_dv}` }, { t: `${x.trong}/${x.ca}`, v: x.trong / x.ca, n: 1 }])} />
            <div className="flex flex-col gap-2">
              <Bang ten="Theo khối" id="khoi" defSort={{ i: 0, asc: true }} cot={['Khối', 'Ca', '% HS', '% đơn vị', 'Trống']}
                rows={kq.khoi.map((x) => [{ t: `K${x.khoi}`, v: KHOI_ORDER(x.khoi) }, { t: String(x.ca), v: x.ca, n: 1 }, { bar: x.pct_hs, sub: `${x.hs}/${x.cap_hs}` }, { bar: x.pct_dv, sub: `${x.dv}/${x.cap_dv}` }, { t: `${x.trong}/${x.ca}`, v: x.trong / x.ca, n: 1 }])} />
              <Bang ten="Theo thứ" id="thu" defSort={{ i: 0, asc: true }} cot={['Thứ', 'Ca', '% HS', '% đơn vị', 'Trống']}
                rows={kq.thu.map((x) => [{ t: THU[x.thu], v: x.thu }, { t: String(x.ca), v: x.ca, n: 1 }, { bar: x.pct_hs, sub: `${x.hs}/${x.cap_hs}` }, { bar: x.pct_dv, sub: `${x.dv}/${x.cap_dv}` }, { t: `${x.trong}/${x.ca}`, v: x.trong / x.ca, n: 1 }])} />
              <Bang ten="Theo khung giờ" id="gio" defSort={{ i: 0, asc: true }} cot={['Giờ', 'Ca', '% HS', '% đơn vị', 'Trống']}
                rows={kq.gio.map((x) => [{ t: GIO[x.nhom], v: x.nhom }, { t: String(x.ca), v: x.ca, n: 1 }, { bar: x.pct_hs, sub: `${x.hs}/${x.cap_hs}` }, { bar: x.pct_dv, sub: `${x.dv}/${x.cap_dv}` }, { t: `${x.trong}/${x.ca}`, v: x.trong / x.ca, n: 1 }])} />
            </div>
          </div>

          <div className="mt-2">
            <button onClick={() => setMoCa(!moCa)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50">{moCa ? '▾' : '▸'} Từng ca trong khoảng đã chọn ({kq.ds.length})</button>
            {moCa && <div className="mt-2"><Bang ten="" id="ca" defSort={{ i: 7, asc: false }} cot={['Ngày', 'Thứ', 'Giờ', 'Khối', 'Trợ giảng', 'TA', '% HS', '% đơn vị', 'Yếu/Bù/Đuổi/Hình']}
              rows={kq.ds.map((x) => [{ t: ddmmVN(x.ngay), v: x.ngay }, { t: THU[x.thu], v: x.thu }, { t: `${x.bd}–${x.kt}`, v: x.bd }, { t: `K${x.khoi}`, v: KHOI_ORDER(x.khoi) }, { t: x.ta, v: x.ta, cls: 'max-w-[160px] truncate' }, { t: String(x.so_ta), v: x.so_ta, n: 1 },
                { bar: x.pct_hs, sub: `${x.hs}/${x.cap_hs}` }, { bar: x.pct_dv, sub: `${x.dv}/${x.cap_dv}` }, { t: `${x.ly}/${x.lb}/${x.ld}/${x.lh}`, v: x.ly + x.lb + x.ld + x.lh }])} /></div>}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Ca = ca trực chưa huỷ, tính tới hôm qua. Lượt học sinh chưa gắn ca được ghép vào ca cùng ngày · khối · trùng giờ. Ca có thể &gt;100% đơn vị (xếp lố). Màu thanh: càng đầy càng đậm.</p>
        </>}
      </div>
    </div>
  )
}

function Seg<T extends string>({ val, on, opts }: { val: T; on: (v: T) => void; opts: [T, string][] }) {
  return (
    <span className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-[12.5px] font-semibold">
      {opts.map(([v, t]) => <button key={v} onClick={() => on(v)} className={`rounded-md px-2.5 py-1 ${val === v ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{t}</button>)}
    </span>
  )
}
function The({ so, nhan, nhan2 }: { so: string; nhan: string; nhan2?: boolean }) {
  return <div className="rounded-xl bg-white px-3 py-2 shadow-sm"><b className={`block leading-tight ${nhan2 ? 'text-[20px] text-indigo-700' : 'text-[20px] text-slate-800'}`}>{so}</b><span className="text-[11.5px] text-slate-500">{nhan}</span></div>
}

type O = { t?: string; v?: string | number; n?: number; cls?: string; bar?: number | null; sub?: string }
function Bang({ ten, id, cot, rows, defSort }: { ten: string; id: string; cot: string[]; rows: O[][]; defSort: { i: number; asc: boolean } }) {
  const [s, setS] = useState(defSort)
  const gv = (o: O) => (o.bar !== undefined ? (o.bar ?? -1) : o.v ?? o.t ?? '')
  const xep = rows.slice().sort((a, b) => { const x = gv(a[s.i]), y = gv(b[s.i]); const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'vi'); return s.asc ? r : -r })
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {ten && <div className="border-b border-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-600">{ten}</div>}
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-left text-[12px]" data-id={id}>
          <thead className="sticky top-0 bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
            <tr>{cot.map((c, i) => <th key={c} onClick={() => setS({ i, asc: s.i === i ? !s.asc : false })} className="cursor-pointer select-none whitespace-nowrap px-2 py-1 font-semibold">{c}{s.i === i ? (s.asc ? ' ▴' : ' ▾') : ''}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {xep.map((r, ri) => (
              <tr key={ri} className="hover:bg-slate-50/60">
                {r.map((o, ci) => o.bar !== undefined
                  ? <td key={ci} className="min-w-[88px] px-2 py-1"><div className="relative h-5 overflow-hidden rounded bg-slate-100"><div className="absolute inset-y-0 left-0 bg-emerald-300/80" style={{ width: `${Math.min(100, o.bar ?? 0)}%` }} />
                      <span className="relative flex h-full items-center justify-between px-1.5 tabular-nums"><b className="text-slate-800">{pc(o.bar ?? null)}</b><span className="text-[10.5px] text-slate-500">{o.sub}</span></span></div></td>
                  : <td key={ci} className={`whitespace-nowrap px-2 py-1 ${o.n ? 'text-right tabular-nums' : ''} ${o.cls ?? ''}`}>{o.t}</td>)}
              </tr>
            ))}
            {xep.length === 0 && <tr><td colSpan={cot.length} className="px-3 py-3 text-center text-slate-400">Không có ca nào trong khoảng này.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
