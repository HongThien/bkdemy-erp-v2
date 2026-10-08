// ============================================================================
// HocSinhApp — app HS-facing (mobile) làm BTVN online. Slice 1: trắc nghiệm + trả lời ngắn.
// Luồng (Thùy chốt): 1 câu/màn → chọn đáp án → "Xác nhận" (tránh ấn nhầm) → chấm tức thì
//   → hiện đáp án + lời giải chi tiết của câu → "Câu tiếp". BTVN reveal ngay, làm lại tới hạn.
// Skin = plain-clean; game (Fredoka/mascot/gradient) làm phiên design sau.
// ============================================================================
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import { MathText, ChuMon } from '../kho/ui'
import { NguLieuHS } from './NguLieuHS'
import { MON_LUYEN_CHUNG_MINH } from '../../lib/mon'
import { LamDienO } from './DienOCau'
import { KeoThaCau } from './KeoThaCau'
import {
  listBaiTestCuaHS, getBaiTestFull, moBaiLam, traLoiCau, baoSai, nopBai, chuCaiChon, chiSoCuaChu,
  getETDe, luuDapAnET, nopET, getETDapAnDaLuu, xemGoiY, daHetHan, laNopMuon,
  type BaiTestCuaHS, type BaiTestFull, type BaiLamCau, type ETCauDe, type ETReveal,
} from '../../lib/testonline'
import { diemDeThiCuaToi, type DiemCuaToi } from '../../lib/dethi'
import { mucDeadline, nhanConLai } from '../../lib/tuan'
import {
  luotTuLuyenHomNay, sinhTuLuyen, sinhTuLuyenChuDe, monCuaHS, laCap1HS, khoiCuaHS, hoSoCuaToi, xepHangTuLuyen,
  lopMonCuaHS, chonMonHS, monDangChon, monRiengCuaHS, datMonTam, layMonTam, type MonRiengHS,
  TU_LUYEN_SO_CAU_MOI_LUOT, type XepHangRow, type LopMonHS,
} from '../../lib/tuluyen'
import ThanhChonMon from './ThanhChonMon'
import { ChonDangChuDe, ChonLoaiTuLuyen } from './TuLuyenChuDe'
import { GameNhungHS, GiaiVoDichHS, HocTapHS } from './hoctap/HocTapHS'
import { ChinhPhucHS } from './hoctap/ChinhPhucHS'
import { ChonNhanVatHS } from './hoctap/ChonNhanVatHS'
import { laNvChon, type NvId } from './skin/nhanVat'
import { chonNhanVat, nhanVatCuaToi } from '../../lib/giaodien_hs'
import { NhungHet, type NhungDau } from './phieuluu/nhungDau'
import { BaoLuotHS } from './BaoLuot'
import GopYHS from './GopYHS'
import { MungMocChuoi, BannerChuoi } from './ChuoiHS'
import { chuoiCuaToi, type Chuoi } from '../../lib/chuoi'
import { tinhNangMoCuaToi, MA_TINH_NANG_O, type TinhNangMo } from '../../lib/tinhnang'
import { soGopYChuaDoc } from '../../lib/gopy_hs'
import { TheTran, PHIEN, CLS_PHIEN, NgocChu, NUT_TRAN, HOP_LOI_GIAI, FONT_TRAN } from './skin/KhungTran'
import { hocTapBat, phieuLuuBat } from './phieuluu/coBat'
// Khu HỌC TẬP (5 đảo) — sau CỜ, mặc định TẮT ở bản thật (bật ở bản thử nghiệm / ?hoctap=1). Tắt ⇒ ô Tự luyện + màn chọn cũ như trước 03/10.
const HOC_TAP = hocTapBat()
const PhieuLuuHS = lazy(() => import('./phieuluu/PhieuLuuHS'))
const LuyenYeuDau = lazy(() => import('./luyen/LuyenYeuDau')) // khung đấu chung (kéo theo chunk PhieuLuuHS) — chỉ tải khi vào Luyện dạng yếu có hiệu ứng game
import { ManCho as ManChoChuyen, napPhieuLuu } from './phieuluu/chuyenCanh'
import { laCap2HS, mayManHSCuaToi } from '../../lib/maymai_hs'
import { htdCoMo, htdSinh, htdCauBaiTest, type CauHTD } from '../../lib/hoctudau'
import { ChonChuDeHTD, ChonChuyenDeHTD, ChiTietDangHTD, LyThuyetHTD, LoTrinhDuoiHS, dangDangHoc, type ChuDeNhom, type ChuyenDeNhom } from './HocTuDau'
import DoiMatKhau from './DoiMatKhau'
import CaBoTroHS, { RetestHS, BoTroBanner, LichBoTroHS, CaBuHS } from './CaBoTroHS'
import { caCuaToi, retestCuaToi, lichBoTroCuaToi, RETEST_BAT, type LichBoTro, type RetestCuaToi } from '../../lib/botro_yeu_ca'
import { listThongBaoHS, docTatCaThongBao, type ThongBaoHS } from '../../lib/thongbaohs'
import { listBaiTraCuaToi, demBaiTraChuaXem, type BaiTraHS as BaiTraRow } from '../../lib/btvntra'
import BaiTraHS, { ngayNgan } from './BaiTraHS'
import HomeHS, { type HomeCard } from './HomeHS'
import HomeHS912 from './HomeHS912'
import { KHOI_CHON_SKIN, laySkin, type GiaoDien } from './skin/registry'
import { useApSkinGoc, GD_MAC_DINH, GD_CAP1, ManHS, DauTrangHS, TheHS, TrongHS, MAU, THE, THE_TRON, HEAD } from './skin/KhungHS'
import { giaoDienCuaToi, home912, type Home912 } from '../../lib/giaodien_hs'
import DanhSachHS, { type DsRow } from './DanhSachHS'
import MayManHS from './MayManHS'
import MoiQuayMayMan from './MoiQuayMayMan'
import { ghiMoApp, thanhTuuChoNhan } from '../../lib/thanhtuu_moi'
import BangXepHangHS from './bxh/BangXepHangHS'
import ThanhTuuHS from './ThanhTuuHS'
import BaiTapGiaoHS from './BaiTapGiaoHS'
import ThongTinHocTap from './ThongTinHocTap'
import SoTayHS from './SoTayHS'
import ViXuHS from './ViXuHS'
import TheGioiHS from './thegioi/TheGioiHS'
import { theGioiHome, type TheGioiHome } from '../../lib/thegioi'
import RankHS from './RankHS'
import NhiemVuHS from './NhiemVuHS'
import ThuVienHS from './ThuVienHS'
import HuongDanHS from './huongdan/HuongDanHS'
import TroChoiHS, { GameNongTraiHS } from './trochoi/TroChoiHS'
import { rankBat } from './phieuluu/coBat'
import GioiThieuYeu from './luyen/GioiThieuYeu'
import TutorialHS from './tutorial/TutorialHS'
import { LocMoi } from './tutorial/LocMoi'
import { chuongMo, NGUOI_DAN_LOC, type DichThu } from './tutorial/noiDungTutorial'
import { tutorialDaXem, tutorialGhi } from '../../lib/tutorial_hs'
import AlbumHS from './AlbumHS'
import HoSoHS from './HoSoHS'
import AvatarHS from './AvatarHS'
import { thuThachLuotDo, sinhThuThach, ketQuaThuThach, rankCuaToi, type KetQuaThuThach, type RankCuaToi } from '../../lib/rank'
import { nhiemVuCuaToi, type NhiemVuCuaToi } from '../../lib/nhiemvu'
import { anhBac } from './gami/hinh'

type Chon = number | string | (string | null)[] | null // TN=index · TLN=chuỗi · ĐS=mảng 'D'/'S'
type CauState = { chon: Chon; kq: { verdict: string; key: unknown; baiLamCauId: string } | null; baoRoi?: boolean }
type MenhDeSnap = { noi_dung: string; loi_giai?: string | null }

const LOAI_TEN: Record<string, string> = { btvn: 'BTVN', et: 'ET', giao_trinh: 'Bài tập', de_thi: 'Đề thi', bo_tro: 'Bổ trợ', bo_tro_test: 'Kiểm tra cuối buổi', retest: 'Kiểm tra lại' }
// Chế độ THI (giấu đáp án tới khi nộp, chấm server, chỉ tính lần nộp đầu) — ET, đề thi trường/sở, và 2 bài của
// ca bổ trợ yếu (test cuối ca · retest) — PLAN-botro-yeu-ca.md.
const THI_LOAI = new Set(['et', 'de_thi', 'bo_tro_test', 'retest'])

// ── MÀN CHÍNH = 6 Ô VUÔNG (Thùy chốt 17/08) ─────────────────────────────────
// 3 ô đầu nối THẲNG với tài liệu trên lớp: mỗi ô = 1 loại doc phát hành từ Kho
// (giáo trình buổi → giao_trinh · ET → et · BTVN → btvn). Không thêm gì ở tầng dữ
// liệu — chỉ tách danh sách phẳng cũ thành 3 cửa.
// 3 ô sau CHƯA build (spec đã có, xem spec-test-online.md §12): tự luyện (hệ tự sinh
// 10 câu theo dạng yếu, ĐẾM vào mastery) · thông tin học tập (dạng yếu + %Đ-C-S theo
// dạng/chuyên đề + xếp hạng lớp/khối) · làm đề thi thử (đề trường/sở, sắp nhập nhiều).
// 2 CỘT — màn điện thoại dọc (Thùy: "màn hình điện thoại là dọc mà").
// Bảng xếp hạng (Thùy 21/08: "ko phải chỉ 5T. Hiện cho các khối tiểu học") — mọi khối cấp 1, MỖI
// EM xếp hạng với ĐÚNG khối của mình (BangXepHang tự đọc khoiCuaHS(), không hardcode '5T' nữa).
// 07/10: Bảng xếp hạng MỚI (bxh/BangXepHangHS) dùng cho cấp 2–3; cấp 1 vẫn BangXepHang cũ ⇒ không còn ô nào chỉ-cấp-1 ở đây.
const KHU_CHI_CAP1 = new Set<KhuId>([])
// MÔN LÀ TRỤC NGOÀI CÙNG (Thùy 01/10: "chuyển môn là phải chuyển các tính năng học tập tương ứng. Chơi thì không cần"):
// ô CHƠI = chung mọi môn (khối "Giải trí" ở Home, đổi môn không đổi); mọi ô còn lại thuộc góc học tập của môn đang chọn.
// 03/10 (Thùy): Nhiệm vụ xuống Giải trí · thêm Thư viện BK (Rank là thẻ con trong đó).
const KHU_CHOI = new Set<KhuId>(['the_gioi', 'nhiem_vu', 'thu_vien', 'tro_choi', 'may_man', 'thanh_tuu', 'vi_xu'])
// Ô học tập rút câu từ KHO của môn — môn chưa có kho (co_kho=false, vd Tiếng Anh) thì khoá + báo, KHÔNG gọi RPC.
// (Ô bài trên lớp/ET/BTVN/đề thi không cần kho: đọc bài thầy cô phát hành, môn nào cũng chạy.)
const KHU_CAN_KHO = new Set<KhuId>(['tu_luyen', 'thong_tin', 'so_tay'])
type KhuId = 'giao_trinh' | 'et' | 'btvn' | 'tu_luyen' | 'thong_tin' | 'de_thi_thu' | 'xep_hang' | 'may_man' | 'thanh_tuu' | 'bai_tap_giao' | 'so_tay' | 'vi_xu' | 'the_gioi' | 'nhiem_vu' | 'rank' | 'thu_vien' | 'tro_choi'
// direct = ô này KHÔNG đi qua màn "danh sách nhiều bài" (setKhu+tab) — bấm vào thẳng 1 màn riêng.
// Tự luyện là 1 PHIÊN đang-tiếp-diễn trong ngày (không phải danh sách bài đã phát hành theo ngày
// như ET/BTVN), nên không hợp mô hình list+tab dùng chung — mỗi màn direct tự lo dữ liệu riêng.
// mau = màu nền ô icon (Thùy: giống app PH — mỗi ô 1 màu, đúng ".function .blue/.green/..." trong
// bkdemy-ph-app/app/ph-v3.css, KHÔNG phải xám phẳng đơn điệu như bản trước).
const KHU: { id: KhuId; ten: string; icon: string; loai?: string; direct?: boolean; mau: string }[] = [
  { id: 'giao_trinh', ten: 'Bài tập trên lớp', icon: '📓', loai: 'giao_trinh', mau: 'brand' },
  { id: 'et', ten: 'ET', icon: '📋', loai: 'et', mau: 'ph-purple' },
  { id: 'btvn', ten: 'BTVN', icon: '🏠', loai: 'btvn', mau: 'ph-orange' },
  { id: 'tu_luyen', ten: HOC_TAP ? 'Học tập' : 'Tự luyện', icon: '🎯', direct: true, mau: 'ph-green' }, // Thùy 03/10: Tự luyện ⇒ khu HỌC TẬP 5 ô (spec-che-do-game §7)
  { id: 'nhiem_vu', ten: 'Nhiệm vụ', icon: '📜', direct: true, mau: 'ph-green' }, // Thùy 01/10: ra màn chính · 03/10: xuống khối Giải trí
  { id: 'thong_tin', ten: 'Thông tin học tập', icon: '📈', direct: true, mau: 'brand' },
  { id: 'so_tay', ten: 'Sổ tay kiến thức', icon: '📖', direct: true, mau: 'ph-purple' },
  { id: 'the_gioi', ten: 'Thế giới BK', icon: '🌏', direct: true, mau: 'brand' }, // mạng xã hội khoe — spec-the-gioi-bk.md
  { id: 'xep_hang', ten: 'Bảng xếp hạng', icon: '🏆', direct: true, mau: 'ph-orange' },
  { id: 'de_thi_thu', ten: 'Làm đề thi thử', icon: '📄', loai: 'de_thi', mau: 'ph-purple' }, // 27/09: đề thi thầy/cô phát hành cho lớp (fn_de_thi_mo)
  { id: 'thu_vien', ten: 'Thư viện BK', icon: '📚', direct: true, mau: 'brand' }, // 03/10: nơi tìm hiểu mọi thông tin trên app (Rank ở trong)
  { id: 'tro_choi', ten: 'Trò chơi', icon: '🎮', direct: true, mau: 'brand' }, // 06/10: danh sách game (Nông trại BK + sắp có) — khối Giải trí
]
// ── KHU cấp 2 (lớp 6-9) — Thùy 11/09: ẨN Bài tập trên lớp/ET/BTVN, thêm 3 ô mới ─────────────────
// (Bài tập được giao "sắp có" — sau này nối bổ trợ; Thành tựu = giai_thuong đã công bố; May mắn =
//  vòng quay 4 EXP có điều kiện 10 câu tự luyện đúng ≥70% + tối đa 1 lượt/ngày.)
// Cấp 3 (khối 10-12) — Thùy CHƯA nói đổi, giữ KHU cũ. Cấp 1 dùng HomeCap1 riêng, không đụng.
const KHU_CAP2: { id: KhuId; ten: string; icon: string; direct?: boolean; sapCo?: boolean }[] = [
  { id: 'tu_luyen',      ten: HOC_TAP ? 'Học tập' : 'Tự luyện', icon: '🎯', direct: true },
  { id: 'nhiem_vu',      ten: 'Nhiệm vụ',           icon: '📜', direct: true },  // Thùy 01/10: ra màn chính · 03/10: khối Giải trí
  { id: 'xep_hang',      ten: 'Bảng xếp hạng',      icon: '🏅', direct: true },  // 07/10: 1 ô LỚN, theo môn (spec-bang-xep-hang.md)
  { id: 'thong_tin',     ten: 'Thông tin học tập',  icon: '📈', direct: true },
  { id: 'so_tay',        ten: 'Sổ tay kiến thức',   icon: '📖', direct: true },
  { id: 'the_gioi',      ten: 'Thế giới BK',        icon: '🌏', direct: true },
  { id: 'de_thi_thu',    ten: 'Làm đề thi thử',     icon: '📄', sapCo: true },
  // 'Bài tập được giao' BỎ (Thùy 03/10): sau này là ô DERIVE — chỉ hiện khi thầy cô thật sự giao, không giữ chỗ.
  { id: 'thu_vien',      ten: 'Thư viện BK',        icon: '📚', direct: true },  // 03/10: Rank thành thẻ con trong đây
  { id: 'tro_choi',      ten: 'Trò chơi',           icon: '🎮', direct: true },  // 06/10: Nông trại BK + game sắp ra mắt
  { id: 'thanh_tuu',     ten: 'Thành tựu',          icon: '🏆', direct: true },
  { id: 'vi_xu',         ten: 'Ví xu',              icon: '🪙', direct: true },
]
// Kit hs-home-v4: minh hoạ (PNG cutout ở public/bk-ui/hs) + doodle chữ tay (Itim, TEXT) + tông màu từng ô.
// KIT_O — mỗi ô có (ill|emoji · doodle · tone). Ô cấp 2 mới CHƯA có PNG cutout — dùng emoji cho khung
// icon (HomeHS ưu tiên emoji nếu có, fallback về ill file PNG). Sau này export PNG thì bỏ emoji.
const KIT_O: Record<KhuId, Pick<HomeCard, 'ill' | 'emoji' | 'doodle' | 'tone'>> = {
  giao_trinh:   { ill: 'purple_bookmark_book', doodle: 'Cố lên!', tone: 'pink' },
  et:           { ill: 'orange_documents', doodle: 'Kiến thức là sức mạnh', tone: 'purple' },
  btvn:         { ill: 'homework_house', doodle: 'Ôn tập mỗi ngày nhé!', tone: 'orange' },
  tu_luyen:     { ill: 'self_practice_target', doodle: 'Small Steps Big Progress', tone: 'green' },
  thong_tin:    { ill: 'study_progress_chart', doodle: 'Hiểu mình để tiến bộ hơn!', tone: 'blue' },
  so_tay:       { ill: 'purple_bookmark_book', doodle: 'Quên đâu tra đó!', tone: 'purple' },
  the_gioi:     { ill: 'self_practice_target', emoji: '🌏', doodle: '', tone: 'blue' },
  xep_hang:     { ill: 'self_practice_target', doodle: 'Thi đua vui!', tone: 'green' },
  de_thi_thu:   { ill: 'orange_documents', emoji: '📄', doodle: 'Bình tĩnh, tự tin!', tone: 'blue' },
  bai_tap_giao: { ill: 'mock_exam_locked', emoji: '📚', doodle: 'Sắp có nè!', tone: 'blue' },
  thanh_tuu:    { ill: 'self_practice_target', emoji: '🏆', doodle: 'Đầy tự hào ♡', tone: 'orange' },
  may_man:      { ill: 'self_practice_target', emoji: '🎰', doodle: 'Luyện chăm là quay!', tone: 'pink' },
  vi_xu:        { ill: 'self_practice_target', emoji: '🪙', doodle: 'Tích xu đổi quà!', tone: 'orange' },
  nhiem_vu:     { ill: 'self_practice_target', emoji: '📜', doodle: 'Xong là có EXP!', tone: 'green' },
  rank:         { ill: 'self_practice_target', emoji: '🛡️', doodle: 'Lên bậc nào!', tone: 'orange' },
  thu_vien:     { ill: 'purple_bookmark_book', emoji: '📚', doodle: 'Tìm hiểu app nào!', tone: 'blue' },
  tro_choi:     { ill: 'self_practice_target', emoji: '🎮', doodle: 'Giải lao nào!', tone: 'purple' },
}
// ── Style màn con theo SKIN (Thùy 29/09: đổi style là đổi CẢ màn trong, không chỉ Home) ─────────────────
// Mọi nền/chữ/viền đọc biến --sk-* (skin/KhungHS). Màu cố định CHỈ còn màu ngữ nghĩa đúng/sai/cảnh báo — nền
// ngữ nghĩa dạng TRONG SUỐT để đọc được cả skin sáng lẫn tối. KHÔNG dùng MAU.acc làm màu CHỮ trên nền thẻ
// (Y2K sáng: acc = xanh chanh trên trắng, không đọc được) — chọn/nhấn = viền acc + nền pha acc + chữ ink.
const NEN_MAN: CSSProperties = { background: 'var(--sk-nen-trong)', color: MAU.ink, fontFamily: 'var(--sk-font)' }
const NEN_DUNG = 'rgba(34,160,107,0.16)', NEN_SAI = 'rgba(229,72,77,0.16)', NEN_CB = 'rgba(224,144,30,0.16)'
const VIEN_DUNG = 'rgba(34,160,107,0.5)', VIEN_SAI = 'rgba(229,72,77,0.5)', VIEN_CB = 'rgba(224,144,30,0.45)'
const NEN_ACC = 'color-mix(in srgb, var(--sk-acc) 16%, transparent)' // trình duyệt cũ bỏ qua ⇒ trong suốt, vẫn còn viền acc
const R_TRONG = 'calc(var(--sk-radius) * 0.6)' // bo góc ô con bên trong thẻ — theo skin (Đấu trường = vuông)
const NUT_CHINH: CSSProperties = { background: MAU.acc, color: MAU.accInk, borderRadius: 'var(--sk-radius)', clipPath: 'var(--sk-card-clip)', fontFamily: 'var(--sk-font-head)' }
const NUT_PHU: CSSProperties = { background: MAU.surface, color: MAU.ink, border: `1.5px solid ${MAU.line}`, borderRadius: 'var(--sk-radius)', fontFamily: 'var(--sk-font-head)', backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)' }
const NUT_NOP: CSSProperties = { ...NUT_CHINH, background: MAU.dung, color: '#fff' } // "Nộp bài" giữ xanh ngữ nghĩa (nền màu cố định ⇒ chữ trắng)
// Trạng thái 1 ô đáp án (TN) / nút Đúng-Sai (ĐS) — dùng chung LamBai + LamET.
type TtO = 'dung' | 'sai' | 'chon' | 'thuong'
const O_DAP_AN = (t: TtO): CSSProperties => ({
  borderRadius: R_TRONG, color: MAU.ink,
  ...(t === 'dung' ? { border: `1.5px solid ${VIEN_DUNG}`, background: NEN_DUNG }
    : t === 'sai' ? { border: `1.5px solid ${VIEN_SAI}`, background: NEN_SAI }
    : t === 'chon' ? { border: `2px solid ${MAU.acc}`, background: NEN_ACC }
    : { border: `1.5px solid ${MAU.line}`, background: MAU.surface2 }),
})
// Vòng chữ A/B/C/D: đúng/sai = nền ngữ nghĩa + chữ trắng; đang chọn = nền acc + chữ accInk.
const TRON_CHU = (t: TtO): CSSProperties =>
  t === 'dung' ? { background: MAU.dung, color: '#fff' } : t === 'sai' ? { background: MAU.sai, color: '#fff' }
  : t === 'chon' ? { background: MAU.acc, color: MAU.accInk } : { background: MAU.surface, color: MAU.muted, border: `1px solid ${MAU.line}` }
const NUT_DS = (t: TtO): CSSProperties => ({
  ...O_DAP_AN(t), color: t === 'dung' ? MAU.dung : t === 'sai' ? MAU.sai : t === 'chon' ? MAU.ink : MAU.muted,
  ...(t === 'thuong' ? { background: MAU.surface } : {}),
})
// Ô trả lời ngắn — nền/viền skin, focus viền acc.
const O_NHAP: CSSProperties = { background: MAU.surface2, color: MAU.ink, border: `1.5px solid ${MAU.line}`, borderRadius: R_TRONG }
const O_NHAP_CLS = 'w-full px-4 py-3 outline-none placeholder:text-[color:var(--sk-muted)] focus:!border-[color:var(--sk-acc)] disabled:opacity-70'
// ⭐ Ô TRẢ LỜI NGẮN KIỂU PHIẾU THI (bai_test_cau.kieu_nhap = 'phieu_4o', bài phát hành từ ĐỀ THI — spec-de-thi.md K5):
// đúng 4 ô như phiếu trả lời của Bộ — chỉ chữ số, dấu "−" (chỉ ô 1), dấu "," (chỉ ô 2 hoặc 3). Bàn phím riêng trên
// màn (bàn phím số của điện thoại không có dấu trừ) + gõ được bằng bàn phím thật. Giá trị = chuỗi như "-2,5".
function them4O(v: string, k: string): string {
  if (v.length >= 4) return v
  if (k === '-') return v === '' ? '-' : v
  if (k === ',') return (v.length === 1 || v.length === 2) && !v.includes(',') ? v + ',' : v
  return /^[0-9]$/.test(k) ? v + k : v
}
export function ONhap4O({ value, onChange, disabled, co = 19 }: { value: string; onChange: (v: string) => void; disabled?: boolean; co?: number }) {
  const v = (value ?? '').slice(0, 4)
  const bam = (k: string) => { if (!disabled) { const n = k === 'xoa' ? v.slice(0, -1) : them4O(v, k); if (n !== v) onChange(n) } }
  const phim = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', ',']
  return (
    <div tabIndex={disabled ? -1 : 0} className="outline-none"
      onKeyDown={(e) => {
        const k = e.key === '.' ? ',' : e.key === '−' ? '-' : e.key
        if (k === 'Backspace') { e.preventDefault(); bam('xoa') } else if (/^[0-9,-]$/.test(k)) { e.preventDefault(); bam(k) }
      }}>
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex h-14 w-12 items-center justify-center font-semibold"
            style={{ ...O_NHAP, fontSize: co + 5, ...(i === v.length && !disabled ? { border: `2px solid ${MAU.acc}` } : {}), opacity: disabled ? 0.7 : 1 }}>
            {v[i] === '-' ? '−' : v[i] ?? ''}
          </div>
        ))}
        {!disabled && v && <button onClick={() => bam('xoa')} className="ml-1 px-3 py-2 text-[15px] font-medium active:scale-95" style={NUT_PHU}>⌫</button>}
      </div>
      {!disabled && (
        <div className="mt-3 grid max-w-[260px] grid-cols-3 gap-2">
          {phim.map((k) => (
            <button key={k} onClick={() => bam(k)} className="py-2.5 font-semibold active:scale-95" style={{ ...O_DAP_AN('thuong'), fontSize: co }}>
              {k === '-' ? '−' : k}
            </button>
          ))}
        </div>
      )}
      {!disabled && <p className="mt-2 text-[12px]" style={{ color: MAU.muted }}>Điền như phiếu thi: tối đa 4 ô — dấu − ở ô đầu, dấu phẩy ở ô 2 hoặc 3.</p>}
    </div>
  )
}
// Nút/hộp "Gợi ý" (cảnh báo = cam ngữ nghĩa).
const NUT_GOI_Y = (mo: boolean): CSSProperties => ({ border: `1px solid ${VIEN_CB}`, background: mo ? 'rgba(224,144,30,0.26)' : NEN_CB, color: MAU.canhBao })
const HOP_GOI_Y: CSSProperties = { border: `1px solid ${VIEN_CB}`, background: NEN_CB, borderRadius: R_TRONG }

// Màn chờ (đang tải…) — nền skin, chữ mờ.
function ManCho({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-sm" style={{ ...NEN_MAN, color: MAU.muted }}>{children}</div>
}
// Màn căn giữa (kết quả cuối / lỗi / rỗng) — nền skin, cột giữa.
function ManGiua({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center" style={NEN_MAN}>
      <div className="flex w-full max-w-md flex-col items-center md:max-w-3xl">{children}</div>
    </div>
  )
}

// Header sub-màn — giờ là DauTrangHS của skin (nút back + tiêu đề font đầu skin).
function Head({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) {
  return <DauTrangHS tieuDe={title} phu={sub} onBack={onBack} />
}

// ── MÀN CHÍNH CẤP 1 — desktop/iPad-first (Thùy 21/08, theo mockup HTML "BK_Academy_Student_App_
// 6_Boxes") — 6 ô: 3 ô CÓ data thật (Tự luyện/Thông tin học tập/Bảng xếp hạng) bấm được, 3 ô CHƯA
// có backend (Bài tập được giao/Sự kiện học tập/Huy hiệu) hiện "Sắp có", KHÔNG bấm được — tránh
// hứa tính năng chưa tồn tại. Bảng màu RIÊNG (không phải bảng ph-* dùng cho cấp 3 — mockup này là
// hướng thiết kế khác hẳn, tươi/nhiều màu hơn, không cố match app PH nữa).
// Thùy 12/09: HS cấp 1 KHÔNG dùng điện thoại — chỉ iPad/laptop → HomeCap1 desktop/iPad-first (grid
// 3 cột full màn, không max-w 430 centered như HomeHS). Nội dung đồng bộ KHU_CAP2 (đã build cho cấp
// 2): 6 ô Tự luyện · Thông tin học tập · Đề thi thử (sắp có) · Bài tập được giao · Thành tựu · May
// mắn. Bảng xếp hạng cũ chuyển vào Thành tựu tương lai (huy hiệu/mốc — placeholder trong ThanhTuuHS).
type BoxCap1DirectId = 'tu_luyen' | 'thong_tin' | 'may_man' | 'thanh_tuu' | 'bai_tap_giao' | 'so_tay' | 'vi_xu'
type BoxCap1 = { id: BoxCap1DirectId; ten: string; mo_ta: string; icon: string; grad: string } | { id: string; ten: string; mo_ta: string; icon: string; grad: string; sapCo: true }
const BOX_CAP1: BoxCap1[] = [
  { id: 'tu_luyen',     ten: HOC_TAP ? 'Học tập' : 'Tự luyện', mo_ta: HOC_TAP ? 'Cùng BK chinh phục thế giới.' : 'Luyện theo dạng bài còn yếu hoặc chủ động chọn nội dung muốn ôn tập.', icon: '🎯', grad: 'from-[#f0e9ff] to-[#faf8ff]' },
  { id: 'thong_tin',    ten: 'Thông tin học tập',  mo_ta: 'Xem kết quả gần nhất, dạng đang yếu, nhận xét và gợi ý ôn tập.',      icon: '📘', grad: 'from-[#e9f9ff] to-[#f6fdff]' },
  { id: 'so_tay',       ten: 'Sổ tay kiến thức',   mo_ta: 'Tra lý thuyết và bài mẫu của từng dạng bài — tìm theo tên hoặc lọc dần.', icon: '📖', grad: 'from-[#f3ecff] to-[#fbf8ff]' },
  { id: 'de_thi_thu',   ten: 'Làm đề thi thử',     mo_ta: 'Đề trường/sở để em luyện làm bài thi thật — sắp mở.',                 icon: '📄', grad: 'from-[#eef2ff] to-[#f7f9ff]', sapCo: true },
  { id: 'thanh_tuu',    ten: 'Thành tựu',          mo_ta: 'Xem giải thưởng cuối tháng, huy hiệu và mốc học tập đã đạt được.',    icon: '🏆', grad: 'from-[#fff8de] to-[#fffbef]' },
  { id: 'vi_xu',        ten: 'Ví xu',              mo_ta: 'Xem số xu hiện có, lịch sử đổi quà và các hoạt động kiếm điểm của em.', icon: '🪙', grad: 'from-[#fff8de] to-[#fffbef]' },
]
// Thùy 22/08 gửi thẳng file mockup tỉ lệ đúng ý (`BK_Academy_Student_Desktop.html`) sau khi bản
// trước "hộp quá to chữ quá nhỏ". Port lại ĐÚNG số đo từ file đó (hero 2 cột kèm art bên phải, hộp
// min-h 208px/icon 58px/tiêu đề 21px/mô tả 13px/pad 24px/gap 18px) thay vì tự đoán tiếp lần 3.
// Bỏ khoá `h-screen overflow-hidden` — mockup gốc của Thùy vốn là trang cuộn tự nhiên theo nội dung
// (không ép vừa 1 màn hình), thân trang cao hơn viewport 13-14" thì cuộn nhẹ là đúng theo THIẾT KẾ
// gốc, không phải bug — khác hẳn bug 21/08 (cuộn do zoom 1.15 lỗi, xem main-hs.tsx).
export function HomeCap1({ hoTen, maHS, onOpen, extra, chuaDoc, onHopThu, maymanCoLuot, thanhTuuCho, chiHien }: { hoTen: string; maHS: string; onOpen: (d: BoxCap1DirectId) => void; extra?: React.ReactNode; chuaDoc: number; onHopThu: () => void; maymanCoLuot?: boolean; thanhTuuCho?: number; chiHien?: (id: string) => boolean }) {
  const boxHien = BOX_CAP1.filter((b) => !chiHien || chiHien(b.id))
  const initials = hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at 85% 5%, rgba(115,87,245,.10), transparent 24rem), radial-gradient(circle at 8% 25%, rgba(47,128,237,.08), transparent 22rem), #f4f7fb' }}>
      <div className="mx-auto w-full max-w-[1560px] px-8 py-6">
        {/* Topbar */}
        <div className="mb-[18px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img src="/Logo.png" alt="BK Academy" className="h-9 w-auto" />
            {/* Chip "App học tập..." ẨN dưới 900px (iPad mini portrait 744): topbar chật, chip
                bị squeeze thành cột dọc. Logo BK ACADEMY vẫn đủ danh tính; card user + chuông
                + Thoát phải fit. Bật lại từ ~900px khi có chỗ. */}
            <span className="hidden rounded-full border border-[#e8edf5] bg-white/90 px-3.5 py-2 text-[13px] font-bold text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)] min-[900px]:inline-flex">📚 App học tập cho học sinh</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex min-w-[220px] items-center gap-3 rounded-[18px] bg-white py-2 pl-2 pr-3 shadow-[0_6px_16px_rgba(31,47,79,0.06)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#2486df] to-[#745bf0] text-[13px] font-black text-white">{initials}</div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[14px] font-bold text-[#171a2b]">{hoTen}</p>
                <p className="truncate text-[11px] text-[#7b8499]">{maHS.toUpperCase()}</p>
              </div>
            </div>
            {/* Hòm thư — chuông nổi, badge đỏ khi có thư chưa đọc (§ "báo lỗi đúng" gửi vào đây). */}
            <button onClick={onHopThu} title="Hòm thư"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[16px] shadow-[0_6px_16px_rgba(31,47,79,0.06)]">
              🔔
              {chuaDoc > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ph-red px-1 text-[10px] font-bold text-white">{chuaDoc}</span>
              )}
            </button>
            {/* Thoát (Thùy 22/08: "ko thấy nút đăng xuất") — mockup gốc chỉ vẽ mũi tên dropdown chưa
                nối chức năng, thêm nút Thoát riêng, ĐÚNG style icon-button cấp 3 (squircle nổi). */}
            <button onClick={() => supabase.auth.signOut()} title="Đăng xuất"
              className="flex h-10 shrink-0 items-center justify-center rounded-[14px] bg-white px-3.5 text-[13px] font-bold text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)]">
              Thoát
            </button>
          </div>
        </div>

        {/* Hero — 2 cột (chữ trái, art phải) đúng theo mockup, không còn CTA "Tiếp tục học/Xem lịch"
            vì backend chưa có tính năng đó — giữ tỉ lệ khối, bỏ nút giả không có chức năng thật. */}
        <section className="relative grid min-h-[190px] grid-cols-[minmax(0,1fr)_310px] items-center gap-3 overflow-hidden rounded-[30px] px-9 py-7 shadow-[0_16px_40px_rgba(31,47,79,0.08)]" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,.35), rgba(255,255,255,.06)), linear-gradient(120deg, #ece9ff 0%, #e4f1ff 50%, #dff8ff 100%)' }}>
          <div className="pointer-events-none absolute -right-[140px] -top-[210px] h-[420px] w-[420px] rounded-full bg-white/50" />
          <div className="relative z-[1]">
            <p className="m-0 text-[14px] font-extrabold text-[#6c7386]">Xin chào,</p>
            <h1 className="m-0 text-[40px] font-black leading-tight tracking-[-1.4px] text-[#171a2b]">{hoTen}! 👋</h1>
            <p className="mt-2.5 max-w-[560px] text-[15px] leading-[1.6] text-[#5e667b]">Chọn một nội dung bên dưới để bắt đầu học. Hôm nay tiếp tục chinh phục những dạng bài còn yếu nhé!</p>
          </div>
          <div className="relative z-[1] flex min-h-[140px] items-center justify-center">
            <div className="text-[100px] leading-none [filter:drop-shadow(0_18px_18px_rgba(51,70,110,.16))] [transform:rotate(6deg)]">🚀</div>
          </div>
        </section>

        {extra}
        {/* Lưới 6 ô — số đo port thẳng từ mockup: min-h 208px, icon 58px/30px, tiêu đề 21px, mô tả 13px */}
        <section className="mt-5">
          <div className="mb-3.5 flex items-end justify-between gap-3">
            <div>
              <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.4px] text-[#171a2b]">Khu vực học tập</h2>
              <p className="m-0 mt-1 text-[13px] text-[#7b8499]">{boxHien.length} chức năng chính của học sinh.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[18px]">
            {boxHien.map((b) => {
              const sapCo = 'sapCo' in b && b.sapCo
              // Badge May mắn: có 1 lượt quay khi đủ điều kiện + chưa quay hôm nay (giống HomeHS cấp 2).
              const badgeSo = !sapCo && b.id === 'may_man' && maymanCoLuot ? 1 : !sapCo && b.id === 'thanh_tuu' ? (thanhTuuCho ?? 0) : 0
              return (
                <button key={b.id} disabled={sapCo} onClick={() => !sapCo && onOpen(b.id as BoxCap1DirectId)}
                  className={`group relative flex min-h-[208px] flex-col items-start rounded-[26px] border border-white/76 bg-gradient-to-br p-6 text-left shadow-[0_16px_40px_rgba(31,47,79,0.08)] transition ${b.grad} ${sapCo ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,47,79,0.12)]'}`}>
                  <div className="mb-[18px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-white/72 text-[30px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">{b.icon}</div>
                  <h3 className="m-0 mb-2 text-[21px] font-extrabold text-[#171a2b]">{b.ten}</h3>
                  <p className="m-0 max-w-[88%] text-[13px] leading-[1.55] text-[#626c80]">{b.mo_ta}</p>
                  {badgeSo > 0 && (
                    <span className="absolute right-[17px] top-[17px] flex h-7 min-w-7 items-center justify-center rounded-full bg-[#FF315E] px-2 text-[13px] font-extrabold text-white shadow-[0_6px_14px_rgba(255,49,94,.35)]">{badgeSo}</span>
                  )}
                  {sapCo ? (
                    <span className="absolute bottom-[17px] right-[17px] rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-[#7b8499]">Sắp có</span>
                  ) : (
                    <span className="absolute bottom-[17px] right-[17px] flex h-[38px] w-[38px] items-center justify-center rounded-[13px] bg-white/78 text-[14px] font-black text-[#171a2b] transition group-hover:translate-x-0.5">→</span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex min-h-[76px] items-center justify-between gap-3.5 rounded-[24px] px-6 py-5 text-white shadow-[0_16px_36px_rgba(101,73,234,0.24)]" style={{ background: 'linear-gradient(135deg, #6549ea, #8368f7)' }}>
          <strong className="text-[18px] tracking-wide">BK ACADEMY</strong>
          <span className="text-[13px] opacity-90">Học tập là hành trình, kiên trì là chìa khóa! ✨</span>
        </footer>
      </div>
    </div>
  )
}

export default function HocSinhApp({ hocSinhId, hoTen, maHS }: { hocSinhId: string; hoTen: string; maHS: string }) {
  const [tests, setTests] = useState<BaiTestCuaHS[] | null>(null)
  const [active, setActive] = useState<BaiTestCuaHS | null>(null)
  const [tab, setTab] = useState<'chua' | 'xong'>('chua')
  const [doiMK, setDoiMK] = useState(false)
  const [khu, setKhu] = useState<KhuId | null>(null) // null = màn chính, có ô
  const [tutChuong, setTutChuong] = useState<string | null | undefined>(undefined) // Hướng dẫn chơi → tutorial: id chặng · null = cả hành trình · undefined = không mở
  const [direct, setDirect] = useState<'phieu_luu' | 'tu_luyen' | 'tu_luyen_chon' | 'thu_thach' | 'doi_nhan_vat' | 'dau_truong_bk' | 'chinh_phuc_bk' | 'giai_vo_dich' | 'rank' | 'nhiem_vu' | 'album' | 'ho_so' | 'tu_luyen_chu_de_ds' | 'thong_tin' | 'xep_hang' | 'bo_tro' | 'duoi_lo_trinh' | 'bu_ca' | 'lich_bo_tro' | 'retest' | 'hop_thu' | 'may_man' | 'thanh_tuu' | 'bai_tap_giao' | 'so_tay' | 'vi_xu' | 'the_gioi' | 'thu_vien' | 'huong_dan' | 'tutorial' | 'gop_y' | 'tro_choi' | 'nong_trai' | 'htd_chu_de' | 'htd_chuyen_de' | 'htd_dang' | 'htd_ly_thuyet' | 'htd_luyen' | 'htd_test' | null>(null)
  const [yeuVao, setYeuVao] = useState(false) // Luyện dạng yếu: đã qua màn giới thiệu chưa (reset mỗi lần thoát)
  const [tuHoSo, setTuHoSo] = useState(false) // Rank/Album mở từ Hồ sơ ⇒ "Quay lại" về Hồ sơ
  const [tuThuVien, setTuThuVien] = useState(false) // Rank mở từ Thư viện BK ⇒ "Quay lại" về Thư viện (03/10)
  const [tuHome, setTuHome] = useState(false) // Rank/Nhiệm vụ mở từ MÀN CHÍNH (ô / huy hiệu bậc) ⇒ "Quay lại" về màn chính
  const [chuDeDang, setChuDeDang] = useState<{ ma_dang: string; ten_dang: string; chiCauMoi?: boolean } | null>(null) // dạng đã chọn cho "Tự luyện theo chủ đề" (null = luồng tổng hợp)
  // "Học từ đầu" (Thùy 19/09) — ô CHỈ hiện khi HS có case bổ trợ đuổi ĐANG MỞ (tự suy
  // bo_tro_duoi.trang_thai='can_duoi', KHÔNG lưu cờ riêng — xem htd_co_mo). htdMon lưu
  // lại môn đã dùng để check, để gọi RPC htd_* sau này khỏi phải monCuaHS() lại.
  const [htdMo, setHtdMo] = useState(false)
  const [htdMon, setHtdMon] = useState<string | null>(null)
  const [htdChuDe, setHtdChuDe] = useState<ChuDeNhom | null>(null)
  const [htdChuyenDe, setHtdChuyenDe] = useState<ChuyenDeNhom | null>(null)
  const [htdDang, setHtdDang] = useState<{ ma_dang: string; ten_dang: string; xong: boolean } | null>(null)
  const [cap1, setCap1] = useState<boolean | null>(null) // null = chưa biết — chờ trước khi vẽ lưới ô
  const [cap2, setCap2] = useState<boolean | null>(null) // Thùy 11/09: cấp 2 (lớp 6-9) có layout KHU riêng
  const [ttCho, setTtCho] = useState(0) // số THẺ thành tựu đang chờ nhận quà — chỉ số trên ô Thành tựu
  const [maymanCoLuot, setMaymanCoLuot] = useState<boolean>(false) // badge ô "May mắn" (đủ điều kiện + chưa quay hôm nay)
  const [gioiTinh, setGioiTinh] = useState<'nam' | 'nu' | null>(null) // theme nam/nữ màn chính cấp 2/3 (kit hs-home-v4)
  const [anhUrl, setAnhUrl] = useState<string | null>(null) // avatar HS (đổi ngay trong app — ốp từ TA, mig 202609080215)
  // Ca yếu hôm nay (đã điểm danh) + retest đến hạn + LỊCH bổ trợ 3 loại (Thùy 09-09: box "Bổ trợ" LUÔN hiện, có lịch thì liệt kê).
  // coCa (Thùy 22/09, mig 202609221229): TRƯỚC chỉ tính ca YẾU (caCuaToi) — giờ OR thêm "có buổi ĐUỔI
  // hôm nay TA đã điểm danh" (lich[].vao_ca giờ đúng cho cả 2 loại) để box "Bổ trợ" bật y hệt Yếu khi
  // TA bấm Có mặt ở buổi đuổi. Route vào đâu (CaBoTroHS hay Lộ trình đuổi) xem onVaoCaBoTro().
  const [boTro, setBoTro] = useState<{ coCa: boolean; soRetest: number; lich: LichBoTro[] }>({ coCa: false, soRetest: 0, lich: [] })
  const [duoiLoTrinhMon, setDuoiLoTrinhMon] = useState<string | null>(null)
  const [buCa, setBuCa] = useState<string | null>(null) // Thùy 03/10: ca BÙ đang mở (buoi_id) — dạng của buổi đã nghỉ, học bằng màn Học từ đầu
  // Bấm "Bổ trợ" (banner cấp 1) hoặc "Vào ca luyện" (LichBoTroHS cấp 2/3, đã biết entry cụ thể): ca YẾU
  // luôn có sẵn đường CaBoTroHS riêng (tự fetch lại chi tiết) → ưu tiên đó nếu trùng cả 2 cùng lúc; ca
  // ĐUỔI thì mở "Lộ trình bổ trợ đuổi" (LoTrinhDuoiHS, mon lấy từ lịch — không cần RPC riêng).
  function onVaoCaBoTro(c?: LichBoTro) {
    if (c && c.loai === 'bu') { setBuCa(c.buoi_id); setDuoiLoTrinhMon(null); setDirect('bu_ca'); return }
    if (c && c.loai === 'bo_tro_duoi') { setBuCa(null); setDuoiLoTrinhMon(c.mon); setDirect('duoi_lo_trinh'); return }
    setDirect('bo_tro')
  }
  // Hòm thư — chỉ cần SỐ chưa đọc để hiện badge chuông (đếm items đang render, không phải tính nghiệp vụ).
  // + số bài BTVN đã trả em chưa mở (đếm ở DB — thư BTVN không nằm trong thong_bao_hs, xem HopThuHS).
  const [chuaDoc, setChuaDoc] = useState(0)
  const taiChuaDoc = () => Promise.all([
    listThongBaoHS().then((ds) => ds.filter((d) => !d.doc_at).length).catch(() => 0),
    demBaiTraChuaXem().catch(() => 0),
  ]).then(([tb, btvn]) => setChuaDoc(tb + btvn))

  // MÔN (28/09 vụ Gia Khiêm; 01/10 thành trục ngoài cùng): chọn môn ở màn chính ⇒ cả góc học tập (bài trên lớp/ET/BTVN,
  // bổ trợ, tự luyện, thông tin học tập, sổ tay, học từ đầu…) chạy theo môn đó; màn con đọc môn qua monCuaHS()/useMonHS().
  // Lỗi mạng ⇒ danh sách rỗng ⇒ không vẽ thanh chọn, màn con tự báo lỗi của nó như trước.
  const [lopMons, setLopMons] = useState<LopMonHS[]>([])
  const [monChon, setMonChon] = useState<string | null>(null)
  useEffect(() => { lopMonCuaHS().then((ds) => { setLopMons(ds); setMonChon(monDangChon(ds)) }).catch(() => {}) }, [])
  // Môn mở cho CẢ KHỐI (TSA khối 12, Thùy 03/10: "tự luyện TSA thành 1 mục riêng") — mỗi môn 1 ô riêng ở khối Học tập.
  // Bấm ô ⇒ đặt MÔN TẠM (màn con chạy theo môn đó, thanh chọn môn giữ nguyên); về màn chính ⇒ bỏ môn tạm.
  const [monRieng, setMonRieng] = useState<MonRiengHS[]>([])
  useEffect(() => { monRiengCuaHS().then(setMonRieng).catch(() => {}) }, [])

  useEffect(() => { listBaiTestCuaHS().then(setTests).catch(() => setTests([])) }, [])
  useEffect(() => { laCap1HS().then(setCap1).catch(() => setCap1(false)) }, [])
  useEffect(() => { laCap2HS().then(setCap2).catch(() => setCap2(false)) }, [])
  useEffect(() => { hoSoCuaToi().then((h) => { setGioiTinh(h?.gioi_tinh ?? null); setAnhUrl(h?.anh_url ?? null) }).catch(() => setGioiTinh(null)) }, [])
  useEffect(() => { taiChuaDoc() }, [])
  // Khối 6–12 dùng HomeHS912 + skin tự chọn (spec-giao-dien-hs.md; Thùy 28/09: mọi skin mở cho mọi em, cấp 1 còn HomeCap1).
  // giaoDien: undefined = đang tải · null = chưa có dòng hs_giao_dien ⇒ HomeHS912 mở hướng dẫn lần đầu.
  const [nhom912, setNhom912] = useState<boolean | null>(null)
  const [giaoDien, setGiaoDien] = useState<GiaoDien | null | undefined>(undefined)
  // NHÂN VẬT CHÍNH (Thùy 03/10): undefined = đang tải · null = chưa chọn ⇒ bấm Học tập hiện màn chọn · mã = dùng cho bản đồ/đấu trường
  const [nhanVat, setNhanVat] = useState<NvId | null | undefined>(undefined)
  useEffect(() => { if (HOC_TAP) nhanVatCuaToi().then((v) => setNhanVat(laNvChon(v) ? v : null)).catch(() => setNhanVat(null)) }, [])
  const [duLieu912, setDuLieu912] = useState<Home912 | null>(null)
  // số lời trả lời góp ý em chưa đọc (chấm đỏ ở menu ⋯) — đọc 1 lần lúc mở app; mở màn Góp ý ⇒ DB đánh dấu đã đọc, về Home thì về 0
  const [gopYMoi, setGopYMoi] = useState(0)
  // CHUỖI LÀM BÀI (spec-v1 §3): đọc lúc mở app + mỗi lần quay về màn chính (vừa luyện xong thì lửa sáng ngay). Tải lại NỀN — giữ số cũ tới khi có số mới.
  const [chuoi, setChuoi] = useState<Chuoi | null | undefined>(undefined)
  useEffect(() => { soGopYChuaDoc().then(setGopYMoi).catch(() => {}) }, [])
  useEffect(() => { if (direct === null) chuoiCuaToi().then(setChuoi).catch(() => setChuoi((c) => c ?? null)) }, [direct])
  // CÔNG TẮC TÍNH NĂNG (Thùy 07/10 — mở dần cho HS đỡ ngợp): hỏi DB mỗi lần về màn chính; lỗi ⇒ mở hết (công tắc hỏng không được làm mất app). Ô không có mã (bài trên lớp/ET/BTVN/bổ trợ) không bị ẩn.
  const [tn, setTn] = useState<TinhNangMo | undefined>(undefined)
  useEffect(() => { if (direct === null) tinhNangMoCuaToi().then(setTn).catch(() => setTn((c) => c ?? 'tat_ca')) }, [direct])
  const moTN = (ma: string) => tn === 'tat_ca' || (!!tn && tn.has(ma))
  const oMo = (id: string) => !MA_TINH_NANG_O[id] || moTN(MA_TINH_NANG_O[id])
  const rankMo = () => rankBat() && moTN('rank')
  // TUTORIAL DO LỘC DẪN (Thùy 07/10): tiến độ theo TÀI KHOẢN (hs_tutorial). Lần đầu (chưa xem/bỏ qua chặng nào) tự mở; sau đó tính năng MỚI mở ⇒ Lộc đứng góc màn chính
  // mời kể đúng phần mới. `tutXong` undefined = chưa tải/lỗi ⇒ không tự mở, không nhắc (hỏng thì im, không chặn app).
  const [tutXong, setTutXong] = useState<Set<string> | undefined>(undefined)
  const [tutDs, setTutDs] = useState<string[] | null>(null) // null = cả hành trình theo công tắc · mảng = chỉ các chặng này
  const daTuMoTut = useRef(false)
  useEffect(() => { if (direct === null) tutorialDaXem().then(setTutXong).catch(() => {}) }, [direct])
  const chuongMoi = tn === undefined || tutXong === undefined ? [] : chuongMo(moTN).filter((c) => !tutXong.has(c.id))
  useEffect(() => {
    if (direct !== null || daTuMoTut.current || !tutXong || tn === undefined) return
    if (tutXong.size === 0 && chuongMo(moTN).length > 0) { daTuMoTut.current = true; setTutDs(null); setDirect('tutorial') }
  }) // eslint-disable-line react-hooks/exhaustive-deps
  const thuNgay = (d: DichThu) => {
    setTuHome(d !== 'hoc_tap' && d !== 'luyen_yeu') // màn lẻ mở từ tutorial ⇒ "Quay lại" về màn chính
    if (d === 'hoc_tap') setDirect('tu_luyen_chon')
    else if (d === 'luyen_yeu') { setChuDeDang(null); setDirect('tu_luyen') }
    else setDirect(d)
  }
  useEffect(() => { khoiCuaHS().then((k) => setNhom912(!!k && KHOI_CHON_SKIN.has(k))).catch(() => setNhom912(false)) }, [])
  useEffect(() => {
    if (!nhom912) return
    // Lỗi mạng ⇒ coi như đã có lựa chọn mặc định (không bật hướng dẫn chỉ vì 1 lần gọi hỏng).
    giaoDienCuaToi().then(setGiaoDien).catch(() => setGiaoDien(GD_MAC_DINH))
  }, [nhom912])
  useEffect(() => { if (nhom912 && !direct && !khu) home912().then(setDuLieu912).catch(() => {}) }, [nhom912, direct, khu])
  // Thẻ Thế giới BK ở màn chính — tải lại mỗi lần về Home (quay từ Thế giới về là thấy số mới); lỗi thì thẻ vẫn hiện, không số.
  const [tgHome, setTgHome] = useState<TheGioiHome | null>(null)
  useEffect(() => { if (nhom912 && !direct && !khu) theGioiHome().then(setTgHome).catch(() => {}) }, [nhom912, direct, khu])
  // Log mở app (TT04 "Vào app liên tiếp"): ghi khi mở app và mỗi lần quay lại tab (server idempotent: 1 dòng/ngày)
  useEffect(() => {
    const ghi = () => { if (document.visibilityState === 'visible') ghiMoApp().catch(() => undefined) }
    ghi()
    document.addEventListener('visibilitychange', ghi)
    return () => document.removeEventListener('visibilitychange', ghi)
  }, [])
  // Thành tựu (Thùy 07/10): mỗi lần về màn chính đếm số thẻ đang chờ "Nhận quà" để ô Thành tựu hiện chỉ số (lỗi mạng giữ số cũ)
  useEffect(() => {
    if (direct || khu) return
    let bo = false
    thanhTuuChoNhan().then((n) => { if (!bo) setTtCho(n) }).catch(() => undefined)
    return () => { bo = true }
  }, [direct, khu])
  // RANK + NHIỆM VỤ của MÔN đang chọn trên màn chính (Thùy 01/10: ô Nhiệm vụ · ô Rank · huy hiệu bậc cạnh tên).
  // undefined = đang tải (ô hiện "…") · null = môn chưa mở rank/nhiệm vụ ⇒ ẩn ô + huy hiệu (dữ liệu quyết định, không if theo môn).
  // Tải lại mỗi lần về màn chính (vừa làm Thử thách/nhiệm vụ về là thấy số mới); lỗi mạng giữ số cũ, không xoá ô.
  const [rankHome, setRankHome] = useState<RankCuaToi | null | undefined>(undefined)
  const [nvHome, setNvHome] = useState<NhiemVuCuaToi | null | undefined>(undefined)
  useEffect(() => {
    if (!nhom912 || direct || khu || !monChon) return
    let bo = false
    if (rankBat()) rankCuaToi(monChon).then((r) => { if (!bo) setRankHome(r) }).catch(() => {})
    else setRankHome(null) // Rank tạm khoá (06/10): null ⇒ ẩn ô + huy hiệu bậc cạnh tên
    nhiemVuCuaToi(monChon).then((r) => { if (!bo) setNvHome(r) }).catch(() => {})
    return () => { bo = true }
  }, [nhom912, direct, khu, monChon])
  // Style (skin) của em áp cho TOÀN app, không chỉ Home (Thùy 29/09): biến --sk-* gắn lên <html>, mọi màn đọc qua skin/KhungHS.
  // Cấp 1 chưa có skin riêng ⇒ tạm Soft Hàn sáng.
  useApSkinGoc(nhom912 ? (giaoDien ?? GD_MAC_DINH) : GD_CAP1)
  // Tự luyện mở BẢN ĐỒ PHIÊU LƯU chỉ khi: cờ bật · em BẬT hiệu ứng game (hs_giao_dien.hieu_ung_game, Thùy 02/10) · style có bản đồ (Tối giản không có).
  // Còn lại ⇒ bài dạng thường. Hàm (không phải hằng) vì monChon khai sau; chỉ gọi trong xử lý bấm.
  const banDoBat = () => { const g = giaoDien ?? GD_MAC_DINH; return phieuLuuBat() && g.hieu_ung_game !== false && !!laySkin(g.skin).the3d }
  // Thùy 24/09: TRƯỚC chỉ kiểm 1 lần lúc mở app ⇒ học thuật chốt dạng đuổi SAU lúc em mở app (vụ Mạnh Duy 24/09 18:17) thì card
  // 'Học từ đầu' không hiện tới khi mở lại app. Giờ kiểm lại MỖI LẦN về màn chính (direct/khu = null) + khi app quay lại từ nền.
  // Lỗi mạng giữ nguyên trạng thái cũ (không tắt card đang hiện vì 1 lần gọi hỏng).
  const kiemHTD = () => monCuaHS().then((m) => { if (!m) return; setHtdMon(m); return htdCoMo(m) }).then((mo) => { if (mo !== undefined) setHtdMo(!!mo) }).catch(() => {})
  useEffect(() => { if (!direct && !khu) datMonTam(null) }, [direct, khu]) // TRƯỚC kiemHTD: về màn chính là về môn đã chọn
  useEffect(() => { if (!direct && !khu) kiemHTD() }, [direct, khu])
  function doiMon(m: string) {
    if (m === monChon) return
    chonMonHS(m); setMonChon(m)
    setRankHome(undefined); setNvHome(undefined) // rank/nhiệm vụ là của TỪNG môn — đổi môn thì xoá số môn cũ trước khi tải
    setHtdMo(false); kiemHTD() // card "Học từ đầu" là của TỪNG môn — tắt cái của môn cũ, hỏi lại cho môn mới
  }
  useEffect(() => {
    const f = () => { if (document.visibilityState === 'visible') kiemHTD() }
    document.addEventListener('visibilitychange', f)
    return () => document.removeEventListener('visibilitychange', f)
  }, [])
  // Badge ô "May mắn" — có 1 lượt để quay khi (đủ điều kiện + chưa quay hôm nay + active).
  // Cả cấp 1 (HomeCap1 → BOX_CAP1 có ô 'may_man') LẪN cấp 2 (KHU_CAP2) đều có ô này → cả 2 phải
  // refetch badge (bug 17/09: guard `!cap2` cắt cấp 1, 14 HS cấp 1 đủ ĐK nhưng badge tắt câm, không
  // ai vào bấm quay → qua đêm mất lượt vì `bt.ngay=v_today` intent CEO). Cấp 3 (10-12) không có ô.
  // Refetch khi rời màn quay (direct đổi) để badge cập nhật ngay sau khi HS quay xong.
  useEffect(() => {
    if (cap1 === null || cap2 === null || direct || khu) return
    if (!cap1 && !cap2) return
    mayManHSCuaToi().then((d) => setMaymanCoLuot(!!d.active && !d.hom_nay && !!d.du_dieu_kien.du)).catch(() => setMaymanCoLuot(false))
  }, [cap1, cap2, direct, khu])
  useEffect(() => {
    // Hold retest (Thùy 29/09): không gọi — ô "Bài kiểm tra lại" không hiện (DB cũng trả rỗng).
    const tai = () => Promise.all([caCuaToi().catch(() => null), RETEST_BAT ? retestCuaToi().catch(() => []) : Promise.resolve([] as RetestCuaToi[]), lichBoTroCuaToi().catch(() => [] as LichBoTro[])])
      .then(([ca, rt, lich]) => setBoTro({ coCa: !!ca || lich.some((l) => l.vao_ca && (l.loai === 'bo_tro_duoi' || l.loai === 'bu')), soRetest: rt.filter((r) => !r.da_nop).length, lich }))
    tai()
    const id = setInterval(() => { if (document.visibilityState === 'visible' && !direct && !khu) tai() }, 15000)
    return () => clearInterval(id)
  }, [direct, khu])

  // Bổ trợ của MÔN đang chọn. Ca ĐANG TỚI GIỜ (vao_ca) của môn khác vẫn giữ — không để em lỡ ca chỉ vì đang đứng ở môn
  // khác; buổi không gắn môn (mon null) hiện ở mọi môn.
  const lichMon = boTro.lich.filter((l) => !monChon || !l.mon || l.mon === monChon || l.vao_ca)
  const monCoKho = lopMons.find((l) => l.mon === monChon)?.co_kho ?? true

  // Lớp 9–12 bỏ màu gán theo giới tính ở các màn con (HS chê — spec-giao-dien-hs.md §3): null = bản trung tính.
  const gt = nhom912 ? null : gioiTinh

  if (doiMK) return <DoiMatKhau maHS={maHS} batBuoc={false} onXong={() => setDoiMK(false)} />

  // KHU HỌC TẬP (Thùy 03/10, spec-che-do-game §7): 5 ô — giữ tên trạng thái 'tu_luyen_chon' để mọi nút "lùi" cũ về đúng khu này.
  if (direct === 'tu_luyen_chon' && !HOC_TAP) return <ChonLoaiTuLuyen gioiTinh={gt}
    onTongHop={() => { setChuDeDang(null); setDirect('tu_luyen') }}
    onChuDe={() => setDirect(giaoDien?.skin && monChon && banDoBat() ? 'phieu_luu' : 'tu_luyen_chu_de_ds')}
    onThuThach={() => setDirect('thu_thach')}
    onRank={rankMo() ? () => { setTuHoSo(false); setTuHome(false); setDirect('rank') } : undefined}
    onNhiemVu={() => { setTuHome(false); setDirect('nhiem_vu') }}
    onBack={() => setDirect(null)} />
  // lần đầu vào khu Học tập (chưa có nhân vật) ⇒ chọn nhân vật trước · 'doi_nhan_vat' = đổi từ nút ở đầu khu Học tập
  if ((direct === 'tu_luyen_chon' && nhanVat === null) || direct === 'doi_nhan_vat') return <ChonNhanVatHS dangCo={nhanVat ?? null} luu={chonNhanVat}
    onXong={(id) => { setNhanVat(id); setDirect('tu_luyen_chon') }} onBack={() => setDirect(direct === 'doi_nhan_vat' ? 'tu_luyen_chon' : null)} />
  if (direct === 'tu_luyen_chon') return <HocTapHS nhanVat={nhanVat ?? null} onDoiNhanVat={() => setDirect('doi_nhan_vat')}
    onNap={monChon && laySkin((giaoDien ?? GD_MAC_DINH).skin).the3d ? () => napPhieuLuu(monChon) : undefined}
    // trong khu Học tập, đảo 'Học theo chủ đề' LUÔN là bản đồ (không cần cờ phieuluu riêng); chỉ lùi về danh sách dạng khi chưa có môn / style không có bản đồ
    onChuDe={() => { const g = giaoDien ?? GD_MAC_DINH; setDirect(monChon && laySkin(g.skin).the3d ? 'phieu_luu' : 'tu_luyen_chu_de_ds') }}
    onYeu={() => { setChuDeDang(null); setDirect('tu_luyen') }}
    onDauTruong={() => setDirect('dau_truong_bk')}
    onChinhPhuc={() => setDirect('chinh_phuc_bk')}
    onGiai={() => setDirect('giai_vo_dich')}
    sapRa={{ chinh_phuc: !moTN('chinh_phuc'), giai_vo_dich: !moTN('giai_vo_dich') }}
    onRank={rankMo() ? () => { setTuHoSo(false); setTuHome(false); setDirect('rank') } : undefined}
    onNhiemVu={() => { setTuHome(false); setDirect('nhiem_vu') }}
    onBack={() => setDirect(null)} />
  if (direct === 'dau_truong_bk') return <GameNhungHS vao="chu_de" tieuDe="Đấu trường BK" onBack={() => setDirect('tu_luyen_chon')} />
  if (direct === 'chinh_phuc_bk') return <ChinhPhucHS onBack={() => setDirect('tu_luyen_chon')} />
  if (direct === 'giai_vo_dich') return <GiaiVoDichHS onBack={() => setDirect('tu_luyen_chon')} onDauMay={() => setDirect('thu_thach')} />
  if (direct === 'phieu_luu' && monChon) return <Suspense fallback={<ManChoChuyen />}><PhieuLuuHS hocSinhId={hocSinhId} mon={monChon} gioiTinh={gioiTinh} nhanVat={nhanVat} skin={(giaoDien ?? GD_MAC_DINH).skin} LamBai={LamBai} onVe={() => setDirect(HOC_TAP ? 'tu_luyen_chon' : null)}
    onTongHop={() => { setChuDeDang(null); setDirect('tu_luyen') }} onThuThach={() => setDirect('thu_thach')} /></Suspense>
  if (direct === 'nhiem_vu') return <NhiemVuHS gioiTinh={gt} onBack={() => setDirect(tuHome ? null : 'tu_luyen_chon')}
    onLuyenYeu={() => { setChuDeDang(null); setDirect('tu_luyen') }} onVongQuay={() => setDirect('may_man')} />
  if (direct === 'thu_thach') return <LamThuThach hocSinhId={hocSinhId} desktop={!!cap1}
    onXong={() => setDirect('tu_luyen_chon')} onRank={rankMo() ? () => { setTuHoSo(false); setDirect('rank') } : undefined} />
  if (direct === 'rank') return <RankHS gioiTinh={gt} onBack={() => setDirect(tuHoSo ? 'ho_so' : tuThuVien ? 'thu_vien' : tuHome ? null : 'tu_luyen_chon')} onThuThach={() => setDirect('thu_thach')} />
  // THƯ VIỆN BK (Thùy 03/10): "nơi tìm hiểu mọi thông tin trên app" — thẻ con: Rank (của môn đang chọn).
  if (direct === 'thu_vien') {
    const r = rankHome?.toi
    return <ThuVienHS onBack={() => { setTuThuVien(false); setDirect(null) }} the={[{
      id: 'huong_dan', ten: 'Hướng dẫn chơi', icon: '📖', moTa: 'Mọi chức năng của app và cách vận hành: nhiệm vụ, chuỗi, huy hiệu, xu…', trangThai: null,
      onClick: () => setDirect('huong_dan'),
    }, {
      id: 'rank', ten: 'Rank', icon: '🛡️', moTa: 'Cấp bậc chiến binh của em theo từng môn — làm Thử thách để leo bậc.',
      anh: (r ? anhBac(r.bac, 'bieu_tuong') : null) ?? laySkin((giaoDien ?? GD_MAC_DINH).skin).anhO?.rank ?? null,
      trangThai: rankHome === undefined ? undefined : r ? `${monChon ?? ''} · ${r.ten_bac}${r.sao ? ` ${'★'.repeat(r.sao)}` : ''} · hạng ${r.hang_khoi}/${r.so_em_khoi}` : 'Chưa có điểm mùa này',
      onClick: () => { setTuThuVien(true); setTuHoSo(false); setTuHome(false); setDirect('rank') },
    }].filter((t) => t.id !== 'rank' || rankMo())} />
  }
  // TRÒ CHƠI (06/10): danh sách game; Nông trại BK nhúng iframe (public/games/nong-trai — scripts/dong-bo-nong-trai.mjs)
  if (direct === 'nong_trai') return <GameNongTraiHS onBack={() => setDirect('tro_choi')} />
  if (direct === 'tro_choi') return <TroChoiHS onBack={() => setDirect(null)} onChoi={(id) => { if (id === 'nong_trai') setDirect('nong_trai') }} />
  // HƯỚNG DẪN CHƠI (Thùy 03/10): gallery giải thích mọi chức năng — vào từ Thư viện BK.
  if (direct === 'tutorial') {
    const dsT = tutDs ? chuongMo(moTN).filter((c) => tutDs.includes(c.id)) : undefined
    return <TutorialHS mo={moTN} danhSach={dsT && dsT.length ? dsT : undefined}
      onXongChuong={(id) => { void tutorialGhi([id], 'xem').catch(() => {}); setTutXong((s) => new Set([...(s ?? []), id])) }}
      onBoQua={(ids) => { void tutorialGhi(ids, 'bo_qua').catch(() => {}); setTutXong((s) => new Set([...(s ?? []), ...ids])) }}
      onThu={thuNgay} onXong={() => setDirect(null)} />
  }
  if (direct === 'huong_dan') return tutChuong !== undefined
    ? <TutorialHS chuong={tutChuong} onXong={() => setTutChuong(undefined)} />
    : <HuongDanHS onBack={() => setDirect('thu_vien')} onTutorial={setTutChuong} />
  // HỒ SƠ (DON-HANG-GAMI-HS Đơn 4): bấm avatar ở màn chính. Đổi ảnh đại diện nằm trong Hồ sơ (bấm avatar trong khung).
  if (direct === 'ho_so') return <HoSoHS hoTen={hoTen} anhUrl={anhUrl} mons={lopMons} mon={monChon} onChonMon={doiMon}
    avatar={<AvatarHS anhUrl={anhUrl} initials={hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()} size={82} fill="var(--sk-surface2)" badge="var(--sk-acc)" onChanged={setAnhUrl} />}
    onBack={() => { setTuHoSo(false); setDirect(null) }}
    onRank={rankMo() ? () => { setTuHoSo(true); setTuHome(false); setDirect('rank') } : undefined} onAlbum={() => { setTuHoSo(true); setDirect('album') }}
    onGopY={() => { setTuHoSo(true); setDirect('gop_y') }} />
  if (direct === 'gop_y') return <GopYHS tu={tuHoSo ? 'ho_so' : 'home'} onBack={() => { setGopYMoi(0); setDirect(tuHoSo ? 'ho_so' : null) }} />
  if (direct === 'tu_luyen_chu_de_ds') return <ChonDangChuDe gioiTinh={gt}
    onPick={(d) => { setChuDeDang(d); setDirect('tu_luyen') }}
    onBack={() => setDirect(layMonTam() ? null : 'tu_luyen_chon')} />
  if (direct === 'tu_luyen') {
    const g = giaoDien ?? GD_MAC_DINH, b3d = laySkin(g.skin).the3d
    // Luyện dạng yếu (tổng hợp, không chọn dạng): MÀN GIỚI THIỆU trước → rồi vào khung đấu chung nếu "Hiệu ứng game" BẬT và style có hỗ trợ; tắt ⇒ làm bài dạng thường.
    if (!chuDeDang && !yeuVao) return <GioiThieuYeu mon={monChon} nv={nhanVat ?? gioiTinh ?? 'nam'} khungGame={g.hieu_ung_game !== false && !!b3d}
      onBatDau={() => setYeuVao(true)} onBack={() => setDirect('tu_luyen_chon')} />
    if (!chuDeDang && yeuVao && monChon && b3d && g.hieu_ung_game !== false) return (
      <Suspense fallback={<ManChoChuyen chu="Đang gọi quái ra…" />}>
        <LuyenYeuDau mon={monChon} hocSinhId={hocSinhId} nv={nhanVat ?? gioiTinh ?? 'nam'} b={b3d} LamBai={LamBai} onVe={() => { setYeuVao(false); setDirect('tu_luyen_chon') }} />
      </Suspense>
    )
    return <LamTuLuyen hocSinhId={hocSinhId} chuDe={chuDeDang}
      onXong={() => { setYeuVao(false); setDirect(null); setChuDeDang(null) }}
      onDoiDang={() => setDirect('tu_luyen_chu_de_ds')}
      desktop={!!cap1} />
  }
  if (direct === 'htd_chu_de' && htdMon) return <ChonChuDeHTD mon={htdMon} gioiTinh={gt}
    onPick={(cd) => { setDuoiLoTrinhMon(null); setBuCa(null); setHtdChuDe(cd); setDirect('htd_chuyen_de') }}
    onBack={() => setDirect(null)} />
  if (direct === 'htd_chuyen_de' && htdChuDe) return <ChonChuyenDeHTD chuDe={htdChuDe} gioiTinh={gt}
    onPick={(cde) => {
      setHtdChuyenDe(cde)
      const d = dangDangHoc(cde)
      setHtdDang({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, xong: d.xong })
      setDirect('htd_dang')
    }}
    onBack={() => setDirect('htd_chu_de')} />
  if (direct === 'htd_dang' && htdDang) return <ChiTietDangHTD dang={htdDang} dangCungChuyenDe={htdChuyenDe?.dangs ?? []} gioiTinh={gt}
    onLyThuyet={() => setDirect('htd_ly_thuyet')}
    onLuyenTap={() => setDirect('htd_luyen')}
    onTest={() => setDirect('htd_test')}
    onBack={() => setDirect(buCa ? 'bu_ca' : duoiLoTrinhMon ? 'duoi_lo_trinh' : 'htd_chuyen_de')} />
  if (direct === 'htd_ly_thuyet' && htdMon && htdDang) return <LyThuyetHTD mon={htdMon} dang={htdDang} gioiTinh={gt}
    onBack={() => setDirect('htd_dang')} />
  if ((direct === 'htd_luyen' || direct === 'htd_test') && htdMon && htdDang) return <LamHTD
    key={direct} hocSinhId={hocSinhId} mon={htdMon} dang={htdDang} loai={buCa ? (direct === 'htd_luyen' ? 'bu_luyen' : 'bu_test') : direct === 'htd_luyen' ? 'htd_luyen' : 'htd_test'} /* bù = 100% MCQ (Thùy 03/10) */
    desktop={!!cap1}
    onVeChiTiet={() => setDirect('htd_dang')}
    onSangTest={() => setDirect('htd_test')}
    onXongDang={() => setDirect(buCa ? 'bu_ca' : duoiLoTrinhMon ? 'duoi_lo_trinh' : 'htd_chu_de')} />
  if (direct === 'thong_tin') return <ThongTinHocTap hocSinhId={hocSinhId} gioiTinh={gt} onXong={() => setDirect(null)} />
  if (direct === 'xep_hang') return cap1 ? <BangXepHang onXong={() => setDirect(null)} /> : <BangXepHangHS onBack={() => setDirect(null)} />
  if (direct === 'bo_tro') return <CaBoTroHS hocSinhId={hocSinhId} desktop={!!cap1} gioiTinh={gt} onXong={() => setDirect(null)} LamBai={LamBai} LamET={LamET} />
  if (direct === 'bu_ca' && buCa) return <CaBuHS buoiId={buCa} onBack={() => { setBuCa(null); setDirect('lich_bo_tro') }}
    onPickDang={(d, mon) => { setHtdMon(mon); setHtdChuyenDe(null); setHtdDang({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, xong: false }); setDirect('htd_dang') }} />
  if (direct === 'duoi_lo_trinh' && duoiLoTrinhMon) return <LoTrinhDuoiHS mon={duoiLoTrinhMon} gioiTinh={gt}
    onPickDang={(d, cde) => { setHtdMon(duoiLoTrinhMon); setHtdChuyenDe(cde); setHtdDang({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, xong: d.xong }); setDirect('htd_dang') }}
    onBack={() => setDirect(null)} />
  if (direct === 'retest') return <RetestHS hocSinhId={hocSinhId} gioiTinh={gt} onXong={() => setDirect(null)} LamET={LamET} />
  if (direct === 'lich_bo_tro') return <LichBoTroHS lich={lichMon} coCa={boTro.coCa} gioiTinh={gt} onXong={() => setDirect(null)} onVaoCa={onVaoCaBoTro} />
  if (direct === 'hop_thu') return <HopThuHS onXong={() => { setDirect(null); taiChuaDoc() }} />
  if (direct === 'may_man') return <MayManHS gioiTinh={gt} onXong={() => setDirect(null)} onNhiemVu={() => { setTuHome(true); setDirect('nhiem_vu') }} />
  if (direct === 'thanh_tuu') return <ThanhTuuHS gioiTinh={gt} onXong={() => setDirect(null)} onAlbum={() => { setTuHoSo(false); setDirect('album') }} />
  if (direct === 'album') return <AlbumHS gioiTinh={gt} onBack={() => setDirect(tuHoSo ? 'ho_so' : 'thanh_tuu')} />
  if (direct === 'bai_tap_giao') return <BaiTapGiaoHS gioiTinh={gt} onXong={() => setDirect(null)} />
  if (direct === 'so_tay') return <SoTayHS gioiTinh={gt} onXong={() => setDirect(null)} />
  if (direct === 'vi_xu') return <ViXuHS gioiTinh={gt} onXong={() => setDirect(null)} />
  if (direct === 'the_gioi') return <TheGioiHS onBack={() => setDirect(null)} />

  if (active) {
    const back = () => { setActive(null); listBaiTestCuaHS().then(setTests) }
    return THI_LOAI.has(active.loai)
      ? <LamET test={active} hocSinhId={hocSinhId} onXong={back} />
      : <LamBai baiTestId={active.id} hocSinhId={hocSinhId} onXong={back} />
  }

  const xongCua = (t: BaiTestCuaHS) => t.bai_lam?.trang_thai === 'da_nop'
  // Bài trên lớp/ET/BTVN/đề thi của MÔN đang chọn (bai_test.mon) — trước 01/10 hiện lẫn mọi môn.
  const cuaKhu = (id: KhuId) => {
    const loai = KHU.find((k) => k.id === id)?.loai
    return loai ? (tests ?? []).filter((t) => t.loai === loai && (!monChon || t.mon === monChon)) : []
  }
  // Số việc đang chờ của TỪNG môn (chấm số trên nút môn ở thanh chọn môn) = bài còn làm được ở các ô danh sách ĐANG HIỆN
  // (cấp 3; cấp 1–2 không có ô ET/BTVN) + buổi bổ trợ hôm nay. Đếm item hiển thị cho badge, không phải chỉ số nghiệp vụ.
  const loaiHien = new Set(cap1 || cap2 ? [] : KHU.filter((k) => !KHU_CHI_CAP1.has(k.id) && k.loai).map((k) => k.loai!))
  const demMon: Record<string, number> = Object.fromEntries(lopMons.map((m) => [m.mon,
    (tests ?? []).filter((t) => t.mon === m.mon && loaiHien.has(t.loai) && !xongCua(t) && !daHetHan(t)).length
    + boTro.lich.filter((l) => l.mon === m.mon && l.hom_nay).length]))
  // Ô cần kho mà môn đang chọn chưa có kho ⇒ khoá + báo (đè sub/onClick của ô).
  const khoaThieuKho = (id: KhuId): Partial<HomeCard> => KHU_CAN_KHO.has(id) && !monCoKho
    ? { sub: `${monChon} chưa mở`, subMau: 'xam', disabled: true, onClick: undefined, badge: 0 } : {}
  // Danh tính hiển thị = lớp của MÔN ĐANG CHỌN (hs_lop_mon_cua_toi). Bản cũ lấy tests[0] — em nhiều môn thì
  // hiện lớp của bài test nào tình cờ đứng đầu; giữ làm đường lùi khi danh sách môn chưa tải được.
  const lopCuaMon = lopMons.find((l) => l.mon === monChon)
  const lopMon = lopCuaMon ? `${lopCuaMon.ten_lop} · ${lopCuaMon.mon}` : tests?.[0] ? `${tests[0].lop_ten} · ${tests[0].mon}` : null

  // Ô NHIỆM VỤ / RANK trên màn chính (Thùy 01/10) — số lấy nguyên từ RPC của MÔN đang chọn. null ⇒ ẩn ô (môn chưa mở / không phải
  // màn chính 6–12). Badge = số nhiệm vụ ngày CHƯA xong (đếm dòng đang hiện ở màn Nhiệm vụ, không phải chỉ số nghiệp vụ).
  // Ô Rank hiện BIỂU TƯỢNG BẬC của chính em thay icon chung của style.
  const moTuHome = (d: 'nhiem_vu' | 'rank') => () => { setTuHome(true); setTuHoSo(false); setDirect(d) }
  const oGami = (id: KhuId): Partial<HomeCard> | null | undefined => {
    if (id === 'nhiem_vu') {
      if (!nhom912 || nvHome === null) return null
      if (nvHome === undefined) return { sub: '…', subMau: 'xam', onClick: moTuHome('nhiem_vu') }
      if (!nvHome.mo) return { sub: `Mở từ ${nvHome.bat_dau.split('-').reverse().slice(0, 2).join('/')}`, subMau: 'xam', onClick: moTuHome('nhiem_vu') }
      const conLai = nvHome.ngay.con_lai
      return { sub: conLai > 0 ? `Hôm nay còn ${conLai} lượt thưởng` : 'Đủ thưởng hôm nay!', subMau: conLai > 0 ? 'ton' : 'xanh', badge: nvHome.ngay.luot_hom_nay === 0 ? 1 : 0, onClick: moTuHome('nhiem_vu') }
    }
    if (id === 'thanh_tuu') return ttCho > 0 ? { sub: `${ttCho} quà chờ nhận!`, subMau: 'ton', badge: ttCho } : { sub: 'Xem thành tựu của em', subMau: 'xam' }
    if (id === 'rank') {
      if (!nhom912 || rankHome === null) return null
      const t = rankHome?.toi
      if (!t) return { sub: rankHome === undefined ? '…' : 'Chưa có điểm mùa này', subMau: 'xam', onClick: moTuHome('rank') }
      return { sub: `${t.ten_bac}${t.sao ? ` ${'★'.repeat(t.sao)}` : ''} · hạng ${t.hang_khoi}/${t.so_em_khoi}`, subMau: 'ton', anh: anhBac(t.bac, 'bieu_tuong') ?? undefined, onClick: moTuHome('rank') }
    }
    return undefined
  }
  const anO = new Set((['nhiem_vu', 'rank'] as KhuId[]).filter((id) => oGami(id) === null || !oMo(id)))
  for (const id of Object.keys(MA_TINH_NANG_O) as KhuId[]) if (!oMo(id)) anO.add(id)

  const CHU_DUOI: Partial<Record<KhuId, string>> = { tu_luyen: HOC_TAP ? 'Cùng BK chinh phục thế giới' : 'Luyện theo dạng yếu', thong_tin: 'Dạng đang yếu', tro_choi: 'Nông trại BK và các game khác', xep_hang: 'Xem em đứng hạng mấy', so_tay: 'Tra lý thuyết & bài mẫu', the_gioi: 'Xem HS BK đang khoe gì', thu_vien: 'Tìm hiểu mọi thứ trên app' }

  // ── MÀN CHÍNH: ô vuông (theo cấp/khối), 2 cột ─────────────────────────────
  if (!khu && (cap1 === null || cap2 === null || nhom912 === null || tn === undefined || (nhom912 && giaoDien === undefined))) return <ManCho>Đang tải…</ManCho>
  // CẤP 1 (Thùy 12/09: "cấp 1 học sinh không dùng điện thoại — chỉ iPad hoặc laptop") — HomeCap1
  // desktop/iPad-first (grid 3 cột full màn theo mockup CEO), KHÔNG dùng HomeHS mobile centered
  // (max-w 430 hoang phí 2 bên trên iPad/laptop). BOX_CAP1 đã đồng bộ nội dung KHU_CAP2: Tự luyện ·
  // Thông tin học tập · Đề thi thử (sắp có) · Bài tập được giao · Thành tựu · May mắn.
  // Lời mời quay tự hiện (06/10): có lượt (cũ: cap1/cap2 qua mayManHSCuaToi; mới: nvHome.vong_quay) và chưa quay hôm nay — ô May mắn đã ẩn khỏi màn chính
  const coQuay = moTN('nhiem_vu') && (maymanCoLuot || (!!nvHome && nvHome.mo && nvHome.vong_quay.du && !nvHome.vong_quay.da_quay))
  const moiQuay = <><MoiQuayMayMan coLuot={coQuay} onQuay={() => setDirect('may_man')} />
    {tutXong && tutXong.size > 0 && <LocMoi n={chuongMoi.length} ten={NGUOI_DAN_LOC} onMo={() => { setTutDs(chuongMoi.map((c) => c.id)); setDirect('tutorial') }} />}</>
  if (!khu && cap1) return <>{moiQuay}<HomeCap1 hoTen={hoTen} maHS={maHS} maymanCoLuot={maymanCoLuot} thanhTuuCho={ttCho} chiHien={oMo}
    onOpen={(d) => setDirect(d === 'tu_luyen' ? 'tu_luyen_chon' : d)} chuaDoc={chuaDoc} onHopThu={() => setDirect('hop_thu')}
    extra={<>
      {moTN('chuoi') && chuoi && <div className="mt-5"><BannerChuoi c={chuoi} onLuyen={() => setDirect('tu_luyen_chon')} /></div>}
      <ThanhChonMon mons={lopMons} mon={monChon} onChon={doiMon} className="mt-5" dem={demMon} luonHien
        nut={(chon) => chon
          ? { background: 'linear-gradient(135deg, #6549ea, #8368f7)', color: '#fff', boxShadow: '0 6px 16px rgba(101,73,234,.28)', fontSize: 15, padding: '9px 20px' }
          : { background: '#fff', color: '#576073', boxShadow: '0 6px 16px rgba(31,47,79,.06)', fontSize: 15, padding: '9px 20px' }} />
      <BoTroBanner lich={lichMon} coCa={boTro.coCa} soRetest={boTro.soRetest} desktop onLich={() => setDirect('lich_bo_tro')} onCa={() => onVaoCaBoTro(boTro.lich.find((l) => l.vao_ca))} onRetest={() => setDirect('retest')} />
    </>} /></>
  // CẤP 2 (khối 6-9) — HomeHS mobile-first + KHU_CAP2 (đã build cho phone: em cấp 2 có thể dùng
  // điện thoại). CẤP 3 (khối 10-12): giữ KHU cũ (BTL/ET/BTVN), không đụng flow đang chạy.
  // HomeHS thuần vẽ. Badge = việc CÒN LÀM ĐƯỢC (bài quá hạn không đếm vào badge — nhiễu).
  // "Học từ đầu" (Thùy 19/09) — card RỜI, không qua KHU/KHU_CAP2/KIT_O (id không nằm trong
  // KhuId — chỉ hiện khi có case bổ trợ đuổi đang mở, không đáng thêm hẳn vào 2 danh mục
  // tĩnh kia). Cùng style HomeCard/BoxCap1 nhưng build tay 1 chỗ, dùng chung cho cả cấp 2/3.
  // Ô RIÊNG của môn mở cả khối (TSA khối 12) — đứng ngay sau ô Tự luyện, không theo thanh chọn môn.
  const theCardRieng: HomeCard[] = monRieng.map((m) => ({
    id: 'tu_luyen_rieng', ten: `Tự luyện ${m.mon}`, nhom: 'hoc' as const,
    sub: m.co_kho ? 'Luyện theo từng dạng' : `${m.mon} chưa mở`, subMau: 'xam' as const, disabled: !m.co_kho,
    ill: 'self_practice_target', emoji: '🎯', icon: '🎯', doodle: '', tone: 'green' as const,
    onClick: m.co_kho ? () => { datMonTam(m.mon); setChuDeDang(null); setDirect('tu_luyen_chu_de_ds') } : undefined,
  }))
  const chenRieng = (ds: HomeCard[]) => { const i = ds.findIndex((c) => c.id === 'tu_luyen'); return i < 0 ? [...theCardRieng, ...ds] : [...ds.slice(0, i + 1), ...theCardRieng, ...ds.slice(i + 1)] }
  const theCardHTD: HomeCard[] = htdMo
    ? [{ id: 'hoc_tu_dau', ten: 'Học từ đầu', sub: 'Bổ trợ đuổi — học tuần tự từng dạng', subMau: 'ton',
        ill: 'self_practice_target', emoji: '🚀', icon: '🚀', doodle: 'Từng bước một!', tone: 'purple',
        onClick: () => setDirect('htd_chu_de') }]
    : []
  if (!khu) {
    const cards: HomeCard[] = chenRieng(cap2
      ? [...KHU_CAP2.filter((k) => !anO.has(k.id)).map((k) => {
          const [sub, subMau]: [string, HomeCard['subMau']] =
            k.sapCo ? ['Sắp có', 'xam']
            : k.id === 'thanh_tuu' ? ['Xem giải thưởng của em', 'xam']
            : k.id === 'may_man' ? (maymanCoLuot ? ['Có 1 lượt quay!', 'ton'] : ['Chưa có lượt hôm nay', 'xam'])
            : k.id === 'bai_tap_giao' ? ['Đang phát triển', 'xam']
            : k.id === 'tu_luyen' ? [HOC_TAP ? 'Cùng BK chinh phục thế giới' : 'Luyện theo dạng yếu', 'xam']
            : k.id === 'thong_tin' ? ['Dạng đang yếu', 'xam']
            : k.id === 'so_tay' ? ['Tra lý thuyết & bài mẫu', 'xam']
            : k.id === 'vi_xu' ? ['Xem xu & lịch sử', 'xam']
            : k.id === 'the_gioi' ? ['Xem HS BK đang khoe gì', 'xam']
            : k.id === 'thu_vien' ? ['Tìm hiểu mọi thứ trên app', 'xam']
            : k.id === 'tro_choi' ? ['Nông trại BK và các game khác', 'xam']
            : k.id === 'xep_hang' ? ['Xem em đứng hạng mấy', 'xam']
            : ['', 'xam']
          const badge = k.id === 'may_man' && maymanCoLuot ? 1 : 0
          return {
            id: k.id, ten: k.ten, icon: k.icon, sub, subMau, badge, disabled: !!k.sapCo, lon: k.id === 'xep_hang', nhom: KHU_CHOI.has(k.id) ? 'choi' : 'hoc', ...KIT_O[k.id], ...(k.sapCo ? { ill: 'mock_exam_locked', emoji: undefined, doodle: 'Sắp ra mắt! Hãy chờ nhé!', tone: 'gray' as const } : {}),
            onClick: k.sapCo ? undefined : k.direct
              ? () => setDirect(k.id === 'tu_luyen' ? (HOC_TAP || !(monChon && banDoBat()) ? 'tu_luyen_chon' : 'phieu_luu') : (k.id as 'thong_tin' | 'xep_hang' | 'may_man' | 'thanh_tuu' | 'so_tay' | 'vi_xu' | 'the_gioi' | 'thu_vien' | 'tro_choi'))
              : () => { setKhu(k.id); setTab('chua') },
            ...khoaThieuKho(k.id),
            ...(oGami(k.id) ?? {}),
          } satisfies HomeCard
        }), ...theCardHTD]
      : [...KHU.filter((k) => !KHU_CHI_CAP1.has(k.id) && !anO.has(k.id)).map((k) => {
          const sapCo = !k.loai && !k.direct
          const ds = k.loai ? cuaKhu(k.id) : []
          const nChuaLam = ds.filter((t) => !xongCua(t) && !daHetHan(t)).length
          const nQuaHan = ds.filter((t) => !xongCua(t) && daHetHan(t)).length
          const [sub, subMau]: [string, HomeCard['subMau']] =
            sapCo ? ['Sắp có', 'xam']
            : k.direct ? [CHU_DUOI[k.id] ?? '', 'xam']
            : tests === null ? ['…', 'xam']
            : nChuaLam > 0 ? [`${nChuaLam} bài chưa làm`, 'ton']
            : nQuaHan > 0 ? [`${nQuaHan} bài quá hạn`, 'do']
            : ds.length ? ['Xong hết rồi', 'xanh'] : ['Chưa có bài', 'xam']
          return {
            id: k.id, ten: k.ten, icon: k.icon, sub, subMau, badge: nChuaLam, disabled: sapCo, nhom: KHU_CHOI.has(k.id) ? 'choi' : 'hoc', ...KIT_O[k.id],
            onClick: sapCo ? undefined : k.direct ? () => setDirect(k.id === 'tu_luyen' ? 'tu_luyen_chon' : (k.id as 'thong_tin' | 'xep_hang' | 'so_tay' | 'the_gioi' | 'thu_vien' | 'tro_choi')) : () => { setKhu(k.id); setTab('chua') },
            ...khoaThieuKho(k.id),
            ...(oGami(k.id) ?? {}),
          } satisfies HomeCard
        }), ...theCardHTD])
    // Lớp 9–12: cùng danh sách ô (giữ nguyên chức năng từng khối), khác màn vẽ — HomeHS912 + skin tự chọn.
    if (nhom912 && giaoDien !== undefined) return <>{moiQuay}<MungMocChuoi c={moTN('chuoi') ? chuoi : null} hsId={hocSinhId} /><HomeHS912 giaoDien={giaoDien} onDaLuu={setGiaoDien} data={duLieu912}
      hoTen={hoTen} maHS={maHS} lopMon={lopMon} anhUrl={anhUrl} onAnhChanged={setAnhUrl} chuaDoc={chuaDoc}
      mons={lopMons} mon={monChon} onChonMon={doiMon} demMon={demMon}
      lich={lichMon} soRetest={boTro.soRetest} cards={cards}
      onHopThu={() => setDirect('hop_thu')} onDoiMK={() => setDoiMK(true)} onThoat={() => supabase.auth.signOut()}
      onLich={() => setDirect('lich_bo_tro')} onRetest={() => setDirect('retest')} onHoSo={() => setDirect('ho_so')} gioiTinh={gioiTinh}
      onGopY={() => { setTuHoSo(false); setDirect('gop_y') }} gopYMoi={gopYMoi}
      onTutorial={() => { setTutDs(null); setDirect('tutorial') }}
      chuoi={moTN('chuoi') ? chuoi : null} onLuyenChuoi={() => setDirect('tu_luyen_chon')}
      theGioi={tgHome} onTheGioi={moTN('the_gioi') ? () => setDirect('the_gioi') : undefined}
      rank={moTN('rank') && rankHome?.toi ? { bac: rankHome.toi.bac, ten: rankHome.toi.ten_bac, sao: rankHome.toi.sao } : null} onRank={moTN('rank') ? moTuHome('rank') : undefined} /></>
    return <>{moiQuay}<HomeHS hoTen={hoTen} maHS={maHS} lopMon={lopMon} gioiTinh={gt} anhUrl={anhUrl} onAnhChanged={setAnhUrl} chuaDoc={chuaDoc}
      mons={lopMons} mon={monChon} onChonMon={doiMon}
      lich={lichMon} soRetest={boTro.soRetest} cards={cards}
      onHopThu={() => setDirect('hop_thu')} onDoiMK={() => setDoiMK(true)} onThoat={() => supabase.auth.signOut()}
      onLich={() => setDirect('lich_bo_tro')} onRetest={() => setDirect('retest')} /></>
  }

  // ── DANH SÁCH 1 KHU — dựng theo kit hs-bai-tap-tren-lop-v1 (DanhSachHS.tsx, dùng chung 3 khu). Ở đây CHỈ
  // suy trạng thái từng bài (mới / đang làm / quá hạn / hoàn thành + dòng hạn) rồi giao xuống; DanhSachHS thuần vẽ.
  const dsKhu = cuaKhu(khu)
  const nChua = dsKhu.filter((t) => !xongCua(t)).length
  const nXong = dsKhu.filter(xongCua).length
  const shown = dsKhu.filter((t) => (tab === 'xong' ? xongCua(t) : !xongCua(t)))
  const tenKhu = KHU.find((k) => k.id === khu)?.ten ?? ''
  const rows: DsRow[] = shown.map((t) => {
    const daNop = xongCua(t)
    const hetHan = daHetHan(t)
    // Thùy 13/09: BTVN KHÔNG giới hạn thời gian nộp — quá hạn vẫn mở được, chỉ đánh dấu "muộn".
    // ET/đề thi/giáo trình vẫn khoá quá hạn như cũ (bài thi 1 lần / phát hành theo buổi).
    const laBtvn = t.loai === 'btvn'
    const khoa = hetHan && !daNop && !laBtvn
    const sapNopMuon = laBtvn && hetHan && !daNop  // BTVN chưa nộp, quá hạn → hiện pill "muộn · vẫn nộp được"
    const daNopMuon = daNop && laNopMuon(t.bai_lam, t.deadline)  // BTVN đã nộp SAU deadline → badge "⏰ Muộn"
    const dlMs = t.deadline ? new Date(t.deadline).getTime() : null
    const muc = mucDeadline(dlMs)
    return {
      id: t.id,
      ten: `${LOAI_TEN[t.loai] ?? 'Bài'} ${t.mon} · ${t.lop_ten}`,
      sub: `Buổi ${fmtNgay(t.ngay)} · ${t.so_cau} câu${t.thoi_gian_phut ? ` · ${t.thoi_gian_phut} phút` : ''}${THI_LOAI.has(t.loai) ? ' · nộp 1 lần' : ''}`,
      laThi: THI_LOAI.has(t.loai),
      trangThai: daNop ? 'xong' : khoa ? 'qua_han' : sapNopMuon ? 'qua_han_mo' : t.bai_lam ? 'dang_lam' : 'moi',
      han: dlMs !== null && !daNop && muc ? { text: `Hạn ${fmtHan(t.deadline!)} · ${nhanConLai(dlMs)}`, muc } : null,
      khoa,
      nopMuon: daNopMuon,
      onClick: () => setActive(t),
    }
  })
  return (
    <DanhSachHS tieuDe={tenKhu} ill={KIT_O[khu].ill} gioiTinh={gt} tab={tab} nChua={nChua} nXong={nXong}
      rows={rows} dangTai={tests === null} onBack={() => setKhu(null)} onTab={setTab}
      empty={
        <TheHS className="p-8 text-center">
          <p className="text-3xl">{tab === 'xong' ? '📭' : '🎉'}</p>
          <p className="mt-2 text-[15px] font-bold" style={{ ...HEAD, color: MAU.ink }}>{tab === 'xong' ? 'Chưa hoàn thành bài nào' : 'Không có bài nào cần làm'}</p>
          <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>{tab === 'xong' ? 'Làm xong bài sẽ chuyển sang đây.' : `Khi thầy cô giao ${tenKhu.toLowerCase()}, bài sẽ hiện ở đây.`}</p>
        </TheHS>
      } />
  )
}

// doneCaption/doneExtra: TUỲ CHỌN, mặc định giữ NGUYÊN hành vi BTVN/giáo trình cũ — chỉ Tự luyện
// (LamTuLuyen) truyền vào để đổi câu chữ (không có "hạn nộp"/"thầy cô" như BTVN) + chèn nút "Làm
// thêm 10 câu" vào đúng màn kết quả có sẵn, thay vì tự vẽ lại toàn bộ màn done.
// desktop: TUỲ CHỌN, mặc định false = giữ NGUYÊN khung điện thoại cũ (cấp 3 vẫn dùng — BTVN/ET/giáo
// trình trên `active`). Cấp 1 (Thùy 22/08: "phần làm bài bên trong cũng phải đổi, ko để giao diện
// điện thoại nữa") truyền desktop=true qua LamTuLuyen. CHỈ đổi KHUNG NGOÀI (bề rộng/nền/bo góc/cỡ nút)
// — toàn bộ logic chọn/chấm/hiển thị câu (TN/ĐS/TLN) dùng CHUNG 1 JSX (`trongTam`), không tách 2 bản
// để tránh lệch hành vi giữa desktop/mobile theo thời gian.
// Thẻ câu hỏi: thẻ thường của style, hoặc "bảng phép" khi nhúng trong màn đấu (skin/KhungTran.tsx).
function KhungCau({ nhung, cls, children }: { nhung: boolean; cls: string; children: ReactNode }) {
  return nhung ? <TheTran className={cls}>{children}</TheTran> : <div className={cls} style={THE}>{children}</div>
}

export function LamBai({ baiTestId, hocSinhId, onXong, doneCaption, doneExtra, desktop, nhung }: {
  baiTestId: string; hocSinhId: string; onXong: () => void
  doneCaption?: string; doneExtra?: React.ReactNode; desktop?: boolean
  /** NHÚNG trong khung đấu 3D (phieuluu/DauView): ẩn thanh tiến độ + màn kết quả cũ, báo kết quả từng câu ra ngoài. */
  nhung?: NhungDau
}) {
  const [full, setFull] = useState<BaiTestFull | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [st, setSt] = useState<Record<string, CauState>>({})
  const [busy, setBusy] = useState(false)
  const [nopped, setNopped] = useState(false)
  const [goiY, setGoiY] = useState(false)
  // Trong trận (nhung): khung câu hỏi chỉ còn nửa dưới màn ⇒ chấm xong tự cuộn tới ô kết quả + lời giải (Thùy 02/10: "chưa hiện đáp án chi tiết"
  // — lời giải có nhưng nằm dưới mép khung). Nhớ câu đã cuộn để không giật lại mỗi lần vẽ lại.
  const daCuon = useRef<string | null>(null)

  useEffect(() => {
    (async () => {
      const f = await getBaiTestFull(baiTestId)
      setFull(f)
      const bl = await moBaiLam(baiTestId, hocSinhId)
      setBaiLamId(bl.id)
      // Khôi phục câu đã làm (reveal lại kết quả)
      const init: Record<string, CauState> = {}
      for (const [cauId, r] of Object.entries(f.daLam)) {
        const c = f.caus.find((x) => x.id === cauId)
        init[cauId] = { chon: (r as BaiLamCau).dap_an_hs as number | string, kq: { verdict: (r as BaiLamCau).verdict ?? 'wrong', key: c?.dap_an_key, baiLamCauId: (r as BaiLamCau).id } }
      }
      setSt(init)
      nhung?.onTai?.(f.caus.length, Object.keys(f.daLam).length)
      // TIẾN TRÌNH (Thùy 29/08: "vào toàn bắt bật lại từ câu 1"): mở lại bài dở → nhảy thẳng câu
      // CHƯA làm đầu tiên; xong hết → vào thẳng màn kết quả (tự luyện: nơi có nút "Làm thêm").
      // Vị trí KHÔNG cần lưu đâu cả — suy từ f.daLam (bai_lam_cau) theo ĐÚNG thứ tự hiển thị (= f.caus,
      // không xáo — xem `caus` dưới).
      if (Object.keys(f.daLam).length > 0) {
        const dau = f.caus.findIndex((c) => !f.daLam[c.id])
        setIdx(dau === -1 ? f.caus.length : dau)
      }
    })().catch(console.error)
  }, [baiTestId, hocSinhId])

  useEffect(() => { setGoiY(false) }, [idx]) // đổi câu → ẩn gợi ý

  // Làm xong HẾT câu → đánh dấu HOÀN THÀNH (bai_lam da_nop). Idempotent (claim atomic).
  useEffect(() => {
    if (!full || !baiLamId || nopped) return
    if (full.caus.length > 0 && full.caus.every((c) => st[c.id]?.kq)) { setNopped(true); nopBai(baiLamId).catch(() => {}) }
  }, [st, full, baiLamId, nopped])

  // ⭐ KHÔNG XÁO GÌ CẢ — Thùy 29/09: "tất cả mọi tài liệu phải giống giữa giấy và app, ko xáo đáp án
  // và thứ tự nữa" (HS báo phiếu BTVN và app lệch thứ tự câu). Thứ tự câu = `full.caus` (bai_test_cau
  // order by thu_tu = đúng thứ tự tài liệu in); A/B/C/D và a/b/c/d = đúng thứ tự gốc của câu.
  // Trước đây xáo chống liếc bài (05/07 → 29/09), chỉ giáo trình được khoá (22/08). ĐỪNG bật lại xáo
  // ở tầng hiển thị: số câu/chữ cái trên app phải khớp phiếu giấy em đang cầm.
  const caus = full?.caus ?? []
  // Chữ của câu hiện theo MÔN của bài (registry MON_CHU_THUONG — Tiếng Anh: giữ gạch chân, không công thức)
  const monBai = full?.baiTest.mon

  if (!full) return <ManCho>Đang tải bài…</ManCho>
  const total = caus.length
  const daXongHet = caus.every((c) => st[c.id]?.kq)
  const cau = caus[idx]
  const cs = cau ? st[cau.id] : undefined
  const daCham = !!cs?.kq
  const laTN = cau?.loai_cau === 'trac_nghiem'
  const laDS = cau?.loai_cau === 'dung_sai'
  const laKT = cau?.loai_cau === 'keo_tha'   // KÉO THẢ (TSA) — KeoThaCau.tsx
  const keyKT: string[] = laKT ? ((cau!.dap_an_key as string[]) ?? []) : []
  const chonKT: (string | null)[] = laKT ? ((cs?.chon as (string | null)[]) ?? keyKT.map(() => null)) : []
  const menhDe: MenhDeSnap[] = laDS ? ((cau!.menh_de as MenhDeSnap[]) ?? []) : []
  const keyDS: string[] = laDS ? ((cau!.dap_an_key as string[]) ?? []) : []
  const chonArr: (string | null)[] = laDS ? ((cs?.chon as (string | null)[]) ?? menhDe.map(() => null)) : []
  // Đáp án hiển thị (TN 4 phương án · ĐS 4 mệnh đề) ĐÚNG thứ tự gốc như phiếu giấy (không xáo — xem `caus`
  // ở trên). orig = chỉ số GỐC dùng ghi state/so đáp án đúng; dispI = vị trí hiển thị (đặt nhãn A/B/C/D ·
  // a/b/c/d) — giờ trùng nhau, giữ cặp để khối render không phải đổi.
  const optsShown = laTN && cau ? (cau.lua_chon ?? []).map((item, orig) => ({ item, orig })) : []
  const correctOrigTN = laTN && daCham && cau ? chiSoCuaChu(cau.dap_an_key) : -1
  const menhOrder = laDS && cau ? menhDe.map((item, orig) => ({ item, orig })) : []
  // Đã chọn đủ để Xác nhận? TN=đã chọn 1 · TLN=nhập khác rỗng · ĐS=đủ 4 ý.
  const daDu = laTN ? typeof cs?.chon === 'number'
    : laDS ? (chonArr.length === menhDe.length && menhDe.length > 0 && chonArr.every((x) => x != null))
    : laKT ? (keyKT.length > 0 && chonKT.length === keyKT.length && chonKT.every((x) => x != null))
    : (typeof cs?.chon === 'string' && cs.chon.trim() !== '')

  function setChon(v: Chon) {
    if (!cau || daCham) return
    setSt((s) => ({ ...s, [cau.id]: { chon: v, kq: null } }))
  }
  function setDS(i: number, v: 'D' | 'S') {
    if (!cau || daCham) return
    const cur = (st[cau.id]?.chon as (string | null)[]) ?? menhDe.map(() => null)
    const next = [...cur]; next[i] = v
    setSt((s) => ({ ...s, [cau.id]: { chon: next, kq: null } }))
  }

  async function xacNhan() {
    if (!cau || !baiLamId || !cs || !daDu) return
    setBusy(true)
    try {
      const kq = await traLoiCau(baiLamId, cau, cs.chon)
      setSt((s) => ({ ...s, [cau.id]: { chon: cs.chon, kq: { verdict: kq.verdict, key: kq.key, baiLamCauId: kq.baiLamCauId } } }))
      nhung?.onCau({ verdict: kq.verdict as 'correct' | 'partial' | 'wrong', idx, tong: caus.length })
    } finally { setBusy(false) }
  }

  // Báo sai "🚩 Em nghĩ mình đúng" — MỌI bài làm ở màn này (giáo trình / BTVN / tự luyện), MỌI loại câu,
  // khi bị chấm chưa đúng (Thùy 03/09 x2: "tài liệu online chưa có report 'Em nghĩ mình đúng' như tự
  // luyện" — lần đầu chỉ bật TN/ĐS cho giáo trình, chưa đủ). Cùng 1 nút, 2 đường xử lý phía staff:
  //   · TLN → "em nghĩ mình đúng" = có thể viết cách khác cũng đúng → accepted-answer (tab 🚩 Duyệt chấm)
  //   · TN/ĐS → không có chuyện viết khác, chỉ có KEY sai → tab ⚠ Nghi sai đáp án — chấm lại
  // Phân biệt bằng loai_cau của câu (staff-side), y_kien chỉ để người đọc hiểu.
  const baoSaiDe = laTN || laDS || laKT
  async function guiBaoSai() {
    if (!cau || !cs?.kq) return
    await baoSai(cs.kq.baiLamCauId, hocSinhId, baoSaiDe ? 'Em nghĩ đề hoặc đáp án sai.' : 'Em nghĩ mình đúng.')
    setSt((s) => ({ ...s, [cau.id]: { ...s[cau.id], baoRoi: true } }))
  }

  // Màn kết quả cuối
  if (idx >= total) {
    const dung = caus.filter((c) => st[c.id]?.kq?.verdict === 'correct').length
    if (nhung) return <NhungHet dung={dung} tong={total} baiLamId={baiLamId} cb={nhung.onHet} />
    return (
      <ManGiua>
        <div className={`flex items-center justify-center rounded-full ${desktop ? 'h-24 w-24 text-5xl' : 'h-20 w-20 text-4xl'}`} style={{ ...THE_TRON, borderRadius: '999px', background: NEN_DUNG }}>🏆</div>
        <p className={`mt-4 font-bold tracking-tight ${desktop ? 'text-3xl' : 'text-2xl'}`} style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{dung} / {total} đúng</p>
        <p className="mt-1 text-[16px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>{doneCaption ?? 'Làm lại được tới hạn nộp. Kết quả gửi thầy cô tham khảo.'}</p>
        {/* lượt luyện thêm: báo có tính vào chuỗi/nhiệm vụ không (BTVN, giáo trình… tự ẩn) */}
        <BaoLuotHS baiLamId={baiLamId} className={`mt-4 ${desktop ? 'max-w-sm' : ''}`} />
        <button onClick={onXong} className={`mt-6 font-bold ${desktop ? 'px-8 py-3.5 text-[19px]' : 'px-6 py-3 text-[18px]'}`} style={NUT_CHINH}>Về danh sách</button>
        {doneExtra}
      </ManGiua>
    )
  }

  const vd = daCham ? cs!.kq!.verdict : ''
  const boxNen = vd === 'correct' ? NEN_DUNG : vd === 'partial' ? NEN_CB : NEN_SAI
  const txtMau = vd === 'correct' ? MAU.dung : vd === 'partial' ? MAU.canhBao : MAU.sai
  const dsDung = laDS && daCham ? chonArr.filter((x, i) => x != null && String(x).toUpperCase() === String(keyDS[i]).toUpperCase()).length : 0
  const trongTam = (
    <>
      <div className={nhung ? 'hidden' : desktop ? 'mb-4 flex shrink-0 items-center gap-4' : 'flex shrink-0 items-center gap-3 px-4 py-3'}>
        <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ ...THE_TRON, borderRadius: '999px', color: MAU.muted }}>✕</button>
        <div className={`flex-1 overflow-hidden rounded-full ${desktop ? 'h-2.5' : 'h-2'}`} style={{ background: MAU.line }}>
          <div className="h-full transition-all" style={{ width: `${((idx + 1) / total) * 100}%`, background: MAU.acc }} />
        </div>
        <span className={desktop ? 'text-[16px] font-semibold' : 'text-[15px] font-semibold'} style={{ color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{idx + 1}/{total}</span>
      </div>

      {/* Thùy 13/09: content SCROLL riêng, footer luôn nằm trong viewport (không phải kéo trang xuống mới bấm Xác nhận). */}
      <div className={desktop ? 'flex-1 min-h-0 overflow-y-auto' : 'flex-1 overflow-y-auto px-4 pb-4'}>
        <KhungCau nhung={!!nhung} cls={desktop ? 'p-8 lg:p-10' : 'p-4'}>
          <div className="mb-2 flex items-center justify-between">
            {nhung
              ? <span className="flex items-center gap-2 text-[16px] font-bold" style={{ fontFamily: 'var(--sk-font-head)', color: MAU.acc }}><span aria-hidden className="inline-block h-2.5 w-2.5 rotate-45" style={{ background: MAU.acc }} />Câu {idx + 1}/{total} · chọn đúng để tung phép</span>
              : <p className="text-[16px] font-semibold" style={{ color: MAU.muted }}>Câu {idx + 1}</p>}
            {cau.ly_thuyet && (
              <button onClick={() => setGoiY((v) => {
                const nv = !v
                // Ghi vết lúc MỞ (không cần lúc đóng) — GV xem live biết ai đang cần gợi ý. Fire-and-forget.
                if (nv && baiLamId) xemGoiY(baiLamId, cau.id).catch(() => {})
                return nv
              })}
                className="rounded-full px-3 py-1 text-[15px] font-medium transition" style={NUT_GOI_Y(goiY)}>
                💡 Gợi ý
              </button>
            )}
          </div>
          {goiY && cau.ly_thuyet && (
            <div className="mb-3 p-3" style={HOP_GOI_Y}>
              <p className="mb-1 text-[15px] font-semibold uppercase tracking-wide" style={{ color: MAU.canhBao }}>Lý thuyết dạng bài</p>
              <div className="text-[18px] leading-relaxed" style={{ color: MAU.ink }}><ChuMon mon={monBai}>{cau.ly_thuyet}</ChuMon></div>
            </div>
          )}
          {/* Ngữ liệu (đoạn văn / thông báo / biển báo) dùng chung nhiều câu — chụp kèm câu lúc sinh bài, hiện TRÊN đề */}
          {cau.ngu_lieu && <NguLieuHS nl={cau.ngu_lieu} mon={monBai} gon={!!nhung} />}
          {cau.noi_dung && !laKT && <div className={nhung ? 'mb-4 text-[21px] font-semibold leading-relaxed' : 'mb-3 text-[19px] leading-relaxed'} style={{ color: MAU.ink }}><ChuMon mon={monBai}>{cau.noi_dung}</ChuMon></div>}
          {/* Hình đề: nền trắng cố định — hình vẽ/ảnh chụp đề là nét đen trên trắng, đặt thẳng lên thẻ tối là mất nét. */}
          {cau.anh_de && <img src={cau.anh_de} alt="đề" className="mb-3 max-h-80 rounded-lg bg-white" style={{ border: `1px solid ${MAU.line}` }} />}

          {laKT ? (
            <KeoThaCau noiDung={cau.noi_dung ?? ''} nganHang={cau.lua_chon ?? []} value={chonKT} onChange={(v) => setChon(v)} key_={daCham ? keyKT : undefined} daCham={daCham} mon={monBai} />
          ) : laTN ? (
            <div className="flex flex-col gap-2.5">
              {optsShown.map(({ item: opt, orig }, dispI) => {
                const chon = cs?.chon === orig
                const laDapAn = daCham && orig === correctOrigTN
                const chonSai = daCham && chon && !laDapAn
                const tt: TtO = laDapAn ? 'dung' : chonSai ? 'sai' : chon ? 'chon' : 'thuong'
                return (
                  <button key={orig} onClick={() => setChon(orig)} disabled={daCham}
                    className={nhung ? `flex items-center gap-3 px-3 py-2.5 text-left text-[20px] ${CLS_PHIEN(tt)}` : 'flex items-start gap-3 p-3 text-left text-[19px] transition'} style={nhung ? PHIEN(tt) : O_DAP_AN(tt)}>
                    {nhung ? <NgocChu t={tt} chu={chuCaiChon(dispI)} />
                      : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[16px] font-semibold" style={TRON_CHU(tt)}>{chuCaiChon(dispI)}</span>}
                    <span className="flex-1 pt-0.5"><ChuMon mon={monBai}>{stripLabel(opt)}</ChuMon></span>
                  </button>
                )
              })}
            </div>
          ) : laDS ? (
            <div className="flex flex-col gap-2.5">
              {menhOrder.map(({ item: m, orig }, dispI) => {
                const key = String(keyDS[orig] ?? '').toUpperCase()
                const pick = chonArr[orig] ? String(chonArr[orig]).toUpperCase() : null
                return (
                  <div key={orig} className="p-3" style={{ border: `1px solid ${MAU.line}`, background: MAU.surface2, borderRadius: R_TRONG }}>
                    <div className="mb-2 flex gap-2 text-[19px]" style={{ color: MAU.ink }}>
                      <span className="font-semibold" style={{ color: MAU.muted }}>{'abcd'[dispI] ?? dispI + 1})</span>
                      <span className="flex-1"><ChuMon mon={monBai}>{m.noi_dung}</ChuMon></span>
                    </div>
                    <div className="flex gap-2">
                      {(['D', 'S'] as const).map((v) => {
                        const on = pick === v
                        const dungChoi = daCham && v === key       // đáp án đúng của ý
                        const saiChoi = daCham && on && v !== key   // HS chọn sai
                        const tt: TtO = dungChoi ? 'dung' : saiChoi ? 'sai' : on ? 'chon' : 'thuong'
                        return (
                          <button key={v} onClick={() => setDS(orig, v)} disabled={daCham}
                            className="flex-1 py-1.5 text-[16px] font-medium transition" style={NUT_DS(tt)}>
                            {v === 'D' ? 'Đúng' : 'Sai'}
                          </button>
                        )
                      })}
                    </div>
                    {daCham && m.loi_giai && <div className="mt-2 pt-1.5 text-[16px]" style={{ borderTop: `1px solid ${MAU.line}`, color: MAU.muted }}><ChuMon mon={monBai}>{m.loi_giai}</ChuMon></div>}
                  </div>
                )
              })}
            </div>
          ) : cau.kieu_nhap === 'phieu_4o' ? (
            <ONhap4O value={(cs?.chon as string) ?? ''} onChange={setChon} disabled={daCham} co={19} />
          ) : (
            <input value={(cs?.chon as string) ?? ''} onChange={(e) => setChon(e.target.value)} disabled={daCham}
              placeholder="Nhập đáp án…" inputMode="text"
              className={`${O_NHAP_CLS} text-[19px]`} style={O_NHAP} />
          )}

          {daCham && (
            <div className="mt-4 p-3" style={nhung ? HOP_LOI_GIAI(vd === 'correct' ? true : vd === 'partial' ? null : false) : { background: boxNen, borderRadius: R_TRONG }}
              ref={(el) => { if (el && nhung && daCuon.current !== cau.id) { daCuon.current = cau.id; requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' })) } }}>
              <p className="text-[19px] font-semibold" style={{ color: txtMau }}>
                {nhung
                  ? (vd === 'correct' ? '✦ Trúng đòn! Em làm đúng rồi' : vd === 'partial' ? '✦ Trúng một phần' : '💥 Trượt đòn — xem lời giải nhé')
                  : vd === 'correct' ? '🎉 Đúng hết!' : vd === 'partial' ? '👍 Đúng một phần' : '😔 Chưa đúng'}
                {laDS && <span className="ml-1 text-[16px] font-normal">· {dsDung}/{menhDe.length} ý đúng</span>}
              </p>
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && <p className="mt-1 text-[16px]" style={{ color: MAU.muted }}>Đáp án đúng: <b style={{ color: MAU.dung }}>{String(cau.dap_an_key)}</b></p>}
              {cau.loi_giai && (
                <div className="mt-2 pt-2 text-[18px] leading-relaxed" style={{ borderTop: `1px solid ${MAU.line}`, color: MAU.ink }}>
                  <p className="mb-1 text-[15px] font-semibold uppercase" style={{ color: nhung ? MAU.acc : MAU.muted }}>{nhung ? '📜 Lời giải chi tiết' : 'Lời giải'}</p>
                  <ChuMon mon={monBai}>{cau.loi_giai}</ChuMon>
                </div>
              )}
              {cau.anh_dap_an && <img src={cau.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg bg-white" style={{ border: `1px solid ${MAU.line}` }} />}
              {(cau.loai_cau === 'tra_loi_ngan' || baoSaiDe) && vd !== 'correct' && (
                cs!.baoRoi
                  ? <p className="mt-2 text-[15px]" style={{ color: MAU.muted }}>✓ Đã gửi ý kiến cho thầy cô.</p>
                  : <button onClick={guiBaoSai} className="mt-2 px-3 py-1.5 text-[15px]" style={{ ...NUT_PHU, borderRadius: R_TRONG, color: MAU.muted }}>
                      🚩 Em nghĩ mình đúng
                    </button>
              )}
            </div>
          )}
        </KhungCau>
      </div>

      <div className={desktop ? 'mt-4 flex shrink-0 items-center gap-3' : 'flex shrink-0 items-center gap-2 p-3'}
        style={desktop ? undefined : { background: MAU.surface, borderTop: `1px solid ${MAU.line}`, backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)' }}>
        {idx > 0 && (
          <button onClick={() => setIdx((i) => i - 1)}
            className={desktop ? 'px-6 py-3.5 text-[19px] font-medium' : 'px-4 py-3 text-[18px]'} style={NUT_PHU}>
            {desktop ? '‹ Câu trước' : '‹'}
          </button>
        )}
        {!daCham ? (
          <button onClick={xacNhan} disabled={busy || !daDu}
            className={`flex-1 font-semibold disabled:opacity-40 ${nhung ? 'tran-phien ' : ''}${desktop ? 'py-3.5 text-[19px]' : 'py-3 text-[18px]'}`} style={nhung ? NUT_TRAN : NUT_CHINH}>
            {busy ? (nhung ? 'Đang niệm phép…' : 'Đang chấm…') : nhung ? '⚔ Tung phép' : 'Xác nhận'}
          </button>
        ) : (
          <button onClick={() => setIdx((i) => i + 1)} disabled={!!nhung?.ban}
            className={`flex-1 font-semibold ${nhung ? 'tran-phien ' : ''}${desktop ? 'py-3.5 text-[19px]' : 'py-3 text-[18px]'}`} style={nhung ? NUT_TRAN : NUT_CHINH}>
            {idx + 1 < total ? (nhung ? 'Đòn kế tiếp ➜' : 'Câu tiếp →') : (daXongHet ? 'Xem kết quả →' : 'Câu tiếp →')}
          </button>
        )}
      </div>
    </>
  )

  // Thùy 13/09: MÀN LÀM BÀI phải gọn 1 viewport (Xác nhận đáp án luôn thấy). h-[100dvh]+flex col
  // → header/content/footer chia vùng; content overflow riêng, không phải cuộn cả trang.
  // Nhúng trong khung đấu 3D: chỉ phần trong tâm, vừa khít ô dưới cảnh (không tự chiếm 100dvh).
  if (nhung) return <div className="flex h-full min-h-0 flex-col px-3 py-2 md:px-6" style={{ fontFamily: FONT_TRAN, color: MAU.ink }}><div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">{trongTam}</div></div>
  return desktop ? (
    <div className="flex h-[100dvh] flex-col px-8 py-4" style={NEN_MAN}>
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col lg:max-w-4xl">{trongTam}</div>
    </div>
  ) : (
    <div style={NEN_MAN}>
      <div className="mx-auto flex h-[100dvh] max-w-md flex-col md:max-w-3xl lg:max-w-4xl">{trongTam}</div>
    </div>
  )
}

// ── TỰ LUYỆN: bọc NGOÀI LamBai — MỖI LƯỢT = 1 bai_test RIÊNG 10 câu (Thùy 29/08: "mỗi lần luyện
// phải độc lập", KHÔNG cộng dồn 1 bài/ngày). Mở màn: lượt hôm nay đang DỞ → làm tiếp; hết dở →
// sinh lượt mới. "Làm thêm" = sinh lượt mới tinh. Phần LÀM BÀI dùng nguyên LamBai — key={baiTestId}
// đổi theo từng lượt ⇒ REMOUNT, mỗi lượt chấm điểm/kết quả độc lập 10 câu của chính nó.
function LamTuLuyen({ hocSinhId, onXong, desktop, chuDe, onDoiDang }: { hocSinhId: string; onXong: () => void; desktop?: boolean; chuDe?: { ma_dang: string; ten_dang: string; chiCauMoi?: boolean } | null; onDoiDang?: () => void }) {
  // "Luyện chứng minh" (điền ô, spec-dien-o.md D2/D3): luồng riêng vì câu điền ô có tương tác từng ô, không đi qua LamBai.
  const [dienO, setDienO] = useState(false)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [mon, setMon] = useState<string | null>(null)
  const [baiTestId, setBaiTestId] = useState<string | null>(null)
  const [tongNgay, setTongNgay] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  // Guard StrictMode chạy effect 2 lần (bài học CLAUDE.md §"ensure* slot"): thiếu cái này thì lượt
  // gọi thứ 2 cũng thấy "không có lượt dở" (đọc trước khi lượt 1 kịp ghi) → sinh THỪA 1 lượt mồ côi.
  // Không còn unique index 1 bài/ngày (model lượt-độc-lập) nên guard client là hàng rào duy nhất.
  const daGoi = useRef(false)

  // Theo chủ đề (chuDe có giá trị): LUÔN sinh lượt MỚI đúng dạng đã chọn — không check "lượt hôm nay
  // đang dở" (đó là của tổng hợp, không phân biệt dạng, không hợp ngữ cảnh "đang luyện dạng X").
  async function taiHomNay() {
    setState('dang_tai'); setErr(null)
    try {
      const m = await monCuaHS()
      if (!m) { setState('trong'); setErr('Chưa xác định được môn học của em — báo thầy cô nhé.'); return }
      setMon(m)
      if (chuDe) {
        const kq = await sinhTuLuyenChuDe(m, chuDe.ma_dang, !!chuDe.chiCauMoi)
        setBaiTestId(kq.baiTestId); setTongNgay(kq.them); setState('san_sang')
        return
      }
      const { dangDo, tongCau } = await luotTuLuyenHomNay(m)
      if (dangDo) { setBaiTestId(dangDo.baiTestId); setTongNgay(tongCau); setState('san_sang'); return }
      const kq = await sinhTuLuyen(m)
      setBaiTestId(kq.baiTestId); setTongNgay(tongCau + kq.them); setState('san_sang')
    } catch (e: any) { setErr(e?.message ?? String(e)); setState('trong') }
  }
  useEffect(() => { if (daGoi.current) return; daGoi.current = true; taiHomNay() }, []) // eslint-disable-line

  async function lamThem() {
    if (!mon) return
    setBusy(true); setErr(null)
    try {
      const kq = chuDe ? await sinhTuLuyenChuDe(mon, chuDe.ma_dang, !!chuDe.chiCauMoi) : await sinhTuLuyen(mon)
      setBaiTestId(kq.baiTestId); setTongNgay((t) => t + kq.them)
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  if (state === 'dang_tai') return <ManCho>Đang chuẩn bị bài…</ManCho>
  if (dienO) return <LamDienO hocSinhId={hocSinhId} onXong={() => setDienO(false)} desktop={desktop} />
  if (state === 'trong' || !baiTestId || !mon) return (
    <ManGiua>
      <TheHS className="w-full p-6">
        <p className="text-3xl">🌱</p>
        <p className="mt-3 text-[15px] font-medium" style={{ color: MAU.ink }}>{err ?? 'Chưa có dữ liệu học tập để tự luyện.'}</p>
        {!chuDe && <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>Học vài buổi trên lớp rồi quay lại nhé.</p>}
      </TheHS>
      <button onClick={onXong} className={`mt-6 font-medium ${desktop ? 'px-8 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_PHU}>Về trang chính</button>
    </ManGiua>
  )
  return (
    <LamBai
      key={baiTestId}
      baiTestId={baiTestId}
      hocSinhId={hocSinhId}
      onXong={onXong}
      desktop={desktop}
      doneCaption={chuDe ? `Em vừa luyện ${tongNgay} câu dạng "${chuDe.ten_dang}".` : `Hôm nay em đã luyện ${tongNgay} câu.`}
      doneExtra={
        <div className={`mt-3 w-full ${desktop ? 'max-w-sm' : ''}`}>
          {err && <p className="mb-2 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
          <button onClick={lamThem} disabled={busy}
            className={`w-full font-medium disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_PHU}>
            {busy ? 'Đang tạo lượt mới…' : `Luyện lượt mới ${TU_LUYEN_SO_CAU_MOI_LUOT} câu`}
          </button>
          {chuDe && onDoiDang && (
            <button onClick={onDoiDang} disabled={busy}
              className={`mt-2 w-full font-medium disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={{ ...NUT_PHU, color: MAU.muted }}>
              🔄 Đổi dạng khác
            </button>
          )}
          {!chuDe && MON_LUYEN_CHUNG_MINH.includes(mon) && <button onClick={() => setDienO(true)}
            className={`mt-2 w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_PHU}>
            📐 Luyện chứng minh (điền vào lời giải)
          </button>}
        </div>
      }
    />
  )
}

// ── THỬ THÁCH (spec-thanh-tuu-nhiem-vu.md A2, mig 202609281711): 1 lượt y hệt Tổng hợp, bọc NGOÀI LamBai
// giống LamTuLuyen. Khác: màn xong hiện kết quả Thử thách (pass ≥ 80%, điểm, trần ngày) — chấm + trần ở DB.
function LamThuThach({ hocSinhId, onXong, onRank, desktop }: { hocSinhId: string; onXong: () => void; onRank?: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [mon, setMon] = useState<string | null>(null)
  const [baiTestId, setBaiTestId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const daGoi = useRef(false) // StrictMode chạy effect 2 lần ⇒ sinh thừa 1 lượt (xem LamTuLuyen)

  useEffect(() => {
    if (daGoi.current) return; daGoi.current = true
    ;(async () => {
      try {
        const m = await monCuaHS()
        if (!m) throw new Error('Chưa xác định được môn học của em — báo thầy cô nhé.')
        setMon(m)
        setBaiTestId((await thuThachLuotDo(m)) ?? (await sinhThuThach(m)))
        setState('san_sang')
      } catch (e: any) { setErr(e?.message ?? String(e)); setState('loi') }
    })()
  }, [])

  async function luotMoi() {
    if (!mon) return
    setBusy(true); setErr(null)
    try { setBaiTestId(await sinhThuThach(mon)) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  if (state === 'dang_tai') return <ManCho>Đang chuẩn bị Thử thách…</ManCho>
  if (state === 'loi' || !baiTestId) return (
    <ManGiua>
      <TheHS className="w-full p-6">
        <p className="text-3xl">⚔️</p>
        <p className="mt-3 text-[15px] font-medium" style={{ color: MAU.ink }}>{err ?? 'Không tạo được lượt Thử thách.'}</p>
      </TheHS>
      <button onClick={onXong} className="mt-6 px-6 py-3 text-sm font-medium" style={NUT_PHU}>Quay lại</button>
    </ManGiua>
  )
  return (
    <LamBai
      key={baiTestId}
      baiTestId={baiTestId}
      hocSinhId={hocSinhId}
      onXong={onXong}
      desktop={desktop}
      doneCaption="Em vừa xong 1 lượt Thử thách."
      doneExtra={<KetQuaThuThachBox baiTestId={baiTestId} busy={busy} err={err} onLuotMoi={luotMoi} onRank={onRank} desktop={desktop} />}
    />
  )
}

function KetQuaThuThachBox({ baiTestId, busy, err, onLuotMoi, onRank, desktop }: { baiTestId: string; busy: boolean; err: string | null; onLuotMoi: () => void; onRank?: () => void; desktop?: boolean }) {
  const [kq, setKq] = useState<KetQuaThuThach | null | undefined>(undefined)
  useEffect(() => { setKq(undefined); ketQuaThuThach(baiTestId).then(setKq).catch(() => setKq(null)) }, [baiTestId])
  const nut = `w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`
  return (
    <div className={`mt-3 w-full ${desktop ? 'max-w-sm' : ''}`}>
      {kq === undefined && <p className="mb-2 text-center text-[13px]" style={{ color: MAU.muted }}>Đang chấm Thử thách…</p>}
      {kq === null && <p className="mb-2 text-center text-[13px]" style={{ color: MAU.muted }}>Chưa lấy được kết quả — xem lại ở màn Rank nhé.</p>}
      {kq && (
        // Thẻ skin phủ lớp màu ngữ nghĩa (vượt = xanh / chưa = cam) — dưới là nền thẻ nên đọc được cả trên nền ảnh.
        <div className="mb-3 p-4 text-center" style={{ ...THE_TRON, background: `linear-gradient(${kq.pass ? NEN_DUNG : NEN_CB}, ${kq.pass ? NEN_DUNG : NEN_CB}), var(--sk-surface)` }}>
          <p className="text-[16px] font-extrabold" style={{ color: kq.pass ? MAU.dung : MAU.canhBao }}>
            {kq.pass ? `Vượt Thử thách! ${kq.so_dung}/${kq.so_cau} câu đúng` : `Chưa vượt — ${kq.so_dung}/${kq.so_cau} câu đúng (cần ${kq.pass_can})`}
          </p>
          <p className="mt-1 text-[13px]" style={{ color: MAU.ink }}>
            {kq.pass
              ? (!rankBat() ? 'Em đã vượt Thử thách hôm nay' : kq.diem > 0 ? `+${kq.diem} Điểm Rank` : 'Hôm nay em đã lấy đủ điểm Thử thách — làm tiếp vẫn tính vào luyện tập')
              : 'Làm lượt mới nhé, không giới hạn số lượt'}
            {rankBat() && kq.pass && kq.diem > 0 && kq.diem < kq.diem_goc ? ` (chạm trần ngày)` : ''}
          </p>
          {rankBat() && <p className="mt-1 text-[12px]" style={{ color: MAU.muted }}>Hôm nay {kq.hom_nay}/{kq.tran_ngay} · tháng này {kq.thang}/{kq.tran_thang}</p>}
        </div>
      )}
      {err && <p className="mb-2 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
      <button onClick={onLuotMoi} disabled={busy} className={`${nut} disabled:opacity-40`} style={NUT_PHU}>{busy ? 'Đang tạo lượt mới…' : 'Thử thách lượt mới'}</button>
      {onRank && <button onClick={onRank} className={`${nut} mt-2`} style={NUT_PHU}>🏆 Xem Rank</button>}
    </div>
  )
}

// ── HỌC TỪ ĐẦU: luyện tập (vô hạn)/test (1 lượt) cho 1 DẠNG đã chọn sẵn — bọc NGOÀI
// LamBai giống LamTuLuyen, khác: không check "dở hôm nay" (mỗi lần vào bấm 1 lượt mới),
// test xong hiện 3 lựa chọn (CEO 19/09): qua dạng mới · luyện thêm dạng này · test lại.
// "Xong dạng" tự ghi ở DB (trigger trg_htd_test_nop) khi nộp — ở đây chỉ điều hướng.
function LamHTD({ hocSinhId, mon, dang, loai, desktop, onVeChiTiet, onSangTest, onXongDang }: {
  hocSinhId: string; mon: string; dang: { ma_dang: string; ten_dang: string; xong: boolean }
  loai: 'htd_luyen' | 'htd_test' | 'bu_luyen' | 'bu_test'; desktop?: boolean
  onVeChiTiet: () => void; onSangTest: () => void; onXongDang: () => void
}) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [baiTestId, setBaiTestId] = useState<string | null>(null)
  const [tongLuot, setTongLuot] = useState(0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  // Dạng KHÔNG có MCQ (mig 202609220900): sinh() vẫn ra bài (câu bất kỳ loại) thay vì chặn cứng —
  // nhưng KHÔNG được đưa cho LamBai (LamBai tự chấm tra_loi_ngan/dung_sai = đúng nhánh lùi CEO 20/09
  // đã cấm). `caus` chỉ có giá trị khi bài KHÔNG phải trắc nghiệm → render đọc-chỉ-xem thay LamBai.
  const [caus, setCaus] = useState<CauHTD[] | null>(null)
  const daGoi = useRef(false)

  async function sinh() {
    setBusy(true); setErr(null); setCaus(null)
    try {
      const kq = await htdSinh(mon, dang.ma_dang, loai)
      const ds = await htdCauBaiTest(kq.baiTestId)
      if (ds.length > 0 && ds.every((c) => c.loai_cau !== 'trac_nghiem')) setCaus(ds)
      setBaiTestId(kq.baiTestId); setTongLuot((t) => t + kq.them); setState('san_sang')
    } catch (e: any) { setErr(e?.message ?? String(e)); setState('loi') } finally { setBusy(false) }
  }
  useEffect(() => { if (daGoi.current) return; daGoi.current = true; sinh() }, []) // eslint-disable-line

  if (state === 'dang_tai') return <ManCho>Đang chuẩn bị bài…</ManCho>
  if (state === 'san_sang' && baiTestId && caus) return (
    <XemDeKhongMCQ dang={dang} loai={loai} caus={caus} desktop={desktop} onVeChiTiet={onVeChiTiet} onSangTest={onSangTest} />
  )
  if (state === 'loi' || !baiTestId) return (
    <ManGiua>
      <TheHS className="w-full p-6">
        <p className="text-3xl">🌱</p>
        <p className="mt-3 text-[15px] font-medium" style={{ color: MAU.ink }}>{err ?? 'Không sinh được bài.'}</p>
      </TheHS>
      <button onClick={onVeChiTiet} className={`mt-6 font-medium ${desktop ? 'px-8 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_PHU}>Quay lại</button>
    </ManGiua>
  )

  const laTest = loai === 'htd_test' || loai === 'bu_test'
  return (
    <LamBai
      key={baiTestId}
      baiTestId={baiTestId}
      hocSinhId={hocSinhId}
      onXong={laTest ? onXongDang : onVeChiTiet}
      desktop={desktop}
      doneCaption={loai === 'bu_test' ? `Đã nộp bài test dạng "${dang.ten_dang}".` : laTest ? `Đã nộp bài test dạng "${dang.ten_dang}" — dạng này đã xong!` : `Em vừa luyện ${tongLuot} câu dạng "${dang.ten_dang}".`}
      doneExtra={
        <div className={`mt-3 w-full ${desktop ? 'max-w-sm' : ''}`}>
          {err && <p className="mb-2 text-[12.5px]" style={{ color: MAU.sai }}>{err}</p>}
          {laTest ? (
            <>
              <button onClick={onXongDang} className={`w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_CHINH}>
                Qua dạng mới →
              </button>
              <button onClick={onVeChiTiet} className={`mt-2 w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={{ ...NUT_PHU, color: MAU.muted }}>
                Luyện tập thêm dạng này
              </button>
              <button onClick={sinh} disabled={busy} className={`mt-2 w-full font-medium disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_PHU}>
                {busy ? 'Đang tạo…' : '🔁 Test lại'}
              </button>
            </>
          ) : (
            <>
              <button onClick={sinh} disabled={busy} className={`w-full font-medium disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_PHU}>
                {busy ? 'Đang tạo lượt mới…' : 'Luyện tiếp 10 câu'}
              </button>
              <button onClick={onSangTest} className={`mt-2 w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_CHINH}>
                📝 Chuyển sang làm bài Test
              </button>
            </>
          )}
        </div>
      }
    />
  )
}

// Đọc-chỉ-xem khi dạng CHƯA có câu trắc nghiệm (mig 202609220900) — KHÔNG có ô trả lời, KHÔNG tự
// chấm (đúng luật CEO 20/09 "không nhánh lùi tự động chấm TLN"). Luyện: đọc xong tự quay lại/chuyển
// Test, không tính gì (luyện không tính mastery — dạng vẫn vậy dù không MCQ). Test: đọc xong làm ra
// giấy/nói miệng, "xong dạng" chỉ tự ghi khi TRỢ GIẢNG chấm ĐCS + nộp bên app TA (fn_botro_giay_nop
// → trg_htd_test_nop) — bên HS KHÔNG có nút nộp vì không có gì để nộp online.
function XemDeKhongMCQ({ dang, loai, caus, desktop, onVeChiTiet, onSangTest }: {
  dang: { ma_dang: string; ten_dang: string }; loai: 'htd_luyen' | 'htd_test' | 'bu_luyen' | 'bu_test'; caus: CauHTD[]; desktop?: boolean
  onVeChiTiet: () => void; onSangTest: () => void
}) {
  const laTest = loai === 'htd_test' || loai === 'bu_test'
  return (
    <ManHS rong="hep" className="!gap-0">
      <DauTrangHS tieuDe={dang.ten_dang} onBack={onVeChiTiet} theoMon />
      {/* Dải báo 1 dòng: test = phủ cam cảnh báo (làm ra giấy), luyện = thẻ thường. */}
      <div className="mt-3 px-3.5 py-3 text-[13px] leading-relaxed" style={laTest
        ? { ...THE_TRON, background: `linear-gradient(${NEN_CB}, ${NEN_CB}), var(--sk-surface)`, color: MAU.ink }
        : { ...THE_TRON, color: MAU.ink }}>
        {laTest
          ? 'Dạng này chưa có câu trắc nghiệm — em làm các câu dưới đây ra giấy hoặc nói với thầy cô, trợ giảng sẽ chấm giúp em.'
          : 'Dạng này chưa có câu trắc nghiệm — em đọc và luyện các câu dưới đây, không cần nộp gì cả.'}
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {caus.map((c, i) => (
          <TheHS key={c.id} className="p-3.5">
            <p className="text-[12px] font-bold" style={{ color: MAU.muted }}>Câu {i + 1}</p>
            <div className="mt-1 text-[14px] leading-relaxed" style={{ color: MAU.ink }}><MathText>{c.noi_dung ?? ''}</MathText></div>
          </TheHS>
        ))}
      </div>
      <div className={`mt-4 ${desktop ? 'max-w-sm' : ''}`}>
        {laTest ? (
          <button onClick={onVeChiTiet} className={`w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_CHINH}>Đã đọc xong — quay lại</button>
        ) : (
          <>
            <button onClick={onSangTest} className={`w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={NUT_CHINH}>📝 Chuyển sang làm bài Test</button>
            <button onClick={onVeChiTiet} className={`mt-2 w-full font-medium ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`} style={{ ...NUT_PHU, color: MAU.muted }}>Quay lại</button>
          </>
        )}
      </div>
    </ManHS>
  )
}

// ── BẢNG XẾP HẠNG (Thùy 21/08, sửa lại: "ko phải chỉ 5T. Hiện cho các khối tiểu học") — MỖI EM
// xếp hạng với ĐÚNG khối của mình (không hardcode '5T' nữa) — visibility lọc ở màn chính (cap1).
// Chỉ vào được từ HomeCap1 (ô "Bảng xếp hạng" cap1-exclusive, xem KHU_CHI_CAP1) → đổi khung DESKTOP
// LUÔN, không cần prop `desktop` như LamBai/ThongTinHocTap (không có đường vào từ cấp 3 mobile).
function BangXepHang({ onXong }: { onXong: () => void }) {
  const [khoi, setKhoi] = useState<string | null>(null)
  const [rows, setRows] = useState<XepHangRow[] | null>(null)
  const daGoi = useRef(false)
  useEffect(() => {
    if (daGoi.current) return
    daGoi.current = true
    ;(async () => {
      const [k, m] = await Promise.all([khoiCuaHS(), monCuaHS()])
      setKhoi(k)
      if (!k || !m) { setRows([]); return }
      setRows(await xepHangTuLuyen(k, m)) // 01/10: BXH của môn đang chọn
    })().catch(() => setRows([]))
  }, [])

  if (rows === null) return <ManCho>Đang tải…</ManCho>

  return (
    <ManHS rong="hep">
      <DauTrangHS tieuDe="Bảng xếp hạng" phu={khoi ? `Số câu làm ĐÚNG tự luyện · các bạn khối ${khoi}` : undefined} onBack={onXong} theoMon />

      {rows.length === 0 ? (
        <TheHS className="mt-2 p-8 text-center">
          <p className="text-3xl">🏆</p>
          <p className="mt-2 text-[15px] font-medium" style={{ color: MAU.ink }}>Chưa có ai làm Tự luyện</p>
          <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>Làm bài đầu tiên để dẫn đầu bảng xếp hạng!</p>
        </TheHS>
      ) : (
        // ĐÚNG ".classTable"+".row"+".rank"+".score" (ph-v3.css) — bảng xếp hạng cả lớp có sẵn
        <TheHS className="overflow-hidden">
          {rows.map((r, i) => (
            <div key={r.ma_hs} className="grid grid-cols-[42px_1fr_64px] items-center gap-3.5 px-5 py-4 text-[14px]"
              style={{ borderTop: i > 0 ? `1px solid ${MAU.line}` : undefined, background: r.la_toi ? NEN_ACC : undefined }}>
              {/* Top 3 = màu huy chương vàng/bạc/đồng (cố định, chữ trắng trên nền màu); em = màu nhấn skin. */}
              <span className="flex h-9 w-9 items-center justify-center text-[14px] font-black" style={{ borderRadius: R_TRONG, ...(
                r.la_toi ? { background: MAU.acc, color: MAU.accInk }
                : i === 0 ? { background: MAU.canhBao, color: '#fff' }
                : i === 1 ? { background: '#8e96a8', color: '#fff' }
                : i === 2 ? { background: '#c77e4a', color: '#fff' }
                : { background: MAU.surface2, color: MAU.ink }) }}>{i + 1}</span>
              <p className="min-w-0 truncate font-bold" style={{ color: MAU.ink }}>{r.ho_ten}{r.la_toi ? ' (Bạn)' : ''}</p>
              <span className="rounded-full px-2.5 py-1.5 text-center text-[13px] font-black"
                style={r.la_toi ? { background: MAU.acc, color: MAU.accInk } : { background: NEN_DUNG, color: MAU.dung }}>{r.so_cau_dung}</span>
            </div>
          ))}
        </TheHS>
      )}
    </ManHS>
  )
}

// ── HÒM THƯ — hiện tại chỉ 1 nguồn: TA/GV duyệt "Em nghĩ mình đúng" là ĐÚNG (fn_chap_nhan_dap_an).
// Mở ra là đánh dấu đã đọc HẾT (hòm thư đơn giản, không cần bấm từng cái) — chỉ để HS thấy hệ thống
// có lắng nghe khi mình báo lỗi, không phải trung tâm điều hành việc phải làm.
// Hòm thư = 2 nguồn: thong_bao_hs (thư thật — mở hòm là đọc hết) + BTVN ảnh đã trả (thư SUY RA từ
// btvn_nop.tra_at, CEO 29/09 — chỉ hết sáng khi em mở bài ở BaiTraHS). Trộn theo thời gian chỉ để hiển thị.
// Mở bài rồi quay lại: giữ list đã vá (da_xem) + vị trí cuộn, không tải lại (CLAUDE §2).
export function HopThuHS({ onXong }: { onXong: () => void }) {
  const [items, setItems] = useState<ThongBaoHS[] | null>(null)
  const [baiTra, setBaiTra] = useState<BaiTraRow[] | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const cuonRef = useRef(0)
  useEffect(() => {
    listThongBaoHS().then((ds) => {
      setItems(ds)
      if (ds.some((d) => !d.doc_at)) docTatCaThongBao().catch(() => {})
    }).catch(() => setItems([]))
    listBaiTraCuaToi().then(setBaiTra).catch(() => setBaiTra([]))
  }, [])
  useEffect(() => { window.scrollTo(0, mo ? 0 : cuonRef.current) }, [mo])
  if (mo) return (
    <BaiTraHS buoiHocId={mo} onXong={() => setMo(null)}
      onDaXem={(id) => setBaiTra((prev) => prev && prev.map((b) => (b.buoi_hoc_id === id ? { ...b, da_xem: true } : b)))} />
  )
  const dangTai = items === null || baiTra === null
  const thu: ({ at: string; tb: ThongBaoHS; b?: undefined } | { at: string; b: BaiTraRow; tb?: undefined })[] = dangTai ? [] : [
    ...items.map((tb) => ({ at: tb.created_at, tb })),
    ...baiTra.map((b) => ({ at: b.tra_at, b })),
  ].sort((x, y) => y.at.localeCompare(x.at))
  // Thư chưa đọc: viền nhấn skin (thay ring brand cũ).
  const vienChuaDoc = { outline: `2px solid ${MAU.acc}`, outlineOffset: '-2px' }
  return (
    <ManHS rong="hep">
      <Head title="Hòm thư" onBack={onXong} />
      {dangTai && <TrongHS>Đang tải…</TrongHS>}
      {!dangTai && thu.length === 0 && (
        <TheHS className="p-8 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-2 text-sm font-medium" style={{ color: MAU.ink }}>Chưa có thông báo nào</p>
        </TheHS>
      )}
      <div className="flex flex-col gap-3">
        {thu.map((x) => x.b ? (
          <TheHS key={`btvn:${x.b.buoi_hoc_id}`} className="p-4" style={!x.b.da_xem ? vienChuaDoc : undefined}
            onClick={() => { cuonRef.current = window.scrollY; setMo(x.b.buoi_hoc_id) }}>
            <p className="text-[14px] font-semibold leading-snug" style={{ color: MAU.ink }}>📝 Bài tập về nhà buổi {ngayNgan(x.b.ngay)} đã được chấm</p>
            <p className="mt-1 text-[13px] leading-snug" style={{ color: MAU.muted }}>
              {x.b.so_cau > 0 ? `Đúng ${x.b.so_dung}/${x.b.so_cau} câu · ` : ''}Bấm để xem bài chấm và nhận xét ›
            </p>
            <p className="mt-1.5 text-[11px]" style={{ color: MAU.muted }}>{[x.b.mon, x.b.ten_lop, fmtShort(x.b.tra_at)].filter(Boolean).join(' · ')}</p>
          </TheHS>
        ) : (
          <TheHS key={x.tb.id} className="p-4" style={!x.tb.doc_at ? vienChuaDoc : undefined}>
            <p className="text-[14px] leading-snug" style={{ color: MAU.ink }}>{x.tb.noi_dung}</p>
            <p className="mt-1.5 text-[11px]" style={{ color: MAU.muted }}>{fmtShort(x.tb.created_at)}</p>
          </TheHS>
        ))}
      </div>
    </ManHS>
  )
}

// ── ET chế độ THI: làm không lộ đáp án → Nộp 1 lần → reveal cả bài ──────────
function LamET({ test, hocSinhId, onXong }: { test: BaiTestCuaHS; hocSinhId: string; onXong: () => void }) {
  const [de, setDe] = useState<ETCauDe[] | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [ans, setAns] = useState<Record<string, Chon>>({})
  const [reveal, setReveal] = useState<Record<string, ETReveal> | null>(null)
  const [goiY, setGoiY] = useState(false)
  const [confNop, setConfNop] = useState(false)
  const [busy, setBusy] = useState(false)
  // ĐỀ THI (spec-de-thi §9.4): giữ bố cục giấy (không xáo câu/ý, có tiêu đề phần) · đồng hồ đếm ngược
  // từ bai_lam.bat_dau_at (server đóng dấu, trigger trg_bai_lam_thi — HS không sửa được) · đáp án có thể
  // KHOÁ tới khi thầy/cô mở (et_nop trả {khoa:true}). Luật giờ/nộp thật sự nằm ở trigger DB; ở đây chỉ hiển thị.
  const laDeThi = test.loai === 'de_thi'
  const [batDau, setBatDau] = useState<number | null>(null)
  const [conLai, setConLai] = useState<number | null>(null) // giây
  const [loi, setLoi] = useState<string | null>(null)
  const [diem, setDiem] = useState<DiemCuaToi | null>(null)
  const nopRef = useRef(false)

  function nhanReveal(rev: ETReveal[]) {
    setReveal(Object.fromEntries(rev.map((r) => [r.bai_test_cau_id, r])))
    if (laDeThi && !rev.some((r) => r.khoa)) diemDeThiCuaToi(test.id).then(setDiem).catch(() => {})
  }
  useEffect(() => {
    (async () => {
      // moBaiLam TRƯỚC getETDe: bien_the (mã đề gán riêng HS) chốt lúc mở slot, et_de đọc đúng
      // bien_the đó để trả đề. Đảo thứ tự là et_de luôn mặc định mã 1 (bai_lam chưa kịp tồn tại).
      const bl = await moBaiLam(test.id, hocSinhId)
      const d = await getETDe(test.id)
      setDe(d); setBaiLamId(bl.id)
      if (bl.bat_dau_at) setBatDau(new Date(bl.bat_dau_at).getTime())
      setAns(await getETDapAnDaLuu(bl.id) as Record<string, Chon>)
      if (bl.trang_thai === 'da_nop') { nopRef.current = true; nhanReveal(await nopET(bl.id)) }
    })().catch(console.error)
  }, [test.id, hocSinhId]) // eslint-disable-line
  useEffect(() => { setGoiY(false) }, [idx])
  // KHÔNG XÁO (Thùy 29/09, xem ghi chú `caus` trong LamBai): thứ tự câu = đúng phiếu giấy của mã đề em
  // được gán — et_de đã `order by bc.thu_tu` theo bien_the của bai_lam nên dùng thẳng `de`.
  const caus = de ?? []

  const daNop = !!reveal
  const hanMs = laDeThi && test.thoi_gian_phut && batDau ? batDau + test.thoi_gian_phut * 60000 : null
  useEffect(() => {
    if (!hanMs || daNop) { setConLai(null); return }
    const tick = () => {
      const s = Math.max(0, Math.round((hanMs - Date.now()) / 1000))
      setConLai(s)
      if (s === 0 && !nopRef.current) doNop() // hết giờ ⇒ tự nộp (server vẫn chặn ghi quá giờ + 2' ân hạn)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [hanMs, daNop]) // eslint-disable-line

  if (!de) return <ManCho>Đang tải đề…</ManCho>
  const total = caus.length
  const daTraLoi = caus.filter((c) => ans[c.id] != null && ans[c.id] !== '' && !(Array.isArray(ans[c.id]) && (ans[c.id] as unknown[]).some((x) => x == null))).length

  async function luu(cauId: string, v: Chon) {
    if (daNop || !baiLamId) return
    setAns((s) => ({ ...s, [cauId]: v }))
    try { await luuDapAnET(baiLamId, cauId, v); setLoi(null) } catch (e: any) { console.error(e); setLoi(e?.message ?? 'Không lưu được đáp án') }
  }
  async function doNop() {
    if (!baiLamId || nopRef.current) return
    nopRef.current = true
    setBusy(true)
    try { nhanReveal(await nopET(baiLamId)); setIdx(0); setConfNop(false) }
    catch (e: any) { nopRef.current = false; setLoi(e?.message ?? 'Nộp chưa được — thử lại') }
    finally { setBusy(false) }
  }
  async function xemLaiKhoa() {
    if (!baiLamId) return
    setBusy(true)
    try { nhanReveal(await nopET(baiLamId)) } finally { setBusy(false) }
  }

  // Đề thi đã nộp nhưng thầy/cô CHƯA mở đáp án ⇒ không lộ đúng/sai, không lộ điểm (spec §9.5.1).
  const dangKhoa = daNop && Object.values(reveal!).some((r) => r.khoa)
  if (dangKhoa) return (
    <ManGiua>
      <TheHS className="flex w-full flex-col items-center gap-3 p-6">
        <p className="text-5xl">📨</p>
        <p className="text-[18px] font-bold" style={{ ...HEAD, color: MAU.ink }}>Đã nộp bài thi</p>
        <p className="text-[14px]" style={{ color: MAU.muted }}>Em đã trả lời {daTraLoi}/{total} câu. Đáp án và điểm sẽ hiện khi thầy/cô mở đáp án.</p>
      </TheHS>
      <div className="mt-3 flex w-full gap-2">
        <button onClick={onXong} className="flex-1 py-3 text-sm" style={{ ...NUT_PHU, color: MAU.muted }}>Về trang chính</button>
        <button onClick={xemLaiKhoa} disabled={busy} className="flex-1 py-3 text-sm font-medium disabled:opacity-40" style={NUT_CHINH}>{busy ? 'Đang xem…' : '↻ Xem đã mở chưa'}</button>
      </div>
    </ManGiua>
  )

  const cau = caus[idx]
  const rv = daNop && cau ? reveal![cau.id] : undefined
  const laTN = cau?.loai_cau === 'trac_nghiem'
  const laDS = cau?.loai_cau === 'dung_sai'
  const keyDS = (rv?.dap_an_key as string[] | undefined) ?? []
  const menhDeReveal = (rv?.menh_de as { loi_giai?: string | null }[] | undefined) ?? []
  const chonArr = laDS ? ((ans[cau.id] as (string | null)[]) ?? (cau.menh_de ?? []).map(() => null)) : []
  const vd = rv?.verdict ?? ''
  // Đáp án A/B/C/D + ý a/b/c/d ĐÚNG thứ tự gốc như phiếu giấy (không xáo — Thùy 29/09). orig = dispI.
  const optsShown = laTN && cau ? (cau.lua_chon ?? []).map((item, orig) => ({ item, orig })) : []
  const correctOrigTN = laTN && daNop ? chiSoCuaChu(rv?.dap_an_key) : -1
  const menhOrder = laDS && cau ? (cau.menh_de ?? []).map((item, orig) => ({ item, orig })) : []
  // Số câu hiển thị: đề thi đánh số LẠI trong từng phần như đề giấy (Phần II bắt đầu lại Câu 1).
  const soTrongPhan = laDeThi && cau ? caus.slice(0, idx + 1).filter((c) => (c.phan ?? '') === (cau.phan ?? '')).length : idx + 1
  const dongHo = conLai != null ? `${Math.floor(conLai / 60)}:${String(conLai % 60).padStart(2, '0')}` : null


  return (
    <div style={NEN_MAN}>
    <div className="mx-auto flex h-screen max-w-md flex-col md:max-w-3xl">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onXong} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ ...THE_TRON, borderRadius: '999px', color: MAU.muted }}>✕</button>
        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: MAU.line }}>
          <div className="h-full transition-all" style={{ width: `${((idx + 1) / total) * 100}%`, background: MAU.acc }} />
        </div>
        <span className="text-[12px] font-semibold" style={{ color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{idx + 1}/{total}</span>
        {dongHo && <span className="rounded-lg px-2 py-1 font-mono text-[13px] font-semibold"
          style={conLai! <= 300 ? { background: NEN_SAI, color: MAU.sai, border: `1px solid ${VIEN_SAI}` } : { ...THE_TRON, color: MAU.ink }}>⏱ {dongHo}</span>}
      </div>
      {!daNop && <p className="px-4 pb-1 text-center text-[12px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>📝 Bài THI · nộp xong mới hiện đáp án · đã trả lời {daTraLoi}/{total}</p>}
      {loi && <p className="mx-4 mb-1 px-3 py-1.5 text-center text-[12px]" style={{ background: `linear-gradient(${NEN_SAI}, ${NEN_SAI}), var(--sk-surface)`, color: MAU.sai, borderRadius: R_TRONG }}>{loi}</p>}
      {daNop && diem && (
        <div className="mx-4 mb-2 p-3 text-center" style={THE}>
          <p className="text-[12px]" style={{ color: MAU.muted }}>Điểm bài thi</p>
          <p className="text-[28px] font-bold" style={{ ...HEAD, color: MAU.ink }}>{diem.diem_10 ?? '—'}<span className="text-[15px]" style={{ color: MAU.muted }}>/10</span></p>
          <div className="mt-1 flex flex-wrap justify-center gap-x-3 text-[12px]" style={{ color: MAU.muted }}>
            {diem.phan.map((p) => <span key={p.phan}>{p.phan || 'Câu'}: <b style={{ color: MAU.ink }}>{p.diem}</b>/{p.toi_da}</span>)}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="p-4" style={THE}>
          {laDeThi && cau.phan && <p className="mb-1 text-[12px] font-bold uppercase tracking-wide" style={{ ...HEAD, color: MAU.muted }}>{cau.phan}</p>}
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold" style={{ color: MAU.muted }}>Câu {soTrongPhan}</p>
            {cau.ly_thuyet && <button onClick={() => setGoiY((v) => !v)} className="rounded-full px-3 py-1 text-[12px] font-medium" style={NUT_GOI_Y(goiY)}>💡 Gợi ý</button>}
          </div>
          {goiY && cau.ly_thuyet && <div className="mb-3 p-3 text-[14px] leading-relaxed" style={{ ...HOP_GOI_Y, color: MAU.ink }}><ChuMon mon={test.mon}>{cau.ly_thuyet}</ChuMon></div>}
          {cau.ngu_lieu && <NguLieuHS nl={cau.ngu_lieu} mon={test.mon} />}
          {cau.noi_dung && <div className="mb-3 text-[15px] leading-relaxed" style={{ color: MAU.ink }}><ChuMon mon={test.mon}>{cau.noi_dung}</ChuMon></div>}
          {/* Hình đề: nền trắng cố định — nét đen trên trắng, đặt thẳng lên thẻ tối là mất nét. */}
          {cau.anh_de && <img src={cau.anh_de} alt="đề" className="mb-3 max-h-80 rounded-lg bg-white" style={{ border: `1px solid ${MAU.line}` }} />}

          {laTN ? (
            <div className="flex flex-col gap-2.5">
              {optsShown.map(({ item: opt, orig }, dispI) => {
                const chon = ans[cau.id] === orig
                const laDapAn = daNop && orig === correctOrigTN
                const chonSai = daNop && chon && !laDapAn
                const tt: TtO = laDapAn ? 'dung' : chonSai ? 'sai' : chon ? 'chon' : 'thuong'
                return (
                  <button key={orig} onClick={() => luu(cau.id, orig)} disabled={daNop}
                    className="flex items-start gap-3 p-3 text-left text-[15px]" style={O_DAP_AN(tt)}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold" style={TRON_CHU(tt)}>{chuCaiChon(dispI)}</span>
                    <span className="flex-1 pt-0.5"><ChuMon mon={test.mon}>{stripLabel(opt)}</ChuMon></span>
                  </button>
                )
              })}
            </div>
          ) : laDS ? (
            <div className="flex flex-col gap-2.5">
              {menhOrder.map(({ item: m, orig }, dispI) => {
                const pick = chonArr[orig] ? String(chonArr[orig]).toUpperCase() : null
                const key = daNop ? String(keyDS[orig] ?? '').toUpperCase() : null
                return (
                  <div key={orig} className="p-3" style={{ border: `1px solid ${MAU.line}`, background: MAU.surface2, borderRadius: R_TRONG }}>
                    <div className="mb-2 flex gap-2 text-[15px]" style={{ color: MAU.ink }}><span className="font-semibold" style={{ color: MAU.muted }}>{'abcd'[dispI] ?? dispI + 1})</span><span className="flex-1"><ChuMon mon={test.mon}>{m.noi_dung}</ChuMon></span></div>
                    <div className="flex gap-2">
                      {(['D', 'S'] as const).map((v) => {
                        const on = pick === v
                        const dung = daNop && v === key
                        const sai = daNop && on && v !== key
                        const tt: TtO = dung ? 'dung' : sai ? 'sai' : on ? 'chon' : 'thuong'
                        return <button key={v} onClick={() => { const cur = (ans[cau.id] as (string | null)[]) ?? (cau.menh_de ?? []).map(() => null); const next = [...cur]; next[orig] = v; luu(cau.id, next) }} disabled={daNop}
                          className="flex-1 py-1.5 text-[13px] font-medium" style={NUT_DS(tt)}>{v === 'D' ? 'Đúng' : 'Sai'}</button>
                      })}
                    </div>
                    {daNop && menhDeReveal[orig]?.loi_giai && <div className="mt-2 pt-1.5 text-[13px]" style={{ borderTop: `1px solid ${MAU.line}`, color: MAU.muted }}><ChuMon mon={test.mon}>{menhDeReveal[orig].loi_giai as string}</ChuMon></div>}
                  </div>
                )
              })}
            </div>
          ) : cau.kieu_nhap === 'phieu_4o' ? (
            <ONhap4O value={(ans[cau.id] as string) ?? ''} onChange={(v) => luu(cau.id, v)} disabled={daNop} co={15} />
          ) : (
            <input value={(ans[cau.id] as string) ?? ''} onChange={(e) => setAns((s) => ({ ...s, [cau.id]: e.target.value }))} onBlur={(e) => luu(cau.id, e.target.value)} disabled={daNop}
              placeholder="Nhập đáp án…" className={`${O_NHAP_CLS} text-[15px]`} style={O_NHAP} />
          )}

          {daNop && (
            <div className="mt-4 p-3" style={{ background: vd === 'correct' ? NEN_DUNG : vd === 'partial' ? NEN_CB : NEN_SAI, borderRadius: R_TRONG }}>
              <p className="text-[15px] font-semibold" style={{ color: vd === 'correct' ? MAU.dung : vd === 'partial' ? MAU.canhBao : MAU.sai }}>{vd === 'correct' ? '🎉 Đúng' : vd === 'partial' ? '👍 Đúng một phần' : '😔 Chưa đúng'}</p>
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>Đáp án đúng: <b style={{ color: MAU.dung }}>{String(rv?.dap_an_key)}</b></p>}
              {rv?.loi_giai && <div className="mt-2 pt-2 text-[14px] leading-relaxed" style={{ borderTop: `1px solid ${MAU.line}`, color: MAU.ink }}><p className="mb-1 text-[12px] font-semibold uppercase" style={{ color: MAU.muted }}>Lời giải</p><ChuMon mon={test.mon}>{rv.loi_giai}</ChuMon></div>}
              {rv?.anh_dap_an && <img src={rv.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg bg-white" style={{ border: `1px solid ${MAU.line}` }} />}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 p-3" style={{ background: MAU.surface, borderTop: `1px solid ${MAU.line}`, backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)' }}>
        {idx > 0 && <button onClick={() => setIdx((i) => i - 1)} className="px-4 py-3 text-sm" style={NUT_PHU}>‹</button>}
        {idx + 1 < total
          ? <button onClick={() => setIdx((i) => i + 1)} className="flex-1 py-3 text-sm font-medium" style={NUT_CHINH}>Câu tiếp →</button>
          : daNop
            ? <button onClick={onXong} className="flex-1 py-3 text-sm font-medium" style={NUT_CHINH}>Xong</button>
            : <button onClick={() => setConfNop(true)} className="flex-1 py-3 text-sm font-medium" style={NUT_NOP}>Nộp bài</button>}
      </div>

      {confNop && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6" onClick={() => setConfNop(false)}>
          <div className="w-full max-w-md p-5" style={THE_TRON} onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-semibold" style={{ ...HEAD, color: MAU.ink }}>Nộp bài thi?</p>
            <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>Đã trả lời {daTraLoi}/{total} câu. Nộp xong sẽ chấm và <b style={{ color: MAU.ink }}>không sửa được</b> nữa.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfNop(false)} className="flex-1 py-3 text-sm" style={{ ...NUT_PHU, color: MAU.muted }}>Để xem lại</button>
              <button onClick={doNop} disabled={busy} className="flex-1 py-3 text-sm font-medium disabled:opacity-40" style={NUT_NOP}>{busy ? 'Đang nộp…' : 'Nộp bài'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

function fmtNgay(d: string): string { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}` }
// Hạn nộp = timestamptz → hiển thị GIỜ VN (đừng để trình duyệt tự đoán múi giờ).
function fmtHan(iso: string): string {
  const vn = new Date(new Date(iso).getTime() + 7 * 3600000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(vn.getUTCDate())}/${p(vn.getUTCMonth() + 1)} ${p(vn.getUTCHours())}:${p(vn.getUTCMinutes())}`
}
// Bỏ nhãn "A." / "B." đầu lựa chọn (kho lưu "B. nội dung"; phần tử [0] thường mất nhãn).
function stripLabel(s: string): string { return s.replace(/^\s*[A-F][.)]\s*/, '') }
// Ngày ngắn dd/mm cho "5 lần gần nhất" (giờ VN, không dùng toISOString() — CLAUDE.md §2 cấm).
function fmtShort(iso: string): string {
  const vn = new Date(new Date(iso).getTime() + 7 * 3600000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(vn.getUTCDate())}/${p(vn.getUTCMonth() + 1)}`
}
