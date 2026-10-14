// XEM THỬ màn CHẤM CÔNG app TA (ô ở màn chính + CongTA) không cần đăng nhập — soi giao diện + bấm thử luồng.
// supabase.rpc / supabase.from bị thay bằng dữ liệu giả trong RAM (KHÔNG chạm DB). Luật thật nằm ở Postgres và đã
// test riêng (scripts/luong-ta-t9/test_*.mjs) — trang này chỉ để nhìn. Chỉ chạy ở dev: /xem-thu-cong-ta.html
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase'
import CongTA from './screens/ta/CongTA'
import { BK_TROI } from './components/bk/BKUI'
import type { DongCong, GoiY } from './lib/tacong'
import { homNayVN, congNgay } from './lib/tuan'
import './index.css'

const HN = homNayVN()
const ts = (gio: string, ngay = HN) => `${ngay}T${gio}:00+07:00`
let seq = 1
const LOAI = [
  ['tro_giang', 'Trợ giảng lớp học', 'package', 'tg', 'buoi', true, false], ['bo_tro_dinh_ki', 'Bổ trợ định kì (trực bổ trợ khối)', 'package', 'bo_tro', 'gio', false, false],
  ['bo_tro_bu', 'Bổ trợ bù', 'package', 'bo_tro', 'gio', true, true], ['bo_tro_chua_bai', 'Chữa bài cho học sinh', 'package', 'bo_tro', 'gio', true, true],
  ['bo_tro_dac_biet', 'Bổ trợ đặc biệt (kèm riêng)', 'ngoai_package', 'bo_tro_dac_biet', 'buoi', false, true], ['trong_thi', 'Trông thi', 'ngoai_package', 'trong_thi', 'gio', true, false],
  ['hop', 'Họp', 'ngoai_package', 'khac', 'gio', false, false], ['khac', 'Việc khác (bắt buộc ghi chú)', 'ngoai_package', 'khac', 'gio', false, false],
].map(([ma, ten, nhom, tinh_vao, don_vi, can_lop, can_hs], i) => ({ ma, ten, nhom, tinh_vao, don_vi, can_lop, can_hs, thu_tu: i }))
const LOP = [{ id: 'l6s2', ten_lop: '6S2', mon: 'Toán' }, { id: 'l6s1', ten_lop: '6S1', mon: 'Toán' }, { id: 'l9a1', ten_lop: '9A1', mon: 'Toán' }]
const goiY: GoiY[] = [
  { nguon: 'ca_bo_tro', loai_viec: 'bo_tro_dinh_ki', lop_id: null, ten_lop: 'Toán 6', buoi_hoc_id: null, ca_bo_tro_id: 'c1', gio_bat_dau: '17:00:00', gio_ket_thuc: '18:00:00', dang_dien_ra: true, da_khai: false },
  { nguon: 'buoi_thuong', loai_viec: 'tro_giang', lop_id: 'l6s2', ten_lop: '6S2', buoi_hoc_id: 'b1', ca_bo_tro_id: null, gio_bat_dau: '18:00:00', gio_ket_thuc: '19:30:00', dang_dien_ra: false, da_khai: false },
  { nguon: 'buoi_bo_tro', loai_viec: 'bo_tro_bu', lop_id: 'l6s2', ten_lop: '6S2', buoi_hoc_id: 'b2', ca_bo_tro_id: null, gio_bat_dau: '19:30:00', gio_ket_thuc: '20:30:00', dang_dien_ra: false, da_khai: false },
]
const dong: DongCong[] = []
const moi = (x: Partial<DongCong>): DongCong => ({
  loai_dong: 'viec', id: 'x' + seq++, cham_cong_id: null, nhan_su_id: 'me', ho_ten: 'Nguyễn Xem Thử', ngay: HN, vao_at: null, ra_at: null, vao_chot: null, ra_chot: null,
  quen_ra: false, khai_bu: false, nguon: 'tu_khai', loai_viec: null, ten_loai: null, lop_id: null, ten_lop: null, gio_bat_dau: null, gio_ket_thuc: null, hoc_sinh: null, ghi_chu: '',
  khop: null, co: [], lam_ho: null, duyet: 'cho_duyet', ly_do_duyet: null, ...x,
})
// vài ngày cũ để Bảng công có nội dung
const homQua = congNgay(HN, -1)
dong.push(moi({ loai_dong: 'ca', ngay: homQua, vao_at: ts('16:55', homQua), ra_at: ts('20:40', homQua), duyet: 'da_duyet' }))
dong.push(moi({ ngay: homQua, loai_viec: 'tro_giang', ten_loai: 'Trợ giảng lớp học', ten_lop: '6S1', gio_bat_dau: '18:00:00', gio_ket_thuc: '19:30:00', khop: true, lam_ho: 'Trần Bình', duyet: 'da_duyet' }))
dong.push(moi({ ngay: homQua, loai_viec: 'hop', ten_loai: 'Họp', gio_bat_dau: '19:30:00', gio_ket_thuc: '20:30:00', khop: false, co: ['chua_don_gia'], duyet: 'tu_choi', ly_do_duyet: 'Họp này không tính công' }))

const ok = (data: unknown) => Promise.resolve({ data, error: null })
const loi = (m: string) => Promise.resolve({ data: null, error: { message: m } })
const caMo = () => dong.find((r) => r.loai_dong === 'ca' && r.ngay === HN && !r.ra_at)
;(supabase as any).rpc = (fn: string, a: any = {}) => {
  const vn = new Date(Date.now() + 7 * 3600000), gio = `${String(vn.getUTCHours()).padStart(2, '0')}:${String(vn.getUTCMinutes()).padStart(2, '0')}`
  switch (fn) {
    case 'fn_ta_cong_cua_toi': return ok(dong.filter((r) => r.ngay >= a.p_tu && r.ngay <= (a.p_den ?? a.p_tu)))
    case 'fn_ta_hom_nay': return ok(goiY)
    case 'fn_ta_khai_bu_cho_phep': return ok([{ tu: homQua, den: HN, han: null, ghi_chu: 'Trong 24 giờ' }, { tu: '2026-10-01', den: HN, han: '2026-11-03T16:59:59Z', ghi_chu: 'Khai lùi tháng 10' }])
    case 'fn_ta_cham_cong_vao': { if (!caMo()) dong.push(moi({ loai_dong: 'ca', vao_at: ts(gio), co: ['ca_khong_viec'] })); return ok('ca') }
    case 'fn_ta_cham_cong_ra': { const c = caMo(); if (!c) return loi('Hôm nay chưa checkin'); c.ra_at = ts(gio); return ok(c.id) }
    case 'fn_ta_cham_cong_khai_bu': { const ngay = a.p_vao.slice(0, 10); dong.push(moi({ loai_dong: 'ca', ngay, vao_at: a.p_vao, ra_at: a.p_ra, khai_bu: true, co: ['khai_bu'] })); return ok('bu') }
    case 'fn_ta_khai_viec': {
      if (!dong.some((r) => r.loai_dong === 'ca' && r.ngay === a.p_ngay)) return loi('Chưa checkin ngày ' + a.p_ngay.slice(8, 10) + '/' + a.p_ngay.slice(5, 7))
      if (a.p_loai === 'khac' && !a.p_ghi_chu?.trim()) return loi('Việc khác phải ghi chú')
      const g = goiY.find((x) => (x.buoi_hoc_id && x.buoi_hoc_id === a.p_buoi) || (x.ca_bo_tro_id && x.ca_bo_tro_id === a.p_ca))
      if (g?.da_khai) return loi('Việc này đã ghi công rồi')
      if (g) g.da_khai = true
      const L = LOAI.find((l) => l.ma === a.p_loai)!
      const lop = LOP.find((l) => l.id === a.p_lop) ?? (a.p_loai === 'tro_giang' ? LOP[0] : undefined)
      dong.push(moi({ ngay: a.p_ngay, loai_viec: a.p_loai, ten_loai: L.ten as string, ten_lop: lop?.ten_lop ?? null, gio_bat_dau: a.p_bat, gio_ket_thuc: a.p_ket, hoc_sinh: a.p_hs,
        ghi_chu: a.p_ghi_chu, khop: !!g, nguon: g ? 'he_thong' : 'tu_khai', khai_bu: a.p_ngay < HN, lam_ho: lop?.id === 'l6s1' ? 'Trần Bình' : null,
        co: [...(L.nhom === 'ngoai_package' && L.ma !== 'trong_thi' && L.ma !== 'bo_tro_dac_biet' ? ['chua_don_gia'] : []), ...(a.p_ngay < HN ? ['khai_bu'] : [])] }))
      return ok('v')
    }
    case 'fn_ta_bo_viec': { const v = dong.find((r) => r.id === a.p_id); if (v) { v.duyet = 'tu_choi'; v.ly_do_duyet = 'TA tự bỏ' } return ok(null) }
    case 'fn_ta_luong_thang': return ok([{ nhan_su_id: 'me', ho_ten: 'Nguyễn Xem Thử', package_lop: 702000, bo_tro_gio: 6.5, bo_tro_tien: 390000, ngoai_package: 150000, gross: 1242000, tien_phat: 0, net: 1242000,
      chi_tiet: { lop: [{ lop: '6S2', la_chu: true, si_tb: 10.7, bac: 1200000, tg_lam: 6, so_buoi: 8, ti_le_tg: 0.75, btvn_lam: 5, btvn_dinh_muc: 7, ti_le_btvn: 0.7143, tien: 531429 },
        { lop: '6S1', la_chu: false, si_tb: 7, bac: 1000000, tg_lam: 1, so_buoi: 8, ti_le_tg: 0.125, btvn_lam: 0, btvn_dinh_muc: 7, ti_le_btvn: 0, tien: 50000 }],
        bo_tro: { gio: 6.5, so_lop: 1, chi_tieu_moi_lop: 8, chi_tieu: 8, ti_le: 0.8125, tong_bac: 1200000, lop_chinh: '6S2', tien: 390000 },
        ngoai_package: [{ loai: 'bo_tro_dac_biet', ngay: homQua, lop: null, so_luong: 1, don_gia: 150000, thieu_don_gia: false }], day_thay: 1, tien_phat: 0 } }])
    default: return loi('xem thử: chưa giả lập ' + fn)
  }
}
const chain = (rows: unknown[]) => { const b: any = { select: () => b, eq: () => b, order: () => b, limit: () => b, then: (r: any, j: any) => ok(rows).then(r, j) }; return b }
;(supabase as any).from = (t: string) => chain(t === 'ta_loai_viec' ? LOAI : t === 'lop' ? LOP : [])

function Xem() {
  const [, setK] = useState(0)
  return (
    <div className="min-h-[100dvh]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <CongTA nsId="me" onBack={() => setK((k) => k + 1)} />
    </div>
  )
}
createRoot(document.getElementById('root')!).render(<StrictMode><Xem /></StrictMode>)
