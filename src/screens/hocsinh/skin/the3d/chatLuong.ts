// ============================================================================
// CHẤT LƯỢNG ĐỒ HOẠ TỰ THÍCH ỨNG (spec-v1-app-hs.md §4.5 "LUẬT CHẤT LƯỢNG ĐỒ HOẠ" — Thùy chốt 01/10 khuya).
// 3 mức Thấp · Vừa · Cao: CÙNG cảnh, CÙNG bố cục, CÙNG bấm được — chỉ khác độ mịn + hiệu ứng. BẢNG THÔNG SỐ CHỈ Ở ĐÂY;
// cảnh đọc `thongSo()`, KHÔNG tự `if` theo máy.
// Tự nhận máy (1 lần/máy, rồi nhớ): ① đoán nhanh từ card đồ hoạ / RAM / số nhân / cỡ màn · ② đo thật ~2 giây ở 3 tầng bản đồ
// (KHÔNG đo ở màn đấu — dựng lại giữa trận là mất tiến độ). Đoán + đo trùng ⇒ tự đặt; lệch / card bị giấu / sát ranh giới ⇒ hỏi em
// "Em thấy hình có mượt không?". Trong lúc chơi tụt khung kéo dài ⇒ chỉ HẠ (không tự nâng). Em chọn tay ⇒ tôn trọng, không tự đổi.
// Lưu THEO MÁY ở localStorage (sở thích hiển thị, không phải dữ liệu học tập) + chữ ký máy: đổi card/cỡ màn/DPR ⇒ đo lại.
// File này KHÔNG import three — Home/Hồ sơ dùng được mà không kéo gói 3D vào bundle chính.
// ============================================================================

export type Muc = 'thap' | 'vua' | 'cao'
export type CheDo = 'tu_dong' | Muc

export type ThongSo = {
  dprToiDa: number      // độ phân giải tối đa (nhân với kích thước CSS)
  msaa: boolean         // khử răng cưa (đổi cần dựng lại renderer)
  heSoLuoi: number      // nhân vào bước lưới địa hình của từng cảnh (Cao = 1 ⇒ bước gốc; lục địa 0,26 → Vừa 0,34 → Thấp 0,5)
  tiLeTrangTri: number  // tỉ lệ cây/đá/bụi được giữ
  nuoc: 0 | 1 | 2       // 0 màu phẳng + 1 dải bọt · 1 bọt sóng · 2 bọt sóng + lấp lánh
  gio: number           // độ lắc gió (0 = tắt)
  hatNen: boolean       // hạt lấp lánh trôi nền (trang trí)
  tiLeHat: number       // tỉ lệ hạt của hiệu ứng đòn đánh/ăn mừng (giữ phản hồi đòn đánh ở mọi mức)
  bongThat: boolean     // bóng đổ thật ở màn đấu (không thì chỉ bóng tròn dưới chân — đã có sẵn)
  fps: number           // số khung/giây đích
}

export const BANG: Record<Muc, ThongSo> = {
  thap: { dprToiDa: 1.0, msaa: false, heSoLuoi: 1.9, tiLeTrangTri: 0.35, nuoc: 0, gio: 0, hatNen: false, tiLeHat: 0.3, bongThat: false, fps: 30 },
  vua: { dprToiDa: 1.5, msaa: true, heSoLuoi: 1.3, tiLeTrangTri: 0.7, nuoc: 1, gio: 0.6, hatNen: true, tiLeHat: 0.6, bongThat: false, fps: 45 },
  cao: { dprToiDa: 2.0, msaa: true, heSoLuoi: 1.0, tiLeTrangTri: 1.0, nuoc: 2, gio: 1.0, hatNen: true, tiLeHat: 1.0, bongThat: true, fps: 60 },
}
export const TEN_MUC: Record<Muc, string> = { thap: 'Thấp', vua: 'Vừa', cao: 'Cao' }
export const MO_TA_MUC: Record<Muc, string> = {
  thap: 'Hình đơn giản, máy yếu chạy mượt',
  vua: 'Cân bằng giữa đẹp và mượt',
  cao: 'Đẹp nhất, cần máy khỏe',
}
const THU_TU: Muc[] = ['thap', 'vua', 'cao']
const ha = (m: Muc): Muc => THU_TU[Math.max(0, THU_TU.indexOf(m) - 1)]
const nang = (m: Muc): Muc => THU_TU[Math.min(2, THU_TU.indexOf(m) + 1)]

// ── ĐOÁN NHANH (không tốn thời gian) ───────────────────────────────────────
export type DoanMay = { muc: Muc; chac: boolean; gpu: string; lyDo: string }
let _doan: DoanMay | null = null
export function doanMay(): DoanMay {
  if (_doan) return _doan
  let gpu = '', gl2 = false
  try {
    const c = document.createElement('canvas')
    const g2 = c.getContext('webgl2') as WebGL2RenderingContext | null
    gl2 = !!g2
    const gl = (g2 ?? c.getContext('webgl')) as WebGLRenderingContext | null
    const ext = gl?.getExtension('WEBGL_debug_renderer_info')
    if (gl && ext) gpu = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch { /* coi như không đọc được */ }
  const nav = navigator as Navigator & { deviceMemory?: number }
  const ram = nav.deviceMemory, nhan = nav.hardwareConcurrency || 0
  const ipad = /iPad/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  const dt = ipad || /iPhone|Android|Mobile/.test(navigator.userAgent)
  const g = gpu.toLowerCase()
  const r = (muc: Muc, chac: boolean, lyDo: string): DoanMay => (_doan = { muc, chac, gpu, lyDo })
  if (!gl2) return r('thap', true, 'không có WebGL2')
  if (/swiftshader|llvmpipe|basic render|software/.test(g)) return r('thap', true, 'vẽ bằng phần mềm')
  if (/mali-(4|t)|adreno \(tm\) [2-5]\d\d|powervr|intel.*hd graphics [2-5]\d\d|apple a(7|8|9|10)\b/.test(g)) return r('thap', true, 'card đồ hoạ yếu đã biết')
  if ((ram !== undefined && ram <= 2) || (dt && nhan > 0 && nhan <= 4)) return r('thap', true, 'máy ít RAM / ít nhân')
  if (/rtx|gtx 1[0-9]|gtx [2-9]\d\d\d|radeon rx|radeon pro|apple m[1-9]/.test(g) && !dt) return r('cao', true, 'card đồ hoạ khỏe')
  if (/intel.*(iris|uhd|xe)/.test(g)) return r('vua', true, 'card tích hợp Intel')
  if (/adreno \(tm\) [6-7]\d\d|mali-g[7-9]\d/.test(g)) return r('vua', true, 'điện thoại tầm khá')
  // Safari/iPad thường chỉ báo "Apple GPU" — không phân biệt đời ⇒ đoán Vừa, chờ đo
  return r('vua', false, gpu ? `card "${gpu}" chưa có trong danh sách` : 'trình duyệt giấu tên card')
}

// ── TRẠNG THÁI (lưu theo máy) ──────────────────────────────────────────────
const KHOA = 'bk_do_hoa_v1'
type Luu = { cheDo: CheDo; kq: { chuKy: string; muc: Muc; chac: boolean } | null }
export type TrangThai = {
  cheDo: CheDo
  muc: Muc                 // mức đang áp
  nguon: 'doan' | 'do' | 'tay' | 'nho'
  dangDo: boolean          // đang trong lượt đo tự động
  hoi: boolean             // cần hỏi em "có mượt không?"
  thongBao: string | null  // 1 dòng nhỏ báo cho em (tự chọn / đã giảm)
}

function chuKyMay(): string {
  const d = doanMay()
  return `${d.gpu}|${screen.width}x${screen.height}|${window.devicePixelRatio || 1}`
}
function docLuu(): Luu {
  try { const j = localStorage.getItem(KHOA); if (j) return JSON.parse(j) as Luu } catch { /* riêng tư / bị chặn ⇒ đo lại mỗi lần */ }
  return { cheDo: 'tu_dong', kq: null }
}
function ghiLuu(l: Luu) { try { localStorage.setItem(KHOA, JSON.stringify(l)) } catch { /* không ghi được thì thôi */ } }

let luu: Luu | null = null
let tt: TrangThai | null = null
// phiên đo tự động: mức đoán ban đầu · đã thử nâng chưa · đã hạ chưa · số lần hỏi
let phien = { doan: 'vua' as Muc, chacDoan: false, daNang: false, daHa: false, lanHoi: 0, ranhGioi: false }
const nghe = new Set<(t: TrangThai) => void>()

function khoiTao(): TrangThai {
  if (tt) return tt
  luu = docLuu()
  if (luu.cheDo !== 'tu_dong') { tt = { cheDo: luu.cheDo, muc: luu.cheDo, nguon: 'tay', dangDo: false, hoi: false, thongBao: null }; return tt }
  if (luu.kq && luu.kq.chuKy === chuKyMay()) { tt = { cheDo: 'tu_dong', muc: luu.kq.muc, nguon: 'nho', dangDo: false, hoi: false, thongBao: null }; return tt }
  const d = doanMay()
  phien = { doan: d.muc, chacDoan: d.chac, daNang: false, daHa: false, lanHoi: 0, ranhGioi: false }
  tt = { cheDo: 'tu_dong', muc: d.muc, nguon: 'doan', dangDo: true, hoi: false, thongBao: null }
  return tt
}
function phat(moi: Partial<TrangThai>) {
  tt = { ...khoiTao(), ...moi }
  for (const f of nghe) f(tt)
}

export function trangThai(): TrangThai { return khoiTao() }
export function mucHienTai(): Muc { return khoiTao().muc }
export function thongSo(): ThongSo { return BANG[mucHienTai()] }
export function dangKy(fn: (t: TrangThai) => void): () => void { nghe.add(fn); return () => { nghe.delete(fn) } }

/** Sân khấu hỏi: có cần đo máy ở cảnh này không (chỉ 3 tầng bản đồ gọi). */
export function canDo(): boolean { const t = khoiTao(); return t.cheDo === 'tu_dong' && t.dangDo && !t.hoi }

function chot(muc: Muc, chac: boolean) {
  luu = { cheDo: 'tu_dong', kq: { chuKy: chuKyMay(), muc, chac } }
  ghiLuu(luu)
  phat({ muc, nguon: 'do', dangDo: false, hoi: !chac, thongBao: chac ? `Đồ hoạ: ${TEN_MUC[muc]} (tự chọn cho máy này)` : null })
}

/** Kết quả 1 lượt đo ~2 giây: `khung` = ms trung bình giữa 2 khung · `viec` = ms trung bình máy bận mỗi khung (cập nhật + vẽ). */
export function baoKetQuaDo(khung: number, viec: number) {
  const t = khoiTao(); if (!t.dangDo) return
  const dich = 1000 / BANG[t.muc].fps
  if (khung > dich * 1.2) {                         // chậm hơn đích ⇒ hạ 1 mức, đo lại
    if (t.muc === 'thap') { chot('thap', phien.doan === 'thap' && phien.chacDoan); return }
    if (phien.daNang) phien.ranhGioi = true          // vừa thử nâng mà hụt ⇒ đang ở sát ranh giới
    phien.daHa = true
    const m = ha(t.muc)
    if (phien.daNang) { chot(m, false); return }     // về mức cũ, hỏi em cho chắc
    phat({ muc: m }); return                         // dựng lại ở mức thấp hơn rồi đo tiếp
  }
  const duNhieu = viec < dich * 0.6 && khung < (1000 / 60) * 1.15  // máy rảnh ≥40% ở đúng nhịp màn hình
  if (duNhieu && t.muc !== 'cao' && !phien.daNang && !phien.daHa) { phien.daNang = true; phat({ muc: nang(t.muc) }); return }
  chot(t.muc, t.muc === phien.doan && phien.chacDoan && !phien.ranhGioi)
}

/** Em trả lời "Em thấy hình có mượt không?". Hơi giật ⇒ hạ 1 mức, hỏi lại tối đa 2 lần. */
export function traLoiMuot(muot: boolean) {
  const t = khoiTao()
  if (muot || t.muc === 'thap' || phien.lanHoi >= 2) { luu = { cheDo: 'tu_dong', kq: { chuKy: chuKyMay(), muc: t.muc, chac: true } }; ghiLuu(luu); phat({ hoi: false, thongBao: `Đồ hoạ: ${TEN_MUC[t.muc]}` }); return }
  phien.lanHoi++
  const m = ha(t.muc)
  luu = { cheDo: 'tu_dong', kq: { chuKy: chuKyMay(), muc: m, chac: false } }; ghiLuu(luu)
  phat({ muc: m, hoi: phien.lanHoi < 2 && m !== 'thap', thongBao: `Đã giảm đồ hoạ xuống ${TEN_MUC[m]}` })
}

/** Trong lúc chơi tụt khung kéo dài (đã hạ hết độ phân giải). Tự động ⇒ hạ 1 mức + báo; em chọn tay ⇒ giữ nguyên lựa chọn. */
export function baoCham() {
  const t = khoiTao()
  if (t.cheDo !== 'tu_dong' || t.dangDo || t.muc === 'thap') return
  const m = ha(t.muc)
  luu = { cheDo: 'tu_dong', kq: { chuKy: chuKyMay(), muc: m, chac: true } }; ghiLuu(luu)
  phat({ muc: m, thongBao: 'Máy hơi chậm, em đã giảm đồ hoạ cho mượt' })
}

/** Em chọn trong mục Đồ hoạ. 'tu_dong' ⇒ dùng lại kết quả đo của máy này (chưa có thì đo). */
export function datCheDo(c: CheDo) {
  khoiTao()
  luu = { ...(luu ?? { kq: null }), cheDo: c }; ghiLuu(luu)
  if (c !== 'tu_dong') { phat({ cheDo: c, muc: c, nguon: 'tay', dangDo: false, hoi: false, thongBao: null }); return }
  const kq = luu.kq && luu.kq.chuKy === chuKyMay() ? luu.kq : null
  if (kq) { phat({ cheDo: c, muc: kq.muc, nguon: 'nho', dangDo: false, hoi: false, thongBao: null }); return }
  doLai()
}

/** "Đo lại máy này": xoá kết quả cũ, đoán lại, đo lại ở lần vẽ bản đồ kế tiếp. */
export function doLai() {
  khoiTao()
  luu = { cheDo: 'tu_dong', kq: null }; ghiLuu(luu)
  _doan = null
  const d = doanMay()
  phien = { doan: d.muc, chacDoan: d.chac, daNang: false, daHa: false, lanHoi: 0, ranhGioi: false }
  phat({ cheDo: 'tu_dong', muc: d.muc, nguon: 'doan', dangDo: true, hoi: false, thongBao: null })
}

export function xoaThongBao() { if (tt?.thongBao) phat({ thongBao: null }) }

/** Dòng mô tả trạng thái cho mục Đồ hoạ. */
export function moTaTrangThai(t: TrangThai): string {
  if (t.cheDo !== 'tu_dong') return `Em đang chọn: ${TEN_MUC[t.muc]}`
  if (t.dangDo) return `Đang đo máy… (tạm dùng ${TEN_MUC[t.muc]})`
  return `Tự động: ${TEN_MUC[t.muc]} cho máy này`
}
