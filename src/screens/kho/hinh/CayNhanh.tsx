// CÂY NHÁNH BÀI (spec-hinh-cay-nhanh.md §4) — một mô hình = một cây: thân 1.1 → 1.2 …, rẽ nhánh từ bài mẹ.
// Hai tab đọc CÙNG dữ liệu: ① Chuỗi (cây xếp chỗ, chỉ xuống · sang phải) · ② Nhóm (card lồng nhau).
// Thẻ tối giản; bấm thẻ bài ⇒ popup đề · hình · đáp án.
// Số hiển thị / giả thiết hiệu lực / cờ sai nhánh đều lấy từ hàm Postgres (lib/kho/hinhCay.ts) — màn chỉ vẽ.
// Sau mutation: VÁ tại chỗ từ kết quả RPC (CLAUDE.md §2), không quét lại danh sách.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi, MoHinh } from '../../../lib/kho/hinh'
import type { BaiCay, KetQuaCay } from '../../../lib/kho/hinhCay'
import { MathText } from '../ui'
import { Btn, Empty, Fig, Ma, Note, Seg, inpCls, tron } from './hinhUi'

type BaiX = BaiToan & { so: string }
const NHO: { gocId: string | null; tab: 'chuoi' | 'nhom'; gap: Record<string, string[]>; mo: boolean; cuon: Record<string, [number, number]>; tim: string } =
  { gocId: null, tab: 'chuoi', gap: {}, mo: true, cuon: {}, tim: '' }

// màu theo độ sâu nhánh (0 = thân). Thẻ giả thiết thêm = khối màu ĐẶC; dải làn + viền thẻ bài = tông nhạt.
const MAU = [
  { dac: '#0d9488', nhat: '#f0fdfa', vien: '#5eead4' },   // thân — teal
  { dac: '#2563eb', nhat: '#eff6ff', vien: '#93c5fd' },   // sâu 1 — xanh
  { dac: '#7c3aed', nhat: '#f5f3ff', vien: '#c4b5fd' },   // sâu 2 — tím
  { dac: '#b45309', nhat: '#fffbeb', vien: '#fcd34d' },   // sâu 3 — hổ phách
  { dac: '#be123c', nhat: '#fff1f2', vien: '#fda4af' },   // sâu 4+ — hồng
]
const mau = (d: number) => MAU[Math.min(d, MAU.length - 1)]
const LUC_GIAC = 'polygon(9% 0,91% 0,100% 50%,91% 100%,9% 100%,0 50%)'
const W = 156, H = 46, COL = 176, ROW = 64, PH = 38, OX = 14, OY = 10
const px = (c: number) => OX + c * COL, py = (r: number) => OY + r * ROW
const soSanhSo = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })

export default function CayNhanh({ L, khoi, reload }: { L: Luoi; khoi: string; reload: () => Promise<void> }) {
  const goc = useMemo(() => api.gocCayCua(L), [L])
  const [gocId, setGocIdRaw] = useState<string | null>(() => (NHO.gocId && goc.some((m) => m.id === NHO.gocId) ? NHO.gocId : null))
  const [tim, setTim] = useState(NHO.tim)
  const [tab, setTab] = useState(NHO.tab)
  const [nhanhs, setNhanhs] = useState<MoHinh[]>([])
  const [bais, setBais] = useState<BaiX[]>([])
  const [sai, setSai] = useState<Map<string, string[]>>(new Map())      // bài → các tiền đề sai nhánh
  const [gapLai, setGapLai] = useState<Set<string>>(new Set())
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [cur, setCur] = useState<string | null>(null)                    // bài đang chọn (tập trung)
  const [pop, setPop] = useState<string | null>(null)                    // bài đang mở popup
  const [mo, setMo] = useState(NHO.mo)
  const [dangTai, setDangTai] = useState(false)
  const [ban, setBan] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)
  const [hopRe, setHopRe] = useState<{ ten: string; gt: string } | null>(null)
  const LRef = useRef(L); LRef.current = L
  const khung = useRef<HTMLDivElement>(null)

  const setGocId = (id: string | null) => { NHO.gocId = id; setGocIdRaw(id) }
  useEffect(() => { NHO.tab = tab }, [tab])
  useEffect(() => { NHO.mo = mo }, [mo])
  useEffect(() => { NHO.tim = tim }, [tim])
  useEffect(() => { if (gocId) NHO.gap[gocId] = [...gapLai] }, [gapLai, gocId])
  const bao = (s: string) => { setThongBao(s); window.setTimeout(() => setThongBao((x) => (x === s ? null : x)), 2600) }

  // ── nạp cây khi ĐỔI gốc (đổi ngữ cảnh ⇒ reset là đúng) ──
  useEffect(() => {
    setSel(new Set()); setCur(null); setPop(null); setLoi(null)
    if (!gocId) { setNhanhs([]); setBais([]); setSai(new Map()); return }
    const Lc = LRef.current
    const ns = api.nhanhCuaCay(Lc.moHinh, Lc.baiToan, gocId)
    const ids = new Set(ns.map((n) => n.id))
    const bs = Lc.baiToan.filter((b) => ids.has(b.mo_hinh_id))
    setNhanhs(ns); setBais(bs.map((b) => ({ ...b, so: '' }))); setGapLai(new Set(NHO.gap[gocId] ?? []))
    let huy = false
    setDangTai(true)
    Promise.all([api.soHienThiCay(gocId), api.saiNhanhCay(gocId)]).then(([so, s]) => {
      if (huy) return
      const m = new Map(so.map((r) => [r.id, r.so]))
      setBais((prev) => prev.map((b) => ({ ...b, so: m.get(b.id) ?? '' })))
      setSai(gomSai(s))
    }).catch((e) => { if (!huy) setLoi(e.message ?? String(e)) }).finally(() => { if (!huy) setDangTai(false) })
    return () => { huy = true }
  }, [gocId])

  // ── suy cấu trúc để VẼ ──
  const baiById = useMemo(() => new Map(bais.map((b) => [b.id, b])), [bais])
  const nhanhById = useMemo(() => new Map(nhanhs.map((n) => [n.id, n])), [nhanhs])
  const lan = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const n of nhanhs) m.set(n.id, [])
    ;[...bais].sort((a, b) => (a.thu_tu ?? 1e9) - (b.thu_tu ?? 1e9) || a.ma.localeCompare(b.ma))
      .forEach((b) => m.get(b.mo_hinh_id)?.push(b.id))
    return m
  }, [bais, nhanhs])
  const chaCua = useCallback((nid: string): string | null => {
    const neo = nhanhById.get(nid)?.neo_baitoan_id
    return neo ? baiById.get(neo)?.mo_hinh_id ?? null : null
  }, [nhanhById, baiById])
  const duong = useCallback((nid: string): string[] => {            // [gốc … nhánh]
    const a: string[] = []
    for (let c: string | null = nid, i = 0; c && i < 64; c = chaCua(c), i++) a.unshift(c)
    return a
  }, [chaCua])
  const doSau = useCallback((nid: string) => duong(nid).length - 1, [duong])
  const conCuaNhanh = useCallback((nid: string) => nhanhs
    .filter((n) => n.neo_baitoan_id && baiById.get(n.neo_baitoan_id)?.mo_hinh_id === nid)
    .sort((a, b) => soSanhSo(baiById.get(a.neo_baitoan_id!)?.so ?? '', baiById.get(b.neo_baitoan_id!)?.so ?? '') || (a.thu_tu ?? 0) - (b.thu_tu ?? 0)),
  [nhanhs, baiById])
  const baiCaNhanh = useCallback((nid: string): number => {
    let n = lan.get(nid)?.length ?? 0
    for (const c of conCuaNhanh(nid)) n += baiCaNhanh(c.id)
    return n
  }, [lan, conCuaNhanh])
  const coSai = useCallback((nid: string): boolean =>
    (lan.get(nid) ?? []).some((b) => sai.has(b)) || conCuaNhanh(nid).some((c) => coSai(c.id)), [lan, sai, conCuaNhanh])
  const conCu = useMemo(() => (gocId ? L.canh.filter((c) => c.cha_id === gocId).map((c) => c.mo_hinh_id).filter((id) => goc.some((m) => m.id === id)) : []), [L.canh, gocId, goc])

  // ── vá sau RPC ──
  const va = async (kq: KetQuaCay, nhanhDoi?: string) => {
    const m = new Map<string, BaiCay>(kq.bai.map((r) => [r.id, r]))
    setBais((prev) => prev.map((b) => { const r = m.get(b.id); return r ? { ...b, so: r.so, mo_hinh_id: r.mo_hinh_id, thu_tu: r.thu_tu } : b }))
    const canLay = [kq.nhanh_moi, nhanhDoi].filter(Boolean) as string[]
    if (canLay.length) {
      const moi = (await Promise.all(canLay.map((id) => api.layMoHinh(id)))).filter(Boolean) as MoHinh[]
      setNhanhs((prev) => { const ids = new Set(moi.map((x) => x.id)); return [...prev.filter((n) => !ids.has(n.id)), ...moi] })
    }
    api.saiNhanhCay(kq.goc).then((s) => setSai(gomSai(s))).catch(() => {})   // nền — không xoá gì trong lúc chờ
    void reload()                                                             // nền — cho các màn khác thấy lưới mới
  }
  const chay = async (f: () => Promise<KetQuaCay>, xong: string, nhanhDoi?: string) => {
    if (ban) return
    setBan(true); setLoi(null)
    try { const kq = await f(); await va(kq, nhanhDoi); bao(xong) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(false) }
  }
  const reNhanh = () => {
    if (!hopRe) return
    const ids = [...sel]
    void chay(() => api.reNhanh(ids, hopRe.ten, hopRe.gt), `Đã rẽ ${ids.length} bài thành nhánh mới`).then(() => { setSel(new Set()); setHopRe(null) })
  }
  const chuyen = (baiId: string, nhanhId: string) => chay(() => api.chuyenBaiCay(baiId, nhanhId), 'Đã chuyển bài — số hiển thị tính lại, mã giữ nguyên')
  const doiThuTu = (baiId: string, viTri: number) => chay(() => api.doiThuTuCay(baiId, viTri), 'Đã đổi thứ tự')
  const doiNeo = (nhanhId: string, baiId: string) => chay(() => api.doiNeoCay(nhanhId, baiId), 'Đã dời nhánh sang bài mẹ mới', nhanhId)
  const suaNhanh = async (id: string, v: { ten: string; gia_thiet_them: string | null }) => {
    try {
      await api.suaNhanh(id, v)
      setNhanhs((prev) => prev.map((n) => (n.id === id ? { ...n, ...v } : n)))
      bao('Đã lưu nhánh'); void reload()
    } catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  const batGap = (id: string) => setGapLai((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── danh sách gốc cây (trái) ──
  const gocLoc = goc.filter((m) => !tim.trim() || `${m.ma} ${tron(m.ten)}`.toLowerCase().includes(tim.trim().toLowerCase()))
  const gocMH = gocId ? nhanhById.get(gocId) ?? goc.find((m) => m.id === gocId) ?? null : null

  return (
    <div className="flex h-full min-h-0 gap-4">
      <aside className="w-[230px] shrink-0">
        <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình · khối {khoi}</div>
        <input className={inpCls} placeholder="Tìm mô hình…" value={tim} onChange={(e) => setTim(e.target.value)} />
        <div className="mt-2 max-h-[calc(100vh-230px)] space-y-1 overflow-y-auto pr-1">
          {gocLoc.map((m) => (
            <button key={m.id} onClick={() => setGocId(m.id)}
              className={`block w-full rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition ${
                gocId === m.id ? 'border-teal-400 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
              <Ma>{m.ma}</Ma>
              <div className="truncate font-medium">{tron(m.ten)}</div>
            </button>
          ))}
          {!gocLoc.length && <div className="px-2 py-4 text-[12px] text-slate-400">Không có mô hình nào.</div>}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {!gocMH ? <Empty icon="🌿">Chọn một mô hình ở bên trái để xem cây bài của nó.</Empty> : (
          <>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-[18px] font-semibold text-slate-900">{tron(gocMH.ten)}</h1>
              <Ma>{gocMH.ma}</Ma>
              <span className="text-[12px] text-slate-400">{bais.length} bài · {nhanhs.length - 1} nhánh{sai.size ? ` · ${sai.size} sai nhánh` : ''}{dangTai ? ' · đang tính số…' : ''}</span>
            </div>
            <div className="mb-3 rounded-lg px-2.5 py-1.5 text-[12.5px] text-white" style={{ background: MAU[0].dac }}>
              <b>Giả thiết mô hình:</b> <MathText className="inline">{gocMH.gia_thiet || '—'}</MathText>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Seg value={tab} onChange={setTab} options={[{ v: 'chuoi', label: '① Chuỗi' }, { v: 'nhom', label: '② Nhóm' }]} />
              <Btn kind="pri" disabled={!sel.size || ban} onClick={() => setHopRe({ ten: '', gt: '' })}
                title="Tạo nhánh mới neo vào bài đứng ngay trước bài đầu được chọn">⑂ Rẽ nhánh từ bài đứng trước ({sel.size})</Btn>
              {tab === 'chuoi' && <>
                <Btn onClick={() => setGapLai(new Set(nhanhs.filter((n) => n.id !== gocId).map((n) => n.id)))}>▸ Gập hết</Btn>
                <Btn onClick={() => setGapLai(new Set())}>▾ Mở hết</Btn>
                <label className="flex cursor-pointer items-center gap-1.5 text-[12.5px] text-slate-600">
                  <input type="checkbox" checked={mo} onChange={(e) => setMo(e.target.checked)} /> Mờ phần ngoài đường đi của bài chọn
                </label>
              </>}
              {ban && <span className="text-[12px] text-slate-400">đang lưu…</span>}
            </div>
            {loi && <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{loi} <button className="ml-2 underline" onClick={() => setLoi(null)}>đóng</button></div>}

            {tab === 'chuoi'
              ? <TabChuoi {...{ gocId: gocId!, lan, nhanhs, baiById, nhanhById, gapLai, conCu, sai, sel, cur, mo, duong, doSau, baiCaNhanh, coSai, conCuaNhanh, khung, L }}
                  onTick={(id) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })}
                  onMo={(id) => { setCur(id); setPop(id) }} onGap={batGap} onVaoCon={(id) => setGocId(id)} />
              : <TabNhom {...{ gocId: gocId!, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, ban, bais }}
                  onMo={(id) => { setCur(id); setPop(id) }} onChuyen={chuyen} onThuTu={doiThuTu} onNeo={doiNeo} onSua={suaNhanh} />}

            <Note>
              <b>Số hiển thị ≠ mã.</b> Số (1.6.1) là vị trí trên cây, tự tính lại khi chuyển bài; <b>mã bài không bao giờ đổi</b>.
              Nhánh chỉ đi <b>xuống</b> hoặc <b>sang phải</b>; nhánh ở phía sau được hàng gần thân, nhánh phía trước lùi xuống.
              Bài có <span className="rounded border border-amber-400 bg-amber-50 px-1 text-[10.5px] font-bold text-amber-800">⚠</span> = tiền đề nằm ở nhánh mà bài không thuộc — vẫn lưu được, nhưng không in được.
            </Note>
          </>
        )}
      </div>

      {pop && baiById.get(pop) && (
        <PopupBai L={L} bai={baiById.get(pop)!} nhanhById={nhanhById} baiById={baiById} duong={duong} doSau={doSau}
          saiTienDe={sai.get(pop) ?? []} onDong={() => setPop(null)} onNhay={(id) => { setCur(id); setPop(id) }}
          onSuaSai={(nhanhId) => chuyen(pop, nhanhId)} />
      )}
      {hopRe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5" onClick={() => setHopRe(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-[16px] font-semibold">Rẽ nhánh — {sel.size} bài</h2>
            <p className="mb-3 text-[12.5px] text-slate-500">Nhánh mới neo vào bài đứng ngay trước bài đầu được chọn. Bài chọn mang số của bài mẹ + .1, .2 …</p>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tên nhánh</label>
            <input autoFocus className={inpCls} value={hopRe.ten} onChange={(e) => setHopRe({ ...hopRe, ten: e.target.value })} placeholder="vd: Kẻ DE ⊥ AB" />
            <label className="mb-1 mt-3 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Giả thiết thêm (gõ $…$ cho công thức)</label>
            <textarea className={`${inpCls} h-20`} value={hopRe.gt} onChange={(e) => setHopRe({ ...hopRe, gt: e.target.value })} placeholder="vd: Kẻ $DE \perp AB$ tại $E$." />
            <div className="mt-4 flex justify-end gap-2">
              <Btn onClick={() => setHopRe(null)}>Huỷ</Btn>
              <Btn kind="pri" disabled={ban} onClick={reNhanh}>Rẽ nhánh</Btn>
            </div>
          </div>
        </div>
      )}
      {thongBao && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] text-white shadow-lg">{thongBao}</div>}
    </div>
  )
}

function gomSai(s: { baitoan_id: string; tien_de_id: string }[]) {
  const m = new Map<string, string[]>()
  for (const r of s) m.set(r.baitoan_id, [...(m.get(r.baitoan_id) ?? []), r.tien_de_id])
  return m
}

// ══════════════════ TAB ① CHUỖI ══════════════════
type ChungProps = {
  gocId: string; lan: Map<string, string[]>; nhanhs: MoHinh[]
  baiById: Map<string, BaiX>; nhanhById: Map<string, MoHinh>; sai: Map<string, string[]>; cur: string | null
  doSau: (id: string) => number; baiCaNhanh: (id: string) => number; conCuaNhanh: (id: string) => MoHinh[]
}
function TabChuoi(p: ChungProps & {
  gapLai: Set<string>; conCu: string[]; sel: Set<string>; mo: boolean; duong: (id: string) => string[]; coSai: (id: string) => boolean
  khung: React.RefObject<HTMLDivElement>; L: Luoi
  onTick: (id: string) => void; onMo: (id: string) => void; onGap: (id: string) => void; onVaoCon: (id: string) => void
}) {
  const { gocId, lan, nhanhs, baiById, nhanhById, gapLai, conCu, sai, sel, cur, mo, duong, doSau, baiCaNhanh, coSai, conCuaNhanh, khung, L } = p
  const bc = useMemo(() => {
    const neo = new Map<string, string>()
    for (const n of nhanhs) if (n.id !== gocId && n.neo_baitoan_id) neo.set(n.id, n.neo_baitoan_id)
    const mhCuaBai = new Map([...baiById.values()].map((b) => [b.id, b.mo_hinh_id]))
    return api.xepCay({ gocId, lan, neo, mhCuaBai, gapLai, conCu })
  }, [gocId, lan, nhanhs, baiById, gapLai, conCu])

  // nhớ vị trí cuộn theo gốc
  useEffect(() => {
    const el = khung.current; if (!el) return
    const [x, y] = NHO.cuon[gocId] ?? [0, 0]; el.scrollLeft = x; el.scrollTop = y
    const luu = () => { NHO.cuon[gocId] = [el.scrollLeft, el.scrollTop] }
    el.addEventListener('scroll', luu, { passive: true })
    return () => el.removeEventListener('scroll', luu)
  }, [gocId, khung])

  // tập "đang quan tâm": đường gốc → nhánh của bài chọn + cây con của nhánh đó
  const quanTam = useMemo(() => {
    const b = cur ? baiById.get(cur) : null
    if (!mo || !b) return null
    const s = new Set(duong(b.mo_hinh_id))
    const xuong = (id: string) => { s.add(id); conCuaNhanh(id).forEach((c) => xuong(c.id)) }
    xuong(b.mo_hinh_id)
    return s
  }, [cur, mo, baiById, duong, conCuaNhanh])
  const moCls = (nid: string) => (quanTam && !quanTam.has(nid) ? 'opacity-20' : '')

  const Wd = px(bc.soCot - 1) + W + 24, Ht = py(bc.soHang - 1) + H + 22
  const hop = (o: { c: number; r: number }, laGT = false) => ({ x: px(o.c), y: py(o.r) + (laGT ? (H - PH) / 2 : 0), w: W, h: laGT ? PH : H })
  const than = lan.get(gocId) ?? []

  // dây
  const day: JSX.Element[] = []
  const noi = (a: ReturnType<typeof hop>, b: ReturnType<typeof hop>, key: string, mauDay = '#6b7686', w = 1.8, dash = '', mk = 'a', op = 1) => {
    const cungHang = Math.abs((a.y + a.h / 2) - (b.y + b.h / 2)) < 6
    const d = cungHang ? `M${a.x + a.w},${a.y + a.h / 2} L${b.x - 1},${b.y + b.h / 2}` : `M${a.x + a.w / 2},${a.y + a.h} L${b.x + b.w / 2},${b.y}`
    day.push(<path key={key} d={d} fill="none" stroke={mauDay} strokeWidth={w} strokeDasharray={dash || undefined} markerEnd={`url(#cn-${mk})`} opacity={op} />)
  }
  than.forEach((id, i) => { if (i < than.length - 1) noi(hop(bc.bai.get(id)!), hop(bc.bai.get(than[i + 1])!), 't' + id) })
  if (than.length && conCu.length) noi(hop(bc.bai.get(than[than.length - 1])!), hop(bc.conCu.get(conCu[0])!), 'tc')
  const lienKe = new Set<string>(); than.forEach((id, i) => { if (i) lienKe.add(than[i - 1] + '>' + id) })
  bc.nhanh.forEach((o, nid) => {
    const n = nhanhById.get(nid)!; const me = bc.bai.get(n.neo_baitoan_id!); if (!me) return
    const a = hop(me), b = hop(o, true), op = quanTam && !quanTam.has(nid) ? 0.2 : 1
    const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y, ym = a.y + a.h + (ROW - H) / 2
    day.push(<path key={'r' + nid} d={Math.abs(x1 - x2) < 2 ? `M${x1},${y1} V${y2}` : `M${x1},${y1} V${ym} H${x2} V${y2}`}
      fill="none" stroke="#6b7686" strokeWidth={2.6} markerEnd="url(#cn-a)" opacity={op} />)
    const g = bc.gap.get(nid)
    if (g) { noi(b, hop(g), 'g' + nid, '#6b7686', 1.8, '', 'a', op); return }
    let truoc = b; let idTruoc: string | null = null
    for (const id of lan.get(nid) ?? []) {
      const h = hop(bc.bai.get(id)!); noi(truoc, h, 'c' + id, '#6b7686', 1.8, '', 'a', op)
      if (idTruoc) lienKe.add(idTruoc + '>' + id)
      truoc = h; idTruoc = id
    }
  })
  // tiền đề: chỉ vẽ của bài đang chọn (xanh) + dây sai nhánh (đỏ đứt)
  for (const b of baiById.values()) {
    const q = bc.bai.get(b.id); if (!q) continue
    for (const t of api.tienDeCua(L, b.id)) {
      const pp = bc.bai.get(t); if (!pp || lienKe.has(t + '>' + b.id)) continue
      const bad = (sai.get(b.id) ?? []).includes(t), mine = cur === b.id || cur === t
      if (!bad && !mine) continue
      const A = hop(pp), B = hop(q), x1 = A.x + A.w / 2, y1 = A.y + A.h, x2 = B.x + B.w / 2, y2 = B.y + B.h, yb = Math.max(y1, y2) + 16
      day.push(<path key={'td' + t + b.id} d={`M${x1},${y1} C${x1},${yb} ${x2},${yb} ${x2},${y2 + 1}`} fill="none"
        stroke={bad ? '#dc2626' : '#2563eb'} strokeWidth={bad ? 2 : 1.6} strokeDasharray={bad ? '5 3' : undefined} markerEnd={`url(#cn-${bad ? 'r' : 't'})`} />)
    }
  }

  return (
    <>
      <div ref={khung} className="max-h-[calc(100vh-330px)] min-h-[220px] overflow-auto rounded-xl border border-slate-200 bg-white p-2.5">
        <div className="relative" style={{ width: Wd, height: Ht }}>
          {/* dải làn */}
          <div className={`absolute rounded-xl border border-dashed ${moCls(gocId)}`}
            style={{ left: px(0) - 8, top: py(0) - 6, width: (than.length + conCu.length - 1) * COL + W + 16, height: H + 12, background: MAU[0].nhat, borderColor: MAU[0].vien }} />
          {[...bc.nhanh].map(([nid, o]) => { const m = mau(doSau(nid)); return (
            <div key={'l' + nid} className={`absolute rounded-xl border border-dashed ${moCls(nid)}`}
              style={{ left: px(o.c) - 8, top: py(o.r) - 5, width: (o.len - 1) * COL + W + 16, height: H + 10, background: m.nhat, borderColor: m.vien }} />) })}
          <svg className="pointer-events-none absolute left-0 top-0" width={Wd} height={Ht} style={{ zIndex: 2 }}>
            <defs>
              {[['a', '#6b7686'], ['r', '#dc2626'], ['t', '#2563eb']].map(([k, c]) => (
                <marker key={k} id={`cn-${k}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6" fill="none" stroke={c} strokeWidth="1.4" /></marker>))}
            </defs>
            {day}
          </svg>
          {/* thẻ GIẢ THIẾT THÊM — lục giác màu đặc */}
          {[...bc.nhanh].map(([nid, o]) => { const n = nhanhById.get(nid)!; const m = mau(doSau(nid)); const fo = gapLai.has(nid); const neo = baiById.get(n.neo_baitoan_id!); return (
            <button key={'p' + nid} onClick={() => p.onGap(nid)} title={`${tron(n.gia_thiet_them ?? '')} — bấm để ${fo ? 'mở' : 'gập'}`}
              className={`absolute flex flex-col justify-center px-5 text-left text-white transition hover:brightness-110 ${moCls(nid)}`}
              style={{ left: px(o.c), top: py(o.r) + (H - PH) / 2, width: W, height: PH, background: m.dac, clipPath: LUC_GIAC, zIndex: 3 }}>
              <b className="truncate text-[11.5px] leading-tight">{fo ? '▸' : '▾'} {tron(n.ten)}</b>
              <span className="truncate text-[9.5px] opacity-85">+ giả thiết · rẽ từ {neo?.so || neo?.ma}</span>
            </button>) })}
          {[...bc.gap].map(([nid, o]) => (
            <button key={'g' + nid} onClick={() => p.onGap(nid)}
              className={`absolute flex items-center gap-1.5 rounded-lg border-2 border-dotted border-slate-300 bg-slate-50 px-2 text-[11.5px] text-slate-500 ${moCls(nid)}`}
              style={{ left: px(o.c), top: py(o.r), width: W, height: H, zIndex: 3 }}>
              ▸ <b>{baiCaNhanh(nid)} bài</b> đang gập {coSai(nid) && <span className="rounded border border-amber-400 bg-amber-50 px-1 text-[10px] font-bold text-amber-800">⚠</span>}
            </button>))}
          {/* thẻ BÀI — tối giản */}
          {[...bc.bai].map(([id, o]) => { const b = baiById.get(id)!; const m = mau(doSau(b.mo_hinh_id)); const w = sai.has(id); return (
            <div key={id} onClick={() => p.onMo(id)} title={tron(b.phat_bieu)}
              className={`absolute cursor-pointer overflow-hidden rounded-lg border-[1.5px] px-2 py-[3px] text-[11.5px] leading-tight transition hover:shadow-md ${w ? 'bg-amber-50' : 'bg-white'} ${cur === id ? 'ring-2 ring-blue-400/50' : ''} ${sel.has(id) ? 'outline outline-2 outline-blue-600' : ''} ${moCls(b.mo_hinh_id)}`}
              style={{ left: px(o.c), top: py(o.r), width: W, height: H, borderColor: w ? '#f59e0b' : m.vien, zIndex: 3 }}>
              <div className="flex items-center gap-1">
                <b className="text-[12.5px] text-slate-900">{b.so || '…'}</b>
                {w && <span className="rounded border border-amber-400 bg-amber-100 px-1 text-[9.5px] font-bold text-amber-800">⚠</span>}
                <input type="checkbox" className="ml-auto h-3.5 w-3.5" checked={sel.has(id)} title="Chọn để rẽ nhánh"
                  onClick={(e) => e.stopPropagation()} onChange={() => p.onTick(id)} />
              </div>
              <div className="truncate text-slate-500">{tron(b.phat_bieu)}</div>
            </div>) })}
          {[...bc.conCu].map(([id, o]) => { const m = nhanhs.find((x) => x.id === id) ?? L.moHinh.find((x) => x.id === id); return (
            <button key={'cc' + id} onClick={() => p.onVaoCon(id)}
              className="absolute overflow-hidden rounded-lg border-2 border-dashed border-teal-400 bg-teal-50 px-2 py-[3px] text-left text-[11.5px] leading-tight"
              style={{ left: px(o.c), top: py(o.r), width: W, height: H, zIndex: 3 }}>
              <b className="text-teal-700">Mô hình con ▸</b>
              <div className="truncate text-slate-700">{m ? tron(m.ten) : id}</div>
            </button>) })}
        </div>
      </div>
      <div className="mt-2 text-[11.5px] text-slate-500">
        Thẻ trắng = bài (bấm để xem đề · hình · đáp án) · thẻ lục giác màu = <b>giả thiết thêm</b> khởi tạo nhánh (bấm để gập/mở) · dây xanh = tiền đề của bài đang chọn · đỏ đứt = sai nhánh.
      </div>
    </>
  )
}

// ══════════════════ TAB ② NHÓM ══════════════════
function TabNhom(p: ChungProps & {
  ban: boolean; bais: BaiX[]
  onMo: (id: string) => void; onChuyen: (bai: string, nhanh: string) => void; onThuTu: (bai: string, viTri: number) => void
  onNeo: (nhanh: string, bai: string) => void; onSua: (id: string, v: { ten: string; gia_thiet_them: string | null }) => void
}) {
  const { gocId, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, ban, bais } = p
  const [sua, setSua] = useState<{ id: string; ten: string; gt: string } | null>(null)
  const nhanhXep = useMemo(() => [...nhanhs].sort((a, b) => doSau(a.id) - doSau(b.id) || a.ma.localeCompare(b.ma)), [nhanhs, doSau])
  const baiXep = useMemo(() => [...bais].sort((a, b) => soSanhSo(a.so, b.so)), [bais])

  const Hop = ({ nid }: { nid: string }): JSX.Element => {
    const n = nhanhById.get(nid)!; const d = doSau(nid); const m = mau(d); const cua = lan.get(nid) ?? []
    const laGoc = nid === gocId; const neo = n.neo_baitoan_id ? baiById.get(n.neo_baitoan_id) : null
    return (
      <div className="my-2.5 rounded-xl border-2 p-3" style={{ borderColor: m.vien, background: m.nhat }}>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <b className="text-[13.5px] text-slate-900">{tron(n.ten)}</b>
          <span className="rounded-full px-2 py-px text-[11px] font-semibold text-white" style={{ background: m.dac }}>{laGoc ? 'Thân' : `⑂ rẽ từ ${neo?.so || neo?.ma || '?'}`}</span>
          <Ma>{n.ma}</Ma>
          <span className="text-[11px] text-slate-400">{baiCaNhanh(nid)} bài (cả nhánh con)</span>
          {!laGoc && <button className="ml-auto text-[11.5px] text-blue-600 hover:underline" onClick={() => setSua(sua?.id === nid ? null : { id: nid, ten: n.ten, gt: n.gia_thiet_them ?? '' })}>✎ sửa nhánh</button>}
        </div>
        {!laGoc && sua?.id !== nid && (
          <div className="mb-2 rounded-md px-2 py-1 text-[12px] text-white" style={{ background: m.dac }}>
            <b>+ Giả thiết thêm:</b> <MathText className="inline">{n.gia_thiet_them || '(chưa ghi)'}</MathText>
          </div>)}
        {sua?.id === nid && (
          <div className="mb-2 space-y-1.5 rounded-lg border border-slate-200 bg-white p-2">
            <input className={inpCls} value={sua.ten} onChange={(e) => setSua({ ...sua, ten: e.target.value })} placeholder="Tên nhánh" />
            <textarea className={`${inpCls} h-16`} value={sua.gt} onChange={(e) => setSua({ ...sua, gt: e.target.value })} placeholder="Giả thiết thêm" />
            <div className="flex flex-wrap items-center gap-2">
              <Btn kind="pri" onClick={() => { p.onSua(nid, { ten: sua.ten.trim() || 'Nhánh', gia_thiet_them: sua.gt.trim() || null }); setSua(null) }}>Lưu</Btn>
              <Btn onClick={() => setSua(null)}>Huỷ</Btn>
              <span className="ml-2 text-[11.5px] text-slate-500">Dời nhánh sang bài mẹ:</span>
              <select className={`${inpCls} w-auto`} disabled={ban} value={n.neo_baitoan_id ?? ''} onChange={(e) => { p.onNeo(nid, e.target.value); setSua(null) }}>
                {baiXep.map((b) => <option key={b.id} value={b.id}>{b.so} · {tron(b.phat_bieu).slice(0, 40)}</option>)}
              </select>
            </div>
          </div>)}
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-2">
          <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Bài của {laGoc ? 'thân' : 'nhánh này'} · {cua.length}</div>
          {!cua.length && <div className="text-[11.5px] text-slate-400">— chưa có —</div>}
          {cua.map((id, i) => { const b = baiById.get(id)!; return (
            <div key={id} className={`flex items-center gap-2 rounded-md px-1.5 py-1 text-[12.5px] ${cur === id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
              <b className="w-[58px] shrink-0 cursor-pointer" onClick={() => p.onMo(id)}>{b.so || '…'}</b>
              <div className="min-w-0 flex-1 cursor-pointer truncate" onClick={() => p.onMo(id)}>{tron(b.phat_bieu)}</div>
              {sai.has(id) && <span className="rounded border border-amber-400 bg-amber-50 px-1 text-[10px] font-bold text-amber-800">⚠ sai nhánh</span>}
              <Ma>{b.ma}</Ma>
              <button disabled={ban || i === 0} onClick={() => p.onThuTu(id, i)} className="rounded border border-slate-200 px-1.5 text-slate-500 disabled:opacity-30" title="Lên">↑</button>
              <button disabled={ban || i === cua.length - 1} onClick={() => p.onThuTu(id, i + 2)} className="rounded border border-slate-200 px-1.5 text-slate-500 disabled:opacity-30" title="Xuống">↓</button>
              <select disabled={ban} className="max-w-[170px] rounded-md border border-slate-300 bg-white px-1 py-0.5 text-[11.5px]" value={nid}
                onChange={(e) => p.onChuyen(id, e.target.value)} title="Chuyển sang nhánh…">
                {nhanhXep.map((x) => <option key={x.id} value={x.id}>{'— '.repeat(doSau(x.id))}{x.id === gocId ? 'Thân' : tron(x.ten)}</option>)}
              </select>
            </div>) })}
        </div>
        {conCuaNhanh(nid).map((c) => <Hop key={c.id} nid={c.id} />)}
      </div>
    )
  }
  return <Hop nid={gocId} />
}

// ══════════════════ POPUP BÀI ══════════════════
function PopupBai({ L, bai, nhanhById, baiById, duong, doSau, saiTienDe, onDong, onNhay, onSuaSai }: {
  L: Luoi; bai: BaiX; nhanhById: Map<string, MoHinh>; baiById: Map<string, BaiX>
  duong: (id: string) => string[]; doSau: (id: string) => number; saiTienDe: string[]
  onDong: () => void; onNhay: (id: string) => void; onSuaSai: (nhanhId: string) => void
}) {
  const [gt, setGt] = useState<string | null>(null)
  useEffect(() => {
    let huy = false; setGt(null)
    api.giaThietHieuLuc(bai.id).then((s) => { if (!huy) setGt(s) }).catch(() => { if (!huy) setGt('') })
    return () => { huy = true }
  }, [bai.id, bai.mo_hinh_id])
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong() }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f)
  }, [onDong])
  const ds = duong(bai.mo_hinh_id).map((id) => nhanhById.get(id)).filter(Boolean) as MoHinh[]
  // hình: của bài → nhánh gần nhất có hình (leo đường gốc)
  const anh = bai.anh_chuan ?? [...ds].reverse().find((n) => n.anh_cau_hinh)?.anh_cau_hinh ?? null
  const cach = api.cachMacDinh(L, bai.id)
  const tienDe = api.tienDeCua(L, bai.id)
  const m = mau(doSau(bai.mo_hinh_id))
  const nhanhSai = saiTienDe.length ? baiById.get(saiTienDe[0])?.mo_hinh_id : null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-5" onClick={onDong}>
      <div className="max-h-[92vh] w-full max-w-[900px] overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-slate-200 bg-white px-5 py-3">
          <h2 className="text-[17px] font-semibold">Bài {bai.so}</h2>
          <Ma big>{bai.ma}</Ma>
          <span className="rounded-full px-2 py-px text-[11.5px] font-semibold text-white" style={{ background: m.dac }}>{ds.length > 1 ? tron(ds[ds.length - 1].ten) : 'Thân'}</span>
          {!!saiTienDe.length && <span className="rounded border border-amber-400 bg-amber-50 px-1.5 text-[11px] font-bold text-amber-800">⚠ sai nhánh</span>}
          <button className="ml-auto h-8 w-8 rounded-lg bg-slate-100 text-[16px]" onClick={onDong}>✕</button>
        </div>
        <div className="grid gap-5 px-5 py-4 md:grid-cols-[1fr_270px]">
          <div className="min-w-0 space-y-3.5">
            <Muc ten="Đề bài">
              {gt === null ? <span className="text-slate-400">đang lấy giả thiết…</span> : <MathText>{[gt.trim().replace(/[.;]+$/, ''), bai.phat_bieu].filter(Boolean).join('. ')}</MathText>}
            </Muc>
            <Muc ten="Lời giải / đáp án">
              {cach?.loi_giai
                ? <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5"><MathText>{cach.loi_giai}</MathText></div>
                : <span className="text-slate-400">chưa có lời giải</span>}
              {cach?.anh_loi_giai && <div className="mt-2"><Fig src={cach.anh_loi_giai} cap="Hình lời giải" h="h-40" /></div>}
            </Muc>
            {!!saiTienDe.length && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-[12.5px]">
                <b>⚠ Sai nhánh.</b> Tiền đề {saiTienDe.map((t) => baiById.get(t)?.so ?? '?').join(', ')} nằm ở nhánh mà bài này không thuộc ⇒ bài không có đủ giả thiết để dùng nó.
                {nhanhSai && <div className="mt-1.5"><Btn kind="warn" onClick={() => onSuaSai(nhanhSai)}>Chuyển bài sang nhánh “{tron(nhanhById.get(nhanhSai)?.ten ?? '')}”</Btn></div>}
              </div>)}
          </div>
          <div className="space-y-3.5">
            <Muc ten="Hình"><Fig src={anh} h="h-44" /></Muc>
            <Muc ten="Giả thiết hiệu lực (gốc → nhánh → riêng)">
              <div className="space-y-1 border-l-[3px] pl-2.5 text-[12px]" style={{ borderColor: MAU[0].dac }}>
                {/* bài TỰ PHÁT BIỂU (gt_thay_the): giả thiết riêng THAY cả đường gốc → nhánh, không cộng dồn */}
                {!bai.gt_thay_the && ds.map((n, i) => {
                  const t = i === 0 ? n.gia_thiet : n.gia_thiet_them
                  return t ? <div key={n.id}><b>{i === 0 ? 'Gốc' : `+ ${tron(n.ten)}`}:</b> <MathText className="inline">{t}</MathText></div> : null
                })}
                {bai.gia_thiet_rieng && <div><b>{bai.gt_thay_the ? 'Bài tự phát biểu (thay giả thiết gốc)' : '+ Riêng bài'}:</b> <MathText className="inline">{bai.gia_thiet_rieng}</MathText></div>}
              </div>
            </Muc>
            <Muc ten="Tiền đề">
              {tienDe.length ? <div className="flex flex-wrap gap-1.5">{tienDe.map((t) => { const x = baiById.get(t); return (
                <button key={t} onClick={() => x && onNhay(t)} className="rounded-full border border-blue-300 bg-blue-50 px-2 py-px text-[11.5px] font-semibold text-blue-700">
                  {x ? x.so : 'bài ngoài cây'}</button>) })}</div> : <span className="text-[12px] text-slate-400">— không —</span>}
            </Muc>
          </div>
        </div>
      </div>
    </div>
  )
}
const Muc = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div><div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{ten}</div><div className="text-[13.5px]">{children}</div></div>
)
