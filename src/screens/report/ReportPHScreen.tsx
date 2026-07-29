// REPORT PHỤ HUYNH (tháng) — leaf riêng. Chọn MÔN → LỚP → HS (giống Kết quả học tập) → tháng.
// Bố cục: DỮ LIỆU bên TRÁI (bảng theo buổi + tổng quan mastery) · NHẬN XÉT bên PHẢI (3 ô + thanh mức kết luận).
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listLop, listHSCuaLop } from '../../lib/nhansu'
import { getTongQuanHS, type TongQuanHS } from '../../lib/mastery'
import { getReportBuoiHS, getBaoCaoPH, upsertBaoCaoPH, type ReportBuoiRow, type BaoCaoPH } from '../../lib/report'

const MON_CO_KHO = ['Toán', 'KHTN']
const curYM = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const shiftYM = (ym: string, delta: number) => { const [y, m] = ym.split('-').map(Number); const i = y * 12 + (m - 1) + delta; return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}` }
const NOP_LABEL: Record<string, string> = { nop_dung_han: 'Đúng hạn', nop_muon: 'Nộp muộn', xin_phep: 'Xin phép', khong_lam: 'Không làm' }
const TD_LABEL: Record<string, string> = { nghiem_tuc: 'Nghiêm túc', chua_het_suc: 'Chưa hết sức', chua_nghiem_tuc: 'Chưa nghiêm túc', chong_doi: 'Chống đối' }
const TD_CLS: Record<string, string> = { nghiem_tuc: 'text-emerald-700', chua_het_suc: 'text-amber-700', chua_nghiem_tuc: 'text-rose-700', chong_doi: 'text-rose-800 font-bold' }
const pctCls = (p: number | null) => p == null ? 'text-slate-300' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-700'
const fmtNgay = (iso: string) => { const d = new Date(iso + 'T00:00:00'); return isNaN(+d) ? iso : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) }
// Thanh mức kết luận (5 bậc, tốt → cần lưu ý)
export const KET_LUAN_MUC = [
  { key: 'vuot_bac', label: 'Tiến bộ vượt bậc', emoji: '🚀', dot: 'bg-emerald-500', sel: 'bg-emerald-600 text-white ring-emerald-600' },
  { key: 'tien_bo', label: 'Con đang tiến bộ', emoji: '📈', dot: 'bg-green-400', sel: 'bg-green-500 text-white ring-green-500' },
  { key: 'on_dinh', label: 'Con đang ổn định', emoji: '⚖️', dot: 'bg-sky-400', sel: 'bg-sky-500 text-white ring-sky-500' },
  { key: 'di_xuong', label: 'Con đang đi xuống', emoji: '📉', dot: 'bg-amber-400', sel: 'bg-amber-500 text-white ring-amber-500' },
  { key: 'can_ho_tro', label: 'Con đang cần hỗ trợ', emoji: '🆘', dot: 'bg-rose-400', sel: 'bg-rose-500 text-white ring-rose-500' },
] as const

export default function ReportPHScreen() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [hsId, setHsId] = useState<string | null>(null)
  const [hsOpts, setHsOpts] = useState<Opt[]>([])
  const [ym, setYm] = useState(curYM())

  useEffect(() => {
    setLopId(null); setHsId(null)
    listLop().then((ls) => setLopOpts(ls.filter((l: any) => l.mon === mon).map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))).catch(() => setLopOpts([]))
  }, [mon])
  useEffect(() => {
    setHsId(null); setHsOpts([])
    if (!lopId) return
    listHSCuaLop(lopId).then((rows: any[]) => setHsOpts(rows.map((r) => r.hoc_sinh).filter(Boolean).sort((a: any, b: any) => String(a.ho_ten).localeCompare(String(b.ho_ten), 'vi')).map((h: any) => ({ id: h.id, label: h.ho_ten, sub: h.ma_hs ?? undefined })))).catch(() => setHsOpts([]))
  }, [lopId])

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const [yy, mm] = ym.split('-')
  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Report phụ huynh</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-44"><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
        <div className="w-60"><SearchSelect value={hsId} onChange={setHsId} options={hsOpts} placeholder={lopId ? 'Chọn học sinh…' : 'Chọn lớp trước'} avatars /></div>
        <div className="ml-2 flex items-center gap-0.5 rounded-md ring-1 ring-slate-200">
          <button onClick={() => setYm(shiftYM(ym, -1))} className="h-7 rounded-l-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng trước">‹</button>
          <span className="min-w-[92px] text-center text-[13px] font-semibold tabular-nums text-slate-700">Tháng {Number(mm)}/{yy}</span>
          <button onClick={() => setYm(shiftYM(ym, +1))} className="h-7 rounded-r-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng sau">›</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!hsId ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn lớp rồi chọn học sinh để xem report.</div>
        ) : <ReportBody key={hsId + mon + ym} hsId={hsId} mon={mon} ym={ym} hsName={hsOpts.find((o) => o.id === hsId)?.label ?? ''} lopTen={lopOpts.find((o) => o.id === lopId)?.label ?? ''} />}
      </div>
    </div>
  )
}

function ReportBody({ hsId, mon, ym, hsName, lopTen }: { hsId: string; mon: string; ym: string; hsName: string; lopTen: string }) {
  const [rows, setRows] = useState<ReportBuoiRow[] | null>(null)
  const [tq, setTq] = useState<TongQuanHS | null>(null)
  const [loading, setLoading] = useState(true)
  const [anh, setAnh] = useState(false)
  useEffect(() => {
    setLoading(true)
    Promise.all([getReportBuoiHS(hsId, mon, ym), getTongQuanHS(hsId, mon)])
      .then(([r, t]) => { setRows(r); setTq(t) }).catch(() => { setRows([]); setTq(null) }).finally(() => setLoading(false))
  }, [hsId, mon, ym])
  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>
  const missCount = (rows ?? []).filter((r) => r.btvnTrangThai === 'khong_lam' || r.btvnTrangThai === 'xin_phep').length
  return (
    <>
    <div className="mb-3 flex justify-end">
      <button onClick={() => setAnh(true)} className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">📸 Ảnh gửi phụ huynh</button>
    </div>
    {anh && tq && <PhAnhModal hsId={hsId} mon={mon} ym={ym} hsName={hsName} lopTen={lopTen} tq={tq} missCount={missCount} onClose={() => setAnh(false)} />}
    <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
      {/* ── TRÁI: SỐ LIỆU ── */}
      <div className="space-y-5">
        {tq && <TongQuanCards tq={tq} missCount={missCount} />}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Chi tiết theo buổi · tháng {Number(ym.split('-')[1])}</h3>
          {!rows || rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">Không có buổi nào trong tháng này.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-[13px]">
                <thead><tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-4 py-2 text-left font-semibold">Buổi</th>
                  <th className="px-3 py-2 text-center font-semibold">ET</th>
                  <th className="px-3 py-2 text-center font-semibold">BTVN</th>
                  <th className="px-4 py-2 text-left font-semibold">Thái độ BTVN</th>
                </tr></thead>
                <tbody>{rows.map((r) => <BuoiRow key={r.buoiId} r={r} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* ── PHẢI: NHẬN XÉT ── */}
      <div className="xl:sticky xl:top-0 xl:self-start"><NhanXet hsId={hsId} mon={mon} ym={ym} /></div>
    </div>
    </>
  )
}

function BuoiRow({ r }: { r: ReportBuoiRow }) {
  const btvnCell = r.btvnTrangThai === 'khong_lam' || r.btvnTrangThai === 'xin_phep'
    ? <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[12px] font-semibold text-rose-700">{NOP_LABEL[r.btvnTrangThai] ?? 'Không làm'}</span>
    : r.btvnPct != null ? <span className={`font-bold tabular-nums ${pctCls(r.btvnPct)}`}>{r.btvnPct}%</span>
    : r.btvnTrangThai ? <span className="text-[12px] text-slate-500">{NOP_LABEL[r.btvnTrangThai] ?? r.btvnTrangThai}</span>
    : <span className="text-slate-300">—</span>
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-1.5 font-medium text-slate-700">{fmtNgay(r.ngay)}</td>
      <td className="px-3 py-1.5 text-center">{r.vang ? <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[12px] font-semibold text-rose-700">Vắng</span> : r.etPct != null ? <span className={`font-bold tabular-nums ${pctCls(r.etPct)}`}>{r.etPct}%</span> : <span className="text-slate-300">—</span>}</td>
      <td className="px-3 py-1.5 text-center">{btvnCell}</td>
      <td className="px-4 py-1.5">{r.btvnThaiDo ? <span className={`text-[12px] ${TD_CLS[r.btvnThaiDo] ?? 'text-slate-600'}`}>{TD_LABEL[r.btvnThaiDo] ?? r.btvnThaiDo}</span> : <span className="text-slate-300">—</span>}</td>
    </tr>
  )
}

type Bucket = { pct: number | null; n: number }
function tongPct(a: Bucket, b: Bucket): number | null {
  const parts = [a, b].filter((x) => x.pct != null && x.n > 0)
  if (!parts.length) return null
  const N = parts.reduce((s, x) => s + x.n, 0)
  return Math.round(parts.reduce((s, x) => s + (x.pct as number) * x.n, 0) / N)
}
function NumCol({ label, pct, big }: { label: string; pct: number | null; big?: boolean }) {
  return (
    <div className="flex-1 px-3 text-center first:pl-0">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`font-extrabold tabular-nums ${big ? 'text-[26px]' : 'text-[20px]'} ${pctCls(pct)}`}>{pct == null ? '—' : pct + '%'}</div>
    </div>
  )
}
function ActCard({ icon, ten, cb, nc, warn }: { icon: string; ten: string; cb: Bucket; nc: Bucket; warn?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-[14px] font-bold text-slate-700">{icon} {ten}</div>
      <div className="flex divide-x divide-slate-100">
        <NumCol label="Tổng" pct={tongPct(cb, nc)} big />
        <NumCol label="Cơ bản" pct={cb.pct} />
        <NumCol label="Nâng cao" pct={nc.pct} />
      </div>
      {warn && <div className="mt-2.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700">⚠ {warn}</div>}
    </div>
  )
}
function TongQuanCards({ tq, missCount }: { tq: TongQuanHS; missCount: number }) {
  const h = tq.hoanThanh.toanBo.etMt, a = tq.hoatDong
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2.5 text-[14px] font-bold text-slate-700">🗺️ Bản đồ kiến thức</div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg bg-emerald-50 px-3 py-1 text-[13px] font-bold text-emerald-700">{h.dat} dạng đạt</span>
          <span className="rounded-lg bg-amber-50 px-3 py-1 text-[13px] font-bold text-amber-700">{h.can_luyen} cần luyện</span>
          <span className="rounded-lg bg-rose-50 px-3 py-1 text-[13px] font-bold text-rose-700">{h.yeu} yếu</span>
        </div>
        <div className="mt-1.5 text-[11px] text-slate-400">Đã tính cả bài tập về nhà và bổ trợ</div>
      </div>
      <ActCard icon="📝" ten="Test cuối giờ (ET)" cb={a.etCoBan} nc={a.etNangCao} />
      <ActCard icon="🏠" ten="Bài tập về nhà" cb={a.btvnCoBan} nc={a.btvnNangCao} warn={missCount > 0 ? `Chưa hoàn thành BTVN ${missCount} lần trong tháng này` : undefined} />
      <ActCard icon="📅" ten="Test tháng (MT)" cb={a.mtCoBan} nc={a.mtNangCao} warn={tq.diem.mt.tb != null ? `Điểm MT trung bình: ${tq.diem.mt.tb} · Điểm trường: ${tq.diem.truong.tb ?? '—'}` : undefined} />
    </div>
  )
}

const NX_FIELDS: { key: keyof BaoCaoPH; label: string; ph: string }[] = [
  { key: 'thai_do', label: 'Thái độ học tập', ph: 'Thái độ, chuyên cần, tinh thần học tập trong tháng…' },
  { key: 'kien_thuc_ky_nang', label: 'Kiến thức & Kĩ năng', ph: 'Mức nắm kiến thức, kĩ năng làm bài, mạnh/yếu…' },
]
function NhanXet({ hsId, mon, ym }: { hsId: string; mon: string; ym: string }) {
  const [val, setVal] = useState<BaoCaoPH>({ thai_do: null, kien_thuc_ky_nang: null, ket_luan: null, ket_luan_muc: null })
  const [saved, setSaved] = useState<string | null>(null)
  useEffect(() => { getBaoCaoPH(hsId, mon, ym).then(setVal).catch(() => {}) }, [hsId, mon, ym])
  const save = async (patch: Partial<BaoCaoPH>, tag: string) => {
    setVal((p) => ({ ...p, ...patch }))
    try { await upsertBaoCaoPH(hsId, mon, ym, patch); setSaved(tag); setTimeout(() => setSaved((s) => (s === tag ? null : s)), 1500) } catch { /* ignore */ }
  }
  const box = 'w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-[13px] leading-relaxed focus:border-indigo-300 focus:bg-white focus:outline-none'
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Nhận xét của giáo viên</h3>
      <div className="space-y-3">
        {NX_FIELDS.map((f) => (
          <div key={f.key} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-700">{f.label}</span>
              {saved === f.key && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
            </div>
            <textarea defaultValue={val[f.key] as string ?? ''} onBlur={(e) => save({ [f.key]: e.target.value.trim() || null }, f.key)} placeholder={f.ph} rows={4} className={box} />
          </div>
        ))}
        {/* KẾT LUẬN: thanh mức + chữ */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-700">Kết luận</span>
            {saved === 'ket_luan' && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
          </div>
          <div className="mb-2 flex flex-col gap-1">
            {KET_LUAN_MUC.map((m) => (
              <button key={m.key} onClick={() => save({ ket_luan_muc: m.key }, 'muc')}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium ring-1 transition ${val.ket_luan_muc === m.key ? m.sel : 'bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100'}`}>
                <span>{m.emoji}</span>{m.label}
              </button>
            ))}
          </div>
          <textarea defaultValue={val.ket_luan ?? ''} onBlur={(e) => save({ ket_luan: e.target.value.trim() || null }, 'ket_luan')} placeholder="Kết luận chung + định hướng tháng tới…" rows={3} className={box} />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">Tự lưu khi rời ô / chọn mức. {mon} · tháng {Number(ym.split('-')[1])}/{ym.split('-')[0]}.</p>
    </div>
  )
}

// ── ẢNH GỬI PHỤ HUYNH — thẻ inline-hex (né oklch Tailwind v4), layout kiểu tab Kết quả app PH ──
const MUC_HEX: Record<string, { bg: string; fg: string; emoji: string; label: string }> = {
  vuot_bac: { bg: '#ecfdf5', fg: '#047857', emoji: '🚀', label: 'Tiến bộ vượt bậc' },
  tien_bo: { bg: '#f0fdf4', fg: '#15803d', emoji: '📈', label: 'Con đang tiến bộ' },
  on_dinh: { bg: '#f0f9ff', fg: '#0369a1', emoji: '⚖️', label: 'Con đang ổn định' },
  di_xuong: { bg: '#fffbeb', fg: '#b45309', emoji: '📉', label: 'Con đang đi xuống' },
  can_ho_tro: { bg: '#fff1f2', fg: '#be123c', emoji: '🆘', label: 'Con đang cần hỗ trợ' },
}
const s10 = (pct: number | null) => pct == null ? '—' : (pct / 10).toFixed(1)
const hexPct = (pct: number | null) => pct == null ? '#cbd5e1' : pct >= 80 ? '#059669' : pct >= 50 ? '#d97706' : '#e11d48'

function NxBlock({ ten, noi }: { ten: string; noi: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 14, padding: '10px 14px', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', marginBottom: 3 }}>{ten}</div>
      <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{noi}</div>
    </div>
  )
}

function PhAnhModal({ hsId, mon, ym, hsName, lopTen, tq, missCount, onClose }: { hsId: string; mon: string; ym: string; hsName: string; lopTen: string; tq: TongQuanHS; missCount: number; onClose: () => void }) {
  const [bc, setBc] = useState<BaoCaoPH>({ thai_do: null, kien_thuc_ky_nang: null, ket_luan: null, ket_luan_muc: null })
  const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => { getBaoCaoPH(hsId, mon, ym).then(setBc).catch(() => {}) }, [hsId, mon, ym])

  function handleCopy() {
    const el = cardRef.current; if (!el) return
    const cardHTML = el.outerHTML
    const fname = `Report_${hsName.replace(/\s+/g, '')}_${ym}.png`
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
      + '<title>Report ' + hsName + '</title><scr' + 'ipt src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></scr' + 'ipt>'
      + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:12px;display:flex;flex-direction:column;align-items:center}'
      + '.btn{width:100%;max-width:400px;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;background:#16a34a;color:#fff;margin-bottom:10px}.btn:hover{opacity:.9}'
      + '#msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px}#c{background:#fff;border-radius:18px;overflow:hidden}</style></head><body>'
      + '<button class="btn" onclick="cp()">📋 Copy ảnh (paste vào Zalo)</button><div id="c">' + cardHTML + '</div><p id="msg"></p>'
      + '<scr' + 'ipt>async function cp(){var m=document.getElementById("msg");m.textContent="⏳ Đang xử lý...";try{var n=document.getElementById("c");var cv=await html2canvas(n,{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false,width:n.scrollWidth,height:n.scrollHeight});cv.toBlob(async function(b){try{await navigator.clipboard.write([new ClipboardItem({"image/png":b})]);m.textContent="✅ Đã copy! Ctrl+V vào Zalo.";}catch(e){var u=URL.createObjectURL(b);var a=document.createElement("a");a.href=u;a.download=' + JSON.stringify(fname) + ';a.click();URL.revokeObjectURL(u);m.textContent="✅ Đã tải ảnh!";}},"image/png");}catch(e){m.textContent="Lỗi: "+e.message;}}</scr' + 'ipt></body></html>'
    const p = window.open('', '_blank', 'width=460,height=900,scrollbars=yes')
    if (!p) { alert('Trình duyệt chặn popup. Bật "Allow pop-ups" cho site này.'); return }
    p.document.write(html); p.document.close()
  }

  const muc = bc.ket_luan_muc ? MUC_HEX[bc.ket_luan_muc] : null
  const h = tq.hoanThanh.toanBo.etMt, a = tq.hoatDong
  const col = (label: string, pct: number | null, big?: boolean) => (
    <div style={{ flex: 1, textAlign: 'center', borderLeft: big ? 'none' : '1px solid #f1f5f9' }}>
      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .4 }}>{label}</div>
      <div style={{ fontSize: big ? 27 : 20, fontWeight: 800, color: hexPct(pct), lineHeight: 1.15 }}>{s10(pct)}</div>
    </div>
  )
  const act = (ten: string, emoji: string, cb: Bucket, nc: Bucket, warn?: string) => (
    <div style={{ background: '#fff', borderRadius: 16, padding: 14, marginTop: 10, boxShadow: '0 1px 3px rgba(15,23,42,.07)' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 10 }}>{emoji} {ten}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>{col('Tổng', tongPct(cb, nc), true)}{col('Cơ bản', cb.pct)}{col('Nâng cao', nc.pct)}</div>
      {warn ? <div style={{ fontSize: 11, color: '#b45309', marginTop: 9, background: '#fffbeb', borderRadius: 9, padding: '6px 10px', fontWeight: 600 }}>⚠ {warn}</div> : null}
    </div>
  )
  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-900/70" onClick={onClose}>
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold">Ảnh report gửi phụ huynh — {hsName}</span>
        <button onClick={handleCopy} className="ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500">📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div ref={cardRef} style={{ width: 380, margin: '0 auto', background: '#fff', borderRadius: 20, overflow: 'hidden', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif", boxShadow: '0 10px 30px rgba(15,23,42,.12)' }}>
          {/* HEADER */}
          <div style={{ background: 'linear-gradient(135deg,#4338ca 0%,#6d28d9 55%,#7c3aed 100%)', color: '#fff', padding: '18px 20px 20px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, opacity: .85 }}>BKDEMY · BÁO CÁO HỌC TẬP THÁNG</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,.22)', border: '2px solid rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 800 }}>{hsName.trim().slice(-1) || '?'}</div>
              <div><div style={{ fontSize: 18, fontWeight: 800, letterSpacing: .2 }}>{hsName}</div><div style={{ fontSize: 12, opacity: .92, marginTop: 1 }}>Lớp {lopTen} · {mon} · Tháng {Number(ym.split('-')[1])}/{ym.split('-')[0]}</div></div>
            </div>
          </div>
          <div style={{ padding: 16, background: '#f1f5f9' }}>
            {/* KẾT LUẬN (nổi bật) */}
            {muc ? <div style={{ background: '#fff', borderRadius: 16, padding: '16px 14px', marginBottom: 12, textAlign: 'center', borderTop: `4px solid ${muc.fg}`, boxShadow: '0 1px 3px rgba(15,23,42,.07)' }}>
              <div style={{ fontSize: 38, lineHeight: 1 }}>{muc.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: muc.fg, marginTop: 6 }}>{muc.label}</div>
            </div> : null}
            {bc.ket_luan ? <NxBlock ten="💬 Kết luận" noi={bc.ket_luan} /> : null}
            {bc.thai_do ? <NxBlock ten="🎯 Thái độ học tập" noi={bc.thai_do} /> : null}
            {bc.kien_thuc_ky_nang ? <NxBlock ten="📚 Kiến thức & Kĩ năng" noi={bc.kien_thuc_ky_nang} /> : null}
            {/* SỐ LIỆU */}
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, color: '#64748b', margin: '16px 2px 2px' }}>KẾT QUẢ HỌC TẬP</div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 14, marginTop: 8, boxShadow: '0 1px 3px rgba(15,23,42,.07)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 9 }}>🗺️ Bản đồ kiến thức</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                <span style={{ background: '#ecfdf5', color: '#047857', borderRadius: 9, padding: '4px 11px', fontSize: 12.5, fontWeight: 700 }}>{h.dat} dạng đạt</span>
                <span style={{ background: '#fffbeb', color: '#b45309', borderRadius: 9, padding: '4px 11px', fontSize: 12.5, fontWeight: 700 }}>{h.can_luyen} cần luyện</span>
                <span style={{ background: '#fff1f2', color: '#be123c', borderRadius: 9, padding: '4px 11px', fontSize: 12.5, fontWeight: 700 }}>{h.yeu} yếu</span>
              </div>
              <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 7 }}>Đã tính cả bài tập về nhà và bổ trợ · Thang điểm /10</div>
            </div>
            {act('Test cuối giờ', '📝', a.etCoBan, a.etNangCao)}
            {act('Bài tập về nhà', '🏠', a.btvnCoBan, a.btvnNangCao, missCount > 0 ? `Chưa hoàn thành BTVN ${missCount} lần trong tháng này` : undefined)}
            {act('Test tháng', '📅', a.mtCoBan, a.mtNangCao)}
            <div style={{ textAlign: 'center', fontSize: 10.5, color: '#94a3b8', marginTop: 16, fontWeight: 600 }}>BKdemy · Đồng hành cùng con trên hành trình học tập 💜</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
