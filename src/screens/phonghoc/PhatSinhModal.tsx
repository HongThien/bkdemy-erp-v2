// Thêm/sửa 1 "hoạt động phát sinh" (họp nội bộ / học tập ngoài lịch / việc khác). Lưu → kiểm tra
// trùng phòng+giờ với TKB/bổ trợ/phát sinh khác trong ngày; có trùng → CẢNH BÁO MỀM (CEO chốt), vẫn
// cho lưu nếu người dùng xác nhận.
import { useEffect, useState } from 'react'
import { Shell, Field, inp, Actions } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import {
  listPhong, getHoatDongPhong, createHoatDongPhong, updateHoatDongPhong, huyHoatDongPhong, kiemTraTrungPhong,
  LOAI_HOAT_DONG_NHAN, type Phong, type LoaiHoatDong, type KhoiBanPhong,
} from '../../lib/phong'
import { getMyProfile } from '../../lib/nhansu'

const MON_OPTS = ['Toán', 'Văn', 'Anh', 'KHTN']
const LOAI_OPTS = Object.keys(LOAI_HOAT_DONG_NHAN) as LoaiHoatDong[]

export default function PhatSinhModal({ phongId, ngay, edit, onClose, onSaved }: {
  phongId?: string; ngay: string; edit?: KhoiBanPhong; onClose: () => void; onSaved: () => void
}) {
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [id, setId] = useState<string | null>(null) // id của hoat_dong_phong đang sửa (null = tạo mới)
  const [pId, setPId] = useState<string | null>(phongId ?? null)
  const [d, setD] = useState(ngay)
  const [gd, setGd] = useState('08:00')
  const [gk, setGk] = useState('09:00')
  const [loai, setLoai] = useState<LoaiHoatDong>('hop_noi_bo')
  const [tieuDe, setTieuDe] = useState('')
  const [mon, setMon] = useState<string | null>(null)
  const [ghiChu, setGhiChu] = useState('')
  const [loading, setLoading] = useState(!!edit)
  const [busy, setBusy] = useState(false)
  const [trung, setTrung] = useState<KhoiBanPhong[] | null>(null)

  useEffect(() => { listPhong(true).then(setPhongs).catch(() => {}) }, [])
  useEffect(() => {
    if (!edit) return
    getHoatDongPhong(edit.ref_id).then((h) => {
      setId(h.id); setPId(h.phong_id); setD(h.ngay); setGd(h.gio_bat_dau.slice(0, 5)); setGk(h.gio_ket_thuc.slice(0, 5))
      setLoai(h.loai); setTieuDe(h.tieu_de); setMon(h.mon); setGhiChu(h.ghi_chu ?? '')
    }).finally(() => setLoading(false))
  }, [edit])

  const phongOpts = phongs.map((p) => ({ id: p.id, label: p.ten_phong, sub: p.suc_chua != null ? `${p.suc_chua} chỗ` : undefined }))
  const maCuaPId = phongs.find((p) => p.id === pId)?.ma_phong ?? null

  async function luuThat() {
    setBusy(true)
    try {
      if (id) await updateHoatDongPhong(id, { phong_id: pId!, ngay: d, gio_bat_dau: gd, gio_ket_thuc: gk, loai, tieu_de: tieuDe.trim(), mon: loai === 'hoc_tap_ngoai_lich' ? mon : null, ghi_chu: ghiChu.trim() || null })
      else {
        const prof = await getMyProfile().catch(() => null)
        await createHoatDongPhong({ phong_id: pId!, ngay: d, gio_bat_dau: gd, gio_ket_thuc: gk, loai, tieu_de: tieuDe.trim(), mon: loai === 'hoc_tap_ngoai_lich' ? mon : null, ghi_chu: ghiChu.trim() || null, nguoi_tao_id: prof?.nhanSu?.id ?? null })
      }
      onSaved()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  async function save() {
    if (!pId) { alert('Chọn phòng'); return }
    if (!d || !gd || !gk) { alert('Điền đủ ngày/giờ'); return }
    if (gk <= gd) { alert('Giờ kết thúc phải sau giờ bắt đầu'); return }
    if (!tieuDe.trim()) { alert('Nhập tiêu đề'); return }
    if (loai === 'hoc_tap_ngoai_lich' && !mon) { alert('Chọn môn'); return }
    setBusy(true)
    try {
      const cham = await kiemTraTrungPhong(maCuaPId!, d, gd, gk, id ?? undefined)
      if (cham.length > 0) { setTrung(cham); setBusy(false); return }
      await luuThat()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  async function huy() {
    if (!id) return
    if (!confirm('Huỷ hoạt động này? (vẫn giữ trong lịch sử, chỉ ẩn khỏi lịch phòng)')) return
    setBusy(true)
    try { await huyHoatDongPhong(id); onSaved() } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <Shell title={id ? 'Sửa hoạt động phát sinh' : 'Thêm hoạt động phát sinh'} onClose={onClose}>
      {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : (
        <>
          <Field label="Phòng"><SearchSelect value={pId} onChange={setPId} options={phongOpts} placeholder="Chọn phòng…" allowClear={false} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Ngày"><input type="date" className={inp} value={d} onChange={(e) => setD(e.target.value)} /></Field>
            <Field label="Giờ bắt đầu"><input type="time" className={inp} value={gd} onChange={(e) => setGd(e.target.value)} /></Field>
            <Field label="Giờ kết thúc"><input type="time" className={inp} value={gk} onChange={(e) => setGk(e.target.value)} /></Field>
          </div>
          <Field label="Loại hoạt động">
            <div className="flex flex-wrap gap-1.5">
              {LOAI_OPTS.map((l) => (
                <button key={l} type="button" onClick={() => setLoai(l)}
                  className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${loai === l ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                  {LOAI_HOAT_DONG_NHAN[l]}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Tiêu đề"><input className={inp} value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} placeholder="VD: Họp GV Toán tuần 3, Ôn tập ngoài lịch 8A1…" /></Field>
          {loai === 'hoc_tap_ngoai_lich' && (
            <Field label="Môn">
              <div className="flex gap-1.5">
                {MON_OPTS.map((m) => (
                  <button key={m} type="button" onClick={() => setMon(m)}
                    className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${mon === m ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>
          )}
          <Field label="Ghi chú"><textarea className={inp} rows={2} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} /></Field>

          {trung && (
            <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="mb-1.5 text-[13px] font-semibold text-rose-700">⚠ Phòng này đã có người dùng cùng khung giờ:</p>
              <ul className="mb-2 space-y-1">
                {trung.map((k) => <li key={k.ref_id} className="text-[12px] text-rose-700">• {k.gio_bat_dau.slice(0, 5)}–{k.gio_ket_thuc.slice(0, 5)} · {k.tieu_de}{k.phu_trach ? ` · ${k.phu_trach}` : ''}</li>)}
              </ul>
              <div className="flex justify-end gap-2">
                <button onClick={() => setTrung(null)} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Chọn lại giờ khác</button>
                <button onClick={() => { setTrung(null); luuThat() }} disabled={busy} className="rounded-md bg-rose-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-rose-500 disabled:opacity-50">Vẫn lưu</button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {id ? <button onClick={huy} disabled={busy} className="rounded-md px-3 py-1.5 text-[13px] text-rose-500 hover:bg-rose-50">Huỷ hoạt động</button> : <span />}
            <Actions onClose={onClose} onSave={save} disabled={busy} saving={busy} label={id ? 'Lưu' : 'Tạo'} />
          </div>
        </>
      )}
    </Shell>
  )
}
