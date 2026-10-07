// KHU HỌC TẬP (spec-che-do-game.md §7 — Thùy chốt 03/10): ô "Tự luyện" ngoài Home đổi thành "Học tập", bấm vào ra 5 ô (kiểu 2, như lưới Home):
//   Học theo chủ đề (bản đồ phiêu lưu) · Luyện dạng yếu (80% dạng yếu / 20% ngẫu nhiên) · Đấu trường BK (PvP + PvE) · Chinh phục BK (leo tháp) · Giải Vô địch BK.
// Đấu trường + Chinh phục = khung game 6 chế độ (src/dautu, chung mọi môn) NHÚNG bằng khung (dautu.html?nhung=1) — bản DEMO: game còn hồ sơ theo máy,
// khi ghép thật sẽ dùng tài khoản HS + dựng lại bằng KhungHS (nợ ghi ở HANDOFF mục Đấu Từ).
// Giao diện (Thùy 03/10 tối): kiểu GAME CHIBI — 5 ô = 5 HÒN ĐẢO trôi nổi trên bầu trời sao (Skin.hocTap: nền + ảnh đảo; style không khai ⇒ lưới ô thường).
// Ảnh đảo + nền = kit hs-hoc-tap-v2 (Đơn 14 Kit B, Thùy duyệt 03/10): mỗi đảo 1 PNG trọn công trình; đường nối + chữ do code.
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { rankBat } from '../phieuluu/coBat'
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, NhomHS, NutHS, TheHS, THE_TRON, useManDoc, useMonHS } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { khoiCuaHS } from '../../../lib/tuluyen'
import { anhDauNv, tenNv, type NvId } from '../skin/nhanVat'

type OHocTap = { id: string; ten: string; sub: string; onClick: () => void; nhan?: string }

/** Ô kiểu 2 (icon trong khối bo tròn + tiêu đề + 1 dòng phụ + chevron) — lưới như Home. */
function LuoiO({ ds }: { ds: OHocTap[] }) {
  const skin = laySkin(null)
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
      {ds.map((o) => {
        const anh = skin.anhO?.[o.id]
        return (
          <TheHS key={o.id} onClick={o.onClick} className="relative flex min-h-[150px] flex-col items-start gap-2 p-3.5 md:min-h-[190px] md:p-4">
            <span className="flex h-14 w-14 items-center justify-center md:h-[72px] md:w-[72px]" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius)', background: 'var(--sk-surface2)' }}>
              {anh ? <img src={anh} alt="" className="h-11 w-11 object-contain md:h-14 md:w-14" />
                : <span className="text-[26px] leading-none" style={{ color: 'var(--sk-acc)' }} aria-hidden>{skin.dauThayIcon ?? '✦'}</span>}
            </span>
            <span className="text-[16px] font-bold leading-tight md:text-[19px]" style={HEAD}>{o.ten}</span>
            <span className="line-clamp-2 pr-5 text-[12px] leading-snug md:text-[13.5px]" style={{ color: MAU.muted }}>{o.sub}</span>
            {o.nhan && <span className="absolute right-2.5 top-2.5"><NhanHS>{o.nhan}</NhanHS></span>}
            <span className="absolute bottom-2.5 right-3 text-[18px]" style={{ color: MAU.muted }} aria-hidden>›</span>
          </TheHS>
        )
      })}
    </div>
  )
}

// BỐ CỤC theo kit hs-hoc-tap-v2 DESIGN.md mục 3: [tâm x %, tâm y %, bề rộng %] của PHẦN NHÌN THẤY của đảo, trong SÂN 16:9 (ngang) / 9:16 (dọc).
// Sân = hình chữ nhật đúng tỉ lệ lớn nhất vừa màn (contain) ⇒ đảo không méo/không lệch khi màn khác tỉ lệ; nền vũ trụ phủ kín cả màn (cover).
// Dọc: chưa có reference — đảo giữa ở trên + 2 hàng đôi (gợi ý của DESIGN.md mục 4).
const VT_NGANG: Record<string, [number, number, number]> = { hoc_chu_de: [51, 45, 33], dau_truong: [17, 35, 22], chinh_phuc: [85, 30, 14], luyen_yeu: [23, 73, 22], giai_vo_dich: [78, 76, 21] }
const VT_DOC: Record<string, [number, number, number]> = { hoc_chu_de: [50, 21, 58], dau_truong: [26, 52, 40], chinh_phuc: [74, 51, 25], luyen_yeu: [26, 80, 40], giai_vo_dich: [74, 81, 39] }
const CSS_DAO = `
@keyframes ht-noi { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-1.6%) } }
@keyframes ht-chay { to { stroke-dashoffset: -40 } }
.ht-dao { animation: ht-noi 5s ease-in-out infinite; transition: filter .2s }
.ht-o:hover .ht-dao, .ht-o:focus-visible .ht-dao { filter: brightness(1.12) drop-shadow(0 0 16px rgba(255,216,106,.7)) }
.ht-o:active .ht-dao { filter: brightness(1.22) }
.ht-noi-sang { animation: ht-chay 2.4s linear infinite }
@keyframes ht-hien { from { opacity: 0; transform: scale(1.06) } to { opacity: 1; transform: none } }
.ht-hien { animation: ht-hien .45s ease-out both }
@media (prefers-reduced-motion: reduce) { .ht-dao, .ht-noi-sang, .ht-hien { animation: none } }
`
export const CHU_NOI = { textShadow: '0 0 3px var(--sk-bg), 0 0 6px var(--sk-bg), 0 2px 10px var(--sk-bg)' }
const HOP_MAC_DINH = { x0: 0, y0: 0, x1: 1, y1: 1 }

/** Sân tỉ lệ cố định lớn nhất vừa khung (contain), đơn vị px. */
export function useSan(doc: boolean) {
  // ref dạng HÀM: khung bị gỡ rồi gắn lại (vd Chinh phục BK: vào game rồi lùi về) ⇒ đo lại khung MỚI, không kẹt kích thước 0 của khung cũ
  const [el, ref] = useState<HTMLDivElement | null>(null)
  const [kt, setKt] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    if (!el) return
    const f = () => { if (el.isConnected) setKt({ w: el.clientWidth, h: el.clientHeight }) }; f()
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect()
  }, [el])
  const tl = doc ? 9 / 16 : 16 / 9
  const w = Math.min(kt.w, kt.h * tl), h = w / tl
  return { ref, san: { w, h, x: (kt.w - w) / 2, y: (kt.h - h) / 2 } }
}

/** Chuyển cảnh kiểu world map → lục địa: phóng vào tâm đảo vừa bấm + mờ dần, xong mới gọi màn kế (màn kế tự hiện dần). Giảm chuyển động ⇒ chuyển ngay. */
const MS_PHONG = 480
function TroiDao({ ds, dao, hop }: { ds: OHocTap[]; dao: Record<string, string>; hop?: Record<string, { x0: number; y0: number; x1: number; y1: number }> }) {
  const doc = useManDoc()
  const { ref, san } = useSan(doc)
  const [phong, setPhong] = useState<{ x: number; y: number } | null>(null)
  const bam = (d: { cx: number; cy: number; o: OHocTap }) => {
    if (phong) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { d.o.onClick(); return }
    setPhong({ x: d.cx, y: d.cy }); window.setTimeout(d.o.onClick, MS_PHONG)
  }
  const VT = doc ? VT_DOC : VT_NGANG
  // Khung PNG (vuông) của từng đảo: rộng sao cho PHẦN NHÌN THẤY = w% sân, đặt sao cho tâm phần nhìn thấy = (x, y)
  const dat = ds.map((o) => {
    const [x, y, w] = VT[o.id] ?? [50, 50, 20], hp = hop?.[o.id] ?? HOP_MAC_DINH
    const khung = (w / 100) * san.w / (hp.x1 - hp.x0)
    const cx = san.x + (x / 100) * san.w, cy = san.y + (y / 100) * san.h
    return { o, khung, left: cx - ((hp.x0 + hp.x1) / 2) * khung, top: cy - ((hp.y0 + hp.y1) / 2) * khung, cx, cy, day: cy + ((hp.y1 - hp.y0) / 2) * khung }
  })
  const giua = dat.find((d) => d.o.id === 'hoc_chu_de')
  return (
    <div ref={ref} className="ht-hien absolute inset-0" style={phong ? { transformOrigin: `${phong.x}px ${phong.y}px`, transform: 'scale(2.6)', opacity: 0, transition: `transform ${MS_PHONG}ms cubic-bezier(.55,0,.85,.35), opacity ${MS_PHONG}ms ease-in`, animation: 'none' } : undefined}>
      <style>{CSS_DAO}</style>
      {san.w > 0 && (
        <>
          {/* đường nối ánh sáng: đảo giữa → từng đảo vệ tinh, đầu đường giấu dưới mép đảo (DESIGN.md: code vẽ, không nằm trong ảnh) */}
          {giua && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="ht-noi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="rgba(255,216,106,.95)" /><stop offset="1" stopColor="rgba(117,241,255,.95)" /></linearGradient>
                <filter id="ht-sang" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
              </defs>
              {dat.filter((d) => d !== giua).map((d) => {
                const mx = (giua.cx + d.cx) / 2, my = (giua.cy + d.cy) / 2 + san.h * 0.06
                const p = `M${giua.cx},${giua.cy} Q${mx},${my} ${d.cx},${d.cy}`
                return (
                  <g key={d.o.id}>
                    <path d={p} fill="none" stroke="url(#ht-noi)" strokeWidth={6} opacity={0.45} filter="url(#ht-sang)" />
                    <path d={p} fill="none" stroke="url(#ht-noi)" strokeWidth={1.8} opacity={0.9} />
                    <path className="ht-noi-sang" d={p} fill="none" stroke="rgba(255,244,216,.9)" strokeWidth={2.2} strokeDasharray="4 36" strokeLinecap="round" />
                  </g>
                )
              })}
            </svg>
          )}
          {dat.map((d, i) => (
            <button key={d.o.id} onClick={() => bam(d)} className="ht-o absolute outline-none" aria-label={`${d.o.ten}: ${d.o.sub}`}
              style={{ left: d.left, top: d.top, width: d.khung, height: d.khung }}>
              <span className="ht-dao block h-full w-full" style={{ animationDelay: `${-i * 1.1}s` }}>
                {dao[d.o.id] && <img src={dao[d.o.id]} alt="" draggable={false} className="block h-full w-full select-none" />}
              </span>
            </button>
          ))}
          {/* tên + chú thích ngay dưới phần nhìn thấy của đảo — lớp riêng trên mọi đảo (không bị đảo khác che) */}
          {dat.map((d) => (
            <button key={'n' + d.o.id} onClick={() => bam(d)} tabIndex={-1} className="absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: d.cx, top: d.day - san.h * 0.012, maxWidth: Math.max(160, san.w * 0.24) }}>
              <span className={`block text-center font-bold leading-tight ${d === giua ? 'text-[19px] md:text-[26px]' : 'text-[15px] md:text-[20px]'}`} style={{ ...HEAD, ...CHU_NOI, color: 'var(--sk-ink)' }}>{d.o.ten}</span>
              <span className="mt-0.5 block text-center text-[11px] leading-snug md:text-[13.5px]" style={{ ...CHU_NOI, color: 'var(--sk-acc)' }}>{d.o.sub}</span>
            </button>
          ))}
        </>
      )}
    </div>
  )
}

export function HocTapHS({ onNap, onBack, onChuDe, onYeu, onDauTruong, onChinhPhuc, onGiai, onNhiemVu, onRank, nhanVat, onDoiNhanVat }: {
  onBack: () => void; onChuDe: () => void; onYeu: () => void; onDauTruong: () => void; onChinhPhuc: () => void; onGiai: () => void
  onNhiemVu?: () => void; onRank?: () => void
  /** nhân vật chính đang dùng + mở màn đổi nhân vật (nút ở đầu trang) */
  nhanVat?: NvId | null; onDoiNhanVat?: () => void
  /** gọi 1 lần lúc rảnh sau khi vào khu: nạp trước màn hay vào kế tiếp (chunk + bản đồ + ảnh) để lúc bấm đảo không còn khoảng trống (phieuluu/chuyenCanh.ts) */
  onNap?: () => void
}) {
  useEffect(() => { if (!onNap) return; const id = window.setTimeout(onNap, 300); return () => window.clearTimeout(id) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const nutNv = onDoiNhanVat && (
    <button onClick={onDoiNhanVat} className="flex items-center gap-1.5 py-1 pl-1 pr-3 text-[13px] font-bold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }} aria-label="Đổi nhân vật">
      {nhanVat ? <span className="relative block h-8 w-8 overflow-hidden rounded-full" style={{ background: 'var(--sk-surface2)' }}><img src={anhDauNv(nhanVat, 'dung_1')} alt="" className="absolute left-1/2 top-0 w-[150%] max-w-none -translate-x-1/2" /></span> : null}
      {nhanVat ? tenNv(nhanVat) : 'Chọn nhân vật'}
    </button>
  )
  const ds: OHocTap[] = [
    { id: 'hoc_chu_de', ten: 'Học theo chủ đề', sub: 'Đánh bại Ác quỷ "Phi Phai", giải cứu BK', onClick: onChuDe },
    { id: 'luyen_yeu', ten: 'Luyện dạng yếu', sub: 'Tập trung sửa dạng em còn yếu', onClick: onYeu },
    { id: 'dau_truong', ten: 'Đấu trường BK', sub: 'Ai là người giỏi nhất', onClick: onDauTruong },
    { id: 'chinh_phuc', ten: 'Chinh phục BK', sub: 'Nơi một huyền thoại sinh ra', onClick: onChinhPhuc },
    { id: 'giai_vo_dich', ten: 'Giải Vô địch BK', sub: 'Con đường của nhà vô địch', onClick: onGiai },
  ]
  const ht = laySkin(null).hocTap
  const doc = useManDoc()
  if (ht) return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: (doc && ht.nenDoc) || ht.nen, color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <TroiDao ds={ds} dao={ht.dao} hop={ht.hop} />
      <div className="pointer-events-none absolute left-0 right-0 top-0 px-4 pt-[calc(12px+env(safe-area-inset-top))]"><div className="pointer-events-auto"><DauTrangHS tieuDe="Học tập" phu="Cùng BK chinh phục thế giới" onBack={onBack} theoMon phai={nutNv} /></div></div>
      {(onNhiemVu || onRank) && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {onNhiemVu && <button onClick={onNhiemVu} className="px-4 py-1.5 text-[13px] font-bold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }}>Nhiệm vụ</button>}
          {onRank && <button onClick={onRank} className="px-4 py-1.5 text-[13px] font-bold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }}>Rank của em</button>}
        </div>
      )}
    </div>
  )
  return (
    <ManHS nen="tranh">
      <DauTrangHS tieuDe="Học tập" phu="Cùng BK chinh phục thế giới" onBack={onBack} theoMon />
      <LuoiO ds={ds} />
      {(onNhiemVu || onRank) && (
        <div className="mt-1 flex justify-center gap-5">
          {onNhiemVu && <button onClick={onNhiemVu} className="text-[13px] font-bold" style={{ color: MAU.acc }}>Nhiệm vụ</button>}
          {onRank && <button onClick={onRank} className="text-[13px] font-bold" style={{ color: MAU.acc }}>Rank của em</button>}
        </div>
      )}
    </ManHS>
  )
}

/** Đấu trường BK / Chinh phục BK = khung game chung mọi môn (src/dautu) nhúng trong app HS. Lùi ở màn đầu của game ⇒ game báo `dtv: 'thoat'`. */
export function GameNhungHS({ vao, tieuDe, onBack, mon: monEp, khoi: khoiEp, them }: {
  vao: 'chu_de' | 'thap'; tieuDe: string; onBack: () => void; mon?: string; khoi?: string
  /** tham số thêm cho game (Chinh phục BK: cd = mã chủ đề của tháp · tcd = tên tháp · che = song_con|vo_tan) */
  them?: Record<string, string>
}) {
  const monHS = useMonHS(), mon = monEp ?? monHS // monEp/khoiEp: chỉ trang xem thử truyền
  // Khối của EM — game khoá theo khối này (Leo tháp không cho chọn khối khác, Thùy 03/10)
  const [khoi, setKhoi] = useState<string | null | undefined>(khoiEp ?? undefined)
  useEffect(() => { if (khoiEp === undefined) khoiCuaHS().then(setKhoi).catch(() => setKhoi(null)) }, [khoiEp])
  useEffect(() => {
    const f = (e: MessageEvent) => { if (e.origin === location.origin && (e.data as { dtv?: string } | null)?.dtv === 'thoat') onBack() }
    window.addEventListener('message', f); return () => window.removeEventListener('message', f)
  }, [onBack])
  if (khoi === undefined) return <div className="fixed inset-0 z-40" style={{ background: 'var(--sk-bg)' }} />
  const src = `/dautu.html?nhung=1&skin=${laySkin(null).id}&vao=${vao}&mon=${encodeURIComponent(mon ?? 'Toán')}${khoi ? `&khoi=${encodeURIComponent(khoi)}` : ''}${Object.entries(them ?? {}).map(([k, v]) => `&${k}=${encodeURIComponent(v)}`).join('')}`
  return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{ background: 'var(--sk-bg)', animation: 'ht-hien-mo .45s ease-out both' }}>
      <style>{'@keyframes ht-hien-mo { from { opacity: 0 } to { opacity: 1 } }'}</style>
      <iframe title={tieuDe} src={src} className="h-full w-full flex-1 border-0" allow="autoplay" />
    </div>
  )
}

// ── GIẢI VÔ ĐỊCH BK (spec-che-do-game.md §7.3): 2 chế độ — giải trực tiếp (đăng ký trước, giờ cố định) · đấu với máy (= Thử thách cũ, giữ luật + Rank) ──
const LICH = { dangKy: 'Thứ 2 – Thứ 4', thiDau: 'Thứ 7 · 20:00', diemDanh: '19:50 – 20:00' } // DEMO — lịch thật do DB trả
const NHANH_MAU = ['Em', 'Minh Anh', 'Bảo Ngọc', 'Gia Huy', 'Khánh Linh', 'Đức Minh', 'Thảo Vy', 'Quốc Bảo'] // DEMO — nhánh giả

export function GiaiVoDichHS({ onBack, onDauMay }: { onBack: () => void; onDauMay: () => void }) {
  const [dangKy, setDangKy] = useState(false) // DEMO: chỉ trong máy, chưa ghi DB
  const mon = useMonHS()
  return (
    <ManHS>
      <DauTrangHS tieuDe="Giải Vô địch BK" phu="Con đường của nhà vô địch" onBack={onBack} theoMon />
      <div className="grid gap-3 md:grid-cols-2">
        <TheHS className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2"><span className="text-[18px] font-bold" style={HEAD}>Giải trực tiếp</span><NhanHS>Mỗi tuần</NhanHS></div>
          <Dong nhan="Đăng ký">{LICH.dangKy}</Dong>
          <Dong nhan="Thi đấu">{LICH.thiDau}</Dong>
          <Dong nhan="Điểm danh">{LICH.diemDanh} — không vào là xử thua</Dong>
          <Dong nhan="Bảng">{mon ?? 'Môn'} · theo khối của em</Dong>
          <ul className="list-disc pl-5 text-[12.5px] leading-relaxed" style={{ color: MAU.muted }}>
            <li>Loại trực tiếp. Mỗi trận 4 phút, hai em cùng một câu.</li>
            <li>Ai bấm trước thì câu đó kết thúc: đúng thì em thắng lượt, sai thì bạn thắng lượt (ít điểm hơn).</li>
            <li>Đối thủ vắng mặt ⇒ em tự vào vòng trong. Có thưởng xu theo vòng đạt được.</li>
          </ul>
          <NutHS onClick={() => setDangKy((v) => !v)} phu={dangKy}>{dangKy ? 'Đã đăng ký ✓ (bấm để huỷ)' : 'Đăng ký giải tuần này'}</NutHS>
          <p className="text-[11px]" style={{ color: MAU.muted }}>Bản demo: đăng ký chưa lưu, lịch và nhánh là dữ liệu mẫu.</p>
        </TheHS>
        <TheHS onClick={onDauMay} className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2"><span className="text-[18px] font-bold" style={HEAD}>Đấu với máy</span>{rankBat() && <NhanHS>Cộng Điểm Rank</NhanHS>}</div>
          <p className="text-[13px] leading-snug" style={{ color: MAU.muted }}>3 trận liên tiếp với Boss, càng vào sâu càng khó (đúng 60% · 80% · 100%). Thua trận nào là dừng. 2 lượt mỗi ngày.</p>
          <span className="mt-auto self-end text-[14px] font-bold" style={{ color: MAU.acc }}>Vào đấu ›</span>
        </TheHS>
      </div>
      <NhomHS>Nhánh đấu tuần này (mẫu)</NhomHS>
      <NhanhMau ten={NHANH_MAU} />
    </ManHS>
  )
}

function Dong({ nhan, children }: { nhan: string; children: ReactNode }) {
  return <p className="flex gap-2 text-[13.5px]"><span className="w-[84px] shrink-0" style={{ color: MAU.muted }}>{nhan}</span><span className="font-semibold">{children}</span></p>
}

/** Nhánh loại trực tiếp 8 → 4 → 2 → 1 (chỉ vẽ dữ liệu mẫu). */
function NhanhMau({ ten }: { ten: string[] }) {
  const vong = [ten, ['?', '?', '?', '?'], ['?', '?'], ['Nhà vô địch']]
  const nhanVong = ['Tứ kết', 'Bán kết', 'Chung kết', 'Vô địch']
  return (
    <TheHS className="overflow-x-auto p-3">
      <div className="flex min-w-[560px] gap-3">
        {vong.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col justify-around gap-2">
            <p className="text-center text-[11px] font-bold uppercase" style={{ color: MAU.muted }}>{nhanVong[i]}</p>
            {v.map((t, j) => (
              <span key={j} className="px-2 py-1.5 text-center text-[12.5px] font-semibold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius)', background: t === 'Em' ? 'var(--sk-surface2)' : undefined, color: t === '?' ? MAU.muted : MAU.ink }}>{t}</span>
            ))}
          </div>
        ))}
      </div>
    </TheHS>
  )
}
