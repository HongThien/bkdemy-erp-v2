// Khớp tên (spec-khao-sat-hs.md §5): mọi cạnh trẻ gõ tên tự do → gợi ý HS trùng tên (DB tính: fn_khao_sat_goi_y_khop —
// so tên bỏ dấu + cùng trường/lớp/toà/khối) → bấm chọn, hoặc tìm tay, hoặc "Ngoài BK". Ưu tiên `biet` + `da_ru` trước.
import { useEffect, useMemo, useState } from 'react'
import { listCanh, goiYKhop, khopCanh, type Canh, type GoiYKhop, type LoaiCanh, LOAI_CANH_LABEL, QUEN_TU_LABEL, QUAN_HE_LABEL, KET_QUA_RU_LABEL } from '../../lib/khaosat'
import { listHocSinh, type HocSinh } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

type TrangThai = 'chua' | 'da' | 'ngoai'
const TT_LABEL: Record<TrangThai, string> = { chua: 'Chưa khớp', da: 'Đã khớp', ngoai: 'Ngoài BK' }
const LOAI_TONE: Record<LoaiCanh, string> = { biet: 'bg-sky-50 text-sky-700 ring-sky-200', da_ru: 'bg-emerald-50 text-emerald-700 ring-emerald-200', duoc_ru_boi: 'bg-violet-50 text-violet-700 ring-violet-200', muon_ru: 'bg-amber-50 text-amber-700 ring-amber-200' }
const ttOf = (c: Canh): TrangThai => (c.den_hoc_sinh_id ? 'da' : c.ngoai_bk ? 'ngoai' : 'chua')

export default function KhopTenTab() {
  const [canh, setCanh] = useState<Canh[]>([])
  const [hsAll, setHsAll] = useState<HocSinh[]>([])
  const [tt, setTt] = useState<TrangThai>('chua')
  const [loai, setLoai] = useState<LoaiCanh | 'all'>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<number | null>(null)
  const [goiY, setGoiY] = useState<Record<number, GoiYKhop[]>>({})
  const [chonTay, setChonTay] = useState<string | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function reload() {
    setLoading(true); setLoi(null)
    try { const [c, h] = await Promise.all([listCanh(), listHocSinh()]); setCanh(c); setHsAll(h.filter((x) => x.trang_thai === 'dang_hoc')) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function mo(id: number) {
    if (open === id) { setOpen(null); return }
    setOpen(id); setChonTay(null)
    if (!goiY[id]) { try { const g = await goiYKhop(id); setGoiY((m) => ({ ...m, [id]: g })) } catch (e: any) { setLoi(e.message ?? String(e)) } }
  }
  async function ghi(id: number, hsId: string | null, ngoaiBk = false) {
    setBusy(id); setLoi(null)
    try { await khopCanh(id, hsId, ngoaiBk); setCanh(await listCanh()); setOpen(null) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusy(null) }
  }

  const dem = useMemo(() => ({ chua: canh.filter((c) => ttOf(c) === 'chua').length, da: canh.filter((c) => ttOf(c) === 'da').length, ngoai: canh.filter((c) => ttOf(c) === 'ngoai').length }), [canh])
  const qq = q.trim().toLowerCase()
  const rows = canh.filter((c) => ttOf(c) === tt && (loai === 'all' || c.loai === loai) && (!qq || c.ten_goc.toLowerCase().includes(qq) || c.tu_ho_ten.toLowerCase().includes(qq)))
  const hsOpts = useMemo(() => hsAll.map((h) => ({ id: h.id, label: h.ho_ten, sub: [h.ma_hs, h.khoi ? `khối ${h.khoi}` : null, h.truong_hoc].filter(Boolean).join(' · '), img: h.anh_url })), [hsAll])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
          {(['chua', 'da', 'ngoai'] as TrangThai[]).map((k) => (
            <button key={k} onClick={() => setTt(k)} className={`h-8 rounded-md px-3 text-[13px] font-semibold transition ${tt === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{TT_LABEL[k]} <span className="ml-1 rounded-full bg-slate-200/70 px-1.5 text-[11px] text-slate-600">{dem[k]}</span></button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
          {(['all', 'biet', 'da_ru', 'duoc_ru_boi', 'muon_ru'] as const).map((k) => (
            <button key={k} onClick={() => setLoai(k)} className={`h-8 rounded-md px-3 text-[13px] font-semibold transition ${loai === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{k === 'all' ? 'Mọi loại' : LOAI_CANH_LABEL[k]}</button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên…" className="h-8 w-48 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
        <button onClick={reload} className="h-8 rounded-md border border-slate-200 px-3 text-[13px] text-slate-500 hover:border-indigo-300 hover:text-indigo-700">↻ Tải lại</button>
        {loi && <span className="text-[12px] text-rose-600">{loi}</span>}
      </div>
      <p className="mb-3 text-[12px] text-slate-500">Ưu tiên khớp <b>Biết bạn</b> và <b>Đã rủ bạn</b> trước; <b>Muốn rủ</b> phần lớn ngoài BK, để nguyên. Khi HS mới nhập học trùng tên một dòng "đã rủ / muốn rủ" → khớp ở đây để ghi vết.</p>

      {loading ? <div className="py-10 text-center text-sm text-slate-400">Đang tải…</div>
      : !rows.length ? <div className="py-10 text-center text-sm text-slate-400">Không có cạnh nào.</div>
      : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((c) => {
            const isOpen = open === c.id
            return (
              <div key={c.id} className="border-b border-slate-100 last:border-0">
                <button onClick={() => mo(c.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50">
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${LOAI_TONE[c.loai]}`}>{LOAI_CANH_LABEL[c.loai]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="text-[13px] text-slate-500">{c.tu_ho_ten}<span className="text-slate-300"> ({[c.tu_khoi ? `K${c.tu_khoi}` : null, c.tu_truong, c.tu_lop_truong, c.tu_toa].filter(Boolean).join(' · ')})</span> →</span>
                    <span className="ml-1.5 text-[14px] font-semibold text-slate-800">{c.ten_goc}</span>
                    {c.ghi_chu_goc && <span className="ml-1.5 text-[12px] text-slate-400">· {c.ghi_chu_goc}</span>}
                    {c.quen_tu && <span className="ml-1.5 text-[12px] text-slate-400">· {QUEN_TU_LABEL[c.quen_tu]}{c.quan_he ? ` · ${QUAN_HE_LABEL[c.quan_he]}` : ''}</span>}
                    {c.ket_qua_ru && <span className="ml-1.5 text-[12px] text-slate-400">· vào học: {KET_QUA_RU_LABEL[c.ket_qua_ru]}</span>}
                  </span>
                  {c.den_ho_ten && <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200">= {c.den_ho_ten}</span>}
                  {c.ngoai_bk && <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-slate-500">ngoài BK</span>}
                  <span className="text-slate-300">{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <div className="bg-slate-50/70 px-4 py-3">
                    {ttOf(c) !== 'chua' && (
                      <button disabled={busy === c.id} onClick={() => ghi(c.id, null)} className="mb-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-600 hover:border-rose-300 hover:text-rose-600 disabled:opacity-40">Bỏ khớp</button>
                    )}
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Gợi ý (tên bỏ dấu + cùng trường/lớp/toà/khối)</div>
                    {!goiY[c.id] ? <div className="text-[12px] text-slate-400">Đang tìm…</div>
                    : !goiY[c.id].length ? <div className="text-[12px] text-slate-400">Không có HS đang học nào trùng tên.</div>
                    : (
                      <div className="flex flex-wrap gap-2">
                        {goiY[c.id].map((g) => (
                          <button key={g.hoc_sinh_id} disabled={busy === c.id || g.hoc_sinh_id === c.den_hoc_sinh_id} onClick={() => ghi(c.id, g.hoc_sinh_id)}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-left hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-40">
                            {g.anh_url ? <img src={g.anh_url} alt="" className="h-7 w-7 rounded-full object-cover" /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[12px] font-bold text-indigo-700">{g.ho_ten.trim().split(/\s+/).pop()?.[0]}</span>}
                            <span>
                              <span className="block text-[13px] font-semibold text-slate-800">{g.ho_ten} <span className="font-normal text-slate-400">{g.ma_hs} · K{g.khoi}</span></span>
                              <span className="block text-[11px] text-slate-500">{[g.truong_hoc, g.lop_truong, g.toa].filter(Boolean).join(' · ') || '—'}{g.ly_do ? ` · ${g.ly_do}` : ''} · điểm {g.diem}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="w-72"><SearchSelect value={chonTay} onChange={setChonTay} options={hsOpts} placeholder="Tìm tay HS khác…" avatars /></div>
                      <button disabled={!chonTay || busy === c.id} onClick={() => ghi(c.id, chonTay)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Khớp HS này</button>
                      {!c.ngoai_bk && <button disabled={busy === c.id} onClick={() => ghi(c.id, null, true)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-600 hover:border-slate-400 disabled:opacity-40">Ngoài BK</button>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
