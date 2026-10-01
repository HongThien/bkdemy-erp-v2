// ═══════════ KHO ĐỀ THI — nơi LƯU và SỬA đề (spec-de-thi.md §10, CEO 01/10/2026) ═══════════
// Đề vào bằng Claude (`/nhap-de-thi`: thả file vào thư mục chỉ định → Claude bóc, kiểm, gán dạng → ghi chưa duyệt).
// Màn này là chỗ làm việc CHÍNH của đề: danh sách 3 tab (Chờ duyệt · Sẵn sàng · Đã giao — suy động ở DB) và MỘT màn
// sửa duy nhất (`DeThiSoan`, gộp "Sửa đề" + "Duyệt đề" cũ): đề hiện đúng bố cục giấy, sửa tại chỗ mọi thứ của câu
// (nội dung · phương án · đáp án · lời giải · hình · dạng; Đúng/Sai: mỗi MỆNH ĐỀ một dạng), ghi chú của máy lúc nhập,
// đề gốc cạnh bên, thêm/bớt/đổi thứ tự câu, Duyệt · Giao · In. Kho tài liệu chỉ còn để in.
// Đường "Nhập đề thi từ PDF" (Gemini đọc trong trình duyệt) ĐÃ GỠ 01/10 theo quyết định CEO.
// Mọi invariant/đếm ở Postgres (fn_de_thi_*); client gọi + hiển thị + ghi dòng đơn. Sau mỗi sửa: VÁ TẠI CHỖ.
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'
import { useMonScope } from '../../hooks/useMonScope'
import {
  getDeThi, createDeThi, renameDeThi, deThiMeta, updateDeThiMeta, attachPdfGoc, addPhanDeThi, listPhanDeThi,
  deThiCau, deThiThieu, duyetDeThi, suaCauDeThi, themCauVaoPhan, bangCuaKho, nhanhCuaKhoPicker, canhBaoNhap,
  demKhoDeThi, listKhoDeThi,
  type DeThi, type DeThiMeta, type DeThiCau, type DeThiThieu, type DeThiDong, type Kho, type LoiDeThi, type SuaCauPatch, type TabKhoDe,
} from '../../lib/dethi'
import { setCauOfPhan, deletePhan, type TaiLieuPhan } from '../../lib/tailieu'
import { KHOI_OPTIONS, DEFAULT_KHOI, uploadKhoFile, searchCau, type CauTimThay, type MenhDe } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { MathTextarea } from '../../components/math/MathTextarea'
import { CauEditor, type ReviewItem } from '../kho/DangHub'
import DangPickerOne from '../../components/DangPickerOne'
import DeThiPrintView from './DeThiPrintView'
import { GiaoDeModal, DaGanPanel, LuotThiPanel } from './DuyetDeThi'

const MONS = ['Toán', 'KHTN']
const TABS: { key: TabKhoDe; ten: string }[] = [{ key: 'cho_duyet', ten: 'Chờ duyệt' }, { key: 'san_sang', ten: 'Sẵn sàng' }, { key: 'da_giao', ten: 'Đã giao' }]
const LOAI_TEN: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng / sai', tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận' }
const LOI_TEN: Record<LoiDeThi, string> = {
  cau_da_xoa: 'câu đã vào kho rác', dang_cho: 'chưa có dạng', thieu_dap_an: 'thiếu đáp án', thieu_phuong_an: 'thiếu phương án',
  tln_chua_mcq: 'chưa có 4 phương án trắc nghiệm', thieu_menh_de: 'thiếu mệnh đề', md_thieu_dap_an: 'ý chưa có Đ/S',
  md_dang_cho: 'có ý chưa có dạng', tu_luan_chi_in: 'tự luận — chỉ in, không lên app',
}
// Lỗi CHỈ CẢNH BÁO (không chặn duyệt / giao): chưa có dạng (K6) · tự luận chỉ in. Mọi lỗi khác chặn.
const CHI_CANH_BAO = new Set<LoiDeThi>(['dang_cho', 'md_dang_cho', 'tu_luan_chi_in'])
const laDangCho = (m: string | null | undefined) => !m || m.endsWith('000000')
const ngayVN = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '')
// Phiếu trả lời trắc nghiệm của Bộ, phần Trả lời ngắn: 4 ô; dấu "−" chỉ ở ô 1; dấu "," chỉ ở ô 2 hoặc 3; còn lại chữ số.
export function hopLePhieu4O(s: string): boolean {
  if (!s || s.length > 4 || !/^[0-9,-]+$/.test(s)) return false
  if (s.includes('-') && s.lastIndexOf('-') !== 0) return false
  const ph = [...s].map((ch, i) => (ch === ',' ? i : -1)).filter((i) => i >= 0)
  return ph.length <= 1 && ph.every((i) => i === 1 || i === 2) && /\d$/.test(s)
}

// ═══════════ DANH SÁCH ═══════════
// Màn hàng đợi ⇒ nhớ bộ lọc + danh sách + vị trí cuộn ở module-level; mở đề rồi quay lại đứng đúng chỗ cũ.
const NHO: { mon: string | null; khoi: string | null; tab: TabKhoDe; tim: string; rows: DeThiDong[]; het: boolean; scrollTop: number; coDuLieu: boolean } =
  { mon: null, khoi: null, tab: 'cho_duyet', tim: '', rows: [], het: false, scrollTop: 0, coDuLieu: false }

export default function KhoDeThiScreen() {
  const { allowedMons: monScope, isAll } = useMonScope()
  const allowedMons = isAll ? MONS : MONS.filter((m) => monScope.includes(m))
  const [mon, setMon] = useState(NHO.mon ?? allowedMons[0] ?? 'Toán')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(',')]) // eslint-disable-line
  const [khoi, setKhoi] = useState<string | null>(NHO.khoi)
  const [tab, setTab] = useState<TabKhoDe>(NHO.tab)
  const [tim, setTim] = useState(NHO.tim)
  const [rows, setRows] = useState<DeThiDong[]>(NHO.coDuLieu ? NHO.rows : [])
  const [het, setHet] = useState(NHO.het)
  const [loading, setLoading] = useState(!NHO.coDuLieu)
  const [them, setThem] = useState(false)
  const [dem, setDem] = useState<Record<TabKhoDe, number> | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [tao, setTao] = useState(false)
  const cuon = useRef<HTMLDivElement>(null)
  const lanDau = useRef(true)

  const nho = (r: DeThiDong[], h: boolean) => { Object.assign(NHO, { mon, khoi, tab, tim, rows: r, het: h, coDuLieu: true }) }
  // Đổi NGỮ CẢNH (môn / khối / tab / từ khoá) ⇒ tải lại từ đầu. Lần mount đầu mà đã có cache đúng ngữ cảnh ⇒ dùng cache.
  useEffect(() => {
    if (lanDau.current) {
      lanDau.current = false
      if (NHO.coDuLieu && NHO.mon === mon && NHO.khoi === khoi && NHO.tab === tab && NHO.tim === tim) {
        requestAnimationFrame(() => { if (cuon.current) cuon.current.scrollTop = NHO.scrollTop })
        return
      }
    }
    let song = true
    setLoading(true); setLoi(null); setRows([])
    const t = setTimeout(() => {
      listKhoDeThi(mon, khoi, tab, tim).then((r) => { if (song) { setRows(r); setHet(r.length < 25); nho(r, r.length < 25) } })
        .catch((e) => { if (song) setLoi(e.message ?? String(e)) }).finally(() => { if (song) setLoading(false) })
    }, tim ? 300 : 0)
    return () => { song = false; clearTimeout(t) }
  }, [mon, khoi, tab, tim]) // eslint-disable-line
  useEffect(() => { let song = true; demKhoDeThi(mon, khoi).then((d) => { if (song) setDem(d) }).catch(() => {}); return () => { song = false } }, [mon, khoi, openId])

  async function taiThem() {
    if (!rows.length) return
    setThem(true)
    try { const r = await listKhoDeThi(mon, khoi, tab, tim, rows[rows.length - 1].created_at); const all = [...rows, ...r]; setRows(all); setHet(r.length < 25); nho(all, r.length < 25) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setThem(false) }
  }
  // Quay lại từ màn sửa: làm mới NỀN đúng trang đang xem (không xoá danh sách, không cuộn về đầu).
  function dongDe() {
    setOpenId(null)
    listKhoDeThi(mon, khoi, tab, tim).then((r) => {
      setRows((prev) => { const moi = new Map(r.map((x) => [x.id, x])); const giu = prev.filter((x) => !moi.has(x.id) && x.created_at < (r[r.length - 1]?.created_at ?? '')); const all = [...r, ...giu]; nho(all, het); return all })
    }).catch(() => {})
    requestAnimationFrame(() => { if (cuon.current) cuon.current.scrollTop = NHO.scrollTop })
  }

  if (openId) return <DeThiSoan id={openId} onClose={dongDe} tuKho />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Kho đề thi</span>
        {allowedMons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        )}
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.ten}{dem ? <span className={`ml-1.5 rounded-full px-1.5 text-[11px] ${tab === t.key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>{dem[t.key]}</span> : null}
            </button>
          ))}
        </div>
        <select value={khoi ?? ''} onChange={(e) => setKhoi(e.target.value || null)} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[13px] text-slate-700">
          <option value="">Mọi khối</option>
          {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo tên đề…" className="w-64 rounded-md border border-slate-200 px-2.5 py-1.5 text-[13px] focus:border-indigo-400 focus:outline-none" />
        <button onClick={() => setTao(true)} className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">+ Tạo đề trống</button>
      </div>
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-1.5 text-[12px] text-slate-500">
        Đề mới: thả file (Word / PDF) vào <code className="rounded bg-white px-1">E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L&lt;khối&gt;</code> rồi gọi Claude chạy <code className="rounded bg-white px-1">/nhap-de-thi &lt;khối&gt;</code> — đề hiện ở tab Chờ duyệt.
      </div>

      <div ref={cuon} onScroll={(e) => { NHO.scrollTop = (e.target as HTMLDivElement).scrollTop }} className="min-h-0 flex-1 overflow-auto p-6">
        {loi ? <p className="text-sm text-rose-600">Không tải được: {loi}</p>
          : loading && rows.length === 0 ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">Không có đề nào ở tab này.</div>
          : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-2">Đề</th><th className="px-3 py-2">Khối</th><th className="px-3 py-2">Số câu</th><th className="px-3 py-2">Tình trạng</th>
                    {tab === 'da_giao' && <th className="px-3 py-2">Đã giao</th>}<th className="px-3 py-2">Nhập ngày</th></tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} onClick={() => setOpenId(r.id)} className="cursor-pointer border-t border-slate-100 hover:bg-indigo-50/40">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-slate-800">{r.ten}</div>
                        <div className="text-[12px] text-slate-400">{[r.nguon && r.nguon !== 'le' && r.nguon !== 'noctorium' ? r.nguon : null, r.nam, r.co_de_goc ? '📎 có đề gốc' : null].filter(Boolean).join(' · ')}</div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{r.khoi}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.so_cau}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {r.duyet_at && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-medium text-emerald-700">✓ đã duyệt {ngayVN(r.duyet_at)}</span>}
                          {r.so_chan > 0 && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11.5px] font-medium text-rose-700">{r.so_chan} câu thiếu đáp án</span>}
                          {r.so_chua_dang > 0 && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11.5px] text-amber-800">{r.so_chua_dang} câu chưa đủ dạng</span>}
                          {r.so_canh_bao_nhap > 0 && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[11.5px] text-sky-800">{r.so_canh_bao_nhap} ghi chú lúc nhập</span>}
                          {!r.duyet_at && !r.so_chan && !r.so_chua_dang && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11.5px] text-slate-600">đủ dữ liệu · chờ duyệt</span>}
                        </div>
                      </td>
                      {tab === 'da_giao' && <td className="px-3 py-2.5 text-slate-600">{r.so_luot} lượt{r.luot_gan_nhat ? ` · gần nhất ${ngayVN(r.luot_gan_nhat)}` : ''}</td>}
                      <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{ngayVN(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!het && (
                <div className="flex justify-center border-t border-slate-100 py-2.5">
                  <button onClick={taiThem} disabled={them} className="rounded-md border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-40">{them ? 'Đang tải…' : '↓ Tải thêm 25 đề'}</button>
                </div>
              )}
            </div>
          )}
      </div>
      {tao && <TaoDeTrong mon={mon} onClose={() => setTao(false)} onCreated={(id) => { setTao(false); setOpenId(id) }} />}
    </div>
  )
}

function TaoDeTrong({ mon, onClose, onCreated }: { mon: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [busy, setBusy] = useState(false)
  async function tao() { if (!ten.trim()) return; setBusy(true); try { const d = await createDeThi({ ten: ten.trim(), khoi, mon }); onCreated(d.id) } finally { setBusy(false) } }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[440px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Tạo đề trống</p>
        <p className="mt-1 text-[12px] text-slate-500">Dùng khi tự ghép đề từ câu đã có trong kho. Đề từ file thì để Claude nhập.</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên đề</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} className={`${inp} mt-1 w-full`} />
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Khối</label>
        <div className="mt-1 flex flex-wrap gap-1.5">{KHOI_OPTIONS.map((k) => <button key={k} onClick={() => setKhoi(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${khoi === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{k}</button>)}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!ten.trim() || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════ MÀN SỬA ĐỀ (gộp Sửa + Duyệt) ═══════════
type NoiDungCau = { ma_cau: string; noi_dung: string | null; anh_de: string | null; loi_giai: string | null; anh_dap_an: string | null }
async function taiNoiDung(mon: string, caus: DeThiCau[]): Promise<Record<string, NoiDungCau>> {
  const out: Record<string, NoiDungCau> = {}
  const theoKho = new Map<Kho, string[]>()
  for (const c of caus) theoKho.set(c.kho, [...(theoKho.get(c.kho) ?? []), c.ma_cau])
  for (const [kho, mas] of theoKho) {
    const { data, error } = await supabase.from(bangCuaKho(mon, kho).cauTbl).select('ma_cau, noi_dung, anh_de, loi_giai, anh_dap_an').in('ma_cau', mas).limit(1000)
    if (error) throw error
    for (const r of (data ?? []) as NoiDungCau[]) out[r.ma_cau] = r
  }
  return out
}
async function taiTenDang(mon: string, caus: Pick<DeThiCau, 'kho' | 'dang_chinh' | 'menh_de'>[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  const theoKho = new Map<Kho, Set<string>>()
  for (const c of caus) {
    const s = theoKho.get(c.kho) ?? new Set<string>()
    if (c.dang_chinh) s.add(c.dang_chinh)
    for (const m of c.menh_de ?? []) if (m.ma_dang) s.add(m.ma_dang)
    theoKho.set(c.kho, s)
  }
  for (const [kho, s] of theoKho) {
    if (!s.size) continue
    const { data } = await supabase.from(bangCuaKho(mon, kho).banDoTbl).select('ma_dang, ten_dang').in('ma_dang', [...s]).limit(1000)
    for (const r of (data ?? []) as { ma_dang: string; ten_dang: string }[]) out[r.ma_dang] = r.ten_dang
  }
  return out
}

export function DeThiSoan({ id, onClose, tuKho }: { id: string; onClose: () => void; tuKho?: boolean }) {
  const [d, setD] = useState<DeThi | null>(null)
  const [ten, setTen] = useState('')
  const [meta, setMeta] = useState<DeThiMeta | null>(null)
  const [phans, setPhans] = useState<TaiLieuPhan[]>([])
  const [caus, setCaus] = useState<DeThiCau[] | null>(null)
  const [nd, setNd] = useState<Record<string, NoiDungCau>>({})
  const [tenDang, setTenDang] = useState<Record<string, string>>({})
  const [thieu, setThieu] = useState<DeThiThieu | null>(null)
  const [chiCanXem, setChiCanXem] = useState(false)
  const [xemGoc, setXemGoc] = useState(false)
  const [pick, setPick] = useState<{ c: DeThiCau; md: number | null } | null>(null)
  const [themVao, setThemVao] = useState<string | null>(null) // id phần đang thêm câu có sẵn
  const [printing, setPrinting] = useState(false)
  const [giao, setGiao] = useState(false)
  const [lamMoiLuot, setLamMoiLuot] = useState(0)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const pdfRef = useRef<HTMLInputElement>(null)
  const flash = (ok: boolean, t: string) => { setMsg({ ok, t }); setTimeout(() => setMsg(null), ok ? 2500 : 7000) }

  // Tải lại CẤU TRÚC (phần + câu) ở nền — giữ nguyên danh sách đang hiện tới khi có bản mới.
  async function taiCau(deMon: string) {
    const [ps, cs] = await Promise.all([listPhanDeThi(id), deThiCau(id)])
    const [n, td, th] = await Promise.all([taiNoiDung(deMon, cs), taiTenDang(deMon, cs), deThiThieu(id)])
    setPhans(ps); setCaus(cs); setNd(n); setTenDang((s) => ({ ...s, ...td })); setThieu(th)
  }
  useEffect(() => {
    (async () => {
      const de = await getDeThi(id)
      setD(de); setTen(de.ten); setMeta(deThiMeta(de))
      await taiCau(de.mon)
    })().catch((e) => flash(false, e.message ?? String(e)))
  }, [id]) // eslint-disable-line

  const ghiChu = useMemo(() => (d ? canhBaoNhap(d) : {}), [d])
  const loiCua = useMemo(() => new Map((thieu?.cau ?? []).map((x) => [x.ma_cau, x.loi])), [thieu])
  const quetLai = () => { deThiThieu(id).then(setThieu).catch(() => {}) }
  const va = (ma: string, patch: Partial<DeThiCau>) => setCaus((prev) => prev?.map((c) => (c.ma_cau === ma ? { ...c, ...patch } : c)) ?? prev)

  async function sua(c: DeThiCau, patch: SuaCauPatch, localNd?: Partial<NoiDungCau>): Promise<boolean> {
    if (!d) return false
    try {
      await suaCauDeThi(d.mon, c.kho, c.ma_cau, patch, d.id)
      const { noi_dung, loi_giai, anh_de, anh_dap_an, ...cauPatch } = patch; void noi_dung; void loi_giai; void anh_de; void anh_dap_an
      va(c.ma_cau, cauPatch as Partial<DeThiCau>)
      if (localNd) setNd((s) => ({ ...s, [c.ma_cau]: { ...(s[c.ma_cau] ?? { ma_cau: c.ma_cau, noi_dung: null, anh_de: null, loi_giai: null, anh_dap_an: null }), ...localNd } }))
      quetLai(); flash(true, 'Đã lưu')
      return true
    } catch (e: any) { flash(false, e.message ?? String(e)); return false }
  }
  async function chonDang(maDang: string) {
    if (!pick || !d) return
    const { c, md } = pick; setPick(null)
    if (md == null) await sua(c, { dang_chinh: maDang })
    else await sua(c, { menh_de: (c.menh_de ?? []).map((m, i) => (i === md ? { ...m, ma_dang: maDang } : m)) })
    if (!tenDang[maDang]) taiTenDang(d.mon, [{ kho: c.kho, dang_chinh: maDang, menh_de: null }]).then((t) => setTenDang((s) => ({ ...s, ...t })))
  }
  async function duyet() {
    setBusy(true)
    try {
      const r = await duyetDeThi(id)
      const at = new Date().toISOString()
      setD((x) => (x ? { ...x, duyet_at: at } : x))
      flash(true, `Đã duyệt đề — ${r.so_cau} câu vào kho chuẩn${r.so_cau_cho_dang ? `, ${r.so_cau_cho_dang} câu chờ có dạng` : ''}.`)
      deThiCau(id).then(setCaus).catch(() => {})
    } catch (e: any) { flash(false, e.message ?? String(e)) } finally { setBusy(false) }
  }
  // ── cấu trúc đề: bớt câu · đổi thứ tự · thêm câu có sẵn · phần ──
  const cauCuaPhan = (pid: string) => (caus ?? []).filter((c) => c.phan_id === pid)
  async function datThuTu(pid: string, mas: string[]) {
    if (!d) return
    try { await setCauOfPhan(pid, mas); await supabase.from('tai_lieu').update({ updated_at: new Date().toISOString() }).eq('id', id); await taiCau(d.mon); flash(true, 'Đã lưu') }
    catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  function boCau(c: DeThiCau) {
    if (!confirm(`Bỏ câu ${c.ma_cau} khỏi đề? (Câu VẪN CÒN trong kho, chỉ gỡ khỏi đề này.)`)) return
    datThuTu(c.phan_id, cauCuaPhan(c.phan_id).map((x) => x.ma_cau).filter((m) => m !== c.ma_cau))
  }
  function doiCho(c: DeThiCau, huong: -1 | 1) {
    const mas = cauCuaPhan(c.phan_id).map((x) => x.ma_cau); const i = mas.indexOf(c.ma_cau); const j = i + huong
    if (i < 0 || j < 0 || j >= mas.length) return
    ;[mas[i], mas[j]] = [mas[j], mas[i]]
    datThuTu(c.phan_id, mas)
  }
  async function themCau(pid: string, maCau: string, kho: Kho) {
    if (!d) return
    try { await themCauVaoPhan(id, pid, maCau, kho); setThemVao(null); const de = await getDeThi(id); setD(de); await taiCau(de.mon); flash(true, `Đã thêm ${maCau}`) }
    catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function themPhan() {
    if (!d) return
    const tieuDe = prompt('Tên phần:', `Phần ${phans.length + 1}`)?.trim(); if (!tieuDe) return
    try { await addPhanDeThi(id, tieuDe); await taiCau(d.mon) } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function xoaPhan(p: TaiLieuPhan) {
    if (!d) return
    if (!confirm(`Xoá "${p.tieu_de}" khỏi đề? ${cauCuaPhan(p.id).length} câu của phần này bị gỡ khỏi đề (câu VẪN CÒN trong kho).`)) return
    try { await deletePhan(p.id); await taiCau(d.mon); flash(true, 'Đã xoá phần') } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function luuMeta(patch: Partial<DeThiMeta>) { setMeta((m) => (m ? { ...m, ...patch } : m)); try { await updateDeThiMeta(id, patch); flash(true, 'Đã lưu') } catch (e: any) { flash(false, e.message ?? String(e)) } }
  async function luuTen() { if (d && ten.trim() && ten.trim() !== d.ten) { try { await renameDeThi(id, ten.trim()); setD({ ...d, ten: ten.trim() }); flash(true, 'Đã lưu') } catch (e: any) { flash(false, e.message ?? String(e)) } } }
  async function dinhKemGoc(f: File) { try { const { url } = await uploadKhoFile(f); await attachPdfGoc(id, url); setMeta((m) => (m ? { ...m, pdfGocUrl: url } : m)); setXemGoc(true) } catch (e: any) { flash(false, e.message ?? String(e)) } }
  function dong() { useStore.getState().enqueueLinkGen(id, 'de_thi'); onClose() }

  if (!d || !meta) return <div className="p-8 text-sm text-slate-400">{msg && !msg.ok ? <span className="text-rose-600">Lỗi: {msg.t}</span> : 'Đang tải đề…'}</div>
  const soChan = thieu?.so_chan ?? 0
  const soChuaDang = thieu?.so_chua_dang ?? 0
  const soGhiChu = Object.keys(ghiChu).length
  const canXem = (c: DeThiCau) => (loiCua.get(c.ma_cau)?.length ?? 0) > 0 || (ghiChu[c.ma_cau]?.length ?? 0) > 0

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={dong} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← {tuKho ? 'Kho đề thi' : 'Quay lại'}</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={luuTen} className="min-w-[260px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">{d.mon} · Khối {d.khoi}</span>
        {d.duyet_at && <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Đã duyệt {ngayVN(d.duyet_at)}</span>}
        {thieu && (soChan > 0
          ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[12px] font-medium text-rose-700">{soChan}/{thieu.tong} câu thiếu đáp án</span>
          : <span className="rounded bg-emerald-50 px-2 py-0.5 text-[12px] font-medium text-emerald-700">Đủ đáp án · {thieu.tong} câu</span>)}
        {soChuaDang > 0 && <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] text-amber-800" title="Đề vẫn dùng được; câu chưa có dạng chưa tính mastery cho tới khi gán dạng">{soChuaDang} câu chưa đủ dạng</span>}
        {soGhiChu > 0 && <span className="rounded bg-sky-50 px-2 py-0.5 text-[12px] text-sky-800">{soGhiChu} ghi chú lúc nhập</span>}
        {msg && <span className={`text-[12px] ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{msg.ok ? '✓ ' : ''}{msg.t}</span>}
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600"><input type="checkbox" checked={chiCanXem} onChange={(e) => setChiCanXem(e.target.checked)} /> Chỉ câu cần xem</label>
          <input ref={pdfRef} type="file" accept="application/pdf" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) dinhKemGoc(f); e.target.value = '' }} />
          {meta.pdfGocUrl
            ? <button onClick={() => setXemGoc((v) => !v)} className={`rounded-md border px-2.5 py-1.5 text-[12px] font-medium ${xemGoc ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-300 text-slate-600 hover:border-indigo-400'}`}>📎 Đề gốc {xemGoc ? '(đang mở)' : ''}</button>
            : <button onClick={() => pdfRef.current?.click()} className="rounded-md border border-dashed border-slate-300 px-2.5 py-1.5 text-[12px] font-medium text-slate-500 hover:border-indigo-400">📎 Đính kèm đề gốc</button>}
          <button onClick={() => setPrinting(true)} disabled={!caus?.length} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:border-indigo-400 disabled:opacity-40">🖨 In</button>
          <button onClick={() => setGiao(true)} disabled={!caus?.length} className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">📱 Giao</button>
          <button onClick={duyet} disabled={busy || !thieu || soChan > 0 || !caus?.length}
            title={soChan ? 'Còn câu thiếu đáp án / phương án — bổ sung rồi mới duyệt được' : 'Xác nhận nội dung + đáp án cả đề. Câu đã có dạng vào kho chuẩn.'}
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
            {busy ? 'Đang duyệt…' : d.duyet_at ? '✅ Duyệt lại' : '✅ Duyệt đề'}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-5">
          <div className="mx-auto max-w-[980px] space-y-5">
            <details className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
              <summary className="cursor-pointer text-[12.5px] font-medium text-slate-600">Thông tin đề: {[meta.nguon, meta.nam, meta.thoiGianPhut ? `${meta.thoiGianPhut} phút` : null, `thang ${meta.thangDiem}`].filter(Boolean).join(' · ')}</summary>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <O label="Nguồn (trường/sở)"><input defaultValue={meta.nguon} onBlur={(e) => luuMeta({ nguon: e.target.value })} className={inp} /></O>
                <O label="Cấp"><input defaultValue={meta.cap} onBlur={(e) => luuMeta({ cap: e.target.value })} className={inp} /></O>
                <O label="Năm"><input type="number" defaultValue={meta.nam ?? ''} onBlur={(e) => luuMeta({ nam: e.target.value ? +e.target.value : null })} className={inp} /></O>
                <O label="Thời gian (phút)"><input type="number" defaultValue={meta.thoiGianPhut ?? ''} onBlur={(e) => luuMeta({ thoiGianPhut: e.target.value ? +e.target.value : null })} className={inp} /></O>
                <O label="Thang điểm"><input type="number" defaultValue={meta.thangDiem} onBlur={(e) => luuMeta({ thangDiem: +e.target.value || 10 })} className={inp} /></O>
              </div>
            </details>

            {!caus ? <p className="text-sm text-slate-400">Đang tải câu…</p> : phans.map((p) => {
              const cs = cauCuaPhan(p.id)
              return (
                <div key={p.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-[14px] font-bold uppercase tracking-wide text-slate-700">{p.tieu_de}</p>
                    <span className="text-[12px] text-slate-400">{cs.length} câu</span>
                    <button onClick={() => setThemVao(themVao === p.id ? null : p.id)} className="ml-auto rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">+ Thêm câu có sẵn trong kho</button>
                    <button onClick={() => xoaPhan(p)} className="text-[12px] text-slate-300 hover:text-rose-600">Xoá phần</button>
                  </div>
                  {themVao === p.id && <ThemCauCoSan mon={d.mon} onPick={(ma, kho) => themCau(p.id, ma, kho)} />}
                  <div className="space-y-3">
                    {cs.map((c, i) => (chiCanXem && !canXem(c)) ? null : (
                      <CauThe key={c.ma_cau} c={c} so={i + 1} nd={nd[c.ma_cau]} tenDang={tenDang} loi={loiCua.get(c.ma_cau) ?? []} ghiChu={ghiChu[c.ma_cau] ?? []}
                        dau={i === 0} cuoi={i === cs.length - 1}
                        onChonDang={(md) => setPick({ c, md })} onSua={(patch, localNd) => sua(c, patch, localNd)}
                        onBo={() => boCau(c)} onDoiCho={(h) => doiCho(c, h)} />
                    ))}
                  </div>
                </div>
              )
            })}
            {caus && <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-2.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">+ Thêm phần</button>}
            <DaGanPanel deId={id} lamMoi={lamMoiLuot} />
            <LuotThiPanel deId={id} lamMoi={lamMoiLuot} />
          </div>
        </div>
        {xemGoc && meta.pdfGocUrl && (
          <div className="flex w-[46%] min-w-[420px] flex-col border-l border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-1.5 text-[12px] text-slate-500">
              Đề gốc <a href={meta.pdfGocUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">mở tab mới</a>
              <button onClick={() => setXemGoc(false)} className="ml-auto text-slate-400 hover:text-rose-600">✕ Đóng</button>
            </div>
            <iframe title="Đề gốc" src={meta.pdfGocUrl} className="min-h-0 flex-1" />
          </div>
        )}
      </div>

      {pick && <DangPickerOne khoi={d.khoi} mon={d.mon} nhanh={nhanhCuaKhoPicker(pick.c.kho)} onClose={() => setPick(null)} onPick={(ma) => chonDang(ma)} />}
      {printing && <DeThiPrintView id={id} onClose={() => setPrinting(false)} />}
      {giao && <GiaoDeModal de={d} thoiGianMacDinh={meta.thoiGianPhut} onClose={() => setGiao(false)} onDone={() => setLamMoiLuot((n) => n + 1)} />}
    </div>
  )
}

function O({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</label>{children}</div>
}

// Tìm câu ĐÃ CÓ trong kho để gắn vào đề (không tạo bản sao). Chọn kho trước vì đề Toán trộn Đại số + Hình giải tích.
function ThemCauCoSan({ mon, onPick }: { mon: string; onPick: (maCau: string, kho: Kho) => void }) {
  const KHOS: { kho: Kho; ten: string }[] = mon === 'KHTN' ? [{ kho: 'khtn', ten: 'KHTN' }] : [{ kho: 'dai', ten: 'Đại số' }, { kho: 'hgt', ten: 'Hình giải tích' }]
  const [kho, setKho] = useState<Kho>(KHOS[0].kho)
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<CauTimThay[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const term = q.trim()
    if (!term) { setRows([]); return }
    setLoading(true)
    const t = setTimeout(() => { searchCau(term, bangCuaKho(mon, kho).cauTbl).then(setRows).catch(() => setRows([])).finally(() => setLoading(false)) }, 300)
    return () => clearTimeout(t)
  }, [q, kho, mon])
  return (
    <div className="mb-3 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
      <div className="flex items-center gap-2">
        {KHOS.length > 1 && <div className="flex gap-0.5 rounded-lg bg-white p-0.5">{KHOS.map((k) => <button key={k.kho} onClick={() => setKho(k.kho)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${kho === k.kho ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>{k.ten}</button>)}</div>}
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ mã câu hoặc một đoạn nội dung…" className={`${inp} flex-1 bg-white`} />
      </div>
      {loading && <p className="mt-1 text-[12px] text-slate-400">Đang tìm…</p>}
      {!!rows.length && (
        <div className="mt-2 max-h-56 space-y-1.5 overflow-auto">
          {rows.map((c) => (
            <button key={c.ma_cau} onClick={() => onPick(c.ma_cau, kho)} className="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-sky-400">
              <div className="mb-0.5 flex items-center gap-2 text-[11px]"><span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{c.ma_cau}</span><span className="text-slate-400">{c.dangTen}</span></div>
              <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CauThe({ c, so, nd, tenDang, loi, ghiChu, dau, cuoi, onChonDang, onSua, onBo, onDoiCho }: {
  c: DeThiCau; so: number; nd?: NoiDungCau; tenDang: Record<string, string>; loi: LoiDeThi[]; ghiChu: string[]; dau: boolean; cuoi: boolean
  onChonDang: (md: number | null) => void
  onSua: (patch: SuaCauPatch, localNd?: Partial<NoiDungCau>) => Promise<boolean>
  onBo: () => void; onDoiCho: (huong: -1 | 1) => void
}) {
  const [soan, setSoan] = useState(false)
  const chan = loi.filter((x) => !CHI_CANH_BAO.has(x))
  const vien = c.xoa ? 'border-slate-300 opacity-60' : chan.length ? 'border-rose-200' : (loi.length || ghiChu.length) ? 'border-amber-200' : 'border-slate-200'
  const laDS = c.loai_cau === 'dung_sai'
  return (
    <div className={`rounded-xl border bg-white p-4 ${vien}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-bold text-slate-700">Câu {so}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{LOAI_TEN[c.loai_cau ?? ''] ?? c.loai_cau}</span>
        <span className="font-mono text-[10px] text-slate-400">{c.ma_cau}</span>
        <span className="text-[11px] text-slate-400">{c.diem} đ</span>
        {c.da_duyet && <span className="text-[11px] text-emerald-600">✓ kho chuẩn</span>}
        {loi.map((x) => <span key={x} className={`rounded px-1.5 py-0.5 text-[11px] ${CHI_CANH_BAO.has(x) ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'}`}>{LOI_TEN[x]}</span>)}
        <span className="ml-auto flex items-center gap-1">
          <button disabled={dau} onClick={() => onDoiCho(-1)} title="Đưa lên" className="rounded border border-slate-200 px-1.5 text-[12px] text-slate-500 hover:border-indigo-300 disabled:opacity-30">↑</button>
          <button disabled={cuoi} onClick={() => onDoiCho(1)} title="Đưa xuống" className="rounded border border-slate-200 px-1.5 text-[12px] text-slate-500 hover:border-indigo-300 disabled:opacity-30">↓</button>
          {!c.xoa && <button onClick={() => setSoan((v) => !v)} className={`rounded border px-2 py-0.5 text-[12px] font-medium ${soan ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{soan ? 'Đóng sửa' : '✎ Sửa nội dung'}</button>}
          <button onClick={onBo} title="Bỏ khỏi đề (câu vẫn còn trong kho)" className="rounded border border-slate-200 px-1.5 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
        </span>
      </div>

      {ghiChu.length > 0 && (
        <ul className="mb-2 space-y-1">
          {ghiChu.map((g, i) => <li key={i} className="rounded-lg bg-sky-50 px-2.5 py-1.5 text-[12.5px] text-sky-900">📝 {g}</li>)}
        </ul>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-slate-500">{laDS ? 'Dạng của cả câu:' : 'Dạng:'}</span>
        <span className={laDangCho(c.dang_chinh) ? 'font-medium text-amber-700' : 'text-slate-700'}>
          {laDangCho(c.dang_chinh) ? 'chưa có dạng' : `${tenDang[c.dang_chinh!] ?? ''} (${c.dang_chinh})`}
        </span>
        <button onClick={() => onChonDang(null)} disabled={c.xoa} className="rounded border border-indigo-200 px-2 py-0.5 text-[12px] text-indigo-700 hover:bg-indigo-50">Chọn dạng</button>
      </div>

      {soan
        ? (laDS
            ? <SoanDungSai c={c} nd={nd} onHuy={() => setSoan(false)} onLuu={async (patch, localNd) => { if (await onSua(patch, localNd)) setSoan(false) }} />
            : <SoanCau c={c} nd={nd} onHuy={() => setSoan(false)} onLuu={async (patch, localNd) => { if (await onSua(patch, localNd)) setSoan(false) }} />)
        : (<>
          {nd?.noi_dung && <div className="mb-2 text-[14px] leading-relaxed text-slate-800"><MathText>{nd.noi_dung}</MathText></div>}
          {nd?.anh_de && <img src={nd.anh_de} alt="hình của đề" className="mb-2 max-h-72 rounded border border-slate-200" />}

          {c.loai_cau === 'trac_nghiem' && (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {(c.lua_chon ?? []).map((o, i) => {
                const chu = 'ABCD'[i]; const dung = (c.dap_an ?? '').trim().toUpperCase() === chu
                return (
                  <button key={i} onClick={() => onSua({ dap_an: chu })} title="Bấm để đặt làm đáp án đúng"
                    className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] ${dung ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${dung ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{chu}</span>
                    <span className="min-w-0 flex-1"><MathText>{o}</MathText></span>
                  </button>
                )
              })}
            </div>
          )}

          {laDS && (
            <div className="space-y-1.5">
              {(c.menh_de ?? []).map((m, i) => (
                <div key={i} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px]">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-500">{'abcd'[i]})</span>
                    <span className="min-w-0 flex-1"><MathText>{m.noi_dung}</MathText></span>
                    {(['D', 'S'] as const).map((v) => (
                      <button key={v} onClick={() => onSua({ menh_de: (c.menh_de ?? []).map((x, j) => (j === i ? { ...x, dap_an: v } : x)) })}
                        className={`w-14 shrink-0 rounded-md border py-0.5 text-[12px] font-medium ${m.dap_an === v ? (v === 'D' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700') : 'border-slate-200 text-slate-400'}`}>
                        {v === 'D' ? 'Đúng' : 'Sai'}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 pl-6 text-[12px]">
                    <span className="text-slate-400">Dạng của ý này:</span>
                    <span className={laDangCho(m.ma_dang) ? 'font-medium text-amber-700' : 'text-slate-700'}>{laDangCho(m.ma_dang) ? 'chưa có dạng' : `${tenDang[m.ma_dang] ?? ''} (${m.ma_dang})`}</span>
                    <button onClick={() => onChonDang(i)} disabled={c.xoa} className="rounded border border-indigo-200 px-2 py-0.5 text-indigo-700 hover:bg-indigo-50">Chọn dạng</button>
                  </div>
                  {m.loi_giai && (
                    <details className="mt-1 pl-6 text-[12.5px] text-slate-600">
                      <summary className="cursor-pointer text-[12px] text-slate-400">Lời giải ý {'abcd'[i]}</summary>
                      <div className="mt-1"><MathText>{m.loi_giai}</MathText></div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {c.loai_cau === 'tra_loi_ngan' && <DapSoTLN dapSo={c.dap_an ?? ''} onLuu={(v) => onSua({ dap_an: v || null })} />}
          {c.loai_cau === 'tu_luan' && <p className="text-[12px] text-amber-700">Câu tự luận — giữ nguyên để in, học sinh không làm câu này trên app.</p>}

          {(nd?.loi_giai || nd?.anh_dap_an) && (
            <details className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-[13px] text-slate-700">
              <summary className="cursor-pointer text-[12px] font-medium text-slate-500">Lời giải</summary>
              {nd?.loi_giai && <div className="mt-1"><MathText>{nd.loi_giai}</MathText></div>}
              {nd?.anh_dap_an && <img src={nd.anh_dap_an} alt="hình lời giải" className="mt-2 max-h-72 rounded border border-slate-200" />}
            </details>
          )}
        </>)}
    </div>
  )
}

// Trả lời ngắn: GIỮ FORM ĐỀ GỐC (K5) — ô đáp số, kiểm theo phiếu 4 ô của Bộ. Không còn 4 phương án trắc nghiệm.
function DapSoTLN({ dapSo, onLuu }: { dapSo: string; onLuu: (v: string) => void }) {
  const [v, setV] = useState(dapSo)
  useEffect(() => { setV(dapSo) }, [dapSo])
  const t = v.trim()
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px]">
      <span className="text-slate-500">Đáp số:</span>
      <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (t !== dapSo) onLuu(t) }} className={`${inp} w-32 font-mono`} />
      {t && !hopLePhieu4O(t) && <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] text-amber-800">không tô được trên phiếu 4 ô (chỉ số 0–9, dấu − ở ô đầu, dấu , ở ô 2–3, tối đa 4 ký tự)</span>}
      {!t && <span className="text-[12px] text-rose-600">chưa có đáp số</span>}
    </div>
  )
}

// Sửa câu trắc nghiệm / trả lời ngắn / tự luận: dùng chung ô sửa câu của kho (xem trước công thức, dán ảnh).
function SoanCau({ c, nd, onLuu, onHuy }: { c: DeThiCau; nd?: NoiDungCau; onLuu: (patch: SuaCauPatch, localNd: Partial<NoiDungCau>) => Promise<void>; onHuy: () => void }) {
  const [it, setIt] = useState<ReviewItem>({
    noi_dung: nd?.noi_dung ?? '', dap_an: c.dap_an ?? '', loi_giai: nd?.loi_giai ?? '', luaChon: c.lua_chon ?? null,
    anhDe: nd?.anh_de ?? null, anhDapAn: nd?.anh_dap_an ?? null, nguonGiai: 'nguoi', approved: true, isGoc: false,
  })
  const [busy, setBusy] = useState(false)
  async function luu() {
    if (!it.noi_dung.trim()) return
    setBusy(true)
    const patch: SuaCauPatch = {
      noi_dung: it.noi_dung.trim(), dap_an: it.dap_an.trim() || null, loi_giai: it.loi_giai.trim() || null,
      lua_chon: it.luaChon && it.luaChon.length ? it.luaChon : null, anh_de: it.anhDe, anh_dap_an: it.anhDapAn,
    }
    try { await onLuu(patch, { noi_dung: patch.noi_dung!, loi_giai: patch.loi_giai ?? null, anh_de: patch.anh_de ?? null, anh_dap_an: patch.anh_dap_an ?? null }) } finally { setBusy(false) }
  }
  return (
    <div>
      <CauEditor item={it} onChange={(p) => setIt((s) => ({ ...s, ...p }))} />
      <div className="mt-2 flex items-center gap-2">
        <button disabled={busy || !it.noi_dung.trim()} onClick={luu} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu câu'}</button>
        <button disabled={busy} onClick={onHuy} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
      </div>
    </div>
  )
}

// Sửa câu Đúng/Sai: đề chung + từng mệnh đề (nội dung + lời giải). Đ/S và dạng từng ý sửa ở chế độ xem.
function SoanDungSai({ c, nd, onLuu, onHuy }: { c: DeThiCau; nd?: NoiDungCau; onLuu: (patch: SuaCauPatch, localNd: Partial<NoiDungCau>) => Promise<void>; onHuy: () => void }) {
  const [noiDung, setNoiDung] = useState(nd?.noi_dung ?? '')
  const [md, setMd] = useState<MenhDe[]>(() => (c.menh_de ?? []).map((m) => ({ ...m })))
  const [busy, setBusy] = useState(false)
  const o = `${inp} resize-y font-mono text-[12.5px] leading-relaxed`
  const dat = (i: number, p: Partial<MenhDe>) => setMd((s) => s.map((m, j) => (j === i ? { ...m, ...p } : m)))
  async function luu() {
    if (!noiDung.trim() || md.some((m) => !m.noi_dung.trim())) return
    setBusy(true)
    const sach = md.map((m) => ({ ...m, noi_dung: m.noi_dung.trim(), loi_giai: m.loi_giai?.trim() || null }))
    try { await onLuu({ noi_dung: noiDung.trim(), menh_de: sach }, { noi_dung: noiDung.trim() }) } finally { setBusy(false) }
  }
  return (
    <div className="space-y-2.5">
      <div>
        <label className="mb-1 block text-[12px] font-semibold text-slate-600">Đề chung</label>
        <MathTextarea value={noiDung} onChange={setNoiDung} className={`${o} min-h-[70px]`} />
        <div className="mt-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[13px] text-slate-700"><MathText>{noiDung}</MathText></div>
      </div>
      {md.map((m, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-2.5">
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">Ý {'abcd'[i]})</label>
          <MathTextarea value={m.noi_dung} onChange={(v) => dat(i, { noi_dung: v })} className={`${o} min-h-[44px]`} />
          <div className="mt-1 rounded bg-slate-50 px-2 py-1 text-[13px] text-slate-700"><MathText>{m.noi_dung}</MathText></div>
          <label className="mb-1 mt-2 block text-[12px] text-slate-500">Lời giải ý {'abcd'[i]}</label>
          <MathTextarea value={m.loi_giai ?? ''} onChange={(v) => dat(i, { loi_giai: v })} className={`${o} min-h-[44px]`} />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <button disabled={busy || !noiDung.trim() || md.some((m) => !m.noi_dung.trim())} onClick={luu} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu câu'}</button>
        <button disabled={busy} onClick={onHuy} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
      </div>
    </div>
  )
}
