// Popup "Lịch sử bổ trợ" (Thùy 23/09): TOÀN BỘ hoạt động bổ trợ của 1 em (1 môn) trong 2 tuần — buổi yếu/bù/đuổi (điểm danh, dạng dạy, luyện,
// test cuối ca, nhận xét, chế độ app/giấy, huỷ vì sao) · retest (đạt/trượt từng dạng) · lượt duyệt level · báo động · case mở/đóng.
// Dữ liệu = 1 RPC `fn_btyeu_lich_su_hs` (tổng hợp ở DB, §2.0); ở đây chỉ render theo thời gian giảm dần. Dùng ở màn Duyệt bổ trợ + Dashboard.
import { useEffect, useState } from 'react'
import { lichSuBoTroHS, type SuKienBoTro } from '../../lib/botro_yeu'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

const LOAI_BUOI: Record<string, string> = { bo_tro_yeu: 'Bổ trợ yếu', bu: 'Học bù', bo_tro_duoi: 'Học đuổi' }
const hhmm = (t: unknown) => (t ? String(t).slice(0, 5) : '')
const gioVN = (iso: string) => new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

export function LichSuBoTroNut({ hocSinhId, mon, className }: { hocSinhId: string; mon: string; className?: string }) {
  const [mo, setMo] = useState(false)
  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setMo(true) }} className={className ?? 'rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50'}>🕘 Lịch sử bổ trợ</button>
      {mo && <LichSuBoTroModal hocSinhId={hocSinhId} mon={mon} onDong={() => setMo(false)} />}
    </>
  )
}

export function LichSuBoTroModal({ hocSinhId, mon, tenHS, onDong }: { hocSinhId: string; mon: string; tenHS?: string; onDong: () => void }) {
  const [soNgay, setSoNgay] = useState(14)
  const [ds, setDs] = useState<SuKienBoTro[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { setDs(null); lichSuBoTroHS(hocSinhId, mon, soNgay).then(setDs).catch((e: any) => setLoi(e?.message ?? String(e))) }, [hocSinhId, mon, soNgay])

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-auto bg-slate-900/40 p-6" onClick={onDong}>
      <div className="w-full max-w-[760px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold text-slate-800">🕘 Lịch sử bổ trợ{tenHS ? ` — ${tenHS}` : ''} <span className="font-normal text-slate-400">· {mon}</span></h3>
          <select value={soNgay} onChange={(e) => setSoNgay(Number(e.target.value))} className="ml-auto rounded-md border border-slate-300 px-1.5 py-1 text-[12px]">
            {[14, 30, 60].map((n) => <option key={n} value={n}>{n} ngày gần nhất</option>)}
          </select>
          <button onClick={onDong} className="rounded-lg border border-slate-200 px-2 py-1 text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {loi && <p className="text-[12px] text-rose-600">{loi}</p>}
        {ds === null ? <p className="py-6 text-center text-[13px] text-slate-400">Đang tải…</p>
          : ds.length === 0 ? <p className="py-6 text-center text-[13px] text-slate-400">Không có hoạt động bổ trợ nào trong {soNgay} ngày qua.</p>
          : (
            <ol className="relative space-y-2 border-l-2 border-slate-100 pl-4">
              {ds.map((e, i) => <li key={i} className="relative"><span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300" /><SuKien e={e} /></li>)}
            </ol>
          )}
      </div>
    </div>
  )
}

function SuKien({ e }: { e: SuKienBoTro }) {
  const d = e.d as any
  const ngay = `${thuCuaNgay(e.t.slice(0, 10))} ${ddmmVN(e.t.slice(0, 10))}`
  const Khung = ({ mau, tieuDe, children }: { mau: string; tieuDe: React.ReactNode; children?: React.ReactNode }) => (
    <div className={`rounded-xl px-3 py-2 ring-1 ${mau}`}>
      <div className="flex flex-wrap items-baseline gap-x-2 text-[13px]"><span className="font-semibold text-slate-800">{tieuDe}</span><span className="text-[11px] text-slate-400">{ngay}{e.loai !== 'buoi' && e.loai !== 'retest' ? ` · ${gioVN(e.t)}` : ''}</span></div>
      {children && <div className="mt-0.5 text-[12px] text-slate-600">{children}</div>}
    </div>
  )
  if (e.loai === 'buoi') {
    const huy = d.trang_thai === 'huy'
    return (
      <Khung mau={huy ? 'bg-rose-50/50 ring-rose-200' : d.trang_thai === 'hoan_tat' ? 'bg-emerald-50/50 ring-emerald-200' : 'bg-white ring-slate-200'}
        tieuDe={<>{LOAI_BUOI[d.loai_buoi] ?? d.loai_buoi}{d.gio ? ` · ${hhmm(d.gio)}` : ''}{d.phong ? ` · ${d.phong}` : ''}{d.nguoi ? ` · ${d.nguoi}` : ''}{d.che_do ? (d.che_do === 'giay' ? ' · 📄 giấy' : ' · 📱 app') : ''}</>}>
        {huy ? <span className="text-rose-700">Huỷ — {d.ly_do_huy ?? 'không rõ lý do'}</span> : (
          <>
            <span>{d.diem_danh === 'co_mat' ? '✓ có mặt' : d.diem_danh ? `vắng (${d.diem_danh})` : 'chưa điểm danh'}</span>
            {Array.isArray(d.dang_day) && d.dang_day.length > 0 && <span> · dạy: {d.dang_day.join(', ')}</span>}
            {d.luyen?.so_cau > 0 && <span> · luyện {d.luyen.so_dung}/{d.luyen.so_cau} đúng</span>}
            {d.test?.so_cau > 0 && <span> · test cuối ca {d.test.so_dung}/{d.test.so_cau}{d.test.da_nop ? '' : ' (chưa nộp)'}</span>}
            {d.nhan_xet && <div className="mt-0.5 italic text-slate-500">“{d.nhan_xet}”</div>}
          </>
        )}
      </Khung>
    )
  }
  if (e.loai === 'retest') return (
    <Khung mau="bg-violet-50/50 ring-violet-200" tieuDe={<>📝 Retest · {d.so_cau} câu{d.da_nop ? ` · đúng ${d.so_dung}/${d.so_cau}` : ' · chưa làm'}</>}>
      {Array.isArray(d.dang) && d.dang.filter((x: any) => x.ma_dang).map((x: any) => (
        <span key={x.ma_dang} className={`mr-1.5 inline-block rounded px-1.5 py-px text-[11px] font-semibold ${x.dat === true ? 'bg-emerald-100 text-emerald-800' : x.dat === false ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>{x.ma_dang}{x.dat === true ? ' ✓ đạt' : x.dat === false ? ' ✗ trượt' : ''}{x.diem != null ? ` ${Number(x.diem).toFixed(2)}` : ''}</span>
      ))}
    </Khung>
  )
  if (e.loai === 'duyet') return (
    <Khung mau="bg-indigo-50/50 ring-indigo-200" tieuDe={<>Duyệt {d.loai === 'thai_do' ? 'thái độ' : 'kiến thức'}: L{d.level_cu ?? 0} → <b>L{d.level_chot}</b>{d.level_may != null && d.level_may !== d.level_chot ? ` (máy đề xuất L${d.level_may})` : ''}</>}>
      {d.ly_do && <span>Lý do: {d.ly_do}</span>}
    </Khung>
  )
  if (e.loai === 'bao_dong') return <Khung mau="bg-red-50/60 ring-red-200" tieuDe={<>🚨 Báo động · {d.ma_dang ?? '—'} · nguồn {d.nguon}</>}>{d.ghi_chu}</Khung>
  if (e.loai === 'case_mo') return <Khung mau="bg-amber-50/50 ring-amber-200" tieuDe={<>Mở case bổ trợ · {d.so_dang} dạng · nguồn {d.nguon}{d.uu_tien === 3 ? ' · ▲ ưu tiên cao' : ''}</>} />
  if (e.loai === 'case_dong') return <Khung mau="bg-emerald-50/50 ring-emerald-200" tieuDe={<>Đóng case · kết quả {d.ket_qua ?? '—'}</>}>{d.ghi_chu}</Khung>
  return <Khung mau="ring-slate-200" tieuDe={e.loai} />
}
