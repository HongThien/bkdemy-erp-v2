// SOẠN BÀI LUYỆN / BÀI TEST bổ trợ sau giờ "như builder giáo trình, chỉnh được" (Thùy 11/11).
// Máy đề xuất câu theo luật bổ trợ (fn_btnhe_soan — chưa ghi gì) → mỗi dạng 1 khối KhoiCau của builder (✕ bỏ câu · ↻ Gợi ý lại ·
// ✎ Chọn câu từ kho bằng ChonCauBdm) → "Lưu & in" (fn_btnhe_luu_bai) → bản in phiếu giấy sẵn có. Dùng lại module builder, không đẻ kiểu mới.
import { useEffect, useRef, useState } from 'react'
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
  // Thùy 13/11 "GV chỉnh builder thì hệ thống tự lưu, in cả lớp in cái đã lưu": mỗi lần chỉnh ⇒ đếm `sua`, chờ 1,2 s không chỉnh thêm thì lưu
  const [sua, setSua] = useState(0)
  const [luuLuc, setLuuLuc] = useState<string | null>(null)
  const [baiId, setBaiId] = useState<string | null>(null)
  const daSua = () => setSua((s) => s + 1)
  const vaCh = (k: keyof CauHinhIn, m: string, v: unknown) => { daSua(); setCh((c) => { const o = { ...((c[k] ?? {}) as Record<string, unknown>) }; if (v == null) delete o[m]; else o[m] = v; return { ...c, [k]: o } }) }
  const cfg: CfgCau = {
    // Thùy 12/11: câu TRẢ LỜI NGẮN mặc định 0 dòng (= in bảng ô điền như cũ); đặt > 0 ⇒ in dòng kẻ như tự luận (ETPrintView nhanDe.tlnTheoDong)
    lines: { ...Object.fromEntries([...cauMap.values()].filter((c) => c.loai_cau === 'tra_loi_ngan').map((c) => [c.ma_cau, 0])), ...(ch.btvnLinesByCau ?? {}) }, cols: ch.colByCau ?? {}, cheDo: ch.hinhCheDoByCau ?? {},
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
    soanBai(buoiId, loai, so).then((b) => {
      setBai(b); setCh((b.cau_hinh_in ?? {}) as CauHinhIn); setBaiId(b.bai_id ?? null); setSua(0); daLuuSua.current = 0
      napCau(b.mon, b.dang).catch((e) => setLoi(e?.message ?? String(e)))
    }).catch((e) => setLoi(e?.message ?? String(e)))
  }, [buoiId, loai, so]) // eslint-disable-line

  const tatCa = bai ? bai.dang.flatMap((d) => d.caus) : []
  const vaDang = (ma: string, caus: string[]) => { daSua(); setBai((b) => b && { ...b, dang: b.dang.map((d) => d.ma_dang === ma ? { ...d, caus } : d) }) }

  // TỰ LƯU: đọc bản mới nhất qua ref (tránh closure cũ); `daLuuSua` = số lần chỉnh đã nằm trong DB
  const moiNhat = useRef({ bai, ch }); moiNhat.current = { bai, ch }
  const daLuuSua = useRef(0)
  const dangLuu = useRef<Promise<string | null> | null>(null)
  async function luuNgay(): Promise<string | null> {
    const { bai: b, ch: c } = moiNhat.current
    if (!b) return null
    const ds = b.dang.filter((d) => d.caus.length).map((d) => ({ ma_dang: d.ma_dang, caus: d.caus }))
    if (!ds.length) { setLoi('Bài chưa có câu nào — chưa lưu.'); return null }
    const moc = sua
    setBusy('luu')
    try {
      const r = await luuBai(buoiId, loai, ds, c)
      daLuuSua.current = Math.max(daLuuSua.current, moc); setBaiId(r.bai_test_id); setLoi(null)
      setLuuLuc(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }))
      return r.bai_test_id
    } catch (e: any) { setLoi(e?.message ?? String(e)); return null } finally { setBusy(null) }
  }
  useEffect(() => {
    if (sua === 0 || sua === daLuuSua.current) return
    const t = setTimeout(() => { dangLuu.current = luuNgay() }, 1200)
    return () => clearTimeout(t)
  }, [sua]) // eslint-disable-line
  const conChuaLuu = sua !== daLuuSua.current
  async function inBai() {   // in = in đúng bản đã lưu (còn chỉnh dở thì lưu nốt trước)
    setLoi(null)
    if (dangLuu.current) await dangLuu.current
    const id = conChuaLuu || !baiId ? await luuNgay() : baiId
    if (id) { try { onIn(await inLayBaiGiay(id)) } catch (e: any) { setLoi(e?.message ?? String(e)) } }
  }
  async function dong() { if (conChuaLuu) await luuNgay(); onDong() }

  async function goiY(d: DangSoan, n: number) {
    setBusy(d.ma_dang); setLoi(null)
    try {
      const ms = await goiYDang(buoiId, d.ma_dang, Math.max(1, n), [...tatCa.filter((m) => !d.caus.includes(m)), ...(bai?.da_in ?? []), ...d.caus])
      if (!ms.length) setLoi(`“${d.ten_dang}”: hết câu mới trong kho để gợi ý.`)
      else { vaDang(d.ma_dang, ms); await napCau(bai!.mon, [{ ...d, caus: ms }]) }
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
            <span className="self-center text-[12px] text-slate-500" title="Mỗi lần chỉnh, hệ thống tự lưu sau 1 giây. In cả lớp in đúng bản đã lưu.">
              {busy === 'luu' ? 'Đang lưu…' : conChuaLuu ? 'Có chỉnh — sắp tự lưu' : luuLuc ? `✓ Đã lưu ${luuLuc}` : baiId ? '✓ Bản đã lưu' : 'Máy đề xuất — chỉnh là tự lưu'}
            </span>
            <button disabled={!bai || !tatCa.length || busy === 'luu'} onClick={inBai} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">🖨 In · {tatCa.length} câu</button>
            <button onClick={dong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
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
