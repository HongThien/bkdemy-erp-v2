// Data-layer BỔ TRỢ ĐUỔI — HS mới chậm hơn chương trình lớp → học đuổi (mig 0055, redesign 0097).
// ĐỢT (case `bo_tro_duoi`, HS×lớp) mang KẾ HOẠCH (Thùy chốt 07-13): scope DẠNG cần dạy + SỐ BUỔI dự
// kiến (logic gốc: số buổi phải cover hết dạng). Buổi đuổi = buoi_hoc loai='bo_tro_duoi' (điểm danh +
// nhận xét, KHÔNG ET, KHÔNG đo mastery — mục tiêu là kịp kiến thức nghe hiểu buổi chính).
// Card = ĐỢT, sống ở tab "Đang đuổi" suốt vòng đời với chỉ số "Xếp x/N · Học y/N" — xếp lịch BATCH cả
// đợt 1 lần (không còn luồng xong-buổi-1-mới-xếp-buổi-2). Vắng = huỷ suất (không đếm, xếp lại). Học đủ
// N buổi CÓ MẶT → hệ ĐỀ XUẤT đóng (GV bấm Hoàn thành/Gia hạn — không đóng câm).
//
// PHASE 2 "Học từ đầu" online (CEO 19/09, mig 202609191521): "đã dạy dạng" KHÔNG còn là GV tick tay
// (bo_tro_duoi_dang.day_at/day_buoi_id) — HS tự học/tự nộp bài test online, nguồn DUY NHẤT là
// hoc_tu_dau_dang.test_nop_at (HS × mon × ma_dang). Cột day_at/day_buoi_id GIỮ NGUYÊN làm vết lịch sử
// của cơ chế cũ (không xoá — chưa hỏi CEO), nhưng KHÔNG còn ai ghi vào đó nữa; UI đọc field `xong` mới
// (derive từ hoc_tu_dau_dang) thay vì `day_at`. "Đề xuất đóng đợt khi đủ dạng" DÙNG LẠI nguyên banner
// đã có sẵn (trước đọc day_at) — chỉ đổi nguồn dữ liệu, không xây flow mới.
import { supabase } from './supabase'
import { getMyProfile } from './nhansu'

const LIMIT = 10000

export type CanDuoiItem = { caseId: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop_id: string | null; lop: string; mon: string; nguon: string; ly_do: string | null }
export type CaDuoiHS = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; diem_danh: string | null; caseId: string | null; lop: string; mon: string; khoi: string | null }
export type CaDuoi = { id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; trang_thai: string; danh_gia_xong_at: string | null; nguoi_day: string | null; nguoi_day_tg: string | null; muc_hoc_duoi_id: string | null; hs: CaDuoiHS[] }

// 1 buổi trong đợt (view theo-đợt — dùng ở card detail; click mở BuoiDuoiDetail readOnly như cũ).
// nhanXet = nhận xét GV cho HS của đợt ở buổi này; dangDay = mã dạng đã dạy Ở BUỔI NÀY (day_buoi_id khớp).
export type BuoiCuaDot = { buoiId: string; ngay: string; gio_bat_dau: string | null; phong: string | null; danh_gia_xong_at: string | null; diem_danh: string | null; nhanXet: string | null; dangDay: string[] }
// 1 dạng trong scope đợt. `xong`/`xong_at` (Phase 2, 19/09) = ĐÃ nộp bài Test "Học từ đầu" online cho
// đúng (HS × mon × ma_dang) — nguồn `hoc_tu_dau_dang.test_nop_at`, KHÔNG do GV tick. `day_at`/`day_buoi_id`
// giữ lại làm vết lịch sử cơ chế tick tay cũ (0099) — KHÔNG còn ai ghi, đừng dùng để tính tiến độ nữa.
export type DangDuoi = { id: string; ma_dang: string; day_buoi_id: string | null; day_at: string | null; xong: boolean; xong_at: string | null }
export type DotDuoi = CanDuoiItem & {
  khoi: string | null
  created_at: string             // mốc MỞ đợt — cần cho "treo bao lâu" (lib/troly.ts). Vốn đã order by
                                 // cột này nhưng không select ra, nên tuổi đợt không đọc được ở client.
  so_buoi_du_kien: number | null // NULL = chưa chốt kế hoạch (đợt cũ / mới tạo) — UI bắt chốt trước khi xếp
  dangs: DangDuoi[]              // scope dạng của đợt + trạng thái đã dạy
  daXep: number                  // suất HIỆU LỰC: buổi chưa diễn ra/đang mở + buổi đã học có mặt (vắng KHÔNG đếm)
  daHoc: number                  // buổi đã đóng đánh giá + HS CÓ MẶT
  hoan_thanh_at: string | null
  buois: BuoiCuaDot[]            // các buổi của đợt (sort theo ngày) — cho detail, khỏi query lại
  dangDuyetAt: string | null     // NULL = học thuật CHƯA duyệt dạng (gate mềm: Ops vẫn xếp được; GV chưa tick dạng được)
  duyetBoiTen: string | null     // tên người (team học thuật) đã duyệt — hiển thị "duyệt bởi X"
}

// Map "(hoc_sinh_id, mon, ma_dang) → xong_at" từ hoc_tu_dau_dang, cho các case đã biết hs+mon. Dùng
// CHUNG cho listDotDuoi + getDangCuaBuoiDuoi (Phase 2, 19/09) — nguồn DUY NHẤT thay day_at tick tay.
async function xongMapCho(caseInfo: Record<string, { hs: string; mon: string }>): Promise<Map<string, string>> {
  const hsIds = [...new Set(Object.values(caseInfo).map((x) => x.hs))]
  const m = new Map<string, string>()
  if (!hsIds.length) return m
  const { data } = await supabase.from('hoc_tu_dau_dang').select('hoc_sinh_id, mon, ma_dang, test_nop_at').in('hoc_sinh_id', hsIds).limit(LIMIT)
  for (const r of (data ?? []) as any[]) if (r.test_nop_at) m.set(`${r.hoc_sinh_id}|${r.mon}|${r.ma_dang}`, r.test_nop_at)
  return m
}

// Danh sách ĐỢT theo trạng thái — tab "Đang đuổi" (can_duoi) / "Hoàn thành" (hoan_thanh).
// buoi_hoc_hs có 2 FK về buoi_hoc (buoi_hoc_id + bu_cho_buoi_id) → KHÔNG embed được, tách 2 bước
// (bài học HANDOFF §PostgREST-embed).
export async function listDotDuoi(done: boolean): Promise<DotDuoi[]> {
  const { data: cases } = await supabase.from('bo_tro_duoi')
    .select('id, hoc_sinh_id, lop_id, nguon, ly_do, so_buoi_du_kien, created_at, hoan_thanh_at, dang_duyet_at, duyet_boi:dang_duyet_boi(ho_ten), hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), lop:lop_id(ten_lop, mon, khoi)')
    .eq('trang_thai', done ? 'hoan_thanh' : 'can_duoi').order('created_at', { ascending: !done }).limit(LIMIT)
  if (!cases?.length) return []
  const caseIds = (cases as any[]).map((c) => c.id)
  const caseInfo: Record<string, { hs: string; mon: string }> = {}
  for (const c of cases as any[]) caseInfo[c.id] = { hs: c.hoc_sinh_id, mon: c.lop?.mon ?? '' }

  const [{ data: dangRows }, { data: links }, xongMap] = await Promise.all([
    supabase.from('bo_tro_duoi_dang').select('id, bo_tro_duoi_id, ma_dang, day_buoi_id, day_at').in('bo_tro_duoi_id', caseIds).order('ma_dang').limit(LIMIT),
    supabase.from('buoi_hoc_hs').select('bo_tro_duoi_id, hoc_sinh_id, buoi_hoc_id, diem_danh').in('bo_tro_duoi_id', caseIds).limit(LIMIT),
    xongMapCho(caseInfo),
  ])
  const dangsBy: Record<string, DangDuoi[]> = {}
  for (const r of (dangRows ?? []) as any[]) {
    const info = caseInfo[r.bo_tro_duoi_id]
    const xongAt = info ? xongMap.get(`${info.hs}|${info.mon}|${r.ma_dang}`) ?? null : null
    ;(dangsBy[r.bo_tro_duoi_id] ??= []).push({ id: r.id, ma_dang: r.ma_dang, day_buoi_id: r.day_buoi_id, day_at: r.day_at, xong: !!xongAt, xong_at: xongAt })
  }
  // Dạng đã dạy Ở BUỔI NÀO (day_buoi_id) — vết lịch sử tick tay cũ, buổi mới không còn ghi cột này nữa.
  const dangDayByBuoi: Record<string, string[]> = {}
  for (const r of (dangRows ?? []) as any[]) if (r.day_buoi_id) (dangDayByBuoi[r.day_buoi_id] ??= []).push(r.ma_dang)

  const buoiIds = [...new Set(((links ?? []) as any[]).map((l) => l.buoi_hoc_id))]
  let buoiBy: Record<string, any> = {}
  let nxByBuoiHs: Record<string, string> = {}
  if (buoiIds.length) {
    const [{ data: buois }, { data: nxRows }] = await Promise.all([
      supabase.from('buoi_hoc').select('id, ngay, gio_bat_dau, phong, trang_thai, danh_gia_xong_at').in('id', buoiIds).limit(LIMIT),
      supabase.from('buoi_danh_gia').select('buoi_hoc_id, hoc_sinh_id, nhan_xet').in('buoi_hoc_id', buoiIds).limit(LIMIT),
    ])
    buoiBy = Object.fromEntries(((buois ?? []) as any[]).map((b) => [b.id, b]))
    nxByBuoiHs = Object.fromEntries(((nxRows ?? []) as any[]).map((r) => [`${r.buoi_hoc_id}|${r.hoc_sinh_id}`, r.nhan_xet]))
  }
  const buoisBy: Record<string, BuoiCuaDot[]> = {}
  for (const l of (links ?? []) as any[]) {
    const b = buoiBy[l.buoi_hoc_id]
    if (!b || b.trang_thai === 'huy') continue // ca đã huỷ = không tồn tại với đợt
    ;(buoisBy[l.bo_tro_duoi_id] ??= []).push({
      buoiId: b.id, ngay: b.ngay, gio_bat_dau: b.gio_bat_dau, phong: b.phong, danh_gia_xong_at: b.danh_gia_xong_at, diem_danh: l.diem_danh,
      nhanXet: nxByBuoiHs[`${b.id}|${l.hoc_sinh_id}`] ?? null, dangDay: dangDayByBuoi[b.id] ?? [],
    })
  }

  return (cases as any[]).map((c) => {
    const buois = (buoisBy[c.id] ?? []).sort((a, b) => a.ngay.localeCompare(b.ngay))
    // Vắng = huỷ suất (Thùy 07-13): buổi ĐÃ đóng mà không có mặt → không đếm vào xếp lẫn học.
    const daHoc = buois.filter((b) => b.danh_gia_xong_at && b.diem_danh === 'co_mat').length
    const daXep = daHoc + buois.filter((b) => !b.danh_gia_xong_at).length
    return {
      caseId: c.id, hoc_sinh_id: c.hoc_sinh_id, ho_ten: c.hoc_sinh?.ho_ten ?? '?', ma_hs: c.hoc_sinh?.ma_hs ?? null,
      lop_id: c.lop_id, lop: c.lop?.ten_lop ?? '—', mon: c.lop?.mon ?? '', khoi: c.lop?.khoi ?? null,
      nguon: c.nguon, ly_do: c.ly_do, so_buoi_du_kien: c.so_buoi_du_kien,
      created_at: c.created_at, hoan_thanh_at: c.hoan_thanh_at,
      dangs: dangsBy[c.id] ?? [], daXep, daHoc, buois,
      dangDuyetAt: c.dang_duyet_at ?? null, duyetBoiTen: c.duyet_boi?.ho_ten ?? null,
    }
  })
}

// Chốt/sửa KẾ HOẠCH đợt: số buổi dự kiến + scope dạng. DIFF (không delete-all-insert-all — 0099:
// dòng dạng mang dấu ĐÃ DẠY day_at/day_buoi_id, replace toàn bộ sẽ xoá mất dấu của dạng giữ nguyên).
export async function chotKeHoachDuoi(caseId: string, soBuoi: number, maDangs: string[]): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi').update({ so_buoi_du_kien: soBuoi }).eq('id', caseId)
  if (error) throw error
  const { data: cur, error: eCur } = await supabase.from('bo_tro_duoi_dang').select('id, ma_dang').eq('bo_tro_duoi_id', caseId).limit(LIMIT)
  if (eCur) throw eCur
  const curMa = new Set(((cur ?? []) as any[]).map((r) => r.ma_dang))
  const moiMa = new Set(maDangs)
  const boIds = ((cur ?? []) as any[]).filter((r) => !moiMa.has(r.ma_dang)).map((r) => r.id)
  const themMa = maDangs.filter((m) => !curMa.has(m))
  if (boIds.length) {
    const { error: eDel } = await supabase.from('bo_tro_duoi_dang').delete().in('id', boIds)
    if (eDel) throw eDel
  }
  if (themMa.length) {
    const { error: eIns } = await supabase.from('bo_tro_duoi_dang').insert(themMa.map((m) => ({ bo_tro_duoi_id: caseId, ma_dang: m })))
    if (eIns) throw eIns
  }
}

// DUYỆT kế hoạch (team học thuật, 0100): chốt dạng + số buổi ĐỒNG THỜI đánh dấu ĐÃ DUYỆT (dang_duyet_at
// + người duyệt). Sau đó GV dạy mới có dạng để bám/tick. KHÁC chotKeHoachDuoi (chỉ ghi kế hoạch, dùng
// cho gia hạn +1 buổi sau khi đã duyệt) — duyệt chỉ do học thuật của môn bấm 1 lần đầu.
export async function duyetKeHoachDuoi(caseId: string, soBuoi: number, maDangs: string[]): Promise<void> {
  await chotKeHoachDuoi(caseId, soBuoi, maDangs)
  const prof = await getMyProfile()
  const { error } = await supabase.from('bo_tro_duoi')
    .update({ dang_duyet_at: new Date().toISOString(), dang_duyet_boi: prof?.nhanSu.id ?? null })
    .eq('id', caseId)
  if (error) throw error
}

// Đợt CHỜ team học thuật chốt/duyệt dạng — derive cho "Việc của tôi" + gate màn. Lọc CHƯA duyệt +
// môn thuộc quyền học thuật của người xem (mons = hocThuatMons). KHÔNG bảng tasks (đúng luật derive).
export async function listDotChoDuyetDuoi(mons: string[]): Promise<DotDuoi[]> {
  if (!mons.length) return []
  const all = await listDotDuoi(false)
  return all.filter((d) => d.dangDuyetAt == null && mons.includes(d.mon))
}

// Scope dạng (kèm trạng thái ĐÃ XONG online + CÓ MCQ hay không) của MỌI case trong 1 buổi đuổi — cho
// BuoiDuoiDetail chọn KỊCH BẢN 1/2/3 (Thùy 21/09, mig 202609212145). Trả map caseId → dạng[].
// Thay bản cũ tự JOIN hoc_tu_dau_dang Ở CLIENT (nợ §2.0, tác giả Phase 2 tự ghi chú) bằng 1 RPC
// (`fn_duoi_dang_trang_thai`) — trả nợ cũ + thêm `co_mcq` mới trong CÙNG 1 lần sửa.
export type DangDuoiBuoi = { ma_dang: string; xong: boolean; co_mcq: boolean }
export async function getDangCuaBuoiDuoi(buoiId: string): Promise<Record<string, DangDuoiBuoi[]>> {
  const { data, error } = await supabase.rpc('fn_duoi_dang_trang_thai', { p_buoi: buoiId })
  if (error) throw error
  const out: Record<string, DangDuoiBuoi[]> = {}
  for (const r of (data ?? []) as any[]) (out[r.bo_tro_duoi_id] ??= []).push({ ma_dang: r.ma_dang, xong: !!r.xong, co_mcq: !!r.co_mcq })
  return out
}

// Kịch bản 1/2/3 (Thùy 21/09) cho 1 dạng: phụ thuộc "dạng có MCQ" (derive, per dạng) × "buổi có thiết
// bị" (TA tự khai, 1 lần/buổi) — spec-bo-tro.md §6-tương-đương cho Đuổi. `null` coThietBi = TA CHƯA chọn.
export type KichBanDuoi = 1 | 2 | 3 | null // null = chưa chọn thiết bị, chưa biết kịch bản
export function kichBanDuoi(coMcq: boolean, coThietBi: boolean | null): KichBanDuoi {
  if (coThietBi == null) return null
  if (!coThietBi) return 3
  return coMcq ? 1 : 2
}

// Cờ "buổi này có iPad không" (Thùy 21/09) — 1 biến TA tự khai/buổi, ghép với co_mcq/dạng ra kịch bản.
export async function setBuoiCoThietBi(buoiId: string, coThietBi: boolean): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ duoi_co_thiet_bi: coThietBi }).eq('id', buoiId)
  if (error) throw error
}

// Bài TEST giấy đang CHỜ nộp (nếu có) cho (em × dạng) — mở panel thì resume bài này thay vì sinh mới
// (tránh bấm 2 lần đẻ 2 bài test khác câu, mất chấm dở của bài đầu). Chỉ áp cho 'htd_test' — 'htd_luyen'
// không gate/không cần resume, mỗi lần "in phiếu" là 1 lượt luyện mới (đúng tinh thần Yếu "in nhiều phiếu được").
export async function baiTestDangChoDuoi(hocSinhId: string, mon: string, maDang: string): Promise<{ bai_test_id: string } | null> {
  const { data: bt } = await supabase.from('bai_test').select('id').eq('hoc_sinh_id', hocSinhId).eq('mon', mon).eq('loai', 'htd_test').limit(LIMIT)
  const ids = ((bt ?? []) as any[]).map((r) => r.id)
  if (!ids.length) return null
  const { data: cau } = await supabase.from('bai_test_cau').select('bai_test_id').in('bai_test_id', ids).eq('ma_dang', maDang).limit(1)
  const btId = (cau as any[])?.[0]?.bai_test_id
  if (!btId) return null
  const { data: lam } = await supabase.from('bai_lam').select('trang_thai').eq('bai_test_id', btId).eq('hoc_sinh_id', hocSinhId).limit(1)
  if ((lam as any[])?.[0]?.trang_thai === 'da_nop') return null // đã nộp — không phải "đang chờ"
  return { bai_test_id: btId }
}

// Sinh 1 bài (luyện/test) cho 1 em × 1 dạng, KHÔNG giới hạn MCQ — kịch bản 2/3.
export async function sinhBaiGiayDuoi(
  buoiId: string, hocSinhId: string, mon: string, maDang: string, loai: 'htd_luyen' | 'htd_test', soCau?: number,
): Promise<{ bai_test_id: string; so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_duoi_giay_sinh', {
    p_buoi: buoiId, p_hoc_sinh: hocSinhId, p_mon: mon, p_ma_dang: maDang, p_loai: loai, p_so_cau: soCau ?? 5,
  })
  if (error) throw error
  return data as { bai_test_id: string; so_cau: number }
}

export type CauGiayDuoi = { id: string; thu_tu: number; noi_dung: string | null; lua_chon: string[] | null; loai_cau: string; verdict: 'correct' | 'partial' | 'wrong' | null }
// Câu của 1 bài giấy — verdict luôn null lúc mới sinh (chưa ai chấm); mở lại bài đang chấm dở thì gọi
// thêm layVerdictDaCham để lấp verdict đã có.
export async function layCauBaiTest(baiTestId: string): Promise<CauGiayDuoi[]> {
  const { data, error } = await supabase.from('bai_test_cau').select('id, thu_tu, noi_dung, lua_chon, loai_cau').eq('bai_test_id', baiTestId).order('thu_tu').limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((c) => ({ ...c, verdict: null }))
}
// Verdict đã chấm (nếu TA quay lại mở tiếp bài đang làm dở) — tra qua bai_lam của (bai_test, hoc_sinh).
export async function layVerdictDaCham(baiTestId: string, hocSinhId: string): Promise<Record<string, 'correct' | 'partial' | 'wrong'>> {
  const { data: bl } = await supabase.from('bai_lam').select('id').eq('bai_test_id', baiTestId).eq('hoc_sinh_id', hocSinhId).limit(1)
  const blId = (bl as any[])?.[0]?.id
  if (!blId) return {}
  const { data } = await supabase.from('bai_lam_cau').select('bai_test_cau_id, verdict').eq('bai_lam_id', blId).limit(LIMIT)
  const out: Record<string, 'correct' | 'partial' | 'wrong'> = {}
  for (const r of (data ?? []) as any[]) if (r.verdict) out[r.bai_test_cau_id] = r.verdict
  return out
}
// TA chấm ĐCS 1 câu (correct/partial/wrong, null = bấm lại để xoá).
export async function chamTayCauDuoi(baiTestCauId: string, verdict: 'correct' | 'partial' | 'wrong' | null): Promise<void> {
  const { error } = await supabase.rpc('fn_botro_cham_tay', { p_bai_test_cau: baiTestCauId, p_verdict: verdict })
  if (error) throw error
}
// Nộp bài giấy/tay — câu chưa chấm = bỏ trống = sai.
export async function nopBaiGiayDuoi(baiTestId: string): Promise<{ bo_trong: number; so_dung: number; so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_botro_giay_nop', { p_bai_test: baiTestId })
  if (error) throw error
  return data as { bo_trong: number; so_dung: number; so_cau: number }
}
// Tick/bỏ tick tay "đã dạy dạng này" — CƠ CHẾ CŨ (0099), KHÔNG còn UI nào gọi hàm này từ Phase 2 (19/09):
// tiến độ giờ tự suy từ hoc_tu_dau_dang.test_nop_at, GV không tick nữa. Giữ hàm + cột day_at/day_buoi_id
// làm vết lịch sử — CHƯA xoá (chưa hỏi CEO), không dùng để tính tiến độ hiển thị.
export async function setDangDay(dangRowId: string, buoiId: string | null): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi_dang')
    .update(buoiId ? { day_buoi_id: buoiId, day_at: new Date().toISOString() } : { day_buoi_id: null, day_at: null })
    .eq('id', dangRowId)
  if (error) throw error
}

// Đã xếp (done=false) / Hoàn thành (done=true): buổi đuổi + HS. "xong buổi" = danh_gia_xong_at có.
export async function listCaDuoi(done: boolean): Promise<CaDuoi[]> {
  const { data: buois } = await supabase.from('buoi_hoc')
    .select('id, ngay, gio_bat_dau, gio_ket_thuc, phong, trang_thai, danh_gia_xong_at, nguoi_day, nguoi_day_tg, muc_hoc_duoi_id')
    .eq('loai', 'bo_tro_duoi').neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  const filt = (buois ?? []).filter((b: any) => (done ? !!b.danh_gia_xong_at : !b.danh_gia_xong_at))
  if (!filt.length) return []
  const ids = filt.map((b: any) => b.id)
  const { data: hs } = await supabase.from('buoi_hoc_hs')
    .select('buoi_hoc_id, hoc_sinh_id, diem_danh, bo_tro_duoi_id, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), duoi:bo_tro_duoi_id(lop:lop_id(ten_lop, mon, khoi))')
    .in('buoi_hoc_id', ids).limit(LIMIT)
  const by: Record<string, any[]> = {}
  for (const r of hs ?? []) (by[(r as any).buoi_hoc_id] ??= []).push(r)
  return filt.map((b: any) => ({
    ...b, hs: (by[b.id] ?? []).map((r: any) => ({
      hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
      diem_danh: r.diem_danh, caseId: r.bo_tro_duoi_id, lop: r.duoi?.lop?.ten_lop ?? '', mon: r.duoi?.lop?.mon ?? '', khoi: r.duoi?.lop?.khoi ?? null,
    })),
  }))
}
export const buoiDuoiSapToi = () => listCaDuoi(false)

// Thông tin per-HS (lớp đuổi + môn) của 1 buổi đuổi CỤ THỂ — dùng khi mở buổi đuổi CHỈ có buoiId
// (mở từ "Việc của tôi", không có sẵn CaDuoi đầy đủ như màn Bổ trợ Đuổi).
export async function getBuoiDuoiHsInfo(buoiId: string): Promise<Record<string, { lop: string; mon: string }>> {
  const { data } = await supabase.from('buoi_hoc_hs')
    .select('hoc_sinh_id, duoi:bo_tro_duoi_id(lop:lop_id(ten_lop, mon))')
    .eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const out: Record<string, { lop: string; mon: string }> = {}
  for (const r of (data ?? []) as any[]) out[r.hoc_sinh_id] = { lop: r.duoi?.lop?.ten_lop ?? '', mon: r.duoi?.lop?.mon ?? '' }
  return out
}

// Tạo buổi đuổi mới (loai='bo_tro_duoi', không lop_id; ngày/giờ/phòng/GV/TA/mức học đuổi).
// Mức học đuổi gắn theo CA (KHÔNG theo lớp gốc) — mỗi ca có thể khác giá (Thùy 07-05).
export async function taoBuoiDuoi(input: { ngay: string; gio_bat_dau?: string | null; gio_ket_thuc?: string | null; phong?: string | null; nguoi_day?: string | null; nguoi_day_tg?: string | null; muc_hoc_duoi_id?: string | null }): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('buoi_hoc').insert({
    loai: 'bo_tro_duoi', lop_id: null, ngay: input.ngay, gio_bat_dau: input.gio_bat_dau ?? null, gio_ket_thuc: input.gio_ket_thuc ?? null,
    phong: input.phong ?? null, nguoi_day: input.nguoi_day ?? null, nguoi_day_tg: input.nguoi_day_tg ?? null,
    muc_hoc_duoi_id: input.muc_hoc_duoi_id ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}
// Gán/đổi mức học đuổi cho CA đã tạo (vd tạo buổi trước, gán giá sau).
export async function setMucHocDuoi(buoiId: string, mucId: string | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ muc_hoc_duoi_id: mucId }).eq('id', buoiId)
  if (error) throw error
}
// Thêm case vào buổi đuổi (link bo_tro_duoi_id). Idempotent: bỏ qua nếu HS đã trong buổi.
export async function themHSVaoBuoiDuoi(buoiId: string, items: { hoc_sinh_id: string; caseId: string }[]): Promise<void> {
  if (!items.length) return
  const { data: cur } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const have = new Set((cur ?? []).map((r: any) => r.hoc_sinh_id))
  const rows = items.filter((i) => !have.has(i.hoc_sinh_id)).map((i) => ({ buoi_hoc_id: buoiId, hoc_sinh_id: i.hoc_sinh_id, bo_tro_duoi_id: i.caseId }))
  if (!rows.length) return
  const { error } = await supabase.from('buoi_hoc_hs').insert(rows)
  if (error) throw error
}

// Gợi ý GV/TA/giờ/phòng từ LỚP HS đang đuổi.
export async function goiYBuoiDuoi(lopId: string | null): Promise<{ gv_id: string | null; ta_id: string | null }> {
  if (!lopId) return { gv_id: null, ta_id: null }
  const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id, vai_tro, la_chinh').eq('lop_id', lopId).limit(LIMIT)
  const pick = (vai: string) => (pc ?? []).find((p: any) => p.vai_tro === vai && p.la_chinh)?.nhan_su_id ?? (pc ?? []).find((p: any) => p.vai_tro === vai)?.nhan_su_id ?? null
  return { gv_id: pick('gv'), ta_id: pick('tg') }
}

// Thêm case thủ công (path 2: start từ Bổ trợ đuổi). Chặn trùng case đang-đuổi (unique partial).
export async function themCaseDuoi(input: { hoc_sinh_id: string; lop_id: string | null; ly_do?: string | null }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bo_tro_duoi').insert({
    hoc_sinh_id: input.hoc_sinh_id, lop_id: input.lop_id ?? null, ly_do: input.ly_do ?? null, nguon: 'thu_cong', actor: user?.id ?? null,
  })
  if (error) {
    if ((error as any).code === '23505') throw new Error('HS này đã có cờ bổ trợ đuổi cho lớp đó rồi.')
    throw error
  }
}
// Hoàn thành cả KHÓA đuổi → rời luồng (biến mất khỏi mọi tab).
export async function hoanThanhKhoaDuoi(caseId: string): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi').update({ trang_thai: 'hoan_thanh', hoan_thanh_at: new Date().toISOString() }).eq('id', caseId)
  if (error) throw error
}
// Bỏ cờ (gắn nhầm) — chỉ khi chưa từng xếp buổi nào (an toàn).
export async function xoaCaseDuoi(caseId: string): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi').delete().eq('id', caseId)
  if (error) throw error
}

// Tìm HS cho việc thêm case thủ công (gõ tên/mã).
export async function timHocSinhDuoi(q: string): Promise<{ id: string; ma_hs: string | null; ho_ten: string }[]> {
  if (!q.trim()) return []
  const { data } = await supabase.from('hoc_sinh').select('id, ma_hs, ho_ten').or(`ho_ten.ilike.%${q.trim()}%,ma_hs.ilike.%${q.trim()}%`).eq('trang_thai', 'dang_hoc').order('ho_ten').limit(8)
  return (data ?? []) as any
}
// Lớp HS đang học (để chọn lớp đuổi khi thêm thủ công).
export async function lopCuaHS(hocSinhId: string): Promise<{ id: string; ten_lop: string; mon: string }[]> {
  const { data } = await supabase.from('hoc_sinh_lop').select('lop:lop_id(id, ten_lop, mon)').eq('hoc_sinh_id', hocSinhId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  return (data ?? []).map((r: any) => r.lop).filter(Boolean)
}

// Đếm tab: Đang đuổi = ĐỢT đang mở · Đã xếp = BUỔI đang chờ · Hoàn thành = ĐỢT đã đóng (07-13:
// tab 1 và 3 đơn vị là ĐỢT, chỉ tab 2 là buổi).
export async function demTabDuoi(): Promise<Record<string, number>> {
  const [{ count: dang }, { count: xong }, l2] = await Promise.all([
    supabase.from('bo_tro_duoi').select('id', { count: 'exact', head: true }).eq('trang_thai', 'can_duoi'),
    supabase.from('bo_tro_duoi').select('id', { count: 'exact', head: true }).eq('trang_thai', 'hoan_thanh'),
    listCaDuoi(false),
  ])
  return { canduoi: dang ?? 0, daxep: l2.length, xong: xong ?? 0 }
}
