// Thanh chọn trang kiểu web thường (Thùy 23/10): « ‹ 1 2 3 … 49 50 › » + ô "Đến trang". Trang đếm từ 0 trong code, hiện từ 1.
// Dùng chung cho các màn duyệt chia trang 20 câu (Duyệt câu · Bản đồ mới › Duyệt kho).
import { useState } from 'react'

/** Các số trang cần hiện: đầu, cuối, quanh trang đang mở; null = dấu "…". */
function dsSo(trang: number, soTrang: number): (number | null)[] {
  const giu = new Set([0, soTrang - 1, trang - 2, trang - 1, trang, trang + 1, trang + 2].filter((x) => x >= 0 && x < soTrang))
  const ra: (number | null)[] = []
  let truoc = -1
  for (const x of [...giu].sort((a, b) => a - b)) {
    if (x - truoc === 2) ra.push(x - 1)        // hở đúng 1 số thì hiện luôn số đó, không dùng "…"
    else if (x - truoc > 2) ra.push(null)
    ra.push(x); truoc = x
  }
  return ra
}

export default function PhanTrang({ trang, soTrang, onChon, tong, coTrang }: {
  trang: number; soTrang: number; onChon: (t: number) => void
  tong?: number; coTrang?: number   // để hiện "câu 21–40 / 1000"
}) {
  const [go, setGo] = useState('')
  if (soTrang <= 1) return null
  const nut = (t: number, nhan: string, tat: boolean, title?: string) => (
    <button key={nhan + t} onClick={() => onChon(t)} disabled={tat} title={title}
      className="min-w-[30px] rounded-md px-2 py-1 text-[12.5px] font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-35">{nhan}</button>
  )
  const den = () => { const n = parseInt(go, 10); if (n >= 1 && n <= soTrang) onChon(n - 1); setGo('') }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {nut(0, '«', trang === 0, 'Trang đầu')}
      {nut(trang - 1, '‹', trang === 0, 'Trang trước')}
      {dsSo(trang, soTrang).map((x, i) => x === null
        ? <span key={'h' + i} className="px-1 text-[12.5px] text-slate-400">…</span>
        : <button key={x} onClick={() => onChon(x)}
            className={`min-w-[30px] rounded-md px-2 py-1 text-[12.5px] font-medium ring-1 ${x === trang ? 'bg-slate-800 text-white ring-slate-800' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'}`}>{x + 1}</button>)}
      {nut(trang + 1, '›', trang >= soTrang - 1, 'Trang sau')}
      {nut(soTrang - 1, '»', trang >= soTrang - 1, 'Trang cuối')}
      <span className="ml-2 flex items-center gap-1 text-[12px] text-slate-500">
        Đến trang
        <input value={go} onChange={(e) => setGo(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter') den() }}
          onBlur={() => go && den()} inputMode="numeric" placeholder={String(trang + 1)}
          className="w-12 rounded-md border border-slate-300 px-1.5 py-0.5 text-center text-[12.5px]" />
        / {soTrang}
      </span>
      {tong !== undefined && coTrang !== undefined && (
        <span className="ml-2 text-[12px] text-slate-400">câu {trang * coTrang + 1}–{Math.min((trang + 1) * coTrang, tong)} / {tong}</span>
      )}
    </div>
  )
}
