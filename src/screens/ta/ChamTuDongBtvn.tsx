// ChamTuDongBtvn — khung CHẤM TỰ ĐỘNG trong màn chấm BTVN 1 HS (CEO 05–07/11/2026).
// TA tải/dán ảnh → 📤 Gửi chấm (CHẾ ĐỘ HÀNG ĐỢI: máy CEO chạy /cham-btvn-hang-doi theo đợt) → máy GỢI Ý
// Đ/C/S từng câu (câu máy không chắc tô vàng) → TA sửa → ✓ Xác nhận ⇒ fn_btvn_ai_chot ghi gami_grades.
// Gợi ý nằm ở bảng nháp btvn_ai_*: chưa xác nhận thì CHƯA có gì trong gami_grades (luật §1.5).
import { useEffect, useRef, useState } from 'react'
import { taThemAnh, guiCham, layLanAi, chotAi, diemLanAi, trangThaiAiTheoBuoi, type AiLan, type AiTrangThai, type AiDiem } from '../../lib/btvnnop'
import { gioVN } from '../../lib/tacong'
import type { Problem } from '../../lib/gami'

type KQ = 'correct' | 'partial' | 'wrong'
const NUT: { v: KQ; lbl: string; on: string }[] = [
  { v: 'correct', lbl: 'Đ', on: 'bg-emerald-600 text-white border-transparent' },
  { v: 'partial', lbl: 'C', on: 'bg-amber-500 text-white border-transparent' },
  { v: 'wrong', lbl: 'S', on: 'bg-rose-600 text-white border-transparent' },
]

export default function ChamTuDongBtvn({ buoiId, hsId, probs, dong, coAnh, daTra, tenCau, reloadNop, reloadP }: {
  buoiId: string; hsId: string; probs: Problem[]; dong: boolean; coAnh: boolean; daTra: boolean
  tenCau: (p: Problem) => string; reloadNop: () => Promise<void>; reloadP: () => Promise<void>
}) {
  const [lan, setLan] = useState<AiLan | null>(null)
  const [chon, setChon] = useState<Record<string, KQ | undefined>>({})
  const [nx, setNx] = useState<Record<string, string>>({})
  const [dangGui, setDangGui] = useState(false)
  const [tt, setTt] = useState<AiTrangThai | null>(null)
  const [diem, setDiem] = useState<AiDiem | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [dangChot, setDangChot] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [bao, setBao] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function apLan(l: AiLan | null) {
    setLan(l)
    const c: Record<string, KQ | undefined> = {}, n: Record<string, string> = {}
    for (const x of l?.cau ?? []) { c[x.problem_id] = x.result; n[x.problem_id] = x.nhan_xet ?? '' }
    setChon(c); setNx(n)
    setDiem(null)
    if (l) diemLanAi(l.id).then(setDiem).catch(() => setDiem(null))
  }
  async function tai() {
    const [l, t] = await Promise.all([layLanAi(buoiId, hsId).catch(() => null), trangThaiAiTheoBuoi(buoiId).catch(() => ({} as Record<string, AiTrangThai>))])
    apLan(l); setTt(t[hsId] ?? null)
  }
  useEffect(() => { void tai() }, [buoiId, hsId]) // eslint-disable-line

  async function themAnh(files: File[]) {
    const anh = files.filter((f) => f.type.startsWith('image/'))
    if (!anh.length || dangTai) return
    setDangTai(true); setLoi(null)
    try { await taThemAnh(buoiId, hsId, anh); await reloadNop(); setBao(`Đã thêm ${anh.length} ảnh`) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangTai(false) }
  }
  // Web: dán ảnh (Ctrl+V) khi màn chấm em này đang mở.
  useEffect(() => {
    if (daTra) return
    const onPaste = (e: ClipboardEvent) => {
      const fs = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'))
      if (fs.length) { e.preventDefault(); void themAnh(fs) }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }) // eslint-disable-line

  async function gui() {
    if (dangGui) return
    if (lan && !lan.chot_at && !confirm('Máy đã có kết quả chưa xác nhận. Gửi chấm lại từ đầu?')) return
    setDangGui(true); setLoi(null)
    try { await guiCham(buoiId, hsId); await tai(); await reloadP(); setBao('Đã gửi — máy sẽ chấm trong đợt tới') }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangGui(false) }
  }
  async function lamMoi() { setLoi(null); await tai(); await reloadNop(); await reloadP() }

  async function chot() {
    if (!lan || dangChot) return
    const items = probs.filter((p) => chon[p.id]).map((p) => ({ problem_id: p.id, result: chon[p.id]!, nhan_xet: nx[p.id]?.trim() || null }))
    const thieu = probs.length - items.length
    if (thieu > 0 && !confirm(`Còn ${thieu} câu chưa có kết quả (máy không thấy trên ảnh). Vẫn ghi các câu đã có?`)) return
    setDangChot(true); setLoi(null)
    try {
      const sua = await chotAi(lan.id, items)
      setLan({ ...lan, chot_at: new Date().toISOString(), so_cau_sua: sua })
      diemLanAi(lan.id).then(setDiem).catch(() => {}) // điểm theo kết quả TA vừa chốt
      await reloadP()
      setBao(`Đã ghi ${items.length} câu${sua ? ` · bạn sửa ${sua} câu so với máy` : ''}`)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDangChot(false) }
  }
  useEffect(() => { if (!bao) return; const t = setTimeout(() => setBao(null), 2500); return () => clearTimeout(t) }, [bao])

  const aiCua = (pid: string) => lan?.cau.find((c) => c.problem_id === pid)
  const soKhongChac = lan?.cau.filter((c) => !c.chac).length ?? 0

  return (
    <div className="mb-2.5 rounded-xl border border-violet-200 bg-violet-50/50 p-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-auto text-[12.5px] font-bold text-violet-800">🤖 Chấm tự động</span>
        {!daTra && (
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => { void themAnh(Array.from(e.target.files ?? [])); e.target.value = '' }} />
            <button onClick={() => fileRef.current?.click()} disabled={dangTai}
              className="min-h-[34px] rounded-lg border border-violet-300 bg-white px-2.5 text-[12px] font-semibold text-violet-700 active:bg-violet-50 disabled:opacity-50">
              {dangTai ? 'Đang tải ảnh…' : '📷 Thêm ảnh'}
            </button>
          </>
        )}
        <button onClick={gui} disabled={!coAnh || dangGui || dong || probs.length === 0 || !!tt?.cho_cham}
          title={!coAnh ? 'Chưa có ảnh bài làm' : probs.length === 0 ? 'Buổi chưa có lưới câu BTVN' : ''}
          className="min-h-[34px] rounded-lg bg-violet-600 px-3 text-[12px] font-bold text-white active:bg-violet-500 disabled:opacity-40">
          {dangGui ? 'Đang gửi…' : lan ? '📤 Gửi chấm lại' : '📤 Gửi chấm'}
        </button>
        <button onClick={lamMoi} title="Xem máy đã chấm xong chưa" className="min-h-[34px] rounded-lg border border-violet-300 bg-white px-2.5 text-[12px] font-semibold text-violet-700 active:bg-violet-50">↻</button>
      </div>
      {!daTra && <p className="mt-1 text-[11px] text-violet-500">Trên máy tính có thể dán ảnh bằng Ctrl+V.</p>}
      {tt?.cho_cham && tt.yeu_cau_at && (
        <p className="mt-1.5 rounded-lg bg-amber-50 px-2 py-1 text-[12px] font-medium text-amber-800">⏳ Đang chờ máy chấm (gửi lúc {gioVN(tt.yeu_cau_at)}). Máy chấm theo đợt — bấm ↻ để xem kết quả.</p>
      )}
      {loi && <p className="mt-1.5 rounded-lg bg-rose-50 px-2 py-1 text-[12px] font-medium text-rose-700">{loi}</p>}
      {bao && <p className="mt-1.5 text-[12px] font-semibold text-emerald-700">✓ {bao}</p>}

      {lan && (
        <div className="mt-2">
          {diem && (
            <p className="mb-1.5 flex items-baseline gap-2 rounded-lg bg-white px-2 py-1.5 text-[12px] text-slate-600">
              <span className="text-[18px] font-extrabold text-rose-600">{String(diem.diem).replace('.', ',')}</span>
              <span>điểm · {diem.so_y} ý, mỗi ý {String(Math.round(diem.gia_tri_y * 100) / 100).replace('.', ',')}{lan.chot_at ? '' : ' · theo gợi ý của máy'}</span>
            </p>
          )}
          {lan.nhan_xet_chung && <p className="mb-1.5 rounded-lg bg-white px-2 py-1.5 text-[12px] text-slate-700"><b>Nhận xét chung:</b> {lan.nhan_xet_chung}</p>}
          <p className="mb-1 text-[11px] text-slate-500">
            {lan.chot_at ? <>✓ Đã xác nhận{lan.so_cau_sua ? ` · sửa ${lan.so_cau_sua} câu so với máy` : ''}. </> : <>Máy gợi ý — kiểm tra rồi bấm Xác nhận. </>}
            {soKhongChac > 0 && !lan.chot_at && <span className="font-semibold text-amber-700">{soKhongChac} câu máy không chắc (nền vàng).</span>}
          </p>
          <div className="flex flex-col gap-1">
            {probs.map((p) => {
              const ai = aiCua(p.id)
              return (
                <div key={p.id} className={`rounded-lg px-1.5 py-1 ${ai && !ai.chac ? 'bg-amber-100' : !ai ? 'bg-slate-100' : 'bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-[12px] text-slate-600">
                      <b>{tenCau(p)}</b>{!ai && <span className="text-slate-400"> · máy không thấy câu này</span>}
                      {ai?.y && ai.y.length > 0 && <span className="ml-1.5 text-[11px] text-slate-400">{ai.y.map((y) => `${y.ten} ${y.result === 'correct' ? 'Đ' : y.result === 'partial' ? 'C' : 'S'}`).join(' · ')}</span>}
                    </span>
                    <div className="flex gap-1">
                      {NUT.map((k) => (
                        <button key={k.v} disabled={!!lan.chot_at || dong}
                          onClick={() => setChon((m) => ({ ...m, [p.id]: m[p.id] === k.v ? undefined : k.v }))}
                          className={`h-8 w-9 rounded-lg border text-[12.5px] font-bold ${chon[p.id] === k.v ? k.on : 'border-slate-200 bg-white text-slate-500'} disabled:opacity-60`}>{k.lbl}</button>
                      ))}
                    </div>
                  </div>
                  {(nx[p.id] || (chon[p.id] && chon[p.id] !== 'correct')) && (
                    <input value={nx[p.id] ?? ''} disabled={!!lan.chot_at || dong} onChange={(e) => setNx((m) => ({ ...m, [p.id]: e.target.value }))}
                      placeholder="Nhận xét 1 dòng" className="mt-1 w-full rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[11.5px] text-slate-700 disabled:bg-transparent" />
                  )}
                </div>
              )
            })}
          </div>
          {!lan.chot_at && (
            <button onClick={chot} disabled={dangChot || dong || !Object.values(chon).some(Boolean)}
              className="mt-2 min-h-[38px] w-full rounded-lg bg-emerald-600 text-[13px] font-bold text-white active:bg-emerald-500 disabled:opacity-40">
              {dangChot ? 'Đang ghi…' : '✓ Xác nhận & ghi Đ/C/S'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
