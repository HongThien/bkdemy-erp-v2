// Lịch sử ĐÓNG task (CEO 23/09 + 08/10) — dùng chung màn Gậy + màn Chất lượng vận hành.
// · GhiChuDong: 1 dòng tóm tắt hiện thẳng trên dòng gậy/đề xuất/task — hạn · đóng LẦN ĐẦU · mở lại N lần · đóng cuối.
//   Gậy trễ tính theo LẦN ĐÓNG ĐẦU (CEO 08/10) nên người chốt phải thấy ngay task có bị mở lại không.
// · LichSuTask: timeline đầy đủ (hạn · đóng/mở lại · dữ liệu HS nhập sau khi đóng · HS nộp muộn) từ fn_gay_lich_su.
// Mọi số do DB tính (fn_viec_tien_do / fn_gay_lich_su); đây chỉ render.
import { useEffect, useState } from 'react'
import { lichSuGay, type GayLichSuEvent, type GayLichSuLoai, type TienDoTask } from '../lib/gay'

export const ddmmhh = (iso: string | null) => {
  if (!iso) return '—'
  const t = new Date(new Date(iso).getTime() + 7 * 3600000)
  return `${String(t.getUTCDate()).padStart(2, '0')}/${String(t.getUTCMonth() + 1).padStart(2, '0')} ${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`
}
const nhanPhut = (p: number) => p < 60 ? `${p} phút` : p < 1440 ? `${Math.round(p / 6) / 10}h` : `${Math.round(p / 144) / 10} ngày`

export function GhiChuDong({ td }: { td: TienDoTask | undefined }) {
  if (!td) return null
  const treDau = td.tre_phut ?? 0
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-500">
      <span>hạn {ddmmhh(td.han)}</span>·
      {td.dong_dau
        ? <span>đóng lần đầu <b className={treDau > 0 ? 'text-rose-600' : 'text-emerald-600'}>{ddmmhh(td.dong_dau)}</b> ({treDau > 0 ? `trễ ${nhanPhut(treDau)}` : 'đúng hạn'})</span>
        : <span className="font-medium text-rose-600">chưa đóng{treDau > 0 ? ` · đang trễ ${nhanPhut(treDau)}` : ''}</span>}
      {td.so_mo_lai > 0 && <>·<span className="font-medium text-indigo-600">mở lại {td.so_mo_lai} lần</span>·<span>{td.dong_cuoi ? `đóng cuối ${ddmmhh(td.dong_cuoi)}` : 'hiện đang mở'}</span></>}
    </span>
  )
}

const LS_DOT: Record<GayLichSuLoai, string> = {
  han: 'bg-amber-400', dong: 'bg-emerald-500', mo_lai: 'bg-indigo-500', doi_moc: 'bg-slate-400',
  nhap: 'bg-slate-300', hs_nop: 'bg-rose-400', viec: 'bg-slate-400',
}
const LS_TEXT: Record<GayLichSuLoai, string> = {
  han: 'font-semibold text-amber-700', dong: 'font-medium text-emerald-700', mo_lai: 'font-medium text-indigo-700',
  doi_moc: 'text-slate-600', nhap: 'text-slate-600', hs_nop: 'font-medium text-rose-700', viec: 'text-slate-600',
}
export function LichSuTask({ refKey }: { refKey: string }) {
  const [evs, setEvs] = useState<GayLichSuEvent[] | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    let alive = true
    setEvs(null); setErr('')
    lichSuGay(refKey).then((r) => { if (alive) setEvs(r) }).catch((e: any) => { if (alive) setErr(String(e.message ?? e)) })
    return () => { alive = false }
  }, [refKey])
  if (err) return <p className="text-xs text-red-600">{err}</p>
  if (!evs) return <p className="text-xs text-slate-400">Đang tải lịch sử…</p>
  if (!evs.length) return <p className="text-xs text-slate-400">Chưa có vết nào cho task này (log đóng/mở lại chỉ ghi từ 23/09/2026; việc OPS gộp theo ca chưa có timeline).</p>
  return (
    <ol className="ml-1.5 space-y-1 border-l-2 border-slate-200 pl-3" onClick={(ev) => ev.stopPropagation()}>
      {evs.map((e, i) => (
        <li key={i} className="relative text-xs leading-5">
          <span className={`absolute -left-[17px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${LS_DOT[e.loai] ?? 'bg-slate-300'}`} />
          <span className="font-mono text-slate-500">{ddmmhh(e.at)}</span>{' '}
          <span className={LS_TEXT[e.loai] ?? 'text-slate-600'}>{e.mo_ta}</span>
          {e.actor && <span className="text-slate-400"> · {e.actor}</span>}
        </li>
      ))}
    </ol>
  )
}
