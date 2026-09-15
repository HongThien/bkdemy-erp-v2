// Chấm test đầu vào (Story 2) — pool team học thuật, ai mở thì làm; ⭐ 09/09 (CEO ②): ưu tiên "Của tôi"
// (ca tôi được gán `nguoi_cham_id`), toggle sang "Tất cả" khi cần chấm hộ.
// ⭐ CEO 10/09: card chấm = BẢNG NHẬP LIỆU THUẦN "Câu N | Đ C S" — thực tế chấm trên GIẤY ngoài (Thùy 07-19
// đảo luồng), vào đây chỉ TÍCH lại. Đề ẨN mặc định, bấm số câu mới xem để đối chiếu. Không cột chi tiết,
// không prev/next. Kèm ô ĐIỂM NHẬP TAY (CEO ④ 09/09: điểm độc lập với Đ/C/S); tổng/% do Postgres tính
// (fn_test_dau_vao_phieu, §2.0). KHÔNG mã lỗi (CEO 09/09). KHÔNG feed mastery.
// ⭐ 09/09: ca đã hoàn thành mà CHƯA CÓ ĐỀ vẫn hiện ở đây (badge ⚠) kèm nút "Gán đề đang dùng" — trước đó
// bị lọc mất im lặng (5 ca treo từ tháng 7, xem HANDOFF bài học 09/09).
// Sau mutation KHÔNG reload cả danh sách (CLAUDE.md §2): vá đúng phần tử tại chỗ, người chấm đứng nguyên.
import { useEffect, useMemo, useState } from 'react'
import {
  listCanCham, listDaCham, getCaTestCauKq, chamCauTest, dongChamTest, moLaiChamTest, getPhieuKetQua,
  setDiemNhap, ganDeDangDung,
  type CaTestChoCham, type CaTestCau, type PhieuKetQua,
} from '../../lib/detest'
import { homNayVN } from '../../lib/tuan'
import { useStore } from '../../store/useStore'
import { MathText } from '../kho/ui'

type KQ = 'correct' | 'partial' | 'wrong'
// Cùng khuôn màu ET_KQ (ta/ChamBuoi.tsx) — người chấm quen mắt giữa ET và test đầu vào.
const KQ_OPTS: { v: KQ; lbl: string; idle: string; sel: string }[] = [
  { v: 'correct', lbl: 'Đ', idle: 'border-slate-200 text-emerald-700 hover:bg-emerald-50', sel: 'border-transparent bg-emerald-600 text-white' },
  { v: 'partial', lbl: 'C', idle: 'border-slate-200 text-amber-700 hover:bg-amber-50', sel: 'border-transparent bg-amber-500 text-white' },
  { v: 'wrong', lbl: 'S', idle: 'border-slate-200 text-rose-700 hover:bg-rose-50', sel: 'border-transparent bg-rose-600 text-white' },
]

// Nhớ filter khi rời màn rồi quay lại (màn unmount khi đổi tab).
const NHO: { loc: 'toi' | 'tatca' | null } = { loc: null }

export default function ChamTestScreen() {
  const me = useStore((s) => s.me)
  const myId = me?.nhanSu.id ?? null
  const [queue, setQueue] = useState<CaTestChoCham[]>([])
  const [done, setDone] = useState<CaTestChoCham[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [loc, setLoc] = useState<'toi' | 'tatca'>(NHO.loc ?? (myId ? 'toi' : 'tatca'))
  useEffect(() => { NHO.loc = loc }, [loc])

  async function reload() {
    setLoading(true)
    try { const [a, b] = await Promise.all([listCanCham(), listDaCham(homNayVN())]); setQueue(a); setDone(b) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const cuaToi = useMemo(() => queue.filter((c) => c.nguoiChamId === myId), [queue, myId])
  const shown = loc === 'toi' ? cuaToi : queue
  // Vá tại chỗ (không quét lại): item vừa gán đề / nhập điểm.
  const patch = (id: string, p: Partial<CaTestChoCham>) => {
    setQueue((s) => s.map((x) => (x.id === id ? { ...x, ...p } : x)))
    setDone((s) => s.map((x) => (x.id === id ? { ...x, ...p } : x)))
  }
  const daDong = (id: string) => {
    const it = queue.find((x) => x.id === id)
    setQueue((s) => s.filter((x) => x.id !== id))
    if (it) setDone((s) => [it, ...s])
    setOpenId(null)
  }
  const moLai = (id: string) => {
    const it = done.find((x) => x.id === id)
    setDone((s) => s.filter((x) => x.id !== id))
    if (it) setQueue((s) => [...s, it].sort((a, b) => a.ngay.localeCompare(b.ngay)))
  }

  if (openId) {
    const item = [...queue, ...done].find((c) => c.id === openId)
    if (item) return <ChamCard item={item} daChamXong={done.some((d) => d.id === item.id)} onClose={() => setOpenId(null)} onPatch={(p) => patch(item.id, p)} onDone={() => daDong(item.id)} onReopen={() => moLai(item.id)} />
  }

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Chấm test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Ca được gán cho bạn hiện ở "Của tôi"; hàng đợi chung vẫn mở — ai cũng chấm hộ được.</p>
        </div>
        <div className="ml-auto inline-flex rounded-full bg-slate-100 p-0.5">
          {([['toi', `Của tôi (${cuaToi.length})`], ['tatca', `Tất cả (${queue.length})`]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setLoc(k)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${loc === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
          ))}
          <button onClick={reload} title="Quét lại" className="rounded-full px-2 text-[14px] text-slate-400 hover:text-indigo-600">↻</button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : shown.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
          {loc === 'toi' && queue.length > 0 ? `Không có ca nào gán cho bạn — hàng đợi chung còn ${queue.length} ca.` : 'Không còn bài nào cần chấm.'}
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {shown.map((c) => (
            <button key={c.id} onClick={() => setOpenId(c.id)} className="rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm hover:shadow-md">
              <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
              <div className="mt-0.5 text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Lớp ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {c.nguoiChamTen && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">👤 {c.nguoiChamTen}</span>}
                {c.thieuDe && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">⚠ Chưa có đề</span>}
                {c.diemNhap != null && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">Điểm {c.diemNhap}</span>}
              </div>
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
                <span className="font-semibold text-slate-700">{c.hoTenHs}</span> · {c.mon}{c.diemNhap != null ? ` · ${c.diemNhap}đ` : ''}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
    </div>
  )
}

function ChamCard({ item, daChamXong, onClose, onPatch, onDone, onReopen }: {
  item: CaTestChoCham; daChamXong: boolean; onClose: () => void
  onPatch: (p: Partial<CaTestChoCham>) => void; onDone: () => void; onReopen: () => void
}) {
  const [cau, setCau] = useState<CaTestCau[]>([])
  const [phieu, setPhieu] = useState<PhieuKetQua | null>(null)
  const [moDe, setMoDe] = useState<Set<string>>(new Set()) // câu đang mở xem đề
  const [diemText, setDiemText] = useState(item.diemNhap == null ? '' : String(item.diemNhap))
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const [c, p] = await Promise.all([getCaTestCauKq(item.id), getPhieuKetQua(item.id)])
      setCau(c); setPhieu(p); setDiemText(p.diemNhap == null ? '' : String(p.diemNhap))
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [item.id]) // eslint-disable-line

  const tong = phieu?.tong
  const duCau = !!tong && tong.soCau > 0 && tong.daCham >= tong.soCau
  const coDiem = phieu?.diemNhap != null
  const toggleDe = (id: string) => setMoDe((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  // Click lại mức đang chọn = bỏ chấm (UX ET). Điểm câu do trigger DB tính; tổng/% hỏi lại DB sau mỗi lần ghi.
  async function chon(c: CaTestCau, kq: KQ) {
    if (daChamXong) return
    const next = c.ketQua === kq ? null : kq
    setErr(null)
    try {
      const diemDb = await chamCauTest(c.id, next)
      setCau((s) => s.map((x) => (x.id === c.id ? { ...x, ketQua: next, diem: diemDb } : x)))
      setPhieu(await getPhieuKetQua(item.id))
    } catch (e: any) { setErr(e.message ?? String(e)) }
  }
  async function luuDiem() {
    const t = diemText.trim().replace(',', '.')
    const v = t === '' ? null : Number(t)
    if (v != null && (!Number.isFinite(v) || v < 0)) { setErr('Điểm không hợp lệ.'); return }
    if (v === (phieu?.diemNhap ?? null)) return
    setErr(null)
    try { await setDiemNhap(item.id, v); setPhieu((p) => (p ? { ...p, diemNhap: v } : p)); onPatch({ diemNhap: v }) }
    catch (e: any) { setErr(e.message ?? String(e)) }
  }
  async function ganDe() {
    setBusy(true); setErr(null)
    try {
      const de = await ganDeDangDung(item.id, item.khoi, item.mon)
      if (!de) { setErr(`Chưa có đề test đầu vào đang dùng cho ${item.mon}${item.khoi ? ` · Khối ${item.khoi}` : ''} — học thuật sinh đề ở tab "Đề test" trước.`); return }
      onPatch({ taiLieuId: de.id, thieuDe: false })
      await reload()
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function dong() {
    setBusy(true); setErr(null)
    try { await luuDiem(); await dongChamTest(item.id, item.ungVienId); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function moLai() {
    setBusy(true); setErr(null)
    try { await moLaiChamTest(item.id); onReopen() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  if (!item.taiLieuId) return (
    <div className="mx-auto max-w-[600px] p-8 text-center">
      <div className="text-[15px] font-semibold text-slate-800">{item.hoTenHs} · {item.mon}{item.khoi ? ` · Lớp ${item.khoi}` : ''}</div>
      <p className="mt-2 text-sm text-slate-500">Ca này đã hoàn thành nhưng chưa có đề nên chưa có câu để chấm. Gán đề đang dùng của khối × môn để chấm.</p>
      {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px]">← Quay lại</button>
        <button onClick={ganDe} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang gán…' : '📘 Gán đề đang dùng'}</button>
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-indigo-600 hover:underline">← Quay lại</button>
        <span className="text-[14px] font-semibold text-slate-800">{item.hoTenHs}</span>
        <span className="text-[12px] text-slate-400">{item.mon}{item.khoi ? ` · Lớp ${item.khoi}` : ''}</span>
        {item.nguoiChamTen && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">👤 {item.nguoiChamTen}</span>}
        {daChamXong && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Đã đóng chấm</span>}
        <span className="ml-auto text-[13px] text-slate-500">
          {tong ? <>Đã tích <b className="text-indigo-600">{tong.daCham}/{tong.soCau}</b> câu · đúng <b className="text-indigo-600">{tong.pct}%</b></> : '…'}
        </span>
      </div>

      {loading ? <p className="p-6 text-sm text-slate-400">Đang tải…</p> : (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-[820px]">
            <p className="mb-2 text-[12px] text-slate-400">Tích Đ/C/S theo bài đã chấm trên giấy. Bấm số câu để xem đề khi cần đối chiếu.</p>
            <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {cau.map((c, i) => {
                const mo = moDe.has(c.id)
                return (
                  <div key={c.id} className={`rounded-lg border ${c.ketQua ? 'border-slate-100' : 'border-dashed border-slate-200'} bg-white ${mo ? 'sm:col-span-2' : ''}`}>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <button onClick={() => toggleDe(c.id)} title="Xem đề" className="flex w-20 shrink-0 items-center gap-1 text-left text-[13px] font-semibold text-slate-700 hover:text-indigo-600">
                        <span className="text-[10px] text-slate-400">{mo ? '▾' : '▸'}</span>Câu {i + 1}
                      </button>
                      <div className="ml-auto flex gap-1">
                        {KQ_OPTS.map((o) => (
                          <button key={o.v} onClick={() => chon(c, o.v)} disabled={daChamXong}
                            className={`h-9 w-11 rounded-md border text-[14px] font-bold ${c.ketQua === o.v ? o.sel : o.idle} disabled:cursor-default`}>{o.lbl}</button>
                        ))}
                      </div>
                    </div>
                    {mo && (
                      <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-[13px] text-slate-800">
                        <div className="mb-1 text-[11px] text-slate-400">{[c.tenChuyenDe, c.mucDo != null ? `độ khó ${c.mucDo}` : null, c.nhanh ? (c.nhanh === 'hinh' ? 'Hình' : 'Đại') : null].filter(Boolean).join(' · ')}</div>
                        <MathText>{c.noiDung ?? ''}</MathText>
                        {c.anhDe && <img src={c.anhDe} alt="" className="mt-2 max-h-52 rounded border border-slate-200" />}
                        {c.luaChon && (
                          <ol className="mt-1 space-y-0.5">
                            {c.luaChon.map((o, j) => <li key={j}><b>{String.fromCharCode(65 + j)}.</b> <MathText>{o}</MathText></li>)}
                          </ol>
                        )}
                        {c.menhDe && (
                          <ol className="mt-1 space-y-0.5">
                            {c.menhDe.map((m, j) => <li key={j}><b>{'abcd'[j]})</b> <MathText>{m.noi_dung}</MathText></li>)}
                          </ol>
                        )}
                        {c.dapAn && <div className="mt-1 text-[12px] text-slate-400">Đáp án: <b className="text-slate-600">{c.dapAn}</b></div>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {cau.length === 0 && <p className="text-sm text-slate-400">Không có câu.</p>}
          </div>
        </div>
      )}

      {/* Thanh dưới: điểm nhập tay + đóng chấm */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-slate-200 bg-white px-4 py-2.5">
        <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Điểm bài</label>
        <input value={diemText} onChange={(e) => setDiemText(e.target.value)} onBlur={luuDiem} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
          inputMode="decimal" placeholder="vd 7.5" disabled={daChamXong}
          className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-[15px] font-bold text-indigo-700 outline-none focus:border-indigo-400 disabled:bg-slate-50" />
        <span className="text-[11px] text-slate-400">nhập tay, độc lập Đ/C/S</span>
        {err && <span className="text-[12px] text-rose-600">{err}</span>}
        <div className="ml-auto">
          {!daChamXong ? (
            <button onClick={dong} disabled={busy || !duCau || !coDiem} title={!duCau ? 'Cần tích hết mọi câu' : !coDiem ? 'Cần nhập điểm bài' : ''}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">
              {busy ? 'Đang xử lý…' : '✓ Xác nhận (đóng chấm)'}
            </button>
          ) : (
            <button onClick={moLai} disabled={busy} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:border-indigo-300">↩ Mở lại chấm</button>
          )}
        </div>
      </div>
    </div>
  )
}
