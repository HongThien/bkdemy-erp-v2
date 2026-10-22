// CÂY GIẢ THIẾT (Thùy 22/10, mockup docs/mockup-hinh-gia-thiet-mh072.html; thay "rẽ nhánh từ bài" của spec-hinh-cay-nhanh §4):
// giả thiết mô hình + mỗi giả thiết thêm = một KHỐI; giả thiết nối giả thiết (nhánh CHÍNH đi thẳng xuống, nhánh PHỤ rẽ phải);
// trong khối, bài nối bài theo TIỀN ĐỀ, chuỗi bài nằm ngang. KHÔNG có bài nào nối vào giả thiết.
// Hai tab đọc CÙNG dữ liệu: ① Chuỗi (sơ đồ) · ② Nhóm (card lồng nhau).
// Thẻ tối giản; bấm thẻ bài ⇒ popup đề · hình · đáp án.
// Số hiển thị / giả thiết hiệu lực / cờ sai nhánh đều lấy từ hàm Postgres (lib/kho/hinhCay.ts) — màn chỉ vẽ.
// Sau mutation: VÁ tại chỗ từ kết quả RPC (CLAUDE.md §2), không quét lại danh sách.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi, MoHinh } from '../../../lib/kho/hinh'
import type { BaiCay, ChuoiKho, DemKho, KetQuaCay } from '../../../lib/kho/hinhCay'
import { MathText } from '../ui'
import { AnhInput, Btn, Empty, Fig, Ma, Note, OcrButton, Seg, inpCls, tron } from './hinhUi'
import Catalog from './Catalog'

type BaiX = BaiToan & { so: string }
// ⭐ Thùy 19/10: danh sách mô hình MẶC ĐỊNH THU GỌN (chỉ hiện tên nhóm), người dùng tự mở; hệ thống NHỚ trạng thái các lần truy cập
// trước (nhóm nào đang mở · mô hình đang xem · tab · nhánh đã gấp) — module-level cho tới F5 + localStorage cho các lần sau.
// localStorage chỉ là tiện ích theo từng người dùng/trình duyệt (CLAUDE.md §2): lỗi/bị chặn thì cứ chạy như chưa có gì.
type Nho = { gocId: string | null; tab: 'chuoi' | 'nhom' | 'kho'; gap: Record<string, string[]>; mo: boolean; cuon: Record<string, [number, number]>; tim: string; moNhom: Record<string, boolean> }
const LS_NHO = 'bk.cayNhanh.v1'
const docNho = (): Partial<Nho> => { try { return JSON.parse(localStorage.getItem(LS_NHO) ?? '{}') ?? {} } catch { return {} } }
const luuNho = () => { try { localStorage.setItem(LS_NHO, JSON.stringify({ gocId: NHO.gocId, tab: NHO.tab, gap: NHO.gap, mo: NHO.mo, moNhom: NHO.moNhom })) } catch { /* bỏ qua */ } }
const NHO: Nho = (() => {
  const s = docNho()
  return {
    gocId: typeof s.gocId === 'string' ? s.gocId : null,
    tab: s.tab === 'nhom' || s.tab === 'kho' ? s.tab : 'chuoi',
    gap: s.gap && typeof s.gap === 'object' ? s.gap : {},
    mo: typeof s.mo === 'boolean' ? s.mo : true,
    cuon: {}, tim: '',
    moNhom: s.moNhom && typeof s.moNhom === 'object' ? s.moNhom : {},   // id nhóm → true = ĐANG MỞ (vắng = thu gọn)
  }
})()

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
  const [cur, setCur] = useState<string | null>(null)                    // bài đang chọn (tập trung)
  const [pop, setPop] = useState<string | null>(null)                    // bài đang mở popup
  const [dangTai, setDangTai] = useState(false)
  const [ban, setBan] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)
  // thêm / sửa GIẢ THIẾT: id = null ⇒ thêm con của `cha`; id ≠ null ⇒ sửa (tên, giả thiết thêm, dời cha, chính/phụ)
  const [hopGT, setHopGT] = useState<{ id: string | null; cha: string; ten: string; gt: string; chinh: boolean } | null>(null)
  const [hopMH, setHopMH] = useState<{ id: string | null; ten: string; gt: string; anh: string | null; nhom: string | null } | null>(null)   // tạo / sửa mô hình gốc
  // NHÓM MÔ HÌNH (Thùy 18/10): Chủ đề → Nhóm mô hình → Mô hình. Chỉ khi mở từ Bản đồ mới (có chủ đề).
  const [nhoms, setNhoms] = useState<api.NhomMoHinh[]>([])
  const [hopNhom, setHopNhom] = useState<{ id: string | null; ten: string; moTa: string } | null>(null)
  const [moNhom, setMoNhom] = useState<Record<string, boolean>>(NHO.moNhom)   // id nhóm → true = đang mở; MẶC ĐỊNH THU GẠN (chỉ hiện tên nhóm)
  const moRa = (id: string | null) => { if (id) setMoNhom((g) => (g[id] ? g : { ...g, [id]: true })) }   // nhóm vừa nhận mô hình ⇒ mở ra để thấy kết quả
  const [keoVao, setKeoVao] = useState<string | null>(null)   // nhóm đang được kéo mô hình vào (viền sáng)
  const [moDanhMuc, setMoDanhMuc] = useState<'dang' | 'bode' | null>(null)   // Thùy 19/10: danh mục Dạng bài / Bổ đề dời sang kho mới
  // thêm / sửa bài · `sau` = bài tiếp theo của bài đó (tiền đề mặc định = bài đó)
  const [hopBai, setHopBai] = useState<{ id: string | null; nhanh: string; sau?: string } | null>(null)
  const soRef = useRef(new Map<string, string>())      // số hiển thị đang có (từ RPC) — giữ qua các lần lưới nạp lại
  const khung = useRef<HTMLDivElement>(null)

  const setGocId = (id: string | null) => { NHO.gocId = id; setGocIdRaw(id) }
  useEffect(() => { api.demKhoMoHinh(khoi).then(setDemKho).catch(() => {}) }, [khoi])
  useEffect(() => { if (chuDeId) api.nhomMoHinhCuaChuDe(chuDeId).then(setNhoms).catch((e) => setLoi(e.message ?? String(e))) }, [chuDeId])
  useEffect(() => { NHO.moNhom = moNhom }, [moNhom])
  useEffect(() => { NHO.tab = tab }, [tab])
  useEffect(() => { NHO.tim = tim }, [tim])
  useEffect(() => { luuNho() }, [moNhom, tab, gocId])   // nhớ cho các lần truy cập sau (sau khi NHO đã cập nhật ở các effect trên)
  const bao = (s: string) => { setThongBao(s); window.setTimeout(() => setThongBao((x) => (x === s ? null : x)), 2600) }

  // ── ĐỔI gốc (đổi ngữ cảnh ⇒ reset là đúng): lấy số hiển thị + cờ sai nhánh từ DB ──
  useEffect(() => {
    setCur(null); setPop(null); setLoi(null); soRef.current = new Map()
    if (!gocId) { setSai(new Map()); return }
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
    const ns = api.nhanhCuaCay(L.moHinh, L.canh, gocId)
    const ids = new Set(ns.map((n) => n.id))
    setNhanhs(ns)
    setBais(L.baiToan.filter((b) => ids.has(b.mo_hinh_id)).map((b) => ({ ...b, so: soRef.current.get(b.id) ?? '' })))
  }, [gocId, L])

  // ── suy cấu trúc để VẼ ──
  const baiById = useMemo(() => new Map(bais.map((b) => [b.id, b])), [bais])
  const nhanhById = useMemo(() => new Map(nhanhs.map((n) => [n.id, n])), [nhanhs])
  const lan = useMemo(() => {                                         // giả thiết → bài của nó, theo số B
    const m = new Map<string, string[]>()
    for (const n of nhanhs) m.set(n.id, [])
    ;[...bais].sort((a, b) => soSanhSo(a.so, b.so) || a.ma.localeCompare(b.ma)).forEach((b) => m.get(b.mo_hinh_id)?.push(b.id))
    return m
  }, [bais, nhanhs])
  const canhCua = useMemo(() => new Map(L.canh.map((c) => [c.mo_hinh_id, c])), [L.canh])
  const chaCua = useCallback((nid: string): string | null => (nid === gocId ? null : canhCua.get(nid)?.cha_id ?? null), [canhCua, gocId])
  const laChinh = useCallback((nid: string) => !!canhCua.get(nid)?.chinh, [canhCua])
  const duong = useCallback((nid: string): string[] => {            // [gốc … nhánh]
    const a: string[] = []
    for (let c: string | null = nid, i = 0; c && i < 64; c = chaCua(c), i++) a.unshift(c)
    return a
  }, [chaCua])
  const doSau = useCallback((nid: string) => duong(nid).length - 1, [duong])
  const conCuaNhanh = useCallback((nid: string) => nhanhs                   // nhánh chính trước, rồi các nhánh phụ
    .filter((n) => n.id !== gocId && chaCua(n.id) === nid)
    .sort((a, b) => Number(laChinh(b.id)) - Number(laChinh(a.id)) || (a.thu_tu ?? 0) - (b.thu_tu ?? 0) || a.ma.localeCompare(b.ma)),
  [nhanhs, gocId, chaCua, laChinh])
  const baiCaNhanh = useCallback((nid: string): number => {
    let n = lan.get(nid)?.length ?? 0
    for (const c of conCuaNhanh(nid)) n += baiCaNhanh(c.id)
    return n
  }, [lan, conCuaNhanh])
  const coSai = useCallback((nid: string): boolean =>
    (lan.get(nid) ?? []).some((b) => sai.has(b)) || conCuaNhanh(nid).some((c) => coSai(c.id)), [lan, sai, conCuaNhanh])

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
  const chuyen = (baiId: string, nhanhId: string) => chay(() => api.chuyenBaiCay(baiId, nhanhId), 'Đã chuyển bài sang giả thiết khác — mã giữ nguyên')
  // giả thiết: thêm con / sửa (tên + giả thiết thêm qua CRUD dòng đơn; dời cha + chính/phụ qua RPC)
  const luuGT = async () => {
    if (!hopGT || ban || !hopGT.gt.trim()) return
    const h = hopGT
    if (!h.id) { await chay(() => api.themGiaThiet(h.cha, h.ten.trim(), h.gt.trim(), h.chinh), h.chinh ? 'Đã thêm nhánh chính' : 'Đã thêm nhánh phụ'); setHopGT(null); return }
    setBan(true); setLoi(null)
    try {
      await api.suaNhanh(h.id, { ten: h.ten.trim() || h.gt.trim(), gia_thiet_them: h.gt.trim() })
      if (h.cha !== chaCua(h.id) || h.chinh !== laChinh(h.id)) await api.doiChaGiaThiet(h.id, h.cha, h.chinh)
      await reload(); bao('Đã lưu giả thiết'); setHopGT(null)
    } catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBan(false) }
  }
  const luuMoHinh = async () => {
    if (!hopMH || ban) return
    setBan(true); setLoi(null)
    try {
      if (hopMH.id) {
        await api.updateMoHinh(hopMH.id, { ten: hopMH.ten.trim(), gia_thiet: hopMH.gt.trim(), anh_cau_hinh: hopMH.anh })
        const cu = goc.find((m) => m.id === hopMH.id)?.nhom_mh_id ?? null
        if (chuDeId && hopMH.nhom && hopMH.nhom !== cu) await api.doiNhomMoHinh(hopMH.id, hopMH.nhom)
        moRa(hopMH.nhom); await reload(); bao('Đã lưu mô hình')
      } else {
        const id = chuDeId && hopMH.nhom
          ? await api.taoMoHinhTrongNhom(hopMH.nhom, hopMH.ten, hopMH.gt, hopMH.anh)
          : await api.taoMoHinhLuyen(khoi, hopMH.ten, hopMH.gt, hopMH.anh)
        moRa(hopMH.nhom); await reload(); setGocId(id); bao('Đã tạo mô hình — bấm “＋ Thêm bài” để dựng thân')
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
    try { await api.doiNhomMoHinh(mhId, nhomId); moRa(nhomId); await reload(); bao('Đã chuyển mô hình sang nhóm ' + (nhoms.find((n) => n.id === nhomId)?.ten ?? '')) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
  }

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
      {/* Thùy 19/10: cột mô hình ĐỨNG YÊN — chỉ cột phải (chuỗi · nhóm · kho bài) cuộn */}
      <aside className="flex min-h-0 w-[250px] shrink-0 flex-col">
        <div className="mb-2 flex items-center justify-between gap-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình luyện · khối {khoi}</span>
          <span className="flex gap-1">
            {chuDeId && <Btn className="!h-7 !px-2 !text-[12px]" onClick={() => setHopNhom({ id: null, ten: '', moTa: '' })} title="Nhóm mô hình: gom các mô hình tương đồng">＋ Nhóm</Btn>}
            <Btn kind="pri" className="!h-7 !px-2 !text-[12px]" disabled={!!chuDeId && !nhoms.length}
              title={chuDeId && !nhoms.length ? 'Tạo nhóm mô hình trước (＋ Nhóm)' : undefined}
              onClick={() => setHopMH({ id: null, ten: '', gt: '', anh: null, nhom: (gocMH && goc.find((m) => m.id === gocId)?.nhom_mh_id) || nhoms[0]?.id || null })}>＋ Mô hình</Btn>
          </span>
        </div>
        {chuDeId && (
          <div className="mb-2 flex gap-1">
            <Btn className="!h-7 flex-1 !px-2 !text-[12px]" onClick={() => setMoDanhMuc('dang')} title="Danh mục nhãn Dạng bài (dán cho từng ý ở tab Kho bài)">🏷 Dạng bài</Btn>
            <Btn className="!h-7 flex-1 !px-2 !text-[12px]" onClick={() => setMoDanhMuc('bode')} title="Danh mục nhãn Bổ đề (dán cho từng ý ở tab Kho bài)">🏷 Bổ đề</Btn>
          </div>
        )}
        <input className={inpCls} placeholder="Tìm mô hình…" value={tim} onChange={(e) => setTim(e.target.value)} />
        <div className="mt-2 max-h-[calc(100vh-230px)] min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {chuDeId ? (
            <>
              {nhoms.map((n, i) => {
                const ds = gocLoc.filter((m) => m.nhom_mh_id === n.id)
                if (tim.trim() && !ds.length) return null
                const gap = !moNhom[n.id] && !tim.trim()   // đang tìm thì mở hết để thấy kết quả
                return (
                  <div key={n.id}
                    onDragOver={(e) => { if (e.dataTransfer.types.includes('text/mh')) { e.preventDefault(); setKeoVao(n.id) } }}
                    onDragLeave={() => setKeoVao((x) => (x === n.id ? null : x))}
                    onDrop={(e) => { e.preventDefault(); setKeoVao(null); const id = e.dataTransfer.getData('text/mh'); if (id) void chuyenMH(id, n.id) }}
                    className={`rounded-lg border bg-slate-50/60 ${keoVao === n.id ? 'border-teal-500 ring-2 ring-teal-300' : 'border-slate-200'}`}>
                    <div className="group flex items-center gap-1 px-1.5 py-1">
                      <button onClick={() => setMoNhom((g) => ({ ...g, [n.id]: !g[n.id] }))} className="w-4 shrink-0 text-[11px] text-slate-400">{gap ? '▸' : '▾'}</button>
                      <button onClick={() => setMoNhom((g) => ({ ...g, [n.id]: !g[n.id] }))} className="min-w-0 flex-1 truncate text-left text-[12.5px] font-semibold text-slate-700" title={n.mo_ta || n.ten}>
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

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
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
                title="Thêm bài vào một giả thiết. Bài tiếp theo của 1 bài: bấm vào bài đó ⇒ ＋ Bài tiếp theo">＋ Thêm bài</Btn>
              <Btn disabled={ban} onClick={() => { const g = (cur && baiById.get(cur)?.mo_hinh_id) || gocId!; setHopGT({ id: null, cha: g, ten: '', gt: '', chinh: !conCuaNhanh(g).some((n) => laChinh(n.id)) }) }}
                title="Thêm một giả thiết rẽ ra từ giả thiết (bấm vào lục giác của giả thiết để chọn đúng chỗ)">⑂ Thêm giả thiết</Btn>
              {ban && <span className="text-[12px] text-slate-400">đang lưu…</span>}
            </div>
            {loi && <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{loi} <button className="ml-2 underline" onClick={() => setLoi(null)}>đóng</button></div>}

            {/* Lần vẽ đầu sau khi mở màn / đổi mô hình: gocId đã mới nhưng nhánh + bài còn của lần trước (nạp trong effect)
                ⇒ CHỜ tới khi danh sách nhánh có đúng gốc này, không thì tab Nhóm đọc nhánh undefined ⇒ trắng màn (Thùy 22/10). */}
            {tab !== 'kho' && !nhanhById.has(gocId!)
              ? <div className="rounded-xl border border-slate-200 bg-white p-6 text-[13px] text-slate-400">Đang tải cây…</div>
              : tab === 'kho'
              ? <TabKho gocId={gocId!} L={L} khoi={khoi} coBai={(id) => baiById.has(id)} onMo={(id) => { setCur(id); setPop(id) }} />
              : tab === 'chuoi'
              ? <TabChuoi {...{ gocId: gocId!, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, chaCua, laChinh, khung, L }}
                  onMo={(id) => { setCur(id); setPop(id) }}
                  onThemBai={(g) => setHopBai({ id: null, nhanh: g })}
                  onThemGT={(g, chinh) => setHopGT({ id: null, cha: g, ten: '', gt: '', chinh })}
                  onSuaGT={(g) => g === gocId ? setHopMH({ id: gocMH.id, ten: gocMH.ten, gt: gocMH.gia_thiet ?? '', anh: gocMH.anh_cau_hinh ?? null, nhom: gocMH.nhom_mh_id ?? null })
                    : setHopGT({ id: g, cha: chaCua(g) ?? gocId!, ten: nhanhById.get(g)?.ten ?? '', gt: nhanhById.get(g)?.gia_thiet_them ?? '', chinh: laChinh(g) })} />
              : <TabNhom {...{ gocId: gocId!, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, chaCua, laChinh, ban, L }}
                  onMo={(id) => { setCur(id); setPop(id) }} onChuyen={chuyen}
                  onSuaGT={(g) => setHopGT({ id: g, cha: chaCua(g) ?? gocId!, ten: nhanhById.get(g)?.ten ?? '', gt: nhanhById.get(g)?.gia_thiet_them ?? '', chinh: laChinh(g) })}
                  onThemGT={(g, chinh) => setHopGT({ id: null, cha: g, ten: '', gt: '', chinh })}
                  onThemSau={(id) => setHopBai({ id: null, nhanh: baiById.get(id)!.mo_hinh_id, sau: id })} />}

            <Note>
              <b>Giả thiết nối giả thiết, bài nối bài.</b> Nhánh <b>chính</b> đi thẳng xuống dưới giả thiết cha, nhánh <b>phụ</b> rẽ sang phải.
              Trong mỗi giả thiết, chuỗi bài nằm ngang theo tiền đề (bài trước → bài sau). <b>Số B1, B2…</b> chỉ để đọc; <b>mã bài không bao giờ đổi</b>.
              Bài có <span className="rounded border border-amber-400 bg-amber-50 px-1 text-[10.5px] font-bold text-amber-800">⚠</span> = tiền đề nằm ở giả thiết không thuộc đường của bài — vẫn lưu được, nhưng không in được.
            </Note>
          </>
        )}
      </div>

      {pop && baiById.get(pop) && (
        <PopupBai L={L} bai={baiById.get(pop)!} nhanhById={nhanhById} baiById={baiById} duong={duong} doSau={doSau}
          saiTienDe={sai.get(pop) ?? []} onDong={() => setPop(null)} onNhay={(id) => { setCur(id); setPop(id) }}
          onSua={() => { const b = baiById.get(pop)!; setPop(null); setHopBai({ id: b.id, nhanh: b.mo_hinh_id }) }}
          onThemSau={() => { const b = baiById.get(pop)!; setPop(null); setHopBai({ id: null, nhanh: b.mo_hinh_id, sau: b.id }) }}
          onSuaSai={(nhanhId) => chuyen(pop, nhanhId)} />
      )}
      {hopGT && (() => {
        // giả thiết cha chọn được: mọi giả thiết của cây TRỪ chính nó và nhánh con cháu của nó (cấm vòng)
        const conChau = new Set<string>(); const xuong = (id: string) => { conChau.add(id); conCuaNhanh(id).forEach((c) => xuong(c.id)) }
        if (hopGT.id) xuong(hopGT.id)
        const chaDuoc = [...nhanhs].filter((n) => !conChau.has(n.id)).sort((a, b) => doSau(a.id) - doSau(b.id) || a.ma.localeCompare(b.ma))
        const daCoChinh = conCuaNhanh(hopGT.cha).some((n) => laChinh(n.id) && n.id !== hopGT.id)
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5" onClick={() => setHopGT(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-[16px] font-semibold">{hopGT.id ? 'Sửa giả thiết' : 'Thêm giả thiết'}</h2>
            <p className="mb-3 text-[12.5px] text-slate-500">Giả thiết mới rẽ ra từ một giả thiết (không rẽ từ bài). Bài trong giả thiết mới dùng được mọi giả thiết trên đường từ giả thiết mô hình xuống.</p>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Rẽ ra từ giả thiết</label>
            <select className={inpCls} value={hopGT.cha} onChange={(e) => setHopGT({ ...hopGT, cha: e.target.value, chinh: hopGT.chinh && !conCuaNhanh(e.target.value).some((n) => laChinh(n.id) && n.id !== hopGT.id) })}>
              {chaDuoc.map((n) => <option key={n.id} value={n.id}>{'— '.repeat(doSau(n.id))}{n.id === gocId ? 'Giả thiết mô hình' : tron(n.ten)}</option>)}
            </select>
            <div className="mt-3 flex gap-2">
              {([[true, 'Nhánh chính', 'đi thẳng tiếp giả thiết cha'], [false, 'Nhánh phụ', 'rẽ sang bên']] as const).map(([v, t, m]) => (
                <button key={t} disabled={v && daCoChinh} onClick={() => setHopGT({ ...hopGT, chinh: v })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-left text-[12.5px] disabled:opacity-40 ${hopGT.chinh === v ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                  title={v && daCoChinh ? 'Giả thiết cha đã có nhánh chính' : undefined}>
                  <b>{t}</b><span className="block text-slate-500">{m}</span>
                </button>))}
            </div>
            <label className="mb-1 mt-3 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Giả thiết thêm (gõ $…$ cho công thức)</label>
            <textarea autoFocus className={`${inpCls} h-20`} value={hopGT.gt} onChange={(e) => setHopGT({ ...hopGT, gt: e.target.value })} placeholder="vd: Kẻ $AH \perp BC$ ($H \in BC$)." />
            {hopGT.gt.trim() && <div className="mt-1 rounded-md bg-slate-50 px-2 py-1 text-[12.5px]"><MathText>{hopGT.gt}</MathText></div>}
            <label className="mb-1 mt-3 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tên ngắn (bỏ trống = dùng giả thiết thêm)</label>
            <input className={inpCls} value={hopGT.ten} onChange={(e) => setHopGT({ ...hopGT, ten: e.target.value })} placeholder="vd: Kẻ AH ⊥ BC" />
            <div className="mt-4 flex justify-end gap-2">
              <Btn onClick={() => setHopGT(null)}>Huỷ</Btn>
              <Btn kind="pri" disabled={ban || !hopGT.gt.trim()} onClick={() => void luuGT()}>{hopGT.id ? 'Lưu' : 'Thêm giả thiết'}</Btn>
            </div>
          </div>
        </div>) })()}
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
      {moDanhMuc && (
        <div className="fixed inset-0 z-[65] flex flex-col bg-slate-50">
          <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
            <span className="text-[15px] font-semibold text-slate-900">🏷 Danh mục {moDanhMuc === 'dang' ? 'Dạng bài' : 'Bổ đề'} · Hình</span>
            <span className="text-[12px] text-slate-500">Nhãn dán cho từng ý ở tab ③ Kho bài · ý lớp trên dùng được nhãn lớp dưới, không chiều ngược</span>
            <Btn className="ml-auto" onClick={() => setMoDanhMuc(null)}>✕ Đóng</Btn>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-5"><Catalog L={L} khoi={khoi} loai={moDanhMuc} reload={reload} /></div>
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
          sau={hopBai.sau ? baiById.get(hopBai.sau) ?? null : null}
          nhanhs={nhanhs} bais={bais} doSau={doSau} ban={ban} onDong={() => setHopBai(null)} onLuu={luuBai} />
      )}
      {thongBao && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] text-white shadow-lg">{thongBao}</div>}
    </div>
  )
}

/** ③ KHO BÀI của mô hình — CEO 14/10: "kho là các chuỗi bài, mỗi chuỗi 1 dòng".
 *  Một chuỗi = một bài kho với các ý a → b → c; mỗi ý hiện số bài mô hình nó gán (bấm để mở bài đó). Bấm dòng để xem đề + lời giải. */
function TabKho({ gocId, L, khoi, coBai, onMo }: { gocId: string; L: Luoi; khoi: string; coBai: (id: string) => boolean; onMo: (baitoanId: string) => void }) {
  const [rows, setRows] = useState<ChuoiKho[] | null>(null)
  // NHÃN Dạng bài / Bổ đề của từng ý (Thùy 19/10) — vá tại chỗ sau mỗi thao tác
  const [nhan, setNhan] = useState<api.NhanY[]>([])
  const [deXuat, setDeXuat] = useState<api.DeXuatNhanY[]>([])
  const [locNhan, setLocNhan] = useState('')            // '' | 'chua' | 'dang:<id>' | 'bo_de:<id>'
  const [them, setThem] = useState<string | null>(null)  // ý đang mở ô thêm nhãn
  const [loiNhan, setLoiNhan] = useState<string | null>(null)
  const soK = (k: string | null) => (k ? parseInt(k, 10) || 0 : 0)
  const dungDuoc = (k: string | null) => !k || soK(k) <= soK(khoi)   // nhãn lớp ≤ khối đang xem
  const tenNhan = (loai: api.LoaiNhanY, id: string) => loai === 'dang'
    ? (L.dang.find((d) => d.id === id)?.ten ?? '?') : (L.boDe.find((b) => b.id === id)?.ten ?? '?')
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [tim, setTim] = useState('')
  const [conThieu, setConThieu] = useState(false)
  useEffect(() => {
    let huy = false
    setRows(null); setLoi(null); setMo(null)
    api.khoCuaMoHinh(gocId).then(async (r) => {
      if (huy) return
      setRows(r)
      const n = await api.nhanCuaCacY(r.flatMap((c) => c.y.map((y) => y.id)))
      if (!huy) { setNhan(n.nhan); setDeXuat(n.deXuat) }
    }).catch((e) => { if (!huy) setLoi(e.message ?? String(e)) })
    return () => { huy = true }
  }, [gocId])
  const datNhan = async (yId: string, loai: api.LoaiNhanY, nhanId: string, bat: boolean) => {
    setLoiNhan(null)
    try {
      await api.datNhanY(yId, loai, nhanId, bat)
      setNhan((p) => bat ? [...p.filter((x) => !(x.y_id === yId && x.loai === loai && x.nhan_id === nhanId)), { y_id: yId, loai, nhan_id: nhanId, nguon: 'nguoi' }]
        : p.filter((x) => !(x.y_id === yId && x.loai === loai && x.nhan_id === nhanId)))
      setDeXuat((p) => p.filter((x) => !(x.y_id === yId && x.loai === loai && x.nhan_id === nhanId)))
    } catch (e: any) { setLoiNhan(e.message ?? String(e)) }
  }
  const quyet = async (d: api.DeXuatNhanY, nhanVao: boolean) => {
    setLoiNhan(null)
    try {
      await api.quyetDeXuatNhanY(d.id, nhanVao)
      setDeXuat((p) => p.filter((x) => x.id !== d.id))
      if (nhanVao) setNhan((p) => [...p, { y_id: d.y_id, loai: d.loai, nhan_id: d.nhan_id, nguon: 'ai' }])
    } catch (e: any) { setLoiNhan(e.message ?? String(e)) }
  }
  const hien = useMemo(() => {
    const k = tim.trim().toLowerCase()
    const [locLoai, locId] = locNhan.split(':')
    const yHop = (yId: string) => locNhan === 'chua' ? !nhan.some((x) => x.y_id === yId)
      : nhan.some((x) => x.y_id === yId && x.loai === locLoai && x.nhan_id === locId)
    return (rows ?? []).filter((c) => (!conThieu || c.y.some((y) => !y.so)) && (!locNhan || c.y.some((y) => yHop(y.id)))
      && (!k || `${c.ma_bai} ${c.nguon ?? ''} ${c.gia_thiet_chung ?? ''} ${c.y.map((y) => y.noi_dung).join(' ')}`.toLowerCase().includes(k)))
  }, [rows, tim, conThieu, locNhan, nhan])
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
        <select className={inpCls + ' !w-64'} value={locNhan} onChange={(e) => setLocNhan(e.target.value)} title="Lọc chuỗi có ý mang nhãn này">
          <option value="">— lọc theo nhãn —</option>
          <option value="chua">⚠ còn ý chưa có nhãn</option>
          <optgroup label="Dạng bài">{L.dang.filter((d) => dungDuoc(d.khoi)).map((d) => <option key={d.id} value={`dang:${d.id}`}>{d.ten}</option>)}</optgroup>
          <optgroup label="Bổ đề">{L.boDe.filter((b) => dungDuoc(b.khoi)).map((b) => <option key={b.id} value={`bo_de:${b.id}`}>{b.ten}</option>)}</optgroup>
        </select>
        <span className="text-[12px] text-slate-400">{hien.length}/{rows.length} chuỗi{deXuat.length ? ` · ✨ ${deXuat.length} gợi ý nhãn chờ duyệt` : ''}</span>
      </div>
      {loiNhan && <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[12.5px] text-red-700">{loiNhan} <button className="ml-2 underline" onClick={() => setLoiNhan(null)}>đóng</button></div>}
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
                    {/* Nhãn Dạng bài / Bổ đề của ý — chip đặc = đã dán · chip ✨ nét đứt = Claude gợi ý chờ duyệt */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[12px]">
                      {nhan.filter((x) => x.y_id === y.id).map((x) => (
                        <span key={x.loai + x.nhan_id} className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${x.loai === 'dang' ? 'bg-violet-100 text-violet-800' : 'bg-amber-100 text-amber-800'}`}
                          title={(x.loai === 'dang' ? 'Dạng bài' : 'Bổ đề') + (x.nguon === 'ai' ? ' · Claude gợi ý, đã duyệt' : '')}>
                          {x.loai === 'dang' ? '⌥' : '◦'} {tron(tenNhan(x.loai, x.nhan_id))}
                          <button onClick={() => void datNhan(y.id, x.loai, x.nhan_id, false)} className="opacity-50 hover:opacity-100" title="Gỡ nhãn">✕</button>
                        </span>))}
                      {deXuat.filter((d) => d.y_id === y.id).map((d) => (
                        <span key={d.id} className="flex items-center gap-1 rounded-full border border-dashed border-sky-400 bg-sky-50 px-2 py-0.5 text-sky-800" title={`Claude gợi ý: ${d.ly_do}`}>
                          ✨ {d.loai === 'dang' ? 'Dạng' : 'Bổ đề'}: {tron(tenNhan(d.loai, d.nhan_id))}
                          <button onClick={() => void quyet(d, true)} className="font-bold text-emerald-700" title="Đúng — dán nhãn">✓</button>
                          <button onClick={() => void quyet(d, false)} className="text-rose-600" title="Sai — bỏ gợi ý">✕</button>
                        </span>))}
                      {them === y.id ? (
                        <select autoFocus className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[12px]" value=""
                          onBlur={() => setThem(null)}
                          onChange={(e) => { const [lo, id] = e.target.value.split(':'); if (id) void datNhan(y.id, lo as api.LoaiNhanY, id, true); setThem(null) }}>
                          <option value="">— chọn nhãn —</option>
                          <optgroup label="Dạng bài">{L.dang.filter((d) => dungDuoc(d.khoi) && !nhan.some((x) => x.y_id === y.id && x.nhan_id === d.id)).map((d) => <option key={d.id} value={`dang:${d.id}`}>{d.ten}</option>)}</optgroup>
                          <optgroup label="Bổ đề">{L.boDe.filter((b) => dungDuoc(b.khoi) && !nhan.some((x) => x.y_id === y.id && x.nhan_id === b.id)).map((b) => <option key={b.id} value={`bo_de:${b.id}`}>{b.ten}</option>)}</optgroup>
                        </select>
                      ) : (
                        <button onClick={() => setThem(y.id)} className="rounded-full border border-slate-300 px-2 py-0.5 text-slate-500 hover:border-violet-400 hover:text-violet-700">＋ nhãn</button>
                      )}
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

// ══════════════════ TAB ① CHUỖI — sơ đồ giả thiết (mockup chốt 22/10) ══════════════════
type ChungProps = {
  gocId: string; lan: Map<string, string[]>; nhanhs: MoHinh[]
  baiById: Map<string, BaiX>; nhanhById: Map<string, MoHinh>; sai: Map<string, string[]>; cur: string | null
  doSau: (id: string) => number; baiCaNhanh: (id: string) => number; conCuaNhanh: (id: string) => MoHinh[]
  chaCua: (id: string) => string | null; laChinh: (id: string) => boolean
}
const soB = (so: string | undefined) => parseInt((so ?? '').replace(/\D/g, ''), 10) || 1e6
const mauGT = (laGoc: boolean, chinh: boolean) => (laGoc ? MAU[0] : chinh ? MAU[1] : MAU[2])
const tenGT = (laGoc: boolean, chinh: boolean) => (laGoc ? 'Giả thiết mô hình' : chinh ? 'Nhánh chính' : 'Nhánh phụ')
function TabChuoi(p: ChungProps & {
  khung: React.RefObject<HTMLDivElement>; L: Luoi
  onMo: (id: string) => void; onThemBai: (gt: string) => void; onThemGT: (gt: string, chinh: boolean) => void; onSuaGT: (gt: string) => void
}) {
  const { gocId, nhanhs, baiById, sai, cur, conCuaNhanh, chaCua, laChinh, khung, L } = p
  const [menu, setMenu] = useState<string | null>(null)
  const td = useMemo(() => new Map([...baiById.keys()].map((id) => [id, api.tienDeCua(L, id)])), [baiById, L])
  const bc = useMemo(() => api.xepGiaThiet({
    gocId,
    gt: nhanhs.map((n) => ({ id: n.id, cha: n.id === gocId ? null : chaCua(n.id), chinh: laChinh(n.id) })),
    bai: [...baiById.values()].map((b) => ({ id: b.id, gt: b.mo_hinh_id, so: soB(b.so), tienDe: td.get(b.id) ?? [] })),
  }), [gocId, nhanhs, baiById, chaCua, laChinh, td])

  // nhớ vị trí cuộn theo gốc
  useEffect(() => {
    const el = khung.current; if (!el) return
    const [x, y] = NHO.cuon[gocId] ?? [0, 0]; el.scrollLeft = x; el.scrollTop = y
    const luu = () => { NHO.cuon[gocId] = [el.scrollLeft, el.scrollTop] }
    el.addEventListener('scroll', luu, { passive: true })
    return () => el.removeEventListener('scroll', luu)
  }, [gocId, khung])

  const { W, H, GX, HEX } = api.KT_GT
  const OX = 12, OY = 12
  const tdCur = new Set(cur ? td.get(cur) ?? [] : [])
  const sauCur = new Set(cur ? [...td].filter(([, ts]) => ts.includes(cur)).map(([id]) => id) : [])
  const day: JSX.Element[] = []
  // giả thiết → giả thiết: chính thẳng xuống · phụ rẽ phải
  for (const n of nhanhs) {
    if (n.id === gocId) continue
    const cha = chaCua(n.id); const a = cha ? bc.khoi.get(cha) : null; const b = bc.khoi.get(n.id)
    if (!a || !b) continue
    const chinh = laChinh(n.id)
    day.push(chinh
      ? <path key={'g' + n.id} d={`M${OX + a.x + 40},${OY + a.y + a.h} V${OY + b.y + 8}`} stroke={MAU[1].dac} strokeWidth={3} fill="none" markerEnd="url(#gt-c)" />
      : <path key={'g' + n.id} d={`M${OX + a.x + a.w},${OY + a.y + 8 + HEX / 2} H${OX + (a.x + a.w + b.x) / 2} V${OY + b.y + 8 + HEX / 2} H${OX + b.x}`} stroke={MAU[2].dac} strokeWidth={2.4} fill="none" markerEnd="url(#gt-p)" />)
  }
  // bài → bài (dây của chuỗi): cùng hàng thẳng; khác hàng đi trong KHE giữa 2 cột, không đè thẻ
  for (const [id, tu] of bc.boi) {
    if (!tu) continue
    const P = bc.bai.get(tu), Q = bc.bai.get(id); if (!P || !Q) continue
    const sang = cur === id || cur === tu
    day.push(<path key={'b' + id} d={P.y === Q.y
      ? `M${OX + P.x + W},${OY + P.y + H / 2} H${OX + Q.x}`
      : `M${OX + P.x + W},${OY + P.y + H / 2} H${OX + P.x + W + GX / 2} V${OY + Q.y + H / 2} H${OX + Q.x}`}
      stroke={sang ? '#2563eb' : '#64748b'} strokeWidth={sang ? 2.2 : 1.6} fill="none" markerEnd={`url(#${sang ? 'gt-t' : 'gt-b'})`} />)
  }

  return (
    <>
      <div ref={khung} className="max-h-[calc(100vh-330px)] min-h-[220px] overflow-auto rounded-xl border border-slate-200 bg-white p-2.5" onClick={() => setMenu(null)}>
        <div className="relative" style={{ width: bc.rong + 2 * OX, height: bc.cao + 2 * OY + (menu ? 120 : 0) }}>
          {/* khối giả thiết */}
          {nhanhs.map((n) => { const k = bc.khoi.get(n.id); if (!k) return null; const m = mauGT(n.id === gocId, laChinh(n.id)); return (
            <div key={'k' + n.id} className="absolute rounded-2xl border border-dashed" style={{ left: OX + k.x, top: OY + k.y, width: k.w, height: k.h, background: m.nhat, borderColor: m.vien }} />) })}
          <svg className="pointer-events-none absolute left-0 top-0" width={bc.rong + 2 * OX} height={bc.cao + 2 * OY} style={{ zIndex: 2 }}>
            <defs>
              {[['b', '#64748b'], ['t', '#2563eb']].map(([k, c]) => (
                <marker key={k} id={`gt-${k}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6" fill="none" stroke={c} strokeWidth="1.4" /></marker>))}
              {[['c', MAU[1].dac], ['p', MAU[2].dac]].map(([k, c]) => (
                <marker key={k} id={`gt-${k}`} markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={c} /></marker>))}
            </defs>
            {day}
          </svg>
          {/* lục giác giả thiết — bấm để thêm bài / nhánh, sửa */}
          {nhanhs.map((n) => { const k = bc.khoi.get(n.id); if (!k) return null; const laGoc = n.id === gocId; const chinh = laChinh(n.id); const m = mauGT(laGoc, chinh)
            const gt = laGoc ? n.gia_thiet : n.gia_thiet_them; const coChinh = conCuaNhanh(n.id).some((c) => laChinh(c.id)); return (
            <div key={'h' + n.id}>
              <button onClick={(e) => { e.stopPropagation(); setMenu(menu === n.id ? null : n.id) }} title={tron(gt ?? '') + ' — bấm để thêm bài / giả thiết'}
                className="absolute flex flex-col justify-center px-6 text-left text-white hover:brightness-110"
                style={{ left: OX + k.x, top: OY + k.y + 8, width: k.w, height: HEX, background: m.dac, clipPath: LUC_GIAC, zIndex: 3 }}>
                <b className="truncate text-[12px] leading-tight">{tenGT(laGoc, chinh)}{laGoc ? '' : ': ' + tron(n.ten)} <span className="font-normal opacity-80">· {p.baiCaNhanh(n.id) - conCuaNhanh(n.id).reduce((s, c) => s + p.baiCaNhanh(c.id), 0)} bài ▾</span></b>
                <span className="truncate text-[10.5px] opacity-90">{tron(gt ?? '')}</span>
              </button>
              {menu === n.id && (
                <div className="absolute z-20 w-56 rounded-xl border border-slate-200 bg-white p-1.5 text-[12.5px] shadow-xl" style={{ left: OX + k.x + Math.min(k.w - 230, 40), top: OY + k.y + 8 + HEX + 4 }} onClick={(e) => e.stopPropagation()}>
                  <button className="block w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-100" onClick={() => { setMenu(null); p.onThemBai(n.id) }}>＋ Bài trong giả thiết này</button>
                  <button disabled={coChinh} className="block w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-100 disabled:opacity-40" title={coChinh ? 'Đã có nhánh chính' : undefined} onClick={() => { setMenu(null); p.onThemGT(n.id, true) }}>⑂ Nhánh chính (đi thẳng xuống)</button>
                  <button className="block w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-100" onClick={() => { setMenu(null); p.onThemGT(n.id, false) }}>⑂ Nhánh phụ (rẽ sang phải)</button>
                  <button className="block w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-100" onClick={() => { setMenu(null); p.onSuaGT(n.id) }}>✎ {laGoc ? 'Sửa mô hình' : 'Sửa / dời giả thiết'}</button>
                </div>)}
            </div>) })}
          {/* thẻ bài */}
          {[...bc.bai].map(([id, o]) => { const b = baiById.get(id); if (!b) return null; const w = sai.has(id); const khac = (td.get(id) ?? []).filter((t) => t !== bc.boi.get(id)); return (
            <div key={id} onClick={(e) => { e.stopPropagation(); p.onMo(id) }} title={tron(b.phat_bieu)}
              className={`absolute cursor-pointer overflow-hidden rounded-lg border-[1.5px] px-2 py-[3px] text-[11.5px] leading-tight transition hover:shadow-md ${w ? 'bg-amber-50' : 'bg-white'} ${cur === id ? 'ring-2 ring-blue-500' : tdCur.has(id) ? 'ring-2 ring-blue-300' : sauCur.has(id) ? 'ring-2 ring-emerald-300' : ''}`}
              style={{ left: OX + o.x, top: OY + o.y, width: W, height: H, borderColor: w ? '#f59e0b' : '#94a3b8', zIndex: 3 }}>
              <div className="flex items-center gap-1">
                <b className="text-[12.5px] text-slate-900">{b.so || '…'}</b>
                {w && <span className="rounded border border-amber-400 bg-amber-100 px-1 text-[9.5px] font-bold text-amber-800">⚠</span>}
                {!!khac.length && <span className="ml-auto truncate text-[10px] text-blue-600" title="Tiền đề khác (khác hàng / ở giả thiết trên)">← {khac.map((t) => baiById.get(t)?.so ?? '?').join(', ')}</span>}
              </div>
              <div className="line-clamp-2 text-slate-500">{tron(b.phat_bieu)}</div>
            </div>) })}
        </div>
      </div>
      <div className="mt-2 text-[11.5px] text-slate-500">
        Lục giác = giả thiết (bấm để thêm bài / nhánh) · <span style={{ color: MAU[1].dac }}>mũi tên xanh</span> = nhánh chính · <span style={{ color: MAU[2].dac }}>mũi tên tím</span> = nhánh phụ ·
        thẻ trắng = bài, mũi tên xám = bài trước → bài sau · chữ xanh góc thẻ = tiền đề khác · bấm bài: viền xanh nhạt = tiền đề của nó, xanh lá = bài đi tiếp từ nó.
      </div>
    </>
  )
}

// ══════════════════ TAB ② NHÓM ══════════════════
function TabNhom(p: ChungProps & {
  ban: boolean; L: Luoi
  onMo: (id: string) => void; onChuyen: (bai: string, nhanh: string) => void
  onSuaGT: (id: string) => void; onThemGT: (id: string, chinh: boolean) => void; onThemSau: (bai: string) => void
}) {
  const { gocId, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, laChinh, ban } = p
  const nhanhXep = useMemo(() => [...nhanhs].sort((a, b) => doSau(a.id) - doSau(b.id) || a.ma.localeCompare(b.ma)), [nhanhs, doSau])
  const Hop = ({ nid }: { nid: string }): JSX.Element => {
    const n = nhanhById.get(nid); if (!n) return <></>
    const laGoc = nid === gocId; const chinh = laChinh(nid); const m = mauGT(laGoc, chinh); const cua = lan.get(nid) ?? []
    const coChinh = conCuaNhanh(nid).some((c) => laChinh(c.id))
    return (
      <div className={`my-2.5 rounded-xl border-2 p-3 ${!laGoc && !chinh ? 'ml-6' : ''}`} style={{ borderColor: m.vien, background: m.nhat }}>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full px-2 py-px text-[11px] font-semibold text-white" style={{ background: m.dac }}>{laGoc ? 'Giả thiết mô hình' : chinh ? '↓ Nhánh chính' : '↱ Nhánh phụ'}</span>
          {!laGoc && <b className="text-[13.5px] text-slate-900">{tron(n.ten)}</b>}
          <Ma>{n.ma}</Ma>
          <span className="text-[11px] text-slate-400">{cua.length} bài · {baiCaNhanh(nid)} bài cả nhánh con</span>
          <span className="ml-auto flex gap-2 text-[11.5px]">
            <button className="text-blue-600 hover:underline disabled:opacity-40" disabled={coChinh} onClick={() => p.onThemGT(nid, true)}>⑂ nhánh chính</button>
            <button className="text-violet-700 hover:underline" onClick={() => p.onThemGT(nid, false)}>⑂ nhánh phụ</button>
            {!laGoc && <button className="text-blue-600 hover:underline" onClick={() => p.onSuaGT(nid)}>✎ sửa / dời</button>}
          </span>
        </div>
        <div className="mb-2 rounded-md px-2 py-1 text-[12px] text-white" style={{ background: m.dac }}>
          <b>{laGoc ? 'Giả thiết:' : '+ Giả thiết thêm:'}</b> <MathText className="inline">{(laGoc ? n.gia_thiet : n.gia_thiet_them) || '(chưa ghi)'}</MathText>
        </div>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-2">
          <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Bài của giả thiết này · {cua.length}</div>
          {!cua.length && <div className="text-[11.5px] text-slate-400">— chưa có —</div>}
          {cua.map((id) => { const b = baiById.get(id); if (!b) return null; const tds = api.tienDeCua(p.L, id); return (
            <div key={id} className={`flex items-center gap-2 rounded-md px-1.5 py-1 text-[12.5px] ${cur === id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
              <b className="w-10 shrink-0 cursor-pointer" onClick={() => p.onMo(id)}>{b.so || '…'}</b>
              <div className="min-w-0 flex-1 cursor-pointer truncate" onClick={() => p.onMo(id)}>{tron(b.phat_bieu)}</div>
              {!!tds.length && <span className="shrink-0 text-[10.5px] text-blue-600" title="Tiền đề">← {tds.map((t) => baiById.get(t)?.so ?? '?').join(', ')}</span>}
              {sai.has(id) && <span className="rounded border border-amber-400 bg-amber-50 px-1 text-[10px] font-bold text-amber-800">⚠ sai nhánh</span>}
              <Ma>{b.ma}</Ma>
              <button disabled={ban} onClick={() => p.onThemSau(id)} className="rounded border border-teal-300 px-1.5 text-teal-700 hover:bg-teal-50 disabled:opacity-30" title="Tạo bài tiếp theo của bài này (tiền đề = bài này)">＋</button>
              <select disabled={ban} className="max-w-[170px] rounded-md border border-slate-300 bg-white px-1 py-0.5 text-[11.5px]" value={nid}
                onChange={(e) => p.onChuyen(id, e.target.value)} title="Chuyển bài sang giả thiết khác…">
                {nhanhXep.map((x) => <option key={x.id} value={x.id}>{'— '.repeat(doSau(x.id))}{x.id === gocId ? 'Giả thiết mô hình' : tron(x.ten)}</option>)}
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
function PopupBai({ L, bai, nhanhById, baiById, duong, doSau, saiTienDe, onDong, onNhay, onSuaSai, onSua, onThemSau }: {
  L: Luoi; bai: BaiX; nhanhById: Map<string, MoHinh>; baiById: Map<string, BaiX>
  duong: (id: string) => string[]; doSau: (id: string) => number; saiTienDe: string[]
  onDong: () => void; onNhay: (id: string) => void; onSuaSai: (nhanhId: string) => void; onSua: () => void
  onThemSau: () => void
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
          <span className="rounded-full px-2 py-px text-[11.5px] font-semibold text-white" style={{ background: m.dac }}>{ds.length > 1 ? tron(ds[ds.length - 1].ten) : 'Giả thiết mô hình'}</span>
          {!!saiTienDe.length && <span className="rounded border border-amber-400 bg-amber-50 px-1.5 text-[11px] font-bold text-amber-800">⚠ sai nhánh</span>}
          <Btn kind="pri" className="ml-auto" onClick={onThemSau} title="Tạo bài tiếp theo của bài này (tiền đề = bài này); chọn được giả thiết khác">＋ Bài tiếp theo</Btn>
          <Btn onClick={onSua}>✎ Sửa bài</Btn>
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
function FormBai({ L, sua, sau, nhanhMacDinh, gocId, nhanhs, bais, doSau, ban, onDong, onLuu }: {
  L: Luoi; sua: BaiX | null; sau?: BaiX | null; nhanhMacDinh: string; gocId: string; nhanhs: MoHinh[]; bais: BaiX[]
  doSau: (id: string) => number; ban: boolean; onDong: () => void; onLuu: (v: api.BaiNhap, nhanhId: string) => void
}) {
  const cach = sua ? api.cachMacDinh(L, sua.id) : null
  const [nhanh, setNhanh] = useState(nhanhMacDinh)
  const [pb, setPb] = useState(sua?.phat_bieu ?? '')
  const [gt, setGt] = useState(sua?.gia_thiet_rieng ?? '')
  const [lg, setLg] = useState(cach?.loi_giai ?? '')
  const [anh, setAnh] = useState<string | null>(sua?.anh_chuan ?? null)
  // TIỀN ĐỀ = thuộc tính của bài (Thùy 22/10, như màn Hình bản trước): danh sách có thứ tự, cái đầu = tiền đề CHÍNH.
  // Không bắt buộc liền nhau, nhiều cái được. Mặc định: bài tiếp theo ⇒ bài trước nó.
  const [td, setTd] = useState<string[]>(() => (sua ? api.tienDeCua(L, sua.id) : sau ? [sau.id] : []))
  const [chonTd, setChonTd] = useState(false)
  const [timTd, setTimTd] = useState('')
  const nhanhXep = [...nhanhs].sort((a, b) => doSau(a.id) - doSau(b.id) || a.ma.localeCompare(b.ma))
  const tenLan = (id: string) => (id === gocId ? 'Giả thiết mô hình' : tron(nhanhs.find((n) => n.id === id)?.ten ?? ''))
  // bài chọn được làm tiền đề, gom theo làn (thân → nhánh), mỗi làn theo số
  const ungVien = useMemo(() => {
    const q = timTd.trim().toLowerCase()
    return nhanhXep.map((n) => ({
      n, ds: bais.filter((b) => b.mo_hinh_id === n.id && b.id !== sua?.id && !td.includes(b.id)
        && (!q || `${b.so} ${b.ma} ${tron(b.phat_bieu)}`.toLowerCase().includes(q))).sort((a, b) => soSanhSo(a.so, b.so)),
    })).filter((g) => g.ds.length)
  }, [nhanhXep, bais, sua, td, timTd])
  const laSau = !!sau
  const tieuDe = sua ? 'Sửa bài ' + sua.so : laSau ? `Bài tiếp theo của ${sau!.so}` : 'Thêm bài'
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-900/45 p-5" onClick={onDong}>
      <div className="max-h-[94vh] w-full max-w-[1100px] overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2.5">
          <h2 className="text-[16px] font-semibold">{tieuDe}</h2>
          {sua && <Ma big>{sua.ma}</Ma>}
          {!sua && (
            <label className="ml-auto flex items-center gap-2 text-[12px] text-slate-500">Thuộc giả thiết
              <select className={inpCls + ' w-auto'} value={nhanh} onChange={(e) => setNhanh(e.target.value)} title="Bài thuộc giả thiết nào (dùng được mọi giả thiết trên đường từ giả thiết mô hình xuống)">
                {nhanhXep.map((n) => <option key={n.id} value={n.id}>{'— '.repeat(doSau(n.id))}{n.id === gocId ? 'Giả thiết mô hình' : tron(n.ten)}</option>)}
              </select>
            </label>)}
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
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Bài toán tiền đề</span>
                <span className="text-[11px] text-slate-400">cần CẢ · bài phải giải trước</span>
                <Btn className="ml-auto !h-7 !text-[12px]" onClick={() => setChonTd((v) => !v)}>{chonTd ? 'Đóng danh sách' : '＋ Thêm tiền đề'}</Btn>
              </div>
              {!td.length
                ? <div className="text-[12px] text-slate-400">Chưa có tiền đề — bài suy thẳng từ giả thiết.</div>
                : <div className="space-y-1">{td.map((id, i) => { const b = bais.find((x) => x.id === id); return (
                    <div key={id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-[12.5px]">
                      {i === 0 ? <span className="rounded bg-blue-100 px-1.5 py-px text-[10px] font-semibold text-blue-700">chính</span>
                        : <button className="rounded px-1 text-[10px] text-slate-400 hover:bg-blue-50 hover:text-blue-700" title="Đặt làm tiền đề chính" onClick={() => setTd((p) => [id, ...p.filter((x) => x !== id)])}>↑ chính</button>}
                      <b className="w-12 shrink-0">{b?.so ?? '—'}</b>
                      <span className="min-w-0 flex-1 truncate">{b ? tron(b.phat_bieu) : 'bài ngoài cây này'}</span>
                      {b && <span className="shrink-0 text-[10.5px] text-slate-400">{tenLan(b.mo_hinh_id)}</span>}
                      <button onClick={() => setTd((p) => p.filter((x) => x !== id))} className="shrink-0 text-slate-400 hover:text-rose-600" title="Bỏ tiền đề">✕</button>
                    </div>) })}</div>}
              {chonTd && (
                <div className="mt-2 rounded-lg border border-slate-200 p-2">
                  <input className={inpCls} value={timTd} onChange={(e) => setTimTd(e.target.value)} placeholder="Tìm theo số, mã, nội dung…" />
                  <div className="mt-1.5 max-h-52 space-y-1.5 overflow-auto">
                    {!ungVien.length && <div className="px-1 text-[12px] text-slate-400">Không còn bài nào để chọn.</div>}
                    {ungVien.map(({ n, ds }) => (
                      <div key={n.id}>
                        <div className="px-1 text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: mau(doSau(n.id)).dac }}>{'— '.repeat(doSau(n.id))}{tenLan(n.id)}</div>
                        {ds.map((b) => (
                          <button key={b.id} onClick={() => setTd((p) => [...p, b.id])} className="flex w-full items-center gap-2 rounded px-1.5 py-0.5 text-left text-[12.5px] hover:bg-blue-50">
                            <b className="w-12 shrink-0">{b.so}</b><span className="truncate">{tron(b.phat_bieu)}</span>
                          </button>))}
                      </div>))}
                  </div>
                </div>)}
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between"><NhanO>Lời giải / đáp án</NhanO><OcrButton onText={(t) => setLg((p) => (p ? p + '\n' : '') + t)} /></div>
            <textarea className={inpCls + ' h-56 font-mono text-[12.5px]'} value={lg} onChange={(e) => setLg(e.target.value)} placeholder="Lời giải chi tiết…" />
            {lg.trim() && <div className="mt-1 max-h-64 overflow-auto rounded-md border border-emerald-200 bg-emerald-50/60 p-2 text-[13px]"><MathText>{lg}</MathText></div>}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="mr-auto text-[11.5px] text-slate-400">{sua ? 'Sửa nội dung không đổi mã bài.' : 'Bài nối với bài trước qua TIỀN ĐỀ (không nối vào giả thiết). Mã bài không bao giờ đổi.'}</span>
          <Btn onClick={onDong}>Huỷ</Btn>
          <Btn kind="pri" disabled={ban || !pb.trim()}
            onClick={() => onLuu({ phatBieu: pb.trim(), giaThietRieng: gt.trim() || null, loiGiai: lg.trim() || null, anh, tienDe: td }, nhanh)}>{sua ? 'Lưu' : 'Thêm bài'}</Btn>
        </div>
      </div>
    </div>
  )
}
const Muc = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div><div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{ten}</div><div className="text-[13.5px]">{children}</div></div>
)
