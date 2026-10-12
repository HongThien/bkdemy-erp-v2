// ============================================================================
// NutGopYNoi — NÚT GÓP Ý / BÁO LỖI NỔI Ở MỌI MÀN app HS (Thùy 10/10: "1 biểu tượng hiện ở góc nào đó, ở mọi màn").
// · Chấm tròn nhỏ (bong bóng chat + dấu !) ở góc dưới phải; KÉO được sang cạnh/độ cao khác nếu che nút của màn (vị trí nhớ trong máy).
// · Bấm ⇒ tấm nhập nhanh NGAY TẠI CHỖ (không rời màn đang làm — em đang làm bài không bị mất): Báo lỗi / Góp ý tưởng · 10–1.500 chữ · ảnh tuỳ chọn.
// · Báo kèm màn đang mở + môn + cỡ màn (ngữ cảnh) để thầy cô tái hiện lỗi. Luật (độ dài, 5 lần/ngày) ở DB — fn_hs_gui_gop_y (lib/gopy_hs.ts).
// · Muốn xem thầy cô trả lời ⇒ "Xem góp ý của em" mở màn Góp ý đầy đủ (HocSinhApp nghe sự kiện). Màn Góp ý + Hướng dẫn tương tác thì ẩn nút.
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

function Tam({ man, onDong }: { man: string; onDong: () => void }) {
  const mon = useMonHS()
  const [loai, setLoai] = useState<LoaiGopY>('bug')
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
