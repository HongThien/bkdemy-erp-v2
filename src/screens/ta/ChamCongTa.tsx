// Box CHẤM CÔNG (chỉ lead thấy — laQuanLy): chọn TA dưới quyền → danh sách buổi thường tháng này
// của các lớp TA đó → bật/tắt "vắng" (đã xin phép). Mặc định có mặt, không cần điền gì (CEO 07/09).
import { useEffect, useState } from 'react'
import type { MyScope } from '../../lib/nhansu'
import { listBuoiChamCong, ghiVang, boVang, type BuoiChamCong } from '../../lib/chamcong'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

export default function ChamCongTa({ ym, scope }: { ym: string; scope: MyScope }) {
  const nguoi = [...scope.giamSatTrucTiep, ...scope.giamSatSau]
  const [nsId, setNsId] = useState(nguoi[0]?.nhan_su_id ?? '')
  const [rows, setRows] = useState<BuoiChamCong[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const load = () => { if (!nsId) return; setRows(null); listBuoiChamCong(nsId, ym).then(setRows).catch((e) => setErr(e?.message ?? String(e))) }
  useEffect(load, [nsId, ym]) // eslint-disable-line

  async function toggle(b: BuoiChamCong) {
    setBusy(b.buoi_id); setErr(null)
    try { if (b.vang) await boVang(nsId, b.buoi_id); else await ghiVang(nsId, b.buoi_id); load() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  if (!nguoi.length) return <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[12.5px] text-slate-400">Bạn không quản lý ai trong cây tổ chức.</p>
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] text-slate-500">Mặc định TA <b>có mặt</b> — chỉ bấm khi TA đã xin phép vắng. Buổi vắng bị trừ khỏi Tiến trình.</p>
      <select value={nsId} onChange={(e) => setNsId(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px]">
        {nguoi.map((n) => <option key={n.nhan_su_id} value={n.nhan_su_id}>{n.ho_ten}</option>)}
      </select>
      {err && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{err}</p>}
      {rows === null ? <p className="text-[13px] text-slate-400">Đang tải…</p>
        : !rows.length ? <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[12.5px] text-slate-400">Tháng này TA chưa có buổi nào đã diễn ra.</p>
        : (
          <div className="flex flex-col gap-2">
            {rows.map((b) => (
              <div key={b.buoi_id} className={`flex items-center gap-2 rounded-2xl border bg-white p-3 shadow-sm ${b.vang ? 'border-rose-200' : 'border-slate-200/70'}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-slate-800">{b.ten_lop} <span className="text-[11.5px] font-medium text-slate-400">· {thuCuaNgay(b.ngay)} {ddmmVN(b.ngay)}{b.gio_bat_dau ? ` · ${b.gio_bat_dau.slice(0, 5)}` : ''}</span></p>
                  {b.vang && <p className="text-[11.5px] font-medium text-rose-600">Vắng (đã xin phép)</p>}
                </div>
                <button disabled={busy === b.buoi_id} onClick={() => toggle(b)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${b.vang ? 'border border-slate-300 text-slate-600' : 'bg-rose-600 text-white'} disabled:opacity-40`}>
                  {b.vang ? 'Bỏ vắng' : 'Ghi vắng'}
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
