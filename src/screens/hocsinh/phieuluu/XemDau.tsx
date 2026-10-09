// Màn đấu BẢN THỬ cho hs.html?xem=phieu_luu: câu hỏi mẫu (hệ phương trình, đáp án sinh từ nghiệm nên luôn đúng), không gọi DB.
// Bản thật dùng LamBai (HocSinhApp) làm khu câu hỏi và gọi `api.tra(verdict === 'correct')` — cùng DauView.
import { useMemo, useState } from 'react'
import { MAU } from '../skin/KhungHS'
import { TheTran, DaiTran, PHIEN, CLS_PHIEN, NgocChu, NUT_TRAN, HOP_LOI_GIAI, FONT_TRAN, type TtTran } from '../skin/KhungTran'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { ChangV, LucDiaV } from './kieu'
import type { ApiDau } from './DauView'
import { DauView2D } from './DauView2D'
import type { NvId } from '../skin/nhanVat'

const DEF: number[][] = [[1, 1, 1, -1, 3, 2], [2, 1, 1, -1, 2, 3], [1, 2, 3, -1, 1, 2], [2, -1, 1, 1, 4, 3], [3, 2, 1, -1, 2, 1], [1, -2, 2, 1, 3, -1], [2, 3, 1, -1, -1, 3], [4, 1, 2, -1, 1, -2], [1, 1, 2, -1, 4, 1], [3, -1, 1, 2, 2, 4]]
const VT = [1, 0, 2, 3, 1, 0, 3, 2, 1, 2]
const heso = (a: number, v: string, dau: boolean) => { const m = Math.abs(a), t = (m === 1 ? '' : m) + v; return dau ? (a < 0 ? '−' : '') + t : ` ${a < 0 ? '−' : '+'} ${t}` }
const so = (n: number) => String(n).replace('-', '−')
const pt = (a: number, b: number, c: number) => heso(a, 'x', true) + heso(b, 'y', false) + ' = ' + so(c)
const cap = (x: number, y: number) => `(${so(x)}; ${so(y)})`
// Lời giải chi tiết (phương pháp cộng đại số) sinh từ chính hệ số — để trang xem thử có đủ khối "lời giải" như bài thật.
function loiGiai(a1: number, b1: number, a2: number, b2: number, c1: number, c2: number, x: number, y: number): string[] {
  const D = a1 * b2 - a2 * b1, Dx = c1 * b2 - c2 * b1
  const ng = (n: number) => (n < 0 ? `(${so(n)})` : so(n)) // số âm trong phép nhân phải có ngoặc
  const hs = (n: number, v: string) => (n === 1 ? v : n === -1 ? `−${v}` : `${so(n)}${v}`)
  return [
    `Nhân (1) với ${so(b2)} và (2) với ${so(b1)} rồi trừ vế theo vế để khử y:`,
    `(${ng(a1)}·${ng(b2)} − ${ng(a2)}·${ng(b1)})x = ${ng(c1)}·${ng(b2)} − ${ng(c2)}·${ng(b1)}  ⇒  ${hs(D, "x")} = ${so(Dx)}  ⇒  x = ${so(x)}`,
    `Thay x = ${so(x)} vào (1): ${hs(b1, "y")} = ${so(c1)} − ${ng(a1 * x)} = ${so(c1 - a1 * x)}  ⇒  y = ${so(y)}`,
    `Vậy hệ có nghiệm duy nhất ${cap(x, y)}.`,
  ]
}
function sinhCau(i: number) {
  const [a1, b1, a2, b2, x, y] = DEF[i % DEF.length]
  const sai = [[y, x], [-x, y], [x, -y], [x + 1, y - 1], [-x, -y]].map(([p, q]) => cap(p, q)).filter((t) => t !== cap(x, y))
  const lc = [...new Set(sai)].slice(0, 3); lc.splice(VT[i % VT.length], 0, cap(x, y))
  const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y
  return { l1: pt(a1, b1, c1), l2: pt(a2, b2, c2), lc, dung: VT[i % VT.length], dapAn: cap(x, y), giai: loiGiai(a1, b1, a2, b2, c1, c2, x, y) }
}

function Cau({ api, tong, onXong }: { api: ApiDau; tong: number; onXong: () => void }) {
  const [i, setI] = useState(0)
  const [chon, setChon] = useState<number | null>(null)
  const c = useMemo(() => sinhCau(i), [i])
  async function bam(k: number) { if (chon != null || api.ban) return; setChon(k); await api.tra(k === c.dung) }
  const ra = chon != null
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 p-3 md:p-4" style={{ fontFamily: FONT_TRAN }}>
      <TheTran className="p-5">
        <DaiTran trai={`Câu ${i + 1}/${tong} · chọn đúng để tung phép`} />
        <p className="text-[21px] font-semibold" style={{ color: MAU.ink }}>Cặp số (x; y) nào là nghiệm của hệ phương trình sau?</p>
        <div className="my-2 flex items-center gap-3 text-[28.5px] font-semibold" style={{ color: MAU.ink }}><span className="text-[77px] font-light leading-[0.8]" style={{ color: MAU.acc }}>{'{'}</span><div className="flex flex-col gap-1"><span>{c.l1}  (1)</span><span>{c.l2}  (2)</span></div></div>
        <div className="grid grid-cols-2 gap-3">
          {c.lc.map((t, k) => {
            const tt: TtTran = ra && k === c.dung ? 'dung' : ra && k === chon ? 'sai' : 'thuong'
            return <button key={k} disabled={ra} onClick={() => bam(k)} className={`flex items-center gap-3 px-3 py-3 text-left text-[24px] ${CLS_PHIEN(tt)}`} style={PHIEN(tt)}><NgocChu t={tt} chu={'ABCD'[k]} />{t}</button>
          })}
        </div>
        {ra && (
          <div className="mt-4 p-3" style={HOP_LOI_GIAI(chon === c.dung)} ref={(el) => el?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            <p className="text-[21px] font-semibold" style={{ color: chon === c.dung ? MAU.dung : MAU.sai }}>{chon === c.dung ? '✦ Trúng đòn! Em làm đúng rồi' : `💥 Trượt đòn — đáp án đúng là ${c.dapAn}`}</p>
            <div className="mt-2 pt-2 text-[20px] leading-relaxed" style={{ borderTop: `1px solid ${MAU.line}`, color: MAU.ink }}>
              <p className="mb-1 text-[16.5px] font-semibold uppercase" style={{ color: MAU.acc }}>📜 Lời giải chi tiết</p>
              {c.giai.map((d, k) => <p key={k}>{d}</p>)}
            </div>
          </div>
        )}
      </TheTran>
      {ra && <button disabled={api.ban} onClick={() => { if (i + 1 >= tong) onXong(); else { setI(i + 1); setChon(null) } }} className="tran-phien py-3 text-[21px]" style={NUT_TRAN}>{i + 1 >= tong ? 'Xong lượt' : 'Đòn kế tiếp ➜'}</button>}
    </div>
  )
}

export function XemDau({ luc, chang, b, onRut, nv }: { luc: LucDiaV; chang: ChangV; b: BangMau3D; onRut: () => void; nv?: NvId }) {
  const tong = chang.so_cau_luot ?? 5
  return <DauView2D luc={luc} chang={chang} b={b} gioi={nv} tong={tong} onRut={onRut}>{(api) => <Cau api={api} tong={tong} onXong={onRut} />}</DauView2D>
}
