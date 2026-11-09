// BUILDER CHUYÊN ĐỀ HÌNH (Thùy 21/10: chuyên đề nhánh Hình lấy từ Hình–Luyện — mô hình · kho bài). Khung như builder giáo trình bản đồ mới:
// thanh trên (tên · tự lưu · Xem/Xuất PDF · màu) · cây trái (Phần → mô hình → số bài) · thẻ Phần → thẻ mô hình → bài (trọn ý).
// Không đi với lớp nào (không Gán lớp). Mọi ghi qua RPC (lib/chuyenDeHinh.ts); sau thao tác VÁ đúng phần, không tải lại cả tài liệu.
// ⭐ laGiaoTrinh (Thùy 27/10 — giáo trình Hình bản đồ mới, mig 202610271757): CÙNG builder, đơn vị "Buổi", mỗi buổi thêm phần HỌC
// (bài học → lý thuyết + bài luyện + BTVN) trước phần LUYỆN (mô hình); có Gán lớp; in bằng PrintView chung (Học + Luyện).
import { useEffect, useMemo, useState } from 'react'
import { addBuoi, updatePhan, updateTaiLieu, anhPhaiCua, DEFAULT_BTVN_LINES, type CauHinh } from '../../../lib/tailieu'
import { xoaBuoi, loiDoc, datCoPhan } from '../../../lib/tailieuBdm'
import { cdhNoiDung, cdhDatMoHinh, cdhDatBai, cdhDatBtvn, cdhCayChon, hhCayChon, hhCau, hhCauLop, hhDatBai, hhDatCau, hhGoiY, type CdhNoiDung, type CdhPhan, type CdhMoHinh, type CdhBai, type CdhChonMoHinh, type CdhChonNhom, type CdhChonChuDe, type HhBai, type HhChonBai, type HhCauKho } from '../../../lib/chuyenDeHinh'
import { khoCuaMoHinh, demKhoMoHinh, type ChuoiKho, type DemKho } from '../../../lib/kho/hinhCay'
import { MathText, inp } from '../../kho/ui'
import { MAU_PRESET, AnhMmCtl, AnhXem, CheDoHinhBtn } from '../TaiLieuBuilder'
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
  const [chonBtvn, setChonBtvn] = useState<{ phan: CdhPhan; mh: CdhMoHinh } | null>(null)   // chọn bài BTVN của 1 mô hình (giáo trình)
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
  // BTVN Luyện (Thùy 08/11): ghi rồi đọc lại ĐÚNG buổi đó (bài mới cần nội dung)
  const datBtvn = (p: CdhPhan, moHinhId: string, mas: string[]) => lam(async () => {
    await cdhDatBtvn(id, p.id, moHinhId, mas)
    const moi = (await cdhNoiDung(id, p.id)).buoi[0]
    if (moi) vaPhan(moi)
  })
  // mọi bài Hình–Luyện đang dùng trong buổi (trên lớp + về nhà) — khoá ở popup chọn, DB cũng chặn
  const baiCuaBuoi = (p: CdhPhan) => [...p.mo_hinh.flatMap((m) => m.bai.map((b) => b.ma_bai)), ...(p.btvn_luyen ?? []).flatMap((v) => v.bai.map((b) => b.ma_bai))]
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
    <AnhMmEditCtx.Provider value={{ mm: ch.anhMmByCau ?? {}, pct: ch.anhPctByCau ?? {}, set: onAnhMm, baChe: true, phai: anhPhaiCua(ch, nd.tai_lieu.nhanh), setPhai: (m, v) => saveCh({ anhPhaiByCau: { ...(ch.anhPhaiByCau ?? {}), [m]: v } }) }}>
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
                        {/* Thùy 08/11: giáo trình từng bị đổ sẵn cả kho bài khi thêm mô hình (mig 202611081556 đã thôi) — bỏ hết 1 lần rồi chọn lại.
                            Chỉ gỡ bài khỏi tài liệu này, bài trong kho giữ nguyên. */}
                        {m.bai.length > 0 && (
                          <button onClick={() => { if (window.confirm(`Bỏ cả ${m.bai.length} bài khỏi mô hình ${m.ma ?? ''} trong tài liệu này? (Bài trong kho giữ nguyên.)`)) datBai(p, m, []) }}
                            title="Bỏ hết bài khỏi mô hình này (chỉ trong tài liệu này — kho không đổi)" className="shrink-0 rounded-md border border-white/40 px-2 py-1 text-[11px] font-medium text-white/90 hover:bg-white/10">Bỏ hết bài</button>
                        )}
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
                            <BaiLuyenXem b={b} cfg={laGiaoTrinh ? cfgCau : null} />
                          </li>
                        ))}
                      </ol>
                      {laGiaoTrinh && m.id && (() => {
                        // 📝 BTVN của mô hình (Thùy 08/11 — buổi chỉ có Luyện từng in phiếu BTVN trắng): bài kho về nhà, khung như khối BTVN của Học
                        const bv = (p.btvn_luyen ?? []).find((x) => x.mo_hinh_id === m.id)
                        const ds = bv?.bai ?? []
                        const ms = ds.map((x) => x.ma_bai)
                        const dich = (j: number, k: number) => { if (k < 0 || k >= ms.length) return; const a = [...ms]; [a[j], a[k]] = [a[k], a[j]]; datBtvn(p, m.id!, a) }
                        return (
                          <div className="border-t border-orange-100 bg-orange-50/40 p-3">
                            <div className="flex flex-wrap items-center gap-2 text-[12px]">
                              <span className="font-semibold text-orange-600">📝 BTVN — về nhà</span>
                              <span className="text-slate-400">{ds.length} bài</span>
                              <button onClick={() => setChonBtvn({ phan: p, mh: m })} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 font-medium text-slate-600 hover:border-orange-400">✎ Chọn bài BTVN</button>
                              {ds.length > 0 && <button onClick={() => { if (window.confirm(`Bỏ cả ${ds.length} bài BTVN của mô hình ${m.ma ?? ''}? (Bài trong kho giữ nguyên.)`)) datBtvn(p, m.id!, []) }} className="text-slate-400 hover:text-rose-600">Bỏ hết</button>}
                            </div>
                            {ds.length === 0
                              ? <div className="mt-1.5 text-[12px] italic text-slate-400">Chưa có bài về nhà — bấm “✎ Chọn bài BTVN”. Buổi không có câu/bài BTVN nào thì gán lớp không tạo phiếu BTVN.</div>
                              : <ol className="mt-2 space-y-1.5">
                                {ds.map((b, j) => (
                                  <li key={b.ma_bai} className="rounded-md border border-slate-100 bg-white/80 px-2.5 py-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[12px] font-bold text-slate-400">{j + 1}.</span>
                                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{b.ma_bai}</span>
                                      <span className="text-[11px] text-slate-400">{b.y.length} ý</span>
                                      {!b.con_trong_kho && <span className="rounded bg-amber-50 px-1.5 text-[10px] font-medium text-amber-700">không còn trong kho</span>}
                                      <span className="ml-auto flex items-center gap-1">
                                        <button onClick={() => dich(j, j - 1)} disabled={j === 0} className="rounded border border-slate-200 px-1.5 text-[11px] text-slate-500 disabled:opacity-30">↑</button>
                                        <button onClick={() => dich(j, j + 1)} disabled={j === ds.length - 1} className="rounded border border-slate-200 px-1.5 text-[11px] text-slate-500 disabled:opacity-30">↓</button>
                                        <button onClick={() => datBtvn(p, m.id!, ms.filter((x) => x !== b.ma_bai))} className="text-[12px] text-slate-400 hover:text-rose-600">✕</button>
                                      </span>
                                    </div>
                                    <BaiLuyenXem b={b} cfg={cfgCau} dongMacDinh={DEFAULT_BTVN_LINES} />
                                  </li>
                                ))}
                              </ol>}
                          </div>
                        )
                      })()}
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
                            <BaiLuyenXem b={b} cfg={laGiaoTrinh ? cfgCau : null} />
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
        khoa={baiCuaBuoi(chonBai.phan).filter((ma) => !chonBai.mh.bai.some((b) => b.ma_bai === ma))}
        onClose={() => setChonBai(null)} onConfirm={async (mas) => { const x = chonBai; setChonBai(null); await datBai(x.phan, x.mh, mas) }} />}
      {chonBtvn && chonBtvn.mh.id && (() => {
        const cu = ((chonBtvn.phan.btvn_luyen ?? []).find((x) => x.mo_hinh_id === chonBtvn.mh.id)?.bai ?? []).map((b) => b.ma_bai)
        return <ChonBai moHinhId={chonBtvn.mh.id} ten={`${chonBtvn.mh.ten ?? ''} · BTVN`} daChon={cu}
          khoa={baiCuaBuoi(chonBtvn.phan).filter((ma) => !cu.includes(ma))}
          onClose={() => setChonBtvn(null)} onConfirm={async (mas) => { const x = chonBtvn; setChonBtvn(null); await datBtvn(x.phan, x.mh.id!, mas) }} />
      })()}
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
          coKhoLop macDinh={btvn ? 'luyen' : 'lop'}
          onClose={() => setChonCauHoc(null)} onConfirm={async (mas) => { setChonCauHoc(null); await datCauHoc(p, phanId, mas) }} />
      })()}
      {ganLop && <GanLopBdm hinh masterId={id} khoi={khoi} tl={{ mon: nd.tai_lieu.mon, nhanh: nd.tai_lieu.nhanh, cau_hinh: ch }} onClose={() => setGanLop(false)} />}
    </div>
    </AnhMmEditCtx.Provider>
  )
}

// ── Bộ chọn mô hình: chủ đề Hình–Luyện → mô hình (kèm số bài trong kho). Thứ tự chọn = thứ tự trong phần. ──
// 09/11 (spec-hinh-cay-nhanh §13.6 bước 1): bỏ tầng nhóm mô hình khỏi màn — mô hình xếp thẳng dưới chủ đề.
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
    for (const mh of cay?.moHinh ?? []) { const k = mh.chu_de_id ?? ''; m.set(k, [...(m.get(k) ?? []), mh]) }
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
                <div className="grid gap-1 md:grid-cols-2">
                  {(nhomCua.get(cd.id) ?? []).map(theMh)}
                  {!(nhomCua.get(cd.id) ?? []).length && <div className="text-[12px] italic text-slate-300">chưa có mô hình</div>}
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
  // Thùy 08/11 "preview lúc chọn bài hiện cả hình và full câu hỏi": thẻ = đúng thẻ "Bài trong kho" của ChonYTuCay (ET/MT) —
  // hình trái, đề + MỌI ý; ô tìm theo mã / nguồn / đề (lọc hiển thị thuần, không đụng dữ liệu).
  const [tim, setTim] = useState('')
  const q = tim.trim().toLowerCase()
  const hien = (kho ?? []).filter((b) => !q || [b.ma_bai, b.nguon ?? '', b.gia_thiet_chung ?? '', ...b.y.map((y) => y.noi_dung)].join(' ').toLowerCase().includes(q))
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-16 inset-y-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn bài · {ten}</h3>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          {err ? <p className="text-sm text-rose-600">{err}</p> : !kho ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : kho.length === 0 ? <p className="text-sm text-slate-400">Mô hình này chưa có bài trong kho.</p>
            : <>
              <div className="mb-3 flex items-center gap-3">
                <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm trong kho (mã, nguồn, đề)…"
                  className="h-8 w-72 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-teal-400" />
                <span className="text-[12px] text-slate-400">{hien.length}/{kho.length} bài</span>
              </div>
              <div className="space-y-3">
                {hien.map((b) => {
                  const on = chon.includes(b.ma_bai), khoaB = khoa.includes(b.ma_bai)
                  return (
                    <div key={b.id} role="button" tabIndex={khoaB ? -1 : 0} onClick={() => { if (!khoaB) bat(b.ma_bai) }} onKeyDown={(e) => { if (!khoaB && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); bat(b.ma_bai) } }}
                      title={khoaB ? 'Bài đã dùng ở mô hình khác trong cùng phần' : undefined}
                      className={`flex gap-4 rounded-xl border p-3.5 text-left ${khoaB ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} ${on ? 'border-teal-500 bg-teal-50/60 shadow-sm' : 'border-slate-200 hover:border-teal-300'}`}>
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-[12px] font-bold ${on ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white text-slate-300'}`}>{on ? chon.indexOf(b.ma_bai) + 1 : ''}</span>
                      {b.anh_de
                        ? <img src={b.anh_de} alt="" className="h-36 w-48 shrink-0 self-start rounded-lg border border-slate-200 bg-white object-contain" />
                        : <div className="flex h-36 w-48 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-300">chưa có hình</div>}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-x-3 text-[12px]">
                          <span className="font-mono font-semibold text-teal-700">{b.ma_bai}</span>
                          <span className="text-slate-500">{b.nguon ?? 'chưa rõ nguồn'}</span>
                          {!b.gan_ca_bai && <span className="rounded bg-slate-100 px-1.5 text-slate-500">ý gán vào bài của mô hình</span>}
                          <span className="ml-auto font-medium text-slate-500">{b.y.length} ý</span>
                        </div>
                        {b.gia_thiet_chung && <div className="text-[13.5px] leading-relaxed text-slate-800"><MathText>{b.gia_thiet_chung}</MathText></div>}
                        {b.y.map((y) => (
                          <div key={y.id} className="flex gap-2 text-[13px] leading-relaxed text-slate-700">
                            <b className="shrink-0 text-violet-700">{y.nhan ? `${y.nhan})` : '•'}</b>
                            <div className="min-w-0 flex-1"><MathText>{y.noi_dung}</MathText></div>
                          </div>))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>}
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

// ── 1 bài Hình–Luyện trong builder (Thùy 08/11 "builder chuẩn như bên kia"): ĐỦ đề + mọi ý + hình (không cắt 3 dòng) và —
//   giáo trình — cùng bộ điều khiển câu Học (KhoiCau): dòng kẻ sau cả bài · chế độ hình · cỡ ảnh / hình phải. Khoá = mã gốc bài
//   (btvnLinesByCau / hinhCheDoByCau / anhMmByCau của tài liệu); in đọc ở BaiHinhIn. Chuyên đề (cfg null): chỉ xem.
function BaiLuyenXem({ b, cfg, dongMacDinh = 0 }: { b: CdhBai; cfg: CfgCau | null; dongMacDinh?: number }) {
  const motY = !b.gia_thiet_chung?.trim() && b.y.length === 1
  const anh = motY ? (b.y[0]?.anh_de ?? b.anh_de) : b.anh_de
  const cd = cfg?.cheDo[b.ma_bai] ?? 'hien'
  return (
    <>
      {cfg && (
        <div className="mt-1 flex flex-wrap items-center justify-end gap-2">
          <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết, in sau cả bài (bản HS)">dòng
            <input type="number" min={0} max={50} value={cfg.lines[b.ma_bai] ?? dongMacDinh} onChange={(e) => cfg.onLine(b.ma_bai, Math.max(0, Math.min(50, +e.target.value || 0)))}
              className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
          </label>
          {anh && <CheDoHinhBtn cur={cd} onChange={(v) => cfg.onCheDo(b.ma_bai, v)} />}
          {anh && cd !== 'khong' && <AnhMmCtl ma={b.ma_bai} url={anh} />}
        </div>
      )}
      <div className="mt-1.5 flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-1 text-[13px] leading-relaxed text-slate-700">
          {!motY && <div className="text-slate-800"><MathText>{b.gia_thiet_chung ?? ''}</MathText></div>}
          {b.y.map((y, i) => (
            <div key={i} className="flex gap-2">
              {!motY && <b className="shrink-0 text-violet-700">{y.nhan ? `${y.nhan})` : '•'}</b>}
              <div className="min-w-0 flex-1"><MathText>{[y.gia_thiet_them, y.noi_dung].filter((x) => x && x.trim()).join('\n')}</MathText></div>
            </div>
          ))}
        </div>
        {anh && <div className="shrink-0"><AnhXem ma={b.ma_bai} url={anh} cheDo={cd} /></div>}
      </div>
    </>
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

// Gom các ý cùng bài (bai_y) thành 1 nhóm, đứng ở chỗ ý đầu tiên; câu thường = nhóm 1 phần tử. Chỉ gom HIỂN THỊ.
function gomTheoBai<T extends { ma_cau: string; bai_y?: string | null }>(ds: T[]): T[][] {
  const out: T[][] = [], cua = new Map<string, T[]>()
  for (const c of ds) {
    if (!c.bai_y) { out.push([c]); continue }
    const g = cua.get(c.bai_y)
    if (g) g.push(c); else { const m = [c]; cua.set(c.bai_y, m); out.push(m) }
  }
  return out
}

// ── Chọn câu của 1 bài học cho khối Bài luyện / BTVN (câu đã chọn giữ thứ tự, câu mới thêm cuối; câu đang ở phần khác của buổi bị khoá) ──
// 2 NGUỒN như giáo trình Đại (ChonCauBdm): 🏫 Kho trên lớp · 📚 Kho luyện — chọn trộn, 1 danh sách. `coKhoLop` = false (ET: bài ĐO) ⇒ chỉ kho luyện.
export function ChonCauHoc({ maBai, ten, daChon, khoa, coKhoLop = false, macDinh = 'lop', onClose, onConfirm }: {
  maBai: string; ten: string; daChon: string[]; khoa: string[]; coKhoLop?: boolean; macDinh?: 'lop' | 'luyen'; onClose: () => void; onConfirm: (mas: string[]) => void
}) {
  type CauChon = HhCauKho & { vai?: 'giang' | 'luyen' }   // vai chỉ có ở câu kho trên lớp
  const [luyen, setLuyen] = useState<CauChon[] | null>(null)
  const [lop, setLop] = useState<CauChon[] | null>(coKhoLop ? null : [])
  const [nguon, setNguon] = useState<'lop' | 'luyen'>(coKhoLop ? macDinh : 'luyen')
  const [chon, setChon] = useState<string[]>(daChon)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    hhCau(maBai).then(setLuyen).catch((e) => setErr(loiDoc(e)))
    if (coKhoLop) hhCauLop(maBai).then((l) => { setLop(l.map((x) => ({ ...x, la_goc: true }))); if (!l.length) setNguon('luyen') }).catch((e) => setErr(loiDoc(e)))
  }, [maBai, coKhoLop])
  const kho = nguon === 'lop' ? lop : luyen
  const bat = (ma: string) => setChon((s) => (s.includes(ma) ? s.filter((x) => x !== ma) : [...s, ma]))
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-16 inset-y-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn câu · {ten}</h3>
          {coKhoLop && <div className="ml-3 flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {([['lop', '🏫 Kho trên lớp', lop], ['luyen', '📚 Kho luyện tập', luyen]] as const).map(([k, nhan, ds]) => (
              <button key={k} onClick={() => setNguon(k)} className={`rounded-md px-3 py-1 text-[12.5px] font-medium ${nguon === k ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                {nhan} <span className="text-[11px] text-slate-400">{ds ? ds.length : '…'}</span>
              </button>
            ))}
          </div>}
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-auto px-6 py-4">
          {err ? <p className="text-sm text-rose-600">{err}</p> : !kho ? <p className="text-sm text-slate-400">Đang tải kho…</p>
            : kho.length === 0 ? <p className="text-sm text-slate-400">{nguon === 'lop' ? 'Bài học này chưa có câu ở kho trên lớp — soạn ở Bản đồ mới › Hình – Học › 🏫 Kho trên lớp.' : 'Bài học này chưa có câu kho chuẩn.'}</p>
            : gomTheoBai(kho).map((g) => {
              // Bài nhiều ý (Thùy 09/11): 1 THẺ = đề bài + hình 1 lần, mỗi ý 1 dòng chọn riêng (hệ vẫn hiểu là n câu, chấm từng ý)
              if (g[0].bai_y) {
                const dau = g[0], so = (m: string) => chon.indexOf(m) + 1
                const moTat = g.filter((y) => !khoa.includes(y.ma_cau))
                const du = moTat.length > 0 && moTat.every((y) => chon.includes(y.ma_cau))
                const chonBai = () => setChon((s) => du ? s.filter((m) => !moTat.some((y) => y.ma_cau === m)) : [...s, ...moTat.map((y) => y.ma_cau).filter((m) => !s.includes(m))])
                return (
                  <div key={dau.bai_y!} className={`rounded-lg border p-3 ${g.some((y) => chon.includes(y.ma_cau)) ? 'border-sky-400' : 'border-slate-200'}`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="font-mono font-semibold text-teal-700">{dau.bai_y}</span>
                      <span className="text-slate-400">bài {g.length} ý · chọn từng ý</span>
                      <button onClick={chonBai} disabled={!moTat.length} className="ml-auto rounded border border-sky-300 px-2 py-0.5 font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-40">{du ? 'Bỏ cả bài' : 'Chọn cả bài'}</button>
                    </div>
                    <div className="flex gap-4 max-md:flex-col">
                      {dau.anh_de && <img src={dau.anh_de} alt="" className="h-40 w-52 shrink-0 self-start rounded border border-slate-200 bg-white object-contain max-md:w-full" />}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="rounded-md bg-teal-600 px-3 py-2 text-[13.5px] leading-relaxed text-white"><MathText>{dau.loi_dan ?? ''}</MathText></div>
                        {g.map((y) => {
                          const on = chon.includes(y.ma_cau), khoaY = khoa.includes(y.ma_cau)
                          return (
                            <button key={y.ma_cau} disabled={khoaY} onClick={() => bat(y.ma_cau)} title={khoaY ? 'Ý này đã dùng ở phần khác trong cùng buổi' : undefined}
                              className={`flex w-full items-start gap-2 rounded-md border px-2.5 py-1.5 text-left disabled:opacity-40 ${on ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-300'}`}>
                              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${on ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{on ? so(y.ma_cau) : ''}</span>
                              <b className="shrink-0 text-[13.5px] text-violet-700">{y.nhan_y})</b>
                              <div className="min-w-0 flex-1 text-[13.5px] text-slate-700">
                                {y.da_biet && <div className="italic text-slate-500"><MathText>{y.da_biet}</MathText></div>}
                                <MathText>{y.cau_hoi_y ?? ''}</MathText>
                              </div>
                              <span className="shrink-0 text-[10.5px] text-slate-400">{y.ma_cau} · dùng {y.so_lan_dung}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              }
              const c = g[0]
              const on = chon.includes(c.ma_cau), khoaC = khoa.includes(c.ma_cau)
              return (
                <button key={c.ma_cau} disabled={khoaC} onClick={() => bat(c.ma_cau)} title={khoaC ? 'Câu đã dùng ở phần khác trong cùng buổi' : undefined}
                  className={`block w-full rounded-lg border p-2.5 text-left disabled:opacity-40 ${on ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-300'}`}>
                  <div className="mb-1 flex items-center gap-2 text-[11px]">
                    <span className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${on ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{on ? chon.indexOf(c.ma_cau) + 1 : ''}</span>
                    <span className="font-mono text-slate-500">{c.ma_cau}</span>
                    {!c.la_goc && <span className="rounded bg-slate-100 px-1.5 text-slate-500">bản sao</span>}
                    {c.vai && <span className="rounded bg-teal-50 px-1.5 text-teal-700">{c.vai === 'giang' ? '🎓 Bài giảng' : '✏️ Luyện trên lớp'}</span>}
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
