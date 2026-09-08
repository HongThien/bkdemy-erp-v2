// LUYỆN CHỨNG MINH — điền ô (spec-dien-o.md §0b, §6; D2/D3). HS thấy lời giải chi tiết với 1–4 ô trống ⟦oN⟧, mỗi ô 4 nút.
// Chọn ô nào → khoá ô đó, tô đúng/sai, ĐIỀN đáp án đúng vào chỗ trống, mở ô kế (CEO 09/09: "đến đâu hiện đúng sai đến đấy").
// Chọn hết → gọi RPC hs_dien_tra_loi (chấm ở DB: Đ/C/S) → hiện verdict + lời giải đầy đủ. HS KHÔNG thấy nhãn lỗi/đường sai.
// Bản HS thấy (bai_test_cau.dien) đã cắt key ở server; đáp án đúng client lấy từ dap_an_key (tự luyện = chế độ reveal, như TN).
import { useEffect, useMemo, useState } from 'react'
import { MathText } from '../kho/ui'
import { getBaiTestFull, moBaiLam, nopBai, type BaiTestCau } from '../../lib/testonline'
import { sinhTuLuyenDienO, traLoiDienO, monCuaHS, type DienHsView } from '../../lib/tuluyen'

const CHU = ['A', 'B', 'C', 'D']
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
            <div key={b.k} className={`rounded-xl px-3 py-2 text-[15px] leading-relaxed text-ph-label ${o ? (daChon ? (dung ? 'bg-ph-green/10' : 'bg-ph-red/10') : dangMo ? 'bg-ph-orange/10 ring-1 ring-ph-orange/30' : 'bg-black/[0.03]') : ''}`}>
              <MathText>{b.text}</MathText>
              {o && mo && (
                <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {o.phuong_an.map((p, i) => {
                    const laChon = chon[o.id] === i, laDung = daChon && CHU[i] === key[oIdx]
                    return (
                      <button key={i} disabled={!!daChon} onClick={() => setChon((c) => ({ ...c, [o.id]: i }))}
                        className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[14px] transition ${
                          laDung ? 'border-ph-green/40 bg-ph-green/10' : laChon ? 'border-ph-red/40 bg-ph-red/10' : 'border-black/[0.08] bg-white'}`}>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${laDung ? 'bg-ph-green text-white' : laChon ? 'bg-ph-red text-white' : 'bg-black/[0.05] text-ph-label-2'}`}>{CHU[i]}</span>
                        <span className="flex-1 pt-0.5"><MathText>{p}</MathText></span>
                      </button>
                    )
                  })}
                </div>
              )}
              {o && !mo && <div className="mt-1 text-[12px] text-ph-label-2">Chọn ô phía trên trước</div>}
            </div>
          )
        })}
      </div>
      {kq && (
        <div className={`mt-3 rounded-xl p-3 text-[14px] font-medium ${kq.verdict === 'correct' ? 'bg-ph-green/10 text-ph-green' : kq.verdict === 'partial' ? 'bg-ph-orange/10 text-ph-orange' : 'bg-ph-red/10 text-ph-red'}`}>
          {kq.verdict === 'correct' ? '🎉 Đúng hết các ô!' : kq.verdict === 'partial' ? `👍 Đúng một phần${kq.ti_le >= 0 ? ` (${Math.round(kq.ti_le * 100)}%)` : ''}` : '💪 Sai nhiều ô — đọc lại lời giải đầy đủ ở trên nhé.'}
        </div>
      )}
      {busy && <p className="mt-2 text-[12px] text-ph-label-2">Đang chấm…</p>}
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
      const mon = (await monCuaHS()) ?? 'Toán'
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

  const khung = desktop ? 'mx-auto max-w-3xl px-6 py-6' : 'mx-auto max-w-md px-4 py-4'
  if (state === 'tai') return <div className={`flex min-h-screen items-center justify-center text-sm text-ph-label-2 ${desktop ? 'bg-[#f4f7fb]' : 'bg-ios'}`}>Đang chọn bài chứng minh…</div>
  if (state === 'trong' || !baiTestId || !baiLamId) return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-6 text-center ${desktop ? 'bg-[#f4f7fb]' : 'bg-ios'}`}>
      <p className="text-3xl">📐</p>
      <p className="mt-3 text-[15px] font-medium text-ph-label">{err ?? 'Chưa có bài chứng minh để luyện.'}</p>
      <button onClick={onXong} className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-medium text-ph-label-2 shadow-sm">Về trang chính</button>
    </div>
  )
  const cau = caus[idx]
  return (
    <div className={`min-h-screen ${desktop ? 'bg-[#f4f7fb]' : 'bg-ios'}`}>
      <div className={khung}>
        <div className="mb-3 flex items-center justify-between">
          <button onClick={onXong} className="text-[13px] text-ph-label-2">‹ Thoát</button>
          <p className="text-[13px] font-semibold text-ph-label-2">Luyện chứng minh · bài {Math.min(idx + 1, caus.length)}/{caus.length}</p>
        </div>
        {cau ? (
          <div className={desktop ? 'rounded-[26px] bg-white p-8 shadow-[0_16px_40px_rgba(31,47,79,0.08)]' : 'rounded-2xl bg-white p-4 shadow-sm'}>
            <div className="mb-3 text-[15px] leading-relaxed text-ph-label"><MathText>{cau.noi_dung ?? ''}</MathText></div>
            {cau.anh_de && <img src={cau.anh_de} alt="hình" className="mb-3 max-h-72 rounded-lg border border-black/[0.08] bg-white" />}
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ph-label-2">Điền vào chỗ trống trong lời giải</p>
            <DienOCau key={cau.id} cau={cau} baiLamId={baiLamId} daLam={daLam[cau.id] ?? null} onKq={(k) => setKqs((s) => ({ ...s, [cau.id]: k.verdict }))} />
            {(kqs[cau.id] || daLam[cau.id]) && (
              <button onClick={() => setIdx((i) => i + 1)} className="mt-4 w-full rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white">
                {idx + 1 < caus.length ? 'Bài tiếp theo →' : 'Xem kết quả'}
              </button>
            )}
          </div>
        ) : (
          <div className={`flex flex-col items-center py-10 text-center ${desktop ? 'rounded-[26px] bg-white shadow-sm' : ''}`}>
            <p className="text-4xl">🏆</p>
            <p className="mt-3 text-2xl font-bold text-ph-label">{caus.filter((c) => (kqs[c.id] ?? daLam[c.id]?.verdict) === 'correct').length} / {caus.length} bài đúng hết</p>
            <p className="mt-1 text-[13px] text-ph-label-2">Đúng một phần vẫn được tính điểm. Đọc lại lời giải để nhớ lý do nhé.</p>
            <button onClick={sinh} className="mt-6 rounded-xl bg-brand/10 px-6 py-3 text-sm font-medium text-brand">Luyện lượt mới</button>
            <button onClick={onXong} className="mt-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-ph-label-2 shadow-sm">Về trang chính</button>
          </div>
        )}
      </div>
    </div>
  )
}
