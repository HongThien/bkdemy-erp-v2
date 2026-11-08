// Đánh giá cuối cấp (leaf `db_cuoicap`, Thùy 23/10 — spec-danh-gia-cuoi-cap.md). Lớp 5T · 9 · 12: chọn lớp → tầng
// (Chủ đề / Chuyên đề / Nhóm bài) → lưới HS × nút; ô = TB dài + mũi tên xu hướng (TB ngắn so với TB dài) + số lần.
// Bấm ô ⇒ danh sách các lần của nút đó. Mọi con số từ DB (fn_dgcc_*, §2.0); client chỉ gom cột để vẽ, sắp, định dạng.
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { bangLop, cacLan, khoiCuoiCap, nguongTang, TEN_KENH, XU_HUONG, type LanCC, type OCC, type TangCC } from '../../lib/danhGiaCuoiCap'

type Lop = { id: string; ten_lop: string; khoi: string; mon: string }
type Mo = { o: OCC; lan?: LanCC[]; loi?: string }

// Rời tab quay lại = đúng chỗ cũ (CLAUDE §React).
const NHO: { lopId: string | null; tang: TangCC; bang: Record<string, OCC[]>; mo: Mo | null; cuon: number } =
  { lopId: null, tang: 'chu_de', bang: {}, mo: null, cuon: 0 }

const TANG: [TangCC, string][] = [['chu_de', 'Chủ đề'], ['chuyen_de', 'Chuyên đề'], ['nhom', 'Nhóm bài']]
const mauPct = (p: number) => p >= 80 ? 'bg-emerald-100 text-emerald-800' : p >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
const ngayVN = (d: string) => d ? d.slice(0, 10).split('-').reverse().join('/') : ''
const chenhChu = (v: number | null) => v == null ? '' : `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v).toLocaleString('vi-VN')}%`
const khoaO =(o: { nut: string; cha: string | null }) => `${o.nut}|${o.cha ?? ''}`

export default function DanhGiaCuoiCapScreen() {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [tang, setTang] = useState<TangCC>(NHO.tang)
  const [rows, setRows] = useState<OCC[] | null>(NHO.lopId ? NHO.bang[`${NHO.lopId}|${NHO.tang}`] ?? null : null)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState<Mo | null>(NHO.mo)
  const [lamMoi, setLamMoi] = useState(0)
  const [nguong, setNguong] = useState<Record<string, { nhe: number; ro: number }>>({})
  useEffect(() => { nguongTang().then(setNguong).catch(() => {}) }, [])
  const khung = useRef<HTMLDivElement>(null)
  useEffect(() => { Object.assign(NHO, { lopId, tang, mo }) }, [lopId, tang, mo])
  useEffect(() => { if (khung.current) khung.current.scrollTop = NHO.cuon }, [rows])

  // lớp đang học thuộc các khối áp dụng (khối lấy từ DB)
  useEffect(() => {
    let alive = true
    khoiCuoiCap().then((ks) =>
      supabase.from('lop').select('id, ten_lop, khoi, mon').eq('trang_thai', 'dang_hoc').in('khoi', ks).limit(500)
    ).then(({ data, error }) => {
      if (!alive) return
      if (error) { setLoi('Không tải được danh sách lớp: ' + error.message); return }
      const ds = ((data ?? []) as Lop[]).sort((a, b) => a.mon.localeCompare(b.mon, 'vi') || a.ten_lop.localeCompare(b.ten_lop, 'vi', { numeric: true }))
      setLops(ds)
      if (!NHO.lopId && ds.length) setLopId((ds.find((l) => l.mon === 'Toán') ?? ds[0]).id)
    }).catch((e) => alive && setLoi('Không tải được danh sách lớp: ' + (e?.message ?? e)))
    return () => { alive = false }
  }, [])

  // đổi ngữ cảnh (lớp / tầng) ⇒ tải; quay lại cùng ngữ cảnh ⇒ dùng bảng đã nhớ; ↻ ⇒ quét lại nền, không xoá bảng
  useEffect(() => {
    if (!lopId) return
    const khoa = `${lopId}|${tang}`
    if (lamMoi === 0 && NHO.bang[khoa]) { setRows(NHO.bang[khoa]); return }
    let alive = true
    setLoi(null); setDangTai(true)
    if (lamMoi === 0) setRows(null)
    bangLop(lopId, tang)
      .then((r) => { if (alive) { NHO.bang[khoa] = r; setRows(r) } })
      .catch((e) => alive && setLoi('Không tải được bảng: ' + (e?.message ?? e)))
      .finally(() => alive && setDangTai(false))
    return () => { alive = false }
  }, [lopId, tang, lamMoi])

  const lop = lops.find((l) => l.id === lopId)
  const cot = [...new Map((rows ?? []).map((o) => [khoaO(o), o])).values()]
    .sort((a, b) => (a.thu_tu ?? 9999) - (b.thu_tu ?? 9999) || (a.ten ?? a.nut).localeCompare(b.ten ?? b.nut, 'vi', { numeric: true }))
  const hs = [...new Map((rows ?? []).map((o) => [o.hoc_sinh_id, o.ho_ten])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi'))
  const o = new Map((rows ?? []).map((r) => [`${r.hoc_sinh_id}|${khoaO(r)}`, r]))

  const moO = (x: OCC) => {
    setMo({ o: x })
    cacLan(x.hoc_sinh_id, x.tang, x.nut, x.cha, lop?.mon ?? 'Toán')
      .then((lan) => setMo((m) => m && m.o === x ? { ...m, lan } : m))
      .catch((e) => setMo((m) => m && m.o === x ? { ...m, loi: String(e?.message ?? e) } : m))
  }

  const nut = (on: boolean) => `h-8 px-3 text-[12.5px] font-semibold ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`
  const th = 'sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-2 py-2 text-[11px] font-semibold text-slate-600'
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select value={lopId ?? ''} onChange={(e) => { setLopId(e.target.value || null); setMo(null); NHO.cuon = 0 }} className="h-8 rounded border border-slate-300 bg-white px-2 text-[13px]">
          {lops.length === 0 && <option value="">Chưa có lớp</option>}
          {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop} · {l.mon} · khối {l.khoi}</option>)}
        </select>
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {TANG.map(([v, t]) => <button key={v} onClick={() => { setTang(v); setMo(null) }} className={nut(tang === v)}>{t}</button>)}
        </div>
        <button onClick={() => setLamMoi((x) => x + 1)} title="Quét lại" className="h-8 rounded-md px-2 text-[14px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻</button>
        {rows && <span className="text-[12px] text-slate-500">{hs.length} HS · {cot.length} {TANG.find((t) => t[0] === tang)?.[1].toLowerCase()} có dữ liệu{rows[0] && <> · cửa sổ {rows[0].cua_so_ngan}/{rows[0].cua_so_dai} lần</>}</span>}
      </div>

      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {!rows ? (dangTai ? <p className="text-sm text-slate-500">Đang tính bảng…</p> : null)
        : cot.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">
            Lớp này chưa có lần nào đo được ở tầng {TANG.find((t) => t[0] === tang)?.[1].toLowerCase()} (từ 15/06/2026).
          </div>
        ) : (
          <div ref={khung} onScroll={(e) => { NHO.cuon = e.currentTarget.scrollTop }}
            className={`max-h-[calc(100vh-240px)] overflow-auto rounded-xl border border-slate-200 bg-white ${dangTai ? 'opacity-60' : ''}`}>
            <table className="border-separate border-spacing-0 text-[12.5px]">
              <thead>
                <tr>
                  <th className={`${th} sticky left-0 z-20 min-w-[170px] text-left`}>Học sinh</th>
                  {cot.map((c) => (
                    <th key={khoaO(c)} title={c.ten ?? c.nut} className={`${th} w-[124px] min-w-[124px] align-bottom`}>
                      <div className="line-clamp-3 text-center leading-tight">{c.ten ?? c.nut}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hs.map(([id, ten]) => (
                  <tr key={id} className="hover:bg-indigo-50/30">
                    <td className="sticky left-0 z-[5] border-b border-slate-100 bg-white px-2 py-1 font-medium text-slate-800">{ten}</td>
                    {cot.map((c) => {
                      const x = o.get(`${id}|${khoaO(c)}`)
                      const dangMo = mo && x && mo.o.hoc_sinh_id === x.hoc_sinh_id && khoaO(mo.o) === khoaO(x)
                      if (!x) return <td key={khoaO(c)} className="border-b border-slate-100 px-1 py-0.5 text-center text-slate-300">—</td>
                      const xh = XU_HUONG[x.xu_huong]
                      return (
                        <td key={khoaO(c)} className="border-b border-slate-100 px-1 py-0.5 text-center">
                          <button onClick={() => moO(x)}
                            title="Bấm xem các lần"
                            className={`w-full rounded px-1 py-0.5 tabular-nums hover:ring-2 hover:ring-indigo-300 ${mauPct(x.tb_dai)} ${dangMo ? 'ring-2 ring-indigo-500' : ''}`}>
                            <div className="flex items-baseline justify-center gap-1.5">
                              <span className="font-semibold">{Math.round(x.tb_dai)}%</span>
                              <span className={`text-[11px] font-semibold ${xh.mau}`}>{chenhChu(x.chenh)}</span>
                            </div>
                            <div className={`text-[10.5px] leading-tight ${xh.mau}`}>{xh.ky} {xh.ten}</div>
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {rows && rows.length > 0 && (
        <p className="text-[11px] text-slate-400">
          Ô = % hiện tại (TB {rows[0].cua_so_dai} lần gần nhất) · ±% = trend: TB {rows[0].cua_so_ngan} lần trừ TB {rows[0].cua_so_dai} lần · mức độ{nguong[tang] && <>: rõ khi chênh &gt;{nguong[tang].ro}, nhẹ {nguong[tang].nhe}–{nguong[tang].ro}, đi ngang dưới {nguong[tang].nhe}</>}; chưa đủ lần khi số lần ≤ {rows[0].cua_so_ngan}. Một lần = một bài làm (ET · MT · khảo sát · BTVN · test bổ trợ), mọi lần nặng như nhau. Từ 15/06/2026.
        </p>
      )}

      {mo && <BangLan mo={mo} onDong={() => setMo(null)} />}
    </div>
  )
}

function TangGiam({ v }: { v: number | null }) {
  if (v == null) return <span className="text-slate-300">mở đầu</span>
  return <span className={`font-semibold tabular-nums ${v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
    {v > 0 ? `▲${v}` : v < 0 ? `▼${-v}` : '='}
  </span>
}

// ── Panel bên phải: các lần của một ô ──
function BangLan({ mo, onDong }: { mo: Mo; onDong: () => void }) {
  const { o } = mo
  const xh = XU_HUONG[o.xu_huong]
  return (
    <div className="fixed right-4 top-20 z-40 flex max-h-[75vh] w-[480px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
      <div className="flex items-start gap-2 bg-slate-800 px-3 py-2 text-white">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold">{o.ho_ten}</div>
          <div className="truncate text-[11px] text-slate-300" title={o.ten ?? o.nut}>{o.ten ?? o.nut}</div>
        </div>
        <button onClick={onDong} className="h-6 w-6 shrink-0 rounded text-[16px] leading-none text-slate-300 hover:bg-white/10 hover:text-white">×</button>
      </div>
      <div className="grid grid-cols-4 gap-2 border-b border-slate-100 px-3 py-2 text-center text-[12px]">
        <div><div className="text-slate-400">Số lần</div><b className="text-slate-800">{o.so_lan}</b></div>
        <div><div className="text-slate-400">Hiện tại (TB{Math.min(o.so_lan, o.cua_so_dai)})</div><b className="text-slate-800">{o.tb_dai}%</b></div>
        <div><div className="text-slate-400">TB{Math.min(o.so_lan, o.cua_so_ngan)}</div><b className="text-slate-800">{o.tb_ngan}%</b></div>
        <div><div className="text-slate-400">Trend</div><b className={xh.mau}>{chenhChu(o.chenh) || '—'}</b><div className={`text-[11px] ${xh.mau}`}>{xh.ky} {xh.ten}</div></div>
      </div>
      {mo.lan?.[0]?.tang_giam != null && (
        <div className="border-b border-slate-100 px-3 py-1.5 text-[12px] text-slate-600">
          Lần gần nhất ({ngayVN(mo.lan[0].ngay).slice(0, 5)} · {TEN_KENH[mo.lan[0].kenh] ?? mo.lan[0].kenh}) làm % hiện tại{' '}
          <TangGiam v={mo.lan[0].tang_giam} />
        </div>
      )}
      <div className="flex-1 overflow-auto px-3 py-2 text-[12.5px]">
        {mo.loi ? <p className="text-rose-600">Không tải được: {mo.loi}</p>
          : !mo.lan ? <p className="text-slate-500">Đang tải…</p>
          : (
            <ol className="space-y-1">
              {mo.lan.map((l) => (
                <li key={l.stt} className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${l.trong_ngan ? 'border-indigo-200 bg-indigo-50/50' : l.trong_dai ? 'border-slate-200' : 'border-slate-100 opacity-50'}`}>
                  <span className="w-6 shrink-0 text-right font-mono text-[11px] text-slate-400">{l.stt}</span>
                  <span className="w-11 shrink-0 font-mono text-slate-500">{ngayVN(l.ngay).slice(0, 5)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-700">{TEN_KENH[l.kenh] ?? l.kenh}</span>{' '}
                    <span className={`rounded px-1 font-semibold tabular-nums ${mauPct(l.ti_le)}`}>{l.ti_le}%</span>
                    <span className="text-[11px] text-slate-400"> ({l.diem.toLocaleString('vi-VN')}/{l.so_cau} câu)</span>
                  </span>
                  <span className="w-12 shrink-0 text-right font-semibold tabular-nums text-slate-700">{l.hien_tai}%</span>
                  <span className="w-12 shrink-0 text-right"><TangGiam v={l.tang_giam} /></span>
                </li>
              ))}
            </ol>
          )}
        {mo.lan && mo.lan.length > 0 && (
          <p className="mt-2 text-[11px] text-slate-400">
            Mỗi dòng: % của lần đó · % hiện tại ngay sau lần đó · lần đó làm % hiện tại tăng/giảm bao nhiêu.
            Nền xanh = trong cửa sổ ngắn · viền = trong cửa sổ dài · mờ = ngoài cửa sổ.
          </p>
        )}
      </div>
    </div>
  )
}
