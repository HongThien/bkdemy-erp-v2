// Màn MAY MẮN (design 03) — ĐỢT UI: vòng quay vector (conic-gradient 6 ô), nút "Quay ngay", tile tỉ lệ,
// lịch sử. Backend (RPC quay ở server + unique người/ngày + trần ngân sách tháng) làm đợt sau —
// hiện nút ở trạng thái "sắp mở", KHÔNG quay giả trên client (kết quả phải do server quyết trước,
// animation chỉ minh hoạ — handoff §4). Tỉ lệ đọc từ cấu hình sau; hiện dùng số CEO chốt.
import { BKSectionCard, BKSectionTitle, BKEmptyState } from './BKUI'

export const MAY_MAN_TI_LE = [
  { nhan: '10.000đ', pct: 5, icon: '🪙', bg: 'bg-[#FFF6D6] border-[#FFE59A]', text: 'text-[#A66A00]' },
  { nhan: '20.000đ', pct: 1, icon: '💎', bg: 'bg-[#DDF4FF] border-[#BFE3FF]', text: 'text-[#174DAF]' },
  { nhan: '50.000đ', pct: 0.1, icon: '🎁', bg: 'bg-[#FFE3EA] border-[#FFC3D2]', text: 'text-[#C0355A]' },
  { nhan: 'Chúc may mắn lần sau', pct: null, icon: '🍀', bg: 'bg-[#DDF7E8] border-[#BDF0D6]', text: 'text-[#1E8A52]' },
]

function Wheel() {
  const seg = ['#FFE59A', '#BFE3FF', '#FFC3D2', '#BDF0D6', '#D6C8FF', '#BDF0D6']
  const bg = `conic-gradient(${seg.map((c, i) => `${c} ${i * 60}deg ${(i + 1) * 60}deg`).join(', ')})`
  const labels = ['10.000đ', '20.000đ', '50.000đ', 'May mắn\nlần sau', 'May mắn\nlần sau', 'May mắn\nlần sau']
  return (
    <div className="relative mx-auto h-[260px] w-[260px]">
      <span className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 text-[30px] text-[#FF5D78] drop-shadow">📍</span>
      <div className="h-full w-full rounded-full p-2 shadow-[0_8px_24px_rgba(22,34,77,.14)]" style={{ background: 'linear-gradient(135deg,#FFD84D,#FFB33D)' }}>
        <div className="relative h-full w-full rounded-full" style={{ background: bg }}>
          {labels.map((l, i) => (
            <span key={i} className="absolute left-1/2 top-1/2 w-[76px] -translate-x-1/2 -translate-y-1/2 whitespace-pre-line text-center text-[10.5px] font-extrabold leading-tight text-[#16224D]"
              style={{ transform: `translate(-50%,-50%) rotate(${i * 60 + 30}deg) translateY(-84px) rotate(-${i * 60 + 30}deg)` }}>{l}</span>
          ))}
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[30px] shadow-md ring-4 ring-[#FFE59A]">⭐</span>
        </div>
      </div>
    </div>
  )
}

export function MayManScreen() {
  return (
    <div className="flex flex-col gap-1">
      <BKSectionCard tone="blue" className="text-center">
        <p className="text-[13px] font-bold text-[#16224D]">🎁 Mỗi ngày 1 lượt quay</p>
        <p className="text-[11.5px] text-[#63709A]">Cơ hội nhận những phần quà bất ngờ! ♡</p>
      </BKSectionCard>
      <div className="relative py-2">
        <span className="pointer-events-none absolute right-2 top-0 rounded-2xl bg-white px-2.5 py-1 text-[11px] font-bold text-[#2F73F6] shadow-sm">Hôm nay: <span className="text-[#FF5D78]">sắp mở</span></span>
        <Wheel />
      </div>
      <button disabled className="mx-auto w-[80%] rounded-full bg-gradient-to-b from-[#FF8FB1] to-[#FF5D78] py-3.5 text-[18px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,93,120,.35)] disabled:opacity-50">Quay ngay ▶</button>
      <p className="-mt-1 text-center text-[11px] text-[#63709A]">Vòng quay đang được nối vào hệ thống (kết quả do máy chủ quyết định) — sắp mở.</p>

      <BKSectionCard>
        <BKSectionTitle right={<span className="text-[10.5px] italic text-[#63709A]">Những phần quà nhỏ, niềm vui lớn ♡</span>}>🎁 Cơ hội trúng thưởng</BKSectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {MAY_MAN_TI_LE.map((t) => (
            <div key={t.nhan} className={`rounded-2xl border p-2 text-center ${t.bg}`}>
              <p className="text-[26px]">{t.icon}</p>
              <p className="text-[10.5px] font-bold leading-tight text-[#16224D]">{t.nhan}</p>
              <p className={`mt-1 rounded-full bg-white/80 text-[11px] font-extrabold ${t.text}`}>{t.pct == null ? '–' : `${t.pct}%`}</p>
            </div>
          ))}
        </div>
      </BKSectionCard>
      <BKSectionCard>
        <BKSectionTitle>🏆 Lịch sử quay gần đây</BKSectionTitle>
        <BKEmptyState icon="🍀">Chưa có lượt quay nào.</BKEmptyState>
      </BKSectionCard>
    </div>
  )
}
