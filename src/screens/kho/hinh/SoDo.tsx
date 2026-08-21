// M1 + M2 — sơ đồ của MỘT HỌ, hai view (toggle). Cùng một graph 3D chiếu thành 2 mặt phẳng:
//
//   VIEW BÀI TOÁN  — chiếu bỏ trục giả thiết → còn TRỤC SUY LUẬN.
//                    Cột = CẤP (toàn cục, KHÔNG reset theo mô hình). Cạnh = tiền đề.
//                    Node của mô hình con nằm NGAY TRONG CÙNG CỘT, chỉ khác viền teal.
//   VIEW MÔ HÌNH   — chiếu bỏ trục suy luận → còn TRỤC GIẢ THIẾT. Cột = tầng (độ sâu).
//
// Vì sao phải hai view: xếp cha–con giữa các BÀI là sai (10 bài hỏi 10 phương diện của
// cùng một cấu hình thì không có quan hệ cha–con) — chính chỗ đó đẻ ra khái niệm mô hình.
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import * as api from '../../../lib/kho/api'
import type { BaiToan, BienThe, Luoi, MoHinh, Y, Bai } from '../../../lib/kho/hinh'
import { MathText } from '../ui'
import { AnhInput, Btn, Cap, Chip, Empty, Fig, FieldCard, IngestBaiButton, KV, Ma, MaPill, OcrButton, Panel, Seg, Sol, Tag, fileToBase64, inpCls, tron } from './hinhUi'
import { FormMoHinh } from './Ho'
import FormBaiToan from './FormBaiToan'
import type { Nhay } from './KhoHinhScreen'
import { LyThuyetModal } from '../BanDo'
import { fileToCanvases, canvasToJpegBase64, cropCanvasBox } from '../../../lib/pdfRender'

/** Dải cấp gọn: 4–4 đọc thừa, chỉ in 4. */
export const dai = (ns: number[]) => (Math.min(...ns) === Math.max(...ns) ? String(ns[0]) : `${Math.min(...ns)}–${Math.max(...ns)}`)

const COL_W = 256, GAP = 40, NODE_H = 200, ROW_GAP = 12
// Card mô hình TO — Thùy: đọc tên khó hình dung, phải thấy hình + giả thiết. Cao hơn để chứa cả hai.
const MH_W = 272, MH_H = 210
// Vệ tinh (mô hình lá) — card RÚT GỌN treo dưới bố, không chiếm cột tầng riêng (Thùy 08-07).
const SAT_W = 224, SAT_H = 34, SAT_GAP = 8, SAT_TOP = 16, SAT_INDENT = 22

export default function SoDo({ L, khoi, hoId, di, reload, moTaNode, nodeId }: {
  L: Luoi; khoi: string; hoId: string | null; di: (n: Nhay) => void; reload: () => Promise<void>
  moTaNode?: string; nodeId?: string
}) {
  const gocs = L.moHinh.filter((m) => m.la_goc_ho)
  const ho = (hoId && L.moHinh.find((m) => m.id === hoId)) || gocs[0] || null
  const [view, setView] = useState<'bt' | 'mh'>('bt')
  const [chonBt, setChonBt] = useState<string | null>(nodeId ?? null)
  const [chonMh, setChonMh] = useState<string | null>(null)
  const [formBt, setFormBt] = useState<{ sua?: BaiToan; goi?: string; moHinhId?: string; tienDeId?: string } | null>(moTaNode ? { goi: moTaNode } : null)
  const [formMh, setFormMh] = useState<{ sua?: MoHinh; cha?: string } | null>(null)

  const trongHo = useMemo(() => (ho ? api.moHinhCuaHo(L, ho.id) : new Set<string>()), [L, ho])
  const nodes = useMemo(() => L.baiToan.filter((b) => trongHo.has(b.mo_hinh_id)), [L, trongHo])

  useEffect(() => { if (nodeId) { setChonBt(nodeId); setView('bt') } }, [nodeId])

  if (!ho) return <Empty>Chưa có họ mô hình nào — tạo ở màn <b>Chọn họ mô hình</b> trước. Lưới trước, gán sau.</Empty>

  return (
    <>
      <div className="mb-2.5 flex flex-wrap items-center gap-2 text-[12.5px] text-slate-500">
        <button className="font-medium hover:text-slate-800" onClick={() => di({ man: 'ho' })}>← Chọn họ mô hình</button>
        <span className="text-slate-300">/</span>
        <select className="rounded-md border border-teal-300 bg-teal-50 px-2 py-1 text-[12px] font-medium text-teal-700 outline-none"
          value={ho.id} onChange={(e) => { di({ man: 'sodo', hoId: e.target.value }); setChonBt(null); setChonMh(null) }}>
          {gocs.map((g) => <option key={g.id} value={g.id}>◇ {g.ma} · {tron(g.ten)}</option>)}
        </select>
        <span className="text-slate-400">graph 3D · chiếu thành 2 mặt phẳng</span>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Sơ đồ họ {tron(ho.ten)}</h1>
        <div className="flex items-center gap-2">
          <Seg value={view} onChange={setView} options={[{ v: 'bt', label: '◈ View bài toán' }, { v: 'mh', label: '◇ View mô hình' }]} />
          {view === 'bt'
            ? <Btn kind="pri" onClick={() => setFormBt({})}>＋ Node</Btn>
            : <Btn kind="pri" onClick={() => setFormMh({ cha: chonMh ?? ho.id })}>＋ Mô hình con</Btn>}
        </div>
      </div>

      {view === 'bt'
        ? <ViewBaiToan L={L} ho={ho} nodes={nodes} chon={chonBt} setChon={setChonBt} onSua={(b) => setFormBt({ sua: b })}
            onTaoKeTiep={(b) => setFormBt({ moHinhId: b.mo_hinh_id, tienDeId: b.id })} reload={reload} />
        : <ViewMoHinh L={L} ho={ho} trongHo={trongHo} chon={chonMh ?? ho.id} setChon={setChonMh} onSua={(m) => setFormMh({ sua: m })} onThemCon={(id) => setFormMh({ cha: id })} reload={reload} />}

      {formBt && <FormBaiToan L={L} moHinhMacDinh={formBt.moHinhId ?? chonMh ?? ho.id} sua={formBt.sua} phatBieuGoi={formBt.goi}
        tienDeMacDinh={formBt.tienDeId} onClose={() => setFormBt(null)} onDone={reload} />}
      {formMh && <FormMoHinh L={L} khoiMacDinh={khoi} chaMacDinh={formMh.cha} sua={formMh.sua} onClose={() => setFormMh(null)} onDone={reload} />}
    </>
  )
}

// ══════════════════ VIEW BÀI TOÁN — cột = CẤP (toggle: Toàn họ / Theo mô hình) ══════════════════
function ViewBaiToan({ L, ho, nodes: nodesHo, chon, setChon, onSua, onTaoKeTiep, reload }: {
  L: Luoi; ho: MoHinh; nodes: BaiToan[]; chon: string | null; setChon: (id: string | null) => void; onSua: (b: BaiToan) => void
  onTaoKeTiep: (b: BaiToan) => void
  reload: () => Promise<void>
}) {
  const maCap = useMemo(() => api.maPhanCapMap(L), [L])
  const trongHo = useMemo(() => api.moHinhCuaHo(L, ho.id), [L, ho])
  // ⭐ 08-10 (Thùy): "Theo mô hình" = xem RIÊNG bài toán của 1 mô hình (mô hình = ô to bên trái, nối dây
  // tới từng node) thay vì gộp cả họ theo cột-cấp. "Toàn họ" (cũ) VẪN GIỮ — Thùy: để dành cho view kiểu
  // cây nhiều node sau này — làm TOGGLE, không thay hẳn.
  const [scope, setScope] = useState<'ho' | 'mh'>('ho')
  const [moHinhXem, setMoHinhXem] = useState<string>(ho.id)
  const dsMoHinhChon = useMemo(() =>
    [...trongHo].map((id) => L.moHinh.find((m) => m.id === id)).filter((m): m is MoHinh => !!m)
      .sort((a, b) => (maCap.get(a.id) ?? '').localeCompare(maCap.get(b.id) ?? '')),
    [trongHo, L, maCap])
  const nodes = scope === 'mh' ? nodesHo.filter((n) => n.mo_hinh_id === moHinhXem) : nodesHo
  const mhXem = scope === 'mh' ? L.moHinh.find((m) => m.id === moHinhXem) ?? null : null

  // MỐC so sánh "mô hình con" = mô hình NÔNG NHẤT thực sự có bài toán, KHÔNG phải gốc họ.
  // Gốc họ có thể rỗng (vd "Tam giác nhọn" chưa khai bài toán nào) — lấy nó làm mốc thì mọi node
  // đều hoá teal, mất hẳn tín hiệu "node này cần THÊM giả thiết". (scope='mh': mọi node cùng 1 mô
  // hình nên mốc luôn = chính nó, viền teal tự nhiên KHÔNG hiện — đúng, hết ý nghĩa khi đã lọc riêng.)
  const mocGoc = useMemo(() => {
    let best: string | null = null, bestD = Infinity
    for (const mid of new Set(nodes.map((n) => n.mo_hinh_id))) {
      const d = api.doSauTrongHo(L, mid)
      if (d < bestD) { bestD = d; best = mid }
    }
    return best ?? ho.id
  }, [nodes, L, ho])
  const sauMoc = api.doSauTrongHo(L, mocGoc)
  // scope='mh': chừa cột 0 cho Ô MÔ HÌNH (hub) bên trái, cột cấp dồn sang phải.
  const hubOffset = scope === 'mh' ? MH_W + GAP : 0
  const { cots, pos, cao, rong } = useMemo(() => {
    const caps = [...new Set(nodes.map((n) => n.cap))].sort((a, b) => a - b)
    const cots = caps.map((c) => ({ cap: c, ns: nodes.filter((n) => n.cap === c) }))
    // ⭐ 17/08 (Thùy): "các bài trong cùng 1 chuỗi phải nằm ngang nhau chứ đừng chéo lung tung" — trước
    // đây mỗi cột (cấp) tự sort riêng theo `ma`, không biết gì tới quan hệ tiền đề ⇒ 2 node nối dây tiền
    // đề hoàn toàn có thể rơi vào HÀNG khác nhau, dây chạy chéo lên/xuống.
    // Giờ: node kế thừa HÀNG của tiền đề CHÍNH của nó (tiền đề cấp cao nhất — cùng luật chọn "cha kế thừa"
    // dùng khi suy giả thiết/hình, xem chaKeThua() trong hinh.ts) nếu hàng đó còn trống ở cột này ⇒ dây nối
    // luôn nằm NGANG. Một tiền đề rẽ nhiều nhánh (nhiều con) thì chỉ 1 con thẳng hàng với cha, các con còn
    // lại rơi xuống hàng trống gần nhất. Node KHÔNG có tiền đề (mở đầu chuỗi mới) lấy hàng trống tiếp theo.
    const rowOf = new Map<string, number>()
    let nextRow = 0
    cots.forEach((col) => {
      const used = new Set<number>()
      const coCha: { n: BaiToan; row: number }[] = []
      const khongCha: BaiToan[] = []
      col.ns.forEach((n) => {
        const chas = api.tienDeCua(L, n.id).map((id) => L.baiToan.find((b) => b.id === id)).filter(Boolean) as BaiToan[]
        const chaChinh = chas.sort((a, b) => b.cap - a.cap || b.ma.localeCompare(a.ma))[0]
        const r = chaChinh ? rowOf.get(chaChinh.id) : undefined
        if (r != null) coCha.push({ n, row: r }); else khongCha.push(n)
      })
      coCha.sort((a, b) => a.row - b.row).forEach(({ n, row }) => {
        while (used.has(row)) row++
        used.add(row); rowOf.set(n.id, row); nextRow = Math.max(nextRow, row + 1)
      })
      khongCha.sort((a, b) => a.ma.localeCompare(b.ma)).forEach((n) => {
        let row = nextRow
        while (used.has(row)) row++
        used.add(row); rowOf.set(n.id, row); nextRow = row + 1
      })
    })
    const pos = new Map<string, { x: number; y: number }>()
    cots.forEach((col, i) => col.ns.forEach((n) => pos.set(n.id, { x: hubOffset + i * (COL_W + GAP), y: rowOf.get(n.id)! * (NODE_H + ROW_GAP) })))
    const cao = Math.max(scope === 'mh' ? MH_H : 120, nextRow * (NODE_H + ROW_GAP))
    return { cots, pos, cao, rong: Math.max(600, hubOffset + cots.length * (COL_W + GAP) - GAP) }
  }, [nodes, hubOffset, scope, L])
  const hubY = Math.max(0, (cao - MH_H) / 2)

  // Cạnh = tiền đề (theo cách mặc định). Xuyên mô hình ⇒ nét đứt teal (§4 M1) — CHỈ vẽ được khi CẢ HAI
  // đầu đang hiện (scope='ho' luôn đủ; scope='mh' thì tiền đề ở mô hình KHÁC không có `pos` → tự bỏ qua,
  // đánh dấu riêng ở node bằng `teDeAnDi` thay vì cố vẽ dây tới node không hiển thị).
  const canh = useMemo(() => {
    const ra: { x1: number; y1: number; x2: number; y2: number; xuyen: boolean; sang: boolean }[] = []
    for (const n of nodes) {
      for (const t of api.tienDeCua(L, n.id)) {
        const a = pos.get(t), b = pos.get(n.id)
        if (!a || !b) continue
        const nguon = L.baiToan.find((x) => x.id === t)
        ra.push({
          x1: a.x + COL_W, y1: a.y + NODE_H / 2, x2: b.x, y2: b.y + NODE_H / 2,
          xuyen: !!nguon && nguon.mo_hinh_id !== n.mo_hinh_id,
          sang: chon === n.id || chon === t,
        })
      }
    }
    return ra
  }, [nodes, pos, L, chon])
  const teDeAnDi = useMemo(() => {
    if (scope !== 'mh') return new Set<string>()
    const s = new Set<string>()
    for (const n of nodes) for (const t of api.tienDeCua(L, n.id)) if (!pos.has(t)) { s.add(n.id); break }
    return s
  }, [nodes, pos, scope, L])
  // Dây MÔ HÌNH (hub) → từng node — khuôn `RadialEco` (tâm–vệ tinh) nhưng phóng vào canvas cột-cấp chính.
  const hubCanh = useMemo(() => {
    if (scope !== 'mh') return []
    const x1 = MH_W, y1 = hubY + MH_H / 2
    return nodes.map((n) => { const b = pos.get(n.id)!; return { x1, y1, x2: b.x, y2: b.y + NODE_H / 2 } })
  }, [scope, nodes, pos, hubY])

  const bt = chon ? L.baiToan.find((b) => b.id === chon) ?? null : null

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Seg value={scope} onChange={setScope} options={[{ v: 'ho', label: 'Toàn họ' }, { v: 'mh', label: 'Theo mô hình' }]} />
        {scope === 'mh' && (
          <select className={`${inpCls} w-64`} value={moHinhXem} onChange={(e) => setMoHinhXem(e.target.value)}>
            {dsMoHinhChon.map((m) => <option key={m.id} value={m.id}>{maCap.get(m.id) ?? '?'} · {tron(m.ten)}</option>)}
          </select>
        )}
      </div>
      <p className="mb-3 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        {scope === 'ho' ? (
          <>Chiếu bỏ trục giả thiết → còn <b>trục suy luận</b>. Cột = <b>cấp</b>. Node của mô hình con hiện{' '}
          <span className="text-teal-700">viền teal</span> ngay trong cùng cột — cấp là <b>toàn cục</b>, không reset theo mô hình.
          Mốc so sánh là <b>{L.moHinh.find((m) => m.id === mocGoc)?.ten}</b> (mô hình nông nhất có bài toán).</>
        ) : (
          <>Chỉ bài toán CỦA mô hình đang chọn (ô teal bên trái). Tiền đề ở mô hình khác không vẽ được dây (đang ở view khác) —
          node liên quan đánh dấu <span className="text-amber-600">↗</span>, mở bài toán để xem đủ.</>
        )}
      </p>
      <div className="min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3.5">
          {!nodes.length
            ? <Empty icon="◈">{scope === 'mh' ? 'Mô hình này chưa có bài toán nhỏ nào.' : 'Họ này chưa có bài toán nhỏ nào.'} Bấm <b>＋ Node</b> — lưới trước, gán sau.</Empty>
            : (
              <div style={{ width: rong }}>
                <div className="mb-2 flex" style={{ gap: GAP, marginLeft: hubOffset }}>
                  {cots.map((c) => (
                    <div key={c.cap} style={{ width: COL_W }}
                      className="rounded-md bg-slate-100/80 py-1 text-center text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
                      Cấp {c.cap}
                    </div>
                  ))}
                </div>
                <div className="relative" style={{ height: cao }}>
                  <svg className="pointer-events-none absolute inset-0" width={rong} height={cao}>
                    <defs>
                      <marker id="hh-ar" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                        <path d="M0,0 L6.5,3 L0,6" fill="none" stroke="#94a3b8" strokeWidth="1.3" />
                      </marker>
                      <marker id="hh-arm" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                        <path d="M0,0 L6.5,3 L0,6" fill="none" stroke="#14b8a6" strokeWidth="1.3" />
                      </marker>
                    </defs>
                    {hubCanh.map((e, i) => (
                      <path key={`hub-${i}`} fill="none"
                        d={`M${e.x1},${e.y1} C${e.x1 + GAP * 0.6},${e.y1} ${e.x2 - GAP * 0.6},${e.y2} ${e.x2},${e.y2}`}
                        stroke="#5eead4" strokeWidth="1.6" opacity="0.85" />
                    ))}
                    {canh.map((e, i) => (
                      <path key={i} fill="none"
                        d={`M${e.x1},${e.y1} C${e.x1 + GAP * 0.6},${e.y1} ${e.x2 - GAP * 0.6},${e.y2} ${e.x2},${e.y2}`}
                        stroke={e.xuyen ? '#14b8a6' : '#94a3b8'} strokeWidth={e.sang ? 2.2 : 1.3}
                        strokeDasharray={e.xuyen ? '5 3' : undefined}
                        markerEnd={`url(#${e.xuyen ? 'hh-arm' : 'hh-ar'})`} opacity={e.sang ? 1 : 0.75} />
                    ))}
                  </svg>
                  {scope === 'mh' && mhXem && (
                    <div style={{ left: 0, top: hubY, width: MH_W, height: MH_H }}
                      className="absolute flex flex-col overflow-hidden rounded-xl border-[1.5px] border-teal-300 bg-white">
                      <div className="h-24 shrink-0 border-b border-slate-100 bg-slate-50/50">
                        {api.anhCauHinhCua(L, mhXem.id)
                          ? <img src={api.anhCauHinhCua(L, mhXem.id)!} alt="" className="h-full w-full bg-white object-contain" />
                          : <div className="flex h-full items-center justify-center text-[10.5px] text-slate-300">chưa có hình</div>}
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col gap-1 px-2.5 py-2">
                        <div className="flex items-center gap-1.5">
                          <MaPill code={maCap.get(mhXem.id) ?? '?'} size="sm" />
                          <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-800"><MathText>{mhXem.ten}</MathText></span>
                        </div>
                        <div className="rounded-md bg-teal-50 px-2 py-1 line-clamp-3 text-[11px] leading-snug text-slate-700"><MathText>{api.giaThietDayDu(L, mhXem.id)}</MathText></div>
                        <div className="mt-auto"><Chip>{nodes.length} bài toán</Chip></div>
                      </div>
                    </div>
                  )}
                  {nodes.map((n) => {
                    const p = pos.get(n.id)!
                    const khac = api.doSauTrongHo(L, n.mo_hinh_id) > sauMoc   // node cần THÊM giả thiết
                    const mh = L.moHinh.find((m) => m.id === n.mo_hinh_id)
                    return (
                      <button key={n.id} onClick={() => setChon(n.id)}
                        style={{ left: p.x, top: p.y, width: COL_W, height: NODE_H }}
                        title="Bấm để xem đầy đủ đề · hình · đáp án"
                        className={`absolute flex flex-col overflow-hidden rounded-lg border bg-white text-left leading-tight transition ${
                          khac ? 'border-teal-300 bg-teal-50/40' : 'border-blue-300'
                        } ${chon === n.id ? 'shadow-md ring-2 ring-blue-400/40' : 'hover:shadow-sm'}`}>
                        {/* Hình to full-width trên đầu (như card mô hình). Node có hình riêng thì lấy nó, không thì mượn mô hình. */}
                        <div className="h-24 shrink-0 border-b border-slate-100 bg-slate-50/50">
                          {api.anhCuaBaiToan(L, n.id)
                            ? <img src={api.anhCuaBaiToan(L, n.id)!} alt="" className="h-full w-full bg-white object-contain" />
                            : <div className="flex h-full items-center justify-center text-[10.5px] text-slate-300">chưa có hình</div>}
                        </div>
                        {/* Câu hỏi = nội dung chính · giả thiết (mượn mô hình) = context phụ · cấp/mã. */}
                        <div className="flex min-h-0 flex-1 flex-col gap-1 px-2 py-1.5">
                          <div className="line-clamp-2 text-[12px] font-medium text-slate-800"><MathText>{n.phat_bieu}</MathText></div>
                          <div className="line-clamp-2 rounded bg-teal-50 px-1.5 py-0.5 text-[10.5px] leading-snug text-teal-700"><MathText>{api.giaThietBaiToan(L, n.id)}</MathText></div>
                          <div className="mt-auto flex items-center gap-1.5">
                            <Cap cap={n.cap} teal={khac} />
                            {scope === 'ho' && mh && <span className="truncate rounded-full border border-teal-300 bg-teal-50 px-1.5 text-[9.5px] text-teal-700" title={api.giaThietDayDu(L, mh.id)}>◇ {maCap.get(mh.id) ?? mh.ma}</span>}
                            <Ma>{n.ma}</Ma>
                            {teDeAnDi.has(n.id) && <span className="ml-auto shrink-0 text-[12px] font-bold text-amber-600" title="Còn tiền đề ở mô hình khác — không vẽ được dây, mở bài toán để xem đủ">↗</span>}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
        </div>

      {bt && <DetailBaiToan L={L} bt={bt} onSua={() => onSua(bt)} onTaoKeTiep={() => onTaoKeTiep(bt)} onChon={setChon} onClose={() => setChon(null)} reload={reload} />}
    </>
  )
}

// Nhãn hiển thị. 'ca_hai' là giá trị CŨ (bundle trước) — giữ nhãn để row cũ không hiện undefined; UI mới KHÔNG tạo nó.
const KIEU_BT: Record<string, string> = { doi_so: 'Đổi số', doi_dinh: 'Thay điểm', ca_hai: 'Đổi số + điểm (cũ)' }
const Lbl = ({ children }: { children: ReactNode }) => (
  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</div>
)
// Parse ánh xạ điểm "A>M, B>N; H->K" → { A:'M', B:'N', H:'K' }.
function parseMapDiem(s: string): Record<string, string> {
  const m: Record<string, string> = {}
  for (const pair of s.split(/[,;\n]/)) {
    const [a, b] = pair.split(/\s*(?:->|>|→|:|=)\s*/).map((x) => x.trim())
    if (a && b) m[a] = b
  }
  return m
}
// Đổi nhãn điểm CHỈ trong vùng $…$ (điểm nằm trong math — tránh đụng chữ hoa tiếng Việt như "Chứng").
// Thay đồng thời 1 lượt (không chain A→M rồi M→X). Key dài trước (D' trước D).
function doiDiem(text: string, map: Record<string, string>): string {
  const keys = Object.keys(map)
  if (!text || !keys.length) return text
  const re = new RegExp(keys.sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g')
  return text.replace(/\$[^$]*\$/g, (seg) => seg.replace(re, (m) => map[m] ?? m))
}

// Bấm một node → POPUP TO (80% màn hình, createPortal thoát zoom §707) hiển thị ĐẦY ĐỦ bài toán:
// trái = đề (giả thiết mượn) + câu hỏi + hình to · phải = meta + cách giải/tiền đề + đáp án + ý thực tế.
function DetailBaiToan({ L, bt, onSua, onTaoKeTiep, onChon, onClose, reload }: {
  L: Luoi; bt: BaiToan; onSua: () => void; onTaoKeTiep: () => void; onChon: (id: string) => void; onClose: () => void; reload: () => Promise<void>
}) {
  const maCap = useMemo(() => api.maPhanCapMap(L), [L])
  const mh = L.moHinh.find((m) => m.id === bt.mo_hinh_id)
  const cachs = api.cachCua(L, bt.id)
  const goi = api.capGoiY(L, bt.id)
  const lech = bt.cap - goi
  const mucDo = api.mucDoCua(L, bt.id)
  const cachMd = api.cachMacDinh(L, bt.id)
  const [ys, setYs] = useState<{ y: Y; bai: Bai }[]>([])
  useEffect(() => { api.yTheoNode(bt.id).then(setYs).catch(() => setYs([])) }, [bt.id])
  const [bienThe, setBienThe] = useState<BienThe[]>([])
  const [formBt, setFormBt] = useState<{ v?: BienThe } | null>(null)
  const napBt = () => api.listBienThe(bt.id).then(setBienThe).catch(() => setBienThe([]))
  useEffect(() => { napBt() }, [bt.id])

  return createPortal(
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-6" onClick={onClose}>
      <div className="flex h-[80vh] w-[80vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3">
          <span className="text-[18px] font-semibold text-slate-900">Bài toán</span>
          <Ma big>{bt.ma}</Ma>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[16px] font-medium text-slate-600">cấp {bt.cap}{mucDo ? ` · độ khó ${mucDo}` : ''}</span>
          {mh && <Tag ton="mh" big>◇ {maCap.get(mh.id) ?? mh.ma} · {tron(mh.ten)}</Tag>}
          {cachMd?.dang_id && <Tag ton="dg" big>{api.tenDangDayDu(L, cachMd.dang_id)}</Tag>}
          {/* Đẻ bài kế tiếp NGAY TỪ bài đang xem — ghim đúng nó làm tiền đề chính, không qua đường vòng
              "cấp cao nhất trong mô hình" của nodeTruoc() (Thùy 17/08: "1 bài đẻ ra bài sau của nó"). */}
          <Btn onClick={onTaoKeTiep} className="ml-auto h-8 px-2.5">＋ Bài kế tiếp</Btn>
          <Btn onClick={onSua} className="h-8 px-2.5">✎ Sửa</Btn>
          <Btn onClick={async () => {
            if (!confirm(`Xoá bài toán ${bt.ma}?`)) return
            try { await api.deleteBaiToan(bt.id); onClose(); await reload() } catch (e: any) { alert(e.message) }
          }} className="h-8 px-2.5 border-rose-300 text-rose-600 hover:bg-rose-50" title="Xoá bài toán">🗑 Xoá</Btn>
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>

        {/* Thân — 2 cột */}
        <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-2">
          {/* ── TRÁI: đề + câu hỏi + hình ── */}
          <div className="min-w-0 space-y-2.5 overflow-y-auto border-r border-slate-100 p-5">
            {/* ĐỀ + CÂU HỎI (Thùy 08-14): giả thiết mặc định MƯỢN mô hình, nhưng node được phép có phần
                RIÊNG (cộng thêm) hoặc THAY hẳn — không phải bài nào cũng tuyệt đối kế thừa. */}
            <p className="text-[16px] font-semibold uppercase tracking-wide text-slate-400">
              Đề — giả thiết{bt.gt_thay_the ? ' (riêng của bài này)' : bt.gia_thiet_rieng?.trim() ? ' (mô hình + riêng)' : ` (từ mô hình ${mh ? maCap.get(mh.id) : ''})`}
            </p>
            <FieldCard ton="mh" big><MathText>{api.giaThietBaiToan(L, bt.id)}</MathText></FieldCard>
            <p className="text-[16px] font-semibold uppercase tracking-wide text-slate-400">Câu hỏi</p>
            <FieldCard ton="bt" big><MathText>{`Chứng minh ${bt.phat_bieu}`}</MathText></FieldCard>
            <p className="text-[16px] font-semibold uppercase tracking-wide text-slate-400">Hình</p>
            <Fig src={api.anhCuaBaiToan(L, bt.id)} h="h-80"
              cap={api.anhCuaBaiToan(L, bt.id) ? (bt.anh_chuan ? 'Hình riêng của bài toán' : 'Hình cấu hình (mượn của mô hình)') : undefined} />
          </div>

          {/* ── PHẢI: meta + cách giải + đáp án + ý thực tế ── */}
          <div className="min-w-0 space-y-2.5 overflow-y-auto p-5">
            <KV k="Cấp gợi ý" big>
              {goi}
              {lech !== 0 && (
                <span className="ml-1.5 rounded-md bg-amber-100 px-1.5 py-px text-[15px] font-medium text-amber-800"
                  title="1 + max(cấp tiền đề) theo cách mặc định — chỉ đối chiếu, không ghi đè cấp nhập tay">
                  ⚠ lệch {lech > 0 ? '+' : ''}{lech}
                </span>
              )}
            </KV>

            {cachs.map((c) => {
              const td = api.tienDeCuaCach(L, c.id), bd = api.boDeCuaCach(L, c.id)
              return (
                <div key={c.id} className="rounded-lg border border-slate-200 p-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[16px] font-medium text-slate-600">
                    {c.ten ?? 'cách giải'} {c.la_mac_dinh && <span className="rounded bg-slate-100 px-1.5 text-[14px] text-slate-500">mặc định</span>}
                  </div>
                  {/* Tiền đề của MỘT cách = AND: cần CẢ. Vẽ dấu "+" giữa các tiền đề để không đọc nhầm là "một trong số". */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {td.length > 1 && <span className="mr-0.5 text-[15px] font-semibold text-slate-500">cần cả</span>}
                    {td.map((id, i) => {
                      const b = L.baiToan.find((x) => x.id === id)
                      return b ? (
                        <span key={id} className="flex items-center gap-1">
                          {i > 0 && <span className="font-bold text-slate-400">+</span>}
                          <Tag ton="bt" big onClick={() => onChon(b.id)}>◈ {b.ma} · c{b.cap}</Tag>
                        </span>
                      ) : null
                    })}
                    {bd.map((id) => {
                      const b = L.boDe.find((x) => x.id === id)
                      return b ? <Tag key={id} ton="bd" big>◦ {b.ten}</Tag> : null
                    })}
                    {!td.length && !bd.length && <span className="text-[15px] text-slate-400">chưa nối tiền đề (cổng 2)</span>}
                  </div>
                </div>
              )
            })}

            <p className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-400">Đáp án đầy đủ</p>
            <Sol big>{cachMd?.loi_giai}</Sol>
            {cachMd?.anh_loi_giai && <div><Fig src={cachMd.anh_loi_giai} cap="Hình lời giải" /></div>}

            {/* ⭐ Biến thể: cùng bài toán, đổi số / đổi đỉnh — treo dưới node, đề+hình+đáp án riêng (soạn tay). */}
            <div className="mt-1 flex items-center gap-2">
              <p className="text-[16px] font-semibold uppercase tracking-wide text-slate-400">Biến thể · {bienThe.length}</p>
              <Btn className="ml-auto h-7 px-2 text-[13px]" onClick={() => setFormBt({})}>＋ Thêm biến thể</Btn>
            </div>
            <p className="text-[13px] leading-snug text-slate-400">Cùng bài toán, <b>đổi số / đổi đỉnh</b> — đề + hình + đáp án riêng. Cùng KP với node gốc (không đẻ node mới). Hình phải tự vẽ.</p>
            {bienThe.length === 0
              ? <div className="text-[15px] text-slate-400">— chưa có biến thể —</div>
              : bienThe.map((v) => (
                <div key={v.id} className="rounded-lg border border-indigo-200 bg-indigo-50/30 p-2">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="rounded-full bg-indigo-100 px-2 py-px text-[13px] font-medium text-indigo-700">{KIEU_BT[v.kieu]}</span>
                    <span className="flex-1" />
                    <Btn className="h-6 px-1.5 text-[13px]" onClick={() => setFormBt({ v })}>✎</Btn>
                    <Btn className="h-6 px-1.5 text-[13px]" onClick={async () => {
                      if (!confirm('Xoá biến thể này?')) return
                      try { await api.deleteBienThe(v.id); await napBt() } catch (e: any) { alert(e.message) }
                    }}>🗑</Btn>
                  </div>
                  {v.de_bai && <div className="text-[15px] leading-relaxed text-slate-700"><MathText>{v.de_bai}</MathText></div>}
                  {v.anh && <img src={v.anh} alt="" className="mt-1 max-h-44 rounded border border-slate-100 bg-white object-contain" />}
                  {v.loi_giai && <div className="mt-1 rounded bg-white/70 p-1.5 text-[14px] leading-relaxed text-slate-600"><MathText>{v.loi_giai}</MathText></div>}
                </div>
              ))}

            <p className="mt-1 text-[16px] font-semibold uppercase tracking-wide text-slate-400">Ý thực tế đang trỏ tới node · {ys.length}</p>
            {ys.length
              ? ys.slice(0, 8).map(({ y, bai }) => (
                <div key={y.id} className="flex items-center gap-2 py-0.5 text-[16px] text-slate-600">
                  <Ma big>{bai.ma_bai}</Ma>
                  <span className="truncate">ý {y.nhan_hien_thi ?? y.thu_tu} · {bai.nguon ?? 'chưa rõ nguồn'}</span>
                </div>
              ))
              : <div className="text-[16px] text-slate-400">— chưa bài thật nào dùng node này —</div>}
          </div>
        </div>
      </div>
    </div>
    {formBt && <FormBienThe L={L} baiToanId={bt.id} v={formBt.v}
      goc={{
        de: [api.giaThietBaiToan(L, bt.id), `Chứng minh ${bt.phat_bieu}`].filter(Boolean).join('. '),
        anh: api.anhCuaBaiToan(L, bt.id),
        loiGiai: cachMd?.loi_giai ?? null,
        anhLoiGiai: cachMd?.anh_loi_giai ?? null,
      }}
      onClose={() => setFormBt(null)} onDone={async () => { setFormBt(null); await napBt() }} />}
    </>,
    document.body,
  )
}

// Form biến thể (đổi số / đổi đỉnh) — modal riêng, z cao hơn popup detail. Biến thể MỚI điền sẵn = BÀI GỐC
// (giống y), rồi đổi điểm (relabel tự động) + đổi số (sửa tay + đáp án). Hình Thùy tự update theo đề mới.
function FormBienThe({ L, baiToanId, v, goc, onClose, onDone }: {
  L: Luoi; baiToanId: string; v?: BienThe
  goc: { de: string; anh: string | null; loiGiai: string | null; anhLoiGiai: string | null }
  onClose: () => void; onDone: () => Promise<void>
}) {
  const [kieu, setKieu] = useState<BienThe['kieu']>(v?.kieu ?? 'doi_dinh')
  const [chuoiOpen, setChuoiOpen] = useState(false)
  const [cloneLuaOpen, setCloneLuaOpen] = useState(false)
  // Chuỗi LIÊN THÔNG của node (đi tiền đề cả 2 chiều) → click node nào cũng ra cả chuỗi. Chỉ khi TẠO MỚI.
  const chuoi = useMemo(() => (v ? [] : api.chuoiKetNoi(L, baiToanId)), [L, baiToanId, v])
  // Mới → điền sẵn từ bài gốc (giống y). Sửa → giữ nội dung đã lưu.
  const [deBai, setDeBai] = useState(v?.de_bai ?? goc.de)
  const [anh, setAnh] = useState<string | null>(v?.anh ?? goc.anh)
  const [loiGiai, setLoiGiai] = useState(v?.loi_giai ?? goc.loiGiai ?? '')
  const [anhGiai, setAnhGiai] = useState<string | null>(v?.anh_loi_giai ?? goc.anhLoiGiai)
  const [mapText, setMapText] = useState('')
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [aiBusy, setAiBusy] = useState(false)   // đang gọi AI sinh biến thể (đổi số)
  const [aiGhiChu, setAiGhiChu] = useState('')  // ghi chú tuỳ chọn cho AI
  const [aiDone, setAiDone] = useState(false)   // đã sinh xong → hiện cảnh báo soát hình
  const saoLaiGoc = () => { setDeBai(goc.de); setAnh(goc.anh); setLoiGiai(goc.loiGiai ?? ''); setAnhGiai(goc.anhLoiGiai) }
  // ✨ Clone bài GỐC (đã chốt) → đổi số, giữ logic (giống clone bên Đại). Đổ vào ô đề + lời giải; hình GIỮ NGUYÊN gốc.
  const sinhAI = async () => {
    if (!goc.de.trim()) { setLoi('Chưa có đề gốc để sinh biến thể.'); return }
    setAiBusy(true); setLoi(null)
    try {
      const r = await api.sinhBienTheHinh({ de: goc.de, loiGiai: goc.loiGiai }, aiGhiChu)
      if (r.de_bai) setDeBai(r.de_bai)
      if (r.loi_giai) setLoiGiai(r.loi_giai)
      setAiDone(true)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setAiBusy(false) }
  }
  // ✨ AI đổi ĐỈNH: giữ nguyên số + logic, chỉ đổi tên điểm (nhất quán khắp đề + lời giải). Đổ vào 2 ô; hình GIỮ gốc.
  const doiDinhAI = async () => {
    if (!goc.de.trim()) { setLoi('Chưa có đề gốc để đổi đỉnh.'); return }
    setAiBusy(true); setLoi(null)
    try {
      const r = await api.doiDinhHinh({ de: goc.de, loiGiai: goc.loiGiai }, aiGhiChu)
      if (r.de_bai) setDeBai(r.de_bai)
      if (r.loi_giai) setLoiGiai(r.loi_giai)
      setAiDone(true)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setAiBusy(false) }
  }
  const apDoiDiem = () => {
    const m = parseMapDiem(mapText)
    if (!Object.keys(m).length) { setLoi('Ánh xạ điểm trống — nhập kiểu "A>M, B>N, C>P".'); return }
    setLoi(null); setDeBai((s) => doiDiem(s, m)); setLoiGiai((s) => doiDiem(s, m))
  }
  const luu = async () => {
    setSaving(true); setLoi(null)
    try {
      const payload = { kieu, de_bai: deBai, anh, loi_giai: loiGiai || null, anh_loi_giai: anhGiai }
      if (v) await api.updateBienThe(v.id, payload)
      else await api.createBienThe({ baitoan_id: baiToanId, ...payload })
      await onDone()
    } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex max-h-[88vh] w-[92vw] max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">{v ? 'Sửa biến thể' : 'Thêm biến thể'}</h3>
          <span className="text-[12px] text-slate-400">cùng bài toán, đổi số / đổi đỉnh</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          {/* Up cả bài (ảnh/PDF) → AI tách ĐỀ + LỜI GIẢI, khỏi điền tay từng ô (như ingest bên Đại). */}
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-2.5">
            <Lbl>Up cả bài → AI tự tách (đỡ điền tay)</Lbl>
            <IngestBaiButton onResult={({ de_bai, loi_giai, anh: anhMoi }) => {
              const doiHinh = anhMoi && anhMoi !== anh
              if ((deBai.trim() || loiGiai.trim() || doiHinh) && !confirm(`Ghi đè đề + lời giải${doiHinh ? ' + hình vẽ' : ''} hiện tại bằng bản AI tách?`)) return
              if (de_bai) setDeBai(de_bai)
              if (loi_giai) setLoiGiai(loi_giai)
              if (anhMoi) setAnh(anhMoi)
            }} />
            <p className="mt-1 text-[11px] leading-snug text-slate-500">AI đọc ảnh/PDF (nhiều trang được) → đổ <b>đề</b> + <b>lời giải</b> vào 2 ô dưới, tự nhận diện + cắt <b>hình vẽ</b> (nếu có). Xong nhớ soát lại.</p>
          </div>
          <div>
            <Lbl>Kiểu biến thể</Lbl>
            <div className="flex gap-2">
              {(['doi_dinh', 'doi_so'] as const).map((k) => (
                <button key={k} type="button" onClick={() => { setKieu(k); setAiDone(false) }}
                  className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${kieu === k ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{KIEU_BT[k]}</button>
              ))}
            </div>
          </div>
          {/* Thay điểm → relabel tự động (chỉ trong $…$). Đổi số → sửa tay + tính lại đáp án (2 kiểu tách hẳn). */}
          {kieu === 'doi_dinh' ? (
            <div className="space-y-2">
              {chuoi.length > 1 && (
                <div className="rounded-lg border border-violet-300 bg-violet-50/60 p-2.5">
                  <Lbl>🔗 Bài này nằm trong chuỗi {chuoi.length} câu (nối tiền đề)</Lbl>
                  <p className="text-[11.5px] leading-snug text-slate-600">Đổi đỉnh <b>cả chuỗi</b> bằng <b>một bộ điểm</b> → tạo một <b>lứa</b> khớp để ghép a,b,c sau. (Chỉ đổi riêng bài này thì dùng các ô dưới.)</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Btn kind="pri" className="h-8 px-3 text-[12px]" onClick={() => setChuoiOpen(true)}>🔗 Đổi đỉnh cả chuỗi…</Btn>
                    <Btn className="h-8 px-3 text-[12px]" onClick={() => setCloneLuaOpen(true)}>📥 Nhập lứa đã clone (PDF)…</Btn>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">Đã tự clone chuỗi này ở ngoài (đổi số/hình…)? Up file clone lên, AI tự khớp từng ý vào đúng bài trong chuỗi.</p>
                </div>
              )}
              {chuoiOpen && <ChuoiDoiDinhPopup L={L} chuoi={chuoi} onClose={() => setChuoiOpen(false)} onDone={onDone} />}
              {cloneLuaOpen && <NhapCloneLuaPopup L={L} chuoi={chuoi} onClose={() => setCloneLuaOpen(false)} onDone={onDone} />}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-2.5">
                <Lbl>Thay điểm (thủ công) — gõ ánh xạ, tự thay trong $…$</Lbl>
                <div className="flex gap-2">
                  <input className={inpCls} value={mapText} onChange={(e) => setMapText(e.target.value)} placeholder="A>M, B>N, C>P, H>K" />
                  <Btn className="h-[38px] shrink-0 px-3" onClick={apDoiDiem}>Áp dụng</Btn>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">Chỉ đổi ký hiệu trong <code>$…$</code>, giữ nguyên số.</p>
              </div>
              {/* ✨ Đổi đỉnh bằng AI: AI tự chọn bộ đỉnh mới, đổi nhất quán khắp đề + lời giải (cả ngoài $…$), giữ số + logic. */}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-2.5">
                <Lbl>✨ Đổi đỉnh bằng AI — tự chọn bộ đỉnh mới, giữ nguyên số & logic</Lbl>
                <div className="flex gap-2">
                  <input className={inpCls} value={aiGhiChu} onChange={(e) => setAiGhiChu(e.target.value)} placeholder="Ghi chú cho AI (tuỳ chọn): vd đổi sang M, N, P…" />
                  <Btn kind="pri" className="h-[38px] shrink-0 px-3" disabled={aiBusy || !goc.de.trim()} onClick={doiDinhAI}>{aiBusy ? '⏳ Đang đổi…' : '✨ Đổi đỉnh'}</Btn>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">AI đổi TÊN điểm nhất quán khắp <b>đề</b> + <b>lời giải</b> (cả ngoài <code>$…$</code>), giữ nguyên số.</p>
                {aiDone && (
                  <p className="mt-1.5 rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium leading-snug text-amber-800">
                    ⚠ Đã đổi tên điểm ở đề + lời giải. Hình vẫn là <b>hình gốc</b> — sửa nhãn điểm trên hình cho khớp bộ điểm mới.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 text-[11.5px] leading-snug text-amber-800">
                <b>Đổi số:</b> đổi giá trị trong đề + <b>tính lại đáp án</b> (đổi số phải giải lại, không tự đúng được). Giữ nguyên tên điểm. Sửa tay, hoặc để <b>AI sinh</b> ở dưới.
              </div>
              {/* ✨ Sinh bằng AI: clone bài gốc → đổi số, giữ logic (giống clone bên Đại). Hình DÙNG LẠI hình gốc → cảnh báo nếu số nằm trên hình. */}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-2.5">
                <Lbl>✨ Sinh bằng AI — giữ nguyên logic, chỉ đổi số</Lbl>
                <div className="flex gap-2">
                  <input className={inpCls} value={aiGhiChu} onChange={(e) => setAiGhiChu(e.target.value)} placeholder="Ghi chú cho AI (tuỳ chọn): vd số nhỏ hơn, kết quả nguyên…" />
                  <Btn kind="pri" className="h-[38px] shrink-0 px-3" disabled={aiBusy || !goc.de.trim()} onClick={sinhAI}>{aiBusy ? '⏳ Đang sinh…' : '✨ Sinh'}</Btn>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-500">AI clone <b>bài gốc</b> → đổi số → đổ vào ô <b>đề</b> + <b>lời giải</b> dưới. Giữ nguyên tên điểm & cấu hình hình.</p>
                {aiDone && (
                  <p className="mt-1.5 rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium leading-snug text-amber-800">
                    ⚠ Đã đổi số ở đề + lời giải. Hình vẫn là <b>hình gốc</b> — nếu có số ghi TRÊN hình, phải vẽ lại hình cho khớp số mới. Soát kỹ đáp án.
                  </p>
                )}
              </div>
            </div>
          )}
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Lbl>Đề — giả thiết + câu hỏi (text + LaTeX $…$)</Lbl>
              <button type="button" onClick={saoLaiGoc} className="mb-1 rounded-md border border-slate-300 px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-50">↺ Sao lại từ bài gốc</button>
            </div>
            <textarea className={`${inpCls} h-24`} value={deBai} onChange={(e) => setDeBai(e.target.value)} placeholder="$\triangle MNP$ nhọn, ba đường cao $MD, NE, PF$ cắt nhau tại $K$. Chứng minh…" />
            <div className="mt-1.5"><OcrButton onText={setDeBai} /></div>
          </div>
          <div>
            <Lbl>Hình của biến thể — tự vẽ/upload (AI không vẽ lại hình hình học được)</Lbl>
            <AnhInput value={anh} onChange={setAnh} cap="Hình biến thể" />
          </div>
          <div>
            <Lbl>Lời giải (tuỳ chọn)</Lbl>
            <textarea className={`${inpCls} h-20`} value={loiGiai} onChange={(e) => setLoiGiai(e.target.value)} />
            <div className="mt-1.5"><OcrButton onText={setLoiGiai} /></div>
          </div>
          <div>
            <Lbl>Ảnh lời giải (tuỳ chọn)</Lbl>
            <AnhInput value={anhGiai} onChange={setAnhGiai} cap="Hình lời giải" />
          </div>
          {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={!deBai.trim() || saving} onClick={luu}>{saving ? 'Đang lưu…' : v ? 'Lưu' : 'Thêm biến thể'}</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// Popup ĐỔI ĐỈNH CẢ CHUỖI (một lứa): tick câu → AI relabel 1 map dùng chung → lưu mỗi node 1 biến thể cùng lua_id.
function ChuoiDoiDinhPopup({ L, chuoi, onClose, onDone }: {
  L: Luoi; chuoi: BaiToan[]; onClose: () => void; onDone: () => Promise<void>
}) {
  const [chon, setChon] = useState<Set<string>>(new Set(chuoi.map((b) => b.id)))
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const selected = chuoi.filter((b) => chon.has(b.id))
  const sinh = async () => {
    if (!selected.length) { setLoi('Chọn ít nhất 1 câu.'); return }
    setBusy(true); setLoi(null)
    try {
      const cau = selected.map((bt) => ({
        ma: bt.ma,
        de: [api.giaThietBaiToan(L, bt.id), `Chứng minh ${bt.phat_bieu}`].filter(Boolean).join('. '),
        loiGiai: api.cachMacDinh(L, bt.id)?.loi_giai ?? '',
      }))
      const res = await api.doiDinhChuoiHinh(cau, ghiChu)
      if (res.length !== selected.length) throw new Error(`AI trả ${res.length}/${selected.length} câu — thử lại hoặc bớt câu.`)
      const selIds = new Set(selected.map((b) => b.id))
      const items = selected.map((bt, i) => ({
        baitoan_id: bt.id, de_bai: res[i].de_bai, anh: api.anhCuaBaiToan(L, bt.id),
        loi_giai: res[i].loi_giai || null, anh_loi_giai: api.cachMacDinh(L, bt.id)?.anh_loi_giai ?? null,
        // Tiền đề bài-tầng ĐÓNG BĂNG: node-tiền-đề TRỰC TIẾP của bt mà CŨNG nằm trong lứa (đã tick).
        tienDeBaiToanIds: api.tienDeCua(L, bt.id).filter((id) => selIds.has(id)),
      }))
      await api.saveLuaBienThe(items)
      alert(`Đã tạo lứa ${items.length} biến thể đổi đỉnh (cùng một bộ điểm). Nhớ sửa nhãn điểm trên hình từng câu cho khớp.`)
      await onDone()
    } catch (e: any) { setLoi(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex max-h-[85vh] w-[92vw] max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">🔗 Đổi đỉnh cả chuỗi</h3>
          <span className="text-[12px] text-slate-400">một bộ điểm cho cả lứa</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
          <p className="text-[12px] leading-snug text-slate-500">Tick các câu đổi đỉnh cùng nhau. AI chọn <b>một</b> bộ điểm mới áp cho cả chuỗi → biến thể khớp nhau (một lứa), giữ nguyên số & logic.</p>
          {chuoi.map((b, i) => {
            const on = chon.has(b.id)
            return (
              <button key={b.id} type="button" onClick={() => setChon((s) => { const n = new Set(s); n.has(b.id) ? n.delete(b.id) : n.add(b.id); return n })}
                className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition ${on ? 'border-violet-300 bg-violet-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-[12px] text-white ${on ? 'border-violet-500 bg-violet-500' : 'border-slate-300'}`}>{on ? '✓' : ''}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-1.5"><span className="text-[10px] text-slate-400">câu {i + 1}</span><Ma>{b.ma}</Ma><Cap cap={b.cap} /></div>
                  <div className="text-[12.5px] text-slate-700"><MathText>{b.phat_bieu}</MathText></div>
                </div>
              </button>
            )
          })}
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Ghi chú cho AI (tuỳ chọn)</div>
            <input className={inpCls} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="vd đổi sang M, N, P, Q…" />
          </div>
          {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
          <p className="rounded-md bg-amber-50 px-2 py-1 text-[11px] leading-snug text-amber-700">⚠ Hình mỗi câu vẫn là hình gốc — nhãn điểm trên hình phải sửa cho khớp bộ điểm mới.</p>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <span className="text-[12.5px] text-slate-500"><b>{selected.length}</b>/{chuoi.length} câu</span>
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={busy || !selected.length} onClick={sinh}>{busy ? '⏳ Đang sinh…' : `Sinh lứa (${selected.length} câu)`}</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// Popup NHẬP LỨA ĐÃ CLONE SẴN (ảnh/PDF) — Thùy 08-20: hệ thống chưa tự SINH được 1 chuỗi clone hoàn
// chỉnh (chỉ đổi được tên điểm qua ChuoiDoiDinhPopup) — người tự clone chuỗi ở NGOÀI (đổi số/hình/gì
// cũng được) rồi NHẬP lại đây. AI CHỈ ĐỌC + KHỚP từng ý vào đúng bài gốc theo NỘI DUNG (khoá = mã bài,
// không phải vị trí/thứ tự in — CLAUDE.md §2), không tự sinh chữ. Soát/sửa tay được TRƯỚC khi lưu thành
// 1 lứa (saveLuaBienThe — khuôn NGUYÊN ChuoiDoiDinhPopup, chỉ khác nguồn nội dung).
function NhapCloneLuaPopup({ L, chuoi, onClose, onDone }: {
  L: Luoi; chuoi: BaiToan[]; onClose: () => void; onDone: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [daBoc, setDaBoc] = useState(false)
  const [anhLua, setAnhLua] = useState<string | null>(null)
  const [gan, setGan] = useState<Record<string, { deBai: string; loiGiai: string }>>({})
  const [khongKhop, setKhongKhop] = useState<{ khop_voi_ma: string; de_bai: string; loi_giai: string }[]>([])

  const boc = async (files: File[]) => {
    const fs = files.filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
    if (!fs.length) { setLoi('Chọn ảnh hoặc PDF của bản clone trước.'); return }
    setBusy(true); setLoi(null)
    try {
      const perFile = await Promise.all(fs.map(async (f) => fileToCanvases(f.type, await fileToBase64(f))))
      const canvases = perFile.flat()
      const gf = canvases.map((c) => ({ mimeType: 'image/jpeg', dataBase64: canvasToJpegBase64(c) }))
      const r = await api.ingestLuaChuoiHinh(gf, chuoi.map((b) => ({ ma: b.ma, phat_bieu: b.phat_bieu })))
      // Khớp theo MÃ (khoá tự nhiên) — ý ĐẦU TIÊN khớp 1 mã thì giữ; ý sau trùng mã hoặc mã lạ → "chưa khớp",
      // KHÔNG rơi mất im lặng (§1.5 "thà bỏ trống còn hơn đánh sai" — người tự soát ở bước review).
      const maToId = new Map(chuoi.map((b) => [b.ma, b.id]))
      const daDung = new Set<string>()
      const ganMoi: Record<string, { deBai: string; loiGiai: string }> = {}
      const conLai: typeof r.y = []
      for (const y of r.y) {
        const bid = maToId.get(y.khop_voi_ma)
        if (bid && !daDung.has(bid)) { daDung.add(bid); ganMoi[bid] = { deBai: y.de_bai, loiGiai: y.loi_giai } }
        else conLai.push(y)
      }
      setGan(ganMoi); setKhongKhop(conLai)
      if (r.co_hinh && r.box_hinh && canvases[r.trang_hinh]) {
        try {
          const blob = await (await fetch(cropCanvasBox(canvases[r.trang_hinh], r.box_hinh))).blob()
          setAnhLua(await api.uploadKhoImage(new File([blob], 'hinh-lua.png', { type: 'image/png' })))
        } catch { /* cắt/upload hình lỗi → bỏ hình, vẫn giữ đề/lời giải đã khớp được */ }
      }
      setDaBoc(true)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const suaO = (id: string, patch: Partial<{ deBai: string; loiGiai: string }>) =>
    setGan((s) => ({ ...s, [id]: { deBai: s[id]?.deBai ?? '', loiGiai: s[id]?.loiGiai ?? '', ...patch } }))

  const soKhop = chuoi.filter((b) => gan[b.id]?.deBai.trim()).length

  const luu = async () => {
    const selIds = new Set(chuoi.map((b) => b.id))
    const items = chuoi.filter((b) => gan[b.id]?.deBai.trim()).map((b) => ({
      baitoan_id: b.id, de_bai: gan[b.id].deBai.trim(), anh: anhLua ?? api.anhCuaBaiToan(L, b.id),
      loi_giai: gan[b.id].loiGiai.trim() || null, anh_loi_giai: api.cachMacDinh(L, b.id)?.anh_loi_giai ?? null,
      tienDeBaiToanIds: api.tienDeCua(L, b.id).filter((id) => selIds.has(id)),
    }))
    if (!items.length) { setLoi('Chưa có bài nào khớp được nội dung — chưa có gì để lưu.'); return }
    setBusy(true); setLoi(null)
    try {
      await api.saveLuaBienThe(items)
      alert(`Đã tạo lứa ${items.length}/${chuoi.length} biến thể từ bản clone.${items.length < chuoi.length ? ` Còn ${chuoi.length - items.length} bài chưa khớp được, chưa có biến thể trong lứa này.` : ''}`)
      await onDone()
    } catch (e: any) { setLoi(e.message ?? String(e)); setBusy(false) }
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex max-h-[88vh] w-[94vw] max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">📥 Nhập lứa đã clone</h3>
          <span className="text-[12px] text-slate-400">{chuoi.length} bài trong chuỗi</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {!daBoc ? (
            <>
              <p className="text-[12.5px] leading-snug text-slate-600">
                Đã tự clone chuỗi {chuoi.length} bài này ở bên ngoài (đổi số/đổi hình/đổi cách hỏi…)? Up file
                clone lên — AI đọc rồi tự khớp từng ý vào ĐÚNG bài gốc trong chuỗi theo nội dung, không theo
                thứ tự in cứng. Soát lại được ở bước sau, trước khi lưu.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">Chuỗi gốc (để đối chiếu)</div>
                <ol className="space-y-0.5 text-[12px] text-slate-600">
                  {chuoi.map((b, i) => <li key={b.id}>{i + 1}. <Ma>{b.ma}</Ma> <MathText>{b.phat_bieu}</MathText></li>)}
                </ol>
              </div>
              <label className={`inline-flex h-9 cursor-pointer items-center rounded-lg border px-3 text-[13px] font-medium transition ${busy ? 'border-slate-200 text-slate-400' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                {busy ? '⏳ AI đang đọc + khớp…' : '🪄 Chọn file clone (ảnh/PDF, nhiều trang được)'}
                <input type="file" accept="image/*,application/pdf" multiple className="hidden" disabled={busy}
                  onChange={(e) => boc(Array.from(e.target.files ?? []))} />
              </label>
              {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
            </>
          ) : (
            <>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-[12.5px] text-emerald-800">
                Khớp được <b>{soKhop}/{chuoi.length}</b> bài. Soát lại từng ô dưới trước khi lưu — sửa tay được.
              </div>
              <div>
                <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">Hình dùng chung cho cả lứa</div>
                <Fig src={anhLua} cap={anhLua ? 'Cắt tự động từ bản clone' : 'Không nhận diện được hình — up tay sau khi lưu cũng được'} h="h-36" />
              </div>
              {chuoi.map((b, i) => {
                const o = gan[b.id]
                const khop = !!o?.deBai.trim()
                return (
                  <div key={b.id} className={`rounded-lg border p-2.5 ${khop ? 'border-slate-200' : 'border-amber-300 bg-amber-50/50'}`}>
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">câu {i + 1}</span><Ma>{b.ma}</Ma><Cap cap={b.cap} />
                      <span className="min-w-0 flex-1 truncate text-[11.5px] text-slate-500"><MathText>{b.phat_bieu}</MathText></span>
                      {!khop && <span className="shrink-0 text-[10.5px] font-medium text-amber-700">chưa khớp — điền tay hoặc bỏ qua</span>}
                    </div>
                    <textarea className={`${inpCls} h-16`} value={o?.deBai ?? ''} onChange={(e) => suaO(b.id, { deBai: e.target.value })} placeholder="Đề (giả thiết + câu hỏi) của bài này trong bản clone…" />
                    <textarea className={`${inpCls} mt-1.5 h-14`} value={o?.loiGiai ?? ''} onChange={(e) => suaO(b.id, { loiGiai: e.target.value })} placeholder="Lời giải (không bắt buộc)…" />
                  </div>
                )
              })}
              {khongKhop.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                  <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">{khongKhop.length} ý AI đọc được nhưng KHÔNG khớp bài nào trong chuỗi (copy tay vào ô đúng ở trên nếu cần)</div>
                  {khongKhop.map((y, i) => (
                    <div key={i} className="mb-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-[12px] text-slate-600">
                      <span className="text-[10.5px] text-slate-400">gán nhầm mã "{y.khop_voi_ma}" · </span><MathText>{y.de_bai}</MathText>
                    </div>
                  ))}
                </div>
              )}
              {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
            </>
          )}
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            {daBoc && <Btn kind="pri" disabled={busy || !soKhop} onClick={luu}>{busy ? '⏳ Đang lưu…' : `Lưu lứa (${soKhop} bài)`}</Btn>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ══════════════════ VIEW MÔ HÌNH — cột = TẦNG ══════════════════
function ViewMoHinh({ L, ho, trongHo, chon, setChon, onSua, onThemCon, reload }: {
  L: Luoi; ho: MoHinh; trongHo: Set<string>; chon: string; setChon: (id: string) => void
  onSua: (m: MoHinh) => void; onThemCon: (id: string) => void; reload: () => Promise<void>
}) {
  // Tầng = chỉ node CÓ nhánh con (hub) + gốc họ. Node LÁ = vệ tinh, KHÔNG chiếm cột — treo dưới bố.
  // (Thùy 08-07) Mọi tổ tiên của hub đều là hub ⇒ tầng hub = độ sâu (như cũ); chỉ lá là đổi.
  const { cots, pos, satPos, cao, rong } = useMemo(() => {
    const ds = L.moHinh.filter((m) => trongHo.has(m.id))
    const coCon = (id: string) => api.conCua(L, id).length > 0
    const laVeTinh = (m: MoHinh) => !m.la_goc_ho && !coCon(m.id)
    const structural = ds.filter((m) => !laVeTinh(m))
    // Vệ tinh gom theo bố (cha ĐẦU TIÊN — DAG nhiều cha thì treo dưới 1 chỗ), sắp theo mã cho ổn định.
    const satOf = new Map<string, MoHinh[]>()
    for (const lf of ds.filter(laVeTinh)) {
      const pa = api.chaCua(L, lf.id)[0]; if (!pa) continue
      const arr = satOf.get(pa) ?? []; arr.push(lf); satOf.set(pa, arr)
    }
    for (const arr of satOf.values()) arr.sort((a, b) => a.ma.localeCompare(b.ma))
    const sau = new Map(structural.map((m) => [m.id, api.doSauTrongHo(L, m.id)]))
    const tang = [...new Set([...sau.values()])].sort((a, b) => a - b)
    const cots = tang.map((t) => ({ tang: t, ms: structural.filter((m) => sau.get(m.id) === t) }))
    const pos = new Map<string, { x: number; y: number }>()
    const satPos = new Map<string, { x: number; y: number }>()
    const colH: number[] = []
    cots.forEach((c, ci) => {
      const x = ci * (MH_W + GAP)
      let y = 0
      c.ms.forEach((m) => {
        pos.set(m.id, { x, y })
        const sats = satOf.get(m.id) ?? []
        sats.forEach((s, si) => satPos.set(s.id, { x: x + SAT_INDENT, y: y + MH_H + SAT_TOP + si * (SAT_H + SAT_GAP) }))
        y += MH_H + (sats.length ? SAT_TOP + sats.length * (SAT_H + SAT_GAP) : 0) + ROW_GAP
      })
      colH.push(y)
    })
    return {
      cots, pos, satPos,
      cao: Math.max(140, ...colH),
      rong: Math.max(560, cots.length * (MH_W + GAP) - GAP),
    }
  }, [L, trongHo])

  const maCap = useMemo(() => api.maPhanCapMap(L), [L])
  const mh = L.moHinh.find((m) => m.id === chon) ?? ho
  const lt = api.lyThuyetCuaMoHinh(L, mh.id)
  const con = api.conCua(L, mh.id).map((id) => L.moHinh.find((m) => m.id === id)!).filter(Boolean)
  const theoCap = new Map<number, BaiToan[]>()
  for (const b of lt.rieng) { const a = theoCap.get(b.cap) ?? []; a.push(b); theoCap.set(b.cap, a) }

  // Lý thuyết NỘI DUNG của mô hình (khác `lt` ở trên — đó là tập bài toán). Tái dùng NGUYÊN
  // LyThuyetModal (gõ tay hoặc ảnh/PDF → AI bóc LaTeX), khuôn hệt bổ đề (Catalog.tsx MBoDe).
  const [moLtMap, setMoLtMap] = useState<Record<string, { noi_dung: string; file_url: string | null; ten_file: string | null }>>({})
  const [moLtModal, setMoLtModal] = useState<{ id: string; ten: string } | null>(null)
  const napMoLt = () => api.hinhMoHinhLyThuyet.list().then(setMoLtMap).catch(() => { /* */ })
  useEffect(() => { napMoLt() }, [])
  const coMoLt = !!(moLtMap[mh.id]?.noi_dung?.trim() || moLtMap[mh.id]?.file_url)

  return (
    <>
      <p className="mb-3 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        Chiếu bỏ trục suy luận → còn <b>trục giả thiết</b>. Cột = <b>tầng</b> — chỉ mô hình <b>có nhánh con</b>.
        Mô hình <b>lá</b> (không con) treo dưới bố thành <b>vệ tinh</b> (mã chữ: <code>1a</code>), không mở tầng mới.
        Detail card = <b>danh sách bài toán</b>. Độ sâu chỉ để <b>định vị</b> — độ khó đến từ cấp.
      </p>
      <div className="grid items-start gap-4 lg:grid-cols-[1fr_330px]">
        <div className="min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3.5">
          <div style={{ width: rong }}>
            <div className="mb-2 flex" style={{ gap: GAP }}>
              {cots.map((c) => (
                <div key={c.tang} style={{ width: MH_W }}
                  className="rounded-md bg-slate-100/80 py-1 text-center text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
                  {c.tang === 0 ? 'Tầng 0 — gốc họ' : `Tầng ${c.tang}`}
                </div>
              ))}
            </div>
            <div className="relative" style={{ height: cao }}>
              <svg className="pointer-events-none absolute inset-0" width={rong} height={cao}>
                {L.canh.map((e, i) => {
                  const a = pos.get(e.cha_id); if (!a) return null
                  const b = pos.get(e.mo_hinh_id)
                  if (b) { // hub → hub: cạnh TẦNG THẬT (teal liền, có mũi tên)
                    const x1 = a.x + MH_W, y1 = a.y + MH_H / 2, x2 = b.x, y2 = b.y + MH_H / 2
                    return <path key={i} fill="none" d={`M${x1},${y1} C${x1 + GAP * 0.6},${y1} ${x2 - GAP * 0.6},${y2} ${x2},${y2}`}
                      stroke="#14b8a6" strokeWidth="1.5" markerEnd="url(#hh-arm2)" />
                  }
                  const s = satPos.get(e.mo_hinh_id) // hub → VỆ TINH: nan hoa ĐỨT, chỉ vẽ từ bố đặt chỗ (cha đầu)
                  if (s && api.chaCua(L, e.mo_hinh_id)[0] === e.cha_id) {
                    const x1 = a.x + SAT_INDENT + 10, y1 = a.y + MH_H, x2 = s.x + 8, y2 = s.y + SAT_H / 2
                    return <path key={i} fill="none" d={`M${x1},${y1} C${x1},${y1 + 14} ${x2 - 18},${y2} ${x2},${y2}`}
                      stroke="#a5b4fc" strokeWidth="1.3" strokeDasharray="4 3" />
                  }
                  return null
                })}
                <defs>
                  <marker id="hh-arm2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L6.5,3 L0,6" fill="none" stroke="#14b8a6" strokeWidth="1.3" />
                  </marker>
                </defs>
              </svg>
              {cots.flatMap((c) => c.ms).map((m) => {
                const p = pos.get(m.id)!
                const n = L.baiToan.filter((b) => b.mo_hinh_id === m.id)
                const caps = n.map((b) => b.cap)
                return (
                  <button key={m.id} onClick={() => setChon(m.id)} style={{ left: p.x, top: p.y, width: MH_W, height: MH_H }}
                    className={`absolute flex flex-col overflow-hidden rounded-xl border-[1.5px] border-teal-300 bg-white text-left transition ${
                      chon === m.id ? 'ring-[3px] ring-teal-300/50' : 'hover:shadow-sm'}`}>
                    <div className="h-24 shrink-0 border-b border-slate-100 bg-slate-50/50">
                      {api.anhCauHinhCua(L, m.id)
                        ? <img src={api.anhCauHinhCua(L, m.id)!} alt="" className="h-full w-full bg-white object-contain" />
                        : <div className="flex h-full items-center justify-center text-[10.5px] text-slate-300">chưa có hình</div>}
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-1 px-2.5 py-2">
                      <div className="flex items-center gap-1.5">
                        <MaPill code={maCap.get(m.id) ?? '?'} size="sm" />
                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-800"><MathText>{m.ten}</MathText></span>
                      </div>
                      <div className="rounded-md bg-teal-50 px-2 py-1 line-clamp-2 text-[11px] leading-snug text-slate-700"><MathText>{api.giaThietDayDu(L, m.id)}</MathText></div>
                      <div className="mt-auto flex gap-1.5 pt-0.5">
                        <Chip>{n.length} bài toán</Chip>
                        {caps.length > 0 && <Chip>cấp {dai(caps)}</Chip>}
                      </div>
                    </div>
                  </button>
                )
              })}
              {/* VỆ TINH — card rút gọn (mã + tên), click mở tâm–bài toán như hub (RadialEco panel phải). */}
              {[...satPos.entries()].map(([id, p]) => {
                const m = L.moHinh.find((x) => x.id === id); if (!m) return null
                return (
                  <button key={id} onClick={() => setChon(id)} style={{ left: p.x, top: p.y, width: SAT_W, height: SAT_H }}
                    className={`absolute flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 px-2 text-left transition hover:bg-indigo-50 ${
                      chon === id ? 'ring-2 ring-indigo-300/60' : ''}`}>
                    <MaPill code={maCap.get(id) ?? '?'} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-slate-700"><MathText>{m.ten}</MathText></span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* HỆ SINH THÁI của mô hình đang chọn: mô hình làm TRUNG TÂM (hình + giả thiết đầy đủ), rồi
            các bài toán PHỤ THUỘC nó (nhóm theo cấp). Lưới mô hình = quan hệ mô hình↔bài toán, khác
            lưới bài toán (chỉ quan hệ bài↔bài). */}
        <Panel label="Hệ sinh thái của mô hình">
          <div className="mb-2 flex items-center gap-2">
            <MaPill code={maCap.get(mh.id) ?? '?'} />
            <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-slate-900"><MathText>{mh.ten}</MathText></span>
            <Ma>{mh.ma}</Ma>
            <div className="flex shrink-0 gap-1">
              <Btn onClick={() => onSua(mh)} className="h-7 px-2" title="Sửa mô hình">✎</Btn>
              <Btn onClick={async () => {
                if (!confirm(`Xoá mô hình ${maCap.get(mh.id) ?? mh.ma} · ${tron(mh.ten)}?`)) return
                try { await api.deleteMoHinh(mh.id); setChon(ho.id); await reload() } catch (e: any) { alert(e.message) }
              }} className="h-7 px-2 border-rose-300 text-rose-600 hover:bg-rose-50" title="Xoá mô hình">🗑</Btn>
            </div>
          </div>
          <FieldCard label="Giả thiết đầy đủ (đề của MỌI bài toán trong mô hình)"><MathText>{api.giaThietDayDu(L, mh.id)}</MathText></FieldCard>
          {mh.gt_thay_the
            ? <FieldCard label="Tự phát biểu — thay cách gọi của bố (quan hệ cha-con vẫn giữ)" ton="slate" className="mt-1.5"><MathText>{mh.gia_thiet}</MathText></FieldCard>
            : mh.gia_thiet_them && <FieldCard label="Phần thêm so với bố" ton="slate" className="mt-1.5"><MathText>{mh.gia_thiet_them}</MathText></FieldCard>}

          {/* Lý thuyết của mô hình — tái dùng NGUYÊN editor lý thuyết của Đại (bóc ảnh/PDF), khuôn hệt bổ đề. */}
          <div className="mt-1.5 rounded-lg border border-violet-200 bg-violet-50/50 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">Lý thuyết</span>
              <Btn className="ml-auto h-6 px-2 text-[11px]" onClick={() => setMoLtModal({ id: mh.id, ten: mh.ten })}>
                {coMoLt ? '✎ Sửa' : '＋ Soạn'}
              </Btn>
            </div>
            {coMoLt
              ? <div className="mt-1.5 max-h-40 overflow-y-auto text-[12px] leading-relaxed text-slate-700"><MathText>{moLtMap[mh.id]?.noi_dung ?? ''}</MathText></div>
              : <div className="mt-1 text-[11.5px] text-slate-400">Chưa có — bấm Soạn (gõ tay hoặc dán ảnh/PDF → AI bóc LaTeX).</div>}
          </div>

          <div className="mb-1 mt-3 flex items-center gap-2">
            <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Sơ đồ tâm–vệ tinh · {lt.rieng.length} bài toán phụ thuộc</span>
            <Btn className="ml-auto h-6 px-2 text-[11px]" onClick={() => onThemCon(mh.id)}>＋ Mô hình con</Btn>
          </div>
          {lt.rieng.length
            ? <RadialEco L={L} mh={mh} nodes={lt.rieng} maCap={maCap} />
            : <div className="py-6 text-center text-[12px] text-slate-400">— mô hình này chưa có bài toán nào (vùng chưa khai thác) —</div>}

          {!!lt.keThua.length && (
            <div className="mt-2.5 rounded-lg bg-teal-50/70 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
              <b className="text-teal-700">Kế thừa:</b> mô hình này dùng được thêm <b>{lt.keThua.length}</b> bài toán từ tổ tiên.
            </div>
          )}
          {!!con.length && !!lt.rieng.length && (
            <div className="mt-2 rounded-lg bg-teal-50/70 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
              <b className="text-teal-700">Toả xuống:</b> {con.map((c) => c.ma).join(' · ')} dùng được <b>toàn bộ {lt.rieng.length}</b> bài toán này.
            </div>
          )}
        </Panel>
      </div>
      {moLtModal && (
        <LyThuyetModal ma={moLtModal.id} ten={moLtModal.ten} current={moLtMap[moLtModal.id] as any} api={api.hinhMoHinhLyThuyet as any}
          onClose={() => setMoLtModal(null)} onSaved={() => { setMoLtModal(null); napMoLt() }} />
      )}
    </>
  )
}

// ══════════════════ SƠ ĐỒ TÂM–VỆ TINH ══════════════════
// Hệ sinh thái của MỘT mô hình: mô hình làm TÂM, các bài toán phụ thuộc xếp thành vòng VỆ TINH quanh nó,
// nối bằng nan hoa. Đây là quan hệ mô hình↔bài toán (khác lưới bài toán = bài↔bài, khác view tổng = mô
// hình↔mô hình). Nhiều bài toán → vòng đông; đủ dùng cho quy mô một mô hình.
function RadialEco({ L, mh, nodes, maCap }: { L: Luoi; mh: MoHinh; nodes: BaiToan[]; maCap: Map<string, string> }) {
  const W = 298, H = 298, cx = W / 2, cy = H / 2   // vừa panel detail 330px (trừ padding)
  const N = nodes.length
  const r = 98
  const pts = nodes.map((n, i) => {
    const ang = -Math.PI / 2 + (N === 1 ? 0 : (i * 2 * Math.PI) / N)   // bài đầu ở đỉnh (12h), quay theo chiều kim
    return { n, x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) }
  })
  const anh = api.anhCauHinhCua(L, mh.id)
  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg className="pointer-events-none absolute inset-0" width={W} height={H}>
        {pts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#5eccb0" strokeWidth="1.4" />)}
      </svg>
      {/* TÂM = mô hình */}
      <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-[1.5px] border-teal-400 bg-white shadow"
        style={{ left: cx, top: cy, width: 108 }}>
        <div className="h-14 border-b border-slate-100 bg-slate-50">
          {anh ? <img src={anh} alt="" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center text-[9px] text-slate-300">chưa có hình</div>}
        </div>
        <div className="px-1.5 py-1 text-center">
          <MaPill code={maCap.get(mh.id) ?? '?'} size="sm" />
          <div className="mt-0.5 line-clamp-1 text-[10.5px] font-semibold text-slate-700"><MathText>{mh.ten}</MathText></div>
        </div>
      </div>
      {/* VỆ TINH = bài toán phụ thuộc */}
      {pts.map((p) => (
        <div key={p.n.id} title={tron(p.n.phat_bieu)}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-blue-300 bg-white px-1.5 py-1 shadow-sm"
          style={{ left: p.x, top: p.y, width: 86 }}>
          <div className="mb-0.5 flex items-center gap-1"><Cap cap={p.n.cap} /><Ma>{p.n.ma}</Ma></div>
          <div className="line-clamp-2 text-[10px] leading-tight text-slate-700"><MathText>{p.n.phat_bieu}</MathText></div>
        </div>
      ))}
    </div>
  )
}
