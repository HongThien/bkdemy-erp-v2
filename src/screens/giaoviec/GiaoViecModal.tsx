// Modal GIAO VIỆC (tạo task 1 người) — dùng chung: giao từ backlog (y_tuong_id),
// giao lát cắt hạng mục (hang_muc_id), hoặc phát sinh. §4/§5/§6.
import { useEffect, useMemo, useState } from 'react'
import {
  listLoaiViec, listNguoiDuocGiao, createViec,
  type LoaiViec, type MucKhoiLuong, type NguoiDuocGiao,
} from '../../lib/giaoviec'
import { todayVN } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Modal, Field, Pill } from './ui'

export type GiaoPrefill = {
  y_tuong_id?: string; task_me_id?: string; tieu_de?: string; nguon?: 'ke_hoach' | 'phat_sinh'; title?: string
}

export default function GiaoViecModal({ prefill, onClose, onDone }: { prefill?: GiaoPrefill; onClose: () => void; onDone: () => void }) {
  const [loaiViecs, setLoaiViecs] = useState<LoaiViec[]>([])
  const [nguoi, setNguoi] = useState<NguoiDuocGiao[]>([])
  const [loaiViecId, setLoaiViecId] = useState('')
  const [tieuDe, setTieuDe] = useState(prefill?.tieu_de ?? '')
  const [mucTieu, setMucTieu] = useState(''); const [output, setOutput] = useState('')
  const [nguoiLamId, setNguoiLamId] = useState('')
  const [mucKl, setMucKl] = useState<MucKhoiLuong | null>(null)
  const [klTay, setKlTay] = useState<number | ''>('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)

  useEffect(() => { listLoaiViec().then(setLoaiViecs).catch(() => {}); listNguoiDuocGiao().then(setNguoi).catch(() => {}) }, [])
  const loaiViec = useMemo(() => loaiViecs.find((l) => l.id === loaiViecId), [loaiViecs, loaiViecId])
  const khoiLuong = mucKl?.kl ?? (klTay === '' ? null : Number(klTay))

  async function submit() {
    if (!tieuDe.trim() || !nguoiLamId || khoiLuong === null) { setErr('Cần đủ: tiêu đề, người làm, khối lượng.'); return }
    setSaving(true); setErr(null)
    try {
      await createViec({
        tieu_de: tieuDe.trim(), nguoi_lam_id: nguoiLamId, khoi_luong: khoiLuong,
        loai_viec_id: loaiViecId || null, muc_tieu: mucTieu.trim() || undefined, output: output.trim() || undefined,
        deadline: deadline || null, nguon: prefill?.nguon ?? 'ke_hoach',
        y_tuong_id: prefill?.y_tuong_id, task_me_id: prefill?.task_me_id,
      })
      onDone()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  return (
    <Modal title={prefill?.title ?? 'Giao việc mới'} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Loại việc (để lấy thang khối lượng — tuỳ chọn)">
          <select value={loaiViecId} onChange={(e) => { setLoaiViecId(e.target.value); setMucKl(null) }} className={CX_INPUT}>
            <option value="">— không gắn loại —</option>
            {loaiViecs.map((l) => <option key={l.id} value={l.id}>{l.ten}</option>)}
          </select>
        </Field>
        <Field label="Tiêu đề"><input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} className={CX_INPUT} placeholder="VD: Soạn phần A bộ đề khối 9" /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Mục tiêu"><input value={mucTieu} onChange={(e) => setMucTieu(e.target.value)} className={CX_INPUT} /></Field>
          <Field label="Output (để nghiệm thu)"><input value={output} onChange={(e) => setOutput(e.target.value)} className={CX_INPUT} placeholder="VD: file PDF 20 câu" /></Field>
        </div>
        <Field label="Giao cho (1 người)">
          <div className="flex flex-wrap gap-1.5">
            {nguoi.map((n) => <Pill key={n.nhan_su_id} on={nguoiLamId === n.nhan_su_id} onClick={() => setNguoiLamId(n.nhan_su_id)}>{n.ho_ten}</Pill>)}
            {!nguoi.length && <span className="text-[12px] text-slate-400">Bạn chưa quản lý ai trong cây tổ chức (chỉ tự giao cho mình).</span>}
          </div>
        </Field>
        <Field label="Khối lượng">
          {!!loaiViec?.thang_kl.length && (
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {loaiViec.thang_kl.map((m) => <Pill key={m.ma} on={mucKl?.ma === m.ma} onClick={() => { setMucKl(m); setKlTay('') }}>{m.ten} ({m.kl})</Pill>)}
            </div>
          )}
          <input type="number" value={klTay} onChange={(e) => { setKlTay(e.target.value === '' ? '' : Number(e.target.value)); setMucKl(null) }} className={CX_INPUT} placeholder="hoặc nhập số khối lượng" />
        </Field>
        <Field label="Deadline (khuyến nghị — máy đo tiến độ theo hạn này)">
          <input type="date" min={todayVN()} value={deadline} onChange={(e) => setDeadline(e.target.value)} className={CX_INPUT} />
        </Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2 pt-1"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? 'Đang lưu…' : 'Giao việc'}</button></div>
      </div>
    </Modal>
  )
}
