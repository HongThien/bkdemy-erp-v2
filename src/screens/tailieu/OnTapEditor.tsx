// OnTapEditor — khối cấu hình "Ôn tập" của 1 (buổi master × lớp × ngày gán) (spec-btvn-ontap, 07-13).
// DÙNG CHUNG 2 nơi (cấm copy-paste 2 bản): TrichPanel (lúc gán buổi) + modal ✎ Ôn tập ở Kho tài liệu.
// Hệ gợi ý ≤2 dạng (cửa sổ 0-21/22-42 ngày, yếu nhất trước, ≥80% sĩ số đã đo) — GV tick/bỏ/đổi.
// Component CHỈ quản lý config trong RAM + báo lên qua onChange — VIỆC LƯU do cha quyết (TrichPanel
// lưu lúc bấm Gán; modal lưu lúc bấm Lưu) để giữ đúng thứ tự save-config-trước-trích.
import { useEffect, useRef, useState } from 'react'
import { goiYOnTap, type GoiYOnTap, type OnTapConfig } from '../../lib/ontap'
import { khoCuaMon } from '../../lib/tailieu'
import { supabase } from '../../lib/supabase'
import { DangPicker, KhoPicker } from './TaiLieuBuilder'

const DEFAULT_ONTAP_LINES = 10 // Thùy chốt 07-13 — GV vẫn đổi được từng câu

export default function OnTapEditor({ nguonId, nguonBuoi, lopId, mon, khoi, ngay, value, onChange, onLoadingChange }: {
  nguonId: string; nguonBuoi: string; lopId: string; mon: string; khoi: string; ngay: string
  value: OnTapConfig | null // config hiện có (đã lưu trước đó) — null = chưa từng cấu hình
  onChange: (cfg: OnTapConfig) => void
  // Báo cha đang tải gợi ý (~vài giây, goiYOnTap nhiều round-trip) — cha PHẢI khoá nút Gán/Lưu trong
  // lúc này, không thì bấm quá nhanh sẽ gửi `onTap=null` lên và saveOnTapConfig bị bỏ qua LẶNG LẼ
  // (bug thật 07-13: gán 4 lần thật, btvn_ontap_config vẫn 0 dòng — race y hệt cảnh báo này).
  onLoadingChange?: (loading: boolean) => void
}) {
  const [cfg, setCfg] = useState<OnTapConfig>(value ?? { dangs: [] })
  const [goiY, setGoiY] = useState<GoiYOnTap[] | null>(null) // null = đang tải
  const [tenDang, setTenDang] = useState<Record<string, string>>({})
  const [pickDang, setPickDang] = useState(false)
  const [pickCau, setPickCau] = useState<string | null>(null) // ma_dang đang đổi câu
  const reqId = useRef(0)
  const set = (c: OnTapConfig) => { setCfg(c); onChange(c) }

  // tên dạng cho chip (config tay có thể chứa dạng ngoài gợi ý)
  useEffect(() => {
    const mas = cfg.dangs.map((d) => d.ma_dang).filter((m) => !tenDang[m])
    if (!mas.length) return
    supabase.from(khoCuaMon(mon).banDoTbl).select('ma_dang, ten_dang').in('ma_dang', mas).limit(50)
      .then(({ data }) => setTenDang((cur) => ({ ...cur, ...Object.fromEntries(((data ?? []) as any[]).map((r) => [r.ma_dang, r.ten_dang])) })))
  }, [cfg.dangs.map((d) => d.ma_dang).join(',')]) // eslint-disable-line

  // gợi ý: CHỈ khi chưa có config (đã có thì hiện config, kèm nút ↻ Gợi ý lại). Race-guard reqId
  // (user đổi buổi/lớp/ngày nhanh) — KHÔNG thay cả panel bằng loading (bài học scroll-reset).
  async function taiGoiY(apDung: boolean) {
    const id = ++reqId.current
    setGoiY(null)
    onLoadingChange?.(true)
    try {
      const gs = await goiYOnTap(nguonId, nguonBuoi, lopId, mon, ngay)
      if (id !== reqId.current) return
      setGoiY(gs)
      setTenDang((cur) => ({ ...cur, ...Object.fromEntries(gs.map((g) => [g.ma_dang, g.ten_dang])) }))
      if (apDung) set({
        dangs: gs.filter((g) => g.cau).map((g) => ({ ma_dang: g.ma_dang, cau_ids: [g.cau!.ma_cau], linesByCau: { [g.cau!.ma_cau]: DEFAULT_ONTAP_LINES } })),
        skipped: false,
      })
    } catch { if (id === reqId.current) setGoiY([]) }
    finally { if (id === reqId.current) onLoadingChange?.(false) }
  }
  useEffect(() => {
    if (value) { setCfg(value); setGoiY([]); onLoadingChange?.(false) } // có config sẵn → hiện config, không auto gợi ý đè
    else taiGoiY(true)
  }, [nguonId, nguonBuoi, lopId, ngay]) // eslint-disable-line

  const badge = (ma: string) => {
    const g = goiY?.find((x) => x.ma_dang === ma)
    if (!g) return null
    return <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">lớp yếu {Math.round(g.score * 100)}% · học {g.ngayHoc.split('-').reverse().slice(0, 2).join('/')}</span>
  }
  const boDang = (ma: string) => set({ ...cfg, dangs: cfg.dangs.filter((d) => d.ma_dang !== ma) })
  const doiCau = (ma: string, cauId: string) => set({
    ...cfg,
    dangs: cfg.dangs.map((d) => (d.ma_dang === ma ? { ma_dang: ma, cau_ids: [cauId], linesByCau: { [cauId]: d.linesByCau?.[d.cau_ids[0]] ?? DEFAULT_ONTAP_LINES } } : d)),
  })
  const doiLines = (ma: string, cauId: string, n: number) => set({
    ...cfg, dangs: cfg.dangs.map((d) => (d.ma_dang === ma ? { ...d, linesByCau: { [cauId]: n } } : d)),
  })

  if (cfg.skipped) return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-500">
      Không ôn tập buổi này. <button onClick={() => set({ ...cfg, skipped: false })} className="font-medium text-indigo-600 hover:underline">Bật lại</button>
    </div>
  )
  return (
    <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 p-2.5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-violet-600">Ôn tập (≤2 dạng · 1 câu/dạng)</span>
        {goiY === null && <span className="text-[11px] text-slate-400">⏳ đang gợi ý…</span>}
        <button onClick={() => taiGoiY(true)} title="Gợi ý lại theo mastery lớp (đè lựa chọn hiện tại)" className="ml-auto rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500 hover:border-violet-300">↻ Gợi ý lại</button>
        <button onClick={() => set({ ...cfg, skipped: true })} className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Không ôn buổi này</button>
      </div>
      {cfg.dangs.length === 0 && goiY !== null && (
        <p className="text-[12px] text-slate-400">{goiY.length === 0 ? 'Chưa đủ dữ liệu đo để gợi ý — chọn tay hoặc bỏ qua.' : 'Chưa chọn dạng nào.'}</p>
      )}
      <div className="space-y-1.5">
        {cfg.dangs.map((d) => (
          <div key={d.ma_dang} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px]">
            <span className="font-mono text-[11px] text-slate-400">{d.ma_dang}</span>
            <span className="font-medium text-slate-700">{tenDang[d.ma_dang] ?? '…'}</span>
            {badge(d.ma_dang)}
            <span className="ml-auto font-mono text-[11px] text-slate-500">{d.cau_ids[0] ?? '—'}</span>
            <label className="flex items-center gap-1 text-[11px] text-slate-400">kẻ
              <input type="number" min={0} value={d.linesByCau?.[d.cau_ids[0]] ?? DEFAULT_ONTAP_LINES} onChange={(e) => doiLines(d.ma_dang, d.cau_ids[0], parseInt(e.target.value || '0', 10))} className="w-12 rounded border border-slate-200 px-1 py-0.5 text-[11px]" />
            </label>
            <button onClick={() => setPickCau(d.ma_dang)} title="Đổi câu" className="rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500 hover:border-indigo-300">✎ câu</button>
            <button onClick={() => boDang(d.ma_dang)} className="text-slate-300 hover:text-rose-600">✕</button>
          </div>
        ))}
      </div>
      {cfg.dangs.length < 2 && (
        <button onClick={() => setPickDang(true)} className="mt-1.5 rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-[12px] text-slate-500 hover:border-violet-400 hover:text-violet-600">+ Dạng (chọn tay)</button>
      )}
      {pickDang && (
        <DangPicker khoi={khoi} mon={mon} selected={cfg.dangs.map((d) => d.ma_dang)} onClose={() => setPickDang(false)}
          onConfirm={(mas) => {
            const moi = mas.slice(0, 2)
            set({ ...cfg, dangs: moi.map((ma) => cfg.dangs.find((d) => d.ma_dang === ma) ?? { ma_dang: ma, cau_ids: [], linesByCau: {} }) })
            setPickDang(false)
          }} />
      )}
      {pickCau && (
        <KhoPicker maDangs={[pickCau]} cauTbl={khoCuaMon(mon).cauTbl} selected={cfg.dangs.find((d) => d.ma_dang === pickCau)?.cau_ids ?? []}
          onClose={() => setPickCau(null)}
          onConfirm={(mas) => { if (mas[0]) doiCau(pickCau, mas[mas.length - 1]); setPickCau(null) }} />
      )}
    </div>
  )
}
