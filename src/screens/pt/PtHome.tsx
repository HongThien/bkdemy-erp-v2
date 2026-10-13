// PtHome — shell app PHÁT TRIỂN (làm lại 14/10 cùng hệ task mới — Thùy: "app phát triển phải sửa, tính sau",
// đây là bản TỐI THIỂU để app vẫn chạy được trên hệ mới; thiết kế lại giao diện di động để sau).
//   📋 Task  = đúng màn BẢNG TASK của ERP (giaoviec/BangTaskScreen): Cả team / Của tôi / Tôi giao, giao task,
//              cập nhật, báo xong, đánh giá (duyệt / gia hạn / huỷ).
//   🔔 Cài đặt = bật/tắt nhắc việc (Web Push 10:30) + thoát.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { PtGate } from '../../AppPt'
import { listTaskBang } from '../../lib/taskPt'
import { setAppBadgeCount } from '../../lib/appBadge'
import { NhacViecCard } from '../../components/NhacViecCaiDat'
import { useStore } from '../../store/useStore'
import BangTaskScreen from '../giaoviec/BangTaskScreen'

type TabKey = 'task' | 'caidat'

export default function PtHome({ gate }: { gate: PtGate }) {
  const { profile, quyen } = gate
  const [tab, setTab] = useState<TabKey>('task')
  const [soViec, setSoViec] = useState(0)

  // BangTaskScreen đọc "tôi" từ store chung — app PT là bundle riêng nên nạp hồ sơ + quyền vào store lúc vào.
  useEffect(() => { useStore.setState({ me: profile, quyen }) }, [profile, quyen])

  // Số trên icon app = task tôi làm đã ĐẾN HẠN + task tôi giao đang chờ tôi đánh giá (đếm item đang có, DB đã tính sẵn cờ).
  useEffect(() => {
    const meId = profile.nhanSu.id
    listTaskBang().then((r) => {
      const n = r.filter((t) => (t.nguoi_lam_id === meId && t.den_han) || (t.nguoi_giao_id === meId && (t.den_han || t.trang_thai === 'cho_duyet'))).length
      setSoViec(n); setAppBadgeCount(n)
    }).catch(() => { /* chưa tải được thì giữ nguyên số cũ */ })
  }, [profile.nhanSu.id, tab])

  const ten = (profile.nhanSu.ho_ten ?? '').trim()
  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="border-b border-slate-200/60 bg-white px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-[1000px] items-center gap-2.5">
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13.5px] font-bold text-slate-800">{ten}</p>
            <p className="text-[11px] text-slate-400">Task phát triển</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 active:bg-slate-100">Thoát</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === 'task' && <BangTaskScreen nhung />}
        {tab === 'caidat' && (
          <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
            <NhacViecCard app="pt" gioNhac="10:30" moTa="nhắc cả team cập nhật / đánh giá task đến hạn." />
            <button onClick={() => supabase.auth.signOut()} className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13.5px] font-medium text-slate-600 active:bg-slate-100">Đăng xuất</button>
          </div>
        )}
      </div>
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[1000px]">
          {([['task', '📋', 'Task', soViec], ['caidat', '🔔', 'Cài đặt', 0]] as [TabKey, string, string, number][]).map(([k, icon, label, n]) => (
            <button key={k} onClick={() => setTab(k)} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
              <span className={`relative rounded-full px-3.5 py-0.5 text-[17px] leading-[24px] ${tab === k ? 'bg-violet-100' : ''}`}>
                {icon}
                {n > 0 && <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[10px] font-bold text-white">{n}</span>}
              </span>
              <span className={`text-[10px] font-semibold ${tab === k ? 'text-violet-700' : 'text-slate-400'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
