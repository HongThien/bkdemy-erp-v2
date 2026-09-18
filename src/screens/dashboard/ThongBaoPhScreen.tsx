// Màn "Thông báo phụ huynh" (leaf `db_thongbao`) — TT/quản lý nhập thông báo đẩy sang Cổng PH.
// Data: bảng public.thong_bao_ph (mig ERP_thong_bao_ph.sql). PH đọc qua RPC fn_ph_thong_bao ở bkdemy-ph.
// Bố cục: cột TRÁI = form soạn/sửa; cột PHẢI = list (mới → cũ), click 1 dòng để sửa.
import { useEffect, useState } from 'react'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listLop, listHocSinh } from '../../lib/nhansu'
import {
  listThongBao, createThongBao, updateThongBao, deleteThongBao,
  type ThongBaoPh, type TbLoai, type TbScope,
} from '../../lib/thongbao'

const LOAI_OPTS: { key: TbLoai; ten: string; emoji: string; cls: string }[] = [
  { key: 'chung', ten: 'Chung',   emoji: '📢', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  { key: 'lich',  ten: 'Lịch',    emoji: '📅', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { key: 'thi',   ten: 'Thi cử',  emoji: '📝', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { key: 'nhac',  ten: 'Nhắc nhở', emoji: '⏰', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
]
const SCOPE_OPTS: { key: TbScope; ten: string; sub: string }[] = [
  { key: 'toan_bo', ten: 'Toàn bộ PH', sub: 'Mọi phụ huynh đều thấy' },
  { key: 'khoi',    ten: 'Theo khối',  sub: 'Chỉ PH của HS trong khối' },
  { key: 'lop',     ten: 'Theo lớp',   sub: 'Chỉ PH của HS trong 1 lớp' },
  { key: 'ca_nhan', ten: 'Cá nhân',    sub: 'Chỉ PH của 1 HS' },
]

const KHOI_OPTS = ['6', '7', '8', '9', '10', '11', '12', '4T', '5T'].map((k) => ({ id: k, label: `Khối ${k}` }))

const fmtNgay = (iso: string | null) => {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}
const loaiOf = (k: TbLoai) => LOAI_OPTS.find((x) => x.key === k) ?? LOAI_OPTS[0]

type FormState = {
  id: string | null
  tieu_de: string
  noi_dung: string
  loai: TbLoai
  scope: TbScope
  khoi: string | null
  lop_id: string | null
  hoc_sinh_id: string | null
  hieu_luc_tu: string
  hieu_luc_den: string
}
const EMPTY: FormState = {
  id: null, tieu_de: '', noi_dung: '', loai: 'chung', scope: 'toan_bo',
  khoi: null, lop_id: null, hoc_sinh_id: null,
  hieu_luc_tu: '', hieu_luc_den: '',
}

export default function ThongBaoPhScreen() {
  const [rows, setRows] = useState<ThongBaoPh[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  // Options cho scope-dependent selector — nạp 1 lần
  const [lopOpts, setLopOpts] = useState<Opt[]>([])
  const [hsOpts, setHsOpts]   = useState<Opt[]>([])
  useEffect(() => {
    Promise.all([listLop(), listHocSinh()]).then(([lops, hss]) => {
      setLopOpts(lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `Khối ${l.khoi ?? '—'} · ${l.mon}` })))
      setHsOpts(hss.map((h) => ({ id: h.id, label: h.ho_ten, sub: `${h.ma_hs ?? ''} · Khối ${h.khoi ?? '—'}` })))
    }).catch((e) => setErr(String(e)))
  }, [])

  const load = () => {
    setLoading(true)
    listThongBao().then((r) => { setRows(r); setLoading(false) })
      .catch((e) => { setErr(String(e)); setLoading(false) })
  }
  useEffect(load, [])

  const editing = form.id != null
  const canSave = form.tieu_de.trim().length > 0 && form.noi_dung.trim().length > 0
    && (form.scope !== 'khoi'    || form.khoi != null)
    && (form.scope !== 'lop'     || form.lop_id != null)
    && (form.scope !== 'ca_nhan' || form.hoc_sinh_id != null)

  const startEdit = (r: ThongBaoPh) => setForm({
    id: r.id, tieu_de: r.tieu_de, noi_dung: r.noi_dung, loai: r.loai, scope: r.scope,
    khoi: r.khoi, lop_id: r.lop_id, hoc_sinh_id: r.hoc_sinh_id,
    hieu_luc_tu: r.hieu_luc_tu ?? '', hieu_luc_den: r.hieu_luc_den ?? '',
  })
  const reset = () => setForm(EMPTY)

  const save = async () => {
    if (!canSave || saving) return
    setSaving(true); setErr(null); setOk(null)
    try {
      const payload = {
        tieu_de: form.tieu_de.trim(),
        noi_dung: form.noi_dung.trim(),
        loai: form.loai,
        scope: form.scope,
        khoi: form.khoi,
        lop_id: form.lop_id,
        hoc_sinh_id: form.hoc_sinh_id,
        hieu_luc_tu: form.hieu_luc_tu || null,
        hieu_luc_den: form.hieu_luc_den || null,
      }
      if (editing) await updateThongBao(form.id!, payload)
      else await createThongBao(payload)
      setOk(editing ? 'Đã lưu thay đổi.' : 'Đã tạo thông báo mới.')
      reset()
      load()
    } catch (e) { setErr(String(e)) } finally { setSaving(false) }
  }

  const remove = async (r: ThongBaoPh) => {
    if (!confirm(`Xoá thông báo "${r.tieu_de}"?\nHành động này KHÔNG hoàn tác được.`)) return
    setSaving(true); setErr(null); setOk(null)
    try {
      await deleteThongBao(r.id)
      setOk('Đã xoá.')
      if (form.id === r.id) reset()
      load()
    } catch (e) { setErr(String(e)) } finally { setSaving(false) }
  }

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 p-6 lg:grid-cols-[420px_1fr]">
      {/* ── Cột TRÁI: form ── */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{editing ? '✏️ Sửa thông báo' : '📝 Tạo thông báo mới'}</h2>
          {editing && <button className="text-xs font-bold text-slate-500 hover:text-slate-800" onClick={reset}>+ Tạo mới</button>}
        </div>

        {err && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{err}</div>}
        {ok  && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200">{ok}</div>}

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-bold text-slate-600">Tiêu đề *</span>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.tieu_de} onChange={(e) => setForm({ ...form, tieu_de: e.target.value })}
            placeholder="VD: Nghỉ Tết Nguyên đán từ 27/1 - 5/2" />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-bold text-slate-600">Nội dung *</span>
          <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows={5}
            value={form.noi_dung} onChange={(e) => setForm({ ...form, noi_dung: e.target.value })}
            placeholder="Chi tiết đầy đủ, PH sẽ đọc trực tiếp trên app…" />
        </label>

        <div className="mb-3">
          <span className="mb-1 block text-xs font-bold text-slate-600">Loại</span>
          <div className="flex flex-wrap gap-2">
            {LOAI_OPTS.map((o) => (
              <button key={o.key}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${form.loai === o.key ? o.cls : 'bg-white text-slate-500 ring-slate-200'}`}
                onClick={() => setForm({ ...form, loai: o.key })}>
                {o.emoji} {o.ten}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <span className="mb-1 block text-xs font-bold text-slate-600">Ai thấy? (Phạm vi)</span>
          <div className="grid grid-cols-2 gap-2">
            {SCOPE_OPTS.map((o) => (
              <button key={o.key}
                className={`rounded-lg px-3 py-2 text-left text-xs ring-1 ${form.scope === o.key ? 'bg-indigo-50 text-indigo-800 ring-indigo-300' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50'}`}
                onClick={() => setForm({ ...form, scope: o.key, khoi: null, lop_id: null, hoc_sinh_id: null })}>
                <div className="font-bold">{o.ten}</div>
                <div className="mt-0.5 text-[10px] text-slate-500">{o.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {form.scope === 'khoi' && (
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-bold text-slate-600">Khối *</span>
            <SearchSelect value={form.khoi} onChange={(v) => setForm({ ...form, khoi: v })} options={KHOI_OPTS} placeholder="Chọn khối" />
          </label>
        )}
        {form.scope === 'lop' && (
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-bold text-slate-600">Lớp *</span>
            <SearchSelect value={form.lop_id} onChange={(v) => setForm({ ...form, lop_id: v })} options={lopOpts} placeholder="Tìm lớp…" />
          </label>
        )}
        {form.scope === 'ca_nhan' && (
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-bold text-slate-600">Học sinh *</span>
            <SearchSelect value={form.hoc_sinh_id} onChange={(v) => setForm({ ...form, hoc_sinh_id: v })} options={hsOpts} placeholder="Tìm học sinh…" avatars />
          </label>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">Hiệu lực từ (optional)</span>
            <input type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.hieu_luc_tu} onChange={(e) => setForm({ ...form, hieu_luc_tu: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">Đến (optional)</span>
            <input type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.hieu_luc_den} onChange={(e) => setForm({ ...form, hieu_luc_den: e.target.value })} />
          </label>
        </div>
        <p className="mb-4 text-[11px] text-slate-500">Bỏ trống = luôn hiện. Nếu chỉ set "Đến", app ẩn thông báo sau ngày đó.</p>

        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-300"
            disabled={!canSave || saving} onClick={save}>
            {saving ? 'Đang lưu…' : editing ? '💾 Lưu thay đổi' : '➕ Đăng thông báo'}
          </button>
          {editing && (
            <button className="rounded-lg bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700"
              onClick={() => {
                const r = rows.find((x) => x.id === form.id)
                if (r) remove(r)
              }}>
              🗑 Xoá
            </button>
          )}
        </div>
      </section>

      {/* ── Cột PHẢI: list ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">📋 Đã đăng ({rows.length})</h2>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800" onClick={load}>↻ Làm mới</button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">Đang tải…</div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            Chưa có thông báo nào. Soạn ở cột trái, bấm "Đăng" — PH thấy ngay khi vào app.
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => <TbCard key={r.id} r={r} active={form.id === r.id} onEdit={() => startEdit(r)} onDelete={() => remove(r)} />)}
          </div>
        )}
      </section>
    </div>
  )
}

function TbCard({ r, active, onEdit, onDelete }: { r: ThongBaoPh; active: boolean; onEdit: () => void; onDelete: () => void }) {
  const m = loaiOf(r.loai)
  const scope = SCOPE_OPTS.find((x) => x.key === r.scope)?.ten ?? r.scope
  const scopeSub =
    r.scope === 'khoi'    ? `Khối ${r.khoi ?? '—'}` :
    r.scope === 'lop'     ? `Lớp id ${r.lop_id?.slice(0, 8) ?? '—'}` :
    r.scope === 'ca_nhan' ? `HS id ${r.hoc_sinh_id?.slice(0, 8) ?? '—'}` :
    'Toàn bộ PH'
  const hieuLuc =
    r.hieu_luc_tu || r.hieu_luc_den
      ? `Hiệu lực ${r.hieu_luc_tu ?? '…'} → ${r.hieu_luc_den ?? '…'}`
      : ''
  return (
    <div className={`rounded-xl bg-white p-4 ring-1 ${active ? 'ring-indigo-400 ring-2' : 'ring-slate-200'}`}>
      <div className="flex items-start gap-3">
        <div className="text-xl leading-none">{m.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-800">{r.tieu_de}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${m.cls}`}>{m.ten}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-[13px] text-slate-600" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {r.noi_dung}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10.5px] text-slate-500">
            <span>👥 {scope} · <span className="text-slate-700">{scopeSub}</span></span>
            <span>🕐 Đăng {fmtNgay(r.created_at)}</span>
            {hieuLuc && <span>⏳ {hieuLuc}</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button className="rounded bg-slate-100 px-2 py-1 text-[11px] font-bold hover:bg-slate-200" onClick={onEdit}>Sửa</button>
          <button className="rounded bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100" onClick={onDelete}>Xoá</button>
        </div>
      </div>
    </div>
  )
}
