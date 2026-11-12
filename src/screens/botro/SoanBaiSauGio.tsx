// SOẠN BÀI LUYỆN / BÀI TEST bổ trợ sau giờ "như builder giáo trình, chỉnh được" (Thùy 11/11).
// Máy đề xuất câu theo luật bổ trợ (fn_btnhe_soan — chưa ghi gì) → mỗi dạng 1 khối KhoiCau của builder (✕ bỏ câu · ↻ Gợi ý lại ·
// ✎ Chọn câu từ kho bằng ChonCauBdm) → "Lưu & in" (fn_btnhe_luu_bai) → bản in phiếu giấy sẵn có. Dùng lại module builder, không đẻ kiểu mới.
import { useEffect, useState } from 'react'
import { soanBai, goiYDang, luuBai, type BaiSoan, type DangSoan, type CauHinhIn } from '../../lib/botro_nhe'
import { AnhMmEditCtx } from '../tailieu/anhMmCtx'
import { inLayBaiGiay, type BaiInGiay } from '../../lib/botro_yeu_ca'
import { fetchCausCuaTaiLieu } from '../../lib/tailieu'
import type { CauHoi } from '../../lib/kho/api'
import { KhoiCau, type CfgCau } from '../tailieu/bdm/BuilderBanDoMoi'
import ChonCauBdm from '../tailieu/bdm/ChonCauBdm'

// Thùy 12/11 "cần có chọn dòng và những cái khác như builder giáo trình hoàn thiện": KhoiCau ĐẦY ĐỦ (dòng kẻ · cột · chế độ hình · cỡ ảnh),
// lưu theo câu vào bai_test.cau_hinh_in; bản in khuôn ET đọc lại.

export default function SoanBaiSauGio({ buoiId, loai, onDong, onIn }: {
  buoiId: string; loai: 'luyen' | 'test'; onDong: () => void; onIn: (bai: BaiInGiay) => void
}) {
  const [so, setSo] = useState(3)
  const [bai, setBai] = useState<BaiSoan | null>(null)
  const [cauMap, setCauMap] = useState<Map<string, CauHoi>>(new Map())
  const [chonCau, setChonCau] = useState<DangSoan | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [ch, setCh] = useState<CauHinhIn>({})
  const vaCh = (k: keyof CauHinhIn, m: string, v: unknown) => setCh((c) => { const o = { ...((c[k] ?? {}) as Record<string, unknown>) }; if (v == null) delete o[m]; else o[m] = v; return { ...c, [k]: o } })
  const cfg: CfgCau = {
    lines: ch.btvnLinesByCau ?? {}, cols: ch.colByCau ?? {}, cheDo: ch.hinhCheDoByCau ?? {},
    onLine: (m, n) => vaCh('btvnLinesByCau', m, n), onLineAll: (ms, n) => ms.forEach((m) => vaCh('btvnLinesByCau', m, n)),
    onCol: (m, n) => vaCh('colByCau', m, n), onCheDo: (m, v) => vaCh('hinhCheDoByCau', m, v),
  }
  const [loi, setLoi] = useState<string | null>(null)

  async function napCau(mon: string, ds: DangSoan[]) {
    const theoNhanh = new Map<string, string[]>()
    for (const d of ds) { const k = d.nhanh ?? ''; theoNhanh.set(k, [...(theoNhanh.get(k) ?? []), ...d.caus]) }
    for (const [nhanh, ms] of theoNhanh) {
      const can = ms.filter((m) => !cauMap.has(m)); if (!can.length) continue
      const rows = await fetchCausCuaTaiLieu({ mon, nhanh: nhanh || null }, can)
      setCauMap((m) => { const x = new Map(m); rows.forEach((c) => x.set(c.ma_cau, c)); return x })
    }
  }
  // đổi số câu / mở ⇒ đề xuất lại (đổi ngữ cảnh — fetch lại)
  useEffect(() => {
    setBai(null); setLoi(null)
    soanBai(buoiId, loai, so).then((b) => { setBai(b); setCh((b.cau_hinh_in ?? {}) as CauHinhIn); napCau(b.mon, b.dang).catch((e) => setLoi(e?.message ?? String(e))) })
      .catch((e) => setLoi(e?.message ?? String(e)))
  }, [buoiId, loai, so]) // eslint-disable-line

  const tatCa = bai ? bai.dang.flatMap((d) => d.caus) : []
  const vaDang = (ma: string, caus: string[]) => setBai((b) => b && { ...b, dang: b.dang.map((d) => d.ma_dang === ma ? { ...d, caus } : d) })

  async function goiY(d: DangSoan, n: number) {
    setBusy(d.ma_dang); setLoi(null)
    try {
      const ms = await goiYDang(buoiId, d.ma_dang, Math.max(1, n), [...tatCa.filter((m) => !d.caus.includes(m)), ...(bai?.da_in ?? []), ...d.caus])
      if (!ms.length) setLoi(`“${d.ten_dang}”: hết câu mới trong kho để gợi ý.`)
      else { vaDang(d.ma_dang, ms); await napCau(bai!.mon, [{ ...d, caus: ms }]) }
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  async function luu() {
    if (!bai) return
    setBusy('luu'); setLoi(null)
    try {
      const r = await luuBai(buoiId, loai, bai.dang.filter((d) => d.caus.length).map((d) => ({ ma_dang: d.ma_dang, caus: d.caus })), ch)
      onIn(await inLayBaiGiay(r.bai_test_id))
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  const ten = loai === 'test' ? 'bài test' : 'bài luyện'
  return (
    <AnhMmEditCtx.Provider value={{ mm: ch.anhMmByCau ?? {}, pct: ch.anhPctByCau ?? {}, baChe: false,
      set: (m, v) => { vaCh('anhMmByCau', m, v?.mm ?? null); vaCh('anhPctByCau', m, v?.pct ?? null) } }}>
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-auto bg-slate-900/40 p-4">
      <div className="w-full max-w-[920px] rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-t-2xl border-b border-slate-200 bg-white px-5 py-3">
          <p className="text-[15px] font-bold text-slate-800">{loai === 'test' ? '📝 Soạn bài test' : '✏️ Soạn bài luyện'}</p>
          <span className="text-[12px] text-slate-500">{loai === 'test' ? '1 câu mỗi dạng yếu trong nhóm yếu' : 'mọi dạng của em, nhóm yếu trước'} · ✕ bỏ câu · ↻ gợi ý lại · ✎ chọn câu từ kho</span>
          {loai === 'luyen' && (
            <span className="ml-2 flex items-center gap-1 text-[12px] text-slate-600">
              {[3, 5, 8].map((n) => <button key={n} onClick={() => setSo(n)} className={`rounded px-2 py-0.5 ${so === n ? 'bg-indigo-600 text-white' : 'ring-1 ring-slate-200'}`}>{n}</button>)} câu/dạng
            </span>
          )}
          <div className="ml-auto flex gap-2">
            <button disabled={!bai || !tatCa.length || !!busy} onClick={luu} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">{busy === 'luu' ? 'Đang lưu…' : `💾 Lưu & in · ${tatCa.length} câu`}</button>
            <button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
          </div>
        </div>
        {loi && <p className="mx-5 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
        {!bai ? <p className="px-5 py-6 text-[13px] text-slate-400">{loi ? '' : `Máy đang chọn câu cho ${ten}…`}</p> : (
          <div className="divide-y divide-slate-100 px-2 pb-3">
            {bai.dang.map((d, i) => (
              <div key={d.ma_dang} className={busy === d.ma_dang ? 'opacity-50' : ''}>
                <div className="px-3 pt-3 text-[13px] font-bold text-slate-800">
                  {i + 1}. {d.ten_dang}{d.nhom_yeu && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] text-amber-800">★ nhóm yếu</span>}
                </div>
                <KhoiCau tieuDe={`${d.caus.length} câu`} mau={loai === 'test' ? 'amber' : 'sky'} btvn caus={d.caus} cauMap={cauMap} cfg={cfg} chiXem={false}
                  soMacDinh={{ trac_nghiem: loai === 'test' ? 1 : so }}
                  onXoa={(m) => vaDang(d.ma_dang, d.caus.filter((x) => x !== m))}
                  onGoiY={(s) => goiY(d, Object.values(s).reduce((a, b) => a + b, 0))}
                  onChonCau={d.nhanh === 'bdm' && d.nhom_id ? () => setChonCau(d) : undefined} />
              </div>
            ))}
          </div>
        )}
      </div>
      {chonCau && bai && (
        <ChonCauBdm tl={{ mon: bai.mon, nhanh: 'bdm' }} nhomId={chonCau.nhom_id!} uuTien={chonCau.ma_dang} selected={chonCau.caus} coKhoLop={false} macDinh="luyen"
          khoa={[...tatCa.filter((m) => !chonCau.caus.includes(m)), ...bai.da_in]}
          onClose={() => setChonCau(null)}
          onConfirm={async (ms) => { vaDang(chonCau.ma_dang, ms); await napCau(bai.mon, [{ ...chonCau, caus: ms }]); setChonCau(null) }} />
      )}
    </div>
    </AnhMmEditCtx.Provider>
  )
}
