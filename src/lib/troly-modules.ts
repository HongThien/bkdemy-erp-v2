// ============================================================================
// HAI MẢNG NHỎ CÒN THIẾU: bổ trợ YẾU · kiểm tra ĐẦU VÀO.
// Spec: SPEC-troly-nhansu.md §3 — *"có gì hiện đấy. chưa có bổ trợ yếu thì báo chưa có thông tin"*.
//
// Cả hai đều là mảng ĐANG HỞ, và đó chính là thứ đáng báo. Nguyên tắc: nói ra chỗ hở kèm
// SỐ, đừng im lặng bỏ qua (người đọc sẽ tưởng mảng đó ổn), cũng đừng vờ như đang theo dõi
// (người đọc sẽ tưởng có ai đó đang xử).
// ============================================================================
import { supabase } from './supabase'

const LIMIT = 5000
const ngayVN = (v: any): string =>
  typeof v === 'string' ? v.slice(0, 10) : new Date(v).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const lechNgay = (tu: string, den: string): number =>
  Math.round((Date.parse(den + 'T00:00:00Z') - Date.parse(tu + 'T00:00:00Z')) / 86400000)

// ── MẢNG YẾU ────────────────────────────────────────────────────────────────
// Trạng thái thật (đo 14/08): `canh_bao_yeu` SỐNG (24 dòng, người vẫn ghi khi chấm BTVN),
// `bo_tro_yeu` = 0 dòng và **không có một đường insert nào trong toàn repo**.
// ⇒ Đầu phát chạy, đầu nhận KHÔNG TỒN TẠI. Cờ cảnh báo chảy vào hư không.
export type MangYeu = {
  soCanhBao: number
  soHS: number
  moiNhat: string | null
  cuNhat: string | null
  soCaBoTro: number          // bo_tro_yeu — kỳ vọng > 0 khi luồng được xây
  topHS: { ho_ten: string; soLan: number }[]
  thongDiep: string
}

export async function mangYeu(): Promise<MangYeu> {
  const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const [cb, ca] = await Promise.all([
    supabase.from('canh_bao_yeu').select('hoc_sinh_id, created_at, hoc_sinh:hoc_sinh_id(ho_ten)').limit(LIMIT),
    supabase.from('bo_tro_yeu').select('id', { count: 'exact', head: true }),
  ])
  const rows = (cb.data ?? []) as any[]
  const ngays = rows.map((r) => ngayVN(r.created_at)).sort()
  const dem = new Map<string, number>()
  for (const r of rows) {
    const ten = r.hoc_sinh?.ho_ten ?? '?'
    dem.set(ten, (dem.get(ten) ?? 0) + 1)
  }
  const topHS = [...dem.entries()].map(([ho_ten, soLan]) => ({ ho_ten, soLan }))
    .sort((a, b) => b.soLan - a.soLan).slice(0, 5)
  const soCaBoTro = ca.count ?? 0

  return {
    soCanhBao: rows.length, soHS: dem.size,
    moiNhat: ngays.length ? ngays[ngays.length - 1] : null,
    cuNhat: ngays.length ? ngays[0] : null,
    soCaBoTro, topHS,
    thongDiep: soCaBoTro === 0 && rows.length > 0
      ? `Hệ đang ghi cờ HS yếu đều đặn nhưng CHƯA CÓ chỗ nào tạo ca bổ trợ yếu — ${rows.length} cảnh báo chảy vào hư không${ngays.length ? `, cũ nhất ${lechNgay(ngays[0], homNay)} ngày` : ''}.`
      : rows.length === 0
        ? 'Chưa có cảnh báo HS yếu nào được ghi.'
        : `${rows.length} cảnh báo · ${soCaBoTro} ca bổ trợ yếu đã tạo.`,
  }
}

// ── MẢNG KIỂM TRA ĐẦU VÀO ───────────────────────────────────────────────────
// Chuỗi 4 mốc đã có SẴN cột trong `ca_test`: hoan_thanh_at → bai_url → cham_xong_at →
// tra_bai_xong_at. Không cần bảng mới, chỉ cần khai ai nợ + hạn.
// ⚠ CÒN CHẶN: chưa chốt AI CHẤM (spec §5) ⇒ nêu đúng chỗ tắc, KHÔNG gán bừa cho ai.
export type MangTest = {
  tong: number; daTest: number; daScan: number; daCham: number; daTra: number
  ket: { ho_ten: string; khoi: string | null; mon: string; ngay: string; tuoiNgay: number; khau: string }[]
  thongDiep: string
}

export async function mangTestDauVao(): Promise<MangTest> {
  const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const { data } = await supabase.from('ca_test')
    .select('mon, ngay, bai_url, hoan_thanh_at, cham_xong_at, tra_bai_xong_at, ung_vien:ung_vien_id(ho_ten_hs, khoi)')
    .limit(LIMIT)
  const rows = ((data ?? []) as any[]).map((r) => ({ ...r, ngay: ngayVN(r.ngay) }))

  const daTest = rows.filter((r) => r.hoan_thanh_at).length
  const daScan = rows.filter((r) => r.bai_url).length
  const daCham = rows.filter((r) => r.cham_xong_at).length
  const daTra = rows.filter((r) => r.tra_bai_xong_at).length

  // Kẹt = đã đi được một mốc rồi đứng lại. Nêu ĐÚNG khâu đang chặn, không nói chung chung.
  const ket = rows.filter((r) => !r.tra_bai_xong_at).map((r) => ({
    ho_ten: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null, mon: r.mon,
    ngay: r.ngay, tuoiNgay: lechNgay(r.ngay, homNay),
    khau: !r.hoan_thanh_at ? 'chưa test xong' : !r.bai_url ? 'chưa thu/scan bài' : !r.cham_xong_at ? 'chưa chấm' : 'chưa trả kết quả',
  })).sort((a, b) => b.tuoiNgay - a.tuoiNgay)

  const keoDaiOChamm = ket.filter((k) => k.khau === 'chưa chấm')
  return {
    tong: rows.length, daTest, daScan, daCham, daTra, ket,
    thongDiep: keoDaiOChamm.length
      ? `${keoDaiOChamm.length} ca đã scan bài rồi nằm im ở khâu CHẤM (cũ nhất ${keoDaiOChamm[0].tuoiNgay} ngày) — hệ chưa chốt ai là người chấm nên không gán được cho ai.`
      : ket.length ? `${ket.length} ca chưa xong chuỗi.` : 'Không có ca nào đang treo.',
  }
}
