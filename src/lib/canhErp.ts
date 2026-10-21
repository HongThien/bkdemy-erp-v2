// CẢNH "PHÒNG HỌC" của Trang chính ERP (Thùy 14/10): nền + đồ vật ghép theo toạ độ trong manifest.json, chữ / số / nút
// do HTML vẽ đè lên `text_box`. Mỗi cảnh = 1 thư mục public/bk-ui/erp/canh/<id>/ (xem scripts/erp-canh-hinh.mjs,
// khuôn manifest ở design/YEU-CAU-ANH-STYLE-ERP.md). Số box nhóm theo CẢNH: cảnh 6 ngăn hiện 6, cảnh 4 ô hiện 4.
// File này chỉ ĐỌC + chuẩn hoá manifest (2 phương ngữ: bản v3 "theo ảnh chốt" và bản production-v2) — không vẽ gì.
//
// ⭐ 14/10 tối — CẢNH "LIỀN" (Thùy đổi hướng: ghép đồ vật tách lớp lên nền KHÔNG tự nhiên vì tranh có bóng đổ / ánh sáng
// tương tác). Manifest `"kieu": "lien"` = MỘT ảnh nguyên bản + danh sách Ô CHỮ vẽ sẵn trong tranh (bảng trống, thẻ trống,
// biển trống). Không có lớp đồ vật. Mọi ô được dựng thành `Art` ẢO (file rỗng, hộp = chính ô) để HomeScene dùng lại nguyên
// luật chữ R1–R4 + vùng bấm. Box nhóm = Ô TRỐNG CHUNG (Thùy chốt 14/10): app in tên nhóm + 1 icon dẹt, người dùng tự chọn
// nhóm nào vào ô nào; ô yêu thích chưa ghim thì để nguyên tranh (tranh phải "đẹp khi trống"). Khuôn: design/YEU-CAU-ANH-STYLE-ERP.md
// §A. Toạ độ ô đánh dấu bằng trang /xem-thu-canh.html (kéo chuột khoanh ô trên ảnh → xuất manifest).
import { YEU_THICH_TOI_DA } from './menu'
export type Rect = [number, number, number, number]   // x, y, w, h (px trên canvas của cảnh)

export const CANH_ERP: { id: string; ten: string; moTa: string }[] = [
  { id: 'ke-hoc-thuat', ten: 'Kệ học thuật', moTa: 'Phòng học nắng, kệ gỗ · 8 yêu thích · 6 nhóm' },
  { id: 'pegboard', ten: 'Bảng đục lỗ', moTa: 'Pegboard + bàn học · 8 yêu thích · 4 nhóm' },
  { id: 'lang-bk', ten: 'Làng BK', moTa: 'Cửa sổ nhìn ra phố · 8 yêu thích · 4 nhóm' },
]
export const duongDanCanh = (id: string) => `/bk-ui/erp/canh/${id}`

export type Art = {
  id: string; file: string; w: number; h: number
  place: Rect; z: number
  textBox?: Rect; labelBox?: Rect; badge?: [number, number]; ink?: string
  avatarCircle?: [number, number, number]
  textInset?: Rect   // lề trong của text_box [trái, trên, phải, dưới] px ảnh; không khai = lề mặc định theo tỉ lệ (HomeScene R4)
  iconBox?: Rect     // (cảnh liền) chỗ in icon dẹt của nhóm, toạ độ cục bộ trong ô
}
export type Canh = {
  id: string; base: string; W: number; H: number
  tokens: Record<string, string>; tone: 'sang' | 'toi'
  bg: string; bg43: string | null
  tinh: Art[]                                    // lớp luôn vẽ (bảng, biển, đồ trang trí) theo z
  bang: { today?: Art; greeting?: Art; development?: Art; order?: Art; bienYeuThich?: Art }
  nutCong: { chinh?: Art; phu?: Art }            // 2 thẻ treo: Tuỳ chỉnh / Giao diện
  yeuThichO: Rect[]                              // 8 vị trí
  yeuThichArt: (Art | null)[]                    // hình ô i (null = không có)
  yeuThichTrong: Art | null                      // hình ô chưa ghim
  nhomO: Rect[]                                  // 4 hoặc 6 vị trí
  nhomArt: Record<string, Art>                   // theo khoá nhóm (group-van-hanh …)
  thu: { empty?: Art; unread?: Art }
  avatar?: Art
  nhanVat: Art[]
  kieu: 'ghep' | 'lien'
  nhomSlot?: Art[]   // (cảnh liền) ô nhóm thứ i — hình nằm sẵn trong tranh nên ô mang luôn chỗ nhãn / icon / số
}

type Tho = Record<string, any>
const ra = (o: Tho, base: string): Art => ({
  id: o.id, file: `${base}/${o.file}`, w: o.width, h: o.height, place: o.place as Rect, z: o.z ?? 0,
  textBox: o.text_box ?? o.content_box, labelBox: o.label_box, badge: o.badge_anchor ?? undefined, ink: o.ink, avatarCircle: o.avatar_circle,
  textInset: Array.isArray(o.text_inset) && o.text_inset.length === 4 ? o.text_inset as Rect : undefined,
})
// Đồ vật VẼ ĐỘNG (HomeScene tự đặt theo dữ liệu); btn-* là 2 thẻ treo (Tuỳ chỉnh / Giao diện) — vẫn là lớp tĩnh, chữ đè lên.
const LA_DONG = /^(group-|favorite-|mail-|avatar-frame|checkbox-|progress-|popup-frame|tab-)/

const bo = new Map<string, Promise<Canh>>()
export function napCanh(id: string): Promise<Canh> {
  let p = bo.get(id)
  if (!p) { p = tai(id); bo.set(id, p); p.catch(() => bo.delete(id)) }
  return p
}

async function tai(id: string): Promise<Canh> {
  const base = duongDanCanh(id)
  const get = async (f: string) => { const r = await fetch(`${base}/${f}`); if (!r.ok) throw new Error(`${f}: ${r.status}`); return r.json() }
  const m: Tho = await get('manifest.json')
  if (m.kieu === 'lien') return canhLien(m, id, base)
  const lib: Tho[] = await get('library-assets.json').catch(() => [])
  const dsGoc: Tho[] = [...(m.objects ?? [])]
  for (const o of lib) if (!dsGoc.some((x) => x.id === o.id)) dsGoc.push({ ...o, render: false })
  const timArt = (i: string) => { const o = dsGoc.find((x) => x.id === i); return o ? ra(o, base) : undefined }
  const duocVe = (o: Tho) => o.render !== false

  const nhomKhoa = ['group-viec-cua-toi', 'group-van-hanh', 'group-gamification', 'group-hoc-thuat', 'group-quan-ly-chat-luong', 'group-core-team', 'group-dashboard']
  const nhomArt: Record<string, Art> = {}
  for (const k of nhomKhoa) { const a = timArt(k); if (a) nhomArt[k] = a }

  // vị trí box nhóm: bản v2 khai group_slots; bản v3 = nơi từng hình nhóm đang đặt trong cảnh (xếp hàng-trước-cột-sau)
  let nhomO: Rect[] = Array.isArray(m.group_slots) ? m.group_slots : dsGoc.filter((o) => o.id.startsWith('group-') && duocVe(o)).map((o) => o.place as Rect)
  nhomO = [...nhomO].sort((a, b) => (Math.abs(a[1] - b[1]) > 40 ? a[1] - b[1] : a[0] - b[0]))
  const yeuThichArt = Array.from({ length: 8 }, (_, i) => timArt(`favorite-slot-${i + 1}`) ?? null)
  const yeuThichO: Rect[] = Array.isArray(m.favorite_slots) && m.favorite_slots.length === 8
    ? m.favorite_slots : yeuThichArt.map((a) => (a ? a.place : [0, 0, 0, 0] as Rect))

  const tinh = dsGoc.filter((o) => duocVe(o) && !LA_DONG.test(o.id)).map((o) => ra(o, base)).sort((a, b) => a.z - b.z)
  const nhanVat = (m.characters ?? []).filter(duocVe).map((o: Tho) => ra(o, base))
  const find = (i: string) => tinh.find((a) => a.id === i)
  return {
    id, base, W: m.canvas?.width ?? 1672, H: m.canvas?.height ?? 941,
    tokens: m.tokens ?? {}, tone: m.tone === 'toi' ? 'toi' : 'sang',
    bg: `${base}/${m.background?.file ?? 'background.jpg'}`, bg43: m.background_4x3 ? `${base}/${m.background_4x3.file}` : null,
    tinh,
    bang: { today: find('panel-today'), greeting: find('panel-greeting'), development: find('panel-development'), order: find('panel-order'), bienYeuThich: find('decoration-favorites-sign') },
    nutCong: { chinh: timArt('btn-primary'), phu: timArt('btn-secondary') },
    yeuThichO, yeuThichArt, yeuThichTrong: timArt('favorite-empty') ?? null,
    nhomO, nhomArt,
    thu: { empty: timArt('mail-empty'), unread: timArt('mail-unread') },
    avatar: timArt('avatar-frame'),
    nhanVat,
    kieu: 'ghep',
  }
}

// ── CẢNH LIỀN ────────────────────────────────────────────────────────────────
// Một ô trong manifest: [x,y,w,h] trần, hoặc { box, inset?, ink? }. Toạ độ = px trên ảnh nguyên bản (canvas).
type OTho = Rect | { box: Rect; inset?: Rect; ink?: string }
const laRect = (v: unknown): v is Rect => Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number')
function o(v: unknown): { box: Rect; inset?: Rect; ink?: string } | null {
  if (laRect(v)) return { box: v }
  const x = v as { box?: unknown; inset?: unknown; ink?: unknown } | null
  return x && laRect(x.box) ? { box: x.box, inset: laRect(x.inset) ? x.inset : undefined, ink: typeof x.ink === 'string' ? x.ink : undefined } : null
}
// ô (toạ độ canvas) → Art ẢO: file rỗng (không vẽ ảnh), place = ô, toạ độ cục bộ = toạ độ canvas trừ gốc ô.
const cucBo = (b: Rect, r: Rect): Rect => [r[0] - b[0], r[1] - b[1], r[2], r[3]]
function ao(id: string, v: OTho | undefined): Art | undefined {
  const z = o(v)
  if (!z) return undefined
  const [, , w, h] = z.box
  return { id, file: '', w, h, place: z.box, z: 0, textBox: [0, 0, w, h], textInset: z.inset, ink: z.ink }
}
type OYeuThich = { box: Rect; label?: Rect; star?: [number, number] }
type ONhom = { box: Rect; label?: Rect; icon?: Rect; badge?: [number, number] }

/** Manifest `kieu: "lien"` → Canh. Hàm THUẦN (không fetch) để trang đánh dấu ô xem thử ngay manifest đang soạn. */
export function canhLien(m: Tho, id: string, base: string): Canh {
  const zs: Record<string, OTho> = m.zones ?? {}
  const fav: OYeuThich[] = (Array.isArray(m.favorite_slots) ? m.favorite_slots : []).filter((s: OYeuThich) => s && laRect(s.box)).slice(0, YEU_THICH_TOI_DA)
  const grp: ONhom[] = (Array.isArray(m.group_slots) ? m.group_slots : []).filter((s: ONhom) => s && laRect(s.box))
  const yeuThichArt: Art[] = fav.map((s, i) => ({
    id: `favorite-slot-${i + 1}`, file: '', w: s.box[2], h: s.box[3], place: s.box, z: 0,
    labelBox: s.label ? cucBo(s.box, s.label) : [0, s.box[3] * 0.62, s.box[2], s.box[3] * 0.38],
    badge: s.star ? [s.star[0] - s.box[0], s.star[1] - s.box[1]] : undefined,
  }))
  const nhomSlot: Art[] = grp.map((s, i) => ({
    id: `group-slot-${i + 1}`, file: '', w: s.box[2], h: s.box[3], place: s.box, z: 0,
    labelBox: s.label ? cucBo(s.box, s.label) : [0, s.box[3] * 0.6, s.box[2], s.box[3] * 0.4],
    iconBox: s.icon ? cucBo(s.box, s.icon) : [s.box[2] * 0.3, s.box[3] * 0.08, s.box[2] * 0.4, s.box[3] * 0.48],
    badge: s.badge ? [s.badge[0] - s.box[0], s.badge[1] - s.box[1]] : undefined,
  }))
  const src = m.background?.file ?? 'scene.jpg'
  return {
    id, base, W: m.canvas?.width ?? 1672, H: m.canvas?.height ?? 941,
    tokens: m.tokens ?? {}, tone: m.tone === 'toi' ? 'toi' : 'sang',
    bg: /^(\/|https?:|blob:|data:)/.test(src) ? src : `${base}/${src}`,
    bg43: m.background_4x3 ? `${base}/${m.background_4x3.file}` : null,
    tinh: [],
    bang: { today: ao('today', zs.today), greeting: ao('greeting', zs.greeting), development: ao('development', zs.development), order: ao('order', zs.order), bienYeuThich: ao('favorites_title', zs.favorites_title) },
    nutCong: { chinh: ao('toolbar_primary', zs.toolbar_primary), phu: ao('toolbar_secondary', zs.toolbar_secondary) },
    yeuThichO: yeuThichArt.map((a) => a.place), yeuThichArt, yeuThichTrong: null,
    nhomO: nhomSlot.map((a) => a.place), nhomArt: {}, nhomSlot,
    thu: {}, nhanVat: [], kieu: 'lien',
  }
}

/** Khoá hình nhóm theo tên nhóm trong menu ERP. */
export const KHOA_NHOM: Record<string, string> = {
  'nhom:viec': 'group-viec-cua-toi', 'nhom:Vận hành': 'group-van-hanh', 'nhom:Gamification': 'group-gamification',
  'nhom:Học thuật': 'group-hoc-thuat', 'nhom:Quản lý chất lượng': 'group-quan-ly-chat-luong', 'nhom:Core team': 'group-core-team',
  'nhom:Dashboard': 'group-dashboard',
}
