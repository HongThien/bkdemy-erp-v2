// ✉️ HÒM THƯ nhân sự (kiểu Gmail): nút phong thư + số chưa đọc ĐỎ; bấm mở HỘP THƯ LỚN 2 khung:
//   trái = danh sách thư (CHƯA ĐỌC in đậm + chấm màu, ĐÃ ĐỌC chữ thường nhạt hơn) · phải = đọc nội dung đầy đủ.
// Chữ là chính: tên người gửi / tiêu đề / vài dòng đầu nội dung, không icon lớn. Mở thư = tự đánh dấu đã đọc;
// "Đánh dấu chưa đọc" lấy lại cờ. Nguồn thư do DB tự đẻ (mig 202610140053) — client chỉ đọc + đổi cờ da_doc.
// Số chưa đọc đếm ở DB (head count); làm tươi mỗi 5 phút khi tab đang hiện + khi quay lại cửa sổ (11/11, trước là 60 s).
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../store/useStore'
import { listThu, demChuaDoc, danhDauDoc, danhDauChuaDoc, luongBaoLoi, NHAN_LOAI, type Thu, type LoaiThu, type LuongBaoLoi } from '../lib/homThu'
import { traLoiBaoLoi } from '../lib/baoloi'

const VN = 'Asia/Ho_Chi_Minh'
// Kiểu Gmail: hôm nay → giờ; năm nay → ngày/tháng; năm khác → ngày/tháng/năm.
const gioNgan = (iso: string) => {
  const d = new Date(iso), now = new Date()
  const ymd = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: VN })
  if (ymd(d) === ymd(now)) return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: VN })
  const nam = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: VN }).slice(0, 4)
  return d.toLocaleDateString('vi-VN', nam(d) === nam(now) ? { day: '2-digit', month: '2-digit', timeZone: VN } : { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: VN })
}
const gioDay = (iso: string) => new Date(iso).toLocaleString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: VN })
const dongDau = (s: string | null) => (s ?? '').split('\n').map((x) => x.trim()).filter(Boolean).join(' · ')

// Số chưa đọc DÙNG CHUNG mọi nút hòm thư đang mount (TopBar + Trang chủ có thể cùng hiện) — audit 11/11: đếm 60 s/lần
// × mỗi nút × mỗi tab mở = 123k lượt. Giờ: 1 lượt/5 phút khi tab ĐANG HIỆN, quay lại tab/cửa sổ thì đếm lại
// (gộp các lần gọi trong 30 s thành 1). §2.0 "cấm polling ngắn".
const DEM: { so: number | null; at: number; dang: Promise<number> | null } = { so: null, at: 0, dang: null }
function demChung(epBuoc = false): Promise<number> {
  if (!epBuoc && DEM.so !== null && Date.now() - DEM.at < 30000) return Promise.resolve(DEM.so)
  if (DEM.dang) return DEM.dang
  DEM.dang = demChuaDoc().then((n) => { DEM.so = n; DEM.at = Date.now(); return n }).finally(() => { DEM.dang = null })
  return DEM.dang
}

export default function HomThu({ di, duocDi, noiBat = false }: { di: (leaf: string) => void; duocDi: (leaf: string) => boolean; noiBat?: boolean }) {
  const coHoSo = useStore((s) => !!s.me)
  const [so, setSo] = useState(0)
  const [mo, setMo] = useState(false)
  const [ds, setDs] = useState<Thu[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [tab, setTab] = useState<'tat_ca' | 'chua_doc'>('tat_ca')
  const [loai, setLoai] = useState<LoaiThu | null>(null)
  const [chon, setChon] = useState<string | null>(null)

  const lamTuoiSo = useCallback((epBuoc = false) => { demChung(epBuoc).then(setSo).catch(() => { /* chưa có bảng / mất mạng: giữ số cũ */ }) }, [])
  useEffect(() => {
    if (!coHoSo) return
    lamTuoiSo()
    const t = setInterval(() => { if (!document.hidden) lamTuoiSo() }, 5 * 60000)
    const khiHien = () => { if (!document.hidden) lamTuoiSo() }
    window.addEventListener('focus', khiHien)
    document.addEventListener('visibilitychange', khiHien)
    return () => { clearInterval(t); window.removeEventListener('focus', khiHien); document.removeEventListener('visibilitychange', khiHien) }
  }, [coHoSo, lamTuoiSo])

  // Mở: nạp danh sách (không xoá list đang hiện khi nạp lại).
  useEffect(() => {
    if (!mo) return
    setLoi(null)
    listThu(150).then(setDs).catch((e) => { setLoi(e?.message ?? 'lỗi'); setDs((c) => c ?? []) })
  }, [mo])
  useEffect(() => {
    if (!mo) return
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') setMo(false) }
    document.addEventListener('keydown', phim)
    return () => document.removeEventListener('keydown', phim)
  }, [mo])

  const soChua = useMemo(() => (ds ?? []).filter((t) => !t.da_doc).length, [ds])
  const hien = useMemo(() => (ds ?? []).filter((t) => (tab === 'tat_ca' || !t.da_doc) && (!loai || t.loai === loai)), [ds, tab, loai])
  const dangXem = useMemo(() => (ds ?? []).find((t) => t.id === chon) ?? null, [ds, chon])
  const cacLoai = useMemo(() => [...new Set((ds ?? []).map((t) => t.loai))], [ds])

  if (!coHoSo) return null

  // Đổi cờ tại chỗ (không nạp lại cả list): vá list + số, ghi DB nền, lỗi thì trả lại.
  const datCo = (ids: string[], daDoc: boolean) => {
    const can = (ds ?? []).filter((t) => ids.includes(t.id) && t.da_doc !== daDoc).map((t) => t.id)
    if (!can.length) return
    setDs((c) => (c ?? []).map((t) => (can.includes(t.id) ? { ...t, da_doc: daDoc } : t)))
    setSo((n) => { const m = Math.max(0, n + (daDoc ? -can.length : can.length)); DEM.so = m; return m })
    ;(daDoc ? danhDauDoc(can) : danhDauChuaDoc(can)).catch(() => {
      setDs((c) => (c ?? []).map((t) => (can.includes(t.id) ? { ...t, da_doc: !daDoc } : t)))
      lamTuoiSo(true)
    })
  }
  const moThu = (t: Thu) => { setChon(t.id); if (!t.da_doc) datCo([t.id], true) }
  const docHet = () => datCo((ds ?? []).filter((t) => !t.da_doc).map((t) => t.id), true)

  const nutIcon = noiBat ? (
    // NỔI BẬT (dưới lời chào): HÌNH PHONG THƯ to + số chưa đọc ĐỎ ở góc.
    <button onClick={() => setMo(true)} title={so > 0 ? `Hòm thư — ${so} thư chưa đọc` : 'Hòm thư — order, task, gậy, nhận xét liên quan tới bạn'}
      className="relative flex h-11 items-center gap-2 border border-[var(--sk-line)] bg-[var(--sk-surface)] pl-3 pr-4 text-[13.5px] font-bold text-[var(--sk-ink)] shadow-sm transition hover:brightness-110"
      style={{ borderRadius: 999, backdropFilter: 'var(--sk-blur)' }}>
      <span className="relative text-[24px] leading-none">✉️
        {so > 0 && <span className="absolute -right-2.5 -top-2 min-w-[20px] rounded-full bg-rose-600 px-1 text-center text-[11.5px] font-extrabold leading-[20px] text-white ring-2 ring-white">{so > 99 ? '99+' : so}</span>}
      </span>
      <span className={so > 0 ? 'pl-1.5' : ''}>Hòm thư</span>
    </button>
  ) : (
    <button onClick={() => setMo(true)} title="Hòm thư" className="relative flex size-8 items-center justify-center rounded-md text-[18px] hover:bg-[var(--sk-surface2)]">
      ✉️
      {so > 0 && <span className="absolute -right-1 -top-1 min-w-[17px] rounded-full bg-rose-600 px-1 text-center text-[10.5px] font-bold leading-[17px] text-white">{so > 99 ? '99+' : so}</span>}
    </button>
  )

  return (
    <div className="relative shrink-0">
      {nutIcon}
      {mo && createPortal(
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-3 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) setMo(false) }}>
          <div className="flex h-[min(82vh,760px)] w-[min(1180px,96vw)] flex-col overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl">
            {/* đầu: tên + tab Tất cả / Chưa đọc + lọc loại + đọc hết */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-2.5">
              <h3 className="mr-2 text-[17px] font-bold">Hòm thư</h3>
              <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-[13px] font-semibold">
                <button onClick={() => setTab('tat_ca')} className={`rounded-md px-3 py-1 ${tab === 'tat_ca' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Tất cả</button>
                <button onClick={() => setTab('chua_doc')} className={`rounded-md px-3 py-1 ${tab === 'chua_doc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                  Chưa đọc{soChua > 0 && <span className="ml-1.5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10.5px] font-bold text-white">{soChua}</span>}
                </button>
              </div>
              <div className="ml-1 flex flex-wrap items-center gap-1">
                {cacLoai.length > 1 && cacLoai.map((l) => (
                  <button key={l} onClick={() => setLoai(loai === l ? null : l)}
                    className={`rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${loai === l ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}>{NHAN_LOAI[l]?.ten ?? l}</button>
                ))}
              </div>
              <button onClick={docHet} disabled={soChua === 0} className="ml-auto rounded-md px-3 py-1 text-[13px] font-semibold text-indigo-600 hover:bg-indigo-50 disabled:text-slate-300 disabled:hover:bg-transparent">Đánh dấu đã đọc hết</button>
              <button onClick={() => setMo(false)} title="Đóng (Esc)" className="rounded-md px-2 py-1 text-[18px] leading-none text-slate-400 hover:bg-slate-200 hover:text-slate-700">✕</button>
            </div>

            <div className="flex min-h-0 flex-1">
              {/* DANH SÁCH */}
              <div className="w-[min(430px,44%)] shrink-0 overflow-y-auto border-r border-slate-200">
                {ds === null ? <p className="px-5 py-8 text-center text-[14px] text-slate-400">Đang tải…</p>
                  : loi ? <p className="px-5 py-8 text-center text-[14px] text-slate-400">Chưa tải được hòm thư ({loi}).</p>
                  : hien.length === 0 ? <p className="px-5 py-10 text-center text-[14px] text-slate-400">{tab === 'chua_doc' ? 'Không còn thư chưa đọc. ✓' : 'Hòm thư trống.'}</p>
                  : (
                    <ul>
                      {hien.map((t) => {
                        const chua = !t.da_doc, dangChon = t.id === chon
                        return (
                          <li key={t.id} className={`group relative border-b border-slate-100 ${dangChon ? 'bg-indigo-50' : chua ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/70 hover:bg-slate-100'}`}>
                            <button onClick={() => moThu(t)} className="flex w-full items-start gap-3 px-4 py-3 text-left">
                              <span aria-label={chua ? 'chưa đọc' : 'đã đọc'} className={`mt-[7px] size-2.5 shrink-0 rounded-full ${chua ? 'bg-indigo-600' : 'border border-slate-300'}`} />
                              <span className="min-w-0 flex-1">
                                <span className="flex items-baseline gap-2">
                                  <span className={`truncate text-[14px] ${chua ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{t.tu?.ho_ten ?? 'Hệ thống'}</span>
                                  <span className="shrink-0 rounded bg-slate-200/80 px-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">{NHAN_LOAI[t.loai]?.ten ?? t.loai}</span>
                                  <span className={`ml-auto shrink-0 text-[12px] tabular-nums ${chua ? 'font-semibold text-indigo-700' : 'text-slate-400'}`}>{gioNgan(t.created_at)}</span>
                                </span>
                                <span className={`mt-0.5 block text-[14px] leading-snug ${chua ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{t.tieu_de}</span>
                                {t.noi_dung && <span className={`mt-0.5 line-clamp-2 block text-[13px] leading-snug ${chua ? 'text-slate-600' : 'text-slate-400'}`}>{dongDau(t.noi_dung)}</span>}
                              </span>
                            </button>
                            {/* như Gmail: rê chuột hiện nút đổi cờ nhanh */}
                            <button onClick={() => datCo([t.id], chua)} title={chua ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
                              className="absolute right-3 top-9 hidden rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11.5px] font-semibold text-slate-500 shadow-sm hover:text-indigo-600 group-hover:block">
                              {chua ? '✓ Đã đọc' : '● Chưa đọc'}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
              </div>

              {/* ĐỌC THƯ */}
              <div className="min-w-0 flex-1 overflow-y-auto bg-white">
                {!dangXem ? (
                  <div className="flex h-full items-center justify-center px-8 text-center text-[14px] text-slate-400">
                    {ds && ds.length > 0 ? 'Chọn một thư ở bên trái để đọc.' : ''}
                  </div>
                ) : (
                  <article className="mx-auto max-w-[680px] px-8 py-7">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                      <span>{NHAN_LOAI[dangXem.loai]?.ten ?? dangXem.loai}</span>
                    </div>
                    <h2 className="text-[22px] font-bold leading-snug text-slate-900">{dangXem.tieu_de}</h2>
                    <p className="mt-2 text-[13.5px] text-slate-500">
                      <b className="font-semibold text-slate-700">{dangXem.tu?.ho_ten ?? 'Hệ thống'}</b> · <span className="capitalize">{gioDay(dangXem.created_at)}</span>
                    </p>
                    <div className="my-5 border-t border-slate-200" />
                    {dangXem.noi_dung
                      ? <p className="whitespace-pre-line text-[16px] leading-relaxed text-slate-800">{dangXem.noi_dung}</p>
                      : <p className="text-[15px] italic text-slate-400">(Thư không có nội dung — xem tiêu đề.)</p>}
                    {dangXem.bao_loi_id && <TraLoiHocSinh key={dangXem.bao_loi_id} id={dangXem.bao_loi_id} />}
                    <div className="mt-8 flex flex-wrap items-center gap-2">
                      {dangXem.lien_ket && duocDi(dangXem.lien_ket) && (
                        <button onClick={() => { setMo(false); di(dangXem.lien_ket!) }} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-semibold text-white hover:bg-indigo-500">Mở màn liên quan ›</button>
                      )}
                      <button onClick={() => datCo([dangXem.id], false)} className="rounded-lg border border-slate-300 px-4 py-2 text-[14px] font-semibold text-slate-600 hover:bg-slate-50">Đánh dấu chưa đọc</button>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

// TRẢ LỜI HỌC SINH ngay trong thư báo lỗi/góp ý (Thùy 10/11): các lần đã trả lời (ai, lúc nào — Thùy và Hải thấy của nhau)
// + ô viết. Gửi ⇒ DB thêm 1 dòng chuỗi + 1 tin 💬 vào Hòm thư app HS của em (fn_bao_loi_tra_loi). Gửi xong chỉ hỏi lại ĐÚNG báo lỗi này.
function TraLoiHocSinh({ id }: { id: string }) {
  const [l, setL] = useState<LuongBaoLoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [nd, setNd] = useState('')
  const [dang, setDang] = useState(false)
  const [vuaGui, setVuaGui] = useState(false)
  const tai = useCallback(() => luongBaoLoi(id).then(setL).catch((e) => setLoi(e?.message ?? 'lỗi')), [id])
  useEffect(() => { void tai() }, [tai])
  const gui = async () => {
    const v = nd.trim()
    if (v.length < 2 || dang) return
    setDang(true); setLoi(null)
    try { await traLoiBaoLoi(id, v); setNd(''); setVuaGui(true); await tai() }
    catch (e) { setLoi((e as Error)?.message ?? 'Chưa gửi được') }
    finally { setDang(false) }
  }
  return (
    <section className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-slate-800">💬 Trả lời em{l?.ten_hs ? ` ${l.ten_hs}` : ''}</h3>
        {l && l.tra_loi.length > 0 && <span className={`ml-auto text-[12px] font-semibold ${l.em_da_doc ? 'text-emerald-600' : 'text-slate-400'}`}>{l.em_da_doc ? '✓ Em đã xem' : 'Em chưa xem'}</span>}
      </div>
      {l === null && !loi && <p className="text-[13.5px] text-slate-400">Đang tải…</p>}
      {l && l.tra_loi.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {l.tra_loi.map((t, i) => (
            <li key={i} className="rounded-lg bg-white px-3 py-2 shadow-sm">
              <p className="text-[12px] text-slate-400"><b className="font-semibold text-slate-600">{t.ho_ten ?? 'Nhân sự'}</b> · {gioNgan(t.created_at)}</p>
              <p className="mt-0.5 whitespace-pre-line text-[14.5px] leading-snug text-slate-800">{t.noi_dung}</p>
            </li>
          ))}
        </ul>
      )}
      <textarea value={nd} onChange={(e) => { setNd(e.target.value.slice(0, 600)); setVuaGui(false) }} rows={3}
        placeholder="Viết lời trả lời — em sẽ thấy trong Hòm thư của app học sinh"
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14.5px] outline-none focus:border-indigo-500" />
      <div className="mt-2 flex items-center gap-3">
        <button onClick={gui} disabled={dang || nd.trim().length < 2}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-semibold text-white hover:bg-indigo-500 disabled:bg-slate-300">{dang ? 'Đang gửi…' : 'Gửi cho em'}</button>
        <span className="text-[12px] text-slate-400">{nd.length}/600</span>
        {vuaGui && <span className="text-[13px] font-semibold text-emerald-600">✓ Đã gửi vào Hòm thư của em</span>}
        {loi && <span className="text-[13px] text-rose-600">{loi}</span>}
      </div>
    </section>
  )
}
