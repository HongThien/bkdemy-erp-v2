import { useEffect, useState } from 'react'
import type { User } from '../types'
import { useStore, staffNavFromScope } from '../store/useStore'
import { getMyScope, type MyScope } from '../lib/nhansu'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'

const ROLE_LBL: Record<string, string> = { gv: 'GV', tg: 'Trợ giảng', ops: 'OPS' }

// "Việc của tôi" — PHẠM VI THẬT từ getMyScope. Hàng đợi việc tự động (điểm danh/chấm ET…)
// chờ lớp Vận hành (engine pure-derive) — chưa dựng → placeholder thật, KHÔNG bịa task mock.
function VietCuaToi({ scope }: { scope: MyScope | null }) {
  if (!scope) return <div className="text-sm text-slate-400">Tài khoản chưa gắn nhân sự — chưa có phạm vi việc.</div>
  const { trucTiep, opsToanHe, giamSatTrucTiep } = scope
  return (
    <div className="mx-auto max-w-[900px]">
      <h2 className="mb-1 text-sm font-semibold">Việc của tôi</h2>
      <p className="mb-4 text-xs text-slate-400">Phạm vi việc derive từ phân công + vị trí của bạn.</p>

      <div className="mb-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-[13px] text-slate-500">
        Hàng đợi việc tự động (điểm danh · chấm ET · đánh giá…) sẽ hiện ở đây khi <b>lớp Vận hành</b> chạy — engine đang dựng.
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">Lớp tôi phụ trách</div>
        {trucTiep.length === 0 ? (
          <p className="text-[13px] text-slate-400">Chưa được phân công lớp nào.{opsToanHe ? '' : ''}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trucTiep.map((sl) => (
              <span key={sl.lop_id + sl.work_role} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px]">
                <b className="text-slate-700">{sl.ten_lop}</b> <span className="text-slate-400">· {sl.mon} · {ROLE_LBL[sl.work_role]}</span>
              </span>
            ))}
          </div>
        )}
        {opsToanHe && <p className="mt-3 text-[12px] text-indigo-600">OPS — điểm danh / xếp bù áp <b>toàn hệ</b>.</p>}
        {giamSatTrucTiep.length > 0 && <p className="mt-2 text-[12px] text-slate-500">Giám sát trực tiếp: <b>{giamSatTrucTiep.length}</b> người dưới quyền.</p>}
      </div>
    </div>
  )
}

export default function NhanSuHome({ user: _user }: { user: User }) {
  const { staffLeaf, setStaffLeaf } = useStore()
  const [scope, setScope] = useState<MyScope | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getMyScope().then(setScope).finally(() => setLoading(false)) }, [])

  const groups = staffNavFromScope(scope)
  const isClass = staffLeaf.startsWith('tc:') && staffLeaf.split(':').length === 3
  const [, , lop] = staffLeaf.split(':')

  return (
    <div className="grid min-h-[calc(100vh-49px)] grid-cols-[240px_1fr]">
      <aside className="border-r bg-white/60 p-3">
        <PersonalCard user={_user} />
        <NavTree groups={groups} selected={staffLeaf} onSelect={setStaffLeaf} />
      </aside>
      <section className="p-8">
        {loading ? (
          <p className="text-sm text-slate-400">Đang tải phạm vi việc…</p>
        ) : staffLeaf === 'viec' ? (
          <VietCuaToi scope={scope} />
        ) : isClass ? (
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-1 text-sm font-semibold">Lớp {lop}</h2>
            <p className="text-xs text-slate-400">Bản ghi đã làm của lớp này sẽ hiện khi lớp Vận hành chạy (đang dựng).</p>
          </div>
        ) : (
          <div className="text-sm text-slate-400">Chọn một lớp trong cây bên trái.</div>
        )}
      </section>
    </div>
  )
}
