// TRAO GIẢI (leaf `traogiai`) — thưởng tháng theo lớp: Xuất sắc(3)/Tiến bộ(2)/Chăm chỉ(1), CỐ ĐỊNH
// slot không scale theo sĩ số. Style PORT từ docs/mockup-trao-giai.html (CEO đã duyệt) sang Tailwind
// thật + wire Supabase thật — KHÔNG còn mock array `classes`/`allNames` của file mockup.
// Luồng xác nhận 3 mức (xem CLAUDE.md, KHÔNG gộp): slot (tick = insert/delete 1 dòng giai_thuong) →
// lớp ("Hoàn thành lớp" = khoá sửa) → tháng ("Chốt kết quả tháng" = công bố MỌI lớp cùng lúc).
import { useEffect, useMemo, useState } from 'react'
import { getMyProfile } from '../../lib/nhansu'
import {
  getTraoGiaiThang, listKhoiCoLop, xacNhanSlot, boXacNhanSlot, doiNguoiSlotDaXacNhan, hoanThanhLop, moLaiLop, chotKetQuaThang,
  curYM, shiftYM, LOAI_GIAI_THU_TU, LOAI_GIAI_TEN, SLOT_COUNT, TONG_SLOT,
  type TraoGiaiClass, type TraoGiaiAward, type TraoGiaiSlot, type LoaiGiai,
} from '../../lib/traogiai'

const AWARD_UI: Record<LoaiGiai, { icon: string; ten: string; rule: string; ring: string; iconBg: string; iconText: string; cols: string }> = {
  xuat_sac: { icon: '🏆', ten: 'Xuất sắc', rule: 'MT ↓ → ET ↓ → BTVN ↓', ring: 'ring-amber-100', iconBg: 'bg-amber-50', iconText: 'text-amber-600', cols: 'grid-cols-3' },
  tien_bo: { icon: '📈', ten: 'Tiến bộ', rule: 'Tổng Σ Elo tăng trong tháng ↓', ring: 'ring-violet-100', iconBg: 'bg-violet-50', iconText: 'text-violet-600', cols: 'grid-cols-2' },
  cham_chi: { icon: '✅', ten: 'Chăm chỉ', rule: 'Đủ BTVN ↓ → BTVN đúng TB ↓', ring: 'ring-emerald-100', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', cols: 'grid-cols-1' },
}
const slotLabel = (loaiGiai: LoaiGiai, i: number) => loaiGiai === 'xuat_sac' ? `TOP ${i + 1}` : loaiGiai === 'tien_bo' ? `SLOT ${i + 1}` : 'CHĂM CHỈ'
const slotKey = (lopId: string, loaiGiai: LoaiGiai, idx: number) => `${lopId}:${loaiGiai}:${idx}`

// Cửa sổ CỐ ĐỊNH quanh THÁNG HIỆN TẠI (không quanh tháng đang xem — đổi tháng không được làm trôi list).
const MONTH_OPTS = Array.from({ length: 8 }, (_, i) => shiftYM(curYM(), 2 - i)) // 2 tháng tới → 5 tháng trước
const monthLabel = (ym: string) => { const [y, m] = ym.split('-'); return `Tháng ${Number(m)}/${y}` }

export default function TraoGiaiScreen() {
  const [ym, setYm] = useState(curYM())
  const [khoi, setKhoi] = useState('')
  const [khoiOpts, setKhoiOpts] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<'all' | 'chua' | 'da'>('all')
  const [cards, setCards] = useState<TraoGiaiClass[]>([])
  const [nhanSuId, setNhanSuId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [busy, setBusy] = useState<Set<string>>(new Set())
  // Lựa chọn dropdown CHƯA xác nhận, ghi đè cục bộ (không phải DB) — mất khi reload nếu không confirm.
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 4000) }

  useEffect(() => { getMyProfile().then((p) => setNhanSuId(p?.nhanSu.id ?? null)).catch(() => setNhanSuId(null)) }, [])
  useEffect(() => { listKhoiCoLop().then(setKhoiOpts).catch(() => setKhoiOpts([])) }, [])

  async function reload() {
    setLoading(true); setErr(null)
    try { setCards(await getTraoGiaiThang(ym, khoi || undefined)); setOverrides({}) }
    catch (e) { setErr((e as Error).message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void reload() }, [ym, khoi]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    let list = cards
    if (tab === 'chua') list = list.filter((c) => !c.hoanThanhAt)
    if (tab === 'da') list = list.filter((c) => !!c.hoanThanhAt)
    const qq = q.trim().toLowerCase()
    if (qq) list = list.filter((c) => c.tenLop.toLowerCase().includes(qq) || c.roster.some((r) => r.ho_ten.toLowerCase().includes(qq)))
    return list
  }, [cards, tab, q])

  const summary = useMemo(() => {
    const soLop = cards.length
    const tongSlot = soLop * TONG_SLOT
    const daXacNhan = cards.reduce((s, c) => s + c.daXacNhan, 0)
    const lopDuSlot = cards.filter((c) => c.daXacNhan >= TONG_SLOT).length
    const lopHoanThanh = cards.filter((c) => c.hoanThanhAt).length
    return { soLop, tongSlot, daXacNhan, choDuyet: tongSlot - daXacNhan, lopDuSlot, lopHoanThanh }
  }, [cards])

  function effectiveSlot(card: TraoGiaiClass, award: TraoGiaiAward, slot: TraoGiaiSlot): TraoGiaiSlot & { taken: boolean } {
    const takenElsewhere = new Set(card.awards.flatMap((a) => a.slots.filter((s) => s.confirmed && s.hocSinhId !== slot.hocSinhId).map((s) => s.hocSinhId)))
    if (slot.confirmed) return { ...slot, taken: false }
    const key = slotKey(card.lopId, award.loaiGiai, slot.slotIndex)
    const ov = overrides[key]
    if (!ov || ov === slot.hocSinhId) return { ...slot, taken: takenElsewhere.has(slot.hocSinhId) }
    const person = card.roster.find((r) => r.id === ov)
    if (!person) return { ...slot, taken: takenElsewhere.has(slot.hocSinhId) }
    return { slotIndex: slot.slotIndex, hocSinhId: ov, hoTen: person.ho_ten, maHs: person.ma_hs, confirmed: false, giaiThuongId: null, metrics: card.metricsCuaHs[award.loaiGiai][ov] ?? [], taken: takenElsewhere.has(ov) }
  }

  async function toggleConfirm(card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot) {
    if (!nhanSuId) return flash('⚠️ Chưa xác định được nhân sự đang đăng nhập.')
    const key = slotKey(card.lopId, award.loaiGiai, eff.slotIndex)
    setBusy((s) => new Set(s).add(key))
    try {
      if (eff.confirmed && eff.giaiThuongId) {
        await boXacNhanSlot(eff.giaiThuongId, card.lopId, ym)
        flash(`Đã bỏ xác nhận · ${eff.hoTen}`)
      } else {
        await xacNhanSlot({ thangYm: ym, lopId: card.lopId, mon: card.mon, hocSinhId: eff.hocSinhId, loaiGiai: award.loaiGiai, nhanSuId })
        flash(`Đã xác nhận · ${eff.hoTen} · ${LOAI_GIAI_TEN[award.loaiGiai]}`)
      }
      await reload()
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(key); return n }) }
  }

  async function changePerson(card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot, newId: string) {
    const key = slotKey(card.lopId, award.loaiGiai, eff.slotIndex)
    if (!eff.confirmed) { setOverrides((o) => ({ ...o, [key]: newId })); return }
    if (!nhanSuId || !eff.giaiThuongId) return
    setBusy((s) => new Set(s).add(key))
    try {
      await doiNguoiSlotDaXacNhan({ giaiThuongIdCu: eff.giaiThuongId, thangYm: ym, lopId: card.lopId, mon: card.mon, hocSinhIdMoi: newId, loaiGiai: award.loaiGiai, nhanSuId })
      flash('Đã đổi người nhận giải')
      await reload()
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(key); return n }) }
  }

  async function toggleCompleteClass(card: TraoGiaiClass) {
    if (!nhanSuId) return flash('⚠️ Chưa xác định được nhân sự đang đăng nhập.')
    setBusy((s) => new Set(s).add(`class:${card.lopId}`))
    try {
      if (card.hoanThanhAt) {
        await moLaiLop(card.lopId, ym); flash(`Đã mở lại lớp ${card.tenLop}`)
      } else {
        if (card.daXacNhan < TONG_SLOT && !confirm(`Lớp ${card.tenLop} mới xác nhận ${card.daXacNhan}/${TONG_SLOT} slot. Bạn vẫn muốn hoàn thành lớp này chứ?`)) return
        await hoanThanhLop(card.lopId, ym, nhanSuId); flash(`Đã hoàn thành lớp ${card.tenLop}`)
      }
      await reload()
    } catch (e) { flash('⚠️ ' + (e as Error).message) }
    finally { setBusy((s) => { const n = new Set(s); n.delete(`class:${card.lopId}`); return n }) }
  }

  async function chotThang() {
    if (!confirm(`Chốt kết quả tháng ${monthLabel(ym)} cho TOÀN TRUNG TÂM?\nMọi giải đã xác nhận (chưa công bố) của tháng này sẽ công bố ra app phụ huynh/học sinh — áp dụng cho MỌI lớp cùng lúc.`)) return
    try { const n = await chotKetQuaThang(ym); flash(`Đã công bố ${n} giải thưởng tháng ${monthLabel(ym)}.`) }
    catch (e) { flash('⚠️ ' + (e as Error).message) }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <span className="text-sm font-semibold text-slate-900">Trao giải học sinh</span>
        <button onClick={chotThang} className="rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700">Chốt kết quả tháng</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <p className="max-w-[640px] text-[13px] leading-relaxed text-slate-500">
              Quy trình gồm 2 bước: <b className="text-slate-700">xác nhận từng học sinh</b> → <b className="text-slate-700">hoàn thành lớp</b>.
              Khi lớp đã hoàn thành, dữ liệu của lớp đó được xem như đã chốt xong (khoá sửa).
            </p>
            <div className="flex flex-wrap gap-2">
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
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Lớp cần trao giải" value={summary.soLop} />
            <StatCard label="Lớp đã duyệt đủ 6 slot" value={`${summary.lopDuSlot} / ${summary.soLop}`} pct={summary.soLop ? summary.lopDuSlot / summary.soLop * 100 : 0} />
            <StatCard label="Học sinh được trao" value={summary.daXacNhan} pct={summary.tongSlot ? summary.daXacNhan / summary.tongSlot * 100 : 0} tone="text-emerald-600" />
            <StatCard label="Slot chờ duyệt" value={summary.choDuyet} pct={summary.tongSlot ? summary.choDuyet / summary.tongSlot * 100 : 0} tone="text-orange-600" />
            <StatCard label="Lớp đã hoàn thành" value={summary.lopHoanThanh} pct={summary.soLop ? summary.lopHoanThanh / summary.soLop * 100 : 0} tone="text-emerald-600" />
          </div>

          {/* ── Toolbar ── */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-lg bg-slate-200/60 p-1">
              {(['all', 'chua', 'da'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-[13px] font-semibold transition ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {t === 'all' ? 'Tất cả lớp' : t === 'chua' ? 'Chưa hoàn thành' : 'Đã hoàn thành'}
                </button>
              ))}
            </div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm lớp hoặc học sinh…" className="w-full max-w-[300px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none" />
          </div>

          {err && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-[13px] text-slate-400">Không có lớp nào khớp bộ lọc.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {filtered.map((card) => (
                <ClassCard key={card.lopId} card={card} busy={busy} effectiveSlot={effectiveSlot}
                  onToggleConfirm={toggleConfirm} onChangePerson={changePerson} onToggleComplete={toggleCompleteClass} />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white p-4 text-[12px] leading-relaxed text-slate-500">
            <div className="min-w-[140px] font-semibold text-slate-700">Logic đề xuất</div>
            <div className="max-w-[360px]"><b className="text-slate-700">Xuất sắc:</b> MT (%) giảm dần → hoà thì ET (%) tháng giảm dần → hoà nữa thì BTVN (tỉ lệ đúng TB tháng) giảm dần.</div>
            <div className="max-w-[360px]"><b className="text-slate-700">Tiến bộ:</b> tổng Δ Elo (buổi ET) cộng dồn trong tháng, giảm dần.</div>
            <div className="max-w-[360px]"><b className="text-slate-700">Chăm chỉ:</b> số buổi hoàn thành BTVN (có mặt) trong tháng giảm dần → hoà thì tỉ lệ đúng BTVN trung bình giảm dần.</div>
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>}
    </div>
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

function ClassCard({ card, busy, effectiveSlot, onToggleConfirm, onChangePerson, onToggleComplete }: {
  card: TraoGiaiClass
  busy: Set<string>
  effectiveSlot: (card: TraoGiaiClass, award: TraoGiaiAward, slot: TraoGiaiSlot) => TraoGiaiSlot & { taken: boolean }
  onToggleConfirm: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot) => void
  onChangePerson: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot, newId: string) => void
  onToggleComplete: (card: TraoGiaiClass) => void
}) {
  const locked = !!card.hoanThanhAt
  const approvalUi = card.daXacNhan === 0
    ? { ten: 'Chưa xác nhận', cls: 'bg-rose-50 text-rose-700' }
    : card.daXacNhan < TONG_SLOT
      ? { ten: `Đã duyệt ${card.daXacNhan}/${TONG_SLOT}`, cls: 'bg-orange-50 text-orange-700' }
      : { ten: `Đã duyệt đủ ${TONG_SLOT}/${TONG_SLOT}`, cls: 'bg-emerald-50 text-emerald-700' }
  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${locked ? 'border-emerald-200' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[13px] font-extrabold text-blue-600">{card.tenLop.slice(0, 4)}</div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Lớp {card.tenLop}</h3>
            <div className="text-[12px] text-slate-500">{card.siSo} học sinh · {card.mon} · {TONG_SLOT} slot trao giải</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <span className={`rounded-full px-2.5 py-1.5 text-[11px] font-extrabold ${approvalUi.cls}`}>{approvalUi.ten}</span>
          <span className={`rounded-full px-2.5 py-1.5 text-[11px] font-extrabold ${locked ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{locked ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</span>
        </div>
      </div>

      <div className="space-y-3.5 p-4">
        {card.awards.map((award) => (
          <AwardBlock key={award.loaiGiai} card={card} award={award} locked={locked} busy={busy} effectiveSlot={effectiveSlot} onToggleConfirm={onToggleConfirm} onChangePerson={onChangePerson} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
        <div className="flex flex-wrap gap-3 text-[12px] text-slate-500">
          {LOAI_GIAI_THU_TU.map((lg) => <span key={lg}>{AWARD_UI[lg].icon} {SLOT_COUNT[lg]} {LOAI_GIAI_TEN[lg]}</span>)}
          <span className="font-semibold text-slate-600">Đã xác nhận {card.daXacNhan}/{TONG_SLOT}</span>
        </div>
        <button disabled={busy.has(`class:${card.lopId}`)} onClick={() => onToggleComplete(card)}
          className={`rounded-lg px-3.5 py-2 text-[13px] font-bold transition disabled:opacity-50 ${locked ? 'border border-slate-200 bg-white text-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
          {busy.has(`class:${card.lopId}`) ? 'Đang lưu…' : locked ? 'Mở lại lớp' : 'Hoàn thành lớp'}
        </button>
      </div>
    </article>
  )
}

function AwardBlock({ card, award, locked, busy, effectiveSlot, onToggleConfirm, onChangePerson }: {
  card: TraoGiaiClass; award: TraoGiaiAward; locked: boolean; busy: Set<string>
  effectiveSlot: (card: TraoGiaiClass, award: TraoGiaiAward, slot: TraoGiaiSlot) => TraoGiaiSlot & { taken: boolean }
  onToggleConfirm: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot) => void
  onChangePerson: (card: TraoGiaiClass, award: TraoGiaiAward, eff: TraoGiaiSlot, newId: string) => void
}) {
  const ui = AWARD_UI[award.loaiGiai]
  return (
    <div className={`rounded-xl border border-slate-200 p-3.5 ring-1 ${ui.ring}`}>
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] font-extrabold text-slate-800">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[15px] ${ui.iconBg}`}>{ui.icon}</span>
          {ui.ten} · {award.slotCount} slot
        </div>
        <div className="max-w-[220px] text-right text-[11px] leading-snug text-slate-400">{ui.rule}</div>
      </div>
      <div className={`grid gap-2 ${ui.cols}`}>
        {award.slots.map((slot) => {
          const eff = effectiveSlot(card, award, slot)
          const key = slotKey(card.lopId, award.loaiGiai, eff.slotIndex)
          const isBusy = busy.has(key)
          const disabled = locked || isBusy
          return (
            <div key={key} className={`rounded-lg border p-2.5 transition ${eff.confirmed ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/40'} ${locked ? 'opacity-75' : ''}`}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500">{slotLabel(award.loaiGiai, eff.slotIndex)}</span>
                <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-600">Đề xuất</span>
              </div>
              <select disabled={disabled} value={eff.hocSinhId} onChange={(e) => onChangePerson(card, award, eff, e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[12.5px] font-semibold text-slate-700 outline-none disabled:bg-slate-100 disabled:text-slate-400">
                {!card.roster.some((r) => r.id === eff.hocSinhId) && <option value={eff.hocSinhId}>{eff.hoTen}</option>}
                {card.roster.map((r) => {
                  const takenByOther = r.id !== eff.hocSinhId && card.awards.some((a) => a.slots.some((s) => s.confirmed && s.hocSinhId === r.id))
                  return <option key={r.id} value={r.id} disabled={takenByOther}>{r.ho_ten}{takenByOther ? ' (đã trao giải khác)' : ''}</option>
                })}
              </select>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {eff.metrics.length === 0 && <span className="text-[10.5px] text-slate-400">Chưa đủ dữ liệu</span>}
                {eff.metrics.map((m, i) => (
                  <span key={i} className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${m.strong ? 'bg-emerald-50 text-emerald-700' : m.up ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>{m.label}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600">
                  <input type="checkbox" checked={eff.confirmed} disabled={disabled} onChange={() => onToggleConfirm(card, award, eff)} className="h-3.5 w-3.5 accent-emerald-600" />
                  Xác nhận trao giải
                </label>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${eff.confirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>{eff.confirmed ? 'Đã xác nhận' : 'Chờ duyệt'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
