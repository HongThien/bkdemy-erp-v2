import { useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { listTaiLieu, createTaiLieu, deleteTaiLieu, type TaiLieu } from '../../lib/tailieu'
import { useStore } from '../../store/useStore'
import { useMonScope } from '../../hooks/useMonScope'
import { Shell, Field, inp } from '../kho/ui'
import TaiLieuBuilder from './TaiLieuBuilder'

// Môn CÓ KHO (soạn tài liệu được). Anh/Văn chưa có kho.
const KHO_MON = ['Toán', 'KHTN']

// Ngày giờ VN (CLAUDE.md §2: không toISOString) — hiển thị "dd/mm/yyyy".
function fmtNgay(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' })
}

const ALL = '__all__'

export default function TaiLieuScreen() {
  const [khoi, setKhoi] = useState<string>(DEFAULT_KHOI)
  const [list, setList] = useState<TaiLieu[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'moi' | 'ten'>('moi')
  // Scope④ MÔN (useMonScope): admin/Ops/Media/Marketing = mọi môn có kho; staff = môn được phân ∩ môn-có-kho.
  const me = useStore((s) => s.me)
  const { allowedMons: monScope, isAll } = useMonScope()
  const allowedMons = isAll ? KHO_MON : monScope.filter((m) => KHO_MON.includes(m))
  const [mon, setMon] = useState<string>('')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(','), mon])
  const profileLoading = !isAll && me === null
  // Nhánh TRONG mon='Toán' (Đại/Hình giải tích — cùng mon để RBAC/billing sạch, xem lib/tailieu.ts).
  // null = Đại (mặc định, không đổi hành vi cũ) · 'hinh_gt' = Hình giải tích.
  const [nhanh, setNhanh] = useState<string | null>(null)

  async function reload() {
    if (!mon) { setList([]); setLoading(false); return }
    setLoading(true); setErr(null)
    try { setList(await listTaiLieu(khoi === ALL ? undefined : khoi, 'giao_trinh', mon, mon === 'Toán' ? nhanh : undefined)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi, mon, nhanh]) // eslint-disable-line

  // search + sort ở client (list 1 khối/ tất cả đều nhỏ)
  const shown = list
    .filter((t) => !q.trim() || t.ten.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => sort === 'ten' ? a.ten.localeCompare(b.ten, 'vi') : (b.created_at ?? '').localeCompare(a.created_at ?? ''))

  if (openId) return <TaiLieuBuilder id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">Giáo trình</span>
        {allowedMons.length > 0 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => (
              <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m}</button>
            ))}
          </div>
        )}
        {/* Nhánh (chỉ Toán) — segmented, giống KhoScreen */}
        {mon === 'Toán' && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            <button onClick={() => setNhanh(null)} className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${nhanh === null ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Đại số</button>
            <button onClick={() => setNhanh('hinh_gt')} className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${nhanh === 'hinh_gt' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Hình giải tích</button>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên…" className="mr-2 h-7 w-44 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
          <button onClick={() => setSort(sort === 'moi' ? 'ten' : 'moi')} className="mr-2 h-7 rounded-md border border-slate-200 px-2.5 text-[12px] font-medium text-slate-500 hover:bg-slate-100">{sort === 'moi' ? '↓ Mới nhất' : 'A→Z Tên'}</button>
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          <button onClick={() => setKhoi(ALL)} className={`h-7 rounded-md px-2 text-xs font-semibold transition ${khoi === ALL ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>Tất cả</button>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)} className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
          ))}
          <button onClick={() => setCreating(true)} className="ml-3 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo giáo trình</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {profileLoading ? <p className="text-sm text-slate-400">Đang tải hồ sơ…</p>
          : allowedMons.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Bạn chưa được phân môn (có kho) — liên hệ quản trị để soạn tài liệu.</div>
          : loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              {q.trim() ? <>Không có giáo trình khớp “{q}”.</> : <>Chưa có giáo trình {khoi === ALL ? '' : `khối ${khoi}`}. Bấm <b className="text-slate-600">+ Tạo giáo trình</b>.</>}
            </div>
          ) : (
            <>
            <div className="mb-3 text-[12px] text-slate-400">{shown.length} giáo trình</div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {shown.map((t) => (
                <div key={t.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-[16px] font-semibold text-slate-900">{t.ten}</div>
                  <div className="mt-1 text-[12px] text-slate-400">Khối {t.khoi}{t.ma_chuyen_de ? ` · chuyên đề ${t.ma_chuyen_de}` : ''}</div>
                  <div className="mt-1 text-[11px] text-slate-400">Tạo {fmtNgay(t.created_at)}{t.updated_at && t.updated_at !== t.created_at ? ` · sửa ${fmtNgay(t.updated_at)}` : ''}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setOpenId(t.id)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">Mở / Xuất</button>
                    <button onClick={async () => { if (confirm('Xoá giáo trình này?')) { await deleteTaiLieu(t.id); reload() } }} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
      </div>

      {creating && <CreateModal khoi={khoi === ALL ? DEFAULT_KHOI : khoi} mon={mon} nhanh={mon === 'Toán' ? nhanh : null} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); reload(); setOpenId(id) }} />}
    </div>
  )
}

function CreateModal({ khoi, mon, nhanh, onClose, onCreated }: { khoi: string; mon: string; nhanh: string | null; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create() {
    if (!ten.trim()) return
    setBusy(true); setError(null)
    try { const tl = await createTaiLieu({ ten: ten.trim(), khoi, mon, nhanh }); onCreated(tl.id) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <Shell title={`Tạo giáo trình · ${mon}${nhanh === 'hinh_gt' ? ' · Hình giải tích' : ''} · Khối ${khoi}`} onClose={onClose}>
      <Field label="Tên giáo trình"><input value={ten} onChange={(e) => setTen(e.target.value)} className={inp} placeholder="vd: Ôn tập Phân số" autoFocus /></Field>
      <div className="mb-3 text-[11px] text-slate-400">Tạo xong vào Builder → bấm <b>+ Thêm chuyên đề</b> (thêm nhiều chuyên đề để gộp thành 1 tài liệu lớn).</div>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={create} disabled={!ten.trim() || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
      </div>
    </Shell>
  )
}
