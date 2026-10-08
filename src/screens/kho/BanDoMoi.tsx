// BanDoMoi — soạn BẢN ĐỒ MỚI 4 tầng (nháp) cho nhánh Đại. spec-ban-do-4-tang.md (CEO chốt 08/10).
//
// Việc của CEO trên màn này: ① CHIA TẦNG (chủ đề · chuyên đề · nhóm bài · dạng bài, kéo thả) · ② dán LÝ THUYẾT
// cho nhóm bài + VÍ DỤ cho dạng bài · ③ viết MÔ TẢ nhận biết cho nhóm bài + dạng bài (Claude dựa vào đó để khớp câu).
// Bản nháp nằm ở bảng dai_bdm_* — bản đồ đang chạy KHÔNG bị đụng cho tới bước chuyển.
//
// Kéo thả (HTML5 thuần, không thêm thư viện):
//   · cột chủ đề ↔ cột chủ đề: sắp lại · chuyên đề → chủ đề khác: chuyển cả ô (kèm nhóm); trùng thì dồn
//   · nhóm → ô khác / trước nhóm khác: chuyển + đặt vị trí · dạng bài → nhóm khác / trước dạng bài khác
//   Nâng/hạ tầng làm trong khung chi tiết (nút rõ ràng) — không gán nghĩa kép cho 1 cú thả.
// Sau mỗi lần ghi: tải lại cây NỀN, không xoá màn (CLAUDE §2 React); vị trí cuộn giữ theo khối.
import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import {
  getCay, themChuDe, suaChuDe, xoaChuDe, themChuyenDeVaoChuDe, suaChuyenDe, goO, xoaChuyenDe,
  themNhom, suaNhom, xoaNhom, themDangBai, suaDangBai, xoaDangBai, sapXep, chuyenNhom, chuyenDangBai, chuyenO,
  nangDangBai, haNhom, getLyThuyetNhom, getViDuDangBai, lyThuyetNhomApi, viDuDangBaiApi,
  type BdmCay, type BdmChuDe, type BdmO, type BdmNhom, type BdmDangBai,
} from '../../lib/kho/banDoMoi'
import type { LyThuyet } from '../../lib/kho/api'
import { LyThuyetModal } from './BanDo'
import { MathText, inp } from './ui'

// Nhớ vị trí cuộn theo khối — sống tới F5 (CLAUDE §2: rời màn quay lại đúng chỗ cũ)
const NHO: { cuon: Record<string, number> } = { cuon: {} }

type Keo =
  | { loai: 'chu_de'; id: string }
  | { loai: 'o'; chuDeId: string; chuyenDeId: string }
  | { loai: 'nhom'; id: string; chuDeId: string; chuyenDeId: string }
  | { loai: 'dang_bai'; id: string; nhomId: string }

type Chon =
  | { loai: 'chu_de'; id: string }
  | { loai: 'o'; chuDeId: string; chuyenDeId: string }
  | { loai: 'nhom'; id: string }
  | { loai: 'dang_bai'; id: string }

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const oKey = (chuDeId: string, chuyenDeId: string) => `${chuDeId}|${chuyenDeId}`
const chenTruoc = (ids: string[], id: string, truoc: string | null) => {
  const bo = ids.filter((x) => x !== id)
  const i = truoc ? bo.indexOf(truoc) : -1
  if (i < 0) bo.push(id); else bo.splice(i, 0, id)
  return bo
}

export default function BanDoMoi({ khoi }: { khoi: string }) {
  const [cay, setCay] = useState<BdmCay | null>(null)
  const [loiTai, setLoiTai] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [bao, setBao] = useState<string | null>(null)
  const [chon, setChon] = useState<Chon | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [lt, setLt] = useState<{ loai: 'nhom' | 'dang_bai'; id: string; ten: string; current: LyThuyet } | null>(null)
  const keoRef = useRef<Keo | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const baoTimer = useRef<number | undefined>(undefined)

  // Đổi KHỐI = đổi ngữ cảnh ⇒ reset + tải lại (đúng ca được reset)
  useEffect(() => {
    let song = true
    setCay(null); setLoiTai(null); setChon(null)
    getCay(khoi).then((c) => { if (song) setCay(c) }).catch((e) => { if (song) setLoiTai(String(e.message ?? e)) })
    return () => { song = false }
  }, [khoi])
  // Khôi phục vị trí cuộn sau lần tải đầu của khối
  useEffect(() => {
    if (cay && boardRef.current) boardRef.current.scrollLeft = NHO.cuon[khoi] ?? 0
  }, [cay !== null, khoi]) // eslint-disable-line react-hooks/exhaustive-deps

  const napLai = () => getCay(khoi).then(setCay).catch((e) => setLoi(String(e.message ?? e)))
  const thongBao = (s: string) => { setBao(s); window.clearTimeout(baoTimer.current); baoTimer.current = window.setTimeout(() => setBao(null), 2000) }
  // Mọi thao tác ghi đi qua đây: ghi → báo → tải lại nền (không xoá màn)
  async function lam(viec: () => Promise<unknown>, xong = 'Đã lưu') {
    setLoi(null)
    try { await viec(); thongBao(xong); await napLai() }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)); await napLai() }
  }

  // ── Tra cứu trong cây ──
  const timNhom = (id: string) => {
    for (const cd of cay?.chu_de ?? []) for (const o of cd.o) for (const n of o.nhom) if (n.id === id) return { cd, o, n }
    return null
  }
  const timDangBai = (id: string) => {
    for (const cd of cay?.chu_de ?? []) for (const o of cd.o) for (const n of o.nhom) for (const d of n.dang_bai) if (d.id === id) return { cd, o, n, d }
    return null
  }
  const timO = (chuDeId: string, chuyenDeId: string) => {
    const cd = cay?.chu_de.find((x) => x.id === chuDeId)
    const o = cd?.o.find((x) => x.chuyen_de_id === chuyenDeId)
    return cd && o ? { cd, o } : null
  }

  // ── Kéo thả ──
  function batDauKeo(e: DragEvent, k: Keo) {
    e.stopPropagation()
    keoRef.current = k
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', 'bdm')
  }
  function ketThucKeo() { keoRef.current = null; setHover(null) }
  // Props cho 1 vùng thả: nhận loại nào · khoá highlight · việc khi thả
  function vung(key: string, nhan: (k: Keo) => boolean, tha: (k: Keo) => Promise<void> | void) {
    return {
      onDragOver: (e: DragEvent) => {
        const k = keoRef.current
        if (!k || !nhan(k)) return
        e.preventDefault(); e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        if (hover !== key) setHover(key)
      },
      onDragLeave: (e: DragEvent) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setHover((h) => (h === key ? null : h)) },
      onDrop: (e: DragEvent) => {
        const k = keoRef.current
        if (!k || !nhan(k)) return
        e.preventDefault(); e.stopPropagation()
        ketThucKeo()
        void tha(k)
      },
    }
  }

  // Thả chủ đề lên chủ đề: sắp lại cột
  const thaChuDe = (dich: BdmChuDe) => (k: Keo) => {
    if (k.loai !== 'chu_de' || k.id === dich.id) return
    const ids = chenTruoc((cay?.chu_de ?? []).map((c) => c.id), k.id, dich.id)
    return lam(() => sapXep('chu_de', ids), 'Đã sắp lại chủ đề')
  }
  // Thả chuyên đề (ô) vào chủ đề (cuối) hoặc trước 1 ô khác
  const thaO = (chuDe: BdmChuDe, truoc: string | null) => async (k: Keo) => {
    if (k.loai !== 'o') return
    if (k.chuDeId === chuDe.id) {
      if (!truoc || truoc === k.chuyenDeId) return
      const ids = chenTruoc(chuDe.o.map((o) => o.chuyen_de_id), k.chuyenDeId, truoc).map((c) => oKey(chuDe.id, c))
      return lam(() => sapXep('o', ids), 'Đã sắp lại chuyên đề')
    }
    const daCo = chuDe.o.some((o) => o.chuyen_de_id === k.chuyenDeId)
    if (daCo && !window.confirm('Chủ đề đích đã có chuyên đề này — dồn các nhóm bài vào chuyên đề sẵn có?')) return
    return lam(async () => {
      await chuyenO(k.chuDeId, k.chuyenDeId, chuDe.id)
      if (truoc && !daCo) {
        const ids = chenTruoc([...chuDe.o.map((o) => o.chuyen_de_id), k.chuyenDeId], k.chuyenDeId, truoc).map((c) => oKey(chuDe.id, c))
        await sapXep('o', ids)
      }
    }, daCo ? 'Đã dồn vào chuyên đề sẵn có' : 'Đã chuyển chuyên đề')
  }
  // Thả nhóm vào ô (cuối) hoặc trước 1 nhóm
  const thaNhom = (chuDeId: string, o: BdmO, truoc: string | null) => (k: Keo) => {
    if (k.loai !== 'nhom' || k.id === truoc) return
    const ids = chenTruoc(o.nhom.map((n) => n.id), k.id, truoc)
    const cungO = k.chuDeId === chuDeId && k.chuyenDeId === o.chuyen_de_id
    if (cungO && !truoc) return
    return lam(() => (cungO ? sapXep('nhom', ids) : chuyenNhom(k.id, chuDeId, o.chuyen_de_id, ids)), cungO ? 'Đã sắp lại' : 'Đã chuyển nhóm bài')
  }
  // Thả dạng bài vào nhóm (cuối) hoặc trước 1 dạng bài
  const thaDangBai = (n: BdmNhom, truoc: string | null) => (k: Keo) => {
    if (k.loai !== 'dang_bai' || k.id === truoc) return
    const ids = chenTruoc(n.dang_bai.map((d) => d.id), k.id, truoc)
    const cungNhom = k.nhomId === n.id
    if (cungNhom && !truoc) return
    return lam(() => (cungNhom ? sapXep('dang_bai', ids) : chuyenDangBai(k.id, n.id, ids)), cungNhom ? 'Đã sắp lại' : 'Đã chuyển dạng bài')
  }

  async function moLyThuyet(loai: 'nhom' | 'dang_bai', id: string, ten: string) {
    setLoi(null)
    try { setLt({ loai, id, ten, current: loai === 'nhom' ? await getLyThuyetNhom(id) : await getViDuDangBai(id) }) }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)) }
  }

  // Tiến độ soạn — đếm thứ đang hiển thị (badge), không phải số liệu nghiệp vụ
  const tienDo = useMemo(() => {
    let nhom = 0, nhomMoTa = 0, nhomLt = 0, db = 0, dbMoTa = 0, dbVd = 0
    for (const cd of cay?.chu_de ?? []) for (const o of cd.o) for (const n of o.nhom) {
      nhom++; if (n.mo_ta.trim()) nhomMoTa++; if (n.co_ly_thuyet) nhomLt++
      for (const d of n.dang_bai) { db++; if (d.mo_ta.trim()) dbMoTa++; if (d.co_vi_du) dbVd++ }
    }
    return { nhom, nhomMoTa, nhomLt, db, dbMoTa, dbVd }
  }, [cay])

  if (loiTai) return <div className="p-8 text-sm text-rose-600">Không tải được bản đồ mới: {loiTai}</div>
  if (!cay) return <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải bản đồ mới…</div>

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Thanh phụ: giải thích + tiến độ */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-amber-200 bg-amber-50 px-6 py-2 text-[12.5px] text-amber-900">
        <span className="font-semibold">🆕 Bản đồ mới — bản nháp khối {khoi}</span>
        <span className="text-amber-800/80">Chưa ảnh hưởng bản đồ đang chạy. Kéo thả để chia tầng · bấm vào thẻ để sửa tên, mô tả, lý thuyết, ví dụ.</span>
        <span className="ml-auto flex gap-3 text-[12px]">
          <span>Nhóm bài <b>{tienDo.nhom}</b> · mô tả {tienDo.nhomMoTa}/{tienDo.nhom} · lý thuyết {tienDo.nhomLt}/{tienDo.nhom}</span>
          <span>Dạng bài <b>{tienDo.db}</b> · mô tả {tienDo.dbMoTa}/{tienDo.db} · ví dụ {tienDo.dbVd}/{tienDo.db}</span>
        </span>
      </div>
      {loi && (
        <div className="flex items-start gap-2 border-b border-rose-200 bg-rose-50 px-6 py-2 text-[13px] text-rose-700">
          <span className="flex-1">⚠ {loi}</span>
          <button onClick={() => setLoi(null)} className="text-rose-400 hover:text-rose-700">✕</button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Bảng cột chủ đề */}
        <div ref={boardRef} onScroll={(e) => { NHO.cuon[khoi] = (e.currentTarget as HTMLDivElement).scrollLeft }}
          className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-4">
          {cay.chu_de.map((cd) => (
            <CotChuDe key={cd.id} cd={cd} cay={cay} hover={hover} chon={chon}
              keoChuDe={(e) => batDauKeo(e, { loai: 'chu_de', id: cd.id })}
              vungHeader={vung(`cd:${cd.id}`, (k) => k.loai === 'chu_de' || k.loai === 'o', (k) => (k.loai === 'chu_de' ? thaChuDe(cd)(k) : thaO(cd, null)(k)))}
              vungThan={vung(`cdb:${cd.id}`, (k) => k.loai === 'o', thaO(cd, null))}
              vungO={(o) => vung(`o:${cd.id}:${o.chuyen_de_id}`, (k) => k.loai === 'o' || k.loai === 'nhom',
                (k) => (k.loai === 'o' ? thaO(cd, o.chuyen_de_id)(k) : thaNhom(cd.id, o, null)(k)))}
              vungNhom={(o, n) => vung(`n:${n.id}`, (k) => k.loai === 'nhom' || k.loai === 'dang_bai',
                (k) => (k.loai === 'nhom' ? thaNhom(cd.id, o, n.id)(k) : thaDangBai(n, null)(k)))}
              vungDangBai={(n, d) => vung(`d:${d.id}`, (k) => k.loai === 'dang_bai', thaDangBai(n, d.id))}
              keoO={(e, o) => batDauKeo(e, { loai: 'o', chuDeId: cd.id, chuyenDeId: o.chuyen_de_id })}
              keoNhom={(e, o, n) => batDauKeo(e, { loai: 'nhom', id: n.id, chuDeId: cd.id, chuyenDeId: o.chuyen_de_id })}
              keoDangBai={(e, n, d) => batDauKeo(e, { loai: 'dang_bai', id: d.id, nhomId: n.id })}
              ketThucKeo={ketThucKeo}
              onChon={setChon}
              onThemChuyenDe={(a) => lam(() => themChuyenDeVaoChuDe(cd.id, a), 'Đã thêm chuyên đề')}
              onThemNhom={(o, ten) => lam(() => themNhom(cd.id, o.chuyen_de_id, ten), 'Đã thêm nhóm bài')}
              onThemDangBai={(n, ten) => lam(() => themDangBai(n.id, ten), 'Đã thêm dạng bài')}
            />
          ))}
          <ThemChuDe onThem={(ten) => lam(() => themChuDe(khoi, ten), 'Đã thêm chủ đề')} />
        </div>

        {/* Khung chi tiết */}
        {chon && (
          <ChiTiet chon={chon} cay={cay} khoi={khoi} onDong={() => setChon(null)}
            timNhom={timNhom} timDangBai={timDangBai} timO={timO}
            lam={lam} moLyThuyet={moLyThuyet}
            onDaXoa={() => setChon(null)} />
        )}
      </div>

      {bao && <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">✓ {bao}</div>}

      {lt && (
        <LyThuyetModal ma={lt.id} ten={`${lt.loai === 'nhom' ? 'Lý thuyết' : 'Ví dụ'} — ${lt.ten}`} current={lt.current}
          api={lt.loai === 'nhom' ? lyThuyetNhomApi : viDuDangBaiApi}
          onClose={() => setLt(null)}
          onSaved={() => { setLt(null); thongBao('Đã lưu'); void napLai() }} />
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Cột 1 chủ đề
// ════════════════════════════════════════════════════════════════════════════
type VungProps = { onDragOver: (e: DragEvent) => void; onDragLeave: (e: DragEvent) => void; onDrop: (e: DragEvent) => void }

function CotChuDe(p: {
  cd: BdmChuDe; cay: BdmCay; hover: string | null; chon: Chon | null
  keoChuDe: (e: DragEvent) => void
  vungHeader: VungProps; vungThan: VungProps
  vungO: (o: BdmO) => VungProps; vungNhom: (o: BdmO, n: BdmNhom) => VungProps; vungDangBai: (n: BdmNhom, d: BdmDangBai) => VungProps
  keoO: (e: DragEvent, o: BdmO) => void; keoNhom: (e: DragEvent, o: BdmO, n: BdmNhom) => void; keoDangBai: (e: DragEvent, n: BdmNhom, d: BdmDangBai) => void
  ketThucKeo: () => void
  onChon: (c: Chon) => void
  onThemChuyenDe: (a: { chuyenDeId?: string; tenMoi?: string }) => void
  onThemNhom: (o: BdmO, ten: string) => void
  onThemDangBai: (n: BdmNhom, ten: string) => void
}) {
  const { cd, hover, chon } = p
  const sang = (k: string) => (hover === k ? 'ring-2 ring-indigo-400 ring-offset-1' : '')
  const dangChon = (c: Chon) => !!chon && JSON.stringify(chon) === JSON.stringify(c)
  return (
    <div className={`flex w-[340px] shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50 ${sang(`cdb:${cd.id}`)}`} {...p.vungThan}>
      {/* Header chủ đề — kéo để sắp lại cột */}
      <div draggable onDragStart={p.keoChuDe} onDragEnd={p.ketThucKeo} {...p.vungHeader}
        onClick={() => p.onChon({ loai: 'chu_de', id: cd.id })}
        className={`flex cursor-grab items-center gap-2 rounded-t-xl bg-indigo-600 px-3 py-2 text-white active:cursor-grabbing ${sang(`cd:${cd.id}`)} ${dangChon({ loai: 'chu_de', id: cd.id }) ? 'outline outline-2 outline-amber-400' : ''}`}>
        <span className="text-[11px] opacity-70">⠿</span>
        <span className="flex-1 text-[13.5px] font-semibold"><MathText>{cd.ten}</MathText></span>
        <span className="rounded bg-white/20 px-1.5 text-[11px]">{cd.o.length} CĐ</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-2.5">
        {cd.o.map((o) => (
          <div key={o.chuyen_de_id} {...p.vungO(o)}
            className={`rounded-lg border border-slate-200 bg-white shadow-sm ${sang(`o:${cd.id}:${o.chuyen_de_id}`)}`}>
            {/* Header chuyên đề — kéo để chuyển/sắp lại */}
            <div draggable onDragStart={(e) => p.keoO(e, o)} onDragEnd={p.ketThucKeo}
              onClick={() => p.onChon({ loai: 'o', chuDeId: cd.id, chuyenDeId: o.chuyen_de_id })}
              className={`flex cursor-grab items-center gap-1.5 rounded-t-lg border-b border-slate-100 bg-sky-50 px-2.5 py-1.5 active:cursor-grabbing ${dangChon({ loai: 'o', chuDeId: cd.id, chuyenDeId: o.chuyen_de_id }) ? 'outline outline-2 outline-amber-400' : ''}`}>
              <span className="text-[10px] text-slate-400">⠿</span>
              <span className="flex-1 text-[13px] font-semibold text-sky-900"><MathText>{o.ten}</MathText></span>
              {o.so_chu_de > 1 && <span title="Chuyên đề dùng chung — có mặt ở nhiều chủ đề" className="rounded bg-sky-200 px-1.5 text-[10.5px] font-semibold text-sky-800">ở {o.so_chu_de} chủ đề</span>}
            </div>
            <div className="flex flex-col gap-1.5 p-2">
              {o.nhom.map((n) => (
                <div key={n.id} draggable onDragStart={(e) => p.keoNhom(e, o, n)} onDragEnd={p.ketThucKeo} {...p.vungNhom(o, n)}
                  onClick={(e) => { e.stopPropagation(); p.onChon({ loai: 'nhom', id: n.id }) }}
                  className={`cursor-grab rounded-md border bg-white px-2 py-1.5 active:cursor-grabbing ${sang(`n:${n.id}`)} ${dangChon({ loai: 'nhom', id: n.id }) ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200 hover:border-indigo-300'}`}>
                  <div className="flex items-start gap-1.5">
                    <span className="mt-0.5 text-[10px] text-slate-300">⠿</span>
                    <span className="flex-1 text-[12.5px] font-medium leading-snug text-slate-800"><MathText>{n.ten}</MathText></span>
                    <DauTienDo moTa={!!n.mo_ta.trim()} noiDung={n.co_ly_thuyet} nhanNoiDung="lý thuyết" />
                  </div>
                  {n.dang_bai.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1 pl-3">
                      {n.dang_bai.map((d) => (
                        <div key={d.id} draggable onDragStart={(e) => p.keoDangBai(e, n, d)} onDragEnd={p.ketThucKeo} {...p.vungDangBai(n, d)}
                          onClick={(e) => { e.stopPropagation(); p.onChon({ loai: 'dang_bai', id: d.id }) }}
                          className={`flex cursor-grab items-start gap-1 rounded border px-1.5 py-1 text-[11.5px] active:cursor-grabbing ${sang(`d:${d.id}`)} ${dangChon({ loai: 'dang_bai', id: d.id }) ? 'border-amber-400 bg-amber-50' : 'border-violet-100 bg-violet-50/60 hover:border-violet-300'}`}>
                          <span className="text-violet-400">◆</span>
                          <span className="flex-1 text-violet-900"><MathText>{d.ten}</MathText></span>
                          <DauTienDo moTa={!!d.mo_ta.trim()} noiDung={d.co_vi_du} nhanNoiDung="ví dụ" />
                        </div>
                      ))}
                    </div>
                  )}
                  <ThemNhanh nhan="+ dạng bài" goiY="Tên dạng bài…" nho onThem={(ten) => p.onThemDangBai(n, ten)} />
                </div>
              ))}
              <ThemNhanh nhan="+ Nhóm bài" goiY="Tên nhóm bài…" onThem={(ten) => p.onThemNhom(o, ten)} />
            </div>
          </div>
        ))}
        <ThemChuyenDe cay={p.cay} cd={cd} onThem={p.onThemChuyenDe} />
      </div>
    </div>
  )
}

// Chấm tiến độ: mô tả · lý thuyết/ví dụ — xám = chưa có
function DauTienDo({ moTa, noiDung, nhanNoiDung }: { moTa: boolean; noiDung: boolean; nhanNoiDung: string }) {
  return (
    <span className="flex shrink-0 gap-0.5 pt-0.5">
      <span title={moTa ? 'Đã có mô tả' : 'Chưa có mô tả'} className={`h-2 w-2 rounded-full ${moTa ? 'bg-emerald-500' : 'bg-slate-200'}`} />
      <span title={noiDung ? `Đã có ${nhanNoiDung}` : `Chưa có ${nhanNoiDung}`} className={`h-2 w-2 rounded-full ${noiDung ? 'bg-indigo-500' : 'bg-slate-200'}`} />
    </span>
  )
}

function ThemNhanh({ nhan, goiY, onThem, nho }: { nhan: string; goiY: string; onThem: (ten: string) => void; nho?: boolean }) {
  const [mo, setMo] = useState(false)
  const [ten, setTen] = useState('')
  const xong = () => { if (ten.trim()) onThem(ten.trim()); setTen(''); setMo(false) }
  if (!mo) return (
    <button onClick={(e) => { e.stopPropagation(); setMo(true) }}
      className={`self-start rounded px-1.5 text-left ${nho ? 'mt-1 pl-3 text-[11px]' : 'py-0.5 text-[12px]'} font-medium text-slate-400 hover:bg-slate-100 hover:text-indigo-600`}>{nhan}</button>
  )
  return (
    <input autoFocus value={ten} placeholder={goiY} onClick={(e) => e.stopPropagation()}
      onChange={(e) => setTen(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') xong(); if (e.key === 'Escape') { setTen(''); setMo(false) } }}
      onBlur={xong} className={`${inp} ${nho ? 'mt-1 py-1 text-[12px]' : ''}`} />
  )
}

function ThemChuDe({ onThem }: { onThem: (ten: string) => void }) {
  const [ten, setTen] = useState('')
  return (
    <div className="flex w-[260px] shrink-0 flex-col gap-2 self-start rounded-xl border-2 border-dashed border-slate-300 p-3">
      <span className="text-[12.5px] font-semibold text-slate-500">+ Thêm chủ đề</span>
      <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Tên chủ đề…"
        onKeyDown={(e) => { if (e.key === 'Enter' && ten.trim()) { onThem(ten.trim()); setTen('') } }} className={inp} />
      <button disabled={!ten.trim()} onClick={() => { onThem(ten.trim()); setTen('') }}
        className="rounded-md bg-indigo-600 py-1.5 text-[13px] font-semibold text-white disabled:opacity-40">Thêm</button>
    </div>
  )
}

// Thêm chuyên đề vào chủ đề: chọn chuyên đề DÙNG CHUNG có sẵn, hoặc tạo mới
function ThemChuyenDe({ cay, cd, onThem }: { cay: BdmCay; cd: BdmChuDe; onThem: (a: { chuyenDeId?: string; tenMoi?: string }) => void }) {
  const [mo, setMo] = useState(false)
  const [q, setQ] = useState('')
  const daCo = new Set(cd.o.map((o) => o.chuyen_de_id))
  const goiY = cay.chuyen_de.filter((c) => !daCo.has(c.id) && (!q.trim() || boDau(c.ten).includes(boDau(q.trim())))).slice(0, 12)
  const trungTen = cay.chuyen_de.some((c) => boDau(c.ten) === boDau(q.trim()))
  const dong = () => { setMo(false); setQ('') }
  if (!mo) return (
    <button onClick={() => setMo(true)} className="rounded-lg border border-dashed border-slate-300 py-1.5 text-[12.5px] font-medium text-slate-500 hover:border-sky-400 hover:text-sky-700">+ Chuyên đề</button>
  )
  return (
    <div className="rounded-lg border border-sky-300 bg-white p-2 shadow-sm">
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chuyên đề có sẵn hoặc gõ tên mới…"
        onKeyDown={(e) => { if (e.key === 'Escape') dong() }} className={inp} />
      <div className="mt-1.5 max-h-56 overflow-y-auto">
        {goiY.map((c) => (
          <button key={c.id} onClick={() => { onThem({ chuyenDeId: c.id }); dong() }}
            className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12.5px] hover:bg-sky-50">
            <span className="flex-1"><MathText>{c.ten}</MathText></span>
            <span className="text-[10.5px] text-slate-400">{c.so_chu_de ? `ở ${c.so_chu_de} chủ đề · K${c.khoi.join(',')}` : 'chưa dùng'}</span>
          </button>
        ))}
        {q.trim() && !trungTen && (
          <button onClick={() => { onThem({ tenMoi: q.trim() }); dong() }}
            className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-[12.5px] font-semibold text-sky-700 hover:bg-sky-50">＋ Tạo chuyên đề mới «{q.trim()}»</button>
        )}
        {!goiY.length && !q.trim() && <div className="px-2 py-1 text-[12px] text-slate-400">Chưa có chuyên đề nào — gõ tên để tạo mới.</div>}
      </div>
      <button onClick={dong} className="mt-1 text-[11.5px] text-slate-400 hover:text-slate-600">Đóng</button>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Khung chi tiết (phải): tên · mô tả · lý thuyết/ví dụ · nâng/hạ · gỡ/xoá
// ════════════════════════════════════════════════════════════════════════════
function ChiTiet(p: {
  chon: Chon; cay: BdmCay; khoi: string; onDong: () => void
  timNhom: (id: string) => { cd: BdmChuDe; o: BdmO; n: BdmNhom } | null
  timDangBai: (id: string) => { cd: BdmChuDe; o: BdmO; n: BdmNhom; d: BdmDangBai } | null
  timO: (chuDeId: string, chuyenDeId: string) => { cd: BdmChuDe; o: BdmO } | null
  lam: (viec: () => Promise<unknown>, xong?: string) => Promise<void>
  moLyThuyet: (loai: 'nhom' | 'dang_bai', id: string, ten: string) => void
  onDaXoa: () => void
}) {
  const { chon, cay, lam } = p
  const khung = (tieuDe: string, mau: string, noiDung: ReactNode) => (
    <div className="flex w-[380px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className={`flex items-center gap-2 px-4 py-2.5 text-white ${mau}`}>
        <span className="flex-1 text-[13px] font-semibold">{tieuDe}</span>
        <button onClick={p.onDong} className="text-white/70 hover:text-white">✕</button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">{noiDung}</div>
    </div>
  )

  if (chon.loai === 'chu_de') {
    const cd = cay.chu_de.find((x) => x.id === chon.id)
    if (!cd) return null
    return khung('Chủ đề', 'bg-indigo-600', <>
      <TruongTen key={cd.id} gt={cd.ten} onLuu={(t) => lam(() => suaChuDe(cd.id, t))} />
      <div className="text-[12px] text-slate-500">Khối <b>{p.khoi}</b> · {cd.o.length} chuyên đề · mã nháp <code>{cd.id}</code></div>
      <NutXoa nhan="Xoá chủ đề" moTa="Chỉ xoá được khi chủ đề không còn chuyên đề nào."
        onXoa={() => { if (window.confirm(`Xoá chủ đề «${cd.ten}»?`)) void lam(() => xoaChuDe(cd.id), 'Đã xoá').then(p.onDaXoa) }} />
    </>)
  }

  if (chon.loai === 'o') {
    const t = p.timO(chon.chuDeId, chon.chuyenDeId)
    if (!t) return null
    const { cd, o } = t
    return khung('Chuyên đề (dùng chung)', 'bg-sky-600', <>
      <TruongTen key={o.chuyen_de_id} gt={o.ten} onLuu={(t2) => lam(() => suaChuyenDe(o.chuyen_de_id, { ten: t2 }))} />
      {o.so_chu_de > 1 && <div className="rounded-md bg-sky-50 px-2.5 py-1.5 text-[12px] text-sky-800">Chuyên đề này có mặt ở <b>{o.so_chu_de} chủ đề</b> — đổi tên/mô tả áp cho tất cả.</div>}
      <TruongMoTa key={`mt-${o.chuyen_de_id}`} gt={o.mo_ta} goiY="Mô tả chuyên đề (tuỳ chọn)…" onLuu={(m) => lam(() => suaChuyenDe(o.chuyen_de_id, { mo_ta: m }))} />
      <div className="text-[12px] text-slate-500">Trong chủ đề <b><MathText>{cd.ten}</MathText></b>: {o.nhom.length} nhóm bài · mã nháp <code>{o.chuyen_de_id}</code></div>
      <NutXoa nhan="Gỡ khỏi chủ đề này" moTa="Chỉ gỡ được khi chuyên đề không còn nhóm bài nào trong chủ đề này. Chuyên đề vẫn còn ở các chủ đề khác."
        onXoa={() => void lam(() => goO(cd.id, o.chuyen_de_id), 'Đã gỡ').then(p.onDaXoa)} />
      {o.so_chu_de <= 1 && (
        <NutXoa nhan="Gỡ và xoá hẳn chuyên đề" moTa="Chuyên đề chỉ có ở chủ đề này — gỡ rồi xoá luôn khỏi danh mục."
          onXoa={() => { if (window.confirm(`Xoá chuyên đề «${o.ten}»?`)) void lam(async () => { await goO(cd.id, o.chuyen_de_id); await xoaChuyenDe(o.chuyen_de_id) }, 'Đã xoá').then(p.onDaXoa) }} />
      )}
    </>)
  }

  if (chon.loai === 'nhom') {
    const t = p.timNhom(chon.id)
    if (!t) return null
    const { cd, o, n } = t
    return khung('Nhóm bài (tầng 3)', 'bg-slate-700', <>
      <TruongTen key={n.id} gt={n.ten} onLuu={(t2) => lam(() => suaNhom(n.id, { ten: t2 }))} />
      <div className="text-[12px] text-slate-500"><MathText>{cd.ten}</MathText> › <MathText>{o.ten}</MathText> · mã nháp <code>{n.id}</code></div>
      <TruongMoTa key={`mt-${n.id}`} gt={n.mo_ta} goiY="Dấu hiệu nhận biết: bài thuộc nhóm này trông thế nào, dùng kiến thức/phương pháp gì…"
        nhan="Mô tả nhận biết" chuThich="Claude dựa vào mô tả này để khớp câu cũ vào bản đồ mới." onLuu={(m) => lam(() => suaNhom(n.id, { mo_ta: m }))} />
      <button onClick={() => p.moLyThuyet('nhom', n.id, n.ten)}
        className="flex items-center justify-between rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-[13px] font-semibold text-indigo-700 hover:bg-indigo-100">
        <span>📖 Lý thuyết</span><span className="text-[11.5px] font-normal">{n.co_ly_thuyet ? 'đã có — bấm để sửa' : 'chưa có — bấm để dán'}</span>
      </button>
      <div className="text-[12px] text-slate-500">{n.dang_bai.length} dạng bài bên trong.</div>
      <HaNhom cay={cay} n={n} onHa={(dich) => void lam(() => haNhom(n.id, dich), 'Đã hạ thành dạng bài').then(p.onDaXoa)} />
      <NutXoa nhan="Xoá nhóm bài" moTa="Chỉ xoá được khi không còn dạng bài bên trong. Lý thuyết và mô tả mất theo."
        onXoa={() => { if (window.confirm(`Xoá nhóm bài «${n.ten}»?`)) void lam(() => xoaNhom(n.id), 'Đã xoá').then(p.onDaXoa) }} />
    </>)
  }

  const t = p.timDangBai(chon.id)
  if (!t) return null
  const { cd, o, n, d } = t
  return khung('Dạng bài (tầng 4)', 'bg-violet-600', <>
    <TruongTen key={d.id} gt={d.ten} onLuu={(t2) => lam(() => suaDangBai(d.id, { ten: t2 }))} />
    <div className="text-[12px] text-slate-500"><MathText>{cd.ten}</MathText> › <MathText>{o.ten}</MathText> › <MathText>{n.ten}</MathText> · mã nháp <code>{d.id}</code></div>
    <TruongMoTa key={`mt-${d.id}`} gt={d.mo_ta} goiY="Khuôn đề của dạng bài này: đề cho gì, hỏi gì, khác các dạng bài cùng nhóm ở đâu…"
      nhan="Mô tả nhận biết" chuThich="Claude dựa vào mô tả này để khớp câu cũ vào đúng dạng bài." onLuu={(m) => lam(() => suaDangBai(d.id, { mo_ta: m }))} />
    <button onClick={() => p.moLyThuyet('dang_bai', d.id, d.ten)}
      className="flex items-center justify-between rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-[13px] font-semibold text-violet-700 hover:bg-violet-100">
      <span>📝 Ví dụ</span><span className="text-[11.5px] font-normal">{d.co_vi_du ? 'đã có — bấm để sửa' : 'chưa có — bấm để dán'}</span>
    </button>
    <button onClick={() => { if (window.confirm(`Nâng «${d.ten}» thành nhóm bài (đặt cùng chuyên đề «${o.ten}»)? Ví dụ sẽ thành lý thuyết của nhóm mới.`)) void lam(() => nangDangBai(d.id, cd.id, o.chuyen_de_id), 'Đã nâng thành nhóm bài').then(p.onDaXoa) }}
      className="rounded-md border border-slate-200 px-3 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-700">
      ⬆ Nâng thành nhóm bài <span className="font-normal text-slate-400">(cùng chuyên đề, rồi kéo đi nơi khác nếu cần)</span>
    </button>
    <NutXoa nhan="Xoá dạng bài" moTa="Ví dụ và mô tả mất theo."
      onXoa={() => { if (window.confirm(`Xoá dạng bài «${d.ten}»?`)) void lam(() => xoaDangBai(d.id), 'Đã xoá').then(p.onDaXoa) }} />
  </>)
}

function TruongTen({ gt, onLuu }: { gt: string; onLuu: (t: string) => void }) {
  const [v, setV] = useState(gt)
  const luu = () => { if (v.trim() && v.trim() !== gt) onLuu(v.trim()); else setV(gt) }
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">Tên</span>
      <input value={v} onChange={(e) => setV(e.target.value)} onBlur={luu} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }} className={inp} />
    </label>
  )
}

function TruongMoTa({ gt, goiY, onLuu, nhan = 'Mô tả', chuThich }: { gt: string; goiY: string; onLuu: (m: string) => void; nhan?: string; chuThich?: string }) {
  const [v, setV] = useState(gt)
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">{nhan}</span>
      <textarea value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (v.trim() !== gt.trim()) onLuu(v.trim()) }}
        rows={6} placeholder={goiY} className={`${inp} resize-y leading-relaxed`} />
      {chuThich && <span className="text-[11px] text-slate-400">{chuThich} Lưu khi rời ô.</span>}
    </label>
  )
}

function HaNhom({ cay, n, onHa }: { cay: BdmCay; n: BdmNhom; onHa: (dich: string) => void }) {
  const [dich, setDich] = useState('')
  const lua = cay.chu_de.flatMap((cd) => cd.o.flatMap((o) => o.nhom.filter((x) => x.id !== n.id).map((x) => ({ id: x.id, nhan: `${cd.ten} › ${o.ten} › ${x.ten}` }))))
  const coCon = n.dang_bai.length > 0
  return (
    <div className="rounded-md border border-slate-200 p-2.5">
      <div className="text-[12.5px] font-medium text-slate-700">⬇ Hạ thành dạng bài của nhóm khác</div>
      {coCon ? (
        <div className="mt-1 text-[11.5px] text-slate-400">Nhóm còn {n.dang_bai.length} dạng bài — kéo các dạng bài sang nhóm khác trước rồi mới hạ.</div>
      ) : <>
        <select value={dich} onChange={(e) => setDich(e.target.value)} className={`${inp} mt-1.5 text-[12.5px]`}>
          <option value="">— chọn nhóm đích —</option>
          {lua.map((x) => <option key={x.id} value={x.id}>{x.nhan}</option>)}
        </select>
        <button disabled={!dich} onClick={() => { if (window.confirm(`Hạ «${n.ten}» thành dạng bài? Lý thuyết của nhóm sẽ thành ví dụ của dạng bài.`)) onHa(dich) }}
          className="mt-1.5 rounded-md bg-slate-700 px-3 py-1 text-[12.5px] font-semibold text-white disabled:opacity-40">Hạ</button>
      </>}
    </div>
  )
}

function NutXoa({ nhan, moTa, onXoa }: { nhan: string; moTa: string; onXoa: () => void }) {
  return (
    <div className="mt-2 border-t border-slate-100 pt-3">
      <button onClick={onXoa} className="text-[12.5px] font-semibold text-rose-600 hover:text-rose-700">🗑 {nhan}</button>
      <div className="text-[11px] text-slate-400">{moTa}</div>
    </div>
  )
}
