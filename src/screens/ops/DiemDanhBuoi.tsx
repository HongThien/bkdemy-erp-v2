// Màn ĐIỂM DANH của app OPS (PLAN-app-ops.md §3) — touch-first, KHÔNG import BuoiHocScreen.
// Logic ghi = CÙNG seam lib/gami với ERP; nghiệp vụ giữ NGUYÊN (bấm là ghi, báo đến PH chỉ HS co_mat
// chưa báo, gỡ HS chặn khi có đo thật). UI REDESIGN 30/08 (Thùy duyệt mockup): màu chủ đạo LỤC, hero
// đậm + progress bar, avatar HS (anh_url, fallback chữ cái nền màu), 3 nút điểm danh = segmented pill.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  buoiAoCuaNgay, moBuoi, getBuoi, getRoster, diemDanh, markBaoDen, xoaHSKhoiBuoi, dongBoSiSo,
  huyBuoiCuaNgay, huyBuoi, moLaiBuoiDaHuy, setNguoiDay, diemDanhTienDo,
  type BuoiAo, type BuoiHoc, type BuoiHocHS, type DiemDanh,
} from '../../lib/gami'
import { listNhanSu } from '../../lib/nhansu'
import { homNayVN, congNgay, thuCuaNgay, ddmmVN } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import SearchSelect, { type Opt } from '../../components/SearchSelect'

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '—')
const DD_LABEL: Record<DiemDanh, string> = { co_mat: 'Có', vang: 'Vắng', vang_phep: 'Phép' }
const DD_SEL: Record<DiemDanh, string> = { co_mat: 'bg-emerald-600 text-white', vang: 'bg-rose-500 text-white', vang_phep: 'bg-amber-500 text-white' }

// Avatar HS: ảnh nếu có, không thì 2 chữ cái đầu của tên-rút-gọn trên nền màu ổn định theo tên.
const AVA_TONES = ['bg-rose-100 text-rose-800', 'bg-amber-100 text-amber-800', 'bg-emerald-100 text-emerald-800', 'bg-sky-100 text-sky-800', 'bg-violet-100 text-violet-800', 'bg-pink-100 text-pink-800']
function Ava({ ten, img }: { ten: string; img: string | null | undefined }) {
  if (img) return <img src={img} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200" />
  const words = ten.trim().split(/\s+/)
  const ini = words.slice(-2).map((w) => w.charAt(0).toUpperCase()).join('')
  let h = 0; for (const c of ten) h = (h * 31 + c.charCodeAt(0)) % 997
  return <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${AVA_TONES[h % AVA_TONES.length]}`}>{ini}</span>
}

// ── Danh sách buổi của 1 ngày (mọi lớp — OPS điểm danh liên môn, đúng precedent BuoiHocScreen) ──
export default function DiemDanhBuoi() {
  const [ngay, setNgay] = useState(homNayVN())
  const [list, setList] = useState<BuoiAo[]>([])
  const [tienDo, setTienDo] = useState<Record<string, { tong: number; daDanh: number }>>({})
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
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

  // Mở lại buổi hủy NHẦM → về "Đã mở" và vào thẳng buổi (như vừa bấm "Mở buổi").
  async function moLai(ba: BuoiAo) {
    if (!ba.buoi || !confirm(`Mở lại buổi ${ba.lop.ten_lop} ngày ${ddmmVN(ngay)}?\nBuổi sẽ về trạng thái "Đã mở" và tính lại sĩ số.`)) return
    setBusyLop(ba.lop.id); setErr(null)
    try { await moLaiBuoiDaHuy(ba.buoi.id); await reload(true); setOpenId(ba.buoi.id) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusyLop(null) }
  }

  if (openId) return <BuoiDetailOps buoiId={openId} onBack={() => { setOpenId(null); reload(true) }} />

  const homNay = homNayVN()
  const nhom = { chua: list.filter((b) => !b.buoi), mo: list.filter((b) => b.buoi && b.buoi.trang_thai !== 'huy'), huy: list.filter((b) => b.buoi?.trang_thai === 'huy') }
  const daXong = nhom.mo.filter((b) => { const td = tienDo[b.buoi!.id]; return td && td.tong > 0 && td.daDanh >= td.tong }).length

  return (
    <div>
      {/* hero lục: tiêu đề + điều hướng ngày */}
      <div className="bg-emerald-700 px-4 pb-4" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[760px]">
          <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-200">Điểm danh buổi học</p>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={() => setNgay((n) => congNgay(n, -1))} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-[17px] leading-none text-white active:bg-emerald-500">‹</button>
            <button onClick={() => setNgay(homNay)} className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-[15px] font-bold text-white active:bg-emerald-500">
              {thuCuaNgay(ngay)} · {ddmmVN(ngay)}{ngay === homNay ? ' (hôm nay)' : ''}
            </button>
            <button onClick={() => setNgay((n) => congNgay(n, 1))} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-[17px] leading-none text-white active:bg-emerald-500">›</button>
          </div>
          {!loading && list.length > 0 && (
            <p className="mt-2 text-[12.5px] text-emerald-100">{nhom.mo.length} đã mở ({daXong} điểm danh đủ) · {nhom.chua.length} chưa mở{nhom.huy.length ? ` · ${nhom.huy.length} hủy` : ''}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {err && <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}
        {loading ? <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p> : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-14 text-center">
            <p className="text-[28px]">🌤️</p>
            <p className="mt-1 text-sm text-slate-400">Ngày này không có buổi học nào.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {nhom.mo.length > 0 && (
              <section>
                <p className="mb-1.5 pl-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Đã mở · {nhom.mo.length}</p>
                <div className="flex flex-col gap-2">
                  {nhom.mo.map((ba) => {
                    const td = tienDo[ba.buoi!.id]
                    const du = td && td.tong > 0 && td.daDanh >= td.tong
                    return (
                      <button key={ba.lop.id} onClick={() => setOpenId(ba.buoi!.id)}
                        className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3.5 py-3 text-left shadow-sm active:bg-slate-50">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold ${du ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{hhmm(ba.slot.gio_bat_dau)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-bold text-slate-800">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-slate-400">· {ba.lop.mon}</span></p>
                          <p className="text-[12px] text-slate-500">đến {hhmm(ba.slot.gio_ket_thuc)} · phòng {ba.slot.phong ?? '—'}</p>
                        </div>
                        {td && (
                          <span className={`rounded-full px-2.5 py-1 text-[12.5px] font-bold ${du ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
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
                <p className="mb-1.5 pl-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Chưa mở · {nhom.chua.length}</p>
                <div className="flex flex-col gap-2">
                  {nhom.chua.map((ba) => (
                    <div key={ba.lop.id} className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[13px] font-bold text-slate-500">{hhmm(ba.slot.gio_bat_dau)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-slate-800">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-slate-400">· {ba.lop.mon}</span></p>
                        <p className="text-[12px] text-slate-500">đến {hhmm(ba.slot.gio_ket_thuc)} · phòng {ba.slot.phong ?? '—'}</p>
                      </div>
                      <button onClick={() => huy(ba)} disabled={busyLop === ba.lop.id} className="rounded-xl px-2.5 py-2.5 text-[13px] font-medium text-slate-400 active:bg-rose-50 active:text-rose-600 disabled:opacity-40">Hủy</button>
                      <button onClick={() => mo(ba)} disabled={busyLop === ba.lop.id} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-[14px] font-bold text-white active:bg-emerald-500 disabled:opacity-40">Mở buổi</button>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {nhom.huy.length > 0 && (
              <section>
                <p className="mb-1.5 pl-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Đã hủy · {nhom.huy.length}</p>
                <div className="flex flex-col gap-2">
                  {nhom.huy.map((ba) => (
                    <div key={ba.lop.id} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm">
                      <div className="min-w-0 flex-1 opacity-60">
                        <p className="text-[14px] font-bold text-slate-700">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-slate-400">· {hhmm(ba.slot.gio_bat_dau)}–{hhmm(ba.slot.gio_ket_thuc)}</span></p>
                        {ba.buoi?.ly_do_huy && <p className="text-[12px] text-slate-500">Lý do: {ba.buoi.ly_do_huy}</p>}
                      </div>
                      <button onClick={() => moLai(ba)} disabled={busyLop === ba.lop.id} title="Hủy nhầm? Mở lại buổi này"
                        className="shrink-0 rounded-xl border border-emerald-200 px-3 py-2.5 text-[13px] font-semibold text-emerald-700 active:bg-emerald-50 disabled:opacity-40">Mở lại</button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Detail 1 buổi: hero lục + progress bar, roster avatar + segmented điểm danh ──
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
      try { await dongBoSiSo(buoiId) } catch { /* sync sĩ số best-effort */ }
      await reload()
    })()
  }, [buoiId]) // eslint-disable-line
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') reload().catch(() => {}) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [buoiId]) // eslint-disable-line
  // Load NGAY khi mở detail — để nút GV hiện được TÊN thay vì "…".
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
  const daDanh = roster.filter((r) => r.diem_danh).length
  const chuaDD = roster.length - daDanh
  const chuaBao = roster.filter((r) => r.diem_danh === 'co_mat' && !r.bao_den_at).length
  const tenHT = tenHienThiDs(roster.map((r) => r.hoc_sinh?.ho_ten))
  const gvId = buoi.nguoi_day ?? buoi.gv_chinh_id
  const gvTen = nsOpts.find((o) => o.id === gvId)?.label

  return (
    <div>
      {/* hero lục: quay lại + lớp + tiến độ */}
      <div className="bg-emerald-700 px-4 pb-4" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[760px]">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="-ml-1 rounded-xl px-2 py-2 text-[14px] font-bold text-emerald-100 active:bg-emerald-600">‹ Buổi học</button>
            <button onClick={huyBuoiNay} className="ml-auto rounded-xl px-2.5 py-2 text-[12.5px] text-emerald-200 active:bg-emerald-600">Hủy buổi</button>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[19px] font-bold text-white">{buoi.lop?.ten_lop ?? '?'} <span className="text-[13px] font-normal text-emerald-200">· {buoi.lop?.mon ?? ''}</span></p>
              <p className="text-[12.5px] text-emerald-200">{ddmmVN(buoi.ngay)} · {hhmm(buoi.gio_bat_dau)}–{hhmm(buoi.gio_ket_thuc)} · {buoi.phong ?? '—'}{gvTen ? ` · GV ${gvTen.trim().split(/\s+/).slice(-2).join(' ')}` : ''}</p>
            </div>
            <span className="rounded-full bg-emerald-900/50 px-3 py-1.5 text-[13.5px] font-bold text-emerald-100">{daDanh}/{roster.length}</span>
          </div>
          <div className="mt-2.5 h-1.5 rounded-full bg-emerald-900/40">
            <div className="h-1.5 rounded-full bg-emerald-200 transition-all" style={{ width: roster.length ? `${(daDanh / roster.length) * 100}%` : '0%' }} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {err && <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}
        <div className="mb-3 flex items-center gap-2">
          <button onClick={() => setBaoDen(true)}
            className="min-h-[44px] flex-1 rounded-2xl border border-slate-200/70 bg-white px-4 text-[14px] font-bold text-emerald-700 shadow-sm active:bg-emerald-50">
            💬 Báo đến PH{chuaBao ? ` (${chuaBao})` : ''}
          </button>
          {suaGV ? (
            <div className="min-w-[220px] flex-1"><SearchSelect value={gvId} onChange={doiGV} options={nsOpts} placeholder="Chọn GV dạy…" avatars autoFocus /></div>
          ) : (
            <button onClick={() => setSuaGV(true)} className="min-h-[44px] rounded-2xl border border-slate-200/70 bg-white px-4 text-[13px] text-slate-500 shadow-sm active:bg-slate-100">GV ✎</button>
          )}
        </div>
        {baoDen && <BaoDenModalOps roster={roster} onClose={() => setBaoDen(false)} onDone={reload} />}

        <div className="flex flex-col gap-2">
          {roster.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white py-2 pl-3 pr-1.5 shadow-sm">
              <Ava ten={tenHT[i] ?? '?'} img={r.hoc_sinh?.anh_url} />
              <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-slate-800">{tenHT[i]}</span>
              <div className="flex shrink-0 rounded-full bg-slate-100 p-1">
                {(['co_mat', 'vang', 'vang_phep'] as DiemDanh[]).map((d) => (
                  <button key={d} onClick={() => danh(r, d)}
                    className={`min-h-[38px] rounded-full px-3.5 text-[12.5px] font-bold transition ${r.diem_danh === d ? DD_SEL[d] : 'text-slate-500 active:bg-slate-200'}`}>
                    {DD_LABEL[d]}
                  </button>
                ))}
              </div>
              <button onClick={() => xoa(r)} title="Gỡ HS khỏi buổi (xếp nhầm lớp)" className="min-h-[44px] rounded-xl px-1.5 text-[13px] text-slate-300 active:bg-rose-50 active:text-rose-600">✕</button>
            </div>
          ))}
          {roster.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Buổi chưa có HS nào (lớp chưa ghi danh?).</p>}
        </div>
        {roster.length > 0 && (
          <p className="mt-3 text-center text-[12.5px] text-slate-400">{chuaDD > 0 ? `Còn ${chuaDD} bạn chưa điểm danh` : '✓ Đã điểm danh đủ cả lớp'}</p>
        )}
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
      <div className="w-[440px] max-w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[15px] font-bold text-slate-900">💬 Tin báo phụ huynh</span>
          <button onClick={onClose} className="ml-auto min-h-[40px] px-2 text-slate-400 active:text-slate-600">✕</button>
        </div>
        {chuaBao.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-3 py-6 text-center text-[13px] text-slate-400">
            {daBao.length ? 'Tất cả HS có mặt đều đã được báo đến. Chưa có HS mới.' : 'Chưa có HS nào điểm danh "có mặt".'}
          </div>
        ) : (
          <>
            <p className="mb-2 text-[12.5px] text-slate-500">{chuaBao.length} HS mới đến{daBao.length ? ` · ${daBao.length} đã báo trước đó` : ''}:</p>
            <textarea readOnly value={msg} rows={3} onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] leading-relaxed text-slate-800" />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={onClose} className="min-h-[44px] rounded-xl px-4 text-[13px] text-slate-500 active:bg-slate-100">Đóng</button>
              <button onClick={copyAndMark} disabled={busy}
                className="min-h-[44px] rounded-xl bg-emerald-600 px-4 text-[13.5px] font-bold text-white shadow-sm active:bg-emerald-500 disabled:opacity-40">{copied ? '✓ Đã copy & đánh dấu' : busy ? '…' : 'Copy & đánh dấu đã gửi'}</button>
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
