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
import type { BaiCay, ChuoiKho, DemKho, KetQuaCay, MoHinhLuyen } from '../../../lib/kho/hinhCay'
import { ChonMoHinh } from '../../duyetloigiai/HinhLuyenChuaPhanTab'
import { MathText, LoiGiaiXem } from '../ui'
import { AnhInput, Btn, Empty, Fig, Ma, Note, OcrButton, Seg, inpCls, tron } from './hinhUi'
import Catalog from './Catalog'
import ChuoiHinhPrintView, { type KhoiIn } from './ChuoiHinhPrintView'

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
const soSanhSo = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })
// Độ khó 1–5 (Thùy 23/10) hiện bằng sao — dùng chung thẻ bài, popup, kho, bản in
export const SAO = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))
// Nhãn gom theo bài (vá tại chỗ sau mỗi thao tác)
type NhanGon = { doKho: number | null; dang: string[]; boDe: string[] }
const KHONG_NHAN: NhanGon = { doKho: null, dang: [], boDe: [] }

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
  const [nhanBai, setNhanBai] = useState<api.NhanBai[]>([])             // Độ khó · Dạng bài · Bổ đề của bài (Thùy 23/10)
  // NHÓM BÀI (spec-hinh-cay-nhanh §13, Thùy 09/11): nút nhóm (giả thiết = đầu ra) + thành viên "cho … ⇒ hỏi …"
  const [nhomBai, setNhomBai] = useState<api.NhomBai[]>([])
  const [hopNB, setHopNB] = useState<{ nhom: string; moi: boolean; ds: { id?: string; nd: string }[] } | null>(null)
  const [hopTV, setHopTV] = useState<{ nhom: string; id: string | null; chuyen: string | null; ten: string; gt: string; chon: Record<string, 'cho' | 'hoi' | ''> } | null>(null)
  const [inChuoi, setInChuoi] = useState(false)
  const [cur, setCur] = useState<string | null>(null)                    // bài đang chọn (tập trung)
  const [pop, setPop] = useState<string | null>(null)                    // bài đang mở popup
  const [dangTai, setDangTai] = useState(false)
  const [ban, setBan] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [thongBao, setThongBao] = useState<string | null>(null)
  // thêm / sửa GIẢ THIẾT: id = null ⇒ thêm con của `cha`; id ≠ null ⇒ sửa (tên, giả thiết thêm, dời cha, chính/phụ)
  const [hopGT, setHopGT] = useState<{ id: string | null; cha: string; ten: string; gt: string; chinh: boolean } | null>(null)
  // ⭐ 09/11 (spec-hinh-cay-nhanh §13.6 bước 1): BỎ tầng Nhóm mô hình khỏi màn — mô hình xếp thẳng dưới chủ đề.
  //   Bảng/cột nhóm (hinh_nhom_mo_hinh, nhom_mh_id) CÒN NGUYÊN trong DB, chỉ xoá khi Thùy gật riêng (bước 2).
  const [hopMH, setHopMH] = useState<{ id: string | null; ten: string; gt: string; anh: string | null } | null>(null)   // tạo / sửa mô hình gốc
  const [moDanhMuc, setMoDanhMuc] = useState<'dang' | 'bode' | null>(null)   // Thùy 19/10: danh mục Dạng bài / Bổ đề dời sang kho mới
  // thêm / sửa bài · `sau` = bài tiếp theo của bài đó (tiền đề mặc định = bài đó)
  const [hopBai, setHopBai] = useState<{ id: string | null; nhanh: string; sau?: string } | null>(null)
  const soRef = useRef(new Map<string, string>())      // số hiển thị đang có (từ RPC) — giữ qua các lần lưới nạp lại
  const khung = useRef<HTMLDivElement>(null)

  const setGocId = (id: string | null) => { NHO.gocId = id; setGocIdRaw(id) }
  useEffect(() => { api.demKhoMoHinh(khoi).then(setDemKho).catch(() => {}) }, [khoi])
  useEffect(() => { NHO.tab = tab }, [tab])
  useEffect(() => { NHO.tim = tim }, [tim])
  useEffect(() => { luuNho() }, [tab, gocId])   // nhớ cho các lần truy cập sau (sau khi NHO đã cập nhật ở các effect trên)
  const bao = (s: string) => { setThongBao(s); window.setTimeout(() => setThongBao((x) => (x === s ? null : x)), 2600) }

  // ── ĐỔI gốc (đổi ngữ cảnh ⇒ reset là đúng): lấy số hiển thị + cờ sai nhánh từ DB ──
  useEffect(() => {
    setCur(null); setPop(null); setLoi(null); setNhanBai([]); setNhomBai([]); soRef.current = new Map()
    if (!gocId) { setSai(new Map()); return }
    let huy = false
    setDangTai(true)
    Promise.all([api.soHienThiCay(gocId), api.saiNhanhCay(gocId), api.nhanBaiCay(gocId), api.nhomBaiCuaCay(gocId)]).then(([so, s, nb, nhb]) => {
      if (huy) return
      soRef.current = new Map(so.map((r) => [r.id, r.so]))
      setBais((prev) => prev.map((b) => ({ ...b, so: soRef.current.get(b.id) ?? '' })))
      setSai(gomSai(s))
      setNhanBai(nb)
      setNhomBai(nhb)
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
  const nhanCua = useMemo(() => {
    const m = new Map<string, NhanGon>()
    for (const r of nhanBai) {
      const g = m.get(r.baitoan_id) ?? { doKho: null, dang: [], boDe: [] }
      if (r.loai === 'do_kho') g.doKho = r.gia_tri
      else if (r.loai === 'dang') g.dang.push(r.nhan_id!)
      else g.boDe.push(r.nhan_id!)
      m.set(r.baitoan_id, g)
    }
    return m
  }, [nhanBai])
  // lỗi ném lại cho popup tự hiện (popup che thanh lỗi của màn)
  const doiNhanBai = async (baiId: string, loai: api.LoaiNhanY, nhanId: string, bat: boolean) => {
    await api.datNhanBai(baiId, loai, nhanId, bat)
    setNhanBai((p) => {
      const con = p.filter((x) => !(x.baitoan_id === baiId && x.loai === loai && x.nhan_id === nhanId))
      return bat ? [...con, { baitoan_id: baiId, loai, nhan_id: nhanId, gia_tri: null, nguon: 'nguoi' }] : con
    })
  }
  const doiDoKho = async (baiId: string, muc: number | null) => {
    await api.datDoKhoBai(baiId, muc)
    setNhanBai((p) => [...p.filter((x) => !(x.baitoan_id === baiId && x.loai === 'do_kho')),
      ...(muc ? [{ baitoan_id: baiId, loai: 'do_kho' as const, nhan_id: null, gia_tri: muc, nguon: 'nguoi' as const }] : [])])
  }
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
    api.nhomBaiCuaCay(kq.goc).then(setNhomBai).catch(() => {})
    await reload()                                                            // lưới mới (bài/nhánh/lời giải vừa tạo) — màn dựng lại từ L, giữ số
  }
  const chay = async (f: () => Promise<KetQuaCay>, xong: string, nhanhDoi?: string): Promise<boolean> => {
    if (ban) return false
    setBan(true); setLoi(null)
    try { const kq = await f(); await va(kq, nhanhDoi); bao(xong); return true }
    catch (e: any) { setLoi(e.message ?? String(e)); return false }
    finally { setBan(false) }
  }
  // ── NHÓM BÀI (§13): vai nút suy từ lưới; sự kiện + cho/hỏi từ fn_hl_nhom_bai_cua_cay ──
  const nbById = useMemo(() => new Map(nhomBai.map((n) => [n.id, n])), [nhomBai])
  const tvCua = useMemo(() => {
    const m = new Map<string, { nb: api.NhomBai; tv: api.ThanhVien }>()
    for (const nb of nhomBai) for (const tv of nb.thanh_vien) m.set(tv.id, { nb, tv })
    return m
  }, [nhomBai])
  const vaiNut = useCallback((nid: string | null) => (nid ? nhanhById.get(nid)?.vai ?? 'thuong' : 'thuong'), [nhanhById])
  const moNhomBai = (nid: string) => {
    const nb = nbById.get(nid)
    setHopNB(nb ? { nhom: nid, moi: false, ds: nb.su_kien.map((s) => ({ id: s.id, nd: s.noi_dung })) } : { nhom: nid, moi: true, ds: [{ nd: '' }, { nd: '' }, { nd: '' }] })
  }
  const moThanhVien = (nhom: string, tvId: string | null, chuyen: string | null) => {
    const nb = nbById.get(nhom), x = tvId ? tvCua.get(tvId)?.tv : null, n = nhanhById.get(tvId ?? chuyen ?? '')
    const chon: Record<string, 'cho' | 'hoi' | ''> = {}
    for (const s of nb?.su_kien ?? []) chon[s.id] = x?.cho.includes(s.id) ? 'cho' : x?.hoi.includes(s.id) ? 'hoi' : ''
    setHopTV({ nhom, id: tvId, chuyen, ten: n?.ten ?? '', gt: x?.gia_thiet ?? (n ? n.gia_thiet || n.gia_thiet_them || '' : ''), chon })
  }
  const luuNB = async () => {
    if (!hopNB || ban) return
    const h = hopNB, ds = h.ds.map((d) => ({ ...d, nd: d.nd.trim() }))
    if (h.moi) {
      const nd = ds.map((d) => d.nd).filter(Boolean)
      if (nd.length < 2) { setLoi('Nhóm bài cần ít nhất 2 sự kiện'); return }
      if (await chay(() => api.nhomBaiBat(h.nhom, nd), 'Đã bật nhóm bài — thêm thành viên ở menu của thẻ nhóm')) setHopNB(null)
      return
    }
    const cu = nbById.get(h.nhom)
    const ok = await chay(async () => {
      let kq: KetQuaCay = { goc: gocId!, nhanh_moi: null, bai: [] }
      for (const d of ds) {
        if (!d.nd) continue
        if (!d.id) kq = await api.suKienThem(h.nhom, d.nd)
        else if (cu?.su_kien.find((s) => s.id === d.id)?.noi_dung !== d.nd) kq = await api.suKienSua(d.id, d.nd)
      }
      return kq
    }, 'Đã lưu sự kiện nhóm bài')
    if (ok) setHopNB(null)
  }
  const luuTV = async () => {
    if (!hopTV || ban) return
    const h = hopTV
    const lay = (v: 'cho' | 'hoi') => Object.entries(h.chon).filter(([, x]) => x === v).map(([k]) => k)
    const cho = lay('cho'), hoi = lay('hoi')
    const ok = await chay(async () => {
      if (h.id) { await api.updateMoHinh(h.id, { ten: h.ten.trim() || 'Thành viên', gia_thiet: h.gt.trim() }); return api.thanhVienChoHoi(h.id, cho, hoi) }
      if (h.chuyen) { const kq = await api.thanhVienChuyen(h.chuyen, h.gt.trim(), cho, hoi); if (h.ten.trim()) await api.updateMoHinh(h.chuyen, { ten: h.ten.trim() }); return kq }
      return api.thanhVienThem(h.nhom, h.ten.trim(), h.gt.trim(), cho, hoi)
    }, h.id ? 'Đã lưu thành viên' : h.chuyen ? 'Đã đổi nhánh thành thành viên — mã nốt giữ nguyên' : 'Đã thêm thành viên')
    if (ok) setHopTV(null)
  }
  // trọng điểm nốt đơn: vá tại chỗ, lỗi ném lại cho popup tự hiện (chỉ trưởng khối trở lên — DB chặn)
  const doiTrongDiem = async (baiId: string, bat: boolean) => {
    await api.trongDiemDat(baiId, bat)
    setBais((p) => p.map((b) => (b.id === baiId ? { ...b, la_trong_diem: bat } : b)))
    void reload()
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
        await reload(); bao('Đã lưu mô hình')
      } else {
        const id = await api.taoMoHinhLuyen(khoi, hopMH.ten, hopMH.gt, hopMH.anh)
        if (chuDeId) await api.updateMoHinh(id, { chu_de_id: chuDeId })   // lỗi ở đây ⇒ mô hình nằm ở "Chưa xếp chủ đề", bấm ＋ để xếp
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
  // ── danh sách gốc cây (trái) ──
  const nutMH = (m: MoHinh) => (
    <button key={m.id} onClick={() => setGocId(m.id)}
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
            <Btn kind="pri" className="!h-7 !px-2 !text-[12px]" onClick={() => setHopMH({ id: null, ten: '', gt: '', anh: null })}>＋ Mô hình</Btn>
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
          {gocLoc.map(nutMH)}
          {chuDeId && !gocLoc.length && !tim.trim() && <div className="px-2 py-4 text-[12px] leading-relaxed text-slate-400">Chủ đề này chưa có mô hình nào. Bấm <b>＋ Mô hình</b> để tạo.</div>}
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
              <button className="text-[12px] text-blue-600 hover:underline" onClick={() => setHopMH({ id: gocMH.id, ten: gocMH.ten, gt: gocMH.gia_thiet ?? '', anh: gocMH.anh_cau_hinh ?? null })}>✎ sửa mô hình</button>
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
                title="Thêm một giả thiết rẽ ra từ giả thiết (bấm vào thẻ màu của giả thiết để chọn đúng chỗ)">⑂ Thêm giả thiết</Btn>
              <Btn disabled={!bais.length} onClick={() => setInChuoi(true)} title="In chuỗi bài cho HS làm (bản GV kèm lời giải)">🖨 In chuỗi</Btn>
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
              ? <TabChuoi {...{ vai: vaiNut, nbById, tvCua, onNhomBai: moNhomBai, onThanhVien: moThanhVien, gocId: gocId!, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, chaCua, laChinh, nhanCua, khung, L }}
                  onMo={(id) => { setCur(id); setPop(id) }}
                  onThemBai={(g) => setHopBai({ id: null, nhanh: g })}
                  onThemGT={(g, chinh) => setHopGT({ id: null, cha: g, ten: '', gt: '', chinh })}
                  onSuaGT={(g) => g === gocId ? setHopMH({ id: gocMH.id, ten: gocMH.ten, gt: gocMH.gia_thiet ?? '', anh: gocMH.anh_cau_hinh ?? null })
                    : setHopGT({ id: g, cha: chaCua(g) ?? gocId!, ten: nhanhById.get(g)?.ten ?? '', gt: nhanhById.get(g)?.gia_thiet_them ?? '', chinh: laChinh(g) })} />
              : <TabNhom {...{ vai: vaiNut, nbById, tvCua, onNhomBai: moNhomBai, onThanhVien: moThanhVien, gocId: gocId!, lan, nhanhs, baiById, nhanhById, sai, cur, doSau, baiCaNhanh, conCuaNhanh, chaCua, laChinh, nhanCua, ban, L }}
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

      {inChuoi && gocMH && (() => {
        // Khối in = giả thiết có bài (trong nó hoặc nhánh con), xếp theo số B nhỏ nhất của cả nhánh ⇒ đúng thứ tự file chuỗi
        const minSo = (nid: string): number => Math.min(1e6, ...(lan.get(nid) ?? []).map((b) => soB(baiById.get(b)?.so)), ...conCuaNhanh(nid).map((c) => minSo(c.id)))
        const khois: KhoiIn[] = nhanhs.filter((n) => minSo(n.id) < 1e6).sort((a, b) => minSo(a.id) - minSo(b.id)).map((n) => {
          const laGoc = n.id === gocId, cha = chaCua(n.id)
          return {
            id: n.id, anh: n.anh_cau_hinh ?? null,
            nhan: laGoc ? 'Giả thiết' : `${laChinh(n.id) ? 'Nhánh chính' : 'Nhánh phụ'}: ${tron(n.ten)}${cha && cha !== gocId ? ` — đi tiếp từ «${tron(nhanhById.get(cha)?.ten ?? '')}»` : ''}`,
            giaThiet: (laGoc ? n.gia_thiet : n.gia_thiet_them) ?? '',
            bai: (lan.get(n.id) ?? []).map((id) => {
              const b = baiById.get(id)!, cach = api.cachMacDinh(L, id)
              return { ma: b.ma, so: b.so, rieng: b.gia_thiet_rieng ?? null, phatBieu: b.phat_bieu, loiGiai: cach?.loi_giai ?? null, anhLoiGiai: cach?.anh_loi_giai ?? null, doKho: nhanCua.get(id)?.doKho ?? null }
            }),
          }
        })
        return <ChuoiHinhPrintView ten={tron(gocMH.ten)} ma={gocMH.ma} khoi={khoi} khois={khois} onClose={() => setInChuoi(false)} />
      })()}
      {pop && baiById.get(pop) && (
        <PopupBai L={L} bai={baiById.get(pop)!} nhanhById={nhanhById} baiById={baiById} duong={duong} doSau={doSau}
          khoi={khoi} nhan={nhanCua.get(pop) ?? KHONG_NHAN} onNhan={(lo, id, bat) => doiNhanBai(pop, lo, id, bat)} onDoKho={(m) => doiDoKho(pop, m)}
          onTrongDiem={(bat) => doiTrongDiem(pop, bat)}
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
              <Btn kind="pri" disabled={ban || !hopMH.ten.trim()} onClick={luuMoHinh}>{hopMH.id ? 'Lưu' : 'Tạo mô hình'}</Btn>
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
      {hopBai && (
        <FormBai L={L} sua={hopBai.id ? baiById.get(hopBai.id) ?? null : null} nhanhMacDinh={hopBai.nhanh} gocId={gocId!}
          sau={hopBai.sau ? baiById.get(hopBai.sau) ?? null : null}
          nhanhs={nhanhs} bais={bais} doSau={doSau} ban={ban} onDong={() => setHopBai(null)} onLuu={luuBai} />
      )}
      {hopNB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5" onClick={() => setHopNB(null)}>
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-[16px] font-semibold">{hopNB.moi ? '◈ Biến thành nhóm bài' : '✎ Sự kiện của nhóm bài'}</h2>
            <p className="mb-3 text-[12.5px] text-slate-500">
              Nhóm bài = nhiều mặt của một bài toán. Giả thiết của thẻ này là <b>đầu ra</b> (đủ mọi sự kiện). Liệt kê các <b>sự kiện</b> luân phiên được cho / hỏi —
              vd A: BD là phân giác · B: BE = BA · C: DE ⊥ BC. Mỗi thành viên sau đó ghi "cho những sự kiện nào, hỏi sự kiện nào".
              Nhãn A, B, C chỉ để đọc, theo thứ tự dưới đây.</p>
            {hopNB.ds.map((d, i) => (
              <div key={d.id ?? 'moi' + i} className="mb-2 flex items-center gap-2">
                <b className="w-5 text-center text-orange-700">{String.fromCharCode(65 + i)}</b>
                <input className={inpCls} value={d.nd} placeholder="vd: BD là phân giác của góc $B$"
                  onChange={(e) => setHopNB({ ...hopNB, ds: hopNB.ds.map((x, j) => (j === i ? { ...x, nd: e.target.value } : x)) })} />
              </div>))}
            <button className="text-[12.5px] text-orange-700 hover:underline" onClick={() => setHopNB({ ...hopNB, ds: [...hopNB.ds, { nd: '' }] })}>＋ sự kiện</button>
            {!hopNB.moi && <p className="mt-2 text-[11.5px] text-slate-400">Sự kiện đã có chỉ sửa chữ được; sự kiện bỏ trống ở đây không bị xoá.</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Btn onClick={() => setHopNB(null)}>Huỷ</Btn>
              <Btn kind="pri" disabled={ban || hopNB.ds.filter((d) => d.nd.trim()).length < 2} onClick={() => void luuNB()}>{hopNB.moi ? 'Bật nhóm bài' : 'Lưu'}</Btn>
            </div>
          </div>
        </div>
      )}
      {hopTV && (() => {
        const nb = nbById.get(hopTV.nhom)
        const coHoi = Object.values(hopTV.chon).includes('hoi')
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-5" onClick={() => setHopTV(null)}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-[16px] font-semibold">{hopTV.id ? 'Sửa thành viên' : hopTV.chuyen ? '⇄ Đổi nhánh thành thành viên' : '＋ Thành viên của nhóm bài'}</h2>
            <p className="mb-3 text-[12.5px] text-slate-500">
              Thành viên = một bài thật "cho … ⇒ hỏi …". Giả thiết ghi <b>nguyên văn đề</b> (thay cả giả thiết phía trên, không cộng dồn).
              Thành viên không có nhánh con — bài đi tiếp sau khi đủ giả thiết treo dưới nút nhóm.{hopTV.chuyen ? ' Các bài đang có trong nhánh giữ nguyên mã.' : ''}</p>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Cho / hỏi</label>
            <div className="mb-3 space-y-1.5">
              {(nb?.su_kien ?? []).map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-[13px]">
                  <b className="w-5 text-center text-orange-700">{s.ky_hieu}</b>
                  <span className="min-w-0 flex-1"><MathText className="inline">{s.noi_dung}</MathText></span>
                  {(['cho', 'hoi', ''] as const).map((v) => (
                    <button key={v || 'khong'} onClick={() => setHopTV({ ...hopTV, chon: { ...hopTV.chon, [s.id]: v } })}
                      className={`rounded-md border px-2 py-0.5 text-[12px] ${hopTV.chon[s.id] === v ? (v === 'hoi' ? 'border-orange-500 bg-orange-500 text-white' : v === 'cho' ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-400 bg-slate-100') : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      {v === 'cho' ? 'cho' : v === 'hoi' ? 'hỏi' : '—'}</button>))}
                </div>))}
            </div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Giả thiết — nguyên văn đề (gõ $…$ cho công thức)</label>
            <textarea autoFocus className={`${inpCls} h-24`} value={hopTV.gt} onChange={(e) => setHopTV({ ...hopTV, gt: e.target.value })}
              placeholder="vd: Cho $\triangle ABC$ vuông tại $A$. Trên $BC$ lấy $E$ sao cho $BE = BA$. Đường vuông góc với $BC$ tại $E$ cắt $AC$ tại $D$." />
            {hopTV.gt.trim() && <div className="mt-1 rounded-md bg-slate-50 px-2 py-1 text-[12.5px]"><MathText>{hopTV.gt}</MathText></div>}
            <label className="mb-1 mt-3 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tên ngắn</label>
            <input className={inpCls} value={hopTV.ten} onChange={(e) => setHopTV({ ...hopTV, ten: e.target.value })} placeholder="vd: Cho BE = BA, DE ⊥ BC" />
            <div className="mt-4 flex items-center justify-end gap-2">
              {!coHoi && <span className="mr-auto text-[12px] text-amber-700">Chọn ít nhất 1 sự kiện "hỏi".</span>}
              <Btn onClick={() => setHopTV(null)}>Huỷ</Btn>
              <Btn kind="pri" disabled={ban || !hopTV.gt.trim() || !coHoi} onClick={() => void luuTV()}>{hopTV.id ? 'Lưu' : hopTV.chuyen ? 'Đổi thành thành viên' : 'Thêm thành viên'}</Btn>
            </div>
          </div>
        </div>) })()}
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
  // ↪ Chuyển mô hình (Thùy 08/11) — đổi mô hình của BÀI KHO (hàm gán có sẵn fn_hl_gan_bai_mo_hinh); DB chặn nếu ý đã gán vào bài của mô hình khác
  const [moHinhs, setMoHinhs] = useState<MoHinhLuyen[]>([])
  const [dangChuyen, setDangChuyen] = useState<string | null>(null)
  const [tbChuyen, setTbChuyen] = useState<string | null>(null)
  useEffect(() => { api.moHinhLuyenCuaKhoi(khoi).then(setMoHinhs).catch(() => setMoHinhs([])) }, [khoi])
  const chuyenMoHinh = async (c: ChuoiKho, moHinhId: string) => {
    setDangChuyen(c.id); setLoiNhan(null)
    try {
      await api.ganBaiVaoMoHinh(c.id, moHinhId)
      setRows((p) => (p ?? []).filter((x) => x.id !== c.id))   // rời kho mô hình này — vá tại chỗ
      const m = moHinhs.find((x) => x.id === moHinhId)
      setTbChuyen(`Đã chuyển ${c.ma_bai} sang mô hình ${m ? `${m.ma} · ${m.ten}` : ''}`); setTimeout(() => setTbChuyen(null), 3000)
    } catch (e: any) { setLoiNhan(e.message ?? String(e)) } finally { setDangChuyen(null) }
  }
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
      {tbChuyen && <div className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12.5px] text-emerald-700">✓ {tbChuyen}</div>}
      {/* Thùy 15/10: "view bé quá, mỗi chuỗi phải to gấp 2–3 lần mới đọc được" ⇒ mỗi chuỗi = một CARD đọc được ngay:
          hình to bên trái, đề + từng ý nguyên văn cỡ 15px bên phải, chip bài mô hình cạnh ý. Bấm "Lời giải" mới mở
          lời giải + hình riêng của ý — không còn trạng thái "hàng gập 1 dòng". */}
      <div className="space-y-3">
        {hien.map((c) => { const dangMo = mo === c.id; return (
          <div key={c.id} className={`rounded-xl border bg-white p-4 ${dangMo ? 'border-teal-300 shadow-sm' : 'border-slate-200'}`}>
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[13px] font-semibold text-teal-700">{c.ma_bai}</span>
              <span className="text-[12px] text-slate-500">{c.nguon ?? 'chưa rõ nguồn'}{c.nguon_ma_cau ? ` · gốc ${c.nguon_ma_cau}` : ''}</span>
              {c.y.some((y) => y.baitoan_id)
                ? <span className="rounded-md border border-slate-200 px-2 py-0.5 text-[12px] text-slate-400" title="Có ý đã gán vào bài của mô hình này — gỡ gán các ý trước rồi mới chuyển mô hình">↪ Chuyển mô hình</span>
                : <ChonMoHinh moHinhs={moHinhs.filter((m) => m.id !== gocId)} disabled={dangChuyen === c.id} nhan="↪ Chuyển mô hình" neoPhai onChon={(id) => void chuyenMoHinh(c, id)} />}
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
                    {/* Nhãn Dạng bài / Bổ đề của ý — chip đặc = đã dán · chip ✨ nét đứt = Claude gợi ý chờ duyệt.
                        Ý ĐÃ GÁN bài mô hình ⇒ nhãn KẾ THỪA từ bài (Thùy 23/10): chỉ xem, sửa ở bài trong mô hình. */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[12px]">
                      {nhan.filter((x) => x.y_id === y.id).map((x) => x.loai === 'do_kho'
                        ? <span key="do_kho" className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-800" title={`Độ khó ${x.gia_tri}/5 — kế thừa từ bài ${y.so ?? ''}`}>{SAO(x.gia_tri ?? 0)}</span>
                        : (
                        <span key={x.loai + x.nhan_id} className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${x.loai === 'dang' ? 'bg-violet-100 text-violet-800' : 'bg-amber-100 text-amber-800'}`}
                          title={(x.loai === 'dang' ? 'Dạng bài' : 'Bổ đề') + (x.nguon === 'bai' ? ` · kế thừa từ bài ${y.so ?? ''}` : x.nguon === 'ai' ? ' · Claude gợi ý, đã duyệt' : '')}>
                          {x.loai === 'dang' ? '⌥' : '◦'} {tron(tenNhan(x.loai, x.nhan_id!))}
                          {x.nguon !== 'bai' && <button onClick={() => void datNhan(y.id, x.loai as api.LoaiNhanY, x.nhan_id!, false)} className="opacity-50 hover:opacity-100" title="Gỡ nhãn">✕</button>}
                        </span>))}
                      {y.baitoan_id ? (
                        <span className="text-[11.5px] text-slate-400" title="Ý đã gán bài mô hình ⇒ mang nhãn của bài; sửa nhãn ở bài đó (bấm chip bài phía trên)">
                          {nhan.some((x) => x.y_id === y.id) ? `↳ nhãn của bài ${y.so ?? ''}` : `bài ${y.so ?? ''} chưa có nhãn`}</span>
                      ) : <>
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
                      </>}
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
  nhanCua: Map<string, NhanGon>
  // NHÓM BÀI (§13)
  vai: (id: string | null) => string; nbById: Map<string, api.NhomBai>; tvCua: Map<string, { nb: api.NhomBai; tv: api.ThanhVien }>
  onNhomBai: (nhom: string) => void; onThanhVien: (nhom: string, tv: string | null, chuyen: string | null) => void
}
// Thành viên của nhóm bài: cam (khác 3 màu giả thiết) — mũi tên đi TỪ thành viên VÀO nút nhóm (đầu ra).
const MAU_TV = { dac: '#f97316', nhat: '#fff7ed', vien: '#fdba74' }
const nhanVaiNut = (p: Pick<ChungProps, 'vai' | 'tvCua' | 'nbById'>, n: MoHinh, laGoc: boolean, chinh: boolean): { nhan: string; gt: string; m: { dac: string; nhat: string; vien: string } } => {
  const v = p.vai(n.id)
  if (v === 'thanh_vien') { const x = p.tvCua.get(n.id); return { nhan: `Thành viên · ${x ? api.moTaChoHoi(x.nb, x.tv) : ''}`, gt: n.gia_thiet ?? '', m: MAU_TV } }
  const nb = p.nbById.get(n.id)
  return {
    nhan: (v === 'nhom_bai' ? `◈ Nhóm bài${nb ? ` (${nb.su_kien.map((s) => s.ky_hieu).join('·')})` : ''} · ` : '') + tenGT(laGoc, chinh) + (laGoc ? '' : ': ' + tron(n.ten)),
    gt: (laGoc ? n.gia_thiet : n.gia_thiet_them) ?? '', m: mauGT(laGoc, chinh),
  }
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

  const { W, H, GX, HEX, PAD, TOP, HW, HH } = api.KT_GT
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
    if (p.vai(n.id) === 'thanh_vien') {   // thành viên → nút nhóm: đi ngược chiều, vào cạnh phải thẻ nhóm
      day.push(<path key={'g' + n.id} d={`M${OX + b.x},${OY + b.y + 8 + HEX / 2} H${OX + (a.x + a.w + b.x) / 2} V${OY + a.y + 8 + HEX / 2} H${OX + a.x + a.w + 2}`}
        stroke={MAU_TV.dac} strokeWidth={2.6} fill="none" markerEnd="url(#gt-tv)" />)
      continue
    }
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
          {nhanhs.map((n) => { const k = bc.khoi.get(n.id); if (!k) return null; const { m } = nhanVaiNut(p, n, n.id === gocId, laChinh(n.id)); const nhom = p.vai(n.id) === 'nhom_bai'; return (
            <div key={'k' + n.id} className={`absolute rounded-2xl ${nhom ? 'border-2 border-solid' : 'border border-dashed'}`}
              style={{ left: OX + k.x, top: OY + k.y, width: k.w, height: k.h, background: m.nhat, borderColor: nhom ? '#ea580c' : m.vien }} />) })}
          <svg className="pointer-events-none absolute left-0 top-0" width={bc.rong + 2 * OX} height={bc.cao + 2 * OY} style={{ zIndex: 2 }}>
            <defs>
              {[['b', '#64748b'], ['t', '#2563eb']].map(([k, c]) => (
                <marker key={k} id={`gt-${k}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6" fill="none" stroke={c} strokeWidth="1.4" /></marker>))}
              {[['c', MAU[1].dac], ['p', MAU[2].dac], ['tv', MAU_TV.dac]].map(([k, c]) => (
                <marker key={k} id={`gt-${k}`} markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={c} /></marker>))}
            </defs>
            {day}
          </svg>
          {/* thẻ giả thiết (bo tròn — Thùy 23/10 bỏ lục giác: cạnh nhọn cắt chữ) — bấm để thêm bài / nhánh, sửa */}
          {nhanhs.map((n) => { const k = bc.khoi.get(n.id); if (!k) return null; const laGoc = n.id === gocId; const chinh = laChinh(n.id)
            const { nhan, gt, m } = nhanVaiNut(p, n, laGoc, chinh); const v = p.vai(n.id); const cha = chaCua(n.id)
            const coChinh = conCuaNhanh(n.id).some((c) => laChinh(c.id)); const nb = p.nbById.get(n.id)
            const mi = 'block w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-slate-100 disabled:opacity-40'
            return (
            <div key={'h' + n.id}>
              <button onClick={(e) => { e.stopPropagation(); setMenu(menu === n.id ? null : n.id) }}
                title={tron(gt) + (nb ? '\nSự kiện: ' + nb.su_kien.map((s) => `${s.ky_hieu}: ${tron(s.noi_dung)}`).join(' · ') : '') + ' — bấm để thêm bài / giả thiết'}
                className="absolute flex flex-col justify-center gap-0.5 overflow-hidden rounded-xl px-4 text-left text-white shadow-sm hover:brightness-110"
                style={{ left: OX + k.x, top: OY + k.y + 8, width: k.w, height: HEX, background: m.dac, zIndex: 3 }}>
                <b className="truncate text-[15.5px] leading-tight">{nhan} <span className="font-normal opacity-80">· {p.baiCaNhanh(n.id) - conCuaNhanh(n.id).reduce((s, c) => s + p.baiCaNhanh(c.id), 0)} bài ▾</span></b>
                <span className="line-clamp-2 text-[13.5px] leading-snug opacity-95"><MathText className="inline">{gt}</MathText></span>
              </button>
              {menu === n.id && (
                <div className="absolute z-20 w-64 rounded-xl border border-slate-200 bg-white p-1.5 text-[12.5px] shadow-xl" style={{ left: OX + k.x + Math.min(k.w - 260, 40), top: OY + k.y + 8 + HEX + 4 }} onClick={(e) => e.stopPropagation()}>
                  {v === 'thanh_vien' ? <>
                    <button className={mi} onClick={() => { setMenu(null); p.onThemBai(n.id) }}>＋ Bài trong thành viên này</button>
                    <button className={mi} onClick={() => { setMenu(null); if (cha) p.onThanhVien(cha, n.id, null) }}>✎ Sửa thành viên (giả thiết · cho / hỏi)</button>
                  </> : <>
                    <button className={mi} onClick={() => { setMenu(null); p.onThemBai(n.id) }}>＋ Bài trong giả thiết này</button>
                    <button disabled={coChinh} className={mi} title={coChinh ? 'Đã có nhánh chính' : undefined} onClick={() => { setMenu(null); p.onThemGT(n.id, true) }}>⑂ Nhánh chính (đi thẳng xuống)</button>
                    <button className={mi} onClick={() => { setMenu(null); p.onThemGT(n.id, false) }}>⑂ Nhánh phụ (rẽ sang phải)</button>
                    <button className={mi} onClick={() => { setMenu(null); p.onSuaGT(n.id) }}>✎ {laGoc ? 'Sửa mô hình' : 'Sửa / dời giả thiết'}</button>
                    <div className="my-1 border-t border-slate-100" />
                    {v === 'nhom_bai' ? <>
                      <button className={mi} onClick={() => { setMenu(null); p.onThanhVien(n.id, null, null) }}>＋ Thành viên (cho … ⇒ hỏi …)</button>
                      <button className={mi} onClick={() => { setMenu(null); p.onNhomBai(n.id) }}>✎ Sự kiện của nhóm bài</button>
                    </> : <button className={mi} onClick={() => { setMenu(null); p.onNhomBai(n.id) }} title="Giả thiết này là ĐẦU RA của một nhóm bài (nhiều mặt của một bài toán)">◈ Biến thành nhóm bài</button>}
                    {v === 'thuong' && !laGoc && p.vai(cha) === 'nhom_bai' && (
                      <button className={mi} disabled={conCuaNhanh(n.id).length > 0} title={conCuaNhanh(n.id).length ? 'Còn nhánh con — dời xuống dưới nút nhóm trước' : undefined}
                        onClick={() => { setMenu(null); if (cha) p.onThanhVien(cha, null, n.id) }}>⇄ Đổi thành thành viên của nhóm</button>)}
                  </>}
                </div>)}
            </div>) })}
          {/* HÌNH của giả thiết (cộng dồn đường từ gốc) — bấm để xem to */}
          {nhanhs.map((n) => { const k = bc.khoi.get(n.id); if (!k) return null; return (
            <div key={'a' + n.id} className="absolute flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white"
              style={{ left: OX + k.x + PAD, top: OY + k.y + TOP, width: HW, height: HH, zIndex: 3 }}>
              {n.anh_cau_hinh
                ? <a href={n.anh_cau_hinh} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title="Xem hình to"><img src={n.anh_cau_hinh} alt="" className="max-h-full max-w-full object-contain" style={{ maxHeight: HH - 4, maxWidth: HW - 4 }} /></a>
                : <span className="text-[11px] text-slate-400">chưa có hình</span>}
            </div>) })}
          {/* thẻ bài */}
          {[...bc.bai].map(([id, o]) => { const b = baiById.get(id); if (!b) return null; const w = sai.has(id); const khac = (td.get(id) ?? []).filter((t) => t !== bc.boi.get(id)); return (
            <div key={id} onClick={(e) => { e.stopPropagation(); p.onMo(id) }} title={tron(b.phat_bieu)}
              className={`absolute cursor-pointer overflow-auto rounded-lg border-[1.5px] px-2 py-[3px] text-[11.5px] leading-tight transition hover:shadow-md ${w ? 'bg-amber-50' : 'bg-white'} ${cur === id ? 'ring-2 ring-blue-500' : tdCur.has(id) ? 'ring-2 ring-blue-300' : sauCur.has(id) ? 'ring-2 ring-emerald-300' : ''}`}
              style={{ left: OX + o.x, top: OY + o.y, width: W, height: H, borderColor: w ? '#f59e0b' : '#94a3b8', zIndex: 3 }}>
              <div className="flex items-center gap-1">
                <b className="text-[12.5px] text-slate-900">{b.so || '…'}</b>
                {w && <span className="rounded border border-amber-400 bg-amber-100 px-1 text-[9.5px] font-bold text-amber-800">⚠</span>}
                {b.la_trong_diem && <span className="rounded bg-yellow-200 px-1 text-[9.5px] font-bold text-yellow-900" title="Trọng điểm (đánh giá sâu dưới mô hình)">★</span>}
                {(() => { const nh = p.nhanCua.get(id) ?? KHONG_NHAN; return <>
                  {nh.doKho != null && <span className="text-[10.5px] leading-none text-orange-500" title={`Độ khó ${nh.doKho}/5`}>{SAO(nh.doKho)}</span>}
                  {!!nh.dang.length && <span className="rounded bg-violet-100 px-1 text-[9.5px] text-violet-800" title={'Dạng bài: ' + nh.dang.map((x) => tron(L.dang.find((d) => d.id === x)?.ten ?? '?')).join(' · ')}>⌥{nh.dang.length}</span>}
                  {!!nh.boDe.length && <span className="rounded bg-amber-100 px-1 text-[9.5px] text-amber-800" title={'Bổ đề: ' + nh.boDe.map((x) => tron(L.boDe.find((d) => d.id === x)?.ten ?? '?')).join(' · ')}>◦{nh.boDe.length}</span>}
                </> })()}
                {!!khac.length && <span className="ml-auto truncate text-[10px] text-blue-600" title="Tiền đề khác (khác hàng / ở giả thiết trên)">← {khac.map((t) => baiById.get(t)?.so ?? '?').join(', ')}</span>}
              </div>
              <div className="text-[11.5px] leading-snug text-slate-700"><MathText className="inline">{b.phat_bieu}</MathText></div>
            </div>) })}
        </div>
      </div>
      <div className="mt-2 text-[11.5px] text-slate-500">
        Thẻ màu = giả thiết (bấm để thêm bài / nhánh) · <span style={{ color: MAU[1].dac }}>mũi tên xanh</span> = nhánh chính · <span style={{ color: MAU[2].dac }}>mũi tên tím</span> = nhánh phụ ·
        thẻ trắng = bài, mũi tên xám = bài trước → bài sau · chữ xanh góc thẻ = tiền đề khác · bấm bài: viền xanh nhạt = tiền đề của nó, xanh lá = bài đi tiếp từ nó ·
        khung viền cam đậm = <b>nhóm bài</b>, thẻ <span style={{ color: MAU_TV.dac }}>cam</span> = thành viên (cho … ⇒ hỏi …), mũi tên cam đổ vào nhóm · ★ = trọng điểm.
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
    const laGoc = nid === gocId; const chinh = laChinh(nid); const cua = lan.get(nid) ?? []
    const { nhan, gt, m } = nhanVaiNut(p, n, laGoc, chinh); const v = p.vai(nid); const nb = p.nbById.get(nid)
    const coChinh = conCuaNhanh(nid).some((c) => laChinh(c.id))
    return (
      <div className={`my-2.5 rounded-xl ${v === 'nhom_bai' ? 'border-[3px]' : 'border-2'} p-3 ${!laGoc && !chinh ? 'ml-6' : ''}`} style={{ borderColor: v === 'nhom_bai' ? '#ea580c' : m.vien, background: m.nhat }}>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full px-2 py-px text-[11px] font-semibold text-white" style={{ background: m.dac }}>{v === 'thanh_vien' ? nhan : (v === 'nhom_bai' ? '◈ Nhóm bài · ' : '') + (laGoc ? 'Giả thiết mô hình' : chinh ? '↓ Nhánh chính' : '↱ Nhánh phụ')}</span>
          {!laGoc && <b className="text-[13.5px] text-slate-900">{tron(n.ten)}</b>}
          <Ma>{n.ma}</Ma>
          <span className="text-[11px] text-slate-400">{cua.length} bài · {baiCaNhanh(nid)} bài cả nhánh con</span>
          <span className="ml-auto flex gap-2 text-[11.5px]">
            {v === 'thanh_vien'
              ? <button className="text-orange-700 hover:underline" onClick={() => { const c = p.chaCua(nid); if (c) p.onThanhVien(c, nid, null) }}>✎ sửa thành viên</button>
              : <>
                <button className="text-blue-600 hover:underline disabled:opacity-40" disabled={coChinh} onClick={() => p.onThemGT(nid, true)}>⑂ nhánh chính</button>
                <button className="text-violet-700 hover:underline" onClick={() => p.onThemGT(nid, false)}>⑂ nhánh phụ</button>
                {!laGoc && <button className="text-blue-600 hover:underline" onClick={() => p.onSuaGT(nid)}>✎ sửa / dời</button>}
                {v === 'nhom_bai'
                  ? <><button className="text-orange-700 hover:underline" onClick={() => p.onThanhVien(nid, null, null)}>＋ thành viên</button>
                    <button className="text-orange-700 hover:underline" onClick={() => p.onNhomBai(nid)}>✎ sự kiện</button></>
                  : <button className="text-orange-700 hover:underline" onClick={() => p.onNhomBai(nid)}>◈ nhóm bài</button>}
              </>}
          </span>
        </div>
        {n.anh_cau_hinh && <a href={n.anh_cau_hinh} target="_blank" rel="noreferrer" className="float-right ml-3 mb-2"><img src={n.anh_cau_hinh} alt="" className="h-28 rounded-md border border-slate-200 bg-white object-contain" /></a>}
        <div className="mb-2 rounded-md px-2 py-1 text-[12px] text-white" style={{ background: m.dac }}>
          <b>{v === 'thanh_vien' ? 'Giả thiết (nguyên văn đề):' : v === 'nhom_bai' ? 'Đầu ra (đủ giả thiết):' : laGoc ? 'Giả thiết:' : '+ Giả thiết thêm:'}</b> <MathText className="inline">{gt || '(chưa ghi)'}</MathText>
        </div>
        {nb && (
          <div className="mb-2 flex flex-wrap gap-1.5 text-[12px]">
            {nb.su_kien.map((s) => <span key={s.id} className="rounded-md border border-orange-300 bg-white px-1.5 py-0.5"><b className="text-orange-700">{s.ky_hieu}</b> <MathText className="inline">{s.noi_dung}</MathText></span>)}
          </div>)}
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-2">
          <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Bài của giả thiết này · {cua.length}</div>
          {!cua.length && <div className="text-[11.5px] text-slate-400">— chưa có —</div>}
          {cua.map((id) => { const b = baiById.get(id); if (!b) return null; const tds = api.tienDeCua(p.L, id); return (
            <div key={id} className={`flex items-center gap-2 rounded-md px-1.5 py-1 text-[12.5px] ${cur === id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
              <b className="w-10 shrink-0 cursor-pointer" onClick={() => p.onMo(id)}>{b.so || '…'}</b>
              <div className="min-w-0 flex-1 cursor-pointer truncate" onClick={() => p.onMo(id)}>{tron(b.phat_bieu)}</div>
              {(() => { const nh = p.nhanCua.get(id) ?? KHONG_NHAN; return <>
                {nh.doKho != null && <span className="shrink-0 text-[11px] text-orange-500" title={`Độ khó ${nh.doKho}/5`}>{SAO(nh.doKho)}</span>}
                {nh.dang.map((x) => <span key={x} className="max-w-[140px] shrink-0 truncate rounded-full bg-violet-100 px-1.5 text-[10.5px] text-violet-800" title="Dạng bài">⌥ {tron(p.L.dang.find((d) => d.id === x)?.ten ?? '?')}</span>)}
                {nh.boDe.map((x) => <span key={x} className="max-w-[140px] shrink-0 truncate rounded-full bg-amber-100 px-1.5 text-[10.5px] text-amber-800" title="Bổ đề">◦ {tron(p.L.boDe.find((d) => d.id === x)?.ten ?? '?')}</span>)}
              </> })()}
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
        <div className="clear-both" />
        {conCuaNhanh(nid).map((c) => <Hop key={c.id} nid={c.id} />)}
      </div>
    )
  }
  return <Hop nid={gocId} />
}

// ══════════════════ POPUP BÀI ══════════════════
function PopupBai({ L, bai, nhanhById, baiById, duong, doSau, saiTienDe, onDong, onNhay, onSuaSai, onSua, onThemSau, khoi, nhan, onNhan, onDoKho, onTrongDiem }: {
  L: Luoi; bai: BaiX; nhanhById: Map<string, MoHinh>; baiById: Map<string, BaiX>
  duong: (id: string) => string[]; doSau: (id: string) => number; saiTienDe: string[]
  onDong: () => void; onNhay: (id: string) => void; onSuaSai: (nhanhId: string) => void; onSua: () => void
  onThemSau: () => void
  khoi: string; nhan: NhanGon
  onNhan: (loai: api.LoaiNhanY, nhanId: string, bat: boolean) => Promise<void>; onDoKho: (muc: number | null) => Promise<void>
  onTrongDiem: (bat: boolean) => Promise<void>
}) {
  const [gt, setGt] = useState<string | null>(null)
  const [loiTD, setLoiTD] = useState<string | null>(null)
  const doiTD = async () => { setLoiTD(null); try { await onTrongDiem(!bai.la_trong_diem) } catch (e: any) { setLoiTD(e.message ?? String(e)) } }
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
      <div className="max-h-[95vh] w-full max-w-[95vw] overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-slate-200 bg-white px-5 py-3">
          <h2 className="text-[17px] font-semibold">Bài {bai.so}</h2>
          <Ma big>{bai.ma}</Ma>
          <span className="rounded-full px-2 py-px text-[11.5px] font-semibold text-white" style={{ background: m.dac }}>{ds.length > 1 ? tron(ds[ds.length - 1].ten) : 'Giả thiết mô hình'}</span>
          {!!saiTienDe.length && <span className="rounded border border-amber-400 bg-amber-50 px-1.5 text-[11px] font-bold text-amber-800">⚠ sai nhánh</span>}
          <button onClick={() => void doiTD()} title="Trọng điểm = đánh giá sâu dưới mô hình (chỉ trưởng khối trở lên bật/tắt). Nhóm bài tự là trọng điểm."
            className={`ml-auto rounded-lg border px-2.5 py-1 text-[12.5px] font-semibold ${bai.la_trong_diem ? 'border-yellow-400 bg-yellow-100 text-yellow-900' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}>
            {bai.la_trong_diem ? '★ Trọng điểm' : '☆ Đặt trọng điểm'}</button>
          {loiTD && <span className="max-w-[240px] text-[11.5px] text-rose-600">{loiTD}</span>}
          <Btn kind="pri" onClick={onThemSau} title="Tạo bài tiếp theo của bài này (tiền đề = bài này); chọn được giả thiết khác">＋ Bài tiếp theo</Btn>
          <Btn onClick={onSua}>✎ Sửa bài</Btn>
          <button className="h-8 w-8 rounded-lg bg-slate-100 text-[16px]" onClick={onDong}>✕</button>
        </div>
        <div className="grid gap-5 px-5 py-4 md:grid-cols-[1fr_270px]">
          <div className="min-w-0 space-y-3.5">
            <Muc ten="Đề bài">
              {/* giả thiết hiệu lực nối bằng "; " ⇒ hiện thành các câu liền nhau (". "), không để dính ".;" */}
              {gt === null ? <span className="text-slate-400">đang lấy giả thiết…</span>
                : <MathText>{[gt.split(/\s*;\s*/).map((x) => x.trim().replace(/[.;]+$/, '')).filter(Boolean).join('. '), bai.phat_bieu].filter(Boolean).join('. ')}</MathText>}
            </Muc>
            <Muc ten="Đáp án chi tiết">
              {cach?.loi_giai
                ? <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5"><LoiGiaiXem raw={cach.loi_giai} className="lg-lien lg-hinh" /></div>
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
            <Muc ten="Nhãn (ý trong kho gán vào bài này kế thừa)"><NhanBaiO L={L} khoi={khoi} nhan={nhan} onNhan={onNhan} onDoKho={onDoKho} /></Muc>
            <Muc ten="Hình"><Fig src={anh} h="h-52" /></Muc>
            <Muc ten="Giả thiết hiệu lực (gốc → nhánh → riêng)">
              <div className="space-y-1 border-l-[3px] pl-2.5 text-[12px]" style={{ borderColor: MAU[0].dac }}>
                {/* bài TỰ PHÁT BIỂU (gt_thay_the): giả thiết riêng THAY cả đường gốc → nhánh, không cộng dồn */}
                {/* nút "thay thế" sâu nhất trên đường (vd THÀNH VIÊN nhóm bài — nguyên văn đề) làm gốc mới, như fn_hl_gia_thiet_phan */}
                {!bai.gt_thay_the && (() => {
                  const iBase = Math.max(0, ...ds.map((n, i) => (i > 0 && n.gt_thay_the ? i : 0)))
                  return ds.slice(iBase).map((n, j) => {
                    const i = iBase + j, t = j === 0 ? n.gia_thiet : n.gia_thiet_them
                    return t ? <div key={n.id}><b>{i === 0 ? 'Gốc' : j === 0 ? `${tron(n.ten)} (thay giả thiết phía trên)` : `+ ${tron(n.ten)}`}:</b> <MathText className="inline">{t}</MathText></div> : null
                  })
                })()}
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
/** Nhãn của 1 bài mô hình: Độ khó 1–5 (bấm lại mức đang chọn = gỡ) · Dạng bài · Bổ đề (nhãn lớp ≤ khối mô hình). */
function NhanBaiO({ L, khoi, nhan, onNhan, onDoKho }: {
  L: Luoi; khoi: string; nhan: NhanGon
  onNhan: (loai: api.LoaiNhanY, nhanId: string, bat: boolean) => Promise<void>; onDoKho: (muc: number | null) => Promise<void>
}) {
  const [loi, setLoi] = useState<string | null>(null)
  const [dang, setDang] = useState(false)
  const soK = (k: string | null | undefined) => (k ? parseInt(k, 10) || 0 : 0)
  const dungDuoc = (k: string | null | undefined) => !k || soK(k) <= soK(khoi)
  const chay = async (f: () => Promise<void>) => {
    if (dang) return
    setDang(true); setLoi(null)
    try { await f() } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDang(false) }
  }
  const Dong = ({ loai, ten, ds, tat }: { loai: api.LoaiNhanY; ten: string; ds: { id: string; ten: string; khoi?: string | null }[]; tat: string[] }) => (
    <div>
      <div className="mb-1 text-[11px] font-semibold text-slate-500">{ten}</div>
      <div className="flex flex-wrap items-center gap-1 text-[12px]">
        {tat.map((id) => (
          <span key={id} className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${loai === 'dang' ? 'bg-violet-100 text-violet-800' : 'bg-amber-100 text-amber-800'}`}>
            {loai === 'dang' ? '⌥' : '◦'} {tron(ds.find((d) => d.id === id)?.ten ?? '?')}
            <button disabled={dang} onClick={() => void chay(() => onNhan(loai, id, false))} className="opacity-50 hover:opacity-100" title="Gỡ nhãn">✕</button>
          </span>))}
        <select disabled={dang} className="max-w-[200px] rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[12px] text-slate-600" value=""
          onChange={(e) => { const id = e.target.value; if (id) void chay(() => onNhan(loai, id, true)) }}>
          <option value="">＋ {ds.length ? 'thêm' : 'chưa có trong danh mục'}</option>
          {ds.filter((d) => dungDuoc(d.khoi) && !tat.includes(d.id)).map((d) => <option key={d.id} value={d.id}>{tron(d.ten)}</option>)}
        </select>
      </div>
    </div>)
  return (
    <div className="space-y-2.5">
      <div>
        <div className="mb-1 text-[11px] font-semibold text-slate-500">Độ khó</div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((m) => (
            <button key={m} disabled={dang} onClick={() => void chay(() => onDoKho(nhan.doKho === m ? null : m))}
              title={nhan.doKho === m ? 'Bấm lại để gỡ độ khó' : `Độ khó ${m}/5`}
              className={`h-7 w-7 rounded-lg border text-[13px] font-semibold ${nhan.doKho === m ? 'border-orange-500 bg-orange-500 text-white' : nhan.doKho != null && m < nhan.doKho ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-500 hover:border-orange-300'}`}>{m}</button>))}
          <span className="ml-1 text-[13px] text-orange-500">{nhan.doKho != null ? SAO(nhan.doKho) : <span className="text-[11.5px] text-slate-400">chưa đánh</span>}</span>
        </div>
      </div>
      <Dong loai="dang" ten="Dạng bài" ds={L.dang} tat={nhan.dang} />
      <Dong loai="bo_de" ten="Bổ đề" ds={L.boDe} tat={nhan.boDe} />
      {loi && <div className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[11.5px] text-red-700">{loi}</div>}
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
