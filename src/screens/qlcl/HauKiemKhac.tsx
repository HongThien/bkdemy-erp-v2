// HẬU KIỂM ngoài gậy — Thùy 29/10, spec-truong-khoi.md §3. Chỉ toàn hệ (Lead / Quản lý chất lượng) thấy.
//   viec_van_hanh — trưởng khối duyệt việc vận hành TA có phán đoán (chất lượng < 100 / sửa tiến độ máy đề xuất) ⇒ Sửa = nhập lại số
//   ca_nhe        — ca Bổ trợ Nhẹ trưởng khối tạo ⇒ Sửa = huỷ ca
// Hàng + quyền ở DB (fn_hau_kiem_khac). Xử lý xong ⇒ vá đúng dòng tại chỗ.
import { useEffect, useState } from 'react'
import { hauKiemKhac, suaDuyetVanHanh, type HauKiemKhac as HK } from '../../lib/qlcl'
import { ghiHauKiem } from '../../lib/gay'
import { huyCaNhe } from '../../lib/botro_nhe'

const gio = (s: string) => new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export default function HauKiemKhac() {
  const [rows, setRows] = useState<HK[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => { hauKiemKhac(7).then(setRows).catch((e) => { setRows([]); setLoi(e?.message ?? String(e)) }) }, [])

  const va = (x: HK, ket_qua: 'dong_y' | 'da_sua', ghi_chu: string | null, them?: Partial<HK>) =>
    setRows((p) => p && p.map((r) => r.loai === x.loai && r.ref_id === x.ref_id ? { ...r, ...them, hk: { ket_qua, ghi_chu, at: new Date().toISOString(), nguoi: 'bạn' } } : r))
  async function chay(x: HK, f: () => Promise<void>) {
    setBusy(x.ref_id); setLoi(null)
    try { await f() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  const dongY = (x: HK) => chay(x, async () => { await ghiHauKiem(x.loai, x.ref_id, 'dong_y', null); va(x, 'dong_y', null) })
  const sua = (x: HK) => {
    if (x.loai === 'ca_nhe') {
      const lyDo = window.prompt(`Huỷ ca Nhẹ ${x.mo_ta}? Lý do:`, '')
      if (lyDo === null) return
      chay(x, async () => { await huyCaNhe(x.ref_id, `Hậu kiểm: ${lyDo.trim() || 'huỷ'}`); await ghiHauKiem('ca_nhe', x.ref_id, 'da_sua', `Huỷ ca${lyDo.trim() ? ` — ${lyDo.trim()}` : ''}`); va(x, 'da_sua', 'Huỷ ca', { trang_thai: 'huy' }) })
      return
    }
    const cl = window.prompt(`Chất lượng (%) cho ${x.nhan_su} — ${x.mo_ta}:`, String(x.chat_luong ?? 100))
    if (cl === null) return
    const td = window.prompt('Tiến độ (%):', String(x.tien_do ?? 100))
    if (td === null) return
    const gc = window.prompt('Ghi chú (tuỳ chọn):', '') ?? ''
    chay(x, async () => {
      await suaDuyetVanHanh(x.ref_id, Number(cl), Number(td), gc.trim() || null)
      va(x, 'da_sua', `Chất lượng ${x.chat_luong}→${cl} · tiến độ ${x.tien_do}→${td}`, { chat_luong: Number(cl), tien_do: Number(td) })
    })
  }

  if (rows === null) return <p className="text-sm text-slate-400">Đang tải…</p>
  const cho = rows.filter((r) => !r.hk), xong = rows.filter((r) => r.hk)
  return (
    <div className="max-w-4xl">
      {loi && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Việc vận hành · ca Bổ trợ Nhẹ — chờ hậu kiểm · {cho.length}</p>
      {cho.length === 0 ? <p className="mb-6 text-[13px] text-slate-400">Không có gì chờ xem. (Duyệt việc vận hành chỉ vào đây khi trưởng khối cho chất lượng &lt; 100% hoặc sửa tiến độ máy đề xuất.)</p> : (
        <div className="mb-6 flex flex-col gap-2">{cho.map((x) => <Dong key={x.loai + x.ref_id} x={x} busy={busy === x.ref_id} onDongY={() => dongY(x)} onSua={() => sua(x)} />)}</div>
      )}
      {xong.length > 0 && <>
        <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Đã hậu kiểm · 7 ngày · {xong.length}</p>
        <div className="flex flex-col gap-2 opacity-80">{xong.map((x) => <Dong key={x.loai + x.ref_id} x={x} busy={false} />)}</div>
      </>}
    </div>
  )
}

function Dong({ x, busy, onDongY, onSua }: { x: HK; busy: boolean; onDongY?: () => void; onSua?: () => void }) {
  const ca = x.loai === 'ca_nhe'
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <b className="text-slate-800">{x.nguoi_quyet}</b>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${ca ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-800'}`}>{ca ? 'tạo ca Nhẹ' : 'duyệt việc vận hành'}</span>
        {x.nhan_su && <span className="text-slate-600">→ <b>{x.nhan_su}</b></span>}
        <span className="ml-auto text-[11.5px] text-slate-400">{gio(x.at)}</span>
      </div>
      <p className="mt-1 text-[12.5px] text-slate-600">
        {x.mo_ta}
        {ca ? <> · {x.hoc_sinh ?? '—'}{x.ta ? ` · TA ${x.ta}` : ''}{x.trang_thai === 'huy' && <span className="ml-1 text-rose-600">(đã huỷ)</span>}</>
          : <> · chất lượng <b>{x.chat_luong}%</b> · tiến độ <b>{x.tien_do}%</b>{x.tien_do !== x.tien_do_de_xuat ? ` (máy đề xuất ${x.tien_do_de_xuat}%)` : ''}{x.ghi_chu ? ` · “${x.ghi_chu}”` : ''}</>}
      </p>
      {x.hk ? (
        <p className={`mt-1 text-[12px] font-semibold ${x.hk.ket_qua === 'dong_y' ? 'text-emerald-700' : 'text-indigo-700'}`}>{x.hk.ket_qua === 'dong_y' ? '✓ Đồng ý' : '✎ Đã sửa'}{x.hk.ghi_chu ? ` — ${x.hk.ghi_chu}` : ''} · {x.hk.nguoi}</p>
      ) : onDongY && (
        <div className="mt-2 flex gap-2">
          <button disabled={busy} onClick={onDongY} className="rounded-lg bg-emerald-600 px-3 py-1 text-[12.5px] font-semibold text-white disabled:opacity-50">✓ Đồng ý</button>
          <button disabled={busy || x.trang_thai === 'huy'} onClick={onSua} className="rounded-lg border border-slate-200 px-3 py-1 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{ca ? '✕ Huỷ ca' : '✎ Sửa số'}</button>
        </div>
      )}
    </div>
  )
}
