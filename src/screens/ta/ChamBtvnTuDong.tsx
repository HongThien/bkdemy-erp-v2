// ChamBtvnTuDong — "🤖 Chấm BTVN tự động" của app trợ giảng, MỘT MÀN DUY NHẤT (CEO 08/11/2026: "ít phải chuyển màn
// càng tốt, cả trên điện thoại"):
//   trên cùng: dropdown LỚP (lớp TA phụ trách lên đầu) + dropdown BUỔI (mặc định buổi gần nhất chưa đóng)
//   máy tính/iPad: cột HỌC SINH bên trái, bài của em đang chọn bên phải · điện thoại: dải học sinh vuốt ngang ngay dưới
//   bấm em → đẩy ảnh → Gửi chấm → bấm em khác (hoặc "Em tiếp ›") — không rời màn.
// Máy chỉ GỢI Ý (bảng nháp btvn_ai_*); TA xác nhận mới ghi gami_grades. Chế độ HÀNG ĐỢI: máy CEO chạy /cham-btvn-hang-doi.
import { useEffect, useState } from 'react'
import { getRoster, listProblems, loadBTVNForBuoi, syncBTVNProblems, loadHinhForBuoiPhase, syncHinhProblems, type BuoiHocHS, type Problem } from '../../lib/gami'
import { lopChamAi, listBuoiBtvnCuaLop, listNopTheoBuoi, signUrls, trangThaiAiTheoBuoi, boAnh, laAnhTaThem, xoayAnh, doiChoAnh, type LopAi, type BuoiBtvn, type BtvnNop, type AiTrangThai } from '../../lib/btvnnop'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import { BK_TROI } from '../../components/bk/BKUI'
import ChamTuDongBtvn from './ChamTuDongBtvn'

// Lớp/buổi/em đang chọn nhớ tới F5: quay lại màn là đúng chỗ cũ (CLAUDE.md §2, màn làm việc theo hàng đợi).
const NHO: { lopId: string | null; buoiId: string | null; hsId: string | null } = { lopId: null, buoiId: null, hsId: null }

const nhanBuoi = (b: BuoiBtvn) => `${thuCuaNgay(b.ngay)} ${ddmmVN(b.ngay)}${b.dong ? ' · đã đóng' : ''}`

export default function ChamBtvnTuDong({ onBack }: { onBack: () => void }) {
  const [dsLop, setDsLop] = useState<LopAi[] | null>(null)
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [dsBuoi, setDsBuoi] = useState<BuoiBtvn[] | null>(null)
  const [buoiId, setBuoiId] = useState<string | null>(NHO.buoiId)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { NHO.lopId = lopId; NHO.buoiId = buoiId }, [lopId, buoiId])

  useEffect(() => { lopChamAi().then((ds) => {
    setDsLop(ds)
    if (!lopId) { const l = ds.find((x) => x.phu_trach); if (l) setLopId(l.lop_id) } // mặc định lớp phụ trách đầu tiên
  }).catch((e) => setLoi(e.message ?? String(e))) }, []) // eslint-disable-line

  // Đổi lớp ⇒ nạp buổi có phiếu BTVN; giữ buổi cũ nếu còn thuộc lớp, không thì buổi gần nhất chưa đóng.
  useEffect(() => {
    if (!lopId) return
    setDsBuoi(null)
    listBuoiBtvnCuaLop(lopId).then((ds) => {
      const co = ds.filter((b) => b.co_phieu).sort((a, b) => (a.ngay < b.ngay ? 1 : -1))
      setDsBuoi(co)
      setBuoiId((cu) => (cu && co.some((b) => b.id === cu) ? cu : (co.find((b) => !b.dong) ?? co[0])?.id ?? null))
    }).catch((e) => setLoi(e.message ?? String(e)))
  }, [lopId])

  const buoi = dsBuoi?.find((b) => b.id === buoiId) ?? null
  const cuaToi = (dsLop ?? []).filter((l) => l.phu_trach)
  const khac = (dsLop ?? []).filter((l) => !l.phu_trach)
  const chon = 'min-h-[38px] min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-[13.5px] font-bold text-slate-800'

  return (
    <div className="flex h-[100dvh] flex-col" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", background: BK_TROI }}>
      <div className="flex items-center gap-1.5 bg-white/95 px-2 py-1.5 shadow-sm" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 6px)' }}>
        <button onClick={onBack} aria-label="Quay lại" className="rounded-lg px-2 py-1.5 text-[15px] font-semibold text-slate-600 active:bg-slate-100">‹</button>
        <span className="hidden text-[14px] font-extrabold text-slate-800 sm:inline">🤖 Chấm tự động</span>
        <select value={lopId ?? ''} onChange={(e) => { setLopId(e.target.value || null); NHO.hsId = null }} className={`${chon} flex-1 sm:max-w-[210px]`}>
          <option value="" disabled>{dsLop ? 'Chọn lớp' : 'Đang tải lớp…'}</option>
          {cuaToi.length > 0 && <optgroup label="Lớp bạn phụ trách">{cuaToi.map((l) => <option key={l.lop_id} value={l.lop_id}>{l.ten_lop} · {l.mon}</option>)}</optgroup>}
          <optgroup label="Lớp khác">{khac.map((l) => <option key={l.lop_id} value={l.lop_id}>{l.ten_lop} · {l.mon}</option>)}</optgroup>
        </select>
        <select value={buoiId ?? ''} onChange={(e) => { setBuoiId(e.target.value || null); NHO.hsId = null }} disabled={!dsBuoi?.length} className={`${chon} flex-1 disabled:opacity-50 sm:max-w-[210px]`}>
          {!dsBuoi ? <option value="">{lopId ? 'Đang tải buổi…' : 'Chọn buổi'}</option>
            : !dsBuoi.length ? <option value="">Chưa có phiếu BTVN</option>
            : dsBuoi.map((b) => <option key={b.id} value={b.id}>{nhanBuoi(b)}</option>)}
        </select>
      </div>
      {loi && <p className="mx-2 mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">⚠ {loi}</p>}
      {buoi ? <BangCham key={buoi.id} buoi={buoi} />
        : <p className="px-4 py-6 text-[13px] text-slate-500">{lopId ? (dsBuoi && !dsBuoi.length ? 'Lớp này chưa có buổi nào giao phiếu BTVN.' : '') : 'Chọn lớp ở trên để bắt đầu.'}</p>}
    </div>
  )
}

type TrangThai = { mau: string; nhan: string }
function trangThai(n: BtvnNop | undefined, a: AiTrangThai | undefined): TrangThai {
  if (a?.cho_cham) return { mau: 'bg-sky-500', nhan: '⏳ chờ máy chấm' }
  if (a?.lan_moi_at && !a.chot) return { mau: 'bg-amber-500', nhan: '🤖 chờ xác nhận' }
  if (a?.chot) return { mau: 'bg-emerald-500', nhan: '✓ đã xác nhận' }
  if (n?.anh.length) return { mau: 'bg-teal-400', nhan: `📷 ${n.anh.length} ảnh` }
  return { mau: 'bg-slate-300', nhan: 'chưa có ảnh' }
}

// Bảng chấm của 1 buổi: danh sách HS (cột trái / dải ngang trên điện thoại) + bài của em đang chọn.
function BangCham({ buoi }: { buoi: BuoiBtvn }) {
  const [roster, setRoster] = useState<BuoiHocHS[] | null>(null)
  const [probs, setProbs] = useState<Problem[]>([])
  const [nop, setNop] = useState<Record<string, BtvnNop>>({})
  const [ai, setAi] = useState<Record<string, AiTrangThai>>({})
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [hsId, setHsId] = useState<string | null>(NHO.hsId)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { NHO.hsId = hsId }, [hsId])

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
    try {
      const [, , , r] = await Promise.all([napLuoi(), reloadNop(), reloadAi(), getRoster(buoi.id)])
      setRoster(r)
      setHsId((cu) => (cu && r.some((x) => x.hoc_sinh_id === cu) ? cu : r.find((x) => x.diem_danh === 'co_mat')?.hoc_sinh_id ?? r[0]?.hoc_sinh_id ?? null))
    } catch (e: any) { setLoi(e.message ?? String(e)) }
  })() }, [buoi.id]) // eslint-disable-line

  if (loi) return <p className="m-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">⚠ {loi}</p>
  if (!roster) return <p className="px-4 py-6 text-[13px] text-slate-500">Đang tải học sinh…</p>
  // Có mặt lên trước; em vắng vẫn chọn được (bài nộp sau / học bù vẫn là bài thật).
  const ds = [...roster.filter((x) => x.diem_danh === 'co_mat'), ...roster.filter((x) => x.diem_danh !== 'co_mat')]
  const ten = tenHienThiDs(ds.map((x) => x.hoc_sinh?.ho_ten))
  const i = ds.findIndex((x) => x.hoc_sinh_id === hsId)
  const r = i >= 0 ? ds[i] : null
  const n = r ? nop[r.hoc_sinh_id] : undefined
  const reloadCa = async () => { await reloadNop(); await reloadAi() }

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {/* Danh sách HS: điện thoại = dải ngang vuốt được (luôn thấy, không chiếm màn) · máy tính/iPad = cột trái */}
      <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-200 bg-white/80 px-2 py-1.5 md:w-60 md:flex-col md:overflow-y-auto md:overflow-x-visible md:border-b-0 md:border-r md:py-2">
        <p className="hidden px-1 text-[11px] font-bold text-slate-500 md:block">{ds.length} học sinh · {probs.length} câu</p>
        {ds.map((x, k) => {
          const t = trangThai(nop[x.hoc_sinh_id], ai[x.hoc_sinh_id])
          const on = x.hoc_sinh_id === hsId
          return (
            <button key={x.id} onClick={() => setHsId(x.hoc_sinh_id)} title={t.nhan}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-left md:w-full ${on ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white active:bg-slate-50'}`}>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${t.mau}`} />
              <span className="min-w-0">
                <span className={`block truncate text-[13px] font-bold ${on ? 'text-violet-800' : 'text-slate-800'}`}>{ten[k]}{x.diem_danh !== 'co_mat' && <span className="ml-1 text-[10px] font-semibold text-slate-400">vắng</span>}</span>
                <span className="hidden text-[11px] text-slate-500 md:block">{t.nhan}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Bài của em đang chọn */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 md:px-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        {!r ? <p className="px-2 py-6 text-[13px] text-slate-500">Buổi này chưa có học sinh.</p> : (
          <div className="mx-auto flex max-w-[900px] flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="min-w-0 flex-1 truncate text-[15px] font-extrabold text-slate-900">{ten[i]}
                <span className="ml-2 text-[12px] font-semibold text-slate-500">{trangThai(n, ai[r.hoc_sinh_id]).nhan}</span>
              </p>
              <button onClick={() => setHsId(ds[(i + 1) % ds.length].hoc_sinh_id)} disabled={ds.length < 2}
                className="min-h-[34px] shrink-0 rounded-lg border border-slate-200 bg-white px-3 text-[12.5px] font-bold text-slate-700 active:bg-slate-50 disabled:opacity-40">Em tiếp ›</button>
            </div>
            {probs.length === 0 && <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">Buổi này chưa có lưới câu BTVN (phiếu chưa gán đúng lớp + ngày) — chưa chấm được.</p>}
            <XemAnh key={r.hoc_sinh_id} n={n} urls={urls} reloadNop={reloadCa} />
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <ChamTuDongBtvn key={r.hoc_sinh_id} buoiId={buoi.id} hsId={r.hoc_sinh_id} probs={probs} dong={buoi.dong} coAnh={!!n?.anh.length} daTra={!!n?.tra_at}
                tenCau={(p) => (p.hinh_baitoan_id ? `Bài ${p.hinh_nhan}` : `Câu ${p.problem_no}`)}
                reloadNop={reloadCa} reloadP={reloadAi} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Xem xấp ảnh (thứ tự = thu_tu, máy đã sắp lại sau khi chấm). Bấm ảnh để phóng to.
// ✕ = bỏ ảnh TA thêm nhầm (chỉ ảnh TA tự thêm, bài chưa trả PH) — không xoá, DB đánh dấu bo_at.
// ◀ ▶ = đổi chỗ (PH/TA đẩy nhầm thứ tự) · ↻ = xoay 90° (ảnh chụp ngang/ngược). Chỉ đổi cách hiển thị, ảnh gốc giữ nguyên.
function XemAnh({ n, urls, reloadNop }: { n?: BtvnNop; urls: Record<string, string>; reloadNop: () => Promise<void> }) {
  const [to, setTo] = useState<{ url: string; xoay: number } | null>(null)
  const [dangBo, setDangBo] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  async function lam(id: string, viec: () => Promise<void>) {
    if (dangBo) return
    setDangBo(id); setLoi(null)
    try { await viec(); await reloadNop() } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangBo(null) }
  }
  async function bo(id: string, so: number) {
    if (dangBo || !confirm(`Bỏ ảnh ${so}? Ảnh sẽ không còn trong bài của em (dùng khi thêm nhầm).`)) return
    await lam(id, () => boAnh(id))
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
