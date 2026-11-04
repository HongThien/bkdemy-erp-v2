// BÁO CÁO HỌC KÌ (spec-bao-cao-ky.md, Thùy chốt 04/11) — chế độ "Học kì" của màn Report phụ huynh.
// KHÁC hẳn report tháng: không bảng buổi / ET / BTVN / 7 chỉ số. 6 khối: điểm năng lực (GV nhập) · hoàn thành chủ đề–chuyên đề ·
// điểm các lần thi + TB lần thi · thứ hạng · chuyên cần · nhận xét + phụ lục. Số liệu = fn_bc_ky_tinh (nháp) / snapshot (đã công bố).
// ERP chỉ NHẬP + TÍNH + CHỤP SNAPSHOT; PDF gửi PH dựng ngoài ERP từ snapshot (spec A8).
import { useEffect, useState } from 'react'
import {
  listKyHoc, themKyHoc, xemBcKy, getBcKyNhap, luuBcKyNhap, congBoBcKy, moLaiBcKy,
  BC_KY_NHAP_TRONG, type KyHoc, type BcKyData, type BcKyNhap, type BcKyDonVi,
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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,460px)_1fr]">
      <XemTruocKy d={data} congBoAt={congBoAt} />
      <div className="xl:sticky xl:top-0 xl:self-start">
        <NhapKy hsId={hsId} mon={mon} kyId={kyId} nhap={nhap} congBoAt={congBoAt}
          // vá tại chỗ (không tính lại cả báo cáo): phần nhập hiện ngay trên bản xem trước
          onDaLuu={(n) => { setNhap(n); setData((d) => d && { ...d, nang_luc: { diem: n.diem_du_doan, sai_so: n.sai_so }, nhan_xet: n.nhan_xet }); onTrangThai(hsId, 'nhap') }}
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
    const n: BcKyNhap = { ...nhap, diem_du_doan: d, sai_so: ss, nhan_xet: nx.trim() ? nx : null }
    if (n.diem_du_doan === nhap.diem_du_doan && n.sai_so === nhap.sai_so && n.nhan_xet === nhap.nhan_xet) return
    setLoi(null)
    try { await luuBcKyNhap(hsId, mon, kyId, { diem_du_doan: n.diem_du_doan, sai_so: n.sai_so, nhan_xet: n.nhan_xet }); onDaLuu(n); setSaved(tag); setTimeout(() => setSaved((s) => (s === tag ? null : s)), 1500) }
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
        <textarea value={nx} disabled={khoa} onChange={(e) => setNx(e.target.value)} onBlur={() => void luu('nx')} rows={7} className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] leading-relaxed text-slate-800 disabled:bg-slate-50" />
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

// ── Bản xem trước (bố cục theo mockup docs/mockup-bao-cao-ky.html) ──
function Sec({ icon, ten, children }: { icon: string; ten: string; children: React.ReactNode }) {
  return <section className="border-b-8 border-slate-100 px-5 py-4 last:border-b-0"><h2 className="mb-3 text-[15px] font-bold text-slate-800">{icon} {ten}</h2>{children}</section>
}
function Thanh({ u, nToiDa }: { u: BcKyDonVi; nToiDa: number }) {
  return (
    <div className="my-2">
      <div className="mb-0.5 flex justify-between gap-2 text-[13px]"><span className="text-slate-700">{u.ten}</span><b className={`tabular-nums ${pctCls(u.p)}`}>{u.p == null ? 'chưa đo' : `${u.p}%`}</b></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${barCls(u.p)}`} style={{ width: `${u.p ?? 0}%` }} /></div>
      <div className="text-[11px] text-slate-400">{u.n === 0 ? 'chưa có lần đánh giá nào trong 45 ngày cuối kì' : `${u.n} lần đánh giá${u.n < nToiDa / 2 ? ' · độ tin còn thấp' : ''}`}</div>
    </div>
  )
}
function BieuDoThi({ thi }: { thi: BcKyData['thi'] }) {
  if (!thi.length) return <p className="text-[13px] text-slate-400">Chưa có lần thi nào trong kì.</p>
  const W = 400, H = 170, L = 26, R = 12, T = 14, B = 30
  const PAD = 24 // điểm đầu/cuối lùi vào trong để nhãn "MT T10" không bị cắt mép
  const x = (i: number) => thi.length === 1 ? (L + W - R) / 2 : L + PAD + (i * (W - L - R - 2 * PAD)) / (thi.length - 1)
  const y = (v: number) => T + (1 - v / 10) * (H - T - B)
  const duong = (k: 'diem' | 'tb') => thi.map((t, i) => `${x(i)},${y(t[k])}`).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 2, 4, 6, 8, 10].map((v) => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e2e8f0" /><text x={L - 6} y={y(v) + 3} fontSize="9" textAnchor="end" fill="#94a3b8">{v}</text></g>)}
        <polyline points={duong('tb')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
        <polyline points={duong('diem')} fill="none" stroke="#4f46e5" strokeWidth="2.5" />
        {thi.map((t, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(t.diem)} r="3.5" fill="#4f46e5" />
            <text x={x(i)} y={y(t.diem) - 7} fontSize="10" fontWeight="700" textAnchor="middle" fill="#312e81">{so1(t.diem)}</text>
            <text x={x(i)} y={H - 10} fontSize="10" textAnchor="middle" fill="#475569">{t.nhan}</text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex gap-4 text-[12px] text-slate-600">
        <span><i className="mr-1 inline-block h-[3px] w-3.5 rounded bg-indigo-600 align-middle" />Điểm của em</span>
        <span><i className="mr-1 inline-block h-[3px] w-3.5 rounded bg-slate-400 align-middle" />Trung bình lần thi (khối)</span>
      </div>
    </div>
  )
}
export function XemTruocKy({ d, congBoAt }: { d: BcKyData; congBoAt: string | null }) {
  const cc = d.chuyen_can
  const nghi = cc ? cc.vang + cc.vang_phep : 0
  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_8px_30px_#0002]">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-5 pb-6 pt-5 text-white">
        <small className="text-[12px] uppercase tracking-wider opacity-80">BK Academy · Báo cáo học kì</small>
        <h1 className="mb-0.5 mt-1 text-[22px] font-bold">{d.hs.ho_ten}</h1>
        <p className="text-[13px] opacity-90">{d.mon}{d.lop.khoi ? ` ${d.lop.khoi}` : ''} · Lớp {d.lop.ten ?? '—'} · {d.ky.ten} (tháng {thangNhan(d.ky.tu_thang)} → {thangNhan(d.ky.den_thang)})</p>
      </div>
      <Sec icon="🎯" ten="Điểm năng lực">
        <div className="flex items-end gap-3">
          <span className="text-[44px] font-extrabold leading-none text-indigo-600">{so1(d.nang_luc.diem)}</span>
          <span className="pb-1 text-[20px] font-semibold text-slate-500">± {so1(d.nang_luc.sai_so)}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">Điểm dự đoán cho kì tới và sai số do giáo viên đánh giá. Điểm càng cao là học càng tốt; sai số càng nhỏ là làm bài càng cẩn thận.</p>
      </Sec>
      <Sec icon="📚" ten="Mức hoàn thành">
        <div className="mb-1 text-[11px] text-slate-400">Tính trên các lần đánh giá trong 45 ngày cuối kì ({ddmm(d.cua_so_hoan_thanh.tu)} → {ddmm(d.cua_so_hoan_thanh.den)})</div>
        <div className="mt-2 text-[11px] font-bold uppercase text-slate-500">Chủ đề ({d.cua_so_hoan_thanh.n_chu_de} lần đánh giá gần nhất)</div>
        {d.hoan_thanh.chu_de.length ? d.hoan_thanh.chu_de.map((u) => <Thanh key={u.ma} u={u} nToiDa={u.n_toi_da} />) : <p className="text-[13px] text-slate-400">Chưa có lần đánh giá nào trong kì.</p>}
        <div className="mt-3 text-[11px] font-bold uppercase text-slate-500">Chuyên đề ({d.cua_so_hoan_thanh.n_chuyen_de} lần đánh giá gần nhất)</div>
        {d.hoan_thanh.chuyen_de.map((u) => <Thanh key={u.ma} u={u} nToiDa={u.n_toi_da} />)}
      </Sec>
      <Sec icon="📈" ten="Điểm các lần thi"><BieuDoThi thi={d.thi} /></Sec>
      <Sec icon="🏆" ten="Thứ hạng tại trung tâm">
        {d.hang_ky
          ? <div className="mb-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-slate-50 p-3"><b className="block text-[22px] text-slate-800">{d.hang_ky.hang} / {d.hang_ky.tong}</b><span className="text-[12px] text-slate-500">Hạng cả học kì · theo điểm TB {d.hang_ky.so_lan} lần thi em đã thi</span></div>
              <div className="rounded-xl bg-slate-50 p-3"><b className="block text-[22px] text-slate-800">Top {d.hang_ky.top_pct}%</b><span className="text-[12px] text-slate-500">Trong khối {d.lop.khoi} {d.mon}</span></div>
            </div>
          : <p className="mb-2 text-[13px] text-slate-400">Em chưa có lần thi nào trong kì — không xếp hạng.</p>}
        {d.thi.length > 0 && (
          <table className="w-full text-[12.5px]">
            <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500"><th className="py-1.5 text-left font-medium">Lần thi</th><th className="py-1.5 text-right font-medium">Điểm</th><th className="py-1.5 text-right font-medium">Hạng</th></tr></thead>
            <tbody>{d.thi.map((t, i) => <tr key={i} className="border-b border-slate-100"><td className="py-2">{t.nhan}</td><td className="py-2 text-right tabular-nums">{so1(t.diem)}</td><td className="py-2 text-right tabular-nums">{t.hang}/{t.n_mau}</td></tr>)}</tbody>
          </table>
        )}
      </Sec>
      <Sec icon="🗓️" ten="Chuyên cần">
        {cc && cc.tong > 0
          ? <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-slate-50 p-3"><b className="block text-[22px] text-slate-800">{nghi} buổi</b><span className="text-[12px] text-slate-500">Nghỉ trong kì{cc.vang_phep ? ` (${cc.vang_phep} có phép)` : ''}</span></div>
              <div className="rounded-xl bg-slate-50 p-3"><b className="block text-[22px] text-slate-800">{cc.co_mat} / {cc.tong}</b><span className="text-[12px] text-slate-500">Buổi có mặt</span></div>
            </div>
          : <p className="text-[13px] text-slate-400">Chưa có buổi điểm danh nào trong kì.</p>}
      </Sec>
      <Sec icon="💬" ten="Nhận xét của giáo viên">
        {d.nhan_xet
          ? <div className="whitespace-pre-line rounded-lg border-l-4 border-violet-600 bg-slate-50 px-3.5 py-3 text-[14px] leading-relaxed text-slate-800">{d.nhan_xet}{d.gv && <em className="mt-2 block text-[12px] not-italic text-slate-500">— {d.gv}</em>}</div>
          : <p className="text-[13px] text-slate-400">Giáo viên chưa nhập nhận xét.</p>}
      </Sec>
      <Sec icon="📎" ten="Phụ lục — bảng điểm các lần thi">
        {d.thi.length
          ? <>
              <table className="w-full text-[12.5px]">
                <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500"><th className="py-1.5 text-left font-medium">Lần thi</th><th className="py-1.5 text-right font-medium">Ngày</th><th className="py-1.5 text-right font-medium">Điểm</th><th className="py-1.5 text-right font-medium">TB lần thi</th><th className="py-1.5 text-right font-medium">Chênh</th></tr></thead>
                <tbody>
                  {d.thi.map((t, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">{t.nhan}</td><td className="py-2 text-right tabular-nums">{ddmm(t.ngay)}</td><td className="py-2 text-right tabular-nums">{so1(t.diem)}</td>
                      <td className="py-2 text-right tabular-nums">{so1(t.tb)} <span className="text-[10px] text-slate-400">({t.n_mau})</span></td>
                      <td className={`py-2 text-right tabular-nums ${t.chenh >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{t.chenh >= 0 ? '+' : ''}{so1(t.chenh)}</td>
                    </tr>))}
                  {d.tong_thi && <tr className="font-semibold"><td className="py-2">Trung bình</td><td /><td className="py-2 text-right tabular-nums">{so1(d.tong_thi.tb_em)}</td><td className="py-2 text-right tabular-nums">{so1(d.tong_thi.tb_lan)}</td>
                    <td className={`py-2 text-right tabular-nums ${d.tong_thi.chenh >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{d.tong_thi.chenh >= 0 ? '+' : ''}{so1(d.tong_thi.chenh)}</td></tr>}
                </tbody>
              </table>
              <p className="mt-2 text-[11px] text-slate-400">TB lần thi tính trên các em cùng khối đã thi đề đó (số trong ngoặc); em vắng thì không vào mẫu.</p>
            </>
          : <p className="text-[13px] text-slate-400">Chưa có lần thi nào trong kì.</p>}
      </Sec>
      <div className="px-5 py-3.5 text-center text-[11px] text-slate-400">BK Academy · Báo cáo học kì · {congBoAt ? `công bố ${new Date(congBoAt).toLocaleDateString('vi-VN')}` : `bản nháp — tính lúc ${new Date(d.tinh_luc).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`}</div>
    </div>
  )
}
