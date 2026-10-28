// BUILDER CHUYÊN ĐỀ HÌNH (Thùy 21/10: chuyên đề nhánh Hình lấy từ Hình–Luyện — mô hình · kho bài). Khung như builder giáo trình bản đồ mới:
// thanh trên (tên · tự lưu · Xem/Xuất PDF · màu) · cây trái (Phần → mô hình → số bài) · thẻ Phần → thẻ mô hình → bài (trọn ý).
// Không đi với lớp nào (không Gán lớp). Mọi ghi qua RPC (lib/chuyenDeHinh.ts); sau thao tác VÁ đúng phần, không tải lại cả tài liệu.
// ⭐ laGiaoTrinh (Thùy 27/10 — giáo trình Hình bản đồ mới, mig 202610271757): CÙNG builder, đơn vị "Buổi", mỗi buổi thêm phần HỌC
// (bài học → lý thuyết + bài luyện + BTVN) trước phần LUYỆN (mô hình); có Gán lớp; in bằng PrintView chung (Học + Luyện).
import { useEffect, useMemo, useState } from 'react'
import { addBuoi, updatePhan, updateTaiLieu, type CauHinh } from '../../../lib/tailieu'
import { xoaBuoi, loiDoc, datCoPhan } from '../../../lib/tailieuBdm'
import { cdhNoiDung, cdhDatMoHinh, cdhDatBai, cdhCayChon, hhCayChon, hhCau, hhDatBai, hhDatCau, hhGoiY, type CdhNoiDung, type CdhPhan, type CdhMoHinh, type CdhChonMoHinh, type CdhChonNhom, type CdhChonChuDe, type HhBai, type HhChonBai, type HhCauKho } from '../../../lib/chuyenDeHinh'
import { khoCuaMoHinh, demKhoMoHinh, type ChuoiKho, type DemKho } from '../../../lib/kho/hinhCay'
import { MathText, inp } from '../../kho/ui'
import { MAU_PRESET } from '../TaiLieuBuilder'
import ChuyenDeHinhPrintView from './ChuyenDeHinhPrintView'
import PrintView from '../PrintView'
import GanLopBdm from './GanLopBdm'
import { KhoiCau, type CfgCau } from './BuilderBanDoMoi'
import { AnhMmEditCtx } from '../anhMmCtx'
import type { CauHoi } from '../../../lib/kho/api'
import type { CheDoHinh } from '../../../lib/kho/hinhGiaoTrinh'

const SO_CAU_MAC_DINH = 4   // khớp p_so_luyen / p_so_btvn mặc định của fn_tl_hh_dat_bai

export default function ChuyenDeHinhBuilder({ id, onClose, laGiaoTrinh = false }: { id: string; onClose: () => void; laGiaoTrinh?: boolean }) {
  const NHAN = laGiaoTrinh ? 'Buổi' : 'Phần', nhan = NHAN.toLowerCase()
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
  const [chonHoc, setChonHoc] = useState<CdhPhan | null>(null)                                    // + Bài học (giáo trình)
  const [chonCauHoc, setChonCauHoc] = useState<{ p: CdhPhan; h: HhBai; btvn: boolean } | null>(null)
  const [ganLop, setGanLop] = useState(false)
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
  const themPhan = () => lam(async () => { await addBuoi(id, NHAN); setNd(await cdhNoiDung(id)); markSaved() })
  // ── HỌC (giáo trình): bài học → câu luyện + BTVN. Sau ghi đọc lại ĐÚNG buổi đó (câu mới cần nội dung) ──
  const docLaiBuoi = async (p: CdhPhan) => { const moi = (await cdhNoiDung(id, p.id)).buoi[0]; if (moi) vaPhan(moi) }
  const datBaiHoc = (p: CdhPhan, mas: string[]) => lam(async () => vaPhan(await hhDatBai(id, p.id, mas)))
  const doiChoHoc = (p: CdhPhan, i: number, j: number) => { const ms = (p.hoc ?? []).map((h) => h.ma_bai); if (j < 0 || j >= ms.length) return; [ms[i], ms[j]] = [ms[j], ms[i]]; datBaiHoc(p, ms) }
  const datCauHoc = (p: CdhPhan, phanId: string, mas: string[]) => lam(async () => { await hhDatCau(phanId, mas); await docLaiBuoi(p) })
  const goiYHoc = (p: CdhPhan, phanId: string, n: number) => lam(async () => {
    const ds = await hhGoiY(phanId, n || SO_CAU_MAC_DINH)
    if (!ds.length) { setBao('Bài học này hết câu khác để gợi ý.'); return }
    await hhDatCau(phanId, ds); await docLaiBuoi(p)
  })
  const batLtHoc = (p: CdhPhan, h: HhBai) => lam(async () => {
    await datCoPhan(h.phan_id, { hien_lt: !h.hien_lt })
    vaPhan({ ...p, hoc: (p.hoc ?? []).map((x) => (x.phan_id === h.phan_id ? { ...x, hien_lt: !h.hien_lt } : x)) })
  })   // thêm phần = đổi khung ⇒ đọc lại nền (không xoá màn)
  const xoaPhan = (p: CdhPhan) => { if (!confirm(`Xoá "${p.tieu_de ?? nhan}" (gồm mọi ${laGiaoTrinh ? 'bài học, ' : ''}mô hình và bài đã chọn của ${nhan})?`)) return; lam(async () => { await xoaBuoi(p.id); setNd((x) => (x ? { ...x, buoi: x.buoi.filter((b) => b.id !== p.id) } : x)); markSaved() }) }
  const doiTenPhan = (p: CdhPhan, t: string) => lam(async () => { await updatePhan(p.id, { tieu_de: t }); vaPhan({ ...p, tieu_de: t }) })
  const saveTen = () => { if (nd?.tai_lieu && ten.trim() && ten.trim() !== nd.tai_lieu.ten) lam(async () => { await updateTaiLieu(id, { ten: ten.trim() }); setNd((x) => (x && x.tai_lieu ? { ...x, tai_lieu: { ...x.tai_lieu, ten: ten.trim() } } : x)); markSaved() }) }
  const saveMau = (mau: string) => lam(async () => { const next = { ...ch, mau }; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() })
  // Cấu hình IN theo câu của phần Học — y builder giáo trình bản đồ mới (khoá theo mã câu, lưu cau_hinh)
  const saveCh = (patch: Partial<CauHinh>) => lam(async () => { const next = { ...ch, ...patch }; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() })
  const onAnhMm = (maCau: string, v: { pct: number; mm: number } | null) => {
    const mm = { ...(ch.anhMmByCau ?? {}) }, pct = { ...(ch.anhPctByCau ?? {}) }
    if (v && v.mm > 0) { mm[maCau] = v.mm; pct[maCau] = v.pct } else { delete mm[maCau]; delete pct[maCau] }
    saveCh({ anhMmByCau: mm, anhPctByCau: pct })
  }
  const cfgCau: CfgCau = {
    lines: ch.btvnLinesByCau ?? {}, cols: ch.colByCau ?? {}, cheDo: (ch.hinhCheDoByCau ?? {}) as Record<string, CheDoHinh>,
    onLine: (m, n) => saveCh({ btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [m]: n } }),
    onLineAll: (ms, n) => { const x = { ...(ch.btvnLinesByCau ?? {}) }; ms.forEach((m) => { x[m] = n }); saveCh({ btvnLinesByCau: x }) },
    onCol: (m, n) => saveCh({ colByCau: { ...(ch.colByCau ?? {}), [m]: n } }),
    onCheDo: (m, v) => saveCh({ hinhCheDoByCau: { ...(ch.hinhCheDoByCau ?? {}), [m]: v } }),
  }
  const jump = (pid: string) => document.getElementById('cdh-' + pid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (!nd || !nd.tai_lieu) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const khoi = nd.tai_lieu.khoi

  return (
    <AnhMmEditCtx.Provider value={{ mm: ch.anhMmByCau ?? {}, pct: ch.anhPctByCau ?? {}, set: onAnhMm, baChe: true }}>
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Thư viện</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className={`${inp} h-9 max-w-[420px] flex-1 font-semibold`} placeholder={laGiaoTrinh ? 'Tên giáo trình' : 'Tên chuyên đề'} />
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{laGiaoTrinh ? '🆕 Giáo trình · Hình (Học + Luyện)' : '🆕 Chuyên đề · Hình (Luyện)'}</span>
        <span className="text-[12px] text-slate-400">Khối {khoi}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
        {laGiaoTrinh && <button onClick={() => setGanLop(true)} className="ml-auto whitespace-nowrap rounded-md border border-violet-300 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50" title="Gán giáo trình cho 1 lớp → mỗi buổi thành giáo trình buổi + BTVN bám ngày học">⬇ Gán lớp</button>}
        <button onClick={() => setInAll(true)} className={`${laGiaoTrinh ? '' : 'ml-auto '}whitespace-nowrap rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500`}>🖨 Xem / Xuất PDF</button>
        <label className="flex items-center gap-1.5 text-[12px] text-slate-500">Màu
          <span className="flex gap-1">{MAU_PRESET.map(([c, n]) => (
            <button key={c} title={n} onClick={() => saveMau(c)} className={`h-6 w-6 rounded-full border-2 ${((ch as { mau?: string }).mau ?? '#2D9CDB') === c ? 'border-slate-800' : 'border-white shadow'}`} style={{ background: c }} />
          ))}</span>
        </label>
      </div>
      {bao && <div className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-5 py-2 text-[13px] text-rose-700"><span>⚠ {bao}</span><button onClick={() => setBao(null)} className="ml-auto text-rose-400 hover:text-rose-700">✕</button></div>}

      <div className="grid min-h-0 flex-1 grid-cols-[270px_1fr] overflow-hidden">
        <aside className="min-h-0 overflow-auto border-r border-slate-200 bg-white p-3">
          <div className="mb-2 truncate px-1 text-[13px] font-bold text-slate-700">📚 {ten || (laGiaoTrinh ? 'Giáo trình' : 'Chuyên đề')}</div>
          {nd.buoi.length === 0 && <div className="px-2 py-3 text-[12px] italic text-slate-400">Chưa có {nhan}.</div>}
          {nd.buoi.map((p) => (
            <div key={p.id} className="mb-1">
              <button onClick={() => jump(p.id)} className="block w-full truncate rounded px-2 py-1 text-left text-[13px] font-semibold text-indigo-700 hover:bg-slate-100">📑 {p.tieu_de}</button>
              <div className="ml-2 border-l border-slate-100 pl-1">
                {(p.hoc ?? []).map((h) => (
                  <button key={h.phan_id} onClick={() => jump(h.phan_id)} className="block w-full truncate rounded px-2 py-1 text-left text-[12px] text-sky-700 hover:bg-slate-100">
                    📖 {h.ten ?? h.ma_bai} <span className="text-slate-300">({h.caus.length}+{h.btvn?.caus.length ?? 0})</span>
                  </button>
                ))}
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
            {nd.buoi.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-[13px] text-slate-400">Chưa có {nhan} nào. Bấm “+ Thêm {nhan}” để bắt đầu.</div>}
            {nd.buoi.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white">
                <div id={`cdh-${p.id}`} className="flex scroll-mt-3 items-center gap-2 rounded-t-xl border-b border-slate-100 bg-indigo-50/50 px-4 py-2.5">
                  <span className="text-[14px]">📑</span>
                  <input defaultValue={p.tieu_de ?? ''} onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== p.tieu_de) doiTenPhan(p, v) }}
                    className="w-[220px] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[15px] font-bold text-indigo-800 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white" />
                  <span className="text-[12px] text-slate-400">{laGiaoTrinh ? `${(p.hoc ?? []).length} bài học · ` : ''}{p.mo_hinh.length} mô hình · {p.mo_hinh.reduce((s, m) => s + m.bai.length, 0) + (p.khac?.bai.length ?? 0)} bài</span>
                  <button onClick={() => setXemPhan(p.id)} className="ml-auto shrink-0 whitespace-nowrap rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">👁 Xem {nhan}</button>
                  {laGiaoTrinh && <button onClick={() => setChonHoc(p)} className="shrink-0 whitespace-nowrap rounded-md bg-sky-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-sky-500">+ Bài học</button>}
                  <button onClick={() => setChonMh(p)} className="shrink-0 whitespace-nowrap rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">+ {laGiaoTrinh ? 'Mô hình' : 'Chọn mô hình'}</button>
                  <button onClick={() => xoaPhan(p)} title={`Xoá ${nhan}`} className="rounded border border-slate-200 px-1.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
                </div>
                <div className="space-y-4 p-4">
                  {laGiaoTrinh && (p.hoc ?? []).map((h, i) => (
                    <HocCard key={h.phan_id} h={h} cfg={cfgCau} canUp={i > 0} canDown={i < (p.hoc ?? []).length - 1}
                      onMove={(d) => doiChoHoc(p, i, i + d)} onBo={() => datBaiHoc(p, (p.hoc ?? []).filter((x) => x.phan_id !== h.phan_id).map((x) => x.ma_bai))}
                      onLt={() => batLtHoc(p, h)} onXoaCau={(phanId, mas) => datCauHoc(p, phanId, mas)} onGoiY={(phanId, n) => goiYHoc(p, phanId, n)}
                      onChonCau={(btvn) => setChonCauHoc({ p, h, btvn })} />
                  ))}
                  {laGiaoTrinh && !(p.hoc ?? []).length && !p.mo_hinh.length && !p.khac?.bai.length && <div className="text-[12px] italic text-slate-400">Buổi trống — bấm “+ Bài học” (📖 Học: lý thuyết + bài luyện + BTVN) hoặc “+ Mô hình” (🌿 Luyện).</div>}
                  {!laGiaoTrinh && p.mo_hinh.length === 0 && !p.khac?.bai.length && <div className="text-[12px] italic text-slate-400">Chưa có mô hình — bấm “+ Chọn mô hình”.</div>}
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
                  {/* khối rỗng (bài đã được gán mô hình ở kho, tự chuyển đi — mig 202610221334) thì ẩn */}
                  {!!p.khac?.bai.length && (
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
            <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 py-3 text-[14px] font-medium text-indigo-700 transition hover:bg-indigo-50">+ Thêm {nhan}</button>
          </div>
        </div>
      </div>

      {chonMh && <ChonMoHinh khoi={khoi} daChon={chonMh.mo_hinh.map((m) => m.id!).filter(Boolean)} onClose={() => setChonMh(null)}
        onConfirm={async (ids) => { const p = chonMh; setChonMh(null); await datMoHinh(p, ids) }} />}
      {chonBai && chonBai.mh.id && <ChonBai moHinhId={chonBai.mh.id} ten={chonBai.mh.ten ?? ''} daChon={chonBai.mh.bai.map((b) => b.ma_bai)}
        khoa={chonBai.phan.mo_hinh.filter((m) => m.phan_id !== chonBai.mh.phan_id).flatMap((m) => m.bai.map((b) => b.ma_bai))}
        onClose={() => setChonBai(null)} onConfirm={async (mas) => { const x = chonBai; setChonBai(null); await datBai(x.phan, x.mh, mas) }} />}
      {inAll && (laGiaoTrinh ? <PrintView id={id} onClose={() => setInAll(false)} /> : <ChuyenDeHinhPrintView id={id} onClose={() => setInAll(false)} />)}
      {xemPhan && (laGiaoTrinh ? <PrintView id={id} onlyBuoiId={xemPhan} onClose={() => setXemPhan(null)} /> : <ChuyenDeHinhPrintView id={id} onlyPhanId={xemPhan} onClose={() => setXemPhan(null)} />)}
      {chonHoc && <ChonBaiHoc khoi={khoi} daChon={(chonHoc.hoc ?? []).map((h) => h.ma_bai)} onClose={() => setChonHoc(null)}
        onConfirm={async (mas) => { const p = chonHoc; setChonHoc(null); await datBaiHoc(p, mas) }} />}
      {chonCauHoc && (() => {
        const { p, h, btvn } = chonCauHoc
        const phanId = btvn ? h.btvn?.phan_id : h.phan_id
        if (!phanId) return null
        const cua = (btvn ? h.btvn?.caus : h.caus) ?? []
        // câu đang ở phần KHÁC của buổi (luyện/BTVN bài khác, hoặc nửa kia của chính bài này) ⇒ khoá, DB cũng chặn
        const khoa = (p.hoc ?? []).flatMap((x) => [...(x.phan_id === h.phan_id && !btvn ? [] : x.caus), ...(x.phan_id === h.phan_id && btvn ? [] : x.btvn?.caus ?? [])]).map((c) => c.ma_cau)
        return <ChonCauHoc maBai={h.ma_bai} ten={`${h.ten ?? h.ma_bai} · ${btvn ? 'BTVN' : 'Bài luyện'}`} daChon={cua.map((c) => c.ma_cau)} khoa={khoa}
          onClose={() => setChonCauHoc(null)} onConfirm={async (mas) => { setChonCauHoc(null); await datCauHoc(p, phanId, mas) }} />
      })()}
      {ganLop && <GanLopBdm hinh masterId={id} khoi={khoi} tl={{ mon: nd.tai_lieu.mon, nhanh: nd.tai_lieu.nhanh, cau_hinh: ch }} onClose={() => setGanLop(false)} />}
    </div>
    </AnhMmEditCtx.Provider>
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

// ── HỌC (giáo trình Hình): 1 bài học trong buổi — lý thuyết (bật/tắt in) · bài luyện · BTVN ──
function HocCard({ h, cfg, canUp, canDown, onMove, onBo, onLt, onXoaCau, onGoiY, onChonCau }: {
  h: HhBai; cfg: CfgCau; canUp: boolean; canDown: boolean; onMove: (d: number) => void; onBo: () => void; onLt: () => void
  onXoaCau: (phanId: string, mas: string[]) => void; onGoiY: (phanId: string, n: number) => void; onChonCau: (btvn: boolean) => void
}) {
  // câu Học (hinh_hoc_cau_hoi) ⇒ khối câu chung của builder giáo trình (KhoiCau) — cùng control: dòng, 2 cột, chế độ hình, cỡ ảnh
  const cauMap = new Map<string, CauHoi>([...h.caus, ...(h.btvn?.caus ?? [])].map((x) => [x.ma_cau, x as unknown as CauHoi]))
  const tong = (so: Record<string, number>) => Object.values(so).reduce((a, b) => a + b, 0)   // ô số người gõ (UI)
  return (
    <div id={`cdh-${h.phan_id}`} className="scroll-mt-3 overflow-hidden rounded-xl border border-sky-200">
      <div className="flex items-center gap-2 bg-sky-600 px-3 py-2 text-white">
        <span className="flex shrink-0 flex-col leading-none" title="Đổi thứ tự bài học">
          <button onClick={() => onMove(-1)} disabled={!canUp} className="text-[10px] text-white/70 hover:text-white disabled:opacity-25">▲</button>
          <button onClick={() => onMove(1)} disabled={!canDown} className="text-[10px] text-white/70 hover:text-white disabled:opacity-25">▼</button>
        </span>
        <span className="text-[12px] font-semibold text-white/80">📖 Học</span>
        <span className="text-[14px] font-semibold">{h.ten ?? <i className="font-normal opacity-80">(bài học đã xoá khỏi kho)</i>}</span>
        <span className="font-mono text-[10.5px] text-white/70">{h.ma_bai}</span>
        <label className="ml-auto flex items-center gap-1 text-[11.5px] text-white/90" title={h.co_ly_thuyet ? 'In lý thuyết của bài học' : 'Bài học chưa có lý thuyết'}>
          <input type="checkbox" checked={h.hien_lt} disabled={!h.co_ly_thuyet} onChange={onLt} /> Lý thuyết{!h.co_ly_thuyet && ' (chưa có)'}
        </label>
        <button onClick={onBo} title="Bỏ bài học khỏi buổi (mất cả bài luyện + BTVN đã chọn)" className="shrink-0 text-[12px] text-white/70 hover:text-white">✕</button>
      </div>
      <div className="bg-white">
        <KhoiCau tieuDe="📘 Bài luyện" mau="sky" caus={h.caus.map((x) => x.ma_cau)} cauMap={cauMap} cfg={cfg} chiXem={false}
          soMacDinh={{ tu_luan: Math.max(h.caus.length, SO_CAU_MAC_DINH) }}
          onXoa={(m) => onXoaCau(h.phan_id, h.caus.filter((x) => x.ma_cau !== m).map((x) => x.ma_cau))}
          onGoiY={(so) => onGoiY(h.phan_id, tong(so))} onChonCau={() => onChonCau(false)} />
        {h.btvn && (
          <div className="border-t border-orange-100 bg-orange-50/30">
            <KhoiCau tieuDe="🏠 BTVN" mau="orange" caus={h.btvn.caus.map((x) => x.ma_cau)} cauMap={cauMap} cfg={cfg} chiXem={false} btvn
              soMacDinh={{ tu_luan: Math.max(h.btvn.caus.length, SO_CAU_MAC_DINH) }}
              onXoa={(m) => onXoaCau(h.btvn!.phan_id, h.btvn!.caus.filter((x) => x.ma_cau !== m).map((x) => x.ma_cau))}
              onGoiY={(so) => onGoiY(h.btvn!.phan_id, tong(so))} onChonCau={() => onChonCau(true)} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Bộ chọn bài học: bài học Hình của khối theo chủ đề (thứ tự bấm = thứ tự trong buổi) ──
export function ChonBaiHoc({ khoi, daChon, onClose, onConfirm, ghiChu }: { khoi: string; daChon: string[]; onClose: () => void; onConfirm: (mas: string[]) => void; ghiChu?: string }) {
  const [ds, setDs] = useState<HhChonBai[] | null>(null)
  const [chon, setChon] = useState<string[]>(daChon)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { hhCayChon(khoi).then(setDs).catch((e) => setErr(loiDoc(e))) }, [khoi])
  const bat = (ma: string) => setChon((s) => (s.includes(ma) ? s.filter((x) => x !== ma) : [...s, ma]))
  const nhom = useMemo(() => {
    const m = new Map<string, { ten: string; bai: HhChonBai[] }>()
    for (const b of ds ?? []) { const k = b.chu_de_id ?? ''; const g = m.get(k) ?? { ten: b.chu_de ?? 'Chưa xếp chủ đề', bai: [] }; g.bai.push(b); m.set(k, g) }
    return [...m.values()]
  }, [ds])
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-10 inset-y-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn bài học Hình · Khối {khoi}</h3>
          <span className="text-[12px] text-slate-400">{ghiChu ?? `thứ tự bấm = thứ tự trong buổi · bài mới tự gợi ý ${SO_CAU_MAC_DINH} câu luyện + ${SO_CAU_MAC_DINH} câu BTVN`}</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {err ? <p className="text-sm text-rose-600">{err}</p> : !ds ? <p className="text-sm text-slate-400">Đang tải…</p>
            : ds.length === 0 ? <p className="text-sm text-slate-400">Khối {khoi} chưa có bài học Hình.</p>
            : nhom.map((g) => (
              <div key={g.ten} className="mb-5">
                <div className="mb-2 text-[14px] font-bold text-slate-800">{g.ten}</div>
                <div className="grid gap-1.5 md:grid-cols-2">
                  {g.bai.map((b) => {
                    const on = chon.includes(b.ma_bai)
                    return (
                      <button key={b.ma_bai} onClick={() => bat(b.ma_bai)} className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-[13px] ${on ? 'border-sky-500 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'}`}>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${on ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{on ? chon.indexOf(b.ma_bai) + 1 : ''}</span>
                        <span className="font-mono text-[11px] text-slate-400">{b.ma_bai}</span>
                        <span className="min-w-0 flex-1 truncate">{b.ten}</span>
                        {b.co_ly_thuyet && <span className="shrink-0 text-[10.5px] text-emerald-600">✓LT</span>}
                        <span className={`shrink-0 text-[11px] ${b.so_cau ? 'text-slate-400' : 'text-amber-600'}`}>{b.so_cau} câu</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3">
          <span className="text-[12px] text-slate-500">Đã chọn {chon.length} bài học</span>
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onConfirm(chon)} className="rounded-md bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500">Dùng {chon.length} bài học</button>
        </div>
      </div>
    </div>
  )
}

// ── Chọn câu của 1 bài học cho khối Bài luyện / BTVN (câu đã chọn giữ thứ tự, câu mới thêm cuối; câu đang ở phần khác của buổi bị khoá) ──
export function ChonCauHoc({ maBai, ten, daChon, khoa, onClose, onConfirm }: { maBai: string; ten: string; daChon: string[]; khoa: string[]; onClose: () => void; onConfirm: (mas: string[]) => void }) {
  const [kho, setKho] = useState<HhCauKho[] | null>(null)
  const [chon, setChon] = useState<string[]>(daChon)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { hhCau(maBai).then(setKho).catch((e) => setErr(loiDoc(e))) }, [maBai])
  const bat = (ma: string) => setChon((s) => (s.includes(ma) ? s.filter((x) => x !== ma) : [...s, ma]))
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-16 inset-y-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn câu · {ten}</h3>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-auto px-6 py-4">
          {err ? <p className="text-sm text-rose-600">{err}</p> : !kho ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : kho.length === 0 ? <p className="text-sm text-slate-400">Bài học này chưa có câu kho chuẩn.</p>
            : kho.map((c) => {
              const on = chon.includes(c.ma_cau), khoaC = khoa.includes(c.ma_cau)
              return (
                <button key={c.ma_cau} disabled={khoaC} onClick={() => bat(c.ma_cau)} title={khoaC ? 'Câu đã dùng ở phần khác trong cùng buổi' : undefined}
                  className={`block w-full rounded-lg border p-2.5 text-left disabled:opacity-40 ${on ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-300'}`}>
                  <div className="mb-1 flex items-center gap-2 text-[11px]">
                    <span className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${on ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{on ? chon.indexOf(c.ma_cau) + 1 : ''}</span>
                    <span className="font-mono text-slate-500">{c.ma_cau}</span>
                    {!c.la_goc && <span className="rounded bg-slate-100 px-1.5 text-slate-500">bản sao</span>}
                    <span className="text-slate-400">đã dùng {c.so_lan_dung} lần</span>
                  </div>
                  <div className="line-clamp-3 text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
                  {c.anh_de && <img src={c.anh_de} alt="" className="mt-1 max-h-24 rounded border border-slate-200" />}
                </button>
              )
            })}
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 px-6 py-3">
          <span className="text-[12px] text-slate-500">Đã chọn {chon.length} câu</span>
          <button onClick={onClose} className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onConfirm(chon)} className="rounded-md bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500">Dùng {chon.length} câu</button>
        </div>
      </div>
    </div>
  )
}
