import type { User } from '../types'
import { useStore, adminNavForUser } from '../store/useStore'
import { adminLeaves } from '../mock/fixtures'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'
import KhoScreen from './kho/KhoScreen'
import TaiLieuScreen from './tailieu/TaiLieuScreen'
import NhanSuScreen from './nhansu/NhanSuScreen'
import OrgChartScreen from './nhansu/OrgChartScreen'
import LopScreen from './nhansu/LopScreen'
import HocSinhScreen from './nhansu/HocSinhScreen'

export default function AdminScreen({ user }: { user: User }) {
  const { adminLeaf, setAdminLeaf } = useStore()
  const groups = adminNavForUser(user)
  const leaf = adminLeaves.find((l) => l.id === adminLeaf)

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)] grid-cols-[240px_1fr] overflow-hidden">
      <aside className="min-h-0 overflow-auto border-r bg-white/60 p-3">
        <PersonalCard user={user} />
        <NavTree groups={groups} selected={adminLeaf} onSelect={setAdminLeaf} />
      </aside>
      {adminLeaf === 'bdkt' ? (
        <KhoScreen />
      ) : adminLeaf === 'lamtailieu' ? (
        <TaiLieuScreen />
      ) : adminLeaf === 'ns' ? (
        <NhanSuScreen />
      ) : adminLeaf === 'orgchart' ? (
        <OrgChartScreen />
      ) : adminLeaf === 'lop' ? (
        <LopScreen />
      ) : adminLeaf === 'hs' ? (
        <HocSinhScreen />
      ) : (
      <section className="min-h-0 overflow-auto p-8">
        <h2 className="mb-1 text-sm font-semibold">{leaf?.ten ?? 'Admin'}</h2>
        <p className="text-xs text-slate-400">
          Nhóm: {leaf?.nhom}. {leaf?.nhom === 'Quan hệ'
            ? 'P3: view cấu trúc (orgchart / phân công / TKB) — hiện xung đột & chỗ trống.'
            : leaf?.nhom === 'Dashboard'
              ? 'P2: container widget + filter cơ sở/thời gian.'
              : 'P2: bảng + form sửa.'}
        </p>
        <div className="mt-4 rounded-lg border border-dashed bg-white/50 py-16 text-center text-sm text-slate-400">
          nội dung "{leaf?.ten}" (dựng ở P2/P3)
        </div>
      </section>
      )}
    </div>
  )
}
