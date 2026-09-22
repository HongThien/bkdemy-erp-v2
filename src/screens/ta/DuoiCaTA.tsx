// BUỔI ĐUỔI — phía TRỢ GIẢNG, mobile-first (Thùy 22/09: "UI m phải làm cho dt", "giao diện phải làm
// gần như bên Bổ trợ yếu"). Bản trước tái dùng thẳng BuoiDuoiDetail (màn ERP desktop: header ngang,
// container 900px, hover) nhét vào app TA — sai đúng luật đã tự ghi ở DuoiGiayTA.tsx:5 ("TA không còn
// dùng ERP nữa"), và LỘ "Mức học đuổi" (giá/học phí — việc của OPS) cho TA xem/sửa. Màn này thay thế
// HOÀN TOÀN cho app TA, theo khuôn CaBoTroTA.tsx (Khối 1/2/3 đánh số, BKTabHeader, card trắng bo tròn).
// BuoiDuoiDetail GIỮ NGUYÊN, chỉ còn dùng ở ERP (NhanSuHome — nơi Mức học đuổi thuộc về).
import { useEffect, useState } from 'react'
import {
  getBuoiDuoiHsInfo, getDangCuaBuoiDuoi, kichBanDuoi, setBuoiCoThietBi, hoanThanhKhoaDuoi, type DangDuoiBuoi,
} from '../../lib/botro_duoi'
import { getRoster, getBuoi, huyBuoi, xoaHSKhoiBuoi, diemDanh, getDanhGia, setNhanXet, dongDanhGia, moLaiDanhGia, type BuoiHocHS } from '../../lib/gami'
import SuaBuoiModal from '../botro/SuaBuoiModal'
import DuoiGiayTA from './DuoiGiayTA'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { tenHienThiDs } from '../../lib/hoten'
import { BKTabHeader } from '../../components/bk/BKUI'

export default function DuoiCaTA({ buoiId, onClose }: { buoiId: string; onClose: () => void }) {
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [nx, setNx] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [sua, setSua] = useState(false)
  const [meta, setMeta] = useState<{ ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; nguoi_day: string | null; nguoi_day_tg: string | null }>({ ngay: '', gio_bat_dau: null, gio_ket_thuc: null, phong: null, nguoi_day: null, nguoi_day_tg: null })
  const [dgXong, setDgXong] = useState(false)
  const [hsInfo, setHsInfo] = useState<Record<string, { lop: string; mon: string }>>({})
  const [dangByCase, setDangByCase] = useState<Record<string, DangDuoiBuoi[]>>({})
  const [coThietBi, setCoThietBiState] = useState<boolean | null>(null)
  const [daTai, setDaTai] = useState(false)
  const [giayPanel, setGiayPanel] = useState<{ hocSinhId: string; mon: string; maDang: string } | null>(null)
  const lopDuoiCua = (hsId: string) => hsInfo[hsId]?.lop ?? ''
  const monDuoiCua = (hsId: string) => hsInfo[hsId]?.mon ?? ''

  async function reload() {
    const [b, r, dg, hi, dc] = await Promise.all([getBuoi(buoiId), getRoster(buoiId), getDanhGia(buoiId), getBuoiDuoiHsInfo(buoiId), getDangCuaBuoiDuoi(buoiId)])
    setDangByCase(dc)
    if (b) {
      setMeta({ ngay: (b as any).ngay, gio_bat_dau: (b as any).gio_bat_dau, gio_ket_thuc: (b as any).gio_ket_thuc, phong: (b as any).phong, nguoi_day: (b as any).nguoi_day, nguoi_day_tg: (b as any).nguoi_day_tg })
      setDgXong(!!(b as any).danh_gia_xong_at)
      setCoThietBiState((b as any).duoi_co_thiet_bi ?? null)
    }
    setRoster(r); setHsInfo(hi)
    const m: Record<string, string> = {}
    for (const [hsId, v] of Object.entries(dg)) m[hsId] = (v as any).nhan_xet ?? ''
    setNx(m)
    setDaTai(true)
  }
  useEffect(() => { reload() }, [buoiId]) // eslint-disable-line

  async function onDoiThietBi(v: boolean) { setCoThietBiState(v); try { await setBuoiCoThietBi(buoiId, v) } catch (e: any) { alert(e.message ?? String(e)) } }
  async function setDD(r: BuoiHocHS, tt: 'co_mat' | 'vang') { try { await diemDanh(r.id, tt); await reload() } catch (e: any) { alert(e.message) } }
  async function onHuy() { const ly = prompt('Lý do huỷ buổi đuổi?'); if (!ly) return; try { await huyBuoi(buoiId, ly); onClose() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function onXoaHS(r: BuoiHocHS) { if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi đuổi?`)) return; try { await xoaHSKhoiBuoi(r); await reload() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function luuNhanXet(hsId: string) { try { await setNhanXet(buoiId, hsId, nx[hsId] ?? '') } catch (e: any) { alert(e.message) } }
  async function toggleDong() {
    setBusy(true)
    try { if (dgXong) await moLaiDanhGia(buoiId); else await dongDanhGia(buoiId); onClose() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  async function onHoanThanhKhoa(caseId: string, ten: string) {
    if (!confirm(`Hoàn thành ĐỢT bổ trợ đuổi của ${ten}? Đợt sẽ chuyển sang tab Hoàn thành (kết thúc sớm nếu chưa đủ số buổi dự kiến).`)) return
    try { await hoanThanhKhoaDuoi(caseId); await reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (giayPanel) {
    const hoTen = roster.find((r) => r.hoc_sinh_id === giayPanel.hocSinhId)?.hoc_sinh?.ho_ten
    return (
      <DuoiGiayTA buoiId={buoiId} hocSinhId={giayPanel.hocSinhId} mon={giayPanel.mon} maDang={giayPanel.maDang} hoTen={hoTen}
        onBack={() => setGiayPanel(null)} onXong={() => { setGiayPanel(null); reload() }} />
    )
  }

  return (
    <div>
      <BKTabHeader onBack={onClose} icon="/bk-ui/pr_tai_nghe.png" title={`Buổi đuổi · ${ddmmVN(meta.ngay)}`}
        sub={`${thuCuaNgay(meta.ngay)}${meta.gio_bat_dau ? ` · ${meta.gio_bat_dau.slice(0, 5)}` : ''}${meta.phong ? ` · ${meta.phong}` : ''} · ${roster.length} HS`}
        right={<button onClick={toggleDong} disabled={busy} className={`rounded-lg px-3 py-1.5 text-[12.5px] font-bold disabled:opacity-50 ${dgXong ? 'border border-amber-300 text-amber-700' : 'bg-emerald-600 text-white'}`}>{busy ? '…' : dgXong ? '↩ Mở lại' : '✓ Hoàn thành'}</button>} />

      <div className="mx-auto max-w-[1000px] px-2 pb-8 pt-1">
        <div className="mb-2 flex items-center gap-3 px-1">
          <button onClick={() => setSua(true)} className="text-[12.5px] font-medium text-slate-500">✎ Sửa buổi</button>
          <button onClick={onHuy} className="text-[12.5px] font-medium text-rose-600">Huỷ buổi</button>
          {dgXong && <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-[11.5px] font-bold text-emerald-700">✓ Đã hoàn thành</span>}
        </div>

        {/* 1. Thiết bị — 1 cờ/buổi, quyết định kịch bản (auto/chấm tay/giấy) cho MỌI dạng bên dưới. */}
        <Khoi so={1} ten="Thiết bị">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600">Buổi này có iPad cho em dùng không?</span>
            <div className="ml-auto inline-flex rounded-lg border border-slate-200 p-0.5 text-[13px]">
              <button onClick={() => onDoiThietBi(true)} disabled={dgXong} className={`rounded-md px-3 py-1 font-medium disabled:opacity-50 ${coThietBi === true ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>📱 Có</button>
              <button onClick={() => onDoiThietBi(false)} disabled={dgXong} className={`rounded-md px-3 py-1 font-medium disabled:opacity-50 ${coThietBi === false ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>✏️ Không</button>
            </div>
          </div>
          {coThietBi == null && <p className="mt-1.5 text-[11.5px] font-medium text-amber-700">⚠ Chưa biết dạng nào tự động được — chọn trước khi em vào học.</p>}
        </Khoi>

        {/* 2. Từng em — điểm danh + tiến độ dạng + nhận xét. */}
        {roster.length === 0 ? <p className="px-1 text-[13px] text-slate-400">Buổi chưa có HS.</p> : (() => {
          const tenHT = tenHienThiDs(roster.map((r) => r.hoc_sinh?.ho_ten)); return roster.map((r, i) => (
            <div key={r.id} className="mb-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14.5px] font-bold text-slate-800">{tenHT[i]}</span>
                {r.hoc_sinh?.ma_hs && <span className="font-mono text-[11px] text-slate-400">{r.hoc_sinh.ma_hs}</span>}
                {lopDuoiCua(r.hoc_sinh_id) && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">đuổi {lopDuoiCua(r.hoc_sinh_id)}{monDuoiCua(r.hoc_sinh_id) ? ` · ${monDuoiCua(r.hoc_sinh_id)}` : ''}</span>}
                {!dgXong && <button onClick={() => onXoaHS(r)} title="Gỡ khỏi buổi" className="ml-auto rounded px-1.5 py-0.5 text-[12px] text-slate-300">✕</button>}
              </div>
              <div className="mt-2 flex gap-2">
                <button disabled={dgXong} onClick={() => setDD(r, 'co_mat')} className={`flex-1 rounded-xl py-2 text-[13px] font-bold disabled:opacity-50 ${r.diem_danh === 'co_mat' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-600'}`}>✓ Có mặt</button>
                <button disabled={dgXong} onClick={() => setDD(r, 'vang')} className={`flex-1 rounded-xl py-2 text-[13px] font-bold disabled:opacity-50 ${r.diem_danh === 'vang' ? 'bg-rose-500 text-white' : 'border border-slate-200 text-slate-600'}`}>Vắng</button>
                {r.bo_tro_duoi_id && (
                  <button onClick={() => onHoanThanhKhoa(r.bo_tro_duoi_id!, r.hoc_sinh?.ho_ten ?? 'HS')} title="Em đã bắt kịp → kết thúc đợt đuổi sớm" className="rounded-xl bg-slate-800 px-3 py-2 text-[12.5px] font-bold text-white">✓ Đã bắt kịp</button>
                )}
              </div>

              {/* Tiến độ dạng — kịch bản = f(dạng có MCQ, buổi có thiết bị). 📱 tự động · ✏️ TA chấm (có iPad) · 🖨 TA chấm (in giấy). */}
              {r.bo_tro_duoi_id && (dangByCase[r.bo_tro_duoi_id]?.length ?? 0) > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="w-full text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Dạng đã xong {dangByCase[r.bo_tro_duoi_id]!.filter((d) => d.xong).length}/{dangByCase[r.bo_tro_duoi_id]!.length}
                  </span>
                  {dangByCase[r.bo_tro_duoi_id]!.map((d) => {
                    const kb = kichBanDuoi(d.co_mcq, coThietBi)
                    if (d.xong) return <span key={d.ma_dang} className="rounded-lg bg-emerald-500 px-2 py-1 font-mono text-[12px] font-bold text-white">✓ {d.ma_dang}</span>
                    if (kb === 1) return <span key={d.ma_dang} title="Em tự làm trên app, máy tự chấm" className="rounded-lg border border-slate-200 px-2 py-1 font-mono text-[12px] text-slate-500">📱 {d.ma_dang}</span>
                    if (kb === null) return <span key={d.ma_dang} className="rounded-lg border border-dashed border-slate-200 px-2 py-1 font-mono text-[12px] text-slate-400">{d.ma_dang}</span>
                    return (
                      <button key={d.ma_dang} disabled={dgXong} onClick={() => setGiayPanel({ hocSinhId: r.hoc_sinh_id, mon: monDuoiCua(r.hoc_sinh_id), maDang: d.ma_dang })}
                        title={kb === 2 ? 'Chưa có trắc nghiệm — em đọc đề trên iPad, TA chấm ĐCS' : 'Chưa có trắc nghiệm + không có iPad — in giấy, TA chấm ĐCS'}
                        className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 font-mono text-[12px] font-bold text-amber-700 disabled:opacity-50">
                        {kb === 3 ? '🖨' : '✏️'} {d.ma_dang}
                      </button>
                    )
                  })}
                </div>
              )}

              <textarea value={nx[r.hoc_sinh_id] ?? ''} disabled={dgXong} onChange={(e) => setNx((m) => ({ ...m, [r.hoc_sinh_id]: e.target.value }))} onBlur={() => luuNhanXet(r.hoc_sinh_id)}
                placeholder="Nhận xét sau buổi (tiến độ bắt kịp, điểm cần lưu ý…)" rows={2}
                className="mt-2.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50" />
            </div>
          ))
        })()}
      </div>

      {sua && <SuaBuoiModal buoi={{ id: buoiId, ...meta }} onClose={() => setSua(false)} onSaved={() => { setSua(false); reload() }} />}
      {/* Popup BẮT BUỘC trả lời đúng 1 lần lúc mở buổi (Khối 1 phía trên vẫn còn để xem/đổi lại sau). */}
      {daTai && !dgXong && coThietBi == null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="text-[17px] font-bold text-slate-800">Buổi này có iPad cho em dùng không?</div>
            <p className="mt-1.5 text-[13px] text-slate-500">Quyết định dạng nào tự động, dạng nào TA cần chấm tay — chọn 1 lần, đổi lại được sau ở khối "Thiết bị".</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => onDoiThietBi(true)} className="flex-1 rounded-xl bg-indigo-600 py-3 text-[14px] font-bold text-white">📱 Có iPad</button>
              <button onClick={() => onDoiThietBi(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-[14px] font-bold text-slate-700">✏️ Không có</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Khoi({ so, ten, children }: { so: number; ten: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-bold text-white">{so}</span>
        <p className="text-[14px] font-bold text-slate-800">{ten}</p>
      </div>
      {children}
    </div>
  )
}
