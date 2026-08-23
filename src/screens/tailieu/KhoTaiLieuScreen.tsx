// KHO TÀI LIỆU = bảng tổng MỌI tài liệu đã tạo trong hệ (giáo trình · ET · MT · chuyên đề…).
// Cột thông tin + nút IN (giáo trình→PrintView, ET→ETPrintView) + Nhân bản (tái sử dụng) + Xoá.
import { useEffect, useMemo, useRef, useState } from 'react'
import { listAllTaiLieu, deleteTaiLieu, duplicateTaiLieu, updateTaiLieu, renumberBuoiLop, type TaiLieu } from '../../lib/tailieu'
import { phatHanhTest, PHAT_HANH_DUOC } from '../../lib/testonline'
import { listLinkGenJobs, type LinkGenJobRow } from '../../lib/linkgen'
import { listLop, type Lop } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import { useMonScope } from '../../lib/mon'
// ⭐ Hình: liệt kê CHUNG bảng này (KHÔNG gộp bảng — Thùy chốt "2 giáo trình riêng") + in/xoá dịch đúng
// pipeline riêng của Hình (loadLuoi + resolveBanIn + HinhPrintView, khác hẳn PrintView id-based của Đại).
import {
  listAllBuoiHinh, listGtBai as listGtBaiHinh, saveBuoiSelectionPhan as saveBuoiSelectionPhanHinh,
  saveBuoiSelection as saveBuoiSelectionHinh, loadBuoiPicks as loadBuoiPicksHinh, loadBuoiPicksPhan as loadBuoiPicksPhanHinh,
  deleteBuoi as deleteBuoiHinh, listHinhLinkGenJobs, enqueueHinhLinkGenJob, type HinhKhoRow, type CheDoHinh, type HinhLinkGenJob,
} from '../../lib/kho/hinhGiaoTrinh'
import { resolveBanIn as resolveBanInHinh, resolveEtBansHinh } from '../kho/hinh/GiaoTrinhScreen'
import { BuoiPickEditor as BuoiPickEditorHinh } from '../kho/hinh/SoanTaiLieu'
import { loadLuoi, type Luoi } from '../../lib/kho/hinh'
import HinhPrintView, { type BanIn as HinhBanIn, type HinhPerHS } from '../kho/hinh/HinhPrintView'
import type { PickItem } from '../../store/useStore'
import PrintView from './PrintView'
import ETPrintView from './ETPrintView'
import DeThiPrintView from './DeThiPrintView'
import MTPrintView from './MTPrintView'
import TaiLieuBuilder from './TaiLieuBuilder'
import { ETEditor, type ETView } from './ETScreen'
import { DeThiEditor } from './DeThiScreen'
import { MTEditor } from './MTScreen'
import SearchSelect from '../../components/SearchSelect'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import OnTapEditor from '../../components/OnTapEditor'
import { saveOnTapConfig, rebuildOnTapInDoc, btvnDaDong, type OnTapConfig } from '../../lib/ontap'

// Loại tài liệu có thể mở builder để sửa từ Kho. (mt_buoi = INSTANCE đã gán buổi — sửa nội dung
// phải qua master rồi gán lại, không sửa trực tiếp instance để tránh lệch với các lớp khác đã gán.)
const EDITABLE = new Set(['et', 'giao_trinh', 'giao_trinh_buoi', 'btvn', 'de_thi', 'mt'])

type DaiRow = TaiLieu & { nguon: 'dai'; lop_id?: string | null; ngay?: string | null; nguon_id?: string | null; nguon_buoi?: string | null }
type Row = DaiRow | (HinhKhoRow & { nguon: 'hinh' })
// ⭐ 21/08: Hình dùng CHUNG các khoá 'giao_trinh'/'giao_trinh_buoi'/'btvn' với Đại (HinhKhoRow.loai) —
// để rơi vào ĐÚNG 1 tab lọc thay vì tự đẻ nhãn "Giáo trình Hình" riêng (Thùy: "vẫn thấy Hình riêng
// không chung ở tab Tất cả"). KHÔNG còn 'hinh_giao_trinh*' — cột "Loại" tự nhiên đọc đúng nhãn Đại.
const LOAI_TEN: Record<string, string> = { giao_trinh: 'Giáo trình', giao_trinh_buoi: 'Giáo trình buổi', btvn: 'BTVN', et: 'ET', de_thi: 'Đề thi', bo_tro: 'Tài liệu bổ trợ', mt: 'MT', mt_buoi: 'MT buổi', chuyen_de: 'Chuyên đề' }
const loaiTen = (l: string) => LOAI_TEN[l] ?? l
const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—')

export default function KhoTaiLieuScreen() {
  const [rows, setRows] = useState<Row[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [loai, setLoai] = useState<string>('__all__')
  const [monF, setMonF] = useState<string>('__all__')
  const { allowedMons: myMons, isAll: laAdmin } = useMonScope()
  // Trạng thái gen-link ĐỜI 2: đọc từ bảng `linkgen_jobs` (worker server xử lý — xem lib/linkgen.ts),
  // KHÔNG còn từ store client. Poll nhẹ khi đang mở màn để nhãn "⏳ đang tạo…" tự đổi thành link.
  const [linkJobs, setLinkJobs] = useState<LinkGenJobRow[]>([])
  const [hinhLinkJobs, setHinhLinkJobs] = useState<HinhLinkGenJob[]>([])
  const [print, setPrint] = useState<{ id: string; loai: string } | null>(null)
  const [dlDoc, setDlDoc] = useState<{ id: string; loai: string } | null>(null)
  const [editEt, setEditEt] = useState<ETView | null>(null) // sửa ET tại chỗ (mở ETEditor)
  const [editGt, setEditGt] = useState<string | null>(null) // sửa giáo trình/BTVN (mở TaiLieuBuilder)
  const [editDeThi, setEditDeThi] = useState<string | null>(null) // sửa đề thi (mở DeThiEditor)
  const [editMT, setEditMT] = useState<string | null>(null) // sửa MT master (mở MTEditor)
  const [editOnTap, setEditOnTap] = useState<DaiRow | null>(null) // sửa ôn tập (modal nhỏ, spec-btvn-ontap.md §8)
  const [phBusy, setPhBusy] = useState<string | null>(null) // id doc đang phát hành
  const [phRes, setPhRes] = useState<{ ok: boolean; msg: string; skipped?: { ma_cau: string; warn: string }[] } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null) // feedback "✓ Đã copy" thoáng qua, không alert()
  async function copyLink(url: string, id: string) {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000)
  }
  const lopTen = (id?: string | null) => lops.find((l) => l.id === id)?.ten_lop ?? '?'

  async function phatHanh(r: DaiRow) {
    setPhBusy(r.id)
    try {
      const kq = await phatHanhTest(r.id)
      // Hạn nộp tự tính theo loại (mig 202608171359). Không tính được thì PHẢI nói ra —
      // im lặng nghĩa là bài mở vĩnh viễn mà không ai biết (đúng bug 32 test cũ của tháng 7).
      const han = kq.baiTest.deadline
        ? ` Hạn nộp: ${new Date(kq.baiTest.deadline).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}.`
        : ''
      setPhRes({ ok: true, msg: `Đã phát hành ${kq.added} câu cho học sinh làm online.${han}${kq.canhBao ? ` ⚠ ${kq.canhBao}` : ''}`, skipped: kq.skipped })
    } catch (e: any) {
      setPhRes({ ok: false, msg: e?.message ?? String(e) })
    } finally { setPhBusy(null) }
  }

  // Fetch CẢ 2 nguồn (Đại + Hình) — tách khỏi `reload()` để lượt refresh NGẦM (poll job xong, dưới) không
  // phải bật `loading` (xoá bảng ra "Đang tải…" giữa lúc Thùy đang lướt — đúng bug từng sửa 07-12).
  // ⭐ 21/08 (Thùy: "8A1 20/8 tài liệu hình ko thấy đâu luôn" — data CÓ THẬT, chỉ là NỐI 2 mảng rồi
  // không sort lại: Đại (đã sort created_at desc từ listAllTaiLieu) đứng TRƯỚC, Hình bị dồn hết XUỐNG
  // CUỐI bất kể ngày tạo — dòng Hình mới nhất bị chôn dưới hàng trăm dòng Đại cũ hơn). Sort LẠI TOÀN BỘ
  // sau khi gộp, cùng 1 tiêu chí created_at desc cho cả 2 nguồn — mới thật sự là "1 danh sách chung".
  async function fetchAllRows(): Promise<Row[]> {
    const [d, h] = await Promise.all([listAllTaiLieu(), listAllBuoiHinh()])
    const all = [...(d as TaiLieu[]).map((r) => ({ ...r, nguon: 'dai' as const })), ...h.map((r) => ({ ...r, nguon: 'hinh' as const }))]
    all.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
    return all
  }
  async function reload() {
    setLoading(true)
    try {
      const [rows, l] = await Promise.all([fetchAllRows(), listLop()])
      setRows(rows); setLops(l)
      return rows
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  // In 1 phiếu Hình — buổi MASTER (r.phan===null, 1 dòng gộp) cần chọn Lớp/Nhà; buổi ĐÃ GÁN LỚP (dòng đã
  // tách theo phan, xem listAllBuoiHinh) thì in đúng phan của chính dòng đó. Cần loadLuoi(khoi) trước
  // (Hình không id-based như Đại).
  const [hinhBan, setHinhBan] = useState<HinhBanIn | null>(null)
  // ⭐ 23/08 — ET (khác lop/nha): không phải 1 phiếu, mà 3 "mã đề" bản trống (khuôn Đại: Copy link ET
  // luôn là bản trống, không theo HS cụ thể — xem resolveEtBansHinh). Tái dùng CƠ CHẾ perHS sẵn có của
  // HinhPrintView (hoTen rỗng) thay vì thêm chế độ render mới.
  const [hinhBanPerHS, setHinhBanPerHS] = useState<HinhPerHS[] | undefined>(undefined)
  async function inHinh(r: HinhKhoRow, phan: 'lop' | 'nha' | 'et') {
    try {
      const L = await loadLuoi(r.khoi)
      if (phan === 'et') {
        const { ban, perHS } = await resolveEtBansHinh(L, r.buoiId, lopTen(r.lop_id), r.ngay ? r.ngay.split('-').reverse().join('/') : '')
        setHinhBan(ban); setHinhBanPerHS(perHS)
      } else {
        setHinhBan(await resolveBanInHinh(L, r.ten, await listGtBaiHinh(r.buoiId), phan)); setHinhBanPerHS(undefined)
      }
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  // "🖨 In nhanh" Hình — khuôn `dlDoc` của Đại: mở HinhPrintView ở chế độ headless (dựng xong TỰ mở hộp
  // thoại in native, không preview). Cần resolveBanIn giống inHinh, chỉ khác nơi render (headless không preview).
  const [hinhDl, setHinhDl] = useState<HinhBanIn | null>(null)
  const [hinhDlPerHS, setHinhDlPerHS] = useState<HinhPerHS[] | undefined>(undefined)
  async function inNhanhHinh(r: HinhKhoRow, phan: 'lop' | 'nha' | 'et') {
    try {
      const L = await loadLuoi(r.khoi)
      if (phan === 'et') {
        const { ban, perHS } = await resolveEtBansHinh(L, r.buoiId, lopTen(r.lop_id), r.ngay ? r.ngay.split('-').reverse().join('/') : '')
        setHinhDl(ban); setHinhDlPerHS(perHS)
      } else {
        setHinhDl(await resolveBanInHinh(L, r.ten, await listGtBaiHinh(r.buoiId), phan)); setHinhDlPerHS(undefined)
      }
    } catch (e: any) { alert(e.message ?? String(e)) }
  }
  // "✎ Sửa" Hình — mở modal HinhSuaModal (scoped theo r.phan, hoặc cả 2 phan nếu là dòng MASTER).
  // Dòng ET: KHÔNG có nội dung phù hợp BuoiPickEditor (mã đề/roster) — mở thẳng ETEditor (presetHinh).
  const [hinhSua, setHinhSua] = useState<HinhKhoRow | null>(null)
  const [editEtHinh, setEditEtHinh] = useState<{ lopId: string; ngay: string } | null>(null)
  // Xoá: buổi MASTER (phan===null, 1 dòng gộp) = xoá NGUYÊN buổi (khớp hành vi cũ, khớp Đại xoá cả
  // giáo trình master). Dòng ĐÃ TÁCH theo phan (buổi gán lớp) = chỉ xoá ĐÚNG PHAN đó (saveBuoiSelectionPhan
  // rỗng) — KHÔNG đụng phan còn lại (khác Đại: 2 tai_lieu ĐỘC LẬP nên xoá 1 cái không ảnh hưởng cái kia;
  // ở đây 2 dòng CHIA SẺ 1 hinh_gt_buoi thật, xoá cả buổi sẽ mất luôn phan kia — sai). Buổi trống cả 2
  // phan thì tự nhiên KHÔNG còn dòng nào ở đây nữa (listAllBuoiHinh chỉ chiếu phan CÓ bài).
  async function xoaHinh(r: HinhKhoRow) {
    if (!confirm(`Xoá "${r.ten}"?`)) return
    if (r.phan === null) await deleteBuoiHinh(r.buoiId)
    else await saveBuoiSelectionPhanHinh(r.buoiId, r.phan, { picks: [], cheDo: {}, soDong: {} })
    reload()
  }

  // Poll bảng jobs mỗi 8s khi màn đang mở — job chạy ở SERVER, màn này không có cách nào khác biết nó
  // xong lúc nào. Khi số job đang-chờ GIẢM (có job vừa xong) → tải lại danh sách NGẦM (không setLoading,
  // job xong lặng lẽ giữa lúc Thùy đang lướt bảng, không được xoá bảng ra "Đang tải…") để dòng đó hiện
  // "🔗 Copy link" ngay, không cần F5.
  const prevPendingRef = useRef(0)
  useEffect(() => {
    let stop = false
    const tick = async () => {
      try {
        // ⭐ 22/08: poll CẢ hinh_linkgen_jobs — cùng cơ chế "pending giảm → tải lại ngầm" của Đại, gộp
        // đếm chung 1 counter (chỉ cần biết "có job vừa xong" để refetch, không cần tách theo nguồn).
        const [jobs, hinhJobs] = await Promise.all([listLinkGenJobs(), listHinhLinkGenJobs()])
        if (stop) return
        setLinkJobs(jobs); setHinhLinkJobs(hinhJobs)
        const pending = jobs.filter((j) => j.status === 'pending' || j.status === 'processing').length
          + hinhJobs.filter((j) => j.status === 'pending' || j.status === 'processing').length
        if (pending < prevPendingRef.current) fetchAllRows().then((rows) => { if (!stop) setRows(rows) }).catch(() => {})
        prevPendingRef.current = pending
      } catch { /* mạng chớp — lượt poll sau tự bù */ }
    }
    tick()
    const t = setInterval(tick, 8000)
    return () => { stop = true; clearInterval(t) }
  }, [])

  // ⭐ 07-12 — link PDF giờ gen TỰ ĐỘNG ngay lúc tài liệu tạo/sửa xong (`enqueueLinkGen`, hàng đợi TOÀN
  // CỤC xử lý bởi `LinkGenWorker` mount ở App.tsx — xem store `linkGenQueue`). Màn này KHÔNG còn tự
  // dựng/upload gì nữa — nút chỉ COPY link đã có sẵn, không click-để-chờ trong bất kỳ trường hợp nào
  // (Thùy 07-12: "T ko muốn hiện lấy link... người dùng chỉ click vào link để copy thôi, KO chờ đợi").
  function layLink(r: DaiRow) {
    if (r.file_url) copyLink(r.file_url, r.id)
  }

  // Scope④ MÔN (useMonScope): admin/Ops/Media/Marketing thấy tất (liên-môn theo BIÊN CHẾ TEAM); GV/Học-
  // thuật/TG chỉ tài liệu môn mình — STRICT (chưa gán môn nào = KHÔNG thấy môn nào). Trước đây suy cross-
  // môn từ "myMons rỗng" là BUG: đúng cho Media/Marketing (họ vốn không gán môn) nhưng SAI cho ai khác lỡ
  // chưa được gán môn (leak thấy hết thay vì thấy rỗng) — giờ cross-môn suy từ TEAM, không suy từ rỗng.
  const visibleRows = useMemo(() => laAdmin ? rows : rows.filter((r) => myMons.includes(r.mon)), [rows, laAdmin, myMons])
  const monsCo = useMemo(() => [...new Set(visibleRows.map((r) => r.mon).filter(Boolean))].sort(), [visibleRows])
  const loais = useMemo(() => [...new Set(visibleRows.map((r) => r.loai))], [visibleRows])
  const shown = visibleRows
    .filter((r) => monF === '__all__' || r.mon === monF)
    .filter((r) => loai === '__all__' || r.loai === loai)
    .filter((r) => !q.trim() || r.ten.toLowerCase().includes(q.trim().toLowerCase()))

  // Nhân bản = MỘT LƯỢT GÁN (Thùy 07-12: "phải được coi như 1 lần gán... như gán ET bình thường, khác
  // cái là có nội dung sẵn") — KHÔNG còn prompt() tên tự do + lop_id/ngay null. Mở modal bắt buộc chọn
  // Lớp + Ngày buổi học (đúng component BuoiNgaySelect/SearchSelect ETEditor dùng), tên tự sinh theo
  // lớp+ngày (giống ET/BTVN), không cho gõ tay tránh lệch quy ước đặt tên giữa các loại tài liệu.
  const [dup, setDup] = useState<Row | null>(null)
  const [dupLop, setDupLop] = useState<string | null>(null)
  const [dupNgay, setDupNgay] = useState('')
  const [dupErr, setDupErr] = useState<string | null>(null)
  const [dupBusy, setDupBusy] = useState(false)
  function nhanBan(r: Row) { setDup(r); setDupLop(r.lop_id ?? null); setDupNgay(''); setDupErr(null) }
  async function xacNhanNhanBan() {
    if (!dup) return
    const l = lops.find((x) => x.id === dupLop)
    if (!l) { setDupErr('Chọn lớp.'); return }
    if (!dupNgay) { setDupErr('Chọn ngày buổi học.'); return }
    setDupBusy(true); setDupErr(null)
    try {
      // Tên gốc CÓ THỂ đã sẵn gắn lớp+ngày cũ trong chuỗi (vd "ET 5T1 · 12/07/2026", do ETEditor/TrichPanel
      // tự đặt) — nếu nối thêm mù quáng sẽ ra tên lặp ("...5T1 · 12/07/2026 · 5T1 · 19/07/2026"). Thay THẾ
      // đúng lớp/ngày CŨ bằng MỚI nếu tìm thấy trong tên; chỉ nối thêm khi tên gốc là MẪU (chưa gắn buổi).
      const ngayVN = dupNgay.split('-').reverse().join('/')
      const oldLop = dup.lop_id ? lopTen(dup.lop_id) : null
      const oldNgayVN = dup.ngay ? dup.ngay.split('-').reverse().join('/') : null
      let ten = dup.ten
      if (oldLop) ten = ten.split(oldLop).join(l.ten_lop)
      if (oldNgayVN) ten = ten.split(oldNgayVN).join(ngayVN)
      if (!oldLop || !oldNgayVN) ten = `${ten} · ${l.ten_lop} · ${ngayVN}`
      const created = await duplicateTaiLieu(dup.id, { ten, lop_id: l.id, ngay: dupNgay })
      // ⭐ 07-12: bản sao ĐỦ NỘI DUNG ngay (copy từ nguồn) — enqueue link luôn, không đợi bấm.
      useStore.getState().enqueueLinkGen(created.id, created.loai)
      // ⭐ 07-24: bản sao GT/BTVN gắn lớp = thêm 1 buổi vào bộ giáo trình của lớp → đánh số lại cả lớp
      // (tên + tiêu đề buổi mang số CỦA LỚP, kể cả bản sao vừa tạo — nó đang mang tên chép từ nguồn).
      if (['giao_trinh_buoi', 'btvn'].includes(created.loai)) {
        for (const d of await renumberBuoiLop(l.id)) useStore.getState().enqueueLinkGen(d.id, d.loai)
      }
      setDup(null)
      reload()
    } catch (e: any) { setDupErr(e.message ?? String(e)) } finally { setDupBusy(false) }
  }
  function sua(r: DaiRow) {
    if (r.loai === 'et') setEditEt({ ...(r as any), ten_lop: lopTen(r.lop_id) })
    else if (r.loai === 'de_thi') setEditDeThi(r.id)
    else if (r.loai === 'mt') setEditMT(r.id)
    else setEditGt(r.id)
  }
  // Đổi TÊN FILE ngay tại kho (= tai_lieu.ten, cột hiển thị) — khỏi vào builder (builder có ô tên buổi riêng dễ nhầm).
  // Tên cũng in RA TRÊN trang (tiêu đề + header/footer) → đổi tên = đổi nội dung PDF → phải làm mới link.
  async function doiTen(r: DaiRow) {
    const ten = prompt('Đổi tên tài liệu (tên hiển thị trong kho):', r.ten)?.trim()
    if (!ten || ten === r.ten) return
    await updateTaiLieu(r.id, { ten })
    reload()
    // Tên in RA TRÊN trang (tiêu đề + header/footer) → đổi tên = đổi nội dung PDF → link cũ lỗi thời.
    useStore.getState().enqueueLinkGen(r.id, r.loai)
  }

  // Sửa tại chỗ: mở builder full-screen. Link PDF tự làm mới NGAY TRONG chính editor lúc đóng (nút
  // "← ..."/"← Kho tài liệu" của mỗi editor tự enqueueLinkGen trước khi gọi onClose) — không cần lặp
  // lại ở đây nữa (07-12, dọn theo pivot gen-tại-lúc-sửa).
  if (editEt) return <ETEditor et={editEt} onClose={() => { setEditEt(null); reload() }} />
  if (editEtHinh) return <ETEditor presetHinh={editEtHinh} onClose={() => { setEditEtHinh(null); reload() }} />
  if (editGt) return <TaiLieuBuilder id={editGt} onClose={() => { setEditGt(null); reload() }} />
  if (editDeThi) return <DeThiEditor id={editDeThi} onClose={() => { setEditDeThi(null); reload() }} />
  if (editMT) return <MTEditor id={editMT} onClose={() => { setEditMT(null); reload() }} />

  const tab = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Kho tài liệu</span>
        {monsCo.length > 1 && (
          <div className="mr-1 flex gap-0.5 rounded-lg bg-violet-50 p-0.5">
            <button onClick={() => setMonF('__all__')} className={`h-6 rounded-md px-2.5 text-xs font-semibold transition ${monF === '__all__' ? 'bg-violet-600 text-white shadow-sm' : 'text-violet-600 hover:bg-violet-100'}`}>Mọi môn</button>
            {monsCo.map((m) => <button key={m} onClick={() => setMonF(m)} className={`h-6 rounded-md px-2.5 text-xs font-semibold transition ${monF === m ? 'bg-violet-600 text-white shadow-sm' : 'text-violet-600 hover:bg-violet-100'}`}>{m}</button>)}
          </div>
        )}
        <button onClick={() => setLoai('__all__')} className={tab(loai === '__all__')}>Tất cả</button>
        {loais.map((l) => <button key={l} onClick={() => setLoai(l)} className={tab(loai === l)}>{loaiTen(l)}</button>)}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên…" className="ml-auto h-7 w-52 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có tài liệu nào{loai !== '__all__' ? ` loại “${loaiTen(loai)}”` : ''}.</div>
          : (
            <div className="rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="sticky top-0 z-10 bg-slate-50 px-4 py-2.5">Tên tài liệu</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Loại</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Khối</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Gắn buổi</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Ngày tạo</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                      <td className="px-4 py-2">
                        {/* Tên dài (vd "BTVN 8A2 · Buổi 4: Bình phương của tổng hoặc hiệu") từng xuống dòng
                            làm CHIỀU CAO HÀNG ĐÓ lệch hẳn so với hàng khác → bảng "xiêu vẹo" — Thùy 07-12
                            báo lần 2, lần trước chỉ sửa cột Thao tác, BỎ SÓT chính cột Tên (đo bằng
                            getBoundingClientRect xác nhận: hàng tên dài cao 109px, hàng tên ngắn 51px).
                            Cắt gọn 1 dòng (`truncate`, cần `min-w-0` trên span vì mặc định flex item
                            min-width:auto sẽ chặn truncate), xem tên đầy đủ qua `title` khi hover. */}
                        {r.nguon === 'hinh' ? (
                          <span title={r.ten} className="flex max-w-[280px] items-center gap-1.5 font-medium text-slate-800">
                            <span className="min-w-0 truncate">{r.ten}</span>
                          </span>
                        ) : (
                        <button onClick={() => doiTen(r)} title={r.ten} className="group/n flex max-w-[280px] items-center gap-1.5 text-left font-medium text-slate-800 hover:text-indigo-600">
                          <span className="min-w-0 truncate">{r.ten}</span>
                          <span className="shrink-0 text-[11px] text-slate-300 opacity-0 transition group-hover/n:opacity-100">✎</span>
                        </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{loaiTen(r.loai)}</span></td>
                      <td className="whitespace-nowrap px-3 text-slate-500">{r.khoi || '—'}</td>
                      <td className="whitespace-nowrap px-3 text-slate-500">{r.lop_id && r.ngay ? `${lopTen(r.lop_id)} · ${fmt(r.ngay)}` : (r.loai === 'et' || r.loai === 'mt' || r.loai === 'giao_trinh' ? <span className="text-violet-500">mẫu</span> : '—')}</td>
                      <td className="whitespace-nowrap px-3 text-slate-500">{fmt(r.created_at)}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        {r.nguon === 'hinh' ? (
                          // ⭐ 22/08 (Thùy: "t thấy giáo trình 7A vẫn còn in lớp in nhà là sao, m fix mỗi lớp
                          // 8 à??"): dòng MASTER (r.phan===null, chưa gán lớp) đại diện 2 tài liệu (Lớp/Nhà)
                          // gộp 1 dòng — Đại không phân biệt master/đã-tách, giờ Hình cũng đủ bộ nút cho CẢ
                          // 2 phan (file_url_lop/file_url_nha riêng). Dòng ĐÃ TÁCH (buổi gán lớp) chỉ có
                          // đúng 1 phan của chính nó, dùng file_url chung.
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {/* ⭐ 23/08 — dòng ET (r.phan==='et') không có nội dung hợp với HinhSuaModal (mã đề/roster
                                riêng, không phải picks đơn thuần) → Sửa mở thẳng ETEditor (presetHinh, y hệt "Sửa" ET Đại). */}
                            <button onClick={() => r.phan === 'et' ? setEditEtHinh({ lopId: r.lop_id!, ngay: r.ngay! }) : setHinhSua(r)} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">✎ Sửa</button>
                            {(r.phan === null ? (['lop', 'nha'] as const) : [r.phan]).map((phan) => {
                              const url = r.phan === null ? (phan === 'lop' ? r.file_url_lop : r.file_url_nha) : r.file_url
                              const nhan = r.phan === null ? (phan === 'lop' ? '📘' : '📝') : '🖨'
                              return (
                                <div key={phan} className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50/60 px-1.5 py-0.5">
                                  {r.phan === null && <span className="text-[11px] font-medium text-slate-400">{phan === 'lop' ? 'Lớp' : 'Nhà'}</span>}
                                  <button onClick={() => inHinh(r, phan)} className="shrink-0 rounded-md bg-indigo-600 px-2 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">{nhan} In</button>
                                  <button onClick={() => inNhanhHinh(r, phan)} className="shrink-0 rounded-md border border-indigo-300 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">In nhanh</button>
                                  {url ? (
                                    <button onClick={() => copyLink(url, r.id + ':' + phan)} title={url} className="shrink-0 rounded-md border border-sky-300 px-2 py-1 text-[12px] font-medium text-sky-700 hover:bg-sky-50">
                                      {copiedId === r.id + ':' + phan ? '✓ Đã copy' : '🔗 Copy link'}
                                    </button>
                                  ) : hinhLinkJobs.some((j) => j.buoi_id === r.buoiId && j.phan === phan && (j.status === 'pending' || j.status === 'processing')) ? (
                                    <span className="shrink-0 px-1 text-[12px] text-sky-500">⏳ đang tạo…</span>
                                  ) : hinhLinkJobs.some((j) => j.buoi_id === r.buoiId && j.phan === phan && j.status === 'failed') ? (
                                    <span className="shrink-0 px-1 text-[12px] text-rose-500" title={'Lỗi: ' + (hinhLinkJobs.find((j) => j.buoi_id === r.buoiId && j.phan === phan)?.error ?? '?')}>⚠ lỗi, bấm ↻</span>
                                  ) : (
                                    <span className="shrink-0 px-1 text-[12px] text-slate-300" title="Chưa có link">— chưa có link</span>
                                  )}
                                  <button onClick={() => enqueueHinhLinkGenJob(r.buoiId, phan).then(() => setHinhLinkJobs((s) => [...s.filter((j) => !(j.buoi_id === r.buoiId && j.phan === phan)), { buoi_id: r.buoiId, phan, status: 'pending', attempt: 0, error: null }]))}
                                    title="Tạo lại link" className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[12px] text-slate-400 hover:border-sky-300 hover:text-sky-600">↻</button>
                                </div>
                              )
                            })}
                            <button onClick={() => xoaHinh(r)} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                          </div>
                        ) : (
                        <div className="flex justify-end gap-1.5">
                          {EDITABLE.has(r.loai) && <button onClick={() => sua(r)} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">✎ Sửa</button>}
                          {r.loai === 'btvn' && r.nguon_id && r.nguon_buoi && r.lop_id && (
                            <button onClick={() => setEditOnTap(r)} className="shrink-0 rounded-md border border-violet-300 px-2.5 py-1 text-[12px] font-medium text-violet-700 hover:bg-violet-50">✎ Ôn tập</button>
                          )}
                          {PHAT_HANH_DUOC.has(r.loai) && r.lop_id && r.ngay && (
                            <button onClick={() => phatHanh(r)} disabled={phBusy === r.id} title="Phát hành online"
                              className="shrink-0 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">
                              {phBusy === r.id ? '…' : '📱'}
                            </button>
                          )}
                          <button onClick={() => setPrint({ id: r.id, loai: r.loai })} className="shrink-0 rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">🖨 In</button>
                          {/* Bỏ qua bước xem thử, mở thẳng hộp thoại in (bản Học sinh mặc định) — Thùy
                              07-11: đổi hẳn từ html2canvas tự vẽ lại (hay lỗi) sang NATIVE print. */}
                          <button onClick={() => setDlDoc({ id: r.id, loai: r.loai })} className="shrink-0 rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">🖨 In nhanh</button>
                          {/* ⭐ 07-12: link gen TỰ ĐỘNG ngay lúc tạo/sửa xong (LinkGenWorker toàn cục) —
                              nút này CHỈ COPY, không còn click-để-chờ trong bất kỳ trường hợp nào. Chưa
                              có link (vừa tạo, đang gen ở nền, hoặc tài liệu cũ từ trước tính năng này)
                              → nhãn thụ động, không phải nút chờ. */}
                          {r.file_url ? (
                            <button onClick={() => layLink(r)} title={r.file_url} className="shrink-0 rounded-md border border-sky-300 px-2.5 py-1 text-[12px] font-medium text-sky-700 hover:bg-sky-50">
                              {copiedId === r.id ? '✓ Đã copy' : '🔗 Copy link'}
                            </button>
                          ) : linkJobs.some((j) => j.tai_lieu_id === r.id && (j.status === 'pending' || j.status === 'processing')) ? (
                            <span className="shrink-0 px-1 text-[12px] text-sky-500">⏳ đang tạo…</span>
                          ) : linkJobs.some((j) => j.tai_lieu_id === r.id && j.status === 'failed') ? (
                            <span className="shrink-0 px-1 text-[12px] text-rose-500" title={'Server đã thử tạo link 3 lần nhưng không xong — bấm ↻ để thử lại. Lỗi: ' + (linkJobs.find((j) => j.tai_lieu_id === r.id)?.error ?? '?')}>⚠ lỗi, bấm ↻</span>
                          ) : (
                            <span className="shrink-0 px-1 text-[12px] text-slate-300" title="Tài liệu cũ từ trước tính năng tự-tạo-link — bấm ↻ để tạo">— chưa có link</span>
                          )}
                          {/* "↻" — lối thoát khi job nền lỗi/treo (paged.js đôi khi treo, xem DEVLOG) và
                              tài liệu mãi không có link. KHÔNG hiện trạng thái chờ — bấm xong là quên, có
                              thì hiện ở lượt xem sau, ĐÚNG tinh thần "không chờ đợi gì cả" của Thùy. */}
                          <button onClick={() => useStore.getState().enqueueLinkGen(r.id, r.loai)} title="Tạo lại link (dùng khi mãi không thấy link, hoặc nội dung vừa đổi ở nơi khác)"
                            className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[12px] text-slate-400 hover:border-sky-300 hover:text-sky-600">↻</button>
                          <button onClick={() => nhanBan(r)} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Nhân bản</button>
                          {/* Xoá 1 buổi GIỮA lịch của lớp ⇒ các buổi sau dồn số (deleteTaiLieu tự đánh
                              số lại cả lớp) → doc nào đổi tiêu đề buổi thì phải làm mới link PDF. */}
                          <button onClick={async () => { if (confirm(`Xoá “${r.ten}”?`)) { for (const d of await deleteTaiLieu(r.id)) useStore.getState().enqueueLinkGen(d.id, d.loai); reload() } }} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                        </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {print && (print.loai === 'et'
        ? <ETPrintView id={print.id} onClose={() => { setPrint(null); reload() }} />
        : print.loai === 'de_thi'
        ? <DeThiPrintView id={print.id} onClose={() => { setPrint(null); reload() }} />
        : print.loai === 'mt' || print.loai === 'mt_buoi'
        ? <MTPrintView id={print.id} onClose={() => { setPrint(null); reload() }} />
        : <PrintView id={print.id} onClose={() => { setPrint(null); reload() }} />)}

      {hinhBan && <HinhPrintView ban={hinhBan} perHS={hinhBanPerHS} onClose={() => { setHinhBan(null); setHinhBanPerHS(undefined) }} />}
      {hinhDl && <HinhPrintView ban={hinhDl} perHS={hinhDlPerHS} headless onClose={() => { setHinhDl(null); setHinhDlPerHS(undefined) }} />}
      {hinhSua && <HinhSuaModal row={hinhSua} onClose={() => { setHinhSua(null); reload() }} />}

      {/* "🖨 In nhanh" từ hàng (headless: dựng ẩn → mở hộp thoại in NATIVE → đóng khi hộp thoại đóng),
          không mở preview. KHÔNG còn ghi file_url (đó là việc riêng của "🔗 Lấy link" — xem dưới). */}
      {dlDoc && (dlDoc.loai === 'et'
        ? <ETPrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />
        : dlDoc.loai === 'de_thi'
        ? <DeThiPrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />
        : dlDoc.loai === 'mt' || dlDoc.loai === 'mt_buoi'
        ? <MTPrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />
        : <PrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />)}

      {dup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => !dupBusy && setDup(null)}>
          <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-semibold text-slate-900">Nhân bản · gán vào buổi</p>
            <p className="mt-1 text-[12px] text-slate-500">Sao chép nội dung "{dup.ten}" cho 1 lớp + ngày cụ thể — giống gán ET, chỉ khác là câu đã có sẵn.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-slate-600">Lớp</label>
                <SearchSelect value={dupLop} onChange={(v) => { setDupLop(v); setDupNgay('') }} placeholder="chọn lớp…"
                  options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-slate-600">Ngày buổi học</label>
                <BuoiNgaySelect lopId={dupLop} value={dupNgay} onChange={setDupNgay} className="h-9 w-full rounded-md border border-slate-300 px-2 text-[13px] disabled:bg-slate-50 disabled:text-slate-300" defaultToday />
              </div>
            </div>
            {dupErr && <p className="mt-3 text-[12px] text-rose-600">{dupErr}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDup(null)} disabled={dupBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 disabled:opacity-40">Huỷ</button>
              <button onClick={xacNhanNhanBan} disabled={dupBusy || !dupLop || !dupNgay} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{dupBusy ? 'Đang tạo…' : 'Tạo bản sao'}</button>
            </div>
          </div>
        </div>
      )}

      {phRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setPhRes(null)}>
          <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className={`text-[15px] font-semibold ${phRes.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{phRes.ok ? '✓ Phát hành thành công' : 'Không phát hành được'}</p>
            <p className="mt-1 text-sm text-slate-600">{phRes.msg}</p>
            {phRes.skipped && phRes.skipped.length > 0 && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3">
                <p className="text-[12px] font-semibold text-amber-700">{phRes.skipped.length} câu bị bỏ qua (không lên online):</p>
                <ul className="mt-1 max-h-40 overflow-auto text-[12px] text-amber-800">
                  {phRes.skipped.map((s, i) => <li key={i}>• {s.ma_cau}: {s.warn}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-4 text-right">
              <button onClick={() => setPhRes(null)} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {editOnTap && <OnTapModal doc={editOnTap} onClose={() => setEditOnTap(null)} onSaved={reload} />}
    </div>
  )
}

// Modal nhỏ "✎ Ôn tập" (spec-btvn-ontap.md §8) — nội dung = ĐÚNG khối UI ở TrichPanel (OnTapEditor dùng
// chung, cấm copy-paste 2 bản, ADR-017). Lưu = saveOnTapConfig + rebuild-tại-chỗ (KHÔNG re-trích cả doc —
// không đụng khối BTVN gốc). doc.nguon_id/nguon_buoi/lop_id đã verify non-null ở nút mở modal.
function OnTapModal({ doc, onClose, onSaved }: { doc: DaiRow; onClose: () => void; onSaved: () => void }) {
  const [config, setConfig] = useState<OnTapConfig | null>(null)
  const [daDo, setDaDo] = useState(false)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    let alive = true
    if (doc.lop_id && doc.ngay) btvnDaDong(doc.lop_id, doc.ngay).then((v) => { if (alive) setDaDo(v) }).catch(() => {})
    return () => { alive = false }
  }, [doc.id]) // eslint-disable-line

  async function luu() {
    if (!doc.nguon_id || !doc.nguon_buoi || !doc.lop_id || !config) return
    // Câu hỏi mở #4 (Thùy chốt): CHỈ CẢNH BÁO, không chặn cứng như xoaHSKhoiBuoi.
    if (daDo && !confirm('Buổi này đã đóng BTVN (đã chấm) — đổi câu ôn tập có thể ảnh hưởng phép đo đã ghi nhận. Vẫn lưu?')) return
    setSaving(true)
    try {
      await saveOnTapConfig(doc.nguon_id, doc.nguon_buoi, doc.lop_id, config)
      const { matChet } = await rebuildOnTapInDoc(doc.id, doc.nguon_id, doc.nguon_buoi, doc.lop_id, doc.mon)
      if (matChet.length) alert(`${matChet.length} câu không còn trong kho (đã xoá/đổi mã) — đã bỏ khỏi phiếu, mở lại để chọn câu khác.`)
      onSaved()
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="flex h-[80vh] w-[640px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
          <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900" title={doc.ten}>✎ Ôn tập · {doc.ten}</p>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {daDo && <div className="mx-5 mt-3 shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">⚠ Buổi này đã đóng BTVN (đã chấm) — đổi câu có thể ảnh hưởng phép đo đã ghi.</div>}
        <div className="min-h-0 flex-1 overflow-auto px-5 pb-3">
          {doc.nguon_id && doc.nguon_buoi && doc.lop_id && (
            <OnTapEditor nguonId={doc.nguon_id} buoiId={doc.nguon_buoi} lopId={doc.lop_id} khoi={doc.khoi} mon={doc.mon} config={config} onChange={setConfig} />
          )}
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button onClick={onClose} disabled={saving} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 disabled:opacity-40">Huỷ</button>
          <button onClick={luu} disabled={saving || !config} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-500 disabled:opacity-40">{saving ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

// ⭐ 22/08 (Thùy: "làm nốt cho giống Đại — Sửa tại chỗ"): "✎ Sửa" cho Hình, mở NGAY từ Kho tài liệu —
// KHÔNG cần đi qua cây Khối→Giáo trình→Buổi của màn Giáo trình Hình. Tái dùng ĐÚNG `BuoiPickEditor` (đã
// có sẵn cơ chế `phans` để scope 1 hoặc nhiều phan — xem SoanTaiLieu.tsx) + autosave từng thao tác (khuôn
// GiaoTrinhScreen: KHÔNG nút "Lưu" riêng, mỗi đổi ghi DB ngay). Dòng đã tách theo phan (r.phan!==null) →
// sửa ĐÚNG phan đó; dòng MASTER (r.phan===null, chưa gán lớp) → sửa CẢ hai phan cùng lúc (khớp cách
// GiaoTrinhScreen tự làm, vì master vốn không tách 2 tài liệu).
function HinhSuaModal({ row, onClose }: { row: HinhKhoRow; onClose: () => void }) {
  const [L, setL] = useState<Luoi | null>(null)
  const [picks, setPicks] = useState<PickItem[]>([])
  const [cheDo, setCheDo] = useState<Record<string, CheDoHinh>>({})
  const [soDong, setSoDong] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const phans = row.phan ? [row.phan] : (['lop', 'nha'] as const)
  useEffect(() => {
    let alive = true
    ;(async () => {
      const [Lv, nhap] = await Promise.all([
        loadLuoi(row.khoi),
        row.phan ? loadBuoiPicksPhanHinh(row.buoiId, row.phan) : loadBuoiPicksHinh(row.buoiId),
      ])
      if (!alive) return
      setL(Lv); setPicks(nhap.picks); setCheDo(nhap.cheDo); setSoDong(nhap.soDong)
    })().catch((e) => { if (alive) setErr(e.message ?? String(e)) }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [row.buoiId, row.phan, row.khoi])
  // Ghi ngay xuống DB mỗi lần đổi — 1 phan thì saveBuoiSelectionPhan (không đụng phan kia), master (2
  // phan) thì saveBuoiSelection (thay CẢ buổi — đúng vì đang sửa cả 2 phan cùng lúc, không phan nào bị bỏ sót).
  const luu = async (p: PickItem[], c: Record<string, CheDoHinh>, s: Record<string, number>) => {
    try {
      if (row.phan) await saveBuoiSelectionPhanHinh(row.buoiId, row.phan, { picks: p, cheDo: c, soDong: s })
      else await saveBuoiSelectionHinh(row.buoiId, { picks: p, cheDo: c, soDong: s })
    } catch (e: any) { setErr(e.message ?? String(e)) }
  }
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-5 py-3">
        <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900" title={row.ten}>✎ Sửa · {row.ten}</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">Tự lưu mỗi thay đổi</span>
        <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
      </div>
      {err && <div className="shrink-0 bg-rose-50 px-5 py-2 text-[12.5px] text-rose-700">{err}</div>}
      <div className="min-h-0 flex-1 overflow-auto p-5">
        {loading || !L ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          <BuoiPickEditorHinh L={L} picks={picks} cheDo={cheDo} soDong={soDong} phans={[...phans]}
            onChangePicks={(p) => { setPicks(p); luu(p, cheDo, soDong) }}
            onChangeCheDo={(c) => { setCheDo(c); luu(picks, c, soDong) }}
            onChangeSoDong={(s) => { setSoDong(s); luu(picks, cheDo, s) }} />
        )}
      </div>
    </div>
  )
}
