// DuyetChi — tab "Duyệt" trong app BK Chi, CHỈ hiện với người có lá `thuchi` (Lộc). Thùy 03/09: Lộc phải
// duyệt được ngay trên điện thoại, không chỉ ERP. Cùng RPC với ERP (fn_chi_khoan_duyet / fn_chi_tu_choi /
// fn_chi_thanh_toan_ghi_so) — một luật, hai đầu nhập. Trên điện thoại KHÔNG quét được QR hiện trên cùng máy
// nên đường chính là NÚT COPY (STK · số tiền · nội dung CK); QR vẫn hiện để lưu ảnh → app bank quét từ thư viện.
// Chốt kỳ vẫn ở ERP (cần xuất ảnh gửi Ngân).
import { useCallback, useEffect, useState } from 'react'
import { homNayVN } from '../../lib/tuan'
import { tenNganHang } from '../../lib/nganhang'
import {
  listKhoanDuyet, deXuatDanhMuc, tuChoiKhoan, thanhToanGhiSo, listDanhMuc, qrChuyenTra, noiDungCKChi, anhUrl,
  vnd, ddmmyyyy, ddmmhh, parseTien, fmtTienInput, CHI_TRANG_THAI_LABEL,
  type ChiKhoanDuyet, type ChiDanhMuc, type ChiTrangThai,
} from '../../lib/thuchi'

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[16px] text-slate-800 outline-none focus:border-emerald-500'
const btnOk = 'rounded-xl bg-emerald-600 px-4 py-3 text-[15px] font-semibold text-white shadow-sm active:bg-emerald-700 disabled:opacity-40'
const btnGhost = 'rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-600 active:bg-slate-100 disabled:opacity-40'
const PILL: Record<ChiTrangThai, string> = {
  cho_duyet: 'bg-amber-100 text-amber-700', da_thanh_toan: 'bg-emerald-100 text-emerald-700', tu_choi: 'bg-red-100 text-red-700', huy: 'bg-slate-200 text-slate-500',
}

export default function DuyetChi({ onDoi }: { onDoi: () => void }) {
  const [loc, setLoc] = useState<ChiTrangThai>('cho_duyet')
  const [rows, setRows] = useState<ChiKhoanDuyet[] | null>(null)
  const [chonId, setChonId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const bao = useCallback((t: string) => { setToast(t); setTimeout(() => setToast(null), 2200) }, [])
  const tai = useCallback(async () => { setRows(await listKhoanDuyet(loc)) }, [loc])
  useEffect(() => { setRows(null); tai().catch((e) => bao(`Lỗi: ${e.message}`)) }, [tai, bao])
  const chon = rows?.find((r) => r.id === chonId) ?? null

  if (chon) {
    return <ChiTiet k={chon} bao={bao} onBack={() => setChonId(null)} onXong={async () => { setChonId(null); await tai(); onDoi() }} toast={toast} />
  }
  return (
    <div className="min-h-full">
      <div className="bg-emerald-700 px-5 pb-4 text-white" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-[20px] font-bold">Duyệt chi</h1>
          <p className="text-[13px] text-emerald-100">Kế toán: chuyển trả → bấm "Đã thanh toán" → ghi sổ</p>
          <div className="mt-3 flex gap-1.5 overflow-x-auto">
            {(Object.keys(CHI_TRANG_THAI_LABEL) as ChiTrangThai[]).map((k) => (
              <button key={k} onClick={() => setLoc(k)} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${loc === k ? 'bg-white text-emerald-800' : 'bg-white/15 text-white'}`}>{CHI_TRANG_THAI_LABEL[k]}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[760px] px-4 pb-8 pt-3">
        {rows === null && <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>}
        {rows?.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Không có khoản nào.</p>}
        <div className="flex flex-col gap-2">
          {rows?.map((r) => (
            <button key={r.id} onClick={() => setChonId(r.id)} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[13px] font-bold text-emerald-700">{(r.ma_ns ?? '').replace('NS', '') || '?'}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[15px] font-semibold text-slate-800">{r.ho_ten}</p>
                  <p className="shrink-0 text-[15px] font-bold text-slate-900">{vnd(r.so_tien_bao)}</p>
                </div>
                <p className="truncate text-[13px] text-slate-600">{r.muc_dich}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{r.ma} · chi {ddmmyyyy(r.ngay_chi)} · gửi {ddmmhh(r.created_at)}{!r.bank_stk && <span className="text-red-500"> · thiếu STK</span>}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {toast && <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] text-white shadow-lg">{toast}</div>}
    </div>
  )
}

function ChiTiet({ k, bao, onBack, onXong, toast }: { k: ChiKhoanDuyet; bao: (t: string) => void; onBack: () => void; onXong: () => Promise<void>; toast: string | null }) {
  const [qr, setQr] = useState<string | null>(null)
  const [moGhiSo, setMoGhiSo] = useState(false)
  const [moTuChoi, setMoTuChoi] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  const coBank = !!k.bank_bin && !!k.bank_stk
  const cho = k.trang_thai === 'cho_duyet'
  useEffect(() => {
    if (!coBank || !cho) { setQr(null); return }
    qrChuyenTra({ bank_bin: k.bank_bin!, bank_stk: k.bank_stk!, ma_ns: k.ma_ns, ma: k.ma, so_tien: Number(k.so_tien_bao) }).then(setQr).catch(() => setQr(null))
  }, [k, coBank, cho])
  const copy = (nhan: string, s: string) => navigator.clipboard?.writeText(s).then(() => bao(`Đã copy ${nhan}`)).catch(() => bao('Không copy được'))
  const noiDung = noiDungCKChi(k.ma_ns, k.ma)
  const tuChoi = async () => {
    setBusy(true)
    try { await tuChoiKhoan(k.id, lyDo); bao(`Đã từ chối ${k.ma}`); await onXong() } catch (e) { bao(`Lỗi: ${(e as Error).message}`); setBusy(false) }
  }

  return (
    <div className="min-h-full bg-[#f5f5f7]">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex h-12 max-w-[760px] items-center px-2">
          <button onClick={onBack} className="min-h-[44px] min-w-[44px] px-2 text-[15px] text-emerald-700">‹ Duyệt chi</button>
          <p className="flex-1 truncate text-center text-[15px] font-semibold text-slate-800">{k.ma}</p>
          <div className="min-w-[44px]" />
        </div>
      </div>
      <div className="mx-auto max-w-[760px] px-4 pb-10 pt-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${PILL[k.trang_thai]}`}>{CHI_TRANG_THAI_LABEL[k.trang_thai]}</span>
          <p className="mt-2 text-[17px] font-bold text-slate-800">{k.ho_ten} <span className="text-[13px] font-normal text-slate-400">{k.ma_ns}</span></p>
          <p className="text-[28px] font-extrabold text-slate-900">{vnd(k.so_tien_bao)}</p>
          <p className="mt-1 text-[15px] text-slate-700">{k.muc_dich}</p>
          <Dong nhan="Ngày chi" gia={ddmmyyyy(k.ngay_chi)} />
          <Dong nhan="Danh mục gợi ý" gia={k.danh_muc_de_xuat_ten ?? '—'} />
          <Dong nhan="Gửi lúc" gia={ddmmhh(k.created_at)} />
          {k.trang_thai === 'tu_choi' && <Dong nhan="Lý do từ chối" gia={k.tu_choi_ly_do ?? ''} />}
          {k.xu_ly_at && <Dong nhan="Xử lý" gia={`${k.xu_ly_boi_ten ?? ''} · ${ddmmhh(k.xu_ly_at)}`} />}
        </div>

        {k.anh_paths.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {k.anh_paths.map((p) => <a key={p} href={anhUrl(p)} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={anhUrl(p)} alt="" className="h-full w-full object-cover" /></a>)}
          </div>
        )}

        {cho && (
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chuyển trả</p>
            {coBank ? (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <HangCopy nhan={tenNganHang(k.bank_bin)} gia={k.bank_stk!} mono onCopy={() => copy('số TK', k.bank_stk!)} />
                  <HangCopy nhan="Chủ TK" gia={(k.bank_chu_tk ?? '—').toUpperCase()} />
                  <HangCopy nhan="Số tiền" gia={vnd(k.so_tien_bao)} onCopy={() => copy('số tiền', String(Math.round(Number(k.so_tien_bao))))} />
                  <HangCopy nhan="Nội dung CK" gia={noiDung} mono onCopy={() => copy('nội dung', noiDung)} />
                </div>
                {qr && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <img src={qr} alt="VietQR" className="h-28 w-28 rounded-lg bg-white" />
                    <p className="text-[12px] text-slate-500">Muốn quét: nhấn giữ ảnh QR → lưu, rồi trong app ngân hàng chọn quét từ thư viện. Hoặc dùng các nút copy ở trên.</p>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700">Nhân sự <b>chưa khai STK</b>. Nhắc họ vào app BK Chi › Tài khoản.</p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => setMoGhiSo(true)} disabled={busy} className={`${btnOk} w-full`}>✅ Đã thanh toán → ghi sổ</button>
              <button onClick={() => setMoTuChoi((v) => !v)} disabled={busy} className={`${btnGhost} w-full`}>✕ Từ chối</button>
            </div>
            {moTuChoi && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                <textarea className={inputCls} rows={2} placeholder="Lý do từ chối (nhân sự sẽ thấy)" value={lyDo} onChange={(e) => setLyDo(e.target.value)} />
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setMoTuChoi(false)} className={`${btnGhost} flex-1`}>Thôi</button>
                  <button onClick={tuChoi} disabled={busy || !lyDo.trim()} className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-[15px] font-semibold text-white active:bg-red-700 disabled:opacity-40">Xác nhận từ chối</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {moGhiSo && <PopupGhiSo k={k} onDong={() => setMoGhiSo(false)} onXong={async (msg) => { setMoGhiSo(false); bao(msg); await onXong() }} />}
      {toast && <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] text-white shadow-lg">{toast}</div>}
    </div>
  )
}

// Popup bước 6–7 story (bản mobile — bottom sheet): mục đích · danh mục (đề xuất) · ngày · số tiền · lưu ý → 1 RPC.
function PopupGhiSo({ k, onDong, onXong }: { k: ChiKhoanDuyet; onDong: () => void; onXong: (msg: string) => Promise<void> }) {
  const [dm, setDm] = useState<ChiDanhMuc[]>([])
  const [mucDich, setMucDich] = useState(k.muc_dich)
  const [danhMuc, setDanhMuc] = useState('')
  const [ngay, setNgay] = useState(k.ngay_chi)
  const [soTien, setSoTien] = useState(fmtTienInput(Number(k.so_tien_bao)))
  const [luuY, setLuuY] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { listDanhMuc().then(setDm).catch(() => {}); deXuatDanhMuc(k.id).then((id) => id && setDanhMuc(id)).catch(() => {}) }, [k.id])
  const tien = parseTien(soTien)
  const lech = tien !== Math.round(Number(k.so_tien_bao))
  const hopLe = tien > 0 && !!mucDich.trim() && !!danhMuc && !!ngay && (!lech || !!luuY.trim())
  const xacNhan = async () => {
    setBusy(true); setLoi(null)
    try { await thanhToanGhiSo(k.id, { so_tien: tien, muc_dich: mucDich.trim(), danh_muc_id: danhMuc, ngay, luu_y: luuY.trim() }); await onXong(`Đã ghi sổ ${k.ma} — ${vnd(tien)}`) }
    catch (e) { setLoi((e as Error).message); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onDong}>
      <div className="max-h-[92dvh] w-full max-w-[760px] overflow-auto rounded-t-3xl bg-white p-5 shadow-xl" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }} onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
        <h3 className="text-[17px] font-bold text-slate-800">Ghi sổ {k.ma}</h3>
        <p className="text-[12px] text-slate-400">{k.ho_ten} báo {vnd(k.so_tien_bao)}. Xác nhận xong khoản mới chính thức vào sổ chi.</p>
        <label className="mt-4 block text-[12px] font-semibold text-slate-500">Mục đích chi</label>
        <textarea className={`${inputCls} mt-1`} rows={2} value={mucDich} onChange={(e) => setMucDich(e.target.value)} />
        <label className="mt-3 block text-[12px] font-semibold text-slate-500">Danh mục</label>
        <select className={`${inputCls} mt-1`} value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)}>
          <option value="">— chọn —</option>
          {dm.map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}
        </select>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div><label className="block text-[12px] font-semibold text-slate-500">Ngày chi</label><input type="date" className={`${inputCls} mt-1`} value={ngay} max={homNayVN()} onChange={(e) => setNgay(e.target.value)} /></div>
          <div><label className="block text-[12px] font-semibold text-slate-500">Số tiền thực trả</label><input className={`${inputCls} mt-1 font-bold`} inputMode="numeric" value={soTien} onChange={(e) => setSoTien(fmtTienInput(parseTien(e.target.value)))} /></div>
        </div>
        {lech && <p className="mt-1 text-[12px] text-amber-700">Khác số nhân sự báo ({vnd(k.so_tien_bao)}) → phải ghi lưu ý.</p>}
        <label className="mt-3 block text-[12px] font-semibold text-slate-500">Lưu ý {lech ? <span className="text-red-600">(bắt buộc)</span> : <span className="font-normal text-slate-400">(phát sinh, nếu có)</span>}</label>
        <textarea className={`${inputCls} mt-1`} rows={2} value={luuY} onChange={(e) => setLuuY(e.target.value)} />
        {loi && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700">{loi}</p>}
        <div className="mt-4 flex gap-2">
          <button onClick={onDong} disabled={busy} className={`${btnGhost} flex-1`}>Huỷ</button>
          <button onClick={xacNhan} disabled={!hopLe || busy} className={`${btnOk} flex-[2]`}>{busy ? 'Đang ghi…' : 'Xác nhận ghi sổ'}</button>
        </div>
      </div>
    </div>
  )
}

function Dong({ nhan, gia }: { nhan: string; gia: string }) {
  return (
    <div className="mt-2 flex items-start justify-between gap-3 border-t border-slate-100 pt-2 text-[13px]">
      <span className="shrink-0 text-slate-400">{nhan}</span>
      <span className="text-right text-slate-700">{gia}</span>
    </div>
  )
}
function HangCopy({ nhan, gia, mono, onCopy }: { nhan: string; gia: string; mono?: boolean; onCopy?: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400">{nhan}</p>
        <p className={`truncate text-[15px] font-semibold text-slate-800 ${mono ? 'font-mono' : ''}`}>{gia}</p>
      </div>
      {onCopy && <button onClick={onCopy} className="min-h-[40px] rounded-lg bg-emerald-600 px-3 text-[13px] font-semibold text-white active:bg-emerald-700">Copy</button>}
    </div>
  )
}
