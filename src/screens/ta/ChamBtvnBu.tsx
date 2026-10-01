// Chấm BTVN BÙ (Thùy 29/09) — em học bù xong làm BTVN của buổi đã nghỉ; TA LỚP (người thu vở buổi thường sau) chấm ở đây.
// Dữ liệu nằm ở CA BÙ: lưới câu = BTVN buổi mẹ chép riêng cho em (fn_bu_btvn_seed), Đ/C/S → gami_grades, trạng thái nộp + thái độ →
// btvn_ket_qua (em × ca bù) — đúng bảng BTVN thường ⇒ số liệu theo em × dạng tính chung được. XONG = đã chọn trạng thái nộp.
import { useEffect, useState } from 'react'
import { listProblems, listGrades, gradeET, deleteGrade, getBtvnKetQua, setBtvnKetQua, type Problem, type Grade, type ETResult, type BtvnKQ } from '../../lib/gami'
import { seedBtvnBu, type BtvnBu } from '../../lib/botro_yeu_ca'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { ET_KQ } from './ChamBuoi'

const NOP: { v: string; l: string }[] = [
  { v: 'nop_dung_han', l: 'Nộp đúng hạn' }, { v: 'nop_muon', l: 'Nộp muộn' }, { v: 'xin_phep', l: 'Đã xin phép' }, { v: 'khong_lam', l: 'Không làm bài' },
]
const THAI_DO: { v: string; l: string }[] = [
  { v: 'nghiem_tuc', l: 'Nghiêm túc' }, { v: 'chua_het_suc', l: 'Chưa hết sức' }, { v: 'chua_nghiem_tuc', l: 'Chưa nghiêm túc' }, { v: 'chong_doi', l: 'Chống đối' },
]

export default function ChamBtvnBu({ v, onBack }: { v: BtvnBu; onBack: () => void }) {
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [kq, setKq] = useState<BtvnKQ>({ trang_thai_nop: v.trang_thai_nop, thai_do: v.thai_do })
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)

  async function napLuoi() {
    const [p, g] = await Promise.all([listProblems(v.buoi_bu_id, 'btvn'), listGrades(v.buoi_bu_id)])
    setProbs(p.filter((x) => x.hoc_sinh_id === v.hoc_sinh_id))
    setGrades(g.filter((x) => x.hoc_sinh_id === v.hoc_sinh_id))
  }
  useEffect(() => { (async () => {
    try {
      await seedBtvnBu(v.bhh_id)
      await napLuoi()
      const k = await getBtvnKetQua(v.buoi_bu_id)
      if (k[v.hoc_sinh_id]) setKq(k[v.hoc_sinh_id])
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setLoading(false) }
  })() }, [v.bhh_id]) // eslint-disable-line

  const gradeOf = (pid: string) => grades.find((g) => g.problem_id === pid)
  async function chon(p: Problem, r: ETResult) {
    setLoi(null)
    try {
      if (gradeOf(p.id)?.result === r) await deleteGrade(p.id, v.hoc_sinh_id) // chạm lại = bỏ
      else await gradeET({ buoiId: v.buoi_bu_id, problemId: p.id, hocSinhId: v.hoc_sinh_id, result: r, loi: [] })
      await napLuoi()
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function tatCa(r: ETResult) {
    const daCham = probs.filter((p) => gradeOf(p.id)).length
    if (daCham > 0 && !confirm(`Đã chấm ${daCham}/${probs.length} câu — ghi đè tất cả?`)) return
    setLoi(null)
    try { for (const p of probs) await gradeET({ buoiId: v.buoi_bu_id, problemId: p.id, hocSinhId: v.hoc_sinh_id, result: r, loi: [] }); await napLuoi() }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function datKQ(patch: Partial<BtvnKQ>) {
    setKq((cu) => ({ ...cu, ...patch })); setLoi(null)
    try { await setBtvnKetQua(v.buoi_bu_id, v.hoc_sinh_id, patch) } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  const daCham = probs.filter((p) => gradeOf(p.id)).length
  const chip = (on: boolean) => `rounded-full px-3 py-1.5 text-[12.5px] font-bold ${on ? 'bg-[#2F73F6] text-white' : 'border border-slate-200 bg-white text-slate-600'}`
  return (
    <div className="min-h-[100dvh] bg-[#F3F6FC] pb-8" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
        <button onClick={onBack} className="h-9 w-9 rounded-full text-[20px] text-slate-500 active:bg-slate-100">‹</button>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[15px] font-extrabold text-[#16224D]">BTVN bù · {v.ho_ten}</p>
          <p className="truncate text-[11.5px] text-[#63709A]">{v.ten_lop} · bài buổi {ddmmVN(v.ngay_me)} · học bù {thuCuaNgay(v.ngay_bu)} {ddmmVN(v.ngay_bu)}{v.nguoi_day_bu ? ` (${v.nguoi_day_bu})` : ''} · hạn {ddmmVN(v.han)}</p>
        </div>
        {kq.trang_thai_nop && <span className="rounded-full bg-[#E4F8EC] px-2 py-0.5 text-[11px] font-bold text-[#1E8A52]">✓ đã ghi</span>}
      </div>
      <div className="mx-auto flex max-w-[720px] flex-col gap-3 px-3 pt-3">
        {loi && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">⛔ {loi}</p>}
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#63709A]">Trạng thái nộp</p>
          <div className="flex flex-wrap gap-1.5">{NOP.map((o) => <button key={o.v} onClick={() => datKQ({ trang_thai_nop: o.v })} className={chip(kq.trang_thai_nop === o.v)}>{o.l}</button>)}</div>
          <p className="mb-2 mt-3 text-[12px] font-bold uppercase tracking-wide text-[#63709A]">Thái độ làm bài</p>
          <div className="flex flex-wrap gap-1.5">{THAI_DO.map((o) => <button key={o.v} onClick={() => datKQ({ thai_do: kq.thai_do === o.v ? null : o.v })} className={chip(kq.thai_do === o.v)}>{o.l}</button>)}</div>
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-[12px] font-bold uppercase tracking-wide text-[#63709A]">Chấm từng câu · {daCham}/{probs.length}</p>
            {probs.length > 0 && <div className="ml-auto flex gap-1">{ET_KQ.map((k) => <button key={k.v} onClick={() => tatCa(k.v)} className={`h-7 rounded-lg border px-2 text-[11.5px] font-bold ${k.idle}`}>Tất cả {k.lbl}</button>)}</div>}
          </div>
          {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p>
            : probs.length === 0 ? <p className="text-[13px] text-slate-400">Buổi {ddmmVN(v.ngay_me)} không có câu BTVN trong lưới — chỉ cần ghi trạng thái nộp.</p>
            : (
              <div className="flex flex-col gap-1">
                {probs.map((p, i) => {
                  const g = gradeOf(p.id)
                  return (
                    <div key={p.id} className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-1.5">
                      <span className="w-12 shrink-0 text-[13px] font-bold text-[#16224D]">Câu {i + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-[11px] text-slate-400">{p.ma_dang ?? ''}</span>
                      {ET_KQ.map((k) => <button key={k.v} onClick={() => chon(p, k.v)} className={`h-8 w-9 rounded-lg border text-[13px] font-extrabold ${g?.result === k.v ? k.sel : k.idle}`}>{k.lbl}</button>)}
                    </div>
                  )
                })}
              </div>
            )}
        </div>
        <button onClick={onBack} disabled={!kq.trang_thai_nop}
          className="h-11 rounded-2xl bg-[#2F73F6] text-[14px] font-extrabold text-white shadow-md disabled:opacity-40">{kq.trang_thai_nop ? 'Xong' : 'Chọn trạng thái nộp để hoàn tất'}</button>
      </div>
    </div>
  )
}
