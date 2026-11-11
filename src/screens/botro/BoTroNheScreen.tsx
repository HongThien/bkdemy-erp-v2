// BỔ TRỢ SAU GIỜ (= L1, Thùy 11/11 — trước là "Bổ trợ Nhẹ" L1.1, 29/10, spec-truong-khoi.md §8). Trưởng khối tự tạo ca, không qua Lộc, không suất.
// 11/11: HÀNG CHỜ = em trưởng bộ môn đã duyệt L1 (fn_btnhe_cho) → bấm "Khởi tạo ca" mở form tạo ca chọn sẵn lớp + em.
// Trong ca: 3 thứ in riêng (lý thuyết · luyện · test 1 câu/dạng yếu trong nhóm yếu) → TA nhập test → nộp = xong (SauGioCa).
// Tạo ca: thời gian (sau buổi / khác) → lớp → học sinh (tô em có dạng yếu) → TA cùng làm → ra thông báo dán Zalo lớp.
// Chạy ca = CaDetail của ca Yếu (điểm danh · in phiếu luyện + test · nhập giấy · đóng ca · hoàn tất) — không dựng máy thứ hai.
// Mọi kiểm tra ở DB (fn_btnhe_*). Sau mutation: vá/refetch nền, không xoá list (CLAUDE.md §2 React).
import { useEffect, useMemo, useState } from 'react'
import { taoCaNhe, dsCaNhe, huyCaNhe, choSauGio, lopCoEmDuyet, hsDaDuyet, buoiCuaLop, type CaNhe, type HsCaNhe, type ChoSauGio, type LopCho, type HsDuyet, type BuoiLop } from '../../lib/botro_nhe'
import ThongBaoSauGioAnh from './ThongBaoSauGioAnh'
import NutInSauGio from './NutInSauGio'
import { inTestSauGio } from '../../lib/botro_nhe'
import { inLayBaiGiay, type BaiInGiay } from '../../lib/botro_yeu_ca'
import InSauGioET from './InSauGioET'
import { CaDetail } from '../ta/CaBoTroTA'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../lib/tuan'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
// Nhớ list + ca đang mở tới F5 (rời tab Bổ trợ rồi quay lại = đúng chỗ cũ).
const NHO: { rows: CaNhe[] | null; mo: { buoiId: string } | null; cho: ChoSauGio[] | null } = { rows: null, mo: null, cho: null }

function trangThaiHs(h: HsCaNhe): { ten: string; cls: string } {
  if (h.buoi_trang_thai === 'huy') return { ten: h.diem_danh === 'vang' ? 'Vắng' : 'Đã huỷ', cls: 'bg-rose-50 text-rose-600' }
  if (h.danh_gia_xong_at) return { ten: 'Xong', cls: 'bg-emerald-50 text-emerald-700' }
  if (!h.co_test) return { ten: 'Chưa in test', cls: 'bg-slate-100 text-slate-500' }
  if (!h.test_da_nop) return { ten: 'Chờ nhập test', cls: 'bg-amber-50 text-amber-700' }
  return { ten: 'Đã nộp', cls: 'bg-violet-50 text-violet-700' }
}

export default function BoTroNheScreen() {
  const homNay = homNayVN()
  const tu = congNgay(homNay, -14), den = congNgay(homNay, 14)
  const [rows, setRows] = useState<CaNhe[] | null>(NHO.rows)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMoState] = useState(NHO.mo)
  const setMo = (v: typeof mo) => { NHO.mo = v; setMoState(v) }
  const [tao, setTao] = useState(false)
  const [dau, setDau] = useState<string | null>(null) // khởi tạo từ hàng chờ: chọn sẵn lớp (em chờ tự tick)
  const [cho, setCho] = useState<ChoSauGio[] | null>(NHO.cho)
  const [thongBao, setThongBao] = useState<string | null>(null) // ca_id đang mở ảnh thông báo PH
  const [inLop, setInLop] = useState<{ bais: BaiInGiay[]; lop: string } | null>(null)
  // IN CẢ LỚP (Thùy 11/11): chỉ BÀI TEST — mỗi em còn mở 1 bài (chưa soạn thì DB tự sinh như nút 📝), sang trang giữa các em
  async function inCaLop(c: CaNhe) {
    setLoi(null)
    const bais: BaiInGiay[] = [], loiEm: string[] = []
    for (const h of c.hs.filter((x) => x.buoi_trang_thai === 'mo' && !x.danh_gia_xong_at && !x.test_da_nop)) {
      try { const r = await inTestSauGio(h.buoi_id); bais.push(await inLayBaiGiay(r.bai_test_id)) }
      catch (e: any) { loiEm.push(`${h.ho_ten}: ${e?.message ?? e}`) }
    }
    if (loiEm.length) setLoi(`Không in được: ${loiEm.join(' · ')}`)
    if (bais.length) { setInLop({ bais, lop: c.ten_lop }); tai() } else if (!loiEm.length) setLoi('Lớp không còn em nào chờ làm bài test.')
  }

  // refetch NỀN: giữ rows cũ tới khi có rows mới, không bao giờ trắng màn
  const taiCho = () => choSauGio().then((r) => { NHO.cho = r; setCho(r) }).catch((e) => setLoi(e?.message ?? String(e)))
  const tai = () => { taiCho(); return dsCaNhe(tu, den).then((r) => { NHO.rows = r; setRows(r); setLoi(null) }).catch((e) => setLoi(e?.message ?? String(e))) }
  useEffect(() => { if (!NHO.rows) tai() }, []) // eslint-disable-line
  // hàng chờ theo LỚP (khởi tạo 1 ca cho cả nhóm em cùng lớp) — nhóm thuần UI
  const choTheoLop = useMemo(() => {
    const g = new Map<string, ChoSauGio[]>()
    for (const x of cho ?? []) { const k = x.lop_id ?? '?'; g.set(k, [...(g.get(k) ?? []), x]) }
    return [...g.values()]
  }, [cho])

  if (mo) return <div className="min-h-0 flex-1 overflow-auto bg-white"><CaDetail buoiId={mo.buoiId} nhe onBack={() => { setMo(null); tai() }} /></div>

  const dangToi = (rows ?? []).filter((c) => c.ngay >= homNay && c.trang_thai === 'mo')
  const daQua = (rows ?? []).filter((c) => !(c.ngay >= homNay && c.trang_thai === 'mo'))

  return (
    <div className="min-h-0 flex-1 overflow-auto px-8 py-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-[16px] font-bold text-slate-800">Bổ trợ sau giờ · L1</h2>
        <span className="text-[12.5px] text-slate-500">15–20 phút sau buổi học · in lý thuyết / luyện / test tuỳ em · TA nhập test là xong · mỗi em tối đa 2 ca/tuần · vắng không bù</span>
        <div className="ml-auto flex gap-2">
          <button onClick={tai} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50" title="Quét lại">↻</button>
          <button onClick={() => { setDau(null); setTao((v) => !v) }} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700">{tao ? 'Đóng' : '＋ Khởi tạo ca'}</button>
        </div>
      </div>
      {loi && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}

      {cho && cho.length > 0 && (
        <section className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-amber-800">Chờ khởi tạo · {cho.length} em đã duyệt L1 (sau giờ)</p>
          <div className="flex flex-col gap-2">
            {choTheoLop.map((ds) => (
              <div key={ds[0].lop_id ?? ds[0].hoc_sinh_id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-amber-100">
                <span className="text-[13px] font-bold text-slate-800">{ds[0].ten_lop ?? '?'}</span>
                <span className="text-[11.5px] text-slate-400">{ds[0].mon} · K{ds[0].khoi}</span>
                {ds.map((x) => (
                  <span key={x.de_xuat_id} title={x.nhom.map((n) => n.ten).join('\n') + (x.ghi_chu ? '\n— ' + x.ghi_chu : '')}
                    className="rounded-full bg-amber-100 px-2 py-0.5 text-[12px] text-amber-900">{x.ho_ten} · {x.so_dang} dạng</span>
                ))}
                {ds[0].lop_id && <button onClick={() => { setDau(ds[0].lop_id!); setTao(true) }}
                  className="ml-auto rounded-lg bg-amber-600 px-3 py-1 text-[12.5px] font-semibold text-white hover:bg-amber-700">Khởi tạo ca · {ds.length} em</button>}
              </div>
            ))}
          </div>
        </section>
      )}

      {tao && <FormKhoiTao key={dau ?? 'trong'} lopDau={dau} onXong={(caId, ds) => {
        setTao(false); setDau(null); taiCho()
        dsCaNhe(tu, den).then((r) => {
          NHO.rows = r; setRows(r)
          setThongBao(caId) // khởi tạo xong ⇒ mở ngay ảnh thông báo phụ huynh
          if (ds.length) setLoi(`Lưu ý: ${ds.join(', ')} hiện chưa có dạng yếu nào đủ dữ liệu — ca vẫn tạo, phiếu in sẽ trống dạng.`)
        }).catch((e) => setLoi(e?.message ?? String(e)))
      }} />}

      {inLop && <InSauGioET bais={inLop.bais} lop={inLop.lop} onDong={() => setInLop(null)} />}
      {thongBao && (rows ?? []).some((c) => c.ca_id === thongBao) && <ThongBaoSauGioAnh ca={(rows ?? []).find((c) => c.ca_id === thongBao)!} onDong={() => setThongBao(null)} />}

      {rows === null ? <p className="text-[13px] text-slate-400">Đang tải…</p> : (
        <>
          <Nhom tieuDe={`Sắp tới & hôm nay · ${dangToi.length} ca`} cas={dangToi} homNay={homNay} onMo={(b) => setMo({ buoiId: b })}
            onThongBao={(c) => setThongBao(c.ca_id)} onInLop={inCaLop}
            onHuy={async (c) => {
              if (!window.confirm(`Huỷ ca ${ddmmVN(c.ngay)} ${hhmm(c.gio_bat_dau)} lớp ${c.ten_lop}? Em đã điểm danh giữ nguyên.`)) return
              try { await huyCaNhe(c.ca_id, 'Trưởng khối huỷ ca'); tai() } catch (e: any) { setLoi(e?.message ?? String(e)) }
            }} rong="Chưa có ca sau giờ nào sắp tới." />
          {daQua.length > 0 && <Nhom tieuDe={`Đã qua · 14 ngày · ${daQua.length} ca`} cas={daQua} homNay={homNay} onMo={(b) => setMo({ buoiId: b })}
            onThongBao={(c) => setThongBao(c.ca_id)} />}
        </>
      )}
    </div>
  )
}

function Nhom({ tieuDe, cas, homNay, onMo, onThongBao, onHuy, onInLop, rong }: {
  tieuDe: string; cas: CaNhe[]; homNay: string; onMo: (buoiId: string) => void
  onThongBao: (c: CaNhe) => void; onHuy?: (c: CaNhe) => void; onInLop?: (c: CaNhe) => Promise<void>; rong?: string
}) {
  const [dangIn, setDangIn] = useState<string | null>(null)
  return (
    <section className="mb-6">
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">{tieuDe}</p>
      {cas.length === 0 ? <p className="text-[13px] text-slate-400">{rong}</p> : (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(420px,1fr))]">
          {cas.map((c) => {
            const huy = c.trang_thai === 'huy'
            return (
              // Card kiểu 1 (CLAUDE.md §6): header màu + thân trắng
              <div key={c.ca_id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${huy ? 'border-slate-200 opacity-60' : 'border-indigo-100'}`}>
                <div className={`px-4 py-2.5 text-white ${huy ? 'bg-slate-400' : c.ngay === homNay ? 'bg-indigo-600' : 'bg-indigo-400'}`}>
                  <div className="flex items-center gap-2 text-[14px] font-bold">
                    <span>{c.ten_lop}</span>
                    <span className="font-semibold opacity-90">· {thuCuaNgay(c.ngay)} {ddmmVN(c.ngay)}</span>
                    {c.ngay === homNay && !huy && <span className="ml-auto rounded-full bg-white/25 px-2 py-0.5 text-[10.5px]">HÔM NAY</span>}
                    {huy && <span className="ml-auto rounded-full bg-white/25 px-2 py-0.5 text-[10.5px]">ĐÃ HUỶ</span>}
                  </div>
                  <div className="text-[12px] opacity-90">{hhmm(c.gio_bat_dau)}–{hhmm(c.gio_ket_thuc)} · {c.kieu === 'sau_buoi' ? 'sau buổi học' : 'giờ khác'}{c.phong ? ` · ${c.phong}` : ''}</div>
                </div>
                <div className="px-4 py-3">
                  <p className="mb-2 text-[12px] text-slate-500">Mở/đóng: <b className="text-slate-700">{c.truong_khoi_ten ?? '?'}</b>{c.ta_ten ? <> · TA cùng làm: <b className="text-slate-700">{c.ta_ten}</b></> : ' · không có TA'}</p>
                  <ul className="flex flex-col gap-1">
                    {c.hs.map((h) => {
                      const tt = trangThaiHs(h)
                      return (
                        <li key={h.buoi_id} className="flex items-center gap-1">
                          <button onClick={() => onMo(h.buoi_id)} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
                            <span className="truncate text-[13px] font-medium text-slate-800">{h.ho_ten}</span>
                            <span className="shrink-0 text-[11.5px] text-slate-400">{h.so_dang} dạng</span>
                            <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${tt.cls}`}>{tt.ten}</span>
                            <span className="text-slate-300">›</span>
                          </button>
                          {h.buoi_trang_thai !== 'huy' && <NutInSauGio gon lop={c.ten_lop} buoiId={h.buoi_id} dong={h.buoi_trang_thai !== 'mo' || !!h.danh_gia_xong_at} daNop={h.test_da_nop} />}
                        </li>
                      )
                    })}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => onThongBao(c)} className="rounded-lg border border-slate-200 px-3 py-1 text-[12px] text-slate-600 hover:bg-slate-50">🖼 Ảnh thông báo PH</button>
                    {onInLop && !huy && <button disabled={dangIn === c.ca_id} onClick={async () => { setDangIn(c.ca_id); try { await onInLop(c) } finally { setDangIn(null) } }}
                      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50">{dangIn === c.ca_id ? 'Đang chuẩn bị…' : '🖨 In cả lớp · bài test'}</button>}
                    {onHuy && !huy && <button onClick={() => onHuy(c)} className="rounded-lg px-3 py-1 text-[12px] text-rose-600 hover:bg-rose-50">Huỷ ca</button>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

// FORM KHỞI TẠO CA SAU GIỜ (Thùy 11/11): 1 chọn lớp (lớp có em đã duyệt L1) · 2 em ĐÃ DUYỆT của lớp (tick sẵn em đang chờ) ·
// 3 chọn BUỔI HỌC sắp tới của lớp (ngày · giờ · phòng) — ca bắt đầu đúng lúc buổi tan, cùng phòng. Không nhập ngày/giờ tay.
function FormKhoiTao({ lopDau, onXong }: { lopDau?: string | null; onXong: (caId: string, emKhongDang: string[]) => void }) {
  const [lops, setLops] = useState<LopCho[] | null>(null)
  const [lopId, setLopId] = useState<string>(lopDau ?? '')
  const [hs, setHs] = useState<HsDuyet[] | null>(null)
  const [chon, setChon] = useState<Set<string>>(new Set())
  const [buois, setBuois] = useState<BuoiLop[] | null>(null)
  const [buoi, setBuoi] = useState<string>('') // ngày buổi đã chọn
  const [phut, setPhut] = useState(20)
  const [coTa, setCoTa] = useState(true)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  useEffect(() => { lopCoEmDuyet().then((r) => { setLops(r); if (!lopDau && r.length === 1) setLopId(r[0].lop_id) }).catch((e) => { setLops([]); setLoi(e?.message ?? String(e)) }) }, []) // eslint-disable-line
  // đổi lớp (đổi ngữ cảnh) ⇒ reset + fetch em + buổi song song
  useEffect(() => {
    setHs(null); setChon(new Set()); setBuois(null); setBuoi('')
    if (!lopId) return
    hsDaDuyet(lopId).then((r) => { setHs(r); setChon(new Set(r.filter((h) => h.cho && h.so_ca_tuan < 2).map((h) => h.hoc_sinh_id))) })
      .catch((e) => { setHs([]); setLoi(e?.message ?? String(e)) })
    buoiCuaLop(lopId).then((r) => { setBuois(r); if (r.length) setBuoi(r[0].ngay) }).catch((e) => { setBuois([]); setLoi(e?.message ?? String(e)) })
  }, [lopId])

  const b = buois?.find((x) => x.ngay === buoi) ?? null
  const thieu = !lopId ? 'Chọn lớp' : chon.size === 0 ? 'Chọn học sinh' : !b ? 'Chọn buổi học' : null
  async function tao() {
    if (thieu || !b) return
    setBusy(true); setLoi(null)
    try {
      const r = await taoCaNhe({ lopId, kieu: 'sau_buoi', ngay: b.ngay, gioBatDau: hhmm(b.gio_ket_thuc), phut, phong: b.phong, hs: [...chon], taId: coTa ? b.ta_id : null })
      onXong(r.ca_id, r.em_khong_dang ?? [])
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  const nhan = 'mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wider text-slate-500'
  return (
    <div className="mb-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <span className={nhan}>1 · Lớp</span>
          <select value={lopId} onChange={(e) => setLopId(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px]">
            <option value="">{lops === null ? 'Đang tải…' : lops.length ? '— chọn lớp —' : 'Chưa lớp nào có em đã duyệt L1'}</option>
            {(lops ?? []).map((l) => <option key={l.lop_id} value={l.lop_id}>{l.ten_lop} · {l.mon} · {l.so_em} em{l.so_cho ? ` (${l.so_cho} chờ)` : ''}</option>)}
          </select>
          <span className={nhan + ' mt-4'}>Thời lượng</span>
          <div className="flex gap-1">{[20, 25].map((p) => <button key={p} onClick={() => setPhut(p)} className={`rounded-lg px-3 py-1 text-[12.5px] font-semibold ${phut === p ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600'}`}>{p}′</button>)}</div>
          {b?.ta_id && <label className="mt-4 flex items-center gap-2 text-[12.5px] text-slate-700"><input type="checkbox" checked={coTa} onChange={(e) => setCoTa(e.target.checked)} /> TA cùng làm: {b.ta_ten}</label>}
        </div>
        <div>
          <span className={nhan}>2 · Học sinh đã duyệt bổ trợ {hs ? `· chọn ${chon.size}/${hs.length}` : ''}</span>
          {!lopId ? <p className="text-[13px] text-slate-400">Chọn lớp trước.</p>
            : hs === null ? <p className="text-[13px] text-slate-400">Đang tải…</p>
            : hs.length === 0 ? <p className="text-[13px] text-slate-400">Lớp chưa có em nào được duyệt L1 (sau giờ).</p>
            : <div className="flex flex-col gap-1.5">{hs.map((h) => {
                const het = h.so_ca_tuan >= 2, co = chon.has(h.hoc_sinh_id)
                return (
                  <label key={h.hoc_sinh_id} title={h.nhom.map((n) => n.ten).join('\n') + (h.ghi_chu ? '\n— ' + h.ghi_chu : '')}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] ${het ? 'cursor-not-allowed opacity-50' : ''} ${co ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                    <input type="checkbox" disabled={het} checked={co} onChange={() => setChon((x) => { const n = new Set(x); if (n.has(h.hoc_sinh_id)) n.delete(h.hoc_sinh_id); else n.add(h.hoc_sinh_id); return n })} />
                    <span className="font-medium text-slate-800">{h.ho_ten}</span>
                    <span className="text-[11.5px] text-slate-400">{h.so_dang} dạng</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${h.cho ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>{h.cho ? 'chờ khởi tạo' : `đã có ca · ${h.so_ca_tuan}/2 tuần này`}</span>
                  </label>
                )
              })}</div>}
        </div>
        <div>
          <span className={nhan}>3 · Buổi học (ca sau giờ ngay khi buổi tan)</span>
          {!lopId ? <p className="text-[13px] text-slate-400">Chọn lớp trước.</p>
            : buois === null ? <p className="text-[13px] text-slate-400">Đang tải…</p>
            : buois.length === 0 ? <p className="text-[13px] text-amber-700">Lớp không có buổi học nào trong 14 ngày tới.</p>
            : <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(190px,1fr))]">{buois.map((x) => (
                <button key={x.ngay} onClick={() => setBuoi(x.ngay)}
                  className={`rounded-lg border px-3 py-2 text-left text-[12.5px] ${buoi === x.ngay ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                  <span className="block text-[13.5px] font-bold">{thuCuaNgay(x.ngay)} {ddmmVN(x.ngay)}</span>
                  <span className={buoi === x.ngay ? 'text-white/85' : 'text-slate-500'}>học {hhmm(x.gio_bat_dau)}–{hhmm(x.gio_ket_thuc)}{x.phong ? ` · ${x.phong}` : ''}{x.so_ca_sau_gio ? ` · đã có ${x.so_ca_sau_gio} ca` : ''}</span>
                </button>
              ))}</div>}
        </div>
      </div>
      {loi && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button disabled={!!thieu || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-5 py-2 text-[13.5px] font-semibold text-white shadow-sm disabled:opacity-40">{busy ? 'Đang khởi tạo…' : `Khởi tạo ca${chon.size ? ` · ${chon.size} em` : ''}`}</button>
        {thieu ? <span className="text-[12px] text-slate-400">{thieu}</span>
          : b && <span className="text-[12px] text-slate-500">{thuCuaNgay(b.ngay)} {ddmmVN(b.ngay)} · ca từ {hhmm(b.gio_ket_thuc)} · {phut} phút sau giờ{b.phong ? ` · ${b.phong}` : ''}</span>}
      </div>
    </div>
  )
}
