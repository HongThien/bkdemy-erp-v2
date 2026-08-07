import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { users, opTasks, devTasks, adminLeaves, classesOfCoSo, worktypesByVai } from '../mock/fixtures'
import { myQuyen, type MyQuyen } from '../lib/quyen'
import { setReadOnlyLeafGetter } from '../lib/supabase'
import { getMyProfile, type MyProfile, type MyScope } from '../lib/nhansu'
import { enqueueLinkGenJob } from '../lib/linkgen'
import type { User, Vai, NavGroup, NavLeaf, AdminLeaf } from '../types'

export type LinkGenJob = { id: string; loai: string; attempt: number }
export const MAX_LINKGEN_ATTEMPTS = 3

// Nháp ET đang soạn (chế độ TẠO MỚI) — giữ khi rời/quay lại màn để không mất công. cau/ch để lỏng (any)
// tránh coupling store với type kho. Sống trong RAM (không persist) → F5 mới mất.
export type EtDraft = {
  lopId: string | null; ngay: string; savedId: string | null
  rows: { maDang: string | null; maCau: string | null }[]
  cau: Record<string, any>; ch: Record<string, any>
}

// Nháp SOẠN TÀI LIỆU Hình — giữ khi rời/quay lại màn (như etDraft). Theo KHỐI (mỗi khối 1 nháp).
// Sống trong RAM (không persist) → F5 mới mất. Chỉ giữ LỰA CHỌN (Set→mảng, Map→record) — pool bài
// re-fetch lại khi quay lại, không nhét vào nháp.
export type SoanHinhDraft = {
  che: 'gd' | 'mh' | 'ot'
  gd: { aId: string; bId: string; daHoc: string[]; themVao: string[] }
  // sel: node → (khoá bài trong pool → 'lop' | 'nha'). Mỗi bài chỉ 1 phiếu ⇒ Lớp/Nhà KHÔNG bao giờ trùng.
  // ghep: bài a,b,c ghép từ 1 chuỗi. luaId null = ghép đề chuẩn (a,b,c gốc); có = ghép bản đổi đỉnh của lứa.
  // anDe: khoá bài (poolKey / ghepKey) có ẨN hình → chừa ô vẽ cho HS. Vắng = hiện hình (mặc định).
  mh: {
    mainId: string; satIds: string[]; nodeIds: string[]
    sel: Record<string, Record<string, 'lop' | 'nha'>>
    ghep: { key: string; phan: 'lop' | 'nha'; luaId: string | null; nodeIds: string[] }[]
    anDe: string[]
  }
  ot: { dangIds: string[]; gio: string[]; dkTu: string; dkDen: string }
}
export type GhepItem = SoanHinhDraft['mh']['ghep'][number]
export const SOAN_HINH_DEFAULT: SoanHinhDraft = {
  che: 'gd',
  gd: { aId: '', bId: '', daHoc: [], themVao: [] },
  mh: { mainId: '', satIds: [], nodeIds: [], sel: {}, ghep: [], anDe: [] },
  ot: { dangIds: [], gio: [], dkTu: '', dkDen: '' },
}

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
  // ── Nháp ET tạo-mới — giữ NGUYÊN khi rời/quay lại màn (không reset công đang soạn) ──
  etDraft: EtDraft | null
  setEtDraft: (d: EtDraft | null) => void
  // ── Nháp soạn tài liệu Hình theo khối — giữ khi rời/quay lại màn (như etDraft) ──
  soanHinh: Record<string, SoanHinhDraft>
  setSoanHinh: (khoi: string, updater: (cur: SoanHinhDraft) => SoanHinhDraft) => void
  // ── Bộ lọc màn Chất lượng vận hành — giữ NGUYÊN khi rời/quay lại màn ──────
  dbVanHanhKy: string          // 'YYYY-MM', rỗng = tháng hiện tại
  dbVanHanhView: 'theonguoi' | 'theomuc' | 'chitiet' | 'duyet'   // 4 TẦNG TRÊN (Thùy chốt 07-05 lần 4: +Duyệt chất lượng)
  dbVanHanhMuc: 'tatca' | 'ops' | 'ta' | 'gv'          // dùng trong tab Theo mục + filter Chi tiết
  dbVanHanhNsId: string | null                          // dùng trong tab Theo người + filter Chi tiết
  setDbVanHanhKy: (k: string) => void
  setDbVanHanhView: (v: 'theonguoi' | 'theomuc' | 'chitiet' | 'duyet') => void
  setDbVanHanhMuc: (m: 'tatca' | 'ops' | 'ta' | 'gv') => void
  setDbVanHanhNsId: (id: string | null) => void
  // ── Hàng đợi lấy-link PDF (07-12, ĐỜI 2 — chuyển sang SERVER) — Thùy: "t ko muốn phải chờ bất kì
  // chỗ nào... hệ thống phải tự chạy ẩn". `enqueueLinkGen` giờ CHỈ ghi 1 dòng 'pending' vào bảng
  // `linkgen_jobs` (xem lib/linkgen.ts) — máy người dùng KHÔNG render/upload gì nữa, worker server
  // (worker/index.mjs, Chrome thật, PDF chữ) tự xử. Các field queue/active/failed dưới đây là ĐỜI 1
  // (client-side render, đã ngừng dùng — LinkGenWorker không còn mount ở App.tsx), giữ tạm chờ Thùy
  // gật mới dọn (Luật xoá).
  linkGenQueue: LinkGenJob[]
  linkGenActive: LinkGenJob | null
  // Id đã hết MAX_LINKGEN_ATTEMPTS lần thử mà vẫn không xong — KHÔNG được để row lặng lẽ quay về y hệt
  // "chưa từng thử" (Thùy cần THẤY hệ thống đã cố mà thất bại, không phải đoán tiếp — cùng tinh thần
  // "phải thấy được hệ thống đang làm" ở trên).
  linkGenFailed: string[]
  enqueueLinkGen: (id: string, loai: string) => void
  shiftLinkGen: () => LinkGenJob | undefined
  setLinkGenActive: (job: LinkGenJob | null) => void
  timeoutLinkGenActive: (id: string) => void
}

export const useStore = create<UiState>()(persist((set, get) => ({
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
  etDraft: null,
  setEtDraft: (d) => set({ etDraft: d }),
  soanHinh: {},
  setSoanHinh: (khoi, updater) => set((s) => ({ soanHinh: { ...s.soanHinh, [khoi]: updater(s.soanHinh[khoi] ?? SOAN_HINH_DEFAULT) } })),
  dbVanHanhKy: '',
  dbVanHanhView: 'theonguoi',
  dbVanHanhMuc: 'tatca',
  dbVanHanhNsId: null,
  setDbVanHanhKy: (k) => set({ dbVanHanhKy: k }),
  setDbVanHanhView: (v) => set({ dbVanHanhView: v }),
  setDbVanHanhMuc: (m) => set({ dbVanHanhMuc: m }),
  setDbVanHanhNsId: (id) => set({ dbVanHanhNsId: id }),
  linkGenQueue: [],
  linkGenActive: null,
  linkGenFailed: [],
  // ĐỜI 2: chỉ ghi job vào DB (fire-and-forget) — 9 call site (các editor/Kho) giữ nguyên không sửa.
  enqueueLinkGen: (id, loai) => { enqueueLinkGenJob(id, loai) },
  shiftLinkGen: () => {
    const q = get().linkGenQueue
    if (q.length === 0) return undefined
    const [next, ...rest] = q
    set({ linkGenQueue: rest })
    return next
  },
  setLinkGenActive: (job) => set({ linkGenActive: job }),
  // Watchdog (LinkGenWorker) gọi khi 1 job "active" quá lâu không tự đóng — paged.js đôi khi TREO không
  // rõ nguyên nhân (xem DEVLOG). KHÔNG bỏ luôn — xếp lại CUỐI hàng đợi, tăng `attempt`, tối đa
  // MAX_LINKGEN_ATTEMPTS lần rồi mới chịu bỏ (Thùy vẫn có "↻" tự bấm cho ca hiếm-gặp còn lại).
  timeoutLinkGenActive: (id) => set((s) => {
    if (!s.linkGenActive || s.linkGenActive.id !== id) return s // đã tự đóng bình thường trước đó, watchdog bắn trễ → bỏ qua
    const job = s.linkGenActive
    const retry = job.attempt + 1 < MAX_LINKGEN_ATTEMPTS
    return {
      linkGenActive: null,
      linkGenQueue: retry ? [...s.linkGenQueue, { ...job, attempt: job.attempt + 1 }] : s.linkGenQueue,
      linkGenFailed: retry ? s.linkGenFailed : [...s.linkGenFailed.filter((x) => x !== id), id],
    }
  }),
}), {
  // Hàng đợi link-gen sống trong RAM (Zustand thuần) → F5/refresh/HMR full-reload XOÁ SẠCH job đang chờ,
  // KHÔNG CÓ DẤU VẾT (07-12: sau nhiều lần đổi code tối nay phải reload để nhận bản mới, rất nhiều lần
  // reload xảy ra trong lúc job còn dở/đang chờ trong hàng đợi) — đây gần như chắc là nguyên nhân thật
  // của "bấm nút, ko thấy hiện link" dù DB cho thấy KHÔNG có file_url mới được ghi suốt nhiều giờ liền.
  // Lưu vào localStorage để refresh không mất job đang chờ. CHỈ persist linkGenQueue/linkGenActive —
  // không đụng phần state khác của UiState (session/filter UI không cần sống qua reload).
  name: 'bkdemy-linkgen-queue',
  storage: createJSONStorage(() => localStorage),
  partialize: (s) => ({ linkGenQueue: s.linkGenQueue, linkGenActive: s.linkGenActive, linkGenFailed: s.linkGenFailed }),
  // job đang "active" lúc reload KHÔNG còn ai chạy nữa (JS process mới tinh) → dồn về ĐẦU hàng đợi để
  // LinkGenWorker nhặt lại từ đầu, không được coi là "vẫn đang chạy" (sẽ treo store mãi vì không có timer
  // watchdog nào được set lại cho nó).
  merge: (persisted, current) => {
    const p = (persisted ?? {}) as Partial<Pick<UiState, 'linkGenQueue' | 'linkGenActive' | 'linkGenFailed'>>
    const requeued = p.linkGenActive ? [p.linkGenActive] : []
    return { ...current, linkGenQueue: [...requeued, ...(p.linkGenQueue ?? [])], linkGenActive: null, linkGenFailed: p.linkGenFailed ?? [] }
  },
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
  { id: 'lamtailieu:mt', ten: 'MT' },
  { id: 'lamtailieu:bo_tro', ten: 'Tài liệu bổ trợ' },
]
// Gộp NHIỀU leaf con thành 1 leaf CHA (folder tầng 2, ẨN mặc định — bấm mới xoè tầng 3, giống
// "Làm tài liệu"). Cha chỉ xuất hiện khi CÒN ≥1 con sau lọc quyền (mỗi con vẫn 1 permission-id
// RIÊNG ở Phân quyền — khác `lamtailieu` dùng chung 1 quyền cho cả cha lẫn con); vị trí cha = vị
// trí của con ĐẦU TIÊN còn quyền trong mảng gốc (giữ chỗ tự nhiên, khỏi hard-code thứ tự cả nhóm).
function collapseGroup(leaves: NavLeaf[], parentId: string, parentTen: string, childIds: string[]): NavLeaf[] {
  const idx = leaves.findIndex((l) => childIds.includes(l.id))
  if (idx === -1) return leaves
  const kids = childIds.map((id) => leaves.find((l) => l.id === id)).filter((l): l is NavLeaf => !!l)
  const rest = leaves.filter((l) => !childIds.includes(l.id))
  rest.splice(idx, 0, { id: parentId, ten: parentTen, children: kids })
  return rest
}
export const adminNavFromQuyen = (q: MyQuyen | null): NavGroup[] => {
  const leaves = accessibleLeaves(q)
  const nhoms = [...new Set(leaves.map((l) => l.nhom))]
  return nhoms.map((n) => {
    let navLeaves: NavLeaf[] = leaves.filter((l) => l.nhom === n).map((l): NavLeaf =>
      l.id === 'lamtailieu' ? { id: l.id, ten: l.ten, children: LAMTAILIEU_CHILDREN } : { id: l.id, ten: l.ten })
    if (n === 'Vận hành') {
      // Việc "làm-xong-là-mất" trong ngày (điểm danh/report/tan/prep) → gọn vào 1 folder, đỡ rối cây.
      navLeaves = collapseGroup(navLeaves, 'vanhanh_lophoc', 'Vận hành lớp học', ['buoihoc', 'ops_report', 'prep', 'phancong_ops'])
      // Tuyển sinh (quản lý level HS) + Test đầu vào (vận hành điểm danh→chấm→trả bài) cùng 1 phễu.
      navLeaves = collapseGroup(navLeaves, 'tuyensinh_hub', 'Tuyển sinh', ['tuyensinh', 'test_dau_vao'])
    }
    return { nhom: n, leaves: navLeaves }
  })
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
