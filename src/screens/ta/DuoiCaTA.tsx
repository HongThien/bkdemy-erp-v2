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
import { duoiTienTrinh, moTayDangDuoi, type DotDuoiHS, type DangDuoiHS } from '../../lib/hoctudau'
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
  const [tienTrinh, setTienTrinh] = useState<Record<string, DotDuoiHS>>({}) // caseId → tiến trình đợt (cùng nguồn app HS)
  const [moBusy, setMoBusy] = useState<string | null>(null)
  const [coThietBi, setCoThietBiState] = useState<boolean | null>(null)
  const [daTai, setDaTai] = useState(false)
  const [giayPanel, setGiayPanel] = useState<{ hocSinhId: string; mon: string; maDang: string } | null>(null)
  const lopDuoiCua = (hsId: string) => hsInfo[hsId]?.lop ?? ''
  const monDuoiCua = (hsId: string) => hsInfo[hsId]?.mon ?? ''

  async function reload() {
    const [b, r, dg, hi, dc] = await Promise.all([getBuoi(buoiId), getRoster(buoiId), getDanhGia(buoiId), getBuoiDuoiHsInfo(buoiId), getDangCuaBuoiDuoi(buoiId)])
    setDangByCase(dc)
    // Tiến trình thống nhất (15/10): MỘT nguồn với app HS — em làm ở nhà/tại ca, dạng còn dở. Lỗi 1 em không làm hỏng cả màn.
    const hsIds = [...new Set(((r ?? []) as BuoiHocHS[]).filter((x) => x.bo_tro_duoi_id).map((x) => x.hoc_sinh_id))]
    Promise.all(hsIds.map((h) => duoiTienTrinh(h).catch(() => [] as DotDuoiHS[]))).then((arr) => {
      const m: Record<string, DotDuoiHS> = {}
      for (const ds of arr) for (const d of ds) m[d.bo_tro_duoi_id] = d
      setTienTrinh(m)
    })
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
    const hs = roster.find((r) => r.hoc_sinh_id === giayPanel.hocSinhId)?.hoc_sinh
    const hoTen = hs ? `${hs.ho_ten}${hs.ma_hs ? ` · ${hs.ma_hs}` : ''}` : undefined
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
                {r.hoc_sinh?.ma_hs && <span title="Mã đăng nhập của em" className="select-all rounded-md bg-indigo-50 px-1.5 py-px font-mono text-[12.5px] font-extrabold tracking-wide text-indigo-700">{r.hoc_sinh.ma_hs}</span>}
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

              {/* TIẾN TRÌNH ĐUỔI (15/10) — cùng danh sách + cùng thanh với app HS. Kịch bản làm bài = f(dạng có MCQ, buổi có thiết bị):
                  📱 em tự làm trên app · ✏️ TA chấm (có iPad, dạng không MCQ) · 🖨 TA chấm (in giấy). Dạng khoá: TA mở tay. */}
              {r.bo_tro_duoi_id && tienTrinh[r.bo_tro_duoi_id] && tienTrinh[r.bo_tro_duoi_id].tong > 0 && (() => {
                const dot = tienTrinh[r.bo_tro_duoi_id!]
                const con = dot.dangs.filter((d) => d.trang_thai !== 'xong')
                const xongDs = dot.dangs.filter((d) => d.trang_thai === 'xong')
                const pX = (dot.xong / dot.tong) * 100, pD = (dot.dang_hoc / dot.tong) * 100
                const mon = monDuoiCua(r.hoc_sinh_id) || dot.mon
                return (
                  <div className="mt-2.5 rounded-xl bg-slate-50 p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-bold text-slate-800">Tiến trình đuổi · {dot.xong}/{dot.tong} dạng</span>
                      <span className="text-[11.5px] text-slate-500">buổi {dot.so_buoi_xong}/{dot.so_buoi_du_kien ?? dot.buoi.length}</span>
                    </div>
                    <div className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="bg-emerald-500" style={{ width: `${pX}%` }} /><div className="bg-indigo-400" style={{ width: `${pD}%` }} />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <div className="flex-1 rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-slate-200"><p className="text-[11px] text-slate-500">Em tự làm ở nhà</p><p className="text-[16px] font-bold text-slate-800">{dot.tai_nha} dạng</p></div>
                      <div className="flex-1 rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-slate-200"><p className="text-[11px] text-slate-500">Làm cùng TA</p><p className="text-[16px] font-bold text-slate-800">{dot.tai_ca} dạng</p></div>
                      <div className={`flex-1 rounded-lg px-2.5 py-1.5 ring-1 ${con.length ? 'bg-amber-50 ring-amber-200' : 'bg-emerald-50 ring-emerald-200'}`}><p className="text-[11px] text-slate-500">Còn lại</p><p className={`text-[16px] font-bold ${con.length ? 'text-amber-700' : 'text-emerald-700'}`}>{con.length} dạng</p></div>
                    </div>
                    {con.length > 0 && <p className="mb-1 mt-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Cần làm cùng em</p>}
                    {con.map((d: DangDuoiHS) => {
                      const coMcq = dangByCase[r.bo_tro_duoi_id!]?.find((x) => x.ma_dang === d.ma_dang)?.co_mcq ?? false
                      const kb = kichBanDuoi(coMcq, coThietBi)
                      const chiTiet = d.trang_thai === 'dang_hoc'
                        ? [d.doc_ly_thuyet ? 'đã đọc lý thuyết' : 'chưa đọc lý thuyết', d.luyen_cau > 0 ? `luyện ${d.luyen_dung}/${d.luyen_cau}` : null, d.test_lan > 0 && d.test_gan_nhat != null ? `test lần gần nhất ${d.test_gan_nhat}%` : null].filter(Boolean).join(' · ')
                        : d.trang_thai === 'khoa' ? (() => { const cung = dot.dangs.filter((x) => x.ma_chuyen_de === d.ma_chuyen_de); const t = cung[cung.findIndex((x) => x.ma_dang === d.ma_dang) - 1]; return t ? `đang khoá — chờ «${t.ten_dang}»` : 'đang khoá' })() : d.trang_thai === 'giay' ? 'học + chấm trên giấy' : 'chưa bắt đầu'
                      return (
                        <div key={d.ma_dang} className="mb-1.5 flex items-center gap-2 rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-200">
                          <span className="text-[16px]">{d.trang_thai === 'dang_hoc' ? '📖' : d.trang_thai === 'khoa' ? '🔒' : d.trang_thai === 'giay' ? '📄' : '▶️'}</span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-slate-800">{d.ten_dang}</p>
                            <p className="truncate text-[11.5px] text-slate-500">{chiTiet}</p>
                          </div>
                          {d.trang_thai === 'khoa' && (
                            <button disabled={dgXong || moBusy === d.ma_dang} onClick={async () => {
                              setMoBusy(d.ma_dang)
                              try { await moTayDangDuoi(r.hoc_sinh_id, mon, d.ma_dang); await reload() } catch (e: any) { alert(e.message ?? String(e)) } finally { setMoBusy(null) }
                            }} className="shrink-0 rounded-lg border border-indigo-300 bg-indigo-50 px-2.5 py-1 text-[12px] font-bold text-indigo-700 disabled:opacity-50">{moBusy === d.ma_dang ? '…' : 'Mở khoá'}</button>
                          )}
                          {d.trang_thai !== 'khoa' && (kb === 1 && d.tren_app
                            ? <span className="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-[11.5px] text-slate-500" title="Em tự làm trên app, máy tự chấm">📱 trên app</span>
                            : kb === null && d.tren_app
                              ? <span className="shrink-0 rounded-lg border border-dashed border-slate-200 px-2 py-1 text-[11.5px] text-slate-400">chọn thiết bị</span>
                              : (
                                <button disabled={dgXong} onClick={() => setGiayPanel({ hocSinhId: r.hoc_sinh_id, mon, maDang: d.ma_dang })}
                                  title={kb === 2 ? 'Chưa có trắc nghiệm — em đọc đề trên iPad, TA chấm ĐCS' : 'In giấy, TA chấm ĐCS'}
                                  className="shrink-0 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[12px] font-bold text-amber-700 disabled:opacity-50">{kb === 2 ? '✏️ Chấm' : '🖨 Giấy'}</button>
                              ))}
                        </div>
                      )
                    })}
                    {xongDs.length > 0 && (
                      <details className="mt-1.5">
                        <summary className="cursor-pointer text-[12px] font-semibold text-emerald-700">Đã xong ({xongDs.length})</summary>
                        <div className="mt-1 flex flex-col gap-1">
                          {xongDs.map((d) => (
                            <p key={d.ma_dang} className="flex items-center gap-2 text-[12.5px] text-slate-700">
                              <span className="text-emerald-600">✓</span><span className="min-w-0 flex-1 truncate">{d.ten_dang}</span>
                              <span className="shrink-0 text-[11.5px] text-slate-500">{d.noi_lam === 'ca' ? 'tại ca' : 'ở nhà'}{d.test_gan_nhat != null ? ` · ${d.test_gan_nhat}%` : ''}</span>
                            </p>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )
              })()}

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
