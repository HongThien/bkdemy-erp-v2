// BỔ TRỢ NHẸ (L1.1) — Thùy 29/10, spec-truong-khoi.md §8. Trưởng khối tự tạo ca, không qua Lộc, không suất.
// Tạo ca: thời gian (sau buổi / khác) → lớp → học sinh (tô em có dạng yếu) → TA cùng làm → ra thông báo dán Zalo lớp.
// Chạy ca = CaDetail của ca Yếu (điểm danh · in phiếu luyện + test · nhập giấy · đóng ca · hoàn tất) — không dựng máy thứ hai.
// Mọi kiểm tra ở DB (fn_btnhe_*). Sau mutation: vá/refetch nền, không xoá list (CLAUDE.md §2 React).
import { useEffect, useMemo, useState } from 'react'
import { lopCuaToi, hsCuaLop, taoCaNhe, dsCaNhe, huyCaNhe, thongBaoPhuHuynh, type LopNhe, type HsNhe, type CaNhe, type HsCaNhe } from '../../lib/botro_nhe'
import { CaDetail } from '../ta/CaBoTroTA'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../lib/tuan'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
// Nhớ list + ca đang mở tới F5 (rời tab Bổ trợ rồi quay lại = đúng chỗ cũ).
const NHO: { rows: CaNhe[] | null; mo: { buoiId: string } | null } = { rows: null, mo: null }

function trangThaiHs(h: HsCaNhe): { ten: string; cls: string } {
  if (h.buoi_trang_thai === 'huy') return { ten: h.diem_danh === 'vang' ? 'Vắng' : 'Đã huỷ', cls: 'bg-rose-50 text-rose-600' }
  if (h.danh_gia_xong_at) return { ten: 'Hoàn tất', cls: 'bg-emerald-50 text-emerald-700' }
  if (!h.diem_danh) return { ten: 'Chưa điểm danh', cls: 'bg-slate-100 text-slate-500' }
  if (!h.co_test) return { ten: 'Đang luyện', cls: 'bg-indigo-50 text-indigo-600' }
  if (!h.test_da_nop) return { ten: 'Chờ test', cls: 'bg-amber-50 text-amber-700' }
  return { ten: 'Chờ nhận xét', cls: 'bg-violet-50 text-violet-700' }
}

export default function BoTroNheScreen() {
  const homNay = homNayVN()
  const tu = congNgay(homNay, -14), den = congNgay(homNay, 14)
  const [rows, setRows] = useState<CaNhe[] | null>(NHO.rows)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMoState] = useState(NHO.mo)
  const setMo = (v: typeof mo) => { NHO.mo = v; setMoState(v) }
  const [tao, setTao] = useState(false)
  const [thongBao, setThongBao] = useState<{ caId: string; text: string } | null>(null)

  // refetch NỀN: giữ rows cũ tới khi có rows mới, không bao giờ trắng màn
  const tai = () => dsCaNhe(tu, den).then((r) => { NHO.rows = r; setRows(r); setLoi(null) }).catch((e) => setLoi(e?.message ?? String(e)))
  useEffect(() => { if (!NHO.rows) tai() }, []) // eslint-disable-line

  if (mo) return <div className="min-h-0 flex-1 overflow-auto bg-white"><CaDetail buoiId={mo.buoiId} nhe onBack={() => { setMo(null); tai() }} /></div>

  const dangToi = (rows ?? []).filter((c) => c.ngay >= homNay && c.trang_thai === 'mo')
  const daQua = (rows ?? []).filter((c) => !(c.ngay >= homNay && c.trang_thai === 'mo'))

  return (
    <div className="min-h-0 flex-1 overflow-auto px-8 py-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-[16px] font-bold text-slate-800">Bổ trợ Nhẹ</h2>
        <span className="text-[12.5px] text-slate-500">15–20 phút · trưởng khối tự xếp, tự báo phụ huynh · mỗi em tối đa 2 ca/tuần · vắng không bù</span>
        <div className="ml-auto flex gap-2">
          <button onClick={tai} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50" title="Quét lại">↻</button>
          <button onClick={() => setTao((v) => !v)} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700">{tao ? 'Đóng' : '＋ Tạo ca Nhẹ'}</button>
        </div>
      </div>
      {loi && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}

      {tao && <FormTaoCa homNay={homNay} onXong={(caId, ds) => {
        setTao(false)
        dsCaNhe(tu, den).then((r) => {
          NHO.rows = r; setRows(r)
          const ca = r.find((x) => x.ca_id === caId)
          if (ca) setThongBao({ caId, text: thongBaoPhuHuynh(ca) })
          if (ds.length) setLoi(`Lưu ý: ${ds.join(', ')} hiện chưa có dạng yếu nào đủ dữ liệu — ca vẫn tạo, phiếu in sẽ trống dạng.`)
        }).catch((e) => setLoi(e?.message ?? String(e)))
      }} />}

      {thongBao && <ThongBaoBox text={thongBao.text} onDong={() => setThongBao(null)} />}

      {rows === null ? <p className="text-[13px] text-slate-400">Đang tải…</p> : (
        <>
          <Nhom tieuDe={`Sắp tới & hôm nay · ${dangToi.length} ca`} cas={dangToi} homNay={homNay} onMo={(b) => setMo({ buoiId: b })}
            onThongBao={(c) => setThongBao({ caId: c.ca_id, text: thongBaoPhuHuynh(c) })}
            onHuy={async (c) => {
              if (!window.confirm(`Huỷ ca ${ddmmVN(c.ngay)} ${hhmm(c.gio_bat_dau)} lớp ${c.ten_lop}? Em đã điểm danh giữ nguyên.`)) return
              try { await huyCaNhe(c.ca_id, 'Trưởng khối huỷ ca'); tai() } catch (e: any) { setLoi(e?.message ?? String(e)) }
            }} rong="Chưa có ca Nhẹ nào sắp tới." />
          {daQua.length > 0 && <Nhom tieuDe={`Đã qua · 14 ngày · ${daQua.length} ca`} cas={daQua} homNay={homNay} onMo={(b) => setMo({ buoiId: b })}
            onThongBao={(c) => setThongBao({ caId: c.ca_id, text: thongBaoPhuHuynh(c) })} />}
        </>
      )}
    </div>
  )
}

function Nhom({ tieuDe, cas, homNay, onMo, onThongBao, onHuy, rong }: {
  tieuDe: string; cas: CaNhe[]; homNay: string; onMo: (buoiId: string) => void
  onThongBao: (c: CaNhe) => void; onHuy?: (c: CaNhe) => void; rong?: string
}) {
  return (
    <section className="mb-6">
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">{tieuDe}</p>
      {cas.length === 0 ? <p className="text-[13px] text-slate-400">{rong}</p> : (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
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
                        <li key={h.buoi_id}>
                          <button onClick={() => onMo(h.buoi_id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
                            <span className="text-[13px] font-medium text-slate-800">{h.ho_ten}</span>
                            <span className="text-[11.5px] text-slate-400">{h.so_dang} dạng</span>
                            <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${tt.cls}`}>{tt.ten}</span>
                            <span className="text-slate-300">›</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => onThongBao(c)} className="rounded-lg border border-slate-200 px-3 py-1 text-[12px] text-slate-600 hover:bg-slate-50">📋 Thông báo phụ huynh</button>
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

function ThongBaoBox({ text, onDong }: { text: string; onDong: () => void }) {
  const [daCopy, setDaCopy] = useState(false)
  return (
    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[12.5px] font-semibold text-emerald-800">Thông báo gửi nhóm Zalo lớp</span>
        <button onClick={onDong} className="ml-auto text-[12px] text-emerald-700 hover:underline">Đóng</button>
      </div>
      <p className="whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-[13.5px] text-slate-800">{text}</p>
      <button onClick={() => { navigator.clipboard?.writeText(text).then(() => { setDaCopy(true); setTimeout(() => setDaCopy(false), 2000) }).catch(() => {}) }}
        className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-emerald-700">{daCopy ? '✓ Đã copy' : 'Copy'}</button>
    </div>
  )
}

function FormTaoCa({ homNay, onXong }: { homNay: string; onXong: (caId: string, emKhongDang: string[]) => void }) {
  const [kieu, setKieu] = useState<'sau_buoi' | 'khac'>('sau_buoi')
  const [ngay, setNgay] = useState(homNay)
  const [lops, setLops] = useState<LopNhe[] | null>(null)
  const [lopId, setLopId] = useState<string>('')
  const [hs, setHs] = useState<HsNhe[] | null>(null)
  const [chon, setChon] = useState<Set<string>>(new Set())
  const [phut, setPhut] = useState(20)
  const [gio, setGio] = useState('')
  const [phong, setPhong] = useState('')
  const [coTa, setCoTa] = useState(true)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  // đổi ngữ cảnh (ngày) ⇒ reset + fetch lại danh sách lớp
  useEffect(() => { setLops(null); lopCuaToi(ngay).then(setLops).catch((e) => { setLops([]); setLoi(e?.message ?? String(e)) }) }, [ngay])
  // đổi lớp ⇒ reset + fetch học sinh
  useEffect(() => {
    setHs(null); setChon(new Set())
    if (!lopId) return
    hsCuaLop(lopId, ngay).then(setHs).catch((e) => { setHs([]); setLoi(e?.message ?? String(e)) })
  }, [lopId, ngay])

  const lop = lops?.find((l) => l.lop_id === lopId) ?? null
  // sau buổi = bắt đầu đúng lúc buổi học của lớp kết thúc, cùng phòng
  const gioBatDau = kieu === 'sau_buoi' ? hhmm(lop?.gio_ket_thuc) : gio
  const phongDung = kieu === 'sau_buoi' ? (lop?.phong ?? null) : (phong.trim() || null)
  const thieuGioSauBuoi = kieu === 'sau_buoi' && !!lop && !lop.gio_ket_thuc
  // em có dạng yếu lên đầu (sort thuần UI)
  const hsSap = useMemo(() => [...(hs ?? [])].sort((a, b) => b.so_dang_yeu - a.so_dang_yeu || a.ho_ten.localeCompare(b.ho_ten, 'vi')), [hs])
  const thieu = !lop ? 'Chọn lớp' : thieuGioSauBuoi ? 'Lớp không học ngày này — chọn "Giờ khác"' : !gioBatDau ? 'Nhập giờ bắt đầu' : chon.size === 0 ? 'Chọn học sinh' : null

  async function tao() {
    if (thieu || !lop) return
    setBusy(true); setLoi(null)
    try {
      const r = await taoCaNhe({ lopId: lop.lop_id, kieu, ngay, gioBatDau, phut, phong: phongDung, hs: [...chon], taId: coTa ? lop.ta_id : null })
      if (r.trung_phong > 0) window.alert(`Phòng ${phongDung} đang có ${r.trung_phong} buổi khác trùng giờ — ca vẫn tạo, kiểm lại phòng nhé.`)
      onXong(r.ca_id, r.em_khong_dang ?? [])
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  const nhan = 'mb-1 block text-[11.5px] font-semibold uppercase tracking-wider text-slate-500'
  return (
    <div className="mb-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr))]">
        <div>
          <span className={nhan}>1 · Thời gian</span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-[12.5px] font-semibold">
            {([['sau_buoi', 'Sau buổi học'], ['khac', 'Giờ khác']] as const).map(([k, t]) => (
              <button key={k} onClick={() => setKieu(k)} className={`rounded-md px-3 py-1 ${kieu === k ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>{t}</button>
            ))}
          </div>
          <input type="date" value={ngay} onChange={(e) => e.target.value && setNgay(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-300 px-2 py-1 text-[13px]" />
        </div>
        <div>
          <span className={nhan}>2 · Lớp</span>
          <select value={lopId} onChange={(e) => setLopId(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px]">
            <option value="">{lops === null ? 'Đang tải…' : lops.length ? '— chọn lớp —' : 'Không có lớp trong phạm vi khối'}</option>
            {(lops ?? []).map((l) => <option key={l.lop_id} value={l.lop_id}>{l.ten_lop} · {l.mon}{l.gio_ket_thuc ? ` · học ${hhmm(l.gio_bat_dau)}–${hhmm(l.gio_ket_thuc)}` : ' · không học ngày này'}</option>)}
          </select>
          {lop && kieu === 'sau_buoi' && (thieuGioSauBuoi
            ? <p className="mt-1 text-[12px] text-amber-700">Lớp không có buổi ngày {ddmmVN(ngay)} — chọn “Giờ khác”.</p>
            : <p className="mt-1 text-[12px] text-slate-500">Bắt đầu {hhmm(lop.gio_ket_thuc)}{lop.phong ? ` · phòng ${lop.phong}` : ''}</p>)}
        </div>
        <div>
          <span className={nhan}>Thời lượng{kieu === 'khac' ? ' · giờ · phòng' : ''}</span>
          <div className="flex gap-1">
            {[15, 20].map((p) => <button key={p} onClick={() => setPhut(p)} className={`rounded-lg px-3 py-1 text-[12.5px] font-semibold ${phut === p ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600'}`}>{p}′</button>)}
            <input type="number" min={10} max={90} value={phut} onChange={(e) => setPhut(Number(e.target.value) || 20)} className="w-16 rounded-lg border border-slate-300 px-2 text-[13px]" />
          </div>
          {kieu === 'khac' && (
            <div className="mt-2 flex gap-2">
              <input type="time" value={gio} onChange={(e) => setGio(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1 text-[13px]" />
              <input value={phong} onChange={(e) => setPhong(e.target.value)} placeholder="Phòng" className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-[13px]" />
            </div>
          )}
        </div>
        <div>
          <span className={nhan}>4 · TA lớp cùng làm</span>
          {lop?.ta_id ? (
            <label className="flex items-center gap-2 text-[13px] text-slate-700"><input type="checkbox" checked={coTa} onChange={(e) => setCoTa(e.target.checked)} /> {lop.ta_ten}</label>
          ) : <p className="text-[12.5px] text-slate-400">{lop ? 'Lớp chưa có TA' : '—'}</p>}
          <p className="mt-1 text-[11.5px] text-slate-400">Ghi để tính công sau (chưa tính lương).</p>
        </div>
      </div>

      <div className="mt-4">
        <span className={nhan}>3 · Học sinh {hs ? `· chọn ${chon.size}/${hs.length}` : ''}</span>
        {!lopId ? <p className="text-[13px] text-slate-400">Chọn lớp để hiện học sinh.</p>
          : hs === null ? <p className="text-[13px] text-slate-400">Đang tính dạng yếu của lớp…</p>
          : (
            <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
              {hsSap.map((h) => {
                const het = h.so_ca_nhe_tuan >= 2, co = chon.has(h.hoc_sinh_id), yeu = h.so_dang_yeu > 0
                return (
                  <label key={h.hoc_sinh_id} title={yeu ? h.dang_yeu.join('\n') : 'Chưa có dạng yếu đủ dữ liệu'}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] ${het ? 'cursor-not-allowed opacity-50' : ''} ${co ? 'border-indigo-400 bg-indigo-50' : yeu ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                    <input type="checkbox" disabled={het} checked={co} onChange={() => setChon((s) => { const n = new Set(s); if (n.has(h.hoc_sinh_id)) n.delete(h.hoc_sinh_id); else n.add(h.hoc_sinh_id); return n })} />
                    <span className="font-medium text-slate-800">{h.ho_ten}</span>
                    <span className={`ml-auto text-[11.5px] ${yeu ? 'font-semibold text-amber-700' : 'text-slate-400'}`}>{yeu ? `${h.so_dang_yeu} dạng yếu` : '—'}</span>
                    {h.so_ca_nhe_tuan > 0 && <span className="text-[10.5px] text-slate-400" title="Số ca Nhẹ tuần này">{h.so_ca_nhe_tuan}/2</span>}
                  </label>
                )
              })}
            </div>
          )}
      </div>

      {loi && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      <div className="mt-4 flex items-center gap-3">
        <button disabled={!!thieu || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-5 py-2 text-[13.5px] font-semibold text-white shadow-sm disabled:opacity-40">{busy ? 'Đang tạo…' : `Tạo ca${chon.size ? ` · ${chon.size} em` : ''}`}</button>
        {thieu && <span className="text-[12px] text-slate-400">{thieu}</span>}
      </div>
    </div>
  )
}
