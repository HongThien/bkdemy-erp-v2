import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useDieuHuong } from '../lib/useDieuHuong'
import { useSkinErp } from '../lib/erpSkin'
import { useIsMobile } from '../hooks/useIsMobile'
import HoSoModal from '../screens/nhansu/HoSoModal'
import ReportButton from './ReportButton'
import DuongDan from './DuongDan'

// Nút mũi tên của thanh địa chỉ (← → ↑) — mờ đi khi không còn chỗ để đi.
function NutMuiTen({ kyHieu, title, bat, onClick }: { kyHieu: string; title: string; bat: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={!bat} title={title}
      className="flex size-7 shrink-0 items-center justify-center rounded-md text-[15px] leading-none text-[var(--sk-acc)] hover:bg-[var(--sk-surface2)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
      {kyHieu}
    </button>
  )
}

// THANH TRÊN CÙNG = thanh địa chỉ kiểu Windows Explorer (Thùy 13/10), màu theo style app Học sinh (erpSkin.ts):
//   tên app (bấm = về Trang chính) · ← lùi · → tiến · ↑ lên một cấp · [ 🏠 Trang chính › Nhóm › Mục        ☆ ] · báo lỗi · hồ sơ · đăng xuất
// Một hàng duy nhất — thanh "‹ Việc của tôi" riêng bên dưới (07-19) đã gộp vào đây, trả lại 1 hàng chiều cao cho mọi màn.
// Điện thoại không đủ bề ngang: hàng này chỉ còn tên app + hồ sơ; ← 🏠 ☰ và đường dẫn nằm ở thanh mobile của NhanSuHome.
export default function TopBar({ email }: { email: string }) {
  const [hoSo, setHoSo] = useState(false)
  const dh = useDieuHuong()
  const isMobile = useIsMobile()
  const sk = useSkinErp()
  return (
    <header style={sk.bien}
      className="relative z-[60] flex shrink-0 items-center gap-2 border-b border-[var(--sk-line)] bg-[var(--sk-bg)] px-3 py-1.5 text-[var(--sk-ink)]">
      <h1 className="shrink-0">
        <button onClick={() => dh.di(dh.nha)} title="Về Trang chính"
          className="flex items-baseline gap-1 rounded px-1 text-[16px] font-bold tracking-wide text-[var(--sk-acc)] hover:brightness-125" style={{ fontFamily: 'var(--sk-font-head)' }}>
          BKdemy <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--sk-muted)]">ERP</span>
        </button>
      </h1>
      {!isMobile && (
        <>
          <div className="flex shrink-0 items-center">
            <NutMuiTen kyHieu="←" title="Quay lại màn trước" bat={dh.coLui} onClick={dh.lui} />
            <NutMuiTen kyHieu="→" title="Tiến tới màn vừa lùi khỏi" bat={dh.coTien} onClick={dh.tien} />
            <NutMuiTen kyHieu="↑" title="Lên một cấp" bat={dh.coLen} onClick={dh.len} />
          </div>
          <div className="flex h-8 min-w-0 flex-1 items-center rounded-md border border-[var(--sk-line)] bg-[var(--sk-surface2)] px-1">
            <DuongDan duong={dh.duong} duoi={dh.duoi} onDi={dh.di} onDuoi={dh.lopPhu ? dh.lui : undefined} />
            {dh.ghimDuoc && (
              <button onClick={dh.ghim} title={dh.daGhim ? 'Bỏ khỏi Yêu thích' : 'Ghim màn này lên Trang chính'}
                className={`ml-auto shrink-0 rounded px-2 py-1 text-[12px] font-medium hover:bg-[var(--sk-surface2)] ${dh.daGhim ? 'text-[var(--sk-acc)]' : 'text-[var(--sk-muted)] hover:text-[var(--sk-acc)]'}`}>
                {dh.daGhim ? '★ Đã ghim' : '☆ Ghim'}
              </button>
            )}
          </div>
        </>
      )}
      {/* Nút Báo lỗi tự mang màu nền sáng (dùng chung nhiều nơi) — trên thanh tối thì nhuộm lại cho đọc được. */}
      <div className={`ml-auto flex shrink-0 items-center gap-2 text-xs ${sk.cd === 'toi' ? '[&>button:first-child]:border-rose-300/50 [&>button:first-child]:text-rose-300 [&>button:first-child:hover]:bg-rose-400/15' : ''}`}>
        <ReportButton />
        <button onClick={() => setHoSo(true)} title={`Hồ sơ của tôi — ${email}`} className="max-w-[190px] truncate text-[var(--sk-muted)] hover:text-[var(--sk-acc)]">👤{isMobile ? '' : ` ${email}`}</button>
        <button onClick={() => supabase.auth.signOut()} className="rounded border border-[var(--sk-line)] px-2 py-1 text-[var(--sk-muted)] hover:bg-[var(--sk-surface2)] hover:text-rose-500">Đăng xuất</button>
      </div>
      {hoSo && <HoSoModal onClose={() => setHoSo(false)} />}
    </header>
  )
}
