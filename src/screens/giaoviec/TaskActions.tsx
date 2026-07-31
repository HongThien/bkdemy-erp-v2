// Modal hành động LEADER trên task: nghiệm thu (1 chạm), huỷ (partial), chuyển người.
// Tiến độ = MÁY tính (không nhập tay). §4.2/§4.4/§4.5/§4.8.
import { useEffect, useState } from 'react'
import {
  nghiemThu, huyViec, chuyenNguoi, listNguoiDuocGiao, type ViecFull, type NguoiDuocGiao,
} from '../../lib/giaoviec'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Modal, Field, Pill, fmtNgay } from './ui'

export function NghiemThuModal({ v, onClose, onDone }: { v: ViecFull; onClose: () => void; onDone: () => void }) {
  const [chatLuong, setChatLuong] = useState(100)
  const [lyDo, setLyDo] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)

  async function submit(dat: boolean) {
    setSaving(true); setErr(null)
    try { await nghiemThu(v.id, { dat, chat_luong: chatLuong, ly_do: lyDo.trim() || null }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  const capTran = [100, 85, 70][Math.min(v.so_lan_tra_lai, 2)]
  return (
    <Modal title={`Nghiệm thu — ${v.tieu_de}`} onClose={onClose}>
      <div className="space-y-3">
        <div className="text-[12px] text-slate-500">
          Người làm: <b>{v.nguoi_lam_ten}</b> · KL {v.khoi_luong} · Hạn {fmtNgay(v.deadline)}
          {v.so_lan_tra_lai > 0 && <> · Đã trả lại {v.so_lan_tra_lai} lần → <b className="text-rose-600">trần chất lượng {capTran}</b></>}
        </div>
        {v.evidence
          ? <div className="rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-600">Bằng chứng người làm nộp: <a href={v.evidence} target="_blank" rel="noreferrer" className="text-indigo-600 underline break-all">{v.evidence}</a></div>
          : <div className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-700">⚠ Chưa có bằng chứng.</div>}
        <div className="text-[12px] text-slate-500">Tiến độ do máy tính từ hạn vs ngày nộp — không cần chấm tay.</div>
        <Field label={`Chất lượng: ${chatLuong}${chatLuong > capTran ? ` → bị chặn còn ${capTran}` : ''}`}>
          <input type="range" min={0} max={100} step={5} value={chatLuong} onChange={(e) => setChatLuong(Number(e.target.value))} className="w-full" />
          <div className="mt-0.5 text-[11px] text-slate-400">Mặc định 100 (một chạm). Kéo xuống là HẠ điểm → phải ghi lý do.</div>
        </Field>
        {chatLuong < 100 && <Field label="Lý do hạ điểm (bắt buộc khi < 100)"><textarea value={lyDo} onChange={(e) => setLyDo(e.target.value)} className={CX_INPUT} rows={2} /></Field>}
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2 pt-1">
          <TraLai onTraLai={(ly) => { setLyDo(ly); submit(false) }} disabled={saving} />
          <button disabled={saving} onClick={() => submit(true)} className={CX_BTN}>{saving ? '…' : '✓ Chốt Đạt'}</button>
        </div>
      </div>
    </Modal>
  )
}
function TraLai({ onTraLai, disabled }: { onTraLai: (ly: string) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false); const [ly, setLy] = useState('')
  if (!open) return <button disabled={disabled} onClick={() => setOpen(true)} className="rounded-lg border border-rose-300 px-4 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50">Trả lại</button>
  return (
    <div className="flex flex-1 items-center gap-1.5">
      <input autoFocus value={ly} onChange={(e) => setLy(e.target.value)} placeholder="Lý do trả lại (bắt buộc)" className={`${CX_INPUT} flex-1`} />
      <button disabled={disabled || !ly.trim()} onClick={() => onTraLai(ly.trim())} className="rounded-lg bg-rose-600 px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-40">Gửi</button>
    </div>
  )
}

export function HuyModal({ v, onClose, onDone }: { v: ViecFull; onClose: () => void; onDone: () => void }) {
  const [pct, setPct] = useState(0); const [lyDo, setLyDo] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  async function submit() {
    setSaving(true); setErr(null)
    try { await huyViec(v.id, pct, lyDo.trim()); onDone() } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  return (
    <Modal title={`Huỷ task — ${v.tieu_de}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-[12px] text-slate-500">Huỷ ghi nhận partial cho <b>{v.nguoi_lam_ten}</b> theo tiến độ lúc huỷ (bạn nhập tay — máy không suy được khi chưa có ngày nộp). Số lần huỷ tính về phía NGƯỜI GIAO, không phải lỗi người làm.</p>
        <Field label={`Phần trăm ghi nhận cho người làm: ${pct}% (KL ghi nhận ≈ ${(Number(v.khoi_luong) * pct / 100).toFixed(2)})`}>
          <input type="range" min={0} max={100} step={5} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full" />
        </Field>
        <Field label="Lý do huỷ (bắt buộc)"><textarea value={lyDo} onChange={(e) => setLyDo(e.target.value)} className={CX_INPUT} rows={2} /></Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Thôi</button><button disabled={saving} onClick={submit} className="rounded-lg bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40">Huỷ task</button></div>
      </div>
    </Modal>
  )
}

export function ChuyenModal({ v, onClose, onDone }: { v: ViecFull; onClose: () => void; onDone: () => void }) {
  const [nguoi, setNguoi] = useState<NguoiDuocGiao[]>([])
  const [moiId, setMoiId] = useState(''); const [pct, setPct] = useState(0); const [lyDo, setLyDo] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  useEffect(() => { listNguoiDuocGiao().then(setNguoi).catch(() => {}) }, [])
  async function submit() {
    if (!moiId) { setErr('Chọn người mới.'); return }
    setSaving(true); setErr(null)
    try { await chuyenNguoi(v.id, moiId, pct, lyDo.trim()); onDone() } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  const klConLai = (Number(v.khoi_luong) * (1 - pct / 100)).toFixed(2)
  return (
    <Modal title={`Chuyển người — ${v.tieu_de}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-[12px] text-slate-500">Đóng task cũ với partial cho <b>{v.nguoi_lam_ten}</b> + đẻ task mới (KL = phần còn lại) cho người mới. Mỗi task luôn đúng 1 người từ đầu đến cuối.</p>
        <Field label={`Ghi nhận cho người cũ: ${pct}% → task mới KL ≈ ${klConLai}`}>
          <input type="range" min={0} max={100} step={5} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full" />
        </Field>
        <Field label="Người mới">
          <div className="flex flex-wrap gap-1.5">
            {nguoi.filter((n) => n.nhan_su_id !== v.nguoi_lam_id).map((n) => <Pill key={n.nhan_su_id} on={moiId === n.nhan_su_id} onClick={() => setMoiId(n.nhan_su_id)}>{n.ho_ten}</Pill>)}
          </div>
        </Field>
        <Field label="Lý do (tuỳ chọn)"><input value={lyDo} onChange={(e) => setLyDo(e.target.value)} className={CX_INPUT} /></Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Thôi</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? '…' : 'Chuyển'}</button></div>
      </div>
    </Modal>
  )
}
