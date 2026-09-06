// Khối "Nhắc việc hàng ngày" (Web Push) DÙNG CHUNG cho app pt (10:30) và app ta (23:30) —
// CEO 06/09: "app TA cũng cần push để không miss việc, giống pt". KHÔNG import gì thuộc
// NhanSuHome/useStore (luật bundle app TA/OPS/pt — bundle nhẹ, tự đứng riêng).
// `NhacVietCard` = nội dung (dùng trong trang Cài đặt riêng của pt). `NhacViecNutHeader` =
// nút chuông + modal nổi (khuôn GopY của app ta) cho app không có tab Cài đặt riêng.
import { useEffect, useState } from 'react'
import { kiemTraHoTro, trangThaiNhacViec, batNhacViec, tatNhacViec, listThietBiCuaToi, type PushApp, type PushHoTro, type TrangThaiNhac, type PushDangKy } from '../lib/push'

const HO_TRO_TEXT: Record<PushHoTro, string> = {
  ok: '',
  dev: 'Bản dev (vite) không có service worker — nhắc việc chỉ thử được trên bản build/preview hoặc bản deploy.',
  thieu_cau_hinh: 'Bản deploy này chưa khai VITE_PUSH_VAPID_PUBLIC — quản trị cần cấu hình trên Vercel.',
  ios_can_cai: 'Trên iPhone/iPad: bấm Chia sẻ → "Thêm vào MH chính", rồi mở app từ màn hình chính để bật nhắc việc (Safari yêu cầu vậy).',
  khong_ho_tro: 'Trình duyệt này không hỗ trợ thông báo đẩy — dùng Chrome (Android) hoặc cài app lên màn hình chính (iPhone).',
}

// ddmmVN cục bộ (KHÔNG import lib/tuan — lib đó thuộc trục nhân sự/lớp, component này phải
// đứng độc lập được ở mọi bundle). Dùng cho "gửi ok DD/MM".
function ddmm(iso: string): string { const [, m, d] = iso.split('-'); return `${d}/${m}` }

export function NhacViecCard({ app, gioNhac, moTa }: { app: PushApp; gioNhac: string; moTa: string }) {
  const hoTro = kiemTraHoTro()
  const [tt, setTt] = useState<TrangThaiNhac | null>(null)
  const [thietBi, setThietBi] = useState<PushDangKy[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function reload() {
    if (hoTro === 'ok') setTt(await trangThaiNhacViec(app).catch(() => 'tat' as TrangThaiNhac))
    setThietBi(await listThietBiCuaToi(app).catch(() => []))
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  async function doi(bat: boolean) {
    setBusy(true); setErr(null); setOk(null)
    try {
      if (bat) { await batNhacViec(app); setOk(`Đã bật — máy này sẽ nhận nhắc việc lúc ${gioNhac} mỗi ngày.`) }
      else { await tatNhacViec(); setOk('Đã tắt nhắc việc trên máy này.') }
      await reload()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-[26px]">🔔</span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-slate-800">Nhắc việc hàng ngày</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">{gioNhac} mỗi ngày, máy này nhận một thông báo chung: {moTa}</p>
        </div>
      </div>
      {hoTro !== 'ok' ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-800">{HO_TRO_TEXT[hoTro]}</p>
      ) : tt === null ? <p className="mt-3 text-[12.5px] text-slate-400">Đang kiểm tra…</p> : tt === 'chan' ? (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-rose-700">Thông báo đang bị CHẶN cho trang này — vào cài đặt trình duyệt/điện thoại → Thông báo → cho phép, rồi mở lại.</p>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
          <span className={`text-[13px] font-semibold ${tt === 'bat' ? 'text-emerald-700' : 'text-slate-600'}`}>{tt === 'bat' ? '● Đang bật trên máy này' : '○ Đang tắt trên máy này'}</span>
          <button disabled={busy} onClick={() => doi(tt !== 'bat')}
            className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm disabled:opacity-40 ${tt === 'bat' ? 'bg-slate-500' : 'bg-indigo-600'}`}>
            {busy ? '…' : tt === 'bat' ? 'Tắt' : 'Bật nhắc việc'}
          </button>
        </div>
      )}
      {ok && <p className="mt-2 text-[12.5px] text-emerald-700">{ok}</p>}
      {err && <p className="mt-2 text-[12.5px] text-rose-600">{err}</p>}

      {thietBi.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Máy đang nhận ({thietBi.length})</p>
          <div className="flex flex-col divide-y divide-slate-100">
            {thietBi.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-1.5 text-[12.5px]">
                <span className="font-medium text-slate-700">{d.thiet_bi ?? 'Máy không rõ'}</span>
                <span className={`text-[11.5px] ${d.loi_ma === 410 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {d.loi_ma === 410 ? 'endpoint đã chết' : d.gui_ok_at ? `gửi ok ${ddmm(d.gui_ok_at.slice(0, 10))}` : d.loi_at ? `lỗi ${d.loi_ma ?? ''}` : 'chưa gửi lần nào'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Nút chuông 🔔 + modal nổi (khuôn GopY.tsx) — cho app KHÔNG có tab/trang Cài đặt riêng (app ta:
// bottom-tab đã đủ 5 ô, không chèn thêm được — CEO 31/08 khuôn OpsHome cố định số tab).
export function NhacViecNutHeader({ app, gioNhac, moTa }: { app: PushApp; gioNhac: string; moTa: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Cài đặt nhắc việc"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[15px] active:bg-slate-100">🔔</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <NhacViecCard app={app} gioNhac={gioNhac} moTa={moTa} />
            <button onClick={() => setOpen(false)} className="mt-2 w-full rounded-xl bg-white/90 py-2.5 text-[13px] font-medium text-slate-500 shadow-sm active:bg-white">Đóng</button>
          </div>
        </div>
      )}
    </>
  )
}
