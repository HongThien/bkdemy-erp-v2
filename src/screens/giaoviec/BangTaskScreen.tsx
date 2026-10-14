// BẢNG TASK PHÁT TRIỂN (leaf `giaoviec`) — hệ MỚI làm lại từ đầu (Thùy 14/10, thay Idea → Backlog → Weekly).
// Chu kỳ: họp tuần → cấp trên giao task cho CẤP DƯỚI (theo sơ đồ tổ chức) → người làm cập nhật / báo xong →
// ĐẾN HẠN cấp trên đánh giá: DUYỆT (ghi % kết quả) · hoặc GIA HẠN / HUỶ (quyết có đánh cờ trễ deadline = 1 gậy hay không).
// Ngang nhau / lên trên: dùng ORDER (Trang chính › Bảng Order). Dùng chung cho ERP và app PT.
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import SearchSelect from '../../components/SearchSelect'
import {
  listTaskBang, listCapDuoi, listTaskLog, giaoTask, capNhatTask, baoXongTask, duyetTask, giaHanTask, huyTask,
  TEN_TASK, dangMoTask, type TaskBang, type TaskLog, type TrangThaiTask,
} from '../../lib/taskPt'
import { homNayVN } from '../../lib/tuan'

const MAU: Record<TrangThaiTask, string> = {
  dang_lam: 'bg-indigo-100 text-indigo-700', cho_duyet: 'bg-amber-100 text-amber-700', da_duyet: 'bg-emerald-100 text-emerald-700', huy: 'bg-slate-200 text-slate-500',
}
const ddmm = (iso: string) => { const [, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}` }
const gio = (iso: string) => new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
const pct = (t: TaskBang) => (t.trang_thai === 'da_duyet' ? Math.round(Number(t.ket_qua_pct ?? 0)) : Math.max(0, Math.min(100, Math.round(Number(t.tien_do_bao_cao ?? 0)))))
const congNgay = (iso: string, n: number) => { const [y, m, d] = iso.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1, d + n)); return t.toISOString().slice(0, 10) }
const inp = 'w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-400'

function nhanLog(l: TaskLog): string {
  switch (l.hanh_dong) {
    case 'giao': return `Giao task${l.han_moi ? ` · hạn ${ddmm(l.han_moi)}` : ''}`
    case 'cap_nhat': return `Cập nhật${l.pct != null ? ` ${Math.round(Number(l.pct))}%` : ''}`
    case 'bao_xong': return 'Báo xong'
    case 'duyet': return `Cấp trên duyệt: ${Math.round(Number(l.pct ?? 0))}%`
    case 'gia_han': return `Gia hạn ${l.han_cu ? ddmm(l.han_cu) : ''} → ${l.han_moi ? ddmm(l.han_moi) : ''}${l.co_tre ? ' · 🏴 đánh cờ trễ deadline' : ' · không đánh cờ'}`
    case 'huy': return `Huỷ task${l.co_tre ? ' · 🏴 đánh cờ trễ deadline' : ''}`
  }
}

function FormGiao({ onXong, onDong }: { onXong: () => void; onDong: () => void }) {
  const [opts, setOpts] = useState<{ id: string; label: string }[] | null>(null)
  const [nguoi, setNguoi] = useState<string | null>(null)
  const [ten, setTen] = useState('')
  const [moTa, setMoTa] = useState('')
  const [han, setHan] = useState('')
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { listCapDuoi().then((r) => setOpts(r.map((x) => ({ id: x.nhan_su_id, label: x.ho_ten })))).catch(() => setOpts([])) }, [])
  const gui = async () => {
    if (!nguoi || !ten.trim() || !han) return
    setDang(true); setLoi(null)
    try { await giaoTask(nguoi, ten.trim(), moTa.trim() || null, han); onXong() }
    catch (e: any) { setLoi(e?.message ?? String(e)); setDang(false) }
  }
  return (
    <div className="mb-4 space-y-2 rounded-xl border border-indigo-200 bg-white p-4 shadow-sm">
      <p className="text-[13px] font-semibold text-slate-800">Giao task mới <span className="font-normal text-slate-400">— chỉ giao được cho cấp dưới của bạn</span></p>
      {opts && opts.length === 0 ? (
        <p className="text-[13px] text-amber-700">Bạn chưa có cấp dưới nào trong sơ đồ tổ chức. Muốn nhờ người ngang cấp hoặc cấp trên, hãy đặt <b>Order</b> ở Trang chính.</p>
      ) : (
        <>
          <SearchSelect value={nguoi} onChange={setNguoi} options={opts ?? []} avatars allowClear={false} placeholder="Giao cho… (gõ tên)" />
          <input value={ten} onChange={(e) => setTen(e.target.value)} maxLength={200} placeholder="Tên task (ngắn, làm gì)" className={inp} />
          <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} rows={2} placeholder="Kết quả mong muốn (không bắt buộc)" className={`${inp} resize-none`} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] text-slate-500">Hạn <b className="text-rose-500">*</b>
              <input type="date" value={han} min={homNayVN()} onChange={(e) => setHan(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] text-slate-800" />
            </label>
            {loi && <span className="text-[12.5px] text-rose-600">{loi}</span>}
            <span className="ml-auto flex gap-2">
              <button onClick={onDong} className="px-3 py-1.5 text-[13px] text-slate-500 hover:text-slate-800">Thôi</button>
              <button onClick={gui} disabled={dang || !nguoi || !ten.trim() || !han} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">{dang ? 'Đang giao…' : 'Giao task'}</button>
            </span>
          </div>
        </>
      )}
    </div>
  )
}

// Khối ĐÁNH GIÁ của cấp trên: duyệt / gia hạn / huỷ. Đến hạn thì mở sẵn.
function DanhGia({ t, onXong }: { t: TaskBang; onXong: () => void }) {
  const [che, setChe] = useState<'duyet' | 'gia_han' | 'huy'>(t.trang_thai === 'cho_duyet' ? 'duyet' : 'gia_han')
  const [kq, setKq] = useState('100')
  const [nhanXet, setNhanXet] = useState('')
  const [hanMoi, setHanMoi] = useState(congNgay(t.han > homNayVN() ? t.han : homNayVN(), 7))
  const [lyDo, setLyDo] = useState('')
  const [coTre, setCoTre] = useState(false)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const chay = async (f: () => Promise<void>) => {
    setDang(true); setLoi(null)
    try { await f(); onXong() } catch (e: any) { setLoi(e?.message ?? String(e)); setDang(false) }
  }
  const tab = (k: typeof che, ten: string) => (
    <button onClick={() => setChe(k)} className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${che === k ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{ten}</button>
  )
  return (
    <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
      <p className="mb-2 text-[12.5px] font-bold text-indigo-800">Đánh giá task{t.den_han ? ' — đã đến hạn' : ''}</p>
      <div className="mb-2 flex flex-wrap gap-1.5">{tab('duyet', '✓ Xong — duyệt')}{tab('gia_han', '⏳ Chưa xong — gia hạn')}{tab('huy', '✕ Huỷ task')}</div>
      {che === 'duyet' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] text-slate-600">Kết quả task đạt
            <input value={kq} onChange={(e) => setKq(e.target.value.replace(/\D/g, '').slice(0, 3))} inputMode="numeric" className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center text-[13px]" /> %
          </label>
          <input value={nhanXet} onChange={(e) => setNhanXet(e.target.value)} maxLength={300} placeholder="Nhận xét (không bắt buộc)" className={inp} />
          <button disabled={dang || kq === '' || Number(kq) > 100} onClick={() => chay(() => duyetTask(t.id, Number(kq), nhanXet.trim() || null))}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">Duyệt task</button>
        </div>
      )}
      {che !== 'duyet' && (
        <div className="space-y-2">
          {che === 'gia_han' && (
            <label className="flex items-center gap-2 text-[13px] text-slate-600">Hạn mới
              <input type="date" value={hanMoi} min={congNgay(t.han, 1)} onChange={(e) => setHanMoi(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px]" />
            </label>
          )}
          <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} maxLength={300} placeholder={che === 'gia_han' ? 'Lý do gia hạn (bắt buộc)' : 'Lý do huỷ (bắt buộc)'} className={inp} />
          <label className="flex items-center gap-2 text-[13px] text-slate-700">
            <input type="checkbox" checked={coTre} onChange={(e) => setCoTre(e.target.checked)} />
            🏴 Đánh cờ <b>trễ deadline</b> cho {t.nguoi_lam_ten} <span className="text-slate-400">(= 1 gậy — cấp trên quyết tuỳ lý do)</span>
          </label>
          <button disabled={dang || !lyDo.trim() || (che === 'gia_han' && !hanMoi)}
            onClick={() => chay(() => (che === 'gia_han' ? giaHanTask(t.id, hanMoi, lyDo.trim(), coTre) : huyTask(t.id, lyDo.trim(), coTre)))}
            className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40 ${che === 'gia_han' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
            {che === 'gia_han' ? 'Gia hạn' : 'Huỷ task'}
          </button>
        </div>
      )}
      {loi && <p className="mt-2 text-[12.5px] text-rose-600">{loi}</p>}
    </div>
  )
}

function ChiTiet({ t, meId, laAdmin, onDoi }: { t: TaskBang; meId: string; laAdmin: boolean; onDoi: () => void }) {
  const [log, setLog] = useState<TaskLog[] | null>(null)
  const [ghiChu, setGhiChu] = useState('')
  const [phanTram, setPhanTram] = useState('')
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const nap = () => listTaskLog(t.id).then(setLog).catch(() => setLog((c) => c ?? []))
  useEffect(() => { nap() }, [t.id, t.trang_thai, t.han, t.cap_nhat_cuoi_at])   // eslint-disable-line react-hooks/exhaustive-deps
  const laNguoiLam = t.nguoi_lam_id === meId
  const laNguoiGiao = t.nguoi_giao_id === meId || laAdmin
  const mo = dangMoTask(t.trang_thai)
  const chay = async (f: () => Promise<void>) => {
    setDang(true); setLoi(null)
    try { await f(); setGhiChu(''); setPhanTram(''); onDoi() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang(false) }
  }
  return (
    <div className="mt-2 border-t border-slate-100 pt-2">
      {t.mo_ta && <p className="mb-2 whitespace-pre-line text-[13px] text-slate-700">{t.mo_ta}</p>}
      {t.nhan_xet && <p className="mb-2 text-[12.5px] text-slate-600">💬 {t.nhan_xet}</p>}
      {log && log.length > 0 && (
        <ul className="mb-2 space-y-1">
          {log.slice(-8).map((l) => (
            <li key={l.id} className="text-[12px] text-slate-500">
              <span className="tabular-nums">{gio(l.created_at)}</span> · <b className="text-slate-700">{l.nguoi?.ho_ten ?? '—'}</b> · {nhanLog(l)}
              {l.ghi_chu && <span className="block pl-3 text-slate-700">💬 {l.ghi_chu}</span>}
            </li>
          ))}
        </ul>
      )}
      {loi && <p className="mb-1.5 text-[12.5px] text-rose-600">{loi}</p>}
      {laNguoiLam && mo && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Cập nhật tiến độ / ghi chú…" maxLength={300}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12.5px] outline-none focus:border-indigo-400" />
          <input value={phanTram} onChange={(e) => setPhanTram(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="%" inputMode="numeric"
            className="w-14 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-[12.5px] outline-none focus:border-indigo-400" />
          <button disabled={dang || (!ghiChu.trim() && !phanTram)}
            onClick={() => chay(() => capNhatTask(t.id, ghiChu.trim() || null, phanTram ? Math.min(100, Number(phanTram)) : null))}
            className="rounded-full border border-indigo-200 px-3 py-1 text-[12.5px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-40">Gửi cập nhật</button>
          {t.trang_thai === 'dang_lam' && (
            <button disabled={dang} onClick={() => chay(() => baoXongTask(t.id, ghiChu.trim() || null))}
              className="rounded-full bg-emerald-600 px-3 py-1 text-[12.5px] font-semibold text-white disabled:opacity-40">✓ Báo xong</button>
          )}
        </div>
      )}
      {laNguoiGiao && mo && <DanhGia t={t} onXong={onDoi} />}
    </div>
  )
}

export default function BangTaskScreen({ nhung = false, macDinh = 'team' }: { nhung?: boolean; macDinh?: 'team' | 'toi' | 'giao' }) {
  const meId = useStore((s) => s.me?.nhanSu.id) ?? ''
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const [rows, setRows] = useState<TaskBang[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [xem, setXem] = useState<'team' | 'toi' | 'giao'>(macDinh)
  const [mo, setMo] = useState<string | null>(null)
  const [form, setForm] = useState(false)
  const [coCapDuoi, setCoCapDuoi] = useState(false)

  // Nạp NỀN: không xoá danh sách đang hiện (CLAUDE.md §2 — sau mutation không blank, người dùng đứng nguyên chỗ).
  const nap = () => listTaskBang().then((r) => { setRows(r); setLoi(null) }).catch((e) => { setLoi(e?.message ?? String(e)); setRows((c) => c ?? []) })
  useEffect(() => { nap(); listCapDuoi().then((r) => setCoCapDuoi(r.length > 0)).catch(() => {}) }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  const loc = useMemo(() => (rows ?? []).filter((t) => xem === 'team' ? true : xem === 'toi' ? t.nguoi_lam_id === meId : t.nguoi_giao_id === meId), [rows, xem, meId])
  const nhom = useMemo(() => {
    const m = new Map<string, { ten: string; ds: TaskBang[] }>()
    for (const t of loc) {
      const g = m.get(t.nguoi_lam_id) ?? { ten: t.nguoi_lam_ten, ds: [] }
      g.ds.push(t); m.set(t.nguoi_lam_id, g)
    }
    return [...m.entries()].sort((a, b) => (a[0] === meId ? -1 : b[0] === meId ? 1 : a[1].ten.localeCompare(b[1].ten, 'vi')))
  }, [loc, meId])
  const canDanhGia = (rows ?? []).filter((t) => t.nguoi_giao_id === meId && t.den_han || t.nguoi_giao_id === meId && t.trang_thai === 'cho_duyet').length

  const tab = (k: typeof xem, ten: string, badge = 0) => (
    <button onClick={() => setXem(k)} className={`h-7 rounded-md px-3 text-xs font-semibold ${xem === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
      {ten}{badge > 0 && <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{badge}</span>}
    </button>
  )

  return (
    <div className={`flex min-h-0 flex-col bg-[#f5f5f7] ${nhung ? 'h-full' : 'h-full'}`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        {tab('team', 'Cả team')}{tab('toi', 'Của tôi')}{tab('giao', 'Tôi giao', canDanhGia)}
        {(coCapDuoi || laAdmin) && <button onClick={() => setForm(!form)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">＋ Giao task</button>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1100px]">
          {form && <FormGiao onDong={() => setForm(false)} onXong={() => { setForm(false); nap() }} />}
          {rows === null ? <p className="text-sm text-slate-400">Đang tải…</p>
            : loi ? <p className="text-sm text-rose-600">Chưa tải được bảng task: {loi}</p>
            : nhom.length === 0 ? <p className="text-sm text-slate-400">{xem === 'team' ? 'Chưa có task nào.' : xem === 'toi' ? 'Bạn chưa có task nào. ✓' : 'Bạn chưa giao task nào.'}</p>
            : (
              <div className="space-y-4">
                {nhom.map(([k, g]) => (
                  <section key={k} className="rounded-2xl bg-white p-4 shadow-sm">
                    <h3 className="mb-1 text-[14px] font-bold text-slate-800">{g.ten}{k === meId && <span className="ml-1.5 text-[11px] font-semibold text-indigo-600">(bạn)</span>} <span className="font-normal text-slate-400">· {g.ds.length} task</span></h3>
                    <ul>
                      {g.ds.map((t) => {
                        const p = pct(t); const dongRong = mo === t.id
                        const canToiDanhGia = (t.nguoi_giao_id === meId || laAdmin) && (t.den_han || t.trang_thai === 'cho_duyet')
                        return (
                          <li key={t.id} className="border-b border-slate-100 py-2 last:border-0">
                            <button onClick={() => setMo(dongRong ? null : t.id)} className="flex w-full items-center gap-3 text-left">
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${MAU[t.trang_thai]}`}>{TEN_TASK[t.trang_thai]}</span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13.5px] font-semibold text-slate-800">{t.tieu_de}</span>
                                <span className="block truncate text-[12px] text-slate-400">
                                  {xem !== 'giao' && <>Giao bởi {t.nguoi_giao_ten} · </>}
                                  <span className={t.qua_han ? 'font-bold text-rose-500' : ''}>hạn {ddmm(t.han)}{t.qua_han ? ' (quá hạn)' : t.den_han ? ' (hôm nay)' : ''}</span>
                                  {t.so_lan_gia_han > 0 && <> · gia hạn {t.so_lan_gia_han} lần</>}
                                </span>
                              </span>
                              {canToiDanhGia && <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">Cần đánh giá</span>}
                              <span className="relative hidden h-2 w-28 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:block"><span className="absolute inset-y-0 left-0 rounded-full bg-indigo-500" style={{ width: `${p}%` }} /></span>
                              <span className="w-10 shrink-0 text-right text-[12.5px] font-bold tabular-nums text-slate-600">{p}%</span>
                            </button>
                            {dongRong && <ChiTiet t={t} meId={meId} laAdmin={laAdmin} onDoi={nap} />}
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
