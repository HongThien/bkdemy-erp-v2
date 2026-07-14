// QUẢN LÝ HỌC TẬP — truy cập THẲNG các hoạt động đánh giá (ET/MT/Chấm bài/Đánh giá/BTVN) theo LỚP,
// tách khỏi luồng vận hành buổi học (trước đây phải mở buổi học rồi bấm đúng tab mới xem lại được).
// Tái dùng nguyên listBuoiHoatDong + BuoiDetail + phân loại hoạt động từ KetQuaScreen (tab "Theo buổi
// (raw)") — chỉ đổi bố cục: lưới thẻ + popup → danh sách trái / nội dung phải (giống "Từng học sinh").
import { useEffect, useMemo, useState } from 'react'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listLop } from '../../lib/nhansu'
import { listBuoiHoatDong, type BuoiActivity } from '../../lib/mastery'
import { BuoiDetail } from '../gami/BuoiHocScreen'
import { ACTS, LOAI_TAB, type ActCard, type RawLoai } from '../ketqua/KetQuaScreen'

const MON_CO_KHO = ['Toán', 'KHTN']
// So chuỗi 'YYYY-MM' trực tiếp trên `ngay` (date string) — KHÔNG new Date() (tránh lệch timezone).
const fmtShort = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

export default function QuanLyHocTapScreen() {
  const [mon, setMon] = useState('Toán')
  const [lopId, setLopId] = useState<string | null>(null)
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [thang, setThang] = useState('') // '' = tất cả, else 'YYYY-MM'
  const [loai, setLoai] = useState<RawLoai>('all')
  const [rows, setRows] = useState<BuoiActivity[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [picked, setPicked] = useState<ActCard | null>(null)

  useEffect(() => {
    setLopId(null); setRows(null); setPicked(null)
    listLop().then((ls) => setLopOpts(ls.filter((l: any) => l.mon === mon).map((l: any) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `K${l.khoi}` : undefined })))).catch(() => setLopOpts([]))
  }, [mon])

  useEffect(() => {
    setPicked(null)
    if (!lopId) { setRows(null); return }
    setLoading(true)
    listBuoiHoatDong({ mon, lopId }).then(setRows).catch(() => setRows([])).finally(() => setLoading(false))
  }, [mon, lopId])

  useEffect(() => { setPicked(null) }, [thang, loai])

  const shown = useMemo(() => {
    const out: ActCard[] = []
    for (const b of rows ?? []) {
      if (thang && !b.ngay.startsWith(thang)) continue
      for (const a of ACTS) {
        if (!b[a.flag]) continue
        if (loai !== 'all' && a.key !== loai) continue
        out.push({ key: b.id + ':' + a.key, b, act: a })
      }
    }
    return out
  }, [rows, loai, thang])

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const loaiBtn = (on: boolean) => `h-7 rounded-full px-3 text-[12px] font-semibold transition ${on ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Quản lý học tập</span>
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Môn</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-56"><SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="Chọn lớp…" /></div>
        <span className="ml-2 text-[12px] text-slate-400">·</span>
        <span className="text-[12px] font-medium text-slate-500">Tháng</span>
        <input type="month" value={thang} onChange={(e) => setThang(e.target.value)}
          className="h-7 rounded-md border border-slate-200 px-2 text-[12px] text-slate-700" />
        {thang && <button onClick={() => setThang('')} className="h-7 rounded-md px-2 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">Tất cả</button>}
      </div>

      {!lopId ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Chọn một lớp để xem danh sách bài.</div>
      ) : (
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
              {LOAI_TAB.map((t) => <button key={t.key} onClick={() => setLoai(t.key)} className={loaiBtn(loai === t.key)}>{t.label}</button>)}
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              {loading ? (
                <p className="p-3 text-[12px] text-slate-500">Đang tải…</p>
              ) : shown.length === 0 ? (
                <p className="p-3 text-[12px] text-slate-500">Không có bài nào khớp bộ lọc.</p>
              ) : shown.map((c) => (
                <button key={c.key} onClick={() => setPicked(c)}
                  className={`flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2 text-left last:border-0 ${picked?.key === c.key ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold ${c.act.pill}`}>{c.act.label}</span>
                  <span className={`truncate text-[13px] ${picked?.key === c.key ? 'font-semibold text-indigo-700' : 'text-slate-700'}`}>{fmtShort(c.b.ngay)}</span>
                  <span className={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${c.b.trang_thai === 'hoan_tat' ? 'bg-emerald-500' : 'bg-slate-300'}`} title={c.b.trang_thai === 'hoan_tat' ? 'Hoàn tất' : 'Đang mở'} />
                </button>
              ))}
            </div>
          </aside>

          <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {!picked ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Chọn một bài (cột trái) để xem nội dung.</div>
            ) : (
              <BuoiDetail id={picked.b.id} tabs={[picked.act.tab]} initialTab={picked.act.tab} canManage={false} onClose={() => setPicked(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
