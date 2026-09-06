// Màn XẾP HẠNG (design 01): segmented 2 bảng ĐANG CÓ (riêng vai trò · chung toàn BK — giữ đúng nguồn
// dữ liệu fn_*_dashboard / fn_xephang_chung), bục top 3 + dòng "Bạn". Chỉ có top 3 + hạng của mình
// (fn không trả full bảng — CEO chốt TA thấy mình + top 3), nên KHÔNG vẽ list 4..8 giả.
import { useState } from 'react'
import type { XepHangTop } from '../../lib/xephang'
import { BKSegmented, BKSectionCard, BKEmptyState } from './BKUI'

export type XepHangData = { rank: number | null; tongXepHang: number; top: XepHangTop[]; nguongRankFinal: number; nguongRankTop: number; me?: { pct?: number | null; dat?: number; den_han?: number } }

const AV = ['🧑‍🏫', '👩‍🏫', '🧑‍🎓', '👩‍🎓', '🧑', '👩']
const av = (s: string) => AV[(s.charCodeAt(0) + s.length) % AV.length]
// Trang trí bục: cắt từ sprite CEO gửi 07/09 (public/bk-ui/cautrangtri.png → tt_*.png nền trong)
const TT = (n: string) => `/bk-ui/tt_${n}.png`

function Podium({ top }: { top: XepHangTop[] }) {
  const [a, b, c] = [top[0], top[1], top[2]]
  const Col = ({ p, h, tone, num, size, vuongMien }: { p?: XepHangTop; h: string; tone: string; num: string; size: string; vuongMien?: boolean }) => (
    <div className="flex flex-1 flex-col items-center justify-end">
      {p ? (
        <>
          {vuongMien && <img src={TT('vuong_mien')} alt="" className="-mb-1.5 h-6 w-auto object-contain" draggable={false} />}
          <span className={`flex items-center justify-center rounded-full bg-white shadow-md ring-4 ${size}`}>{av(p.ho_ten)}</span>
          <p className="mt-1 max-w-full truncate px-1 text-[12.5px] font-extrabold text-[#16224D]">{p.ho_ten.split(' ').slice(-2).join(' ')}</p>
          <p className="text-[11px] font-semibold text-[#63709A]">👑 {p.pct ?? '—'}% · {p.dat}/{p.den_han}</p>
        </>
      ) : <span className="text-[11px] text-[#9AA5C4]">—</span>}
      <div className={`mt-1 flex w-full items-center justify-center rounded-t-2xl text-[22px] font-extrabold text-white ${tone}`} style={{ height: h }}>{num}</div>
    </div>
  )
  return (
    // bục gọn theo chiều cao — cả màn Xếp hạng (tranh + hồ sơ + tháng + 2 bảng + bục + dòng Bạn) phải vừa 1 màn iPhone.
    // Trang trí như ảnh gốc 01_xep_hang: 2 bong bóng lời góc trên, vương miện trên #1, tia sáng + tim rải quanh.
    <div className="relative mt-1 flex items-end gap-2 px-1 pt-10">
      <img src={TT('bubble_trai')} alt="" className="pointer-events-none absolute -left-1 -top-1 w-[74px]" draggable={false} />
      <img src={TT('bubble_phai')} alt="" className="pointer-events-none absolute -right-1 -top-1 w-[70px]" draggable={false} />
      <img src={TT('tia_to')} alt="" className="pointer-events-none absolute left-[27%] top-1 w-4" draggable={false} />
      <img src={TT('tia_nho')} alt="" className="pointer-events-none absolute right-[26%] top-9 w-3" draggable={false} />
      <img src={TT('tia_to')} alt="" className="pointer-events-none absolute right-1 top-[84px] w-4" draggable={false} />
      <img src={TT('tia_nho')} alt="" className="pointer-events-none absolute left-1.5 top-[96px] w-3" draggable={false} />
      <img src={TT('tim_hong')} alt="" className="pointer-events-none absolute left-[7%] top-[70px] w-4" draggable={false} />
      <img src={TT('sao_xanh')} alt="" className="pointer-events-none absolute right-[7%] top-[76px] w-4" draggable={false} />
      <Col p={b} h="42px" tone="bg-[#B9C8FF]" num="2" size="h-12 w-12 text-[22px] ring-[#DDE4FF]" />
      <Col p={a} h="58px" tone="bg-[#FFD84D]" num="1" size="h-[60px] w-[60px] text-[28px] ring-[#FFE59A]" vuongMien />
      <Col p={c} h="34px" tone="bg-[#FFB3C6]" num="3" size="h-12 w-12 text-[22px] ring-[#FFD6E0]" />
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
          <BKSectionCard tone="blue" className="!p-3">
            {d.top.length ? <Podium top={d.top} /> : <BKEmptyState icon="🏆">Chưa ai đủ điều kiện tháng này.</BKEmptyState>}
          </BKSectionCard>
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
