// Sửa thông tin buổi bổ trợ (bù/đuổi): ngày/giờ/phòng/GV/TA. Dùng chung cho BuoiBuDetail + BuoiDuoiDetail.
import { useEffect, useMemo, useState } from 'react'
import { updateBuoiMeta } from '../../lib/gami'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listPhong, type Phong } from '../../lib/phong'
import SearchSelect from '../../components/SearchSelect'

const inp = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'

// ⭐ NHÃN PHẢI NÓI ĐÚNG AI NHẬN VIỆC (CEO 14/08: "người nào được xếp bổ trợ thì người đó đánh giá").
// Engine việc (`getMyTasks`, gami.ts) route CẢ chấm ET LẪN đánh giá về `nguoi_day_tg` — người dạy buổi
// bổ trợ — chỉ rơi về `nguoi_day` (GV) khi ô kia bỏ trống. Nhãn cũ ghi "GV (đánh giá)" / "TA (chấm ET)"
// là mô tả SAI luồng thật: người điền tưởng GV sẽ đánh giá, trong khi việc đã sang TA.
export default function SuaBuoiModal({ buoi, taLabel = 'Người dạy bổ trợ', onClose, onSaved }: {
  buoi: { id: string; ngay: string | null; gio_bat_dau: string | null; phong: string | null; nguoi_day: string | null; nguoi_day_tg: string | null }
  taLabel?: string; onClose: () => void; onSaved: () => void
}) {
  const [ngay, setNgay] = useState(buoi.ngay ?? '')
  const [gio, setGio] = useState((buoi.gio_bat_dau ?? '').slice(0, 5))
  const [phong, setPhong] = useState(buoi.phong ?? '')
  const [gv, setGv] = useState<string | null>(buoi.nguoi_day ?? null)
  const [ta, setTa] = useState<string | null>(buoi.nguoi_day_tg ?? null)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => { listNhanSu().then(setNss).catch(() => {}) }, [])
  useEffect(() => { listPhong(true).then(setPhongs).catch(() => {}) }, [])
  const opts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  const phongOpts = useMemo(() => phongs.map((p) => ({ id: p.ma_phong, label: p.ten_phong })), [phongs])
  async function save() {
    if (!ngay) { alert('Chọn ngày'); return }
    setBusy(true)
    try { await updateBuoiMeta(buoi.id, { ngay, gio_bat_dau: gio || null, phong: phong.trim() || null, nguoi_day: gv, nguoi_day_tg: ta }); onSaved() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[17px] font-semibold text-slate-800">Sửa buổi</div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Ngày *</label><input type="date" className={inp} value={ngay} onChange={(e) => setNgay(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Giờ</label><input type="time" className={inp} value={gio} onChange={(e) => setGio(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Phòng</label><SearchSelect value={phong || null} onChange={(v) => setPhong(v ?? '')} options={phongOpts} placeholder="Chọn phòng…" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">{taLabel} *</label><SearchSelect value={ta} onChange={setTa} options={opts} placeholder={`Chọn ${taLabel.toLowerCase()}…`} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">GV</label><SearchSelect value={gv} onChange={setGv} options={opts} placeholder="Chọn GV…" /></div>
          </div>
          <p className="text-[12px] text-slate-400">Chấm ET + đánh giá về <b>{taLabel.toLowerCase()}</b>; bỏ trống ô đó thì việc rơi sang GV.</p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}
