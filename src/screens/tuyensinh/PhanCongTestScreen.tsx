// Tab PHÂN CÔNG test đầu vào (CEO 13/09): bảng 3 cột — Khối · Người chấm · Người trả bài — theo từng MÔN.
// Ops không chọn người từng ca nữa; ca test mới được trigger DB (`tg_ca_test_phan_cong`) gán từ bảng này
// lúc tạo, và người được phân công thấy ca ngay ở "Việc của tôi" (từ lúc ca còn đang test).
// Chọn = lưu ngay (upsert 1 ô), vá dòng tại chỗ — không quét lại bảng (CLAUDE.md §2). Log ở DB.
import { useEffect, useMemo, useState } from 'react'
import { MON_OPTIONS, listPhanCongTest, upsertPhanCongTest, listNguoiChoCham, listNguoiChoTraBai, type PhanCongTestRow, type NguoiChoAssign } from '../../lib/tuyensinh'
import { KHOI_OPTIONS } from '../../lib/kho/api'
import SearchSelect from '../../components/SearchSelect'

const NHO: { mon: string | null } = { mon: null }

export default function PhanCongTestScreen() {
  const [mon, setMon] = useState<string>(NHO.mon ?? MON_OPTIONS[0])
  const [rows, setRows] = useState<Record<string, PhanCongTestRow>>({})
  const [choCham, setChoCham] = useState<NguoiChoAssign[]>([])
  const [choTraBai, setChoTraBai] = useState<NguoiChoAssign[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [luuO, setLuuO] = useState<string | null>(null) // "khoi|cot" đang lưu
  useEffect(() => { NHO.mon = mon }, [mon])

  useEffect(() => {
    let alive = true
    setLoading(true); setErr(null); setRows({})
    Promise.all([listPhanCongTest(mon), listNguoiChoCham(mon), listNguoiChoTraBai(mon)])
      .then(([pc, c, t]) => { if (!alive) return; setRows(Object.fromEntries(pc.map((r) => [r.khoi, r]))); setChoCham(c); setChoTraBai(t) })
      .catch((e) => alive && setErr(e.message ?? String(e)))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [mon])

  const optCham = useMemo(() => choCham.map((n) => ({ id: n.nhanSuId, label: n.hoTen, sub: n.ganDay ? 'gần đây' : undefined })), [choCham])
  const optTra = useMemo(() => choTraBai.map((n) => ({ id: n.nhanSuId, label: n.hoTen, sub: n.ganDay ? 'gần đây' : undefined })), [choTraBai])
  const tenNs = (list: NguoiChoAssign[], id: string | null) => list.find((n) => n.nhanSuId === id)?.hoTen ?? null

  async function doi(khoi: string, cot: 'cham' | 'tra', id: string | null) {
    const key = `${khoi}|${cot}`
    setLuuO(key); setErr(null)
    try {
      await upsertPhanCongTest(khoi, mon, cot === 'cham' ? { nguoiChamId: id } : { nguoiTraBaiId: id })
      setRows((s) => {
        const cu = s[khoi] ?? { khoi, mon, nguoiChamId: null, nguoiChamTen: null, nguoiTraBaiId: null, nguoiTraBaiTen: null, updatedAt: null }
        const moi: PhanCongTestRow = cot === 'cham'
          ? { ...cu, nguoiChamId: id, nguoiChamTen: tenNs(choCham, id), updatedAt: new Date().toISOString() }
          : { ...cu, nguoiTraBaiId: id, nguoiTraBaiTen: tenNs(choTraBai, id), updatedAt: new Date().toISOString() }
        return { ...s, [khoi]: moi }
      })
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLuuO(null) }
  }

  const daPhanCong = KHOI_OPTIONS.filter((k) => rows[k]?.nguoiChamId || rows[k]?.nguoiTraBaiId).length

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Phân công chấm · trả bài</h2>
          <p className="text-[12px] text-slate-400">Mặc định theo khối. Ca test mới tự lấy người ở đây; người được phân công thấy ca ngay trong "Việc của tôi". Đổi ở đây chỉ áp cho ca tạo từ giờ trở đi.</p>
        </div>
        <div className="ml-auto inline-flex rounded-full bg-slate-100 p-0.5">
          {MON_OPTIONS.map((m) => (
            <button key={m} onClick={() => setMon(m)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${mon === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m}</button>
          ))}
        </div>
      </div>

      {err && <p className="mb-2 text-[12px] text-rose-600">{err}</p>}
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="w-[110px] px-4 py-2.5">Khối</th>
                <th className="px-3 py-2.5">Người chấm</th>
                <th className="px-3 py-2.5">Người trả bài</th>
              </tr>
            </thead>
            <tbody>
              {KHOI_OPTIONS.map((k) => {
                const r = rows[k]
                return (
                  <tr key={k} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-semibold text-slate-800">Khối {k}{(luuO === `${k}|cham` || luuO === `${k}|tra`) && <span className="ml-1 text-[11px] font-normal text-slate-400">đang lưu…</span>}</td>
                    <td className="px-3 py-1.5"><SearchSelect value={r?.nguoiChamId ?? null} onChange={(id) => doi(k, 'cham', id)} options={optCham} placeholder="🔎 Chọn người chấm…" /></td>
                    <td className="px-3 py-1.5"><SearchSelect value={r?.nguoiTraBaiId ?? null} onChange={(id) => doi(k, 'tra', id)} options={optTra} placeholder="🔎 Chọn người trả bài…" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
            {mon}: {daPhanCong}/{KHOI_OPTIONS.length} khối đã phân công · danh sách người = nhân sự thuộc môn {mon}, nhóm "gần đây" là người từng được gán.
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
