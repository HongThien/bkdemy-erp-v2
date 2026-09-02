// ============================================================================
// mt.ts — MT (kỳ thi lớn, "Grand Slam"). MT MASTER vẫn 2-tầng như trước (soạn 1 lần, nhiều PHẦN
// tai_lieu_phan loai_phan='custom', KHÔNG bóc-ảnh như Đề thi) — 1 master gán được NHIỀU lớp/nhiều lần
// (khác ET: 1 ET = 1 lớp+ngày cố định).
// ⭐ 07-08 (Thùy): MT KHÔNG còn buổi_hoc(loai='mt') RIÊNG — "Chấm MT phải hiện trong buổi học giống
// như chấm ET". Giờ MT là 1 PHASE của buổi_hoc(loai='thuong') THẬT (tìm/tạo qua `moBuoi`, giống ET
// không có buổi riêng của nó), cột đóng riêng `mt_dong_at` (mig 0091), tab UI ở BuoiHocScreen (MTTab).
// "Gán vào buổi" = tìm/tạo buổi thường (lớp,ngày) + tạo doc con `mt_buoi` (copy phans từ master) +
// đóng LUÔN đánh giá+ET của buổi đó (N/A — Thùy: "buổi MT chỉ có 1 hoạt động = kiểm tra").
// ============================================================================
import { supabase } from './supabase'
import { listPhan, addPhan, setCauOfPhan, getTaiLieuFull, createTaiLieu, updateTaiLieu, deleteTaiLieu, khoCuaMon, nhanhCuaCau, type TaiLieu, type TaiLieuPhan, type TaiLieuFull } from './tailieu'
import { moBuoi } from './gami'
import { listLopBac, type CauHoi } from './kho/api'
import { copyPhanHinhSangBuoi, xoaPhanHinhTai, deleteBuoi as deleteHinhBuoi } from './kho/hinhGiaoTrinh'

const LIMIT = 10000

// ── MT MASTER (CRUD) ──────────────────────────────────────────────────────
export async function listMT(mon?: string): Promise<TaiLieu[]> {
  let q = supabase.from('tai_lieu').select('*').eq('loai', 'mt').is('lop_id', null).order('created_at', { ascending: false }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}
export async function getMT(id: string): Promise<TaiLieu> {
  const { data, error } = await supabase.from('tai_lieu').select('*').eq('id', id).single()
  if (error) throw error
  return data as TaiLieu
}
export const createMT = (input: { ten: string; khoi: string; mon: string }): Promise<TaiLieu> => createTaiLieu({ loai: 'mt', ...input })
export const renameMT = (id: string, ten: string): Promise<void> => updateTaiLieu(id, { ten })
// cascade phan+cau (KHÔNG xoá câu ở kho); xoá master KHÔNG tự xoá các instance đã gán (nguon_id giữ trace, nhưng
// đứng độc lập). Buổi Hình MẪU (cau_hinh.hinhBuoiId) xoá kèm — bài Hình đã COPY sang buổi lớp vẫn còn (snapshot).
export async function deleteMT(id: string): Promise<void> {
  const { data } = await supabase.from('tai_lieu').select('cau_hinh').eq('id', id).single()
  const hinhBuoiId = ((data as { cau_hinh?: { hinhBuoiId?: string } } | null)?.cau_hinh?.hinhBuoiId) ?? null
  await deleteTaiLieu(id)
  if (hinhBuoiId) await deleteHinhBuoi(hinhBuoiId).catch(() => { /* best-effort — không chặn xoá MT */ })
}

// ── PHẦN (mảng/chuyên đề trong MT) ───────────────────────────────────────
export async function listPhanMT(taiLieuId: string): Promise<TaiLieuPhan[]> {
  return (await listPhan(taiLieuId)).filter((p) => p.loai_phan === 'custom')
}
export async function addPhanMT(taiLieuId: string, tieuDe: string): Promise<TaiLieuPhan> {
  const phans = await listPhan(taiLieuId)
  const tt = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  return addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt, loai_phan: 'custom', ref_ma: null, tieu_de: tieuDe, noi_dung: null })
}

// Câu ĐANG DÙNG xuyên MỌI PHẦN của 1 MT (khác ET: ET chỉ 1 "phần" nên rows tự gói gọn; MT có nhiều
// phần nên phải gom cả để suggestCauForDang không gợi ý trùng câu giữa các phần).
export async function usedCauCuaMT(taiLieuId: string): Promise<Set<string>> {
  const full = await getTaiLieuFull(taiLieuId)
  return new Set(full.phans.filter((p) => p.loai_phan === 'custom').flatMap((p) => p.caus.map((c) => c.ma_cau)))
}

// Giờ/phòng/GV là thuộc tính CỦA BUỔI HỌC (Thùy 07-08: "cái đó thuộc về buổi học"), KHÔNG phải của
// việc gán MT — MT chỉ cần biết LỚP nào + NGÀY nào. Nếu buổi chưa tồn tại, tự suy giờ/phòng từ TKB
// (giống hệt "Mở buổi" bình thường từ buoiAoCuaNgay) — KHÔNG hỏi lại người dùng.
function thuOfMT(ngay: string): number { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 }
async function tkbSlotCuaLop(lopId: string, ngay: string): Promise<{ gio_bat_dau?: string; gio_ket_thuc?: string; phong?: string | null }> {
  const thu = thuOfMT(ngay)
  const { data } = await supabase.from('thoi_khoa_bieu').select('gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den')
    .eq('lop_id', lopId).eq('thu', thu).lte('hieu_luc_tu', ngay).limit(LIMIT)
  const slot = (data ?? []).find((s: any) => !s.hieu_luc_den || s.hieu_luc_den >= ngay)
  return slot ? { gio_bat_dau: slot.gio_bat_dau, gio_ket_thuc: slot.gio_ket_thuc, phong: slot.phong } : {}
}

// ── NÂNG CAO theo HỆ LỚP (Thùy 07-08): dạng đã sẵn `bac_toi_thieu` trong bản đồ kiến thức (S>A>B>C,
// "bậc THẤP NHẤT còn học dạng") — TÁI DÙNG y hệt, KHÔNG đẻ cờ "chung/riêng" thủ công mới. Gán MT vào
// lớp hệ thấp hơn yêu cầu của 1 câu → câu đó tự loại (giống HS lớp đó vốn không học dạng ấy). Phần rỗng
// sau khi lọc (toàn câu nâng cao) → bỏ hẳn phần đó khỏi doc con.
// Trả map ma_cau → bac_toi_thieu của DẠNG CHÍNH câu đó. Khoá theo CÂU (không theo dạng) vì MT trộn nhánh
// (Đại + Hình giải tích): mỗi câu tra đúng ban_do của nhánh nó (`nhanhCuaCau`), mã dạng 2 nhánh có thể trùng.
async function bacTheoCau(master: TaiLieuFull): Promise<Record<string, string>> {
  const caus = master.phans.filter((p) => p.loai_phan === 'custom').flatMap((p) => p.caus).filter((c) => c.dang_chinh)
  const tblCua = (maCau: string) => khoCuaMon(master.taiLieu.mon, nhanhCuaCau(master.taiLieu, maCau)).banDoTbl
  const byTbl = new Map<string, Set<string>>()
  for (const c of caus) { const t = tblCua(c.ma_cau); if (!byTbl.has(t)) byTbl.set(t, new Set()); byTbl.get(t)!.add(c.dang_chinh) }
  const bac: Record<string, string> = {} // `${banDoTbl}|${ma_dang}` → bac
  for (const [tbl, mas] of byTbl) {
    const { data, error } = await supabase.from(tbl).select('ma_dang, bac_toi_thieu').in('ma_dang', [...mas]).limit(LIMIT)
    if (error) throw error
    for (const r of (data as { ma_dang: string; bac_toi_thieu: string }[])) bac[`${tbl}|${r.ma_dang}`] = r.bac_toi_thieu
  }
  const out: Record<string, string> = {}
  for (const c of caus) { const b = bac[`${tblCua(c.ma_cau)}|${c.dang_chinh}`]; if (b) out[c.ma_cau] = b }
  return out
}

// ── GÁN VÀO BUỔI (lớp+ngày cụ thể) ───────────────────────────────────────
export type GanMTKetQua = { buoiId: string; taiLieuId: string; buoiMoi: boolean; soCauLoai: number; soBaiHinh: number }
// Tìm/tạo buổi_hoc(loai='thuong', lop_id, ngay) — QUA `moBuoi` (giống hệt OPS "Mở buổi" thường, kể cả
// seed sĩ số) — rồi tạo doc con bám (lớp+ngày) copy từ master (xoá-rồi-tạo nếu re-gán, cùng nguyên tắc
// "doc vận hành 1-1 (lớp+ngày+loại)" như trichXuatBuoi).
export async function ganMTVaoBuoi(masterId: string, opts: { lopId: string; ngay: string }): Promise<GanMTKetQua> {
  const { data: { user } } = await supabase.auth.getUser()

  // 1) Buổi THƯỜNG cho (lớp,ngày) — MT giờ là 1 PHASE của buổi thường (giống ET), KHÔNG còn buổi riêng.
  const before = await supabase.from('buoi_hoc').select('id').eq('loai', 'thuong').eq('lop_id', opts.lopId).eq('ngay', opts.ngay).neq('trang_thai', 'huy').maybeSingle()
  const buoiMoi = !before.data
  const slot = buoiMoi ? await tkbSlotCuaLop(opts.lopId, opts.ngay) : {}
  const buoi = await moBuoi(opts.lopId, opts.ngay, slot)
  const buoiId = buoi.id
  // Buổi có MT CHỈ có 1 hoạt động = kiểm tra (Thùy 07-08) → đóng LUÔN cả 4 phase-khác của buổi này
  // (đánh giá/chấm-bài-trên-lớp/ET/BTVN, KHÔNG áp dụng cho MT, không phải "chưa làm"). Set thẳng cột,
  // KHÔNG qua closePhase/dongDanhGia — các hàm đó tính Elo/EXP hoặc cần data đánh giá thật; ở đây chỉ
  // đánh dấu "N/A" nên set trực tiếp, TRÁNH side-effect. ⚠ Fix 07-10 (Thùy báo lỗi): TRƯỚC chỉ đóng
  // đánh-giá+ET, QUÊN ingame+btvn → 2 task "Chấm bài trên lớp"/"Chấm BTVN" kẹt mãi ở Việc-của-tôi + buổi
  // gần như KHÔNG BAO GIỜ lên `hoan_tat` (điều kiện hoàn tất của phase='mt' đòi CẢ ingame_dong_at đã set).
  // Guard `is(...,null)` → không đè timestamp nếu lỡ đã đóng (chấm/đánh giá thật trước khi biết có MT).
  const nowIso = new Date().toISOString()
  await supabase.from('buoi_hoc').update({ danh_gia_xong_at: nowIso }).eq('id', buoiId).is('danh_gia_xong_at', null)
  await supabase.from('buoi_hoc').update({ ingame_dong_at: nowIso }).eq('id', buoiId).is('ingame_dong_at', null)
  await supabase.from('buoi_hoc').update({ et_dong_at: nowIso }).eq('id', buoiId).is('et_dong_at', null)
  await supabase.from('buoi_hoc').update({ btvn_dong_at: nowIso }).eq('id', buoiId).is('btvn_dong_at', null)

  // 2) Doc con bám (lớp+ngày) — re-gán CÙNG MASTER cho lớp này = THAY THẾ (1 lớp chỉ có 1 lượt gán
  // đang hiệu lực / MT, xem cảnh báo "đè" ở GanBuoiModal).
  const master = await getTaiLieuFull(masterId)
  const customPhans = master.phans.filter((p) => p.loai_phan === 'custom')

  // Lọc câu NÂNG CAO lớp không đủ tư cách (bac_toi_thieu của dạng > bậc của lớp) — xem ghi chú trên.
  const lopBacs = await listLopBac() // desc thu_tu: S,A,B,C
  const { data: lopRow } = await supabase.from('lop').select('bac').eq('id', opts.lopId).single()
  const thuTuCua = (ma: string | null | undefined) => lopBacs.find((b) => b.ma === ma)?.thu_tu ?? 0
  const lopThuTu = thuTuCua((lopRow as { bac?: string } | null)?.bac)
  const bacMap = await bacTheoCau(master) // ma_cau → bac_toi_thieu (theo đúng nhánh kho của từng câu)

  // ⚠ BUG THẬT 07-13 (Thùy: "gán MT vẫn ko được" — báo thành công nhưng vào xem vẫn thiếu nội dung):
  // đời cũ XOÁ MỌI bản cũ rồi TẠO MỚI, không kiểm tra lỗi xoá. Nếu bản cũ đang bị bảng khác tham chiếu
  // (vd `de_test.tai_lieu_id` — "Đề test đầu vào" đang active trỏ vào chính bản mt_buoi này), Postgres
  // CHẶN xoá (FK RESTRICT) nhưng code cứ lặng lẽ đi tiếp → bản cũ VẪN CÒN, bản mới chồng thêm lên
  // (kiểm chứng: 3 bản trùng (nguon_id, lop_id) cùng tồn tại cho 9S1 · Mã 1, tích tụ qua nhiều lần
  // "re-gán" tưởng đã thay thế). Fix TẬN GỐC (Thùy 07-13: "fix lỗi duplicate tránh sau này bug tiếp"):
  // KHÔNG xoá-rồi-tạo nữa — TÌM bản đang giữ (nếu có) rồi CẬP NHẬT TẠI CHỖ (giữ nguyên id, đổi ngày +
  // thay phans/câu) → không bao giờ đụng FK của bảng khác trỏ vào đúng bản đang giữ. Nếu lịch sử để lại
  // NHIỀU bản trùng (bug cũ), GIỮ bản CŨ NHẤT (nhiều khả năng là bản bị tham chiếu — created_at asc),
  // dọn các bản THỪA best-effort (bỏ qua nếu 1 bản thừa khác lại đang bị tham chiếu — cực hiếm).
  const { data: existing, error: eFind } = await supabase.from('tai_lieu').select('id, ngay')
    .eq('loai', 'mt_buoi').eq('nguon_id', masterId).eq('lop_id', opts.lopId).order('created_at', { ascending: true }).limit(LIMIT)
  if (eFind) throw eFind
  const keepId = (existing as { id: string }[] | null)?.[0]?.id ?? null
  const ngayCu = (existing as { ngay: string | null }[] | null)?.[0]?.ngay ?? null
  for (const row of ((existing as { id: string }[] | null) ?? []).slice(1)) await supabase.from('tai_lieu').delete().eq('id', row.id)

  let docCon: TaiLieu
  if (keepId) {
    await supabase.from('tai_lieu_phan').delete().eq('tai_lieu_id', keepId) // xoá phans/câu CŨ (cascade) trước khi chép lại
    const { data: upd, error: eUpd } = await supabase.from('tai_lieu').update({
      ten: master.taiLieu.ten, khoi: master.taiLieu.khoi, mon: master.taiLieu.mon, theme: master.taiLieu.theme, ngay: opts.ngay,
      cau_hinh: master.taiLieu.cau_hinh ?? {},   // ⭐ copy cau_hinh (etFormByCau/lines/etColByGroup/etMaDe) sang bản buổi — trước đây bỏ sót
    }).eq('id', keepId).select().single()
    if (eUpd) throw eUpd
    docCon = upd as TaiLieu
  } else {
    const { data: nw, error: eNw } = await supabase.from('tai_lieu').insert({
      loai: 'mt_buoi', ten: master.taiLieu.ten, khoi: master.taiLieu.khoi, mon: master.taiLieu.mon, theme: master.taiLieu.theme,
      lop_id: opts.lopId, ngay: opts.ngay, nguon_id: masterId, created_by: user?.id ?? null,
      cau_hinh: master.taiLieu.cau_hinh ?? {},   // ⭐ copy cau_hinh (etFormByCau/lines/etColByGroup/etMaDe) sang bản buổi
    }).select().single()
    if (eNw) throw eNw
    docCon = nw as TaiLieu
  }
  const phanBacEp = master.taiLieu.cau_hinh?.phanBac ?? {} // ép tay (GV chọn ở MTEditor) — đè lên suy tự động
  let t = 0
  let soCauLoai = 0
  for (const p of customPhans) {
    const ep = phanBacEp[p.id]
    // Có ép tay → cả PHẦN theo 1 quyết định (đủ tư cách thì giữ NGUYÊN mọi câu, không thì loại HẾT).
    // Không ép → suy TỪNG CÂU theo bậc dạng của chính câu đó (mặc định).
    const caus = ep
      ? (thuTuCua(ep) <= lopThuTu ? p.caus : [])
      : p.caus.filter((c) => thuTuCua(bacMap[c.ma_cau] ?? 'C') <= lopThuTu)
    soCauLoai += p.caus.length - caus.length
    if (!caus.length) continue // toàn câu nâng cao lớp này không học được → bỏ hẳn phần
    const np = await addPhan({ tai_lieu_id: docCon.id, thu_tu: t++, loai_phan: 'custom', ref_ma: null, tieu_de: p.tieu_de, noi_dung: p.noi_dung, kieu: p.kieu })
    await setCauOfPhan(np.id, caus.map((c) => c.ma_cau))
  }

  // 3) HÌNH (mô hình) — bài phan='mt' của buổi Hình MẪU (master.cau_hinh.hinhBuoiId) → buổi Hình (lớp,ngày).
  // Re-gán sang NGÀY KHÁC: bản Hình đã copy ở ngày cũ hết hiệu lực → xoá riêng phan 'mt' ở đó (cùng nguyên tắc
  // "1 lớp chỉ 1 lượt gán / MT" của Đại). Master không có Hình → KHÔNG đụng buổi Hình của lớp (MTTab có đường
  // "+ Bài Hình" nhập tay). Không lọc nâng cao theo hệ cho Hình (bài Hình không có bac_toi_thieu như dạng).
  const hinhBuoiId = master.taiLieu.cau_hinh?.hinhBuoiId ?? null
  if (hinhBuoiId && ngayCu && ngayCu !== opts.ngay) await xoaPhanHinhTai(opts.lopId, ngayCu, 'mt')
  const soBaiHinh = hinhBuoiId ? (await copyPhanHinhSangBuoi(hinhBuoiId, 'mt', opts.lopId, opts.ngay)).soBai : 0

  return { buoiId: buoiId!, taiLieuId: docCon.id, buoiMoi, soCauLoai, soBaiHinh }
}

// Các lượt đã gán của 1 MT master (hiện trong editor: "Đã gán cho: 9A1 · 12/07…"). buoiId = buổi
// THƯỜNG (lớp,ngày) — MT không còn buổi riêng, tra theo loai='thuong'.
export type MTGanRow = { taiLieuId: string; lopId: string; lopTen: string; ngay: string; buoiId: string | null }
export async function listGanMT(masterId: string): Promise<MTGanRow[]> {
  const { data, error } = await supabase.from('tai_lieu').select('id, lop_id, ngay, lop:lop_id(ten_lop)')
    .eq('loai', 'mt_buoi').eq('nguon_id', masterId).order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as any[]
  if (!rows.length) return []
  const { data: buois } = await supabase.from('buoi_hoc').select('id, lop_id, ngay')
    .eq('loai', 'thuong').in('lop_id', rows.map((r) => r.lop_id)).limit(LIMIT)
  const buoiOf = (lopId: string, ngay: string) => (buois as any[] ?? []).find((b) => b.lop_id === lopId && b.ngay === ngay)?.id ?? null
  return rows.map((r) => ({ taiLieuId: r.id, lopId: r.lop_id, lopTen: r.lop?.ten_lop ?? '?', ngay: r.ngay, buoiId: buoiOf(r.lop_id, r.ngay) }))
}

// ── CHẤM MT: nạp câu từ doc mt_buoi khớp (lớp+ngày) — cùng mẫu getETByBuoi/getETCaus (tailieu.ts) ──
export async function getMTInstanceByBuoi(lopId: string, ngay: string): Promise<{ id: string } | null> {
  // order+limit1 (KHÔNG maybeSingle) — cùng lý do getETByBuoi/getBTVNByBuoi: nếu lỡ có 2 doc trùng thì lấy bản mới nhất.
  const { data, error } = await supabase.from('tai_lieu').select('id').eq('loai', 'mt_buoi').eq('lop_id', lopId).eq('ngay', ngay).order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  return ((data as { id: string }[])?.[0]) ?? null
}
// Câu MT của buổi — GIỮ NGUYÊN cấu trúc PHẦN (Thùy 07-08: "cấu trúc chấm MT phải giống file MT được
// gán" — trước đây flatMap phẳng mất ranh giới phần, khác hẳn cách soạn/xem trong MTEditor).
export type MTPhanCaus = { tieuDe: string; caus: CauHoi[] }
export async function getMTPhanCaus(taiLieuId: string): Promise<MTPhanCaus[]> {
  const full = await getTaiLieuFull(taiLieuId)
  return full.phans.filter((p) => p.loai_phan === 'custom').map((p) => ({ tieuDe: p.tieu_de ?? '(không tên)', caus: p.caus }))
}
// Câu MT của buổi = gộp mọi phần 'custom' theo thứ tự (dùng cho seed problem_no liên tục toàn bài).
export async function getMTCaus(taiLieuId: string): Promise<CauHoi[]> {
  return (await getMTPhanCaus(taiLieuId)).flatMap((p) => p.caus)
}
