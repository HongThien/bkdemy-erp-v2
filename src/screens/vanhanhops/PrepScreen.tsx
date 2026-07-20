import { useEffect, useState } from 'react'
import {
  luotPrepCuaKhoang, getPrepRow, tickPrepChecklist, dongPrep, chamPrepGV, chotPrepLeader, uploadOpsAnh,
  type PrepLuot, type PrepRow, type PrepLuotKey,
} from '../../lib/opsvanhanh'
import { readClipboardImageFile } from '../kho/ui'
import { tuanCuaNgay, khoangTuan, homNayVN, nhanTuan, thuCuaNgay, ddmmVN } from '../../lib/tuan'
import { useIsMobile } from '../../hooks/useIsMobile'
import { getMyScope } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import ImgZoom from '../../components/ImgZoom'

const hhmm = (t: string) => t.slice(0, 5)
const LUOT_LABEL: Record<PrepLuotKey, string> = { sang: 'Sáng', chieu: 'Chiều', toi: 'Tối' }
const QUICK_PICKS = [100, 90, 80, 70]

export default function PrepScreen() {
  const [tuan, setTuan] = useState(tuanCuaNgay(homNayVN()))
  const [luots, setLuots] = useState<PrepLuot[]>([])
  const [loading, setLoading] = useState(true)
  // Ngày TƯƠNG LAI người dùng chủ động bấm mở xem trước — hôm nay + ngày đã qua (còn nợ) LUÔN mở sẵn.
  const [xemThem, setXemThem] = useState<Set<string>>(new Set())

  // ⚠ Fix (Thùy báo lỗi 07-10): "chấm điểm nền" (GV) + "chốt" (leader) TRƯỚC hiện cho MỌI người xem
  // màn này, kể cả OPS (người chỉ nên tick checklist + đóng) — OPS tự chấm/tự chốt được luôn, sai vai.
  // Gate lại: chỉ GV/TG (có lớp trực tiếp) hoặc quản lý (có cấp dưới)/admin mới thấy 2 cụm control đó;
  // OPS thuần chỉ thấy checklist + đóng (đúng việc của OPS).
  const quyen = useStore((s) => s.quyen)
  const [canChamVaChot, setCanChamVaChot] = useState(false)
  const [myId, setMyId] = useState<string | null>(null)
  const [scopeLoaded, setScopeLoaded] = useState(false)
  useEffect(() => {
    getMyScope().then((s) => { setCanChamVaChot(!!quyen?.laAdmin || !!s?.trucTiep.length || !!s?.laQuanLy); setMyId(s?.nhanSu.id ?? null) })
      .catch(() => { setCanChamVaChot(false); setMyId(null) }).finally(() => setScopeLoaded(true))
  }, [quyen])
  // ⭐ Fix 07-19 (Thùy báo LẦN 2 "vẫn hiện task của nhân sự khác"): bản trước mặc định theo VAI (OPS →
  // của tôi, GV/leader → tất cả) — nhưng người bấm vào từ card "Việc của tôi" LUÔN đang muốn xem VIỆC
  // CỦA HỌ trước tiên, bất kể vai gì khác họ đang kiêm. Đổi mặc định thành LUÔN "của tôi", không suy theo
  // vai nữa — GV/leader cần xem hết để chấm/chốt thì tự bấm "Tất cả" (đổi được cả 2 chiều).
  const [chiCuaToi, setChiCuaToi] = useState(true)

  // ⚠ Fix (Thùy báo lỗi 07-10, cùng gốc PhanCongOpsScreen): reload() vô điều kiện `setLoading(true)` →
  // sau mỗi lần đóng 1 lượt, lưới co về "Đang tải…" rồi build lại → mất vị trí cuộn đang xem. Chỉ hiện
  // loading ở LẦN TẢI ĐẦU (luots rỗng); các lần sau giữ lưới cũ trên màn tới khi data mới về.
  async function reload() {
    if (!luots.length) setLoading(true)
    try { const { tu, den } = khoangTuan(tuan); setLuots(await luotPrepCuaKhoang(tu, den)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tuan]) // eslint-disable-line

  const shown = chiCuaToi && myId ? luots.filter((l) => l.nhanSuId === myId) : luots
  const dayMap = new Map<string, PrepLuot[]>()
  for (const l of shown) { const a = dayMap.get(l.ngay) ?? []; a.push(l); dayMap.set(l.ngay, a) }
  const dayGroups = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const homNay = homNayVN()
  const toggleXem = (ngay: string) => setXemThem((s) => { const n = new Set(s); n.has(ngay) ? n.delete(ngay) : n.add(ngay); return n })

  const isMobile = useIsMobile()
  // ⚠ Fix (Thùy báo lỗi 07-10): root TRƯỚC là 1 block div thường, KHÔNG có khung cuộn riêng — khung
  // NGOÀI (NhanSuHome, cấp staffLeaf) là `overflow-hidden`, nên nội dung tràn khỏi viewport bị CẮT
  // MẤT thẳng, không kéo xuống xem được (không phải thiếu data). Giờ tự làm "nested scrollbox": header
  // đứng yên + khung dưới `flex-1 overflow-auto` tự cuộn — cùng pattern các màn khác (ETChamTab/MTTab…).
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={isMobile ? 'mx-auto w-full max-w-[1100px] px-3 pt-3' : 'mx-auto w-full max-w-[1100px] px-6 pt-6'}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-[20px] font-semibold text-slate-800">Chuẩn bị phòng (Prep)</h2>
          <span className="text-[12px] text-slate-400">Dọn phòng + KIT · 1 lượt/ca (Sáng/Chiều/Tối) · mọi ngày trong tuần</span>
          {/* Của tôi / Tất cả (Thùy 07-19, báo 2 lần) — LUÔN mặc định "Của tôi" bất kể vai, bấm đổi được cả 2 chiều. */}
          {myId && (
            <div className="flex items-center gap-1 rounded-md border border-slate-200 p-0.5 text-[12px]">
              <button onClick={() => setChiCuaToi(true)} className={`rounded px-2 py-1 font-medium ${chiCuaToi ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Của tôi</button>
              <button onClick={() => setChiCuaToi(false)} className={`rounded px-2 py-1 font-medium ${!chiCuaToi ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Tất cả</button>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={() => setTuan((t) => t - 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">‹</button>
            <span className="min-w-[210px] text-center text-[15px] font-semibold text-slate-700">{nhanTuan(tuan)}</span>
            <button onClick={() => setTuan((t) => t + 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">›</button>
          </div>
        </div>
      </div>

      <div className={`min-h-0 flex-1 overflow-auto ${isMobile ? 'px-3 pb-3' : 'px-6 pb-6'}`}>
        <div className="mx-auto max-w-[1100px]">
          {loading || !scopeLoaded ? <p className="text-sm text-slate-400">Đang tải…</p> : shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">{chiCuaToi ? 'Bạn không có lượt prep nào tuần này.' : 'Không có lượt prep nào tuần này.'}</div>
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
                        {/* Sắp theo CA (Sáng→Chiều→Tối) TRƯỚC, phòng sau (Thùy 07-19: "rõ ràng cho dễ nhìn") — gioCaDau = giờ bắt đầu cố định của ca nên sort tăng dần đúng thứ tự Sáng/Chiều/Tối. */}
                        {list.sort((a, b) => a.gioCaDau.localeCompare(b.gioCaDau) || a.phong.localeCompare(b.phong)).map((l) => (
                          <LuotCard key={l.phong + l.luot} l={l} onChanged={reload} canChamVaChot={canChamVaChot} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LuotCard({ l, onChanged, canChamVaChot }: { l: PrepLuot; onChanged: () => void; canChamVaChot: boolean }) {
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
    try {
      await dongPrep(l.phong, l.ngay, l.luot, l.gioCaDau, row.anhUrl)
      // ⚠ Bug Thùy báo (07-06): chỉ gọi onChanged() (reload DANH SÁCH lượt ở màn cha) — key của
      // <LuotCard> không đổi (vẫn cùng phong+ngay+luot) nên React KHÔNG remount, `row` cục bộ ở ĐÂY
      // vẫn giữ dong_at=null cũ → card hiện y như CHƯA đóng. Phải tự refetch row NGAY tại đây (giống
      // tick/cham/chot đã làm đúng), không chỉ trông chờ reload từ cha.
      setRow(await getPrepRow(l.phong, l.ngay, l.luot))
      onChanged()
    }
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
            {row?.anhUrl && <ImgZoom src={row.anhUrl} className={isMobile ? 'h-11 w-11 shrink-0 rounded object-cover ring-1 ring-slate-200' : 'h-7 w-7 rounded object-cover ring-1 ring-slate-200'} />}
          </div>
          <button onClick={dong} disabled={busy || !row?.donPhong || !row?.chuanBiKit || !row?.anhUrl} className={isMobile ? 'rounded-lg bg-indigo-600 px-3 py-2.5 text-[13px] font-semibold text-white disabled:opacity-40' : 'ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40'}>Đóng</button>
        </div>
      )}
      {dong_at && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-1.5 text-[12px]">
          {row?.anhUrl && <ImgZoom src={row.anhUrl} className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" />}
          <span className="text-slate-500">GV chấm: <b className="text-slate-700">{row?.gvDiemNen}%</b>{row?.gvChamAt ? '' : ' (mặc định)'}</span>
          {/* Chấm điểm nền (GV) + chốt (leader) — CHỈ GV/TG/quản lý/admin, KHÔNG phải OPS (Thùy báo lỗi 07-10). */}
          {!row?.leaderChotAt && canChamVaChot && (
            <>
              {QUICK_PICKS.map((d) => <button key={d} onClick={() => cham(d)} disabled={busy} className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] hover:border-indigo-300">{d}</button>)}
              <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="ghi chú lỗi…" className="w-28 rounded border border-slate-200 px-1.5 py-0.5 text-[11px]" />
              <button onClick={chot} disabled={busy} className="ml-auto rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500">✓ Leader chốt</button>
            </>
          )}
          {!row?.leaderChotAt && !canChamVaChot && <span className="ml-auto text-[11px] text-slate-400">Chờ GV chấm + leader chốt</span>}
        </div>
      )}
      {err && <p className="mt-1 text-[11px] text-rose-600">{err}</p>}
    </div>
  )
}
