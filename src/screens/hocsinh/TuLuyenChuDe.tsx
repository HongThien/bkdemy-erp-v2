// ============================================================================
// TuLuyenChuDe — 2 màn cho luồng "Tự luyện theo chủ đề" (Thùy 19/09, sửa 20/09):
// (1) ChonLoaiTuLuyen — màn chọn "Tổng hợp" (hệ tự rải, y hệt Tự luyện cũ) hay
//     "Theo chủ đề" (chọn đúng 1 dạng).
// (2) ChonDangChuDe — danh sách dạng (khối hiện tại) + % = MASTERY thật (không
//     phải coverage kho) → bấm 1 dạng để luyện 10 câu CHỈ của dạng đó. Danh sách
//     đã sắp YẾU→MẠNH từ RPC, KHÔNG group theo chuyên đề nữa (thứ tự ưu tiên
//     luyện quan trọng hơn nhóm theo chuyên đề — tên chuyên đề vẫn hiện làm caption
//     nhỏ trên từng thẻ). Có toggle "Chỉ câu mới" — xem lib/tuluyen.ts.
// Thùy 22/09: thêm BACKDROP (kit chung Home/Bài tập trên lớp) — chỉ màn LÀM BÀI mới
// không cần, đây là màn chọn/điều hướng nên vẫn cần. Bỏ cờ `desktop` (không còn khác
// nội dung theo cấp, chỉ còn bề rộng do md:/lg: lo).
// ============================================================================
import { useEffect, useState } from 'react'
import { layDangChuDe, monCuaHS, type DangChuDe } from '../../lib/tuluyen'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: {
    bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Cố gắng hôm nay\nđể tốt hơn ngày mai!', quoteColor: '#4A5BC4',
  },
  nu: {
    bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Cố lên\nbạn nhé!', quoteColor: '#E84A8F',
  },
}

function Khung({ gioiTinh, children }: { gioiTinh: 'nam' | 'nu' | null; children: React.ReactNode }) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] md:max-w-[820px] lg:max-w-[1180px]" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover md:max-w-[820px] lg:max-w-[1180px]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end md:max-w-[820px] lg:max-w-[1180px]">
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>
      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        {children}
      </div>
    </div>
  )
}
function NutBack({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="mb-3 flex items-center gap-1 text-[13px] font-medium" style={{ color: NAVY, opacity: .55 }}>
      <span aria-hidden>←</span> Quay lại
    </button>
  )
}

export function ChonLoaiTuLuyen({ onTongHop, onChuDe, onBack, gioiTinh }: { onTongHop: () => void; onChuDe: () => void; onBack: () => void; gioiTinh: 'nam' | 'nu' | null }) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Tự luyện</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>Chọn cách em muốn luyện hôm nay.</p>
      <div className="mt-5 flex flex-col gap-3">
        <button onClick={onTongHop} className="rounded-[26px] p-4 text-left transition active:scale-[0.98]" style={{ background: t.cardTint, boxShadow: t.shadow }}>
          <span className="block text-[15px] font-extrabold" style={{ color: NAVY }}>🎯 Tổng hợp</span>
          <span className="mt-1 block text-[12.5px]" style={{ color: t.sec }}>Hệ tự chọn câu — ưu tiên dạng em đang yếu, xen ngẫu nhiên dạng đã học.</span>
        </button>
        <button onClick={onChuDe} className="rounded-[26px] p-4 text-left transition active:scale-[0.98]" style={{ background: t.cardTint, boxShadow: t.shadow }}>
          <span className="block text-[15px] font-extrabold" style={{ color: NAVY }}>📚 Theo chủ đề</span>
          <span className="mt-1 block text-[12.5px]" style={{ color: t.sec }}>Em tự chọn 1 dạng cụ thể để luyện riêng, xem mình đang yếu dạng nào nhất.</span>
        </button>
      </div>
    </Khung>
  )
}

// Màu pill % theo MỨC mastery (khớp bảng muc dùng chung toàn hệ: dat/can_luyen/yeu) —
// null (chưa đánh giá được) dùng màu trung tính, không phải đỏ (đó là KHÔNG RÕ, không phải yếu).
const MUC_MAU: Record<'dat' | 'can_luyen' | 'yeu', { bg: string; chu: string }> = {
  dat: { bg: '#DFF6EA', chu: '#1A9A5C' },
  can_luyen: { bg: '#FFF3D6', chu: '#B4791C' },
  yeu: { bg: '#FDE3E3', chu: '#C23B3B' },
}

export function ChonDangChuDe({ onPick, onBack, gioiTinh }: { onPick: (d: { ma_dang: string; ten_dang: string; chiCauMoi: boolean }) => void; onBack: () => void; gioiTinh: 'nam' | 'nu' | null }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [dangs, setDangs] = useState<DangChuDe[]>([])
  const [err, setErr] = useState<string | null>(null)
  // Toggle "Chỉ câu mới" (Thùy 20/09) — sinh câu KHÔNG lặp trong 2 cửa sổ gần nhất (~1 tháng).
  const [chiCauMoi, setChiCauMoi] = useState(false)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    monCuaHS().then((m) => {
      if (!m) throw new Error('Chưa xác định được môn học của em — báo thầy cô nhé.')
      return layDangChuDe(m)
    }).then((ds) => { setDangs(ds); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Chọn dạng để luyện</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>% là mức em đang làm dạng đó — dạng yếu nhất lên đầu để luyện trước.</p>

      {/* Toggle "Chỉ câu mới" */}
      <button onClick={() => setChiCauMoi((v) => !v)}
        className="mt-3.5 flex w-full items-center gap-3 rounded-[22px] p-3 text-left transition"
        style={{ background: chiCauMoi ? t.cardTint : '#ffffffcc', boxShadow: t.shadow }}>
        <span className="relative h-6 w-11 shrink-0 rounded-full transition" style={{ background: chiCauMoi ? t.primary : '#d7dbe6' }}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${chiCauMoi ? 'left-[22px]' : 'left-0.5'}`} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold" style={{ color: NAVY }}>Chỉ câu mới</span>
          <span className="mt-0.5 block text-[11px]" style={{ color: t.sec }}>Không lặp câu em đã luyện trong 2 kỳ gần nhất (~1 tháng)</span>
        </span>
      </button>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && dangs.length === 0 && (
        <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Chưa có dạng nào trong kho cho khối của em.</p>
      )}

      {state === 'san_sang' && dangs.length > 0 && (
        <div className="mt-4 flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3">
          {dangs.map((d) => {
            const mau = d.muc ? MUC_MAU[d.muc] : { bg: '#F1F3F8', chu: '#8792B5' }
            return (
              <button key={d.ma_dang} onClick={() => onPick({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, chiCauMoi })}
                className="flex items-center gap-3 rounded-[22px] p-3.5 text-left transition active:scale-[0.98]" style={{ background: t.cardTint, boxShadow: t.shadow }}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-bold" style={{ color: NAVY }}>{d.ten_dang}</span>
                  <span className="mt-0.5 block truncate text-[11px]" style={{ color: t.sec }}>{d.ten_chuyen_de}</span>
                  <span className="mt-0.5 block text-[11.5px]" style={{ color: t.sec }}>Đã luyện {d.da_luyen}/{d.tong_cau} câu trong kho</span>
                </span>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-extrabold" style={{ background: mau.bg, color: mau.chu }}>
                  {d.pct == null ? 'Chưa đánh giá' : `${d.pct}%`}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </Khung>
  )
}
