// Màn "ET" = CHÍNH LÀ form tạo ET (không list, không popup gate). Vào là thấy luôn:
//   - gán LỚP + NGÀY (buổi) ở đầu · cấu trúc câu (mặc định 5 hàng) ở dưới.
//   - mỗi hàng: chọn DẠNG → hệ gợi ý câu ít-dùng-nhất (đổi được) → câu không trùng trong đề.
// Bấm "Lưu ET" → lưu vào KHO TÀI LIỆU → form reset về tạo ET mới. Sửa ET cũ = từ Kho tài liệu (mở ETEditor edit).
// ET nối buổi qua (lớp+ngày); tab Chấm ET (buổi học) tự load câu qua getETByBuoi.
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createET, updateET, getTaiLieuFull, setETCaus, suggestCauForDang, khoCuaMon,
  maET, ET_FORMS, etFormOf, sortETCaus, etGroupOf, BLOCK_KIEU, type ETDoc, type CauHinh, type ETForm as ETFormKind, type TaiLieuFull,
} from '../../lib/tailieu'
import { buildMaDe as buildMaDeLib, oTrongMaDe, usedMoiDe as usedMoiDeLib, setVarInCh } from '../../lib/made'
import { listLop, type Lop } from '../../lib/nhansu'
import { hsCoMatCuaBuoi } from '../../lib/gami'
import { listCauByDang, LOAI_CAU, type CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import ETPrintView from './ETPrintView'
import SearchSelect from '../../components/SearchSelect'
import DangPickerOne from '../../components/DangPickerOne'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import { useStore } from '../../store/useStore'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const DEFAULT_ROWS = 5
export type ETView = ETDoc & { ten_lop: string }
type Row = { maDang: string | null; maCau: string | null }
const blankRows = () => Array.from({ length: DEFAULT_ROWS }, () => ({ maDang: null, maCau: null } as Row))

// Leaf "ET" = form tạo mới (reset sau khi lưu).
export default function ETScreen() {
  return <ETEditor />
}

// et === undefined → tạo mới (lưu xong reset form). et !== undefined → sửa (lưu xong gọi onClose).
export function ETEditor({ et, onClose }: { et?: ETView; onClose?: () => void }) {
  const editing = !!et
  // Nháp ET tạo-mới đã lưu ở store (Thùy 07-31: rời màn rồi quay lại KHÔNG reset). Chỉ khôi phục khi TẠO MỚI.
  const draft0 = et ? null : useStore.getState().etDraft
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(et?.lop_id ?? draft0?.lopId ?? null)
  const [ngay, setNgay] = useState<string>(et?.ngay ?? draft0?.ngay ?? '')
  const [rows, setRows] = useState<Row[]>(() => (draft0?.rows as Row[] | undefined) ?? blankRows())
  const [cau, setCau] = useState<Record<string, CauHoi>>(() => (draft0?.cau as Record<string, CauHoi>) ?? {}) // cache để preview
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string }[]>([])
  const [ch, setCh] = useState<CauHinh>(() => (draft0?.ch as CauHinh) ?? {})
  const [picker, setPicker] = useState<{ idx: number; maDang: string } | null>(null)
  const [varPicker, setVarPicker] = useState<{ baseMaCau: string; v: number; maDang: string; form: ETFormKind } | null>(null)
  const [dangModal, setDangModal] = useState<number | null>(null)
  const [printing, setPrinting] = useState(false)
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [classPrint, setClassPrint] = useState<{ id: string; ho_ten: string; maDe: number }[] | null>(null)
  const [savedId, setSavedId] = useState<string | null>(et?.id ?? draft0?.savedId ?? null)  // id doc đã lưu (create xong → update, không đẻ trùng)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const lop = lops.find((l) => l.id === lopId)
  const khoi = lop?.khoi ?? et?.khoi ?? ''
  const mon = lop?.mon ?? et?.mon ?? 'Toán'      // ET theo môn của lớp → chọn kho
  const cauTbl = khoCuaMon(mon).cauTbl
  const tenDang = (md: string | null) => dangOpts.find((d) => d.ma_dang === md)?.ten_dang ?? md ?? ''

  async function loadBase() {
    setLoading(true)
    try {
      setLops(await listLop())
      if (et) {
        const full = await getTaiLieuFull(et.id)
        const caus = full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
        setCau(Object.fromEntries(caus.map((c) => [c.ma_cau, c])))
        setCh(full.taiLieu.cau_hinh ?? {})
        const r: Row[] = caus.map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau }))
        while (r.length < DEFAULT_ROWS) r.push({ maDang: null, maCau: null })
        setRows(r)
      }
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { loadBase() }, []) // eslint-disable-line
  // Giữ NHÁP ET tạo-mới vào store mỗi khi state đổi → rời màn rồi quay lại KHÔNG mất. Form rỗng → xoá nháp.
  useEffect(() => {
    if (et) return
    const empty = !lopId && !ngay && rows.every((r) => !r.maCau)
    useStore.getState().setEtDraft(empty ? null : { lopId, ngay, savedId, rows, cau, ch })
  }, [et, lopId, ngay, savedId, rows, cau, ch])
  // Người dùng ĐỔI LỚP → câu/mã đề/ngày cũ thuộc kho (khối/môn) khác → RESET. Không reset lúc mount/khôi phục
  // nháp (lopRef khởi tạo bằng lopId ban đầu) hay lần chọn lớp ĐẦU TIÊN (prev = null, chưa có câu ý nghĩa).
  const lopRef = useRef(lopId)
  useEffect(() => {
    if (lopRef.current === lopId) return
    const prev = lopRef.current
    lopRef.current = lopId
    if (prev == null) return
    setRows(blankRows()); setCau({}); setCh({}); setNgay(''); setRoster([]); setClassPrint(null)
    if (!et) setSavedId(null)   // tạo mới + đổi lớp → doc mới, KHÔNG update đè doc lớp cũ (sửa từ Kho thì giữ id)
  }, [lopId])
  // dạng theo khối (đổi khi chọn lớp khác khối)
  useEffect(() => {
    if (!khoi) { setDangOpts([]); return }
    khoCuaMon(mon).listMap(khoi).then((ds) => setDangOpts(ds.map((d) => ({ ma_dang: d.leafMa, ten_dang: d.leafTen, ten_chuyen_de: d.t2Ten })))).catch(() => { /* */ })
  }, [khoi, mon])
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 2500); return () => clearTimeout(t) }, [flash])

  const usedExcept = (idx: number) => new Set(rows.filter((_, i) => i !== idx).map((r) => r.maCau).filter(Boolean) as string[])
  async function ensureCache(maDang: string) {
    if (Object.values(cau).some((c) => c.dang_chinh === maDang)) return
    const list = await listCauByDang(maDang, cauTbl)
    setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) }))
  }
  async function pickDang(idx: number, maDang: string) {
    await ensureCache(maDang)
    const sug = await suggestCauForDang(maDang, usedExcept(idx), cauTbl)
    if (sug && !cau[sug]) { const list = await listCauByDang(maDang, cauTbl); setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) })) }
    setRows((rs) => rs.map((r, i) => (i === idx ? { maDang, maCau: sug } : r)))
  }
  async function doiCau(idx: number) {
    const r = rows[idx]; if (!r.maDang) return
    const sug = await suggestCauForDang(r.maDang, new Set([...usedExcept(idx), r.maCau].filter(Boolean) as string[]), cauTbl)
    if (!sug) { alert('Hết câu khác cho dạng này (đã dùng hết trong đề).'); return }
    setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, maCau: sug } : x)))
  }
  const themCau = () => setRows((rs) => [...rs, { maDang: null, maCau: null }])
  const xoaRow = (idx: number) => setRows((rs) => rs.filter((_, i) => i !== idx))
  const setLines = (maCau: string, n: number) => setCh((c) => ({ ...c, btvnLinesByCau: { ...(c.btvnLinesByCau ?? {}), [maCau]: n } }))
  const setForm = (maCau: string, f: ETFormKind) => setCh((c) => ({ ...c, etFormByCau: { ...(c.etFormByCau ?? {}), [maCau]: f } }))
  // ── CHẾ ĐỘ CỘT khi in (Thùy) — theo NHÓM FORM (giống 'kiểu' của phan giáo trình, nhưng ET 1 phan nên
  // khoá theo nhóm). Lưu ở cau_hinh.etColByGroup; áp cho cả 3 mã đề (chVar spread ch). ──
  const setColGroup = (g: number, kieu: string) => setCh((c) => ({ ...c, etColByGroup: { ...(c.etColByGroup ?? {}), [g]: kieu } }))
  const GROUP_LBL = ['Trắc nghiệm', 'Trả lời ngắn', 'Tự luận']
  const groupsPresent = useMemo(() => {
    const s = new Set<number>()
    for (const r of rows) { const c = r.maCau ? cau[r.maCau] : null; if (c) s.add(etGroupOf(c, ch)) }
    return [...s].sort((a, b) => a - b)
  }, [rows, cau, ch])

  // ── 3 MÃ ĐỀ (Thùy 07-31) — đề GỐC = rows; đề 2/3 sinh tự động: mỗi câu gốc → câu KHÁC cùng dạng+form.
  // Logic PURE tách sang lib/made.ts (DÙNG CHUNG với MT). Wrapper mỏng dưới đây bơm cauTbl + cache `cau`. ──
  const buildMaDe = (base: { maDang: string; maCau: string }[], baseCh: CauHinh) => buildMaDeLib(base, baseCh, cauTbl, cau)
  const baseRows = () => rows.filter((r) => r.maCau && r.maDang).map((r) => ({ maDang: r.maDang!, maCau: r.maCau! }))
  async function sinhMaDe() {
    const base = baseRows()
    if (!base.length) return
    const { ch: chNew, caus } = await buildMaDe(base, ch)
    setCau((p) => { const n = { ...p }; for (const c of caus) n[c.ma_cau] = c; return n })
    setCh(chNew)
  }
  // Gán tay 1 ô mã đề (đề 2/3) khi TRỐNG hoặc muốn đổi — ép cùng form với câu gốc (setVarInCh lib/made).
  const setVar = (baseMaCau: string, v: number, maCau: string, form: ETFormKind) => setCh((c) => setVarInCh(c, baseMaCau, v, maCau, form))
  // Câu đã dùng ở BẤT KỲ đề nào (gốc + 2/3) — cấm chọn lại để 3 đề không đụng câu nhau (lib/made).
  const usedMoiDe = (): Set<string> => usedMoiDeLib(baseRows(), ch)
  // Danh sách ô TRỐNG (đề 2/3 chưa có câu) theo câu gốc đang có — dùng để chặn lưu + cảnh báo (lib/made).
  const oTrong = (chk: CauHinh = ch): { maCau: string; v: number }[] => oTrongMaDe(baseRows(), chk)

  function resetForm() { setLopId(null); setNgay(''); setRows(blankRows()); setCau({}); setCh({}) }

  // ── GÁN MÃ ĐỀ THEO HS (Thùy 07-31) — LÀM NGAY trong màn tạo ET (không cần lưu-rồi-mở-lại). Bảng = HS CÓ
  // MẶT của buổi (điểm danh co_mat). Gán 1/2/3 mỗi HS → preview/in phiếu tên sẵn, tránh HS cạnh nhau trùng đề. ──
  useEffect(() => {
    if (!lopId || !ngay) { setRoster([]); return }
    let alive = true
    hsCoMatCuaBuoi(lopId, ngay).then((r) => { if (alive) setRoster(r) }).catch(() => { if (alive) setRoster([]) })
    return () => { alive = false }
  }, [lopId, ngay])
  const deReady = !!ch.etMaDe && baseRows().length > 0 && oTrong().length === 0   // đủ 3 mã đề, không ô trống
  const setHsMa = (hsId: string, maDe: number) => setCh((c) => ({ ...c, hsMaDe: { ...(c.hsMaDe ?? {}), [hsId]: maDe } }))
  const raiTuDong = () => setCh((c) => { const m = { ...(c.hsMaDe ?? {}) }; roster.forEach((hs, i) => { m[hs.id] = (i % 3) + 1 }); return { ...c, hsMaDe: m } })
  // In theo HS = TỰ LƯU (giữ hsMaDe cho học bù) rồi mở preview. HS chưa gán → mặc định mã 1.
  async function inTheoHS(list: typeof roster) {
    const id = await persistET()
    if (!id) return   // lưu lỗi / mã đề còn trống → đã báo, không in
    setClassPrint(list.map((hs) => ({ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 })))
  }
  // TaiLieuFull DỰNG TỪ STATE để ETPrintView render preview không cần đọc DB (chưa lưu vẫn xem được).
  const previewFull = useMemo<TaiLieuFull>(() => {
    const chon = rows.filter((r) => r.maCau && cau[r.maCau!])
    const baseCaus = sortETCaus(chon.map((r) => cau[r.maCau!]), ch)
    const ten = lop && ngay ? `ET ${lop.ten_lop} · ${ngay.split('-').reverse().join('/')}` : (et?.ten ?? 'ET')
    return {
      taiLieu: { ...(et ?? {}), id: et?.id ?? 'preview', ten, loai: 'et', mon, khoi, lop_id: lopId, ngay, cau_hinh: ch } as any,
      phans: [{ id: 'custom', tai_lieu_id: 'preview', thu_tu: 0, loai_phan: 'custom', ref_ma: null, tieu_de: 'ET', noi_dung: null, hien_lt: false, caus: baseCaus } as any],
    } as TaiLieuFull
  }, [rows, cau, ch, lop, ngay, mon, khoi, lopId, et])

  // persistET = LƯU (create/update) không đóng/không reset → trả id đã lưu, null nếu chặn/lỗi. Dùng chung cho
  // nút Lưu ET và In cả lớp/🖨 (Thùy 07-31: bấm in cả lớp phải TỰ LƯU, khỏi lưu-riêng rồi mới in được).
  async function persistET(): Promise<string | null> {
    if (!lop) { setErr('Chọn lớp.'); return null }
    if (!ngay) { setErr('Chọn ngày buổi học.'); return null }
    const chon = rows.filter((r) => r.maCau) as { maDang: string | null; maCau: string }[]
    if (!chon.length) { setErr('ET cần ít nhất 1 câu.'); return null }
    setBusy(true); setErr(null)
    try {
      // ⭐ 07-20: GOM THEO NHÓM IN NGAY LÚC LƯU → `thu_tu` trong DB = đúng thứ tự sẽ in ra giấy.
      // Mọi nơi đọc ET (đề in, bảng phiếu chấm, Chấm ET, ET online) đều theo `thu_tu` → khớp nhau.
      // Cache `cau` CÓ THỂ THIẾU câu: ensureCache early-return khi dạng đó đã có câu khác trong cache
      // (mở ET cũ để sửa rồi ✎ Chọn câu khác cùng dạng). Thiếu cache = không biết nhóm → phải nạp bù,
      // TUYỆT ĐỐI không được lặng lẽ bỏ câu đó ra khỏi đề.
      let bank = cau
      const thieu = chon.filter((r) => !bank[r.maCau])
      if (thieu.length) {
        const them: Record<string, CauHoi> = {}
        for (const md of new Set(thieu.map((r) => r.maDang).filter(Boolean) as string[])) {
          for (const c of await listCauByDang(md, cauTbl)) them[c.ma_cau] = c
        }
        bank = { ...bank, ...them }
        setCau(bank)
      }
      const conThieu = chon.filter((r) => !bank[r.maCau]).map((r) => r.maCau)
      if (conThieu.length) { setErr(`Không nạp được nội dung câu: ${conThieu.join(', ')} — chưa lưu. Thử lại.`); return null }
      // ── 3 MÃ ĐỀ: đề 2/3 phải phủ ĐÚNG bộ câu gốc hiện tại. Đổi câu gốc → sinh lại; còn TRỐNG → CHẶN lưu.
      const baseList = chon.map((r) => ({ maDang: r.maDang ?? bank[r.maCau]?.dang_chinh ?? '', maCau: r.maCau }))
      const baseSet = baseList.map((r) => r.maCau)
      const curDe = ch.etMaDe ?? {}
      const stale = baseSet.some((m) => !curDe[m]) || Object.keys(curDe).some((k) => !baseSet.includes(k))
      let chSave = ch
      if (stale) {
        const built = await buildMaDe(baseList, ch)
        chSave = built.ch; setCh(chSave)
        setCau((p) => { const n = { ...p }; for (const c of built.caus) n[c.ma_cau] = c; return n })
      }
      const soTrong = baseSet.filter((m) => { const a = chSave.etMaDe?.[m]; return !a || !a[0] || !a[1] }).length
      if (soTrong) { setErr(`Mã đề 2/3 còn ${soTrong} ô TRỐNG (không đủ câu cùng dạng + cùng form) — bấm ✎ ở đề 2/đề 3 để chọn tay rồi lưu lại. Chưa lưu.`); return null }
      const maCaus = sortETCaus(chon.map((r) => bank[r.maCau]), chSave).map((c) => c.ma_cau)
      const ten = `ET ${lop.ten_lop} · ${ngay.split('-').reverse().join('/')}`
      const id = savedId ?? et?.id ?? null
      // updateET trả false = doc không còn (savedId trỏ doc đã xoá) → RƠI xuống tạo mới, tránh FK khi setETCaus.
      if (id && await updateET(id, { ten, lop_id: lop.id, ngay, cau_hinh: chSave })) {
        await setETCaus(id, maCaus)
        // ⭐ 07-12: link PDF có sẵn ngay khi lưu → enqueue hàng đợi TOÀN CỤC (LinkGenWorker, App.tsx).
        useStore.getState().enqueueLinkGen(id, 'et')
        return id
      }
      const created = await createET({ lopId: lop.id, ngay, ten, khoi: lop.khoi ?? '', mon: lop.mon })
      await setETCaus(created.id, maCaus)
      if (Object.keys(chSave).length) await updateET(created.id, { cau_hinh: chSave })
      useStore.getState().enqueueLinkGen(created.id, 'et')
      setSavedId(created.id)   // create xong → lần lưu sau UPDATE, không đẻ doc trùng
      return created.id
    } catch (e: any) { setErr(e.message ?? String(e)); return null } finally { setBusy(false) }
  }
  async function luu() {
    const id = await persistET()
    if (!id) return
    if (editing) { onClose?.(); return }   // sửa từ Kho → đóng builder
    resetForm(); setSavedId(null); setFlash('Đã lưu ET vào Kho tài liệu. Form đã reset để tạo ET mới.')
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = rows.filter((r) => r.maCau).length

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {onClose && <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>}
        <span className="text-sm font-semibold text-slate-900">{editing ? 'Sửa ET' : 'Tạo ET'}</span>
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">gắn buổi (lớp + ngày)</span>
        <div className="ml-2 flex items-center gap-1.5 text-[12px] text-slate-500">Lớp
          <div className="w-44"><SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
            options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">Ngày
          <BuoiNgaySelect lopId={lopId} value={ngay} onChange={setNgay} defaultToday />
        </div>
        {lop && ngay && <span className="font-mono text-[11px] text-violet-500">{maET(lop.ten_lop, ngay)}</span>}
        <span className="ml-auto text-[12px] text-slate-400">{soCau} câu</span>
        {soCau > 0 && <button onClick={() => setPrinting(true)} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">🖨 Xem / In (3 mã đề)</button>}
        <button onClick={luu} disabled={busy || !lop || !ngay || !soCau} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : '💾 Lưu ET'}</button>
      </div>

      <div className="min-h-0 flex flex-1 overflow-hidden">
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[820px]">
          {flash && <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">✓ {flash}</div>}
          {err && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{err}</div>}
          <p className="mb-3 text-[12px] text-slate-400">Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau trong đề.{!khoi && <span className="text-amber-600"> Chọn <b>lớp</b> trước để chọn dạng.</span>}</p>
          {soCau > 0 && (() => { const t = oTrong().length; const gen = !!(ch.etMaDe && Object.keys(ch.etMaDe).length)
            return (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2">
                <span className="text-[12px] font-semibold text-violet-700">🧩 3 mã đề</span>
                <span className="text-[11px] text-slate-500">Đề gốc = các câu trên; đề 2 &amp; 3 tự sinh — cùng dạng + cùng form, khác câu (mỗi HS 1 mã).</span>
                <button onClick={sinhMaDe} className="ml-auto rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 {gen ? 'Sinh lại' : 'Sinh'} đề 2 &amp; 3</button>
                {t ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">{t} ô trống — chọn tay trước khi lưu</span>
                  : gen ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ đủ 3 mã đề</span> : null}
              </div>
            ) })()}
          {groupsPresent.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2">
              <span className="text-[12px] font-semibold text-sky-700">🧱 Số cột khi in</span>
              {groupsPresent.map((g) => (
                <label key={g} className="flex items-center gap-1.5 text-[11px] text-slate-500">{GROUP_LBL[g]}
                  <select value={ch.etColByGroup?.[g] ?? 'thuong'} onChange={(e) => setColGroup(g, e.target.value)}
                    className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:border-sky-300">
                    {BLOCK_KIEU.map((k) => <option key={k.v} value={k.v}>{k.lbl}</option>)}
                  </select>
                </label>
              ))}
              <span className="text-[11px] text-slate-400">Câu ngắn (trắc nghiệm / trả lời ngắn) xếp nhiều cột để tiết kiệm giấy.</span>
            </div>
          )}
          <div className="space-y-2">
            {rows.map((r, i) => {
              const c = r.maCau ? cau[r.maCau] : null
              const form = c ? etFormOf(c, ch) : null
              const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
              return (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex items-start gap-2">
                  <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                  <button onClick={() => khoi && setDangModal(i)} disabled={!khoi} className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300">
                    {r.maDang ? <span className="text-slate-700">{tenDang(r.maDang)}</span> : <span className={khoi ? 'text-indigo-500' : ''}>{khoi ? '+ chọn dạng…' : 'chọn lớp trước'}</span>}
                  </button>
                  <div className="min-w-0 flex-1 pt-1">
                    {c ? <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
                      : r.maDang ? <span className="text-[12px] italic text-slate-400">chưa có câu</span>
                      : <span className="text-[12px] italic text-slate-300">chọn dạng để hệ gợi ý câu</span>}
                    {c && (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500" title="Mã câu">{c.ma_cau}</span>
                        <span className="text-[10px] text-slate-300">kho: {loaiLabel(c.loai_cau)} · in dạng:</span>
                        <div className="flex gap-0.5">
                          {formOpts.map((f) => (
                            <button key={f.v} onClick={() => setForm(c.ma_cau, f.v)} title="Form hiển thị trong đề (khác loại kho)"
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${form === f.v ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{f.lbl}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {c && form === 'tu_luan' && (
                    <label className="flex shrink-0 items-center gap-1 pt-1.5 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết (bản in)">dòng
                      <input type="number" min={0} max={30} value={ch.btvnLinesByCau?.[c.ma_cau] ?? 4} onChange={(e) => setLines(c.ma_cau, Math.max(0, Math.min(30, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                    </label>
                  )}
                  {r.maDang && (
                    <div className="flex shrink-0 gap-1 pt-0.5">
                      <button onClick={() => doiCau(i)} title="Đổi câu khác (ít dùng kế tiếp)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                      <button onClick={() => setPicker({ idx: i, maDang: r.maDang! })} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                    </div>
                  )}
                  <button onClick={() => xoaRow(i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                  </div>
                  {/* Mã đề 2 & 3 — câu khác cùng dạng + cùng form với câu gốc; TRỐNG thì chặn lưu, chọn tay. */}
                  {c && (
                    <div className="mt-2 ml-8 space-y-1 border-t border-dashed border-slate-100 pt-2">
                      {[0, 1].map((v) => {
                        const vm = ch.etMaDe?.[c.ma_cau]?.[v] ?? null
                        const vc = vm ? cau[vm] : null
                        const f = etFormOf(c, ch)
                        return (
                          <div key={v} className="flex items-center gap-2 text-[12px]">
                            <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Mã đề {v + 2}</span>
                            {vm ? (
                              <>
                                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">{vm}</span>
                                <span className="min-w-0 flex-1 truncate text-slate-600">{vc ? <MathText>{vc.noi_dung}</MathText> : '…'}</span>
                              </>
                            ) : (
                              <span className="min-w-0 flex-1 font-medium text-rose-500">⚠ TRỐNG — chưa có câu cùng dạng + form khác</span>
                            )}
                            <button onClick={() => setVarPicker({ baseMaCau: c.ma_cau, v, maDang: r.maDang ?? c.dang_chinh, form: f })}
                              className="shrink-0 rounded-md border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-violet-400">✎ {vm ? 'Đổi' : 'Chọn'}</button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <button onClick={themCau} className="mt-3 w-full rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 py-2.5 text-[14px] font-medium text-violet-700 transition hover:bg-violet-50">+ Thêm câu</button>
        </div>
      </div>
      {/* Bảng gán mã đề theo HS — làm ngay khi soạn (có câu). Học bù: bấm 🖨 in lại phiếu 1 HS. */}
      {soCau > 0 && (
        <div className="w-80 shrink-0 overflow-auto border-l border-slate-200 bg-white p-4">
          <div className="mb-2 text-[13px] font-semibold text-slate-800">👥 Gán mã đề theo HS</div>
          {!deReady ? (
            <p className="text-[12px] italic text-slate-400">Bấm <b>🎲 Sinh đề 2 &amp; 3</b> (đủ 3 mã đề, không còn ô trống) rồi gán mã đề cho từng HS ở đây.</p>
          ) : roster.length === 0 ? (
            <p className="text-[12px] italic text-slate-400">Chưa có HS <b>điểm danh có mặt</b> cho buổi này. Điểm danh xong (có mặt) sẽ hiện danh sách.</p>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <button onClick={raiTuDong} className="rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 Rải tự động</button>
                <button onClick={() => inTheoHS(roster)} className="ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-indigo-500">🖨 Xem &amp; In cả lớp</button>
              </div>
              <ol className="space-y-1">
                {roster.map((hs) => { const cur = ch.hsMaDe?.[hs.id]
                  return (
                    <li key={hs.id} className="flex items-center gap-2 rounded-md border border-slate-100 px-2 py-1.5">
                      <span className="min-w-0 flex-1 truncate text-[12px] text-slate-700" title={hs.ma_hs ?? ''}>{hs.ho_ten}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((n) => (
                          <button key={n} onClick={() => setHsMa(hs.id, n)} title={`Mã đề ${n}`}
                            className={`h-6 w-6 rounded text-[12px] font-bold ${cur === n ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{n}</button>
                        ))}
                      </div>
                      <button onClick={() => inTheoHS([hs])} title="In lại phiếu HS này (học bù)" className="shrink-0 text-[13px] text-slate-400 hover:text-indigo-600">🖨</button>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-2 text-[11px] text-slate-400">Rải tự động = xoay vòng 1·2·3 theo thứ tự (HS cạnh nhau khác mã). Gán xong bấm <b>Lưu ET</b> để dùng lại khi học bù.</p>
            </>
          )}
        </div>
      )}
      </div>

      {printing && <ETPrintView id={savedId ?? et?.id ?? 'preview'} fullOverride={previewFull} varCauOverride={cau} onClose={() => setPrinting(false)} />}
      {classPrint && <ETPrintView id={savedId ?? et?.id ?? 'preview'} fullOverride={previewFull} varCauOverride={cau} perHS={classPrint} onClose={() => setClassPrint(null)} />}
      {dangModal !== null && <DangPickerOne khoi={khoi} mon={mon} onClose={() => setDangModal(null)}
        onPick={(ma) => { const i = dangModal; setDangModal(null); pickDang(i, ma) }} />}
      {picker && <KhoPicker maDangs={[picker.maDang]} cauTbl={cauTbl} selected={rows[picker.idx].maCau ? [rows[picker.idx].maCau!] : []} onClose={() => setPicker(null)}
        onConfirm={async (m) => {
          const used = usedExcept(picker.idx)
          const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
          if (pick) await ensureCache(picker.maDang)
          setRows((rs) => rs.map((x, i) => (i === picker.idx ? { ...x, maCau: pick } : x)))
          setPicker(null)
        }} />}
      {varPicker && <KhoPicker maDangs={[varPicker.maDang]} cauTbl={cauTbl}
        selected={ch.etMaDe?.[varPicker.baseMaCau]?.[varPicker.v] ? [ch.etMaDe[varPicker.baseMaCau][varPicker.v]!] : []}
        disabled={[...usedMoiDe()]} onClose={() => setVarPicker(null)}
        onConfirm={async (m) => {
          const used = usedMoiDe()
          const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
          if (pick) {
            const list = await listCauByDang(varPicker.maDang, cauTbl)
            setCau((p) => ({ ...p, ...Object.fromEntries(list.map((cc) => [cc.ma_cau, cc])) }))
            setVar(varPicker.baseMaCau, varPicker.v, pick, varPicker.form)
          }
          setVarPicker(null)
        }} />}
    </div>
  )
}
