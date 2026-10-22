// KHO TRÊN LỚP của 1 dạng bài (Đại — Thùy 22/10): 2 chuỗi Bài giảng · Luyện trên lớp. Thêm / sửa / xếp thứ tự / đổi vai /
// bỏ (kho rác) / chép từ kho luyện. Mutation vá tại chỗ (CLAUDE.md §2), không tải lại cả danh sách.
import { useEffect, useState } from 'react'
import { MathText, inp } from './ui'
import { uploadKhoImage } from '../../lib/kho/api'
import { getKhoCau, type KhoCauRow } from '../../lib/kho/banDoMoi'
import {
  cauLopCuaDang, themCauLop, suaCauLop, boCauLop, xepCauLop, chepTuKhoLuyen, NHAN_VAI,
  type CauLop, type CauLopNhap, type VaiLop,
} from '../../lib/kho/khoTrenLop'

const NHAN_LOAI: Record<string, string> = { tu_luan: 'Tự luận', trac_nghiem: 'Trắc nghiệm', tra_loi_ngan: 'Trả lời ngắn', dung_sai: 'Đúng/Sai' }
const VAI: VaiLop[] = ['giang', 'luyen']
const MAU: Record<VaiLop, { dau: string; vien: string; nut: string }> = {
  giang: { dau: 'bg-teal-600', vien: 'border-teal-200', nut: 'text-teal-700 border-teal-300 hover:bg-teal-50' },
  luyen: { dau: 'bg-sky-600', vien: 'border-sky-200', nut: 'text-sky-700 border-sky-300 hover:bg-sky-50' },
}

export default function KhoTrenLopModal({ dangBaiId, ten, onDong }: { dangBaiId: string; ten: string; onDong: (doi: boolean) => void }) {
  const [rows, setRows] = useState<CauLop[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangLam, setDangLam] = useState(false)
  const [soan, setSoan] = useState<{ vai: VaiLop; cau: CauLop | null } | null>(null)   // cau null = thêm mới
  const [chep, setChep] = useState<VaiLop | null>(null)
  const [doi, setDoi] = useState(false)   // có ghi gì ⇒ báo cha tải lại số đếm
  useEffect(() => { setRows(null); cauLopCuaDang(dangBaiId).then(setRows).catch((e) => setLoi(e.message ?? String(e))) }, [dangBaiId])
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape' && !soan && !chep) onDong(doi) }
    window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f)
  }, [soan, chep, doi, onDong])

  const lam = async (viec: () => Promise<void>) => {
    setDangLam(true); setLoi(null)
    try { await viec(); setDoi(true) } catch (e) { setLoi(e instanceof Error ? e.message : String(e)) } finally { setDangLam(false) }
  }
  const chuoi = (vai: VaiLop) => (rows ?? []).filter((r) => r.vai === vai).sort((a, b) => a.thu_tu - b.thu_tu)
  // đặt lại chuỗi `vai` = ds (thứ tự mới) — vá tại chỗ
  const datChuoi = (vai: VaiLop, ds: CauLop[]) => lam(async () => {
    await xepCauLop(dangBaiId, vai, ds.map((x) => x.ma_cau))
    const moi = new Map(ds.map((x, i) => [x.ma_cau, { ...x, vai, thu_tu: i }]))
    setRows((prev) => (prev ?? []).map((r) => moi.get(r.ma_cau) ?? r))
  })
  const doiCho = (vai: VaiLop, i: number, j: number) => { const ds = [...chuoi(vai)]; [ds[i], ds[j]] = [ds[j], ds[i]]; void datChuoi(vai, ds) }
  const doiVai = (c: CauLop) => { const sang: VaiLop = c.vai === 'giang' ? 'luyen' : 'giang'; void datChuoi(sang, [...chuoi(sang), c]) }
  const bo = (c: CauLop) => {
    if (!window.confirm(`Bỏ câu ${c.ma_cau} khỏi kho trên lớp?\n(Câu vào kho rác — tài liệu đã dùng câu này vẫn đọc được.)`)) return
    void lam(async () => { await boCauLop(c.ma_cau); setRows((prev) => (prev ?? []).filter((r) => r.ma_cau !== c.ma_cau)) })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-6" onClick={() => onDong(doi)}>
      <div className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-slate-50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
          <span className="text-[14px] font-semibold text-slate-900">🏫 Kho trên lớp</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-slate-600"><MathText>{ten}</MathText></span>
          {dangLam && <span className="text-[12px] text-slate-400">đang lưu…</span>}
          <span className="text-[11.5px] text-slate-400">Bài giảng + luyện trên lớp · giáo trình chọn từ đây và từ kho luyện</span>
          <button onClick={() => onDong(doi)} className="rounded-md px-2 py-1 text-[13px] text-slate-500 hover:bg-slate-100">✕</button>
        </div>
        {loi && <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-[12.5px] text-rose-700">⚠ {loi}</div>}
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-y-auto p-4">
          {VAI.map((vai) => {
            const ds = chuoi(vai)
            return (
              <div key={vai} className={`flex flex-col overflow-hidden rounded-xl border bg-white ${MAU[vai].vien}`}>
                <div className={`flex items-center gap-2 px-3 py-2 text-white ${MAU[vai].dau}`}>
                  <span className="text-[13.5px] font-semibold">{vai === 'giang' ? '🎓' : '✏️'} {NHAN_VAI[vai]}</span>
                  <span className="text-[11.5px] text-white/80">{rows ? `${ds.length} câu` : ''}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  {!rows && !loi && <div className="text-[12.5px] text-slate-400">Đang tải…</div>}
                  {rows && ds.length === 0 && <div className="text-[12.5px] italic text-slate-400">Chưa có câu — thêm mới hoặc chép từ kho luyện.</div>}
                  {ds.map((c, i) => (
                    <TheCau key={c.ma_cau} c={c} so={i + 1}
                      len={i > 0 ? () => doiCho(vai, i, i - 1) : null} xuong={i < ds.length - 1 ? () => doiCho(vai, i, i + 1) : null}
                      sua={() => setSoan({ vai, cau: c })} doiVai={() => doiVai(c)} bo={() => bo(c)} />
                  ))}
                  <div className="mt-1 flex gap-2">
                    <button onClick={() => setSoan({ vai, cau: null })} className={`flex-1 rounded-md border border-dashed px-3 py-1.5 text-[12.5px] font-medium ${MAU[vai].nut}`}>+ Thêm câu</button>
                    <button onClick={() => setChep(vai)} className="rounded-md border border-slate-300 px-3 py-1.5 text-[12.5px] text-slate-600 hover:bg-slate-50">📥 Chép từ kho luyện</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {soan && (
        <SoanCau vai={soan.vai} cau={soan.cau} onHuy={() => setSoan(null)}
          onLuu={(nhap) => lam(async () => {
            if (soan.cau) { const r = await suaCauLop(soan.cau.ma_cau, nhap); setRows((prev) => (prev ?? []).map((x) => x.ma_cau === r.ma_cau ? r : x)) }
            else { const r = await themCauLop(dangBaiId, soan.vai, nhap); setRows((prev) => [...(prev ?? []), r]) }
            setSoan(null)
          })} />
      )}
      {chep && (
        <ChepTuKho dangBaiId={dangBaiId} vai={chep} daChep={new Set((rows ?? []).map((r) => r.nguon_ma_cau).filter(Boolean) as string[])}
          onHuy={() => setChep(null)}
          onChep={(mas) => lam(async () => { const r = await chepTuKhoLuyen(dangBaiId, chep, mas); setRows((prev) => [...(prev ?? []), ...r]); setChep(null) })} />
      )}
    </div>
  )
}

function TheCau({ c, so, len, xuong, sua, doiVai, bo }: {
  c: CauLop; so: number; len: (() => void) | null; xuong: (() => void) | null; sua: () => void; doiVai: () => void; bo: () => void
}) {
  const chip = (cls: string, t: string) => <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${cls}`}>{t}</span>
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <span className="flex flex-col leading-none">
          <button onClick={len ?? undefined} disabled={!len} className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▲</button>
          <button onClick={xuong ?? undefined} disabled={!xuong} className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▼</button>
        </span>
        <span className="text-[12px] font-bold text-slate-500">{so}.</span>
        <code className="text-[10.5px] text-slate-400">{c.ma_cau}</code>
        {chip('bg-slate-100 text-slate-600', NHAN_LOAI[c.loai_cau] ?? c.loai_cau)}
        {c.nguon_ma_cau && chip('bg-violet-50 text-violet-700', `từ kho luyện ${c.nguon_ma_cau}`)}
        <span className="ml-auto flex items-center gap-2 text-[11.5px]">
          <button onClick={sua} className="text-indigo-600 hover:underline">✎ Sửa</button>
          <button onClick={doiVai} title={c.vai === 'giang' ? 'Chuyển sang Luyện trên lớp' : 'Chuyển sang Bài giảng'} className="text-slate-500 hover:text-indigo-600">⇄</button>
          <button onClick={bo} className="text-slate-400 hover:text-rose-600">✕</button>
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-slate-900"><MathText>{c.noi_dung}</MathText></div>
      {c.anh_de && <img src={c.anh_de} alt="" className="mt-1.5 max-h-40 rounded border border-slate-200" />}
      {c.lua_chon && c.lua_chon.length > 0 && (
        <ul className="mt-1 grid grid-cols-2 gap-x-3 text-[12.5px] text-slate-700">
          {c.lua_chon.map((o, i) => <li key={i} className={c.dap_an === 'ABCD'[i] ? 'font-semibold text-emerald-700' : ''}><b className="mr-1 text-slate-500">{'ABCD'[i]}.</b><MathText>{o}</MathText></li>)}
        </ul>
      )}
      {c.menh_de && c.menh_de.length > 0 && (
        <ul className="mt-1 text-[12.5px] text-slate-700">
          {c.menh_de.map((m, i) => <li key={i}><b className="mr-1 text-slate-500">{'abcd'[i]})</b><MathText>{m.noi_dung ?? ''}</MathText> <span className={m.dap_an === 'D' ? 'text-emerald-600' : 'text-rose-600'}>[{m.dap_an === 'D' ? 'Đ' : 'S'}]</span></li>)}
        </ul>
      )}
      {c.dap_an && c.loai_cau !== 'trac_nghiem' && <div className="mt-1 text-[12px] text-slate-600">Đáp án: <b className="text-emerald-700"><MathText>{c.dap_an}</MathText></b></div>}
      {c.ghi_chu && <div className="mt-1 rounded bg-amber-50 px-2 py-1 text-[12px] text-amber-800">💡 {c.ghi_chu}</div>}
      {(c.loi_giai || c.anh_dap_an) && (
        <details className="mt-1 text-[12px] text-slate-600">
          <summary className="cursor-pointer text-indigo-600">Lời giải</summary>
          {c.loi_giai && <div className="mt-1 whitespace-pre-wrap leading-relaxed"><MathText>{c.loi_giai}</MathText></div>}
          {c.anh_dap_an && <img src={c.anh_dap_an} alt="" className="mt-1 max-h-40 rounded border border-slate-200" />}
        </details>
      )}
    </div>
  )
}

function SoanCau({ vai, cau, onHuy, onLuu }: { vai: VaiLop; cau: CauLop | null; onHuy: () => void; onLuu: (n: CauLopNhap) => void }) {
  const [f, setF] = useState<CauLopNhap>(() => ({
    loai_cau: cau?.loai_cau ?? 'tu_luan', noi_dung: cau?.noi_dung ?? '', lua_chon: cau?.lua_chon ?? null, dap_an: cau?.dap_an ?? null,
    loi_giai: cau?.loi_giai ?? null, anh_de: cau?.anh_de ?? null, anh_dap_an: cau?.anh_dap_an ?? null, ghi_chu: cau?.ghi_chu ?? null, nguon: cau?.nguon ?? null,
  }))
  const [tai, setTai] = useState<string | null>(null)
  const dat = (p: Partial<CauLopNhap>) => setF((x) => ({ ...x, ...p }))
  const tn = f.loai_cau === 'trac_nghiem'
  const lc = f.lua_chon ?? ['', '', '', '']
  const anh = async (k: 'anh_de' | 'anh_dap_an', file: File | undefined) => {
    if (!file) return
    setTai(k)
    try { dat({ [k]: await uploadKhoImage(file) } as Partial<CauLopNhap>) } finally { setTai(null) }
  }
  const thieu = !f.noi_dung.trim() || (tn && (lc.some((x) => !x.trim()) || !f.dap_an))
  const ta = `${inp} min-h-[70px] w-full font-mono text-[12.5px]`
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-6" onClick={(e) => { e.stopPropagation(); onHuy() }}>
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onHuy() } }}>
        <div className={`px-4 py-2.5 text-[14px] font-semibold text-white ${MAU[vai].dau}`}>{cau ? `Sửa ${cau.ma_cau}` : 'Thêm câu'} · {NHAN_VAI[vai]}</div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-y-auto p-4">
          <div className="space-y-2.5">
            <label className="block text-[12px] font-medium text-slate-600">Loại câu
              <select value={f.loai_cau} onChange={(e) => dat({ loai_cau: e.target.value as CauLopNhap['loai_cau'], lua_chon: e.target.value === 'trac_nghiem' ? lc : null })} className={`${inp} mt-1 h-8 w-full`}>
                <option value="tu_luan">Tự luận</option><option value="tra_loi_ngan">Trả lời ngắn</option><option value="trac_nghiem">Trắc nghiệm</option>
              </select>
            </label>
            <label className="block text-[12px] font-medium text-slate-600">Đề bài (LaTeX trong $…$)
              <textarea autoFocus value={f.noi_dung} onChange={(e) => dat({ noi_dung: e.target.value })} className={`${ta} mt-1 min-h-[110px]`} />
            </label>
            {tn && (
              <div className="space-y-1">
                {lc.map((o, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <label className="flex items-center gap-1 text-[12px]"><input type="radio" checked={f.dap_an === 'ABCD'[i]} onChange={() => dat({ dap_an: 'ABCD'[i] })} /><b>{'ABCD'[i]}</b></label>
                    <input value={o} onChange={(e) => dat({ lua_chon: lc.map((x, j) => (j === i ? e.target.value : x)) })} className={`${inp} h-8 flex-1 font-mono text-[12.5px]`} />
                  </div>
                ))}
                <div className="text-[11px] text-slate-400">Chấm tròn = đáp án đúng.</div>
              </div>
            )}
            {!tn && (
              <label className="block text-[12px] font-medium text-slate-600">Đáp án / đáp số (tuỳ chọn)
                <input value={f.dap_an ?? ''} onChange={(e) => dat({ dap_an: e.target.value || null })} className={`${inp} mt-1 h-8 w-full font-mono text-[12.5px]`} />
              </label>
            )}
            <label className="block text-[12px] font-medium text-slate-600">Lời giải
              <textarea value={f.loi_giai ?? ''} onChange={(e) => dat({ loi_giai: e.target.value || null })} className={`${ta} mt-1 min-h-[120px]`} />
            </label>
            <label className="block text-[12px] font-medium text-slate-600">💡 Ghi chú cho GV (dẫn dắt, ý đồ của câu trong chuỗi)
              <textarea value={f.ghi_chu ?? ''} onChange={(e) => dat({ ghi_chu: e.target.value || null })} className={`${inp} mt-1 min-h-[50px] w-full text-[12.5px]`} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['anh_de', 'anh_dap_an'] as const).map((k) => (
                <label key={k} className="block text-[12px] font-medium text-slate-600">{k === 'anh_de' ? 'Hình đề' : 'Hình lời giải'}
                  <input type="file" accept="image/*" onChange={(e) => void anh(k, e.target.files?.[0])} className="mt-1 block w-full text-[11px]" />
                  {tai === k && <span className="text-[11px] text-slate-400">đang tải lên…</span>}
                  {f[k] && <span className="mt-1 flex items-center gap-1"><img src={f[k]!} alt="" className="max-h-16 rounded border" /><button onClick={() => dat({ [k]: null } as Partial<CauLopNhap>)} className="text-[11px] text-rose-500">bỏ</button></span>}
                </label>
              ))}
            </div>
            <label className="block text-[12px] font-medium text-slate-600">Nguồn (sách / tài liệu — tuỳ chọn)
              <input value={f.nguon ?? ''} onChange={(e) => dat({ nguon: e.target.value || null })} className={`${inp} mt-1 h-8 w-full text-[12.5px]`} />
            </label>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Xem trước</div>
            <div className="text-[13.5px] leading-relaxed"><MathText>{f.noi_dung || '…'}</MathText></div>
            {f.anh_de && <img src={f.anh_de} alt="" className="mt-1.5 max-h-48 rounded border" />}
            {tn && <ul className="mt-1 grid grid-cols-2 gap-x-3 text-[13px]">{lc.map((o, i) => <li key={i} className={f.dap_an === 'ABCD'[i] ? 'font-semibold text-emerald-700' : ''}><b className="mr-1">{'ABCD'[i]}.</b><MathText>{o}</MathText></li>)}</ul>}
            {!tn && f.dap_an && <div className="mt-1 text-[12.5px]">Đáp án: <b><MathText>{f.dap_an}</MathText></b></div>}
            {f.loi_giai && <div className="mt-2 border-t border-slate-200 pt-2 text-[12.5px] leading-relaxed text-slate-700 whitespace-pre-wrap"><MathText>{f.loi_giai}</MathText></div>}
            {f.anh_dap_an && <img src={f.anh_dap_an} alt="" className="mt-1.5 max-h-48 rounded border" />}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-2.5">
          {thieu && <span className="mr-auto text-[12px] text-slate-400">{!f.noi_dung.trim() ? 'Cần nhập đề bài.' : 'Trắc nghiệm cần đủ 4 phương án và chọn đáp án.'}</span>}
          <button onClick={onHuy} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={() => onLuu({ ...f, lua_chon: tn ? lc : null })} disabled={thieu || !!tai} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Lưu</button>
        </div>
      </div>
    </div>
  )
}

function ChepTuKho({ dangBaiId, vai, daChep, onHuy, onChep }: { dangBaiId: string; vai: VaiLop; daChep: Set<string>; onHuy: () => void; onChep: (mas: string[]) => void }) {
  const [rows, setRows] = useState<KhoCauRow[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [chon, setChon] = useState<string[]>([])   // thứ tự bấm = thứ tự chép
  useEffect(() => { getKhoCau('dang_bai', dangBaiId, 'tat_ca', 200, 0).then(setRows).catch((e) => setLoi(e.message ?? String(e))) }, [dangBaiId])
  const bat = (m: string) => setChon((x) => (x.includes(m) ? x.filter((y) => y !== m) : [...x, m]))
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-6" onClick={(e) => { e.stopPropagation(); onHuy() }}>
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5">
          <span className="text-[14px] font-semibold text-slate-900">📥 Chép từ kho luyện → {NHAN_VAI[vai]}</span>
          <span className="text-[12px] text-slate-400">Câu chép là câu MỚI của kho trên lớp (sửa thoải mái, không đụng câu gốc).</span>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
          {loi && <div className="rounded bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
          {!rows && !loi && <div className="text-[12.5px] text-slate-400">Đang tải…</div>}
          {rows && rows.length === 0 && <div className="py-6 text-center text-[13px] text-slate-400">Dạng bài này chưa có câu nào ở kho luyện.</div>}
          {rows?.map((r) => {
            const i = chon.indexOf(r.ma_cau)
            return (
              <label key={r.ma_cau} className={`flex cursor-pointer gap-2.5 rounded-lg border p-2.5 ${i >= 0 ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}>
                <input type="checkbox" checked={i >= 0} onChange={() => bat(r.ma_cau)} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                    {i >= 0 && <b className="rounded bg-indigo-600 px-1.5 text-white">{i + 1}</b>}
                    <code className="text-slate-400">{r.ma_cau}</code>
                    <span className="rounded bg-slate-100 px-1.5 text-slate-600">{NHAN_LOAI[r.loai_cau] ?? r.loai_cau}</span>
                    {r.kho_chuan ? <span className="text-emerald-600">kho chuẩn</span> : !r.da_duyet && <span className="text-amber-600">chưa duyệt</span>}
                    {daChep.has(r.ma_cau) && <span className="rounded bg-violet-50 px-1.5 text-violet-700">đã chép rồi</span>}
                  </div>
                  <div className="text-[13px] leading-relaxed"><MathText>{r.noi_dung}</MathText></div>
                  {r.anh_de && <img src={r.anh_de} alt="" className="mt-1 max-h-32 rounded border" />}
                </div>
              </label>
            )
          })}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-2.5">
          <span className="mr-auto text-[12px] text-slate-500">{chon.length ? `Chép ${chon.length} câu (theo thứ tự đã bấm)` : 'Chọn câu muốn chép'}</span>
          <button onClick={onHuy} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={() => onChep(chon)} disabled={!chon.length} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">Chép</button>
        </div>
      </div>
    </div>
  )
}
