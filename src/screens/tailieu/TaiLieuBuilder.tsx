import { useEffect, useState } from 'react'
import {
  getTaiLieuFull, updateTaiLieu, updatePhan, setCauOfPhan,
  addBuoi, deleteBuoi, setDangOfBuoi, reorderDangInBuoi, autoSuggestByLoai, autoSuggestBtvn, trichXuatBuoi, listTrichXuat, listGiaoTrinhLop, renumberBuoiLop, tieuDeBuoiLop, khoCuaMon, setPhanKieu, setPhanHienLt, BLOCK_KIEU,
  DEFAULT_LUYEN_COUNTS, DEFAULT_BTVN_COUNTS, DEFAULT_BTVN_LINES,
  type TaiLieuFull, type PhanResolved, type CauHinh, type TrichState, type BuoiLop,
} from '../../lib/tailieu'
import { groupMap, LOAI_CAU, type CauHoi, type Tier1Node } from '../../lib/kho/api'
import { listLop, type Lop } from '../../lib/nhansu'
import { MathText, inp } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import { ngayBuoiHopLeCuaLop } from '../../lib/gami'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { KhoPicker } from '../../components/KhoPicker'
import OnTapConfirmScreen from './OnTapConfirmScreen'
import PrintView from './PrintView'
import { useStore } from '../../store/useStore'

export { KhoPicker } // re-export — ETScreen/MTScreen/BTScreen import KhoPicker từ đây (giữ nguyên, khỏi sửa 3 nơi)

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
  const [picker, setPicker] = useState<null | { phanId: string; maDangs: string[]; selected: string[]; disabled: string[] }>(null)
  const [dangPicker, setDangPicker] = useState<null | { buoiId: string; selected: string[] }>(null)
  const [trichOpen, setTrichOpen] = useState(false)
  const [previewBuoiId, setPreviewBuoiId] = useState<string | null>(null) // "👁 Xem buổi" — review nhanh 1 buổi, khác nút "Xem/Xuất PDF" (cả giáo trình)
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
  async function onSetKieu(phanId: string, kieu: string) { await setPhanKieu(phanId, kieu); await reload(); markSaved() }
  // Optimistic (không await reload() cả tài liệu — nặng, chỉ đổi 1 cờ boolean): tự sửa state tại chỗ,
  // lưu nền; sai thì lùi lại đúng ô đó (không kéo cả app về "Lỗi" vì 1 checkbox).
  function onSetHienLt(phanId: string, v: boolean) {
    setFull((f) => (f ? { ...f, phans: f.phans.map((p) => (p.id === phanId ? { ...p, hien_lt: v } : p)) } : f))
    markSaved()
    setPhanHienLt(phanId, v).catch(() => setFull((f) => (f ? { ...f, phans: f.phans.map((p) => (p.id === phanId ? { ...p, hien_lt: !v } : p)) } : f)))
  }
  // Câu đã dùng ở phần khác CÙNG BUỔI → cấm chọn lại (auto & thủ công). Khác buổi ĐƯỢC dùng lại (Thùy 07-04).
  const usedExcept = (phanId: string): Set<string> => {
    const s = new Set<string>()
    const buois = groupBuois(full?.phans ?? [])
    const b = buois.find((bu) => bu.dangs.some((d) => d.id === phanId) || Object.values(bu.btvnByMa).some((p) => p.id === phanId))
    if (!b) return s
    for (const p of [...b.dangs, ...Object.values(b.btvnByMa)]) if (p.id !== phanId) for (const c of p.caus) s.add(c.ma_cau)
    return s
  }
  const openPicker = (phanId: string, ma: string, selected: string[]) => setPicker({ phanId, maDangs: [ma], selected, disabled: [...usedExcept(phanId)] })
  const onLine = (maCau: string, n: number) => saveCh({ btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } })
  // Áp dụng 1 số dòng cho CẢ dạng (Thùy 07-16: khỏi click từng câu khi soạn số lượng lớn) — vẫn sửa
  // riêng từng câu được SAU KHI áp dụng (áp dụng cả dạng chỉ ghi đè 1 lần, không khoá per-câu).
  const onLineAll = (maCaus: string[], n: number) => {
    const next = { ...(ch.btvnLinesByCau ?? {}) }
    for (const ma of maCaus) next[ma] = n
    saveCh({ btvnLinesByCau: next })
  }

  const jump = (pid: string) => document.getElementById('p-' + pid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const sel = 'h-8 rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500'

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!full) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const buois = groupBuois(full.phans)
  const linesByCau = ch.btvnLinesByCau ?? {}
  const mon = full.taiLieu.mon                    // môn của tài liệu → chọn kho (Toán dai_ / KHTN khtn_)
  const cauTbl = khoCuaMon(mon).cauTbl

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      {/* Thanh trên */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {/* ⭐ 07-12: builder tự lưu liên tục (không nút Lưu) — điểm "xong 1 lượt sửa" DUY NHẤT là lúc
            đóng builder, nên enqueue link ở ĐÂY (không phải mỗi lần autosave — sẽ hâm nóng máy liên tục
            trong lúc đang gõ). Link PDF phải sẵn sàng khi Thùy quay lại Kho tài liệu, không cần bấm gì. */}
        <button onClick={() => { useStore.getState().enqueueLinkGen(id, 'giao_trinh'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
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
        <label className="flex items-center gap-1.5" title="Ôn tập → chọn Không để in chỉ bài (không kèm lý thuyết). Trích xuất buổi kế thừa cài này.">Lý thuyết <select value={ch.inLyThuyet === false ? 'khong' : 'co'} onChange={(e) => saveCh({ inLyThuyet: e.target.value === 'co' })} className={sel}><option value="co">Có kèm</option><option value="khong">Không (ôn tập)</option></select></label>
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
              return (
                <BuoiCard
                  key={b.marker.id} buoi={b} linesByCau={linesByCau} onLine={onLine} onLineAll={onLineAll}
                  onRename={(t) => updatePhan(b.marker.id, { tieu_de: t }).then(reload).then(markSaved)}
                  onDelete={async () => { if (confirm('Xoá cả buổi này (gồm dạng trên lớp + BTVN)?')) { await deleteBuoi(id, b.marker.id); await reload(); markSaved() } }}
                  onChonDang={() => setDangPicker({ buoiId: b.marker.id, selected: b.dangs.map((d) => d.ref_ma!).filter(Boolean) })}
                  onReorderDang={async (order) => { await reorderDangInBuoi(id, b.marker.id, order); await reload(); markSaved() }}
                  onApply={applyCaus} openPicker={openPicker} cauTbl={cauTbl} onSetKieu={onSetKieu} onSetHienLt={onSetHienLt} usedExcept={usedExcept}
                  onPreview={() => setPreviewBuoiId(b.marker.id)}
                />
              )
            })}
            <button onClick={async () => { await addBuoi(id); await reload(); markSaved() }} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm buổi</button>
          </div>
        </div>
      </div>

      {dangPicker && <DangPicker khoi={full.taiLieu.khoi} mon={mon} selected={dangPicker.selected} onClose={() => setDangPicker(null)} onConfirm={async (maDangs) => { const bid = dangPicker.buoiId; setDangPicker(null); await setDangOfBuoi(id, bid, maDangs, cauTbl); await reload(); markSaved() }} />}
      {picker && <KhoPicker {...picker} cauTbl={cauTbl} onClose={() => setPicker(null)} onConfirm={async (m) => { await applyCaus(picker.phanId, m); setPicker(null) }} />}
      {trichOpen && <TrichPanel masterId={id} khoi={full.taiLieu.khoi} buois={buois} onClose={() => setTrichOpen(false)} />}
      {printing && <PrintView id={id} onClose={() => setPrinting(false)} />}
      {previewBuoiId && <PrintView id={id} onlyBuoiId={previewBuoiId} onClose={() => setPreviewBuoiId(null)} />}
    </div>
  )
}

// ── 1 BUỔI: tiêu đề (sửa được) + nút Chọn dạng + danh sách dạng (mỗi dạng có Bài luyện + BTVN) ──
function BuoiCard({ buoi, linesByCau, onLine, onLineAll, onRename, onDelete, onChonDang, onReorderDang, onApply, openPicker, cauTbl, onSetKieu, onSetHienLt, usedExcept, onPreview }: {
  buoi: BuoiUI; linesByCau: Record<string, number>; onLine: (maCau: string, n: number) => void; onLineAll: (maCaus: string[], n: number) => void
  onRename: (t: string) => void; onDelete: () => void; onChonDang: () => void; onReorderDang: (order: string[]) => void
  onApply: (phanId: string, maCaus: string[]) => void; openPicker: (phanId: string, ma: string, selected: string[]) => void; cauTbl: string; onSetKieu: (phanId: string, kieu: string) => void; onSetHienLt: (phanId: string, v: boolean) => void
  usedExcept: (phanId: string) => Set<string>; onPreview: () => void
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
        <button onClick={onPreview} title="Xem nhanh bản in CHỈ buổi này (khỏi cuộn cả giáo trình)" className="ml-auto rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">👁 Xem buổi</button>
        <button onClick={onChonDang} className="rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">+ Chọn dạng</button>
        <button onClick={onDelete} title="Xoá buổi" className="rounded border border-slate-200 px-1.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
      </div>
      <div className="space-y-3 p-4">
        {buoi.dangs.length === 0
          ? <div className="text-[12px] italic text-slate-400">Chưa có dạng — bấm “+ Chọn dạng” để chọn các dạng cho buổi (mọi chuyên đề).</div>
          : buoi.dangs.map((d, i) => (
            <DangCard key={d.id} dang={d} btvn={d.ref_ma ? buoi.btvnByMa[d.ref_ma] : undefined}
              linesByCau={linesByCau} onLine={onLine} onLineAll={onLineAll} onApply={onApply} openPicker={openPicker} cauTbl={cauTbl} onSetKieu={onSetKieu} onSetHienLt={onSetHienLt} usedExcept={usedExcept}
              canUp={i > 0} canDown={i < buoi.dangs.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
          ))}
      </div>
    </div>
  )
}

// ── 1 DẠNG trong buổi: 2 khối cấu hình — Bài luyện (trên lớp) + BTVN (về nhà), đều theo số câu mỗi loại ──
function DangCard({ dang, btvn, linesByCau, onLine, onLineAll, onApply, openPicker, cauTbl, onSetKieu, onSetHienLt, usedExcept, canUp, canDown, onUp, onDown }: {
  dang: PhanResolved; btvn?: PhanResolved; linesByCau: Record<string, number>
  onLine: (maCau: string, n: number) => void; onLineAll: (maCaus: string[], n: number) => void; onApply: (phanId: string, maCaus: string[]) => void; openPicker: (phanId: string, ma: string, selected: string[]) => void; cauTbl: string; onSetKieu: (phanId: string, kieu: string) => void; onSetHienLt: (phanId: string, v: boolean) => void
  usedExcept: (phanId: string) => Set<string>
  canUp: boolean; canDown: boolean; onUp: () => void; onDown: () => void
}) {
  const ma = dang.ref_ma!
  const [luyenCnt, setLuyenCnt] = useState<Record<string, number>>({ ...DEFAULT_LUYEN_COUNTS })
  const [btvnCnt, setBtvnCnt] = useState<Record<string, number>>({ ...DEFAULT_BTVN_COUNTS })
  const numIn = 'h-7 w-11 rounded border border-slate-300 px-1 text-center text-[12px]'
  // Gợi ý né câu đã dùng ở buổi/dạng khác (usedExcept) — luyện né phần khác; BTVN né cả câu luyện cùng dạng (khác phan).
  async function goiYLuyen() { onApply(dang.id, await autoSuggestByLoai(ma, luyenCnt, cauTbl, usedExcept(dang.id))) }
  async function goiYBtvn() { if (btvn) onApply(btvn.id, await autoSuggestBtvn([ma], usedExcept(btvn.id), btvnCnt, cauTbl)) }

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
        {/* ⭐ 07-24 (Thùy chốt): KHÔNG đánh số dạng chạy 1,2,3… nữa — số chạy tự nhảy mỗi lần thêm/bớt/
            đổi thứ tự dạng nên "Dạng 5" hôm nay ≠ "Dạng 5" hôm qua, đối chiếu là loạn. Hiện MÃ DẠNG của
            bản đồ kiến thức — mã bất biến, trỏ thẳng về đúng KP (đơn vị chân lý HS × dạng). */}
        <span className="text-[14px] font-semibold text-pink-600">Dạng {ma}: {dang.dang?.ten_dang ?? ma}</span>
        <span className="truncate text-[11px] text-slate-400">· {dang.dang?.ten_chuyen_de ?? ''}</span>
        <label className="ml-auto flex shrink-0 items-center gap-1.5 text-[11px] text-slate-500" title="Bật/tắt hiện khối Lý thuyết của RIÊNG dạng này khi in (vd dạng ôn lại — tắt để đỡ lặp, dạng mới học — bật)">
          <input type="checkbox" checked={dang.hien_lt !== false} onChange={(e) => onSetHienLt(dang.id, e.target.checked)} />
          Lý thuyết
        </label>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${dang.lyThuyetDang?.noi_dung?.trim() ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{dang.lyThuyetDang?.noi_dung?.trim() ? 'có lý thuyết' : 'chưa có lý thuyết'}</span>
      </div>

      {/* Bài luyện (trên lớp) */}
      <div className="border-b border-slate-100 p-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="font-semibold text-sky-700">📘 Bài luyện</span>
          {counts(luyenCnt, setLuyenCnt)}
          <button onClick={goiYLuyen} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100">↻ Gợi ý</button>
          <button onClick={() => openPicker(dang.id, ma, dang.caus.map((c) => c.ma_cau))} className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu</button>
          <KieuPicker value={dang.kieu} onChange={(k) => onSetKieu(dang.id, k)} />
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
          {btvn && btvn.caus.length > 0 && <ApplyLinesAll maCaus={btvn.caus.map((c) => c.ma_cau)} onApply={(n) => onLineAll(btvn.caus.map((c) => c.ma_cau), n)} />}
          {btvn && <KieuPicker value={btvn.kieu} onChange={(k) => onSetKieu(btvn.id, k)} />}
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

// Áp số dòng cho CẢ dạng cùng lúc (Thùy 07-16) — gõ số rồi Enter/blur mới ghi (tránh ghi đè N câu mỗi
// keystroke). Ghi xong vẫn sửa riêng từng câu bình thường (áp cả dạng chỉ là 1 lần ghi đè, không khoá).
function ApplyLinesAll({ maCaus, onApply }: { maCaus: string[]; onApply: (n: number) => void }) {
  const [val, setVal] = useState('')
  const commit = () => { if (val.trim() === '') return; onApply(Math.max(0, Math.min(30, +val || 0))); setVal('') }
  return (
    <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title={`Áp số dòng này cho cả ${maCaus.length} câu BTVN của dạng — vẫn sửa riêng từng câu được sau đó`}>
      dòng cả dạng
      <input type="number" min={0} max={30} value={val} placeholder="—"
        onChange={(e) => setVal(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && commit()}
        className="h-7 w-12 rounded border border-violet-300 px-1 text-center text-[12px]" />
    </label>
  )
}

// Kiểu hiển thị block (Thường/2/3/4 cột) — câu ngắn xếp nhiều cột cho gọn/tiết kiệm giấy khi in.
function KieuPicker({ value, onChange }: { value?: string; onChange: (k: string) => void }) {
  return (
    <span className="ml-auto flex items-center gap-1" title="Kiểu hiển thị block khi in (câu ngắn → nhiều cột)">
      <span className="text-[11px] text-slate-400">Kiểu</span>
      <span className="flex gap-0.5 rounded-md bg-slate-100 p-0.5">
        {BLOCK_KIEU.map((k) => (
          <button key={k.v} onClick={() => onChange(k.v)}
            className={`rounded px-1.5 py-0.5 text-[11px] font-medium transition ${(value ?? 'thuong') === k.v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{k.lbl}</button>
        ))}
      </span>
    </span>
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
export function DangPicker({ khoi, mon, selected, onClose, onConfirm }: { khoi: string; mon?: string; selected: string[]; onClose: () => void; onConfirm: (maDangs: string[]) => void }) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [loading, setLoading] = useState(true)
  useEffect(() => { khoCuaMon(mon).listMap(khoi).then((r) => { setTree(groupMap(r)); setLoading(false) }).catch(() => setLoading(false)) }, [khoi, mon])
  const toggle = (ma: string) => setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })
  const toggleCd = (mas: string[], on: boolean) => setSel((s) => { const n = new Set(s); mas.forEach((m) => on ? n.add(m) : n.delete(m)); return n })
  // ⭐ 07-24 (Thùy chốt): trả về ĐÚNG THỨ TỰ CHỌN — chọn trước ra trước. `sel` là Set, JS Set giữ thứ tự
  // CHÈN nên [...sel] chính là thứ tự bấm (dạng đã có sẵn nạp vào theo thứ tự hiện tại của buổi → không
  // bị xáo khi mở lại picker; bỏ chọn rồi chọn lại = đưa xuống cuối, đúng ý "chọn sau thì ở sau").
  // TRƯỚC: sắp theo thứ tự BẢN ĐỒ (dạng cùng chuyên đề liền nhau) — máy tự quyết, người soạn không nắn được.
  function confirm() {
    const all = new Set(tree.flatMap((t1) => t1.tier2s.flatMap((t2) => t2.leaves.map((l) => l.leafMa))))
    onConfirm([...sel].filter((m) => all.has(m))) // lọc mã lạ (dạng đã xoá khỏi bản đồ) nhưng GIỮ thứ tự chọn
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
  return (
    <div>
      <div className="mb-2 truncate px-1 text-[13px] font-bold text-slate-700">📄 {ten || 'Giáo trình'}</div>
      {buois.length === 0 && <div className="px-2 py-3 text-[12px] italic text-slate-400">Chưa có buổi.</div>}
      {buois.map((b) => (
        <div key={b.marker.id} className="mb-1">
          <button onClick={() => onJump(b.marker.id)} className={`${item} font-semibold text-indigo-700`}>🗓️ {b.marker.tieu_de}</button>
          <div className="ml-2 border-l border-slate-100 pl-1">
            {b.dangs.map((d) => <button key={d.id} onClick={() => onJump(d.id)} title={`Mã dạng ${d.ref_ma}`} className={`${item} text-slate-600`}>Dạng {d.ref_ma}: {d.dang?.ten_dang ?? d.ref_ma} <span className="text-slate-300">({d.caus.length})</span></button>)}
            {b.dangs.length > 0 && <div className="px-2 py-1 text-[12px] text-orange-500">📝 BTVN ({Object.values(b.btvnByMa).reduce((s, p) => s + p.caus.length, 0)} câu)</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

// TRÍCH XUẤT cấp GIÁO TRÌNH: chọn LỚP → hiện 10 buổi + TRẠNG THÁI đã gán (ngày nào) cho lớp đó → gán buổi chưa gán.
function TrichPanel({ masterId, khoi, buois, onClose }: { masterId: string; khoi: string; buois: BuoiUI[]; onClose: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [state, setState] = useState<Record<string, TrichState>>({})
  const [boLop, setBoLop] = useState<BuoiLop[]>([])   // BỘ GIÁO TRÌNH RIÊNG CỦA LỚP (số buổi của lớp)
  const [tkbDates, setTkbDates] = useState<string[]>([])  // ngày CÓ trong TKB của lớp (tăng dần) — để suy ngày gán mặc định
  const [loading, setLoading] = useState(false)
  useEffect(() => { listLop().then(setLops).catch(() => { }) }, [])
  const lop = lops.find((l) => l.id === lopId)
  async function loadState(id: string) {
    setLoading(true)
    const today = homNayVN()
    try {
      const [st, bo, tkb] = await Promise.all([
        listTrichXuat(masterId, id), listGiaoTrinhLop(id),
        ngayBuoiHopLeCuaLop(id, congNgay(today, -60), congNgay(today, 90)).catch(() => [] as { ngay: string }[]),
      ])
      setState(st); setBoLop(bo); setTkbDates(tkb.map((o) => o.ngay))
    }
    finally { setLoading(false) }
  }
  useEffect(() => { if (lopId) loadState(lopId); else { setState({}); setBoLop([]) } }, [lopId]) // eslint-disable-line

  // Gán = CHỈ tạo GT (Thùy 07-22: BTVN hoãn sang OnTapConfirmScreen — tự nó lo saveOnTapConfig +
  // trichXuatBuoi(btvn:true) + appendOnTapToBtvnDoc lúc bấm Xác nhận, xem BuoiTrichRow).
  async function gan(buoiId: string, tenBuoi: string, ngay: string, gt: boolean) {
    if (!lop) return
    const created = await trichXuatBuoi(masterId, buoiId, { lopId: lop.id, ngay, khoi, tenLop: lop.ten_lop, tenBuoi, giaoTrinh: gt, btvn: false })
    // ⭐ 07-12: doc VẬN HÀNH (giao_trinh_buoi) trích xong là ĐỦ NỘI DUNG ngay — enqueue link luôn.
    created.forEach((d) => useStore.getState().enqueueLinkGen(d.id, d.loai))
    // ⭐ 07-24: gán vào GIỮA lịch làm các buổi sau của lớp dồn số → đánh số lại cả lớp, doc nào đổi
    // tiêu đề buổi (in ra giấy) thì làm mới link PDF. Dùng Map để không enqueue trùng doc vừa tạo.
    const doi = new Map((await renumberBuoiLop(lop.id)).map((d) => [d.id, d]))
    created.forEach((d) => doi.delete(d.id))
    doi.forEach((d) => useStore.getState().enqueueLinkGen(d.id, d.loai))
    await loadState(lop.id)
  }

  // Đánh số lại TAY — cho bộ giáo trình lớp đã gán TỪ TRƯỚC (còn mang số buổi của master). Gán/xoá buổi
  // mới thì tự chạy rồi, nút này chỉ để dọn dữ liệu cũ mà không cần gán thêm gì.
  async function danhSoLai() {
    if (!lop) return
    if (!confirm(`Đánh số lại ${boLop.length} buổi của lớp ${lop.ten_lop} theo thứ tự NGÀY HỌC?\n\nTên file + tiêu đề buổi in trên phiếu sẽ mang số của LỚP (buổi 1, 2, 3…) thay cho số buổi của giáo trình gốc. Nội dung câu hỏi KHÔNG đổi.`)) return
    setLoading(true)
    try {
      for (const d of await renumberBuoiLop(lop.id)) useStore.getState().enqueueLinkGen(d.id, d.loai)
    } finally { setLoading(false) }
    await loadState(lop.id)
  }

  // Buổi gốc (master) ↔ buổi của lớp: doc lớp giữ nguon_buoi = id mốc buổi bên master.
  const soBuoiMaster = new Map(buois.map((b, i) => [b.marker.id, i + 1]))
  const sttLopCua = (markerId: string) => boLop.find((b) => b.nguon_buoi === markerId)?.stt

  // ⭐ Ngày gán MẶC ĐỊNH = buổi TKB gần nhất CHƯA gán (Thùy: BTVN luôn làm vào ngày học/gần đó → khỏi
  // bới cả list, tránh bấm nhầm sang tháng khác như 8A1 Buổi 7 gán nhầm CN 23/08 thay vì T5 23/07).
  // Lấp tuần tự theo thứ tự buổi master: buổi chưa-gán thứ k → ngày trống thứ k (tăng dần). "Đã gán" tính
  // theo BỘ GIÁO TRÌNH LỚP (mọi giáo trình, không riêng master này) để không cấp trùng ngày đã có buổi.
  const daGan = new Set(boLop.map((b) => b.ngay))
  const ngayTrong = tkbDates.filter((d) => !daGan.has(d))
  const defNgayByMarker = new Map<string, string>()
  let kTrong = 0
  for (const b of buois) {
    if (state[b.marker.id]?.ngay) continue        // buổi này đã gán → không cần ngày mặc định
    if (kTrong < ngayTrong.length) defNgayByMarker.set(b.marker.id, ngayTrong[kTrong++])
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Gán giáo trình cho lớp</h3>
          <div className="w-56"><SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
            options={lops.filter((l) => !khoi || l.khoi === khoi).map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {!lop ? <p className="p-8 text-center text-sm text-slate-400">Chọn lớp để xem bộ giáo trình riêng của lớp + gán tiếp buổi mới.</p>
          : loading ? <p className="p-8 text-sm text-slate-400">Đang tải trạng thái…</p>
          : (
            <div className="grid min-h-0 flex-1 grid-cols-[1fr_340px] grid-rows-[minmax(0,1fr)] overflow-hidden">
              <div className="min-h-0 overflow-auto p-5">
                <p className="mb-2 text-[12px] text-slate-400">Mỗi buổi của giáo trình gốc → gán cho 1 ngày của lớp <b>{lop.ten_lop}</b>. Lớp học buổi nào là <b>tự chọn</b> — không cần gán đủ, không cần đúng thứ tự. BTVN (kèm ôn tập) làm ở bước riêng sau khi gán, có xem trước.</p>
                <div className="space-y-2">
                  {buois.map((b, i) => <BuoiTrichRow key={b.marker.id} no={i + 1} sttLop={sttLopCua(b.marker.id)} lopId={lopId} tenLop={lop.ten_lop} masterId={masterId} khoi={khoi} mon={lop.mon} buoi={b} st={state[b.marker.id]} defaultNgay={defNgayByMarker.get(b.marker.id)}
                    onGan={(ngay, gt) => gan(b.marker.id, b.marker.tieu_de || `Buổi ${i + 1}`, ngay, gt)}
                    onBtvnConfirmed={() => loadState(lop.id)} />)}
                </div>
              </div>
              <BoGiaoTrinhLop tenLop={lop.ten_lop} bo={boLop} soBuoiMaster={soBuoiMaster} onDanhSoLai={danhSoLai} />
            </div>
          )}
      </div>
    </div>
  )
}

// ── BỘ GIÁO TRÌNH RIÊNG CỦA LỚP ────────────────────────────────────────────────────────────────
// Các buổi lớp đã được gán, đánh số THEO LỚP (1,2,3… theo ngày học) — buổi thứ 7 của lớp có thể là
// buổi 10 của giáo trình gốc, nhưng với lớp nó là "Buổi 7". Cột "gốc" chỉ để đối chiếu khi soạn.
function BoGiaoTrinhLop({ tenLop, bo, soBuoiMaster, onDanhSoLai }: { tenLop: string; bo: BuoiLop[]; soBuoiMaster: Map<string, number>; onDanhSoLai: () => void }) {
  return (
    <aside className="min-h-0 overflow-auto border-l border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[13px] font-bold text-slate-800">📚 Giáo trình riêng của {tenLop}</span>
        {bo.length > 0 && <button onClick={onDanhSoLai} title="Đánh số lại các buổi đã gán theo thứ tự ngày học của lớp (dùng cho buổi gán từ trước, còn mang số của giáo trình gốc)" className="ml-auto shrink-0 rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600">↻ Đánh số lại</button>}
      </div>
      <p className="mb-3 text-[11px] text-slate-400">Số buổi ở đây là số <b>của lớp</b> (theo ngày học), không phải số buổi của giáo trình gốc.</p>
      {bo.length === 0
        ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Lớp chưa được gán buổi nào.</div>
        : (
          <ol className="space-y-1.5">
            {bo.map((b) => {
              const goc = b.nguon_buoi ? soBuoiMaster.get(b.nguon_buoi) : undefined
              return (
                <li key={b.ngay} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">{b.stt}</span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-slate-800" title={b.tieu_de}>{b.tieu_de}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{b.ngay.split('-').reverse().join('/')}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 pl-8">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${b.gt ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>GT</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${b.btvn ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>BTVN</span>
                    <span className="ml-auto text-[10px] text-slate-400">{goc ? `từ buổi ${goc} của giáo trình gốc` : 'nguồn khác'}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
    </aside>
  )
}

// ⭐ 07-22 (Thùy nắn UX): gán buổi CHỈ tạo GT — BTVN hoãn sang màn "Ôn tập + Preview" riêng (OnTapConfirmScreen),
// người dùng soi trước rồi mới bấm Xác nhận mới CHÍNH THỨC tạo BTVN vào Kho. Không còn checkbox BTVN /
// OnTapEditor nhúng ở đây nữa — trạng thái "đã có GT, chưa có BTVN" tự nhiên derive từ `st` (listTrichXuat),
// không cần nhớ "có định làm BTVN không" ở đâu cả — bấm "+ BTVN / Ôn tập" lúc nào cũng được, kể cả về sau.
function BuoiTrichRow({ no, sttLop, lopId, tenLop, masterId, khoi, mon, buoi, st, defaultNgay, onGan, onBtvnConfirmed }: {
  no: number; sttLop?: number; lopId: string | null; tenLop: string; masterId: string; khoi: string; mon: string; buoi: BuoiUI; st?: TrichState; defaultNgay?: string
  onGan: (ngay: string, gt: boolean) => Promise<void>
  onBtvnConfirmed: () => void
}) {
  // Mặc định = buổi TKB gần nhất chưa gán (panel tính, truyền xuống). CHƯA chọn tay thì bám theo default;
  // đã chọn tay (touched) thì giữ lựa chọn người dùng, không bị default đè khi panel reload.
  const [ngay, setNgay] = useState(defaultNgay ?? '')
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [doiNgay, setDoiNgay] = useState(false)   // mở dropdown chọn ngày khác (hiếm — bù/nhảy buổi)
  const [onTapOpen, setOnTapOpen] = useState(false)
  useEffect(() => { if (!touched) setNgay(defaultNgay ?? '') }, [defaultNgay, touched])
  const pickNgay = (v: string) => { setTouched(true); setNgay(v) }
  const ganNgay = st?.ngay ? st.ngay.split('-').reverse().join('/') : null
  // Tên hiển thị khi đã gán = tên THEO SỐ CỦA LỚP (đúng cái in ra phiếu), không phải số buổi của master.
  const tenBuoi = sttLop ? tieuDeBuoiLop(buoi.marker.tieu_de, sttLop) : (buoi.marker.tieu_de || `Buổi ${no}`)
  async function go() {
    if (!ngay) return
    setBusy(true)
    try { await onGan(ngay, true) } finally { setBusy(false) }
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="w-6 shrink-0 text-center text-[13px] font-bold text-indigo-600">{no}</span>
        <div className="min-w-[120px] flex-1">
          <div className="text-[13px] font-semibold text-slate-800">{buoi.marker.tieu_de || `Buổi ${no}`}</div>
          <div className="text-[11px] text-slate-400">{buoi.dangs.length} dạng</div>
        </div>
        {ganNgay ? (
          <div className="flex flex-wrap items-center gap-2">
            {/* Số của LỚP — buổi này là buổi thứ mấy trong lịch học của lớp (khác số buổi bên trái = số của giáo trình gốc). */}
            {sttLop && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[12px] font-semibold text-indigo-700" title={`Với lớp ${tenLop}, đây là buổi thứ ${sttLop}`}>→ Buổi {sttLop} của lớp</span>}
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">✓ Đã gán · {ganNgay}</span>
            <span className="text-[11px] text-slate-400">{st?.hasGT ? 'GT' : ''}{st?.hasGT && st?.hasBTVN ? ' + ' : ''}{st?.hasBTVN ? 'BTVN' : ''}</span>
            {st?.hasGT && !st?.hasBTVN && (
              <button onClick={() => setOnTapOpen(true)} className="rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-violet-500">+ BTVN / Ôn tập</button>
            )}
            <button onClick={go} disabled={busy || !ngay} title="Gán lại sang ngày khác (tạo bản mới)" className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-indigo-300">Gán lại</button>
            <BuoiNgaySelect lopId={lopId} value={ngay} onChange={pickNgay} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />
          </div>
        ) : (
          // Un-gán: KHÔNG bày cả list ngày. Hiện thẳng ngày mặc định = buổi gần nhất chưa gán (BTVN làm
          // vào/ gần ngày học). Cần nhảy buổi (bù/ lệch thứ tự) mới bấm "đổi ngày" mở dropdown.
          <div className="flex flex-wrap items-center gap-2">
            {ngay ? (
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700" title="Buổi TKB gần nhất chưa gán — bấm “đổi ngày” nếu muốn ngày khác">
                Gán vào <b>{thuCuaNgay(ngay)} · {ddmmVN(ngay)}</b>
              </span>
            ) : (
              <span className="text-[12px] text-slate-400">{doiNgay ? 'Chọn ngày…' : 'Lớp chưa có buổi trống trong lịch'}</span>
            )}
            <button onClick={() => setDoiNgay((v) => !v)} className="text-[11px] text-slate-400 underline decoration-dotted underline-offset-2 hover:text-indigo-600">đổi ngày</button>
            {doiNgay && <BuoiNgaySelect lopId={lopId} value={ngay} onChange={pickNgay} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />}
            <button onClick={go} disabled={busy || !ngay} className="rounded-md bg-violet-600 px-3 py-1 text-[12px] font-medium text-white hover:bg-violet-500 disabled:opacity-40">{busy ? '…' : 'Gán'}</button>
          </div>
        )}
      </div>
      {onTapOpen && lopId && st?.ngay && (
        <OnTapConfirmScreen
          masterId={masterId} buoiId={buoi.marker.id} tenBuoi={tenBuoi} lopId={lopId} tenLop={tenLop} ngay={st.ngay} khoi={khoi} mon={mon}
          regularBtvn={Object.values(buoi.btvnByMa)}
          onClose={() => setOnTapOpen(false)}
          onConfirmed={() => { setOnTapOpen(false); onBtvnConfirmed() }}
        />
      )}
    </div>
  )
}
