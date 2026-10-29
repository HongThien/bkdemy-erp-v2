// CHỌN Ý TỪ CHUỖI MÔ HÌNH (Hình–Luyện) cho 1 bài trong đề — CEO 29/10 (thay popup 2 bước cũ của MT, "thao tác rất rối"):
//   ① chọn MÔ HÌNH GỐC (chỉ gốc cây, phần Luyện) → ② hiện CẢ CHUỖI theo khối giả thiết (gốc rồi từng nhánh, đúng
//   thứ tự số B như bản "In chuỗi") → MẶC ĐỊNH KHÔNG tick ý nào, người dùng tick ý nào lấy ý đó → "Hoàn thành".
// Kết quả = PickItem kind 'ghep' (đề chuẩn) với nodeIds = ý đã tick theo số B. Đề đầy đủ (giả thiết chung + giả
// thiết thêm của từng nhánh trước câu hỏi) do banInTheoMoHinh/mucGhep dựng — màn này chỉ CHỌN.
// Mỗi ý = 1 lần đánh giá + 1 ô điểm (flattenGtBaiToDapAn / diemBaiHinh đã theo từng node).
// ⭐ 29/10 (CEO "làm chế độ 2 — chọn được bài từ kho"): bước ② có 2 tab — "Tạo từ chuỗi" (ở trên) | "Bài trong kho" =
// bài kho Hình luyện của mô hình đó (fn_hl_kho_cua_mo_hinh — bài đã gán vào mô hình là đã vào kho, không lọc thêm cờ duyệt). Chọn 1 bài ⇒ PickItem kind 'bai':
// lấy NGUYÊN bài, mọi ý (Hình không tách ý), mỗi ý = 1 câu chấm + điểm riêng.
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi, MoHinh } from '../../../lib/kho/hinh'
import type { PickItem } from '../../../store/useStore'
import { MathText } from '../ui'
import { Ma, tron } from './hinhUi'

const SAO = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))
const soB = (so: string | undefined) => parseInt((so ?? '').replace(/\D/g, ''), 10) || 1e6

// Nhớ mô hình gốc vừa chọn theo khối (sống tới F5) — hàng Hình kế tiếp mở thẳng chuỗi đó, "← Đổi mô hình" để quay lại.
const NHO: Record<string, string> = {}
let NHO_CHE: 'chuoi' | 'kho' = 'chuoi'

export default function ChonYTuCay({ L, khoi, phan, chonSan, baiSan, onClose, onPick }: {
  L: Luoi; khoi: string; phan: PickItem['phan']
  chonSan?: string[]                          // ý của hàng đang sửa (tick sẵn); trống = hàng mới
  baiSan?: { baiId: string; moHinhId: string | null }   // hàng đang sửa là bài kho ⇒ mở thẳng tab kho, chọn sẵn
  onClose: () => void; onPick: (p: PickItem) => void
}) {
  const goc = useMemo(() => api.gocCayCua(L).filter((m) => m.phan === 'luyen' && (!m.khoi || m.khoi === khoi))
    .sort((a, b) => a.ma.localeCompare(b.ma)), [L, khoi])
  const nhanhCua = useMemo(() => new Map(goc.map((g) => [g.id, api.nhanhCuaCay(L.moHinh, L.canh, g.id)])), [goc, L])
  const soBaiCua = (gid: string) => { const ids = new Set((nhanhCua.get(gid) ?? []).map((n) => n.id)); return L.baiToan.filter((b) => ids.has(b.mo_hinh_id)).length }
  // Hàng đang sửa ⇒ mở thẳng cây chứa ý của nó; không thì cây đã chọn lần trước (cùng khối).
  const gocCuaHang = useMemo(() => {
    const mh = chonSan?.length ? L.baiToan.find((b) => b.id === chonSan[0])?.mo_hinh_id : null
    return mh ? goc.find((g) => (nhanhCua.get(g.id) ?? []).some((n) => n.id === mh))?.id ?? null : null
  }, [chonSan, L, goc, nhanhCua])
  const gocBaiSan = baiSan?.moHinhId && goc.some((g) => g.id === baiSan.moHinhId) ? baiSan.moHinhId : null
  const [gocId, setGocId] = useState<string | null>(gocBaiSan ?? gocCuaHang ?? (goc.some((g) => g.id === NHO[khoi]) ? NHO[khoi] : null))
  const [tick, setTick] = useState<Set<string>>(new Set(gocCuaHang ? chonSan : []))
  const [che, setChe] = useState<'chuoi' | 'kho'>(gocBaiSan ? 'kho' : gocCuaHang ? 'chuoi' : NHO_CHE)
  const [kho, setKho] = useState<api.ChuoiKho[] | null>(null)
  const [demKho, setDemKho] = useState<Map<string, api.DemKho>>(new Map())
  const [baiChon, setBaiChon] = useState<string | null>(gocBaiSan ? baiSan!.baiId : null)
  const [timKho, setTimKho] = useState('')
  const [tim, setTim] = useState('')
  const [so, setSo] = useState<Map<string, string>>(new Map())
  const [doKho, setDoKho] = useState<Map<string, number>>(new Map())
  const [loi, setLoi] = useState<string | null>(null)

  useEffect(() => {
    if (!gocId) return
    NHO[khoi] = gocId
    let huy = false
    setSo(new Map()); setDoKho(new Map()); setLoi(null)
    Promise.all([api.soHienThiCay(gocId), api.nhanBaiCay(gocId)]).then(([s, nb]) => {
      if (huy) return
      setSo(new Map(s.map((r) => [r.id, r.so])))
      setDoKho(new Map(nb.filter((r) => r.loai === 'do_kho' && r.gia_tri != null).map((r) => [r.baitoan_id, r.gia_tri!])))
    }).catch((e) => { if (!huy) setLoi(e.message ?? String(e)) })
    return () => { huy = true }
  }, [gocId, khoi])
  useEffect(() => { let huy = false; api.demKhoMoHinh(khoi).then((m) => { if (!huy) setDemKho(m) }).catch(() => {}); return () => { huy = true } }, [khoi])
  useEffect(() => {
    if (!gocId) return
    let huy = false
    setKho(null)
    api.khoCuaMoHinh(gocId).then((r) => {
      if (huy) return
      setKho(r)
      // Cây chưa có bài mà kho có ⇒ mở thẳng tab kho (Hình 7 29/10: 8 mô hình Luyện, cây trống hết, bài nằm ở kho).
      if (r.length && soBaiCua(gocId) === 0) setChe('kho')
    }).catch((e) => { if (!huy) setLoi(e.message ?? String(e)) })
    return () => { huy = true }
  }, [gocId]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { NHO_CHE = che }, [che])

  const chonGoc = (id: string) => { if (id !== gocId) { setTick(new Set()); setBaiChon(null) } setGocId(id) }
  const doi = (id: string) => setTick((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── BƯỚC 1: chọn mô hình gốc ──
  if (!gocId) {
    const kw = tim.trim().toLowerCase()
    const hien = goc.filter((m) => !kw || m.ten.toLowerCase().includes(kw) || m.ma.toLowerCase().includes(kw))
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="border-b border-slate-200 px-5 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-slate-900">Chọn mô hình · Khối {khoi}</h2>
              <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm tên / mã mô hình…" autoFocus
              className="mt-2 h-8 w-full rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {hien.length === 0
              ? <p className="px-2 py-6 text-center text-[13px] text-slate-400">{goc.length ? 'Không có mô hình khớp.' : `Khối ${khoi} chưa có mô hình nào ở phần Luyện.`}</p>
              : hien.map((m) => (
                <button key={m.id} onClick={() => chonGoc(m.id)}
                  className="mb-1 flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-700 hover:border-teal-300 hover:bg-teal-50/50">
                  <Ma>{m.ma}</Ma>
                  <span className="min-w-0 flex-1 truncate"><MathText>{tron(m.ten)}</MathText></span>
                  <span className="shrink-0 text-[11px] text-slate-400">{soBaiCua(m.id)} bài{demKho.get(m.id)?.so_chuoi ? ` · kho ${demKho.get(m.id)!.so_chuoi}` : ''}</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    )
  }

  // ── BƯỚC 2: cả chuỗi theo khối giả thiết ──
  const g = L.moHinh.find((m) => m.id === gocId)
  const nhanhs = nhanhCua.get(gocId) ?? []
  const baiCua = (nid: string) => L.baiToan.filter((b) => b.mo_hinh_id === nid).sort((a, b) => soB(so.get(a.id)) - soB(so.get(b.id)) || a.ma.localeCompare(b.ma))
  const khois = nhanhs.map((n) => ({ n, bai: baiCua(n.id) })).filter((k) => k.bai.length)
    .sort((a, b) => soB(so.get(a.bai[0].id)) - soB(so.get(b.bai[0].id)))
  const chaTen = (n: MoHinh): string | null => {
    const c = L.canh.find((x) => x.mo_hinh_id === n.id)?.cha_id
    return c && c !== gocId ? tron(L.moHinh.find((m) => m.id === c)?.ten ?? '') : null
  }
  const xong = () => {
    if (che === 'kho') { if (baiChon) onPick({ key: crypto.randomUUID(), phan, kind: 'bai', baiId: baiChon, moHinhId: gocId, nodeIds: [] }); return }
    if (chon.length) onPick({ key: crypto.randomUUID(), phan, kind: 'ghep', luaId: null, nodeIds: chon })
  }
  // Ý đã tick theo đúng thứ tự in (số B) — dùng cho chuỗi ở chân popup + nhãn "Câu k".
  const chon = [...tick].sort((a, b) => soB(so.get(a)) - soB(so.get(b)))
  const thuTu = new Map(chon.map((id, i) => [id, i + 1]))
  // CEO 29/10 ("MT chưa chọn được bài Hình 7" · "các bài trong kho hình 7 duyệt hết rồi mà"): bài đã gán vào mô hình = đã
  // vào kho ⇒ hiện MỌI bài như màn Hình luyện, KHÔNG lọc/cảnh báo theo cờ da_duyet của ý (nút "Duyệt bài" là việc khác).
  const khoDu = (kho ?? []).filter((c) => c.y.length > 0)
  const kwKho = timKho.trim().toLowerCase()
  const khoHien = khoDu.filter((c) => !kwKho || `${c.ma_bai} ${c.nguon ?? ''} ${c.gia_thiet_chung ?? ''} ${c.y.map((y) => y.noi_dung).join(' ')}`.toLowerCase().includes(kwKho))
  const baiDangChon = khoDu.find((c) => c.id === baiChon)
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-6 py-3">
          <button onClick={() => { setGocId(null); setTim('') }} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] text-slate-600 hover:border-indigo-400">← Đổi mô hình</button>
          <h3 className="min-w-0 truncate text-[15px] font-semibold text-slate-900">{g?.ma} · <MathText>{tron(g?.ten ?? '')}</MathText></h3>
          <div className="flex rounded-lg bg-slate-100 p-0.5 text-[12.5px] font-medium">
            <button onClick={() => setChe('chuoi')} className={`rounded-md px-3 py-1 ${che === 'chuoi' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tạo từ chuỗi</button>
            <button onClick={() => setChe('kho')} className={`rounded-md px-3 py-1 ${che === 'kho' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Bài trong kho{kho ? ` (${khoDu.length})` : ''}</button>
          </div>
          <span className="text-[12px] text-slate-500">{che === 'kho' ? 'Chọn 1 bài — lấy nguyên bài, mỗi ý là 1 câu, chấm và cho điểm riêng.' : 'Tick các ý muốn đưa vào bài — mỗi ý là 1 câu, chấm và cho điểm riêng.'}</span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {loi && <div className="bg-rose-50 px-6 py-2 text-[12.5px] text-rose-700">{loi}</div>}
        {che === 'kho' ? (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {!kho ? <p className="py-8 text-center text-[13px] text-slate-400">Đang tải kho…</p>
            : !khoDu.length ? <p className="py-8 text-center text-[13px] text-slate-400">Kho của mô hình này chưa có bài nào. Gán bài ở Duyệt kho › Hình luyện · chưa phân mô hình.</p>
            : <>
              <div className="mb-3 flex items-center gap-3">
                <input value={timKho} onChange={(e) => setTimKho(e.target.value)} placeholder="Tìm trong kho (mã, nguồn, đề)…"
                  className="h-8 w-72 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
                <span className="text-[12px] text-slate-400">{khoHien.length}/{khoDu.length} bài</span>
              </div>
              <div className="space-y-3">
                {khoHien.map((c) => { const on = baiChon === c.id; return (
                  <label key={c.id} className={`flex cursor-pointer gap-4 rounded-xl border p-3.5 ${on ? 'border-indigo-400 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-indigo-200'}`}>
                    <input type="radio" name="bai-kho" checked={on} onChange={() => setBaiChon(c.id)} className="mt-1" />
                    {c.anh_de
                      ? <img src={c.anh_de} alt="" className="h-32 w-44 shrink-0 self-start rounded-lg border border-slate-200 bg-white object-contain" />
                      : <div className="flex h-32 w-44 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-300">chưa có hình</div>}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-3 text-[12px]">
                        <span className="font-mono font-semibold text-teal-700">{c.ma_bai}</span>
                        <span className="text-slate-500">{c.nguon ?? 'chưa rõ nguồn'}</span>
                        <span className="ml-auto font-medium text-slate-500">{c.y.length} ý = {c.y.length} câu</span>
                      </div>
                      {c.gia_thiet_chung && <div className="text-[13.5px] leading-relaxed text-slate-800"><MathText>{c.gia_thiet_chung}</MathText></div>}
                      {c.y.map((y) => (
                        <div key={y.id} className="flex gap-2 text-[13px] leading-relaxed text-slate-700">
                          <b className="shrink-0 text-violet-700">{y.nhan ? `${y.nhan})` : '•'}</b>
                          <div className="min-w-0 flex-1"><MathText>{y.noi_dung}</MathText></div>
                        </div>))}
                    </div>
                  </label>) })}
              </div>
            </>}
        </div>
        ) : (
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {khois.length === 0 ? <p className="text-sm text-slate-400">Cây của mô hình này chưa có bài nào.{khoDu.length ? <> Kho có <button onClick={() => setChe('kho')} className="font-semibold text-indigo-700 underline">{khoDu.length} bài — chọn ở tab Bài trong kho</button>.</> : ''}</p> : khois.map(({ n, bai }) => {
            const laGoc = n.id === gocId
            const ct = chaTen(n)
            return (
              <section key={n.id} className="mb-4 rounded-xl border border-slate-200">
                <div className="flex gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className={`text-[12.5px] font-bold ${laGoc ? 'text-teal-700' : 'text-slate-600'}`}>
                      {laGoc ? 'Giả thiết' : `${L.canh.find((x) => x.mo_hinh_id === n.id)?.chinh ? 'Nhánh chính' : 'Nhánh phụ'}: ${tron(n.ten)}`}
                      {ct && <span className="font-normal text-slate-400"> — đi tiếp từ «{ct}»</span>}
                    </div>
                    <div className="mt-0.5 text-[13px] leading-relaxed text-slate-700"><MathText>{(laGoc ? n.gia_thiet : n.gia_thiet_them) ?? ''}</MathText></div>
                    {/* Chuỗi bài của khối (CEO 29/10: "hiện mũi tên như trước mới cảm nhận rõ chuỗi") — bấm chip = tick/bỏ. */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[12px]">
                      {bai.map((b, i) => (
                        <span key={b.id} className="flex items-center gap-1">
                          {i > 0 && <span className="text-slate-300">→</span>}
                          <button onClick={() => doi(b.id)} title={tick.has(b.id) ? 'Bỏ ý này' : 'Chọn ý này'}
                            className={`rounded-full px-2 py-0.5 font-semibold ${tick.has(b.id) ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white text-slate-500 hover:border-indigo-400'}`}>
                            {so.get(b.id) ?? '…'}</button>
                        </span>))}
                    </div>
                  </div>
                  {n.anh_cau_hinh && <img src={n.anh_cau_hinh} alt="" className="max-h-24 w-auto max-w-[180px] shrink-0 rounded border border-slate-200 bg-white object-contain" />}
                </div>
                <div className="divide-y divide-slate-100">
                  {bai.map((b) => {
                    const on = tick.has(b.id), dk = doKho.get(b.id)
                    return (
                      <label key={b.id} className={`flex cursor-pointer items-start gap-2.5 px-4 py-2 text-[13px] ${on ? 'bg-indigo-50/70' : 'hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={on} onChange={() => doi(b.id)} className="mt-1" />
                        <span className="w-9 shrink-0 font-semibold text-slate-500">{so.get(b.id) ?? '…'}</span>
                        <span className="min-w-0 flex-1 text-slate-800"><MathText>{[b.gia_thiet_rieng, b.phat_bieu].filter((x) => x && x.trim()).join(' ')}</MathText></span>
                        {on && <span className="shrink-0 rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">Câu {thuTu.get(b.id)}</span>}
                        {dk != null && <span className="shrink-0 text-[11px] tracking-wide text-orange-600" title={`Độ khó ${dk}/5`}>{SAO(dk)}</span>}
                      </label>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
        )}
        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-3">
          {che === 'kho'
            ? <span className="text-[13px] text-slate-600">{baiDangChon ? <>Đã chọn <b className="font-mono text-indigo-700">{baiDangChon.ma_bai}</b> = {baiDangChon.y.length} câu</> : 'Chưa chọn bài nào'}</span>
            : <>
              {chon.length
                ? <div className="flex min-w-0 flex-wrap items-center gap-1 text-[12.5px]">
                    <span className="mr-1 text-slate-500">Chuỗi đang chọn:</span>
                    {chon.map((id, i) => (
                      <span key={id} className="flex items-center gap-1">
                        {i > 0 && <span className="text-indigo-300">→</span>}
                        <button onClick={() => doi(id)} title="Bỏ ý này" className="group rounded-full bg-indigo-600 px-2 py-0.5 font-semibold text-white hover:bg-rose-500">
                          {so.get(id) ?? '…'}<span className="ml-1 hidden group-hover:inline">✕</span></button>
                      </span>))}
                    <span className="ml-1 text-slate-500">= {chon.length} câu</span>
                  </div>
                : <span className="text-[13px] text-slate-400">Chưa chọn ý nào — tick ý hoặc bấm số bài trên chuỗi.</span>}
              {tick.size > 0 && <button onClick={() => setTick(new Set())} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">Bỏ chọn hết</button>}
            </>}
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={xong} disabled={che === 'kho' ? !baiDangChon : !tick.size} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">Hoàn thành</button>
        </div>
      </div>
    </div>
  )
}
