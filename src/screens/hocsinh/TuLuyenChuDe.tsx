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
import { rankBat } from './phieuluu/coBat'
import { useEffect, useState } from 'react'
import { layDangChuDe, monCuaHS, type DangChuDe } from '../../lib/tuluyen'
import { ManHS, MAU, THE, THE_TRON, HEAD, NhanHS, useMonHS } from './skin/KhungHS'

// Thùy 29/09: mọi màn theo STYLE (skin) em đang chọn — khung/màu lấy từ skin/KhungHS, bỏ nền mây + chồng sách + khẩu hiệu
// + màu theo giới tính. THEME giữ đúng hình dạng cũ để các màn còn import (Album/NhiemVu/Rank) vẫn chạy, nhưng mọi giá trị
// giờ là biến skin — màn MỚI dùng thẳng KhungHS (ManHS/DauTrangHS/TheHS/NutHS), đừng dùng THEME.
const NAVY = MAU.ink
const T_SKIN = {
  bg: '', decor: '', primary: MAU.acc, sec: MAU.muted,
  cardTint: MAU.surface, shadow: 'var(--sk-card-shadow)', quote: '', quoteColor: MAU.acc,
}
export const THEME = { nam: T_SKIN, nu: T_SKIN }

export function Khung({ children, nenAnh }: { gioiTinh?: 'nam' | 'nu' | null; children: React.ReactNode; nenAnh?: 'bxh' | 'nhiem_vu' | 'thanh_tuu' }) {
  return <ManHS className="!gap-0" nenAnh={nenAnh}>{children}</ManHS>
}
// Nút quay lại + nhãn MÔN đang chọn (01/10: mọi màn tự luyện thuộc góc học tập của 1 môn — em biết đang ở môn nào).
export function NutBack({ onBack }: { onBack: () => void }) {
  const mon = useMonHS()
  return (
    <div className="mb-3 flex items-center gap-2">
      <button onClick={onBack} className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[14.5px] font-semibold active:scale-95" style={THE_TRON}>
        <span aria-hidden>‹</span> Quay lại
      </button>
      <span className="flex-1" />
      {mon && <NhanHS dac>{mon}</NhanHS>}
    </div>
  )
}

export function ChonLoaiTuLuyen({ onTongHop, onChuDe, onThuThach, onRank, onNhiemVu, onBack, gioiTinh }: { onTongHop: () => void; onChuDe: () => void; onThuThach?: () => void; onRank?: () => void; onNhiemVu?: () => void; onBack: () => void; gioiTinh: 'nam' | 'nu' | null }) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>Tự luyện</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: t.sec }}>Chọn cách em muốn luyện hôm nay.</p>
      <div className="mt-5 flex flex-col gap-3">
        <button onClick={onTongHop} className="p-4 text-left transition active:scale-[0.98]" style={THE}>
          <span className="block text-[16.5px] font-extrabold" style={{ color: NAVY }}>🎯 Tổng hợp</span>
          <span className="mt-1 block text-[14px]" style={{ color: t.sec }}>Hệ tự chọn câu — ưu tiên dạng em đang yếu, xen ngẫu nhiên dạng đã học.</span>
        </button>
        <button onClick={onChuDe} className="p-4 text-left transition active:scale-[0.98]" style={THE}>
          <span className="block text-[16.5px] font-extrabold" style={{ color: NAVY }}>📚 Theo chủ đề</span>
          <span className="mt-1 block text-[14px]" style={{ color: t.sec }}>Em tự chọn 1 dạng cụ thể để luyện riêng, xem mình đang yếu dạng nào nhất.</span>
        </button>
        {onThuThach && (
          <button onClick={onThuThach} className="p-4 text-left transition active:scale-[0.98]" style={THE}>
            <span className="block text-[16.5px] font-extrabold" style={{ color: NAVY }}>⚔️ Thử thách</span>
            <span className="mt-1 block text-[14px]" style={{ color: t.sec }}>{rankBat() ? 'Như Tổng hợp, nhưng đúng từ 80% trở lên là được cộng Điểm Rank để leo bậc.' : 'Như Tổng hợp, nhưng đúng từ 80% trở lên là vượt Thử thách.'}</span>
          </button>
        )}
        {(onRank || onNhiemVu) && (
          <div className="mt-1 flex justify-center gap-5">
            {onNhiemVu && <button onClick={onNhiemVu} className="text-[14.5px] font-bold underline-offset-2 hover:underline" style={{ color: t.primary }}>📜 Nhiệm vụ</button>}
            {onRank && <button onClick={onRank} className="text-[14.5px] font-bold underline-offset-2 hover:underline" style={{ color: t.primary }}>🏆 Rank của em</button>}
          </div>
        )}
      </div>
    </Khung>
  )
}

// Màu pill % theo MỨC mastery (khớp bảng muc dùng chung toàn hệ: dat/can_luyen/yeu) —
// null (chưa đánh giá được) dùng màu trung tính, không phải đỏ (đó là KHÔNG RÕ, không phải yếu).
const MUC_MAU: Record<'dat' | 'can_luyen' | 'yeu', { bg: string; chu: string }> = {
  dat: { bg: 'rgba(34,160,107,0.16)', chu: MAU.dung },
  can_luyen: { bg: 'rgba(224,144,30,0.16)', chu: MAU.canhBao },
  yeu: { bg: 'rgba(229,72,77,0.16)', chu: MAU.sai },
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
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: NAVY }}>Chọn dạng để luyện</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: t.sec }}>% là mức em đang làm dạng đó — dạng yếu nhất lên đầu để luyện trước.</p>

      {/* Toggle "Chỉ câu mới" */}
      <button onClick={() => setChiCauMoi((v) => !v)}
        className="mt-3.5 flex w-full items-center gap-3 p-3 text-left transition"
        style={{ ...THE, background: chiCauMoi ? MAU.surface2 : MAU.surface }}>
        <span className="relative h-6 w-11 shrink-0 rounded-full transition" style={{ background: chiCauMoi ? t.primary : MAU.line }}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${chiCauMoi ? 'left-[22px]' : 'left-0.5'}`} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-bold" style={{ color: NAVY }}>Chỉ câu mới</span>
          <span className="mt-0.5 block text-[12px]" style={{ color: t.sec }}>Không lặp câu em đã luyện trong 2 kỳ gần nhất (~1 tháng)</span>
        </span>
      </button>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'san_sang' && dangs.length === 0 && (
        <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: t.sec }}>Chưa có dạng nào trong kho cho khối của em.</p>
      )}

      {state === 'san_sang' && dangs.length > 0 && (
        <div className="mt-4 flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3">
          {dangs.map((d) => {
            const mau = d.muc ? MUC_MAU[d.muc] : { bg: MAU.surface2, chu: MAU.muted }
            return (
              <button key={d.ma_dang} onClick={() => onPick({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, chiCauMoi })}
                className="flex items-center gap-3 p-3.5 text-left transition active:scale-[0.98]" style={THE}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15.5px] font-bold" style={{ color: NAVY }}>{d.ten_dang}</span>
                  <span className="mt-0.5 block truncate text-[12px]" style={{ color: t.sec }}>{d.ten_chuyen_de}</span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: t.sec }}>Đã luyện {d.da_luyen}/{d.tong_cau} câu trong kho</span>
                </span>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-[13px] font-extrabold" style={{ background: mau.bg, color: mau.chu }}>
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
