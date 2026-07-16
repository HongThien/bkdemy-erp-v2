// Màn BỔ TRỢ ĐUỔI — HS mới chậm hơn chương trình lớp → học đuổi (mig 0055, redesign 0097 — Thùy 07-13).
// 3 tab: ĐANG ĐUỔI (card = ĐỢT, sống suốt vòng đời với "Xếp x/N · Học y/N") / Đã xếp (card = BUỔI đang
// chờ) / HOÀN THÀNH (card = ĐỢT đã đóng, click xem detail các buổi). Đợt mang KẾ HOẠCH: scope dạng +
// số buổi dự kiến (GV chốt; logic gốc = số buổi phải cover hết dạng). Xếp lịch BATCH cả đợt 1 lần.
// Vắng = huỷ suất (không đếm, xếp lại). Học đủ N/N → hệ ĐỀ XUẤT đóng, GV bấm Hoàn thành/Gia hạn.
import { useEffect, useMemo, useState } from 'react'
import {
  listDotDuoi, listCaDuoi, taoBuoiDuoi, themHSVaoBuoiDuoi, buoiDuoiSapToi, goiYBuoiDuoi, themCaseDuoi,
  hoanThanhKhoaDuoi, xoaCaseDuoi, timHocSinhDuoi, lopCuaHS, demTabDuoi, setMucHocDuoi, getBuoiDuoiHsInfo, chotKeHoachDuoi, duyetKeHoachDuoi,
  getDangCuaBuoiDuoi, setDangDay,
  type CaDuoi, type DotDuoi, type DangDuoi,
} from '../../lib/botro_duoi'
import { getRoster, getBuoi, huyBuoi, xoaHSKhoiBuoi, diemDanh, getDanhGia, setNhanXet, dongDanhGia, moLaiDanhGia, type BuoiHocHS } from '../../lib/gami'
import SuaBuoiModal from './SuaBuoiModal'
import { DangPicker } from '../tailieu/TaiLieuBuilder'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listMucHocDuoi, type MucHocDuoi } from '../../lib/hocphi'
import { homNayVN } from '../../lib/tuan'
import SearchSelect, { norm } from '../../components/SearchSelect'
import { tenNganHS, tenHienThiDs } from '../../lib/hoten'
import { useStore } from '../../store/useStore'

type Tab = 'canduoi' | 'daxep' | 'xong'
const khoiSort = (a: string, b: string) => a.localeCompare(b, 'vi', { numeric: true })
const TABS: { k: Tab; ten: string }[] = [{ k: 'canduoi', ten: 'Đang đuổi' }, { k: 'daxep', ten: 'Đã xếp' }, { k: 'xong', ten: 'Hoàn thành' }]
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const ddmm = (s?: string | null) => (s ? s.split('-').reverse().slice(0, 2).join('/') : '')

export default function BoTroDuoiScreen() {
  const [tab, setTab] = useState<Tab>('canduoi')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [dots, setDots] = useState<DotDuoi[]>([]) // tab Đang đuổi + Hoàn thành (đơn vị = ĐỢT)
  const [cas, setCas] = useState<CaDuoi[]>([])    // tab Đã xếp (đơn vị = BUỔI)
  const [loading, setLoading] = useState(true)
  const [xepItem, setXepItem] = useState<DotDuoi | null>(null)    // modal xếp lịch batch
  const [dotDetail, setDotDetail] = useState<DotDuoi | null>(null) // modal detail đợt (dùng CHUNG 2 tab: buổi + kế hoạch + duyệt)
  const [them, setThem] = useState(false)
  const [detail, setDetail] = useState<{ buoiId: string; readOnly: boolean } | null>(null)
  const [suaBuoi, setSuaBuoi] = useState<CaDuoi | null>(null)
  // Filter khối + tìm tên (Thùy 07-16) — dùng CHUNG cả 3 tab (canduoi/daxep/xong).
  const [khoiFilter, setKhoiFilter] = useState<string | null>(null)
  const [q, setQ] = useState('')
  // Quyền DUYỆT kế hoạch (chốt dạng + số buổi) = team học thuật của MÔN đó (ghế hoc_thuat, mig 0100) hoặc admin.
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const myHocThuatMons = me?.hocThuatMons ?? []
  const coQuyenDuyet = (mon: string) => laAdmin || myHocThuatMons.includes(mon)

  // canduoi/xong = card 1 HS/đợt (lọc trực tiếp trên đợt). daxep = card 1 BUỔI (nhiều HS/ca) → giữ ca
  // nếu CÓ ÍT NHẤT 1 HS khớp cả 2 filter (tìm học sinh trong ca gộp nhiều em).
  const khoiOpts = useMemo(() => {
    const set = tab === 'daxep' ? new Set(cas.flatMap((c) => c.hs.map((h) => h.khoi).filter(Boolean) as string[]))
      : new Set(dots.map((d) => d.khoi).filter(Boolean) as string[])
    return [...set].sort(khoiSort)
  }, [tab, dots, cas])
  const khopQ = (hoTen: string, maHs: string | null) => !q.trim() || norm(hoTen).includes(norm(q)) || (!!maHs && norm(maHs).includes(norm(q)))
  const dotsShown = useMemo(() => dots.filter((d) => (!khoiFilter || d.khoi === khoiFilter) && khopQ(d.ho_ten, d.ma_hs)), [dots, khoiFilter, q])
  const casShown = useMemo(() => cas.filter((c) => c.hs.some((h) => (!khoiFilter || h.khoi === khoiFilter) && khopQ(h.ho_ten, h.ma_hs))), [cas, khoiFilter, q])

  async function reloadCounts() { try { setCounts(await demTabDuoi()) } catch { /* */ } }
  async function reload() {
    setLoading(true)
    try {
      if (tab === 'daxep') setCas(await listCaDuoi(false))
      else setDots(await listDotDuoi(tab === 'xong'))
    } catch { /* */ } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tab]) // eslint-disable-line
  useEffect(() => { reloadCounts() }, [])
  const refresh = async () => { await reload(); await reloadCounts() }

  // Dùng ở tab "Đang đuổi" (L1, list cấp màn) — BuoiDuoiDetail tự có bản riêng (đóng+reload cục bộ,
  // không phụ thuộc list cha vì có thể mở từ "Việc của tôi" không qua màn này).
  async function onHoanThanhDot(d: DotDuoi) {
    const canhBao = d.so_buoi_du_kien != null && d.daHoc < d.so_buoi_du_kien ? ` (mới học ${d.daHoc}/${d.so_buoi_du_kien} buổi)` : ''
    if (!confirm(`Hoàn thành ĐỢT bổ trợ đuổi của ${d.ho_ten}${canhBao}? Đợt sẽ chuyển sang tab Hoàn thành.`)) return
    try { await hoanThanhKhoaDuoi(d.caseId); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function onGiaHan(d: DotDuoi) {
    if (d.so_buoi_du_kien == null) return
    try { await chotKeHoachDuoi(d.caseId, d.so_buoi_du_kien + 1, d.dangs.map((x) => x.ma_dang)); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function onBoCo(d: DotDuoi) {
    if (d.daHoc > 0 || d.daXep > 0) { alert('Đợt đã có buổi xếp/học — không bỏ cờ được. Dùng "✓ Hoàn thành đợt" để kết thúc.'); return }
    if (!confirm(`Bỏ cờ "cần đuổi" của ${d.ho_ten}? (dùng khi gắn nhầm)`)) return
    try { await xoaCaseDuoi(d.caseId); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (detail) return <BuoiDuoiDetail buoiId={detail.buoiId} readOnly={detail.readOnly} onClose={() => { setDetail(null); refresh() }} />

  return (
    <div className="h-full overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <h2 className="text-[22px] font-semibold text-slate-800">Bổ trợ · Đuổi chương trình</h2>
            <p className="text-[13px] text-slate-500">GV chốt kế hoạch (dạng cần đuổi + số buổi) → xếp lịch cả đợt 1 lần → học đủ số buổi thì hệ đề xuất hoàn thành</p>
          </div>
          <button onClick={() => setThem(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm HS cần đuổi</button>
        </div>

        <div className="mb-4 inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => {
            const on = tab === t.k
            return (
              <button key={t.k} onClick={() => setTab(t.k)} className={`rounded-xl px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {t.ten}{counts[t.k] != null ? <span className={`ml-1.5 rounded-full px-1.5 text-[12px] ${on ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{counts[t.k]}</span> : null}
              </button>
            )
          })}
        </div>

        {/* Filter khối + tìm tên (Thùy 07-16) — áp dụng chung cả 3 tab */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Khối</span>
          <span className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button onClick={() => setKhoiFilter(null)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium transition ${khoiFilter === null ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Tất cả</button>
            {khoiOpts.map((k) => (
              <button key={k} onClick={() => setKhoiFilter(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium transition ${khoiFilter === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{k}</button>
            ))}
          </span>
          <div className="relative ml-2 w-64">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Tìm tên / mã HS…" className="h-9 w-full rounded-xl border border-slate-300 px-3 text-[13px] outline-none focus:border-indigo-400" />
            {q && <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 hover:text-slate-600">✕</button>}
          </div>
        </div>

        {loading ? <div className="p-8 text-[14px] text-slate-400">Đang tải…</div>
          : tab === 'canduoi' ? (
            dots.length === 0 ? <Empty t="Không có HS nào đang bổ trợ đuổi." />
              : dotsShown.length === 0 ? <Empty t="Không có HS nào khớp bộ lọc." />
              : (
                <div className="space-y-2.5">
                  {(() => { const tenHT = tenHienThiDs(dotsShown.map((c) => c.ho_ten)); return dotsShown.map((d, i) => {
                    const N = d.so_buoi_du_kien
                    const chuaDuyet = d.dangDuyetAt == null   // 0100: học thuật chưa chốt/duyệt dạng
                    const duyetOk = coQuyenDuyet(d.mon)       // người xem có quyền duyệt môn này?
                    const duN = N != null && d.daHoc >= N     // đủ N buổi có mặt → đề xuất đóng
                    return (
                    <div key={d.caseId} onClick={() => setDotDetail(d)} className={`cursor-pointer rounded-2xl border bg-white p-3.5 shadow-sm transition hover:shadow-md ${duN ? 'border-emerald-300 ring-1 ring-emerald-200' : chuaDuyet ? 'border-amber-300' : 'border-slate-200'}`}>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-[170px]">
                          <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div>
                          <div className="text-[16px] font-semibold text-slate-800">{tenHT[i]}</div>
                          <div className="text-[12px] text-slate-400">{d.ma_hs}{d.nguon === 'tuyen_sinh' ? ' · từ tuyển sinh' : ''}</div>
                        </div>
                        <div className="min-w-[110px] rounded-xl bg-slate-50 px-3 py-2">
                          <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp đuổi</div>
                          <div className="text-[15px] font-semibold text-slate-700">{d.lop}</div>
                          <div className="text-[12px] text-slate-400">{d.mon}</div>
                        </div>
                        {/* DUYỆT DẠNG (0100): chưa duyệt → cờ vàng (học thuật chốt); đã duyệt → tiến độ + scope dạng */}
                        {chuaDuyet ? (
                          <div className="max-w-[280px] rounded-xl bg-amber-50 px-3 py-2">
                            <div className="text-[12px] font-medium uppercase tracking-wide text-amber-600">⚠ Dạng chưa duyệt</div>
                            <div className="text-[12px] text-amber-700">{duyetOk ? 'Bấm “Chốt & duyệt” để chốt dạng + số buổi' : `Chờ team học thuật ${d.mon} chốt dạng cần đuổi`}</div>
                          </div>
                        ) : (
                          <div className="min-w-[170px] rounded-xl bg-slate-50 px-3 py-2">
                            <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Tiến độ đợt</div>
                            <div className="text-[15px] font-semibold text-slate-800">
                              <span className={N != null && d.daXep < N ? 'text-rose-600' : 'text-slate-700'}>Xếp {d.daXep}/{N}</span>
                              <span className="mx-1.5 text-slate-300">·</span>
                              <span className={duN ? 'text-emerald-600' : 'text-slate-700'}>Học {d.daHoc}/{N}</span>
                            </div>
                            {d.dangs.length > 0 && (() => { const daDay = d.dangs.filter((x) => x.day_at).length; return (
                              <div className="mt-0.5 flex max-w-[320px] flex-wrap items-center gap-1" title={d.dangs.map((x) => `${x.ma_dang}${x.day_at ? ' ✓đã dạy' : ' — chưa dạy'}`).join('\n')}>
                                <span className={`text-[11px] font-semibold ${daDay >= d.dangs.length ? 'text-emerald-600' : 'text-slate-500'}`}>Dạng {daDay}/{d.dangs.length}</span>
                                {d.dangs.map((x) => (
                                  <span key={x.id} className={`rounded px-1 py-px font-mono text-[10px] ${x.day_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{x.day_at ? '✓' : ''}{x.ma_dang}</span>
                                ))}
                              </div>
                            ) })()}
                            <div className="mt-0.5 text-[11px] text-emerald-600">✓ Đã duyệt{d.duyetBoiTen ? ` · ${d.duyetBoiTen}` : ''}</div>
                          </div>
                        )}
                        {d.ly_do && <div className="min-w-[130px] max-w-[240px] rounded-xl bg-slate-50 px-3 py-2"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lý do</div><div className="text-[13px] text-slate-600">{d.ly_do}</div></div>}
                        {/* Cụm nút — stopPropagation để không mở popup detail khi bấm nút */}
                        <div className="ml-auto flex shrink-0 flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                          {chuaDuyet && (duyetOk
                            ? <button onClick={() => setDotDetail(d)} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">Chốt &amp; duyệt</button>
                            : <span className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] font-medium text-amber-700">⏳ Chờ học thuật</span>)}
                          {/* Xếp lịch — GATE MỀM: cho phép ngay cả khi chưa duyệt (ca gấp), GV dạy chưa tick dạng được tới khi duyệt */}
                          <button onClick={() => setXepItem(d)} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Xếp lịch</button>
                          {!chuaDuyet && duyetOk && <button onClick={() => setDotDetail(d)} title="Sửa kế hoạch (dạng / số buổi)" className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-500 hover:border-indigo-300 hover:text-indigo-700">✎ Kế hoạch</button>}
                          {duN
                            ? <button onClick={() => onHoanThanhDot(d)} className="rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-500">✓ Hoàn thành đợt</button>
                            : d.daXep === 0 && d.daHoc === 0
                              ? <button onClick={() => onBoCo(d)} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Bỏ cờ</button>
                              : <button onClick={() => onHoanThanhDot(d)} title="Kết thúc sớm (HS đã bắt kịp)" className="rounded-lg border border-emerald-200 px-3 py-2 text-[13px] text-emerald-700 hover:bg-emerald-50">✓ Hoàn thành</button>}
                        </div>
                      </div>
                      {/* ĐỀ XUẤT ĐÓNG (Thùy 07-13: không đóng câm) — đủ N buổi có mặt thì hệ nhắc, GV quyết.
                          Kèm ĐỘ PHỦ DẠNG: đủ buổi mà chưa dạy hết dạng → cảnh báo (cân nhắc gia hạn);
                          ngược lại dạy hết dạng SỚM → gợi ý kết thúc sớm (thu ngắn đợt). */}
                      {(() => {
                        const daDay = d.dangs.filter((x) => x.day_at).length
                        const phuHet = d.dangs.length > 0 && daDay >= d.dangs.length
                        if (duN) return (
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800" onClick={(e) => e.stopPropagation()}>
                            <span>Đã học đủ <b>{d.daHoc}/{N}</b> buổi{d.dangs.length > 0 ? <> · đã dạy <b>{daDay}/{d.dangs.length}</b> dạng</> : null} — hoàn thành đợt, hay em cần thêm buổi?</span>
                            {d.dangs.length > 0 && !phuHet && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">⚠ còn {d.dangs.length - daDay} dạng chưa dạy</span>}
                            <button onClick={() => onGiaHan(d)} className="ml-auto rounded-lg border border-emerald-300 px-2.5 py-1 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100">+1 buổi</button>
                          </div>
                        )
                        if (phuHet && N != null) return (
                          <div className="mt-2.5 rounded-xl bg-sky-50 px-3 py-2 text-[13px] text-sky-800">
                            Đã dạy đủ <b>{daDay}/{d.dangs.length}</b> dạng dù mới học {d.daHoc}/{N} buổi — cân nhắc kết thúc sớm (nút "✓ Hoàn thành") để thu ngắn đợt.
                          </div>
                        )
                        return null
                      })()}
                    </div>
                    )
                  }) })()}
                </div>
              )
          ) : tab === 'xong' ? (
            dots.length === 0 ? <Empty t="Chưa có đợt bổ trợ đuổi nào hoàn thành." />
              : dotsShown.length === 0 ? <Empty t="Không có đợt nào khớp bộ lọc." /> : (
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
                {(() => { const tenHT = tenHienThiDs(dotsShown.map((c) => c.ho_ten)); return dotsShown.map((d, i) => (
                  <div key={d.caseId} role="button" onClick={() => setDotDetail(d)} className="cursor-pointer rounded-2xl border-l-4 border-l-emerald-400 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-slate-800">{tenHT[i]}</span>
                      {d.ma_hs && <span className="font-mono text-[11px] text-slate-400">{d.ma_hs}</span>}
                      <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Đã học {d.daHoc}{d.so_buoi_du_kien != null ? `/${d.so_buoi_du_kien}` : ''}</span>
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">{d.lop}{d.mon ? ` · ${d.mon}` : ''}{d.hoan_thanh_at ? ` · xong ${ddmm(d.hoan_thanh_at.slice(0, 10))}` : ''}</div>
                    {d.dangs.length > 0 && <div className="mt-1.5 truncate text-[11px] text-slate-400">Dạng đã dạy {d.dangs.filter((x) => x.day_at).length}/{d.dangs.length}: {d.dangs.map((x) => x.ma_dang).join(', ')}</div>}
                    <div className="mt-1.5 text-[11px] text-slate-400">Click xem chi tiết {d.buois.length} buổi</div>
                  </div>
                )) })()}
              </div>
            )
          ) : (
            cas.length === 0 ? <Empty t="Chưa có buổi đuổi nào đang chờ." />
              : casShown.length === 0 ? <Empty t="Không có buổi nào khớp bộ lọc." /> : (
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                {casShown.map((ca) => {
                  const hsShown = ca.hs.slice(0, 6)
                  const tenHsShown = tenHienThiDs(hsShown.map((h) => h.ho_ten))
                  return (
                  <div key={ca.id} role="button" onClick={() => setDetail({ buoiId: ca.id, readOnly: false })} className="cursor-pointer rounded-2xl border-l-4 border-l-orange-400 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-slate-800">Buổi đuổi · {ddmm(ca.ngay)}</span>
                      <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">{ca.hs.length} HS</span>
                      <button onClick={(e) => { e.stopPropagation(); setSuaBuoi(ca) }} title="Sửa buổi (ngày/giờ/phòng/GV/TA)" className="rounded border border-slate-200 px-1.5 py-0.5 text-[12px] text-slate-400 hover:border-indigo-300 hover:text-indigo-700">✎</button>
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">{ca.gio_bat_dau?.slice(0, 5) || '—'}{ca.phong ? ` · ${ca.phong}` : ''}</div>
                    <div className="mt-2 flex flex-wrap gap-1">{hsShown.map((h, i) => (
                      <span key={h.hoc_sinh_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
                        {tenHsShown[i]}{h.ma_hs ? <span className="ml-1 font-mono text-slate-400">{h.ma_hs}</span> : null}{h.lop ? ` · ${h.lop}${h.mon ? ` (${h.mon})` : ''}` : ''}
                      </span>
                    ))}{ca.hs.length > 6 && <span className="text-[11px] text-slate-400">+{ca.hs.length - 6}</span>}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${ca.danh_gia_xong_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>Nhận xét {ca.danh_gia_xong_at ? '✓ xong' : '…'}</span>
                      {!ca.muc_hoc_duoi_id && <span className="rounded px-1.5 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-700">⚠ Chưa gán giá</span>}
                    </div>
                  </div>
                  )
                })}
              </div>
            )
          )}
      </div>

      {suaBuoi && <SuaBuoiModal buoi={suaBuoi} onClose={() => setSuaBuoi(null)} onSaved={async () => { setSuaBuoi(null); await refresh() }} />}
      {xepItem && <XepDuoiModal item={xepItem} onClose={() => setXepItem(null)} onDone={async () => { setXepItem(null); await refresh() }} />}
      {dotDetail && (
        <DotDetailModal
          dot={dotDetail}
          canEditPlan={tab === 'canduoi' && coQuyenDuyet(dotDetail.mon)}
          onClose={() => setDotDetail(null)}
          onDone={async () => { setDotDetail(null); await refresh() }}
          onOpenBuoi={(buoiId) => { setDotDetail(null); setDetail({ buoiId, readOnly: tab === 'xong' }) }}
        />
      )}
      {them && <ThemHSModal onClose={() => setThem(false)} onDone={async () => { setThem(false); await refresh() }} />}
    </div>
  )
}

// ── Detail ĐỢT (dùng CHUNG tab Đang đuổi + Hoàn thành) — Thùy 07-15:
//   • Bảng lịch sử từng BUỔI của đợt (trạng thái · ngày/giờ/phòng · dạng đã dạy buổi đó · nhận xét GV).
//   • KẾ HOẠCH học thuật (dạng + số buổi) sửa NGAY trong popup — nhưng CHỈ team học thuật của môn
//     (canEditPlan) mới sửa/DUYỆT được; người khác chỉ xem. Chưa duyệt → nút "Chốt & duyệt" (0100).
function DotDetailModal({ dot, canEditPlan, onClose, onOpenBuoi, onDone }: {
  dot: DotDuoi; canEditPlan: boolean; onClose: () => void; onOpenBuoi: (buoiId: string) => void; onDone: () => void
}) {
  const chuaDuyet = dot.dangDuyetAt == null
  const [soBuoi, setSoBuoi] = useState(dot.so_buoi_du_kien ?? Math.max(1, dot.daHoc))
  const [dangs, setDangs] = useState<string[]>(dot.dangs.map((x) => x.ma_dang))
  const [pick, setPick] = useState(false)
  const [busy, setBusy] = useState(false)
  const dayDangSet = new Set(dot.dangs.filter((x) => x.day_at).map((x) => x.ma_dang)) // dạng đã dạy (bất kỳ buổi)
  async function luu() {
    if (!Number.isInteger(soBuoi) || soBuoi < 1) { alert('Số buổi phải ≥ 1'); return }
    if (soBuoi < dot.daHoc) { alert(`HS đã HỌC ${dot.daHoc} buổi rồi — số buổi dự kiến không thể nhỏ hơn.`); return }
    if (soBuoi < dot.daXep) { alert(`Đã xếp ${dot.daXep} buổi — muốn giảm xuống ${soBuoi} thì huỷ bớt buổi đã xếp trước (tab Đã xếp).`); return }
    setBusy(true)
    // Chưa duyệt → duyetKeHoachDuoi (đóng dấu đã duyệt + người duyệt); đã duyệt → chotKeHoachDuoi (sửa, giữ nguyên người duyệt gốc).
    try { await (chuaDuyet ? duyetKeHoachDuoi : chotKeHoachDuoi)(dot.caseId, soBuoi, dangs); onDone() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title={`Đợt đuổi · ${tenNganHS(dot.ho_ten)} · ${dot.lop}${dot.mon ? ` (${dot.mon})` : ''}`} onClose={onClose} maxW="max-w-[640px]">
      {/* Trạng thái duyệt */}
      <div className="mb-3">
        {chuaDuyet ? (
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
            ⚠ <b>Chưa duyệt dạng.</b> {canEditPlan ? 'Chốt dạng cần đuổi + số buổi bên dưới rồi bấm “Chốt & duyệt”.' : `Chờ team học thuật ${dot.mon} chốt. Ops có thể xếp lịch trước, nhưng GV dạy chưa có dạng để bám tới khi duyệt.`}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">✓ Đã duyệt dạng{dot.duyetBoiTen ? ` · ${dot.duyetBoiTen}` : ''}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">Xếp {dot.daXep}/{dot.so_buoi_du_kien ?? '?'} · Học {dot.daHoc}/{dot.so_buoi_du_kien ?? '?'}</span>
            {dot.hoan_thanh_at && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">Hoàn thành {ddmm(dot.hoan_thanh_at.slice(0, 10))}</span>}
          </div>
        )}
      </div>

      {/* KẾ HOẠCH học thuật: sửa nếu canEditPlan, không thì chỉ xem */}
      <div className="mb-4 rounded-xl border border-slate-200 p-3">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Kế hoạch học thuật {canEditPlan ? '' : '(chỉ xem)'}</div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">Dạng cần dạy đuổi {dot.dangs.length > 0 && <span className="text-slate-400">({dayDangSet.size}/{dot.dangs.length} đã dạy)</span>}</label>
            {canEditPlan && !dot.khoi ? (
              <p className="text-[12px] text-slate-400">Đợt chưa gắn lớp đuổi — không tra được kho dạng (chỉ chốt số buổi).</p>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                {dangs.length === 0 && !canEditPlan && <span className="text-[12px] text-slate-400">Chưa chốt dạng nào.</span>}
                {dangs.map((m) => (
                  <span key={m} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[12px] ${dayDangSet.has(m) ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                    {dayDangSet.has(m) ? '✓ ' : ''}{m}
                    {canEditPlan && <button onClick={() => setDangs((ds) => ds.filter((x) => x !== m))} className="text-indigo-300 hover:text-rose-600">✕</button>}
                  </span>
                ))}
                {canEditPlan && dot.khoi && <button onClick={() => setPick(true)} className="rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-[12px] text-slate-500 hover:border-indigo-400 hover:text-indigo-600">+ Chọn dạng</button>}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">Số buổi dự kiến</label>
            {canEditPlan ? (
              <>
                <input type="number" min={Math.max(1, dot.daHoc)} className={inputCls} value={soBuoi} onChange={(e) => setSoBuoi(parseInt(e.target.value || '0', 10))} />
                <p className="mt-1 text-[12px] text-slate-400">Học đủ số buổi (có mặt) → hệ đề xuất hoàn thành đợt. Vắng không tính, phải xếp lại.{dot.daHoc > 0 ? ` Đã học ${dot.daHoc} buổi.` : ''}</p>
              </>
            ) : (
              <span className="text-[14px] font-semibold text-slate-700">{dot.so_buoi_du_kien ?? '— chưa chốt —'}</span>
            )}
          </div>
          {canEditPlan && (
            <div className="flex justify-end">
              <button onClick={luu} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
                {busy ? '…' : chuaDuyet ? 'Chốt & duyệt kế hoạch' : 'Lưu kế hoạch'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LỊCH SỬ TỪNG BUỔI của đợt */}
      <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Các buổi ({dot.buois.length})</div>
      <div className="space-y-2">
        {dot.buois.length === 0 ? <p className="text-[13px] text-slate-400">Đợt chưa có buổi nào được xếp.</p> : dot.buois.map((b, i) => (
          <button key={b.buoiId} onClick={() => onOpenBuoi(b.buoiId)} className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left hover:border-indigo-300">
            <div className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="font-semibold text-slate-700">Buổi {i + 1} · {ddmm(b.ngay)}</span>
              <span className="text-slate-400">{b.gio_bat_dau?.slice(0, 5) || '—'}{b.phong ? ` · ${b.phong}` : ''}</span>
              <span className={`ml-auto rounded px-1.5 py-0.5 text-[11px] font-medium ${!b.danh_gia_xong_at ? 'bg-amber-100 text-amber-700' : b.diem_danh === 'co_mat' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {!b.danh_gia_xong_at ? 'đã xếp · chưa học' : b.diem_danh === 'co_mat' ? '✓ đã học' : 'vắng (không tính)'}
              </span>
            </div>
            {b.dangDay.length > 0 && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-slate-400">Dạng đã dạy:</span>
                {b.dangDay.map((m) => <span key={m} className="rounded bg-emerald-50 px-1.5 py-px font-mono text-[11px] text-emerald-700">{m}</span>)}
              </div>
            )}
            {b.nhanXet && <div className="mt-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12px] italic text-slate-600">“{b.nhanXet}”</div>}
          </button>
        ))}
      </div>
      {pick && dot.khoi && <DangPicker khoi={dot.khoi} mon={dot.mon || undefined} selected={dangs} onClose={() => setPick(false)} onConfirm={(ms) => { setDangs(ms); setPick(false) }} />}
    </Modal>
  )
}

const Empty = ({ t }: { t: string }) => <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-400 shadow-sm">{t}</div>

function Modal({ title, onClose, children, maxW = 'max-w-[460px]' }: { title: string; onClose: () => void; children: React.ReactNode; maxW?: string }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full ${maxW} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[17px] font-semibold text-slate-800">{title}</div>{children}
      </div>
    </div>
  )
}

// Thêm HS cần đuổi thủ công (path 2). Chọn HS → chọn lớp đang học → lý do.
function ThemHSModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [q, setQ] = useState('')
  const [res, setRes] = useState<{ id: string; ma_hs: string | null; ho_ten: string }[]>([])
  const [open, setOpen] = useState(false)
  const [hs, setHs] = useState<{ id: string; ho_ten: string } | null>(null)
  const [lops, setLops] = useState<{ id: string; ten_lop: string; mon: string }[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!q.trim()) { setRes([]); return }
    let live = true
    const t = setTimeout(() => { timHocSinhDuoi(q).then((r) => { if (live) { setRes(r); setOpen(true) } }).catch(() => {}) }, 200)
    return () => { live = false; clearTimeout(t) }
  }, [q])
  function pick(h: { id: string; ma_hs: string | null; ho_ten: string }) {
    setHs(h); setQ(h.ho_ten); setOpen(false)
    lopCuaHS(h.id).then((ls) => { setLops(ls); setLopId(ls[0]?.id ?? null) }).catch(() => {})
  }
  async function go() {
    if (!hs) { alert('Chọn học sinh'); return }
    setBusy(true)
    try { await themCaseDuoi({ hoc_sinh_id: hs.id, lop_id: lopId, ly_do: lyDo.trim() || null }); onDone() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Thêm HS cần bổ trợ đuổi" onClose={onClose} maxW="max-w-[520px]">
      <div className="space-y-3">
        <div className="relative">
          <label className="mb-1 block text-[13px] font-medium text-slate-600">Học sinh *</label>
          <input className={inputCls} value={q} onChange={(e) => { setQ(e.target.value); setHs(null) }} placeholder="🔎 Tìm tên / mã HS…" autoFocus />
          {open && res.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {res.map((h) => (
                <button key={h.id} onClick={() => pick(h)} className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-indigo-50">
                  <span className="font-medium text-slate-800">{h.ho_ten}</span><span className="text-[12px] text-slate-400">{h.ma_hs}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-slate-600">Lớp đuổi (lớp HS đang chậm)</label>
          <select className={inputCls} value={lopId ?? ''} onChange={(e) => setLopId(e.target.value || null)} disabled={!hs}>
            <option value="">{hs ? '— chọn lớp —' : '— chọn HS trước —'}</option>
            {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop} · {l.mon}</option>)}
          </select>
        </div>
        <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Lý do (tuỳ)</label><input className={inputCls} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="vd: vào lớp giữa chừng, chậm 3 chuyên đề" /></div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? '…' : 'Thêm vào Cần đuổi'}</button>
      </div>
    </Modal>
  )
}

// Xếp lịch cho ĐỢT — BATCH (Thùy 07-13: "thực tế xếp lịch thường xếp toàn bộ luôn"): tạo NHIỀU buổi
// 1 lần (mặc định đủ số còn thiếu của kế hoạch), GV/TA/giá dùng chung. Vẫn giữ mode "chọn buổi có sẵn"
// (gộp em này vào ca đã có của em khác — 1 ca đuổi gộp nhiều HS như cũ).
function XepDuoiModal({ item, onClose, onDone }: { item: DotDuoi; onClose: () => void; onDone: () => void }) {
  const [mode, setMode] = useState<'moi' | 'cosan'>('moi')
  const conThieu = item.so_buoi_du_kien != null ? Math.max(1, item.so_buoi_du_kien - item.daXep) : 1
  const [rows, setRows] = useState<{ ngay: string; gio: string; phong: string }[]>(
    Array.from({ length: conThieu }, () => ({ ngay: homNayVN(), gio: '', phong: '' })))
  const [gv, setGv] = useState<string | null>(null)
  const [ta, setTa] = useState<string | null>(null)
  const [pickId, setPickId] = useState<string | null>(null)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [mucDuoi, setMucDuoi2] = useState<MucHocDuoi[]>([])
  const [mucId, setMucId] = useState<string | null>(null)
  const [sapToi, setSapToi] = useState<CaDuoi[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    listNhanSu().then(setNss).catch(() => {}); buoiDuoiSapToi().then(setSapToi).catch(() => {})
    listMucHocDuoi().then(setMucDuoi2).catch(() => {})
    goiYBuoiDuoi(item.lop_id).then((g) => { setGv(g.gv_id); setTa(g.ta_id) }).catch(() => {})
  }, [item.lop_id]) // eslint-disable-line
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  const setRow = (i: number, patch: Partial<{ ngay: string; gio: string; phong: string }>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  async function go() {
    setBusy(true)
    try {
      if (mode === 'moi') {
        if (rows.some((r) => !r.ngay)) { alert('Mỗi buổi phải có ngày'); setBusy(false); return }
        for (const r of rows) {
          const buoiId = await taoBuoiDuoi({ ngay: r.ngay, gio_bat_dau: r.gio || null, phong: r.phong || null, nguoi_day: gv, nguoi_day_tg: ta, muc_hoc_duoi_id: mucId })
          await themHSVaoBuoiDuoi(buoiId, [{ hoc_sinh_id: item.hoc_sinh_id, caseId: item.caseId }])
        }
      } else {
        if (!pickId) { alert('Chọn buổi đuổi có sẵn'); setBusy(false); return }
        await themHSVaoBuoiDuoi(pickId, [{ hoc_sinh_id: item.hoc_sinh_id, caseId: item.caseId }])
      }
      onDone()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Xếp lịch đợt đuổi" onClose={onClose} maxW="max-w-[760px]">
      <div className="mb-4 flex flex-wrap gap-2.5">
        <div className="min-w-[160px] flex-1 rounded-xl bg-slate-50 px-3.5 py-2.5"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div><div className="text-[16px] font-semibold text-slate-800">{tenNganHS(item.ho_ten)}</div>{item.ma_hs && <div className="font-mono text-[12px] text-slate-400">{item.ma_hs}</div>}</div>
        <div className="min-w-[120px] rounded-xl bg-slate-50 px-3.5 py-2.5"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp đuổi · Môn</div><div className="text-[16px] font-semibold text-slate-700">{item.lop}</div><div className="text-[12px] text-slate-400">{item.mon}</div></div>
        {item.so_buoi_du_kien != null && (
          <div className="min-w-[130px] rounded-xl bg-slate-50 px-3.5 py-2.5"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Kế hoạch</div><div className="text-[16px] font-semibold text-slate-700">Xếp {item.daXep}/{item.so_buoi_du_kien} · Học {item.daHoc}/{item.so_buoi_du_kien}</div><div className="text-[12px] text-slate-400">còn thiếu {Math.max(0, item.so_buoi_du_kien - item.daXep)} buổi</div></div>
        )}
      </div>
      <div className="mb-3 inline-flex rounded-lg border border-slate-200 p-0.5 text-[13px]">
        <button onClick={() => setMode('moi')} className={`rounded-md px-3 py-1 font-medium ${mode === 'moi' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Tạo buổi mới</button>
        <button onClick={() => setMode('cosan')} className={`rounded-md px-3 py-1 font-medium ${mode === 'cosan' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Gộp vào buổi có sẵn</button>
      </div>
      {mode === 'moi' ? (
        <div className="space-y-3">
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-end gap-2">
                <span className="w-14 pb-2 text-[12px] font-medium text-slate-400">Buổi {item.daXep + i + 1}</span>
                <div className="flex-1"><label className="mb-1 block text-[12px] font-medium text-slate-500">Ngày *</label><input type="date" className={inputCls} value={r.ngay} onChange={(e) => setRow(i, { ngay: e.target.value })} /></div>
                <div className="w-32"><label className="mb-1 block text-[12px] font-medium text-slate-500">Giờ</label><input type="time" className={inputCls} value={r.gio} onChange={(e) => setRow(i, { gio: e.target.value })} /></div>
                <div className="w-28"><label className="mb-1 block text-[12px] font-medium text-slate-500">Phòng</label><input className={inputCls} value={r.phong} onChange={(e) => setRow(i, { phong: e.target.value })} /></div>
                {rows.length > 1 && <button onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="pb-2.5 text-[13px] text-slate-300 hover:text-rose-600">✕</button>}
              </div>
            ))}
            <button onClick={() => setRows((rs) => [...rs, { ngay: rs[rs.length - 1]?.ngay ?? homNayVN(), gio: rs[rs.length - 1]?.gio ?? '', phong: rs[rs.length - 1]?.phong ?? '' }])}
              className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-[13px] text-slate-500 hover:border-indigo-400 hover:text-indigo-600">+ Thêm buổi</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">GV (nhận xét) — chung mọi buổi</label><SearchSelect value={gv} onChange={setGv} options={nsOpts} placeholder="Chọn GV…" /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">TA — chung mọi buổi</label><SearchSelect value={ta} onChange={setTa} options={nsOpts} placeholder="Chọn TA…" /></div>
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">Mức học đuổi (giá mỗi CA — chung; sửa lẻ từng ca sau được)</label>
            <SearchSelect value={mucId} onChange={setMucId} options={mucDuoi.map((m) => ({ id: m.id, label: m.ten }))} placeholder="Chưa gán giá…" />
          </div>
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-auto">
          {sapToi.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có buổi đuổi nào đang chờ.</p> : sapToi.map((c) => (
            <button key={c.id} onClick={() => setPickId(c.id)} className={`block w-full rounded-lg border p-3 text-left text-[13px] ${pickId === c.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex flex-wrap items-center gap-x-2">
                <b>Buổi đuổi · {ddmm(c.ngay)}</b>
                <span className="text-slate-500">{c.gio_bat_dau?.slice(0, 5)}{c.phong ? ` · ${c.phong}` : ''}</span>
                <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">{c.hs.length} HS</span>
              </div>
              {c.hs.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.hs.map((h) => (
                    <span key={h.hoc_sinh_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-normal text-slate-600">
                      {h.ho_ten}{h.lop ? ` · ${h.lop}${h.mon ? ` (${h.mon})` : ''}` : ''}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? '…' : mode === 'moi' ? `Xếp ${rows.length} buổi` : 'Gộp vào buổi'}</button>
      </div>
    </Modal>
  )
}

// ── Detail buổi đuổi: điểm danh + nhận xét per-HS (KHÔNG ET). Hoàn thành buổi · per-HS Hoàn thành KHÓA. ──
// Nhận buoiId (KHÔNG phải CaDuoi đầy đủ) — tự load hết, vì mở từ "Việc của tôi" (GV) chỉ có buoiId,
// giống pattern BuoiBuDetail (bug 07-07: GV KHTN xếp đuổi xong không thấy task "Đánh giá" đâu cả —
// getMyTasks() từ trước tới giờ CHỈ route loai='thuong'/'bu', THIẾU HẲN loai='bo_tro_duoi').
export function BuoiDuoiDetail({ buoiId, readOnly = false, onClose }: { buoiId: string; readOnly?: boolean; onClose: () => void }) {
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [nx, setNx] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [sua, setSua] = useState(false)
  const [meta, setMeta] = useState<{ ngay: string; gio_bat_dau: string | null; phong: string | null; nguoi_day: string | null; nguoi_day_tg: string | null }>({ ngay: '', gio_bat_dau: null, phong: null, nguoi_day: null, nguoi_day_tg: null })
  const [dgXong, setDgXong] = useState(false)
  const [mucDuoi, setMucDuoi2] = useState<MucHocDuoi[]>([])
  const [mucId, setMucId] = useState<string | null>(null)
  const [hsInfo, setHsInfo] = useState<Record<string, { lop: string; mon: string }>>({})
  const [dangByCase, setDangByCase] = useState<Record<string, DangDuoi[]>>({}) // scope dạng + đã dạy per case (0099)
  const [busyDang, setBusyDang] = useState<string | null>(null)
  const lopDuoiCua = (hsId: string) => hsInfo[hsId]?.lop ?? ''
  const monDuoiCua = (hsId: string) => hsInfo[hsId]?.mon ?? ''

  async function reload() {
    const [b, r, dg, hi, dc] = await Promise.all([getBuoi(buoiId), getRoster(buoiId), getDanhGia(buoiId), getBuoiDuoiHsInfo(buoiId), getDangCuaBuoiDuoi(buoiId)])
    setDangByCase(dc)
    if (b) {
      setMeta({ ngay: (b as any).ngay, gio_bat_dau: (b as any).gio_bat_dau, phong: (b as any).phong, nguoi_day: (b as any).nguoi_day, nguoi_day_tg: (b as any).nguoi_day_tg })
      setMucId((b as any).muc_hoc_duoi_id ?? null); setDgXong(!!(b as any).danh_gia_xong_at)
    }
    setRoster(r); setHsInfo(hi)
    const m: Record<string, string> = {}
    for (const [hsId, v] of Object.entries(dg)) m[hsId] = (v as any).nhan_xet ?? ''
    setNx(m)
  }
  useEffect(() => { reload(); listMucHocDuoi().then(setMucDuoi2).catch(() => {}) }, [buoiId]) // eslint-disable-line

  async function onDoiMuc(id: string | null) { setMucId(id); try { await setMucHocDuoi(buoiId, id) } catch (e: any) { alert(e.message ?? String(e)) } }
  async function setDD(r: BuoiHocHS, tt: 'co_mat' | 'vang') { try { await diemDanh(r.id, tt); await reload() } catch (e: any) { alert(e.message) } }
  async function onHuy() { const ly = prompt('Lý do huỷ buổi đuổi?'); if (!ly) return; try { await huyBuoi(buoiId, ly); onClose() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function onXoaHS(r: BuoiHocHS) { if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi đuổi?`)) return; try { await xoaHSKhoiBuoi(r); await reload() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function luuNhanXet(hsId: string) { try { await setNhanXet(buoiId, hsId, nx[hsId] ?? '') } catch (e: any) { alert(e.message) } }
  // Tick "đã dạy dạng này" (Thùy 07-13 — người dạy xác nhận, từ đó biết lúc nào kết thúc được đợt).
  // Dạng đã dạy ở BUỔI KHÁC: vẫn bỏ tick được nhưng hỏi lại (tránh lỡ tay xoá dấu của buổi trước).
  async function toggleDangDay(d: DangDuoi) {
    if (d.day_at && d.day_buoi_id !== buoiId && !confirm(`Dạng ${d.ma_dang} đã đánh dấu dạy ở buổi khác — bỏ dấu "đã dạy"?`)) return
    setBusyDang(d.id)
    try { await setDangDay(d.id, d.day_at ? null : buoiId); await reload() }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyDang(null) }
  }
  async function toggleDong() {
    setBusy(true)
    try { if (dgXong) await moLaiDanhGia(buoiId); else await dongDanhGia(buoiId); onClose() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  async function onHoanThanhKhoa(caseId: string, ten: string) {
    if (!confirm(`Hoàn thành ĐỢT bổ trợ đuổi của ${ten}? Đợt sẽ chuyển sang tab Hoàn thành (kết thúc sớm nếu chưa đủ số buổi dự kiến).`)) return
    try { await hoanThanhKhoaDuoi(caseId); await reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f7]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-slate-800">‹ Bổ trợ đuổi</button>
        <span className="text-[15px] font-semibold text-slate-800">Buổi đuổi · {ddmm(meta.ngay)} · {meta.gio_bat_dau?.slice(0, 5)}{meta.phong ? ` · ${meta.phong}` : ''}</span>
        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">{roster.length} HS</span>
        {!readOnly && <button onClick={() => setSua(true)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-700">✎ Sửa buổi</button>}
        {!readOnly && <button onClick={onHuy} className="rounded-lg border border-rose-200 px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Huỷ buổi</button>}
        {!readOnly && (
          <button onClick={toggleDong} disabled={busy} className={`ml-auto rounded-lg px-4 py-2 text-[14px] font-medium disabled:opacity-50 ${dgXong ? 'border border-amber-300 text-amber-700 hover:bg-amber-50' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{dgXong ? '↩ Mở lại buổi' : '✓ Hoàn thành buổi'}</button>
        )}
        {readOnly && (
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-[13px] font-medium text-emerald-700">✓ Buổi đã hoàn thành</span>
            <span className="text-[12px] text-slate-400">Suất CÓ MẶT tự cộng vào tiến độ đợt ("Học y/N" ở tab Đang đuổi); vắng không tính — xếp lại.</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-2.5">
        <span className="text-[12px] font-medium text-slate-500">Mức học đuổi (giá của ca này):</span>
        <div className="w-56">
          {readOnly
            ? <span className="text-[13px] font-medium text-slate-700">{mucDuoi.find((m) => m.id === mucId)?.ten ?? 'Chưa gán giá'}</span>
            : <SearchSelect value={mucId} onChange={onDoiMuc} options={mucDuoi.map((m) => ({ id: m.id, label: m.ten }))} placeholder="Chưa gán giá…" />}
        </div>
        {!mucId && <span className="rounded px-1.5 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-700">⚠ Chưa tính được học phí đuổi cho ca này</span>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px] space-y-3">
          {roster.length === 0 ? <Empty t="Buổi chưa có HS." /> : (() => { const tenHT = tenHienThiDs(roster.map((r) => r.hoc_sinh?.ho_ten)); return roster.map((r, i) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-semibold text-slate-800">{tenHT[i]}</span>
                {r.hoc_sinh?.ma_hs && <span className="font-mono text-[11px] text-slate-400">{r.hoc_sinh.ma_hs}</span>}
                {lopDuoiCua(r.hoc_sinh_id) && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">đuổi lớp {lopDuoiCua(r.hoc_sinh_id)}{monDuoiCua(r.hoc_sinh_id) ? ` (${monDuoiCua(r.hoc_sinh_id)})` : ''}</span>}
                <div className="ml-auto flex gap-1.5">
                  <button disabled={readOnly} onClick={() => setDD(r, 'co_mat')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'co_mat' ? 'bg-emerald-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Có mặt</button>
                  <button disabled={readOnly} onClick={() => setDD(r, 'vang')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'vang' ? 'bg-rose-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Vắng</button>
                  {/* Hoàn thành khóa = hành động trên CASE (bo_tro_duoi), KHÁC hoàn thành buổi (đóng đánh giá) — vẫn bấm được
                      dù buổi đã đóng/readOnly, vì quyết định "HS bắt kịp" thường ra NGAY sau khi xem xong nhận xét buổi cuối. */}
                  {r.bo_tro_duoi_id && (
                    <button onClick={() => onHoanThanhKhoa(r.bo_tro_duoi_id!, r.hoc_sinh?.ho_ten ?? 'HS')} title="HS đã bắt kịp → kết thúc đợt đuổi sớm" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-emerald-500">✓ Hoàn thành đợt</button>
                  )}
                  {!readOnly && <button onClick={() => onXoaHS(r)} title="Gỡ HS khỏi buổi đuổi" className="rounded px-1.5 py-1 text-[12px] text-slate-300 hover:bg-rose-50 hover:text-rose-600">✕</button>}
                </div>
              </div>
              {/* Xác nhận DẠNG ĐÃ DẠY (0099) — GV tick dạng vừa dạy buổi này; ✓ xanh đậm = dạy buổi
                  NÀY (click bỏ), ✓ nhạt = đã dạy buổi khác (click bỏ có hỏi lại), trắng = chưa dạy. */}
              {r.bo_tro_duoi_id && (dangByCase[r.bo_tro_duoi_id]?.length ?? 0) > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Dạng đã dạy {dangByCase[r.bo_tro_duoi_id]!.filter((d) => d.day_at).length}/{dangByCase[r.bo_tro_duoi_id]!.length}:
                  </span>
                  {dangByCase[r.bo_tro_duoi_id]!.map((d) => (
                    <button key={d.id} disabled={busyDang === d.id} onClick={() => toggleDangDay(d)}
                      title={d.day_at ? (d.day_buoi_id === buoiId ? 'Đã dạy BUỔI NÀY — click để bỏ' : 'Đã dạy ở buổi trước — click để bỏ dấu') : 'Chưa dạy — click nếu buổi này đã dạy dạng này'}
                      className={`rounded-lg border px-2 py-0.5 font-mono text-[12px] font-medium ${busyDang === d.id ? 'opacity-50' : ''} ${
                        d.day_at ? (d.day_buoi_id === buoiId ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-emerald-200 bg-emerald-50 text-emerald-600') : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300'}`}>
                      {d.day_at ? '✓ ' : ''}{d.ma_dang}
                    </button>
                  ))}
                </div>
              )}
              <textarea value={nx[r.hoc_sinh_id] ?? ''} disabled={readOnly} onChange={(e) => setNx((m) => ({ ...m, [r.hoc_sinh_id]: e.target.value }))} onBlur={() => luuNhanXet(r.hoc_sinh_id)}
                placeholder="Nhận xét sau buổi (tiến độ bắt kịp, điểm cần lưu ý…)" className="mt-2.5 h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50" />
            </div>
          )) })()}
        </div>
      </div>
      {sua && <SuaBuoiModal buoi={{ id: buoiId, ...meta }} onClose={() => setSua(false)} onSaved={() => { setSua(false); reload() }} />}
    </div>
  )
}
