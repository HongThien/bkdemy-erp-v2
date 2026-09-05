// SoanWorkspace — TOÀN BỘ màn soạn thảo (sidebar thư mục · thanh tab · hàng cụm · vùng soạn · các modal), dùng ở 2 chỗ:
//   · AppSoan (bundle riêng soan.html): onSave = lưu nháp máy.
//   · SoanModal (trong ERP, mở từ nút ⤢ ở mọi MathTextarea): onSave = trả chuỗi kho về ô đã mở → ô đó nhận nội dung,
//     form ERP bấm Lưu như thường (Thùy 05/09: "soạn xong bấm save là tự lưu vào đúng chỗ mở cái này ra").
// Bố cục (Thùy chốt 04–05/09):
//   TRÁI  = thư mục cụm tới từng CHƯƠNG của từng KHỐI ("Hình 8 · Tứ giác").
//   TRÊN  = THANH TAB 1..10 kiểu MathType của thư mục đang chọn; mỗi tab = 1 hàng cụm; cụm nào hiện ở tab nào / ẩn do người
//           soạn quyết (ô "Hiện ở tab", hoặc KÉO cụm thả vào tab / thả lên cụm khác để sắp thứ tự).
//   DƯỚI  = vùng soạn WYSIWYG: chọn cụm → hiện ngay trong bài; cụm có tên điểm → hỏi đổi tên (bộ điểm nhớ theo bài).
//           KHÔNG có LaTeX ở bất kỳ đâu. Lưu → máy tự dịch chuỗi kho ($…$).
// ⚠ BẢN THỬ: cụm + thư mục ở localStorage (theo origin — ERP và soan.html KHÔNG chung bộ cụm cho tới khi lên DB).
import { useEffect, useMemo, useRef, useState } from 'react'
import { MathText } from '../screens/kho/ui'
import { MathDoc, type DiemMap, type MathDocHandle } from './MathDoc'
import { coDoi } from './diem'
import { CumModal } from './CumModal'
import { ThuMucModal } from './ThuMucModal'
import { NHANH_TEN, TABS, loadCums, loadTabChung, loadThuMucs, makeCum, makeThuMuc, previewRaw, saveCums, saveTabChung, saveThuMucs, sortCum, tabOf, type Cum, type ThuMuc } from './cum'

type Modal = { kind: 'cum'; cum?: Cum; prefill?: Partial<Cum> } | { kind: 'tm'; tm?: ThuMuc }
type Chon = 'all' | 'chung' | string   // string = thuMucId

export type SoanWorkspaceProps = {
  initial: string
  onSave: (raw: string) => void
  onClose?: () => void              // có = đang nhúng trong ERP: hiện nút Đóng, Lưu xong host tự đóng
  title?: string                    // vd "Lời giải · DC000123"
}

export function SoanWorkspace({ initial, onSave, onClose, title }: SoanWorkspaceProps) {
  const [thuMucs, setThuMucs] = useState<ThuMuc[]>(() => loadThuMucs())
  const [cums, setCums] = useState<Cum[]>(() => loadCums(loadThuMucs()))
  const [tabChung, setTabChung] = useState<Record<string, string>>(() => loadTabChung())
  const [chon, setChon] = useState<Chon>(() => thuMucs[0]?.id ?? 'all')
  const [activeTab, setActiveTab] = useState<Record<string, number>>({})     // tab đang mở của từng thư mục
  const [renaming, setRenaming] = useState<{ n: number; text: string } | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)                   // cụm đang kéo
  const [overTab, setOverTab] = useState<number | null>(null)
  const [modal, setModal] = useState<Modal | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)
  const [hasSel, setHasSel] = useState(false)
  const [diemMap, setDiemMap] = useState<DiemMap>({})   // bộ điểm của bài: A→M, B→N… nhớ cho mọi cụm chèn sau
  const doc = useRef<MathDocHandle>(null)

  const persistCums = (l: Cum[]) => { setCums(l); saveCums(l) }
  const persistTm = (l: ThuMuc[]) => { setThuMucs(l); saveThuMucs(l) }
  const save = () => {
    const raw = doc.current?.getValue() ?? ''
    onSave(raw)
    setSavedAt(Date.now()); setDirty(false)
  }
  const close = () => { if (!onClose) return; if (dirty && !confirm('Có thay đổi chưa lưu — đóng và bỏ?')) return; onClose() }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 's') { e.preventDefault(); save() }
    }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }) // không deps: save/dirty đổi theo render
  useEffect(() => { if (!savedAt) return; const t = setTimeout(() => setSavedAt(null), 2500); return () => clearTimeout(t) }, [savedAt])
  // Đang bôi đen trong bài → bật nút "Lưu đoạn chọn → cụm".
  useEffect(() => {
    const h = () => { if (!modal) setHasSel(!!doc.current?.getSelectionRaw()) }
    document.addEventListener('selectionchange', h); return () => document.removeEventListener('selectionchange', h)
  }, [modal])

  const closeModal = () => { setModal(null); setTimeout(() => doc.current?.focus(), 60) }
  const tmChon = thuMucs.find((t) => t.id === chon)
  // Sidebar: gom theo nhánh + khối ("HÌNH 8"), trong nhóm xếp theo tên chương.
  const nhom = useMemo(() => {
    const key = (t: ThuMuc) => `${NHANH_TEN[t.nhanh ?? ''] ?? 'Chung'} ${t.khoi ?? ''}`.trim()
    const m = new Map<string, ThuMuc[]>()
    for (const t of [...thuMucs].sort((a, b) => (a.nhanh ?? '').localeCompare(b.nhanh ?? '') || (a.khoi ?? 0) - (b.khoi ?? 0) || a.ten.localeCompare(b.ten))) {
      const k = key(t); if (!m.has(k)) m.set(k, []); m.get(k)!.push(t)
    }
    return [...m.entries()]
  }, [thuMucs])
  const soCum = (id: string) => cums.filter((c) => c.thuMucId === id).length

  // Thanh tab của thư mục đang chọn (hoặc nhóm Chung).
  const cumCua = chon === 'chung' ? cums.filter((c) => !c.thuMucId) : cums.filter((c) => c.thuMucId === chon)
  const active = activeTab[chon] ?? 1
  const tabTen: Record<string, string> = tmChon ? (tmChon.tabTen ?? {}) : chon === 'chung' ? tabChung : {}
  const setTabTen = (n: number, ten: string) => {
    const next = { ...tabTen }; if (ten.trim()) next[String(n)] = ten.trim(); else delete next[String(n)]
    if (tmChon) persistTm(thuMucs.map((t) => (t.id === tmChon.id ? { ...t, tabTen: next } : t)))
    else if (chon === 'chung') { setTabChung(next); saveTabChung(next) }
  }
  const cumTab = cumCua.filter((c) => tabOf(c) === active).sort(sortCum)
  const soAn = cumCua.filter((c) => tabOf(c) === 0).length

  // Kéo-thả: thả lên cụm khác = chen vào TRƯỚC cụm đó (đánh lại thuTu cả tab); thả lên tab = chuyển sang tab đó (xếp cuối).
  const dropOnCum = (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const list = cumTab.filter((c) => c.id !== dragId)
    const dragged = cums.find((c) => c.id === dragId); if (!dragged) return
    const at = list.findIndex((c) => c.id === targetId); if (at < 0) return
    list.splice(at, 0, { ...dragged, tab: active })
    const order = new Map(list.map((c, i) => [c.id, i]))
    persistCums(cums.map((c) => (order.has(c.id) ? { ...c, tab: active, thuTu: order.get(c.id) } : c)))
  }
  const dropOnTab = (n: number) => {
    if (!dragId) return
    const max = cumCua.filter((c) => tabOf(c) === n).reduce((m, c) => Math.max(m, c.thuTu ?? -1), -1)
    persistCums(cums.map((c) => (c.id === dragId ? { ...c, tab: n, thuTu: max + 1 } : c)))
    setActiveTab((m) => ({ ...m, [chon]: n }))
  }

  const Chip = ({ c, showTm }: { c: Cum; showTm?: boolean }) => (
    <span className={`cum ${c.loai === 'doan' ? 'cum--doan' : ''} ${dragId === c.id ? 'cum--drag' : ''}`}
      title={`${c.ten}${c.goTat ? ` · gõ "${c.goTat}" rồi Space` : ''}${c.phim ? ` · ${c.phim}` : ''}${tabOf(c) === 0 ? ' · ẩn khỏi thanh' : ''}`}
      onMouseDown={(e) => { if (!(e.target as HTMLElement).closest('.cum-grip')) e.preventDefault() }} onClick={() => doc.current?.useCum(c)}
      onDragOver={(e) => { if (dragId) e.preventDefault() }} onDrop={(e) => { e.preventDefault(); dropOnCum(c.id); setDragId(null) }}>
      {!showTm && <span className="cum-grip" draggable title="Kéo để sắp xếp / thả vào tab khác"
        onDragStart={(e) => { e.dataTransfer.setData('text/plain', c.id); e.dataTransfer.effectAllowed = 'move'; setDragId(c.id) }}
        onDragEnd={() => { setDragId(null); setOverTab(null) }}>⠿</span>}
      <span className="cum-ten">{c.ten}</span>
      <span className="cum-f"><MathText>{previewRaw(c)}</MathText></span>
      {c.goTat && <kbd className="cum-key">{c.goTat}␣</kbd>}
      {c.phim && <kbd className="cum-key">{c.phim}</kbd>}
      {showTm && <span className="cum-key">{thuMucs.find((t) => t.id === c.thuMucId)?.ten ?? 'Chung'}{tabOf(c) === 0 ? ' · ẩn' : ` · tab ${tabOf(c)}`}</span>}
      <button type="button" className="cum-x" title="Sửa cụm" onClick={(e) => { e.stopPropagation(); setModal({ kind: 'cum', cum: c }) }}>✎</button>
      <button type="button" className="cum-x" title="Xoá cụm" onClick={(e) => { e.stopPropagation(); if (confirm(`Xoá cụm «${c.ten}»?`)) persistCums(cums.filter((x) => x.id !== c.id)) }}>×</button>
    </span>
  )

  return (
    <div className="flex h-full min-h-0 bg-slate-100">
      {/* Trái: thư mục = chương của khối */}
      <aside className="side">
        <div className="side-top">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Thư mục</span>
          <button type="button" onClick={() => setModal({ kind: 'tm' })} className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700" title="Thêm chương">＋</button>
        </div>
        <button type="button" onClick={() => setChon('all')} className={`side-item ${chon === 'all' ? 'side-item--on' : ''}`}>Tất cả cụm <span className="side-n">{cums.length}</span></button>
        <button type="button" onClick={() => setChon('chung')} className={`side-item ${chon === 'chung' ? 'side-item--on' : ''}`}>Chung (không thư mục) <span className="side-n">{cums.filter((c) => !c.thuMucId).length}</span></button>
        {nhom.map(([k, list]) => (
          <div key={k}>
            <div className="side-h">{k}</div>
            {list.map((t) => (
              <div key={t.id} className={`side-item group ${chon === t.id ? 'side-item--on' : ''}`} onClick={() => setChon(t.id)} role="button" tabIndex={0}>
                <span className="min-w-0 flex-1 truncate">{t.ten}</span>
                <span className="side-n">{soCum(t.id)}</span>
                <button type="button" className="cum-x hidden group-hover:inline" title="Sửa thư mục" onClick={(e) => { e.stopPropagation(); setModal({ kind: 'tm', tm: t }) }}>✎</button>
                <button type="button" className="cum-x hidden group-hover:inline" title="Xoá thư mục (cụm bên trong chuyển về Chung)" onClick={(e) => {
                  e.stopPropagation()
                  if (!confirm(`Xoá thư mục «${t.ten}»? ${soCum(t.id)} cụm bên trong sẽ chuyển về Chung.`)) return
                  persistCums(cums.map((c) => (c.thuMucId === t.id ? { ...c, thuMucId: undefined, nhanh: undefined } : c)))
                  persistTm(thuMucs.filter((x) => x.id !== t.id))
                  if (chon === t.id) setChon('all')
                }}>×</button>
              </div>
            ))}
          </div>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5 py-2">
          <h1 className="text-[14px] font-semibold text-slate-800">{title ?? 'Soạn thảo công thức'}</h1>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">Toán</span>
          {tmChon && <span className="text-[12px] text-slate-500">· {NHANH_TEN[tmChon.nhanh ?? ''] ?? 'Chung'} {tmChon.khoi ?? ''} · <b className="text-slate-700">{tmChon.ten}</b></span>}
          {coDoi(diemMap) && (
            <span className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-[11.5px] text-indigo-800" title="Bộ điểm của bài — cụm chèn sau tự điền theo bảng này">
              Bộ điểm: {Object.entries(diemMap).filter(([k, v]) => v && v !== k).map(([k, v]) => `${k}→${v}`).join(' · ')}
              <button type="button" className="cum-x" title="Xoá bộ điểm (quay về tên gốc)" onClick={() => setDiemMap({})}>×</button>
            </span>
          )}
          <span className="ml-auto text-[12px] text-slate-400">
            {savedAt ? <span className="font-medium text-emerald-600">✓ Đã lưu</span> : dirty ? 'Có thay đổi chưa lưu' : ''}
          </span>
          <button type="button" disabled={!hasSel} onMouseDown={(e) => e.preventDefault()} title="Bôi đen 1 đoạn trong bài rồi bấm — thành cụm đoạn văn + công thức"
            onClick={() => { const raw = doc.current?.getSelectionRaw(); if (raw) setModal({ kind: 'cum', prefill: { loai: 'doan', noiDung: raw, thuMucId: tmChon?.id, tab: active } }) }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">Lưu đoạn chọn → cụm</button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setModal({ kind: 'cum', prefill: { thuMucId: tmChon?.id, tab: chon === 'all' ? 1 : active } })} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-700">＋ Cụm mới</button>
          {onClose && <button type="button" onClick={close} className="rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Đóng</button>}
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={save} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500" title="Ctrl+S">Lưu</button>
        </header>

        {/* Thanh tab 1..10 + hàng cụm của tab đang mở */}
        <section className="shrink-0 border-b border-slate-200 bg-white px-5 pb-2 pt-1.5">
          {chon !== 'all' && (
            <div className="tabbar">
              {TABS.map((n) => {
                const so = cumCua.filter((c) => tabOf(c) === n).length
                const ten = tabTen[String(n)]
                if (renaming?.n === n) return (
                  <input key={n} autoFocus value={renaming.text} onChange={(e) => setRenaming({ n, text: e.target.value })}
                    onBlur={() => { setTabTen(n, renaming.text); setRenaming(null) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setTabTen(n, renaming.text); setRenaming(null) } if (e.key === 'Escape') setRenaming(null) }}
                    className="tab tab--edit" placeholder={`Tên tab ${n}`} />
                )
                return (
                  <button key={n} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setActiveTab((m) => ({ ...m, [chon]: n }))}
                    onDoubleClick={() => setRenaming({ n, text: ten ?? '' })} title={`Tab ${n}${ten ? ` · ${ten}` : ''} · ${so} cụm · double-click để đặt tên · thả cụm vào đây để chuyển tab`}
                    onDragOver={(e) => { if (dragId) { e.preventDefault(); setOverTab(n) } }} onDragLeave={() => setOverTab((o) => (o === n ? null : o))}
                    onDrop={(e) => { e.preventDefault(); dropOnTab(n); setDragId(null); setOverTab(null) }}
                    className={`tab ${active === n ? 'tab--on' : ''} ${so === 0 ? 'tab--empty' : ''} ${overTab === n ? 'tab--over' : ''}`}>
                    <span className="tab-n">{n}</span>{ten && <span className="tab-ten">{ten}</span>}{so > 0 && <span className="tab-so">{so}</span>}
                  </button>
                )
              })}
              <button type="button" className="cum-x ml-1" title="Đặt tên tab đang mở" onClick={() => setRenaming({ n: active, text: tabTen[String(active)] ?? '' })}>✎</button>
              {soAn > 0 && <button type="button" className="ml-auto text-[11px] text-slate-400 hover:text-indigo-700" title="Xem trong «Tất cả cụm»" onClick={() => setChon('all')}>{soAn} cụm ẩn khỏi thanh</button>}
            </div>
          )}
          <div className="flex max-h-[22vh] flex-wrap gap-1.5 overflow-y-auto pt-1.5">
            {chon === 'all'
              ? (cums.length === 0 ? <span className="py-1 text-[12px] text-slate-400">Chưa có cụm nào.</span> : [...cums].sort(sortCum).map((c) => <Chip key={c.id} c={c} showTm />))
              : cumTab.length > 0 ? cumTab.map((c) => <Chip key={c.id} c={c} />)
              : <span className="basis-full py-1 text-[12px] text-slate-400">Tab {active}{tabTen[String(active)] ? ` · ${tabTen[String(active)]}` : ''} chưa có cụm — «＋ Cụm mới» sẽ vào tab này, hoặc kéo ⠿ một cụm thả vào tab.</span>}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Click cụm để chèn tại con trỏ · gõ tắt rồi <b>Space</b> · gõ <b>$</b> hoặc <b>Ctrl+M</b> mở bảng dựng công thức · click vào công thức trong bài để sửa · kéo <b>⠿</b> để sắp xếp / đổi tab · <b>Ctrl+Z</b> hoàn tác
          </p>
        </section>

        {/* Vùng soạn */}
        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="mx-auto min-h-full w-full max-w-[920px] rounded-xl border border-slate-200 bg-white px-10 py-8 shadow-sm">
            <MathDoc ref={doc} initial={initial} cums={cums} placeholder="Gõ lời giải ở đây…" className="min-h-[60vh]" onChange={() => setDirty(true)}
              diemMap={diemMap} onDiemMap={setDiemMap} />
          </div>
        </main>
      </div>

      {modal?.kind === 'cum' && (
        <CumModal initial={modal.cum} prefill={modal.prefill} cums={cums} thuMucs={thuMucs} tabTenChung={tabChung} onCancel={closeModal}
          onSave={(c) => {
            const cur = modal.cum
            persistCums(cur ? cums.map((x) => (x.id === cur.id ? { ...x, ...c } : x)) : [...cums, makeCum(c)])
            closeModal()
          }} />
      )}
      {modal?.kind === 'tm' && (
        <ThuMucModal initial={modal.tm} onCancel={closeModal}
          onSave={(t) => {
            const cur = modal.tm
            if (cur) persistTm(thuMucs.map((x) => (x.id === cur.id ? { ...x, ...t } : x)))
            else { const n = makeThuMuc(t); persistTm([...thuMucs, n]); setChon(n.id) }
            closeModal()
          }} />
      )}
    </div>
  )
}
