// Card + modal chi tiết DÙNG CHUNG cho tab Hôm nay và Việc của tôi (CEO 05/09: "cùng 1 cái thì UI
// phải giống nhau"). Card CHỈ có: tên · chip trạng thái · deadline (đỏ = quá hạn, không đếm ngày) ·
// % gần nhất · nút. Mọi thông tin khác (mục tiêu/output/người giao/KL/lịch sử) chỉ hiện khi bấm vào.
// Nút trên card: "Bắt đầu" chỉ khi mới giao (biến mất ngay sau bấm) · "Cập nhật tình trạng" ·
// "Hoàn thành" CHỈ khi % tự báo gần nhất = 100.
import { useEffect, useState } from 'react'
import {
  themCapNhat, batDauLam, banHoanThanh, guiLaiNghiemThu, xinGiaHan, listCapNhat,
  type ViecPt, type CapNhatViec,
} from '../../lib/giaoviec'
import { Badge, VIEC_TT, DeadlineChip, Modal, Field, CX_INPUT, CX_BTN, CX_BTN_GHOST, ErrBar, fmtNgay } from '../giaoviec/ui'

export const MUC_TIEN_DO = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const
const DA_DONG = ['dat', 'huy', 'chuyen']
const dangCam = (v: ViecPt) => ['moi_giao', 'dang_lam', 'tra_lai'].includes(v.trang_thai)
const BTN_TIM = `${CX_BTN} bg-violet-600 hover:bg-violet-700`

export function ViecPtCard({ v, onOpen, onChanged }: { v: ViecPt; onOpen: (v: ViecPt) => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const [daBatDau, setDaBatDau] = useState(false)   // ẩn nút NGAY khi bấm, không đợi reload (CEO: "mất chữ bắt đầu luôn")
  const [htModal, setHtModal] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const dong = DA_DONG.includes(v.trang_thai)
  const pct = v.tien_do_bao_cao ?? (dong ? v.phan_tram : null)
  const hienBatDau = v.trang_thai === 'moi_giao' && !daBatDau && v.so_con === 0
  const hienHoanThanh = dangCam(v) && v.so_con === 0 && v.tien_do_bao_cao === 100

  async function batDau() {
    setBusy(true); setErr(null); setDaBatDau(true)
    try { await batDauLam(v.id); onChanged() } catch (e: any) { setErr(e?.message ?? String(e)); setDaBatDau(false) } finally { setBusy(false) }
  }

  return (
    <div className={`rounded-2xl border bg-white p-3.5 shadow-sm ${v.qua_han ? 'border-rose-200' : 'border-slate-200/70'}`}>
      <button onClick={() => onOpen(v)} className="block w-full text-left">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-slate-800">{v.tieu_de}</p>
          {pct != null && <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[12px] font-bold ${pct >= 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>{pct}%</span>}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge map={VIEC_TT} k={v.trang_thai} />
          <DeadlineChip deadline={v.deadline} active={!dong} />
          {v.so_con > 0 && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{v.so_con_dat}/{v.so_con} con đạt</span>}
          {v.gia_han_xin_deadline && <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">chờ duyệt gia hạn</span>}
        </div>
      </button>
      <ErrBar msg={err} />
      {dangCam(v) && (
        <div className="mt-2.5 flex gap-2">
          {hienBatDau && <button disabled={busy} onClick={batDau} className={`${CX_BTN_GHOST} flex-1 py-2`}>▶ Bắt đầu</button>}
          <button onClick={() => onOpen(v)} className={`${BTN_TIM} flex-1 py-2`}>✎ Cập nhật tình trạng</button>
          {hienHoanThanh && <button onClick={() => setHtModal(true)} className={`${CX_BTN} flex-1 bg-emerald-600 py-2 hover:bg-emerald-700`}>✓ Hoàn thành</button>}
        </div>
      )}
      {v.trang_thai === 'cho_nghiem_thu' && <p className="mt-2 text-[12px] text-amber-600">Chờ {v.nguoi_giao_ten ?? 'người giao'} nghiệm thu…</p>}
      {htModal && <HoanThanhModal v={v} onClose={() => setHtModal(false)} onDone={() => { setHtModal(false); onChanged() }} />}
    </div>
  )
}

// ── CHI TIẾT + CẬP NHẬT: mở khi bấm card / nút Cập nhật ─────────────────────────
export function ChiTietModal({ v, onClose, onChanged }: { v: ViecPt; onClose: () => void; onChanged: () => void }) {
  const [noiDung, setNoiDung] = useState('')
  const [tienDo, setTienDo] = useState<string>(v.tien_do_bao_cao != null ? String(v.tien_do_bao_cao) : '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [lichSu, setLichSu] = useState<CapNhatViec[] | null>(null)
  const [giaHan, setGiaHan] = useState(false)
  const [ghDeadline, setGhDeadline] = useState(''); const [ghLyDo, setGhLyDo] = useState('')
  const dong = DA_DONG.includes(v.trang_thai)
  const coTheCapNhat = dangCam(v) || v.trang_thai === 'hold' || (v.so_con > 0 && !dong)
  const coTheGiaHan = dangCam(v) && !!v.deadline && !v.gia_han_xin_deadline && v.so_lan_gia_han < 1

  async function taiLichSu() { setLichSu(await listCapNhat(v.id).catch(() => [])) }
  useEffect(() => { taiLichSu() }, [v.id]) // eslint-disable-line

  async function luu() {
    setBusy(true); setErr(null); setOk(null)
    try {
      const td = tienDo === '' ? null : Number(tienDo)
      if (v.trang_thai === 'moi_giao') await batDauLam(v.id)   // cập nhật lần đầu = đã bắt đầu làm
      await themCapNhat(v.id, { noiDung, tienDoBaoCao: td })
      setNoiDung(''); setOk(td === 100 ? 'Đã lưu. Về card bấm "✓ Hoàn thành" để gửi nghiệm thu.' : 'Đã lưu cập nhật.')
      await taiLichSu(); onChanged()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  async function guiGiaHan() {
    setBusy(true); setErr(null)
    try { await xinGiaHan(v.id, ghDeadline, ghLyDo); setGiaHan(false); setOk('Đã gửi yêu cầu gia hạn, chờ duyệt.'); onChanged() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <Modal title="Chi tiết việc" onClose={onClose}>
      <p className="text-[15px] font-bold leading-snug text-slate-800">{v.tieu_de}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <Badge map={VIEC_TT} k={v.trang_thai} />
        <DeadlineChip deadline={v.deadline} active={!dong} />
        {v.tien_do_bao_cao != null && <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[11px] font-bold text-sky-700">{v.tien_do_bao_cao}%</span>}
      </div>

      <div className="mt-3 space-y-1 rounded-xl bg-slate-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-slate-600">
        {v.muc_tieu && <p>🎯 {v.muc_tieu}</p>}
        {v.output && <p>📦 Output: {v.output}</p>}
        {v.mo_ta && <p className="text-slate-500">{v.mo_ta}</p>}
        <p className="text-slate-400">Giao bởi {v.nguoi_giao_ten ?? '?'} · KL {v.khoi_luong}{v.so_con > 0 && <> · {v.so_con_dat}/{v.so_con} task con đạt</>}</p>
        {v.trang_thai === 'tra_lai' && v.ghi_chu_nghiem_thu && <p className="rounded-lg bg-rose-50 px-2 py-1 text-rose-600">Bị trả lại: {v.ghi_chu_nghiem_thu}</p>}
        {v.gia_han_xin_deadline && <p className="text-amber-600">Đang xin gia hạn tới {fmtNgay(v.gia_han_xin_deadline)} — chờ duyệt.</p>}
        {v.trang_thai === 'dat' && <p className="text-emerald-700">Đạt · tiến độ {v.tien_do} · chất lượng {v.chat_luong} · {v.phan_tram}%</p>}
      </div>

      {coTheCapNhat && (
        <div className="mt-3 flex flex-col gap-2.5">
          <Field label="Hôm nay làm được gì / vướng gì?">
            <textarea value={noiDung} onChange={(e) => setNoiDung(e.target.value)} rows={3} className={CX_INPUT} placeholder="Ví dụ: xong phần A, đang vướng B vì…" />
          </Field>
          <Field label="Tiến độ tự đánh giá">
            <select value={tienDo} onChange={(e) => setTienDo(e.target.value)} className={CX_INPUT}>
              <option value="">— chưa ước lượng —</option>
              {MUC_TIEN_DO.map((m) => <option key={m} value={m}>{m}%</option>)}
            </select>
          </Field>
          <button onClick={luu} disabled={busy || !noiDung.trim()} className={`${BTN_TIM} w-full`}>{busy ? 'Đang lưu…' : 'Lưu cập nhật'}</button>
        </div>
      )}
      {ok && <p className="mt-2 text-[12.5px] text-emerald-700">{ok}</p>}
      <ErrBar msg={err} />

      {coTheGiaHan && !giaHan && <button onClick={() => setGiaHan(true)} className="mt-2 text-[12.5px] font-medium text-indigo-600">Xin gia hạn (1 lần, trước hạn) ›</button>}
      {giaHan && (
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-indigo-100 p-3">
          <Field label="Hạn mới"><input type="date" value={ghDeadline} onChange={(e) => setGhDeadline(e.target.value)} className={CX_INPUT} /></Field>
          <Field label="Lý do"><input value={ghLyDo} onChange={(e) => setGhLyDo(e.target.value)} className={CX_INPUT} /></Field>
          <div className="flex gap-2">
            <button onClick={() => setGiaHan(false)} className={`${CX_BTN_GHOST} flex-1`}>Thôi</button>
            <button onClick={guiGiaHan} disabled={busy || !ghDeadline} className={`${CX_BTN} flex-1`}>Gửi yêu cầu</button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Lịch sử cập nhật</p>
        {lichSu === null ? <p className="text-[12px] text-slate-400">Đang tải…</p>
          : !lichSu.length ? <p className="text-[12px] text-slate-400">Chưa có cập nhật nào.</p>
          : <div className="flex flex-col divide-y divide-slate-100">
              {lichSu.slice(0, 15).map((c) => (
                <div key={c.id} className="py-1.5 text-[12.5px]">
                  <span className="text-slate-400">{fmtNgay(c.created_at.slice(0, 10))}</span>
                  {c.tien_do_bao_cao != null && <span className="ml-1.5 font-semibold text-sky-700">{c.tien_do_bao_cao}%</span>}
                  <span className="ml-1.5 text-slate-700">{c.noi_dung}</span>
                </div>
              ))}
            </div>}
      </div>
    </Modal>
  )
}

// ── HOÀN THÀNH / GỬI LẠI NGHIỆM THU — bằng chứng bắt buộc (§4.2) ─────────────────
function HoanThanhModal({ v, onClose, onDone }: { v: ViecPt; onClose: () => void; onDone: () => void }) {
  const [ev, setEv] = useState(v.evidence ?? '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const laGuiLai = v.trang_thai === 'tra_lai'
  async function gui() {
    setBusy(true); setErr(null)
    try { await (laGuiLai ? guiLaiNghiemThu(v.id, ev) : banHoanThanh(v.id, ev)); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <Modal title={laGuiLai ? 'Gửi lại nghiệm thu' : 'Báo hoàn thành'} onClose={onClose}>
      <p className="mb-3 text-[13px] font-semibold text-slate-700">{v.tieu_de}</p>
      <Field label="Bằng chứng (link ảnh/file/tài liệu) — bắt buộc">
        <textarea autoFocus value={ev} onChange={(e) => setEv(e.target.value)} rows={3} className={CX_INPUT} placeholder="Dán link Drive / ảnh / mô tả nơi xem kết quả" />
      </Field>
      <ErrBar msg={err} />
      <div className="mt-3 flex gap-2">
        <button onClick={onClose} className={`${CX_BTN_GHOST} flex-1`}>Huỷ</button>
        <button onClick={gui} disabled={busy || !ev.trim()} className={`${CX_BTN} flex-1 bg-emerald-600 hover:bg-emerald-700`}>{busy ? 'Đang gửi…' : 'Gửi nghiệm thu'}</button>
      </div>
    </Modal>
  )
}
