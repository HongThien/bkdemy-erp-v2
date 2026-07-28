import { useEffect, useRef, useState } from 'react'
import { listAllTKB, listLop, addTKB, dongTKB, suaHieuLucTKB, type TKBSlot, type Lop } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'
import { Shell, Field, inp } from '../kho/ui'

const THU_COLS = [2, 3, 4, 5, 6, 7, 8]
const THU_LABEL: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'CN' }
// 6 phòng vị trí CỐ ĐỊNH trong ô ca: 3 cột × 2 hàng (P101 P102 P201 / P202 P301 P302)
const ROOMS = ['P101', 'P102', 'P201', 'P202', 'P301', 'P302']
const MON_TONE: Record<string, string> = { 'Toán': 'border-indigo-400 bg-indigo-50 text-indigo-900', 'Văn': 'border-rose-400 bg-rose-50 text-rose-900', 'Anh': 'border-emerald-400 bg-emerald-50 text-emerald-900', 'KHTN': 'border-amber-400 bg-amber-50 text-amber-900' }
const monTone = (mon?: string) => (mon && MON_TONE[mon]) || 'border-slate-300 bg-slate-50 text-slate-700'

// Xếp các ca của 1 ô (khung × thứ) vào lưới 6 phòng mà KHÔNG ĐƯỢC MẤT ca nào.
// Bug cũ: mỗi vị trí phòng dùng `cell.find(phòng khớp)` → 2 ca cùng phòng, hoặc nhiều ca `phong = NULL`
// (thực tế 50/76 ca chưa gán phòng) chỉ hiện được 1 ca, phần còn lại BIẾN MẤT im lặng.
// Nay: ① ca có phòng thật → về đúng vị trí · ② ca còn lại (NULL / phòng lạ / trùng chỗ) lấp các vị trí trống
// theo thứ tự giờ · ③ vẫn dư (>6 ca/ô) → trả `du` để vẽ thêm dưới lưới. Tổng ca vẽ ra luôn = tổng ca có.
function xepCa(cell: TKBSlot[]): { o: (TKBSlot | null)[]; du: TKBSlot[] } {
  const o: (TKBSlot | null)[] = ROOMS.map(() => null)
  const conLai: TKBSlot[] = []
  for (const s of cell) {
    const i = ROOMS.indexOf(s.phong ?? '')
    if (i >= 0 && !o[i]) o[i] = s
    else conLai.push(s)
  }
  const du: TKBSlot[] = []
  for (const s of conLai) {
    const i = o.indexOf(null)
    if (i >= 0) o[i] = s
    else du.push(s)
  }
  return { o, du }
}
const hhmm = (t: string) => t.slice(0, 5)
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

// Khung lớn cố định của 1 ngày (lo/hi = phút; ca thuộc khung nếu giờ BẮT ĐẦU ∈ [lo, hi)).
// macDinh = giờ gợi ý khi xếp ca mới từ khung này. an = ẩn khi rỗng (giờ trưa).
type Band = { ten: string; lo: number; hi: number; macDinh: [string, string]; an?: boolean }
const BANDS: Band[] = [
  { ten: '7:30\n10:00', lo: 0, hi: 600, macDinh: ['07:30', '09:30'] },
  { ten: '10:00\n12:00', lo: 600, hi: 720, macDinh: ['10:00', '11:30'] },
  { ten: '12:00\n14:00', lo: 720, hi: 840, macDinh: ['12:00', '13:30'], an: true },
  { ten: '14:00\n16:00', lo: 840, hi: 960, macDinh: ['14:00', '16:00'] },
  { ten: '16:00\n18:00', lo: 960, hi: 1080, macDinh: ['16:00', '18:00'] },
  { ten: '18:00\n19:30', lo: 1080, hi: 1170, macDinh: ['18:00', '19:30'] },
  { ten: '19:30\n21:30', lo: 1170, hi: 1440, macDinh: ['19:30', '21:00'] },
]

// TKB = LƯỚI CA RỜI RẠC (đúng bản chất trường học: ca × phòng × lớp — categorical, KHÔNG phải calendar
// liên tục; độ dài ca nằm trong nhãn giờ, không cần tỷ lệ pixel). Hàng = khung ca có thật, cột = thứ.
// Mỗi ô = lưới phòng 3×2 vị trí cố định; phòng trống = chừa trống. Cả bảng gọn 1 màn hình.
export default function TKBScreen() {
  const [slots, setSlots] = useState<TKBSlot[]>([])
  const [dsLop, setDsLop] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sel, setSel] = useState<TKBSlot | null>(null)
  const [adding, setAdding] = useState<{ thu: number; tu: string; den: string } | null>(null)
  const [mon, setMon] = useState<string>('all') // toggle môn: 'all' | tên môn
  const [anh, setAnh] = useState(false)          // mở modal chụp ảnh

  async function reload() {
    setLoading(true); setErr(null)
    try { const [s, l] = await Promise.all([listAllTKB(), listLop()]); setSlots(s); setDsLop(l) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  // KHUNG LỚN CANONICAL (Thùy chốt): ngày chia ~7 khung cố định; ca xếp vào khung theo GIỜ BẮT ĐẦU
  // (bỏ qua giờ kết thúc — biên khung trùng giờ vào ca nên không có ca vắt khung).
  // Khung 12–14 gần như không dùng → tự ẩn khi rỗng (có ca thì tự hiện lại).
  // Lọc theo môn (toggle). monsCo = các môn có ca thật → dựng toggle bar.
  const monsCo = [...new Set(slots.map((s) => s.lop?.mon).filter(Boolean) as string[])].sort()
  const view = mon === 'all' ? slots : slots.filter((s) => s.lop?.mon === mon)
  const slotsInBand = (band: Band, thu: number) =>
    view.filter((s) => s.thu === thu && toMin(s.gio_bat_dau) >= band.lo && toMin(s.gio_bat_dau) < band.hi)
      .sort((a, b) => toMin(a.gio_bat_dau) - toMin(b.gio_bat_dau))
  const bands = BANDS.filter((b) => !b.an || THU_COLS.some((t) => slotsInBand(b, t).length > 0))

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2">
        <span className="text-sm font-semibold text-slate-900">Thời khóa biểu</span>
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">{view.length} ca{mon !== 'all' ? ` · ${mon}` : ' / tuần'}</span>
        {/* Toggle môn — Tất cả + từng môn có ca */}
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <MonBtn active={mon === 'all'} onClick={() => setMon('all')}>Tất cả</MonBtn>
          {monsCo.map((m) => <MonBtn key={m} active={mon === m} onClick={() => setMon(m)}>{m}</MonBtn>)}
        </div>
        <button onClick={() => setAnh(true)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">📷 Chụp ảnh</button>
        <span className="ml-auto text-[12px] text-slate-400">Click card để sửa · ô trống click để xếp ca</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 pb-3 pt-2">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : slots.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có ca nào.</div>
          : (
            <table className="w-full table-fixed border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-10"></th>
                  {THU_COLS.map((t) => <th key={t} className="rounded-md bg-slate-800 py-1 text-[12px] font-semibold uppercase tracking-wider text-white">{THU_LABEL[t]}</th>)}
                </tr>
              </thead>
              <tbody>
                {bands.map((band) => (
                  <tr key={band.ten}>
                    <td className="rounded-md bg-white px-1 py-1 text-center align-middle">
                      <div className="text-[12px] font-bold leading-tight text-slate-700">{band.ten.split('\n')[0]}</div>
                      <div className="text-[10px] leading-tight text-slate-400">{band.ten.split('\n')[1]}</div>
                    </td>
                    {THU_COLS.map((thu) => {
                      const { o, du } = xepCa(slotsInBand(band, thu))
                      return (
                        <td key={thu} className="rounded-md bg-white p-1 align-middle">
                          {/* lưới phòng 3 cột × 2 hàng CỐ ĐỊNH — ô trống hiện mờ, click xếp ca vào đúng phòng */}
                          <div className="grid grid-cols-3 grid-rows-2 gap-1">
                            {ROOMS.map((phong, i) => {
                              const s = o[i]
                              return s ? (
                                <button key={phong} onClick={() => setSel(s)}
                                  className={`rounded-md border-[1.5px] px-0.5 py-0.5 text-center shadow-sm transition hover:shadow ${monTone(s.lop?.mon)}`}
                                  title={`${s.lop?.ten_lop} · ${hhmm(s.gio_bat_dau)}–${hhmm(s.gio_ket_thuc)} · ${s.phong ?? 'chưa gán phòng'}`}>
                                  <div className="text-[13px] font-bold leading-tight">{s.lop?.ten_lop ?? '?'}</div>
                                  {/* giờ THẬT của ca — khung hàng chỉ là nhãn thô */}
                                  <div className="text-[8px] leading-tight opacity-70">{hhmm(s.gio_bat_dau)}–{hhmm(s.gio_ket_thuc)}</div>
                                  {/* phòng THẬT của ca (— = chưa gán), KHÔNG phải nhãn vị trí ô */}
                                  <div className="text-[8px] leading-tight opacity-60">{s.phong ?? '—'}</div>
                                </button>
                              ) : (
                                <button key={phong} onClick={() => setAdding({ thu, tu: band.macDinh[0], den: band.macDinh[1] })}
                                  title={`Xếp ca · ${THU_LABEL[thu]} ${band.ten.replace('\n', '–')} · ${phong}`}
                                  className="rounded-md border border-dashed border-slate-200/80 py-1 text-center text-[8px] text-slate-300 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-400">
                                  {phong}
                                </button>
                              )
                            })}
                          </div>
                          {/* >6 ca trong 1 khung × thứ: vẽ tiếp dưới lưới thay vì nuốt mất */}
                          {du.length > 0 && (
                            <div className="mt-1 grid grid-cols-3 gap-1">
                              {du.map((s) => (
                                <button key={s.id} onClick={() => setSel(s)}
                                  className={`rounded-md border-[1.5px] px-0.5 py-0.5 text-center shadow-sm transition hover:shadow ${monTone(s.lop?.mon)}`}
                                  title={`${s.lop?.ten_lop} · ${hhmm(s.gio_bat_dau)}–${hhmm(s.gio_ket_thuc)} · ${s.phong ?? 'chưa gán phòng'}`}>
                                  <div className="text-[13px] font-bold leading-tight">{s.lop?.ten_lop ?? '?'}</div>
                                  <div className="text-[8px] leading-tight opacity-70">{hhmm(s.gio_bat_dau)}–{hhmm(s.gio_ket_thuc)}</div>
                                  <div className="text-[8px] leading-tight opacity-60">{s.phong ?? '—'}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {sel && <SlotModal s={sel} onClose={() => setSel(null)} onChanged={() => { setSel(null); reload() }} />}
      {adding && <AddModal thu={adding.thu} tu={adding.tu} den={adding.den} dsLop={dsLop} onClose={() => setAdding(null)} onAdded={() => { setAdding(null); reload() }} />}
      {anh && <TkbAnh view={view} mon={mon} onClose={() => setAnh(false)} />}
    </div>
  )
}

function MonBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{children}</button>
  )
}

// Màu môn = INLINE HEX (sRGB) cho ảnh chụp — KHÔNG dùng class Tailwind v4 (oklch → html2canvas trắng). Bài học chụp DOM.
const MON_HEX: Record<string, { bd: string; bg: string; fg: string }> = {
  'Toán': { bd: '#818cf8', bg: '#eef2ff', fg: '#312e81' },
  'Văn': { bd: '#fb7185', bg: '#fff1f2', fg: '#881337' },
  'Anh': { bd: '#34d399', bg: '#ecfdf5', fg: '#064e3b' },
  'KHTN': { bd: '#fbbf24', bg: '#fffbeb', fg: '#78350f' },
}
const monHex = (m?: string) => (m && MON_HEX[m]) || { bd: '#cbd5e1', bg: '#f8fafc', fg: '#334155' }

// Chụp ảnh TKB = bảng INLINE-HEX trong popup sạch → html2canvas (CDN) → clipboard (paste Zalo). Đúng pattern V1.
function TkbAnh({ view, mon, onClose }: { view: TKBSlot[]; mon: string; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inBand = (b: Band, thu: number) => view.filter((s) => s.thu === thu && toMin(s.gio_bat_dau) >= b.lo && toMin(s.gio_bat_dau) < b.hi).sort((a, b2) => toMin(a.gio_bat_dau) - toMin(b2.gio_bat_dau))
  const bands = BANDS.filter((b) => !b.an || THU_COLS.some((t) => inBand(b, t).length > 0))
  const tieu_de = `Thời khóa biểu${mon !== 'all' ? ` · ${mon}` : ''}`

  function handleCopy() {
    const el = cardRef.current
    if (!el) return
    const fname = `TKB_${mon === 'all' ? 'tatca' : mon}.png`
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><base href="${location.origin}/">
<title>${tieu_de}</title>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"><\/script>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f3f4f6;padding:12px;display:flex;flex-direction:column;align-items:center}
.btn-row{display:flex;gap:8px;margin-bottom:12px}.btn{padding:10px 14px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}.btn-copy{background:#16a34a;color:#fff}.btn-print{background:#2563eb;color:#fff}.btn:hover{opacity:.85}
#msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px}@media print{.btn-row,#msg{display:none!important}}</style></head><body>
<div class="btn-row"><button class="btn btn-copy" onclick="copyImg()">📋 Copy ảnh (paste vào Zalo)</button><button class="btn btn-print" onclick="window.print()">🖨️ In / Lưu PDF</button></div>
<div id="cap">${el.outerHTML}</div><p id="msg"></p>
<script>async function copyImg(){var msg=document.getElementById('msg');msg.textContent='⏳ Đang xử lý...';try{var node=document.getElementById('cap');var canvas=await html2canvas(node,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,windowWidth:node.scrollWidth,windowHeight:node.scrollHeight,width:node.scrollWidth,height:node.scrollHeight});canvas.toBlob(async function(blob){try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);msg.textContent='✅ Đã copy! Paste (Ctrl+V) vào Zalo.';}catch(e){var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=${JSON.stringify(fname)};a.click();URL.revokeObjectURL(url);msg.textContent='✅ Đã tải file ảnh!';}},'image/png');}catch(e){msg.textContent='Lỗi: '+e.message;}}<\/script>
</body></html>`
    const popup = window.open('', '_blank', 'width=1200,height=860,scrollbars=yes')
    if (!popup) { alert('Trình duyệt chặn popup. Bật "Allow pop-ups" cho site này.'); return }
    popup.document.write(html); popup.document.close()
  }

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-900/70" onClick={onClose}>
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold">Chụp ảnh thời khóa biểu</span>
        <button onClick={handleCopy} className="ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500">📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        {/* Bảng INLINE-HEX (không class màu Tailwind) — đúng cái html2canvas chụp */}
        <div ref={cardRef} style={{ margin: '0 auto', width: 'fit-content', background: '#ffffff', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 12, textAlign: 'center' }}>{tieu_de}</div>
          <table style={{ borderCollapse: 'separate', borderSpacing: 4 }}>
            <thead><tr>
              <th style={{ width: 56 }}></th>
              {THU_COLS.map((t) => <th key={t} style={{ background: '#1e293b', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>{THU_LABEL[t]}</th>)}
            </tr></thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b.ten}>
                  <td style={{ background: '#f1f5f9', borderRadius: 6, padding: 4, textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>{b.ten.split('\n')[0]}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>{b.ten.split('\n')[1]}</div>
                  </td>
                  {THU_COLS.map((thu) => {
                    const cell = inBand(b, thu)
                    return (
                      <td key={thu} style={{ minWidth: 96, background: '#f8fafc', borderRadius: 6, padding: 3, verticalAlign: 'top' }}>
                        {cell.map((s) => {
                          const c = monHex(s.lop?.mon)
                          return (
                            <div key={s.id} style={{ border: `1.5px solid ${c.bd}`, background: c.bg, color: c.fg, borderRadius: 6, padding: '3px 5px', marginBottom: 3, textAlign: 'center' }}>
                              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{s.lop?.ten_lop ?? '?'}</div>
                              <div style={{ fontSize: 9, opacity: .8 }}>{hhmm(s.gio_bat_dau)}–{hhmm(s.gio_ket_thuc)} · {s.phong ?? '—'}</div>
                            </div>
                          )
                        })}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SlotModal({ s, onClose, onChanged }: { s: TKBSlot; onClose: () => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const [hieuLucTu, setHieuLucTu] = useState(s.hieu_luc_tu)
  const [error, setError] = useState<string | null>(null)
  return (
    <Shell title={`${s.lop?.ten_lop ?? '?'} · ${THU_LABEL[s.thu]} ${hhmm(s.gio_bat_dau)}–${hhmm(s.gio_ket_thuc)}`} onClose={onClose}>
      <p className="mb-3 text-sm text-slate-600">Môn {s.lop?.mon ?? '—'} · phòng <b>{s.phong ?? '—'}</b></p>
      <Field label="Hiệu lực từ (ngày khai giảng / bắt đầu áp khung này)">
        <input type="date" value={hieuLucTu} onChange={(e) => setHieuLucTu(e.target.value)} className={inp} />
      </Field>
      <p className="mb-3 text-[12px] text-slate-400">Trước ngày này hệ thống KHÔNG sinh buổi học cho ca — đây là "công tắc khai giảng". Đổi giờ/phòng = ngừng ca này rồi xếp ca mới (giữ vết).</p>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex items-center justify-between">
        <button disabled={busy} onClick={async () => { if (!confirm('Ngừng ca này từ hôm nay?')) return; setBusy(true); try { await dongTKB(s.id, today()); onChanged() } catch (e: any) { setError(e.message); setBusy(false) } }}
          className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">Ngừng ca này</button>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button disabled={busy || hieuLucTu === s.hieu_luc_tu} onClick={async () => { setBusy(true); try { await suaHieuLucTKB(s.id, { hieu_luc_tu: hieuLucTu }); onChanged() } catch (e: any) { setError(e.message); setBusy(false) } }}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </Shell>
  )
}

function AddModal({ thu, tu, den, dsLop, onClose, onAdded }: { thu: number; tu: string; den: string; dsLop: Lop[]; onClose: () => void; onAdded: () => void }) {
  const [lopId, setLopId] = useState('')
  const [gioTu, setGioTu] = useState(tu)
  const [gioDen, setGioDen] = useState(den)
  const [phong, setPhong] = useState(ROOMS[0])
  const [hieuLucTu, setHieuLucTu] = useState(today())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function add() {
    if (!lopId) return
    setBusy(true); setError(null)
    try { await addTKB({ lop_id: lopId, thu, gio_bat_dau: gioTu, gio_ket_thuc: gioDen, phong, hieu_luc_tu: hieuLucTu, hieu_luc_den: null }); onAdded() }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Xếp ca · ${THU_LABEL[thu]} ${tu}–${den}`} onClose={onClose}>
      <Field label="Lớp">
        <SearchSelect value={lopId || null} onChange={(id) => setLopId(id ?? '')} autoFocus placeholder="Gõ tên lớp…"
          options={dsLop.filter((l) => l.trang_thai === 'dang_hoc').map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} />
      </Field>
      <Field label="Phòng">
        <div className="flex gap-1.5">
          {ROOMS.map((p) => (
            <button key={p} type="button" onClick={() => setPhong(p)}
              className={`h-9 flex-1 rounded-lg border text-[13px] font-semibold transition ${phong === p ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{p}</button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Giờ bắt đầu"><input type="time" value={gioTu} onChange={(e) => setGioTu(e.target.value)} className={inp} /></Field>
        <Field label="Giờ kết thúc"><input type="time" value={gioDen} onChange={(e) => setGioDen(e.target.value)} className={inp} /></Field>
      </div>
      <Field label="Hiệu lực từ (ngày bắt đầu áp — trước đó không sinh buổi)">
        <input type="date" value={hieuLucTu} onChange={(e) => setHieuLucTu(e.target.value)} className={inp} />
      </Field>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={add} disabled={!lopId || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Xếp ca'}</button>
      </div>
    </Shell>
  )
}
