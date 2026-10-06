// CHUỖI LÀM BÀI — phần giao diện (spec-v1-app-hs.md §3, hạng mục V1 #2 · backlog V3). Số liệu 100% từ DB (fn_chuoi_cua_toi qua lib/chuoi.ts) — ở đây chỉ vẽ.
//  · NutChuoi: ngọn lửa + số ngày ở đầu màn chính, luôn thấy. Hôm nay chưa có lượt tính ⇒ lửa xám (nhắc nhẹ, không doạ). Có ngày lỡ còn sửa được ⇒ chấm cảnh báo.
//  · TamChuoi: bấm ngọn lửa ⇒ tấm dưới: 7 ngày gần nhất · kỷ lục · thẻ đóng băng · ngày lỡ + số lượt cần bù + hạn · mốc kế tiếp · luật ngắn · nút Luyện ngay.
//  · MungMocChuoi: chạm mốc 3 · 7 · 14 · 30 · 50 · 100 · 200 · 365 ⇒ hoạt cảnh mừng 1 lần. "Đã xem" nhớ trong máy (tiện ích hiển thị, không phải dữ liệu học):
//    mất thì em chỉ thấy mừng lại 1 lần, không sai số liệu nào.
// Không làm (spec §3): chuỗi một-một giữa 2 bạn · báo công khai ai đứt chuỗi · nhắc giữ chuỗi sau 22:00.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HEAD, MAU, NutHS } from './skin/KhungHS'
import type { Chuoi, NgayChuoi } from '../../lib/chuoi'

const MOC = [3, 7, 14, 30, 50, 100, 200, 365]
const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const thuCua = (ngay: string) => { const [y, m, d] = ngay.split('-').map(Number); return THU[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] }
const ddmm = (ngay: string) => ngay.slice(8, 10) + '/' + ngay.slice(5, 7)
const gioHan = (iso: string) => new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })

const CSS = `
@keyframes chuoi-lua { 0%,100% { transform: scale(1) rotate(-2deg) } 50% { transform: scale(1.08) rotate(2deg) } }
@keyframes chuoi-mung { 0% { transform: scale(.4); opacity: 0 } 60% { transform: scale(1.12); opacity: 1 } 100% { transform: scale(1) } }
@keyframes chuoi-tia { from { transform: rotate(0) } to { transform: rotate(360deg) } }
.chuoi-lua { display: inline-block; animation: chuoi-lua 1.6s ease-in-out infinite; transform-origin: 50% 90% }
.chuoi-mung { animation: chuoi-mung .7s cubic-bezier(.2,.9,.3,1.2) both }
.chuoi-tia { animation: chuoi-tia 14s linear infinite }
@media (prefers-reduced-motion: reduce) { .chuoi-lua, .chuoi-mung, .chuoi-tia { animation: none } }`

/** Ngọn lửa ở đầu màn chính. c = undefined: đang tải · null: lỗi (ẩn hẳn, không chặn Home). */
export function NutChuoi({ c, onClick, style }: { c: Chuoi | null | undefined; onClick: () => void; style?: React.CSSProperties }) {
  if (c === null) return null
  const sang = !!c?.hom_nay_da_tinh
  return (
    <button onClick={onClick} className="relative flex h-10 shrink-0 items-center gap-1 px-3 text-[15px] font-extrabold active:scale-95" style={style}
      aria-label={c ? `Chuỗi làm bài ${c.so_ngay} ngày${sang ? '' : ', hôm nay chưa có lượt được tính'}` : 'Chuỗi làm bài'}>
      <style>{CSS}</style>
      <span className={sang ? 'chuoi-lua' : ''} style={{ filter: sang ? undefined : 'grayscale(1) opacity(.6)' }} aria-hidden>🔥</span>
      <span style={HEAD}>{c ? c.so_ngay : '…'}</span>
      {!!c?.ngay_cho_sua.length && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full" style={{ background: MAU.canhBao }} aria-hidden />}
    </button>
  )
}

function ONgay({ n, homNay }: { n: NgayChuoi; homNay: boolean }) {
  const kieu: Record<NgayChuoi['trang_thai'], { icon: string; nen: string; chu: string }> = {
    hoc: { icon: '🔥', nen: MAU.acc, chu: 'Đã học' },
    dong_bang: { icon: '🧊', nen: MAU.surface2, chu: 'Thẻ đóng băng' },
    nghi: { icon: '🌙', nen: MAU.surface2, chu: 'Ngày nghỉ' },
    cho_sua: { icon: '⏳', nen: MAU.surface2, chu: 'Lỡ — còn sửa được' },
    dut: { icon: '✕', nen: MAU.surface2, chu: 'Đứt' },
    trong: { icon: '', nen: MAU.surface2, chu: homNay ? 'Hôm nay chưa học' : 'Chưa có' },
  }
  const k = kieu[n.trang_thai]
  return (
    <div className="flex flex-1 flex-col items-center gap-1" title={`${ddmm(n.ngay)}: ${k.chu}`}>
      <span className="text-[11px] font-bold" style={{ color: homNay ? MAU.acc : MAU.muted }}>{homNay ? 'Nay' : thuCua(n.ngay)}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full text-[16px]"
        style={{ background: n.trang_thai === 'hoc' ? k.nen : MAU.surface2, border: `2px solid ${n.trang_thai === 'cho_sua' ? MAU.canhBao : homNay ? MAU.acc : 'transparent'}`,
          color: n.trang_thai === 'dut' ? MAU.sai : MAU.ink }}>{k.icon}</span>
      <span className="text-[10.5px]" style={{ color: MAU.muted }}>{ddmm(n.ngay)}</span>
    </div>
  )
}

/** Tấm chi tiết chuỗi (portal ra body — nút mở nằm trong ô z thấp của Home). */
export function TamChuoi({ c, onDong, onLuyen }: { c: Chuoi; onDong: () => void; onLuyen?: () => void }) {
  const ngayCuoi = c.bay_ngay.length - 1
  return createPortal(
    <>
      <style>{CSS}</style>
      <div className="fixed inset-0 z-[60] opacity-60" style={{ background: 'var(--sk-bg)' }} onClick={onDong} />
      <div className="fixed inset-x-0 bottom-0 z-[61] mx-auto flex max-h-[88dvh] max-w-[520px] flex-col gap-3 overflow-y-auto rounded-t-[22px] px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4"
        style={{ background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderTop: `1px solid ${MAU.line}` }} role="dialog" aria-label="Chuỗi làm bài">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`text-[40px] leading-none ${c.hom_nay_da_tinh ? 'chuoi-lua' : ''}`} style={{ filter: c.hom_nay_da_tinh ? undefined : 'grayscale(1) opacity(.6)' }} aria-hidden>🔥</span>
            <div>
              <p className="text-[22px] font-bold leading-tight" style={HEAD}>{c.so_ngay} ngày liên tiếp</p>
              <p className="text-[13px]" style={{ color: MAU.muted }}>
                {c.hom_nay_da_tinh ? `Hôm nay đã giữ chuỗi (${c.luot_hom_nay} lượt được tính).` : 'Hôm nay em chưa có lượt nào được tính.'}
              </p>
            </div>
          </div>
          <button onClick={onDong} className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[16px]" style={{ background: MAU.surface2 }} aria-label="Đóng">✕</button>
        </div>

        <div className="flex gap-1 rounded-2xl p-3" style={{ background: MAU.surface }}>
          {c.bay_ngay.map((n, i) => <ONgay key={n.ngay} n={n} homNay={i === ngayCuoi} />)}
        </div>

        {c.ngay_cho_sua.length > 0 && (
          <div className="rounded-2xl p-3 text-[13.5px] leading-snug" style={{ border: `1.5px solid ${MAU.canhBao}` }}>
            <p className="font-bold" style={{ color: MAU.canhBao }}>Em lỡ {c.ngay_cho_sua.map(ddmm).join(', ')} — vẫn sửa được!</p>
            <p className="mt-1" style={{ color: MAU.ink }}>
              Làm thêm {c.luot_can_bu} lượt được tính (ngoài lượt giữ chuỗi hôm nay){c.sua_duoc_den ? ` trước ${gioHan(c.sua_duoc_den)}` : ''} để nối lại chuỗi.
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl p-2.5" style={{ background: MAU.surface }}><p className="text-[18px] font-bold" style={HEAD}>{c.ky_luc}</p><p className="text-[11.5px]" style={{ color: MAU.muted }}>Kỷ lục</p></div>
          <div className="rounded-2xl p-2.5" style={{ background: MAU.surface }}><p className="text-[18px] font-bold" style={HEAD}>🧊 {c.the_dong_bang}</p><p className="text-[11.5px]" style={{ color: MAU.muted }}>Thẻ đóng băng tháng này</p></div>
          <div className="rounded-2xl p-2.5" style={{ background: MAU.surface }}><p className="text-[18px] font-bold" style={HEAD}>{c.moc_tiep ?? '—'}</p><p className="text-[11.5px]" style={{ color: MAU.muted }}>{c.moc_tiep ? `Mốc kế (còn ${Math.max(0, c.moc_tiep - c.so_ngay)} ngày)` : 'Đã qua mọi mốc'}</p></div>
        </div>

        <ul className="list-disc pl-5 text-[12.5px] leading-relaxed" style={{ color: MAU.muted }}>
          <li>Mỗi ngày có ít nhất 1 lượt luyện thêm được tính (Tự luyện, luyện theo chủ đề, Thử thách) là giữ chuỗi. ET và BTVN không tính.</li>
          <li>Lỡ 1 ngày: làm bù trong 48 giờ để sửa. Hết hạn thì tự dùng thẻ đóng băng (2 thẻ mỗi tháng).</li>
          <li>Ngày nghỉ của trung tâm và tuần thi không làm đứt chuỗi.</li>
        </ul>
        {onLuyen && !c.hom_nay_da_tinh && <NutHS onClick={onLuyen}>Luyện ngay để giữ chuỗi</NutHS>}
      </div>
    </>,
    document.body,
  )
}

/** Hoạt cảnh mừng mốc — tự hiện khi so_ngay đúng 1 mốc và em chưa xem mốc đó của chuỗi hiện tại. */
export function MungMocChuoi({ c, hsId }: { c: Chuoi | null | undefined; hsId: string | null }) {
  const [moc, setMoc] = useState<number | null>(null)
  useEffect(() => {
    if (!c || !hsId || !c.hom_nay_da_tinh || !MOC.includes(c.so_ngay)) return
    const khoa = `chuoi_moc:${hsId}:${c.bat_dau}:${c.so_ngay}`
    try { if (localStorage.getItem(khoa)) return; localStorage.setItem(khoa, '1') } catch { /* máy chặn lưu ⇒ vẫn mừng */ }
    setMoc(c.so_ngay)
  }, [c, hsId])
  if (moc === null) return null
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6" onClick={() => setMoc(null)} role="dialog" aria-label={`Chuỗi ${moc} ngày`}
      style={{ background: 'color-mix(in srgb, var(--sk-bg) 82%, transparent)', fontFamily: 'var(--sk-font)' }}>
      <style>{CSS}</style>
      <div className="chuoi-mung relative flex flex-col items-center gap-2 text-center">
        <span className="chuoi-tia pointer-events-none absolute left-1/2 top-[70px] -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `repeating-conic-gradient(from 0deg, color-mix(in srgb, ${MAU.acc} 45%, transparent) 0 10deg, transparent 10deg 30deg)`, maskImage: 'radial-gradient(closest-side, black, transparent)' }} />
        <span className="chuoi-lua text-[110px] leading-none" aria-hidden>🔥</span>
        <p className="text-[38px] font-bold leading-none" style={{ ...HEAD, color: MAU.acc }}>{moc} ngày!</p>
        <p className="max-w-xs text-[15px]" style={{ color: MAU.ink }}>Em đã giữ chuỗi làm bài {moc} ngày liên tiếp. Tiếp tục nhé!</p>
        <NutHS onClick={() => setMoc(null)} className="mt-2">Tuyệt!</NutHS>
      </div>
    </div>,
    document.body,
  )
}
