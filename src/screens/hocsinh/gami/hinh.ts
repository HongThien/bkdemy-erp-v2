// ============================================================================
// hinh.ts — SỔ ĐĂNG KÝ HÌNH gamification app HS (huy hiệu · biểu tượng bậc rank · khung avatar · hiệu ứng).
// Đơn design: design/DON-HANG-GAMI-HS.md (Đơn 2 huy hiệu · Đơn 3 rank). MỌI đường dẫn hình gamification nằm ở ĐÂY —
// màn không tự ghép chuỗi đường dẫn, không tự chọn màu game.
//
// ĐỔI VỎ khi kit ChatGPT về (không sửa màn nào):
//   1. Chép PNG vào public/bk-ui/hs/gami/ đúng cây thư mục dưới (tên file = tên trong đơn).
//   2. Bật cờ bộ tương ứng trong KIT (vd huy_hieu: true). Bộ nào chưa bật ⇒ component tự vẽ HÌNH TẠM bằng code
//      (màu + emoji), nên app chạy được ngay cả khi mới có 1 nửa kit.
//   3. Mở hs.html?xem=gami soát mọi màn × mọi trạng thái.
// Cây file:
//   huy-hieu/<key>/sao1..sao5.png · khoa.png · nho_48.png        huy-hieu/an.png
//   rank/<bac 1..10>/bieu_tuong.png · bieu_tuong_64.png · khung_avatar.png · khung_avatar_96.png
//   rank/sao.png · rank/hao_quang_than.png · rank/len_bac.png
//   fx/sao_moi_sang.png (vầng sáng lớp phủ sao mới — Đơn 1)
//   the-gioi/<tab_the_gioi|tab_ban_be|tab_lop|ket_ban|loi_moi|tang_s|tang_a|tang_b|ruy_bang_s|thay_co_khen|dang_hoc|avatar_an_danh>.png
//   the-gioi/tin/<kieu>.png · the-gioi/tuong-tac/<ma icon ở the_gioi_danh_muc>.png · fx/phao_giay.png   (Đơn 5 Thế giới BK)
//   the-gioi/sticker/<ma sticker ở the_gioi_danh_muc, vd s_goat>.png   (bộ sticker Thùy mua — cờ KIT.sticker_tg)
//   nhiem-vu/<ma>.png (ma: N1 N2 N3 T1..T4 M1 M2 · chang ngay tuan thang · ruong_dong ruong_mo · vong_quay)
//   Tên file ChatGPT giao → tên ở đây: bảng cuối design/DON-HANG-GAMI-HS.md (Claude thu nhỏ nho_48 / bieu_tuong_64 / khung_avatar_96).
// ============================================================================

export const GOC = '/bk-ui/hs/gami'

// Bật từng bộ khi đã chép đủ file của bộ đó. Tách cờ vì 2 đơn design về 2 lúc khác nhau.
export const KIT = {
  huy_hieu: false,   // Đơn 2: 8 × (sao1..5, khoa, nho_48) + an
  rank: false,       // Đơn 3: 10 × (bieu_tuong, bieu_tuong_64, khung_avatar, khung_avatar_96)
  rank_chung: false, // Đơn 3: sao, hao_quang_than, len_bac
  nhiem_vu: true,    // Đơn 1: icon nhiệm vụ + rương (nhiem-vu/<ma>.png) + fx/sao_moi_sang.png — kit về 29/09 (design/bk-ui-src/Mission, #09–24 + #28)
  the_gioi: false,
  sticker_tg: false, // bộ sticker bình luận Thế giới BK (Thùy mua — spec-the-gioi-bk §8) ⇒ the-gioi/sticker/<ma>.png; tắt = emoji to   // Đơn 5: Thế giới BK — the-gioi/*.png · the-gioi/tin/<kieu>.png · the-gioi/tuong-tac/<ma>.png
}

// ── Huy hiệu ─────────────────────────────────────────────────────────────────
export type KieuHuyHieu = 'sao' | 'khoa' | 'nho'
export function anhHuyHieu(key: string, sao: number, kieu: KieuHuyHieu = 'sao'): string | null {
  if (!KIT.huy_hieu) return null
  if (kieu === 'khoa' || sao <= 0) return `${GOC}/huy-hieu/${key}/khoa.png`
  if (kieu === 'nho') return `${GOC}/huy-hieu/${key}/nho_48.png`
  return `${GOC}/huy-hieu/${key}/sao${Math.min(5, sao)}.png`
}

// Màu chủ từng huy hiệu (màu GAME — cố định mọi skin). Kit về thì đổi ở đây cho khớp màu men của hình.
export const MAU_HH: Record<string, { mau: string; dam: string; emoji: string }> = {
  helios: { mau: 'linear-gradient(135deg,#FFB020,#F57C00)', dam: '#F57C00', emoji: '☀️' },
  chronos: { mau: 'linear-gradient(135deg,#5C6BC0,#3949AB)', dam: '#3949AB', emoji: '⏳' },
  athena: { mau: 'linear-gradient(135deg,#26A69A,#00796B)', dam: '#00796B', emoji: '🦉' },
  zeus: { mau: 'linear-gradient(135deg,#FFD54F,#F9A825)', dam: '#F9A825', emoji: '⚡' },
  phoenix: { mau: 'linear-gradient(135deg,#FF7043,#D84315)', dam: '#D84315', emoji: '🔥' },
  hercules: { mau: 'linear-gradient(135deg,#8D6E63,#5D4037)', dam: '#5D4037', emoji: '💪' },
  hephaestus: { mau: 'linear-gradient(135deg,#78909C,#455A64)', dam: '#455A64', emoji: '🔨' },
  nike: { mau: 'linear-gradient(135deg,#AB47BC,#7B1FA2)', dam: '#7B1FA2', emoji: '🏅' },
}
export const mauHH = (key: string) => MAU_HH[key] ?? MAU_HH.nike
export const MAU_CHUA_DAT = 'linear-gradient(135deg,#4A5478,#2E3656)' // dải thẻ huy hiệu chưa có sao — xanh đêm xám
export const VANG = '#C9950F'                     // hoàn hảo / bản cứng / Hiếm
export const VANG_NEN = 'rgba(233,170,30,0.18)'
// Màu GAME dùng chung của hình / lớp phủ (cố định mọi style — màu có nghĩa, không theo skin).
export const MAU_GAMI = {
  chu: '#FFFFFF',                                             // chữ trên dải màu huy hiệu / chương / lớp phủ tối
  khoa: 'linear-gradient(135deg,#3A4670,#232B4D)',            // huy hiệu chưa đạt — bóng xanh đêm (đơn v2 Anime RPG)
  vanh: '#E9C77B', vanhSang: '#F4D98F',                       // vành vàng cổ / vàng sáng của style RPG
  sao: '#E0B01E',                                             // sao bậc rank + hạng top 3
  exp: '#7CF0B0',                                             // "+100 EXP" trên lớp phủ tối
  nutSang: '#FFFFFF', nutSangChu: '#1B1B2F',                  // nút "Tuyệt!" trên lớp phủ tối
  haoQuang: 'conic-gradient(#FF7A18aa,transparent 12%,#D7263Daa 25%,transparent 37%,#7B2FF7aa 50%,transparent 62%,#FF7A18aa 75%,transparent 87%,#FF7A18aa)',
}

// ── Rank: 10 bậc, 5 chương (DON-HANG Đơn 3 — màu chương là luật, không đổi theo skin) ─────────────
export type Chuong = { ten: string; mau: string; dam: string }
export const CHUONG: Record<'thuong' | 'chien_binh' | 'anh_hung' | 'vuong_gia' | 'than', Chuong> = {
  thuong: { ten: 'Người thường', mau: 'linear-gradient(135deg,#B87333,#8C5523)', dam: '#8C5523' },
  chien_binh: { ten: 'Chiến binh', mau: 'linear-gradient(135deg,#8E9BB3,#5F6B85)', dam: '#5F6B85' },
  anh_hung: { ten: 'Anh hùng', mau: 'linear-gradient(135deg,#E0B01E,#B8860B)', dam: '#B8860B' },
  vuong_gia: { ten: 'Vương giả', mau: 'linear-gradient(135deg,#8B4DE8,#5B2BB5)', dam: '#5B2BB5' },
  than: { ten: 'Thần', mau: 'linear-gradient(135deg,#FF7A18,#D7263D 55%,#7B2FF7)', dam: '#D7263D' },
}
// Tên bậc lấy từ DB (rank_bac.ten) khi có; bảng này chỉ để vẽ hình tạm + màn xem mẫu.
export const BAC: { bac: number; ten: string; chuong: keyof typeof CHUONG; emoji: string }[] = [
  { bac: 1, ten: 'Novice', chuong: 'thuong', emoji: '📖' },
  { bac: 2, ten: 'Soldier', chuong: 'chien_binh', emoji: '🪖' },
  { bac: 3, ten: 'Captain', chuong: 'chien_binh', emoji: '🛡️' },
  { bac: 4, ten: 'General', chuong: 'chien_binh', emoji: '⚔️' },
  { bac: 5, ten: 'Hero', chuong: 'anh_hung', emoji: '🌟' },
  { bac: 6, ten: 'Legend', chuong: 'anh_hung', emoji: '🏵️' },
  { bac: 7, ten: 'King', chuong: 'vuong_gia', emoji: '👑' },
  { bac: 8, ten: 'Emperor', chuong: 'vuong_gia', emoji: '🏯' },
  { bac: 9, ten: 'God of War', chuong: 'than', emoji: '🔱' },
  { bac: 10, ten: 'Supreme God', chuong: 'than', emoji: '☀️' },
]
export const bacInfo = (bac: number) => BAC[Math.min(10, Math.max(1, bac)) - 1]
export const chuongCua = (bac: number) => CHUONG[bacInfo(bac).chuong]
export const laThan = (bac: number) => bac >= 9

export function anhBac(bac: number, loai: 'bieu_tuong' | 'bieu_tuong_64' | 'khung_avatar' | 'khung_avatar_96'): string | null {
  if (!KIT.rank) return null
  return `${GOC}/rank/${bacInfo(bac).bac}/${loai}.png`
}
export function anhRankChung(loai: 'sao' | 'hao_quang_than' | 'len_bac'): string | null {
  return KIT.rank_chung ? `${GOC}/rank/${loai}.png` : null
}

// ── Nhiệm vụ: icon từng nhiệm vụ / khối / rương (mã = mã nhiệm vụ trong fn_hs_nhiem_vu_cua_toi) ──
export const ICON_NV: Record<string, string> = {
  N1: '⚔️', N2: '📝', N3: '🔧', T1: '⏰', T2: '🎯', T3: '🔥', T4: '🩹', M1: '📈', M2: '🗓️',
  chang: '🎖️', ngay: '☀️', tuan: '📅', thang: '🏔️', ruong_dong: '📦', ruong_mo: '🎁', vong_quay: '🎰', thu_thach: '⚔️', tu_luyen: '📚',
}
// 2 nút phụ dùng lại icon nhiệm vụ (đơn v3 không đặt vẽ riêng): Thử thách = N1, Tự luyện = N2.
const NV_DUNG_LAI: Record<string, string> = { thu_thach: 'N1', tu_luyen: 'N2' }
export const anhNV = (ma: string): string | null => (KIT.nhiem_vu ? `${GOC}/nhiem-vu/${NV_DUNG_LAI[ma] ?? ma}.png` : null)
export const anhFxSaoMoi = (): string | null => (KIT.nhiem_vu ? `${GOC}/fx/sao_moi_sang.png` : null)

// ── Thế giới BK (Đơn 5) — chưa có kit ⇒ emoji. Mã icon tương tác = the_gioi_danh_muc.ma (DB), không ghép tên ở màn.
export const ICON_TIN: Record<string, string> = {
  nhat_buoi: '🏆', game_nhat: '🎯', doi_thang: '🚩', tra_sua: '🧋', huy_hieu: '🏅', giai_thang: '🎖️', no_luc: '🔥', len_bac: '⬆️',
}
export const ICON_TG = { tab_the_gioi: '🌏', tab_ban_be: '🤝', tab_lop: '🏰', ket_ban: '➕', loi_moi: '💌', thay_co_khen: '👑', dang_hoc: '🟢', avatar_an_danh: '🧙' }
export const anhTG = (ten: keyof typeof ICON_TG | 'ruy_bang_s' | 'tang_s' | 'tang_a' | 'tang_b'): string | null => (KIT.the_gioi ? `${GOC}/the-gioi/${ten}.png` : null)
export const anhTin = (kieu: string): string | null => (KIT.the_gioi && ICON_TIN[kieu] ? `${GOC}/the-gioi/tin/${kieu}.png` : null)
export const anhTuongTac = (ma: string): string | null => (KIT.the_gioi ? `${GOC}/the-gioi/tuong-tac/${ma}.png` : null)
export const anhSticker = (ma: string): string | null => (KIT.sticker_tg ? `${GOC}/the-gioi/sticker/${ma}.png` : null)
export const anhPhaoGiay = (): string | null => (KIT.the_gioi ? `${GOC}/fx/phao_giay.png` : null)
