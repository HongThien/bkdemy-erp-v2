// QUẢN LÝ LEVEL (staff, gu SaaS) — CHỈ VIEW ma trận Level (Σ verdict×hệ số, max 21). Nhập điểm đã CHUYỂN
// sang Kết quả học tập → tab "Điểm thi" › "Nhập điểm" (Thùy 07-14: nhập liệu nên ở "quản lý chất lượng",
// chỗ này chỉ để xem) — tránh 2 nơi cùng nhập trùng nhau. Cùng data-layer thanhtich.ts, không đổi công thức Level.
import { useEffect, useState } from 'react'
import { listLop, listHSCuaLop, type Lop, type HSTrongLop } from '../../lib/nhansu'
import { listKyThi, listDiemThiByKyThi, currentMua, verdictDiem, LOAI_KY_THI, type KyThi, type DiemThi, type Verdict } from '../../lib/thanhtich'
import SearchSelect from '../../components/SearchSelect'
import { tenHienThiDs } from '../../lib/hoten'

const V_LABEL: Record<Verdict, string> = { dat: 'Đạt', gan_dat: 'Gần', khong_dat: 'Không' }
const V_DOT: Record<Verdict, string> = { dat: 'bg-emerald-100 text-emerald-700', gan_dat: 'bg-amber-100 text-amber-700', khong_dat: 'bg-rose-100 text-rose-600' }

export default function QuanLyLevelScreen() {
  const mua = currentMua()
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [roster, setRoster] = useState<HSTrongLop[]>([])
  const [kyThis, setKyThis] = useState<KyThi[]>([])
  const [diems, setDiems] = useState<DiemThi[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { listLop().then((l) => setLops(l.filter((x) => x.trang_thai === 'dang_hoc'))).catch(() => {}) }, [])
  const lop = lops.find((l) => l.id === lopId) ?? null

  async function reload(l: Lop) {
    setLoading(true)
    try {
      const [r, kt] = await Promise.all([listHSCuaLop(l.id), listKyThi(mua, l.mon)])
      const kts = kt.filter((k) => !k.khoi || k.khoi === l.khoi)
      setRoster(r); setKyThis(kts)
      setDiems(await listDiemThiByKyThi(kts.map((k) => k.id)))
    } finally { setLoading(false) }
  }
  useEffect(() => { setRoster([]); setKyThis([]); setDiems([]); if (lop) reload(lop) }, [lopId]) // eslint-disable-line

  const diemOf = (kyThiId: string, hsId: string) => diems.find((d) => d.ky_thi_id === kyThiId && d.hoc_sinh_id === hsId) ?? null
  const heSoOf = (kyThiId: string) => kyThis.find((k) => k.id === kyThiId)?.he_so ?? 1
  const levelOf = (hsId: string) => diems.filter((d) => d.hoc_sinh_id === hsId).reduce((s, d) => s + verdictDiem(d.verdict, heSoOf(d.ky_thi_id)), 0)
  const maxLevel = kyThis.reduce((s, k) => s + k.he_so, 0) // tối đa thực tế theo số kì thi đã tạo

  const tenHT = tenHienThiDs(roster.map((hs) => hs.hoc_sinh?.ho_ten)) // trùng tên trong lớp → bung đủ (Thùy 07-06)

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Quản lý Level</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">chỉ xem — nhập điểm ở Kết quả học tập › Điểm thi › Nhập điểm</span>
        <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[12px] font-semibold text-violet-600">Mùa {mua}</span>
        <div className="w-72">
          <SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…"
            options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ` · K${l.khoi}` : ''}` }))} />
        </div>
        {lop && <span className="text-[12px] text-slate-400">Môn <b className="text-slate-600">{lop.mon}</b> · {roster.length} HS · {kyThis.length}/13 kì thi</span>}
      </div>

      {!lop ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Chọn một lớp để xem Level.</div>
      ) : loading ? (
        <div className="p-8 text-sm text-slate-400">Đang tải…</div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[12px]">
              <thead className="text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-left">Học sinh</th>
                  {kyThis.map((k) => <th key={k.id} className="sticky top-0 z-10 bg-slate-50 px-2 py-2 text-center" title={`${LOAI_KY_THI[k.loai]} ·×${k.he_so}`}>{k.ten}</th>)}
                  <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Level</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((hs, i) => (
                  <tr key={hs.hoc_sinh_id} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 font-medium text-slate-700">{tenHT[i]}</td>
                    {kyThis.map((k) => {
                      const d = diemOf(k.id, hs.hoc_sinh_id)
                      return <td key={k.id} className="px-2 py-1.5 text-center">
                        {d ? <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${V_DOT[d.verdict]}`}>{d.diem ?? V_LABEL[d.verdict]}{d.vuot_band ? '↑' : ''}</span> : <span className="text-slate-300">—</span>}
                      </td>
                    })}
                    <td className="px-3 py-1.5 text-center font-bold text-indigo-600">{levelOf(hs.hoc_sinh_id)}<span className="text-[10px] font-medium text-slate-400">/{maxLevel || 21}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
