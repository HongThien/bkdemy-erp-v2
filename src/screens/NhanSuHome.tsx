import { useEffect, useState } from 'react'
import type { User, OpTask } from '../types'
import { useStore, staffNavForUser } from '../store/useStore'
import { worktypesByVai } from '../mock/fixtures'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'
import QueueHome from '../components/QueueHome'
import ChamETSheet from '../components/ChamETSheet'

type Rec = { lop: string; buoi: string; wt: string }
type Sheet = { title: string; lop: string }

const wtTenOf = (key: string) =>
  Object.values(worktypesByVai).flat().find((w) => w?.key === key)?.ten ?? key

// Click lớp → các card "đã làm" của lớp đó
function TraCuuRecords({ leafId, onOpen }: { leafId: string; onOpen: (r: Rec) => void }) {
  const [, wtKey, lop] = leafId.split(':')
  const wt = wtTenOf(wtKey)
  const buoiList = ['18/06', '16/06', '11/06', '09/06', '04/06', '02/06']
  return (
    <div className="mx-auto max-w-[1120px]">
      <h2 className="mb-1 text-sm font-semibold">{wt} · lớp {lop}</h2>
      <p className="mb-4 text-xs text-slate-400">Bản ghi đã làm — click để mở &amp; sửa (giống lúc làm).</p>
      <div className="grid grid-cols-3 gap-3">
        {buoiList.map((buoi) => (
          <button
            key={buoi}
            onClick={() => onOpen({ lop, buoi, wt })}
            className="rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:shadow"
          >
            <div className="text-sm">{wt} · {lop}</div>
            <div className="mt-1 text-xs text-slate-400">buổi {buoi} · đã làm 15/15</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Popup vỏ cho việc nhẹ / loại chưa có surface riêng
function OpPopup({ t, onClose }: { t: OpTask; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t.nhan}</h3>
          <button onClick={onClose} className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-100">✕ Esc</button>
        </div>
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-slate-400">
          Surface việc nhẹ ({t.loai}) — popup (P1)
        </div>
      </div>
    </div>
  )
}

export default function NhanSuHome({ user }: { user: User }) {
  const { staffLeaf, setStaffLeaf } = useStore()
  const groups = staffNavForUser(user)
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const [popup, setPopup] = useState<OpTask | null>(null)

  const openOp = (t: OpTask) => {
    if (t.loai === 'cham_et') setSheet({ title: `Chấm ET · ${t.nhan}`, lop: t.lop ?? '6A1' })
    else setPopup(t)
  }
  const openRec = (r: Rec) => {
    if (r.wt === 'Chấm ET') setSheet({ title: `Sửa · ${r.wt} · ${r.lop} · buổi ${r.buoi}`, lop: r.lop })
    else setPopup({ id: 'edit', vai: 'TA', coSo: 'CS1', loai: 'danh_gia', nhan: `Sửa · ${r.wt} · ${r.lop} · buổi ${r.buoi}`, deadline: '', trangThai: 'moi', surface: 'popup' })
  }

  useEffect(() => {
    if (!popup) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setPopup(null)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [popup])

  const isClass = staffLeaf.startsWith('tc:') && staffLeaf.split(':').length === 3

  return (
    <div className="grid min-h-[calc(100vh-49px)] grid-cols-[240px_1fr]">
      <aside className="border-r bg-white/60 p-3">
        <PersonalCard user={user} />
        <NavTree groups={groups} selected={staffLeaf} onSelect={setStaffLeaf} />
      </aside>
      <section className="p-8">
        {staffLeaf === 'viec' ? (
          <QueueHome user={user} onOpenOp={openOp} />
        ) : isClass ? (
          <TraCuuRecords leafId={staffLeaf} onOpen={openRec} />
        ) : (
          <div className="text-sm text-slate-400">Chọn một lớp trong cây bên trái.</div>
        )}
      </section>

      {sheet && <ChamETSheet title={sheet.title} lop={sheet.lop} onClose={() => setSheet(null)} />}
      {popup && <OpPopup t={popup} onClose={() => setPopup(null)} />}
    </div>
  )
}
