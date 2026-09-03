// ============================================================================
// HocSinhApp — app HS-facing (mobile) làm BTVN online. Slice 1: trắc nghiệm + trả lời ngắn.
// Luồng (Thùy chốt): 1 câu/màn → chọn đáp án → "Xác nhận" (tránh ấn nhầm) → chấm tức thì
//   → hiện đáp án + lời giải chi tiết của câu → "Câu tiếp". BTVN reveal ngay, làm lại tới hạn.
// Skin = plain-clean; game (Fredoka/mascot/gradient) làm phiên design sau.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MathText } from '../kho/ui'
import {
  listBaiTestCuaHS, getBaiTestFull, moBaiLam, traLoiCau, baoSai, nopBai, chuCaiChon, chiSoCuaChu,
  getETDe, luuDapAnET, nopET, getETDapAnDaLuu, xemGoiY, daHetHan,
  type BaiTestCuaHS, type BaiTestFull, type BaiLamCau, type ETCauDe, type ETReveal,
} from '../../lib/testonline'
import { mucDeadline, nhanConLai } from '../../lib/tuan'
import { seededShuffleWithOrig, seededPermByDang } from '../../lib/shuffle'
import {
  luotTuLuyenHomNay, sinhTuLuyen, monCuaHS, laCap1HS, khoiCuaHS, layDangHocTap, xepHangTuLuyen,
  TU_LUYEN_SO_CAU_MOI_LUOT, SRC_LABEL, type DangHocTap, type RecentEval, type XepHangRow,
} from '../../lib/tuluyen'
import DoiMatKhau from './DoiMatKhau'

type Chon = number | string | (string | null)[] | null // TN=index · TLN=chuỗi · ĐS=mảng 'D'/'S'
type CauState = { chon: Chon; kq: { verdict: string; key: unknown; baiLamCauId: string } | null; baoRoi?: boolean }
type MenhDeSnap = { noi_dung: string; loi_giai?: string | null }

const LOAI_TEN: Record<string, string> = { btvn: 'BTVN', et: 'ET', giao_trinh: 'Bài tập', de_thi: 'Đề thi' }
// Chế độ THI (giấu đáp án tới khi nộp, chấm server, chỉ tính lần nộp đầu) — ET và đề thi trường/sở đều vậy.
const THI_LOAI = new Set(['et', 'de_thi'])

// ── MÀN CHÍNH = 6 Ô VUÔNG (Thùy chốt 17/08) ─────────────────────────────────
// 3 ô đầu nối THẲNG với tài liệu trên lớp: mỗi ô = 1 loại doc phát hành từ Kho
// (giáo trình buổi → giao_trinh · ET → et · BTVN → btvn). Không thêm gì ở tầng dữ
// liệu — chỉ tách danh sách phẳng cũ thành 3 cửa.
// 3 ô sau CHƯA build (spec đã có, xem spec-test-online.md §12): tự luyện (hệ tự sinh
// 10 câu theo dạng yếu, ĐẾM vào mastery) · thông tin học tập (dạng yếu + %Đ-C-S theo
// dạng/chuyên đề + xếp hạng lớp/khối) · làm đề thi thử (đề trường/sở, sắp nhập nhiều).
// 2 CỘT — màn điện thoại dọc (Thùy: "màn hình điện thoại là dọc mà").
// ⭐ CẤP 1 (Thùy 20/08): "cấp 1 ko có làm ET, BTVN hay BTTL trên điện thoại. Chỉ có tự luyện" — 3 ô
// đầu ẨN HẲN (không phải "Sắp có") cho cấp 1, KHÔNG đổi gì ở tầng dữ liệu (cấp 1 vốn không có
// bai_test loại giao_trinh/et/btvn nào — cuaKhu() các ô đó luôn rỗng, ẩn chỉ là bớt nhiễu UI).
const KHU_AN_CAP1 = new Set<KhuId>(['giao_trinh', 'et', 'btvn'])
// Bảng xếp hạng (Thùy 21/08: "ko phải chỉ 5T. Hiện cho các khối tiểu học") — mọi khối cấp 1, MỖI
// EM xếp hạng với ĐÚNG khối của mình (BangXepHang tự đọc khoiCuaHS(), không hardcode '5T' nữa).
const KHU_CHI_CAP1 = new Set<KhuId>(['xep_hang'])
type KhuId = 'giao_trinh' | 'et' | 'btvn' | 'tu_luyen' | 'thong_tin' | 'de_thi_thu' | 'xep_hang'
// direct = ô này KHÔNG đi qua màn "danh sách nhiều bài" (setKhu+tab) — bấm vào thẳng 1 màn riêng.
// Tự luyện là 1 PHIÊN đang-tiếp-diễn trong ngày (không phải danh sách bài đã phát hành theo ngày
// như ET/BTVN), nên không hợp mô hình list+tab dùng chung — mỗi màn direct tự lo dữ liệu riêng.
// mau = màu nền ô icon (Thùy: giống app PH — mỗi ô 1 màu, đúng ".function .blue/.green/..." trong
// bkdemy-ph-app/app/ph-v3.css, KHÔNG phải xám phẳng đơn điệu như bản trước).
const KHU: { id: KhuId; ten: string; icon: string; loai?: string; direct?: boolean; mau: string }[] = [
  { id: 'giao_trinh', ten: 'Bài tập trên lớp', icon: '📓', loai: 'giao_trinh', mau: 'brand' },
  { id: 'et', ten: 'ET', icon: '📋', loai: 'et', mau: 'ph-purple' },
  { id: 'btvn', ten: 'BTVN', icon: '🏠', loai: 'btvn', mau: 'ph-orange' },
  { id: 'tu_luyen', ten: 'Tự luyện', icon: '🎯', direct: true, mau: 'ph-green' },
  { id: 'thong_tin', ten: 'Thông tin học tập', icon: '📈', direct: true, mau: 'brand' },
  { id: 'xep_hang', ten: 'Bảng xếp hạng', icon: '🏆', direct: true, mau: 'ph-orange' },
  { id: 'de_thi_thu', ten: 'Làm đề thi thử', icon: '📄', mau: 'ph-purple' },
]
// Tailwind quét class TĨNH trong nguồn — không ghép chuỗi `bg-${mau}/10` (mất class). Liệt kê đủ.
const MAU_BG: Record<string, string> = { brand: 'bg-brand/10', 'ph-purple': 'bg-ph-purple/10', 'ph-orange': 'bg-ph-orange/10', 'ph-green': 'bg-ph-green/10' }
const SHADOW = 'shadow-[0_8px_24px_rgba(28,38,61,0.07)]' // ĐÚNG --shadow của bkdemy-ph-app/app/ph-v3.css

// Header sub-màn (Thùy: "làm header giống app phụ huynh") — ĐÚNG `.pageHead` (ph-v3.css:65-67):
// nút back vuông-tròn (squircle, KHÔNG tròn) nổi trên nền trang (không phải thanh trắng riêng).
function Head({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 bg-ios px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))]">
      <button onClick={onBack} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white text-[20px] text-ph-label-2 ${SHADOW}`}>‹</button>
      <div className="min-w-0">
        <h1 className="text-[21px] font-bold leading-tight tracking-tight text-ph-label">{title}</h1>
        {sub && <p className="mt-0.5 text-[12px] text-ph-label-2">{sub}</p>}
      </div>
    </div>
  )
}

// ── MÀN CHÍNH CẤP 1 — desktop/iPad-first (Thùy 21/08, theo mockup HTML "BK_Academy_Student_App_
// 6_Boxes") — 6 ô: 3 ô CÓ data thật (Tự luyện/Thông tin học tập/Bảng xếp hạng) bấm được, 3 ô CHƯA
// có backend (Bài tập được giao/Sự kiện học tập/Huy hiệu) hiện "Sắp có", KHÔNG bấm được — tránh
// hứa tính năng chưa tồn tại. Bảng màu RIÊNG (không phải bảng ph-* dùng cho cấp 3 — mockup này là
// hướng thiết kế khác hẳn, tươi/nhiều màu hơn, không cố match app PH nữa).
type BoxCap1 = { id: 'tu_luyen' | 'thong_tin' | 'xep_hang'; ten: string; mo_ta: string; icon: string; grad: string } | { id: string; ten: string; mo_ta: string; icon: string; grad: string; sapCo: true }
const BOX_CAP1: BoxCap1[] = [
  { id: 'tu_luyen', ten: 'Tự luyện', mo_ta: 'Luyện theo dạng bài còn yếu hoặc chủ động chọn nội dung muốn ôn tập.', icon: '🎯', grad: 'from-[#f0e9ff] to-[#faf8ff]' },
  { id: 'bai_tap_giao', ten: 'Bài tập được giao', mo_ta: 'Làm các bài tập giáo viên giao thêm cho cá nhân hoặc cả lớp.', icon: '📋', grad: 'from-[#e8f4ff] to-[#f7fbff]', sapCo: true },
  { id: 'thong_tin', ten: 'Thông tin học tập', mo_ta: 'Xem kết quả gần nhất, dạng đang yếu, nhận xét và gợi ý ôn tập.', icon: '📘', grad: 'from-[#e9f9ff] to-[#f6fdff]' },
  { id: 'xep_hang', ten: 'Bảng xếp hạng', mo_ta: 'Theo dõi thứ hạng và tạo động lực thi đua cùng các bạn.', icon: '🏅', grad: 'from-[#e7f9f1] to-[#f5fffb]' },
  { id: 'su_kien', ten: 'Sự kiện học tập', mo_ta: 'Các cuộc thi, thử thách và hoạt động học tập theo từng thời điểm.', icon: '🎉', grad: 'from-[#fff1de] to-[#fffaf1]', sapCo: true },
  { id: 'huy_hieu', ten: 'Huy hiệu', mo_ta: 'Xem các huy hiệu, thành tích và mốc học tập đã đạt được.', icon: '🏆', grad: 'from-[#ffedf5] to-[#fff8fb]', sapCo: true },
]
// Thùy 22/08 gửi thẳng file mockup tỉ lệ đúng ý (`BK_Academy_Student_Desktop.html`) sau khi bản
// trước "hộp quá to chữ quá nhỏ". Port lại ĐÚNG số đo từ file đó (hero 2 cột kèm art bên phải, hộp
// min-h 208px/icon 58px/tiêu đề 21px/mô tả 13px/pad 24px/gap 18px) thay vì tự đoán tiếp lần 3.
// Bỏ khoá `h-screen overflow-hidden` — mockup gốc của Thùy vốn là trang cuộn tự nhiên theo nội dung
// (không ép vừa 1 màn hình), thân trang cao hơn viewport 13-14" thì cuộn nhẹ là đúng theo THIẾT KẾ
// gốc, không phải bug — khác hẳn bug 21/08 (cuộn do zoom 1.15 lỗi, xem main-hs.tsx).
function HomeCap1({ hoTen, maHS, onOpen }: { hoTen: string; maHS: string; onOpen: (d: 'tu_luyen' | 'thong_tin' | 'xep_hang') => void }) {
  const initials = hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at 85% 5%, rgba(115,87,245,.10), transparent 24rem), radial-gradient(circle at 8% 25%, rgba(47,128,237,.08), transparent 22rem), #f4f7fb' }}>
      <div className="mx-auto w-full max-w-[1560px] px-8 py-6">
        {/* Topbar */}
        <div className="mb-[18px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img src="/Logo.png" alt="BK Academy" className="h-9 w-auto" />
            <span className="rounded-full border border-[#e8edf5] bg-white/90 px-3.5 py-2 text-[13px] font-bold text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)]">📚 App học tập cho học sinh</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex min-w-[220px] items-center gap-3 rounded-[18px] bg-white py-2 pl-2 pr-3 shadow-[0_6px_16px_rgba(31,47,79,0.06)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#2486df] to-[#745bf0] text-[13px] font-black text-white">{initials}</div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[14px] font-bold text-[#171a2b]">{hoTen}</p>
                <p className="truncate text-[11px] text-[#7b8499]">{maHS.toUpperCase()}</p>
              </div>
            </div>
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

        {/* Lưới 6 ô — số đo port thẳng từ mockup: min-h 208px, icon 58px/30px, tiêu đề 21px, mô tả 13px */}
        <section className="mt-5">
          <div className="mb-3.5 flex items-end justify-between gap-3">
            <div>
              <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.4px] text-[#171a2b]">Khu vực học tập</h2>
              <p className="m-0 mt-1 text-[13px] text-[#7b8499]">6 chức năng chính của học sinh.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[18px]">
            {BOX_CAP1.map((b) => {
              const sapCo = 'sapCo' in b && b.sapCo
              return (
                <button key={b.id} disabled={sapCo} onClick={() => !sapCo && onOpen(b.id as 'tu_luyen' | 'thong_tin' | 'xep_hang')}
                  className={`group relative flex min-h-[208px] flex-col items-start rounded-[26px] border border-white/76 bg-gradient-to-br p-6 text-left shadow-[0_16px_40px_rgba(31,47,79,0.08)] transition ${b.grad} ${sapCo ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,47,79,0.12)]'}`}>
                  <div className="mb-[18px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-white/72 text-[30px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]">{b.icon}</div>
                  <h3 className="m-0 mb-2 text-[21px] font-extrabold text-[#171a2b]">{b.ten}</h3>
                  <p className="m-0 max-w-[88%] text-[13px] leading-[1.55] text-[#626c80]">{b.mo_ta}</p>
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
  const [direct, setDirect] = useState<'tu_luyen' | 'thong_tin' | 'xep_hang' | null>(null)
  const [cap1, setCap1] = useState<boolean | null>(null) // null = chưa biết — chờ trước khi vẽ lưới ô

  useEffect(() => { listBaiTestCuaHS().then(setTests).catch(() => setTests([])) }, [])
  useEffect(() => { laCap1HS().then(setCap1).catch(() => setCap1(false)) }, [])

  if (doiMK) return <DoiMatKhau maHS={maHS} batBuoc={false} onXong={() => setDoiMK(false)} />

  if (direct === 'tu_luyen') return <LamTuLuyen hocSinhId={hocSinhId} onXong={() => setDirect(null)} desktop={!!cap1} />
  if (direct === 'thong_tin') return <ThongTinHocTap onXong={() => setDirect(null)} desktop={!!cap1} />
  if (direct === 'xep_hang') return <BangXepHang onXong={() => setDirect(null)} />

  if (active) {
    const back = () => { setActive(null); listBaiTestCuaHS().then(setTests) }
    return THI_LOAI.has(active.loai)
      ? <LamET test={active} hocSinhId={hocSinhId} onXong={back} />
      : <LamBai baiTestId={active.id} hocSinhId={hocSinhId} onXong={back} />
  }

  const xongCua = (t: BaiTestCuaHS) => t.bai_lam?.trang_thai === 'da_nop'
  const cuaKhu = (id: KhuId) => {
    const loai = KHU.find((k) => k.id === id)?.loai
    return loai ? (tests ?? []).filter((t) => t.loai === loai) : []
  }
  // Danh tính hiển thị: lấy từ chính test HS thấy (đã qua RLS) — không query thêm bảng nào.
  const lopMon = tests?.[0] ? `${tests[0].lop_ten} · ${tests[0].mon}` : null

  const CHU_DUOI: Partial<Record<KhuId, string>> = { tu_luyen: 'Luyện theo dạng yếu', thong_tin: 'Dạng đang yếu', xep_hang: 'Thi đua tự luyện' }

  // ── MÀN CHÍNH: ô vuông (theo cấp/khối), 2 cột ─────────────────────────────
  if (!khu && cap1 === null) return <div className="flex min-h-screen items-center justify-center bg-ios text-sm text-ph-label-2">Đang tải…</div>
  // Cấp 1 (Thùy 21/08: "học sinh làm ở nhà trên máy tính/iPad, không phải điện thoại") — màn RIÊNG
  // desktop/iPad-first theo mockup HTML CEO gửi, KHÔNG dùng lưới mobile-first bên dưới (cấp 3 vẫn
  // giữ nguyên màn cũ — CEO xác nhận "cấp 3 chưa dùng màn này", bàn sau).
  if (!khu && cap1) return <HomeCap1 hoTen={hoTen} maHS={maHS} onOpen={(d) => setDirect(d)} />
  if (!khu) return (
    <div className="mx-auto min-h-screen max-w-md bg-ios px-4 pb-10 pt-[calc(14px+env(safe-area-inset-top))]">
      {/* Hàng nút phụ (đổi MK/thoát) — ĐÚNG ".top" (ph-v3.css): icon-button vuông-tròn nổi trên nền trang */}
      <div className="mb-3 flex items-center justify-end gap-2">
        <button onClick={() => setDoiMK(true)} title="Đổi mật khẩu" className={`flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-white text-[16px] ${SHADOW}`}>🔑</button>
        <button onClick={() => supabase.auth.signOut()} className={`flex h-[42px] items-center justify-center rounded-[14px] bg-white px-3.5 text-[13px] font-semibold text-ph-label-2 ${SHADOW}`}>Thoát</button>
      </div>
      {/* Danh tính — ĐÚNG ".studentCard" (ph-v3.css): card trắng bo 24px, avatar SQUIRCLE (không tròn) */}
      <div className={`flex items-center gap-3 rounded-[24px] bg-white p-3.5 ${SHADOW}`}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-brand to-brand-2 text-[22px] font-bold text-white">
          {hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[19px] font-bold tracking-tight text-ph-label">{hoTen}</p>
          <p className="mt-1 truncate text-[13px] text-ph-label-2">{maHS.toUpperCase()}{lopMon ? ` · ${lopMon}` : ''}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {KHU.filter((k) => !(cap1 && KHU_AN_CAP1.has(k.id)) && !(KHU_CHI_CAP1.has(k.id) && !cap1)).map((k) => {
          const sapCo = !k.loai && !k.direct
          const ds = k.loai ? cuaKhu(k.id) : []
          // Badge = việc CÒN LÀM ĐƯỢC. Bài quá hạn vẫn hiện trong danh sách (Thùy: "hiện quá hạn
          // thôi") nhưng không đếm vào badge — badge mà đếm cả thứ không bấm được thì thành nhiễu.
          const nChuaLam = ds.filter((t) => !xongCua(t) && !daHetHan(t)).length
          const nQuaHan = ds.filter((t) => !xongCua(t) && daHetHan(t)).length
          const onClick = sapCo ? undefined : k.direct ? () => setDirect(k.id as 'tu_luyen' | 'thong_tin' | 'xep_hang') : () => { setKhu(k.id); setTab('chua') }
          return (
            <button key={k.id} disabled={sapCo} onClick={onClick}
              className={`relative flex min-h-[132px] flex-col justify-between rounded-[22px] p-4 text-left transition ${
                sapCo ? 'bg-black/[0.03]' : `bg-white active:scale-[0.98] ${SHADOW}`}`}>
              <span className={`flex h-11 w-11 items-center justify-center rounded-[15px] text-[21px] ${sapCo ? 'bg-black/[0.05] opacity-40' : MAU_BG[k.mau]}`}>{k.icon}</span>
              <span>
                <span className={`block text-[15px] font-bold tracking-tight ${sapCo ? 'text-ph-label-2/70' : 'text-ph-label'}`}>{k.ten}</span>
                <span className={`mt-1 block text-[11px] leading-snug ${nChuaLam === 0 && nQuaHan > 0 ? 'text-ph-red' : 'text-ph-label-2'}`}>
                  {sapCo ? 'Sắp có' : k.direct ? CHU_DUOI[k.id] : tests === null ? '…'
                    : nChuaLam > 0 ? `${nChuaLam} bài chưa làm`
                    : nQuaHan > 0 ? `${nQuaHan} bài quá hạn`
                    : ds.length ? 'Xong hết rồi' : 'Chưa có bài'}
                </span>
              </span>
              {nChuaLam > 0 && (
                <span className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-ph-red px-1.5 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(230,64,64,0.38)]">{nChuaLam}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  // ── DANH SÁCH 1 KHU ───────────────────────────────────────────────────────
  const dsKhu = cuaKhu(khu)
  const nChua = dsKhu.filter((t) => !xongCua(t)).length
  const nXong = dsKhu.filter(xongCua).length
  const shown = dsKhu.filter((t) => (tab === 'xong' ? xongCua(t) : !xongCua(t)))
  const tenKhu = KHU.find((k) => k.id === khu)?.ten ?? ''

  return (
    <div className="mx-auto min-h-screen max-w-md bg-ios px-4 pb-10">
      <Head title={tenKhu} onBack={() => setKhu(null)} />

      <div className="mb-4 mt-3 grid grid-cols-2 gap-1 rounded-[15px] bg-black/[0.05] p-1">
        {([['chua', 'Chưa làm', nChua], ['xong', 'Hoàn thành', nXong]] as const).map(([k, label, n]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-xl py-2.5 text-[13px] font-bold transition ${tab === k ? `bg-white text-brand ${SHADOW}` : 'text-ph-label-2'}`}>
            {label} {n > 0 && <span className="text-[12px] font-medium text-ph-label-2">({n})</span>}
          </button>
        ))}
      </div>

      {tests === null && <p className="py-10 text-center text-sm text-ph-label-2">Đang tải…</p>}
      {tests && shown.length === 0 && (
        <div className={`rounded-[21px] bg-white p-8 text-center ${SHADOW}`}>
          <p className="text-3xl">{tab === 'xong' ? '📭' : '🎉'}</p>
          <p className="mt-2 text-sm font-medium text-ph-label">{tab === 'xong' ? 'Chưa hoàn thành bài nào' : 'Không có bài nào cần làm'}</p>
          <p className="mt-1 text-[13px] text-ph-label-2">{tab === 'xong' ? 'Làm xong bài sẽ chuyển sang đây.' : `Khi thầy cô giao ${tenKhu.toLowerCase()}, bài sẽ hiện ở đây.`}</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {shown.map((t) => {
          const lam = t.bai_lam
          const daNop = xongCua(t)
          const laThi = THI_LOAI.has(t.loai)
          // Quá hạn mà CHƯA nộp → khoá, không mở được nữa. Đã nộp rồi thì vẫn xem lại được.
          const hetHan = daHetHan(t)
          const khoa = hetHan && !daNop
          const dlMs = t.deadline ? new Date(t.deadline).getTime() : null
          const muc = mucDeadline(dlMs)
          return (
            <button key={t.id} disabled={khoa} onClick={() => setActive(t)}
              className={`rounded-[21px] p-4 text-left transition ${khoa ? 'bg-black/[0.03]' : `bg-white active:scale-[0.99] ${SHADOW}`}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[15px] font-semibold ${khoa ? 'text-ph-label-2' : 'text-ph-label'}`}>
                  {laThi && <span className="mr-1.5 rounded bg-ph-purple/10 px-1.5 py-0.5 text-[11px] font-semibold text-ph-purple">THI</span>}
                  {LOAI_TEN[t.loai] ?? 'Bài'} {t.mon} · {t.lop_ten}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  daNop ? 'bg-ph-green/10 text-ph-green' : khoa ? 'bg-ph-red/10 text-ph-red'
                  : lam ? 'bg-ph-orange/10 text-ph-orange' : 'bg-brand/10 text-brand'}`}>
                  {daNop ? '✓ hoàn thành' : khoa ? 'quá hạn' : lam ? 'đang làm' : 'mới'}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-ph-label-2">Buổi {fmtNgay(t.ngay)} · {t.so_cau} câu{laThi ? ' · nộp 1 lần' : ''}</p>
              {dlMs !== null && !daNop && (
                <p className={`mt-1 text-[12.5px] font-medium ${
                  muc === 'qua_han' ? 'text-ph-red' : muc === 'sat' ? 'text-ph-orange' : muc === 'gan' ? 'text-ph-orange' : 'text-ph-label-2'}`}>
                  ⏳ Hạn {fmtHan(t.deadline!)} · {nhanConLai(dlMs)}
                </p>
              )}
              <p className={`mt-2 text-[13px] font-medium ${khoa ? 'text-ph-label-2' : 'text-brand'}`}>
                {khoa ? 'Đã đóng — không nộp được nữa' : `${daNop ? 'Xem lại' : lam ? 'Tiếp tục' : 'Bắt đầu'} →`}
              </p>
            </button>
          )
        })}
      </div>
    </div>
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
function LamBai({ baiTestId, hocSinhId, onXong, doneCaption, doneExtra, desktop }: {
  baiTestId: string; hocSinhId: string; onXong: () => void
  doneCaption?: string; doneExtra?: React.ReactNode; desktop?: boolean
}) {
  const [full, setFull] = useState<BaiTestFull | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [st, setSt] = useState<Record<string, CauState>>({})
  const [busy, setBusy] = useState(false)
  const [nopped, setNopped] = useState(false)
  const [goiY, setGoiY] = useState(false)

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
      // TIẾN TRÌNH (Thùy 29/08: "vào toàn bắt bật lại từ câu 1"): mở lại bài dở → nhảy thẳng câu
      // CHƯA làm đầu tiên; xong hết → vào thẳng màn kết quả (tự luyện: nơi có nút "Làm thêm").
      // Vị trí KHÔNG cần lưu đâu cả — suy từ f.daLam (bai_lam_cau) theo ĐÚNG thứ tự hiển thị đã xáo
      // seeded (tính lại y hệt useMemo `caus` dưới — seed ổn định nên 2 nơi cho cùng 1 hoán vị).
      if (Object.keys(f.daLam).length > 0) {
        const order = f.baiTest.loai === 'giao_trinh' ? f.caus : seededPermByDang(f.caus, `${hocSinhId}:${baiTestId}:q`).map((i) => f.caus[i])
        const dau = order.findIndex((c) => !f.daLam[c.id])
        setIdx(dau === -1 ? order.length : dau)
      }
    })().catch(console.error)
  }, [baiTestId, hocSinhId])

  useEffect(() => { setGoiY(false) }, [idx]) // đổi câu → ẩn gợi ý

  // Làm xong HẾT câu → đánh dấu HOÀN THÀNH (bai_lam da_nop). Idempotent (claim atomic).
  useEffect(() => {
    if (!full || !baiLamId || nopped) return
    if (full.caus.length > 0 && full.caus.every((c) => st[c.id]?.kq)) { setNopped(true); nopBai(baiLamId).catch(() => {}) }
  }, [st, full, baiLamId, nopped])

  // Xáo THỨ TỰ CÂU theo (HS×bài) — ổn định (mở lại vẫn thấy đúng thứ tự cũ), khác nhau giữa các HS
  // (chống liếc bài). CHỈ xáo câu TRONG CÙNG 1 DẠNG, giữ nguyên khối/thứ tự các dạng (xem shuffle.ts).
  // Chấm/khôi phục vẫn khớp `cau.id`, không phụ thuộc vị trí → an toàn tuyệt đối.
  // ⚠ Thùy 22/08: "giáo trình phát hành phải giống HỆT lúc gán — sao lại tự đổi câu và thứ tự".
  // Xáo trên vốn để chống-liếc-bài cho ET/BTVN — GIÁO TRÌNH không có khái niệm "liếc bài" (cả lớp học
  // CHUNG 1 tài liệu in/chiếu, thứ tự phải khớp bản GV đang cầm) nên PHẢI khoá y hệt `full.caus` (đã
  // đúng thứ tự gán từ `trichXuatBuoi`/`copyPhanInto`, xem tailieu.ts). Cùng nguyên tắc đã áp cho ET
  // khi có ≥2 mã đề (LamET: `test.co_nhieu_ma_de` → bỏ xáo, commit 08b8321) — giáo trình luôn bỏ xáo.
  const khoaThuTuGoc = full?.baiTest.loai === 'giao_trinh'
  const caus = useMemo(() => {
    if (!full) return []
    if (khoaThuTuGoc) return full.caus
    return seededPermByDang(full.caus, `${hocSinhId}:${baiTestId}:q`).map((i) => full.caus[i])
  }, [full, khoaThuTuGoc, hocSinhId, baiTestId])

  if (!full) return <div className={`flex min-h-screen items-center justify-center text-sm text-ph-label-2 ${desktop ? 'bg-[#f4f7fb]' : 'bg-ios'}`}>Đang tải bài…</div>
  const total = caus.length
  const daXongHet = caus.every((c) => st[c.id]?.kq)
  const cau = caus[idx]
  const cs = cau ? st[cau.id] : undefined
  const daCham = !!cs?.kq
  const laTN = cau?.loai_cau === 'trac_nghiem'
  const laDS = cau?.loai_cau === 'dung_sai'
  const menhDe: MenhDeSnap[] = laDS ? ((cau!.menh_de as MenhDeSnap[]) ?? []) : []
  const keyDS: string[] = laDS ? ((cau!.dap_an_key as string[]) ?? []) : []
  const chonArr: (string | null)[] = laDS ? ((cs?.chon as (string | null)[]) ?? menhDe.map(() => null)) : []
  // Xáo THỨ TỰ ĐÁP ÁN hiển thị (TN 4 phương án · ĐS 4 mệnh đề) theo (HS×bài×câu) — orig = chỉ số GỐC
  // dùng để ghi state/so đáp án đúng; dispI = vị trí hiển thị (chỉ để đặt nhãn A/B/C/D · a/b/c/d).
  // Giáo trình khoá NGUYÊN thứ tự (xem `khoaThuTuGoc` ở trên) — cùng lý do, cả lớp chung 1 tài liệu.
  const optsShown = laTN && cau
    ? (khoaThuTuGoc ? (cau.lua_chon ?? []).map((item, orig) => ({ item, orig })) : seededShuffleWithOrig(cau.lua_chon ?? [], `${hocSinhId}:${baiTestId}:${cau.id}:opt`))
    : []
  const correctOrigTN = laTN && daCham && cau ? chiSoCuaChu(cau.dap_an_key) : -1
  const menhOrder = laDS && cau
    ? (khoaThuTuGoc ? menhDe.map((item, orig) => ({ item, orig })) : seededShuffleWithOrig(menhDe, `${hocSinhId}:${baiTestId}:${cau.id}:ds`))
    : []
  // Đã chọn đủ để Xác nhận? TN=đã chọn 1 · TLN=nhập khác rỗng · ĐS=đủ 4 ý.
  const daDu = laTN ? typeof cs?.chon === 'number'
    : laDS ? (chonArr.length === menhDe.length && menhDe.length > 0 && chonArr.every((x) => x != null))
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
    } finally { setBusy(false) }
  }

  // Báo sai: TLN mọi loại bài = "em nghĩ mình đúng" (đường accepted-answer, tab 🚩 Duyệt chấm).
  // TN/ĐS CHỈ giáo trình (Thùy 03/09: "phát hành giáo trình cũng cần báo sai đề như tự luyện") =
  // "đề/đáp án sai" → đi đường KEY SAI (tab ⚠ Nghi sai đáp án — chấm lại), vì TN/ĐS không có
  // chuyện "viết cách khác cũng đúng", chỉ có key kho sai. Cùng bảng bai_test_report, khác ý kiến.
  const baoSaiDe = khoaThuTuGoc && (laTN || laDS)
  async function guiBaoSai() {
    if (!cau || !cs?.kq) return
    await baoSai(cs.kq.baiLamCauId, hocSinhId, baoSaiDe ? 'Em nghĩ đề hoặc đáp án sai.' : 'Em nghĩ mình đúng.')
    setSt((s) => ({ ...s, [cau.id]: { ...s[cau.id], baoRoi: true } }))
  }

  // Màn kết quả cuối
  if (idx >= total) {
    const dung = caus.filter((c) => st[c.id]?.kq?.verdict === 'correct').length
    return (
      <div className={desktop
        ? 'flex min-h-screen flex-col items-center justify-center bg-[#f4f7fb] px-6 text-center'
        : 'mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-ios px-6 text-center'}>
        <div className={`flex items-center justify-center rounded-full bg-ph-green/10 ${desktop ? 'h-24 w-24 text-5xl' : 'h-20 w-20 text-4xl'}`}>🏆</div>
        <p className={`mt-4 font-bold tracking-tight text-ph-label ${desktop ? 'text-3xl' : 'text-2xl'}`}>{dung} / {total} đúng</p>
        <p className="mt-1 text-[13px] text-ph-label-2">{doneCaption ?? 'Làm lại được tới hạn nộp. Kết quả gửi thầy cô tham khảo.'}</p>
        <button onClick={onXong} className={`mt-6 rounded-xl bg-brand font-medium text-white ${desktop ? 'px-8 py-3.5 text-[15px] shadow-[0_10px_24px_rgba(115,87,245,.22)]' : 'px-6 py-3 text-sm'}`}>Về danh sách</button>
        {doneExtra}
      </div>
    )
  }

  const vd = daCham ? cs!.kq!.verdict : ''
  const boxCls = vd === 'correct' ? 'bg-ph-green/10' : vd === 'partial' ? 'bg-ph-orange/10' : 'bg-ph-red/10'
  const txtCls = vd === 'correct' ? 'text-ph-green' : vd === 'partial' ? 'text-ph-orange' : 'text-ph-red'
  const dsDung = laDS && daCham ? chonArr.filter((x, i) => x != null && String(x).toUpperCase() === String(keyDS[i]).toUpperCase()).length : 0
  const trongTam = (
    <>
      <div className={desktop ? 'mb-5 flex items-center gap-4' : 'flex items-center gap-3 px-4 py-3'}>
        <button onClick={onXong} className={desktop ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)]' : 'text-ph-label-2'}>✕</button>
        <div className={desktop ? 'h-2.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]' : 'h-2 flex-1 overflow-hidden rounded-full bg-black/[0.08]'}>
          <div className="h-full bg-brand transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className={desktop ? 'text-[13px] font-semibold text-[#7b8499]' : 'text-[12px] text-ph-label-2'}>{idx + 1}/{total}</span>
      </div>

      <div className={desktop ? '' : 'flex-1 overflow-y-auto px-4 pb-4'}>
        <div className={desktop ? 'rounded-[26px] bg-white p-8 shadow-[0_16px_40px_rgba(31,47,79,0.08)]' : 'rounded-2xl bg-white p-4 shadow-sm'}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ph-label-2">Câu {idx + 1}</p>
            {cau.ly_thuyet && (
              <button onClick={() => setGoiY((v) => {
                const nv = !v
                // Ghi vết lúc MỞ (không cần lúc đóng) — GV xem live biết ai đang cần gợi ý. Fire-and-forget.
                if (nv && baiLamId) xemGoiY(baiLamId, cau.id).catch(() => {})
                return nv
              })}
                className={`rounded-full border px-3 py-1 text-[12px] font-medium transition ${goiY ? 'border-ph-orange/40 bg-ph-orange/15 text-ph-orange' : 'border-ph-orange/25 bg-ph-orange/10 text-ph-orange'}`}>
                💡 Gợi ý
              </button>
            )}
          </div>
          {goiY && cau.ly_thuyet && (
            <div className="mb-3 rounded-xl border border-ph-orange/25 bg-ph-orange/[0.06] p-3">
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-ph-orange">Lý thuyết dạng bài</p>
              <div className="text-[14px] leading-relaxed text-ph-label"><MathText>{cau.ly_thuyet}</MathText></div>
            </div>
          )}
          {cau.noi_dung && <div className="mb-3 text-[15px] leading-relaxed text-ph-label"><MathText>{cau.noi_dung}</MathText></div>}
          {cau.anh_de && <img src={cau.anh_de} alt="đề" className="mb-3 max-h-80 rounded-lg border border-black/[0.08]" />}

          {laTN ? (
            <div className="flex flex-col gap-2.5">
              {optsShown.map(({ item: opt, orig }, dispI) => {
                const chon = cs?.chon === orig
                const laDapAn = daCham && orig === correctOrigTN
                const chonSai = daCham && chon && !laDapAn
                return (
                  <button key={orig} onClick={() => setChon(orig)} disabled={daCham}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-[15px] transition ${
                      laDapAn ? 'border-ph-green/40 bg-ph-green/10' : chonSai ? 'border-ph-red/40 bg-ph-red/10' : chon ? 'border-brand bg-brand/10' : 'border-black/[0.08] bg-white'}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                      laDapAn ? 'bg-ph-green text-white' : chonSai ? 'bg-ph-red text-white' : chon ? 'bg-brand text-white' : 'bg-black/[0.05] text-ph-label-2'}`}>{chuCaiChon(dispI)}</span>
                    <span className="flex-1 pt-0.5"><MathText>{stripLabel(opt)}</MathText></span>
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
                  <div key={orig} className="rounded-xl border border-black/[0.08] p-3">
                    <div className="mb-2 flex gap-2 text-[15px] text-ph-label">
                      <span className="font-semibold text-ph-label-2">{'abcd'[dispI] ?? dispI + 1})</span>
                      <span className="flex-1"><MathText>{m.noi_dung}</MathText></span>
                    </div>
                    <div className="flex gap-2">
                      {(['D', 'S'] as const).map((v) => {
                        const on = pick === v
                        const dungChoi = daCham && v === key       // đáp án đúng của ý
                        const saiChoi = daCham && on && v !== key   // HS chọn sai
                        return (
                          <button key={v} onClick={() => setDS(orig, v)} disabled={daCham}
                            className={`flex-1 rounded-lg border py-1.5 text-[13px] font-medium transition ${
                              dungChoi ? 'border-ph-green/40 bg-ph-green/10 text-ph-green' : saiChoi ? 'border-ph-red/40 bg-ph-red/10 text-ph-red' : on ? 'border-brand bg-brand/10 text-brand' : 'border-black/[0.08] text-ph-label-2'}`}>
                            {v === 'D' ? 'Đúng' : 'Sai'}
                          </button>
                        )
                      })}
                    </div>
                    {daCham && m.loi_giai && <div className="mt-2 border-t border-black/[0.06] pt-1.5 text-[13px] text-ph-label-2"><MathText>{m.loi_giai}</MathText></div>}
                  </div>
                )
              })}
            </div>
          ) : (
            <input value={(cs?.chon as string) ?? ''} onChange={(e) => setChon(e.target.value)} disabled={daCham}
              placeholder="Nhập đáp án…" inputMode="text"
              className="w-full rounded-xl border border-black/[0.1] px-4 py-3 text-[15px] outline-none focus:border-brand disabled:bg-black/[0.03]" />
          )}

          {daCham && (
            <div className={`mt-4 rounded-xl p-3 ${boxCls}`}>
              <p className={`text-[15px] font-semibold ${txtCls}`}>
                {vd === 'correct' ? '🎉 Đúng hết!' : vd === 'partial' ? '👍 Đúng một phần' : '😔 Chưa đúng'}
                {laDS && <span className="ml-1 text-[13px] font-normal">· {dsDung}/{menhDe.length} ý đúng</span>}
              </p>
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && <p className="mt-1 text-[13px] text-ph-label-2">Đáp án đúng: <b className="text-ph-green">{String(cau.dap_an_key)}</b></p>}
              {cau.loi_giai && (
                <div className="mt-2 border-t border-black/[0.06] pt-2 text-[14px] leading-relaxed text-ph-label">
                  <p className="mb-1 text-[12px] font-semibold uppercase text-ph-label-2">Lời giải</p>
                  <MathText>{cau.loi_giai}</MathText>
                </div>
              )}
              {cau.anh_dap_an && <img src={cau.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg border border-black/[0.08]" />}
              {(cau.loai_cau === 'tra_loi_ngan' || baoSaiDe) && vd !== 'correct' && (
                cs!.baoRoi
                  ? <p className="mt-2 text-[12px] text-ph-label-2">✓ Đã gửi ý kiến cho thầy cô.</p>
                  : <button onClick={guiBaoSai} className="mt-2 rounded-lg border border-black/[0.1] px-3 py-1.5 text-[12px] text-ph-label-2">
                      {baoSaiDe ? '🚩 Báo sai đề / đáp án' : '🚩 Em nghĩ mình đúng'}
                    </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={desktop ? 'mt-5 flex items-center gap-3' : 'flex items-center gap-2 border-t border-black/[0.06] bg-white p-3'}>
        {idx > 0 && (
          <button onClick={() => setIdx((i) => i - 1)}
            className={desktop ? 'rounded-2xl bg-white px-6 py-3.5 text-[15px] font-medium text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)]' : 'rounded-xl bg-black/[0.04] px-4 py-3 text-sm text-ph-label-2'}>
            {desktop ? '‹ Câu trước' : '‹'}
          </button>
        )}
        {!daCham ? (
          <button onClick={xacNhan} disabled={busy || !daDu}
            className={desktop ? 'flex-1 rounded-2xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(115,87,245,.22)] disabled:opacity-40' : 'flex-1 rounded-xl bg-brand py-3 text-sm font-medium text-white disabled:opacity-40'}>
            {busy ? 'Đang chấm…' : 'Xác nhận'}
          </button>
        ) : (
          <button onClick={() => setIdx((i) => i + 1)}
            className={desktop ? 'flex-1 rounded-2xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(115,87,245,.22)]' : 'flex-1 rounded-xl bg-brand py-3 text-sm font-medium text-white'}>
            {idx + 1 < total ? 'Câu tiếp →' : (daXongHet ? 'Xem kết quả →' : 'Câu tiếp →')}
          </button>
        )}
      </div>
    </>
  )

  return desktop ? (
    <div className="min-h-screen bg-[#f4f7fb] px-8 py-6">
      <div className="mx-auto max-w-3xl">{trongTam}</div>
    </div>
  ) : (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-ios">{trongTam}</div>
  )
}

// ── TỰ LUYỆN: bọc NGOÀI LamBai — MỖI LƯỢT = 1 bai_test RIÊNG 10 câu (Thùy 29/08: "mỗi lần luyện
// phải độc lập", KHÔNG cộng dồn 1 bài/ngày). Mở màn: lượt hôm nay đang DỞ → làm tiếp; hết dở →
// sinh lượt mới. "Làm thêm" = sinh lượt mới tinh. Phần LÀM BÀI dùng nguyên LamBai — key={baiTestId}
// đổi theo từng lượt ⇒ REMOUNT, mỗi lượt chấm điểm/kết quả độc lập 10 câu của chính nó.
function LamTuLuyen({ hocSinhId, onXong, desktop }: { hocSinhId: string; onXong: () => void; desktop?: boolean }) {
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

  async function taiHomNay() {
    setState('dang_tai'); setErr(null)
    try {
      const m = await monCuaHS()
      if (!m) { setState('trong'); setErr('Chưa xác định được môn học của em — báo thầy cô nhé.'); return }
      setMon(m)
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
      const kq = await sinhTuLuyen(mon)
      setBaiTestId(kq.baiTestId); setTongNgay((t) => t + kq.them)
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  if (state === 'dang_tai') return <div className={`flex min-h-screen items-center justify-center text-sm text-ph-label-2 ${desktop ? 'bg-[#f4f7fb]' : 'bg-ios'}`}>Đang chuẩn bị bài…</div>
  if (state === 'trong' || !baiTestId || !mon) return (
    <div className={desktop
      ? 'flex min-h-screen flex-col items-center justify-center bg-[#f4f7fb] px-6 text-center'
      : 'mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-ios px-6 text-center'}>
      <p className="text-3xl">🌱</p>
      <p className="mt-3 text-[15px] font-medium text-ph-label">{err ?? 'Chưa có dữ liệu học tập để tự luyện.'}</p>
      <p className="mt-1 text-[13px] text-ph-label-2">Học vài buổi trên lớp rồi quay lại nhé.</p>
      <button onClick={onXong} className={`mt-6 rounded-xl bg-white font-medium text-ph-label-2 shadow-sm ${desktop ? 'px-8 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`}>Về trang chính</button>
    </div>
  )

  return (
    <LamBai
      key={baiTestId}
      baiTestId={baiTestId}
      hocSinhId={hocSinhId}
      onXong={onXong}
      desktop={desktop}
      doneCaption={`Hôm nay em đã luyện ${tongNgay} câu.`}
      doneExtra={
        <div className={`mt-3 w-full ${desktop ? 'max-w-sm' : ''}`}>
          {err && <p className="mb-2 text-[12.5px] text-ph-red">{err}</p>}
          <button onClick={lamThem} disabled={busy}
            className={`w-full rounded-xl bg-brand/10 font-medium text-brand disabled:opacity-40 ${desktop ? 'px-6 py-3.5 text-[15px]' : 'px-6 py-3 text-sm'}`}>
            {busy ? 'Đang tạo lượt mới…' : `Luyện lượt mới ${TU_LUYEN_SO_CAU_MOI_LUOT} câu`}
          </button>
        </div>
      }
    />
  )
}

// ── THÔNG TIN HỌC TẬP (Thùy 21/08: "giống app phụ huynh") — mirror card "Tỉ lệ thành thạo kiến
// thức" + list dạng yếu/cần luyện của app PH (Kết quả tab), dựng từ ĐÚNG masteryOfDang qua
// layDangHocTap() — không có công thức thứ hai nào.
// desktop: TUỲ CHỌN (Thùy 22/08) — chỉ đổi khung ngoài (header/bề rộng/lưới 2 cột), số liệu/logic
// vẫn NGUYÊN layDangHocTap() — cấp 3 (mobile, từ ô "Thông tin học tập" cũ) không truyền → giữ y hệt.
function ThongTinHocTap({ onXong, desktop }: { onXong: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong'>('dang_tai')
  const [data, setData] = useState<{ dangs: DangHocTap[]; dat: number; canLuyen: number; yeu: number } | null>(null)
  const daGoi = useRef(false)

  useEffect(() => {
    if (daGoi.current) return
    daGoi.current = true
    ;(async () => {
      const mon = await monCuaHS()
      if (!mon) { setState('trong'); return }
      const d = await layDangHocTap(mon)
      setData(d)
      setState(d.dat + d.canLuyen + d.yeu === 0 ? 'trong' : 'san_sang')
    })().catch(() => setState('trong'))
  }, [])

  if (state === 'dang_tai') return <div className={`flex min-h-screen items-center justify-center text-sm text-ph-label-2 ${desktop ? 'bg-[#f4f7fb]' : 'bg-ios'}`}>Đang tải…</div>

  const tong = data ? data.dat + data.canLuyen + data.yeu : 0
  const tiLe = data && tong > 0 ? Math.round(((data.dat + data.canLuyen * 0.5) / tong) * 100) : 0
  const canChuY = data ? data.dangs.filter((d) => d.muc !== 'dat').slice(0, 10) : []

  return (
    <div className={desktop ? 'mx-auto min-h-screen max-w-3xl bg-[#f4f7fb] px-8 py-6' : 'mx-auto min-h-screen max-w-md bg-ios px-4 pb-10'}>
      {desktop ? (
        <div className="mb-5 flex items-center gap-4">
          <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[18px] text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)]">‹</button>
          <h1 className="text-[26px] font-black tracking-tight text-[#171a2b]">Thông tin học tập</h1>
        </div>
      ) : <Head title="Thông tin học tập" onBack={onXong} />}

      {state === 'trong' ? (
        <div className={`mt-3 rounded-[21px] bg-white p-8 text-center ${SHADOW}`}>
          <p className="text-3xl">🌱</p>
          <p className="mt-2 text-[15px] font-medium text-ph-label">Chưa có dữ liệu học tập</p>
          <p className="mt-1 text-[13px] text-ph-label-2">Học vài buổi trên lớp hoặc làm Tự luyện rồi quay lại nhé.</p>
        </div>
      ) : (
        <>
          {/* ĐÚNG ".card"+".summary"+".sum" (ph-v3.css) — hero % + 3 ô đạt/cần luyện/yếu */}
          <div className={`mt-3 rounded-[22px] bg-white ${SHADOW} ${desktop ? 'p-7' : 'p-4'}`}>
            <h3 className={`font-bold text-ph-label ${desktop ? 'text-[18px]' : 'text-[15px]'}`}>Tỉ lệ thành thạo kiến thức</h3>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className={`font-extrabold leading-none tracking-tight text-ph-label ${desktop ? 'text-[52px]' : 'text-[38px]'}`}>{tiLe}</span>
              <span className={`font-bold text-ph-label-2 ${desktop ? 'text-[20px]' : 'text-[17px]'}`}>%</span>
            </div>
            <div className={`mt-3.5 grid grid-cols-3 ${desktop ? 'gap-4' : 'gap-2.5'}`}>
              <div className={`rounded-[14px] bg-[#f7f8fb] text-center ${desktop ? 'p-4' : 'p-2.5'}`}>
                <b className={`block font-extrabold text-ph-green ${desktop ? 'text-[22px]' : 'text-[17px]'}`}>{data!.dat}</b>
                <span className="text-[9px] font-bold uppercase tracking-wide text-ph-label-2">Đạt</span>
              </div>
              <div className={`rounded-[14px] bg-[#f7f8fb] text-center ${desktop ? 'p-4' : 'p-2.5'}`}>
                <b className={`block font-extrabold text-ph-orange ${desktop ? 'text-[22px]' : 'text-[17px]'}`}>{data!.canLuyen}</b>
                <span className="text-[9px] font-bold uppercase tracking-wide text-ph-label-2">Cần luyện</span>
              </div>
              <div className={`rounded-[14px] bg-[#f7f8fb] text-center ${desktop ? 'p-4' : 'p-2.5'}`}>
                <b className={`block font-extrabold text-ph-red ${desktop ? 'text-[22px]' : 'text-[17px]'}`}>{data!.yeu}</b>
                <span className="text-[9px] font-bold uppercase tracking-wide text-ph-label-2">Yếu</span>
              </div>
            </div>
          </div>

          <p className="ml-0.5 mb-2 mt-5 text-[12px] font-black uppercase tracking-wide text-[#596376]">Dạng cần chú ý</p>
          {canChuY.length === 0 ? (
            <div className={`rounded-[21px] bg-white p-6 text-center ${SHADOW}`}>
              <p className="text-[15px] font-medium text-ph-label">🎉 Không có dạng nào yếu</p>
              <p className="mt-1 text-[13px] text-ph-label-2">Tất cả dạng đã học đều đạt.</p>
            </div>
          ) : (
            // ĐÚNG ".dangList"+".dangRow" (ph-v3.css) — nền xám phẳng #F7F8FB, KHÔNG card viền.
            // Desktop: 2 cột (bề rộng thừa, 1 cột dài lê thê nhìn rất mobile).
            <div className={desktop ? 'grid grid-cols-2 gap-3' : 'grid gap-2.5'}>
              {canChuY.map((d) => (
                <div key={d.ma_dang} className="rounded-[13px] bg-[#f7f8fb] p-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${d.muc === 'yeu' ? 'bg-ph-red' : 'bg-ph-orange'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold text-[#3b4250]">{d.ten_dang}</p>
                      {d.ten_chuyen_de && <p className="truncate text-[10.5px] text-ph-label-2">{d.ten_chuyen_de}</p>}
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
                      d.muc === 'yeu' ? 'bg-ph-red/10 text-ph-red' : 'bg-ph-orange/10 text-ph-orange'}`}>
                      {d.muc === 'yeu' ? 'Yếu' : 'Cần luyện'}
                    </span>
                  </div>
                  {/* Thùy 21/08: "đánh giá từng câu giống Kết quả học tập ERP — 5 lần gần nhất" */}
                  <div className="mt-2.5 flex gap-1 border-t border-black/[0.06] pt-2.5">
                    {d.recent.length === 0 && <span className="text-[10.5px] text-ph-label-2">Chưa có lần đo nào</span>}
                    {d.recent.map((e, i) => <LanDo key={i} e={e} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// 1 lần đo trong "5 lần gần nhất" — ĐÚNG pattern Slot của KetQuaScreen.tsx (staff, mastery.ts):
// ✓ đạt (value≥1) · ◐ nửa (value>0) · ✗ sai (value=0). Màu theo GIÁ TRỊ lần đó, không phải mức dạng.
function LanDo({ e }: { e: RecentEval }) {
  const icon = e.value >= 1 ? '✓' : e.value > 0 ? '◐' : '✗'
  const cls = e.value >= 1 ? 'bg-ph-green/15 text-ph-green' : e.value > 0 ? 'bg-ph-orange/15 text-ph-orange' : 'bg-ph-red/15 text-ph-red'
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5" title={`${SRC_LABEL[e.src]} · ${fmtShort(e.t)}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${cls}`}>{icon}</span>
      <span className="text-[8px] font-bold leading-none text-ph-label-2">{SRC_LABEL[e.src]}</span>
      <span className="text-[7.5px] font-medium leading-none text-ph-label-2/70">{fmtShort(e.t)}</span>
    </div>
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
      const k = await khoiCuaHS()
      setKhoi(k)
      if (!k) { setRows([]); return }
      setRows(await xepHangTuLuyen(k))
    })().catch(() => setRows([]))
  }, [])

  if (rows === null) return <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-sm text-ph-label-2">Đang tải…</div>

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-[#f4f7fb] px-8 py-6">
      <div className="mb-5 flex items-center gap-4">
        <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[18px] text-[#576073] shadow-[0_6px_16px_rgba(31,47,79,0.06)]">‹</button>
        <div className="min-w-0">
          <h1 className="text-[26px] font-black tracking-tight text-[#171a2b]">Bảng xếp hạng</h1>
          {khoi && <p className="mt-0.5 text-[13px] text-[#7b8499]">Số câu làm ĐÚNG tự luyện · các bạn khối {khoi}</p>}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={`mt-3 rounded-[21px] bg-white p-8 text-center ${SHADOW}`}>
          <p className="text-3xl">🏆</p>
          <p className="mt-2 text-[15px] font-medium text-ph-label">Chưa có ai làm Tự luyện</p>
          <p className="mt-1 text-[13px] text-ph-label-2">Làm bài đầu tiên để dẫn đầu bảng xếp hạng!</p>
        </div>
      ) : (
        // ĐÚNG ".classTable"+".row"+".rank"+".score" (ph-v3.css) — bảng xếp hạng cả lớp có sẵn
        <div className={`overflow-hidden rounded-[24px] bg-white ${SHADOW}`}>
          {rows.map((r, i) => (
            <div key={r.ma_hs} className={`grid grid-cols-[42px_1fr_64px] items-center gap-3.5 px-5 py-4 text-[14px] ${i > 0 ? 'border-t border-black/[0.06]' : ''} ${r.la_toi ? 'bg-brand/10' : ''}`}>
              <span className={`flex h-9 w-9 items-center justify-center rounded-[11px] text-[14px] font-black ${
                r.la_toi ? 'bg-brand text-white' : i === 0 ? 'bg-ph-orange text-white' : i === 1 ? 'bg-ph-label-2 text-white' : i === 2 ? 'bg-[#c77e4a] text-white' : 'bg-[#f0f2f6] text-ph-label'}`}>{i + 1}</span>
              <p className={`min-w-0 truncate font-bold ${r.la_toi ? 'text-brand' : 'text-ph-label'}`}>{r.ho_ten}{r.la_toi ? ' (Bạn)' : ''}</p>
              <span className={`rounded-full px-2.5 py-1.5 text-center text-[13px] font-black ${r.la_toi ? 'bg-brand text-white' : 'bg-ph-green/10 text-ph-green'}`}>{r.so_cau_dung}</span>
            </div>
          ))}
        </div>
      )}
    </div>
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

  useEffect(() => {
    (async () => {
      // moBaiLam TRƯỚC getETDe: bien_the (mã đề gán riêng HS) chốt lúc mở slot, et_de đọc đúng
      // bien_the đó để trả đề. Đảo thứ tự là et_de luôn mặc định mã 1 (bai_lam chưa kịp tồn tại).
      const bl = await moBaiLam(test.id, hocSinhId)
      const d = await getETDe(test.id)
      setDe(d); setBaiLamId(bl.id)
      setAns(await getETDapAnDaLuu(bl.id) as Record<string, Chon>)
      if (bl.trang_thai === 'da_nop') { const rev = await nopET(bl.id); setReveal(Object.fromEntries(rev.map((r) => [r.bai_test_cau_id, r]))) }
    })().catch(console.error)
  }, [test.id, hocSinhId])
  useEffect(() => { setGoiY(false) }, [idx])
  // Xáo THỨ TỰ CÂU theo (HS×bài) — cùng cơ chế LamBai (xem ghi chú ở đó): chỉ xáo trong cùng 1 dạng.
  // Test có ĐỦ 3 MÃ ĐỀ (test.co_nhieu_ma_de) → GIỮ NGUYÊN thứ tự thu_tu, KHÔNG xáo nữa (Thùy 18/08:
  // "có nhiều mã đề thì không cần đảo thứ tự câu nữa" — mã đề đã khác nội dung, tự phân biệt HS rồi,
  // xáo thêm thứ tự là thừa). et_de đã `order by bc.thu_tu` sẵn nên dùng thẳng `de`.
  const caus = useMemo(() => {
    if (!de) return []
    return test.co_nhieu_ma_de ? de : seededPermByDang(de, `${hocSinhId}:${test.id}:q`).map((i) => de[i])
  }, [de, hocSinhId, test.id, test.co_nhieu_ma_de])

  if (!de) return <div className="flex min-h-screen items-center justify-center bg-ios text-sm text-ph-label-2">Đang tải đề…</div>
  const total = caus.length
  const daNop = !!reveal
  const daTraLoi = caus.filter((c) => ans[c.id] != null && ans[c.id] !== '' && !(Array.isArray(ans[c.id]) && (ans[c.id] as unknown[]).some((x) => x == null))).length

  async function luu(cauId: string, v: Chon) {
    if (daNop || !baiLamId) return
    setAns((s) => ({ ...s, [cauId]: v }))
    try { await luuDapAnET(baiLamId, cauId, v) } catch (e) { console.error(e) }
  }
  async function doNop() {
    if (!baiLamId) return
    setBusy(true)
    try { const rev = await nopET(baiLamId); setReveal(Object.fromEntries(rev.map((r) => [r.bai_test_cau_id, r]))); setIdx(0); setConfNop(false) }
    finally { setBusy(false) }
  }

  const cau = caus[idx]
  const rv = daNop && cau ? reveal![cau.id] : undefined
  const laTN = cau?.loai_cau === 'trac_nghiem'
  const laDS = cau?.loai_cau === 'dung_sai'
  const keyDS = (rv?.dap_an_key as string[] | undefined) ?? []
  const menhDeReveal = (rv?.menh_de as { loi_giai?: string | null }[] | undefined) ?? []
  const chonArr = laDS ? ((ans[cau.id] as (string | null)[]) ?? (cau.menh_de ?? []).map(() => null)) : []
  const vd = rv?.verdict ?? ''
  // Xáo THỨ TỰ ĐÁP ÁN hiển thị (cùng cơ chế LamBai) — orig ghi state/so đúng, dispI chỉ để đặt nhãn.
  const optsShown = laTN && cau ? seededShuffleWithOrig(cau.lua_chon ?? [], `${hocSinhId}:${test.id}:${cau.id}:opt`) : []
  const correctOrigTN = laTN && daNop ? chiSoCuaChu(rv?.dap_an_key) : -1
  const menhOrder = laDS && cau ? seededShuffleWithOrig(cau.menh_de ?? [], `${hocSinhId}:${test.id}:${cau.id}:ds`) : []

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-ios">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onXong} className="text-ph-label-2">✕</button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ph-purple/15">
          <div className="h-full bg-ph-purple transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="text-[12px] text-ph-label-2">{idx + 1}/{total}</span>
      </div>
      {!daNop && <p className="px-4 pb-1 text-center text-[12px] text-ph-purple">📝 Bài THI · nộp xong mới hiện đáp án · đã trả lời {daTraLoi}/{total}</p>}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ph-label-2">Câu {idx + 1}</p>
            {cau.ly_thuyet && <button onClick={() => setGoiY((v) => !v)} className={`rounded-full border px-3 py-1 text-[12px] font-medium ${goiY ? 'border-ph-orange/40 bg-ph-orange/15 text-ph-orange' : 'border-ph-orange/25 bg-ph-orange/10 text-ph-orange'}`}>💡 Gợi ý</button>}
          </div>
          {goiY && cau.ly_thuyet && <div className="mb-3 rounded-xl border border-ph-orange/25 bg-ph-orange/[0.06] p-3 text-[14px] leading-relaxed text-ph-label"><MathText>{cau.ly_thuyet}</MathText></div>}
          {cau.noi_dung && <div className="mb-3 text-[15px] leading-relaxed text-ph-label"><MathText>{cau.noi_dung}</MathText></div>}
          {cau.anh_de && <img src={cau.anh_de} alt="đề" className="mb-3 max-h-80 rounded-lg border border-black/[0.08]" />}

          {laTN ? (
            <div className="flex flex-col gap-2.5">
              {optsShown.map(({ item: opt, orig }, dispI) => {
                const chon = ans[cau.id] === orig
                const laDapAn = daNop && orig === correctOrigTN
                const chonSai = daNop && chon && !laDapAn
                return (
                  <button key={orig} onClick={() => luu(cau.id, orig)} disabled={daNop}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-[15px] ${laDapAn ? 'border-ph-green/40 bg-ph-green/10' : chonSai ? 'border-ph-red/40 bg-ph-red/10' : chon ? 'border-ph-purple bg-ph-purple/[0.06]' : 'border-black/[0.08]'}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${laDapAn ? 'bg-ph-green text-white' : chonSai ? 'bg-ph-red text-white' : chon ? 'bg-ph-purple text-white' : 'bg-black/[0.05] text-ph-label-2'}`}>{chuCaiChon(dispI)}</span>
                    <span className="flex-1 pt-0.5"><MathText>{stripLabel(opt)}</MathText></span>
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
                  <div key={orig} className="rounded-xl border border-black/[0.08] p-3">
                    <div className="mb-2 flex gap-2 text-[15px] text-ph-label"><span className="font-semibold text-ph-label-2">{'abcd'[dispI] ?? dispI + 1})</span><span className="flex-1"><MathText>{m.noi_dung}</MathText></span></div>
                    <div className="flex gap-2">
                      {(['D', 'S'] as const).map((v) => {
                        const on = pick === v
                        const dung = daNop && v === key
                        const sai = daNop && on && v !== key
                        return <button key={v} onClick={() => { const cur = (ans[cau.id] as (string | null)[]) ?? (cau.menh_de ?? []).map(() => null); const next = [...cur]; next[orig] = v; luu(cau.id, next) }} disabled={daNop}
                          className={`flex-1 rounded-lg border py-1.5 text-[13px] font-medium ${dung ? 'border-ph-green/40 bg-ph-green/10 text-ph-green' : sai ? 'border-ph-red/40 bg-ph-red/10 text-ph-red' : on ? 'border-ph-purple bg-ph-purple/[0.06] text-ph-purple' : 'border-black/[0.08] text-ph-label-2'}`}>{v === 'D' ? 'Đúng' : 'Sai'}</button>
                      })}
                    </div>
                    {daNop && menhDeReveal[orig]?.loi_giai && <div className="mt-2 border-t border-black/[0.06] pt-1.5 text-[13px] text-ph-label-2"><MathText>{menhDeReveal[orig].loi_giai as string}</MathText></div>}
                  </div>
                )
              })}
            </div>
          ) : (
            <input value={(ans[cau.id] as string) ?? ''} onChange={(e) => setAns((s) => ({ ...s, [cau.id]: e.target.value }))} onBlur={(e) => luu(cau.id, e.target.value)} disabled={daNop}
              placeholder="Nhập đáp án…" className="w-full rounded-xl border border-black/[0.1] px-4 py-3 text-[15px] outline-none focus:border-ph-purple disabled:bg-black/[0.03]" />
          )}

          {daNop && (
            <div className={`mt-4 rounded-xl p-3 ${vd === 'correct' ? 'bg-ph-green/10' : vd === 'partial' ? 'bg-ph-orange/10' : 'bg-ph-red/10'}`}>
              <p className={`text-[15px] font-semibold ${vd === 'correct' ? 'text-ph-green' : vd === 'partial' ? 'text-ph-orange' : 'text-ph-red'}`}>{vd === 'correct' ? '🎉 Đúng' : vd === 'partial' ? '👍 Đúng một phần' : '😔 Chưa đúng'}</p>
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && <p className="mt-1 text-[13px] text-ph-label-2">Đáp án đúng: <b className="text-ph-green">{String(rv?.dap_an_key)}</b></p>}
              {rv?.loi_giai && <div className="mt-2 border-t border-black/[0.06] pt-2 text-[14px] leading-relaxed text-ph-label"><p className="mb-1 text-[12px] font-semibold uppercase text-ph-label-2">Lời giải</p><MathText>{rv.loi_giai}</MathText></div>}
              {rv?.anh_dap_an && <img src={rv.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg border border-black/[0.08]" />}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-black/[0.06] bg-white p-3">
        {idx > 0 && <button onClick={() => setIdx((i) => i - 1)} className="rounded-xl bg-black/[0.04] px-4 py-3 text-sm text-ph-label-2">‹</button>}
        {idx + 1 < total
          ? <button onClick={() => setIdx((i) => i + 1)} className="flex-1 rounded-xl bg-ph-purple py-3 text-sm font-medium text-white">Câu tiếp →</button>
          : daNop
            ? <button onClick={onXong} className="flex-1 rounded-xl bg-ph-purple py-3 text-sm font-medium text-white">Xong</button>
            : <button onClick={() => setConfNop(true)} className="flex-1 rounded-xl bg-ph-green py-3 text-sm font-medium text-white">Nộp bài</button>}
      </div>

      {confNop && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6" onClick={() => setConfNop(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-semibold text-ph-label">Nộp bài thi?</p>
            <p className="mt-1 text-[13px] text-ph-label-2">Đã trả lời {daTraLoi}/{total} câu. Nộp xong sẽ chấm và <b>không sửa được</b> nữa.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfNop(false)} className="flex-1 rounded-xl bg-black/[0.04] py-3 text-sm text-ph-label-2">Để xem lại</button>
              <button onClick={doNop} disabled={busy} className="flex-1 rounded-xl bg-ph-green py-3 text-sm font-medium text-white disabled:opacity-40">{busy ? 'Đang nộp…' : 'Nộp bài'}</button>
            </div>
          </div>
        </div>
      )}
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
