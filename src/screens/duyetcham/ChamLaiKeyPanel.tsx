// ============================================================================
// "KEY SAI → chấm lại cả lớp" (spec-test-online §7).
//
// KHÁC hẳn tab bên cạnh. Tab kia = key ĐÚNG, HS viết cách khác cũng đúng → nới bộ
// đáp án. Ở đây = KEY SAI ⇒ cả lớp bị chấm oan, phải sửa key rồi chấm lại.
// Trộn hai đường là hỏng: nhét đáp-án-đúng vào cache khi key sai thì kho vẫn sai và
// lần phát hành sau lại sai tiếp.
//
// Dấu hiệu nhận biết: TỈ LỆ SAI CAO trên một câu. Cả lớp cùng sai một câu thì nghi
// key trước, nghi HS sau — nên màn này xếp theo tỉ lệ sai giảm dần.
//
// Chấm lại scope CỨNG theo `bai_test_cau_id`: KHÔNG lan sang test khác dù cùng mã kho.
// Mỗi lần phát hành là một phép đo riêng; sửa nhầm sang test cũ = ghi đè điểm đã chốt.
// ============================================================================
import { useEffect, useState } from 'react'
import { listCauNghiSaiKey, suaKeyVaChamLai, dongBaoSaiSauChamLai, tuChoiReports, chuCaiChon, type CauNghiSaiKey, type ChamLaiKetQua } from '../../lib/testonline'
import { MathText } from '../kho/ui'

const fmtNgay = (iso: string) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
const LOAI_LABEL: Record<string, string> = { et: 'ET', btvn: 'BTVN', giao_trinh: 'Giáo trình', de_thi: 'Đề thi' }
const keyRaText = (k: unknown) => (Array.isArray(k) ? k.join(' · ') : String(k ?? ''))

export default function ChamLaiKeyPanel() {
  const [rows, setRows] = useState<CauNghiSaiKey[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)        // cauId đang mở form
  const [keyMoi, setKeyMoi] = useState<string>('')          // TN: chữ cái · TLN: text
  const [dsMoi, setDsMoi] = useState<string[]>([])          // ĐS: mảng D/S
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  const [xong, setXong] = useState<{ cauId: string; kq: ChamLaiKetQua } | null>(null)

  async function reload() {
    setErr(null)
    try { setRows(await listCauNghiSaiKey()) } catch (e: any) { setErr(e?.message ?? String(e)); setRows([]) }
  }
  useEffect(() => { reload() }, [])

  function moForm(r: CauNghiSaiKey) {
    setMo(r.cauId); setXong(null); setLyDo('')
    if (r.loaiCau === 'dung_sai') { setDsMoi(Array.isArray(r.dapAnKey) ? [...(r.dapAnKey as string[])] : ['D', 'D', 'D', 'D']); setKeyMoi('') }
    else { setKeyMoi(String(r.dapAnKey ?? '')); setDsMoi([]) }
  }

  async function chamLai(r: CauNghiSaiKey) {
    const moi: unknown = r.loaiCau === 'dung_sai' ? dsMoi : keyMoi.trim()
    if (r.loaiCau !== 'dung_sai' && !String(moi).trim()) { setErr('Chưa nhập đáp án mới.'); return }
    if (keyRaText(moi) === keyRaText(r.dapAnKey)) { setErr('Đáp án mới trùng đáp án cũ — không có gì để chấm lại.'); return }
    if (!confirm(`Chấm lại câu ${r.thuTu} của ${r.test.lopTen}?\n\nĐáp án: "${keyRaText(r.dapAnKey)}" → "${keyRaText(moi)}"\nSẽ chấm lại ${r.daTraLoi} bài làm. Thao tác này có ghi vết.`)) return
    setBusy(true); setErr(null)
    try {
      const kq = await suaKeyVaChamLai(r.cauId, moi, lyDo)
      // Đóng 🚩 báo sai đề của câu này theo kết quả chấm lại (HS thành đúng ⇒ 'dung', còn lại 'sai').
      // Tách khỏi RPC chấm lại: lỗi ở đây không làm mất kết quả chấm — chỉ còn cờ chờ, đóng tay được.
      if (r.baoSai.reportIds.length) await dongBaoSaiSauChamLai(r.cauId)
      setXong({ cauId: r.cauId, kq }); setMo(null)
      await reload()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  // Đề/đáp án ĐÚNG, HS báo nhầm → đóng báo sai, key giữ nguyên, không chấm lại gì.
  async function deDung(r: CauNghiSaiKey) {
    if (!r.baoSai.reportIds.length) return
    if (!confirm(`Đóng ${r.baoSai.reportIds.length} báo sai của câu ${r.thuTu} (${r.test.lopTen})?\nĐáp án "${keyRaText(r.dapAnKey)}" giữ nguyên, không chấm lại.`)) return
    setBusy(true); setErr(null)
    try { await tuChoiReports(r.baoSai.reportIds); await reload() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  if (rows === null) return <p className="text-sm text-slate-400">Đang tải…</p>

  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      {err && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
      {xong && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
          Đã chấm lại <b>{xong.kq.soBai}</b> bài — Sai→Đúng <b>{xong.kq.saiThanhDung}</b> · Đúng→Sai <b>{xong.kq.dungThanhSai}</b> · không đổi {xong.kq.khongDoi}. Đã ghi vết.
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">
          Không có câu nào tỉ lệ sai bất thường, không có báo sai đề nào chờ. 🎉
          <div className="mt-1 text-[12px]">(ngưỡng: ≥3 HS đã trả lời và ≥70% sai · hoặc có HS 🚩 báo sai đề)</div>
        </div>
      ) : rows.map((r) => {
        const pct = Math.round(r.tiLeSai * 100)
        const nBao = r.baoSai.reportIds.length
        return (
          <div key={r.cauId} className={`rounded-2xl border bg-white shadow-sm ${nBao ? 'border-l-4 border-slate-200 border-l-rose-400' : 'border-slate-200'}`}>
            <div className="border-b border-slate-100 px-5 py-3">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px]">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">Câu {r.thuTu}</span>
                <span className="text-slate-500">{r.test.lopTen} · {LOAI_LABEL[r.test.loai] ?? r.test.loai} · {fmtNgay(r.test.ngay)} · {r.test.mon}</span>
                {r.maCau && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{r.maCau}</span>}
                <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-600 ring-1 ring-rose-200">{pct}% sai ({r.sai}/{r.daTraLoi})</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  Đáp án: <MathText className="inline">{keyRaText(r.dapAnKey)}</MathText>
                </span>
                {nBao > 0 && (
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-600 ring-1 ring-rose-200" title={r.baoSai.yKien.join(' · ') || undefined}>
                    🚩 {nBao} HS báo sai đề{r.baoSai.yKien[0] ? `: "${r.baoSai.yKien[0]}"` : ''}
                  </span>
                )}
                {r.lanChamLai > 0 && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-amber-200">đã chấm lại {r.lanChamLai} lần</span>}
              </div>
              <div className="text-[14px] leading-relaxed text-slate-800"><MathText>{r.noiDung}</MathText></div>
            </div>

            <div className="px-5 py-3">
              {mo !== r.cauId ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => moForm(r)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600">
                    Sửa đáp án + chấm lại cả lớp
                  </button>
                  {nBao > 0 && (
                    <button disabled={busy} onClick={() => deDung(r)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-40">
                      ✕ Đề đúng — đóng báo sai
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-semibold text-slate-500">Đáp án ĐÚNG là:</span>
                    {r.loaiCau === 'trac_nghiem' && [0, 1, 2, 3].map((i) => (
                      <button key={i} onClick={() => setKeyMoi(chuCaiChon(i))}
                        className={`h-8 w-8 rounded-lg border text-[13px] font-semibold transition ${
                          keyMoi === chuCaiChon(i) ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400'}`}>
                        {chuCaiChon(i)}
                      </button>
                    ))}
                    {r.loaiCau === 'tra_loi_ngan' && (
                      <input value={keyMoi} onChange={(e) => setKeyMoi(e.target.value)} placeholder="đáp án đúng"
                        className="w-48 rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-500" />
                    )}
                    {r.loaiCau === 'dung_sai' && dsMoi.map((v, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-1">
                        <span className="text-[12px] text-slate-500">Ý {i + 1}</span>
                        {(['D', 'S'] as const).map((o) => (
                          <button key={o} onClick={() => setDsMoi(dsMoi.map((x, j) => (j === i ? o : x)))}
                            className={`h-6 w-6 rounded text-[12px] font-semibold transition ${
                              v === o ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {o === 'D' ? 'Đ' : 'S'}
                          </button>
                        ))}
                      </span>
                    ))}
                  </div>
                  <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (ghi vào sổ chấm lại) — vd: nhập nhầm đáp án lúc soạn"
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-500" />
                  <div className="flex items-center gap-2">
                    <button disabled={busy} onClick={() => chamLai(r)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-40">
                      {busy ? 'Đang chấm lại…' : `Chấm lại ${r.daTraLoi} bài`}
                    </button>
                    <button disabled={busy} onClick={() => setMo(null)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 disabled:opacity-40">Huỷ</button>
                    <span className="text-[11.5px] text-slate-400">Chỉ ảnh hưởng ĐÚNG câu này của ĐÚNG lần phát hành này.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
