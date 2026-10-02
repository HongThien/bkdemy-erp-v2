// ============================================================================
// REGISTRY STYLE app HS — danh sách style + hàm dùng chung. MỖI STYLE = 1 file ở skin/styles/<id>.ts (gói trọn màu · font ·
// dáng thẻ · tranh nền · icon · trang trí), khai theo hợp đồng skin/kieu.ts. Component CHỈ đọc biến CSS `--sk-*` do bienCss()
// sinh ra (qua skin/KhungHS) — CẤM `if (skin === '…')` trong component (cùng luật đối xứng môn CLAUDE §1.6).
// Cách thêm style / thêm tính năng mới cho đúng style: design/STYLE-HS.md · kiểm: npm run check:style-hs.
// ============================================================================
import type { Skin, CheDo, HinhNen, SkinId } from './kieu'
import { RPG } from './styles/rpg'
import { TOI_GIAN } from './styles/toiGian'
import { KHOI } from './styles/khoi'
export type { Skin, SkinId, CheDo, GiaoDien, HinhNen, Mau } from './kieu'

// Khối dùng Home mới + tự chọn skin. Thùy 28/09 tối: MỌI skin mở cho MỌI em, không giới hạn tuổi ("lớp 6 vẫn thích anime")
// — nhóm tuổi chỉ là chuẩn để THIẾT KẾ skin. Cấp 1 (3–5) còn HomeCap1 riêng cho iPad, chưa chuyển. Khối lấy từ hs_khoi_cua_toi.
export const KHOI_CHON_SKIN = new Set(['6', '7', '8', '9', '10', '11', '12'])

// Thùy 29/09: 4 skin thử (Tối giản · Đấu trường · Y2K · Soft Hàn) đã XOÁ — chỉ Anime RPG dùng thật; style mới thêm vào đây.
// Thùy 02/10: dựng lại Tối giản (đơn sắc, nền trơn) cho em không thích rối mắt.
// Thùy 03/10: thêm Khối vuông (cảm hứng Minecraft) làm lựa chọn — RPG vẫn là mặc định.
export const SKINS: Skin[] = [RPG, KHOI, TOI_GIAN]

export const SKIN_MAC_DINH: SkinId = 'rpg' // Thùy 29/09: chỉ Anime RPG dùng thật — em chưa chọn cũng ra RPG

export function laySkin(id: string | null | undefined): Skin {
  return SKINS.find((s) => s.id === id) ?? SKINS.find((s) => s.id === SKIN_MAC_DINH)!
}

// Chế độ thật đang vẽ: skin chỉ có 1 chế độ thì khoá; 'he_thong' theo điện thoại.
export function cheDoThat(skin: Skin, cheDo: CheDo, heThongToi: boolean): 'sang' | 'toi' {
  if (skin.cheDo.length === 1) return skin.cheDo[0]
  if (cheDo === 'he_thong') return heThongToi ? 'toi' : 'sang'
  return cheDo
}

export function layHinhNen(skin: Skin, id: string | null | undefined): HinhNen {
  return skin.hinhNen.find((h) => h.id === id) ?? skin.hinhNen[0]
}

// Biến CSS cho 1 (skin × chế độ × hình nền) — đặt lên thẻ gốc, mọi thứ bên trong đọc var(--sk-*).
// Hình nền 1 khổ: màn dọc lấy bản Doc nếu có, không thì bản thường.
export function nenCua(hn: HinhNen, cd: 'sang' | 'toi', doc: boolean): string | undefined {
  const thuong = (cd === 'toi' ? hn.toi : hn.sang) ?? hn.toi ?? hn.sang
  return doc ? ((cd === 'toi' ? hn.toiDoc : hn.sangDoc) ?? hn.toiDoc ?? hn.sangDoc ?? thuong) : thuong
}

export function bienCss(skin: Skin, cd: 'sang' | 'toi', hinhNenId: string | null | undefined, doc = false): Record<string, string> {
  const m = (cd === 'toi' ? skin.toi : skin.sang) ?? (skin.toi ?? skin.sang)!
  const hn = layHinhNen(skin, hinhNenId)
  return {
    '--sk-page': nenCua(hn, cd, doc) ?? m.bg,
    '--sk-bg': m.bg, '--sk-surface': m.surface, '--sk-surface2': m.surface2, '--sk-ink': m.ink, '--sk-muted': m.muted,
    '--sk-line': m.line, '--sk-acc': m.acc, '--sk-acc-ink': m.accInk, '--sk-badge': m.badge, '--sk-badge-ink': m.badgeInk,
    '--sk-card-border': m.cardBorder, '--sk-card-shadow': m.cardShadow, '--sk-card-clip': skin.cardClip,
    '--sk-card-left': skin.cardAccentLeft === 'none' ? m.cardBorder : skin.cardAccentLeft,
    '--sk-radius': skin.radius, '--sk-radius-pill': skin.radiusPill ?? '999px', '--sk-blur': skin.blur,
    '--sk-next-bg': skin.theTiep?.bg ?? m.acc, '--sk-next-ink': skin.theTiep?.ink ?? m.accInk, '--sk-next-border': skin.theTiep?.border ?? 'none',
    '--sk-name-plate': skin.nenTen ?? 'transparent',
    // Bóng chữ kế thừa cho MỌI chữ trong khung trang: skin nền ẢNH (có nenTen) cần — chữ đè đèn/lâu đài không đọc được (Thùy 29/09).
    // Chỉ ở chế độ TỐI: style SÁNG có tấm tên (Khối vuông 03/10) chữ tối — bóng tối quanh chữ tối thì nhoè, càng khó đọc.
    '--sk-chu-bong': skin.nenTen && cd === 'toi' ? '0 1px 6px rgba(8,10,24,0.9)' : 'none',
    '--sk-tran-font': skin.tran?.font ?? skin.font, '--sk-tran-nen': skin.tran?.nen ?? m.surface,
    '--sk-tran-vien': skin.tran?.vien ?? `0 0 0 1px ${m.line}`, '--sk-tran-phien': skin.tran?.phien ?? m.surface2, '--sk-tran-phien-day': skin.tran?.phienDay ?? m.line,
    '--sk-goc': skin.trangTri?.goc ? `url(${skin.trangTri.goc})` : 'none',
    '--sk-font': skin.font, '--sk-font-head': skin.fontHead, '--sk-head-case': skin.headCase, '--sk-head-track': skin.headTrack,
    colorScheme: cd === 'toi' ? 'dark' : 'light',
  }
}
