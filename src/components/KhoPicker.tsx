// Popup multi-select câu từ kho (theo 1..N dạng), lọc loại câu + badge usage + khoá câu đã dùng cùng buổi.
// Tách riêng khỏi TaiLieuBuilder.tsx (nơi cũ) để dùng chung được ở nơi khác (vd OnTapEditor) mà không
// vòng import ngược screen↔component.
// ⭐ 11/09 (CEO) — group câu theo CỤM (dai_cum_bai / khtn_cum_bai): mỗi dạng, câu cùng cụm xếp liền
// nhau dưới header "🌿 Cụm N: <tên>", câu chưa phân cụm (ma_cum=null) gom cuối dưới header "— Chưa
// phân cụm —". Hình chưa có cột ma_cum (spec-cum-bai.md để sau) → coCumBai(cauTbl)=false, popup này
// fall-back về danh sách phẳng như cũ (không hiển thị header cụm nào cả).
import { useEffect, useState } from 'react'
import { listCauByDang, listCumBai, coCumBai, tenCum, LOAI_CAU, type CauHoi, type CumBai } from '../lib/kho/api'
import { cauUsage } from '../lib/tailieu'
import { MathText } from '../screens/kho/ui'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
function MaCau({ ma }: { ma: string }) {
  return <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500" title="Mã câu">{ma}</span>
}

// Sắp câu của 1 dạng theo cụm: từng cụm 1 nhóm (theo thu_tu của cụm), câu chưa phân cụm CUỐI.
// null-cụm nghĩa là "chưa phân cụm" (KHÔNG dùng cumKey/parent_ma_cau ở đây — Thùy chọn đúng ma_cum
// thật thôi, câu con của parent chưa được duyệt vào cụm thì vẫn là "chưa phân cụm" cho rõ).
type CumGroup = { cum: CumBai | null; caus: CauHoi[] }
function groupByCum(caus: CauHoi[], cums: CumBai[]): CumGroup[] {
  const byCum = new Map<string | null, CauHoi[]>()
  for (const c of caus) {
    const k = c.ma_cum ?? null
    const arr = byCum.get(k) ?? []
    arr.push(c); byCum.set(k, arr)
  }
  const out: CumGroup[] = []
  for (const cum of cums) { const cs = byCum.get(cum.ma_cum); if (cs?.length) out.push({ cum, caus: cs }) }
  const chua = byCum.get(null); if (chua?.length) out.push({ cum: null, caus: chua })
  return out
}

export function KhoPicker({ maDangs, selected, disabled = [], cauTbl = 'dai_cau_hoi', onClose, onConfirm }: { maDangs: string[]; selected: string[]; disabled?: string[]; cauTbl?: string; onClose: () => void; onConfirm: (m: string[]) => void }) {
  const [groups, setGroups] = useState<{ maDang: string; caus: CauHoi[]; cums: CumBai[] }[]>([])
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [fLoai, setFLoai] = useState<Set<string>>(new Set())
  const [usage, setUsage] = useState<Map<string, number>>(new Map()) // số lượt câu đã dùng trong MỌI tài liệu (chỉ báo)
  const [loading, setLoading] = useState(true)
  const hasCum = coCumBai(cauTbl)
  // Câu đã dùng ở buổi này/buổi trước (cùng giáo trình) → KHOÁ; trừ câu đang chọn ở chính phần này.
  const blocked = new Set(disabled.filter((m) => !selected.includes(m)))
  useEffect(() => {
    // Nạp SONG SONG câu + cụm cho từng dạng. Nhánh chưa có cụm (hgt/hình) → listCumBai trả []
    // (nó tự early-return theo CUM_TBL), khỏi cần if() ở đây.
    Promise.all(maDangs.map(async (md) => {
      const [caus, cums] = await Promise.all([listCauByDang(md, cauTbl), listCumBai(md, cauTbl)])
      return { maDang: md, caus, cums }
    })).then(async (g) => {
      setGroups(g); setLoading(false)
      setUsage(await cauUsage(g.flatMap((x) => x.caus.map((c) => c.ma_cau))))
    }).catch(() => setLoading(false))
  }, []) // eslint-disable-line
  const toggle = (ma: string) => { if (blocked.has(ma)) return; setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n }) }
  const toggleLoai = (v: string) => setFLoai((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n })
  function confirm() {
    // Thứ tự = THỨ TỰ CLICK (Set giữ thứ tự chèn): câu đã chọn từ trước giữ đúng vị trí cũ,
    // câu mới tick nối theo đúng thứ tự người bấm — "click trước hiện trước". KHÔNG sắp theo thứ tự kho.
    onConfirm([...sel])
  }
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[12%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn câu từ kho</h3>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 px-6 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Lọc loại:</span>
          {LOAI_CAU.map((l) => (
            <button key={l.value} onClick={() => toggleLoai(l.value)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition ${fLoai.has(l.value) ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700'}`}>{l.label}</button>
          ))}
          {fLoai.size > 0 && <button onClick={() => setFLoai(new Set())} className="ml-1 text-[12px] font-medium text-slate-400 hover:text-rose-600">Xoá lọc</button>}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : groups.every((g) => !g.caus.length) ? <p className="text-sm text-slate-400">Kho các dạng này chưa có câu nào.</p>
            : groups.map((g) => {
              // Lọc loại TRƯỚC khi group cụm — bảo tồn tương tác lọc cũ.
              const caus = fLoai.size ? g.caus.filter((c) => fLoai.has(c.loai_cau)) : g.caus
              // Nhánh chưa có cụm (Hình) → render phẳng như cũ để symmetry test kiểu "1 kho câu, N câu".
              const cumGroups = hasCum ? groupByCum(caus, g.cums) : [{ cum: null, caus } as CumGroup]
              const renderCauLabel = (c: CauHoi) => {
                const isBlocked = blocked.has(c.ma_cau)
                const n = usage.get(c.ma_cau) ?? 0
                return (
                  <label key={c.ma_cau} title={isBlocked ? 'Câu này đã dùng trong buổi này / buổi trước — không chọn lại' : undefined}
                    className={`flex items-start gap-2 rounded-md border px-2.5 py-1.5 ${isBlocked ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-55' : sel.has(c.ma_cau) ? 'cursor-pointer border-indigo-300 bg-indigo-50/40' : 'cursor-pointer border-slate-100 hover:bg-slate-50'}`}>
                    <input type="checkbox" checked={sel.has(c.ma_cau)} disabled={isBlocked} onChange={() => toggle(c.ma_cau)} className="mt-1" />
                    <MaCau ma={c.ma_cau} />
                    <span className="min-w-0 flex-1 text-[14px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                    {isBlocked
                      ? <span className="shrink-0 rounded bg-rose-100 px-1.5 text-[10px] font-semibold text-rose-600">đã dùng</span>
                      : <span className={`shrink-0 rounded px-1.5 text-[10px] font-medium ${n > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`} title="Số lượt câu này đã dùng trong các tài liệu ở Kho">{n > 0 ? `dùng ${n}×` : 'chưa dùng'}</span>}
                    <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500">{loaiLabel(c.loai_cau)}</span>
                  </label>
                )
              }
              return (
                <div key={g.maDang} className="mb-4">
                  {maDangs.length > 1 && <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">Dạng {g.maDang}</div>}
                  {caus.length === 0
                    ? <div className="px-1 py-1 text-[12px] italic text-slate-400">— không có câu khớp lọc —</div>
                    : hasCum
                      ? cumGroups.map((cg) => (
                        <div key={cg.cum?.ma_cum ?? '__chua_cum__'} className="mb-3">
                          <div className="mb-1 flex items-center gap-2">
                            {cg.cum
                              ? <span className="text-[11.5px] font-semibold tracking-wide text-violet-700">🌿 {tenCum(cg.cum)}</span>
                              : <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">— Chưa phân cụm —</span>}
                            <span className="text-[11px] text-slate-400">{cg.caus.length} câu</span>
                          </div>
                          <div className="space-y-1">
                            {cg.caus.map(renderCauLabel)}
                          </div>
                        </div>
                      ))
                      : <div className="space-y-1">{caus.map(renderCauLabel)}</div>}
                </div>
              )
            })}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={confirm} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Dùng {sel.size} câu</button>
        </div>
      </div>
    </div>
  )
}
