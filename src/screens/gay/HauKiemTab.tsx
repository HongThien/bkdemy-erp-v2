// HẬU KIỂM GẬY — Thùy 29/10, spec-truong-khoi.md §3 (P2 hai tầng). Chỉ toàn hệ (Lead / Quản lý chất lượng) thấy tab này.
// Trưởng khối đánh / gỡ / bỏ qua đề xuất ⇒ có hiệu lực ngay; ở đây Trang xem lại: ✓ Đồng ý, hoặc Sửa (thu hồi gậy / mở lại đề xuất).
// Hàng + quyền ở DB (fn_hau_kiem_gay). Xử lý xong ⇒ vá đúng dòng tại chỗ, không tải lại cả danh sách (CLAUDE.md §2 React).
import { useEffect, useState } from 'react'
import { hauKiemGay, ghiHauKiem, moLaiDeXuat, thuHoiGay, type HauKiemGay } from '../../lib/gay'

const gio = (s: string) => new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export default function HauKiemTab({ onBao }: { onBao: (ok: boolean, msg: string) => void }) {
  const [rows, setRows] = useState<HauKiemGay[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => { hauKiemGay(7).then(setRows).catch((e) => { setRows([]); onBao(false, e?.message ?? String(e)) }) }, []) // eslint-disable-line

  const vaHk = (x: HauKiemGay, ketQua: 'dong_y' | 'da_sua', ghiChu: string | null, thuHoi = false) =>
    setRows((p) => p && p.map((r) => r.loai === x.loai && r.ref_id === x.ref_id
      ? { ...r, thu_hoi_at: thuHoi ? new Date().toISOString() : r.thu_hoi_at, hk: { ket_qua: ketQua, ghi_chu: ghiChu, at: new Date().toISOString(), nguoi: 'bạn' } } : r))

  async function chay(x: HauKiemGay, f: () => Promise<void>) {
    setBusy(x.ref_id)
    try { await f() } catch (e: any) { onBao(false, e?.message ?? String(e)) } finally { setBusy(null) }
  }
  const dongY = (x: HauKiemGay) => chay(x, async () => { await ghiHauKiem(x.loai, x.ref_id, 'dong_y', null); vaHk(x, 'dong_y', null) })
  const suaGay = (x: HauKiemGay) => {
    const lyDo = window.prompt(`Thu hồi ${Math.abs(x.so_gay)} gậy ${x.hanh_dong} của ${x.nhan_su}? Lý do (bắt buộc):`, '')
    if (!lyDo?.trim()) return
    chay(x, async () => { await thuHoiGay(x.ref_id, `Hậu kiểm: ${lyDo.trim()}`); await ghiHauKiem(x.loai, x.ref_id, 'da_sua', `Thu hồi — ${lyDo.trim()}`); vaHk(x, 'da_sua', `Thu hồi — ${lyDo.trim()}`, true) })
  }
  const moLai = (x: HauKiemGay) => {
    const gc = window.prompt(`Mở lại đề xuất gậy của ${x.nhan_su} (về tab Đề xuất để quyết lại)? Ghi chú:`, '')
    if (gc === null) return
    chay(x, async () => { await moLaiDeXuat(x.ref_id, gc.trim() || null); vaHk(x, 'da_sua', `Mở lại đề xuất${gc.trim() ? ` — ${gc.trim()}` : ''}`) })
  }

  if (rows === null) return <p className="text-sm text-slate-400">Đang tải…</p>
  const cho = rows.filter((r) => !r.hk)
  const xong = rows.filter((r) => r.hk)
  return (
    <div className="max-w-4xl">
      <p className="mb-3 text-[12.5px] text-slate-500">Quyết định gậy của <b>trưởng khối</b> (từ 29/10) — có hiệu lực ngay, bạn xem lại. Đồng ý, hoặc sửa: gậy đánh/gỡ sai ⇒ <b>Thu hồi</b>; bỏ qua sai ⇒ <b>Mở lại đề xuất</b>.</p>
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Chờ hậu kiểm · {cho.length}</p>
      {cho.length === 0 ? <p className="mb-6 text-[13px] text-slate-400">Không có quyết định nào chờ xem.</p> : (
        <div className="mb-6 flex flex-col gap-2">{cho.map((x) => <Dong key={x.loai + x.ref_id} x={x} busy={busy === x.ref_id} onDongY={() => dongY(x)} onSua={() => (x.loai === 'gay_ledger' ? suaGay(x) : moLai(x))} />)}</div>
      )}
      {xong.length > 0 && <>
        <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Đã hậu kiểm · 7 ngày · {xong.length}</p>
        <div className="flex flex-col gap-2 opacity-80">{xong.map((x) => <Dong key={x.loai + x.ref_id} x={x} busy={false} />)}</div>
      </>}
    </div>
  )
}

function Dong({ x, busy, onDongY, onSua }: { x: HauKiemGay; busy: boolean; onDongY?: () => void; onSua?: () => void }) {
  const boQua = x.loai === 'gay_bo_qua'
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        <b className="text-slate-800">{x.nguoi_quyet}</b>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${boQua ? 'bg-amber-50 text-amber-800' : x.so_gay < 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {x.hanh_dong}{boQua ? '' : ` ${Math.abs(x.so_gay)} gậy`}
        </span>
        <span className="text-slate-600">→ <b>{x.nhan_su}</b></span>
        <span className="ml-auto text-[11.5px] text-slate-400">{gio(x.at)}</span>
      </div>
      <p className="mt-1 text-[12.5px] text-slate-600">
        {x.viec && <span>Việc: {x.viec}{x.tre_phut ? ` · trễ ${x.tre_phut}′` : ''} · </span>}
        {x.loi && <span>Lỗi: {x.loi} · </span>}
        {x.ly_do && <span>{boQua ? 'Lý do bỏ qua' : 'Lý do'}: “{x.ly_do}”</span>}
        {x.thu_hoi_at && <span className="ml-1 text-rose-600">(đã thu hồi)</span>}
      </p>
      {x.hk ? (
        <p className={`mt-1 text-[12px] font-semibold ${x.hk.ket_qua === 'dong_y' ? 'text-emerald-700' : 'text-indigo-700'}`}>
          {x.hk.ket_qua === 'dong_y' ? '✓ Đồng ý' : '✎ Đã sửa'}{x.hk.ghi_chu ? ` — ${x.hk.ghi_chu}` : ''} · {x.hk.nguoi}
        </p>
      ) : onDongY && (
        <div className="mt-2 flex gap-2">
          <button disabled={busy} onClick={onDongY} className="rounded-lg bg-emerald-600 px-3 py-1 text-[12.5px] font-semibold text-white disabled:opacity-50">✓ Đồng ý</button>
          <button disabled={busy || !!x.thu_hoi_at} onClick={onSua} className="rounded-lg border border-slate-200 px-3 py-1 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{boQua ? '↺ Mở lại đề xuất' : '↩ Thu hồi gậy'}</button>
        </div>
      )}
    </div>
  )
}
