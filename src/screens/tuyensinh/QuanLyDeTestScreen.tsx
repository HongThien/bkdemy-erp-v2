// Quản lý đề test đầu vào (Thùy chốt 07-27) — SINH đề từ nguồn MT/Đề thi. Học thuật chọn khối×môn +
// chọn nguồn → hệ tạo 1 tài liệu "Đề test đầu vào · Khối X · <tên nguồn>" (copy nội dung). Mỗi khối×môn
// 1 đề ĐANG DÙNG (bản mới nhất); sinh đề mới → thành đề hiện tại, bản cũ giữ làm LỊCH SỬ. Màn này liệt
// kê đề đang dùng (theo khối×môn) + lịch sử. Điểm danh test lấy đề đang dùng khớp khối×môn (xem DiemDanhTestScreen).
import { useEffect, useMemo, useState } from 'react'
import { listDeTestDauVao, listNguonDe, sinhDeTestDauVao, TEN_LOAI_DE, type DeTestRow } from '../../lib/detest'
import type { TaiLieu } from '../../lib/tailieu'
import { MON_OPTIONS, type MonTS } from '../../lib/tuyensinh'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { useIsMobile } from '../../hooks/useIsMobile'

type Nhom = { khoi: string; mon: string; hienTai: DeTestRow; lichSu: DeTestRow[] }

export default function QuanLyDeTestScreen() {
  const [rows, setRows] = useState<DeTestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [mon, setMon] = useState<string>('') // '' = tất cả môn
  const [form, setForm] = useState(false)

  async function reload() {
    setLoading(true)
    try { setRows(await listDeTestDauVao()) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const isMobile = useIsMobile()

  // Gom theo (khối,môn): bản đang dùng + lịch sử. rows đã desc → phần tử laHienTai đứng đầu mỗi nhóm.
  const nhom = useMemo<Nhom[]>(() => {
    const ds = mon ? rows.filter((r) => r.mon === mon) : rows
    const by = new Map<string, DeTestRow[]>()
    for (const r of ds) { const k = `${r.khoi}|${r.mon}`; (by.get(k) ?? by.set(k, []).get(k)!).push(r) }
    const out: Nhom[] = []
    for (const [, list] of by) {
      const hienTai = list.find((r) => r.laHienTai) ?? list[0]
      out.push({ khoi: hienTai.khoi, mon: hienTai.mon, hienTai, lichSu: list.filter((r) => r.id !== hienTai.id) })
    }
    return out.sort((a, b) => KHOI_OPTIONS.indexOf(a.khoi as any) - KHOI_OPTIONS.indexOf(b.khoi as any) || a.mon.localeCompare(b.mon))
  }, [rows, mon])

  return (
    <div className="h-full overflow-auto">
      <div className={isMobile ? 'mx-auto max-w-[1100px] p-3' : 'mx-auto max-w-[1100px] p-6'}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div>
            <h2 className="text-[20px] font-semibold text-slate-800">Đề test đầu vào</h2>
            <p className="text-[12px] text-slate-400">Sinh đề từ nguồn MT · Đề thi trong Kho. Mỗi khối×môn có 1 đề đang dùng; sinh đề mới → đề cũ thành lịch sử.</p>
          </div>
          <button onClick={() => setForm(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo đề test đầu vào</button>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <FilterPill active={mon === ''} onClick={() => setMon('')}>Tất cả môn</FilterPill>
          {MON_OPTIONS.map((m) => <FilterPill key={m} active={mon === m} onClick={() => setMon(m)}>{m}</FilterPill>)}
        </div>

        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : nhom.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
            Chưa có đề test đầu vào nào{mon ? ` cho môn ${mon}` : ''}. Bấm "+ Tạo đề test đầu vào" để sinh từ MT / Đề thi.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {nhom.map((n) => <NhomCard key={`${n.khoi}|${n.mon}`} n={n} />)}
          </div>
        )}

        {form && <TaoDeModal onClose={() => setForm(false)} onDone={async () => { setForm(false); await reload() }} />}
      </div>
    </div>
  )
}

function NhomCard({ n }: { n: Nhom }) {
  const [moLichSu, setMoLichSu] = useState(false)
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-800">Khối {n.khoi}</span>
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{n.mon}</span>
        <span className="ml-auto rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Đang dùng</span>
      </div>
      <div className="text-[13px] font-medium text-slate-700">{n.hienTai.ten}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">
        Nguồn: {n.hienTai.nguonLoai ? `${TEN_LOAI_DE[n.hienTai.nguonLoai] ?? n.hienTai.nguonLoai} · ` : ''}{n.hienTai.nguonTen ?? '—'} · {n.hienTai.createdAt.slice(0, 10)}
      </div>

      {n.lichSu.length > 0 && (
        <div className="mt-2 border-t border-slate-100 pt-2">
          <button onClick={() => setMoLichSu((v) => !v)} className="text-[11px] font-medium text-slate-500 hover:text-slate-700">
            {moLichSu ? '▾' : '▸'} Lịch sử ({n.lichSu.length})
          </button>
          {moLichSu && (
            <div className="mt-1.5 space-y-1">
              {n.lichSu.map((h) => (
                <div key={h.id} className="rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-500">
                  {h.ten} · {h.createdAt.slice(0, 10)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

function TaoDeModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [khoi, setKhoi] = useState<string>(DEFAULT_KHOI)
  const [mon, setMon] = useState<MonTS>(MON_OPTIONS[0] as MonTS)
  const [nguonList, setNguonList] = useState<TaiLieu[]>([])
  const [nguonId, setNguonId] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { listNguonDe().then(setNguonList).catch((e) => setErr(e.message ?? String(e))) }, [])
  const nguonOpts = nguonList.filter((d) => d.mon === mon && d.khoi === khoi)
  // Đổi khối/môn mà nguồn đang chọn không còn khớp → bỏ chọn.
  useEffect(() => { if (nguonId && !nguonOpts.some((d) => d.id === nguonId)) setNguonId('') }, [khoi, mon]) // eslint-disable-line

  async function save() {
    if (!nguonId) { setErr('Chọn 1 nguồn (MT / Đề thi) để sinh đề.'); return }
    setBusy(true); setErr(null)
    try { await sinhDeTestDauVao(nguonId, khoi, mon); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[560px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[16px] font-semibold text-slate-800">Tạo đề test đầu vào</div>
        <p className="mb-4 text-[12px] text-slate-400">Chọn khối × môn rồi chọn 1 nguồn — hệ sẽ sinh đề mới (copy nội dung nguồn). Đề này thành đề đang dùng của khối×môn đó.</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Lbl>Khối</Lbl><select className={inputCls} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
            <div><Lbl>Môn</Lbl><select className={inputCls} value={mon} onChange={(e) => setMon(e.target.value as MonTS)}>{MON_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div>
            <Lbl>Nguồn (MT · Đề thi khớp khối × môn)</Lbl>
            <select className={inputCls} value={nguonId} onChange={(e) => setNguonId(e.target.value)}>
              <option value="">{nguonOpts.length ? 'Chọn nguồn…' : '— Không có MT/Đề thi nào khớp —'}</option>
              {nguonOpts.map((d) => <option key={d.id} value={d.id}>{(TEN_LOAI_DE[d.loai] ?? d.loai)} · {d.ten}</option>)}
            </select>
          </div>
          {err && <p className="text-[12px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
            <button onClick={save} disabled={busy || !nguonId} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang sinh…' : 'Sinh đề'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
      {children}
    </button>
  )
}
