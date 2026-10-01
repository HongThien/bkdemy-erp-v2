// GÁN MẪU · ĐÚNG/SAI — Đúng/Sai là kiểu câu RIÊNG (CEO 01/10): 4 mệnh đề = 4 dạng khác nhau, có thể thuộc
// chuyên đề khác câu cha. Ở đây gán dạng cho TỪNG mệnh đề (mig 202610011330). Chọn mệnh đề → bấm dạng.
// Danh tính mệnh đề = (ma_cau, thu_tu). Nhãn ghi vào menh_de của câu cha, trigger DB đồng bộ + ghi vết người gán.
//
// Hàng đợi ⇒ gán xong VÁ TẠI CHỖ, tự nhảy mệnh đề chưa gán kế tiếp; cache module-level để quay lại đúng chỗ.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  listDaiDang, listDaiGanMauDungSai, ganDaiMauMenhDe, taoDaiDeXuatTraoDoi,
  type CauDungSaiGanMau, type DaiDang, type LoGanMau, type MenhDeGanMau,
} from '../../lib/kho/api'
import DangPickerOne from '../../components/DangPickerOne'
import { MathText } from './ui'

type DangGan = { ma: string; ten: string; cd: string | null }
const NHO: { lo: string | null; rows: CauDungSaiGanMau[]; dangs: DaiDang[]; vi: number; md: number; ganDay: DangGan[] } =
  { lo: null, rows: [], dangs: [], vi: 0, md: 1, ganDay: [] }

const CHU = (i: number) => String.fromCharCode(96 + i) // 1 → a
const laCho = (ma: string | null) => !ma || /000000$/.test(ma)
const mdDaGan = (m: MenhDeGanMau) => !laCho(m.ma_dang)

export default function GanMauDungSai({ lo, onClose, onDoiBanDo, nutChe }: { lo: LoGanMau; onClose: () => void; onDoiBanDo?: () => void; nutChe: ReactNode }) {
  const coCache = NHO.lo === lo.lo
  const [rows, setRows] = useState<CauDungSaiGanMau[]>(coCache ? NHO.rows : [])
  const [dangs, setDangs] = useState<DaiDang[]>(coCache ? NHO.dangs : [])
  const [vi, setVi] = useState(coCache ? NHO.vi : 0)
  const [md, setMd] = useState(coCache ? NHO.md : 1)          // thu_tu mệnh đề đang chọn
  const [ganDay, setGanDay] = useState<DangGan[]>(coCache ? NHO.ganDay : [])  // dạng NGOÀI chuyên đề vừa dùng — bấm lại cho nhanh
  const [loading, setLoading] = useState(!coCache)
  const [loi, setLoi] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [xemGiai, setXemGiai] = useState(false)
  const [picker, setPicker] = useState(false)
  const [ghiChu, setGhiChu] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [thongBao, setThongBao] = useState<string | null>(null)
  const daDoi = useRef(false)

  const nho = (r: CauDungSaiGanMau[], v: number, m: number) => { NHO.lo = lo.lo; NHO.rows = r; NHO.vi = v; NHO.md = m }
  // vị trí (câu, mệnh đề) chưa gán kế tiếp, tính từ SAU (v, m); không còn ⇒ đứng yên
  function keTiep(r: CauDungSaiGanMau[], v: number, m: number): [number, number] {
    for (let k = 0; k <= r.length; k++) {
      const i = (v + k) % r.length
      const c = r[i].menh_de.find((x) => !mdDaGan(x) && (k > 0 || x.thu_tu > m))
      if (c) return [i, c.thu_tu]
    }
    return [v, m]
  }

  async function quet() {
    setLoading(true); setLoi(null)
    try {
      const [r, d] = await Promise.all([listDaiGanMauDungSai(lo.maChuyenDe, lo.soMauDungSai), listDaiDang(lo.khoi)])
      const ds = d.filter((x) => x.ma_chuyen_de === lo.maChuyenDe && !lo.dangCu.includes(x.ma_dang))
      const [v, m] = r.length ? keTiep(r, 0, 0) : [0, 1]
      setRows(r); setDangs(ds); setVi(v); setMd(m); NHO.dangs = ds; nho(r, v, m)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { if (!coCache) quet() }, [lo.lo]) // eslint-disable-line

  const cau = rows[vi]
  const mdChon = cau?.menh_de.find((x) => x.thu_tu === md) ?? null
  function den(v: number, m = 1) {
    const i = Math.min(Math.max(v, 0), rows.length - 1)
    setVi(i); setMd(m); NHO.vi = i; NHO.md = m; setXemGiai(false); setGhiChu(false); setLyDo(''); setLoi(null)
  }
  function chonMd(m: number) { setMd(m); NHO.md = m; setLoi(null) }
  function baoXong(s: string) { setThongBao(s); window.setTimeout(() => setThongBao(null), 2500) }

  async function gan(maDang: string) {
    if (!cau || !mdChon || busy) return
    setBusy(true); setLoi(null)
    try {
      const kq = await ganDaiMauMenhDe(cau.ma_cau, mdChon.thu_tu, maDang)
      const r = rows.map((x) => x.ma_cau !== cau.ma_cau ? x : {
        ...x, menh_de: x.menh_de.map((m) => m.thu_tu === mdChon.thu_tu ? { ...m, ma_dang: kq.ma_dang, ten_dang: kq.ten_dang, ten_chuyen_de: kq.ten_chuyen_de } : m),
      })
      const [v, m] = keTiep(r, vi, mdChon.thu_tu)
      setRows(r); nho(r, v, m); daDoi.current = true
      if (!dangs.some((d) => d.ma_dang === kq.ma_dang)) {
        const g = [{ ma: kq.ma_dang, ten: kq.ten_dang, cd: kq.ten_chuyen_de }, ...ganDay.filter((x) => x.ma !== kq.ma_dang)].slice(0, 8)
        setGanDay(g); NHO.ganDay = g
      }
      baoXong(`Câu ${cau.thu_tu} · ${CHU(mdChon.thu_tu)}) → ${kq.ten_dang}`)
      if (v !== vi) { setXemGiai(false); setGhiChu(false); setLyDo('') }
      setVi(v); setMd(m)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBusy(false) }
  }
  async function guiGhiChu() {
    if (!cau || busy || !lyDo.trim()) return
    setBusy(true); setLoi(null)
    try {
      const noiDung = mdChon ? `Mệnh đề ${CHU(mdChon.thu_tu)}): ${lyDo.trim()}` : lyDo.trim()
      const id = await taoDaiDeXuatTraoDoi(lo, cau.ma_cau, noiDung)
      const r = rows.map((x) => x.ma_cau === cau.ma_cau ? { ...x, de_xuat_cho: [...(x.de_xuat_cho ?? []), { id, ly_do: noiDung }] } : x)
      setRows(r); nho(r, vi, md)
      baoXong('Đã ghi — xem ở 💡 Đề xuất'); setGhiChu(false); setLyDo('')
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBusy(false) }
  }

  // Phím tắt: 1–9 gán dạng trong chuyên đề · ↑ ↓ đổi mệnh đề · ← → đổi câu. Bỏ qua khi đang gõ hoặc đang mở bảng chọn dạng.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement
      if (picker || (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT'))) return
      if (e.key === 'ArrowRight') den(vi + 1)
      else if (e.key === 'ArrowLeft') den(vi - 1)
      else if (e.key === 'ArrowDown' && cau) { e.preventDefault(); chonMd(Math.min(md + 1, cau.menh_de.length)) }
      else if (e.key === 'ArrowUp' && cau) { e.preventDefault(); chonMd(Math.max(md - 1, 1)) }
      else if (/^[1-9]$/.test(e.key)) { const d = dangs[+e.key - 1]; if (d) gan(d.ma_dang) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // chủ ý không deps: luôn bám state mới nhất

  function dong() { if (daDoi.current) onDoiBanDo?.(); onClose() }
  const mauSo = (c: CauDungSaiGanMau) => {
    const n = c.menh_de.filter(mdDaGan).length
    return n === c.menh_de.length ? 'bg-emerald-100 text-emerald-800' : n > 0 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <button onClick={dong} className="text-[14px] text-slate-500 hover:text-indigo-600">← Bản đồ kiến thức</button>
        <span className="text-[15px] font-semibold text-slate-800">Gán mẫu · {lo.ten}</span>
        {nutChe}
        {rows.length > 0 && (
          <span className="text-[12.5px] text-slate-500">đã gán <b className="text-slate-700">{rows.flatMap((c) => c.menh_de).filter(mdDaGan).length}</b>/{rows.flatMap((c) => c.menh_de).length} mệnh đề · {rows.length} câu</span>
        )}
        {thongBao && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[12.5px] font-medium text-emerald-700">✓ {thongBao}</span>}
        <button onClick={quet} title="Quét lại" className="ml-auto rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] text-slate-600 hover:border-indigo-300 hover:text-indigo-700">↻</button>
      </div>

      {loading && rows.length === 0 ? <p className="p-8 text-sm text-slate-400">Đang tải…</p>
        : !cau ? <p className="p-8 text-sm text-rose-600">{loi ? `Không tải được: ${loi}` : 'Không có câu Đúng/Sai nào trong mẫu.'}</p>
        : (
          <div className="flex min-h-0 flex-1">
            {/* Dải số câu: xanh lá = đủ 4 mệnh đề · xanh dương = gán dở · xám = chưa */}
            <div className="w-[76px] shrink-0 overflow-auto border-r border-slate-200 bg-white p-2">
              <div className="grid grid-cols-2 gap-1">
                {rows.map((c, i) => (
                  <button key={c.ma_cau} onClick={() => den(i, c.menh_de.find((x) => !mdDaGan(x))?.thu_tu ?? 1)}
                    title={`${c.menh_de.filter(mdDaGan).length}/${c.menh_de.length} mệnh đề đã gán`}
                    className={`h-7 rounded text-[11.5px] font-semibold ${i === vi ? 'ring-2 ring-indigo-500 ' : ''}${mauSo(c)}`}>{c.thu_tu}</button>
                ))}
              </div>
            </div>

            {/* Câu + 4 mệnh đề */}
            <div className="min-w-0 flex-1 overflow-auto px-8 py-5">
              <div className="mx-auto max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">Câu {cau.thu_tu}/{rows.length}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">Đúng/Sai</span>
                  <span className="font-mono">{cau.ma_cau}</span>
                  {cau.ten_de_goc && <span className="truncate" title={cau.ten_de_goc}>· {cau.ten_de_goc}</span>}
                  <span className="ml-auto flex gap-1">
                    <button onClick={() => den(vi - 1)} disabled={vi === 0} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-slate-600 disabled:opacity-40">←</button>
                    <button onClick={() => den(vi + 1)} disabled={vi === rows.length - 1} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-slate-600 disabled:opacity-40">→</button>
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-[15px] leading-relaxed text-slate-800 shadow-sm">
                  <MathText>{cau.noi_dung}</MathText>
                  {cau.anh_de && <img src={cau.anh_de} alt="hình của đề" className="mt-3 max-h-72 w-auto rounded-lg border border-slate-200" />}
                </div>

                <ul className="mt-3 space-y-2">
                  {cau.menh_de.map((m) => {
                    const chon = m.thu_tu === md
                    return (
                      <li key={m.thu_tu}>
                        <button onClick={() => chonMd(m.thu_tu)}
                          className={`w-full rounded-xl border bg-white p-3.5 text-left text-[14px] text-slate-800 transition ${chon ? 'border-indigo-500 ring-2 ring-indigo-500/25' : 'border-slate-200 hover:border-indigo-300'}`}>
                          <div className="flex gap-2">
                            <b className="shrink-0">{CHU(m.thu_tu)})</b>
                            <div className="min-w-0 flex-1"><MathText>{m.noi_dung}</MathText></div>
                            {m.dap_an && <span className={`h-fit shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold ${m.dap_an === 'D' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{m.dap_an === 'D' ? 'Đúng' : 'Sai'}</span>}
                          </div>
                          <div className="mt-2 pl-6 text-[12.5px]">
                            {mdDaGan(m)
                              ? <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">{m.ten_dang ?? m.ma_dang}{m.ten_chuyen_de ? <span className="font-normal text-emerald-700/80"> · {m.ten_chuyen_de}</span> : null}</span>
                              : <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-500">chưa gán dạng</span>}
                          </div>
                          {xemGiai && m.loi_giai && <div className="mt-2 border-t border-slate-100 pl-6 pt-2 text-[13px] text-slate-600"><MathText>{m.loi_giai}</MathText></div>}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <button onClick={() => setXemGiai((v) => !v)} className="mt-3 text-[13px] font-medium text-indigo-600 hover:underline">
                  {xemGiai ? 'Ẩn lời giải từng mệnh đề' : 'Xem lời giải từng mệnh đề'}
                </button>
                {cau.de_xuat_cho && cau.de_xuat_cho.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {cau.de_xuat_cho.map((d) => <li key={d.id} className="rounded-lg bg-amber-50 p-2.5 text-[12.5px] text-amber-800">Đã ghi chú: {d.ly_do}</li>)}
                  </ul>
                )}
              </div>
            </div>

            {/* Chọn dạng cho mệnh đề đang chọn */}
            <div className="w-[380px] shrink-0 overflow-auto border-l border-slate-200 bg-white p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Mệnh đề {mdChon ? CHU(mdChon.thu_tu) + ')' : ''} thuộc dạng nào?
              </div>
              <ul className="space-y-1.5">
                {dangs.map((d, i) => {
                  const dang = mdChon?.ma_dang === d.ma_dang
                  return (
                    <li key={d.ma_dang}>
                      <button disabled={busy || !mdChon || mdChon.da_duyet} onClick={() => gan(d.ma_dang)} title={d.mo_ta_ngan ?? undefined}
                        className={`flex w-full items-baseline gap-2 rounded-lg border px-3 py-1.5 text-left transition disabled:opacity-50 ${
                          dang ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'}`}>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${dang ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                        <span className="text-[13.5px] font-semibold text-slate-800">{d.ten_dang}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Dạng ở chuyên đề khác</div>
                {ganDay.length > 0 && (
                  <ul className="mb-1.5 space-y-1">
                    {ganDay.map((g) => (
                      <li key={g.ma}>
                        <button disabled={busy || !mdChon || mdChon.da_duyet} onClick={() => gan(g.ma)}
                          className={`w-full rounded-lg border px-3 py-1.5 text-left transition disabled:opacity-50 ${mdChon?.ma_dang === g.ma ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'}`}>
                          <div className="text-[13px] font-semibold text-slate-800">{g.ten}</div>
                          {g.cd && <div className="text-[11.5px] text-slate-500">{g.cd}</div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <button disabled={busy || !mdChon || mdChon.da_duyet} onClick={() => setPicker(true)}
                  className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700 disabled:opacity-50">
                  Chọn dạng khác trong bản đồ khối {lo.khoi}…
                </button>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                {!ghiChu ? (
                  <button disabled={busy} onClick={() => setGhiChu(true)}
                    className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-600 hover:border-amber-400 hover:text-amber-700 disabled:opacity-50">
                    Mệnh đề này không khớp dạng nào…
                  </button>
                ) : (
                  <div>
                    <textarea value={lyDo} onChange={(e) => setLyDo(e.target.value)} rows={3} autoFocus
                      placeholder="Vì sao không khớp? Nên có dạng gì?"
                      className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-[13px] text-slate-800 focus:border-indigo-400 focus:outline-none" />
                    <div className="mt-1.5 flex items-center gap-2">
                      <button disabled={busy || !lyDo.trim()} onClick={guiGhiChu}
                        className="rounded-md bg-amber-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-amber-700 disabled:opacity-40">Ghi lại</button>
                      <button disabled={busy} onClick={() => { setGhiChu(false); setLyDo('') }} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
                    </div>
                  </div>
                )}
              </div>
              {mdChon?.da_duyet && <p className="mt-2 text-[12.5px] text-slate-500">Mệnh đề này đã duyệt — đổi dạng ở màn Duyệt Đúng/Sai.</p>}
              {loi && <p className="mt-2 text-[13px] text-rose-600">{loi}</p>}
              <p className="mt-4 text-[11.5px] leading-snug text-slate-400">Phím tắt: 1–{Math.min(dangs.length, 9)} gán dạng · ↑ ↓ đổi mệnh đề · ← → đổi câu. Gán nhầm thì chọn lại mệnh đề rồi bấm dạng đúng.</p>
            </div>
          </div>
        )}

      {picker && mdChon && <DangPickerOne khoi={lo.khoi} onClose={() => setPicker(false)} onPick={(ma) => { setPicker(false); gan(ma) }} />}
    </div>
  )
}
