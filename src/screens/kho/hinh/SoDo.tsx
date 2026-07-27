// M1 + M2 — sơ đồ của MỘT HỌ, hai view (toggle). Cùng một graph 3D chiếu thành 2 mặt phẳng:
//
//   VIEW BÀI TOÁN  — chiếu bỏ trục giả thiết → còn TRỤC SUY LUẬN.
//                    Cột = CẤP (toàn cục, KHÔNG reset theo mô hình). Cạnh = tiền đề.
//                    Node của mô hình con nằm NGAY TRONG CÙNG CỘT, chỉ khác viền teal.
//   VIEW MÔ HÌNH   — chiếu bỏ trục suy luận → còn TRỤC GIẢ THIẾT. Cột = tầng (độ sâu).
//
// Vì sao phải hai view: xếp cha–con giữa các BÀI là sai (10 bài hỏi 10 phương diện của
// cùng một cấu hình thì không có quan hệ cha–con) — chính chỗ đó đẻ ra khái niệm mô hình.
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi, MoHinh, Y, Bai } from '../../../lib/kho/hinh'
import { MathText } from '../ui'
import { Btn, Cap, Empty, Fig, KV, Ma, Panel, Seg, Sol, Tag, tron } from './hinhUi'
import { FormMoHinh } from './Ho'
import FormBaiToan from './FormBaiToan'
import type { Nhay } from './KhoHinhScreen'

/** Dải cấp gọn: 4–4 đọc thừa, chỉ in 4. */
export const dai = (ns: number[]) => (Math.min(...ns) === Math.max(...ns) ? String(ns[0]) : `${Math.min(...ns)}–${Math.max(...ns)}`)

const COL_W = 206, GAP = 40, NODE_H = 56, ROW_GAP = 12, MH_W = 224, MH_H = 118

export default function SoDo({ L, khoi, hoId, di, reload, moTaNode, nodeId }: {
  L: Luoi; khoi: string; hoId: string | null; di: (n: Nhay) => void; reload: () => Promise<void>
  moTaNode?: string; nodeId?: string
}) {
  const gocs = L.moHinh.filter((m) => m.la_goc_ho)
  const ho = (hoId && L.moHinh.find((m) => m.id === hoId)) || gocs[0] || null
  const [view, setView] = useState<'bt' | 'mh'>('bt')
  const [chonBt, setChonBt] = useState<string | null>(nodeId ?? null)
  const [chonMh, setChonMh] = useState<string | null>(null)
  const [formBt, setFormBt] = useState<{ sua?: BaiToan; goi?: string } | null>(moTaNode ? { goi: moTaNode } : null)
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
        ? <ViewBaiToan L={L} ho={ho} nodes={nodes} chon={chonBt} setChon={setChonBt} onSua={(b) => setFormBt({ sua: b })} />
        : <ViewMoHinh L={L} ho={ho} trongHo={trongHo} chon={chonMh ?? ho.id} setChon={setChonMh} onSua={(m) => setFormMh({ sua: m })} onThemCon={(id) => setFormMh({ cha: id })} reload={reload} />}

      {formBt && <FormBaiToan L={L} moHinhMacDinh={chonMh ?? ho.id} sua={formBt.sua} phatBieuGoi={formBt.goi}
        onClose={() => setFormBt(null)} onDone={reload} />}
      {formMh && <FormMoHinh L={L} khoiMacDinh={khoi} chaMacDinh={formMh.cha} sua={formMh.sua} onClose={() => setFormMh(null)} onDone={reload} />}
    </>
  )
}

// ══════════════════ VIEW BÀI TOÁN — cột = CẤP ══════════════════
function ViewBaiToan({ L, ho, nodes, chon, setChon, onSua }: {
  L: Luoi; ho: MoHinh; nodes: BaiToan[]; chon: string | null; setChon: (id: string | null) => void; onSua: (b: BaiToan) => void
}) {
  // MỐC so sánh "mô hình con" = mô hình NÔNG NHẤT thực sự có bài toán, KHÔNG phải gốc họ.
  // Gốc họ có thể rỗng (vd "Tam giác nhọn" chưa khai bài toán nào) — lấy nó làm mốc thì mọi node
  // đều hoá teal, mất hẳn tín hiệu "node này cần THÊM giả thiết".
  const mocGoc = useMemo(() => {
    let best: string | null = null, bestD = Infinity
    for (const mid of new Set(nodes.map((n) => n.mo_hinh_id))) {
      const d = api.doSauTrongHo(L, mid)
      if (d < bestD) { bestD = d; best = mid }
    }
    return best ?? ho.id
  }, [nodes, L, ho])
  const sauMoc = api.doSauTrongHo(L, mocGoc)
  const { cots, pos, cao, rong } = useMemo(() => {
    const caps = [...new Set(nodes.map((n) => n.cap))].sort((a, b) => a - b)
    const cots = caps.map((c) => ({ cap: c, ns: nodes.filter((n) => n.cap === c).sort((a, b) => a.ma.localeCompare(b.ma)) }))
    const pos = new Map<string, { x: number; y: number }>()
    cots.forEach((col, i) => col.ns.forEach((n, j) => pos.set(n.id, { x: i * (COL_W + GAP), y: j * (NODE_H + ROW_GAP) })))
    const cao = Math.max(120, ...cots.map((c) => c.ns.length * (NODE_H + ROW_GAP)))
    return { cots, pos, cao, rong: Math.max(600, cots.length * (COL_W + GAP) - GAP) }
  }, [nodes])

  // Cạnh = tiền đề (theo cách mặc định). Xuyên mô hình ⇒ nét đứt teal (§4 M1).
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

  const bt = chon ? L.baiToan.find((b) => b.id === chon) ?? null : null

  return (
    <>
      <p className="mb-3 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        Chiếu bỏ trục giả thiết → còn <b>trục suy luận</b>. Cột = <b>cấp</b>. Node của mô hình con hiện{' '}
        <span className="text-teal-700">viền teal</span> ngay trong cùng cột — cấp là <b>toàn cục</b>, không reset theo mô hình.
        Mốc so sánh là <b>{L.moHinh.find((m) => m.id === mocGoc)?.ten}</b> (mô hình nông nhất có bài toán).
      </p>
      <div className="grid items-start gap-4 lg:grid-cols-[1fr_330px]">
        <div className="min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3.5">
          {!nodes.length
            ? <Empty icon="◈">Họ này chưa có bài toán nhỏ nào. Bấm <b>＋ Node</b> — lưới trước, gán sau.</Empty>
            : (
              <div style={{ width: rong }}>
                <div className="mb-2 flex" style={{ gap: GAP }}>
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
                    {canh.map((e, i) => (
                      <path key={i} fill="none"
                        d={`M${e.x1},${e.y1} C${e.x1 + GAP * 0.6},${e.y1} ${e.x2 - GAP * 0.6},${e.y2} ${e.x2},${e.y2}`}
                        stroke={e.xuyen ? '#14b8a6' : '#94a3b8'} strokeWidth={e.sang ? 2.2 : 1.3}
                        strokeDasharray={e.xuyen ? '5 3' : undefined}
                        markerEnd={`url(#${e.xuyen ? 'hh-arm' : 'hh-ar'})`} opacity={e.sang ? 1 : 0.75} />
                    ))}
                  </svg>
                  {nodes.map((n) => {
                    const p = pos.get(n.id)!
                    const khac = api.doSauTrongHo(L, n.mo_hinh_id) > sauMoc   // node cần THÊM giả thiết
                    const mh = L.moHinh.find((m) => m.id === n.mo_hinh_id)
                    return (
                      <button key={n.id} onClick={() => setChon(n.id)}
                        style={{ left: p.x, top: p.y, width: COL_W, height: NODE_H }}
                        className={`absolute overflow-hidden rounded-lg border bg-white px-2.5 py-1.5 text-left text-[11.5px] leading-tight transition ${
                          khac ? 'border-teal-300 bg-teal-50/40' : 'border-blue-300'
                        } ${chon === n.id ? 'shadow-md ring-2 ring-blue-400/40' : 'hover:shadow-sm'}`}>
                        <div className="line-clamp-2 text-slate-700"><MathText>{n.phat_bieu}</MathText></div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Cap cap={n.cap} teal={khac} />
                          <Ma>{n.ma}</Ma>
                          {khac && mh && <span className="truncate rounded-full border border-teal-300 bg-teal-50 px-1.5 text-[9.5px] text-teal-700">{mh.ma}</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
        </div>

        {bt ? <DetailBaiToan L={L} bt={bt} onSua={() => onSua(bt)} onChon={setChon} />
          : <Panel label="Detail — node đang chọn"><div className="py-6 text-center text-[12.5px] text-slate-400">Bấm một node để xem chi tiết.</div></Panel>}
      </div>
    </>
  )
}

function DetailBaiToan({ L, bt, onSua, onChon }: { L: Luoi; bt: BaiToan; onSua: () => void; onChon: (id: string) => void }) {
  const mh = L.moHinh.find((m) => m.id === bt.mo_hinh_id)
  const cachs = api.cachCua(L, bt.id)
  const goi = api.capGoiY(L, bt.id)
  const lech = bt.cap - goi
  const mucDo = api.mucDoCua(L, bt.id)
  const cachMd = api.cachMacDinh(L, bt.id)
  const [ys, setYs] = useState<{ y: Y; bai: Bai }[]>([])
  useEffect(() => { api.yTheoNode(bt.id).then(setYs).catch(() => setYs([])) }, [bt.id])

  return (
    <Panel label="Detail — node đang chọn">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="text-[13.5px] font-semibold text-slate-900"><MathText>{bt.phat_bieu}</MathText></div>
        <Btn onClick={onSua} className="h-7 shrink-0 px-2">✎</Btn>
      </div>
      <KV k="Mã · cấp"><Ma>{bt.ma}</Ma> · <b>cấp {bt.cap}</b>{mucDo && <span className="ml-1.5 text-slate-400">độ khó {mucDo}</span>}</KV>
      <KV k="Cấp gợi ý">
        {goi}
        {lech !== 0 && (
          <span className="ml-1.5 rounded-md bg-amber-100 px-1.5 py-px text-[11px] font-medium text-amber-800"
            title="1 + max(cấp tiền đề) theo cách mặc định — chỉ đối chiếu, không ghi đè cấp nhập tay">
            ⚠ lệch {lech > 0 ? '+' : ''}{lech}
          </span>
        )}
      </KV>
      <KV k="Mô hình">{mh && <Tag ton="mh">◇ {mh.ma} · {mh.ten}</Tag>}</KV>
      {cachMd && <KV k="Dạng"><Tag ton="dg">{api.tenDangDayDu(L, cachMd.dang_id)}</Tag></KV>}

      {cachs.map((c) => {
        const td = api.tienDeCuaCach(L, c.id), bd = api.boDeCuaCach(L, c.id)
        return (
          <div key={c.id} className="mb-2 rounded-lg border border-slate-200 p-2">
            <div className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
              {c.ten ?? 'cách giải'} {c.la_mac_dinh && <span className="rounded bg-slate-100 px-1.5 text-[10px] text-slate-500">mặc định</span>}
            </div>
            {/* Tiền đề của MỘT cách = AND: cần CẢ. Vẽ dấu "+" giữa các tiền đề để không đọc nhầm là "một trong số". */}
            <div className="flex flex-wrap items-center gap-1">
              {td.length > 1 && <span className="mr-0.5 text-[10.5px] font-semibold text-slate-500">cần cả</span>}
              {td.map((id, i) => {
                const b = L.baiToan.find((x) => x.id === id)
                return b ? (
                  <span key={id} className="flex items-center gap-1">
                    {i > 0 && <span className="font-bold text-slate-400">+</span>}
                    <Tag ton="bt" onClick={() => onChon(b.id)}>◈ {b.ma} · c{b.cap}</Tag>
                  </span>
                ) : null
              })}
              {bd.map((id) => {
                const b = L.boDe.find((x) => x.id === id)
                return b ? <Tag key={id} ton="bd">◦ {b.ten}</Tag> : null
              })}
              {!td.length && !bd.length && <span className="text-[11.5px] text-slate-400">chưa nối tiền đề (cổng 2)</span>}
            </div>
          </div>
        )
      })}

      <p className="mb-1.5 mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Đề bài chuẩn</p>
      <Sol>{bt.de_bai_chuan}</Sol>
      <p className="mb-1.5 mt-2.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Đáp án đầy đủ</p>
      <Sol>{cachMd?.loi_giai}</Sol>
      {(bt.anh_chuan || cachMd?.anh_loi_giai) && (
        <div className="mt-2"><Fig src={cachMd?.anh_loi_giai ?? bt.anh_chuan} cap="Hình chuẩn của node" /></div>
      )}

      <p className="mb-1.5 mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Ý thực tế đang trỏ tới node · {ys.length}</p>
      {ys.length
        ? ys.slice(0, 8).map(({ y, bai }) => (
          <div key={y.id} className="flex items-center gap-2 py-0.5 text-[12px] text-slate-600">
            <Ma>{bai.ma_bai}</Ma>
            <span className="truncate">ý {y.nhan_hien_thi ?? y.thu_tu} · {bai.nguon ?? 'chưa rõ nguồn'}</span>
          </div>
        ))
        : <div className="text-[12px] text-slate-400">— chưa bài thật nào dùng node này —</div>}
    </Panel>
  )
}

// ══════════════════ VIEW MÔ HÌNH — cột = TẦNG ══════════════════
function ViewMoHinh({ L, ho, trongHo, chon, setChon, onSua, onThemCon, reload }: {
  L: Luoi; ho: MoHinh; trongHo: Set<string>; chon: string; setChon: (id: string) => void
  onSua: (m: MoHinh) => void; onThemCon: (id: string) => void; reload: () => Promise<void>
}) {
  const { cots, pos, cao, rong } = useMemo(() => {
    const ds = L.moHinh.filter((m) => trongHo.has(m.id))
    const sau = new Map(ds.map((m) => [m.id, api.doSauTrongHo(L, m.id)]))
    const tang = [...new Set([...sau.values()])].sort((a, b) => a - b)
    const cots = tang.map((t) => ({ tang: t, ms: ds.filter((m) => sau.get(m.id) === t) }))
    const pos = new Map<string, { x: number; y: number }>()
    cots.forEach((c, i) => c.ms.forEach((m, j) => pos.set(m.id, { x: i * (MH_W + GAP), y: j * (MH_H + ROW_GAP) })))
    return {
      cots, pos,
      cao: Math.max(140, ...cots.map((c) => c.ms.length * (MH_H + ROW_GAP))),
      rong: Math.max(560, cots.length * (MH_W + GAP) - GAP),
    }
  }, [L, trongHo])

  const mh = L.moHinh.find((m) => m.id === chon) ?? ho
  const lt = api.lyThuyetCuaMoHinh(L, mh.id)
  const con = api.conCua(L, mh.id).map((id) => L.moHinh.find((m) => m.id === id)!).filter(Boolean)
  const theoCap = new Map<number, BaiToan[]>()
  for (const b of lt.rieng) { const a = theoCap.get(b.cap) ?? []; a.push(b); theoCap.set(b.cap, a) }

  return (
    <>
      <p className="mb-3 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        Chiếu bỏ trục suy luận → còn <b>trục giả thiết</b>. Cột = <b>tầng</b> (độ sâu trong họ).
        Detail của card = <b>danh sách bài toán</b> trong mô hình đó. Độ sâu chỉ để <b>định vị cấu trúc</b> — độ khó đến từ cấp.
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
                {L.canh.filter((e) => pos.has(e.cha_id) && pos.has(e.mo_hinh_id)).map((e, i) => {
                  const a = pos.get(e.cha_id)!, b = pos.get(e.mo_hinh_id)!
                  const x1 = a.x + MH_W, y1 = a.y + MH_H / 2, x2 = b.x, y2 = b.y + MH_H / 2
                  return <path key={i} fill="none" d={`M${x1},${y1} C${x1 + GAP * 0.6},${y1} ${x2 - GAP * 0.6},${y2} ${x2},${y2}`}
                    stroke="#14b8a6" strokeWidth="1.5" markerEnd="url(#hh-arm2)" />
                })}
                <defs>
                  <marker id="hh-arm2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L6.5,3 L0,6" fill="none" stroke="#14b8a6" strokeWidth="1.3" />
                  </marker>
                </defs>
              </svg>
              {L.moHinh.filter((m) => trongHo.has(m.id)).map((m) => {
                const p = pos.get(m.id)!
                const n = L.baiToan.filter((b) => b.mo_hinh_id === m.id)
                const caps = n.map((b) => b.cap)
                return (
                  <button key={m.id} onClick={() => setChon(m.id)} style={{ left: p.x, top: p.y, width: MH_W, height: MH_H }}
                    className={`absolute overflow-hidden rounded-xl border-[1.5px] border-teal-300 bg-white text-left transition ${
                      chon === m.id ? 'ring-[3px] ring-teal-300/50' : 'hover:shadow-sm'}`}>
                    <div className="h-14 border-b border-slate-100 bg-slate-50/50">
                      {m.anh_cau_hinh
                        ? <img src={m.anh_cau_hinh} alt="" className="h-full w-full bg-white object-contain" />
                        : <div className="flex h-full items-center justify-center text-[10.5px] text-slate-300">chưa có hình</div>}
                    </div>
                    <div className="px-2.5 py-1.5">
                      <Ma>{m.ma}</Ma>
                      <div className="truncate text-[12.5px] font-semibold text-slate-800"><MathText>{m.ten}</MathText></div>
                      <div className="flex gap-2.5 text-[11px] text-slate-400">
                        <span><b className="text-slate-700">{n.length}</b> bài toán</span>
                        {caps.length > 0 && <span>cấp <b className="text-slate-700">{dai(caps)}</b></span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <Panel label="Detail — mô hình đang chọn">
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <div className="text-[14px] font-semibold text-slate-900">{mh.ma} · <MathText>{mh.ten}</MathText></div>
            <div className="flex shrink-0 gap-1">
              <Btn onClick={() => onSua(mh)} className="h-7 px-2" title="Sửa mô hình">✎</Btn>
              <Btn onClick={async () => {
                if (!confirm(`Xoá mô hình ${mh.ma} · ${tron(mh.ten)}?`)) return
                try { await api.deleteMoHinh(mh.id); setChon(ho.id); await reload() } catch (e: any) { alert(e.message) }
              }} className="h-7 px-2 border-rose-300 text-rose-600 hover:bg-rose-50" title="Xoá mô hình">🗑</Btn>
            </div>
          </div>
          <div className="mb-2.5 rounded-md bg-teal-50/70 px-2.5 py-2 text-[12px] leading-relaxed text-slate-600">
            <b className="text-teal-700">{mh.gia_thiet_them ? '+ Giả thiết:' : 'Giả thiết:'}</b>{' '}
            <MathText>{mh.gia_thiet_them || mh.gia_thiet}</MathText>
          </div>
          <Fig src={mh.anh_cau_hinh} cap="Hình cấu hình" />

          <p className="mb-1.5 mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
            Bài toán trong mô hình này · {lt.rieng.length}
          </p>
          {[...theoCap.keys()].sort((a, b) => a - b).map((c) => (
            <div key={c}>
              <div className="mb-0.5 mt-1.5 text-[10.5px] font-semibold text-slate-400">CẤP {c}</div>
              {theoCap.get(c)!.map((b) => (
                <div key={b.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-[12.5px] hover:bg-slate-50">
                  <Cap cap={b.cap} /><span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span><Ma>{b.ma}</Ma>
                </div>
              ))}
            </div>
          ))}
          {!lt.rieng.length && <div className="text-[12px] text-slate-400">— mô hình này chưa có bài toán nào (vùng chưa khai thác) —</div>}

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
          <Btn className="mt-2.5 w-full justify-center" onClick={() => onThemCon(mh.id)}>＋ Mô hình con của {mh.ma}</Btn>
        </Panel>
      </div>
    </>
  )
}
