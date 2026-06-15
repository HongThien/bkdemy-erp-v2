import { create } from 'zustand'
import { users, opTasks, devTasks, adminLeaves, classesOfCoSo, worktypesByVai } from '../mock/fixtures'
import { myQuyen, type MyQuyen } from '../lib/quyen'
import type { User, Vai, NavGroup, NavLeaf, AdminLeaf } from '../types'

interface UiState {
  currentUserId: string
  screen: 'nhansu' | 'admin'
  staffLeaf: string
  adminLeaf: string
  // ── Quyền feature-access THẬT (từ tài khoản đăng nhập, rpc my_quyen). null = chưa load ──
  quyen: MyQuyen | null
  setCurrentUser: (id: string) => void
  setScreen: (s: 'nhansu' | 'admin') => void
  setStaffLeaf: (id: string) => void
  setAdminLeaf: (id: string) => void
  loadQuyen: () => Promise<void>
  clearQuyen: () => void
}

export const useStore = create<UiState>((set) => ({
  currentUserId: users[0].id,
  screen: 'nhansu',
  staffLeaf: 'viec',
  adminLeaf: 'db_tongquan',
  quyen: null,
  setCurrentUser: (id) => set({ currentUserId: id, screen: 'nhansu', staffLeaf: 'viec' }),
  setScreen: (s) => set({ screen: s }),
  setStaffLeaf: (id) => set({ staffLeaf: id }),
  setAdminLeaf: (id) => set({ adminLeaf: id }),
  loadQuyen: async () => { try { set({ quyen: await myQuyen() }) } catch { set({ quyen: { laAdmin: false, chucNang: [] } }) } },
  clearQuyen: () => set({ quyen: null }),
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
export const adminNavFromQuyen = (q: MyQuyen | null): NavGroup[] => {
  const leaves = accessibleLeaves(q)
  const nhoms = [...new Set(leaves.map((l) => l.nhom))]
  return nhoms.map((n) => ({ nhom: n, leaves: leaves.filter((l) => l.nhom === n).map((l) => ({ id: l.id, ten: l.ten })) }))
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

// Cây Nhân sự 2 tầng: Việc của tôi + (Tra cứu & sửa: loại-việc → lớp), derive theo role
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
