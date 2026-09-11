// Phiếu kết quả test đầu vào gửi PH (§D spec) — ĐÚNG pattern V1 EtAnhGuiPH / PhieuThongBao.tsx:
// popup + html2canvas CDN + nút Copy TRONG popup (user-gesture) → clipboard, paste Zalo. 1 phiếu = 1 môn
// (đa môn → N phiếu riêng, quyết định đã chốt ở PLAN). Card inline-hex (KHÔNG class màu Tailwind — v4 oklch).
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { coNhom, type PhieuKetQua } from '../../lib/detest'

const KY_NANG_LABEL: Record<string, string> = { tot: 'Tốt', on: 'Ổn', kem: 'Kém' }
// thoi_khoa_bieu.thu: 2..7 = Thứ 2..7, 8 = CN (cùng khuôn TKBScreen).
const THU_LABEL: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'CN' }
const KY_NANG_COLOR: Record<string, string> = { tot: '#16a34a', on: '#d97706', kem: '#dc2626' }
const safeFileName = (s: string) => (s || 'phieu').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120)

function BarRow({ chuyenDe, pct }: { chuyenDe: string; pct: number }) {
  const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626'
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginBottom: 2 }}>
        <span>{chuyenDe}</span><span style={{ fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export function PhieuCard({ p }: { p: PhieuKetQua }) {
  const ngayVN = new Date(p.ngay + 'T00:00:00').toLocaleDateString('vi-VN')
  // Nhận xét rỗng ({} lưu nháp) → không in tiêu đề trống trên phiếu.
  const nx0 = p.nhanXet
  const nx = nx0 && (nx0.trinhBay || nx0.tinhToan || nx0.khac || Object.values(nx0.kienThuc ?? {}).some(Boolean)) ? nx0 : null
  return (
    <div style={{ width: 500, overflow: 'hidden', borderRadius: 16, background: '#ffffff', color: '#1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
      <div style={{ background: 'linear-gradient(90deg, #4338CA 0%, #6366F1 50%, #818CF8 100%)', padding: '16px 20px', color: '#ffffff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.9 }}>BK Academy</div>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15 }}>Kết quả test đầu vào — {p.mon}</div>
        <div style={{ fontSize: 12, opacity: 0.95 }}>{p.hoTenHs}{p.khoi ? ` · Lớp ${p.khoi}` : ''} · {ngayVN}</div>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {/* Điểm NHẬP TAY (CEO ④ 09/09) là con số chính; % đúng Đ/C/S đứng cạnh. */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, padding: '8px 0 14px', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: '#4338CA' }}>{p.diemNhap ?? '—'}</span>
          <span style={{ fontSize: 14, color: '#94a3b8' }}>điểm</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#64748b', marginLeft: 6 }}>· đúng {p.tong.pct}% ({p.tong.daCham}/{p.tong.soCau} câu)</span>
        </div>

        {p.theoChuyenDe.length > 0 && (
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tổng hợp theo chuyên đề</div>
            {p.theoChuyenDe.map((b) => <BarRow key={b.chuyenDe} chuyenDe={b.chuyenDe} pct={b.pct} />)}
          </div>
        )}

        {/* Cơ bản/nâng cao · Đại/Hình — nhóm không có câu thì bỏ qua (CEO ⑦). 2 cột song song cho gọn phiếu. */}
        {(coNhom(p.theoMucDo.coBan) || coNhom(p.theoMucDo.nangCao) || coNhom(p.theoNhanh.dai) || coNhom(p.theoNhanh.hinh)) && (
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              {(coNhom(p.theoMucDo.coBan) || coNhom(p.theoMucDo.nangCao)) && <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cơ bản · Nâng cao</div>}
              {coNhom(p.theoMucDo.coBan) && <BarRow chuyenDe={`Cơ bản (${p.theoMucDo.coBan.soCau} câu)`} pct={p.theoMucDo.coBan.pct!} />}
              {coNhom(p.theoMucDo.nangCao) && <BarRow chuyenDe={`Nâng cao (${p.theoMucDo.nangCao.soCau} câu)`} pct={p.theoMucDo.nangCao.pct!} />}
            </div>
            <div>
              {(coNhom(p.theoNhanh.dai) || coNhom(p.theoNhanh.hinh)) && <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đại · Hình</div>}
              {coNhom(p.theoNhanh.dai) && <BarRow chuyenDe={`Đại số (${p.theoNhanh.dai.soCau} câu)`} pct={p.theoNhanh.dai.pct!} />}
              {coNhom(p.theoNhanh.hinh) && <BarRow chuyenDe={`Hình học (${p.theoNhanh.hinh.soCau} câu)`} pct={p.theoNhanh.hinh.pct!} />}
            </div>
          </div>
        )}

        {nx && (
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nhận xét</div>
            {(nx.trinhBay || nx.tinhToan) && (
              <div style={{ display: 'flex', gap: 14, fontSize: 12, marginBottom: 8 }}>
                {nx.trinhBay && <span>Trình bày: <b style={{ color: KY_NANG_COLOR[nx.trinhBay] }}>{KY_NANG_LABEL[nx.trinhBay]}</b></span>}
                {nx.tinhToan && <span>Tính toán: <b style={{ color: KY_NANG_COLOR[nx.tinhToan] }}>{KY_NANG_LABEL[nx.tinhToan]}</b></span>}
              </div>
            )}
            {nx.kienThuc && (
              <div style={{ fontSize: 12, color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 8 }}>
                {nx.kienThuc.hinhCoBan && <div>Hình cơ bản: {nx.kienThuc.hinhCoBan}</div>}
                {nx.kienThuc.daiCoBan && <div>Đại cơ bản: {nx.kienThuc.daiCoBan}</div>}
                {nx.kienThuc.hinhNangCao && <div>Hình nâng cao: {nx.kienThuc.hinhNangCao}</div>}
                {nx.kienThuc.daiNangCao && <div>Đại nâng cao: {nx.kienThuc.daiNangCao}</div>}
              </div>
            )}
            {nx.khac && <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>{nx.khac}</div>}
          </div>
        )}

        {/* Lớp đề xuất + GV + lịch — CHỈ trên ảnh gửi PH (CEO ⑧ 09/09), UI trả bài không hiện. */}
        <div style={{ paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Lớp đề xuất</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: p.lopDeXuat ? '#4338CA' : '#94a3b8' }}>{p.lopDeXuat?.tenLop ?? 'Chưa chọn'}</span>
          </div>
          {p.lopDeXuat && p.lopDeXuat.gv.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12, color: '#475569' }}>
              <span style={{ color: '#64748b' }}>Giáo viên</span><span style={{ fontWeight: 600 }}>{p.lopDeXuat.gv.join(' · ')}</span>
            </div>
          )}
          {p.lopDeXuat && p.lopDeXuat.lich.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12, color: '#475569', gap: 12 }}>
              <span style={{ color: '#64748b', flexShrink: 0 }}>Lịch học</span>
              <span style={{ fontWeight: 600, textAlign: 'right', whiteSpace: 'pre-line' }}>{p.lopDeXuat.lich.map((l) => `${THU_LABEL[l.thu] ?? `Thứ ${l.thu}`} ${l.gioBatDau}–${l.gioKetThuc}${l.phong ? ` · ${l.phong}` : ''}`).join('\n')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PhieuTestModal({ p, onClose }: { p: PhieuKetQua; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  function handleCopy() {
    const el = cardRef.current
    if (!el) { alert('Chưa render được phiếu'); return }
    const cardHTML = el.outerHTML
    const fname = `TestDauVao_${safeFileName(p.hoTenHs)}_${safeFileName(p.mon)}.png`
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test đầu vào — ${p.hoTenHs}</title>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"><\/script>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f3f4f6;padding:12px;display:flex;flex-direction:column;align-items:center;min-height:100vh}
  .btn-row{display:flex;gap:8px;margin-bottom:12px;width:100%;max-width:500px}
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
        <span className="text-sm font-semibold">Phiếu test đầu vào — {p.hoTenHs}</span>
        {/* Gửi PH = phiếu (ảnh) + file scan đã chấm ĐÍNH KÈM RIÊNG (Thùy addendum: "kèm file scan đã
            chấm") — html2canvas chỉ chụp được phiếu tóm tắt, bài scan gốc (PDF/ảnh nhiều trang) gửi
            thẳng file, không nhồi vào cùng 1 ảnh. */}
        {p.baiDaChamUrl && <a href={p.baiDaChamUrl} target="_blank" rel="noreferrer" className="ml-auto rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">📄 Bài đã chấm</a>}
        <button onClick={handleCopy} className={p.baiDaChamUrl ? 'rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500' : 'ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500'}>📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div ref={cardRef} style={{ margin: '0 auto' }}><PhieuCard p={p} /></div>
      </div>
    </div>,
    document.body,
  )
}
