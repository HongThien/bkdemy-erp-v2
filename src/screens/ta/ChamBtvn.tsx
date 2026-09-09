// ChamBtvn — màn CHẤM BTVN HỢP NHẤT 2 ĐƯỜNG (PLAN-app-ta.md §5, CEO chốt 30/08 ④⑤⑥):
// · HS nộp APP (📱): xem xấp ảnh + VẼ ĐÁNH DẤU lên ảnh (bản mới path_cham, ảnh gốc immutable)
//   + Đ/C/S per câu (gami_grades — ĐÚNG đường cũ) + trạng thái nộp HỆ ĐỀ XUẤT (TA tick xác nhận)
//   + nhận xét CHỌN TỪ LIST + 📤 Trả bài → PH thấy bài chấm + đáp án.
// · HS không nộp app: chấm nhập tay từ bài Zalo y hệt BtvnTab ERP (2 đường sống song song).
// Đóng BTVN = fn_dong_btvn (EXP như cũ + TỰ TRẢ nốt lượt nộp đã chấm). BTVN vẫn THAM KHẢO —
// không mastery/Elo (CEO ⑦).
// Màn chấm 1 HS (09/09): full-screen, landscape = ảnh+tool 70% trái · form 30% phải; portrait = xếp dọc.
// HS không có ảnh = chấm giấy, chỉ có form.
import { useEffect, useRef, useState } from 'react'
import {
  listProblems, listGrades, gradeET, gradeETBulk, deleteGrade, loadBTVNForBuoi, syncBTVNProblems,
  loadHinhForBuoiPhase, syncHinhProblems, getBtvnKetQua, setBtvnKetQua, closeBTVN, reopenBTVN,
  listCanhBao,
  type BuoiHocHS, type Problem, type Grade, type ETResult, type BtvnKQ, type BtvnTrangThai, type BtvnThaiDo, type CanhBao, type DangTaiLieu,
} from '../../lib/gami'
import { listNopTheoBuoi, deXuatTrangThai, signUrls, uploadAnhCham, listNhanXetMau, setNhanXet, traBai, xacNhanBuoi, chuyenBuoi, listBuoiBtvnCuaLop, type BtvnNop, type BtvnNopAnh, type NhanXetMau, type BuoiBtvn } from '../../lib/btvnnop'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import { ET_KQ, DongBar, type BuoiFull } from './ChamBuoi'
import { ChuongBaoDong, ChipCanhBao, useDangTaiLieu, hopDang } from '../../components/ChuongBaoDong'

const NOP_OPTS: { v: BtvnTrangThai; l: string }[] = [
  { v: 'nop_dung_han', l: 'Nộp đúng hạn' }, { v: 'nop_muon', l: 'Nộp muộn' }, { v: 'xin_phep', l: 'Đã xin phép' }, { v: 'khong_lam', l: 'Không làm bài' },
]
const THAIDO_OPTS: { v: BtvnThaiDo; l: string }[] = [
  { v: 'nghiem_tuc', l: 'Nghiêm túc' }, { v: 'chua_het_suc', l: 'Chưa hết sức' }, { v: 'chua_nghiem_tuc', l: 'Chưa nghiêm túc' }, { v: 'chong_doi', l: 'Chống đối' },
]

type DeXuat = { nopAt: string; deXuat: string }

export default function ChamBtvn({ buoi, roster, tenDang, napTenDang, onChange }: {
  buoi: BuoiFull; roster: BuoiHocHS[]; tenDang: (md: string | null) => string
  napTenDang: (mds: (string | null)[]) => Promise<void>; onChange: () => void
}) {
  const buoiId = buoi.id
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [missing, setMissing] = useState(false)
  const [kq, setKq] = useState<Record<string, BtvnKQ>>({})
  const [nop, setNop] = useState<Record<string, BtvnNop>>({})
  const [deXuat, setDeXuat] = useState<Record<string, DeXuat>>({})
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [nxMau, setNxMau] = useState<NhanXetMau[]>([])
  const [cb, setCb] = useState<CanhBao[]>([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [hsMo, setHsMo] = useState<string | null>(null)
  const dong = !!buoi.btvn_dong_at
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  // HS nộp app nhưng KHÔNG co_mat (vắng/chưa điểm danh) vẫn hiện để chấm — bài đã nộp là bài thật.
  const themNop = roster.filter((r) => r.diem_danh !== 'co_mat' && nop[r.hoc_sinh_id])
  const dsHS = [...coMat, ...themNop]
  const tenHT = tenHienThiDs(dsHS.map((r) => r.hoc_sinh?.ho_ten))
  const dangBuoi = [...new Set(probs.map((p) => p.ma_dang).filter(Boolean))] as string[]
  const dangTL = useDangTaiLieu(buoi.id, 'btvn', buoi.lop?.mon) // 🚨 luật chung chuông (CEO 09/09): dạng có trong PHIẾU BTVN

  async function reloadP() {
    const [p, g] = await Promise.all([listProblems(buoiId, 'btvn'), listGrades(buoiId)])
    setProbs(p); setGrades(g); napTenDang(p.map((x) => x.ma_dang))
  }
  async function reloadNop() {
    const n = await listNopTheoBuoi(buoiId)
    setNop(n)
    const paths = Object.values(n).flatMap((x) => x.anh.flatMap((a) => [a.path, a.path_cham].filter(Boolean) as string[]))
    setUrls(await signUrls(paths).catch(() => ({})))
  }
  useEffect(() => { (async () => {
    setLoading(true)
    try {
      const { btvnId, caus } = await loadBTVNForBuoi(buoiId)
      // TUẦN TỰ — Đại + Hình chia sẻ slot problem_no (xem BtvnTab ERP).
      if (btvnId) await syncBTVNProblems(buoiId, caus, dong)
      const { dapAn: hinhDapAn } = await loadHinhForBuoiPhase(buoiId, 'btvn')
      if (hinhDapAn.length) await syncHinhProblems(buoiId, 'btvn', hinhDapAn, dong)
      setMissing(!btvnId && !hinhDapAn.length)
      await reloadP()
    } catch { setMissing(true) }
    try {
      const [k, dx, nx, c] = await Promise.all([
        getBtvnKetQua(buoiId), deXuatTrangThai(buoiId).catch(() => ({})), listNhanXetMau().catch(() => []), listCanhBao(buoiId).catch(() => []),
      ])
      setKq(k); setDeXuat(dx); setNxMau(nx); setCb(c)
      await reloadNop()
    } catch { /* bảng nộp chưa có (migration chưa áp) → app vẫn chấm đường tay */ }
    setLoading(false)
  })() }, [buoiId]) // eslint-disable-line

  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  async function pickKQ(pid: string, hsId: string, result: ETResult) {
    const g = gradeOf(pid, hsId)
    try { if (g?.result === result) await deleteGrade(pid, hsId); else await gradeET({ buoiId, problemId: pid, hocSinhId: hsId, result, loi: [] }); await reloadP() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function bulkRow(hsId: string, result: ETResult) {
    if (!probs.length) return
    const daCham = probs.filter((p) => gradeOf(p.id, hsId)).length
    if (daCham > 0 && !confirm(`Đã chấm ${daCham}/${probs.length} câu — GHI ĐÈ tất cả thành "${ET_KQ.find((k) => k.v === result)?.lbl}"?`)) return
    try { await gradeETBulk({ buoiId, hocSinhId: hsId, problemIds: probs.map((p) => p.id), result }); await reloadP() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function setKQField(hsId: string, patch: Partial<BtvnKQ>) {
    setKq((m) => ({ ...m, [hsId]: { ...(m[hsId] ?? { trang_thai_nop: null, thai_do: null }), ...patch } }))
    try { await setBtvnKetQua(buoiId, hsId, patch) } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function dong_() {
    if (closing) return
    if (!confirm('Đóng BTVN? Thưởng EXP theo trạng thái nộp + tự TRẢ BÀI các lượt nộp app đã chấm.')) return
    setClosing(true)
    try { const r = await closeBTVN(buoiId); if (r.already) alert('BTVN đã đóng.'); else { alert(`Đã đóng BTVN — thưởng EXP cho ${r.thuong} HS.`); onChange() } }
    catch (e: any) { alert(e?.message ?? String(e)) } finally { setClosing(false) }
  }
  async function traBai_(hsId: string) {
    try { await traBai(buoiId, hsId); await reloadNop() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  // Hệ chỉ GÁN TẠM buổi khi PH nộp không định danh — TA chốt tại đây (CEO 30/08 đêm).
  async function xacNhan_(hsId: string) {
    try { await xacNhanBuoi(buoiId, hsId); await reloadNop() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function chuyen_(hsId: string, buoiMoi: string) {
    try { await chuyenBuoi(hsId, buoiId, buoiMoi); setHsMo(null); await reloadNop() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function toggleNhanXet(hsId: string, ma: string) {
    const n = nop[hsId]
    if (!n) return
    const on = n.nhan_xet_ma.includes(ma)
    const next = on ? n.nhan_xet_ma.filter((x) => x !== ma) : [...n.nhan_xet_ma, ma]
    setNop((cur) => ({ ...cur, [hsId]: { ...cur[hsId], nhan_xet_ma: next } }))
    try { await setNhanXet(buoiId, hsId, next) } catch (e: any) { alert(e.message ?? String(e)); reloadNop() }
  }

  if (loading) return <p className="text-[13px] text-slate-400">Đang tải BTVN…</p>
  if (missing && Object.keys(nop).length === 0)
    return <p className="text-[13px] text-slate-400">Chưa có BTVN cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>) và chưa có HS nào nộp qua app.</p>
  if (dsHS.length === 0) return <p className="text-[13px] text-slate-400">Chưa có HS điểm danh "có mặt" và chưa ai nộp app.</p>

  const soNop = Object.keys(nop).length
  const iMo = dsHS.findIndex((r) => r.hoc_sinh_id === hsMo)
  const rMo = iMo >= 0 ? dsHS[iMo] : null
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[12px] text-slate-400">{probs.length} câu · {dsHS.length} HS{soNop > 0 && <> · <b className="text-teal-700">📱 {soNop} nộp app</b></>}</span>
        <div className="ml-auto"><DongBar dong={dong} dongLbl="Đóng BTVN" onDong={dong_} onMoLai={async () => { if (!confirm('Mở lại BTVN? EXP đã thưởng sẽ tính lại khi đóng.')) return; await reopenBTVN(buoiId); onChange() }} closing={closing} /></div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {dsHS.map((r, i) => {
          const hsId = r.hoc_sinh_id
          const n = nop[hsId]
          const dx = deXuat[hsId]
          const daChamSo = probs.filter((p) => gradeOf(p.id, hsId)).length
          const daVe = n?.anh.filter((a) => a.path_cham).length ?? 0
          return (
            <button key={r.id} onClick={() => setHsMo(hsId)} className="flex min-h-[52px] w-full items-center gap-2 rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-left shadow-sm active:bg-slate-50">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-slate-800">
                  <span className="truncate">{tenHT[i]}</span>
                  {r.diem_danh !== 'co_mat' && <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">vắng buổi</span>}
                </p>
                <p className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-slate-400">
                  {n ? (
                    <>
                      <span className="rounded bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-700">📱 {n.anh.length} ảnh{daVe > 0 && ` · ✎ ${daVe}`}</span>
                      {!n.buoi_xac_nhan_at && <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-700">⚠ chưa chốt buổi</span>}
                      {dx && <span className={`rounded px-1.5 py-0.5 font-semibold ${dx.deXuat === 'nop_dung_han' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600'}`}>đề xuất: {dx.deXuat === 'nop_dung_han' ? 'đúng hạn' : 'nộp muộn'}</span>}
                      {n.tra_at ? <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-600">✓ đã trả PH</span> : null}
                    </>
                  ) : <span>chấm giấy / Zalo</span>}
                  {probs.length > 0 && <span>· chấm {daChamSo}/{probs.length}</span>}
                </p>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          )
        })}
      </div>

      {rMo && (
        <ChamMotHS key={rMo.hoc_sinh_id} r={rMo} ten={tenHT[iMo]} buoi={buoi} n={nop[rMo.hoc_sinh_id]} dx={deXuat[rMo.hoc_sinh_id]}
          v={kq[rMo.hoc_sinh_id] ?? { trang_thai_nop: null, thai_do: null }} probs={probs} gradeOf={gradeOf} dong={dong}
          urls={urls} nxMau={nxMau} dangTaiLieu={hopDang(dangTL.dang, dangBuoi, tenDang)} dangLoading={dangTL.loading} tenDang={tenDang} cb={cb.filter((x) => x.hoc_sinh_id === rMo.hoc_sinh_id)}
          onClose={() => setHsMo(null)} pickKQ={pickKQ} bulkRow={bulkRow} setKQField={setKQField} traBai={traBai_}
          xacNhan={xacNhan_} chuyen={chuyen_} toggleNhanXet={toggleNhanXet} reloadNop={reloadNop}
          onCanhBaoChanged={async () => setCb(await listCanhBao(buoiId))} />
      )}
    </div>
  )
}

// ── MÀN CHẤM 1 HS — full-screen. Landscape: ảnh+tool 70% trái · form 30% phải. Portrait: ảnh trên, form dưới.
// HS không có ảnh (chấm giấy) → chỉ form.
function ChamMotHS({ r, ten, buoi, n, dx, v, probs, gradeOf, dong, urls, nxMau, dangTaiLieu, dangLoading, tenDang, cb,
  onClose, pickKQ, bulkRow, setKQField, traBai, xacNhan, chuyen, toggleNhanXet, reloadNop, onCanhBaoChanged }: {
  r: BuoiHocHS; ten: string; buoi: BuoiFull; n?: BtvnNop; dx?: DeXuat; v: BtvnKQ; probs: Problem[]
  gradeOf: (pid: string, hsId: string) => Grade | undefined; dong: boolean; urls: Record<string, string>
  nxMau: NhanXetMau[]; dangTaiLieu: DangTaiLieu[]; dangLoading: boolean; tenDang: (md: string | null) => string; cb: CanhBao[]
  onClose: () => void; pickKQ: (pid: string, hsId: string, result: ETResult) => void; bulkRow: (hsId: string, result: ETResult) => void
  setKQField: (hsId: string, patch: Partial<BtvnKQ>) => void; traBai: (hsId: string) => void; xacNhan: (hsId: string) => void
  chuyen: (hsId: string, buoiMoi: string) => void; toggleNhanXet: (hsId: string, ma: string) => void
  reloadNop: () => Promise<void>; onCanhBaoChanged: () => Promise<void>
}) {
  const hsId = r.hoc_sinh_id
  const coAnh = !!n && n.anh.length > 0
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-100" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex min-h-[46px] items-center gap-2 border-b border-slate-200 bg-white px-3">
        <button onClick={onClose} className="rounded-lg px-2.5 py-1.5 text-[13.5px] font-semibold text-slate-600 active:bg-slate-100">‹ Danh sách</button>
        <p className="min-w-0 flex-1 truncate text-[14px] font-bold text-slate-900">{ten}
          {r.diem_danh !== 'co_mat' && <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">vắng buổi</span>}
          {!coAnh && <span className="ml-1.5 text-[11.5px] font-medium text-slate-400">chấm giấy</span>}
        </p>
        {n && (n.tra_at
          ? <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[12px] font-semibold text-indigo-600">✓ Đã trả PH</span>
          : <button onClick={() => { if (confirm('Trả bài cho PH? PH sẽ thấy ảnh bài chấm + kết quả + đáp án chi tiết.')) traBai(hsId) }}
              disabled={!n.buoi_xac_nhan_at} title={n.buoi_xac_nhan_at ? '' : 'Chốt buổi trước đã'}
              className="min-h-[36px] rounded-lg bg-indigo-600 px-3 text-[12.5px] font-semibold text-white active:bg-indigo-500 disabled:opacity-40">📤 Trả bài PH</button>)}
      </div>

      <div className="flex min-h-0 flex-1 flex-col landscape:flex-row">
        {coAnh && (
          <div className="flex min-h-0 flex-col border-slate-200 portrait:h-[55%] portrait:border-b landscape:w-[70%] landscape:border-r">
            <VeAnh key={hsId} anhDs={n!.anh} urls={urls} reloadNop={reloadNop} />
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto bg-white px-3 py-2.5">
          {n && !n.buoi_xac_nhan_at && !dong && (
            <ChotBuoiBanner lopId={buoi.lop_id ?? ''} buoiNgay={buoi.ngay} onDungBuoi={() => xacNhan(hsId)} onChuyen={(bm) => chuyen(hsId, bm)} />
          )}

          <p className="mb-1 text-[11px] font-semibold text-slate-400">Trạng thái nộp{dx ? ' (hệ đề xuất ←)' : ''}:</p>
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {NOP_OPTS.map((o) => (
              <button key={o.v} disabled={dong} onClick={() => setKQField(hsId, { trang_thai_nop: v.trang_thai_nop === o.v ? null : o.v })}
                className={`min-h-[34px] rounded-lg border px-2.5 text-[12px] font-semibold disabled:opacity-50 ${v.trang_thai_nop === o.v ? 'border-transparent bg-teal-600 text-white' : dx && dx.deXuat === o.v && !v.trang_thai_nop ? 'border-teal-400 border-dashed text-teal-700' : 'border-slate-200 text-slate-500'}`}>{o.l}{dx && dx.deXuat === o.v && !v.trang_thai_nop ? ' ←' : ''}</button>
            ))}
          </div>
          <p className="mb-1 text-[11px] font-semibold text-slate-400">Thái độ:</p>
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {THAIDO_OPTS.map((o) => (
              <button key={o.v} disabled={dong} onClick={() => setKQField(hsId, { thai_do: v.thai_do === o.v ? null : o.v })}
                className={`min-h-[34px] rounded-lg border px-2.5 text-[12px] font-semibold disabled:opacity-50 ${v.thai_do === o.v ? 'border-transparent bg-slate-700 text-white' : 'border-slate-200 text-slate-500'}`}>{o.l}</button>
            ))}
          </div>

          {/* chấm per câu Đ/C/S (tham khảo — không mastery/Elo) */}
          {probs.length > 0 && (
            <div className="mb-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Tất cả:</span>
                {ET_KQ.map((k) => (
                  <button key={k.v} onClick={() => bulkRow(hsId, k.v)} disabled={dong} className={`h-8 w-9 rounded-lg border bg-white text-[12px] font-bold ${k.idle} disabled:opacity-40`}>{k.lbl}</button>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                {probs.map((p) => {
                  const g = gradeOf(p.id, hsId)
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[12px] text-slate-600">
                        <b>{p.hinh_baitoan_id ? `Bài ${p.hinh_nhan}` : `Câu ${p.problem_no}`}</b>
                        <span className="text-slate-400"> · {p.hinh_baitoan_id ? 'Hình' : tenDang(p.ma_dang)}</span>
                      </span>
                      <div className="flex gap-1">
                        {ET_KQ.map((k) => (
                          <button key={k.v} onClick={() => pickKQ(p.id, hsId, k.v)} disabled={dong}
                            className={`h-9 w-10 rounded-lg border text-[13px] font-bold transition ${g?.result === k.v ? k.sel : `${k.idle} bg-white`} ${dong && g?.result !== k.v ? 'opacity-40' : ''}`}>{k.lbl}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* nhận xét gửi PH — CHỌN TỪ LIST (CEO 30/08), chỉ có nghĩa với lượt nộp app */}
          {n && nxMau.length > 0 && (
            <div className="mb-2.5">
              <p className="mb-1 text-[11px] font-semibold text-slate-400">Nhận xét gửi PH (chọn):</p>
              <div className="flex flex-wrap gap-1.5">
                {nxMau.map((m) => {
                  const on = n.nhan_xet_ma.includes(m.ma)
                  return (
                    <button key={m.ma} onClick={() => toggleNhanXet(hsId, m.ma)}
                      className={`rounded-lg border px-2 py-1 text-left text-[11.5px] font-medium ${on ? 'border-transparent bg-teal-600 text-white' : 'border-slate-200 text-slate-500'}`}>{m.noi_dung}</button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 🚨 chuông dùng chung (CEO 09/09): luôn bấm được, dạng = có trong phiếu BTVN + ghi chú */}
          <div className="flex flex-wrap items-center gap-1.5">
            <ChuongBaoDong buoiId={buoi.id} hsId={hsId} hsTen={r.hoc_sinh?.ho_ten ?? '?'} nguon="btvn" khoi={buoi.lop?.khoi} mon={buoi.lop?.mon} nhan="Kém dạng"
              className="min-h-[38px] rounded-lg border border-rose-200 px-2.5 text-[12.5px] font-semibold text-rose-600 active:bg-rose-50"
              dangTaiLieu={dangTaiLieu} dangLoading={dangLoading} onSaved={() => { void onCanhBaoChanged() }} />
            <ChipCanhBao cb={cb} tenDang={tenDang} mon={buoi.lop?.mon} onChanged={() => { void onCanhBaoChanged() }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Banner chốt buổi: "✓ Đúng buổi này" hoặc "→ Buổi khác" (picker 12 buổi có BTVN của lớp).
function ChotBuoiBanner({ lopId, buoiNgay, onDungBuoi, onChuyen }: {
  lopId: string; buoiNgay: string; onDungBuoi: () => void; onChuyen: (buoiMoi: string) => void
}) {
  const [moPicker, setMoPicker] = useState(false)
  const [dsBuoi, setDsBuoi] = useState<BuoiBtvn[] | null>(null)
  async function moChuyen() {
    setMoPicker(true)
    if (!dsBuoi && lopId) setDsBuoi(await listBuoiBtvnCuaLop(lopId).catch(() => []))
  }
  return (
    <div className="mb-2.5 rounded-xl border border-amber-300 bg-amber-50 p-2.5">
      <p className="mb-1.5 text-[12px] font-medium text-amber-800">⚠ PH nộp không chọn buổi — hệ <b>gán tạm</b> vào buổi học gần nhất. Nộp muộn/nộp bù thì chuyển sang đúng buổi; chốt rồi mới trả bài được.</p>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={onDungBuoi} className="min-h-[36px] rounded-lg bg-amber-600 px-3 text-[12.5px] font-bold text-white active:bg-amber-500">✓ Đúng buổi này</button>
        <button onClick={moChuyen} className="min-h-[36px] rounded-lg border border-amber-400 px-3 text-[12.5px] font-semibold text-amber-800 active:bg-amber-100">→ Bài thuộc buổi khác</button>
      </div>
      {moPicker && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setMoPicker(false)}>
          <div className="max-h-[70dvh] w-full max-w-[440px] overflow-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-2 text-[14px] font-bold text-slate-900">Chuyển bài sang buổi nào?</p>
            {dsBuoi === null ? <p className="text-[12px] text-slate-400">Đang tải…</p>
              : dsBuoi.filter((b) => b.ngay !== buoiNgay).length === 0 ? <p className="text-[12px] text-slate-400">Lớp không có buổi nào khác trong 60 ngày gần đây.</p>
              : dsBuoi.filter((b) => b.ngay !== buoiNgay).map((b) => (
                <button key={b.id} onClick={() => { setMoPicker(false); onChuyen(b.id) }}
                  className="mb-1.5 flex min-h-[44px] w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-left active:bg-slate-50">
                  <span className="text-[13.5px] font-semibold text-slate-800">{thuCuaNgay(b.ngay)} · {ddmmVN(b.ngay)}</span>
                  <span className="ml-auto flex gap-1">
                    {b.co_phieu ? <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-teal-700">có phiếu BTVN</span>
                      : <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-400">không có phiếu</span>}
                    {b.dong && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500">đã đóng</span>}
                  </span>
                </button>
              ))}
            <button onClick={() => setMoPicker(false)} className="mt-1 min-h-[40px] w-full rounded-lg text-[13px] text-slate-500">Huỷ</button>
          </div>
        </div>
      )}
    </div>
  )
}


// ── VẼ ĐÁNH DẤU lên xấp ảnh. Ảnh = <img> lớp dưới, nét vẽ = canvas TRONG SUỐT lớp trên (tẩy chỉ xoá nét,
// không đụng ảnh); Lưu = ghép 2 lớp thành PNG MỚI (path_cham) — ảnh gốc immutable. Nét CHƯA LƯU của từng
// trang giữ trong memory khi chuyển trang (mất khi đóng màn). Toạ độ chạm map qua tỉ lệ rect (né zoom CSS).
type Tool = 'do' | 'xanh' | 'tay' | 'check' | 'cross' | 'text'
type Mark =
  | { k: 'net'; mau: string; tay: boolean; pts: { x: number; y: number }[] }
  | { k: 'dau'; loai: 'check' | 'cross'; x: number; y: number }
  | { k: 'text'; x: number; y: number; text: string }
const TOOLS: { t: Tool; lbl: string; cls: string }[] = [
  { t: 'do', lbl: '🔴 Đỏ', cls: 'bg-rose-600 text-white border-transparent' },
  { t: 'xanh', lbl: '🔵 Xanh', cls: 'bg-blue-600 text-white border-transparent' },
  { t: 'tay', lbl: '🧹 Tẩy', cls: 'bg-slate-600 text-white border-transparent' },
  { t: 'check', lbl: '✓', cls: 'bg-emerald-600 text-white border-transparent' },
  { t: 'cross', lbl: '✗', cls: 'bg-rose-600 text-white border-transparent' },
  { t: 'text', lbl: 'Aa', cls: 'bg-slate-800 text-white border-transparent' },
]

function VeAnh({ anhDs, urls, reloadNop }: { anhDs: BtvnNopAnh[]; urls: Record<string, string>; reloadNop: () => Promise<void> }) {
  // Bản local của xấp ảnh + URL: sau Lưu tự cập nhật path_cham ngay, không chờ cha reload.
  const [anhs, setAnhs] = useState<BtvnNopAnh[]>(anhDs)
  const [localUrls, setLocalUrls] = useState<Record<string, string>>(urls)
  const [idx, setIdx] = useState(0)
  const [tool, setTool] = useState<Tool>('do')
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [tick, setTick] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const marksRef = useRef<Record<string, Mark[]>>({}) // nháp theo TRANG (key = anh.id)
  const drawing = useRef(false)

  useEffect(() => { setLocalUrls((cur) => ({ ...urls, ...cur })) }, [urls])

  const anh = anhs[idx]
  const src = anh ? localUrls[anh.path_cham ?? anh.path] : undefined
  const marks = () => (marksRef.current[anh.id] ??= [])

  useEffect(() => {
    setReady(false); imgRef.current = null
    if (!src) return
    const img = new Image()
    img.crossOrigin = 'anonymous' // signed URL Supabase có CORS * — cần để canvas export không taint
    img.onload = () => { imgRef.current = img; setReady(true); requestAnimationFrame(paint) }
    img.onerror = () => alert('Không tải được ảnh — thử đóng mở lại.')
    img.src = src
    // eslint-disable-next-line
  }, [src])

  function paint() {
    const cv = canvasRef.current, img = imgRef.current
    if (!cv || !img) return
    if (cv.width !== img.naturalWidth || cv.height !== img.naturalHeight) { cv.width = img.naturalWidth; cv.height = img.naturalHeight }
    const ctx = cv.getContext('2d')!
    ctx.clearRect(0, 0, cv.width, cv.height)
    const W = cv.width
    const lw = Math.max(3, W / 300)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const m of marks()) {
      if (m.k === 'net') {
        ctx.globalCompositeOperation = m.tay ? 'destination-out' : 'source-over'
        ctx.strokeStyle = m.mau; ctx.lineWidth = m.tay ? lw * 4 : lw
        ctx.beginPath()
        m.pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        if (m.pts.length === 1) ctx.lineTo(m.pts[0].x + 0.1, m.pts[0].y)
        ctx.stroke()
      } else if (m.k === 'dau') {
        ctx.globalCompositeOperation = 'source-over'
        const s = Math.max(28, W / 14)
        ctx.lineWidth = lw * 1.6
        ctx.beginPath()
        if (m.loai === 'check') { ctx.strokeStyle = '#059669'; ctx.moveTo(m.x - s * 0.45, m.y); ctx.lineTo(m.x - s * 0.1, m.y + s * 0.4); ctx.lineTo(m.x + s * 0.5, m.y - s * 0.45) }
        else { ctx.strokeStyle = '#e11d48'; ctx.moveTo(m.x - s * 0.4, m.y - s * 0.4); ctx.lineTo(m.x + s * 0.4, m.y + s * 0.4); ctx.moveTo(m.x + s * 0.4, m.y - s * 0.4); ctx.lineTo(m.x - s * 0.4, m.y + s * 0.4) }
        ctx.stroke()
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = '#b91c1c'
        ctx.font = `bold ${Math.max(20, Math.round(W / 28))}px sans-serif`
        ctx.textBaseline = 'middle'
        ctx.fillText(m.text, m.x, m.y)
      }
    }
    ctx.globalCompositeOperation = 'source-over'
  }
  function toaDo(e: React.PointerEvent): { x: number; y: number } {
    const cv = canvasRef.current!
    const rect = cv.getBoundingClientRect()
    return { x: ((e.clientX - rect.left) / rect.width) * cv.width, y: ((e.clientY - rect.top) / rect.height) * cv.height }
  }
  function down(e: React.PointerEvent) {
    if (!ready) return
    const p = toaDo(e)
    if (tool === 'check' || tool === 'cross') { marks().push({ k: 'dau', loai: tool, x: p.x, y: p.y }); paint(); setTick((t) => t + 1); return }
    if (tool === 'text') {
      const text = (prompt('Ghi chú ngắn:') ?? '').trim()
      if (text) { marks().push({ k: 'text', x: p.x, y: p.y, text }); paint(); setTick((t) => t + 1) }
      return
    }
    drawing.current = true
    marks().push({ k: 'net', mau: tool === 'xanh' ? '#2563eb' : '#e11d48', tay: tool === 'tay', pts: [p] });
    (e.target as Element).setPointerCapture(e.pointerId)
    paint()
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return
    const ms = marks(); const m = ms[ms.length - 1]
    if (m?.k === 'net') { m.pts.push(toaDo(e)); paint() }
  }
  function up() { if (drawing.current) { drawing.current = false; setTick((t) => t + 1) } }
  function undo() { marks().pop(); paint(); setTick((t) => t + 1) }

  async function luu() {
    const cv = canvasRef.current, img = imgRef.current
    if (!cv || !img || busy) return
    setBusy(true)
    try {
      const out = document.createElement('canvas')
      out.width = img.naturalWidth; out.height = img.naturalHeight
      const ctx = out.getContext('2d')!
      ctx.drawImage(img, 0, 0); ctx.drawImage(cv, 0, 0)
      const blob = await new Promise<Blob>((res, rej) => out.toBlob((b) => (b ? res(b) : rej(new Error('Không xuất được ảnh'))), 'image/png'))
      const path = await uploadAnhCham(anh.id, blob)
      const u = await signUrls([path])
      marksRef.current[anh.id] = []
      setLocalUrls((cur) => ({ ...cur, ...u }))
      setAnhs((cur) => cur.map((a) => (a.id === anh.id ? { ...a, path_cham: path } : a)))
      reloadNop().catch(() => {})
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const soNet = marks().length
  const chuaLuu = (id: string) => (marksRef.current[id]?.length ?? 0) > 0
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-2 py-1.5">
        {TOOLS.map((t) => (
          <button key={t.t} onClick={() => setTool(t.t)} className={`min-h-[36px] min-w-[40px] rounded-lg border px-2 text-[12.5px] font-bold ${tool === t.t ? t.cls : 'border-slate-200 bg-white text-slate-600'}`}>{t.lbl}</button>
        ))}
        <button onClick={undo} disabled={!soNet} className="min-h-[36px] rounded-lg border border-slate-200 px-2.5 text-[12.5px] font-semibold text-slate-600 disabled:opacity-30">↩ Hoàn tác</button>
        <button onClick={luu} disabled={busy || !soNet || !ready} className="ml-auto min-h-[36px] rounded-lg bg-teal-600 px-3.5 text-[12.5px] font-bold text-white active:bg-teal-500 disabled:opacity-40">{busy ? 'Đang lưu…' : '💾 Lưu trang này'}</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-slate-800 p-2">
        {!src && <p className="p-6 text-center text-[13px] text-white/60">Không có URL ảnh (thử mở lại tab BTVN).</p>}
        {src && (
          <div className="relative mx-auto w-full max-w-[1100px]">
            <img src={src} alt="" className="block h-auto w-full select-none rounded-lg" draggable={false} />
            <canvas ref={canvasRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
              className={`absolute inset-0 h-full w-full touch-none select-none rounded-lg ${tool === 'text' || tool === 'check' || tool === 'cross' ? 'cursor-cell' : 'cursor-crosshair'}`} data-tick={tick} />
          </div>
        )}
      </div>

      {anhs.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 bg-white px-2 py-1.5">
          <span className="shrink-0 text-[11px] font-semibold text-slate-400">Trang {idx + 1}/{anhs.length}</span>
          {anhs.map((a, i) => {
            const s = localUrls[a.path_cham ?? a.path]
            return (
              <button key={a.id} onClick={() => setIdx(i)} className={`relative shrink-0 overflow-hidden rounded-md border-2 ${i === idx ? 'border-teal-500' : 'border-transparent'}`}>
                {s ? <img src={s} alt="" className="h-14 w-10 object-cover" draggable={false} /> : <span className="flex h-14 w-10 items-center justify-center bg-slate-100 text-[9px] text-slate-400">…</span>}
                {a.path_cham && <span className="absolute right-0.5 top-0.5 rounded bg-rose-600 px-0.5 text-[8px] font-bold text-white">✎</span>}
                {chuaLuu(a.id) && <span className="absolute bottom-0.5 left-0.5 h-2 w-2 rounded-full bg-amber-400" title="chưa lưu" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
