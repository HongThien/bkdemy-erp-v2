// Màn MAY MẮN (ảnh gốc anhgoc_mayman + backdrop_mayman, CEO 07/09). Tranh nền đã vẽ sẵn: tiêu đề, banner
// "Mỗi ngày 1 lượt quay", mascot + bong bóng "Hôm nay: còn 1 lượt", mây đáy. Code đặt lên tranh: VÒNG QUAY 5 ô
// (conic-gradient + icon cắt từ tranh) · nút "Quay ngay" · bảng "Cơ hội trúng thưởng" (mảnh tranh) · "Lịch sử quay
// gần đây" toàn BK ở dải mây đáy. Mọi kích thước theo cqw (cột là container) để khớp tranh trên mọi bề ngang máy.
// BACKEND (07/09): fn_may_man_quay quyết giải ở SERVER (1 lượt/người/ngày, tỉ lệ + trần tháng từ may_man_cau_hinh);
// client gọi xong mới quay bánh xe tới ô server trả (animation minh hoạ), rồi mở sheet kết quả. Tiền = "tiền
// mới", trả theo đợt chốt tháng — màn này chỉ hiện đã trúng bao nhiêu.
// ⚠ Bong bóng "còn 1 lượt" và tỉ lệ trong bảng là CHỮ VẼ TRONG TRANH — đổi luật phải đổi tranh.
import { useEffect, useRef, useState } from 'react'
import { mayManCuaToi, mayManQuay, type MayManCuaToi, type MayManKetQua } from '../../lib/maymai'
import { BKBottomSheet } from './BKUI'

const M = (n: string) => `/bk-ui/mm_${n}.png`
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`

// 5 ô theo chiều kim đồng hồ, ô đầu ở đỉnh (dưới mũi kim): vàng 10k · xanh 20k · hồng 50k · xanh lá · tím.
// tien = giải server trả về khớp ô nào; 0 có 2 ô (3, 4) — client chọn ngẫu nhiên 1 ô để dừng (chỉ minh hoạ).
const O = [
  { mau: '#FFF0B3', icon: M('gold'), nhan: '10.000đ', tien: 10000 },
  { mau: '#BFDFFF', icon: M('silver'), nhan: '20.000đ', tien: 20000 },
  { mau: '#FFC9D9', icon: M('gift'), nhan: '50.000đ', tien: 50000 },
  { mau: '#C6F2DA', icon: M('clover'), nhan: 'Chúc bạn\nmay mắn\nlần sau', tien: 0 },
  { mau: '#DCD3FF', icon: M('clover'), nhan: 'Chúc bạn\nmay mắn\nlần sau', tien: 0 },
]
const oCua = (tien: number) => { const cs = O.map((o, i) => (o.tien === tien ? i : -1)).filter((i) => i >= 0); return cs[Math.floor(Math.random() * cs.length)] ?? 3 }

function Wheel({ goc }: { goc: number }) {
  const n = O.length, g = 360 / n
  const bg = `conic-gradient(from ${-g / 2}deg, ${O.map((o, i) => `${o.mau} ${i * g}deg ${(i + 1) * g}deg`).join(', ')})`
  return (
    <div className="relative mx-auto" style={{ width: '64cqw', height: '64cqw' }}>
      {/* kim = SVG (mm_pointer.png trong zip dính bóng đồng xu bên dưới — CEO 07/09) */}
      <svg viewBox="0 0 48 64" className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 drop-shadow-md" style={{ top: '-8cqw', width: '11cqw' }} aria-hidden>
        <path d="M24 62C24 62 4 38 4 22a20 20 0 0 1 40 0c0 16-20 40-20 40z" fill="#FF5D8A" stroke="#C4325E" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 60C24 60 8 38 8 22a16 16 0 0 1 32 0c0 16-16 38-16 38z" fill="#FF7FA8" />
        <circle cx="24" cy="22" r="9" fill="#fff" stroke="#C4325E" strokeWidth="2" />
        <circle cx="21" cy="19" r="2.5" fill="#FFD6E4" />
      </svg>
      {/* phần quay: viền vàng + đĩa + chấm sáng; transition 4.2s ease-out — góc do server quyết, không random ở client */}
      <div className="h-full w-full rounded-full p-[2.6cqw] shadow-[0_8px_24px_rgba(22,34,77,.18)]"
        style={{ background: 'radial-gradient(circle at 50% 30%, #FFE59A, #F5B63A 70%, #D9962A)', transform: `rotate(${goc}deg)`, transition: 'transform 4.2s cubic-bezier(.17,.67,.12,1)' }}>
        <div className="relative h-full w-full rounded-full ring-[0.8cqw] ring-white/70" style={{ background: bg }}>
          {O.map((o, i) => {
            const a = i * g
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
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-[1cqw] ring-[#FFE59A]" style={{ width: '17cqw', height: '17cqw' }}>
            <img src="/bk-ui/coin_star.png" alt="" className="h-[80%] w-[80%] object-contain" draggable={false} />
          </span>
        </div>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-white/90 shadow-sm"
            style={{ width: '1.6cqw', height: '1.6cqw', transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(-30.7cqw)` }} />
        ))}
      </div>
    </div>
  )
}

const luc = (iso: string) => {
  const ph = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  return ph < 1 ? 'vừa xong' : ph < 60 ? `${ph} phút trước` : ph < 1440 ? `${Math.floor(ph / 60)} giờ trước` : `${Math.floor(ph / 1440)} ngày trước`
}

export function MayManScreen() {
  const [d, setD] = useState<MayManCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [goc, setGoc] = useState(0)
  const [dangQuay, setDangQuay] = useState(false)
  const [kq, setKq] = useState<MayManKetQua | null>(null)
  const vong = useRef(0)
  const load = () => mayManCuaToi().then(setD).catch((e) => setErr(e?.message ?? String(e)))
  useEffect(() => { load() }, [])

  async function quay() {
    if (dangQuay || !d || d.hom_nay) return
    setDangQuay(true); setErr(null)
    try {
      const r = await mayManQuay()                       // server quyết trước
      const o = oCua(r.tien)
      vong.current += 5                                  // 5 vòng + dừng ở ô o (ô i nằm ở góc i*72 → xoay -i*72)
      setGoc(vong.current * 360 - o * (360 / O.length))
      setTimeout(() => { setKq(r); setDangQuay(false); load() }, 4400)
    } catch (e: any) { setErr(e?.message ?? String(e)); setDangQuay(false) }
  }
  const daQuay = !!d?.hom_nay
  const conLuot = d ? !daQuay && d.active : false

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0" style={{ height: '31cqw' }} />
      <div className="relative shrink-0" style={{ paddingTop: '9.5cqw' }}>
        <Wheel goc={goc} />
        {/* nhãn trạng thái hôm nay (bong bóng "còn 1 lượt" trong tranh là chữ vẽ — nhãn này mới là thật) */}
        {d && (
          <span className="pointer-events-none absolute right-1 top-[6cqw] rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold shadow-sm" style={{ color: daQuay ? '#63709A' : '#FF5D78' }}>
            {daQuay ? (d.hom_nay!.tien > 0 ? `Hôm nay: +${vnd(d.hom_nay!.tien)} 🎉` : 'Hôm nay: đã quay') : d.active ? 'Hôm nay: còn 1 lượt' : 'Vòng quay tạm đóng'}
          </span>
        )}
      </div>
      <button disabled={!conLuot || dangQuay} onClick={quay} aria-label="Quay ngay"
        className="font-bubble relative mx-auto mt-2 block shrink-0 rounded-full border-[3px] border-white/80 py-[2.2cqw] text-white shadow-[0_8px_20px_rgba(255,93,120,.4)] transition active:scale-95 disabled:opacity-60"
        style={{ width: '52cqw', fontSize: '6cqw', background: 'linear-gradient(180deg, #FF9EBB 0%, #FF5D8A 60%, #F04A7A 100%)' }}>
        {dangQuay ? 'Đang quay…' : daQuay ? 'Mai quay tiếp ♡' : 'Quay ngay ▶'}
      </button>
      {err && <p className="mx-2 mt-1 rounded-2xl bg-[#FFE3EA] px-3 py-1.5 text-center text-[11.5px] text-[#C0355A]">⚠ {err}</p>}
      <img src="/bk-ui/bg_mayman_card.jpg" alt="Cơ hội trúng thưởng: 10.000đ 5% · 20.000đ 1% · 50.000đ 0.1% · Chúc bạn may mắn lần sau"
        className="mt-1 w-full shrink-0 select-none" draggable={false}
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 8px, #000 calc(100% - 8px), transparent)', maskImage: 'linear-gradient(to bottom, transparent, #000 8px, #000 calc(100% - 8px), transparent)' }} />
      <div className="min-h-0 flex-1" />
      {/* lịch sử toàn BK trên dải mây đáy — cuộn nội bộ */}
      <div className="flex shrink-0 flex-col px-2 pb-1" style={{ height: '33cqw' }}>
        <div className="flex items-center gap-1.5 px-1">
          <img src={M('trophy')} alt="" className="h-6 w-6 object-contain" draggable={false} />
          <p className="font-bubble text-[14px] font-extrabold text-[#16224D]">Lịch sử quay gần đây</p>
          {d && <span className="ml-auto text-[10px] font-semibold text-[#63709A]">Tháng này BK đã trúng {vnd(d.thang.bk)}</span>}
        </div>
        <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto rounded-2xl bg-white/85 px-2 py-1">
          {!d ? <p className="py-2 text-center text-[11px] text-[#63709A]">Đang tải…</p>
            : !d.lich_su.length ? <p className="py-2 text-center text-[11px] text-[#63709A]">🍀 Chưa có lượt quay nào — bạn mở hàng nhé!</p>
            : d.lich_su.map((l, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-xl px-1.5 py-1 ${l.la_toi ? 'bg-[#EEF3FF]' : ''}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DDF4FF] ring-2 ring-[#DCE6FF]">
                  {l.anh_url ? <img src={l.anh_url} alt="" className="h-full w-full object-cover" draggable={false} /> : <span className="text-[11px] font-extrabold text-[#2F73F6]">{l.ho_ten.trim().split(/\s+/).pop()?.charAt(0)}</span>}
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[11.5px] font-extrabold text-[#16224D]">{l.ho_ten.split(' ').slice(-2).join(' ')}{l.la_toi && <span className="ml-1 rounded-full bg-[#2F73F6] px-1.5 text-[8px] text-white">Bạn</span>}</p>
                  <p className="text-[9.5px] text-[#63709A]">{luc(l.created_at)}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-extrabold" style={{ color: l.tien > 0 ? '#C27A00' : '#1E8A52' }}>
                  <img src={l.tien >= 50000 ? M('gift') : l.tien >= 20000 ? M('silver') : l.tien > 0 ? M('gold') : M('clover')} alt="" className="h-5 w-5 rounded-full object-cover" draggable={false} />
                  {l.tien > 0 ? vnd(l.tien) : 'May mắn lần sau'}
                </span>
                <span className="font-hand hidden shrink-0 rounded-lg bg-[#FFF6D6] px-1.5 py-0.5 text-[9px] italic text-[#B87800] min-[400px]:block">{l.tien > 0 ? 'Thật may mắn! ♡' : 'Cố lên nhé! ♡'}</span>
              </div>
            ))}
        </div>
      </div>

      <BKBottomSheet open={!!kq} onClose={() => setKq(null)}>
        {kq && (
          <div className="text-center">
            <img src={kq.tien >= 50000 ? M('gift') : kq.tien >= 20000 ? M('silver') : kq.tien > 0 ? M('gold') : M('clover')} alt="" className="mx-auto h-24 w-24 rounded-full object-cover" draggable={false} />
            <p className="font-bubble mt-2 text-[20px] font-extrabold text-[#16224D]">{kq.tien > 0 ? `Chúc mừng! +${vnd(kq.tien)} 🎉` : 'Chúc bạn may mắn lần sau ♡'}</p>
            <p className="mt-1 text-[12.5px] text-[#63709A]">
              {kq.tien > 0 ? 'Tiền thưởng được cộng vào đợt chốt tháng. Mai lại quay tiếp nhé!' : kq.vuot_tran ? 'Quỹ may mắn tháng này đã hết — mai quay tiếp, tháng sau quỹ mới!' : 'Mai lại có 1 lượt mới, đừng bỏ lỡ!'}
            </p>
            <button onClick={() => setKq(null)} className="mt-4 w-full rounded-full bg-[#2F73F6] py-2.5 text-[13.5px] font-extrabold text-white">Tuyệt! ♡</button>
          </div>
        )}
      </BKBottomSheet>
    </div>
  )
}
