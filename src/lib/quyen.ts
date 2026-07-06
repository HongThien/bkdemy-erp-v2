// Data-layer RBAC feature-access (lớp ① — "mở được màn nào"). Seam: UI chỉ gọi qua đây.
// Mô hình: vai_tro (bó chức năng) → gán cho vi_tri → quyền 1 người = UNION role các ghế.
// chuc_nang = leaf-id trong cây Admin (hs/lop/ns/bdkt/buoihoc/db_taichinh…). Founder = la_admin bypass.
import { supabase } from './supabase'

const LIMIT = 1000

// chiXem = leaf mà NGƯỜI này chỉ được xem (chuc_nang có mặt nhưng KHÔNG được sửa) —
// UNION nhiều ghế: chỉ vào chiXem khi MỌI ghế giữ leaf đó đều là chỉ-xem (được-sửa thắng).
export type MyQuyen = { laAdmin: boolean; chucNang: string[]; chiXem: string[] }
export type VaiTro = { id: string; ten: string; mo_ta: string | null }
// chuc_nang = MỌI leaf role này có quyền (xem hoặc sửa) · chi_xem = tập con chỉ-xem (còn lại = được sửa).
export type VaiTroFull = VaiTro & { chuc_nang: string[]; chi_xem: string[]; so_ghe: number }

// ── Quyền của NGƯỜI ĐANG ĐĂNG NHẬP (1 rpc) ────────────────────────
export async function myQuyen(): Promise<MyQuyen> {
  const { data, error } = await supabase.rpc('my_quyen')
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return {
    laAdmin: !!row?.la_admin,
    chucNang: (row?.chuc_nang ?? []) as string[],
    chiXem: (row?.chi_xem ?? []) as string[],
  }
}

// ── Quản lý role (màn Phân quyền — Founder) ───────────────────────
export async function listRoles(): Promise<VaiTroFull[]> {
  const { data: roles, error } = await supabase.from('vai_tro').select('*').order('ten').limit(LIMIT)
  if (error) throw error
  const ids = (roles ?? []).map((r: any) => r.id)
  const { data: cn } = ids.length
    ? await supabase.from('vai_tro_chuc_nang').select('vai_tro_id, chuc_nang, chi_xem').in('vai_tro_id', ids).limit(LIMIT * 50)
    : { data: [] as any[] }
  const { data: ghe } = ids.length
    ? await supabase.from('vi_tri').select('vai_tro_id').in('vai_tro_id', ids).limit(LIMIT)
    : { data: [] as any[] }
  const cnMap = new Map<string, string[]>()
  const xemMap = new Map<string, string[]>()
  for (const r of (cn ?? []) as any[]) {
    const a = cnMap.get(r.vai_tro_id) ?? []; a.push(r.chuc_nang); cnMap.set(r.vai_tro_id, a)
    if (r.chi_xem) { const x = xemMap.get(r.vai_tro_id) ?? []; x.push(r.chuc_nang); xemMap.set(r.vai_tro_id, x) }
  }
  const gheCount = new Map<string, number>()
  for (const g of (ghe ?? []) as any[]) gheCount.set(g.vai_tro_id, (gheCount.get(g.vai_tro_id) ?? 0) + 1)
  return (roles ?? []).map((r: any) => ({
    ...r, chuc_nang: cnMap.get(r.id) ?? [], chi_xem: xemMap.get(r.id) ?? [], so_ghe: gheCount.get(r.id) ?? 0,
  }))
}

export async function createRole(ten: string, moTa?: string): Promise<VaiTro> {
  const { data, error } = await supabase.from('vai_tro').insert({ ten, mo_ta: moTa ?? null }).select().single()
  if (error) throw error
  return data as VaiTro
}
export async function updateRole(id: string, patch: { ten?: string; mo_ta?: string | null }): Promise<void> {
  const { error } = await supabase.from('vai_tro').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteRole(id: string): Promise<void> {
  // vi_tri.vai_tro_id → set null (FK on delete set null); chuc_nang → cascade
  const { error } = await supabase.from('vai_tro').delete().eq('id', id)
  if (error) throw error
}

// Đặt LẠI toàn bộ chức năng của 1 role: mỗi mục {chuc_nang, chi_xem} — chi_xem=true là CHỈ XEM,
// false = ĐƯỢC SỬA. Diff: thêm dòng mới / xoá dòng thừa / cập nhật dòng đổi mức (anti-NULL, không rải false rác).
export type RoleFn = { chuc_nang: string; chi_xem: boolean }
export async function setRoleChucNang(roleId: string, fns: RoleFn[]): Promise<void> {
  const { data: cur } = await supabase.from('vai_tro_chuc_nang').select('chuc_nang, chi_xem').eq('vai_tro_id', roleId).limit(LIMIT * 50)
  const curMap = new Map((cur ?? []).map((r: any) => [r.chuc_nang as string, !!r.chi_xem]))
  const wantIds = new Set(fns.map((f) => f.chuc_nang))
  const bo = [...curMap.keys()].filter((c) => !wantIds.has(c))
  const upsert = fns.filter((f) => curMap.get(f.chuc_nang) !== f.chi_xem) // mới hoặc đổi mức xem/sửa
  if (bo.length) {
    const { error } = await supabase.from('vai_tro_chuc_nang').delete().eq('vai_tro_id', roleId).in('chuc_nang', bo)
    if (error) throw error
  }
  if (upsert.length) {
    const { error } = await supabase.from('vai_tro_chuc_nang')
      .upsert(upsert.map((f) => ({ vai_tro_id: roleId, chuc_nang: f.chuc_nang, chi_xem: f.chi_xem })), { onConflict: 'vai_tro_id,chuc_nang' })
    if (error) throw error
  }
}

// Gán role cho 1 vị trí (null = gỡ)
export async function setViTriRole(viTriId: string, roleId: string | null): Promise<void> {
  const { error } = await supabase.from('vi_tri').update({ vai_tro_id: roleId }).eq('id', viTriId)
  if (error) throw error
}

// Vị trí + tên team + tên người + role đang gán (cho phần "Gán role" màn Phân quyền)
export type ViTriGan = { id: string; ten: string | null; cap: string; team_ten: string; nguoi_ten: string | null; vai_tro_id: string | null }
export async function listViTriGan(): Promise<ViTriGan[]> {
  const { data, error } = await supabase.from('vi_tri')
    .select('id, ten, cap, vai_tro_id, team:team_id(ten), nguoi:nhan_su_id(ho_ten)')
    .order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((v: any) => ({ id: v.id, ten: v.ten, cap: v.cap, team_ten: v.team?.ten ?? '?', nguoi_ten: v.nguoi?.ho_ten ?? null, vai_tro_id: v.vai_tro_id }))
}
