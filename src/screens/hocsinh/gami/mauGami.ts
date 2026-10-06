// ============================================================================
// mauGami.ts — DỮ LIỆU GIẢ cho trang xem mẫu hs.html?xem=gami (mọi màn gamification × mọi trạng thái trong đơn design).
// Số lấy đúng như design/DON-HANG-GAMI-HS.md để ảnh chụp gửi ChatGPT khớp đơn. KHÔNG dùng ở màn thật.
// Cấu hình (ngưỡng bậc, cấp chặng, sao/tháng) chép theo DB 29/09: nhiem_vu_cau_hinh Toán · rank_bac × 3.000 · huy_hieu_thang_sao.
// ============================================================================
import type { NhiemVuCuaToi } from '../../../lib/nhiemvu'
import type { Album, AlbumHuyHieu } from '../../../lib/huyhieu'
import type { RankCuaToi } from '../../../lib/rank'
import type { HoSoGami } from '../../../lib/hosoGami'
import { BAC } from './hinh'

// ── Nhiệm vụ (hệ mới 06/10: lượt Luyện dạng yếu đạt · ĐHT) ─────────────────────
const CAU_HINH = {
  dat_ti_le: 0.7, lan_ngay: 4, exp_luot: 20, dht_luot: 20, w1_ngay: 5, w1_exp: 100, w1_dht: 50, w2_luot: 12, w2_exp: 100, w2_dht: 50,
  m1_ngay: 20, m1_exp: 300, m1_dht: 200, tran_exp: 2000, dht_so_du_max: 6000,
}
export const NV_GIUA_THANG: NhiemVuCuaToi = {
  mon: 'Toán', mo: true, ym: '2026-10', tuan_so: 4, cau_hinh: CAU_HINH,
  ngay: { luot_hom_nay: 2, con_lai: 2, luot_thang: 38 },
  tuan: { ngay_co_luot: 3, luot: 7, w1_xong: false, w2_xong: false },
  thang: { ngay_co_luot: 14, m1_xong: false },
  exp_thang: 1160, dht_thang: 1000,
  dht: { so_du: 1840, tran: 6000, tong_kiem: 2640, tong_tieu: 800, mat_do_vuot_tran: 0, kiem_thang: 1000 },
  vong_quay: { du: true, da_quay: false },
}
export const NV_DAU_THANG: NhiemVuCuaToi = {
  mon: 'Toán', mo: true, ym: '2026-11', tuan_so: 1, cau_hinh: CAU_HINH,
  ngay: { luot_hom_nay: 0, con_lai: 4, luot_thang: 0 },
  tuan: { ngay_co_luot: 0, luot: 0, w1_xong: false, w2_xong: false },
  thang: { ngay_co_luot: 0, m1_xong: false },
  exp_thang: 0, dht_thang: 0,
  dht: { so_du: 1840, tran: 6000, tong_kiem: 2640, tong_tieu: 800, mat_do_vuot_tran: 0, kiem_thang: 0 },
  vong_quay: { du: false, da_quay: false },
}
export const NV_CHUA_MO: NhiemVuCuaToi = { mon: 'Toán', mo: false, bat_dau: '2026-10-06' }

// ── Album ────────────────────────────────────────────────────────────────────
const THANG_SAO: Album['thang_sao'] = [
  { sao: 1, so_thang: 1, loai: 'chuan', ban_cung: false, exp: 0 }, { sao: 2, so_thang: 2, loai: 'chuan', ban_cung: false, exp: 0 },
  { sao: 3, so_thang: 4, loai: 'chuan', ban_cung: false, exp: 100 }, { sao: 4, so_thang: 6, loai: 'hoan_hao', ban_cung: true, exp: 200 },
  { sao: 5, so_thang: 9, loai: 'hoan_hao', ban_cung: true, exp: 300 },
]
const HH: [string, string, string, string][] = [
  ['helios', 'Helios', 'Chuyên cần — đi học không nghỉ', 'Thần Mặt Trời — ngày nào cũng mọc, chưa từng nghỉ'],
  ['chronos', 'Chronos', 'Nộp BTVN đủ, đúng hạn', 'Thần Thời Gian'],
  ['athena', 'Athena', 'Làm tốt bài ET trên lớp', 'Nữ thần Trí Tuệ'],
  ['zeus', 'Zeus', 'MT top khối', 'Vua các vị thần, đứng trên đỉnh Olympus'],
  ['phoenix', 'Phoenix', 'Hạng MT bứt phá so với đầu năm', 'Phượng hoàng tái sinh từ tro, bay vút lên'],
  ['hercules', 'Hercules', 'Vượt Thử thách mỗi ngày', '12 kỳ công — 12 thử thách'],
  ['hephaestus', 'Hephaestus', 'Lấp lỗ: dạng yếu → đạt', 'Thần thợ rèn — rèn lại chỗ hỏng'],
  ['nike', 'Nike', 'Top Bảng đua tháng', 'Nữ thần Chiến Thắng'],
]
const THANG = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01']
// n_chuan, n_hoan_hao, sao, số bạn khối có sao cao nhất
const TIEN: Record<string, [number, number, number, number]> = {
  helios: [5, 3, 3, 12], chronos: [3, 1, 2, 20], athena: [4, 4, 3, 9], zeus: [1, 0, 1, 4],
  phoenix: [0, 0, 0, 0], hercules: [6, 6, 4, 3], hephaestus: [2, 0, 1, 25], nike: [0, 0, 0, 0],
}
function hh(key: string, ten: string, ghi: string, chuyen: string, moi: boolean): AlbumHuyHieu {
  const [nc, nh, sao, ban] = moi ? [0, 0, 0, 0] : TIEN[key]
  return {
    key, ten, bieu_tuong: '', ghi_nhan: ghi, cau_chuyen: chuyen, n_chuan: nc, n_hoan_hao: nh, n_chuan_tam: moi ? 0 : 1, sao,
    dat: Array.from({ length: sao }, (_, i) => ({ sao: i + 1, lan: 1, dat_at: `2026-${String(8 + i).padStart(2, '0')}-10T09:00:00+07:00`, thang_chot: THANG[i], da_trao: i + 1 === 4 && key === 'hercules' ? false : i + 1 >= 4, so_ban_khoi: Math.max(1, ban * (sao - i)) })),
    lich_su: THANG.slice(0, moi ? 1 : 7).map((t, i) => ({ thang: t, chuan: i < nc ? true : i === 6 ? null : false, hoan_hao: i < nh ? true : i === 6 ? null : false, da_chot: i < 6 })),
    thang_nay: [
      { key: 'A1', ten: 'Đi học đủ mọi buổi', vai: 'chuan', ket_qua: 'dat' },
      { key: 'A2', ten: 'Nộp BTVN đúng hạn', vai: 'them', ket_qua: 'khong_dat' },
      { key: 'A6', ten: 'Thử thách 15 ngày', vai: 'them', ket_qua: 'khong_ap_dung' },
    ],
  }
}
const album = (moi: boolean): Album => ({
  mon: 'Toán', mua: '2026-27', thang: '2027-01', thang_cuoi: '2027-04', si_so_khoi: 54, thang_sao: THANG_SAO,
  huy_hieu: HH.map(([k, t, g, c]) => hh(k, t, g, c, moi)),
})
export const ALBUM_GIUA_NAM = album(false)
export const ALBUM_MOI = album(true)
export const SAO_MOI = { key: 'athena', ten: 'Athena', sao: 3, exp: 100, ban_cung: false }

// ── Rank ─────────────────────────────────────────────────────────────────────
const HE_SO = [0, 0.525, 1.4, 2.625, 4.025, 6.125, 7, 8.575, 9.45, 10.08]
export const NGUONG = HE_SO.map((h) => Math.round(h * 3000))
const BAC_DS = BAC.map((b, i) => ({ bac: b.bac, ten: b.ten, nguong: NGUONG[i] }))
const TEN = ['Nguyễn Minh Anh', 'Trần Gia Bảo', 'Lê Khánh Linh', 'Phạm Đức Huy', 'Vũ Thảo Nhi']
const LOP = ['7S2', '7A1', '7S1', '7A3', '7S2']
function rank(diem: number, bac: number, sao: number, hang: number, laToiTop: boolean): RankCuaToi {
  return {
    mon: 'Toán', khoi: '7', thang: '2026-10',
    toi: { diem_mua: diem, bac, ten_bac: BAC[bac - 1].ten, sao, nguong_bac: NGUONG[bac - 1], nguong_sau: bac < 10 ? NGUONG[bac] : null,
      ghe: bac === 9 ? 'God of War' : bac === 10 ? 'Supreme God' : null, hang_khoi: hang, so_em_khoi: 54, phong_do: null, ten_lop: '7S2' },
    top_mua: TEN.map((t, i) => ({ ho_ten: t, ten_lop: LOP[i], diem_mua: [29120, 22400, 19050, 13300, 9020][i], ten_bac: ['God of War', 'King', 'Legend', 'Hero', 'General'][i], sao: [0, 1, 2, 1, 2][i], hang: i + 1, la_toi: laToiTop && i === 0 })),
    dua_thang: diem ? { diem_thang: 1840, hang: 9, so_em_co_diem: 52, et: 720, btvn: 480, mt: 220, thu_thach: 420 } : null,
    top_dua_thang: diem ? TEN.map((t, i) => ({ ho_ten: t, ten_lop: LOP[i], diem: [2710, 2580, 2395, 2210, 2105][i], hang: i + 1, la_toi: false })) : [],
    bac: BAC_DS,
    thu_thach: { hom_nay: diem ? 20 : 0, tran_ngay: 30, thang: diem ? 420 : 0, tran_thang: 600 },
  }
}
export const RANK_CAPTAIN = rank(5290, 3, 2, 12, false)
export const RANK_NOVICE = rank(0, 1, 0, 54, false)
export const RANK_THAN = rank(29120, 9, 0, 1, true)

// ── Hồ sơ ────────────────────────────────────────────────────────────────────
function hoSo(moi: boolean, khoe: string[]): HoSoGami {
  const huy_hieu = HH.map(([k, t]) => ({ key: k, ten: t, sao: moi ? 0 : TIEN[k][2], sao_cao_nhat: moi ? 0 : TIEN[k][2] }))
  return {
    mon: 'Toán', mua: '2026-27', huy_hieu,
    tong_sao: huy_hieu.reduce((s, h) => s + h.sao, 0), tong_sao_toi_da: 40, ban_cung_da_nhan: moi ? 0 : 1,
    khoe: khoe.map((k, i) => ({ vi_tri: i + 1, key: k, ten: HH.find((h) => h[0] === k)![1], sao: TIEN[k][2] })),
  }
}
export const HOSO_KHA = hoSo(false, ['hercules', 'athena'])
export const HOSO_MOI = hoSo(true, [])
export const HOSO_THAN = hoSo(false, ['hercules', 'athena', 'helios'])
export const MONS_2 = [{ mon: 'Toán', ten_lop: '7S2', co_kho: true }, { mon: 'KHTN', ten_lop: '7K1', co_kho: true }]
