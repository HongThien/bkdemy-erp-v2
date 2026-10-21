// Lá "Giáo trình (bản đồ mới)" — chức năng RIÊNG, song song lá "Giáo trình" cũ (Thùy 18/10: "2 lá khác nhau trên tree,
// giống bản đồ cũ / mới; hoàn thiện cái mới rồi mới bỏ cái cũ"). Chỉ thấy + tạo giáo trình ban_do='moi'.
// Hiện chỉ Toán · Đại (khuôn 4 tầng); Hình giải tích mở ở đợt 2 (spec-builder-ban-do-moi.md B6 bước 6).
// ⭐ Thùy 21/10: CÙNG màn này phục vụ lá "Chuyên đề" (loai='chuyen_de') — builder y giáo trình nhưng KHÔNG đi với lớp nào
// (không Gán lớp), mỗi chuyên đề 1 nhánh chọn lúc tạo: Đại (bản đồ mới) · Hình giải tích · Hình (Hình–Luyện) — 2 nhánh sau đang làm.
import { useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../../lib/kho/api'
import { listTaiLieu, createTaiLieu, deleteTaiLieu, type TaiLieu } from '../../../lib/tailieu'
import { useStore } from '../../../store/useStore'
import { useMonScope } from '../../../hooks/useMonScope'
import { usePagedList } from '../../../hooks/usePagedList'
import { Shell, Field, inp } from '../../kho/ui'
import BuilderBanDoMoi from './BuilderBanDoMoi'

const PAGE = 20
const ALL = '__all__'
const MON = 'Toán'
function fmtNgay(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' })
}

type LoaiTL = 'giao_trinh' | 'chuyen_de'
const TEN: Record<LoaiTL, { mot: string; nhieu: string }> = { giao_trinh: { mot: 'giáo trình', nhieu: 'Giáo trình' }, chuyen_de: { mot: 'chuyên đề', nhieu: 'Chuyên đề' } }

export default function GiaoTrinhBdmScreen({ loai = 'giao_trinh' }: { loai?: LoaiTL }) {
  const T = TEN[loai]
  const [khoi, setKhoi] = useState<string>(DEFAULT_KHOI)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [qLive, setQLive] = useState('')
  const [q, setQ] = useState('')
  useEffect(() => { const t = setTimeout(() => setQ(qLive), 300); return () => clearTimeout(t) }, [qLive])
  const me = useStore((s) => s.me)
  const { allowedMons, isAll } = useMonScope()
  const coQuyen = isAll || allowedMons.includes(MON)
  const profileLoading = !isAll && me === null

  const { rows: list, loading, loadingMore, hasMore, err, reload, loadMore } = usePagedList<TaiLieu>(
    async ({ before, search }) => coQuyen ? listTaiLieu(khoi === ALL ? undefined : khoi, loai, MON, null, { before, search, limit: PAGE, banDo: 'moi' }) : [],
    (t) => t.created_at,
    PAGE, q, [khoi, coQuyen, loai],
  )

  if (openId) return <BuilderBanDoMoi id={openId} laChuyenDe={loai === 'chuyen_de'} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700">🆕 {T.nhieu} · bản đồ mới</span>
        <span className="text-[12px] text-slate-400">{loai === 'chuyen_de' ? 'Tài liệu độc lập, không gắn lớp — nhóm bài · dạng bài' : 'Toán · Đại — nhóm bài · dạng bài'}</span>
        <div className="ml-auto flex items-center gap-1">
          <input value={qLive} onChange={(e) => setQLive(e.target.value)} placeholder="Tìm theo tên…" className="mr-2 h-7 w-44 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          <button onClick={() => setKhoi(ALL)} className={`h-7 rounded-md px-2 text-xs font-semibold transition ${khoi === ALL ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>Tất cả</button>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)} className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
          ))}
          {coQuyen && <button onClick={() => setCreating(true)} className="ml-3 whitespace-nowrap rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo {T.mot}</button>}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {profileLoading ? <p className="text-sm text-slate-400">Đang tải hồ sơ…</p>
          : !coQuyen ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Bạn chưa được phân môn Toán — liên hệ quản trị để soạn {T.mot}.</div>
          : loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              {qLive.trim() ? <>Không có {T.mot} khớp “{qLive}”.</> : <>Chưa có {T.mot} bản đồ mới {khoi === ALL ? '' : `khối ${khoi}`}. Bấm <b className="text-slate-600">+ Tạo {T.mot}</b>.</>}
            </div>
          ) : (
            <>
              <div className="mb-3 text-[12px] text-slate-400">{list.length} {T.mot}</div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {list.map((t) => (
                  <div key={t.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1 text-[16px] font-semibold text-slate-900">{t.ten}</div>
                      {t.luu_tru_tu && <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-700">Lưu trữ</span>}
                    </div>
                    <div className="mt-1 text-[12px] text-slate-400">Khối {t.khoi}</div>
                    <div className="mt-1 text-[11px] text-slate-400">Tạo {fmtNgay(t.created_at)}{t.updated_at && t.updated_at !== t.created_at ? ` · sửa ${fmtNgay(t.updated_at)}` : ''}</div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setOpenId(t.id)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">Mở / Xuất</button>
                      <button onClick={async () => { if (confirm(`Xoá ${T.mot} "${t.ten}"?`)) { await deleteTaiLieu(t.id); reload() } }} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && !qLive.trim() && (
                <div className="mt-4 flex justify-center">
                  <button onClick={loadMore} disabled={loadingMore} className="rounded-md border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-40">{loadingMore ? 'Đang tải…' : `↓ Tải thêm ${PAGE}`}</button>
                </div>
              )}
            </>
          )}
      </div>

      {creating && <TaoMoi loai={loai} khoi={khoi === ALL ? DEFAULT_KHOI : khoi} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); reload(); setOpenId(id) }} />}
    </div>
  )
}

// Nhánh của chuyên đề (chọn 1 lần lúc tạo). Đại + HGT chạy theo bản đồ mới (HGT: mig 202610211629); Hình chờ builder Hình–Luyện.
const NHANH_CD: { id: string | null; ten: string; mo: boolean; ghi: string }[] = [
  { id: null, ten: 'Đại số', mo: true, ghi: 'nhóm bài · dạng bài (bản đồ mới)' },
  { id: 'hinh_gt', ten: 'Hình giải tích', mo: true, ghi: 'nhóm bài · dạng bài (bản đồ mới) — hiện có câu K6, K12; K10 đang xếp câu' },
  { id: 'hinh', ten: 'Hình', mo: false, ghi: 'đang làm builder Hình–Luyện (mô hình · kho bài)' },
]

function TaoMoi({ loai, khoi, onClose, onCreated }: { loai: LoaiTL; khoi: string; onClose: () => void; onCreated: (id: string) => void }) {
  const T = TEN[loai]
  const [nhanh, setNhanh] = useState<string | null>(null)
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function create() {
    if (!ten.trim()) return
    setBusy(true); setError(null)
    try { const tl = await createTaiLieu({ loai, ten: ten.trim(), khoi, mon: MON, nhanh, ban_do: 'moi' }); onCreated(tl.id) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`Tạo ${T.mot} bản đồ mới · Toán · Khối ${khoi}`} onClose={onClose}>
      {loai === 'chuyen_de' && (
        <Field label="Nhánh">
          <div className="flex flex-col gap-1.5">
            {NHANH_CD.map((n) => (
              <label key={n.ten} className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[13px] ${!n.mo ? 'cursor-not-allowed border-slate-100 text-slate-300' : nhanh === n.id ? 'border-indigo-400 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-700'}`}>
                <input type="radio" disabled={!n.mo} checked={nhanh === n.id} onChange={() => setNhanh(n.id)} />
                <b className="font-semibold">{n.ten}</b><span className="text-[11px] text-slate-400">· {n.ghi}</span>
              </label>
            ))}
          </div>
        </Field>
      )}
      <Field label={`Tên ${T.mot}`}><input value={ten} onChange={(e) => setTen(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && create()} className={inp} placeholder={loai === 'chuyen_de' ? 'vd: Chuyên đề Số hữu tỉ' : 'vd: Giáo trình 7A'} autoFocus /></Field>
      <div className="mb-3 text-[11px] text-slate-400">Tạo xong vào builder → <b>+ Thêm {loai === 'chuyen_de' ? 'phần' : 'buổi'}</b> → <b>+ Chọn nhóm / dạng bài</b>.{loai === 'chuyen_de' && ' Chuyên đề không gắn lớp — in / xuất PDF dùng ở đâu cũng được.'}</div>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={create} disabled={!ten.trim() || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
      </div>
    </Shell>
  )
}
