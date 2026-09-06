// Màn XẾP HẠNG (design 01): segmented 2 bảng ĐANG CÓ (riêng vai trò · chung toàn BK — giữ đúng nguồn
// dữ liệu fn_*_dashboard / fn_xephang_chung), bục top 3 + dòng "Bạn". Chỉ có top 3 + hạng của mình
// (fn không trả full bảng — CEO chốt TA thấy mình + top 3), nên KHÔNG vẽ list 4..8 giả.
import { useState } from 'react'
import type { XepHangTop } from '../../lib/xephang'
import { BKSegmented, BKSectionCard, BKEmptyState } from './BKUI'

export type XepHangData = { rank: number | null; tongXepHang: number; top: XepHangTop[]; nguongRankFinal: number; nguongRankTop: number; me?: { pct?: number | null; dat?: number; den_han?: number } }

const AV = ['🧑‍🏫', '👩‍🏫', '🧑‍🎓', '👩‍🎓', '🧑', '👩']
const av = (s: string) => AV[(s.charCodeAt(0) + s.length) % AV.length]
// BỤC TRAO GIẢI = ảnh CEO vẽ (buctraogia.png → cắt lề y150–920, thu 1000px: public/bk-ui/buc_trao_giai.png)
// đã có sẵn 3 khung tròn avatar, 3 thẻ tên, bục 1/2/3, vương miện, bong bóng, mây, tia sáng. Code chỉ
// ĐẶT avatar vào lỗ tròn và tên + số liệu lên thẻ theo toạ độ % đo trên ảnh (cx/cy = tâm lỗ, d = đường
// kính lỗ theo % bề ngang; the = hộp chữ phủ lên 2 vạch placeholder của thẻ, màu = màu nền thẻ).
// Chữ cỡ theo cqw (bục là container inline-size) → co giãn đúng theo bề ngang máy.
const BUC = { url: '/bk-ui/buc_trao_giai.png', aspect: '1448 / 770' }
// Hộp chữ phủ GẦN HẾT thẻ (kể cả icon vương miện/sao nhỏ) — tên Việt 2 chữ cần ~21% bề ngang, chừa icon thì cắt tên.
const VI_TRI = [
  { cx: 49.9, cy: 29.2, d: 17.0, the: { l: 39.6, t: 49.5, w: 21.4, h: 12.6 }, mau: '#FCF5E7' },   // #1
  { cx: 25.0, cy: 44.2, d: 14.6, the: { l: 14.8, t: 62.6, w: 19.6, h: 12.6 }, mau: '#F1F3FF' },   // #2
  { cx: 74.9, cy: 44.2, d: 14.6, the: { l: 65.9, t: 61.9, w: 19.8, h: 12.6 }, mau: '#FFF1F4' },   // #3
]

function Podium({ top }: { top: XepHangTop[] }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: BUC.aspect, containerType: 'inline-size' }}>
      <img src={BUC.url} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />
      {VI_TRI.map((v, i) => {
        const p = top[i]
        if (!p) return null
        return (
          <div key={i}>
            <span className="absolute flex items-center justify-center rounded-full bg-white"
              style={{ left: `${v.cx}%`, top: `${v.cy}%`, width: `${v.d}%`, aspectRatio: '1', transform: 'translate(-50%,-50%)', fontSize: `${v.d * 0.55}cqw` }}>{av(p.ho_ten)}</span>
            <div className="absolute flex flex-col justify-center overflow-hidden rounded-md text-center"
              style={{ left: `${v.the.l}%`, top: `${v.the.t}%`, width: `${v.the.w}%`, height: `${v.the.h}%`, background: v.mau }}>
              <p className="truncate font-extrabold leading-tight text-[#16224D]" style={{ fontSize: '2.9cqw' }}>{p.ho_ten.split(' ').slice(-2).join(' ')}</p>
              <p className="truncate font-semibold leading-tight text-[#63709A]" style={{ fontSize: '2.5cqw' }}>👑 {p.pct ?? '—'}% · {p.dat}/{p.den_han}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function XepHangScreen({ rieng, chung, tenRieng, ten }: { rieng: XepHangData | null; chung: XepHangData | null; tenRieng: string; ten: string }) {
  const [tab, setTab] = useState<'rieng' | 'chung'>('rieng')
  const d = tab === 'rieng' ? rieng : chung
  return (
    <div className="flex flex-col gap-1">
      <BKSegmented value={tab} onChange={setTab} items={[
        { key: 'rieng', label: `BXH ${tenRieng}`, sub: 'Ai chăm nhất nè? ♡', icon: '📋' },
        { key: 'chung', label: 'BXH toàn BK', sub: 'Cùng nhau toả sáng!', icon: '⭐' },
      ]} />
      {!d ? <BKEmptyState>Đang tính…</BKEmptyState> : (
        <>
          {/* bục là ảnh có sẵn mây nền → không bọc thẻ */}
          {d.top.length ? <Podium top={d.top} /> : <BKEmptyState icon="🏆">Chưa ai đủ điều kiện tháng này.</BKEmptyState>}
          <BKSectionCard className={`!p-3 ${d.rank ? 'ring-2 ring-[#2F73F6]/40' : ''}`}>
            <div className="flex items-center gap-2.5">
              <span className="w-6 text-center text-[18px] font-extrabold text-[#2F73F6]">{d.rank ?? '—'}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDF4FF] text-[20px]">{av(ten)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold leading-tight text-[#16224D]">{ten} <span className="rounded-full bg-[#2F73F6] px-1.5 py-0.5 text-[9px] text-white">Bạn</span></p>
                <p className="text-[11px] text-[#63709A]">{d.me?.pct != null ? `${d.me.pct}% · ${d.me.dat ?? 0}/${d.me.den_han ?? 0} việc` : 'Chưa có việc đến hạn'}</p>
              </div>
              {/* luật vào bảng nằm ngay đây (không có dòng ghi chú riêng — cả màn phải vừa 1 màn iPhone) */}
              <span className="shrink-0 rounded-2xl bg-[#EEF3FF] px-2.5 py-1.5 text-right text-[10px] font-semibold leading-tight text-[#2F73F6]">
                {d.rank ? <>Bạn đang<br />#{d.rank}/{d.tongXepHang} ✨</> : <>Cần ≥{d.nguongRankFinal} việc<br />hoặc top {d.nguongRankTop} khối lượng</>}
              </span>
            </div>
          </BKSectionCard>
        </>
      )}
    </div>
  )
}
