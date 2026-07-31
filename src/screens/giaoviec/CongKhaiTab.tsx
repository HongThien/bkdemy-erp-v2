// TAB CÔNG KHAI (§7 màn 2 — TOÀN TRUNG TÂM, chốt CEO 07-31) + màn TỔNG.
// Ai nhận việc gì tuần này · ai trễ · gia hạn mấy lần. Áp lực từ đồng nghiệp nhìn thấy.
// Tổng: tỉ lệ phát sinh, huỷ theo người giao, hạng mục quá chân trời.
import { useEffect, useState } from 'react'
import {
  listViecTheoTuan, tiLePhatSinh, demViecHuyTheoNguoiGiao, listHangMuc, hangMucQuaChanTroi,
  type ViecFull, type HangMucFull,
} from '../../lib/giaoviec'
import { kyTuanHienTai, kyTuanCuaNgay, nhanKyTuan, todayVN, soNgayLech } from '../../lib/giaoviec-config'
import { Badge, VIEC_TT, Section, Empty, ErrBar, Stat, fmtNgay } from './ui'

export default function CongKhaiTab() {
  const [ky, setKy] = useState(kyTuanHienTai())
  const [rows, setRows] = useState<ViecFull[]>([])
  const [phatSinh, setPhatSinh] = useState<{ tong: number; phatSinh: number; tiLe: number | null } | null>(null)
  const [huyMap, setHuyMap] = useState<Record<string, number>>({})
  const [hangMucs, setHangMucs] = useState<HangMucFull[]>([])
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [v, ps, hm, hMuc] = await Promise.all([listViecTheoTuan(ky), tiLePhatSinh(ky), demViecHuyTheoNguoiGiao(), listHangMuc(['backlog', 'dang_chay'])])
      setRows(v); setPhatSinh(ps); setHuyMap(hm); setHangMucs(hMuc)
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [ky])

  function dichTuan(delta: number) {
    const [y, m, d] = ky.split('-').map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d)); dt.setUTCDate(dt.getUTCDate() + delta * 7)
    setKy(kyTuanCuaNgay(`${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`))
  }
  const quaChanTroi = hangMucs.filter(hangMucQuaChanTroi)

  return (
    <div className="mx-auto max-w-[960px] space-y-5">
      <ErrBar msg={err} />
      <div className="flex items-center gap-2">
        <button onClick={() => dichTuan(-1)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">‹</button>
        <span className="text-sm font-semibold text-slate-800">{nhanKyTuan(ky)}</span>
        <button onClick={() => dichTuan(1)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">›</button>
        {ky !== kyTuanHienTai() && <button onClick={() => setKy(kyTuanHienTai())} className="text-[12px] text-indigo-600 hover:underline">về tuần này</button>}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Task tuần này" value={phatSinh?.tong ?? 0} />
        <Stat label="Tỉ lệ phát sinh" value={phatSinh?.tiLe === null ? '—' : `${phatSinh?.tiLe}%`} accent={(phatSinh?.tiLe ?? 0) > 50 ? 'text-rose-600' : 'text-slate-800'} />
        <Stat label="Đạt tuần này" value={rows.filter((r) => r.trang_thai === 'dat').length} accent="text-emerald-600" />
        <Stat label="Hạng mục quá chân trời" value={quaChanTroi.length} accent={quaChanTroi.length ? 'text-rose-600' : 'text-slate-800'} />
      </div>
      {(phatSinh?.tiLe ?? 0) > 50 && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">⚠ Tỉ lệ phát sinh &gt; 50% — trung tâm đang chữa cháy, backlog chỉ là đồ trang trí.</div>}

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <Section title={`Ai nhận việc gì tuần này (${rows.length})`}>
          {!rows.length ? <Empty>Không có task nào trong tuần này.</Empty> : (
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-[13px]">
                <thead><tr className="border-b border-slate-100 text-left text-[11px] text-slate-400">
                  <th className="px-3 py-2">Việc</th><th className="px-3 py-2">Người làm</th><th className="px-3 py-2">Trạng thái</th><th className="px-3 py-2">Hạn</th><th className="px-3 py-2">Trễ/GH</th>
                </tr></thead>
                <tbody>
                  {rows.map((v) => {
                    const treNgay = v.deadline && ['moi_giao', 'dang_lam', 'tra_lai', 'cho_nghiem_thu'].includes(v.trang_thai) ? Math.max(0, soNgayLech(v.deadline, todayVN())) : 0
                    return (
                      <tr key={v.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-3 py-2"><span className="font-medium text-slate-800">{v.tieu_de}</span>{v.nguon === 'phat_sinh' && <span className="ml-1 rounded bg-orange-50 px-1 text-[10px] text-orange-700">PS</span>}</td>
                        <td className="px-3 py-2 text-slate-600">{v.nguoi_lam_ten}</td>
                        <td className="px-3 py-2"><Badge map={VIEC_TT} k={v.trang_thai} /></td>
                        <td className="px-3 py-2 text-slate-500">{fmtNgay(v.deadline)}</td>
                        <td className="px-3 py-2">
                          {treNgay > 0 && <span className="font-semibold text-rose-600">trễ {treNgay}d</span>}
                          {v.so_lan_gia_han > 0 && <span className="ml-1 text-amber-600">GH{v.so_lan_gia_han}</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {!!quaChanTroi.length && (
        <Section title="Hạng mục quá chân trời — phải quyết lại">
          {quaChanTroi.map((hm) => (
            <div key={hm.id} className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-rose-200">
              <b className="text-slate-800">{hm.ten}</b> <span className="text-[12px] text-rose-600">· chân trời {fmtNgay(hm.chan_troi)} đã qua · đã ra {hm.so_lat_da_ra} lát</span>
            </div>
          ))}
        </Section>
      )}

      {Object.keys(huyMap).length > 0 && (
        <Section title="Số lần huỷ theo người giao (kỷ luật giao việc)">
          <div className="rounded-2xl bg-white p-3.5 text-[12px] text-slate-600 shadow-sm">
            {Object.entries(huyMap).sort((a, b) => b[1] - a[1]).map(([id, n]) => {
              const ten = rows.find((r) => r.nguoi_giao_id === id)?.nguoi_giao_ten ?? id.slice(0, 8)
              return <span key={id} className="mr-3 inline-block">{ten}: <b className="text-rose-600">{n}</b></span>
            })}
          </div>
        </Section>
      )}
    </div>
  )
}
