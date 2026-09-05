// Bảng DỰNG công thức của tool soạn — "y như MathType": bảng ký hiệu/cấu trúc (click hoặc phím), ô nhập MathLive
// (nhìn thấy công thức, KHÔNG thấy LaTeX), preview đúng như lúc in. Chèn/sửa 1 công thức (Enter = chèn, Esc = huỷ,
// Tab = ô trống kế). CumModal (tạo/sửa cụm) bọc lại bảng này và nhét form vào `children`.
// Cấu hình MathLive dùng chung với ERP: lib/math/mathfield.ts (một nguồn).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { MathfieldElement } from 'mathlive'
import { MathText } from '../screens/kho/ui'
import { MATH_TABS, MATH_TEMPLATES, toPreview, type MathTab } from '../lib/math/templates'
import { KEY_BLOCK, insertLatexInto, readClean, setupMathField, tabNext } from '../lib/math/mathfield'
import { comboFromEvent } from '../lib/math/phimtat'
import { findCumByCombo, previewRaw, type Cum } from './cum'

type Tab = MathTab | 'cum'

export type MathBuilderProps = {
  title: string
  initial: string                    // LaTeX nạp sẵn (có thể chứa #? → thành ô trống, con trỏ nhảy vào ô đầu)
  cums: Cum[]                        // để tab "Cụm" + phím tắt cụm dùng được ngay trong bảng dựng
  commitLabel?: string
  onCommit: (latex: string) => void
  onCancel: () => void
  children?: ReactNode               // form thêm (CumModal nhét ô tên/gõ tắt/phím ở đây)
  canCommit?: () => string | null    // trả lỗi (chuỗi) nếu chưa được lưu; null = OK
}

export function MathBuilder({ title, initial, cums, commitLabel = 'Chèn', onCommit, onCancel, children, canCommit }: MathBuilderProps) {
  const mfRef = useRef<MathfieldElement | null>(null)
  const [latex, setLatex] = useState('')
  const [tab, setTab] = useState<Tab>('cau_truc')
  const [err, setErr] = useState<string | null>(null)
  const cumsRef = useRef(cums); cumsRef.current = cums

  useEffect(() => {
    const mf = mfRef.current; if (!mf) return
    const off = setupMathField(mf, '', () => setLatex(mf.getValue('latex')))
    if (initial) { insertLatexInto(mf, initial); setLatex(mf.getValue('latex')) }
    // Có form (CumModal: ô tên autoFocus) thì KHÔNG giành focus — đã dính: chữ gõ tên cụm rơi hết vào ô toán.
    if (!children) mf.focus()
    return off
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const insert = (l: string, textMode = false) => {
    const mf = mfRef.current; if (!mf) return
    insertLatexInto(mf, l, { textMode }); setLatex(mf.getValue('latex')); mf.focus()
  }
  const commit = () => {
    const mf = mfRef.current; if (!mf) return
    const clean = readClean(mf)
    if (clean == null) { setErr('Công thức đang trống.'); return }
    const e = canCommit?.() ?? null
    if (e) { setErr(e); return }
    onCommit(clean)
  }
  const inMf = () => { const mf = mfRef.current; const a = document.activeElement; return !!mf && (a === mf || mf.contains(a)) }
  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); return }
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); commit(); return }
    if (!inMf()) return                                     // đang ở ô tên/gõ tắt… → Tab/phím thường đi bình thường
    if (e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); if (mfRef.current) tabNext(mfRef.current, e.shiftKey); return }
    if (KEY_BLOCK.has(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); e.stopPropagation(); return }
    const combo = comboFromEvent(e)
    if (combo) {
      const c = findCumByCombo(cumsRef.current, combo)
      if (c && c.loai === 'cong_thuc') { e.preventDefault(); e.stopPropagation(); insert(c.noiDung) }
    }
  }
  const stop = (e: React.SyntheticEvent) => e.stopPropagation()
  const noFocusSteal = (e: React.MouseEvent) => e.preventDefault()
  const cumCongThuc = cums.filter((c) => c.loai === 'cong_thuc')

  return createPortal(
    // data-modal + target===currentTarget: modal này có thể LỒNG trong CumModal (đoạn) — sự kiện React bubble qua portal
    // lên shell ngoài, nên shell ngoài phải nhận ra "đang ở trong bảng dựng" để không tự đóng.
    <div data-modal="builder" className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-[760px] max-w-full rounded-2xl border border-slate-200 bg-white shadow-2xl" onKeyDownCapture={onKeyDownCapture} onMouseDown={stop} onClick={stop}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
          <h2 className="text-[14px] font-semibold text-slate-800">{title}</h2>
          <span className="ml-auto text-[11px] text-slate-400">click ký hiệu · <b className="text-slate-500">Tab</b> ô kế · <b className="text-slate-500">Enter</b> {commitLabel.toLowerCase()} · <b className="text-slate-500">Esc</b> huỷ</span>
        </div>
        {children && <div className="border-b border-slate-100 px-4 py-2.5">{children}</div>}
        {/* Bảng ký hiệu */}
        <div className="flex items-center gap-1 px-3 pt-2">
          {MATH_TABS.map((t) => (
            <button key={t.id} type="button" tabIndex={-1} onMouseDown={noFocusSteal} onClick={() => setTab(t.id)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-semibold ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{t.ten}</button>
          ))}
          <button type="button" tabIndex={-1} onMouseDown={noFocusSteal} onClick={() => setTab('cum')}
            className={`rounded-md px-2.5 py-1 text-[12px] font-semibold ${tab === 'cum' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Cụm của tôi</button>
        </div>
        <div className="flex max-h-[176px] flex-wrap content-start gap-1 overflow-y-auto px-3 py-2">
          {tab === 'cum'
            ? (cumCongThuc.length === 0 ? <span className="px-1 py-2 text-[12px] text-slate-400">Chưa có cụm công thức nào — tạo ở bảng phía trên màn soạn.</span>
              : cumCongThuc.map((c) => (
                <button key={c.id} type="button" tabIndex={-1} title={c.ten + (c.phim ? ` — ${c.phim}` : '')} onMouseDown={noFocusSteal} onClick={() => insert(c.noiDung)}
                  className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-[14px] text-slate-800 hover:border-indigo-400 hover:bg-indigo-50">
                  <span className="text-[11.5px] font-medium text-slate-500">{c.ten}</span>
                  <MathText>{previewRaw(c)}</MathText>
                </button>
              )))
            : MATH_TEMPLATES.filter((t) => t.tab === tab).map((t) => (
              <button key={t.id} type="button" tabIndex={-1} title={t.ten} onMouseDown={noFocusSteal} onClick={() => insert(t.latex, t.tab === 'van_ban')}
                className="flex h-10 min-w-[44px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-[14px] text-slate-800 hover:border-indigo-400 hover:bg-indigo-50">
                <MathText>{`$${toPreview(t)}$`}</MathText>
              </button>
            ))}
        </div>
        {/* Ô nhập + preview */}
        <div className="px-4 pb-2">
          <math-field ref={mfRef} />
          <div className="mt-1.5 min-h-[38px] rounded-md border border-dashed border-slate-200 bg-slate-50 px-2.5 py-1 text-[17px] text-slate-800">
            {latex.trim() ? <MathText>{`$${latex}$`}</MathText> : <span className="text-[12px] text-slate-400">Preview — hiện đúng như khi in</span>}
          </div>
          {err && <p className="mt-1 text-[12px] text-rose-600">{err}</p>}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-2.5">
          <button type="button" onMouseDown={noFocusSteal} onClick={onCancel} className="ml-auto rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button type="button" onMouseDown={noFocusSteal} onClick={commit} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">{commitLabel}</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
