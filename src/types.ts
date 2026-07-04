// Domain types cho shell ERP v2 (theo erp-v2-ui-spec.md). Mock-first.

export type Vai = 'OPS' | 'TA' | 'GV' | 'OpsLead' | 'AdminCoSo' | 'Founder'
export type CoSo = 'CS1' | 'CS2'

export interface RoleAssignment {
  id: string
  vai: Vai
  coSo: CoSo
  lops: string[]              // [] = vai quản lý/không gắn lớp cụ thể (phủ cả cơ sở)
  capTrenRoleId: string | null
}

export interface User {
  id: string
  ten: string
  roles: RoleAssignment[]     // 1 người → nhiều role-assignment (đơn vị gốc = ROLE)
}

// ── Việc VẬN HÀNH (derive, có "dí") ──────────────────────────────
export type OpLoai = 'diem_danh' | 'cham_et' | 'cham_btvn' | 'danh_gia' | 'xep_bu'
export type OpTrangThai = 'moi' | 'lam_do' | 'qua_han'
export interface OpTask {
  id: string
  vai: Vai                   // role nào nhận việc
  coSo: CoSo
  lop?: string
  loai: OpLoai
  nhan: string               // mô tả ngắn: lớp + buổi
  deadline: string           // text hiển thị (mock)
  trangThai: OpTrangThai
  tienDo?: { done: number; total: number }   // việc làm dở
  surface: 'popup' | 'sheet'
}

// ── Việc PHÁT TRIỂN (giao tay, deadline mềm) ─────────────────────
export type DevTrangThai = 'dang_lam' | 'da_nop'
export interface DevTask {
  id: string
  assigneeUserId: string
  tieuDe: string
  moTa: string
  deadline: string
  trangThai: DevTrangThai
}

export interface HocSinh { maHs: string; ten: string }

export interface Notice {
  id: string
  noiDung: string
  toVai: Vai                 // route lên role quản lý (theo role của việc)
  coSo: CoSo
}

export interface AdminLeaf {
  id: string
  nhom: 'Vận hành' | 'Gamification' | 'Học thuật' | 'Quản lý chất lượng' | 'Core team' | 'Dashboard'
  ten: string
  founderOnly: boolean
}

// Nav tree dùng chung cho cả màn Nhân sự + Admin
export interface NavLeaf { id: string; ten: string; children?: NavLeaf[] }   // children → tầng 2
export interface NavGroup { nhom: string | null; leaves: NavLeaf[] } // nhom=null → lá top-level
