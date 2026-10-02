// ============================================================================
// SoTayCongThucScreen — màn ERP "Sổ tay" (lá `sotay`, CEO 03/10). Bản GỌN của luồng Bản đồ kiến thức:
// xem thẻ công thức · sửa · duyệt / trả về · gắn hình đã vẽ. Spec: spec-so-tay-cong-thuc.md.
//
// Luật trạng thái KHÔNG nằm ở đây — trigger DB lo (sửa nội dung thẻ đã duyệt ⇒ tự về chờ duyệt, đóng dấu người
// xét, ghi nhật ký). Màn chỉ gửi đúng thứ người bấm rồi VÁ dòng DB trả về vào danh sách (CLAUDE §2: không quét lại).
// Màn unmount khi đổi lá ⇒ nhớ bộ đã tải + lựa chọn ở module (`NHO`) — quay lại là đúng chỗ cũ, ↻ để tải lại.
// Đếm/lọc dưới đây là đếm & lọc các dòng ĐANG HIỆN theo lựa chọn UI (§2.0 cho phép) — không có số nghiệp vụ nào.
// ============================================================================
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MathText } from '../kho/ui'
import { ImageSlot } from '../kho/DangHub'
import { MathTextarea } from '../../components/math/MathTextarea'
import {
  taiBo, luuThe, duyetThe, traVeThe, boDuyetThe, xoaThe, khoiPhucThe, themThe, datAnhHinh, themHinh, lichSu,
  CT_TRANG_THAI, HANH_DONG_TEN,
  type CtBo, type CtThe, type CtHinh, type CtSua, type CtTrangThai, type CtLichSu,
} from '../../lib/sotayCongThuc'

// Đợt 1 chỉ Toán 12 (Thùy 03/10). Thêm môn/khối = thêm vào đây; mọi thứ bên dưới chạy y hệt (§1.6 symmetry).
const PHAM_VI = [{ mon: 'Toán', khoi: '12' }] as const

type Loc = 'tat_ca' | CtTrangThai | 'rac'
type Tab = 'the' | 'hinh'
const NHO: { pv: number; bo: CtBo | null; tab: Tab; loc: Loc; chuDe: string | null; q: string; ma: string | null } = {
  pv: 0, bo: null, tab: 'the', loc: 'tat_ca', chuDe: null, q: '', ma: null,
}

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const loiMsg = (e: unknown) => (e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e))
const fmtLuc = (iso: string | null) => iso
  ? new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(iso))
  : ''

function Pill({ tt }: { tt: CtTrangThai }) {
  const m = CT_TRANG_THAI[tt]
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ${m.cls}`}>{m.ten}</span>
}
function Chip({ on, children, onClick, title }: { on: boolean; children: ReactNode; onClick: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title}
      className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition ${on ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-indigo-300'}`}>
      {children}
    </button>
  )
}

export default function SoTayCongThucScreen() {
  const [pv] = useState(NHO.pv)
  const { mon, khoi } = PHAM_VI[pv]
  const [bo, setBo] = useState<CtBo | null>(NHO.bo)
  const [loi, setLoi] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>(NHO.tab)
  const [loc, setLoc] = useState<Loc>(NHO.loc)
  const [chuDe, setChuDe] = useState<string | null>(NHO.chuDe)
  const [q, setQ] = useState(NHO.q)
  const [ma, setMa] = useState<string | null>(NHO.ma)
  const [taiLai, setTaiLai] = useState(0)
  const [them, setThem] = useState(false)

  useEffect(() => { Object.assign(NHO, { pv, bo, tab, loc, chuDe, q, ma }) }, [pv, bo, tab, loc, chuDe, q, ma])

  // Tải khi chưa có cache, hoặc bấm ↻. Refetch NỀN: giữ `bo` cũ tới khi có bộ mới (không chớp trắng).
  useEffect(() => {
    if (bo && taiLai === 0) return
    let huy = false
    setLoi(null)
    taiBo(mon, khoi).then((b) => { if (!huy) setBo(b) }).catch((e) => { if (!huy) setLoi(loiMsg(e)) })
    return () => { huy = true }
  }, [mon, khoi, taiLai]) // eslint-disable-line react-hooks/exhaustive-deps

  const vaThe = (t: CtThe) => setBo((b) => b && ({ ...b, the: b.the.some((x) => x.ma === t.ma) ? b.the.map((x) => (x.ma === t.ma ? t : x)) : [...b.the, t] }))
  const vaHinh = (h: CtHinh) => setBo((b) => b && ({ ...b, hinh: b.hinh.some((x) => x.ma === h.ma) ? b.hinh.map((x) => (x.ma === h.ma ? h : x)) : [...b.hinh, h] }))

  const ds = useMemo(() => {
    if (!bo) return []
    const tu = boDau(q.trim())
    return bo.the.filter((t) => {
      if (loc === 'rac' ? !t.xoa_at : t.xoa_at) return false
      if (loc !== 'tat_ca' && loc !== 'rac' && t.trang_thai !== loc) return false
      if (chuDe && t.chu_de !== chuDe) return false
      if (tu && !boDau(`${t.ma} ${t.ten} ${t.ten_khac.join(' ')}`).includes(tu)) return false
      return true
    })
  }, [bo, q, loc, chuDe])
  // Badge = đếm dòng đang có trong bộ đã tải (không phải số nghiệp vụ).
  const dem = useMemo(() => {
    const song = (bo?.the ?? []).filter((t) => !t.xoa_at)
    return {
      tat_ca: song.length, cho_duyet: song.filter((t) => t.trang_thai === 'cho_duyet').length,
      da_duyet: song.filter((t) => t.trang_thai === 'da_duyet').length, tra_ve: song.filter((t) => t.trang_thai === 'tra_ve').length,
      rac: (bo?.the ?? []).length - song.length,
    }
  }, [bo])
  const chon = bo?.the.find((t) => t.ma === ma) ?? null
  const hinhDaVe = (bo?.hinh ?? []).filter((h) => h.url).length

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <div>
          <h1 className="text-[17px] font-bold text-slate-800">Sổ tay công thức</h1>
          <p className="text-[12px] text-slate-500">{mon} · Khối {khoi} — HS chỉ thấy thẻ <b>đã duyệt</b>. Sửa nội dung thẻ đã duyệt ⇒ thẻ tự về <b>chờ duyệt</b>.</p>
        </div>
        <div className="ml-4 flex gap-1 rounded-lg bg-slate-100 p-1">
          {([['the', `Thẻ công thức (${dem.tat_ca})`], ['hinh', `Hình (${hinhDaVe}/${bo?.hinh.length ?? 0} đã vẽ)`]] as [Tab, string][]).map(([k, ten]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium ${tab === k ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{ten}</button>
          ))}
        </div>
        <button onClick={() => setTaiLai((n) => n + 1)} title="Tải lại từ DB"
          className="ml-auto rounded-md px-2.5 py-1.5 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻ Tải lại</button>
      </header>

      {loi && <div className="m-4 rounded-lg bg-rose-50 p-3 text-[13px] text-rose-700 ring-1 ring-rose-200">Không tải được: {loi}</div>}
      {!bo && !loi && <div className="p-8 text-[13px] text-slate-400">Đang tải…</div>}

      {bo && tab === 'hinh' && <TabHinh bo={bo} mon={mon} khoi={khoi} onVa={vaHinh} onMoThe={(m) => { setTab('the'); setMa(m); setLoc('tat_ca'); setChuDe(null); setQ('') }} />}

      {bo && tab === 'the' && (
        <div className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)]">
          {/* ── Cột trái: lọc + danh sách ── */}
          <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            <div className="space-y-2 border-b border-slate-100 p-3">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên, tên khác, mã…"
                className="w-full rounded-md px-3 py-1.5 text-[13px] ring-1 ring-slate-200 outline-none focus:ring-indigo-400" />
              <div className="flex flex-wrap gap-1">
                {([['tat_ca', 'Tất cả'], ['cho_duyet', 'Chờ duyệt'], ['tra_ve', 'Trả về'], ['da_duyet', 'Đã duyệt'], ['rac', 'Thùng rác']] as [Loc, string][]).map(([k, ten]) => (
                  <Chip key={k} on={loc === k} onClick={() => setLoc(k)}>{ten} {dem[k]}</Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                <Chip on={chuDe === null} onClick={() => setChuDe(null)}>Mọi chủ đề</Chip>
                {bo.chuDe.map((c) => <Chip key={c.ma} on={chuDe === c.ma} onClick={() => setChuDe(c.ma)} title={c.ten}>{c.ten.split(/[—(]/)[0].trim()}</Chip>)}
              </div>
              <button onClick={() => setThem((v) => !v)} className="w-full rounded-md border border-dashed border-indigo-300 py-1.5 text-[12.5px] font-medium text-indigo-600 hover:bg-indigo-50">
                {them ? 'Đóng' : '+ Thêm thẻ mới'}
              </button>
              {them && <ThemThe bo={bo} chuDeMacDinh={chuDe ?? bo.chuDe[0]?.ma ?? ''} mon={mon} khoi={khoi}
                onXong={(t) => { vaThe(t); setMa(t.ma); setThem(false); setLoc('tat_ca') }} />}
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              {ds.length === 0 && <p className="p-4 text-[12.5px] text-slate-400">Không có thẻ nào khớp bộ lọc.</p>}
              {ds.map((t) => {
                const thieuHinh = t.hinh && !bo.hinh.find((h) => h.ma === t.hinh)?.url
                return (
                  <button key={t.ma} onClick={() => setMa(t.ma)}
                    className={`block w-full border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50 ${t.ma === ma ? 'bg-indigo-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] text-slate-400">{t.ma}</span>
                      <span className="ml-auto flex items-center gap-1">
                        {t.ct2018 === 'nghi_van' && <span title="CT 2018: cần xác nhận" className="text-[11px]">❓</span>}
                        {t.ghi_chu_kiem && <span title="Nguồn có chỗ sai — đọc ghi chú" className="text-[11px]">❗</span>}
                        {thieuHinh && <span title="Hình chưa vẽ" className="text-[11px]">🖼</span>}
                        <Pill tt={t.trang_thai} />
                      </span>
                    </div>
                    <div className="mt-0.5 text-[13px] font-medium leading-snug text-slate-800">{t.ten}</div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* ── Cột phải: sửa + duyệt ── */}
          <div className="min-h-0 overflow-auto">
            {chon ? <SuaThe key={chon.ma} t={chon} bo={bo} onVa={vaThe} onMoHinh={() => setTab('hinh')} />
              : <p className="p-8 text-[13px] text-slate-400">Chọn một thẻ bên trái để xem, sửa và duyệt.</p>}
          </div>
        </div>
      )}
    </section>
  )
}

// ── Sửa 1 thẻ ───────────────────────────────────────────────────────────────
const tuThe = (t: CtThe): CtSua => ({
  ten: t.ten, ten_khac: t.ten_khac, noi_dung: t.noi_dung, luu_y: t.luu_y, cau_nho: t.cau_nho, hinh: t.hinh,
  chu_de: t.chu_de, ct2018: t.ct2018, ghi_chu_kiem: t.ghi_chu_kiem, nguon: t.nguon,
})
const rongLaNull = (s: string | null) => (s && s.trim() ? s : null)

function SuaThe({ t, bo, onVa, onMoHinh }: { t: CtThe; bo: CtBo; onVa: (t: CtThe) => void; onMoHinh: () => void }) {
  const [nhap, setNhap] = useState<CtSua>(() => tuThe(t))
  const [tenKhac, setTenKhac] = useState(t.ten_khac.join('\n'))
  const [nguon, setNguon] = useState(t.nguon.join(', '))
  const [dang, setDang] = useState<string | null>(null) // tên thao tác đang chạy
  const [bao, setBao] = useState<{ ok: boolean; chu: string } | null>(null)
  const [lyDo, setLyDo] = useState<string | null>(null) // != null ⇒ đang nhập lý do trả về
  const [moLs, setMoLs] = useState(false)

  const sua: CtSua = {
    ...nhap,
    ten_khac: tenKhac.split('\n').map((s) => s.trim()).filter(Boolean),
    nguon: nguon.split(',').map((s) => s.trim()).filter(Boolean),
    luu_y: rongLaNull(nhap.luu_y), cau_nho: rongLaNull(nhap.cau_nho), ghi_chu_kiem: rongLaNull(nhap.ghi_chu_kiem),
  }
  const goc = tuThe(t)
  const doi = JSON.stringify(sua) !== JSON.stringify({ ...goc, luu_y: rongLaNull(goc.luu_y), cau_nho: rongLaNull(goc.cau_nho), ghi_chu_kiem: rongLaNull(goc.ghi_chu_kiem) })
  const thieu = !sua.ten.trim() ? 'Thiếu tên' : !sua.noi_dung.trim() ? 'Thiếu nội dung' : null

  const chay = async (ten: string, fn: () => Promise<CtThe>, xong: string) => {
    setDang(ten); setBao(null)
    try { const moi = await fn(); onVa(moi); setBao({ ok: true, chu: xong }); setTimeout(() => setBao(null), 2200) }
    catch (e) { setBao({ ok: false, chu: loiMsg(e) }) }
    finally { setDang(null) }
  }
  const luu = () => chay('luu', () => luuThe(t.ma, sua), t.trang_thai === 'da_duyet' ? 'Đã lưu — thẻ về chờ duyệt' : 'Đã lưu')
  // Duyệt khi đang có chỗ sửa ⇒ lưu trước rồi duyệt (một lần bấm, không bắt người dùng nhớ thứ tự).
  const duyet = () => chay('duyet', async () => { if (doi) await luuThe(t.ma, sua); return duyetThe(t.ma) }, 'Đã duyệt — HS thấy thẻ này')

  const luuRef = useRef(luu); luuRef.current = luu
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); if (doi && !thieu) void luuRef.current() } }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [doi, thieu])

  const hinh = bo.hinh.find((h) => h.ma === sua.hinh) ?? null
  const set = <K extends keyof CtSua>(k: K, v: CtSua[K]) => setNhap((n) => ({ ...n, [k]: v }))
  const nhan = 'mb-1 block text-[11.5px] font-semibold uppercase tracking-wide text-slate-500'
  const o = 'w-full rounded-md bg-white px-3 py-1.5 text-[13.5px] ring-1 ring-slate-200 outline-none focus:ring-indigo-400'

  return (
    <div className="p-5">
      {/* Thanh trạng thái + hành động */}
      <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-[#f5f5f7]/95 px-5 py-3 backdrop-blur">
        <span className="font-mono text-[12px] text-slate-500">{t.ma}</span>
        <Pill tt={t.trang_thai} />
        {t.xet_at && <span className="text-[11.5px] text-slate-500">{t.trang_thai === 'da_duyet' ? 'duyệt' : 'trả về'} bởi {t.xet?.ho_ten ?? '—'} · {fmtLuc(t.xet_at)}</span>}
        {t.xoa_at && <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600">Trong thùng rác</span>}
        <span className="ml-auto flex flex-wrap items-center gap-2">
          {bao && <span className={`text-[12.5px] ${bao.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{bao.chu}</span>}
          <button onClick={luu} disabled={!doi || !!thieu || !!dang} title={thieu ?? 'Ctrl+S'}
            className="rounded-md bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-40">
            {dang === 'luu' ? 'Đang lưu…' : 'Lưu'}
          </button>
          {!t.xoa_at && t.trang_thai !== 'da_duyet' && (
            <button onClick={duyet} disabled={!!thieu || !!dang} title={thieu ?? undefined}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-40">
              {dang === 'duyet' ? 'Đang duyệt…' : doi ? 'Lưu & duyệt' : '✓ Duyệt'}
            </button>
          )}
          {!t.xoa_at && t.trang_thai !== 'tra_ve' && lyDo === null && (
            <button onClick={() => setLyDo('')} className="rounded-md px-3 py-1.5 text-[13px] font-medium text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">Trả về</button>
          )}
          {!t.xoa_at && t.trang_thai === 'da_duyet' && (
            <button onClick={() => chay('bo', () => boDuyetThe(t.ma), 'Đã bỏ duyệt — HS không thấy nữa')} disabled={!!dang}
              className="rounded-md px-3 py-1.5 text-[13px] text-slate-600 ring-1 ring-slate-200 hover:bg-white">Bỏ duyệt</button>
          )}
          {t.xoa_at
            ? <button onClick={() => chay('kp', () => khoiPhucThe(t.ma), 'Đã khôi phục')} className="rounded-md px-3 py-1.5 text-[13px] text-slate-600 ring-1 ring-slate-200 hover:bg-white">Khôi phục</button>
            : <button onClick={() => { if (confirm(`Đưa thẻ ${t.ma} vào thùng rác? (khôi phục được)`)) void chay('xoa', () => xoaThe(t.ma), 'Đã đưa vào thùng rác') }}
                className="rounded-md px-2.5 py-1.5 text-[13px] text-slate-400 hover:text-rose-600" title="Đưa vào thùng rác">🗑</button>}
        </span>
        {lyDo !== null && (
          <div className="flex w-full items-center gap-2">
            <input autoFocus value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do trả về (bắt buộc) — sai ở đâu, sửa thế nào"
              className="flex-1 rounded-md bg-white px-3 py-1.5 text-[13px] ring-1 ring-rose-300 outline-none" />
            <button disabled={!lyDo.trim() || !!dang}
              onClick={() => void chay('tv', () => traVeThe(t.ma, lyDo.trim()), 'Đã trả về').then(() => setLyDo(null))}
              className="rounded-md bg-rose-600 px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">Gửi trả về</button>
            <button onClick={() => setLyDo(null)} className="text-[13px] text-slate-500">Huỷ</button>
          </div>
        )}
      </div>

      {t.trang_thai === 'tra_ve' && t.ly_do_tra_ve && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-[13px] text-rose-800 ring-1 ring-rose-200"><b>Lý do trả về:</b> {t.ly_do_tra_ve} — sửa xong bấm Lưu, thẻ tự về chờ duyệt.</div>
      )}
      {sua.ghi_chu_kiem && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-[13px] text-amber-900 ring-1 ring-amber-200">
          <b>Đọc trước khi duyệt:</b> <MathText>{sua.ghi_chu_kiem}</MathText>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Trường sửa */}
        <div className="space-y-4">
          <div>
            <label className={nhan}>Tên công thức</label>
            <input value={nhap.ten} onChange={(e) => set('ten', e.target.value)} className={`${o} font-semibold`} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={nhan}>Tên khác — HS gõ những tên này cũng ra (mỗi dòng 1 tên)</label>
              <textarea value={tenKhac} onChange={(e) => setTenKhac(e.target.value)} rows={5} className={o} />
            </div>
            <div className="space-y-3">
              <div>
                <label className={nhan}>Chủ đề</label>
                <div className="flex flex-wrap gap-1">
                  {bo.chuDe.map((c) => <Chip key={c.ma} on={nhap.chu_de === c.ma} onClick={() => set('chu_de', c.ma)} title={c.ten}>{c.ten.split(/[—(]/)[0].trim()}</Chip>)}
                </div>
              </div>
              <div>
                <label className={nhan}>Chương trình 2018</label>
                <div className="flex gap-1">
                  <Chip on={nhap.ct2018 === 'co'} onClick={() => set('ct2018', 'co')}>Có trong CT</Chip>
                  <Chip on={nhap.ct2018 === 'nghi_van'} onClick={() => set('ct2018', 'nghi_van')}>❓ Cần xác nhận</Chip>
                </div>
              </div>
              <div>
                <label className={nhan}>Nguồn (cách nhau dấu phẩy)</label>
                <input value={nguon} onChange={(e) => setNguon(e.target.value)} className={o} placeholder="TD:12, BK" />
              </div>
            </div>
          </div>
          <div>
            <label className={nhan}>Nội dung — công thức trong $…$, mỗi dòng 1 ý</label>
            <MathTextarea value={nhap.noi_dung} onChange={(v) => set('noi_dung', v)} autoMaxPx={420} soanTitle={`Nội dung · ${t.ma}`}
              className={`${o} font-mono text-[12.5px]`} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={nhan}>Lưu ý</label>
              <MathTextarea value={nhap.luu_y ?? ''} onChange={(v) => set('luu_y', v)} autoMaxPx={200} className={`${o} font-mono text-[12.5px]`} />
            </div>
            <div>
              <label className={nhan}>Câu nhớ</label>
              <MathTextarea value={nhap.cau_nho ?? ''} onChange={(v) => set('cau_nho', v)} autoMaxPx={200} className={`${o} font-mono text-[12.5px]`} />
            </div>
          </div>
          <div>
            <label className={nhan}>Hình minh hoạ</label>
            <ChonHinh hinh={bo.hinh} ma={nhap.hinh} onChon={(m) => set('hinh', m)} />
            {hinh && !hinh.url && <p className="mt-1 text-[12px] text-amber-700">Hình {hinh.ma} chưa vẽ — gắn ảnh ở <button onClick={onMoHinh} className="underline">tab Hình</button>. HS thấy thẻ không có hình cho tới khi có ảnh.</p>}
          </div>
          <div>
            <label className={nhan}>Ghi chú kiểm (chỗ nguồn sai, chỗ cần người duyệt chú ý)</label>
            <textarea value={nhap.ghi_chu_kiem ?? ''} onChange={(e) => set('ghi_chu_kiem', e.target.value)} rows={2} className={o} />
          </div>

          <div className="rounded-lg bg-white ring-1 ring-slate-200">
            <button onClick={() => setMoLs((v) => !v)} className="w-full px-3 py-2 text-left text-[12.5px] font-semibold text-slate-600">{moLs ? '▾' : '▸'} Nhật ký thẻ</button>
            {moLs && <LichSu ma={t.ma} capNhat={t.cap_nhat_at} />}
          </div>
        </div>

        {/* Xem trước — đúng trình render của app HS */}
        <div>
          <div className="sticky top-16">
            <p className={nhan}>HS sẽ thấy</p>
            <XemTruoc ten={sua.ten} chuDe={bo.chuDe.find((c) => c.ma === sua.chu_de)?.ten ?? ''} noiDung={sua.noi_dung}
              luuY={sua.luu_y} cauNho={sua.cau_nho} hinhUrl={hinh?.url ?? null} />
          </div>
        </div>
      </div>
    </div>
  )
}

function XemTruoc({ ten, chuDe, noiDung, luuY, cauNho, hinhUrl }: { ten: string; chuDe: string; noiDung: string; luuY: string | null; cauNho: string | null; hinhUrl: string | null }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10.5px] font-bold text-indigo-700">Công thức</span>
      <h3 className="mt-2 text-[15px] font-bold text-slate-800">{ten || '—'}</h3>
      <p className="text-[11.5px] text-slate-500">{chuDe}</p>
      <div className="mt-3 text-[14px] leading-[1.75] text-slate-800"><MathText>{noiDung}</MathText></div>
      {hinhUrl && <img src={hinhUrl} alt="" className="mx-auto mt-3 max-h-56 rounded border border-slate-100" />}
      {luuY && <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-[13px] text-amber-900"><b>Lưu ý: </b><MathText>{luuY}</MathText></div>}
      {cauNho && <div className="mt-2 rounded-lg bg-indigo-50 p-2.5 text-[13px] text-indigo-900"><b>Mẹo nhớ: </b><MathText>{cauNho}</MathText></div>}
    </div>
  )
}

// Chọn hình: ô gõ lọc (không dropdown dài — memory "search-select").
function ChonHinh({ hinh, ma, onChon }: { hinh: CtHinh[]; ma: string | null; onChon: (m: string | null) => void }) {
  const [q, setQ] = useState('')
  const [mo, setMo] = useState(false)
  const cur = hinh.find((h) => h.ma === ma)
  const tu = boDau(q.trim())
  const ds = hinh.filter((h) => !tu || boDau(`${h.ma} ${h.ten}`).includes(tu)).slice(0, 12)
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {cur ? (
          <span className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-[13px] ring-1 ring-slate-200">
            <span className="font-mono text-[11px] text-slate-400">{cur.ma}</span>{cur.ten}
            {cur.url ? <span className="text-emerald-600">· đã vẽ</span> : <span className="text-amber-600">· chưa vẽ</span>}
            <button onClick={() => onChon(null)} className="text-slate-400 hover:text-rose-500" title="Bỏ hình">✕</button>
          </span>
        ) : <span className="text-[12.5px] text-slate-400">Không có hình</span>}
        <input value={q} onFocus={() => setMo(true)} onBlur={() => setTimeout(() => setMo(false), 150)} onChange={(e) => setQ(e.target.value)}
          placeholder="Gõ để chọn hình…" className="w-52 rounded-md bg-white px-2.5 py-1.5 text-[13px] ring-1 ring-slate-200 outline-none focus:ring-indigo-400" />
      </div>
      {mo && ds.length > 0 && (
        <div className="absolute z-20 mt-1 w-[420px] rounded-md bg-white py-1 shadow-lg ring-1 ring-slate-200">
          {ds.map((h) => (
            <button key={h.ma} onMouseDown={() => { onChon(h.ma); setQ('') }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-indigo-50">
              <span className="font-mono text-[11px] text-slate-400">{h.ma}</span>{h.ten}
              <span className={`ml-auto text-[11px] ${h.url ? 'text-emerald-600' : 'text-amber-600'}`}>{h.url ? 'đã vẽ' : 'chưa vẽ'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LichSu({ ma, capNhat }: { ma: string; capNhat: string }) {
  const [d, setD] = useState<{ dong: CtLichSu[]; ten: Record<string, string> } | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { lichSu(ma).then(setD).catch((e) => setLoi(loiMsg(e))) }, [ma, capNhat])
  if (loi) return <p className="px-3 pb-3 text-[12px] text-rose-600">{loi}</p>
  if (!d) return <p className="px-3 pb-3 text-[12px] text-slate-400">Đang tải…</p>
  return (
    <ul className="px-3 pb-3 text-[12.5px]">
      {d.dong.map((r) => (
        <li key={r.id} className="border-t border-slate-100 py-1.5">
          <b className="text-slate-700">{HANH_DONG_TEN[r.hanh_dong] ?? r.hanh_dong}</b>
          <span className="text-slate-500"> · {r.actor ? d.ten[r.actor] ?? 'nhân sự' : 'máy (nạp ban đầu)'} · {fmtLuc(r.at)}</span>
          {r.ly_do && <div className="text-rose-700">“{r.ly_do}”</div>}
          {r.ban_cu && typeof r.ban_cu.noi_dung === 'string' && (
            <details className="mt-1"><summary className="cursor-pointer text-slate-400">Bản trước khi sửa</summary>
              <div className="mt-1 rounded bg-slate-50 p-2"><MathText>{r.ban_cu.noi_dung}</MathText></div>
            </details>
          )}
        </li>
      ))}
    </ul>
  )
}

function ThemThe({ bo, chuDeMacDinh, mon, khoi, onXong }: { bo: CtBo; chuDeMacDinh: string; mon: string; khoi: string; onXong: (t: CtThe) => void }) {
  const [cd, setCd] = useState(chuDeMacDinh)
  const [ten, setTen] = useState('')
  const [nd, setNd] = useState('')
  const [loi, setLoi] = useState<string | null>(null)
  const [dang, setDang] = useState(false)
  return (
    <div className="space-y-2 rounded-lg bg-indigo-50/60 p-2.5 ring-1 ring-indigo-100">
      <div className="flex flex-wrap gap-1">
        {bo.chuDe.map((c) => <Chip key={c.ma} on={cd === c.ma} onClick={() => setCd(c.ma)} title={c.ten}>{c.ma}</Chip>)}
      </div>
      <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Tên công thức" className="w-full rounded-md px-2.5 py-1.5 text-[13px] ring-1 ring-slate-200 outline-none" />
      <textarea value={nd} onChange={(e) => setNd(e.target.value)} rows={3} placeholder="Nội dung, công thức trong $…$" className="w-full rounded-md px-2.5 py-1.5 font-mono text-[12px] ring-1 ring-slate-200 outline-none" />
      {loi && <p className="text-[12px] text-rose-600">{loi}</p>}
      <button disabled={!cd || !ten.trim() || !nd.trim() || dang}
        onClick={async () => { setDang(true); setLoi(null); try { onXong(await themThe(mon, khoi, cd, ten.trim(), nd.trim())) } catch (e) { setLoi(loiMsg(e)) } finally { setDang(false) } }}
        className="w-full rounded-md bg-indigo-600 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">{dang ? 'Đang tạo…' : 'Tạo thẻ (chờ duyệt)'}</button>
    </div>
  )
}

// ── Tab Hình: mỗi hình = mô tả cần vẽ + ô gắn ảnh (chọn file / Ctrl+V / cắt PDF) + các thẻ dùng hình ──
function TabHinh({ bo, mon, khoi, onVa, onMoThe }: { bo: CtBo; mon: string; khoi: string; onVa: (h: CtHinh) => void; onMoThe: (ma: string) => void }) {
  const [loc, setLoc] = useState<'tat_ca' | 'chua' | 'da'>('chua')
  const [loi, setLoi] = useState<string | null>(null)
  const [moi, setMoi] = useState<{ ten: string; mo_ta: string } | null>(null)
  const ds = bo.hinh.filter((h) => loc === 'tat_ca' || (loc === 'da' ? !!h.url : !h.url))
  const maKe = () => {
    const n = Math.max(0, ...bo.hinh.map((h) => Number(h.ma.replace(/\D/g, '')) || 0)) + 1
    return `H${String(n).padStart(2, '0')}`
  }
  return (
    <div className="min-h-0 flex-1 overflow-auto p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip on={loc === 'chua'} onClick={() => setLoc('chua')}>Chưa vẽ {bo.hinh.filter((h) => !h.url).length}</Chip>
        <Chip on={loc === 'da'} onClick={() => setLoc('da')}>Đã vẽ {bo.hinh.filter((h) => h.url).length}</Chip>
        <Chip on={loc === 'tat_ca'} onClick={() => setLoc('tat_ca')}>Tất cả</Chip>
        <span className="text-[12px] text-slate-500">Bản in kèm hình mẫu: <code>docs/so-tay-cong-thuc/hinh-can-ve-toan12.pdf</code></span>
        <button onClick={() => setMoi(moi ? null : { ten: '', mo_ta: '' })} className="ml-auto rounded-md border border-dashed border-indigo-300 px-3 py-1.5 text-[12.5px] text-indigo-600">+ Thêm hình</button>
      </div>
      {loi && <p className="mb-3 text-[12.5px] text-rose-600">{loi}</p>}
      {moi && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <span className="self-center font-mono text-[12px] text-slate-500">{maKe()}</span>
          <input value={moi.ten} onChange={(e) => setMoi({ ...moi, ten: e.target.value })} placeholder="Tên hình" className="w-64 rounded-md px-2.5 py-1.5 text-[13px] ring-1 ring-slate-200" />
          <input value={moi.mo_ta} onChange={(e) => setMoi({ ...moi, mo_ta: e.target.value })} placeholder="Cần vẽ gì" className="min-w-[280px] flex-1 rounded-md px-2.5 py-1.5 text-[13px] ring-1 ring-slate-200" />
          <button disabled={!moi.ten.trim() || !moi.mo_ta.trim()}
            onClick={async () => { try { onVa(await themHinh(mon, khoi, maKe(), moi.ten.trim(), moi.mo_ta.trim())); setMoi(null); setLoc('chua') } catch (e) { setLoi(loiMsg(e)) } }}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">Tạo</button>
        </div>
      )}
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {ds.map((h) => {
          const dung = bo.the.filter((t) => t.hinh === h.ma && !t.xoa_at)
          return (
            <div key={h.ma} className="flex flex-col gap-2 rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-slate-400">{h.ma}</span>
                <span className="text-[14px] font-semibold text-slate-800">{h.ten}</span>
                <span className={`ml-auto text-[11.5px] ${h.url ? 'text-emerald-600' : 'text-amber-600'}`}>{h.url ? 'đã vẽ' : 'chưa vẽ'}</span>
              </div>
              <p className="text-[12.5px] leading-snug text-slate-600">{h.mo_ta}</p>
              <ImageSlot url={h.url} label={`Ảnh ${h.ma}`}
                onChange={(url) => { setLoi(null); datAnhHinh(h, url).then(onVa).catch((e) => setLoi(loiMsg(e))) }} />
              <div className="flex flex-wrap gap-1 pt-1">
                {dung.map((t) => (
                  <button key={t.ma} onClick={() => onMoThe(t.ma)} className="rounded bg-slate-100 px-2 py-0.5 text-[11.5px] text-slate-600 hover:bg-indigo-100" title={t.ten}>{t.ma}</button>
                ))}
                {dung.length === 0 && <span className="text-[11.5px] text-slate-400">Chưa thẻ nào dùng</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
