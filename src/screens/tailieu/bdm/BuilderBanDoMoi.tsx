// BUILDER GIÁO TRÌNH THEO BẢN ĐỒ MỚI (spec-builder-ban-do-moi.md · CEO chốt 17/10).
// Buổi → NHÓM bài (chọn cả nhóm hoặc dạng bài lẻ từ nhiều nhóm) → DẠNG BÀI (lý thuyết · ví dụ · bài luyện) · BTVN theo NHÓM.
// Không còn chuyên đề trong thẻ buổi / bản in (A3). Khung giống builder cũ: thanh trên · cây trái · thẻ buổi · tự lưu.
// Mọi đặt buổi / gợi ý câu ở DB (fn_tl_bdm_*); sau mỗi thao tác VÁ đúng buổi/phần đó tại chỗ, không tải lại cả giáo trình.
// In / xem trước: PrintView chung (tự nhận ban_do='moi', in theo A3). Gán lớp + BTVN/ôn tập: GanLopBdm (riêng, không
// dùng TrichPanel/OnTapConfirmScreen của builder cũ).
import { useEffect, useState } from 'react'
import { addBuoi, listBuoiTaiLieu, updatePhan, updateTaiLieu, fetchCausCuaTaiLieu, DEFAULT_BTVN_LINES, type CauHinh } from '../../../lib/tailieu'
import {
  noiDung, datBuoi, datCau, goiY, datCoPhan, xoaBuoi, cauCuaBuoi, loiDoc, SO_LUYEN_MAC_DINH, SO_BTVN_MAC_DINH,
  type NoiDung, type NdBuoi, type NdNhom, type ChonBuoi,
} from '../../../lib/tailieuBdm'
import { LOAI_CAU, type CauHoi } from '../../../lib/kho/api'
import type { CheDoHinh } from '../../../lib/kho/hinhGiaoTrinh'
import { MathText, inp } from '../../kho/ui'
import { AnhMmEditCtx } from '../anhMmCtx'
import { ColSel, MaCau, AnhXem, AnhMmCtl, CheDoHinhBtn, ApplyLinesAll, MAU_PRESET } from '../TaiLieuBuilder'
import BoChonNhom from './BoChonNhom'
import ChonCauBdm from './ChonCauBdm'
import PrintView from '../PrintView'
import GanLopBdm from './GanLopBdm'
import { useStore } from '../../../store/useStore'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const filterKey = (id: string) => `tlb_buoi_${id}`   // buổi đang soạn — tiện ích riêng mỗi máy (như builder cũ)
const chonCuaBuoi = (b: NdBuoi): ChonBuoi => b.nhom.map((n) => ({ nhom: n.id, dang_bai: n.dang_bai.map((d) => d.id) }))

// Phần đang mở popup chọn câu
type MoChonCau = { buoi: NdBuoi; nhom: NdNhom; phanId: string; caus: string[]; uuTien: string | null }

// laChuyenDe (Thùy 21/10): tài liệu CHUYÊN ĐỀ — cùng builder, KHÔNG đi với lớp (ẩn Gán lớp), đơn vị gọi là "Phần" thay "Buổi".
export default function BuilderBanDoMoi({ id, onClose, laChuyenDe = false }: { id: string; onClose: () => void; laChuyenDe?: boolean }) {
  const NHAN = laChuyenDe ? 'Phần' : 'Buổi', nhan = NHAN.toLowerCase()
  const [nd, setNd] = useState<NoiDung | null>(null)
  const [cauMap, setCauMap] = useState<Map<string, CauHoi>>(new Map())
  const [ten, setTen] = useState('')
  const [ch, setCh] = useState<CauHinh>({})
  const [buoiList, setBuoiList] = useState<{ id: string; tieu_de: string | null; thu_tu: number }[]>([])
  const [filterBuoi, setFilterBuoi] = useState<string>('all')
  const [err, setErr] = useState<string | null>(null)
  const [bao, setBao] = useState<string | null>(null)      // lỗi thao tác (không chặn màn)
  const [saved, setSaved] = useState(false)
  const [boChon, setBoChon] = useState<NdBuoi | null>(null)
  const [chonCau, setChonCau] = useState<MoChonCau | null>(null)
  const [inAll, setInAll] = useState(false)                 // 🖨 Xem / Xuất PDF cả giáo trình
  const [xemBuoi, setXemBuoi] = useState<string | null>(null) // 👁 Xem nhanh bản in 1 buổi
  const [ganLop, setGanLop] = useState(false)                  // ⬇ Gán lớp (trích buổi → tài liệu của lớp)
  const markSaved = () => setSaved(true)
  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t) }, [saved])

  const tl = nd ? { mon: nd.tai_lieu.mon, nhanh: nd.tai_lieu.nhanh, cau_hinh: ch } : null
  const nhanhBdm = nd?.tai_lieu.nhanh === 'hinh_gt' ? 'hgt' : 'toan'   // nhánh bản đồ mới của tài liệu (chuyên đề HGT)
  const chiXem = !!nd?.tai_lieu.luu_tru_tu   // bản lưu trữ: chỉ xem (DB cũng chặn ghi)

  // Nạp nội dung câu còn thiếu (theo mã) — chỉ đọc, không tính gì.
  async function napCau(n: NoiDung | { buoi: NdBuoi[]; tai_lieu: NoiDung['tai_lieu'] }, san: Map<string, CauHoi>) {
    const can = [...new Set(n.buoi.flatMap(cauCuaBuoi))].filter((m) => !san.has(m))
    if (!can.length) return
    const rows = await fetchCausCuaTaiLieu({ mon: n.tai_lieu.mon, nhanh: n.tai_lieu.nhanh, cau_hinh: n.tai_lieu.cau_hinh as CauHinh }, can)
    setCauMap((m) => { const x = new Map(m); rows.forEach((c) => x.set(c.ma_cau, c)); return x })
  }
  async function tai(scope: string) {
    const n = await noiDung(id, scope === 'all' ? null : scope)
    setNd(n); setTen(n.tai_lieu.ten); setCh((n.tai_lieu.cau_hinh ?? {}) as CauHinh)
    await napCau(n, cauMap)
  }
  async function chonBuoiLoc(v: string) {
    setFilterBuoi(v)
    if (!laChuyenDe) try { localStorage.setItem(filterKey(id), v) } catch { /* private mode */ }
    await tai(v)
  }
  useEffect(() => {
    (async () => {
      try {
        const list = await listBuoiTaiLieu(id)
        setBuoiList(list)
        let nho: string | null = null
        // Chuyên đề luôn mở "Tất cả" (Thùy 21/10: nhớ lọc 1 phần ⇒ tưởng thiếu câu); giáo trình nhớ buổi đang soạn như cũ.
        if (!laChuyenDe) try { nho = localStorage.getItem(filterKey(id)) } catch { /* ignore */ }
        const dau = laChuyenDe ? 'all' : nho && (nho === 'all' || list.some((b) => b.id === nho)) ? nho : (list.length ? list[list.length - 1].id : 'all')
        setFilterBuoi(dau)
        await tai(dau)
      } catch (e) { setErr(loiDoc(e)) }
    })()
  }, [id]) // eslint-disable-line

  // ── Vá tại chỗ ──
  function vaBuoi(b: NdBuoi) {
    setNd((p) => p ? { ...p, buoi: p.buoi.map((x) => x.id === b.id ? b : x) } : p)
    if (nd) napCau({ buoi: [b], tai_lieu: nd.tai_lieu }, cauMap)
    markSaved()
  }
  function vaCau(phanId: string, caus: string[]) {
    const sua = <T extends { phan_id: string; caus: string[] } | null>(k: T): T => (k && k.phan_id === phanId ? { ...k, caus } : k)
    setNd((p) => p ? {
      ...p, buoi: p.buoi.map((b) => ({
        ...b, chua_khop: sua(b.chua_khop),
        nhom: b.nhom.map((n) => ({ ...n, chua_phan: sua(n.chua_phan), btvn: sua(n.btvn), dang_bai: n.dang_bai.map((d) => d.phan_id === phanId ? { ...d, caus } : d) })),
      })),
    } : p)
    if (nd) napCau({ buoi: [{ id: '', tieu_de: null, thu_tu: 0, nhom: [], chua_khop: { phan_id: phanId, caus } }], tai_lieu: nd.tai_lieu }, cauMap)
    markSaved()
  }
  function vaCo(phanId: string, patch: { hien_lt?: boolean; hien_vi_du?: boolean }) {
    setNd((p) => p ? {
      ...p, buoi: p.buoi.map((b) => ({
        ...b, nhom: b.nhom.map((n) => ({ ...(n.phan_id === phanId ? { ...n, ...patch } : n), dang_bai: n.dang_bai.map((d) => d.phan_id === phanId ? { ...d, ...patch } : d) })),
      })),
    } : p)
  }
  const lam = async (f: () => Promise<void>) => { setBao(null); try { await f() } catch (e) { setBao(loiDoc(e)) } }

  // ── Thao tác ──
  const datChon = (b: NdBuoi, chon: ChonBuoi) => lam(async () => vaBuoi(await datBuoi(id, b.id, chon)))
  const ghiCau = (phanId: string, caus: string[]) => lam(async () => { await datCau(phanId, caus); vaCau(phanId, caus) })
  const batCo = (phanId: string, patch: { hien_lt?: boolean; hien_vi_du?: boolean }) => lam(async () => {
    vaCo(phanId, patch); markSaved()
    try { await datCoPhan(phanId, patch) } catch (e) { vaCo(phanId, Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, !v]))); throw e }
  })
  async function saveTen() { if (nd && ten.trim() && ten.trim() !== nd.tai_lieu.ten) await lam(async () => { await updateTaiLieu(id, { ten: ten.trim() }); setNd((p) => p ? { ...p, tai_lieu: { ...p.tai_lieu, ten: ten.trim() } } : p); markSaved() }) }
  const saveCh = (patch: Partial<CauHinh>) => lam(async () => { const next = { ...ch, ...patch }; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() })
  const onAnhMm = (maCau: string, v: { pct: number; mm: number } | null) => {
    const mm = { ...(ch.anhMmByCau ?? {}) }, pct = { ...(ch.anhPctByCau ?? {}) }
    if (v && v.mm > 0) { mm[maCau] = v.mm; pct[maCau] = v.pct } else { delete mm[maCau]; delete pct[maCau] }
    saveCh({ anhMmByCau: mm, anhPctByCau: pct })
  }
  const cauHinhCau = {
    lines: ch.btvnLinesByCau ?? {}, cols: ch.colByCau ?? {}, cheDo: ch.hinhCheDoByCau ?? {},
    onLine: (m: string, n: number) => saveCh({ btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [m]: n } }),
    onLineAll: (ms: string[], n: number) => { const x = { ...(ch.btvnLinesByCau ?? {}) }; ms.forEach((m) => { x[m] = n }); saveCh({ btvnLinesByCau: x }) },
    onCol: (m: string, n: number) => saveCh({ colByCau: { ...(ch.colByCau ?? {}), [m]: n } }),
    onCheDo: (m: string, v: CheDoHinh) => saveCh({ hinhCheDoByCau: { ...(ch.hinhCheDoByCau ?? {}), [m]: v } }),
  }
  async function themBuoi() {
    await lam(async () => {
      await addBuoi(id, NHAN)
      const list = await listBuoiTaiLieu(id); setBuoiList(list)
      await chonBuoiLoc(list.length ? list[list.length - 1].id : 'all'); markSaved()
    })
  }
  async function boBuoi(b: NdBuoi) {
    if (!confirm(`Xoá "${b.tieu_de ?? nhan}" (gồm mọi nhóm, dạng bài, BTVN và câu đã chọn của ${nhan})?`)) return
    await lam(async () => {
      await xoaBuoi(b.id)
      const list = await listBuoiTaiLieu(id); setBuoiList(list)
      await chonBuoiLoc(filterBuoi === b.id ? (list.length ? list[list.length - 1].id : 'all') : filterBuoi); markSaved()
    })
  }
  const doiTenBuoi = (b: NdBuoi, t: string) => lam(async () => {
    await updatePhan(b.id, { tieu_de: t })
    setNd((p) => p ? { ...p, buoi: p.buoi.map((x) => x.id === b.id ? { ...x, tieu_de: t } : x) } : p)
    setBuoiList((l) => l.map((x) => x.id === b.id ? { ...x, tieu_de: t } : x)); markSaved()
  })
  // Gợi ý lại câu cho 1 phần: né câu của các phần khác trong buổi.
  const goiYLai = (b: NdBuoi, n: NdNhom, phanId: string, dangBai: string[] | null, so: Record<string, number>, hienCo: string[]) => lam(async () => {
    const tru = cauCuaBuoi(b).filter((m) => !hienCo.includes(m))
    const ds = await goiY(n.id, dangBai, so, tru)
    await datCau(phanId, ds); vaCau(phanId, ds)
  })

  const jump = (pid: string) => document.getElementById('p-' + pid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const sel = 'h-8 rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500'

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!nd || !tl) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>

  return (
    <AnhMmEditCtx.Provider value={{ mm: ch.anhMmByCau ?? {}, pct: ch.anhPctByCau ?? {}, set: onAnhMm, baChe: false }}>
      <div className="flex h-full flex-col bg-[#fafafb]">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
          {/* Như builder cũ: điểm "xong 1 lượt sửa" DUY NHẤT là lúc đóng ⇒ xếp hàng làm link PDF ở đây (không mỗi lần tự lưu). */}
          <button onClick={() => { if (!chiXem) useStore.getState().enqueueLinkGen(id, 'giao_trinh'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
          <input value={ten} disabled={chiXem} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className={`${inp} h-9 max-w-[420px] flex-1 font-semibold`} placeholder={laChuyenDe ? 'Tên chuyên đề' : 'Tên giáo trình'} />
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700" title="Theo bản đồ kiến thức mới (nhóm bài · dạng bài)">🆕 {laChuyenDe ? 'Chuyên đề · ' : ''}Bản đồ mới</span>
          {chiXem && <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Bản lưu trữ · chỉ xem</span>}
          <span className="text-[12px] text-slate-400">Khối {nd.tai_lieu.khoi}</span>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-500">
            {NHAN}
            <select value={filterBuoi} onChange={(e) => lam(() => chonBuoiLoc(e.target.value))} className={sel}>
              <option value="all">Tất cả ({buoiList.length})</option>
              {buoiList.map((b) => <option key={b.id} value={b.id}>{b.tieu_de || `${NHAN} ${b.thu_tu + 1}`}</option>)}
            </select>
          </label>
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
          {!chiXem && !laChuyenDe && <button onClick={() => setGanLop(true)} className="ml-auto whitespace-nowrap rounded-md border border-violet-300 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50" title="Gán giáo trình cho 1 lớp → mỗi buổi thành giáo trình buổi + BTVN bám ngày học">⬇ Gán lớp</button>}
          {/* Lý thuyết TOÀN FILE (Thùy 21/10) — cùng cài `inLyThuyet` của builder cũ, PrintView đã đọc. Tắt ⇒ không in lý thuyết nào;
              bật ⇒ theo ô "Lý thuyết" của từng nhóm / dạng bài như cũ. */}
          <label className={`${chiXem || laChuyenDe ? 'ml-auto ' : ''}flex items-center gap-1.5 text-[12px] text-slate-500`} title="Tắt = in cả file KHÔNG kèm lý thuyết (ô Lý thuyết từng nhóm / dạng bài giữ nguyên, bật lại là theo từng ô)">Lý thuyết
            <select value={ch.inLyThuyet === false ? 'khong' : 'co'} disabled={chiXem} onChange={(e) => saveCh({ inLyThuyet: e.target.value === 'co' })} className={sel}>
              <option value="co">Theo từng nhóm / dạng</option><option value="khong">Không in cả file</option>
            </select>
          </label>
          <button onClick={() => setInAll(true)} className={`whitespace-nowrap rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500`}>🖨 Xem / Xuất PDF</button>
          {!chiXem && (
            <label className="flex items-center gap-1.5 text-[12px] text-slate-500">Màu
              <span className="flex gap-1">{MAU_PRESET.map(([c, n]) => (
                <button key={c} title={n} onClick={() => saveCh({ mau: c })} className={`h-6 w-6 rounded-full border-2 ${(ch.mau ?? '#E91E8C') === c ? 'border-slate-800' : 'border-white shadow'}`} style={{ background: c }} />
              ))}</span>
            </label>
          )}
        </div>
        {bao && (
          <div className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-5 py-2 text-[13px] text-rose-700">
            <span>⚠ {bao}</span>
            <button onClick={() => setBao(null)} className="ml-auto text-rose-400 hover:text-rose-700">✕</button>
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[270px_1fr] overflow-hidden">
          <aside className="min-h-0 overflow-auto border-r border-slate-200 bg-white p-3">
            <CayTrai nd={nd} ten={ten} nhan={nhan} onJump={jump} />
          </aside>
          <div className="min-h-0 overflow-auto p-5">
            <div className="mx-auto max-w-[900px] space-y-4">
              {nd.buoi.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-[13px] text-slate-400">Chưa có {nhan} nào. Bấm “+ Thêm {nhan}” để bắt đầu.</div>}
              {nd.buoi.map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-200 bg-white">
                  <div id={`p-${b.id}`} className="scroll-mt-3 flex items-center gap-2 rounded-t-xl border-b border-slate-100 bg-indigo-50/50 px-4 py-2.5">
                    <span className="text-[14px]">🗓️</span>
                    <input defaultValue={b.tieu_de ?? ''} disabled={chiXem} onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== b.tieu_de) doiTenBuoi(b, v) }}
                      className="w-[220px] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[15px] font-bold text-indigo-800 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white" />
                    <span className="text-[12px] text-slate-400">{b.nhom.length} nhóm · {b.nhom.reduce((s, n) => s + n.dang_bai.length, 0)} dạng bài</span>
                    <button onClick={() => setXemBuoi(b.id)} title={`Xem nhanh bản in CHỈ ${nhan} này`} className="ml-auto shrink-0 whitespace-nowrap rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">👁 Xem {nhan}</button>
                    {!chiXem && <button onClick={() => setBoChon(b)} className="shrink-0 whitespace-nowrap rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">+ Chọn nhóm / dạng bài</button>}
                    {!chiXem && <button onClick={() => boBuoi(b)} title={`Xoá ${nhan}`} className="rounded border border-slate-200 px-1.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>}
                  </div>
                  <div className="space-y-4 p-4">
                    {b.nhom.length === 0 && <div className="text-[12px] italic text-slate-400">Chưa có nhóm — bấm “+ Chọn nhóm / dạng bài”.</div>}
                    {b.nhom.map((n, i) => (
                      <NhomCard key={n.phan_id} n={n} chiXem={chiXem} cauMap={cauMap} cfg={cauHinhCau} laChuyenDe={laChuyenDe}
                        canUp={i > 0} canDown={i < b.nhom.length - 1}
                        onMove={(dir) => { const c = chonCuaBuoi(b); const j = i + dir; [c[i], c[j]] = [c[j], c[i]]; datChon(b, c) }}
                        onBoNhom={() => datChon(b, chonCuaBuoi(b).filter((x) => x.nhom !== n.id))}
                        onDoiDangBai={(ds) => datChon(b, chonCuaBuoi(b).map((x) => x.nhom === n.id ? { ...x, dang_bai: ds } : x))}
                        onCo={batCo}
                        onXoaCau={(phanId, caus, m) => ghiCau(phanId, caus.filter((x) => x !== m))}
                        onGoiY={(phanId, dangBai, so, hienCo) => goiYLai(b, n, phanId, dangBai, so, hienCo)}
                        onChonCau={(phanId, caus, uuTien) => setChonCau({ buoi: b, nhom: n, phanId, caus, uuTien })} />
                    ))}
                    {b.chua_khop && (
                      <KhoiCau tieuDe="⚠ Câu chưa khớp bản đồ mới" mau="amber" caus={b.chua_khop.caus} cauMap={cauMap} cfg={cauHinhCau} chiXem={chiXem}
                        onXoa={(m) => ghiCau(b.chua_khop!.phan_id, b.chua_khop!.caus.filter((x) => x !== m))} />
                    )}
                  </div>
                </div>
              ))}
              {!chiXem && <button onClick={themBuoi} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm {nhan}</button>}
            </div>
          </div>
        </div>

        {boChon && (
          <BoChonNhom khoi={nd.tai_lieu.khoi} nhanh={nhanhBdm} daChon={chonCuaBuoi(boChon)} onClose={() => setBoChon(null)}
            onConfirm={async (c) => { vaBuoi(await datBuoi(id, boChon.id, c)); setBoChon(null) }} />
        )}
        {chonCau && (
          <ChonCauBdm tl={tl} nhomId={chonCau.nhom.id} uuTien={chonCau.uuTien} selected={chonCau.caus}
            macDinh={chonCau.nhom.btvn?.phan_id === chonCau.phanId ? 'luyen' : 'lop'}
            khoa={cauCuaBuoi(chonCau.buoi).filter((m) => !chonCau.caus.includes(m))}
            onClose={() => setChonCau(null)}
            onConfirm={async (ms) => { await datCau(chonCau.phanId, ms); vaCau(chonCau.phanId, ms); setChonCau(null) }} />
        )}
        {inAll && <PrintView id={id} onClose={() => setInAll(false)} />}
        {xemBuoi && <PrintView id={id} onlyBuoiId={xemBuoi} onClose={() => setXemBuoi(null)} />}
        {ganLop && <GanLopBdm masterId={id} khoi={nd.tai_lieu.khoi} tl={tl} onClose={() => setGanLop(false)} />}
      </div>
    </AnhMmEditCtx.Provider>
  )
}

// ── Cấu hình in theo câu (dùng lại control của builder cũ, khoá theo mã câu) ──
type CfgCau = {
  lines: Record<string, number>; cols: Record<string, number>; cheDo: Record<string, CheDoHinh>
  onLine: (m: string, n: number) => void; onLineAll: (ms: string[], n: number) => void
  onCol: (m: string, n: number) => void; onCheDo: (m: string, v: CheDoHinh) => void
}

// ── 1 NHÓM trong buổi: LT nhóm → dạng bài (LT · ví dụ · bài luyện) → chưa phân → BTVN nhóm ──
// Chuyên đề (Thùy 21/10): không phải giáo trình — KHÔNG có trên lớp / về nhà ⇒ ẩn khối BTVN, câu gọi chung "Bài tập".
function NhomCard({ n, chiXem, cauMap, cfg, laChuyenDe = false, canUp, canDown, onMove, onBoNhom, onDoiDangBai, onCo, onXoaCau, onGoiY, onChonCau }: {
  n: NdNhom; chiXem: boolean; cauMap: Map<string, CauHoi>; cfg: CfgCau; laChuyenDe?: boolean; canUp: boolean; canDown: boolean
  onMove: (dir: -1 | 1) => void; onBoNhom: () => void; onDoiDangBai: (ds: string[]) => void
  onCo: (phanId: string, patch: { hien_lt?: boolean; hien_vi_du?: boolean }) => void
  onXoaCau: (phanId: string, caus: string[], m: string) => void
  onGoiY: (phanId: string, dangBai: string[] | null, so: Record<string, number>, hienCo: string[]) => void
  onChonCau: (phanId: string, caus: string[], uuTien: string | null) => void
}) {
  const ids = n.dang_bai.map((d) => d.id)
  const doiCho = (i: number, j: number) => { const x = [...ids]; [x[i], x[j]] = [x[j], x[i]]; onDoiDangBai(x) }
  const coLt = !!(n.ly_thuyet?.trim() || n.ly_thuyet_file_url)
  const BAI = laChuyenDe ? '📘 Bài tập' : '📘 Bài luyện'
  return (
    <div id={`p-${n.phan_id}`} className="scroll-mt-3 overflow-hidden rounded-xl border border-indigo-200">
      <div className="flex items-center gap-2 bg-indigo-600 px-3 py-2 text-white">
        {!chiXem && (
          <span className="flex shrink-0 flex-col leading-none" title="Đổi thứ tự nhóm trong buổi">
            <button onClick={() => onMove(-1)} disabled={!canUp} className="text-[10px] text-white/70 hover:text-white disabled:opacity-25">▲</button>
            <button onClick={() => onMove(1)} disabled={!canDown} className="text-[10px] text-white/70 hover:text-white disabled:opacity-25">▼</button>
          </span>
        )}
        <span className="text-[14px] font-semibold">Nhóm {n.stt}: {n.ten ?? <i className="font-normal opacity-80">(đã xoá khỏi bản đồ)</i>}</span>
        <label className="ml-auto flex shrink-0 items-center gap-1.5 text-[11px] text-white/90" title="In lý thuyết của nhóm">
          <input type="checkbox" disabled={chiXem} checked={n.hien_lt} onChange={(e) => onCo(n.phan_id, { hien_lt: e.target.checked })} /> Lý thuyết nhóm
        </label>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${coLt ? 'bg-white/20' : 'bg-amber-300 text-amber-900'}`}>{coLt ? 'có lý thuyết' : 'chưa có lý thuyết'}</span>
        {!chiXem && <button onClick={onBoNhom} title="Bỏ nhóm khỏi buổi" className="shrink-0 text-[12px] text-white/70 hover:text-white">✕</button>}
      </div>
      <div className="space-y-3 bg-white p-3">
        {n.dang_bai.map((d, i) => {
          const coLtD = !!(d.ly_thuyet?.trim() || d.ly_thuyet_file_url), coVd = !!(d.vi_du?.trim() || d.vi_du_file_url)
          return (
            <div key={d.phan_id} id={`p-${d.phan_id}`} className="scroll-mt-3 rounded-lg border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-2">
                {!chiXem && (
                  <span className="flex shrink-0 flex-col leading-none" title="Đổi thứ tự dạng bài">
                    <button onClick={() => doiCho(i, i - 1)} disabled={i === 0} className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▲</button>
                    <button onClick={() => doiCho(i, i + 1)} disabled={i === n.dang_bai.length - 1} className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▼</button>
                  </span>
                )}
                <span className="text-[13.5px] font-semibold text-pink-600">Dạng bài {n.stt}.{d.stt}: {d.ten ?? <i className="font-normal text-slate-400">(đã xoá khỏi bản đồ)</i>}</span>
                <span className="ml-auto flex shrink-0 items-center gap-3 text-[11px] text-slate-500">
                  <label className="flex items-center gap-1" title={coLtD ? 'In lý thuyết dạng bài' : 'Dạng bài chưa có lý thuyết'}>
                    <input type="checkbox" disabled={chiXem} checked={d.hien_lt} onChange={(e) => onCo(d.phan_id, { hien_lt: e.target.checked })} />
                    <span className={coLtD ? '' : 'text-amber-600'}>Lý thuyết{coLtD ? '' : ' (trống)'}</span>
                  </label>
                  <label className="flex items-center gap-1" title={coVd ? 'In ví dụ' : 'Dạng bài chưa có ví dụ'}>
                    <input type="checkbox" disabled={chiXem} checked={d.hien_vi_du} onChange={(e) => onCo(d.phan_id, { hien_vi_du: e.target.checked })} />
                    <span className={coVd ? '' : 'text-amber-600'}>Ví dụ{coVd ? '' : ' (trống)'}</span>
                  </label>
                  {!chiXem && <button onClick={() => onDoiDangBai(ids.filter((x) => x !== d.id))} title="Bỏ dạng bài khỏi buổi" className="text-[12px] text-slate-400 hover:text-rose-600">✕</button>}
                </span>
              </div>
              <KhoiCau tieuDe={BAI} mau="sky" caus={d.caus} cauMap={cauMap} cfg={cfg} chiXem={chiXem} soMacDinh={SO_LUYEN_MAC_DINH}
                onXoa={(m) => onXoaCau(d.phan_id, d.caus, m)}
                onGoiY={(so) => onGoiY(d.phan_id, [d.id], so, d.caus)}
                onChonCau={() => onChonCau(d.phan_id, d.caus, d.id)} />
            </div>
          )
        })}
        {n.chua_phan && (
          <div className="rounded-lg border border-slate-200">
            <KhoiCau tieuDe={n.dang_bai.length ? `${BAI} · câu chưa phân dạng bài` : `${BAI} (nhóm chưa chia dạng bài)`} mau="sky" caus={n.chua_phan.caus} cauMap={cauMap} cfg={cfg} chiXem={chiXem}
              soMacDinh={n.dang_bai.length ? undefined : { trac_nghiem: 3, tra_loi_ngan: 2, tu_luan: 1 }}
              onXoa={(m) => onXoaCau(n.chua_phan!.phan_id, n.chua_phan!.caus, m)}
              onGoiY={n.dang_bai.length ? undefined : (so) => onGoiY(n.chua_phan!.phan_id, null, so, n.chua_phan!.caus)}
              onChonCau={() => onChonCau(n.chua_phan!.phan_id, n.chua_phan!.caus, null)} />
          </div>
        )}
        {n.btvn && !laChuyenDe && (
          <div className="rounded-lg border border-orange-200 bg-orange-50/30">
            <KhoiCau tieuDe="📝 BTVN của nhóm" mau="orange" btvn caus={n.btvn.caus} cauMap={cauMap} cfg={cfg} chiXem={chiXem} soMacDinh={SO_BTVN_MAC_DINH}
              onXoa={(m) => onXoaCau(n.btvn!.phan_id, n.btvn!.caus, m)}
              onGoiY={(so) => onGoiY(n.btvn!.phan_id, n.dang_bai.length ? ids : null, so, n.btvn!.caus)}
              onChonCau={() => onChonCau(n.btvn!.phan_id, n.btvn!.caus, null)} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── 1 khối câu (bài luyện / BTVN / chưa khớp): số lượng theo loại + Gợi ý + Chọn câu + danh sách câu ──
function KhoiCau({ tieuDe, mau, caus, cauMap, cfg, chiXem, btvn, soMacDinh, onXoa, onGoiY, onChonCau }: {
  tieuDe: string; mau: 'sky' | 'orange' | 'amber'; caus: string[]; cauMap: Map<string, CauHoi>; cfg: CfgCau; chiXem: boolean; btvn?: boolean
  soMacDinh?: Record<string, number>
  onXoa: (m: string) => void; onGoiY?: (so: Record<string, number>) => void; onChonCau?: () => void
}) {
  const [so, setSo] = useState<Record<string, number>>({ ...(soMacDinh ?? {}) })
  const mauChu = mau === 'sky' ? 'text-sky-700' : mau === 'orange' ? 'text-orange-600' : 'text-amber-700'
  return (
    <div className="p-3">
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <span className={`font-semibold ${mauChu}`}>{tieuDe}</span>
        {!chiXem && onGoiY && LOAI_CAU.filter((l) => l.value !== 'dung_sai').map((l) => (
          <label key={l.value} className="flex items-center gap-1">{l.label}
            <input type="number" min={0} value={so[l.value] ?? 0} onChange={(e) => setSo((s) => ({ ...s, [l.value]: Math.max(0, +e.target.value || 0) }))} className="h-7 w-11 rounded border border-slate-300 px-1 text-center text-[12px]" />
          </label>
        ))}
        {!chiXem && onGoiY && <button onClick={() => onGoiY(so)} className="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 hover:bg-indigo-100">↻ Gợi ý</button>}
        {!chiXem && onChonCau && <button onClick={onChonCau} className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:border-indigo-400">✎ Chọn câu</button>}
        {!chiXem && btvn && caus.length > 0 && <ApplyLinesAll maCaus={caus} onApply={(n) => cfg.onLineAll(caus, n)} />}
      </div>
      {caus.length === 0
        ? <div className="mt-2 text-[12px] italic text-slate-400">Chưa có câu{onGoiY ? ' — bấm “Gợi ý” hoặc “Chọn câu”' : ''}.</div>
        : (
          <ol className="mt-2 space-y-1">
            {caus.map((m, i) => {
              const c = cauMap.get(m)
              return (
                <li key={m} className={`rounded-md border px-2.5 py-1.5 ${btvn ? 'border-slate-100 bg-white/70' : 'border-slate-100 bg-slate-50/50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-slate-400">{i + 1}.</span>
                    <MaCau ma={m} />
                    {c && <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>}
                    {!chiXem && (
                      <span className="ml-auto flex flex-wrap items-center justify-end gap-2">
                        {btvn && (
                          <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title="Số dòng kẻ để HS viết bài này">dòng
                            <input type="number" min={0} max={50} value={cfg.lines[m] ?? DEFAULT_BTVN_LINES} onChange={(e) => cfg.onLine(m, Math.max(0, Math.min(50, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                          </label>
                        )}
                        <ColSel value={cfg.cols[m] ?? 1} onChange={(n) => cfg.onCol(m, n)} />
                        {c?.anh_de && <CheDoHinhBtn cur={cfg.cheDo[m] ?? 'hien'} onChange={(v) => cfg.onCheDo(m, v)} />}
                        {c?.anh_de && <AnhMmCtl ma={m} url={c.anh_de} />}
                        <button onClick={() => onXoa(m)} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">✕</button>
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{c ? <MathText>{c.noi_dung}</MathText> : <span className="text-slate-300">…</span>}</div>
                  {c?.anh_de && <AnhXem ma={m} url={c.anh_de} cheDo={cfg.cheDo[m] ?? 'hien'} />}
                </li>
              )
            })}
          </ol>
        )}
    </div>
  )
}

// Cây trái: Buổi → Nhóm → Dạng bài (số câu luyện). Bấm = nhảy tới thẻ.
function CayTrai({ nd, ten, nhan, onJump }: { nd: NoiDung; ten: string; nhan: string; onJump: (pid: string) => void }) {
  const item = 'block w-full truncate rounded px-2 py-1 text-left text-[13px] hover:bg-slate-100'
  return (
    <div>
      <div className="mb-2 truncate px-1 text-[13px] font-bold text-slate-700">📄 {ten || 'Giáo trình'}</div>
      {nd.buoi.length === 0 && <div className="px-2 py-3 text-[12px] italic text-slate-400">Chưa có {nhan}.</div>}
      {nd.buoi.map((b) => (
        <div key={b.id} className="mb-1">
          <button onClick={() => onJump(b.id)} className={`${item} font-semibold text-indigo-700`}>🗓️ {b.tieu_de}</button>
          <div className="ml-2 border-l border-slate-100 pl-1">
            {b.nhom.map((n) => (
              <div key={n.phan_id}>
                <button onClick={() => onJump(n.phan_id)} className={`${item} font-medium text-slate-700`}>Nhóm {n.stt}: {n.ten ?? '—'}</button>
                <div className="ml-2 border-l border-slate-100 pl-1">
                  {n.dang_bai.map((d) => (
                    <button key={d.phan_id} onClick={() => onJump(d.phan_id)} className={`${item} text-[12px] text-slate-500`}>
                      {n.stt}.{d.stt} {d.ten ?? '—'} <span className="text-slate-300">({d.caus.length})</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
