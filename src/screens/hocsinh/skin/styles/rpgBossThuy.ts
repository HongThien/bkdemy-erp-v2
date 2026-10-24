// ============================================================================
// Boss THÙY — 3 FORM (kit hoạt ảnh Thùy duyệt: design/bk-ui-src/AppHS/Animation/final-boss-form-{1,2,3}).
//   Form 1 · Nhà khoa học  → khoá `boss_thuy`   (NẰM TRONG bể boss ngẫu nhiên của trận — thay ảnh tĩnh chibi cũ)
//   Form 2 · Ác quỷ Fi Fai → khoá `boss_thuy_2` (boss CUỐI cốt truyện: `cuoi: true` ⇒ ngoài bể ngẫu nhiên)
//   Form 3 · Form cuối     → khoá `boss_thuy_3` (như trên)
// Ảnh nén bởi scripts/anime-boss-thuy.mjs → public/bk-ui/hs/skin/rpg/boss/{thuy,thuy2,thuy3}/ ; số đo sinh vào rpgBossThuyMeta.ts (đừng chép tay).
// Quy ước y hệt rpgBossTC.ts: mọi pose cùng form ĐÃ chuẩn hoá cùng cỡ khung + cùng neo chân, đã LẬT NGANG (đứng phải, nhìn trái) ⇒ toạ độ tay là
// "so với neo chân, theo hướng đã lật" và ChieuBoss.qua.neo = [0,0]. Thời lượng pose + mốc phóng chép từ animation-data.json của kit.
//
// CHƯA CÓ (kit vẽ bằng canvas riêng, ChieuBoss chưa có kiểu tương ứng): Form 1 — tia laser, chỉ tay gọi sét, búng tay gọi thiên thạch ·
// Form 2/3 — hào quang sét hắc ám (dark-aura.js) · Form 3 — nhát lao tới vụt thước (ở đây thu về kiểu 'song' nổ tại tay) và 12 tờ giấy tung ra khi chạm.
// Form 2/3 CHỈ có 3–5 tư thế (không có trúng đòn / bị hạ gục riêng): các tư thế đó dùng lại pose có sẵn.
// ============================================================================
import type { BossAnh, ChieuBoss, ClipBoss } from '../kieu'
import { META_BOSS_THUY, type MetaBossThuy } from './rpgBossThuyMeta'

const R = '/bk-ui/hs/skin/rpg/boss'
type Seq = [pose: string, ms: number][]
type Id = 'thuy' | 'thuy2' | 'thuy3'

const clipCua = (id: Id) => {
  const m = META_BOSS_THUY[id], d = `${R}/${id}`
  return (s: Seq, lap = false): ClipBoss => ({ src: s.map(([p]) => `${d}/${p}.webp`), ms: s.map(([, t]) => t), rong: m.W, cao: m.H, px: m.px, py: m.py, ...(lap ? { lap: true } : {}) })
}
const tay = (m: MetaBossThuy, pose: string): [number, number] => m.diem[pose].tay
const ty = (m: MetaBossThuy, f: string) => m.fx[f].h / m.fx[f].w

// ── FORM 1 · Nhà khoa học ───────────────────────────────────────────────────
function form1(): BossAnh {
  const id: Id = 'thuy', m = META_BOSS_THUY[id], d = `${R}/${id}`, clip = clipCua(id)
  const chieuRieng: ChieuBoss[] = [
    { ten: 'Tên lửa đơn', kieu: 'don', thoai: 'Nhận bài này!', phongMs: 1000,
      clip: clip([['idle_1', 250], ['point_prepare', 300], ['point_release', 450], ['point_hold', 400], ['point_prepare', 350], ['idle_1', 400]]),
      qua: { n: 1, cach: 0, bay: 650, nong: [tay(m, 'point_release')], neo: [0, 0] } },
    { ten: 'Mưa tên lửa', kieu: 'mua', thoai: 'Mưa bài tập đây!', phongMs: 1250,
      clip: clip([['idle_1', 250], ['snap_prepare', 350], ['snap_release', 650], ['snap_after', 1000], ['snap_after', 1200], ['idle_1', 600]]),
      qua: { n: 6, cach: 90, bay: 1200, nong: [tay(m, 'snap_release')], neo: [0, 0] } },
    { ten: 'Cầu lửa', kieu: 'don', thoai: 'Cầu lửa kiểm tra!', phongMs: 710,
      clip: clip([['idle_1', 250], ['swing_prepare', 300], ['swing_mid', 160], ['swing_release', 1000], ['swing_after', 250], ['idle_1', 400]]),
      qua: { n: 1, cach: 0, bay: 650, nong: [tay(m, 'swing_release')], neo: [0, 0], anh: `${d}/fx_fire.webp`, rong: 0.5, ty: ty(m, 'fire'), quang: '#ff8b30', vong: 0.08 } },
    { ten: 'Cầu băng', kieu: 'don', thoai: 'Cầu băng đây!', phongMs: 710,
      clip: clip([['idle_1', 250], ['swing_prepare', 300], ['swing_mid', 160], ['swing_release', 1000], ['swing_after', 250], ['idle_1', 400]]),
      qua: { n: 1, cach: 0, bay: 650, nong: [tay(m, 'swing_release')], neo: [0, 0], anh: `${d}/fx_ice.webp`, rong: 0.5, ty: ty(m, 'ice'), quang: '#7fd8ff', vong: 0.08 } },
  ]
  return {
    ten: 'Thùy', cao: 2.9, dang: 'anh',
    khung: {
      dung: clip([['idle_1', 900], ['idle_2', 900]], true),
      noi: clip([['idle_1', 200], ['talk_1', 200], ['talk_2', 250], ['talk_1', 180], ['idle_2', 200], ['idle_1', 200]], true),
      chieu: chieuRieng[0].clip,
      trung: clip([['idle_1', 150], ['hit_1', 180], ['hit_2', 250], ['hit_2', 150], ['idle_2', 250], ['idle_1', 350]]),
      gian: clip([['idle_1', 200], ['taunt_1', 300], ['taunt_1', 450], ['taunt_2', 400], ['taunt_2', 450], ['idle_1', 400]]),
      ha: clip([['idle_1', 150], ['hit_1', 200], ['hit_2', 300], ['defeat', 400], ['defeat', 550], ['defeat', 1000]]),
    },
    chieuRieng, anhTenLua: `${d}/fx_missile.webp`,
    fx: { no: 'radial-gradient(closest-side, #fff7d3, #ff9a3c 45%, rgba(255,120,40,0) 75%)', vet: '#54d9ff' },
    dung: `${d}/tinh_dung.webp`, noi: `${d}/tinh_noi.webp`, chieu: `${d}/tinh_chieu.webp`, trung: `${d}/tinh_trung.webp`, gian: `${d}/tinh_gian.webp`, ha: `${d}/tinh_ha.webp`,
    chandung: `${d}/dialogue_upper.webp`,
  }
}

// ── FORM 2 · Ác quỷ Fi Fai — 3 tư thế (idle · talk · cast), 1 chiêu BTVN bắn 1 / 2 / 3 cụm chữ ─────────────────────
function form2(): BossAnh {
  const id: Id = 'thuy2', m = META_BOSS_THUY[id], d = `${R}/${id}`, clip = clipCua(id)
  const cast = tay(m, 'cast'), anhBtvn = `${d}/fx_btvn.webp`
  const btvn = (ten: string, thoai: string, n: number): ChieuBoss => ({
    ten, kieu: n === 1 ? 'don' : 'mua', thoai, phongMs: 1200,
    clip: clip([['idle', 400], ['talk', 800], ['cast', 1150], ['idle', 650]]),
    qua: { n, cach: 140, bay: 900, nong: [cast], neo: [0, 0], anh: anhBtvn, rong: n === 1 ? 0.5 : 0.4, ty: ty(m, 'btvn'), xoay: false, quang: '#b46bff', vong: 0.1 },
  })
  const chieuRieng = [btvn('Thêm BTVN', 'Thêm BTVN này.', 1), btvn('Thêm 1 bài nữa', 'Thêm 1 bài nữa này', 2), btvn('Thêm 2 trang BTVN', 'Thêm 2 trang BTVN luôn', 3)]
  return {
    ten: 'Thùy · Ác quỷ Fi Fai', cao: 3.0, dang: 'anh', cuoi: true,
    khung: {
      dung: clip([['idle', 1000]], true),
      noi: clip([['idle', 200], ['talk', 250], ['idle', 180], ['talk', 250], ['idle', 200]], true),
      chieu: chieuRieng[0].clip,
    },
    chieuRieng,
    fx: { no: 'radial-gradient(closest-side, #f4e3ff, #a24dfb 45%, rgba(162,77,251,0) 75%)', vet: '#b46bff', thoai: { nen: '#2a1840', vien: '#a24dfb', chu: '#f4e3ff' } },
    // kit chỉ có 3 tư thế: trúng đòn / nghiêm túc / bị hạ dùng lại tư thế gần nhất (BossAnhHS vẫn rung / mờ dần theo CSS)
    dung: `${d}/tinh_dung.webp`, noi: `${d}/tinh_noi.webp`, chieu: `${d}/tinh_chieu.webp`, trung: `${d}/tinh_trung.webp`, gian: `${d}/tinh_gian.webp`, ha: `${d}/tinh_ha.webp`,
    chandung: `${d}/dialogue_upper.webp`,
  }
}

// ── FORM 3 · Form cuối — 5 tư thế, 3 chiêu: Vô hạn BTVN · Test tháng 12 trang · Vì sao điểm kém ─────────────────────
function form3(): BossAnh {
  const id: Id = 'thuy3', m = META_BOSS_THUY[id], d = `${R}/${id}`, clip = clipCua(id)
  const cast = tay(m, 'cast')
  const chieuRieng: ChieuBoss[] = [
    { ten: 'Vô hạn BTVN', kieu: 'mua', thoai: 'Vô hạn BTVN', phongMs: 900,
      clip: clip([['idle', 300], ['cast', 4000], ['idle', 900]]),
      qua: { n: 36, cach: 80, bay: 800, nong: [cast], neo: [0, 0], anh: `${d}/fx_btvn.webp`, rong: 0.3, ty: ty(m, 'btvn'), xoay: false, quang: '#b46bff', vong: 0.1 } },
    { ten: 'Test tháng 12 trang', kieu: 'don', thoai: 'Test tháng 12 trang', phongMs: 1000,
      clip: clip([['idle', 350], ['cast', 1850], ['idle', 1000]]),
      qua: { n: 1, cach: 0, bay: 850, nong: [cast], neo: [0, 0], anh: `${d}/fx_test.webp`, rong: 0.55, ty: ty(m, 'test'), xoay: false, quang: '#b46bff', vong: 0.08 } },
    // Kit: boss GÀO → LAO tới vụt thước vào mông đối thủ → bay về. Ở đây thu về nổ tại tay lúc vụt + sóng xung kích lan tới nhân vật (chưa có kiểu "lao tới").
    { ten: 'Vì sao điểm kém', kieu: 'song', thoai: 'Vì sao điểm kém', phongMs: 2050,
      clip: clip([['rage', 900], ['ruler_windup', 1150], ['ruler_strike', 550], ['ruler_windup', 700], ['idle', 500]]),
      qua: { n: 1, cach: 0, bay: 500, nong: [tay(m, 'ruler_strike')], neo: [0, 0] } },
  ]
  return {
    ten: 'Thùy · Form cuối', cao: 3.2, dang: 'anh', cuoi: true,
    khung: {
      dung: clip([['idle', 1000]], true),
      noi: clip([['idle', 300], ['cast', 300], ['idle', 300]], true),
      chieu: chieuRieng[0].clip,
      gian: clip([['idle', 200], ['rage', 1400], ['idle', 500]]),
    },
    chieuRieng,
    fx: { no: 'radial-gradient(closest-side, #f4e3ff, #a24dfb 45%, rgba(162,77,251,0) 75%)', vet: '#b46bff', thoai: { nen: '#2a1840', vien: '#a24dfb', chu: '#f4e3ff' }, song: { vien: '#d4adff', bong: '#a24dfb' } },
    dung: `${d}/tinh_dung.webp`, noi: `${d}/tinh_noi.webp`, chieu: `${d}/tinh_chieu.webp`, trung: `${d}/tinh_trung.webp`, gian: `${d}/tinh_gian.webp`, ha: `${d}/tinh_ha.webp`,
    chandung: `${d}/dialogue_upper.webp`,
  }
}

export const BOSS_THUY_1: BossAnh = form1()
export const BOSS_THUY_2: BossAnh = form2()
export const BOSS_THUY_3: BossAnh = form3()
