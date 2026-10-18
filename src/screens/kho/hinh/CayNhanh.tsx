// CÂY NHÁNH BÀI (spec-hinh-cay-nhanh.md §4) — một mô hình = một cây: thân 1.1 → 1.2 …, rẽ nhánh từ bài mẹ.
// Hai tab đọc CÙNG dữ liệu: ① Chuỗi (cây xếp chỗ, chỉ xuống · sang phải) · ② Nhóm (card lồng nhau).
// Thẻ tối giản; bấm thẻ bài ⇒ popup đề · hình · đáp án.
// Số hiển thị / giả thiết hiệu lực / cờ sai nhánh đều lấy từ hàm Postgres (lib/kho/hinhCay.ts) — màn chỉ vẽ.
// Sau mutation: VÁ tại chỗ từ kết quả RPC (CLAUDE.md §2), không quét lại danh sách.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi, MoHinh } from '../../../lib/kho/hinh'
import type { BaiCay, ChuoiKho, DemKho, KetQuaCay } from '../../../lib/kho/hinhCay'
import { MathText } from '../ui'
import { AnhInput, Btn, Empty, Fig, Ma, Note, OcrButton, Seg, inpCls, tron } from './hinhUi'

type BaiX = BaiToan & { so: string }
const NHO: { gocId: string | null; tab: 'chuoi' | 'nhom' | 'kho'; gap: Record<string, string[]>; mo: boolean; cuon: Record<string, [number, number]>; tim: string; gapNhom: Record<string, boolean> } =
  { gocId: null, tab: 'chuoi', gap: {}, mo: true, cuon: {}, tim: '', gapNhom: {} }

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

// `chuDeId` (tuỳ chọn) — mở từ Bản đồ mới, vùng Hình–Luyện: chỉ hiện mô hình của chủ đề đó + ngăn "chưa xếp chủ đề".
export default function CayNhanh({ L, khoi, reload, chuDeId }: { L: Luoi; khoi: string; reload: () => Promise<void>; chuDeId?: string }) {
  // CHỈ mô hình phan='luyen' (mô hình tạo ở đây sinh ra đã là 'luyen'). 41 mô hình cũ đang phan=NULL ⇒ tự ẩn —
  // CEO 14/10: "ẩn làm tham khảo, không dùng"; vẫn xem được ở màn Sơ đồ. Không sửa/xoá dòng cũ nào.
  const gocLuyen = useMemo(() => api.gocCayCua(L).filter((m) => m.phan === 'luyen'), [L])
  const goc = useMemo(() => (chuDeId ? gocLuyen.filter((m) => m.chu_de_id === chuDeId) : gocLuyen), [gocLuyen, chuDeId])
  const gocChuaXep = useMemo(() => (chuDeId ? gocLuyen.filter((m) => !m.chu_de_id) : []), [gocLuyen, chuDeId])
  const xepChuDe = async (id: string, cd: string | null) => {
    try { await api.updateMoHinh(id, { chu_de_id: cd }); await reload() } catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  const [gocId, setGocIdRaw] = useState<string | null>(() => (NHO.gocId && goc.some((m) => m.id === NHO.gocId) ? NHO.gocId : null))
  const [tim, setTim] = useState(NHO.tim)
  const [tab, setTab] = useState(NHO.tab)
  const [nhanhs, setNhanhs] = useState<MoHinh[]>([])
  const [demKho, setDemKho] = useState<Map<string, DemKho>>(new Map())   // số chuỗi kho theo mô hình (badge)
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
  const [hopMH, setHopMH] = useState<{ id: string | null; ten: string; gt: string; anh: string | null; nhom: string | null } | null>(null)   // tạo / sửa mô hình gốc
  // NHÓM MÔ HÌNH (Thùy 18/10): Chủ đề → Nhóm mô hình → Mô hình. Chỉ khi mở từ Bản đồ mới (có chủ đề).
  const [nhoms, setNhoms] = useState<api.NhomMoHinh[]>([])
  const [hopNhom, setHopNhom] = useState<{ id: string | null; ten: string; moTa: string } | null>(null)
  const [gapNhom, setGapNhom] = useState<Record<string, boolean>>(NHO.gapNhom)
  const [keoVao, setKeoVao] = useState<string | null>(null)   // nhóm đang được kéo mô hình vào (viền sáng)
  const [hopBai, setHopBai] = useState<{ id: string | null; nhanh: string } | null>(null)                               // thêm / sửa bài
  const soRef = useRef(new Map<string, string>())      // số hiển thị đang có (từ RPC) — giữ qua các lần lưới nạp lại
  const khung = useRef<HTMLDivElement>(null)

  const setGocId = (id: string | null) => { NHO.gocId = id; setGocIdRaw(id) }
  useEffect(() => { api.demKhoMoHinh(khoi).then(setDemKho).catch(() => {}) }, [khoi])
  useEffect(() => { if (chuDeId) api.nhomMoHinhCuaChuDe(chuDeId).then(setNhoms).catch((e) => setLoi(e.message ?? String(e))) }, [chuDeId])
  useEffect(() => { NHO.gapNhom = gapNhom }, [gapNhom])
  useEffect(() => { NHO.tab = tab }, [tab])
  useEffect(() => { NHO.mo = mo }, [mo])
  useEffect(() => { NHO.tim = tim }, [tim])
  useEffect(() => { if (gocId) NHO.gap[gocId] = [...gapLai] }, [gapLai, gocId])
  const bao = (s: string) => { setThongBao(s); window.setTimeout(() => setThongBao((x) => (x === s ? null : x)), 2600) }

  // ── ĐỔI gốc (đổi ngữ cảnh ⇒ reset là đúng): lấy số hiển thị + cờ sai nhánh từ DB ──
  useEffect(() => {
    setSel(new Set()); setCur(null); setPop(null); setLoi(null); soRef.current = new Map()
    if (!gocId) { setSai(new Map()); return }
    setGapLai(new Set(NHO.gap[gocId] ?? []))
    let huy = false
    setDangTai(true)
    Promise.all([api.soHienThiCay(gocId), api.saiNhanhCay(gocId)]).then(([so, s]) => {
      if (huy) return
      soRef.current = new Map(so.map((r) => [r.id, r.so]))
      setBais((prev) => prev.map((b) => ({ ...b, so: soRef.current.get(b.id) ?? '' })))
      setSai(gomSai(s))
    }).catch((e) => { if (!huy) setLoi(e.message ?? String(e)) }).finally(() => { if (!huy) setDangTai(false) })
    return () => { huy = true }
  }, [gocId])
  // ── LƯỚI nạp lại (sau khi tạo/sửa) hoặc đổi gốc ⇒ dựng lại nhánh + bài, GIỮ số đang có, không trắng màn ──
  useEffect(() => {
    if (!gocId) { setNhanhs([]); setBais([]); return }
    const ns = api.nhanhCuaCay(L.moHinh, L.baiToan, gocId)
    const ids = new Set(ns.map((n) => n.id))
    setNhanhs(ns)
    setBais(L.baiToan.filter((b) => ids.has(b.mo_hinh_id)).map((b) => ({ ...b, so: soRef.current.get(b.id) ?? '' })))
  }, [gocId, L])

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
    for (const r of kq.bai) soRef.current.set(r.id, r.so)
    // nhánh mới / nhánh đổi neo: lấy dòng TRƯỚC khi vá bài, để bài không rơi vào nhánh màn chưa biết
    const canLay = [kq.nhanh_moi, nhanhDoi].filter(Boolean) as string[]
    if (canLay.length) {
      const moi = (await Promise.all(canLay.map((id) => api.layMoHinh(id)))).filter(Boolean) as MoHinh[]
      setNhanhs((prev) => { const ids = new Set(moi.map((x) => x.id)); return [...prev.filter((n) => !ids.has(n.id)), ...moi] })
    }
    const m = new Map<string, BaiCay>(kq.bai.map((r) => [r.id, r]))
    setBais((prev) => prev.map((b) => { const r = m.get(b.id); return r ? { ...b, so: r.so, mo_hinh_id: r.mo_hinh_id, thu_tu: r.thu_tu } : b }))
    api.saiNhanhCay(kq.goc).then((s) => setSai(gomSai(s))).catch(() => {})   // nền — không xoá gì trong lúc chờ
    await reload()                                                            // lưới mới (bài/nhánh/lời giải vừa tạo) — màn dựng lại từ L, giữ số
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
  const luuMoHinh = async () => {
    if (!hopMH || ban) return
    setBan(true); setLoi(null)
    try {
      if (hopMH.id) {
        await api.updateMoHinh(hopMH.id, { ten: hopMH.ten.trim(), gia_thiet: hopMH.gt.trim(), anh_cau_hinh: hopMH.anh })
        const cu = goc.find((m) => m.id === hopMH.id)?.nhom_mh_id ?? null
        if (chuDeId && hopMH.nhom && hopMH.nhom !== cu) await api.doiNhomMoHinh(hopMH.id, hopMH.nhom)
        await reload(); bao('Đã lưu mô hình')
      } else {
        const id = chuDeId && hopMH.nhom
          ? await api.taoMoHinhTrongNhom(hopMH.nhom, hopMH.ten, hopMH.gt, hopMH.anh)
          : await api.taoMoHinhLuyen(khoi, hopMH.ten, hopMH.gt, hopMH.anh)
        await reload(); setGocId(id); bao('Đã tạo mô hình — bấm “＋ Thêm bài” để dựng thân')
      }
      setHopMH(null)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(false) }
  }
  const luuBai = async (v: api.BaiNhap, nhanhId: string) => {
    if (!hopBai || ban) return
    const dangSua = hopBai.id
    setBan(true); setLoi(null)
    try {
      const kq = dangSua ? await api.suaBaiCay(dangSua, v) : await api.themBaiCay(nhanhId, v)
      await va(kq)
      setCur(kq.bai_moi); setHopBai(null)
      bao(dangSua ? 'Đã lưu bài — mã giữ nguyên' : 'Đã thêm bài ' + (kq.bai.find((b) => b.id === kq.bai_moi)?.so ?? ''))
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(false) }
  }
  // ── nhóm mô hình: vá tại chỗ ──
  const luuNhom = async () => {
    if (!hopNhom || !chuDeId || ban || !hopNhom.ten.trim()) return
    setBan(true); setLoi(null)
    try {
      if (hopNhom.id) {
        await api.suaNhomMoHinh(hopNhom.id, { ten: hopNhom.ten, mo_ta: hopNhom.moTa })
        setNhoms((p) => p.map((n) => (n.id === hopNhom.id ? { ...n, ten: hopNhom.ten.trim(), mo_ta: hopNhom.moTa.trim() } : n)))
        bao('Đã lưu nhóm')
      } else {
        const n = await api.themNhomMoHinh(chuDeId, hopNhom.ten, hopNhom.moTa)
        setNhoms((p) => [...p, n]); bao('Đã tạo nhóm — kéo mô hình vào, hoặc ＋ Mô hình')
      }
      setHopNhom(null)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(false) }
  }
  const sapNhom = async (id: string, d: -1 | 1) => {
    const i = nhoms.findIndex((n) => n.id === id), j = i + d
    if (i < 0 || j < 0 || j >= nhoms.length) return
    const moi = [...nhoms]; [moi[i], moi[j]] = [moi[j], moi[i]]
    setNhoms(moi.map((n, k) => ({ ...n, thu_tu: k + 1 })))
    try { await api.sapNhomMoHinh(moi.map((n) => n.id)) } catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  const xoaNhom = async (id: string) => {
    const n = nhoms.find((x) => x.id === id)
    if (!n || !window.confirm(`Xoá nhóm «${n.ten}»? (Nhóm đang rỗng.)`)) return
    try { await api.xoaNhomMoHinh(id); setNhoms((p) => p.filter((x) => x.id !== id)); setHopNhom(null); bao('Đã xoá nhóm') }
    catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  const chuyenMH = async (mhId: string, nhomId: string) => {
    if (goc.find((m) => m.id === mhId)?.nhom_mh_id === nhomId) return
    try { await api.doiNhomMoHinh(mhId, nhomId); await reload(); bao('Đã chuyển mô hình sang nhóm ' + (nhoms.find((n) => n.id === nhomId)?.ten ?? '')) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  const batGap = (id: string) => setGapLai((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── danh sách gốc cây (trái) ──
  const nutMH = (m: MoHinh) => (
    <button key={m.id} onClick={() => setGocId(m.id)} draggable={!!chuDeId}
      onDragStart={(e) => { e.dataTransfer.setData('text/mh', m.id); e.dataTransfer.effectAllowed = 'move' }}
      className={`block w-full rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition ${
        gocId === m.id ? 'border-teal-400 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
      <Ma>{m.ma}</Ma>
      <div className="truncate font-medium">{tron(m.ten)}</div>
      {(() => { const d = demKho.get(m.id); return d?.so_chuoi
        ? <div className="mt-0.5 text-[10.5px] text-slate-500">kho {d.so_chuoi} chuỗi · {d.so_y} ý</div>
        : <div className="mt-0.5 text-[10.5px] text-slate-300">kho trống</div> })()}
    </button>
  )
  const gocLoc = goc.filter((m) => !tim.trim() || `${m.ma} ${tron(m.ten)}`.toLowerCase().includes(tim.trim().toLowerCase()))
  const gocMH = gocId ? nhanhById.get(gocId) ?? goc.find((m) => m.id === gocId) ?? null : null

  return (
    <div className="flex h-full min-h-0 gap-4">
      <aside className="w-[250px] shrink-0">
        <div className="mb-2 flex items-center justify-between gap-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình luyện · khối {khoi}</span>
          <span className="flex gap-1">
            {chuDeId && <Btn className="!h-7 !px-2 !text-[12px]" onClick={() => setHopNhom({ id: null, ten: '', moTa: '' })} title="Nhóm mô hình: gom các mô hình tương đồng">＋ Nhóm</Btn>}
            <Btn kind="pri" className="!h-7 !px-2 !text-[12px]" disabled={!!chuDeId && !nhoms.length}
              title={chuDeId && !nhoms.length ? 'Tạo nhóm mô hình trước (＋ Nhóm)' : undefined}
              onClick={() => setHopMH({ id: null, ten: '', gt: '', anh: null, nhom: (gocMH && goc.find((m) => m.id === gocId)?.nhom_mh_id) || nhoms[0]?.id || null })}>＋ Mô hình</Btn>
          </span>
        </div>
        <input className={inpCls} placeholder="Tìm mô hình…" value={tim} onChange={(e) => setTim(e.target.value)} />
        <div className="mt-2 max-h-[calc(100vh-230px)] space-y-1.5 overflow-y-auto pr-1">
          {chuDeId ? (
            <>
              {nhoms.map((n, i) => {
                const ds = gocLoc.filter((m) => m.nhom_mh_id === n.id)
                if (tim.trim() && !ds.length) return null
                const gap = !!gapNhom[n.id] && !tim.trim()
                return (
                  <div key={n.id}
                    onDragOver={(e) => { if (e.dataTransfer.types.includes('text/mh')) { e.preventDefault(); setKeoVao(n.id) } }}
                    onDragLeave={() => setKeoVao((x) => (x === n.id ? null : x))}
                    onDrop={(e) => { e.preventDefault(); setKeoVao(null); const id = e.dataTransfer.getData('text/mh'); if (id) void chuyenMH(id, n.id) }}
                    className={`rounded-lg border bg-slate-50/60 ${keoVao === n.id ? 'border-teal-500 ring-2 ring-teal-300' : 'border-slate-200'}`}>
                    <div className="group flex items-center gap-1 px-1.5 py-1">
                      <button onClick={() => setGapNhom((g) => ({ ...g, [n.id]: !g[n.id] }))} className="w-4 shrink-0 text-[11px] text-slate-400">{gap ? '▸' : '▾'}</button>
                      <button onClick={() => setGapNhom((g) => ({ ...g, [n.id]: !g[n.id] }))} className="min-w-0 flex-1 truncate text-left text-[12.5px] font-semibold text-slate-700" title={n.mo_ta || n.ten}>
                        <span className="mr-1 text-[11px] font-normal text-slate-400">{i + 1}.</span>{tron(n.ten)}
                      </button>
                      <span className="shrink-0 rounded-full bg-slate-200/80 px-1.5 text-[10.5px] text-slate-600">{ds.length}</span>
                      <span className="hidden shrink-0 gap-0.5 group-hover:flex">
                        <button disabled={i === 0} onClick={() => void sapNhom(n.id, -1)} className="px-0.5 text-[11px] text-slate-500 disabled:opacity-20" title="Lên">▲</button>
                        <button disabled={i === nhoms.length - 1} onClick={() => void sapNhom(n.id, 1)} className="px-0.5 text-[11px] text-slate-500 disabled:opacity-20" title="Xuống">▼</button>
                        <button onClick={() => setHopNhom({ id: n.id, ten: n.ten, moTa: n.mo_ta })} className="px-0.5 text-[11px] text-blue-600" title="Sửa tên · mô tả nhận biết">✎</button>
                      </span>
                    </div>
                    {!gap && (
                      <div className="space-y-1 px-1.5 pb-1.5">
                        {n.mo_ta && <div className="line-clamp-2 px-1 text-[10.5px] leading-snug text-slate-400" title={n.mo_ta}>{n.mo_ta}</div>}
                        {ds.map(nutMH)}
                        {!ds.length && <div className="rounded border border-dashed border-slate-300 px-2 py-1.5 text-center text-[11px] text-slate-400">Kéo mô hình thả vào đây</div>}
                      </div>
                    )}
                  </div>
                )
              })}
              {(() => {
                const chuaXepNhom = gocLoc.filter((m) => !m.nhom_mh_id)
                if (!chuaXepNhom.length) return null
                return (
                  <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/50 p-1.5">
                    <div className="mb-1 px-1 text-[10.5px] font-semibold uppercase tracking-wide text-amber-700">⚠ Chưa xếp nhóm · {chuaXepNhom.length}</div>
                    <div className="space-y-1">{chuaXepNhom.map(nutMH)}</div>
                    {!!nhoms.length && <div className="mt-1 px-1 text-[10.5px] text-amber-700">Kéo mô hình thả vào một nhóm ở trên.</div>}
                  </div>
                )
              })()}
              {!nhoms.length && !gocLoc.length && <div className="px-2 py-4 text-[12px] leading-relaxed text-slate-400">Chủ đề này chưa có nhóm mô hình. Bấm <b>＋ Nhóm</b> để tạo nhóm đầu tiên, rồi <b>＋ Mô hình</b> trong nhóm.</div>}
            </>
          ) : gocLoc.map(nutMH)}
          {!!gocChuaXep.length && (
            <div className="mt-3 rounded-lg border border-dashed border-slate-300 p-1.5">
              <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Chưa xếp chủ đề · {gocChuaXep.length}</div>
              {gocChuaXep.map((m) => (
                <div key={m.id} className="flex items-center gap-1 px-1 py-0.5 text-[12px]">
                  <span className="min-w-0 flex-1 truncate" title={tron(m.ten)}>{tron(m.ten)}</span>
                  <button onClick={() => xepChuDe(m.id, chuDeId!)} className="rounded border border-teal-300 px-1.5 text-teal-700 hover:bg-teal-50" title="Đưa mô hình vào chủ đề này">＋</button>
                </div>))}
            </div>)}
          {!chuDeId && !gocLoc.length && <div className="px-2 py-4 text-[12px] leading-relaxed text-slate-400">Chưa có mô hình luyện nào ở khối {khoi}. Bấm <b>＋ Mô hình</b> để tạo.<br />Các mô hình cũ được ẩn làm tham khảo — xem ở “Sơ đồ (2 view)”.</div>}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {!gocMH ? <Empty icon="🌿">Chọn một mô hình ở bên trái, hoặc bấm ＋ Mô hình để tạo mô hình mới.</Empty> : (
          <>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-[18px] font-semibold text-slate-900">{tron(gocMH.ten)}</h1>
              <Ma>{gocMH.ma}</Ma>
              <button className="text-[12px] text-blue-600 hover:underline" onClick={() => setHopMH({ id: gocMH.id, ten: gocMH.ten, gt: gocMH.gia_thiet ?? '', anh: gocMH.anh_cau_hinh ?? null, nhom: gocMH.nhom_mh_id ?? null })}>✎ sửa mô hình</button>
              {chuDeId && <span className="text-[12px] text-slate-400">· nhóm {nhoms.find((n) => n.id === gocMH.nhom_mh_id)?.ten ?? <span className="text-amber-600">chưa xếp</span>}</span>}
              <span className="text-[12px] text-slate-400">{bais.length} bài · {nhanhs.length - 1} nhánh{sai.size ? ` · ${sai.size} sai nhánh` : ''}{dangTai ? ' · đang tính số…' : ''}</span>
            </div>
            <div className="mb-3 rounded-lg px-2.5 py-1.5 text-[12.5px] text-white" style={{ background: MAU[0].dac }}>
              <b>Giả thiết mô hình:</b> <MathText className="inline">{gocMH.gia_thiet || '—'}</MathText>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Seg value={tab} onChange={setTab} options={[{ v: 'chuoi', label: '① Chuỗi' }, { v: 'nhom', label: '② Nhóm' }, { v: 'kho', label: `③ Kho bài · ${demKho.get(gocId!)?.so_chuoi ?? 0}` }]} />
              <Btn kind="pri" disabled={ban} onClick={() => setHopBai({ id: null, nhanh: (cur && baiById.get(cur)?.mo_hinh_id) || gocId! })}
                title="Thêm bài vào cuối thân, hoặc cuối nhánh của bài đang chọn">＋ Thêm bài</Btn>
              <Btn disabled={!sel.size || ban} onClick={() => setHopRe({ ten: '', gt: '' })}
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

            {tab === 'kho'
              ? <TabKho gocId={gocId!} coBai={(id) => baiById.has(id)} onMo={(id) => { setCur(id); setPop(id) }} />
              : tab === 'chuoi'
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
          onSua={() => { const b = baiById.get(pop)!; setPop(null); setHopBai({ id: b.id, nhanh: b.mo_hinh_id }) }}
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
      {hopMH && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5" onClick={() => setHopMH(null)}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-3 text-[16px] font-semibold">{hopMH.id ? 'Sửa mô hình' : 'Mô hình luyện mới · khối ' + khoi}</h2>
            {chuDeId && (
              <>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Nhóm mô hình</label>
                <select className={inpCls + ' mb-3'} value={hopMH.nhom ?? ''} onChange={(e) => setHopMH({ ...hopMH, nhom: e.target.value || null })}>
                  {!hopMH.nhom && <option value="">— chọn nhóm —</option>}
                  {nhoms.map((n, i) => <option key={n.id} value={n.id}>{i + 1}. {n.ten}</option>)}
                </select>
              </>
            )}
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tên mô hình</label>
            <input autoFocus className={inpCls} value={hopMH.ten} onChange={(e) => setHopMH({ ...hopMH, ten: e.target.value })} placeholder="vd: Phân giác trong tam giác vuông" />
            <div className="mb-1 mt-3 flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Giả thiết của mô hình (gõ $…$ cho công thức)</label>
              <OcrButton onText={(t) => setHopMH((p) => (p ? { ...p, gt: (p.gt ? p.gt + ' ' : '') + t } : p))} />
            </div>
            <textarea className={inpCls + ' h-24'} value={hopMH.gt} onChange={(e) => setHopMH({ ...hopMH, gt: e.target.value })} placeholder="vd: Cho tam giác ABC vuông tại A, AD là phân giác (D thuộc BC)." />
            {hopMH.gt.trim() && <div className="mt-1 rounded-md bg-slate-50 px-2 py-1 text-[12.5px]"><MathText>{hopMH.gt}</MathText></div>}
            <div className="mt-3 max-w-xs"><AnhInput value={hopMH.anh} onChange={(u) => setHopMH((p) => (p ? { ...p, anh: u } : p))} cap="Hình của mô hình" /></div>
            <div className="mt-4 flex justify-end gap-2">
              <Btn onClick={() => setHopMH(null)}>Huỷ</Btn>
              <Btn kind="pri" disabled={ban || !hopMH.ten.trim() || (!!chuDeId && !hopMH.id && !hopMH.nhom)} onClick={luuMoHinh}>{hopMH.id ? 'Lưu' : 'Tạo mô hình'}</Btn>
            </div>
          </div>
        </div>
      )}
      {hopNhom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5" onClick={() => setHopNhom(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-[16px] font-semibold">{hopNhom.id ? 'Sửa nhóm mô hình' : 'Nhóm mô hình mới'}</h2>
            <p className="mb-3 text-[12.5px] text-slate-500">Nhóm gom các mô hình tương đồng (cùng kiểu cấu hình hình). Nhóm chỉ để gom — không kế thừa giả thiết, không đổi số bài.</p>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tên nhóm</label>
            <input autoFocus className={inpCls} value={hopNhom.ten} onChange={(e) => setHopNhom({ ...hopNhom, ten: e.target.value })} placeholder="vd: Tứ giác có hai đường chéo vuông góc" />
            <label className="mb-1 mt-3 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mô tả nhận biết</label>
            <textarea className={`${inpCls} h-24`} value={hopNhom.moTa} onChange={(e) => setHopNhom({ ...hopNhom, moTa: e.target.value })}
              placeholder="Dấu hiệu chung của các mô hình trong nhóm: hình gì, giả thiết đặc trưng gì, hay hỏi gì…" />
            <div className="mt-4 flex items-center gap-2">
              {hopNhom.id && (() => { const con = goc.filter((m) => m.nhom_mh_id === hopNhom.id).length; return (
                <Btn disabled={con > 0} title={con ? `Còn ${con} mô hình — chuyển hết sang nhóm khác mới xoá được` : 'Xoá nhóm rỗng'} onClick={() => void xoaNhom(hopNhom.id!)}>
                  <span className="text-rose-600">Xoá nhóm</span></Btn>) })()}
              <span className="flex-1" />
              <Btn onClick={() => setHopNhom(null)}>Huỷ</Btn>
              <Btn kind="pri" disabled={ban || !hopNhom.ten.trim()} onClick={() => void luuNhom()}>{hopNhom.id ? 'Lưu' : 'Tạo nhóm'}</Btn>
            </div>
          </div>
        </div>
      )}
      {hopBai && (
        <FormBai L={L} sua={hopBai.id ? baiById.get(hopBai.id) ?? null : null} nhanhMacDinh={hopBai.nhanh} gocId={gocId!}
          nhanhs={nhanhs} bais={bais} doSau={doSau} ban={ban} onDong={() => setHopBai(null)} onLuu={luuBai} />
      )}
      {thongBao && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] text-white shadow-lg">{thongBao}</div>}
    </div>
  )
}

/** ③ KHO BÀI của mô hình — CEO 14/10: "kho là các chuỗi bài, mỗi chuỗi 1 dòng".
 *  Một chuỗi = một bài kho với các ý a → b → c; mỗi ý hiện số bài mô hình nó gán (bấm để mở bài đó). Bấm dòng để xem đề + lời giải. */
function TabKho({ gocId, coBai, onMo }: { gocId: string; coBai: (id: string) => boolean; onMo: (baitoanId: string) => void }) {
  const [rows, setRows] = useState<ChuoiKho[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [tim, setTim] = useState('')
  const [conThieu, setConThieu] = useState(false)
  useEffect(() => {
    let huy = false
    setRows(null); setLoi(null); setMo(null)
    api.khoCuaMoHinh(gocId).then((r) => { if (!huy) setRows(r) }).catch((e) => { if (!huy) setLoi(e.message ?? String(e)) })
    return () => { huy = true }
  }, [gocId])
  const hien = useMemo(() => {
    const k = tim.trim().toLowerCase()
    return (rows ?? []).filter((c) => (!conThieu || c.y.some((y) => !y.so))
      && (!k || `${c.ma_bai} ${c.nguon ?? ''} ${c.gia_thiet_chung ?? ''} ${c.y.map((y) => y.noi_dung).join(' ')}`.toLowerCase().includes(k)))
  }, [rows, tim, conThieu])
  if (loi) return <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{loi}</div>
  if (!rows) return <div className="py-8 text-center text-[13px] text-slate-400">Đang tải kho…</div>
  if (!rows.length) return <Empty icon="📚">Kho của mô hình này chưa có chuỗi nào. Gán bài ở <b>Duyệt kho › Hình luyện · chưa phân mô hình</b> (nút “＋ Gán mô hình”).</Empty>
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <input className={inpCls + ' !w-64'} placeholder="Tìm trong kho (mã, nguồn, đề)…" value={tim} onChange={(e) => setTim(e.target.value)} />
        <label className="flex cursor-pointer items-center gap-1.5 text-[12.5px] text-slate-600">
          <input type="checkbox" checked={conThieu} onChange={(e) => setConThieu(e.target.checked)} /> chỉ chuỗi còn ý chưa gán
        </label>
        <span className="text-[12px] text-slate-400">{hien.length}/{rows.length} chuỗi</span>
      </div>
      {/* Thùy 15/10: "view bé quá, mỗi chuỗi phải to gấp 2–3 lần mới đọc được" ⇒ mỗi chuỗi = một CARD đọc được ngay:
          hình to bên trái, đề + từng ý nguyên văn cỡ 15px bên phải, chip bài mô hình cạnh ý. Bấm "Lời giải" mới mở
          lời giải + hình riêng của ý — không còn trạng thái "hàng gập 1 dòng". */}
      <div className="space-y-3">
        {hien.map((c) => { const dangMo = mo === c.id; return (
          <div key={c.id} className={`rounded-xl border bg-white p-4 ${dangMo ? 'border-teal-300 shadow-sm' : 'border-slate-200'}`}>
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[13px] font-semibold text-teal-700">{c.ma_bai}</span>
              <span className="text-[12px] text-slate-500">{c.nguon ?? 'chưa rõ nguồn'}{c.nguon_ma_cau ? ` · gốc ${c.nguon_ma_cau}` : ''}</span>
              <span className="ml-auto flex items-center gap-1">
                {c.y.map((y, i) => (
                  <span key={y.id} className="flex items-center gap-1">
                    {i > 0 && <span className="text-slate-300">→</span>}
                    {y.so
                      ? <button onClick={() => { if (y.baitoan_id && coBai(y.baitoan_id)) onMo(y.baitoan_id) }}
                          className="rounded-full bg-teal-600 px-2 py-0.5 text-[12px] font-semibold text-white hover:bg-teal-500" title={`Ý ${y.nhan ?? ''} gán vào bài ${y.so} (${y.ma_bai_mh}) — bấm để mở`}>
                          {y.nhan ?? '•'} {y.so}</button>
                      : <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[12px] font-semibold text-amber-700" title={`Ý ${y.nhan ?? ''} chưa gán bài mô hình`}>{y.nhan ?? '•'}</span>}
                  </span>))}
              </span>
            </div>
            <div className="flex gap-5">
              {c.anh_de
                ? <img src={c.anh_de} alt="" className="h-48 w-64 shrink-0 self-start rounded-lg border border-slate-200 bg-white object-contain" />
                : <div className="flex h-48 w-64 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[12px] text-slate-300">chưa có hình</div>}
              <div className="min-w-0 flex-1 space-y-2">
                {c.gia_thiet_chung && <div className="rounded-lg bg-teal-600 px-3.5 py-2.5 text-[15px] leading-relaxed text-white"><MathText>{c.gia_thiet_chung}</MathText></div>}
                {c.y.map((y) => (
                  <div key={y.id} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2">
                    <div className="flex gap-2.5 text-[15px] leading-relaxed text-slate-800">
                      <b className="shrink-0 text-violet-700">{y.nhan ? `${y.nhan})` : '•'}</b>
                      <div className="min-w-0 flex-1"><MathText>{y.noi_dung}</MathText></div>
                      {y.so && <span className="shrink-0 self-start font-mono text-[12px] text-teal-700">→ {y.so}</span>}
                    </div>
                    {dangMo && y.loi_giai && (
                      <div className="mt-2 border-t border-slate-200 pt-2 text-[14px] leading-relaxed text-slate-700"><MathText>{y.loi_giai}</MathText></div>)}
                    {dangMo && y.anh_de && <img src={y.anh_de} alt="" className="mt-2 max-h-64 rounded border border-violet-200 bg-white object-contain" />}
                  </div>))}
                <button onClick={() => setMo(dangMo ? null : c.id)} className="text-[12.5px] font-medium text-teal-700 hover:underline">
                  {dangMo ? '▾ Ẩn lời giải' : '▸ Lời giải + hình từng ý'}
                </button>
              </div>
            </div>
          </div>) })}
      </div>
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
function PopupBai({ L, bai, nhanhById, baiById, duong, doSau, saiTienDe, onDong, onNhay, onSuaSai, onSua }: {
  L: Luoi; bai: BaiX; nhanhById: Map<string, MoHinh>; baiById: Map<string, BaiX>
  duong: (id: string) => string[]; doSau: (id: string) => number; saiTienDe: string[]
  onDong: () => void; onNhay: (id: string) => void; onSuaSai: (nhanhId: string) => void; onSua: () => void
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
          <Btn className="ml-auto" onClick={onSua}>✎ Sửa bài</Btn>
          <button className="h-8 w-8 rounded-lg bg-slate-100 text-[16px]" onClick={onDong}>✕</button>
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
// ══════════════════ FORM THÊM / SỬA BÀI ══════════════════
const NhanO = ({ children }: { children: React.ReactNode }) => <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{children}</label>
function FormBai({ L, sua, nhanhMacDinh, gocId, nhanhs, bais, doSau, ban, onDong, onLuu }: {
  L: Luoi; sua: BaiX | null; nhanhMacDinh: string; gocId: string; nhanhs: MoHinh[]; bais: BaiX[]
  doSau: (id: string) => number; ban: boolean; onDong: () => void; onLuu: (v: api.BaiNhap, nhanhId: string) => void
}) {
  const cach = sua ? api.cachMacDinh(L, sua.id) : null
  const [nhanh, setNhanh] = useState(nhanhMacDinh)
  const [pb, setPb] = useState(sua?.phat_bieu ?? '')
  const [gt, setGt] = useState(sua?.gia_thiet_rieng ?? '')
  const [lg, setLg] = useState(cach?.loi_giai ?? '')
  const [anh, setAnh] = useState<string | null>(sua?.anh_chuan ?? null)
  const [td, setTd] = useState<Set<string>>(new Set(sua ? api.tienDeCua(L, sua.id) : []))
  const xep = [...bais].filter((b) => b.id !== sua?.id).sort((a, b) => soSanhSo(a.so, b.so))
  const nhanhXep = [...nhanhs].sort((a, b) => doSau(a.id) - doSau(b.id) || a.ma.localeCompare(b.ma))
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-900/45 p-5" onClick={onDong}>
      <div className="max-h-[94vh] w-full max-w-[1100px] overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2.5">
          <h2 className="text-[16px] font-semibold">{sua ? 'Sửa bài ' + sua.so : 'Thêm bài'}</h2>
          {sua && <Ma big>{sua.ma}</Ma>}
          {!sua && (
            <select className={inpCls + ' ml-auto w-auto'} value={nhanh} onChange={(e) => setNhanh(e.target.value)} title="Thêm vào cuối làn nào">
              {nhanhXep.map((n) => <option key={n.id} value={n.id}>{'— '.repeat(doSau(n.id))}{n.id === gocId ? 'Thân' : tron(n.ten)}</option>)}
            </select>)}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between"><NhanO>Câu hỏi của bài</NhanO><OcrButton onText={(t) => setPb((p) => (p ? p + ' ' : '') + t)} /></div>
              <textarea autoFocus className={inpCls + ' h-24'} value={pb} onChange={(e) => setPb(e.target.value)} placeholder="vd: Chứng minh tam giác ABK bằng tam giác EBK." />
              {pb.trim() && <div className="mt-1 rounded-md bg-slate-50 px-2 py-1 text-[12.5px]"><MathText>{pb}</MathText></div>}
            </div>
            <div>
              <div className="mb-1"><NhanO>Giả thiết riêng của bài (bỏ trống = chỉ dùng giả thiết mô hình + nhánh)</NhanO></div>
              <textarea className={inpCls + ' h-16'} value={gt} onChange={(e) => setGt(e.target.value)} placeholder="vd: Cho AB = 3, AC = 4." />
            </div>
            <div className="max-w-xs"><AnhInput value={anh} onChange={setAnh} cap="Hình riêng của bài (bỏ trống = hình mô hình)" /></div>
            <div>
              <div className="mb-1"><NhanO>Tiền đề — bài phải giải trước ({td.size})</NhanO></div>
              <div className="max-h-40 overflow-auto rounded-lg border border-slate-200 p-1.5">
                {!xep.length && <div className="px-1 text-[12px] text-slate-400">Chưa có bài nào khác.</div>}
                {xep.map((b) => (
                  <label key={b.id} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-0.5 text-[12.5px] hover:bg-slate-50">
                    <input type="checkbox" checked={td.has(b.id)} onChange={() => setTd((p) => { const n = new Set(p); n.has(b.id) ? n.delete(b.id) : n.add(b.id); return n })} />
                    <b className="w-14 shrink-0">{b.so}</b><span className="truncate">{tron(b.phat_bieu)}</span>
                  </label>))}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between"><NhanO>Lời giải / đáp án</NhanO><OcrButton onText={(t) => setLg((p) => (p ? p + '\n' : '') + t)} /></div>
            <textarea className={inpCls + ' h-56 font-mono text-[12.5px]'} value={lg} onChange={(e) => setLg(e.target.value)} placeholder="Lời giải chi tiết…" />
            {lg.trim() && <div className="mt-1 max-h-64 overflow-auto rounded-md border border-emerald-200 bg-emerald-50/60 p-2 text-[13px]"><MathText>{lg}</MathText></div>}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="mr-auto text-[11.5px] text-slate-400">{sua ? 'Sửa nội dung không đổi mã bài.' : 'Bài được thêm vào CUỐI làn đã chọn; muốn đổi chỗ thì sang tab Nhóm.'}</span>
          <Btn onClick={onDong}>Huỷ</Btn>
          <Btn kind="pri" disabled={ban || !pb.trim()}
            onClick={() => onLuu({ phatBieu: pb.trim(), giaThietRieng: gt.trim() || null, loiGiai: lg.trim() || null, anh, tienDe: [...td] }, nhanh)}>{sua ? 'Lưu' : 'Thêm bài'}</Btn>
        </div>
      </div>
    </div>
  )
}
const Muc = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div><div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{ten}</div><div className="text-[13.5px]">{children}</div></div>
)
