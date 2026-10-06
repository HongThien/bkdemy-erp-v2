// SỔ HÌNH bản đồ phiêu lưu 2D — ĐỌC THEO STYLE đang dùng (`Skin.banDo2d`, khai ở skin/styles/<id>BanDo2d.ts; 07/10 chuyển số liệu RPG sang
// skin/styles/rpgBanDo2d.ts). Ảnh nào CHƯA có ⇒ trả null, màn vẽ HÌNH TẠM bằng màu biome của style (`b.biome`, không gõ màu ở màn)
// — ghép DẦN được: về ảnh nào khai ảnh đó, phần còn lại vẫn chạy.
import { laySkin } from '../../skin/registry'
import type { BanDo2D } from '../../skin/kieu'

const bd = (): BanDo2D | undefined => laySkin(null).banDo2d
const co = (ds: string[] | undefined, x: string) => !!ds?.includes(x)

/** THẾ GIỚI: nền + các mảnh lục địa/đảo GHÉP THEO TRANH (chủ đề thứ i ⇒ mảnh i — vị trí trong sổ hình của style). */
export const anhNenTheGioi = () => { const d = bd(); return d ? `${d.g}/${d.nenTheGioi}` : null }
export const viTriLucDia = () => bd()?.lucDia ?? []
export const tiLeLucDia = () => bd()?.tlLucDia ?? 1
/** nhãn tên lục địa dưới tâm mảnh (× bề rộng mảnh) */
export const nhanDuoiLucDia = () => bd()?.nhanDuoi ?? 0.04
/** ảnh mảnh lục địa (null nếu style chưa có biome này ⇒ hình tạm) */
export const anhLucDia = (biome: string) => { const d = bd(); return d && d.lucDia.some((v) => v.biome === biome) ? `${d.g}/${d.tienToLucDia}${biome}.webp` : null }
/** Chủ đề thứ i lấy biome của mảnh i trên bản đồ ⇒ đi vào trong đúng cảnh vùng vừa bấm. Chỉ đổi phần VẼ, không đụng dữ liệu DB. */
export function ganBiomeTheoTranh<T extends { luc_dia: { biome: string }[] }>(banDo: T): T {
  const vt = viTriLucDia()
  if (!vt.length || banDo.luc_dia.length > vt.length) return banDo
  return { ...banDo, luc_dia: banDo.luc_dia.map((l, i) => ({ ...l, biome: vt[i].biome })) }
}

/** chỗ đặt mốc dò trên nền vùng của biome (% khung) — không có ⇒ bố cục chung */
export const choMocVung = (biome: string) => bd()?.choMoc?.[biome]
export const anhNenVung = (biome: string) => { const d = bd(); return co(d?.nenVung, biome) ? `${d!.g}/nen_vung_${biome}.jpg` : null }
export const anhNenDang = (biome: string) => { const d = bd(); return co(d?.nenDang, biome) ? `${d!.g}/nen_dang_${biome}.jpg` : null }
export const anhNenChang = (biome: string) => { const d = bd(); return co(d?.nenChang, biome) ? `${d!.g}/nen_chang_${biome}.jpg` : null }
export const LOAI_MOC = ['thanh', 'thap', 'trai', 'den', 'cong', 'cau'] as const
export const anhMoc = (i: number) => { const d = bd(); return d?.moc.length ? `${d.g}/moc_${d.moc[i % d.moc.length]}.webp` : null }
export const anhVat = (ten: 'be_da' | 'may_suong' | 'la_ban' | 'co_chinh_phuc') => { const d = bd(); return co(d?.vat, ten) ? `${d!.g}/${ten}.webp` : null }
/** style có KIT lục địa Đơn 12 (nét vẽ của chính style đó) */
export const coKitLucDia = () => !!bd()?.kit
// hình tạm cho mốc (emoji) khi chưa có hình
export const EMOJI_MOC = ['🏰', '🗼', '⛺', '🛕', '⛩️', '🌉']
