// TEAM QUẢN LÝ CHẤT LƯỢNG — Thùy 29/10, spec-truong-khoi.md §2. 1 màn gom 3 lớp (bản chất vẫn riêng):
//   phạm vi  = ô (môn × khối) → Trưởng / Phó   — NGUỒN DUY NHẤT, sửa ở đây (hoặc màn Phân công, cùng hàm)
//   chức vụ  = ghế "Trưởng khối …" ở team Trợ giảng · Học thuật · QLCL — DB TỰ SINH theo ô Trưởng (⚙), không sửa tay
//   team     = tự theo ghế (có ghế ở team nào là thuộc team đó)
// Chỉ Lead / Quản lý chất lượng sửa được (DB chặn); người khác xem. Sau khi đổi ô: vá ô tại chỗ + đọc lại nền (ghế đổi ở DB).
import { useEffect, useState } from 'react'
import { teamQlcl, type TeamQlcl, type OQlcl } from '../../lib/qlcl'
import { listNhanSu, setKhoiQuanLy, type NhanSu } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

const TEAM_MAU: Record<string, string> = {
  qlcl: 'bg-rose-50 text-rose-700', ta: 'bg-sky-50 text-sky-700', hoc_thuat: 'bg-violet-50 text-violet-700',
  gv: 'bg-emerald-50 text-emerald-700', core: 'bg-slate-100 text-slate-700', ops: 'bg-amber-50 text-amber-800',
}
const NHO: { d: TeamQlcl | null } = { d: null }

export default function QlclTeamScreen() {
  const [d, setD] = useState<TeamQlcl | null>(NHO.d)
  const [ds, setDs] = useState<NhanSu[]>([])
  const [loi, setLoi] = useState<string | null>(null)
  const tai = () => teamQlcl().then((x) => { NHO.d = x; setD(x) }).catch((e) => setLoi(e?.message ?? String(e)))
  useEffect(() => { tai(); listNhanSu().then((n) => setDs(n.filter((x) => x.trang_thai === 'dang_lam'))).catch(() => {}) }, [])

  async function doi(o: OQlcl, vai: 'truong' | 'pho', id: string | null) {
    setLoi(null)
    try {
      await setKhoiQuanLy(o.mon, o.khoi, vai, id)
      const ten = id ? ds.find((n) => n.id === id)?.ho_ten ?? '?' : null
      setD((p) => p && { ...p, o: p.o.map((x) => x.mon === o.mon && x.khoi === o.khoi ? { ...x, [`${vai}_id`]: id, [`${vai}_ten`]: ten } : x) })
      tai() // ghế + thành viên đổi ở DB ⇒ đọc lại nền, không xoá màn
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  if (!d) return <div className="p-8 text-[13px] text-slate-400">{loi ?? 'Đang tải…'}</div>
  const opts = ds.map((n) => ({ id: n.id, label: n.ho_ten }))
  const thieu = d.o.filter((o) => !o.truong_id).length
  const sua = (o: OQlcl) => d.duoc_sua && (d.mon_sua == null || d.mon_sua.includes(o.mon)) // quản lý môn chỉ sửa môn mình (DB cũng chặn)

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#fafafb] px-8 py-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <h2 className="text-[17px] font-bold text-slate-800">Team Quản lý chất lượng</h2>
        <span className="text-[12.5px] text-slate-500">Chọn Trưởng cho ô môn × khối ⇒ người đó tự có ghế Trưởng khối ở team Trợ giảng · Học thuật · Quản lý chất lượng (⚙ = ghế tự sinh).{!d.duoc_sua && ' Bạn chỉ xem.'}</span>
      </div>
      {loi && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}

      <section className="mb-7">
        <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Phân công ô · {d.o.length} ô{thieu ? <span className="ml-1 text-rose-600">· {thieu} ô chưa có Trưởng</span> : null}</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-[13px]">
            <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-2">Môn · Khối</th><th className="px-2">Lớp · HS</th><th className="px-2">Trưởng khối</th><th className="px-2">Phó khối</th>
            </tr></thead>
            <tbody>
              {d.o.map((o) => (
                <tr key={o.mon + o.khoi} className={`border-t border-slate-100 ${o.truong_id ? '' : 'bg-rose-50/40'}`}>
                  <td className="px-4 py-1.5 font-semibold text-slate-800">{o.mon} · {o.khoi}</td>
                  <td className="px-2 text-slate-500">{o.so_lop} lớp · {o.so_hs} HS</td>
                  <td className="w-60 px-2 py-1">
                    {sua(o) ? <SearchSelect value={o.truong_id} onChange={(id) => doi(o, 'truong', id)} invalid placeholder="⚠ chưa có trưởng khối" options={opts} />
                      : <span className={o.truong_ten ? 'text-slate-800' : 'text-rose-600'}>{o.truong_ten ?? 'chưa có'}</span>}
                  </td>
                  <td className="w-60 px-2 py-1">
                    {sua(o) ? <SearchSelect value={o.pho_id} onChange={(id) => doi(o, 'pho', id)} placeholder="— (không) —" options={opts.filter((x) => x.id !== o.truong_id)} />
                      : <span className="text-slate-600">{o.pho_ten ?? '—'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Thành viên · {d.thanh_vien.length} người</p>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {d.thanh_vien.map((t) => (
            // Card kiểu 1: header màu + thân trắng
            <div key={t.nhan_su_id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-indigo-500 px-4 py-2 text-[14px] font-bold text-white">{t.ho_ten}</div>
              <div className="px-4 py-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phạm vi</p>
                <div className="mb-3 flex flex-wrap gap-1">
                  {t.o.length === 0 ? <span className="text-[12.5px] text-slate-400">{t.ghe.some((g) => g.team_ma === 'qlcl' && ['truong', 'pho'].includes(g.cap)) ? 'Toàn hệ' : '—'}</span>
                    : t.o.map((o) => <span key={o.mon + o.khoi + o.vai} className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${o.vai === 'truong' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'}`}>{o.vai === 'truong' ? 'Trưởng' : 'Phó'} {o.mon === 'Toán' ? '' : o.mon + ' '}{o.khoi}</span>)}
                </div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Chức vụ · team</p>
                <ul className="flex flex-col gap-1">
                  {t.ghe.map((g, i) => (
                    <li key={i} className="flex items-center gap-2 text-[12.5px]">
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${TEAM_MAU[g.team_ma] ?? 'bg-slate-100 text-slate-600'}`}>{g.team_ten}</span>
                      <span className="min-w-0 flex-1 truncate text-slate-700">{g.ten ?? '(ghế chưa tên)'}{g.tu_dong ? ' ⚙' : ''}</span>
                      {g.vai_tro && <span className="shrink-0 text-[11px] text-slate-400">{g.vai_tro}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
