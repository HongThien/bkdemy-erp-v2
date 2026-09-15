// Lưới lớp → lưới HS → form khảo sát (spec-khao-sat-hs.md §1 luồng TA). Dùng chung PWA iPad (AppKhaoSat) + tab ERP.
// TA chọn lớp BK → lưới avatar/tên HS (đã làm thì mờ + ✓) → đưa iPad cho HS bấm tên mình. Lớp 3–5: TA bấm hộ
// (toggle, mặc định bật theo khối ≤5) — cùng form, chỉ khác người bấm. Làm lại cùng đợt bị chặn (DB unique).
import { useEffect, useMemo, useState } from 'react'
import { lopTienDo, luoiLop, danhSachGoiY, DOT_HIEN_TAI, type LopTienDo, type HsLuoi, type DanhSach } from '../../lib/khaosat'
import KhaoSatForm from './KhaoSatForm'

const FONT = "'Baloo 2', 'Be Vietnam Pro', system-ui, sans-serif"
const NEN = 'linear-gradient(180deg, #DDF3FF 0%, #EEF6FF 45%, #FFF4E5 100%)'
// khối "4T"/"5T" → số 4/5 để quyết định mặc định "TA bấm hộ" (lớp 3–5).
const khoiSo = (k: string | null) => Number((k ?? '').replace(/\D/g, '')) || 99
const thuTuKhoi = (k: string | null) => khoiSo(k) * 10 + ((k ?? '').includes('T') ? 1 : 0)

function Avatar({ hs, size = 64 }: { hs: HsLuoi; size?: number }) {
  const chu = hs.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'
  const bg = hs.gioi_tinh === 'nu' ? 'linear-gradient(135deg,#FF8FB1,#FF5D78)' : 'linear-gradient(135deg,#6FB6FF,#2F73F6)'
  return hs.anh_url
    ? <img src={hs.anh_url} alt="" style={{ width: size, height: size }} className="rounded-full border-4 border-white object-cover shadow-md" />
    : <span style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }} className="flex items-center justify-center rounded-full border-4 border-white font-extrabold text-white shadow-md">{chu}</span>
}

export default function KhaoSatLuoi({ embedded, taTen, onLogout }: { embedded?: boolean; taTen?: string; onLogout?: () => void }) {
  const [lops, setLops] = useState<LopTienDo[]>([])
  const [danhSach, setDanhSach] = useState<DanhSach | null>(null)
  const [lop, setLop] = useState<LopTienDo | null>(null)
  const [hsList, setHsList] = useState<HsLuoi[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [taBamHo, setTaBamHo] = useState(false)
  const [active, setActive] = useState<HsLuoi | null>(null)
  const [nhac, setNhac] = useState<string | null>(null)

  async function taiLop() {
    setLoading(true); setLoi(null)
    try { const [l, d] = await Promise.all([lopTienDo(DOT_HIEN_TAI), danhSachGoiY()]); setLops(l); setDanhSach(d) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setLoading(false) }
  }
  async function taiHs(l: LopTienDo) {
    setHsList([]); setLoading(true); setLoi(null)
    try { setHsList(await luoiLop(l.lop_id, DOT_HIEN_TAI)) } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { taiLop() }, [])
  // Mở lớp: mặc định "TA bấm hộ" theo khối (lớp 3–5 TA hỏi miệng và bấm hộ — §1).
  function moLop(l: LopTienDo) { setLop(l); setTaBamHo(khoiSo(l.khoi) <= 5); taiHs(l) }
  useEffect(() => { if (!nhac) return; const t = setTimeout(() => setNhac(null), 2200); return () => clearTimeout(t) }, [nhac])

  const nhomKhoi = useMemo(() => {
    const m = new Map<string, LopTienDo[]>()
    for (const l of [...lops].sort((a, b) => thuTuKhoi(a.khoi) - thuTuKhoi(b.khoi) || a.ten_lop.localeCompare(b.ten_lop))) {
      const k = l.khoi ?? '?'; if (!m.has(k)) m.set(k, []); m.get(k)!.push(l)
    }
    return [...m.entries()]
  }, [lops])

  const daLam = hsList.filter((h) => h.da_lam).length // đếm items đang render (badge) — không phải nghiệp vụ

  return (
    <div className={`${embedded ? 'min-h-full' : 'min-h-[100dvh]'} text-slate-800`} style={{ background: NEN, fontFamily: FONT }}>
      {active && danhSach && (
        <KhaoSatForm hs={active} taBamHo={taBamHo} danhSach={danhSach}
          onCancel={() => setActive(null)}
          onDone={() => { setActive(null); if (lop) { taiHs(lop); lopTienDo(DOT_HIEN_TAI).then(setLops).catch(() => {}) } }} />
      )}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/60 bg-white/70 px-4 py-3 backdrop-blur sm:px-6" style={{ paddingTop: embedded ? 12 : 'max(12px, env(safe-area-inset-top))' }}>
        {lop
          ? <button type="button" onClick={() => { setLop(null); setHsList([]) }} className="h-11 shrink-0 rounded-full bg-white px-4 text-[15px] font-bold text-slate-500 shadow-sm active:bg-slate-100">‹ Lớp khác</button>
          : <img src="/bk-ui/mascot_wave.png" alt="" className="h-11 w-11 object-contain" />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[20px] font-extrabold leading-tight text-[#4B3AA8]">{lop ? `Lớp ${lop.ten_lop}` : 'Bạn của con ở BK'}</div>
          <div className="truncate text-[13px] font-semibold text-slate-500">{lop ? `${daLam}/${hsList.length} bạn đã làm · bấm tên mình để bắt đầu` : `Chọn lớp để bắt đầu · đợt ${DOT_HIEN_TAI}`}</div>
        </div>
        {lop && (
          <button type="button" onClick={() => setTaBamHo(!taBamHo)} className={`h-11 shrink-0 rounded-full border-2 px-4 text-[14px] font-bold transition ${taBamHo ? 'border-[#FF8A3D] bg-[#FFE8D6] text-[#C2560F]' : 'border-slate-200 bg-white text-slate-500'}`}>
            {taBamHo ? '🧑‍🏫 TA bấm hộ' : '🙋 HS tự bấm'}
          </button>
        )}
        {!lop && !embedded && (
          <div className="flex shrink-0 items-center gap-2">
            {taTen && <span className="hidden text-[13px] font-semibold text-slate-500 sm:inline">{taTen}</span>}
            {onLogout && <button type="button" onClick={onLogout} className="h-10 rounded-full bg-white px-3 text-[13px] font-bold text-slate-400 shadow-sm active:bg-slate-100">Đăng xuất</button>}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6">
        {loi && <div className="mb-3 rounded-2xl bg-rose-100 px-4 py-3 text-[15px] font-bold text-rose-600">{loi} <button type="button" onClick={() => (lop ? taiHs(lop) : taiLop())} className="ml-2 underline">Thử lại</button></div>}
        {nhac && <div className="fixed left-1/2 top-24 z-40 -translate-x-1/2 rounded-full bg-slate-800/90 px-5 py-3 text-[16px] font-bold text-white shadow-lg">{nhac}</div>}
        {loading && <div className="py-16 text-center text-[17px] font-semibold text-slate-400">Đang tải…</div>}

        {!lop && !loading && nhomKhoi.map(([khoi, ds]) => (
          <section key={khoi} className="mb-5">
            <h3 className="mb-2 text-[15px] font-extrabold uppercase tracking-wider text-slate-400">Khối {khoi}</h3>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {ds.map((l) => {
                const pct = l.si_so ? Math.round((l.da_lam / l.si_so) * 100) : 0
                const xong = l.si_so > 0 && l.da_lam >= l.si_so
                return (
                  <button key={l.lop_id} type="button" onClick={() => moLop(l)}
                    className={`rounded-2xl border-[3px] bg-white/90 p-4 text-left shadow-sm transition active:scale-[0.98] ${xong ? 'border-[#4DC47A]' : 'border-white'}`}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[24px] font-extrabold text-slate-800">{l.ten_lop}</span>
                      <span className="text-[13px] font-bold text-slate-400">{l.mon}</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#4DC47A] to-[#39C6D6] transition-all" style={{ width: `${pct}%` }} /></div>
                    <div className="mt-1.5 text-[14px] font-bold text-slate-500">{xong ? '✓ Xong cả lớp' : `${l.da_lam}/${l.si_so} bạn đã làm`}</div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
        {!lop && !loading && !lops.length && !loi && <div className="py-16 text-center text-[17px] font-semibold text-slate-400">Chưa có lớp đang học nào.</div>}

        {lop && !loading && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {hsList.map((h) => (
              <button key={h.hoc_sinh_id} type="button"
                onClick={() => (h.da_lam ? setNhac(`${h.ho_ten} đã làm rồi ✓`) : (danhSach ? setActive(h) : setNhac('Đang tải danh sách trường/toà…')))}
                className={`relative flex flex-col items-center rounded-2xl border-[3px] bg-white/90 px-2 py-4 shadow-sm transition active:scale-[0.97] ${h.da_lam ? 'border-[#DDF6E4] opacity-55' : 'border-white'}`}>
                {h.da_lam && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#4DC47A] text-[15px] font-extrabold text-white">✓</span>}
                <Avatar hs={h} />
                <span className="mt-2 line-clamp-2 text-center text-[16px] font-extrabold leading-tight text-slate-800">{h.ho_ten}</span>
              </button>
            ))}
            {!hsList.length && !loi && <div className="col-span-full py-16 text-center text-[17px] font-semibold text-slate-400">Lớp này chưa có học sinh đang học.</div>}
          </div>
        )}
      </main>
    </div>
  )
}
