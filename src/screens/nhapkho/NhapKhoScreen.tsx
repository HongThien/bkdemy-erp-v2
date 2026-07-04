// Nhập kho (ingest-first, scope = CHỦ ĐỀ): 1 file → bóc mọi loại → gán dạng → verify → đẩy kho.
// 1 người làm full luồng 1 phiên → giữ ở client-state (KHÔNG draft table). Duyệt TỪNG câu chiếm màn.
// Hiển thị PREVIEW-FIRST (render công thức); bấm ✎ Sửa mới ra code LaTeX.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { fileToCanvases, canvasToJpegBase64, cropCanvasBox } from '../../lib/pdfRender'
import { MathText, inp, readClipboardImageFile } from '../kho/ui'
import { CauEditor, type ReviewItem } from '../kho/DangHub'
import {
  KHOI_OPTIONS, DEFAULT_KHOI,
  khoTbls, listChuDeOptions, listDangByChuDe, getDangLyThuyet,
  buildKhoIngestPrompt, parseKhoIngestJson, INGEST_KHO_SCHEMA, callGeminiRich,
  classifyDang, verifyDangByLyThuyet, aiGiaiCau,
  saveCauToDang, createCauDungSai, uploadKhoImage, logKhoTag, khoTagPrecision,
  type KhoMon, type ChuDeOption, type DangCandidate, type LoaiCau, type MenhDe,
} from '../../lib/kho/api'
import DeThiScreen from '../tailieu/DeThiScreen'

// Nhập kho = 2 LUỒNG cùng chiều (đổ nội dung VÀO kho), khác cấu trúc nguồn:
//  · Nhập chuyên đề — 1 file cùng chủ đề (AI gợi ý dạng, verify low-conf).
//  · Nhập đề thi    — đề thật giữ tổ hợp gốc (bóc câu người tự gán dạng, xem DeThiScreen).
// (Đề thi KHÔNG ở "Làm tài liệu" — đó là chỗ soạn TỪ kho có sẵn, ngược chiều với ingest.)
export default function NhapKhoScreen() {
  const [mode, setMode] = useState<'chuyen_de' | 'de_thi'>('chuyen_de')
  const tab = (on: boolean) => `rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex flex-none items-center gap-1.5 border-b border-slate-200 bg-white px-6 py-2">
        <button onClick={() => setMode('chuyen_de')} className={tab(mode === 'chuyen_de')}>📚 Nhập chuyên đề</button>
        <button onClick={() => setMode('de_thi')} className={tab(mode === 'de_thi')}>📝 Nhập đề thi</button>
      </div>
      <div className="min-h-0 flex-1">{mode === 'chuyen_de' ? <NhapChuyenDe /> : <DeThiScreen />}</div>
    </div>
  )
}

const MONS: { key: KhoMon; label: string }[] = [{ key: 'toan', label: 'Toán' }, { key: 'khtn', label: 'KHTN' }]
const CONF_NGUONG = 0.7
const LOAI_LABEL: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng / sai', tra_loi_ngan: 'Tự luận / trả lời ngắn', tu_luan: 'Tự luận / trả lời ngắn' }
const readB64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f) })
const preBox = 'rounded-lg bg-slate-50 px-3 py-2 text-[14px] leading-relaxed text-slate-800'
const code = `${inp} resize-y font-mono text-[12px] leading-relaxed`

type MD = { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null; maDang: string | null; aiMaDang: string | null; conf: number }
type RItem = {
  loai_cau: LoaiCau
  noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null
  menhDe: MD[] | null
  anhDe: string | null; anhDapAn: string | null
  aiMaDang: string | null; conf: number; maDang2: string | null; maDang: string | null   // flat
  chuyenDeRep: string | null                                                              // đúng/sai: dạng đại diện (neo chuyên đề)
  verify: { from: string; to: string } | null
  nguonGiai: 'nguoi' | 'ai'
  saved: boolean; savedMaCau: string | null
}

function NhapChuyenDe() {
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const allowed = laAdmin ? MONS.map((m) => m.key) : MONS.filter((m) => (me?.mons ?? []).includes(m.label)).map((m) => m.key)
  const [mon, setMon] = useState<KhoMon>('toan')
  useEffect(() => { if (allowed.length && !allowed.includes(mon)) setMon(allowed[0]) }, [allowed.join(',')]) // eslint-disable-line

  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [chuDes, setChuDes] = useState<ChuDeOption[]>([])
  const [maChuDe, setMaChuDe] = useState('')
  const [cands, setCands] = useState<DangCandidate[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [coHinh, setCoHinh] = useState(true)
  const [giaiAI, setGiaiAI] = useState(false)

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [items, setItems] = useState<RItem[]>([])
  const [idx, setIdx] = useState(0)
  const [edit, setEdit] = useState(false)          // preview-first; ✎ Sửa → code
  const [recent, setRecent] = useState<string[]>([]) // dạng gần đây (max 5, mới nhất trước)
  const [prec, setPrec] = useState<{ dung: number; tong: number; pct: number } | null>(null)
  useEffect(() => { setEdit(false) }, [idx])
  const pushRecent = (ma: string | null) => { if (ma) setRecent((a) => [ma, ...a.filter((x) => x !== ma)].slice(0, 5)) }

  const fileRef = useRef<HTMLInputElement>(null)
  async function pasteFile() {
    try { const f = await readClipboardImageFile(); if (f) { setFile(f); setErr(null) } else setErr('Clipboard không có ảnh — copy ảnh (Ctrl+C) trước.') }
    catch (e: any) { setErr(e?.message ?? String(e)) }
  }
  // Dán ảnh bằng Ctrl+V ngay trên màn setup (chưa bóc).
  useEffect(() => {
    if (items.length) return
    const onPaste = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith('image/'))
      if (f) { e.preventDefault(); setFile(f); setErr(null) }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [items.length])

  const candMap = useMemo(() => { const m = new Map<string, DangCandidate>(); cands.forEach((c) => m.set(c.ma_dang, c)); return m }, [cands])
  const dangTen = (ma: string | null) => (ma && candMap.get(ma)?.ten_dang) || ma || '—'

  useEffect(() => { if (mon) khoTagPrecision(mon).then(setPrec).catch(() => setPrec(null)) }, [mon, items.length])
  useEffect(() => {
    setChuDes([]); setMaChuDe(''); setCands([])
    if (!mon || !khoi) return
    listChuDeOptions(mon, khoi).then((cs) => { setChuDes(cs); if (cs.length) setMaChuDe(cs[0].ma_chu_de) }).catch((e) => setErr(String(e.message ?? e)))
  }, [mon, khoi])
  useEffect(() => {
    if (!maChuDe) { setCands([]); return }
    listDangByChuDe(mon, khoi, maChuDe).then(setCands).catch((e) => setErr(String(e.message ?? e)))
  }, [mon, khoi, maChuDe])

  // ── BÓC: render trang → Gemini (1 pass/trang) → parse → cắt hình → phân loại + verify low-conf ──
  async function boc() {
    if (!file || !maChuDe) return
    setBusy(true); setErr(null); setItems([]); setIdx(0)
    try {
      const tenChuDe = chuDes.find((c) => c.ma_chu_de === maChuDe)?.ten_chu_de
      const b64 = await readB64(file)
      const canvases = await fileToCanvases(file.type, b64)
      const raw: RItem[] = []
      for (let p = 0; p < canvases.length; p++) {
        setMsg(`Đang bóc trang ${p + 1}/${canvases.length}…`)
        const c = canvases[p]
        const files = coHinh ? [{ mimeType: 'image/jpeg', dataBase64: canvasToJpegBase64(c) }] : [{ mimeType: file.type, dataBase64: b64 }]
        const { text } = await callGeminiRich(buildKhoIngestPrompt({ tenChuDe, giaiAI }), { schema: INGEST_KHO_SCHEMA, think: giaiAI ? 8192 : 0, files })
        for (const cau of parseKhoIngestJson(text)) {
          let anhDe: string | null = null
          if (coHinh && cau.coHinh && cau.box) {
            try { const blob = await (await fetch(cropCanvasBox(c, cau.box))).blob(); anhDe = await uploadKhoImage(new File([blob], 'fig.png', { type: 'image/png' })) } catch { /* bỏ hình lỗi */ }
          }
          raw.push({
            loai_cau: cau.loai_cau, noi_dung: cau.noi_dung, dap_an: cau.dap_an, loi_giai: cau.loi_giai, lua_chon: cau.lua_chon,
            menhDe: cau.menh_de ? cau.menh_de.map((m) => ({ ...m, maDang: null, aiMaDang: null, conf: 0 })) : null,
            anhDe, anhDapAn: null,
            aiMaDang: null, conf: 0, maDang2: null, maDang: null, chuyenDeRep: null,
            verify: null, nguonGiai: cau.loi_giai ? (giaiAI ? 'ai' : 'nguoi') : 'nguoi', saved: false, savedMaCau: null,
          })
        }
        if (!coHinh) break // 1 câu-thuần: gửi cả file 1 lần, không lặp trang
      }
      if (!raw.length) throw new Error('AI không tách được câu nào — thử bật “Có hình” / ảnh nét hơn.')

      // Phân loại dạng (grounded): flat theo đề · đúng/sai theo TỪNG mệnh đề
      setMsg('Đang gán dạng…')
      const flatIdx = raw.map((r, i) => (r.loai_cau === 'dung_sai' ? -1 : i)).filter((i) => i >= 0)
      if (flatIdx.length) {
        const cls = await classifyDang(flatIdx.map((i) => raw[i].noi_dung), cands)
        flatIdx.forEach((i, k) => { const r = cls[k]; raw[i].aiMaDang = r.ma_dang; raw[i].conf = r.confidence; raw[i].maDang2 = r.ma_dang_2; raw[i].maDang = r.ma_dang })
      }
      for (const r of raw) {
        if (r.loai_cau !== 'dung_sai' || !r.menhDe) continue
        const cls = await classifyDang(r.menhDe.map((m) => m.noi_dung), cands)
        r.menhDe.forEach((m, k) => { m.aiMaDang = cls[k].ma_dang; m.conf = cls[k].confidence; m.maDang = cls[k].ma_dang })
        r.chuyenDeRep = r.menhDe.find((m) => m.maDang)?.maDang ?? null // neo chuyên đề = dạng mệnh đề đầu có gán
      }

      // Verify CHỈ câu flat confidence thấp (đúng/sai không verify tự động)
      const lyCache = new Map<string, string>()
      for (const r of raw) {
        if (r.loai_cau === 'dung_sai' || !r.aiMaDang || r.conf >= CONF_NGUONG) continue
        setMsg('Đang kiểm tra dạng (độ tin thấp)…')
        let ly = lyCache.get(r.aiMaDang); if (ly === undefined) { ly = await getDangLyThuyet(mon, r.aiMaDang); lyCache.set(r.aiMaDang, ly) }
        const cur = candMap.get(r.aiMaDang); if (!cur) continue
        try {
          const v = await verifyDangByLyThuyet(r.noi_dung, cur, ly, cands)
          if (!v.khop && v.ma_dang_dung && v.ma_dang_dung !== r.aiMaDang) { r.verify = { from: dangTen(r.aiMaDang), to: dangTen(v.ma_dang_dung) }; r.maDang = v.ma_dang_dung }
        } catch { /* verify lỗi → giữ nguyên, người xử */ }
      }
      setItems(raw); setIdx(0)
    } catch (e: any) { setErr(String(e.message ?? e)) } finally { setBusy(false); setMsg('') }
  }

  const patch = (p: Partial<RItem>) => setItems((a) => a.map((x, i) => (i === idx ? { ...x, ...p } : x)))
  const jumpWarn = () => { const w = items.findIndex((r) => !r.saved && ((r.conf && r.conf < CONF_NGUONG) || r.verify)); if (w >= 0) setIdx(w) }

  async function aiGiai() {
    const r = items[idx]; if (!r) return
    const ma = r.loai_cau === 'dung_sai' ? r.chuyenDeRep : r.maDang
    if (!ma) { setErr('Chọn dạng trước khi AI giải (để đọc đúng lý thuyết).'); return }
    setBusy(true); setErr(null); setMsg('AI đang đọc lý thuyết + giải…')
    try {
      const ly = await getDangLyThuyet(mon, ma)
      const giai = await aiGiaiCau({ noi_dung: r.noi_dung, loai_cau: r.loai_cau, dap_an: r.dap_an, lua_chon: r.lua_chon }, ly)
      patch({ loi_giai: giai, nguonGiai: 'ai' })
    } catch (e: any) { setErr(String(e.message ?? e)) } finally { setBusy(false); setMsg('') }
  }

  async function duyet() {
    const r = items[idx]; if (!r) return
    const { cauTbl } = khoTbls(mon)
    setBusy(true); setErr(null)
    try {
      let maCau: string
      if (r.loai_cau === 'dung_sai') {
        if (!r.chuyenDeRep || !r.menhDe?.every((m) => m.maDang)) throw new Error('Gán đủ dạng cho 4 mệnh đề trước khi lưu.')
        const menhDe: MenhDe[] = r.menhDe.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, ma_dang: m.maDang!, loi_giai: m.loi_giai }))
        const c = await createCauDungSai({ dang_chinh: r.chuyenDeRep, noi_dung: r.noi_dung, loi_giai: r.loi_giai, menh_de: menhDe, anh_de: r.anhDe }, cauTbl)
        maCau = c.ma_cau
        await logKhoTag(r.menhDe.map((m) => ({ mon, ma_cau: maCau, ai_value: m.aiMaDang, final_value: m.maDang, ai_confidence: m.conf })))
        r.menhDe.forEach((m) => pushRecent(m.maDang))
      } else {
        if (!r.maDang) throw new Error('Chọn dạng trước khi lưu.')
        maCau = await saveCauToDang({ dangChinh: r.maDang, loaiCau: r.loai_cau, noi_dung: r.noi_dung, dap_an: r.dap_an, loi_giai: r.loi_giai, lua_chon: r.lua_chon, anh_de: r.anhDe, anh_dap_an: r.anhDapAn, nguon_giai: r.nguonGiai }, cauTbl)
        await logKhoTag([{ mon, ma_cau: maCau, ai_value: r.aiMaDang, final_value: r.maDang, ai_confidence: r.conf, da_verify: !!r.verify }])
        pushRecent(r.maDang)
      }
      setItems((a) => a.map((x, i) => (i === idx ? { ...x, saved: true, savedMaCau: maCau } : x)))
      const nxt = items.findIndex((x, i) => i > idx && !x.saved)
      if (nxt >= 0) setIdx(nxt)
    } catch (e: any) { setErr(String(e.message ?? e)) } finally { setBusy(false) }
  }

  // ═══════════ SETUP ═══════════
  if (!items.length) {
    return (
      <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[22px] font-semibold text-slate-900">Nhập kho từ tài liệu</h1>
          <p className="mt-1 text-[13px] text-slate-500">1 file → hệ tự bóc từng câu, gán dạng theo chủ đề → bạn duyệt từng câu rồi đẩy vào kho.</p>
          <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <Field label="Môn">
              <div className="flex gap-1.5">{MONS.filter((m) => allowed.includes(m.key)).map((m) => (
                <button key={m.key} onClick={() => setMon(m.key)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium ${mon === m.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{m.label}</button>
              ))}</div>
            </Field>
            <Field label="Khối">
              <div className="flex flex-wrap gap-1.5">{KHOI_OPTIONS.map((k) => (
                <button key={k} onClick={() => setKhoi(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${khoi === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{k}</button>
              ))}</div>
            </Field>
            <Field label="Chủ đề">
              <select value={maChuDe} onChange={(e) => setMaChuDe(e.target.value)} className={inp}>
                {!chuDes.length && <option value="">— chưa có chủ đề ở khối này —</option>}
                {chuDes.map((c) => <option key={c.ma_chu_de} value={c.ma_chu_de}>{c.ten_chu_de} ({c.soDang} dạng)</option>)}
              </select>
              {!!cands.length && <p className="mt-1 text-[12px] text-slate-400">{cands.length} dạng trong chủ đề — AI gán dạng trong phạm vi này.</p>}
            </Field>
            <Field label="Tài liệu (PDF / ảnh)">
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📎 Chọn file</button>
                <button onClick={pasteFile} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📋 Dán ảnh (Ctrl+V)</button>
                <input ref={fileRef} type="file" accept="application/pdf,image/*" hidden onChange={(e) => { setFile(e.target.files?.[0] ?? null); e.target.value = '' }} />
                {file && <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] text-slate-600">📄 {file.name || 'ảnh đã dán'}<button onClick={() => setFile(null)} className="text-rose-500">✕</button></span>}
              </div>
              <p className="mt-1 text-[12px] text-slate-400">PDF nhiều trang → “Chọn file”. Ảnh chụp/screenshot → Ctrl+V dán thẳng.</p>
            </Field>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-[13px] text-slate-600"><input type="checkbox" checked={coHinh} onChange={(e) => setCoHinh(e.target.checked)} />📐 Có hình (cắt ảnh đề)</label>
              <label className="flex items-center gap-2 text-[13px] text-slate-600"><input type="checkbox" checked={giaiAI} onChange={(e) => setGiaiAI(e.target.checked)} />🤖 AI tự giải (khi tài liệu thiếu lời giải)</label>
            </div>
            {err && <p className="text-[13px] text-red-600">{err}</p>}
            <button disabled={!file || !maChuDe || busy} onClick={boc} className="w-full rounded-lg bg-indigo-600 py-2.5 text-[14px] font-medium text-white disabled:opacity-40">
              {busy ? (msg || 'Đang xử lý…') : 'Bóc câu từ tài liệu'}
            </button>
          </div>
          {prec && prec.tong > 0 && <p className="mt-4 text-center text-[12px] text-slate-400">AI gán dạng đúng {prec.pct}% · {prec.dung}/{prec.tong} (theo lịch sử duyệt môn này)</p>}
        </div>
      </section>
    )
  }

  // ═══════════ REVIEW (1 câu / màn — FULL-WIDTH, dùng CHUNG CauEditor với "nhập chuỗi câu") ═══════════
  const r = items[idx]
  const soXong = items.filter((x) => x.saved).length
  const coWarn = items.some((x) => !x.saved && ((x.conf && x.conf < CONF_NGUONG) || x.verify))
  const isDS = r.loai_cau === 'dung_sai'
  // Map RItem (câu phẳng) ↔ ReviewItem để render bằng CauEditor y hệt màn nhập chuỗi câu.
  const flatRI: ReviewItem = { noi_dung: r.noi_dung, dap_an: r.dap_an ?? '', loi_giai: r.loi_giai ?? '', luaChon: r.lua_chon, anhDe: r.anhDe, anhDapAn: r.anhDapAn, nguonGiai: r.nguonGiai, approved: true, isGoc: false }
  const onFlat = (p: Partial<ReviewItem>) => {
    const q: Partial<RItem> = {}
    if (p.noi_dung !== undefined) q.noi_dung = p.noi_dung
    if (p.dap_an !== undefined) q.dap_an = p.dap_an
    if (p.loi_giai !== undefined) { q.loi_giai = p.loi_giai; q.nguonGiai = 'nguoi' } // người sửa lời giải → tin
    if (p.luaChon !== undefined) q.lua_chon = p.luaChon
    if (p.anhDe !== undefined) q.anhDe = p.anhDe
    if (p.anhDapAn !== undefined) q.anhDapAn = p.anhDapAn
    patch(q)
  }
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="flex flex-none items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">{chuDes.find((c) => c.ma_chu_de === maChuDe)?.ten_chu_de} · K{khoi}</span>
          <span className="text-slate-400">{file?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {coWarn && <button onClick={jumpWarn} className="rounded-full bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700">⚠ Nhảy câu độ tin thấp →</button>}
          {prec && prec.tong > 0 && <span className="text-[12px] text-slate-400">AI đúng {prec.pct}%</span>}
          <button onClick={() => { setItems([]); setFile(null) }} className="text-[12px] text-slate-400 hover:text-slate-600">Nhập file khác</button>
        </div>
      </div>

      <div className="flex flex-none items-center gap-3 px-6 py-2.5">
        <span className="min-w-[92px] text-[12px] text-slate-500">Câu {idx + 1} / {items.length} · xong {soXong}</span>
        <div className="flex flex-1 gap-1">{items.map((x, i) => <div key={i} className={`h-[5px] flex-1 rounded-full ${x.saved ? 'bg-indigo-500' : i === idx ? 'bg-slate-400' : 'bg-slate-200'}`} />)}</div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
          {/* Thanh trên: loại · gán dạng (bắt buộc vì scope = chủ đề) · AI giải · trạng thái */}
          <div className="flex flex-none flex-wrap items-center gap-3 border-b border-slate-100 pb-3">
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600">{LOAI_LABEL[r.loai_cau]}</span>
            {r.saved && <span className="shrink-0 text-[12px] text-emerald-600">✓ đã lưu ({r.savedMaCau})</span>}
            {isDS ? (
              <>
                <div className="flex-1" />
                {!r.saved && <button onClick={() => setEdit((e) => !e)} className={`shrink-0 rounded-lg px-3 py-1 text-[12px] font-medium ${edit ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>{edit ? '✓ Xong sửa' : '✎ Sửa nội dung'}</button>}
              </>
            ) : (
              <>
                <div className="min-w-[280px] flex-1"><DangPicker value={r.maDang} aiMaDang={r.aiMaDang} conf={r.conf} maDang2={r.maDang2} cands={cands} candMap={candMap} recent={recent} onPick={(ma) => { patch({ maDang: ma }); pushRecent(ma) }} disabled={r.saved} /></div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${r.nguonGiai === 'ai' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{r.nguonGiai === 'ai' ? '🤖 AI giải · cần duyệt' : '📄 từ tài liệu'}</span>
                {!r.saved && <button disabled={busy} onClick={aiGiai} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] text-slate-700 disabled:opacity-40">🤖 AI giải</button>}
              </>
            )}
          </div>
          {r.verify && (
            <div className="flex-none rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-800">
              ⚠ Độ tin thấp — sau khi đọc lý thuyết, AI đổi dạng <b>«{r.verify.from}»</b> → <b>«{r.verify.to}»</b>. Kiểm tra lại.
            </div>
          )}
          {isDS
            ? <div className="min-h-0 flex-1 overflow-auto"><DungSaiEditor r={r} cands={cands} candMap={candMap} recent={recent} edit={edit && !r.saved} onPatch={patch} onPick={pushRecent} /></div>
            : <div className="min-h-0 flex-1"><CauEditor item={flatRI} fill onChange={onFlat} /></div>}

          <div className="flex flex-none items-center justify-between border-t border-slate-100 pt-3">
            <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-500 disabled:opacity-40">← Trước</button>
            {err && <span className="px-2 text-[12px] text-red-600">{err}</span>}
            <div className="flex items-center gap-2">
              {busy && msg && <span className="text-[12px] text-slate-400">{msg}</span>}
              <button disabled={idx >= items.length - 1} onClick={() => setIdx(idx + 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-500 disabled:opacity-40">Bỏ qua</button>
              {!r.saved && <button disabled={busy} onClick={duyet} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">✓ Duyệt · lưu → câu tiếp</button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</label>{children}</div>
}

// Chip chọn dạng: dạng đang chọn (filled) + AI gợi ý (ma_dang_2) + hàng "gần đây" (≤5) + combobox tìm.
function DangPicker({ value, aiMaDang, conf, maDang2, cands, candMap, recent, onPick, disabled }: {
  value: string | null; aiMaDang?: string | null; conf?: number; maDang2?: string | null
  cands: DangCandidate[]; candMap: Map<string, DangCandidate>; recent: string[]; onPick: (ma: string) => void; disabled?: boolean
}) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const cur = value ? candMap.get(value) : null
  const alt = maDang2 && maDang2 !== value ? candMap.get(maDang2) : null
  const recents = recent.map((ma) => candMap.get(ma)).filter((c): c is DangCandidate => !!c && c.ma_dang !== value).slice(0, 5)
  const filtered = q.trim() ? cands.filter((c) => (c.ten_dang + ' ' + c.ma_dang).toLowerCase().includes(q.toLowerCase())).slice(0, 20) : []
  const chip = (c: DangCandidate | null | undefined, active: boolean, hint?: string) => c ? (
    <button key={c.ma_dang} disabled={disabled} onClick={() => onPick(c.ma_dang)}
      className={`rounded-full px-2.5 py-1 text-[12px] ${active ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'} disabled:opacity-60`}>{active ? '✓ ' : ''}{c.ten_dang}{hint ? <span className="ml-1 text-[10px] opacity-70">{hint}</span> : ''}</button>
  ) : null
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] text-slate-400">Dạng</span>
        {conf != null && aiMaDang && <span className={`rounded-full px-2 py-0.5 text-[11px] ${conf < CONF_NGUONG ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{conf < CONF_NGUONG ? '⚠ ' : ''}AI {Math.round(conf * 100)}%</span>}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {value && chip(cur, true)}
        {alt && chip(alt, false, 'AI gợi ý')}
        {!disabled && <button onClick={() => setOpen((o) => !o)} className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[12px] text-slate-400">🔍 Tìm dạng khác</button>}
      </div>
      {!!recents.length && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Gần đây:</span>
          {recents.map((c) => chip(c, false))}
        </div>
      )}
      {open && !disabled && (
        <div className="mt-2">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ tên / mã dạng…" className={`${inp} text-[13px]`} />
          {!!filtered.length && (
            <div className="mt-1 max-h-44 overflow-auto rounded-lg border border-slate-200">
              {filtered.map((c) => (
                <button key={c.ma_dang} onClick={() => { onPick(c.ma_dang); setOpen(false); setQ('') }} className="block w-full px-3 py-1.5 text-left text-[13px] hover:bg-indigo-50">
                  <span className="text-slate-800">{c.ten_dang}</span> <span className="text-[11px] text-slate-400">· {c.ten_chuyen_de}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DungSaiEditor({ r, cands, candMap, recent, edit, onPatch, onPick }: { r: RItem; cands: DangCandidate[]; candMap: Map<string, DangCandidate>; recent: string[]; edit: boolean; onPatch: (p: Partial<RItem>) => void; onPick: (ma: string | null) => void }) {
  const setMD = (k: number, p: Partial<MD>) => onPatch({ menhDe: (r.menhDe ?? []).map((m, i) => (i === k ? { ...m, ...p } : m)) })
  const chuyenDe = r.chuyenDeRep ? candMap.get(r.chuyenDeRep)?.ten_chuyen_de : null
  return (
    <div>
      {chuyenDe && <div className="mb-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] text-indigo-700">📁 Cả câu neo chuyên đề: {chuyenDe}</div>}
      <div className="mb-1 text-[12px] text-slate-400">Đề chung</div>
      {edit
        ? <textarea value={r.noi_dung} onChange={(e) => onPatch({ noi_dung: e.target.value })} className={`${code} min-h-[64px]`} />
        : <div className={preBox}><MathText>{r.noi_dung}</MathText></div>}
      {r.anhDe && <img src={r.anhDe} alt="hình đề" className="mt-2 max-h-56 rounded-lg border border-slate-200" />}
      <div className="mt-3 text-[12px] text-slate-400">4 mệnh đề — mỗi mệnh đề 1 dạng riêng</div>
      <div className="mt-1.5 space-y-2">
        {(r.menhDe ?? []).map((m, k) => (
          <div key={k} className="rounded-lg border border-slate-200 p-2.5">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-5 w-5 flex-none rounded bg-violet-100 text-center text-[11px] font-medium leading-5 text-violet-700">{'abcd'[k]}</span>
              {edit
                ? <textarea value={m.noi_dung} onChange={(e) => setMD(k, { noi_dung: e.target.value })} className={`${inp} min-h-[40px] resize-y text-[12px]`} />
                : <span className="min-w-0 flex-1 text-[14px] text-slate-800"><MathText>{m.noi_dung}</MathText></span>}
              <div className="flex flex-none gap-1">
                {(['D', 'S'] as const).map((v) => (
                  <button key={v} disabled={!edit} onClick={() => setMD(k, { dap_an: v })} className={`h-6 w-7 rounded text-[11px] font-medium disabled:opacity-100 ${m.dap_an === v ? (v === 'D' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white') : 'bg-slate-100 text-slate-400'}`}>{v === 'D' ? 'Đ' : 'S'}</button>
                ))}
              </div>
            </div>
            <div className="mt-2 pl-7">
              <DangPicker value={m.maDang} aiMaDang={m.aiMaDang} conf={m.conf} cands={cands} candMap={candMap} recent={recent}
                onPick={(ma) => { setMD(k, { maDang: ma }); onPick(ma); if (k === 0 || !r.chuyenDeRep) onPatch({ chuyenDeRep: r.chuyenDeRep ?? ma }) }} disabled={r.saved} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
