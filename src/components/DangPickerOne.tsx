// Popup TO chọn 1 DẠNG (browse chủ đề → chuyên đề → dạng, click 1 phát chọn + đóng). Dùng chung mọi nơi chọn dạng.
// `chonNhanh` = cho đổi BẢN ĐỒ (nhánh kho) ngay trong popup — toggle theo registry `nhanhCuaMon` (Toán: Đại số /
// Hình giải tích). Dùng cho tài liệu TRỘN nhánh (MT — Thùy 21/08: "toggle chọn bản đồ lúc chọn câu"). Không
// bật → hành vi cũ (1 nhánh cố định theo prop `nhanh`). onPick trả kèm nhánh đã chọn để caller lưu theo câu.
import { useEffect, useState } from 'react'
import { groupMap, khoiChayBanDoMoi, type Tier1Node } from '../lib/kho/api'
import { khoCuaMon, nhanhCuaMon } from '../lib/tailieu'

// `pillsThem` = pill NGOÀI hệ dạng (vd "Hình" mô hình của MT — kho bài/lưới, không có dạng để liệt kê ở đây):
// bấm → caller tự xử lý (đóng popup, cuộn tới khối Hình). Giữ đủ "3 tab Đại / Hình giải tích / Hình" Thùy chốt 21/08.
// `banDoMoi` (Thùy 26/10 — chuyển công tắc vận hành sang bản đồ mới): khối đã chạy bản đồ mới (DB quyết, fn_bdm_dang_chon) ⇒
// chọn DẠNG BÀI NDB (onPick nhánh 'bdm'; toggle còn "Bản đồ mới" + nhánh không thuộc bản đồ mới như Hình · Học). Caller nào
// GHI mã dạng vào CÂU kho (duyệt câu, kho đề thi…) chưa bật — câu nhận dạng bài qua gán, không qua dang_chinh.
export default function DangPickerOne({ khoi, mon, nhanh, chonNhanh, pillsThem, banDoMoi, onClose, onPick }: { khoi: string; mon?: string; nhanh?: string | null; chonNhanh?: boolean; pillsThem?: { ten: string; onClick: () => void }[]; banDoMoi?: boolean; onClose: () => void; onPick: (maDang: string, nhanh: string | null) => void }) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [nh, setNh] = useState<string | null>(nhanh ?? null)
  const [moi, setMoi] = useState<boolean | null>(banDoMoi ? null : false)   // null = đang hỏi DB
  useEffect(() => {
    if (!banDoMoi) return
    let alive = true
    void khoiChayBanDoMoi(khoi, mon ?? 'Toán').then((m) => { if (!alive) return; setMoi(m); if (m) setNh('bdm') })
    return () => { alive = false }
  }, [banDoMoi, khoi, mon])
  const nhanhOpts = !chonNhanh ? [] : moi
    ? [{ ma: 'bdm', ten: 'Bản đồ mới' }, ...nhanhCuaMon(mon).filter((o) => o.ma === 'hinh_hoc')]
    : nhanhCuaMon(mon)
  const themOpts = chonNhanh ? (pillsThem ?? []) : []
  const listMap = khoCuaMon(mon, nh).listMap
  useEffect(() => {
    if (moi === null) return
    let alive = true
    setLoading(true)
    listMap(khoi).then((r) => { if (alive) { setTree(groupMap(r)); setLoading(false) } }).catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [khoi, mon, nh, moi]) // eslint-disable-line
  const kw = q.trim().toLowerCase()
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-md:inset-0 max-md:rounded-none max-md:border-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3 max-md:flex-wrap max-md:gap-2 max-md:px-3 max-md:py-2">
          <h3 className="text-base font-semibold text-slate-900">Chọn dạng · Khối {khoi}</h3>
          {nhanhOpts.length + themOpts.length > 1 && (
            <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5" title="Chọn bản đồ kiến thức (nhánh kho) để lấy dạng">
              {nhanhOpts.map((o) => (
                <button key={o.ma ?? '_'} onClick={() => setNh(o.ma)}
                  className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${nh === o.ma ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{o.ten}</button>
              ))}
              {themOpts.map((o) => (
                <button key={'them:' + o.ten} onClick={o.onClick}
                  className="rounded-md px-3 py-1 text-[13px] font-medium text-slate-500 transition hover:text-slate-700">{o.ten}</button>
              ))}
            </div>
          )}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng / chuyên đề…" className="ml-2 h-8 w-64 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400 max-md:order-last max-md:ml-0 max-md:h-9 max-md:w-full" autoFocus />
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5 max-md:p-3">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : tree.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có dạng{nhanhOpts.length > 1 ? ` ở bản đồ ${nhanhOpts.find((o) => o.ma === nh)?.ten ?? ''}` : ''}.</p>
            : tree.map((t1) => (
              <div key={t1.t1Ma} className="mb-4">
                <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t1.t1Ten}</div>
                {t1.tier2s.map((t2) => {
                  const leaves = t2.leaves.filter((l) => !kw || l.leafTen.toLowerCase().includes(kw) || t2.t2Ten.toLowerCase().includes(kw))
                  if (!leaves.length) return null
                  return (
                    <div key={t2.t2Ma} className="mb-3 rounded-lg border border-slate-100 p-2.5">
                      <div className="mb-1.5 text-[13px] font-semibold text-sky-700">{t2.t2Ten}</div>
                      <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3 max-md:grid-cols-1">
                        {leaves.map((l) => (
                          <button key={l.leafMa} onClick={() => onPick(l.leafMa, nh)}
                            className="rounded-md border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-700 transition hover:border-violet-400 hover:bg-violet-50">{l.leafTen}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
