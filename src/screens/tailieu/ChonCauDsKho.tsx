// Popup CHỌN TAY câu Đúng/Sai từ KHO CHỦ ĐỀ cho phần Đ/S của MT khuôn THPT (Thùy 13/11: "Câu đúng sai cần được chọn tay từ kho chứ").
// Lọc chủ đề (mặc định các chủ đề đã chọn ở phần) · tìm chữ trong đề / mã câu · ít dùng đứng trước · xem trước đủ mệnh đề (CauPreview
// dùng chung của KhoPicker) · tick nhiều câu, thứ tự = thứ tự bấm · câu đã có ở chỗ khác trong đề thì khoá. Danh sách + số lần dùng ở DB
// (fn_mt_ds_kho_cau), mỗi lần chỉ tải 1 trang.
import { useEffect, useRef, useState } from 'react'
import { khoCauDs, type CauDsKho } from '../../lib/mt'
import { CauPreview } from '../../components/KhoPicker'

export default function ChonCauDsKho({ chuDe, macDinh, selected, khoa, onClose, onConfirm }: {
  chuDe: { id: string; ten: string; so_cau: number }[]   // chủ đề của khối có câu Đ/S
  macDinh: string[]                                       // chủ đề bật sẵn
  selected: string[]                                      // câu đang ở hàng mở popup
  khoa: string[]                                          // câu đã dùng ở chỗ khác trong đề
  onClose: () => void
  onConfirm: (items: CauDsKho[]) => Promise<void> | void
}) {
  const [loc, setLoc] = useState<string[]>(macDinh.length ? macDinh : chuDe.slice(0, 1).map((x) => x.id))
  const [tim, setTim] = useState('')
  const [timTre, setTimTre] = useState('')
  const [rows, setRows] = useState<CauDsKho[]>([])
  const [tong, setTong] = useState(0)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [chon, setChon] = useState<CauDsKho[]>([])
  const [busy, setBusy] = useState(false)
  const khoaSet = new Set(khoa.filter((m) => !selected.includes(m)))
  const lan = useRef(0)

  useEffect(() => { const t = setTimeout(() => setTimTre(tim.trim()), 300); return () => clearTimeout(t) }, [tim])
  useEffect(() => {
    const my = ++lan.current
    setRows([]); setTong(0); setLoi(null)
    if (!loc.length) return
    setDangTai(true)
    khoCauDs(loc, timTre, 0).then((r) => { if (lan.current === my) { setRows(r); setTong(r[0]?.tong ?? 0) } })
      .catch((e) => { if (lan.current === my) setLoi(e?.message ?? String(e)) })
      .finally(() => { if (lan.current === my) setDangTai(false) })
  }, [loc.join(','), timTre]) // eslint-disable-line
  async function themTrang() {
    const my = lan.current
    setDangTai(true)
    try { const r = await khoCauDs(loc, timTre, rows.length); if (lan.current === my) setRows((x) => [...x, ...r]) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDangTai(false) }
  }
  const tenCd = (id: string) => chuDe.find((x) => x.id === id)?.ten ?? id
  const bat = (r: CauDsKho) => {
    if (khoaSet.has(r.ma_cau)) return
    setChon((c) => (c.some((x) => x.ma_cau === r.ma_cau) ? c.filter((x) => x.ma_cau !== r.ma_cau) : [...c, r]))
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-md:inset-0 max-md:rounded-none" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-slate-200 px-5 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-slate-900">Chọn câu Đúng/Sai từ kho chủ đề</h3>
            <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm chữ trong đề / mã câu…"
              className="h-8 w-64 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-teal-400 max-md:w-full" autoFocus />
            <span className="text-[12px] text-slate-500">{dangTai && !rows.length ? 'Đang tải…' : `${tong} câu`}</span>
            <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chuDe.map((cd) => { const on = loc.includes(cd.id)
              return <button key={cd.id} onClick={() => setLoc((l) => (on ? l.filter((x) => x !== cd.id) : [...l, cd.id]))}
                className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${on ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-300'}`}>{cd.ten} <span className={on ? 'text-teal-100' : 'text-slate-400'}>· {cd.so_cau}</span></button> })}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-slate-50/60 p-4">
          {loi && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{loi}</div>}
          {!loc.length ? <p className="text-sm text-slate-500">Chọn ít nhất 1 chủ đề ở trên.</p>
            : !dangTai && !rows.length ? <p className="text-sm text-slate-500">Không có câu nào khớp.</p>
            : (
              <div className="space-y-2">
                {rows.map((r) => {
                  const thu = chon.findIndex((x) => x.ma_cau === r.ma_cau)
                  const khoaCau = khoaSet.has(r.ma_cau)
                  return (
                    <div key={r.ma_cau} onClick={() => bat(r)}
                      className={`cursor-pointer rounded-xl border bg-white p-3 transition ${thu >= 0 ? 'border-teal-500 ring-2 ring-teal-200' : khoaCau ? 'cursor-not-allowed border-slate-100 opacity-50' : 'border-slate-200 hover:border-teal-300'}`}>
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className={`flex h-5 min-w-5 items-center justify-center rounded px-1 font-bold ${thu >= 0 ? 'bg-teal-600 text-white' : 'border border-slate-300 text-transparent'}`}>{thu >= 0 ? thu + 1 : '·'}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{r.ma_cau}</span>
                        {r.kho === 'hgt' && <span className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-700">HGT</span>}
                        <span className="text-slate-500">{tenCd(r.chu_de_id)}</span>
                        <span className={`ml-auto rounded px-1.5 py-0.5 ${r.so_lan_dung ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{r.so_lan_dung ? `đã dùng ${r.so_lan_dung} lần` : 'chưa dùng'}</span>
                        {khoaCau && <span className="rounded bg-slate-200 px-1.5 py-0.5 text-slate-600">đã có trong đề</span>}
                      </div>
                      <CauPreview c={r.cau} />
                    </div>
                  )
                })}
                {rows.length < tong && (
                  <button onClick={themTrang} disabled={dangTai} className="w-full rounded-lg border border-dashed border-slate-300 bg-white py-2 text-[13px] text-slate-600 hover:border-teal-300 disabled:opacity-50">
                    {dangTai ? 'Đang tải…' : `Xem thêm (${rows.length}/${tong})`}</button>
                )}
              </div>
            )}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-3">
          <span className="text-[13px] text-slate-600">Đã chọn <b>{chon.length}</b> câu — câu đầu vào hàng đang mở, các câu sau điền tiếp hàng trống.</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!chon.length || busy} onClick={async () => { setBusy(true); try { await onConfirm(chon) } finally { setBusy(false) } }}
            className="rounded-lg bg-teal-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang ghi…' : `Dùng ${chon.length} câu`}</button>
        </div>
      </div>
    </div>
  )
}
