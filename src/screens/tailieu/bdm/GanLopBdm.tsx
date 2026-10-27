// GÁN LỚP cho giáo trình BẢN ĐỒ MỚI — riêng, không dùng TrichPanel/trichXuatBuoi của builder cũ (Thùy 18/10).
// Nhịp giữ như cũ để GV quen tay: chọn lớp → mỗi buổi gốc gán vào 1 ngày học của lớp (mặc định buổi TKB gần nhất
// chưa gán) ⇒ tạo giáo trình buổi; BTVN + ôn tập làm ở bước riêng (BtvnOnTapBdm), xem trước rồi mới tạo.
// Số buổi in trên phiếu = số CỦA LỚP (renumberBuoiLop dùng chung). Trạng thái "đã gán / đã có BTVN" suy từ tài liệu.
import { useEffect, useState } from 'react'
import { listBuoiTaiLieu, listTrichXuat, listGiaoTrinhLop, renumberBuoiLop, tieuDeBuoiLop, type TrichState, type BuoiLop, type TaiLieuNhanhCtx } from '../../../lib/tailieu'
import { trichBuoiBdm, loiDoc } from '../../../lib/tailieuBdm'
import { listLop, type Lop } from '../../../lib/nhansu'
import { ngayBuoiHopLeCuaLop } from '../../../lib/gami'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../../lib/tuan'
import SearchSelect from '../../../components/SearchSelect'
import BuoiNgaySelect from '../../../components/BuoiNgaySelect'
import { useStore } from '../../../store/useStore'
import BtvnOnTapBdm from './BtvnOnTapBdm'

type BuoiGoc = { id: string; tieu_de: string | null; thu_tu: number }

// hinh = giáo trình Hình (Học + Luyện): BTVN = BTVN các bài học của buổi, tạo thẳng (ôn tập chưa có cho Hình — mig 202610271757).
export default function GanLopBdm({ masterId, khoi, tl, onClose, hinh = false }: { masterId: string; khoi: string; tl: TaiLieuNhanhCtx; onClose: () => void; hinh?: boolean }) {
  const [buois, setBuois] = useState<BuoiGoc[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [state, setState] = useState<Record<string, TrichState>>({})
  const [boLop, setBoLop] = useState<BuoiLop[]>([])
  const [tkb, setTkb] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [btvn, setBtvn] = useState<{ buoi: BuoiGoc; no: number; ngay: string; tenBuoi: string } | null>(null)
  const lop = lops.find((l) => l.id === lopId)

  useEffect(() => {
    listBuoiTaiLieu(masterId).then(setBuois).catch((e) => setLoi(loiDoc(e)))
    listLop().then(setLops).catch(() => { })
  }, [masterId])
  async function napLop(id: string) {
    setLoading(true)
    const today = homNayVN()
    try {
      const [st, bo, ng] = await Promise.all([
        listTrichXuat(masterId, id), listGiaoTrinhLop(id),
        ngayBuoiHopLeCuaLop(id, congNgay(today, -60), congNgay(today, 90)).catch(() => [] as { ngay: string }[]),
      ])
      setState(st); setBoLop(bo); setTkb(ng.map((o) => o.ngay))
    } catch (e) { setLoi(loiDoc(e)) } finally { setLoading(false) }
  }
  useEffect(() => { if (lopId) napLop(lopId); else { setState({}); setBoLop([]) } }, [lopId]) // eslint-disable-line

  // Ngày mặc định = buổi TKB gần nhất CHƯA có tài liệu của lớp (từ hôm nay; hết thì lùi về buổi trống gần nhất đã qua) — như cũ.
  const daGan = new Set(boLop.map((b) => b.ngay))
  const trong = tkb.filter((d) => !daGan.has(d))
  const today = homNayVN()
  const ngayMacDinh = trong.find((d) => d >= today) ?? trong[trong.length - 1] ?? ''
  const sttLop = (buoiId: string) => boLop.find((b) => b.nguon_buoi === buoiId)?.stt

  async function gan(b: BuoiGoc, no: number, ngay: string) {
    if (!lop) return
    setLoi(null)
    try {
      const doc = await trichBuoiBdm(masterId, b.id, { lopId: lop.id, ngay, khoi, tenLop: lop.ten_lop, tenBuoi: b.tieu_de || `Buổi ${no}`, loai: 'giao_trinh_buoi' })
      useStore.getState().enqueueLinkGen(doc.id, doc.loai)
      const doi = new Map((await renumberBuoiLop(lop.id)).map((d) => [d.id, d]))
      doi.delete(doc.id)
      doi.forEach((d) => useStore.getState().enqueueLinkGen(d.id, d.loai))
      await napLop(lop.id)
    } catch (e) { setLoi(loiDoc(e)) }
  }

  async function btvnHinh(b: BuoiGoc, no: number, ngay: string) {
    if (!lop) return
    setLoi(null)
    try {
      const st = sttLop(b.id), ten = b.tieu_de || `Buổi ${no}`
      const doc = await trichBuoiBdm(masterId, b.id, { lopId: lop.id, ngay, khoi, tenLop: lop.ten_lop, tenBuoi: st ? tieuDeBuoiLop(ten, st) : ten, loai: 'btvn' })
      useStore.getState().enqueueLinkGen(doc.id, doc.loai)
      for (const d of await renumberBuoiLop(lop.id)) useStore.getState().enqueueLinkGen(d.id, d.loai)
      await napLop(lop.id)
    } catch (e) { setLoi(loiDoc(e)) }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Gán giáo trình cho lớp</h3>
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">🆕 Bản đồ mới</span>
          <div className="w-56"><SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
            options={lops.filter((l) => !khoi || l.khoi === khoi).map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {loi && <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-[13px] text-rose-700">⚠ {loi}</div>}
        {!lop ? <p className="p-8 text-center text-sm text-slate-400">Chọn lớp để xem bộ giáo trình riêng của lớp + gán tiếp buổi mới.</p>
          : loading ? <p className="p-8 text-sm text-slate-400">Đang tải trạng thái…</p>
          : (
            <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px] grid-rows-[minmax(0,1fr)] overflow-hidden">
              <div className="min-h-0 overflow-auto p-5">
                <p className="mb-2 text-[12px] text-slate-400">Mỗi buổi của giáo trình gốc → gán cho 1 ngày học của lớp <b>{lop.ten_lop}</b> (tạo giáo trình buổi). {hinh ? 'BTVN (câu về nhà của các bài học) tạo ở bước riêng.' : 'BTVN + ôn tập làm ở bước riêng, có xem trước.'}</p>
                <div className="space-y-2">
                  {buois.map((b, i) => (
                    <DongBuoi key={b.id} b={b} no={i + 1} st={state[b.id]} sttLop={sttLop(b.id)} lopId={lop.id} ngayMacDinh={state[b.id]?.ngay ? '' : ngayMacDinh}
                      onGan={(ngay) => gan(b, i + 1, ngay)} nhanBtvn={hinh ? '+ BTVN' : undefined}
                      onBtvn={() => { const st = state[b.id]; if (!st?.ngay) return; if (hinh) void btvnHinh(b, i + 1, st.ngay); else setBtvn({ buoi: b, no: i + 1, ngay: st.ngay, tenBuoi: b.tieu_de || `Buổi ${i + 1}` }) }} />
                  ))}
                </div>
              </div>
              <aside className="min-h-0 overflow-auto border-l border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-1 text-[13px] font-bold text-slate-800">📚 Giáo trình riêng của {lop.ten_lop}</div>
                <p className="mb-3 text-[11px] text-slate-400">Số buổi ở đây là số <b>của lớp</b> (theo ngày học).</p>
                {boLop.length === 0
                  ? <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-[12px] italic text-slate-400">Lớp chưa được gán buổi nào.</div>
                  : <ol className="space-y-1.5">{boLop.map((x) => (
                    <li key={x.ngay} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">{x.stt}</span>
                        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-slate-800" title={x.tieu_de}>{x.tieu_de}</span>
                        <span className="shrink-0 text-[11px] text-slate-400">{x.ngay.split('-').reverse().join('/')}</span>
                      </div>
                      <div className="mt-1 flex gap-1.5 pl-8">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${x.gt ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>GT</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${x.btvn ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>BTVN</span>
                        <span className="ml-auto text-[10px] text-slate-400">{x.nguon_id === masterId ? 'giáo trình này' : 'nguồn khác'}</span>
                      </div>
                    </li>
                  ))}</ol>}
              </aside>
            </div>
          )}
      </div>
      {btvn && lop && (
        <div onClick={(e) => e.stopPropagation()}>
          <BtvnOnTapBdm tl={tl} masterId={masterId} buoiId={btvn.buoi.id} khoi={khoi} lopId={lop.id} tenLop={lop.ten_lop} ngay={btvn.ngay}
            tenBuoi={sttLop(btvn.buoi.id) ? tieuDeBuoiLop(btvn.tenBuoi, sttLop(btvn.buoi.id)!) : btvn.tenBuoi}
            onClose={() => setBtvn(null)} onDone={() => { setBtvn(null); napLop(lop.id) }} />
        </div>
      )}
    </div>
  )
}

// 1 buổi gốc: chưa gán ⇒ "Gán vào <ngày mặc định>" (đổi ngày được) · đã gán ⇒ số buổi của lớp + GT/BTVN + "+ BTVN / Ôn tập".
function DongBuoi({ b, no, st, sttLop, lopId, ngayMacDinh, onGan, onBtvn, nhanBtvn = '+ BTVN / Ôn tập' }: {
  b: BuoiGoc; no: number; st?: TrichState; sttLop?: number; lopId: string; ngayMacDinh: string
  onGan: (ngay: string) => Promise<void>; onBtvn: () => void; nhanBtvn?: string
}) {
  const [ngay, setNgay] = useState(ngayMacDinh)
  const [chamTay, setChamTay] = useState(false)
  const [doiNgay, setDoiNgay] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (!chamTay) setNgay(ngayMacDinh) }, [ngayMacDinh, chamTay])
  const chon = (v: string) => { setChamTay(true); setNgay(v) }
  async function go() { if (!ngay) return; setBusy(true); try { await onGan(ngay) } finally { setBusy(false) } }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="w-6 shrink-0 text-center text-[13px] font-bold text-indigo-600">{no}</span>
        <div className="min-w-[120px] flex-1 text-[13px] font-semibold text-slate-800">{b.tieu_de || `Buổi ${no}`}</div>
        {st?.ngay ? (
          <div className="flex flex-wrap items-center gap-2">
            {sttLop && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[12px] font-semibold text-indigo-700">→ Buổi {sttLop} của lớp</span>}
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">✓ Đã gán · {st.ngay.split('-').reverse().join('/')}</span>
            <span className="text-[11px] text-slate-400">{[st.hasGT && 'GT', st.hasBTVN && 'BTVN'].filter(Boolean).join(' + ')}</span>
            {st.hasGT && <button onClick={onBtvn} className="rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-violet-500">{st.hasBTVN ? '↻ Làm lại BTVN' : nhanBtvn}</button>}
            <button onClick={go} disabled={busy || !ngay} title="Gán lại sang ngày đang chọn (thay giáo trình buổi của ngày đó)" className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-indigo-300">Gán lại</button>
            <BuoiNgaySelect lopId={lopId} value={ngay} onChange={chon} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {ngay
              ? <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[12px] font-medium text-violet-700">Gán vào <b>{thuCuaNgay(ngay)} · {ddmmVN(ngay)}</b></span>
              : <span className="text-[12px] text-slate-400">{doiNgay ? 'Chọn ngày…' : 'Lớp chưa có buổi trống trong lịch'}</span>}
            <button onClick={() => setDoiNgay((v) => !v)} className="text-[11px] text-slate-400 underline decoration-dotted underline-offset-2 hover:text-indigo-600">đổi ngày</button>
            {doiNgay && <BuoiNgaySelect lopId={lopId} value={ngay} onChange={chon} className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" />}
            <button onClick={go} disabled={busy || !ngay} className="rounded-md bg-violet-600 px-3 py-1 text-[12px] font-medium text-white hover:bg-violet-500 disabled:opacity-40">{busy ? '…' : 'Gán'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
