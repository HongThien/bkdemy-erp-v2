// ============================================================================
// ThanhTuuArt — "Thành tựu mùa này" vẽ bằng bộ ảnh hs-thanh-tuu-v1 (Chibi adventure fantasy, 07/10). Chỉ dùng khi style khai `anhTt` (RPG); style khác ⇒ ThanhTuuMoiView vẽ code.
// Cùng dữ liệu TtCuaToi (fn_thanh_tuu_cua_toi): đạt/chưa/số liệu do Postgres tính. Ảnh = khung + icon; chữ/số/thanh tiến độ/nút do code. Thẻ thường · sẵn sàng · đã nhận hết chỉ đổi brightness/glow.
// ============================================================================
import type { TtCuaToi, TtLoai, TtNhan } from '../../../lib/thanhtuu_moi'
import type { AnhTt } from '../skin/anhGiaoDien'
import { kieuKhungCat, RUOT } from '../skin/khung9'
import { HEAD, MAU } from '../skin/KhungHS'

const sl = (n: number) => n.toLocaleString('vi-VN')
type Bac = TtLoai['bac'][number]
type Buoc = { l: TtLoai; hien: Bac | null; chua: number }
const buoc = (l: TtLoai): Buoc => { const chua = l.bac.filter((b) => !b.dat); return { l, hien: chua[0] ?? null, chua: chua.length } }
const phanTram = (l: TtLoai, b: Bac) => (l.tien_do == null ? 0 : Math.max(0, Math.min(100, Math.round((100 * l.tien_do) / Math.max(1, b.nguong)))))

function Anh({ src, c, className = '' }: { src: string; c: number; className?: string }) {
  return <img src={src} alt="" draggable={false} className={`shrink-0 object-contain ${className}`} style={{ width: c, height: c }} />
}
// Nút Nhận quà: khung vàng, chữ TỐI trên mặt vàng
function NutNhan({ a, children, tat, onClick, cao = 44 }: { a: AnhTt; children: string; tat?: boolean; onClick?: () => void; cao?: number }) {
  return (
    <button onClick={onClick} disabled={tat} className="shrink-0 px-2 text-[15.5px] font-black active:scale-95 animate-pulse motion-reduce:animate-none"
      style={kieuKhungCat(a.nutNhan, 8, { minWidth: 102, minHeight: cao, color: MAU.accInk, background: MAU.acc, borderRadius: 10, opacity: tat ? 0.6 : 1, ...HEAD })}>{children}</button>
  )
}

function The({ a, x, onNhan, dangNhan }: { a: AnhTt; x: Buoc; onNhan?: (ma: string, bac: number) => void; dangNhan: string | null }) {
  const { l, hien } = x
  const tong = l.bac.length, xong = hien === null, nhan = !!hien?.co_the_nhan
  const pct = hien ? phanTram(l, hien) : 100
  const key = hien ? `${l.ma}-${hien.bac}` : ''
  const icon = l.an && l.tien_do == null ? null : (a.icon.theoMa[l.ma] ?? a.icon.huyHieu)   // ẩn chưa đạt: không lộ icon
  return (
    <div className="flex min-h-[145px] min-w-0 flex-col gap-1.5 px-1.5"
      style={kieuKhungCat(a.thanhTuu, 12, { background: RUOT, borderRadius: 14, filter: nhan ? 'brightness(1.15) drop-shadow(0 0 10px var(--sk-acc))' : xong ? 'brightness(0.8)' : undefined })}>
      <div className="flex items-start gap-2.5">
        <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full md:h-[72px] md:w-[72px]"
          style={{ background: 'rgba(8,18,37,0.9)', border: `2px solid ${nhan || xong ? MAU.acc : MAU.line}` }} aria-hidden>
          {icon ? <Anh src={icon} c={44} className="md:!h-[58px] md:!w-[58px]" /> : <span className="text-[28.5px]">🔒</span>}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-extrabold leading-tight" style={HEAD}>{l.ten}</span>
          <span className="mt-0.5 block text-[14px] leading-snug" style={{ color: MAU.muted }}>{l.mo_ta}</span>
        </span>
        <span className="shrink-0 text-[13px] font-bold tabular-nums" style={{ color: MAU.muted }}>{xong ? `${tong}/${tong}` : `Bậc ${hien!.bac}/${tong}`}</span>
      </div>
      {xong ? (
        <p className="flex min-h-[44px] items-center gap-2 text-[14.5px] font-bold" style={{ color: MAU.dung }}><span className="text-[20px]">✓</span>Đã nhận hết {tong} bậc của mùa này</p>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(8,18,37,0.9)', border: `1px solid ${MAU.line}` }}>
              <span className="block h-full rounded-full" style={{ width: `${nhan ? 100 : pct}%`, background: MAU.acc }} />
            </span>
            <span className="shrink-0 text-[13px] font-bold tabular-nums">{l.tien_do == null ? `Mục tiêu ${sl(hien!.nguong)} ${l.don_vi}` : `${sl(Math.min(l.tien_do, hien!.nguong))}/${sl(hien!.nguong)} ${l.don_vi}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 text-[14.5px] font-bold" style={{ color: MAU.acc }}>
              {hien!.xu > 0 ? <>Quà: +{hien!.xu} xu</> : <><Anh src={a.icon.tinhTheExp} c={26} />+{sl(hien!.exp)} EXP</>}
              {x.chua > 1 && <span className="font-medium" style={{ color: MAU.muted }}> · còn {x.chua - 1} bậc nữa</span>}
            </span>
            {nhan
              ? <NutNhan a={a} tat={dangNhan === key} onClick={() => onNhan?.(l.ma, hien!.bac)}>{dangNhan === key ? 'Đang nhận…' : 'Nhận quà'}</NutNhan>
              : <span className="flex min-h-[36px] shrink-0 items-center rounded-full px-3 text-[13px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Chưa đạt</span>}
          </div>
        </>
      )}
    </div>
  )
}

export function ThanhTuuViewArt({ d, a, onNhan, dangNhan = null }: { d: TtCuaToi; a: AnhTt; onNhan?: (ma: string, bac: number) => void; dangNhan?: string | null }) {
  const diem = (x: Buoc) => (x.hien === null ? -1 : x.hien.co_the_nhan ? 1000 : phanTram(x.l, x.hien))
  const ds = d.loai.filter((l) => l.san_sang).map(buoc).sort((p, q) => diem(q) - diem(p))
  const sapCo = d.loai.filter((l) => !l.san_sang)
  return (
    <section className="flex flex-col gap-3">
      <div className="flex min-h-[100px] items-center gap-3 px-2" style={kieuKhungCat(a.tongKet, 14, { background: RUOT, borderRadius: 16, filter: d.cho_nhan > 0 ? 'drop-shadow(0 0 10px var(--sk-acc))' : undefined })}>
        <Anh src={a.icon.huyHieu} c={56} className="md:!h-16 md:!w-16" />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold uppercase tracking-[0.06em]" style={{ color: MAU.muted }}>Thành tựu mùa {d.mua ?? ''}</span>
          <span className="flex items-center gap-1.5 text-[26.5px] font-black leading-tight tabular-nums" style={HEAD}>
            <Anh src={a.icon.tinhTheExp} c={30} />{sl(d.tong_exp_mua)} <span className="text-[14.5px] font-bold" style={{ color: MAU.muted }}>EXP đã nhận</span>
          </span>
          <span className="block text-[12.5px] leading-snug" style={{ color: d.cho_nhan > 0 ? MAU.acc : MAU.muted, fontWeight: d.cho_nhan > 0 ? 700 : 400 }}>
            {d.cho_nhan > 0 ? `${d.cho_nhan} thành tựu đang chờ em nhận quà!` : 'Mỗi bậc thưởng một lần trong mùa · mùa mới bắt đầu 01/07'}
          </span>
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">{ds.map((x) => <The key={x.l.ma} a={a} x={x} onNhan={onNhan} dangNhan={dangNhan} />)}</div>
      {sapCo.length > 0 && (
        <>
          <p className="mt-1 px-1 text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: MAU.muted }}>Sắp có</p>
          <div className="grid gap-2 md:grid-cols-2">
            {sapCo.map((l) => (
              <div key={l.ma} className="flex min-h-[64px] items-center gap-2.5 px-2" style={kieuKhungCat(a.thanhTuu, 10, { background: RUOT, borderRadius: 12, filter: 'brightness(0.75)' })}>
                <span className="text-[26.5px]" aria-hidden>🔒</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold" style={HEAD}>{l.ten}</span>
                  <span className="block truncate text-[12.5px]" style={{ color: MAU.muted }}>{l.mo_ta}</span>
                </span>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-bold" style={{ border: `1px solid ${MAU.line}`, color: MAU.muted }}>Sắp có</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export function MungThanhTuuArt({ a, nhan, onDong }: { a: AnhTt; nhan: TtNhan; onDong: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-5 pb-6 sm:items-center" onClick={onDong}>
      <div className="relative w-full max-w-[440px] text-center" onClick={(e) => e.stopPropagation()}
        style={kieuKhungCat(a.nhanQua, 16, { background: RUOT, borderRadius: 22, padding: '14px 20px 20px' })}>
        <button onClick={onDong} aria-label="Đóng" className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-[22px] font-bold" style={{ color: MAU.muted }}>✕</button>
        <Anh src={a.icon.theoMa[nhan.ma] ?? a.icon.huyHieu} c={96} className="mx-auto" />
        <p className="mt-1 text-[26.5px] font-extrabold" style={{ ...HEAD, color: MAU.acc }}>Đã nhận quà!</p>
        <p className="mt-1 text-[15.5px] font-bold">{nhan.ten} · bậc {nhan.bac}</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[24px] font-black" style={{ color: MAU.acc }}>
          {nhan.xu > 0 ? `+${nhan.xu} xu` : <><Anh src={a.icon.tinhTheExp} c={34} />+{sl(nhan.exp)} EXP</>}
        </p>
        {nhan.xu === 0 && <p className="mt-1 text-[14px]" style={{ color: MAU.muted }}>EXP được đổi ra xu ngay trong Ví.</p>}
        <div className="mt-4 flex justify-center"><NutNhan a={a} cao={52} onClick={onDong}>Tuyệt! ♡</NutNhan></div>
      </div>
    </div>
  )
}
