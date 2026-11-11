// ẢNH THÔNG BÁO PHỤ HUYNH — bổ trợ sau giờ (Thùy 11/11): logo + "Thông báo Bổ trợ kiến thức" (Thùy 11/11 đổi từ "Bổ trợ yếu") + câu báo, tên các con in ĐẬM khác màu.
// Chỉ ghép chữ hiển thị từ ca đã lưu (bỏ em đã huỷ/vắng). Template inline-hex (né oklch Tailwind v4) để html2canvas chụp được — như VinhDanhCard.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'
import type { CaNhe } from '../../lib/botro_nhe'
import { thuCuaNgay, ddmmVN } from '../../lib/tuan'

const W = 1080, H = 720

export function tenCacCon(ca: CaNhe): string[] {
  return ca.hs.filter((h) => h.buoi_trang_thai !== 'huy').map((h) => h.ho_ten)
}

function AnhView({ ca }: { ca: CaNhe }) {
  const ten = tenCacCon(ca)
  const xanh = '#1d4ed8', cam = '#c2410c'
  return (
    <div style={{ width: W, height: H, background: 'linear-gradient(135deg,#eef4ff 0%,#ffffff 55%,#fff6ec 100%)', fontFamily: "'Be Vietnam Pro', system-ui, sans-serif", color: '#1e293b', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', padding: '56px 72px' }}>
      <div style={{ position: 'absolute', right: -120, top: -120, width: 380, height: 380, borderRadius: '50%', background: '#dbe7ff' }} />
      <div style={{ position: 'absolute', left: -90, bottom: -110, width: 300, height: 300, borderRadius: '50%', background: '#ffe9d3' }} />
      <img src="/Logo.png" alt="BK Academy" style={{ position: 'relative', height: 64, width: 'auto', display: 'block' }} />
      <div style={{ position: 'relative', marginTop: 30, fontSize: 56, fontWeight: 800, color: xanh, letterSpacing: 0.5, lineHeight: 1.2 }}>Thông báo Bổ trợ kiến thức</div>
      <div style={{ position: 'relative', marginTop: 30, background: '#ffffff', border: '2px solid #dbe3f0', borderRadius: 28, padding: '36px 44px', fontSize: 34, lineHeight: 1.55 }}>
        Buổi học <b style={{ color: '#0f172a' }}>{thuCuaNgay(ca.ngay)}, ngày {ddmmVN(ca.ngay)}</b> các bạn{' '}
        {ten.map((t, i) => (
          <span key={t + i}><b style={{ color: cam, fontWeight: 800 }}>{t}</b>{i < ten.length - 2 ? ', ' : i === ten.length - 2 ? ' và ' : ''}</span>
        ))}{' '}
        sẽ ở lại bổ trợ kiến thức sau giờ học nên các con sẽ về muộn 20–25 phút. Bố mẹ nắm thông tin nhé!
      </div>
      <div style={{ position: 'absolute', left: 72, bottom: 40, fontSize: 24, color: '#64748b' }}>Lớp {ca.ten_lop} · {ca.mon}</div>
    </div>
  )
}

// dựng bản kích thước thật NGOÀI màn hình rồi chụp (bản xem trước đang bị scale) — y cách renderVinhDanhPng
export async function anhThongBaoCanvas(ca: CaNhe): Promise<HTMLCanvasElement> {
  try { await document.fonts.load("800 50px 'Be Vietnam Pro'", 'Thông báo') } catch { /* font lỗi → fallback */ }
  const holder = document.createElement('div')
  holder.style.cssText = 'position:fixed;left:-99999px;top:0;z-index:-1'
  document.body.appendChild(holder)
  const root = createRoot(holder)
  try {
    root.render(<AnhView ca={ca} />)
    await new Promise((r) => setTimeout(r, 50))
    const img = holder.querySelector('img') as HTMLImageElement | null // chờ logo tải xong mới chụp
    if (img && !img.complete) await new Promise((r) => { img.onload = r; img.onerror = r; setTimeout(r, 3000) })
    return await html2canvas(holder.firstElementChild as HTMLElement, { scale: 1, useCORS: true, logging: false, width: W, height: H, backgroundColor: '#ffffff' })
  } finally { root.unmount(); holder.remove() }
}

export default function ThongBaoSauGioAnh({ ca, onDong }: { ca: CaNhe; onDong: () => void }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const chup = () => anhThongBaoCanvas(ca)
  async function tai() {
    setBusy('tai'); setLoi(null); setOk(null)
    try {
      const cv = await chup(); const a = document.createElement('a')
      a.href = cv.toDataURL('image/png'); a.download = `thong-bao-bo-tro-${ca.ten_lop}-${ca.ngay}.png`; a.click(); setOk('Đã tải ảnh.')
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  async function copy() {
    setBusy('copy'); setLoi(null); setOk(null)
    try {
      const cv = await chup()
      const blob: Blob = await new Promise((r, j) => cv.toBlob((b) => (b ? r(b) : j(new Error('Không tạo được ảnh.'))), 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); setOk('Đã copy ảnh — dán vào Zalo lớp.')
    } catch (e: any) { setLoi(`Không copy được (${e?.message ?? e}) — dùng "Tải ảnh".`) } finally { setBusy(null) }
  }
  const tiLe = 0.5
  return (
    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-semibold text-emerald-800">Ảnh thông báo phụ huynh · {ca.ten_lop} · {thuCuaNgay(ca.ngay)} {ddmmVN(ca.ngay)}</span>
        <button disabled={!!busy} onClick={copy} className="ml-auto rounded-lg bg-emerald-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{busy === 'copy' ? '…' : '📋 Copy ảnh'}</button>
        <button disabled={!!busy} onClick={tai} className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">{busy === 'tai' ? '…' : '⬇ Tải ảnh'}</button>
        <button onClick={onDong} className="text-[12px] text-emerald-700 hover:underline">Đóng</button>
      </div>
      {ok && <p className="mb-2 text-[12px] font-medium text-emerald-700">✓ {ok}</p>}
      {loi && <p className="mb-2 text-[12px] text-rose-700">{loi}</p>}
      {/* xem trước thu nhỏ; ảnh chụp từ khối gốc kích thước thật */}
      <div style={{ width: W * tiLe, height: H * tiLe, overflow: 'hidden' }} className="rounded-xl ring-1 ring-emerald-200">
        <div style={{ transform: `scale(${tiLe})`, transformOrigin: 'top left', width: W, height: H }}><AnhView ca={ca} /></div>
      </div>
    </div>
  )
}
