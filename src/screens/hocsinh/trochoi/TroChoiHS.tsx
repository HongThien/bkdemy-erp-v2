// ============================================================================
// TRÒ CHƠI (Thùy 04–06/10): 1 ô ở khối Giải trí ⇒ màn danh sách game. Hiện 1 game chơi được (Nông trại BK) + 1 game "sắp ra mắt" (mờ, không bấm được).
// Danh sách ở dsGame.ts. `GameNhungHS`-kiểu nhúng cho Nông trại: <iframe> cùng origin (public/games/nong-trai/), có nút ‹ để về danh sách.
// Chỉ VẼ: không số liệu nghiệp vụ. Khung/màu theo skin (KhungHS), chữ trung tính (không giọng game — đây là danh mục).
// ============================================================================
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, TheHS } from '../skin/KhungHS'
import { DS_GAME, type GameHS } from './dsGame'

function Anh({ g }: { g: GameHS }) {
  return g.anh
    ? <img src={g.anh} alt="" draggable={false} className="h-20 w-20 shrink-0 rounded-[18px] object-cover md:h-24 md:w-24" style={{ border: '1.5px solid var(--sk-line)' }} />
    : <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] text-[37.5px] font-extrabold md:h-24 md:w-24" aria-hidden
        style={{ ...HEAD, background: 'var(--sk-surface2)', color: MAU.muted, border: '1.5px dashed var(--sk-line)' }}>?</span>
}

export default function TroChoiHS({ onBack, onChoi }: { onBack: () => void; onChoi: (id: string) => void }) {
  return (
    <ManHS>
      <DauTrangHS tieuDe="Trò chơi" phu="Giải lao sau giờ học" onBack={onBack} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {DS_GAME.map((g) => {
          const san = g.trangThai === 'san_sang'
          return (
            <TheHS key={g.id} onClick={san ? () => onChoi(g.id) : undefined} tat={!san} className="flex gap-4 p-4">
              <Anh g={g} />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[20px] font-bold leading-tight" style={HEAD}>{g.ten}</span>
                  {!san && <NhanHS mau="var(--sk-muted)">Sắp ra mắt</NhanHS>}
                </span>
                <span className="text-[15px] leading-snug" style={{ color: MAU.ink }}>{g.moTa}</span>
                {g.ghiChu && san && <span className="text-[13px] leading-snug" style={{ color: MAU.muted }}>{g.ghiChu}</span>}
                {san && <span className="mt-auto pt-1 text-[15px] font-bold" style={{ color: MAU.acc }}>Chơi ngay ›</span>}
              </span>
            </TheHS>
          )
        })}
      </div>
    </ManHS>
  )
}

/** Nông trại BK chạy trong khung (iframe cùng origin). Nút ‹ nổi ở góc dưới PHẢI (góc dưới trái đã có nút âm thanh/tuỳ chọn của game) để về danh sách game. */
export function GameNongTraiHS({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-40" style={{ background: 'var(--sk-bg)' }}>
      <iframe title="Nông trại BK" src="/games/nong-trai/index.html?nhung=1" className="h-full w-full border-0" allow="autoplay" />
      <button onClick={onBack} aria-label="Về danh sách trò chơi"
        className="absolute bottom-[calc(10px+env(safe-area-inset-bottom))] right-2.5 z-50 flex h-10 w-10 items-center justify-center rounded-full text-[24px] leading-none active:scale-95"
        style={{ background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: '1.5px solid var(--sk-line)', opacity: 0.92 }}>‹</button>
    </div>
  )
}
