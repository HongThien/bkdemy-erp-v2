// ChamBtvn — màn CHẤM BTVN HỢP NHẤT 2 ĐƯỜNG (PLAN-app-ta.md §5, CEO chốt 30/08 ④⑤⑥):
// · HS nộp APP (📱): xem xấp ảnh + VẼ ĐÁNH DẤU lên ảnh (bản mới path_cham, ảnh gốc immutable)
//   + Đ/C/S per câu (gami_grades — ĐÚNG đường cũ) + trạng thái nộp HỆ ĐỀ XUẤT (TA tick xác nhận)
//   + nhận xét CHỌN TỪ LIST + 📤 Trả bài → PH thấy bài chấm + đáp án.
// · HS không nộp app: chấm nhập tay từ bài Zalo y hệt BtvnTab ERP (2 đường sống song song).
// Đóng BTVN = fn_dong_btvn (EXP như cũ + TỰ TRẢ nốt lượt nộp đã chấm). BTVN vẫn THAM KHẢO —
// không mastery/Elo (CEO ⑦).
import { useEffect, useRef, useState } from 'react'
import {
  listProblems, listGrades, gradeET, gradeETBulk, deleteGrade, loadBTVNForBuoi, syncBTVNProblems,
  loadHinhForBuoiPhase, syncHinhProblems, getBtvnKetQua, setBtvnKetQua, closeBTVN, reopenBTVN,
  listCanhBao, themCanhBao, xoaCanhBao,
  type BuoiHocHS, type Problem, type Grade, type ETResult, type BtvnKQ, type BtvnTrangThai, type BtvnThaiDo, type CanhBao,
} from '../../lib/gami'
import { listNopTheoBuoi, deXuatTrangThai, signUrls, uploadAnhCham, listNhanXetMau, setNhanXet, traBai, xacNhanBuoi, chuyenBuoi, listBuoiBtvnCuaLop, type BtvnNop, type BtvnNopAnh, type NhanXetMau, type BuoiBtvn } from '../../lib/btvnnop'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import { ET_KQ, DongBar, type BuoiFull } from './ChamBuoi'

const NOP_OPTS: { v: BtvnTrangThai; l: string }[] = [
  { v: 'nop_dung_han', l: 'Nộp đúng hạn' }, { v: 'nop_muon', l: 'Nộp muộn' }, { v: 'xin_phep', l: 'Đã xin phép' }, { v: 'khong_lam', l: 'Không làm bài' },
]
const THAIDO_OPTS: { v: BtvnThaiDo; l: string }[] = [
  { v: 'nghiem_tuc', l: 'Nghiêm túc' }, { v: 'chua_het_suc', l: 'Chưa hết sức' }, { v: 'chua_nghiem_tuc', l: 'Chưa nghiêm túc' }, { v: 'chong_doi', l: 'Chống đối' },
]

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
  const [deXuat, setDeXuat] = useState<Record<string, { nopAt: string; deXuat: string }>>({})
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [nxMau, setNxMau] = useState<NhanXetMau[]>([])
  const [cb, setCb] = useState<CanhBao[]>([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)
  const [hsMo, setHsMo] = useState<string | null>(null)
  const [veAnh, setVeAnh] = useState<BtvnNopAnh | null>(null)
  const dong = !!buoi.btvn_dong_at
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  // HS nộp app nhưng KHÔNG co_mat (vắng/chưa điểm danh) vẫn hiện để chấm — bài đã nộp là bài thật.
  const themNop = roster.filter((r) => r.diem_danh !== 'co_mat' && nop[r.hoc_sinh_id])
  const dsHS = [...coMat, ...themNop]
  const tenHT = tenHienThiDs(dsHS.map((r) => r.hoc_sinh?.ho_ten))
  const dangBuoi = [...new Set(probs.map((p) => p.ma_dang).filter(Boolean))] as string[]

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

  if (loading) return <p className="text-[13px] text-slate-400">Đang tải BTVN…</p>
  if (missing && Object.keys(nop).length === 0)
    return <p className="text-[13px] text-slate-400">Chưa có BTVN cho buổi này (khớp <b className="text-slate-600">lớp + ngày</b>) và chưa có HS nào nộp qua app.</p>
  if (dsHS.length === 0) return <p className="text-[13px] text-slate-400">Chưa có HS điểm danh "có mặt" và chưa ai nộp app.</p>

  const soNop = Object.keys(nop).length
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
          const v = kq[hsId] ?? { trang_thai_nop: null, thai_do: null }
          const daChamSo = probs.filter((p) => gradeOf(p.id, hsId)).length
          const mo = hsMo === hsId
          return (
            <div key={r.id} className={`overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ${mo ? 'sm:col-span-2' : ''}`}>
              <button onClick={() => setHsMo(mo ? null : hsId)} className="flex min-h-[52px] w-full items-center gap-2 px-3 py-2 text-left active:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-slate-800">
                    <span className="truncate">{tenHT[i]}</span>
                    {r.diem_danh !== 'co_mat' && <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">vắng buổi</span>}
                  </p>
                  <p className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-slate-400">
                    {n ? (
                      <>
                        <span className="rounded bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-700">📱 {n.anh.length} ảnh</span>
                        {!n.buoi_xac_nhan_at && <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-700">⚠ chưa chốt buổi</span>}
                        {dx && <span className={`rounded px-1.5 py-0.5 font-semibold ${dx.deXuat === 'nop_dung_han' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600'}`}>đề xuất: {dx.deXuat === 'nop_dung_han' ? 'đúng hạn' : 'nộp muộn'}</span>}
                        {n.tra_at ? <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-600">✓ đã trả PH</span> : null}
                      </>
                    ) : <span>chấm từ bài Zalo</span>}
                    {probs.length > 0 && <span>· chấm {daChamSo}/{probs.length}</span>}
                  </p>
                </div>
                <span className={`text-slate-300 transition ${mo ? 'rotate-90' : ''}`}>›</span>
              </button>

              {mo && (
                <div className="border-t border-slate-100 px-3 py-2.5">
                  {/* Hệ gán TẠM buổi (PH nộp không chọn buổi) → TA CHỐT trước khi trả bài */}
                  {n && !n.buoi_xac_nhan_at && !dong && (
                    <ChotBuoiBanner lopId={buoi.lop_id ?? ''} buoiNgay={buoi.ngay}
                      onDungBuoi={() => xacNhan_(hsId)} onChuyen={(bm) => chuyen_(hsId, bm)} />
                  )}
                  {/* xấp ảnh nộp qua app — bấm ảnh để VẼ ĐÁNH DẤU */}
                  {n && n.anh.length > 0 && (
                    <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
                      {n.anh.map((a) => {
                        const src = urls[a.path_cham ?? a.path]
                        return (
                          <button key={a.id} onClick={() => setVeAnh(a)} className="relative shrink-0">
                            {src ? <img src={src} alt="" className="h-28 w-20 rounded-lg border border-slate-200 object-cover" /> : <span className="flex h-28 w-20 items-center justify-center rounded-lg border border-slate-200 text-[10px] text-slate-400">ảnh…</span>}
                            {a.path_cham && <span className="absolute right-1 top-1 rounded bg-rose-600 px-1 text-[9px] font-bold text-white">✎</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* trạng thái nộp (đề xuất sẵn — TA tick) + thái độ */}
                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                    {NOP_OPTS.map((o) => (
                      <button key={o.v} disabled={dong} onClick={() => setKQField(hsId, { trang_thai_nop: v.trang_thai_nop === o.v ? null : o.v })}
                        className={`min-h-[34px] rounded-lg border px-2.5 text-[12px] font-semibold disabled:opacity-50 ${v.trang_thai_nop === o.v ? 'border-transparent bg-teal-600 text-white' : dx && dx.deXuat === o.v && !v.trang_thai_nop ? 'border-teal-400 border-dashed text-teal-700' : 'border-slate-200 text-slate-500'}`}>{o.l}{dx && dx.deXuat === o.v && !v.trang_thai_nop ? ' ←' : ''}</button>
                    ))}
                  </div>
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
                                    className={`h-9 w-10 rounded-lg border text-[13px] font-bold bg-white transition ${g?.result === k.v ? k.sel : k.idle} ${dong && g?.result !== k.v ? 'opacity-40' : ''}`}>{k.lbl}</button>
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
                            <button key={m.ma} onClick={async () => {
                              const next = on ? n.nhan_xet_ma.filter((x) => x !== m.ma) : [...n.nhan_xet_ma, m.ma]
                              setNop((cur) => ({ ...cur, [hsId]: { ...cur[hsId], nhan_xet_ma: next } }))
                              try { await setNhanXet(buoiId, hsId, next) } catch (e: any) { alert(e.message ?? String(e)); reloadNop() }
                            }} className={`rounded-lg border px-2 py-1 text-left text-[11.5px] font-medium ${on ? 'border-transparent bg-teal-600 text-white' : 'border-slate-200 text-slate-500'}`}>{m.noi_dung}</button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {dangBuoi.length > 0 && !dong && <NutChuongDo buoiId={buoiId} hsId={hsId} hsTen={r.hoc_sinh?.ho_ten ?? '?'} dangBuoi={dangBuoi} tenDang={tenDang} cb={cb.filter((x) => x.hoc_sinh_id === hsId)} onChanged={async () => setCb(await listCanhBao(buoiId))} />}
                    {n && (n.tra_at
                      ? <span className="ml-auto rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[12px] font-semibold text-indigo-600">✓ Đã trả bài cho PH</span>
                      : <button onClick={() => { if (confirm('Trả bài cho PH? PH sẽ thấy ảnh bài chấm + kết quả + đáp án chi tiết.')) traBai_(hsId) }}
                          disabled={!n.buoi_xac_nhan_at} title={n.buoi_xac_nhan_at ? '' : 'Chốt buổi trước đã'}
                          className="ml-auto min-h-[38px] rounded-lg bg-indigo-600 px-3 text-[12.5px] font-semibold text-white active:bg-indigo-500 disabled:opacity-40">📤 Trả bài cho PH</button>)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {veAnh && <AnnotateModal anh={veAnh} src={urls[veAnh.path_cham ?? veAnh.path]} onClose={() => setVeAnh(null)}
        onSaved={async () => { setVeAnh(null); await reloadNop() }} />}
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
      <p className="mb-1.5 text-[12px] font-medium text-amber-800">⚠ PH nộp không chọn buổi — hệ <b>gán tạm</b> vào buổi này. Chốt đúng buổi rồi mới trả bài được.</p>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={onDungBuoi} className="min-h-[36px] rounded-lg bg-amber-600 px-3 text-[12.5px] font-bold text-white active:bg-amber-500">✓ Đúng buổi này</button>
        <button onClick={moChuyen} className="min-h-[36px] rounded-lg border border-amber-400 px-3 text-[12.5px] font-semibold text-amber-800 active:bg-amber-100">→ Bài thuộc buổi khác</button>
      </div>
      {moPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setMoPicker(false)}>
          <div className="max-h-[70dvh] w-full max-w-[440px] overflow-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-2 text-[14px] font-bold text-slate-900">Chuyển bài sang buổi nào?</p>
            {dsBuoi === null ? <p className="text-[12px] text-slate-400">Đang tải…</p>
              : dsBuoi.filter((b) => b.ngay !== buoiNgay).length === 0 ? <p className="text-[12px] text-slate-400">Lớp không có buổi BTVN nào khác gần đây.</p>
              : dsBuoi.filter((b) => b.ngay !== buoiNgay).map((b) => (
                <button key={b.id} onClick={() => { setMoPicker(false); onChuyen(b.id) }}
                  className="mb-1.5 flex min-h-[44px] w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-left active:bg-slate-50">
                  <span className="text-[13.5px] font-semibold text-slate-800">{thuCuaNgay(b.ngay)} · {ddmmVN(b.ngay)}</span>
                  {b.dong && <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500">BTVN đã đóng</span>}
                </button>
              ))}
            <button onClick={() => setMoPicker(false)} className="mt-1 min-h-[40px] w-full rounded-lg text-[13px] text-slate-500">Huỷ</button>
          </div>
        </div>
      )}
    </div>
  )
}

// 🚨 chuông đỏ "HS kém dạng" — tín hiệu NGƯỜI-confirm (kênh ③ dashboard đánh giá), không vào điểm.
function NutChuongDo({ buoiId, hsId, hsTen, dangBuoi, tenDang, cb, onChanged }: {
  buoiId: string; hsId: string; hsTen: string; dangBuoi: string[]; tenDang: (md: string | null) => string
  cb: CanhBao[]; onChanged: () => void
}) {
  const [mo, setMo] = useState(false)
  const [maDang, setMaDang] = useState(dangBuoi[0] ?? '')
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button onClick={() => setMo(true)} className="min-h-[38px] rounded-lg border border-rose-200 px-2.5 text-[12.5px] font-semibold text-rose-600 active:bg-rose-50">🚨 Kém dạng</button>
      {cb.map((c) => (
        <span key={c.id} className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-1 text-[10.5px] font-semibold text-rose-700">{tenDang(c.ma_dang)}
          <button onClick={async () => { await xoaCanhBao(c.id); onChanged() }} className="text-rose-400">✕</button></span>
      ))}
      {mo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setMo(false)}>
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-1 text-[14px] font-bold text-slate-900">🚨 {hsTen} đang kém dạng</p>
            <p className="mb-2 text-[11.5px] text-slate-400">Tín hiệu này KHÔNG vào điểm — để hệ thống biết HS cần hỗ trợ.</p>
            <select value={maDang} onChange={(e) => setMaDang(e.target.value)} className="mb-2 h-10 w-full rounded-lg border border-slate-300 px-2 text-[13px]">
              {dangBuoi.map((md) => <option key={md} value={md}>{tenDang(md)}</option>)}
            </select>
            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú (tuỳ): kém chỗ nào…" className="mb-3 h-16 w-full rounded-lg border border-slate-300 px-2 py-1 text-[13px]" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setMo(false)} className="min-h-[40px] rounded-lg px-3 text-[13px] text-slate-500">Huỷ</button>
              <button disabled={busy || !maDang} onClick={async () => {
                setBusy(true)
                try { await themCanhBao({ buoiId, hocSinhId: hsId, maDang, ghiChu: ghiChu.trim() || undefined }); setMo(false); setGhiChu(''); onChanged() }
                catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
              }} className="min-h-[40px] rounded-lg bg-rose-600 px-4 text-[13px] font-semibold text-white disabled:opacity-40">Gửi báo động</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── VẼ ĐÁNH DẤU lên ảnh bài nộp: bút đỏ + undo, lưu = PNG MỚI (path_cham) — ảnh gốc immutable.
// Toạ độ chạm map qua tỉ lệ rect (bài học PdfCropper: chia tỉ lệ, không trừ thẳng — né zoom CSS).
function AnnotateModal({ anh, src, onClose, onSaved }: { anh: BtvnNopAnh; src?: string; onClose: () => void; onSaved: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const strokesRef = useRef<{ x: number; y: number }[][]>([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [tick, setTick] = useState(0) // đếm nét để enable nút

  useEffect(() => {
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
    cv.width = img.naturalWidth; cv.height = img.naturalHeight
    const ctx = cv.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    ctx.strokeStyle = '#e11d48'; ctx.lineWidth = Math.max(3, img.naturalWidth / 300); ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const s of strokesRef.current) {
      ctx.beginPath()
      s.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
      ctx.stroke()
    }
  }
  function toaDo(e: React.PointerEvent): { x: number; y: number } {
    const cv = canvasRef.current!
    const rect = cv.getBoundingClientRect()
    return { x: ((e.clientX - rect.left) / rect.width) * cv.width, y: ((e.clientY - rect.top) / rect.height) * cv.height }
  }
  const drawing = useRef(false)
  function down(e: React.PointerEvent) { if (!ready) return; drawing.current = true; strokesRef.current.push([toaDo(e)]); (e.target as Element).setPointerCapture(e.pointerId) }
  function move(e: React.PointerEvent) { if (!drawing.current) return; strokesRef.current[strokesRef.current.length - 1].push(toaDo(e)); paint() }
  function up() { if (drawing.current) { drawing.current = false; setTick((t) => t + 1) } }
  function undo() { strokesRef.current.pop(); paint(); setTick((t) => t + 1) }

  async function luu() {
    const cv = canvasRef.current
    if (!cv || busy) return
    setBusy(true)
    try {
      const blob = await new Promise<Blob>((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('Không xuất được ảnh'))), 'image/png'))
      await uploadAnhCham(anh.id, blob)
      onSaved()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-900/95" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-white/80 active:bg-white/10">✕ Đóng</button>
        <span className="text-[12px] text-white/50">Vẽ bút đỏ lên ảnh · lưu = bản chấm gửi PH (ảnh gốc giữ nguyên)</span>
        <div className="ml-auto flex gap-2">
          <button onClick={undo} disabled={!strokesRef.current.length} className="rounded-lg border border-white/20 px-3 py-2 text-[13px] font-semibold text-white/80 disabled:opacity-30">↩ Hoàn tác</button>
          <button onClick={luu} disabled={busy || (!strokesRef.current.length && !anh.path_cham) || !ready} className="rounded-lg bg-teal-500 px-4 py-2 text-[13px] font-bold text-white disabled:opacity-40">{busy ? 'Đang lưu…' : '💾 Lưu bản chấm'}</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {!src && <p className="p-6 text-center text-[13px] text-white/60">Không có URL ảnh (thử mở lại tab BTVN).</p>}
        <canvas ref={canvasRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          className="mx-auto h-auto w-full max-w-[860px] touch-none select-none rounded-lg" data-tick={tick} />
      </div>
    </div>
  )
}
