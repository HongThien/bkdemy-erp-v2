// BÁO CÁO HỌC KÌ (spec-bao-cao-ky.md, Thùy chốt 04/11) — chế độ "Học kì" của màn Report phụ huynh.
// KHÁC hẳn report tháng. 5 PHẦN (Thùy 04/11): đánh giá chủ đề→chuyên đề · kết quả thi + hạng · thái độ học tập (chuyên cần + BTVN) ·
// nhận xét + kế hoạch + điểm năng lực (GV nhập) · phụ lục điểm thi toàn khối. Số liệu = fn_bc_ky_tinh (nháp) / snapshot (đã công bố).
// ERP chỉ NHẬP + TÍNH + CHỤP SNAPSHOT; PDF gửi PH dựng ngoài ERP từ snapshot (spec A8).
import { useEffect, useState } from 'react'
import {
  listKyHoc, themKyHoc, xemBcKy, getBcKyNhap, luuBcKyNhap, congBoBcKy, moLaiBcKy,
  BC_KY_NHAP_TRONG, type KyHoc, type BcKyData, type BcKyNhap, type BcKyDonVi, type BcKyChuDe,
} from '../../lib/baoCaoKy'

const pctCls = (p: number | null) => p == null ? 'text-slate-400' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-700'
const barCls = (p: number | null) => p == null ? 'bg-slate-200' : p >= 80 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-500' : 'bg-rose-500'
const thangNhan = (ym: string) => { const [y, m] = ym.split('-'); return `${Number(m)}/${y}` }
const ddmm = (iso: string) => { const [, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}` }
const so1 = (v: number | null | undefined) => v == null ? '—' : Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 1 })

// ── Chọn kì (+ tạo kì — DB chỉ cho admin hệ thống) ──
export function ChonKy({ kyId, onChange }: { kyId: string | null; onChange: (id: string | null) => void }) {
  const [ds, setDs] = useState<KyHoc[]>([])
  const [tao, setTao] = useState(false)
  const [f, setF] = useState({ ten: '', tu: '', den: '' })
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { listKyHoc().then((k) => { setDs(k); if (!kyId && k[0]) onChange(k[0].id) }).catch(() => setDs([])) }, []) // eslint-disable-line
  async function luu() {
    setLoi(null)
    try { const k = await themKyHoc(f.ten.trim(), f.tu, f.den); setDs((d) => [k, ...d]); onChange(k.id); setTao(false); setF({ ten: '', tu: '', den: '' }) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  return (
    <div className="relative flex items-center gap-1.5">
      <select value={kyId ?? ''} onChange={(e) => onChange(e.target.value || null)} className="h-7 rounded-md border border-slate-200 px-2 text-[13px] font-semibold text-slate-700">
        {ds.length === 0 && <option value="">— Chưa có kì —</option>}
        {ds.map((k) => <option key={k.id} value={k.id}>{k.ten} ({thangNhan(k.tu_thang)} → {thangNhan(k.den_thang)})</option>)}
      </select>
      <button onClick={() => setTao((v) => !v)} className="h-7 rounded-md px-2 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50" title="Tạo kì mới (chỉ admin)">＋ Kì</button>
      {tao && (
        <div className="absolute left-0 top-9 z-30 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 text-[13px] font-semibold text-slate-700">Kì mới</div>
          <input value={f.ten} onChange={(e) => setF({ ...f, ten: e.target.value })} placeholder="Tên, vd HK1 2026–27" className="mb-2 h-8 w-full rounded-md border border-slate-200 px-2 text-[13px]" />
          <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-500">
            <input type="month" value={f.tu} onChange={(e) => setF({ ...f, tu: e.target.value })} className="h-8 flex-1 rounded-md border border-slate-200 px-1 text-[12px]" />→
            <input type="month" value={f.den} onChange={(e) => setF({ ...f, den: e.target.value })} className="h-8 flex-1 rounded-md border border-slate-200 px-1 text-[12px]" />
          </div>
          {loi && <p className="mb-2 text-[11px] text-rose-600">{loi}</p>}
          <div className="flex justify-end gap-2">
            <button onClick={() => setTao(false)} className="rounded-md px-3 py-1 text-[12px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <button disabled={!f.ten.trim() || !f.tu || !f.den} onClick={() => void luu()} className="rounded-md bg-indigo-600 px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-40">Tạo</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Thân báo cáo kì của 1 HS ──
export function BaoCaoKyBody({ hsId, mon, kyId, onTrangThai }: { hsId: string; mon: string; kyId: string; onTrangThai: (hsId: string, tt: 'cong_bo' | 'nhap') => void }) {
  const [data, setData] = useState<BcKyData | null>(null)
  const [congBoAt, setCongBoAt] = useState<string | null>(null)
  const [nhap, setNhap] = useState<BcKyNhap>(BC_KY_NHAP_TRONG)
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    setData(null); setLoading(true); setLoi(null)
    Promise.all([xemBcKy(hsId, mon, kyId), getBcKyNhap(hsId, mon, kyId)])
      .then(([x, n]) => { setData(x.du_lieu); setCongBoAt(x.cong_bo_at); setNhap(n) })
      .catch((e) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false))
  }, [hsId, mon, kyId])
  if (loading) return <p className="text-sm text-slate-500">Đang tính báo cáo kì…</p>
  if (loi || !data) return <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{loi ?? 'Không tải được báo cáo.'}</p>
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <XemTruocKy d={data} congBoAt={congBoAt} />
      <div className="xl:sticky xl:top-0 xl:self-start">
        <NhapKy hsId={hsId} mon={mon} kyId={kyId} nhap={nhap} congBoAt={congBoAt}
          // vá tại chỗ (không tính lại cả báo cáo): phần nhập hiện ngay trên bản xem trước
          onDaLuu={(n) => { setNhap(n); setData((d) => d && { ...d, nang_luc: { diem: n.diem_du_doan, sai_so: n.sai_so }, nhan_xet: n.nhan_xet, ke_hoach: n.ke_hoach }); onTrangThai(hsId, 'nhap') }}
          onCongBo={async () => { const x = await xemBcKy(hsId, mon, kyId); setData(x.du_lieu); setCongBoAt(x.cong_bo_at); setNhap((n) => ({ ...n, cong_bo_at: x.cong_bo_at })); onTrangThai(hsId, 'cong_bo') }}
          onMoLai={async () => { const x = await xemBcKy(hsId, mon, kyId); setData(x.du_lieu); setCongBoAt(null); setNhap((n) => ({ ...n, cong_bo_at: null })); onTrangThai(hsId, 'nhap') }} />
      </div>
    </div>
  )
}

function NhapKy({ hsId, mon, kyId, nhap, congBoAt, onDaLuu, onCongBo, onMoLai }: {
  hsId: string; mon: string; kyId: string; nhap: BcKyNhap; congBoAt: string | null
  onDaLuu: (n: BcKyNhap) => void; onCongBo: () => Promise<void>; onMoLai: () => Promise<void>
}) {
  const [diem, setDiem] = useState(nhap.diem_du_doan?.toString() ?? '')
  const [saiSo, setSaiSo] = useState(nhap.sai_so?.toString() ?? '')
  const [nx, setNx] = useState(nhap.nhan_xet ?? '')
  const [kh, setKh] = useState(nhap.ke_hoach ?? '')
  const [saved, setSaved] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const khoa = !!congBoAt
  const soOrNull = (s: string) => { const t = s.trim().replace(',', '.'); if (!t) return null; const v = Number(t); return Number.isFinite(v) ? v : NaN }
  async function luu(tag: string) {
    const d = soOrNull(diem), ss = soOrNull(saiSo)
    if (Number.isNaN(d) || Number.isNaN(ss)) { setLoi('Điểm và sai số phải là số.'); return }
    if (d != null && (d < 0 || d > 10)) { setLoi('Điểm dự đoán trong khoảng 0–10.'); return }
    if (ss != null && (ss < 0 || ss > 10)) { setLoi('Sai số trong khoảng 0–10.'); return }
    const n: BcKyNhap = { ...nhap, diem_du_doan: d, sai_so: ss, nhan_xet: nx.trim() ? nx : null, ke_hoach: kh.trim() ? kh : null }
    if (n.diem_du_doan === nhap.diem_du_doan && n.sai_so === nhap.sai_so && n.nhan_xet === nhap.nhan_xet && n.ke_hoach === nhap.ke_hoach) return
    setLoi(null)
    try { await luuBcKyNhap(hsId, mon, kyId, { diem_du_doan: n.diem_du_doan, sai_so: n.sai_so, nhan_xet: n.nhan_xet, ke_hoach: n.ke_hoach }); onDaLuu(n); setSaved(tag); setTimeout(() => setSaved((s) => (s === tag ? null : s)), 1500) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  const du = soOrNull(diem) != null && soOrNull(saiSo) != null && !!nx.trim()
  async function chay(fn: () => Promise<void>) { setBusy(true); setLoi(null); try { await fn() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) } }
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">Giáo viên nhập</h3>
        {khoa
          ? <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">✓ Đã công bố {new Date(congBoAt!).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
          : <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Nháp — phụ huynh chưa thấy</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-[12px] text-slate-500">Điểm dự đoán (0–10)
          <input value={diem} disabled={khoa} onChange={(e) => setDiem(e.target.value)} onBlur={() => void luu('diem')} inputMode="decimal" className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-[14px] font-semibold text-slate-800 disabled:bg-slate-50" />
        </label>
        <label className="text-[12px] text-slate-500">Sai số (±)
          <input value={saiSo} disabled={khoa} onChange={(e) => setSaiSo(e.target.value)} onBlur={() => void luu('saiso')} inputMode="decimal" className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-[14px] font-semibold text-slate-800 disabled:bg-slate-50" />
        </label>
      </div>
      <label className="block text-[12px] text-slate-500">Nhận xét của giáo viên
        <textarea value={nx} disabled={khoa} onChange={(e) => setNx(e.target.value)} onBlur={() => void luu('nx')} rows={6} className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] leading-relaxed text-slate-800 disabled:bg-slate-50" />
      </label>
      <label className="block text-[12px] text-slate-500">Kế hoạch cải thiện
        <textarea value={kh} disabled={khoa} onChange={(e) => setKh(e.target.value)} onBlur={() => void luu('kh')} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] leading-relaxed text-slate-800 disabled:bg-slate-50" />
      </label>
      {loi && <p className="rounded-md bg-rose-50 px-2 py-1 text-[12px] text-rose-700">{loi}</p>}
      <div className="flex items-center gap-2">
        {khoa
          ? <button disabled={busy} onClick={() => void chay(async () => { await moLaiBcKy(hsId, mon, kyId); await onMoLai() })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Mở lại để sửa</button>
          : <button disabled={busy || !du} onClick={() => void chay(async () => { await congBoBcKy(hsId, mon, kyId); await onCongBo() })} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">✓ Chốt &amp; công bố</button>}
        {saved && <span className="text-[11px] text-emerald-600">Đã lưu</span>}
      </div>
      <p className="text-[11px] text-slate-400">{khoa
        ? 'Đang hiện bản ĐÓNG BĂNG lúc công bố — số liệu không tự đổi. Mở lại để sửa rồi công bố lại.'
        : 'Tự lưu khi rời ô. Công bố cần đủ điểm dự đoán, sai số và nhận xét; lúc công bố hệ thống chụp lại toàn bộ số liệu.'}</p>
    </div>
  )
}

// ── Bản xem trước — 5 PHẦN (Thùy 04/11 duyệt lại bố cục): ① Đánh giá (chủ đề = card, chuyên đề = dòng) · ② Kết quả thi
// (1 bảng + đồ thị 2 đường) · ③ Thái độ học tập (chuyên cần + BTVN) · ④ Nhận xét GV + kế hoạch + điểm năng lực · ⑤ Phụ lục
// điểm thi toàn khối. Mọi số đọc từ jsonb (fn_bc_ky_tinh / snapshot) — ở đây chỉ hiển thị.
const MAU_EM = '#4f46e5', MAU_TB = '#f97316'
function Phan({ so, ten, mo, children }: { so: number; ten: string; mo?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-baseline gap-3 border-b border-slate-100 px-5 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center self-center rounded-full bg-indigo-600 text-[13px] font-bold text-white">{so}</span>
        <h2 className="text-[16px] font-bold text-slate-800">{ten}</h2>
        {mo && <span className="text-[12px] text-slate-400">{mo}</span>}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}
function DongChuyenDe({ u }: { u: BcKyDonVi }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="min-w-0 flex-1 text-[13px] leading-snug text-slate-700">{u.ten}
        <small className="block text-[10.5px] text-slate-400">{u.n === 0 ? 'chưa đo' : `${u.n} lần đánh giá${u.n < u.n_toi_da / 2 ? '*' : ''}`}</small>
      </div>
      <div className="h-3 w-[72px] shrink-0 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${barCls(u.p)}`} style={{ width: `${u.p ?? 0}%` }} /></div>
      <b className={`w-[42px] shrink-0 text-right text-[13px] tabular-nums ${pctCls(u.p)}`}>{u.p == null ? '—' : `${u.p}%`}</b>
    </div>
  )
}
// Chủ đề hiện gọn (tên · % · thanh); chuyên đề chỉ mở khi bấm "Xem chi tiết" (Thùy 04/11).
function CardChuDe({ cd }: { cd: BcKyChuDe }) {
  const [mo, setMo] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="px-3.5 pb-2.5 pt-3">
        <div className="flex items-center gap-3">
          <h3 className="min-w-0 flex-1 text-[14px] font-bold leading-snug text-slate-800">{cd.ten}</h3>
          <span className={`rounded-lg px-2 py-0.5 text-[13px] font-extrabold tabular-nums ${cd.p == null ? 'bg-slate-100 text-slate-400' : cd.p >= 80 ? 'bg-emerald-100 text-emerald-700' : cd.p >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{cd.p == null ? 'chưa đo' : `${cd.p}%`}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${barCls(cd.p)}`} style={{ width: `${cd.p ?? 0}%` }} /></div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">{cd.n === 0 ? 'chưa có lần đánh giá trong 45 ngày cuối kì' : `${cd.n} lần đánh giá${cd.n < cd.n_toi_da / 2 ? ' · độ tin còn thấp' : ''}`}</span>
          {cd.chuyen_de.length > 0 && (
            <button onClick={() => setMo((v) => !v)} className="rounded-md px-2 py-0.5 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50">
              {mo ? 'Thu gọn ▴' : `Xem chi tiết (${cd.chuyen_de.length}) ▾`}
            </button>
          )}
        </div>
      </div>
      {mo && (
        <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/60 px-3.5 py-1">
          {cd.chuyen_de.map((u) => <DongChuyenDe key={u.ma} u={u} />)}
        </div>
      )}
    </div>
  )
}
function BieuDoThi({ thi }: { thi: BcKyData['thi'] }) {
  if (!thi.length) return <p className="text-[13px] text-slate-400">Chưa có lần thi nào trong kì.</p>
  const W = 340, H = 210, L = 24, R = 8, T = 20, B = 26, PAD = 22 // khung vẽ cỡ điện thoại ⇒ chữ không bị thu nhỏ
  const x = (i: number) => thi.length === 1 ? (L + W - R) / 2 : L + PAD + (i * (W - L - R - 2 * PAD)) / (thi.length - 1)
  const y = (v: number) => T + (1 - v / 10) * (H - T - B)
  const duong = (k: 'diem' | 'tb') => thi.map((t, i) => `${x(i)},${y(t[k])}`).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-[460px]">
        {[0, 2, 4, 6, 8, 10].map((v) => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e2e8f0" /><text x={L - 7} y={y(v) + 3} fontSize="10" textAnchor="end" fill="#94a3b8">{v}</text></g>)}
        <polyline points={duong('tb')} fill="none" stroke={MAU_TB} strokeWidth="3" strokeLinejoin="round" />
        <polyline points={duong('diem')} fill="none" stroke={MAU_EM} strokeWidth="3" strokeLinejoin="round" />
        {thi.map((t, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(t.tb)} r="4" fill={MAU_TB} />
            <circle cx={x(i)} cy={y(t.diem)} r="4.5" fill={MAU_EM} />
            <text x={x(i)} y={y(t.diem) + (t.diem >= t.tb ? -9 : 16)} fontSize="11" fontWeight="700" textAnchor="middle" fill={MAU_EM}>{so1(t.diem)}</text>
            <text x={x(i)} y={y(t.tb) + (t.diem >= t.tb ? 16 : -9)} fontSize="10.5" fontWeight="600" textAnchor="middle" fill={MAU_TB}>{so1(t.tb)}</text>
            <text x={x(i)} y={H - 9} fontSize="11" textAnchor="middle" fill="#475569">{t.nhan}</text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap gap-5 text-[12.5px] text-slate-700">
        <span className="flex items-center gap-1.5"><i className="inline-block h-1 w-5 rounded" style={{ background: MAU_EM }} />Điểm của con</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-1 w-5 rounded" style={{ background: MAU_TB }} />TB cả khối</span>
      </div>
    </div>
  )
}
function O({ so, nhan, tone }: { so: React.ReactNode; nhan: string; tone?: 'do' | 'cam' | 'xanh' }) {
  const c = tone === 'do' ? 'bg-rose-50 text-rose-700' : tone === 'cam' ? 'bg-amber-50 text-amber-700' : tone === 'xanh' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-800'
  return <div className={`rounded-xl px-3.5 py-3 ${c}`}><b className="block text-[22px] leading-tight tabular-nums">{so}</b><span className="text-[12px] opacity-80">{nhan}</span></div>
}
export function XemTruocKy({ d, congBoAt }: { d: BcKyData; congBoAt: string | null }) {
  const cc = d.thai_do.chuyen_can, bt = d.thai_do.btvn
  const nghi = cc ? cc.vang + cc.vang_phep : 0
  return (
    // 1 CỘT cho mọi nơi — app PH lẫn PDF (Thùy 04/11: "đa số PH dùng điện thoại")
    <div className="mx-auto max-w-[480px] space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-4 text-white shadow-sm">
        <small className="text-[11.5px] uppercase tracking-wider opacity-80">BK Academy · Báo cáo học kì</small>
        <h1 className="mt-0.5 text-[22px] font-bold">{d.hs.ho_ten}</h1>
        <p className="text-[13px] opacity-90">{d.mon}{d.lop.khoi ? ` ${d.lop.khoi}` : ''} · Lớp {d.lop.ten ?? '—'} · {d.ky.ten} (tháng {thangNhan(d.ky.tu_thang)} → {thangNhan(d.ky.den_thang)}){d.gv ? ` · GV ${d.gv}` : ''}</p>
      </div>

      <Phan so={1} ten="Đánh giá kiến thức" mo={`45 ngày cuối kì (${ddmm(d.danh_gia.tu)} → ${ddmm(d.danh_gia.den)}) · chủ đề ${d.danh_gia.n_chu_de} lần, chuyên đề ${d.danh_gia.n_chuyen_de} lần đánh giá gần nhất`}>
        {d.danh_gia.chu_de.length
          ? <div className="grid gap-3">{d.danh_gia.chu_de.map((cd) => <CardChuDe key={cd.ma} cd={cd} />)}</div>
          : <p className="text-[13px] text-slate-400">Chưa có lần đánh giá nào trong kì.</p>}
        <p className="mt-2 text-[11px] text-slate-400">* ít lần đánh giá — độ tin còn thấp.</p>
      </Phan>

      <Phan so={2} ten="Kết quả thi">
        <BieuDoThi thi={d.thi} />
        {d.thi.length > 0 && (
          <table className="mt-4 w-full text-[13px]">
            <thead><tr className="border-b border-slate-200 text-[11.5px] text-slate-500">
              <th className="py-1.5 text-left font-medium">Lần thi</th><th className="py-1.5 text-right font-medium">Ngày</th>
              <th className="py-1.5 text-right font-medium">Điểm</th><th className="py-1.5 text-right font-medium">TB khối</th>
              <th className="py-1.5 text-right font-medium">Chênh</th><th className="py-1.5 text-right font-medium">Hạng</th>
            </tr></thead>
            <tbody>
              {d.thi.map((t, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 font-medium">{t.nhan}</td><td className="py-2 text-right tabular-nums text-slate-500">{ddmm(t.ngay)}</td>
                  <td className="py-2 text-right font-bold tabular-nums" style={{ color: MAU_EM }}>{so1(t.diem)}</td>
                  <td className="py-2 text-right tabular-nums" style={{ color: MAU_TB }}>{so1(t.tb)}</td>
                  <td className={`py-2 text-right tabular-nums ${t.chenh >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{t.chenh >= 0 ? '+' : ''}{so1(t.chenh)}</td>
                  <td className="py-2 text-right tabular-nums">{t.hang}/{t.n_mau}</td>
                </tr>
              ))}
              {d.hang_ky && (
                <tr className="bg-indigo-50/60 font-bold">
                  <td className="py-2.5 pl-1">Cả học kì</td><td />
                  <td className="py-2.5 text-right tabular-nums" style={{ color: MAU_EM }}>{so1(d.hang_ky.diem_tb)}</td><td /><td />
                  <td className="py-2.5 pr-1 text-right tabular-nums text-indigo-700">{d.hang_ky.hang}/{d.hang_ky.tong}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {d.hang_ky && <p className="mt-2 text-[11.5px] text-slate-500">Hạng cả kì xếp theo hạng trung bình {d.hang_ky.so_lan} lần con đã thi (hạng TB {so1(d.hang_ky.hang_tb)}), trong khối {d.lop.khoi} {d.mon}. Lần không thi không tính.</p>}
      </Phan>

      <Phan so={3} ten="Thái độ học tập">
        <div className="mb-1.5 text-[11.5px] font-bold uppercase text-slate-500">Chuyên cần</div>
        {cc && cc.tong > 0
          ? <div className="grid grid-cols-2 gap-2.5">
              <O so={`${cc.co_mat}/${cc.tong}`} nhan="Buổi có mặt" tone="xanh" />
              <O so={nghi} nhan={`Buổi nghỉ${cc.vang_phep ? ` (${cc.vang_phep} có phép)` : ''}`} tone={nghi ? 'cam' : undefined} />
            </div>
          : <p className="text-[13px] text-slate-400">Chưa có buổi điểm danh nào trong kì.</p>}
        <div className="mb-1.5 mt-4 text-[11.5px] font-bold uppercase text-slate-500">Bài tập về nhà {bt && bt.tong > 0 ? <span className="font-normal normal-case text-slate-400">· {bt.tong} buổi có ghi nhận</span> : null}</div>
        {bt && bt.tong > 0
          ? <div className="grid grid-cols-2 gap-2.5">
              <O so={bt.khong_lam} nhan="Lần không làm" tone={bt.khong_lam ? 'do' : 'xanh'} />
              <O so={bt.nop_muon} nhan="Lần nộp muộn" tone={bt.nop_muon ? 'cam' : 'xanh'} />
              <O so={bt.khong_nghiem_tuc} nhan={`Lần không nghiêm túc${bt.chong_doi ? ` (${bt.chong_doi} chống đối)` : ''}`} tone={bt.khong_nghiem_tuc ? 'do' : 'xanh'} />
            </div>
          : <p className="text-[13px] text-slate-400">Chưa có ghi nhận bài tập về nhà trong kì.</p>}
      </Phan>

      <Phan so={4} ten="Nhận xét của giáo viên">
        <div className="mb-4 flex items-end gap-3 rounded-xl bg-indigo-50/60 px-4 py-3">
          <div>
            <div className="text-[11.5px] font-bold uppercase text-indigo-700">Điểm năng lực</div>
            <div className="flex items-end gap-2"><span className="text-[40px] font-extrabold leading-none text-indigo-600">{so1(d.nang_luc.diem)}</span><span className="pb-1 text-[18px] font-semibold text-slate-500">± {so1(d.nang_luc.sai_so)}</span></div>
          </div>
          <p className="pb-1 text-[12px] leading-relaxed text-slate-500">Điểm dự đoán cho kì tới và sai số do giáo viên đánh giá. Điểm càng cao là học càng tốt; sai số càng nhỏ là làm bài càng cẩn thận.</p>
        </div>
        <div className="mb-1.5 text-[11.5px] font-bold uppercase text-slate-500">Nhận xét</div>
        {d.nhan_xet ? <div className="whitespace-pre-line rounded-lg border-l-4 border-violet-600 bg-slate-50 px-3.5 py-3 text-[14px] leading-relaxed text-slate-800">{d.nhan_xet}</div> : <p className="text-[13px] text-slate-400">Giáo viên chưa nhập nhận xét.</p>}
        <div className="mb-1.5 mt-4 text-[11.5px] font-bold uppercase text-slate-500">Kế hoạch cải thiện</div>
        {d.ke_hoach ? <div className="whitespace-pre-line rounded-lg border-l-4 border-emerald-500 bg-slate-50 px-3.5 py-3 text-[14px] leading-relaxed text-slate-800">{d.ke_hoach}</div> : <p className="text-[13px] text-slate-400">Giáo viên chưa nhập kế hoạch.</p>}
        {d.gv && <p className="mt-2 text-right text-[12px] text-slate-500">— {d.gv}</p>}
      </Phan>

      <Phan so={5} ten="Phụ lục — điểm thi toàn khối" mo={`Khối ${d.lop.khoi ?? ''} ${d.mon} · ${d.phu_luc.hs.length} học sinh · xếp theo hạng trung bình`}>
        {d.phu_luc.hs.length
          ? <div className="max-h-[560px] overflow-auto rounded-lg border border-slate-200">
              <table className="w-full whitespace-nowrap text-[12px]">
                <thead className="sticky top-0 bg-slate-50"><tr className="text-[11.5px] text-slate-500">
                  <th className="px-2 py-1.5 text-right font-medium">#</th><th className="px-2 py-1.5 text-left font-medium">Học sinh</th><th className="px-2 py-1.5 text-left font-medium">Lớp</th>
                  {d.phu_luc.cot.map((c, i) => <th key={i} className="px-2 py-1.5 text-right font-medium">{c.nhan}</th>)}
                  <th className="px-2 py-1.5 text-right font-medium">Hạng TB</th><th className="px-2 py-1.5 text-right font-medium">Hạng</th>
                </tr></thead>
                <tbody>{d.phu_luc.hs.map((h, i) => (
                  <tr key={i} className={h.la_em ? 'bg-indigo-100 font-bold text-indigo-900' : 'border-t border-slate-100'}>
                    <td className="px-2 py-1.5 text-right tabular-nums text-slate-400">{i + 1}</td>
                    <td className="px-2 py-1.5">{h.ten}{h.la_em && ' ⭐'}</td><td className="px-2 py-1.5 text-slate-500">{h.lop ?? ''}</td>
                    {h.diem.map((v, j) => <td key={j} className="px-2 py-1.5 text-right tabular-nums">{v == null ? <span className="text-slate-300">—</span> : so1(v)}</td>)}
                    <td className="px-2 py-1.5 text-right tabular-nums">{so1(h.hang_tb)}</td><td className="px-2 py-1.5 text-right tabular-nums">{h.hang}</td>
                  </tr>))}</tbody>
              </table>
            </div>
          : <p className="text-[13px] text-slate-400">Chưa có lần thi nào trong kì.</p>}
        <p className="mt-2 text-[11px] text-slate-400">"—" = không thi lần đó (không tính vào hạng). Hạng TB = trung bình hạng các lần đã thi.</p>
      </Phan>

      <p className="text-center text-[11px] text-slate-400">BK Academy · Báo cáo học kì · {congBoAt ? `công bố ${new Date(congBoAt).toLocaleDateString('vi-VN')}` : `bản nháp — tính lúc ${new Date(d.tinh_luc).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`}</p>
    </div>
  )
}
