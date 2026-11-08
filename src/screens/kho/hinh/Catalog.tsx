// M6 — Dạng bài (2 tầng: loại câu hỏi › cách xử lý) · M7 — Bổ đề (danh mục PHẲNG).
// Thùy 19/10: nay là NHÃN dán cho TỪNG Ý của kho Luyện (hinh_y_dang / hinh_y_bo_de) — nhãn lớp dưới dùng được cho ý lớp trên.
// (Trước 19/10 gắn ở cách giải của bài toán nhỏ — liên kết cũ giữ nguyên, kho cũ thôi sửa.)
//
// Tra ngược = giá trị chính của hai màn này: chọn 1 dạng/bổ đề → thấy các bài toán nhỏ
// dùng nó, kèm tag mô hình → một dạng trải nhiều họ.
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { Btn, Cap, Empty, Ma, OcrButton, Panel, Sol, Tag, inpCls } from './hinhUi'
import { LyThuyetModal } from '../BanDo'

// Lý thuyết đã có hay chưa → chấm tròn nhỏ trước tên dạng (như % ở Đại, nhưng gọn).
type LtMap = Record<string, { noi_dung: string; file_url: string | null }>
const coLt = (m: LtMap, id: string) => !!(m[id]?.noi_dung?.trim() || m[id]?.file_url)

export default function Catalog({ L, khoi, loai, reload }: { L: Luoi; khoi: string; loai: 'dang' | 'bode'; reload: () => Promise<void> }) {
  return loai === 'dang' ? <MDang L={L} khoi={khoi} reload={reload} /> : <MBoDe L={L} khoi={khoi} reload={reload} />
}

// ══════════════════ M6 — DẠNG BÀI ══════════════════
function MDang({ L, khoi, reload }: { L: Luoi; khoi: string; reload: () => Promise<void> }) {
  const [chon, setChon] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState<{ id?: string; cap: 'loai_ch' | 'dang'; cha?: string | null } | null>(null)
  const nd = useNoiDung(api.hinhDangLyThuyet, api.hinhDangViDu)
  const [soan, setSoan] = useState<{ loai: 'lt' | 'vd'; id: string; lan: number } | null>(null)

  const theo = useMemo(() => api.baiToanTheoDang(L), [L])
  const rollup = useMemo(() => api.demTheoDangRollup(L), [L])
  const loaiCh = L.dang.filter((d) => d.cap === 'loai_ch')
  const laMatch = (ten: string) => !q.trim() || ten.toLowerCase().includes(q.toLowerCase())
  const d = chon ? L.dang.find((x) => x.id === chon) : null
  // Terminal dạng = lá: cách xử lý, hoặc loại câu hỏi CHƯA tách con (chính nó là dạng). Lý thuyết gắn ở đây.
  const laTerminal = (id: string) => !L.dang.some((x) => x.cha_id === id)

  const RowDang = ({ id, ten, ton }: { id: string; ten: string; ton: 'dg' | 'loai' }) => (
    <button onClick={() => setChon(id)}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${chon === id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
      <Cham3 moTa={!!L.dang.find((x) => x.id === id)?.mo_ta?.trim()} lt={coLt(nd.lt, id)} vd={coLt(nd.vd, id)} />
      {ton === 'dg' ? <Tag ton="dg">… {ten}</Tag> : <span className="text-[12.5px] font-medium text-slate-700">{ten}</span>}
      <span className="flex-1" />
      <Ma>{theo.get(id)?.length ?? 0} bài toán</Ma>
    </button>
  )

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Danh sách dạng bài</h1>
        <Btn kind="pri" onClick={() => setForm({ cap: 'loai_ch' })}>＋ Loại câu hỏi</Btn>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Hai tầng: <b>loại câu hỏi › cách xử lý</b>. Dán cho <b>từng ý</b> ở tab ③ Kho bài (Hình – Luyện); ý lớp trên dùng được nhãn lớp dưới. Mỗi dạng có <b>mô tả · lý thuyết · ví dụ</b> (3 chấm <span className="text-emerald-600">●</span><span className="text-sky-600">●</span><span className="text-violet-600">●</span> = đã có).
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <Panel>
          <input className={`${inpCls} mb-3`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng…" />
          {!loaiCh.length && <Empty icon="⌥">Chưa có loại câu hỏi nào. Vd: <i>Chứng minh tứ giác nội tiếp</i> › <i>hai đỉnh cùng nhìn một cạnh</i>.</Empty>}
          {loaiCh.map((lc) => {
            const con = L.dang.filter((x) => x.cha_id === lc.id)
            if (q.trim() && !laMatch(lc.ten) && !con.some((c) => laMatch(c.ten))) return null
            const terminal = con.length === 0   // loại chưa tách con → chính nó là dạng chọn được
            return (
              <div key={lc.id} className="mb-1 border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                {terminal ? (
                  <div className="group flex items-center gap-1">
                    <div className="flex-1"><RowDang id={lc.id} ten={lc.ten} ton="loai" /></div>
                    <span className="hidden gap-1 group-hover:flex">
                      <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ cap: 'dang', cha: lc.id })}>＋ tách</Btn>
                    </span>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2 px-2 py-1 text-[12px] font-semibold text-slate-700">
                    <span className="flex-1">{lc.ten} <span className="font-normal text-slate-400">· {rollup.get(lc.id) ?? 0}</span></span>
                    <span className="hidden gap-1 group-hover:flex">
                      <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: lc.id, cap: 'loai_ch' })}>✎</Btn>
                      <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ cap: 'dang', cha: lc.id })}>＋ dạng</Btn>
                    </span>
                  </div>
                )}
                {con.filter((c) => laMatch(c.ten) || laMatch(lc.ten)).map((c) => (
                  <RowDang key={c.id} id={c.id} ten={c.ten} ton="dg" />
                ))}
              </div>
            )
          })}
        </Panel>

        <Panel label="Tra ngược — dạng đang chọn">
          {!d ? <div className="py-6 text-center text-[12.5px] text-slate-400">Chọn một dạng ở cột trái.</div> : (
            <>
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-slate-900">{api.tenDangDayDu(L, d.id)}</div>
                <div className="flex shrink-0 gap-1">
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: d.id, cap: d.cap, cha: d.cha_id })}>✎</Btn>
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={async () => {
                    if (!confirm(`Xoá dạng "${d.ten}"?`)) return
                    try { await api.deleteDang(d.id); setChon(null); await reload() } catch (e: any) { alert(e.message) }
                  }}>🗑</Btn>
                </div>
              </div>

              {/* Mô tả · Lý thuyết · Ví dụ của dạng (chỉ ở TERMINAL dạng = nhãn dán được) */}
              {laTerminal(d.id) && (
                <KhoiNoiDung id={d.id} moTa={d.mo_ta ?? ''} lt={nd.lt} vd={nd.vd}
                  onLuuMoTa={async (m) => { try { await api.updateDang(d.id, { mo_ta: m }); await reload() } catch (e: any) { alert(e.message) } }}
                  onMo={(loai) => setSoan({ loai, id: d.id, lan: Date.now() })} />
              )}

              <DsBaiToan L={L} ds={theo.get(d.id) ?? []} />
              {d.cha_id && (
                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
                  <b className="text-blue-700">Rollup:</b> đọc ở tầng trên (<i>{L.dang.find((x) => x.id === d.cha_id)?.ten}</i>, {rollup.get(d.cha_id ?? '') ?? 0} bài toán)
                  = mẫu lớn, tín hiệu chắc. Đọc ở lá này = mẫu nhỏ, chẩn đoán, <b>dè dặt</b>.
                </div>
              )}
            </>
          )}
        </Panel>
      </div>

      {form && <FormDang L={L} khoi={khoi} init={form} onClose={() => setForm(null)} onDone={reload} />}
      {soan && (
        <SoanNoiDung ds={loaiCh.flatMap((lc) => { const con = L.dang.filter((x) => x.cha_id === lc.id); return con.length ? con : [lc] })
            .map((x) => ({ id: x.id, ten: api.tenDangDayDu(L, x.id), moTa: x.mo_ta ?? '' }))}
          dang={soan} lt={nd.lt} vd={nd.vd} apiLt={api.hinhDangLyThuyet} apiVd={api.hinhDangViDu as any}
          onDi={(loai, id) => { setChon(id); setSoan({ loai, id, lan: Date.now() }) }} onDong={() => setSoan(null)}
          onDaLuu={() => { nd.nap(); setSoan((s) => (s ? { ...s, lan: Date.now() } : s)) }} />
      )}
    </>
  )
}

// ══════════════════ M7 — BỔ ĐỀ ══════════════════
function MBoDe({ L, khoi, reload }: { L: Luoi; khoi: string; reload: () => Promise<void> }) {
  const [chon, setChon] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState<{ id?: string } | null>(null)
  const nd = useNoiDung(api.hinhBoDeLyThuyet, api.hinhBoDeViDu as any)
  const [soan, setSoan] = useState<{ loai: 'lt' | 'vd'; id: string; lan: number } | null>(null)
  const theo = useMemo(() => api.baiToanTheoBoDe(L), [L])
  const b = chon ? L.boDe.find((x) => x.id === chon) : null

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Danh sách bổ đề</h1>
        <Btn kind="pri" onClick={() => setForm({})}>＋ Bổ đề</Btn>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Danh mục <b>phẳng</b>. Bổ đề = <b>mối nối</b> bắc cầu giữa nửa-xuôi (giả thiết) và nửa-ngược (câu hỏi) —
        nhãn chẩn đoán, <b>không phải trục đo ngang hàng</b> với mô hình và dạng. Có bổ đề ⇒ độ khó +1 bậc.
        Mỗi bổ đề có <b>mô tả · lý thuyết · ví dụ</b> (bóc từ ảnh/PDF; 3 chấm <span className="text-emerald-600">●</span><span className="text-sky-600">●</span><span className="text-violet-600">●</span> = đã có).
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <Panel>
          <input className={`${inpCls} mb-3`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm bổ đề…" />
          {!L.boDe.length && <Empty icon="◦">Chưa có bổ đề nào. Vd: <i>Hệ thức lượng trong tam giác vuông</i>, <i>Phương tích</i>.</Empty>}
          {L.boDe.filter((x) => !q.trim() || x.ten.toLowerCase().includes(q.toLowerCase())).map((x) => (
            <button key={x.id} onClick={() => setChon(x.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${chon === x.id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
              <Cham3 moTa={!!x.mo_ta?.trim()} lt={coLt(nd.lt, x.id)} vd={coLt(nd.vd, x.id)} />
              <Tag ton="bd">◦ {x.ten}</Tag>
              <span className="flex-1" />
              <Ma>{theo.get(x.id)?.length ?? 0} bài toán</Ma>
            </button>
          ))}
        </Panel>

        <Panel label="Tra ngược — bổ đề đang chọn">
          {!b ? <div className="py-6 text-center text-[12.5px] text-slate-400">Chọn một bổ đề ở cột trái.</div> : (
            <>
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-slate-900">◦ {b.ten}</div>
                <div className="flex shrink-0 gap-1">
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: b.id })}>✎</Btn>
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={async () => {
                    if (!confirm(`Xoá bổ đề "${b.ten}"?`)) return
                    try { await api.deleteBoDe(b.id); setChon(null); await reload() } catch (e: any) { alert(e.message) }
                  }}>🗑</Btn>
                </div>
              </div>
              <Sol className="mb-3">{b.phat_bieu}</Sol>

              {/* Mô tả · Lý thuyết · Ví dụ của bổ đề — tái dùng editor lý thuyết của Đại (bóc ảnh/PDF) */}
              <KhoiNoiDung id={b.id} moTa={b.mo_ta ?? ''} lt={nd.lt} vd={nd.vd}
                onLuuMoTa={async (m) => { try { await api.updateBoDe(b.id, { mo_ta: m }); await reload() } catch (e: any) { alert(e.message) } }}
                onMo={(loai) => setSoan({ loai, id: b.id, lan: Date.now() })} />

              <DsBaiToan L={L} ds={theo.get(b.id) ?? []} />
              <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-2 text-[11.5px] leading-relaxed text-amber-800">
                <b>Cổng đọc theo bậc:</b> mô hình đọc được luôn → dạng đọc khi mô hình đã sạch →
                <b> bổ đề đọc khi cả hai đã sạch</b>. Trước đó, sai một bài có bổ đề chưa kết luận gì về bổ đề.
              </div>
            </>
          )}
        </Panel>
      </div>

      {form && <FormBoDe L={L} khoi={khoi} id={form.id} onClose={() => setForm(null)} onDone={reload} />}
      {soan && (
        <SoanNoiDung ds={L.boDe.map((x) => ({ id: x.id, ten: x.ten, moTa: x.mo_ta ?? '' }))}
          dang={soan} lt={nd.lt} vd={nd.vd} apiLt={api.hinhBoDeLyThuyet} apiVd={api.hinhBoDeViDu as any}
          onDi={(loai, id) => { setChon(id); setSoan({ loai, id, lan: Date.now() }) }} onDong={() => setSoan(null)}
          onDaLuu={() => { nd.nap(); setSoan((s) => (s ? { ...s, lan: Date.now() } : s)) }} />
      )}
    </>
  )
}

// ══════════════════ MÔ TẢ · LÝ THUYẾT · VÍ DỤ của một nhãn (Thùy 19/10 — giống dạng bài bên Đại) ══════════════════
type ApiND = typeof api.hinhDangLyThuyet
function useNoiDung(apiLt: ApiND, apiVd: ApiND) {
  const [lt, setLt] = useState<LtMap>({})
  const [vd, setVd] = useState<LtMap>({})
  const nap = () => {
    apiLt.list().then((m) => setLt(m as LtMap)).catch(() => { /* */ })
    apiVd.list().then((m) => setVd(m as LtMap)).catch(() => { /* */ })
  }
  useEffect(() => { nap() }, [])   // eslint-disable-line react-hooks/exhaustive-deps
  return { lt, vd, nap }
}
/** 3 chấm: mô tả · lý thuyết · ví dụ (xanh = đã có) */
function Cham3({ moTa, lt, vd }: { moTa: boolean; lt: boolean; vd: boolean }) {
  const c = (co: boolean, t: string, mau: string) => <span title={(co ? 'đã có ' : 'chưa có ') + t} className={`h-1.5 w-1.5 rounded-full ${co ? mau : 'bg-slate-200'}`} />
  return <span className="flex shrink-0 gap-0.5">{c(moTa, 'mô tả', 'bg-emerald-500')}{c(lt, 'lý thuyết', 'bg-sky-500')}{c(vd, 'ví dụ', 'bg-violet-500')}</span>
}
/** Khối trong panel bên phải: mô tả (rời ô là lưu) + 2 thẻ Lý thuyết / Ví dụ có xem trước */
function KhoiNoiDung({ id, moTa, lt, vd, onLuuMoTa, onMo }: {
  id: string; moTa: string; lt: LtMap; vd: LtMap; onLuuMoTa: (m: string) => void; onMo: (loai: 'lt' | 'vd') => void
}) {
  const [v, setV] = useState(moTa)
  useEffect(() => { setV(moTa) }, [id, moTa])
  const the = (loai: 'lt' | 'vd', m: LtMap, nhan: string, mau: string) => (
    <div className={`rounded-lg border px-2.5 py-2 ${mau}`}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide">{nhan}</span>
        <Btn className="ml-auto h-6 px-2 text-[11px]" onClick={() => onMo(loai)}>{coLt(m, id) ? '✎ Sửa' : '＋ Soạn'}</Btn>
      </div>
      {coLt(m, id)
        ? <div className="mt-1.5 max-h-32 overflow-y-auto text-[12px] leading-relaxed text-slate-700"><MathText>{m[id]?.noi_dung ?? ''}</MathText></div>
        : <div className="mt-1 text-[11.5px] text-slate-400">Chưa có — bấm Soạn (gõ tay hoặc dán ảnh/PDF → AI bóc LaTeX).</div>}
    </div>
  )
  return (
    <div className="mb-3 space-y-2">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Mô tả nhận biết</span>
        <textarea value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (v.trim() !== moTa.trim()) onLuuMoTa(v.trim()) }} rows={3}
          placeholder="Dấu hiệu nhận ra: đề cho gì, hỏi gì, khác các nhãn gần nó ở đâu… (rời ô là lưu)"
          className={`${inpCls} mt-1 text-[12.5px] ${moTa.trim() ? '' : 'border-amber-300 bg-amber-50'}`} />
      </label>
      {the('lt', lt, '📖 Lý thuyết', 'border-sky-200 bg-sky-50/50 text-sky-800')}
      {the('vd', vd, '📝 Ví dụ', 'border-violet-200 bg-violet-50/50 text-violet-800')}
    </div>
  )
}
/** Khung soạn LT/VD kèm thanh ◀ Trước · [Lý thuyết | Ví dụ] · Sau ▶ chạy nối tiếp qua danh sách nhãn (như Bản đồ mới Đại) */
function SoanNoiDung({ ds, dang, lt, vd, apiLt, apiVd, onDi, onDong, onDaLuu }: {
  ds: { id: string; ten: string; moTa: string }[]; dang: { loai: 'lt' | 'vd'; id: string; lan: number }
  lt: LtMap; vd: LtMap; apiLt: ApiND; apiVd: ApiND
  onDi: (loai: 'lt' | 'vd', id: string) => void; onDong: () => void; onDaLuu: () => void
}) {
  const i = Math.max(0, ds.findIndex((x) => x.id === dang.id))
  const buoc = i * 2 + (dang.loai === 'vd' ? 1 : 0), tong = ds.length * 2
  const cur = ds[i]
  const di = (b: number, roiDuoc: () => boolean) => { if (b >= 0 && b < tong && b !== buoc && roiDuoc()) onDi(b % 2 ? 'vd' : 'lt', ds[Math.floor(b / 2)].id) }
  const nut = 'flex h-9 shrink-0 items-center gap-1 rounded-md border px-3 text-[13px] font-semibold disabled:opacity-30'
  return (
    <LyThuyetModal key={`${dang.loai}:${dang.id}:${dang.lan}`} ma={dang.id} ten={`${dang.loai === 'vd' ? 'Ví dụ' : 'Lý thuyết'} — ${cur?.ten ?? ''}`}
      current={(dang.loai === 'vd' ? vd : lt)[dang.id] as any} api={(dang.loai === 'vd' ? apiVd : apiLt) as any}
      onClose={onDong} onSaved={onDaLuu}
      dauTrang={(roiDuoc) => (
        <div className="border-b border-indigo-200 bg-indigo-50/70 px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => di(buoc - 1, roiDuoc)} disabled={buoc === 0} className={`${nut} border-slate-300 bg-white text-slate-600`}>◀ Trước</button>
            <div className="flex shrink-0 overflow-hidden rounded-md border border-indigo-300 bg-white">
              <button onClick={() => di(i * 2, roiDuoc)} className={`h-9 px-4 text-[13px] font-semibold ${dang.loai === 'lt' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>📖 Lý thuyết</button>
              <button onClick={() => di(i * 2 + 1, roiDuoc)} className={`h-9 px-4 text-[13px] font-semibold ${dang.loai === 'vd' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>📝 Ví dụ</button>
            </div>
            <button onClick={() => di(buoc + 1, roiDuoc)} disabled={buoc >= tong - 1} className={`${nut} border-indigo-400 bg-indigo-600 text-white`}>Sau ▶</button>
            <b className="min-w-0 flex-1 truncate pl-2 text-[13px] text-slate-800">{cur?.ten}</b>
            <span className="shrink-0 text-[12px] text-slate-500">{i + 1}/{ds.length}</span>
            {cur && <Cham3 moTa={!!cur.moTa.trim()} lt={coLt(lt, cur.id)} vd={coLt(vd, cur.id)} />}
          </div>
          {cur && <div className={`mt-1.5 truncate text-[12px] ${cur.moTa.trim() ? 'text-slate-600' : 'text-amber-600'}`}>Mô tả: {cur.moTa.trim() || 'chưa có — soạn ở danh mục'}</div>}
        </div>
      )} />
  )
}

function DsBaiToan({ L, ds }: { L: Luoi; ds: typeof L.baiToan }) {
  if (!ds.length) return <div className="text-[12px] text-slate-400">— chưa bài toán nhỏ nào dùng cái này —</div>
  const hos = new Set(ds.map((b) => api.gocHoCua(L, b.mo_hinh_id)))
  return (
    <>
      <div className="mb-2 text-[12px] text-slate-400">{ds.length} bài toán nhỏ · trải {hos.size} họ mô hình</div>
      {ds.slice(0, 12).sort((a, b) => a.cap - b.cap).map((b) => {
        const mh = L.moHinh.find((m) => m.id === b.mo_hinh_id)
        return (
          <div key={b.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-[12.5px] hover:bg-slate-50">
            <Cap cap={b.cap} />
            <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
            {mh && <Tag ton="mh">{mh.ma}</Tag>}
          </div>
        )
      })}
      {ds.length > 12 && <div className="px-1.5 py-1 text-[11.5px] text-slate-400">… và {ds.length - 12} bài toán khác</div>}
    </>
  )
}

function FormDang({ L, khoi, init, onClose, onDone }: {
  L: Luoi; khoi: string; init: { id?: string; cap: 'loai_ch' | 'dang'; cha?: string | null }; onClose: () => void; onDone: () => Promise<void>
}) {
  const cu = init.id ? L.dang.find((d) => d.id === init.id) : undefined
  const [ten, setTen] = useState(cu?.ten ?? '')
  const [cha, setCha] = useState(cu?.cha_id ?? init.cha ?? '')
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  return (
    <Shell title={cu ? 'Sửa' : init.cap === 'loai_ch' ? 'Loại câu hỏi mới' : 'Cách xử lý mới'} onClose={onClose}>
      <Field label={init.cap === 'loai_ch' ? 'Tên loại câu hỏi' : 'Tên cách xử lý'}>
        <input className={inp} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus
          placeholder={init.cap === 'loai_ch' ? 'Chứng minh tứ giác nội tiếp' : 'hai đỉnh cùng nhìn một cạnh'} />
      </Field>
      {init.cap === 'dang' && (
        <Field label="Thuộc loại câu hỏi">
          <select className={inp} value={cha} onChange={(e) => setCha(e.target.value)}>
            {L.dang.filter((d) => d.cap === 'loai_ch').map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}
          </select>
        </Field>
      )}
      {loi && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
      <Actions onClose={onClose} disabled={!ten.trim() || saving} saving={saving} label={cu ? 'Lưu' : 'Tạo'}
        onSave={async () => {
          setSaving(true); setLoi(null)
          try {
            if (cu) await api.updateDang(cu.id, { ten, cha_id: init.cap === 'dang' ? cha : null })
            else await api.createDang({ ten, cap: init.cap, cha_id: init.cap === 'dang' ? cha : null, khoi })
            await onDone(); onClose()
          } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
        }} />
    </Shell>
  )
}

function FormBoDe({ L, khoi, id, onClose, onDone }: { L: Luoi; khoi: string; id?: string; onClose: () => void; onDone: () => Promise<void> }) {
  const cu = id ? L.boDe.find((b) => b.id === id) : undefined
  const [ten, setTen] = useState(cu?.ten ?? '')
  const [pb, setPb] = useState(cu?.phat_bieu ?? '')
  const [saving, setSaving] = useState(false)
  return (
    <Shell title={cu ? `Sửa bổ đề ${cu.ma}` : 'Bổ đề mới'} onClose={onClose}>
      <Field label="Tên"><input className={inp} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus placeholder="Hệ thức lượng trong tam giác vuông" /></Field>
      <Field label="Phát biểu (text + LaTeX $…$)">
        <textarea className={`${inp} h-24`} value={pb} onChange={(e) => setPb(e.target.value)}
          placeholder="$\\triangle ABC$ vuông tại $A$, đường cao $AH$: $AB^2 = BH \\cdot BC$" />
        <div className="mt-1.5"><OcrButton onText={setPb} /></div>
      </Field>
      <Actions onClose={onClose} disabled={!ten.trim() || saving} saving={saving} label={cu ? 'Lưu' : 'Tạo'}
        onSave={async () => {
          setSaving(true)
          if (cu) await api.updateBoDe(cu.id, { ten, phat_bieu: pb || null })
          else await api.createBoDe({ ten, phat_bieu: pb || null, khoi })
          await onDone(); onClose()
        }} />
    </Shell>
  )
}
