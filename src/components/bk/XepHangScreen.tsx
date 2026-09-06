// Màn XẾP HẠNG (design 01): segmented 2 bảng ĐANG CÓ (riêng vai trò · chung toàn BK — giữ đúng nguồn
// dữ liệu fn_*_dashboard / fn_xephang_chung), bục top 3 + dòng "Bạn". Chỉ có top 3 + hạng của mình
// (fn không trả full bảng — CEO chốt TA thấy mình + top 3), nên KHÔNG vẽ list 4..8 giả.
import { useState } from 'react'
import type { XepHangTop } from '../../lib/xephang'
import { BKSegmented, BKSectionCard, BKEmptyState } from './BKUI'

export type XepHangData = { rank: number | null; tongXepHang: number; top: XepHangTop[]; nguongRankFinal: number; nguongRankTop: number; me?: { pct?: number | null; dat?: number; den_han?: number } }

const AV = ['🧑‍🏫', '👩‍🏫', '🧑‍🎓', '👩‍🎓', '🧑', '👩']
const av = (s: string) => AV[(s.charCodeAt(0) + s.length) % AV.length]

function Podium({ top }: { top: XepHangTop[] }) {
  const [a, b, c] = [top[0], top[1], top[2]]
  const Col = ({ p, h, tone, num, size }: { p?: XepHangTop; h: string; tone: string; num: string; size: string }) => (
    <div className="flex flex-1 flex-col items-center justify-end">
      {p ? (
        <>
          <span className={`flex items-center justify-center rounded-full bg-white shadow-md ring-4 ${size}`}>{av(p.ho_ten)}</span>
          <p className="mt-1 max-w-full truncate px-1 text-[12.5px] font-extrabold text-[#16224D]">{p.ho_ten.split(' ').slice(-2).join(' ')}</p>
          <p className="text-[11px] font-semibold text-[#63709A]">👑 {p.pct ?? '—'}% · {p.dat}/{p.den_han}</p>
        </>
      ) : <span className="text-[11px] text-[#9AA5C4]">—</span>}
      <div className={`mt-1 flex w-full items-center justify-center rounded-t-2xl text-[22px] font-extrabold text-white ${tone}`} style={{ height: h }}>{num}</div>
    </div>
  )
  return (
    <div className="relative mt-2 flex items-end gap-2 px-2">
      <span className="pointer-events-none absolute left-2 top-0 text-[14px] text-[#FFD84D]">✦</span>
      <span className="pointer-events-none absolute right-3 top-4 text-[12px] text-[#FFD84D]">✦</span>
      <Col p={b} h="56px" tone="bg-[#B9C8FF]" num="2" size="h-14 w-14 text-[26px] ring-[#DDE4FF]" />
      <Col p={a} h="76px" tone="bg-[#FFD84D]" num="1" size="h-[72px] w-[72px] text-[34px] ring-[#FFE59A]" />
      <Col p={c} h="46px" tone="bg-[#FFB3C6]" num="3" size="h-14 w-14 text-[26px] ring-[#FFD6E0]" />
    </div>
  )
}

export function XepHangScreen({ rieng, chung, tenRieng, ten }: { rieng: XepHangData | null; chung: XepHangData | null; tenRieng: string; ten: string }) {
  const [tab, setTab] = useState<'rieng' | 'chung'>('rieng')
  const d = tab === 'rieng' ? rieng : chung
  return (
    <div className="flex flex-col gap-3">
      <BKSegmented value={tab} onChange={setTab} items={[
        { key: 'rieng', label: `BXH ${tenRieng}`, sub: 'Ai chăm nhất nè? ♡', icon: '📋' },
        { key: 'chung', label: 'BXH toàn BK', sub: 'Cùng nhau toả sáng!', icon: '⭐' },
      ]} />
      {!d ? <BKEmptyState>Đang tính…</BKEmptyState> : (
        <>
          <BKSectionCard tone="blue">
            {d.top.length ? <Podium top={d.top} /> : <BKEmptyState icon="🏆">Chưa ai đủ điều kiện tháng này.</BKEmptyState>}
          </BKSectionCard>
          <BKSectionCard className={d.rank ? 'ring-2 ring-[#2F73F6]/40' : ''}>
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-[18px] font-extrabold text-[#2F73F6]">{d.rank ?? '—'}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDF4FF] text-[22px]">{av(ten)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-extrabold text-[#16224D]">{ten} <span className="rounded-full bg-[#2F73F6] px-1.5 py-0.5 text-[9.5px] text-white">Bạn</span></p>
                <p className="text-[11.5px] text-[#63709A]">{d.me?.pct != null ? `${d.me.pct}% · ${d.me.dat ?? 0}/${d.me.den_han ?? 0} việc` : 'Chưa có việc đến hạn tháng này'}</p>
              </div>
              <span className="rounded-2xl bg-[#EEF3FF] px-2.5 py-1.5 text-right text-[10.5px] font-semibold leading-tight text-[#2F73F6]">
                {d.rank ? <>Bạn đang<br />#{d.rank}/{d.tongXepHang} ✨</> : <>Cần ≥{d.nguongRankFinal} việc<br />hoặc top {d.nguongRankTop} khối lượng</>}
              </span>
            </div>
          </BKSectionCard>
          {/* nền trắng mờ vì màn này đặt trên tranh (cỏ hoa ở đáy) — chữ trần không đọc được */}
          <p className="rounded-2xl bg-white/85 px-3 py-2 text-[11px] text-[#63709A]">Xếp theo % đạt chuẩn. Vào bảng khi ≥{d.nguongRankFinal} việc/tháng, hoặc đang lọt top {d.nguongRankTop} khối lượng (bảng tạm).</p>
        </>
      )}
    </div>
  )
}
