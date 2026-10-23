// Bổ trợ › Ôn thi (Thùy 23/10): mỗi kỳ thi (giữa kỳ ×2 · cuối kỳ ×2 một năm) BK mở ca ôn cho TẤT CẢ học sinh trong ~2 tuần.
// Ngoài hệ case: không mastery, không app HS, không test. Trang tạo ĐỢT → CA (ngày · giờ · phòng · TA) → thêm HS đăng ký; TA điểm danh +
// báo động ở app TA; màn này có 3 tab: Ca & đăng ký · Thống kê (đã đi / chờ đi / không đi được / chưa đi theo khối) · Báo động từ TA.
// Mọi số ở DB (fn_onthi_*). Mutation vá/refetch NỀN, không blank list (CLAUDE.md §2); nhớ đợt + tab đang xem khi rời màn.
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  dsDot, luuDot, dsCa, luuCa, huyCa, timHs, themHs, goHs, doiCaHs, thongKe, dsNhom, dsBaoDong, xuLyBaoDong,
  LOAI_DOT_TEN, KHOI_CHON, NHOM_TEN,
  type DotOnThi, type CaOnThi, type HsTim, type KetQuaThemHs, type ThongKeOnThi, type NhomOnThi, type HsNhom, type BaoDongOnThi, type LoaiDot,
} from '../../lib/botro_on_thi'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listPhong, type Phong } from '../../lib/phong'
import SearchSelect from '../../components/SearchSelect'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'

type Sub = 'ca' | 'thongke' | 'baodong'
const NHO: { dot: string | null; sub: Sub; khoi: string } = { dot: null, sub: 'ca', khoi: '' }
const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
const ngayDai = (n: string) => `${thuCuaNgay(n)} ${ddmmVN(n)}`
const inp = 'w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-400'

export default function BoTroOnThiScreen() {
  const [dots, setDots] = useState<DotOnThi[] | null>(null)
  const [dotId, setDotIdState] = useState<string | null>(NHO.dot)
  const [sub, setSubState] = useState<Sub>(NHO.sub)
  const [loi, setLoi] = useState<string | null>(null)
  const [formDot, setFormDot] = useState<DotOnThi | 'moi' | null>(null)
  const [soBaoDong, setSoBaoDong] = useState(0)
  const setSub = (s: Sub) => { NHO.sub = s; setSubState(s) }
  const setDotId = (id: string | null) => { NHO.dot = id; setDotIdState(id) }

  const taiDot = (chon?: string) => dsDot().then((d) => {
    setDots(d)
    const giu = chon ?? NHO.dot
    setDotId(giu && d.some((x) => x.id === giu) ? giu : d[0]?.id ?? null)
  }).catch((e) => setLoi(e?.message ?? String(e)))
  useEffect(() => { taiDot() }, []) // eslint-disable-line
  const dot = dots?.find((d) => d.id === dotId) ?? null
  useEffect(() => { if (dotId) dsBaoDong(dotId, 'moi').then((b) => setSoBaoDong(b.length)).catch(() => {}) }, [dotId])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f5f5f7] px-8 pb-10 pt-4">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-500">Đợt ôn thi</span>
          <select value={dotId ?? ''} onChange={(e) => setDotId(e.target.value || null)} className="min-w-[260px] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13.5px] font-semibold text-slate-800 shadow-sm">
            {(dots ?? []).length === 0 && <option value="">— chưa có đợt —</option>}
            {(dots ?? []).map((d) => <option key={d.id} value={d.id}>{d.ten} · {ddmmVN(d.tu_ngay)}–{ddmmVN(d.den_ngay)}</option>)}
          </select>
          <button onClick={() => setFormDot('moi')} className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm">+ Đợt mới</button>
          {dot && <button onClick={() => setFormDot(dot)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600">Sửa đợt</button>}
          {dot && (
            <span className="ml-auto text-[12px] text-slate-500">
              {LOAI_DOT_TEN[dot.loai]} · HK{dot.hoc_ky} · khối {dot.khoi.join(', ')} · <b className="text-slate-700">{dot.so_ca}</b> ca · <b className="text-slate-700">{dot.so_hs_dang_ky}</b> em đã đăng ký
            </span>
          )}
        </div>
        {loi && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}

        {dots !== null && !dot ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-[15px] font-semibold text-slate-700">Chưa có đợt ôn thi nào</p>
            <p className="mt-1 text-[13px] text-slate-500">Mỗi kỳ thi tạo 1 đợt: chọn khối và khoảng ~2 tuần ôn, rồi tạo ca và thêm học sinh.</p>
            <button onClick={() => setFormDot('moi')} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-[13.5px] font-semibold text-white">+ Tạo đợt đầu tiên</button>
          </div>
        ) : dot && (
          <>
            <div className="mt-3 inline-flex rounded-xl border border-slate-200 bg-white p-0.5 text-[13px] font-semibold shadow-sm">
              {([['ca', 'Ca & đăng ký'], ['thongke', 'Thống kê'], ['baodong', 'Báo động từ TA']] as [Sub, string][]).map(([k, ten]) => (
                <button key={k} onClick={() => setSub(k)} className={`rounded-lg px-4 py-1.5 ${sub === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {ten}{k === 'baodong' && soBaoDong > 0 ? <span className={`ml-1.5 rounded-full px-1.5 py-px text-[11px] font-bold ${sub === k ? 'bg-white/25' : 'bg-rose-600 text-white'}`}>{soBaoDong}</span> : null}
                </button>
              ))}
            </div>
            {sub === 'ca' ? <CaTab key={dot.id} dot={dot} onDoi={() => taiDot(dot.id)} /> : sub === 'thongke' ? <ThongKeTab key={dot.id} dot={dot} /> : <BaoDongTab key={dot.id} dot={dot} onDem={setSoBaoDong} />}
          </>
        )}
      </div>
      {formDot && <DotForm dot={formDot === 'moi' ? null : formDot} onDong={() => setFormDot(null)} onXong={(id) => { setFormDot(null); taiDot(id) }} />}
    </div>
  )
}

// ───────────────────────────── Form đợt ─────────────────────────────
function DotForm({ dot, onDong, onXong }: { dot: DotOnThi | null; onDong: () => void; onXong: (id: string) => void }) {
  const [ten, setTen] = useState(dot?.ten ?? '')
  const [loai, setLoai] = useState<LoaiDot>(dot?.loai ?? 'giua_ky')
  const [hk, setHk] = useState<1 | 2>(dot?.hoc_ky ?? 1)
  const [khoi, setKhoi] = useState<Set<string>>(new Set(dot?.khoi ?? []))
  const [tu, setTu] = useState(dot?.tu_ngay ?? '')
  const [den, setDen] = useState(dot?.den_ngay ?? '')
  const [gc, setGc] = useState(dot?.ghi_chu ?? '')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const goiY = () => `Ôn thi ${loai === 'giua_ky' ? 'giữa kỳ' : 'cuối kỳ'} ${hk === 1 ? 'I' : 'II'}`
  async function luu() {
    setBusy(true); setLoi(null)
    try { onXong(await luuDot({ id: dot?.id, ten: ten.trim() || goiY(), loai, hoc_ky: hk, khoi: [...khoi], tu, den, ghi_chu: gc })) } catch (e: any) { setLoi(e?.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal tieuDe={dot ? 'Sửa đợt ôn thi' : 'Đợt ôn thi mới'} onDong={onDong}>
      <div className="flex flex-col gap-3">
        <Field ten="Tên đợt"><input value={ten} onChange={(e) => setTen(e.target.value)} placeholder={goiY()} className={inp} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field ten="Kỳ thi"><div className="flex gap-1.5">{(['giua_ky', 'cuoi_ky'] as LoaiDot[]).map((l) => <Chip key={l} on={loai === l} onClick={() => setLoai(l)}>{LOAI_DOT_TEN[l]}</Chip>)}</div></Field>
          <Field ten="Học kỳ"><div className="flex gap-1.5">{([1, 2] as const).map((h) => <Chip key={h} on={hk === h} onClick={() => setHk(h)}>HK {h}</Chip>)}</div></Field>
        </div>
        <Field ten="Khối tham gia (mẫu số thống kê = HS đang học các khối này)">
          <div className="flex flex-wrap gap-1.5">
            {KHOI_CHON.map((k) => <Chip key={k} on={khoi.has(k)} onClick={() => setKhoi((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n })}>{k}</Chip>)}
            <button onClick={() => setKhoi(new Set(KHOI_CHON))} className="px-1.5 text-[12px] text-indigo-600">tất cả</button>
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field ten="Từ ngày"><input type="date" value={tu} onChange={(e) => setTu(e.target.value)} className={inp} /></Field>
          <Field ten="Đến ngày"><input type="date" value={den} min={tu} onChange={(e) => setDen(e.target.value)} className={inp} /></Field>
        </div>
        <Field ten="Ghi chú"><input value={gc} onChange={(e) => setGc(e.target.value)} className={inp} /></Field>
        {loi && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onDong} className="rounded-lg px-4 py-2 text-[13px] text-slate-500">Thôi</button>
          <button disabled={busy || khoi.size === 0 || !tu || !den} onClick={luu} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu đợt'}</button>
        </div>
      </div>
    </Modal>
  )
}

// ───────────────────────────── Tab Ca & đăng ký ─────────────────────────────
function CaTab({ dot, onDoi }: { dot: DotOnThi; onDoi: () => void }) {
  const [cas, setCas] = useState<CaOnThi[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [formCa, setFormCa] = useState<CaOnThi | 'moi' | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [hienHuy, setHienHuy] = useState(false)
  const tai = () => dsCa(dot.id).then(setCas).catch((e) => setLoi(e?.message ?? String(e))) // refetch NỀN: giữ list cũ tới khi có list mới
  useEffect(() => { tai() }, [dot.id]) // eslint-disable-line

  const hien = (cas ?? []).filter((c) => hienHuy || c.trang_thai !== 'huy')
  const theoNgay = useMemo(() => { const m = new Map<string, CaOnThi[]>(); for (const c of hien) { const a = m.get(c.ngay) ?? []; a.push(c); m.set(c.ngay, a) } return [...m.entries()] }, [cas, hienHuy]) // eslint-disable-line
  const daHuy = (cas ?? []).filter((c) => c.trang_thai === 'huy').length

  async function huy(c: CaOnThi) {
    const ly = prompt(`Huỷ ca ${ngayDai(c.ngay)} ${hhmm(c.gio_bat_dau)}?\nCác em đã đăng ký sẽ về "chưa đi" trong thống kê. Lý do (có thể để trống):`, '')
    if (ly === null) return
    setLoi(null)
    try { await huyCa(c.buoi_id, ly); tai(); onDoi() } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <button onClick={() => setFormCa('moi')} className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm">+ Tạo ca</button>
        <span className="text-[12px] text-slate-500">Ca nằm trong {ddmmVN(dot.tu_ngay)} → {ddmmVN(dot.den_ngay)}. Em đăng ký ở đâu cũng được — Trang thêm tay vào ca.</span>
        {daHuy > 0 && <label className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-500"><input type="checkbox" checked={hienHuy} onChange={(e) => setHienHuy(e.target.checked)} />hiện {daHuy} ca đã huỷ</label>}
      </div>
      {loi && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {cas === null && <p className="mt-6 text-center text-[13px] text-slate-400">Đang tải…</p>}
      {cas !== null && hien.length === 0 && <p className="mt-6 rounded-2xl bg-white p-8 text-center text-[13px] text-slate-500 shadow-sm ring-1 ring-slate-200">Chưa có ca nào. Bấm “+ Tạo ca” để đặt phòng, giờ và TA trực.</p>}
      <div className="mt-3 flex flex-col gap-4">
        {theoNgay.map(([ngay, ds]) => (
          <div key={ngay}>
            <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">{ngayDai(ngay)}{ngay === homNayVN() ? ' · hôm nay' : ''}</p>
            <div className="flex flex-col gap-2">
              {ds.map((c) => <CaCard key={c.buoi_id} c={c} dot={dot} cacCa={cas ?? []} mo={mo === c.buoi_id} onMo={() => setMo(mo === c.buoi_id ? null : c.buoi_id)} onSua={() => setFormCa(c)} onHuy={() => huy(c)} onDoi={() => { tai(); onDoi() }} />)}
            </div>
          </div>
        ))}
      </div>
      {formCa && <CaForm dot={dot} ca={formCa === 'moi' ? null : formCa} onDong={() => setFormCa(null)} onXong={() => { setFormCa(null); tai(); onDoi() }} />}
    </div>
  )
}

function CaCard({ c, dot, cacCa, mo, onMo, onSua, onHuy, onDoi }: { c: CaOnThi; dot: DotOnThi; cacCa: CaOnThi[]; mo: boolean; onMo: () => void; onSua: () => void; onHuy: () => void; onDoi: () => void }) {
  const huy = c.trang_thai === 'huy'
  return (
    <div className={`rounded-2xl bg-white shadow-sm ring-1 ${huy ? 'opacity-60 ring-slate-200' : 'ring-slate-200'}`}>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button onClick={onMo} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="text-[15px] font-bold text-slate-800">{hhmm(c.gio_bat_dau)}–{hhmm(c.gio_ket_thuc)}</span>
          <span className="text-[13px] text-slate-600">{c.phong ?? <i className="text-amber-600">chưa có phòng</i>}</span>
          <span className="text-[13px] text-slate-600">TA: {c.ta_ten ?? <i className="text-amber-600">chưa có TA</i>}</span>
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11.5px] font-semibold text-slate-600">{c.so_dk} đăng ký</span>
          {(c.so_co_mat > 0 || c.so_vang > 0) && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11.5px] font-semibold text-emerald-700">{c.so_co_mat} có mặt{c.so_vang > 0 ? ` · ${c.so_vang} vắng` : ''}</span>}
          {c.hoan_tat && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11.5px] font-semibold text-indigo-700">TA đã hoàn tất</span>}
          {huy && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11.5px] font-semibold text-rose-700">đã huỷ{c.ly_do_huy ? `: ${c.ly_do_huy}` : ''}</span>}
          <span className="ml-auto text-slate-400">{mo ? '▾' : '▸'}</span>
        </button>
        {!huy && !c.hoan_tat && <button onClick={onSua} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] font-semibold text-slate-600">Sửa</button>}
        {!huy && <button onClick={onHuy} className="rounded-lg border border-rose-200 px-2.5 py-1 text-[12px] font-semibold text-rose-600">Huỷ ca</button>}
      </div>
      {mo && <ChiTietCa c={c} dot={dot} cacCa={cacCa} onDoi={onDoi} />}
    </div>
  )
}

function ChiTietCa({ c, dot, cacCa, onDoi }: { c: CaOnThi; dot: DotOnThi; cacCa: CaOnThi[]; onDoi: () => void }) {
  const [q, setQ] = useState('')
  const [kq, setKq] = useState<HsTim[]>([])
  const [dan, setDan] = useState('')
  const [moiKhoi, setMoiKhoi] = useState(false)
  const [tin, setTin] = useState<{ ok: boolean; t: string } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const dongDoi = useRef(0)
  const khoaThem = c.trang_thai === 'huy' || c.hoan_tat
  const trongCa = new Set(c.hs.map((h) => h.hoc_sinh_id))
  const caKhac = cacCa.filter((x) => x.buoi_id !== c.buoi_id && x.trang_thai === 'mo' && !x.hoan_tat)

  useEffect(() => {
    const lan = ++dongDoi.current
    if (q.trim().length < 2) { setKq([]); return }
    const t = setTimeout(() => { timHs(dot.id, q, moiKhoi).then((r) => { if (lan === dongDoi.current) setKq(r) }).catch(() => {}) }, 300)
    return () => clearTimeout(t)
  }, [q, moiKhoi, dot.id])

  const bao = (r: KetQuaThemHs) => {
    const p = [`Đã thêm ${r.them} em${r.da_co ? ` (${r.da_co} em đã có trong ca)` : ''}.`]
    if (r.khong_thay.length) p.push(`Không thấy / không đang học: ${r.khong_thay.join(', ')}.`)
    if (r.ngoai_khoi.length) p.push(`Khác khối của đợt (vẫn thêm): ${r.ngoai_khoi.join(', ')}.`)
    setTin({ ok: r.them > 0 || r.da_co > 0, t: p.join(' ') })
  }
  async function them(ids: string[], ma: string[] | null, k: string) {
    setBusy(k); setTin(null)
    try { bao(await themHs(c.buoi_id, ids, ma)); onDoi() } catch (e: any) { setTin({ ok: false, t: e?.message ?? String(e) }) } finally { setBusy(null) }
  }
  const danMa = () => dan.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean)
  async function go(h: { hoc_sinh_id: string }) { setTin(null); try { await goHs(c.buoi_id, h.hoc_sinh_id); onDoi() } catch (e: any) { setTin({ ok: false, t: e?.message ?? String(e) }) } }
  async function doiCa(h: { hoc_sinh_id: string }, den: string) { if (!den) return; setTin(null); try { await doiCaHs(h.hoc_sinh_id, c.buoi_id, den); onDoi() } catch (e: any) { setTin({ ok: false, t: e?.message ?? String(e) }) } }

  return (
    <div className="border-t border-slate-100 px-4 pb-4 pt-3">
      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">Học sinh trong ca ({c.hs.length})</p>
          {c.hs.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có em nào — thêm ở bên phải.</p> : (
            <div className="flex flex-col divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200">
              {c.hs.map((h) => (
                <div key={h.hoc_sinh_id} className="flex flex-wrap items-center gap-2 px-3 py-1.5 text-[13px]">
                  <span className="font-semibold text-slate-800">{h.ho_ten}</span>
                  <span className="select-all rounded bg-indigo-50 px-1.5 font-mono text-[11.5px] font-bold text-indigo-700">{h.ma_hs}</span>
                  <span className="text-[11.5px] text-slate-400">K{h.khoi}</span>
                  {h.khong_dk && <span className="rounded bg-amber-50 px-1.5 text-[11px] font-semibold text-amber-700">đến không đăng ký</span>}
                  {h.bao_dong && <span className="rounded bg-rose-600 px-1.5 text-[11px] font-bold text-white">⚠ báo động</span>}
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold ${h.diem_danh === 'co_mat' ? 'bg-emerald-50 text-emerald-700' : h.diem_danh ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                    {h.diem_danh === 'co_mat' ? 'Có mặt' : h.diem_danh ? 'Vắng' : 'Chờ'}</span>
                  {!h.diem_danh && !khoaThem && (
                    <>
                      {caKhac.length > 0 && (
                        <select value="" onChange={(e) => doiCa(h, e.target.value)} className="rounded border border-slate-200 px-1 py-0.5 text-[11.5px] text-slate-500" title="Chuyển em sang ca khác">
                          <option value="">đổi ca…</option>
                          {caKhac.map((x) => <option key={x.buoi_id} value={x.buoi_id}>{ngayDai(x.ngay)} {hhmm(x.gio_bat_dau)}{x.phong ? ` · ${x.phong}` : ''}</option>)}
                        </select>
                      )}
                      <button onClick={() => go(h)} title="Gỡ khỏi ca" className="rounded px-1.5 text-[13px] text-slate-300 hover:bg-rose-50 hover:text-rose-600">✕</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">Thêm học sinh</p>
          {khoaThem ? <p className="text-[13px] text-slate-400">Ca đã {c.trang_thai === 'huy' ? 'huỷ' : 'hoàn tất'} — không thêm được.</p> : (
            <div className="flex flex-col gap-2.5">
              <div>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ tên hoặc mã HS (≥ 2 ký tự)…" className={inp} />
                <label className="mt-1 flex items-center gap-1.5 text-[11.5px] text-slate-500"><input type="checkbox" checked={moiKhoi} onChange={(e) => setMoiKhoi(e.target.checked)} />tìm cả khối ngoài đợt</label>
                {kq.length > 0 && (
                  <div className="mt-1.5 flex max-h-[220px] flex-col divide-y divide-slate-100 overflow-y-auto rounded-lg ring-1 ring-slate-200">
                    {kq.map((h) => (
                      <div key={h.hoc_sinh_id} className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px]">
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-slate-800">{h.ho_ten}</span> <span className="font-mono text-[11px] text-indigo-600">{h.ma_hs}</span> <span className="text-slate-400">K{h.khoi}{h.lop ? ` · ${h.lop}` : ''}</span>
                          {h.da_di ? <span className="ml-1 text-[11px] font-semibold text-emerald-600">đã đi</span> : h.so_ca_da_dk > 0 ? <span className="ml-1 text-[11px] font-semibold text-indigo-600">đã đăng ký {h.so_ca_da_dk} ca</span> : null}
                        </div>
                        {trongCa.has(h.hoc_sinh_id) ? <span className="text-[11.5px] text-slate-400">đã trong ca</span>
                          : <button disabled={busy === h.hoc_sinh_id} onClick={() => them([h.hoc_sinh_id], null, h.hoc_sinh_id)} className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[12px] font-semibold text-white disabled:opacity-50">+ Thêm</button>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <textarea value={dan} onChange={(e) => setDan(e.target.value)} rows={3} placeholder="…hoặc dán danh sách mã HS (HS0123, HS0456 — cách nhau dấu phẩy / xuống dòng)" className={inp} />
                <button disabled={busy === 'dan' || danMa().length === 0} onClick={() => them([], danMa(), 'dan')} className="mt-1 rounded-lg bg-slate-800 px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-40">{busy === 'dan' ? 'Đang thêm…' : `Thêm ${danMa().length || ''} mã`}</button>
              </div>
              {tin && <p className={`rounded-lg px-3 py-2 text-[12.5px] ${tin.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>{tin.t}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CaForm({ dot, ca, onDong, onXong }: { dot: DotOnThi; ca: CaOnThi | null; onDong: () => void; onXong: () => void }) {
  const [ngay, setNgay] = useState(ca?.ngay ?? (homNayVN() >= dot.tu_ngay && homNayVN() <= dot.den_ngay ? homNayVN() : dot.tu_ngay))
  const [bd, setBd] = useState(hhmm(ca?.gio_bat_dau) || '18:00')
  const [kt, setKt] = useState(hhmm(ca?.gio_ket_thuc) || '19:30')
  const [phong, setPhong] = useState<string | null>(ca?.phong ?? null)
  const [ta, setTa] = useState<string | null>(ca?.ta_id ?? null)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { listNhanSu().then(setNss).catch(() => {}); listPhong().then(setPhongs).catch(() => {}) }, [])
  async function luu() {
    setBusy(true); setLoi(null)
    try { await luuCa({ id: ca?.buoi_id, dot: dot.id, ngay, bat_dau: bd, ket_thuc: kt, phong: phong?.trim() || null, ta }); onXong() } catch (e: any) { setLoi(e?.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal tieuDe={ca ? 'Sửa ca ôn thi' : 'Tạo ca ôn thi'} onDong={onDong}>
      <div className="flex flex-col gap-3">
        <Field ten={`Ngày (trong đợt ${ddmmVN(dot.tu_ngay)} → ${ddmmVN(dot.den_ngay)})`}><input type="date" value={ngay} min={dot.tu_ngay} max={dot.den_ngay} onChange={(e) => setNgay(e.target.value)} className={inp} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field ten="Giờ bắt đầu"><input type="time" value={bd} onChange={(e) => setBd(e.target.value)} className={inp} /></Field>
          <Field ten="Giờ kết thúc"><input type="time" value={kt} onChange={(e) => setKt(e.target.value)} className={inp} /></Field>
        </div>
        <Field ten="Phòng"><SearchSelect value={phong} onChange={setPhong} options={phongs.map((p) => ({ id: p.ma_phong, label: p.ten_phong }))} placeholder="Chọn phòng…" /></Field>
        <Field ten="TA trực ca (hiện ở app của TA đó)"><SearchSelect value={ta} onChange={setTa} avatars options={nss.filter((n) => n.trang_thai === 'dang_lam' || n.id === ta).map((n) => ({ id: n.id, label: n.ho_ten, img: n.anh_url }))} placeholder="Chọn trợ giảng…" /></Field>
        {loi && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onDong} className="rounded-lg px-4 py-2 text-[13px] text-slate-500">Thôi</button>
          <button disabled={busy || !ngay || !bd || !kt} onClick={luu} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu ca'}</button>
        </div>
      </div>
    </Modal>
  )
}

// ───────────────────────────── Tab Thống kê ─────────────────────────────
const MAU_NHOM: Record<NhomOnThi, { bar: string; chu: string; nen: string }> = {
  da_di: { bar: 'bg-emerald-500', chu: 'text-emerald-700', nen: 'bg-emerald-50' },
  cho_di: { bar: 'bg-indigo-500', chu: 'text-indigo-700', nen: 'bg-indigo-50' },
  khong_di_duoc: { bar: 'bg-rose-500', chu: 'text-rose-700', nen: 'bg-rose-50' },
  chua_di: { bar: 'bg-slate-300', chu: 'text-slate-600', nen: 'bg-slate-100' },
}
const NHOM: NhomOnThi[] = ['da_di', 'cho_di', 'khong_di_duoc', 'chua_di']

function ThongKeTab({ dot }: { dot: DotOnThi }) {
  const [khoi, setKhoiState] = useState(dot.khoi.includes(NHO.khoi) ? NHO.khoi : '')
  const [tk, setTk] = useState<ThongKeOnThi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [chon, setChon] = useState<{ khoi: string | null; nhom: NhomOnThi } | null>(null)
  const [ds, setDs] = useState<HsNhom[] | null>(null)
  const setKhoi = (k: string) => { NHO.khoi = k; setKhoiState(k); setChon(null) }
  const tai = () => thongKe(dot.id, khoi || null).then((r) => { setTk(r); setLoi(null) }).catch((e) => setLoi(e?.message ?? String(e))) // giữ số cũ tới khi có số mới
  useEffect(() => { tai() }, [dot.id, khoi]) // eslint-disable-line
  useEffect(() => {
    if (!chon) { setDs(null); return }
    let con = true
    dsNhom(dot.id, chon.khoi, chon.nhom).then((r) => { if (con) setDs(r) }).catch((e) => { if (con) setLoi(e?.message ?? String(e)) })
    return () => { con = false }
  }, [chon, dot.id])
  const pc = (n: number, t: number) => (t > 0 ? Math.round((n / t) * 100) : 0)
  const khoiSapXep = [...dot.khoi].sort((a, b) => (parseInt(a) || 99) - (parseInt(b) || 99) || a.localeCompare(b))

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-semibold text-slate-500">Khối</span>
        <div className="flex flex-wrap gap-1.5">
          <Chip on={khoi === ''} onClick={() => setKhoi('')}>Tất cả</Chip>
          {khoiSapXep.map((k) => <Chip key={k} on={khoi === k} onClick={() => setKhoi(k)}>{k}</Chip>)}
        </div>
        <button onClick={tai} className="ml-auto rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-600">↻ Tính lại</button>
      </div>
      {loi && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {!tk ? <p className="mt-6 text-center text-[13px] text-slate-400">Đang tính…</p> : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-[12px] font-semibold text-slate-500">Học sinh đang học{khoi ? ` · K${khoi}` : ''}</p>
              <p className="mt-1 text-[28px] font-extrabold leading-none text-slate-800">{tk.tong}</p>
              <p className="mt-1 text-[11.5px] text-slate-400">{tk.so_ca} ca · {tk.so_luot_co_mat} lượt có mặt</p>
            </div>
            {NHOM.map((n) => (
              <button key={n} onClick={() => setChon({ khoi: khoi || null, nhom: n })} className={`rounded-2xl p-4 text-left shadow-sm ring-1 transition ${MAU_NHOM[n].nen} ${chon?.nhom === n && (chon.khoi ?? '') === khoi ? 'ring-2 ring-indigo-500' : 'ring-slate-200 hover:ring-indigo-300'}`}>
                <p className={`text-[12px] font-semibold ${MAU_NHOM[n].chu}`}>{NHOM_TEN[n]}</p>
                <p className={`mt-1 text-[28px] font-extrabold leading-none ${MAU_NHOM[n].chu}`}>{tk[n]}</p>
                <p className="mt-1 text-[11.5px] text-slate-500">{pc(tk[n], tk.tong)}% · bấm xem tên{n === 'khong_di_duoc' && tk.thieu_diem_danh > 0 ? ` · ${tk.thieu_diem_danh} em ca đã qua TA chưa điểm danh` : ''}</p>
              </button>
            ))}
          </div>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-200">
            {NHOM.map((n) => <div key={n} className={MAU_NHOM[n].bar} style={{ width: `${pc(tk[n], tk.tong)}%` }} title={`${NHOM_TEN[n]}: ${tk[n]}`} />)}
          </div>
          {tk.ngoai_mau_so ? <p className="mt-2 text-[12px] text-slate-500">Ngoài mẫu số: {tk.ngoai_mau_so} em ở khối khác (hoặc không còn đang học) vẫn đã đến ôn.</p> : null}

          {!khoi && tk.theo_khoi.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <table className="w-full text-[13px]">
                <thead><tr className="bg-slate-50 text-left text-[11.5px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Khối</th><th className="px-3 py-2 text-right">Tổng</th>{NHOM.map((n) => <th key={n} className="px-3 py-2 text-right">{NHOM_TEN[n]}</th>)}<th className="px-3 py-2 text-right">% đã đi</th></tr></thead>
                <tbody>
                  {tk.theo_khoi.map((k) => (
                    <tr key={k.khoi} className="border-t border-slate-100">
                      <td className="px-4 py-1.5 font-bold text-slate-800">K{k.khoi}</td>
                      <td className="px-3 py-1.5 text-right">{k.tong}</td>
                      {NHOM.map((n) => <td key={n} className="px-3 py-1.5 text-right"><button disabled={k[n] === 0} onClick={() => setChon({ khoi: k.khoi, nhom: n })} className={`rounded px-1.5 font-semibold ${MAU_NHOM[n].chu} ${k[n] ? 'hover:bg-slate-100' : 'opacity-30'}`}>{k[n]}</button></td>)}
                      <td className="px-3 py-1.5 text-right font-semibold text-slate-700">{pc(k.da_di, k.tong)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-800">
                    <td className="px-4 py-2">Tổng</td><td className="px-3 py-2 text-right">{tk.tong}</td>{NHOM.map((n) => <td key={n} className="px-3 py-2 text-right">{tk[n]}</td>)}<td className="px-3 py-2 text-right">{pc(tk.da_di, tk.tong)}%</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {chon && (
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-bold text-slate-800">{NHOM_TEN[chon.nhom]}{chon.khoi ? ` · Khối ${chon.khoi}` : ''}<span className="ml-2 font-normal text-slate-500">{ds ? `${ds.length} em` : '…'}</span></p>
                <button onClick={() => setChon(null)} className="ml-auto text-[12px] text-slate-400">✕ đóng</button>
              </div>
              {ds && ds.length === 0 && <p className="mt-2 text-[13px] text-slate-400">Không có em nào.</p>}
              {ds && ds.length > 0 && (
                <div className="mt-2 max-h-[420px] overflow-y-auto">
                  <table className="w-full text-[12.5px]">
                    <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400"><th className="py-1">Học sinh</th><th>Mã</th><th>Khối</th><th>Lớp</th><th>Ca đã đăng ký</th></tr></thead>
                    <tbody>
                      {ds.map((h) => (
                        <tr key={h.hoc_sinh_id} className="border-t border-slate-100">
                          <td className="py-1 font-semibold text-slate-800">{h.ho_ten}{h.thieu_diem_danh ? <span className="ml-1 rounded bg-amber-50 px-1 text-[10.5px] font-bold text-amber-700">TA chưa điểm danh</span> : null}</td>
                          <td className="select-all font-mono text-indigo-700">{h.ma_hs}</td><td>K{h.khoi}</td><td className="text-slate-500">{h.lop ?? '—'}</td><td className="text-slate-500">{h.ca || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-400">
            Mỗi em chỉ vào 1 nhóm, ưu tiên: đã đi (≥1 lượt có mặt) › chờ đi (có ca chưa diễn ra) › không đi được (đã đăng ký nhưng vắng / ca đã qua không có mặt) › chưa đi (chưa đăng ký ca nào). Ca huỷ không tính. Mẫu số = HS đang học thuộc khối của đợt.
          </p>
        </>
      )}
    </div>
  )
}

// ───────────────────────────── Tab Báo động ─────────────────────────────
function BaoDongTab({ dot, onDem }: { dot: DotOnThi; onDem: (n: number) => void }) {
  const [loc, setLoc] = useState<'moi' | 'da_xu_ly' | 'tat_ca'>('moi')
  const [ds, setDs] = useState<BaoDongOnThi[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ghi, setGhi] = useState<Record<string, string>>({})
  const tai = () => dsBaoDong(dot.id, loc === 'tat_ca' ? null : loc).then((r) => { setDs(r); setLoi(null) }).catch((e) => setLoi(e?.message ?? String(e)))
  useEffect(() => { tai() }, [dot.id, loc]) // eslint-disable-line
  const demMoi = () => dsBaoDong(dot.id, 'moi').then((r) => onDem(r.length)).catch(() => {})
  async function xuLy(b: BaoDongOnThi, da: boolean) {
    setLoi(null)
    try { await xuLyBaoDong(b.id, da, ghi[b.id]); tai(); demMoi() } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        {([['moi', 'Chưa xử lý'], ['da_xu_ly', 'Đã xử lý'], ['tat_ca', 'Tất cả']] as const).map(([k, ten]) => <Chip key={k} on={loc === k} onClick={() => setLoc(k)}>{ten}</Chip>)}
        <span className="ml-auto text-[12px] text-slate-500">TA báo cuối giờ ca ôn thi — lời văn tự do, thông tin chốt riêng với phụ huynh.</span>
      </div>
      {loi && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {ds === null && <p className="mt-6 text-center text-[13px] text-slate-400">Đang tải…</p>}
      {ds !== null && ds.length === 0 && <p className="mt-6 rounded-2xl bg-white p-8 text-center text-[13px] text-slate-500 shadow-sm ring-1 ring-slate-200">Không có báo động {loc === 'moi' ? 'nào chưa xử lý' : loc === 'da_xu_ly' ? 'nào đã xử lý' : 'nào'}.</p>}
      <div className="mt-3 flex flex-col gap-2.5">
        {(ds ?? []).map((b) => (
          <div key={b.id} className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${b.trang_thai === 'moi' ? 'ring-rose-200' : 'ring-slate-200'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14.5px] font-bold text-slate-800">{b.ho_ten}</span>
              <span className="select-all rounded bg-indigo-50 px-1.5 font-mono text-[11.5px] font-bold text-indigo-700">{b.ma_hs}</span>
              <span className="text-[12px] text-slate-500">K{b.khoi}{b.lop ? ` · ${b.lop}` : ''}</span>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold ${b.trang_thai === 'moi' ? 'bg-rose-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>{b.trang_thai === 'moi' ? 'Chưa xử lý' : 'Đã xử lý'}</span>
            </div>
            <p className="mt-1 text-[11.5px] text-slate-400">Ca {ngayDai(b.ngay)} {hhmm(b.gio_bat_dau)}{b.phong ? ` · ${b.phong}` : ''} · TA báo: {b.ta_ten ?? '—'} · {new Date(b.tao_luc).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</p>
            <p className="mt-2 whitespace-pre-wrap rounded-xl bg-rose-50/60 px-3 py-2 text-[13.5px] leading-relaxed text-slate-800">{b.noi_dung}</p>
            {b.trang_thai === 'moi' ? (
              <div className="mt-2 flex items-center gap-2">
                <input value={ghi[b.id] ?? ''} onChange={(e) => setGhi((g) => ({ ...g, [b.id]: e.target.value }))} placeholder="Ghi chú xử lý (vd: đã gọi PH, hẹn học thêm)…" className={inp} />
                <button onClick={() => xuLy(b, true)} className="shrink-0 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white">✓ Đã xử lý</button>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2 text-[12px] text-slate-500">
                <span>{b.xu_ly_ten ? `${b.xu_ly_ten} xử lý` : 'Đã xử lý'}{b.xu_ly_at ? ` · ${new Date(b.xu_ly_at).toLocaleDateString('vi-VN')}` : ''}{b.xu_ly_ghi_chu ? ` — ${b.xu_ly_ghi_chu}` : ''}</span>
                <button onClick={() => xuLy(b, false)} className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] font-semibold text-slate-600">Mở lại</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ───────────────────────────── Nhỏ ─────────────────────────────
function Field({ ten, children }: { ten: string; children: React.ReactNode }) { return <label className="flex flex-col gap-1 text-[12px] font-semibold text-slate-500">{ten}<div className="font-normal">{children}</div></label> }
function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-3 py-1 text-[12.5px] font-semibold transition ${on ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>{children}</button>
}
function Modal({ tieuDe, onDong, children }: { tieuDe: string; onDong: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onDong() }}>
      {/* cuộn ở LỚP PHỦ (không ở thẻ) để ô chọn TA/phòng bung dropdown ra ngoài không bị cắt */}
      <div className="mx-auto my-8 w-full max-w-[520px] rounded-2xl bg-white p-5 pb-24 shadow-2xl">
        <p className="mb-3 text-[16px] font-bold text-slate-800">{tieuDe}</p>
        {children}
      </div>
    </div>
  )
}
