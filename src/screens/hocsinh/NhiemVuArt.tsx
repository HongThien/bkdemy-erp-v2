// ============================================================================
// NhiemVuArt — màn NHIỆM VỤ vẽ bằng bộ ảnh hs-nhiem-vu-v1 (Chibi adventure fantasy, 07/10). Chỉ dùng khi style khai `anhNv` (RPG); style khác ⇒ NhiemVuView (code).
// Cùng dữ liệu NhiemVuCuaToi (fn_hs_nhiem_vu_cua_toi) — KHÔNG đổi luật/kinh tế, chỉ đổi cách vẽ. Chữ/số/tick/thanh tiến độ/ô lượt do code; ảnh chỉ là khung + icon.
// ============================================================================
import type { ReactNode } from 'react'
import type { NhiemVuCuaToi } from '../../lib/nhiemvu'
import type { AnhNv } from './skin/anhGiaoDien'
import { kieuKhungCat, RUOT } from './skin/khung9'
import { HEAD, MAU } from './skin/KhungHS'

const sl = (n: number) => n.toLocaleString('vi-VN')
const homNay = () => new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Ho_Chi_Minh' })

function Anh({ src, c, className = '' }: { src: string; c: number; className?: string }) {
  return <img src={src} alt="" draggable={false} className={`shrink-0 object-contain ${className}`} style={{ width: c, height: c }} />
}
function Tick({ xong }: { xong: boolean }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] font-black" aria-label={xong ? 'Đã xong' : 'Chưa xong'}
      style={xong ? { border: `2px solid ${MAU.dung}`, color: MAU.dung, boxShadow: `0 0 8px ${MAU.dung}` } : { border: `1.5px solid ${MAU.line}`, background: 'rgba(8,18,37,0.6)' }}>{xong ? '✓' : ''}</span>
  )
}
// Thưởng: ngọc ĐHT + tinh thể EXP kèm số
function Thuong({ a, exp, dht, className = '' }: { a: AnhNv; exp: number; dht: number; className?: string }) {
  return (
    <span className={`flex shrink-0 flex-row items-center gap-x-4 text-[15px] font-extrabold leading-none tabular-nums sm:flex-col sm:items-end sm:gap-1 md:text-[17px] ${className}`}>
      <span className="flex items-center gap-1" style={{ color: MAU.acc }}><Anh src={a.icon.tinhTheExp} c={30} />+{exp} EXP</span>
      <span className="flex items-center gap-1" style={{ color: MAU.muted }}><Anh src={a.icon.ngocDht} c={30} />+{dht} ĐHT</span>
    </span>
  )
}
function Thanh({ hien, can }: { hien: number; can: number }) {
  const pct = Math.min(100, Math.round((100 * hien) / Math.max(1, can)))
  return (
    <span className="mt-1.5 flex items-center gap-2">
      <span className="h-3.5 min-w-0 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(8,18,37,0.9)', border: `1px solid ${MAU.line}` }}>
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: MAU.acc }} />
      </span>
      <span className="shrink-0 text-[14px] font-bold tabular-nums" style={{ color: MAU.muted }}>{Math.min(hien, can)}/{can}</span>
    </span>
  )
}

/** Khối: khung_khoi + dải tiêu đề (icon + tên + phụ) + nội dung */
function Khoi({ a, icon, ten, phu, children }: { a: AnhNv; icon: string; ten: string; phu?: ReactNode; children: ReactNode }) {
  return (
    <section className="min-w-0 p-0" style={kieuKhungCat(a.khoi, 14, { background: RUOT, borderRadius: 18 })}>
      <div className="flex items-center gap-3 px-2.5 pt-1" style={kieuKhungCat(a.tieuDe, 10, { minHeight: 84, background: 'rgba(60,40,20,0.55)', borderRadius: 12, margin: '4px 4px 0' })}>
        <Anh src={icon} c={64} className="-my-1 md:!h-[76px] md:!w-[76px]" />
        <h2 className="min-w-0 flex-1 sm:truncate text-[19px] font-extrabold uppercase leading-tight tracking-[0.03em] sm:text-[23px] md:text-[28px]" style={{ ...HEAD, textTransform: 'uppercase' }}>{ten}</h2>
        {phu && <span className="shrink-0 text-right text-[14.5px] font-semibold leading-tight md:text-[16px]" style={{ color: MAU.muted }}>{phu}</span>}
      </div>
      <div className="flex flex-col gap-3 px-3 pb-4 pt-3">{children}</div>
    </section>
  )
}
function Dong({ a, icon, ten, mota, xong, hien, can, exp, dht }: { a: AnhNv; icon: string; ten: string; mota: string; xong: boolean; hien: number; can: number; exp: number; dht: number }) {
  return (
    <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 px-2 sm:flex-nowrap" style={kieuKhungCat(a.nhiemVu, 8, { minHeight: 120, background: RUOT, borderRadius: 14 })}>
      <Anh src={icon} c={68} className="md:!h-[92px] md:!w-[92px]" />
      <span className="min-w-0 flex-1 basis-[150px] py-2 pr-9 sm:pr-0">
        <span className="block text-[18px] font-bold leading-tight md:text-[21px]">{ten}</span>
        <span className="mt-0.5 block text-[14px] leading-snug md:text-[15px]" style={{ color: MAU.muted }}>{mota}</span>
        <Thanh hien={xong ? can : hien} can={can} />
      </span>
      <Thuong a={a} exp={exp} dht={dht} className="w-full justify-start sm:w-auto" />
      <span className="absolute right-2 top-2 sm:static"><Tick xong={xong} /></span>
    </div>
  )
}
function Nut({ a, icon, children, on, tat, onClick }: { a: AnhNv; icon: string; children: ReactNode; on?: boolean; tat?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={tat} className="flex min-h-[68px] items-center gap-2.5 px-2.5 text-left active:scale-[0.98]"
      style={kieuKhungCat(a.nut, 12, { background: on ? 'rgba(60,40,20,0.7)' : RUOT, borderRadius: 14, opacity: tat ? 0.48 : 1, filter: on ? undefined : 'brightness(0.85)' })}>
      <Anh src={icon} c={44} className="md:!h-14 md:!w-14" />
      <span className="min-w-0 flex-1 text-[16.5px] font-extrabold leading-tight md:text-[18px]" style={{ color: on ? MAU.acc : MAU.ink }}>{children}</span>
    </button>
  )
}

/** Header gọn: ‹ · sổ nhiệm vụ · tên màn + phụ đề */
export function DauNhiemVuArt({ a, mon, onBack }: { a: AnhNv; mon: string; onBack: () => void }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <button onClick={onBack} aria-label="Quay lại" className="flex h-12 w-12 shrink-0 items-center justify-center text-[26px] font-bold active:scale-95"
        style={{ background: 'rgba(8,18,37,0.85)', border: `2px solid ${MAU.acc}`, color: MAU.acc, borderRadius: 999 }}>‹</button>
      <Anh src={a.icon.so} c={64} className="md:!h-[96px] md:!w-[96px]" />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[26px] font-extrabold md:text-[34px]" style={HEAD}>Nhiệm vụ {mon}</span>
        <span className="block text-[14px] md:text-[16px]" style={{ color: MAU.muted }}>Luyện dạng yếu mỗi ngày → nhận EXP (đổi ra xu) và điểm học tập (để chơi game).</span>
      </span>
    </div>
  )
}

export function NhiemVuViewArt({ d, a, onLuyenYeu, onVongQuay }: { d: NhiemVuCuaToi; a: AnhNv; onLuyenYeu?: () => void; onVongQuay?: () => void }) {
  if (!d.mo) {
    return (
      <div className="mx-auto mt-10 flex w-full max-w-[420px] flex-col items-center px-5 py-6 text-center" style={kieuKhungCat(a.khoi, 14, { background: RUOT, borderRadius: 18 })}>
        <span className="relative flex h-[120px] w-[120px] items-center justify-center"><Anh src={a.icon.tuan} c={96} /><span aria-hidden className="absolute bottom-1 right-1 text-[30px]">🔒</span></span>
        <p className="mt-3 text-[21px] font-bold leading-snug" style={{ ...HEAD, color: MAU.acc }}>Nhiệm vụ mở từ ngày {d.bat_dau.split('-').reverse().slice(0, 2).join('/')} — hẹn em nhé!</p>
      </div>
    )
  }
  const c = d.cau_hinh, dht = d.dht
  const nayDay = d.ngay.luot_hom_nay >= c.lan_ngay
  const quayDuoc = d.vong_quay.du && !d.vong_quay.da_quay
  return (
    <div className="grid gap-3">
      {/* Dải ví: ngọc ĐHT · EXP tháng */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-1 sm:flex-nowrap" style={kieuKhungCat(a.vi, 12, { minHeight: 128, background: RUOT, borderRadius: 16 })}>
        <Anh src={a.icon.ngocDht} c={76} className="md:!h-[100px] md:!w-[100px]" />
        <span className="min-w-0 flex-1 basis-[150px]">
          <span className="block text-[14px] font-bold uppercase tracking-[0.06em]" style={{ color: MAU.muted }}>Điểm học tập (ĐHT)</span>
          <span className="block text-[38px] font-black leading-none tabular-nums md:text-[46px]" style={{ ...HEAD }}>{sl(dht.so_du)}<span className="text-[17px] font-bold" style={{ color: MAU.muted }}> / {sl(dht.tran)}</span></span>
          <span className="mt-1.5 block text-[13.5px] leading-snug md:text-[14.5px]" style={{ color: MAU.muted }}>Dùng để chơi game · tháng này +{sl(dht.kiem_thang)}{dht.mat_do_vuot_tran > 0 ? ` · kho đầy, ${sl(dht.mat_do_vuot_tran)} điểm không cộng thêm được` : ''}</span>
        </span>
        <span className="flex w-full shrink-0 items-center gap-2 pl-[92px] text-[13.5px] leading-snug sm:w-auto sm:pl-0 sm:text-right" style={{ color: MAU.muted }}>
          <span>EXP nhiệm vụ tháng<br /><b className="text-[26px]" style={{ ...HEAD, color: MAU.acc }}>{sl(d.exp_thang)}</b><span>/{sl(c.tran_exp)}</span></span>
          <Anh src={a.icon.tinhTheExp} c={56} className="hidden sm:block" />
        </span>
      </div>

      <div className="grid items-start gap-3 md:grid-cols-2">
        <Khoi a={a} icon={a.icon.ngay} ten="Hôm nay" phu={<span className="hidden first-letter:uppercase sm:inline">{homNay()}</span>}>
          <div className="flex flex-col gap-3 px-2.5 py-3" style={kieuKhungCat(a.nhiemVu, 8, { background: RUOT, borderRadius: 14 })}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap">
            <Anh src={a.icon.luyenYeu} c={76} className="md:!h-[116px] md:!w-[116px]" />
            <span className="min-w-0 flex-1 basis-[150px]">
              <span className="block text-[19px] font-bold leading-tight md:text-[22px]">Luyện dạng yếu</span>
              <span className="mt-0.5 block text-[14px] leading-snug md:text-[15px]" style={{ color: MAU.muted }}>Mỗi lượt đúng từ {Math.round(c.dat_ti_le * 10)}/10 câu trở lên được thưởng · tối đa {c.lan_ngay} lượt mỗi ngày</span>
              <span className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${c.lan_ngay}, minmax(0, 1fr))` }}>
                {Array.from({ length: c.lan_ngay }, (_, i) => {
                  const xong = i < d.ngay.luot_hom_nay
                  return (
                    <span key={i} className="flex h-11 items-center justify-center rounded-full text-[16px] font-extrabold"
                      style={xong ? { background: 'rgba(8,18,37,0.9)', border: `2px solid ${MAU.acc}`, color: MAU.acc, boxShadow: '0 0 8px var(--sk-acc)' } : { background: 'rgba(8,18,37,0.7)', border: `1px dashed ${MAU.line}`, color: MAU.muted }}>
                      {xong ? '✓' : i + 1}
                    </span>
                  )
                })}
              </span>
            </span>
            <Thuong a={a} exp={c.exp_luot} dht={c.dht_luot} className="w-full justify-start sm:w-auto" />
            </div>
            {onLuyenYeu && <Nut a={a} icon={a.icon.luyenYeu} on onClick={onLuyenYeu}>Làm luôn ›</Nut>}
          </div>
          <p className="px-1 text-[14.5px] font-semibold" style={{ color: nayDay ? MAU.dung : MAU.muted }}>
            {nayDay ? 'Đã đủ thưởng hôm nay — luyện thêm vẫn tốt cho em nhé!' : `Hôm nay đã đạt ${d.ngay.luot_hom_nay}/${c.lan_ngay} lượt`}
          </p>
          <div className="grid gap-2">
            <Nut a={a} icon={a.icon.quay} on={quayDuoc} tat={!onVongQuay || !quayDuoc} onClick={onVongQuay}>
              {d.vong_quay.da_quay ? 'Hôm nay đã quay' : d.vong_quay.du ? 'Quay may mắn ›' : 'Có 1 lượt đạt để quay may mắn'}
            </Nut>
          </div>
        </Khoi>

        <div className="grid gap-3">
          <Khoi a={a} icon={a.icon.tuan} ten="Nhiệm vụ tuần" phu={<b className="text-[16px]" style={{ ...HEAD, color: MAU.ink }}>Tuần {d.tuan_so}</b>}>
            <Dong a={a} icon={a.icon.chamDeu} ten="Chăm đều" mota={`Có lượt đạt ở ${c.w1_ngay} ngày khác nhau trong tuần`} xong={d.tuan.w1_xong} hien={d.tuan.ngay_co_luot} can={c.w1_ngay} exp={c.w1_exp} dht={c.w1_dht} />
            <Dong a={a} icon={a.icon.luyenNhieu} ten="Luyện nhiều" mota={`Tổng ${c.w2_luot} lượt đạt trong tuần`} xong={d.tuan.w2_xong} hien={d.tuan.luot} can={c.w2_luot} exp={c.w2_exp} dht={c.w2_dht} />
            <p className="px-1 text-[13.5px] leading-snug" style={{ color: MAU.muted }}>Tuần tính theo 4 khối ngày của tháng: 1–7 · 8–14 · 15–21 · 22 đến hết tháng.</p>
          </Khoi>
          <Khoi a={a} icon={a.icon.thang} ten="Nhiệm vụ tháng">
            <Dong a={a} icon={a.icon.benBi} ten="Bền bỉ cả tháng" mota={`Có lượt đạt ở ${c.m1_ngay} ngày trong tháng`} xong={d.thang.m1_xong} hien={d.thang.ngay_co_luot} can={c.m1_ngay} exp={c.m1_exp} dht={c.m1_dht} />
          </Khoi>
        </div>
      </div>
    </div>
  )
}
