// DUYỆT BỔ TRỢ 2 VÒNG + CHỐT TUẦN (Thùy 17/10). Spec: spec-bo-tro.md §25. Mockup: docs/mockup-duyet-bo-tro-2-vong.html.
// Vòng 1 (Báo động · Điểm thấp) → Đang theo dõi (không chiếm slot) → Vòng 2: duyệt chính thức (đường duyệt cũ, mới chiếm slot).
// KHÔNG realtime: thứ 2 người duyệt bấm "Chốt tuần" ⇒ ảnh chụp lưu DB (bo_tro_chot_tuan*); chỉ tab Báo động đọc live.
// ET 4 buổi (so lớp + màu) và BTVN 4 buổi (Đ/C/S) tính ở DB (fn_botro_et_btvn); file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'
import { listCandidatesLop, duyetLevel, type Candidate, type ChuyenDeStat } from './danhgia'
import { moHoacGopCaseBoTroYeu, kiemSucChua, type UuTienCase } from './botro_yeu'

export type MauET = 'do_dam' | 'do_nhat' | 'xanh_nhat' | 'xanh'
export type BuoiET = { buoi_id: string; ngay: string; diem: number; tb_lop: number; n: number; hang: number; so_bang: number; mau: MauET; ly_do: string }
export type BuoiBTVN = { buoi_id: string; ngay: string; d: number; c: number; s: number; tong: number; pct: number | null }
export type EtBtvn = { et: BuoiET[]; btvn: BuoiBTVN[] }
export type ChuyenDeAnh = { ma: string; ten: string; pha: number | null; truoc: number | null; sau: number | null; diem: number | null; rank: number | null; si_so: number | null }
export type DuLieuTuan = { chuyen_de: ChuyenDeAnh[]; et_btvn: EtBtvn }
export type ChotTuan = { id: string; tuan: string; chot_at: string; chot_ten: string | null; so_diem_thap: number; so_theo_doi: number }

export type UngVienDiemThap = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  ly_do: string[]; kenh: string[]; uu_tien: number; du_lieu: DuLieuTuan; cung_bao_dong: boolean
}
export type DangTheoDoi = {
  id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  vao_at: string; nguon: 'bao_dong' | 'diem_thap' | 'sau_bo_tro'; ghi_chu: string | null; vao_ten: string | null
  so_lieu_vao: Partial<DuLieuTuan>; du_lieu: DuLieuTuan; co_anh_chup: boolean
}
export type BaoDong = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null; moi_nhat: string
  bao_dong: { nguon: string; ghi_chu: string | null; at: string; ai: string | null }[]
  et_btvn: EtBtvn; chuyen_de: ChuyenDeAnh[] | null; cung_diem_thap: boolean
}

export async function danhSachTuan(mon: string, loai: 'diem_thap'): Promise<{ chot: ChotTuan | null; ds: UngVienDiemThap[] }>
export async function danhSachTuan(mon: string, loai: 'theo_doi'): Promise<{ chot: ChotTuan | null; ds: DangTheoDoi[] }>
export async function danhSachTuan(mon: string, loai: 'diem_thap' | 'theo_doi'): Promise<{ chot: ChotTuan | null; ds: any[] }> {
  const { data, error } = await supabase.rpc('fn_botro_danh_sach_tuan', { p_mon: mon, p_loai: loai })
  if (error) throw error
  const d = (data ?? {}) as { chot?: ChotTuan | null; ds?: any[] }
  return { chot: d.chot ?? null, ds: d.ds ?? [] }
}
export async function baoDongLive(mon: string): Promise<BaoDong[]> {
  const { data, error } = await supabase.rpc('fn_botro_bao_dong', { p_mon: mon })
  if (error) throw error
  return (data as BaoDong[]) ?? []
}
export async function theoDoiVao(hs: string, mon: string, nguon: 'bao_dong' | 'diem_thap', ghiChu: string | null, boQua = false): Promise<void> {
  const { error } = await supabase.rpc('fn_botro_theo_doi_vao', { p_hs: hs, p_mon: mon, p_nguon: nguon, p_ghi_chu: ghiChu, p_bo_qua: boQua })
  if (error) throw error
}
export async function theoDoiKetThuc(id: string, tt: 'go' | 'len_chinh_thuc', lyDo: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_botro_theo_doi_ket_thuc', { p_id: id, p_trang_thai: tt, p_ly_do: lyDo })
  if (error) throw error
}

// Vòng 2: duyệt CHÍNH THỨC — đi đúng đường cũ (kiểm trần → hs_level + log → mở case → đổ dạng yếu theo luật DB), rồi đánh dấu đã lên chính thức.
// Máy KHÔNG đề xuất level (levelMayDeXuat = null). Dạng của case đổ bằng luật DB cũ (fn_btyeu_fill_dang_yeu) — người chỉnh ở bước Nội dung.
export async function duyetChinhThuc(input: { theoDoiId: string; hocSinhId: string; mon: string; level: 1 | 2 | 3; uuTien: UuTienCase; lyDo: string | null; nguon: 'bao_dong' | 'diem_thap' | 'sau_bo_tro' }): Promise<void> {
  const chan = await kiemSucChua(input.hocSinhId, input.mon, input.uuTien)
  if (chan) throw new Error(chan)
  await duyetLevel({ hocSinhId: input.hocSinhId, mon: input.mon, loai: 'kien_thuc', levelChot: input.level, levelMayDeXuat: null,
    lyDoMay: { nguon: 'duyet_2_vong', theo_doi_id: input.theoDoiId }, lyDoNguoi: input.lyDo })
  const kq = await moHoacGopCaseBoTroYeu({ hocSinhId: input.hocSinhId, mon: input.mon, maDangs: [], nguon: input.nguon === 'bao_dong' ? 'chuong_do' : 'ai_de_xuat', lyDo: input.lyDo, uuTien: input.uuTien })
  const { error } = await supabase.rpc('fn_btyeu_fill_dang_yeu', { p_case: kq.boTroYeuId })
  if (error) throw error
  await theoDoiKetThuc(input.theoDoiId, 'len_chinh_thuc', input.lyDo)
}

// ── CHỐT TUẦN: quét toàn bộ lớp của môn (engine TS cũ — nặng, vài chục giây) rồi ghi ảnh chụp. Chỉ chạy khi người duyệt bấm. ──
const KENH_DIEM_THAP = new Set(['trend', 'pct_yeu', 'so_lop_et', 'so_lop_mt'])
function anhChuyenDe(cds: ChuyenDeStat[]): ChuyenDeAnh[] {
  return cds.map((cd) => ({
    ma: cd.ma_chuyen_de, ten: cd.ten_chuyen_de, pha: cd.cham?.pha ?? null,
    truoc: cd.cham?.pha === 2 ? cd.cham.truoc : null, sau: cd.cham?.pha === 2 ? cd.cham.sau : null,
    diem: cd.cham?.pha === 1 ? cd.cham.diem : null, rank: cd.cham?.pha === 1 ? cd.cham.rank : null, si_so: cd.cham?.pha === 1 ? cd.cham.siSo : null,
  })).filter((x) => x.pha != null)
}
export async function chotTuan(mon: string, onTienDo?: (xong: number, tong: number) => void): Promise<string> {
  const { data: lops, error } = await supabase.from('lop').select('id, ten_lop, khoi').eq('trang_thai', 'dang_hoc').eq('mon', mon).limit(500)
  if (error) throw error
  const ls = (lops ?? []) as { id: string; ten_lop: string; khoi: string | null }[]
  const dangTheoDoi = await danhSachTuan(mon, 'theo_doi')
  const giu = { hsIds: new Set(dangTheoDoi.ds.map((x) => x.hoc_sinh_id)), out: new Map<string, ChuyenDeStat[]>() }
  const ungVien: any[] = []
  let xong = 0
  const NHOM = 4 // quét 4 lớp song song (đo 17/10: tuần tự 39 lớp ≈ 2,5 phút)
  for (let i = 0; i < ls.length; i += NHOM) {
    const nhom = ls.slice(i, i + NHOM)
    const kq = await Promise.all(nhom.map(async (l) => ({ l, cs: await listCandidatesLop(l.id, giu).catch(() => [] as Candidate[]) })))
    for (const { l, cs } of kq) {
      for (const c of cs) {
        const coDiemThap = c.kenh.some((k) => KENH_DIEM_THAP.has(k)) || c.resetDuyetLai
        if (!coDiemThap || c.sheet.levelKienThuc > 0) continue
        ungVien.push({ hoc_sinh_id: c.hoc_sinh_id, lop: l.ten_lop, khoi: l.khoi, ly_do: c.lyDo, kenh: c.kenh, uu_tien: c.uuTien, chuyen_de: anhChuyenDe(c.sheet.chuyenDes) })
      }
    }
    xong += nhom.length; onTienDo?.(xong, ls.length)
  }
  const theoDoiCd = [...giu.out.entries()].map(([hs, cds]) => ({ hoc_sinh_id: hs, chuyen_de: anhChuyenDe(cds) }))
  const { data, error: e2 } = await supabase.rpc('fn_botro_chot_tuan', { p_mon: mon, p_ung_vien: ungVien, p_theo_doi_cd: theoDoiCd })
  if (e2) throw e2
  return data as string
}
