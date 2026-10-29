// Tab "Duyệt bổ trợ" — viết lại 17/10 (Thùy): 2 VÒNG + CHỐT TUẦN. Mockup: docs/mockup-duyet-bo-tro-2-vong.html · spec-bo-tro.md §25.
//  Vòng 1 = 📉 Điểm thấp + 🚨 Báo động → "Đưa vào theo dõi" (KHÔNG chiếm slot) · Vòng 2 = 👁 Đang theo dõi → "Duyệt chính thức" (mới chiếm slot).
//  KHÔNG realtime: Điểm thấp + Đang theo dõi đọc ẢNH CHỤP TUẦN (thứ 2 người duyệt bấm "Chốt tuần"); chỉ Báo động đọc LIVE.
//  Mỗi màn 1 học sinh. Máy KHÔNG đề xuất level. Sau mutation vá tại chỗ (CLAUDE.md §2), nhớ tab/vị trí khi rời màn.
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import CapacityKhoiBar from '../../components/CapacityKhoiBar'
import { laySucChua, type SucChua, type UuTienCase } from '../../lib/botro_yeu'
import { chotTuan, danhSachTuan, baoDongLive, theoDoiVao, theoDoiKetThuc, duyetChinhThuc,
  type BaoDong, type BuoiET, type BuoiBTVN, type ChotTuan, type DangTheoDoi, type DuLieuTuan, type ChuyenDeAnh, type EtBtvn, type MauET, type UngVienDiemThap } from '../../lib/botro_tuan'
import { ddmmVN, homNayVN, congNgay } from '../../lib/tuan'
import { xuLyCaHetHan } from '../../lib/botro_yeu_ca'

type Tab = 'td' | 'bd' | 'dt'
const TAB_TEN: Record<Tab, string> = { td: '👁 Đang theo dõi', bd: '🚨 Báo động', dt: '📉 Điểm thấp' }
type Mon = { td: DangTheoDoi[] | null; bd: BaoDong[] | null; dt: UngVienDiemThap[] | null; chotTD: ChotTuan | null; chotDT: ChotTuan | null }
const NHO: { tab: Tab; mon: string; khoi: string; cur: Record<Tab, number>; du: Mon | null; duMon: string } = { tab: 'td', mon: '', khoi: '', cur: { td: 0, bd: 0, dt: 0 }, du: null, duMon: '' }

// Màu ET (luật Thùy 17/10; tính ở DB — đây chỉ là bảng màu).
const MAU: Record<MauET, { cls: string; ten: string }> = {
  do_dam: { cls: 'bg-red-800 text-white', ten: 'Đỏ đậm' },
  do_nhat: { cls: 'bg-orange-100 text-orange-800 border-orange-200', ten: 'Đỏ nhạt' },
  xanh_nhat: { cls: 'bg-green-100 text-green-800 border-green-200', ten: 'Xanh nhạt' },
  xanh: { cls: 'bg-green-600 text-white', ten: 'Xanh' },
}
const ISO_NGAY = (s: string) => ddmmVN(s.slice(0, 10)) // cột kiểu DATE (buổi) — không phải timestamptz
// timestamptz → ngày theo GIỜ VN (CLAUDE.md §2: cấm cắt chuỗi UTC cho ngày local)
const ngayVN = (iso: string) => ddmmVN(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }))
const sao = (x: number | null | undefined) => (x == null ? '—' : `${Math.round(x * 100)}%`)

// export: popup em ở widget dạng yếu (Trưởng khối, 29/10) dùng lại đúng khối hiển thị này
export function KhoiET({ et }: { et: BuoiET[] }) {
  if (!et.length) return <p className="rounded-xl bg-slate-50 px-3 py-3 text-[12.5px] text-slate-500">Chưa có buổi ET nào có điểm.</p>
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {et.map((b) => (
          <div key={b.buoi_id} className={`rounded-2xl border border-transparent px-3.5 py-3 ${MAU[b.mau].cls}`}>
            <div className="text-[11.5px] opacity-85">ET {ISO_NGAY(b.ngay)}</div>
            <div className="text-[26px] font-extrabold leading-tight">{Math.round(b.diem)}%</div>
            <div className="text-[12px]">TB lớp {Math.round(b.tb_lop)}% · ngưỡng đỏ đậm {Math.round(b.tb_lop * 0.85)}%</div>
            <div className="mt-1 text-[11.5px] font-bold">Hạng {b.hang}/{b.n}{b.so_bang > 1 ? ` (cùng ${b.so_bang} bạn)` : ''} · {MAU[b.mau].ten} — {b.ly_do}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11.5px] text-slate-600">
        <span><i className="mr-1 inline-block h-3 w-3 rounded bg-red-800 align-middle" />Đỏ đậm: &lt;85% TB lớp hoặc 2 cuối lớp</span>
        <span><i className="mr-1 inline-block h-3 w-3 rounded border border-orange-200 bg-orange-100 align-middle" />Đỏ nhạt: 85% TB → TB</span>
        <span><i className="mr-1 inline-block h-3 w-3 rounded border border-green-200 bg-green-100 align-middle" />Xanh nhạt: từ TB trở lên</span>
        <span><i className="mr-1 inline-block h-3 w-3 rounded bg-green-600 align-middle" />Xanh: &gt;115% TB hoặc 2 đầu lớp</span>
      </div>
      <p className="mt-1.5 text-[11.5px] text-slate-500">ⓘ <b>"15%" là 15% của TB lớp</b> (TB lớp 70% → đỏ đậm khi &lt;59,5%), không phải 15 điểm. <b>"2 cuối / 2 đầu lớp" đếm theo SỐ NGƯỜI, không theo vị trí:</b> 4 bạn cùng điểm thấp nhất thì cả 4 đều đỏ đậm — trừ khi QUÁ NỬA lớp cùng điểm (khi đó không áp luật này). Mỗi ô ghi rõ lý do bị tô màu đó.</p>
    </>
  )
}
export function KhoiBTVN({ bt }: { bt: BuoiBTVN[] }) {
  if (!bt.length) return <p className="rounded-xl bg-slate-50 px-3 py-3 text-[12.5px] text-slate-500">Chưa có buổi BTVN nào được chấm.</p>
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {bt.map((b) => {
        const p = b.pct ?? 0, t = Math.max(1, b.tong)
        return (
          <div key={b.buoi_id} className="rounded-2xl border border-slate-200 px-3.5 py-3">
            <div className="text-[11.5px] text-slate-500">BTVN {ISO_NGAY(b.ngay)} · {b.tong} câu</div>
            <div className={`text-[22px] font-extrabold ${p < 40 ? 'text-rose-700' : p < 70 ? 'text-amber-700' : 'text-green-700'}`}>{b.pct ?? 0}% đúng</div>
            <div className="my-1.5 flex h-2 overflow-hidden rounded-full bg-slate-200"><i className="bg-green-600" style={{ width: `${100 * b.d / t}%` }} /><i className="bg-amber-500" style={{ width: `${100 * b.c / t}%` }} /><i className="bg-rose-600" style={{ width: `${100 * b.s / t}%` }} /></div>
            <div className="flex gap-2.5 text-[12px] font-semibold"><span className="text-green-700">Đ {b.d} ({Math.round(100 * b.d / t)}%)</span><span className="text-amber-700">C {b.c} ({Math.round(100 * b.c / t)}%)</span><span className="text-rose-700">S {b.s} ({Math.round(100 * b.s / t)}%)</span></div>
          </div>
        )
      })}
    </div>
  )
}
function KhoiChuyenDe({ cd }: { cd: ChuyenDeAnh[] | null | undefined }) {
  if (!cd || !cd.length) return <p className="rounded-xl bg-slate-50 px-3 py-3 text-[12.5px] text-slate-500">Chưa có điểm chuyên đề trong ảnh chụp tuần{cd == null ? ' (em này chưa nằm trong lần chốt nào)' : ''}.</p>
  return (
    <table className="w-full text-[13px]">
      <thead><tr className="text-left text-[11px] font-semibold text-slate-500"><th className="px-1.5 py-1">Chuyên đề</th><th className="px-1.5">Trước</th><th className="px-1.5">Nay</th><th className="w-[140px]" /><th className="px-1.5">Δ</th></tr></thead>
      <tbody>{cd.map((x) => {
        const nay = x.pha === 2 ? x.sau : x.diem, truoc = x.pha === 2 ? x.truoc : null
        const dl = nay != null && truoc != null ? Math.round((nay - truoc) * 100) : null
        return (
          <tr key={x.ma} className="border-t border-slate-100">
            <td className="px-1.5 py-1.5">{x.ten}</td><td className="px-1.5">{sao(truoc)}</td><td className="px-1.5 font-bold">{sao(nay)}</td>
            <td><div className="relative h-2 rounded-full bg-slate-200"><i className={`absolute inset-y-0 left-0 rounded-full ${(nay ?? 0) < 0.5 ? 'bg-rose-600' : (nay ?? 0) < 0.7 ? 'bg-amber-500' : 'bg-green-600'}`} style={{ width: `${Math.max(0, Math.min(1, nay ?? 0)) * 100}%` }} /></div></td>
            <td className={`px-1.5 font-bold ${dl != null && dl < 0 ? 'text-rose-700' : 'text-green-700'}`}>{dl == null ? (x.rank != null ? `hạng ${x.rank}/${x.si_so}` : '') : `${dl > 0 ? '+' : ''}${dl}`}</td>
          </tr>
        )
      })}</tbody>
    </table>
  )
}
const Sec = ({ t, ghi, children }: { t: string; ghi?: string; children: React.ReactNode }) => (
  <div className="mt-5"><h3 className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{t} {ghi && <small className="font-medium normal-case tracking-normal">— {ghi}</small>}</h3>{children}</div>
)
const TAG_KENH: Record<string, [string, string]> = {
  trend: ['Chuyên đề tụt', 'bg-indigo-100 text-indigo-800'], pct_yeu: ['% dạng yếu', 'bg-indigo-100 text-indigo-800'],
  so_lop_et: ['ET dưới lớp', 'bg-rose-100 text-rose-800'], so_lop_mt: ['MT dưới lớp', 'bg-rose-100 text-rose-800'],
}

type ChungHS = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null }
function DauEm({ e, i, n, onDi, children }: { e: ChungHS; i: number; n: number; onDi: (d: number) => void; children?: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <div className="grid h-[52px] w-[52px] place-items-center rounded-full bg-indigo-200 text-[19px] font-extrabold text-indigo-900">{e.ho_ten.trim().split(' ').slice(-1)[0]?.[0] ?? '?'}</div>
        <div><h2 className="text-[20px] font-bold text-slate-900">{e.ho_ten} <span className="text-[13px] font-medium text-slate-400">{e.ma_hs}</span></h2>
          <div className="text-[12.5px] text-slate-500">Lớp {e.lop ?? '?'} · Khối {e.khoi ?? '?'}</div></div>
        <div className="ml-auto flex items-center gap-2 text-[12.5px] text-slate-500">{i + 1} / {n}
          <button onClick={() => onDi(-1)} className="h-8 w-9 rounded-lg border border-slate-200 text-[15px] hover:bg-slate-50" title="Em trước">‹</button>
          <button onClick={() => onDi(1)} className="h-8 w-9 rounded-lg border border-slate-200 text-[15px] hover:bg-slate-50" title="Em kế">›</button></div>
      </div>
      {children}
    </>
  )
}

export default function DuyetBoTroYeuScreen() {
  const [mons, setMons] = useState<string[]>([])
  const [khois, setKhois] = useState<string[]>([])
  const [mon, setMon] = useState(NHO.mon)
  const [khoi, setKhoi] = useState(NHO.khoi)
  const [tab, setTabS] = useState<Tab>(NHO.tab)
  const [cur, setCurS] = useState<Record<Tab, number>>(NHO.cur)
  const [du, setDu] = useState<Mon | null>(NHO.duMon === NHO.mon ? NHO.du : null)
  const [sucChua, setSucChua] = useState<SucChua | null>(null)
  const [napCap, setNapCap] = useState(0)
  const [loi, setLoi] = useState<string | null>(null)
  const [chot, setChot] = useState<{ xong: number; tong: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [ghiChu, setGhiChu] = useState('')
  const [muc, setMuc] = useState<1 | 2 | 3>(2)
  const [uuTien, setUuTien] = useState<UuTienCase>(2)
  const setTab = (t: Tab) => { NHO.tab = t; setTabS(t); setLoi(null) }
  const setCur = (t: Tab, v: number) => setCurS((p) => { const n = { ...p, [t]: v }; NHO.cur = n; return n })
  const napSucChua = () => { laySucChua().then(setSucChua).catch(() => {}); setNapCap((n) => n + 1) }
  useEffect(napSucChua, [])

  useEffect(() => {
    supabase.from('lop').select('mon, khoi').eq('trang_thai', 'dang_hoc').limit(2000).then(({ data }) => {
      const rows = (data ?? []) as any[]
      const ms = [...new Set(rows.map((r) => r.mon).filter(Boolean))].sort() as string[]
      setMons(ms); setKhois([...new Set(rows.map((r) => r.khoi).filter(Boolean))].sort() as string[])
      if (!mon) setMon(ms.includes('Toán') ? 'Toán' : (ms[0] ?? ''))
    })
  }, []) // eslint-disable-line

  const tai = async (m: string) => {
    setLoi(null)
    try {
      const [td, dt, bd] = await Promise.all([danhSachTuan(m, 'theo_doi'), danhSachTuan(m, 'diem_thap'), baoDongLive(m)])
      const n: Mon = { td: td.ds, dt: dt.ds, bd, chotTD: td.chot, chotDT: dt.chot }
      NHO.du = n; NHO.duMon = m; setDu(n)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  useEffect(() => { NHO.mon = mon; if (mon && NHO.duMon !== mon) { setDu(null); tai(mon) } }, [mon]) // eslint-disable-line
  // 26/10: ca quá 14 ngày đóng + vào theo dõi (lười, 1 lần/10 phút) — xong thì tải lại để thấy em mới vào Đang theo dõi
  useEffect(() => { if (mon) xuLyCaHetHan().then((n) => { if (n > 0) tai(mon) }).catch(() => {}) }, [mon]) // eslint-disable-line
  useEffect(() => { NHO.khoi = khoi }, [khoi])

  // vá tại chỗ: em đã quyết ⇒ rời MỌI tab (theo em, không theo lý do)
  const bo = (hs: string) => setDu((p) => { if (!p) return p; const n = { ...p, td: p.td?.filter((x) => x.hoc_sinh_id !== hs) ?? null, dt: p.dt?.filter((x) => x.hoc_sinh_id !== hs) ?? null, bd: p.bd?.filter((x) => x.hoc_sinh_id !== hs) ?? null }; NHO.du = n; return n })
  const loc = <T extends { khoi: string | null }>(l: T[] | null | undefined): T[] => (l ?? []).filter((x) => !khoi || x.khoi === khoi)
  const ds: { td: DangTheoDoi[]; bd: BaoDong[]; dt: UngVienDiemThap[] } = useMemo(() => ({ td: loc(du?.td), bd: loc(du?.bd), dt: loc(du?.dt) }), [du, khoi]) // eslint-disable-line
  const list = ds[tab] as (DangTheoDoi | BaoDong | UngVienDiemThap)[]
  const i = Math.min(cur[tab], Math.max(0, list.length - 1))
  const e = list[i]
  const di = (d: number) => { if (list.length) setCur(tab, (i + d + list.length) % list.length) }
  const chotTuanBtn = du?.chotDT ?? du?.chotTD ?? null
  // 26/10 nhịp độ: chốt tuần = ảnh chụp sáng THỨ 2 hằng tuần. Chưa có ảnh của tuần này ⇒ nhắc (đậm hơn nếu đã là thứ 2).
  const homNay = homNayVN(); const thuHai = congNgay(homNay, -((new Date(homNay + 'T00:00:00Z').getUTCDay() + 6) % 7))
  const chuaChotTuanNay = !!chotTuanBtn && chotTuanBtn.tuan < thuHai

  async function lamChot() {
    if (!mon) return
    if (!confirm(`Chốt tuần môn ${mon}: quét lại TOÀN BỘ lớp (mất vài chục giây) và thay ảnh chụp cho cả tuần. Tiếp tục?`)) return
    setBusy(true); setLoi(null); setChot({ xong: 0, tong: 1 })
    try { await chotTuan(mon, (xong, tong) => setChot({ xong, tong }), (con) => setChot({ xong: -1, tong: con })); await tai(mon) } catch (x: any) { setLoi(x?.message ?? String(x)) } finally { setBusy(false); setChot(null) }
  }
  async function dua(boQua: boolean) {
    if (!e) return
    setBusy(true); setLoi(null)
    try { await theoDoiVao(e.hoc_sinh_id, mon, tab === 'bd' ? 'bao_dong' : 'diem_thap', ghiChu.trim() || null, boQua); setGhiChu(''); bo(e.hoc_sinh_id); await tai(mon) }
    catch (x: any) { setLoi(x?.message ?? String(x)) } finally { setBusy(false) }
  }
  async function chinhThuc() {
    const t = e as DangTheoDoi | undefined
    if (!t) return
    setBusy(true); setLoi(null)
    try { await duyetChinhThuc({ theoDoiId: t.id, hocSinhId: t.hoc_sinh_id, mon, level: muc, uuTien, lyDo: ghiChu.trim() || null, nguon: t.nguon }); setGhiChu(''); bo(t.hoc_sinh_id); napSucChua() }
    catch (x: any) { setLoi(x?.message ?? String(x)) } finally { setBusy(false) }
  }
  async function goTheoDoi() {
    const t = e as DangTheoDoi | undefined
    if (!t || !confirm(`Gỡ ${t.ho_ten} khỏi danh sách theo dõi?`)) return
    setBusy(true); setLoi(null)
    try { await theoDoiKetThuc(t.id, 'go', ghiChu.trim() || null); setGhiChu(''); bo(t.hoc_sinh_id) } catch (x: any) { setLoi(x?.message ?? String(x)) } finally { setBusy(false) }
  }

  const duLieu: DuLieuTuan | null = !e ? null : tab === 'bd' ? { chuyen_de: (e as BaoDong).chuyen_de ?? [], et_btvn: (e as BaoDong).et_btvn } : (e as DangTheoDoi | UngVienDiemThap).du_lieu
  const etBtvn: EtBtvn | null = duLieu?.et_btvn ?? null
  const dangSlot = sucChua && sucChua.dang >= sucChua.tran

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-[#f5f5f7] px-6 pb-4 pt-3">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="mr-1 text-[20px] font-bold text-slate-800">Duyệt bổ trợ</h1>
          {(['td', 'bd', 'dt'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
              {TAB_TEN[t]} <span className={tab === t ? 'opacity-80' : 'text-slate-400'}>{du ? `(${ds[t].length})` : ''}</span></button>
          ))}
          <span className="ml-auto flex gap-2">
            <select value={khoi} onChange={(x) => setKhoi(x.target.value)} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px]"><option value="">Tất cả khối</option>{khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select>
            <select value={mon} onChange={(x) => setMon(x.target.value)} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px]">{mons.map((m) => <option key={m}>{m}</option>)}</select>
          </span>
        </header>

        {sucChua && (
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className={`rounded-full px-2.5 py-0.5 font-bold ${dangSlot ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}>Đang bổ trợ chính thức {sucChua.dang}/{sucChua.tran}</span>
            <span className={`rounded-full px-2.5 py-0.5 font-bold ${sucChua.cao >= sucChua.tran_cao ? 'bg-rose-600 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}>Ưu tiên Cao {sucChua.cao}/{sucChua.tran_cao}</span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-bold text-indigo-700">👁 Đang theo dõi {du?.td?.length ?? '…'} — không chiếm slot</span>
            <span className="text-slate-500">{dangSlot ? 'Đã đầy — Duyệt chính thức bị khoá, vẫn Giữ/Gỡ được.' : `còn ${sucChua.tran - sucChua.dang} slot`}</span>
          </div>
        )}

        <CapacityKhoiBar mon={mon} khoi={khoi} onChon={setKhoi} nap={napCap} />

        <div className="mb-2 flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-[12.5px]">
          {tab === 'bd'
            ? <><span className="rounded-full bg-green-100 px-2 py-0.5 text-[11.5px] font-bold text-green-800">● LIVE</span><span><b>Báo động</b> hiện ngay khi GV/TA bấm chuông — không chờ chốt tuần.</span></>
            : <><span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11.5px] font-bold text-indigo-800">❄ ẢNH CHỤP TUẦN</span>
              {chotTuanBtn ? <span>Chốt <b>{ngayVN(chotTuanBtn.chot_at)}</b> · {new Date(chotTuanBtn.chot_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{chotTuanBtn.chot_ten ? ` · bởi ${chotTuanBtn.chot_ten}` : ''} </span>
                : <b className="text-amber-700">Chưa chốt tuần nào cho môn {mon} — bấm “Chốt tuần” để quét (làm sáng thứ 2 hằng tuần).</b>}</>}
          {tab !== 'bd' && chuaChotTuanNay && <b className={`w-full rounded-lg px-2.5 py-1 text-[12px] ${homNay === thuHai ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-900'}`}>{homNay === thuHai ? '⏰ Hôm nay thứ 2 — ' : ''}Tuần này (thứ 2 {ddmmVN(thuHai)}) CHƯA chốt: đang xem ảnh chụp tuần {ddmmVN(chotTuanBtn!.tuan)}. Bấm “Chốt tuần” — phần chưa xử lý của tuần trước sẽ được cộng dồn sang.</b>}
          <span className="ml-auto flex items-center gap-2">
            {chot && <span className="text-[12px] text-slate-500">{chot.xong < 0 ? `Đang cập nhật dạng yếu (đóng băng đầu tuần)… còn ${chot.tong} em` : `Đang quét lớp ${chot.xong}/${chot.tong}…`}</span>}
            <button disabled={busy} onClick={lamChot} className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-[12.5px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">↻ {chotTuanBtn ? 'Chốt lại tuần này' : 'Chốt tuần'}</button>
            <button disabled={busy} onClick={() => tai(mon)} title="Tải lại từ DB (không quét)" className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-500 hover:bg-slate-100">⟳</button>
          </span>
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-x-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-1 text-[12px] text-amber-900"
          title={tab === 'td' ? 'Vòng 2: chỉ em ĐÃ vào theo dõi. Số liệu làm mới theo lần chốt tuần, kèm so với lúc vào theo dõi. Duyệt chính thức = bổ trợ 1 lần trong tuần rồi tự kết thúc (dù chưa hết dạng yếu); sau bổ trợ mà còn dạng yếu em tự quay lại đây. Em hết tín hiệu vẫn nằm đây tới khi bạn Gỡ tay. Việc khẩn giữa tuần → loại Bổ trợ Khẩn cấp, không ở đây.'
            : tab === 'bd' ? 'Vòng 1: em bị GV/TA bấm chuông (ET/MT/BTVN/đánh giá/hổng nền) trong 30 ngày qua. Quyết có đáng theo dõi không — chưa tốn slot.'
            : 'Vòng 1: em máy gom từ ET · BTVN · chuyên đề (ảnh chụp tuần). Quyết có đáng theo dõi không — chưa tốn slot. Em có thêm báo động vẫn hiện ở đây kèm chip 🚨; duyệt xong ở tab nào thì biến mất ở cả hai.'}>
          {tab === 'td' ? <><b>Vòng 2 · Theo dõi → Chính thức:</b> chỉ em ĐÃ vào theo dõi · duyệt chính thức = bổ trợ <b>1 lần/tuần</b> rồi tự kết thúc · hết tín hiệu vẫn ở đây tới khi <b>Gỡ tay</b></>
            : tab === 'bd' ? <><b>Vòng 1 · 🚨 Báo động:</b> GV/TA bấm chuông trong 30 ngày · quyết <b>có đáng theo dõi không</b> — chưa tốn slot</>
            : <><b>Vòng 1 · 📉 Điểm thấp:</b> máy gom từ ET · BTVN · chuyên đề · quyết <b>có đáng theo dõi không</b> — chưa tốn slot</>}
          <span className="text-amber-700/70">ⓘ rê chuột xem đầy đủ</span>
        </div>
        {loi && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">{loi}</p>}

        {!du ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
          : list.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            {tab === 'dt' && !du.chotDT ? <>Chưa có ảnh chụp tuần cho môn {mon} — bấm <b>Chốt tuần</b>.</> : <>Không có em nào ở mục “{TAB_TEN[tab]}” (môn {mon}{khoi ? ` · khối ${khoi}` : ''}).</>}</div>
          : (
            <div className="grid gap-4 lg:grid-cols-[270px_1fr]">
              <aside className="max-h-[78vh] self-start overflow-auto rounded-2xl border border-slate-200 bg-white p-2">
                <h4 className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">{TAB_TEN[tab]}</h4>
                {list.map((x, k) => (
                  <button key={x.hoc_sinh_id} onClick={() => setCur(tab, k)} className={`flex w-full items-center gap-2 rounded-xl p-2 text-left ${k === i ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'}`}>
                    <span className={`h-2 w-2 shrink-0 rounded-full ${((x as any).du_lieu?.et_btvn ?? (x as any).et_btvn)?.et?.some((b: BuoiET) => b.mau === 'do_dam') ? 'bg-red-800' : 'bg-amber-400'}`} />
                    <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-slate-800">{x.ho_ten}</span><span className="block text-[11.5px] text-slate-400">{x.lop ?? '?'} · K{x.khoi ?? '?'}</span></span>
                    {tab === 'dt' && (x as UngVienDiemThap).cung_bao_dong && <span title="Cũng có báo động">🚨</span>}
                  </button>
                ))}
              </aside>
              {e && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <DauEm e={e} i={i} n={list.length} onDi={di}>
                    <div className="my-3 flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold">
                      <span className="text-[12px] font-medium text-slate-400">Lý do:</span>
                      {tab === 'bd' && <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-white">🚨 Báo động</span>}
                      {tab === 'dt' && (e as UngVienDiemThap).kenh.map((k) => TAG_KENH[k] && <span key={k} className={`rounded-full px-2.5 py-0.5 ${TAG_KENH[k][1]}`}>{TAG_KENH[k][0]}</span>)}
                      {tab === 'dt' && (e as UngVienDiemThap).cung_bao_dong && <span className="rounded-full border border-dashed border-rose-300 bg-rose-50 px-2.5 py-0.5 text-rose-700">cũng ở tab 🚨 Báo động</span>}
                      {tab === 'bd' && (e as BaoDong).cung_diem_thap && <span className="rounded-full border border-dashed border-orange-300 bg-orange-50 px-2.5 py-0.5 text-orange-700">cũng ở tab 📉 Điểm thấp</span>}
                      {tab === 'td' && (e as DangTheoDoi).nguon === 'sau_bo_tro' && <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-violet-800">↩ sau bổ trợ yếu</span>}
                      {tab === 'td' && (e as DangTheoDoi).nguon === 'truong_khoi' && <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-white">🧭 trưởng khối đề xuất Yếu</span>}
                      {tab === 'dt' && ((e as UngVienDiemThap).ly_do[0] ?? '').startsWith('Tồn từ tuần') && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-900">📌 tồn tuần trước</span>}
                      {tab === 'td' && <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-800">👁 theo dõi từ {ngayVN((e as DangTheoDoi).vao_at)}{(e as DangTheoDoi).vao_ten ? ` · ${(e as DangTheoDoi).vao_ten}` : ''}{(e as DangTheoDoi).ghi_chu ? ` — “${(e as DangTheoDoi).ghi_chu}”` : ''}</span>}
                    </div>
                  </DauEm>
                  {tab === 'dt' && (e as UngVienDiemThap).ly_do.length > 0 && <div className="mb-2 space-y-0.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[12px] text-slate-600">{(e as UngVienDiemThap).ly_do.map((l, k) => <div key={k}>· {l}</div>)}</div>}
                  {tab === 'bd' && <div className="mb-2 space-y-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-900">{(e as BaoDong).bao_dong.map((b, k) => <div key={k}>🚨 <b>{b.nguon}</b> · {ngayVN(b.at)}{b.ai ? ` · ${b.ai}` : ''}{b.ghi_chu ? ` — “${b.ghi_chu}”` : ''}</div>)}</div>}

                  <Sec t="ET 4 buổi gần nhất" ghi="so với cả lớp">{etBtvn ? <KhoiET et={etBtvn.et} /> : null}</Sec>
                  <Sec t="BTVN 4 buổi gần nhất" ghi="Đ = đúng · C = chưa trọn · S = sai">{etBtvn ? <KhoiBTVN bt={etBtvn.btvn} /> : null}</Sec>
                  <Sec t="Điểm chuyên đề" ghi="như cũ (ảnh chụp tuần)"><KhoiChuyenDe cd={duLieu?.chuyen_de ?? (tab === 'bd' ? null : [])} /></Sec>
                  {tab === 'td' && <SoVoiLucVao e={e as DangTheoDoi} />}

                  <div className="sticky bottom-0 z-10 -mx-5 -mb-5 mt-4 flex flex-wrap items-center gap-2 rounded-b-2xl border-t border-slate-200 bg-slate-50/95 px-5 py-2.5 shadow-[0_-8px_14px_-10px_rgba(15,23,42,0.35)] backdrop-blur">
                    <span className="cursor-help text-[13px] font-bold text-slate-800" title={tab === 'td' ? 'Chỉ lúc này mới trừ slot. Bổ trợ 1 lần trong tuần rồi tự kết thúc; sau đó em còn dạng yếu (trong dạng đã học) sẽ tự quay lại Đang theo dõi.' : 'Vòng 1 KHÔNG tốn slot, KHÔNG mở case, không chọn mức. Máy không đề xuất level.'}>{tab === 'td' ? 'Vòng 2 — duyệt chính thức' : 'Vòng 1 — đưa vào theo dõi?'} <span className="font-normal text-slate-400">ⓘ</span></span>
                    {tab === 'td' && <>
                      <select value={muc} onChange={(x) => setMuc(Number(x.target.value) as 1 | 2 | 3)} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px]">
                        <option value={1}>L1 · trước/sau giờ</option><option value={2}>L2 · buổi riêng (TA)</option><option value={3}>L3 · buổi riêng (GV cao cấp)</option></select>
                      <select value={uuTien} onChange={(x) => setUuTien(Number(x.target.value) as UuTienCase)} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px]">
                        <option value={2}>Ưu tiên Thường</option><option value={3}>Ưu tiên Cao ({sucChua?.cao ?? '?'}/{sucChua?.tran_cao ?? 20})</option><option value={1}>Ưu tiên Thấp</option></select></>}
                    <input value={ghiChu} onChange={(x) => setGhiChu(x.target.value)} placeholder={tab === 'td' ? 'Lý do duyệt / gỡ (tuỳ chọn)…' : 'Ghi chú vì sao theo dõi (không bắt buộc)…'} className="min-w-[160px] flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px]" />
                    {tab === 'td' ? <>
                      <button disabled={busy || !!dangSlot} onClick={chinhThuc} title={dangSlot ? 'Đã đủ slot' : ''} className="rounded-lg bg-green-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-green-700 disabled:opacity-40">{busy ? '…' : '✅ Duyệt chính thức'}</button>
                      <button onClick={() => di(1)} className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 ring-1 ring-slate-200">Giữ theo dõi</button>
                      <button disabled={busy} onClick={goTheoDoi} className="rounded-lg bg-rose-600 px-3 py-2 text-[13px] font-bold text-white disabled:opacity-50">Gỡ khỏi theo dõi</button></>
                      : <>
                      <button disabled={busy} onClick={() => dua(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-indigo-700 disabled:opacity-50">{busy ? '…' : '👁 Đưa vào theo dõi'}</button>
                      <button disabled={busy} onClick={() => dua(true)} className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 ring-1 ring-slate-200 disabled:opacity-50">Bỏ qua</button></>}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  )
}

function SoVoiLucVao({ e }: { e: DangTheoDoi }) {
  const tb = (a?: BuoiET[]) => (a && a.length ? Math.round(a.reduce((s, x) => s + x.diem, 0) / a.length) : null)
  const pc = (a?: BuoiBTVN[]) => { if (!a || !a.length) return null; const d = a.reduce((s, x) => s + x.d, 0), t = a.reduce((s, x) => s + x.tong, 0); return t ? Math.round(100 * d / t) : null }
  const vao = e.so_lieu_vao?.et_btvn, nay = e.du_lieu?.et_btvn
  const [a1, a2, b1, b2] = [tb(vao?.et), tb(nay?.et), pc(vao?.btvn), pc(nay?.btvn)]
  return (
    <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-[12.5px] text-indigo-900">
      <b>Từ lúc vào theo dõi ({ngayVN(e.vao_at)}) đến lần chốt gần nhất:</b> ET TB 4 buổi <b>{a1 ?? '—'}% → {a2 ?? '—'}%</b> · BTVN đúng <b>{b1 ?? '—'}% → {b2 ?? '—'}%</b>
      {a1 != null && a2 != null && b1 != null && b2 != null ? ` · ${a2 - a1 + (b2 - b1) > 0 ? 'có nhích lên' : 'chưa cải thiện'}` : ''}
      {!e.co_anh_chup && <span className="ml-2 text-amber-700">(chưa có ảnh chụp tuần nào cho em này — số "nay" tính ngay lúc mở)</span>}
    </div>
  )
}
