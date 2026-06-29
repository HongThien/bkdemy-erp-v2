import { useEffect, useState } from 'react'
import {
  getTaiLieuFull, updateTaiLieu, updatePhan, setCauOfPhan,
  addBuoi, deleteBuoi, setDangOfBuoi, reorderDangInBuoi, autoSuggestByLoai, autoSuggestBtvn, trichXuatBuoi, listTrichXuat,
  DEFAULT_LUYEN_COUNTS, DEFAULT_BTVN_COUNTS, DEFAULT_BTVN_LINES,
  type TaiLieuFull, type PhanResolved, type CauHinh, type TrichState,
} from '../../lib/tailieu'
import { listCauByDang, listDaiMap, groupMap, LOAI_CAU, type CauHoi, type Tier1Node } from '../../lib/kho/api'
import { listLop, type Lop } from '../../lib/nhansu'
import { MathText, inp } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import PrintView from './PrintView'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const MAU_PRESET = [['#E91E8C', 'Hồng'], ['#F7941E', 'Cam'], ['#2D9CDB', 'Xanh dương'], ['#16a34a', 'Xanh lá'], ['#7c3aed', 'Tím']]

// Gom phan → BUỔI (cho builder): giữ marker + ghép dang↔btvn theo ma_dang. Phan rời (data cũ) bỏ qua.
type BuoiUI = { marker: PhanResolved; dangs: PhanResolved[]; btvnByMa: Record<string, PhanResolved> }
function groupBuois(phans: PhanResolved[]): BuoiUI[] {
  const out: BuoiUI[] = []
  let cur: BuoiUI | null = null
  for (const p of phans) {
    if (p.loai_phan === 'buoi') { cur = { marker: p, dangs: [], btvnByMa: {} }; out.push(cur) }
    else if (!cur) continue
    else if (p.loai_phan === 'dang') cur.dangs.push(p)
    else if (p.loai_phan === 'btvn' && p.ref_ma) cur.btvnByMa[p.ref_ma] = p
  }
  return out
}

export default function TaiLieuBuilder({ id, onClose }: { id: string; onClose: () => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [ten, setTen] = useState('')
  const [ch, setCh] = useState<CauHinh>({})
  const [err, setErr] = useState<string | null>(null)
  const [printing, setPrinting] = useState(false)
  const [picker, setPicker] = useState<null | { phanId: string; maDangs: string[]; selected: string[] }>(null)
  const [dangPicker, setDangPicker] = useState<null | { buoiId: string; selected: string[] }>(null)
  const [trichOpen, setTrichOpen] = useState(false)
  const [saved, setSaved] = useState(false) // chỉ báo "đã tự động lưu" (builder lưu ngay mỗi thao tác, không có nút Lưu)
  const markSaved = () => setSaved(true)
  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t) }, [saved])

  async function reload() {
    const f = await getTaiLieuFull(id)
    setFull(f); setTen(f.taiLieu.ten); setCh(f.taiLieu.cau_hinh ?? {})
  }
  useEffect(() => { reload().catch((e) => setErr(e.message ?? String(e))) }, [id]) // eslint-disable-line

  async function saveTen() { if (full && ten.trim() && ten.trim() !== full.taiLieu.ten) { await updateTaiLieu(id, { ten: ten.trim() }); markSaved() } }
  async function saveCh(patch: Partial<CauHinh>) { const next = { ...ch, ...patch }; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() }
  async function applyCaus(phanId: string, maCaus: string[]) { await setCauOfPhan(phanId, maCaus); await reload(); markSaved() }
  const openPicker = (phanId: string, ma: string, selected: string[]) => setPicker({ phanId, maDangs: [ma], selected })
  const onLine = (maCau: string, n: number) => saveCh({ btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } })

  const jump = (pid: string) => document.getElementById('p-' + pid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const sel = 'h-8 rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500'

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!full) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const buois = groupBuois(full.phans)
  const linesByCau = ch.btvnLinesByCau ?? {}
  let dangNo = 0

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      {/* Thanh trên */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className={`${inp} h-9 max-w-[420px] flex-1 font-semibold`} placeholder="Tên giáo trình" />
        <span className="text-[12px] text-slate-400">Khối {full.taiLieu.khoi}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`} title="Mọi thay đổi được lưu tự động — không cần nút Lưu">{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
        <button onClick={() => setTrichOpen(true)} className="ml-auto rounded-md border border-violet-300 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50" title="Gán giáo trình cho 1 lớp → trích từng buổi thành GT buổi + BTVN bám ngày">⬇ Trích xuất / Gán lớp</button>
        <button onClick={() => setPrinting(true)} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">🖨 Xem / Xuất PDF</button>
      </div>

      {/* Setting chrome */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-5 py-2.5 text-[13px]">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Trình bày</span>
        <label className="flex items-center gap-1.5">Header <select value={ch.header ?? 'wave'} onChange={(e) => saveCh({ header: e.target.value as any })} className={sel}><option value="wave">Dải sóng</option><option value="none">Không</option></select></label>
        <label className="flex items-center gap-1.5">Footer <select value={ch.footer ?? 'wave'} onChange={(e) => saveCh({ footer: e.target.value as any })} className={sel}><option value="wave">Dải sóng</option><option value="none">Không</option></select></label>
        <label className="flex items-center gap-1.5">Màu
          <span className="flex gap-1">{MAU_PRESET.map(([c, n]) => (
            <button key={c} title={n} onClick={() => saveCh({ mau: c })} className={`h-6 w-6 rounded-full border-2 ${(ch.mau ?? '#E91E8C') === c ? 'border-slate-800' : 'border-white shadow'}`} style={{ background: c }} />
          ))}</span>
        </label>
      </div>

      {/* Cây trái (Buổi → Dạng → BTVN) + nội dung phải */}
      <div className="grid min-h-0 flex-1 grid-cols-[270px_1fr] overflow-hidden">
        <aside className="min-h-0 overflow-auto border-r border-slate-200 bg-white p-3">
          <StructureTree buois={buois} ten={ten} onJump={jump} />
        </aside>
        <div className="min-h-0 overflow-auto p-5">
          <div className="mx-auto max-w-[860px] space-y-4">
            {buois.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-[13px] text-slate-400">Chưa có buổi nào. Bấm “+ Thêm buổi” để bắt đầu.</div>}
            {buois.map((b) => {
              const startNo = dangNo; dangNo += b.dangs.length
              return (
                <BuoiCard
                  key={b.marker.id} buoi={b} startNo={startNo} linesByCau={linesByCau} onLine={onLine}
                  onRename={(t) => updatePhan(b.marker.id, { tieu_de: t }).then(reload).then(markSaved)}
                  onDelete={async () => { if (confirm('Xoá cả buổi này (gồm dạng trên lớp + BTVN)?')) { await deleteBuoi(id, b.marker.id); await reload(); markSaved() } }}
                  onChonDang={() => setDangPicker({ buoiId: b.marker.id, selected: b.dangs.map((d) => d.ref_ma!).filter(Boolean) })}
                  onReorderDang={async (order) => { await reorderDangInBuoi(id, b.marker.id, order); await reload(); markSaved() }}
                  onApply={applyCaus} openPicker={openPicker}
                />
              )
            })}
            <button onClick={async () => { await addBuoi(id); await reload(); markSaved() }} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm buổi</button>
          </div>
        </div>
      </div>

      {dangPicker && <DangPicker khoi={full.taiLieu.khoi} selected={dangPicker.selected} onClose={() => setDangPicker(null)} onConfirm={async (maDangs) => { const bid = dangPicker.buoiId; setDangPicker(null); await setDangOfBuoi(id, bid, maDangs); await reload(); markSaved() }} />}
      {picker && <KhoPicker {...picker} onClose={() => setPicker(null)} onConfirm={async (m) => { await applyCaus(picker.phanId, m); setPicker(null) }} />}
      {trichOpen && <TrichPanel masterId={id} khoi={full.taiLieu.khoi} buois={buois} onClose={() => setTrichOpen(false)} />}
      {printing && <PrintView id={id} onClose={() => setPrinting(false)} />}
    </div>
  )
}

// ── 1 BUỔI: tiêu đề (sửa được) + nút Chọn dạng + danh sách dạng (mỗi dạng có Bài luyện + BTVN) ──
function BuoiCard({ buoi, startNo, linesByCau, onLine, onRename, onDelete, onChonDang, onReorderDang, onApply, openPicker }: {
  buoi: BuoiUI; startNo: number; linesByCau: Record<string, number>; onLine: (maCau: string, n: number) => void
  onRename: (t: string) => void; onDelete: () => void; onChonDang: () => void; onReorderDang: (order: string[]) => void
  onApply: (phanId: string, maCaus: string[]) => void; openPicker: (phanId: string, ma: string, selected: string[]) => void
}) {
  const order = buoi.dangs.map((d) => d.ref_ma!).filter(Boolean)
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]; [next[i], next[j]] = [next[j], next[i]]
    onReorderDang(next)
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div id={`p-${buoi.marker.id}`} className="scroll-mt-3 flex items-center gap-2 rounded-t-xl border-b border-slate-100 bg-indigo-50/50 px-4 py-2.5">
        <span className="text-[14px]">🗓️</span>
        <input defaultValue={buoi.marker.tieu_de ?? ''} onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== buoi.marker.tieu_de) onRename(v) }}
          className="w-[200px] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[15px] font-bold text-indigo-800 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white" />
        <span className="text-[12px] text-slate-400">{buoi.dangs.length} dạng</span>
        <button onClick={onChonDang} className="ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">+ Chọn dạng</button>
        <button onClick={onDelete} title="Xoá buổi" className="rounded border border-slate-200 px-1.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
      </div>
      <div className="space-y-3 p-4">
        {buoi.dangs.length === 0
          ? <div className="text-[12px] italic text-slate-400">Chưa có dạng — bấm “+ Chọn dạng” để chọn các dạng cho buổi (mọi chuyên đề).</div>
          : buoi.dangs.map((d, i) => (
            <DangCard key={d.id} no={startNo + i + 1} dang={d} btvn={d.ref_ma ? buoi.btvnByMa[d.ref_ma] : undefined}
              linesByCau={linesByCau} onLine={onLine} onApply={onApply} openPicker={openPicker}
              canUp={i > 0} canDown={i < buoi.dangs.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
          ))}
      </div>
    </div>
  )
}

// ── 1 DẠNG trong buổi: 2 khối cấu hình — Bài luyện (trên lớp) + BTVN (về nhà), đều theo số câu mỗi loại ──
function DangCard({ no, dang, btvn, linesByCau, onLine, onApply, openPicker, canUp, canDown, onUp, onDown }: {
  no: number; dang: PhanResolved; btvn?: PhanResolved; linesByCau: Record<string, number>
  onLine: (maCau: string, n: number) => void; onApply: (phanId: string, maCaus: string[]) => void; openPicker: (phanId: string, ma: string, selected: string[]) => void
  canUp: boolean; canDown: boolean; onUp: () => void; onDown: () => void
}) {
  const ma = dang.ref_ma!
  const [luyenCnt, setLuyenCnt] = useState<Record<string, number>>({ ...DEFAULT_LUYEN_COUNTS })
  const [btvnCnt, setBtvnCnt] = useState<Record<string, number>>({ ...DEFAULT_BTVN_COUNTS })
  const numIn = 'h-7 w-11 rounded border border-slate-300 px-1 text-center text-[12px]'
  async function goiYLuyen() { onApply(dang.id, await autoSuggestByLoai(ma, luyenCnt)) }
  async function goiYBtvn() { if (btvn) onApply(btvn.id, await autoSuggestBtvn([ma], new Set(dang.caus.map((c) => c.ma_cau)), btvnCnt)) }

  const counts = (cnt: Record<string, number>, set: (f: (s: Record<string, number>) => Record<string, number>) => void) => (
    LOAI_CAU.map((l) => (
      <label key={l.value} className="flex items-center gap-1">{l.label}
        <input type="number" min={0} value={cnt[l.value] ?? 0} onChange={(e) => set((s) => ({ ...s, [l.value]: Math.max(0, +e.target.value || 0) }))} className={numIn} />
      </label>
    ))
  )

  return (
    <div id={`p-${dang.id}`} className="scroll-mt-3 overflow-hidden rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <span className="flex shrink-0 flex-col leading-none" title="Đổi thứ tự dạng trong buổi">
          <button onClick={onUp} disabled={!canUp} className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▲</button>
          <button onClick={onDown} disabled={!canDown} className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▼</button>
        </span>
        <span className="text-[14px] font-semibold text-pink-600">Dạng {no}: {dang.dang?.ten_dang ?? ma}</span>
        <span className="truncate text-[11px] text-slate-400">· {dang.dang?.ten_chuyen_de ?? ''}</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${dang.lyThuyetDang?.noi_dung?.trim() ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{dang.lyThuyetDang?.noi_dung?.trim() ? 'có lý thuyết' : 'chưa có lý thuyết'}</span>
      </div>

      {/* Bài luyện (trên lớp) */}
      <div className="border-b border-slate-100 p-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="font-semibold text-sky-700">📘 Bài luyện</span>
          {counts(luyenCnt, setLuyenCnt)}
          <button onClick={goiYLuyen} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100">↻ Gợi ý</button>
          <button onClick={() => openPicker(dang.id, ma, dang.caus.map((c) => c.ma_cau))} className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu</button>
        </div>
        {dang.caus.length > 0
          ? <ol className="mt-2 space-y-1">{dang.caus.map((c, i) => <CauRow key={c.ma_cau} no={i + 1} c={c} onRemove={() => onApply(dang.id, dang.caus.filter((x) => x.ma_cau !== c.ma_cau).map((x) => x.ma_cau))} />)}</ol>
          : <div className="mt-2 text-[12px] italic text-slate-400">Chưa có câu luyện — bấm “Gợi ý” hoặc “Chọn câu”.</div>}
      </div>

      {/* BTVN (về nhà) — phiếu HS viết thẳng, có ô số dòng kẻ mỗi bài */}
      <div className="bg-orange-50/30 p-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="font-semibold text-orange-600">📝 BTVN</span>
          {btvn ? counts(btvnCnt, setBtvnCnt) : <span className="italic text-slate-400">—</span>}
          {btvn && <button onClick={goiYBtvn} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100">↻ Gợi ý</button>}
          {btvn && <button onClick={() => openPicker(btvn.id, ma, btvn.caus.map((c) => c.ma_cau))} className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu</button>}
        </div>
        {btvn && (btvn.caus.length > 0
          ? <ol className="mt-2 space-y-1">{btvn.caus.map((c, i) => (
            <li key={c.ma_cau} className="flex items-center gap-2 rounded-md border border-slate-100 bg-white/70 px-2.5 py-1.5">
              <span className="text-[12px] font-bold text-slate-400">{i + 1}.</span>
              <MaCau ma={c.ma_cau} />
              <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
              <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
              <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title="Số dòng kẻ để HS viết bài này">dòng
                <input type="number" min={0} max={30} value={linesByCau[c.ma_cau] ?? DEFAULT_BTVN_LINES} onChange={(e) => onLine(c.ma_cau, Math.max(0, Math.min(30, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
              </label>
              <button onClick={() => onApply(btvn.id, btvn.caus.filter((x) => x.ma_cau !== c.ma_cau).map((x) => x.ma_cau))} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">✕</button>
            </li>
          ))}</ol>
          : <div className="mt-2 text-[12px] italic text-slate-400">Chưa có câu BTVN — bấm “Gợi ý” hoặc “Chọn câu”.</div>)}
      </div>
    </div>
  )
}

// Badge mã câu — chỉ hiện khi SOẠN (đối chiếu với Tìm câu), KHÔNG lên bản in HS.
function MaCau({ ma }: { ma: string }) {
  return <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500" title="Mã câu">{ma}</span>
}

function CauRow({ no, c, onRemove }: { no: number; c: CauHoi; onRemove: () => void }) {
  return (
    <li className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50/50 px-2.5 py-1.5">
      <span className="text-[12px] font-bold text-slate-400">{no}.</span>
      <MaCau ma={c.ma_cau} />
      <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
      <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
      <button onClick={onRemove} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">✕</button>
    </li>
  )
}

// ── Bộ chọn DẠNG cho 1 buổi (đa chọn, mọi chuyên đề; chọn 1 phần chuyên đề được) ──
export function DangPicker({ khoi, selected, onClose, onConfirm }: { khoi: string; selected: string[]; onClose: () => void; onConfirm: (maDangs: string[]) => void }) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [loading, setLoading] = useState(true)
  useEffect(() => { listDaiMap(khoi).then((r) => { setTree(groupMap(r)); setLoading(false) }).catch(() => setLoading(false)) }, [khoi])
  const toggle = (ma: string) => setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })
  const toggleCd = (mas: string[], on: boolean) => setSel((s) => { const n = new Set(s); mas.forEach((m) => on ? n.add(m) : n.delete(m)); return n })
  function confirm() {
    const all = tree.flatMap((t1) => t1.tier2s.flatMap((t2) => t2.leaves.map((l) => l.leafMa)))
    onConfirm(all.filter((m) => sel.has(m))) // giữ thứ tự bản đồ → dạng cùng chuyên đề liền nhau
  }
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[14%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn dạng cho buổi · Khối {khoi}</h3>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : tree.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có dạng.</p>
            : tree.map((t1) => (
              <div key={t1.t1Ma} className="mb-4">
                <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t1.t1Ten}</div>
                {t1.tier2s.map((t2) => {
                  const mas = t2.leaves.map((l) => l.leafMa)
                  const allOn = mas.every((m) => sel.has(m))
                  return (
                    <div key={t2.t2Ma} className="mb-3 rounded-lg border border-slate-100 p-2">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-sky-700">{t2.t2Ten}</span>
                        <button onClick={() => toggleCd(mas, !allOn)} className="ml-auto rounded px-2 py-0.5 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50">{allOn ? 'Bỏ cả chuyên đề' : 'Chọn cả chuyên đề'}</button>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {t2.leaves.map((l) => (
                          <label key={l.leafMa} className={`flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-1.5 ${sel.has(l.leafMa) ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <input type="checkbox" checked={sel.has(l.leafMa)} onChange={() => toggle(l.leafMa)} className="mt-0.5" />
                            <span className="min-w-0 flex-1 text-[13px] text-slate-700">{l.leafTen}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={confirm} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Dùng {sel.size} dạng</button>
        </div>
      </div>
    </div>
  )
}

// Cây quan hệ bên trái: Buổi → Dạng → BTVN. Click = nhảy tới thẻ.
function StructureTree({ buois, ten, onJump }: { buois: BuoiUI[]; ten: string; onJump: (pid: string) => void }) {
  const item = 'block w-full truncate rounded px-2 py-1 text-left text-[13px] hover:bg-slate-100'
  let dangNo = 0
  return (
    <div>
      <div className="mb-2 truncate px-1 text-[13px] font-bold text-slate-700">📄 {ten || 'Giáo trình'}</div>
      {buois.length === 0 && <div className="px-2 py-3 text-[12px] italic text-slate-400">Chưa có buổi.</div>}
      {buois.map((b) => (
        <div key={b.marker.id} className="mb-1">
          <button onClick={() => onJump(b.marker.id)} className={`${item} font-semibold text-indigo-700`}>🗓️ {b.marker.tieu_de}</button>
          <div className="ml-2 border-l border-slate-100 pl-1">
            {b.dangs.map((d) => { dangNo += 1; return <button key={d.id} onClick={() => onJump(d.id)} className={`${item} text-slate-600`}>Dạng {dangNo}: {d.dang?.ten_dang ?? d.ref_ma} <span className="text-slate-300">({d.caus.length})</span></button> })}
            {b.dangs.length > 0 && <div className="px-2 py-1 text-[12px] text-orange-500">📝 BTVN ({Object.values(b.btvnByMa).reduce((s, p) => s + p.caus.length, 0)} câu)</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function KhoPicker({ maDangs, selected, onClose, onConfirm }: { maDangs: string[]; selected: string[]; onClose: () => void; onConfirm: (m: string[]) => void }) {
  const [groups, setGroups] = useState<{ maDang: string; caus: CauHoi[] }[]>([])
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [fLoai, setFLoai] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all(maDangs.map(async (md) => ({ maDang: md, caus: await listCauByDang(md) }))).then((g) => { setGroups(g); setLoading(false) }).catch(() => setLoading(false))
  }, []) // eslint-disable-line
  const toggle = (ma: string) => setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })
  const toggleLoai = (v: string) => setFLoai((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n })
  function confirm() {
    const all = groups.flatMap((g) => g.caus.map((c) => c.ma_cau))
    const ordered = [...selected.filter((s) => sel.has(s)), ...all.filter((m) => sel.has(m) && !selected.includes(m))]
    onConfirm(ordered)
  }
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[12%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn câu từ kho</h3>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-6 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lọc loại:</span>
          {LOAI_CAU.map((l) => (
            <button key={l.value} onClick={() => toggleLoai(l.value)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${fLoai.has(l.value) ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700'}`}>{l.label}</button>
          ))}
          {fLoai.size > 0 && <button onClick={() => setFLoai(new Set())} className="ml-1 text-[12px] font-medium text-slate-400 hover:text-rose-600">Xoá lọc</button>}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : groups.every((g) => !g.caus.length) ? <p className="text-sm text-slate-400">Kho các dạng này chưa có câu nào.</p>
            : groups.map((g) => {
              const caus = fLoai.size ? g.caus.filter((c) => fLoai.has(c.loai_cau)) : g.caus
              return (
                <div key={g.maDang} className="mb-4">
                  {maDangs.length > 1 && <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">Dạng {g.maDang}</div>}
                  <div className="space-y-1">
                    {caus.map((c) => (
                      <label key={c.ma_cau} className={`flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-1.5 ${sel.has(c.ma_cau) ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={sel.has(c.ma_cau)} onChange={() => toggle(c.ma_cau)} className="mt-1" />
                        <MaCau ma={c.ma_cau} />
                        <span className="min-w-0 flex-1 text-[14px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
                      </label>
                    ))}
                    {caus.length === 0 && <div className="px-1 py-1 text-[12px] italic text-slate-400">— không có câu khớp lọc —</div>}
                  </div>
                </div>
              )
            })}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={confirm} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Dùng {sel.size} câu</button>
        </div>
      </div>
    </div>
  )
}

// TRÍCH XUẤT cấp GIÁO TRÌNH: chọn LỚP → hiện 10 buổi + TRẠNG THÁI đã gán (ngày nào) cho lớp đó → gán buổi chưa gán.
function TrichPanel({ masterId, khoi, buois, onClose }: { masterId: string; khoi: string; buois: BuoiUI[]; onClose: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [state, setState] = useState<Record<string, TrichState>>({})
  const [loading, setLoading] = useState(false)
  useEffect(() => { listLop().then(setLops).catch(() => { }) }, [])
  const lop = lops.find((l) => l.id === lopId)
  async function loadState(id: string) { setLoading(true); try { setState(await listTrichXuat(masterId, id)) } finally { setLoading(false) } }
  useEffect(() => { if (lopId) loadState(lopId); else setState({}) }, [lopId]) // eslint-disable-line

  async function gan(buoiId: string, tenBuoi: string, ngay: string, gt: boolean, bt: boolean) {
    if (!lop) return
    await trichXuatBuoi(masterId, buoiId, { lopId: lop.id, ngay, khoi, tenLop: lop.ten_lop, tenBuoi, giaoTrinh: gt, btvn: bt })
    await loadState(lop.id)
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[12%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Trích xuất giáo trình → gán cho lớp</h3>
          <div className="w-56"><SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
            options={lops.filter((l) => !khoi || l.khoi === khoi).map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {!lop ? <p className="text-center text-sm text-slate-400">Chọn lớp để xem trạng thái gán + trích từng buổi.</p>
            : loading ? <p className="text-sm text-slate-400">Đang tải trạng thái…</p>
            : (
              <div className="mx-auto max-w-[760px] space-y-2">
                <p className="mb-2 text-[12px] text-slate-400">Mỗi buổi của giáo trình → gán cho 1 ngày của lớp <b>{lop.ten_lop}</b> → sinh “Giáo trình buổi” + “BTVN” vào Kho. Buổi đã gán hiện ngày.</p>
                {buois.map((b, i) => <BuoiTrichRow key={b.marker.id} no={i + 1} buoi={b} st={state[b.marker.id]} onGan={(ngay, gt, bt) => gan(b.marker.id, b.marker.tieu_de || `Buổi ${i + 1}`, ngay, gt, bt)} />)}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

function BuoiTrichRow({ no, buoi, st, onGan }: { no: number; buoi: BuoiUI; st?: TrichState; onGan: (ngay: string, gt: boolean, bt: boolean) => Promise<void> }) {
  const [ngay, setNgay] = useState('')
  const [gt, setGt] = useState(true)
  const [bt, setBt] = useState(true)
  const [busy, setBusy] = useState(false)
  const ganNgay = st?.ngay ? st.ngay.split('-').reverse().join('/') : null
  async function go() { if (!ngay || (!gt && !bt)) return; setBusy(true); try { await onGan(ngay, gt, bt) } finally { setBusy(false) } }
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5">
      <span className="w-6 shrink-0 text-center text-[13px] font-bold text-indigo-600">{no}</span>
      <div className="min-w-[120px] flex-1">
        <div className="text-[13px] font-semibold text-slate-800">{buoi.marker.tieu_de || `Buổi ${no}`}</div>
        <div className="text-[11px] text-slate-400">{buoi.dangs.length} dạng</div>
      </div>
      {ganNgay ? (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">✓ Đã gán · {ganNgay}</span>
          <span className="text-[11px] text-slate-400">{st?.hasGT ? 'GT' : ''}{st?.hasGT && st?.hasBTVN ? ' + ' : ''}{st?.hasBTVN ? 'BTVN' : ''}</span>
          <button onClick={go} disabled={busy || !ngay} title="Gán lại sang ngày khác (tạo bản mới)" className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-indigo-300">Gán lại</button>
          <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />
          <label className="flex items-center gap-1 text-[12px] text-slate-600"><input type="checkbox" checked={gt} onChange={(e) => setGt(e.target.checked)} />GT</label>
          <label className="flex items-center gap-1 text-[12px] text-slate-600"><input type="checkbox" checked={bt} onChange={(e) => setBt(e.target.checked)} />BTVN</label>
          <button onClick={go} disabled={busy || !ngay || (!gt && !bt)} className="rounded-md bg-violet-600 px-3 py-1 text-[12px] font-medium text-white hover:bg-violet-500 disabled:opacity-40">{busy ? '…' : 'Gán'}</button>
        </div>
      )}
    </div>
  )
}
