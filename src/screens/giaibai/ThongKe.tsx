// Tab THỐNG KÊ — bài ĐÃ DUYỆT theo tháng (giờ VN, theo duyet_at): top 3 + bảng tổng theo người (số bài · độ khó
// 1→5 · tổng ký tự · tổng công thức · thời gian giải TB) + bảng chi tiết từng bài + tải CSV. Tiền tính NGOÀI hệ.
import { useEffect, useState } from 'react'
import { baoCaoTong, baoCaoChiTiet, fmtTs, fmtGiay, NHANH_LABEL, type BaoCaoTong, type DongNhan } from '../../lib/giaibai'

const thangDau = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const thangCuoi = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
const nhanThang = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

export default function ThongKe() {
  const [thang, setThang] = useState(() => thangDau(new Date()))
  const [tong, setTong] = useState<BaoCaoTong[]>([])
  const [chiTiet, setChiTiet] = useState<DongNhan[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const tu = thangDau(thang), den = thangCuoi(thang)

  useEffect(() => {
    let alive = true
    setLoading(true); setErr(null); setChiTiet(null)
    baoCaoTong(tu, den).then((r) => { if (alive) setTong(r) }).catch((e) => { if (alive) setErr(e.message ?? String(e)) }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [thang]) // eslint-disable-line

  async function taiChiTiet() {
    try { setChiTiet(await baoCaoChiTiet(tu, den)) } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function taiCsv() {
    const rows: DongNhan[] = chiTiet ?? await baoCaoChiTiet(tu, den).then((r) => { setChiTiet(r); return r })
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const head = ['Người giải', 'Mã bài', 'Nhánh', 'Khối', 'Dạng/Mô hình', 'Độ khó', 'Số ký tự', 'Số công thức', 'Nhận lúc', 'Nộp lúc', 'Giải trong (giây)', 'Duyệt lúc', 'Người duyệt', 'Số lần từ chối']
    const lines = rows.map((r) => [r.nguoi_giai_ten, r.ma, NHANH_LABEL[r.nhanh], r.khoi, r.nhom_ten, r.muc_do ?? '', r.so_ky_tu, r.so_cong_thuc, fmtTs(r.created_at), fmtTs(r.nop_at), r.giay_giai ?? '', fmtTs(r.duyet_at), r.duyet_boi_ten, r.tu_choi_lan].map(esc).join(','))
    const blob = new Blob(['﻿' + [head.map(esc).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `giaibai-${thang.getFullYear()}-${String(thang.getMonth() + 1).padStart(2, '0')}.csv`; a.click(); URL.revokeObjectURL(a.href)
  }
  const top3 = tong.slice(0, 3)
  const HUY_CHUONG = ['🥇', '🥈', '🥉']

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-white p-0.5 ring-1 ring-slate-200">
          <button onClick={() => setThang(new Date(thang.getFullYear(), thang.getMonth() - 1, 1))} className="rounded-md px-2 py-1 text-[13px] text-slate-500 hover:bg-slate-100">‹</button>
          <span className="min-w-[88px] text-center text-[13px] font-semibold text-slate-800">Tháng {nhanThang(thang)}</span>
          <button onClick={() => setThang(new Date(thang.getFullYear(), thang.getMonth() + 1, 1))} className="rounded-md px-2 py-1 text-[13px] text-slate-500 hover:bg-slate-100">›</button>
        </div>
        <span className="text-[12px] text-slate-400">bài đã duyệt từ 01 đến {den.getDate()}/{nhanThang(den)} (giờ VN)</span>
        <button onClick={taiCsv} disabled={loading || !tong.length} className="ml-auto rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">⬇ Tải CSV chi tiết</button>
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p> : tong.length === 0 ? <p className="text-sm text-slate-400">Tháng này chưa có bài nào được duyệt.</p> : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {top3.map((t, i) => (
              <div key={t.nguoi_giai} className={`rounded-xl border bg-white p-4 shadow-sm ${i === 0 ? 'border-amber-300' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{HUY_CHUONG[i]}</span>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-slate-900">{t.ho_ten}</div>
                    <div className="text-[12px] text-slate-500">{t.so_bai} bài · {t.tong_ky_tu.toLocaleString('vi-VN')} ký tự · {t.tong_cong_thuc} công thức</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">Người giải</th><th className="px-3 py-2 text-right">Bài</th>
                  {[1, 2, 3, 4, 5].map((m) => <th key={m} className="px-2 py-2 text-right" title={`Độ khó ${m}`}>ĐK{m}</th>)}
                  <th className="px-2 py-2 text-right" title="Nhánh Hình chưa có độ khó">ĐK—</th>
                  <th className="px-3 py-2 text-right">Ký tự</th><th className="px-3 py-2 text-right">Công thức</th><th className="px-3 py-2 text-right">TB giải</th>
                </tr>
              </thead>
              <tbody>
                {tong.map((t, i) => (
                  <tr key={t.nguoi_giai} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{t.ho_ten}</td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900">{t.so_bai}</td>
                    <td className="px-2 py-2 text-right text-slate-600">{t.md1 || ''}</td><td className="px-2 py-2 text-right text-slate-600">{t.md2 || ''}</td><td className="px-2 py-2 text-right text-slate-600">{t.md3 || ''}</td>
                    <td className="px-2 py-2 text-right text-slate-600">{t.md4 || ''}</td><td className="px-2 py-2 text-right text-slate-600">{t.md5 || ''}</td><td className="px-2 py-2 text-right text-slate-400">{t.md_khac || ''}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{t.tong_ky_tu.toLocaleString('vi-VN')}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{t.tong_cong_thuc}</td>
                    <td className="px-3 py-2 text-right text-slate-500">{fmtGiay(t.tb_giay_giai)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            {chiTiet === null ? <button onClick={taiChiTiet} className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-800">▸ Xem chi tiết từng bài</button> : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-2 text-left">Người giải</th><th className="px-3 py-2 text-left">Mã</th><th className="px-3 py-2 text-left">Nhánh</th><th className="px-3 py-2 text-left">Dạng / Mô hình</th><th className="px-2 py-2 text-right">ĐK</th><th className="px-2 py-2 text-right">Ký tự</th><th className="px-2 py-2 text-right">CT</th><th className="px-3 py-2 text-right">Giải trong</th><th className="px-3 py-2 text-right">Duyệt lúc</th><th className="px-3 py-2 text-left">Người duyệt</th></tr>
                  </thead>
                  <tbody>
                    {chiTiet.map((r) => (
                      <tr key={r.id} className="border-t border-slate-100">
                        <td className="px-3 py-1.5 text-slate-800">{r.nguoi_giai_ten}</td><td className="px-3 py-1.5"><code className="text-[11px]">{r.ma}</code></td>
                        <td className="px-3 py-1.5 text-slate-600">{NHANH_LABEL[r.nhanh]} · K{r.khoi}</td><td className="max-w-[260px] truncate px-3 py-1.5 text-slate-600" title={r.nhom_ten}>{r.nhom_ten}</td>
                        <td className="px-2 py-1.5 text-right">{r.muc_do ?? '—'}</td><td className="px-2 py-1.5 text-right">{r.so_ky_tu}</td><td className="px-2 py-1.5 text-right">{r.so_cong_thuc}</td>
                        <td className="px-3 py-1.5 text-right text-slate-500">{fmtGiay(r.giay_giai)}</td><td className="px-3 py-1.5 text-right text-slate-500">{fmtTs(r.duyet_at)}</td><td className="px-3 py-1.5 text-slate-600">{r.duyet_boi_ten}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
