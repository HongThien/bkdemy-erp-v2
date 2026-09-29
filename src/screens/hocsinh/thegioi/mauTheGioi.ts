// Dữ liệu GIẢ cho trang xem mẫu Thế giới BK (hs.html?xem=gami&man=the_gioi) — cùng hình dạng dữ liệu fn_the_gioi_kenh / fn_the_gioi_chi_tiet trả về.
import type { KenhTG, TinTG, BanBeTG, GoiYTG, DanhMucTG, KhenTG, NguoiTG, BinhLuanTG, ChiTietTG, ChoKhoe } from '../../../lib/thegioi'

const truoc = (phut: number) => new Date(Date.now() - phut * 60000).toISOString()
const ng = (ten: string, lop: string, id = ten): NguoiTG => ({ an: false, id, ten, lop })

const KHANG = ng('Nguyễn Minh Khang', '9A1'), HA = ng('Nguyễn Thu Hà', '9A1'), BINH = ng('Đỗ Gia Bình', '9A2'), TUAN = ng('Lê Minh Tuấn', '9A1')
const MAI_ANH = ng('Trần Mai Anh', '8A2'), DUC = ng('Phan Anh Đức', '7S2'), CHAU = ng('Lê Bảo Châu', '8A1'), EM = ng('Vũ Minh Anh', '9A1', 'em')
const LINH = ng('Phạm Linh', '9A1')

const ICON: Record<string, [string, string]> = {
  thich: ['👍', 'Thích'], tim: ['❤️', 'Yêu thích'], lua: ['🔥', 'Cháy'], vo_tay: ['👏', 'Vỗ tay'], de_goat: ['🐐', 'GOAT'], no_nao: ['🤯', 'Nổ não'],
  cup: ['🏆', 'Vô địch'], tram_diem: ['💯', '100 điểm'], ten_lua: ['🚀', 'Bay cao'], set: ['⚡', 'Tốc độ'], co_bap: ['💪', 'Chăm'], nao: ['🧠', 'Não to'],
  ngau: ['😎', 'Ngầu'], chao: ['🫡', 'Bái phục'], bai_su: ['🙇', 'Bái sư'], kim_cuong: ['💎', 'Hàng hiếm'], ngoi_sao: ['🌟', 'Ngôi sao'],
  an_mung: ['🥳', 'Ăn mừng'], hong_tam: ['🎯', 'Chuẩn'], co_4_la: ['🍀', 'Xin vía'], tim_tay: ['🫶', 'Thương'], bat_tay: ['🤝', 'Tôn trọng'],
}
let soBl = 0
const bl = (nguoi: NguoiTG, loai: 'cau' | 'sticker', noi_dung: string, phut = 20, la_em = false): BinhLuanTG =>
  ({ id: `bl${++soBl}`, at: truoc(phut), loai, ma: loai === 'sticker' ? 's_x' : 'c_x', noi_dung, nguoi, la_em, an: false })
const KHEN_0: KhenTG = { dem: [], tong: 0, ten: [], cua_toi: null, so_bl: 0, bl: null, thay_co: [] }
const khen = (dem: [string, number][], ten: NguoiTG[], so_bl: number, xemTruoc: BinhLuanTG | null, thayCo: string[] = [], cuaToi?: string): KhenTG => ({
  dem: dem.map(([ma, so]) => ({ icon: ICON[ma][0], ma, nhan: ICON[ma][1], so })), tong: dem.reduce((s, x) => s + x[1], 0),
  ten: ten.map((n) => ({ la_em: n === EM, nguoi: n })), cua_toi: cuaToi ? { icon: ICON[cuaToi][0], icon_ma: cuaToi, nhan: ICON[cuaToi][1] } : null,
  so_bl, bl: xemTruoc, thay_co: thayCo,
})
const tin = (x: Partial<TinTG> & Pick<TinTG, 'khoa' | 'tang' | 'nhom' | 'kieu'>): TinTG => ({
  mon: 'Toán', at: truoc(30), lop: '9A1', chi_tiet: {}, nguoi: null, doi: null, cua_toi: false, la_ban: false, khen: KHEN_0, ...x,
})

const S_RANK = tin({ khoa: 'giai_thang:1', tang: 'S', nhom: 'hoc', kieu: 'giai_thang', at: truoc(120), ghim: true, nguoi: KHANG, la_ban: true,
  chi_tiet: { loai_giai: 'xuat_sac', thang: '2026-09-01' },
  khen: khen([['lua', 12], ['thich', 8], ['de_goat', 5]], [EM, HA], 7, bl(BINH, 'cau', 'Đỉnh nóc, kịch trần, bay phấp phới 🚀', 35), ['Lan'], 'lua') })
const S_TRA_SUA = tin({ khoa: 'tra_sua:1', tang: 'S', nhom: 'mayman', kieu: 'tra_sua', at: truoc(300), ghim: true, lop: '7S2',
  nguoi: { an: true, ma: 'HS0412' }, chi_tiet: { game: 'mo_ruong' }, khen: khen([['co_4_la', 7], ['an_mung', 2]], [LINH], 2, bl(LINH, 'sticker', '🧋', 50)) })
const A_ET = tin({ khoa: 'et:1', tang: 'A', nhom: 'hoc', kieu: 'et_cao', at: truoc(50), lop: '9A2', nguoi: BINH, la_ban: true, chi_tiet: { diem: 10, so_cau: 8, ngay: '2026-09-29' }, khoe: { dang_at: truoc(20), cau: 'Cày mãi mới được đó 😤', la_em: false },
  khen: khen([['tim', 6], ['lua', 4]], [HA, TUAN], 2, bl(HA, 'cau', 'Xin vía học giỏi 🍀', 12)) })
const A_HA = tin({ khoa: 'nhat_buoi:1', tang: 'A', nhom: 'hoc', kieu: 'nhat_buoi', nguoi: HA, la_ban: true, chi_tiet: { ngay: '2026-09-29' },
  khen: khen([['tram_diem', 3], ['thich', 2]], [KHANG], 1, bl(KHANG, 'cau', '10 điểm không có nhưng', 15)) })
const A_DUC = tin({ khoa: 'nhat_buoi:2', tang: 'A', nhom: 'hoc', kieu: 'nhat_buoi', lop: '7S2', nguoi: DUC, chi_tiet: { ngay: '2026-09-29' } })
const A_CHAU = tin({ khoa: 'nhat_buoi:3', tang: 'A', nhom: 'hoc', kieu: 'nhat_buoi', lop: '8A1', mon: 'KHTN', nguoi: CHAU, chi_tiet: { ngay: '2026-09-29' },
  khen: khen([['tim', 4]], [MAI_ANH], 0, null, [], 'tim') })
const A_DOI = tin({ khoa: 'ban_qua:1:2', tang: 'A', nhom: 'game', kieu: 'doi_thang', chi_tiet: { doi: 2, game: 'ban_qua', ngay: '2026-09-29' },
  doi: { so: 5, thanh_vien: [TUAN, HA, LINH, EM] }, cua_toi: true,
  khen: khen([['lua', 9], ['bat_tay', 4]], [TUAN, BINH], 3, bl(TUAN, 'cau', 'Carry cả team luôn', 25)) })
const A_HH = tin({ khoa: 'huy_hieu:1', tang: 'A', nhom: 'hoc', kieu: 'huy_hieu', lop: '8A2', nguoi: MAI_ANH, chi_tiet: { key: 'athena', ten: 'Athena', sao: 3 } })
const A_BINH_HH = tin({ khoa: 'huy_hieu:2', tang: 'A', nhom: 'hoc', kieu: 'huy_hieu', lop: '9A2', nguoi: BINH, la_ban: true, chi_tiet: { key: 'helios', ten: 'Helios', sao: 2 } })
const B_TUAN = tin({ khoa: 'no_luc:tuan', tang: 'B', nhom: 'noluc', kieu: 'tu_luyen', at: truoc(40), nguoi: TUAN, la_ban: true, chi_tiet: { so_dung: 72 }, khoe: { dang_at: truoc(35), cau: 'Chưa phải giới hạn đâu 🚀', la_em: false },
  khen: khen([['co_bap', 2]], [HA], 0, null) })
const B_BINH = tin({ khoa: 'no_luc:binh', tang: 'B', nhom: 'noluc', kieu: 'tu_luyen', at: truoc(90), lop: '9A2', nguoi: BINH, la_ban: true, chi_tiet: { so_dung: 112 } })
const B_EM = tin({ khoa: 'no_luc:em', tang: 'B', nhom: 'noluc', kieu: 'tu_luyen', at: truoc(15), nguoi: EM, cua_toi: true, chi_tiet: { so_dung: 52 },
  khen: khen([['co_bap', 2]], [TUAN], 1, bl(TUAN, 'cau', 'Chăm thế này ai đỡ nổi 💪', 10)) })

const TOI = { hien: 'ten' as const, so_ban: 5, loi_moi: 2 }
export const KENH_TG: KenhTG = { toi: TOI, tin: [S_RANK, A_ET, B_TUAN, S_TRA_SUA], gop: [
  { kieu: 'nhat_buoi', so: 11, so_bl: 4, ds: [A_HA, A_DUC, A_CHAU] },
  { kieu: 'doi_thang', so: 6, ds: [A_DOI] },
  { kieu: 'huy_hieu', so: 23, ds: [A_BINH_HH, A_HH] },
] }
export const KENH_BAN: KenhTG = { toi: TOI, tin: [S_RANK, A_HA, A_BINH_HH, B_TUAN, B_BINH], gop: [] }
export const KENH_LOP: KenhTG = { toi: TOI, tin: [S_RANK, A_HA, A_ET, A_DOI, B_TUAN, B_EM], gop: [] }
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
// Khớp dữ liệu nạp ở mig 202609290108 + 202609290148 (rút gọn).
export const DANH_MUC: DanhMucTG[] = [
  ...Object.entries(ICON).map(([ma, [noi_dung, nhan]], i) => ({ ma, loai: 'icon' as const, noi_dung, nhan, nhom: ['chung'], thu_tu: i + 1 })),
  // ĐỦ câu như DB (sinh từ dữ liệu nạp ở mig 202609290108 · 202609290148 · 202609291239)
  ...([["c01","Đỉnh nóc, kịch trần, bay phấp phới 🚀",["chung"]],
    ["c02","Đỉnh của chóp",["chung"]],
    ["c03","Quá dữ, quá xịn",["chung"]],
    ["c04","Khét lẹt luôn 🔥",["chung"]],
    ["c05","Hết nước chấm",["chung"]],
    ["c07","GOAT là đây chứ đâu 🐐",["chung"]],
    ["c08","Slay quá trời",["chung"]],
    ["c09","Keo lỳ tái châu",["chung"]],
    ["c10","Gét gô! Let's go!",["chung"]],
    ["c11","Chấn động BK 😱",["chung"]],
    ["c13","Idol của em đây rồi",["hoc"]],
    ["c14","Cho xin bí kíp với 🙏",["hoc"]],
    ["c15","Xin vía học giỏi 🍀",["hoc"]],
    ["c16","Bái sư, nhận đệ tử không ạ 🙇",["hoc"]],
    ["c17","Thần đồng BK xuất hiện",["hoc"]],
    ["c18","Trùm cuối lộ diện",["hoc"]],
    ["c19","Tấm gương sáng cho thế hệ trẻ ✨",["hoc"]],
    ["c20","Chăm thế này ai đỡ nổi 💪",["noluc"]],
    ["c21","Bền bỉ như Tây Du Ký",["noluc"]],
    ["c22","Streak này phải đóng khung",["noluc"]],
    ["c23","Cày không biết mệt",["noluc"]],
    ["c24","Tiến bộ thấy rõ luôn 🚀",["noluc"]],
    ["c25","Từ từ mà chắc, chất lượng",["noluc"]],
    ["c26","Nhân phẩm vô cực 🍀",["mayman"]],
    ["c27","Carry cả team luôn",["game"]],
    ["c28","Bắn phát ăn luôn 🎯",["game"]],
    ["c29","Trà sữa đâu, khao đi! 🧋",["mayman"]],
    ["c31","Thua Gia Cát Lượng đúng cây quạt 🪭",["hoc"]],
    ["c32","Cổ điển, tôn trọng 🫡",["noluc"]],
    ["c33","10 điểm không có nhưng",["chung"]],
    ["c34","Tuyệt đối điện ảnh 🎬",["game"]],
    ["c35","Bốc trúng sít rịt",["mayman"]],
    ["c36","8386 phát tài phát lộc 🍀",["mayman"]],
    ["c37","Vuýp quá trời",["chung"]],
    ["c38","Kiwi kiwi, xịn xò",["chung"]],
    ["c39","Gooo! 🚀",["chung"]],
    ["c40","Đỉnh thật sự, no cap",["chung"]],
    ["c41","Stan cậu luôn rồi",["hoc"]],
    ["c42","Mãi mận mãi keo 🤝",["game","noluc"]],
    ["c60","Cảm ơn mọi người nhiều 🫶",["cam_on"]],
    ["c61","Nhờ vía mọi người đó 🍀",["cam_on"]],
    ["c62","Hẹn gặp lại trên top 😎",["cam_on"]],
    ["c63","Lần sau sẽ còn đỉnh hơn 🚀",["cam_on"]],
    ["c64","Học cùng tớ đi, lên top cùng nhau 🤝",["cam_on"]],
    ["k01","Cày mãi mới được đó 😤",["khoe"]],
    ["k02","Nhẹ nhàng thôi mà 😎",["khoe"]],
    ["k03","Hôm nay tớ hơi đỉnh 🔥",["khoe"]],
    ["k04","Không ngờ luôn á 😳",["khoe"]],
    ["k05","Công sức cả tuần đây 💪",["khoe"]],
    ["k06","Lần đầu làm được luôn! 🥳",["khoe"]],
    ["k07","Chia vía cho mọi người nè 🍀",["khoe"]],
    ["k08","Cảm ơn thầy cô nhiều 🫡",["khoe"]],
    ["k09","Chưa phải giới hạn đâu 🚀",["khoe"]],
    ["k10","Ai học cùng tớ không? 🤝",["khoe"]],
    ["k11","Khoe xíu thôi nha 🤭",["khoe"]],
    ["k12","Cố gắng được đền đáp rồi ✨",["khoe"]]] as [string, string, string[]][])
    .map(([ma, noi_dung, nhom], i) => ({ ma, loai: 'cau' as const, noi_dung, nhom, thu_tu: 100 + i })),
  ...['🔥', '🐐', '🏆', '🚀', '🤯', '🫡', '🙇', '🥳', '💯', '🍀', '🧋', '💪'].map((noi_dung, i) => ({ ma: `s_${i}`, loai: 'sticker' as const, noi_dung, nhom: ['chung'], thu_tu: i + 1 })),
]
export const TIN_MO = S_RANK
export const CHI_TIET: ChiTietTG = {
  chu_tin: false, khen: S_RANK.khen,
  tha: [
    { icon: '🔥', icon_ma: 'lua', nhan: 'Cháy', la_em: true, la_ban: false, nguoi: EM },
    { icon: '👍', icon_ma: 'thich', nhan: 'Thích', la_em: false, la_ban: true, nguoi: HA },
    { icon: '🐐', icon_ma: 'de_goat', nhan: 'GOAT', la_em: false, la_ban: true, nguoi: TUAN },
    { icon: '🔥', icon_ma: 'lua', nhan: 'Cháy', la_em: false, la_ban: false, nguoi: BINH },
    { icon: '👍', icon_ma: 'thich', nhan: 'Thích', la_em: false, la_ban: false, nguoi: MAI_ANH },
    { icon: '🔥', icon_ma: 'lua', nhan: 'Cháy', la_em: false, la_ban: false, nguoi: { an: true, ma: 'HS0233' } },
  ],
  bl: [
    bl(HA, 'cau', 'Xin vía học giỏi 🍀', 110),
    bl(TUAN, 'sticker', '🐐', 90),
    bl(LINH, 'cau', 'Thần đồng BK xuất hiện', 70),
    bl(BINH, 'cau', 'Đỉnh nóc, kịch trần, bay phấp phới 🚀', 35),
    bl(KHANG, 'cau', 'Cảm ơn mọi người nhiều 🫶', 20),
    bl(EM, 'sticker', '🔥', 5, true),
  ],
}

export const CHO_KHOE: ChoKhoe = { gioi_han: 3, da_khoe_hom_nay: 1, tin: [
  { khoa: 'et:em', tang: 'A', nhom: 'hoc', kieu: 'et_cao', mon: 'Toán', at: truoc(60), lop: '9A1', chi_tiet: { diem: 10, so_cau: 6, ngay: '2026-09-29' } },
  { khoa: 'tu_luyen:em', tang: 'B', nhom: 'noluc', kieu: 'tu_luyen', mon: 'Toán', at: truoc(300), lop: '9A1', chi_tiet: { so_dung: 58, ngay: '2026-09-28' } },
] }
