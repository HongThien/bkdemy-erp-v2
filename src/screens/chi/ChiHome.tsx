// ChiHome — shell app BK Chi (bottom-tab: Khoản chi · Tài khoản). Touch-first, nền sáng kiểu iPhone,
// font Be Vietnam Pro (load ở chi.html). Tông teal (tiền/hoàn ứng) — class màu literal (Tailwind JIT).
import { useCallback, useEffect, useState } from 'react'
import type { MyProfile } from '../../lib/nhansu'
import { getBankCuaToi, type BankInfo } from '../../lib/thuchi'
import KhoanChi from './KhoanChi'
import TaiKhoanBank from './TaiKhoanBank'

type TabKey = 'khoan' | 'taikhoan'
const TABS: { key: TabKey; icon: string; label: string; pill: string; text: string }[] = [
  { key: 'khoan', icon: '🧾', label: 'Khoản chi', pill: 'bg-teal-100', text: 'text-teal-700' },
  { key: 'taikhoan', icon: '🏦', label: 'Tài khoản', pill: 'bg-indigo-100', text: 'text-indigo-600' },
]

export default function ChiHome({ profile }: { profile: MyProfile }) {
  const [tab, setTab] = useState<TabKey>('khoan')
  const [bank, setBank] = useState<BankInfo | null>(null)
  const nsId = profile.nhanSu.id
  const taiBank = useCallback(() => { getBankCuaToi(nsId).then(setBank).catch(() => setBank(null)) }, [nsId])
  useEffect(() => { taiBank() }, [taiBank])
  const thieuStk = bank !== null && !bank.bank_stk

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'khoan' && <KhoanChi profile={profile} thieuStk={thieuStk} onKhaiStk={() => setTab('taikhoan')} />}
        {tab === 'taikhoan' && <TaiKhoanBank profile={profile} bank={bank} onSaved={taiBank} />}
      </div>
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[760px]">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
              <span className={`relative rounded-full px-3.5 py-0.5 text-[17px] leading-[24px] transition ${tab === t.key ? t.pill : ''}`}>
                {t.icon}
                {t.key === 'taikhoan' && thieuStk && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
              </span>
              <span className={`text-[10px] font-semibold ${tab === t.key ? t.text : 'text-slate-400'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
