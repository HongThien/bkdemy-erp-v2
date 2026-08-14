// CumBaiTab — tầng dưới của DẠNG: các CỤM BÀI (lớp tương đương) + rổ "Chưa phân cụm".
// Spec: spec-cum-bai.md §6.
//
// Vì sao tab này thay bộ lọc "Câu gốc" cũ: lọc cũ chỉ trả lời "câu nào là gốc", không trả lời được
// "những bài nào THAY THẾ ĐƯỢC CHO NHAU" — mà đó mới là thứ mã đề và builder cần.
//
// ⭐ GÁN 2 CHIỀU (Thùy chốt): từ BÀI chọn cụm (dropdown trên từng dòng) · từ CỤM add bài (nút "＋ Thêm
//   bài" mở picker các câu chưa phân cụm). Hai đường đi vào cùng một hàm `ganCumBai`.
// ⭐ 1 cụm chứa ĐƯỢC NHIỀU CÂU GỐC (cụm ≠ chuỗi gốc-clone) nên card cụm liệt kê MỌI gốc trong cụm,
//   clone nằm sau toggle. Clone luôn đi theo gốc khi gán/gỡ (xử ở `ganCumBai`).
// ⭐ "Chưa phân cụm" là TAB RIÊNG, không phải rổ nhét cuối trang — đó là hàng đợi việc chính của
//   người dùng (gom tay, tên cụm người đặt; CEO chốt: không AI gợi ý).
import { useEffect, useMemo, useState } from 'react'
import {
  listCumBai, createCumBai, renameCumBai, deleteCumBai, ganCumBai, gopCumBai, tenCum,
  type CauHoi, type CumBai,
} from '../../lib/kho/api'
import { Code, MathText, inp } from './ui'
import TienDeBox from './TienDeBox'

const laGoc = (c: CauHoi) => c.nguon !== 'clone'
const btn = 'rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40'
const selCum = 'h-[26px] max-w-[170px] rounded-md border border-slate-300 bg-white px-1.5 text-[12px] text-slate-600 outline-none focus:border-indigo-500'

export type CumView = 'cum' | 'chua'

export default function CumBaiTab({ maDang, caus, cauTbl, view, onEditCau, onCloneCau, onChanged }: {
  maDang: string
  caus: CauHoi[]
  cauTbl: string
  view: CumView
  onEditCau: (c: CauHoi) => void
  onCloneCau: (c: CauHoi) => void  // sinh biến thể TỪ chính bài này (biến thể thừa kế cụm của nó)
  onChanged: () => void          // reload câu ở màn cha (ma_cum vừa đổi)
}) {
  const [cums, setCums] = useState<CumBai[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [hienClone, setHienClone] = useState(false)
  const [chon, setChon] = useState<Set<string>>(new Set())   // ma_cau đang chọn (chỉ chọn câu GỐC)
  const [gopTu, setGopTu] = useState<string | null>(null)     // cụm đang chờ chọn cụm đích để gộp
  const [tienDeCum, setTienDeCum] = useState<string | null>(null)
  const [themVao, setThemVao] = useState<CumBai | null>(null) // cụm đang mở picker "＋ Thêm bài"
  // Đặt tên cụm = ô nhập TẠI CHỖ, không dùng prompt(): tên cụm là thao tác lõi (người đặt tên), mà
  // hộp thoại native thì không style được, không kiểm thử tự động được, và trên mobile rất tệ.
  const [tao, setTao] = useState<null | { ten: string; kemChon: boolean }>(null)
  const [suaTen, setSuaTen] = useState<null | { ma: string; ten: string }>(null)
  const [busy, setBusy] = useState(false)

  async function reloadCums() {
    setLoading(true); setErr(null)
    try { setCums(await listCumBai(maDang, cauTbl)) }
    catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { reloadCums() }, [maDang, cauTbl]) // eslint-disable-line
  useEffect(() => { setChon(new Set()) }, [view])      // đổi tab thì bỏ chọn, tránh gán nhầm lô cũ

  // Nhóm câu theo cụm. Câu chưa phân cụm (ma_cum null) → hàng đợi; clone của nó đi kèm gốc.
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
  // 2 đường tạo cụm — cùng một hàm, khác chỗ bắt đầu:
  //  ① cụm RỖNG + đặt tên trước, gán bài vào sau (luồng chính)
  //  ② đang chọn sẵn mấy bài thì gom thẳng (đỡ 1 bước)
  async function luuCumMoi() {
    if (!tao) return
    const { ten, kemChon } = tao
    setTao(null)
    await chay(() => createCumBai({ maDang, ten, maCaus: kemChon ? [...chon] : [] }, cauTbl))
  }
  async function xoaCum(c: CumBai) {
    const n = (theoCum.get(c.ma_cum) ?? []).length
    if (!confirm(`Xoá "${tenCum(c)}"?\n\n${n} câu trong cụm KHÔNG bị xoá — chúng quay về tab "Chưa phân cụm".`)) return
    await chay(() => deleteCumBai(c.ma_cum, cauTbl))
  }

  const ungVienCum = cums.map((c) => ({ ma: c.ma_cum, ten: tenCum(c) }))
  const gocChua = chuaPhanCum.filter(laGoc)

  // Ô nhập tên cụm mới — Enter để lưu, Esc để huỷ.
  const oTaoCum = tao && (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
      <span className="text-[13px] font-semibold text-slate-700">Tên cụm mới</span>
      <input autoFocus value={tao.ten} onChange={(e) => setTao({ ...tao, ten: e.target.value })}
        onKeyDown={(e) => { if (e.key === 'Enter') luuCumMoi(); if (e.key === 'Escape') setTao(null) }}
        placeholder="vd: Hệ 2 ẩn hệ số nguyên — giải bằng thế"
        className={`${inp} max-w-[360px] flex-1 text-[13px]`} />
      {tao.kemChon && <span className="text-[12px] text-slate-500">kèm <b>{chon.size}</b> bài đã chọn</span>}
      <button onClick={luuCumMoi} disabled={busy}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">Tạo cụm</button>
      <button onClick={() => setTao(null)} className={btn}>Huỷ</button>
    </div>
  )

  const thanhCloneToggle = (
    <label className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-600">
      <input type="checkbox" checked={hienClone} onChange={(e) => setHienClone(e.target.checked)} />
      Hiện cả biến thể clone
    </label>
  )
  // Dropdown "gán vào cụm" trên TỪNG DÒNG — chiều BÀI → CỤM.
  const dropdownGan = (c: CauHoi) => (
    <select value={c.ma_cum ?? ''} disabled={busy || !cums.length}
      onChange={(e) => chay(() => ganCumBai([c.ma_cau], e.target.value || null, cauTbl))}
      className={selCum} title={cums.length ? 'Gán bài này vào cụm' : 'Chưa có cụm nào — tạo cụm trước'}>
      <option value="">— chưa phân cụm —</option>
      {cums.map((x) => <option key={x.ma_cum} value={x.ma_cum}>{tenCum(x)}</option>)}
    </select>
  )

  if (loading) return <p className="text-sm text-slate-400">Đang tải cụm…</p>

  // ══ TAB "CHƯA PHÂN CỤM" — hàng đợi việc ═════════════════════════════════════
  if (view === 'chua') {
    return (
      <div className="space-y-3">
        {err && <p className="text-[13px] text-rose-600">Lỗi: {err}</p>}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <span className="text-[13px] text-slate-600"><b className={gocChua.length ? 'text-amber-600' : 'text-emerald-600'}>{gocChua.length}</b> bài chưa có cụm</span>
          <span className="text-[12px] text-slate-400">· chọn những bài THAY THẾ ĐƯỢC CHO NHAU rồi gom</span>
          {thanhCloneToggle}
          <div className="ml-auto flex items-center gap-1.5">
            {chon.size > 0 && <button onClick={() => setChon(new Set())} className={btn}>Bỏ chọn ({chon.size})</button>}
            {chon.size > 0 && cums.length > 0 && (
              <select defaultValue="" disabled={busy} className={selCum}
                onChange={(e) => { const v = e.target.value; if (v) chay(() => ganCumBai([...chon], v, cauTbl)) }}>
                <option value="">Thêm {chon.size} bài vào cụm…</option>
                {cums.map((x) => <option key={x.ma_cum} value={x.ma_cum}>{tenCum(x)}</option>)}
              </select>
            )}
            <button onClick={() => setTao({ ten: '', kemChon: chon.size > 0 })} disabled={busy}
              className="rounded-md bg-slate-800 px-3 py-1 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-40">
              {chon.size ? `Gom ${chon.size} bài thành cụm mới` : '＋ Cụm mới (rỗng)'}
            </button>
          </div>
        </div>
        {oTaoCum}

        {gocChua.length === 0 ? (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 py-14 text-center text-sm text-emerald-700">
            Sạch — mọi bài trong dạng này đã có cụm ✓
          </div>
        ) : (
          <ul className="space-y-1.5">
            {gocChua.map((g) => (
              <CauDong key={g.ma_cau} c={g} clones={hienClone ? cloneCuaGoc(g.ma_cau, chuaPhanCum) : []}
                chon={chon.has(g.ma_cau)} onChon={() => toggleChon(g.ma_cau)}
                onEdit={() => onEditCau(g)} onClone={() => onCloneCau(g)} phai={dropdownGan(g)} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  // ══ TAB "CỤM BÀI" ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 text-[13px] text-slate-500">
          <b className="text-slate-700">{cums.length}</b> cụm
          <span className="text-slate-300">·</span>
          <b className={gocChua.length ? 'text-amber-600' : 'text-slate-700'}>{gocChua.length}</b> bài chưa phân cụm
        </div>
        <div className="flex items-center gap-3">
          {thanhCloneToggle}
          <button onClick={() => setTao({ ten: '', kemChon: false })} disabled={busy}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">
            ＋ Cụm mới
          </button>
        </div>
      </div>

      {oTaoCum}
      {err && <p className="text-[13px] text-rose-600">Lỗi: {err}</p>}

      {cums.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
          Chưa có cụm nào. Bấm <b>＋ Cụm mới</b> để đặt tên một cụm, rồi thêm bài vào từ tab <b>Chưa phân cụm</b>.
        </div>
      ) : cums.map((c) => {
        const pool = theoCum.get(c.ma_cum) ?? []
        const gocs = pool.filter(laGoc)
        return (
          <div key={c.ma_cum} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              {suaTen?.ma === c.ma_cum ? (
                <input autoFocus value={suaTen.ten} onChange={(e) => setSuaTen({ ...suaTen, ten: e.target.value })}
                  onKeyDown={async (e) => {
                    if (e.key === 'Escape') setSuaTen(null)
                    if (e.key === 'Enter') { const t = suaTen.ten; setSuaTen(null); await chay(() => renameCumBai(c.ma_cum, t, cauTbl)) }
                  }}
                  onBlur={async () => { const t = suaTen.ten; setSuaTen(null); await chay(() => renameCumBai(c.ma_cum, t, cauTbl)) }}
                  className={`${inp} max-w-[320px] text-[14px] font-semibold`} />
              ) : (
                <button onClick={() => setSuaTen({ ma: c.ma_cum, ten: c.ten ?? '' })}
                  className="text-[15px] font-semibold text-slate-900 hover:text-indigo-600" title="Bấm để đổi tên">
                  {tenCum(c)}{!c.ten && <span className="ml-1 text-[12px] font-normal text-slate-400">(chưa đặt tên)</span>}
                </button>
              )}
              <Code>{c.ma_cum}</Code>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[12px] font-medium text-slate-600">
                {gocs.length} bài{pool.length > gocs.length ? ` · ${pool.length - gocs.length} clone` : ''}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <button onClick={() => setThemVao(c)} disabled={busy || !gocChua.length} className={btn}
                  title={gocChua.length ? 'Chọn bài từ hàng đợi chưa phân cụm' : 'Không còn bài nào chưa phân cụm'}>＋ Thêm bài</button>
                <button onClick={() => setTienDeCum(tienDeCum === c.ma_cum ? null : c.ma_cum)} className={btn}>🔗 Tiền đề</button>
                {gopTu === c.ma_cum ? (
                  <select autoFocus defaultValue="" disabled={busy} className={selCum}
                    onChange={async (e) => { const dich = e.target.value; setGopTu(null); if (dich) await chay(() => gopCumBai(c.ma_cum, dich, cauTbl)) }}>
                    <option value="">gộp vào cụm nào?</option>
                    {cums.filter((x) => x.ma_cum !== c.ma_cum).map((x) => <option key={x.ma_cum} value={x.ma_cum}>{tenCum(x)}</option>)}
                  </select>
                ) : (
                  <button onClick={() => setGopTu(c.ma_cum)} disabled={cums.length < 2} className={btn}
                    title="Chuyển hết bài của cụm này sang cụm khác rồi xoá cụm này">⤵ Gộp</button>
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
              <p className="py-3 text-center text-[13px] text-slate-400">Cụm rỗng — bấm <b>＋ Thêm bài</b> để đưa bài vào.</p>
            ) : (
              <ul className="space-y-1.5">
                {gocs.map((g) => (
                  <CauDong key={g.ma_cau} c={g} clones={hienClone ? cloneCuaGoc(g.ma_cau, pool) : []}
                    onEdit={() => onEditCau(g)} onClone={() => onCloneCau(g)} phai={dropdownGan(g)}
                    onGo={() => chay(() => ganCumBai([g.ma_cau], null, cauTbl))} />
                ))}
              </ul>
            )}
          </div>
        )
      })}

      {themVao && (
        <PickerBaiModal cum={themVao} ungVien={gocChua} hienClone={hienClone} cloneCuaGoc={(ma) => cloneCuaGoc(ma, chuaPhanCum)}
          onClose={() => setThemVao(null)}
          onThem={async (mas) => { setThemVao(null); await chay(() => ganCumBai(mas, themVao.ma_cum, cauTbl)) }} />
      )}
    </div>
  )
}

// Chiều CỤM → BÀI: mở từ card cụm, chọn bài trong hàng đợi chưa phân cụm.
function PickerBaiModal({ cum, ungVien, hienClone, cloneCuaGoc, onClose, onThem }: {
  cum: CumBai; ungVien: CauHoi[]; hienClone: boolean
  cloneCuaGoc: (maCau: string) => CauHoi[]
  onClose: () => void; onThem: (maCaus: string[]) => void
}) {
  const [tim, setTim] = useState('')
  const [pick, setPick] = useState<Set<string>>(new Set())
  const loc = tim.trim()
    ? ungVien.filter((c) => c.noi_dung.toLowerCase().includes(tim.trim().toLowerCase()) || c.ma_cau.toLowerCase().includes(tim.trim().toLowerCase()))
    : ungVien
  const toggle = (ma: string) => setPick((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[10%] inset-y-12 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3.5">
          <h3 className="text-base font-semibold text-slate-900">Thêm bài vào “{tenCum(cum)}”</h3>
          <span className="text-[12px] text-slate-400">{ungVien.length} bài chưa phân cụm</span>
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm trong đề bài / mã câu…" className={`${inp} ml-2 max-w-[280px] text-[13px]`} />
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {loc.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">Không có bài nào khớp.</p> : (
            <ul className="space-y-1.5">
              {loc.map((g) => (
                <CauDong key={g.ma_cau} c={g} clones={hienClone ? cloneCuaGoc(g.ma_cau) : []}
                  chon={pick.has(g.ma_cau)} onChon={() => toggle(g.ma_cau)} onEdit={() => toggle(g.ma_cau)} />
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3.5">
          <span className="mr-auto text-[13px] text-slate-500"><b>{pick.size}</b> bài sẽ thêm (clone của chúng đi kèm)</span>
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={() => onThem([...pick])} disabled={!pick.size}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">Thêm vào cụm</button>
        </div>
      </div>
    </div>
  )
}

// 1 dòng câu gốc (+ clone của nó khi bật toggle)
function CauDong({ c, clones, chon, onChon, onEdit, onClone, onGo, phai }: {
  c: CauHoi; clones: CauHoi[]; chon?: boolean; onChon?: () => void
  onEdit: () => void; onClone?: () => void; onGo?: () => void; phai?: React.ReactNode
}) {
  return (
    <li>
      <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${chon ? 'border-indigo-300 bg-indigo-50/60' : 'border-slate-200 bg-white'}`}>
        {onChon && <input type="checkbox" checked={!!chon} onChange={onChon} className="mt-1" />}
        <Code>{c.ma_cau}</Code>
        <div className="min-w-0 flex-1 truncate text-[14px] text-slate-800"><MathText>{c.noi_dung}</MathText></div>
        {c.nguon_giai === 'ai' && <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700" title="Lời giải do AI tạo — cần duyệt">🤖</span>}
        {phai}
        {onClone && <button onClick={onClone} className="shrink-0 text-[12px] font-medium text-slate-400 hover:text-violet-600" title="Sinh biến thể từ bài này — biến thể tự vào đúng cụm">✨</button>}
        <button onClick={onEdit} className="shrink-0 text-[12px] font-medium text-slate-400 hover:text-indigo-600">Sửa</button>
        {onGo && <button onClick={onGo} className="shrink-0 text-[12px] font-medium text-slate-400 hover:text-rose-600" title="Gỡ khỏi cụm (về tab Chưa phân cụm)">Gỡ</button>}
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
