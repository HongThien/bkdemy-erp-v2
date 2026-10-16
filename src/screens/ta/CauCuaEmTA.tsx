// TA XEM CÂU EM ĐANG LÀM (Thùy 16/10): "App HS hiện câu nào thì app TA cũng có chỗ nhìn đúng câu đó + đáp án chi tiết để giảng mà không cần nháp."
// Đọc fn_ta_cau_cua_em (bản chụp bai_test_cau = ĐÚNG cái em thấy). Dùng chung cho ca bổ trợ yếu · đuổi · bù. Mặc định gập; mở ra tự cập nhật 10s.
// Câu em đang đứng (câu chưa trả lời đầu tiên của bài chưa nộp) tự mở sẵn; câu khác chạm để mở. Đáp án + lời giải chỉ hiện khi TA bấm
// (hoặc câu em đã trả lời) — TA không lỡ để lộ khi em nhìn chung iPad.
import { useEffect, useMemo, useRef, useState } from 'react'
import { cauCuaEm, LOAI_BAI_CAU_EM, type CauCuaEm } from '../../lib/botro_yeu_ca'
import { chiSoCuaChu, chuCaiChon, type NguLieuSnap } from '../../lib/testonline'
import { ChuMon } from '../kho/ui'

const POLL_MS = 10000

const bo = (s: string) => s.replace(/^\s*[A-F][.)]\s*/, '')
const chuan = (s: unknown) => String(s ?? '').replace(/\$/g, '').replace(/\\d?frac/gi, 'frac').replace(/\s+/g, '').toLowerCase()
const gio = (iso: string) => new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
const txt = (v: unknown) => (v == null ? '—' : typeof v === 'string' ? v : JSON.stringify(v))

// Chỉ số đáp án đúng của câu trắc nghiệm: khoá là chữ cái A–D; một số câu cũ khoá là chính chữ đáp án ⇒ so với từng lựa chọn.
function chiSoDung(c: CauCuaEm): number {
  const k = chiSoCuaChu(c.dap_an_key)
  if (k >= 0 && k < (c.lua_chon?.length ?? 0)) return k
  const kc = chuan(c.dap_an_key)
  return (c.lua_chon ?? []).findIndex((o) => chuan(bo(o)) === kc)
}

function NguLieu({ nl, mon }: { nl: NguLieuSnap; mon: string | null }) {
  return (
    <div className="mb-1.5 rounded-lg border border-sky-200 bg-sky-50/50 p-2.5">
      <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-sky-700">Ngữ liệu{nl.tieu_de ? ` · ${nl.tieu_de}` : ''}</p>
      {nl.anh && <img src={nl.anh} alt="ngữ liệu" className="mb-1.5 max-h-[220px] max-w-full rounded border border-slate-200 bg-white" />}
      {nl.noi_dung && <div className="max-h-[220px] overflow-y-auto pr-1 text-[13px] leading-snug text-slate-800"><ChuMon mon={mon}>{nl.noi_dung}</ChuMon></div>}
    </div>
  )
}

function CauThe({ c, mon, moSan, loSan, onMo, onLo }: { c: CauCuaEm; mon: string | null; moSan: boolean; loSan: boolean; onMo: () => void; onLo: () => void }) {
  const daTraLoi = c.dap_an_hs != null
  const dung = c.verdict === 'correct'
  const lo = daTraLoi || loSan // đáp án đúng hiện sẵn khi em đã trả lời; chưa thì chờ TA bấm
  const [loiGiai, setLoiGiai] = useState(false)
  const tn = c.loai_cau === 'trac_nghiem' && (c.lua_chon?.length ?? 0) > 0
  const ds = c.loai_cau === 'dung_sai' && Array.isArray(c.menh_de)
  const keyIdx = tn ? chiSoDung(c) : -1
  const hsIdx = tn && typeof c.dap_an_hs === 'number' ? c.dap_an_hs : -1
  const nl = c.ngu_lieu as unknown as NguLieuSnap | null
  const tomTat = (c.noi_dung ?? '').replace(/\s+/g, ' ').slice(0, 70)
  const dau = !daTraLoi ? (c.dang_lam ? '▶' : '·') : dung ? '✓' : c.verdict === 'partial' ? '½' : '✗'
  const mauDau = !daTraLoi ? (c.dang_lam ? 'text-indigo-600' : 'text-slate-300') : dung ? 'text-emerald-600' : c.verdict === 'partial' ? 'text-amber-600' : 'text-rose-600'

  return (
    <div className={`rounded-xl ring-1 ${c.dang_lam ? 'bg-indigo-50/60 ring-indigo-300' : 'bg-white ring-slate-200'}`}>
      <button onClick={onMo} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <span className={`w-4 shrink-0 text-center text-[14px] font-extrabold ${mauDau}`}>{dau}</span>
        <span className="shrink-0 text-[12.5px] font-bold text-slate-700">Câu {c.thu_tu}</span>
        <span className="min-w-0 flex-1 truncate text-[12px] text-slate-500">{c.ten_dang}{tomTat ? ` · ${tomTat.replace(/[$\\]/g, '')}` : ''}</span>
        {c.dang_lam && <span className="shrink-0 rounded bg-indigo-600 px-1.5 py-px text-[10.5px] font-bold text-white">đang làm</span>}
        <span className="shrink-0 text-slate-400">{moSan ? '▾' : '▸'}</span>
      </button>
      {moSan && (
        <div className="border-t border-slate-100 px-3 pb-3 pt-2">
          <p className="mb-1 text-[11px] font-semibold text-slate-400">{c.ten_dang}{c.ma_cau ? ` · ${c.ma_cau}` : ''}</p>
          {nl && <NguLieu nl={nl} mon={mon} />}
          {c.noi_dung && <div className="text-[13.5px] leading-snug text-slate-900"><ChuMon mon={mon}>{c.noi_dung}</ChuMon></div>}
          {c.anh_de && <img src={c.anh_de} alt="hình của câu" className="mt-1.5 max-h-[260px] max-w-full rounded border border-slate-200 bg-white" />}

          {/* Lựa chọn — có chữ cái như trên app HS; ✓ = đáp án đúng (khi lộ), "em chọn" = bài em làm */}
          {tn && (
            <div className="mt-2 flex flex-col gap-1.5">
              {c.lua_chon!.map((o, i) => {
                const laDung = lo && i === keyIdx
                const emChon = i === hsIdx
                const cls = laDung ? 'bg-emerald-50 ring-emerald-400' : emChon && daTraLoi ? 'bg-rose-50 ring-rose-300' : 'bg-white ring-slate-200'
                return (
                  <div key={i} className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[13px] ring-1 ${cls}`}>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${laDung ? 'bg-emerald-600 text-white' : emChon && daTraLoi ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{chuCaiChon(i)}</span>
                    <span className="min-w-0 flex-1 pt-0.5"><ChuMon mon={mon}>{bo(o)}</ChuMon></span>
                    {emChon && <span className={`shrink-0 rounded px-1.5 py-px text-[10.5px] font-bold ${dung ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>em chọn</span>}
                    {laDung && !emChon && <span className="shrink-0 text-[11px] font-bold text-emerald-700">✓ đúng</span>}
                  </div>
                )
              })}
            </div>
          )}

          {/* Đúng/Sai nhiều mệnh đề */}
          {ds && (
            <div className="mt-2 flex flex-col gap-1.5">
              {(c.menh_de as { noi_dung: string }[]).map((m, i) => {
                const k = Array.isArray(c.dap_an_key) ? String((c.dap_an_key as unknown[])[i] ?? '').toUpperCase() : ''
                const h = Array.isArray(c.dap_an_hs) ? String((c.dap_an_hs as unknown[])[i] ?? '').toUpperCase() : ''
                return (
                  <div key={i} className="rounded-lg bg-white px-2.5 py-1.5 text-[13px] ring-1 ring-slate-200">
                    <div className="flex gap-1.5"><b className="text-slate-500">{'abcd'[i] ?? i + 1})</b><span className="min-w-0 flex-1"><ChuMon mon={mon}>{m.noi_dung}</ChuMon></span></div>
                    <p className="mt-0.5 text-[12px] text-slate-600">
                      {h && <>Em chọn: <b className={h === k ? 'text-emerald-700' : 'text-rose-700'}>{h === 'D' ? 'Đúng' : h === 'S' ? 'Sai' : h}</b></>}
                      {lo && k && <> · Đáp án: <b className="text-emerald-700">{k === 'D' ? 'Đúng' : k === 'S' ? 'Sai' : k}</b></>}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Trả lời ngắn / tự luận */}
          {!tn && !ds && (
            <div className="mt-2 grid grid-cols-1 gap-1.5 text-[13px] sm:grid-cols-2">
              <div className="rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-slate-200"><span className="text-slate-400">Em trả lời: </span>{daTraLoi ? <b className={dung ? 'text-emerald-700' : 'text-rose-700'}><ChuMon mon={mon}>{txt(c.dap_an_hs)}</ChuMon></b> : <span className="text-slate-400">chưa trả lời</span>}</div>
              {lo && <div className="rounded-lg bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-300"><span className="text-slate-500">Đáp án: </span><b className="text-emerald-800"><ChuMon mon={mon}>{txt(c.dap_an_key)}</ChuMon></b></div>}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!daTraLoi && !loSan && (
              <button onClick={onLo} className="rounded-lg bg-slate-800 px-3 py-1.5 text-[12.5px] font-bold text-white active:scale-95">Xem đáp án đúng</button>
            )}
            <button onClick={() => { if (!lo) onLo(); setLoiGiai((v) => !v) }} disabled={!c.loi_giai && !c.anh_dap_an}
              className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-[12.5px] font-bold text-indigo-700 disabled:opacity-40">
              {loiGiai ? '▾ Ẩn lời giải' : '▸ Lời giải chi tiết'}{!c.loi_giai && !c.anh_dap_an ? ' (chưa có)' : ''}
            </button>
          </div>
          {loiGiai && (c.loi_giai || c.anh_dap_an) && (
            <div className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-2.5">
              {c.loi_giai && <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-800"><ChuMon mon={mon}>{c.loi_giai}</ChuMon></div>}
              {c.anh_dap_an && <img src={c.anh_dap_an} alt="lời giải" className="mt-1.5 max-h-[320px] max-w-full rounded border border-slate-200 bg-white" />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CauCuaEmTA({ hocSinhId, buoiId, mon, soNgay = 0, tenHS, giay }: {
  hocSinhId: string; buoiId: string | null; mon: string | null
  giay?: boolean // ca 📄 giấy: em làm trên phiếu in, không có "câu đang làm" trên app
  soNgay?: number // lùi thêm bao nhiêu ngày (đuổi/bù không gắn buổi) — TA có thể bấm "7 ngày gần nhất"
  tenHS?: string
}) {
  const [rows, setRows] = useState<CauCuaEm[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState(false)
  const [lui, setLui] = useState(soNgay)
  const [moCau, setMoCau] = useState<Record<string, boolean>>({})
  const [loCau, setLoCau] = useState<Record<string, boolean>>({})
  const moRef = useRef(mo); moRef.current = mo

  // "Đang làm" chỉ gắn cho bài MỚI NHẤT còn dở (các bài chưa nộp cũ hơn là bài bỏ dở) và không có ở ca giấy.
  const chuanHoa = (r: CauCuaEm[]) => { const moiNhat = r.find((c) => c.dang_lam)?.bai_test_id; return r.map((c) => c.dang_lam && (giay || c.bai_test_id !== moiNhat) ? { ...c, dang_lam: false } : c) }
  const tai = () => cauCuaEm(hocSinhId, buoiId, lui, lui > 0 ? 120 : 40).then((r) => { setRows(chuanHoa(r)); setLoi(null) }).catch((e: any) => setLoi(e?.message ?? String(e)))
  useEffect(() => { setRows(null); tai() }, [hocSinhId, buoiId, lui, giay]) // eslint-disable-line
  useEffect(() => {
    const id = setInterval(() => { if (moRef.current && document.visibilityState === 'visible') tai() }, POLL_MS)
    return () => clearInterval(id)
  }, [hocSinhId, buoiId, lui, giay]) // eslint-disable-line

  // Gom theo bài (giữ thứ tự mới nhất trước mà RPC đã xếp)
  const bai = useMemo(() => {
    const m = new Map<string, { id: string; loai: CauCuaEm['loai_bai']; tao: string; nop: boolean; caus: CauCuaEm[] }>()
    for (const c of rows ?? []) {
      let b = m.get(c.bai_test_id)
      if (!b) { b = { id: c.bai_test_id, loai: c.loai_bai, tao: c.tao_luc, nop: c.da_nop, caus: [] }; m.set(c.bai_test_id, b) }
      b.caus.push(c)
    }
    return [...m.values()]
  }, [rows])

  const dangLam = (rows ?? []).find((c) => c.dang_lam)
  const tomTat = rows == null ? 'đang tải…' : rows.length === 0
    ? (lui > 0 ? `chưa có câu nào trong ${lui} ngày gần nhất` : 'chưa có câu nào hôm nay — em chưa bắt đầu hoặc đang ở phần lý thuyết')
    : dangLam ? `em đang ở câu ${dangLam.thu_tu} · ${dangLam.ten_dang}` : `${rows.length} câu em đã được đưa`

  return (
    <div className="mb-3 rounded-2xl bg-white p-3 ring-1 ring-indigo-200">
      <button onClick={() => setMo(!mo)} className="flex w-full items-center justify-between gap-2 text-left">
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold text-slate-800">👁 Câu em đang làm{tenHS ? ` · ${tenHS}` : ''} — đề + đáp án + lời giải</p>
          <p className="truncate text-[11.5px] text-slate-500">{tomTat}</p>
        </div>
        <span className="shrink-0 text-slate-400">{mo ? '▾' : '▸'}</span>
      </button>
      {loi && <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[12px] text-rose-700">{loi}</p>}
      {mo && (
        <div className="mt-2">
          <div className="mb-2 flex items-center gap-2 text-[11.5px] text-slate-500">
            <span>Đúng câu em thấy trên app · tự cập nhật 10 giây.</span>
            <button onClick={() => setLui(lui > 0 ? soNgay : 7)} className="ml-auto rounded-md border border-slate-200 px-2 py-0.5 font-semibold text-slate-600">{lui > 0 ? 'Chỉ hôm nay' : 'Xem 7 ngày gần nhất'}</button>
            <button onClick={() => tai()} className="rounded-md border border-slate-200 px-2 py-0.5 font-semibold text-slate-600">↻</button>
          </div>
          {rows != null && rows.length === 0 && <p className="rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] text-slate-500">{tomTat}.</p>}
          <div className="flex flex-col gap-3">
            {bai.map((b) => {
              const lamRoi = b.caus.filter((c) => c.dap_an_hs != null).length
              return (
                <div key={b.id}>
                  <p className="mb-1 flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold text-slate-500">
                    <span className="rounded bg-slate-100 px-1.5 py-px text-slate-700">{LOAI_BAI_CAU_EM[b.loai] ?? b.loai}</span>
                    <span>{gio(b.tao)}</span>
                    <span>· em làm {lamRoi}/{b.caus.length} câu</span>
                    {b.nop ? <span className="text-emerald-700">· đã nộp</span> : <span className="text-indigo-700">· chưa nộp</span>}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {b.caus.map((c) => (
                      <CauThe key={c.bai_test_cau_id} c={c} mon={mon}
                        moSan={moCau[c.bai_test_cau_id] ?? c.dang_lam}
                        loSan={!!loCau[c.bai_test_cau_id]}
                        onMo={() => setMoCau((p) => ({ ...p, [c.bai_test_cau_id]: !(p[c.bai_test_cau_id] ?? c.dang_lam) }))}
                        onLo={() => setLoCau((p) => ({ ...p, [c.bai_test_cau_id]: true }))} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
