// ============================================================================
// SoTayHS — SỔ TAY KIẾN THỨC (CEO 18/09). HS tra lý thuyết + bài mẫu của 1 dạng bài.
//
// HAI ĐƯỜNG VÀO (CEO: "sẽ có 2 loại học sinh"):
//   ① Em BIẾT tên dạng → gõ vào ô tìm, hệ gợi ý dần theo ký tự (bỏ dấu, gõ "phuong trinh
//     bac hai" vẫn ra). Gõ ≥2 ký tự là kết quả tìm THAY cho cây bên dưới.
//   ② Em KHÔNG biết tên → lọc dần: Chủ đề → Chuyên đề → Dạng, kèm lọc độ khó.
//
// ⚠ THỨ TỰ TẦNG: CEO nói "chuyên đề → chủ đề" nhưng DB ngược lại — `ma_chu_de` là tầng CHA,
//   `ma_chuyen_de` là tầng CON (xem `MapRow` ở lib/kho/api.ts:1710-1711 và `fn_dai_sinh_ma_
//   chuyen_de(p_ma_chu_de,…)`). Theo DB vì đó là chân lý runtime (CLAUDE.md §0).
//
// DRILL-DOWN chứ không accordion: CEO mô tả là lọc TUẦN TỰ ("chọn được chuyên đề thì lọc
//   tiếp…"), và trên màn điện thoại cây 3 tầng xổ ra rất khó nhắm trúng dòng.
//
// TOÀN BỘ dữ liệu qua RPC (lib/sotay.ts) — kho bật RLS member-gate, HS query thẳng ra 0 dòng
//   IM LẶNG. Cây của 1 khối lấy MỘT lần rồi lọc tại chỗ: đổi độ khó / đi lui đi tới giữa các
//   tầng là tức thì, không quét lại (CLAUDE.md §2 "sau mutation không reload cả danh sách" —
//   ở đây là đổi lựa chọn UI trong cùng ngữ cảnh, càng không được chớp trắng).
// ============================================================================
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MathText } from '../kho/ui'
import { monCuaHS } from '../../lib/tuluyen'
import {
  soTayCay, soTayTim, soTayDang, SOTAY_NHANH, NHOM_TEN,
  type SoTayCay, type SoTayChuDe, type SoTayChuyenDe, type SoTayNhanh, type SoTayNhom,
  type SoTayTimRow, type SoTayNoiDung,
} from '../../lib/sotay'
import { soTayTimCt, soTayMucCay, soTayMuc, MUC_LOAI, MUC_LOAI_THU_TU, type CtTimRow, type MucCay, type MucSoTay, type MucLoai } from '../../lib/sotayCongThuc'
import { ManHS, DauTrangHS, NhomHS, MAU, THE, THE_TRON, HEAD } from './skin/KhungHS'

// Thùy 29/09: mọi màn theo STYLE (skin) em đang chọn — bỏ nền mây + chồng sách + khẩu hiệu + màu theo giới tính.
// `t` còn truyền qua các mảnh con nhưng mọi giá trị giờ là biến skin (1 bản cho cả nam/nữ).
const NAVY = MAU.ink
const T_SKIN = { primary: MAU.acc, sec: MAU.muted }
const THEME = { nam: T_SKIN, nu: T_SKIN }
type Theme = typeof T_SKIN

// Màu nhóm độ khó — dùng màu NGỮ NGHĨA + nền trong suốt (NHOM_MAU ở lib là pastel, chết trên skin tối).
const NHOM_MAU_SKIN: Record<SoTayNhom, { chu: string; nen: string }> = {
  co_ban: { chu: MAU.dung, nen: 'rgba(34,160,107,0.16)' },
  trung_binh: { chu: MAU.canhBao, nen: 'rgba(224,144,30,0.16)' },
  nang_cao: { chu: MAU.sai, nen: 'rgba(229,72,77,0.16)' },
}

// Shell = khung skin + đầu trang. Không còn hình trang trí cố định ở đáy ⇒ cờ `decor` giữ cho chữ ký cũ, không còn tác dụng.
function Kung({ title, sub, onBack, children }: {
  t?: Theme; title: string; sub?: string; onBack: () => void; decor?: boolean; children: ReactNode
}) {
  return (
    <ManHS>
      <DauTrangHS tieuDe={<span className="whitespace-normal">{title}</span>} onBack={onBack} theoMon />
      {sub && <p className="-mt-1 text-[12.5px] leading-snug" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>{sub}</p>}
      <div>{children}</div>
    </ManHS>
  )
}

function Chip({ chon, ten, onClick }: { chon: boolean; ten: string; onClick: () => void; t?: Theme }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 text-[12.5px] font-bold transition active:scale-95"
      style={chon
        ? { background: MAU.acc, color: MAU.accInk, borderRadius: '999px', border: `1px solid ${MAU.acc}` }
        : { ...THE_TRON, borderRadius: '999px', color: MAU.muted }}>
      {ten}
    </button>
  )
}

function NhomChip({ nhom }: { nhom: SoTayNhom | null }) {
  if (!nhom) return null
  const m = NHOM_MAU_SKIN[nhom]
  return <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: m.nen, color: m.chu }}>{NHOM_TEN[nhom]}</span>
}

// Nhãn loại kết quả tìm (CEO 03/10): mục sổ tay (xếp TRƯỚC) mang tên LOẠI của nó — "Công thức", "Khái niệm"… (03/10, sổ tay KHTN);
// dạng bài ⇒ "Lý thuyết".
function NhanLoai({ loai }: { loai: MucLoai | 'ly_thuyet' }) {
  const muc = loai !== 'ly_thuyet'
  return <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black"
    style={muc ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface2, color: MAU.muted }}>{muc ? MUC_LOAI[loai].ten : 'Lý thuyết'}</span>
}

// Dòng danh sách dùng chung cho cả 3 tầng + kết quả tìm.
function Dong({ ten, phu, duoi, onClick }: { t?: Theme; ten: string; phu?: ReactNode; duoi?: string | null; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 p-3.5 text-left transition active:scale-[0.98]"
      style={THE}>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="min-w-0 text-[14.5px] font-extrabold leading-snug" style={{ color: NAVY }}>{ten}</span>
          {phu}
        </span>
        {duoi && <span className="mt-1 block truncate text-[11.5px]" style={{ color: MAU.muted }}>{duoi}</span>}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: MAU.surface2 }}>
        <svg viewBox="0 0 48 48" className="h-3.5 w-3.5" fill="none" aria-hidden><path d="M18 12l12 12-12 12" stroke={MAU.acc} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  )
}

function Trong({ icon, title, mo_ta }: { t?: Theme; icon: string; title: string; mo_ta: string }) {
  return (
    <div className="mt-4 p-6 text-center" style={THE}>
      <div className="text-[34px]">{icon}</div>
      <p className="mt-2 text-[15px] font-extrabold" style={{ ...HEAD, color: NAVY }}>{title}</p>
      <p className="mt-1 text-[12.5px] leading-snug" style={{ color: MAU.muted }}>{mo_ta}</p>
    </div>
  )
}

// Nguồn dữ liệu tách ra prop để `hs.html?demo=sotay` (DEV, AppHS.tsx) xem được màn bằng data giả
// — Claude không có mã+PIN của HS thật nên không tự mở app thật để soi layout được. Mặc định là
// 3 RPC thật; đường chạy production KHÔNG có thêm nhánh if nào.
// `timCt` (thẻ CÔNG THỨC, CEO 03/10) tuỳ chọn để mock cũ không vỡ — thiếu thì coi như không có thẻ nào.
// `mucCay`/`muc` (MỤC SỔ TAY theo chủ đề — sổ tay KHTN 03/10) cũng tuỳ chọn: thiếu thì không có tab "Sổ tay".
export type SoTayApi = { cay: typeof soTayCay; tim: typeof soTayTim; dang: typeof soTayDang; timCt?: typeof soTayTimCt; mon?: () => Promise<string | null>
  mucCay?: typeof soTayMucCay; muc?: typeof soTayMuc }
const API_THAT: SoTayApi = { cay: soTayCay, tim: soTayTim, dang: soTayDang, timCt: soTayTimCt, mon: monCuaHS, mucCay: soTayMucCay, muc: soTayMuc }

// ⚠ `e instanceof Error` KHÔNG bắt được lỗi Supabase: `supabase.rpc` trả `{ error }` là
// PostgrestError — OBJECT THƯỜNG `{message, details, hint, code}`, không phải subclass của Error.
// Dùng instanceof ⇒ luôn rơi vào nhánh fallback ⇒ nuốt mất message thật của DB (đúng thứ cần đọc
// nhất khi RPC hỏng). Đọc `.message` của mọi object thay vì hỏi nó là "Error" hay không.
function moTaLoi(e: unknown, mac_dinh: string): string {
  if (e && typeof e === 'object' && 'message' in e) {
    const m = (e as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  return mac_dinh
}
// Log NGUYÊN error (không phải chuỗi đã rút gọn) — mất stack/`code`/`hint` là mất đường chẩn đoán.
const ghiLoi = (cho: string, e: unknown) => console.error(`[SoTay] ${cho} lỗi:`, e)

export default function SoTayHS({ gioiTinh, onXong, api = API_THAT }: {
  gioiTinh: 'nam' | 'nu' | null; onXong: () => void; api?: SoTayApi
}) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  const [mon, setMon] = useState<string | null>(null)
  const [nhanh, setNhanh] = useState<SoTayNhanh>(null)
  const [khoi, setKhoi] = useState<string | null>(null)   // null = để DB chọn khối của HS
  const [cay, setCay] = useState<SoTayCay | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [nhomLoc, setNhomLoc] = useState<SoTayNhom | null>(null)
  const [duong, setDuong] = useState<{ chuDe: SoTayChuDe | null; chuyenDe: SoTayChuyenDe | null }>({ chuDe: null, chuyenDe: null })
  const [maDangMo, setMaDangMo] = useState<string | null>(null)
  const [q, setQ] = useState('')
  // Kết quả tìm = 2 nguồn: thẻ công thức (`ct`) + dạng bài (`lt`). null = không đang tìm.
  const [ketQua, setKetQua] = useState<{ ct: CtTimRow[]; lt: SoTayTimRow[] } | null>(null)
  // MỤC SỔ TAY đang đọc — NGĂN XẾP vì bấm "Liên quan" mở mục khác; Quay lại lùi đúng 1 mục.
  const [mucMo, setMucMo] = useState<MucSoTay[]>([])
  const moMuc = (r: MucSoTay) => setMucMo((s) => [...s, r])
  // TAB: 'muc' = sổ tay theo chủ đề (khái niệm, công thức, hiện tượng… — có khi môn có mục đã duyệt) · 'dang' = lý thuyết theo dạng bài.
  const [che, setChe] = useState<'muc' | 'dang' | null>(null) // null = chưa biết (chờ cây mục) ⇒ tự chọn 'muc' nếu môn có mục
  const [mucCay, setMucCay] = useState<MucCay | null>(null)
  const [mucKhoi, setMucKhoi] = useState<string | null>(null)
  const [mucNhanh, setMucNhanh] = useState<string | null>(null)
  const [mucChuDe, setMucChuDe] = useState<string | null>(null)
  const [loiMuc, setLoiMuc] = useState<string | null>(null)
  const [loiTim, setLoiTim] = useState<string | null>(null) // tách khỏi `ketQua` — xem effect tìm

  // 01/10: bỏ đường lùi cứng 'Toán' — không xác định được môn thì báo, không tự mở sổ tay môn khác.
  useEffect(() => {
    ;(api.mon ?? monCuaHS)().then((m) => { if (m) setMon(m); else setLoi('Chưa xác định được môn học của em — báo thầy cô nhé.') })
      .catch((e) => setLoi(e?.message ?? String(e)))
  }, [])

  // Đổi NGỮ CẢNH (môn/nhánh/khối) ⇒ quét lại là đúng. Giữ `cay` cũ tới khi có cây mới thay vì
  // setCay(null) — không chớp trắng giữa hai lần đổi nhánh (CLAUDE.md §2).
  useEffect(() => {
    if (!mon) return
    let huy = false
    setLoi(null)
    api.cay(mon, nhanh, khoi)
      .then((c) => { if (huy) return; setCay(c); setDuong({ chuDe: null, chuyenDe: null }) })
      .catch((e) => { ghiLoi('tải cây', e); if (!huy) setLoi(moTaLoi(e, 'Không tải được sổ tay.')) })
    return () => { huy = true }
  }, [mon, nhanh, khoi])

  // Cây MỤC SỔ TAY (chủ đề → mục) của môn + khối. Đổi khối = đổi ngữ cảnh ⇒ tải lại (giữ cây cũ tới khi có cây mới).
  useEffect(() => {
    if (!mon || !api.mucCay) { setChe((c) => c ?? 'dang'); return }
    let huy = false
    setLoiMuc(null)
    api.mucCay(mon, mucKhoi)
      .then((c) => { if (huy) return; setMucCay(c); setMucChuDe(null); setChe((x) => x ?? (c.chu_de.length ? 'muc' : 'dang')) })
      .catch((e) => { ghiLoi('tải cây mục', e); if (!huy) { setLoiMuc(moTaLoi(e, 'Không tải được sổ tay.')); setChe((x) => x ?? 'dang') } })
    return () => { huy = true }
  }, [mon, mucKhoi])

  // Tìm kiếm: gõ <2 ký tự thì tắt hẳn kết quả (trả về cây). Debounce 250ms để mỗi phím không
  // bắn 1 RPC. `lanTim` chặn kết quả của lượt gõ CŨ về sau đè lên lượt mới (race khi mạng lag).
  // ⭐ RPC LỖI ≠ KHÔNG CÓ KẾT QUẢ — hai trạng thái TÁCH HẲN (bản trước gộp làm một:
  // `.catch(() => setKetQua([]))` biến MỌI lỗi thành "Không tìm thấy dạng nào", nên khi
  // `hs_sotay_tim` nổ ở `format()` thì màn vẫn nói tỉnh bơ "0 kết quả" — bug sống 2 ngày,
  // không ai nhìn màn hình mà đoán ra được. `loiTim != null` ⇒ vẽ hộp lỗi, KHÔNG vẽ hộp rỗng.
  const lanTim = useRef(0)
  useEffect(() => {
    const tu = q.trim()
    if (!mon || tu.length < 2) { setKetQua(null); setLoiTim(null); return }
    const lan = ++lanTim.current
    const id = setTimeout(() => {
      const k = che === 'muc' ? (mucKhoi ?? mucCay?.khoi ?? null) : (khoi ?? cay?.khoi ?? null)
      // Hai RPC song song. Một bên hỏng ⇒ báo LỖI (không lặng lẽ hiện nửa kết quả như thể đủ).
      Promise.all([(api.timCt ?? (async () => []))(tu, mon, k), api.tim(tu, mon, nhanh, k)])
        .then(([ct, lt]) => { if (lan !== lanTim.current) return; setLoiTim(null); setKetQua({ ct, lt }) })
        .catch((e) => {
          ghiLoi('tìm', e)
          if (lan !== lanTim.current) return
          setLoiTim(moTaLoi(e, 'Không tìm được, thử lại giúp em nhé.'))
          setKetQua({ ct: [], lt: [] })
        })
    }, 250)
    return () => clearTimeout(id)
  }, [q, mon, nhanh, khoi, cay?.khoi, che, mucKhoi, mucCay?.khoi])

  // Lọc độ khó trên cây ĐÃ TẢI — lọc thuần tuý theo lựa chọn UI đang mở (§2.0 cho phép), và
  // đếm theo số dòng THỰC SỰ render để không hứa "(20)" rồi mở ra rỗng.
  const cayLoc = useMemo<SoTayChuDe[]>(() => {
    const goc = cay?.cay ?? []
    if (!nhomLoc) return goc
    return goc.map((cd) => {
      const con = cd.con
        .map((cde) => ({ ...cde, dangs: cde.dangs.filter((d) => d.nhom === nhomLoc) }))
        .filter((cde) => cde.dangs.length > 0)
        .map((cde) => ({ ...cde, so_dang: cde.dangs.length }))
      return { ...cd, con, so_dang: con.reduce((s, c) => s + c.dangs.length, 0) }
    }).filter((cd) => cd.con.length > 0)
  }, [cay, nhomLoc])

  // Đang mở 1 dạng → màn đọc. Back về đúng chỗ cũ (duong/nhomLoc/q giữ nguyên trong state).
  if (mucMo.length) return <DocMuc key={mucMo[mucMo.length - 1].ma} r={mucMo[mucMo.length - 1]} api={api} onMo={moMuc}
    onBack={() => setMucMo((s) => s.slice(0, -1))} />
  if (maDangMo && mon) {
    return <DocDang t={t} maDang={maDangMo} mon={mon} nhanh={nhanh} api={api} onBack={() => setMaDangMo(null)} />
  }

  const dangSearch = ketQua !== null
  // Tầng đang đứng quyết định tiêu đề + nút back (drill-down, back lùi 1 tầng chứ không thoát).
  const { chuDe, chuyenDe } = duong
  const chuDeLoc = chuDe ? cayLoc.find((c) => c.ma === chuDe.ma) ?? null : null
  const chuyenDeLoc = chuyenDe && chuDeLoc ? chuDeLoc.con.find((c) => c.ma === chuyenDe.ma) ?? null : null

  const soKq = ketQua ? ketQua.ct.length + ketQua.lt.length : 0
  // Tab MỤC: chủ đề đang mở + lọc phân môn (Lý / Hóa / Sinh — chỉ khi môn có phân môn).
  const coMuc = (mucCay?.chu_de.length ?? 0) > 0
  const laMuc = che === 'muc' && coMuc
  const nhanhMuc = [...new Set((mucCay?.chu_de ?? []).map((c) => c.nhanh).filter((x): x is string => !!x))]
  const chuDeMucLoc = (mucCay?.chu_de ?? []).filter((c) => !mucNhanh || c.nhanh === mucNhanh)
  const chuDeMuc = mucChuDe ? mucCay?.chu_de.find((c) => c.ma === mucChuDe) ?? null : null
  const moMucMa = (ma: string) => {
    if (!api.muc) return
    api.muc(ma).then((r) => { if (r) moMuc(r) }).catch((e) => { ghiLoi('mở mục ' + ma, e); setLoiMuc(moTaLoi(e, 'Không mở được mục này.')) })
  }

  const title = dangSearch ? 'Kết quả tìm' : laMuc ? (chuDeMuc ? chuDeMuc.ten : 'Sổ tay kiến thức')
    : chuyenDeLoc ? chuyenDeLoc.ten : chuDeLoc ? chuDeLoc.ten : 'Sổ tay kiến thức'
  const sub = dangSearch ? (loiTim ? 'Lỗi — xem bên dưới' : `${soKq} kết quả`)
    : laMuc ? (chuDeMuc ? `${chuDeMuc.muc.length} mục${chuDeMuc.nhanh ? ` · ${chuDeMuc.nhanh}` : ''} · Khối ${mucCay?.khoi}` : 'Khái niệm, công thức, hiện tượng… theo chủ đề')
    : chuyenDeLoc ? `${chuyenDeLoc.dangs.length} dạng bài`
    : chuDeLoc ? `${chuDeLoc.con.length} chuyên đề`
    : 'Tra lý thuyết và bài mẫu theo dạng'
  const back = () => {
    if (dangSearch) { setQ(''); setKetQua(null); setLoiTim(null); return }
    if (laMuc) { if (mucChuDe) { setMucChuDe(null); return } onXong(); return }
    if (chuyenDe) { setDuong({ chuDe, chuyenDe: null }); return }
    if (chuDe) { setDuong({ chuDe: null, chuyenDe: null }); return }
    onXong()
  }

  return (
    <Kung t={t} title={title} sub={sub} onBack={back}>
      {/* Ô tìm — luôn hiện ở mọi tầng: em đang lần mò mà chợt nhớ ra tên thì gõ được ngay. */}
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-[15px]">🔍</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} inputMode="search"
          placeholder={coMuc ? 'Tìm khái niệm, công thức, dạng bài…' : 'Tìm công thức, dạng bài…'}
          className="w-full py-3 pl-10 pr-10 text-[14px] outline-none"
          style={{ ...THE_TRON, color: NAVY }} />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[15px]" style={{ color: MAU.muted }}>✕</button>
        )}
      </div>

      {/* TAB Sổ tay / Dạng bài — chỉ khi môn có mục sổ tay đã duyệt (dữ liệu quyết định, không if theo môn). */}
      {!dangSearch && coMuc && (
        <div className="mt-3 grid grid-cols-2 gap-1 p-1" style={{ ...THE_TRON, borderRadius: '999px' }}>
          {([['muc', 'Sổ tay'], ['dang', 'Dạng bài']] as const).map(([k, ten]) => (
            <button key={k} onClick={() => setChe(k)} className="rounded-full py-2 text-[13px] font-bold transition"
              style={che === k ? { background: MAU.acc, color: MAU.accInk } : { color: MAU.muted }}>{ten}</button>
          ))}
        </div>
      )}

      {/* Lọc của tab Sổ tay: phân môn + khối (chỉ khi đang ở danh sách chủ đề). */}
      {!dangSearch && laMuc && !chuDeMuc && (
        <>
          {nhanhMuc.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip t={t} ten="Tất cả" chon={mucNhanh === null} onClick={() => setMucNhanh(null)} />
              {nhanhMuc.map((n) => <Chip key={n} t={t} ten={n} chon={mucNhanh === n} onClick={() => setMucNhanh(n)} />)}
            </div>
          )}
          {(mucCay?.khoi_list.length ?? 0) > 1 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] font-bold" style={{ color: MAU.muted }}>Khối</span>
              {mucCay!.khoi_list.map((k) => <Chip key={k} t={t} ten={k} chon={mucCay!.khoi === k} onClick={() => setMucKhoi(k)} />)}
            </div>
          )}
        </>
      )}

      {/* Bộ lọc chỉ có nghĩa khi đang duyệt cây — lúc tìm thì ẩn đi cho gọn màn. */}
      {!dangSearch && !laMuc && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {SOTAY_NHANH.map((n) => (
              <Chip key={n.ten} t={t} ten={n.ten} chon={nhanh === n.id} onClick={() => { setNhanh(n.id); setNhomLoc(null) }} />
            ))}
          </div>
          {(cay?.khoi_list?.length ?? 0) > 1 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] font-bold" style={{ color: MAU.muted }}>Khối</span>
              {cay!.khoi_list.map((k) => (
                <Chip key={k} t={t} ten={k} chon={(khoi ?? cay!.khoi) === k} onClick={() => setKhoi(k)} />
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11.5px] font-bold" style={{ color: MAU.muted }}>Độ khó</span>
            <Chip t={t} ten="Tất cả" chon={nhomLoc === null} onClick={() => setNhomLoc(null)} />
            {(['co_ban', 'trung_binh', 'nang_cao'] as SoTayNhom[]).map((n) => (
              <Chip key={n} t={t} ten={NHOM_TEN[n]} chon={nhomLoc === n} onClick={() => setNhomLoc(n)} />
            ))}
          </div>
        </>
      )}

      {laMuc && loiMuc && <Trong t={t} icon="⚠️" title="Không tải được sổ tay" mo_ta={loiMuc} />}
      {!laMuc && loi && <Trong t={t} icon="⚠️" title="Không tải được sổ tay" mo_ta={loi} />}
      {!laMuc && !loi && cay === null && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}

      <div className="mt-4 flex flex-col gap-2.5">
        {/* ── Kết quả tìm ─────────────────────────────────────────────── */}
        {/* Lỗi TRƯỚC, rỗng SAU — không bao giờ báo "không tìm thấy" cho một lượt gọi đã hỏng. */}
        {dangSearch && loiTim && (
          <Trong t={t} icon="⚠️" title="Tìm kiếm đang lỗi" mo_ta={loiTim} />
        )}
        {dangSearch && !loiTim && soKq === 0 && (
          <Trong t={t} icon="🔎" title="Không tìm thấy công thức hay dạng nào" mo_ta="Thử gõ ngắn hơn hoặc gõ tên khác, hoặc bỏ tìm để lọc dần theo chủ đề nhé." />
        )}
        {/* Công thức TRƯỚC, lý thuyết dạng SAU (CEO 03/10) — thứ tự trong từng nhóm do DB xếp. */}
        {dangSearch && ketQua.ct.map((r) => (
          <Dong key={'ct-' + r.ma} t={t} ten={r.ten} phu={<NhanLoai loai={r.loai ?? 'ct'} />}
            duoi={`Khối ${r.khoi} · ${r.nhanh ? r.nhanh + ' · ' : ''}${r.ten_chu_de}`} onClick={() => moMuc(r)} />
        ))}
        {dangSearch && ketQua.lt.map((r) => (
          <Dong key={r.ma_dang} t={t} ten={r.ten_dang} phu={<><NhanLoai loai="ly_thuyet" /><NhomChip nhom={r.nhom} /></>}
            duoi={`Khối ${r.khoi} · ${r.ten_chu_de} › ${r.ten_chuyen_de}`}
            onClick={() => setMaDangMo(r.ma_dang)} />
        ))}

        {/* ── TAB SỔ TAY: mục của 1 chủ đề, nhóm theo LOẠI ─────────────── */}
        {!dangSearch && laMuc && chuDeMuc && MUC_LOAI_THU_TU.map((lo) => {
          const ds = chuDeMuc.muc.filter((m) => m.loai === lo)
          return ds.length > 0 && (
            <div key={lo} className="flex flex-col gap-2">
              <NhomHS>{MUC_LOAI[lo].nhom}</NhomHS>
              {ds.map((m) => <Dong key={m.ma} t={t} ten={m.ten} onClick={() => moMucMa(m.ma)} />)}
            </div>
          )
        })}
        {/* ── TAB SỔ TAY: chủ đề ─────────────────────────────────────── */}
        {!dangSearch && laMuc && !chuDeMuc && chuDeMucLoc.map((cd) => (
          <Dong key={cd.ma} t={t} ten={cd.ten} duoi={`${cd.nhanh ? cd.nhanh + ' · ' : ''}${cd.muc.length} mục`} onClick={() => setMucChuDe(cd.ma)} />
        ))}

        {/* ── Tầng 3: DẠNG ────────────────────────────────────────────── */}
        {!dangSearch && !laMuc && chuyenDeLoc && chuyenDeLoc.dangs.map((d) => (
          <Dong key={d.ma_dang} t={t} ten={d.ten_dang} phu={<NhomChip nhom={d.nhom} />} duoi={d.mo_ta_ngan}
            onClick={() => setMaDangMo(d.ma_dang)} />
        ))}

        {/* ── Tầng 2: CHUYÊN ĐỀ ───────────────────────────────────────── */}
        {!dangSearch && !laMuc && !chuyenDeLoc && chuDeLoc && chuDeLoc.con.map((cde) => (
          <Dong key={cde.ma} t={t} ten={cde.ten} duoi={`${cde.dangs.length} dạng bài`}
            onClick={() => setDuong({ chuDe: chuDeLoc, chuyenDe: cde })} />
        ))}

        {/* ── Tầng 1: CHỦ ĐỀ ──────────────────────────────────────────── */}
        {!dangSearch && !laMuc && !chuDeLoc && cayLoc.map((cd) => (
          <Dong key={cd.ma} t={t} ten={cd.ten} duoi={`${cd.con.length} chuyên đề · ${cd.so_dang} dạng`}
            onClick={() => setDuong({ chuDe: cd, chuyenDe: null })} />
        ))}

        {!dangSearch && !laMuc && cay !== null && !loi && cayLoc.length === 0 && (
          <Trong t={t} icon="📭" title={nhomLoc ? 'Không có dạng nào ở mức này' : 'Khối này chưa có nội dung'}
            mo_ta={nhomLoc ? 'Chọn lại "Tất cả" ở mục Độ khó để xem hết nhé.' : 'Thầy cô đang soạn thêm, em thử chọn khối khác xem sao.'} />
        )}
      </div>
    </Kung>
  )
}

// ── MÀN ĐỌC 1 DẠNG — lý thuyết + phương pháp + bài mẫu (gói chung trong `noi_dung`) ─────────
function DocDang({ t, maDang, mon, nhanh, api, onBack }: { t: Theme; maDang: string; mon: string; nhanh: SoTayNhanh; api: SoTayApi; onBack: () => void }) {
  const [d, setD] = useState<SoTayNoiDung | null | undefined>(undefined) // undefined = đang tải · null = không có
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    let huy = false
    setD(undefined); setLoi(null)
    api.dang(maDang, mon, nhanh)
      .then((r) => { if (!huy) { setLoi(null); setD(r) } })
      // `d === null` dùng cho CẢ "chưa có lý thuyết" lẫn "gọi hỏng" ⇒ phải có `loi` mới phân biệt
      // được; render đọc `loi` trước để không báo "chưa soạn" cho một lượt gọi đã lỗi.
      .catch((e) => { ghiLoi('mở dạng ' + maDang, e); if (!huy) { setD(null); setLoi(moTaLoi(e, 'Không mở được dạng này.')) } })
    return () => { huy = true }
  }, [maDang, mon, nhanh])

  return (
    <Kung t={t} decor={false} onBack={onBack}
      title={d ? d.ten_dang : d === undefined ? 'Đang mở…' : 'Chưa có nội dung'}
      sub={d ? `Khối ${d.khoi} · ${d.ten_chu_de} › ${d.ten_chuyen_de}` : undefined}>
      {d === undefined && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {d === null && (
        <Trong t={t} icon={loi ? '⚠️' : '📭'} title={loi ? 'Không mở được' : 'Dạng này chưa có lý thuyết'}
          mo_ta={loi ?? 'Thầy cô chưa soạn phần này. Em chọn dạng khác hoặc quay lại sau nhé.'} />
      )}
      {d && (
        <div className="mt-2 p-4" style={THE}>
          {d.nhom && <div className="mb-2"><NhomChip nhom={d.nhom} /></div>}
          {d.mo_ta_ngan && <p className="mb-3 text-[12.5px] italic leading-snug" style={{ color: MAU.muted }}>{d.mo_ta_ngan}</p>}
          {/* MathText = đúng trình render lý thuyết của màn Kho/trang in: LaTeX $…$ + ảnh ![](url).
              Dùng lại để HS thấy y hệt bản thầy cô soạn, không đẻ bộ render thứ hai. */}
          <div className="text-[14.5px] leading-[1.75]" style={{ color: NAVY }}>
            <MathText>{d.noi_dung}</MathText>
          </div>
        </div>
      )}
    </Kung>
  )
}

// ── MÀN ĐỌC 1 MỤC SỔ TAY — thẻ công thức Toán (nội dung + lưu ý + mẹo nhớ) hoặc mục KHTN (tóm tắt · công thức · ý chính · bảng ·
// kí hiệu · ví dụ từng bước · hay nhầm · liên quan). Dữ liệu = 1 hình từ DB (`_sotay_muc_json`); phần nào vắng thì không vẽ.
function KhoiDoc({ ten, children }: { ten?: string; children: ReactNode }) {
  return (
    <div className="mt-2.5 p-4" style={THE}>
      {ten && <p className="mb-2 text-[12px] font-black uppercase tracking-[0.06em]" style={{ color: MAU.acc }}>{ten}</p>}
      <div className="text-[14px] leading-[1.75]" style={{ color: NAVY }}>{children}</div>
    </div>
  )
}
function BangDoc({ hang, dauLaTieuDe = true }: { hang: string[][]; dauLaTieuDe?: boolean }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full border-collapse text-[13px] leading-snug">
        <tbody>
          {hang.map((h, i) => (
            <tr key={i} style={i === 0 && dauLaTieuDe ? { background: MAU.surface2 } : undefined}>
              {h.map((o, j) => (
                <td key={j} className={`px-2 py-1.5 align-top ${i === 0 && dauLaTieuDe ? 'font-bold' : ''}`} style={{ border: `1px solid ${MAU.line}` }}>
                  <MathText>{o}</MathText>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function DocMuc({ r, api, onMo, onBack }: { r: MucSoTay; api: SoTayApi; onMo: (r: MucSoTay) => void; onBack: () => void }) {
  const [loi, setLoi] = useState<string | null>(null)
  const loai = r.loai ?? 'ct'
  const moLq = (ma: string) => {
    if (!api.muc) return
    setLoi(null)
    api.muc(ma).then((x) => { if (x) onMo(x) }).catch((e) => { ghiLoi('mở mục ' + ma, e); setLoi(moTaLoi(e, 'Không mở được mục này.')) })
  }
  return (
    <Kung decor={false} onBack={onBack} title={r.ten}
      sub={[MUC_LOAI[loai].ten, `Khối ${r.khoi}`, r.nhanh, r.ten_chu_de].filter(Boolean).join(' · ')}>
      <KhoiDoc>
        <div className="text-[15px] leading-[1.8]"><MathText>{r.noi_dung}</MathText></div>
        {r.cong_thuc && (
          <div className="mt-3 px-3 py-2.5 text-center text-[17px] font-bold" style={{ ...HEAD, background: MAU.surface2, borderRadius: '12px', color: NAVY }}>
            <MathText>{r.cong_thuc}</MathText>
          </div>
        )}
        {r.hinh_url && <img src={r.hinh_url} alt="" className="mx-auto mt-3 max-h-64 w-auto max-w-full rounded-lg" />}
      </KhoiDoc>
      {r.bien?.length ? (
        <KhoiDoc ten="Kí hiệu">
          <BangDoc hang={r.bien} dauLaTieuDe={false} />
        </KhoiDoc>
      ) : null}
      {r.y?.length ? (
        <KhoiDoc ten="Ý chính">
          <ul className="flex flex-col gap-1.5 pl-4" style={{ listStyleType: 'disc' }}>
            {r.y.map((x, i) => <li key={i}><MathText>{x}</MathText></li>)}
          </ul>
        </KhoiDoc>
      ) : null}
      {r.bang?.length ? <KhoiDoc ten={loai === 'ss' ? 'So sánh' : 'Bảng'}><BangDoc hang={r.bang} /></KhoiDoc> : null}
      {r.vd && (
        <KhoiDoc ten="Ví dụ">
          <p className="font-semibold"><MathText>{r.vd.de}</MathText></p>
          {r.vd.buoc?.length ? (
            <ol className="mt-2 flex flex-col gap-1 pl-5" style={{ listStyleType: 'decimal', color: MAU.muted }}>
              {r.vd.buoc.map((b, i) => <li key={i}><span style={{ color: NAVY }}><MathText>{b}</MathText></span></li>)}
            </ol>
          ) : null}
          {r.vd.kq && (
            <p className="mt-2 font-bold"><span style={{ color: MAU.dung }}>Kết quả: </span><MathText>{r.vd.kq}</MathText></p>
          )}
        </KhoiDoc>
      )}
      {r.nham?.length ? (
        <KhoiDoc ten="Hay nhầm">
          <ul className="flex flex-col gap-1.5">
            {r.nham.map((x, i) => <li key={i} className="flex gap-2"><span style={{ color: MAU.canhBao }} aria-hidden>⚠</span><span><MathText>{x}</MathText></span></li>)}
          </ul>
        </KhoiDoc>
      ) : null}
      {r.luu_y && (
        <div className="mt-2.5 p-3.5 text-[13.5px] leading-relaxed" style={{ ...THE, color: NAVY }}>
          <span className="font-black" style={{ color: MAU.canhBao }}>Lưu ý: </span><MathText>{r.luu_y}</MathText>
        </div>
      )}
      {r.cau_nho && (
        <div className="mt-2.5 p-3.5 text-[13.5px] leading-relaxed" style={{ ...THE, color: NAVY }}>
          <span className="font-black" style={{ color: MAU.acc }}>Mẹo nhớ: </span><MathText>{r.cau_nho}</MathText>
        </div>
      )}
      {r.lq?.length ? (
        <div className="mt-4 flex flex-col gap-2">
          <NhomHS>Liên quan</NhomHS>
          {loi && <Trong icon="⚠️" title="Không mở được" mo_ta={loi} />}
          {r.lq.map((x) => <Dong key={x.ma} ten={x.ten} phu={<NhanLoai loai={x.loai} />} onClick={() => moLq(x.ma)} />)}
        </div>
      ) : null}
    </Kung>
  )
}
