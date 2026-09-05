// Tạo / sửa 1 CỤM dùng sẵn. 2 loại (Thùy 05/09):
//   · Công thức → bảng dựng MathBuilder (MathLive) + form.
//   · Đoạn văn + công thức (bổ đề con) → ô soạn MathDoc thu nhỏ + form; Ctrl+Enter lưu (Enter = xuống dòng).
// Form chung: loại · tên · gõ tắt · phím tắt (bắt tổ hợp, chặn trùng/dành riêng) · thư mục (chương của khối).
// Mở từ: nút "＋ Cụm mới" · ✎ trên chip · "Lưu đoạn chọn → cụm" (prefill loai='doan' + nội dung bôi đen).
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COMBO_RESERVED, comboFromEvent } from '../lib/math/phimtat'
import { MathBuilder } from './MathBuilder'
import { MathDoc, type MathDocHandle } from './MathDoc'
import { TABS, findCumByCombo, tenThuMuc, type Cum, type LoaiCum, type ThuMuc } from './cum'

const inp = 'w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
const lbl = 'flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500'

type Props = {
  initial?: Cum                       // sửa cụm có sẵn
  prefill?: Partial<Cum>              // tạo mới có nạp sẵn (từ đoạn bôi đen / thư mục đang chọn)
  cums: Cum[]
  thuMucs: ThuMuc[]
  tabTenChung: Record<string, string>   // tên tab của nhóm Chung
  onSave: (c: Omit<Cum, 'id' | 'created'>) => void
  onCancel: () => void
}

export function CumModal({ initial, prefill, cums, thuMucs, tabTenChung, onSave, onCancel }: Props) {
  const base = initial ?? prefill ?? {}
  const [loai, setLoai] = useState<LoaiCum>(base.loai ?? 'cong_thuc')
  const [ten, setTen] = useState(base.ten ?? '')
  const [goTat, setGoTat] = useState(base.goTat ?? '')
  const [phim, setPhim] = useState(base.phim ?? '')
  const [thuMucId, setThuMucId] = useState(base.thuMucId ?? '')
  const [tab, setTab] = useState<number>(base.tab ?? 1)
  const [phimErr, setPhimErr] = useState<string | null>(null)
  const [phimFocus, setPhimFocus] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const docRef = useRef<MathDocHandle>(null)
  const st = useRef({ ten, goTat, phim, thuMucId, tab }); st.current = { ten, goTat, phim, thuMucId, tab }
  const tabTen = thuMucId ? (thuMucs.find((t) => t.id === thuMucId)?.tabTen ?? {}) : tabTenChung

  const onPhimKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') return
    e.preventDefault(); e.stopPropagation()
    if (e.key === 'Backspace' || e.key === 'Delete') { setPhim(''); setPhimErr(null); return }
    const combo = comboFromEvent(e)
    if (!combo) { if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) setPhimErr('Cần kèm Ctrl / Alt (hoặc phím F1–F12)'); return }
    if (COMBO_RESERVED[combo]) { setPhimErr(`${combo} dành riêng (${COMBO_RESERVED[combo]})`); return }
    const dup = findCumByCombo(cums, combo)
    if (dup && dup.id !== initial?.id) { setPhimErr(`${combo} đã gán cho «${dup.ten}»`); return }
    setPhim(combo); setPhimErr(null)
  }
  const validate = (): string | null => {
    const s = st.current
    if (!s.ten.trim()) return 'Cụm cần có tên (hiện bên trái trong bảng).'
    const gt = s.goTat.trim()
    if (gt && /\s/.test(gt)) return 'Gõ tắt không được chứa khoảng trắng.'
    const dupGt = gt && cums.find((c) => c.goTat && c.goTat.toLowerCase() === gt.toLowerCase() && c.id !== initial?.id)
    if (dupGt) return `Gõ tắt «${gt}» đã dùng cho «${dupGt.ten}».`
    return null
  }
  const save = (noiDung: string) => {
    const s = st.current
    const tm = thuMucs.find((t) => t.id === s.thuMucId)
    onSave({ ten: s.ten.trim(), loai, noiDung, goTat: s.goTat.trim() || undefined, phim: s.phim || undefined, mon: 'Toán', nhanh: tm?.nhanh, thuMucId: tm?.id, tab: s.tab })
  }

  const fields = (
    <>
      <div className="grid grid-cols-[auto_1.3fr_0.7fr_0.9fr_1.1fr_0.9fr] gap-3">
        <div className={lbl}>Loại
          <div className="flex h-[34px] rounded-md bg-slate-100 p-0.5">
            {([['cong_thuc', 'Công thức'], ['doan', 'Đoạn văn + CT']] as [LoaiCum, string][]).map(([id, t]) => (
              <button key={id} type="button" tabIndex={-1} onClick={() => setLoai(id)} className={`rounded px-2.5 text-[12px] font-medium normal-case tracking-normal transition ${loai === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
            ))}
          </div>
        </div>
        <label className={lbl}>Tên cụm
          <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} placeholder="vd: Tam giác bằng nhau" className={inp} />
        </label>
        <label className={lbl}>Gõ tắt
          <input value={goTat} onChange={(e) => setGoTat(e.target.value)} placeholder="vd: tgbn" className={`${inp} font-mono`} title="Gõ chữ này rồi Space trong bài → thay bằng cụm" />
        </label>
        <div className={lbl}>Phím tắt
          <div tabIndex={0} role="button" onFocus={() => setPhimFocus(true)} onBlur={() => setPhimFocus(false)} onKeyDown={onPhimKey}
            className={`flex h-[34px] items-center justify-center rounded-md border px-2 font-mono text-[12px] normal-case tracking-normal outline-none ${
              phimFocus ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20' : phim ? 'border-slate-300 bg-white text-slate-800' : 'border-dashed border-slate-300 text-slate-400'}`}>
            {phimFocus ? (phim || 'bấm tổ hợp…') : (phim || 'chưa gán')}
          </div>
          {phimErr && <span className="text-[11px] font-normal normal-case tracking-normal text-rose-600">{phimErr}</span>}
        </div>
        <label className={lbl}>Thư mục
          <select value={thuMucId} onChange={(e) => setThuMucId(e.target.value)} className={inp}>
            <option value="">Chung (mọi thư mục)</option>
            {thuMucs.map((t) => <option key={t.id} value={t.id}>{tenThuMuc(t)}</option>)}
          </select>
        </label>
        <label className={lbl} title="Ô trên thanh tab của thư mục (kiểu MathType). Ẩn = không chiếm chỗ trên thanh, vẫn dùng được bằng gõ tắt / phím tắt.">Hiện ở tab
          <select value={tab} onChange={(e) => setTab(Number(e.target.value))} className={inp}>
            <option value={0}>Ẩn khỏi thanh</option>
            {TABS.map((n) => <option key={n} value={n}>{n}{tabTen[String(n)] ? ` · ${tabTen[String(n)]}` : ''}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        {loai === 'cong_thuc'
          ? 'Chỗ cần điền (tên điểm, số…) → dùng ô trống: chọn mẫu có ô xám ở bảng bên dưới. Cụm có ô trống khi chèn sẽ hỏi điền trước.'
          : 'Soạn cả đoạn như trong bài: chữ gõ thẳng, gõ $ hoặc Ctrl+M để chèn công thức. Khi dùng, cả đoạn được chèn nguyên vào bài.'}
      </p>
    </>
  )

  if (loai === 'cong_thuc') {
    return (
      <MathBuilder title={initial ? 'Sửa cụm' : 'Tạo công thức mới'} initial={initial?.loai === 'cong_thuc' ? initial.noiDung : (prefill?.loai === 'cong_thuc' ? prefill.noiDung ?? '' : '')}
        cums={cums} commitLabel="Lưu cụm" onCancel={onCancel} canCommit={validate} onCommit={save}>
        {fields}
      </MathBuilder>
    )
  }

  const saveDoan = () => {
    const raw = (docRef.current?.getValue() ?? '').trim()
    if (!raw) { setErr('Đoạn đang trống.'); return }
    const e = validate(); if (e) { setErr(e); return }
    save(raw)
  }
  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    // Bảng dựng công thức lồng bên trong (chèn CT vào đoạn) tự xử lý phím của nó — đừng đóng nhầm cả modal cụm.
    if ((e.target as HTMLElement).closest?.('[data-modal="builder"]')) return
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); return }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); e.stopPropagation(); saveDoan() }
  }
  const stop = (e: React.SyntheticEvent) => e.stopPropagation()
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-[860px] max-w-full rounded-2xl border border-slate-200 bg-white shadow-2xl" onKeyDownCapture={onKeyDownCapture} onMouseDown={stop} onClick={stop}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
          <h2 className="text-[14px] font-semibold text-slate-800">{initial ? 'Sửa cụm' : 'Tạo cụm đoạn văn + công thức'}</h2>
          <span className="ml-auto text-[11px] text-slate-400"><b className="text-slate-500">Ctrl+Enter</b> lưu · <b className="text-slate-500">Esc</b> huỷ</span>
        </div>
        <div className="border-b border-slate-100 px-4 py-2.5">{fields}</div>
        <div className="px-4 py-3">
          <div className="rounded-lg border border-slate-300 px-4 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <MathDoc ref={docRef} initial={initial?.loai === 'doan' ? initial.noiDung : (prefill?.loai === 'doan' ? prefill.noiDung ?? '' : '')} cums={cums} className="rm-doc--cum" placeholder="Gõ cả đoạn ở đây…" />
          </div>
          {err && <p className="mt-1 text-[12px] text-rose-600">{err}</p>}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-2.5">
          <button type="button" onClick={onCancel} className="ml-auto rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button type="button" onClick={saveDoan} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">Lưu cụm</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
