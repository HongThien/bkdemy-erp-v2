// TRAO GIẢI (leaf `traogiai`) — thưởng tháng theo lớp: Xuất sắc(3)/Tiến bộ(2)/Chăm chỉ(1), CỐ ĐỊNH
// slot không scale theo sĩ số. Style PORT từ docs/mockup-trao-giai.html (CEO đã duyệt) sang Tailwind
// thật + wire Supabase thật — KHÔNG còn mock array `classes`/`allNames` của file mockup.
// Luồng xác nhận 3 mức (xem CLAUDE.md, KHÔNG gộp): slot (tick = insert/delete 1 dòng giai_thuong) →
// lớp ("Hoàn thành lớp" = khoá sửa) → tháng ("Chốt kết quả tháng" = công bố MỌI lớp cùng lúc).
// §2.0 (09/09): màn này KHÔNG tính gì — 1 rpc `fn_traogiai_thang` trả đủ (summary + lớp + slot + metric);
// mọi nút ghi = 1 rpc transactional, kiểm khoá/trùng ở DB. Client chỉ render + format chip + giữ lựa chọn
// dropdown CHƯA xác nhận (state UI thuần).
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { captureReportSnapshot } from '../report/ReportCard'
import { upsertBaoCaoPH, getBaoCaoPH } from '../../lib/report'
import {
  getTraoGiaiThang, xacNhanSlot, boXacNhanSlot, doiNguoiSlotDaXacNhan, chotGiaiLop, moLaiGiaiLop, chotKetQuaThang, datSlotLop, metricChips,
  curYM, shiftYM, LOAI_GIAI_TEN, LOAI_GIAI_THU_TU, TONG_SLOT,
  type TraoGiaiThang, type TraoGiaiClass, type TraoGiaiAward, type TraoGiaiSlot, type LoaiGiai, type MetricChip, type SlotCauHinh,
} from '../../lib/traogiai'

type EffSlot = TraoGiaiSlot & { taken: boolean; metrics: MetricChip[] }

const AWARD_UI: Record<LoaiGiai, { icon: string; ten: string; rule: string; ring: string; iconBg: string; iconText: string }> = {
  xuat_sac: { icon: '🏆', ten: 'Xuất sắc', rule: 'MT ↓ → ET ↓ → BTVN ↓', ring: 'ring-amber-100', iconBg: 'bg-amber-50', iconText: 'text-amber-600' },
  tien_bo: { icon: '📈', ten: 'Tiến bộ', rule: 'Lên hạng MT (lớp + khối) so với tháng trước ↓', ring: 'ring-violet-100', iconBg: 'bg-violet-50', iconText: 'text-violet-600' },
  cham_chi: { icon: '✅', ten: 'Chăm chỉ', rule: 'Đủ BTVN ↓ → BTVN đúng TB ↓', ring: 'ring-emerald-100', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
}
const slotLabel = (loaiGiai: LoaiGiai, i: number) => loaiGiai === 'xuat_sac' ? `TOP ${i + 1}` : `SLOT ${i + 1}`
const slotKey = (lopId: string, loaiGiai: LoaiGiai, idx: number) => `${lopId}:${loaiGiai}:${idx}`

// Cửa sổ CỐ ĐỊNH quanh THÁNG HIỆN TẠI (không quanh tháng đang xem — đổi tháng không được làm trôi list).
const MONTH_OPTS = Array.from({ length: 8 }, (_, i) => shiftYM(curYM(), 2 - i)) // 2 tháng tới → 5 tháng trước
const monthLabel = (ym: string) => { const [y, m] = ym.split('-'); return `Tháng ${Number(m)}/${y}` }

// ⭐ "Rời màn rồi quay lại = đúng chỗ cũ" (CLAUDE.md §2 React — Thùy 09-09): màn unmount khi đổi lá ở NhanSuHome,
// nên filter + data đã vá + scrollTop nhớ ở MODULE-LEVEL (sống tới F5). Mount lại: dùng cache, bỏ fetch đầu; ↻ ép quét.
type Tab = 'all' | 'chua' | 'da' | 'chot'
const NHO: { ym: string; khoi: string; q: string; tab: Tab; data: TraoGiaiThang | null; scrollTop: number; fetchedFor: string } = {
  ym: curYM(), khoi: '', q: '', tab: 'all', data: null, scrollTop: 0, fetchedFor: '',
}

export default function TraoGiaiScreen() {
  const [ym, setYm] = useState(NHO.ym)
  const [khoi, setKhoi] = useState(NHO.khoi)
  const [q, setQ] = useState(NHO.q)
  const [tab, setTab] = useState<Tab>(NHO.tab)
  const [data, setData] = useState<TraoGiaiThang | null>(NHO.data)
  const [loading, setLoading] = useState(!NHO.data)
  const [refreshing, setRefreshing] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [busy, setBusy] = useState<Set<string>>(new Set())
  // Lựa chọn dropdown CHƯA xác nhận, ghi đè cục bộ (không phải DB) — chỉ xoá khi ĐỔI NGỮ CẢNH (tháng/khối).
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 4000) }

  // Đổi NGỮ CẢNH (tháng/khối) ⇒ reset + fetch lại là đúng.
  async function reload() {
    setLoading(true); setErr(null)
    try { setData(await getTraoGiaiThang(ym, khoi || undefined)); setOverrides({}) }
    catch (e) { setErr((e as Error).message ?? String(e)) }
    finally { setLoading(false) }
  }
  // Refetch NỀN sau mutation: giữ `data` cũ tới khi có bản mới, KHÔNG blank, KHÔNG xoá overrides
  // (server có thể đổi thêm dòng khác — đề xuất các slot còn lại dịch theo HS vừa chốt).
  async function refetchNen() {
    setRefreshing(true)
    try { setData(await getTraoGiaiThang(ym, khoi || undefined)) }
    catch (e) { flash('⚠️ Không làm mới được: ' + ((e as Error).message ?? String(e))) }
    finally { setRefreshing(false) }
  }
  useEffect(() => {
    // Mount lại có cache ĐÚNG ngữ cảnh ⇒ bỏ fetch đầu, khôi phục vị trí cuộn. So bằng khoá ngữ cảnh đã fetch
    // (KHÔNG dùng ref "đã mount" — StrictMode chạy effect 2 lần, ref đặt true ở lần 1 làm lần 2 rơi xuống reload).
    const key = `${ym}|${khoi}`
    if (data && NHO.fetchedFor === key) {
      requestAnimationFrame(() => { if (scrollRef.current) scrollRef.current.scrollTop = NHO.scrollTop })
      return
    }
    NHO.fetchedFor = key
    void reload()
  }, [ym, khoi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { NHO.ym = ym; NHO.khoi = khoi; NHO.q = q; NHO.tab = tab; NHO.data = data }, [ym, khoi, q, tab, data])

  // Vá TẠI CHỖ 1 lớp sau mutation (không reload cả danh sách).
  function vaLop(lopId: string, fn: (c: TraoGiaiClass) => TraoGiaiClass) {
    setData((d) => d ? { ...d, lops: d.lops.map((c) => c.lopId === lopId ? fn(c) : c) } : d)
  }
  function vaSummary(fn: (s: TraoGiaiThang['summary']) => TraoGiaiThang['summary']) {
    setData((d) => d ? { ...d, summary: fn(d.summary) } : d)
  }

  const cards = data?.lops ?? []
  // Sort HIỂN THỊ theo số (3 → 12, '4T' sau '4') — DB trả jsonb_agg(distinct) nên đang thứ tự chữ (10, 11, 12, 3…).
  const khoiOpts = useMemo(() => [...(data?.khoiOpts ?? [])].sort((x, y) => parseInt(x) - parseInt(y) || x.localeCompare(y)), [data])
  const filtered = useMemo(() => {
    let list = cards
    if (tab === 'chua') list = list.filter((c) => !c.hoanThanhAt)
    if (tab === 'da') list = list.filter((c) => !!c.hoanThanhAt)
    const qq = q.trim().toLowerCase()
    if (qq) list = list.filter((c) => c.tenLop.toLowerCase().includes(qq) || c.roster.some((r) => r.ho_ten.toLowerCase().includes(qq)))
    return list
  }, [cards, tab, q])

  // Tab "Đã chốt giải" = PHẲNG HOÁ các slot đã xác nhận từ cùng `data` (không rpc riêng, không tính gì thêm —
  // số liệu học tập của em đó là `metricsCuaHs` DB đã tính, cùng nguồn công thức với Report PH: MT/hạng từ
  // fn_rank_diem_mt_lop, ET%/BTVN% = TB các buổi của Σđiểm/(100×số câu đã chấm)). Chỉ lọc theo ô tìm + sắp xếp hiển thị.
  const daChot = useMemo(() => {
    const qq = q.trim().toLowerCase()
    const rows: { card: TraoGiaiClass; loaiGiai: LoaiGiai; slot: TraoGiaiSlot }[] = []
    for (const card of cards) for (const a of card.awards) for (const slot of a.slots) if (slot.confirmed) rows.push({ card, loaiGiai: a.loaiGiai, slot })
    const thuTu: Record<LoaiGiai, number> = { xuat_sac: 0, tien_bo: 1, cham_chi: 2 }
    return rows
      .filter((r) => !qq || r.card.tenLop.toLowerCase().includes(qq) || r.slot.hoTen.toLowerCase().includes(qq))
      .sort((a, b) => a.card.tenLop.localeCompare(b.card.tenLop) || thuTu[a.loaiGiai] - thuTu[b.loaiGiai] || a.slot.slotIndex - b.slot.slotIndex)
  }, [cards, q])

  // Tổng hợp do DB trả (fn_traogiai_thang.summary) — không reduce ở client (§2.0).
  const summary = data?.summary ?? { soLop: 0, tongSlot: 0, daXacNhan: 0, lopDuSlot: 0, lopHoanThanh: 0, daCongBo: 0 }
  const choDuyet = summary.tongSlot - summary.daXacNhan

  // Slot hiệu dụng = slot DB trả, đè bởi lựa chọn dropdown CHƯA xác nhận (state UI). Chip = format số DB đã tính.
  function effectiveSlot(card: TraoGiaiClass, award: TraoGiaiAward, slot: TraoGiaiSlot): EffSlot {
    const chips = (hsId: string) => metricChips(award.loaiGiai, card.metricsCuaHs[hsId])
    const takenElsewhere = new Set(card.awards.flatMap((a) => a.slots.filter((s) => s.confirmed && s.hocSinhId !== slot.hocSinhId).map((s) => s.hocSinhId)))
    if (slot.confirmed) return { ...slot, taken: false, metrics: chips(slot.hocSinhId) }
    const key = slotKey(card.lopId, award.loaiGiai, slot.slotIndex)
    const ov = overrides[key]
    if (!ov || ov === slot.hocSinhId) return { ...slot, taken: takenElsewhere.has(slot.hocSinhId), metrics: chips(slot.hocSinhId) }
    const person = card.roster.find((r) => r.id === ov)
    if (!person) return { ...slot, taken: takenElsewhere.has(slot.hocSinhId), metrics: chips(slot.hocSinhId) }
    return { slotIndex: slot.slotIndex, hocSinhId: ov, hoTen: person.ho_ten, maHs: person.ma_hs, confirmed: false, giaiThuongId: null, congBoAt: null, metrics: chips(ov), taken: takenElsewhere.has(ov) }
  }

  async function toggleConfirm(card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot) {
    const key = slotKey(card.lopId, award.loaiGiai, eff.slotIndex)
    setBusy((s) => new Set(s).add(key))
    try {
      if (eff.confirmed && eff.giaiThuongId) {
        const idCu = eff.giaiThuongId
        await boXacNhanSlot(idCu)
        vaLop(card.lopId, (c) => ({ ...c, daXacNhan: c.daXacNhan - 1, awards: c.awards.map((a) => ({ ...a, slots: a.slots.map((s) => s.giaiThuongId === idCu ? { ...s, confirmed: false, giaiThuongId: null } : s) })) }))
        vaSummary((s) => ({ ...s, daXacNhan: s.daXacNhan - 1 }))
        flash(`Đã bỏ xác nhận · ${eff.hoTen}`)
      } else {
        const idMoi = await xacNhanSlot({ thangYm: ym, lopId: card.lopId, hocSinhId: eff.hocSinhId, loaiGiai: award.loaiGiai })
        vaLop(card.lopId, (c) => ({ ...c, daXacNhan: c.daXacNhan + 1, awards: c.awards.map((a) => a.loaiGiai !== award.loaiGiai ? a : { ...a, slots: a.slots.map((s) => s.slotIndex === eff.slotIndex ? { ...s, hocSinhId: eff.hocSinhId, hoTen: eff.hoTen, maHs: eff.maHs, confirmed: true, giaiThuongId: idMoi, congBoAt: null } : s) }) }))
        vaSummary((s) => ({ ...s, daXacNhan: s.daXacNhan + 1 }))
        setOverrides((o) => { const n = { ...o }; delete n[key]; return n })
        flash(`Đã xác nhận · ${eff.hoTen} · ${LOAI_GIAI_TEN[award.loaiGiai]}`)
      }
      void refetchNen() // đề xuất các slot khác dịch theo — làm mới NỀN, không blank
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(key); return n }) }
  }

  async function changePerson(card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot, newId: string) {
    const key = slotKey(card.lopId, award.loaiGiai, eff.slotIndex)
    if (!eff.confirmed) { setOverrides((o) => ({ ...o, [key]: newId })); return }
    if (!eff.giaiThuongId) return
    setBusy((s) => new Set(s).add(key))
    try {
      const idCu = eff.giaiThuongId
      const idMoi = await doiNguoiSlotDaXacNhan(idCu, newId)
      const nguoi = card.roster.find((r) => r.id === newId)
      vaLop(card.lopId, (c) => ({ ...c, awards: c.awards.map((a) => ({ ...a, slots: a.slots.map((s) => s.giaiThuongId === idCu ? { ...s, hocSinhId: newId, hoTen: nguoi?.ho_ten ?? '?', maHs: nguoi?.ma_hs ?? null, giaiThuongId: idMoi } : s) })) }))
      flash('Đã đổi người nhận giải')
      void refetchNen()
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(key); return n }) }
  }

  // Đặt slot (lớp × tháng) — vá slotCauHinh/tongSlot tại chỗ, đề xuất lấp slot mới lấy từ refetch nền.
  async function datSlot(card: TraoGiaiClass, c: { xuat_sac: number; tien_bo: number; cham_chi: number }): Promise<boolean> {
    setBusy((s) => new Set(s).add(`slot:${card.lopId}`))
    try {
      await datSlotLop(card.lopId, ym, c)
      const tong = c.xuat_sac + c.tien_bo + c.cham_chi
      const tuyChinh = !(c.xuat_sac === 3 && c.tien_bo === 2 && c.cham_chi === 1)
      vaLop(card.lopId, (k) => ({ ...k, tongSlot: tong, slotCauHinh: { ...c, tuyChinh }, awards: k.awards.map((a) => ({ ...a, slotCount: c[a.loaiGiai], slots: a.slots.filter((sl) => sl.confirmed || sl.slotIndex < c[a.loaiGiai]) })) }))
      vaSummary((s) => ({ ...s, tongSlot: s.tongSlot - card.tongSlot + tong }))
      flash(`Đã đặt slot lớp ${card.tenLop}: ${c.xuat_sac} Xuất sắc · ${c.tien_bo} Tiến bộ · ${c.cham_chi} Chăm chỉ`)
      void refetchNen()
      return true
    } catch (e) { flash('⚠️ ' + (e as Error).message); return false }
    finally { setBusy((s) => { const n = new Set(s); n.delete(`slot:${card.lopId}`); return n }) }
  }

  // Chốt / mở lại 1 GIẢI của lớp (không phải "hoàn thành lớp" nữa — chốt Xuất sắc xong DB tự chuyển sang Tiến bộ).
  // Chốt giải cuối cùng ⇒ DB tự set hoan_thanh_at (lopHoanThanh++). Mở lại giải chốt cuối ⇒ xoá dấu hoàn thành.
  async function chotGiai(card: TraoGiaiClass, loaiGiai: LoaiGiai) {
    const award = card.awards.find((a) => a.loaiGiai === loaiGiai); if (!award) return
    const daXn = award.slots.filter((s) => s.confirmed).length
    if (daXn < award.slotCount && !confirm(`Giải ${LOAI_GIAI_TEN[loaiGiai]} lớp ${card.tenLop} mới xác nhận ${daXn}/${award.slotCount} slot. Chốt giải này (không thể sửa cho tới khi mở lại)?`)) return
    setBusy((s) => new Set(s).add(`chot:${card.lopId}:${loaiGiai}`))
    try {
      await chotGiaiLop(card.lopId, ym, loaiGiai)
      flash(`Đã chốt giải ${LOAI_GIAI_TEN[loaiGiai]} lớp ${card.tenLop}`)
      await refetchDongBo(card.lopId) // rank Tiến bộ đổi theo pool mới → lấy lại từ DB (không tự suy được ở client)
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(`chot:${card.lopId}:${loaiGiai}`); return n }) }
  }
  async function moLaiGiai(card: TraoGiaiClass, loaiGiai: LoaiGiai) {
    setBusy((s) => new Set(s).add(`chot:${card.lopId}:${loaiGiai}`))
    try {
      await moLaiGiaiLop(card.lopId, ym, loaiGiai)
      flash(`Đã mở lại giải ${LOAI_GIAI_TEN[loaiGiai]} lớp ${card.tenLop}`)
      await refetchDongBo(card.lopId)
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(`chot:${card.lopId}:${loaiGiai}`); return n }) }
  }
  // Refetch cả màn (không optimistic được vì DB tính lại đề xuất giai đoạn kế theo pool mới) — nhanh (~1s).
  async function refetchDongBo(_lopId: string) {
    try { setData(await getTraoGiaiThang(ym, khoi || undefined)) } catch (e) { flash('⚠️ ' + (e as Error).message) }
  }

  async function chotThang() {
    if (!confirm(`Chốt kết quả tháng ${monthLabel(ym)} cho TOÀN TRUNG TÂM?\nMọi giải đã xác nhận (chưa công bố) của tháng này sẽ công bố ra app phụ huynh/học sinh — áp dụng cho MỌI lớp cùng lúc.`)) return
    try { const n = await chotKetQuaThang(ym); flash(`Đã công bố ${n} giải thưởng tháng ${monthLabel(ym)}.`); void refetchNen() }
    catch (e) { flash('⚠️ ' + (e as Error).message) }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <span className="text-sm font-semibold text-slate-900">Trao giải học sinh</span>
        <button onClick={chotThang} className="rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700">Chốt kết quả tháng</button>
      </div>

      <div ref={scrollRef} onScroll={(e) => { NHO.scrollTop = e.currentTarget.scrollTop }} className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <p className="max-w-[640px] text-[13px] leading-relaxed text-slate-500">
              Quy trình gồm 2 bước: <b className="text-slate-700">xác nhận từng học sinh</b> → <b className="text-slate-700">hoàn thành lớp</b>.
              Khi lớp đã hoàn thành, dữ liệu của lớp đó được xem như đã chốt xong (khoá sửa).
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => void refetchNen()} disabled={refreshing} title="Quét lại từ DB (giữ vị trí)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">{refreshing ? '…' : '↻'}</button>
              <select value={ym} onChange={(e) => setYm(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 outline-none">
                {MONTH_OPTS.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
              <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 outline-none">
                <option value="">Tất cả khối</option>
                {khoiOpts.map((k) => <option key={k} value={k}>Khối {k}</option>)}
              </select>
            </div>
          </div>

          {/* ── Summary stats ── */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Lớp cần trao giải" value={summary.soLop} />
            <StatCard label="Lớp đã duyệt đủ slot" value={`${summary.lopDuSlot} / ${summary.soLop}`} pct={summary.soLop ? summary.lopDuSlot / summary.soLop * 100 : 0} />
            <StatCard label="Học sinh được trao" value={summary.daXacNhan} pct={summary.tongSlot ? summary.daXacNhan / summary.tongSlot * 100 : 0} tone="text-emerald-600" />
            <StatCard label="Slot chờ duyệt" value={choDuyet} pct={summary.tongSlot ? choDuyet / summary.tongSlot * 100 : 0} tone="text-orange-600" />
            <StatCard label="Lớp đã hoàn thành" value={summary.lopHoanThanh} pct={summary.soLop ? summary.lopHoanThanh / summary.soLop * 100 : 0} tone="text-emerald-600" />
            <StatCard label="Giải đã công bố" value={summary.daCongBo} pct={summary.tongSlot ? summary.daCongBo / summary.tongSlot * 100 : 0} tone="text-blue-600" />
          </div>

          {/* ── Toolbar ── */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-lg bg-slate-200/60 p-1">
              {(['all', 'chua', 'da', 'chot'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-[13px] font-semibold transition ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {t === 'all' ? 'Tất cả lớp' : t === 'chua' ? 'Chưa hoàn thành' : t === 'da' ? 'Đã hoàn thành' : `Đã chốt giải (${summary.daXacNhan})`}
                </button>
              ))}
            </div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm lớp hoặc học sinh…" className="w-full max-w-[300px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none" />
          </div>

          {err && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : tab === 'chot' ? (
            <BangDaChot rows={daChot} ym={ym} />
          ) : filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-[13px] text-slate-400">Không có lớp nào khớp bộ lọc.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filtered.map((card) => (
                <ClassCard key={card.lopId} card={card} busy={busy} effectiveSlot={effectiveSlot}
                  onToggleConfirm={toggleConfirm} onChangePerson={changePerson} onChotGiai={chotGiai} onMoLaiGiai={moLaiGiai} onDatSlot={datSlot} />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white p-4 text-[12px] leading-relaxed text-slate-500">
            <div className="min-w-[140px] font-semibold text-slate-700">Logic đề xuất</div>
            <div className="max-w-[360px]"><b className="text-slate-700">Xuất sắc:</b> điểm MT (thang 10, cửa sổ 25 → 10 tháng sau) giảm dần → hoà thì ET (%) tháng giảm dần → hoà nữa thì BTVN (tỉ lệ đúng TB tháng) giảm dần.</div>
            <div className="max-w-[360px]"><b className="text-slate-700">Tiến bộ:</b> lên hạng MT so với tháng trước — Δ hạng trong lớp + Δ hạng trong khối, giảm dần (chỉ HS có điểm MT cả 2 tháng).</div>
            <div className="max-w-[360px]"><b className="text-slate-700">Chăm chỉ:</b> số buổi hoàn thành BTVN (có mặt) trong tháng giảm dần → hoà thì tỉ lệ đúng BTVN trung bình giảm dần.</div>
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>}
    </div>
  )
}

// ── Bảng "Đã chốt giải": Lớp · HS · Giải · ảnh chụp học tập tháng (MT + hạng lớp/khối · ET% · BTVN%) · trạng thái ──
const fmtPct = (v: number | null) => v == null ? '—' : `${Math.round(v * 100)}%`
const fmtMT = (v: number | null) => v == null ? '—' : Number(v).toFixed(2).replace(/\.?0+$/, '')
const fmtNgay = (iso: string) => { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` }
// Ảnh chụp học tập = dùng CHUNG với Report PH (cột bao_cao_ph.anh_bao_cao_url). Tab này chụp trước khi
// Report PH chốt được (CEO 11/09 "trao giải trước cả report"). Ghi ảnh KHÔNG động cong_bo_at nên PH chưa thấy;
// khi Report PH chốt về sau tự dùng ảnh này (hoặc chụp lại đè). Template + logic số Y HỆT Report PH.
function BangDaChot({ rows, ym }: { rows: { card: TraoGiaiClass; loaiGiai: LoaiGiai; slot: TraoGiaiSlot }[]; ym: string }) {
  const [anh, setAnh] = useState<Record<string, string | null>>({}) // key = hsId|mon|ym → URL đã có / null = chưa
  const [busy, setBusy] = useState<Set<string>>(new Set())
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null)
  const [xemAnh, setXemAnh] = useState<string | null>(null) // URL đang phóng to
  const [toast, setToast] = useState<string | null>(null)
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000) }
  const anhKey = (hsId: string, mon: string) => `${hsId}|${mon}|${ym}`

  // Load ảnh đã có (bao_cao_ph.anh_bao_cao_url) mỗi khi rows đổi — chỉ những dòng chưa cache.
  useEffect(() => {
    let huy = false
    async function tai() {
      const canTai = rows.filter((r) => !(anhKey(r.slot.hocSinhId, r.card.mon) in anh))
      if (canTai.length === 0) return
      const kq = await Promise.all(canTai.map(async (r) => {
        try { const bc = await getBaoCaoPH(r.slot.hocSinhId, r.card.mon, ym); return [anhKey(r.slot.hocSinhId, r.card.mon), bc.anh_bao_cao_url] as const }
        catch { return [anhKey(r.slot.hocSinhId, r.card.mon), null] as const }
      }))
      if (huy) return
      setAnh((prev) => ({ ...prev, ...Object.fromEntries(kq) }))
    }
    void tai(); return () => { huy = true }
  }, [rows, ym]) // eslint-disable-line react-hooks/exhaustive-deps

  async function chupMot(r: { card: TraoGiaiClass; loaiGiai: LoaiGiai; slot: TraoGiaiSlot }): Promise<string | null> {
    const k = anhKey(r.slot.hocSinhId, r.card.mon)
    setBusy((s) => new Set(s).add(k))
    try {
      const url = await captureReportSnapshot({
        hsId: r.slot.hocSinhId, mon: r.card.mon, ym, lopId: r.card.lopId,
        hsName: r.slot.hoTen, hsImg: null, lopTen: r.card.tenLop,
      })
      await upsertBaoCaoPH(r.slot.hocSinhId, r.card.mon, ym, { anh_bao_cao_url: url })
      setAnh((prev) => ({ ...prev, [k]: url }))
      return url
    } catch (e) { flash('⚠️ ' + (e as Error).message); return null }
    finally { setBusy((s) => { const n = new Set(s); n.delete(k); return n }) }
  }
  async function chupCaBang() {
    const canChup = rows.filter((r) => !anh[anhKey(r.slot.hocSinhId, r.card.mon)])
    if (canChup.length === 0) { flash('Cả bảng đã có ảnh — bấm 🔄 để chụp lại.'); return }
    setBulk({ done: 0, total: canChup.length })
    // TUẦN TỰ (không parallel) vì render off-screen dùng chung DOM + tránh quá tải upload.
    for (let i = 0; i < canChup.length; i++) { await chupMot(canChup[i]); setBulk({ done: i + 1, total: canChup.length }) }
    setBulk(null); flash(`Đã chụp ${canChup.length} ảnh.`)
  }

  if (rows.length === 0) return <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-[13px] text-slate-400">Chưa có học sinh nào được chốt giải trong tháng này.</p>
  const soChua = rows.filter((r) => !anh[anhKey(r.slot.hocSinhId, r.card.mon)]).length
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[12px] text-slate-500">Ảnh chụp lấy y hệt Report PH (điểm ET/BTVN/MT, hạng lớp/khối). Chụp trước, PH chưa thấy tới khi chốt Report riêng.</div>
        <button disabled={!!bulk || soChua === 0} onClick={() => void chupCaBang()}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
          {bulk ? `Đang chụp ${bulk.done}/${bulk.total}…` : `📸 Chụp cả bảng (${soChua} chưa có)`}
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-[12.5px]">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">Lớp</th>
              <th className="px-3 py-2.5 text-left font-semibold">Học sinh</th>
              <th className="px-3 py-2.5 text-left font-semibold">Giải</th>
              <th className="px-3 py-2.5 text-right font-semibold">MT</th>
              <th className="px-3 py-2.5 text-right font-semibold">Hạng lớp</th>
              <th className="px-3 py-2.5 text-right font-semibold">Hạng khối</th>
              <th className="px-3 py-2.5 text-right font-semibold">ET</th>
              <th className="px-3 py-2.5 text-right font-semibold">BTVN</th>
              <th className="px-3 py-2.5 text-center font-semibold">Ảnh</th>
              <th className="px-3 py-2.5 text-left font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const { card, loaiGiai, slot } = r
              const m = card.metricsCuaHs[slot.hocSinhId]
              const ui = AWARD_UI[loaiGiai]
              const k = anhKey(slot.hocSinhId, card.mon)
              const url = anh[k]
              const dangChup = busy.has(k) || !!bulk
              return (
                <tr key={slot.giaiThuongId ?? `${card.lopId}:${slot.hocSinhId}`} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-3 py-2 font-bold text-slate-800">{card.tenLop} <span className="font-normal text-slate-400">· {card.mon}</span></td>
                  <td className="px-3 py-2 font-semibold text-slate-800">{slot.hoTen} {slot.maHs && <span className="font-normal text-slate-400">({slot.maHs})</span>}</td>
                  <td className="px-3 py-2"><span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ${ui.iconBg} ${ui.iconText}`}>{ui.icon} {ui.ten}</span></td>
                  <td className="px-3 py-2 text-right font-bold text-slate-800">{fmtMT(m?.mt ?? null)}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{m?.rankLopNay != null ? `#${m.rankLopNay}/${card.siSo}` : '—'}{m?.rankLopTruoc != null && m?.rankLopNay != null && m.rankLopTruoc !== m.rankLopNay ? <span className={`ml-1 text-[10.5px] ${m.rankLopTruoc > m.rankLopNay ? 'text-emerald-600' : 'text-rose-500'}`}>({m.rankLopTruoc > m.rankLopNay ? '↑' : '↓'}{Math.abs(m.rankLopTruoc - m.rankLopNay)})</span> : null}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{m?.rankKhoiNay != null ? `#${m.rankKhoiNay}/${m.khoiTotal ?? '?'}` : '—'}{m?.rankKhoiTruoc != null && m?.rankKhoiNay != null && m.rankKhoiTruoc !== m.rankKhoiNay ? <span className={`ml-1 text-[10.5px] ${m.rankKhoiTruoc > m.rankKhoiNay ? 'text-emerald-600' : 'text-rose-500'}`}>({m.rankKhoiTruoc > m.rankKhoiNay ? '↑' : '↓'}{Math.abs(m.rankKhoiTruoc - m.rankKhoiNay)})</span> : null}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{fmtPct(m?.et ?? null)}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{fmtPct(m?.btvn ?? null)}{m?.btvnTong ? <span className="ml-1 text-[10.5px] text-slate-400">({m.btvnHoanThanh}/{m.btvnTong} buổi)</span> : null}</td>
                  <td className="px-3 py-2 text-center">
                    {url ? (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setXemAnh(url)} title="Xem ảnh"><img src={url} alt="" className="h-10 w-10 rounded border border-slate-200 object-cover" /></button>
                        <button disabled={dangChup} onClick={() => void chupMot(r)} title="Chụp lại (đè ảnh cũ)" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">🔄</button>
                      </div>
                    ) : (
                      <button disabled={dangChup} onClick={() => void chupMot(r)} className="rounded bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50">
                        {busy.has(k) ? '⏳' : '📸 Chụp'}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2">{slot.congBoAt ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">Đã công bố {fmtNgay(slot.congBoAt)}</span> : <span className="whitespace-nowrap rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-700">Chờ chốt tháng</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {xemAnh && createPortal(
        <div onClick={() => setXemAnh(null)} className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/70 p-4">
          <img src={xemAnh} alt="" className="max-h-full max-w-full rounded-xl shadow-2xl" />
        </div>,
        document.body,
      )}
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>}
    </>
  )
}

function StatCard({ label, value, pct, tone }: { label: string; value: string | number; pct?: number; tone?: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-slate-200">
      <div className="text-[12px] font-semibold text-slate-500">{label}</div>
      <div className={`mt-1 text-[22px] font-extrabold ${tone ?? 'text-slate-800'}`}>{value}</div>
      {pct != null && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
        </div>
      )}
    </div>
  )
}

// ── Card NGANG full màn (CEO 09/09: "card dọc phải kéo đi kéo lại") — trái = lớp + trạng thái + nút, phải = 6 slot
//    trên 1 hàng (3 Xuất sắc · 2 Tiến bộ · 1 Chăm chỉ). Dưới xl thì 3 nhóm giải xếp dọc, không tràn ngang.
function ClassCard({ card, busy, effectiveSlot, onToggleConfirm, onChangePerson, onChotGiai, onMoLaiGiai, onDatSlot }: {
  card: TraoGiaiClass
  busy: Set<string>
  effectiveSlot: (card: TraoGiaiClass, award: TraoGiaiAward, slot: TraoGiaiSlot) => EffSlot
  onToggleConfirm: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot) => void
  onChangePerson: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot, newId: string) => void
  onChotGiai: (card: TraoGiaiClass, loaiGiai: LoaiGiai) => void
  onMoLaiGiai: (card: TraoGiaiClass, loaiGiai: LoaiGiai) => void
  onDatSlot: (card: TraoGiaiClass, c: { xuat_sac: number; tien_bo: number; cham_chi: number }) => Promise<boolean>
}) {
  const locked = !!card.hoanThanhAt // = tất cả giải đã chốt
  const slotBusy = busy.has(`slot:${card.lopId}`)
  // Editor slot (state UI thuần): mở → 3 ô số → Lưu. Tổng ≤ 6 kiểm ở DB, đây chỉ hiện tổng để người thấy trước.
  const [suaSlot, setSuaSlot] = useState(false)
  const [nhap, setNhap] = useState<SlotCauHinh>(card.slotCauHinh)
  const tongNhap = nhap.xuat_sac + nhap.tien_bo + nhap.cham_chi
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${locked ? 'border-emerald-200' : 'border-slate-200'}`}>
      <div className="flex flex-col xl:flex-row xl:items-stretch">
        {/* ── Trái: lớp — CEO 09/09: "bé lại, chỉ tên lớp + nút xác nhận" để nhường chỗ hiển thị HS ── */}
        <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-3 py-2.5 xl:w-[132px] xl:flex-col xl:items-stretch xl:justify-between xl:border-b-0 xl:border-r">
          <div className="flex items-center gap-2 xl:flex-col xl:items-start xl:gap-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[12px] font-extrabold text-blue-600">{card.tenLop.slice(0, 4)}</div>
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-bold text-slate-900">Lớp {card.tenLop}</h3>
              <div className={`text-[11px] font-semibold ${locked ? 'text-emerald-600' : card.daXacNhan ? 'text-orange-600' : 'text-slate-400'}`}>
                {card.daXacNhan}/{card.tongSlot}{locked ? ' · đã HT' : ''}{card.daCongBo > 0 ? ` · CB ${card.daCongBo}` : ''}
              </div>
              {/* Cấu trúc slot của lớp — bấm để đổi khi nhiều em bằng điểm (CEO 09/09) */}
              {!suaSlot ? (
                <button disabled={locked} onClick={() => { setNhap(card.slotCauHinh); setSuaSlot(true) }} title="Đổi số slot từng loại cho lớp này (tháng này)"
                  className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${card.slotCauHinh.tuyChinh ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'} disabled:opacity-60`}>
                  {card.slotCauHinh.xuat_sac}·{card.slotCauHinh.tien_bo}·{card.slotCauHinh.cham_chi} ⚙
                </button>
              ) : (
                <div className="mt-1 space-y-1 rounded-md border border-violet-200 bg-violet-50/40 p-1.5">
                  {LOAI_GIAI_THU_TU.map((lg) => (
                    <label key={lg} className="flex items-center justify-between gap-1 text-[10.5px] font-semibold text-slate-600">
                      {LOAI_GIAI_TEN[lg]}
                      <input type="number" min={0} max={TONG_SLOT} value={nhap[lg]} onChange={(e) => setNhap({ ...nhap, [lg]: Math.max(0, Math.min(TONG_SLOT, Number(e.target.value) || 0)) })}
                        className="w-10 rounded border border-slate-200 bg-white px-1 py-0.5 text-right text-[11px]" />
                    </label>
                  ))}
                  <div className={`text-[10px] ${tongNhap < 1 || tongNhap > TONG_SLOT ? 'text-rose-600' : 'text-slate-400'}`}>Tổng {tongNhap}/{TONG_SLOT}</div>
                  <div className="flex gap-1">
                    <button disabled={slotBusy || tongNhap < 1 || tongNhap > TONG_SLOT} onClick={async () => { if (await onDatSlot(card, nhap)) setSuaSlot(false) }}
                      className="flex-1 rounded bg-violet-600 px-1.5 py-1 text-[10.5px] font-bold text-white disabled:opacity-50">{slotBusy ? '…' : 'Lưu'}</button>
                    <button onClick={() => setSuaSlot(false)} className="rounded border border-slate-200 bg-white px-1.5 py-1 text-[10.5px] font-semibold text-slate-600">Huỷ</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {locked && <div className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-center text-[11px] font-bold text-emerald-700 xl:w-full">✓ Đã chốt cả 3 giải</div>}
        </div>

        {/* ── Phải: 6 slot trên 1 hàng ── */}
        <div className="flex flex-1 flex-col gap-2 p-3 xl:flex-row">
          {card.awards.filter((a) => a.slotCount > 0).map((award) => (
            <AwardBlock key={award.loaiGiai} card={card} award={award} busy={busy} effectiveSlot={effectiveSlot} onToggleConfirm={onToggleConfirm} onChangePerson={onChangePerson} onChotGiai={onChotGiai} onMoLaiGiai={onMoLaiGiai} />
          ))}
        </div>
      </div>
    </article>
  )
}

function AwardBlock({ card, award, busy, effectiveSlot, onToggleConfirm, onChangePerson, onChotGiai, onMoLaiGiai }: {
  card: TraoGiaiClass; award: TraoGiaiAward; busy: Set<string>
  effectiveSlot: (card: TraoGiaiClass, award: TraoGiaiAward, slot: TraoGiaiSlot) => EffSlot
  onToggleConfirm: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot) => void
  onChangePerson: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot, newId: string) => void
  onChotGiai: (card: TraoGiaiClass, loaiGiai: LoaiGiai) => void
  onMoLaiGiai: (card: TraoGiaiClass, loaiGiai: LoaiGiai) => void
}) {
  const ui = AWARD_UI[award.loaiGiai]
  const locked = award.trangThai !== 'dang_xet' // chỉ giải ĐANG XÉT được tick
  const chotBusy = busy.has(`chot:${card.lopId}:${award.loaiGiai}`)
  const daXn = award.slots.filter((s) => s.confirmed).length
  return (
    // Rộng theo SỐ SLOT (3 slot = gấp 3 lần 1 slot) — chỉ ở xl (hàng ngang); dưới xl xếp dọc, không áp tỉ lệ.
    <div className={`min-w-0 rounded-xl border p-2 ring-1 xl:[flex:var(--n)_1_0%] ${award.trangThai === 'da_chot' ? 'border-emerald-200 bg-emerald-50/30 ring-emerald-100' : award.trangThai === 'cho' ? 'border-slate-200 bg-slate-50/60 ring-slate-100 opacity-70' : `border-slate-200 ${ui.ring}`}`} style={{ ['--n' as string]: award.slotCount } as CSSProperties}>
      <div className="mb-1.5 flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-extrabold text-slate-800" title={ui.rule}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[13px] ${ui.iconBg}`}>{ui.icon}</span>
          {ui.ten}
          {award.trangThai === 'cho' && <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9.5px] font-bold text-slate-500">Chờ lượt</span>}
        </div>
        {award.trangThai === 'dang_xet' && (
          <button disabled={chotBusy} onClick={() => onChotGiai(card, award.loaiGiai)} title={`Chốt giải ${ui.ten} (đề xuất Tiến bộ/Chăm chỉ sẽ tính lại từ HS còn lại)`}
            className="rounded bg-emerald-600 px-2 py-0.5 text-[10.5px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
            {chotBusy ? '…' : `Chốt (${daXn}/${award.slotCount})`}
          </button>
        )}
        {award.trangThai === 'da_chot' && (
          <button disabled={chotBusy} onClick={() => onMoLaiGiai(card, award.loaiGiai)} title="Mở lại giải này để sửa (chỉ mở được giải chốt sau cùng)"
            className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 disabled:opacity-50">
            {chotBusy ? '…' : '✓ Đã chốt · mở lại'}
          </button>
        )}
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${award.slotCount}, minmax(0, 1fr))` }}>
        {award.slots.length === 0 && <div className="col-span-full rounded-lg border border-dashed border-slate-200 px-2 py-3 text-center text-[10.5px] text-slate-400">Chưa có đề xuất — chưa đủ dữ liệu tháng này</div>}
        {award.slots.map((slot) => {
          const eff = effectiveSlot(card, award, slot)
          const key = slotKey(card.lopId, award.loaiGiai, eff.slotIndex)
          const isBusy = busy.has(key)
          const disabled = locked || isBusy
          return (
            <div key={key} className={`flex min-w-0 flex-col rounded-lg border p-2 transition ${eff.confirmed ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/40'} ${locked ? 'opacity-75' : ''}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10.5px] font-extrabold text-slate-500">{slotLabel(award.loaiGiai, eff.slotIndex)}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-extrabold ${eff.confirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>{eff.confirmed ? 'Đã xác nhận' : 'Chờ duyệt'}</span>
              </div>
              <select disabled={disabled} value={eff.hocSinhId} onChange={(e) => onChangePerson(card, award, eff, e.target.value)}
                className="w-full min-w-0 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[12px] font-semibold text-slate-700 outline-none disabled:bg-slate-100 disabled:text-slate-400">
                {!card.roster.some((r) => r.id === eff.hocSinhId) && <option value={eff.hocSinhId}>{eff.hoTen}</option>}
                {card.roster.map((r) => {
                  const takenByOther = r.id !== eff.hocSinhId && card.awards.some((a) => a.slots.some((s) => s.confirmed && s.hocSinhId === r.id))
                  return <option key={r.id} value={r.id} disabled={takenByOther}>{r.ho_ten}{takenByOther ? ' (đã trao giải khác)' : ''}</option>
                })}
              </select>
              <div className="mt-1 flex min-h-[18px] flex-wrap gap-1">
                {eff.metrics.length === 0 && <span className="text-[10px] text-slate-400">Chưa đủ dữ liệu</span>}
                {eff.metrics.map((m, i) => (
                  <span key={i} className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${m.strong ? 'bg-emerald-50 text-emerald-700' : m.up ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>{m.label}</span>
                ))}
              </div>
              <label className="mt-auto flex items-center gap-1.5 pt-1.5 text-[11px] font-semibold text-slate-600">
                <input type="checkbox" checked={eff.confirmed} disabled={disabled} onChange={() => onToggleConfirm(card, award, eff)} className="h-3.5 w-3.5 accent-emerald-600" />
                Xác nhận
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
