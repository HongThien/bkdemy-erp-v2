// CHIẾU ẢNH VINH DANH TOÀN MÀN HÌNH (Thùy 11/11: "nút chiếu ảnh toàn màn hình để show cho học sinh").
// Bấm 📺 Chiếu ở 1 em ⇒ toàn màn hình, nền đen, ảnh vừa khít màn. ← → (hoặc bấm nửa trái/phải) chuyển sang em khác trong
// cùng danh sách, Esc thoát. Nền dùng nền đang chọn ở Xưởng ảnh (NHO_NEN). Ảnh dựng ở máy, em kế tiếp được dựng sẵn trước.
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { veVinhDanhFB, getVinhDanhData, NHO_NEN, type LoaiNen } from './vinhDanhFB'

export type MucChieu = { hsId: string; mon: string; loai: LoaiNen; ten: string }

export default function ChieuAnhFB({ ds, batDau, ym, onClose }: { ds: MucChieu[]; batDau: number; ym: string; onClose: () => void }) {
  const [i, setI] = useState(batDau)
  const [anh, setAnh] = useState<Record<number, string>>({})
  const [loi, setLoi] = useState<string | null>(null)
  // dòng hướng dẫn + nút ✕ tự ẩn sau 3 s cho màn chiếu sạch; rê chuột / bấm phím thì hiện lại
  const [hien, setHien] = useState(true)
  const hen = useRef<number | undefined>(undefined)
  const chamVao = useCallback(() => { setHien(true); window.clearTimeout(hen.current); hen.current = window.setTimeout(() => setHien(false), 3000) }, [])
  useEffect(() => { chamVao(); return () => window.clearTimeout(hen.current) }, [chamVao])
  const khung = useRef<HTMLDivElement>(null)
  const dangDung = useRef<Set<number>>(new Set())

  const dung = useCallback(async (k: number) => {
    if (k < 0 || k >= ds.length || dangDung.current.has(k)) return
    dangDung.current.add(k)
    try {
      const m = ds[k]
      const d = await getVinhDanhData(m.hsId, m.mon, ym)
      const cv = await veVinhDanhFB(d, m.loai, NHO_NEN.nen)
      const url = cv.toDataURL('image/jpeg', 0.92)
      setAnh((p) => ({ ...p, [k]: url }))
    } catch (e) { dangDung.current.delete(k); if (k === i) setLoi((e as Error).message) }
  }, [ds, ym, i])

  useEffect(() => { void dung(i); void dung(i + 1); void dung(i - 1) }, [i, dung])

  // vào toàn màn hình ngay khi mở; thoát toàn màn hình (Esc) = đóng
  useEffect(() => {
    const el = khung.current
    el?.requestFullscreen?.().catch(() => { /* trình duyệt chặn ⇒ vẫn hiện phủ kín cửa sổ */ })
    const thoat = () => { if (!document.fullscreenElement) onClose() }
    document.addEventListener('fullscreenchange', thoat)
    return () => {
      document.removeEventListener('fullscreenchange', thoat)
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    }
  }, [onClose])

  const di = useCallback((b: number) => { setLoi(null); setI((x) => Math.max(0, Math.min(ds.length - 1, x + b))) }, [ds.length])
  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      chamVao()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); di(1) }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); di(-1) }
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', phim)
    return () => window.removeEventListener('keydown', phim)
  }, [di, onClose, chamVao])

  const url = anh[i]
  return createPortal(
    <div ref={khung} onMouseMove={chamVao} className={`fixed inset-0 z-[60] flex select-none items-center justify-center bg-black ${hien ? '' : 'cursor-none'}`}>
      {url ? <img src={url} alt="" className="max-h-full max-w-full object-contain" />
        : <span className="text-sm text-white/60">{loi ? `⚠️ ${loi}` : 'Đang dựng ảnh…'}</span>}
      {/* bấm nửa trái / phải để lùi / tiến */}
      <button aria-label="Ảnh trước" onClick={() => di(-1)} className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" />
      <button aria-label="Ảnh sau" onClick={() => di(1)} className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize" />
      <div className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[12px] text-white/70 transition-opacity duration-500 ${hien ? 'opacity-100' : 'opacity-0'}`}>
        {ds[i]?.ten} · {i + 1}/{ds.length} · ← → chuyển · Esc thoát
      </div>
      <button onClick={onClose} className={`absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-[13px] text-white/80 transition-opacity duration-500 hover:bg-white/20 ${hien ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>✕</button>
    </div>,
    document.body,
  )
}
