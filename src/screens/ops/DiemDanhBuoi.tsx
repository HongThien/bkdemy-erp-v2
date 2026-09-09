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
import { OA, OpsHero, OpsSegmented, OpsEmptyState, IcoCalendar } from '../../components/ops/OpsUI'

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
  // Lọc HIỂN THỊ theo nhóm (Tất cả/Đã mở/Chưa mở/Đã hủy) — thuần UI trên list đã fetch, không đổi dữ liệu.
  const [loc, setLoc] = useState<'tatca' | 'mo' | 'chua' | 'huy'>('tatca')

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

  const LOC_TABS = ([
    { key: 'tatca', label: `Tất cả (${list.length})` }, { key: 'mo', label: `Đã mở (${nhom.mo.length})` }, { key: 'chua', label: `Chưa mở (${nhom.chua.length})` },
    ...(nhom.huy.length ? [{ key: 'huy' as const, label: `Đã hủy (${nhom.huy.length})` }] : []),
  ] as const)
  const hienMo = loc === 'tatca' || loc === 'mo', hienChua = loc === 'tatca' || loc === 'chua', hienHuy = loc === 'tatca' || loc === 'huy'

  return (
    <div>
      {/* hero lục: icon lịch-check · tiêu đề · điều hướng ngày (pill trắng nổi) */}
      <OpsHero tone="green" title="Điểm danh buổi học" right={<img src={OA('attendance/header_calendar_badge.svg')} alt="" className="h-9 w-9" draggable={false} />}>
        <div className="relative mx-auto mt-2.5 flex max-w-[760px] items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-sm">
          <button onClick={() => setNgay((n) => congNgay(n, -1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E0FBE9] text-[15px] font-bold text-[#0E6B37] active:bg-[#c9f5d9]">‹</button>
          <button onClick={() => setNgay(homNay)} className="flex flex-1 items-center justify-center gap-1.5 text-[13.5px] font-extrabold text-[#16224D]">
            <IcoCalendar cls="h-4 w-4 text-[#16A34A]" />{thuCuaNgay(ngay)} · {ddmmVN(ngay)}{ngay === homNay ? ' (hôm nay)' : ''}
          </button>
          <button onClick={() => setNgay((n) => congNgay(n, 1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E0FBE9] text-[15px] font-bold text-[#0E6B37] active:bg-[#c9f5d9]">›</button>
        </div>
      </OpsHero>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {err && <p className="mb-2 rounded-2xl bg-[#FFE1E7] px-3 py-2 text-[13px] text-[#9F2244]">{err}</p>}
        {loading ? <p className="py-10 text-center text-sm text-[#9AA5C4]">Đang tải…</p> : list.length === 0 ? (
          <OpsEmptyState icon={<span className="text-[40px]">🌤️</span>} title="Ngày này không có buổi học nào" />
        ) : (
          <>
            <div className="mb-3"><OpsSegmented value={loc} onChange={setLoc} items={LOC_TABS as any} tone="green" /></div>
            {!loading && list.length > 0 && (
              <p className="mb-2 px-1 text-[11.5px] font-semibold text-[#6B7AAE]">{nhom.mo.length} đã mở ({daXong} điểm danh đủ) · {nhom.chua.length} chưa mở{nhom.huy.length ? ` · ${nhom.huy.length} hủy` : ''}</p>
            )}
            <div className="flex flex-col gap-4">
              {hienMo && nhom.mo.length > 0 && (
                <section>
                  <p className="mb-1.5 pl-1 text-[11px] font-bold uppercase tracking-wide text-[#9AA5C4]">Đã mở · {nhom.mo.length}</p>
                  <div className="flex flex-col gap-2">
                    {nhom.mo.map((ba) => {
                      const td = tienDo[ba.buoi!.id]
                      const du = td && td.tong > 0 && td.daDanh >= td.tong
                      return (
                        <button key={ba.lop.id} onClick={() => setOpenId(ba.buoi!.id)}
                          className="flex min-h-[64px] items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-left shadow-sm active:bg-[#F7F9FF]">
                          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[12.5px] font-bold ${du ? 'bg-[#E0FBE9] text-[#0E6B37]' : 'bg-[#FFF3D6] text-[#93600A]'}`}>{hhmm(ba.slot.gio_bat_dau)}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-bold text-[#16224D]">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-[#9AA5C4]">· {ba.lop.mon}</span></p>
                            <p className="text-[12px] text-[#6B7AAE]">đến {hhmm(ba.slot.gio_ket_thuc)} · phòng {ba.slot.phong ?? '—'}</p>
                          </div>
                          {td && (
                            <span className={`rounded-full px-2.5 py-1 text-[12.5px] font-bold ${du ? 'bg-[#E0FBE9] text-[#0E6B37]' : 'bg-[#FFF3D6] text-[#93600A]'}`}>
                              {du ? '✓ ' : ''}{td.daDanh}/{td.tong}
                            </span>
                          )}
                          <span className="text-[#C7D0E8]">›</span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              )}
              {hienChua && nhom.chua.length > 0 && (
                <section>
                  <p className="mb-1.5 pl-1 text-[11px] font-bold uppercase tracking-wide text-[#9AA5C4]">Chưa mở · {nhom.chua.length}</p>
                  <div className="flex flex-col gap-2">
                    {nhom.chua.map((ba) => (
                      <div key={ba.lop.id} className="flex min-h-[64px] items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1F3FA] text-[12.5px] font-bold text-[#6B7AAE]">{hhmm(ba.slot.gio_bat_dau)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-bold text-[#16224D]">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-[#9AA5C4]">· {ba.lop.mon}</span></p>
                          <p className="text-[12px] text-[#6B7AAE]">đến {hhmm(ba.slot.gio_ket_thuc)} · phòng {ba.slot.phong ?? '—'}</p>
                        </div>
                        <button onClick={() => huy(ba)} disabled={busyLop === ba.lop.id} className="rounded-xl px-2.5 py-2.5 text-[13px] font-medium text-[#9AA5C4] active:bg-[#FFE1E7] active:text-[#9F2244] disabled:opacity-40">Hủy</button>
                        <button onClick={() => mo(ba)} disabled={busyLop === ba.lop.id} className="rounded-full bg-[#16A34A] px-4 py-2.5 text-[14px] font-bold text-white active:bg-[#0E8A46] disabled:opacity-40">Mở buổi</button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {hienHuy && nhom.huy.length > 0 && (
                <section>
                  <p className="mb-1.5 pl-1 text-[11px] font-bold uppercase tracking-wide text-[#9AA5C4]">Đã hủy · {nhom.huy.length}</p>
                  <div className="flex flex-col gap-2">
                    {nhom.huy.map((ba) => (
                      <div key={ba.lop.id} className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
                        <div className="min-w-0 flex-1 opacity-60">
                          <p className="text-[14px] font-bold text-[#16224D]">{ba.lop.ten_lop} <span className="text-[12px] font-normal text-[#9AA5C4]">· {hhmm(ba.slot.gio_bat_dau)}–{hhmm(ba.slot.gio_ket_thuc)}</span></p>
                          {ba.buoi?.ly_do_huy && <p className="text-[12px] text-[#6B7AAE]">Lý do: {ba.buoi.ly_do_huy}</p>}
                        </div>
                        <button onClick={() => moLai(ba)} disabled={busyLop === ba.lop.id} title="Hủy nhầm? Mở lại buổi này"
                          className="shrink-0 rounded-xl bg-[#E0FBE9] px-3 py-2.5 text-[13px] font-semibold text-[#0E6B37] active:bg-[#c9f5d9] disabled:opacity-40">Mở lại</button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
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
      <OpsHero tone="green" onBack={onBack} title="" right={
        <button onClick={huyBuoiNay} className="shrink-0 rounded-full bg-white/15 px-2.5 py-1.5 text-[12px] font-semibold text-white active:bg-white/25">Hủy buổi</button>
      }>
        <div className="relative mx-auto -mt-1 flex max-w-[760px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[19px] font-extrabold text-white">{buoi.lop?.ten_lop ?? '?'} <span className="text-[13px] font-normal text-white/70">· {buoi.lop?.mon ?? ''}</span></p>
            <p className="text-[12px] text-white/75">{ddmmVN(buoi.ngay)} · {hhmm(buoi.gio_bat_dau)}–{hhmm(buoi.gio_ket_thuc)} · {buoi.phong ?? '—'}{gvTen ? ` · GV ${gvTen.trim().split(/\s+/).slice(-2).join(' ')}` : ''}</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1.5 text-[13.5px] font-bold text-white">{daDanh}/{roster.length}</span>
        </div>
        <div className="relative mx-auto mt-2.5 h-1.5 max-w-[760px] rounded-full bg-black/15">
          <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: roster.length ? `${(daDanh / roster.length) * 100}%` : '0%' }} />
        </div>
      </OpsHero>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {err && <p className="mb-2 rounded-2xl bg-[#FFE1E7] px-3 py-2 text-[13px] text-[#9F2244]">{err}</p>}
        <div className="mb-3 flex items-center gap-2">
          <button onClick={() => setBaoDen(true)}
            className="min-h-[44px] flex-1 rounded-2xl bg-white px-4 text-[14px] font-bold text-[#0E6B37] shadow-sm active:bg-[#F7F9FF]">
            💬 Báo đến PH{chuaBao ? ` (${chuaBao})` : ''}
          </button>
          {suaGV ? (
            <div className="min-w-[220px] flex-1"><SearchSelect value={gvId} onChange={doiGV} options={nsOpts} placeholder="Chọn GV dạy…" avatars autoFocus /></div>
          ) : (
            <button onClick={() => setSuaGV(true)} className="min-h-[44px] rounded-2xl bg-white px-4 text-[13px] text-[#6B7AAE] shadow-sm active:bg-[#F7F9FF]">GV ✎</button>
          )}
        </div>
        {baoDen && <BaoDenModalOps roster={roster} onClose={() => setBaoDen(false)} onDone={reload} />}

        <div className="flex flex-col gap-2">
          {roster.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2.5 rounded-2xl bg-white py-2 pl-3 pr-1.5 shadow-sm">
              <Ava ten={tenHT[i] ?? '?'} img={r.hoc_sinh?.anh_url} />
              <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-[#16224D]">{tenHT[i]}</span>
              <div className="flex shrink-0 rounded-full bg-[#F1F3FA] p-1">
                {(['co_mat', 'vang', 'vang_phep'] as DiemDanh[]).map((d) => (
                  <button key={d} onClick={() => danh(r, d)}
                    className={`min-h-[38px] rounded-full px-3.5 text-[12.5px] font-bold transition ${r.diem_danh === d ? DD_SEL[d] : 'text-[#6B7AAE] active:bg-[#E5E9F5]'}`}>
                    {DD_LABEL[d]}
                  </button>
                ))}
              </div>
              <button onClick={() => xoa(r)} title="Gỡ HS khỏi buổi (xếp nhầm lớp)" className="min-h-[44px] rounded-xl px-1.5 text-[13px] text-[#C7D0E8] active:bg-[#FFE1E7] active:text-[#9F2244]">✕</button>
            </div>
          ))}
          {roster.length === 0 && <p className="py-8 text-center text-sm text-[#9AA5C4]">Buổi chưa có HS nào (lớp chưa ghi danh?).</p>}
        </div>
        {roster.length > 0 && (
          <p className="mt-3 text-center text-[12.5px] text-[#6B7AAE]">{chuaDD > 0 ? `Còn ${chuaDD} bạn chưa điểm danh` : '✓ Đã điểm danh đủ cả lớp'}</p>
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
