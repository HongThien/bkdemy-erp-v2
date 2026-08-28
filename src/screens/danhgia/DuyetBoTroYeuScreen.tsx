// Tab "Duyệt bổ trợ" (PLAN-botro-yeu.md giai đoạn 2) — Thùy 08-18: tách khỏi Dashboard học tập,
// quét CROSS-LỚP theo môn (không bắt chọn 1 lớp trước — duyệt là hàng đợi xuyên lớp). Chỉ hiện
// candidate có TÍN HIỆU KIẾN THỨC (dạng/so-lớp/chuông đỏ/lỗ nền) — thái độ KHÔNG mở case bổ trợ
// (PLAN §0 mục 10) nên không thuộc hàng đợi này (vẫn duyệt được ở Dashboard học tập như cũ).
// Tái dùng NGUYÊN `DuyetKhoi` (DashboardHocTapScreen.tsx) — cùng 1 đường ghi log + mở case, tránh
// lệch hành vi giữa 2 nơi gọi duyệt.
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { listCandidatesLop, type Candidate } from '../../lib/danhgia'
import { DuyetKhoi, CandidateDetailBody, CandidateHeader } from './DashboardHocTapScreen'

type CandLop = Candidate & { ten_lop: string }

export default function DuyetBoTroYeuScreen() {
  const [mons, setMons] = useState<string[]>([])
  const [khois, setKhois] = useState<string[]>([])
  const [mon, setMon] = useState<string>('')
  const [khoi, setKhoi] = useState<string>('')
  const [cands, setCands] = useState<CandLop[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('lop').select('mon, khoi').eq('trang_thai', 'dang_hoc').limit(2000).then(({ data }) => {
      const rows = (data ?? []) as any[]
      const ms = [...new Set(rows.map((r) => r.mon).filter(Boolean))].sort()
      const ks = [...new Set(rows.map((r) => r.khoi).filter(Boolean))].sort()
      setMons(ms)
      setKhois(ks)
      if (!mon) setMon(ms.includes('Toán') ? 'Toán' : (ms[0] ?? ''))
    })
  }, []) // eslint-disable-line

  const reload = async () => {
    if (!mon) return
    setLoading(true); setCands([])
    try {
      let q = supabase.from('lop').select('id, ten_lop').eq('trang_thai', 'dang_hoc').eq('mon', mon).limit(500)
      if (khoi) q = q.eq('khoi', khoi)
      const { data: lops } = await q
      const ls = (lops ?? []) as any[]
      const per = await Promise.all(ls.map(async (l) => {
        const cs = await listCandidatesLop(l.id).catch(() => [])
        return cs.map((c): CandLop => ({ ...c, ten_lop: l.ten_lop }))
      }))
      // Chỉ giữ candidate có TÍN HIỆU KIẾN THỨC đủ mạnh (Thùy 08-23: ≥2/4 kênh dữ liệu HOẶC báo
      // động HOẶC case đang mở cần xử — xem `duTinHieuKienThuc` ở listCandidatesLop). KHÔNG suy
      // luận lại từ `kenh` (bug đã bắt: 1 kênh riêng lẻ vẫn push vào `kenh` để hiện lý do dù chưa
      // đủ ≥2/4, nên `kenh.some(k => k !== 'thai_do')` từng lọt sai candidate chỉ có 1 kênh yếu).
      const flat = per.flat().filter((c) => c.duTinHieuKienThuc)
      flat.sort((a, b) => b.uuTien - a.uuTien)
      setCands(flat)
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [mon, khoi]) // eslint-disable-line

  const monOpts = useMemo(() => mons, [mons])
  const khoiOpts = useMemo(() => khois, [khois])

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-slate-800">Duyệt bổ trợ</h1>
              {!loading && (
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                  {cands.length} ca
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[12px] text-slate-500">Hàng đợi xuyên lớp — chỉ candidate có tín hiệu kiến thức (dạng/so-lớp/báo động).</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={khoi} onChange={(e) => setKhoi(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400">
              <option value="">Tất cả khối</option>
              {khoiOpts.map((k) => <option key={k} value={k}>Khối {k}</option>)}
            </select>
            <select value={mon} onChange={(e) => setMon(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400">
              {monOpts.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang quét toàn bộ lớp {mon}…</div>
        ) : cands.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            Môn {mon}{khoi ? ` · Khối ${khoi}` : ''} chưa có candidate nào cần duyệt bổ trợ.
          </div>
        ) : (
          <div className="space-y-4">
            {cands.map((c) => (
              <div key={c.hoc_sinh_id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <CandidateHeader c={c} phu={c.ten_lop} uuTien={c.uuTien} />
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
