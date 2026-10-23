// Công tắc MASTERY BẢN ĐỒ MỚI (admin — PLAN-mastery-ban-do-moi.md, Thùy 23/10: "khi nào bấm nút là chuyển", bấm thứ Hai 27/10).
// Trạng thái + bật/tắt (fn_he_thong_cong_tac_dat, có lịch sử) + so sánh từng lớp mastery CŨ vs MỚI (đếm ở DB: fn_mastery_bdm_so_sanh).
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { listLop } from '../../lib/nhansu'

type Dem = { o: number; dat: number; can_luyen: number; yeu: number; tin_thap: number; o_ndb: number } | null
type SoSanh = { bat: boolean; log: { at: string; moi: boolean; ai: string }[]; hs: { hoc_sinh_id: string; ho_ten: string; cu: Dem; moi: Dem }[] }
const KHOI_MOI = ['6', '7', '8', '9', '10', '11', '12']

export default function MasteryBdmCongTac({ onDong }: { onDong: () => void }) {
  const [lops, setLops] = useState<{ id: string; ten_lop: string; khoi: string }[]>([])
  const [lop, setLop] = useState<string>('')
  const [ss, setSs] = useState<SoSanh | null>(null)
  const [bat, setBat] = useState<boolean | null>(null)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    listLop().then((ls) => setLops((ls as { id: string; ten_lop: string; khoi: string; mon: string }[]).filter((l) => l.mon === 'Toán' && KHOI_MOI.includes(l.khoi))))
      .catch((e) => setLoi(e.message ?? String(e)))
    supabase.from('he_thong_cong_tac').select('bat').eq('ma', 'mastery_ban_do_moi').single().then(({ data }) => setBat(!!data?.bat))
  }, [])
  useEffect(() => {
    if (!lop) return
    setSs(null); setDang(true); setLoi(null)
    supabase.rpc('fn_mastery_bdm_so_sanh', { p_lop: lop }).then(({ data, error }) => {
      setDang(false)
      if (error) setLoi(error.message); else { setSs(data as SoSanh); setBat((data as SoSanh).bat) }
    })
  }, [lop])
  const doi = async () => {
    const moi = !bat
    if (!window.confirm(moi
      ? 'BẬT mastery theo BẢN ĐỒ MỚI cho K6–12?\n\nMọi màn (dashboard, report PH, bổ trợ yếu, tự luyện, bản đồ phiêu lưu) chuyển sang dạng bài mới ngay. Cấp 1 giữ bản đồ cũ. Tắt lại được bất cứ lúc nào.'
      : 'TẮT — quay về mastery theo BẢN ĐỒ CŨ cho mọi khối?')) return
    setDang(true); setLoi(null)
    const { error } = await supabase.rpc('fn_he_thong_cong_tac_dat', { p_ma: 'mastery_ban_do_moi', p_bat: moi })
    setDang(false)
    if (error) { setLoi(error.message); return }
    setBat(moi)
    setSs((s) => (s ? { ...s, bat: moi, log: [{ at: new Date().toISOString(), moi, ai: 'bạn' }, ...s.log] } : s))
  }
  const o = (d: Dem) => (d ? <><b className="text-emerald-700">{d.dat}</b> · <span className="text-amber-600">{d.can_luyen}</span> · <b className="text-rose-600">{d.yeu}</b> <span className="text-slate-400">/ {d.o} ô · tin thấp {d.tin_thap}</span></> : <span className="text-slate-300">—</span>)
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-6" onClick={onDong}>
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <span className="text-[14px] font-semibold text-slate-900">🔀 Mastery theo bản đồ mới</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${bat ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {bat === null ? '…' : bat ? 'ĐANG BẬT — K6–12 đo theo bản đồ mới' : 'ĐANG TẮT — đo theo bản đồ cũ'}
          </span>
          <button onClick={doi} disabled={dang || bat === null}
            className={`ml-auto rounded-md px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40 ${bat ? 'bg-slate-600 hover:bg-slate-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>{bat ? 'Tắt (về bản đồ cũ)' : 'Bật bản đồ mới'}</button>
          <button onClick={onDong} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-[12.5px] text-slate-600">
          So sánh lớp
          <select value={lop} onChange={(e) => setLop(e.target.value)} className="h-8 rounded-md border border-slate-300 px-2 text-[13px]">
            <option value="">— chọn lớp Toán K6–12 —</option>
            {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop} (K{l.khoi})</option>)}
          </select>
          <span className="text-slate-400">đạt · cần luyện · yếu / số ô (cấp 1 luôn bản đồ cũ)</span>
          {dang && <span className="text-slate-400">đang tính…</span>}
        </div>
        {loi && <div className="bg-rose-50 px-4 py-2 text-[12.5px] text-rose-700">⚠ {loi}</div>}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {ss && (
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-slate-200 text-left text-[11.5px] uppercase tracking-wide text-slate-500"><th className="py-1.5">Học sinh</th><th>Bản đồ cũ</th><th>Bản đồ mới</th></tr></thead>
              <tbody>{ss.hs.map((h) => (
                <tr key={h.hoc_sinh_id} className="border-b border-slate-50"><td className="py-1.5 pr-3">{h.ho_ten}</td><td>{o(h.cu)}</td><td>{o(h.moi)}</td></tr>
              ))}</tbody>
            </table>
          )}
          {ss && ss.log.length > 0 && (
            <div className="mt-4 text-[12px] text-slate-500">
              <div className="mb-1 font-semibold text-slate-600">Lịch sử bật / tắt</div>
              {ss.log.map((l, i) => <div key={i}>{new Date(l.at).toLocaleString('vi-VN')} — {l.moi ? 'BẬT' : 'TẮT'} ({l.ai})</div>)}
            </div>
          )}
          {!lop && <div className="py-8 text-center text-[13px] text-slate-400">Chọn 1 lớp để xem mastery từng em ở bản đồ cũ và bản đồ mới trước khi bật.</div>}
        </div>
      </div>
    </div>
  )
}
