import type { User } from '../types'
import { vaisOf } from '../store/useStore'

export default function PersonalCard({ user }: { user: User }) {
  return (
    <div className="mb-4 rounded-lg border bg-white p-3">
      <div className="flex items-center gap-2">
        <div className="size-8 shrink-0 rounded-full bg-slate-200" />
        <div className="leading-tight">
          <div className="text-sm font-semibold">{user.ten}</div>
          <div className="text-[11px] text-slate-500">{vaisOf(user).join(' · ')}</div>
        </div>
      </div>
      <div className="mt-2 rounded border border-dashed py-1.5 text-center text-[10px] text-slate-400">
        {/* gami slot */}gami / work-tracking (sau)
      </div>
    </div>
  )
}
