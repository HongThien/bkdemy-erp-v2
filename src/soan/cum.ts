// CỤM dùng sẵn + THƯ MỤC của tool soạn — do NGƯỜI SOẠN tự tạo (Thùy 04–05/09).
//   · Cụm 2 loại: `cong_thuc` = 1 công thức (LaTeX, có thể chứa ô trống `#?`) · `doan` = cả ĐOẠN văn kèm công thức
//     (bổ đề con dùng đi dùng lại; nội dung = chuỗi kho text có $…$, chèn nguyên đoạn vào bài).
//   · Thư mục = tới TỪNG CHƯƠNG của từng khối ("Hình 8 · Tứ giác") — trong 1 chương cụm lặp gần y hệt nhau.
// Mang nhãn `mon` + `nhanh` theo §1.6 (Toán{dai,hinh}); code KHÔNG có nhánh riêng cho môn nào.
//
// ⚠ BẢN THỬ (spike 05/09): lưu localStorage để Thùy gõ thử. Cụm + thư mục là dữ liệu DÙNG CHUNG nhiều người ⇒ theo
// CLAUDE.md §2 PHẢI chuyển sang bảng DB (+ đăng nhập) ngay khi chốt mô hình. Khi lên DB, thư mục nên trỏ được vào
// `chuong` của bản đồ kiến thức từng nhánh (dai_ban_do / hgt_ban_do…) thay vì tên tự do — để cụm đi cùng dạng.
import { previewLatex } from '../lib/math/templates'

export type LoaiCum = 'cong_thuc' | 'doan'
export type Cum = {
  id: string
  ten: string
  loai: LoaiCum
  noiDung: string        // cong_thuc: LaTeX (có thể có `#?`) · doan: chuỗi kho (text + $…$)
  goTat?: string         // gõ chữ này rồi Space trong bài → thay bằng cụm
  phim?: string          // tổ hợp 'Ctrl+Alt+F' (theo lib/math/phimtat)
  mon: string            // 'Toán' | 'Văn' | 'Anh' | 'KHTN'
  nhanh?: string         // Toán: 'dai' | 'hinh'
  thuMucId?: string      // không có = "Chung"
  tab?: number           // ô trên THANH TAB (1..10, kiểu MathType) của thư mục; 0 = ẩn khỏi thanh; thiếu = 1
  thuTu?: number         // thứ tự trong tab (kéo-thả sắp xếp); thiếu = xếp sau theo created
  created: number
}
export const sortCum = (a: Cum, b: Cum) => (a.thuTu ?? 1e9) - (b.thuTu ?? 1e9) || a.created - b.created
export type ThuMuc = {
  id: string
  ten: string            // tên chương: "Tứ giác"
  mon: string
  nhanh?: string         // 'dai' | 'hinh'
  khoi?: number          // 6..12
  tabTen?: Record<string, string>   // tên đặt cho tab ("1" → "Cơ bản"); tab không tên hiện số
  created: number
}

export const NHANH_TEN: Record<string, string> = { dai: 'Đại', hinh: 'Hình' }
export const KHOI = [6, 7, 8, 9, 10, 11, 12]
// Thanh tab 1..10 (Thùy 05/09: "như MathType, mỗi ô hiển thị 1 hàng công thức bên dưới → lưu rất nhiều mà không tốn diện tích").
export const TAB_MAX = 10
export const TABS = Array.from({ length: TAB_MAX }, (_, i) => i + 1)
export const tabOf = (c: Cum) => c.tab ?? 1

const KEY_V1 = 'soan.cum.v1'
const KEY = 'soan.cum.v2'
const KEY_TM = 'soan.thumuc.v1'
const KEY_TAB_CHUNG = 'soan.tabchung.v1'   // tên tab của nhóm Chung (không có thư mục để chứa)
const DRAFT_KEY = 'soan.draft.v1'

export const hasBlank = (s: string) => s.includes('#?')
export const needsFill = (c: Cum) => c.loai === 'cong_thuc' && hasBlank(c.noiDung)
// Chuỗi kho để CHÈN vào bài (cong_thuc → bọc $…$; doan → nguyên đoạn).
export const insertRawOf = (c: Cum) => (c.loai === 'doan' ? c.noiDung : `$${c.noiDung}$`)
// Chuỗi kho để PREVIEW trên bảng (ô trống → ô xám).
export const previewRaw = (c: Cum) => (c.loai === 'doan' ? c.noiDung : `$${previewLatex(c.noiDung)}$`)
export const tenThuMuc = (t: ThuMuc) => `${NHANH_TEN[t.nhanh ?? ''] ?? 'Chung'} ${t.khoi ?? ''}`.trim() + ` · ${t.ten}`

const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2))

// Vài thư mục + cụm VÍ DỤ để bảng không trống lần đầu mở — Thùy xoá/sửa tuỳ ý, bộ chuẩn do chị nhập.
const SEED_TM: Omit<ThuMuc, 'id' | 'created'>[] = [
  { ten: 'Tứ giác', mon: 'Toán', nhanh: 'hinh', khoi: 8 },
  { ten: 'Tam giác đồng dạng', mon: 'Toán', nhanh: 'hinh', khoi: 8 },
  { ten: 'Phân thức đại số', mon: 'Toán', nhanh: 'dai', khoi: 8 },
]
type SeedCum = Omit<Cum, 'id' | 'created' | 'thuMucId'> & { tm?: string }
const SEED: SeedCum[] = [
  { ten: 'Song song', loai: 'cong_thuc', noiDung: '#? \\parallel #?', goTat: 'ss', mon: 'Toán', nhanh: 'hinh', tm: 'Tứ giác' },
  { ten: 'Vuông góc', loai: 'cong_thuc', noiDung: '#? \\perp #?', goTat: 'vg', mon: 'Toán', nhanh: 'hinh', tm: 'Tứ giác' },
  { ten: 'Hình bình hành → cạnh đối', loai: 'doan', noiDung: 'Vì $ABCD$ là hình bình hành nên $AB \\parallel CD$ và $AB = CD$.', goTat: 'hbh', mon: 'Toán', nhanh: 'hinh', tm: 'Tứ giác' },
  { ten: 'Tam giác bằng nhau', loai: 'cong_thuc', noiDung: '\\triangle #? = \\triangle #?', goTat: 'tgbn', mon: 'Toán', nhanh: 'hinh', tm: 'Tam giác đồng dạng' },
  { ten: 'Tam giác đồng dạng', loai: 'cong_thuc', noiDung: '\\triangle #? \\sim \\triangle #?', goTat: 'tgdd', mon: 'Toán', nhanh: 'hinh', tm: 'Tam giác đồng dạng' },
  { ten: 'Đồng dạng (g.g)', loai: 'doan', noiDung: 'Xét $\\triangle ABC$ và $\\triangle DEF$ có $\\widehat{A} = \\widehat{D}$ và $\\widehat{B} = \\widehat{E}$ nên $\\triangle ABC \\sim \\triangle DEF$ (g.g).', goTat: 'gg', mon: 'Toán', nhanh: 'hinh', tm: 'Tam giác đồng dạng' },
  { ten: 'Góc', loai: 'cong_thuc', noiDung: '\\widehat{#?}', goTat: 'goc', mon: 'Toán', nhanh: 'hinh' },
  { ten: 'Pytago', loai: 'cong_thuc', noiDung: '#?^2 = #?^2 + #?^2', goTat: 'pyta', mon: 'Toán', nhanh: 'hinh' },
  { ten: 'Suy ra', loai: 'cong_thuc', noiDung: '\\Rightarrow', goTat: 'sr', mon: 'Toán' },
  { ten: 'Tương đương', loai: 'cong_thuc', noiDung: '\\Leftrightarrow', goTat: 'td', mon: 'Toán' },
  { ten: 'Phân số', loai: 'cong_thuc', noiDung: '\\frac{#?}{#?}', goTat: 'ps', mon: 'Toán', nhanh: 'dai', tm: 'Phân thức đại số' },
  { ten: 'Điều kiện xác định', loai: 'doan', noiDung: 'Điều kiện xác định: $x \\ne 0$ và $x \\ne 1$.', goTat: 'dkxd', mon: 'Toán', nhanh: 'dai', tm: 'Phân thức đại số' },
  { ten: 'Căn bậc hai', loai: 'cong_thuc', noiDung: '\\sqrt{#?}', goTat: 'can', mon: 'Toán', nhanh: 'dai' },
  { ten: 'x thuộc R', loai: 'cong_thuc', noiDung: 'x \\in \\mathbb{R}', goTat: 'xr', mon: 'Toán', nhanh: 'dai' },
  { ten: 'Hệ phương trình', loai: 'cong_thuc', noiDung: '\\begin{cases}#?\\\\#?\\end{cases}', goTat: 'hpt', mon: 'Toán', nhanh: 'dai' },
]

const read = <T,>(key: string): T | null => { try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : null } catch { return null } }
const write = (key: string, v: unknown) => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* bỏ qua */ } }

export function loadThuMucs(): ThuMuc[] {
  const cur = read<ThuMuc[]>(KEY_TM)
  if (cur) return cur
  const list = SEED_TM.map((t, i) => ({ ...t, id: newId(), created: Date.now() + i }))
  write(KEY_TM, list)
  return list
}
export const saveThuMucs = (l: ThuMuc[]) => write(KEY_TM, l)
export const loadTabChung = (): Record<string, string> => read<Record<string, string>>(KEY_TAB_CHUNG) ?? {}
export const saveTabChung = (m: Record<string, string>) => write(KEY_TAB_CHUNG, m)
export const makeThuMuc = (t: Omit<ThuMuc, 'id' | 'created'>): ThuMuc => ({ ...t, id: newId(), created: Date.now() })

export function loadCums(thuMucs: ThuMuc[]): Cum[] {
  const cur = read<Cum[]>(KEY)
  if (cur) return cur
  // Bản v1 (chỉ công thức) → nâng lên v2, giữ cụm người dùng đã tạo.
  const v1 = read<Array<{ id: string; ten: string; latex: string; goTat?: string; phim?: string; mon: string; nhanh?: string; created: number }>>(KEY_V1)
  if (v1) {
    const list: Cum[] = v1.map(({ latex, ...c }) => ({ ...c, loai: 'cong_thuc', noiDung: latex }))
    write(KEY, list)
    return list
  }
  const tmId = (ten?: string) => (ten ? thuMucs.find((t) => t.ten === ten)?.id : undefined)
  const list: Cum[] = SEED.map(({ tm, ...c }, i) => ({ ...c, thuMucId: tmId(tm), id: newId(), created: Date.now() + i }))
  write(KEY, list)
  return list
}
export const saveCums = (l: Cum[]) => write(KEY, l)
export const makeCum = (c: Omit<Cum, 'id' | 'created'>): Cum => ({ ...c, id: newId(), created: Date.now() })

export const findCumByCombo = (list: Cum[], combo: string) => list.find((c) => c.phim === combo) ?? null
export const findCumByGoTat = (list: Cum[], word: string) => {
  const w = word.toLowerCase()
  return list.find((c) => c.goTat && c.goTat.toLowerCase() === w) ?? null
}

export function loadDraft(): string { try { return localStorage.getItem(DRAFT_KEY) ?? '' } catch { return '' } }
export function saveDraft(s: string) { try { localStorage.setItem(DRAFT_KEY, s) } catch { /* bỏ qua */ } }
