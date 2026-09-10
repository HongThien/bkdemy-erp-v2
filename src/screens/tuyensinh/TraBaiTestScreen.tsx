// Trả bài test đầu vào (Story 4) — tab RIÊNG, tương đương Chấm test (Thùy chốt 07-19: "Trả bài rơi vào
// điểm danh test, đáng lẽ là tab riêng"). Sinh sớm ngay khi điểm danh đóng, gộp Nhận xét (biểu đồ + kỹ
// năng/kiến thức + lớp đề xuất — KHÔNG còn là bước riêng, xem BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md)
// — CHẶN đóng tới khi đủ 3 nguồn: chấm xong + scan-đã-chấm + đã chọn lớp đề xuất.
// ⭐ 09/09 (CEO): mọi số liệu do Postgres tính (fn_test_dau_vao_phieu — §2.0): điểm nhập + % Đ/C/S ·
// % theo CHUYÊN ĐỀ · % cơ bản/nâng cao (độ khó dạng ≤3/≥4) · % Đại/Hình (pick từ bản đồ nào tính từ đấy;
// không có câu hình thì ẨN khối). GV + lịch lớp đề xuất KHÔNG hiện ở đây (CEO ⑧) — chỉ trên ảnh phiếu.
// "Của tôi" = ca tôi được gán `nguoi_tra_bai_id` (CEO ⑤); hàng đợi chung vẫn mở.
import { useEffect, useMemo, useState } from 'react'
import {
  listCanTraBai, listDaTraBai, dongTraBai, getPhieuKetQua, setNhanXet, timNhanXetMau, luuNhanXetMau, coNhom,
  type CaTestChoTraBai, type PhieuKetQua, type NhanXet, type NhomTiLe,
} from '../../lib/detest'
import { listLop } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import { PhieuTestModal } from './PhieuTestDauVao'
import SearchSelect from '../../components/SearchSelect'

const NHO: { loc: 'toi' | 'tatca' | null } = { loc: null }

export default function TraBaiTestScreen() {
  const me = useStore((s) => s.me)
  const myId = me?.nhanSu.id ?? null
  const [canTraBai, setCanTraBai] = useState<CaTestChoTraBai[]>([])
  const [daTraBai, setDaTraBai] = useState<CaTestChoTraBai[]>([])
  const [loading, setLoading] = useState(true)
  const [loc, setLoc] = useState<'toi' | 'tatca'>(NHO.loc ?? (myId ? 'toi' : 'tatca'))
  useEffect(() => { NHO.loc = loc }, [loc])

  async function reload() {
    setLoading(true)
    try { const [c, t] = await Promise.all([listCanTraBai(), listDaTraBai()]); setCanTraBai(c); setDaTraBai(t) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const cuaToi = useMemo(() => canTraBai.filter((c) => c.nguoiTraBaiId === myId), [canTraBai, myId])
  const shown = loc === 'toi' ? cuaToi : canTraBai
  // Đóng 1 ca = vá tại chỗ (chuyển sang "Đã trả"), không quét lại cả danh sách (CLAUDE.md §2).
  const daDong = (id: string) => {
    const it = canTraBai.find((x) => x.id === id)
    setCanTraBai((s) => s.filter((x) => x.id !== id))
    if (it) setDaTraBai((s) => [{ ...it, choLopDeXuat: false }, ...s])
  }

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Trả bài test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Sinh ngay khi điểm danh đóng — số liệu + nhận xét + lớp đề xuất → xem/xuất phiếu ảnh (kèm bài đã chấm) → gửi Zalo cho PH → đóng.</p>
        </div>
        <div className="ml-auto inline-flex rounded-full bg-slate-100 p-0.5">
          {([['toi', `Của tôi (${cuaToi.length})`], ['tatca', `Tất cả (${canTraBai.length})`]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setLoc(k)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${loc === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
          ))}
          <button onClick={reload} title="Quét lại" className="rounded-full px-2 text-[14px] text-slate-400 hover:text-indigo-600">↻</button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : shown.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
          {loc === 'toi' && canTraBai.length > 0 ? `Không có ca nào gán cho bạn — hàng đợi chung còn ${canTraBai.length} ca.` : 'Không có bài nào cần trả.'}
        </div>
      ) : (
        <div className="grid gap-2.5">
          {shown.map((c) => <TraBaiCard key={c.id} c={c} onDone={() => daDong(c.id)} />)}
        </div>
      )}

      {daTraBai.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã trả bài ({daTraBai.length})</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {daTraBai.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                <span className="font-semibold text-slate-700">{c.hoTenHs}</span> · {c.mon}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
    </div>
  )
}

// Ô nhận xét gõ-để-tìm mẫu (thư viện chung, per môn+nhóm) — mirror V1 sat_hach_nhan_xet_templates.
function MauInput({ mon, nhom, value, onChange, placeholder }: { mon: string; nhom: 'ky_nang' | 'kien_thuc' | 'khac'; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [goiY, setGoiY] = useState<{ id: string; noiDung: string }[]>([])
  const [showGoiY, setShowGoiY] = useState(false)
  useEffect(() => {
    if (!showGoiY) return
    const t = setTimeout(() => { timNhanXetMau(mon, nhom, value).then((r) => setGoiY(r.map((x) => ({ id: x.id, noiDung: x.noiDung })))).catch(() => setGoiY([])) }, 200)
    return () => clearTimeout(t)
  }, [value, showGoiY, mon, nhom])
  return (
    <div className="relative">
      <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setShowGoiY(true)} onBlur={() => setTimeout(() => setShowGoiY(false), 150)}
        placeholder={placeholder} className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
      {showGoiY && goiY.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {goiY.map((g) => (
            <button key={g.id} onMouseDown={() => { onChange(g.noiDung); setShowGoiY(false) }} className="block w-full truncate px-2.5 py-1.5 text-left text-[12px] text-slate-600 hover:bg-indigo-50">{g.noiDung}</button>
          ))}
        </div>
      )}
      {value.trim() && <button onMouseDown={(e) => { e.preventDefault(); luuNhanXetMau(mon, nhom, value) }} className="absolute right-1.5 top-1.5 text-[11px] text-slate-300 hover:text-indigo-500" title="Lưu làm mẫu">💾</button>}
    </div>
  )
}

const KY_NANG_OPTS: { v: 'tot' | 'on' | 'kem'; lbl: string; cls: string }[] = [
  { v: 'tot', lbl: 'Tốt', cls: 'bg-emerald-600 text-white' }, { v: 'on', lbl: 'Ổn', cls: 'bg-amber-500 text-white' }, { v: 'kem', lbl: 'Kém', cls: 'bg-rose-600 text-white' },
]
const mauPct = (pct: number) => (pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500')

function Bar({ lbl, pct, sub }: { lbl: string; pct: number; sub?: string }) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-[12px] text-slate-500"><span>{lbl}{sub && <span className="ml-1 text-slate-400">({sub})</span>}</span><span className="font-semibold">{pct}%</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${mauPct(pct)}`} style={{ width: `${pct}%` }} /></div>
    </div>
  )
}
// 1 cặp nhóm (cơ bản/nâng cao · Đại/Hình) — nhóm không có câu (soCau=0) thì ẨN; cả 2 rỗng thì ẩn cả khối.
function CapNhom({ tieuDe, a, b }: { tieuDe: string; a: { lbl: string; n: NhomTiLe | null }; b: { lbl: string; n: NhomTiLe | null } }) {
  const items = [a, b].filter((x) => coNhom(x.n))
  if (!items.length) return null
  return (
    <div>
      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{tieuDe}</div>
      {items.map((x) => <Bar key={x.lbl} lbl={x.lbl} pct={x.n!.pct!} sub={`${x.n!.soCau} câu`} />)}
    </div>
  )
}

function TraBaiCard({ c, onDone }: { c: CaTestChoTraBai; onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [phieu, setPhieu] = useState<PhieuKetQua | null>(null)
  const [xemPhieu, setXemPhieu] = useState(false)
  const [nx, setNx] = useState<NhanXet>(c.nhanXet ?? {})
  const [lopOpts, setLopOpts] = useState<{ id: string; label: string; sub?: string }[]>([])
  const [lopId, setLopId] = useState<string | null>(c.lopDeXuatId)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    getPhieuKetQua(c.id).then(setPhieu).catch((e) => setErr(e.message ?? String(e)))
    listLop(c.khoi ?? undefined).then((l) => setLopOpts(l.filter((x) => x.mon === c.mon).map((x) => ({ id: x.id, label: x.ten_lop, sub: x.mon }))))
  }, [open, c.id]) // eslint-disable-line

  async function luuNhap() { await setNhanXet(c.id, nx) }
  // Phiếu ảnh cần nhận xét + lớp đề xuất MỚI NHẤT → lưu nháp rồi hỏi lại DB (lớp đề xuất ghi ở ung_vien).
  async function moPhieu() {
    setErr(null)
    try {
      await setNhanXet(c.id, nx)
      if (lopId && lopId !== c.lopDeXuatId) await import('../../lib/tuyensinh').then((m) => m.updateUngVien(c.ungVienId, { lop_du_kien_id: lopId }))
      setPhieu(await getPhieuKetQua(c.id)); setXemPhieu(true)
    } catch (e: any) { setErr(e.message ?? String(e)) }
  }
  async function dong() {
    setBusy(true); setErr(null)
    try { await setNhanXet(c.id, nx); await dongTraBai(c.id, c.ungVienId, lopId); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const conThieu = [c.choChamXong && 'chờ chấm', c.choScanDaCham && 'chờ scan bài đã chấm', !lopId && 'chờ chọn lớp đề xuất'].filter(Boolean) as string[]

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 text-left">
        <div>
          <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
          <div className="text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Lớp ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}{c.diemNhap != null ? ` · ${c.diemNhap} điểm` : ''}</div>
          {c.nguoiTraBaiTen && <div className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">👤 {c.nguoiTraBaiTen}</div>}
        </div>
        <div className="ml-auto flex flex-wrap justify-end gap-1">
          {conThieu.length === 0
            ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Đủ, sẵn sàng trả</span>
            : conThieu.map((t) => <span key={t} className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">{t}</span>)}
        </div>
        <span className="text-[12px] text-slate-400">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          {/* SỐ LIỆU — toàn bộ từ fn_test_dau_vao_phieu */}
          {phieu ? (
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-baseline gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Điểm</span>
                  <span className="text-[22px] font-bold text-indigo-600">{phieu.diemNhap ?? '—'}</span>
                  <span className="text-[12px] text-slate-400">· đúng {phieu.tong.pct}% ({phieu.tong.daCham}/{phieu.tong.soCau} câu đã chấm)</span>
                </div>
                {phieu.theoChuyenDe.length > 0 && (
                  <>
                    <div className="mb-1.5 mt-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Theo chuyên đề</div>
                    {phieu.theoChuyenDe.map((b) => <Bar key={b.chuyenDe} lbl={b.chuyenDe} pct={b.pct} sub={`${b.soCau} câu`} />)}
                  </>
                )}
              </div>
              <div className="space-y-3">
                <CapNhom tieuDe="Cơ bản · Nâng cao" a={{ lbl: 'Cơ bản (độ khó ≤3)', n: phieu.theoMucDo.coBan }} b={{ lbl: 'Nâng cao (độ khó ≥4)', n: phieu.theoMucDo.nangCao }} />
                <CapNhom tieuDe="Đại · Hình" a={{ lbl: 'Đại số', n: phieu.theoNhanh.dai }} b={{ lbl: 'Hình học', n: phieu.theoNhanh.hinh }} />
              </div>
            </div>
          ) : <p className="mb-3 text-[12px] text-slate-400">Đang tải số liệu…</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Kỹ năng</div>
              {(['trinhBay', 'tinhToan'] as const).map((k) => (
                <div key={k} className="mb-2 flex items-center gap-2">
                  <span className="w-24 text-[13px] text-slate-600">{k === 'trinhBay' ? 'Trình bày' : 'Tính toán'}</span>
                  {KY_NANG_OPTS.map((o) => (
                    <button key={o.v} onClick={() => setNx((s) => ({ ...s, [k]: s[k] === o.v ? undefined : o.v }))}
                      className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${nx[k] === o.v ? o.cls : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{o.lbl}</button>
                  ))}
                </div>
              ))}

              <div className="mb-1.5 mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Kiến thức</div>
              {([['hinhCoBan', 'Hình cơ bản'], ['daiCoBan', 'Đại cơ bản'], ['hinhNangCao', 'Hình nâng cao'], ['daiNangCao', 'Đại nâng cao']] as const).map(([k, lbl]) => (
                <div key={k} className="mb-1.5">
                  <div className="mb-0.5 text-[12px] text-slate-500">{lbl}</div>
                  <MauInput mon={c.mon} nhom="kien_thuc" value={nx.kienThuc?.[k] ?? ''} onChange={(v) => setNx((s) => ({ ...s, kienThuc: { ...s.kienThuc, [k]: v } }))} placeholder={`Nhận xét ${lbl.toLowerCase()}…`} />
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Nhận xét thêm</div>
              <MauInput mon={c.mon} nhom="khac" value={nx.khac ?? ''} onChange={(v) => setNx((s) => ({ ...s, khac: v }))} placeholder="Tuỳ chọn…" />

              <div className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Lớp đề xuất</div>
              <SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="🔎 Chọn lớp đề xuất…" />
              <p className="mt-1 text-[11px] text-slate-400">GV + lịch học của lớp sẽ in trên phiếu ảnh gửi PH.</p>

              {c.baiDaChamUrl && <a href={c.baiDaChamUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[12px] text-indigo-500 hover:underline">📄 Xem bài đã chấm</a>}
            </div>
          </div>

          {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={luuNhap} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-600 hover:border-indigo-300">Lưu nháp</button>
            <button onClick={moPhieu} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-600 hover:border-indigo-300">🖼 Xem / Xuất ảnh phiếu</button>
            <button onClick={dong} disabled={busy || conThieu.length > 0} title={conThieu.length > 0 ? conThieu.join(', ') : ''}
              className="ml-auto rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">
              {busy ? 'Đang xử lý…' : '✓ Đã gửi, đóng'}
            </button>
          </div>
        </div>
      )}
      {xemPhieu && phieu && <PhieuTestModal p={phieu} onClose={() => setXemPhieu(false)} />}
    </div>
  )
}
