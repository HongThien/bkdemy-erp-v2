// ============================================================================
// DanhSachHS — màn DANH SÁCH BÀI của 1 khu (Bài tập trên lớp / ET / BTVN — cùng 1 component, chỉ khác
// tiêu đề + minh hoạ + dữ liệu; CEO 08/09: "chuẩn đấy"). Dựng theo KIT `design/handoff/hs-bai-tap-tren-lop-v1`
// (bố cục: icon minh hoạ + tên/buổi + pill trạng thái + chevron + CTA). Minh hoạ ill_*.png dùng CHUNG kit Home.
// Các pill đang làm / quá hạn / hoàn thành + dòng hạn nộp theo màu NGỮ NGHĨA.
// Thùy 29/09: mọi màn theo STYLE (skin) em đang chọn — khung/màu lấy từ skin/KhungHS, bỏ nền mây + chồng sách +
// khẩu hiệu viết tay + màu theo giới tính (`gioiTinh` còn trong chữ ký cho người gọi, không đổi màu nữa).
// ============================================================================
import type { ReactNode } from 'react'
import { ManHS, DauTrangHS, MAU, THE, THE_TRON, HEAD } from './skin/KhungHS'

const A = '/bk-ui/hs'

export type DsTrangThai = 'moi' | 'dang_lam' | 'qua_han' | 'qua_han_mo' | 'xong'
export type DsRow = {
  id: string
  ten: string           // "Bài tập Toán · 11A1"
  sub: string           // "Buổi 19/08/2026 · 87 câu"
  laThi?: boolean       // badge THI (ET / đề thi / retest — nộp 1 lần)
  trangThai: DsTrangThai
  han?: { text: string; muc: 'qua_han' | 'sat' | 'gan' | 'con_nhieu' } | null // dòng "⏳ Hạn … · còn 2 ngày"
  khoa: boolean         // quá hạn chưa nộp → không mở được (BTVN Thùy 13/09: không khoá, chỉ đánh dấu muộn)
  nopMuon?: boolean     // đã nộp SAU deadline → badge phụ "⏰ Muộn"
  onClick: () => void
}

// Nền nhạt NGỮ NGHĨA — trong suốt ⇒ đọc được cả skin sáng lẫn skin tối.
const NEN = { dung: 'rgba(34,160,107,0.16)', sai: 'rgba(229,72,77,0.16)', canhBao: 'rgba(224,144,30,0.16)' }

// Màu pill trạng thái — mới = màu nhấn của skin; còn lại theo ngữ nghĩa.
const PILL: Record<DsTrangThai, { bg: string; c: string; nhan: string }> = {
  moi:        { bg: MAU.surface2, c: MAU.acc, nhan: 'mới' },
  dang_lam:   { bg: NEN.canhBao, c: MAU.canhBao, nhan: 'đang làm' },
  qua_han:    { bg: NEN.sai, c: MAU.sai, nhan: 'quá hạn' },
  qua_han_mo: { bg: NEN.canhBao, c: MAU.canhBao, nhan: 'muộn · vẫn nộp được' },  // Thùy 13/09: BTVN không khoá, đánh dấu muộn khi nộp
  xong:       { bg: NEN.dung, c: MAU.dung, nhan: '✓ hoàn thành' },
}
const HAN_MAU = { qua_han: MAU.sai, sat: MAU.canhBao, gan: MAU.canhBao, con_nhieu: MAU.muted }

function Chevron({ color, className }: { color: string; className?: string }) {
  return <svg viewBox="0 0 48 48" className={className ?? 'h-5 w-5'} fill="none" aria-hidden><path d="M19 10l14 14-14 14" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function DanhSachHS({ tieuDe, ill, tab, nChua, nXong, rows, dangTai, onBack, onTab, empty }: {
  tieuDe: string; ill: string; gioiTinh: 'nam' | 'nu' | null
  tab: 'chua' | 'xong'; nChua: number; nXong: number; rows: DsRow[]; dangTai: boolean
  onBack: () => void; onTab: (t: 'chua' | 'xong') => void; empty: ReactNode
}) {
  return (
    <ManHS>
      <DauTrangHS tieuDe={tieuDe} onBack={onBack} theoMon />

      {/* TABS — thanh pill, tab đang chọn tô màu nhấn */}
      <div className="mt-1 grid grid-cols-2 p-1" style={{ ...THE_TRON, borderRadius: '999px' }}>
        {([['chua', 'Chưa làm', nChua], ['xong', 'Hoàn thành', nXong]] as const).map(([k, label, n]) => (
          <button key={k} onClick={() => onTab(k)}
            className="rounded-full py-2.5 text-[15.5px] font-bold transition"
            style={tab === k ? { background: MAU.acc, color: MAU.accInk } : { color: MAU.muted }}>
            {label} {n > 0 && <span className="font-medium" style={{ opacity: .85 }}>({n})</span>}
          </button>
        ))}
      </div>

      {dangTai && <p className="py-10 text-center text-[15.5px]" style={{ color: MAU.muted }}>Đang tải…</p>}
      {!dangTai && rows.length === 0 && <div className="mt-1">{empty}</div>}

      {/* CARD bài — icon minh hoạ + tên/buổi + pill trạng thái + chevron + CTA */}
      <div className="mt-1 flex flex-col gap-3 lg:grid lg:grid-cols-2">
        {rows.map((r) => {
          const pill = PILL[r.trangThai]
          const cta = r.khoa ? 'Đã đóng — không nộp được nữa' : r.trangThai === 'xong' ? 'Xem lại' : r.trangThai === 'dang_lam' ? 'Tiếp tục' : 'Bắt đầu'
          return (
            <button key={r.id} disabled={r.khoa} onClick={r.onClick}
              className={`relative p-4 text-left transition ${r.khoa ? 'opacity-70 saturate-50' : 'active:scale-[0.98]'}`}
              style={THE}>
              <div className="flex items-start gap-3">
                <span className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px]" style={{ background: MAU.surface2 }}>
                  <img src={`${A}/ill_${ill}.png`} alt="" className="h-[52px] w-[52px] object-contain" />
                </span>
                <span className="min-w-0 flex-1 pr-12 pt-1">
                  <span className="block truncate text-[18.5px] font-extrabold leading-tight" style={{ ...HEAD, color: MAU.ink }}>
                    {r.laThi && <span className="mr-1.5 rounded-md px-1.5 py-0.5 align-middle text-[11.5px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>THI</span>}
                    {r.nopMuon && <span className="mr-1.5 rounded-md px-1.5 py-0.5 align-middle text-[11.5px] font-bold" style={{ background: NEN.canhBao, color: MAU.canhBao }}>⏰ Muộn</span>}
                    {r.ten}
                  </span>
                  <span className="mt-1 block text-[14.5px]" style={{ color: MAU.muted }}>{r.sub}</span>
                  {r.han && r.trangThai !== 'xong' && (
                    <span className="mt-1 block text-[14px] font-semibold" style={{ color: HAN_MAU[r.han.muc] }}>⏳ {r.han.text}</span>
                  )}
                </span>
              </div>
              <span className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[12.5px] font-bold" style={{ background: pill.bg, color: pill.c }}>{pill.nhan}</span>
              <span className="absolute right-4 top-[52px]"><Chevron color={MAU.muted} /></span>
              <span className="mt-3 block text-[18.5px] font-extrabold" style={{ ...HEAD, color: r.khoa ? MAU.muted : MAU.acc }}>{cta}{!r.khoa && ' →'}</span>
            </button>
          )
        })}
      </div>
    </ManHS>
  )
}
