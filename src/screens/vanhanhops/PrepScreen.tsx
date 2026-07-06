import { useEffect, useState } from 'react'
import {
  luotPrepCuaKhoang, getPrepRow, tickPrepChecklist, dongPrep, chamPrepGV, chotPrepLeader, uploadOpsAnh,
  type PrepLuot, type PrepRow, type PrepLuotKey,
} from '../../lib/opsvanhanh'
import { readClipboardImageFile } from '../kho/ui'
import { tuanCuaNgay, khoangTuan, homNayVN, nhanTuan, thuCuaNgay, ddmmVN } from '../../lib/tuan'
import { useIsMobile } from '../../hooks/useIsMobile'

const hhmm = (t: string) => t.slice(0, 5)
const LUOT_LABEL: Record<PrepLuotKey, string> = { ngay: 'Cả buổi tối', sang: 'Sáng', chieu: 'Chiều' }
const QUICK_PICKS = [100, 90, 80, 70]

export default function PrepScreen() {
  const [tuan, setTuan] = useState(tuanCuaNgay(homNayVN()))
  const [luots, setLuots] = useState<PrepLuot[]>([])
  const [loading, setLoading] = useState(true)
  // Ngày TƯƠNG LAI người dùng chủ động bấm mở xem trước — hôm nay + ngày đã qua (còn nợ) LUÔN mở sẵn.
  const [xemThem, setXemThem] = useState<Set<string>>(new Set())

  async function reload() {
    setLoading(true)
    try { const { tu, den } = khoangTuan(tuan); setLuots(await luotPrepCuaKhoang(tu, den)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tuan]) // eslint-disable-line

  const dayMap = new Map<string, PrepLuot[]>()
  for (const l of luots) { const a = dayMap.get(l.ngay) ?? []; a.push(l); dayMap.set(l.ngay, a) }
  const dayGroups = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const homNay = homNayVN()
  const toggleXem = (ngay: string) => setXemThem((s) => { const n = new Set(s); n.has(ngay) ? n.delete(ngay) : n.add(ngay); return n })

  const isMobile = useIsMobile()
  return (
    <div className={isMobile ? 'mx-auto max-w-[1100px] p-3' : 'mx-auto max-w-[1100px] p-6'}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-[20px] font-semibold text-slate-800">Chuẩn bị phòng (Prep)</h2>
        <span className="text-[12px] text-slate-400">Dọn phòng + KIT · 1 lượt/ngày thường · 2 lượt (sáng/chiều) T7-CN</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTuan((t) => t - 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">‹</button>
          <span className="min-w-[210px] text-center text-[15px] font-semibold text-slate-700">{nhanTuan(tuan)}</span>
          <button onClick={() => setTuan((t) => t + 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">›</button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : luots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có lượt prep nào tuần này.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {dayGroups.map(([ngay, list]) => {
            // Chỉ hôm nay + ngày ĐÃ QUA (còn nợ) mở sẵn — ngày tương lai gấp lại, bấm mới xem (đỡ rối mắt).
            const isFuture = ngay > homNay
            const expanded = !isFuture || xemThem.has(ngay)
            return (
              <div key={ngay} className="rounded-2xl bg-white p-3 shadow-sm">
                <button onClick={() => isFuture && toggleXem(ngay)} className={`mb-2 flex w-full items-center gap-2 border-l-4 border-indigo-400 pl-2 text-left text-[13px] font-semibold text-slate-600 ${isFuture ? 'cursor-pointer' : ''}`}>
                  <span>{thuCuaNgay(ngay)} · {ddmmVN(ngay)}</span>
                  <span className="font-normal text-slate-400">· {list.length} lượt</span>
                  {isFuture && <span className="ml-auto text-[11px] font-normal text-indigo-500">{expanded ? '▾ Ẩn bớt' : '▸ Xem'}</span>}
                </button>
                {expanded && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {list.sort((a, b) => a.phong.localeCompare(b.phong) || a.gioCaDau.localeCompare(b.gioCaDau)).map((l) => (
                      <LuotCard key={l.phong + l.luot} l={l} onChanged={reload} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LuotCard({ l, onChanged }: { l: PrepLuot; onChanged: () => void }) {
  const [row, setRow] = useState<PrepRow | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ghiChu, setGhiChu] = useState('')
  const isMobile = useIsMobile()

  useEffect(() => { getPrepRow(l.phong, l.ngay, l.luot).then((r) => { setRow(r); setLoaded(true) }) }, [l.phong, l.ngay, l.luot])

  async function tick(field: 'donPhong' | 'chuanBiKit') {
    setBusy(true); setErr(null)
    try { await tickPrepChecklist(l.phong, l.ngay, l.luot, { [field]: !(row?.[field] ?? false) }); setRow(await getPrepRow(l.phong, l.ngay, l.luot)) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function ganAnh(url: string) {
    await tickPrepChecklist(l.phong, l.ngay, l.luot, { anhUrl: url })
    setRow(await getPrepRow(l.phong, l.ngay, l.luot))
  }
  async function dan() {
    setErr(null)
    try { const f = await readClipboardImageFile(); if (!f) { setErr('Clipboard không có ảnh.'); return }; setBusy(true); await ganAnh(await uploadOpsAnh(f)) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function chonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { await ganAnh(await uploadOpsAnh(f)) } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function dong() {
    if (!row?.anhUrl) { setErr('Cần ảnh chụp tại thời điểm đóng.'); return }
    setBusy(true); setErr(null)
    try { await dongPrep(l.phong, l.ngay, l.luot, l.gioCaDau, row.anhUrl); onChanged() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function cham(diem: number) {
    setBusy(true); setErr(null)
    try { await chamPrepGV(l.phong, l.ngay, l.luot, diem, ghiChu || undefined); setRow(await getPrepRow(l.phong, l.ngay, l.luot)) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function chot() {
    setBusy(true); setErr(null)
    try { await chotPrepLeader(l.phong, l.ngay, l.luot); setRow(await getPrepRow(l.phong, l.ngay, l.luot)) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  if (!loaded) return <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-[12px] text-slate-400">Đang tải…</div>
  const dong_at = row?.dongAt
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-slate-800">{l.phong}</span>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">{LUOT_LABEL[l.luot]}</span>
        <span className="text-[12px] text-slate-400">ca đầu {hhmm(l.gioCaDau)} · {l.nhanSuTen ?? '⚠ chưa gán'}</span>
        {row?.leaderChotAt && <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ đã chốt</span>}
      </div>
      <div className={isMobile ? 'flex flex-col gap-1.5 text-[13px]' : 'flex flex-wrap items-center gap-2 text-[12px]'}>
        <label className={isMobile ? 'flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 active:bg-slate-100' : 'flex items-center gap-1'}><input type="checkbox" checked={!!row?.donPhong} onChange={() => tick('donPhong')} disabled={busy || !!dong_at} className={isMobile ? 'h-5 w-5' : undefined} /> Đã dọn phòng</label>
        <label className={isMobile ? 'flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 active:bg-slate-100' : 'flex items-center gap-1'}><input type="checkbox" checked={!!row?.chuanBiKit} onChange={() => tick('chuanBiKit')} disabled={busy || !!dong_at} className={isMobile ? 'h-5 w-5' : undefined} /> Đã chuẩn bị KIT</label>
      </div>
      {!dong_at && (
        <div className={isMobile ? 'mt-2 flex flex-col gap-2' : 'mt-1.5 flex items-center gap-2'}>
          <div className={isMobile ? 'flex items-center gap-2' : 'contents'}>
            {/* Dán clipboard chỉ đáng tin trên desktop — mobile browser đọc clipboard ảnh không ổn định, ẩn bớt cho gọn. */}
            {!isMobile && <button onClick={dan} disabled={busy} className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-50">📋 Dán ảnh</button>}
            {/* capture="environment" → mobile mở thẳng camera sau (ảnh chụp TẠI THỜI ĐIỂM đóng, đúng luật spec). */}
            <label className={isMobile ? 'flex-1 cursor-pointer rounded-lg border border-slate-300 px-3 py-2.5 text-center text-[13px] font-medium text-slate-700 active:bg-slate-100' : 'cursor-pointer rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-300'}>
              {isMobile ? '📸 Chụp ảnh' : '📎 Chọn ảnh'}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={chonFile} />
            </label>
            {row?.anhUrl && <img src={row.anhUrl} className={isMobile ? 'h-11 w-11 shrink-0 rounded object-cover ring-1 ring-slate-200' : 'h-7 w-7 rounded object-cover ring-1 ring-slate-200'} />}
          </div>
          <button onClick={dong} disabled={busy || !row?.donPhong || !row?.chuanBiKit || !row?.anhUrl} className={isMobile ? 'rounded-lg bg-indigo-600 px-3 py-2.5 text-[13px] font-semibold text-white disabled:opacity-40' : 'ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40'}>Đóng</button>
        </div>
      )}
      {dong_at && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-1.5 text-[12px]">
          {row?.anhUrl && <img src={row.anhUrl} className="h-7 w-7 rounded object-cover ring-1 ring-slate-200" />}
          <span className="text-slate-500">GV chấm: <b className="text-slate-700">{row?.gvDiemNen}%</b>{row?.gvChamAt ? '' : ' (mặc định)'}</span>
          {!row?.leaderChotAt && (
            <>
              {QUICK_PICKS.map((d) => <button key={d} onClick={() => cham(d)} disabled={busy} className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] hover:border-indigo-300">{d}</button>)}
              <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="ghi chú lỗi…" className="w-28 rounded border border-slate-200 px-1.5 py-0.5 text-[11px]" />
              <button onClick={chot} disabled={busy} className="ml-auto rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500">✓ Leader chốt</button>
            </>
          )}
        </div>
      )}
      {err && <p className="mt-1 text-[11px] text-rose-600">{err}</p>}
    </div>
  )
}
