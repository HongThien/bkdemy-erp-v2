// ET THEO BẢN ĐỒ MỚI (Thùy 20/10: "builder mới phải có cả ET · bản mới, tách khỏi bản cũ cho chắc · dựng dựa trên cái cũ nhưng trỏ
// sang bản đồ mới"). Khuôn = ETEditor cũ (ETScreen.tsx — KHÔNG sửa): gán LỚP + NGÀY · kế hoạch nhiều dạng × số câu · mỗi hàng 1 câu
// (đổi/chọn tay) · form in · 2 cột · 3 mã đề · gán mã đề theo HS · in · lưu. Khác:
//   · chọn theo NHÓM / DẠNG BÀI bản đồ mới (BoChonNhom) — hàng ET giữ id dạng bài (NDB…), không giữ dạng cũ;
//   · kế hoạch tự ĐIỀN SẴN dạng bài của giáo trình buổi (bản đồ mới) của lớp hôm đó (fn_tl_bdm_et_de_xuat);
//   · gợi ý câu (fn_tl_bdm_goi_y) + đề 2/3 (fn_tl_bdm_et_ma_de) tính ở DB, không tính ở client như bản cũ.
// Lưu Y KHUÔN ET cũ (tai_lieu loai='et' + ban_do='moi', 1 phần câu + cau_hinh.etMaDe/etFormByCau/hsMaDe) ⇒ Chấm ET, in, ET online,
// đo đọc như cũ. DB chặn trộn ET bản cũ/bản mới trong cùng buổi (trg_et_khong_tron_ban_do).
// Hình: đợt sau (trỏ sang Hình–Luyện mới); ET Hình hiện vẫn soạn ở mục ET cũ.
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createET, updateET, getTaiLieuFull, setETCaus, getETByBuoi, fetchCausCuaTaiLieu, maET, ET_FORMS, etFormOf, sortETCaus,
  type CauHinh, type ETForm as ETFormKind, type TaiLieuFull,
} from '../../../lib/tailieu'
import { oTrongMaDe, usedMoiDe as usedMoiDeLib, setVarInCh } from '../../../lib/made'
import { listLop, type Lop } from '../../../lib/nhansu'
import { hsCoMatCuaBuoi } from '../../../lib/gami'
import { LOAI_CAU, type CauHoi } from '../../../lib/kho/api'
import { cayChon, etDeXuat, etViTri, etMaDe, goiYDangBai, loiDoc, type ChonBuoi } from '../../../lib/tailieuBdm'
import { MathText } from '../../kho/ui'
import ETPrintView from '../ETPrintView'
import SearchSelect from '../../../components/SearchSelect'
import BuoiNgaySelect from '../../../components/BuoiNgaySelect'
import BoChonNhom from './BoChonNhom'
import ChonCauBdm from './ChonCauBdm'
import { useStore } from '../../../store/useStore'
import type { ETView } from '../ETScreen'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const DEFAULT_ROWS = 5
const SO_CAU_MAC_DINH = 1                      // kế hoạch điền sẵn từ giáo trình buổi: 1 câu / dạng bài (GV tăng nếu cần)
type Row = { db: string | null; maCau: string | null }   // db = id dạng bài bản đồ mới
type Plan = { db: string; soCau: number }
type DbInfo = { id: string; ten: string; nhom_id: string; nhom_ten: string; so_cau: number }
const blankRows = (): Row[] => Array.from({ length: DEFAULT_ROWS }, () => ({ db: null, maCau: null }))
// Nháp tạo-mới sống tới F5 (rời màn rồi quay lại không mất) — riêng bản mới, không đụng nháp ET cũ trong store.
let NHAP: { lopId: string | null; ngay: string; savedId: string | null; rows: Row[]; cau: Record<string, CauHoi>; ch: CauHinh; plan: Plan[] } | null = null

export default function ETBdmEditor({ et, onClose }: { et?: ETView; onClose?: () => void }) {
  const editing = !!et
  const nhap0 = !et ? NHAP : null
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(et?.lop_id ?? nhap0?.lopId ?? null)
  const [ngay, setNgay] = useState<string>(et?.ngay ?? nhap0?.ngay ?? '')
  const [rows, setRows] = useState<Row[]>(() => nhap0?.rows ?? blankRows())
  const [cau, setCau] = useState<Record<string, CauHoi>>(() => nhap0?.cau ?? {})
  const [ch, setCh] = useState<CauHinh>(() => nhap0?.ch ?? {})
  const [plan, setPlan] = useState<Plan[]>(() => nhap0?.plan ?? [])
  const [dbs, setDbs] = useState<Map<string, DbInfo>>(new Map())          // dạng bài của khối (tên, nhóm, số câu)
  const [chonPlan, setChonPlan] = useState(false)
  const [chonHang, setChonHang] = useState<number | null>(null)           // chọn dạng bài cho 1 hàng
  const [chonCau, setChonCau] = useState<number | null>(null)             // ✎ chọn tay câu của 1 hàng
  const [chonVar, setChonVar] = useState<{ base: string; v: number; db: string; form: ETFormKind } | null>(null)
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [classPrint, setClassPrint] = useState<{ id: string; ho_ten: string; maDe: number }[] | null>(null)
  const [printing, setPrinting] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(et?.id ?? nhap0?.savedId ?? null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [deXuatTu, setDeXuatTu] = useState<string | null>(null)           // "đã điền sẵn từ giáo trình buổi"

  const lop = lops.find((l) => l.id === lopId) ?? null
  const khoi = lop?.khoi ?? et?.khoi ?? ''
  const tlCtx = { mon: 'Toán', nhanh: null, cau_hinh: ch }
  const tenDb = (id: string | null) => (id ? dbs.get(id)?.ten ?? id : '')

  // ── nạp ──
  async function napNoiDung(mas: string[], bank = cau): Promise<Record<string, CauHoi>> {
    const can = [...new Set(mas)].filter((m) => m && !bank[m])
    if (!can.length) return bank
    const rs = await fetchCausCuaTaiLieu(tlCtx, can)
    const next = { ...bank }; for (const c of rs) next[c.ma_cau] = c
    setCau(next)
    return next
  }
  async function fillFromET(docId: string, khoiDoc: string) {
    const full = await getTaiLieuFull(docId)
    const caus = full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
    const ch0 = full.taiLieu.cau_hinh ?? {}
    const bank: Record<string, CauHoi> = Object.fromEntries(caus.map((c) => [c.ma_cau, c]))
    const them = Object.values(ch0.etMaDe ?? {}).flat().filter((m): m is string => !!m && !bank[m])
    if (them.length) for (const c of await fetchCausCuaTaiLieu({ mon: 'Toán', nhanh: null, cau_hinh: ch0 }, them)) bank[c.ma_cau] = c
    const vt = new Map((await etViTri(khoiDoc, caus.map((c) => c.ma_cau))).map((v) => [v.ma_cau, v.dang_bai_id]))
    setCau(bank); setCh(ch0)
    const r: Row[] = caus.map((c) => ({ db: vt.get(c.ma_cau) ?? null, maCau: c.ma_cau }))
    while (r.length < DEFAULT_ROWS) r.push({ db: null, maCau: null })
    setRows(r)
  }
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const ls = await listLop()
        setLops(ls.filter((l) => l.mon === 'Toán'))
        if (et) await fillFromET(et.id, et.khoi)
      } catch (e) { setErr(loiDoc(e)) } finally { setLoading(false) }
    })()
  }, []) // eslint-disable-line

  // dạng bài của khối (đổi khi đổi lớp khác khối)
  useEffect(() => {
    if (!khoi) { setDbs(new Map()); return }
    cayChon(khoi).then((cay) => {
      const m = new Map<string, DbInfo>()
      for (const cd of cay) for (const chd of cd.chuyen_de) for (const n of chd.nhom) for (const d of n.dang_bai) m.set(d.id, { id: d.id, ten: d.ten, nhom_id: n.id, nhom_ten: n.ten, so_cau: d.so_cau })
      setDbs(m)
    }).catch((e) => setErr(loiDoc(e)))
  }, [khoi])

  // ── AUTO: (lớp + ngày) đã có ET ⇒ nạp lại (bản mới) / báo (bản cũ); chưa có ⇒ điền sẵn kế hoạch theo giáo trình buổi ──
  const autoRef = useRef('')
  useEffect(() => {
    if (et || !lopId || !ngay || !khoi) return
    const key = lopId + '|' + ngay
    if (autoRef.current === key) return
    if (rows.some((r) => r.maCau) && !savedId) return            // đang có nội dung chưa lưu ⇒ không đè
    autoRef.current = key
    let alive = true
    ;(async () => {
      const doc = await getETByBuoi(lopId, ngay)
      if (!alive) return
      if (doc && doc.ban_do !== 'moi') { setErr('Buổi này đã có ET soạn theo bản đồ CŨ — sửa ở mục "ET". Không tạo thêm ET bản mới cho cùng buổi.'); return }
      if (doc && doc.id !== savedId) {
        await fillFromET(doc.id, khoi); if (!alive) return
        setSavedId(doc.id); setFlash('Đã nạp ET có sẵn của buổi này — sửa rồi Lưu để cập nhật (3 mã đề & gán HS giữ nguyên).'); return
      }
      if (!doc && plan.length === 0) {
        const dx = await etDeXuat(lopId, ngay); if (!alive) return
        if (dx.dang_bai.length) { setPlan(dx.dang_bai.map((d) => ({ db: d.id, soCau: SO_CAU_MAC_DINH }))); setDeXuatTu(`${dx.dang_bai.length} dạng bài của giáo trình buổi này`) }
      }
    })().catch((e) => { if (alive) setErr(loiDoc(e)) })
    return () => { alive = false }
  }, [lopId, ngay, khoi]) // eslint-disable-line

  useEffect(() => {
    if (et) return
    const trong = !lopId && !ngay && rows.every((r) => !r.maCau) && !plan.length
    NHAP = trong ? null : { lopId, ngay, savedId, rows, cau, ch, plan }
  }, [et, lopId, ngay, savedId, rows, cau, ch, plan])
  // đổi LỚP ⇒ câu thuộc khối khác ⇒ reset (không reset lúc mount / lần chọn lớp đầu)
  const lopRef = useRef(lopId)
  useEffect(() => {
    if (lopRef.current === lopId) return
    const prev = lopRef.current; lopRef.current = lopId
    if (prev == null) return
    setRows(blankRows()); setCau({}); setCh({}); setPlan([]); setNgay(''); setRoster([]); setClassPrint(null); setDeXuatTu(null); setErr(null)
    if (!et) setSavedId(null)
  }, [lopId]) // eslint-disable-line
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 3000); return () => clearTimeout(t) }, [flash])
  useEffect(() => {
    if (!lopId || !ngay) { setRoster([]); return }
    let alive = true
    hsCoMatCuaBuoi(lopId, ngay).then((r) => { if (alive) setRoster(r) }).catch(() => { if (alive) setRoster([]) })
    return () => { alive = false }
  }, [lopId, ngay])

  // ── soạn ──
  const usedExcept = (idx: number) => rows.filter((_, i) => i !== idx).map((r) => r.maCau).filter((m): m is string => !!m)
  async function goiY1(db: string, tru: string[]): Promise<string | null> {
    const info = dbs.get(db); if (!info) return null
    const [m] = await goiYDangBai(info.nhom_id, db, 1, tru)
    if (m) await napNoiDung([m])
    return m ?? null
  }
  async function datDangHang(idx: number, db: string) {
    try { const m = await goiY1(db, usedExcept(idx)); setRows((rs) => rs.map((r, i) => (i === idx ? { db, maCau: m } : r))) }
    catch (e) { setErr(loiDoc(e)) }
  }
  async function doiCau(idx: number) {
    const r = rows[idx]; if (!r.db) return
    try {
      const m = await goiY1(r.db, [...usedExcept(idx), ...(r.maCau ? [r.maCau] : [])])
      if (!m) { setFlash('Hết câu khác cho dạng bài này (đã dùng hết trong đề).'); return }
      setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, maCau: m } : x)))
    } catch (e) { setErr(loiDoc(e)) }
  }
  async function sinhTheoKeHoach() {
    const ps = plan.filter((p) => p.soCau > 0)
    if (!ps.length) return
    setBulkBusy(true); setErr(null)
    try {
      const used = rows.map((r) => r.maCau).filter((m): m is string => !!m)
      const moi: Row[] = []; const thieu: string[] = []
      for (const p of ps) {
        const info = dbs.get(p.db); if (!info) { thieu.push(`${p.db}: không còn trên bản đồ`); continue }
        const got = await goiYDangBai(info.nhom_id, p.db, p.soCau, used)
        got.forEach((m) => { used.push(m); moi.push({ db: p.db, maCau: m }) })
        if (got.length < p.soCau) thieu.push(`${info.ten}: chỉ được ${got.length}/${p.soCau} câu`)
      }
      await napNoiDung(moi.map((r) => r.maCau!))
      setRows((rs) => [...rs.filter((r) => r.db || r.maCau), ...moi])
      setPlan([]); setDeXuatTu(null)
      if (thieu.length) setErr(`Thiếu câu ở vài dạng bài (kho hết câu chưa dùng trong đề):\n${thieu.join('\n')}`)
    } catch (e) { setErr(loiDoc(e)) } finally { setBulkBusy(false) }
  }
  const themHang = () => setRows((rs) => [...rs, { db: null, maCau: null }])
  const xoaHang = (idx: number) => setRows((rs) => rs.filter((_, i) => i !== idx))
  const setLines = (m: string, n: number) => setCh((c) => ({ ...c, btvnLinesByCau: { ...(c.btvnLinesByCau ?? {}), [m]: n } }))
  const setForm = (m: string, f: ETFormKind) => setCh((c) => ({ ...c, etFormByCau: { ...(c.etFormByCau ?? {}), [m]: f } }))
  const setColCau = (m: string, n: number) => setCh((c) => ({ ...c, colByCau: { ...(c.colByCau ?? {}), [m]: n } }))

  // ── 3 mã đề — tính ở DB ──
  const baseRows = () => rows.filter((r) => r.maCau && r.db).map((r) => ({ maDang: r.db!, maCau: r.maCau! }))
  async function tinhMaDe(chGoc: CauHinh, bank: Record<string, CauHoi>): Promise<CauHinh> {
    const base = baseRows().map((b) => ({ ma_cau: b.maCau, dang_bai: b.maDang, form: bank[b.maCau] ? etFormOf(bank[b.maCau], chGoc) : 'tra_loi_ngan' }))
    const kq = await etMaDe(khoi, base)
    await napNoiDung(Object.values(kq.etMaDe).flat(), bank)
    return { ...chGoc, etMaDe: kq.etMaDe, etFormByCau: { ...(chGoc.etFormByCau ?? {}), ...kq.etFormByCau } }
  }
  async function sinhMaDe() {
    if (!baseRows().length) return
    try { setCh(await tinhMaDe(ch, cau)) } catch (e) { setErr(loiDoc(e)) }
  }
  const setVar = (base: string, v: number, m: string, form: ETFormKind) => setCh((c) => setVarInCh(c, base, v, m, form))
  const usedMoiDe = () => usedMoiDeLib(baseRows(), ch)
  const oTrong = (chk: CauHinh = ch) => oTrongMaDe(baseRows(), chk)
  const deReady = !!ch.etMaDe && baseRows().length > 0 && oTrong().length === 0
  const setHsMa = (hsId: string, maDe: number) => setCh((c) => ({ ...c, hsMaDe: { ...(c.hsMaDe ?? {}), [hsId]: maDe } }))
  const raiTuDong = () => setCh((c) => { const m = { ...(c.hsMaDe ?? {}) }; roster.forEach((hs, i) => { m[hs.id] = (i % 3) + 1 }); return { ...c, hsMaDe: m } })
  async function inTheoHS(list: typeof roster) {
    const id = await persistET(); if (!id) return
    setClassPrint(list.map((hs) => ({ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 })))
  }
  const previewFull = useMemo<TaiLieuFull>(() => {
    const chon = rows.filter((r) => r.maCau && cau[r.maCau!])
    const baseCaus = sortETCaus(chon.map((r) => cau[r.maCau!]), ch)
    const ten = lop && ngay ? `ET ${lop.ten_lop} · ${ngay.split('-').reverse().join('/')}` : (et?.ten ?? 'ET')
    return {
      taiLieu: { ...(et ?? {}), id: et?.id ?? 'preview', ten, loai: 'et', mon: 'Toán', nhanh: null, khoi, lop_id: lopId, ngay, cau_hinh: ch, ban_do: 'moi' } as any,
      phans: [{ id: 'custom', tai_lieu_id: 'preview', thu_tu: 0, loai_phan: 'custom', ref_ma: null, tieu_de: 'ET', noi_dung: null, hien_lt: false, caus: baseCaus } as any],
    } as TaiLieuFull
  }, [rows, cau, ch, lop, ngay, khoi, lopId, et])

  // ── lưu (create / update) — giữ nguyên khuôn ET cũ: câu theo thứ tự in, mã đề phủ đúng bộ câu gốc ──
  async function persistET(): Promise<string | null> {
    if (!lop) { setErr('Chọn lớp.'); return null }
    if (!ngay) { setErr('Chọn ngày buổi học.'); return null }
    const chon = rows.filter((r) => r.maCau) as { db: string | null; maCau: string }[]
    if (!chon.length) { setErr('ET cần ít nhất 1 câu.'); return null }
    if (chon.some((r) => !r.db)) { setErr('Có câu chưa thuộc dạng bài nào của bản đồ mới — chọn lại dạng bài cho hàng đó.'); return null }
    setBusy(true); setErr(null)
    try {
      const bank = await napNoiDung(chon.map((r) => r.maCau))
      const conThieu = chon.filter((r) => !bank[r.maCau]).map((r) => r.maCau)
      if (conThieu.length) { setErr(`Không nạp được nội dung câu: ${conThieu.join(', ')} — chưa lưu.`); return null }
      const baseSet = chon.map((r) => r.maCau)
      const cur = ch.etMaDe ?? {}
      const lech = baseSet.some((m) => !cur[m]) || Object.keys(cur).some((k) => !baseSet.includes(k))
      const chSave = lech ? await tinhMaDe(ch, bank) : ch
      if (lech) setCh(chSave)
      const soTrong = baseSet.filter((m) => { const a = chSave.etMaDe?.[m]; return !a || !a[0] || !a[1] }).length
      if (soTrong) { setErr(`Mã đề 2/3 còn ${soTrong} ô TRỐNG — bấm ✎ ở đề 2/đề 3 để chọn tay rồi lưu lại. Chưa lưu.`); return null }
      const maCaus = sortETCaus(chon.map((r) => bank[r.maCau]), chSave).map((c) => c.ma_cau)
      const ten = `ET ${lop.ten_lop} · ${ngay.split('-').reverse().join('/')}`
      const id = savedId ?? et?.id ?? null
      if (id && await updateET(id, { ten, lop_id: lop.id, ngay, cau_hinh: chSave })) {
        await setETCaus(id, maCaus)
        useStore.getState().enqueueLinkGen(id, 'et')
        return id
      }
      const created = await createET({ lopId: lop.id, ngay, ten, khoi: lop.khoi ?? '', mon: 'Toán', nhanh: null, banDo: 'moi' })
      await setETCaus(created.id, maCaus)
      if (Object.keys(chSave).length) await updateET(created.id, { cau_hinh: chSave })
      useStore.getState().enqueueLinkGen(created.id, 'et')
      setSavedId(created.id)
      return created.id
    } catch (e) { setErr(loiDoc(e)); return null } finally { setBusy(false) }
  }
  async function luu() {
    const id = await persistET(); if (!id) return
    if (editing) { onClose?.(); return }
    setLopId(null); setNgay(''); setRows(blankRows()); setCau({}); setCh({}); setPlan([]); setSavedId(null); setDeXuatTu(null); autoRef.current = ''
    setFlash('Đã lưu ET vào Kho tài liệu. Form đã reset để tạo ET mới.')
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = rows.filter((r) => r.maCau).length
  const daChonPlan: ChonBuoi = (() => {
    const m = new Map<string, string[]>()
    for (const p of plan) { const n = dbs.get(p.db)?.nhom_id; if (n) m.set(n, [...(m.get(n) ?? []), p.db]) }
    return [...m.entries()].map(([nhom, dang_bai]) => ({ nhom, dang_bai }))
  })()

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {onClose && <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>}
        <span className="text-sm font-semibold text-slate-900">{editing ? 'Sửa ET' : 'Tạo ET'}</span>
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700" title="ET chọn câu theo bản đồ kiến thức mới (nhóm bài · dạng bài)">🆕 Bản đồ mới</span>
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

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <div className="mx-auto max-w-[820px]">
            {flash && <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">✓ {flash}</div>}
            {err && <div className="mb-3 whitespace-pre-line rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{err} <button onClick={() => setErr(null)} className="ml-2 text-rose-400 hover:text-rose-700">✕</button></div>}
            <p className="mb-3 text-[12px] text-slate-400">Mỗi câu thuộc 1 <b>dạng bài</b> của bản đồ mới → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau trong đề.{!khoi && <span className="text-amber-600"> Chọn <b>lớp</b> trước.</span>}</p>

            {khoi && (
              <div className="mb-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-semibold text-indigo-700">⚡ Kế hoạch ET — nhiều dạng bài, mỗi dạng N câu</span>
                  {deXuatTu && <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">điền sẵn từ {deXuatTu}</span>}
                </div>
                <div className="mt-2 space-y-1.5">
                  {plan.length === 0
                    ? <div className="rounded-md border border-dashed border-indigo-200 bg-white px-3 py-4 text-center text-[12px] italic text-slate-400">
                        {lopId && ngay ? 'Buổi này chưa có giáo trình theo bản đồ mới — ' : ''}bấm <b>+ Chọn dạng bài</b> để chọn nhiều dạng bài cùng lúc.</div>
                    : plan.map((p, i) => {
                      const info = dbs.get(p.db)
                      return (
                        <div key={p.db} className="flex items-center gap-2">
                          <span className="w-6 shrink-0 text-center text-[12px] font-bold text-violet-600">{i + 1}</span>
                          <span className="min-w-0 flex-1 truncate rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-700" title={info ? `${info.nhom_ten} › ${info.ten}` : p.db}>
                            {info ? <><span className="text-slate-400">{info.nhom_ten} › </span>{info.ten}</> : p.db}
                          </span>
                          {info && <span className={`shrink-0 text-[11px] ${info.so_cau < p.soCau ? 'font-medium text-rose-600' : 'text-slate-400'}`}>kho {info.so_cau}</span>}
                          <span className="text-[12px] text-slate-400">×</span>
                          <input type="number" min={1} max={50} value={p.soCau}
                            onChange={(e) => { const v = Math.max(1, Math.min(50, +e.target.value || 1)); setPlan((ps) => ps.map((x) => (x.db === p.db ? { ...x, soCau: v } : x))) }}
                            className="h-8 w-16 rounded border border-slate-300 px-1 text-center text-[13px]" />
                          <span className="text-[12px] text-slate-400">câu</span>
                          <button onClick={() => setPlan((ps) => ps.filter((x) => x.db !== p.db))} title="Bỏ dạng bài" className="text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                        </div>
                      )
                    })}
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => setChonPlan(true)} className="rounded-md border border-dashed border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Chọn dạng bài {plan.length ? '(thêm/bớt)' : '(nhiều dạng cùng lúc)'}</button>
                    <button onClick={sinhTheoKeHoach} disabled={bulkBusy || !plan.length}
                      className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">
                      {bulkBusy ? 'Đang sinh…' : `⚡ Sinh ${plan.reduce((s, p) => s + p.soCau, 0)} câu`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {soCau > 0 && (() => { const t = oTrong().length; const gen = !!(ch.etMaDe && Object.keys(ch.etMaDe).length)
              return (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2">
                  <span className="text-[12px] font-semibold text-violet-700">🧩 3 mã đề</span>
                  <span className="text-[11px] text-slate-500">Đề gốc = các câu dưới; đề 2 &amp; 3 tự sinh — cùng dạng bài + cùng cụm + cùng form, khác câu (mỗi HS 1 mã).</span>
                  <button onClick={sinhMaDe} className="ml-auto rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 {gen ? 'Sinh lại' : 'Sinh'} đề 2 &amp; 3</button>
                  {t ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">{t} ô trống — chọn tay trước khi lưu</span>
                    : gen ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ đủ 3 mã đề</span> : null}
                </div>
              ) })()}
            <p className="mb-3 text-[11px] text-slate-400">🧱 Tích <b>2 cột</b> ở từng câu. Các câu tích 2 cột <b>liền nhau</b> tự xếp cạnh nhau; câu ngắn nên để 2 cột cho tiết kiệm giấy.</p>

            <div className="space-y-2">
              {rows.map((r, i) => {
                const c = r.maCau ? cau[r.maCau] : null
                const form = c ? etFormOf(c, ch) : null
                const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
                const info = r.db ? dbs.get(r.db) : null
                return (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-2.5">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                      <button onClick={() => khoi && setChonHang(i)} disabled={!khoi} title={info ? `${info.nhom_ten} › ${info.ten}` : undefined}
                        className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300">
                        {r.db ? <span className="line-clamp-2 text-slate-700">{tenDb(r.db)}</span>
                          : r.maCau ? <span className="text-amber-600">⚠ câu chưa thuộc dạng bài mới</span>
                          : <span className={khoi ? 'text-indigo-500' : ''}>{khoi ? '+ chọn dạng bài…' : 'chọn lớp trước'}</span>}
                      </button>
                      <div className="min-w-0 flex-1 pt-1">
                        {c ? <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
                          : r.db ? <span className="text-[12px] italic text-slate-400">chưa có câu</span>
                          : <span className="text-[12px] italic text-slate-300">chọn dạng bài để hệ gợi ý câu</span>}
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
                          <input type="number" min={0} max={50} value={ch.btvnLinesByCau?.[c.ma_cau] ?? 4} onChange={(e) => setLines(c.ma_cau, Math.max(0, Math.min(50, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                        </label>
                      )}
                      {r.db && (
                        <div className="flex shrink-0 gap-1 pt-0.5">
                          <button onClick={() => doiCau(i)} title="Đổi câu khác (ít dùng kế tiếp)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                          <button onClick={() => setChonCau(i)} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                        </div>
                      )}
                      {c && (
                        <label className="flex shrink-0 items-center gap-1 self-start pt-1.5 text-[11px] text-slate-500" title="Tích = in 2 cột — các câu 2 cột LIỀN NHAU tự xếp cạnh nhau">
                          <input type="checkbox" checked={(ch.colByCau?.[c.ma_cau] ?? 1) === 2} onChange={(e) => setColCau(c.ma_cau, e.target.checked ? 2 : 1)} className="h-3.5 w-3.5 accent-sky-600" />
                          2 cột
                        </label>
                      )}
                      <button onClick={() => xoaHang(i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                    </div>
                    {c && (
                      <div className="ml-8 mt-2 space-y-1 border-t border-dashed border-slate-100 pt-2">
                        {[0, 1].map((v) => {
                          const vm = ch.etMaDe?.[c.ma_cau]?.[v] ?? null
                          const vc = vm ? cau[vm] : null
                          return (
                            <div key={v} className="flex items-center gap-2 text-[12px]">
                              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Mã đề {v + 2}</span>
                              {vm ? (<>
                                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">{vm}</span>
                                {vm === c.ma_cau && <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700" title="Cụm của câu này không còn câu khác cùng form — đề này dùng lại câu gốc. Bấm ✎ để chọn tay câu khác cùng dạng bài nếu muốn.">= câu gốc</span>}
                                <span className="min-w-0 flex-1 truncate text-slate-600">{vc ? <MathText>{vc.noi_dung}</MathText> : '…'}</span>
                              </>) : <span className="min-w-0 flex-1 font-medium text-rose-500">⚠ TRỐNG — bấm Sinh đề 2 &amp; 3 hoặc chọn tay</span>}
                              {r.db && <button onClick={() => setChonVar({ base: c.ma_cau, v, db: r.db!, form: etFormOf(c, ch) })}
                                className="shrink-0 rounded-md border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-violet-400">✎ {vm ? 'Đổi' : 'Chọn'}</button>}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <button onClick={themHang} className="mt-3 w-full rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 py-2.5 text-[14px] font-medium text-violet-700 transition hover:bg-violet-50">+ Thêm câu</button>
          </div>
        </div>

        {soCau > 0 && (
          <div className="w-80 shrink-0 overflow-auto border-l border-slate-200 bg-white p-4">
            <div className="mb-2 text-[13px] font-semibold text-slate-800">👥 Gán mã đề theo HS</div>
            {!deReady ? (
              <p className="text-[12px] italic text-slate-400">Bấm <b>🎲 Sinh đề 2 &amp; 3</b> (đủ 3 mã đề, không còn ô trống) rồi gán mã đề cho từng HS ở đây.</p>
            ) : roster.length === 0 ? (
              <p className="text-[12px] italic text-slate-400">Chưa có HS <b>điểm danh có mặt</b> cho buổi này. Điểm danh xong (có mặt) sẽ hiện danh sách.</p>
            ) : (<>
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
              <p className="mt-2 text-[11px] text-slate-400">Rải tự động = xoay vòng 1·2·3 (HS cạnh nhau khác mã). Gán xong bấm <b>Lưu ET</b> để dùng lại khi học bù.</p>
            </>)}
          </div>
        )}
      </div>

      {printing && <ETPrintView id={savedId ?? et?.id ?? 'preview'} fullOverride={previewFull} varCauOverride={cau} onClose={() => setPrinting(false)} />}
      {classPrint && <ETPrintView id={savedId ?? et?.id ?? 'preview'} fullOverride={previewFull} varCauOverride={cau} perHS={classPrint} onClose={() => setClassPrint(null)} />}
      {chonPlan && (
        <BoChonNhom khoi={khoi} daChon={daChonPlan} onClose={() => setChonPlan(false)}
          onConfirm={(c) => {
            const cu = new Map(plan.map((p) => [p.db, p.soCau]))
            setPlan(c.flatMap((x) => x.dang_bai).map((db) => ({ db, soCau: cu.get(db) ?? SO_CAU_MAC_DINH })))
            setChonPlan(false)
          }} />
      )}
      {chonHang !== null && (
        <BoChonNhom khoi={khoi} daChon={rows[chonHang]?.db ? [{ nhom: dbs.get(rows[chonHang].db!)?.nhom_id ?? '', dang_bai: [rows[chonHang].db!] }].filter((x) => x.nhom) : []}
          onClose={() => setChonHang(null)}
          onConfirm={async (c) => {
            const db = c.flatMap((x) => x.dang_bai).find((d) => d !== rows[chonHang]?.db) ?? c.flatMap((x) => x.dang_bai)[0]
            const i = chonHang; setChonHang(null)
            if (db) await datDangHang(i, db)
          }} />
      )}
      {chonCau !== null && rows[chonCau]?.db && dbs.get(rows[chonCau].db!) && (
        <ChonCauBdm tl={tlCtx} nhomId={dbs.get(rows[chonCau].db!)!.nhom_id} uuTien={rows[chonCau].db}
          selected={rows[chonCau].maCau ? [rows[chonCau].maCau!] : []} khoa={usedExcept(chonCau)}
          onClose={() => setChonCau(null)}
          onConfirm={async (ms) => {
            const i = chonCau; const used = new Set(usedExcept(i))
            const pick = ms.find((m) => !used.has(m)) ?? null
            if (pick) await napNoiDung([pick])
            setRows((rs) => rs.map((x, j) => (j === i ? { ...x, maCau: pick } : x)))
            setChonCau(null)
          }} />
      )}
      {chonVar && dbs.get(chonVar.db) && (
        <ChonCauBdm tl={tlCtx} nhomId={dbs.get(chonVar.db)!.nhom_id} uuTien={chonVar.db}
          selected={ch.etMaDe?.[chonVar.base]?.[chonVar.v] ? [ch.etMaDe[chonVar.base][chonVar.v]!] : []}
          khoa={[...usedMoiDe()]} onClose={() => setChonVar(null)}
          onConfirm={async (ms) => {
            const used = usedMoiDe()
            const pick = ms.find((m) => !used.has(m)) ?? ms[0] ?? null
            if (pick) { await napNoiDung([pick]); setVar(chonVar.base, chonVar.v, pick, chonVar.form) }
            setChonVar(null)
          }} />
      )}
    </div>
  )
}
