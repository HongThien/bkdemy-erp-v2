// Mock data cho shell view-first. KHÔNG phải schema thật — shape đặt để sau map sang DB.
import type { User, OpTask, DevTask, HocSinh, Notice, AdminLeaf, Vai, CoSo } from '../types'

// Lớp theo cơ sở (mock) — children tầng 2 của cây Tra cứu (Nhân sự)
export const classesOfCoSo: Record<CoSo, string[]> = {
  CS1: ['6A1', '7B1', '8A1'],
  CS2: ['9A2'],
}

// Loại việc theo vai → node tầng 1 trong nhóm "Tra cứu & sửa"
export const worktypesByVai: Partial<Record<Vai, { key: string; ten: string }[]>> = {
  TA: [{ key: 'cham_et', ten: 'Chấm ET' }, { key: 'cham_btvn', ten: 'Chấm BTVN' }],
  GV: [{ key: 'danh_gia', ten: 'Đánh giá buổi' }, { key: 'noi_dung', ten: 'Nội dung buổi' }],
  OPS: [{ key: 'diem_danh', ten: 'Điểm danh' }, { key: 'xep_bu', ten: 'Xếp bù' }],
}

// ── Nhân sự + role-assignment ────────────────────────────────────
// Orgchart: Founder(Thùy) → OpsLead(Quân) → OPS/TA/GV. 2 cơ sở. 1 người 2 role (Cường).
export const users: User[] = [
  { id: 'u_loc', ten: 'Lộc', roles: [
    { id: 'r_loc', vai: 'TA', coSo: 'CS1', lops: ['6A1', '7B1'], capTrenRoleId: 'r_quan' },
  ] },
  { id: 'u_hai', ten: 'Hải', roles: [
    { id: 'r_hai', vai: 'GV', coSo: 'CS1', lops: ['6A1'], capTrenRoleId: 'r_quan' },
  ] },
  { id: 'u_mai', ten: 'Mai', roles: [
    { id: 'r_mai', vai: 'OPS', coSo: 'CS1', lops: [], capTrenRoleId: 'r_quan' },
  ] },
  // Cường: 2 role + vượt cấp (GV bình thường nhưng kiêm AdminCoSo)
  { id: 'u_cuong', ten: 'Cường', roles: [
    { id: 'r_cuong_gv', vai: 'GV', coSo: 'CS1', lops: ['8A1'], capTrenRoleId: 'r_quan' },
    { id: 'r_cuong_admin', vai: 'AdminCoSo', coSo: 'CS1', lops: [], capTrenRoleId: 'r_founder' },
  ] },
  { id: 'u_uyen', ten: 'Uyên', roles: [
    { id: 'r_uyen', vai: 'TA', coSo: 'CS2', lops: ['9A2'], capTrenRoleId: 'r_quan' },
  ] },
  { id: 'u_quan', ten: 'Quân', roles: [
    { id: 'r_quan', vai: 'OpsLead', coSo: 'CS1', lops: [], capTrenRoleId: 'r_founder' },
  ] },
  { id: 'u_thuy', ten: 'Thùy', roles: [
    { id: 'r_founder', vai: 'Founder', coSo: 'CS1', lops: [], capTrenRoleId: null },
  ] },
]

// ── Việc vận hành (đủ states: mới / quá hạn / làm dở) ─────────────
export const opTasks: OpTask[] = [
  { id: 't1', vai: 'TA', coSo: 'CS1', lop: '6A1', loai: 'cham_et',  nhan: 'Chấm ET · 6A1 · buổi 18/06',   deadline: 'Hôm nay 21:00', trangThai: 'moi',     surface: 'sheet' },
  { id: 't2', vai: 'TA', coSo: 'CS1', lop: '7B1', loai: 'cham_btvn',nhan: 'Chấm BTVN · 7B1 · buổi 16/06',  deadline: 'Hôm qua 20:00', trangThai: 'qua_han', surface: 'sheet' },
  { id: 't3', vai: 'TA', coSo: 'CS1', lop: '6A1', loai: 'cham_et',  nhan: 'Chấm ET · 6A1 · buổi 15/06',   deadline: 'Hôm nay 18:00', trangThai: 'lam_do',  tienDo: { done: 8, total: 15 }, surface: 'sheet' },
  { id: 't4', vai: 'GV', coSo: 'CS1', lop: '6A1', loai: 'danh_gia', nhan: 'Đánh giá buổi · 6A1 · 18/06',   deadline: 'Hôm nay 22:00', trangThai: 'moi',     surface: 'popup' },
  { id: 't5', vai: 'OPS',coSo: 'CS1', lop: '6A1', loai: 'diem_danh',nhan: 'Điểm danh · 6A1 · 18/06',       deadline: 'Trong giờ học', trangThai: 'moi',     surface: 'sheet' },
  { id: 't6', vai: 'OPS',coSo: 'CS1', lop: '7B1', loai: 'xep_bu',   nhan: 'Xếp bù · 7B1 · HS nghỉ 16/06',  deadline: 'Hôm qua',       trangThai: 'qua_han', surface: 'popup' },
  { id: 't7', vai: 'TA', coSo: 'CS2', lop: '9A2', loai: 'cham_et',  nhan: 'Chấm ET · 9A2 · buổi 18/06',   deadline: 'Hôm nay 21:00', trangThai: 'moi',     surface: 'sheet' },
]

// ── Việc phát triển (đang làm / đã nộp) ──────────────────────────
export const devTasks: DevTask[] = [
  { id: 'd1', assigneeUserId: 'u_loc', tieuDe: 'Soạn 20 câu dạng "Tìm UCLN"',  moTa: 'Nhập kho khối 6',          deadline: '25/06', trangThai: 'dang_lam' },
  { id: 'd2', assigneeUserId: 'u_hai', tieuDe: 'Quay video chữa đề GK1',        moTa: 'Up lên kho tài liệu',      deadline: '22/06', trangThai: 'da_nop' },
  { id: 'd3', assigneeUserId: 'u_loc', tieuDe: 'Review bản đồ dạng Hình K8',    moTa: 'Đối chiếu với đề thi thử', deadline: '28/06', trangThai: 'dang_lam' },
]

// ── Lưới 15 HS (cho surface sheet) ───────────────────────────────
export const lopHocSinh: Record<string, HocSinh[]> = {
  '6A1': Array.from({ length: 15 }, (_, i) => ({ maHs: `HS${101 + i}`, ten: `Học sinh ${String(i + 1).padStart(2, '0')}` })),
}

// ── Notice trễ (route lên quản lý) ───────────────────────────────
export const notices: Notice[] = [
  { id: 'n1', noiDung: 'BTVN 7B1 (16/06) quá hạn chấm', toVai: 'OpsLead', coSo: 'CS1' },
  { id: 'n2', noiDung: 'Xếp bù 7B1 còn treo',           toVai: 'OpsLead', coSo: 'CS1' },
]

// ── Cây Admin (derive theo role) ─────────────────────────────────
// Nhóm tầng 1 = THEO TEAM (Thùy chốt 07-05): mai sau role cũng chia theo đây (role Học thuật → thấy
// nhóm Học thuật...). Đổi nhóm ở đây CHỈ là IA hiển thị — quyền THẬT vẫn cấp per-leaf ở Phân quyền.
export const adminLeaves: AdminLeaf[] = [
  // ── VẬN HÀNH: việc ops hàng ngày (điểm danh/HS/lớp/tuyển sinh/bổ trợ) ──
  { id: 'buoihoc',     nhom: 'Vận hành',  ten: 'Buổi học',                     founderOnly: false }, // điểm danh
  { id: 'hs',          nhom: 'Vận hành',  ten: 'Học sinh',                     founderOnly: false },
  { id: 'lop',         nhom: 'Vận hành',  ten: 'Lớp',                          founderOnly: false },
  { id: 'tuyensinh',   nhom: 'Vận hành',  ten: 'Tuyển sinh',                   founderOnly: false }, // quản lý LEVEL học sinh L5-L8, KHÔNG chứa hoạt động test
  // Bổ trợ = 5 loại bù/yếu/đuổi/định-kỳ/ôn-thi (giờ có Bù + Đuổi).
  { id: 'botro',       nhom: 'Vận hành',  ten: 'Bù',                           founderOnly: false },
  { id: 'botro_duoi',  nhom: 'Vận hành',  ten: 'Đuổi',                         founderOnly: false },
  // Vận hành Ops (BKDEMY_OPS_SPEC_DETAIL.md, 07-06): Report/Báo tan (Story 1+2) + Prep phòng (Story 3)
  // + Phân công ca trực (spine). ET (Story 4) GÁC LẠI, không có leaf ở đây.
  { id: 'ops_report',  nhom: 'Vận hành',  ten: 'Report & Báo tan',             founderOnly: false },
  { id: 'prep',        nhom: 'Vận hành',  ten: 'Chuẩn bị phòng',               founderOnly: false },
  { id: 'phancong_ops',nhom: 'Vận hành',  ten: 'Phân công Ops',               founderOnly: false },
  // Test đầu vào (BKDEMY_TESTDAUVAO_SPEC_DETAIL.md, 07-07/08) — module RIÊNG, TÁCH khỏi `tuyensinh`
  // (Thùy 07-08: Tuyển sinh = quản lý level HS; test đầu vào = 4 story vận hành điểm danh→chấm→nhận
  // xét→trả bài). 1 leaf, 4 tab bên trong (Điểm danh/Đề/Chấm/Nhận xét) — TestDauVaoScreen.tsx.
  { id: 'test_dau_vao',nhom: 'Vận hành',  ten: 'Test đầu vào',                 founderOnly: false },

  // ── GAMIFICATION: Elo/EXP, thành tích, level ──
  { id: 'diemso',      nhom: 'Gamification', ten: 'Điểm số (Elo/EXP)',        founderOnly: false },
  { id: 'thanhtich',   nhom: 'Gamification', ten: 'Thành tích',               founderOnly: false },
  { id: 'quanlylevel', nhom: 'Gamification', ten: 'Quản lý Level',            founderOnly: false },

  // ── HỌC THUẬT: kho + soạn tài liệu ──
  { id: 'bdkt',        nhom: 'Học thuật', ten: 'Bản đồ kiến thức (Kho)',      founderOnly: false },
  { id: 'tl',          nhom: 'Học thuật', ten: 'Kho tài liệu',                founderOnly: false },
  { id: 'nhapkho',     nhom: 'Học thuật', ten: 'Nhập kho (từ tài liệu)',      founderOnly: false }, // ingest-first: bóc PDF → gán dạng → đẩy kho
  { id: 'lamtailieu',  nhom: 'Học thuật', ten: 'Làm tài liệu',                founderOnly: false }, // hub: giáo trình·ET·đề thi·bổ trợ

  // ── QUẢN LÝ CHẤT LƯỢNG: đo lường kết quả học tập (sẽ break ra nhiều nhánh ở đây) ──
  { id: 'ketqua',      nhom: 'Quản lý chất lượng', ten: 'Kết quả học tập',    founderOnly: false }, // mastery (HS × dạng) suy động
  { id: 'duyetcham',   nhom: 'Quản lý chất lượng', ten: 'Duyệt chấm online',  founderOnly: false }, // review trả-lời-ngắn: chấp nhận đáp án + backfill
  { id: 'db_hoctap',   nhom: 'Quản lý chất lượng', ten: 'Dashboard học tập',  founderOnly: false }, // phát hiện → đề xuất → NGƯỜI duyệt (spec-danhgia-hoctap)
  { id: 'report_ph',   nhom: 'Quản lý chất lượng', ten: 'Report phụ huynh',   founderOnly: false }, // report tháng gửi PH: số liệu HS + nhận xét GV

  // ── CORE TEAM: nhân sự/tổ chức/vận hành nội bộ ──
  { id: 'hocphi',      nhom: 'Core team', ten: 'Học phí',                     founderOnly: false },
  { id: 'ns',          nhom: 'Core team', ten: 'Nhân sự',                     founderOnly: false },
  { id: 'orgchart',    nhom: 'Core team', ten: 'Sơ đồ tổ chức',               founderOnly: true },
  { id: 'phancong',    nhom: 'Core team', ten: 'Phân công',                   founderOnly: false },
  { id: 'tkb',         nhom: 'Core team', ten: 'Thời khóa biểu',              founderOnly: false },
  { id: 'phanquyen',   nhom: 'Core team', ten: 'Phân quyền',                  founderOnly: true },
  { id: 'baoloi',      nhom: 'Core team', ten: 'Quản lý báo lỗi',             founderOnly: true },
  { id: 'db_tuyendung',nhom: 'Core team', ten: 'Tuyển dụng',                  founderOnly: true },
  { id: 'giaoviec',    nhom: 'Core team', ten: 'Tạo & giao việc phát triển',  founderOnly: false },

  // ── DASHBOARD: chỉ phục vụ CEO ra quyết định (analytics, không phải màn thao tác) ──
  { id: 'db_tongquan', nhom: 'Dashboard', ten: 'Tổng quan',                   founderOnly: false },
  { id: 'db_taichinh', nhom: 'Dashboard', ten: 'Tài chính',                   founderOnly: true },
  { id: 'db_chatluong',nhom: 'Dashboard', ten: 'Chất lượng vận hành',         founderOnly: true },
]
