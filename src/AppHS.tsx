// AppHS — shell RIÊNG cho bundle hs.bkacademy.edu.vn (Thùy 21/08: "tách thành 1 subpage của BK
// như PH, làm nó thành webapp như phapp"). Y HỆT nhánh HS của App.tsx (session/hsId/must_change_
// password) nhưng KHÔNG import bất cứ gì thuộc màn staff (NhanSuHome/TopBar/useStore/phanquyen…)
// — mục tiêu: bundle build riêng (vite.config.hs.ts) không kéo theo code nội bộ, khỏi lộ ra domain
// công khai + nhẹ hơn nhiều so với app đầy đủ. KHÔNG có nhánh `hsId === null` (staff) — build này
// chỉ phục vụ HS, nhân sự vẫn dùng domain ERP nội bộ như cũ.
import { lazy, Suspense, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import HocSinhApp, { HomeCap1 } from './screens/hocsinh/HocSinhApp'
import { NutGopYNoi } from './screens/hocsinh/gopy/NutGopYNoi'
import DoiMatKhau from './screens/hocsinh/DoiMatKhau'
import HomeHS, { type HomeCard } from './screens/hocsinh/HomeHS'
import HomeHS912 from './screens/hocsinh/HomeHS912'
import { chonMonHS } from './lib/tuluyen'
import type { LichBoTro } from './lib/botro_yeu_ca'
import DanhSachHS, { type DsRow } from './screens/hocsinh/DanhSachHS'
import MayManHS from './screens/hocsinh/MayManHS'
import ThanhTuuHS from './screens/hocsinh/ThanhTuuHS'
import BaiTapGiaoHS from './screens/hocsinh/BaiTapGiaoHS'
import ThongTinHocTap, { _THEME_TTHT, BXHList } from './screens/hocsinh/ThongTinHocTap'
import SoTayHS, { type SoTayApi } from './screens/hocsinh/SoTayHS'
import type { SoTayCay, SoTayNoiDung } from './lib/sotay'
import type { CtTimRow } from './lib/sotayCongThuc'
import { getMyHocSinhId } from './lib/testonline'

// Mock SỔ TAY cho `?demo=sotay` — RPC thật cần HS đăng nhập (và migration đã áp), không xem được
// layout lúc đang build. Data giả cố ý có: 2 chủ đề, dạng đủ 3 mức độ khó, và lời giải mẫu CÓ
// LaTeX (kiểm MathText render $…$ đúng trong khung đọc).
const MOCK_CAY: SoTayCay = {
  mon: 'Toán', nhanh: null, khoi: '9', khoi_hs: '9', khoi_list: ['7', '8', '9'],
  so_dang: 5, thieu_ly_thuyet: 12,
  cay: [
    { ma: 'T109', ten: 'Phương trình và hệ phương trình', so_dang: 3, con: [
      { ma: 'T10901', ten: 'Phương trình bậc hai một ẩn', so_dang: 2, dangs: [
        { ma_dang: 'T1090101', ten_dang: 'Giải phương trình bậc hai bằng công thức nghiệm', muc_do: 2, nhom: 'co_ban', mo_ta_ngan: 'Áp dụng thẳng công thức nghiệm và biệt thức delta.' },
        { ma_dang: 'T1090102', ten_dang: 'Biện luận số nghiệm theo tham số m', muc_do: 4, nhom: 'nang_cao', mo_ta_ngan: 'Xét dấu biệt thức theo tham số.' },
      ] },
      { ma: 'T10902', ten: 'Hệ hai phương trình bậc nhất hai ẩn', so_dang: 1, dangs: [
        { ma_dang: 'T1090201', ten_dang: 'Giải hệ bằng phương pháp thế', muc_do: 3, nhom: 'trung_binh', mo_ta_ngan: null },
      ] },
    ] },
    { ma: 'T110', ten: 'Hàm số và đồ thị', so_dang: 2, con: [
      { ma: 'T11001', ten: 'Hàm số bậc nhất', so_dang: 2, dangs: [
        { ma_dang: 'T1100101', ten_dang: 'Vẽ đồ thị hàm số bậc nhất', muc_do: 1, nhom: 'co_ban', mo_ta_ngan: 'Xác định hai điểm rồi nối.' },
        { ma_dang: 'T1100102', ten_dang: 'Tìm điều kiện để hai đường thẳng song song', muc_do: 3, nhom: 'trung_binh', mo_ta_ngan: null },
      ] },
    ] },
  ],
}
// Thẻ công thức giả (CEO 03/10) — gõ "bayes", "nghiem", "delta" để thấy nhãn Công thức xếp trước Lý thuyết.
const MOCK_CT: CtTimRow[] = [
  { ma: 'CT12-XS-04', ten: 'Công thức Bayes', khoi: '12', ten_chu_de: 'Xác suất có điều kiện', hinh_url: null, luu_y: null, cau_nho: null,
    noi_dung: '$P(B\\mid A)=\\dfrac{P(B)\\cdot P(A\\mid B)}{P(B)\\cdot P(A\\mid B)+P(\\overline{B})\\cdot P(A\\mid\\overline{B})}$' },
  { ma: 'CT9-PT-01', ten: 'Công thức nghiệm phương trình bậc hai (delta)', khoi: '9', ten_chu_de: 'Phương trình bậc hai', hinh_url: null,
    luu_y: 'Nếu $b$ chẵn thì dùng $\\Delta\'$ cho gọn.', cau_nho: null,
    noi_dung: '$\\Delta=b^2-4ac$\n$\\Delta>0$: $x_{1,2}=\\dfrac{-b\\pm\\sqrt{\\Delta}}{2a}$' },
  // Mục kiểu KHTN đủ mọi phần (gõ "ohm") — soi bố cục màn đọc: tóm tắt · công thức + kí hiệu · ý chính · ví dụ · hay nhầm · xem thêm.
  { ma: 'l9-dinh-luat-ohm', mon: 'KHTN', nhanh: 'Lý', loai: 'ct', ten: 'Định luật Ohm', khoi: '9', ten_chu_de: 'Điện trở – mạch điện',
    noi_dung: 'Cường độ dòng điện qua dây dẫn tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở của dây.',
    cong_thuc: 'I = U/R', bien: [['I', 'cường độ dòng điện', 'A'], ['U', 'hiệu điện thế', 'V'], ['R', 'điện trở', 'Ω']],
    hinh_ve: '[dothi:0 0; 3 1; 6 2 | U (V) | I (A)]', // mã thật của H-l9-dinh-luat-ohm — app tự vẽ (HinhBangMa)
    y: ['Đồ thị I theo U của một dây dẫn là <b>đường thẳng đi qua gốc tọa độ</b>.', 'Suy ra: U = I·R và R = U/I.'],
    vd: { de: 'Một bóng đèn có điện trở 24 Ω mắc vào hiệu điện thế 12 V. Tính cường độ dòng điện qua đèn.', buoc: ['I = U/R = 12 : 24'], kq: 'I = 0,5 A' },
    nham: ['Quên đổi mA sang A (1 mA = 0,001 A).'],
    lq: [{ ma: 'l9-dien-tro', ten: 'Điện trở', loai: 'dl' }, { ma: 'l9-noi-tiep', ten: 'Đoạn mạch nối tiếp', loai: 'ct' }] },
  // Hình vẽ bằng mã có TƯƠNG TÁC (chạm bộ phận ⇒ hiện tên + chức năng) — gõ "te bao".
  { ma: 's6-te-bao-dong-vat', mon: 'KHTN', nhanh: 'Sinh', loai: 'cq', ten: 'Tế bào động vật', khoi: '6', ten_chu_de: 'Tế bào',
    noi_dung: 'Tế bào động vật gồm màng tế bào, tế bào chất và nhân; không có thành tế bào, không có lục lạp.', hinh_ve: '[tebao:dv]' },
]
const MOCK_API: SoTayApi = {
  mon: async () => MOCK_CAY.mon,
  cay: async () => MOCK_CAY,
  timCt: async (q) => {
    const bd = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    return MOCK_CT.filter((c) => bd(c.ten).includes(bd(q)))
  },
  tim: async (q) => {
    const bd = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    const tu = bd(q)
    return MOCK_CAY.cay.flatMap((cd) => cd.con.flatMap((cde) => cde.dangs
      .filter((d) => bd(d.ten_dang).includes(tu) || bd(cde.ten).includes(tu))
      .map((d) => ({ ...d, khoi: '9', ten_chu_de: cd.ten, ten_chuyen_de: cde.ten }))))
  },
  dang: async (ma): Promise<SoTayNoiDung | null> => {
    const hit = MOCK_CAY.cay.flatMap((cd) => cd.con.flatMap((cde) => cde.dangs.map((d) => ({ d, cd, cde })))).find((x) => x.d.ma_dang === ma)
    if (!hit) return null
    return {
      ...hit.d, khoi: '9', ma_chu_de: hit.cd.ma, ten_chu_de: hit.cd.ten,
      ma_chuyen_de: hit.cde.ma, ten_chuyen_de: hit.cde.ten, cap_nhat_at: '2026-09-18T10:00:00Z',
      noi_dung: 'Phương pháp\nPhương trình bậc hai một ẩn có dạng $ax^2+bx+c=0$ với $a\\neq 0$.\nTính biệt thức $\\Delta = b^2-4ac$ rồi kết luận:\nNếu $\\Delta > 0$ thì phương trình có hai nghiệm phân biệt $x_{1,2}=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}$.\nNếu $\\Delta = 0$ thì phương trình có nghiệm kép $x=\\frac{-b}{2a}$.\nNếu $\\Delta < 0$ thì phương trình vô nghiệm.\n\nBài mẫu 1\nGiải phương trình $x^2-5x+6=0$.\nLời giải: Ta có $\\Delta = 25-24 = 1 > 0$ nên phương trình có hai nghiệm phân biệt $x_1 = 3$ và $x_2 = 2$.\n\nBài mẫu 2\nGiải phương trình $4x^2-4x+1=0$.\nLời giải: $\\Delta = 16-16 = 0$ nên phương trình có nghiệm kép $x=\\frac{1}{2}$.',
    }
  },
}

// DEMO Home 6–12 (`hs.html?demo=912` · `&mot` em 1 môn · `&khoi=10` lưới cấp 3) — kiểm GÓC HỌC TẬP THEO MÔN (Thùy 01/10): đổi môn ⇒
// lớp ở đầu trang, ô học tập (số bài, khoá ô cần kho của môn chưa có kho), việc bổ trợ đổi theo; khối Giải trí đứng yên.
// Dữ liệu giả, không gọi Supabase (cờ `nhom`/khoá kho y luật ở HocSinhApp: KHU_CHOI · KHU_CAN_KHO).
function Demo912() {
  const q = new URLSearchParams(location.search)
  const cap3 = q.get('khoi') === '10'
  const mons = q.has('mot') ? [{ mon: 'Toán', ten_lop: '9B1', co_kho: true }]
    : [{ mon: 'Toán', ten_lop: '9B1', co_kho: true }, { mon: 'KHTN', ten_lop: '9K3', co_kho: true }, { mon: 'Tiếng Anh', ten_lop: '9E1', co_kho: false }]
  const [mon, setMon] = useState(mons[0].mon)
  const coKho = mons.find((m) => m.mon === mon)?.co_kho ?? true
  const BAI: Record<string, { et: number; btvn: number }> = { 'Toán': { et: 1, btvn: 2 }, 'KHTN': { et: 0, btvn: 1 }, 'Tiếng Anh': { et: 0, btvn: 0 } }
  const LICH: LichBoTro[] = [{ buoi_id: 'x', loai: 'bo_tro_yeu', ngay: '2026-10-01', gio_bat_dau: '17:30:00', gio_ket_thuc: '18:30:00', phong: 'P102', mon: 'KHTN', nguoi: 'Cô Lan', diem_danh: null, hom_nay: true, vao_ca: false }]
  const khoa = (id: string): Partial<HomeCard> => ['tu_luyen', 'thong_tin', 'so_tay'].includes(id) && !coKho ? { sub: `${mon} chưa mở`, subMau: 'xam', disabled: true, onClick: undefined } : {}
  // 03/10: Nhiệm vụ + Thư viện BK ở Giải trí · bỏ "Bài tập được giao" · khối 12 (&khoi=10 dùng lưới cấp 3) có ô "Tự luyện TSA" ngay sau Tự luyện.
  const o = (id: string, ten: string, sub: string, extra: Partial<HomeCard> = {}): HomeCard => ({ id, ten, sub, subMau: 'xam', doodle: '', ill: 'self_practice_target', tone: 'blue', onClick: () => {}, nhom: ['the_gioi', 'nhiem_vu', 'thu_vien', 'may_man', 'thanh_tuu', 'vi_xu'].includes(id) ? 'choi' : 'hoc', ...extra, ...khoa(id) })
  const b = BAI[mon] ?? { et: 0, btvn: 0 }
  const nv = o('nhiem_vu', 'Nhiệm vụ', 'Hôm nay còn 2 nhiệm vụ', { badge: 2, subMau: 'ton' })
  const tv = o('thu_vien', 'Thư viện BK', 'Tìm hiểu mọi thứ trên app')
  const cards: HomeCard[] = cap3
    ? [o('giao_trinh', 'Bài tập trên lớp', 'Chưa có bài'), o('et', 'ET', b.et ? `${b.et} bài chưa làm` : 'Chưa có bài', { badge: b.et, subMau: b.et ? 'ton' : 'xam' }),
       o('btvn', 'BTVN', b.btvn ? `${b.btvn} bài chưa làm` : 'Chưa có bài', { badge: b.btvn, subMau: b.btvn ? 'ton' : 'xam' }),
       o('tu_luyen', 'Tự luyện', 'Luyện theo dạng yếu'), o('tu_luyen_rieng', 'Tự luyện TSA', 'Luyện theo từng dạng'), nv, o('thong_tin', 'Thông tin học tập', 'Dạng đang yếu'), o('so_tay', 'Sổ tay kiến thức', 'Tra lý thuyết & bài mẫu'),
       o('the_gioi', 'Thế giới BK', 'Xem HS BK đang khoe gì'), o('de_thi_thu', 'Làm đề thi thử', 'Chưa có bài'), tv]
    : [o('tu_luyen', 'Tự luyện', 'Luyện theo dạng yếu'), nv, o('thong_tin', 'Thông tin học tập', 'Dạng đang yếu'), o('so_tay', 'Sổ tay kiến thức', 'Tra lý thuyết & bài mẫu'),
       o('the_gioi', 'Thế giới BK', 'Xem HS BK đang khoe gì'), o('de_thi_thu', 'Làm đề thi thử', 'Sắp có', { disabled: true }), tv,
       o('thanh_tuu', 'Thành tựu', 'Xem giải thưởng của em'), o('may_man', 'May mắn', 'Có 1 lượt quay!', { badge: 1, subMau: 'ton' }), o('vi_xu', 'Ví xu', 'Xem xu & lịch sử')]
  const dem = Object.fromEntries(mons.map((m) => [m.mon, (cap3 ? (BAI[m.mon]?.et ?? 0) + (BAI[m.mon]?.btvn ?? 0) : 0) + LICH.filter((l) => l.mon === m.mon).length]))
  return <HomeHS912 giaoDien={{ skin: 'rpg', che_do: 'toi', hinh_nen: 'mac_dinh' }} onDaLuu={() => {}} data={{ elo: [], thi: [{ ten: 'Thi vào 10', ngay: '2027-06-02', con_ngay: 244 }] }}
    hoTen="Phí Vinh Gia Khiêm" maHS="hs0557" lopMon={`${mons.find((m) => m.mon === mon)?.ten_lop} · ${mon}`} anhUrl={null} onAnhChanged={() => {}} chuaDoc={1}
    mons={mons} mon={mon} onChonMon={(m) => { chonMonHS(m); setMon(m) }} demMon={dem}
    lich={LICH.filter((l) => l.mon === mon || l.vao_ca)} soRetest={0} cards={cards}
    onHopThu={() => {}} onDoiMK={() => {}} onThoat={() => {}} onLich={() => {}} onRetest={() => {}} onHoSo={() => {}} gioiTinh="nam"
    theGioi={null} onTheGioi={() => {}} />
}

// DEMO màn chính (CHỈ bản dev, không vào build): `hs.html?demo` · `?demo=nu` (nữ) · thêm `&ca` (banner bổ trợ)
// · `&khong` (không có bài). Để kiểm UI theo kit hs-home-v4 mà không cần mã+PIN của HS thật (Claude không
// được nhập mật khẩu) và để CEO so cạnh reference. Dữ liệu giả, không đụng Supabase.
function DemoHome() {
  const q = new URLSearchParams(location.search)
  const nu = q.get('demo') === 'nu' || q.get('nu') !== null
  const khong = q.has('khong')
  // `&mon` — em học 3 môn: hiện thanh chọn môn, bấm đổi môn thì dòng lớp ở hero đổi theo (28/09).
  const DEMO_MONS = q.has('mon') ? [{ mon: 'Toán', ten_lop: '9B1', co_kho: true }, { mon: 'KHTN', ten_lop: '9K3', co_kho: true }, { mon: 'Tiếng Anh', ten_lop: '9E1', co_kho: false }] : []
  const [demoMon, setDemoMon] = useState<string | null>(DEMO_MONS[0]?.mon ?? null)
  const noopBack = () => history.back()
  // ?demo=thanhtuu / ?demo=baitapgiao — verify UI static (Thùy 11/09).
  // ?demo=maymai KHÔNG hoạt động vì screen thật gọi supabase.rpc — cần HS thật, không hack ở đây.
  if (q.get('demo') === '912') return <Demo912 />
  if (q.get('demo') === 'sotay') return <SoTayHS gioiTinh={nu ? 'nu' : 'nam'} onXong={noopBack} api={MOCK_API} />
  if (q.get('demo') === 'thanhtuu') return <ThanhTuuHS gioiTinh={nu ? 'nu' : 'nam'} onXong={noopBack} />
  if (q.get('demo') === 'baitapgiao') return <BaiTapGiaoHS gioiTinh={nu ? 'nu' : 'nam'} onXong={noopBack} />
  if (q.get('demo') === 'maymai') return <MayManHS gioiTinh={nu ? 'nu' : 'nam'} onXong={noopBack} />
  if (q.get('demo') === 'cap1') return <HomeCap1 hoTen="Nguyễn Minh Quân" maHS="hs0012" chuaDoc={2} onHopThu={noopBack} onOpen={noopBack} />
  if (q.get('demo') === 'thongtin') return <ThongTinHocTap hocSinhId="00000000-0000-0000-0000-000000000000" gioiTinh={nu ? 'nu' : 'nam'} onXong={noopBack} />
  if (q.get('demo') === 'podium') {
    // Mock 15 HS để test bục top 3 + Dong 4-10 + dòng "Bạn" ngoài top 10.
    const mock = [
      { ma_hs: 'hs001', ho_ten: 'Nguyễn Văn Đức Huy', la_toi: false, nhan: '92%', phu: '12/13 dạng' },
      { ma_hs: 'hs002', ho_ten: 'Trần Mai Anh', la_toi: false, nhan: '85%', phu: '11/13 dạng' },
      { ma_hs: 'hs003', ho_ten: 'Lê Bảo Ngọc', la_toi: false, nhan: '77%', phu: '10/13 dạng' },
      { ma_hs: 'hs004', ho_ten: 'Phạm Minh Quân', la_toi: false, nhan: '69%', phu: '9/13 dạng' },
      { ma_hs: 'hs005', ho_ten: 'Hoàng Thu Hà', la_toi: false, nhan: '62%', phu: '8/13 dạng' },
      { ma_hs: 'hs006', ho_ten: 'Đỗ Nam Khánh', la_toi: false, nhan: '54%', phu: '7/13 dạng' },
      { ma_hs: 'hs007', ho_ten: 'Vũ Linh Chi', la_toi: false, nhan: '46%', phu: '6/13 dạng' },
      { ma_hs: 'hs008', ho_ten: 'Bùi Duy Khoa', la_toi: false, nhan: '38%', phu: '5/13 dạng' },
      { ma_hs: 'hs009', ho_ten: 'Ngô Bảo Châu', la_toi: false, nhan: '31%', phu: '4/13 dạng' },
      { ma_hs: 'hs010', ho_ten: 'Dương Thanh Trúc', la_toi: false, nhan: '23%', phu: '3/13 dạng' },
      { ma_hs: 'hs011', ho_ten: 'Trịnh Gia Bảo', la_toi: false, nhan: '15%', phu: '2/13 dạng' },
      { ma_hs: 'hs012', ho_ten: 'Đinh Minh Tú (Bạn)', la_toi: true, nhan: '8%', phu: '1/13 dạng' },
    ]
    const t = _THEME_TTHT[nu ? 'nu' : 'nam']
    return (
      <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] overflow-hidden" style={{ background: '#eef4ff', ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
        <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover" />
        <div className="relative px-4 pb-10 pt-[calc(10px+env(safe-area-inset-top))]">
          <div className="mb-3 flex items-center gap-3">
            <button onClick={noopBack} className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[20px] shadow" >‹</button>
            <h1 className="text-[22px] font-extrabold" style={{ color: '#0F1745' }}>BXH — Demo bục trao giải</h1>
          </div>
          <BXHList t={t} rows={mock} emptyText="rỗng" />
        </div>
      </div>
    )
  }
  void MayManHS  // giữ import cho các bản build sau, hiện tại demo maymai vẫn cần lib DB
  // `?demo=list` (+`&nu`, +`&rong`) — màn danh sách bài (kit hs-bai-tap-tren-lop-v1) với 4 trạng thái suy sẵn
  if (q.get('demo') === 'list') {
    const noop = () => {}
    const rows: DsRow[] = q.has('rong') ? [] : [
      { id: '1', ten: 'Bài tập Toán · 11A1', sub: 'Buổi 19/08/2026 · 87 câu', trangThai: 'moi', han: { text: 'Hạn 21/08 23:59 · còn 2 ngày 3h', muc: 'con_nhieu' }, khoa: false, onClick: noop },
      { id: '2', ten: 'Bài tập Toán · 11A1', sub: 'Buổi 12/08/2026 · 60 câu', trangThai: 'dang_lam', han: { text: 'Hạn 13/08 23:59 · còn 5h 12p', muc: 'sat' }, khoa: false, onClick: noop },
      { id: '3', ten: 'Bài tập Toán · 11A1', sub: 'Buổi 05/08/2026 · 42 câu', trangThai: 'qua_han', han: { text: 'Hạn 06/08 23:59 · quá hạn 3 ngày', muc: 'qua_han' }, khoa: true, onClick: noop },
    ]
    return <DanhSachHS tieuDe="Bài tập trên lớp" ill="purple_bookmark_book" gioiTinh={nu ? 'nu' : 'nam'} tab="chua" nChua={rows.length} nXong={2}
      rows={rows} dangTai={false} onBack={noop} onTab={noop} empty={<div className="rounded-[26px] bg-white/90 p-8 text-center">🎉 Không có bài nào cần làm</div>} />
  }
  const noop = () => {}
  // ?demo=cap2 · ?demo=cap2&luot (có 1 lượt May Mắn để quay) — kit HS cấp 2 (Thùy 11/09):
  // ẩn Bài tập trên lớp/ET/BTVN, thêm Bài tập được giao/Thành tựu/May mắn. Dùng emoji trong khung
  // (chưa có PNG cutout — mở rộng HomeCard `emoji?` optional).
  const cap2 = q.get('demo') === 'cap2'
  const coLuot = q.has('luot')
  // Trong DemoHome cap2, click từng box sẽ navigate sang màn demo tương ứng (giữ `?nu` để theme khớp).
  const goDemo = (name: string) => { location.href = `/hs.html?demo=${name}${nu ? '&nu' : ''}` }
  const cards: HomeCard[] = cap2 ? [
    { id: 'tu_luyen',      ten: 'Tự luyện',           sub: 'Luyện theo dạng yếu',                     subMau: 'xam', doodle: 'Small Steps Big Progress', ill: 'self_practice_target', tone: 'green', onClick: noop },
    { id: 'thong_tin',     ten: 'Thông tin học tập',  sub: 'Dạng đang yếu',                           subMau: 'xam', doodle: 'Hiểu mình để tiến bộ hơn!', ill: 'study_progress_chart', tone: 'blue', onClick: noop },
    { id: 'de_thi_thu',    ten: 'Làm đề thi thử',     sub: 'Sắp có',                                  subMau: 'xam', doodle: 'Sắp ra mắt! Hãy chờ nhé!', ill: 'mock_exam_locked', tone: 'gray', disabled: true },
    { id: 'bai_tap_giao',  ten: 'Bài tập được giao',  sub: 'Đang phát triển',                         subMau: 'xam', doodle: 'Sắp có nè!', ill: 'mock_exam_locked', emoji: '📚', tone: 'blue', onClick: () => goDemo('baitapgiao') },
    { id: 'thanh_tuu',     ten: 'Thành tựu',          sub: 'Xem giải thưởng của em',                  subMau: 'xam', doodle: 'Đầy tự hào ♡', ill: 'self_practice_target', emoji: '🏆', tone: 'orange', onClick: () => goDemo('thanhtuu') },
    { id: 'may_man',       ten: 'May mắn',            sub: coLuot ? 'Có 1 lượt quay!' : 'Luyện 10 câu đúng ≥70%', subMau: coLuot ? 'ton' : 'xam', badge: coLuot ? 1 : 0, doodle: 'Luyện chăm là quay!', ill: 'self_practice_target', emoji: '🎰', tone: 'pink', onClick: () => goDemo('maymai') },
  ] : [
    { id: 'giao_trinh', ten: 'Bài tập trên lớp', sub: khong ? 'Chưa có bài' : '1 bài chưa làm', subMau: khong ? 'xam' : 'ton', badge: khong ? 0 : 1, doodle: 'Cố lên!', ill: 'purple_bookmark_book', tone: 'pink', onClick: noop },
    { id: 'et', ten: 'ET', sub: 'Chưa có bài', subMau: 'xam', doodle: 'Kiến thức là sức mạnh', ill: 'orange_documents', tone: 'purple', onClick: noop },
    { id: 'btvn', ten: 'BTVN', sub: khong ? 'Chưa có bài' : '2 bài quá hạn', subMau: khong ? 'xam' : 'do', doodle: 'Ôn tập mỗi ngày nhé!', ill: 'homework_house', tone: 'orange', onClick: noop },
    { id: 'tu_luyen', ten: 'Tự luyện', sub: 'Luyện theo dạng yếu', subMau: 'xam', doodle: 'Small Steps Big Progress', ill: 'self_practice_target', tone: 'green', onClick: noop },
    { id: 'thong_tin', ten: 'Thông tin học tập', sub: 'Dạng đang yếu', subMau: 'xam', doodle: 'Hiểu mình để tiến bộ hơn!', ill: 'study_progress_chart', tone: 'blue', onClick: noop },
    { id: 'de_thi_thu', ten: 'Làm đề thi thử', sub: 'Sắp có', subMau: 'xam', doodle: 'Sắp ra mắt! Hãy chờ nhé!', ill: 'mock_exam_locked', tone: 'gray', disabled: true },
  ]
  return <HomeHS hoTen={nu ? 'Trần Mai Anh' : 'Nguyễn Văn Đức Huy'} maHS={nu ? 'hs0088' : 'hs0059'} gioiTinh={nu ? 'nu' : 'nam'}
    lopMon={demoMon ? `${DEMO_MONS.find((m) => m.mon === demoMon)?.ten_lop} · ${demoMon}` : nu ? '11A2 - Toán' : '11A1 - Toán'}
    mons={DEMO_MONS} mon={demoMon} onChonMon={setDemoMon}
    anhUrl={null} onAnhChanged={noop} chuaDoc={3} lich={q.has('ca') ? [{ buoi_id: 'x', loai: 'bo_tro_yeu', ngay: '2026-09-10', gio_bat_dau: '16:00:00', gio_ket_thuc: '17:00:00', phong: 'P102', mon: 'Toán', nguoi: 'Cô Thùy', diem_danh: null, hom_nay: true, vao_ca: false }] : []} soRetest={q.has('ca') ? 1 : 0} cards={cards}
    onHopThu={noop} onDoiMK={noop} onThoat={noop} onLich={noop} onRetest={noop} />
}

// TRANG XEM MẪU gamification (hs.html?xem=gami — gami/XemMauGami.tsx): dữ liệu giả, không gọi DB, không cần đăng nhập ⇒ mở cả
// bản build để chụp ảnh gửi design + soát kit sau khi đổi vỏ. Tách chunk riêng (lazy) — không nặng bundle chính.
const XemMauGami = lazy(() => import('./screens/hocsinh/gami/XemMauGami'))
const XEM_GAMI = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'gami'
// TUTORIAL "Hành trình tân thủ" bản demo (hs.html?xem=tutorial · &chang=N): dữ liệu giả, không cần đăng nhập (Thùy 30/09).
const TutorialHS = lazy(() => import('./screens/hocsinh/tutorial/TutorialHS'))
const XEM_TUTORIAL = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'tutorial'
// BẢN ĐỒ PHIÊU LƯU 3D bản thử (hs.html?xem=phieu_luu): dữ liệu giả cùng hình dạng hợp đồng, soi cảnh trước khi nối dữ liệu thật (01/10).
const XemPhieuLuu = lazy(() => import('./screens/hocsinh/phieuluu/XemPhieuLuu'))
const XEM_PHIEU_LUU = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'phieu_luu'
// BOSS RIÊNG của giáo viên (hs.html?xem=boss · &ma=boss_thuy · &tt=chieu · &tran=1): 6 tư thế + hội thoại + trận 3D thử, dữ liệu giả (01/10).
const XemBoss = lazy(() => import('./screens/hocsinh/boss/XemBoss'))
const XEM_BOSS = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'boss'
const XemMoHinh3D = lazy(() => import('./screens/hocsinh/boss/XemMoHinh3D')) // hs.html?xem=boss3d — soi mô hình 3D cận cảnh
const XEM_BOSS3D = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'boss3d'
// ĐẤU TRƯỜNG 3 TRẬN (Thử thách — hs.html?xem=thu_thach · &goi_y=1 · &luot=0 · &dang=3 · &gioi=nam): dữ liệu giả, spec-thu-thach-dau-truong.md (02/10).
const XemThuThach = lazy(() => import('./screens/hocsinh/thuthach/XemThuThach'))
const XEM_THU_THACH = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'thu_thach'

// KHU HỌC TẬP (hs.html?xem=hoc_tap · &mon=Toán|KHTN|Tiếng Anh): 5 ô + game nhúng + Giải Vô địch — spec-che-do-game.md §7 (03/10).
const XemHocTap = lazy(() => import('./screens/hocsinh/hoctap/XemHocTap'))
const XEM_HOC_TAP = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'hoc_tap'

// HƯỚNG DẪN CHƠI (hs.html?xem=huong_dan · &muc=<id chủ đề> · &gd=toi_gian|khoi: đổi style để soi giọng formal/game): không cần đăng nhập (03/10).
const XemHuongDan = lazy(() => import('./screens/hocsinh/huongdan/XemHuongDan'))
const XEM_HUONG_DAN = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'huong_dan'

// TRÒ CHƠI (hs.html?xem=tro_choi · &vao=nong_trai · &gd=<skin>): không cần đăng nhập (06/10).
const XemTroChoi = lazy(() => import('./screens/hocsinh/trochoi/XemTroChoi'))
const XEM_TRO_CHOI = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'tro_choi'

// MÀN GIỚI THIỆU Luyện dạng yếu (hs.html?xem=luyen_yeu · &gd=<skin> · &nv=<nhân vật>): không cần đăng nhập (06/10).
const XemLuyenYeu = lazy(() => import('./screens/hocsinh/luyen/XemLuyenYeu'))
const XEM_LUYEN_YEU = typeof location !== 'undefined' && new URLSearchParams(location.search).get('xem') === 'luyen_yeu'

export default function AppHS() {
  if (XEM_LUYEN_YEU) return <Suspense fallback={null}><XemLuyenYeu /></Suspense>
  if (XEM_TRO_CHOI) return <Suspense fallback={null}><XemTroChoi /></Suspense>
  if (XEM_HUONG_DAN) return <Suspense fallback={null}><XemHuongDan /></Suspense>
  if (XEM_GAMI) return <Suspense fallback={null}><XemMauGami /></Suspense>
  if (XEM_TUTORIAL) return <Suspense fallback={null}><TutorialHS /></Suspense>
  if (XEM_PHIEU_LUU) return <Suspense fallback={null}><XemPhieuLuu /></Suspense>
  if (XEM_BOSS) return <Suspense fallback={null}><XemBoss /></Suspense>
  if (XEM_BOSS3D) return <Suspense fallback={null}><XemMoHinh3D /></Suspense>
  if (XEM_THU_THACH) return <Suspense fallback={null}><XemThuThach /></Suspense>
  if (XEM_HOC_TAP) return <Suspense fallback={null}><XemHocTap /></Suspense>
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [hsId, setHsId] = useState<string | null | undefined>(undefined)
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('demo')) return <DemoHome />

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setHsId(undefined); return }
    setHsId(undefined)
    getMyHocSinhId().then((id) => setHsId(id)).catch(() => setHsId(null))
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!session) return <Login hsOnly />
  if (hsId === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!hsId) {
    // Đăng nhập bằng tài khoản KHÔNG phải HS (vd staff gõ nhầm domain này) — không có màn nào cho
    // họ ở đây, chỉ có thể đăng xuất. Domain hs.* CHỈ dành cho HS.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm text-slate-500">Tài khoản này không phải học sinh — trang này chỉ dành cho học sinh.</p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Đăng xuất</button>
      </div>
    )
  }

  // Cổng đổi mật khẩu: PIN provision = chính mã HS ⇒ đoán được ⇒ bài làm không quy được về đúng
  // 1 người. Chặn TRƯỚC khi vào app khi mật khẩu còn mặc định (cờ do script hs_buoc_doi_mk.mjs gắn).
  const phaiDoiMK = session.user.user_metadata?.must_change_password === true
  const maHS = (session.user.email ?? '').split('@')[0]
  return phaiDoiMK
    ? <DoiMatKhau maHS={maHS} batBuoc onXong={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />
    : <><HocSinhApp hocSinhId={hsId} hoTen={(session.user.user_metadata?.ho_ten as string) || 'bạn'} maHS={maHS} /><NutGopYNoi /></>
}
