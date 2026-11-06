// ============================================================================
// NutGopYNoi — NÚT GÓP Ý / BÁO LỖI NỔI Ở MỌI MÀN app HS (Thùy 10/10: "1 biểu tượng hiện ở góc nào đó, ở mọi màn").
// · Chấm tròn nhỏ (bong bóng chat + dấu !) ở góc dưới phải; KÉO được sang cạnh/độ cao khác nếu che nút của màn (vị trí nhớ trong máy).
// · Bấm ⇒ tấm nhập nhanh NGAY TẠI CHỖ (không rời màn đang làm — em đang làm bài không bị mất): Báo lỗi / Góp ý tưởng · 10–1.500 chữ · ảnh tuỳ chọn.
// · Báo kèm màn đang mở + môn + cỡ màn (ngữ cảnh) để thầy cô tái hiện lỗi. Luật (độ dài, 5 lần/ngày) ở DB — fn_hs_gui_gop_y (lib/gopy_hs.ts).
// · Muốn xem thầy cô trả lời ⇒ "Xem góp ý của em" mở màn Góp ý đầy đủ (HocSinhApp nghe sự kiện). Màn Góp ý + Hướng dẫn tương tác thì ẩn nút.
// · MÀN CHÍNH (Thùy 03/11: HS không nhận ra chỗ góp ý): thay chấm nhỏ bằng LINH VẬT to ở góc dưới trái + bong bóng "Góp ý ở đây nhé!"
//   — bấm mở đúng tấm nhập ở trên. Hình dùng chung mọi style (public/bk-ui/hs/gop-y/), bong bóng lấy màu skin.
//   Em tự kéo đi / thu nhỏ / ẩn được (Thùy 06/11: robot vướng các ô) — xem LinhVatGopY.
// Màu/khung CHỈ từ skin (KhungHS). Gốc FORMAL: chữ trung tính.
// ============================================================================
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HEAD, MAU, NutHS, THE_TRON, useMonHS } from '../skin/KhungHS'
import { GOP_Y_TOI_DA_MOI_NGAY, guiGopY, type LoaiGopY } from '../../../lib/gopy_hs'
import { EVT_MAN, EVT_MO_GOP_Y, layMan } from './manHienTai'

const TOI_THIEU = 10, TOI_DA = 1500
const LOAI: { id: LoaiGopY; ten: string; goiY: string }[] = [
  { id: 'bug', ten: 'Báo lỗi', goiY: 'Em đang làm gì thì gặp lỗi? Màn hình hiện ra sao?' },
  { id: 'yeu_cau', ten: 'Góp ý tưởng', goiY: 'Em muốn app có thêm gì, hoặc sửa chỗ nào cho dễ dùng hơn?' },
]
// Màn không cần nút nổi: chính màn Góp ý; tutorial (đã đủ lớp phủ)
const AN_O = new Set(['gop_y', 'tutorial'])
const KHOA_VT = 'hs_gopy_vt'
type ViTri = { ben: 'l' | 'r'; y: number | null }   // y = tỉ lệ chiều cao màn (null = sát đáy mặc định)

function docVt(): ViTri {
  try { const v = JSON.parse(localStorage.getItem(KHOA_VT) ?? 'null') as ViTri | null; if (v && (v.ben === 'l' || v.ben === 'r')) return { ben: v.ben, y: typeof v.y === 'number' ? Math.min(0.94, Math.max(0.06, v.y)) : null } } catch { /* máy chặn lưu */ }
  return { ben: 'r', y: null }
}

function Tam({ man, onDong, loaiDau = 'bug' }: { man: string; onDong: () => void; loaiDau?: LoaiGopY }) {
  const mon = useMonHS()
  const [loai, setLoai] = useState<LoaiGopY>(loaiDau)
  const [moTa, setMoTa] = useState('')
  const [anh, setAnh] = useState<Blob | null>(null)
  const [xemAnh, setXemAnh] = useState<string | null>(null)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [xong, setXong] = useState<string | null>(null)
  const tep = useRef<HTMLInputElement>(null)
  useEffect(() => () => { if (xemAnh) URL.revokeObjectURL(xemAnh) }, [xemAnh])
  const datAnh = (b: Blob | null) => { setAnh(b); setXemAnh(b ? URL.createObjectURL(b) : null) }
  const dai = moTa.trim().length
  const l = LOAI.find((x) => x.id === loai)!

  const gui = async () => {
    if (dang || dai < TOI_THIEU || dai > TOI_DA) return
    setDang(true); setLoi(null)
    try {
      const r = await guiGopY({
        loai, moTa: moTa.trim(), anh, route: man,
        context: { man, mon, man_rong: window.innerWidth, man_cao: window.innerHeight, doc: window.matchMedia('(orientation: portrait)').matches, ua: navigator.userAgent, nguon: 'nut_noi' },
      })
      setMoTa(''); datAnh(null)
      setXong(`Đã gửi! Thầy cô sẽ xem và trả lời. Hôm nay em còn gửi được ${r.con_lai_hom_nay} lần.`)
    } catch (e) { setLoi((e as Error).message || 'Chưa gửi được, em thử lại nhé.') } finally { setDang(false) }
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Góp ý và báo lỗi">
      <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--sk-bg) 70%, transparent)' }} onClick={onDong} />
      <div className="relative flex max-h-[92dvh] w-full max-w-[520px] flex-col gap-3 overflow-y-auto p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        style={{ ...THE_TRON, background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderRadius: 'var(--sk-radius)' }}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[20px] font-bold" style={HEAD}>Góp ý & báo lỗi</p>
          <button onClick={onDong} aria-label="Đóng" className="flex h-10 w-10 items-center justify-center rounded-full text-[18px]" style={{ background: MAU.surface2, color: MAU.muted }}>✕</button>
        </div>
        {xong ? (
          <>
            <p className="text-[16px] font-bold leading-snug" style={{ color: MAU.dung }}>{xong}</p>
            <div className="flex flex-wrap gap-2">
              <NutHS onClick={() => { setXong(null) }}>Gửi thêm</NutHS>
              <NutHS phu onClick={() => { onDong(); window.dispatchEvent(new CustomEvent(EVT_MO_GOP_Y)) }}>Xem góp ý của em</NutHS>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2" role="tablist">
              {LOAI.map((x) => (
                <button key={x.id} role="tab" aria-selected={loai === x.id} onClick={() => setLoai(x.id)} className="flex-1 py-2 text-[15.5px] font-bold"
                  style={loai === x.id ? { background: MAU.acc, color: MAU.accInk, borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)' }
                    : { ...THE_TRON, borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)' }}>{x.ten}</button>
              ))}
            </div>
            <textarea value={moTa} onChange={(e) => setMoTa(e.target.value.slice(0, TOI_DA))} rows={4} placeholder={l.goiY}
              onPaste={(e) => { const f = [...e.clipboardData.items].find((i) => i.type.startsWith('image/'))?.getAsFile(); if (f) { e.preventDefault(); datAnh(f) } }}
              className="w-full resize-y p-3 text-[16px] leading-relaxed outline-none"
              style={{ background: MAU.surface2, color: MAU.ink, border: `1px solid ${MAU.line}`, borderRadius: 'var(--sk-radius)' }} />
            <div className="flex items-center justify-between gap-2 text-[13px]" style={{ color: dai > 0 && dai < TOI_THIEU ? MAU.canhBao : MAU.muted }}>
              <span>{dai > 0 && dai < TOI_THIEU ? `Viết thêm ${TOI_THIEU - dai} chữ nữa nhé` : `Tối đa ${GOP_Y_TOI_DA_MOI_NGAY} lần mỗi ngày`}</span>
              <span>{dai}/{TOI_DA}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input ref={tep} type="file" accept="image/*" className="hidden" onChange={(e) => { datAnh(e.target.files?.[0] ?? null); e.target.value = '' }} />
              {xemAnh
                ? <span className="flex items-center gap-2">
                    <img src={xemAnh} alt="Ảnh đính kèm" className="h-14 w-14 object-cover" style={{ borderRadius: 'var(--sk-radius)', border: `1px solid ${MAU.line}` }} />
                    <button onClick={() => datAnh(null)} className="text-[14.5px] font-bold" style={{ color: MAU.muted }}>Bỏ ảnh</button>
                  </span>
                : <NutHS phu onClick={() => tep.current?.click()} className="!h-9 !px-3 !text-[14.5px]">📎 Đính kèm ảnh</NutHS>}
            </div>
            {loi && <p className="text-[14.5px]" style={{ color: MAU.sai }}>{loi}</p>}
            <NutHS onClick={gui} tat={dang || dai < TOI_THIEU}>{dang ? 'Đang gửi…' : `Gửi ${l.ten.toLowerCase()}`}</NutHS>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function NutGopYNoi() {
  const [man, setMan] = useState(layMan())
  const [mo, setMo] = useState(false)
  const [vt, setVt] = useState<ViTri>(docVt)
  const [keo, setKeo] = useState<{ x: number; y: number } | null>(null)   // toạ độ tâm khi đang kéo
  const goc = useRef<{ x: number; y: number; da: boolean } | null>(null)

  useEffect(() => {
    const f = (e: Event) => setMan((e as CustomEvent<string>).detail)
    window.addEventListener(EVT_MAN, f)
    return () => window.removeEventListener(EVT_MAN, f)
  }, [])

  const bam = useCallback((e: React.PointerEvent) => {
    goc.current = { x: e.clientX, y: e.clientY, da: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])
  const di = useCallback((e: React.PointerEvent) => {
    const g = goc.current; if (!g) return
    if (!g.da && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 8) return
    g.da = true
    setKeo({ x: e.clientX, y: e.clientY })
  }, [])
  const tha = useCallback((e: React.PointerEvent) => {
    const g = goc.current; goc.current = null
    if (!g) return
    if (g.da) {
      const moi: ViTri = { ben: e.clientX < window.innerWidth / 2 ? 'l' : 'r', y: Math.min(0.94, Math.max(0.06, e.clientY / window.innerHeight)) }
      setVt(moi); setKeo(null)
      try { localStorage.setItem(KHOA_VT, JSON.stringify(moi)) } catch { /* không lưu được cũng không sao */ }
    } else setMo(true)
  }, [])

  if (AN_O.has(man)) return null
  if (man === 'man_chinh') return (
    <>
      <LinhVatGopY onMo={() => setMo(true)} />
      {mo && <Tam man={man} loaiDau="yeu_cau" onDong={() => setMo(false)} />}
    </>
  )
  const pos: React.CSSProperties = keo
    ? { left: keo.x - 22, top: keo.y - 22 }
    : { [vt.ben === 'l' ? 'left' : 'right']: 10, ...(vt.y === null ? { bottom: 'calc(14px + env(safe-area-inset-bottom))' } : { top: `calc(${vt.y * 100}% - 22px)` }) }
  return (
    <>
      <button onPointerDown={bam} onPointerMove={di} onPointerUp={tha} onPointerCancel={() => { goc.current = null; setKeo(null) }}
        aria-label="Góp ý hoặc báo lỗi" title="Góp ý / báo lỗi (kéo để dời)"
        className="fixed z-50 flex h-11 w-11 touch-none select-none items-center justify-center rounded-full active:scale-95"
        style={{ ...pos, background: MAU.surface, color: MAU.acc, border: `1.5px solid ${MAU.acc}`, boxShadow: '0 4px 14px rgba(0,0,0,.35)', opacity: keo ? 0.95 : 0.82 }}>
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z" /><path d="M12 8.5v4" /><circle cx="12" cy="15.5" r=".6" fill="currentColor" />
        </svg>
      </button>
      {mo && <Tam man={man} onDong={() => setMo(false)} />}
    </>
  )
}

// Linh vật góp ý ở màn chính: nổi nhẹ lên xuống (chỉ transform, tắt khi máy bật giảm chuyển động — STYLE-HS §2.7).
// Thùy 06/11 ("đang vướng vào các ô của học sinh"): em tự chỉnh — KÉO đi chỗ khác · nút ‒/+ thu nhỏ (bỏ bong bóng) / phóng to ·
// nút ✕ ẩn ⇒ chỉ còn mép nhỏ ở cạnh màn, chạm mép là hiện lại. Cỡ + vị trí nhớ trong máy (tiện ích riêng từng máy, không cần DB).
const ANH_LINH_VAT = '/bk-ui/hs/gop-y/linh_vat_gop_y.png'
const KHOA_LV = 'hs_gopy_linh_vat'
type CoLV = 'to' | 'nho' | 'an'
type TrangLV = { co: CoLV; coTruoc: 'to' | 'nho'; x: number | null; y: number | null }   // x,y = góc trái-trên theo tỉ lệ màn (null = góc dưới trái mặc định)
const kep = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const CHUA_NUT = 30   // 2 nút ‒/✕ nằm ngoài khung, bên phải robot ⇒ chừa chỗ để không trôi khỏi màn

function docLV(): TrangLV {
  try {
    const v = JSON.parse(localStorage.getItem(KHOA_LV) ?? 'null') as Partial<TrangLV> | null
    if (v && (v.co === 'to' || v.co === 'nho' || v.co === 'an')) {
      return { co: v.co, coTruoc: v.coTruoc === 'to' ? 'to' : 'nho', x: typeof v.x === 'number' ? kep(v.x, 0, 1) : null, y: typeof v.y === 'number' ? kep(v.y, 0, 1) : null }
    }
  } catch { /* máy chặn lưu */ }
  return { co: 'to', coTruoc: 'to', x: null, y: null }
}

function LinhVatGopY({ onMo }: { onMo: () => void }) {
  const [tt, setTt] = useState<TrangLV>(docLV)
  const [keo, setKeo] = useState<{ x: number; y: number } | null>(null)   // góc trái-trên (px) khi đang kéo
  const [, setCoMan] = useState(0)
  const khung = useRef<HTMLDivElement>(null)
  const goc = useRef<{ px: number; py: number; dx: number; dy: number; da: boolean } | null>(null)

  useEffect(() => {
    const f = () => setCoMan((n) => n + 1)   // đổi cỡ/xoay màn ⇒ kẹp lại vị trí vào trong màn
    window.addEventListener('resize', f)
    f()   // lần đầu: đo khung xong mới kẹp vị trí đã lưu
    return () => window.removeEventListener('resize', f)
  }, [])

  const luu = (moi: TrangLV) => {
    setTt(moi)
    try { localStorage.setItem(KHOA_LV, JSON.stringify(moi)) } catch { /* không lưu được cũng không sao */ }
  }
  const doiCo = (co: CoLV) => luu({ ...tt, co, coTruoc: co === 'an' ? (tt.co === 'an' ? tt.coTruoc : tt.co) : co })

  const bam = (e: React.PointerEvent) => {
    const r = khung.current?.getBoundingClientRect(); if (!r) return
    goc.current = { px: e.clientX, py: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, da: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const di = (e: React.PointerEvent) => {
    const g = goc.current; if (!g) return
    if (!g.da && Math.hypot(e.clientX - g.px, e.clientY - g.py) < 8) return
    g.da = true
    setKeo({ x: e.clientX - g.dx, y: e.clientY - g.dy })
  }
  const tha = (e: React.PointerEvent) => {
    const g = goc.current; goc.current = null
    if (!g) return
    if (!g.da) { onMo(); return }
    const r = khung.current?.getBoundingClientRect()
    const W = window.innerWidth, H = window.innerHeight
    const x = kep(e.clientX - g.dx, 0, W - (r?.width ?? 0) - CHUA_NUT), y = kep(e.clientY - g.dy, 0, H - (r?.height ?? 0))
    setKeo(null)
    luu({ ...tt, x: x / W, y: y / H })
  }
  const huy = () => { goc.current = null; setKeo(null) }

  // Đang ẩn: mép nhỏ ở cạnh gần nhất, cùng độ cao — chạm là hiện lại đúng cỡ trước đó.
  if (tt.co === 'an') {
    const ben = tt.x !== null && tt.x > 0.5 ? 'right' : 'left'
    const viTriDoc: React.CSSProperties = tt.y === null ? { bottom: 'calc(10px + env(safe-area-inset-bottom))' } : { top: `${kep(tt.y * 100, 2, 90)}%` }
    return (
      <button onClick={() => doiCo(tt.coTruoc)} aria-label="Hiện lại bạn robot góp ý" title="Hiện lại bạn robot góp ý"
        className="fixed z-50 flex h-11 w-7 items-center justify-center active:scale-95"
        style={{ [ben]: 0, ...viTriDoc, background: MAU.surface, border: `1.5px solid ${MAU.acc}`, [ben === 'left' ? 'borderLeft' : 'borderRight']: 'none',
          borderRadius: ben === 'left' ? '0 12px 12px 0' : '12px 0 0 12px', boxShadow: '0 3px 10px rgba(0,0,0,.3)', opacity: 0.85 }}>
        <img src={ANH_LINH_VAT} alt="" draggable={false} className="h-6 w-auto" />
      </button>
    )
  }

  const to = tt.co === 'to'
  const r = khung.current?.getBoundingClientRect()
  const W = window.innerWidth, H = window.innerHeight
  const pos: React.CSSProperties = keo
    ? { left: keo.x, top: keo.y }
    : tt.x === null || tt.y === null
      ? { left: 'calc(6px + env(safe-area-inset-left))', bottom: 'calc(6px + env(safe-area-inset-bottom))' }
      : { left: kep(tt.x * W, 0, W - (r?.width ?? 0) - CHUA_NUT), top: kep(tt.y * H, 0, H - (r?.height ?? 0)) }
  const nutNho = 'flex h-7 w-7 items-center justify-center rounded-full text-[15px] font-black leading-none active:scale-90'
  const nutNhoSt: React.CSSProperties = { background: MAU.surface, color: MAU.ink, border: `1.5px solid ${MAU.line}`, boxShadow: '0 2px 6px rgba(0,0,0,.3)' }
  const chan = (e: React.PointerEvent) => e.stopPropagation()

  return (
    <div ref={khung} className="fixed z-50 flex select-none flex-col items-center" style={pos}>
      <style>{`@keyframes gopy-noi{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .gopy-noi{animation:gopy-noi 2.6s ease-in-out infinite;will-change:transform}
        @media (prefers-reduced-motion: reduce){.gopy-noi{animation:none}}`}</style>
      <div role="button" tabIndex={0} aria-label="Góp ý ở đây nhé — gửi góp ý hoặc báo lỗi cho thầy cô (kéo để dời chỗ)"
        title="Chạm để góp ý · kéo để dời chỗ"
        onPointerDown={bam} onPointerMove={di} onPointerUp={tha} onPointerCancel={huy}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onMo() } }}
        className="flex touch-none cursor-grab flex-col items-center active:scale-95" style={{ opacity: keo ? 0.9 : 1 }}>
        {to && (
          <span className="relative mb-1 whitespace-nowrap px-3 py-1.5 text-[14px] font-extrabold leading-tight sm:text-[15.5px]"
            style={{ background: MAU.surface, color: MAU.ink, border: `2px solid ${MAU.acc}`, borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)', boxShadow: '0 4px 12px rgba(0,0,0,.3)' }}>
            Góp ý ở đây nhé!
            <span aria-hidden className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2"
              style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `8px solid ${MAU.acc}` }} />
          </span>
        )}
        <span className="relative">
          <img src={ANH_LINH_VAT} alt="" draggable={false} className={`gopy-noi block w-auto ${to ? 'h-[92px] sm:h-[120px]' : 'h-[54px] sm:h-[62px]'}`}
            style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.35))' }} />
          <span className="absolute -right-7 top-0 z-10 flex flex-col gap-1">
            <button onPointerDown={chan} onKeyDown={(e) => e.stopPropagation()} onClick={() => doiCo(to ? 'nho' : 'to')} aria-label={to ? 'Thu nhỏ bạn robot' : 'Phóng to bạn robot'}
              title={to ? 'Thu nhỏ' : 'Phóng to'} className={nutNho} style={nutNhoSt}>{to ? '−' : '+'}</button>
            <button onPointerDown={chan} onKeyDown={(e) => e.stopPropagation()} onClick={() => doiCo('an')} aria-label="Ẩn bạn robot (chạm mép màn để hiện lại)"
              title="Ẩn (chạm mép màn để hiện lại)" className={nutNho} style={{ ...nutNhoSt, color: MAU.muted, fontSize: 12 }}>✕</button>
          </span>
        </span>
      </div>
    </div>
  )
}
