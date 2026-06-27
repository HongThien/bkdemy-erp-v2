// Màn BỔ TRỢ ĐUỔI — HS mới chậm hơn chương trình lớp → học đuổi (mig 0055). Gu Apple-clean.
// 3 tab: Cần đuổi (case chưa nằm trong buổi đang mở) / Đã xếp (buổi mở) / Hoàn thành (buổi đóng).
// Buổi đuổi: điểm danh + nhận xét (KHÔNG ET). 2 nút: Hoàn thành buổi · per-HS Hoàn thành KHÓA (rời luồng).
import { useEffect, useMemo, useState } from 'react'
import {
  listCanDuoi, listCaDuoi, taoBuoiDuoi, themHSVaoBuoiDuoi, buoiDuoiSapToi, goiYBuoiDuoi, themCaseDuoi,
  hoanThanhKhoaDuoi, xoaCaseDuoi, timHocSinhDuoi, lopCuaHS, demTabDuoi, type CanDuoiItem, type CaDuoi,
} from '../../lib/botro_duoi'
import { getRoster, getBuoi, huyBuoi, xoaHSKhoiBuoi, diemDanh, getDanhGia, setNhanXet, dongDanhGia, moLaiDanhGia, type BuoiHocHS } from '../../lib/gami'
import SuaBuoiModal from './SuaBuoiModal'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { homNayVN } from '../../lib/tuan'
import SearchSelect from '../../components/SearchSelect'

type Tab = 'canduoi' | 'daxep' | 'xong'
const TABS: { k: Tab; ten: string }[] = [{ k: 'canduoi', ten: 'Cần đuổi' }, { k: 'daxep', ten: 'Đã xếp' }, { k: 'xong', ten: 'Hoàn thành' }]
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const ddmm = (s?: string | null) => (s ? s.split('-').reverse().slice(0, 2).join('/') : '')

export default function BoTroDuoiScreen() {
  const [tab, setTab] = useState<Tab>('canduoi')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [canduoi, setCanduoi] = useState<CanDuoiItem[]>([])
  const [cas, setCas] = useState<CaDuoi[]>([])
  const [loading, setLoading] = useState(true)
  const [xepItem, setXepItem] = useState<CanDuoiItem | null>(null)
  const [them, setThem] = useState(false)
  const [detail, setDetail] = useState<{ ca: CaDuoi; readOnly: boolean } | null>(null)
  const [suaBuoi, setSuaBuoi] = useState<CaDuoi | null>(null)

  async function reloadCounts() { try { setCounts(await demTabDuoi()) } catch { /* */ } }
  async function reload() {
    setLoading(true)
    try {
      if (tab === 'canduoi') setCanduoi(await listCanDuoi())
      else setCas(await listCaDuoi(tab === 'xong'))
    } catch { /* */ } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tab]) // eslint-disable-line
  useEffect(() => { reloadCounts() }, [])
  const refresh = async () => { await reload(); await reloadCounts() }

  async function onHoanThanhKhoa(caseId: string, ten: string) {
    if (!confirm(`Hoàn thành cả KHÓA bổ trợ đuổi của ${ten}? HS sẽ rời khỏi luồng (không hiện ở Cần đuổi nữa).`)) return
    try { await hoanThanhKhoaDuoi(caseId); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function onBoCo(c: CanDuoiItem) {
    if (!confirm(`Bỏ cờ "cần đuổi" của ${c.ho_ten}? (dùng khi gắn nhầm)`)) return
    try { await xoaCaseDuoi(c.caseId); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (detail) return <BuoiDuoiDetail ca={detail.ca} readOnly={detail.readOnly} onClose={() => { setDetail(null); refresh() }} onHoanThanhKhoa={onHoanThanhKhoa} />

  return (
    <div className="h-full overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <h2 className="text-[22px] font-semibold text-slate-800">Bổ trợ · Đuổi chương trình</h2>
            <p className="text-[13px] text-slate-500">HS mới chậm hơn lớp → xếp buổi đuổi (điểm danh + nhận xét) → bắt kịp thì hoàn thành khóa</p>
          </div>
          <button onClick={() => setThem(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm HS cần đuổi</button>
        </div>

        <div className="mb-4 inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => {
            const on = tab === t.k
            return (
              <button key={t.k} onClick={() => setTab(t.k)} className={`rounded-xl px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {t.ten}{counts[t.k] != null ? <span className={`ml-1.5 rounded-full px-1.5 text-[12px] ${on ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{counts[t.k]}</span> : null}
              </button>
            )
          })}
        </div>

        {loading ? <div className="p-8 text-[14px] text-slate-400">Đang tải…</div>
          : tab === 'canduoi' ? (
            canduoi.length === 0 ? <Empty t="Không có HS nào cần bổ trợ đuổi." />
              : (
                <div className="space-y-2.5">
                  {canduoi.map((c) => (
                    <div key={c.caseId} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="min-w-[180px] flex-1">
                        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div>
                        <div className="text-[16px] font-semibold text-slate-800">{c.ho_ten}</div>
                        <div className="text-[12px] text-slate-400">{c.ma_hs}{c.nguon === 'tuyen_sinh' ? ' · từ tuyển sinh' : ''}</div>
                      </div>
                      <div className="min-w-[120px] rounded-xl bg-slate-50 px-3 py-2">
                        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp đuổi</div>
                        <div className="text-[15px] font-semibold text-slate-700">{c.lop}</div>
                        <div className="text-[12px] text-slate-400">{c.mon}</div>
                      </div>
                      {c.ly_do && <div className="min-w-[140px] max-w-[260px] rounded-xl bg-slate-50 px-3 py-2"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lý do</div><div className="text-[13px] text-slate-600">{c.ly_do}</div></div>}
                      <div className="ml-auto flex shrink-0 flex-wrap gap-2">
                        <button onClick={() => setXepItem(c)} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">Xếp buổi đuổi</button>
                        <button onClick={() => onHoanThanhKhoa(c.caseId, c.ho_ten)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-[13px] font-medium text-emerald-700 hover:border-emerald-300">✓ Hoàn thành khóa</button>
                        <button onClick={() => onBoCo(c)} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Bỏ cờ</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
          ) : (
            cas.length === 0 ? <Empty t={tab === 'daxep' ? 'Chưa có buổi đuổi nào đang chờ.' : 'Chưa có buổi đuổi nào hoàn thành.'} /> : (
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                {cas.map((ca) => (
                  <div key={ca.id} role="button" onClick={() => setDetail({ ca, readOnly: tab === 'xong' })} className="cursor-pointer rounded-2xl border-l-4 border-l-orange-400 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-slate-800">Buổi đuổi · {ddmm(ca.ngay)}</span>
                      <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">{ca.hs.length} HS</span>
                      {tab !== 'xong' && <button onClick={(e) => { e.stopPropagation(); setSuaBuoi(ca) }} title="Sửa buổi (ngày/giờ/phòng/GV/TA)" className="rounded border border-slate-200 px-1.5 py-0.5 text-[12px] text-slate-400 hover:border-indigo-300 hover:text-indigo-700">✎</button>}
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">{ca.gio_bat_dau?.slice(0, 5) || '—'}{ca.phong ? ` · ${ca.phong}` : ''}</div>
                    <div className="mt-2 flex flex-wrap gap-1">{ca.hs.slice(0, 6).map((h) => <span key={h.hoc_sinh_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{h.ho_ten}{h.lop ? ` · ${h.lop}` : ''}</span>)}{ca.hs.length > 6 && <span className="text-[11px] text-slate-400">+{ca.hs.length - 6}</span>}</div>
                    <div className="mt-2"><span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${ca.danh_gia_xong_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>Nhận xét {ca.danh_gia_xong_at ? '✓ xong' : '…'}</span></div>
                  </div>
                ))}
              </div>
            )
          )}
      </div>

      {suaBuoi && <SuaBuoiModal buoi={suaBuoi} onClose={() => setSuaBuoi(null)} onSaved={async () => { setSuaBuoi(null); await refresh() }} />}
      {xepItem && <XepDuoiModal item={xepItem} onClose={() => setXepItem(null)} onDone={async () => { setXepItem(null); await refresh() }} />}
      {them && <ThemHSModal onClose={() => setThem(false)} onDone={async () => { setThem(false); await refresh() }} />}
    </div>
  )
}

const Empty = ({ t }: { t: string }) => <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-400 shadow-sm">{t}</div>

function Modal({ title, onClose, children, maxW = 'max-w-[460px]' }: { title: string; onClose: () => void; children: React.ReactNode; maxW?: string }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full ${maxW} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[17px] font-semibold text-slate-800">{title}</div>{children}
      </div>
    </div>
  )
}

// Thêm HS cần đuổi thủ công (path 2). Chọn HS → chọn lớp đang học → lý do.
function ThemHSModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [q, setQ] = useState('')
  const [res, setRes] = useState<{ id: string; ma_hs: string | null; ho_ten: string }[]>([])
  const [open, setOpen] = useState(false)
  const [hs, setHs] = useState<{ id: string; ho_ten: string } | null>(null)
  const [lops, setLops] = useState<{ id: string; ten_lop: string; mon: string }[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!q.trim()) { setRes([]); return }
    let live = true
    const t = setTimeout(() => { timHocSinhDuoi(q).then((r) => { if (live) { setRes(r); setOpen(true) } }).catch(() => {}) }, 200)
    return () => { live = false; clearTimeout(t) }
  }, [q])
  function pick(h: { id: string; ma_hs: string | null; ho_ten: string }) {
    setHs(h); setQ(h.ho_ten); setOpen(false)
    lopCuaHS(h.id).then((ls) => { setLops(ls); setLopId(ls[0]?.id ?? null) }).catch(() => {})
  }
  async function go() {
    if (!hs) { alert('Chọn học sinh'); return }
    setBusy(true)
    try { await themCaseDuoi({ hoc_sinh_id: hs.id, lop_id: lopId, ly_do: lyDo.trim() || null }); onDone() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Thêm HS cần bổ trợ đuổi" onClose={onClose} maxW="max-w-[520px]">
      <div className="space-y-3">
        <div className="relative">
          <label className="mb-1 block text-[13px] font-medium text-slate-600">Học sinh *</label>
          <input className={inputCls} value={q} onChange={(e) => { setQ(e.target.value); setHs(null) }} placeholder="🔎 Tìm tên / mã HS…" autoFocus />
          {open && res.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {res.map((h) => (
                <button key={h.id} onClick={() => pick(h)} className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-indigo-50">
                  <span className="font-medium text-slate-800">{h.ho_ten}</span><span className="text-[12px] text-slate-400">{h.ma_hs}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-slate-600">Lớp đuổi (lớp HS đang chậm)</label>
          <select className={inputCls} value={lopId ?? ''} onChange={(e) => setLopId(e.target.value || null)} disabled={!hs}>
            <option value="">{hs ? '— chọn lớp —' : '— chọn HS trước —'}</option>
            {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop} · {l.mon}</option>)}
          </select>
        </div>
        <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Lý do (tuỳ)</label><input className={inputCls} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="vd: vào lớp giữa chừng, chậm 3 chuyên đề" /></div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? '…' : 'Thêm vào Cần đuổi'}</button>
      </div>
    </Modal>
  )
}

// Xếp 1 case vào buổi đuổi: tạo buổi mới hoặc chọn buổi sẵn. Mặc định GV/TA từ lớp đuổi.
function XepDuoiModal({ item, onClose, onDone }: { item: CanDuoiItem; onClose: () => void; onDone: () => void }) {
  const [mode, setMode] = useState<'moi' | 'cosan'>('moi')
  const [ngay, setNgay] = useState(homNayVN())
  const [gio, setGio] = useState('')
  const [phong, setPhong] = useState('')
  const [gv, setGv] = useState<string | null>(null)
  const [ta, setTa] = useState<string | null>(null)
  const [pickId, setPickId] = useState<string | null>(null)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [sapToi, setSapToi] = useState<CaDuoi[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    listNhanSu().then(setNss).catch(() => {}); buoiDuoiSapToi().then(setSapToi).catch(() => {})
    goiYBuoiDuoi(item.lop_id).then((g) => { setGv(g.gv_id); setTa(g.ta_id) }).catch(() => {})
  }, [item.lop_id]) // eslint-disable-line
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  async function go() {
    setBusy(true)
    try {
      let buoiId = pickId
      if (mode === 'moi') {
        if (!ngay) { alert('Chọn ngày'); setBusy(false); return }
        buoiId = await taoBuoiDuoi({ ngay, gio_bat_dau: gio || null, phong: phong || null, nguoi_day: gv, nguoi_day_tg: ta })
      } else if (!buoiId) { alert('Chọn buổi đuổi có sẵn'); setBusy(false); return }
      await themHSVaoBuoiDuoi(buoiId!, [{ hoc_sinh_id: item.hoc_sinh_id, caseId: item.caseId }])
      onDone()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Xếp buổi đuổi" onClose={onClose} maxW="max-w-[760px]">
      <div className="mb-4 flex flex-wrap gap-2.5">
        <div className="min-w-[160px] flex-1 rounded-xl bg-slate-50 px-3.5 py-2.5"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div><div className="text-[16px] font-semibold text-slate-800">{item.ho_ten}</div></div>
        <div className="min-w-[120px] rounded-xl bg-slate-50 px-3.5 py-2.5"><div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp đuổi</div><div className="text-[16px] font-semibold text-slate-700">{item.lop}</div></div>
      </div>
      <div className="mb-3 inline-flex rounded-lg border border-slate-200 p-0.5 text-[13px]">
        <button onClick={() => setMode('moi')} className={`rounded-md px-3 py-1 font-medium ${mode === 'moi' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Tạo buổi mới</button>
        <button onClick={() => setMode('cosan')} className={`rounded-md px-3 py-1 font-medium ${mode === 'cosan' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Chọn buổi có sẵn</button>
      </div>
      {mode === 'moi' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Ngày *</label><input type="date" className={inputCls} value={ngay} onChange={(e) => setNgay(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Giờ</label><input type="time" className={inputCls} value={gio} onChange={(e) => setGio(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Phòng</label><input className={inputCls} value={phong} onChange={(e) => setPhong(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">GV (nhận xét)</label><SearchSelect value={gv} onChange={setGv} options={nsOpts} placeholder="Chọn GV…" /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">TA</label><SearchSelect value={ta} onChange={setTa} options={nsOpts} placeholder="Chọn TA…" /></div>
          </div>
        </div>
      ) : (
        <div className="max-h-64 space-y-2 overflow-auto">
          {sapToi.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có buổi đuổi nào đang chờ.</p> : sapToi.map((c) => (
            <button key={c.id} onClick={() => setPickId(c.id)} className={`block w-full rounded-lg border p-3 text-left text-[13px] ${pickId === c.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <b>Buổi đuổi · {ddmm(c.ngay)}</b> {c.gio_bat_dau?.slice(0, 5)} {c.phong} · {c.hs.length} HS
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? '…' : 'Xếp vào buổi đuổi'}</button>
      </div>
    </Modal>
  )
}

// ── Detail buổi đuổi: điểm danh + nhận xét per-HS (KHÔNG ET). Hoàn thành buổi · per-HS Hoàn thành KHÓA. ──
function BuoiDuoiDetail({ ca, readOnly, onClose, onHoanThanhKhoa }: { ca: CaDuoi; readOnly: boolean; onClose: () => void; onHoanThanhKhoa: (caseId: string, ten: string) => void }) {
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [nx, setNx] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [sua, setSua] = useState(false)
  const [meta, setMeta] = useState({ ngay: ca.ngay, gio_bat_dau: ca.gio_bat_dau, phong: ca.phong, nguoi_day: ca.nguoi_day, nguoi_day_tg: ca.nguoi_day_tg })
  const dgXong = !!ca.danh_gia_xong_at
  const lopDuoiCua = (hsId: string) => ca.hs.find((h) => h.hoc_sinh_id === hsId)?.lop ?? ''

  async function reload() {
    const [b, r, dg] = await Promise.all([getBuoi(ca.id), getRoster(ca.id), getDanhGia(ca.id)])
    if (b) setMeta({ ngay: (b as any).ngay, gio_bat_dau: (b as any).gio_bat_dau, phong: (b as any).phong, nguoi_day: (b as any).nguoi_day, nguoi_day_tg: (b as any).nguoi_day_tg })
    setRoster(r)
    const m: Record<string, string> = {}
    for (const [hsId, v] of Object.entries(dg)) m[hsId] = (v as any).nhan_xet ?? ''
    setNx(m)
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  async function setDD(r: BuoiHocHS, tt: 'co_mat' | 'vang') { try { await diemDanh(r.id, tt); await reload() } catch (e: any) { alert(e.message) } }
  async function onHuy() { const ly = prompt('Lý do huỷ buổi đuổi?'); if (!ly) return; try { await huyBuoi(ca.id, ly); onClose() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function onXoaHS(r: BuoiHocHS) { if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi đuổi?`)) return; try { await xoaHSKhoiBuoi(r); await reload() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function luuNhanXet(hsId: string) { try { await setNhanXet(ca.id, hsId, nx[hsId] ?? '') } catch (e: any) { alert(e.message) } }
  async function toggleDong() {
    setBusy(true)
    try { if (dgXong) await moLaiDanhGia(ca.id); else await dongDanhGia(ca.id); onClose() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f7]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-slate-800">‹ Bổ trợ đuổi</button>
        <span className="text-[15px] font-semibold text-slate-800">Buổi đuổi · {ddmm(meta.ngay)} · {meta.gio_bat_dau?.slice(0, 5)}{meta.phong ? ` · ${meta.phong}` : ''}</span>
        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">{ca.hs.length} HS</span>
        {!readOnly && <button onClick={() => setSua(true)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-700">✎ Sửa buổi</button>}
        {!readOnly && <button onClick={onHuy} className="rounded-lg border border-rose-200 px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Huỷ buổi</button>}
        {!readOnly && (
          <button onClick={toggleDong} disabled={busy} className={`ml-auto rounded-lg px-4 py-2 text-[14px] font-medium disabled:opacity-50 ${dgXong ? 'border border-amber-300 text-amber-700 hover:bg-amber-50' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>{dgXong ? '↩ Mở lại buổi' : '✓ Hoàn thành buổi'}</button>
        )}
        {readOnly && <span className="ml-auto rounded-lg bg-emerald-100 px-3 py-1.5 text-[13px] font-medium text-emerald-700">✓ Buổi đã hoàn thành</span>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px] space-y-3">
          {roster.length === 0 ? <Empty t="Buổi chưa có HS." /> : roster.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-semibold text-slate-800">{r.hoc_sinh?.ho_ten}</span>
                {lopDuoiCua(r.hoc_sinh_id) && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">đuổi lớp {lopDuoiCua(r.hoc_sinh_id)}</span>}
                <div className="ml-auto flex gap-1.5">
                  <button disabled={readOnly} onClick={() => setDD(r, 'co_mat')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'co_mat' ? 'bg-emerald-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Có mặt</button>
                  <button disabled={readOnly} onClick={() => setDD(r, 'vang')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'vang' ? 'bg-rose-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Vắng</button>
                  {r.bo_tro_duoi_id && !readOnly && (
                    <button onClick={() => onHoanThanhKhoa(r.bo_tro_duoi_id!, r.hoc_sinh?.ho_ten ?? 'HS')} title="HS đã bắt kịp → kết thúc khóa đuổi" className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700 hover:border-emerald-300">✓ Hoàn thành khóa</button>
                  )}
                  {!readOnly && <button onClick={() => onXoaHS(r)} title="Gỡ HS khỏi buổi đuổi" className="rounded px-1.5 py-1 text-[12px] text-slate-300 hover:bg-rose-50 hover:text-rose-600">✕</button>}
                </div>
              </div>
              <textarea value={nx[r.hoc_sinh_id] ?? ''} disabled={readOnly} onChange={(e) => setNx((m) => ({ ...m, [r.hoc_sinh_id]: e.target.value }))} onBlur={() => luuNhanXet(r.hoc_sinh_id)}
                placeholder="Nhận xét sau buổi (tiến độ bắt kịp, điểm cần lưu ý…)" className="mt-2.5 h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50" />
            </div>
          ))}
        </div>
      </div>
      {sua && <SuaBuoiModal buoi={{ id: ca.id, ...meta }} onClose={() => setSua(false)} onSaved={() => { setSua(false); reload() }} />}
    </div>
  )
}
