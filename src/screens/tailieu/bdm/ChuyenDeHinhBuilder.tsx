// BUILDER CHUYÊN ĐỀ HÌNH (Thùy 21/10: chuyên đề nhánh Hình lấy từ Hình–Luyện — mô hình · kho bài). Khung như builder giáo trình bản đồ mới:
// thanh trên (tên · tự lưu · Xem/Xuất PDF · màu) · cây trái (Phần → mô hình → số bài) · thẻ Phần → thẻ mô hình → bài (trọn ý).
// Không đi với lớp nào (không Gán lớp). Mọi ghi qua RPC (lib/chuyenDeHinh.ts); sau thao tác VÁ đúng phần, không tải lại cả tài liệu.
import { useEffect, useMemo, useState } from 'react'
import { addBuoi, updatePhan, updateTaiLieu, type CauHinh } from '../../../lib/tailieu'
import { xoaBuoi, loiDoc } from '../../../lib/tailieuBdm'
import { cdhNoiDung, cdhDatMoHinh, cdhDatBai, cdhCayChon, type CdhNoiDung, type CdhPhan, type CdhMoHinh, type CdhChonMoHinh, type CdhChonNhom, type CdhChonChuDe } from '../../../lib/chuyenDeHinh'
import { khoCuaMoHinh, demKhoMoHinh, type ChuoiKho, type DemKho } from '../../../lib/kho/hinhCay'
import { MathText, inp } from '../../kho/ui'
import { MAU_PRESET } from '../TaiLieuBuilder'
import ChuyenDeHinhPrintView from './ChuyenDeHinhPrintView'

export default function ChuyenDeHinhBuilder({ id, onClose }: { id: string; onClose: () => void }) {
  const [nd, setNd] = useState<CdhNoiDung | null>(null)
  const [ten, setTen] = useState('')
  const [ch, setCh] = useState<CauHinh>({})
  const [err, setErr] = useState<string | null>(null)
  const [bao, setBao] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [chonMh, setChonMh] = useState<CdhPhan | null>(null)
  const [chonBai, setChonBai] = useState<{ phan: CdhPhan; mh: CdhMoHinh } | null>(null)
  const [inAll, setInAll] = useState(false)
  const [xemPhan, setXemPhan] = useState<string | null>(null)
  const markSaved = () => setSaved(true)
  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t) }, [saved])

  async function tai() {
    const n = await cdhNoiDung(id)
    setNd(n); setTen(n.tai_lieu?.ten ?? ''); setCh((n.tai_lieu?.cau_hinh ?? {}) as CauHinh)
  }
  useEffect(() => { tai().catch((e) => setErr(loiDoc(e))) }, [id]) // eslint-disable-line
  const lam = async (f: () => Promise<void>) => { setBao(null); try { await f() } catch (e) { setBao(loiDoc(e)) } }
  const vaPhan = (p: CdhPhan) => { setNd((x) => (x ? { ...x, buoi: x.buoi.map((b) => (b.id === p.id ? p : b)) } : x)); markSaved() }

  const datMoHinh = (p: CdhPhan, ids: string[]) => lam(async () => vaPhan(await cdhDatMoHinh(id, p.id, ids)))
  const datBai = (p: CdhPhan, mh: CdhMoHinh, mas: string[]) => lam(async () => {
    await cdhDatBai(mh.phan_id, mas)
    const moi = (await cdhNoiDung(id, p.id)).buoi[0]          // chỉ đọc lại ĐÚNG phần vừa sửa (bài mới cần nội dung)
    if (moi) vaPhan(moi)
  })
  const doiChoMh = (p: CdhPhan, i: number, j: number) => { const ids = p.mo_hinh.map((m) => m.id!).filter(Boolean); if (j < 0 || j >= ids.length) return; [ids[i], ids[j]] = [ids[j], ids[i]]; datMoHinh(p, ids) }
  const doiChoBai = (p: CdhPhan, mh: CdhMoHinh, i: number, j: number) => { const ms = mh.bai.map((b) => b.ma_bai); if (j < 0 || j >= ms.length) return; [ms[i], ms[j]] = [ms[j], ms[i]]; datBai(p, mh, ms) }
  const themPhan = () => lam(async () => { await addBuoi(id, 'Phần'); setNd(await cdhNoiDung(id)); markSaved() })   // thêm phần = đổi khung ⇒ đọc lại nền (không xoá màn)
  const xoaPhan = (p: CdhPhan) => { if (!confirm(`Xoá "${p.tieu_de ?? 'phần'}" (gồm mọi mô hình và bài đã chọn của phần)?`)) return; lam(async () => { await xoaBuoi(p.id); setNd((x) => (x ? { ...x, buoi: x.buoi.filter((b) => b.id !== p.id) } : x)); markSaved() }) }
  const doiTenPhan = (p: CdhPhan, t: string) => lam(async () => { await updatePhan(p.id, { tieu_de: t }); vaPhan({ ...p, tieu_de: t }) })
  const saveTen = () => { if (nd?.tai_lieu && ten.trim() && ten.trim() !== nd.tai_lieu.ten) lam(async () => { await updateTaiLieu(id, { ten: ten.trim() }); setNd((x) => (x && x.tai_lieu ? { ...x, tai_lieu: { ...x.tai_lieu, ten: ten.trim() } } : x)); markSaved() }) }
  const saveMau = (mau: string) => lam(async () => { const next = { ...ch, mau }; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() })
  const jump = (pid: string) => document.getElementById('cdh-' + pid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!nd || !nd.tai_lieu) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const khoi = nd.tai_lieu.khoi

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className={`${inp} h-9 max-w-[420px] flex-1 font-semibold`} placeholder="Tên chuyên đề" />
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">🆕 Chuyên đề · Hình (Luyện)</span>
        <span className="text-[12px] text-slate-400">Khối {khoi}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
        <button onClick={() => setInAll(true)} className="ml-auto whitespace-nowrap rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">🖨 Xem / Xuất PDF</button>
        <label className="flex items-center gap-1.5 text-[12px] text-slate-500">Màu
          <span className="flex gap-1">{MAU_PRESET.map(([c, n]) => (
            <button key={c} title={n} onClick={() => saveMau(c)} className={`h-6 w-6 rounded-full border-2 ${((ch as { mau?: string }).mau ?? '#2D9CDB') === c ? 'border-slate-800' : 'border-white shadow'}`} style={{ background: c }} />
          ))}</span>
        </label>
      </div>
      {bao && <div className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-5 py-2 text-[13px] text-rose-700"><span>⚠ {bao}</span><button onClick={() => setBao(null)} className="ml-auto text-rose-400 hover:text-rose-700">✕</button></div>}

      <div className="grid min-h-0 flex-1 grid-cols-[270px_1fr] overflow-hidden">
        <aside className="min-h-0 overflow-auto border-r border-slate-200 bg-white p-3">
          <div className="mb-2 truncate px-1 text-[13px] font-bold text-slate-700">📚 {ten || 'Chuyên đề'}</div>
          {nd.buoi.length === 0 && <div className="px-2 py-3 text-[12px] italic text-slate-400">Chưa có phần.</div>}
          {nd.buoi.map((p) => (
            <div key={p.id} className="mb-1">
              <button onClick={() => jump(p.id)} className="block w-full truncate rounded px-2 py-1 text-left text-[13px] font-semibold text-indigo-700 hover:bg-slate-100">📑 {p.tieu_de}</button>
              <div className="ml-2 border-l border-slate-100 pl-1">
                {p.mo_hinh.map((m) => (
                  <button key={m.phan_id} onClick={() => jump(m.phan_id)} className="block w-full truncate rounded px-2 py-1 text-left text-[12px] text-slate-600 hover:bg-slate-100">
                    {m.ten ?? '—'} <span className="text-slate-300">({m.bai.length})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <div className="min-h-0 overflow-auto p-5">
          <div className="mx-auto max-w-[900px] space-y-4">
            {nd.buoi.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-[13px] text-slate-400">Chưa có phần nào. Bấm “+ Thêm phần” để bắt đầu.</div>}
            {nd.buoi.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white">
                <div id={`cdh-${p.id}`} className="flex scroll-mt-3 items-center gap-2 rounded-t-xl border-b border-slate-100 bg-indigo-50/50 px-4 py-2.5">
                  <span className="text-[14px]">📑</span>
                  <input defaultValue={p.tieu_de ?? ''} onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== p.tieu_de) doiTenPhan(p, v) }}
                    className="w-[220px] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[15px] font-bold text-indigo-800 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white" />
                  <span className="text-[12px] text-slate-400">{p.mo_hinh.length} mô hình · {p.mo_hinh.reduce((s, m) => s + m.bai.length, 0) + (p.khac?.bai.length ?? 0)} bài</span>
                  <button onClick={() => setXemPhan(p.id)} className="ml-auto shrink-0 whitespace-nowrap rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">👁 Xem phần</button>
                  <button onClick={() => setChonMh(p)} className="shrink-0 whitespace-nowrap rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">+ Chọn mô hình</button>
                  <button onClick={() => xoaPhan(p)} title="Xoá phần" className="rounded border border-slate-200 px-1.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
                </div>
                <div className="space-y-4 p-4">
                  {p.mo_hinh.length === 0 && !p.khac && <div className="text-[12px] italic text-slate-400">Chưa có mô hình — bấm “+ Chọn mô hình”.</div>}
                  {p.mo_hinh.map((m, i) => (
                    <div key={m.phan_id} id={`cdh-${m.phan_id}`} className="scroll-mt-3 overflow-hidden rounded-xl border border-teal-200">
                      <div className="flex items-center gap-2 bg-teal-600 px-3 py-2 text-white">
                        <span className="flex shrink-0 flex-col leading-none" title="Đổi thứ tự mô hình">
                          <button onClick={() => doiChoMh(p, i, i - 1)} disabled={i === 0} className="text-[10px] text-white/70 hover:text-white disabled:opacity-25">▲</button>
                          <button onClick={() => doiChoMh(p, i, i + 1)} disabled={i === p.mo_hinh.length - 1} className="text-[10px] text-white/70 hover:text-white disabled:opacity-25">▼</button>
                        </span>
                        <span className="text-[14px] font-semibold">{m.ma ? `${m.ma} · ` : ''}{m.ten ?? <i className="font-normal opacity-80">(mô hình đã xoá khỏi bản đồ)</i>}</span>
                        <span className="text-[11px] text-white/80">{m.bai.length} bài</span>
                        <button onClick={() => setChonBai({ phan: p, mh: m })} disabled={!m.id} className="ml-auto shrink-0 rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-40">✎ Chọn bài</button>
                        <button onClick={() => datMoHinh(p, p.mo_hinh.filter((x) => x.phan_id !== m.phan_id).map((x) => x.id!).filter(Boolean))} title="Bỏ mô hình khỏi phần" className="shrink-0 text-[12px] text-white/70 hover:text-white">✕</button>
                      </div>
                      <ol className="space-y-1.5 bg-white p-3">
                        {m.bai.length === 0 && <li className="text-[12px] italic text-slate-400">Chưa có bài — bấm “✎ Chọn bài”.</li>}
                        {m.bai.map((b, j) => (
                          <li key={b.ma_bai} className="rounded-md border border-slate-100 bg-slate-50/50 px-2.5 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-bold text-slate-400">{j + 1}.</span>
                              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{b.ma_bai}</span>
                              <span className="text-[11px] text-slate-400">{b.y.length} ý</span>
                              {!b.con_trong_kho && <span className="rounded bg-amber-50 px-1.5 text-[10px] font-medium text-amber-700">không còn trong kho</span>}
                              <span className="ml-auto flex items-center gap-1">
                                <button onClick={() => doiChoBai(p, m, j, j - 1)} disabled={j === 0} className="rounded border border-slate-200 px-1.5 text-[11px] text-slate-500 disabled:opacity-30">↑</button>
                                <button onClick={() => doiChoBai(p, m, j, j + 1)} disabled={j === m.bai.length - 1} className="rounded border border-slate-200 px-1.5 text-[11px] text-slate-500 disabled:opacity-30">↓</button>
                                <button onClick={() => datBai(p, m, m.bai.filter((x) => x.ma_bai !== b.ma_bai).map((x) => x.ma_bai))} className="text-[12px] text-slate-400 hover:text-rose-600">✕</button>
                              </span>
                            </div>
                            {/* đề = giả thiết chung (de_bai là bản gốc trọn); bài một ý: đề nằm trong ý */}
                            <div className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-slate-700"><MathText>{b.gia_thiet_chung?.trim() || (b.y[0]?.noi_dung ?? '')}</MathText></div>
                            {b.anh_de && <img src={b.anh_de} alt="" className="mt-1 max-h-28 rounded border border-slate-200" />}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                  {p.khac && (
                    <div className="overflow-hidden rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 text-amber-800">
                        <span className="text-[13.5px] font-semibold">⚠ Bài chưa có mô hình</span>
                        <span className="text-[11px]">{p.khac.bai.length} bài · chưa gán mô hình hoặc không phải tự luận — in ở cuối phần với tên "Bài tập khác"</span>
                      </div>
                      <ol className="space-y-1.5 bg-white p-3">
                        {p.khac.bai.map((b, j) => (
                          <li key={b.ma_bai} className="rounded-md border border-slate-100 bg-slate-50/50 px-2.5 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-bold text-slate-400">{j + 1}.</span>
                              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{b.ma_bai}</span>
                              <span className="text-[11px] text-slate-400">{b.y.length} ý</span>
                              <button onClick={() => datBai(p, { phan_id: p.khac!.phan_id } as CdhMoHinh, p.khac!.bai.filter((x) => x.ma_bai !== b.ma_bai).map((x) => x.ma_bai))} className="ml-auto text-[12px] text-slate-400 hover:text-rose-600">✕</button>
                            </div>
                            <div className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-slate-700"><MathText>{b.gia_thiet_chung?.trim() || (b.y[0]?.noi_dung ?? '')}</MathText></div>
                            {b.anh_de && <img src={b.anh_de} alt="" className="mt-1 max-h-28 rounded border border-slate-200" />}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm phần</button>
          </div>
        </div>
      </div>

      {chonMh && <ChonMoHinh khoi={khoi} daChon={chonMh.mo_hinh.map((m) => m.id!).filter(Boolean)} onClose={() => setChonMh(null)}
        onConfirm={async (ids) => { const p = chonMh; setChonMh(null); await datMoHinh(p, ids) }} />}
      {chonBai && chonBai.mh.id && <ChonBai moHinhId={chonBai.mh.id} ten={chonBai.mh.ten ?? ''} daChon={chonBai.mh.bai.map((b) => b.ma_bai)}
        khoa={chonBai.phan.mo_hinh.filter((m) => m.phan_id !== chonBai.mh.phan_id).flatMap((m) => m.bai.map((b) => b.ma_bai))}
        onClose={() => setChonBai(null)} onConfirm={async (mas) => { const x = chonBai; setChonBai(null); await datBai(x.phan, x.mh, mas) }} />}
      {inAll && <ChuyenDeHinhPrintView id={id} onClose={() => setInAll(false)} />}
      {xemPhan && <ChuyenDeHinhPrintView id={id} onlyPhanId={xemPhan} onClose={() => setXemPhan(null)} />}
    </div>
  )
}

// ── Bộ chọn mô hình: chủ đề Hình–Luyện → nhóm mô hình → mô hình (kèm số bài trong kho). Thứ tự chọn = thứ tự trong phần. ──
function ChonMoHinh({ khoi, daChon, onClose, onConfirm }: { khoi: string; daChon: string[]; onClose: () => void; onConfirm: (ids: string[]) => void }) {
  const [cay, setCay] = useState<{ chuDe: CdhChonChuDe[]; nhom: CdhChonNhom[]; moHinh: CdhChonMoHinh[] } | null>(null)
  const [dem, setDem] = useState<Map<string, DemKho>>(new Map())
  const [chon, setChon] = useState<string[]>(daChon)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    cdhCayChon(khoi).then(setCay).catch((e) => setErr(loiDoc(e)))
    demKhoMoHinh(khoi).then(setDem).catch(() => { /* số bài chỉ để xem */ })
  }, [khoi])
  const bat = (id: string) => setChon((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const nhomCua = useMemo(() => {
    const m = new Map<string, CdhChonMoHinh[]>()
    for (const mh of cay?.moHinh ?? []) { const k = mh.nhom_mh_id ?? `cd:${mh.chu_de_id ?? ''}`; m.set(k, [...(m.get(k) ?? []), mh]) }
    return m
  }, [cay])
  const theMh = (mh: CdhChonMoHinh) => {
    const on = chon.includes(mh.id); const so = dem.get(mh.id)?.so_chuoi ?? 0
    return (
      <button key={mh.id} onClick={() => bat(mh.id)} className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-[13px] ${on ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'}`}>
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${on ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{on ? chon.indexOf(mh.id) + 1 : ''}</span>
        <span className="font-mono text-[11px] text-slate-400">{mh.ma}</span>
        <span className="min-w-0 flex-1 truncate">{mh.ten}</span>
        <span className={`shrink-0 text-[11px] ${so ? 'text-slate-400' : 'text-amber-600'}`}>{so} bài</span>
      </button>
    )
  }
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-10 inset-y-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn mô hình Hình–Luyện · Khối {khoi}</h3>
          <span className="text-[12px] text-slate-400">thứ tự bấm = thứ tự trong phần</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {err ? <p className="text-sm text-rose-600">{err}</p> : !cay ? <p className="text-sm text-slate-400">Đang tải…</p>
            : cay.chuDe.length === 0 ? <p className="text-sm text-slate-400">Khối {khoi} chưa có chủ đề Hình–Luyện trên bản đồ mới.</p>
            : cay.chuDe.map((cd) => (
              <div key={cd.id} className="mb-5">
                <div className="mb-2 text-[14px] font-bold text-slate-800">{cd.ten}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {cay.nhom.filter((n) => n.chu_de_id === cd.id).map((n) => (
                    <div key={n.id} className="rounded-lg border border-slate-200 p-2.5">
                      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-500">{n.ten}</div>
                      <div className="space-y-1">{(nhomCua.get(n.id) ?? []).map(theMh)}{!(nhomCua.get(n.id) ?? []).length && <div className="text-[12px] italic text-slate-300">trống</div>}</div>
                    </div>
                  ))}
                  {(nhomCua.get(`cd:${cd.id}`) ?? []).length > 0 && (
                    <div className="rounded-lg border border-dashed border-slate-200 p-2.5">
                      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chưa vào nhóm</div>
                      <div className="space-y-1">{(nhomCua.get(`cd:${cd.id}`) ?? []).map(theMh)}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3">
          <span className="text-[12px] text-slate-500">Đã chọn {chon.length} mô hình</span>
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onConfirm(chon)} className="rounded-md bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-500">Dùng {chon.length} mô hình</button>
        </div>
      </div>
    </div>
  )
}

// ── Chọn bài trong kho của 1 mô hình (bài đã chọn giữ thứ tự cũ, bài mới thêm vào cuối) ──
function ChonBai({ moHinhId, ten, daChon, khoa, onClose, onConfirm }: { moHinhId: string; ten: string; daChon: string[]; khoa: string[]; onClose: () => void; onConfirm: (mas: string[]) => void }) {
  const [kho, setKho] = useState<ChuoiKho[] | null>(null)
  const [chon, setChon] = useState<string[]>(daChon)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { khoCuaMoHinh(moHinhId).then(setKho).catch((e) => setErr(loiDoc(e))) }, [moHinhId])
  const bat = (ma: string) => setChon((s) => (s.includes(ma) ? s.filter((x) => x !== ma) : [...s, ma]))
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-16 inset-y-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn bài · {ten}</h3>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-auto px-6 py-4">
          {err ? <p className="text-sm text-rose-600">{err}</p> : !kho ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : kho.length === 0 ? <p className="text-sm text-slate-400">Mô hình này chưa có bài trong kho.</p>
            : kho.map((b) => {
              const on = chon.includes(b.ma_bai), khoaB = khoa.includes(b.ma_bai)
              return (
                <button key={b.id} disabled={khoaB} onClick={() => bat(b.ma_bai)} title={khoaB ? 'Bài đã dùng ở mô hình khác trong cùng phần' : undefined}
                  className={`block w-full rounded-lg border p-2.5 text-left disabled:opacity-40 ${on ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                  <div className="mb-1 flex items-center gap-2 text-[11px]">
                    <span className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${on ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{on ? chon.indexOf(b.ma_bai) + 1 : ''}</span>
                    <span className="font-mono text-slate-500">{b.ma_bai}</span>
                    <span className="text-slate-400">{b.y.length} ý</span>
                    {!b.gan_ca_bai && <span className="rounded bg-slate-100 px-1.5 text-slate-500">ý gán vào bài của mô hình</span>}
                  </div>
                  <div className="line-clamp-3 text-[13px] text-slate-700"><MathText>{b.gia_thiet_chung?.trim() || (b.y[0]?.noi_dung ?? '')}</MathText></div>
                </button>
              )
            })}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3">
          <span className="text-[12px] text-slate-500">Đã chọn {chon.length} bài</span>
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onConfirm(chon)} className="rounded-md bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-500">Dùng {chon.length} bài</button>
        </div>
      </div>
    </div>
  )
}
