import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { users, opTasks, devTasks, adminLeaves, classesOfCoSo, worktypesByVai } from '../mock/fixtures'
import { myQuyen, type MyQuyen } from '../lib/quyen'
import { setReadOnlyLeafGetter } from '../lib/supabase'
import { getMyProfile, updateMenuYeuThich, updateErpGiaoDien, updateHomeBoCuc, type DangCard, type MyProfile, type MyScope } from '../lib/nhansu'
import { enqueueLinkGenJob } from '../lib/linkgen'
import type { User, Vai, NavGroup, NavLeaf, AdminLeaf } from '../types'

// Kiểu + bản nhớ trên máy của giao diện ERP: 2 hàm thuần, KHÔNG import registry style ở đây (store được nhiều bundle dùng).
export type GiaoDienErp = { skin?: string; nen?: string | null; nen_url?: string | null; che_do?: 'sang' | 'toi'; canh?: string | null }
const KHOA_GD_MAY = 'erp.giaoDien'
function docGiaoDienMay(): GiaoDienErp {
  try { const v = JSON.parse(localStorage.getItem(KHOA_GD_MAY) ?? '{}'); return v && typeof v === 'object' ? v : {} } catch { return {} }
}
function ghiGiaoDienMay(gd: GiaoDienErp) { try { localStorage.setItem(KHOA_GD_MAY, JSON.stringify(gd)) } catch { /* bỏ qua */ } }

export type LinkGenJob = { id: string; loai: string; attempt: number }
export const MAX_LINKGEN_ATTEMPTS = 3

// Nháp ET đang soạn (chế độ TẠO MỚI) — giữ khi rời/quay lại màn để không mất công. cau/ch để lỏng (any)
// tránh coupling store với type kho. Sống trong RAM (không persist) → F5 mới mất.
export type EtDraft = {
  lopId: string | null; ngay: string; savedId: string | null; nhanh?: string | null
  rows: { maDang: string | null; maCau: string | null }[]
  cau: Record<string, any>; ch: Record<string, any>
}

// Nháp SOẠN TÀI LIỆU Hình — giữ khi rời/quay lại màn (như etDraft). Theo KHỐI (mỗi khối 1 nháp).
// Sống trong RAM (không persist) → F5 mới mất. Chỉ giữ LỰA CHỌN — pool/bản re-fetch lại khi quay lại.
// ⭐ 08-08 (Thùy chốt): "1 chuỗi ghép lại cũng là 1 bài" — MỌI node (lẻ hay chuỗi) đi qua CÙNG 1 cơ chế
// PICK: chọn 1 BẢN (đề chuẩn / lứa / biến thể riêng / ý thật) + 1 tập TICK (ý), thêm vào phiếu. Bấm lặp lại
// để có N bài từ CÙNG 1 chuỗi (khác bản mỗi lần) — KHÔNG còn khái niệm "node lẻ multipick" tách riêng.
export type PickItem = {
  key: string; phan: 'lop' | 'nha' | 'et' | 'mt'   // 'et'/'mt' = pick cho builder ET/MT Hình (Thùy 21/08) — không phải giáo trình
  nodeIds: string[]   // tập TICK (ý). kind bienthe/y luôn đúng 1 phần tử (không tiền đề để nở).
} & (
  | { kind: 'ghep'; luaId: string | null }   // đề chuẩn (luaId=null) hoặc lứa — mọi cỡ chuỗi kể cả 1 node
  | { kind: 'bienthe'; bienTheId: string }   // biến thể riêng lẻ (kieu='doi_so') — CHỈ chuỗi 1 node
  | { kind: 'y'; yId: string }               // ý thật (đã chấm) — CHỈ chuỗi 1 node
)
// ⭐ 08-08 (tiếp, "chuyển nhà"): chế độ 'mh' (Theo mô hình, build-rồi-lưu-popup) RÚT khỏi Soạn tài liệu —
// việc dựng nội dung 1 buổi giáo trình giờ làm TẠI CHỖ trong cây buổi của GiaoTrinhScreen (khuôn
// TaiLieuBuilder Đại: +Thêm buổi → điền tại chỗ → tự động lưu), không còn bước "Lưu vào giáo trình" rời.
// `picks`/`anDe`/`soDong` của 1 buổi giờ sống thẳng trong DB (hinh_gt_bai qua saveBuoiSelection mỗi lần
// sửa), KHÔNG còn nháp draft ở đây nữa — component dùng chung là `BuoiPickEditor` (SoanTaiLieu.tsx, export).
export type SoanHinhDraft = {
  che: 'gd' | 'ot'
  gd: { aId: string; bId: string; daHoc: string[]; themVao: string[] }
  ot: { dangIds: string[]; gio: string[]; dkTu: string; dkDen: string }
}
export const SOAN_HINH_DEFAULT: SoanHinhDraft = {
  che: 'gd',
  gd: { aId: '', bId: '', daHoc: [], themVao: [] },
  ot: { dangIds: [], gio: [], dkTu: '', dkDen: '' },
}

interface UiState {
  currentUserId: string
  screen: 'nhansu' | 'admin'
  staffLeaf: string
  // Số bước đã đi kể từ lúc mở app (= vị trí trong lịch sử trình duyệt). >0 ⇒ còn màn trước để Quay lại.
  navIdx: number
  // Vị trí xa nhất đã tới trong phiên này ⇒ navIdx < navMax là còn màn để Tiến (→).
  navMax: number
  // Cấp PHỤ đang mở đè lên màn hiện tại (vd "Chi tiết buổi") — có mục lịch sử riêng nên ← đóng đúng nó, không nhảy màn.
  lopPhu: string | null
  // Nút quay về do CHÍNH MÀN đang mở vẽ ("← Buổi học"…): hook useNutQuayVe ẩn nó và đăng ký ở đây để ← / ↑ trên thanh địa chỉ bấm thay.
  capPhuEl: { ten: string; dong: () => void } | null
  setCapPhuEl: (v: { ten: string; dong: () => void } | null) => void
  adminLeaf: string
  // ── Danh tính + quyền THẬT (từ tài khoản đăng nhập). null = chưa load ──
  quyen: MyQuyen | null
  me: MyProfile | null            // nhân sự thật của account đang đăng nhập (getMyProfile)
  setCurrentUser: (id: string) => void
  setScreen: (s: 'nhansu' | 'admin') => void
  setStaffLeaf: (id: string) => void
  // Quay lại màn trước (nút ‹ trong app). Hết lịch sử thì về Home.
  backLeaf: () => void
  tienLeaf: () => void
  // Mở 1 cấp phụ trên màn hiện tại: đẩy 1 mục lịch sử (cùng leaf) + nhớ tên để thanh địa chỉ hiện thêm 1 cấp.
  moLopPhu: (ten: string) => void
  // Trình duyệt vừa lùi/tiến (popstate) → nhận lại màn của mục lịch sử đó, KHÔNG đẻ mục mới.
  nhanLichSu: (st: unknown) => void
  // Ghim / bỏ ghim 1 mục menu lên Home (nhan_su.menu_yeu_thich) — vá store ngay, DB ghi nền, lỗi thì trả lại.
  doiYeuThich: (id: string) => void
  // Ẩn / hiện 1 box trên Trang chính (nhan_su.home_bo_cuc.an) — vá store ngay, DB ghi nền, lỗi thì trả lại.
  doiHomeAn: (id: string) => void
  // Lưu thứ tự box sau khi kéo thả (nhan_su.home_bo_cuc.thu_tu) — vá store ngay, DB ghi nền.
  doiHomeThuTu: (ids: string[]) => void
  // Đổi dáng card lưới nhóm (nhan_su.home_bo_cuc.dang_card).
  doiHomeDangCard: (d: DangCard) => void
  // Giao diện vỏ ERP đang áp (style + hình nền + sáng/tối — xem lib/erpSkin.ts). Khởi động = bản nhớ trên máy; hồ sơ tải xong
  // mà DB có lựa chọn thì DB đè. Đổi: vá ngay + nhớ trên máy + ghi DB nền (nhan_su.erp_giao_dien).
  erpGiaoDien: GiaoDienErp
  doiGiaoDienErp: (patch: GiaoDienErp) => void
  setAdminLeaf: (id: string) => void
  loadQuyen: () => Promise<void>
  loadMe: () => Promise<void>
  clearQuyen: () => void
  // Phím tắt công thức CÁ NHÂN (nhan_su.phim_tat_cong_thuc) — cập nhật store ngay sau khi lưu DB để mọi ô soạn dùng
  setPhimTatCongThuc: (m: Record<string, string>) => void
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
  // ⭐ 08-21 (Thùy: "mở lại buổi 2 thì phải lưu lại những gì đã setup, sao lại bắt chọn lại từ đầu") —
  // bộ lọc "mô hình chính/vệ tinh" của `BuoiPickEditor` (chỉ để TÌM node dễ hơn, KHÔNG phải nội dung
  // buổi — nội dung thật `picks`/`cheDo`/`soDong` đã lưu DB từ trước) trước là state cục bộ trong
  // component, rời màn Giáo trình là mất, phải tick lại từ đầu. Giữ khi rời/quay lại màn (như soanHinh
  // ở trên) — theo KHOÁ do màn gọi tự đặt (vd buổi.id). Không persist qua F5 (đúng tinh thần đã có).
  buoiMoHinhLoc: Record<string, { mainIds: string[]; satIds: string[] }>
  setBuoiMoHinhLoc: (key: string, updater: (cur: { mainIds: string[]; satIds: string[] }) => { mainIds: string[]; satIds: string[] }) => void
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

// Màn + vị trí lịch sử lúc khởi động: history.state còn nguyên sau F5 nên đọc lại được màn đang xem.
function lichSuDau(): { leaf: string; idx: number } {
  try {
    const st = window.history.state as { bkLeaf?: unknown; bkIdx?: unknown } | null
    if (st && typeof st.bkLeaf === 'string') return { leaf: st.bkLeaf, idx: typeof st.bkIdx === 'number' ? st.bkIdx : 0 }
  } catch { /* không có window (script) */ }
  return { leaf: 'home', idx: 0 }
}

export const useStore = create<UiState>()(persist((set, get) => ({
  currentUserId: users[0].id,
  screen: 'nhansu',
  // Mở app = Home. F5 thì đứng nguyên màn đang xem (đọc lại từ history.state — sống qua reload, mất khi mở tab mới).
  staffLeaf: lichSuDau().leaf,
  navIdx: lichSuDau().idx,
  navMax: lichSuDau().idx,
  lopPhu: null,
  capPhuEl: null,
  setCapPhuEl: (v) => set({ capPhuEl: v }),
  adminLeaf: 'db_tongquan',
  quyen: null,
  me: null,
  setCurrentUser: (id) => set({ currentUserId: id, screen: 'nhansu', staffLeaf: 'home' }),
  setScreen: (s) => set({ screen: s }),
  // Mỗi lần đổi màn = 1 mục lịch sử trình duyệt ⇒ nút ‹ trong app, nút Back của trình duyệt, nút bên hông
  // chuột và vuốt-lùi trên điện thoại đều quay về đúng màn trước. Không đổi URL (chỉ gắn state).
  setStaffLeaf: (id) => {
    if (id === get().staffLeaf) return
    const idx = get().navIdx + 1
    try { window.history.pushState({ bkLeaf: id, bkIdx: idx }, '') } catch { /* trình duyệt chặn history: vẫn đổi màn */ }
    set({ staffLeaf: id, navIdx: idx, navMax: idx, lopPhu: null })
  },
  tienLeaf: () => { if (get().navIdx < get().navMax) window.history.forward() },
  moLopPhu: (ten) => {
    const idx = get().navIdx + 1
    try { window.history.pushState({ bkLeaf: get().staffLeaf, bkIdx: idx, bkPhu: ten }, '') } catch { /* bỏ qua */ }
    set({ navIdx: idx, navMax: idx, lopPhu: ten })
  },
  backLeaf: () => {
    if (get().navIdx > 0) window.history.back()
    else get().setStaffLeaf('home')
  },
  nhanLichSu: (st) => {
    const s = (st ?? {}) as { bkLeaf?: unknown; bkIdx?: unknown }
    const idx = typeof s.bkIdx === 'number' ? s.bkIdx : 0
    // lopPhu luôn về null: lùi ra khỏi cấp phụ là đóng nó; tiến LẠI vào mục lịch sử của cấp phụ thì nội dung chi tiết
    // đã không còn (state cục bộ của màn) ⇒ chỉ hiện màn nền, không giả vờ còn chi tiết.
    set({ staffLeaf: typeof s.bkLeaf === 'string' ? s.bkLeaf : 'home', navIdx: idx, navMax: Math.max(get().navMax, idx), lopPhu: null })
  },
  erpGiaoDien: docGiaoDienMay(),
  doiGiaoDienErp: (patch) => {
    const moi = { ...get().erpGiaoDien, ...patch }
    ghiGiaoDienMay(moi)
    set({ erpGiaoDien: moi })
    const me = get().me
    if (me) updateErpGiaoDien(me.nhanSu.id, moi).catch((e) => alert(`Chưa lưu được giao diện vào tài khoản (máy này vẫn nhớ): ${e?.message ?? e}`))
  },
  doiYeuThich: (id) => {
    const me = get().me
    if (!me) return
    const cu = me.nhanSu.menu_yeu_thich ?? []
    // Thiết kế chung (Thùy 14/10): Yêu thích tối đa 8 mục — đúng 8 ô trên Trang chính ở mọi style.
    if (!cu.includes(id) && cu.length >= 8) { alert('Yêu thích tối đa 8 mục. Bỏ ★ một mục trước rồi ghim mục mới.'); return }
    const moi = cu.includes(id) ? cu.filter((x) => x !== id) : [...cu, id]
    const va = (ds: string[]) => set((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, menu_yeu_thich: ds } } } : {}))
    va(moi)
    updateMenuYeuThich(me.nhanSu.id, moi).catch((e) => { va(cu); alert(`Chưa lưu được mục Yêu thích: ${e?.message ?? e}`) })
  },
  doiHomeAn: (id) => {
    const me = get().me
    if (!me) return
    const cu = me.nhanSu.home_bo_cuc ?? {}
    const an = cu.an ?? []
    const moi = { ...cu, an: an.includes(id) ? an.filter((x) => x !== id) : [...an, id] }
    const va = (bc: typeof cu) => set((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, home_bo_cuc: bc } } } : {}))
    va(moi)
    updateHomeBoCuc(me.nhanSu.id, moi).catch((e) => { va(cu); alert(`Chưa lưu được bố cục Trang chính: ${e?.message ?? e}`) })
  },
  doiHomeThuTu: (ids) => {
    const me = get().me
    if (!me) return
    const cu = me.nhanSu.home_bo_cuc ?? {}
    const moi = { ...cu, thu_tu: ids }
    const va = (bc: typeof cu) => set((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, home_bo_cuc: bc } } } : {}))
    va(moi)
    updateHomeBoCuc(me.nhanSu.id, moi).catch((e) => { va(cu); alert("Chưa lưu được thứ tự box: " + (e?.message ?? e)) })
  },
  doiHomeDangCard: (d) => {
    const me = get().me
    if (!me) return
    const cu = me.nhanSu.home_bo_cuc ?? {}
    const moi = { ...cu, dang_card: d }
    const va = (bc: typeof cu) => set((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, home_bo_cuc: bc } } } : {}))
    va(moi)
    updateHomeBoCuc(me.nhanSu.id, moi).catch((e) => { va(cu); alert('Chưa lưu được dáng card: ' + (e?.message ?? e)) })
  },
  setAdminLeaf: (id) => set({ adminLeaf: id }),
  loadQuyen: async () => { try { set({ quyen: await myQuyen() }) } catch { set({ quyen: { laAdmin: false, chucNang: [], chiXem: [] } }) } },
  loadMe: async () => {
    try {
      const me = await getMyProfile()
      const gd = me?.nhanSu.erp_giao_dien
      if (gd?.skin) { ghiGiaoDienMay(gd); set({ me, erpGiaoDien: gd }) } else set({ me })
    } catch { set({ me: null }) }
  },
  // Đăng xuất: bỏ luôn màn đang đứng — người đăng nhập kế tiếp trên cùng tab bắt đầu từ Home, không thừa hưởng màn của người trước.
  // ⚠ App gọi hàm này cả lúc MỚI TẢI TRANG (session chưa resolve) — khi đó `quyen` còn null, KHÔNG được đụng màn
  // đang đứng, nếu không F5 sẽ luôn rơi về Home. Chỉ dọn khi vừa có người đăng nhập thật (quyen khác null).
  clearQuyen: () => {
    if (get().quyen === null && get().me === null) return
    try { if (window.history.state?.bkLeaf) window.history.replaceState(null, '') } catch { /* bỏ qua */ }
    set({ quyen: null, me: null, staffLeaf: 'home', navIdx: 0, navMax: 0, lopPhu: null })
  },
  setPhimTatCongThuc: (m) => set((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, phim_tat_cong_thuc: m } } } : {})),
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
  buoiMoHinhLoc: {},
  setBuoiMoHinhLoc: (key, updater) => set((s) => ({ buoiMoHinhLoc: { ...s.buoiMoHinhLoc, [key]: updater(s.buoiMoHinhLoc[key] ?? { mainIds: [], satIds: [] }) } })),
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
  { id: 'lamtailieu:giao_trinh_hinh', ten: 'Giáo trình (Hình)' },   // ⭐ 08-08 "chuyển nhà": ngang hàng Đại, không còn chôn trong rail Kho
  { id: 'lamtailieu:et', ten: 'ET' },
  { id: 'lamtailieu:mt', ten: 'MT' },
  { id: 'lamtailieu:bo_tro', ten: 'Tài liệu bổ trợ' },
]
// Bổ trợ yếu (Thùy 08-18: "1 lá riêng, tách khỏi Dashboard học tập, 4 tab con") — PLAN-botro-yeu.md.
// Xếp lịch (bước 6) KHÔNG ở đây — đó là việc OPS, sống ở nhóm Vận hành cạnh Bù/Đuổi (leaf `xep_by`).
// ⚠ 24/09: folder này KHÔNG còn trên menu — toàn bộ (Duyệt · Nội dung · Trạng thái ca · Đánh giá ca) chuyển vào Vận hành › Bổ trợ › Yếu (toggle,
// BoTroHubScreen). Link cũ 'botroyeu:*' vẫn được NhanSuHome chuyển tới đúng toggle.
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
      l.id === 'lamtailieu' ? { id: l.id, ten: l.ten, children: LAMTAILIEU_CHILDREN }
      : { id: l.id, ten: l.ten })
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

// Phím tắt công thức của NGƯỜI ĐANG ĐĂNG NHẬP (từ nhan_su.phim_tat_cong_thuc, load cùng `me`). Không persist
// localStorage → 2 người dùng chung máy mỗi người thấy đúng bộ phím của mình. EMPTY cố định để selector ổn định.
// Mục menu YÊU THÍCH của người đang đăng nhập (nhan_su.menu_yeu_thich). EMPTY cố định để selector ổn định.
const YEU_THICH_EMPTY: string[] = []
export const useYeuThich = () => useStore((s) => s.me?.nhanSu.menu_yeu_thich ?? YEU_THICH_EMPTY)

const PHIM_TAT_EMPTY: Record<string, string> = {}
export const usePhimTat = () => useStore((s) => s.me?.nhanSu.phim_tat_cong_thuc ?? PHIM_TAT_EMPTY)
