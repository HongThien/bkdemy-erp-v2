import type { User } from '../types'
import { useStore } from '../store/useStore'

// Thẻ cá nhân = NGƯỜI THẬT đang đăng nhập (getMyProfile). KHÔNG fallback persona mock —
// account chưa nối hồ sơ NS thì nói thẳng, KHÔNG hiện "Lộc" (mock cũ gây hiểu nhầm).
export default function PersonalCard({ user: _user }: { user: User }) {
  const me = useStore((s) => s.me)
  const quyen = useStore((s) => s.quyen)

  const ten = me?.nhanSu.ho_ten ?? 'Chưa gắn hồ sơ nhân sự'
  const anh = me?.nhanSu.anh_url ?? null
  const maNS = me?.nhanSu.ma_ns ?? null
  const phu = me
    ? (me.viTris.map((v) => v.ten || v.team_ten).join(' · ') || me.teams.map((t) => t.ten).join(' · ') || 'Chưa gắn vị trí')
    : 'Liên hệ admin để gắn tài khoản với nhân sự'

  return (
    <div className="mb-4 rounded-lg border bg-white p-3">
      <div className="flex items-center gap-2">
        {anh ? <img src={anh} alt="" className="size-8 shrink-0 rounded-full object-cover" />
             : <div className="size-8 shrink-0 rounded-full bg-slate-200" />}
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <span className="truncate">{ten}</span>
            {quyen?.laAdmin && <span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-medium text-amber-700">Founder</span>}
          </div>
          <div className="truncate text-[11px] text-slate-500">{maNS ? `${maNS} · ` : ''}{phu}</div>
        </div>
      </div>
      <div className="mt-2 rounded border border-dashed py-1.5 text-center text-[10px] text-slate-400">
        {/* gami slot */}gami / work-tracking (sau)
      </div>
    </div>
  )
}
