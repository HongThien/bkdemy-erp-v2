// Kho từ DEMO (Claude soạn 02/10, chưa qua GV) — 16 chủ đề × 60 từ, 3 cấp (lv1 lớp 3–5 · lv2 lớp 6–7 · lv3 lớp 8–9).
// Sau này thay bằng bảng `anh_tu_vung` theo sách (spec-dau-tu-vung.md §6).
import A from './tu-a.json'
import B from './tu-b.json'

export type LoaiTu = 'n' | 'v' | 'adj' | 'adv' | 'phr'
export interface Tu {
  id: string
  cd: string
  en: string
  vi: string
  pos: LoaiTu
  ipa: string
  lv: 1 | 2 | 3
  vd: string
  vdvi: string
}

export interface ChuDe { id: string; ten: string; tenEn: string; icon: string; mau: string; nhom: string }

export const CHU_DE: ChuDe[] = [
  { id: 'gia_dinh', ten: 'Gia đình & bạn bè', tenEn: 'Family & Friends', icon: '👨‍👩‍👧', mau: '#f59e9e', nhom: 'Đời sống' },
  { id: 'truong_hoc', ten: 'Trường học', tenEn: 'School', icon: '🏫', mau: '#7cc4f2', nhom: 'Đời sống' },
  { id: 'do_an', ten: 'Đồ ăn & đồ uống', tenEn: 'Food & Drinks', icon: '🍜', mau: '#f7b267', nhom: 'Đời sống' },
  { id: 'dong_vat', ten: 'Động vật', tenEn: 'Animals', icon: '🐼', mau: '#8bd17c', nhom: 'Thiên nhiên' },
  { id: 'co_the', ten: 'Cơ thể & sức khoẻ', tenEn: 'Body & Health', icon: '💪', mau: '#f48fb1', nhom: 'Đời sống' },
  { id: 'nha_cua', ten: 'Nhà cửa', tenEn: 'Home', icon: '🏠', mau: '#c5a3f5', nhom: 'Đời sống' },
  { id: 'quan_ao', ten: 'Quần áo & mua sắm', tenEn: 'Clothes & Shopping', icon: '👕', mau: '#80deea', nhom: 'Đời sống' },
  { id: 'thoi_tiet', ten: 'Thời tiết & thiên nhiên', tenEn: 'Weather & Nature', icon: '🌦️', mau: '#90caf9', nhom: 'Thiên nhiên' },
  { id: 'the_thao', ten: 'Thể thao & sở thích', tenEn: 'Sports & Hobbies', icon: '⚽', mau: '#a5d6a7', nhom: 'Hoạt động' },
  { id: 'nghe_nghiep', ten: 'Nghề nghiệp', tenEn: 'Jobs', icon: '👩‍🚒', mau: '#ffcc80', nhom: 'Xã hội' },
  { id: 'thanh_pho', ten: 'Thành phố & giao thông', tenEn: 'City & Transport', icon: '🚌', mau: '#b0bec5', nhom: 'Xã hội' },
  { id: 'cong_nghe', ten: 'Công nghệ', tenEn: 'Technology', icon: '💻', mau: '#9fa8da', nhom: 'Học thuật' },
  { id: 'moi_truong', ten: 'Môi trường', tenEn: 'Environment', icon: '🌱', mau: '#81c784', nhom: 'Học thuật' },
  { id: 'du_lich', ten: 'Du lịch & khám phá', tenEn: 'Travel', icon: '✈️', mau: '#4fc3f7', nhom: 'Hoạt động' },
  { id: 'cam_xuc', ten: 'Cảm xúc & tính cách', tenEn: 'Feelings', icon: '😊', mau: '#ffab91', nhom: 'Xã hội' },
  { id: 'le_hoi', ten: 'Lễ hội & văn hoá', tenEn: 'Festivals', icon: '🏮', mau: '#ef9a9a', nhom: 'Xã hội' },
]

type Tho = Omit<Tu, 'id' | 'cd'>
const tho: Record<string, Tho[]> = { ...(A as Record<string, Tho[]>), ...(B as Record<string, Tho[]>) }

export const TU: Tu[] = []
export const TU_THEO_CD: Record<string, Tu[]> = {}
for (const cd of CHU_DE) {
  const ds = (tho[cd.id] ?? []).map((t, i) => ({ ...t, id: `${cd.id}-${i}`, cd: cd.id }) as Tu)
  TU_THEO_CD[cd.id] = ds
  TU.push(...ds)
}
export const TU_THEO_ID = new Map(TU.map((t) => [t.id, t]))
const theoEn = new Map<string, Tu>()
for (const t of TU) if (!theoEn.has(t.en.toLowerCase())) theoEn.set(t.en.toLowerCase(), t)
export const timTheoEn = (w: string) => theoEn.get(w.toLowerCase().trim())

export const CAP_DO = [
  { id: 'tat_ca', ten: 'Tất cả', mo: 'Trộn mọi cấp', lv: [1, 2, 3] },
  { id: 'de', ten: 'Lớp 3–5', mo: 'Từ cơ bản', lv: [1] },
  { id: 'vua', ten: 'Lớp 6–7', mo: 'Từ trung cấp', lv: [1, 2] },
  { id: 'kho', ten: 'Lớp 8–9', mo: 'Từ nâng cao', lv: [2, 3] },
] as const
export type CapDo = (typeof CAP_DO)[number]['id']

export const tenChuDe = (id: string) =>
  id === 'tron' ? 'Trộn tất cả' : id === 'auto' ? 'Ngẫu nhiên' : CHU_DE.find((c) => c.id === id)?.ten ?? id
export const iconChuDe = (id: string) => (id === 'tron' ? '🎲' : id === 'auto' ? '✨' : CHU_DE.find((c) => c.id === id)?.icon ?? '📚')

export const TEN_LOAI: Record<string, string> = { n: 'danh từ', v: 'động từ', adj: 'tính từ', adv: 'trạng từ', phr: 'cụm từ' }
