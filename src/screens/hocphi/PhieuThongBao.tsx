// Phiếu thông báo học phí gửi PH — 2 hình thức, DÙNG CHUNG 1 card (inline-hex, KHÔNG class Tailwind
// màu — v4 compute oklch → html2canvas ra trắng/lỗi, đúng bài học §367/06-22):
//  · "📷 Ảnh gửi PH" — ĐÚNG pattern V1 (EtAnhGuiPH/TabSatHach.handleCopy): mở POPUP chứa card +
//    html2canvas CDN + nút Copy NGAY TRONG popup (user-gesture) → clipboard, paste Zalo.
//  · "⬇ PDF" — headless: card render ẩn trong app → html2canvas-pro (chịu oklch) + jsPDF, tải file
//    RIÊNG (KHÔNG gộp nhiều PH 1 file — Thùy: "gộp lại mất công cắt ra").
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getPhieuThongBao, type DongPhieu } from '../../lib/hocphi'
import { tenNganHS } from '../../lib/hoten'

const tienVN = (n: number) => Math.round(n).toLocaleString('vi-VN') + 'đ'
const LOAI_LABEL: Record<string, string> = { hoc_phi: 'Học phí', hoc_duoi: 'Học đuổi', hoc_lieu: 'Học liệu', phat_sinh: 'Phát sinh', no_ky_truoc: 'Nợ kỳ trước' }
function chiTiet(d: DongPhieu): string {
  if (d.loai === 'hoc_phi') return `${d.so_luong} buổi × ${tienVN(d.don_gia ?? 0)}${d.he_so && d.he_so !== 1 ? ` × ${d.he_so}` : ''}`
  return d.mo_ta ?? ''
}
function tenDongKemCon(d: DongPhieu): string {
  const con = d.hoc_sinh_ten ? tenNganHS(d.hoc_sinh_ten) : ''
  return [con, d.lop_ten].filter(Boolean).join(' · ') || '—'
}
const safeFileName = (s: string) => (s || 'phieu').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120)

// Card phiếu (inline-hex) — dùng CHUNG cho ảnh popup lẫn PDF headless.
function InvoiceCard({ phTen, maPh, ky, dong, tongTien, daChot }: { phTen: string; maPh: string; ky: string; dong: DongPhieu[]; tongTien: number; daChot: boolean }) {
  const kyVN = `${ky.slice(5, 7)}/${ky.slice(0, 4)}`
  return (
    <div style={{ width: 480, overflow: 'hidden', borderRadius: 16, background: '#ffffff', color: '#1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
      <div style={{ background: 'linear-gradient(90deg, #E91E8C 0%, #F7941E 50%, #2D9CDB 100%)', padding: '16px 20px', color: '#ffffff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.9 }}>BK Academy</div>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15 }}>Thông báo học phí tháng {kyVN}</div>
        <div style={{ fontSize: 12, opacity: 0.95 }}>{phTen} · {maPh}{!daChot ? ' · (tạm tính, chưa chốt)' : ''}</div>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#64748b' }}>
              <th style={{ borderBottom: '2px solid #e2e8f0', padding: '6px 4px', textAlign: 'left', fontWeight: 600 }}>Khoản</th>
              <th style={{ borderBottom: '2px solid #e2e8f0', padding: '6px 4px', textAlign: 'left', fontWeight: 600 }}>Con / chi tiết</th>
              <th style={{ borderBottom: '2px solid #e2e8f0', padding: '6px 4px', textAlign: 'right', fontWeight: 600 }}>Tiền</th>
            </tr>
          </thead>
          <tbody>
            {dong.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px 4px', color: '#1e293b', whiteSpace: 'nowrap' }}>{LOAI_LABEL[d.loai]}</td>
                <td style={{ padding: '6px 4px', color: '#475569' }}>{tenDongKemCon(d)}{chiTiet(d) ? <div style={{ fontSize: 11, color: '#94a3b8' }}>{chiTiet(d)}</div> : null}</td>
                <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>{tienVN(d.thanh_tien)}</td>
              </tr>
            ))}
            {!dong.length && <tr><td colSpan={3} style={{ padding: '14px 4px', textAlign: 'center', color: '#94a3b8' }}>Không có khoản nào trong kỳ.</td></tr>}
          </tbody>
        </table>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '2px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>TỔNG CỘNG</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#E91E8C' }}>{tienVN(tongTien)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Modal "Ảnh gửi PH" — 1 PH, mở popup + copy clipboard (đúng pattern EtAnhGuiPH) ──
export function AnhGuiPHModal({ phuHuynhId, phTen, maPh, ky, onClose }: { phuHuynhId: string; phTen: string; maPh: string; ky: string; onClose: () => void }) {
  const [data, setData] = useState<{ dong: DongPhieu[]; tongTien: number; daChot: boolean } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => { getPhieuThongBao(phuHuynhId, phTen, maPh, ky).then(setData) }, [phuHuynhId, phTen, maPh, ky])

  function handleCopy() {
    const el = cardRef.current
    if (!el) { alert('Chưa render được phiếu'); return }
    const cardHTML = el.outerHTML
    const fname = `HocPhi_${safeFileName(phTen)}_${ky.slice(0, 7)}.png`
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Học phí — ${phTen}</title>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"><\/script>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f3f4f6;padding:12px;display:flex;flex-direction:column;align-items:center;min-height:100vh}
  .btn-row{display:flex;gap:8px;margin-bottom:12px;width:100%;max-width:480px}
  .btn{flex:1;padding:10px 12px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-copy{background:#16a34a;color:#fff}.btn-print{background:#2563eb;color:#fff}.btn:hover{opacity:.85}
  #msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px;text-align:center;width:100%}
  @media print{.btn-row,#msg{display:none!important}}
  #report-content{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)}
</style></head><body>
<div class="btn-row">
  <button class="btn btn-copy" onclick="copyImg()">📋 Copy ảnh (paste vào Zalo)</button>
  <button class="btn btn-print" onclick="window.print()">🖨️ In / Lưu PDF</button>
</div>
<div id="report-content">${cardHTML}</div>
<p id="msg"></p>
<script>
async function copyImg(){
  var msg=document.getElementById('msg');msg.textContent='⏳ Đang xử lý...';
  try{
    var node=document.getElementById('report-content');
    var canvas=await html2canvas(node,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,scrollX:0,scrollY:0,windowWidth:node.scrollWidth,windowHeight:node.scrollHeight,width:node.scrollWidth,height:node.scrollHeight});
    canvas.toBlob(async function(blob){
      try{ await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]); msg.textContent='✅ Đã copy! Paste (Ctrl+V) vào Zalo.'; }
      catch(e){ var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=${JSON.stringify(fname)};a.click();URL.revokeObjectURL(url); msg.textContent='✅ Đã tải file ảnh!'; }
    },'image/png');
  }catch(e){ msg.textContent='Lỗi: '+e.message; }
}
<\/script>
</body></html>`
    const popup = window.open('', '_blank', 'width=560,height=800,scrollbars=yes')
    if (!popup) { alert('Trình duyệt chặn popup. Bật "Allow pop-ups" cho site này.'); return }
    popup.document.write(html)
    popup.document.close()
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-900/70" onClick={onClose}>
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold">Thông báo học phí — {phTen}</span>
        <button onClick={handleCopy} disabled={!data} className="ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500 disabled:opacity-40">📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        {!data ? <p className="text-center text-sm text-slate-300">Đang tải…</p> : (
          <div ref={cardRef} style={{ margin: '0 auto' }}>
            <InvoiceCard phTen={phTen} maPh={maPh} ky={ky} dong={data.dong} tongTien={data.tongTien} daChot={data.daChot} />
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

// ── Tải PDF RIÊNG 1 file/PH (headless, KHÔNG popup) — bulk gọi lặp nhiều PH, mỗi lần 1 file ──
// ⚠ Lần đầu dùng toạ độ âm cực xa (left:-99999px) để "ẩn" → html2canvas tính SAI viewport/kích thước,
// ảnh bị crop lệch (Thùy chụp thấy cột "Tiền" mất hẳn). Đúng cách (giống PrintView headless): render
// BÌNH THƯỜNG trên màn hình (top:0,left:0, không toạ độ âm) rồi PHỦ 1 lớp trắng đục z-index cao hơn đè lên
// che mắt người dùng — html2canvas chụp đúng vì phần tử ở vị trí "thật", không bị lệch tính toán.
export async function taiPdfPhieu(phuHuynhId: string, phTen: string, maPh: string, ky: string): Promise<void> {
  const data = await getPhieuThongBao(phuHuynhId, phTen, maPh, ky)
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;top:0;left:0;z-index:9998;pointer-events:none'
  document.body.appendChild(host)
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#ffffff'
  document.body.appendChild(overlay)
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(host)
  root.render(<InvoiceCard phTen={phTen} maPh={maPh} ky={ky} dong={data.dong} tongTien={data.tongTien} daChot={data.daChot} />)
  await new Promise((r) => setTimeout(r, 150)) // chờ 1 nhịp render (font/layout ổn định)
  try {
    const [h2cMod, jspdfMod] = await Promise.all([import('html2canvas-pro'), import('jspdf')])
    const target = host.firstChild as HTMLElement
    const canvas = await h2cMod.default(target, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, width: target.scrollWidth, height: target.scrollHeight, windowWidth: target.scrollWidth, windowHeight: target.scrollHeight })
    const wMM = 100, hMM = (canvas.height / canvas.width) * wMM
    const pdf = new jspdfMod.jsPDF({ unit: 'mm', format: [wMM + 20, hMM + 20], orientation: 'portrait' })
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 10, 10, wMM, hMM)
    pdf.save(`HocPhi_${safeFileName(phTen)}_${ky.slice(0, 7)}.pdf`)
  } finally {
    overlay.remove()
    root.unmount(); host.remove()
  }
}
