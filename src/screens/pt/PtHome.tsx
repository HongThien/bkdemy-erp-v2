// PtHome — shell + trang chủ app PHÁT TRIỂN (CEO chốt 05/09, khuôn bottom-tab app TA/OPS):
// · MỘT nguồn dữ liệu cho cả Hôm nay lẫn Việc của tôi = fn_pt_viec_cua_toi (mig 202609051451).
//   Hôm nay = lọc `dang_mo` (việc tôi đang cầm, chưa tách con) — chưa/đã cập nhật hôm nay.
//   Việc của tôi = toàn bộ, nhóm theo trạng thái. CÙNG card ViecPtCard, CÙNG modal ChiTietModal.
// · QUẢN LÝ (chỉ ai có lá `giaoviec` hoặc admin) = 5 tab của màn ERP (PtQuanLy).
// · CÀI ĐẶT = bật/tắt nhắc việc (Web Push tin chung 10:30) + thiết bị đang nhận + thoát.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PtGate } from '../../AppPt'
import { listViecCuaToiPt, type ViecPt } from '../../lib/giaoviec'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { kiemTraHoTro, trangThaiNhacViec, batNhacViec, tatNhacViec, listThietBiCuaToi, type PushHoTro, type TrangThaiNhac, type PushDangKy } from '../../lib/push'
import { ErrBar } from '../giaoviec/ui'
import { ViecPtCard, ChiTietModal } from './ViecPt'
import PtQuanLy from './PtQuanLy'

type TabKey = 'homnay' | 'viec' | 'quanly' | 'caidat'

function NoBadge({ n, small }: { n: number; small?: boolean }) {
  if (n <= 0) return null
  return (
    <span className={`absolute flex items-center justify-center rounded-full bg-rose-500 font-bold text-white ring-2 ring-white ${small ? '-right-1.5 -top-1 h-4 min-w-4 px-0.5 text-[9.5px]' : '-right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[11px]'}`}>{n > 99 ? '99+' : n}</span>
  )
}

export default function PtHome({ gate }: { gate: PtGate }) {
  const { profile, quyen, laQuanLy } = gate
  const coQuanLy = quyen.laAdmin || quyen.chucNang.includes('giaoviec')   // cùng lá với ERP, không đẻ quyền mới
  const [tab, setTab] = useState<TabKey>('homnay')
  const [rows, setRows] = useState<ViecPt[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [chiTiet, setChiTiet] = useState<ViecPt | null>(null)

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    setErr(null)
    try { setRows(await listViecCuaToiPt()) }
    catch (e: any) { setErr(e?.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, []) // eslint-disable-line

  const homNay = rows.filter((r) => r.dang_mo)
  const chuaCapNhat = homNay.filter((r) => !r.da_cap_nhat_hom_nay).length
  const onChanged = () => reload(true)
  // modal chi tiết đọc bản MỚI NHẤT của việc sau mỗi reload (không giữ snapshot cũ)
  const chiTietRow = chiTiet ? (rows.find((r) => r.id === chiTiet.id) ?? chiTiet) : null

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'homnay' && <HomNay profile={profile} rows={homNay} loading={loading} err={err} onOpen={setChiTiet} onChanged={onChanged} onGoCaiDat={() => setTab('caidat')} />}
        {tab === 'viec' && <VietCuaToi profile={profile} rows={rows} loading={loading} err={err} onOpen={setChiTiet} onChanged={onChanged} />}
        {tab === 'quanly' && coQuanLy && (
          <div>
            <HeaderBar profile={profile} sub="Giao việc phát triển" />
            <div className="mx-auto max-w-[1000px]"><PtQuanLy laAdmin={quyen.laAdmin} laQuanLy={laQuanLy} /></div>
          </div>
        )}
        {tab === 'caidat' && <CaiDat profile={profile} />}
      </div>

      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[1000px]">
          <TabBtn active={tab === 'homnay'} icon="☀️" label="Hôm nay" pill="bg-violet-100" text="text-violet-700" no={chuaCapNhat} onClick={() => setTab('homnay')} />
          <TabBtn active={tab === 'viec'} icon="🗂️" label="Việc của tôi" pill="bg-sky-100" text="text-sky-700" no={0} onClick={() => setTab('viec')} />
          {coQuanLy && <TabBtn active={tab === 'quanly'} icon="🧭" label="Quản lý" pill="bg-indigo-100" text="text-indigo-700" no={0} onClick={() => setTab('quanly')} />}
          <TabBtn active={tab === 'caidat'} icon="🔔" label="Cài đặt" pill="bg-amber-100" text="text-amber-700" no={0} onClick={() => setTab('caidat')} />
        </div>
      </div>
      {chiTietRow && <ChiTietModal v={chiTietRow} onClose={() => setChiTiet(null)} onChanged={onChanged} />}
    </div>
  )
}

function TabBtn({ active, icon, label, pill, text, no, onClick }: { active: boolean; icon: string; label: string; pill: string; text: string; no: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
      <span className={`relative rounded-full px-3.5 py-0.5 text-[17px] leading-[24px] transition ${active ? pill : ''}`}>{icon}<NoBadge n={no} small /></span>
      <span className={`text-[10px] font-semibold ${active ? text : 'text-slate-400'}`}>{label}</span>
    </button>
  )
}

function HeaderBar({ profile, sub }: { profile: PtGate['profile']; sub: string }) {
  const ten = (profile.nhanSu.ho_ten ?? '').trim()
  const tenGoi = ten.split(/\s+/).pop() || 'bạn'
  return (
    <div className="border-b border-slate-200/60 bg-white px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
      <div className="mx-auto flex max-w-[1000px] items-center gap-2.5">
        {profile.nhanSu.anh_url
          ? <img src={profile.nhanSu.anh_url} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
          : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[13px] font-bold text-violet-700">{tenGoi.charAt(0).toUpperCase()}</span>}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13.5px] font-bold text-slate-800">{ten}</p>
          <p className="text-[11px] text-slate-400">{sub}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 active:bg-slate-100">Thoát</button>
      </div>
    </div>
  )
}

function Nhom({ title, highlight, children }: { title: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className={`mb-2 px-1 text-[12px] font-bold uppercase tracking-wide ${highlight ? 'text-rose-600' : 'text-slate-400'}`}>{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
const Trong = ({ children }: { children: React.ReactNode }) => <p className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[12.5px] text-slate-400">{children}</p>

type ListProps = { profile: PtGate['profile']; rows: ViecPt[]; loading: boolean; err: string | null; onOpen: (v: ViecPt) => void; onChanged: () => void }

// ── HÔM NAY: hero + banner bật nhắc + 2 nhóm (chưa / đã cập nhật) ─────────────────────
function HomNay({ profile, rows, loading, err, onOpen, onChanged, onGoCaiDat }: ListProps & { onGoCaiDat: () => void }) {
  const homNay = homNayVN()
  const tenGoi = (profile.nhanSu.ho_ten ?? '').trim().split(/\s+/).pop() || 'bạn'
  const chua = rows.filter((r) => !r.da_cap_nhat_hom_nay)
  const da = rows.filter((r) => r.da_cap_nhat_hom_nay)
  const quaHan = chua.filter((r) => r.qua_han).length
  const [goiYBat, setGoiYBat] = useState(false)   // banner nhắc bật push — chỉ khi môi trường hỗ trợ và chưa bật
  useEffect(() => {
    if (kiemTraHoTro() !== 'ok') return
    trangThaiNhacViec().then((t) => setGoiYBat(t === 'tat')).catch(() => {})
  }, [])

  return (
    <div>
      <HeaderBar profile={profile} sub="BK Phát triển" />
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        <div className="relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-3 shadow-sm shadow-violet-200">
          <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold text-white">Chào {tenGoi} 👋 <span className="font-medium text-violet-100">· {thuCuaNgay(homNay)} {ddmmVN(homNay)}</span></p>
              <p className="mt-0.5 text-[12px] font-medium text-violet-50">
                {loading ? 'Đang tải…' : err ? 'Không tải được danh sách việc' : rows.length === 0 ? '✓ Không có việc đang mở' : chua.length === 0 ? `✓ Đã cập nhật đủ ${rows.length} việc hôm nay` : `${chua.length} việc chưa cập nhật hôm nay${quaHan ? ` · ${quaHan} quá hạn` : ''}`}
              </p>
            </div>
            {!loading && chua.length > 0 && <span className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-[15px] font-bold text-white">{chua.length}</span>}
          </div>
        </div>

        {goiYBat && (
          <button onClick={onGoCaiDat} className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-left shadow-sm active:bg-amber-100">
            <span className="text-[22px]">🔔</span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-amber-800">Bật nhắc việc 10:30 mỗi ngày</p>
              <p className="text-[12px] text-amber-700">Máy này chưa nhận thông báo — bật ở Cài đặt để không quên cập nhật.</p>
            </div>
            <span className="text-amber-400">›</span>
          </button>
        )}

        <ErrBar msg={err} />
        {loading ? <p className="py-6 text-center text-sm text-slate-400">Đang tải…</p> : (
          <>
            <Nhom title={`Chưa cập nhật hôm nay (${chua.length})`} highlight={chua.length > 0}>
              {chua.length === 0 ? <Trong>{rows.length ? 'Đã cập nhật hết 🎉' : 'Không có việc nào đang mở.'}</Trong>
                : chua.map((r) => <ViecPtCard key={r.id} v={r} onOpen={onOpen} onChanged={onChanged} />)}
            </Nhom>
            {da.length > 0 && (
              <Nhom title={`Đã cập nhật hôm nay (${da.length})`}>
                {da.map((r) => <ViecPtCard key={r.id} v={r} onOpen={onOpen} onChanged={onChanged} />)}
              </Nhom>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── VIỆC CỦA TÔI: toàn bộ, nhóm theo trạng thái — CÙNG card với Hôm nay ───────────────
function VietCuaToi({ profile, rows, loading, err, onOpen, onChanged }: ListProps) {
  const dangLam = rows.filter((r) => ['moi_giao', 'dang_lam', 'tra_lai', 'hold'].includes(r.trang_thai))
  const choNT = rows.filter((r) => r.trang_thai === 'cho_nghiem_thu')
  const daDong = rows.filter((r) => ['dat', 'huy', 'chuyen'].includes(r.trang_thai))
  return (
    <div>
      <HeaderBar profile={profile} sub="Việc của tôi" />
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        <ErrBar msg={err} />
        {loading ? <p className="py-6 text-center text-sm text-slate-400">Đang tải…</p> : (
          <>
            <Nhom title={`Đang làm (${dangLam.length})`}>
              {!dangLam.length ? <Trong>Không có việc nào đang làm.</Trong> : dangLam.map((r) => <ViecPtCard key={r.id} v={r} onOpen={onOpen} onChanged={onChanged} />)}
            </Nhom>
            {choNT.length > 0 && (
              <Nhom title={`Chờ nghiệm thu (${choNT.length})`}>
                {choNT.map((r) => <ViecPtCard key={r.id} v={r} onOpen={onOpen} onChanged={onChanged} />)}
              </Nhom>
            )}
            <Nhom title={`Đã đóng (${daDong.length})`}>
              {!daDong.length ? <Trong>Chưa có việc nào đóng.</Trong> : daDong.map((r) => <ViecPtCard key={r.id} v={r} onOpen={onOpen} onChanged={onChanged} />)}
            </Nhom>
          </>
        )}
      </div>
    </div>
  )
}

// ── CÀI ĐẶT: nhắc việc (Web Push) ─────────────────────────────────────────────
const HO_TRO_TEXT: Record<PushHoTro, string> = {
  ok: '',
  dev: 'Bản dev (vite) không có service worker — nhắc việc chỉ thử được trên bản build/preview hoặc bản deploy.',
  thieu_cau_hinh: 'Bản deploy này chưa khai VITE_PUSH_VAPID_PUBLIC — quản trị cần cấu hình trên Vercel.',
  ios_can_cai: 'Trên iPhone/iPad: bấm Chia sẻ → "Thêm vào MH chính", rồi mở app từ màn hình chính để bật nhắc việc (Safari yêu cầu vậy).',
  khong_ho_tro: 'Trình duyệt này không hỗ trợ thông báo đẩy — dùng Chrome (Android) hoặc cài app lên màn hình chính (iPhone).',
}

function CaiDat({ profile }: { profile: PtGate['profile'] }) {
  const hoTro = kiemTraHoTro()
  const [tt, setTt] = useState<TrangThaiNhac | null>(null)
  const [thietBi, setThietBi] = useState<PushDangKy[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function reload() {
    if (hoTro === 'ok') setTt(await trangThaiNhacViec().catch(() => 'tat' as TrangThaiNhac))
    setThietBi(await listThietBiCuaToi().catch(() => []))
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  async function doi(bat: boolean) {
    setBusy(true); setErr(null); setOk(null)
    try {
      if (bat) { await batNhacViec(); setOk('Đã bật — máy này sẽ nhận nhắc cập nhật việc lúc 10:30 mỗi ngày.') }
      else { await tatNhacViec(); setOk('Đã tắt nhắc việc trên máy này.') }
      await reload()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div>
      <HeaderBar profile={profile} sub="Cài đặt" />
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-[26px]">🔔</span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-slate-800">Nhắc cập nhật việc hàng ngày</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">
                10:30 mỗi ngày, máy này nhận một thông báo chung nhắc cả team cập nhật tình trạng công việc daily.
              </p>
            </div>
          </div>
          {hoTro !== 'ok' ? (
            <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-800">{HO_TRO_TEXT[hoTro]}</p>
          ) : tt === null ? <p className="mt-3 text-[12.5px] text-slate-400">Đang kiểm tra…</p> : tt === 'chan' ? (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-rose-700">Thông báo đang bị CHẶN cho trang này — vào cài đặt trình duyệt/điện thoại → Thông báo → cho phép, rồi mở lại.</p>
          ) : (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
              <span className={`text-[13px] font-semibold ${tt === 'bat' ? 'text-emerald-700' : 'text-slate-600'}`}>{tt === 'bat' ? '● Đang bật trên máy này' : '○ Đang tắt trên máy này'}</span>
              <button disabled={busy} onClick={() => doi(tt !== 'bat')}
                className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm disabled:opacity-40 ${tt === 'bat' ? 'bg-slate-500' : 'bg-violet-600'}`}>
                {busy ? '…' : tt === 'bat' ? 'Tắt' : 'Bật nhắc việc'}
              </button>
            </div>
          )}
          {ok && <p className="mt-2 text-[12.5px] text-emerald-700">{ok}</p>}
          <ErrBar msg={err} />
        </div>

        {thietBi.length > 0 && (
          <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-400">Máy đang nhận nhắc việc ({thietBi.length})</p>
            <div className="flex flex-col divide-y divide-slate-100">
              {thietBi.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2 text-[12.5px]">
                  <span className="font-medium text-slate-700">{d.thiet_bi ?? 'Máy không rõ'}</span>
                  <span className={`text-[11.5px] ${d.loi_ma === 410 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {d.loi_ma === 410 ? 'endpoint đã chết' : d.gui_ok_at ? `gửi ok ${ddmmVN(d.gui_ok_at.slice(0, 10))}` : d.loi_at ? `lỗi ${d.loi_ma ?? ''}` : 'chưa gửi lần nào'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => supabase.auth.signOut()} className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13.5px] font-medium text-slate-600 active:bg-slate-100">Đăng xuất</button>
      </div>
    </div>
  )
}
