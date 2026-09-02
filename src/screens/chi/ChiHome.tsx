// ChiHome — shell app BK Chi (bottom-tab: Khoản chi · [Duyệt — chỉ người có lá thuchi] · Tài khoản).
// Touch-first, nền sáng kiểu iPhone, font Be Vietnam Pro (load ở chi.html). Class màu literal (Tailwind JIT).
import { useCallback, useEffect, useState } from 'react'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { getBankCuaToi, tongQuan, type BankInfo } from '../../lib/thuchi'
import KhoanChi from './KhoanChi'
import DuyetChi from './DuyetChi'
import TaiKhoanBank from './TaiKhoanBank'

type TabKey = 'khoan' | 'duyet' | 'taikhoan'
const TABS: { key: TabKey; leaf: string | null; icon: string; label: string; pill: string; text: string }[] = [
  { key: 'khoan', leaf: null, icon: '🧾', label: 'Khoản chi', pill: 'bg-teal-100', text: 'text-teal-700' },
  { key: 'duyet', leaf: 'thuchi', icon: '✅', label: 'Duyệt', pill: 'bg-emerald-100', text: 'text-emerald-700' },
  { key: 'taikhoan', leaf: null, icon: '🏦', label: 'Tài khoản', pill: 'bg-indigo-100', text: 'text-indigo-600' },
]

export default function ChiHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const coQuyen = (leaf: string | null) => !leaf || quyen.laAdmin || quyen.chucNang.includes(leaf)
  const tabs = TABS.filter((t) => coQuyen(t.leaf))
  const laKeToan = coQuyen('thuchi')
  // Kế toán mở app là để duyệt → vào thẳng tab Duyệt.
  const [tab, setTab] = useState<TabKey>(laKeToan ? 'duyet' : 'khoan')
  const [bank, setBank] = useState<BankInfo | null>(null)
  const [choDuyet, setChoDuyet] = useState(0)
  const nsId = profile.nhanSu.id
  const taiBank = useCallback(() => { getBankCuaToi(nsId).then(setBank).catch(() => setBank(null)) }, [nsId])
  const taiBadge = useCallback(() => { if (laKeToan) tongQuan().then((t) => setChoDuyet(t.cho_duyet)).catch(() => {}) }, [laKeToan])
  useEffect(() => { taiBank(); taiBadge() }, [taiBank, taiBadge, tab])
  const thieuStk = bank !== null && !bank.bank_stk

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'khoan' && <KhoanChi profile={profile} thieuStk={thieuStk} onKhaiStk={() => setTab('taikhoan')} />}
        {tab === 'duyet' && laKeToan && <DuyetChi onDoi={taiBadge} />}
        {tab === 'taikhoan' && <TaiKhoanBank profile={profile} bank={bank} onSaved={taiBank} />}
      </div>
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[760px]">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
              <span className={`relative rounded-full px-3.5 py-0.5 text-[17px] leading-[24px] transition ${tab === t.key ? t.pill : ''}`}>
                {t.icon}
                {t.key === 'taikhoan' && thieuStk && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
                {t.key === 'duyet' && choDuyet > 0 && <span className="absolute -right-2 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-4 text-white ring-2 ring-white">{choDuyet}</span>}
              </span>
              <span className={`text-[10px] font-semibold ${tab === t.key ? t.text : 'text-slate-400'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
