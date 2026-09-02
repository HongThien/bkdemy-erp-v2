// ============================================================================
// ThuChiScreen — "Thu chi" (leaf `thuchi`, PLAN-thu-chi.md, Thùy chốt 02/09). Phía KẾ TOÁN (Lộc):
//   DUYỆT CHI (hàng chờ + detail có QR chuyển trả + "Đã thanh toán" → popup ghi sổ) · SỔ CHI ·
//   CHỐT KỲ (tổng theo danh mục từ lần chốt trước đến bây giờ → chốt → xem lại/tải ảnh gửi Ngân) ·
//   DANH MỤC · TÀI KHOẢN NS (STK nhân sự).
// Mọi số liệu tổng lấy từ RPC (fn_chi_*) — KHÔNG cộng ở client (§2.0). Quyền ghi = co_quyen_ghi('thuchi')
// ở DB; UI chỉ ẩn nút khi leaf chỉ-xem. Style: tông Apple sáng như GayScreen (không scifi).
// ============================================================================
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { NGAN_HANG, tenNganHang } from '../../lib/nganhang'
import {
  listKhoanDuyet, deXuatDanhMuc, tuChoiKhoan, thanhToanGhiSo, listDanhMuc, themDanhMuc, suaDanhMuc,
  listSo, suaSo, kyXemTruoc, kyChiTiet, chotKy, listKy, tongQuan, listNhanSuBank, luuBankNhanSu,
  qrChuyenTra, noiDungCKChi, anhUrl, vnd, ddmmyyyy, ddmmhh, parseTien, fmtTienInput, CHI_TRANG_THAI_LABEL,
  type ChiKhoanDuyet, type ChiDanhMuc, type ChiSoRow, type ChiKyJson, type ChiKy, type ChiTongQuan, type NhanSuBank, type ChiTrangThai,
} from '../../lib/thuchi'

type Tab = 'duyet' | 'so' | 'chot' | 'danhmuc' | 'taikhoan'
const inputCls = 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400'
const btnPrimary = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnOk = 'rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnDanger = 'rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnGhost = 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
const card = 'rounded-xl border border-slate-200 bg-white shadow-sm'
const PILL: Record<ChiTrangThai, string> = {
  cho_duyet: 'bg-amber-100 text-amber-700', da_thanh_toan: 'bg-emerald-100 text-emerald-700', tu_choi: 'bg-red-100 text-red-700', huy: 'bg-slate-200 text-slate-500',
}

export default function ThuChiScreen() {
  const quyen = useStore((s) => s.quyen)
  const coGhi = !!quyen && (quyen.laAdmin || (quyen.chucNang.includes('thuchi') && !quyen.chiXem.includes('thuchi')))
  const [tab, setTab] = useState<Tab>('duyet')
  const [tq, setTq] = useState<ChiTongQuan | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const bao = useCallback((t: string) => { setToast(t); setTimeout(() => setToast(null), 2500) }, [])
  const taiTq = useCallback(() => { tongQuan().then(setTq).catch(() => {}) }, [])
  useEffect(() => { taiTq() }, [taiTq, tab])

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: 'duyet', label: 'Duyệt chi', badge: tq?.cho_duyet },
    { key: 'so', label: 'Sổ chi' },
    { key: 'chot', label: 'Chốt kỳ', badge: tq?.chua_chot },
    { key: 'danhmuc', label: 'Danh mục' },
    { key: 'taikhoan', label: 'Tài khoản NS' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
        <h1 className="mr-2 text-base font-semibold text-slate-800">Thu chi</h1>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${tab === t.key ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t.label}{!!t.badge && <span className={`ml-1.5 rounded-full px-1.5 text-[11px] font-bold ${tab === t.key ? 'bg-white/25' : 'bg-amber-100 text-amber-700'}`}>{t.badge}</span>}
          </button>
        ))}
        {tq && (
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
            <span>Chờ thanh toán: <b className="text-amber-700">{vnd(tq.cho_duyet_tien)}</b></span>
            <span>Chưa chốt: <b className="text-indigo-700">{vnd(tq.chua_chot_tien)}</b> ({tq.chua_chot} khoản)</span>
            {tq.ky_gan_nhat && <span>Kỳ gần nhất: <b>{tq.ky_gan_nhat.ma}</b> · {ddmmhh(tq.ky_gan_nhat.den_at)}</span>}
          </div>
        )}
        {!coGhi && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Chỉ xem</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
        {tab === 'duyet' && <TabDuyet coGhi={coGhi} bao={bao} onDoi={taiTq} />}
        {tab === 'so' && <TabSo coGhi={coGhi} bao={bao} />}
        {tab === 'chot' && <TabChot coGhi={coGhi} bao={bao} onDoi={taiTq} />}
        {tab === 'danhmuc' && <TabDanhMuc coGhi={coGhi} bao={bao} />}
        {tab === 'taikhoan' && <TabTaiKhoan coGhi={coGhi} bao={bao} />}
      </div>
      {toast && <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}
    </div>
  )
}

// ═══════════════════════════════ DUYỆT CHI ═══════════════════════════════
function TabDuyet({ coGhi, bao, onDoi }: { coGhi: boolean; bao: (t: string) => void; onDoi: () => void }) {
  const [loc, setLoc] = useState<ChiTrangThai>('cho_duyet')
  const [rows, setRows] = useState<ChiKhoanDuyet[] | null>(null)
  const [chonId, setChonId] = useState<string | null>(null)
  const tai = useCallback(async () => { setRows(null); const r = await listKhoanDuyet(loc); setRows(r); setChonId((id) => (id && r.some((x) => x.id === id) ? id : r[0]?.id ?? null)) }, [loc])
  useEffect(() => { tai().catch((e) => bao(`Lỗi: ${e.message}`)) }, [tai, bao])
  const chon = rows?.find((r) => r.id === chonId) ?? null

  return (
    <div className="grid h-full grid-cols-[360px_1fr] gap-4">
      <div className={`${card} flex min-h-0 flex-col`}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
          <select className={inputCls} value={loc} onChange={(e) => setLoc(e.target.value as ChiTrangThai)}>
            {(Object.keys(CHI_TRANG_THAI_LABEL) as ChiTrangThai[]).map((k) => <option key={k} value={k}>{CHI_TRANG_THAI_LABEL[k]}</option>)}
          </select>
          <span className="ml-auto text-xs text-slate-400">{rows ? `${rows.length} khoản` : '…'}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {rows?.length === 0 && <p className="p-6 text-center text-sm text-slate-400">Không có khoản nào.</p>}
          {rows?.map((r) => (
            <button key={r.id} onClick={() => setChonId(r.id)} className={`block w-full border-b border-slate-100 px-3 py-2.5 text-left transition ${chonId === r.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-slate-800">{r.ho_ten}</span>
                <span className="shrink-0 text-sm font-bold text-slate-900">{vnd(r.so_tien_bao)}</span>
              </div>
              <p className="truncate text-xs text-slate-600">{r.muc_dich}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{r.ma} · chi {ddmmyyyy(r.ngay_chi)} · gửi {ddmmhh(r.created_at)}{!r.bank_stk && <span className="ml-1 text-red-500">· thiếu STK</span>}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 overflow-auto">
        {chon ? <ChiTietDuyet key={chon.id} k={chon} coGhi={coGhi} bao={bao} onXong={async () => { await tai(); onDoi() }} /> : <p className="p-8 text-center text-sm text-slate-400">Chọn một khoản để xem chi tiết.</p>}
      </div>
    </div>
  )
}

function ChiTietDuyet({ k, coGhi, bao, onXong }: { k: ChiKhoanDuyet; coGhi: boolean; bao: (t: string) => void; onXong: () => Promise<void> }) {
  const [qr, setQr] = useState<string | null>(null)
  const [moGhiSo, setMoGhiSo] = useState(false)
  const [moTuChoi, setMoTuChoi] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  const coBank = !!k.bank_bin && !!k.bank_stk
  useEffect(() => {
    if (!coBank || k.trang_thai !== 'cho_duyet') { setQr(null); return }
    qrChuyenTra({ bank_bin: k.bank_bin!, bank_stk: k.bank_stk!, ma_ns: k.ma_ns, ma: k.ma, so_tien: Number(k.so_tien_bao) }).then(setQr).catch(() => setQr(null))
  }, [k, coBank])
  const copy = (s: string) => navigator.clipboard?.writeText(s).then(() => bao(`Đã copy: ${s}`))
  const tuChoi = async () => {
    setBusy(true)
    try { await tuChoiKhoan(k.id, lyDo); bao(`Đã từ chối ${k.ma}`); await onXong() } catch (e) { bao(`Lỗi: ${(e as Error).message}`) } finally { setBusy(false) }
  }
  const noiDung = noiDungCKChi(k.ma_ns, k.ma)

  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PILL[k.trang_thai]}`}>{CHI_TRANG_THAI_LABEL[k.trang_thai]}</span>
            <h2 className="mt-1 text-lg font-semibold text-slate-800">{k.ho_ten} <span className="text-sm font-normal text-slate-400">{k.ma_ns}</span></h2>
            <p className="text-xs text-slate-400">{k.ma} · gửi {ddmmhh(k.created_at)}</p>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{vnd(k.so_tien_bao)}</p>
        </div>
        <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-1.5 text-sm">
          <dt className="text-slate-400">Mục đích</dt><dd className="text-slate-800">{k.muc_dich}</dd>
          <dt className="text-slate-400">Ngày chi</dt><dd className="text-slate-800">{ddmmyyyy(k.ngay_chi)}</dd>
          <dt className="text-slate-400">Danh mục gợi ý</dt><dd className="text-slate-800">{k.danh_muc_de_xuat_ten ?? <span className="text-slate-400">— nhân sự không chọn —</span>}</dd>
          {k.trang_thai === 'tu_choi' && <><dt className="text-slate-400">Lý do từ chối</dt><dd className="text-red-700">{k.tu_choi_ly_do}</dd></>}
          {k.xu_ly_at && <><dt className="text-slate-400">Xử lý</dt><dd className="text-slate-800">{k.xu_ly_boi_ten ?? '—'} · {ddmmhh(k.xu_ly_at)}</dd></>}
        </dl>
        {k.anh_paths.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {k.anh_paths.map((p) => (
              <a key={p} href={anhUrl(p)} target="_blank" rel="noreferrer" className="block h-24 w-24 overflow-hidden rounded-lg border border-slate-200"><img src={anhUrl(p)} alt="" className="h-full w-full object-cover" /></a>
            ))}
          </div>
        )}
      </div>

      {k.trang_thai === 'cho_duyet' && (
        <div className={`${card} p-4`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Chuyển trả</p>
          {coBank ? (
            <div className="flex gap-5">
              {qr ? <img src={qr} alt="VietQR" className="h-56 w-56 shrink-0 rounded-lg border border-slate-200" /> : <div className="h-56 w-56 shrink-0 animate-pulse rounded-lg bg-slate-100" />}
              <dl className="grid flex-1 grid-cols-[110px_1fr] content-start gap-y-2 text-sm">
                <dt className="text-slate-400">Ngân hàng</dt><dd className="font-medium text-slate-800">{tenNganHang(k.bank_bin)}</dd>
                <dt className="text-slate-400">Số TK</dt><dd className="font-mono text-slate-800">{k.bank_stk} <button onClick={() => copy(k.bank_stk!)} className="ml-1 text-xs text-indigo-600 hover:underline">copy</button></dd>
                <dt className="text-slate-400">Chủ TK</dt><dd className="uppercase text-slate-800">{k.bank_chu_tk ?? '—'}</dd>
                <dt className="text-slate-400">Số tiền</dt><dd className="font-bold text-slate-900">{vnd(k.so_tien_bao)} <button onClick={() => copy(String(Math.round(Number(k.so_tien_bao))))} className="ml-1 text-xs text-indigo-600 hover:underline">copy</button></dd>
                <dt className="text-slate-400">Nội dung CK</dt><dd className="font-mono text-slate-800">{noiDung} <button onClick={() => copy(noiDung)} className="ml-1 text-xs text-indigo-600 hover:underline">copy</button></dd>
                <dd className="col-span-2 mt-1 text-xs text-slate-400">Quét QR bằng app ngân hàng → tự điền STK, số tiền, nội dung. Chuyển xong bấm "Đã thanh toán".</dd>
              </dl>
            </div>
          ) : (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Nhân sự <b>chưa khai số tài khoản</b> — nhắc họ vào app BK Chi › Tài khoản, hoặc nhập giúp ở tab "Tài khoản NS".</p>
          )}
          {coGhi && (
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setMoGhiSo(true)} disabled={busy} className={btnOk}>✅ Đã thanh toán → ghi sổ</button>
              <button onClick={() => setMoTuChoi((v) => !v)} disabled={busy} className={btnGhost}>✕ Từ chối</button>
            </div>
          )}
          {moTuChoi && coGhi && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <textarea className={`${inputCls} w-full`} rows={2} placeholder="Lý do từ chối (nhân sự sẽ thấy)" value={lyDo} onChange={(e) => setLyDo(e.target.value)} />
              <div className="mt-2 flex gap-2">
                <button onClick={tuChoi} disabled={busy || !lyDo.trim()} className={btnDanger}>Xác nhận từ chối</button>
                <button onClick={() => setMoTuChoi(false)} className={btnGhost}>Thôi</button>
              </div>
            </div>
          )}
        </div>
      )}
      {moGhiSo && <PopupGhiSo k={k} onDong={() => setMoGhiSo(false)} onXong={async (msg) => { setMoGhiSo(false); bao(msg); await onXong() }} />}
    </div>
  )
}

// Popup bước 6–7 story: mục đích (mặc định của nhân sự) · danh mục (đề xuất) · ngày · số tiền · lưu ý → Xác nhận = 1 RPC.
function PopupGhiSo({ k, onDong, onXong }: { k: ChiKhoanDuyet; onDong: () => void; onXong: (msg: string) => Promise<void> }) {
  const [dm, setDm] = useState<ChiDanhMuc[]>([])
  const [mucDich, setMucDich] = useState(k.muc_dich)
  const [danhMuc, setDanhMuc] = useState<string>('')
  const [ngay, setNgay] = useState(k.ngay_chi)
  const [soTien, setSoTien] = useState(fmtTienInput(Number(k.so_tien_bao)))
  const [luuY, setLuuY] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    listDanhMuc().then(setDm).catch(() => {})
    deXuatDanhMuc(k.id).then((id) => id && setDanhMuc(id)).catch(() => {})
  }, [k.id])
  const tien = parseTien(soTien)
  const lech = tien !== Math.round(Number(k.so_tien_bao))
  const hopLe = tien > 0 && mucDich.trim() && danhMuc && ngay && (!lech || luuY.trim())
  const xacNhan = async () => {
    setBusy(true); setLoi(null)
    try { await thanhToanGhiSo(k.id, { so_tien: tien, muc_dich: mucDich.trim(), danh_muc_id: danhMuc, ngay, luu_y: luuY.trim() }); await onXong(`Đã ghi sổ ${k.ma} — ${vnd(tien)}`) }
    catch (e) { setLoi((e as Error).message); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onDong}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-800">Ghi sổ khoản {k.ma}</h3>
        <p className="text-xs text-slate-400">{k.ho_ten} · nhân sự báo {vnd(k.so_tien_bao)}. Xác nhận xong khoản mới chính thức vào sổ chi.</p>
        <div className="mt-4 grid gap-3">
          <label className="text-xs font-semibold text-slate-500">Mục đích chi<textarea className={`${inputCls} mt-1 w-full`} rows={2} value={mucDich} onChange={(e) => setMucDich(e.target.value)} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-500">Danh mục
              <select className={`${inputCls} mt-1 w-full`} value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)}>
                <option value="">— chọn —</option>
                {dm.map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-500">Ngày chi<input type="date" className={`${inputCls} mt-1 w-full`} value={ngay} onChange={(e) => setNgay(e.target.value)} /></label>
          </div>
          <label className="text-xs font-semibold text-slate-500">Số tiền thực trả
            <input className={`${inputCls} mt-1 w-full font-bold`} inputMode="numeric" value={soTien} onChange={(e) => setSoTien(fmtTienInput(parseTien(e.target.value)))} />
            {lech && <span className="mt-1 block text-[11px] font-normal text-amber-700">Khác số nhân sự báo ({vnd(k.so_tien_bao)}) → phải ghi lưu ý.</span>}
          </label>
          <label className="text-xs font-semibold text-slate-500">Lưu ý {lech ? <span className="text-red-600">(bắt buộc)</span> : <span className="font-normal text-slate-400">(phát sinh, nếu có)</span>}
            <textarea className={`${inputCls} mt-1 w-full`} rows={2} value={luuY} onChange={(e) => setLuuY(e.target.value)} />
          </label>
        </div>
        {loi && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{loi}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onDong} className={btnGhost} disabled={busy}>Huỷ</button>
          <button onClick={xacNhan} disabled={!hopLe || busy} className={btnOk}>{busy ? 'Đang ghi…' : 'Xác nhận ghi sổ'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════ SỔ CHI ═══════════════════════════════
function TabSo({ coGhi, bao }: { coGhi: boolean; bao: (t: string) => void }) {
  const [tu, setTu] = useState(''); const [den, setDen] = useState('')
  const [dmId, setDmId] = useState(''); const [chuaChot, setChuaChot] = useState(false)
  const [dm, setDm] = useState<ChiDanhMuc[]>([])
  const [rows, setRows] = useState<ChiSoRow[] | null>(null)
  const [sua, setSua] = useState<ChiSoRow | null>(null)
  const tai = useCallback(async () => { setRows(null); setRows(await listSo({ tu: tu || null, den: den || null, danh_muc_id: dmId || null, chua_chot: chuaChot })) }, [tu, den, dmId, chuaChot])
  useEffect(() => { tai().catch((e) => bao(`Lỗi: ${e.message}`)) }, [tai, bao])
  useEffect(() => { listDanhMuc(true).then(setDm).catch(() => {}) }, [])
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        <span className="text-xs text-slate-400">Ngày ghi sổ</span>
        <input type="date" className={inputCls} value={tu} onChange={(e) => setTu(e.target.value)} />
        <span className="text-xs text-slate-400">→</span>
        <input type="date" className={inputCls} value={den} onChange={(e) => setDen(e.target.value)} />
        <select className={inputCls} value={dmId} onChange={(e) => setDmId(e.target.value)}>
          <option value="">Mọi danh mục</option>
          {dm.map((d) => <option key={d.id} value={d.id}>{d.ten}{d.active ? '' : ' (ẩn)'}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={chuaChot} onChange={(e) => setChuaChot(e.target.checked)} /> Chỉ chưa chốt</label>
        <span className="ml-auto text-xs text-slate-400">{rows ? `${rows.length} dòng` : '…'}</span>
      </div>
      <div className={`${card} overflow-auto`}>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr><th className="px-3 py-2">Ghi sổ</th><th className="px-3 py-2">Mã</th><th className="px-3 py-2">Nhân sự</th><th className="px-3 py-2">Ngày chi</th><th className="px-3 py-2">Mục đích</th><th className="px-3 py-2">Danh mục</th><th className="px-3 py-2 text-right">Số tiền</th><th className="px-3 py-2">Lưu ý</th><th className="px-3 py-2">Kỳ</th><th /></tr>
          </thead>
          <tbody>
            {rows?.length === 0 && <tr><td colSpan={10} className="px-3 py-6 text-center text-slate-400">Không có dòng nào.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="whitespace-nowrap px-3 py-2 text-slate-500">{ddmmhh(r.ghi_so_at)}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.ma}</td>
                <td className="px-3 py-2 text-slate-800">{r.ho_ten}</td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">{ddmmyyyy(r.ngay)}</td>
                <td className="max-w-[320px] px-3 py-2 text-slate-800">{r.muc_dich}</td>
                <td className="px-3 py-2 text-slate-600">{r.danh_muc_ten}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-slate-900">{vnd(r.so_tien)}{Number(r.so_tien) !== Number(r.so_tien_bao) && <span className="block text-[10px] font-normal text-amber-600">báo {vnd(r.so_tien_bao)}</span>}</td>
                <td className="max-w-[220px] px-3 py-2 text-xs text-slate-500">{r.luu_y}</td>
                <td className="whitespace-nowrap px-3 py-2 text-xs">{r.ky_ma ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">🔒 {r.ky_ma}</span> : <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600">chưa chốt</span>}</td>
                <td className="px-2 py-2">{coGhi && !r.ky_id && <button onClick={() => setSua(r)} className="text-xs text-indigo-600 hover:underline">sửa</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sua && <PopupSuaSo r={sua} dm={dm.filter((d) => d.active || d.id === sua.danh_muc_id)} onDong={() => setSua(null)} onXong={async () => { setSua(null); bao('Đã sửa dòng sổ'); await tai() }} />}
    </div>
  )
}

function PopupSuaSo({ r, dm, onDong, onXong }: { r: ChiSoRow; dm: ChiDanhMuc[]; onDong: () => void; onXong: () => Promise<void> }) {
  const [ngay, setNgay] = useState(r.ngay); const [soTien, setSoTien] = useState(fmtTienInput(Number(r.so_tien)))
  const [mucDich, setMucDich] = useState(r.muc_dich); const [dmId, setDmId] = useState(r.danh_muc_id); const [luuY, setLuuY] = useState(r.luu_y ?? '')
  const [busy, setBusy] = useState(false); const [loi, setLoi] = useState<string | null>(null)
  const tien = parseTien(soTien); const lech = tien !== Math.round(Number(r.so_tien_bao))
  const luu = async () => {
    setBusy(true); setLoi(null)
    try { await suaSo(r.id, { ngay, so_tien: tien, muc_dich: mucDich.trim(), danh_muc_id: dmId, luu_y: luuY.trim() || null }); await onXong() } catch (e) { setLoi((e as Error).message); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onDong}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-800">Sửa dòng sổ {r.ma} <span className="text-sm font-normal text-slate-400">· {r.ho_ten}</span></h3>
        <div className="mt-3 grid gap-3">
          <label className="text-xs font-semibold text-slate-500">Mục đích<textarea className={`${inputCls} mt-1 w-full`} rows={2} value={mucDich} onChange={(e) => setMucDich(e.target.value)} /></label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs font-semibold text-slate-500">Ngày chi<input type="date" className={`${inputCls} mt-1 w-full`} value={ngay} onChange={(e) => setNgay(e.target.value)} /></label>
            <label className="text-xs font-semibold text-slate-500">Danh mục<select className={`${inputCls} mt-1 w-full`} value={dmId} onChange={(e) => setDmId(e.target.value)}>{dm.map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}</select></label>
            <label className="text-xs font-semibold text-slate-500">Số tiền<input className={`${inputCls} mt-1 w-full font-bold`} inputMode="numeric" value={soTien} onChange={(e) => setSoTien(fmtTienInput(parseTien(e.target.value)))} /></label>
          </div>
          <label className="text-xs font-semibold text-slate-500">Lưu ý {lech && <span className="text-red-600">(bắt buộc — khác số báo {vnd(r.so_tien_bao)})</span>}<textarea className={`${inputCls} mt-1 w-full`} rows={2} value={luuY} onChange={(e) => setLuuY(e.target.value)} /></label>
        </div>
        {loi && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{loi}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onDong} className={btnGhost} disabled={busy}>Huỷ</button>
          <button onClick={luu} disabled={busy || tien <= 0 || !mucDich.trim() || (lech && !luuY.trim())} className={btnPrimary}>{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════ CHỐT KỲ ═══════════════════════════════
function TabChot({ coGhi, bao, onDoi }: { coGhi: boolean; bao: (t: string) => void; onDoi: () => void }) {
  const [truoc, setTruoc] = useState<ChiKyJson | null>(null)
  const [kys, setKys] = useState<ChiKy[]>([])
  const [xem, setXem] = useState<ChiKyJson | null>(null)
  const [ghiChu, setGhiChu] = useState('')
  const [hoi, setHoi] = useState(false)
  const [busy, setBusy] = useState(false)
  const tai = useCallback(async () => { const [t, k] = await Promise.all([kyXemTruoc(), listKy()]); setTruoc(t); setKys(k) }, [])
  useEffect(() => { tai().catch((e) => bao(`Lỗi: ${e.message}`)) }, [tai, bao])
  const chot = async () => {
    setBusy(true)
    try { const id = await chotKy(ghiChu); setHoi(false); setGhiChu(''); await tai(); onDoi(); setXem(await kyChiTiet(id)); bao('Đã chốt kỳ') }
    catch (e) { bao(`Lỗi: ${(e as Error).message}`) } finally { setBusy(false) }
  }
  return (
    <div className="grid grid-cols-[380px_1fr] gap-4">
      <div className="flex flex-col gap-3">
        <div className={`${card} p-4`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Chưa chốt (từ lần chốt trước đến bây giờ)</p>
          {truoc ? (
            <>
              <p className="mt-1 text-xs text-slate-500">{ddmmhh(truoc.tu_at)} → bây giờ</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{vnd(truoc.tong_tien)}</p>
              <p className="text-xs text-slate-500">{truoc.so_khoan} khoản</p>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {truoc.danh_muc.map((d) => <tr key={d.danh_muc_id} className="border-t border-slate-100"><td className="py-1.5 text-slate-700">{d.ten} <span className="text-xs text-slate-400">×{d.so_khoan}</span></td><td className="py-1.5 text-right font-semibold text-slate-800">{vnd(d.so_tien)}</td></tr>)}
                  {truoc.danh_muc.length === 0 && <tr><td className="py-2 text-xs text-slate-400">Chưa có khoản ghi sổ mới.</td></tr>}
                </tbody>
              </table>
              {coGhi && truoc.so_khoan > 0 && (
                !hoi ? <button onClick={() => setHoi(true)} className={`${btnPrimary} mt-4 w-full`}>Chốt kỳ đến bây giờ</button> : (
                  <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                    <p className="text-sm text-slate-700">Chốt <b>{truoc.so_khoan} khoản · {vnd(truoc.tong_tien)}</b> thành một kỳ gửi Ngân? Sau chốt các khoản này <b>khoá</b>, không sửa được.</p>
                    <input className={`${inputCls} mt-2 w-full`} placeholder="Ghi chú kỳ (tuỳ chọn)" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
                    <div className="mt-2 flex gap-2"><button onClick={chot} disabled={busy} className={btnPrimary}>{busy ? 'Đang chốt…' : 'Xác nhận chốt'}</button><button onClick={() => setHoi(false)} className={btnGhost}>Thôi</button></div>
                  </div>
                )
              )}
              <button onClick={() => setXem(truoc)} className={`${btnGhost} mt-2 w-full`}>Xem chi tiết phần chưa chốt</button>
            </>
          ) : <p className="mt-2 text-sm text-slate-400">Đang tải…</p>}
        </div>
        <div className={`${card} overflow-hidden`}>
          <p className="border-b border-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Kỳ đã chốt · {kys.length}</p>
          {kys.length === 0 && <p className="px-4 py-4 text-sm text-slate-400">Chưa chốt kỳ nào.</p>}
          {kys.map((k) => (
            <button key={k.id} onClick={() => kyChiTiet(k.id).then(setXem).catch((e) => bao(`Lỗi: ${e.message}`))} className={`block w-full border-b border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50 ${xem?.id === k.id ? 'bg-indigo-50' : ''}`}>
              <div className="flex items-baseline justify-between"><span className="text-sm font-semibold text-slate-800">{k.ma}</span><span className="text-sm font-bold text-slate-900">{vnd(k.tong_tien)}</span></div>
              <p className="text-[11px] text-slate-400">{ddmmhh(k.tu_at)} → {ddmmhh(k.den_at)} · {k.so_khoan} khoản · {k.chot_boi_ten ?? ''}</p>
            </button>
          ))}
        </div>
      </div>
      <div>{xem ? <PhieuChot ky={xem} bao={bao} /> : <p className="p-8 text-center text-sm text-slate-400">Chọn một kỳ để xem phiếu chốt / tải ảnh gửi Ngân.</p>}</div>
    </div>
  )
}

// Phiếu chốt gửi Ngân = CHỈ tổng theo danh mục + tổng cộng (Thùy 03/09: không liệt kê giao dịch — quá nhiều).
// Chụp ảnh theo ĐÚNG khuôn Report PH (ReportPHScreen.PhAnhModal): card viết bằng INLINE STYLE (không Tailwind) →
// serialize outerHTML vào popup HTML độc lập + html2canvas CDN → copy clipboard/tải. Chụp ngay trong app ERP
// (html2canvas-pro trên node Tailwind v4 + zoom fitZoom) là nguyên nhân ảnh bị lệch.
function PhieuChot({ ky, bao }: { ky: ChiKyJson; bao: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const laKy = !!ky.id
  const fname = laKy ? `ChotChi_${ky.ma}.png` : 'ChuaChot.png'
  const moPopup = () => {
    const el = ref.current; if (!el) return
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
      + '<title>' + (laKy ? `Chốt chi ${ky.ma}` : 'Chưa chốt') + '</title><scr' + 'ipt src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></scr' + 'ipt>'
      + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:12px;display:flex;flex-direction:column;align-items:center}'
      + '.btn{width:100%;max-width:520px;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;background:#16a34a;color:#fff;margin-bottom:10px}.btn:hover{opacity:.9}'
      + '#msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px}#c{background:#fff;border-radius:14px;overflow:hidden}</style></head><body>'
      + '<button class="btn" onclick="cp()">📋 Copy ảnh (paste vào Zalo gửi Ngân)</button><div id="c">' + el.outerHTML + '</div><p id="msg"></p>'
      + '<scr' + 'ipt>async function cp(){var m=document.getElementById("msg");m.textContent="⏳ Đang xử lý...";try{var n=document.getElementById("c");var cv=await html2canvas(n,{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false,width:n.scrollWidth,height:n.scrollHeight});cv.toBlob(async function(b){try{await navigator.clipboard.write([new ClipboardItem({"image/png":b})]);m.textContent="✅ Đã copy! Ctrl+V vào Zalo.";}catch(e){var u=URL.createObjectURL(b);var a=document.createElement("a");a.href=u;a.download=' + JSON.stringify(fname) + ';a.click();URL.revokeObjectURL(u);m.textContent="✅ Đã tải ảnh!";}},"image/png");}catch(e){m.textContent="Lỗi: "+e.message;}}</scr' + 'ipt></body></html>'
    const p = window.open('', '_blank', 'width=600,height=760,scrollbars=yes')
    if (!p) { bao('Trình duyệt chặn popup — bật "Allow pop-ups" cho site này.'); return }
    p.document.write(html); p.document.close()
  }
  const th: React.CSSProperties = { padding: '8px 10px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #0f172a', textAlign: 'left' }
  const td: React.CSSProperties = { padding: '9px 10px', fontSize: 14, color: '#0f172a', borderBottom: '1px solid #e2e8f0' }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button onClick={moPopup} className={btnPrimary}>📋 Copy ảnh gửi Ngân</button>
        {!laKy && <span className="text-xs text-amber-700">Đây là phần CHƯA chốt — số liệu còn thay đổi.</span>}
        <span className="text-xs text-slate-400">Ảnh chỉ có tổng theo danh mục. Chi tiết từng khoản xem ở tab Sổ chi (lọc theo kỳ).</span>
      </div>
      {/* Card INLINE STYLE — đây là thứ được chụp (outerHTML sang popup nên KHÔNG dùng class Tailwind). */}
      <div ref={ref} style={{ width: 560, background: '#ffffff', padding: 24, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', color: '#0f172a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em' }}>BK Academy · Bảng kê chi</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{laKy ? `Kỳ ${ky.ma}` : 'Chưa chốt'}</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>Từ {ddmmhh(ky.tu_at)} đến {ddmmhh(ky.den_at)}</div>
            {ky.ghi_chu && <div style={{ fontSize: 13, color: '#475569' }}>Ghi chú: {ky.ghi_chu}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Tổng cần bù</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f766e' }}>{vnd(ky.tong_tien)}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{ky.so_khoan} khoản{laKy ? ` · chốt ${ddmmhh(ky.chot_at)}` : ''}</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 18 }}>
          <thead><tr><th style={th}>Danh mục</th><th style={{ ...th, textAlign: 'right' }}>Số khoản</th><th style={{ ...th, textAlign: 'right' }}>Số tiền</th></tr></thead>
          <tbody>
            {ky.danh_muc.map((d) => (
              <tr key={d.danh_muc_id}><td style={td}>{d.ten}</td><td style={{ ...td, textAlign: 'right', color: '#475569' }}>{d.so_khoan}</td><td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{vnd(d.so_tien)}</td></tr>
            ))}
            <tr>
              <td style={{ ...td, borderTop: '2px solid #0f172a', borderBottom: 'none', fontWeight: 800, paddingTop: 12 }}>TỔNG CỘNG</td>
              <td style={{ ...td, borderTop: '2px solid #0f172a', borderBottom: 'none', textAlign: 'right', fontWeight: 800, paddingTop: 12 }}>{ky.so_khoan}</td>
              <td style={{ ...td, borderTop: '2px solid #0f172a', borderBottom: 'none', textAlign: 'right', fontWeight: 800, paddingTop: 12, color: '#0f766e' }}>{vnd(ky.tong_tien)}</td>
            </tr>
          </tbody>
        </table>
        {laKy && ky.chot_boi_ten && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 14 }}>Người chốt: {ky.chot_boi_ten}</div>}
      </div>
    </div>
  )
}

// ═══════════════════════════════ DANH MỤC ═══════════════════════════════
function TabDanhMuc({ coGhi, bao }: { coGhi: boolean; bao: (t: string) => void }) {
  const [dm, setDm] = useState<ChiDanhMuc[]>([])
  const [ten, setTen] = useState('')
  const [suaId, setSuaId] = useState<string | null>(null); const [suaTen, setSuaTen] = useState('')
  const tai = useCallback(() => listDanhMuc(true).then(setDm).catch((e) => bao(`Lỗi: ${e.message}`)), [bao])
  useEffect(() => { tai() }, [tai])
  const them = async () => { if (!ten.trim()) return; try { await themDanhMuc(ten, (dm.filter((d) => d.thu_tu < 99).length || 0) + 1); setTen(''); bao('Đã thêm danh mục'); tai() } catch (e) { bao(`Lỗi: ${(e as Error).message}`) } }
  const luuTen = async (id: string) => { try { await suaDanhMuc(id, { ten: suaTen.trim() }); setSuaId(null); tai() } catch (e) { bao(`Lỗi: ${(e as Error).message}`) } }
  const doiThuTu = async (d: ChiDanhMuc, delta: number) => { try { await suaDanhMuc(d.id, { thu_tu: Math.max(0, d.thu_tu + delta) }); tai() } catch (e) { bao(`Lỗi: ${(e as Error).message}`) } }
  return (
    <div className={`${card} max-w-2xl`}>
      <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-400">Danh mục hiện trên popup ghi sổ. Ẩn danh mục = không chọn được nữa (dòng sổ cũ giữ nguyên). Hệ đề xuất danh mục theo lịch sử của từng nhân sự.</p>
      {dm.map((d) => (
        <div key={d.id} className={`flex items-center gap-2 border-b border-slate-100 px-4 py-2 ${d.active ? '' : 'opacity-50'}`}>
          <span className="w-8 text-xs text-slate-400">{d.thu_tu}</span>
          {suaId === d.id ? (
            <><input className={`${inputCls} flex-1`} value={suaTen} onChange={(e) => setSuaTen(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && luuTen(d.id)} /><button onClick={() => luuTen(d.id)} className={btnPrimary}>Lưu</button><button onClick={() => setSuaId(null)} className={btnGhost}>Thôi</button></>
          ) : (
            <>
              <span className="flex-1 text-sm text-slate-800">{d.ten}{!d.active && <span className="ml-2 text-xs text-slate-400">(ẩn)</span>}</span>
              {coGhi && <>
                <button onClick={() => doiThuTu(d, -1)} className="px-1 text-slate-400 hover:text-slate-700" title="Lên">↑</button>
                <button onClick={() => doiThuTu(d, +1)} className="px-1 text-slate-400 hover:text-slate-700" title="Xuống">↓</button>
                <button onClick={() => { setSuaId(d.id); setSuaTen(d.ten) }} className="text-xs text-indigo-600 hover:underline">sửa</button>
                <button onClick={() => suaDanhMuc(d.id, { active: !d.active }).then(tai)} className="text-xs text-slate-500 hover:underline">{d.active ? 'ẩn' : 'hiện'}</button>
              </>}
            </>
          )}
        </div>
      ))}
      {coGhi && <div className="flex gap-2 px-4 py-3"><input className={`${inputCls} flex-1`} placeholder="Tên danh mục mới" value={ten} onChange={(e) => setTen(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && them()} /><button onClick={them} disabled={!ten.trim()} className={btnPrimary}>+ Thêm</button></div>}
    </div>
  )
}

// ═══════════════════════════════ TÀI KHOẢN NS ═══════════════════════════════
function TabTaiKhoan({ coGhi, bao }: { coGhi: boolean; bao: (t: string) => void }) {
  const [rows, setRows] = useState<NhanSuBank[]>([])
  const [sua, setSua] = useState<Record<string, { bin: string; stk: string; chu: string }>>({})
  const tai = useCallback(() => listNhanSuBank().then(setRows).catch((e) => bao(`Lỗi: ${e.message}`)), [bao])
  useEffect(() => { tai() }, [tai])
  const batDau = (r: NhanSuBank) => setSua((s) => ({ ...s, [r.id]: { bin: r.bank_bin ?? '', stk: r.bank_stk ?? '', chu: r.bank_chu_tk ?? '' } }))
  const luu = async (id: string) => {
    const v = sua[id]
    try { await luuBankNhanSu(id, { bank_bin: v.bin, bank_stk: v.stk, bank_chu_tk: v.chu }); setSua((s) => { const n = { ...s }; delete n[id]; return n }); bao('Đã lưu STK'); tai() } catch (e) { bao(`Lỗi: ${(e as Error).message}`) }
  }
  return (
    <div className={`${card} overflow-auto`}>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-3 py-2">Mã</th><th className="px-3 py-2">Nhân sự</th><th className="px-3 py-2">Ngân hàng</th><th className="px-3 py-2">Số TK</th><th className="px-3 py-2">Chủ TK</th><th className="px-3 py-2 text-right">Chờ / tổng</th><th /></tr></thead>
        <tbody>
          {rows.map((r) => {
            const v = sua[r.id]
            return (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-3 py-2 text-xs text-slate-400">{r.ma_ns}</td>
                <td className="px-3 py-2 text-slate-800">{r.ho_ten}</td>
                {v ? (
                  <>
                    <td className="px-3 py-1"><select className={`${inputCls} w-full`} value={v.bin} onChange={(e) => setSua((s) => ({ ...s, [r.id]: { ...v, bin: e.target.value } }))}><option value="">—</option>{NGAN_HANG.map((b) => <option key={b.bin} value={b.bin}>{b.ten}</option>)}</select></td>
                    <td className="px-3 py-1"><input className={`${inputCls} w-full font-mono`} value={v.stk} onChange={(e) => setSua((s) => ({ ...s, [r.id]: { ...v, stk: e.target.value } }))} /></td>
                    <td className="px-3 py-1"><input className={`${inputCls} w-full uppercase`} value={v.chu} onChange={(e) => setSua((s) => ({ ...s, [r.id]: { ...v, chu: e.target.value } }))} /></td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 text-slate-700">{r.bank_bin ? tenNganHang(r.bank_bin) : <span className="text-red-500">chưa khai</span>}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{r.bank_stk ?? ''}</td>
                    <td className="px-3 py-2 uppercase text-slate-700">{r.bank_chu_tk ?? ''}</td>
                  </>
                )}
                <td className="px-3 py-2 text-right text-xs text-slate-500">{r.so_khoan_cho ? <b className="text-amber-700">{r.so_khoan_cho}</b> : 0} / {r.so_khoan_tong}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">{coGhi && (v ? <><button onClick={() => luu(r.id)} className={btnPrimary}>Lưu</button> <button onClick={() => setSua((s) => { const n = { ...s }; delete n[r.id]; return n })} className={btnGhost}>Thôi</button></> : <button onClick={() => batDau(r)} className="text-xs text-indigo-600 hover:underline">sửa</button>)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
