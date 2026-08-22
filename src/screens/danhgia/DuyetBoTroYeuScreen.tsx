// Tab "Duyệt bổ trợ" (PLAN-botro-yeu.md giai đoạn 2) — Thùy 08-18: tách khỏi Dashboard học tập,
// quét CROSS-LỚP theo môn (không bắt chọn 1 lớp trước — duyệt là hàng đợi xuyên lớp). Chỉ hiện
// candidate có TÍN HIỆU KIẾN THỨC (dạng/so-lớp/chuông đỏ/lỗ nền) — thái độ KHÔNG mở case bổ trợ
// (PLAN §0 mục 10) nên không thuộc hàng đợi này (vẫn duyệt được ở Dashboard học tập như cũ).
// Tái dùng NGUYÊN `DuyetKhoi` (DashboardHocTapScreen.tsx) — cùng 1 đường ghi log + mở case, tránh
// lệch hành vi giữa 2 nơi gọi duyệt.
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { listCandidatesLop, type Candidate } from '../../lib/danhgia'
import { DuyetKhoi, CandidateDetailBody } from './DashboardHocTapScreen'

type CandLop = Candidate & { ten_lop: string }

export default function DuyetBoTroYeuScreen() {
  const [mons, setMons] = useState<string[]>([])
  const [mon, setMon] = useState<string>('')
  const [cands, setCands] = useState<CandLop[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('lop').select('mon').eq('trang_thai', 'dang_hoc').limit(2000).then(({ data }) => {
      const ms = [...new Set(((data ?? []) as any[]).map((r) => r.mon).filter(Boolean))].sort()
      setMons(ms)
      if (!mon && ms.length) setMon(ms[0])
    })
  }, []) // eslint-disable-line

  const reload = async () => {
    if (!mon) return
    setLoading(true); setCands([])
    try {
      const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('trang_thai', 'dang_hoc').eq('mon', mon).limit(500)
      const ls = (lops ?? []) as any[]
      const per = await Promise.all(ls.map(async (l) => {
        const cs = await listCandidatesLop(l.id).catch(() => [])
        return cs.map((c): CandLop => ({ ...c, ten_lop: l.ten_lop }))
      }))
      // Chỉ giữ candidate có TÍN HIỆU KIẾN THỨC — loại candidate CHỈ có kênh thái độ (không mở case ở đây).
      const flat = per.flat().filter((c) =>
        c.deXuatKienThuc.deXuat >= 1 || c.sheet.levelKienThuc >= 1 || c.kenh.some((k) => k !== 'thai_do'))
      flat.sort((a, b) => b.uuTien - a.uuTien)
      setCands(flat)
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [mon]) // eslint-disable-line

  const monOpts = useMemo(() => mons, [mons])

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-slate-800">Duyệt bổ trợ</h1>
            <p className="mt-1 text-[13px] text-slate-500">Hàng đợi xuyên lớp — chỉ candidate có tín hiệu kiến thức (dạng/so-lớp/báo động).</p>
          </div>
          <select value={mon} onChange={(e) => setMon(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400">
            {monOpts.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang quét toàn bộ lớp {mon}…</div>
        ) : cands.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            Môn {mon} chưa có candidate nào cần duyệt bổ trợ.
          </div>
        ) : (
          <div className="space-y-6">
            {cands.map((c) => (
              <div key={c.hoc_sinh_id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[16px] font-semibold text-slate-800">
                    {c.ho_ten} <span className="font-normal text-slate-400">· {c.ten_lop}</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">ưu tiên {c.uuTien}</span>
                </div>
                <CandidateDetailBody c={c}>
                  <DuyetKhoi c={c} loai="kien_thuc" ten="Level kiến thức" hienTai={c.sheet.levelKienThuc} deXuat={c.deXuatKienThuc} onXong={reload} />
                </CandidateDetailBody>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
