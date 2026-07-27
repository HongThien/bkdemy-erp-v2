// Component CHUNG "Ôn tập" (spec-btvn-ontap.md §5/§8) — dùng ở CẢ TrichPanel (gán buổi) LẪN modal
// "✎ Ôn tập" (KhoTaiLieuScreen). Method A shared component, KHÔNG copy-paste 2 bản (ADR-017).
// Controlled: cha giữ OnTapConfig (để lưu ĐÚNG LÚC cha cần — TrichPanel lưu trước khi gán, modal lưu khi bấm Lưu).
import { useEffect, useRef, useState } from 'react'
import { MathText } from '../screens/kho/ui'
import { khoCuaMon, usedCausOfBuoi, DEFAULT_BTVN_LINES } from '../lib/tailieu'
import { type CauHoi } from '../lib/kho/api'
import { goiYOnTap, getOnTapConfig, fetchCausByMa, fetchTenDangByMa, CAP_DANG, CAP_CAU_MOI_DANG, type OnTapConfig } from '../lib/ontap'
import { KhoPicker } from './KhoPicker'
import DangPickerOne from './DangPickerOne'

export default function OnTapEditor({ nguonId, buoiId, lopId, khoi, mon, config, onChange }: {
  nguonId: string; buoiId: string; lopId: string; khoi: string; mon: string
  config: OnTapConfig | null; onChange: (c: OnTapConfig) => void
}) {
  const cauTbl = khoCuaMon(mon).cauTbl
  const reqId = useRef(0)
  const [loading, setLoading] = useState(true)
  const [scoreByMa, setScoreByMa] = useState<Record<string, number>>({}) // ma_dang → score (0..1), chỉ có khi vừa chạy engine
  const [cauCache, setCauCache] = useState<Map<string, CauHoi>>(new Map())
  const [tenDangCache, setTenDangCache] = useState<Map<string, string>>(new Map())
  const [usedInBuoi, setUsedInBuoi] = useState<Set<string>>(new Set())
  const [dangPicker, setDangPicker] = useState(false)
  const [cauPicker, setCauPicker] = useState<null | { maDang: string; selected: string[] }>(null)

  async function goiYLai() {
    const my = ++reqId.current
    setLoading(true)
    try {
      const goiY = await goiYOnTap(nguonId, buoiId, lopId, mon)
      if (my !== reqId.current) return
      const sMap: Record<string, number> = {}
      const seedCache = new Map<string, CauHoi>()
      const seedTen = new Map<string, string>()
      for (const g of goiY) { sMap[g.ma_dang] = g.score; seedTen.set(g.ma_dang, g.ten_dang); for (const c of g.caus) seedCache.set(c.ma_cau, c) }
      setScoreByMa(sMap)
      setCauCache((prev) => new Map([...prev, ...seedCache]))
      setTenDangCache((prev) => new Map([...prev, ...seedTen]))
      onChange({ dangs: goiY.map((g) => ({ ma_dang: g.ma_dang, ma_caus: g.caus.map((c) => c.ma_cau) })), skipped: false })
    } finally { if (my === reqId.current) setLoading(false) }
  }

  // Boot: có config đã lưu (re-gán/re-trích, hoặc mở modal sửa) → hiện config đó, KHÔNG gợi ý mới.
  // Chưa có → auto-suggest điền sẵn (GV tick/bỏ/đổi). Chống race — đổi buổi/lớp nhanh (reqId, như SearchCau).
  useEffect(() => {
    let alive = true
    ;(async () => {
      const my = ++reqId.current
      setLoading(true)
      try {
        const [existing, used] = await Promise.all([getOnTapConfig(nguonId, buoiId, lopId), usedCausOfBuoi(nguonId, buoiId)])
        if (!alive || my !== reqId.current) return
        setUsedInBuoi(used)
        if (existing) { onChange(existing); setLoading(false); return }
        await goiYLai()
      } catch { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nguonId, buoiId, lopId])

  // Preview câu (config chỉ lưu ma_cau) — nạp thiếu vào cache, không nạp lại câu đã có.
  useEffect(() => {
    const allMa = config?.dangs.flatMap((d) => d.ma_caus) ?? []
    const missing = allMa.filter((m) => !cauCache.has(m))
    if (!missing.length) return
    let alive = true
    fetchCausByMa(missing, cauTbl).then((caus) => {
      if (!alive) return
      setCauCache((prev) => { const n = new Map(prev); for (const c of caus) n.set(c.ma_cau, c); return n })
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, cauTbl])

  // Tên dạng (config/DangPickerOne chỉ có ma_dang) — nạp thiếu, tương tự cauCache ở trên.
  useEffect(() => {
    const missing = (config?.dangs.map((d) => d.ma_dang) ?? []).filter((m) => !tenDangCache.has(m))
    if (!missing.length) return
    let alive = true
    fetchTenDangByMa(missing, mon).then((m) => {
      if (!alive) return
      setTenDangCache((prev) => new Map([...prev, ...m]))
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, mon])

  if (!config) return <div className="mt-3 text-[12px] text-slate-400">{loading ? 'Đang tải gợi ý ôn tập…' : ''}</div>

  const capDay = config.dangs.length >= CAP_DANG
  const otherDangCaus = (exceptMaDang: string) => config.dangs.filter((d) => d.ma_dang !== exceptMaDang).flatMap((d) => d.ma_caus)

  // Số dòng kẻ để HS viết — RIÊNG từng câu ôn tập (key ma_cau, sống trong config.dangs[].linesByCau).
  // appendOnTapToBtvnDoc gộp linesByCau này vào cau_hinh.btvnLinesByCau → phiếu in đúng số dòng (như BTVN chính).
  const setLine = (maDang: string, maCau: string, n: number) => onChange({
    ...config, dangs: config.dangs.map((x) => (x.ma_dang === maDang ? { ...x, linesByCau: { ...(x.linesByCau ?? {}), [maCau]: n } } : x)),
  })
  const setLineAll = (maDang: string, maCaus: string[], n: number) => onChange({
    ...config,
    dangs: config.dangs.map((x) => {
      if (x.ma_dang !== maDang) return x
      const next = { ...(x.linesByCau ?? {}) }
      for (const ma of maCaus) next[ma] = n
      return { ...x, linesByCau: next }
    }),
  })

  return (
    <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50/40 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-semibold text-violet-700">🔁 Ôn tập</span>
        {loading && <span className="text-[11px] text-slate-400">đang tải…</span>}
        <button onClick={goiYLai} disabled={loading} className="ml-auto rounded-md border border-violet-300 bg-white px-2 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40">↻ Gợi ý lại</button>
        <button onClick={() => onChange({ dangs: config.dangs, skipped: !config.skipped })}
          className={`rounded-md px-2 py-1 text-[11px] font-medium ${config.skipped ? 'bg-slate-700 text-white' : 'border border-slate-300 text-slate-500 hover:bg-slate-100'}`}>
          {config.skipped ? '✓ Không ôn tập buổi này' : 'Không ôn tập buổi này'}
        </button>
      </div>

      {config.skipped ? (
        <div className="text-[12px] italic text-slate-400">Đã chọn bỏ qua — buổi này không kèm khối ôn tập.</div>
      ) : (
        <>
          {config.dangs.length === 0 && !loading && (
            <div className="mb-2 text-[12px] italic text-slate-400">Chưa đủ dữ liệu đo để gợi ý — chọn tay dạng bằng "+ Dạng" hoặc bỏ qua.</div>
          )}
          <div className="space-y-2">
            {config.dangs.map((d) => {
              const score = scoreByMa[d.ma_dang]
              const caus = d.ma_caus.map((m) => cauCache.get(m)).filter(Boolean) as CauHoi[]
              return (
                <div key={d.ma_dang} className="rounded-md border border-slate-200 bg-white p-2.5">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-800">{tenDangCache.get(d.ma_dang) ?? d.ma_dang}</span>
                    {score !== undefined
                      ? <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700" title="Tỉ lệ HS yếu/cần luyện dạng này trong lớp">lớp yếu {Math.round(score * 100)}%</span>
                      : <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">chọn tay</span>}
                    <div className="ml-auto flex items-center gap-2">
                      {caus.length > 0 && <ApplyLinesAll count={caus.length} onApply={(n) => setLineAll(d.ma_dang, caus.map((c) => c.ma_cau), n)} />}
                      <button onClick={() => onChange({ ...config, dangs: config.dangs.filter((x) => x.ma_dang !== d.ma_dang) })}
                        className="text-[12px] text-slate-400 hover:text-rose-600" title="Bỏ dạng này khỏi ôn tập">✕</button>
                    </div>
                  </div>
                  {caus.length > 0 ? (
                    <ol className="space-y-1">
                      {caus.map((c) => (
                        <li key={c.ma_cau} className="flex items-center gap-2 rounded border border-slate-100 bg-slate-50/60 px-2 py-1">
                          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{c.ma_cau}</span>
                          <span className="min-w-0 flex-1 truncate text-[12px] text-slate-700"><MathText>{c.noi_dung}</MathText></span>
                          <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title="Số dòng kẻ để HS viết bài này">dòng
                            <input type="number" min={0} max={30} value={d.linesByCau?.[c.ma_cau] ?? DEFAULT_BTVN_LINES}
                              onChange={(e) => setLine(d.ma_dang, c.ma_cau, Math.max(0, Math.min(30, +e.target.value || 0)))}
                              className="h-6 w-11 rounded border border-slate-300 px-1 text-center text-[12px]" />
                          </label>
                        </li>
                      ))}
                    </ol>
                  ) : <div className="text-[12px] italic text-slate-400">Chưa có câu.</div>}
                  <button onClick={() => setCauPicker({ maDang: d.ma_dang, selected: d.ma_caus })} className="mt-1.5 rounded-md border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-violet-400">✎ Đổi câu</button>
                </div>
              )
            })}
          </div>
          <button onClick={() => setDangPicker(true)} disabled={capDay}
            className="mt-2 rounded-md border border-dashed border-violet-300 px-2.5 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40">
            + Dạng{capDay ? ` (đủ ${CAP_DANG})` : ''}
          </button>
        </>
      )}

      {dangPicker && (
        <DangPickerOne khoi={khoi} mon={mon}
          onClose={() => setDangPicker(false)}
          onPick={(maDang) => { setDangPicker(false); onChange({ ...config, dangs: [...config.dangs, { ma_dang: maDang, ma_caus: [] }] }) }}
        />
      )}
      {cauPicker && (
        <KhoPicker maDangs={[cauPicker.maDang]} selected={cauPicker.selected} disabled={[...usedInBuoi, ...otherDangCaus(cauPicker.maDang)]} cauTbl={cauTbl}
          onClose={() => setCauPicker(null)}
          onConfirm={(m) => {
            const capped = m.slice(0, CAP_CAU_MOI_DANG)
            setCauPicker(null)
            onChange({ ...config, dangs: config.dangs.map((x) => (x.ma_dang === cauPicker.maDang ? { ...x, ma_caus: capped } : x)) })
          }}
        />
      )}
    </div>
  )
}

// Áp 1 số dòng cho CẢ dạng ôn tập cùng lúc (giống ApplyLinesAll của TaiLieuBuilder) — gõ số rồi Enter/blur
// mới ghi (tránh ghi đè N câu mỗi keystroke). Ghi xong vẫn sửa riêng từng câu bình thường.
function ApplyLinesAll({ count, onApply }: { count: number; onApply: (n: number) => void }) {
  const [val, setVal] = useState('')
  const commit = () => { if (val.trim() === '') return; onApply(Math.max(0, Math.min(30, +val || 0))); setVal('') }
  return (
    <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title={`Áp số dòng này cho cả ${count} câu ôn tập của dạng — vẫn sửa riêng từng câu được sau đó`}>
      dòng cả dạng
      <input type="number" min={0} max={30} value={val} placeholder="—"
        onChange={(e) => setVal(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && commit()}
        className="h-6 w-11 rounded border border-violet-300 px-1 text-center text-[12px]" />
    </label>
  )
}
