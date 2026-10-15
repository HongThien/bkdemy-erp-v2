// ============================================================================
// DuyetCongScreen — "Duyệt công trợ giảng" (lá `ta_cong_duyet`, spec-cham-cong-ta.md §5–§6, mockup Thùy duyệt 14/10).
//   Người duyệt: Trang (vai Core team). Duyệt theo NGOẠI LỆ: mọi dòng chờ duyệt CHỌN SẴN, đọc một lượt, bỏ chọn /
//   từ chối (bắt buộc lý do) dòng không ổn, rồi duyệt cả lô. Chốt giờ ca quên checkout (giờ gốc giữ nguyên).
//   Tab "Thiếu công": buổi lớp / ca trực đã diễn ra mà không ai ghi công (bất biến, tính từ 01/10) → nhập hộ.
// Mọi khớp/cờ/làm hộ/người phụ trách suy ở Postgres (_ta_doi_chieu, fn_ta_buoi_thieu_cong — theo phân công TẠI
// NGÀY). Client chỉ hiển thị + lọc theo lựa chọn UI. Sau duyệt: vá trạng thái tại chỗ + quét nền (không trắng màn).
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import SearchSelect from '../../components/SearchSelect'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../lib/tuan'
import {
  doiChieu, thieuCong, duyetCong, chotGio, nhapHoCa, nhapHoViec, dsLoaiViec, dsLop, dsNhanSuDangLam,
  gioVN, hm, nhanCo, type DongCong, type ThieuCong, type LoaiViec,
} from '../../lib/tacong'

type Tab = 'duyet' | 'thieu'
type Loc = 'cho' | 'nay' | 'qua' | 'khoang'
const MOC = '2026-10-01'   // mốc chấm công (đợt khai lùi tháng 10) — chỉ để đặt khoảng mặc định; DB tự chặn trước mốc
const inputCls = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400'
const btnPrimary = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnOk = 'rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnGhost = 'rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
const btnDanger = 'rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40'
const card = 'rounded-xl border border-slate-200 bg-white shadow-sm'
const PILL_DUYET: Record<DongCong['duyet'], [string, string]> = {
  cho_duyet: ['Chờ duyệt', 'bg-amber-100 text-amber-700'], da_duyet: ['Đã duyệt', 'bg-emerald-100 text-emerald-700'], tu_choi: ['Từ chối', 'bg-red-100 text-red-700'],
}
const loiCua = (e: unknown) => (e as { message?: string })?.message ?? String(e)
type NhapHoMoi = { ngay: string; loai: string; lop_id: string | null; bat: string; ket: string; ten_ta: string | null } | null

export default function DuyetCongScreen() {
  const quyen = useStore((s) => s.quyen)
  const coGhi = !!quyen && (quyen.laAdmin || (quyen.chucNang.includes('ta_cong_duyet') && !quyen.chiXem.includes('ta_cong_duyet')))
  const [tab, setTab] = useState<Tab>('duyet')
  const [toast, setToast] = useState<{ ok: boolean; t: string } | null>(null)
  const bao = useCallback((t: string, ok = true) => { setToast({ ok, t }); setTimeout(() => setToast(null), ok ? 2500 : 6000) }, [])
  const [nhapHo, setNhapHo] = useState<NhapHoMoi | undefined>(undefined)   // undefined = đóng; null = mở trống
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
        <h1 className="mr-2 text-base font-semibold text-slate-800">Công trợ giảng</h1>
        {([['duyet', 'Duyệt công'], ['thieu', 'Thiếu công']] as [Tab, string][]).map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-sm font-medium transition ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
        ))}
        {coGhi && <button onClick={() => setNhapHo(nhapHo === undefined ? null : undefined)} className={`${btnGhost} ml-auto`}>{nhapHo === undefined ? '+ Nhập hộ (TA quá hạn)' : 'Đóng nhập hộ'}</button>}
        {!coGhi && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Chỉ xem</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
        {nhapHo !== undefined && <NhapHo key={JSON.stringify(nhapHo)} moi={nhapHo} bao={bao} onXong={() => setNhapHo(undefined)} />}
        {tab === 'duyet' && <TabDuyet coGhi={coGhi} bao={bao} />}
        {tab === 'thieu' && <TabThieu coGhi={coGhi} bao={bao} onNhapHo={(m) => setNhapHo(m)} />}
      </div>
      {toast && <div className={`fixed bottom-4 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-2xl px-4 py-2 text-sm text-white shadow-lg ${toast.ok ? 'bg-slate-900/90' : 'bg-red-700/95'}`}>{toast.t}</div>}
    </div>
  )
}

// ═══════════════════════════════ DUYỆT ═══════════════════════════════
function TabDuyet({ coGhi, bao }: { coGhi: boolean; bao: (t: string, ok?: boolean) => void }) {
  const homNay = homNayVN()
  const [loc, setLoc] = useState<Loc>('cho')
  const [tu, setTu] = useState(congNgay(homNay, -6))
  const [den, setDen] = useState(homNay)
  const [rows, setRows] = useState<DongCong[] | null>(null)
  const [boChon, setBoChon] = useState<Set<string>>(new Set())   // mặc định CHỌN SẴN mọi dòng chờ duyệt
  const [mo, setMo] = useState<string | null>(null)              // 'tc:<id>' từ chối · 'chot:<id>' chốt giờ
  const [ban, setBan] = useState(false)
  const khoang = loc === 'cho' ? [MOC, homNay] : loc === 'nay' ? [homNay, homNay] : loc === 'qua' ? [congNgay(homNay, -1), congNgay(homNay, -1)] : [tu, den]

  // tai(true) = đổi ngữ cảnh (xoá + tải) · tai(false) = quét nền giữ list cũ
  const tai = useCallback(async (xoa: boolean) => {
    if (xoa) { setRows(null); setBoChon(new Set()); setMo(null) }
    try { setRows(await doiChieu(khoang[0], khoang[1])) } catch (e) { bao(loiCua(e), false); if (xoa) setRows([]) }
  }, [khoang[0], khoang[1]]) // eslint-disable-line
  useEffect(() => { tai(true) }, [tai])

  // nhóm: mỗi ca kèm việc của nó; việc không gắn ca (nhập hộ) đứng riêng. Lọc "chờ duyệt": ca còn chờ hoặc có việc còn chờ.
  const nhom = useMemo(() => {
    const ds = rows ?? []
    const cho = (r: DongCong) => r.duyet === 'cho_duyet'
    const viecCua = (caId: string) => ds.filter((v) => v.loai_dong === 'viec' && v.cham_cong_id === caId)
    const cas = ds.filter((r) => r.loai_dong === 'ca').filter((c) => loc !== 'cho' || cho(c) || viecCua(c.id).some(cho))
      .sort((a, b) => b.ngay.localeCompare(a.ngay) || a.ho_ten.localeCompare(b.ho_ten))
    const caIds = new Set(ds.filter((r) => r.loai_dong === 'ca').map((c) => c.id))
    const le = ds.filter((v) => v.loai_dong === 'viec' && (!v.cham_cong_id || !caIds.has(v.cham_cong_id)) && (loc !== 'cho' || cho(v)))
    return { cas: cas.map((c) => ({ c, viec: viecCua(c.id) })), le }   // việc trong ca: hiện đủ để đọc ngữ cảnh
  }, [rows, loc])

  const choDuyet = (rows ?? []).filter((r) => r.duyet === 'cho_duyet' && (r.loai_dong === 'viec' || nhom.cas.some((x) => x.c.id === r.id)))
  const dangChon = choDuyet.filter((r) => !boChon.has(r.id))
  const doiChon = (id: string) => setBoChon((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const vaTrangThai = (ids: string[], duyet: DongCong['duyet'], lyDo: string | null) =>
    setRows((prev) => prev && prev.map((r) => (ids.includes(r.id) ? { ...r, duyet, ly_do_duyet: lyDo } : r)))

  async function duyetLo() {
    const ca = dangChon.filter((r) => r.loai_dong === 'ca').map((r) => r.id), viec = dangChon.filter((r) => r.loai_dong === 'viec').map((r) => r.id)
    setBan(true)
    try { const n = await duyetCong(ca, viec, 'da_duyet'); vaTrangThai([...ca, ...viec], 'da_duyet', null); bao(`Đã duyệt ${n} dòng`); tai(false) }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  async function tuChoi(r: DongCong, lyDo: string) {
    setBan(true)
    try { await duyetCong(r.loai_dong === 'ca' ? [r.id] : [], r.loai_dong === 'viec' ? [r.id] : [], 'tu_choi', lyDo); vaTrangThai([r.id], 'tu_choi', lyDo); setMo(null); bao('Đã từ chối'); tai(false) }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  async function chot(r: DongCong, vao: string, ra: string) {
    setBan(true)
    try { await chotGio(r.id, r.ngay, vao, ra); setMo(null); bao('Đã chốt giờ — giờ gốc vẫn giữ'); await tai(false) }
    catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }

  const props = { coGhi, boChon, doiChon, mo, setMo, ban, tuChoi, chot }
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        {([['cho', 'Tất cả chờ duyệt'], ['nay', 'Hôm nay'], ['qua', 'Hôm qua'], ['khoang', 'Khoảng ngày']] as [Loc, string][]).map(([k, t]) => (
          <button key={k} onClick={() => setLoc(k)} className={`rounded-full px-3 py-1 text-sm font-medium ${loc === k ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
        ))}
        {loc === 'khoang' && <>
          <input type="date" className={inputCls} value={tu} min={MOC} max={den} onChange={(e) => e.target.value && setTu(e.target.value)} />
          <span className="text-slate-400">→</span>
          <input type="date" className={inputCls} value={den} min={tu} max={homNay} onChange={(e) => e.target.value && setDen(e.target.value)} />
        </>}
        <button onClick={() => tai(false)} className={btnGhost} title="Quét lại">↻</button>
        {coGhi && <button disabled={ban || dangChon.length === 0} onClick={duyetLo} className={`${btnOk} ml-auto`}>Duyệt {dangChon.length} dòng đang chọn</button>}
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <th className="w-8 px-2 py-2"></th><th className="px-2 py-2">TA · ngày</th><th className="px-2 py-2">Có mặt / Việc</th><th className="px-2 py-2">Giờ</th>
              <th className="px-2 py-2">Đối chiếu</th><th className="px-2 py-2">Cờ</th><th className="px-2 py-2">Làm hộ</th><th className="px-2 py-2">Trạng thái</th><th className="w-28 px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan={9} className="p-6 text-center text-slate-400">Đang tải…</td></tr>}
            {rows !== null && nhom.cas.length === 0 && nhom.le.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-slate-400">{loc === 'cho' ? 'Không còn dòng nào chờ duyệt.' : 'Không có dòng nào.'}</td></tr>}
            {nhom.cas.map(({ c, viec }) => <NhomCa key={c.id} c={c} viec={viec} {...props} />)}
            {nhom.le.map((v) => <DongViecQL key={v.id} v={v} hienTen {...props} />)}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Mặc định mọi dòng chờ duyệt đều được chọn. Đọc một lượt, bỏ chọn hoặc từ chối dòng không ổn, rồi duyệt cả lô. Ca chưa có giờ checkout phải chốt giờ trước. Lương chỉ tính việc đã duyệt thuộc ca đã duyệt.</p>
    </div>
  )
}

type DongProps = {
  coGhi: boolean; boChon: Set<string>; doiChon: (id: string) => void; mo: string | null; setMo: (m: string | null) => void; ban: boolean
  tuChoi: (r: DongCong, lyDo: string) => void; chot: (r: DongCong, vao: string, ra: string) => void
}
const Pill = ({ c, children }: { c: string; children: React.ReactNode }) => <span className={`mr-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${c}`}>{children}</span>
const Chk = ({ r, p }: { r: DongCong; p: DongProps }) => (r.duyet === 'cho_duyet' && p.coGhi
  ? <input type="checkbox" aria-label="chọn dòng" checked={!p.boChon.has(r.id)} onChange={() => p.doiChon(r.id)} className="h-4 w-4 accent-indigo-600" /> : null)
const CoPills = ({ co }: { co: string[] }) => <>{co.map((x) => <Pill key={x} c={nhanCo(x).nhe ? 'bg-indigo-50 text-indigo-700' : x === 'quen_ra' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}>{nhanCo(x).t}</Pill>)}</>
const TrangThai = ({ r }: { r: DongCong }) => <><Pill c={PILL_DUYET[r.duyet][1]}>{PILL_DUYET[r.duyet][0]}</Pill>{r.ly_do_duyet && r.duyet !== 'cho_duyet' && <div className="mt-0.5 text-[11px] text-slate-500">{r.ly_do_duyet}</div>}</>

function NhomCa({ c, viec, ...p }: { c: DongCong; viec: DongCong[] } & DongProps) {
  const chot = c.vao_chot || c.ra_chot
  return (
    <>
      <tr className="border-t border-slate-200 bg-slate-50/80 font-medium">
        <td className="px-2 py-2 align-top"><Chk r={c} p={p} /></td>
        <td className="px-2 py-2 align-top"><div className="font-semibold text-slate-800">{c.ho_ten}</div><div className="text-xs text-slate-500">{thuCuaNgay(c.ngay)} {ddmmVN(c.ngay)}</div></td>
        <td className="px-2 py-2 align-top text-slate-700">Có mặt<div className="text-xs font-normal text-slate-500">{c.nguon === 'nhap_ho' ? 'quản lý nhập hộ' : c.khai_bu ? 'TA khai bù' : 'TA bấm trên app'}</div></td>
        <td className="whitespace-nowrap px-2 py-2 align-top text-slate-700">{gioVN(c.vao_at)} – {c.ra_at ? gioVN(c.ra_at) : '—'}{chot && <div className="text-xs font-normal text-indigo-700">chốt: {gioVN(c.vao_chot ?? c.vao_at)} – {gioVN(c.ra_chot ?? c.ra_at)}</div>}</td>
        <td className="px-2 py-2 align-top text-xs font-normal text-slate-400">không áp dụng</td>
        <td className="px-2 py-2 align-top"><CoPills co={c.co} /></td>
        <td className="px-2 py-2 align-top"></td>
        <td className="px-2 py-2 align-top"><TrangThai r={c} /></td>
        <td className="px-2 py-2 align-top">{p.coGhi && <div className="flex flex-col gap-1">
          <button className={btnGhost} onClick={() => p.setMo(p.mo === 'chot:' + c.id ? null : 'chot:' + c.id)}>Chốt giờ</button>
          {c.duyet === 'cho_duyet' && <button className={btnDanger} onClick={() => p.setMo(p.mo === 'tc:' + c.id ? null : 'tc:' + c.id)}>Từ chối</button>}
        </div>}</td>
      </tr>
      {p.mo === 'chot:' + c.id && <ChotGioRow c={c} ban={p.ban} onLuu={(v, r) => p.chot(c, v, r)} />}
      {p.mo === 'tc:' + c.id && <TuChoiRow ban={p.ban} onLuu={(ld) => p.tuChoi(c, ld)} />}
      {viec.map((v) => <DongViecQL key={v.id} v={v} {...p} />)}
    </>
  )
}

function DongViecQL({ v, hienTen, ...p }: { v: DongCong; hienTen?: boolean } & DongProps) {
  return (
    <>
      <tr className="border-t border-slate-100">
        <td className="px-2 py-2 align-top"><Chk r={v} p={p} /></td>
        <td className="px-2 py-2 align-top text-xs text-slate-500">{hienTen ? <><div className="text-sm font-semibold text-slate-800">{v.ho_ten}</div>{thuCuaNgay(v.ngay)} {ddmmVN(v.ngay)}</> : null}</td>
        <td className="px-2 py-2 align-top"><span className="text-slate-800">{v.ten_loai}</span>{v.ten_lop && <b className="ml-1 text-slate-900">· {v.ten_lop}</b>}
          {(v.hoc_sinh || v.ghi_chu) && <div className="text-xs text-slate-500">{[v.hoc_sinh, v.ghi_chu].filter(Boolean).join(' · ')}</div>}</td>
        <td className="whitespace-nowrap px-2 py-2 align-top text-slate-700">{hm(v.gio_bat_dau)}–{hm(v.gio_ket_thuc)}</td>
        <td className="px-2 py-2 align-top">{v.khop ? <Pill c="bg-emerald-100 text-emerald-700">Đã khớp</Pill> : null}</td>
        <td className="px-2 py-2 align-top"><CoPills co={v.co} /></td>
        <td className="px-2 py-2 align-top text-slate-700">{v.lam_ho ?? ''}</td>
        <td className="px-2 py-2 align-top"><TrangThai r={v} /></td>
        <td className="px-2 py-2 align-top">{p.coGhi && v.duyet === 'cho_duyet' && <button className={btnDanger} onClick={() => p.setMo(p.mo === 'tc:' + v.id ? null : 'tc:' + v.id)}>Từ chối</button>}</td>
      </tr>
      {p.mo === 'tc:' + v.id && <TuChoiRow ban={p.ban} onLuu={(ld) => p.tuChoi(v, ld)} />}
    </>
  )
}

function TuChoiRow({ ban, onLuu }: { ban: boolean; onLuu: (lyDo: string) => void }) {
  const [ld, setLd] = useState('')
  return (
    <tr><td></td><td colSpan={8} className="px-2 pb-2">
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
        <span className="text-sm text-red-700">Lý do từ chối</span>
        <input autoFocus className={`${inputCls} min-w-[280px] flex-1`} value={ld} onChange={(e) => setLd(e.target.value)} placeholder="bắt buộc — TA sẽ thấy lý do này" />
        <button disabled={ban || !ld.trim()} onClick={() => onLuu(ld.trim())} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40">Xác nhận từ chối</button>
      </div>
    </td></tr>
  )
}

function ChotGioRow({ c, ban, onLuu }: { c: DongCong; ban: boolean; onLuu: (vao: string, ra: string) => void }) {
  const [vao, setVao] = useState(gioVN(c.vao_chot ?? c.vao_at))
  const [ra, setRa] = useState(c.ra_chot || c.ra_at ? gioVN(c.ra_chot ?? c.ra_at) : '')
  return (
    <tr><td></td><td colSpan={8} className="px-2 pb-2">
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm">
        <span className="text-indigo-800">Giờ gốc giữ nguyên, giờ chốt lưu riêng.</span>
        Checkin <input type="time" className={inputCls} value={vao} onChange={(e) => setVao(e.target.value)} />
        Checkout <input type="time" className={inputCls} value={ra} onChange={(e) => setRa(e.target.value)} />
        <button disabled={ban || !vao || !ra} onClick={() => onLuu(vao, ra)} className={btnPrimary}>Lưu giờ chốt</button>
      </div>
    </td></tr>
  )
}

// ═══════════════════════════════ THIẾU CÔNG ═══════════════════════════════
function TabThieu({ coGhi, bao, onNhapHo }: { coGhi: boolean; bao: (t: string, ok?: boolean) => void; onNhapHo: (m: NhapHoMoi) => void }) {
  const homNay = homNayVN()
  const [tu, setTu] = useState(MOC)
  const [den, setDen] = useState(homNay)
  const [rows, setRows] = useState<ThieuCong[] | null>(null)
  useEffect(() => { setRows(null); thieuCong(tu, den).then(setRows).catch((e) => { bao(loiCua(e), false); setRows([]) }) }, [tu, den, bao])
  const ngays = [...new Set((rows ?? []).map((r) => r.ngay))].sort().reverse()
  return (
    <div className="flex flex-col gap-3">
      <div className={`${card} flex flex-wrap items-center gap-2 px-3 py-2`}>
        <input type="date" className={inputCls} value={tu} min={MOC} max={den} onChange={(e) => e.target.value && setTu(e.target.value)} />
        <span className="text-slate-400">→</span>
        <input type="date" className={inputCls} value={den} min={tu} max={homNay} onChange={(e) => e.target.value && setDen(e.target.value)} />
        <span className="ml-auto text-sm text-slate-500">{rows ? `${rows.length} buổi / ca chưa ai ghi công` : '…'}</span>
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Ngày</th><th className="px-3 py-2">Buổi / ca</th><th className="px-3 py-2">Giờ</th><th className="px-3 py-2">TA phụ trách hôm đó</th><th className="w-28 px-3 py-2"></th>
          </tr></thead>
          <tbody>
            {rows === null && <tr><td colSpan={5} className="p-6 text-center text-slate-400">Đang tải…</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">Không thiếu buổi nào.</td></tr>}
            {ngays.map((d) => (rows ?? []).filter((r) => r.ngay === d).map((r, i) => (
              <tr key={(r.buoi_hoc_id ?? r.ca_bo_tro_id) + ''} className={`border-t ${i === 0 ? 'border-slate-200' : 'border-slate-100'}`}>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">{i === 0 ? `${thuCuaNgay(d)} ${ddmmVN(d)}` : ''}</td>
                <td className="px-3 py-2 text-slate-800">{r.loai === 'buoi' ? 'Buổi lớp ' : ''}<b>{r.ten}</b></td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-700">{hm(r.gio_bat_dau)}–{hm(r.gio_ket_thuc)}</td>
                <td className="px-3 py-2 text-slate-700">{r.nguoi_phu_trach ?? <span className="text-amber-700">chưa phân TA</span>}</td>
                <td className="px-3 py-2">{coGhi && <button className={btnGhost} onClick={() => onNhapHo({ ngay: r.ngay, loai: r.loai === 'buoi' ? 'tro_giang' : r.loai === 'ca' ? 'bo_tro_dinh_ki' : r.loai, lop_id: r.lop_id, bat: hm(r.gio_bat_dau), ket: hm(r.gio_ket_thuc), ten_ta: r.nguoi_phu_trach })}>Nhập hộ…</button>}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Mỗi buổi lớp đã diễn ra phải có một phiếu công trợ giảng; mỗi ca trực bổ trợ đã xếp phải có phiếu công; mỗi buổi bù / yếu / đuổi có em đến (không nằm trong ca trực của chính người đứng lớp) cũng phải có phiếu công. Buổi huỷ không tính, buổi chưa kết thúc không tính, trước 01/10 không tính. Danh sách tự suy từ lịch — TA khai (kể cả khai lùi tháng 10) là dòng tự biến mất. TA phụ trách = người được phân công lớp ĐÚNG NGÀY đó.</p>
    </div>
  )
}

// ═══════════════════════════════ NHẬP HỘ ═══════════════════════════════
function NhapHo({ moi, bao, onXong }: { moi: NhapHoMoi; bao: (t: string, ok?: boolean) => void; onXong: () => void }) {
  const homNay = homNayVN()
  const [ns, setNs] = useState<string | null>(null)
  const [dsNs, setDsNs] = useState<{ id: string; label: string; img?: string | null }[]>([])
  const [loai, setLoai] = useState<LoaiViec[]>([])
  const [lop, setLop] = useState<{ id: string; label: string; sub?: string }[]>([])
  const [ngay, setNgay] = useState(moi?.ngay ?? congNgay(homNay, -2))
  const [taoCa, setTaoCa] = useState(true)
  const [vao, setVao] = useState(moi?.bat && moi.bat !== '?' ? moi.bat : '17:30')
  const [ra, setRa] = useState(moi?.ket && moi.ket !== '?' ? moi.ket : '21:00')
  const [ma, setMa] = useState(moi?.loai ?? 'tro_giang')
  const [lopId, setLopId] = useState<string | null>(moi?.lop_id ?? null)
  const [bat, setBat] = useState(moi?.bat && moi.bat !== '?' ? moi.bat : '18:00')
  const [ket, setKet] = useState(moi?.ket && moi.ket !== '?' ? moi.ket : '19:30')
  const [hs, setHs] = useState('')
  const [lyDo, setLyDo] = useState('')
  const [ban, setBan] = useState(false)
  useEffect(() => {
    dsNhanSuDangLam().then((d) => {
      setDsNs(d.map((x) => ({ id: x.id, label: x.ho_ten, img: x.anh_url })))
      const goiY = moi?.ten_ta ? d.filter((x) => x.ho_ten === moi.ten_ta) : []   // gợi ý = TA phụ trách hôm đó (sửa được)
      if (goiY.length === 1) setNs(goiY[0].id)
    }).catch(() => {})
    dsLoaiViec().then(setLoai).catch(() => {})
    dsLop().then((d) => setLop(d.map((x) => ({ id: x.id, label: x.ten_lop, sub: x.mon })))).catch(() => {})
  }, []) // eslint-disable-line
  const L = loai.find((l) => l.ma === ma)
  const thieu = !ns || !lyDo.trim() || (L?.can_lop && !lopId) || (taoCa && (!vao || !ra))
  async function luu() {
    if (!ns) return
    setBan(true)
    try {
      if (taoCa) await nhapHoCa(ns, ngay, vao, ra, lyDo.trim())
      await nhapHoViec(ns, { loai: ma, ngay, lop: lopId, bat, ket, hs }, lyDo.trim())
      bao('Đã nhập hộ (ghi là đã duyệt, có vết người nhập)'); onXong()
    } catch (e) { bao(loiCua(e), false) } finally { setBan(false) }
  }
  return (
    <div className={`${card} mb-3 p-3`}>
      <p className="mb-2 text-sm font-semibold text-slate-800">Nhập hộ — TA quá hạn tự khai (người nhập chịu trách nhiệm ⇒ dòng ghi là đã duyệt)</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2 text-xs font-medium text-slate-500">
        <div className="flex flex-col gap-1">Trợ giảng<SearchSelect value={ns} onChange={setNs} options={dsNs} avatars placeholder="Gõ tên TA…" /></div>
        <label className="flex flex-col gap-1">Ngày<input type="date" className={inputCls} value={ngay} max={homNay} onChange={(e) => e.target.value && setNgay(e.target.value)} /></label>
        <label className="flex flex-col gap-1">Loại việc<select className={inputCls} value={ma} onChange={(e) => setMa(e.target.value)}>{loai.map((l) => <option key={l.ma} value={l.ma}>{l.ten}</option>)}</select></label>
        <div className="flex flex-col gap-1">Lớp<SearchSelect value={lopId} onChange={setLopId} options={lop} placeholder="Gõ tên lớp…" /></div>
        <label className="flex flex-col gap-1">Việc từ<input type="time" className={inputCls} value={bat} onChange={(e) => setBat(e.target.value)} /></label>
        <label className="flex flex-col gap-1">Việc đến<input type="time" className={inputCls} value={ket} onChange={(e) => setKet(e.target.value)} /></label>
        {L?.can_hs && <label className="flex flex-col gap-1">Học sinh<input className={inputCls} value={hs} onChange={(e) => setHs(e.target.value)} /></label>}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={taoCa} onChange={(e) => setTaoCa(e.target.checked)} className="accent-indigo-600" /> Tạo cả ca có mặt</label>
        {taoCa && <>Checkin <input type="time" className={inputCls} value={vao} onChange={(e) => setVao(e.target.value)} /> Checkout <input type="time" className={inputCls} value={ra} onChange={(e) => setRa(e.target.value)} /></>}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input className={`${inputCls} min-w-[320px] flex-1`} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (bắt buộc) — vd: TA báo quên, đã xác minh với GV" />
        <button disabled={ban || !!thieu} onClick={luu} className={btnPrimary}>Lưu nhập hộ</button>
        <button onClick={onXong} className={btnGhost}>Huỷ</button>
      </div>
    </div>
  )
}
