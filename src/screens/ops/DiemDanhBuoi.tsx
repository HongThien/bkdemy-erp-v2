// Màn ĐIỂM DANH của app OPS (PLAN-app-ops.md §3) — VIẾT MỚI touch-first cho iPad/iPhone, KHÔNG import
// BuoiHocScreen (2115 dòng, kéo theo kho Hình/soạn tài liệu vào bundle). Logic ghi = CÙNG seam lib/gami
// với ERP → 1 sự thật 2 UI; nghiệp vụ giữ NGUYÊN hành vi ERP: bấm là ghi ngay (không nút Lưu), báo đến
// PH chỉ gồm HS co_mat chưa báo (bao_den_at null), gỡ HS chặn cứng khi có đo lường thật.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  buoiAoCuaNgay, moBuoi, getBuoi, getRoster, diemDanh, markBaoDen, xoaHSKhoiBuoi, dongBoSiSo,
  huyBuoiCuaNgay, huyBuoi, setNguoiDay, diemDanhTienDo,
  type BuoiAo, type BuoiHoc, type BuoiHocHS, type DiemDanh,
} from '../../lib/gami'
import { listNhanSu } from '../../lib/nhansu'
import { homNayVN, congNgay, thuCuaNgay, ddmmVN } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import SearchSelect, { type Opt } from '../../components/SearchSelect'

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '—')
const DD_LABEL: Record<DiemDanh, string> = { co_mat: 'Có mặt', vang: 'Vắng', vang_phep: 'Phép' }
const DD_TONE: Record<DiemDanh, string> = { co_mat: 'bg-emerald-600 text-white', vang: 'bg-rose-500 text-white', vang_phep: 'bg-amber-500 text-white' }

// ── Danh sách buổi của 1 ngày (mọi lớp — OPS điểm danh liên môn, đúng precedent BuoiHocScreen) ──
export default function DiemDanhBuoi() {
  const [ngay, setNgay] = useState(homNayVN())
  const [list, setList] = useState<BuoiAo[]>([])
  const [tienDo, setTienDo] = useState<Record<string, { tong: number; daDanh: number }>>({})
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null) // buoi_hoc.id đang mở detail
  const [busyLop, setBusyLop] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try {
      const l = await buoiAoCuaNgay(ngay)
      l.sort((a, b) => a.slot.gio_bat_dau.localeCompare(b.slot.gio_bat_dau) || a.lop.ten_lop.localeCompare(b.lop.ten_lop, 'vi'))
      setList(l)
      setTienDo(await diemDanhTienDo(l.filter((b) => b.buoi && b.buoi.trang_thai !== 'huy').map((b) => b.buoi!.id)))
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [ngay]) // eslint-disable-line
  // App/tab quay lại foreground → refetch (2 đầu nhập ERP + app cùng 1 DB — Thùy 29/08).
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [ngay]) // eslint-disable-line

  async function mo(ba: BuoiAo) {
    setBusyLop(ba.lop.id); setErr(null)
    try { const b = await moBuoi(ba.lop.id, ngay, ba.slot); await reload(true); setOpenId(b.id) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusyLop(null) }
  }
  async function huy(ba: BuoiAo) {
    const lyDo = prompt(`Hủy buổi ${ba.lop.ten_lop} ngày ${ddmmVN(ngay)}?\nNhập lý do:`)
    if (lyDo == null || !lyDo.trim()) return
    setBusyLop(ba.lop.id); setErr(null)
    try { await huyBuoiCuaNgay(ba.lop.id, ngay, ba.slot, lyDo.trim()); await reload(true) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusyLop(null) }
  }

  if (openId) return <BuoiDetailOps buoiId={openId} onBack={() => { setOpenId(null); reload(true) }} />

  const homNay = homNayVN()
  const nhom = { chua: list.filter((b) => !b.buoi), mo: list.filter((b) => b.buoi && b.buoi.trang_thai !== 'huy'), huy: list.filter((b) => b.buoi?.trang_thai === 'huy') }
  return (
    <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
      {/* điều hướng ngày — nút to cho chạm */}
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => setNgay((n) => congNgay(n, -1))} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[18px] leading-none text-slate-600 active:bg-slate-100">‹</button>
        <button onClick={() => setNgay(homNay)} className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-[15px] font-semibold text-slate-800 active:bg-slate-100">
          {thuCuaNgay(ngay)} · {ddmmVN(ngay)}{ngay === homNay ? ' (hôm nay)' : ''}
        </button>
        <button onClick={() => setNgay((n) => congNgay(n, 1))} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[18px] leading-none text-slate-600 active:bg-slate-100">›</button>
      </div>
      {err && <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}

      {loading ? <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p> : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có buổi học nào ngày này.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {nhom.mo.length > 0 && (
            <section>
              <p className="mb-1.5 pl-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đã mở · {nhom.mo.length}</p>
              <div className="flex flex-col gap-2">
                {nhom.mo.map((ba) => {
                  const td = tienDo[ba.buoi!.id]
                  const du = td && td.tong > 0 && td.daDanh >= td.tong
                  return (
                    <button key={ba.lop.id} onClick={() => setOpenId(ba.buoi!.id)}
                      className="flex min-h-[56px] items-center gap-3 rounded-2xl border-l-4 border-emerald-500 bg-white px-4 py-3 text-left shadow-sm active:bg-slate-50">
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-slate-800">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-slate-400">· {ba.lop.mon}</span></p>
                        <p className="text-[12px] text-slate-500">{hhmm(ba.slot.gio_bat_dau)}–{hhmm(ba.slot.gio_ket_thuc)} · phòng {ba.slot.phong ?? '—'}</p>
                      </div>
                      {td && (
                        <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${du ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {du ? '✓ ' : ''}{td.daDanh}/{td.tong}
                        </span>
                      )}
                      <span className="text-slate-300">›</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}
          {nhom.chua.length > 0 && (
            <section>
              <p className="mb-1.5 pl-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chưa mở · {nhom.chua.length}</p>
              <div className="flex flex-col gap-2">
                {nhom.chua.map((ba) => (
                  <div key={ba.lop.id} className="flex min-h-[56px] items-center gap-2 rounded-2xl border-l-4 border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-slate-800">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-slate-400">· {ba.lop.mon}</span></p>
                      <p className="text-[12px] text-slate-500">{hhmm(ba.slot.gio_bat_dau)}–{hhmm(ba.slot.gio_ket_thuc)} · phòng {ba.slot.phong ?? '—'}</p>
                    </div>
                    <button onClick={() => huy(ba)} disabled={busyLop === ba.lop.id} className="rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-400 active:bg-rose-50 active:text-rose-600 disabled:opacity-40">Hủy</button>
                    <button onClick={() => mo(ba)} disabled={busyLop === ba.lop.id} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-[14px] font-semibold text-white active:bg-indigo-500 disabled:opacity-40">Mở buổi</button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {nhom.huy.length > 0 && (
            <section>
              <p className="mb-1.5 pl-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đã hủy · {nhom.huy.length}</p>
              <div className="flex flex-col gap-2">
                {nhom.huy.map((ba) => (
                  <div key={ba.lop.id} className="rounded-2xl border-l-4 border-rose-300 bg-white px-4 py-3 opacity-60 shadow-sm">
                    <p className="text-[15px] font-semibold text-slate-700">{ba.lop.ten_lop}</p>
                    <p className="text-[12px] text-slate-500">{hhmm(ba.slot.gio_bat_dau)}–{hhmm(ba.slot.gio_ket_thuc)}{ba.buoi?.ly_do_huy ? ` · Lý do: ${ba.buoi.ly_do_huy}` : ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

// ── Detail 1 buổi: roster + 3 nút điểm danh to (≥44px), báo đến PH, gỡ HS, hủy buổi, đổi GV dạy ──
function BuoiDetailOps({ buoiId, onBack }: { buoiId: string; onBack: () => void }) {
  const [buoi, setBuoi] = useState<(BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi: string | null }; gv_chinh_id: string | null }) | null>(null)
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [nsOpts, setNsOpts] = useState<Opt[]>([])
  const [baoDen, setBaoDen] = useState(false)
  const [suaGV, setSuaGV] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    const b = await getBuoi(buoiId)
    setBuoi(b)
    setRoster(await getRoster(buoiId))
  }
  useEffect(() => {
    (async () => {
      try { await dongBoSiSo(buoiId) } catch { /* sync sĩ số best-effort — HS ghi danh sau khi mở vẫn vào roster */ }
      await reload()
    })()
  }, [buoiId]) // eslint-disable-line
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') reload().catch(() => {}) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [buoiId]) // eslint-disable-line
  // Load NGAY khi mở detail (không đợi bấm ✎) — để nút GV hiện được TÊN thay vì "…".
  useEffect(() => {
    listNhanSu().then((ns) => setNsOpts(ns.map((n) => ({ id: n.id, label: n.ho_ten, img: (n as any).anh_url })))).catch(() => {})
  }, []) // eslint-disable-line

  async function danh(r: BuoiHocHS, d: DiemDanh) {
    setErr(null)
    try { await diemDanh(r.id, d); setRoster((rs) => rs.map((x) => (x.id === r.id ? { ...x, diem_danh: d } : x))) }
    catch (e: any) { setErr(e.message ?? String(e)); reload() }
  }
  async function xoa(r: BuoiHocHS) {
    if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi này?\n\nChỉ dùng khi xếp NHẦM lớp (data sai). Sẽ chặn nếu HS đã có bài chấm / điểm thật.`)) return
    try { await xoaHSKhoiBuoi(r); await reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function huyBuoiNay() {
    const lyDo = prompt('Hủy buổi này? Nhập lý do:')
    if (lyDo == null || !lyDo.trim()) return
    try { await huyBuoi(buoiId, lyDo.trim()); onBack() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function doiGV(id: string | null) {
    try { await setNguoiDay(buoiId, id); setSuaGV(false); await reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (!buoi) return <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
  const chuaDD = roster.filter((r) => !r.diem_danh).length
  const chuaBao = roster.filter((r) => r.diem_danh === 'co_mat' && !r.bao_den_at).length
  const tenHT = tenHienThiDs(roster.map((r) => r.hoc_sinh?.ho_ten))
  const gvId = buoi.nguoi_day ?? buoi.gv_chinh_id
  const gvTen = nsOpts.find((o) => o.id === gvId)?.label

  return (
    <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
      {/* header sticky: quay lại + tên lớp + tiến độ */}
      <div className="sticky top-0 z-10 -mx-3 mb-3 flex items-center gap-2 border-b border-slate-200 bg-[#f5f5f7]/95 px-3 py-2 backdrop-blur">
        <button onClick={onBack} className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-indigo-600 active:bg-indigo-50">‹ Buổi học</button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[15px] font-semibold text-slate-800">{buoi.lop?.ten_lop ?? '?'} · {ddmmVN(buoi.ngay)}</p>
          <p className="text-[11px] text-slate-400">{chuaDD > 0 ? `Còn ${chuaDD} HS chưa điểm danh` : '✓ Đã điểm danh đủ'}</p>
        </div>
        <button onClick={huyBuoiNay} className="rounded-xl px-3 py-2.5 text-[13px] text-slate-400 active:bg-rose-50 active:text-rose-600">Hủy buổi</button>
      </div>
      {err && <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}

      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => setBaoDen(true)}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm active:bg-emerald-500">
          📩 Báo đến PH{chuaBao ? ` (${chuaBao})` : ''}
        </button>
        {/* Dạy thay: hiện GV đang dạy, bấm đổi (setNguoiDay — cùng hành vi canManage của OPS ở ERP). */}
        {suaGV ? (
          <div className="min-w-[220px] flex-1"><SearchSelect value={gvId} onChange={doiGV} options={nsOpts} placeholder="Chọn GV dạy…" avatars autoFocus /></div>
        ) : (
          <button onClick={() => setSuaGV(true)} className="ml-auto rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-600 active:bg-slate-100">
            GV: {gvTen ?? (gvId ? '…' : 'chưa gán')} ✎
          </button>
        )}
      </div>
      {baoDen && <BaoDenModalOps roster={roster} onClose={() => setBaoDen(false)} onDone={reload} />}

      <div className="flex flex-col gap-2">
        {roster.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white py-2 pl-4 pr-2 shadow-sm">
            <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-slate-800">{tenHT[i]}</span>
            {(['co_mat', 'vang', 'vang_phep'] as DiemDanh[]).map((d) => (
              <button key={d} onClick={() => danh(r, d)}
                className={`min-h-[44px] rounded-xl px-3.5 text-[13px] font-semibold transition ${r.diem_danh === d ? DD_TONE[d] : 'bg-slate-100 text-slate-500 active:bg-slate-200'}`}>
                {DD_LABEL[d]}
              </button>
            ))}
            <button onClick={() => xoa(r)} title="Gỡ HS khỏi buổi (xếp nhầm lớp)" className="min-h-[44px] rounded-xl px-2 text-[14px] text-slate-300 active:bg-rose-50 active:text-rose-600">✕</button>
          </div>
        ))}
        {roster.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Buổi chưa có HS nào (lớp chưa ghi danh?).</p>}
      </div>
    </div>
  )
}

// Tin báo PH — NGHIỆP VỤ GIỮ NGUYÊN BuoiHocScreen.BaoDenModal: chỉ HS co_mat CHƯA báo; tin đầu = câu
// xác nhận đầy đủ, các tin sau = câu ngắn; copy xong markBaoDen (chỉ set khi còn NULL, state ở DB).
function BaoDenModalOps({ roster, onClose, onDone }: { roster: BuoiHocHS[]; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const chuaBao = roster.filter((r) => r.diem_danh === 'co_mat' && !r.bao_den_at)
  const daBao = roster.filter((r) => r.diem_danh === 'co_mat' && r.bao_den_at)
  const ten = (r: BuoiHocHS) => (r.hoc_sinh?.ho_ten ?? '?').trim().split(/\s+/).slice(-2).join(' ')
  const dsTen = chuaBao.map(ten).join(', ')
  const msg = !chuaBao.length ? '' : daBao.length ? `${dsTen} đã đến lớp.` : `Trung tâm xác nhận buổi học hôm nay đã có ${dsTen} đã đến lớp.`

  async function copyAndMark() {
    if (!chuaBao.length || busy) return
    setBusy(true)
    try {
      try { await navigator.clipboard.writeText(msg) } catch { /* clipboard bị chặn → OPS copy tay từ ô */ }
      await markBaoDen(chuaBao.map((r) => r.id))
      setCopied(true); onDone()
      setTimeout(onClose, 700)
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[440px] max-w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-slate-900">📩 Tin báo phụ huynh</span>
          <button onClick={onClose} className="ml-auto min-h-[40px] px-2 text-slate-400 active:text-slate-600">✕</button>
        </div>
        {chuaBao.length === 0 ? (
          <div className="rounded-lg bg-slate-50 px-3 py-6 text-center text-[13px] text-slate-400">
            {daBao.length ? 'Tất cả HS có mặt đều đã được báo đến. Chưa có HS mới.' : 'Chưa có HS nào điểm danh "có mặt".'}
          </div>
        ) : (
          <>
            <p className="mb-2 text-[12px] text-slate-500">{chuaBao.length} HS mới đến{daBao.length ? ` · ${daBao.length} đã báo trước đó` : ''}:</p>
            <textarea readOnly value={msg} rows={3} onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] leading-relaxed text-slate-800" />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={onClose} className="min-h-[44px] rounded-xl px-4 text-[13px] text-slate-500 active:bg-slate-100">Đóng</button>
              <button onClick={copyAndMark} disabled={busy}
                className="min-h-[44px] rounded-xl bg-indigo-600 px-4 text-[13px] font-semibold text-white shadow-sm active:bg-indigo-500 disabled:opacity-40">{copied ? '✓ Đã copy & đánh dấu' : busy ? '…' : 'Copy & đánh dấu đã gửi'}</button>
            </div>
          </>
        )}
        {daBao.length > 0 && (
          <details className="mt-3 text-[12px] text-slate-400">
            <summary className="cursor-pointer select-none">Đã báo đến trước đó ({daBao.length})</summary>
            <div className="mt-1 leading-relaxed">{daBao.map(ten).join(', ')}</div>
          </details>
        )}
      </div>
    </div>, document.body)
}
