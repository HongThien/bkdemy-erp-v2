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
  soTayCay, soTayTim, soTayDang, SOTAY_NHANH, NHOM_TEN, NHOM_MAU,
  type SoTayCay, type SoTayChuDe, type SoTayChuyenDe, type SoTayNhanh, type SoTayNhom,
  type SoTayTimRow, type SoTayNoiDung,
} from '../../lib/sotay'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Không biết thì tra\nbiết rồi thì ôn!', quoteColor: '#4A5BC4', underline: false },
  nu: { bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Tra một lần\nnhớ thật lâu ♡', quoteColor: '#E84A8F', underline: true },
}
type Theme = typeof THEME.nam

// Shell RIÊNG (không tái dùng `Kung` của ThongTinHocTap) vì cần cờ `decor`: màn ĐỌC lý thuyết
// phải TẮT hình trang trí — nó `fixed bottom-0` chiếm 46% chiều cao, bài dài cuộn qua là chữ
// chui xuống dưới ảnh. Màn danh sách thì bật như các màn HS khác cho đồng bộ.
function Kung({ t, title, sub, onBack, decor = true, desktop, children }: {
  t: Theme; title: string; sub?: string; onBack: () => void; decor?: boolean; desktop?: boolean; children: ReactNode
}) {
  return (
    <div className={`font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] ${desktop ? 'md:max-w-[820px] lg:max-w-[1180px]' : ''}`}
      style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      <img src={t.bg} alt="" className={`pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover ${desktop ? 'md:max-w-[820px] lg:max-w-[1180px]' : ''}`} />
      {decor && (
        <div className={`pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end ${desktop ? 'md:max-w-[820px] lg:max-w-[1180px]' : ''}`}>
          <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
          <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
        </div>
      )}
      <div className={`relative px-4 pt-[calc(10px+env(safe-area-inset-top))] ${decor ? 'pb-[46vh]' : 'pb-16'}`}>
        <div className="relative flex items-start gap-3">
          <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="relative inline-block text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              {title}
              {t.underline && <span className="absolute -bottom-1 left-[35%] h-[3px] w-[55%] rounded-full" style={{ background: t.primary, opacity: .8 }} />}
            </h1>
            {sub && <p className="mt-1.5 text-[12.5px]" style={{ color: t.sec }}>{sub}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function Chip({ chon, ten, onClick, t }: { chon: boolean; ten: string; onClick: () => void; t: Theme }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[12.5px] font-bold transition active:scale-95 ${chon ? 'text-white' : ''}`}
      style={chon ? { background: t.primary } : { background: '#ffffffcc', color: t.sec }}>
      {ten}
    </button>
  )
}

function NhomChip({ nhom }: { nhom: SoTayNhom | null }) {
  if (!nhom) return null
  const m = NHOM_MAU[nhom]
  return <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: m.nen, color: m.chu }}>{NHOM_TEN[nhom]}</span>
}

// Dòng danh sách dùng chung cho cả 3 tầng + kết quả tìm.
function Dong({ t, ten, phu, duoi, onClick }: { t: Theme; ten: string; phu?: ReactNode; duoi?: string | null; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-[20px] p-3.5 text-left transition active:scale-[0.98]"
      style={{ background: t.cardTint, boxShadow: t.shadow }}>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="min-w-0 text-[14.5px] font-extrabold leading-snug" style={{ color: NAVY }}>{ten}</span>
          {phu}
        </span>
        {duoi && <span className="mt-1 block truncate text-[11.5px]" style={{ color: t.sec }}>{duoi}</span>}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: `${t.primary}18` }}>
        <svg viewBox="0 0 48 48" className="h-3.5 w-3.5" fill="none" aria-hidden><path d="M18 12l12 12-12 12" stroke={t.primary} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  )
}

function Trong({ t, icon, title, mo_ta }: { t: Theme; icon: string; title: string; mo_ta: string }) {
  return (
    <div className="mt-6 rounded-[24px] p-6 text-center" style={{ background: t.cardTint, boxShadow: t.shadow }}>
      <div className="text-[34px]">{icon}</div>
      <p className="mt-2 text-[15px] font-extrabold" style={{ color: NAVY }}>{title}</p>
      <p className="mt-1 text-[12.5px] leading-snug" style={{ color: t.sec }}>{mo_ta}</p>
    </div>
  )
}

// Nguồn dữ liệu tách ra prop để `hs.html?demo=sotay` (DEV, AppHS.tsx) xem được màn bằng data giả
// — Claude không có mã+PIN của HS thật nên không tự mở app thật để soi layout được. Mặc định là
// 3 RPC thật; đường chạy production KHÔNG có thêm nhánh if nào.
export type SoTayApi = { cay: typeof soTayCay; tim: typeof soTayTim; dang: typeof soTayDang }
const API_THAT: SoTayApi = { cay: soTayCay, tim: soTayTim, dang: soTayDang }

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

export default function SoTayHS({ gioiTinh, onXong, api = API_THAT, desktop }: {
  gioiTinh: 'nam' | 'nu' | null; onXong: () => void; api?: SoTayApi; desktop?: boolean
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
  const [ketQua, setKetQua] = useState<SoTayTimRow[] | null>(null)
  const [loiTim, setLoiTim] = useState<string | null>(null) // tách khỏi `ketQua` — xem effect tìm

  useEffect(() => { monCuaHS().then((m) => setMon(m ?? 'Toán')).catch(() => setMon('Toán')) }, [])

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
      api.tim(tu, mon, nhanh, khoi ?? cay?.khoi ?? null)
        .then((rs) => { if (lan !== lanTim.current) return; setLoiTim(null); setKetQua(rs) })
        .catch((e) => {
          ghiLoi('tìm', e)
          if (lan !== lanTim.current) return
          setLoiTim(moTaLoi(e, 'Không tìm được, thử lại giúp em nhé.'))
          setKetQua([])
        })
    }, 250)
    return () => clearTimeout(id)
  }, [q, mon, nhanh, khoi, cay?.khoi])

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
  if (maDangMo && mon) {
    return <DocDang t={t} maDang={maDangMo} mon={mon} nhanh={nhanh} api={api} desktop={desktop} onBack={() => setMaDangMo(null)} />
  }

  const dangSearch = ketQua !== null
  // Tầng đang đứng quyết định tiêu đề + nút back (drill-down, back lùi 1 tầng chứ không thoát).
  const { chuDe, chuyenDe } = duong
  const chuDeLoc = chuDe ? cayLoc.find((c) => c.ma === chuDe.ma) ?? null : null
  const chuyenDeLoc = chuyenDe && chuDeLoc ? chuDeLoc.con.find((c) => c.ma === chuyenDe.ma) ?? null : null

  const title = dangSearch ? 'Tìm dạng bài' : chuyenDeLoc ? chuyenDeLoc.ten : chuDeLoc ? chuDeLoc.ten : 'Sổ tay kiến thức'
  const sub = dangSearch ? (loiTim ? 'Lỗi — xem bên dưới' : `${ketQua.length} kết quả`)
    : chuyenDeLoc ? `${chuyenDeLoc.dangs.length} dạng bài`
    : chuDeLoc ? `${chuDeLoc.con.length} chuyên đề`
    : 'Tra lý thuyết và bài mẫu theo dạng'
  const back = () => {
    if (dangSearch) { setQ(''); setKetQua(null); setLoiTim(null); return }
    if (chuyenDe) { setDuong({ chuDe, chuyenDe: null }); return }
    if (chuDe) { setDuong({ chuDe: null, chuyenDe: null }); return }
    onXong()
  }

  return (
    <Kung t={t} title={title} sub={sub} onBack={back} desktop={desktop}>
      {/* Ô tìm — luôn hiện ở mọi tầng: em đang lần mò mà chợt nhớ ra tên thì gõ được ngay. */}
      <div className="relative mt-4">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px]">🔍</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} inputMode="search"
          placeholder="Tìm tên dạng bài, chuyên đề…"
          className="w-full rounded-[18px] border-0 py-3 pl-10 pr-10 text-[14px] outline-none"
          style={{ background: '#ffffffe6', color: NAVY, boxShadow: t.shadow }} />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[15px]" style={{ color: t.sec }}>✕</button>
        )}
      </div>

      {/* Bộ lọc chỉ có nghĩa khi đang duyệt cây — lúc tìm thì ẩn đi cho gọn màn. */}
      {!dangSearch && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {SOTAY_NHANH.map((n) => (
              <Chip key={n.ten} t={t} ten={n.ten} chon={nhanh === n.id} onClick={() => { setNhanh(n.id); setNhomLoc(null) }} />
            ))}
          </div>
          {(cay?.khoi_list?.length ?? 0) > 1 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] font-bold" style={{ color: t.sec }}>Khối</span>
              {cay!.khoi_list.map((k) => (
                <Chip key={k} t={t} ten={k} chon={(khoi ?? cay!.khoi) === k} onClick={() => setKhoi(k)} />
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11.5px] font-bold" style={{ color: t.sec }}>Độ khó</span>
            <Chip t={t} ten="Tất cả" chon={nhomLoc === null} onClick={() => setNhomLoc(null)} />
            {(['co_ban', 'trung_binh', 'nang_cao'] as SoTayNhom[]).map((n) => (
              <Chip key={n} t={t} ten={NHOM_TEN[n]} chon={nhomLoc === n} onClick={() => setNhomLoc(n)} />
            ))}
          </div>
        </>
      )}

      {loi && <Trong t={t} icon="⚠️" title="Không tải được sổ tay" mo_ta={loi} />}
      {!loi && cay === null && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}

      <div className="mt-4 flex flex-col gap-2.5">
        {/* ── Kết quả tìm ─────────────────────────────────────────────── */}
        {/* Lỗi TRƯỚC, rỗng SAU — không bao giờ báo "không tìm thấy" cho một lượt gọi đã hỏng. */}
        {dangSearch && loiTim && (
          <Trong t={t} icon="⚠️" title="Tìm kiếm đang lỗi" mo_ta={loiTim} />
        )}
        {dangSearch && !loiTim && ketQua.length === 0 && (
          <Trong t={t} icon="🔎" title="Không tìm thấy dạng nào" mo_ta="Thử gõ ngắn hơn, hoặc bỏ tìm để lọc dần theo chủ đề nhé." />
        )}
        {dangSearch && ketQua.map((r) => (
          <Dong key={r.ma_dang} t={t} ten={r.ten_dang} phu={<NhomChip nhom={r.nhom} />}
            duoi={`Khối ${r.khoi} · ${r.ten_chu_de} › ${r.ten_chuyen_de}`}
            onClick={() => setMaDangMo(r.ma_dang)} />
        ))}

        {/* ── Tầng 3: DẠNG ────────────────────────────────────────────── */}
        {!dangSearch && chuyenDeLoc && chuyenDeLoc.dangs.map((d) => (
          <Dong key={d.ma_dang} t={t} ten={d.ten_dang} phu={<NhomChip nhom={d.nhom} />} duoi={d.mo_ta_ngan}
            onClick={() => setMaDangMo(d.ma_dang)} />
        ))}

        {/* ── Tầng 2: CHUYÊN ĐỀ ───────────────────────────────────────── */}
        {!dangSearch && !chuyenDeLoc && chuDeLoc && chuDeLoc.con.map((cde) => (
          <Dong key={cde.ma} t={t} ten={cde.ten} duoi={`${cde.dangs.length} dạng bài`}
            onClick={() => setDuong({ chuDe: chuDeLoc, chuyenDe: cde })} />
        ))}

        {/* ── Tầng 1: CHỦ ĐỀ ──────────────────────────────────────────── */}
        {!dangSearch && !chuDeLoc && cayLoc.map((cd) => (
          <Dong key={cd.ma} t={t} ten={cd.ten} duoi={`${cd.con.length} chuyên đề · ${cd.so_dang} dạng`}
            onClick={() => setDuong({ chuDe: cd, chuyenDe: null })} />
        ))}

        {!dangSearch && cay !== null && !loi && cayLoc.length === 0 && (
          <Trong t={t} icon="📭" title={nhomLoc ? 'Không có dạng nào ở mức này' : 'Khối này chưa có nội dung'}
            mo_ta={nhomLoc ? 'Chọn lại "Tất cả" ở mục Độ khó để xem hết nhé.' : 'Thầy cô đang soạn thêm, em thử chọn khối khác xem sao.'} />
        )}
      </div>
    </Kung>
  )
}

// ── MÀN ĐỌC 1 DẠNG — lý thuyết + phương pháp + bài mẫu (gói chung trong `noi_dung`) ─────────
// Tắt decor: bài dài, hình trang trí fixed dưới đáy sẽ đè lên chữ khi cuộn.
function DocDang({ t, maDang, mon, nhanh, api, desktop, onBack }: { t: Theme; maDang: string; mon: string; nhanh: SoTayNhanh; api: SoTayApi; desktop?: boolean; onBack: () => void }) {
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
    <Kung t={t} decor={false} onBack={onBack} desktop={desktop}
      title={d ? d.ten_dang : d === undefined ? 'Đang mở…' : 'Chưa có nội dung'}
      sub={d ? `Khối ${d.khoi} · ${d.ten_chu_de} › ${d.ten_chuyen_de}` : undefined}>
      {d === undefined && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {d === null && (
        <Trong t={t} icon={loi ? '⚠️' : '📭'} title={loi ? 'Không mở được' : 'Dạng này chưa có lý thuyết'}
          mo_ta={loi ?? 'Thầy cô chưa soạn phần này. Em chọn dạng khác hoặc quay lại sau nhé.'} />
      )}
      {d && (
        <div className="mt-4 rounded-[24px] p-4" style={{ background: '#ffffffee', boxShadow: t.shadow }}>
          {d.nhom && <div className="mb-2"><NhomChip nhom={d.nhom} /></div>}
          {d.mo_ta_ngan && <p className="mb-3 text-[12.5px] italic leading-snug" style={{ color: t.sec }}>{d.mo_ta_ngan}</p>}
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
