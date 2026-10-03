// ============================================================================
// ChucMung — LỚP PHỦ chúc mừng: ĐẠT SAO MỚI (huy hiệu) · LÊN BẬC (rank). DON-HANG-GAMI-HS.md Đơn 1 ③ / Đơn 3 ④.
// "Đã xem" nhớ ở localStorage của máy (tiện ích từng máy, CLAUDE §2 — không phải dữ liệu nghiệp vụ): xem ở máy khác thì hiện lại
// 1 lần, vô hại. Mất storage (ẩn danh) ⇒ cùng lắm hiện lại, không bao giờ chặn màn.
// ============================================================================
import type { Album } from '../../../lib/huyhieu'
import { HinhHuyHieu, BieuTuongBac, KEYFRAMES } from './HinhGami'
import { anhRankChung, anhFxSaoMoi, chuongCua, mauHH, laThan, VANG, MAU_GAMI } from './hinh'

function doc<T>(k: string): T | null { try { const s = localStorage.getItem(k); return s ? (JSON.parse(s) as T) : null } catch { return null } }
function ghi(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* không có storage: bỏ qua */ } }

// ── Sao mới ──────────────────────────────────────────────────────────────────
export type SaoMoi = { key: string; ten: string; sao: number; exp: number; ban_cung: boolean }
const khoaSao = (al: Album) => `gami_xem_sao:${al.mon}:${al.mua}`
const maDat = (key: string, d: { sao: number; lan: number }) => `${key}:${d.sao}:${d.lan}`

// Sao CHƯA xem (lấy 1 cái cao nhất để chúc — đạt nhiều cùng lúc thì không dội 5 màn liên tiếp).
export function saoChuaXem(al: Album): SaoMoi | null {
  const da = new Set(doc<string[]>(khoaSao(al)) ?? [])
  let tot: (SaoMoi & { at: string }) | null = null
  for (const h of al.huy_hieu) for (const d of h.dat) {
    if (da.has(maDat(h.key, d))) continue
    const ts = al.thang_sao.find((s) => s.sao === d.sao)
    if (!tot || d.sao > tot.sao || (d.sao === tot.sao && d.dat_at > tot.at))
      tot = { key: h.key, ten: h.ten, sao: d.sao, exp: ts?.exp ?? 0, ban_cung: !!ts?.ban_cung, at: d.dat_at }
  }
  return tot
}
export function daXemHetSao(al: Album) { ghi(khoaSao(al), al.huy_hieu.flatMap((h) => h.dat.map((d) => maDat(h.key, d)))) }

// ── Lên bậc ──────────────────────────────────────────────────────────────────
const khoaBac = (mon: string) => `gami_xem_bac:${mon}`
// Trả bậc cần chúc (null = không). Sang mùa mới (bậc tụt) ⇒ ghi lại im lặng.
export function bacChuaXem(mon: string, bac: number): number | null {
  const cu = doc<number>(khoaBac(mon))
  if (cu !== null && bac < cu) { ghi(khoaBac(mon), bac); return null }
  if (cu === null ? bac > 1 : bac > cu) return bac
  if (cu === null) ghi(khoaBac(mon), bac)
  return null
}
export function daXemBac(mon: string, bac: number) { ghi(khoaBac(mon), bac) }

// ── Vỏ lớp phủ ───────────────────────────────────────────────────────────────
// Theo ảnh toàn cảnh Đơn 1 ③ (design/handoff/gami-v1/reference/man_album_dt_3.jpg, Thùy duyệt 30/09): nền tối toàn màn · chữ to
// font tiêu đề của style · hình giữa vầng sáng · nút "Tuyệt!" vàng cổ.
const CHU_HEAD = { fontFamily: 'var(--sk-font-head)' }
function Vo({ children, onDong }: { children: React.ReactNode; onDong: () => void }) {
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onDong}
      style={{ background: 'rgba(8,10,24,.8)', backdropFilter: 'blur(3px)', animation: 'gamiMo .25s ease-out' }}>
      <style>{KEYFRAMES}</style>
      <div className="relative flex w-full max-w-[380px] flex-col items-center text-center" style={{ color: MAU_GAMI.chu }} onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onDong} className="relative mt-6 h-[52px] w-[78%] rounded-2xl text-[22px] font-bold active:scale-[0.98]"
          style={{ ...CHU_HEAD, background: MAU_GAMI.nutVang, color: MAU_GAMI.nutVangChu, border: `1.5px solid ${MAU_GAMI.vanhSang}`, boxShadow: `0 0 18px ${VANG}88, inset 0 1px 0 rgba(255,255,255,.6)` }}>Tuyệt!</button>
      </div>
    </div>
  )
}
// Hình chúc mừng nằm GIỮA vầng sáng (fx PNG có thì dùng, chưa có thì quầng màu). Vầng sáng ~1.75× hình.
function HinhSang({ fx, nen, size, hieuUng, children }: { fx: string | null; nen: string; size: number; hieuUng: string; children: React.ReactNode }) {
  const v = Math.round(size * 1.6)
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: v, height: v,
        ...(fx ? { background: `url(${fx}) center/contain no-repeat` } : { background: `radial-gradient(circle, ${nen} 0%, transparent 65%)`, opacity: 0.6 }) }} />
      <div className="relative" style={{ animation: hieuUng }}>{children}</div>
    </div>
  )
}

export function ChucMungSao({ s, onDong }: { s: SaoMoi; onDong: () => void }) {
  return (
    <Vo onDong={onDong}>
      <p className="relative z-[2] mb-5 text-[38px] font-bold leading-tight" style={{ ...CHU_HEAD, color: MAU_GAMI.vanhSang, textShadow: '0 2px 0 rgba(0,0,0,.55), 0 0 14px rgba(0,0,0,.85)' }}>Huy hiệu mới</p>
      <HinhSang fx={anhFxSaoMoi()} nen={mauHH(s.key).dam} size={230} hieuUng="gamiBung .6s cubic-bezier(.2,.9,.3,1.3) both">
        <HinhHuyHieu hhKey={s.key} sao={s.sao} size={230} title={s.ten} />
      </HinhSang>
      <p className="relative z-[2] mt-3 text-[40px] font-bold leading-tight" style={{ ...CHU_HEAD, textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>{s.ten} <span style={{ color: MAU_GAMI.vanhSang }}>★{s.sao}</span></p>
      {s.exp > 0 && (
        <p className="relative mt-1 flex items-center gap-2.5 text-[26px] font-extrabold" style={{ color: MAU_GAMI.exp }}>
          <span aria-hidden className="h-px w-10" style={{ background: MAU_GAMI.exp }} />+{s.exp} EXP<span aria-hidden className="h-px w-10" style={{ background: MAU_GAMI.exp }} />
        </p>
      )}
      {s.ban_cung && <p className="relative mt-2 text-[14px] opacity-90">🎖 Thầy cô sẽ trao em bản cứng tận tay</p>}
    </Vo>
  )
}

export function ChucMungBac({ bac, ten, onDong }: { bac: number; ten: string; onDong: () => void }) {
  return (
    <Vo onDong={onDong}>
      <HinhSang fx={anhRankChung('len_bac')} nen={chuongCua(bac).dam} size={190} hieuUng="gamiBung .7s cubic-bezier(.2,.9,.3,1.3) both">
        <BieuTuongBac bac={bac} size={190} />
      </HinhSang>
      <p className="relative mt-5 text-[13px] font-bold uppercase tracking-[0.14em] opacity-80">{laThan(bac) ? 'Thành thần' : `Chương ${chuongCua(bac).ten}`}</p>
      <p className="relative z-[2] mt-1 text-[36px] font-bold leading-tight" style={{ ...CHU_HEAD, textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>Lên {ten}!</p>
    </Vo>
  )
}
