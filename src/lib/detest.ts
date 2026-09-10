// Data-layer "Test đầu vào — Chấm + Trả bài (gồm nhận xét)" (BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md).
// ca_test (tuyensinh.ts) = "buổi test". File này nối tiếp: gán đề (snapshot từ Kho MT) → chấm Đ/C/S
// per câu ∥ scan bài đã chấm (2 nguồn ĐỘC LẬP) → Trả bài (gộp nhận xét + biểu đồ + lớp đề xuất + phiếu,
// Thùy chốt 07-19: "ở trong task trả bài đó" — KHÔNG còn là bước riêng gate giữa Chấm và Trả bài).
// ⭐ Đề = CHỌN THẲNG 1 tài liệu trong Kho (mig 0105, bỏ hẳn de_test — Thùy 07-19). ca_test.tai_lieu_id
// trỏ THẲNG tai_lieu (không qua lớp trung gian). KHÔNG feed mastery (§A cố ý).
// ⭐ 07-27 (Thùy): thêm "Quản lý đề test đầu vào" = SINH tài liệu mới (copy nội dung) từ nguồn MT/Đề thi
// (KHÔNG dựng lại de_test CRUD, cũng KHÔNG "ghim/trỏ"). Nguồn = MT + Đề thi (mọi master TRỪ ET/GT/BTVN).
// Mỗi khối×môn 1 đề đang dùng (bản sinh mới nhất), đề cũ giữ làm lịch sử. Xem section ĐỀ TEST ĐẦU VÀO.
import { supabase } from './supabase'
import { khoCuaMon, nhanhCuaMon, nhanhCuaCau, laMaHinh, getTaiLieuFull, listPhan, copyPhanInto, type TaiLieu } from './tailieu'
import { pickCuaHinhRow } from './mt'
import { loadLuoi } from './kho/hinh'
import { updateUngVien, toggleViec } from './tuyensinh'
import type { MenhDe } from './kho/api'

const LIMIT = 10000

// ============================================================================
// ĐỀ TEST ĐẦU VÀO (sinh từ nguồn) — Thùy chốt 07-27. "Đề test đầu vào" là 1 TÀI LIỆU MỚI được SINH ra
// (copy nội dung) từ 1 nguồn MT/Đề thi: học thuật chọn khối×môn + chọn nguồn → hệ tạo tai_lieu
// loai='de_test_dau_vao' (ten "Đề test đầu vào · Khối 8 · <tên nguồn>"), copy các phần 'custom' + câu.
// nguon_id trỏ nguồn gốc (lưu vết). Mỗi khối×môn có 1 đề ĐANG DÙNG = bản sinh MỚI NHẤT; sinh đề mới →
// thành đề hiện tại, đề cũ GIỮ làm lịch sử (không xoá). Điểm danh test gán đề = snapshot câu từ chính
// tài liệu de_test_dau_vao này vào ca_test_cau (mirror MT/Đề thi — layCauTheoThuTu đã generic).
// ============================================================================
export const LOAI_DE_TEST = ['mt', 'de_thi'] as const // các loại nguồn dùng được để sinh đề test đầu vào
export const TEN_LOAI_DE: Record<string, string> = { mt: 'MT', de_thi: 'Đề thi' }

// NGUỒN dùng được để sinh đề (MT + Đề thi master, lop_id null). Lọc mon/khoi nếu truyền.
export async function listNguonDe(mon?: string, khoi?: string): Promise<TaiLieu[]> {
  let q = supabase.from('tai_lieu').select('*').in('loai', LOAI_DE_TEST as unknown as string[])
    .is('lop_id', null).order('created_at', { ascending: false }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  if (khoi) q = q.eq('khoi', khoi)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}

// 1 đề test đầu vào đã sinh (kèm nguồn gốc + cờ đang-dùng).
export type DeTestRow = {
  id: string; ten: string; khoi: string; mon: string
  nguonId: string | null; nguonTen: string | null; nguonLoai: string | null
  createdAt: string; laHienTai: boolean
}
// Danh sách đề test đầu vào ĐÃ SINH (desc thời gian). laHienTai = bản mới nhất của mỗi (khoi,mon) = đang
// dùng; các bản còn lại = lịch sử. Lọc mon nếu truyền.
export async function listDeTestDauVao(mon?: string): Promise<DeTestRow[]> {
  let q = supabase.from('tai_lieu').select('id, ten, khoi, mon, nguon_id, created_at')
    .eq('loai', 'de_test_dau_vao').order('created_at', { ascending: false }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as { id: string; ten: string; khoi: string; mon: string; nguon_id: string | null; created_at: string }[]
  const nguonIds = [...new Set(rows.map((r) => r.nguon_id).filter(Boolean) as string[])]
  const nguonMap = new Map<string, { ten: string; loai: string }>()
  if (nguonIds.length) {
    const { data: ns } = await supabase.from('tai_lieu').select('id, ten, loai').in('id', nguonIds).limit(LIMIT)
    for (const n of (ns ?? []) as { id: string; ten: string; loai: string }[]) nguonMap.set(n.id, { ten: n.ten, loai: n.loai })
  }
  const seen = new Set<string>() // (khoi|mon) đầu tiên gặp (mới nhất) = đang dùng
  return rows.map((r) => {
    const key = `${r.khoi}|${r.mon}`
    const laHienTai = !seen.has(key); if (laHienTai) seen.add(key)
    const n = r.nguon_id ? nguonMap.get(r.nguon_id) : null
    return { id: r.id, ten: r.ten, khoi: r.khoi, mon: r.mon, nguonId: r.nguon_id, nguonTen: n?.ten ?? null, nguonLoai: n?.loai ?? null, createdAt: r.created_at, laHienTai }
  })
}

// SINH 1 đề test đầu vào cho khối×môn từ nguồn (MT/Đề thi): tạo tai_lieu loai='de_test_dau_vao' + copy
// các phần 'custom' (nội dung câu) từ nguồn. Bản mới nhất tự thành "đang dùng"; KHÔNG đụng bản cũ (lịch sử).
export async function sinhDeTestDauVao(nguonId: string, khoi: string, mon: string): Promise<TaiLieu> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: src, error: eS } = await supabase.from('tai_lieu').select('ten, theme, cau_hinh').eq('id', nguonId).single()
  if (eS) throw eS
  const s = src as { ten: string; theme: string | null; cau_hinh: unknown }
  const { data: nw, error } = await supabase.from('tai_lieu').insert({
    loai: 'de_test_dau_vao', ten: `Đề test đầu vào · Khối ${khoi} · ${s.ten}`,
    khoi, mon, theme: s.theme ?? 'bkdemy', cau_hinh: s.cau_hinh ?? {}, nguon_id: nguonId, created_by: user?.id ?? null,
  }).select().single()
  if (error) throw error
  const doc = nw as TaiLieu
  const phans = (await listPhan(nguonId)).filter((p) => p.loai_phan === 'custom')
  let t = 0
  for (const p of phans) await copyPhanInto(doc.id, p, t++)
  return doc
}

// ============================================================================
// GÁN ĐỀ vào ca_test — SNAPSHOT câu THẬT từ tài liệu MT (anti-live-ref: đổi/sửa MT sau KHÔNG hỏng bài
// đã chấm). Đổi đề (Ops đổi tại phòng, HS kêu khó) = XOÁ SẠCH câu cũ rồi snapshot lại câu mới — Thùy
// chốt 07-19: "xoá câu đề cũ trước khi snapshot đề mới" (tránh chồng câu cũ+mới nếu đổi đề 2 lần).
// ============================================================================
// ⭐ 09/09 (CEO chốt ⑦ "pick từ bản đồ nào ra thì tính từ đấy"): snapshot thêm `nhanh` ('dai'|'hinh') ·
// `muc_do` · `ten_chuyen_de` của dạng neo — phiếu (fn_test_dau_vao_phieu) chỉ gom trên ca_test_cau, KHÔNG
// join lại kho (đề/dạng sửa sau không lệch phiếu cũ; không nhân đôi registry môn→bảng trong SQL).
// NHÁNH cho phiếu: môn không chia nhánh (KHTN…) → null (không áp dụng). Toán: nhánh mặc định = Đại; mọi
// nhánh khác (hinh_gt) + hàng HÌNH mô hình (`HINH:<uuid>`, không ở kho câu) = Hình.
const NHANH_PHIEU: Record<string, 'dai' | 'hinh'> = { hinh_gt: 'hinh' }
function nhanhPhieu(mon: string | null | undefined, nhanh: string | null): 'dai' | 'hinh' | null {
  if (!nhanhCuaMon(mon).length) return null
  return nhanh ? (NHANH_PHIEU[nhanh] ?? 'hinh') : 'dai'
}
type CaTestCauInsert = {
  ca_test_id: string; thu_tu: number; ma_cau: string; loai_cau: string | null; noi_dung: string | null
  lua_chon: unknown; menh_de: unknown; dap_an: string | null; loi_giai: string | null
  anh_de: string | null; anh_dap_an: string | null; ma_dang: string | null; diem_toi_da: number
  nhanh: 'dai' | 'hinh' | null; muc_do: number | null; ten_chuyen_de: string | null
}
// Hàng HÌNH (mô hình) → nội dung đề chữ để người chấm đối chiếu. Trước 09/09 `layCauTheoThuTu` BỎ RƠI
// im lặng các hàng này (MT K7 có 3, K8 có 2) — giờ snapshot 1 dòng/bài, chấm HOLISTIC 1 mức Đ/C/S.
// Dựng đề qua đúng đường in MT (banInTheoMoHinh) — import động để lib không kéo cả màn soạn Hình vào bundle.
async function noiDungHinhRows(tl: TaiLieu, mas: string[]): Promise<Record<string, { noiDung: string; anhDe: string | null; loiGiai: string | null }>> {
  const out: Record<string, { noiDung: string; anhDe: string | null; loiGiai: string | null }> = {}
  const hinhByMa = tl.cau_hinh?.hinhByMa ?? {}
  const can = mas.filter((ma) => !!hinhByMa[ma])
  if (!can.length) return out
  const { banInTheoMoHinh } = await import('../screens/kho/hinh/SoanTaiLieu')
  const L = await loadLuoi(tl.khoi)
  for (const ma of can) {
    const h = hinhByMa[ma]
    const ban = await banInTheoMoHinh(tl.ten, 'mt', [pickCuaHinhRow(ma, h)], L, { [ma]: h.cheDo ?? 'hien' }, { [ma]: h.soDong ?? 0 })
    const de = ban.mucs.find((m) => m.kieu === 'de')
    if (!de || de.kieu !== 'de') continue
    const ys = de.ys.map((y) => `${y.nhan}) ${y.noiDung}`)
    out[ma] = {
      noiDung: [de.deBai, ...ys].filter(Boolean).join('\n'),
      anhDe: de.anhDe ?? null,
      loiGiai: de.ys.map((y) => (y.loiGiai ? `${y.nhan}) ${y.loiGiai}` : '')).filter(Boolean).join('\n') || null,
    }
  }
  return out
}
export async function ganDeCaTest(caTestId: string, taiLieuId: string): Promise<void> {
  const full = await getTaiLieuFull(taiLieuId)
  const tl = full.taiLieu
  const custom = full.phans.filter((p) => p.loai_phan === 'custom')
  const phans = custom.length ? custom : full.phans.filter((p) => p.loai_phan === 'dang' || p.loai_phan === 'btvn' || p.loai_phan === 'ontap')
  // 1) Duyệt câu THEO THỨ TỰ trong đề (maCaus, không phải caus — caus đã rụng hàng Hình), gom dạng theo bảng bản đồ.
  const dangTheoBang = new Map<string, Set<string>>()
  const hinhMas: string[] = []
  const thieu: string[] = []
  type Buoc = { ma: string; kind: 'cau' | 'hinh'; c?: (typeof full.phans)[number]['caus'][number]; nhanh: 'dai' | 'hinh' | null; banDoTbl?: string }
  const buocs: Buoc[] = []
  for (const p of phans) {
    for (const ma of p.maCaus) {
      if (laMaHinh(ma)) { hinhMas.push(ma); buocs.push({ ma, kind: 'hinh', nhanh: nhanhCuaMon(tl.mon).length ? 'hinh' : null }); continue }
      const c = p.caus.find((x) => x.ma_cau === ma)
      if (!c) { thieu.push(ma); continue }
      const nh = nhanhCuaCau(tl, ma)
      const K = khoCuaMon(tl.mon, nh)
      const s = dangTheoBang.get(K.banDoTbl) ?? new Set<string>()
      if (c.dang_chinh) s.add(c.dang_chinh)
      dangTheoBang.set(K.banDoTbl, s)
      buocs.push({ ma, kind: 'cau', c, nhanh: nhanhPhieu(tl.mon, nh), banDoTbl: K.banDoTbl })
    }
  }
  if (!buocs.length) throw new Error('Tài liệu chưa có câu nào.')
  // Câu có trong đề mà KHÔNG resolve được ở kho (đã xoá/đổi mã) → KHÔNG âm thầm bỏ (§1.5, bài học HANDOFF):
  // chặn gán, nêu mã để học thuật sửa đề — chấm thiếu câu là ghi sai phiếu.
  if (thieu.length) throw new Error(`Đề có ${thieu.length} câu không còn trong kho (${thieu.slice(0, 5).join(', ')}${thieu.length > 5 ? '…' : ''}). Học thuật sửa đề trước khi gán.`)
  // 2) muc_do + ten_chuyen_de của dạng neo — 1 query/bảng bản đồ.
  const dangInfo = new Map<string, { muc_do: number | null; ten_chuyen_de: string | null }>()
  for (const [tbl, mas] of dangTheoBang) {
    if (!mas.size) continue
    const { data, error } = await supabase.from(tbl).select('ma_dang, muc_do, ten_chuyen_de').in('ma_dang', [...mas]).limit(LIMIT)
    if (error) throw error
    for (const d of (data ?? []) as { ma_dang: string; muc_do: number | null; ten_chuyen_de: string | null }[]) dangInfo.set(`${tbl}|${d.ma_dang}`, { muc_do: d.muc_do, ten_chuyen_de: d.ten_chuyen_de })
  }
  // 3) Nội dung hàng Hình (nếu có) — lỗi dựng đề Hình thì vẫn gán được, dòng đó chỉ thiếu chữ đề.
  let hinhNd: Awaited<ReturnType<typeof noiDungHinhRows>> = {}
  if (hinhMas.length) { try { hinhNd = await noiDungHinhRows(tl, hinhMas) } catch { hinhNd = {} } }
  const rows: CaTestCauInsert[] = buocs.map((b, i) => {
    if (b.kind === 'hinh') {
      const nd = hinhNd[b.ma]
      return {
        ca_test_id: caTestId, thu_tu: i + 1, ma_cau: b.ma, loai_cau: 'tu_luan', noi_dung: nd?.noiDung ?? 'Bài hình (mô hình) — xem đề in',
        lua_chon: null, menh_de: null, dap_an: null, loi_giai: nd?.loiGiai ?? null, anh_de: nd?.anhDe ?? null, anh_dap_an: null,
        ma_dang: null, diem_toi_da: 1, nhanh: b.nhanh, muc_do: null, ten_chuyen_de: 'Hình học',
      }
    }
    const c = b.c!
    const info = c.dang_chinh ? dangInfo.get(`${b.banDoTbl}|${c.dang_chinh}`) : undefined
    // Đúng/Sai (menh_de) snapshot NGUYÊN 1 câu (4 mệnh đề) — chấm HOLISTIC 1 mức Đ/C/S cho cả câu.
    return {
      ca_test_id: caTestId, thu_tu: i + 1, ma_cau: c.ma_cau, loai_cau: c.loai_cau, noi_dung: c.noi_dung,
      lua_chon: c.lua_chon, menh_de: c.menh_de, dap_an: c.dap_an, loi_giai: c.loi_giai,
      anh_de: c.anh_de, anh_dap_an: c.anh_dap_an, ma_dang: c.dang_chinh, diem_toi_da: 1,
      nhanh: b.nhanh, muc_do: info?.muc_do ?? null, ten_chuyen_de: info?.ten_chuyen_de ?? null,
    }
  })
  // 4) Ghi: xoá kết quả + câu của đề CŨ (FK con trước) rồi snapshot đề mới — HS lỡ được chấm 1 phần trước khi
  // đổi đề thì kết quả đó không còn ý nghĩa (câu đã đổi hẳn sang đề khác).
  const { data: cauCu } = await supabase.from('ca_test_cau').select('id').eq('ca_test_id', caTestId).limit(LIMIT)
  const idCu = ((cauCu ?? []) as any[]).map((c) => c.id)
  if (idCu.length) {
    await supabase.from('ca_test_cau_kq').delete().in('ca_test_cau_id', idCu)
    await supabase.from('ca_test_cau').delete().in('id', idCu)
  }
  const { error: e1 } = await supabase.from('ca_test').update({ tai_lieu_id: taiLieuId }).eq('id', caTestId)
  if (e1) throw e1
  const { error: e2 } = await supabase.from('ca_test_cau').insert(rows)
  if (e2) throw e2
}
// ⭐ CEO ① 09/09: gán đề = MẶC ĐỊNH đề ĐANG DÙNG của (khối × môn) — Ops không phải chọn/bấm; chỉ đổi khi cần.
// Trả về đề đã gán, hoặc null nếu (khối × môn) chưa có đề nào (học thuật phải sinh ở tab "Đề test").
export async function ganDeDangDung(caTestId: string, khoi: string | null, mon: string): Promise<DeTestRow | null> {
  const de = (await listDeTestDauVao(mon)).find((d) => d.laHienTai && (!khoi || d.khoi === khoi))
  if (!de) return null
  await ganDeCaTest(caTestId, de.id)
  return de
}

// ============================================================================
// CHẤM TEST (Story 2) — pool team học thuật, ai mở thì làm. Bảng nhập liệu Đ/C/S THUẦN (Thùy 07-19:
// "bỏ cột scan" — người chấm chấm từ giấy NGOÀI hệ thống, không cần xem lại scan trên màn).
// ============================================================================
export type CaTestCau = {
  id: string; thuTu: number; maCau: string | null; loaiCau: string | null; noiDung: string | null
  luaChon: string[] | null; menhDe: MenhDe[] | null; dapAn: string | null; loiGiai: string | null
  anhDe: string | null; anhDapAn: string | null; diemToiDa: number; maDang: string | null
  nhanh: 'dai' | 'hinh' | null; mucDo: number | null; tenChuyenDe: string | null // snapshot lúc gán đề (09/09)
  ketQua: 'correct' | 'partial' | 'wrong' | null; diem: number | null
}
export type CaTestChoCham = {
  id: string; ungVienId: string; mon: string; ngay: string; baiUrl: string | null; taiLieuId: string | null
  hoTenHs: string; khoi: string | null; nguoiChamTen?: string | null
  nguoiChamId: string | null; nguoiTraBaiId: string | null
  diemNhap: number | null // CEO ④ 09/09: điểm NHẬP TAY, độc lập Đ/C/S (ca_test.diem_nhap)
  thieuDe: boolean        // ca đã hoàn thành mà chưa có đề → hiện trong hàng đợi kèm nút "Gán đề đang dùng", KHÔNG lọc mất
}
// Hàng đợi CHUNG (team học thuật) — đã điểm danh xong + chưa chấm xong. ⭐ 09/09: KHÔNG còn lọc
// `tai_lieu_id not null` — 5 ca thiếu đề từng biến mất im lặng khỏi mọi màn (HANDOFF bài học 09/09).
// `nguoi_cham` = người được gán (CEO ② 09/09: vào "Việc của tôi"); pool chung vẫn mở cho người khác.
const CHO_CHAM_SELECT = 'id, ung_vien_id, mon, ngay, bai_url, tai_lieu_id, cham_xong_at, trang_thai, diem_nhap, nguoi_cham_id, nguoi_tra_bai_id, ung_vien:ung_vien_id(ho_ten_hs, khoi, lop_du_kien_id), nguoi_cham:nguoi_cham_id(ho_ten)'
function mapChoCham(r: any): CaTestChoCham {
  return {
    id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, taiLieuId: r.tai_lieu_id,
    hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null, nguoiChamTen: r.nguoi_cham?.ho_ten ?? null,
    nguoiChamId: r.nguoi_cham_id ?? null, nguoiTraBaiId: r.nguoi_tra_bai_id ?? null,
    diemNhap: r.diem_nhap == null ? null : Number(r.diem_nhap), thieuDe: !r.tai_lieu_id,
  }
}
export async function listCanCham(): Promise<CaTestChoCham[]> {
  const { data, error } = await supabase.from('ca_test')
    .select(CHO_CHAM_SELECT)
    .eq('trang_thai', 'hoan_thanh').is('cham_xong_at', null)
    .order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapChoCham)
}
// "Việc của tôi" (CEO ②⑤ 09/09): ca TÔI được gán chấm / trả bài, còn treo. Lọc ở query theo nhan_su.id.
export async function listCanChamCuaToi(nhanSuId: string): Promise<CaTestChoCham[]> {
  const { data, error } = await supabase.from('ca_test').select(CHO_CHAM_SELECT)
    .eq('trang_thai', 'hoan_thanh').is('cham_xong_at', null).eq('nguoi_cham_id', nhanSuId)
    .order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapChoCham)
}
export async function listCanTraBaiCuaToi(nhanSuId: string): Promise<CaTestChoCham[]> {
  const { data, error } = await supabase.from('ca_test').select(CHO_CHAM_SELECT)
    .eq('trang_thai', 'hoan_thanh').is('tra_bai_xong_at', null).eq('nguoi_tra_bai_id', nhanSuId)
    .order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapChoCham)
}
export async function listDaCham(ngay?: string): Promise<CaTestChoCham[]> {
  let q = supabase.from('ca_test').select(CHO_CHAM_SELECT).not('cham_xong_at', 'is', null)
  if (ngay) q = q.eq('ngay', ngay)
  const { data, error } = await q.order('cham_xong_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapChoCham)
}
export async function getCaTestCauKq(caTestId: string): Promise<CaTestCau[]> {
  const { data: cau, error } = await supabase.from('ca_test_cau').select('*').eq('ca_test_id', caTestId).order('thu_tu').limit(LIMIT)
  if (error) throw error
  const ids = (cau ?? []).map((c: any) => c.id)
  const { data: kq } = ids.length ? await supabase.from('ca_test_cau_kq').select('*').in('ca_test_cau_id', ids).limit(LIMIT) : { data: [] as any[] }
  const kqMap = new Map(((kq ?? []) as any[]).map((k) => [k.ca_test_cau_id, k]))
  return (cau ?? []).map((c: any) => {
    const k = kqMap.get(c.id)
    return {
      id: c.id, thuTu: c.thu_tu, maCau: c.ma_cau, loaiCau: c.loai_cau, noiDung: c.noi_dung,
      luaChon: c.lua_chon, menhDe: c.menh_de, dapAn: c.dap_an, loiGiai: c.loi_giai,
      anhDe: c.anh_de, anhDapAn: c.anh_dap_an, diemToiDa: Number(c.diem_toi_da), maDang: c.ma_dang,
      nhanh: c.nhanh ?? null, mucDo: c.muc_do ?? null, tenChuyenDe: c.ten_chuyen_de ?? null,
      ketQua: k?.ket_qua ?? null, diem: k ? Number(k.diem) : null,
    }
  })
}
// Click lại mức đang chọn = bỏ chấm (cùng UX ET đã có — HANDOFF ②).
// §2.0 (30/08): diem do TRIGGER tg_ca_test_kq_diem tính (diem_toi_da × hệ số kết quả) —
// client chỉ ghi ket_qua thô và trả về diem DB đã tính để màn hình hiển thị đúng số thật.
export async function chamCauTest(caTestCauId: string, ketQua: 'correct' | 'partial' | 'wrong' | null): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (ketQua === null) { const { error } = await supabase.from('ca_test_cau_kq').delete().eq('ca_test_cau_id', caTestCauId); if (error) throw error; return null }
  const { data, error } = await supabase.from('ca_test_cau_kq')
    .upsert({ ca_test_cau_id: caTestCauId, ket_qua: ketQua, cham_boi: user?.id ?? null }, { onConflict: 'ca_test_cau_id' })
    .select('diem').single()
  if (error) throw error
  return data?.diem == null ? null : Number(data.diem)
}
// (§2.0) `tongDiem` cộng ở JS đã BỎ 09/09 — tổng/% lấy từ `getPhieuKetQua` (fn_test_dau_vao_phieu).
// Điểm NHẬP TAY (CEO ④ 09/09) — độc lập Đ/C/S; null = bỏ điểm đã nhập.
export async function setDiemNhap(caTestId: string, diem: number | null): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ diem_nhap: diem }).eq('id', caTestId)
  if (error) throw error
}
// Đóng chấm — mọi câu phải có kq + đã nhập điểm (done-when). Auto tick 'cham_bai' ở ung_vien_viec (derive=true, xem tuyensinh.ts) — giữ nguyên hành vi cũ.
export async function dongChamTest(caTestId: string, ungVienId: string): Promise<void> {
  const p = await getPhieuKetQua(caTestId)
  if (p.tong.soCau === 0) throw new Error('Ca chưa có đề/câu.')
  if (p.tong.daCham < p.tong.soCau) throw new Error(`Còn ${p.tong.soCau - p.tong.daCham} câu chưa chấm.`)
  if (p.diemNhap == null) throw new Error('Chưa nhập điểm.')
  const { error } = await supabase.from('ca_test').update({ cham_xong_at: new Date().toISOString() }).eq('id', caTestId).is('cham_xong_at', null)
  if (error) throw error
  await toggleViec(ungVienId, 'cham_bai', true).catch(() => {})
}
export async function moLaiChamTest(caTestId: string): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ cham_xong_at: null }).eq('id', caTestId)
  if (error) throw error
}

// ============================================================================
// SCAN BÀI ĐÃ CHẤM (task Ops MỚI, addendum §1 Task 3) — ĐỘC LẬP với Chấm, không ép thứ tự. Người chấm
// khoanh Đ/C/S trên giấy xong → đưa Ops → Ops scan → upload (KHÁC bai_url = bài CHƯA chấm ở Điểm danh).
// ============================================================================
export type CaTestChoScanDaCham = CaTestChoCham
export async function listCanScanDaCham(): Promise<CaTestChoScanDaCham[]> {
  const { data, error } = await supabase.from('ca_test')
    .select(CHO_CHAM_SELECT)
    .eq('trang_thai', 'hoan_thanh').is('bai_da_cham_url', null).order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapChoCham)
}
export async function listDaScanDaCham(ngay?: string): Promise<CaTestChoScanDaCham[]> {
  let q = supabase.from('ca_test').select(CHO_CHAM_SELECT).not('bai_da_cham_url', 'is', null)
  if (ngay) q = q.eq('ngay', ngay)
  const { data, error } = await q.order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapChoCham)
}
export async function dongScanDaCham(caTestId: string, url: string): Promise<void> {
  if (!url) throw new Error('Cần ảnh/scan bài đã chấm.')
  const { error } = await supabase.from('ca_test').update({ bai_da_cham_url: url }).eq('id', caTestId)
  if (error) throw error
}

// ============================================================================
// NHẬN XÉT — biểu đồ chuyên đề (derive từ Đ/C/S per câu, "chỉ để trông xịn") + nhận xét tay + lớp đề
// xuất. Thùy chốt 07-19: KHÔNG còn là bước/gate riêng — nhập NGAY TRONG Trả bài (xem mục dưới).
// ============================================================================
export type NhanXet = { trinhBay?: 'tot' | 'on' | 'kem'; tinhToan?: 'tot' | 'on' | 'kem'; kienThuc?: { hinhCoBan?: string; daiCoBan?: string; hinhNangCao?: string; daiNangCao?: string }; khac?: string }
// (§2.0) `getBieuDoChuyenDe` gom ở JS đã BỎ 09/09 — mọi tỉ lệ (chuyên đề · cơ bản/nâng cao · Đại/Hình) lấy từ
// `getPhieuKetQua` (fn_test_dau_vao_phieu), xem section PHIẾU KẾT QUẢ cuối file.
// Lưu nháp nhận xét — gọi bất cứ lúc nào (autosave khi gõ), KHÔNG gate gì.
export async function setNhanXet(caTestId: string, nhanXet: NhanXet): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ nhan_xet: nhanXet }).eq('id', caTestId)
  if (error) throw error
}
// Thư viện câu mẫu (gõ-để-tìm, mirror V1 sat_hach_nhan_xet_templates).
export type NhanXetMau = { id: string; mon: string; nhom: 'ky_nang' | 'kien_thuc' | 'khac'; noiDung: string }
export async function timNhanXetMau(mon: string, nhom: NhanXetMau['nhom'], q: string): Promise<NhanXetMau[]> {
  let query = supabase.from('nhan_xet_mau').select('*').eq('mon', mon).eq('nhom', nhom)
  if (q.trim()) query = query.ilike('noi_dung', `%${q.trim()}%`)
  const { data, error } = await query.order('created_at', { ascending: false }).limit(20)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, mon: r.mon, nhom: r.nhom, noiDung: r.noi_dung }))
}
export async function luuNhanXetMau(mon: string, nhom: NhanXetMau['nhom'], noiDung: string): Promise<void> {
  if (!noiDung.trim()) return
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('nhan_xet_mau').insert({ mon, nhom, noi_dung: noiDung.trim(), created_by: user?.id ?? null })
  if (error) throw error
}

// ============================================================================
// TRẢ BÀI (Story 4) — sinh SỚM ngay khi điểm danh đóng (trang_thai='hoan_thanh'), nhưng CHẶN ĐÓNG tới
// khi ĐỦ: chấm xong + có scan-đã-chấm + đã chọn lớp đề xuất (nhận xét gộp vào đây — Thùy chốt 07-19).
// Card báo rõ đang thiếu gì. Ops xem/xuất phiếu (kèm bài đã chấm) → gửi Zalo → đóng. HẾT chuỗi.
// ============================================================================
export type CaTestChoTraBai = CaTestChoCham & {
  choChamXong: boolean; choScanDaCham: boolean; choLopDeXuat: boolean
  baiDaChamUrl: string | null; lopDeXuatId: string | null; nhanXet: NhanXet | null
  nguoiTraBaiTen: string | null
}
function mapTraBai(r: any): CaTestChoTraBai {
  return {
    ...mapChoCham(r),
    choChamXong: !r.cham_xong_at, choScanDaCham: !r.bai_da_cham_url, choLopDeXuat: !r.ung_vien?.lop_du_kien_id,
    baiDaChamUrl: r.bai_da_cham_url ?? null, lopDeXuatId: r.ung_vien?.lop_du_kien_id ?? null, nhanXet: r.nhan_xet ?? null,
    nguoiTraBaiTen: r.nguoi_tra_bai?.ho_ten ?? null,
  }
}
const TRA_BAI_SELECT = CHO_CHAM_SELECT + ', tra_bai_xong_at, bai_da_cham_url, nhan_xet, nguoi_tra_bai:nguoi_tra_bai_id(ho_ten)'
export async function listCanTraBai(): Promise<CaTestChoTraBai[]> {
  const { data, error } = await supabase.from('ca_test').select(TRA_BAI_SELECT)
    .eq('trang_thai', 'hoan_thanh').is('tra_bai_xong_at', null).order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapTraBai)
}
export async function listDaTraBai(): Promise<CaTestChoTraBai[]> {
  const { data, error } = await supabase.from('ca_test').select(TRA_BAI_SELECT)
    .not('tra_bai_xong_at', 'is', null).order('tra_bai_xong_at', { ascending: false }).limit(100)
  if (error) throw error
  return (data ?? []).map(mapTraBai)
}
// Đóng trả bài — validate ĐỦ 3 nguồn trước khi đóng (evidence-trước-khi-đóng). lopDeXuatId bắt buộc
// (ghi ung_vien.lop_du_kien_id, REUSE, cùng field cũ dongNhanXet từng ghi).
export async function dongTraBai(caTestId: string, ungVienId: string, lopDeXuatId: string | null): Promise<void> {
  const { data: ct, error: e0 } = await supabase.from('ca_test').select('cham_xong_at, bai_da_cham_url').eq('id', caTestId).single()
  if (e0) throw e0
  const r: any = ct
  if (!r.cham_xong_at) throw new Error('Chưa chấm xong.')
  if (!r.bai_da_cham_url) throw new Error('Chưa có bài scan đã chấm.')
  if (!lopDeXuatId) throw new Error('Chưa chọn lớp đề xuất.')
  await updateUngVien(ungVienId, { lop_du_kien_id: lopDeXuatId })
  const { error } = await supabase.from('ca_test').update({ danh_gia_xong_at: new Date().toISOString(), tra_bai_xong_at: new Date().toISOString() }).eq('id', caTestId).is('tra_bai_xong_at', null)
  if (error) throw error
}

// ── PHIẾU KẾT QUẢ — TOÀN BỘ số liệu do Postgres tính (§2.0): `fn_test_dau_vao_phieu(p_ca_test_id)` (mig 202609092245).
// Client chỉ gọi + hiển thị. Tỉ lệ = Σdiem/Σdiem_toi_da trên câu ĐÃ CHẤM (chưa chấm không vào mẫu số — §5 chưa-đo ≠ sai).
// Nhóm (cơ bản/nâng cao · Đại/Hình) không có câu nào → `soCau === 0` ⇒ màn ẨN khối đó (CEO ⑦: "không có thì bỏ qua"). ──
export type NhomTiLe = { diem: number | null; toiDa: number | null; soCau: number; pct: number | null }
export type PhieuKetQua = {
  hoTenHs: string; khoi: string | null; mon: string; ngay: string
  diemNhap: number | null           // điểm NHẬP TAY (CEO ④) — độc lập với % Đ/C/S
  chamXong: boolean; traBaiXong: boolean
  tong: { soCau: number; daCham: number; diem: number; toiDa: number; pct: number }
  theoChuyenDe: { chuyenDe: string; diem: number; toiDa: number; soCau: number; pct: number }[]
  theoMucDo: { coBan: NhomTiLe | null; nangCao: NhomTiLe | null }   // muc_do ≤3 / ≥4 (độ khó của DẠNG neo)
  theoNhanh: { dai: NhomTiLe | null; hinh: NhomTiLe | null }        // pick từ bản đồ nào → tính từ đấy (CEO ⑦)
  nhanXet: NhanXet | null; baiDaChamUrl: string | null
  // GV + lịch CHỈ in trên ẢNH gửi PH (CEO ⑧), UI trả bài không hiện.
  lopDeXuat: { id: string; tenLop: string; gv: string[]; lich: { thu: number; gioBatDau: string; gioKetThuc: string; phong: string | null }[] } | null
}
export const coNhom = (n: NhomTiLe | null | undefined): n is NhomTiLe => !!n && n.soCau > 0 && n.pct != null
export async function getPhieuKetQua(caTestId: string): Promise<PhieuKetQua> {
  const { data, error } = await supabase.rpc('fn_test_dau_vao_phieu', { p_ca_test_id: caTestId })
  if (error) throw error
  if (!data) throw new Error('Không tìm thấy ca test (hoặc không có quyền xem).')
  const p = data as PhieuKetQua
  return { ...p, diemNhap: p.diemNhap == null ? null : Number(p.diemNhap), theoChuyenDe: p.theoChuyenDe ?? [], theoMucDo: p.theoMucDo ?? { coBan: null, nangCao: null }, theoNhanh: p.theoNhanh ?? { dai: null, hinh: null } }
}
