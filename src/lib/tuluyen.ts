// ============================================================================
// tuluyen.ts — TỰ LUYỆN (Thùy 18-20/08; sửa lớn 29/08): MỖI LƯỢT = 1 bai_test RIÊNG 10 câu,
// luyện bao nhiêu lượt tuỳ em (Thùy 29/08: bỏ trần 30/ngày + "mỗi lần luyện phải độc lập" —
// KHÔNG append cộng dồn vào 1 bài/ngày như bản đầu). Mở app: lượt hôm nay đang DỞ thì làm
// tiếp, hết dở thì sinh lượt mới. 40% ngẫu nhiên trong dạng ĐÃ HỌC · 60% trong dạng đang YẾU.
//
// KIẾN TRÚC: tái dùng NGUYÊN bai_test/bai_test_cau/bai_lam/bai_lam_cau (loai='tu_luyen',
// bai_test.hoc_sinh_id set — bài CÁ NHÂN, khác ET/BTVN dùng chung cả lớp). Chọn DẠNG + chọn CÂU + snapshot
// đều chạy Ở SERVER (RPC `fn_tu_luyen_sinh_tu_dong` — mig 202610011547, 01/10: trước đây dạng do JS chọn rồi gửi lên,
// HS tinh ý chọn được dạng dễ cho Thử thách; công thức mức nắm nay chỉ còn 1 nơi: fn_mastery_cells).
// Mastery hệ số (cấp 1 = trung tâm hệ số 1, cấp 3 = chỉ gộp view HS) do mastery.ts tự phân biệt
// qua `loai='tu_luyen'` khi build — KHÔNG xử ở đây (xem DEVLOG "còn treo" ngày viết file này).
// ============================================================================
import { supabase } from './supabase'
import { MON_APP_HS } from './mon'

const SO_CAU_MOI_LUOT = 10

export type LuotHomNay = { dangDo: { baiTestId: string } | null; tongCau: number }

// Các LƯỢT tự luyện hôm nay: lượt MỚI NHẤT chưa nộp (để làm tiếp thay vì sinh lượt mới đè lên
// lượt dở) + tổng số câu đã sinh hôm nay (hiển thị động viên ở màn kết quả). Chỉ soi 20 lượt gần
// nhất — quá đủ cho "dở", tổng câu vẫn đếm đúng qua sum so_cau của TOÀN BỘ lượt trong ngày.
export async function luotTuLuyenHomNay(mon: string): Promise<LuotHomNay> {
  const { data: hocSinhId } = await supabase.rpc('my_hoc_sinh_id')
  if (!hocSinhId) return { dangDo: null, tongCau: 0 }
  const homNay = ngayVN()
  const { data: bts, error } = await supabase.from('bai_test').select('id, so_cau')
    .eq('hoc_sinh_id', hocSinhId).eq('mon', mon).eq('loai', 'tu_luyen').eq('thu_thach', false).eq('ngay', homNay)
    .order('created_at', { ascending: false }).limit(100)
  if (error) throw error
  const rows = (bts ?? []) as { id: string; so_cau: number }[]
  const tongCau = rows.reduce((s, r) => s + r.so_cau, 0)
  if (!rows.length) return { dangDo: null, tongCau }
  const gan = rows.slice(0, 20)
  const { data: lams } = await supabase.from('bai_lam').select('bai_test_id, trang_thai')
    .in('bai_test_id', gan.map((r) => r.id)).limit(20)
  const daNop = new Set(((lams ?? []) as { bai_test_id: string; trang_thai: string }[])
    .filter((l) => l.trang_thai === 'da_nop').map((l) => l.bai_test_id))
  const dangDo = gan.find((r) => !daNop.has(r.id))
  return { dangDo: dangDo ? { baiTestId: dangDo.id } : null, tongCau }
}

// Ngày hôm nay giờ VN dạng 'YYYY-MM-DD' — KHÔNG dùng toISOString()/new Date('...') (CLAUDE.md §2 cấm).
function ngayVN(): string {
  const vn = new Date(Date.now() + 7 * 3600000)
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`
}

type RawEval = { ma_dang: string; value: number; t: string; src: 'et' | 'mt' | 'btvn' | 'bt' | 'tu_luyen' }

export type SinhTuLuyenKetQua = { baiTestId: string; them: number; tong: number }

// Sinh 1 LƯỢT MỚI (bai_test riêng, mặc định 10 câu) — "làm thêm" gọi lại đúng hàm này, ra lượt mới.
export async function sinhTuLuyen(mon: string): Promise<SinhTuLuyenKetQua> {
  const { data, error } = await supabase.rpc('fn_tu_luyen_sinh_tu_dong', { p_mon: mon })   // server chọn dạng: 60% nửa yếu · 40% mọi dạng đã đo
  if (error) throw error
  return { baiTestId: data.bai_test_id, them: data.them, tong: data.tong }
}

export const TU_LUYEN_SO_CAU_MOI_LUOT = SO_CAU_MOI_LUOT

// ── TỰ LUYỆN THEO CHỦ ĐỀ (Thùy 19/09, sửa % 20/09) — HS chọn 1 dạng, luyện CHỈ dạng đó.
// "%" = MASTERY thật (fn_mastery_cells, WINDOW=5 Đ/C/S — KHÔNG phải coverage kho). pct=null
// khi dạng KHÔNG có lần đo nào trong cửa sổ hiện tại + cửa sổ trước (~1 tháng, xem
// gami/danhgia.js cuaSoCua) — "chưa đánh giá được", tránh hiện điểm CŨ không chính xác.
// Danh sách đã SẮP XẾP sẵn từ RPC: yếu nhất → mạnh nhất, "chưa đánh giá" xuống cuối.
// RPC lo hết chọn câu + rải đều cụm (`ma_cum`) — xem migration 202609191417 + 202609200922.
export type DangChuDe = {
  ma_dang: string; ten_dang: string; ten_chuyen_de: string; tong_cau: number; da_luyen: number
  pct: number | null; muc: 'dat' | 'can_luyen' | 'yeu' | null
}
export async function layDangChuDe(mon: string): Promise<DangChuDe[]> {
  const { data, error } = await supabase.rpc('tu_luyen_chu_de_ds_dang', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as DangChuDe[]
}
// chiCauMoi=true: CHỈ chọn câu chưa luyện trong 2 cửa sổ gần nhất (không lặp câu cũ, dừng sớm
// + báo lỗi rõ nếu dạng đã hết câu mới — KHÔNG âm thầm lùi về cho lặp lại, phá nghĩa toggle).
export async function sinhTuLuyenChuDe(mon: string, maDang: string, chiCauMoi = false): Promise<SinhTuLuyenKetQua> {
  const { data, error } = await supabase.rpc('tu_luyen_chu_de_sinh', { p_mon: mon, p_ma_dang: maDang, p_chi_cau_moi: chiCauMoi })
  if (error) throw error
  return { baiTestId: data.bai_test_id, them: data.them, tong: data.tong }
}

// Môn HS đang học — cần đọc THẲNG qua RPC vì `lop`/`hoc_sinh_lop` staff-only (verify: HS SELECT
// hoc_sinh_lop → 0 dòng, không lỗi). Trước giờ app chỉ suy mon GIÁN TIẾP từ bai_test HS đang có
// (tests[0]?.mon) — HS cấp 1 (chỉ tự luyện, không ET/BTVN online) sẽ ra rỗng theo đường đó.
// 28/09: em học NHIỀU môn là chuyện thật (57 HS) — bản cũ lấy phần tử đầu của mảng sắp theo chữ cái
// ⇒ em học Toán + KHTN chỉ thấy KHTN (vụ Gia Khiêm). Giờ: danh sách (môn, lớp) từ DB theo thứ tự em
// vào học (mig 202609281900) + môn em ĐANG CHỌN ở thanh chọn môn màn chính. Lựa chọn nhớ theo MÁY
// (localStorage — sở thích hiển thị của riêng người xem, không phải dữ liệu nghiệp vụ); luôn đối chiếu
// lại với danh sách thật nên máy dùng chung 2 anh em / em đã rời lớp môn đó thì tự về môn đầu.
// 01/10 (Thùy: "phải chọn môn Toán, KHTN, Tiếng Anh; chuyển môn là chuyển tính năng học tập"): môn là TRỤC NGOÀI
// CÙNG của app HS. Chỉ môn có góc học tập trên app (`MON_APP_HS`) mới hiện; `co_kho` = môn đã có kho câu chưa
// (registry `_kho_co_mon` ở DB, mig 202610011120) — chưa có thì các ô cần kho (tự luyện, sổ tay…) báo "chưa mở",
// KHÔNG gọi RPC (trước đó gọi là ra câu TOÁN gắn nhãn môn khác: 68 bài tự luyện 'Tiếng Anh' toàn câu Toán).
export type LopMonHS = { mon: string; ten_lop: string; co_kho: boolean }
export async function lopMonCuaHS(): Promise<LopMonHS[]> {
  const { data, error } = await supabase.rpc('hs_mon_hoc_cua_toi')
  if (error) throw error
  return ((data ?? []) as LopMonHS[])
    .map((d) => ({ mon: String(d.mon), ten_lop: String(d.ten_lop ?? ''), co_kho: d.co_kho !== false }))
    .filter((d) => (MON_APP_HS as readonly string[]).includes(d.mon))
}

// MÔN ĐANG CHỌN — 1 nguồn trong phiên (module-level, sống tới F5) + nhớ theo máy (localStorage — sở thích hiển thị,
// không phải dữ liệu nghiệp vụ). HocSinhApp đặt; màn con đọc qua monCuaHS() (không gọi lại RPC) hoặc hook useMonHS()
// (skin/KhungHS) để hiện nhãn môn ở đầu trang.
const KHOA_MON_CHON = 'hs_mon_chon'
let monHienTai: string | null = null
// MÔN TẠM (03/10): em mở ô RIÊNG của một môn mở cho cả khối (TSA khối 12) ⇒ trong lúc ở trong ô đó, mọi màn con chạy theo
// môn này mà KHÔNG đổi môn đã chọn ở thanh chọn môn (không ghi localStorage). Về màn chính thì HocSinhApp trả về null.
let monTam: string | null = null
const ngheMon = new Set<() => void>()
export function layMonHienTai(): string | null { return monTam ?? monHienTai }
export function ngheMonHienTai(f: () => void): () => void { ngheMon.add(f); return () => { ngheMon.delete(f) } }
function datMonHienTai(mon: string | null) {
  if (mon === monHienTai) return
  monHienTai = mon
  ngheMon.forEach((f) => f())
}
export function layMonTam(): string | null { return monTam }
export function datMonTam(mon: string | null): void {
  if (mon === monTam) return
  monTam = mon
  ngheMon.forEach((f) => f())
}

// Môn mở cho CẢ KHỐI của em (registry `mon_mo_ca_khoi`, mig 202610030228 — TSA khối 12): KHÔNG vào thanh chọn môn,
// mỗi môn thành 1 ô riêng "Tự luyện <môn>" ở khối Học tập.
export type MonRiengHS = { mon: string; co_kho: boolean }
export async function monRiengCuaHS(): Promise<MonRiengHS[]> {
  const { data, error } = await supabase.rpc('hs_mon_rieng_cua_toi')
  if (error) throw error
  return ((data ?? []) as MonRiengHS[]).map((d) => ({ mon: String(d.mon), co_kho: d.co_kho !== false }))
}
export function chonMonHS(mon: string): void {
  try { localStorage.setItem(KHOA_MON_CHON, mon) } catch { /* chế độ riêng tư: mất nhớ, app vẫn chạy */ }
  datMonHienTai(mon)
}
// Đối chiếu lựa chọn đã nhớ với danh sách THẬT (máy dùng chung 2 anh em / em đã rời lớp môn đó ⇒ về môn đầu).
export function monDangChon(ds: LopMonHS[]): string | null {
  let nho: string | null = null
  try { nho = localStorage.getItem(KHOA_MON_CHON) } catch { /* như trên */ }
  const m = ds.find((d) => d.mon === nho)?.mon ?? ds[0]?.mon ?? null
  datMonHienTai(m)
  return m
}
export async function monCuaHS(): Promise<string | null> {
  return monTam ?? monHienTai ?? monDangChon(await lopMonCuaHS())
}

// Cấp 1 hay không — màn chính app HS cần ẨN 3 ô ET/BTVN/Bài tập trên lớp cho cấp 1 (Thùy: chỉ có
// Tự luyện trên điện thoại). `hoc_sinh` staff-only nên đọc qua RPC, cùng lý do với monCuaHS() trên.
export async function laCap1HS(): Promise<boolean> {
  const { data, error } = await supabase.rpc('hs_cap1_cua_toi')
  if (error) throw error
  return !!data
}

// Khối THÔ (khác laCap1HS trả boolean) — cần cho tính năng riêng theo TỪNG khối (vd bảng xếp hạng
// 5T) mà không đẻ RPC boolean mới cho mỗi khối. Cùng lý do RLS với 2 hàm trên.
export async function khoiCuaHS(): Promise<string | null> {
  const { data, error } = await supabase.rpc('hs_khoi_cua_toi')
  if (error) throw error
  return (data as string | null) ?? null
}

// Giới tính — màn chính cấp 2/3 có 2 biến thể nam/nữ (kit hs-home-v4). Null/khác = mặc định nam.
export async function gioiTinhCuaHS(): Promise<'nam' | 'nu' | null> {
  const { data, error } = await supabase.rpc('hs_gioi_tinh_cua_toi')
  if (error) throw error
  return data === 'nu' ? 'nu' : data === 'nam' ? 'nam' : null
}

// Hồ sơ gộp cho màn chính (giới tính → theme · anh_url → avatar) — 1 RPC thay vì mỗi cột 1 RPC (mig 202609080215).
export type HoSoHS = { ho_ten: string; ma_hs: string; gioi_tinh: 'nam' | 'nu' | null; anh_url: string | null }
export async function hoSoCuaToi(): Promise<HoSoHS | null> {
  const { data, error } = await supabase.rpc('hs_ho_so_cua_toi')
  if (error) throw error
  if (!data) return null
  const d = data as Record<string, unknown>
  return { ho_ten: String(d.ho_ten ?? ''), ma_hs: String(d.ma_hs ?? ''), gioi_tinh: d.gioi_tinh === 'nu' ? 'nu' : d.gioi_tinh === 'nam' ? 'nam' : null, anh_url: (d.anh_url as string | null) ?? null }
}
// Đổi ảnh đại diện — HS không UPDATE hoc_sinh thẳng được (RLS staff-only) → RPC chỉ sửa anh_url của chính mình.
export async function doiAnhDaiDienHS(url: string): Promise<void> {
  const { error } = await supabase.rpc('hs_doi_anh_dai_dien', { p_url: url })
  if (error) throw error
}

export const SRC_LABEL: Record<RawEval['src'], string> = { et: 'ET', mt: 'MT', btvn: 'BTVN', bt: 'BT', tu_luyen: 'TL' }
export type RecentEval = { value: number; t: string; src: RawEval['src'] }
// muc=null ⇒ "chưa đánh giá được" — dạng KHÔNG có lần đo nào trong cửa sổ hiện tại + cửa sổ trước
// (~1 tháng, xem `_tu_luyen_dau_cua_so_truoc` SQL + `cuaSoCua`/`cuaSoTruoc` gami/danhgia.js). Dữ liệu
// cũ hơn VẪN còn (dạng đã từng đo) nhưng KHÔNG đủ mới để tin — không hiện mức cũ ra màn (CEO 20/09).
export type DangHocTap = {
  ma_dang: string; ten_dang: string; ten_chuyen_de: string
  score: number | null; muc: 'dat' | 'can_luyen' | 'yeu' | null; n: number | null
  recent: RecentEval[] // 5 lần GẦN NHẤT (bất kể cũ/mới) — luôn hiện, kể cả khi muc=null
}
export type TongQuanHocTap = { dangs: DangHocTap[]; dat: number; canLuyen: number; yeu: number; chuaDanhGia: number }

// Màn "Thông tin học tập" (Thùy 21/08, sửa "cửa sổ" 20/09). Mức Đạt/Cần luyện/Yếu/Chưa đánh giá được
// = ĐÚNG `fn_mastery_cells` (RPC `hs_dang_hoc_tap`, KHÔNG bịa công thức riêng — §2.0), KHÔNG còn tính
// `masteryOfDang` ở client. `recent` (5 dot lịch sử hiển thị) vẫn là list thô, gom sẵn trong SQL.
export async function layDangHocTap(mon: string): Promise<TongQuanHocTap> {
  const { data, error } = await supabase.rpc('hs_dang_hoc_tap', { p_mon: mon })
  if (error) throw error
  const dangs = (data ?? []) as DangHocTap[]
  let dat = 0, canLuyen = 0, yeu = 0, chuaDanhGia = 0
  for (const d of dangs) {
    if (d.muc === 'dat') dat++; else if (d.muc === 'can_luyen') canLuyen++; else if (d.muc === 'yeu') yeu++; else chuaDanhGia++
  }
  return { dangs, dat, canLuyen, yeu, chuaDanhGia }
}

export type XepHangRow = { ma_hs: string; ho_ten: string; so_cau_dung: number; la_toi: boolean }

// Bảng xếp hạng Tự luyện theo khối (Thùy 21/08: "xếp hạng các bạn 5T về thành tích làm tự luyện ở
// nhà"). Chỉ số = số câu ĐÚNG cộng dồn — tính năng mới ra nên chưa cần lọc theo mùa.
export async function xepHangTuLuyen(khoi: string, mon: string): Promise<XepHangRow[]> {
  const { data, error } = await supabase.rpc('hs_xep_hang_tu_luyen', { p_khoi: khoi, p_mon: mon }) // 01/10: của môn đang chọn
  if (error) throw error
  return (data ?? []) as XepHangRow[]
}

// ── LỊCH SỬ LÀM BÀI TRÊN APP (Thùy 12/09) — group theo ngày VN, mỗi ngày trả số câu/đúng/sai +
// thời gian in-app đo bằng MAX-MIN cham_at trong bai_lam_cau. 30 ngày gần nhất. ──
export type LichSuLamBaiRow = { ngay: string; so_cau: number; so_dung: number; so_sai: number; thoi_gian_giay: number }
export async function layLichSuLamBai(mon: string, soNgay = 30): Promise<LichSuLamBaiRow[]> {
  const { data, error } = await supabase.rpc('fn_hs_lich_su_lam_bai', { p_so_ngay: soNgay, p_mon: mon }) // 01/10: của môn đang chọn
  if (error) throw error
  return (data ?? []) as LichSuLamBaiRow[]
}

// ── BXH tỉ lệ đạt DẠNG BÀI theo khối (Thùy 12/09). Định nghĩa "đạt" ở DB: tổng câu >=3 và
// tỉ lệ đúng >=75%. Trả list rank giảm dần; HS chưa đo dạng nào → ti_le = null (rank cuối). ──
export type XepHangTiLeRow = { ma_hs: string; ho_ten: string; ti_le: number | null; so_dat: number; so_dang: number; la_toi: boolean }
export async function xepHangTiLeDat(mon: string, khoi: string): Promise<XepHangTiLeRow[]> {
  const { data, error } = await supabase.rpc('fn_hs_xep_hang_ti_le_dat', { p_mon: mon, p_khoi: khoi })
  if (error) throw error
  return (data ?? []) as XepHangTiLeRow[]
}

// ── LUYỆN CHỨNG MINH (điền ô) — spec-dien-o.md §0b, D2. Mỗi lượt = 1 bai_test loai 'tu_luyen' gồm N bài hình có form điền ô
// đã duyệt (RPC tu_luyen_dien_sinh: chọn + snapshot ở server, bản HS thấy đã cắt key). Chấm ở DB (hs_dien_tra_loi → fn_dien_cham:
// đúng hết Đ, sai >60% ô S, còn lại C — CEO 09/09). Client chỉ hiển thị và đến ô nào hiện đúng/sai ô đó. ──
export type DienHsView = { buoc: { k: number; text: string }[]; o: { id: string; kieu: 'ket_luan' | 'ly_do'; buoc: number; key_len: number; phuong_an: string[] }[] }
export async function sinhTuLuyenDienO(mon: string, soBai = 3): Promise<{ baiTestId: string; soCau: number }> {
  const { data, error } = await supabase.rpc('tu_luyen_dien_sinh', { p_mon: mon, p_n: soBai })
  if (error) throw error
  return { baiTestId: data.bai_test_id, soCau: data.so_cau }
}
export async function traLoiDienO(baiLamId: string, baiTestCauId: string, dapAnHs: number[]): Promise<{ verdict: string; ti_le: number; key: string[]; bai_lam_cau_id: string }> {
  const { data, error } = await supabase.rpc('hs_dien_tra_loi', { p_bai_lam_id: baiLamId, p_bai_test_cau_id: baiTestCauId, p_dap_an_hs: dapAnHs })
  if (error) throw error
  return data as { verdict: string; ti_le: number; key: string[]; bai_lam_cau_id: string }
}
