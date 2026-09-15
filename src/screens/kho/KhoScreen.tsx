import { Fragment, useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { useStore } from '../../store/useStore'
import { useMonScope } from '../../hooks/useMonScope'
import BanDo from './BanDo'
import SearchCau from './SearchCau'
import KhoRac from './KhoRac'
import { daiBranch, hinhBranch, hinhGiaiTichBranch, khtnBranch } from './branches'
import KhoHinhScreen from './hinh/KhoHinhScreen'

type Tab = 'dai' | 'hinh' | 'hinhgt'
type Mon = 'toan' | 'khtn'
// Map môn-kho ↔ nhãn MON_LIST (nhan_su_mon lưu nhãn 'Toán'/'KHTN'). Kho mới hỗ trợ 2 môn này.
const MON_TABS: { key: Mon; label: string }[] = [{ key: 'toan', label: 'Toán' }, { key: 'khtn', label: 'KHTN' }]

// Nhớ màn hình gần nhất (preference cá nhân → localStorage, không phải data dùng chung)
const readKhoi = () => {
  const k = localStorage.getItem('kho.khoi')
  return k && (KHOI_OPTIONS as readonly string[]).includes(k) ? k : DEFAULT_KHOI
}
const readTab = () => {
  const v = localStorage.getItem('kho.tab')
  return (v === 'hinh' || v === 'hinhgt' ? v : 'dai') as Tab
}
const readMon = () => (localStorage.getItem('kho.mon') === 'khtn' ? 'khtn' : 'toan') as Mon

export default function KhoScreen() {
  const [mon, setMon] = useState<Mon>(readMon)
  const [tab, setTab] = useState<Tab>(readTab)
  const [khoi, setKhoi] = useState<string>(readKhoi)
  useEffect(() => { localStorage.setItem('kho.khoi', khoi) }, [khoi])
  useEffect(() => { localStorage.setItem('kho.tab', tab) }, [tab])
  useEffect(() => { localStorage.setItem('kho.mon', mon) }, [mon])
  // môn KHTN = 1 cây (không nhánh Đại/Hình); Toán = nhánh tab → branch.
  const config = mon === 'khtn' ? khtnBranch : tab === 'dai' ? daiBranch : tab === 'hinhgt' ? hinhGiaiTichBranch : hinhBranch
  const [timCau, setTimCau] = useState(false)
  const [rac, setRac] = useState(false)   // kho rác — câu đã xoá, vẫn resolve được cho tài liệu cũ

  // Scope④ THEO MÔN (dùng chung useMonScope — xem lib/mon.ts): admin + Ops thấy tất; người khác chỉ thấy
  // môn được phân (nhan_su_mon). Chưa gán → không thấy môn nào.
  const me = useStore((s) => s.me)
  const { allowedMons, isAll } = useMonScope()
  const allowed = MON_TABS.filter((t) => isAll || allowedMons.includes(t.label)).map((t) => t.key)
  // Nếu môn đang chọn không được phép → nhảy về môn đầu tiên được phép.
  useEffect(() => { if (allowed.length && !allowed.includes(mon)) setMon(allowed[0]) }, [allowed.join(','), mon])
  const profileLoading = !isAll && me === null  // chưa load hồ sơ → chưa biết môn

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      {/* Thanh đầu */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-900">Bản đồ kiến thức</span>
        </div>
        {/* Bộ chọn MÔN — chỉ hiện môn được phân (admin thấy tất). 1 môn → vẫn hiện để rõ ngữ cảnh */}
        {allowed.length > 0 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {MON_TABS.filter((t) => allowed.includes(t.key)).map((t) => (
              <TabBtn key={t.key} active={mon === t.key} onClick={() => setMon(t.key)}>{t.label}</TabBtn>
            ))}
          </div>
        )}
        {/* Tab nhánh (chỉ Toán) — segmented */}
        {mon === 'toan' && allowed.includes('toan') && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            <TabBtn active={tab === 'dai'} onClick={() => setTab('dai')}>Đại số</TabBtn>
            <TabBtn active={tab === 'hinh'} onClick={() => setTab('hinh')}>Hình học</TabBtn>
            <TabBtn active={tab === 'hinhgt'} onClick={() => setTab('hinhgt')}>Hình giải tích</TabBtn>
          </div>
        )}
        {allowed.length > 0 && !profileLoading && <>
        {/* Tìm câu (chỉ nhánh có câu: Đại/KHTN) */}
        {config.cauTbl && (
          <button onClick={() => setTimCau(true)}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">
            🔍 Tìm câu
          </button>
        )}
        {config.cauTbl && (
          <button onClick={() => setRac(true)} title="Câu đã xoá khỏi kho — vẫn giữ để tài liệu cũ in đủ câu"
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-rose-300 hover:text-rose-700">
            🗑 Kho rác
          </button>
        )}
        {/* Khối */}
        <div className={`${config.cauTbl ? '' : 'ml-auto '}flex items-center gap-1`}>
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          {KHOI_OPTIONS.map((k) => {
            const tc = k.endsWith('T') // Tăng cường (CLC)
            const active = khoi === k
            return (
              <Fragment key={k}>
                {k === '6' && <span className="mx-1 h-5 w-px self-center bg-slate-200" />}
                <button onClick={() => setKhoi(k)}
                  title={tc ? `Khối ${k[0]} Tăng cường (CLC)` : `Khối ${k}`}
                  className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${
                    active
                      ? tc ? 'bg-violet-600 text-white shadow-sm' : 'bg-indigo-600 text-white shadow-sm'
                      : tc ? 'text-violet-600 hover:bg-violet-50' : 'text-slate-500 hover:bg-slate-100'
                  }`}>{k}</button>
              </Fragment>
            )
          })}
        </div>
        </>}
      </div>

      <div className="min-h-0 flex-1">
        {profileLoading ? <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải hồ sơ…</div>
          : allowed.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-2 text-3xl">📚</div>
                <div className="text-[15px] font-semibold text-slate-800">Bạn chưa được phân môn</div>
                <p className="mt-1.5 text-[13px] text-slate-500">Tài khoản chưa gắn môn nào nên không xem được kho. Liên hệ quản trị để được phân môn (màn <b>Nhân sự</b> → sửa → Môn phụ trách).</p>
              </div>
            </div>
          ) : mon === 'toan' && tab === 'hinh'
            // Nhánh HÌNH = model RIÊNG (spec-kho-hinh-v3): 4 tầng họ mô hình → lưới mô hình →
            // lưới bài toán nhỏ → kho bài. KHÔNG dùng chung component bản đồ 3-tầng của Đại/KHTN.
            // Đi THEO KHỐI như Đại — `key={khoi}` để remount, reset state sạch khi đổi khối.
            ? <KhoHinhScreen key={`hinh-${khoi}`} khoi={khoi} />
            : <BanDo key={`${config.key}-${khoi}`} config={config} khoi={khoi} />}
      </div>

      {timCau && config.cauTbl && allowed.length > 0 && <SearchCau cauTbl={config.cauTbl} onClose={() => setTimCau(false)} />}
      {rac && config.cauTbl && allowed.length > 0 && <KhoRac cauTbl={config.cauTbl} onClose={() => setRac(false)} />}
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm font-medium transition ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}>{children}</button>
  )
}
