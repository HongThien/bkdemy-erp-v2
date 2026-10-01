// Quản lý đề test đầu vào (Thùy chốt 07-27) — SINH đề từ nguồn MT/Đề thi. Học thuật chọn khối×môn +
// chọn nguồn → hệ tạo 1 tài liệu "Đề test đầu vào · Khối X · <tên nguồn>" (copy nội dung). Mỗi khối×môn
// 1 đề ĐANG DÙNG (bản mới nhất); sinh đề mới → thành đề hiện tại, bản cũ giữ làm LỊCH SỬ. Màn này liệt
// kê đề đang dùng (theo khối×môn) + lịch sử. Điểm danh test lấy đề đang dùng khớp khối×môn (xem DiemDanhTestScreen).
import { useEffect, useMemo, useState } from 'react'
import { listDeTestDauVao, listNguonDe, sinhDeTestDauVao, doiTenDeTest, xoaDeTest, datDangDungDeTest, TEN_LOAI_DE, type DeTestRow } from '../../lib/detest'
import MTPrintView from '../tailieu/MTPrintView'
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
  // ⭐ CEO 21/09 "mọi màn phải sửa/xoá được card": ✎ đổi tên · 🗑 xoá (DB chặn khi đề đã có ca dùng) · "Đặt làm đang
  // dùng" cho bản lịch sử (đề đã dùng không xoá được ⇒ đây là đường đổi bản) · 👁 xem & in. Sau mutation: đổi tên vá tại
  // chỗ; xoá/đặt-đang-dùng làm đổi cờ "đang dùng" của cả nhóm ⇒ refetch NỀN, không xoá list (CLAUDE.md §2).
  const [sua, setSua] = useState<DeTestRow | null>(null)
  const [xem, setXem] = useState<DeTestRow | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const lamMoiNen = () => listDeTestDauVao().then(setRows).catch(() => {})
  async function xoa(d: DeTestRow) {
    setLoi(null)
    if (d.soCa > 0) { setLoi(`"${d.ten}" đã có ${d.soCa} ca test dùng — không xoá được. Muốn ngừng dùng thì đặt bản khác làm "đang dùng".`); return }
    if (!window.confirm(`Xoá hẳn đề "${d.ten}"?\n\nĐề chưa có ca test nào dùng. Xoá là mất đề này (đề nguồn MT vẫn còn, sinh lại được).`)) return
    try { await xoaDeTest(d.id); setRows((s) => s.filter((x) => x.id !== d.id)); lamMoiNen() } catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  async function datDangDung(d: DeTestRow) {
    setLoi(null)
    try { await datDangDungDeTest(d.id); await lamMoiNen() } catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  const hanhDong: HanhDongDe = { onSua: setSua, onXoa: xoa, onXem: setXem, onDatDangDung: datDangDung }

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
            {nhom.map((n) => <NhomCard key={`${n.khoi}|${n.mon}`} n={n} hd={hanhDong} />)}
          </div>
        )}
        {loi && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{loi}</p>}

        {form && <TaoDeModal onClose={() => setForm(false)} onDone={async () => { setForm(false); await reload() }} />}
        {sua && <SuaTenDeModal d={sua} onClose={() => setSua(null)} onDone={(ten) => { setRows((s) => s.map((x) => (x.id === sua.id ? { ...x, ten } : x))); setSua(null) }} />}
        {xem && <MTPrintView id={xem.id} onClose={() => setXem(null)} />}
      </div>
    </div>
  )
}

type HanhDongDe = { onSua: (d: DeTestRow) => void; onXoa: (d: DeTestRow) => void; onXem: (d: DeTestRow) => void; onDatDangDung: (d: DeTestRow) => void }
const nutNho = 'rounded-md px-1.5 py-0.5 text-[12px] text-slate-400 hover:bg-slate-100 hover:text-indigo-600'
function NutDe({ d, hd }: { d: DeTestRow; hd: HanhDongDe }) {
  return (
    <span className="flex shrink-0 gap-0.5">
      <button onClick={() => hd.onXem(d)} title="Xem & in đề (đủ các mã đề)" className={nutNho}>👁</button>
      <button onClick={() => hd.onSua(d)} title="Đổi tên đề" className={nutNho}>✎</button>
      <button onClick={() => hd.onXoa(d)} title={d.soCa > 0 ? `Đã có ${d.soCa} ca test dùng — không xoá được` : 'Xoá đề (chưa có ca nào dùng)'}
        className={`rounded-md px-1.5 py-0.5 text-[12px] ${d.soCa > 0 ? 'cursor-not-allowed text-slate-200' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}>🗑</button>
    </span>
  )
}

function NhomCard({ n, hd }: { n: Nhom; hd: HanhDongDe }) {
  const [moLichSu, setMoLichSu] = useState(false)
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-800">Khối {n.khoi}</span>
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{n.mon}</span>
        <span className="ml-auto rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Đang dùng</span>
        <NutDe d={n.hienTai} hd={hd} />
      </div>
      <div className="text-[13px] font-medium text-slate-700">{n.hienTai.ten}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">
        Nguồn: {n.hienTai.nguonLoai ? `${TEN_LOAI_DE[n.hienTai.nguonLoai] ?? n.hienTai.nguonLoai} · ` : ''}{n.hienTai.nguonTen ?? '—'} · {n.hienTai.createdAt.slice(0, 10)} · {n.hienTai.soCa} ca đã dùng
      </div>

      {n.lichSu.length > 0 && (
        <div className="mt-2 border-t border-slate-100 pt-2">
          <button onClick={() => setMoLichSu((v) => !v)} className="text-[11px] font-medium text-slate-500 hover:text-slate-700">
            {moLichSu ? '▾' : '▸'} Lịch sử ({n.lichSu.length})
          </button>
          {moLichSu && (
            <div className="mt-1.5 space-y-1">
              {n.lichSu.map((h) => (
                <div key={h.id} className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-500">
                  <span className="min-w-0 flex-1">{h.ten} · {h.createdAt.slice(0, 10)} · {h.soCa} ca đã dùng</span>
                  <button onClick={() => hd.onDatDangDung(h)} title="Đặt bản này làm đề đang dùng của khối × môn (ca test MỚI sẽ lấy bản này)" className="shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700">↑ Đặt làm đang dùng</button>
                  <NutDe d={h} hd={hd} />
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

function SuaTenDeModal({ d, onClose, onDone }: { d: DeTestRow; onClose: () => void; onDone: (ten: string) => void }) {
  const [ten, setTen] = useState(d.ten)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function save() {
    setBusy(true); setErr(null)
    try { await doiTenDeTest(d.id, ten); onDone(ten.trim()) } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[520px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-[16px] font-semibold text-slate-800">Đổi tên đề · Khối {d.khoi} · {d.mon}</div>
        <Lbl>Tên đề (in trên đầu phiếu phát cho học sinh)</Lbl>
        <input className={inputCls} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus />
        <p className="mt-1.5 text-[11px] text-slate-400">Nội dung câu không sửa ở đây — sửa ở MT nguồn rồi sinh đề mới (bản cũ thành lịch sử, ca đã chấm không bị ảnh hưởng).</p>
        {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Đóng</button>
          <button onClick={save} disabled={busy || !ten.trim() || ten.trim() === d.ten} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

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
