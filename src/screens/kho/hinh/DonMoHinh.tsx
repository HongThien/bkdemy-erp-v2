// B0.5 — DỌN MÔ HÌNH (spec-hinh-luyen.md §6). Thùy làm TAY, từng dòng.
// Vì sao có màn này (CEO 13/10): 41 mô hình đang có LẪN Học và Luyện (K8 26 mô hình đều là Học).
// Hình luyện chỉ được thấy mô hình `phan='luyen'`; NULL = chưa xem (vẫn hiện trong lưới); 'hoc' = ẩn.
// Xoá THẬT phải qua fn_hl_mo_hinh_se_mat (liệt kê trước) → fn_hl_xoa_mo_hinh (lá → gốc, Postgres
// từ chối khi còn mô hình con / lịch sử đo). Luật xoá CLAUDE.md: hiện đúng cái sẽ mất, chờ gật, mới xoá.
// Sau mutation VÁ DÒNG TẠI CHỖ (CLAUDE.md §2 React) — không quét lại danh sách.
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { DonMoHinhRow, MoHinhSeMat } from '../../../lib/kho/hinh'
import { MathText } from '../ui'
import { Btn, Chip, Empty, Ma, Note, tron } from './hinhUi'

type Loc = 'tat_ca' | 'chua_xem' | 'luyen' | 'hoc'

export default function DonMoHinh({ khoi, reload }: { khoi: string; reload: () => Promise<void> }) {
  const [rows, setRows] = useState<DonMoHinhRow[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [loc, setLoc] = useState<Loc>('tat_ca')
  const [xoa, setXoa] = useState<{ row: DonMoHinhRow; mat: MoHinhSeMat } | null>(null)
  const [bận, setBan] = useState<string | null>(null)

  const nap = useCallback(async () => {
    try { setLoi(null); setRows(await api.listDonMoHinh(khoi)) } catch (e: any) { setLoi(e.message ?? String(e)) }
  }, [khoi])
  useEffect(() => { setRows(null); nap() }, [nap])

  const ds = useMemo(() => (rows ?? []).filter((r) =>
    loc === 'tat_ca' ? true : loc === 'chua_xem' ? r.phan == null : r.phan === loc), [rows, loc])
  const dem = useMemo(() => ({
    chua: (rows ?? []).filter((r) => r.phan == null).length,
    luyen: (rows ?? []).filter((r) => r.phan === 'luyen').length,
    hoc: (rows ?? []).filter((r) => r.phan === 'hoc').length,
  }), [rows])

  const datPhan = async (r: DonMoHinhRow, phan: 'luyen' | 'hoc' | null) => {
    setBan(r.id)
    try {
      await api.datPhanMoHinh(r.id, phan)
      setRows((prev) => (prev ?? []).map((x) => (x.id === r.id ? { ...x, phan } : x)))
      void reload()   // lưới Hình luyện ẩn/hiện theo phan — refetch NỀN, màn này không dùng L nên không blank
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBan(null) }
  }
  /** "Cả khối → Học" (ca K8): chỉ đụng dòng CHƯA XEM, không đè quyết định đã có; vẫn ghi từng dòng. */
  const caKhoiHoc = async () => {
    const chua = (rows ?? []).filter((r) => r.phan == null)
    if (!chua.length) return
    if (!confirm(`Đánh dấu ${chua.length} mô hình CHƯA XEM của khối ${khoi} là "Học"? (dòng đã phân không đổi)`)) return
    for (const r of chua) await datPhan(r, 'hoc')
  }
  const moXoa = async (r: DonMoHinhRow) => {
    setBan(r.id)
    try { setXoa({ row: r, mat: await api.moHinhSeMat(r.id) }) } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBan(null) }
  }
  const xoaThat = async () => {
    if (!xoa) return
    setBan(xoa.row.id)
    try {
      await api.xoaMoHinhThat(xoa.row.id)
      setRows((prev) => (prev ?? []).filter((x) => x.id !== xoa.row.id))
      setXoa(null)
      void reload()
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBan(null) }
  }

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Dọn mô hình <span className="text-slate-400">· Khối {khoi}</span></h1>
        <div className="flex items-center gap-2">
          <Btn onClick={nap} title="Quét lại từ DB">↻</Btn>
          <Btn kind="warn" onClick={caKhoiHoc} disabled={!dem.chua}>Cả khối chưa xem → Học</Btn>
        </div>
      </div>
      <p className="mb-3 max-w-3xl text-[12.5px] text-slate-500">
        Mô hình đang <b>lẫn Học và Luyện</b>. Phân từng mô hình: <b>Luyện</b> = cành của Hình luyện · <b>Học</b> = chỉ phần Học mượn nhãn,
        ẩn khỏi lưới Hình luyện (không mất gì). <b>Xoá</b> chỉ khi không thuộc đâu — hiện trước những gì sẽ mất.
      </p>
      {loi && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {([['tat_ca', `Tất cả ${rows?.length ?? ''}`], ['chua_xem', `Chưa xem ${dem.chua}`], ['luyen', `Luyện ${dem.luyen}`], ['hoc', `Học ${dem.hoc}`]] as [Loc, string][]).map(([v, t]) => (
          <button key={v} onClick={() => setLoc(v)}
            className={`rounded-full border px-3 py-1 text-[12.5px] font-medium transition ${loc === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>{t}</button>
        ))}
      </div>

      {rows == null ? <div className="text-sm text-slate-400">Đang tải…</div>
        : !ds.length ? <Empty icon="✓">Không có mô hình nào trong bộ lọc này.</Empty>
        : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {ds.map((r) => (
              <div key={r.id} className={`flex items-start gap-3 border-b border-slate-100 px-3.5 py-2.5 last:border-b-0 ${r.phan === 'hoc' ? 'bg-slate-50/70' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Ma>{r.ma}</Ma>
                    <span className="min-w-0 truncate text-[13.5px] font-semibold text-slate-800"><MathText>{r.ten}</MathText></span>
                    {r.la_goc_ho && <Chip>gốc họ</Chip>}
                    {r.phan && <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${r.phan === 'luyen' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-700'}`}>{r.phan === 'luyen' ? 'LUYỆN' : 'HỌC'}</span>}
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-slate-500" title={r.gia_thiet}><MathText>{tron(r.gia_thiet)}</MathText></div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Chip>{r.so_bai_mo_hinh} bài mô hình</Chip>
                    <Chip>{r.so_cau_hoc} câu Học trỏ vào</Chip>
                    <Chip>{r.so_bai_kho} bài kho</Chip>
                    {r.so_con > 0 && <Chip>{r.so_con} mô hình con</Chip>}
                    {r.so_luot_hs > 0 && <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-800">{r.so_luot_hs} lượt HS đã làm — không xoá được</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Btn kind={r.phan === 'luyen' ? 'pri' : 'ghost'} disabled={bận === r.id} onClick={() => datPhan(r, r.phan === 'luyen' ? null : 'luyen')}>Luyện</Btn>
                  <Btn kind={r.phan === 'hoc' ? 'pri' : 'ghost'} disabled={bận === r.id} onClick={() => datPhan(r, r.phan === 'hoc' ? null : 'hoc')}>Học</Btn>
                  <Btn disabled={bận === r.id || r.so_luot_hs > 0} title={r.so_luot_hs > 0 ? 'Có lịch sử đo — đặt Học để ẩn thay vì xoá' : 'Xoá thật — hiện trước những gì sẽ mất'}
                    onClick={() => moXoa(r)} className="border-rose-300 text-rose-600 hover:bg-rose-50">🗑</Btn>
                </div>
              </div>
            ))}
          </div>
        )}

      <Note>Bấm lại nút đang sáng = bỏ phân loại (về "chưa xem"). Mô hình "Học" vẫn còn nguyên trong DB — phần Học đọc nhãn như cũ.</Note>

      {xoa && <ModalXoa row={xoa.row} mat={xoa.mat} dangXoa={bận === xoa.row.id} onClose={() => setXoa(null)} onXoa={xoaThat} />}
    </>
  )
}

/** Luật xoá: liệt kê CHÍNH XÁC cái sẽ mất, nói vì sao bị chặn, chờ gật. */
function ModalXoa({ row, mat, dangXoa, onClose, onXoa }: { row: DonMoHinhRow; mat: MoHinhSeMat; dangXoa: boolean; onClose: () => void; onXoa: () => void }) {
  const chan: string[] = []
  if (mat.mo_hinh_con.length) chan.push(`còn ${mat.mo_hinh_con.length} mô hình con (${mat.mo_hinh_con.map((m) => m.ma).join(', ')}) — xoá/tách từng mô hình con trước`)
  if (mat.chan_luot_hs > 0) chan.push(`${mat.chan_luot_hs} lượt HS đã làm bài của mô hình này — lịch sử đo, không xoá; đặt "Học" để ẩn`)
  if (mat.chan_form_dien > 0) chan.push(`${mat.chan_form_dien} form điền ô trỏ vào biến thể — gỡ form trước`)
  const Dong = ({ n, t }: { n: number | string[]; t: string }) => {
    const k = Array.isArray(n) ? n.length : n
    if (!k) return null
    return <li><b>{k}</b> {t}{Array.isArray(n) && n.length ? <span className="text-slate-400"> — {n.slice(0, 8).join(', ')}{n.length > 8 ? '…' : ''}</span> : null}</li>
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[16px] font-semibold text-slate-900">Xoá thật mô hình <Ma>{row.ma}</Ma> — <MathText>{row.ten}</MathText>?</div>
        <div className="mb-3 text-[12.5px] text-slate-500">Xoá lá → gốc trong một transaction. Không hoàn tác được.</div>
        <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3 text-[13px] text-rose-900">
          <div className="mb-1 font-semibold">Sẽ MẤT:</div>
          <ul className="list-disc space-y-0.5 pl-5">
            <Dong n={mat.bai_mo_hinh.map((b) => b.ma)} t="bài mô hình" />
            <Dong n={mat.so_cach_giai} t="cách giải (kèm tiền đề, bổ đề)" />
            <Dong n={mat.so_bien_the} t="biến thể" />
            <Dong n={mat.tien_de_tu_ngoai} t="bài mô hình KHÁC đang lấy bài ở đây làm tiền đề — cạnh đó mất âm thầm" />
            <Dong n={mat.cau_hoc_mat_nhan} t="câu phần Học mất nhãn mô hình (câu vẫn còn)" />
            <Dong n={mat.bai_kho_mat_nhan} t="bài kho mất nhãn mô hình (bài vẫn còn)" />
            <Dong n={mat.y_mat_gan} t="ý bài kho mất gán (ý vẫn còn)" />
            {!mat.bai_mo_hinh.length && !mat.so_cach_giai && !mat.cau_hoc_mat_nhan && !mat.bai_kho_mat_nhan && <li>chỉ mô hình này (vỏ rỗng) và lý thuyết đính kèm nếu có</li>}
          </ul>
        </div>
        {chan.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-900">
            <div className="mb-1 font-semibold">BỊ CHẶN — Postgres sẽ từ chối:</div>
            <ul className="list-disc space-y-0.5 pl-5">{chan.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Btn onClick={onClose}>Thôi</Btn>
          <Btn kind="pri" disabled={dangXoa || chan.length > 0} onClick={onXoa} className={chan.length ? '' : '!border-rose-600 !bg-rose-600 hover:!bg-rose-700'}>
            {chan.length ? 'Không xoá được' : 'Xoá thật'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
