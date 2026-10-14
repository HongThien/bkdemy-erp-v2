// XEM THỬ màn CHẤM CÔNG app TA (ô ở màn chính + CongTA) không cần đăng nhập — soi giao diện + bấm thử luồng.
// supabase.rpc / supabase.from bị thay bằng dữ liệu giả trong RAM (KHÔNG chạm DB). Luật thật nằm ở Postgres và đã
// test riêng (scripts/luong-ta-t9/test_*.mjs) — trang này chỉ để nhìn. Chỉ chạy ở dev: /xem-thu-cong-ta.html
// ?man=duyet → màn ERP Duyệt công (Trang) · ?man=luong → màn ERP Lương trợ giảng · mặc định = app TA.
// &chot=1 → giả như tháng hiện tại đã qua hạn duyệt để bấm thử Chốt / Mở lại (bản chốt giả trong RAM).
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase'
import CongTA from './screens/ta/CongTA'
import DuyetCongScreen from './screens/tacong/DuyetCongScreen'
import LuongTaScreen from './screens/tacong/LuongTaScreen'
import { useStore } from './store/useStore'
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

const LUONG_AN: any = { nhan_su_id: 'me', ho_ten: 'Nguyễn Xem Thử', package_lop: 702000, bo_tro_gio: 6.5, bo_tro_tien: 390000, ngoai_package: 150000, gross: 1242000, tien_phat: 0, net: 1242000,
      chi_tiet: { lop: [{ lop: '6S2', la_chu: true, si_tb: 10.7, bac: 1200000, tg_lam: 6, so_buoi: 8, ti_le_tg: 0.75, btvn_lam: 5, btvn_dinh_muc: 7, ti_le_btvn: 0.7143, tien: 531429 },
        { lop: '6S1', la_chu: false, si_tb: 7, bac: 1000000, tg_lam: 1, so_buoi: 8, ti_le_tg: 0.125, btvn_lam: 0, btvn_dinh_muc: 7, ti_le_btvn: 0, tien: 50000 }],
        bo_tro: { gio: 6.5, so_lop: 1, chi_tieu_moi_lop: 8, chi_tieu: 8, ti_le: 0.8125, tong_bac: 1200000, lop_chinh: '6S2', tien: 390000 },
        ngoai_package: [{ loai: 'bo_tro_dac_biet', ngay: homQua, lop: null, so_luong: 1, don_gia: 150000, thieu_don_gia: false }], day_thay: 1, tien_phat: 0 } }
const GIA: any[] = [
  { ma: 'gia_trong_thi', ten: 'Trông thi lớp khác', si_tu: null, si_den: null, gia_tri: 50000, don_vi: 'đ/giờ', hieu_luc_tu: '2026-09-01', dang_hieu_luc: true, ghi_chu: 'Trông thi lớp mình nằm trong công TG', nguoi_dat: null, dat_at: '' },
  { ma: 'he_so_tg', ten: 'Hệ số lương: trợ giảng + ET', si_tu: null, si_den: null, gia_tri: 0.4, don_vi: 'hệ số', hieu_luc_tu: '2026-09-01', dang_hieu_luc: true, ghi_chu: 'CEO chốt: package TA', nguoi_dat: null, dat_at: '' },
  { ma: 'bac_luong', ten: 'Bậc lương lớp: 9–12 HS', si_tu: 9, si_den: 12, gia_tri: 1200000, don_vi: 'đ/tháng', hieu_luc_tu: '2026-09-01', dang_hieu_luc: true, ghi_chu: '', nguoi_dat: null, dat_at: '' },
]
// công của TA khác cho màn duyệt: ca quên checkout hôm qua + việc có cờ
const KHAC: DongCong[] = []
const caB = moi({ loai_dong: 'ca', nhan_su_id: 'b', ho_ten: 'Trần Bình', ngay: homQua, vao_at: ts('16:20', homQua), quen_ra: true, co: ['quen_ra'] })
KHAC.push(caB, moi({ nhan_su_id: 'b', ho_ten: 'Trần Bình', cham_cong_id: caB.id, ngay: homQua, loai_viec: 'bo_tro_duoi', ten_loai: 'Bổ trợ đuổi', ten_lop: '6S1', gio_bat_dau: '16:30:00', gio_ket_thuc: '18:00:00', hoc_sinh: 'Bảo Anh', khop: true }),
  moi({ nhan_su_id: 'b', ho_ten: 'Trần Bình', cham_cong_id: caB.id, ngay: homQua, loai_viec: 'tro_giang', ten_loai: 'Trợ giảng lớp học', ten_lop: '6S2', gio_bat_dau: '18:00:00', gio_ket_thuc: '19:30:00', khop: true, co: ['hai_ta_cung_buoi'], lam_ho: 'Nguyễn Xem Thử' }))
// Chốt kỳ giả (RAM): mỗi kỳ một danh sách lần chốt; tháng trước 10/2026 là "trước mốc chấm công".
const CHOT: Record<string, { lan: number; chot_at: string; chot_boi: string; tong_net: number; so_ta: number; ghi_chu: string; mo_lai_at: string | null; mo_lai_boi: string | null; ly_do_mo_lai: string | null }[]> = {}
const QUA_HAN = new URLSearchParams(location.search).get('chot') === '1'
const dangChot = (ky: string) => (CHOT[ky] ?? []).find((h) => !h.mo_lai_at)
const kyTT = (ky: string) => {
  const h = dangChot(ky), truoc = ky < '2026-10-01', sau = congNgay(ky.slice(0, 8) + '28', 7).slice(0, 8) + '04'
  return { ky, da_chot: !!h, lan: h?.lan ?? null, chot_at: h?.chot_at ?? null, chot_boi: h?.chot_boi ?? null, so_ta: h?.so_ta ?? null, tong_net: h?.tong_net ?? null,
    mo_chot_tu: QUA_HAN ? '2026-01-01T00:00:00+07:00' : sau + 'T00:00:00+07:00', cho_duyet_ca: 0, cho_duyet_viec: 0, quen_checkout: 0,
    moc_cham_cong: '2026-10-01', truoc_moc: truoc, co_the_chot: !h && !truoc && QUA_HAN, lich_su: [...(CHOT[ky] ?? [])].reverse() }
}
const BANG = () => [LUONG_AN, { ...LUONG_AN, nhan_su_id: 'b', ho_ten: 'Trần Bình', package_lop: 480000, bo_tro_tien: 120000, ngoai_package: 0, gross: 600000, net: 550000, tien_phat: 50000, chi_tiet: { ...LUONG_AN.chi_tiet, lop: [LUONG_AN.chi_tiet.lop[1]], ngoai_package: [] } }]
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
    case 'fn_ta_doi_chieu': return ok(dong.concat(KHAC).filter((r) => r.ngay >= a.p_tu && r.ngay <= (a.p_den ?? a.p_tu)))
    case 'fn_ta_buoi_thieu_cong': return ok([
      { loai: 'buoi', ngay: congNgay(HN, -2), lop_id: 'l9a1', ten: '9A1', gio_bat_dau: '19:30:00', gio_ket_thuc: '21:30:00', buoi_hoc_id: 'bt1', ca_bo_tro_id: null, nguoi_phu_trach: 'Lê Dũng' },
      { loai: 'ca', ngay: congNgay(HN, -2), lop_id: null, ten: 'Trực bổ trợ Toán 6', gio_bat_dau: '17:00:00', gio_ket_thuc: '18:00:00', buoi_hoc_id: null, ca_bo_tro_id: 'ct1', nguoi_phu_trach: 'Trần Bình' },
      { loai: 'buoi', ngay: '2026-10-05', lop_id: 'l6s1', ten: '6S1', gio_bat_dau: '18:00:00', gio_ket_thuc: '19:30:00', buoi_hoc_id: 'bt2', ca_bo_tro_id: null, nguoi_phu_trach: null }])
    case 'fn_ta_duyet_cong': {
      const ids = [...(a.p_ca ?? []), ...(a.p_viec ?? [])]
      if (a.p_ket_qua === 'da_duyet' && dong.concat(KHAC).some((r) => ids.includes(r.id) && r.loai_dong === 'ca' && !r.ra_at && !r.ra_chot)) return loi('Có ca chưa có giờ ra — chốt giờ trước khi duyệt')
      dong.concat(KHAC).forEach((r) => { if (ids.includes(r.id)) { r.duyet = a.p_ket_qua; r.ly_do_duyet = a.p_ly_do } }); return ok(ids.length)
    }
    case 'fn_ta_chot_gio': { const c = dong.concat(KHAC).find((r) => r.id === a.p_id); if (c) { c.vao_chot = a.p_vao; c.ra_chot = a.p_ra; c.co = c.co.filter((x) => x !== 'quen_ra') } return ok(null) }
    case 'fn_ta_cham_cong_nhap_ho': case 'fn_ta_nhap_ho_viec': return ok('nh')
    case 'fn_ta_bang_don_gia': return ok(GIA)
    case 'fn_ta_dat_don_gia': { GIA.unshift({ ma: a.p_ma, ten: a.p_ten ?? a.p_ma, si_tu: a.p_si_tu, si_den: a.p_si_den, gia_tri: a.p_gia, don_vi: 'đ/giờ', hieu_luc_tu: a.p_hieu_luc_tu, dang_hieu_luc: a.p_hieu_luc_tu <= HN, ghi_chu: a.p_ghi_chu, nguoi_dat: 'Nguyễn Xem Thử', dat_at: '' }); return ok('g') }
    case 'fn_ta_luong_ky': { const ky = a.p_ky.slice(0, 8) + '01', h = dangChot(ky), them = { da_chot: !!h, lan: h?.lan ?? null, chot_at: h?.chot_at ?? null }
      return ok((a.p_ns ? [LUONG_AN] : BANG()).map((r) => ({ ...r, ...them }))) }
    case 'fn_ta_ky_trang_thai': return ok(kyTT(a.p_ky.slice(0, 8) + '01'))
    case 'fn_ta_chot_ky': { const ky = a.p_ky.slice(0, 8) + '01', t = kyTT(ky)
      if (t.da_chot) return loi('Tháng đã chốt'); if (!t.co_the_chot) return loi('Chưa đủ điều kiện chốt (xem thử: thêm &chot=1)')
      const ds = (CHOT[ky] ??= []); ds.push({ lan: ds.length + 1, chot_at: new Date().toISOString(), chot_boi: 'Nguyễn Xem Thử', tong_net: 1792000, so_ta: 2, ghi_chu: a.p_ghi_chu ?? '', mo_lai_at: null, mo_lai_boi: null, ly_do_mo_lai: null })
      return ok(ds.length) }
    case 'fn_ta_mo_lai_ky': { const h = dangChot(a.p_ky.slice(0, 8) + '01'); if (!h) return loi('Tháng chưa chốt'); if (!String(a.p_ly_do ?? '').trim()) return loi('Mở lại kỳ phải ghi lý do')
      h.mo_lai_at = new Date().toISOString(); h.mo_lai_boi = 'Nguyễn Xem Thử'; h.ly_do_mo_lai = a.p_ly_do; return ok(null) }
    default: return loi('xem thử: chưa giả lập ' + fn)
  }
}
const chain = (rows: unknown[]) => { const b: any = { select: () => b, eq: () => b, order: () => b, limit: () => b, then: (r: any, j: any) => ok(rows).then(r, j) }; return b }
;(supabase as any).from = (t: string) => chain(t === 'ta_loai_viec' ? LOAI : t === 'lop' ? LOP : t === 'nhan_su' ? [{ id: 'me', ho_ten: 'Nguyễn Xem Thử', anh_url: null }, { id: 'b', ho_ten: 'Trần Bình', anh_url: null }] : [])
useStore.setState({ quyen: { laAdmin: true, chucNang: [], chiXem: [] } } as any)
const MAN = new URLSearchParams(location.search).get('man')

function Xem() {
  const [, setK] = useState(0)
  if (MAN === 'duyet' || MAN === 'luong') return <div className="h-[100dvh] bg-slate-50">{MAN === 'duyet' ? <DuyetCongScreen /> : <LuongTaScreen />}</div>
  return (
    <div className="min-h-[100dvh]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <CongTA nsId="me" onBack={() => setK((k) => k + 1)} />
    </div>
  )
}
createRoot(document.getElementById('root')!).render(<StrictMode><Xem /></StrictMode>)
