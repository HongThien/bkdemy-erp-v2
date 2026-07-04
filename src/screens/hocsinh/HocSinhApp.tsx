// ============================================================================
// HocSinhApp — app HS-facing (mobile) làm BTVN online. Slice 1: trắc nghiệm + trả lời ngắn.
// Luồng (Thùy chốt): 1 câu/màn → chọn đáp án → "Xác nhận" (tránh ấn nhầm) → chấm tức thì
//   → hiện đáp án + lời giải chi tiết của câu → "Câu tiếp". BTVN reveal ngay, làm lại tới hạn.
// Skin = plain-clean; game (Fredoka/mascot/gradient) làm phiên design sau.
// ============================================================================
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MathText } from '../kho/ui'
import {
  listBaiTestCuaHS, getBaiTestFull, moBaiLam, traLoiCau, baoSai, chuCaiChon,
  type BaiTestCuaHS, type BaiTestFull, type BaiLamCau,
} from '../../lib/testonline'

type CauState = { chon: number | string | null; kq: { verdict: string; key: unknown; baiLamCauId: string } | null; baoRoi?: boolean }

export default function HocSinhApp({ hocSinhId, hoTen }: { hocSinhId: string; hoTen: string }) {
  const [tests, setTests] = useState<BaiTestCuaHS[] | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => { listBaiTestCuaHS().then(setTests).catch(() => setTests([])) }, [])

  if (activeId) return <LamBai baiTestId={activeId} hocSinhId={hocSinhId} onXong={() => { setActiveId(null); listBaiTestCuaHS().then(setTests) }} />

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 px-4 pb-10">
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="text-[13px] text-slate-400">Xin chào</p>
          <p className="text-lg font-semibold text-slate-900">{hoTen} 👋</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-500">Thoát</button>
      </div>

      <h2 className="mb-2 mt-2 text-[13px] font-semibold uppercase tracking-wide text-slate-400">Bài tập về nhà</h2>
      {tests === null && <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>}
      {tests?.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-3xl">🎉</p>
          <p className="mt-2 text-sm font-medium text-slate-700">Chưa có bài tập nào</p>
          <p className="mt-1 text-[13px] text-slate-400">Khi thầy cô giao BTVN, bài sẽ hiện ở đây.</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {tests?.map((t) => {
          const lam = t.bai_lam
          const daNop = lam?.trang_thai === 'da_nop'
          return (
            <button key={t.id} onClick={() => setActiveId(t.id)}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition active:scale-[0.99]">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-slate-900">BTVN {t.mon} · {t.lop_ten}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${daNop ? 'bg-emerald-50 text-emerald-700' : lam ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'}`}>
                  {daNop ? 'đã làm' : lam ? 'đang làm' : 'mới'}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-slate-500">Buổi {fmtNgay(t.ngay)} · {t.so_cau} câu</p>
              <p className="mt-2 text-[13px] font-medium text-indigo-600">{lam ? 'Tiếp tục' : 'Bắt đầu'} →</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LamBai({ baiTestId, hocSinhId, onXong }: { baiTestId: string; hocSinhId: string; onXong: () => void }) {
  const [full, setFull] = useState<BaiTestFull | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [st, setSt] = useState<Record<string, CauState>>({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      const f = await getBaiTestFull(baiTestId)
      setFull(f)
      const bl = await moBaiLam(baiTestId, hocSinhId)
      setBaiLamId(bl.id)
      // Khôi phục câu đã làm (reveal lại kết quả)
      const init: Record<string, CauState> = {}
      for (const [cauId, r] of Object.entries(f.daLam)) {
        const c = f.caus.find((x) => x.id === cauId)
        init[cauId] = { chon: (r as BaiLamCau).dap_an_hs as number | string, kq: { verdict: (r as BaiLamCau).verdict ?? 'wrong', key: c?.dap_an_key, baiLamCauId: (r as BaiLamCau).id } }
      }
      setSt(init)
    })().catch(console.error)
  }, [baiTestId, hocSinhId])

  if (!full) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải bài…</div>
  const caus = full.caus
  const total = caus.length
  const daXongHet = caus.every((c) => st[c.id]?.kq)
  const cau = caus[idx]
  const cs = cau ? st[cau.id] : undefined
  const daCham = !!cs?.kq

  function setChon(v: number | string) {
    if (!cau || daCham) return
    setSt((s) => ({ ...s, [cau.id]: { chon: v, kq: null } }))
  }

  async function xacNhan() {
    if (!cau || !baiLamId || cs?.chon == null || cs?.chon === '') return
    setBusy(true)
    try {
      const kq = await traLoiCau(baiLamId, cau, cs.chon)
      setSt((s) => ({ ...s, [cau.id]: { chon: cs.chon, kq: { verdict: kq.verdict, key: kq.key, baiLamCauId: kq.baiLamCauId } } }))
    } finally { setBusy(false) }
  }

  async function guiBaoSai() {
    if (!cau || !cs?.kq) return
    await baoSai(cs.kq.baiLamCauId, hocSinhId, 'Em nghĩ mình đúng.')
    setSt((s) => ({ ...s, [cau.id]: { ...s[cau.id], baoRoi: true } }))
  }

  // Màn kết quả cuối
  if (idx >= total) {
    const dung = caus.filter((c) => st[c.id]?.kq?.verdict === 'correct').length
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">🏆</div>
        <p className="mt-4 text-2xl font-bold text-slate-900">{dung} / {total} đúng</p>
        <p className="mt-1 text-[13px] text-slate-500">Làm lại được tới hạn nộp. Kết quả gửi thầy cô tham khảo.</p>
        <button onClick={onXong} className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white">Về danh sách</button>
      </div>
    )
  }

  const chuAn = cau.loai_cau === 'trac_nghiem'
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-50">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onXong} className="text-slate-400">✕</button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="text-[12px] text-slate-500">{idx + 1}/{total}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-[13px] font-semibold text-slate-400">Câu {idx + 1}</p>
          {cau.noi_dung && <div className="mb-3 text-[15px] leading-relaxed text-slate-800"><MathText>{cau.noi_dung}</MathText></div>}

          {chuAn ? (
            <div className="flex flex-col gap-2.5">
              {(cau.lua_chon ?? []).map((opt, i) => {
                const chon = cs?.chon === i
                const laDapAn = daCham && chuCaiChon(i) === String(cau.dap_an_key)
                const chonSai = daCham && chon && !laDapAn
                return (
                  <button key={i} onClick={() => setChon(i)} disabled={daCham}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-[15px] transition ${
                      laDapAn ? 'border-emerald-400 bg-emerald-50' : chonSai ? 'border-rose-400 bg-rose-50' : chon ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                      laDapAn ? 'bg-emerald-500 text-white' : chonSai ? 'bg-rose-500 text-white' : chon ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{chuCaiChon(i)}</span>
                    <span className="flex-1 pt-0.5"><MathText>{stripLabel(opt)}</MathText></span>
                  </button>
                )
              })}
            </div>
          ) : (
            <input value={(cs?.chon as string) ?? ''} onChange={(e) => setChon(e.target.value)} disabled={daCham}
              placeholder="Nhập đáp án…" inputMode="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-indigo-500 disabled:bg-slate-50" />
          )}

          {daCham && (
            <div className={`mt-4 rounded-xl p-3 ${cs!.kq!.verdict === 'correct' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              <p className={`text-[15px] font-semibold ${cs!.kq!.verdict === 'correct' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {cs!.kq!.verdict === 'correct' ? '🎉 Đúng rồi!' : '😔 Chưa đúng'}
              </p>
              {!chuAn && cs!.kq!.verdict !== 'correct' && <p className="mt-1 text-[13px] text-slate-600">Đáp án đúng: <b className="text-emerald-700">{String(cau.dap_an_key)}</b></p>}
              {cau.loi_giai && (
                <div className="mt-2 border-t border-black/5 pt-2 text-[14px] leading-relaxed text-slate-700">
                  <p className="mb-1 text-[12px] font-semibold uppercase text-slate-400">Lời giải</p>
                  <MathText>{cau.loi_giai}</MathText>
                </div>
              )}
              {cau.anh_dap_an && <img src={cau.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg border border-slate-200" />}
              {cs!.kq!.verdict !== 'correct' && (
                cs!.baoRoi
                  ? <p className="mt-2 text-[12px] text-slate-400">✓ Đã gửi ý kiến cho thầy cô.</p>
                  : <button onClick={guiBaoSai} className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-[12px] text-slate-600">🚩 Em nghĩ mình đúng</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        {idx > 0 && <button onClick={() => setIdx((i) => i - 1)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500">‹</button>}
        {!daCham ? (
          <button onClick={xacNhan} disabled={busy || cs?.chon == null || cs?.chon === ''}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white disabled:opacity-40">
            {busy ? 'Đang chấm…' : 'Xác nhận'}
          </button>
        ) : (
          <button onClick={() => setIdx((i) => i + 1)}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white">
            {idx + 1 < total ? 'Câu tiếp →' : (daXongHet ? 'Xem kết quả →' : 'Câu tiếp →')}
          </button>
        )}
      </div>
    </div>
  )
}

function fmtNgay(d: string): string { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}` }
// Bỏ nhãn "A." / "B." đầu lựa chọn (kho lưu "B. nội dung"; phần tử [0] thường mất nhãn).
function stripLabel(s: string): string { return s.replace(/^\s*[A-F][.)]\s*/, '') }
