// ═══════════ ĐỀ THI · DUYỆT ĐỀ + PHÁT HÀNH + LƯỢT THI (spec-de-thi.md §9.3) ═══════════
// Duyệt đề = 1 cửa (CEO 20/09): đề hiện đúng bố cục giấy, người duyệt sửa tại chỗ từng câu (dạng · đáp án · Đ/S
// từng ý · đáp số TLN + 4 phương án MCQ), lưu ngay, VÁ TẠI CHỖ (không tải lại danh sách — CLAUDE.md §2 React).
// Invariant "đề sẵn sàng" + chấm + kết quả đều ở Postgres (fn_de_thi_*) — client chỉ gọi + hiển thị.
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  deThiCau, deThiThieu, duyetDeThi, moDeThi, suaCauDeThi, listFormTLN, luuFormTLN, bangCuaKho, nhanhCuaKhoPicker,
  listLuotThi, ketQuaLuot, thuBaiLuot, datKhoaDapAn,
  type DeThi, type DeThiCau, type DeThiThieu, type FormTLN, type Kho, type LoiDeThi, type LuotThi, type KetQuaLuot,
} from '../../lib/dethi'
import { listLop, type Lop } from '../../lib/nhansu'
import type { MenhDe } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import DangPickerOne from '../../components/DangPickerOne'
import SearchSelect from '../../components/SearchSelect'

const LOI_TEN: Record<LoiDeThi, string> = {
  cau_da_xoa: 'câu đã vào kho rác', dang_cho: 'chưa có dạng', thieu_dap_an: 'thiếu đáp án', thieu_phuong_an: 'thiếu phương án',
  tln_chua_mcq: 'chưa có 4 phương án trắc nghiệm', thieu_menh_de: 'thiếu mệnh đề', md_thieu_dap_an: 'ý chưa có Đ/S',
  md_dang_cho: 'ý chưa có dạng', tu_luan_chi_in: 'tự luận — chỉ in, không lên app',
}
const LOAI_TEN: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng / sai', tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận' }
const laDangCho = (m: string | null | undefined) => !m || m.endsWith('000000')
// Ngày hôm nay theo giờ máy (VN) — KHÔNG toISOString (CLAUDE.md §2 timezone)
function homNay(): string { const d = new Date(); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }

// Nội dung hiển thị của câu (đọc thô theo kho, chỉ để render)
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
async function taiTenDang(mon: string, caus: DeThiCau[]): Promise<Record<string, string>> {
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

// Phương án nhiễu GỢI Ý RẺ cho câu TLN (spec §9.5.2): số gần đáp số — người duyệt sửa/xác nhận, không ghi tự động.
function goiYNhieu(dapSo: string): string[] {
  const s = dapSo.trim()
  const x = Number(s.replace(',', '.'))
  if (!s || !Number.isFinite(x)) return ['', '', '']
  const phay = s.includes(',')
  const soLe = (s.split(/[.,]/)[1] ?? '').length
  const fmt = (v: number) => { const t = v.toFixed(soLe); return phay ? t.replace('.', ',') : t }
  const buoc = soLe ? 10 ** -soLe : 1
  const cands = [-x, x * 2, x + buoc, x - buoc, x / 2, x * 10, x + 2 * buoc]
  const out: string[] = []
  for (const v of cands) { const t = fmt(v); if (t !== fmt(x) && !out.includes(t) && !t.includes('NaN')) out.push(t); if (out.length === 3) break }
  while (out.length < 3) out.push('')
  return out
}
const boDoLa = (t: string) => t.replace(/^\$|\$\.?$/g, '')
const boc = (t: string) => (t.trim() ? `$${t.trim()}$` : '')
// Vị trí đáp án đúng trải đều A–D theo mã câu (ổn định, không random mỗi lần mở)
const viTriDung = (maCau: string) => [...maCau].reduce((s, ch) => s + ch.charCodeAt(0), 0) % 4

// ═══════════ MÀN DUYỆT ĐỀ ═══════════
export function DuyetDeView({ de, onClose, onDaDuyet }: { de: DeThi; onClose: () => void; onDaDuyet: (duyetAt: string) => void }) {
  const [caus, setCaus] = useState<DeThiCau[] | null>(null)
  const [nd, setNd] = useState<Record<string, NoiDungCau>>({})
  const [tenDang, setTenDang] = useState<Record<string, string>>({})
  const [forms, setForms] = useState<Record<string, FormTLN>>({})
  const [thieu, setThieu] = useState<DeThiThieu | null>(null)
  const [chiThieu, setChiThieu] = useState(false)
  const [pick, setPick] = useState<DeThiCau | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const flash = (ok: boolean, t: string) => { setMsg({ ok, t }); setTimeout(() => setMsg(null), ok ? 2500 : 6000) }

  useEffect(() => {
    (async () => {
      const cs = await deThiCau(de.id)
      const [n, td, th] = await Promise.all([taiNoiDung(de.mon, cs), taiTenDang(de.mon, cs), deThiThieu(de.id)])
      const fm: Record<string, FormTLN> = {}
      for (const kho of [...new Set(cs.filter((c) => c.loai_cau === 'tra_loi_ngan').map((c) => c.kho))]) {
        const mas = cs.filter((c) => c.kho === kho && c.loai_cau === 'tra_loi_ngan').map((c) => c.ma_cau)
        for (const f of await listFormTLN(de.mon, kho, mas)) fm[f.ma_cau] = f
      }
      setCaus(cs); setNd(n); setTenDang(td); setThieu(th); setForms(fm)
    })().catch((e) => flash(false, e.message ?? String(e)))
  }, [de.id, de.mon])

  // Sau mỗi lần sửa: vá đúng câu đó tại chỗ + quét lại invariant NỀN (không xoá danh sách)
  function va(ma: string, patch: Partial<DeThiCau>) { setCaus((prev) => prev?.map((c) => (c.ma_cau === ma ? { ...c, ...patch } : c)) ?? prev) }
  function quetLai() { deThiThieu(de.id).then(setThieu).catch(() => {}) }
  async function sua(c: DeThiCau, patch: { dang_chinh?: string; dap_an?: string | null; menh_de?: MenhDe[] }, local: Partial<DeThiCau>) {
    try { await suaCauDeThi(de.mon, c.kho, c.ma_cau, patch); va(c.ma_cau, local); quetLai() }
    catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function chonDang(c: DeThiCau, maDang: string) {
    setPick(null)
    if (c.loai_cau === 'dung_sai') {
      const md = (c.menh_de ?? []).map((m) => ({ ...m, ma_dang: maDang }))
      await sua(c, { dang_chinh: maDang, menh_de: md }, { dang_chinh: maDang, menh_de: md })
    } else await sua(c, { dang_chinh: maDang }, { dang_chinh: maDang })
    if (!tenDang[maDang]) taiTenDang(de.mon, [{ ...c, dang_chinh: maDang, menh_de: null }]).then((t) => setTenDang((s) => ({ ...s, ...t })))
  }
  async function duyet() {
    setBusy(true)
    try {
      const r = await duyetDeThi(de.id)
      const at = new Date().toISOString()
      onDaDuyet(at); flash(true, `Đã duyệt đề — ${r.so_cau} câu vào kho chuẩn.`)
      setCaus((prev) => prev?.map((c) => ({ ...c, da_duyet: true, form_duyet: c.co_form || c.form_duyet })) ?? prev)
    } catch (e: any) { flash(false, e.message ?? String(e)) } finally { setBusy(false) }
  }

  const loiCua = useMemo(() => new Map((thieu?.cau ?? []).map((x) => [x.ma_cau, x])), [thieu])
  const theoPhan = useMemo(() => {
    const m = new Map<string, DeThiCau[]>()
    for (const c of caus ?? []) m.set(c.phan_tieu_de, [...(m.get(c.phan_tieu_de) ?? []), c])
    return [...m.entries()]
  }, [caus])
  const soChan = thieu?.so_chan ?? 0

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Đề thi</button>
        <span className="text-[15px] font-semibold text-slate-900">Duyệt đề · {de.ten}</span>
        {de.duyet_at && <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">✓ Đã duyệt</span>}
        {thieu && (
          <span className={`rounded px-2 py-0.5 text-[12px] font-medium ${soChan ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {soChan ? `Còn ${soChan}/${thieu.tong} câu thiếu` : `Đủ dữ liệu · ${thieu.tong} câu`}{thieu.so_canh ? ` · ${thieu.so_canh} câu tự luận chỉ in` : ''}
          </span>
        )}
        <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
          <input type="checkbox" checked={chiThieu} onChange={(e) => setChiThieu(e.target.checked)} /> Chỉ câu còn thiếu
        </label>
        {msg && <span className={`text-[12px] ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{msg.t}</span>}
        <button onClick={duyet} disabled={busy || !thieu || soChan > 0}
          title={soChan ? 'Còn câu thiếu dữ liệu — xử lý hết rồi mới duyệt được' : ''}
          className="ml-auto rounded-md bg-emerald-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
          {busy ? 'Đang duyệt…' : de.duyet_at ? '✅ Duyệt lại đề' : '✅ Duyệt đề'}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        {!caus ? <p className="text-sm text-slate-400">Đang tải đề…</p> : (
          <div className="mx-auto max-w-[980px] space-y-5">
            {theoPhan.map(([phan, cs]) => (
              <div key={phan}>
                <p className="mb-2 text-[14px] font-bold uppercase tracking-wide text-slate-700">{phan}</p>
                <div className="space-y-3">
                  {cs.map((c, i) => {
                    const loi = loiCua.get(c.ma_cau)
                    if (chiThieu && !loi?.chan) return null
                    return <CauDuyet key={c.ma_cau} c={c} so={i + 1} nd={nd[c.ma_cau]} tenDang={tenDang} loi={loi?.loi ?? []} form={forms[c.ma_cau] ?? null}
                      onDoiDang={() => setPick(c)} onSua={(p, l) => sua(c, p, l)}
                      onLuuForm={async (lc, dung) => {
                        try {
                          const f = await luuFormTLN(de.mon, c.kho, c.ma_cau, lc, dung, c.dap_an ?? '', forms[c.ma_cau]?.id ?? null)
                          setForms((s) => ({ ...s, [c.ma_cau]: f })); va(c.ma_cau, { co_form: true, form_duyet: false }); quetLai(); flash(true, 'Đã lưu 4 phương án')
                        } catch (e: any) { flash(false, e.message ?? String(e)) }
                      }} />
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {pick && <DangPickerOne khoi={de.khoi} mon={de.mon} nhanh={nhanhCuaKhoPicker(pick.kho)} onClose={() => setPick(null)} onPick={(ma) => chonDang(pick, ma)} />}
    </div>
  )
}

function CauDuyet({ c, so, nd, tenDang, loi, form, onDoiDang, onSua, onLuuForm }: {
  c: DeThiCau; so: number; nd?: NoiDungCau; tenDang: Record<string, string>; loi: LoiDeThi[]; form: FormTLN | null
  onDoiDang: () => void
  onSua: (patch: { dang_chinh?: string; dap_an?: string | null; menh_de?: MenhDe[] }, local: Partial<DeThiCau>) => void
  onLuuForm: (luaChon: string[], dung: number) => Promise<void>
}) {
  const chan = loi.filter((x) => x !== 'tu_luan_chi_in')
  const vien = c.xoa ? 'border-slate-300 opacity-60' : chan.length ? 'border-rose-200' : 'border-slate-200'
  return (
    <div className={`rounded-xl border bg-white p-4 ${vien}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-bold text-slate-700">Câu {so}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{LOAI_TEN[c.loai_cau ?? ''] ?? c.loai_cau}</span>
        <span className="font-mono text-[10px] text-slate-400">{c.ma_cau}</span>
        <span className="text-[11px] text-slate-400">{c.diem} đ</span>
        {c.da_duyet && <span className="text-[11px] text-emerald-600">✓ kho chuẩn</span>}
        {loi.map((x) => <span key={x} className={`rounded px-1.5 py-0.5 text-[11px] ${x === 'tu_luan_chi_in' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{LOI_TEN[x]}</span>)}
      </div>
      <div className="mb-2 flex items-center gap-2 text-[12px]">
        <span className="text-slate-500">Dạng:</span>
        <span className={laDangCho(c.dang_chinh) ? 'font-medium text-rose-600' : 'text-slate-700'}>
          {laDangCho(c.dang_chinh) ? 'chưa có dạng' : `${tenDang[c.dang_chinh!] ?? ''} (${c.dang_chinh})`}
        </span>
        <button onClick={onDoiDang} disabled={c.xoa} className="rounded border border-indigo-200 px-2 py-0.5 text-[12px] text-indigo-700 hover:bg-indigo-50">Chọn dạng</button>
        {c.loai_cau === 'dung_sai' && <span className="text-slate-400">(áp cho cả 4 ý)</span>}
      </div>
      {nd?.noi_dung && <div className="mb-2 text-[14px] leading-relaxed text-slate-800"><MathText>{nd.noi_dung}</MathText></div>}
      {nd?.anh_de && <img src={nd.anh_de} alt="đề" className="mb-2 max-h-72 rounded border border-slate-200" />}

      {c.loai_cau === 'trac_nghiem' && (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {(c.lua_chon ?? []).map((o, i) => {
            const chu = 'ABCD'[i]; const dung = (c.dap_an ?? '').trim().toUpperCase() === chu
            return (
              <button key={i} onClick={() => onSua({ dap_an: chu }, { dap_an: chu })}
                className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] ${dung ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${dung ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{chu}</span>
                <span className="min-w-0 flex-1"><MathText>{o}</MathText></span>
              </button>
            )
          })}
        </div>
      )}

      {c.loai_cau === 'dung_sai' && (
        <div className="space-y-1.5">
          {(c.menh_de ?? []).map((m, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px]">
              <span className="font-semibold text-slate-500">{'abcd'[i]})</span>
              <span className="min-w-0 flex-1"><MathText>{m.noi_dung}</MathText></span>
              {(['D', 'S'] as const).map((v) => (
                <button key={v} onClick={() => { const md = (c.menh_de ?? []).map((x, j) => (j === i ? { ...x, dap_an: v } : x)); onSua({ menh_de: md }, { menh_de: md }) }}
                  className={`w-14 shrink-0 rounded-md border py-0.5 text-[12px] font-medium ${m.dap_an === v ? (v === 'D' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700') : 'border-slate-200 text-slate-400'}`}>
                  {v === 'D' ? 'Đúng' : 'Sai'}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {c.loai_cau === 'tra_loi_ngan' && <TLNDuyet c={c} form={form} onSua={onSua} onLuuForm={onLuuForm} />}
      {c.loai_cau === 'tu_luan' && <p className="text-[12px] text-amber-700">Câu tự luận — giữ nguyên để in, học sinh không làm câu này trên app.</p>}

      {nd?.loi_giai && (
        <details className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-[13px] text-slate-700">
          <summary className="cursor-pointer text-[12px] font-medium text-slate-500">Lời giải</summary>
          <div className="mt-1"><MathText>{nd.loi_giai}</MathText></div>
        </details>
      )}
    </div>
  )
}

// TLN: ô đáp số + 4 phương án trắc nghiệm (đáp án đúng = đáp số, khoá; 3 nhiễu máy gợi ý — người duyệt sửa rồi Lưu)
function TLNDuyet({ c, form, onSua, onLuuForm }: {
  c: DeThiCau; form: FormTLN | null
  onSua: (patch: { dap_an?: string | null }, local: Partial<DeThiCau>) => void
  onLuuForm: (luaChon: string[], dung: number) => Promise<void>
}) {
  const dapSo = c.dap_an ?? ''
  const khoiTao = () => {
    if (form) return { opts: form.lua_chon.map((o) => boDoLa(o.text)), dung: form.lua_chon.findIndex((o) => o.dung) }
    const d = viTriDung(c.ma_cau); const nh = goiYNhieu(dapSo); const opts: string[] = []
    let k = 0; for (let i = 0; i < 4; i++) opts.push(i === d ? dapSo : nh[k++] ?? '')
    return { opts, dung: d }
  }
  const [st, setSt] = useState(khoiTao)
  const [sua, setSua] = useState(!form)
  const [saving, setSaving] = useState(false)
  useEffect(() => { setSt(khoiTao()); setSua(!form) }, [form?.id]) // eslint-disable-line
  const opts = st.opts.map((o, i) => (i === st.dung ? dapSo : o)) // đáp án đúng luôn = đáp số hiện tại
  const du = opts.every((o) => o.trim()) && new Set(opts.map((o) => o.trim())).size === 4
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-slate-500">Đáp số:</span>
        <input defaultValue={dapSo} onBlur={(e) => { const v = e.target.value.trim(); if (v !== dapSo) onSua({ dap_an: v || null }, { dap_an: v || null }) }}
          className={`${inp} w-40`} />
      </div>
      <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-2.5">
        <div className="mb-1.5 flex items-center gap-2 text-[12px]">
          <span className="font-medium text-violet-800">4 phương án trên app</span>
          {form && !sua && <span className={form.da_duyet ? 'text-emerald-600' : 'text-slate-500'}>{form.da_duyet ? '✓ đã duyệt' : 'đã lưu · duyệt cùng đề'}</span>}
          {!form && <span className="text-slate-500">máy gợi ý 3 phương án nhiễu — sửa nếu cần rồi Lưu</span>}
          {form && !sua && <button onClick={() => setSua(true)} className="ml-auto text-violet-700 hover:underline">Sửa</button>}
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {opts.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${i === st.dung ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{'ABCD'[i]}</span>
              {sua && i !== st.dung
                ? <input value={o} onChange={(e) => setSt((s) => ({ ...s, opts: s.opts.map((x, j) => (j === i ? e.target.value : x)) }))} className={`${inp} flex-1`} placeholder="phương án nhiễu" />
                : <span className="text-[13px]"><MathText>{boc(o)}</MathText>{i === st.dung && <span className="ml-1 text-[11px] text-emerald-600">(đáp số)</span>}</span>}
            </div>
          ))}
        </div>
        {sua && (
          <div className="mt-2 flex items-center gap-2">
            <button disabled={!du || saving || !dapSo.trim()} onClick={async () => { setSaving(true); try { await onLuuForm(opts.map(boc), st.dung); setSua(false) } finally { setSaving(false) } }}
              className="rounded-md bg-violet-600 px-3 py-1 text-[12px] font-medium text-white disabled:opacity-40">{saving ? 'Đang lưu…' : 'Lưu 4 phương án'}</button>
            {!du && <span className="text-[11px] text-slate-500">cần đủ 4 phương án khác nhau</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════ PHÁT HÀNH ONLINE ═══════════
export function PhatHanhDeThiModal({ de, thoiGianMacDinh, onClose, onDone }: { de: DeThi; thoiGianMacDinh: number | null; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState(homNay())
  const [phut, setPhut] = useState<string>(String(thoiGianMacDinh ?? 90))
  const [khoa, setKhoa] = useState(true)
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then(setLops) }, [])
  async function xacNhan() {
    if (!lopId || !ngay) return
    setBusy(true)
    try {
      await moDeThi(de.id, lopId, ngay, phut.trim() ? Math.max(1, Math.round(+phut)) : null, khoa)
      setRes({ ok: true, msg: 'Đã phát hành — học sinh lớp này thấy đề ở ô "Làm đề thi thử".' }); onDone()
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Phát hành đề thi cho lớp thi trên app</p>
        {!de.duyet_at ? (
          <>
            <p className="mt-3 text-[13px] text-rose-600">Đề chưa duyệt. Bấm "✅ Duyệt đề", xử lý hết câu thiếu rồi mới phát hành được.</p>
            <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button></div>
          </>
        ) : res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button></div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-slate-500">Chế độ THI: giấu đáp án, chấm ở server, mỗi em nộp 1 lần. Trắc nghiệm + đúng/sai; câu trả lời ngắn hiện thành 4 phương án; câu tự luận không lên app.</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp</label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><label className="block text-[12px] font-medium text-slate-600">Ngày thi</label><input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={`${inp} mt-1 w-full`} /></div>
              <div><label className="block text-[12px] font-medium text-slate-600">Thời gian làm bài (phút)</label><input type="number" min={1} value={phut} onChange={(e) => setPhut(e.target.value)} placeholder="để trống = không giới hạn" className={`${inp} mt-1 w-full`} /></div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-[13px] text-slate-700">
              <input type="checkbox" checked={khoa} onChange={(e) => setKhoa(e.target.checked)} /> Khoá đáp án + điểm tới khi thầy/cô mở
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang phát hành…' : 'Phát hành'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════ CÁC LƯỢT THI CỦA ĐỀ ═══════════
export function LuotThiPanel({ deId, lamMoi }: { deId: string; lamMoi: number }) {
  const [luots, setLuots] = useState<LuotThi[] | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  useEffect(() => { listLuotThi(deId).then(setLuots).catch(() => setLuots([])) }, [deId, lamMoi])
  if (!luots || !luots.length) return null
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 font-semibold text-slate-800">Các lượt thi trên app</p>
      <div className="space-y-2">
        {luots.map((l) => (
          <div key={l.id} className="rounded-lg border border-slate-100">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-[13px]">
              <span className="font-medium text-slate-800">{l.lop_ten}</span>
              <span className="text-slate-500">{l.ngay.split('-').reverse().join('/')}</span>
              <span className="text-slate-500">{l.thoi_gian_phut ? `${l.thoi_gian_phut} phút` : 'không giới hạn'}</span>
              <span className="text-slate-500">{l.so_cau} câu</span>
              <span className={`rounded px-1.5 py-0.5 text-[11px] ${l.khoa_reveal ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{l.khoa_reveal ? 'đáp án đang khoá' : 'đã mở đáp án'}</span>
              <button onClick={() => setMo(mo === l.id ? null : l.id)} className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-[12px] text-slate-700 hover:border-indigo-300">{mo === l.id ? 'Ẩn kết quả' : 'Kết quả'}</button>
            </div>
            {mo === l.id && <KetQuaBang luot={l} onKhoa={(k) => setLuots((s) => s?.map((x) => (x.id === l.id ? { ...x, khoa_reveal: k } : x)) ?? s)} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function KetQuaBang({ luot, onKhoa }: { luot: LuotThi; onKhoa: (khoa: boolean) => void }) {
  const [kq, setKq] = useState<KetQuaLuot | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const tai = () => ketQuaLuot(luot.id).then(setKq).catch((e) => setMsg(e.message ?? String(e)))
  useEffect(() => { tai() }, [luot.id]) // eslint-disable-line
  async function thuBai() {
    if (!confirm('Thu bài: mọi bài đang làm dở của lượt này sẽ được nộp + chấm ngay. Tiếp tục?')) return
    setBusy(true)
    try { const n = await thuBaiLuot(luot.id); setMsg(`Đã thu ${n} bài.`); await tai() } catch (e: any) { setMsg(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function doiKhoa() {
    setBusy(true)
    try { await datKhoaDapAn(luot.id, !luot.khoa_reveal); onKhoa(!luot.khoa_reveal) } catch (e: any) { setMsg(e.message ?? String(e)) } finally { setBusy(false) }
  }
  if (!kq) return <p className="px-3 pb-3 text-[12px] text-slate-400">{msg ?? 'Đang tải…'}</p>
  const tt = { chua_lam: 'Chưa làm', dang_lam: 'Đang làm', da_nop: 'Đã nộp' }
  return (
    <div className="border-t border-slate-100 px-3 pb-3 pt-2">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-slate-500">Tối đa {kq.toi_da} đ · quy về thang 10</span>
        {msg && <span className="text-indigo-600">{msg}</span>}
        <button disabled={busy} onClick={thuBai} className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-slate-700 disabled:opacity-40">📥 Thu bài</button>
        <button disabled={busy} onClick={doiKhoa} className={`rounded px-2 py-0.5 font-medium text-white disabled:opacity-40 ${luot.khoa_reveal ? 'bg-emerald-600' : 'bg-slate-500'}`}>{luot.khoa_reveal ? '🔓 Mở đáp án cho HS' : '🔒 Khoá lại'}</button>
      </div>
      <table className="w-full text-[12px]">
        <thead><tr className="text-left text-slate-500">
          <th className="py-1 font-medium">Học sinh</th><th className="font-medium">Trạng thái</th><th className="font-medium">Điểm /10</th>
          {kq.phan.map((p) => <th key={p.phan} className="font-medium">{p.phan || 'Câu'} <span className="text-slate-400">/{p.toi_da}</span></th>)}
        </tr></thead>
        <tbody>
          {kq.hs.map((h) => (
            <tr key={h.hoc_sinh_id} className="border-t border-slate-100">
              <td className="py-1 text-slate-800">{h.ho_ten}</td>
              <td className={h.trang_thai === 'da_nop' ? 'text-emerald-700' : h.trang_thai === 'dang_lam' ? 'text-amber-700' : 'text-slate-400'}>{tt[h.trang_thai]}</td>
              <td className="font-semibold text-slate-800">{h.diem_10 ?? '—'}</td>
              {kq.phan.map((p) => <td key={p.phan} className="text-slate-600">{h.theo_phan ? h.theo_phan[p.phan] ?? 0 : '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
