import { useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import {
  listLop, createLop, updateLop, deleteLop,
  listPhanCongByLop, addPhanCong, removePhanCong,
  listTKB, addTKB, dongTKB,
  listHSCuaLop, ghiDanh, roiLop, setBandGhiDanh,
  listNhanSu, listHocSinh, listMucNangLuc,
  type Lop, type PhanCongLop, type ThoiKhoaBieu, type HSTrongLop, type NhanSu, type HocSinh, type MucNangLuc,
} from '../../lib/nhansu'
import { Shell, Field, inp, Seg, Actions, BacChip } from '../kho/ui'

const BAC_OPTS = ['S', 'A', 'B', 'C'] as const
const THU_LABEL: Record<number, string> = { 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN' }
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }) // YYYY-MM-DD giờ VN

export default function LopScreen() {
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [list, setList] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setList(await listLop(khoi)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {list.map((l) => (
                <button key={l.id} onClick={() => setOpenId(l.id)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm">
                  {l.bac ? <BacChip bac={l.bac} /> : <div className="h-8 w-8 rounded-lg bg-slate-100" />}
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-slate-900">{l.ten_lop}</div>
                    <div className="text-[12px] text-slate-400">{l.mon}{l.khoi ? ` · khối ${l.khoi}` : ''}{l.co_so ? ` · ${l.co_so}` : ''}</div>
                  </div>
                  {l.trang_thai === 'dong' && <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">đóng</span>}
                </button>
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
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function create() {
    if (!ten.trim() || !mon.trim()) return
    setBusy(true); setError(null)
    try { const l = await createLop({ ten_lop: ten.trim(), mon: mon.trim(), khoi: Number(khoi), bac, co_so: coSo.trim() || null }); onCreated(l.id) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Thêm lớp · Khối ${khoi}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Tên lớp"><input value={ten} onChange={(e) => setTen(e.target.value)} className={inp} placeholder="vd: 9A2" autoFocus /></Field>
        <Field label="Môn"><input value={mon} onChange={(e) => setMon(e.target.value)} className={inp} /></Field>
      </div>
      <Field label="Bậc lớp"><Seg options={BAC_OPTS as unknown as string[]} value={bac} onChange={setBac} /></Field>
      <Field label="Cơ sở (tùy)"><input value={coSo} onChange={(e) => setCoSo(e.target.value)} className={inp} placeholder="vd: CS1" /></Field>
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
    setDsHocSinh(await listHocSinh(cur?.khoi ? String(cur.khoi) : undefined))
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line

  if (!lop) return <div className="p-6 text-sm text-slate-400">Đang tải…</div>
  const nsName = (nid: string) => dsNhanSu.find((n) => n.id === nid)?.ho_ten ?? '?'

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <button onClick={onClose} className="text-[13px] text-slate-500 hover:text-indigo-600">← Lớp</button>
        {lop.bac && <BacChip bac={lop.bac} size="sm" />}
        <span className="text-sm font-semibold text-slate-900">{lop.ten_lop}</span>
        <span className="text-[12px] text-slate-400">{lop.mon}{lop.khoi ? ` · khối ${lop.khoi}` : ''}{lop.co_so ? ` · ${lop.co_so}` : ''}</span>
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
        <select value={nsId} onChange={(e) => setNsId(e.target.value)} className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-[13px]">
          <option value="">— chọn nhân sự —</option>
          {dsNhanSu.map((n) => <option key={n.id} value={n.id}>{n.ho_ten}</option>)}
        </select>
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
  const inLop = new Set(roster.map((r) => r.hoc_sinh_id))
  const conLai = dsHocSinh.filter((h) => !inLop.has(h.id))
  const mnlName = (mid: string | null) => mnl.find((m) => m.id === mid)?.ma ?? '—'
  async function add() {
    if (!hsId) return
    try { await ghiDanh(hsId, lopId); setHsId(''); onChange() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={hsId} onChange={(e) => setHsId(e.target.value)} className="min-w-56 flex-1 rounded border border-slate-300 px-2 py-1.5 text-[13px]">
          <option value="">— ghi danh học sinh vào lớp —</option>
          {conLai.map((h) => <option key={h.id} value={h.id}>{h.ho_ten}{h.ma_hs ? ` (${h.ma_hs})` : ''}</option>)}
        </select>
        <button onClick={add} disabled={!hsId} className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Ghi danh</button>
      </div>
      {roster.length === 0 ? <p className="text-[12px] text-slate-400">Lớp chưa có học sinh.</p> : (
        <table className="w-full text-[13px]">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-400"><th className="py-1">Học sinh</th><th>Band (môn này)</th><th></th></tr></thead>
          <tbody>
            {roster.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="py-1.5 font-medium text-slate-800">{r.hoc_sinh?.ho_ten ?? '?'}</td>
                <td>
                  <select value={r.muc_nang_luc_id ?? ''} onChange={async (e) => { await setBandGhiDanh(r.id, e.target.value || null); onChange() }} className="rounded border border-slate-300 px-1.5 py-1 text-[12px]">
                    <option value="">— chưa xếp —</option>
                    {mnl.map((m) => <option key={m.id} value={m.id}>{m.ma}</option>)}
                  </select>
                </td>
                <td className="text-right"><button onClick={async () => { if (confirm('Cho học sinh rời lớp này?')) { await roiLop(r.id); onChange() } }} className="text-[12px] text-slate-400 hover:text-rose-600">Rời lớp</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-2 text-[11px] text-slate-400">Rời lớp = giữ lịch sử (đánh dấu đã rời), không xoá. Band đổi lưu ngay. {mnlName('')}</p>
    </div>
  )
}

function EditLopModal({ lop, onClose, onSaved, onDeleted }: { lop: Lop; onClose: () => void; onSaved: () => void; onDeleted: () => void }) {
  const [ten, setTen] = useState(lop.ten_lop)
  const [mon, setMon] = useState(lop.mon)
  const [bac, setBac] = useState<string>(lop.bac ?? 'A')
  const [coSo, setCoSo] = useState(lop.co_so ?? '')
  const [tt, setTt] = useState<Lop['trang_thai']>(lop.trang_thai)
  const [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    try { await updateLop(lop.id, { ten_lop: ten.trim(), mon: mon.trim(), bac, co_so: coSo.trim() || null, trang_thai: tt }); onSaved() }
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
      <div className="mt-2 flex items-center justify-between">
        <button onClick={async () => { if (confirm('Xoá lớp này? (xoá luôn phân công/TKB/ghi danh của lớp)')) { await deleteLop(lop.id); onDeleted() } }} className="text-[13px] text-rose-600 hover:underline">Xoá lớp</button>
        <Actions onClose={onClose} onSave={save} disabled={busy || !ten.trim()} saving={busy} label="Lưu" />
      </div>
    </Shell>
  )
}
