// HÌNH TẠM cho bản đồ 2D khi chưa có ảnh Đơn 7 — vẽ bằng SVG từ bảng màu biome của style (b.biome). Có ảnh thật thì màn dùng ảnh,
// mấy hình này chỉ còn là đường lùi (ảnh lỗi tải / style chưa đặt vẽ). Không có luật nghiệp vụ ở đây.
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { bam, vienTam } from './boCuc'
import { anhBoss } from './San2D'

const mauBiome = (b: BangMau3D, biome: string) => b.biome[biome] ?? Object.values(b.biome)[0]

/** Lục địa tạm: bọt sóng + bờ cát + đất + đồi + cây/núi/điểm nhấn rải tất định theo mã. Hộp 100×100, vẽ vừa ô cha. */
export function LucDiaTam({ b, biome, khoa }: { b: BangMau3D; biome: string; khoa: string }) {
  const m = mauBiome(b, biome), vien = vienTam(khoa)
  const vat = Array.from({ length: 16 }, (_, i) => {
    const a = bam(khoa + 'a' + i) * Math.PI * 2, r = Math.sqrt(bam(khoa + 'r' + i)) * 28
    return { x: 50 + Math.cos(a) * r * 1.1, y: 50 + Math.sin(a) * r * 0.8, k: i % 4 }
  }).sort((p, q) => p.y - q.y)
  return (
    <svg viewBox="-6 -6 112 112" className="h-full w-full overflow-visible" aria-hidden>
      <path d={vien} fill="none" stroke={b.bot} strokeWidth={3} opacity={0.55} transform="translate(50 52) scale(1.06) translate(-50 -50)" />
      <path d={vien} fill={b.nuocSau} opacity={0.45} transform="translate(50 56) scale(1) translate(-50 -50)" />
      <path d={vien} fill={b.cat} />
      <path d={vien} fill={m.dat} transform="translate(50 49) scale(.9) translate(-50 -50)" />
      <path d={vienTam(khoa + 'doi')} fill={m.dat2} opacity={0.8} transform="translate(52 46) scale(.5) translate(-50 -50)" />
      {vat.map((v, i) => v.k === 0
        ? <path key={i} d={`M${v.x - 5},${v.y + 2} L${v.x},${v.y - 7} L${v.x + 5},${v.y + 2}Z`} fill={m.nui} stroke={b.bot} strokeOpacity={0.35} strokeWidth={0.6} />
        : v.k === 3
          ? <circle key={i} cx={v.x} cy={v.y} r={1.3} fill={m.diem} />
          : <g key={i}><rect x={v.x - 0.5} y={v.y} width={1} height={3} fill={m.than} /><circle cx={v.x} cy={v.y - 1} r={3.2} fill={v.k === 1 ? m.cay : m.cay2} /></g>)}
    </svg>
  )
}

/** Vùng đất cận cảnh tạm (tầng lục địa): nền đất phủ gần kín khung + đồi rải. */
export function VungDatTam({ b, biome, khoa }: { b: BangMau3D; biome: string; khoa: string }) {
  const m = mauBiome(b, biome)
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <path d={vienTam(khoa)} fill={b.cat} transform="translate(80 45) scale(1.75 1.05) translate(-50 -50)" />
      <path d={vienTam(khoa)} fill={m.dat} transform="translate(80 44) scale(1.62 .96) translate(-50 -50)" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={vienTam(khoa + i)} fill={i % 2 ? m.dat2 : m.cay} opacity={0.35}
          transform={`translate(${20 + bam(khoa + 'x' + i) * 120} ${15 + bam(khoa + 'y' + i) * 60}) scale(${0.12 + bam(khoa + 's' + i) * 0.12}) translate(-50 -50)`} />
      ))}
    </svg>
  )
}

/** Nền chặng tạm (nhìn ngang): trời trên, dải đồi xa, mặt đất rộng nửa dưới. */
export function NenChangTam({ b, biome }: { b: BangMau3D; biome: string }) {
  const m = mauBiome(b, biome)
  return (
    <svg viewBox="0 0 160 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ch-troi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={b.troi} /><stop offset="1" stopColor={b.hemiTroi} /></linearGradient>
        <linearGradient id="ch-dat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={m.dat} /><stop offset="1" stopColor={m.dat2} /></linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#ch-troi)" />
      <path d="M0,34 C20,22 34,30 50,24 C66,18 82,30 100,22 C120,14 140,28 160,20 L160,44 L0,44Z" fill={m.nui} opacity={0.7} />
      <path d="M0,40 C24,32 44,40 70,34 C96,28 120,40 160,32 L160,50 L0,50Z" fill={m.cay} opacity={0.75} />
      <rect y="44" width="160" height="46" fill="url(#ch-dat)" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 23.7) % 160} cy={47 + ((i * 13.3) % 40)} r={0.6 + (i % 3) * 0.4} fill={m.diem} opacity={0.7} />)}
    </svg>
  )
}

/** Bệ đá tạm: elip đá + vòng rune vàng mờ. */
export function BeDaTam({ b }: { b: BangMau3D }) {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible" aria-hidden>
      <ellipse cx="50" cy="24" rx="48" ry="15" fill={b.duongVien} />
      <ellipse cx="50" cy="19" rx="48" ry="15" fill={b.da} />
      <ellipse cx="50" cy="19" rx="36" ry="10" fill="none" stroke={b.vang} strokeWidth="1.6" strokeDasharray="4 3" opacity={0.75} />
    </svg>
  )
}

/** Quái tạm: boss riêng có chân dung thì dùng ảnh; còn lại là "slime" tròn màu loài + mắt (Thùy thiết kế quái riêng — đây chỉ giữ chỗ). */
/** Quái: boss riêng của style (Skin.boss) trước, rồi 7 quái CC0 tạm (quaiCc0.ts — thay hẳn hình SVG tạm cũ, Thùy 03/10). `b` giữ lại cho khớp chỗ gọi, không còn dùng. */
export function QuaiTam({ loai, boss, bong, co }: { b?: BangMau3D; loai: string; boss?: boolean; bong?: boolean; co: number }) {
  const a = anhBoss(loai)!
  return (
    <span className="ban2d-quai relative inline-block h-full w-full origin-bottom" style={bong ? { filter: 'brightness(0)', opacity: 0.5 } : undefined}>
      <img src={a} alt="" className="h-full w-full object-contain" draggable={false} />
      {boss && <span className="absolute left-1/2 -translate-x-1/2 leading-none" style={{ top: -co * 0.22, fontSize: co * 0.32 }}>👑</span>}
    </span>
  )
}
