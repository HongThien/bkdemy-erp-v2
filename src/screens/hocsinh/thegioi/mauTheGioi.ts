// Dữ liệu GIẢ cho trang xem mẫu Thế giới BK (hs.html?xem=gami&man=the_gioi) — cùng hình dạng dữ liệu fn_the_gioi_kenh trả về.
import type { KenhTG, TinTG, BanBeTG, GoiYTG, DanhMucTG, KhenTG, NguoiTG } from '../../../lib/thegioi'

const truoc = (phut: number) => new Date(Date.now() - phut * 60000).toISOString()
const ng = (ten: string, lop: string, id = ten): NguoiTG => ({ an: false, id, ten, lop })
const KHEN_0: KhenTG = { dem: [], tong: 0, cau: [], cua_toi: null, thay_co: [] }
const khen = (dem: [string, string, number][], cau: [string, NguoiTG][], thayCo: string[] = []): KhenTG => ({
  dem: dem.map(([icon, ma, so]) => ({ icon, ma, so })), tong: dem.reduce((s, x) => s + x[2], 0),
  cau: cau.map(([c, n]) => ({ cau: c, nguoi: n, la_em: false })), cua_toi: null, thay_co: thayCo,
})
const tin = (x: Partial<TinTG> & Pick<TinTG, 'khoa' | 'tang' | 'nhom' | 'kieu'>): TinTG => ({
  mon: 'Toán', at: truoc(30), lop: '9A1', chi_tiet: {}, nguoi: null, doi: null, cua_toi: false, la_ban: false, khen: KHEN_0, ...x,
})

const KHANG = ng('Nguyễn Minh Khang', '9A1'), HA = ng('Nguyễn Thu Hà', '9A1'), BINH = ng('Đỗ Gia Bình', '9A2'), TUAN = ng('Lê Minh Tuấn', '9A1')
const MAI_ANH = ng('Trần Mai Anh', '8A2'), DUC = ng('Phan Anh Đức', '7S2'), CHAU = ng('Lê Bảo Châu', '8A1'), EM = ng('Vũ Minh Anh', '9A1', 'em')

const S_RANK = tin({ khoa: 'giai_thang:1', tang: 'S', nhom: 'hoc', kieu: 'giai_thang', at: truoc(120), ghim: true, nguoi: KHANG, la_ban: true,
  chi_tiet: { loai_giai: 'xuat_sac', thang: '2026-09-01' },
  khen: khen([['🔥', 'lua', 12], ['👏', 'vo_tay', 8], ['🐐', 'de_goat', 5]], [['Đỉnh nóc, kịch trần, bay phấp phới 🚀', BINH], ['Xin vía học giỏi 🍀', HA]], ['Lan']) })
const S_TRA_SUA = tin({ khoa: 'tra_sua:1', tang: 'S', nhom: 'mayman', kieu: 'tra_sua', at: truoc(300), ghim: true, lop: '7S2',
  nguoi: { an: true, ma: 'HS0412' }, chi_tiet: { game: 'mo_ruong' }, khen: khen([['🍀', 'co_4_la', 7], ['🥳', 'an_mung', 2]], [['Nhân phẩm vô cực 🍀', ng('Phạm Linh', '9A1')]]) })
const A_HA = tin({ khoa: 'nhat_buoi:1', tang: 'A', nhom: 'hoc', kieu: 'nhat_buoi', nguoi: HA, la_ban: true, chi_tiet: { ngay: '2026-09-29' }, khen: khen([['💯', 'tram_diem', 5]], [['10 điểm không có nhưng', KHANG]]) })
const A_DUC = tin({ khoa: 'nhat_buoi:2', tang: 'A', nhom: 'hoc', kieu: 'nhat_buoi', lop: '7S2', nguoi: DUC, chi_tiet: { ngay: '2026-09-29' } })
const A_CHAU = tin({ khoa: 'nhat_buoi:3', tang: 'A', nhom: 'hoc', kieu: 'nhat_buoi', lop: '8A1', mon: 'KHTN', nguoi: CHAU, chi_tiet: { ngay: '2026-09-29' } })
const A_DOI = tin({ khoa: 'ban_qua:1:2', tang: 'A', nhom: 'game', kieu: 'doi_thang', chi_tiet: { doi: 2, game: 'ban_qua', ngay: '2026-09-29' },
  doi: { so: 5, thanh_vien: [TUAN, HA, ng('Phạm Linh', '9A1'), EM] }, khen: khen([['🔥', 'lua', 9], ['🤝', 'bat_tay', 4]], [['Carry cả team luôn', TUAN]]) })
const A_HH = tin({ khoa: 'huy_hieu:1', tang: 'A', nhom: 'hoc', kieu: 'huy_hieu', lop: '8A2', nguoi: MAI_ANH, chi_tiet: { key: 'athena', ten: 'Athena', sao: 3 } })
const A_BINH_HH = tin({ khoa: 'huy_hieu:2', tang: 'A', nhom: 'hoc', kieu: 'huy_hieu', lop: '9A2', nguoi: BINH, la_ban: true, chi_tiet: { key: 'helios', ten: 'Helios', sao: 2 } })
const B_TUAN = tin({ khoa: 'no_luc:tuan', tang: 'B', nhom: 'noluc', kieu: 'no_luc', at: truoc(40), nguoi: TUAN, la_ban: true, chi_tiet: { so_bai: 3, so_thu_thach: 1 }, khen: khen([['💪', 'co_bap', 2]], []) })
const B_BINH = tin({ khoa: 'no_luc:binh', tang: 'B', nhom: 'noluc', kieu: 'no_luc', at: truoc(90), lop: '9A2', nguoi: BINH, la_ban: true, chi_tiet: { so_bai: 5, so_thu_thach: 0 } })
const B_EM = tin({ khoa: 'no_luc:em', tang: 'B', nhom: 'noluc', kieu: 'no_luc', at: truoc(15), nguoi: EM, cua_toi: true, chi_tiet: { so_bai: 2, so_thu_thach: 1 },
  khen: khen([['💪', 'co_bap', 2]], [['Chăm thế này ai đỡ nổi 💪', TUAN]]) })

const TOI = { hien: 'ten' as const, so_ban: 5, loi_moi: 2 }
export const KENH_TG: KenhTG = { toi: TOI, tin: [S_RANK, S_TRA_SUA], gop: [
  { kieu: 'nhat_buoi', so: 11, ds: [A_HA, A_DUC, A_CHAU] },
  { kieu: 'doi_thang', so: 6, ds: [A_DOI] },
  { kieu: 'huy_hieu', so: 23, ds: [A_BINH_HH, A_HH] },
] }
export const KENH_BAN: KenhTG = { toi: TOI, tin: [S_RANK, A_HA, A_BINH_HH, B_TUAN, B_BINH], gop: [] }
export const KENH_LOP: KenhTG = { toi: TOI, tin: [S_RANK, A_HA, A_DOI, B_TUAN, B_EM], gop: [] }
export const BAN_BE: BanBeTG = {
  ban: [KHANG, HA, BINH, TUAN, ng('Hoàng Vy', '8A2')],
  loi_moi: [{ id: 'm1', nguoi: ng('Phạm Quang Huy', '9A2'), ban_chung: 3 }, { id: 'm2', nguoi: ng('Ngô Khánh Linh', '10A1'), ban_chung: 1 }],
  da_gui: [],
}
export const GOI_Y: GoiYTG[] = [
  { id: 'g1', nguoi: ng('Trần Đức Long', '9A1'), ly_do: 'Cùng lớp 9A1', trang_thai: null },
  { id: 'g2', nguoi: ng('Bùi Ngọc Mai', '9A1'), ly_do: 'Cùng lớp 9A1', trang_thai: 'da_gui' },
  { id: 'g3', nguoi: ng('Vũ Hải Nam', '9A3'), ly_do: '4 bạn chung', trang_thai: null },
]
// Khớp dữ liệu nạp ở mig 202609290108 (rút gọn).
export const DANH_MUC: DanhMucTG[] = [
  ...[['lua', '🔥'], ['vo_tay', '👏'], ['tram_diem', '💯'], ['cup', '🏆'], ['ten_lua', '🚀'], ['set', '⚡'], ['de_goat', '🐐'], ['co_bap', '💪'], ['nao', '🧠'], ['no_nao', '🤯'],
    ['ngau', '😎'], ['chao', '🫡'], ['bai_su', '🙇'], ['kim_cuong', '💎'], ['ngoi_sao', '🌟'], ['an_mung', '🥳'], ['hong_tam', '🎯'], ['co_4_la', '🍀'], ['tim_tay', '🫶'], ['bat_tay', '🤝']]
    .map(([ma, noi_dung], i) => ({ ma, loai: 'icon' as const, noi_dung, nhom: ['chung'], thu_tu: i })),
  ...([['c01', 'Đỉnh nóc, kịch trần, bay phấp phới 🚀', 'chung'], ['c02', 'Đỉnh của chóp', 'chung'], ['c13', 'Idol của em đây rồi', 'hoc'], ['c15', 'Xin vía học giỏi 🍀', 'hoc'],
    ['c17', 'Thần đồng BK xuất hiện', 'hoc'], ['c31', 'Thua Gia Cát Lượng đúng cây quạt 🪭', 'hoc'], ['c41', 'Stan cậu luôn rồi', 'hoc'], ['c33', '10 điểm không có nhưng', 'chung'],
    ['c20', 'Chăm thế này ai đỡ nổi 💪', 'noluc'], ['c23', 'Cày không biết mệt', 'noluc'], ['c27', 'Carry cả team luôn', 'game'], ['c26', 'Nhân phẩm vô cực 🍀', 'mayman'], ['c39', 'Gooo! 🚀', 'chung']] as const)
    .map(([ma, noi_dung, nhom], i) => ({ ma, loai: 'cau' as const, noi_dung, nhom: [nhom], thu_tu: 100 + i })),
]
export const TIN_DANG_KHEN = S_RANK
