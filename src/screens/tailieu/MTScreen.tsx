// Màn "MT" (kỳ thi lớn, "Grand Slam") — soạn nội dung ĐỘC LẬP (nhiều phần/chuyên đề, mỗi phần chọn
// câu theo cơ chế ET: chọn dạng → hệ gợi ý câu ít-dùng-nhất → ✎ Chọn/↻ Đổi — KHÔNG bóc-ảnh như Đề
// thi) rồi GÁN vào buổi (lớp+ngày) khi cần dùng. Khác ET: ET = 1 lớp+ngày cố định lúc tạo; MT tạo
// xong nằm ở Kho tài liệu như 1 MẪU, gán được cho NHIỀU lớp/nhiều lần (giống mô hình Đề thi).
// Phạm vi hiện tại: soạn + gán buổi. Chấm MT trong buổi (Đ/C/S, đóng phase, Elo K=60) = lượt sau.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, type PickItem } from '../../store/useStore'
import { useMonScope } from '../../hooks/useMonScope'
import {
  listMT, createMT, renameMT, deleteMT, addPhanMT, ganMTVaoBuoi, listGanMT, pickCuaHinhRow,
  type MTGanRow,
} from '../../lib/mt'
import {
  getTaiLieuFull, deletePhan, setCauOfPhan, suggestCauForDang, khoCuaMon, updateTaiLieu, nhanhCuaMon, tenNhanh, nhanhCuaCau, fetchCausCuaTaiLieu, coKhoHinh, laMaHinh, HINH_PREFIX,
  ET_FORMS, etFormOf, type PhanResolved, type CauHinh, type ETForm as ETFormKind, type HinhRowInfo,
} from '../../lib/tailieu'
// Hình (mô hình) trong MT = 1 HÀNG câu như Đại (Thùy 02/09: "pick câu hình phải như ET, có dòng, là câu đấy, in
// cùng"). Tái dùng engine của ET Hình: goiYChuoi/ChonChuoiPopup chọn bài, banInTheoMoHinh dựng đề (preview + in),
// goiYMaDeChoBai sinh mã đề 2/3 (bản KHÁC có sẵn cùng node, không AI sinh mới).
import { banInTheoMoHinh, goiYMaDeChoBai, goiYChuoi, ChonChuoiPopup, DONG_BTVN, type Ban } from '../kho/hinh/SoanTaiLieu'
import { loadLuoi, chuoiKetNoi, maPhanCapMap, conCua, type Luoi, type BaiToan, type MoHinh } from '../../lib/kho/hinh'
import { Ma, tron } from '../kho/hinh/hinhUi'
import type { MucIn } from '../kho/hinh/HinhPrintView'
import { chuoiSig, CHE_DO_HINH, cheDoKe } from '../../lib/kho/hinhGiaoTrinh'
import { buildMaDe as buildMaDeLib, oTrongMaDe, usedMoiDe as usedMoiDeLib, setVarInCh, maDeStale, type BaseItem } from '../../lib/made'
import { listLop, listHSCuaLop, type Lop, type HocSinh } from '../../lib/nhansu'
import { listCauByDang, listLopBac, LOAI_CAU, KHOI_OPTIONS, DEFAULT_KHOI, type CauHoi, type LopBac } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import DangPickerOne from '../../components/DangPickerOne'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import SearchSelect from '../../components/SearchSelect'
import MTPrintView from './MTPrintView'

const MONS = ['Toán', 'KHTN']
const DEFAULT_ROWS_PER_PHAN = 3
// nhanh = NHÁNH KHO của hàng (null = nhánh mặc định của tài liệu). MT TRỘN nhánh (Thùy 21/08: "toggle chọn bản
// đồ lúc chọn câu" — Đại số / Hình giải tích trong cùng 1 đề, không cứng theo phần) → mọi thao tác tra kho
// (gợi ý câu, ✎ Chọn, mã đề 2/3) đi theo `khoCuaMon(mon, row.nhanh)`; lưu bền ở `cau_hinh.nhanhByCau`.
type Row = { maDang: string | null; maCau: string | null; nhanh: string | null }
const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v

// ═══════════ LIST (leaf lamtailieu:mt) — chọn MT để sửa / tạo mới ═══════════
export default function MTScreen() {
  const { allowedMons: monScope, isAll } = useMonScope()  // scope④ (admin/Ops/Media/Marketing = tất cả)
  const allowedMons = isAll ? MONS : MONS.filter((m) => monScope.includes(m))
  const [mon, setMon] = useState(allowedMons[0] ?? 'Toán')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(',')]) // eslint-disable-line
  const [list, setList] = useState<Awaited<ReturnType<typeof listMT>>>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function reload() { setLoading(true); try { setList(await listMT(mon)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [mon]) // eslint-disable-line

  if (openId) return <MTEditor id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">MT</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">kỳ thi lớn — soạn 1 lần, gán được nhiều lớp/nhiều lần</span>
        {allowedMons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        )}
        <button onClick={() => setCreating(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo MT mới</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">Chưa có MT nào ở môn {mon}.</div>
          : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => (
                <div key={d.id} className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                  <button onClick={() => setOpenId(d.id)} className="block w-full text-left">
                    <div className="font-medium text-slate-800 pr-6">{d.ten}</div>
                    <div className="mt-1 text-[12px] text-slate-500">Khối {d.khoi}</div>
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (!confirm(`Xoá MT "${d.ten}"? Toàn bộ phần/câu trong mẫu này sẽ mất (câu vẫn còn trong kho). Các buổi đã gán từ mẫu này trước đó KHÔNG bị xoá theo.`)) return
                      await deleteMT(d.id); reload()
                    }}
                    title="Xoá MT"
                    className="absolute right-2 top-2 rounded-md px-1.5 py-1 text-[13px] text-slate-300 opacity-0 hover:text-rose-600 group-hover:opacity-100"
                  >🗑</button>
                </div>
              ))}
            </div>
          )}
      </div>
      {creating && <TaoMTModal mon={mon} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setOpenId(id) }} />}
    </div>
  )
}

function TaoMTModal({ mon, onClose, onCreated }: { mon: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [busy, setBusy] = useState(false)
  async function tao() {
    if (!ten.trim()) return
    setBusy(true)
    try { const d = await createMT({ ten: ten.trim(), khoi, mon }); onCreated(d.id) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Tạo MT mới</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên MT</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} placeholder='vd "MT Học kỳ 1 — Toán 9"' className={`${inp} mt-1 w-full`} />
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Khối</label>
        <div className="mt-1 flex flex-wrap gap-1.5">{KHOI_OPTIONS.map((k) => <button key={k} onClick={() => setKhoi(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${khoi === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{k}</button>)}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!ten.trim() || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════ EDITOR — nhiều phần, mỗi phần chọn câu kiểu ET + nút Gán vào buổi ═══════════
export function MTEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const [d, setD] = useState<{ id: string; ten: string; khoi: string; mon: string; nhanh?: string | null; cau_hinh?: CauHinh } | null>(null)
  const [phans, setPhans] = useState<PhanResolved[]>([])
  const [rowsByPhan, setRowsByPhan] = useState<Record<string, Row[]>>({})
  const [cau, setCau] = useState<Record<string, CauHoi>>({}) // cache để preview
  // dangOpts = HỢP mọi bản đồ của môn (Toán: Đại + Hình giải tích), mỗi dòng gắn `nhanh` — tra tên/bậc theo (nhanh, ma_dang).
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string; bac: string; nhanh: string | null }[]>([])
  const [lopBacs, setLopBacs] = useState<LopBac[]>([]) // S>A>B>C (thu_tu desc) — suy hệ nào thấy được 1 phần, xem ganMTVaoBuoi
  const [ch, setCh] = useState<CauHinh>({}) // cấu hình chỉnh dòng (etFormByCau/btvnLinesByCau) — giống ET
  const [ten, setTen] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ganModal, setGanModal] = useState(false)
  const [ganList, setGanList] = useState<MTGanRow[]>([])
  const [printing, setPrinting] = useState(false)
  const [picker, setPicker] = useState<{ phanId: string; idx: number; maDang: string; nhanh: string | null } | null>(null)
  const [varPicker, setVarPicker] = useState<{ baseMaCau: string; v: number; maDang: string; nhanh: string | null; form: ETFormKind } | null>(null)
  const [dangModal, setDangModal] = useState<{ phanId: string; idx: number; nhanh: string | null } | null>(null)
  const [chiaDe, setChiaDe] = useState<{ taiLieuId: string; lopId: string; lopTen: string } | null>(null)
  const nhanhMacDinh = d?.nhanh ?? null
  const tblCua = (nhanh: string | null) => khoCuaMon(d?.mon, nhanh).cauTbl // bảng câu theo nhánh của TỪNG HÀNG
  const coNhieuNhanh = nhanhCuaMon(d?.mon).length > 1
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  // ── HÌNH (mô hình) = HÀNG câu (Thùy 02/09): hàng nhanh='hinh', maCau='HINH:<uuid>' (giữ vị trí trong phần),
  //    nội dung bài ở ch.hinhByMa[ma]; in chung MTPrintView; gán buổi ghi sang hinh_gt_buoi (lớp,ngày) cho tab chấm.
  //    KHÔNG khối riêng, KHÔNG buổi mẫu (bản sáng 02/09 đã bỏ). ──
  const [hinhL, setHinhL] = useState<Luoi | null>(null)
  const [hinhPicker, setHinhPicker] = useState<{ phanId: string; idx: number } | null>(null)
  const [hinhMuc, setHinhMuc] = useState<Record<string, MucIn>>({}) // preview đề bài từng hàng Hình (banInTheoMoHinh)
  const chRef = useRef<CauHinh>(ch); chRef.current = ch // cau_hinh MỚI NHẤT cho các hàm async (tránh đè bằng closure cũ)

  async function reload() {
    setLoading(true)
    try {
      const full = await getTaiLieuFull(id)
      const ch0 = full.taiLieu.cau_hinh ?? {}
      setD(full.taiLieu as any); setTen(full.taiLieu.ten); setCh(ch0)
      const ps = full.phans.filter((p) => p.loai_phan === 'custom')
      setPhans(ps)
      const rb: Record<string, Row[]> = {}
      const c: Record<string, CauHoi> = {}
      for (const p of ps) {
        const byMa = new Map(p.caus.map((x) => [x.ma_cau, x]))
        // Duyệt danh sách THÔ (maCaus) để giữ hàng HÌNH đúng vị trí; câu kho đã mất thì rụng như trước.
        rb[p.id] = p.maCaus.map((ma): Row | null => {
          if (laMaHinh(ma)) return ch0.hinhByMa?.[ma] ? { maDang: null, maCau: ma, nhanh: 'hinh' } : null
          const x = byMa.get(ma); return x ? { maDang: x.dang_chinh, maCau: ma, nhanh: nhanhCuaCau(full.taiLieu, ma) } : null
        }).filter((r): r is Row => !!r)
        for (const x of p.caus) c[x.ma_cau] = x
      }
      // Nạp thêm nội dung câu MÃ ĐỀ 2/3 (etMaDe) — trên chỉ nạp câu GỐC (phan.caus) nên mở lại MT cũ,
      // cột Mã đề 2/3 chỉ thấy MÃ câu, không thấy đề (chỉ "…") dù dữ liệu vẫn còn nguyên trong cau_hinh.
      const need = new Set<string>()
      for (const arr of Object.values(ch0.etMaDe ?? {})) for (const m of arr) if (m && !c[m]) need.add(m)
      if (need.size) { const vs = await fetchCausCuaTaiLieu(full.taiLieu, [...need]); for (const v of vs) c[v.ma_cau] = v }
      setRowsByPhan(rb); setCau((prev) => ({ ...prev, ...c }))
      setGanList(await listGanMT(id))
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line
  useEffect(() => { listLopBac().then(setLopBacs) }, [])
  useEffect(() => {
    if (!d?.khoi || !coKhoHinh(d.mon)) { setHinhL(null); return }
    let alive = true
    loadLuoi(d.khoi).then((L) => { if (alive) setHinhL(L) }).catch(() => { if (alive) setHinhL(null) })
    return () => { alive = false }
  }, [d?.khoi, d?.mon])
  // Preview đề bài của từng hàng Hình — dựng bằng ĐÚNG engine in (banInTheoMoHinh, 1 bài/lượt), đổi khi hinhByMa đổi.
  useEffect(() => {
    if (!hinhL || !d) return
    const entries = Object.entries(ch.hinhByMa ?? {})
    if (!entries.length) { setHinhMuc({}); return }
    let alive = true
    ;(async () => {
      const out: Record<string, MucIn> = {}
      for (const [ma, h] of entries) {
        // phan phải = 'mt' (banInTheoMoHinh lọc picks theo phan); dòng kẻ truyền tường minh (mặc định DONG_BTVN như ET).
        const m = (await banInTheoMoHinh(d.ten, 'mt', [pickCuaHinhRow(ma, h)], hinhL, { [ma]: h.cheDo ?? 'hien' }, { [ma]: h.soDong ?? DONG_BTVN })).mucs[0]
        if (m) out[ma] = m
      }
      if (alive) setHinhMuc(out)
    })().catch(() => { /* preview thôi — in thật dựng lại ở MTPrintView */ })
    return () => { alive = false }
  }, [hinhL, ch.hinhByMa, d?.ten]) // eslint-disable-line
  useEffect(() => {
    if (!d?.khoi) { setDangOpts([]); return }
    // Nạp MỌI bản đồ của môn (registry nhanhCuaMon; môn 1 nhánh → chỉ nhánh mặc định) — MT trộn nhánh.
    const nhs = nhanhCuaMon(d.mon).map((n) => n.ma)
    const list = nhs.length ? nhs : [d.nhanh ?? null]
    Promise.all(list.map((nh) => khoCuaMon(d.mon, nh).listMap(d.khoi).then((ds) => ds.map((x) => ({ ma_dang: x.leafMa, ten_dang: x.leafTen, ten_chuyen_de: x.t2Ten, bac: x.bac, nhanh: nh })))))
      .then((a) => setDangOpts(a.flat())).catch(() => { /* */ })
  }, [d?.khoi, d?.mon, d?.nhanh])

  const findDang = (md: string | null, nhanh: string | null) => dangOpts.find((x) => x.ma_dang === md && x.nhanh === nhanh)
  const tenDang = (md: string | null, nhanh: string | null) => findDang(md, nhanh)?.ten_dang ?? md ?? ''
  // ⭐ Hệ nào thấy được 1 phần — MẶC ĐỊNH suy từ bac_toi_thieu của dạng các câu trong phần (bản đồ
  // kiến thức đã gán sẵn, khắt khe nhất thắng); GV ÉP TAY được (dropdown cạnh badge, `ch.phanBac[phanId]`)
  // khi muốn khác — ép tay LUÔN THẮNG, "gán vào buổi" (mt.ts) đọc y hệt ưu tiên này.
  const thuTuBac = (ma: string) => lopBacs.find((b) => b.ma === ma)?.thu_tu ?? 0
  function bacTuDongCuaPhan(phanId: string): string {
    const bacs = (rowsByPhan[phanId] ?? []).map((r) => r.maDang ? findDang(r.maDang, r.nhanh)?.bac : null).filter(Boolean) as string[]
    return bacs.reduce((worst, b) => (thuTuBac(b) > thuTuBac(worst) ? b : worst), 'C')
  }
  const bacEpCuaPhan = (phanId: string): string | null => ch.phanBac?.[phanId] ?? null
  const bacHieuLucCuaPhan = (phanId: string): string => bacEpCuaPhan(phanId) ?? bacTuDongCuaPhan(phanId)
  async function setPhanBac(phanId: string, bac: string | null) {
    const next: CauHinh = { ...ch, phanBac: { ...(ch.phanBac ?? {}) } }
    if (bac) next.phanBac![phanId] = bac; else delete next.phanBac![phanId]
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  function nhanHe(bacMa: string): string {
    const qualifying = lopBacs.filter((b) => b.thu_tu >= thuTuBac(bacMa)).map((b) => b.ma)
    return qualifying.length >= lopBacs.length ? 'Mọi hệ' : `Hệ ${qualifying.join(', ')}`
  }
  async function saveTen() { if (d && ten.trim() && ten.trim() !== d.ten) { await renameMT(id, ten.trim()); markSaved() } }
  async function xoaMT() {
    const canhBao = ganList.length ? ` Đã gán cho ${ganList.length} lượt lớp+ngày trước đó — các buổi đó KHÔNG bị xoá theo, chỉ mất liên kết về mẫu gốc.` : ''
    if (!confirm(`Xoá MT "${d?.ten}"? Toàn bộ phần/câu trong mẫu này sẽ mất (câu vẫn còn trong kho).${canhBao}`)) return
    await deleteMT(id); onClose()
  }

  // Câu ĐANG DÙNG xuyên MỌI PHẦN (không riêng phần đang sửa) — chống trùng câu trong 1 MT.
  const usedGlobal = (exceptPhan: string, exceptIdx: number) => {
    const s = new Set<string>()
    for (const [pid, rows] of Object.entries(rowsByPhan)) rows.forEach((r, i) => { if (!(pid === exceptPhan && i === exceptIdx) && r.maCau) s.add(r.maCau) })
    return s
  }
  async function ensureCache(maDang: string, tbl: string) {
    if (Object.values(cau).some((c) => c.dang_chinh === maDang)) return
    const list = await listCauByDang(maDang, tbl)
    setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) }))
  }
  // Ghi bền nhánh của TỪNG CÂU (cau_hinh.nhanhByCau) — chỉ giữ key cho câu KHÁC nhánh mặc định của tài liệu.
  // Mọi nơi đọc lại (getTaiLieuFull → in / chấm / gán buổi) resolve qua nhanhCuaCau, không đoán theo mã.
  // Cùng lúc DỌN hinhByMa: chỉ giữ bài của hàng Hình còn tồn tại (xoá hàng = xoá luôn nội dung bài).
  async function syncNhanhByCau(all: Record<string, Row[]>) {
    const cur = chRef.current
    const next: Record<string, string> = {}
    const dungHinh = new Set<string>()
    for (const rows of Object.values(all)) for (const r of rows) {
      if (!r.maCau) continue
      if (r.nhanh === 'hinh') { dungHinh.add(r.maCau); continue }
      if (r.nhanh && r.nhanh !== nhanhMacDinh) next[r.maCau] = r.nhanh
    }
    const hinhByMa = Object.fromEntries(Object.entries(cur.hinhByMa ?? {}).filter(([ma]) => dungHinh.has(ma)))
    const curN = cur.nhanhByCau ?? {}
    const sameN = Object.keys(curN).length === Object.keys(next).length && Object.entries(next).every(([k, v]) => curN[k] === v)
    const sameH = Object.keys(cur.hinhByMa ?? {}).length === Object.keys(hinhByMa).length
    if (sameN && sameH) return
    const nc: CauHinh = { ...cur }
    if (Object.keys(next).length) nc.nhanhByCau = next; else delete nc.nhanhByCau
    if (Object.keys(hinhByMa).length) nc.hinhByMa = hinhByMa; else delete nc.hinhByMa
    chRef.current = nc; setCh(nc); await updateTaiLieu(id, { cau_hinh: nc })
  }
  async function luuPhan(phanId: string, rows: Row[]) {
    setRowsByPhan((rb) => ({ ...rb, [phanId]: rows }))
    const maCaus = rows.map((r) => r.maCau).filter(Boolean) as string[]
    await setCauOfPhan(phanId, maCaus)
    await syncNhanhByCau({ ...rowsByPhan, [phanId]: rows })
    markSaved()
  }
  async function pickDang(phanId: string, idx: number, maDang: string, nhanh: string | null) {
    const tbl = tblCua(nhanh)
    await ensureCache(maDang, tbl)
    const sug = await suggestCauForDang(maDang, usedGlobal(phanId, idx), tbl)
    if (sug && !cau[sug]) { const list = await listCauByDang(maDang, tbl); setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) })) }
    const rows = (rowsByPhan[phanId] ?? []).map((r, i) => (i === idx ? { maDang, maCau: sug, nhanh } : r))
    await luuPhan(phanId, rows)
  }
  async function doiCau(phanId: string, idx: number) {
    const r = (rowsByPhan[phanId] ?? [])[idx]; if (!r?.maDang) return
    const sug = await suggestCauForDang(r.maDang, new Set([...usedGlobal(phanId, idx), r.maCau].filter(Boolean) as string[]), tblCua(r.nhanh))
    if (!sug) { alert('Hết câu khác cho dạng này (đã dùng hết trong MT).'); return }
    const rows = (rowsByPhan[phanId] ?? []).map((x, i) => (i === idx ? { ...x, maCau: sug } : x))
    await luuPhan(phanId, rows)
  }
  const themCau = (phanId: string) => setRowsByPhan((rb) => ({ ...rb, [phanId]: [...(rb[phanId] ?? []), { maDang: null, maCau: null, nhanh: nhanhMacDinh }] }))
  async function xoaRow(phanId: string, idx: number) {
    const rows = (rowsByPhan[phanId] ?? []).filter((_, i) => i !== idx)
    await luuPhan(phanId, rows)
  }
  async function themPhan() {
    const tieuDe = prompt('Tên phần (vd "Phần I. Đại số", "Phần II. Hình học"):', `Phần ${['I', 'II', 'III', 'IV', 'V'][phans.length] ?? phans.length + 1}`)?.trim()
    if (!tieuDe) return
    const p = await addPhanMT(id, tieuDe)
    setRowsByPhan((rb) => ({ ...rb, [p.id]: Array.from({ length: DEFAULT_ROWS_PER_PHAN }, () => ({ maDang: null, maCau: null, nhanh: nhanhMacDinh })) }))
    await reload(); markSaved()
  }
  async function xoaPhan(p: PhanResolved) {
    if (!confirm(`Xoá phần "${p.tieu_de}"? (câu vẫn còn trong kho, chỉ bỏ khỏi MT này)`)) return
    await deletePhan(p.id); await reload(); markSaved()
  }
  // Cấu hình chỉnh dòng (số dòng kẻ tự luận + đổi form hiển thị) — GIỐNG ET, autosave ngay (MT không có nút Lưu riêng).
  async function setLines(maCau: string, n: number) {
    const next: CauHinh = { ...ch, btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  async function setForm(maCau: string, f: ETFormKind) {
    const next: CauHinh = { ...ch, etFormByCau: { ...(ch.etFormByCau ?? {}), [maCau]: f } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  // Số cột khi in — RIÊNG TỪNG CÂU (cau_hinh.colByCau, autosave). Câu tag cột liền nhau tự xếp cạnh nhau.
  const setColCau = (maCau: string, n: number) => saveCh({ ...ch, colByCau: { ...(ch.colByCau ?? {}), [maCau]: n } })

  // ── 3 MÃ ĐỀ (như ET) — base = MỌI câu XUYÊN mọi phần (đúng thứ tự phần → hàng). Đề 2/3 tự sinh khác
  //    câu (cùng dạng + form), neo theo ma_cau gốc; lưu NGAY vào cau_hinh (MT autosave). Dùng lib/made. ──
  const baseRows = (): Row[] => phans.flatMap((p) => (rowsByPhan[p.id] ?? []).filter((r) => r.maCau && r.maDang))
  const baseAll = (): BaseItem[] => baseRows().map((r) => ({ maDang: r.maDang!, maCau: r.maCau! }))
  async function saveCh(next: CauHinh) { chRef.current = next; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() }
  const hinhRowsAll = (): Row[] => phans.flatMap((p) => (rowsByPhan[p.id] ?? []).filter((r) => r.nhanh === 'hinh' && r.maCau))
  // Hàng Hình chưa có mã đề 2/3 (khoá theo chuoiSig(nodeIds) — khuôn ET Hình).
  const hinhTrong = (): number => hinhRowsAll().filter((r) => { const h = ch.hinhByMa?.[r.maCau!]; return !h || !ch.hinhMaDe?.[chuoiSig(h.nodeIds)] }).length
  async function sinhMaDe() {
    const rows = baseRows()
    const hinhRows = hinhRowsAll()
    if (!rows.length && !hinhRows.length) return
    // Sinh THEO NHÁNH (mỗi nhánh 1 bảng câu) rồi GỘP etMaDe — buildMaDe reset etMaDe từ base của lượt gọi
    // (cố ý, bỏ entry stale) nên phải gộp tay giữa các nhánh; câu 2 nhánh không bao giờ trùng mã (bảng khác).
    const nhs = [...new Set(rows.map((r) => r.nhanh))]
    let chNext: CauHinh = { ...chRef.current, etMaDe: {} }
    const allCaus: CauHoi[] = []
    for (const nh of nhs) {
      const base: BaseItem[] = rows.filter((r) => r.nhanh === nh).map((r) => ({ maDang: r.maDang!, maCau: r.maCau! }))
      const { ch: c2, caus } = await buildMaDeLib(base, chNext, tblCua(nh), cau)
      chNext = { ...c2, etMaDe: { ...(chNext.etMaDe ?? {}), ...(c2.etMaDe ?? {}) } }
      allCaus.push(...caus)
    }
    // HÌNH: mã đề 2/3 = bản KHÁC có sẵn cùng node (khuôn ET Hình, goiYMaDeChoBai); thiếu thì dùng lại bài gốc
    // (Thùy 24/08 — không để trống chặn in).
    if (hinhRows.length && hinhL) {
      const hm: NonNullable<CauHinh['hinhMaDe']> = {}
      const thieu: string[] = []
      for (const r of hinhRows) {
        const h = chNext.hinhByMa?.[r.maCau!]; if (!h) continue
        const chuoi = chuoiKetNoi(hinhL, h.nodeIds[0]); const goc = banCuaHinh(h)
        const opts = await goiYMaDeChoBai(chuoi, goc, 2)
        hm[chuoiSig(h.nodeIds)] = [opts[0]?.ban ?? goc, opts[1]?.ban ?? goc]
        if (opts.length < 2) thieu.push(chuoi.map((b) => b.ma).join('+'))
      }
      chNext = { ...chNext, hinhMaDe: hm }
      if (thieu.length) alert(`Kho chưa đủ 2 bản khác cho ${thieu.length} bài Hình (chỉ đếm biến thể CÙNG node, không tự sinh AI) — đã dùng lại bài gốc cho phần thiếu:\n${thieu.join('\n')}`)
    } else delete chNext.hinhMaDe
    setCau((p) => { const n = { ...p }; for (const c of allCaus) n[c.ma_cau] = c; return n })
    await saveCh(chNext)
  }
  // ── HÌNH: chọn bài cho 1 HÀNG (popup HinhBaiPicker → PickItem) · tuỳ chọn hình vẽ / số dòng · ↻ Đổi bản khác ──
  async function pickHinh(phanId: string, idx: number, p: PickItem) {
    const ma = HINH_PREFIX + crypto.randomUUID()
    const info: HinhRowInfo = { kind: p.kind, nodeIds: p.nodeIds, cheDo: 'hien', ...(p.kind === 'ghep' ? { luaId: p.luaId } : p.kind === 'bienthe' ? { bienTheId: p.bienTheId } : { yId: p.yId }) }
    const nc: CauHinh = { ...chRef.current, hinhByMa: { ...(chRef.current.hinhByMa ?? {}), [ma]: info } }
    chRef.current = nc; setCh(nc); await updateTaiLieu(id, { cau_hinh: nc })
    const rows = (rowsByPhan[phanId] ?? []).map((r, i): Row => (i === idx ? { maDang: null, maCau: ma, nhanh: 'hinh' } : r))
    await luuPhan(phanId, rows)
  }
  async function setHinhInfo(ma: string, patch: Partial<HinhRowInfo>) {
    const cur = chRef.current.hinhByMa?.[ma]; if (!cur) return
    await saveCh({ ...chRef.current, hinhByMa: { ...(chRef.current.hinhByMa ?? {}), [ma]: { ...cur, ...patch } } })
  }
  const chuoiCuaHinh = (h: HinhRowInfo): BaiToan[] => h.nodeIds.map((nid) => hinhL?.baiToan.find((b) => b.id === nid)).filter((b): b is BaiToan => !!b)
  const banCuaHinh = (h: HinhRowInfo): Ban => h.kind === 'ghep' ? { kind: 'ghep', luaId: h.luaId ?? null } : h.kind === 'bienthe' ? { kind: 'bienthe', bienTheId: h.bienTheId! } : { kind: 'y', yId: h.yId! }
  const nhanBanHinh = (h: HinhRowInfo) => (h.kind === 'ghep' ? (h.luaId ? 'Lứa (đổi đỉnh)' : 'Đề chuẩn') : h.kind === 'bienthe' ? 'Biến thể' : 'Ý thật')
  // ↻ Đổi = bản KHÁC cùng chuỗi/node, ít dùng nhất (đúng goiYMaDeChoBai của ET Hình) — hết bản khác thì báo.
  async function doiHinh(ma: string) {
    const h = chRef.current.hinhByMa?.[ma]; if (!h || !hinhL) return
    const opts = await goiYMaDeChoBai(chuoiKetNoi(hinhL, h.nodeIds[0]), banCuaHinh(h), 1)
    if (!opts.length) { alert('Kho chưa có bản khác cho bài này (cùng node).'); return }
    const b = opts[0].ban
    await setHinhInfo(ma, { kind: b.kind, luaId: b.kind === 'ghep' ? b.luaId : undefined, bienTheId: b.kind === 'bienthe' ? b.bienTheId : undefined, yId: b.kind === 'y' ? b.yId : undefined })
  }
  const setVar = (baseMaCau: string, v: number, maCau: string, form: ETFormKind) => saveCh(setVarInCh(ch, baseMaCau, v, maCau, form))
  const usedMoiDe = (): Set<string> => usedMoiDeLib(baseAll(), ch)
  const oTrong = (): { maCau: string; v: number }[] => oTrongMaDe(baseAll(), ch)

  if (loading || !d) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = Object.values(rowsByPhan).reduce((s, rows) => s + rows.filter((r) => r.maCau).length, 0)
  const laToanCoHinh = coKhoHinh(d.mon)

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {/* ⭐ 07-12: MT master cũng autosave (không nút Lưu) — enqueue link ở lúc ĐÓNG. Bản thân master
            hiếm khi tự gửi PH (thường gửi bản mt_buoi đã gán lớp), nhưng vẫn có link sẵn nếu cần. */}
        <button onClick={() => { useStore.getState().enqueueLinkGen(id, 'mt'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className="min-w-[260px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">{d.mon} · Khối {d.khoi} · mẫu độc lập</span>
        {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        <span className="text-[12px] text-slate-400">{soCau} câu · {phans.length} phần{ganList.length ? ` · đã gán ${ganList.length} lớp` : ''}</span>
        <button onClick={() => setPrinting(true)} disabled={!soCau} className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400 disabled:opacity-40">🖨 Xem / In</button>
        <button onClick={() => setGanModal(true)} disabled={!soCau} className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">🎯 Gán vào buổi</button>
        <button onClick={xoaMT} title="Xoá MT" className="rounded-md border border-rose-200 px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50">🗑 Xoá</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px]">
          {ganList.length > 0 && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đã gán</p>
              <div className="flex flex-wrap gap-1.5">
                {ganList.map((g) => (
                  <span key={g.taiLieuId} className="flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-2.5 pr-1 text-[12px] font-medium text-emerald-700">
                    {g.lopTen} · {g.ngay.split('-').reverse().join('/')}
                    <button onClick={() => setChiaDe({ taiLieuId: g.taiLieuId, lopId: g.lopId, lopTen: g.lopTen })}
                      title="Chia mã đề theo TỪNG HS trong lớp (in cho cả lớp, trước khi vào buổi) + in"
                      className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">🎯 Chia đề &amp; In</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="mb-3 text-[12px] text-slate-400">Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau XUYÊN mọi phần của MT này.</p>
          {soCau > 0 && (() => { const base = baseAll(); const t = oTrong().length + hinhTrong()
            const gen = !!(ch.etMaDe && Object.keys(ch.etMaDe).length) || !!(ch.hinhMaDe && Object.keys(ch.hinhMaDe).length); const stale = gen && base.length > 0 && maDeStale(base, ch)
            return (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2">
                <span className="text-[12px] font-semibold text-violet-700">🧩 3 mã đề</span>
                <span className="text-[11px] text-slate-500">Đề gốc = các câu dưới; đề 2 &amp; 3 tự sinh — cùng dạng + form, khác câu (xuyên mọi phần).</span>
                <button onClick={sinhMaDe} className="ml-auto rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 {gen ? 'Sinh lại' : 'Sinh'} đề 2 &amp; 3</button>
                {stale ? <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">đã đổi câu — bấm Sinh lại</span>
                  : t ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">{t} ô trống — chọn tay trước khi in</span>
                  : gen ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ đủ 3 mã đề</span> : null}
              </div>
            ) })()}
          <div className="space-y-3">
            {phans.map((p) => {
              const rows = rowsByPhan[p.id] ?? []
              return (
                <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{p.tieu_de}</span>
                    <span className="text-[12px] text-slate-400">{rows.filter((r) => r.maCau).length} câu</span>
                    <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600" title="Hệ đang thấy được phần này (gán vào buổi tự lọc/loại nếu lớp không đủ tư cách)">{nhanHe(bacHieuLucCuaPhan(p.id))}</span>
                    <select value={bacEpCuaPhan(p.id) ?? ''} onChange={(e) => setPhanBac(p.id, e.target.value || null)}
                      title="Ép tay hệ tối thiểu cho CẢ PHẦN (đè lên tự tính theo dạng) — để trống = tự động"
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:border-violet-300">
                      <option value="">Tự động</option>
                      {[...lopBacs].sort((a, b) => a.thu_tu - b.thu_tu).map((b) => <option key={b.ma} value={b.ma}>Ép: từ {b.ma} trở lên</option>)}
                    </select>
                    <button onClick={() => xoaPhan(p)} className="ml-auto text-[12px] text-slate-300 hover:text-rose-600">Xoá phần</button>
                  </div>
                  <div className="space-y-2">
                    {rows.map((r, i) => {
                      // ── HÀNG HÌNH (mô hình): cùng khung hàng như câu Đại — nhãn "Hình" + chuỗi, preview đề, tuỳ chọn hình vẽ
                      //    (hiện / ô trống / không — 3 trạng thái như ET Hình), số dòng, ↻ Đổi / ✎ Chọn / ✕. In chung ở "Xem / In".
                      if (r.nhanh === 'hinh' && r.maCau) {
                        const ma = r.maCau; const h = ch.hinhByMa?.[ma]; const m = hinhMuc[ma]
                        const cd = CHE_DO_HINH.find((x) => x.ma === (h?.cheDo ?? 'hien'))!
                        return (
                          <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/30 p-2.5">
                            <div className="flex items-start gap-2">
                              <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                              <button onClick={() => setHinhPicker({ phanId: p.id, idx: i })} className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400" title="Chọn bài Hình khác">
                                <span className="mr-1 rounded bg-amber-50 px-1 py-0.5 text-[10px] font-medium text-amber-700">Hình</span>
                                <span className="font-mono text-[12px] text-slate-700">{h ? (chuoiCuaHinh(h).map((b) => b.ma).join(' → ') || `${h.nodeIds.length} node`) : '?'}</span>
                              </button>
                              <div className="min-w-0 flex-1 pt-1">
                                {/* Preview = đề + các ý + HÌNH VẼ (Thùy: "preview bài của hình thì phải có cả hình mới view chuẩn được") */}
                                {m && m.kieu === 'de' ? (
                                  <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1 text-[13px] text-slate-700">
                                      <div><MathText>{m.deBai}</MathText></div>
                                      {m.ys.map((y, yi) => <div key={yi} className="text-[12.5px] text-slate-600">{y.nhan && <b>{y.nhan}) </b>}<MathText>{y.giaThietPhu ? `${y.giaThietPhu}. ${y.noiDung}` : y.noiDung}</MathText></div>)}
                                    </div>
                                    {m.anhDe && <img src={m.anhDe} alt="" className="h-24 w-auto max-w-[180px] shrink-0 rounded border border-slate-200 bg-white object-contain" />}
                                  </div>
                                ) : <span className="text-[12px] italic text-slate-400">{hinhL ? 'đang dựng đề…' : 'đang tải kho Hình…'}</span>}
                                {h && (
                                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{nhanBanHinh(h)}</span>
                                    <span className="text-[10px] text-slate-300">hình vẽ:</span>
                                    <button onClick={() => setHinhInfo(ma, { cheDo: cheDoKe(h.cheDo ?? 'hien') })} title={`${cd.goi} — bấm để đổi (hiện → ô trống → không)`}
                                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-200">{cd.icon} {cd.nhan}</button>
                                  </div>
                                )}
                              </div>
                              <label className="flex shrink-0 items-center gap-1 pt-1.5 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết (bản in) — trống = mặc định như ET">dòng
                                <input type="number" min={0} max={30} value={h?.soDong ?? DONG_BTVN} onChange={(e) => setHinhInfo(ma, { soDong: e.target.value === '' ? null : Math.max(0, Math.min(30, +e.target.value || 0)) })} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                              </label>
                              <div className="flex shrink-0 gap-1 pt-0.5">
                                <button onClick={() => doiHinh(ma)} title="Đổi bản khác (cùng node, ít dùng nhất)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                                <button onClick={() => setHinhPicker({ phanId: p.id, idx: i })} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                              </div>
                              <button onClick={() => xoaRow(p.id, i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                            </div>
                          </div>
                        )
                      }
                      const c = r.maCau ? cau[r.maCau] : null
                      const form = c ? etFormOf(c, ch) : null
                      const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
                      return (
                        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                          <div className="flex items-start gap-2">
                          <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                          <button onClick={() => setDangModal({ phanId: p.id, idx: i, nhanh: r.nhanh })} className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400">
                            {r.maDang ? (
                              <span className="text-slate-700">
                                {coNhieuNhanh && <span className="mr-1 rounded bg-sky-50 px-1 py-0.5 text-[10px] font-medium text-sky-700" title="Bản đồ kiến thức (nhánh kho) của câu này">{tenNhanh(d.mon, r.nhanh) ?? ''}</span>}
                                {tenDang(r.maDang, r.nhanh)}
                              </span>
                            ) : <span className="text-indigo-500">+ chọn dạng…</span>}
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
                              <button onClick={() => doiCau(p.id, i)} title="Đổi câu khác (ít dùng kế tiếp)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                              <button onClick={() => setPicker({ phanId: p.id, idx: i, maDang: r.maDang!, nhanh: r.nhanh })} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                            </div>
                          )}
                          {c && (
                            <label className="flex shrink-0 items-center gap-1 self-start pt-1.5 text-[11px] text-slate-500" title="Tích = in 2 cột — các câu 2 cột LIỀN NHAU tự xếp cạnh nhau">
                              <input type="checkbox" checked={(ch.colByCau?.[c.ma_cau] ?? 1) === 2} onChange={(e) => setColCau(c.ma_cau, e.target.checked ? 2 : 1)} className="h-3.5 w-3.5 accent-sky-600" />
                              2 cột
                            </label>
                          )}
                          <button onClick={() => xoaRow(p.id, i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                          </div>
                          {/* Mã đề 2 & 3 — câu khác cùng dạng + form với câu gốc; TRỐNG thì chọn tay (giống ET). */}
                          {c && ch.etMaDe?.[c.ma_cau] && (
                            <div className="mt-2 ml-8 space-y-1 border-t border-dashed border-slate-200 pt-2">
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
                                    <button onClick={() => setVarPicker({ baseMaCau: c.ma_cau, v, maDang: r.maDang ?? c.dang_chinh, nhanh: r.nhanh, form: f })}
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
                  <button onClick={() => themCau(p.id)} className="mt-2.5 w-full rounded-lg border-2 border-dashed border-violet-200 bg-violet-50/40 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50">+ Thêm câu</button>
                </div>
              )
            })}
            <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-3 text-[14px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">+ Thêm phần (vd "Phần II. Hình học")</button>
          </div>
        </div>
      </div>

      {dangModal && d && (
        <DangPickerOne khoi={d.khoi} mon={d.mon} nhanh={dangModal.nhanh} chonNhanh onClose={() => setDangModal(null)}
          pillsThem={laToanCoHinh ? [{ ten: 'Hình', onClick: () => { const { phanId, idx } = dangModal; setDangModal(null); setHinhPicker({ phanId, idx }) } }] : undefined}
          onPick={(ma, nh) => { const { phanId, idx } = dangModal; setDangModal(null); pickDang(phanId, idx, ma, nh) }} />
      )}
      {picker && (
        <KhoPicker maDangs={[picker.maDang]} cauTbl={tblCua(picker.nhanh)} selected={rowsByPhan[picker.phanId]?.[picker.idx]?.maCau ? [rowsByPhan[picker.phanId][picker.idx].maCau!] : []} onClose={() => setPicker(null)}
          onConfirm={async (m) => {
            const used = usedGlobal(picker.phanId, picker.idx)
            const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
            if (pick) await ensureCache(picker.maDang, tblCua(picker.nhanh))
            const rows = (rowsByPhan[picker.phanId] ?? []).map((x, i) => (i === picker.idx ? { ...x, maCau: pick } : x))
            await luuPhan(picker.phanId, rows)
            setPicker(null)
          }} />
      )}
      {varPicker && (
        <KhoPicker maDangs={[varPicker.maDang]} cauTbl={tblCua(varPicker.nhanh)}
          selected={ch.etMaDe?.[varPicker.baseMaCau]?.[varPicker.v] ? [ch.etMaDe[varPicker.baseMaCau][varPicker.v]!] : []}
          disabled={[...usedMoiDe()]} onClose={() => setVarPicker(null)}
          onConfirm={async (m) => {
            const used = usedMoiDe()
            const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
            if (pick) {
              const list = await listCauByDang(varPicker.maDang, tblCua(varPicker.nhanh))
              setCau((prev) => ({ ...prev, ...Object.fromEntries(list.map((cc) => [cc.ma_cau, cc])) }))
              await setVar(varPicker.baseMaCau, varPicker.v, pick, varPicker.form)
            }
            setVarPicker(null)
          }} />
      )}
      {ganModal && d && <GanBuoiModal mtId={id} mon={d.mon} ganList={ganList} onClose={() => setGanModal(false)} onDone={async () => { setGanModal(false); await reload() }} />}
      {printing && <MTPrintView id={id} onClose={() => setPrinting(false)} />}
      {hinhPicker && d && (hinhL
        ? <HinhBaiPicker L={hinhL} khoi={d.khoi} onClose={() => setHinhPicker(null)} onPick={(pk) => { const { phanId, idx } = hinhPicker; setHinhPicker(null); pickHinh(phanId, idx, pk) }} />
        : <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40" onClick={() => setHinhPicker(null)}><div className="rounded-xl bg-white px-5 py-3 text-sm text-slate-600">Đang tải kho Hình khối {d.khoi}… (bấm lại sau giây lát)</div></div>)}
      {chiaDe && <ChiaDeMTModal {...chiaDe} onClose={() => setChiaDe(null)} />}
    </div>
  )
}

// ── GÁN VÀO BUỔI: CHỈ chọn lớp (cùng môn với MT) + ngày (Thùy 07-08: "giờ/GV/phòng thuộc về buổi
// học, MT không cần hỏi lại" — buổi mới (nếu chưa có) tự suy giờ/phòng từ TKB, xem tkbSlotCuaLop mt.ts) ──
function GanBuoiModal({ mtId, mon, ganList, onClose, onDone }: { mtId: string; mon: string; ganList: MTGanRow[]; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then((ls) => setLops(ls.filter((l) => l.mon === mon))) }, [mon])

  // Lớp này đã có 1 lượt gán (từ đúng MT này) rồi — gán ngày khác sẽ THAY THẾ (đè), cảnh báo trước.
  const daGan = lopId ? ganList.find((g) => g.lopId === lopId) : null
  const daySo = (s: string) => s.split('-').reverse().join('/')

  async function xacNhan() {
    if (!lopId || !ngay) return
    if (daGan && daGan.ngay !== ngay) {
      if (!confirm(`Lớp này đã gán MT vào ngày ${daySo(daGan.ngay)}. Gán ngày ${daySo(ngay)} sẽ THAY THẾ — bản gán ngày ${daySo(daGan.ngay)} bị xoá (buổi học ngày đó vẫn còn, chỉ mất nội dung MT). Tiếp tục?`)) return
    }
    setBusy(true)
    try {
      const kq = await ganMTVaoBuoi(mtId, { lopId, ngay })
      // ⭐ 07-12: doc mt_buoi vừa gán ĐỦ NỘI DUNG ngay (copy từ master) — enqueue link luôn.
      useStore.getState().enqueueLinkGen(kq.taiLieuId, 'mt_buoi')
      const loaiMsg = kq.soCauLoai > 0 ? ` (đã tự loại ${kq.soCauLoai} câu nâng cao — lớp này không đủ tư cách theo bậc dạng ở bản đồ kiến thức)` : ''
      const hinhMsg = kq.soBaiHinh > 0 ? ` Kèm ${kq.soBaiHinh} bài Hình (mô hình).` : ''
      setRes({ ok: true, msg: (kq.buoiMoi ? 'Đã tạo buổi mới + gán nội dung MT.' : 'Đã gán nội dung MT vào buổi có sẵn (lớp+ngày này đã có buổi).') + loaiMsg + hinhMsg + ' Chấm ở tab "🏆 MT" trong buổi (Buổi học/Việc của tôi).' })
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Gán MT vào buổi</p>
        {res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 flex justify-end gap-2">
              {res.ok && <button onClick={() => setRes(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Gán tiếp lớp khác</button>}
              <button onClick={onDone} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-slate-500">Chọn buổi học (lớp + ngày) để gán nội dung MT vào — MT là 1 tab của buổi đó (giống ET), không tách buổi riêng. Giờ/phòng/GV thuộc về buổi học, sửa ở đó nếu cần.</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp ({mon})</label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `Khối ${l.khoi}` : '' }))} /></div>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Ngày *</label>
            <BuoiNgaySelect lopId={lopId} value={ngay} onChange={setNgay} className={`${inp} mt-1 w-full`} defaultToday />
            {daGan && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-700">
                ⚠ Lớp này đã gán MT này vào <b>{daySo(daGan.ngay)}</b>{daGan.ngay !== ngay ? ' — chọn "Gán" sẽ THAY THẾ bản gán đó.' : '.'}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang gán…' : 'Gán'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════ CHIA ĐỀ THEO HS + IN CẢ LỚP ═══════════
// Thùy: "MT in TRƯỚC khi vào lớp — phải in theo DANH SÁCH LỚP" (khác ET in theo HS CÓ MẶT, vì ET in NGAY
// TRONG buổi, sau điểm danh — hsCoMatCuaBuoi đọc điểm danh CHƯA có lúc phát đề MT). Roster = TOÀN BỘ HS
// đang học của lớp (listHSCuaLop), không phụ thuộc điểm danh. Gán mã đề lưu vào cau_hinh.hsMaDe của BẢN
// mt_buoi (doc đã gán riêng cho lớp này), KHÔNG phải master (master dùng chung cho nhiều lớp khác nhau).
function ChiaDeMTModal({ taiLieuId, lopId, lopTen, onClose }: { taiLieuId: string; lopId: string; lopTen: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [phans, setPhans] = useState<PhanResolved[] | null>(null) // giữ để tính base (đủ 3 mã đề?)
  const [ch, setCh] = useState<CauHinh>({})
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [saved, setSaved] = useState(false)
  const [printing, setPrinting] = useState<{ id: string; ho_ten: string; maDe: number }[] | null>(null)
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  useEffect(() => {
    let alive = true
    setLoading(true)
    Promise.all([getTaiLieuFull(taiLieuId), listHSCuaLop(lopId)]).then(([f, hsl]) => {
      if (!alive) return
      setPhans(f.phans.filter((p) => p.loai_phan === 'custom'))
      setCh(f.taiLieu.cau_hinh ?? {})
      setRoster(
        hsl.map((x) => x.hoc_sinh).filter((h): h is HocSinh => !!h)
          .map((h) => ({ id: h.id, ho_ten: h.ho_ten, ma_hs: h.ma_hs }))
          .sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi')),
      )
    }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [taiLieuId, lopId])

  const base: BaseItem[] = (phans ?? []).flatMap((p) => p.caus.filter((c) => c.ma_cau && c.dang_chinh).map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau })))
  // ⭐ KHÔNG dùng maDeReady/maDeStale ở đây (Thùy báo "mỗi lần vào lại mất đề 2/3"): những hàm đó so
  // KHỚP TUYỆT ĐỐI base ↔ etMaDe, đúng cho MTEditor (base = TOÀN BỘ câu của MT master) nhưng SAI ở đây —
  // base của 1 lớp là TẬP CON (ganMTVaoBuoi LỌC BỚT câu nâng cao lớp không đủ bậc, xem mt.ts) trong khi
  // etMaDe copy NGUYÊN từ master nên còn THỪA key của câu đã bị lọc. maDeStale thấy "thừa key" tưởng lệch
  // → báo "chưa đủ 3 mã đề" dù dữ liệu vẫn nguyên ở MT gốc. Ở đây chỉ cần: mọi câu CÒN LẠI (sau lọc) có
  // đủ cặp đề 2/3 — không quan tâm etMaDe dư key của câu đã lọc.
  // MT chỉ có hàng Hình (base Đại rỗng) vẫn chia đề được (bản in tự dùng hinhMaDe, thiếu thì về bài gốc); có Đại
  // thì Đại phải đủ 3 mã đề như cũ. soMuc = mọi hàng (câu kho + hàng Hình) — đọc maCaus thô, không chỉ caus.
  const soMuc = (phans ?? []).flatMap((p) => p.maCaus).length
  const daiReady = base.length === 0 || (!!ch.etMaDe && oTrongMaDe(base, ch).length === 0)
  const deReady = phans != null && soMuc > 0 && daiReady

  async function save(next: CauHinh) { setCh(next); await updateTaiLieu(taiLieuId, { cau_hinh: next }); markSaved() }
  const setHsMa = (hsId: string, maDe: number) => save({ ...ch, hsMaDe: { ...(ch.hsMaDe ?? {}), [hsId]: maDe } })
  const raiTuDong = () => { const m: Record<string, number> = {}; roster.forEach((hs, i) => { m[hs.id] = (i % 3) + 1 }); save({ ...ch, hsMaDe: m }) }
  const inCaLop = () => setPrinting(roster.map((hs) => ({ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 })))

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[520px] max-w-full flex-col rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center gap-2">
          <p className="text-[15px] font-semibold text-slate-900">Chia đề — {lopTen}</p>
          {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        </div>
        <p className="mb-3 text-[12px] text-slate-500">In <b>TRƯỚC khi vào buổi</b>, theo danh sách CẢ LỚP (khác ET in theo HS điểm danh có mặt) — chưa điểm danh cũng chia đề được.</p>
        {loading ? <p className="text-[12px] italic text-slate-400">Đang tải…</p>
          : !deReady ? (
            <p className="text-[12px] italic text-amber-600">MT này chưa đủ 3 mã đề (còn ô trống hoặc chưa sinh) — mở MT, bấm "🎲 Sinh đề 2 &amp; 3" cho đủ trước khi chia đề.</p>
          ) : roster.length === 0 ? (
            <p className="text-[12px] italic text-slate-400">Lớp {lopTen} chưa có HS đang học.</p>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <button onClick={raiTuDong} className="rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 Rải tự động</button>
                <button onClick={inCaLop} className="ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-indigo-500">🖨 Xem &amp; In cả lớp</button>
              </div>
              <ol className="min-h-0 flex-1 space-y-1 overflow-auto">
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
                      <button onClick={() => setPrinting([{ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 }])} title="In riêng phiếu HS này" className="shrink-0 text-[13px] text-slate-400 hover:text-indigo-600">🖨</button>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-2 text-[11px] text-slate-400">Rải tự động = xoay vòng 1·2·3 theo thứ tự (HS cạnh nhau khác mã). Chưa gán tay HS nào → mặc định mã đề 1 lúc in.</p>
            </>
          )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
        </div>
      </div>
      {printing && <MTPrintView id={taiLieuId} perHS={printing} lopTen={lopTen} onClose={() => setPrinting(null)} />}
    </div>
  )
}

// ═══════════ CHỌN BÀI HÌNH CHO 1 HÀNG — 2 BƯỚC như ET/Builder (Thùy 02/09) ═══════════
// Bước 1: chọn MÔ HÌNH (chính + vệ tinh — y hệt popup "Chọn mô hình cho buổi này" của BuoiPickEditor, cùng
// maPhanCapMap/conCua). Bước 2: các chuỗi thuộc mô hình đã chọn (gom `chuoiKetNoi` như BuoiPickEditor), tìm theo
// mã/phát biểu; mỗi chuỗi "↻ Gợi ý" = bản ít dùng nhất (goiYChuoi) · "＋ Chọn…" = ChonChuoiPopup (đề chuẩn / lứa /
// biến thể / ý) — đúng 2 nút của ET Hình, chỉ khác là trả về ĐÚNG 1 bài cho 1 hàng rồi đóng. Mô hình đã chọn nhớ
// trong phiên (module-level) để hàng sau khỏi chọn lại — "✎ Đổi mô hình" quay về bước 1.
const moHinhDaChon: { khoi: string; mainIds: string[]; satIds: string[] } = { khoi: '', mainIds: [], satIds: [] }
function HinhBaiPicker({ L, khoi, onClose, onPick }: { L: Luoi; khoi: string; onClose: () => void; onPick: (p: PickItem) => void }) {
  const nho = moHinhDaChon.khoi === khoi
  const [mainIds, setMainIds] = useState<Set<string>>(new Set(nho ? moHinhDaChon.mainIds : []))
  const [satIds, setSatIds] = useState<Set<string>>(new Set(nho ? moHinhDaChon.satIds : []))
  const [buoc, setBuoc] = useState<1 | 2>(nho && moHinhDaChon.mainIds.length ? 2 : 1)
  const [q, setQ] = useState('')
  const [chon, setChon] = useState<BaiToan[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const maCap = useMemo(() => maPhanCapMap(L), [L])
  const moHinhSorted = useMemo(() => L.moHinh.slice().sort((a, b) => (maCap.get(a.id) ?? '').localeCompare(maCap.get(b.id) ?? '')), [L, maCap])
  // Vệ tinh của 1 mô hình chính = mô hình CON là LÁ (không có con) — cùng định nghĩa BuoiPickEditor 27/08.
  const vetinhCua = (id: string): MoHinh[] => {
    const seen = new Set<string>(); const out: MoHinh[] = []
    for (const cid of conCua(L, id)) { if (seen.has(cid)) continue; const m = L.moHinh.find((x) => x.id === cid); if (m && conCua(L, m.id).length === 0) { seen.add(cid); out.push(m) } }
    return out.sort((a, b) => a.ma.localeCompare(b.ma))
  }
  const toggleMain = (id: string) => setMainIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleSat = (id: string) => setSatIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const modelIds = useMemo(() => [...mainIds, ...satIds], [mainIds, satIds])
  const chuois = useMemo(() => {
    const nodes = (modelIds.length ? L.baiToan.filter((b) => modelIds.includes(b.mo_hinh_id)) : L.baiToan.slice()).sort((a, b) => a.cap - b.cap || a.ma.localeCompare(b.ma))
    const seen = new Set<string>(); const out: BaiToan[][] = []
    for (const n of nodes) { if (seen.has(n.id)) continue; const chain = chuoiKetNoi(L, n.id); chain.forEach((b) => seen.add(b.id)); out.push(chain) }
    return out
  }, [L, modelIds])
  const xongBuoc1 = () => { Object.assign(moHinhDaChon, { khoi, mainIds: [...mainIds], satIds: [...satIds] }); setBuoc(2) }
  const kw = q.trim().toLowerCase()
  const hien = chuois.filter((c) => !kw || c.some((b) => b.ma.toLowerCase().includes(kw) || (b.phat_bieu ?? '').toLowerCase().includes(kw)))
  const moHinhTen = (c: BaiToan[]) => { const deep = c.reduce((x, b) => (!x || b.cap > x.cap ? b : x), null as BaiToan | null); return L.moHinh.find((m) => m.id === deep?.mo_hinh_id)?.ten ?? '' }
  async function goiY(c: BaiToan[]) {
    setBusy(c[0].id)
    try { const [p] = await goiYChuoi(c, 'mt', 1); if (!p) { alert('Chuỗi này chưa có bản nào trong kho.'); return } onPick(p) }
    finally { setBusy(null) }
  }
  if (buoc === 1) return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-1 text-[15px] font-semibold text-slate-900">Bước 1 · Chọn mô hình · Khối {khoi}</h2>
        <p className="mb-3 text-[12.5px] leading-relaxed text-slate-500">Thu hẹp danh sách bài theo (các) mô hình chính — tick mô hình chính rồi tick thêm vệ tinh nếu cần. Nhớ cho các hàng sau.</p>
        <div className="max-h-[26rem] overflow-y-auto pr-0.5">
          {moHinhSorted.map((m) => {
            const daChon = mainIds.has(m.id)
            const conM = vetinhCua(m.id)
            return (
              <div key={m.id} className="mb-1">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-teal-200 bg-teal-50/40 px-2 py-1.5 text-[12px] text-slate-700 hover:bg-teal-50">
                  <input type="checkbox" checked={daChon} onChange={() => toggleMain(m.id)} />
                  <Ma>{maCap.get(m.id) ?? '?'}</Ma><span className="min-w-0 flex-1 truncate"><MathText>{tron(m.ten).slice(0, 42)}</MathText></span>
                </label>
                {daChon && (
                  <div className="ml-4 mt-0.5 border-l-2 border-indigo-100 pl-2">
                    {conM.length === 0
                      ? <div className="py-0.5 text-[11px] text-slate-400">— không có vệ tinh (lá) —</div>
                      : conM.map((v) => (
                        <label key={v.id} className="mb-0.5 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/40 px-2 py-1 text-[11.5px] text-slate-700 hover:bg-indigo-50">
                          <input type="checkbox" checked={satIds.has(v.id)} onChange={() => toggleSat(v.id)} />
                          <Ma>{maCap.get(v.id) ?? '?'}</Ma><span className="min-w-0 flex-1 truncate"><MathText>{v.ten}</MathText></span>
                        </label>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button onClick={() => { setMainIds(new Set()); setSatIds(new Set()); Object.assign(moHinhDaChon, { khoi, mainIds: [], satIds: [] }); setBuoc(2) }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-[12.5px] text-slate-500 hover:bg-slate-50">Bỏ qua, xem tất cả</button>
          <button onClick={xongBuoc1} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white">Tiếp → chọn bài{mainIds.size ? ` (${mainIds.size} mô hình)` : ''}</button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[10%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Bước 2 · Chọn bài Hình · Khối {khoi}</h3>
          <span className="text-[12px] text-slate-500">
            {mainIds.size ? <>Mô hình: <b className="text-slate-700">{[...mainIds].map((mid) => tron(L.moHinh.find((m) => m.id === mid)?.ten ?? '?')).join(', ')}</b></> : 'Tất cả chuỗi trong kho'} · <b>{chuois.length}</b> chuỗi
          </span>
          <button onClick={() => setBuoc(1)} className="rounded border border-indigo-300 px-1.5 py-0.5 text-[11px] text-indigo-600 hover:bg-indigo-50">✎ Đổi mô hình</button>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã / phát biểu…" className="ml-2 h-8 w-64 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" autoFocus />
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {hien.length === 0 ? <p className="text-sm text-slate-400">Không có chuỗi nào khớp{mainIds.size ? ' trong mô hình đã chọn — bấm ✎ Đổi mô hình' : ''}.</p> : (
            <div className="space-y-1.5">
              {hien.map((c) => (
                <div key={c[0].id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-sky-700">{moHinhTen(c)} <span className="font-mono font-normal text-slate-500">· {c.map((b) => b.ma).join(' → ')}</span></div>
                    <div className="truncate text-[13px] text-slate-700"><MathText>{c[c.length - 1]?.phat_bieu ?? ''}</MathText></div>
                  </div>
                  <button onClick={() => goiY(c)} disabled={busy === c[0].id} className="shrink-0 rounded-md bg-indigo-50 px-2.5 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50">{busy === c[0].id ? '…' : '↻ Gợi ý'}</button>
                  <button onClick={() => setChon(c)} className="shrink-0 rounded-md border border-slate-300 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">＋ Chọn…</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {chon && <ChonChuoiPopup L={L} phan="mt" chuoi={chon} onClose={() => setChon(null)} onConfirm={(ban, nodeIds) => { setChon(null); onPick({ key: crypto.randomUUID(), phan: 'mt', nodeIds, ...ban } as PickItem) }} />}
    </div>
  )
}
