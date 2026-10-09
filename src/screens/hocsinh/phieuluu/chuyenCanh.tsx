// CHUYỂN CẢNH app HS (Thùy 03/10: "từ chỗ chọn chế độ học vào world map vẫn chưa mượt — chỉnh hiệu ứng chuyển màn ở tất cả các màn").
// Cái làm giật KHÔNG phải hiệu ứng phóng mà là 3 KHOẢNG TRỐNG nối đuôi nhau: (1) tải chunk PhieuLuuHS (màn trắng) → (2) gọi RPC bản đồ (màn trống + chữ "Đang mở")
// → (3) ảnh thế giới/lục địa tải + giải mã DƠ ra giữa lúc đang hiện dần (nền biển rồi từng lục địa "nhảy" vào). Ở đây gom 3 thứ:
//  · nạp TRƯỚC (chunk + dữ liệu + ảnh) ngay khi em vào khu Học tập — lúc bấm đảo đã sẵn;
//  · ảnh giải mã xong rồi mới hiện màn (trần 1,5s — mạng chậm vẫn vào được);
//  · `ManCho`: 1 màn chờ DUY NHẤT dùng cho mọi chỗ đợi (Suspense · tải bản đồ · sinh lượt luyện) — cùng nền, cùng nhịp, không nhấp nháy giữa các kiểu chờ.
import { banDoPhieuLuu, type BanDoPL } from '../../../lib/phieuluu'
import { anhNenTheGioi, anhLucDia, viTriLucDia } from './ban2d/hinh2d'

const TUOI_MS = 25_000
const DEM = new Map<string, { p: Promise<BanDoPL>; t: number }>()

/** Bản đồ của môn: dùng bản đã nạp trước nếu còn tươi (<25s), không thì gọi mới. `moi` = bắt buộc gọi mới (quay lại từ màn đấu — dữ liệu vừa đổi). */
export function layBanDo(mon: string, moi = false): Promise<BanDoPL> {
  const c = DEM.get(mon)
  if (!moi && c && Date.now() - c.t < TUOI_MS) return c.p
  const p = banDoPhieuLuu(mon)
  DEM.set(mon, { p, t: Date.now() })
  p.catch(() => { if (DEM.get(mon)?.p === p) DEM.delete(mon) }) // lỗi thì đừng giữ — lần sau gọi lại thật
  return p
}

/** Chỉ cho trang soi (XemThat): nhồi dữ liệu có sẵn vào bộ nhớ nạp trước. */
export const datBanDoNap = (mon: string, d: BanDoPL) => DEM.set(mon, { p: Promise.resolve(d), t: Date.now() })

const DA_GIAI_MA = new Set<string>()
/** Tải + GIẢI MÃ ảnh trước khi hiện (decode() tránh khung hình đầu bị trắng). Quá `tran` ms thì thôi — không bao giờ kẹt màn. */
export function nhoAnh(urls: (string | null | undefined)[], tran = 1500): Promise<void> {
  const ds = urls.filter((u): u is string => !!u && !DA_GIAI_MA.has(u))
  if (!ds.length) return Promise.resolve()
  const lam = Promise.all(ds.map((u) => new Promise<void>((xong) => {
    const im = new Image(); im.src = u
    const ok = () => { DA_GIAI_MA.add(u); xong() }
    if (im.decode) im.decode().then(ok, ok); else { im.onload = ok; im.onerror = () => xong() }
  }))).then(() => undefined)
  return Promise.race([lam, new Promise<void>((xong) => setTimeout(xong, tran))])
}

/** Ảnh tầng THẾ GIỚI: nền biển + các lục địa rời. */
export const anhTheGioi = (): string[] => [anhNenTheGioi(), ...viTriLucDia().map((v) => anhLucDia(v.biome))].filter((u): u is string => !!u)

let daNapChunk = false
/** Nạp trước mọi thứ cho "Học theo chủ đề" của môn này. Gọi lúc rảnh (vào khu Học tập). An toàn gọi nhiều lần. */
export function napPhieuLuu(mon: string) {
  if (!daNapChunk) { daNapChunk = true; void import('./PhieuLuuHS').catch(() => { daNapChunk = false }) }
  layBanDo(mon).catch(() => undefined)
  void nhoAnh(anhTheGioi(), 8000)
}

const CSS = `
@keyframes cc-cho { 0%,25% { opacity: 0 } 100% { opacity: 1 } }
@keyframes cc-xoay { to { transform: rotate(360deg) } }
@media (prefers-reduced-motion: reduce) { .cc-xoay { animation: none !important } }
`
/** Màn chờ chung. Cùng nền với màn sau nó (--sk-page); chữ + vòng chỉ hiện nếu chờ > ~0,3s nên chờ ngắn thì không thấy gì nhấp nháy. */
export function ManCho({ chu = 'Đang mở bản đồ…' }: { chu?: string }) {
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-3" style={{ background: 'var(--sk-page)', color: 'var(--sk-muted)', fontFamily: 'var(--sk-font)' }}>
      <style>{CSS}</style>
      <span className="cc-xoay block h-7 w-7 rounded-full" style={{ border: '3px solid var(--sk-line)', borderTopColor: 'var(--sk-acc)', animation: 'cc-cho 1s ease-out both, cc-xoay .9s linear infinite' }} aria-hidden />
      <span className="text-[15.5px]" style={{ animation: 'cc-cho 1s ease-out both' }}>{chu}</span>
    </div>
  )
}
