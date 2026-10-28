// KhoHinhHocScreen — PHASE HỌC KIẾN THỨC (Bài) · CEO 16/09.
// ⭐ Thùy 28/10: theo bản đồ Đại mới — mỗi BÀI HỌC = 1 chuyên đề → 1 nhóm bài → 1 dạng bài, cả 3 tầng CÙNG TÊN (cùng 1 đối tượng
//   hinh_hoc_bai, mã gốc HH… — không lưu thêm bảng); không còn cụm (CUM_TBL bỏ hinh_hoc_cau_hoi ⇒ DangHub tự ẩn tab Cụm).
// List phẳng các Bài theo khối. Click Bài → mở DangHub (reuse Đại) với cauTbl='hinh_hoc_cau_hoi'
// → Kho câu hỏi, Cụm bài, Tìm câu, Nhập chuỗi câu, Clone biến thể… có sẵn hết bên DangHub.
// Nút "Lý thuyết" trên card → mở LyThuyetModal (BanDo.tsx) với api wrap từ hinhhoc.ts.
// Chỉ file này quản Bài (leaf phẳng); câu/cụm/lý-thuyết-editor dùng NGUYÊN module Đại.
import { useEffect, useState } from 'react'
import {
  listHinhHocBai, createHinhHocBai, updateHinhHocBai, deleteHinhHocBai,
  countHinhHocCauByBai, listHinhHocLyThuyet, upsertHinhHocLyThuyet, deleteHinhHocLyThuyet,
  duyetHinhHocBai, boDuyetHinhHocBai,
  type HinhHocBai,
} from '../../../lib/kho/hinhhoc'
import type { MapRow, LyThuyet } from '../../../lib/kho/api'
import type { BranchConfig, LyThuyetApi } from '../branches'
import DangHub from '../DangHub'
import { LyThuyetModal } from '../BanDo'
import { Code, inp } from '../ui'

// Config MINIMAL cho DangHub — chỉ đủ để phần "Kho câu hỏi" chạy đúng bảng hinh_hoc_cau_hoi.
// list/count/create/updateLeaf/deleteLeaf KHÔNG được DangHub gọi (chỉ BanDo dùng) — stub trả rỗng.
const hinhHocBranch: BranchConfig = {
  key: 'hinhhoc',
  cauTbl: 'hinh_hoc_cau_hoi',
  labels: { t1: 'Chủ đề', t2: 'Chuyên đề', leaf: 'Bài' },
  hasMucDo: false,
  countLabel: 'câu',
  list: async () => [],
  count: async () => ({}),
  create: async () => {},
  updateLeaf: async () => {},
  deleteLeaf: async () => {},
  deleteLeaves: async () => {},
}

// Wrap CRUD lý thuyết Bài theo shape LyThuyetApi để LyThuyetModal dùng được nguyên xi.
const hinhHocLyThuyetApi: LyThuyetApi = {
  list: listHinhHocLyThuyet,
  upsert: async (ma, noi_dung, file_url, ten_file) => upsertHinhHocLyThuyet(ma, noi_dung, file_url, ten_file),
  remove: deleteHinhHocLyThuyet,
}

// Bài → MapRow để đưa vào DangHub. Không có tầng cha; leafMa = ma_bai.
const baiToMapRow = (b: HinhHocBai): MapRow => ({
  leafMa: b.ma_bai, khoi: b.khoi,
  t1Ma: '', t1Ten: '', t2Ma: '', t2Ten: '',
  leafTen: b.ten_bai, bac: b.bac_toi_thieu ?? '', mucDo: null,
})

// `chuDeId` (tuỳ chọn) — mở từ Bản đồ mới, vùng Hình–Học: chỉ hiện bài học của chủ đề đó + ngăn "chưa xếp chủ đề".
// Không truyền = màn cũ ở Kho › Hình học › Học (mọi bài của khối), hành vi y nguyên.
export default function KhoHinhHocScreen({ khoi, chuDeId, tenChuDe }: { khoi: string; chuDeId?: string; tenChuDe?: string }) {
  const [bais, setBais] = useState<HinhHocBai[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [lyThuyets, setLyThuyets] = useState<Record<string, LyThuyet>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [openBai, setOpenBai] = useState<HinhHocBai | null>(null)               // Bài đang mở DangHub
  const [ltBai, setLtBai] = useState<HinhHocBai | null>(null)                   // Bài đang mở LyThuyetModal
  const [taoMoi, setTaoMoi] = useState<string | null>(null)
  const [suaTen, setSuaTen] = useState<HinhHocBai | null>(null)                 // sửa tên Bài

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [bs, cn, lt] = await Promise.all([listHinhHocBai(khoi), countHinhHocCauByBai(khoi), listHinhHocLyThuyet()])
      setBais(bs); setCounts(cn); setLyThuyets(lt)
    } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi]) // eslint-disable-line

  async function taoBai() {
    const ten = taoMoi?.trim(); if (!ten) return
    try { await createHinhHocBai({ khoi, ten_bai: ten, thu_tu: bais.length + 1, chu_de_id: chuDeId ?? null }); setTaoMoi(null); await reload() }
    catch (e: any) { alert(e.message ?? e) }
  }
  async function xoaBai(b: HinhHocBai) {
    if (!confirm(`Xoá Bài "${b.ten_bai}"? Chỉ được nếu Bài chưa có câu nào (FK restrict).`)) return
    try { await deleteHinhHocBai(b.ma_bai); setOpenBai(null); await reload() }
    catch (e: any) { alert(e.message ?? e) }
  }
  async function toggleDuyet(b: HinhHocBai) {
    try { await (b.da_duyet ? boDuyetHinhHocBai(b.ma_bai) : duyetHinhHocBai(b.ma_bai)); await reload() }
    catch (e: any) { alert(e.message ?? e) }
  }

  const hien = chuDeId ? bais.filter((b) => b.chu_de_id === chuDeId) : bais
  const chuaXep = chuDeId ? bais.filter((b) => !b.chu_de_id) : []
  const tongCau = hien.reduce((a, b) => a + (counts[b.ma_bai] ?? 0), 0)
  // xếp / gỡ bài khỏi chủ đề — vá đúng dòng, không nạp lại cả danh sách
  async function xepChuDe(b: HinhHocBai, id: string | null) {
    try { await updateHinhHocBai(b.ma_bai, { chu_de_id: id }); setBais((prev) => prev.map((x) => (x.ma_bai === b.ma_bai ? { ...x, chu_de_id: id } : x))) }
    catch (e: any) { setErr(e.message ?? String(e)) }
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">{chuDeId ? `Hình – Học · ${tenChuDe ?? 'chủ đề'}` : `Hình học · Khối ${khoi}`}</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            {hien.length} bài học · {tongCau} bài tập · {hien.filter((b) => b.da_duyet).length}/{hien.length} bài đã duyệt
            {chuDeId && <span className="ml-2 text-slate-400">· đo ở BÀI HỌC (thang 3 bài), không đo ở từng bài tập</span>}
          </p>
        </div>
        <button onClick={() => setTaoMoi('')} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">＋ Bài mới</button>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
        : hien.length === 0 && taoMoi == null ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
            {chuDeId ? 'Chủ đề này chưa có bài học nào.' : `Chưa có Bài nào cho khối ${khoi}.`} Bấm <b>＋ Bài mới</b>{chuDeId && chuaXep.length ? ' hoặc đưa bài có sẵn ở dưới vào' : ''} để bắt đầu.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hien.map((b, i) => (
              <BaiCard key={b.ma_bai} bai={b} thuTuHienThi={i + 1}
                soCau={counts[b.ma_bai] ?? 0} coLyThuyet={!!(lyThuyets[b.ma_bai]?.noi_dung?.trim() || lyThuyets[b.ma_bai]?.file_url)}
                onOpen={() => setOpenBai(b)} onLyThuyet={() => setLtBai(b)}
                onToggleDuyet={() => toggleDuyet(b)}
                onMucDo={async (v) => { await updateHinhHocBai(b.ma_bai, { muc_do: v }); await reload() }} />
            ))}
          </div>
        )}

      {chuDeId && !loading && !err && (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bài học khối {khoi} chưa xếp chủ đề · {chuaXep.length}</div>
          {!chuaXep.length && <div className="text-[12.5px] text-slate-400">— không còn bài nào —</div>}
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {chuaXep.map((b) => (
              <div key={b.ma_bai} className="flex items-center gap-2 rounded-md px-2 py-1 text-[13px] hover:bg-slate-50">
                <Code>{b.ma_bai}</Code>
                <span className="min-w-0 flex-1 truncate">{b.ten_bai}</span>
                <span className="text-[11.5px] text-slate-400">{counts[b.ma_bai] ?? 0} câu</span>
                <button onClick={() => xepChuDe(b, chuDeId)} className="rounded-md border border-indigo-200 px-2 py-0.5 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">＋ vào chủ đề này</button>
              </div>))}
          </div>
          {!!hien.length && (
            <div className="mt-3 border-t border-slate-100 pt-2 text-[12px] text-slate-500">
              Gỡ khỏi chủ đề: {hien.map((b) => (
                <button key={b.ma_bai} onClick={() => xepChuDe(b, null)} title="Đưa bài này về ngăn chưa xếp (không xoá gì)"
                  className="mb-1 mr-1 rounded border border-slate-200 px-1.5 py-0.5 hover:border-rose-300 hover:text-rose-600">{b.ten_bai} ✕</button>))}
            </div>)}
        </div>
      )}
      {taoMoi != null && (
        <TenBaiModal title="Bài mới" ten={taoMoi} onChange={setTaoMoi} onClose={() => setTaoMoi(null)} onSave={taoBai} />
      )}
      {suaTen && (
        <TenBaiModal title={`Sửa tên: ${suaTen.ten_bai}`} ten={suaTen.ten_bai} onChange={(v) => setSuaTen({ ...suaTen, ten_bai: v })}
          onClose={() => setSuaTen(null)}
          onSave={async () => { const t = suaTen.ten_bai.trim(); if (!t) return; await updateHinhHocBai(suaTen.ma_bai, { ten_bai: t }); setSuaTen(null); await reload(); if (openBai?.ma_bai === suaTen.ma_bai) setOpenBai((x) => x ? { ...x, ten_bai: t } : x) }} />
      )}
      {openBai && (
        <DangHub d={baiToMapRow(openBai)} config={hinhHocBranch}
          onClose={() => setOpenBai(null)}
          onEditDang={() => setSuaTen(openBai)}
          onDeleteDang={() => xoaBai(openBai)}
          onChanged={reload} />
      )}
      {ltBai && (
        <LyThuyetModal ma={ltBai.ma_bai} ten={ltBai.ten_bai} current={lyThuyets[ltBai.ma_bai]}
          api={hinhHocLyThuyetApi}
          onClose={() => setLtBai(null)}
          onSaved={async () => { setLtBai(null); await reload() }} />
      )}
    </div>
  )
}

// ⭐ 27/09 (CEO): độ khó Bài (1-5) thay bậc S/A/B/C — hình không có "dạng" nên đánh trực tiếp trên Bài.
//   Ramp màu ấm (emerald → rose) đồng bộ với MUCDO_TONE bên Đại. Bấm chip = xoay 1→2→3→4→5→null→1.
const MUCDO_TONE_HH: Record<number | string, string> = {
  1: 'bg-emerald-500 text-white',
  2: 'bg-lime-500 text-white',
  3: 'bg-amber-500 text-white',
  4: 'bg-orange-500 text-white',
  5: 'bg-rose-500 text-white',
  none: 'bg-slate-100 text-slate-400 hover:bg-slate-200',
}

// 1 bài học vẽ như 1 chuyên đề của bản đồ Đại mới: dải chuyên đề → hộp nhóm → thẻ dạng bài (3 tầng cùng tên, cùng 1 bài).
function BaiCard({ bai, thuTuHienThi, soCau, coLyThuyet, onOpen, onLyThuyet, onToggleDuyet, onMucDo }: {
  bai: HinhHocBai; thuTuHienThi: number; soCau: number; coLyThuyet: boolean
  onOpen: () => void; onLyThuyet: () => void; onToggleDuyet: () => void
  onMucDo: (v: number | null) => void
}) {
  const md = bai.muc_do
  const nextMd = md == null ? 1 : md >= 5 ? null : md + 1
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* tầng CHUYÊN ĐỀ */}
      <div className="flex items-center gap-2 bg-sky-600 px-3 py-2 text-white">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[12px] font-bold">{thuTuHienThi}</span>
        <h3 className="min-w-0 flex-1 truncate text-[14.5px] font-semibold" title={bai.ten_bai}>{bai.ten_bai}</h3>
        <span className="shrink-0 font-mono text-[10.5px] text-white/70">{bai.ma_bai}</span>
        <button onClick={onToggleDuyet}
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${bai.da_duyet ? 'bg-white text-emerald-700 hover:bg-emerald-50' : 'bg-white/90 text-rose-600 hover:bg-white'}`}>
          {bai.da_duyet ? '✓ Đã duyệt' : '○ Chưa duyệt'}
        </button>
      </div>
      <div className="p-3">
        {/* tầng NHÓM BÀI */}
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1.5 text-white">
            <span className="rounded bg-white/15 px-1.5 text-[11px] font-bold">1</span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{bai.ten_bai}</span>
            <button onClick={onLyThuyet} title={coLyThuyet ? 'Lý thuyết bài học — xem / sửa' : 'Chưa có lý thuyết — bấm để gắn'}
              className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${coLyThuyet ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
              📖 {coLyThuyet ? 'Lý thuyết' : 'Chưa LT'}
            </button>
          </div>
          {/* tầng DẠNG BÀI — bấm mở kho câu */}
          <div className="p-2">
            <div onClick={onOpen} title="Mở KHO: các câu của dạng bài này"
              className="flex cursor-pointer items-start gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-[12px] hover:border-violet-400">
              <span className="mt-px shrink-0 text-[10.5px] font-bold text-violet-500">1.1</span>
              <span className="flex-1 leading-snug text-violet-950">{bai.ten_bai}</span>
              <button onClick={(e) => { e.stopPropagation(); onMucDo(nextMd) }}
                title={md == null ? 'Chưa gán độ khó — bấm để đặt' : `Độ khó ${md}. Bấm xoay 1→2→3→4→5→bỏ.`}
                className={`h-5 min-w-5 shrink-0 rounded px-1 text-[11px] font-bold ${MUCDO_TONE_HH[md ?? 'none']}`}>
                {md ?? '?'}
              </button>
              <span className="shrink-0 rounded bg-white px-1.5 text-[10.5px] font-semibold text-violet-700 ring-1 ring-violet-200">📚 {soCau}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TenBaiModal({ title, ten, onChange, onClose, onSave }: {
  title: string; ten: string; onChange: (v: string) => void; onClose: () => void; onSave: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[440px] max-w-[92vw] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Tên Bài</label>
        <input autoFocus className={inp} value={ten} onChange={(e) => onChange(e.target.value)}
          placeholder="Vd: Hình bình hành" onKeyDown={(e) => { if (e.key === 'Enter') onSave() }} />
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={onSave} disabled={!ten.trim()} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">Lưu</button>
        </div>
      </div>
    </div>
  )
}
