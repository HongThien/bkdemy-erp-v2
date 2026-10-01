// Màn GÁN MẪU — học thuật gán tay dạng cho một MẪU cố định của lô, để có bộ đề chấm cho skill gán dạng
// (spec-luong-kho.md §9.6 bước 2; mig 202609292119). Mỗi lần 1 câu, bấm 1 dạng (hoặc phím 1–9) là xong,
// tự nhảy sang câu chưa gán kế tiếp. "Không khớp dạng nào" = tạo đề xuất trao đổi (hiện ở màn 💡 Đề xuất).
// Nhãn = chính dang_chinh của câu (trigger DB ghi vết người gán) — không có bảng nhãn riêng.
//
// Hàng đợi ⇒ gán xong VÁ TẠI CHỖ, không quét lại; rời màn quay lại đúng câu đang dở (cache module-level).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { listDaiDang, listDaiGanMau, ganDaiMau, taoDaiDeXuatTraoDoi, type CauGanMau, type DaiDang, type LoGanMau } from '../../lib/kho/api'
import { MathText } from './ui'
import GanMauDungSai from './GanMauDungSai'

const NHO: { lo: string | null; rows: CauGanMau[]; dangs: DaiDang[]; vi: number } = { lo: null, rows: [], dangs: [], vi: 0 }

const NHAN_LOAI: Record<string, string> = { tra_loi_ngan: 'Trả lời ngắn', trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng/Sai', tu_luan: 'Tự luận' }

// Hai mẫu TÁCH RIÊNG (CEO 01/10): câu thường gán 1 dạng/câu · câu Đúng/Sai gán 1 dạng/MỆNH ĐỀ.
type CheDo = 'cau' | 'dung_sai'
const NHO_CHE: { che: CheDo } = { che: 'cau' }
export default function GanMauPanel(p: { lo: LoGanMau; onClose: () => void; onDoiBanDo?: () => void }) {
  const [che, setChe] = useState<CheDo>(NHO_CHE.che)
  const doi = (c: CheDo) => { NHO_CHE.che = c; setChe(c) }
  const nutChe = (
    <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
      {([['cau', 'Câu thường'], ['dung_sai', 'Đúng/Sai (từng mệnh đề)']] as [CheDo, string][]).map(([k, ten]) => (
        <button key={k} onClick={() => doi(k)}
          className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${che === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{ten}</button>
      ))}
    </div>
  )
  return che === 'cau' ? <GanMauCau {...p} nutChe={nutChe} /> : <GanMauDungSai {...p} nutChe={nutChe} />
}

function GanMauCau({ lo, onClose, onDoiBanDo, nutChe }: { lo: LoGanMau; onClose: () => void; onDoiBanDo?: () => void; nutChe: ReactNode }) {
  const coCache = NHO.lo === lo.lo
  const [rows, setRows] = useState<CauGanMau[]>(coCache ? NHO.rows : [])
  const [dangs, setDangs] = useState<DaiDang[]>(coCache ? NHO.dangs : [])
  const [vi, setVi] = useState(coCache ? NHO.vi : 0)
  const [loading, setLoading] = useState(!coCache)
  const [loi, setLoi] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [xemGiai, setXemGiai] = useState(false)
  const [khongKhop, setKhongKhop] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [thongBao, setThongBao] = useState<string | null>(null)
  const daDoi = useRef(false)

  const daGan = (c: CauGanMau) => !lo.dangCu.includes(c.dang_chinh) || !!c.de_xuat_cho
  const nhoLai = (r: CauGanMau[], v: number) => { NHO.lo = lo.lo; NHO.rows = r; NHO.vi = v }

  async function quet() {
    setLoading(true); setLoi(null)
    try {
      const [r, d] = await Promise.all([listDaiGanMau(lo.maChuyenDe, lo.soMau), listDaiDang(lo.khoi)])
      const ds = d.filter((x) => x.ma_chuyen_de === lo.maChuyenDe && !lo.dangCu.includes(x.ma_dang))
      const dau = Math.max(0, r.findIndex((c) => !daGan(c)))
      setRows(r); setDangs(ds); setVi(dau); NHO.dangs = ds; nhoLai(r, dau)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { if (!coCache) quet() }, [lo.lo]) // eslint-disable-line

  const cau = rows[vi]
  function den(i: number) {
    const v = Math.min(Math.max(i, 0), rows.length - 1)
    setVi(v); NHO.vi = v; setXemGiai(false); setKhongKhop(false); setLyDo(''); setLoi(null)
  }
  function keTiepChuaGan(r: CauGanMau[], tu: number) {
    for (let k = 1; k <= r.length; k++) { const i = (tu + k) % r.length; if (!daGan(r[i])) return i }
    return tu
  }
  function baoXong(s: string) { setThongBao(s); window.setTimeout(() => setThongBao(null), 2500) }

  async function gan(maDang: string) {
    if (!cau || busy) return
    setBusy(true); setLoi(null)
    try {
      const kq = await ganDaiMau(cau.ma_cau, maDang)
      const r = rows.map((x) => (x.ma_cau === cau.ma_cau ? { ...x, dang_chinh: kq.dang_chinh, ten_dang: kq.ten_dang } : x))
      const v = keTiepChuaGan(r, vi)
      setRows(r); nhoLai(r, v); daDoi.current = true
      baoXong(`Câu ${cau.thu_tu} → ${kq.ten_dang}`)
      setVi(v); setXemGiai(false); setKhongKhop(false); setLyDo('')
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBusy(false) }
  }
  async function guiKhongKhop() {
    if (!cau || busy || !lyDo.trim()) return
    setBusy(true); setLoi(null)
    try {
      const id = await taoDaiDeXuatTraoDoi(lo, cau.ma_cau, lyDo.trim())
      const r = rows.map((x) => (x.ma_cau === cau.ma_cau ? { ...x, de_xuat_cho: { id, loai: 'trao_doi', ly_do: lyDo.trim() } } : x))
      const v = keTiepChuaGan(r, vi)
      setRows(r); nhoLai(r, v)
      baoXong(`Câu ${cau.thu_tu} → đã ghi "không khớp", xem ở 💡 Đề xuất`)
      setVi(v); setXemGiai(false); setKhongKhop(false); setLyDo('')
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBusy(false) }
  }

  // Phím tắt: 1–9 gán dạng theo thứ tự nút · ← → chuyển câu. Bỏ qua khi đang gõ trong ô nhập.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT')) return
      if (e.key === 'ArrowRight') den(vi + 1)
      else if (e.key === 'ArrowLeft') den(vi - 1)
      else if (/^[1-9]$/.test(e.key)) { const d = dangs[+e.key - 1]; if (d) gan(d.ma_dang) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // chủ ý không deps: luôn bám state mới nhất

  function dong() { if (daDoi.current) onDoiBanDo?.(); onClose() }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <button onClick={dong} className="text-[14px] text-slate-500 hover:text-indigo-600">← Bản đồ kiến thức</button>
        <span className="text-[15px] font-semibold text-slate-800">Gán mẫu · {lo.ten}</span>
        {nutChe}
        {rows.length > 0 && <span className="text-[12.5px] text-slate-500">đã gán <b className="text-slate-700">{rows.filter(daGan).length}</b>/{rows.length} câu mẫu</span>}
        {thongBao && <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[12.5px] font-medium text-emerald-700">✓ {thongBao}</span>}
        <button onClick={quet} title="Quét lại" className="ml-auto rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] text-slate-600 hover:border-indigo-300 hover:text-indigo-700">↻</button>
      </div>

      {loading && rows.length === 0 ? <p className="p-8 text-sm text-slate-400">Đang tải…</p>
        : !cau ? <p className="p-8 text-sm text-rose-600">{loi ? `Không tải được: ${loi}` : 'Không có câu nào trong mẫu.'}</p>
        : (
          <div className="flex min-h-0 flex-1">
            {/* Dải số câu: xanh = đã gán, vàng = đã ghi không khớp, xám = chưa */}
            <div className="w-[76px] shrink-0 overflow-auto border-r border-slate-200 bg-white p-2">
              <div className="grid grid-cols-2 gap-1">
                {rows.map((c, i) => (
                  <button key={c.ma_cau} onClick={() => den(i)} title={c.de_xuat_cho ? 'Không khớp dạng nào' : daGan(c) ? c.ten_dang : 'Chưa gán'}
                    className={`h-7 rounded text-[11.5px] font-semibold ${i === vi ? 'ring-2 ring-indigo-500 ' : ''}${
                      c.de_xuat_cho ? 'bg-amber-100 text-amber-800' : daGan(c) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {c.thu_tu}
                  </button>
                ))}
              </div>
            </div>

            {/* Câu */}
            <div className="min-w-0 flex-1 overflow-auto px-8 py-5">
              <div className="mx-auto max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">Câu {cau.thu_tu}/{rows.length}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">{NHAN_LOAI[cau.loai_cau] ?? cau.loai_cau}</span>
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
                  {cau.lua_chon && cau.lua_chon.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[14px]">
                      {cau.lua_chon.map((o, i) => <li key={i} className="flex gap-1.5"><b>{String.fromCharCode(65 + i)}.</b><MathText>{o}</MathText></li>)}
                    </ul>
                  )}
                  {cau.menh_de && cau.menh_de.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[14px]">
                      {cau.menh_de.map((m, i) => <li key={i} className="flex gap-1.5"><b>{String.fromCharCode(97 + i)})</b><MathText>{m.noi_dung}</MathText></li>)}
                    </ul>
                  )}
                </div>
                {cau.loai_cau === 'dung_sai' && (
                  <p className="mt-2 text-[12.5px] text-slate-500">Câu Đúng/Sai: chọn dạng của <b>ý chính</b> cả câu. Dạng riêng từng mệnh đề gán ở màn Duyệt Đúng/Sai.</p>
                )}
                <button onClick={() => setXemGiai((v) => !v)} className="mt-3 text-[13px] font-medium text-indigo-600 hover:underline">
                  {xemGiai ? 'Ẩn đáp án và lời giải' : 'Xem đáp án và lời giải'}
                </button>
                {xemGiai && (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700">
                    <div><b>Đáp án:</b> {cau.dap_an ? <MathText>{cau.dap_an}</MathText> : <span className="text-slate-400">chưa có</span>}</div>
                    <div className="mt-2"><b>Lời giải:</b> {cau.loi_giai ? <MathText>{cau.loi_giai}</MathText> : <span className="text-slate-400">chưa có</span>}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Chọn dạng */}
            <div className="w-[380px] shrink-0 overflow-auto border-l border-slate-200 bg-white p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Câu này thuộc dạng nào?</div>
              <ul className="space-y-1.5">
                {dangs.map((d, i) => {
                  const dang = cau.dang_chinh === d.ma_dang
                  return (
                    <li key={d.ma_dang}>
                      <button disabled={busy || cau.da_duyet} onClick={() => gan(d.ma_dang)}
                        className={`w-full rounded-lg border px-3 py-2 text-left transition disabled:opacity-50 ${
                          dang ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'}`}>
                        <div className="flex items-baseline gap-2">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${dang ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                          <span className="text-[13.5px] font-semibold text-slate-800">{d.ten_dang}</span>
                        </div>
                        {d.mo_ta_ngan && <p className="mt-1 pl-7 text-[12px] leading-snug text-slate-500">{d.mo_ta_ngan}</p>}
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-3 border-t border-slate-100 pt-3">
                {cau.de_xuat_cho ? (
                  <p className="rounded-lg bg-amber-50 p-2.5 text-[12.5px] text-amber-800">Đã ghi <b>không khớp dạng nào</b>: {cau.de_xuat_cho.ly_do}</p>
                ) : !khongKhop ? (
                  <button disabled={busy || cau.da_duyet} onClick={() => setKhongKhop(true)}
                    className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-600 hover:border-amber-400 hover:text-amber-700 disabled:opacity-50">
                    Không khớp dạng nào…
                  </button>
                ) : (
                  <div>
                    <textarea value={lyDo} onChange={(e) => setLyDo(e.target.value)} rows={3} autoFocus
                      placeholder="Vì sao không khớp? (vd: câu này đọc biểu đồ, nên thuộc chuyên đề khác)"
                      className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-[13px] text-slate-800 focus:border-indigo-400 focus:outline-none" />
                    <div className="mt-1.5 flex items-center gap-2">
                      <button disabled={busy || !lyDo.trim()} onClick={guiKhongKhop}
                        className="rounded-md bg-amber-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-amber-700 disabled:opacity-40">Ghi lại</button>
                      <button disabled={busy} onClick={() => { setKhongKhop(false); setLyDo('') }} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
                    </div>
                  </div>
                )}
              </div>
              {cau.da_duyet && <p className="mt-2 text-[12.5px] text-slate-500">Câu này đã duyệt — đổi dạng ở màn Duyệt.</p>}
              {loi && <p className="mt-2 text-[13px] text-rose-600">{loi}</p>}
              <p className="mt-4 text-[11.5px] leading-snug text-slate-400">Phím tắt: 1–{Math.min(dangs.length, 9)} gán dạng · ← → chuyển câu. Gán nhầm thì bấm lại dạng đúng.</p>
            </div>
          </div>
        )}
    </div>
  )
}
