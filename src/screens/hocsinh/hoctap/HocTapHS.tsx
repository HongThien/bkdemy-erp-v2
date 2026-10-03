// KHU HỌC TẬP (spec-che-do-game.md §7 — Thùy chốt 03/10): ô "Tự luyện" ngoài Home đổi thành "Học tập", bấm vào ra 5 ô (kiểu 2, như lưới Home):
//   Học theo chủ đề (bản đồ phiêu lưu) · Luyện dạng yếu (80% dạng yếu / 20% ngẫu nhiên) · Đấu trường BK (PvP + PvE) · Chinh phục BK (leo tháp) · Giải Vô địch BK.
// Đấu trường + Chinh phục = khung game 6 chế độ (src/dautu, chung mọi môn) NHÚNG bằng khung (dautu.html?nhung=1) — bản DEMO: game còn hồ sơ theo máy,
// khi ghép thật sẽ dùng tài khoản HS + dựng lại bằng KhungHS (nợ ghi ở HANDOFF mục Đấu Từ).
// Giao diện (Thùy 03/10 tối): kiểu GAME CHIBI — 5 ô = 5 HÒN ĐẢO trôi nổi trên bầu trời sao (Skin.hocTap: nền + ảnh đảo; style không khai ⇒ lưới ô thường).
// Icon trên đảo = Skin.anhO[id]; thiếu ⇒ dấu thay của style. Ảnh đảo + icon đang MƯỢN — đơn ChatGPT: DON-HANG-SKIN-HS Đơn 14 Kit B.
import { useEffect, useState, type ReactNode } from 'react'
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, NhomHS, NutHS, TheHS, THE_TRON, useManDoc, useMonHS } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { khoiCuaHS } from '../../../lib/tuluyen'

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

// Vị trí TÂM đảo (% khung dưới đầu trang) + bề rộng đảo (% bề ngang) — ngang: đảo chính giữa, 2 đảo trên 2 bên, 2 đảo dưới; dọc: 1 trên + 2 hàng đôi.
const VT_NGANG: Record<string, [number, number, number]> = { hoc_chu_de: [50, 40, 31], dau_truong: [17, 33, 21], chinh_phuc: [83, 33, 21], luyen_yeu: [28, 77, 18], giai_vo_dich: [72, 77, 18] }
const VT_DOC: Record<string, [number, number, number]> = { hoc_chu_de: [50, 20, 64], dau_truong: [26, 47, 44], chinh_phuc: [74, 47, 44], luyen_yeu: [26, 75, 40], giai_vo_dich: [74, 75, 40] }
const CSS_DAO = `
@keyframes ht-noi { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2.2%) } }
.ht-dao { animation: ht-noi 5s ease-in-out infinite; transition: filter .2s }
.ht-o:hover .ht-dao, .ht-o:focus-visible .ht-dao { filter: brightness(1.12) drop-shadow(0 0 18px rgba(233,199,123,.75)) }
.ht-o:active .ht-dao { filter: brightness(1.2) }
@media (prefers-reduced-motion: reduce) { .ht-dao { animation: none } }
`
const CHU_NOI = { textShadow: '0 0 3px var(--sk-bg), 0 0 6px var(--sk-bg), 0 2px 10px var(--sk-bg)' }

function TroiDao({ ds, dao }: { ds: OHocTap[]; dao: Record<string, string> }) {
  const doc = useManDoc()
  const skin = laySkin(null)
  const VT = doc ? VT_DOC : VT_NGANG
  return (
    <div className="relative min-h-0 flex-1">
      <style>{CSS_DAO}</style>
      {ds.map((o, i) => {
        const [x, y, w] = VT[o.id] ?? [50, 50, 20], icon = skin.anhO?.[o.id], chinh = o.id === 'hoc_chu_de'
        return (
          <button key={o.id} onClick={o.onClick} className="ht-o absolute flex flex-col items-center outline-none" aria-label={`${o.ten}: ${o.sub}`}
            style={{ left: `${x}%`, top: `${y}%`, width: doc ? `${w}%` : `min(${w}%, ${w * 1.9}vh)`, transform: 'translate(-50%,-50%)' }}>
            <span className="ht-dao relative block w-full" style={{ animationDelay: `${-i * 1.1}s` }}>
              <span className="absolute left-[8%] right-[8%] top-[78%] h-[30%] rounded-[50%]" style={{ background: 'radial-gradient(closest-side, rgba(124,92,214,.45), transparent)' }} aria-hidden />
              {dao[o.id] && <img src={dao[o.id]} alt="" draggable={false} className="relative block w-full select-none" style={{ filter: 'drop-shadow(0 14px 18px rgba(0,0,0,.45))' }} />}
              <span className="absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ width: chinh ? '30%' : '36%' }}>
                {icon ? <img src={icon} alt="" draggable={false} className="w-full select-none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }} />
                  : <span className="text-[28px]" style={{ color: 'var(--sk-acc)' }} aria-hidden>{skin.dauThayIcon ?? '✦'}</span>}
              </span>
            </span>
            <span className={`relative z-10 mt-1 block text-center font-bold leading-tight ${chinh ? 'text-[22px] md:text-[26px]' : 'text-[17px] md:text-[20px]'}`} style={{ ...HEAD, ...CHU_NOI, color: 'var(--sk-ink)' }}>{o.ten}</span>
            <span className="relative z-10 mt-0.5 block max-w-[95%] text-center text-[12px] leading-snug md:text-[13.5px]" style={{ ...CHU_NOI, color: 'var(--sk-acc)' }}>{o.sub}</span>
          </button>
        )
      })}
    </div>
  )
}

export function HocTapHS({ onBack, onChuDe, onYeu, onDauTruong, onChinhPhuc, onGiai, onNhiemVu, onRank }: {
  onBack: () => void; onChuDe: () => void; onYeu: () => void; onDauTruong: () => void; onChinhPhuc: () => void; onGiai: () => void
  onNhiemVu?: () => void; onRank?: () => void
}) {
  const ds: OHocTap[] = [
    { id: 'hoc_chu_de', ten: 'Học theo chủ đề', sub: 'Đánh bại Ác quỷ "Phi Phai", giải cứu BK', onClick: onChuDe },
    { id: 'luyen_yeu', ten: 'Luyện dạng yếu', sub: 'Tập trung sửa dạng em còn yếu', onClick: onYeu },
    { id: 'dau_truong', ten: 'Đấu trường BK', sub: 'Ai là người giỏi nhất', onClick: onDauTruong },
    { id: 'chinh_phuc', ten: 'Chinh phục BK', sub: 'Nơi một huyền thoại sinh ra', onClick: onChinhPhuc },
    { id: 'giai_vo_dich', ten: 'Giải Vô địch BK', sub: 'Con đường của nhà vô địch', onClick: onGiai },
  ]
  const ht = laySkin(null).hocTap
  if (ht) return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: ht.nen, color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <div className="px-4 pt-[calc(12px+env(safe-area-inset-top))]"><DauTrangHS tieuDe="Học tập" phu="Cùng BK chinh phục thế giới" onBack={onBack} theoMon /></div>
      <TroiDao ds={ds} dao={ht.dao} />
      {(onNhiemVu || onRank) && (
        <div className="flex justify-center gap-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {onNhiemVu && <button onClick={onNhiemVu} className="px-4 py-1.5 text-[13px] font-bold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }}>Nhiệm vụ</button>}
          {onRank && <button onClick={onRank} className="px-4 py-1.5 text-[13px] font-bold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }}>Rank của em</button>}
        </div>
      )}
    </div>
  )
  return (
    <ManHS>
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
export function GameNhungHS({ vao, tieuDe, onBack, mon: monEp, khoi: khoiEp }: { vao: 'chu_de' | 'thap'; tieuDe: string; onBack: () => void; mon?: string; khoi?: string }) {
  const monHS = useMonHS(), mon = monEp ?? monHS // monEp/khoiEp: chỉ trang xem thử truyền
  // Khối của EM — game khoá theo khối này (Leo tháp không cho chọn khối khác, Thùy 03/10)
  const [khoi, setKhoi] = useState<string | null | undefined>(khoiEp ?? undefined)
  useEffect(() => { if (khoiEp === undefined) khoiCuaHS().then(setKhoi).catch(() => setKhoi(null)) }, [khoiEp])
  useEffect(() => {
    const f = (e: MessageEvent) => { if (e.origin === location.origin && (e.data as { dtv?: string } | null)?.dtv === 'thoat') onBack() }
    window.addEventListener('message', f); return () => window.removeEventListener('message', f)
  }, [onBack])
  if (khoi === undefined) return <div className="fixed inset-0 z-40" style={{ background: 'var(--sk-bg)' }} />
  const src = `/dautu.html?nhung=1&vao=${vao}&mon=${encodeURIComponent(mon ?? 'Toán')}${khoi ? `&khoi=${encodeURIComponent(khoi)}` : ''}`
  return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
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
          <div className="flex items-center gap-2"><span className="text-[18px] font-bold" style={HEAD}>Đấu với máy</span><NhanHS>Cộng Điểm Rank</NhanHS></div>
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
