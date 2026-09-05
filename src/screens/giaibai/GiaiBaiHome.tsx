// GiaiBaiHome — shell tool giải bài (web máy bàn): thanh trên = tên tool · chọn MÔN · 4 tab (Kho bài · Bài của tôi ·
// Duyệt [chỉ học thuật] · Thống kê) · người dùng. Badge "đang giữ N/3" + "chờ duyệt N" đọc từ DB mỗi lần có thay đổi.
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { GiaiBaiScope } from '../../AppGiaiBai'
import { listCuaToi, listChoDuyet, nhanhCuaMon } from '../../lib/giaibai'
import KhoBai from './KhoBai'
import BaiCuaToi from './BaiCuaToi'
import DuyetBai from './DuyetBai'
import ThongKe from './ThongKe'

type Tab = 'kho' | 'toi' | 'duyet' | 'thongke'
const readMon = (mons: string[]) => { const m = localStorage.getItem('giaibai.mon'); return m && mons.includes(m) ? m : mons[0] }

export default function GiaiBaiHome({ scope }: { scope: GiaiBaiScope }) {
  const me = scope.profile.nhanSu.id
  const [mon, setMon] = useState(() => readMon(scope.mons))
  const [tab, setTab] = useState<Tab>('kho')
  const [dangGiu, setDangGiu] = useState(0)
  const [choDuyet, setChoDuyet] = useState(0)
  const laNguoiDuyet = scope.monDuyet.includes(mon)
  useEffect(() => { localStorage.setItem('giaibai.mon', mon) }, [mon])
  useEffect(() => { if (tab === 'duyet' && !laNguoiDuyet) setTab('kho') }, [laNguoiDuyet, tab])

  // Badge = đếm item đang render của list DB trả về (không tính nghiệp vụ ở client).
  const taiBadge = useCallback(() => {
    listCuaToi(me).then((rs) => setDangGiu(rs.filter((r) => r.dang_giu && (r.trang_thai === 'dang_giai' || r.trang_thai === 'can_sua')).length)).catch(() => {})
    if (laNguoiDuyet) listChoDuyet(nhanhCuaMon(mon)).then((rs) => setChoDuyet(rs.length)).catch(() => {}); else setChoDuyet(0)
  }, [me, mon, laNguoiDuyet])
  useEffect(() => { taiBadge() }, [taiBadge, tab])

  const tabs: { key: Tab; label: string; badge?: number; hide?: boolean }[] = [
    { key: 'kho', label: '📚 Kho bài' },
    { key: 'toi', label: '✍️ Bài của tôi', badge: dangGiu },
    { key: 'duyet', label: '✅ Duyệt', badge: choDuyet, hide: !laNguoiDuyet },
    { key: 'thongke', label: '🏆 Thống kê' },
  ]

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-extrabold tracking-tight text-indigo-700">BK Giải bài</span>
          <span className="text-[11px] text-slate-400">kho chung</span>
        </div>
        {scope.mons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {scope.mons.map((m) => (
              <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m}</button>
            ))}
          </div>
        )}
        {scope.mons.length === 1 && <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-700">{mon}</span>}
        <nav className="flex items-center gap-1">
          {tabs.filter((t) => !t.hide).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative rounded-full px-3.5 py-1 text-[13px] font-medium transition ${tab === t.key ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
              {t.label}
              {!!t.badge && <span className={`ml-1.5 rounded-full px-1.5 text-[10px] font-bold ${tab === t.key ? 'bg-white/20 text-white' : t.key === 'duyet' ? 'bg-amber-400 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{t.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-[12px] text-slate-500">
          <span>{scope.profile.nhanSu.ho_ten}{laNguoiDuyet ? ' · học thuật' : ''}</span>
          <button onClick={() => supabase.auth.signOut()} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 hover:bg-slate-50">Đăng xuất</button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === 'kho' && <KhoBai key={mon} mon={mon} me={me} dangGiu={dangGiu} onChanged={taiBadge} />}
        {tab === 'toi' && <BaiCuaToi me={me} onChanged={taiBadge} />}
        {tab === 'duyet' && laNguoiDuyet && <DuyetBai key={mon} mon={mon} me={me} onChanged={taiBadge} />}
        {tab === 'thongke' && <ThongKe />}
      </div>
    </div>
  )
}
