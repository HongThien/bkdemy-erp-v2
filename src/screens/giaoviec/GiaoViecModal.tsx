// Modal GIAO VIỆC (tạo task 1 người) — dùng chung: giao từ backlog (y_tuong_id),
// tách task con dưới 1 task mẹ (task_me_id), hoặc phát sinh. §4/§5/§6.
// Khi tách con dưới mẹ có info (prefill.me) → 2 KIỂU CHIA (Thùy chốt 08-13):
//   THEO BƯỚC: mỗi con là 1 việc khác nhau — mục tiêu/output tự gõ riêng.
//   THEO SCOPE: mọi con CÙNG mục tiêu/output (kế thừa mẹ, khoá), chỉ khác PHẠM VI
//   (vd "Trang chấm 7A", "Cường chấm 8B") — tiêu đề tự ghép mẹ + phạm vi.
import { useEffect, useMemo, useState } from 'react'
import {
  listLoaiViec, listNguoiDuocGiao, createViec,
  type LoaiViec, type MucKhoiLuong, type NguoiDuocGiao,
} from '../../lib/giaoviec'
import { todayVN } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Modal, Field, Pill, NguoiPicker } from './ui'

export type GiaoPrefill = {
  y_tuong_id?: string; task_me_id?: string; tieu_de?: string; nguon?: 'ke_hoach' | 'phat_sinh'; title?: string
  me?: { tieu_de: string; muc_tieu: string | null; output: string | null; loai_viec_id: string | null; ky_tuan: string | null }
}

export default function GiaoViecModal({ prefill, onClose, onDone }: { prefill?: GiaoPrefill; onClose: () => void; onDone: () => void }) {
  const [loaiViecs, setLoaiViecs] = useState<LoaiViec[]>([])
  const [nguoi, setNguoi] = useState<NguoiDuocGiao[]>([])
  const coMe = !!prefill?.me
  const [kieuChia, setKieuChia] = useState<'buoc' | 'scope'>('buoc')
  const laScope = coMe && kieuChia === 'scope'
  const [loaiViecId, setLoaiViecId] = useState(prefill?.me?.loai_viec_id ?? '')
  const [tieuDe, setTieuDe] = useState(prefill?.tieu_de ?? '')
  const [phamVi, setPhamVi] = useState('')
  const [mucTieu, setMucTieu] = useState(''); const [output, setOutput] = useState('')
  const [nguoiLamId, setNguoiLamId] = useState('')
  const [mucKl, setMucKl] = useState<MucKhoiLuong | null>(null)
  const [klTay, setKlTay] = useState<number | ''>('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)

  useEffect(() => { listLoaiViec().then(setLoaiViecs).catch(() => {}); listNguoiDuocGiao().then(setNguoi).catch(() => {}) }, [])
  const loaiViec = useMemo(() => loaiViecs.find((l) => l.id === loaiViecId), [loaiViecs, loaiViecId])
  const khoiLuong = mucKl?.kl ?? (klTay === '' ? null : Number(klTay))
  const tieuDeCuoi = laScope ? `${prefill!.me!.tieu_de}${phamVi.trim() ? ` — ${phamVi.trim()}` : ''}` : tieuDe
  const mucTieuCuoi = laScope ? (prefill!.me!.muc_tieu ?? '') : mucTieu
  const outputCuoi = laScope ? (prefill!.me!.output ?? '') : output

  async function submit() {
    if (!tieuDeCuoi.trim() || !nguoiLamId || khoiLuong === null) { setErr('Cần đủ: tiêu đề, người làm, khối lượng.'); return }
    if (laScope && !phamVi.trim()) { setErr('Chia theo scope thì cần điền phạm vi (vd "Lớp 7A").'); return }
    setSaving(true); setErr(null)
    try {
      await createViec({
        tieu_de: tieuDeCuoi.trim(), nguoi_lam_id: nguoiLamId, khoi_luong: khoiLuong,
        loai_viec_id: loaiViecId || null, muc_tieu: mucTieuCuoi.trim() || undefined, output: outputCuoi.trim() || undefined,
        deadline: deadline || null, nguon: prefill?.nguon ?? 'ke_hoach',
        y_tuong_id: prefill?.y_tuong_id, task_me_id: prefill?.task_me_id,
        ky_tuan: prefill?.me?.ky_tuan ?? undefined,
      })
      onDone()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  return (
    <Modal title={prefill?.title ?? 'Giao việc mới'} onClose={onClose} wide>
      <div className="space-y-3">
        {coMe && (
          <Field label="Kiểu chia">
            <div className="flex gap-1.5">
              <Pill on={kieuChia === 'buoc'} onClick={() => setKieuChia('buoc')}>Theo bước (mỗi con khác việc)</Pill>
              <Pill on={kieuChia === 'scope'} onClick={() => setKieuChia('scope')}>Theo scope (cùng việc, khác phạm vi)</Pill>
            </div>
          </Field>
        )}
        <Field label="Loại việc (để lấy thang khối lượng — tuỳ chọn)">
          <select value={loaiViecId} onChange={(e) => { setLoaiViecId(e.target.value); setMucKl(null) }} className={CX_INPUT}>
            <option value="">— không gắn loại —</option>
            {loaiViecs.map((l) => <option key={l.id} value={l.id}>{l.ten}</option>)}
          </select>
        </Field>
        {laScope ? (
          <Field label={`Phạm vi (nối vào tiêu đề "${prefill!.me!.tieu_de} — …")`}>
            <input autoFocus value={phamVi} onChange={(e) => setPhamVi(e.target.value)} className={CX_INPUT} placeholder="VD: Lớp 7A" />
          </Field>
        ) : (
          <Field label="Tiêu đề"><input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} className={CX_INPUT} placeholder="VD: Soạn phần A bộ đề khối 9" /></Field>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Field label="Mục tiêu">
            {laScope
              ? <div className={`${CX_INPUT} bg-slate-50 text-slate-500`}>{mucTieuCuoi || <span className="italic text-slate-400">— mẹ chưa có mục tiêu —</span>}</div>
              : <input value={mucTieu} onChange={(e) => setMucTieu(e.target.value)} className={CX_INPUT} />}
          </Field>
          <Field label="Output (để nghiệm thu)">
            {laScope
              ? <div className={`${CX_INPUT} bg-slate-50 text-slate-500`}>{outputCuoi || <span className="italic text-slate-400">— mẹ chưa có output —</span>}</div>
              : <input value={output} onChange={(e) => setOutput(e.target.value)} className={CX_INPUT} placeholder="VD: file PDF 20 câu" />}
          </Field>
        </div>
        {laScope && !(prefill!.me!.muc_tieu || prefill!.me!.output) && (
          <p className="text-[11px] text-amber-600">Mẹ chưa có mục tiêu/output — vào Detail task mẹ điền trước, mọi con theo scope sẽ tự kế thừa.</p>
        )}
        <Field label="Giao cho (1 người)">
          {!nguoi.length ? <span className="text-[12px] text-slate-400">Bạn chưa quản lý ai trong cây tổ chức (chỉ tự giao cho mình).</span>
            : <NguoiPicker nguoi={nguoi} value={nguoiLamId} onChange={setNguoiLamId} />}
        </Field>
        <Field label="Khối lượng">
          {!!loaiViec?.thang_kl.length && (
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {loaiViec.thang_kl.map((m) => <Pill key={m.ma} on={mucKl?.ma === m.ma} onClick={() => { setMucKl(m); setKlTay('') }}>{m.ten} ({m.kl})</Pill>)}
            </div>
          )}
          <input type="number" value={klTay} onChange={(e) => { setKlTay(e.target.value === '' ? '' : Number(e.target.value)); setMucKl(null) }} className={CX_INPUT} placeholder="hoặc nhập số khối lượng" />
        </Field>
        <Field label="Deadline riêng của việc này (khuyến nghị — máy đo tiến độ theo hạn này)">
          <input type="date" min={todayVN()} value={deadline} onChange={(e) => setDeadline(e.target.value)} className={CX_INPUT} />
        </Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2 pt-1"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? 'Đang lưu…' : 'Giao việc'}</button></div>
      </div>
    </Modal>
  )
}
