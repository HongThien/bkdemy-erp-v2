// Data-layer "Ôn tập" trong BTVN (spaced repetition tầng LỚP) — seam mới, UI KHÔNG gọi supabase trực tiếp.
// Xem spec-btvn-ontap.md + PLAN.md. Tầng LỚP (không per-HS) — chống quên cho cả lớp, GV pick hệ gợi ý.
import { supabase } from './supabase'
import { listPhan, addPhan, usedCausOfBuoi, suggestCauForDang, khoCuaMon, nhanhKhoCuaDang, laMaDangBdm, NHANH_BDM, type CauHinh } from './tailieu'
import { dangInfoCuaMon } from './mastery'
import { type CauHoi } from './kho/api'

const LIMIT = 10000

// ── Tham số CHỐT (Thùy, hỏi qua AskUserQuestion — xem PLAN.md mục 2) ──
export const CAP_DANG = 2
export const CAP_CAU_MOI_DANG = 2
const CUA_SO_NE_CAU_LOP = 30 // ngày — rút ngắn từ đề xuất 60 của spec (Thùy chốt)
const nguongTin = (siSo: number) => Math.max(3, Math.ceil(siSo / 3))

function ngayCachNay(soNgay: number): string {
  // Giờ VN, KHÔNG toISOString() (CLAUDE.md §2 — cấm cho ngày local).
  const d = new Date()
  d.setDate(d.getDate() - soNgay)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}

// ── Bước 1: ứng viên dạng = đã xuất hiện (phan 'dang') ở buổi TRƯỚC buổi đang gán, LOẠI dạng của chính buổi đó ──
async function ungVienDangTruocBuoi(masterId: string, buoiId: string): Promise<string[]> {
  const phans = await listPhan(masterId)
  const curPos = phans.findIndex((p) => p.id === buoiId)
  if (curPos < 0) return []
  const currentMa = new Set<string>()
  for (let j = curPos + 1; j < phans.length && phans[j].loai_phan !== 'buoi'; j++) {
    if ((phans[j].loai_phan === 'dang' || phans[j].loai_phan === 'btvn') && phans[j].ref_ma) currentMa.add(phans[j].ref_ma as string)
  }
  const priorMa = new Set<string>()
  for (let j = 0; j < curPos; j++) if (phans[j].loai_phan === 'dang' && phans[j].ref_ma) priorMa.add(phans[j].ref_ma as string)
  return [...priorMa].filter((ma) => !currentMa.has(ma))
}

async function siSoLop(lopId: string): Promise<number> {
  const { count, error } = await supabase.from('hoc_sinh_lop').select('id', { count: 'exact', head: true }).eq('lop_id', lopId).eq('trang_thai', 'dang_hoc')
  if (error) throw error
  return count ?? 0
}

// "Lâu chưa gặp" (tie-break Bước 3.2) — ngày GẦN NHẤT lớp này có doc (giáo trình buổi/BTVN) chứa dạng đó.
// Không tìm thấy (lớp chưa từng gặp dạng qua doc nào) → null, coi như CŨ NHẤT (ưu tiên ôn trước).
async function lanCuoiGapTheoDang(lopId: string, maDangs: string[]): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>(maDangs.map((m) => [m, null]))
  if (!maDangs.length) return out
  const { data: docs, error: e1 } = await supabase.from('tai_lieu').select('id, ngay').eq('lop_id', lopId).limit(LIMIT)
  if (e1) throw e1
  const ngayById = new Map((docs ?? []).map((d: any) => [d.id, d.ngay as string | null]))
  const docIds = [...ngayById.keys()]
  if (!docIds.length) return out
  const { data: phans, error: e2 } = await supabase.from('tai_lieu_phan').select('tai_lieu_id, ref_ma').in('tai_lieu_id', docIds).in('ref_ma', maDangs).in('loai_phan', ['dang', 'btvn']).limit(LIMIT)
  if (e2) throw e2
  for (const p of (phans ?? []) as any[]) {
    const ngay = ngayById.get(p.tai_lieu_id)
    if (!ngay) continue
    const cur = out.get(p.ref_ma)
    if (!cur || ngay > cur) out.set(p.ref_ma, ngay)
  }
  return out
}

// Mềm 1 (Bước 4): câu đã xuất hiện trong BẤT KỲ doc nào của LỚP NÀY trong N ngày gần đây — né để chống
// học-thuộc-lời-giải. "Mềm" = best-effort, KHÔNG chặn cứng nếu pool hết (xem goiYOnTap fallback).
async function neCauLopGanDay(lopId: string, soNgay = CUA_SO_NE_CAU_LOP): Promise<Set<string>> {
  const since = ngayCachNay(soNgay)
  const { data: docs, error: e1 } = await supabase.from('tai_lieu').select('id').eq('lop_id', lopId).gte('ngay', since).limit(LIMIT)
  if (e1) throw e1
  const docIds = (docs ?? []).map((d: any) => d.id)
  if (!docIds.length) return new Set()
  const { data: phans, error: e2 } = await supabase.from('tai_lieu_phan').select('id').in('tai_lieu_id', docIds).limit(LIMIT)
  if (e2) throw e2
  const phanIds = (phans ?? []).map((p: any) => p.id)
  if (!phanIds.length) return new Set()
  const { data: caus, error: e3 } = await supabase.from('tai_lieu_cau').select('ma_cau').in('phan_id', phanIds).limit(LIMIT * 50)
  if (e3) throw e3
  return new Set((caus ?? []).map((c: any) => c.ma_cau as string))
}

export type GoiY = { ma_dang: string; ten_dang: string; score: number; ly_do: 'yeu_lop' | 'tien_quyet'; caus: CauHoi[] }

// Engine gợi ý — 4 bước (spec §4.1). Lớp chưa có data đo đủ tin → trả [] (UI hiện "chọn tay hoặc bỏ qua").
export async function goiYOnTap(nguonId: string, buoiId: string, lopId: string, mon: string): Promise<GoiY[]> {
  const candidates = await ungVienDangTruocBuoi(nguonId, buoiId)
  if (!candidates.length) return []

  // Bước 2: chấm điểm nhu cầu theo LỚP — ở DB (fn_ontap_diem_dang, §2.0; KHÔNG gộp BTVN, tránh vòng lặp phản hồi
  // ôn-tập-tự-đo-bằng-BTVN-rồi-lại-chọn-ôn-tập-theo-BTVN). Theo công tắc bản đồ: bật ⇒ dạng cũ của giáo trình chấm
  // theo các dạng bài mới mà câu của nó quy về; câu vẫn chọn theo mã dạng giáo trình (kho cũ).
  const [{ data: diem, error: eDiem }, siSo, info] = await Promise.all([
    supabase.rpc('fn_ontap_diem_dang', { p_lop: lopId, p_mon: mon, p_ma_dangs: candidates }),
    siSoLop(lopId), dangInfoCuaMon(mon, candidates),
  ])
  if (eDiem) throw eDiem
  const tin = nguongTin(siSo)
  const byMa = new Map(((diem ?? []) as any[]).map((r) => [r.ma_dang as string, r]))
  const scored: { ma_dang: string; ten_dang: string; nhanh: string | null; score: number }[] = []
  for (const ma of candidates) {
    const r = byMa.get(ma), d = info.get(ma)
    if (!r || !d || r.total < tin) continue // chưa đủ đã_đo → không gợi ý (GV vẫn pick tay được qua "+ Dạng")
    scored.push({ ma_dang: ma, ten_dang: d.ten_dang, nhanh: d.nhanh, score: Number(r.score) })
  }
  if (!scored.length) return []

  // Bước 3: xếp hạng — giảm dần score; tie-break "tiên quyết" chưa build ở repo v2 (TODO(tienquyet), bỏ qua
  // không chặn feature) → chỉ còn tie-break "lâu chưa gặp" (cũ/null hơn lên trước).
  const lanCuoi = await lanCuoiGapTheoDang(lopId, scored.map((s) => s.ma_dang))
  scored.sort((a, b) => b.score - a.score || (lanCuoi.get(a.ma_dang) ?? '').localeCompare(lanCuoi.get(b.ma_dang) ?? ''))
  const top = scored.slice(0, CAP_DANG)

  // Bước 4: chọn câu ≤2/dạng — cứng né usedCausOfBuoi(nguonId, buoiId) (quét MASTER, doc BTVN đích chưa tồn tại
  // lúc gợi ý); mềm né câu lớp đã làm trong 30 ngày, hết pool thì bỏ né-mềm chứ không chặn. Không ép loại câu
  // (Thùy chốt "tự do theo pool") — suggestCauForDang tự sort least-used.
  // Bảng câu theo NHÁNH của từng dạng (getMasteryByDang trả dạng MỌI nhánh từ 29/09 — Hình giải tích / Hình học
  // giờ có mastery nên tới được bước này; trước đó byMa không khớp mã nhánh khác và hàm return [] sớm).
  const [hardExclude, softExclude] = await Promise.all([usedCausOfBuoi(nguonId, buoiId), neCauLopGanDay(lopId)])
  const out: GoiY[] = []
  for (const t of top) {
    // Dạng bài NDB (giáo trình đổi mã đợt 2 / chọn theo bản đồ mới) ⇒ kho bdm_cau_hoi — nhánh của dangInfoCuaMon là nhánh BÁO CÁO
    // (null / hinh_gt), không phải nhánh kho: tra dai_cau_hoi theo mã NDB thì 0 câu.
    const cauTbl = khoCuaMon(mon, nhanhKhoCuaDang(t.ma_dang, t.nhanh)).cauTbl
    const localExclude = new Set(hardExclude)
    const picked: CauHoi[] = []
    for (let k = 0; k < CAP_CAU_MOI_DANG; k++) {
      let ma = await suggestCauForDang(t.ma_dang, new Set([...localExclude, ...softExclude]), cauTbl)
      if (!ma) ma = await suggestCauForDang(t.ma_dang, localExclude, cauTbl) // pool hết vì né-mềm → bỏ né-mềm, vẫn giữ né-cứng
      if (!ma) break
      localExclude.add(ma)
      const { data: c } = await supabase.from(cauTbl).select('*').eq('ma_cau', ma).single()
      if (c) picked.push(c as CauHoi)
    }
    if (picked.length) out.push({ ma_dang: t.ma_dang, ten_dang: t.ten_dang, score: t.score, ly_do: 'yeu_lop', caus: picked })
  }
  return out
}

// ── CRUD config (spec §4.2) — sống ở bảng riêng để SỐNG SÓT re-trích (trichXuatBuoi xoá-rồi-tạo doc BTVN) ──
// ⭐ 08-18 (Thùy: "phải là 1 phần setup đầy đủ như builder — 2 phần riêng"): `nguon` phân biệt 2 khối UI —
// 'de_xuat' = engine goiYOnTap sinh ra (vẫn cap CAP_DANG/CAP_CAU_MOI_DANG) · 'tu_chon' = GV tự thêm dạng +
// tự gõ số lượng theo loại câu (KHÔNG cap, y hệt DangCard của Bài luyện/BTVN). Thiếu `nguon` (config cũ
// trước bản này) → coi là 'de_xuat' (an toàn, không đổi hành vi cũ). `colByCau` mới — trước chỉ có
// `linesByCau` (chỉnh dòng), giờ thêm chỉnh cột giống builder — merge vào cau_hinh.colByCau lúc append.
export type OnTapDangConfig = { ma_dang: string; ma_caus: string[]; linesByCau?: Record<string, number>; colByCau?: Record<string, number>; nguon?: 'de_xuat' | 'tu_chon' }
export type OnTapConfig = { dangs: OnTapDangConfig[]; skipped: boolean }

export async function getOnTapConfig(nguonId: string, nguonBuoi: string, lopId: string): Promise<OnTapConfig | null> {
  const { data, error } = await supabase.from('btvn_ontap_config').select('config').eq('nguon_id', nguonId).eq('nguon_buoi', nguonBuoi).eq('lop_id', lopId).maybeSingle()
  if (error) throw error
  return (data?.config as OnTapConfig | undefined) ?? null
}
export async function saveOnTapConfig(nguonId: string, nguonBuoi: string, lopId: string, config: OnTapConfig): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('btvn_ontap_config')
    .upsert({ nguon_id: nguonId, nguon_buoi: nguonBuoi, lop_id: lopId, config, updated_by: user?.id ?? null, updated_at: new Date().toISOString() }, { onConflict: 'nguon_id,nguon_buoi,lop_id' })
  if (error) throw error
}

// Nội dung câu theo ma_cau (cho UI preview trong OnTapEditor — config chỉ lưu ma_cau, không snapshot nội dung).
export async function fetchCausByMa(maCaus: string[], cauTbl: string): Promise<CauHoi[]> {
  if (!maCaus.length) return []
  const { data, error } = await supabase.from(cauTbl).select('*').in('ma_cau', maCaus).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
// Tên dạng theo ma_dang (cho UI — config/DangPickerOne chỉ có ma_dang, không kèm tên).
export async function fetchTenDangByMa(maDangs: string[], mon: string, nhanh?: string | null): Promise<Map<string, string>> {
  if (!maDangs.length) return new Map()
  // Theo kho của TỪNG mã (NDB ⇒ bdm_ban_do) — ôn tập giáo trình cũ có thể trộn dạng cũ + dạng bài mới.
  const out = new Map<string, string>()
  for (const nh of [...new Set(maDangs.map((m) => nhanhKhoCuaDang(m, nhanh)))]) {
    const mas = maDangs.filter((m) => nhanhKhoCuaDang(m, nhanh) === nh)
    const { data, error } = await supabase.from(khoCuaMon(mon, nh).banDoTbl).select('ma_dang, ten_dang').in('ma_dang', mas).limit(LIMIT)
    if (error) throw error
    for (const d of (data ?? []) as { ma_dang: string; ten_dang: string }[]) out.set(d.ma_dang, d.ten_dang)
  }
  return out
}
// Bảng câu của 1 dạng ôn tập (NDB ⇒ kho bản đồ mới, còn lại theo nhánh tài liệu) — OnTapEditor + append dùng chung.
export const cauTblOnTap = (mon: string, nhanh: string | null | undefined, maDang: string): string => khoCuaMon(mon, nhanhKhoCuaDang(maDang, nhanh)).cauTbl

// ── Append vào doc BTVN đã trích (spec §6) — gọi SAU trichXuatBuoi (không sửa hàm đó, tránh vòng import
// ngược tailieu.ts↔ontap.ts — compose ở CALL SITE, xem TrichPanel.gan trong TaiLieuBuilder.tsx). Không có
// config / skipped / rỗng → không làm gì, doc y hệt hiện tại (đúng acceptance "không cấu hình → không regress").
export async function appendOnTapToBtvnDoc(btvnDocId: string, nguonId: string, nguonBuoi: string, lopId: string, mon: string, nhanh?: string | null): Promise<{ added: number; matChet: string[] }> {
  const config = await getOnTapConfig(nguonId, nguonBuoi, lopId)
  if (!config || config.skipped || !config.dangs.length) return { added: 0, matChet: [] }
  const phans = await listPhan(btvnDocId)
  let t = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  const { data: doc } = await supabase.from('tai_lieu').select('cau_hinh, nhanh').eq('id', btvnDocId).single()
  const chHienCo = ((doc as any)?.cau_hinh ?? {}) as CauHinh
  const nhanhDoc = ((doc as any)?.nhanh ?? nhanh ?? null) as string | null
  const linesMerge: Record<string, number> = { ...(chHienCo.btvnLinesByCau ?? {}) }
  const colMerge: Record<string, number> = { ...(chHienCo.colByCau ?? {}) }
  // Câu chọn theo DẠNG BÀI NDB nằm ở kho bản đồ mới (gộp Đại + HGT) ⇒ ghi nhánh theo câu (cau_hinh.nhanhByCau, khuôn MT) để
  // getTaiLieuFull / in / phát hành online nạp đúng kho — phiếu BTVN của giáo trình cũ vẫn là nhánh Đại.
  const nhanhMerge: Record<string, string> = { ...(chHienCo.nhanhByCau ?? {}) }
  const matChet: string[] = []
  let added = 0
  for (const d of config.dangs) {
    if (!d.ma_caus.length) continue
    // Revalidate: câu bị xoá/sửa mã ở kho sau khi GV chọn → bỏ khỏi phan, báo lại cho UI toast (không chặn).
    // (nhánh của DOC — rebuildOnTapInDoc không truyền nhanh; trước đây doc nhánh HGT bị tra nhầm kho Đại)
    const { data: caus } = await supabase.from(cauTblOnTap(mon, nhanhDoc, d.ma_dang)).select('ma_cau').in('ma_cau', d.ma_caus).limit(LIMIT)
    const conSong = new Set(((caus ?? []) as { ma_cau: string }[]).map((c) => c.ma_cau))
    const maCauSong = d.ma_caus.filter((m) => conSong.has(m))
    for (const m of d.ma_caus) if (!conSong.has(m)) matChet.push(m)
    if (!maCauSong.length) continue
    const phan = await addPhan({ tai_lieu_id: btvnDocId, thu_tu: t++, loai_phan: 'ontap', ref_ma: d.ma_dang, tieu_de: null, noi_dung: null })
    await supabase.from('tai_lieu_cau').insert(maCauSong.map((ma_cau, i) => ({ phan_id: phan.id, ma_cau, thu_tu: i })))
    added++
    if (d.linesByCau) for (const [ma, n] of Object.entries(d.linesByCau)) if (conSong.has(ma)) linesMerge[ma] = n
    if (d.colByCau) for (const [ma, n] of Object.entries(d.colByCau)) if (conSong.has(ma)) colMerge[ma] = n
    if (laMaDangBdm(d.ma_dang) && nhanhDoc !== NHANH_BDM.ma) for (const ma of maCauSong) nhanhMerge[ma] = NHANH_BDM.ma
  }
  if (added) {
    const chMoi: CauHinh = { ...chHienCo, btvnLinesByCau: linesMerge, colByCau: colMerge }
    if (Object.keys(nhanhMerge).length) chMoi.nhanhByCau = nhanhMerge
    await supabase.from('tai_lieu').update({ cau_hinh: chMoi }).eq('id', btvnDocId)
  }
  return { added, matChet }
}

// Rebuild-tại-chỗ (modal "✎ Ôn tập" ở KhoTaiLieuScreen, spec §8): xoá phan 'ontap' CŨ của doc rồi dựng lại từ
// config MỚI — KHÔNG re-trích cả doc (không đụng khối BTVN gốc, không reset thứ khác). Lưu config trước
// (saveOnTapConfig), rồi gọi hàm này bằng chính (nguonId, nguonBuoi, lopId) của doc đó.
export async function rebuildOnTapInDoc(btvnDocId: string, nguonId: string, nguonBuoi: string, lopId: string, mon: string): Promise<{ added: number; matChet: string[] }> {
  const phans = await listPhan(btvnDocId)
  for (const p of phans) if (p.loai_phan === 'ontap') await supabase.from('tai_lieu_phan').delete().eq('id', p.id)
  return appendOnTapToBtvnDoc(btvnDocId, nguonId, nguonBuoi, lopId, mon)
}

// Doc đã có phép đo chưa (spec §8, câu hỏi mở #4 — Thùy chốt: CHỈ CẢNH BÁO, không chặn cứng như xoaHSKhoiBuoi).
// Proxy đơn giản: buổi_hoc (lop_id+ngay của doc) đã đóng BTVN (btvn_dong_at) → coi như đã chấm.
export async function btvnDaDong(lopId: string, ngay: string): Promise<boolean> {
  const { data, error } = await supabase.from('buoi_hoc').select('btvn_dong_at').eq('lop_id', lopId).eq('ngay', ngay).limit(1).maybeSingle()
  if (error) throw error
  return !!(data as { btvn_dong_at: string | null } | null)?.btvn_dong_at
}
