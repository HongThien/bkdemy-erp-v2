// Bảng ĐỔI TÊN ĐIỂM hiện lúc DÙNG cụm có tên điểm: mỗi điểm 1 ô (nạp sẵn theo bộ điểm đang nhớ của bài),
// preview sống đúng như sẽ chèn. Enter = chèn · Tab = điểm kế · Esc = huỷ · "Giữ nguyên" = chèn không đổi.
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { MathText } from '../screens/kho/ui'
import { doiDiem } from './diem'

type Props = {
  ten: string
  raw: string                          // chuỗi kho gốc của cụm
  diem: string[]                       // điểm tìm thấy (theo thứ tự)
  initialMap: Record<string, string>   // bộ điểm đang nhớ trong bài
  onCommit: (raw: string, map: Record<string, string>) => void
  onCancel: () => void
}

export function DoiDiemModal({ ten, raw, diem, initialMap, onCommit, onCancel }: Props) {
  const [map, setMap] = useState<Record<string, string>>(() => Object.fromEntries(diem.map((d) => [d, initialMap[d] ?? d])))
  const preview = useMemo(() => doiDiem(raw, map), [raw, map])
  const commit = () => onCommit(preview, map)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onCancel() }
    if (e.key === 'Enter') { e.preventDefault(); commit() }
  }
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/35 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-[720px] max-w-full rounded-2xl border border-slate-200 bg-white shadow-2xl" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
          <h2 className="text-[14px] font-semibold text-slate-800">Đổi tên điểm <span className="font-normal text-slate-400">— {ten}</span></h2>
          <span className="ml-auto text-[11px] text-slate-400"><b className="text-slate-500">Enter</b> chèn · <b className="text-slate-500">Tab</b> điểm kế · <b className="text-slate-500">Esc</b> huỷ</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-3">
          {diem.map((d, i) => (
            <label key={d} className="flex items-center gap-1.5 text-[14px] text-slate-700">
              <span className="w-5 text-right font-mono font-semibold text-slate-500">{d}</span>
              <span className="text-slate-300">→</span>
              <input autoFocus={i === 0} value={map[d]} onFocus={(e) => e.target.select()} onChange={(e) => setMap((m) => ({ ...m, [d]: e.target.value }))}
                className={`h-8 w-14 rounded-md border px-2 text-center font-mono text-[14px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${map[d] && map[d] !== d ? 'border-indigo-400 bg-indigo-50 text-indigo-800' : 'border-slate-300'}`} />
            </label>
          ))}
        </div>
        <div className="mx-4 mb-3 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-[15px] leading-relaxed text-slate-800">
          <MathText>{preview}</MathText>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-2.5">
          <span className="text-[11px] text-slate-400">Bộ điểm được nhớ cho cả bài — cụm sau tự điền sẵn.</span>
          <button type="button" onClick={onCancel} className="ml-auto rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button type="button" onClick={() => onCommit(raw, Object.fromEntries(diem.map((d) => [d, d])))} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700">Giữ nguyên</button>
          <button type="button" onClick={commit} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">Chèn</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
