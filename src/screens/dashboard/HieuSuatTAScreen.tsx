// Dashboard "Chất lượng vận hành" (leaf `db_chatluong`) — bản MỚI, CEO chốt 08/10 (spec-hieu-suat-ta.md).
// Bản cũ (ChatLuongVanHanhScreen: CL − (100 − TĐ), leader chấm CL tay, toán ở JS) đã outdate — file còn
// đó để đối chiếu, không còn gắn vào menu.
// Hiện làm TRỢ GIẢNG trước: Chấm BTVN 50% · Chấm ET 15% · Bổ trợ 35%.
//   · Task BTVN/ET = 100 − trừ tiến độ (lần đóng đầu) − 15 × gậy chất lượng. Mọi số tính ở fn_hsta_*.
//   · Bổ trợ: hệ thống CHƯA đo giờ chính xác ⇒ chỉ hiện đủ số liệu từng ca, quản lý nhập điểm tay.
//   · Mỗi ô: hệ thống ĐỀ XUẤT + quản lý CHỐT; "Ghi thêm" cho việc ngoài hệ thống.
// Sau mutation KHÔNG reload cả bảng (CLAUDE.md §2): vá đúng dòng TA đó, refetch nền 1 dòng.
// Rời màn rồi quay lại = đúng chỗ cũ: cache module-level NHO (sống tới F5), nút ↻ ép quét lại.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  layBangThang, layDongThang, layTask, layCaBoTro, chot, layGhiThem, themGhiThem, xoaGhiThem,
  TEN_DAU_VIEC, TEN_LOAI_CA, TEN_CO,
  type HstaThang, type HstaTask, type HstaCa, type GhiThem, type DauViec, type DauViecGhiThem, type ChotO,
} from '../../lib/hieusuat_ta'
import { homNayVN } from '../../lib/tuan'

// ── Kỳ (tháng) ──
const kyNay = () => homNayVN().slice(0, 7)
const kyCong = (ky: string, d: number) => { const [y, m] = ky.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1 + d, 1)); return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}` }
const kyTuDen = (ky: string) => { const [y, m] = ky.split('-').map(Number); const cuoi = new Date(Date.UTC(y, m, 0)).getUTCDate(); return { tu: `${ky}-01`, den: `${ky}-${String(cuoi).padStart(2, '0')}` } }
const kyNhan = (ky: string) => `Tháng ${Number(ky.slice(5))}/${ky.slice(0, 4)}`

// ── Định dạng ──
const fmtTs = (iso: string | null) => iso ? new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'
const fmtNgay = (ymd: string) => `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}`
const fmtGio = (t: string | null) => t ? t.slice(0, 5) : '?'
const fmtSo = (v: number | null | undefined, le = 1) => v == null ? '—' : Number(v).toFixed(le).replace(/\.0+$/, '')
const mauDiem = (v: number | null | undefined) => v == null ? 'text-slate-300' : v >= 90 ? 'text-emerald-600' : v >= 75 ? 'text-amber-600' : 'text-rose-600'

// ── Nhớ khi rời màn ──
const NHO: {
  ky: string
  bang: Map<string, HstaThang[]>
  nsId: string | null
  scrollTop: number
  chiTiet: Map<string, { task: HstaTask[]; ca: HstaCa[]; ghi: GhiThem[] }>   // key = ky|ns
} = { ky: '', bang: new Map(), nsId: null, scrollTop: 0, chiTiet: new Map() }

export default function HieuSuatTAScreen() {
  const [ky, setKyS] = useState(NHO.ky || kyNay())
  const [rows, setRows] = useState<HstaThang[]>(NHO.bang.get(ky) ?? [])
  const [loading, setLoading] = useState(!NHO.bang.has(ky))
  const [err, setErr] = useState<string | null>(null)
  const [nsId, setNsIdS] = useState<string | null>(NHO.nsId)
  const scrollRef = useRef<HTMLDivElement>(null)

  const setKy = (k: string) => { NHO.ky = k; setKyS(k) }
  const setNsId = (id: string | null) => { NHO.nsId = id; setNsIdS(id) }

  async function quet(k: string, ep = false) {
    if (!ep && NHO.bang.has(k)) { setRows(NHO.bang.get(k)!); setLoading(false); return }
    if (ep) for (const key of [...NHO.chiTiet.keys()]) if (key.startsWith(k + '|')) NHO.chiTiet.delete(key)
    setErr(null)
    if (!NHO.bang.has(k)) { setRows([]); setLoading(true) }
    try { const r = await layBangThang(`${k}-01`); NHO.bang.set(k, r); setRows(r) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { quet(ky) }, [ky])
  useEffect(() => { if (scrollRef.current && NHO.scrollTop) scrollRef.current.scrollTop = NHO.scrollTop }, [loading])

  // vá 1 dòng TA (sau chốt / ghi thêm) — không đụng các dòng khác
  function vaDong(d: HstaThang) {
    setRows((prev) => { const next = prev.map((r) => r.nhan_su_id === d.nhan_su_id ? d : r); NHO.bang.set(ky, next); return next })
  }

  const dang = rows.find((r) => r.nhan_su_id === nsId) ?? null
  const kyNext = kyCong(ky, 1)

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-1 text-sm font-semibold text-slate-900">Chất lượng vận hành</span>
        <span className="rounded-md bg-indigo-600 px-3 py-1 text-[13px] font-semibold text-white">Trợ giảng</span>
        <span className="mx-2 h-5 w-px bg-slate-200" />
        <button onClick={() => setKy(kyCong(ky, -1))} className="rounded-lg border border-slate-300 px-2 py-1 text-slate-500 hover:border-indigo-400">‹</button>
        <span className="min-w-[110px] text-center text-[13px] font-semibold text-slate-700">{kyNhan(ky)}</span>
        <button disabled={kyNext > kyNay()} onClick={() => setKy(kyNext)} className="rounded-lg border border-slate-300 px-2 py-1 text-slate-500 hover:border-indigo-400 disabled:opacity-30">›</button>
        <button onClick={() => quet(ky, true)} title="Quét lại" className="ml-1 rounded-lg border border-slate-300 px-2 py-1 text-[13px] text-slate-500 hover:border-indigo-400">↻</button>
        <span className="ml-auto text-[11.5px] text-slate-400">BTVN 50% · ET 15% · Bổ trợ 35% — task = 100 − trễ (lần đóng đầu) − 15/gậy chất lượng</span>
      </div>
      <div ref={scrollRef} onScroll={(e) => { NHO.scrollTop = e.currentTarget.scrollTop }} className="min-h-0 flex-1 overflow-auto p-6">
        {err && <div className="mx-auto mb-3 max-w-[1200px] rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : <BangTA rows={rows} nsId={nsId} onChon={setNsId} />}
      </div>
      {dang && createPortal(
        <ChiTietTA key={ky + dang.nhan_su_id} ky={ky} row={dang} onDong={() => setNsId(null)} onVaDong={vaDong} />,
        document.body,
      )}
    </div>
  )
}

// ── Bảng tổng: 1 dòng / TA ──
function OChot({ deXuat, o, donVi = '' }: { deXuat: number | null; o?: ChotO; donVi?: string }) {
  return (
    <div className="leading-tight">
      <div className={`text-[15px] font-bold tabular-nums ${mauDiem(o ? o.diem_chot : deXuat)}`}>{o ? fmtSo(o.diem_chot) : deXuat == null ? '—' : fmtSo(deXuat)}{donVi}</div>
      <div className="text-[10.5px] text-slate-400">{o ? <span className="font-semibold text-emerald-600">✓ đã chốt{deXuat != null ? ` · HT ${fmtSo(deXuat)}` : ''}</span> : deXuat == null ? 'chưa có' : 'đề xuất'}</div>
    </div>
  )
}
function BangTA({ rows, nsId, onChon }: { rows: HstaThang[]; nsId: string | null; onChon: (id: string) => void }) {
  const th = 'sticky top-0 z-10 border-b border-slate-100 bg-white px-3 py-2 text-left text-[11px] font-medium text-slate-400'
  return (
    <div className="mx-auto max-w-[1200px] overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-[13px]">
        <thead><tr>
          <th className={th}>Trợ giảng</th>
          <th className={th}>Chấm BTVN · 50%</th>
          <th className={th}>Chấm ET · 15%</th>
          <th className={th}>Bổ trợ · 35%</th>
          <th className={th}>Tổng</th>
          <th className={th}>Ghi thêm</th>
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.nhan_su_id} onClick={() => onChon(r.nhan_su_id)}
              className={`cursor-pointer border-b border-slate-50 last:border-0 hover:bg-indigo-50/40 ${r.nhan_su_id === nsId ? 'bg-indigo-50/60' : ''}`}>
              <td className="px-3 py-2.5 font-medium text-slate-800">{r.ho_ten}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-3"><OChot deXuat={r.btvn_de_xuat} o={r.chot.btvn} />
                  <SoTask n={r.btvn_so_task} tinh={r.btvn_so_tinh} co={r.btvn_so_co} /></div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-3"><OChot deXuat={r.et_de_xuat} o={r.chot.et} />
                  <SoTask n={r.et_so_task} tinh={r.et_so_tinh} co={r.et_so_co} /></div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-3"><OChot deXuat={null} o={r.chot.bo_tro} />
                  <div className="text-[11px] leading-tight text-slate-500">
                    <div><b className="text-slate-700">{fmtSo(r.bt_gio_he_thong)}h</b>{r.bt_gio_ghi_them > 0 ? <> + {fmtSo(r.bt_gio_ghi_them)}h ghi thêm</> : null} / {fmtSo(r.bt_chi_tieu_gio)}h</div>
                    <div>{r.bt_so_ca} ca{r.bt_so_co > 0 ? <span className="text-amber-600"> · {r.bt_so_co} cờ</span> : null}</div>
                  </div></div>
              </td>
              <td className="px-3 py-2.5">
                <OChot deXuat={r.tong_de_xuat} o={r.chot.tong} />
                {!r.chot.tong && r.tong_de_xuat != null && !r.tong_du_3_dau_viec && <div className="text-[10px] text-amber-600">tạm — thiếu đầu việc</div>}
              </td>
              <td className="px-3 py-2.5 text-[12px] text-slate-500">{r.so_ghi_them || ''}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Không có trợ giảng nào có việc trong tháng này.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
function SoTask({ n, tinh, co }: { n: number; tinh: number; co: number }) {
  return (
    <div className="text-[11px] leading-tight text-slate-500">
      <div>{tinh}/{n} task tính</div>
      {co > 0 && <div className="text-amber-600">{co} cần xem</div>}
    </div>
  )
}

// ── Chi tiết 1 TA (panel phải) ──
function ChiTietTA({ ky, row, onDong, onVaDong }: { ky: string; row: HstaThang; onDong: () => void; onVaDong: (d: HstaThang) => void }) {
  const k = `${ky}|${row.nhan_su_id}`
  const cached = NHO.chiTiet.get(k)
  const [task, setTask] = useState<HstaTask[]>(cached?.task ?? [])
  const [ca, setCa] = useState<HstaCa[]>(cached?.ca ?? [])
  const [ghi, setGhi] = useState<GhiThem[]>(cached?.ghi ?? [])
  const [loading, setLoading] = useState(!cached)
  const [err, setErr] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const kyDate = `${ky}-01`

  useEffect(() => {
    if (cached) return
    const { tu, den } = kyTuDen(ky)
    Promise.all([layTask(tu, den, row.nhan_su_id), layCaBoTro(tu, den, row.nhan_su_id), layGhiThem(row.nhan_su_id, kyDate)])
      .then(([t, c, g]) => { setTask(t); setCa(c); setGhi(g); NHO.chiTiet.set(k, { task: t, ca: c, ghi: g }) })
      .catch((e) => setErr(e?.message ?? String(e))).finally(() => setLoading(false))
  }, [k])
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 2200); return () => clearTimeout(t) }, [flash])

  function nhoGhi(g: GhiThem[]) { setGhi(g); const c = NHO.chiTiet.get(k); if (c) NHO.chiTiet.set(k, { ...c, ghi: g }) }
  // số tổng/giờ ghi thêm do server tính — vá ngay phần chắc chắn, rồi lấy lại ĐÚNG 1 dòng ở nền
  async function lamMoiDong(vaTruoc?: (r: HstaThang) => HstaThang) {
    if (vaTruoc) onVaDong(vaTruoc(row))
    try { const d = await layDongThang(kyDate, row.nhan_su_id); if (d) onVaDong(d) } catch { /* giữ bản đã vá */ }
  }

  async function onChot(dv: DauViec, diem: number | null, ghiChu: string) {
    setErr(null)
    try {
      const o = await chot(row.nhan_su_id, kyDate, dv, diem, ghiChu)
      await lamMoiDong((r) => { const c = { ...r.chot }; if (o) c[dv] = o; else delete c[dv]; return { ...r, chot: c } })
      setFlash(o ? `Đã chốt ${TEN_DAU_VIEC[dv]}: ${fmtSo(o.diem_chot)}` : `Đã bỏ chốt ${TEN_DAU_VIEC[dv]}`)
    } catch (e: any) { setErr(e?.message ?? String(e)) }
  }
  async function onThem(dv: DauViecGhiThem, noiDung: string, soGio: number | null) {
    setErr(null)
    try { const g = await themGhiThem(row.nhan_su_id, kyDate, dv, noiDung, soGio); nhoGhi([...ghi, g]); setFlash('Đã ghi thêm'); await lamMoiDong() }
    catch (e: any) { setErr(e?.message ?? String(e)); throw e }
  }
  async function onXoa(id: string) {
    setErr(null)
    try { await xoaGhiThem(id); nhoGhi(ghi.filter((g) => g.id !== id)); await lamMoiDong() }
    catch (e: any) { setErr(e?.message ?? String(e)) }
  }

  const btvn = task.filter((t) => t.dau_viec === 'btvn')
  const et = task.filter((t) => t.dau_viec === 'et')

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25" onClick={onDong}>
      <div className="h-full w-[min(1180px,96vw)] overflow-y-auto bg-[#f5f5f7] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <div className="text-[15px] font-semibold text-slate-900">{row.ho_ten}</div>
            <div className="text-[11.5px] text-slate-500">{kyNhan(ky)} · trợ giảng</div>
          </div>
          {flash && <span className="rounded-lg bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700">{flash}</span>}
          <button onClick={onDong} className="ml-auto rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">✕</button>
        </div>
        <div className="space-y-4 p-5">
          {err && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
          <KhoiChot row={row} onChot={onChot} />
          {loading ? <p className="text-sm text-slate-400">Đang tải chi tiết…</p> : (
            <>
              <KhoiTask tieuDe="Chấm BTVN" ds={btvn} loai="btvn" deXuat={row.btvn_de_xuat} />
              <KhoiTask tieuDe="Chấm ET" ds={et} loai="et" deXuat={row.et_de_xuat} />
              <KhoiBoTro ds={ca} row={row} />
              <KhoiGhiThem ds={ghi} onThem={onThem} onXoa={onXoa} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Chốt: 4 ô (BTVN · ET · Bổ trợ · Tổng) ──
function KhoiChot({ row, onChot }: { row: HstaThang; onChot: (dv: DauViec, diem: number | null, ghiChu: string) => Promise<void> }) {
  const o: { dv: DauViec; deXuat: number | null; phu: string }[] = [
    { dv: 'btvn', deXuat: row.btvn_de_xuat, phu: `${row.btvn_so_tinh}/${row.btvn_so_task} task tính` },
    { dv: 'et', deXuat: row.et_de_xuat, phu: `${row.et_so_tinh}/${row.et_so_task} task tính` },
    { dv: 'bo_tro', deXuat: null, phu: `${fmtSo(row.bt_gio_he_thong)}h hệ thống${row.bt_gio_ghi_them > 0 ? ` + ${fmtSo(row.bt_gio_ghi_them)}h ghi thêm` : ''} / ${fmtSo(row.bt_chi_tieu_gio)}h · nhập tay` },
    { dv: 'tong', deXuat: row.tong_de_xuat, phu: row.tong_du_3_dau_viec ? 'đủ 3 đầu việc' : 'tạm — thiếu đầu việc chưa có số' },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {o.map((x) => <OChotSua key={x.dv + (row.chot[x.dv]?.chot_at ?? '')} dv={x.dv} deXuat={x.deXuat} phu={x.phu} o={row.chot[x.dv]} onChot={onChot} />)}
    </div>
  )
}
function OChotSua({ dv, deXuat, phu, o, onChot }: { dv: DauViec; deXuat: number | null; phu: string; o?: ChotO; onChot: (dv: DauViec, diem: number | null, ghiChu: string) => Promise<void> }) {
  const [diem, setDiem] = useState(o ? String(o.diem_chot) : '')
  const [ghiChu, setGhiChu] = useState(o?.ghi_chu ?? '')
  const [busy, setBusy] = useState(false)
  const so = diem.trim() === '' ? null : Number(diem)
  const hopLe = so != null && !Number.isNaN(so) && so >= 0 && so <= 100
  async function bam(v: number | null) { setBusy(true); try { await onChot(dv, v, ghiChu) } finally { setBusy(false) } }
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className={`px-4 py-2 text-[13px] font-semibold text-white ${dv === 'tong' ? 'bg-indigo-600' : 'bg-slate-700'}`}>{TEN_DAU_VIEC[dv]}{dv !== 'tong' ? '' : ' hiệu suất'}</div>
      <div className="space-y-2 p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-slate-400">Hệ thống</span>
          <span className={`text-[22px] font-bold tabular-nums ${mauDiem(deXuat)}`}>{deXuat == null ? '—' : fmtSo(deXuat)}</span>
        </div>
        <div className="text-[11px] text-slate-500">{phu}</div>
        <div className="flex items-center gap-1.5">
          <input value={diem} onChange={(e) => setDiem(e.target.value)} inputMode="decimal" placeholder="Điểm chốt"
            className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
          {deXuat != null && <button type="button" onClick={() => setDiem(String(deXuat))} className="rounded-md px-2 py-1 text-[11px] text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50">= đề xuất</button>}
        </div>
        <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (vì sao khác đề xuất…)"
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[12px] outline-none focus:border-indigo-400" />
        <div className="flex items-center gap-2">
          <button disabled={busy || !hopLe} onClick={() => bam(so)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40">{busy ? '…' : o ? 'Lưu lại' : 'Chốt'}</button>
          {o && <button disabled={busy} onClick={() => bam(null)} className="text-[11.5px] text-slate-400 hover:text-rose-600">Bỏ chốt</button>}
        </div>
        {o && <div className="text-[10.5px] text-emerald-700">✓ {o.nguoi_chot ?? '?'} chốt {fmtTs(o.chot_at)}</div>}
      </div>
    </div>
  )
}

// ── Bảng task BTVN / ET ──
function Co({ ds }: { ds: string[] }) {
  return <div className="flex flex-wrap gap-1">{ds.map((c) => <span key={c} className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-medium text-amber-700 ring-1 ring-amber-200">{TEN_CO[c] ?? c}</span>)}</div>
}
function KhoiTask({ tieuDe, ds, loai, deXuat }: { tieuDe: string; ds: HstaTask[]; loai: 'btvn' | 'et'; deXuat: number | null }) {
  const th = 'border-b border-slate-100 px-2 py-1.5 text-left text-[10.5px] font-medium text-slate-400'
  const td = 'px-2 py-1.5 align-top'
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 text-[13px] font-semibold text-white">
        {tieuDe} <span className="font-normal text-slate-300">· {ds.length} task · trung bình {deXuat == null ? '—' : fmtSo(deXuat)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr>
            <th className={th}>Ngày</th><th className={th}>Lớp</th><th className={th}>Hạn</th><th className={th}>Đóng lần đầu</th>
            <th className={th}>Trễ</th><th className={th}>−Tiến độ</th><th className={th}>Gậy CL</th><th className={th}>Điểm</th>
            <th className={th}>{loai === 'btvn' ? 'Dữ liệu: nộp đúng hạn / muộn / không làm / phép' : 'Dữ liệu: ô đã chấm / ô cần'}</th><th className={th}>Cần xem</th>
          </tr></thead>
          <tbody>
            {ds.map((t) => (
              <tr key={t.buoi_id} className={`border-b border-slate-50 last:border-0 ${t.tinh ? '' : 'bg-slate-50 text-slate-400'}`}>
                <td className={td}>{fmtNgay(t.ngay)}</td>
                <td className={td}>{t.ten_lop}</td>
                <td className={td}>{fmtTs(t.han)}</td>
                <td className={td}>{fmtTs(t.dong_dau)}{t.so_mo_lai > 0 && <div className="text-[10.5px] text-slate-400">mở lại {t.so_mo_lai} lần · cuối {fmtTs(t.dong_cuoi)}</div>}</td>
                <td className={td}>{t.tre_gio > 0 ? `${fmtSo(t.tre_gio)}h` : 'đúng hạn'}</td>
                <td className={td}>{t.tru_tien_do ? `−${t.tru_tien_do}` : '0'}</td>
                <td className={td}>{t.gay_chat_luong ? `${t.gay_chat_luong} (−${t.tru_chat_luong})` : '0'}{t.gay_tre > 0 && <div className="text-[10.5px] text-slate-400">+{t.gay_tre} gậy trễ (không trừ)</div>}</td>
                <td className={`${td} font-bold tabular-nums ${mauDiem(t.diem)}`}>{t.tinh ? fmtSo(t.diem) : <span className="text-[11px] font-normal text-slate-400">không tính</span>}</td>
                <td className={td}>
                  {loai === 'btvn' ? (
                    t.so_kq ? <>
                      <b className="text-slate-700">{t.nop_dung_han}</b>/{t.so_kq} đúng hạn ({fmtSo(t.pct_dung_han, 0)}%) · {t.nop_muon} muộn · {t.khong_lam} không làm · {t.xin_phep} phép
                      {t.pct_dung_han_lop_khac != null && <div className="text-[10.5px] text-slate-400">các em này ở lớp khác: {fmtSo(t.pct_dung_han_lop_khac, 0)}% đúng hạn</div>}
                    </> : <span className="text-slate-400">{t.so_co_mat} HS có mặt · chưa có kết quả</span>
                  ) : (
                    t.o_can ? <><b className="text-slate-700">{t.o_cham}</b>/{t.o_can} ô ({fmtSo(t.pct_o_cham, 0)}%) · {t.so_cau} câu · {t.so_co_mat} HS</> : <span className="text-slate-400">{t.so_cau} câu · {t.so_co_mat} HS có mặt</span>
                  )}
                </td>
                <td className={td}>
                  {!t.tinh && t.ly_do_khong_tinh && <div className="mb-1 text-[11px] text-slate-500">{t.ly_do_khong_tinh}</div>}
                  <Co ds={t.co} />
                </td>
              </tr>
            ))}
            {!ds.length && <tr><td colSpan={10} className="px-4 py-6 text-center text-slate-400">Không có task.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Bổ trợ: từng ca, đủ thông số (KHÔNG chấm điểm) ──
function KhoiBoTro({ ds, row }: { ds: HstaCa[]; row: HstaThang }) {
  const th = 'border-b border-slate-100 px-2 py-1.5 text-left text-[10.5px] font-medium text-slate-400'
  const td = 'px-2 py-1.5 align-top'
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 bg-slate-700 px-4 py-2 text-[13px] font-semibold text-white">
        Bổ trợ <span className="font-normal text-slate-300">· {row.bt_so_ca} ca có HS · {fmtSo(row.bt_gio_he_thong)}h theo hệ thống (đã gộp ca chung giờ){row.bt_gio_ghi_them > 0 ? ` + ${fmtSo(row.bt_gio_ghi_them)}h ghi thêm` : ''} / chỉ tiêu {fmtSo(row.bt_chi_tieu_gio)}h</span>
      </div>
      <div className="px-4 pt-2 text-[11px] text-amber-700">Giờ trên hệ thống chưa chính xác (giờ nhập tay có thể sai) — số giờ chỉ để tham khảo, điểm bổ trợ do quản lý chốt.</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr>
            <th className={th}>Ngày</th><th className={th}>Giờ</th><th className={th}>Phút</th><th className={th}>Loại</th><th className={th}>Học sinh có mặt</th>
            <th className={th}>Vắng</th><th className={th}>Lớp gốc (bù)</th><th className={th}>Bài đầu tiên</th><th className={th}>Đánh giá xong</th><th className={th}>Gậy</th><th className={th}>Cần xem</th>
          </tr></thead>
          <tbody>
            {ds.map((c) => (
              <tr key={c.buoi_id} className={`border-b border-slate-50 last:border-0 ${c.so_co_mat ? '' : 'bg-slate-50 text-slate-400'}`}>
                <td className={td}>{fmtNgay(c.ngay)}</td>
                <td className={td}>{fmtGio(c.gio_bat_dau)}–{fmtGio(c.gio_ket_thuc)}</td>
                <td className={td}>{c.so_phut ?? '—'}</td>
                <td className={td}>{TEN_LOAI_CA[c.loai]}</td>
                <td className={td}>{c.hoc_sinh.length ? c.hoc_sinh.join(', ') : '—'}</td>
                <td className={td}>{c.so_vang || ''}</td>
                <td className={td}>{c.lop_goc ?? ''}</td>
                <td className={td}>{fmtTs(c.bai_dau_at)}</td>
                <td className={td}>{fmtTs(c.danh_gia_xong_at)}</td>
                <td className={td}>{c.so_gay || ''}</td>
                <td className={td}><Co ds={c.co} /></td>
              </tr>
            ))}
            {!ds.length && <tr><td colSpan={11} className="px-4 py-6 text-center text-slate-400">Không có ca bổ trợ nào trong tháng.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Ghi thêm: việc ngoài hệ thống ──
function KhoiGhiThem({ ds, onThem, onXoa }: { ds: GhiThem[]; onThem: (dv: DauViecGhiThem, noiDung: string, soGio: number | null) => Promise<void>; onXoa: (id: string) => Promise<void> }) {
  const [dv, setDv] = useState<DauViecGhiThem>('bo_tro')
  const [noiDung, setNoiDung] = useState('')
  const [gio, setGio] = useState('')
  const [busy, setBusy] = useState(false)
  const soGio = gio.trim() === '' ? null : Number(gio)
  const hopLe = noiDung.trim().length > 0 && (soGio == null || (!Number.isNaN(soGio) && soGio > 0))
  async function luu() {
    setBusy(true)
    try { await onThem(dv, noiDung, soGio); setNoiDung(''); setGio('') } catch { /* lỗi đã hiện ở trên */ } finally { setBusy(false) }
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="bg-slate-700 px-4 py-2 text-[13px] font-semibold text-white">Ghi thêm <span className="font-normal text-slate-300">· việc ngoài hệ thống — căn cứ để chốt, không tự cộng/trừ điểm</span></div>
      <div className="space-y-2 p-4">
        {ds.map((g) => (
          <div key={g.id} className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px]">
            <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">{TEN_DAU_VIEC[g.dau_viec]}</span>
            <div className="min-w-0 flex-1">
              <div className="whitespace-pre-wrap text-slate-800">{g.noi_dung}{g.so_gio != null && <b className="ml-1 text-indigo-600">· {fmtSo(g.so_gio)}h</b>}</div>
              <div className="text-[10.5px] text-slate-400">{g.nguoi_ghi ?? '?'} · {fmtTs(g.created_at)}</div>
            </div>
            <button onClick={() => onXoa(g.id)} className="shrink-0 text-[11px] text-slate-400 hover:text-rose-600">Xoá</button>
          </div>
        ))}
        <div className="flex flex-wrap items-start gap-2 border-t border-slate-100 pt-3">
          <select value={dv} onChange={(e) => setDv(e.target.value as DauViecGhiThem)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-[12.5px]">
            <option value="bo_tro">Bổ trợ</option><option value="btvn">Chấm BTVN</option><option value="et">Chấm ET</option><option value="khac">Khác</option>
          </select>
          <textarea value={noiDung} onChange={(e) => setNoiDung(e.target.value)} rows={1} placeholder="Nội dung (vd: ca bổ trợ 25/09 18h–19h không có trên hệ thống)"
            className="min-w-[280px] flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-[12.5px] outline-none focus:border-indigo-400" />
          <input value={gio} onChange={(e) => setGio(e.target.value)} inputMode="decimal" placeholder="Số giờ (nếu có)"
            className="w-32 rounded-lg border border-slate-300 px-2 py-1.5 text-[12.5px] outline-none focus:border-indigo-400" />
          <button disabled={busy || !hopLe} onClick={luu} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40">{busy ? '…' : 'Ghi'}</button>
        </div>
      </div>
    </div>
  )
}
