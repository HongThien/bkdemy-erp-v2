// Ô HỎI — Phòng Trưởng bộ môn: hỏi dữ liệu VẬN HÀNH TRỢ GIẢNG để ra quyết định (Thùy 05/11:
// "lương, dữ liệu đã điền, duyệt công các thứ… trưởng bộ môn có thể hỏi các dữ liệu từ DB") + BỔ TRỢ của môn (mig 202611051749).
// Bảng đã có ở ERP (Lương TA, Duyệt công, Quản trị) ⇒ ở đây CHỈ là chỗ hỏi bằng lời.
// Màn này không tính gì: gửi câu hỏi tới api/phong-hoi.mjs; model chọn công cụ trong danh mục DB
// (fn_phong_hoi_danh_muc), DB tự khoá phạm vi môn của người hỏi (fn_phong_hoi_goi, mig 202611051536).
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ChuPhien from './ChuPhien'

type Buoc = { cong_cu: string; tham_so: Record<string, unknown>; loi: string | null }
type Luot = { hoi: string; dap: string | null; buoc: Buoc[]; loi: string | null }

const TEN_CC: Record<string, string> = {
  tro_giang: 'Danh sách TA', luong_tro_giang: 'Lương TA', cong_tro_giang: 'Công & duyệt công',
  viec_van_hanh: 'Việc sau buổi', tinh_trang_buoi: 'Dữ liệu buổi đã điền',
  bo_tro_tuan: 'Bổ trợ theo tuần', bo_tro_case: 'Case bổ trợ', bo_tro_retest: 'Retest',
}
const GOI_Y = [
  'Tháng này lương tạm tính của các TA bao nhiêu?',
  'Còn công nào chờ duyệt hoặc có cờ mâu thuẫn không?',
  'TA nào đang nợ việc quá hạn nhiều nhất?',
  'Tuần này buổi nào chưa điền nhận xét hoặc chưa nhập ET?',
  'Hiệu suất tháng của từng TA thế nào?',
  'Buổi nào đã diễn ra mà chưa ai ghi công?',
  'Bổ trợ tuần này chạy thế nào, em yếu nào chưa được xếp ca?',
  'Retest nào đang tồn lâu nhất?',
]

// Sống tới F5: rời ô hỏi quay lại vẫn còn cuộc trò chuyện (CLAUDE.md §2 React).
const NHO: { phien: string; luot: Luot[] } = { phien: crypto.randomUUID(), luot: [] }

export default function HoiVanHanhTa({ mon }: { mon: string[] | null }) {
  const [luot, setLuotS] = useState<Luot[]>(NHO.luot)
  const setLuot = (f: (p: Luot[]) => Luot[]) => setLuotS((p) => { const n = f(p); NHO.luot = n; return n })
  const [cau, setCau] = useState('')
  const [dang, setDang] = useState(false)
  const cuoi = useRef<HTMLDivElement>(null)
  useEffect(() => { cuoi.current?.scrollIntoView({ block: 'end' }) }, [luot.length, dang])

  async function hoi(q0?: string) {
    const q = (q0 ?? cau).trim()
    if (!q || dang) return
    setCau(''); setDang(true)
    const lichSu = NHO.luot.filter((l) => l.dap).slice(-6).map((l) => ({ hoi: l.hoi, dap: l.dap as string }))
    setLuot((p) => [...p, { hoi: q, dap: null, buoc: [], loi: null }])
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/phong-hoi', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ phien: NHO.phien, cauHoi: q, lichSu }),
      })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error ?? `Lỗi máy chủ (HTTP ${res.status}).`)
      setLuot((p) => p.map((l, i) => (i === p.length - 1 ? { ...l, dap: j.traLoi, buoc: j.buoc ?? [] } : l)))
    } catch (e: any) {
      setLuot((p) => p.map((l, i) => (i === p.length - 1 ? { ...l, loi: e?.message ?? String(e) } : l)))
    } finally { setDang(false) }
  }
  const moi = () => { NHO.phien = crypto.randomUUID(); NHO.luot = []; setLuotS([]) }

  return (
    <div className="flex min-h-[calc(100vh-190px)] flex-col">
      <div className="mb-3 flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold text-slate-800">💬 Hỏi vận hành trợ giảng</h2>
          <p className="text-[12.5px] text-slate-500">
            Lương · công & duyệt công · việc sau buổi · dữ liệu đã điền (điểm danh, ET, BTVN, nhận xét) · hiệu suất, gậy · bổ trợ (yếu, bù, đuổi, nhẹ, Hình, retest) — chỉ trong bộ môn
            {mon?.length ? ` ${mon.join(' · ')}` : ' (mọi môn)'}. Số lấy thẳng từ hệ thống, không sửa được gì ở đây; duyệt công vẫn ở màn Duyệt công.
          </p>
        </div>
        {luot.length > 0 && <button onClick={moi} disabled={dang} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50">＋ Cuộc hỏi mới</button>}
      </div>

      <div className="min-h-0 flex-1 space-y-4">
        {luot.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 p-4">
            <div className="mb-2 text-[12.5px] font-semibold text-slate-500">Hỏi thử:</div>
            <div className="flex flex-wrap gap-2">
              {GOI_Y.map((g) => (
                <button key={g} onClick={() => hoi(g)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-[13px] text-slate-700 hover:border-slate-300 hover:bg-white">{g}</button>
              ))}
            </div>
          </div>
        )}
        {luot.map((l, i) => (
          <div key={i} className="space-y-2">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[var(--sk-acc,#6366f1)] px-3.5 py-2 text-[14px] text-white">{l.hoi}</div>
            <div className="max-w-[95%] rounded-2xl rounded-bl-md bg-slate-50 px-3.5 py-2.5">
              {l.loi ? <p className="text-[13.5px] text-rose-600">Không trả lời được: {l.loi}</p>
                : l.dap ? <ChuPhien text={l.dap} />
                : <p className="animate-pulse text-[13px] text-slate-400">Đang tra dữ liệu…</p>}
              {l.buoc.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-slate-200 pt-1.5">
                  <span className="text-[11px] text-slate-400">Đã tra:</span>
                  {l.buoc.map((b, k) => (
                    <span key={k} title={JSON.stringify(b.tham_so)} className={`rounded px-1.5 text-[11px] ${b.loi ? 'bg-rose-50 text-rose-500' : 'bg-white text-slate-500'}`}>
                      {TEN_CC[b.cong_cu] ?? b.cong_cu}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={cuoi} />
      </div>

      <div className="sticky bottom-0 mt-3 flex gap-2 bg-white pt-2">
        <textarea value={cau} onChange={(e) => setCau(e.target.value)} rows={2} disabled={dang}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); hoi() } }}
          placeholder="Hỏi về trợ giảng trong bộ môn… (Enter để gửi, Shift+Enter xuống dòng)"
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-500" />
        <button onClick={() => hoi()} disabled={dang || !cau.trim()}
          className="rounded-xl px-5 text-[14px] font-bold text-white shadow-sm disabled:opacity-40" style={{ background: 'var(--sk-acc,#6366f1)' }}>
          {dang ? '…' : 'Hỏi'}
        </button>
      </div>
    </div>
  )
}
