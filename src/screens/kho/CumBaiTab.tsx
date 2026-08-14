// CumBaiTab — tầng dưới của DẠNG: các CỤM BÀI (lớp tương đương) + rổ "Chưa phân cụm".
// Spec: spec-cum-bai.md §6.
//
// Vì sao tab này thay bộ lọc "Câu gốc" cũ: lọc cũ chỉ trả lời "câu nào là gốc", không trả lời được
// "những bài nào THAY THẾ ĐƯỢC CHO NHAU" — mà đó mới là thứ mã đề và builder cần.
//
// ⭐ 1 cụm chứa ĐƯỢC NHIỀU CÂU GỐC (cụm ≠ chuỗi gốc-clone) nên card cụm liệt kê MỌI gốc trong cụm,
//   clone nằm sau toggle. Clone luôn đi theo gốc khi gán/gỡ (xử ở `ganCumBai`).
// ⭐ Rổ "Chưa phân cụm" KHÔNG phải lỗi — là việc tồn đọng, gom tay dần (CEO chốt: không AI gợi ý,
//   tên cụm do người đặt). Kho Đại có ~1.600 câu ở rổ này lúc mở tính năng.
import { useEffect, useMemo, useState } from 'react'
import {
  listCumBai, createCumBai, renameCumBai, deleteCumBai, ganCumBai, gopCumBai, tenCum,
  type CauHoi, type CumBai,
} from '../../lib/kho/api'
import { Code, MathText } from './ui'
import TienDeBox from './TienDeBox'

const laGoc = (c: CauHoi) => c.nguon !== 'clone'
const btn = 'rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40'

export default function CumBaiTab({ maDang, caus, cauTbl, onEditCau, onChanged }: {
  maDang: string
  caus: CauHoi[]
  cauTbl: string
  onEditCau: (c: CauHoi) => void
  onChanged: () => void          // reload câu ở màn cha (ma_cum vừa đổi)
}) {
  const [cums, setCums] = useState<CumBai[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [hienClone, setHienClone] = useState(false)
  const [chon, setChon] = useState<Set<string>>(new Set())   // ma_cau đang chọn (chỉ chọn câu GỐC)
  const [gopTu, setGopTu] = useState<string | null>(null)     // cụm đang chờ chọn cụm đích để gộp
  const [tienDeCum, setTienDeCum] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function reloadCums() {
    setLoading(true); setErr(null)
    try { setCums(await listCumBai(maDang, cauTbl)) }
    catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { reloadCums() }, [maDang, cauTbl]) // eslint-disable-line

  // Nhóm câu theo cụm. Câu chưa phân cụm (ma_cum null) → rổ tồn đọng; clone của nó đi kèm gốc.
  const { theoCum, chuaPhanCum } = useMemo(() => {
    const m = new Map<string, CauHoi[]>()
    const roi: CauHoi[] = []
    for (const c of caus) {
      if (c.ma_cum) (m.get(c.ma_cum) ?? m.set(c.ma_cum, []).get(c.ma_cum)!).push(c)
      else roi.push(c)
    }
    return { theoCum: m, chuaPhanCum: roi }
  }, [caus])

  const cloneCuaGoc = (goc: string, pool: CauHoi[]) => pool.filter((c) => c.parent_ma_cau === goc)
  const toggleChon = (ma: string) => setChon((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })

  async function chay(fn: () => Promise<unknown>) {
    setBusy(true); setErr(null)
    try { await fn(); setChon(new Set()); await reloadCums(); onChanged() }
    catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setBusy(false) }
  }
  async function gomThanhCumMoi() {
    const ten = prompt(`Đặt tên cụm cho ${chon.size} bài đã chọn (bỏ trống = "Cụm {số}"):`)
    if (ten === null) return
    await chay(() => createCumBai({ maDang, ten, maCaus: [...chon] }, cauTbl))
  }
  async function xoaCum(c: CumBai) {
    const n = (theoCum.get(c.ma_cum) ?? []).length
    if (!confirm(`Xoá "${tenCum(c)}"?\n\n${n} câu trong cụm KHÔNG bị xoá — chúng quay về rổ "Chưa phân cụm".`)) return
    await chay(() => deleteCumBai(c.ma_cum, cauTbl))
  }

  const ungVienCum = cums.map((c) => ({ ma: c.ma_cum, ten: tenCum(c) }))

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-[13px] text-slate-500">
          <b className="text-slate-700">{cums.length}</b> cụm
          <span className="text-slate-300">·</span>
          <b className={chuaPhanCum.length ? 'text-amber-600' : 'text-slate-700'}>{chuaPhanCum.length}</b> câu chưa phân cụm
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-600">
          <input type="checkbox" checked={hienClone} onChange={(e) => setHienClone(e.target.checked)} />
          Hiện cả biến thể clone
        </label>
      </div>

      {err && <p className="text-[13px] text-rose-600">Lỗi: {err}</p>}
      {loading ? <p className="text-sm text-slate-400">Đang tải cụm…</p> : (
        <>
          {cums.map((c) => {
            const pool = theoCum.get(c.ma_cum) ?? []
            const gocs = pool.filter(laGoc)
            return (
              <div key={c.ma_cum} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      const t = prompt('Tên cụm:', c.ten ?? '')
                      if (t === null) return
                      await chay(() => renameCumBai(c.ma_cum, t, cauTbl))
                    }}
                    className="text-[15px] font-semibold text-slate-900 hover:text-indigo-600" title="Bấm để đổi tên">
                    {tenCum(c)}{!c.ten && <span className="ml-1 text-[12px] font-normal text-slate-400">(chưa đặt tên)</span>}
                  </button>
                  <Code>{c.ma_cum}</Code>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[12px] font-medium text-slate-600">
                    {gocs.length} gốc{pool.length > gocs.length ? ` · ${pool.length - gocs.length} clone` : ''}
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <button onClick={() => setTienDeCum(tienDeCum === c.ma_cum ? null : c.ma_cum)} className={btn}>🔗 Tiền đề</button>
                    {gopTu === c.ma_cum ? (
                      <select autoFocus defaultValue="" disabled={busy}
                        onChange={async (e) => { const dich = e.target.value; setGopTu(null); if (dich) await chay(() => gopCumBai(c.ma_cum, dich, cauTbl)) }}
                        className="h-[26px] rounded-md border border-indigo-300 bg-white px-2 text-[12px]">
                        <option value="">gộp vào cụm nào?</option>
                        {cums.filter((x) => x.ma_cum !== c.ma_cum).map((x) => <option key={x.ma_cum} value={x.ma_cum}>{tenCum(x)}</option>)}
                      </select>
                    ) : (
                      <button onClick={() => setGopTu(c.ma_cum)} disabled={cums.length < 2} className={btn} title="Chuyển hết bài của cụm này sang cụm khác rồi xoá cụm này">⤵ Gộp</button>
                    )}
                    {chon.size > 0 && (
                      <button onClick={() => chay(() => ganCumBai([...chon], c.ma_cum, cauTbl))} disabled={busy}
                        className="rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-indigo-500">
                        + Thêm {chon.size} bài đã chọn
                      </button>
                    )}
                    <button onClick={() => xoaCum(c)} disabled={busy} className="rounded-md px-2 py-1 text-[12px] font-medium text-slate-400 hover:text-rose-600">Xoá cụm</button>
                  </div>
                </div>

                {tienDeCum === c.ma_cum && (
                  <div className="mb-2.5">
                    <TienDeBox nut={c.ma_cum} tang="cum" cauTbl={cauTbl} ungVien={ungVienCum} nhan="cụm" />
                  </div>
                )}

                {gocs.length === 0 ? (
                  <p className="py-3 text-center text-[13px] text-slate-400">Cụm rỗng — thêm bài từ rổ “Chưa phân cụm” bên dưới, hoặc xoá cụm.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {gocs.map((g) => (
                      <CauDong key={g.ma_cau} c={g} clones={hienClone ? cloneCuaGoc(g.ma_cau, pool) : []}
                        onEdit={() => onEditCau(g)}
                        onGo={() => chay(() => ganCumBai([g.ma_cau], null, cauTbl))} />
                    ))}
                  </ul>
                )}
              </div>
            )
          })}

          {/* ── Rổ tồn đọng ── */}
          <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-4">
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-semibold text-slate-800">Chưa phân cụm</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[12px] font-medium text-amber-700 ring-1 ring-amber-200">{chuaPhanCum.filter(laGoc).length} bài</span>
              <span className="text-[12px] text-slate-500">chọn những bài THAY THẾ ĐƯỢC CHO NHAU rồi gom thành 1 cụm</span>
              <div className="ml-auto flex items-center gap-1.5">
                {chon.size > 0 && <button onClick={() => setChon(new Set())} className={btn}>Bỏ chọn ({chon.size})</button>}
                <button onClick={gomThanhCumMoi} disabled={!chon.size || busy}
                  className="rounded-md bg-slate-800 px-3 py-1 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-40">
                  Gom {chon.size || ''} bài thành cụm mới
                </button>
              </div>
            </div>
            {chuaPhanCum.filter(laGoc).length === 0 ? (
              <p className="py-3 text-center text-[13px] text-slate-500">Sạch — mọi bài trong dạng này đã có cụm ✓</p>
            ) : (
              <ul className="space-y-1.5">
                {chuaPhanCum.filter(laGoc).map((g) => (
                  <CauDong key={g.ma_cau} c={g} clones={hienClone ? cloneCuaGoc(g.ma_cau, chuaPhanCum) : []}
                    chon={chon.has(g.ma_cau)} onChon={() => toggleChon(g.ma_cau)} onEdit={() => onEditCau(g)} />
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// 1 dòng câu gốc (+ clone của nó khi bật toggle)
function CauDong({ c, clones, chon, onChon, onEdit, onGo }: {
  c: CauHoi; clones: CauHoi[]; chon?: boolean; onChon?: () => void; onEdit: () => void; onGo?: () => void
}) {
  return (
    <li>
      <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${chon ? 'border-indigo-300 bg-indigo-50/60' : 'border-slate-200 bg-white'}`}>
        {onChon && <input type="checkbox" checked={!!chon} onChange={onChon} className="mt-1" />}
        <Code>{c.ma_cau}</Code>
        <div className="min-w-0 flex-1 truncate text-[14px] text-slate-800"><MathText>{c.noi_dung}</MathText></div>
        {c.nguon_giai === 'ai' && <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700" title="Lời giải do AI tạo — cần duyệt">🤖</span>}
        <button onClick={onEdit} className="shrink-0 text-[12px] font-medium text-slate-400 hover:text-indigo-600">Sửa</button>
        {onGo && <button onClick={onGo} className="shrink-0 text-[12px] font-medium text-slate-400 hover:text-rose-600" title="Gỡ khỏi cụm (về rổ chưa phân cụm)">Gỡ</button>}
      </div>
      {clones.length > 0 && (
        <ul className="ml-6 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
          {clones.map((v) => (
            <li key={v.ma_cau} className="flex items-start gap-2 text-[13px] text-slate-500">
              <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600">clone</span>
              <Code>{v.ma_cau}</Code>
              <span className="min-w-0 flex-1 truncate"><MathText>{v.noi_dung}</MathText></span>
              {v.nguon_giai === 'ai' && <span className="shrink-0 text-[11px] text-amber-600" title="Lời giải AI — cần duyệt">🤖</span>}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
