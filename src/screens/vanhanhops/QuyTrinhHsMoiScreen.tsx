import { useEffect, useRef, useState } from 'react'
import {
  dashboardHsMoi, tickHsMoi, listBuoc, themBuoc, suaBuoc, boBuoc,
  type BuocHsMoi, type DongHsMoi, type DashboardHsMoi,
} from '../../lib/hsmoi'

// QUY TRÌNH HỌC SINH MỚI (Thùy 27/10). 2 tab:
//   • Theo dõi — mỗi hàng 1 PH–HS, mỗi cột 1 bước; bấm ô = tick/bỏ tick, ô xong đổi màu theo màu của bước.
//     Lọc 1–4 tuần (ngày nhập học) · khối · mặc định chỉ hiện dòng CHƯA full. HS > 4 tuần mặc định full (DB suy).
//   • Checklist — thêm/sửa/sắp xếp/bỏ bước + chọn màu ô.
// Tick xong vá đúng dòng tại chỗ (dòng vừa đủ vẫn đứng nguyên, gắn nhãn "Đủ" tới khi bấm ↻).
// Rời màn quay lại = đúng chỗ cũ: filter + bảng đã vá + scrollTop nhớ ở module-level.

type Tab = 'theo_doi' | 'checklist'
const NHO: { tab: Tab; soTuan: number | null; khoi: string | null; chiChuaFull: boolean; data: DashboardHsMoi | null; scroll: number } = {
  tab: 'theo_doi', soTuan: 4, khoi: null, chiChuaFull: true, data: null, scroll: 0,
}
const MAU_GOI_Y = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b']
const fmtNgay = (d: string | null) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}` : '—')

export default function QuyTrinhHsMoiScreen() {
  const [tab, setTab] = useState<Tab>(NHO.tab)
  const doiTab = (t: Tab) => { NHO.tab = t; setTab(t) }
  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Quy trình học sinh mới</span>
        <div className="flex rounded-lg bg-slate-100 p-0.5 text-[13px]">
          {([['theo_doi', 'Theo dõi'], ['checklist', 'Checklist']] as const).map(([k, ten]) => (
            <button key={k} onClick={() => doiTab(k)}
              className={`rounded-md px-3 py-1 font-medium transition ${tab === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{ten}</button>
          ))}
        </div>
      </div>
      {tab === 'theo_doi' ? <TheoDoi /> : <Checklist />}
    </div>
  )
}

function TheoDoi() {
  const [soTuan, setSoTuan] = useState<number | null>(NHO.soTuan)
  const [khoi, setKhoi] = useState<string | null>(NHO.khoi)
  const [chiChuaFull, setChiChuaFull] = useState(NHO.chiChuaFull)
  const [data, setData] = useState<DashboardHsMoi | null>(NHO.data)
  const [loading, setLoading] = useState(!NHO.data)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangGhi, setDangGhi] = useState<string | null>(null)
  const cuon = useRef<HTMLDivElement>(null)
  const lanDau = useRef(true)

  // Đổi filter = đổi ngữ cảnh ⇒ fetch lại. Bảng cũ giữ nguyên tới khi có bảng mới (không trắng màn).
  async function tai() {
    NHO.soTuan = soTuan; NHO.khoi = khoi; NHO.chiChuaFull = chiChuaFull
    setLoi(null)
    if (!data) setLoading(true)
    try {
      const d = await dashboardHsMoi(soTuan, khoi, chiChuaFull)
      NHO.data = d; setData(d)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => {
    if (lanDau.current && NHO.data) { lanDau.current = false; if (cuon.current) cuon.current.scrollTop = NHO.scroll; return }
    lanDau.current = false
    tai()
  }, [soTuan, khoi, chiChuaFull]) // eslint-disable-line

  async function bam(r: DongHsMoi, b: BuocHsMoi) {
    const key = `${r.hs_id}|${b.id}`
    if (dangGhi) return
    setDangGhi(key)
    try {
      const moi = await tickHsMoi(r.hs_id, b.id, !r.xong.includes(b.id))
      setData((prev) => {
        if (!prev) return prev
        const d = { ...prev, rows: prev.rows.map((x) => (x.hs_id === moi.hs_id ? moi : x)) }
        NHO.data = d
        return d
      })
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangGhi(null) }
  }

  const buoc = data?.buoc ?? []
  const rows = data?.rows ?? []
  const nut = (on: boolean) => `rounded-md px-2.5 py-1 text-[12px] font-medium transition ${on ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-6 py-2">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-[12px] text-slate-500">Nhập học trong</span>
          {[1, 2, 3, 4].map((n) => <button key={n} className={nut(soTuan === n)} onClick={() => setSoTuan(n)}>{n} tuần</button>)}
          <button className={nut(soTuan === null)} onClick={() => setSoTuan(null)}>Tất cả</button>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 text-[12px] text-slate-500">Khối</span>
          <select value={khoi ?? ''} onChange={(e) => setKhoi(e.target.value || null)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-700">
            <option value="">Tất cả</option>
            {(data?.khoi ?? []).map((k) => <option key={k} value={k}>Khối {k}</option>)}
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-[12px] text-slate-600">
          <input type="checkbox" checked={chiChuaFull} onChange={(e) => setChiChuaFull(e.target.checked)} />
          Chỉ hiện PH chưa xong hết
        </label>
        <span className="ml-auto text-[12px] text-slate-400">{rows.length} dòng</span>
        <button onClick={tai} title="Quét lại" className="rounded-md px-2 py-1 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻</button>
      </div>

      {loi && <div className="mx-6 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{loi}</div>}

      <div ref={cuon} onScroll={(e) => { NHO.scroll = e.currentTarget.scrollTop }} className="min-h-0 flex-1 overflow-auto p-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : buoc.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              Chưa có bước nào trong checklist — sang tab <b>Checklist</b> để thêm.
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              {chiChuaFull ? 'Không còn PH nào chưa xong trong khoảng này 🎉' : 'Không có học sinh nhập học trong khoảng này.'}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full table-fixed border-collapse text-[13px]">
                {/* Cột cố định rộng theo nội dung, các cột bước chia đều phần còn lại (table-fixed) ⇒ bảng vừa màn, không cuộn ngang. */}
                <colgroup>
                  <col className="w-[22%]" /><col className="w-[52px]" /><col className="w-[92px]" />
                  {buoc.map((b) => <col key={b.id} />)}
                  <col className="w-[96px]" />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-slate-50 text-[12px] text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Phụ huynh – Học sinh</th>
                    <th className="px-2 py-2 text-left font-medium">Khối</th>
                    <th className="px-2 py-2 text-left font-medium">Nhập học</th>
                    {buoc.map((b) => (
                      <th key={b.id} title={b.mo_ta ?? undefined} className="px-1.5 py-2 text-center align-bottom font-medium leading-snug">
                        <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: b.mau }} />{b.ten}
                      </th>
                    ))}
                    <th className="whitespace-nowrap px-3 py-2 text-center font-medium">Tiến độ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.hs_id} className="border-t border-slate-100">
                      <td className="px-3 py-1.5">
                        <div className="font-medium text-slate-800">{r.ph_ten ?? '(chưa có PH)'} <span className="text-slate-400">–</span> {r.ho_ten}</div>
                        <div className="text-[11px] text-slate-400">{r.ma_hs}{r.ph_sdt ? ` · ${r.ph_sdt}` : ''}</div>
                      </td>
                      <td className="px-2 py-1.5 text-slate-600">{r.khoi ?? '—'}</td>
                      <td className="px-2 py-1.5 text-slate-600">
                        {fmtNgay(r.ngay_nhap_hoc)}
                        {r.so_ngay != null && <span className="ml-1 text-[11px] text-slate-400">({r.so_ngay}n)</span>}
                      </td>
                      {buoc.map((b) => {
                        const xong = r.xong.includes(b.id)
                        const macDinh = !xong && r.qua_4_tuan
                        const key = `${r.hs_id}|${b.id}`
                        return (
                          <td key={b.id} className="px-1.5 py-1.5 text-center">
                            <button onClick={() => bam(r, b)} disabled={dangGhi === key}
                              title={macDinh ? 'Nhập học > 4 tuần — mặc định đã xong' : xong ? 'Bấm để bỏ tick' : 'Bấm để tick'}
                              className="h-8 w-full rounded-md text-[14px] font-semibold transition hover:opacity-80 disabled:opacity-50"
                              style={xong ? { background: b.mau, color: '#fff' }
                                : macDinh ? { background: `${b.mau}33`, color: b.mau }
                                : { background: '#f1f5f9', color: '#cbd5e1' }}>
                              {xong ? '✓' : macDinh ? '✓' : '·'}
                            </button>
                          </td>
                        )
                      })}
                      <td className="px-3 py-1.5 text-center">
                        {r.full
                          ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">{r.qua_4_tuan && r.so_xong < r.tong ? 'Đủ (> 4 tuần)' : 'Đủ'}</span>
                          : <span className="text-[12px] text-slate-500">{r.so_xong}/{r.tong}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </>
  )
}

function Checklist() {
  const [ds, setDs] = useState<BuocHsMoi[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [ten, setTen] = useState('')
  const [mau, setMau] = useState(MAU_GOI_Y[0])
  const [xacNhanBo, setXacNhanBo] = useState<string | null>(null)

  useEffect(() => { listBuoc().then(setDs).catch((e) => setLoi(e.message)).finally(() => setLoading(false)) }, [])
  // Đổi danh mục bước ⇒ cột bảng Theo dõi đổi ⇒ bỏ cache để lần mở sau fetch lại.
  const doi = () => { NHO.data = null }
  const chay = async (f: () => Promise<void>) => { setLoi(null); try { await f(); doi() } catch (e: any) { setLoi(e.message ?? String(e)) } }

  const them = () => chay(async () => {
    const t = ten.trim(); if (!t) return
    const thuTu = (ds.length ? Math.max(...ds.map((b) => b.thu_tu)) : 0) + 1
    const b = await themBuoc(t, mau, thuTu)
    setDs((p) => [...p, b]); setTen('')
  })
  const sua = (id: string, patch: Partial<BuocHsMoi>) => chay(async () => {
    setDs((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b)))
    await suaBuoc(id, patch)
  })
  // Đổi chỗ 2 bước kề nhau = gán lại thu_tu theo vị trí mới (giữ nguyên id — mã gốc không đổi).
  const doiCho = (i: number, j: number) => chay(async () => {
    const moi = [...ds]; [moi[i], moi[j]] = [moi[j], moi[i]]
    const danh = moi.map((b, k) => ({ ...b, thu_tu: k + 1 }))
    setDs(danh)
    await Promise.all(danh.filter((b) => b.thu_tu !== ds.find((x) => x.id === b.id)?.thu_tu)
      .map((b) => suaBuoc(b.id, { thu_tu: b.thu_tu })))
  })
  const bo = (id: string) => chay(async () => {
    await boBuoc(id); setDs((p) => p.filter((b) => b.id !== id)); setXacNhanBo(null)
  })

  return (
    <div className="min-h-0 flex-1 overflow-auto p-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-[12px] text-slate-500">Mỗi bước = 1 cột ở bảng Theo dõi. Màu là màu ô khi bước đó đã xong. Bỏ 1 bước thì các tick cũ vẫn được giữ lại trong lịch sử.</p>
        {loi && <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{loi}</div>}
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          <div className="flex flex-col gap-2">
            {ds.map((b, i) => (
              <div key={b.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
                <span className="w-6 text-center text-[12px] text-slate-400">{i + 1}</span>
                <MauChon mau={b.mau} onChon={(m) => sua(b.id, { mau: m })} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <input defaultValue={b.ten} onBlur={(e) => { const t = e.target.value.trim(); if (t && t !== b.ten) sua(b.id, { ten: t }) }}
                    className="rounded-md border border-transparent px-1.5 py-0.5 text-[14px] font-medium text-slate-800 hover:border-slate-200 focus:border-indigo-300 focus:outline-none" />
                  <input defaultValue={b.mo_ta ?? ''} placeholder="Mô tả (tuỳ chọn)"
                    onBlur={(e) => { const t = e.target.value.trim() || null; if (t !== b.mo_ta) sua(b.id, { mo_ta: t }) }}
                    className="rounded-md border border-transparent px-1.5 py-0.5 text-[12px] text-slate-500 hover:border-slate-200 focus:border-indigo-300 focus:outline-none" />
                </div>
                <button disabled={i === 0} onClick={() => doiCho(i, i - 1)} className="rounded px-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30">↑</button>
                <button disabled={i === ds.length - 1} onClick={() => doiCho(i, i + 1)} className="rounded px-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30">↓</button>
                {xacNhanBo === b.id
                  ? <button onClick={() => bo(b.id)} onMouseLeave={() => setXacNhanBo(null)} className="rounded-md bg-rose-600 px-2 py-1 text-[12px] font-medium text-white">Bỏ bước?</button>
                  : <button onClick={() => setXacNhanBo(b.id)} title="Bỏ khỏi checklist" className="rounded px-1.5 text-slate-400 hover:text-rose-600">✕</button>}
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-2.5">
              <MauChon mau={mau} onChon={setMau} />
              <input value={ten} onChange={(e) => setTen(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') them() }}
                placeholder="Thêm bước mới…" className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[13px] focus:border-indigo-300 focus:outline-none" />
              <button onClick={them} disabled={!ten.trim()} className="rounded-md bg-indigo-600 px-3 py-1 text-[13px] font-medium text-white disabled:opacity-40">Thêm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MauChon({ mau, onChon }: { mau: string; onChon: (m: string) => void }) {
  const [mo, setMo] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setMo((v) => !v)} className="h-7 w-7 rounded-md ring-1 ring-slate-200" style={{ background: mau }} title="Chọn màu ô khi xong" />
      {mo && (
        <div className="absolute left-0 top-9 z-20 flex w-max items-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg" onMouseLeave={() => setMo(false)}>
          {MAU_GOI_Y.map((m) => (
            <button key={m} onClick={() => { onChon(m); setMo(false) }} className={`h-6 w-6 rounded ${m === mau ? 'ring-2 ring-slate-700 ring-offset-1' : ''}`} style={{ background: m }} />
          ))}
          <input type="color" value={mau} onChange={(e) => onChon(e.target.value)} className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0" title="Màu khác" />
        </div>
      )}
    </div>
  )
}
