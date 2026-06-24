// Data-layer Tuyển sinh (phễu Test đầu vào L5→L8). ADR: app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233
// Lead = `ung_vien` RIÊNG; convert L7→L8 tạo hoc_sinh. UI chỉ gọi qua đây.
import { supabase } from './supabase'
import { suggestMaHS, suggestMaPH, createHocSinh, createPhuHuynh, ghiDanh } from './nhansu'
import { homNayVN } from './tuan'

const LIMIT = 10000

export type UngVienLevel = 'L5' | 'L6' | 'L7'
export type UngVienTrangThai = 'dang_chay' | 'loai' | 'da_convert'
export type UngVien = {
  id: string; ma_uv: string | null; ho_ten_hs: string; ho_ten_ph: string | null; sdt_ph: string | null
  khoi: string | null; mon: string; nguon: string | null; level: UngVienLevel; trang_thai: UngVienTrangThai
  ly_do_loai: string | null; diem_test: number | null; lop_du_kien_id: string | null; ngay_hoc_thu: string | null
  ghi_chu: string | null; hoc_sinh_id: string | null; created_at: string
}

// Catalog việc/level (CỨNG). derive=true: sẽ tự suy từ TA chấm test (seam ADR riêng) — TẠM tick tay.
export const VIEC_BY_LEVEL: Record<UngVienLevel, { key: string; ten: string; derive?: boolean }[]> = {
  L5: [{ key: 'gui_quy_trinh', ten: 'Gửi quy trình test' }],
  L6: [{ key: 'cham_bai', ten: 'Chấm bài', derive: true }, { key: 'tra_bai', ten: 'Trả bài' }, { key: 'chot_lich', ten: 'Chốt lịch học thử' }],
  L7: [{ key: 'xac_nhan_dk', ten: 'Xác nhận đăng ký chính thức' }],
}
export const LEVELS: UngVienLevel[] = ['L5', 'L6', 'L7']
export const LEVEL_TEN: Record<string, string> = { L5: 'Đăng ký test', L6: 'Đến test', L7: 'Học thử', L8: 'Chính thức', loai: 'Đã loại' }
const NEXT: Record<UngVienLevel, UngVienLevel | 'L8'> = { L5: 'L6', L6: 'L7', L7: 'L8' }

export async function suggestMaUV(): Promise<string> {
  const { data } = await supabase.from('ung_vien').select('ma_uv').not('ma_uv', 'is', null).limit(LIMIT)
  let max = 0
  for (const r of (data ?? []) as any[]) { const m = String(r.ma_uv ?? '').match(/\d+/); if (m) max = Math.max(max, parseInt(m[0], 10)) }
  return 'UV' + String(max + 1).padStart(4, '0')
}

export async function listUngVien(level: UngVienLevel): Promise<UngVien[]> {
  const { data, error } = await supabase.from('ung_vien').select('*').eq('trang_thai', 'dang_chay').eq('level', level).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as UngVien[]
}
export async function listLoai(): Promise<UngVien[]> {
  const { data, error } = await supabase.from('ung_vien').select('*').eq('trang_thai', 'loai').order('updated_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as UngVien[]
}
// việc đã xong của nhóm UV → map uvId -> Set(viec_key)
export async function getViecXong(uvIds: string[]): Promise<Record<string, Set<string>>> {
  if (!uvIds.length) return {}
  const { data, error } = await supabase.from('ung_vien_viec').select('ung_vien_id, viec_key').in('ung_vien_id', uvIds).limit(LIMIT)
  if (error) throw error
  const m: Record<string, Set<string>> = {}
  for (const r of (data ?? []) as any[]) { (m[r.ung_vien_id] ??= new Set<string>()).add(r.viec_key) }
  return m
}
// nguồn lead đã dùng (distinct) — gợi ý khi điền (free text, tự thêm mới)
export async function listNguon(): Promise<string[]> {
  const { data } = await supabase.from('ung_vien').select('nguon').not('nguon', 'is', null).limit(LIMIT)
  return [...new Set((data ?? []).map((r: any) => String(r.nguon).trim()).filter(Boolean))].sort()
}

export async function createUngVien(input: { ho_ten_hs: string; ho_ten_ph?: string | null; sdt_ph?: string | null; khoi?: string | null; mon?: string; nguon?: string | null; ma_uv?: string }): Promise<UngVien> {
  const { data: { user } } = await supabase.auth.getUser()
  const ma_uv = input.ma_uv?.trim() || (await suggestMaUV())
  const { data, error } = await supabase.from('ung_vien').insert({ ...input, ma_uv, created_by: user?.id ?? null }).select().single()
  if (error) throw error
  return data as UngVien
}
export async function updateUngVien(id: string, patch: Partial<UngVien>): Promise<void> {
  const { error } = await supabase.from('ung_vien').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
// tick / bỏ tick 1 việc (anti-NULL §1.5: CÓ dòng = đã xong)
export async function toggleViec(uvId: string, viecKey: string, on: boolean): Promise<void> {
  if (on) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('ung_vien_viec').upsert({ ung_vien_id: uvId, viec_key: viecKey, nguoi_xong: user?.id ?? null }, { onConflict: 'ung_vien_id,viec_key', ignoreDuplicates: true })
    if (error) throw error
  } else {
    const { error } = await supabase.from('ung_vien_viec').delete().eq('ung_vien_id', uvId).eq('viec_key', viecKey)
    if (error) throw error
  }
}
export function duViec(level: UngVienLevel, done: Set<string> | undefined): boolean {
  return VIEC_BY_LEVEL[level].every((v) => done?.has(v.key))
}
// Hoàn thành level → promote (L5→L6→L7). L7 KHÔNG promote ở đây (phải convert qua form).
export async function hoanThanhLevel(uv: UngVien): Promise<void> {
  const next = NEXT[uv.level]
  if (next === 'L8') throw new Error('L7 hoàn thành = convert (tạo HS) — gọi convertUngVien qua form.')
  await updateUngVien(uv.id, { level: next })
}
export async function loaiUngVien(id: string, lyDo: string): Promise<void> { await updateUngVien(id, { trang_thai: 'loai', ly_do_loai: lyDo }) }
export async function moLaiUngVien(id: string): Promise<void> { await updateUngVien(id, { trang_thai: 'dang_chay', ly_do_loai: null }) }

// CONVERT L7→L8: gộp/ tạo PH theo SĐT + tạo HS + (tuỳ) ghi danh lớp. Set hoc_sinh_id + da_convert. Trả hoc_sinh_id.
export async function convertUngVien(uv: UngVien, opts: { khoi?: string | null; lopId?: string | null; mucNangLucId?: string | null }): Promise<string> {
  let phId: string | null = null
  if (uv.sdt_ph?.trim()) {
    const { data: ex } = await supabase.from('phu_huynh').select('id').eq('so_dien_thoai', uv.sdt_ph.trim()).limit(1)
    phId = (ex?.[0] as any)?.id ?? null
  }
  if (!phId && (uv.ho_ten_ph?.trim() || uv.sdt_ph?.trim())) {
    const ph = await createPhuHuynh({ ma_ph: await suggestMaPH(), ho_ten: uv.ho_ten_ph?.trim() || `PH của ${uv.ho_ten_hs}`, so_dien_thoai: uv.sdt_ph?.trim() || null })
    phId = ph.id
  }
  const hs = await createHocSinh({
    ma_hs: await suggestMaHS(), ho_ten: uv.ho_ten_hs, khoi: opts.khoi ?? uv.khoi ?? null,
    phu_huynh_id: phId, diem_test_dau_vao: uv.diem_test ?? null, ngay_nhap_hoc: homNayVN(), trang_thai: 'dang_hoc',
  })
  if (opts.lopId) { try { await ghiDanh(hs.id, opts.lopId, opts.mucNangLucId ?? null) } catch { /* lỗi lớp không chặn convert */ } }
  await updateUngVien(uv.id, { trang_thai: 'da_convert', hoc_sinh_id: hs.id })
  return hs.id
}

// đếm cho toggle bar: L5–L7 từ ung_vien dang_chay; L8 = hoc_sinh đang học; loai = đã loại
export async function demTheoLevel(): Promise<Record<string, number>> {
  const out: Record<string, number> = { L5: 0, L6: 0, L7: 0, L8: 0, loai: 0 }
  const { data } = await supabase.from('ung_vien').select('level, trang_thai').limit(LIMIT)
  for (const r of (data ?? []) as any[]) { if (r.trang_thai === 'dang_chay') out[r.level] = (out[r.level] ?? 0) + 1; else if (r.trang_thai === 'loai') out.loai++ }
  const { count } = await supabase.from('hoc_sinh').select('id', { count: 'exact', head: true }).eq('trang_thai', 'dang_hoc')
  out.L8 = count ?? 0
  return out
}
// L8 = list hoc_sinh đang học (gọn cho tab L8)
export async function listHSDangHoc(): Promise<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null }[]> {
  const { data, error } = await supabase.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi').eq('trang_thai', 'dang_hoc').order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as any
}
