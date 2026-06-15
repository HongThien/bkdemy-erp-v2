import { create } from 'zustand'
import { users, opTasks, devTasks, adminLeaves, classesOfCoSo, worktypesByVai } from '../mock/fixtures'
import { myQuyen, type MyQuyen } from '../lib/quyen'
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
  loadQuyen: async () => { try { set({ quyen: await myQuyen() }) } catch { set({ quyen: { laAdmin: false, chucNang: [] } }) } },
  loadMe: async () => { try { set({ me: await getMyProfile() }) } catch { set({ me: null }) } },
  clearQuyen: () => set({ quyen: null, me: null }),
}))

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
export const LAMTAILIEU_CHILDREN: NavLeaf[] = [
  { id: 'lamtailieu:giao_trinh', ten: 'Giáo trình' },
  { id: 'lamtailieu:et', ten: 'ET' },
  { id: 'lamtailieu:de_thi', ten: 'Đề thi' },
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

// Cây Nhân sự THẬT (từ getMyScope): Việc của tôi + (Tra cứu & sửa: loại-việc → lớp tôi phụ trách).
export const staffNavFromScope = (scope: MyScope | null): NavGroup[] => {
  const groups: NavGroup[] = [{ nhom: null, leaves: [{ id: 'viec', ten: 'Việc của tôi' }] }]
  if (!scope) return groups
  const m = new Map<string, { ten: string; lops: Set<string> }>() // wtKey → {ten, ten_lop set}
  for (const sl of scope.trucTiep)
    for (const wt of sl.worktypes) {
      const e = m.get(wt.key) ?? { ten: wt.ten, lops: new Set<string>() }
      e.lops.add(sl.ten_lop); m.set(wt.key, e)
    }
  const nodes: NavLeaf[] = [...m.entries()].map(([key, e]) => ({
    id: `tc:${key}`, ten: e.ten,
    children: [...e.lops].map((ten) => ({ id: `tc:${key}:${ten}`, ten })),
  }))
  if (nodes.length) groups.push({ nhom: 'Tra cứu & sửa', leaves: nodes })
  return groups
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
