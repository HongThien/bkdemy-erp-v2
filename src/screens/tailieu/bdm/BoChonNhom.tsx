// Bộ chọn NHÓM / DẠNG BÀI cho 1 buổi (spec-builder-ban-do-moi.md A1, B5).
// Nhóm là chính: bấm đầu hộp nhóm = chọn cả nhóm (mọi dạng bài). Bấm chip = chọn dạng bài lẻ — được lấy dạng bài lẻ từ
// NHIỀU nhóm khác nhau trong cùng buổi. Chuyên đề chỉ có ở đây để tìm đúng chỗ trên bản đồ; bản in không có chuyên đề (A3).
// Thứ tự nhóm = thứ tự chọn (sắp lại được ở cột "Đã chọn"); dạng bài trong nhóm theo thứ tự bản đồ.
import { useEffect, useMemo, useState } from 'react'
import { cayChon, type ChonChuDe, type ChonNhom, type ChonBuoi } from '../../../lib/tailieuBdm'
import { norm } from '../../../components/SearchSelect'

type Chon = { nhom: string; dang_bai: Set<string> }[]

// nhanh: nhánh bản đồ mới ('toan' Đại · 'hgt' Hình giải tích — chuyên đề HGT, Thùy 21/10)
export default function BoChonNhom({ khoi, nhanh = 'toan', daChon, onClose, onConfirm }: {
  khoi: string; nhanh?: string; daChon: ChonBuoi; onClose: () => void; onConfirm: (c: ChonBuoi) => Promise<void> | void
}) {
  const [cay, setCay] = useState<ChonChuDe[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [chuDe, setChuDe] = useState<string | null>(null)
  const [tim, setTim] = useState('')
  const [chon, setChon] = useState<Chon>(() => daChon.map((x) => ({ nhom: x.nhom, dang_bai: new Set(x.dang_bai) })))
  const [busy, setBusy] = useState(false)
  const [loiGhi, setLoiGhi] = useState<string | null>(null)   // lỗi khi dựng buổi — giữ popup + lựa chọn, báo tại chỗ

  useEffect(() => {
    cayChon(khoi, nhanh).then((c) => {
      setCay(c)
      // Mở sẵn chủ đề của nhóm đầu tiên đã chọn, không có thì chủ đề đầu.
      const dau = daChon[0]?.nhom
      const cd = dau ? c.find((x) => x.chuyen_de.some((ch) => ch.nhom.some((n) => n.id === dau))) : null
      setChuDe((cd ?? c[0])?.id ?? null)
    }).catch((e) => setErr(e.message ?? String(e)))
  }, [khoi, nhanh]) // eslint-disable-line

  // Tra nhóm theo id (để hiện tên ở cột "Đã chọn" + biết thứ tự dạng bài trên bản đồ).
  const nhomTheoId = useMemo(() => {
    const m = new Map<string, { nhom: ChonNhom; chuDe: string }>()
    for (const cd of cay ?? []) for (const ch of cd.chuyen_de) for (const n of ch.nhom) m.set(n.id, { nhom: n, chuDe: cd.ten })
    return m
  }, [cay])

  const chonCua = (nhomId: string) => chon.find((x) => x.nhom === nhomId)
  const caNhom = (n: ChonNhom) => { const c = chonCua(n.id); return !!c && (n.dang_bai.length === 0 || n.dang_bai.every((d) => c.dang_bai.has(d.id))) }

  function batNhom(n: ChonNhom) {
    setChon((s) => caNhom(n) ? s.filter((x) => x.nhom !== n.id)
      : s.some((x) => x.nhom === n.id) ? s.map((x) => x.nhom === n.id ? { nhom: n.id, dang_bai: new Set(n.dang_bai.map((d) => d.id)) } : x)
      : [...s, { nhom: n.id, dang_bai: new Set(n.dang_bai.map((d) => d.id)) }])
  }
  function batDangBai(n: ChonNhom, dbId: string) {
    setChon((s) => {
      const c = s.find((x) => x.nhom === n.id)
      if (!c) return [...s, { nhom: n.id, dang_bai: new Set([dbId]) }]
      const ds = new Set(c.dang_bai)
      ds.has(dbId) ? ds.delete(dbId) : ds.add(dbId)
      return ds.size === 0 ? s.filter((x) => x.nhom !== n.id) : s.map((x) => x.nhom === n.id ? { nhom: n.id, dang_bai: ds } : x)
    })
  }
  const doiCho = (i: number, j: number) => setChon((s) => { if (j < 0 || j >= s.length) return s; const t = [...s]; [t[i], t[j]] = [t[j], t[i]]; return t })

  async function xong() {
    setBusy(true); setLoiGhi(null)
    try {
      // Dạng bài trong nhóm: theo thứ tự trên bản đồ (không theo thứ tự bấm).
      await onConfirm(chon.map((c) => ({ nhom: c.nhom, dang_bai: (nhomTheoId.get(c.nhom)?.nhom.dang_bai ?? []).map((d) => d.id).filter((id) => c.dang_bai.has(id)) })))
    } catch (e) { setLoiGhi((e as { message?: string })?.message ?? String(e)) } finally { setBusy(false) }
  }

  // Ô tìm: tìm XUYÊN chủ đề theo tên nhóm / dạng bài (bỏ dấu). Có chữ ⇒ bỏ qua chủ đề đang chọn.
  const q = norm(tim.trim())
  const hien = (cay ?? []).filter((cd) => q || cd.id === chuDe).map((cd) => ({
    ...cd,
    chuyen_de: cd.chuyen_de.map((ch) => ({
      ...ch,
      nhom: q ? ch.nhom.filter((n) => norm(n.ten).includes(q) || n.dang_bai.some((d) => norm(d.ten).includes(q))) : ch.nhom,
    })).filter((ch) => ch.nhom.length > 0),
  })).filter((cd) => cd.chuyen_de.length > 0)

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-6 inset-y-6 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl max-md:inset-0 max-md:rounded-none max-md:border-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3 max-md:flex-wrap max-md:gap-2 max-md:px-3 max-md:py-2">
          <h3 className="text-base font-semibold text-slate-900 max-md:flex-1 max-md:text-[15px]">Chọn nhóm bài · dạng bài · Khối {khoi}</h3>
          <span className="text-[12px] text-slate-400 max-md:hidden">Bấm tên nhóm = cả nhóm · bấm dạng bài = chọn lẻ (được lấy từ nhiều nhóm)</span>
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm nhóm / dạng bài…" className="ml-auto h-8 w-64 rounded-md border border-slate-300 px-2.5 text-[13px] outline-none focus:border-indigo-500 max-md:order-last max-md:ml-0 max-md:h-9 max-md:w-full" />
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        {err ? <p className="p-6 text-sm text-rose-600">Lỗi: {err}</p>
          : !cay ? <p className="p-6 text-sm text-slate-400">Đang tải bản đồ…</p>
          : cay.length === 0 ? <p className="p-6 text-sm text-slate-400">Khối này chưa có chủ đề nào trên bản đồ mới.</p>
          : (
            <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr_300px] overflow-hidden max-md:flex max-md:flex-col">
              {/* Chủ đề */}
              <aside className="min-h-0 overflow-auto border-r border-slate-200 bg-slate-50/60 p-2 max-md:flex max-md:shrink-0 max-md:gap-1 max-md:overflow-x-auto max-md:border-b max-md:border-r-0 max-md:p-1.5">
                {cay.map((cd) => {
                  const n = chon.filter((c) => nhomTheoId.get(c.nhom)?.chuDe === cd.ten).length
                  return (
                    <button key={cd.id} onClick={() => { setChuDe(cd.id); setTim('') }}
                      className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] max-md:mb-0 max-md:w-auto max-md:shrink-0 max-md:whitespace-nowrap max-md:py-1.5 ${!q && chuDe === cd.id ? 'bg-indigo-600 font-semibold text-white' : 'text-slate-700 hover:bg-white'}`}>
                      <span className="min-w-0 flex-1">{cd.ten}</span>
                      {n > 0 && <span className={`shrink-0 rounded-full px-1.5 text-[11px] font-bold ${!q && chuDe === cd.id ? 'bg-white/25' : 'bg-indigo-100 text-indigo-700'}`}>{n}</span>}
                    </button>
                  )
                })}
              </aside>

              {/* Chuyên đề → nhóm → dạng bài */}
              <div className="min-h-0 overflow-auto p-4 max-md:flex-1 max-md:p-2.5">
                {hien.length === 0 && <p className="text-sm text-slate-400">Không có nhóm / dạng bài khớp “{tim}”.</p>}
                {hien.map((cd) => (
                  <div key={cd.id}>
                    {q && <div className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-500">{cd.ten}</div>}
                    {cd.chuyen_de.map((ch) => (
                      <section key={ch.id} className="mb-5">
                        <div className="mb-2 text-[12px] font-semibold text-slate-500">{ch.so}. {ch.ten}</div>
                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                          {ch.nhom.map((n) => {
                            const c = chonCua(n.id)
                            const ca = caNhom(n)
                            return (
                              <div key={n.id} className={`overflow-hidden rounded-xl border ${c ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200'}`}>
                                <button onClick={() => batNhom(n)} title={ca ? 'Bỏ cả nhóm' : 'Chọn cả nhóm (mọi dạng bài)'}
                                  className={`flex w-full items-center gap-2 px-3 py-2 text-left ${c ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'}`}>
                                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${ca ? 'border-white bg-white text-indigo-600' : c ? 'border-white bg-white/40' : 'border-indigo-300 bg-white'}`}>{ca ? '✓' : c ? '–' : ''}</span>
                                  <span className="min-w-0 flex-1 text-[13.5px] font-semibold">{n.ten}</span>
                                  <span className={`shrink-0 text-[10.5px] ${c ? 'text-white/80' : n.co_ly_thuyet ? 'text-emerald-600' : 'text-amber-600'}`}>{n.co_ly_thuyet ? '✓ LT' : 'chưa LT'}</span>
                                </button>
                                <div className="space-y-1 bg-white p-2">
                                  {n.dang_bai.length === 0
                                    ? <div className="px-1 text-[12px] italic text-slate-400">Chưa chia dạng bài — chọn cả nhóm ({n.so_cau_chua_phan} câu)</div>
                                    : n.dang_bai.map((d) => {
                                      const on = !!c?.dang_bai.has(d.id)
                                      return (
                                        <button key={d.id} onClick={() => batDangBai(n, d.id)}
                                          className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[12.5px] ${on ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
                                          <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border text-[9px] font-bold ${on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>{on ? '✓' : ''}</span>
                                          <span className="min-w-0 flex-1">{d.ten}</span>
                                          <span className={`shrink-0 text-[10.5px] ${d.so_cau === 0 ? 'text-rose-500' : 'text-slate-400'}`}>{d.so_cau} câu</span>
                                          <span className={`shrink-0 text-[10px] ${d.co_vi_du ? 'text-emerald-600' : 'text-slate-300'}`} title={d.co_vi_du ? 'Có ví dụ' : 'Chưa có ví dụ'}>VD</span>
                                        </button>
                                      )
                                    })}
                                  {n.dang_bai.length > 0 && n.so_cau_chua_phan > 0 && <div className="px-1 text-[11px] text-slate-400">+ {n.so_cau_chua_phan} câu chưa phân dạng bài (chọn tay được)</div>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                ))}
              </div>

              {/* Đã chọn — thứ tự nhóm trong buổi */}
              <aside className="flex min-h-0 flex-col border-l border-slate-200 bg-slate-50/60 max-md:max-h-[38%] max-md:shrink-0 max-md:border-l-0 max-md:border-t">
                <div className="border-b border-slate-200 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500 max-md:py-1.5">Đã chọn · {chon.length} nhóm</div>
                <div className="min-h-0 flex-1 overflow-auto p-2">
                  {chon.length === 0 && <p className="px-1 text-[12px] italic text-slate-400">Chưa chọn gì.</p>}
                  {chon.map((c, i) => {
                    const n = nhomTheoId.get(c.nhom)?.nhom
                    return (
                      <div key={c.nhom} className="mb-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-indigo-600">{i + 1}</span>
                          <span className="min-w-0 flex-1 text-[12.5px] font-semibold text-slate-800">{n?.ten ?? c.nhom}</span>
                          <button onClick={() => doiCho(i, i - 1)} disabled={i === 0} className="text-[11px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▲</button>
                          <button onClick={() => doiCho(i, i + 1)} disabled={i === chon.length - 1} className="text-[11px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▼</button>
                          <button onClick={() => setChon((s) => s.filter((x) => x.nhom !== c.nhom))} className="text-[12px] text-slate-400 hover:text-rose-600">✕</button>
                        </div>
                        {n && n.dang_bai.length > 0 && (
                          <div className="mt-0.5 pl-4 text-[11px] text-slate-500">
                            {c.dang_bai.size === n.dang_bai.length ? `cả nhóm · ${n.dang_bai.length} dạng bài` : n.dang_bai.filter((d) => c.dang_bai.has(d.id)).map((d) => d.ten).join(' · ')}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {loiGhi && <div className="border-t border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">⚠ {loiGhi}</div>}
                <div className="flex justify-end gap-2 border-t border-slate-200 px-3 py-2.5 max-md:pb-[max(0.625rem,env(safe-area-inset-bottom))]">
                  <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
                  <button onClick={xong} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 max-md:flex-1 max-md:py-2.5">{busy ? 'Đang dựng…' : `Dùng ${chon.length} nhóm`}</button>
                </div>
              </aside>
            </div>
          )}
      </div>
    </div>
  )
}
