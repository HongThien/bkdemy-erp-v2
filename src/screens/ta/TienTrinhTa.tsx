// Box TIẾN TRÌNH app TA (CEO 07/09): mỗi LỚP 1 card to, trong đó 3 card nhỏ (buổi · BTVN · ET)
// thực/chuẩn; bổ trợ 1 card riêng theo TA; trên cùng là card tổng (trung bình % + tổng thiếu/thừa
// từng chỉ số — trung bình che mất "lớp A thừa, lớp B thiếu" nên hiện cả hai). Số tính ở
// fn_ta_tien_trinh; định mức từ bảng ta_dinh_muc. KHÔNG dùng tính lương.
import { useEffect, useState } from 'react'
import { taTienTrinh, type TaTienTrinh, type TienTrinhLop } from '../../lib/tatientrinh'

const CHI_SO: { key: 'buoi' | 'btvn' | 'et'; label: string; icon: string }[] = [
  { key: 'buoi', label: 'Buổi trợ giảng', icon: '🏫' },
  { key: 'btvn', label: 'Chấm BTVN', icon: '📚' },
  { key: 'et', label: 'Chấm ET', icon: '🧪' },
]
const thuc = (l: TienTrinhLop, k: 'buoi' | 'btvn' | 'et') => l[`${k}_thuc`]
const chuan = (l: TienTrinhLop, k: 'buoi' | 'btvn' | 'et') => l[`${k}_chuan`]

function Mini({ icon, label, t, c }: { icon: string; label: string; t: number; c: number }) {
  const lech = t - c
  const pct = c > 0 ? Math.min(100, Math.round((100 * t) / c)) : 0
  const tone = lech >= 0 ? 'text-emerald-600' : 'text-rose-600'
  return (
    <div className="rounded-xl bg-slate-50 p-2.5">
      <p className="text-[11px] font-semibold text-slate-500">{icon} {label}</p>
      <p className="mt-0.5 text-[17px] font-extrabold text-slate-800">{t}<span className="text-[12px] font-semibold text-slate-400">/{c}</span></p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${lech >= 0 ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width: `${pct}%` }} /></div>
      <p className={`mt-0.5 text-[11px] font-semibold ${tone}`}>{lech === 0 ? 'đủ' : lech > 0 ? `thừa ${lech}` : `thiếu ${-lech}`}</p>
    </div>
  )
}

export default function TienTrinhTa({ ym }: { ym: string }) {
  const [d, setD] = useState<TaTienTrinh | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setD(null); setErr(null); taTienTrinh(ym).then(setD).catch((e) => setErr(e?.message ?? String(e))) }, [ym])
  if (err) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
  if (!d) return <p className="text-[13px] text-slate-400">Đang tính…</p>

  // Tổng trên cùng: chỉ là tổng/trung bình của các số ĐÃ tính sẵn đang render (hiển thị), không phải công thức nghiệp vụ mới.
  const tong = { buoi: [0, 0], btvn: [0, 0], et: [0, 0] } as Record<'buoi' | 'btvn' | 'et', [number, number]>
  for (const l of d.lop) for (const c of CHI_SO) { tong[c.key][0] += thuc(l, c.key); tong[c.key][1] += chuan(l, c.key) }
  const tongThuc = tong.buoi[0] + tong.btvn[0] + tong.et[0] + Math.min(d.botro.thuc_gio, d.botro.chuan_gio)
  const tongChuan = tong.buoi[1] + tong.btvn[1] + tong.et[1] + d.botro.chuan_gio
  const pctTong = tongChuan > 0 ? Math.round((100 * tongThuc) / tongChuan) : null

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold text-slate-800">{pctTong == null ? '—' : `${pctTong}%`}</span>
          <span className="text-[13px] font-semibold text-slate-500">định mức tháng · {d.lop.length} lớp</span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2 text-center">
          {CHI_SO.map((c) => {
            const lech = tong[c.key][0] - tong[c.key][1]
            return (
              <div key={c.key} className="rounded-xl bg-slate-50 p-2">
                <p className="text-[10.5px] font-semibold text-slate-400">{c.icon} {c.label.split(' ')[0]}</p>
                <p className={`text-[13px] font-bold ${lech >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{lech === 0 ? 'đủ' : lech > 0 ? `+${lech}` : lech}</p>
              </div>
            )
          })}
          <div className="rounded-xl bg-slate-50 p-2">
            <p className="text-[10.5px] font-semibold text-slate-400">🧑‍🏫 Bổ trợ</p>
            <p className={`text-[13px] font-bold ${d.botro.thuc_gio >= d.botro.chuan_gio ? 'text-emerald-600' : 'text-rose-600'}`}>
              {d.botro.thuc_gio >= d.botro.chuan_gio ? 'đủ' : `-${Math.round((d.botro.chuan_gio - d.botro.thuc_gio) * 10) / 10}h`}</p>
          </div>
        </div>
      </div>

      {!d.lop.length ? <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[12.5px] text-slate-400">Bạn chưa được phân công trợ giảng lớp nào đang học.</p>
        : d.lop.map((l) => (
          <div key={l.lop_id} className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-[15px] font-bold text-slate-800">{l.ten_lop}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{l.buoi_tuan} buổi/tuần</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CHI_SO.map((c) => <Mini key={c.key} icon={c.icon} label={c.label} t={thuc(l, c.key)} c={chuan(l, c.key)} />)}
            </div>
          </div>
        ))}

      <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
        <p className="mb-2 text-[15px] font-bold text-slate-800">🧑‍🏫 Bổ trợ <span className="text-[11.5px] font-medium text-slate-400">(theo bạn, không theo lớp)</span></p>
        <Mini icon="⏱" label="Giờ bổ trợ" t={d.botro.thuc_gio} c={d.botro.chuan_gio} />
        <p className="mt-1.5 text-[11.5px] text-slate-400">{d.botro.so_ca} ca đã đứng · ca không ghi giờ tính 1h.</p>
      </div>
      <p className="px-1 text-[11px] text-slate-400">Chuẩn buổi = số buổi/tuần × {d.dinh_muc.buoi_x_tuan}. "Thực" chỉ đếm tới hôm nay. Buổi trợ giảng đếm theo buổi lớp đã diễn ra (ERP không chấm công). Bảng này để nhìn thừa/thiếu, không dùng tính lương.</p>
    </div>
  )
}
