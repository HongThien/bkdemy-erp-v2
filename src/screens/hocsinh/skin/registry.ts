// ============================================================================
// REGISTRY STYLE app HS — danh sách style + hàm dùng chung. MỖI STYLE = 1 file ở skin/styles/<id>.ts (gói trọn màu · font ·
// dáng thẻ · tranh nền · icon · trang trí), khai theo hợp đồng skin/kieu.ts. Component CHỈ đọc biến CSS `--sk-*` do bienCss()
// sinh ra (qua skin/KhungHS) — CẤM `if (skin === '…')` trong component (cùng luật đối xứng môn CLAUDE §1.6).
// Cách thêm style / thêm tính năng mới cho đúng style: design/STYLE-HS.md · kiểm: npm run check:style-hs.
// ============================================================================
import type { Skin, CheDo, HinhNen, SkinId, MauDoc } from './kieu'
import { RPG } from './styles/rpg'
import { TOI_GIAN } from './styles/toiGian'
import { KHOI } from './styles/khoi'
import { skinDangApId } from './loi'
export type { Skin, SkinId, CheDo, GiaoDien, HinhNen, Mau, MauDoc } from './kieu'

// Khối dùng Home mới + tự chọn skin. Thùy 28/09 tối: MỌI skin mở cho MỌI em, không giới hạn tuổi ("lớp 6 vẫn thích anime")
// — nhóm tuổi chỉ là chuẩn để THIẾT KẾ skin. Cấp 1 (3–5) còn HomeCap1 riêng cho iPad, chưa chuyển. Khối lấy từ hs_khoi_cua_toi.
export const KHOI_CHON_SKIN = new Set(['6', '7', '8', '9', '10', '11', '12'])

// Thùy 29/09: 4 skin thử (Tối giản · Đấu trường · Y2K · Soft Hàn) đã XOÁ — chỉ Anime RPG dùng thật; style mới thêm vào đây.
// Thùy 02/10: dựng lại Tối giản (đơn sắc, nền trơn) cho em không thích rối mắt.
// Thùy 03/10: thêm Khối vuông (cảm hứng Minecraft) làm lựa chọn — RPG vẫn là mặc định.
export const SKINS: Skin[] = [RPG, KHOI, TOI_GIAN]

export const SKIN_MAC_DINH: SkinId = 'rpg' // Thùy 29/09: chỉ Anime RPG dùng thật — em chưa chọn cũng ra RPG

// id = null/undefined ⇒ style ĐANG ÁP (KhungHS.ganBien gắn khi app HS chạy; chưa gắn — vd trang game mở riêng — ⇒ mặc định).
// 07/10: trước đây null rơi THẲNG về mặc định ⇒ mọi màn gọi laySkin(null) (khu Học tập, Chinh phục, quái/boss 2D…) luôn vẽ hình RPG
// dù em chọn style khác. id sai/không có ⇒ mặc định.
export function laySkin(id: string | null | undefined): Skin {
  const muon = id ?? skinDangApId()
  return SKINS.find((s) => s.id === muon) ?? SKINS.find((s) => s.id === SKIN_MAC_DINH)!
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

// ── MÀN ĐỌC (tầng cuối tra cứu — Thùy 03/10, mẫu file gốc KHTN Pocket) ─────────────────────────────────────────────
// Nền SÁNG trơn, chữ tối, thẻ trắng: đọc lâu không mỏi — khác hẳn menu (tranh nền + thẻ mờ). Style nào muốn khác thì khai `Skin.doc`.
export const DOC_MAC_DINH: MauDoc = {
  font: "'Be Vietnam Pro', system-ui, sans-serif",
  nen: '#eef1f6', giay: '#ffffff', ink: '#1d2433', muted: '#5f6b80', line: '#e1e6ef', bong: '0 6px 24px rgba(29,36,51,0.08)',
  vd: '#f3f5fa', nhamNen: '#fff5f3', nhamVien: '#f1aba3', nhamChu: '#c2412d', luuYNen: '#fff8e6', luuYChu: '#a8670f',
}
// Màu NHẤN của màn đọc theo MÔN và PHÂN MÔN (Lý/Hóa/Sinh) — màu có nghĩa, giống nhau ở mọi style. 1 registry, không `if (mon === …)`
// ở component (§1.6). Phân môn có màu riêng thì ưu tiên, không thì màu môn, không nữa thì màu chung. nhat = nền khối công thức.
const MAU_DOC_THEO: Record<string, { acc: string; nhat: string }> = {
  'Toán': { acc: '#3b6fe0', nhat: '#edf2fe' }, 'TSA': { acc: '#c2771b', nhat: '#fdf3e4' },
  'Tiếng Anh': { acc: '#d14776', nhat: '#fdeef3' }, 'Văn': { acc: '#b4532f', nhat: '#fbefe9' },
  'KHTN': { acc: '#2c8f86', nhat: '#e8f6f4' },
  'Lý': { acc: '#7357d6', nhat: '#f1edff' }, 'Hóa': { acc: '#2d7fd3', nhat: '#eaf3fd' }, 'Sinh': { acc: '#1f9a6a', nhat: '#e8f7f0' },
}
const MAU_DOC_CHUNG = { acc: '#4f5f86', nhat: '#eef1f7' }
export function mauDocMon(mon: string | null | undefined, phanMon?: string | null): { acc: string; nhat: string } {
  return (phanMon && MAU_DOC_THEO[phanMon]) || (mon && MAU_DOC_THEO[mon]) || MAU_DOC_CHUNG
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
    '--sk-nen-trong': m.nenTrong ?? m.bg, // màn TRONG: đơn sắc, không tranh
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
    ...bienDoc({ ...DOC_MAC_DINH, ...skin.doc }),
    colorScheme: cd === 'toi' ? 'dark' : 'light',
  }
}

function bienDoc(d: MauDoc): Record<string, string> {
  return {
    '--sk-doc-font': d.font, '--sk-doc-nen': d.nen, '--sk-doc-giay': d.giay, '--sk-doc-ink': d.ink, '--sk-doc-muted': d.muted,
    '--sk-doc-line': d.line, '--sk-doc-bong': d.bong, '--sk-doc-vd': d.vd, '--sk-doc-nham-nen': d.nhamNen, '--sk-doc-nham-vien': d.nhamVien,
    '--sk-doc-nham-chu': d.nhamChu, '--sk-doc-luuy-nen': d.luuYNen, '--sk-doc-luuy-chu': d.luuYChu,
  }
}
