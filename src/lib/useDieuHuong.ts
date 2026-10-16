// MỘT nguồn cho mọi chỗ vẽ điều hướng (thanh trên desktop · thanh mobile · Trang chính): đang ở đâu, đường dẫn
// tới đó, lùi / tiến / lên cấp, ghim Yêu thích. Hai nơi vẽ không tự tính lại — tính 2 nơi là lệch nhau.
import { useMemo } from 'react'
import { useStore, useYeuThich, adminNavFromQuyen } from '../store/useStore'
import { adminLeaves } from '../mock/fixtures'
import { LEAF_HOME, LEAF_VIEC, MUC_PLAN, MUC_VIEC, cayMenu, duongDan, laHome, traiMuc } from './menu'

// Màn không có trên menu (chỉ vào được bằng card việc) — tên để hiện ở cuối đường dẫn.
const TEN_NGOAI_MENU: Record<string, string> = { test_dau_vao_scan: 'Scan bài đã chấm' }

export function useDieuHuong() {
  const { staffLeaf: leafStore, quyen, navIdx, navMax, lopPhu, capPhuEl, me, setStaffLeaf, backLeaf, tienLeaf, doiYeuThich, doiHomeAn, doiHomeThuTu, doiHomeDangCard } = useStore()
  const yeuThich = useYeuThich()
  const adminNav = useMemo(() => adminNavFromQuyen(quyen), [quyen])
  // Người CHỈ có "Việc của tôi" (không được cấp màn nào khác) thì Trang chính chỉ còn đúng 1 box — vô nghĩa,
  // thêm 1 cú bấm mỗi lần mở app. Với họ "nhà" = Việc của tôi như trước giờ.
  const coHome = adminNav.length > 0
  const nha = coHome ? LEAF_HOME : LEAF_VIEC
  const leaf = !coHome && laHome(leafStore) ? LEAF_VIEC : leafStore
  const cay = useMemo(() => cayMenu(adminNav, coHome), [adminNav, coHome])
  const duong = useMemo(() => duongDan(cay, leaf), [cay, leaf])
  const mucs = useMemo(() => [MUC_VIEC, MUC_PLAN, ...traiMuc(adminNav)], [adminNav])
  const mucHienTai = mucs.find((m) => m.id === leaf)
  const trongCay = duong[duong.length - 1].id === leaf
  const tenNgoai = trongCay ? null : (TEN_NGOAI_MENU[leaf] ?? adminLeaves.find((l) => l.id === leaf.split(':')[0])?.ten ?? null)
  // Cấp phụ sau màn đang mở: chi tiết đang mở đè lên (lopPhu) — hoặc tên màn ngoài menu.
  const duoi = lopPhu ?? tenNgoai
  // ☆ ghim màn đang mở: có Trang chính để ghim lên + màn này là 1 mục trong menu + có hồ sơ nhân sự để lưu.
  const ghimDuoc = coHome && !!mucHienTai && !!me && !lopPhu
  const len = () => {
    if (capPhuEl) { capPhuEl.dong(); return }   // màn đang ở cấp phụ có nút quay về riêng ⇒ ↑ = bấm nút đó
    if (lopPhu) { backLeaf(); return }
    const cha = (trongCay ? duong.slice(0, -1) : duong).slice().reverse().find((n) => n.id)
    if (cha?.id) setStaffLeaf(cha.id)
  }
  return {
    leaf, nha, coHome, adminNav, mucs, mucHienTai, duong, duoi, lopPhu,
    coLui: navIdx > 0 || !!capPhuEl, coTien: navIdx < navMax, coLen: !!capPhuEl || !!lopPhu || !trongCay || duong.length > 1,
    lui: () => (capPhuEl ? capPhuEl.dong() : backLeaf()), tien: tienLeaf, len, di: setStaffLeaf,
    ghimDuoc, daGhim: yeuThich.includes(leaf), ghim: () => doiYeuThich(leaf), yeuThich, doiYeuThich, doiHomeAn, doiHomeThuTu, doiHomeDangCard, me,
  }
}
