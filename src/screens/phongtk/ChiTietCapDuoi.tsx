// Bấm 1 nhân vật trong cảnh phòng ⇒ chi tiết TA đó: hiệu suất tháng (BTVN · ET · Bổ trợ — số fn_hsta_thang) · 4 số việc tuần
// (đếm sẵn ở fn_phong_cap_duoi) · danh sách việc tuần + việc tồn · gậy tháng. Màn laptop thấp ⇒ dàn NGANG: 2 cột, mỗi cột tự cuộn.
import { useEffect, useState } from 'react'
import { chiTietCapDuoi, type CapDuoi, type ChiTietCapDuoi } from '../../lib/phongTk'
import { ddmmVN } from '../../lib/tuan'
import { mauHS } from './CanhPhong'

const TT: Record<string, [string, string]> = {
  dang_lam: ['Đang làm', 'bg-sky-50 text-sky-700'], xong: ['Xong đúng hạn', 'bg-emerald-50 text-emerald-700'],
  xong_tre: ['Xong trễ', 'bg-amber-50 text-amber-800'], qua_han: ['Quá hạn', 'bg-rose-50 text-rose-700'],
}
const gio = (ts: string | null) => ts ? new Date(ts).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'
const so = (v: number | null | undefined) => (v == null ? '—' : `${Math.round(v)}`)

export default function ChiTietCapDuoiPopup({ ns, onDong }: { ns: CapDuoi; onDong: () => void }) {
  const [ct, setCt] = useState<ChiTietCapDuoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { setCt(null); setLoi(null); chiTietCapDuoi(ns.nhan_su_id).then(setCt).catch((e) => setLoi(e?.message ?? String(e))) }, [ns.nhan_su_id])
  const hs = ct?.hieu_suat
  const btChot = hs?.chot?.bo_tro?.diem_chot ?? null
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/45 p-4" onClick={onDong}>
      <div className="flex max-h-[88vh] w-[min(1100px,96vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* đầu: người · hiệu suất to · 4 số việc — 1 hàng */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 px-5 py-3">
          <div className="min-w-0">
            <div className="text-[17px] font-bold text-slate-800">{ns.ho_ten}</div>
            <div className="text-[12px] text-slate-500">Trợ giảng · khối {ns.khoi.join(' · ')}</div>
          </div>
          <div className="flex items-baseline gap-2 rounded-xl border-2 px-3 py-1" style={{ borderColor: mauHS(ns.hieu_suat) }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Hiệu suất tháng</span>
            <span className="text-[30px] font-extrabold leading-none" style={{ color: mauHS(ns.hieu_suat) }}>{ns.hieu_suat == null ? '—' : `${Math.round(ns.hieu_suat)}%`}</span>
          </div>
          {hs && (
            <div className="text-[12px] text-slate-500">
              BTVN <b className="text-slate-700">{so(hs.chot?.btvn?.diem_chot ?? hs.btvn_de_xuat)}</b> ·
              ET <b className="text-slate-700">{so(hs.chot?.et?.diem_chot ?? hs.et_de_xuat)}</b> ·
              Bổ trợ <b className="text-slate-700">{btChot == null ? 'chưa chốt' : so(btChot)}</b>
              {!ns.hieu_suat_du && <span className="ml-1 text-slate-400" title="Tổng chỉ tính trên đầu việc đã có số">(chưa đủ 3 đầu việc)</span>}
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <O ten="Đang làm" so={ns.dang_lam} mau="text-sky-600" />
            <O ten="Đã xong" so={ns.da_xong} mau="text-emerald-600" />
            <O ten="Trễ hạn" so={ns.tre_han} mau="text-rose-600" ghi={ns.qua_han ? `${ns.qua_han} chưa xong` : undefined} />
            <O ten="Gậy tháng" so={ns.gay_thang} mau="text-amber-700" />
          </div>
          <button onClick={onDong} className="rounded-lg px-2 py-1 text-[20px] leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>

        {loi ? <p className="p-5 text-[13px] text-rose-600">{loi}</p> : !ct ? <p className="p-5 text-[13px] text-slate-400">Đang tải…</p> : (
          <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[3fr_2fr]">
            <div className="min-h-0 overflow-auto border-slate-100 px-5 py-3 md:border-r">
              <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-500">Việc tuần này <span className="font-normal normal-case tracking-normal text-slate-400">· chấm BTVN · chấm ET · kèm việc tồn quá hạn</span></p>
              {ct.viec.length === 0 ? <p className="text-[13px] text-slate-400">Tuần này chưa có việc.</p> : (
                <table className="w-full text-[12.5px]">
                  <thead><tr className="text-left text-[10.5px] uppercase tracking-wider text-slate-400"><th className="py-1">Buổi</th><th>Lớp</th><th>Việc</th><th>Hạn</th><th>Đóng lần đầu</th><th></th></tr></thead>
                  <tbody>{ct.viec.map((v) => (
                    <tr key={`${v.buoi_id}|${v.tab}`} className="border-t border-slate-100">
                      <td className="py-1.5 text-slate-600">{ddmmVN(v.ngay)}{v.la_ton && <span className="ml-1 text-[10.5px] text-rose-500">tồn</span>}</td>
                      <td className="font-medium text-slate-800">{v.ten_lop}</td>
                      <td className="text-slate-600">{v.tab === 'btvn' ? 'Chấm BTVN' : 'Chấm ET'}</td>
                      <td className="text-slate-500">{gio(v.han)}</td>
                      <td className="text-slate-500">{gio(v.dong_dau)}</td>
                      <td className="text-right"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TT[v.trang_thai]?.[1] ?? ''}`}>{TT[v.trang_thai]?.[0] ?? v.trang_thai}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
            <div className="min-h-0 overflow-auto px-5 py-3">
              <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-500">Gậy tháng này</p>
              {ct.gay.length === 0 ? <p className="text-[13px] text-slate-400">Không có gậy. 👏</p> : (
                <ul className="space-y-1.5">{ct.gay.map((g, i) => (
                  <li key={i} className="rounded-lg bg-amber-50/70 px-3 py-1.5 text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <b className="text-amber-800">{g.so_gay} gậy</b>
                      <span className="min-w-0 flex-1 truncate text-slate-700">{g.ten_loi ?? 'Gậy'}</span>
                      {g.trang_thai === 'cho_chot' && <span className="text-[11px] text-slate-400">đề xuất, chưa chốt</span>}
                    </div>
                    <div className="text-[11.5px] text-slate-500">{g.ngay ? ddmmVN(g.ngay) : ''}{g.ten_lop ? ` · ${g.ten_lop}` : ''}{g.ly_do ? ` · ${g.ly_do}` : ''}</div>
                  </li>
                ))}</ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const O = ({ ten, so, mau, ghi }: { ten: string; so: number; mau: string; ghi?: string }) => (
  <div className="min-w-[78px] rounded-xl bg-slate-50 px-3 py-1.5 text-center">
    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">{ten}</div>
    <div className={`text-[22px] font-extrabold leading-tight ${mau}`}>{so}</div>
    {ghi && <div className="text-[10.5px] text-slate-400">{ghi}</div>}
  </div>
)
