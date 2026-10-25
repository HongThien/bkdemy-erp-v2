// NHÂN VẬT CHÍNH CỦA EM — 1 cửa cho mọi chỗ vẽ nhân vật (bản đồ: chạy/bay · Đấu trường: 15 tư thế chiến đấu). Thùy 03/10: "chọn nhân vật khi bấm Học tập,
// nhân vật này dùng cho mọi hoạt động của app — coi như nhân vật chính". Mã nhân vật:
//   · 4 class mới em chọn: su_tu · cao · ninja · elf (skin/nhanVatChinh.ts — sinh từ kit)
//   · 'nam' | 'nu' = 2 nhà thám hiểm ban đầu (heroChay.ts + heroDau.ts) — CŨNG chọn được (Thùy 03/10: "tính cả 2 nhân vật ban đầu là 6");
//     em chưa chọn ⇒ tạm dùng nhà thám hiểm theo giới tính
// Lựa chọn lưu ở DB (bảng hs_nhan_vat_chinh, RPC fn_hs_nhan_vat_cua_toi / fn_hs_chon_nhan_vat) — điện thoại và iPad cùng 1 nhân vật.
import { HERO_CHAY, anhChay, hopVe } from './heroChay'
import { HERO_DAU, THAN_DUNG, anhDau, hopDau, type TuTheDau } from './heroDau'
import { NHAN_VAT_CHINH, NV_MOI, type NvMoi } from './nhanVatChinh'
import { laySkin } from './registry'

export type NvId = 'nam' | 'nu' | NvMoi
export { NV_MOI, NHAN_VAT_CHINH, type NvMoi }
export const laNvMoi = (id: string | null | undefined): id is NvMoi => !!id && (NV_MOI as string[]).includes(id)
/** 6 nhân vật em chọn được (thứ tự hiện trên màn chọn) — khớp CHECK bảng hs_nhan_vat_chinh. */
export const NV_CHON: NvId[] = ['nam', 'nu', ...NV_MOI]
export const laNvChon = (id: string | null | undefined): id is NvId => !!id && (NV_CHON as string[]).includes(id)
const TT_CU: Record<'nam' | 'nu', { ten: string; moTa: string }> = {
  nam: { ten: 'Nhà thám hiểm', moTa: 'Áo choàng xanh, gan dạ khám phá' },
  nu: { ten: 'Nữ thám hiểm', moTa: 'Áo choàng xanh, nhanh nhẹn tinh ý' },
}
export const tenNv = (id: NvId) => (laNvMoi(id) ? NHAN_VAT_CHINH[id].ten : TT_CU[id].ten)
export const moTaNv = (id: NvId) => (laNvMoi(id) ? NHAN_VAT_CHINH[id].moTa : TT_CU[id].moTa)
const G = '/bk-ui/hs/skin/rpg/nhanvat'

// ── CHẠY / BAY (bản đồ) ─────────────────────────────────────────────────────
/** Số khung chạy của nhân vật (bộ cũ 6; bộ mới = số khung kit đang có). */
export const soKhungChay = (id: NvId) => (laNvMoi(id) ? NHAN_VAT_CHINH[id].chay.ay.length : HERO_CHAY[id].ay.length)
/** Khung đang hiện theo thời gian trôi (ms) — 100ms/khung, dùng DELTA thời gian. */
export const khungChayTheoMs = (id: NvId, ms: number) => Math.floor(ms / 100) % Math.max(1, soKhungChay(id))
export const anhChayNv = (id: NvId, i: number | 'dung') => (laNvMoi(id) ? `${G}/${id}/${i === 'dung' ? 'dung' : 'f' + (i + 1)}.webp` : anhChay(id, i))
/** Hộp vẽ để THÂN (đỉnh đầu → đất) cao đúng `cao` px, chân ở (x, y). Cùng 1 tỉ lệ cho mọi khung (theo neo trung bình) ⇒ không giật cỡ. */
export function hopVeNv(id: NvId, i: number | 'dung', cao: number, x: number, y: number) {
  if (!laNvMoi(id)) return hopVe(id, i, cao, x, y)
  const m = NHAN_VAT_CHINH[id].chay, ay = i === 'dung' ? m.ayDung : (m.ay[i] ?? m.ayDung)
  const ref = m.ay.length ? m.ay.reduce((s, v) => s + v, 0) / m.ay.length : m.ayDung, H = cao / (ref - m.top), W = H * (m.w / m.h)
  return { left: x - m.ax * W, top: y - ay * H, width: W, height: H }
}
/** Nạp sẵn mọi khung chạy (không nháy lúc đổi khung). */
export function napChayNv(id: NvId) { for (let i = 0; i < soKhungChay(id); i++) new Image().src = anhChayNv(id, i); new Image().src = anhChayNv(id, 'dung') }

// ── CHIẾN ĐẤU (Đấu trường) ─────────────────────────────────────────────────
// STYLE CÓ BỘ ĐÁNH RIÊNG (`Skin.dau` — Halloween 25/10: bé ma ra trận): mọi hàm dưới trả hình + số đo của linh vật style đó THAY nhân vật em chọn —
// màn đấu phiêu lưu, Đấu trường, game nhúng, ô nhân vật ở Học tập đổi cùng lúc, không màn nào phải so id style. Lựa chọn nhân vật của em vẫn nằm nguyên
// trong DB (đổi sang style khác là hiện lại). Giới của linh vật theo HỒ SƠ HS (`datGioiDau`, HocSinhApp gắn); chưa biết ⇒ suy từ mã nhân vật ('nu' ⇒ nữ).
let gioiDau: 'nam' | 'nu' | null = null
export function datGioiDau(g: 'nam' | 'nu' | null) { gioiDau = g }
function boDauStyle(id: NvId) {
  const b = laySkin(null).dau
  if (!b) return null
  const g = gioiDau ?? (id === 'nu' ? 'nu' : 'nam')
  return { b, g, m: b.nv[g] }
}
/** Ảnh tư thế của NHÂN VẬT EM CHỌN, bỏ qua bộ đánh của style — chỉ màn chọn nhân vật dùng (chọn trong 6 nhân vật anime). */
export const anhDauNvGoc = (id: NvId, p: TuTheDau) => (laNvMoi(id) ? `${G}/${id}/${p}.webp` : anhDau(id, p))
export const anhDauNv = (id: NvId, p: TuTheDau) => { const d = boDauStyle(id); return d ? `${d.b.g}/${d.g}/${p}.webp` : anhDauNvGoc(id, p) }
/** Hộp vẽ tư thế `p` của nhân vật em chọn (bỏ qua style) — canvas 512×768 chung mọi bộ. */
export function hopDauNvGoc(id: NvId, p: TuTheDau, cao: number, x: number, y: number) {
  if (!laNvMoi(id)) return hopDau(id, p, cao, x, y)
  const m = NHAN_VAT_CHINH[id], d = m.dau[p] ?? { ax: 0.55, ay: 0.96 }
  const h = cao / m.thanDung, w = h * (512 / 768)
  return { left: x - d.ax * w, top: y - d.ay * h, width: w, height: h }
}
/** Hộp vẽ tư thế `p` để THÂN đứng cao `cao` px, chân chạm (x, y). */
export function hopDauNv(id: NvId, p: TuTheDau, cao: number, x: number, y: number) {
  const s = boDauStyle(id)
  if (!s) return hopDauNvGoc(id, p, cao, x, y)
  const d = s.m.tu[p] ?? s.m.tu.dung_1, h = cao / s.m.thanDung, w = h * (s.b.w / s.b.h)
  return { left: x - d.ax * w, top: y - d.ay * h, width: w, height: h }
}
/** Điểm tay thứ nhất của tư thế (tỉ lệ canvas). */
export const tayDauNv = (id: NvId, p: TuTheDau): number[] => {
  const s = boDauStyle(id)
  if (s) return s.m.tu[p]?.tay[0] ?? [0.75, 0.5]
  return laNvMoi(id) ? (NHAN_VAT_CHINH[id].dau[p]?.tay[0] ?? [0.75, 0.5]) : HERO_DAU[id][p].tay[0]
}
export const thanDungNv = (id: NvId) => { const s = boDauStyle(id); return s ? s.m.thanDung : laNvMoi(id) ? NHAN_VAT_CHINH[id].thanDung : THAN_DUNG[id] }
