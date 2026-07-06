import { useEffect, useState } from 'react'
import { listTkbVoiNguoiTruc, ganNguoiTruc, goNguoiTruc, listOpsStaff, type TkbOpsRow } from '../../lib/opsvanhanh'
import { todayVN } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

// Phân công CA TRỰC OPS — KHÁC hẳn "Phân công" (lớp × vai GV/TA): đơn vị ở đây = 1 SLOT TKB (ca ×
// phòng × lớp), gán 1 người trực. Pure-derive effective-dated (Thùy chốt 07-06 — KHÔNG đóng băng
// tuần, KHÔNG bảng ngoại lệ): đổi = đóng dòng cũ + mở dòng mới TỪ HÔM NAY; swap 1 buổi thì tự gán
// lại người cũ sau đó. Xem PLAN.md mục A.
const THU_LABEL: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'Chủ nhật' }
const hhmm = (t: string) => t.slice(0, 5)

export default function PhanCongOpsScreen() {
  const [rows, setRows] = useState<TkbOpsRow[]>([])
  const [ds, setDs] = useState<{ id: string; ho_ten: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const [r, n] = await Promise.all([listTkbVoiNguoiTruc(), listOpsStaff()])
      setRows(r); setDs(n)
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])
  // Luôn chừa chỗ cho người ĐANG được gán dù họ đã rời team Ops (tránh SearchSelect hiện trống dù DB có gán).
  const optsFor = (r: TkbOpsRow) => (r.nhanSuId && !ds.some((n) => n.id === r.nhanSuId) ? [...ds, { id: r.nhanSuId, ho_ten: r.nhanSuTen ?? '?' }] : ds)

  async function chon(tkbId: string, nhanSuId: string | null) {
    setSaving(tkbId)
    try {
      if (nhanSuId) await ganNguoiTruc(tkbId, nhanSuId, todayVN())
      else await goNguoiTruc(tkbId, todayVN())
      await reload()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setSaving(null) }
  }

  const groups = [2, 3, 4, 5, 6, 7, 8].map((thu) => ({ thu, rows: rows.filter((r) => r.thu === thu).sort((a, b) => a.gioBatDau.localeCompare(b.gioBatDau)) })).filter((g) => g.rows.length > 0)
  const trongCount = rows.filter((r) => !r.nhanSuId).length

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Phân công Ops (ca trực)</span>
        <span className="text-[12px] text-slate-400">Mỗi ca TKB → 1 người trực (report/tan/prep). Đổi = áp dụng từ hôm nay; swap 1 buổi thì tự gán lại sau.</span>
        {trongCount > 0 && <span className="ml-auto rounded-full bg-rose-50 px-2.5 py-1 text-[12px] font-medium text-rose-700">⚠ {trongCount} ca trống</span>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có ca TKB nào.</div>
          : (
            <div className="flex flex-col gap-4">
              {groups.map((g) => (
                <div key={g.thu}>
                  <div className="mb-1.5 border-l-4 border-indigo-400 pl-2 text-[13px] font-semibold text-slate-600">{THU_LABEL[g.thu]} <span className="font-normal text-slate-400">· {g.rows.length} ca</span></div>
                  <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                    {g.rows.map((r) => (
                      <div key={r.tkbId} className={`rounded-xl border-l-4 bg-white p-2.5 shadow-sm ${r.nhanSuId ? 'border-l-slate-200' : 'border-l-rose-400'}`}>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[14px] font-semibold text-slate-800">{r.lopTen}</span>
                          <span className="text-[11px] text-slate-400">{r.mon}</span>
                          {!r.nhanSuId && <span className="ml-auto text-[11px] font-medium text-rose-600">⚠ trống</span>}
                        </div>
                        <div className="mt-0.5 text-[12px] text-slate-500">{hhmm(r.gioBatDau)}–{hhmm(r.gioKetThuc)}{r.phong ? ` · ${r.phong}` : ''}</div>
                        <div className="mt-1.5">
                          <SearchSelect value={r.nhanSuId} onChange={(id) => chon(r.tkbId, id)} invalid={!r.nhanSuId} placeholder="⚠ chưa gán"
                            options={optsFor(r).map((n) => ({ id: n.id, label: n.ho_ten }))} />
                          {saving === r.tkbId && <span className="text-[11px] text-slate-400">đang lưu…</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
