// TaHome — shell + trang chủ app TRỢ GIẢNG. REDESIGN 30/08 (khuôn OpsHome) → KHOÁC ÁO BK 07/09 (CEO: "sửa các
// màn còn lại của app TA theo đúng style Của tôi"): nền trời gradient, thanh trên trắng mờ bo tròn, card pastel
// bo 18–20 với icon PNG sẵn có (pr_*), nav đáy icon PNG + pill xanh, khe 4px, tiêu đề font bong bóng.
// · Trang chủ = hero chào (mascot) + box Công việc tháng + box Bổ trợ + MỖI NGHIỆP VỤ 1 BOX (Bài trên lớp /
//   Chấm ET / Chấm BTVN), góc icon có BUBBLE ĐỎ số việc đang nợ. Bấm box → tab list việc. Bấm card → ChamBuoi.
// · Bottom-tab: Hôm nay + 3 nghiệp vụ + Bổ trợ + Của tôi (mỗi tab có bubble nợ).
// Việc = getMyTasks() (CÙNG derive với "Việc của tôi" ERP — 1 nguồn). Badge 📱 = số HS nộp BTVN app.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { getMyTasks, type MyTask } from '../../lib/gami'
import { demNopTheoBuois } from '../../lib/btvnnop'
import { taDashboard, type TaDash } from '../../lib/tadash'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline, nhanConLai } from '../../lib/tuan'
import { kiemTraHoTro, trangThaiNhacViec } from '../../lib/push'
import { NhacViecNutHeader } from '../../components/NhacViecCaiDat'
import { BK_TROI, BKTabHeader, BKRowCard } from '../../components/bk/BKUI'
import ChamBuoi from './ChamBuoi'
import DashTa from './DashTa'
import GopY from './GopY'
import CaBoTroTA, { demNoBoTro } from './CaBoTroTA'
import { viecBoTroCuaToi, type ViecCaBoTro, type ViecRetest } from '../../lib/botro_yeu_ca'

// CEO 06/09: "app TA cũng cần push để không miss việc, giống app pt". Khuôn Y HỆT pt (tin
// chung, không cá nhân hoá theo bài chấm) — chỉ khác GIỜ GỬI (23:30 tối, sau giờ dạy) và app id.
const TA_MO_TA_NHAC = 'nhớ kiểm tra & chấm hết ET/BTVN/bài trên lớp hôm nay nha các tình yêu 💜'

type NvKey = 'ingame' | 'et' | 'btvn'
// 'botro' = ca bổ trợ yếu (PLAN-botro-yeu-ca.md) — nghiệp vụ thứ 4, dữ liệu riêng (fn_btyeu_viec_cua_toi), không qua getMyTasks.
type TabKey = 'home' | NvKey | 'dash' | 'botro'
type ViecBoTro = { ca: ViecCaBoTro[]; retest: ViecRetest[] }
const A = (n: string) => `/bk-ui/${n}.png`
// icon PNG + màu pastel/accent theo nghiệp vụ (bộ icon CEO 07/09; màu hex inline — không ghép class Tailwind động)
export const NGHIEP_VU: { key: NvKey; icon: string; label: string; bg: string; accent: string }[] = [
  { key: 'ingame', icon: A('pr_nguoi'), label: 'Bài trên lớp', bg: '#CFE5FF', accent: '#2F73F6' },
  { key: 'et', icon: A('pr_et'), label: 'Chấm ET', bg: '#E6DDFF', accent: '#8B6BEF' },
  { key: 'btvn', icon: A('pr_btvn'), label: 'Chấm BTVN', bg: '#DDF6E4', accent: '#4DC47A' },
]
const nvOf = (k: NvKey) => NGHIEP_VU.find((n) => n.key === k)!

export type BuoiView = { buoiId: string; tab: NvKey; lop: string; ngay: string }

// Bubble đỏ số việc nợ (kiểu noti) — dùng ở góc icon box + góc icon bottom-tab.
function NoBadge({ n, small }: { n: number; small?: boolean }) {
  if (n <= 0) return null
  return (
    <span className={`absolute flex items-center justify-center rounded-full bg-[#FF5D78] font-bold text-white ring-2 ring-white ${small ? '-right-1.5 -top-1 h-4 min-w-4 px-0.5 text-[9.5px]' : '-right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[11px]'}`}>{n > 99 ? '99+' : n}</span>
  )
}

export default function TaHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const homNay = homNayVN()
  const [tab, setTab] = useState<TabKey>('home')
  const [view, setView] = useState<BuoiView | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [nopCount, setNopCount] = useState<Record<string, number>>({})
  const [now, setNow] = useState(() => Date.now())
  // tóm tắt dashboard tháng cho BOX ở trang chủ (CEO 31/08: dashboard = 1 box riêng cạnh các nghiệp vụ)
  const [dashTom, setDashTom] = useState<TaDash | null>(null)
  const [boTro, setBoTro] = useState<ViecBoTro>({ ca: [], retest: [] })
  const taiBoTro = () => viecBoTroCuaToi().then(setBoTro).catch(() => {})
  const coQuyen = quyen.laAdmin || quyen.chucNang.includes('buoihoc') // cùng leaf với tab chấm bên ERP

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try {
      const all = await getMyTasks().catch(() => [] as MyTask[])
      const t = all.filter((x) => x.tab === 'ingame' || x.tab === 'et' || x.tab === 'btvn')
      setTasks(t)
      const btvnBuois = [...new Set(t.filter((x) => x.tab === 'btvn').map((x) => x.buoiId))]
      setNopCount(btvnBuois.length ? await demNopTheoBuois(btvnBuois).catch(() => ({})) : {})
    } finally { setLoading(false) }
    taDashboard(homNay.slice(0, 7)).then(setDashTom).catch(() => setDashTom(null)) // best-effort, không chặn trang chủ
    taiBoTro()
  }
  useEffect(() => { reload() }, []) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible' && !view) reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [view]) // eslint-disable-line

  if (view) return <ChamBuoi view={view} onBack={() => { setView(null); reload(true) }} />

  const canLam = tasks.filter((t) => !t.done)
  const noCua = (k: NvKey) => canLam.filter((t) => t.tab === k).length

  return (
    <div className="flex h-[100dvh] flex-col" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'home' && <TrangChu profile={profile} homNay={homNay} loading={loading} coQuyen={coQuyen} tasks={tasks} canLam={canLam} noCua={noCua} now={now} onGo={setTab} dashTom={dashTom} boTro={boTro} />}
        {tab === 'dash' && <DashTa profile={profile} />}
        {tab === 'botro' && <CaBoTroTA viec={boTro} onDoi={taiBoTro} />}
        {tab !== 'home' && tab !== 'dash' && tab !== 'botro' && <ViecTab key={tab} nv={nvOf(tab)} tasks={tasks.filter((t) => t.tab === tab)} nopCount={nopCount} now={now} homNay={homNay} onOpen={setView} />}
      </div>

      {/* bottom tab — icon PNG bộ BK, active = pill xanh; mỗi nghiệp vụ có bubble nợ, chừa safe-area */}
      <div className="bg-white/95 shadow-[0_-4px_16px_rgba(22,34,77,.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[1000px]">
          <TabBtn active={tab === 'home'} icon={A('pr_calendar')} label="Hôm nay" no={0} onClick={() => setTab('home')} />
          {NGHIEP_VU.map((n) => (
            <TabBtn key={n.key} active={tab === n.key} icon={n.icon} label={n.label} no={noCua(n.key)} onClick={() => setTab(n.key)} />
          ))}
          <TabBtn active={tab === 'botro'} icon={A('pr_tai_nghe')} label="Bổ trợ" no={demNoBoTro(boTro)} onClick={() => setTab('botro')} />
          <TabBtn active={tab === 'dash'} icon={A('coin_star')} label="Của tôi" no={0} onClick={() => setTab('dash')} />
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, icon, label, no, onClick }: { active: boolean; icon: string; label: string; no: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
      <span className={`relative flex h-7 w-11 items-center justify-center rounded-full transition ${active ? 'bg-[#2F73F6]/12' : ''}`}>
        <img src={icon} alt="" className={`h-6 w-6 object-contain transition ${active ? '' : 'opacity-70 grayscale-[.3]'}`} draggable={false} /><NoBadge n={no} small />
      </span>
      <span className={`text-[10px] font-bold ${active ? 'text-[#2F73F6]' : 'text-[#63709A]'}`}>{label}</span>
    </button>
  )
}

// ── TRANG CHỦ: 1 thẻ hồ sơ (avatar · Chào X · ngày · nợ · chuông/góp ý/thoát) + box tháng + box bổ trợ + 3 box
//    nghiệp vụ (bubble nợ ở góc icon). CEO 07/09: gộp thanh trên + hero, bỏ dòng tên/"BK Trợ giảng" lặp. ──
function TrangChu({ profile, homNay, loading, coQuyen, tasks, canLam, noCua, now, onGo, dashTom, boTro }: {
  profile: MyProfile; homNay: string; loading: boolean; coQuyen: boolean
  tasks: MyTask[]; canLam: MyTask[]; noCua: (k: NvKey) => number; now: number; onGo: (t: TabKey) => void
  dashTom: TaDash | null; boTro: ViecBoTro
}) {
  const tenGoi = (profile.nhanSu.ho_ten ?? '').trim().split(/\s+/).pop() || 'bạn'
  const quaHan = canLam.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
  // Banner gợi ý bật nhắc việc (CEO 06/09) — chỉ khi môi trường hỗ trợ push VÀ máy này chưa bật.
  const [goiYBatNhac, setGoiYBatNhac] = useState(false)
  useEffect(() => {
    if (kiemTraHoTro() !== 'ok') return
    trangThaiNhacViec('ta').then((t) => setGoiYBatNhac(t === 'tat')).catch(() => {})
  }, [])
  return (
    <div>
      <div className="mx-auto flex max-w-[1000px] flex-col gap-1 px-2 pb-4" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        {/* thẻ hồ sơ = avatar viền pastel · Chào X · ngày chữ tay · nợ hôm nay · nút chuông/góp ý/thoát */}
        <div className="relative flex items-center gap-2.5 overflow-hidden rounded-[20px] bg-white/90 px-3 py-2">
          <span className="relative shrink-0">
            {profile.nhanSu.anh_url
              ? <img src={profile.nhanSu.anh_url} alt="" className="block h-12 w-12 rounded-full object-cover ring-[3px] ring-[#DCE6FF]" />
              : <span className="font-bubble flex h-12 w-12 items-center justify-center rounded-full bg-[#DDF4FF] text-[20px] font-extrabold text-[#2F73F6] ring-[3px] ring-[#DCE6FF]">{tenGoi.charAt(0).toUpperCase()}</span>}
            <span className="absolute -left-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] shadow-sm">💗</span>
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-bubble truncate text-[16px] font-extrabold text-[#16224D]">Chào {tenGoi}! 👋</p>
            <p className="font-hand text-[11px] italic text-[#3B62C4]">{thuCuaNgay(homNay)} · {ddmmVN(homNay)}</p>
            {/* CEO 07/09: sạch nợ thì KHÔNG ghi gì; chỉ hiện khi đang nợ / chưa có quyền */}
            {!loading && !coQuyen && <p className="mt-0.5 text-[11.5px] font-semibold text-[#C27A00]">Tài khoản chưa được cấp quyền màn Buổi học</p>}
            {!loading && coQuyen && canLam.length > 0 && <p className="mt-0.5 text-[11.5px] font-semibold text-[#C0355A]">Đang nợ {canLam.length} việc chấm{quaHan ? ` · ${quaHan} quá hạn` : ''}</p>}
          </div>
          {/* Nút chuông = nhắc việc 23:30 (CEO 06/09) — app ta không có tab Cài đặt riêng, gộp vào đây cạnh Góp ý. */}
          <div className="flex shrink-0 items-center gap-0.5">
            <NhacViecNutHeader app="ta" gioNhac="23:30" moTa={TA_MO_TA_NHAC} />
            <GopY route="home" />
            <button onClick={() => supabase.auth.signOut()} className="rounded-full px-1.5 py-1 text-[10.5px] font-semibold text-[#63709A] active:bg-[#EEF3FF]">Thoát</button>
          </div>
        </div>

        {goiYBatNhac && (
          <div className="flex items-center gap-2 rounded-[18px] bg-[#FFF3D6] px-3 py-2">
            <span className="text-[20px]">🔔</span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[12.5px] font-bold text-[#B87800]">Bật nhắc việc 23:30 mỗi tối</p>
              <p className="text-[11px] text-[#B87800]/80">Máy này chưa nhận thông báo — bấm chuông ở thanh trên để bật.</p>
            </div>
          </div>
        )}

        {/* BOX DASHBOARD THÁNG — 1 cái riêng đứng cùng các nghiệp vụ (CEO 31/08) */}
        {!loading && coQuyen && <BoxDashThang d={dashTom} onGo={() => onGo('dash')} />}
        {!loading && coQuyen && <BoxBoTro v={boTro} homNay={homNay} onGo={() => onGo('botro')} />}

        {!loading && coQuyen && NGHIEP_VU.map((n) => {
          const cua = canLam.filter((t) => t.tab === n.key)
          const xong = tasks.filter((t) => t.tab === n.key && t.done).length
          const preview = cua.slice(0, 3)
          return (
            <button key={n.key} onClick={() => onGo(n.key)} className="rounded-[20px] p-2 text-left active:scale-[.99]" style={{ background: n.bg }}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80"><img src={n.icon} alt="" className="h-8 w-8 object-contain" draggable={false} /><NoBadge n={noCua(n.key)} /></span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">{n.label}</p>
                  <p className="text-[11px] text-[#63709A]">
                    {cua.length === 0 ? (xong > 0 ? `✓ Đã xong ${xong} buổi` : 'Không có việc') : `${cua.length} buổi chờ chấm${xong ? ` · ${xong} đã xong` : ''}`}
                  </p>
                </div>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ background: n.accent }}>›</span>
              </div>
              {preview.length > 0 && (
                <div className="mt-1.5 flex flex-col gap-1">
                  {preview.map((t) => <RowMini key={t.buoiId + t.tab} t={t} now={now} homNay={homNay} />)}
                  {cua.length > 3 && <p className="px-1 text-[10.5px] font-semibold text-[#63709A]">+ {cua.length - 3} buổi nữa…</p>}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Box "Bổ trợ yếu" — ca hôm nay của tôi + retest đến hạn (PLAN-botro-yeu-ca.md). Bấm → tab botro.
function BoxBoTro({ v, homNay, onGo }: { v: ViecBoTro; homNay: string; onGo: () => void }) {
  const homNayCa = v.ca.filter((c) => c.ngay === homNay)
  const no = demNoBoTro(v)
  const noCu = v.ca.filter((c) => c.ngay < homNay && !c.danh_gia_xong_at).length
  return (
    <button onClick={onGo} className="rounded-[20px] p-2 text-left active:scale-[.99]" style={{ background: '#E6DDFF' }}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80"><img src={A('pr_tai_nghe')} alt="" className="h-8 w-8 object-contain" draggable={false} /><NoBadge n={no} /></span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">Bổ trợ yếu</p>
          <p className="text-[11px] text-[#63709A]">
            {homNayCa.length === 0 && v.retest.length === 0 && noCu === 0 ? 'Không có ca hôm nay'
              : [homNayCa.length ? `${homNayCa.length} ca hôm nay` : '', noCu ? `${noCu} ca chưa hoàn tất` : '', v.retest.length ? `${v.retest.length} retest đến hạn` : ''].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8B6BEF] text-[13px] font-bold text-white">›</span>
      </div>
      {homNayCa.length > 0 && (
        <div className="mt-1.5 flex flex-col gap-1">
          {homNayCa.slice(0, 3).map((c) => (
            <div key={c.buoi_id} className="flex items-center gap-2 rounded-xl bg-white/80 px-2.5 py-1.5">
              <span className="text-[12.5px] font-bold text-[#16224D]">{c.ho_ten}</span>
              <span className="min-w-0 truncate text-[10.5px] text-[#63709A]">{c.mon}{c.gio_bat_dau ? ` · ${String(c.gio_bat_dau).slice(0, 5)}` : ''}{c.phong ? ` · ${c.phong}` : ''}</span>
              <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.danh_gia_xong_at ? 'bg-[#E4F8EC] text-[#1E8A52]' : c.diem_danh === 'co_mat' ? 'bg-[#EEF3FF] text-[#2F73F6]' : 'bg-[#F1F3F9] text-[#63709A]'}`}>
                {c.danh_gia_xong_at ? 'xong' : c.co_test ? (c.test_da_nop ? 'chờ nhận xét' : 'chờ test') : c.diem_danh === 'co_mat' ? 'đang luyện' : 'chờ em'}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

// Box "Công việc tháng này" trên trang chủ: bar + % đạt chuẩn + hạng + mốc thưởng, bấm → tab Của tôi.
function BoxDashThang({ d, onGo }: { d: TaDash | null; onGo: () => void }) {
  const me = d?.me ?? {}
  const pct = me.pct ?? null
  const moc = !!me.dat_moc_thuong
  const coViec = (me.tong ?? 0) > 0
  const mau = pct === 100 ? '#F8B83E' : (pct ?? 0) >= 80 ? '#31C875' : (pct ?? 0) >= 50 ? '#FFB33D' : '#FF5D78'
  return (
    <button onClick={onGo} className="rounded-[20px] p-2 text-left active:scale-[.99]" style={{ background: moc ? 'linear-gradient(135deg, #FFF1C9, #FFE59A)' : '#FFF1C9' }}>
      <div className="flex items-center gap-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80"><img src={A('pr_chart')} alt="" className="h-8 w-8 object-contain" draggable={false} /></span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-bubble flex flex-wrap items-center gap-1.5 text-[15px] font-extrabold text-[#16224D]">Công việc tháng này
            {d?.rank ? <span className="rounded-full bg-[#2F73F6] px-2 py-0.5 font-sans text-[10.5px] font-bold text-white">#{d.rank}/{d.tongXepHang}</span> : null}
            {moc && <span className="rounded-full bg-[#F8B83E] px-2 py-0.5 font-sans text-[10.5px] font-bold text-white">🎁 mốc thưởng</span>}
          </p>
          <p className="text-[11px] text-[#63709A]">
            {!d ? 'Hiệu suất · xếp hạng · mốc thưởng 100%'
              : !coViec ? 'Tháng này chưa có việc chấm được giao'
              : `Đạt chuẩn ${me.dat ?? 0}/${me.den_han ?? 0} việc đến hạn${(me.khong_dat ?? 0) > 0 ? ` · lỡ ${me.khong_dat}` : ''}`}
          </p>
        </div>
        {coViec && pct != null && <span className="font-bubble text-[20px] font-extrabold" style={{ color: mau }}>{pct}%</span>}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8B83E] text-[13px] font-bold text-white">›</span>
      </div>
      {coViec && (
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/70">
          <div className="h-full rounded-full" style={{ width: `${pct ?? 0}%`, background: mau }} />
        </div>
      )}
    </button>
  )
}

function RowMini({ t, now, homNay }: { t: MyTask; now: number; homNay: string }) {
  const muc = mucDeadline(t.deadline, now)
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-2.5 py-1.5">
      <span className="text-[12.5px] font-bold text-[#16224D]">{t.lop}</span>
      <span className="min-w-0 truncate text-[10.5px] text-[#63709A]">{t.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(t.ngay)} ${ddmmVN(t.ngay)}`}{t.loai ? ` · ${t.loai === 'bu' ? 'buổi bù' : t.loai}` : ''}</span>
      {t.deadline != null && (
        <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${muc === 'qua_han' ? 'bg-[#FFE3EA] text-[#C0355A]' : muc === 'sat' ? 'bg-[#FFF1D6] text-[#C27A00]' : 'bg-[#F1F3F9] text-[#63709A]'}`}>
          {muc === 'qua_han' ? '⚠ quá hạn' : nhanConLai(t.deadline, now)}
        </span>
      )}
    </div>
  )
}

// ── TAB 1 NGHIỆP VỤ: thanh đầu BK + list card việc (nhóm theo ngày) + Đã xong collapse ──
function ViecTab({ nv, tasks, nopCount, now, homNay, onOpen }: {
  nv: (typeof NGHIEP_VU)[number]; tasks: MyTask[]; nopCount: Record<string, number>
  now: number; homNay: string; onOpen: (v: BuoiView) => void
}) {
  const [xemXong, setXemXong] = useState(false)
  const canLam = tasks.filter((t) => !t.done).sort((a, b) => a.ngay.localeCompare(b.ngay) || a.lop.localeCompare(b.lop))
  const daXong = tasks.filter((t) => t.done).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? '')).slice(0, 20)
  const ngays = [...new Set(canLam.map((t) => t.ngay))]
  return (
    <div>
      <BKTabHeader icon={nv.icon} title={nv.label} sub={canLam.length ? `${canLam.length} buổi chờ chấm` : 'Sạch nợ ✓ tuyệt vời!'} />
      <div className="mx-auto flex max-w-[1000px] flex-col gap-1 px-2 pb-4">
        {canLam.length === 0 && (
          <div className="flex items-center gap-2 rounded-[20px] bg-white/80 px-3 py-2">
            <img src={A('mascot_cheer')} alt="" className="h-12 w-12 object-contain" draggable={false} />
            <p className="text-[12.5px] text-[#63709A]">Không có buổi nào chờ chấm 🎉</p>
          </div>
        )}
        {ngays.map((ngay) => (
          <div key={ngay} className="flex flex-col gap-1">
            <p className={`px-1 pt-1 text-[11px] font-bold uppercase tracking-wide ${ngay < homNay ? 'text-[#C0355A]' : 'text-[#63709A]'}`}>
              {ngay < homNay ? '⚠ Còn nợ · ' : ''}{ngay === homNay ? 'Hôm nay · ' : ''}{thuCuaNgay(ngay)} · {ddmmVN(ngay)}
            </p>
            {canLam.filter((t) => t.ngay === ngay).map((t) => {
              const muc = mucDeadline(t.deadline, now)
              const nop = t.tab === 'btvn' ? nopCount[t.buoiId] ?? 0 : 0
              return (
                <BKRowCard key={t.buoiId + t.vai} icon={nv.icon} bg={nv.bg} accent={nv.accent} title={t.lop}
                  onClick={() => onOpen({ buoiId: t.buoiId, tab: nv.key, lop: t.lop, ngay: t.ngay })}
                  sub={<>
                    {t.loai && <span className="rounded-full bg-white/80 px-1.5 py-px font-semibold">{t.loai === 'bu' ? 'buổi bù' : t.loai}</span>}
                    {nop > 0 && <span className="rounded-full bg-white/80 px-1.5 py-px font-bold text-[#1E8A52]">📱 {nop} nộp app</span>}
                    {t.deadline != null && (
                      <span className={muc === 'qua_han' ? 'font-bold text-[#C0355A]' : muc === 'sat' ? 'font-bold text-[#C27A00]' : ''}>
                        {muc === 'qua_han' ? '⚠ quá hạn' : `hạn ${nhanConLai(t.deadline, now)}`}
                      </span>
                    )}
                  </>} />
              )
            })}
          </div>
        ))}

        {daXong.length > 0 && (
          <div className="mt-1">
            <button onClick={() => setXemXong(!xemXong)} className="px-1 text-[12px] font-bold text-[#63709A]">
              {xemXong ? '▾' : '▸'} Đã xong ({daXong.length})
            </button>
            {xemXong && (
              <div className="mt-1 flex flex-col gap-1">
                {daXong.map((t) => (
                  <button key={t.buoiId + 'd'} onClick={() => onOpen({ buoiId: t.buoiId, tab: nv.key, lop: t.lop, ngay: t.ngay })}
                    className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-1.5 text-left">
                    <img src={A('pr_star')} alt="" className="h-4 w-4 object-contain" draggable={false} />
                    <span className="text-[12.5px] font-semibold text-[#63709A]">{t.lop}</span>
                    <span className="ml-auto text-[10.5px] text-[#9AA5C4]">{ddmmVN(t.ngay)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
