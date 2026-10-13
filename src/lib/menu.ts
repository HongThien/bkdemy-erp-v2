// Menu ERP nhìn theo kiểu HOME (Thùy 13/10): mỗi NHÓM lớn = 1 box, bấm mới mở các mục con; có mục
// Yêu thích do từng người tự chọn. File này chỉ giữ phần TRÌNH BÀY (icon, màu, cách tra một mục) —
// danh mục mục nào tồn tại / ai được thấy vẫn ở `adminLeaves` + `adminNavFromQuyen` (store), không lặp lại ở đây.
import type { NavGroup, NavLeaf } from '../types'

export const LEAF_HOME = 'home'
export const LEAF_VIEC = 'viec'
// Trang của một nhóm trên Home = leaf 'home:<tên nhóm>' → Back quay đúng về trang nhóm vừa mở.
export const leafNhom = (nhom: string) => `${LEAF_HOME}:${nhom}`
export const laHome = (leaf: string) => leaf === LEAF_HOME || leaf.startsWith(`${LEAF_HOME}:`)
export const nhomCuaLeafHome = (leaf: string): string | null => (leaf.startsWith(`${LEAF_HOME}:`) ? leaf.slice(LEAF_HOME.length + 1) : null)

// Màu của box — đúng "kiểu 2" (CLAUDE.md §6): nền pastel nhạt + icon trong khối bo tròn riêng.
export type Tone = { bg: string; ill: string; chu: string; vien: string }
const TONE: Record<string, Tone> = {
  indigo:  { bg: 'bg-indigo-50',  ill: 'bg-indigo-100',  chu: 'text-indigo-700',  vien: 'hover:border-indigo-300' },
  sky:     { bg: 'bg-sky-50',     ill: 'bg-sky-100',     chu: 'text-sky-700',     vien: 'hover:border-sky-300' },
  amber:   { bg: 'bg-amber-50',   ill: 'bg-amber-100',   chu: 'text-amber-700',   vien: 'hover:border-amber-300' },
  violet:  { bg: 'bg-violet-50',  ill: 'bg-violet-100',  chu: 'text-violet-700',  vien: 'hover:border-violet-300' },
  emerald: { bg: 'bg-emerald-50', ill: 'bg-emerald-100', chu: 'text-emerald-700', vien: 'hover:border-emerald-300' },
  rose:    { bg: 'bg-rose-50',    ill: 'bg-rose-100',    chu: 'text-rose-700',    vien: 'hover:border-rose-300' },
  teal:    { bg: 'bg-teal-50',    ill: 'bg-teal-100',    chu: 'text-teal-700',    vien: 'hover:border-teal-300' },
  slate:   { bg: 'bg-slate-100',  ill: 'bg-slate-200',   chu: 'text-slate-700',   vien: 'hover:border-slate-300' },
}
const NHOM_META: Record<string, { icon: string; tone: keyof typeof TONE }> = {
  'Vận hành': { icon: '🛠', tone: 'sky' },
  'Gamification': { icon: '🏆', tone: 'amber' },
  'Học thuật': { icon: '📚', tone: 'violet' },
  'Quản lý chất lượng': { icon: '🎯', tone: 'emerald' },
  'Core team': { icon: '👥', tone: 'rose' },
  'Dashboard': { icon: '📊', tone: 'teal' },
}
export const VIEC_META = { icon: '✅', tone: TONE.indigo }
export const nhomMeta = (nhom: string | null): { icon: string; tone: Tone } => {
  const m = nhom ? NHOM_META[nhom] : undefined
  return m ? { icon: m.icon, tone: TONE[m.tone] } : { icon: '📁', tone: TONE.slate }
}

// Icon từng mục — chỉ để quét mắt cho nhanh; mục chưa có icon dùng icon của nhóm.
const LEAF_ICON: Record<string, string> = {
  viec: '✅',
  // Vận hành
  buoihoc: '🗓', ops_report: '📣', prep: '🧹', phancong_ops: '🧑‍🤝‍🧑', hs: '🎒', lop: '🏫', tuyensinh: '🎚', test_dau_vao: '📝',
  botro: '🩹', phong_hoc: '🚪', tu_qua: '🎁', khaosat: '🕸', su_kien: '🎉',
  // Gamification
  diemso: '📈', thanhtich: '🥇', quanlylevel: '🪜', chotxu: '🪙', huyhieu: '🎖', huyhieu_trao: '🏅', chuoi_nghi: '🏖', tinh_nang: '🎛', traogiai: '🏆',
  // Học thuật
  bdkt: '🗺', cau_bao_loi: '⚑', bdm: '🧭', sotay: '📓', tl: '🗂', khodethi: '📑', nhapkho: '📥',
  lamtailieu: '✍️', 'lamtailieu:giao_trinh': '📘', 'lamtailieu:giao_trinh_hinh': '📐', 'lamtailieu:et': '📝', 'lamtailieu:mt': '🏁', 'lamtailieu:bo_tro': '🩹',
  // Quản lý chất lượng
  ketqua: '📊', cham_mt: '✏️', duyetcham: '✔️', duyetloigiai: '🔎', db_hoctap: '🧠', db_theodoi_app: '📱', report_ph: '💌',
  // Core team
  hocphi: '💰', ns: '🪪', orgchart: '🌳', phancong: '📌', tkb: '⏰', phanquyen: '🔐', baoloi: '🐞', db_tuyendung: '🧲', giaoviec: '🚀', gay: '🏑', thuchi: '🧾',
  // Dashboard
  db_tongquan: '🌐', db_taichinh: '💹', db_chatluong: '⚙️', db_phdangnhap: '🔑', db_xemapp: '👀', db_thongbao: '📢',
}

export type MucMenu = { id: string; ten: string; nhom: string | null; cha: string | null; icon: string; tone: Tone }

// Trải cây nav thành danh sách MỤC MỞ ĐƯỢC (bỏ các cha chỉ là thư mục), giữ nhóm + tên thư mục cha.
export function traiMuc(groups: NavGroup[]): MucMenu[] {
  const out: MucMenu[] = []
  for (const g of groups) {
    const meta = nhomMeta(g.nhom)
    const di = (l: NavLeaf, cha: string | null) => {
      if (l.children?.length) { l.children.forEach((c) => di(c, l.ten)); return }
      const tone = l.id === LEAF_VIEC ? VIEC_META.tone : meta.tone
      out.push({ id: l.id, ten: l.ten, nhom: g.nhom, cha, icon: LEAF_ICON[l.id] ?? meta.icon, tone })
    }
    g.leaves.forEach((l) => di(l, null))
  }
  return out
}
