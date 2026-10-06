// LUYỆN CHỨNG MINH — điền ô (spec-dien-o.md §0b, §6; D2/D3). HS thấy lời giải chi tiết với 1–4 ô trống ⟦oN⟧, mỗi ô 4 nút.
// Chọn ô nào → khoá ô đó, tô đúng/sai, ĐIỀN đáp án đúng vào chỗ trống, mở ô kế (CEO 09/09: "đến đâu hiện đúng sai đến đấy").
// Chọn hết → gọi RPC hs_dien_tra_loi (chấm ở DB: Đ/C/S) → hiện verdict + lời giải đầy đủ. HS KHÔNG thấy nhãn lỗi/đường sai.
// Bản HS thấy (bai_test_cau.dien) đã cắt key ở server; đáp án đúng client lấy từ dap_an_key (tự luyện = chế độ reveal, như TN).
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { MathText } from '../kho/ui'
import { getBaiTestFull, moBaiLam, nopBai, type BaiTestCau } from '../../lib/testonline'
import { sinhTuLuyenDienO, traLoiDienO, monCuaHS, type DienHsView } from '../../lib/tuluyen'
import { NutHS, MAU, THE, HEAD } from './skin/KhungHS'

const CHU = ['A', 'B', 'C', 'D']
// Thùy 29/09: màu theo skin em chọn (skin/KhungHS). Nền ngữ nghĩa đúng/sai/đang mở = trong suốt ⇒ đứng được trên skin tối.
const BG_DUNG = 'rgba(34,160,107,0.16)', BG_SAI = 'rgba(229,72,77,0.16)', BG_CB = 'rgba(224,144,30,0.16)'
const VIEN_DUNG = 'rgba(34,160,107,0.45)', VIEN_SAI = 'rgba(229,72,77,0.45)', VIEN_CB = 'rgba(224,144,30,0.4)'
const NEN_TRANG: CSSProperties = { background: 'var(--sk-nen-trong)', color: MAU.ink, fontFamily: 'var(--sk-font)' }
type Chon = Record<string, number> // o.id → index đã chọn

// Điền text vào chỗ ⟦oN⟧: nếu ⟦oN⟧ nằm trong $…$ thì bỏ dấu $ của phương án (đã là LaTeX), ngoài thì giữ nguyên chữ.
function dienVao(text: string, oId: string, thay: string | null): string {
  const tag = `⟦${oId}⟧`; const i = text.indexOf(tag); if (i < 0) return text
  const trongMath = (text.slice(0, i).match(/\$/g) || []).length % 2 === 1
  const t = thay == null ? (trongMath ? '\\boxed{\\;?\\;}' : '⟦ ? ⟧') : (trongMath ? thay.replace(/^\$|\$$/g, '') : thay)
  return text.slice(0, i) + t + text.slice(i + tag.length)
}

export function DienOCau({ cau, baiLamId, daLam, onKq }: {
  cau: BaiTestCau & { dien: DienHsView }; baiLamId: string
  daLam?: { dap_an_hs: number[]; verdict: string } | null
  onKq: (kq: { verdict: string; ti_le: number }) => void
}) {
  const key = (cau.dap_an_key as string[]) ?? []
  const [chon, setChon] = useState<Chon>(() => Object.fromEntries((daLam?.dap_an_hs ?? []).map((v, i) => [cau.dien.o[i]?.id, v]).filter(([k]) => k)))
  const [kq, setKq] = useState<{ verdict: string; ti_le: number } | null>(daLam ? { verdict: daLam.verdict, ti_le: -1 } : null)
  const [busy, setBusy] = useState(false)
  const oList = cau.dien.o
  const oDangMo = oList.findIndex((o) => chon[o.id] == null) // ô kế tiếp chưa chọn
  const xongHet = oDangMo === -1

  useEffect(() => {
    if (!xongHet || kq || busy) return
    setBusy(true)
    traLoiDienO(baiLamId, cau.id, oList.map((o) => chon[o.id]))
      .then((r) => { setKq({ verdict: r.verdict, ti_le: r.ti_le }); onKq({ verdict: r.verdict, ti_le: r.ti_le }) })
      .catch((e) => console.error(e)).finally(() => setBusy(false))
  }, [xongHet]) // eslint-disable-line

  // Text từng bước: ô đã chọn → điền ĐÁP ÁN ĐÚNG (dù chọn sai, để lời giải luôn đúng); ô chưa chọn → ô trống
  const buocHien = useMemo(() => cau.dien.buoc.map((b) => {
    let t = b.text
    for (const [i, o] of oList.entries()) if (o.buoc === b.k) t = dienVao(t, o.id, chon[o.id] != null ? o.phuong_an[CHU.indexOf(key[i])] ?? null : null)
    return { k: b.k, text: t }
  }), [cau, chon, oList, key])

  return (
    <div>
      <div className="space-y-1.5">
        {buocHien.map((b) => {
          const oIdx = oList.findIndex((o) => o.buoc === b.k)
          const o = oIdx >= 0 ? oList[oIdx] : null
          const dangMo = o && oIdx === oDangMo
          const daChon = o && chon[o.id] != null
          const dung = o && daChon && CHU[chon[o.id]] === key[oIdx]
          const mo = o && (dangMo || daChon)
          return (
            <div key={b.k} className="rounded-xl px-3 py-2 text-[15px] leading-relaxed"
              style={{ color: MAU.ink, ...(o ? (daChon ? { background: dung ? BG_DUNG : BG_SAI } : dangMo ? { background: BG_CB, boxShadow: `inset 0 0 0 1px ${VIEN_CB}` } : { background: MAU.surface2 }) : {}) }}>
              <MathText>{b.text}</MathText>
              {o && mo && (
                <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {o.phuong_an.map((p, i) => {
                    const laChon = chon[o.id] === i, laDung = daChon && CHU[i] === key[oIdx]
                    return (
                      <button key={i} disabled={!!daChon} onClick={() => setChon((c) => ({ ...c, [o.id]: i }))}
                        className="flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[14px] transition"
                        style={laDung ? { borderColor: VIEN_DUNG, background: BG_DUNG, color: MAU.ink } : laChon ? { borderColor: VIEN_SAI, background: BG_SAI, color: MAU.ink } : { borderColor: MAU.line, background: MAU.surface, color: MAU.ink }}>
                        {/* chữ trắng chỉ trên nền đúng/sai đặc (màu ngữ nghĩa cố định) */}
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                          style={laDung ? { background: MAU.dung, color: '#fff' } : laChon ? { background: MAU.sai, color: '#fff' } : { background: MAU.surface2, color: MAU.muted }}>{CHU[i]}</span>
                        <span className="flex-1 pt-0.5"><MathText>{p}</MathText></span>
                      </button>
                    )
                  })}
                </div>
              )}
              {o && !mo && <div className="mt-1 text-[12px]" style={{ color: MAU.muted }}>Chọn ô phía trên trước</div>}
            </div>
          )
        })}
      </div>
      {kq && (
        <div className="mt-3 rounded-xl p-3 text-[14px] font-medium"
          style={kq.verdict === 'correct' ? { background: BG_DUNG, color: MAU.dung } : kq.verdict === 'partial' ? { background: BG_CB, color: MAU.canhBao } : { background: BG_SAI, color: MAU.sai }}>
          {kq.verdict === 'correct' ? '🎉 Đúng hết các ô!' : kq.verdict === 'partial' ? `👍 Đúng một phần${kq.ti_le >= 0 ? ` (${Math.round(kq.ti_le * 100)}%)` : ''}` : '💪 Sai nhiều ô — đọc lại lời giải đầy đủ ở trên nhé.'}
        </div>
      )}
      {busy && <p className="mt-2 text-[12px]" style={{ color: MAU.muted }}>Đang chấm…</p>}
    </div>
  )
}

// Luồng "Luyện chứng minh": sinh lượt (RPC) → làm từng bài → kết quả → luyện tiếp.
export function LamDienO({ hocSinhId, onXong, desktop }: { hocSinhId: string; onXong: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'tai' | 'lam' | 'trong'>('tai')
  const [err, setErr] = useState<string | null>(null)
  const [baiTestId, setBaiTestId] = useState<string | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [caus, setCaus] = useState<(BaiTestCau & { dien: DienHsView })[]>([])
  const [daLam, setDaLam] = useState<Record<string, { dap_an_hs: number[]; verdict: string }>>({})
  const [idx, setIdx] = useState(0)
  const [kqs, setKqs] = useState<Record<string, string>>({})

  async function sinh() {
    setState('tai'); setErr(null)
    try {
      const mon = await monCuaHS() // 01/10: bỏ đường lùi cứng 'Toán'
      if (!mon) throw new Error('Chưa xác định được môn học của em — báo thầy cô nhé.')
      const { baiTestId: id } = await sinhTuLuyenDienO(mon, 3)
      const f = await getBaiTestFull(id)
      const bl = await moBaiLam(id, hocSinhId)
      setBaiTestId(id); setBaiLamId(bl.id)
      setCaus(f.caus.filter((c) => c.loai_cau === 'dien_o' && (c as any).dien) as any)
      setDaLam(Object.fromEntries(Object.entries(f.daLam).map(([k, v]) => [k, { dap_an_hs: (v.dap_an_hs as number[]) ?? [], verdict: v.verdict ?? 'wrong' }])))
      setKqs({}); setIdx(0); setState('lam')
    } catch (e: any) { setErr(e.message ?? String(e)); setState('trong') }
  }
  useEffect(() => { sinh() }, []) // eslint-disable-line
  const xongHet = caus.length > 0 && caus.every((c) => kqs[c.id] || daLam[c.id])
  useEffect(() => { if (xongHet && baiLamId) nopBai(baiLamId).catch(() => {}) }, [xongHet, baiLamId])

  const khung = desktop ? 'mx-auto max-w-3xl px-6 py-6 lg:max-w-4xl' : 'mx-auto max-w-md px-4 py-4 md:max-w-3xl lg:max-w-4xl'
  if (state === 'tai') return <div className="flex min-h-screen items-center justify-center text-sm" style={{ ...NEN_TRANG, color: MAU.muted }}>Đang chọn bài chứng minh…</div>
  if (state === 'trong' || !baiTestId || !baiLamId) return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center" style={NEN_TRANG}>
      <p className="text-3xl">📐</p>
      <p className="mt-3 text-[15px] font-medium" style={{ color: MAU.ink }}>{err ?? 'Chưa có bài chứng minh để luyện.'}</p>
      <NutHS phu onClick={onXong} className="mt-6 px-6 !text-sm !font-medium">Về trang chính</NutHS>
    </div>
  )
  const cau = caus[idx]
  return (
    <div className="min-h-screen" style={NEN_TRANG}>
      <div className={khung}>
        <div className="mb-3 flex items-center justify-between">
          <button onClick={onXong} className="text-[13px]" style={{ color: MAU.muted }}>‹ Thoát</button>
          <p className="text-[13px] font-semibold" style={{ color: MAU.muted }}>Luyện chứng minh · bài {Math.min(idx + 1, caus.length)}/{caus.length}</p>
        </div>
        {cau ? (
          <div className={desktop ? 'p-8' : 'p-4'} style={THE}>
            <div className="mb-3 text-[15px] leading-relaxed" style={{ color: MAU.ink }}><MathText>{cau.noi_dung ?? ''}</MathText></div>
            {/* nền trắng giữ cố định: hình vẽ PNG nét đen nền trong, trên skin tối sẽ mất nét */}
            {cau.anh_de && <img src={cau.anh_de} alt="hình" className="mb-3 max-h-72 rounded-lg border bg-white" style={{ borderColor: MAU.line }} />}
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: MAU.muted }}>Điền vào chỗ trống trong lời giải</p>
            <DienOCau key={cau.id} cau={cau} baiLamId={baiLamId} daLam={daLam[cau.id] ?? null} onKq={(k) => setKqs((s) => ({ ...s, [cau.id]: k.verdict }))} />
            {(kqs[cau.id] || daLam[cau.id]) && (
              <NutHS onClick={() => setIdx((i) => i + 1)} className="mt-4 w-full px-6 !text-sm">
                {idx + 1 < caus.length ? 'Bài tiếp theo →' : 'Xem kết quả'}
              </NutHS>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center" style={desktop ? THE : undefined}>
            <p className="text-4xl">🏆</p>
            <p className="mt-3 text-2xl font-bold" style={{ ...HEAD, color: MAU.ink }}>{caus.filter((c) => (kqs[c.id] ?? daLam[c.id]?.verdict) === 'correct').length} / {caus.length} bài đúng hết</p>
            <p className="mt-1 text-[13px]" style={{ color: MAU.muted }}>Đúng một phần vẫn được tính điểm. Đọc lại lời giải để nhớ lý do nhé.</p>
            <NutHS onClick={sinh} className="mt-6 px-6 !text-sm">Luyện lượt mới</NutHS>
            <NutHS phu onClick={onXong} className="mt-2 px-6 !text-sm !font-medium">Về trang chính</NutHS>
          </div>
        )}
      </div>
    </div>
  )
}
