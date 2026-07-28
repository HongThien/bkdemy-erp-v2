import { useEffect, useState } from 'react'
import { listCaVoiNguoiTruc, assignCa, unassignCa, listOpsStaff, CA_TRUC_DEF, CA_TRUC_LIST, type CaAssignRow, type TkbNgoaiCa, type CaTruc } from '../../lib/opsvanhanh'
import { todayVN } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

// Phân công CA TRỰC OPS (Thùy chốt 07-19) — KHÁC hẳn "Phân công" (lớp × vai GV/TA): đơn vị = 1 CA
// (Sáng/Chiều/Tối) × THỨ, gán 1 người trực CHO CẢ CA. Lớp nào thuộc ca nào = hệ thống TỰ SUY từ giờ học
// (caOfGio, opsvanhanh.ts) — KHÔNG chọn tay từng lớp nữa. Pure-derive effective-dated y hệt TKB (Thùy
// chốt 07-06 — KHÔNG đóng băng tuần, KHÔNG bảng ngoại lệ): đổi = đóng dòng cũ + mở dòng mới TỪ HÔM NAY.
const THU_LABEL: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'Chủ nhật' }
const hhmm = (t: string) => t.slice(0, 5)

export default function PhanCongOpsScreen() {
  const [rows, setRows] = useState<CaAssignRow[]>([])
  const [ngoaiCa, setNgoaiCa] = useState<TkbNgoaiCa[]>([])
  const [ds, setDs] = useState<{ id: string; ho_ten: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  // Chỉ hiện "Đang tải…" ở LẦN TẢI ĐẦU (rows rỗng) — sau khi gán 1 ca thì giữ nguyên lưới cũ tới khi data
  // mới về, KHÔNG unmount (cùng bug class đã fix ở HocSinhScreen/PhanCongOpsScreen cũ 07-08/07-10).
  async function reload() {
    if (!rows.length) setLoading(true)
    try {
      const [{ rows: r, ngoaiCa: n }, ops] = await Promise.all([listCaVoiNguoiTruc(), listOpsStaff()])
      setRows(r); setNgoaiCa(n); setDs(ops)
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line
  // Luôn chừa chỗ cho người ĐANG được gán dù họ đã rời team Ops (tránh SearchSelect hiện trống dù DB có gán).
  const optsFor = (r: CaAssignRow) => (r.nhanSuId && !ds.some((n) => n.id === r.nhanSuId) ? [...ds, { id: r.nhanSuId, ho_ten: r.nhanSuTen ?? '?' }] : ds)

  async function chon(thu: number, ca: CaTruc, nhanSuId: string | null) {
    const key = `${thu}|${ca}`
    setSaving(key)
    try {
      if (nhanSuId) await assignCa(thu, ca, nhanSuId, todayVN())
      else await unassignCa(thu, ca, todayVN())
      await reload()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setSaving(null) }
  }

  const groups = [2, 3, 4, 5, 6, 7, 8].map((thu) => ({ thu, rows: rows.filter((r) => r.thu === thu) })).filter((g) => g.rows.length > 0)
  const trongCount = rows.filter((r) => !r.nhanSuId).length

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Phân công Ops (ca trực)</span>
        <span className="text-[12px] text-slate-400">Mỗi ca (Sáng/Chiều/Tối) → 1 người trực toàn bộ lớp trong ca đó. Lớp tự fill theo giờ học. Đổi = áp dụng từ hôm nay.</span>
        {trongCount > 0 && <span className="ml-auto rounded-full bg-rose-50 px-2.5 py-1 text-[12px] font-medium text-rose-700">⚠ {trongCount} ca trống</span>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có ca nào có lớp trong TKB.</div>
          : (
            <div className="flex flex-col gap-4">
              {ngoaiCa.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                  ⚠ {ngoaiCa.length} lớp có giờ học NGOÀI khung 3 ca (Sáng {CA_TRUC_DEF.sang.from}-{CA_TRUC_DEF.sang.to} · Chiều {CA_TRUC_DEF.chieu.from}-{CA_TRUC_DEF.chieu.to} · Tối {CA_TRUC_DEF.toi.from}-{CA_TRUC_DEF.toi.to}) — chưa thuộc ca nào nên chưa ai được phân công trực, kiểm tra lại TKB:
                  <ul className="mt-1 list-disc pl-4">
                    {ngoaiCa.map((s, i) => <li key={i}>{s.lopTen} · {THU_LABEL[s.thu]} {hhmm(s.gioBatDau)}–{hhmm(s.gioKetThuc)}</li>)}
                  </ul>
                </div>
              )}
              {groups.map((g) => (
                <div key={g.thu}>
                  <div className="mb-1.5 border-l-4 border-indigo-400 pl-2 text-[13px] font-semibold text-slate-600">{THU_LABEL[g.thu]}</div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {CA_TRUC_LIST.map((ca) => {
                      const r = g.rows.find((x) => x.ca === ca)
                      if (!r) return null
                      const key = `${g.thu}|${ca}`
                      return (
                        <div key={ca} className={`rounded-xl border-l-4 bg-white p-2.5 shadow-sm ${r.nhanSuId ? 'border-l-slate-200' : 'border-l-rose-400'}`}>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[14px] font-semibold text-slate-800">{CA_TRUC_DEF[ca].label}</span>
                            <span className="text-[11px] text-slate-400">{CA_TRUC_DEF[ca].from}–{CA_TRUC_DEF[ca].to}</span>
                            {!r.nhanSuId && <span className="ml-auto text-[11px] font-medium text-rose-600">⚠ trống</span>}
                          </div>
                          <div className="mt-1.5">
                            <SearchSelect value={r.nhanSuId} onChange={(id) => chon(g.thu, ca, id)} invalid={!r.nhanSuId} placeholder="⚠ chưa gán"
                              options={optsFor(r).map((n) => ({ id: n.id, label: n.ho_ten }))} />
                            {saving === key && <span className="text-[11px] text-slate-400">đang lưu…</span>}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1 border-t border-slate-100 pt-1.5">
                            {r.lops.map((l, i) => (
                              <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600" title={`${hhmm(l.gioBatDau)}–${hhmm(l.gioKetThuc)}${l.phong ? ` · ${l.phong}` : ''}`}>
                                {l.lopTen} · {hhmm(l.gioBatDau)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
