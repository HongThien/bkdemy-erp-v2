// BÁO CÁO HỌC KÌ (spec-bao-cao-ky.md, Thùy chốt 04/11) — chế độ "Học kì" của màn Report phụ huynh.
// KHÁC hẳn report tháng. 5 PHẦN (Thùy 04/11): đánh giá chủ đề→chuyên đề · kết quả thi + hạng · thái độ học tập (chuyên cần + BTVN) ·
// nhận xét + kế hoạch + điểm năng lực (GV nhập) · phụ lục điểm thi toàn khối. Số liệu = fn_bc_ky_tinh (nháp) / snapshot (đã công bố).
// ERP chỉ NHẬP + TÍNH + CHỤP SNAPSHOT; PDF gửi PH dựng ngoài ERP từ snapshot (spec A8).
import { useEffect, useState } from 'react'
import {
  listKyHoc, themKyHoc, xemBcKy, getBcKyNhap, luuBcKyNhap, congBoBcKy, moLaiBcKy,
  BC_KY_NHAP_TRONG, type KyHoc, type BcKyData, type BcKyNhap, type BcKyDonVi, type BcKyChuDe, type BcKyGoiY,
} from '../../lib/baoCaoKy'
import { SoLieuKy, PhuLucKy } from './SoLieuKy'
import { useDanhMucNx, NhapNhanXet, NhapKeHoach, dungNhanXetChon, dungKeHoachChon, mucNhoDangDung, NHAN_MUC, MAU_MUC } from './ThangNhanXet'

const pctCls = (p: number | null) => p == null ? 'text-slate-400' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-700'
const barCls = (p: number | null) => p == null ? 'bg-slate-200' : p >= 80 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-500' : 'bg-rose-500'
const thangNhan = (ym: string) => { const [y, m] = ym.split('-'); return `${Number(m)}/${y}` }
const ddmm = (iso: string) => { const [, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}` }
// điểm hiện tối đa 2 chữ số sau dấu phẩy (Thùy 04/11: 9,25 thay vì 9,3) — số đã làm tròn ở DB
export const so1 = (v: number | null | undefined) => v == null ? '—' : Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 2 })

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

// ── Thân báo cáo kì của 1 HS — MÀN LÀM VIỆC CỦA GV (Thùy 05/11): phần nhập chiếm trọn màn; số liệu HS ở ngăn phải bật/tắt
// bằng thanh dọc (nhớ trạng thái khi đổi HS, sống tới F5); bản gửi phụ huynh (1 cột điện thoại) chỉ mở khi bấm "Xem bản gửi PH".
const NHO_KY = { moSoLieu: false }
export function BaoCaoKyBody({ hsId, mon, kyId, onTrangThai }: { hsId: string; mon: string; kyId: string; onTrangThai: (hsId: string, tt: 'cong_bo' | 'nhap') => void }) {
  const [data, setData] = useState<BcKyData | null>(null)
  const [congBoAt, setCongBoAt] = useState<string | null>(null)
  const [nhap, setNhap] = useState<BcKyNhap>(BC_KY_NHAP_TRONG)
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [moSoLieu, setMoSoLieuS] = useState(NHO_KY.moSoLieu)
  const [xemPH, setXemPH] = useState(false)
  const [xemPL, setXemPL] = useState(false)
  const dm = useDanhMucNx()
  const setMoSoLieu = (v: boolean) => { NHO_KY.moSoLieu = v; setMoSoLieuS(v) }
  useEffect(() => {
    setData(null); setLoading(true); setLoi(null)
    Promise.all([xemBcKy(hsId, mon, kyId), getBcKyNhap(hsId, mon, kyId)])
      .then(([x, n]) => { setData(x.du_lieu); setCongBoAt(x.cong_bo_at); setNhap(n) })
      .catch((e) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false))
  }, [hsId, mon, kyId])
  if (loading) return <p className="text-sm text-slate-500">Đang tải báo cáo kì…</p>
  if (loi || !data) return <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{loi ?? 'Không tải được báo cáo.'}</p>
  const cao = 'h-[calc(100vh-170px)]'
  return (
    <div className="flex items-start gap-3">
      <div className="@container min-w-0 flex-1">
        <NhapKy d={data} hsId={hsId} mon={mon} kyId={kyId} nhap={nhap} congBoAt={congBoAt} goiY={data.goi_y}
          moSoLieu={moSoLieu} onMoSoLieu={() => setMoSoLieu(!moSoLieu)} onXemPH={() => setXemPH(true)} onXemPL={() => setXemPL(true)}
          // vá tại chỗ (không tính lại cả báo cáo): bản gửi PH đọc ngay phần vừa nhập
          onDaLuu={(n) => {
            setNhap(n)
            setData((d) => d && { ...d, nang_luc: { diem: n.diem_du_doan, sai_so: n.sai_so }, nhan_xet: n.nhan_xet, ke_hoach: n.ke_hoach,
              ...(dm ? { nhan_xet_chon: dungNhanXetChon(dm, n.nx_chon, n.nx_them), ke_hoach_chon: dungKeHoachChon(dm, n.kh_chon) } : {}) })
            onTrangThai(hsId, 'nhap')
          }}
          onCongBo={async () => { const x = await xemBcKy(hsId, mon, kyId); setData(x.du_lieu); setCongBoAt(x.cong_bo_at); setNhap((n) => ({ ...n, cong_bo_at: x.cong_bo_at })); onTrangThai(hsId, 'cong_bo') }}
          onMoLai={async () => { const x = await xemBcKy(hsId, mon, kyId); setData(x.du_lieu); setCongBoAt(null); setNhap((n) => ({ ...n, cong_bo_at: null })); onTrangThai(hsId, 'nhap') }} />
      </div>
      {moSoLieu
        ? <aside className={`sticky top-0 ${cao} w-[44%] max-w-[720px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm`}>
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
              <span className="text-[13px] font-bold text-slate-700">📊 Số liệu học sinh</span>
              <button onClick={() => setXemPL(true)} className="ml-auto rounded-md px-2 py-1 text-[12px] font-semibold text-amber-700 hover:bg-amber-50">🏆 Phụ lục điểm thi</button>
              <button onClick={() => setXemPH(true)} className="rounded-md px-2 py-1 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50">📱 Bản gửi PH</button>
              <button onClick={() => setMoSoLieu(false)} className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-500 hover:bg-slate-200" title="Ẩn số liệu">Ẩn ▸</button>
            </div>
            <div className="h-[calc(100%-41px)] overflow-y-auto px-4 py-3"><SoLieuKy d={data} /></div>
          </aside>
        : <div className={`sticky top-0 ${cao} flex w-9 shrink-0 flex-col gap-2`}>
            <button onClick={() => setMoSoLieu(true)} title="Xem số liệu học sinh"
              className="min-h-0 flex-[3] rounded-xl border border-indigo-200 bg-indigo-50 text-[12.5px] font-bold tracking-wide text-indigo-700 [writing-mode:vertical-rl] hover:bg-indigo-100">
              ◂ 📊 Số liệu học sinh
            </button>
            <button onClick={() => setXemPL(true)} title="Phụ lục điểm thi toàn khối (popup)"
              className="min-h-0 flex-[2] rounded-xl border border-amber-200 bg-amber-50 text-[12.5px] font-bold tracking-wide text-amber-700 [writing-mode:vertical-rl] hover:bg-amber-100">
              🏆 Phụ lục điểm thi
            </button>
          </div>}
      {xemPL && (
        <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/50 px-4 pb-6 pt-14" onClick={() => setXemPL(false)}>
          <div className="flex max-h-full w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
              <h2 className="text-[16px] font-bold text-slate-800">🏆 Phụ lục điểm thi — {data.mon} khối {data.lop.khoi ?? ''} · {data.ky.ten}</h2>
              <span className="text-[12px] text-slate-500">đang xem: <b className="text-indigo-700">{data.hs.ho_ten}</b></span>
              <button onClick={() => setXemPL(false)} className="ml-auto rounded-md px-3 py-1 text-[13px] text-slate-500 hover:bg-slate-100">Đóng ✕</button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-5 py-3"><PhuLucKy d={data} /></div>
          </div>
        </div>
      )}
      {xemPH && (
        <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-slate-900/50 px-4 pb-6 pt-14" onClick={() => setXemPH(false)}>
          <div className="h-fit w-full max-w-[520px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between text-white">
              <span className="text-[13px] font-semibold">Bản gửi phụ huynh (điện thoại){congBoAt ? ' — bản đã công bố' : ' — nháp'}</span>
              <button onClick={() => setXemPH(false)} className="rounded-md bg-white/15 px-3 py-1 text-[13px] font-semibold hover:bg-white/25">Đóng ✕</button>
            </div>
            <XemTruocKy d={data} congBoAt={congBoAt} />
          </div>
        </div>
      )}
    </div>
  )
}

function NhapKy({ d: bc, hsId, mon, kyId, nhap, congBoAt, goiY, moSoLieu, onMoSoLieu, onXemPH, onXemPL, onDaLuu, onCongBo, onMoLai }: {
  d: BcKyData; hsId: string; mon: string; kyId: string; nhap: BcKyNhap; congBoAt: string | null; goiY?: BcKyGoiY
  moSoLieu: boolean; onMoSoLieu: () => void; onXemPH: () => void; onXemPL: () => void
  onDaLuu: (n: BcKyNhap) => void; onCongBo: () => Promise<void>; onMoLai: () => Promise<void>
}) {
  const dm = useDanhMucNx()
  const [diem, setDiem] = useState(nhap.diem_du_doan?.toString() ?? '')
  const [saiSo, setSaiSo] = useState(nhap.sai_so?.toString() ?? '')
  const [nx] = useState(nhap.nhan_xet ?? '')   // nhận xét TỔNG cũ — không còn ô nhập (thay bằng nhận xét thêm theo mục), giữ giá trị cũ khi lưu
  const [kh, setKh] = useState(nhap.ke_hoach ?? '')
  const [saved, setSaved] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const khoa = !!congBoAt
  const soOrNull = (s: string) => { const t = s.trim().replace(',', '.'); if (!t) return null; const v = Number(t); return Number.isFinite(v) ? v : NaN }
  const bao = (tag: string) => { setSaved(tag); setTimeout(() => setSaved((s) => (s === tag ? null : s)), 1500) }
  async function ghi(tag: string, n: BcKyNhap, patch: Parameters<typeof luuBcKyNhap>[3]) {
    setLoi(null)
    const cu = nhap
    onDaLuu(n)   // vá trước (bấm liên tiếp không mất lựa chọn), lỗi thì trả lại bản cũ
    try { await luuBcKyNhap(hsId, mon, kyId, patch); bao(tag) }
    catch (e: any) { onDaLuu(cu); setLoi(e?.message ?? String(e)) }
  }
  async function luu(tag: string, dd = diem, ssStr = saiSo) {
    const d = soOrNull(dd), ss = soOrNull(ssStr)
    if (Number.isNaN(d) || Number.isNaN(ss)) { setLoi('Điểm và sai số phải là số.'); return }
    if (d != null && (d < 0 || d > 10)) { setLoi('Điểm dự đoán trong khoảng 0–10.'); return }
    if (ss != null && (ss < 0 || ss > 10)) { setLoi('Sai số trong khoảng 0–10.'); return }
    if ((d != null && (d * 4) % 1 !== 0) || (ss != null && (ss * 4) % 1 !== 0)) { setLoi('Điểm và sai số là bội của 0,25.'); return }
    const n: BcKyNhap = { ...nhap, diem_du_doan: d, sai_so: ss, nhan_xet: nx.trim() ? nx : null, ke_hoach: kh.trim() ? kh : null }
    if (n.diem_du_doan === nhap.diem_du_doan && n.sai_so === nhap.sai_so && n.nhan_xet === nhap.nhan_xet && n.ke_hoach === nhap.ke_hoach) return
    await ghi(tag, n, { diem_du_doan: n.diem_du_doan, sai_so: n.sai_so, nhan_xet: n.nhan_xet, ke_hoach: n.ke_hoach })
  }
  const dungGoiY = () => {
    if (goiY?.du_doan == null || goiY.sai_so == null) return
    const a = String(goiY.du_doan), b = String(goiY.sai_so)
    setDiem(a); setSaiSo(b); void luu('goiy', a, b)
  }
  const conThieu = dm ? mucNhoDangDung(dm).filter((m) => !nhap.nx_chon[m.ma]).length : 0
  const du = soOrNull(diem) != null && soOrNull(saiSo) != null && !!dm && conThieu === 0
  async function chay(fn: () => Promise<void>) { setBusy(true); setLoi(null); try { await fn() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) } }
  const the = 'rounded-2xl border border-slate-200 bg-white shadow-sm'
  const tieuDe = 'text-[12px] font-bold uppercase tracking-wider text-slate-500'
  const o = 'h-9 w-20 rounded-lg border border-slate-200 px-2 text-center text-[15px] font-bold text-slate-800 disabled:bg-slate-50'
  return (
    <div className="space-y-3">
      {/* Thanh trên: ai · trạng thái · điểm năng lực · công bố — luôn trong tầm mắt */}
      <div className={`${the} flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3`}>
        <div className="min-w-0">
          <div className="truncate text-[17px] font-bold text-slate-800">{bc.hs.ho_ten}</div>
          <div className="text-[12px] text-slate-500">{bc.mon}{bc.lop.khoi ? ` ${bc.lop.khoi}` : ''} · {bc.lop.ten ?? '—'} · {bc.ky.ten}
            {' · '}{bc.so_lieu_chot_at
              ? <span className="text-emerald-700" title="Số liệu đã chốt — không tính lại">📌 số liệu chốt {new Date(bc.so_lieu_chot_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              : <span className="text-amber-600" title="Chưa chốt — số liệu đang tính trực tiếp">số liệu chưa chốt</span>}</div>
        </div>
        {khoa
          ? <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11.5px] font-semibold text-emerald-700">✓ Đã công bố {new Date(congBoAt!).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
          : <span className="rounded-md bg-amber-50 px-2 py-1 text-[11.5px] font-semibold text-amber-700">Nháp — phụ huynh chưa thấy</span>}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-5">
          <span className={`${tieuDe} whitespace-nowrap`}>Điểm năng lực</span>
          <input value={diem} disabled={khoa} onChange={(e) => setDiem(e.target.value)} onBlur={() => void luu('diem')} inputMode="decimal" placeholder="điểm" title="Điểm dự đoán (0–10, bội 0,25)" className={o} />
          <span className="text-[15px] font-bold text-slate-400">±</span>
          <input value={saiSo} disabled={khoa} onChange={(e) => setSaiSo(e.target.value)} onBlur={() => void luu('saiso')} inputMode="decimal" placeholder="sai số" title="Sai số (bội 0,25)" className={o} />
          {goiY?.du_doan != null && (
            <span className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-indigo-700">
              🤖 {so1(goiY.du_doan)} ± {so1(goiY.sai_so)} <span className="text-slate-400">({goiY.so_lan} lần thi)</span>
              {!khoa && (soOrNull(diem) !== goiY.du_doan || soOrNull(saiSo) !== goiY.sai_so) &&
                <button onClick={dungGoiY} className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold hover:bg-indigo-100">Dùng</button>}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {saved && <span className="text-[11.5px] text-emerald-600">Đã lưu</span>}
          {!khoa && conThieu > 0 && <span className="text-[12px] text-amber-600">còn {conThieu} mục chưa chọn</span>}
          <button onClick={onXemPL} className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-amber-700 hover:bg-amber-50" title="Phụ lục điểm thi toàn khối, lọc theo lớp">🏆 Phụ lục</button>
          <button onClick={onXemPH} className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-indigo-600 hover:bg-indigo-50" title="Bản 1 cột gửi phụ huynh">📱 Bản gửi PH</button>
          {!moSoLieu && <button onClick={onMoSoLieu} className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-100">📊 Số liệu</button>}
          {khoa
            ? <button disabled={busy} onClick={() => void chay(async () => { await moLaiBcKy(hsId, mon, kyId); await onMoLai() })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Mở lại để sửa</button>
            : <button disabled={busy || !du} onClick={() => void chay(async () => { await congBoBcKy(hsId, mon, kyId); await onCongBo() })} title={du ? 'Chụp số liệu + công bố cho phụ huynh' : 'Cần điểm, sai số và đủ mọi mục nhận xét'} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">✓ Chốt &amp; công bố</button>}
        </div>
        {loi && <p className="w-full rounded-md bg-rose-50 px-2 py-1 text-[12px] text-rose-700">{loi}</p>}
      </div>

      {/* Nhận xét theo thang: mục to xếp thành cột (rộng: 4 cột · hẹp: 2 cột) */}
      {dm
        ? <NhapNhanXet dm={dm} nx={nhap.nx_chon} them={nhap.nx_them} goiY={goiY} khoa={khoa}
            onDoi={(v) => void ghi('nxc', { ...nhap, nx_chon: v }, { nx_chon: v })}
            onDoiThem={(v) => void ghi('nxt', { ...nhap, nx_them: v }, { nx_them: v })} />
        : <p className="text-[12px] text-slate-400">Đang tải thang nhận xét…</p>}

      <div>
        <div className={`${the} px-4 py-3`}>
          <div className={`${tieuDe} mb-1.5`}>Kế hoạch cải thiện</div>
          {dm && <NhapKeHoach dm={dm} nx={nhap.nx_chon} kh={nhap.kh_chon} khoa={khoa} onDoi={(v) => void ghi('khc', { ...nhap, kh_chon: v }, { kh_chon: v })} />}
          <textarea value={kh} disabled={khoa} onChange={(e) => setKh(e.target.value)} onBlur={() => void luu('kh')} rows={2} placeholder="Viết thêm (nếu cần)…"
            className="mt-2 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] leading-relaxed text-slate-800 disabled:bg-slate-50" />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">{khoa
        ? 'Đang hiện bản ĐÓNG BĂNG lúc công bố — số liệu không tự đổi. Mở lại để sửa rồi công bố lại.'
        : 'Tự lưu khi chọn / rời ô. Công bố cần điểm, sai số và đủ mọi mục nhận xét ("Chưa QS" = chưa đủ quan sát, cũng tính).'}</p>
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
// Hạng trong khối của 1 chủ đề / chuyên đề (Thùy 04/11) — viên bo tròn màu, chữ trắng, cạnh tag Cơ bản / Nâng cao.
function VienHang({ u }: { u: BcKyDonVi }) {
  if (u.hang == null || !u.tong) return null
  return <span className="rounded-full bg-slate-600 px-2 py-px text-[10px] font-bold text-white" title="Thứ hạng mức hoàn thành trong khối">Hạng {u.hang}/{u.tong}</span>
}
function DongChuyenDe({ u }: { u: BcKyDonVi }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="min-w-0 flex-1 text-[13px] leading-snug text-slate-700">{u.ten}
        <div className="mt-0.5 flex items-center gap-1.5">
          {u.muc && <span className={`rounded-full px-2 py-px text-[10px] font-bold text-white ${u.muc === 'nang_cao' ? 'bg-violet-600' : 'bg-sky-500'}`}>{u.muc === 'nang_cao' ? 'Nâng cao' : 'Cơ bản'}</span>}
          <VienHang u={u} />
          <small className="text-[10.5px] text-slate-400">{u.n === 0 ? 'chưa đo' : `${u.n} lần đánh giá`}</small>
        </div>
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
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400"><VienHang u={cd} />{cd.n === 0 ? 'chưa có lần đánh giá trong 60 ngày cuối kì' : `${cd.n} lần đánh giá`}</span>
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
export function BieuDoThi({ thi }: { thi: BcKyData['thi'] }) {
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
export function XemTruocKy({ d }: { d: BcKyData; congBoAt?: string | null }) {
  const cc = d.thai_do.chuyen_can, bt = d.thai_do.btvn
  const nghi = cc ? cc.vang + cc.vang_phep : 0
  // Chưa đo trong 60 ngày cuối kì = không quan trọng ⇒ không hiện (Thùy 06/11), cả chủ đề lẫn chuyên đề
  // chủ đề chỉ có 1 chuyên đề trùng tên (vd "Hình" → "Hình") ⇒ hiện 1 dòng thôi (Thùy 06/11)
  const boLap = (cd: BcKyChuDe, cy: BcKyDonVi[]) => cy.length === 1 && cy[0].ten.trim() === cd.ten.trim() ? [] : cy
  const daDo = (u: BcKyDonVi) => u.n > 0 && u.p != null
  const chuDeDaDo = d.danh_gia.chu_de.filter(daDo).map((cd) => ({ ...cd, chuyen_de: boLap(cd, cd.chuyen_de.filter(daDo)) }))
  return (
    // 1 CỘT cho mọi nơi — app PH lẫn PDF (Thùy 04/11: "đa số PH dùng điện thoại")
    <div className="mx-auto max-w-[480px] space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-4 text-white shadow-sm">
        <small className="text-[11.5px] uppercase tracking-wider opacity-80">BK Academy · Báo cáo học kì</small>
        <h1 className="mt-0.5 text-[22px] font-bold">{d.hs.ho_ten}</h1>
        <p className="text-[13px] leading-relaxed opacity-90">{d.mon}{d.lop.khoi ? ` ${d.lop.khoi}` : ''} · Lớp {d.lop.ten ?? '—'}<br />{d.ky.ten} (tháng {thangNhan(d.ky.tu_thang)} → {thangNhan(d.ky.den_thang)}){d.gv && <><br />Giáo viên: {d.gv}</>}</p>
      </div>

      <Phan so={1} ten="Đánh giá kiến thức">
        {chuDeDaDo.length
          ? <div className="grid gap-3">{chuDeDaDo.map((cd) => <CardChuDe key={cd.ma} cd={cd} />)}</div>
          : <p className="text-[13px] text-slate-400">Chưa có lần đánh giá nào trong kì.</p>}
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
              {/* nhóm KHÔNG TRÙNG — cộng các ô = tổng buổi (Thùy 04/11) */}
              <O so={`${bt.dat_chuan}/${bt.tong}`} nhan="Đạt chuẩn (đúng hạn, nghiêm túc)" tone="xanh" />
              <O so={bt.dung_han_chua_nt} nhan="Đúng hạn nhưng chưa nghiêm túc" tone={bt.dung_han_chua_nt ? 'cam' : 'xanh'} />
              <O so={bt.nop_muon} nhan="Nộp muộn" tone={bt.nop_muon ? 'cam' : 'xanh'} />
              <O so={bt.khong_lam} nhan="Không làm" tone={bt.khong_lam ? 'do' : 'xanh'} />
              {bt.xin_phep > 0 && <O so={bt.xin_phep} nhan="Xin phép" />}
              {bt.chua_ghi > 0 && <O so={bt.chua_ghi} nhan="Chưa ghi trạng thái nộp" />}
            </div>
          : <p className="text-[13px] text-slate-400">Chưa có ghi nhận bài tập về nhà trong kì.</p>}
      </Phan>

      <Phan so={4} ten="Nhận xét của giáo viên">
        <div className="mb-4 flex flex-col gap-1.5 rounded-xl bg-indigo-50/60 px-4 py-3">
          <div>
            <div className="text-[11.5px] font-bold uppercase text-indigo-700">Điểm năng lực</div>
            <div className="flex items-end gap-2"><span className="text-[40px] font-extrabold leading-none text-indigo-600">{so1(d.nang_luc.diem)}</span><span className="pb-1 text-[18px] font-semibold text-slate-500">± {so1(d.nang_luc.sai_so)}</span></div>
          </div>
        </div>
        {/* Nhận xét theo thang (Thùy 05/11): mục to → mục nhỏ, mỗi mục 1 mức + 1 câu */}
        {(d.nhan_xet_chon ?? []).length === 0 && !d.nhan_xet && <p className="text-[13px] text-slate-400">Giáo viên chưa nhập nhận xét.</p>}
        <div className="space-y-3">
          {(d.nhan_xet_chon ?? []).map((t) => (
            <div key={t.ma} className="overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-indigo-600 px-3.5 py-1.5 text-[13px] font-bold text-white">{t.ten}</div>
              <div className="divide-y divide-slate-100">
                {t.con.map((c) => (
                  <div key={c.ma} className="px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-slate-700">{c.ten}</span>
                      <span className={`rounded-full px-2 py-px text-[11px] font-bold ${MAU_MUC[c.muc_do]}`}>{NHAN_MUC[c.muc_do]}</span>
                    </div>
                    {c.noi_dung && <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-800">{c.noi_dung}</p>}
                  </div>
                ))}
              </div>
              {t.them && <p className="whitespace-pre-line border-t border-slate-100 bg-slate-50 px-3.5 py-2.5 text-[13.5px] italic leading-relaxed text-slate-700">{t.them}</p>}
            </div>
          ))}
        </div>
        {d.nhan_xet && <>
          <div className="mb-1.5 mt-4 text-[11.5px] font-bold uppercase text-slate-500">Thầy cô ghi thêm</div>
          <div className="whitespace-pre-line rounded-lg border-l-4 border-violet-600 bg-slate-50 px-3.5 py-3 text-[14px] leading-relaxed text-slate-800">{d.nhan_xet}</div>
        </>}
        <div className="mb-1.5 mt-4 text-[11.5px] font-bold uppercase text-slate-500">Kế hoạch cải thiện</div>
        {(d.ke_hoach_chon ?? []).length > 0 || d.ke_hoach
          ? <div className="rounded-lg border-l-4 border-emerald-500 bg-slate-50 px-3.5 py-3 text-[14px] leading-relaxed text-slate-800">
              {(d.ke_hoach_chon ?? []).length > 0 && <ul className="list-disc space-y-1 pl-5">{d.ke_hoach_chon!.map((k, i) => <li key={i}>{k}</li>)}</ul>}
              {d.ke_hoach && <div className={`whitespace-pre-line ${(d.ke_hoach_chon ?? []).length ? 'mt-2' : ''}`}>{d.ke_hoach}</div>}
            </div>
          : <p className="text-[13px] text-slate-400">Giáo viên chưa nhập kế hoạch.</p>}
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
      </Phan>

    </div>
  )
}
