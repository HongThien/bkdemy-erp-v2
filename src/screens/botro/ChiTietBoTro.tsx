// DASHBOARD BỔ TRỢ › CHI TIẾT BỔ TRỢ (Thùy 10/11): bảng tra cứu cho vận hành — MỖI BUỔI bổ trợ (bù · yếu · đuổi · hình · nhẹ · ôn thi) là 1 DÒNG, cột bám sát DB.
// Lọc + tìm kiếm (không dấu) + phân trang chạy ở DB (fn_botro_chi_tiet); màn chỉ vẽ. Chỉ đọc.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { chiTietBoTro, type DongChiTiet, type KqChiTiet, type LoaiChiTiet } from '../../lib/botro_lap_day'
import { congNgay, ddmmVN, homNayVN, thuCuaNgay } from '../../lib/tuan'

const LOAI: { k: LoaiChiTiet; ten: string; cls: string }[] = [
  { k: 'bo_tro_yeu', ten: 'Yếu', cls: 'border-amber-200 bg-amber-50 text-amber-800' },
  { k: 'bu', ten: 'Bù', cls: 'border-sky-200 bg-sky-50 text-sky-800' },
  { k: 'bo_tro_duoi', ten: 'Đuổi', cls: 'border-violet-200 bg-violet-50 text-violet-800' },
  { k: 'bo_tro_hinh', ten: 'Hình', cls: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800' },
  { k: 'bo_tro_nhe', ten: 'Sau giờ', cls: 'border-teal-200 bg-teal-50 text-teal-800' },
  { k: 'bo_tro_on_thi', ten: 'Ôn thi', cls: 'border-rose-200 bg-rose-50 text-rose-800' },
]
const TT: { k: string; ten: string; cls: string }[] = [
  { k: 'mo', ten: 'Mở', cls: 'border-sky-200 bg-sky-50 text-sky-700' },
  { k: 'hoan_tat', ten: 'Hoàn tất', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { k: 'huy', ten: 'Huỷ', cls: 'border-rose-200 bg-rose-50 text-rose-700' },
]
const DD: Record<string, { t: string; cls: string }> = {
  co_mat: { t: 'có mặt', cls: 'text-emerald-700' }, vang: { t: 'vắng', cls: 'text-rose-600' }, vang_phep: { t: 'vắng phép', cls: 'text-rose-500' },
}
const KHOI_OPTS = ['3', '4', '4T', '5', '5T', '6', '7', '8', '9', '10', '11', '12']
const PAGE = 100
const thuHai = (d: string) => { const [y, m, dd] = d.split('-').map(Number); return congNgay(d, -((new Date(Date.UTC(y, m - 1, dd)).getUTCDay() + 6) % 7)) }
const gio = (d: DongChiTiet) => (d.bd ? `${d.bd}${d.kt ? `–${d.kt}` : ''}` : '—')
const hhmm = (iso: string | null) => { if (!iso) return null; const t = new Date(new Date(iso).getTime() + 7 * 3600000); return `${String(t.getUTCDate()).padStart(2, '0')}/${String(t.getUTCMonth() + 1).padStart(2, '0')} ${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}` }

type F = { tu: string; den: string; loai: LoaiChiTiet[]; tt: string[]; khoi: string; ganCa: '' | 'co' | 'khong'; q: string; trang: number }
const macDinh = (): F => { const t = thuHai(homNayVN()); return { tu: t, den: congNgay(t, 6), loai: [], tt: [], khoi: '', ganCa: '', q: '', trang: 0 } }
const NHO: { f: F; kq: KqChiTiet | null } = { f: macDinh(), kq: null } // rời màn rồi quay lại = đúng chỗ cũ (CLAUDE.md §2)

export default function ChiTietBoTro({ toggle }: { toggle: ReactNode }) {
  const [f, setFS] = useState<F>(NHO.f)
  const [q, setQ] = useState(NHO.f.q)             // ô gõ — đẩy vào bộ lọc sau 300 ms
  const [kq, setKq] = useState<KqChiTiet | null>(NHO.kq)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const lanRef = useRef(0)
  const setF = (p: Partial<F>) => setFS((x) => { const n = { ...x, ...p, ...(('trang' in p) ? {} : { trang: 0 }) }; NHO.f = n; return n })
  useEffect(() => { const id = setTimeout(() => { if (q !== f.q) setF({ q }) }, 300); return () => clearTimeout(id) }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const lan = ++lanRef.current
    setDangTai(true); setLoi(null)
    chiTietBoTro({ tu: f.tu, den: f.den, loai: f.loai, tt: f.tt, khoi: f.khoi || null, ganCa: f.ganCa || null, q: f.q, limit: PAGE, offset: f.trang * PAGE })
      .then((r) => { if (lan === lanRef.current) { NHO.kq = r; setKq(r) } }) // giữ dòng cũ tới khi có dòng mới — không trắng màn
      .catch((e: any) => { if (lan === lanRef.current) setLoi(e?.message ?? String(e)) })
      .finally(() => { if (lan === lanRef.current) setDangTai(false) })
  }, [f])

  const bat = <T,>(ds: T[], v: T) => (ds.includes(v) ? ds.filter((x) => x !== v) : [...ds, v])
  const preset = (tu: string, den: string) => setF({ tu, den })
  const hn = homNayVN(), t2 = thuHai(hn)
  const tong = kq?.tong ?? 0, soTrang = Math.max(1, Math.ceil(tong / PAGE))
  const bo = f.tu !== macDinh().tu || f.den !== macDinh().den || f.loai.length || f.tt.length || f.khoi || f.ganCa || f.q

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f5f7] px-6 py-3">
      <div className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {toggle}
          <span className="ml-1 text-[12px] text-slate-500">Mỗi <b className="text-slate-700">buổi bổ trợ</b> một dòng — tra cứu cho vận hành. Chỉ đọc.</span>
        </div>

        <div className="mb-2 flex flex-col gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Tìm tên / mã học sinh, trợ giảng, lớp, phòng…" className="h-8 w-[300px] rounded-lg border border-slate-300 px-3 text-[13px] outline-none focus:border-indigo-400" />
            {q && <button onClick={() => { setQ(''); setF({ q: '' }) }} className="text-[13px] text-slate-400 hover:text-slate-600">✕</button>}
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <input type="date" value={f.tu} onChange={(e) => e.target.value && setF({ tu: e.target.value, den: e.target.value > f.den ? e.target.value : f.den })} className="h-8 rounded-lg border border-slate-300 px-2 text-[12.5px]" />
            <span className="text-[12px] text-slate-400">→</span>
            <input type="date" value={f.den} onChange={(e) => e.target.value && setF({ den: e.target.value, tu: e.target.value < f.tu ? e.target.value : f.tu })} className="h-8 rounded-lg border border-slate-300 px-2 text-[12.5px]" />
            {([['Hôm nay', hn, hn], ['Tuần này', t2, congNgay(t2, 6)], ['Tuần trước', congNgay(t2, -7), congNgay(t2, -1)], ['7 ngày tới', hn, congNgay(hn, 6)], ['30 ngày qua', congNgay(hn, -29), hn]] as const).map(([t, a, b]) => (
              <button key={t} onClick={() => preset(a, b)} className={`rounded-full border px-2.5 py-0.5 text-[12px] font-medium ${f.tu === a && f.den === b ? 'border-indigo-300 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{t}</button>))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">Loại</span>
            {LOAI.map((l) => <button key={l.k} onClick={() => setF({ loai: bat(f.loai, l.k) })} className={`rounded-full border px-2.5 py-0.5 text-[12px] font-medium ${f.loai.includes(l.k) ? `${l.cls} ring-2 ring-indigo-300` : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{l.ten}</button>)}
            <span className="mx-1 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">Trạng thái</span>
            {TT.map((l) => <button key={l.k} onClick={() => setF({ tt: bat(f.tt, l.k) })} className={`rounded-full border px-2.5 py-0.5 text-[12px] font-medium ${f.tt.includes(l.k) ? `${l.cls} ring-2 ring-indigo-300` : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{l.ten}</button>)}
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <select value={f.khoi} onChange={(e) => setF({ khoi: e.target.value })} className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-[12.5px]"><option value="">Tất cả khối</option>{KHOI_OPTS.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select>
            <select value={f.ganCa} onChange={(e) => setF({ ganCa: e.target.value as F['ganCa'] })} className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-[12.5px]"><option value="">Ca trực: tất cả</option><option value="co">Đã gắn ca trực</option><option value="khong">Chưa gắn ca trực</option></select>
            {bo ? <button onClick={() => { const m = macDinh(); setQ(''); setFS(m); NHO.f = m }} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] text-slate-600 hover:bg-slate-50">↺ Bỏ lọc</button> : null}
            <span className="ml-auto text-[12.5px] text-slate-500">{dangTai ? 'Đang tải…' : <><b className="text-slate-800">{tong}</b> buổi{tong > PAGE ? ` · trang ${f.trang + 1}/${soTrang}` : ''}</>}</span>
          </div>
        </div>

        {loi && <p className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">Không tải được: {loi}</p>}
        <div className="min-h-0 flex-1 overflow-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1180px] text-left text-[12.5px]">
            <thead className="sticky top-0 z-[1] bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
              <tr>{['Ngày', 'Giờ', 'Loại', 'Trạng thái', 'Môn', 'Lớp', 'Trợ giảng', 'Phòng', 'Học sinh', 'Đơn vị', 'Ca trực', 'ET', 'Đánh giá', 'Ghi chú'].map((c) => <th key={c} className="whitespace-nowrap px-2.5 py-1.5 font-semibold">{c}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(kq?.rows ?? []).map((d) => <Dong key={d.id} d={d} />)}
              {kq && kq.rows.length === 0 && <tr><td colSpan={14} className="px-3 py-10 text-center text-slate-400">Không có buổi bổ trợ nào khớp bộ lọc.</td></tr>}
            </tbody>
          </table>
          {!kq && !loi && <p className="py-10 text-center text-[13px] text-slate-400">Đang tải…</p>}
        </div>
        {tong > PAGE && (
          <div className="mt-2 flex items-center justify-center gap-2 text-[12.5px]">
            <button disabled={f.trang === 0} onClick={() => setF({ trang: f.trang - 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40">◀ Trước</button>
            <span className="text-slate-500">Trang {f.trang + 1} / {soTrang}</span>
            <button disabled={f.trang + 1 >= soTrang} onClick={() => setF({ trang: f.trang + 1 })} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40">Sau ▶</button>
          </div>)}
      </div>
    </div>
  )
}

function Dong({ d }: { d: DongChiTiet }) {
  const l = LOAI.find((x) => x.k === d.loai), t = TT.find((x) => x.k === d.trang_thai)
  const nhieu = d.hs.length > 6
  return (
    <tr className={`align-top hover:bg-slate-50/70 ${d.trang_thai === 'huy' ? 'text-slate-400' : ''}`}>
      <td className="whitespace-nowrap px-2.5 py-1.5"><b className={d.trang_thai === 'huy' ? '' : 'text-slate-800'}>{ddmmVN(d.ngay)}</b> <span className="text-slate-400">{thuCuaNgay(d.ngay)}</span></td>
      <td className="whitespace-nowrap px-2.5 py-1.5">{gio(d)}</td>
      <td className="px-2.5 py-1.5"><span className={`whitespace-nowrap rounded-full border px-2 py-px text-[11.5px] font-medium ${l?.cls ?? 'border-slate-200 bg-slate-50 text-slate-600'}`}>{l?.ten ?? d.loai}</span></td>
      <td className="px-2.5 py-1.5"><span className={`whitespace-nowrap rounded-full border px-2 py-px text-[11.5px] font-medium ${t?.cls ?? 'border-slate-200 bg-slate-50 text-slate-600'}`}>{t?.ten ?? d.trang_thai}</span></td>
      <td className="whitespace-nowrap px-2.5 py-1.5">{d.mon ?? '—'}</td>
      <td className="whitespace-nowrap px-2.5 py-1.5">{d.lop ?? '—'}</td>
      <td className="whitespace-nowrap px-2.5 py-1.5">{d.ta ?? <span className="text-amber-700">chưa có</span>}</td>
      <td className="whitespace-nowrap px-2.5 py-1.5">{d.phong ?? '—'}</td>
      <td className="px-2.5 py-1.5">
        {d.hs.length === 0 ? <span className="text-slate-400">chưa có em</span> : (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            {d.hs.slice(0, nhieu ? 5 : 6).map((h, i) => (
              <span key={i} className="whitespace-nowrap" title={`${h.ten}${h.ma ? ` · ${h.ma}` : ''}${h.khoi ? ` · K${h.khoi}` : ''} · ${DD[h.dd ?? '']?.t ?? 'chưa điểm danh'} · ${h.dv} đơn vị`}>
                <span className="font-medium text-slate-800">{h.ten}</span>{h.ma ? <span className="ml-1 text-[11px] text-slate-400">{h.ma}</span> : null}
                <span className={`ml-1 text-[11px] ${DD[h.dd ?? '']?.cls ?? 'text-slate-400'}`}>{DD[h.dd ?? '']?.t ?? '—'}</span>
              </span>))}
            {nhieu && <span className="text-[11.5px] font-semibold text-slate-500">+{d.hs.length - 5} em nữa</span>}
          </div>)}
      </td>
      <td className="whitespace-nowrap px-2.5 py-1.5 text-right tabular-nums">{d.dv || '—'}</td>
      <td className="whitespace-nowrap px-2.5 py-1.5">{d.ca_bo_tro_id ? <span className="text-emerald-700" title="Đã gắn ca trực">✓ K{d.ca_khoi}</span> : <span className="text-slate-400" title="Chưa gắn ca trực (xếp ngoài lịch trực)">—</span>}</td>
      <td className="whitespace-nowrap px-2.5 py-1.5 text-[11.5px] text-slate-500">{hhmm(d.et_dong_at) ?? '—'}</td>
      <td className="whitespace-nowrap px-2.5 py-1.5 text-[11.5px] text-slate-500">{hhmm(d.danh_gia_xong_at) ?? '—'}</td>
      <td className="max-w-[220px] px-2.5 py-1.5 text-[11.5px] text-slate-500">{d.ly_do_huy ?? ''}</td>
    </tr>
  )
}
