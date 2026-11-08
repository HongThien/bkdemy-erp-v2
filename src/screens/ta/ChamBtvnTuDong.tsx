// ChamBtvnTuDong — màn riêng "🤖 Chấm BTVN tự động" của app trợ giảng (CEO chốt luồng 07/11/2026):
//   chọn LỚP (lớp TA phụ trách lên đầu) → chọn BUỔI (có ngày) → chọn HỌC SINH → đẩy ảnh bài lên →
//   máy chấm, tự sắp thứ tự ảnh, đề xuất Đ/C/S từng câu → TA xác nhận mới ghi vào ERP.
// Phần chấm + xác nhận dùng chung khung ChamTuDongBtvn. Máy chỉ gợi ý (bảng nháp btvn_ai_*).
// Chế độ HÀNG ĐỢI (07/11): TA bấm Gửi chấm, máy CEO chạy /cham-btvn-hang-doi theo đợt, TA quay lại xác nhận.
import { useEffect, useState } from 'react'
import { getRoster, listProblems, loadBTVNForBuoi, syncBTVNProblems, loadHinhForBuoiPhase, syncHinhProblems, type BuoiHocHS, type Problem } from '../../lib/gami'
import { lopChamAi, listBuoiBtvnCuaLop, listNopTheoBuoi, signUrls, trangThaiAiTheoBuoi, boAnh, laAnhTaThem, xoayAnh, doiChoAnh, type LopAi, type BuoiBtvn, type BtvnNop, type AiTrangThai } from '../../lib/btvnnop'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import { BK_TROI } from '../../components/bk/BKUI'
import ChamTuDongBtvn from './ChamTuDongBtvn'

// Lựa chọn lớp/buổi nhớ tới F5: quay lại màn này là đúng chỗ cũ (CLAUDE.md §2, màn làm việc theo hàng đợi).
const NHO: { lop: LopAi | null; buoi: BuoiBtvn | null } = { lop: null, buoi: null }

export default function ChamBtvnTuDong({ onBack }: { onBack: () => void }) {
  const [lop, setLop] = useState<LopAi | null>(NHO.lop)
  const [buoi, setBuoi] = useState<BuoiBtvn | null>(NHO.buoi)
  const [hs, setHs] = useState<{ r: BuoiHocHS; ten: string } | null>(null)
  useEffect(() => { NHO.lop = lop; NHO.buoi = buoi }, [lop, buoi])

  const lui = () => { if (hs) setHs(null); else if (buoi) setBuoi(null); else if (lop) setLop(null); else onBack() }
  const tieuDe = hs ? hs.ten : buoi ? `${lop?.ten_lop} · ${thuCuaNgay(buoi.ngay)} ${ddmmVN(buoi.ngay)}` : lop ? lop.ten_lop : 'Chấm BTVN tự động'

  return (
    <div className="flex h-[100dvh] flex-col" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <div className="flex min-h-[50px] items-center gap-2 bg-white/90 px-3 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <button onClick={lui} className="rounded-lg px-2.5 py-1.5 text-[13.5px] font-semibold text-slate-600 active:bg-slate-100">‹ Quay lại</button>
        <p className="min-w-0 flex-1 truncate text-[14.5px] font-bold text-slate-900">🤖 {tieuDe}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        {!lop && <ChonLop onChon={setLop} />}
        {lop && !buoi && <ChonBuoi lop={lop} onChon={setBuoi} />}
        {lop && buoi && <ChonHocSinh key={buoi.id} buoi={buoi} hsMo={hs} onMo={setHs} />}
      </div>
    </div>
  )
}

function ChonLop({ onChon }: { onChon: (l: LopAi) => void }) {
  const [ds, setDs] = useState<LopAi[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [xemHet, setXemHet] = useState(false)
  useEffect(() => { lopChamAi().then(setDs).catch((e) => setLoi(e.message ?? String(e))) }, [])
  if (loi) return <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">⚠ {loi}</p>
  if (!ds) return <p className="text-[13px] text-slate-500">Đang tải lớp…</p>
  const cuaToi = ds.filter((l) => l.phu_trach)
  const khac = ds.filter((l) => !l.phu_trach)
  const the = (l: LopAi) => (
    <button key={l.lop_id} onClick={() => onChon(l)} className="rounded-2xl bg-white px-3 py-3 text-left shadow-sm active:bg-slate-50">
      <p className="text-[15px] font-bold text-slate-900">{l.ten_lop}</p>
      <p className="text-[11.5px] text-slate-500">{l.mon}{l.khoi ? ` · khối ${l.khoi}` : ''}</p>
    </button>
  )
  return (
    <div>
      <p className="mb-1.5 text-[12px] font-bold text-slate-600">Lớp bạn phụ trách</p>
      {cuaToi.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{cuaToi.map(the)}</div>
        : <p className="text-[12.5px] text-slate-500">Bạn chưa được phân công lớp nào — chọn trong các lớp khác.</p>}
      <button onClick={() => setXemHet(!xemHet)} className="mt-3 text-[12.5px] font-bold text-[#2F73F6]">{xemHet ? 'Ẩn lớp khác' : `Lớp khác (${khac.length})`}</button>
      {xemHet && <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{khac.map(the)}</div>}
    </div>
  )
}

function ChonBuoi({ lop, onChon }: { lop: LopAi; onChon: (b: BuoiBtvn) => void }) {
  const [ds, setDs] = useState<BuoiBtvn[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { listBuoiBtvnCuaLop(lop.lop_id).then(setDs).catch((e) => setLoi(e.message ?? String(e))) }, [lop.lop_id])
  if (loi) return <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">⚠ {loi}</p>
  if (!ds) return <p className="text-[13px] text-slate-500">Đang tải buổi…</p>
  const coPhieu = ds.filter((b) => b.co_phieu)
  if (!coPhieu.length) return <p className="text-[13px] text-slate-500">Lớp này chưa có buổi nào giao phiếu BTVN.</p>
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-bold text-slate-600">Chọn buổi giao BTVN</p>
      {coPhieu.map((b) => (
        <button key={b.id} onClick={() => onChon(b)} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 text-left shadow-sm active:bg-slate-50">
          <span className="flex-1 text-[14px] font-bold text-slate-900">{thuCuaNgay(b.ngay)} · {ddmmVN(b.ngay)}</span>
          {b.dong && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">đã đóng BTVN</span>}
          <span className="text-slate-300">›</span>
        </button>
      ))}
    </div>
  )
}

function ChonHocSinh({ buoi, hsMo, onMo }: { buoi: BuoiBtvn; hsMo: { r: BuoiHocHS; ten: string } | null; onMo: (h: { r: BuoiHocHS; ten: string } | null) => void }) {
  const [roster, setRoster] = useState<BuoiHocHS[] | null>(null)
  const [probs, setProbs] = useState<Problem[]>([])
  const [nop, setNop] = useState<Record<string, BtvnNop>>({})
  const [ai, setAi] = useState<Record<string, AiTrangThai>>({})
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [loi, setLoi] = useState<string | null>(null)

  // Lưới câu BTVN bám phiếu (lớp+ngày) — dựng/đồng bộ y như màn Chấm BTVN (ChamBtvn.napLuoi), TUẦN TỰ Đại rồi Hình.
  async function napLuoi() {
    const { btvnId, caus } = await loadBTVNForBuoi(buoi.id)
    if (btvnId) await syncBTVNProblems(buoi.id, caus, buoi.dong)
    const { dapAn } = await loadHinhForBuoiPhase(buoi.id, 'btvn')
    if (dapAn.length) await syncHinhProblems(buoi.id, 'btvn', dapAn, buoi.dong)
    setProbs((await listProblems(buoi.id, 'btvn')).filter((p) => !p.ngoai_de))
  }
  async function reloadNop() {
    const n = await listNopTheoBuoi(buoi.id)
    setNop(n)
    setUrls(await signUrls(Object.values(n).flatMap((x) => x.anh.flatMap((a) => [a.path, a.path_cham].filter(Boolean) as string[]))).catch(() => ({})))
  }
  async function reloadAi() { setAi(await trangThaiAiTheoBuoi(buoi.id).catch(() => ({}))) }
  useEffect(() => { (async () => {
    try { await Promise.all([napLuoi(), reloadNop(), reloadAi(), getRoster(buoi.id).then(setRoster)]) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
  })() }, [buoi.id]) // eslint-disable-line

  if (loi) return <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">⚠ {loi}</p>
  if (!roster) return <p className="text-[13px] text-slate-500">Đang tải học sinh…</p>
  // Có mặt lên trước; em vắng vẫn chọn được (bài nộp sau / học bù vẫn là bài thật).
  const ds = [...roster.filter((r) => r.diem_danh === 'co_mat'), ...roster.filter((r) => r.diem_danh !== 'co_mat')]
  const ten = tenHienThiDs(ds.map((r) => r.hoc_sinh?.ho_ten))

  if (hsMo) {
    const n = nop[hsMo.r.hoc_sinh_id]
    return (
      <div className="flex flex-col gap-2.5">
        {probs.length === 0 && <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">Buổi này chưa có lưới câu BTVN (phiếu chưa gán đúng lớp + ngày) — chưa chấm được.</p>}
        <XemAnh n={n} urls={urls} reloadNop={async () => { await reloadNop(); await reloadAi() }} />
        <div className="rounded-2xl bg-white p-2.5 shadow-sm">
          <ChamTuDongBtvn buoiId={buoi.id} hsId={hsMo.r.hoc_sinh_id} probs={probs} dong={buoi.dong} coAnh={!!n?.anh.length} daTra={!!n?.tra_at}
            tenCau={(p) => (p.hinh_baitoan_id ? `Bài ${p.hinh_nhan}` : `Câu ${p.problem_no}`)}
            reloadNop={async () => { await reloadNop(); await reloadAi() }} reloadP={reloadAi} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-bold text-slate-600">Chọn học sinh · {probs.length} câu</p>
      {ds.map((r, i) => {
        const n = nop[r.hoc_sinh_id]; const a = ai[r.hoc_sinh_id]
        return (
          <button key={r.id} onClick={() => onMo({ r, ten: ten[i] })} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-left shadow-sm active:bg-slate-50">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-[14px] font-bold text-slate-900">{ten[i]}
                {r.diem_danh !== 'co_mat' && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">vắng buổi</span>}
              </p>
              <p className="flex flex-wrap gap-1.5 text-[11.5px]">
                {n ? <span className="rounded bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-700">📷 {n.anh.length} ảnh</span> : <span className="text-slate-400">chưa có ảnh</span>}
                {a && (a.cho_cham
                  ? <span className="rounded bg-sky-50 px-1.5 py-0.5 font-semibold text-sky-700">⏳ chờ máy chấm</span>
                  : a.chot
                    ? <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">✓ đã xác nhận</span>
                    : a.lan_moi_at ? <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-700">🤖 chờ bạn xác nhận</span> : null)}
              </p>
            </div>
            <span className="text-slate-300">›</span>
          </button>
        )
      })}
    </div>
  )
}

// Xem xấp ảnh (thứ tự = thu_tu, máy đã sắp lại sau khi chấm). Bấm ảnh để phóng to.
// ✕ = bỏ ảnh TA thêm nhầm (chỉ ảnh TA tự thêm, bài chưa trả PH) — không xoá, DB đánh dấu bo_at.
// ◀ ▶ = đổi chỗ (PH/TA đẩy nhầm thứ tự) · ↻ = xoay 90° (ảnh chụp ngang/ngược). Chỉ đổi cách hiển thị, ảnh gốc giữ nguyên.
function XemAnh({ n, urls, reloadNop }: { n?: BtvnNop; urls: Record<string, string>; reloadNop: () => Promise<void> }) {
  const [to, setTo] = useState<{ url: string; xoay: number } | null>(null)
  async function lam(id: string, viec: () => Promise<void>) {
    if (dangBo) return
    setDangBo(id); setLoi(null)
    try { await viec(); await reloadNop() } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangBo(null) }
  }
  const [dangBo, setDangBo] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  async function bo(id: string, so: number) {
    if (dangBo || !confirm(`Bỏ ảnh ${so}? Ảnh sẽ không còn trong bài của em (dùng khi thêm nhầm).`)) return
    setDangBo(id); setLoi(null)
    try { await boAnh(id); await reloadNop() } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangBo(null) }
  }
  if (!n?.anh.length) return <p className="rounded-xl bg-white px-3 py-3 text-[12.5px] text-slate-500 shadow-sm">Chưa có ảnh bài làm — bấm <b>📷 Thêm ảnh</b> bên dưới (trên máy tính có thể dán ảnh bằng Ctrl+V).</p>
  return (
    <div className="rounded-2xl bg-white p-2 shadow-sm">
      <div className="flex gap-2 overflow-x-auto">
        {n.anh.map((a, i) => {
          const goc = a.path_cham ? 0 : a.xoay // bản TA đã vẽ đứng sẵn
          const url = urls[a.path_cham ?? a.path] // có bản TA đã vẽ thì xem bản đó
          return (
            <div key={a.id} className={`relative shrink-0 ${dangBo === a.id ? 'opacity-40' : ''}`}>
              <button onClick={() => url && setTo({ url, xoay: goc })} className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {url ? <img src={url} alt="" className="max-h-full max-w-full object-contain transition-transform" style={{ transform: `rotate(${goc}deg)` }} /> : <div className="h-36 w-24 rounded-lg bg-slate-100" />}
              </button>
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 text-[11px] font-bold text-white">{i + 1}</span>
              {laAnhTaThem(a.path) && !n.tra_at && (
                <button onClick={() => bo(a.id, i + 1)} disabled={!!dangBo} title="Bỏ ảnh thêm nhầm"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-[14px] font-bold text-white shadow active:bg-rose-500">✕</button>
              )}
              <div className="mt-1 flex justify-center gap-1">
                <button onClick={() => lam(a.id, () => doiChoAnh(a.id, -1))} disabled={!!dangBo || i === 0} title="Đổi chỗ với ảnh trước"
                  className="h-8 w-9 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 disabled:opacity-30">◀</button>
                <button onClick={() => lam(a.id, () => xoayAnh(a.id, a.xoay + 90))} disabled={!!dangBo || !!a.path_cham}
                  title={a.path_cham ? 'Trang này đã có bản chấm vẽ tay — đã đứng đúng chiều' : 'Xoay 90° theo chiều kim đồng hồ'}
                  className="h-8 w-9 rounded-lg border border-slate-200 bg-white text-[14px] font-bold text-slate-600 disabled:opacity-30">↻</button>
                <button onClick={() => lam(a.id, () => doiChoAnh(a.id, 1))} disabled={!!dangBo || i === n.anh.length - 1} title="Đổi chỗ với ảnh sau"
                  className="h-8 w-9 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 disabled:opacity-30">▶</button>
              </div>
            </div>
          )
        })}
      </div>
      {loi && <p className="mt-1.5 rounded-lg bg-rose-50 px-2 py-1 text-[12px] text-rose-700">{loi}</p>}
      {to && (
        <div onClick={() => setTo(null)} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-2">
          <img src={to.url} alt="" className="max-h-full max-w-full object-contain" style={to.xoay % 180 ? { transform: `rotate(${to.xoay}deg)`, maxWidth: '100dvh', maxHeight: '100vw' } : { transform: `rotate(${to.xoay}deg)` }} />
        </div>
      )}
    </div>
  )
}
