// Màn đấu BẢN THỬ cho hs.html?xem=phieu_luu: câu hỏi mẫu (hệ phương trình, đáp án sinh từ nghiệm nên luôn đúng), không gọi DB.
// Bản thật dùng LamBai (HocSinhApp) làm khu câu hỏi và gọi `api.tra(verdict === 'correct')` — cùng DauView.
import { useMemo, useState } from 'react'
import { HEAD, MAU, NutHS } from '../skin/KhungHS'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { ChangV, LucDiaV } from './kieu'
import { DauView, type ApiDau } from './DauView'

const DEF: number[][] = [[1, 1, 1, -1, 3, 2], [2, 1, 1, -1, 2, 3], [1, 2, 3, -1, 1, 2], [2, -1, 1, 1, 4, 3], [3, 2, 1, -1, 2, 1], [1, -2, 2, 1, 3, -1], [2, 3, 1, -1, -1, 3], [4, 1, 2, -1, 1, -2], [1, 1, 2, -1, 4, 1], [3, -1, 1, 2, 2, 4]]
const VT = [1, 0, 2, 3, 1, 0, 3, 2, 1, 2]
const heso = (a: number, v: string, dau: boolean) => { const m = Math.abs(a), t = (m === 1 ? '' : m) + v; return dau ? (a < 0 ? '−' : '') + t : ` ${a < 0 ? '−' : '+'} ${t}` }
const so = (n: number) => String(n).replace('-', '−')
const pt = (a: number, b: number, c: number) => heso(a, 'x', true) + heso(b, 'y', false) + ' = ' + so(c)
const cap = (x: number, y: number) => `(${so(x)}; ${so(y)})`
function sinhCau(i: number) {
  const [a1, b1, a2, b2, x, y] = DEF[i % DEF.length]
  const sai = [[y, x], [-x, y], [x, -y], [x + 1, y - 1], [-x, -y]].map(([p, q]) => cap(p, q)).filter((t) => t !== cap(x, y))
  const lc = [...new Set(sai)].slice(0, 3); lc.splice(VT[i % VT.length], 0, cap(x, y))
  return { l1: pt(a1, b1, a1 * x + b1 * y), l2: pt(a2, b2, a2 * x + b2 * y), lc, dung: VT[i % VT.length], dapAn: cap(x, y) }
}

function Cau({ api, tong, onXong }: { api: ApiDau; tong: number; onXong: () => void }) {
  const [i, setI] = useState(0)
  const [chon, setChon] = useState<number | null>(null)
  const c = useMemo(() => sinhCau(i), [i])
  async function bam(k: number) { if (chon != null || api.ban) return; setChon(k); await api.tra(k === c.dung) }
  const xong = chon != null && !api.ban
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 p-4">
      <p className="text-[13px]" style={{ color: MAU.muted }}>Câu {i + 1}/{tong} · Cặp số (x; y) nào là nghiệm của hệ phương trình sau?</p>
      <div className="flex items-center gap-3 text-[26px]" style={{ color: MAU.ink }}><span className="text-[70px] font-light leading-[0.8]" style={{ color: MAU.acc }}>{'{'}</span><div className="flex flex-col gap-1"><span>{c.l1}</span><span>{c.l2}</span></div></div>
      <div className="grid grid-cols-2 gap-2.5">
        {c.lc.map((t, k) => {
          const ra = chon != null, dung = ra && k === c.dung, sai = ra && k === chon && k !== c.dung
          return <button key={k} disabled={ra} onClick={() => bam(k)} className="relative py-4 text-[22px]" style={{ ...HEAD, color: MAU.ink, background: dung ? MAU.dung + '33' : sai ? MAU.sai + '33' : MAU.surface2, border: `1.5px solid ${dung ? MAU.dung : sai ? MAU.sai : MAU.line}`, borderRadius: 'var(--sk-radius)' }}><span className="absolute left-2.5 top-1.5 text-[12px]" style={{ color: MAU.acc }}>{'ABCD'[k]}</span>{t}</button>
        })}
      </div>
      {xong && <div className="flex items-center justify-between gap-3"><p className="text-[13.5px]" style={{ color: chon === c.dung ? MAU.dung : MAU.sai }}>{chon === c.dung ? 'Trúng đòn!' : `Trượt rồi. Đáp án đúng là ${c.dapAn}.`}</p>
        <NutHS onClick={() => { if (i + 1 >= tong) onXong(); else { setI(i + 1); setChon(null) } }}>{i + 1 >= tong ? 'Xong lượt' : 'Câu tiếp'}</NutHS></div>}
    </div>
  )
}

export function XemDau({ luc, chang, b, onRut }: { luc: LucDiaV; chang: ChangV; b: BangMau3D; onRut: () => void }) {
  const tong = chang.so_cau_luot ?? 5
  return <DauView luc={luc} chang={chang} b={b} tong={tong} onRut={onRut}>{(api) => <Cau api={api} tong={tong} onXong={onRut} />}</DauView>
}
