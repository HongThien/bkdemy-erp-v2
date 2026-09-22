// CHẤM ĐCS BỔ TRỢ ĐUỔI — phía TRỢ GIẢNG (Thùy 21/09: "TA không còn dùng ERP nữa, câu hỏi cho TA phải
// nằm ở app TA"). 1 em × 1 dạng, kịch bản 2/3 (không có MCQ hoặc không có thiết bị — xem kichBanDuoi()
// trong lib/botro_duoi.ts). Sinh bài (luyện không giới hạn lượt, hoặc test 10 câu cố định) → TA chấm
// TRỰC TIẾP Đúng/Chưa đạt/Sai từng câu (KHÔNG transcribe A-D như bên Bổ trợ Yếu — Đuổi có cả câu tự
// luận nên ABCD không tổng quát được) → Nộp (chỉ bài test — nộp mới tính ngưỡng ≥50% mở dạng).
// Hiện BẢNG — mỗi câu 1 dòng (Thùy 21/09: "dạng có 7 câu thì hiện cả 7 câu 7 dòng"), không phải card
// rời từng câu. KHÔNG import màn ERP desktop (luật app TA, xem CaBoTroTA.tsx:5).
import { useEffect, useState } from 'react'
import {
  baiTestChoChamDuoi, sinhBaiGiayDuoi, layCauBaiTest, layVerdictDaCham, chamTayCauDuoi, nopBaiGiayDuoi,
  type CauGiayDuoi,
} from '../../lib/botro_duoi'
import { MathText } from '../kho/ui'
import { BKTabHeader } from '../../components/bk/BKUI'

const DCS: { v: 'correct' | 'partial' | 'wrong'; lbl: string; cls: string; selCls: string }[] = [
  { v: 'correct', lbl: 'Đ', cls: 'border border-emerald-300 bg-white text-emerald-700', selCls: 'bg-emerald-600 text-white' },
  { v: 'partial', lbl: 'C', cls: 'border border-amber-300 bg-white text-amber-700', selCls: 'bg-amber-500 text-white' },
  { v: 'wrong', lbl: 'S', cls: 'border border-rose-300 bg-white text-rose-700', selCls: 'bg-rose-600 text-white' },
]

export default function DuoiGiayTA({ buoiId, hocSinhId, mon, maDang, hoTen, onBack, onXong }: {
  buoiId: string; hocSinhId: string; mon: string; maDang: string; hoTen?: string; onBack: () => void; onXong: () => void
}) {
  const [loai, setLoai] = useState<'htd_luyen' | 'htd_test' | null>(null)
  const [baiTestId, setBaiTestId] = useState<string | null>(null)
  const [caus, setCaus] = useState<CauGiayDuoi[]>([])
  const [busy, setBusy] = useState(true) // true khi mở màn — đang soát có bài TEST đang chờ nộp không
  const [checked, setChecked] = useState(false) // xong lượt soát ban đầu — tránh loé nút "sinh bài" trước khi biết có bài chờ hay không
  const [daNop, setDaNop] = useState(false)

  // Mở màn: nếu có bài TEST đang chờ TA chấm ĐCS cho đúng (em × dạng) thì resume — tránh bấm lại "Bài
  // kiểm tra" đẻ bài thứ 2 (câu khác, mất chấm dở bài đầu). Luyện không resume (mỗi lần = 1 lượt mới,
  // đúng tinh thần Yếu "in nhiều phiếu được"; luyện không tính mastery nên không cần TA nhập gì).
  // baiTestChoChamDuoi lọc theo LOẠI CÂU (không phải in_giay_at, đổi 22/09) — phủ cả bài TA tự in
  // (kịch bản 3, không thiết bị) lẫn bài chính em tự sinh qua "Học từ đầu" khi dạng chưa có MCQ (kịch
  // bản 2, có iPad) — không đụng bài online trắc nghiệm thật của em (bài học đau 21/09).
  useEffect(() => {
    let live = true
    baiTestChoChamDuoi(hocSinhId, mon, maDang).then((r) => {
      if (!live) return
      if (r) moLai(r.bai_test_id, 'htd_test')
      else setBusy(false)
    }).catch(() => { if (live) setBusy(false) }).finally(() => { if (live) setChecked(true) })
    return () => { live = false }
  }, []) // eslint-disable-line

  async function sinh(loaiMoi: 'htd_luyen' | 'htd_test') {
    setBusy(true)
    try {
      const r = await sinhBaiGiayDuoi(buoiId, hocSinhId, mon, maDang, loaiMoi)
      setBaiTestId(r.bai_test_id); setLoai(loaiMoi); setDaNop(false)
      setCaus(await layCauBaiTest(r.bai_test_id))
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function moLai(id: string, loaiCu: 'htd_luyen' | 'htd_test') {
    setBusy(true)
    try {
      const [cs, vd] = await Promise.all([layCauBaiTest(id), layVerdictDaCham(id, hocSinhId)])
      setBaiTestId(id); setLoai(loaiCu)
      setCaus(cs.map((c) => ({ ...c, verdict: vd[c.id] ?? null })))
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function cham(cauId: string, v: 'correct' | 'partial' | 'wrong' | null) {
    try { await chamTayCauDuoi(cauId, v); setCaus((cs) => cs.map((c) => (c.id === cauId ? { ...c, verdict: v } : c))) }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function nop() {
    if (!baiTestId) return
    if (!confirm('Nộp bài? Câu chưa chấm sẽ tính là sai — không sửa được sau khi nộp.')) return
    setBusy(true)
    try { const r = await nopBaiGiayDuoi(baiTestId); setDaNop(true); alert(`Đã nộp — đúng ${r.so_dung}/${r.so_cau} câu.`); onXong() }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div>
      <BKTabHeader onBack={onBack} icon="/bk-ui/pr_tai_nghe.png" title={`Chấm tay · ${maDang}`}
        sub={hoTen ? `${hoTen} · ${mon}` : mon} />
      <div className="mx-auto max-w-[1000px] px-2 pb-8 pt-1">
        {!checked ? (
          <p className="px-1 text-[13px] text-slate-400">Đang kiểm tra bài đang chờ…</p>
        ) : !baiTestId ? (
          <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
            <p className="mb-3 text-[13px] text-slate-600">Chưa có bài nào đang chờ chấm cho dạng này. Nếu KHÔNG có thiết bị cho em, bấm sinh bài để in ra giấy. Nếu em có iPad, em tự vào "Học từ đầu" làm — quay lại đây khi em xong để nhập kết quả.</p>
            <div className="flex gap-2">
              <button onClick={() => sinh('htd_luyen')} disabled={busy} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[14px] font-bold text-slate-700 disabled:opacity-50">{busy ? '…' : 'In phiếu luyện'}</button>
              <button onClick={() => sinh('htd_test')} disabled={busy} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-[14px] font-bold text-white disabled:opacity-50">{busy ? '…' : 'In bài kiểm tra'}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[13px] font-bold text-slate-700">{loai === 'htd_test' ? 'Bài kiểm tra' : 'Phiếu luyện'} — {caus.length} câu</span>
              <button onClick={() => window.print()} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-600">🖨 In</button>
            </div>
            {/* Bảng câu của cả dạng — mỗi câu 1 dòng (Thùy 21/09), không phải card rời từng câu. */}
            <div id="duoi-giay-print-area" className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              {caus.map((c, i) => (
                <div key={c.id} className="flex items-start gap-2 p-3">
                  <span className="mt-0.5 w-5 shrink-0 text-[12px] font-bold text-slate-400">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] leading-snug text-slate-800"><MathText>{c.noi_dung ?? ''}</MathText></div>
                    {c.lua_chon && (
                      <ol className="mt-1 list-inside list-[upper-alpha] space-y-0.5 text-[12.5px] text-slate-500">
                        {c.lua_chon.map((x, j) => <li key={j}><MathText>{x}</MathText></li>)}
                      </ol>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1 duoi-giay-cham">
                    {DCS.map((k) => (
                      <button key={k.v} onClick={() => cham(c.id, c.verdict === k.v ? null : k.v)} disabled={daNop}
                        className={`h-8 w-8 rounded-lg text-[13px] font-bold ${c.verdict === k.v ? k.selCls : k.cls} disabled:opacity-50`}>{k.lbl}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={onBack} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[14px] font-bold text-slate-600">Đóng</button>
              {loai === 'htd_test' && !daNop && (
                <button onClick={nop} disabled={busy} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-[14px] font-bold text-white disabled:opacity-50">{busy ? '…' : 'Nộp bài'}</button>
              )}
              {daNop && <span className="flex-1 rounded-xl bg-emerald-100 py-2.5 text-center text-[14px] font-bold text-emerald-700">✓ Đã nộp</span>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
