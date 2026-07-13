// Màn "BT" (tài liệu bổ trợ) — RIÊNG BIỆT Kho tài liệu chung (Thùy 07-10: nhiều loại lẫn vào 1 Kho
// khó tìm). BT gán theo HỌC SINH (không theo lớp): Chọn HS → hệ gợi ý dạng cần bổ trợ (theo đánh giá
// từng dạng đã có, getMasteryHS) → mỗi dạng chọn SỐ LƯỢNG theo THỂ LOẠI câu (setup như Bài luyện/BTVN
// của Giáo trình — DangCard/TaiLieuBuilder) → gợi ý câu ít dùng nhất hoặc chọn tay, tự luận chỉnh SỐ
// DÒNG → in phiếu có tên riêng HS. Autosave mỗi thao tác (không có nút "Lưu" riêng, giống MT).
import { useEffect, useState } from 'react'
import {
  listBT, getBT, createBT, renameBT, deleteBT, addDangBT, timHocSinhBT, monCuaHS,
  getBTGrades, gradeBTCau, deleteBTGrade, type BT, type BTGrade, type BTGradeResult,
} from '../../lib/bt'
import {
  getTaiLieuFull, updateTaiLieu, deletePhan, setCauOfPhan, autoSuggestByLoai, khoCuaMon,
  DEFAULT_LUYEN_COUNTS, DEFAULT_BTVN_LINES, ET_FORMS, etFormOf, type PhanResolved, type CauHinh, type ETForm as ETFormKind,
} from '../../lib/tailieu'
import { getMasteryHS, type DangMastery } from '../../lib/mastery'
import { LOAI_CAU, KHOI_OPTIONS } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import BTPrintView from './BTPrintView'
import { useStore } from '../../store/useStore'
import DangPickerOne from '../../components/DangPickerOne'

const inp = 'h-9 rounded-lg border border-slate-300 px-2.5 text-[13px] outline-none focus:border-indigo-400'
const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const MUC_LABEL: Record<string, string> = { yeu: 'Yếu', can_luyen: 'Cần luyện' }
const MUC_CLASS: Record<string, string> = { yeu: 'border-rose-300 bg-rose-50 text-rose-700', can_luyen: 'border-amber-300 bg-amber-50 text-amber-700' }
// Chấm BT — mirror ET_KQ (BuoiHocScreen.tsx): 3 nút Đ/C/S, bấm lại nút đang chọn = bỏ chấm.
const BT_KQ: { v: BTGradeResult; lbl: string; idle: string; sel: string }[] = [
  { v: 'correct', lbl: 'Đ', idle: 'border-slate-200 text-emerald-700 hover:bg-emerald-50', sel: 'border-transparent bg-emerald-600 text-white' },
  { v: 'partial', lbl: 'C', idle: 'border-slate-200 text-amber-700 hover:bg-amber-50', sel: 'border-transparent bg-amber-500 text-white' },
  { v: 'wrong', lbl: 'S', idle: 'border-slate-200 text-rose-700 hover:bg-rose-50', sel: 'border-transparent bg-rose-600 text-white' },
]

// ═══════════ LIST (Kho BT riêng) ═══════════
export default function BTScreen() {
  const [q, setQ] = useState('')
  const [list, setList] = useState<BT[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [printId, setPrintId] = useState<string | null>(null)

  async function reload() { setLoading(true); try { setList(await listBT()) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [])

  if (openId) return <BTEditor id={openId} onClose={() => { setOpenId(null); reload() }} />

  const ql = q.trim().toLowerCase()
  const filtered = list.filter((d) => !ql || d.ten.toLowerCase().includes(ql) || d.hoc_sinh?.ho_ten.toLowerCase().includes(ql) || d.hoc_sinh?.ma_hs?.toLowerCase().includes(ql))

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">BT</span>
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">tài liệu bổ trợ — gán theo học sinh, riêng Kho tài liệu chung</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên HS / mã HS / tên BT…" className={`${inp} w-64`} />
        <button onClick={() => setCreating(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo BT mới</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : filtered.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">{ql ? 'Không tìm thấy BT khớp.' : 'Chưa có BT nào.'}</div>
          : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <div key={d.id} className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                  <button onClick={() => setOpenId(d.id)} className="block w-full text-left">
                    <div className="pr-6 font-medium text-slate-800">{d.ten}</div>
                    <div className="mt-1 text-[12px] text-slate-500">{d.hoc_sinh?.ho_ten}{d.hoc_sinh?.ma_hs ? ` · ${d.hoc_sinh.ma_hs}` : ''} · Khối {d.khoi} · {d.mon}</div>
                  </button>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); setPrintId(d.id) }} title="In BT" className="rounded-md px-1.5 py-1 text-[13px] text-slate-300 hover:text-indigo-600">🖨</button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!confirm(`Xoá BT "${d.ten}" của ${d.hoc_sinh?.ho_ten}?`)) return
                        await deleteBT(d.id); reload()
                      }}
                      title="Xoá BT" className="rounded-md px-1.5 py-1 text-[13px] text-slate-300 hover:text-rose-600">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      {creating && <ChonHocSinhModal onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setOpenId(id) }} />}
      {printId && <BTPrintView id={printId} onClose={() => setPrintId(null)} />}
    </div>
  )
}

type HSResult = { id: string; ma_hs: string | null; ho_ten: string; khoi: string | null; lop: string[] }

// ── Chọn học sinh (+ môn nếu HS học nhiều môn) để tạo BT mới ──
function ChonHocSinhModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<HSResult[]>([])
  const [hs, setHs] = useState<HSResult | null>(null)
  const [monOpts, setMonOpts] = useState<string[]>([])
  const [mon, setMon] = useState('')
  const [khoi, setKhoi] = useState('')
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (hs) return // đã chọn HS → không tìm nữa
    const t = setTimeout(() => { timHocSinhBT(q).then(setResults).catch(() => setResults([])) }, 250)
    return () => clearTimeout(t)
  }, [q, hs])

  async function chon(h: HSResult) {
    setHs(h); setResults([]); setQ(h.ho_ten)
    setKhoi(h.khoi ?? '')
    const mons = await monCuaHS(h.id)
    setMonOpts(mons)
    setMon(mons[0] ?? '')
    setTen(`BT ${h.ho_ten}`)
  }
  async function tao() {
    if (!hs || !mon || !khoi || !ten.trim()) return
    setBusy(true); setErr(null)
    try { const d = await createBT({ hocSinhId: hs.id, ten: ten.trim(), khoi, mon }); onCreated(d.id) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-[16px] font-semibold text-slate-800">Tạo BT mới</div>

        <label className="mb-1 block text-[12px] font-medium text-slate-600">Học sinh</label>
        <input value={q} onChange={(e) => { setQ(e.target.value); if (hs) setHs(null) }} placeholder="Gõ tên hoặc mã HS…" className={`${inp} w-full`} autoFocus />
        {!hs && results.length > 0 && (
          <div className="mt-1.5 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-100 p-1.5">
            {results.map((r) => (
              <button key={r.id} onClick={() => chon(r)} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-indigo-50">
                <span className="text-slate-700">{r.ho_ten}</span>
                <span className="text-[11px] text-slate-400">{r.ma_hs}{r.khoi ? ` · K${r.khoi}` : ''}{r.lop.length ? ` · ${r.lop.join(', ')}` : ''}</span>
              </button>
            ))}
          </div>
        )}

        {hs && (
          <>
            <label className="mb-1 mt-3 block text-[12px] font-medium text-slate-600">Lớp đang học</label>
            <p className="text-[13px] text-slate-600">{hs.lop.length ? hs.lop.join(', ') : <span className="italic text-slate-400">chưa có lớp</span>}</p>

            <label className="mb-1 mt-3 block text-[12px] font-medium text-slate-600">Môn</label>
            {monOpts.length ? (
              <div className="flex flex-wrap gap-1.5">
                {monOpts.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${mon === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{m}</button>)}
              </div>
            ) : <p className="text-[12px] italic text-amber-600">HS chưa ghi danh lớp nào — chưa suy được môn, không thể soi dạng cần bổ trợ.</p>}

            <label className="mb-1 mt-3 block text-[12px] font-medium text-slate-600">Khối</label>
            <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={`${inp} w-auto`}>
              <option value="">— chọn khối —</option>
              {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
            </select>

            <label className="mb-1 mt-3 block text-[12px] font-medium text-slate-600">Tên BT</label>
            <input value={ten} onChange={(e) => setTen(e.target.value)} className={`${inp} w-full`} />
          </>
        )}
        {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={tao} disabled={!hs || !mon || !khoi || !ten.trim() || busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang tạo…' : 'Tạo & soạn câu →'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════ EDITOR — mỗi DẠNG 1 khối: số lượng theo loại câu + gợi ý/chọn tay + số dòng tự luận ═══════════
export function BTEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const [bt, setBt] = useState<BT | null>(null)
  const [phans, setPhans] = useState<PhanResolved[]>([]) // loai_phan === 'dang'
  const [ch, setCh] = useState<CauHinh>({})
  const [goiY, setGoiY] = useState<DangMastery[]>([])
  const [grades, setGrades] = useState<BTGrade[]>([])
  const [ten, setTen] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [printing, setPrinting] = useState(false)
  const [dangModal, setDangModal] = useState(false)
  const [picker, setPicker] = useState<{ phanId: string; maDang: string } | null>(null)
  const cauTbl = bt ? khoCuaMon(bt.mon).cauTbl : 'dai_cau_hoi'
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  // Load ĐẦU (toggle loading, cho phép hiện "Đang tải…"). Refresh SAU mỗi thao tác dùng refreshPhans
  // (KHÔNG toggle loading) — tránh unmount/remount cả cây (Thùy 07-10: "click lại bị chớp reset trang",
  // vì loading=true trả về <div>Đang tải…</div> làm mất luôn state cục bộ của DangBlockUI, vd số lượng đang gõ).
  async function loadAll() {
    setLoading(true)
    try {
      const b = await getBT(id)
      setBt(b); setTen(b.ten)
      const full = await getTaiLieuFull(id)
      setCh(full.taiLieu.cau_hinh ?? {})
      setPhans(full.phans.filter((p) => p.loai_phan === 'dang'))
      setGoiY(b.hoc_sinh_id && b.mon ? await getMasteryHS(b.hoc_sinh_id, b.mon) : [])
      setGrades(await getBTGrades(id))
    } finally { setLoading(false) }
  }
  useEffect(() => { loadAll() }, [id]) // eslint-disable-line
  async function refreshPhans() {
    const full = await getTaiLieuFull(id)
    setPhans(full.phans.filter((p) => p.loai_phan === 'dang'))
  }
  async function chamCau(maCau: string, maDang: string, result: BTGradeResult) {
    const g = grades.find((x) => x.ma_cau === maCau)
    if (g?.result === result) await deleteBTGrade(id, maCau)
    else await gradeBTCau(id, maCau, maDang, result)
    setGrades(await getBTGrades(id))
  }

  async function saveTen() { if (bt && ten.trim() && ten.trim() !== bt.ten) { await renameBT(id, ten.trim()); markSaved() } }
  async function setLines(maCau: string, n: number) {
    const next: CauHinh = { ...ch, btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  async function setForm(maCau: string, f: ETFormKind) {
    const next: CauHinh = { ...ch, etFormByCau: { ...(ch.etFormByCau ?? {}), [maCau]: f } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  async function themDang(maDang: string) { await addDangBT(id, maDang); await refreshPhans(); markSaved() }
  async function xoaDang(phanId: string) {
    if (!confirm('Xoá cả dạng này khỏi BT (câu vẫn còn trong kho)?')) return
    await deletePhan(phanId); await refreshPhans(); markSaved()
  }
  async function applyCaus(phanId: string, maCaus: string[]) { await setCauOfPhan(phanId, maCaus); await refreshPhans(); markSaved() }
  async function xoaBT() {
    if (!confirm(`Xoá BT "${bt?.ten}" của ${bt?.hoc_sinh?.ho_ten}? Toàn bộ câu trong BT này sẽ mất (câu vẫn còn trong kho).`)) return
    await deleteBT(id); onClose()
  }
  // Câu đã dùng ở dạng KHÁC trong CÙNG BT → cấm chọn lại (auto & thủ công), giống Giáo trình usedExcept.
  const usedExcept = (phanId: string): Set<string> => new Set(phans.filter((p) => p.id !== phanId).flatMap((p) => p.caus.map((c) => c.ma_cau)))

  if (loading || !bt) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = phans.reduce((s, p) => s + p.caus.length, 0)
  const dangDaCo = new Set(phans.map((p) => p.ref_ma).filter(Boolean))
  const goiYCanChu = goiY.filter((d) => d.mastery?.muc === 'yeu' || d.mastery?.muc === 'can_luyen')

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {/* ⭐ 07-12: BT autosave từng thao tác — enqueue link ở lúc ĐÓNG (không phải mỗi lần autosave). */}
        <button onClick={() => { useStore.getState().enqueueLinkGen(id, 'bo_tro'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho BT</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className="min-w-[220px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">{bt.hoc_sinh?.ho_ten}{bt.hoc_sinh?.ma_hs ? ` · ${bt.hoc_sinh.ma_hs}` : ''} · Khối {bt.khoi} · {bt.mon}</span>
        {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        <span className="text-[12px] text-slate-400">{soCau} câu{soCau > 0 && ` · đã chấm ${grades.length}/${soCau}`}</span>
        <button onClick={() => setPrinting(true)} disabled={!soCau} className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400 disabled:opacity-40">🖨 Xem / In</button>
        <button onClick={xoaBT} title="Xoá BT" className="rounded-md border border-rose-200 px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50">🗑 Xoá</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[860px]">
          {goiYCanChu.length > 0 && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">📌 Dạng cần bổ trợ (theo đánh giá hiện có)</p>
              <div className="flex flex-wrap gap-1.5">
                {goiYCanChu.map((d) => {
                  const daCo = dangDaCo.has(d.ma_dang)
                  return (
                    <button key={d.ma_dang} onClick={() => !daCo && themDang(d.ma_dang)} disabled={daCo}
                      className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${daCo ? 'border-slate-200 bg-slate-50 text-slate-400' : MUC_CLASS[d.mastery!.muc]}`}>
                      {d.ten_dang} <span className="opacity-70">· {MUC_LABEL[d.mastery!.muc]}</span>{daCo ? ' ✓' : ' +'}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {phans.map((p, i) => (
              <DangBlockUI key={p.id} no={i + 1} p={p} ch={ch} cauTbl={cauTbl} usedExcept={usedExcept(p.id)} grades={grades}
                onApply={(maCaus) => applyCaus(p.id, maCaus)}
                onLine={setLines}
                onForm={setForm}
                onGrade={chamCau}
                onXoaDang={() => xoaDang(p.id)}
                onOpenPicker={() => setPicker({ phanId: p.id, maDang: p.ref_ma! })} />
            ))}
          </div>
          <button onClick={() => setDangModal(true)} className="mt-3 w-full rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 py-2.5 text-[14px] font-medium text-violet-700 transition hover:bg-violet-50">+ Thêm dạng</button>
        </div>
      </div>

      {dangModal && <DangPickerOne khoi={bt.khoi} mon={bt.mon} onClose={() => setDangModal(false)}
        onPick={(ma) => { setDangModal(false); themDang(ma) }} />}
      {picker && <KhoPicker maDangs={[picker.maDang]} cauTbl={cauTbl} selected={phans.find((p) => p.id === picker.phanId)?.caus.map((c) => c.ma_cau) ?? []} onClose={() => setPicker(null)}
        onConfirm={async (m) => { await applyCaus(picker.phanId, m); setPicker(null) }} />}
      {printing && <BTPrintView id={id} onClose={() => setPrinting(false)} />}
    </div>
  )
}

// 1 khối DẠNG — mirror DangCard (TaiLieuBuilder): số lượng theo loại câu + Gợi ý/Chọn câu tay + chọn
// FORM hiển thị mỗi câu (Trắc nghiệm/Trả lời ngắn/Tự luận, giống ET) → chọn Tự luận mới hiện số dòng
// (Thùy 07-10: "chưa cho chọn tự luận để thêm dòng" — trước chỉ theo loai_cau gốc trong kho, không ép được).
function DangBlockUI({ no, p, ch, cauTbl, usedExcept, grades, onApply, onLine, onForm, onGrade, onXoaDang, onOpenPicker }: {
  no: number; p: PhanResolved; ch: CauHinh; cauTbl: string; usedExcept: Set<string>; grades: BTGrade[]
  onApply: (maCaus: string[]) => void; onLine: (maCau: string, n: number) => void; onForm: (maCau: string, f: ETFormKind) => void
  onGrade: (maCau: string, maDang: string, result: BTGradeResult) => void
  onXoaDang: () => void; onOpenPicker: () => void
}) {
  const ma = p.ref_ma!
  const [cnt, setCnt] = useState<Record<string, number>>({ ...DEFAULT_LUYEN_COUNTS })
  const numIn = 'h-7 w-11 rounded border border-slate-300 px-1 text-center text-[12px]'
  async function goiY() { onApply(await autoSuggestByLoai(ma, cnt, cauTbl, usedExcept)) }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <span className="text-[14px] font-semibold text-violet-600">Dạng {no}: {p.dang?.ten_dang ?? ma}</span>
        <span className="truncate text-[11px] text-slate-400">· {p.dang?.ten_chuyen_de ?? ''}</span>
        <button onClick={onXoaDang} className="ml-auto text-[12px] text-slate-300 hover:text-rose-600">Xoá dạng</button>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          {LOAI_CAU.map((l) => (
            <label key={l.value} className="flex items-center gap-1">{l.label}
              <input type="number" min={0} value={cnt[l.value] ?? 0} onChange={(e) => setCnt((s) => ({ ...s, [l.value]: Math.max(0, +e.target.value || 0) }))} className={numIn} />
            </label>
          ))}
          <button onClick={goiY} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100">↻ Gợi ý</button>
          <button onClick={onOpenPicker} className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu</button>
        </div>
        {p.caus.length > 0 ? (
          <ol className="mt-2 space-y-1.5">
            {p.caus.map((c, i) => {
              const form = etFormOf(c, ch)
              const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c.lua_chon && c.lua_chon.length))
              return (
                <li key={c.ma_cau} className="flex flex-wrap items-center gap-2 rounded-md border border-slate-100 bg-slate-50/60 px-2.5 py-1.5">
                  <span className="text-[12px] font-bold text-slate-400">{i + 1}.</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                  <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500" title="Loại gốc trong kho">kho: {loaiLabel(c.loai_cau)}</span>
                  <div className="flex shrink-0 gap-0.5">
                    {formOpts.map((f) => (
                      <button key={f.v} onClick={() => onForm(c.ma_cau, f.v)} title="Form hiển thị khi in (khác loại kho)"
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${form === f.v ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{f.lbl}</button>
                    ))}
                  </div>
                  {form === 'tu_luan' && (
                    <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title="Số dòng kẻ để HS viết bài này">dòng
                      <input type="number" min={0} max={30} value={ch.btvnLinesByCau?.[c.ma_cau] ?? DEFAULT_BTVN_LINES} onChange={(e) => onLine(c.ma_cau, Math.max(0, Math.min(30, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                    </label>
                  )}
                  <div className="flex shrink-0 gap-1" title="Chấm bài (sau khi HS làm xong)">
                    {BT_KQ.map((k) => {
                      const g = grades.find((x) => x.ma_cau === c.ma_cau)
                      return (
                        <button key={k.v} onClick={() => onGrade(c.ma_cau, ma, k.v)}
                          className={`h-7 w-7 rounded-lg border text-[13px] font-bold transition ${g?.result === k.v ? k.sel : k.idle}`}>{k.lbl}</button>
                      )
                    })}
                  </div>
                  <button onClick={() => onApply(p.caus.filter((x) => x.ma_cau !== c.ma_cau).map((x) => x.ma_cau))} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">✕</button>
                </li>
              )
            })}
          </ol>
        ) : <div className="mt-2 text-[12px] italic text-slate-400">Chưa có câu — bấm "Gợi ý" hoặc "Chọn câu".</div>}
      </div>
    </div>
  )
}
