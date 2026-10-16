// Tab "Khớp bản đồ mới" (B4, Thùy 16/10) — duyệt câu xếp vào dạng bài của bản đồ mới.
//   Kho tạm: câu chưa đủ thông tin ở lại (không có dòng gán); khi đủ thì CHUYỂN ĐI bằng "gán".
//   Mức "cao" của AI coi như đã gán (chấp nhận ~1,3% sai) → chỉ KIỂM MẪU ~10% để đo độ chính xác, sai thì sửa.
//   Mỗi người 1 PHẠM VI (khối + chủ đề), không trùng — phân quyền & đếm đều ở DB (fn_bdm_khop_*).
// Sau mỗi quyết định: vá đúng câu tại chỗ (không tải lại cả danh sách), đếm cập nhật nền (CLAUDE.md §6).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { MathText } from '../kho/ui'
import {
  KHOP_HANG_LABEL, KHOP_HANG_MOTA, khopDem, khopDich, khopGiao, khopGo, khopHang, khopPhamVi, khopQuyet, khopUngVien,
  type KhopCau, type KhopDem, type KhopDich, type KhopHang, type KhopPhamVi,
} from '../../lib/kho/bdmKhop'

const HANG: KhopHang[] = ['de_xuat', 'trong', 'thieu', 'mau']
const TRANG = 20
// Nhớ hàng đang mở khi chuyển tab/khối rồi quay lại (module-level, sống tới F5).
const NHO: { hang: KhopHang } = { hang: 'de_xuat' }

export default function KhopBanDoMoiTab({ khoi, onChanged }: { khoi: string; onChanged?: () => void }) {
  const [hang, setHangRaw] = useState<KhopHang>(NHO.hang)
  const [dem, setDem] = useState<KhopDem | null>(null)
  const [rows, setRows] = useState<KhopCau[]>([])
  const [tong, setTong] = useState(0)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [dich, setDich] = useState<KhopDich[]>([])
  const [laAdmin, setLaAdmin] = useState(false)
  const [phamVi, setPhamVi] = useState<KhopPhamVi[]>([])
  const [hienPhamVi, setHienPhamVi] = useState(false)
  const req = useRef(0)

  const setHang = (h: KhopHang) => { NHO.hang = h; setHangRaw(h) }

  const napDem = useCallback(async () => {
    try { setDem(await khopDem(khoi)) } catch (e: any) { setErr(e.message ?? String(e)) }
  }, [khoi])

  // Đổi NGỮ CẢNH (khối/hàng) ⇒ reset + nạp lại. Mutation trong cùng ngữ cảnh ⇒ vá tại chỗ (xem quyet()).
  useEffect(() => {
    const my = ++req.current
    setRows([]); setTong(0); setLoading(true); setErr(null)
    khopHang(khoi, hang, TRANG, 0)
      .then((r) => { if (my === req.current) { setRows(r.rows); setTong(r.tong) } })
      .catch((e) => { if (my === req.current) setErr(e.message ?? String(e)) })
      .finally(() => { if (my === req.current) setLoading(false) })
  }, [khoi, hang])
  useEffect(() => { void napDem() }, [napDem])
  useEffect(() => { khopDich(khoi).then(setDich).catch(() => setDich([])) }, [khoi])
  const napPhamVi = useCallback(async () => {
    try { const r = await khopPhamVi(); setLaAdmin(r.la_admin); setPhamVi(r.rows) } catch { /* không có quyền xem ⇒ bỏ qua */ }
  }, [])
  useEffect(() => { void napPhamVi() }, [napPhamVi])

  // Bù thêm câu NỀN khi danh sách vơi (không xoá list đang hiện).
  const buThem = useCallback(async () => {
    const my = req.current
    try {
      const r = await khopHang(khoi, hang, TRANG, 0)
      if (my !== req.current) return
      setRows((prev) => { const co = new Set(prev.map((x) => x.ma_cau)); return [...prev, ...r.rows.filter((x) => !co.has(x.ma_cau))] })
      setTong(r.tong)
    } catch { /* nền — bỏ qua */ }
  }, [khoi, hang])

  async function quyet(c: KhopCau, hd: Parameters<typeof khopQuyet>[1], dangBai?: string | null, lyDo?: string | null) {
    await khopQuyet(c.ma_cau, hd, dangBai, lyDo)
    // vá tại chỗ: câu xong thì rời hàng đợi (riêng 'thieu' ở hàng 'trong' cũng rời vì chuyển sang hàng "Thiếu dạng")
    setRows((prev) => { const n = prev.filter((x) => x.ma_cau !== c.ma_cau); if (n.length < 6 && tong - 1 > n.length) void buThem(); return n })
    setTong((t) => Math.max(0, t - 1))
    void napDem(); onChanged?.()
  }

  const ten = (d: KhopDem | null, h: KhopHang) => (d ? d[h] : 0)
  const chinhXac = dem && dem.kiem_n > 0 ? Math.round((dem.kiem_giu / dem.kiem_n) * 1000) / 10 : null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {HANG.map((h) => (
            <button key={h} onClick={() => setHang(h)} title={KHOP_HANG_MOTA[h]}
              className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${hang === h ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {KHOP_HANG_LABEL[h]}<span className="ml-1.5 rounded-full bg-slate-200/70 px-1.5 text-[11px]">{ten(dem, h)}</span>
            </button>
          ))}
        </div>
        {chinhXac !== null && (
          <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${chinhXac >= 98 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}
            title="Trong các câu AI gán mức chắc đã kiểm mẫu: tỉ lệ giữ nguyên. Dưới ngưỡng thì cả khối cần xem lại.">
            Độ chính xác đo được: {chinhXac}% ({dem!.kiem_giu}/{dem!.kiem_n})
          </span>
        )}
        <button onClick={() => setHienPhamVi((v) => !v)} className="ml-auto rounded-md border border-slate-300 px-3 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50">
          {laAdmin ? 'Phạm vi người duyệt' : 'Phạm vi của tôi'}
        </button>
      </div>
      {hienPhamVi && <PhamViPanel khoi={khoi} dich={dich} laAdmin={laAdmin} rows={phamVi} onDoi={napPhamVi} />}
      <p className="border-b border-slate-100 bg-slate-50 px-6 py-1.5 text-[12px] text-slate-500">{KHOP_HANG_MOTA[hang]}</p>

      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? (
            <p className="text-sm text-slate-400">
              {dem && HANG.every((h) => dem[h] === 0)
                ? 'Không có câu nào trong phạm vi của bạn ở khối này (hoặc bạn chưa được giao phạm vi).'
                : `Hết câu ở hàng "${KHOP_HANG_LABEL[hang]}" trong phạm vi của bạn.`}
            </p>
          ) : (
            <ul className="space-y-3">
              {rows.map((c) => <CauCard key={c.ma_cau} c={c} hang={hang} dich={dich} onQuyet={quyet} />)}
              {tong > rows.length && <li className="py-2 text-center text-[12px] text-slate-400">… còn {tong - rows.length} câu, xong câu trên sẽ tự nạp thêm</li>}
            </ul>
          )}
      </div>
    </div>
  )
}

function CauCard({ c, hang, dich, onQuyet }: {
  c: KhopCau; hang: KhopHang; dich: KhopDich[]
  onQuyet: (c: KhopCau, hd: 'gan' | 'thieu' | 'bo_de_xuat' | 'mau_giu' | 'mau_doi', dangBai?: string | null, lyDo?: string | null) => Promise<void>
}) {
  const [chon, setChon] = useState<string | null>(null)
  const [moThieu, setMoThieu] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [ban, setBan] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const opts: Opt[] = useMemo(() => dich.map((d) => ({ id: d.id, label: d.dang_bai, sub: `${d.chu_de} › ${d.chuyen_de} › ${d.nhom}` })), [dich])
  const choGiu = hang === 'de_xuat' || hang === 'mau'

  const chay = async (f: () => Promise<void>) => { setBan(true); setLoi(null); try { await f() } catch (e: any) { setLoi(e.message ?? String(e)); setBan(false) } }
  const lc = Array.isArray(c.lua_chon) ? (c.lua_chon as string[]) : null
  const md = Array.isArray(c.menh_de) ? (c.menh_de as { noi_dung: string; dap_an: string }[]) : null

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
        <span className="font-mono text-slate-400">{c.ma_cau}</span>
        {c.dang_cu && <span className="rounded bg-slate-100 px-2 py-0.5" title="Nhãn ở bản đồ cũ">Cũ: {c.dang_cu}{c.chuyen_de_cu ? ` · ${c.chuyen_de_cu}` : ''}</span>}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="min-w-0 text-[14px] text-slate-800">
          <MathText>{c.noi_dung}</MathText>
          {c.anh_de && <img src={c.anh_de} alt="" loading="lazy" className="mt-2 max-h-48 rounded border border-slate-200" />}
          {lc && lc.length > 0 && <ol className="mt-2 space-y-0.5 text-[13px] text-slate-600">{lc.map((o, i) => <li key={i}>{String.fromCharCode(65 + i)}. <MathText>{o}</MathText></li>)}</ol>}
          {md && <ul className="mt-2 space-y-0.5 text-[13px] text-slate-600">{md.map((m, i) => <li key={i}>{String.fromCharCode(97 + i)}) <MathText>{m.noi_dung}</MathText> <span className="text-slate-400">[{m.dap_an}]</span></li>)}</ul>}
          {c.dap_an && <p className="mt-1.5 text-[12px] text-slate-400">Đáp án: {c.dap_an}</p>}
        </div>

        <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-[13px]">
          {c.dang_bai_id && (
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{hang === 'mau' ? 'AI đã gán' : 'AI đề xuất'}</div>
              <div className="font-semibold text-slate-800">{c.dang_bai}</div>
              <div className="text-[12px] text-slate-500">{c.chu_de} › {c.chuyen_de} › {c.nhom}</div>
            </div>
          )}
          {c.ly_do && <p className="text-[12px] italic text-slate-500">“{c.ly_do}”</p>}

          {choGiu && c.dang_bai_id && (
            <button disabled={ban} onClick={() => chay(() => onQuyet(c, hang === 'mau' ? 'mau_giu' : 'gan', hang === 'mau' ? null : c.dang_bai_id))}
              className="w-full rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-emerald-500 disabled:opacity-40">✓ Đúng dạng này</button>
          )}
          <div>
            <div className="mb-1 text-[11px] text-slate-400">{choGiu && c.dang_bai_id ? 'Hoặc chọn dạng khác' : 'Chọn dạng bài'}</div>
            <SearchSelect value={chon} onChange={setChon} options={opts} placeholder="Gõ tên dạng bài…" allowClear />
            <button disabled={ban || !chon || chon === c.dang_bai_id}
              onClick={() => chay(() => onQuyet(c, hang === 'mau' ? 'mau_doi' : 'gan', chon))}
              className="mt-1.5 w-full rounded-md bg-slate-800 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-slate-700 disabled:opacity-30">
              {hang === 'mau' ? 'Sai → đổi sang dạng này' : 'Chuyển câu vào dạng này'}
            </button>
          </div>
          {hang === 'de_xuat' && (
            <button disabled={ban} onClick={() => chay(() => onQuyet(c, 'bo_de_xuat'))} className="w-full text-left text-[12px] text-slate-500 underline-offset-2 hover:underline">✗ Đề xuất sai — bỏ, câu về “Chưa có dạng”</button>
          )}
          {(hang === 'trong' || hang === 'de_xuat') && (
            moThieu ? (
              <div className="space-y-1">
                <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Bản đồ thiếu dạng gì? (vd: chứng minh chia hết)" className="w-full rounded-md border border-slate-300 px-2 py-1 text-[12.5px]" />
                <button disabled={ban || !lyDo.trim()} onClick={() => chay(() => onQuyet(c, 'thieu', null, lyDo))} className="rounded-md bg-amber-500 px-3 py-1 text-[12.5px] font-medium text-white disabled:opacity-30">Báo thiếu dạng</button>
              </div>
            ) : <button onClick={() => setMoThieu(true)} className="text-left text-[12px] text-amber-700 underline-offset-2 hover:underline">Bản đồ chưa có dạng phù hợp…</button>
          )}
          {loi && <p className="text-[12px] text-rose-600">{loi}</p>}
        </div>
      </div>
    </li>
  )
}

// Phạm vi người duyệt: mỗi (khối, chủ đề) đúng 1 người; "phần còn lại của khối" cũng đúng 1 người. Admin giao/gỡ; người khác chỉ xem phần của mình.
function PhamViPanel({ khoi, dich, laAdmin, rows, onDoi }: { khoi: string; dich: KhopDich[]; laAdmin: boolean; rows: KhopPhamVi[]; onDoi: () => Promise<void> }) {
  const [ung, setUng] = useState<Opt[]>([])
  const [nguoi, setNguoi] = useState<string | null>(null)
  const [cd, setCd] = useState<string | null>('__con_lai')
  const [loi, setLoi] = useState<string | null>(null)
  const [ban, setBan] = useState(false)
  useEffect(() => { if (laAdmin) khopUngVien().then((l) => setUng(l.map((u) => ({ id: u.tai_khoan_id, label: u.ho_ten })))).catch(() => setUng([])) }, [laAdmin])
  const chuDe: Opt[] = useMemo(() => {
    const m = new Map<string, string>()
    for (const d of dich) m.set(d.chu_de_id, d.chu_de)
    return [{ id: '__con_lai', label: 'Phần còn lại của khối', sub: 'mọi chủ đề chưa giao riêng + câu chưa có chỗ' }, ...[...m].map(([id, label]) => ({ id, label }))]
  }, [dich])
  const cua = rows.filter((r) => r.khoi === khoi)
  const giao = async () => {
    if (!nguoi || !cd) return
    setBan(true); setLoi(null)
    try { await khopGiao(nguoi, khoi, cd === '__con_lai' ? null : cd); setNguoi(null); await onDoi() }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBan(false) }
  }
  const go = async (id: number) => { setBan(true); setLoi(null); try { await khopGo(id); await onDoi() } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBan(false) } }
  return (
    <div className="space-y-2 border-b border-slate-200 bg-slate-50 px-6 py-3 text-[13px]">
      <div className="text-[12px] text-slate-500">Khối {khoi}: mỗi người một phạm vi, không trùng nhau.</div>
      {cua.length === 0 ? <p className="text-slate-400">Chưa giao phạm vi nào ở khối này.</p> : (
        <ul className="space-y-1">
          {cua.map((r) => (
            <li key={r.id} className="flex items-center gap-2">
              <b className="text-slate-800">{r.nguoi}</b><span className="text-slate-400">·</span>
              <span>{r.chu_de ?? 'Phần còn lại của khối'}</span>
              {laAdmin && <button disabled={ban} onClick={() => go(r.id)} className="ml-auto text-[12px] text-rose-600 hover:underline">Gỡ</button>}
            </li>
          ))}
        </ul>
      )}
      {laAdmin && (
        <div className="flex flex-wrap items-end gap-2 pt-1">
          <div className="w-60"><SearchSelect value={nguoi} onChange={setNguoi} options={ung} placeholder="Chọn người duyệt…" avatars /></div>
          <div className="w-72"><SearchSelect value={cd} onChange={setCd} options={chuDe} placeholder="Chọn chủ đề…" allowClear={false} /></div>
          <button disabled={ban || !nguoi || !cd} onClick={giao} className="rounded-md bg-slate-800 px-3.5 py-1.5 text-[12.5px] font-medium text-white disabled:opacity-30">Giao</button>
        </div>
      )}
      {loi && <p className="text-[12px] text-rose-600">{loi}</p>}
    </div>
  )
}
