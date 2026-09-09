// ============================================================================
// GayScreen — "Gậy của BK" (leaf `gay`). 5 tab:
//   BẢNG GẬY (công khai toàn công ty) · ĐỀ XUẤT (gậy tự động chờ leader chốt)
//   · ĐÁNH/GỠ (thủ công) · DANH MỤC (lỗi + hoạt động gỡ) · CHỐT THÁNG.
// Quyền: AI CŨNG XEM được bảng gậy (minh bạch — Thùy chốt 08-29); hành động
// (chốt đề xuất/đánh/gỡ/thu hồi/chốt tháng) chỉ leader theo cây tổ chức
// (getMyScope.laQuanLy, đúng phạm vi người dưới quyền) hoặc admin hệ thống.
// Style: tông Apple sáng như các màn khác (card trắng + bóng mềm, pill mềm —
// Thùy 08-29: KHÔNG dùng style scifi HUD).
// ============================================================================
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { getMyScope, listNhanSu, type MyScope, type NhanSu } from '../../lib/nhansu'
import { myNhanSuId } from '../../lib/giaoviec'
import {
  GAY_DON_GIA, MA_LOI_CHAM_DEADLINE, kyHienTai, nhanKy,
  listGayLoi, createGayLoi, updateGayLoi, listGayHoatDong, createGayHoatDong, updateGayHoatDong,
  quetGayTuDong, listDeXuat, chotDeXuat, boQuaDeXuat,
  danhGayThuCong, goGay, thuHoiGay, bangGay, chotThang, listChotThang, listMienGay, setMienGay,
  type GayLoi, type GayHoatDong, type GayDeXuatFull, type BangGayRow, type GayChotThangFull, type NsMienGay,
} from '../../lib/gay'

type Tab = 'bang' | 'dexuat' | 'danhgo' | 'danhmuc' | 'chot'
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`
const nhanTre = (phut: number | null) => {
  if (phut == null) return ''
  if (phut < 60) return `${phut} phút`
  if (phut < 1440) return `${Math.floor(phut / 60)}h${phut % 60 ? ` ${phut % 60}p` : ''}`
  const d = Math.floor(phut / 1440), h = Math.floor((phut % 1440) / 60)
  return `${d} ngày${h ? ` ${h}h` : ''}`
}
const ddmmhh = (iso: string | null) => {
  if (!iso) return '—'
  const t = new Date(new Date(iso).getTime() + 7 * 3600000)
  return `${String(t.getUTCDate()).padStart(2, '0')}/${String(t.getUTCMonth() + 1).padStart(2, '0')} ${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`
}
// kỳ tháng ± n (ky = 'YYYY-MM-01')
const kyCong = (ky: string, n: number) => {
  const y = Number(ky.slice(0, 4)), m = Number(ky.slice(5, 7)) - 1 + n
  const yy = y + Math.floor(m / 12), mm = ((m % 12) + 12) % 12
  return `${yy}-${String(mm + 1).padStart(2, '0')}-01`
}

// Bộ style dùng chung (tông Apple — pill mềm, card trắng, indigo primary)
const inputCls = 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400'
const btnPrimary = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnDanger = 'rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40'
const btnGhost = 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
const pill = (tone: 'red' | 'emerald' | 'amber' | 'zero') => ({
  red: 'inline-flex min-w-[30px] items-center justify-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700',
  emerald: 'inline-flex min-w-[30px] items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700',
  amber: 'inline-flex min-w-[30px] items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700',
  zero: 'inline-flex min-w-[30px] items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-400',
}[tone])

export default function GayScreen() {
  const quyen = useStore((s) => s.quyen)
  const [tab, setTab] = useState<Tab>('bang')
  const [ky, setKy] = useState(kyHienTai())
  const [scope, setScope] = useState<MyScope | null>(null)
  const [meId, setMeId] = useState<string>('')
  const [lois, setLois] = useState<GayLoi[]>([])
  const [hds, setHds] = useState<GayHoatDong[]>([])
  const [thongBao, setThongBao] = useState<{ ok: boolean; msg: string } | null>(null)

  const laAdmin = !!quyen?.laAdmin
  const canAct = laAdmin || !!scope?.laQuanLy
  // phạm vi người tôi được đánh/chốt: admin = mọi người; leader = người dưới trong cây
  const scopeIds = useMemo(() => new Set([...(scope?.giamSatTrucTiep ?? []), ...(scope?.giamSatSau ?? [])].map((r) => r.nhan_su_id)), [scope])
  const trongPhamVi = (nsId: string) => laAdmin || scopeIds.has(nsId)

  useEffect(() => {
    getMyScope().then(setScope).catch(() => setScope(null))
    myNhanSuId().then(setMeId).catch(() => setMeId(''))
    listGayLoi().then(setLois).catch(() => setLois([]))
    listGayHoatDong().then(setHds).catch(() => setHds([]))
  }, [])
  useEffect(() => {
    if (!thongBao) return
    const t = setTimeout(() => setThongBao(null), 4000)
    return () => clearTimeout(t)
  }, [thongBao])
  const bao = (ok: boolean, msg: string) => setThongBao({ ok, msg })

  const TABS: { key: Tab; ten: string; can?: boolean }[] = [
    { key: 'bang', ten: 'Bảng gậy' },
    { key: 'dexuat', ten: 'Đề xuất' },
    { key: 'danhgo', ten: 'Đánh / Gỡ', can: canAct },
    { key: 'danhmuc', ten: 'Danh mục', can: canAct },
    { key: 'chot', ten: 'Chốt tháng', can: canAct },
  ]
  const tabBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Gậy của BK</span>
        {TABS.filter((t) => t.can !== false).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={tabBtn(tab === t.key)}>{t.ten}</button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <button className={btnGhost + ' !px-2 !py-1'} onClick={() => setKy(kyCong(ky, -1))}>‹</button>
          <span className="text-sm font-semibold text-slate-700">{nhanKy(ky)}</span>
          <button className={btnGhost + ' !px-2 !py-1'} disabled={ky >= kyHienTai()} onClick={() => setKy(kyCong(ky, 1))}>›</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <p className="mb-4 text-xs text-slate-400">1 gậy = {vnd(GAY_DON_GIA)} · gậy reset đầu mỗi tháng · gậy tự động do hệ thống đề xuất từ deadline ERP, leader chốt mới tính.</p>

        {thongBao && (
          <div className={`mb-4 rounded-lg border px-3.5 py-2 text-sm font-medium ${thongBao.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {thongBao.msg}
          </div>
        )}

        {tab === 'bang' && <BangGayTab ky={ky} canAct={canAct} trongPhamVi={trongPhamVi} onBao={bao} />}
        {tab === 'dexuat' && <DeXuatTab lois={lois} canAct={canAct} laAdmin={laAdmin} scopeIds={scopeIds} meId={meId} onBao={bao} />}
        {tab === 'danhgo' && canAct && <DanhGoTab lois={lois} hds={hds} laAdmin={laAdmin} scopeIds={scopeIds} onBao={bao} />}
        {tab === 'danhmuc' && canAct && <DanhMucTab lois={lois} hds={hds} reload={async () => { setLois(await listGayLoi()); setHds(await listGayHoatDong()) }} onBao={bao} />}
        {tab === 'chot' && canAct && <ChotThangTab ky={ky} onBao={bao} />}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — BẢNG GẬY (công khai): tổng theo người + drill chi tiết ledger
// ════════════════════════════════════════════════════════════════════════════
function BangGayTab({ ky, canAct, trongPhamVi, onBao }: {
  ky: string; canAct: boolean; trongPhamVi: (id: string) => boolean; onBao: (ok: boolean, msg: string) => void
}) {
  const [rows, setRows] = useState<BangGayRow[]>([])
  const [loading, setLoading] = useState(true)
  const [moNs, setMoNs] = useState<string | null>(null)
  const [thuHoiId, setThuHoiId] = useState<string | null>(null)
  const [thuHoiLyDo, setThuHoiLyDo] = useState('')

  const load = () => { setLoading(true); bangGay(ky).then(setRows).catch((e) => onBao(false, String(e.message ?? e))).finally(() => setLoading(false)) }
  useEffect(load, [ky])

  const lamThuHoi = async (id: string) => {
    try { await thuHoiGay(id, thuHoiLyDo); setThuHoiId(null); setThuHoiLyDo(''); onBao(true, 'Đã thu hồi.'); load() }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : !rows.length ? (
        <p className="text-sm text-slate-400">Tháng này chưa ai bị gậy — sạch bóng. 🎉</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="w-9 pb-2.5">#</th><th className="pb-2.5">Nhân sự</th>
              <th className="pb-2.5 text-center">Bị đánh</th><th className="pb-2.5 text-center">Đã gỡ</th>
              <th className="pb-2.5 text-center">Còn lại</th><th className="pb-2.5 text-right">Tiền phạt</th><th className="w-24 pb-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <FragmentRow key={r.nhan_su_id} r={r} i={i} mo={moNs === r.nhan_su_id} onMo={() => setMoNs(moNs === r.nhan_su_id ? null : r.nhan_su_id)}
                canAct={canAct} trongPhamVi={trongPhamVi} thuHoiId={thuHoiId} setThuHoiId={setThuHoiId}
                thuHoiLyDo={thuHoiLyDo} setThuHoiLyDo={setThuHoiLyDo} lamThuHoi={lamThuHoi} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function FragmentRow({ r, i, mo, onMo, canAct, trongPhamVi, thuHoiId, setThuHoiId, thuHoiLyDo, setThuHoiLyDo, lamThuHoi }: {
  r: BangGayRow; i: number; mo: boolean; onMo: () => void; canAct: boolean; trongPhamVi: (id: string) => boolean
  thuHoiId: string | null; setThuHoiId: (v: string | null) => void; thuHoiLyDo: string; setThuHoiLyDo: (v: string) => void
  lamThuHoi: (id: string) => void
}) {
  return (
    <>
      <tr className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50/60" onClick={onMo}>
        <td className="py-2.5 text-slate-300">{i + 1}</td>
        <td className="py-2.5 font-medium text-slate-800">{r.ns_ten}</td>
        <td className="py-2.5 text-center"><span className={pill(r.soGayDanh ? 'red' : 'zero')}>{r.soGayDanh}</span></td>
        <td className="py-2.5 text-center"><span className={pill(r.soGayGo ? 'emerald' : 'zero')}>{r.soGayGo}</span></td>
        <td className="py-2.5 text-center"><span className={pill(r.conLai ? 'red' : 'emerald')}>{r.conLai}</span></td>
        <td className="py-2.5 text-right"><span className={pill(r.tienPhat ? 'amber' : 'zero')}>{vnd(r.tienPhat)}</span></td>
        <td className="py-2.5 text-right text-xs font-medium text-indigo-500">{mo ? 'Đóng ▲' : 'Chi tiết ▼'}</td>
      </tr>
      {mo && (
        <tr><td colSpan={7} className="bg-slate-50/70 p-0">
          <div className="px-3 py-2.5">
            {r.entries.map((e) => (
              <div key={e.id} className={`mt-1.5 flex flex-wrap items-center gap-2.5 rounded-lg border-l-2 bg-white px-3 py-2 text-xs shadow-sm ${e.thu_hoi_at ? 'border-l-slate-300 opacity-50' : e.so_gay < 0 ? 'border-l-emerald-400' : e.loai === 'tu_dong' ? 'border-l-amber-400' : 'border-l-red-400'}`}>
                <span className={`min-w-[30px] font-bold ${e.so_gay < 0 ? 'text-emerald-600' : 'text-red-600'} ${e.thu_hoi_at ? 'line-through' : ''}`}>{e.so_gay > 0 ? `+${e.so_gay}` : e.so_gay}</span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{e.loai === 'tu_dong' ? 'Tự động' : e.loai === 'go' ? 'Gỡ' : 'Thủ công'}</span>
                <span className={`text-slate-600 ${e.thu_hoi_at ? 'line-through' : ''}`}>{e.so_gay < 0 ? e.hoat_dong_ten : e.loi_ten}{e.ly_do ? ` — ${e.ly_do}` : ''}</span>
                <span className="ml-auto text-[11px] text-slate-400">{ddmmhh(e.created_at)} · {e.nguoi_tao_ten}</span>
                {e.thu_hoi_at ? <span className="text-[10px] font-medium text-amber-600">Đã thu hồi: {e.thu_hoi_ly_do}</span>
                  : canAct && trongPhamVi(r.nhan_su_id) && (
                    thuHoiId === e.id ? (
                      <span className="inline-flex items-center gap-1.5" onClick={(ev) => ev.stopPropagation()}>
                        <input className={inputCls + ' !py-1 !text-xs'} style={{ width: 160 }} placeholder="lý do thu hồi…" value={thuHoiLyDo} onChange={(ev) => setThuHoiLyDo(ev.target.value)} />
                        <button className={btnDanger + ' !px-2 !py-1 !text-xs'} disabled={!thuHoiLyDo.trim()} onClick={() => lamThuHoi(e.id)}>Xác nhận</button>
                        <button className={btnGhost + ' !px-2 !py-1 !text-xs'} onClick={() => setThuHoiId(null)}>Huỷ</button>
                      </span>
                    ) : (
                      <button className={btnGhost + ' !px-2 !py-1 !text-xs'} onClick={(ev) => { ev.stopPropagation(); setThuHoiId(e.id); setThuHoiLyDo('') }}>Thu hồi</button>
                    )
                  )}
              </div>
            ))}
          </div>
        </td></tr>
      )}
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — ĐỀ XUẤT gậy tự động: mở tab là QUÉT (lazy, idempotent) rồi liệt kê 'cho'.
// CÔNG KHAI CHI TIẾT cho MỌI NGƯỜI xem & phản biện (Thùy 29/08) — gom theo người,
// xoè ra thấy từng việc trễ. Nút hành động chỉ hiện với leader đúng phạm vi.
// ════════════════════════════════════════════════════════════════════════════
function DeXuatTab({ lois, canAct, laAdmin, scopeIds, meId, onBao }: {
  lois: GayLoi[]; canAct: boolean; laAdmin: boolean; scopeIds: Set<string>; meId: string; onBao: (ok: boolean, msg: string) => void
}) {
  const [dxs, setDxs] = useState<GayDeXuatFull[]>([])
  const [loading, setLoading] = useState(true)
  const [moNs, setMoNs] = useState<string | null>(null)
  const [locNs, setLocNs] = useState('')
  const [soGayById, setSoGayById] = useState<Record<string, number>>({})
  const [loiById, setLoiById] = useState<Record<string, string>>({})
  const [boQuaId, setBoQuaId] = useState<string | null>(null)
  const [boQuaLyDo, setBoQuaLyDo] = useState('')
  const loiChamDeadline = lois.find((l) => l.ma === MA_LOI_CHAM_DEADLINE)?.id ?? lois[0]?.id ?? ''

  const load = async () => {
    setLoading(true)
    try {
      await quetGayTuDong() // quét lazy — idempotent nhờ ref_key unique
      setDxs(await listDeXuat('cho'))
    } catch (e: any) { onBao(false, String(e.message ?? e)) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  // SLA duyệt gậy (CEO 06/09): quản lý phải quyết trong 48h — quá hạn mà vẫn 'cho' thì dashboard
  // "Của tôi" đã TỰ TÍNH ĐẠT CHUẨN cho task đó rồi (fn_gay_dang_hieu_luc chỉ true khi đã CHỐT) —
  // đây chỉ là NHẮC leader, không đổi được gì bằng cách lờ đi.
  const qua48h = (createdAt: string) => Date.now() - new Date(createdAt).getTime() > 48 * 3600000

  // Gom theo người (nhiều nhất lên đầu) — mặc định mở sẵn người đang lọc / chính mình
  const nhom = useMemo(() => {
    const by = new Map<string, GayDeXuatFull[]>()
    for (const d of dxs) { if (!by.has(d.nhan_su_id)) by.set(d.nhan_su_id, []); by.get(d.nhan_su_id)!.push(d) }
    return [...by.entries()]
      .map(([nsId, items]) => ({ nsId, ten: items[0].ns_ten ?? '?', items: items.sort((a, b) => (b.tre_phut ?? 0) - (a.tre_phut ?? 0)) }))
      .sort((a, b) => b.items.length - a.items.length)
  }, [dxs])
  const nhomHien = locNs ? nhom.filter((n) => n.nsId === locNs) : nhom

  const lamChot = async (d: GayDeXuatFull) => {
    try {
      await chotDeXuat(d, { soGay: soGayById[d.id] ?? d.so_gay, loiId: loiById[d.id] ?? loiChamDeadline })
      onBao(true, `Đã đánh ${soGayById[d.id] ?? d.so_gay} gậy cho ${d.ns_ten}.`)
      setDxs((p) => p.filter((x) => x.id !== d.id))
    } catch (e: any) { onBao(false, String(e.message ?? e)); load() }
  }
  const lamBoQua = async (d: GayDeXuatFull) => {
    try {
      await boQuaDeXuat(d.id, boQuaLyDo)
      onBao(true, 'Đã bỏ qua đề xuất.')
      setBoQuaId(null); setBoQuaLyDo('')
      setDxs((p) => p.filter((x) => x.id !== d.id))
    } catch (e: any) { onBao(false, String(e.message ?? e)); load() }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">⚠ Máy đề xuất — người chốt. Chưa chốt = chưa thành gậy.</span>
        <span className="text-xs text-slate-400">Danh sách công khai để mọi người kiểm tra & phản biện — thấy sai thì báo leader bỏ qua kèm lý do.</span>
        <div className="ml-auto flex items-center gap-1.5">
          <select className={inputCls + ' !py-1 text-xs'} value={locNs} onChange={(e) => { setLocNs(e.target.value); setMoNs(e.target.value || null) }}>
            <option value="">Tất cả ({dxs.length})</option>
            {nhom.map((n) => <option key={n.nsId} value={n.nsId}>{n.ten} ({n.items.length})</option>)}
          </select>
          <button className={btnGhost} onClick={load}>↻ Quét lại</button>
        </div>
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang quét deadline ERP…</p> : !nhomHien.length ? (
        <p className="text-sm text-slate-400">Không có đề xuất nào chờ xử lý.</p>
      ) : nhomHien.map((n) => {
        const mo = moNs === n.nsId
        const duocLam = canAct && (laAdmin || scopeIds.has(n.nsId))
        const soQua48h = n.items.filter((d) => qua48h(d.created_at)).length
        return (
          <div key={n.nsId} className="mt-2 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
            <button className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition hover:bg-slate-50/70" onClick={() => setMoNs(mo ? null : n.nsId)}>
              <span className="text-sm font-semibold text-slate-800">{n.ten}</span>
              {n.nsId === meId && <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">bạn</span>}
              <span className={pill('amber')}>{n.items.length} việc trễ</span>
              {soQua48h > 0 && <span className={pill('red')} title="Quá 48h chưa duyệt — hệ thống đã tự tính ĐẠT CHUẨN cho các việc này">⏰ {soQua48h} quá 48h</span>}
              <span className="ml-auto text-xs font-medium text-indigo-500">{mo ? 'Đóng ▲' : 'Chi tiết ▼'}</span>
            </button>
            {mo && (
              <div className="border-t border-slate-100 bg-slate-50/60 px-3 py-2">
                {n.items.map((d) => (
                  <div key={d.id} className="mt-1.5 flex flex-wrap items-center gap-3 rounded-lg border-l-2 border-l-amber-400 bg-white px-3 py-2 shadow-sm">
                    <div className="min-w-[220px] flex-1">
                      <p className="text-sm text-slate-700">{d.mo_ta}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {d.nguon === 'vanhanh' ? 'Vận hành' : 'Giao việc'} · hạn {ddmmhh(d.deadline_at)} · <span className="font-medium text-red-600">trễ {nhanTre(d.tre_phut)}</span>
                        {qua48h(d.created_at) && <span className="ml-1.5 font-semibold text-rose-600">· ⏰ quá 48h chưa duyệt (đang tính ĐẠT CHUẨN)</span>}
                      </p>
                    </div>
                    {duocLam ? (
                      boQuaId === d.id ? (
                        <div className="flex items-center gap-1.5">
                          <input className={inputCls + ' !py-1 !text-xs'} style={{ width: 190 }} placeholder="lý do bỏ qua (bắt buộc)…" value={boQuaLyDo} onChange={(e) => setBoQuaLyDo(e.target.value)} autoFocus />
                          <button className={btnPrimary + ' !px-2 !py-1 !text-xs'} disabled={!boQuaLyDo.trim()} onClick={() => lamBoQua(d)}>Xác nhận</button>
                          <button className={btnGhost + ' !px-2 !py-1 !text-xs'} onClick={() => { setBoQuaId(null); setBoQuaLyDo('') }}>Huỷ</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <select className={inputCls + ' !py-1 !text-xs'} value={loiById[d.id] ?? loiChamDeadline} onChange={(e) => setLoiById((p) => ({ ...p, [d.id]: e.target.value }))}>
                            {lois.map((l) => <option key={l.id} value={l.id}>{l.ten}</option>)}
                          </select>
                          <input className={inputCls + ' !py-1 !text-xs text-center'} type="number" min={1} style={{ width: 52 }}
                            value={soGayById[d.id] ?? d.so_gay} onChange={(e) => setSoGayById((p) => ({ ...p, [d.id]: Math.max(1, Number(e.target.value) || 1) }))} />
                          <button className={btnDanger + ' !px-2 !py-1 !text-xs'} onClick={() => lamChot(d)}>Đánh gậy</button>
                          <button className={btnGhost + ' !px-2 !py-1 !text-xs'} onClick={() => { setBoQuaId(d.id); setBoQuaLyDo('') }}>Bỏ qua</button>
                        </div>
                      )
                    ) : <span className="text-[11px] font-medium text-slate-400">Chờ leader</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 3 — ĐÁNH / GỠ thủ công (leader): 2 panel song song
// ════════════════════════════════════════════════════════════════════════════
function DanhGoTab({ lois, hds, laAdmin, scopeIds, onBao }: {
  lois: GayLoi[]; hds: GayHoatDong[]; laAdmin: boolean; scopeIds: Set<string>; onBao: (ok: boolean, msg: string) => void
}) {
  const [nsAll, setNsAll] = useState<NhanSu[]>([])
  useEffect(() => { listNhanSu().then((l) => setNsAll(l.filter((n) => n.trang_thai === 'dang_lam'))).catch(() => setNsAll([])) }, [])
  const chonDuoc = nsAll.filter((n) => laAdmin || scopeIds.has(n.id))

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
      <FormDanhGo mode="danh" ds={chonDuoc} muc={lois.map((l) => ({ id: l.id, ten: l.ten, macDinh: l.so_gay_mac_dinh }))} onBao={onBao} />
      <FormDanhGo mode="go" ds={chonDuoc} muc={hds.map((h) => ({ id: h.id, ten: h.ten, macDinh: h.so_gay_mac_dinh }))} onBao={onBao} />
    </div>
  )
}

function FormDanhGo({ mode, ds, muc, onBao }: {
  mode: 'danh' | 'go'; ds: NhanSu[]; muc: { id: string; ten: string; macDinh: number }[]; onBao: (ok: boolean, msg: string) => void
}) {
  const [nsId, setNsId] = useState(''); const [mucId, setMucId] = useState(''); const [soGay, setSoGay] = useState(1)
  const [lyDo, setLyDo] = useState(''); const [dangLuu, setDangLuu] = useState(false)
  const laDanh = mode === 'danh'
  useEffect(() => { if (!mucId && muc.length) setMucId(muc[0].id) }, [muc])
  useEffect(() => { const m = muc.find((x) => x.id === mucId); if (m) setSoGay(m.macDinh) }, [mucId])

  const luu = async () => {
    setDangLuu(true)
    try {
      if (laDanh) await danhGayThuCong({ nhanSuId: nsId, loiId: mucId, soGay, lyDo })
      else await goGay({ nhanSuId: nsId, hoatDongId: mucId, soGay, lyDo })
      onBao(true, laDanh ? `Đã đánh ${soGay} gậy.` : `Đã gỡ ${soGay} gậy.`)
      setNsId(''); setLyDo('')
    } catch (e: any) { onBao(false, String(e.message ?? e)) }
    setDangLuu(false)
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className={`mb-3 text-sm font-semibold ${laDanh ? 'text-red-600' : 'text-emerald-600'}`}>
        {laDanh ? 'Đánh gậy — lỗi ngoài ERP / sai quy trình' : 'Gỡ gậy — hoạt động chuộc lỗi'}
      </p>
      <div className="grid gap-2.5">
        <select className={inputCls} value={nsId} onChange={(e) => setNsId(e.target.value)}>
          <option value="">— chọn nhân sự —</option>
          {ds.map((n) => <option key={n.id} value={n.id}>{n.ho_ten}{n.ma_ns ? ` (${n.ma_ns})` : ''}</option>)}
        </select>
        <div className="flex gap-2.5">
          <select className={inputCls + ' flex-1'} value={mucId} onChange={(e) => setMucId(e.target.value)}>
            {muc.map((m) => <option key={m.id} value={m.id}>{m.ten}</option>)}
          </select>
          <input className={inputCls + ' text-center'} type="number" min={1} style={{ width: 70 }} value={soGay} onChange={(e) => setSoGay(Math.max(1, Number(e.target.value) || 1))} />
        </div>
        <input className={inputCls} placeholder="ghi chú / lý do…" value={lyDo} onChange={(e) => setLyDo(e.target.value)} />
        <button className={laDanh ? btnDanger : btnPrimary} disabled={!nsId || !mucId || dangLuu} onClick={luu}>
          {dangLuu ? 'Đang ghi…' : laDanh ? `Đánh ${soGay} gậy` : `Gỡ ${soGay} gậy`}
        </button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 4 — DANH MỤC lỗi + hoạt động gỡ (CEO yêu cầu tự thêm/sửa qua UI)
// ════════════════════════════════════════════════════════════════════════════
function DanhMucTab({ lois, hds, reload, onBao }: {
  lois: GayLoi[]; hds: GayHoatDong[]; reload: () => Promise<void>; onBao: (ok: boolean, msg: string) => void
}) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
      <PanelDanhMuc tieuDe="Danh mục lỗi" tone="text-red-600" items={lois}
        onAdd={async (p) => { await createGayLoi(p); await reload() }}
        onUpdate={async (id, patch) => { await updateGayLoi(id, patch); await reload() }} onBao={onBao} />
      <PanelDanhMuc tieuDe="Hoạt động gỡ gậy" tone="text-emerald-600" items={hds}
        onAdd={async (p) => { await createGayHoatDong(p); await reload() }}
        onUpdate={async (id, patch) => { await updateGayHoatDong(id, patch); await reload() }} onBao={onBao} />
      <PanelMienGay onBao={onBao} />
    </div>
  )
}

// Miễn gậy TỰ ĐỘNG (nhan_su.mien_gay) — người khối lượng đặc thù (CEO chốt 29/08:
// Thùy + Phạm Thị Thùy Trang). Chỉ miễn phần máy quét; gậy thủ công vẫn đánh được.
function PanelMienGay({ onBao }: { onBao: (ok: boolean, msg: string) => void }) {
  const [mien, setMien] = useState<NsMienGay[]>([])
  const [nsAll, setNsAll] = useState<NhanSu[]>([])
  const [themId, setThemId] = useState('')
  const load = () => { listMienGay().then(setMien).catch(() => setMien([])) }
  useEffect(() => { load(); listNhanSu().then((l) => setNsAll(l.filter((n) => n.trang_thai === 'dang_lam'))).catch(() => setNsAll([])) }, [])

  const doi = async (nsId: string, m: boolean) => {
    try { await setMienGay(nsId, m); onBao(true, m ? 'Đã miễn gậy tự động.' : 'Đã bỏ miễn — quét lại sẽ tính người này.'); setThemId(''); load() }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
  }
  const mienIds = new Set(mien.map((m) => m.id))

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-slate-700">Miễn gậy tự động</p>
      <p className="mb-3 text-xs text-slate-400">Máy quét deadline bỏ qua những người này (khối lượng việc đặc thù). Gậy thủ công vẫn đánh bình thường.</p>
      {!mien.length ? <p className="text-sm text-slate-400">Chưa miễn ai.</p> : mien.map((m) => (
        <div key={m.id} className="flex items-center gap-2 border-b border-slate-50 py-2 text-sm text-slate-700">
          <span className="flex-1">{m.ho_ten}{m.ma_ns ? <span className="ml-1.5 text-xs text-slate-400">({m.ma_ns})</span> : null}</span>
          <button className={btnGhost + ' !px-2 !py-1 !text-xs'} onClick={() => doi(m.id, false)}>Bỏ miễn</button>
        </div>
      ))}
      <div className="mt-3 flex gap-2">
        <select className={inputCls + ' flex-1'} value={themId} onChange={(e) => setThemId(e.target.value)}>
          <option value="">— chọn nhân sự để miễn —</option>
          {nsAll.filter((n) => !mienIds.has(n.id)).map((n) => <option key={n.id} value={n.id}>{n.ho_ten}{n.ma_ns ? ` (${n.ma_ns})` : ''}</option>)}
        </select>
        <button className={btnPrimary} disabled={!themId} onClick={() => doi(themId, true)}>+ Miễn</button>
      </div>
    </div>
  )
}

function PanelDanhMuc({ tieuDe, tone, items, onAdd, onUpdate, onBao }: {
  tieuDe: string; tone: string; items: { id: string; ten: string; so_gay_mac_dinh: number; active: boolean; ma?: string | null }[]
  onAdd: (p: { ten: string; so_gay_mac_dinh: number }) => Promise<void>
  onUpdate: (id: string, patch: { ten?: string; so_gay_mac_dinh?: number; active?: boolean }) => Promise<void>
  onBao: (ok: boolean, msg: string) => void
}) {
  const [ten, setTen] = useState(''); const [soGay, setSoGay] = useState(1)
  const them = async () => {
    try { await onAdd({ ten, so_gay_mac_dinh: soGay }); setTen(''); setSoGay(1); onBao(true, 'Đã thêm.') }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
  }
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className={`mb-3 text-sm font-semibold ${tone}`}>{tieuDe}</p>
      {items.map((it) => (
        <div key={it.id} className={`flex items-center gap-2 border-b border-slate-50 py-2 text-sm text-slate-700 ${it.active ? '' : 'opacity-40'}`}>
          <span className="flex-1">{it.ten}{'ma' in it && it.ma ? <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">hệ thống</span> : null}</span>
          <input className={inputCls + ' !py-1 text-center'} type="number" min={1} style={{ width: 56 }} value={it.so_gay_mac_dinh}
            onChange={async (e) => { const v = Math.max(1, Number(e.target.value) || 1); try { await onUpdate(it.id, { so_gay_mac_dinh: v }) } catch (er: any) { onBao(false, String(er.message ?? er)) } }} />
          <button className={btnGhost + ' !px-2 !py-1 !text-xs'}
            onClick={async () => { try { await onUpdate(it.id, { active: !it.active }) } catch (er: any) { onBao(false, String(er.message ?? er)) } }}>
            {it.active ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
      ))}
      <div className="mt-3 flex gap-2">
        <input className={inputCls + ' flex-1'} placeholder="tên mới…" value={ten} onChange={(e) => setTen(e.target.value)} />
        <input className={inputCls + ' text-center'} type="number" min={1} style={{ width: 56 }} value={soGay} onChange={(e) => setSoGay(Math.max(1, Number(e.target.value) || 1))} />
        <button className={btnPrimary} disabled={!ten.trim()} onClick={them}>+ Thêm</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 5 — CHỐT THÁNG: preview từ ledger → snapshot vào gay_chot_thang
// ════════════════════════════════════════════════════════════════════════════
function ChotThangTab({ ky, onBao }: { ky: string; onBao: (ok: boolean, msg: string) => void }) {
  const [preview, setPreview] = useState<BangGayRow[]>([])
  const [daChot, setDaChot] = useState<GayChotThangFull[]>([])
  const [loading, setLoading] = useState(true)
  const [dangChot, setDangChot] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([bangGay(ky), listChotThang(ky)])
      .then(([b, c]) => { setPreview(b); setDaChot(c) })
      .catch((e) => onBao(false, String(e.message ?? e)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [ky])

  const lamChot = async () => {
    setDangChot(true)
    try { const n = await chotThang(ky); onBao(true, `Đã chốt ${nhanKy(ky)} — ${n} nhân sự.`); load() }
    catch (e: any) { onBao(false, String(e.message ?? e)) }
    setDangChot(false)
  }
  const tongTien = preview.reduce((s, r) => s + r.tienPhat, 0)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          {daChot.length > 0 && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm text-emerald-700">
              ✓ {nhanKy(ky)} đã chốt lúc {ddmmhh(daChot[0].chot_at)} bởi {daChot[0].nguoi_chot_ten} — {daChot.length} nhân sự, tổng {vnd(daChot.reduce((s, r) => s + r.tien_phat, 0))}. Chốt lại sẽ ghi đè theo số liệu hiện tại.
            </div>
          )}
          {!preview.length ? <p className="text-sm text-slate-400">Không có gậy nào trong kỳ này.</p> : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="pb-2.5">Nhân sự</th><th className="pb-2.5 text-center">Bị đánh</th>
                    <th className="pb-2.5 text-center">Đã gỡ</th><th className="pb-2.5 text-center">Chốt</th><th className="pb-2.5 text-right">Phải đóng</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r) => (
                    <tr key={r.nhan_su_id} className="border-b border-slate-50">
                      <td className="py-2.5 font-medium text-slate-800">{r.ns_ten}</td>
                      <td className="py-2.5 text-center text-slate-600">{r.soGayDanh}</td>
                      <td className="py-2.5 text-center text-slate-600">{r.soGayGo}</td>
                      <td className={`py-2.5 text-center font-bold ${r.conLai ? 'text-red-600' : 'text-emerald-600'}`}>{r.conLai}</td>
                      <td className="py-2.5 text-right"><span className={pill(r.tienPhat ? 'amber' : 'zero')}>{vnd(r.tienPhat)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-slate-600">Tổng thu: <b className="text-amber-600">{vnd(tongTien)}</b> ({vnd(GAY_DON_GIA)}/gậy)</span>
                <button className={btnPrimary + ' ml-auto'} disabled={dangChot} onClick={lamChot}>
                  {dangChot ? 'Đang chốt…' : `Chốt ${nhanKy(ky)}`}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
