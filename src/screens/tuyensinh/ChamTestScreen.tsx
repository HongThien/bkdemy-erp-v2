// Chấm test đầu vào (Story 2) — pool team học thuật, ai mở thì làm (KHÔNG owner cứng).
// Card 3 cột: scan (kéo dọc riêng) | đáp án từng câu | Đ/C/S per câu, tính điểm+% realtime.
// KHÔNG chấm-vẽ-trên-PDF (OUT v1) — chỉ chọn mức trên màn. KHÔNG feed mastery.
import { useEffect, useMemo, useState } from 'react'
import {
  listCanCham, listDaCham, getCaTestCauKq, chamCauTest, dongChamTest, moLaiChamTest, tongDiem,
  type CaTestChoCham, type CaTestCau,
} from '../../lib/detest'
import { homNayVN } from '../../lib/tuan'
import { MathText } from '../kho/ui'

const KQ_LABEL: Record<'correct' | 'partial' | 'wrong', string> = { correct: 'Đ', partial: 'C', wrong: 'S' }
const KQ_TONE: Record<'correct' | 'partial' | 'wrong', string> = {
  correct: 'bg-emerald-600 text-white', partial: 'bg-amber-500 text-white', wrong: 'bg-rose-600 text-white',
}
const isPdf = (url: string) => /\.pdf(\?|$)/i.test(url)

export default function ChamTestScreen() {
  const [queue, setQueue] = useState<CaTestChoCham[]>([]);
  const [done, setDone] = useState<CaTestChoCham[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try { const [a, b] = await Promise.all([listCanCham(), listDaCham(homNayVN())]); setQueue(a); setDone(b) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  if (openId) {
    const item = [...queue, ...done].find((c) => c.id === openId)
    if (item) return <ChamCard item={item} onClose={() => setOpenId(null)} onDone={async () => { setOpenId(null); await reload() }} />
  }

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <h2 className="mb-1 text-[20px] font-semibold text-slate-800">Chấm test đầu vào</h2>
      <p className="mb-4 text-[12px] text-slate-400">Hàng đợi chung của team học thuật — ai mở thì làm.</p>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : queue.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không còn bài nào cần chấm.</div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {queue.map((c) => (
            <button key={c.id} onClick={() => setOpenId(c.id)} className="rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm hover:shadow-md">
              <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
              <div className="mt-0.5 text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Lớp ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}</div>
            </button>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã chấm hôm nay ({done.length})</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {done.map((c) => (
              <button key={c.id} onClick={() => setOpenId(c.id)} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-left text-[12px] text-slate-500 shadow-sm hover:shadow-md">
                <span className="font-semibold text-slate-700">{c.hoTenHs}</span> · {c.mon}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
    </div>
  )
}

function ChamCard({ item, onClose, onDone }: { item: CaTestChoCham; onClose: () => void; onDone: () => void }) {
  const [cau, setCau] = useState<CaTestCau[]>([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() { setLoading(true); try { setCau(await getCaTestCauKq(item.id)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [item.id]) // eslint-disable-line

  const { diem, toiDa, pct } = useMemo(() => tongDiem(cau), [cau])
  const hienTai = cau[idx]
  const daDong = cau.length > 0 && cau.every((c) => c.ketQua != null)

  async function chon(c: CaTestCau, kq: 'correct' | 'partial' | 'wrong') {
    const next = c.ketQua === kq ? null : kq
    await chamCauTest(c.id, c.diemToiDa, next)
    setCau((s) => s.map((x) => (x.id === c.id ? { ...x, ketQua: next, diem: next ? c.diemToiDa * (next === 'correct' ? 1 : next === 'partial' ? 0.5 : 0) : null } : x)))
  }
  async function dong() {
    setBusy(true); setErr(null)
    try { await dongChamTest(item.id, item.ungVienId); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function moLai() { setBusy(true); try { await moLaiChamTest(item.id); await reload() } finally { setBusy(false) } }

  if (!item.deTestId) return (
    <div className="mx-auto max-w-[600px] p-8 text-center text-sm text-slate-400">
      Chưa gán đề cho ca test này — vào "Điểm danh test" để gán đề trước.
      <div className="mt-3"><button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px]">← Quay lại</button></div>
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-indigo-600 hover:underline">← Quay lại</button>
        <span className="text-[14px] font-semibold text-slate-800">{item.hoTenHs}</span>
        <span className="text-[12px] text-slate-400">{item.mon}{item.khoi ? ` · Lớp ${item.khoi}` : ''}</span>
        <span className="ml-auto text-[15px] font-bold text-indigo-600">{diem}/{toiDa} · {pct}%</span>
      </div>
      {loading ? <p className="p-6 text-sm text-slate-400">Đang tải…</p> : (
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_260px_300px] gap-0 overflow-hidden">
          {/* Trái: scan bài làm — kéo dọc độc lập */}
          <div className="min-h-0 overflow-auto border-r border-slate-200 bg-slate-50 p-2">
            {item.baiUrl ? (
              isPdf(item.baiUrl) ? <iframe src={item.baiUrl} title="scan" className="h-[1400px] w-full rounded border border-slate-200 bg-white" />
                : <img src={item.baiUrl} alt="scan" className="w-full rounded border border-slate-200" />
            ) : <p className="p-4 text-sm text-slate-400">Chưa có bài scan.</p>}
          </div>
          {/* Giữa: nội dung + đáp án từng câu */}
          <div className="min-h-0 overflow-auto border-r border-slate-200 p-3">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Câu</div>
            <div className="space-y-2">
              {cau.map((c, i) => (
                <div key={c.id} onClick={() => setIdx(i)} className={`cursor-pointer rounded-lg border p-2 text-[13px] ${i === idx ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100'}`}>
                  <div className="font-medium text-slate-700">Câu {i + 1} <span className="text-slate-400">({c.diemToiDa}đ)</span></div>
                  <div className="mt-0.5 line-clamp-2 text-slate-600"><MathText>{c.noiDung ?? ''}</MathText></div>
                </div>
              ))}
            </div>
          </div>
          {/* Phải: Đ/C/S per câu + next/prev */}
          <div className="flex min-h-0 flex-col overflow-auto p-3">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chấm</div>
            {hienTai ? (
              <div className="flex-1">
                <div className="mb-2 text-[13px] font-semibold text-slate-500">Câu {idx + 1}</div>
                <div className="mb-3 rounded-lg bg-slate-50 p-2.5 text-[14px] text-slate-800">
                  <MathText>{hienTai.noiDung ?? ''}</MathText>
                  {hienTai.anhDe && <img src={hienTai.anhDe} alt="" className="mt-2 max-h-52 rounded border border-slate-200" />}
                  {hienTai.luaChon && (
                    <ol className="mt-2 space-y-0.5 text-[13px]">
                      {hienTai.luaChon.map((o, i) => <li key={i}><b>{String.fromCharCode(65 + i)}.</b> <MathText>{o}</MathText></li>)}
                    </ol>
                  )}
                  {hienTai.menhDe && (
                    <ol className="mt-2 space-y-0.5 text-[13px]">
                      {hienTai.menhDe.map((m, i) => <li key={i}><b>{'abcd'[i]})</b> <MathText>{m.noi_dung}</MathText></li>)}
                    </ol>
                  )}
                  {hienTai.dapAn && <div className="mt-2 text-[12px] text-slate-400">Đáp án đối chiếu: <b className="text-slate-600">{hienTai.dapAn}</b></div>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['correct', 'partial', 'wrong'] as const).map((k) => (
                    <button key={k} onClick={() => chon(hienTai, k)}
                      className={`rounded-xl py-3 text-[16px] font-bold ${hienTai.ketQua === k ? KQ_TONE[k] : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                      {KQ_LABEL[k]}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] disabled:opacity-30">‹ Câu trước</button>
                  <button onClick={() => setIdx((i) => Math.min(cau.length - 1, i + 1))} disabled={idx === cau.length - 1} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] disabled:opacity-30">Câu sau ›</button>
                </div>
              </div>
            ) : <p className="text-sm text-slate-400">Không có câu.</p>}

            {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
            <div className="mt-auto pt-3">
              <button onClick={dong} disabled={busy || !daDong} title={!daDong ? 'Cần chấm hết mọi câu' : ''}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-[14px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">
                {busy ? 'Đang xử lý…' : '✓ Xác nhận (đóng chấm)'}
              </button>
              <button onClick={moLai} disabled={busy} className="mt-1.5 w-full rounded-lg border border-slate-200 py-1.5 text-[12px] text-slate-500 hover:border-indigo-300">↩ Mở lại chấm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
