import { useEffect, useState } from 'react'
import {
  getTaiLieuFull, updateTaiLieu, setCauOfPhan, reorderPhan, deletePhan, autoSuggestByLoai, themChuyenDe, ensureBtvnPhan,
  type TaiLieuFull, type PhanResolved, type CauHinh,
} from '../../lib/tailieu'
import { listCauByDang, listDaiMap, groupMap, LOAI_CAU, type CauHoi, type Tier1Node } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import PrintView from './PrintView'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const MAU_PRESET = [['#E91E8C', 'Hồng'], ['#F7941E', 'Cam'], ['#2D9CDB', 'Xanh dương'], ['#16a34a', 'Xanh lá'], ['#7c3aed', 'Tím']]

export default function TaiLieuBuilder({ id, onClose }: { id: string; onClose: () => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [ten, setTen] = useState('')
  const [ch, setCh] = useState<CauHinh>({})
  const [err, setErr] = useState<string | null>(null)
  const [printing, setPrinting] = useState(false)
  const [picker, setPicker] = useState<null | { phanId: string; maDangs: string[]; selected: string[] }>(null)
  const [cdPicker, setCdPicker] = useState(false)

  async function reload() {
    let f = await getTaiLieuFull(id)
    // có nội dung mà chưa có BTVN → tạo 1 phần BTVN (luôn cuối)
    if (f.phans.some((p) => p.loai_phan !== 'btvn') && !f.phans.some((p) => p.loai_phan === 'btvn')) {
      await ensureBtvnPhan(id); f = await getTaiLieuFull(id)
    }
    setFull(f); setTen(f.taiLieu.ten); setCh(f.taiLieu.cau_hinh ?? {})
  }
  useEffect(() => { reload().catch((e) => setErr(e.message ?? String(e))) }, [id]) // eslint-disable-line

  async function saveTen() { if (full && ten.trim() && ten.trim() !== full.taiLieu.ten) await updateTaiLieu(id, { ten: ten.trim() }) }
  async function saveCh(patch: Partial<CauHinh>) { const next = { ...ch, ...patch }; setCh(next); await updateTaiLieu(id, { cau_hinh: next }) }

  const dangPhans = full?.phans.filter((p) => p.loai_phan === 'dang') ?? []
  const allDangMas = dangPhans.map((p) => p.ref_ma!).filter(Boolean)

  async function applyCaus(phanId: string, maCaus: string[]) { await setCauOfPhan(phanId, maCaus); await reload() }
  async function moveDang(phan: PhanResolved, dir: -1 | 1) {
    if (!full) return
    const ids = full.phans.map((p) => p.id)
    const i = ids.indexOf(phan.id), j = i + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    await reorderPhan(ids); await reload()
  }
  // Xoá nguyên block 1 chuyên đề (phần LT chuyên đề + các dạng liền sau, tới chuyên đề/BTVN kế).
  async function deleteChuyenDeBlock(lt: PhanResolved) {
    if (!full) return
    if (!confirm('Xoá chuyên đề này khỏi tài liệu (gồm lý thuyết + các dạng của nó)?')) return
    const ps = full.phans
    const idx = ps.findIndex((p) => p.id === lt.id)
    const del = [ps[idx].id]
    for (let i = idx + 1; i < ps.length && ps[i].loai_phan === 'dang'; i++) del.push(ps[i].id)
    for (const pid of del) await deletePhan(pid)
    await reload()
  }

  const sel = 'h-8 rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500'

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!full) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  let dangNo = 0

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      {/* Thanh trên */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className={`${inp} h-9 max-w-[420px] flex-1 font-semibold`} placeholder="Tên giáo trình" />
        <span className="text-[12px] text-slate-400">Khối {full.taiLieu.khoi}</span>
        <button onClick={() => setPrinting(true)} className="ml-auto rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">🖨 Xem / Xuất PDF</button>
      </div>

      {/* Setting chrome */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-5 py-2.5 text-[13px]">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Trình bày</span>
        <label className="flex items-center gap-1.5">Header <select value={ch.header ?? 'wave'} onChange={(e) => saveCh({ header: e.target.value as any })} className={sel}><option value="wave">Dải sóng</option><option value="none">Không</option></select></label>
        <label className="flex items-center gap-1.5">Footer <select value={ch.footer ?? 'wave'} onChange={(e) => saveCh({ footer: e.target.value as any })} className={sel}><option value="wave">Dải sóng</option><option value="none">Không</option></select></label>
        <label className="flex items-center gap-1.5">Watermark <select value={ch.watermark ?? 'none'} onChange={(e) => saveCh({ watermark: e.target.value as any })} className={sel}><option value="none">Không</option><option value="logo">Logo mờ</option></select></label>
        <label className="flex items-center gap-1.5">Màu
          <span className="flex gap-1">{MAU_PRESET.map(([c, n]) => (
            <button key={c} title={n} onClick={() => saveCh({ mau: c })} className={`h-6 w-6 rounded-full border-2 ${(ch.mau ?? '#E91E8C') === c ? 'border-slate-800' : 'border-white shadow'}`} style={{ background: c }} />
          ))}</span>
        </label>
      </div>

      {/* Cấu trúc */}
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[820px] space-y-3">
          {full.phans.filter((p) => p.loai_phan !== 'btvn').map((p) => {
            if (p.loai_phan === 'lt_chuyen_de') return (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-sky-700">📘 Lý thuyết chuyên đề {p.ref_ma}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${p.ltChuyenDe?.noi_dung?.trim() ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{p.ltChuyenDe?.noi_dung?.trim() ? 'có nội dung' : 'chưa có (sửa ở Bản đồ kiến thức)'}</span>
                  <button onClick={() => deleteChuyenDeBlock(p)} className="ml-auto text-[12px] font-medium text-slate-400 hover:text-rose-600">Xoá chuyên đề</button>
                </div>
                {p.ltChuyenDe?.noi_dung?.trim() && <div className="mt-2 line-clamp-2 text-[13px] text-slate-500"><MathText>{p.ltChuyenDe.noi_dung.slice(0, 200)}</MathText></div>}
              </div>
            )
            dangNo += 1
            return <DangCard key={p.id} no={dangNo} p={p} onPick={() => setPicker({ phanId: p.id, maDangs: [p.ref_ma!], selected: p.caus.map((c) => c.ma_cau) })} onApply={(m) => applyCaus(p.id, m)} onMove={(d) => moveDang(p, d)} />
          })}

          <button onClick={() => setCdPicker(true)} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm chuyên đề</button>

          {full.phans.filter((p) => p.loai_phan === 'btvn').map((p) => (
            <BtvnCard key={p.id} p={p} onPick={() => setPicker({ phanId: p.id, maDangs: allDangMas, selected: p.caus.map((c) => c.ma_cau) })} onApply={(m) => applyCaus(p.id, m)} />
          ))}
        </div>
      </div>

      {cdPicker && <ChuyenDePicker khoi={full.taiLieu.khoi} onClose={() => setCdPicker(false)} onPick={async (maCd) => { setCdPicker(false); await themChuyenDe(id, full.taiLieu.khoi, maCd); await reload() }} />}
      {picker && <KhoPicker {...picker} onClose={() => setPicker(null)} onConfirm={async (m) => { await applyCaus(picker.phanId, m); setPicker(null) }} />}
      {printing && <PrintView id={id} onClose={() => setPrinting(false)} />}
    </div>
  )
}

function ChuyenDePicker({ khoi, onClose, onPick }: { khoi: string; onClose: () => void; onPick: (maCd: string) => void }) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { listDaiMap(khoi).then((r) => { setTree(groupMap(r)); setLoading(false) }).catch(() => setLoading(false)) }, [khoi])
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[18%] inset-y-12 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Thêm chuyên đề · Khối {khoi}</h3>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : tree.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có chuyên đề.</p>
            : tree.map((t1) => (
              <div key={t1.t1Ma} className="mb-4">
                <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t1.t1Ten}</div>
                <div className="space-y-1">
                  {t1.tier2s.map((t2) => (
                    <button key={t2.t2Ma} onClick={() => onPick(t2.t2Ma)} className="flex w-full items-center gap-2 rounded-md border border-slate-100 px-3 py-2 text-left text-[14px] hover:border-indigo-300 hover:bg-indigo-50/40">
                      <span className="min-w-0 flex-1 truncate text-slate-700">{t2.t2Ten}</span>
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[11px] text-slate-500">{t2.leaves.length} dạng · {t2.t2Ma}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function CauRow({ no, c, onRemove }: { no: number; c: CauHoi; onRemove: () => void }) {
  return (
    <li className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50/50 px-2.5 py-1.5">
      <span className="text-[12px] font-bold text-slate-400">{no}.</span>
      <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
      <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
      <button onClick={onRemove} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">✕</button>
    </li>
  )
}

function DangCard({ no, p, onPick, onApply, onMove }: { no: number; p: PhanResolved; onPick: () => void; onApply: (m: string[]) => void; onMove: (d: -1 | 1) => void }) {
  const [cnt, setCnt] = useState<Record<string, number>>({ trac_nghiem: 3, tra_loi_ngan: 2, tu_luan: 1 })
  async function goiYLai() { onApply(await autoSuggestByLoai(p.ref_ma!, cnt)) }
  const numIn = 'h-7 w-11 rounded border border-slate-300 px-1 text-center text-[12px]'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-pink-600">Dạng {no}: {p.dang?.ten_dang ?? p.ref_ma}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${p.lyThuyetDang?.noi_dung?.trim() ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{p.lyThuyetDang?.noi_dung?.trim() ? 'có lý thuyết' : 'chưa có lý thuyết'}</span>
        <span className="ml-auto flex gap-1">
          <button onClick={() => onMove(-1)} title="Lên" className="rounded border border-slate-200 px-1.5 text-slate-400 hover:text-indigo-600">↑</button>
          <button onClick={() => onMove(1)} title="Xuống" className="rounded border border-slate-200 px-1.5 text-slate-400 hover:text-indigo-600">↓</button>
        </span>
      </div>
      {/* Cấu hình số câu luyện */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px]">
        <span className="font-medium text-slate-500">Bài luyện:</span>
        {LOAI_CAU.map((l) => (
          <label key={l.value} className="flex items-center gap-1">{l.label}
            <input type="number" min={0} value={cnt[l.value] ?? 0} onChange={(e) => setCnt((s) => ({ ...s, [l.value]: Math.max(0, +e.target.value || 0) }))} className={numIn} />
          </label>
        ))}
        <button onClick={goiYLai} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100">↻ Gợi ý lại</button>
        <button onClick={onPick} className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu từ kho</button>
      </div>
      {p.caus.length > 0 ? (
        <ol className="mt-2 space-y-1">{p.caus.map((c, i) => <CauRow key={c.ma_cau} no={i + 1} c={c} onRemove={() => onApply(p.caus.filter((x) => x.ma_cau !== c.ma_cau).map((x) => x.ma_cau))} />)}</ol>
      ) : <div className="mt-2 text-[12px] italic text-slate-400">Chưa có câu luyện — bấm “Gợi ý lại” hoặc “Chọn câu từ kho”.</div>}
    </div>
  )
}

function BtvnCard({ p, onPick, onApply }: { p: PhanResolved; onPick: () => void; onApply: (m: string[]) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-orange-500">📝 Bài tập về nhà</span>
        <button onClick={onPick} className="ml-auto rounded-md border border-slate-300 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu từ kho</button>
      </div>
      {p.caus.length > 0 ? (
        <ol className="mt-2 space-y-1">{p.caus.map((c, i) => <CauRow key={c.ma_cau} no={i + 1} c={c} onRemove={() => onApply(p.caus.filter((x) => x.ma_cau !== c.ma_cau).map((x) => x.ma_cau))} />)}</ol>
      ) : <div className="mt-2 text-[12px] italic text-slate-400">Chưa có câu BTVN — bấm “Chọn câu từ kho”.</div>}
    </div>
  )
}

function KhoPicker({ maDangs, selected, onClose, onConfirm }: { maDangs: string[]; selected: string[]; onClose: () => void; onConfirm: (m: string[]) => void }) {
  const [groups, setGroups] = useState<{ maDang: string; caus: CauHoi[] }[]>([])
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all(maDangs.map(async (md) => ({ maDang: md, caus: await listCauByDang(md) }))).then((g) => { setGroups(g); setLoading(false) }).catch(() => setLoading(false))
  }, []) // eslint-disable-line
  const toggle = (ma: string) => setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })
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
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : groups.every((g) => !g.caus.length) ? <p className="text-sm text-slate-400">Kho các dạng này chưa có câu nào.</p>
            : groups.map((g) => (
              <div key={g.maDang} className="mb-4">
                {maDangs.length > 1 && <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">Dạng {g.maDang}</div>}
                <div className="space-y-1">
                  {g.caus.map((c) => (
                    <label key={c.ma_cau} className={`flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-1.5 ${sel.has(c.ma_cau) ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={sel.has(c.ma_cau)} onChange={() => toggle(c.ma_cau)} className="mt-1" />
                      <span className="min-w-0 flex-1 text-[14px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                      <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={confirm} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Dùng {sel.size} câu</button>
        </div>
      </div>
    </div>
  )
}
