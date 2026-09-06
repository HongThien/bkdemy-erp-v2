// Màn MAY MẮN (ảnh gốc anhgoc_mayman + backdrop_mayman, CEO 07/09). Tranh nền đã vẽ sẵn: tiêu đề, banner
// "Mỗi ngày 1 lượt quay", mascot + bong bóng "Hôm nay: còn 1 lượt", bảng "Cơ hội trúng thưởng" 4 ô (tỉ lệ
// 5% / 1% / 0.1% / –) và mây đáy. Code chỉ đặt lên tranh: VÒNG QUAY 5 ô (conic-gradient + icon PNG từ
// LUCKY_SCREEN_SVG_ICONS) · nút "Quay ngay" (ảnh) · khối "Lịch sử quay gần đây" ở dải mây đáy.
// Mọi kích thước theo cqw (cột là container) để khớp tranh trên mọi bề ngang máy; cả màn KHÔNG cuộn.
// Backend (RPC quay ở server + unique người/ngày + trần ngân sách tháng) làm đợt sau — nút hiện "sắp mở",
// KHÔNG quay giả trên client (kết quả phải do server quyết trước, animation chỉ minh hoạ).
// ⚠ Bong bóng "còn 1 lượt" và tỉ lệ trong bảng là CHỮ VẼ TRONG TRANH — đổi luật phải đổi tranh.
const M = (n: string) => `/bk-ui/mm_${n}.png`

export const MAY_MAN_TI_LE = [
  { nhan: '10.000đ', pct: 5 }, { nhan: '20.000đ', pct: 1 }, { nhan: '50.000đ', pct: 0.1 }, { nhan: 'Chúc bạn may mắn lần sau', pct: null },
]

// 5 ô theo chiều kim đồng hồ, ô đầu ở đỉnh (dưới mũi kim): vàng 10k · xanh 20k · hồng 50k · xanh lá · tím.
// Icon = cắt thẳng từ 4 ô "Cơ hội trúng thưởng" trong tranh (icon trong zip LUCKY là ảnh cắt lẫn chữ nền,
// không dùng được) — hiển thị trong huy hiệu tròn trắng để nền pastel của mảnh cắt không lộ.
const O = [
  { mau: '#FFF0B3', icon: M('gold'), nhan: '10.000đ' },
  { mau: '#BFDFFF', icon: M('silver'), nhan: '20.000đ' },
  { mau: '#FFC9D9', icon: M('gift'), nhan: '50.000đ' },
  { mau: '#C6F2DA', icon: M('clover'), nhan: 'Chúc bạn\nmay mắn\nlần sau' },
  { mau: '#DCD3FF', icon: M('clover'), nhan: 'Chúc bạn\nmay mắn\nlần sau' },
]

function Wheel() {
  const n = O.length, goc = 360 / n
  const bg = `conic-gradient(from ${-goc / 2}deg, ${O.map((o, i) => `${o.mau} ${i * goc}deg ${(i + 1) * goc}deg`).join(', ')})`
  return (
    <div className="relative mx-auto" style={{ width: '64cqw', height: '64cqw' }}>
      {/* mũi kim trên đỉnh viền */}
      <img src={M('pointer')} alt="" className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2" style={{ top: '-9cqw', width: '13cqw' }} draggable={false} />
      {/* viền vàng có chấm sáng */}
      <div className="h-full w-full rounded-full p-[2.6cqw] shadow-[0_8px_24px_rgba(22,34,77,.18)]"
        style={{ background: 'radial-gradient(circle at 50% 30%, #FFE59A, #F5B63A 70%, #D9962A)' }}>
        <div className="relative h-full w-full rounded-full ring-[0.8cqw] ring-white/70" style={{ background: bg }}>
          {O.map((o, i) => {
            const a = i * goc
            return (
              <div key={i} className="absolute left-1/2 top-1/2 flex flex-col items-center text-center"
                style={{ width: '20cqw', transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-19cqw) rotate(${-a}deg)` }}>
                <span className="flex items-center justify-center overflow-hidden rounded-full bg-white/85 shadow-sm" style={{ width: '10cqw', height: '10cqw' }}>
                  <img src={o.icon} alt="" className="h-[86%] w-[86%] rounded-full object-cover" draggable={false} />
                </span>
                <span className="whitespace-pre-line font-extrabold leading-[1.05] text-[#16224D]" style={{ fontSize: o.nhan.includes('\n') ? '2.6cqw' : '3.2cqw' }}>{o.nhan}</span>
              </div>
            )
          })}
          {/* nút sao giữa = đồng xu sao trong UI kit (11_center_star_button trong zip là ảnh cắt hỏng) */}
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-[1cqw] ring-[#FFE59A]" style={{ width: '17cqw', height: '17cqw' }}>
            <img src="/bk-ui/coin_star.png" alt="" className="h-[80%] w-[80%] object-contain" draggable={false} />
          </span>
        </div>
      </div>
      {/* chấm sáng trên viền (12 chấm) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-white/90 shadow-sm"
          style={{ width: '1.6cqw', height: '1.6cqw', transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(-30.7cqw)` }} />
      ))}
    </div>
  )
}

export function MayManScreen() {
  return (
    // chiều dọc theo cqw để khớp tranh (941px ảnh = 100cqw): vùng title+banner 0–300 (32cqw) → vòng quay đè
    // công viên → nút Quay trong khe → chừa đúng bảng "Cơ hội" vẽ sẵn (1060–1360) → lịch sử ở dải mây đáy (1360–1672)
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0" style={{ height: '31cqw' }} />
      <div className="relative shrink-0" style={{ paddingTop: '9.5cqw' }}><Wheel /></div>
      {/* nút Quay ngay — vẽ CSS (file 14_spin_button_play trong zip chỉ 7×5px, hỏng); hồng bo tròn, chữ bong bóng như ảnh gốc */}
      <button disabled aria-label="Quay ngay (sắp mở)"
        className="font-bubble relative mx-auto mt-2 block shrink-0 rounded-full border-[3px] border-white/80 py-[2.2cqw] text-white shadow-[0_8px_20px_rgba(255,93,120,.4)] disabled:opacity-70"
        style={{ width: '52cqw', fontSize: '6cqw', background: 'linear-gradient(180deg, #FF9EBB 0%, #FF5D8A 60%, #F04A7A 100%)' }}>
        Quay ngay ▶
        <span className="absolute -right-1 -top-2 rounded-full bg-white px-1.5 py-px font-sans text-[9px] font-bold text-[#63709A] shadow-sm">sắp mở</span>
      </button>
      {/* bảng "Cơ hội trúng thưởng" = mảnh tranh cắt riêng (y1048–1385), đặt NGAY dưới nút Quay (CEO: sát nút, rõ nét,
          đè lên mây) — 2 mép mờ nhẹ để hoà vào nền */}
      <img src="/bk-ui/bg_mayman_card.jpg" alt="Cơ hội trúng thưởng: 10.000đ 5% · 20.000đ 1% · 50.000đ 0.1% · Chúc bạn may mắn lần sau"
        className="mt-1 w-full shrink-0 select-none" draggable={false}
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 8px, #000 calc(100% - 8px), transparent)', maskImage: 'linear-gradient(to bottom, transparent, #000 8px, #000 calc(100% - 8px), transparent)' }} />
      <div className="min-h-0 flex-1" />
      {/* lịch sử trên dải mây đáy (~29cqw: ảnh y1395–1672) */}
      <div className="flex shrink-0 flex-col px-2 pb-1" style={{ height: '29cqw' }}>
        <div className="flex items-center gap-1.5 px-1">
          <img src={M('trophy')} alt="" className="h-6 w-6 object-contain" draggable={false} />
          <p className="font-bubble text-[14px] font-extrabold text-[#16224D]">Lịch sử quay gần đây</p>
          <span className="ml-auto text-[11px] font-semibold text-[#2F73F6]">Xem tất cả ›</span>
        </div>
        <div className="mt-1 flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-white/85 px-3 text-center">
          <p className="text-[11.5px] leading-snug text-[#63709A]">🍀 Chưa có lượt quay nào. Vòng quay đang được nối vào hệ thống (kết quả do máy chủ quyết định) — sắp mở.</p>
        </div>
      </div>
    </div>
  )
}
