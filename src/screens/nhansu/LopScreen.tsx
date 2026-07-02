import { useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import {
  listLop, createLop, updateLop, deleteLop,
  listPhanCongByLop, addPhanCong, removePhanCong,
  listTKB, addTKB, dongTKB,
  listHSCuaLop, ghiDanh, roiLop, setBandGhiDanh, setNgayVao as setNgayVaoApi, listHSChuaCoLopMon, todayVN,
  listNhanSu, listMucNangLuc, thongKeLop,
  type Lop, type PhanCongLop, type ThoiKhoaBieu, type HSTrongLop, type NhanSu, type HocSinh, type MucNangLuc, type LopThongKe,
} from '../../lib/nhansu'
import { Shell, Field, inp, Seg, Actions, BacChip } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'

const BAC_OPTS = ['S', 'A', 'B', 'C'] as const

// Màu CHỦ ĐẠO theo MÔN (Thùy chốt 06-11) — bậc/hệ phân biệt bằng badge chữ nhỏ, KHÔNG bằng màu chính.
const MON_TONE: Record<string, { chip: string; letter: string }> = {
  'Toán': { chip: 'bg-indigo-600', letter: 'T' },
  'Văn': { chip: 'bg-rose-500', letter: 'V' },
  'Anh': { chip: 'bg-emerald-600', letter: 'A' },
  'KHTN': { chip: 'bg-amber-500', letter: 'K' },
}
const monTone = (mon: string) => MON_TONE[mon] ?? { chip: 'bg-slate-500', letter: mon[0]?.toUpperCase() ?? '?' }
const MonChip = ({ mon }: { mon: string }) => (
  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[15px] font-bold text-white shadow-sm ${monTone(mon).chip}`} title={`Môn ${mon}`}>
    {monTone(mon).letter}
  </span>
)
// Hệ/bậc = VIỀN + NỀN card (màu nhạt theo hệ màu BacChip: S tím · A xanh · B teal · C vàng)
const BAC_CARD: Record<string, string> = {
  S: 'border-violet-300 bg-violet-50/50 hover:border-violet-400',
  A: 'border-blue-300 bg-blue-50/50 hover:border-blue-400',
  B: 'border-teal-300 bg-teal-50/50 hover:border-teal-400',
  C: 'border-amber-300 bg-amber-50/50 hover:border-amber-400',
}
const bacCard = (bac: string | null) => (bac && BAC_CARD[bac]) || 'border-slate-200 bg-white hover:border-indigo-300'
// Thứ tự trái→phải trong mỗi khu: S → A → B → C (rồi theo số 1,2,3 trong tên lớp)
const BAC_ORDER: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 }

// Card lớp: sĩ số · GV/TG · badge "đủ thông tin chưa" (GV chính, TG, TKB, band đủ)
function LopCard({ l, tk, onOpen }: { l: Lop; tk?: LopThongKe; onOpen: () => void }) {
  const thieu: string[] = []
  if (tk) {
    if (!tk.gvChinh) thieu.push('GV chính')
    if (!tk.tg) thieu.push('TG')
    if (!tk.coTkb) thieu.push('TKB')
    if (tk.siSo > 0 && tk.bandDu < tk.siSo) thieu.push(`band ${tk.bandDu}/${tk.siSo}`)
  }
  const du = tk && thieu.length === 0
  return (
    <button onClick={onOpen} className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition hover:shadow-sm ${bacCard(l.bac)}`}>
      <div className="flex items-center gap-2.5">
        {l.bac ? <BacChip bac={l.bac} /> : <div className="h-8 w-8 rounded-lg bg-slate-100" />}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-slate-900">{l.ten_lop}</div>
          <div className="text-[12px] text-slate-400">khối {l.khoi}{l.co_so ? ` · ${l.co_so}` : ''}{l.bac ? ` · hệ ${l.bac}` : ''}</div>
        </div>
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-center text-[12px] font-semibold text-slate-600">{tk?.siSo ?? 0}<span className="ml-0.5 text-[10px] font-normal text-slate-400">HS</span></span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-slate-500">
        <span><span className="text-slate-400">GV:</span> {tk?.gvChinh ?? <em className="text-rose-400">chưa có</em>}{tk?.gvPhu ? `, ${tk.gvPhu}` : ''}</span>
        <span><span className="text-slate-400">TG:</span> {tk?.tg ?? <em className="text-rose-400">chưa có</em>}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {du ? <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">✓ Đủ thông tin</span>
          : <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">Thiếu: {thieu.join(' · ')}</span>}
        {l.trang_thai === 'dong' && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">đóng</span>}
      </div>
    </button>
  )
}
const THU_LABEL: Record<number, string> = { 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN' }
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }) // YYYY-MM-DD giờ VN

export default function LopScreen() {
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [list, setList] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [tk, setTk] = useState<Record<string, LopThongKe>>({})

  async function reload() {
    setLoading(true); setErr(null)
    try { const ls = await listLop(khoi); setList(ls); setTk(await thongKeLop(ls.map((l) => l.id))) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi]) // eslint-disable-line

  if (openId) return <LopDetail id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Lớp</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)} className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
          ))}
          <button onClick={() => setCreating(true)} className="ml-3 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm lớp</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có lớp khối {khoi}. Bấm <b className="text-slate-600">+ Thêm lớp</b>.</div>
          : (
            // 4 môn 4 KHU VỰC (Toán trên cùng → Văn → Anh → KHTN → môn khác) — không lẫn môn.
            <div className="space-y-6">
              {[...new Set(['Toán', 'Văn', 'Anh', 'KHTN', ...list.map((l) => l.mon)])]
                .filter((mon) => list.some((l) => l.mon === mon))
                .map((mon) => (
                  <section key={mon}>
                    <div className="mb-2 flex items-center gap-2">
                      <MonChip mon={mon} />
                      <span className="text-[13px] font-semibold text-slate-700">{mon}</span>
                      <span className="text-[12px] text-slate-400">{list.filter((l) => l.mon === mon).length} lớp</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                      {list.filter((l) => l.mon === mon)
                        .sort((a, b) => (BAC_ORDER[a.bac ?? ''] ?? 9) - (BAC_ORDER[b.bac ?? ''] ?? 9) || a.ten_lop.localeCompare(b.ten_lop, 'vi', { numeric: true }))
                        .map((l) => <LopCard key={l.id} l={l} tk={tk[l.id]} onOpen={() => setOpenId(l.id)} />)}
                    </div>
                  </section>
                ))}
            </div>
          )}
      </div>

      {creating && <CreateLopModal khoi={khoi} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); reload(); setOpenId(id) }} />}
    </div>
  )
}

function CreateLopModal({ khoi, onClose, onCreated }: { khoi: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [mon, setMon] = useState('Toán')
  const [bac, setBac] = useState<string>('A')
  const [coSo, setCoSo] = useState('')
  const [khaiGiang, setKhaiGiang] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function create() {
    if (!ten.trim() || !mon.trim()) return
    setBusy(true); setError(null)
    try { const l = await createLop({ ten_lop: ten.trim(), mon: mon.trim(), khoi, bac, co_so: coSo.trim() || null, ngay_khai_giang: khaiGiang || null }); onCreated(l.id) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Thêm lớp · Khối ${khoi}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Tên lớp"><input value={ten} onChange={(e) => setTen(e.target.value)} className={inp} placeholder="vd: 9A2" autoFocus /></Field>
        <Field label="Môn"><input value={mon} onChange={(e) => setMon(e.target.value)} className={inp} /></Field>
      </div>
      <Field label="Bậc lớp"><Seg options={BAC_OPTS as unknown as string[]} value={bac} onChange={setBac} /></Field>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Cơ sở (tùy)"><input value={coSo} onChange={(e) => setCoSo(e.target.value)} className={inp} placeholder="vd: CS1" /></Field>
        <Field label="Ngày khai giảng"><input type="date" value={khaiGiang} onChange={(e) => setKhaiGiang(e.target.value)} className={inp} /></Field>
      </div>
      <p className="mb-2 text-[11px] text-slate-400">Trước ngày khai giảng lớp KHÔNG sinh buổi học/data — dù TKB đã xếp sẵn.</p>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={create} disabled={!ten.trim() || !mon.trim() || busy} saving={busy} label="Tạo" />
    </Shell>
  )
}

// ── Detail: thông tin + phân công + TKB + sĩ số ──────────────────
function LopDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const [lop, setLop] = useState<Lop | null>(null)
  const [pc, setPc] = useState<PhanCongLop[]>([])
  const [tkb, setTkb] = useState<ThoiKhoaBieu[]>([])
  const [roster, setRoster] = useState<HSTrongLop[]>([])
  const [dsNhanSu, setDsNhanSu] = useState<NhanSu[]>([])
  const [dsHocSinh, setDsHocSinh] = useState<HocSinh[]>([])
  const [mnl, setMnl] = useState<MucNangLuc[]>([])
  const [editInfo, setEditInfo] = useState(false)

  async function reload() {
    const [lopList, p, t, r, ns, mn] = await Promise.all([
      listLop(), listPhanCongByLop(id), listTKB(id), listHSCuaLop(id), listNhanSu(), listMucNangLuc(),
    ])
    const cur = lopList.find((x) => x.id === id) ?? null
    setLop(cur); setPc(p); setTkb(t); setRoster(r); setDsNhanSu(ns); setMnl(mn)
    // nguồn add hợp lệ = HS CHƯA có lớp môn này (đã có thì phải CHUYỂN LỚP từ hồ sơ HS)
    if (cur) setDsHocSinh(await listHSChuaCoLopMon(cur.mon, cur.khoi ? String(cur.khoi) : undefined))
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line

  if (!lop) return <div className="p-6 text-sm text-slate-400">Đang tải…</div>
  const nsName = (nid: string) => dsNhanSu.find((n) => n.id === nid)?.ho_ten ?? '?'

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <button onClick={onClose} className="text-[13px] text-slate-500 hover:text-indigo-600">← Lớp</button>
        <MonChip mon={lop.mon} />
        <span className="text-sm font-semibold text-slate-900">{lop.ten_lop}</span>
        <span className="text-[12px] text-slate-400">{lop.mon}{lop.khoi ? ` · khối ${lop.khoi}` : ''}{lop.co_so ? ` · ${lop.co_so}` : ''}</span>
        {lop.ngay_khai_giang
          ? <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${lop.ngay_khai_giang > todayVN() ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {lop.ngay_khai_giang > todayVN() ? `khai giảng ${lop.ngay_khai_giang}` : 'đang học'}
            </span>
          : <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">chưa đặt khai giảng</span>}
        <button onClick={() => setEditInfo(true)} className="ml-auto text-[13px] text-indigo-600 hover:underline">Sửa thông tin</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Phân công */}
          <Card title="Phân công GV / Trợ giảng">
            <PhanCongBox lopId={id} pc={pc} dsNhanSu={dsNhanSu} onChange={reload} nsName={nsName} />
          </Card>
          {/* TKB */}
          <Card title="Thời khóa biểu (khung lặp tuần)">
            <TkbBox lopId={id} tkb={tkb} onChange={reload} />
          </Card>
          {/* Sĩ số */}
          <div className="lg:col-span-2">
            <Card title={`Học sinh trong lớp (${roster.length})`}>
              <RosterBox lopId={id} roster={roster} dsHocSinh={dsHocSinh} mnl={mnl} onChange={reload} />
            </Card>
          </div>
        </div>
      </div>

      {editInfo && <EditLopModal lop={lop} onClose={() => setEditInfo(false)} onSaved={() => { setEditInfo(false); reload() }} onDeleted={onClose} />}
    </div>
  )
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="mb-3 text-[13px] font-semibold text-slate-700">{title}</div>
    {children}
  </div>
)

function PhanCongBox({ lopId, pc, dsNhanSu, onChange, nsName }: { lopId: string; pc: PhanCongLop[]; dsNhanSu: NhanSu[]; onChange: () => void; nsName: (id: string) => string }) {
  const [nsId, setNsId] = useState('')
  const [vai, setVai] = useState<'gv' | 'tg'>('gv')
  const [laChinh, setLaChinh] = useState(false)
  async function add() {
    if (!nsId) return
    try { await addPhanCong({ nhan_su_id: nsId, lop_id: lopId, vai_tro: vai, la_chinh: laChinh }); setNsId(''); setLaChinh(false); onChange() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  return (
    <div>
      <div className="space-y-1.5">
        {pc.length === 0 && <p className="text-[12px] text-slate-400">Chưa phân công ai.</p>}
        {pc.map((p) => (
          <div key={p.id} className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-[13px]">
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${p.vai_tro === 'gv' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}>{p.vai_tro === 'gv' ? 'GV' : 'TG'}</span>
            <span className="font-medium text-slate-800">{nsName(p.nhan_su_id)}</span>
            {p.la_chinh && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">chính</span>}
            <button onClick={async () => { await removePhanCong(p.id); onChange() }} className="ml-auto text-[12px] text-slate-400 hover:text-rose-600">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="min-w-40 flex-1">
          <SearchSelect value={nsId || null} onChange={(id) => setNsId(id ?? '')} placeholder="Gõ tên nhân sự…"
            options={dsNhanSu.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns ?? undefined }))} />
        </div>
        <select value={vai} onChange={(e) => setVai(e.target.value as 'gv' | 'tg')} className="rounded border border-slate-300 px-2 py-1.5 text-[13px]">
          <option value="gv">GV</option><option value="tg">TG</option>
        </select>
        <label className="flex items-center gap-1 text-[12px] text-slate-500"><input type="checkbox" checked={laChinh} onChange={(e) => setLaChinh(e.target.checked)} />chính</label>
        <button onClick={add} disabled={!nsId} className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Thêm</button>
      </div>
    </div>
  )
}

function TkbBox({ lopId, tkb, onChange }: { lopId: string; tkb: ThoiKhoaBieu[]; onChange: () => void }) {
  const [thu, setThu] = useState(2)
  const [tu, setTu] = useState('18:00')
  const [den, setDen] = useState('20:00')
  const [phong, setPhong] = useState('')
  async function add() {
    try { await addTKB({ lop_id: lopId, thu, gio_bat_dau: tu, gio_ket_thuc: den, phong: phong.trim() || null, hieu_luc_tu: today(), hieu_luc_den: null }); setPhong(''); onChange() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  return (
    <div>
      <div className="space-y-1.5">
        {tkb.length === 0 && <p className="text-[12px] text-slate-400">Chưa có lịch khung.</p>}
        {tkb.map((s) => (
          <div key={s.id} className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-[13px]">
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700">{THU_LABEL[s.thu]}</span>
            <span className="text-slate-700">{s.gio_bat_dau?.slice(0, 5)}–{s.gio_ket_thuc?.slice(0, 5)}</span>
            {s.phong && <span className="text-[12px] text-slate-400">· {s.phong}</span>}
            <button onClick={async () => { if (confirm('Đóng slot này (ngừng từ hôm nay)?')) { await dongTKB(s.id, today()); onChange() } }} className="ml-auto text-[12px] text-slate-400 hover:text-rose-600">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select value={thu} onChange={(e) => setThu(Number(e.target.value))} className="rounded border border-slate-300 px-2 py-1.5 text-[13px]">
          {[2, 3, 4, 5, 6, 7, 8].map((t) => <option key={t} value={t}>{THU_LABEL[t]}</option>)}
        </select>
        <input type="time" value={tu} onChange={(e) => setTu(e.target.value)} className="rounded border border-slate-300 px-2 py-1.5 text-[13px]" />
        <input type="time" value={den} onChange={(e) => setDen(e.target.value)} className="rounded border border-slate-300 px-2 py-1.5 text-[13px]" />
        <input value={phong} onChange={(e) => setPhong(e.target.value)} placeholder="phòng" className="w-20 rounded border border-slate-300 px-2 py-1.5 text-[13px]" />
        <button onClick={add} className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500">Thêm</button>
      </div>
    </div>
  )
}

function RosterBox({ lopId, roster, dsHocSinh, mnl, onChange }: { lopId: string; roster: HSTrongLop[]; dsHocSinh: HocSinh[]; mnl: MucNangLuc[]; onChange: () => void }) {
  const [hsId, setHsId] = useState('')
  const [ngayVao, setNgayVao] = useState(todayVN())
  const inLop = new Set(roster.map((r) => r.hoc_sinh_id))
  const conLai = dsHocSinh.filter((h) => !inLop.has(h.id)) // đã lọc: chỉ HS CHƯA có lớp môn này
  async function add() {
    if (!hsId) return
    try { await ghiDanh(hsId, lopId, null, ngayVao); setHsId(''); onChange() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="min-w-56 flex-1">
          <SearchSelect value={hsId || null} onChange={(id) => setHsId(id ?? '')}
            placeholder="Gõ tên/mã HS để ghi danh (chưa có lớp môn này)…"
            options={conLai.map((h) => ({ id: h.id, label: h.ho_ten, sub: h.ma_hs ?? undefined }))} />
        </div>
        <label className="flex items-center gap-1 text-[12px] text-slate-500">vào lớp
          <input type="date" value={ngayVao} onChange={(e) => setNgayVao(e.target.value)} className="rounded border border-slate-300 px-1.5 py-1 text-[12px]" />
        </label>
        <button onClick={add} disabled={!hsId} className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Ghi danh</button>
      </div>
      {roster.length === 0 ? <p className="text-[12px] text-slate-400">Lớp chưa có học sinh.</p> : (
        <table className="w-full text-[13px]">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-400"><th className="py-1">Học sinh</th><th>Band (môn này)</th><th>Vào lớp</th><th></th></tr></thead>
          <tbody>
            {roster.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="py-1.5">
                  <span className="font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</span>
                  {r.hoc_sinh?.ma_hs && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">{r.hoc_sinh.ma_hs}</span>}
                </td>
                <td>
                  <select value={r.muc_nang_luc_id ?? ''} onChange={async (e) => { await setBandGhiDanh(r.id, e.target.value || null); onChange() }} className="rounded border border-slate-300 px-1.5 py-1 text-[12px]">
                    <option value="">— chưa xếp —</option>
                    {mnl.map((m) => <option key={m.id} value={m.id}>{m.ma}</option>)}
                  </select>
                </td>
                <td>
                  <input type="date" value={r.ngay_vao ?? ''} onChange={async (e) => { if (e.target.value) { await setNgayVaoApi(r.id, e.target.value); onChange() } }}
                    className={`rounded border px-1.5 py-1 text-[12px] ${r.ngay_vao ? 'border-slate-300' : 'border-amber-400 bg-amber-50'}`} title="Ngày vào lớp — cổng tính data học tập (BTVN/ET)" />
                </td>
                <td className="text-right"><button onClick={async () => { if (confirm('Cho học sinh rời lớp này?')) { await roiLop(r.id); onChange() } }} className="text-[12px] text-slate-400 hover:text-rose-600">Rời lớp</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-2 text-[11px] text-slate-400">HS đã có lớp môn này không hiện trong ô thêm — dùng <b>chuyển lớp</b> trong hồ sơ HS. Rời lớp giữ lịch sử + mọi thay đổi được log tự động.</p>
    </div>
  )
}

function EditLopModal({ lop, onClose, onSaved, onDeleted }: { lop: Lop; onClose: () => void; onSaved: () => void; onDeleted: () => void }) {
  const [ten, setTen] = useState(lop.ten_lop)
  const [mon, setMon] = useState(lop.mon)
  const [bac, setBac] = useState<string>(lop.bac ?? 'A')
  const [coSo, setCoSo] = useState(lop.co_so ?? '')
  const [khaiGiang, setKhaiGiang] = useState(lop.ngay_khai_giang ?? '')
  const [tt, setTt] = useState<Lop['trang_thai']>(lop.trang_thai)
  const [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    try { await updateLop(lop.id, { ten_lop: ten.trim(), mon: mon.trim(), bac, co_so: coSo.trim() || null, ngay_khai_giang: khaiGiang || null, trang_thai: tt }); onSaved() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Sửa lớp · ${lop.ten_lop}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Tên lớp"><input value={ten} onChange={(e) => setTen(e.target.value)} className={inp} /></Field>
        <Field label="Môn"><input value={mon} onChange={(e) => setMon(e.target.value)} className={inp} /></Field>
      </div>
      <Field label="Bậc lớp"><Seg options={BAC_OPTS as unknown as string[]} value={bac} onChange={setBac} /></Field>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Cơ sở"><input value={coSo} onChange={(e) => setCoSo(e.target.value)} className={inp} /></Field>
        <Field label="Trạng thái"><Seg options={['dang_hoc', 'dong'] as const} value={tt} onChange={setTt} render={(o) => o === 'dang_hoc' ? 'Đang học' : 'Đóng'} /></Field>
      </div>
      <Field label="Ngày khai giảng (trước ngày này lớp không sinh buổi/data)">
        <input type="date" value={khaiGiang} onChange={(e) => setKhaiGiang(e.target.value)} className={inp} />
      </Field>
      <div className="mt-2 flex items-center justify-between">
        <button onClick={async () => { if (confirm('Xoá lớp này? (xoá luôn phân công/TKB/ghi danh của lớp)')) { await deleteLop(lop.id); onDeleted() } }} className="text-[13px] text-rose-600 hover:underline">Xoá lớp</button>
        <Actions onClose={onClose} onSave={save} disabled={busy || !ten.trim()} saving={busy} label="Lưu" />
      </div>
    </Shell>
  )
}
