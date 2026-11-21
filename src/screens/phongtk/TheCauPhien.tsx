// THẺ CÂU trong khung chat Phiên Claude (spec-quan-ly-chat-luong §6.5): Claude trả khối ```bkcau / ```bkclone,
// màn vẽ thành thẻ có nút 📋 Copy · 📥 Vào kho · 🧬 Clone · Duyệt & vào kho. Người mở phiên bấm = người duyệt.
// Mọi ghi kho đi qua DB (fn_phien_chat_vao_kho) — màn không tự tính/ghi gì ngoài việc gọi hàm đó.
import { useState } from 'react'
import { vaoKho, type VaoKhoCau } from '../../lib/phien'
import { LoiGiaiXem, MathText } from '../kho/ui'
import ChuPhien from './ChuPhien'
import { NutBaoSai } from '../../components/BaoSaiCau'

export type TheCauData = {
  id: string; loai_cau: string; noi_dung: string; lua_chon?: string[] | null; dap_an?: string | null; loi_giai?: string | null
  dang?: { dang_bai_id: string; ten: string; chac: 'cao' | 'vua'; ly_do?: string } | null; da_thu?: boolean; ghi_chu?: string[]
}
export type BienThe = { loai_cau: string; noi_dung: string; lua_chon?: string[] | null; dap_an?: string | null; loi_giai?: string | null; da_thu?: boolean }
export type CloneData = { goc: string; bien_the: BienThe[] }
export type Khoi = { k: 'chu'; s: string } | { k: 'cau'; d: TheCauData } | { k: 'clone'; d: CloneData } | { k: 'dang' }

// Tách chữ Claude thành chữ + thẻ. Khối chưa đóng (Claude đang viết) → "đang soạn thẻ"; JSON hỏng → giữ nguyên chữ.
export function tachKhoi(text: string): Khoi[] {
  const ra: Khoi[] = []
  const re = /```bk(cau|clone)[ \t]*\r?\n([\s\S]*?)\r?\n?```/g
  let i = 0, m: RegExpExecArray | null
  const chu = (s: string) => { if (s.trim()) ra.push({ k: 'chu', s }) }
  while ((m = re.exec(text))) {
    chu(text.slice(i, m.index))
    try { ra.push(m[1] === 'cau' ? { k: 'cau', d: JSON.parse(m[2]) } : { k: 'clone', d: JSON.parse(m[2]) }) }
    catch { ra.push({ k: 'chu', s: `(thẻ ${m[1]} sai định dạng — nhắn Claude gửi lại)` }) }
    i = m.index + m[0].length
  }
  const duoi = text.slice(i), mo = duoi.indexOf('```bk')
  if (mo >= 0) { chu(duoi.slice(0, mo)); ra.push({ k: 'dang' }) } else chu(duoi)
  return ra
}

// Trạng thái từng thẻ (mã câu đã vào kho…) sống ở module tới F5 — bấm lại vẫn an toàn vì DB dedupe theo nội dung.
const TT = new Map<string, { maCau?: string; duyet?: boolean }>()
const khoa = (phienId: string, id: string) => `${phienId}:${id}`

const LOAI: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận', dung_sai: 'Đúng/Sai' }
const toItem = (c: { loai_cau: string; noi_dung: string; lua_chon?: string[] | null; dap_an?: string | null; loi_giai?: string | null }, dang?: TheCauData['dang']): VaoKhoCau => ({
  loai_cau: c.loai_cau, noi_dung: c.noi_dung, lua_chon: c.lua_chon ?? null, dap_an: c.dap_an ?? null, loi_giai: c.loi_giai ?? null,
  ten_de_goc: 'Giải bài từ ảnh (phiên Claude)',
  ...(dang?.dang_bai_id ? { phan: { ket_qua: dang.chac, dang_bai_id: dang.dang_bai_id, ly_do: dang.ly_do || 'Claude phân vân giữa các dạng — xem ghi chú' } } : {}),
})
const vanBanCau = (c: { noi_dung: string; lua_chon?: string[] | null; dap_an?: string | null; loi_giai?: string | null }) =>
  [c.noi_dung, ...(c.lua_chon ?? []).map((x, i) => `${'ABCD'[i] ?? i + 1}. ${x}`), c.dap_an ? `Đáp án: ${c.dap_an}` : '', '', c.loi_giai ?? ''].join('\n').trim()

async function copy(s: string, bao: (m: string) => void) {
  try { await navigator.clipboard.writeText(s); bao('Đã copy ✓') } catch { bao('Không copy được — trình duyệt chặn') }
}

function Nut({ children, onClick, disabled, tone = 'slate' }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; tone?: 'slate' | 'indigo' | 'emerald' }) {
  const c = { slate: 'border-slate-200 text-slate-700 hover:bg-slate-50', indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100', emerald: 'border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700' }[tone]
  return <button type="button" onClick={onClick} disabled={disabled} className={`rounded-lg border px-2.5 py-1 text-[12.5px] font-medium disabled:cursor-not-allowed disabled:opacity-40 ${c}`}>{children}</button>
}

function DongThu({ daThu }: { daThu?: boolean }) {
  return daThu ? <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">✔ đã thử đáp số bằng máy</span>
    : <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">⚠ chưa thử bằng máy</span>
}

export function TheCau({ phienId, d, mo, onGui, onNhap }: {
  phienId: string; d: TheCauData; mo: boolean
  onGui: (nd: string) => Promise<void>; onNhap: (nd: string) => void
}) {
  const k = khoa(phienId, d.id)
  const [tt, setTt] = useState(TT.get(k) ?? {})
  const [busy, setBusy] = useState(false)
  const [bao, setBao] = useState('')
  const [soBt, setSoBt] = useState(3)
  const [xem, setXem] = useState(false)
  const bao1 = (m: string) => { setBao(m); setTimeout(() => setBao(''), 2500) }
  const chac = d.dang?.chac === 'cao'
  const dungSai = d.loai_cau === 'dung_sai'

  async function vao() {
    setBusy(true); setBao('')
    try {
      const kq = await vaoKho(phienId, [toItem(d, d.dang)], chac)
      const r = kq.ket_qua[0]
      if (!r?.ok) { setBao(r?.loi ?? 'Không ghi được.'); return }
      const moi = { maCau: r.ma_cau, duyet: chac && (kq.duyet?.ok ?? 0) > 0 }
      TT.set(k, moi); setTt(moi)
      bao1(r.trung ? `Câu đã có trong kho: ${r.ma_cau}` : `Đã vào kho: ${r.ma_cau}${moi.duyet ? ' · đã duyệt' : ' · chờ duyệt'}`)
    } catch (e: any) { setBao(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function clone() {
    setBusy(true)
    try { await onGui(`Clone câu ${d.id} thành ${soBt} biến thể.`) } catch (e: any) { setBao(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="my-2 rounded-xl border border-indigo-200 bg-white p-3 shadow-sm">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[12px]">
        <span className="rounded bg-indigo-600 px-1.5 py-0.5 font-semibold text-white">Câu {d.id}</span>
        <span className="text-slate-500">{LOAI[d.loai_cau] ?? d.loai_cau}</span>
        <DongThu daThu={d.da_thu} />
        {tt.maCau && <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700">📥 {tt.maCau}{tt.duyet ? ' · đã duyệt' : ' · chờ duyệt'}</span>}
        {tt.maCau && <NutBaoSai maCau={tt.maCau} />}
      </div>
      <div className="mb-1.5 text-[12.5px] text-slate-600">
        {d.dang?.dang_bai_id
          ? <>Dạng: <b className="text-slate-800">{d.dang.ten}</b> <span className={chac ? 'text-emerald-700' : 'text-amber-700'}>({chac ? 'chắc' : 'chưa chắc — vào hàng duyệt'})</span>{d.dang.ly_do ? <span className="text-slate-400"> · {d.dang.ly_do}</span> : null}</>
          : <span className="text-amber-700">Chưa khớp dạng nào{d.dang?.ly_do ? ` — ${d.dang.ly_do}` : ''} (vào kho sẽ nằm ở “dạng chờ”)</span>}
        {mo && <button type="button" onClick={() => onNhap(`Đổi câu ${d.id} sang dạng: `)} className="ml-2 text-indigo-600 hover:underline">Đổi dạng</button>}
      </div>
      <MathText className="text-[13.5px] text-slate-800">{d.noi_dung}</MathText>
      {d.lua_chon?.length ? <div className="mt-1 text-[13px] text-slate-700">{d.lua_chon.map((x, i) => <div key={i}>{'ABCD'[i] ?? i + 1}. <MathText className="inline">{x}</MathText></div>)}</div> : null}
      {d.dap_an ? <div className="mt-1 text-[13px]"><b>Đáp án:</b> <MathText className="inline">{d.dap_an}</MathText></div> : null}
      {d.loi_giai ? (
        <div className="mt-1.5">
          <button type="button" onClick={() => setXem(!xem)} className="text-[12px] font-medium text-indigo-600 hover:underline">{xem ? '▾ Ẩn lời giải' : '▸ Xem lời giải'}</button>
          {xem && <LoiGiaiXem raw={d.loi_giai} className="mt-1" />}
        </div>
      ) : null}
      {d.ghi_chu?.length ? <ul className="mt-1.5 list-disc pl-5 text-[12px] text-amber-800">{d.ghi_chu.map((g, i) => <li key={i}>{g}</li>)}</ul> : null}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Nut onClick={() => copy(d.loi_giai ?? '', bao1)} disabled={!d.loi_giai}>📋 Copy lời giải</Nut>
        <Nut onClick={() => copy(vanBanCau(d), bao1)}>📋 Copy cả câu</Nut>
        <Nut tone="indigo" onClick={vao} disabled={!mo || busy || dungSai}>{busy ? 'Đang ghi…' : chac ? '📥 Vào kho (duyệt luôn)' : '📥 Vào kho (chờ duyệt)'}</Nut>
        {dungSai && <span className="text-[11.5px] text-slate-400">Đúng/Sai: vào kho ở phiên Nhập kho</span>}
        {!dungSai && (
          <span className="inline-flex items-center gap-1">
            <Nut onClick={clone} disabled={!mo || busy}>🧬 Clone</Nut>
            <input type="number" min={1} max={8} value={soBt} onChange={(e) => setSoBt(Math.min(8, Math.max(1, Number(e.target.value) || 1)))}
              className="w-12 rounded border border-slate-200 px-1 py-0.5 text-[12px]" title="Số biến thể" />
          </span>
        )}
        {bao && <span className="text-[12px] text-slate-500">{bao}</span>}
      </div>
    </div>
  )
}

export function TheClone({ phienId, d, cacThe, mo }: { phienId: string; d: CloneData; cacThe: Map<string, TheCauData>; mo: boolean }) {
  const goc = cacThe.get(d.goc)
  const [chon, setChon] = useState<boolean[]>(() => d.bien_the.map((b) => b.da_thu !== false))
  const [ma, setMa] = useState<(string | null)[]>(() => d.bien_the.map((_, i) => TT.get(khoa(phienId, `${d.goc}~${i}~${d.bien_the[i].noi_dung.slice(0, 40)}`))?.maCau ?? null))
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState('')
  const [bao, setBao] = useState('')

  async function duyet() {
    const idx = d.bien_the.map((_, i) => i).filter((i) => chon[i] && !ma[i])
    if (!idx.length || busy) return
    setBusy(true); setLoi(''); setBao('')
    try {
      // Gốc phải nằm trong kho trước (bản clone đi theo gốc). Chưa vào thì đưa vào (idempotent theo nội dung), duyệt luôn nếu dạng chắc.
      let maGoc = TT.get(khoa(phienId, d.goc))?.maCau
      if (!maGoc) {
        if (!goc) throw new Error(`Không thấy thẻ câu gốc ${d.goc} trong phiên này.`)
        const rg = await vaoKho(phienId, [toItem(goc, goc.dang)], goc.dang?.chac === 'cao')
        const r0 = rg.ket_qua[0]
        if (!r0?.ok || !r0.ma_cau) throw new Error(`Câu gốc ${d.goc} chưa vào kho được: ${r0?.loi ?? 'lỗi'}`)
        maGoc = r0.ma_cau; TT.set(khoa(phienId, d.goc), { maCau: maGoc, duyet: goc.dang?.chac === 'cao' })
      }
      const kq = await vaoKho(phienId, idx.map((i) => ({ ...toItem(d.bien_the[i]), parent_ma_cau: maGoc })), true)
      const moi = ma.slice(); let sai = 0
      kq.ket_qua.forEach((r, j) => {
        if (r.ok && r.ma_cau) { moi[idx[j]] = r.ma_cau; TT.set(khoa(phienId, `${d.goc}~${idx[j]}~${d.bien_the[idx[j]].noi_dung.slice(0, 40)}`), { maCau: r.ma_cau, duyet: true }) }
        else sai++
      })
      setMa(moi)
      const loiDau = kq.ket_qua.find((r) => !r.ok)?.loi
      setBao(`Đã duyệt & vào kho ${idx.length - sai} biến thể (gốc ${maGoc}).`)
      if (sai) setLoi(`${sai} biến thể lỗi: ${loiDau ?? ''}`)
    } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusy(false) }
  }

  const soChon = d.bien_the.filter((_, i) => chon[i] && !ma[i]).length
  return (
    <div className="my-2 rounded-xl border border-violet-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px]">
        <span className="rounded bg-violet-600 px-1.5 py-0.5 font-semibold text-white">🧬 Clone câu {d.goc}</span>
        <span className="text-slate-500">{d.bien_the.length} biến thể — xem, tích chọn rồi duyệt ngay tại đây</span>
      </div>
      <div className="space-y-2">
        {d.bien_the.map((b, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-2">
            <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[12px]">
              <label className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <input type="checkbox" checked={!!ma[i] || chon[i]} disabled={!!ma[i] || !mo} onChange={(e) => setChon((p) => p.map((v, j) => (j === i ? e.target.checked : v)))} />
                Biến thể {i + 1}
              </label>
              <DongThu daThu={b.da_thu} />
              {ma[i] && <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700">✓ {ma[i]} · đã duyệt</span>}
            </div>
            <MathText className="text-[13.5px] text-slate-800">{b.noi_dung}</MathText>
            {b.lua_chon?.length ? <div className="mt-1 text-[13px]">{b.lua_chon.map((x, j) => <div key={j}>{'ABCD'[j] ?? j + 1}. <MathText className="inline">{x}</MathText></div>)}</div> : null}
            {b.dap_an ? <div className="mt-1 text-[13px]"><b>Đáp án:</b> <MathText className="inline">{b.dap_an}</MathText></div> : null}
            {b.loi_giai ? <details className="mt-1"><summary className="cursor-pointer text-[12px] font-medium text-indigo-600">Xem lời giải</summary><LoiGiaiXem raw={b.loi_giai} className="mt-1" /></details> : null}
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Nut tone="emerald" onClick={duyet} disabled={!mo || busy || soChon === 0}>{busy ? 'Đang ghi…' : `✔ Duyệt & vào kho (${soChon})`}</Nut>
        <Nut onClick={() => copy(d.bien_the.filter((_, i) => chon[i]).map((b, i) => `Biến thể ${i + 1}\n${vanBanCau(b)}`).join('\n\n---\n\n'), setBao)}>📋 Copy các biến thể đã chọn</Nut>
        {bao && <span className="text-[12px] text-emerald-700">{bao}</span>}
        {loi && <span className="text-[12px] text-red-600">{loi}</span>}
      </div>
    </div>
  )
}

// Nội dung một tin Claude: chữ + thẻ.
export function NoiDungClaude({ phienId, text, cacThe, mo, onGui, onNhap }: {
  phienId: string; text: string; cacThe: Map<string, TheCauData>; mo: boolean; onGui: (nd: string) => Promise<void>; onNhap: (nd: string) => void
}) {
  return (
    <>
      {tachKhoi(text).map((b, i) => b.k === 'chu' ? <ChuPhien key={i} text={b.s} />
        : b.k === 'cau' ? <TheCau key={i} phienId={phienId} d={b.d} mo={mo} onGui={onGui} onNhap={onNhap} />
        : b.k === 'clone' ? <TheClone key={i} phienId={phienId} d={b.d} cacThe={cacThe} mo={mo} />
        : <div key={i} className="my-1 animate-pulse text-[12px] text-indigo-500">Claude đang soạn thẻ câu…</div>)}
    </>
  )
}
