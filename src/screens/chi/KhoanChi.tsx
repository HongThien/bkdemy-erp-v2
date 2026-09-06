// KhoanChi — tab "Khoản chi" của app BK Chi: danh sách khoản của tôi · tạo/sửa khoản · chi tiết + huỷ.
// 3 view cục bộ (list / form / detail) — không router. Số liệu tổng (chờ hoàn: n khoản, tổng tiền) lấy
// từ fn_chi_tong_quan (RLS scope = khoản của tôi) — KHÔNG cộng ở client (§2.0).
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MyProfile } from '../../lib/nhansu'
import { homNayVN } from '../../lib/tuan'
import {
  listChiCuaToi, taoKhoanChi, suaKhoanChi, huyKhoanChi, listDanhMuc, uploadAnhChi, anhUrl, tongQuan,
  vnd, ddmmyyyy, ddmmhh, parseTien, fmtTienInput, CHI_TRANG_THAI_LABEL,
  type ChiCuaToi, type ChiDanhMuc, type ChiTongQuan, type ChiInput,
} from '../../lib/thuchi'

type View = { kind: 'list' } | { kind: 'form'; row?: ChiCuaToi } | { kind: 'detail'; id: string }

const PILL: Record<ChiCuaToi['trang_thai'], string> = {
  cho_duyet: 'bg-amber-100 text-amber-700',
  da_thanh_toan: 'bg-emerald-100 text-emerald-700',
  tu_choi: 'bg-red-100 text-red-700',
  huy: 'bg-slate-200 text-slate-500',
}
const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[16px] text-slate-800 outline-none focus:border-teal-500'
const btnPrimary = 'rounded-xl bg-teal-600 px-4 py-3 text-[15px] font-semibold text-white shadow-sm active:bg-teal-700 disabled:opacity-40'
const btnGhost = 'rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-600 active:bg-slate-100 disabled:opacity-40'

export default function KhoanChi({ profile, thieuStk, onKhaiStk }: { profile: MyProfile; thieuStk: boolean; onKhaiStk: () => void }) {
  const [rows, setRows] = useState<ChiCuaToi[] | null>(null)
  const [tq, setTq] = useState<ChiTongQuan | null>(null)
  const [dm, setDm] = useState<ChiDanhMuc[]>([])
  const [view, setView] = useState<View>({ kind: 'list' })
  const [toast, setToast] = useState<string | null>(null)

  const bao = (t: string) => { setToast(t); setTimeout(() => setToast(null), 2000) }
  const tai = useCallback(async () => {
    const [r, t] = await Promise.all([listChiCuaToi(), tongQuan()])
    setRows(r); setTq(t)
  }, [])
  useEffect(() => { tai().catch((e) => bao(`Lỗi tải: ${e.message}`)); listDanhMuc().then(setDm).catch(() => setDm([])) }, [tai])

  if (view.kind === 'form') {
    return <FormKhoan row={view.row} dm={dm} onBack={() => setView(view.row ? { kind: 'detail', id: view.row.id } : { kind: 'list' })}
      onSaved={async (msg) => { await tai(); setView({ kind: 'list' }); bao(msg) }} />
  }
  if (view.kind === 'detail') {
    const row = rows?.find((r) => r.id === view.id)
    if (!row) { setView({ kind: 'list' }); return null }
    return <ChiTietKhoan row={row} onBack={() => setView({ kind: 'list' })} onSua={() => setView({ kind: 'form', row })}
      onHuy={async () => { await huyKhoanChi(row.id); await tai(); setView({ kind: 'list' }); bao('Đã huỷ khoản chi') }} />
  }

  const cho = rows?.filter((r) => r.trang_thai === 'cho_duyet') ?? []
  const xong = rows?.filter((r) => r.trang_thai === 'da_thanh_toan') ?? []
  const khac = rows?.filter((r) => r.trang_thai === 'tu_choi' || r.trang_thai === 'huy') ?? []

  return (
    <div className="relative flex min-h-full flex-col">
      {/* hero */}
      <div className="bg-teal-700 px-5 pb-6 text-white" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[760px]">
          <p className="text-[13px] text-teal-100">Xin chào,</p>
          <h1 className="text-[22px] font-bold leading-tight">{profile.nhanSu.ho_ten}</h1>
          <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-[12px] font-medium text-teal-100">Đang chờ hoàn ứng</p>
            <p className="mt-0.5 text-[26px] font-extrabold leading-tight">{tq ? vnd(tq.cho_duyet_tien) : '…'}</p>
            <p className="text-[12px] text-teal-100">{tq ? `${tq.cho_duyet} khoản chờ kế toán thanh toán` : ''}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[760px] flex-1 px-4 pb-28 pt-4">
        {thieuStk && (
          <button onClick={onKhaiStk} className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left">
            <span className="text-xl">⚠️</span>
            <span className="text-[13px] text-red-700"><b>Chưa có số tài khoản.</b> Kế toán không chuyển tiền được — bấm để khai STK.</span>
          </button>
        )}
        {rows === null && <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>}
        {rows !== null && rows.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-4xl">🧾</p>
            <p className="mt-2 text-sm text-slate-500">Chưa có khoản chi nào. Bấm <b>+ Tạo khoản chi</b> để bắt đầu.</p>
          </div>
        )}
        <Nhom tieuDe="Chờ thanh toán" rows={cho} onMo={(id) => setView({ kind: 'detail', id })} />
        <Nhom tieuDe="Đã thanh toán" rows={xong} onMo={(id) => setView({ kind: 'detail', id })} />
        <Nhom tieuDe="Từ chối / đã huỷ" rows={khac} onMo={(id) => setView({ kind: 'detail', id })} />
      </div>

      {/* FAB */}
      <div className="pointer-events-none sticky bottom-4 z-10 flex justify-center px-4">
        <button onClick={() => setView({ kind: 'form' })} className="pointer-events-auto rounded-full bg-teal-600 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-teal-600/30 active:bg-teal-700">
          + Tạo khoản chi
        </button>
      </div>
      {toast && <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] text-white shadow-lg">{toast}</div>}
    </div>
  )
}

function Nhom({ tieuDe, rows, onMo }: { tieuDe: string; rows: ChiCuaToi[]; onMo: (id: string) => void }) {
  if (!rows.length) return null
  return (
    <div className="mb-5">
      <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{tieuDe} · {rows.length}</p>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <button key={r.id} onClick={() => onMo(r.id)} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl">🧾</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[15px] font-semibold text-slate-800">{r.muc_dich}</p>
                <p className="shrink-0 text-[15px] font-bold text-slate-900">{vnd(r.trang_thai === 'da_thanh_toan' ? r.so_tien_duyet : r.so_tien_bao)}</p>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[12px] text-slate-400">
                <span>{r.ma}</span><span>·</span><span>{ddmmyyyy(r.ngay_chi)}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${PILL[r.trang_thai]}`}>{CHI_TRANG_THAI_LABEL[r.trang_thai]}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Header({ tieuDe, onBack, right }: { tieuDe: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex h-12 max-w-[760px] items-center px-2">
        <button onClick={onBack} className="min-h-[44px] min-w-[44px] px-2 text-[15px] text-teal-700">‹ Quay lại</button>
        <p className="flex-1 truncate text-center text-[15px] font-semibold text-slate-800">{tieuDe}</p>
        <div className="min-w-[44px] text-right">{right}</div>
      </div>
    </div>
  )
}

// ── Form tạo/sửa ─────────────────────────────────────────────────
function FormKhoan({ row, dm, onBack, onSaved }: { row?: ChiCuaToi; dm: ChiDanhMuc[]; onBack: () => void; onSaved: (msg: string) => Promise<void> }) {
  const [soTien, setSoTien] = useState(row ? fmtTienInput(row.so_tien_bao) : '')
  const [mucDich, setMucDich] = useState(row?.muc_dich ?? '')
  const [ngay, setNgay] = useState(row?.ngay_chi ?? homNayVN())
  const [danhMuc, setDanhMuc] = useState<string>(row?.danh_muc_de_xuat_id ?? '')
  const [anh, setAnh] = useState<string[]>(row?.anh_paths ?? [])
  const [dangUp, setDangUp] = useState(0)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const camRef = useRef<HTMLInputElement>(null)
  const libRef = useRef<HTMLInputElement>(null)

  const tien = parseTien(soTien)
  const hopLe = tien > 0 && mucDich.trim().length > 0 && !!ngay && dangUp === 0

  const chonAnh = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); e.target.value = ''
    if (!files.length) return
    setDangUp((n) => n + files.length); setLoi(null)
    for (const f of files) {
      try { const p = await uploadAnhChi(f); setAnh((a) => [...a, p]) } catch (err) { setLoi(`Không tải được ảnh: ${(err as Error).message}`) } finally { setDangUp((n) => n - 1) }
    }
  }
  const luu = async () => {
    if (!hopLe) return
    setBusy(true); setLoi(null)
    const input: ChiInput = { so_tien: tien, muc_dich: mucDich.trim(), ngay_chi: ngay, danh_muc_id: danhMuc || null, anh_paths: anh }
    try {
      if (row) { await suaKhoanChi(row.id, input); await onSaved('Đã cập nhật khoản chi') }
      else { await taoKhoanChi(input); await onSaved('Đã gửi khoản chi cho kế toán') }
    } catch (err) { setLoi((err as Error).message); setBusy(false) }
  }

  return (
    <div className="min-h-full bg-[#f5f5f7]">
      <Header tieuDe={row ? `Sửa ${row.ma}` : 'Tạo khoản chi'} onBack={onBack} />
      <div className="mx-auto max-w-[760px] px-4 pb-10 pt-4">
        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Số tiền đã chi</label>
        <div className="relative mb-4">
          <input className={`${inputCls} pr-10 text-[22px] font-bold`} inputMode="numeric" placeholder="0" value={soTien}
            onChange={(e) => setSoTien(fmtTienInput(parseTien(e.target.value)))} autoFocus={!row} />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-slate-400">đ</span>
        </div>

        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Mục đích chi</label>
        <textarea className={`${inputCls} mb-4 min-h-[88px]`} placeholder="Vd: Mua giấy A4 + mực in cho cơ sở 1" value={mucDich} onChange={(e) => setMucDich(e.target.value)} />

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-slate-500">Ngày chi</label>
            <input type="date" className={inputCls} value={ngay} max={homNayVN()} onChange={(e) => setNgay(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-slate-500">Danh mục <span className="font-normal text-slate-400">(tuỳ chọn)</span></label>
            <select className={inputCls} value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)}>
              <option value="">— Kế toán chọn —</option>
              {dm.map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}
            </select>
          </div>
        </div>

        <label className="mb-1 block text-[12px] font-semibold text-slate-500">Ảnh hoá đơn / chứng từ <span className="font-normal text-slate-400">(không bắt buộc)</span></label>
        <div className="mb-2 flex gap-2">
          <button type="button" onClick={() => camRef.current?.click()} className={`${btnGhost} flex-1`}>📷 Chụp ảnh</button>
          <button type="button" onClick={() => libRef.current?.click()} className={`${btnGhost} flex-1`}>🖼 Thư viện</button>
          {/* capture="environment" → mobile mở thẳng camera sau; input thư viện không capture để chọn nhiều. */}
          <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={chonAnh} />
          <input ref={libRef} type="file" accept="image/*" multiple className="hidden" onChange={chonAnh} />
        </div>
        {(anh.length > 0 || dangUp > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {anh.map((p) => (
              <div key={p} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img src={anhUrl(p)} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setAnh((a) => a.filter((x) => x !== p))} className="absolute right-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[12px] text-white">✕</button>
              </div>
            ))}
            {Array.from({ length: dangUp }).map((_, i) => <div key={i} className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-slate-300 text-[11px] text-slate-400">Đang tải…</div>)}
          </div>
        )}

        {loi && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700">{loi}</p>}
        <button onClick={luu} disabled={!hopLe || busy} className={`${btnPrimary} w-full`}>{busy ? 'Đang lưu…' : row ? 'Lưu thay đổi' : 'Gửi kế toán'}</button>
        <p className="mt-2 text-center text-[12px] text-slate-400">Kế toán sẽ chuyển trả theo STK của bạn rồi đánh dấu "Đã thanh toán".</p>
      </div>
    </div>
  )
}

// ── Chi tiết ─────────────────────────────────────────────────────
function ChiTietKhoan({ row, onBack, onSua, onHuy }: { row: ChiCuaToi; onBack: () => void; onSua: () => void; onHuy: () => Promise<void> }) {
  const [hoiHuy, setHoiHuy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const cho = row.trang_thai === 'cho_duyet'
  return (
    <div className="min-h-full bg-[#f5f5f7]">
      <Header tieuDe={row.ma} onBack={onBack} right={cho ? <button onClick={onSua} className="min-h-[44px] px-2 text-[15px] font-semibold text-teal-700">Sửa</button> : null} />
      <div className="mx-auto max-w-[760px] px-4 pb-10 pt-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${PILL[row.trang_thai]}`}>{CHI_TRANG_THAI_LABEL[row.trang_thai]}</span>
          <p className="mt-3 text-[28px] font-extrabold text-slate-900">{vnd(row.so_tien_bao)}</p>
          <p className="mt-1 text-[15px] text-slate-700">{row.muc_dich}</p>
          <Dong nhan="Ngày chi" gia={ddmmyyyy(row.ngay_chi)} />
          <Dong nhan="Danh mục gợi ý" gia={row.danh_muc_de_xuat_ten ?? '—'} />
          <Dong nhan="Gửi lúc" gia={ddmmhh(row.created_at)} />
        </div>

        {row.trang_thai === 'da_thanh_toan' && (
          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-emerald-700">Kế toán đã thanh toán</p>
            <p className="mt-1 text-[22px] font-extrabold text-emerald-800">{vnd(row.so_tien_duyet)}</p>
            {row.so_tien_duyet != null && Number(row.so_tien_duyet) !== Number(row.so_tien_bao) && <p className="text-[12px] text-emerald-700">Khác số bạn báo ({vnd(row.so_tien_bao)}) — xem lưu ý.</p>}
            <Dong nhan="Danh mục" gia={row.danh_muc_duyet_ten ?? '—'} />
            <Dong nhan="Ghi sổ lúc" gia={ddmmhh(row.ghi_so_at)} />
            {row.luu_y_duyet && <Dong nhan="Lưu ý" gia={row.luu_y_duyet} />}
          </div>
        )}
        {row.trang_thai === 'tu_choi' && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-red-700">Kế toán từ chối</p>
            <p className="mt-1 text-[14px] text-red-800">{row.tu_choi_ly_do || '(không ghi lý do)'}</p>
            <p className="mt-1 text-[12px] text-red-600">{ddmmhh(row.xu_ly_at)} · Cần thì tạo khoản mới với thông tin đúng.</p>
          </div>
        )}

        {row.anh_paths.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chứng từ · {row.anh_paths.length}</p>
            <div className="grid grid-cols-3 gap-2">
              {row.anh_paths.map((p) => (
                <a key={p} href={anhUrl(p)} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img src={anhUrl(p)} alt="" className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {cho && (
          <div className="mt-5">
            {!hoiHuy ? (
              <button onClick={() => setHoiHuy(true)} className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-[15px] font-medium text-red-600 active:bg-red-50">Huỷ khoản chi này</button>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-[14px] text-red-800">Huỷ khoản <b>{row.ma}</b>? Kế toán sẽ không thanh toán khoản này nữa.</p>
                {loi && <p className="mt-2 text-[13px] text-red-700">{loi}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setHoiHuy(false)} className={`${btnGhost} flex-1`}>Không</button>
                  <button disabled={busy} onClick={async () => { setBusy(true); try { await onHuy() } catch (e) { setLoi((e as Error).message); setBusy(false) } }} className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-[15px] font-semibold text-white active:bg-red-700 disabled:opacity-40">{busy ? 'Đang huỷ…' : 'Huỷ khoản'}</button>
                </div>
              </div>
            )}
          </div>
        )}
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
