// Menu ERP nhìn theo kiểu HOME + ĐƯỜNG DẪN (Thùy 13/10): mỗi NHÓM lớn = 1 box, bấm mới mở các mục con; có mục
// Yêu thích do từng người tự chọn; thanh địa chỉ kiểu Windows Explorer nhảy về bất cứ cấp nào.
// File này chỉ giữ phần TRÌNH BÀY (icon, mô tả, cây để đi lại) — mục nào tồn tại / ai được thấy vẫn ở
// `adminLeaves` + `adminNavFromQuyen` (store), không lặp lại ở đây. Màu + hình: `erpSkin.ts`.
import type { NavGroup, NavLeaf } from '../types'

export const LEAF_HOME = 'home'
export const LEAF_VIEC = 'viec'
// Số mục Yêu thích tối đa mỗi người ghim (Thùy 14/10: 8 · đổi 21/10: 12). MỘT chỗ cho mọi nơi dùng (luật ghim, cảnh, trang đánh dấu ô).
export const YEU_THICH_TOI_DA = 12
export const LEAF_PLAN = 'myplan'   // Kế hoạch của tôi (MyPlan, Thùy 16/10) — mọi nhân sự đều có
// Trang của một nhóm trên Home = leaf 'home:<tên nhóm>' → Back quay đúng về trang nhóm vừa mở.
export const leafNhom = (nhom: string) => `${LEAF_HOME}:${nhom}`
export const laHome = (leaf: string) => leaf === LEAF_HOME || leaf.startsWith(`${LEAF_HOME}:`)
export const nhomCuaLeafHome = (leaf: string): string | null => (leaf.startsWith(`${LEAF_HOME}:`) ? leaf.slice(LEAF_HOME.length + 1) : null)

// Icon chữ (emoji) của nhóm — dùng ở chỗ NHỎ (thanh địa chỉ, menu thả). Box to trên Home dùng hình vẽ (`ANH_NHOM`).
const NHOM_ICON: Record<string, string> = {
  'Vận hành': '🛠', 'Gamification': '🏆', 'Học thuật': '📚', 'Quản lý chất lượng': '🎯', 'Core team': '👥', 'Dashboard': '📊',
}
export const nhomIcon = (nhom: string | null) => (nhom && NHOM_ICON[nhom]) || '📁'
// Một dòng nói nhóm này để làm gì (dòng phụ trên box — như "Luyện theo dạng yếu" ở Home app HS).
export const NHOM_MO_TA: Record<string, string> = {
  'Vận hành': 'Buổi học · học sinh · bổ trợ',
  'Gamification': 'Điểm · thành tích · huy hiệu',
  'Học thuật': 'Kho kiến thức · soạn tài liệu',
  'Quản lý chất lượng': 'Kết quả · duyệt · báo cáo',
  'Core team': 'Nhân sự · học phí · phân công',
  'Dashboard': 'Số liệu để ra quyết định',
}
export const VIEC_MO_TA = 'Việc cần làm trong tuần'

// Icon từng mục — chỉ để quét mắt cho nhanh; mục chưa có icon dùng icon của nhóm.
const LEAF_ICON: Record<string, string> = {
  viec: '✅', myplan: '🗂',
  // Vận hành
  buoihoc: '🗓', ops_report: '📣', prep: '🧹', phancong_ops: '🧑‍🤝‍🧑', hs: '🎒', lop: '🏫', tuyensinh: '🎚', test_dau_vao: '📝',
  botro: '🩹', qlcl_team: '🧭', phong_hoc: '🚪', tu_qua: '🎁', su_kien: '🎉', hs_moi: '📋',
  // Gamification
  diemso: '📈', thanhtich: '🥇', quanlylevel: '🪜', chotxu: '🪙', tinh_nang: '🎛', traogiai: '🏆',
  // Học thuật
  bdkt: '🗺', cau_bao_loi: '⚑', bdm: '🧭', sotay: '📓', tl: '🗂', khodethi: '📑', nhapkho: '📥',
  lamtailieu: '✍️', 'lamtailieu:giao_trinh_bdm': '🗺️', 'lamtailieu:giao_trinh': '📘', 'lamtailieu:et_bdm': '🗺️', 'lamtailieu:et': '📝', 'lamtailieu:chuyen_de': '📚', 'lamtailieu:mt': '🏁', 'lamtailieu:bo_tro': '🩹',
  // Quản lý chất lượng
  ketqua: '📊', cham_mt: '✏️', duyetcham: '✔️', duyetloigiai: '🔎', db_hoctap: '🧠', db_cuoicap: '🎯',db_theodoi_app: '📱', report_ph: '💌',
  // Core team
  hocphi: '💰', ns: '🪪', orgchart: '🌳', phancong: '📌', tkb: '⏰', phanquyen: '🔐', baoloi: '🐞', giaoviec: '🚀', gay: '🏑', thuchi: '🧾', ta_cong_duyet: '🕘', ta_luong: '💵',
  // Dashboard
  db_chatluong: '⚙️', db_phdangnhap: '🔑', db_xemapp: '👀', db_thongbao: '📢',
}

export type MucMenu = { id: string; ten: string; nhom: string | null; cha: string | null; icon: string }

// Trải cây nav thành danh sách MỤC MỞ ĐƯỢC (bỏ các cha chỉ là thư mục), giữ nhóm + tên thư mục cha.
export function traiMuc(groups: NavGroup[]): MucMenu[] {
  const out: MucMenu[] = []
  for (const g of groups) {
    const di = (l: NavLeaf, cha: string | null) => {
      if (l.children?.length) { l.children.forEach((c) => di(c, l.ten)); return }
      out.push({ id: l.id, ten: l.ten, nhom: g.nhom, cha, icon: LEAF_ICON[l.id] ?? nhomIcon(g.nhom) })
    }
    g.leaves.forEach((l) => di(l, null))
  }
  return out
}
export const MUC_VIEC: MucMenu = { id: LEAF_VIEC, ten: 'Việc của tôi', nhom: null, cha: null, icon: LEAF_ICON.viec }
export const MUC_PLAN: MucMenu = { id: LEAF_PLAN, ten: 'Kế hoạch của tôi', nhom: null, cha: null, icon: LEAF_ICON.myplan }

// ── CÂY để đi lại (thanh địa chỉ) ─────────────────────────────────────────────
// id = leaf sẽ mở khi bấm; id null = THƯ MỤC không có trang riêng (vd "Vận hành lớp học") — bấm thì xổ các mục con.
export type NutMenu = { id: string | null; ten: string; icon: string; con?: NutMenu[] }

// `coHome` = người này có Trang chính (được cấp ≥1 màn ngoài "Việc của tôi"). Không có thì gốc cây = Việc của tôi.
export function cayMenu(adminNav: NavGroup[], coHome: boolean): NutMenu {
  const viec: NutMenu = { id: LEAF_VIEC, ten: MUC_VIEC.ten, icon: MUC_VIEC.icon }
  const plan: NutMenu = { id: LEAF_PLAN, ten: MUC_PLAN.ten, icon: MUC_PLAN.icon }
  // Người không có Trang chính: gốc = Việc của tôi, Kế hoạch của tôi nằm ngay dưới (đường dẫn "Việc của tôi › Kế hoạch của tôi").
  if (!coHome) return { ...viec, con: [plan] }
  const nut = (l: NavLeaf, nhom: string | null): NutMenu => (l.children?.length
    ? { id: null, ten: l.ten, icon: LEAF_ICON[l.id] ?? '📁', con: l.children.map((c) => nut(c, nhom)) }
    : { id: l.id, ten: l.ten, icon: LEAF_ICON[l.id] ?? nhomIcon(nhom) })
  return {
    id: LEAF_HOME, ten: 'Trang chính', icon: '🏠',
    con: [viec, plan, ...adminNav.map((g): NutMenu => ({ id: leafNhom(g.nhom ?? ''), ten: g.nhom ?? '', icon: nhomIcon(g.nhom), con: g.leaves.map((l) => nut(l, g.nhom)) }))],
  }
}

// Đường từ gốc tới màn đang mở. Màn không nằm trong cây (vào bằng card việc, vd "Scan bài đã chấm") ⇒ chỉ có gốc.
export function duongDan(cay: NutMenu, leaf: string): NutMenu[] {
  const tim = (n: NutMenu, truoc: NutMenu[]): NutMenu[] | null => {
    const day = [...truoc, n]
    if (n.id === leaf) return day
    for (const c of n.con ?? []) { const r = tim(c, day); if (r) return r }
    return null
  }
  return tim(cay, []) ?? [cay]
}
