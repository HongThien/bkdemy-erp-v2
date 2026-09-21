// Modal SỬA + HUỶ ca test đầu vào — DÙNG CHUNG cho Điểm danh test · Chấm test · Trả bài (CEO 21/09: "tất cả các màn hình
// đều phải có tính năng sửa xoá các card"). Một bản duy nhất ⇒ 3 màn cùng luật: sửa = ngày · giờ · thời lượng + tên HS ·
// khối · PH · SĐT (môn KHÔNG sửa — đổi môn = đổi đề + người chấm ⇒ huỷ rồi tạo lại); "xoá" = HUỶ CA có lý do, khôi phục
// được ở Điểm danh test › Đã huỷ (CLAUDE.md §4: không xoá cứng). DB chặn huỷ ca đã trả bài.
import { useEffect, useState } from 'react'
import { suaCaTest, huyCaTest, getCaTest, THOI_LUONG_OPTIONS, type CaTest, type SuaCaTestInput } from '../../lib/tuyensinh'
import { KHOI_OPTIONS } from '../../lib/kho/api'

const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

export function SuaCaTestModal({ c, onClose, onDone }: { c: CaTest; onClose: () => void; onDone: (ca: CaTest) => void }) {
  const [f, setF] = useState<SuaCaTestInput>({
    ngay: c.ngay, gioBatDau: c.gioBatDau.slice(0, 5), thoiLuongPhut: c.thoiLuongPhut,
    hoTenHs: c.ungVien.hoTenHs, khoi: c.ungVien.khoi, hoTenPh: c.ungVien.hoTenPh, sdtPh: c.ungVien.sdtPh,
  })
  const set = <K extends keyof SuaCaTestInput>(k: K, v: SuaCaTestInput[K]) => setF((s) => ({ ...s, [k]: v }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const doiKhoi = (f.khoi ?? '') !== (c.ungVien.khoi ?? '')
  async function save() {
    setBusy(true); setErr(null)
    try {
      await suaCaTest(c, f)
      onDone({ ...c, ngay: f.ngay, gioBatDau: f.gioBatDau, thoiLuongPhut: f.thoiLuongPhut,
        ungVien: { ...c.ungVien, hoTenHs: f.hoTenHs.trim(), khoi: f.khoi, hoTenPh: f.hoTenPh?.trim() || null, sdtPh: f.sdtPh?.trim() || null } })
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">Sửa ca test · {c.mon}</div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Lbl>Tên học sinh *</Lbl><input className={inputCls} value={f.hoTenHs} onChange={(e) => set('hoTenHs', e.target.value)} /></div>
            <div><Lbl>Lớp</Lbl><select className={inputCls} value={f.khoi ?? ''} onChange={(e) => set('khoi', e.target.value || null)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
            <div><Lbl>SĐT bố/mẹ</Lbl><input className={inputCls} value={f.sdtPh ?? ''} onChange={(e) => set('sdtPh', e.target.value)} /></div>
            <div className="sm:col-span-2"><Lbl>Tên bố/mẹ</Lbl><input className={inputCls} value={f.hoTenPh ?? ''} onChange={(e) => set('hoTenPh', e.target.value)} /></div>
            <div><Lbl>Ngày test</Lbl><input type="date" className={inputCls} value={f.ngay} onChange={(e) => set('ngay', e.target.value)} /></div>
            <div><Lbl>Giờ test *</Lbl><input type="time" className={inputCls} value={f.gioBatDau} onChange={(e) => set('gioBatDau', e.target.value)} /></div>
          </div>
          <div>
            <Lbl>Thời gian test</Lbl>
            <div className="flex flex-wrap gap-1.5">
              {THOI_LUONG_OPTIONS.map((p) => (
                <button key={p} type="button" onClick={() => set('thoiLuongPhut', p)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${f.thoiLuongPhut === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}'</button>
              ))}
            </div>
          </div>
          {doiKhoi && c.taiLieuId && <p className="rounded-md bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-800">⚠ Ca đã gán đề khối {c.ungVien.khoi}. Đổi sang khối {f.khoi} thì ca sẽ báo lệch khối — bấm "Gán lại đề đang dùng" ở thẻ ca / màn chấm (người chấm · trả bài vẫn theo phân công cũ).</p>}
          {err && <p className="text-[12px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="min-h-[44px] rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Đóng</button>
            <button onClick={save} disabled={busy || !f.hoTenHs.trim() || !f.gioBatDau} className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chấm test / Trả bài chỉ giữ bản RÚT GỌN của ca ⇒ nạp ca đầy đủ theo id rồi mở đúng modal trên.
export function SuaCaTheoIdModal({ caTestId, onClose, onDone }: { caTestId: string; onClose: () => void; onDone: (ca: CaTest) => void }) {
  const [c, setC] = useState<CaTest | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { let alive = true; setC(null); getCaTest(caTestId).then((x) => alive && setC(x)).catch((e) => alive && setErr(e.message ?? String(e))); return () => { alive = false } }, [caTestId])
  if (c) return <SuaCaTestModal c={c} onClose={onClose} onDone={onDone} />
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="rounded-xl bg-white px-5 py-3 text-[13px] text-slate-600 shadow-xl">{err ? <span className="text-rose-600">{err}</span> : 'Đang tải ca…'}</div>
    </div>
  )
}

const LY_DO_HUY = ['Tạo nhầm / tạo trùng', 'Học sinh không đến', 'Phụ huynh huỷ lịch', 'Nhập sai học sinh'] as const
export function HuyCaTestModal({ caTestId, hoTenHs, onClose, onDone }: { caTestId: string; hoTenHs: string; onClose: () => void; onDone: (lyDo: string) => void }) {
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function huy() {
    setBusy(true); setErr(null)
    try { await huyCaTest(caTestId, lyDo); onDone(lyDo.trim()) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[460px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-[16px] font-semibold text-slate-800">Huỷ ca test của {hoTenHs}?</div>
        <p className="mt-1 text-[12px] text-slate-500">Ca biến khỏi Điểm danh, Chấm, Trả bài, Việc của tôi và Thống kê. Dữ liệu vẫn giữ — khôi phục được ở Điểm danh test › "Đã huỷ".</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {LY_DO_HUY.map((l) => (
            <button key={l} type="button" onClick={() => setLyDo(l)} className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition ${lyDo === l ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{l}</button>
          ))}
        </div>
        <input className={`${inputCls} mt-2`} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do huỷ (bắt buộc)" autoFocus />
        {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Không huỷ</button>
          <button onClick={huy} disabled={busy || !lyDo.trim()} className="min-h-[40px] rounded-lg bg-rose-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">{busy ? 'Đang huỷ…' : '🗑 Huỷ ca'}</button>
        </div>
      </div>
    </div>
  )
}

// Cặp nút nhỏ ✎ / 🗑 đặt ĐÈ lên góc thẻ (thẻ là <button> nên không lồng nút vào trong được).
export function NutSuaHuy({ onSua, onHuy, anHuy }: { onSua: () => void; onHuy: () => void; anHuy?: boolean }) {
  return (
    <div className="absolute bottom-2 right-2 flex gap-0.5">
      <button onClick={(e) => { e.stopPropagation(); onSua() }} title="Sửa thông tin ca / học sinh" className="rounded-md px-1.5 py-0.5 text-[13px] text-slate-300 hover:bg-slate-100 hover:text-indigo-600">✎</button>
      {!anHuy && <button onClick={(e) => { e.stopPropagation(); onHuy() }} title="Huỷ ca (khôi phục được ở Điểm danh test)" className="rounded-md px-1.5 py-0.5 text-[13px] text-slate-300 hover:bg-rose-50 hover:text-rose-600">🗑</button>}
    </div>
  )
}
