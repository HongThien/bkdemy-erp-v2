// ============================================================================
// Boss TRANG (phù thủy sách phép) + CƯỜNG (kiếm sư không gian) của style Anime RPG — kit hoạt ảnh Thùy đưa 07/10:
// design/bk-ui-src/AppHS/Animation/{trang,cuong}-boss (README + animation-data.json + player.js + skills-fx.js).
// Ảnh nén bởi scripts/anime-boss-trang-cuong.mjs → public/bk-ui/hs/skin/rpg/boss/{trang,cuong}/ ; số đo khung/điểm tay/sách sinh vào rpgBossMeta.ts (đừng chép tay).
// Quy ước (khác Minh Quân): mọi pose cùng boss ĐÃ chuẩn hoá cùng cỡ khung + cùng neo chân, đã LẬT NGANG (đứng phải, nhìn trái) ⇒ toạ độ tay/sách/bàn đều là
// "so với neo chân, theo hướng đã lật" và ChieuBoss.qua.neo = [0,0].
// Thời lượng pose + mốc phóng (releaseMs/flightMs/hitMs/burnStartMs/count/intervalMs) chép nguyên từ animation-data.json của kit.
// ============================================================================
import type { BossAnh, ChieuBoss, ClipBoss } from '../kieu'
import { META_BOSS_TC, type MetaBossTC } from './rpgBossMeta'

const R = '/bk-ui/hs/skin/rpg/boss'
const FX_NO = 'radial-gradient(closest-side, #fff6d7, #ff9e4a 45%, rgba(255,150,70,0) 75%)'

type Seq = [pose: string, ms: number][]

function dung(id: 'trang' | 'cuong', ten: string, cao3d: number, chieuRieng: (m: MetaBossTC, clip: (s: Seq, lap?: boolean) => ClipBoss) => ChieuBoss[]): BossAnh {
  const m = META_BOSS_TC[id], d = `${R}/${id}`
  const clip = (s: Seq, lap = false): ClipBoss => ({ src: s.map(([p]) => `${d}/${p}.webp`), ms: s.map(([, t]) => t), rong: m.W, cao: m.H, px: m.px, py: m.py, ...(lap ? { lap: true } : {}) })
  const rieng = chieuRieng(m, clip)
  return {
    ten, cao: cao3d, dang: 'anh',
    khung: {
      dung: clip([['idle', 1000]], true),
      noi: clip([['idle', 180], ['talk_1', 220], ['talk_2', 250], ['talk_1', 220], ['idle', 200]], true),
      chieu: rieng[0].clip,
      trung: clip([['idle', 200], ['hit', 500], ['hit', 200], ['idle', 450]]),
      gian: clip([['idle', 200], ['taunt', 1400], ['idle', 500]]),
      ha: clip([['idle', 200], ['hit', 450], ['defeat', 2000]]),
    },
    chieuRieng: rieng,
    anhTenLua: `${d}/fx_btvn.webp`,
    fx: { no: FX_NO, vet: '#5adfff', thoai: { nen: '#282440', vien: '#b19adc', chu: '#fff0d9' }, song: { vien: '#d4adff', bong: '#a24dfb' } },
    // 6 ảnh tĩnh vuông (đường lùi + cảnh 3D cũ dùng sprite vuông)
    dung: `${d}/tinh_dung.webp`, noi: `${d}/tinh_noi.webp`, chieu: `${d}/tinh_chieu.webp`, trung: `${d}/tinh_trung.webp`, gian: `${d}/tinh_gian.webp`, ha: `${d}/tinh_ha.webp`,
    chandung: `${d}/dialogue_upper.webp`,
  }
}

/** Hai chiêu ném BTVN + sách hoá cầu lửa: giống hệt nhau ở cả hai boss (khác nhau chỉ ở điểm tay/sách đo theo từng pose). */
function chungBtvnLua(id: 'trang' | 'cuong', m: MetaBossTC, clip: (s: Seq) => ClipBoss): ChieuBoss[] {
  const d = `${R}/${id}`, tayRelease = m.diem.cast_release.tay, btvn = m.fx.btvn
  const ty = btvn.h / btvn.w
  return [
    { ten: 'Ném BTVN', kieu: 'don', thoai: 'BTVN nào các em', phongMs: 950,
      clip: clip([['talk_1', 450], ['cast_prepare', 500], ['cast_release', 1150], ['idle', 500]]),
      qua: { n: 1, cach: 0, bay: 750, nong: [tayRelease], neo: [0, 0], anh: `${d}/fx_btvn.webp`, rong: 0.5, ty, xoay: false, quang: '#5adfff', vong: 0.12 } },
    { ten: 'BTVN 40 câu', kieu: 'mua', thoai: 'BTVN 40 câu', phongMs: 950,
      clip: clip([['talk_2', 450], ['cast_prepare', 500], ['cast_release', 3800], ['idle', 600]]),
      qua: { n: 40, cach: 70, bay: 750, nong: [tayRelease], neo: [0, 0], anh: `${d}/fx_btvn.webp`, rong: 0.3, ty, xoay: false, quang: '#5adfff', vong: 0.08 } },
  ]
}
function luaSach(id: 'trang' | 'cuong', m: MetaBossTC, clip: (s: Seq) => ClipBoss): ChieuBoss {
  const d = `${R}/${id}`, f = m.fx.fireball
  return {
    ten: 'Sách hoá cầu lửa', kieu: 'don', thoai: 'Thi cử thế à', phongMs: 1600,
    clip: clip([['talk_2', 400], ['fire_charge', 1200], ['fire_release', 1300], ['idle', 500]]),
    sac: { anh: `${d}/fx_fireball.webp`, vi: m.diem.fire_charge.sach, tuMs: 650, rong: 150, nen: 'radial-gradient(closest-side, #fff6d7, #ff7831 40%, rgba(255,120,49,0) 75%)' },
    qua: { n: 1, cach: 0, bay: 800, nong: [m.diem.fire_release.tay], neo: [0, 0], anh: `${d}/fx_fireball.webp`, rong: 0.56, ty: f.h / f.w, quang: '#ff8b30' },
  }
}

export const BOSS_TRANG: BossAnh = dung('trang', 'Trang', 3.0, (m, clip) => {
  const ban = m.fx.desk, tay = m.diem.ruler_down.tay
  return [
    ...chungBtvnLua('trang', m, clip),
    // Đập thước xuống bàn: nổ ngay chỗ thước + sóng xung kích lan tới nhân vật (player.js: blast(hand) → ellipse bay 500ms → blast(target)). Bàn gỗ đứng yên suốt chiêu, mép trên bàn = điểm thước chạm.
    { ten: 'Đập thước', kieu: 'song', thoai: 'Tất cả nhìn lên bảng', phongMs: 1300,
      clip: clip([['talk_2', 450], ['ruler_up', 850], ['ruler_down', 950], ['idle', 600]]),
      ban: { anh: `${R}/trang/fx_desk.webp`, x: tay[0], y: tay[1], rong: Math.min(367, ban.w) },
      qua: { n: 1, cach: 0, bay: 500, nong: [tay], neo: [0, 0] } },
    luaSach('trang', m, clip),
  ]
})

export const BOSS_CUONG: BossAnh = dung('cuong', 'Cường', 3.0, (m, clip) => {
  const ga = m.fx.chicken
  return [
    ...chungBtvnLua('cuong', m, clip),
    // Vung kiếm, phóng con gà: nhát chém hồ quang ở tay (250ms) rồi gà bay 650ms tới nhân vật (player.js).
    { ten: 'Gà thế', kieu: 'don', thoai: 'Gà thế', phongMs: 1300, chem: { net: '#b4f6ff', bong: '#32aaff' },
      clip: clip([['talk_2', 450], ['sword_up', 850], ['sword_slash', 950], ['idle', 600]]),
      qua: { n: 1, cach: 0, bay: 650, nong: [m.diem.sword_slash.tay], neo: [0, 0], anh: `${R}/cuong/fx_chicken.webp`, rong: 0.37 * (ga.w * 2) / 1024, ty: ga.h / ga.w, quang: '#36bfff', vong: 0.08 } },
    luaSach('cuong', m, clip),
  ]
})
