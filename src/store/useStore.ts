import { create } from 'zustand'
import { users, opTasks, devTasks, adminLeaves, classesOfCoSo, worktypesByVai } from '../mock/fixtures'
import { myQuyen, type MyQuyen } from '../lib/quyen'
import { setReadOnlyLeafGetter } from '../lib/supabase'
import { getMyProfile, type MyProfile, type MyScope } from '../lib/nhansu'
import type { User, Vai, NavGroup, NavLeaf, AdminLeaf } from '../types'

interface UiState {
  currentUserId: string
  screen: 'nhansu' | 'admin'
  staffLeaf: string
  adminLeaf: string
  // ── Danh tính + quyền THẬT (từ tài khoản đăng nhập). null = chưa load ──
  quyen: MyQuyen | null
  me: MyProfile | null            // nhân sự thật của account đang đăng nhập (getMyProfile)
  setCurrentUser: (id: string) => void
  setScreen: (s: 'nhansu' | 'admin') => void
  setStaffLeaf: (id: string) => void
  setAdminLeaf: (id: string) => void
  loadQuyen: () => Promise<void>
  loadMe: () => Promise<void>
  clearQuyen: () => void
  // ── Bộ lọc màn Học phí — giữ NGUYÊN khi rời/quay lại màn (component unmount không mất chọn) ──
  hocPhiTab: string
  hocPhiKy: string
  hocPhiPhId: string | null
  setHocPhiTab: (t: string) => void
  setHocPhiKy: (k: string) => void
  setHocPhiPhId: (id: string | null) => void
  // ── Bộ lọc màn Chất lượng vận hành — giữ NGUYÊN khi rời/quay lại màn ──────
  dbVanHanhKy: string          // 'YYYY-MM', rỗng = tháng hiện tại
  dbVanHanhView: 'theonguoi' | 'theomuc' | 'chitiet' | 'duyet'   // 4 TẦNG TRÊN (Thùy chốt 07-05 lần 4: +Duyệt chất lượng)
  dbVanHanhMuc: 'tatca' | 'ops' | 'ta' | 'gv'          // dùng trong tab Theo mục + filter Chi tiết
  dbVanHanhNsId: string | null                          // dùng trong tab Theo người + filter Chi tiết
  setDbVanHanhKy: (k: string) => void
  setDbVanHanhView: (v: 'theonguoi' | 'theomuc' | 'chitiet' | 'duyet') => void
  setDbVanHanhMuc: (m: 'tatca' | 'ops' | 'ta' | 'gv') => void
  setDbVanHanhNsId: (id: string | null) => void
}

export const useStore = create<UiState>((set) => ({
  currentUserId: users[0].id,
  screen: 'nhansu',
  staffLeaf: 'viec',
  adminLeaf: 'db_tongquan',
  quyen: null,
  me: null,
  setCurrentUser: (id) => set({ currentUserId: id, screen: 'nhansu', staffLeaf: 'viec' }),
  setScreen: (s) => set({ screen: s }),
  setStaffLeaf: (id) => set({ staffLeaf: id }),
  setAdminLeaf: (id) => set({ adminLeaf: id }),
  loadQuyen: async () => { try { set({ quyen: await myQuyen() }) } catch { set({ quyen: { laAdmin: false, chucNang: [], chiXem: [] } }) } },
  loadMe: async () => { try { set({ me: await getMyProfile() }) } catch { set({ me: null }) } },
  clearQuyen: () => set({ quyen: null, me: null }),
  hocPhiTab: 'theomon',
  hocPhiKy: '',
  hocPhiPhId: null,
  setHocPhiTab: (t) => set({ hocPhiTab: t }),
  setHocPhiKy: (k) => set({ hocPhiKy: k }),
  setHocPhiPhId: (id) => set({ hocPhiPhId: id }),
  dbVanHanhKy: '',
  dbVanHanhView: 'theonguoi',
  dbVanHanhMuc: 'tatca',
  dbVanHanhNsId: null,
  setDbVanHanhKy: (k) => set({ dbVanHanhKy: k }),
  setDbVanHanhView: (v) => set({ dbVanHanhView: v }),
  setDbVanHanhMuc: (m) => set({ dbVanHanhMuc: m }),
  setDbVanHanhNsId: (id) => set({ dbVanHanhNsId: id }),
}))

// Nối gate "Chỉ xem" (RBAC ①) vào seam Supabase — xem lib/supabase.ts. Leaf con dạng
// "lamtailieu:et" dùng chung quyền với leaf cha "lamtailieu" (chỉ cha có trong chuc_nang/chi_xem).
setReadOnlyLeafGetter(() => {
  const { quyen, staffLeaf } = useStore.getState()
  if (!quyen || quyen.laAdmin) return null
  const leaf = staffLeaf.split(':')[0]
  return quyen.chiXem.includes(leaf) ? leaf : null
})

// ── Gate feature-access THẬT (lớp ①) — KHÔNG dùng cờ founderOnly mock nữa ─────────
// Founder (la_admin) thấy tất; người khác chỉ thấy leaf có trong chuc_nang được cấp.
export const accessibleLeaves = (q: MyQuyen | null): AdminLeaf[] => {
  if (!q) return []
  if (q.laAdmin) return adminLeaves
  const ok = new Set(q.chucNang)
  return adminLeaves.filter((l) => ok.has(l.id))
}
export const canAccessAdmin = (q: MyQuyen | null): boolean => accessibleLeaves(q).length > 0
// "Làm tài liệu" = node CHA, con hiện thẳng trong tree (1 click tới loại tài liệu cần).
// Đề thi KHÔNG ở đây — đó là luồng NHẬP KHO (đề thật → bóc → đổ vào kho), ngược chiều với
// giáo trình/ET (kho có sẵn → ghép ra tài liệu). Xem leaf `nhapkho` (tab "Nhập đề thi").
export const LAMTAILIEU_CHILDREN: NavLeaf[] = [
  { id: 'lamtailieu:giao_trinh', ten: 'Giáo trình' },
  { id: 'lamtailieu:et', ten: 'ET' },
  { id: 'lamtailieu:bo_tro', ten: 'Tài liệu bổ trợ' },
]
export const adminNavFromQuyen = (q: MyQuyen | null): NavGroup[] => {
  const leaves = accessibleLeaves(q)
  const nhoms = [...new Set(leaves.map((l) => l.nhom))]
  return nhoms.map((n) => ({
    nhom: n,
    leaves: leaves.filter((l) => l.nhom === n).map((l): NavLeaf =>
      l.id === 'lamtailieu' ? { id: l.id, ten: l.ten, children: LAMTAILIEU_CHILDREN } : { id: l.id, ten: l.ten }),
  }))
}

// ── Selectors (mock derive theo role) ────────────────────────────
export const getUser = (id: string): User => users.find((u) => u.id === id)!
export const vaisOf = (u: User): Vai[] => [...new Set(u.roles.map((r) => r.vai))]
export const canAdmin = (u: User): boolean =>
  u.roles.some((r) => r.vai === 'Founder' || r.vai === 'AdminCoSo')

export const opTasksForUser = (u: User) =>
  opTasks.filter((t) =>
    u.roles.some(
      (r) =>
        r.vai === t.vai &&
        r.coSo === t.coSo &&
        (r.lops.length === 0 || !t.lop || r.lops.includes(t.lop)),
    ),
  )

export const devTasksForUser = (u: User) =>
  devTasks.filter((d) => d.assigneeUserId === u.id)

export const leavesForUser = (u: User) => {
  const isFounder = u.roles.some((r) => r.vai === 'Founder')
  return adminLeaves.filter((l) => isFounder || !l.founderOnly)
}

// Cây Admin (derive theo role) → NavGroup[] cho NavTree
export const adminNavForUser = (u: User): NavGroup[] => {
  const leaves = leavesForUser(u)
  const nhoms = [...new Set(leaves.map((l) => l.nhom))]
  return nhoms.map((n) => ({
    nhom: n,
    leaves: leaves.filter((l) => l.nhom === n).map((l) => ({ id: l.id, ten: l.ten })),
  }))
}

// Cây Nhân sự THẬT (từ getMyScope): chỉ "Việc của tôi" (vận hành). Mọi tra-cứu/sửa làm NGAY trong màn Việc-của-tôi
// (bấm card đã làm để sửa) → đã BỎ nhóm "Tra cứu & sửa" (placeholder, không link đâu). `scope` giữ cho tương lai.
export const staffNavFromScope = (_scope: MyScope | null): NavGroup[] => {
  return [{ nhom: null, leaves: [{ id: 'viec', ten: 'Việc của tôi' }] }]
}

// (cũ — mock) Cây Nhân sự 2 tầng derive theo role mock. Giữ tạm cho tham chiếu.
export const staffNavForUser = (u: User): NavGroup[] => {
  const nodes: NavLeaf[] = []
  const seen = new Set<string>()
  for (const r of u.roles) {
    const wts = worktypesByVai[r.vai]
    if (!wts) continue
    const classes = r.lops.length ? r.lops : classesOfCoSo[r.coSo]
    for (const wt of wts) {
      const id = `tc:${wt.key}`
      if (seen.has(id)) continue
      seen.add(id)
      nodes.push({
        id,
        ten: wt.ten,
        children: classes.map((lop) => ({ id: `${id}:${lop}`, ten: lop })),
      })
    }
  }
  const groups: NavGroup[] = [{ nhom: null, leaves: [{ id: 'viec', ten: 'Việc của tôi' }] }]
  if (nodes.length) groups.push({ nhom: 'Tra cứu & sửa', leaves: nodes })
  return groups
}
