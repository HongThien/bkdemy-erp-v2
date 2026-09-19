// KhoHinhHocScreen — PHASE HỌC KIẾN THỨC (Bài) · CEO 16/09.
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

export default function KhoHinhHocScreen({ khoi }: { khoi: string }) {
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
    try { await createHinhHocBai({ khoi, ten_bai: ten, thu_tu: bais.length + 1 }); setTaoMoi(null); await reload() }
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

  const tongCau = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Hình học · Khối {khoi}</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            {bais.length} Bài · {tongCau} câu · {bais.filter((b) => b.da_duyet).length}/{bais.length} Bài đã duyệt
          </p>
        </div>
        <button onClick={() => setTaoMoi('')} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">＋ Bài mới</button>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
        : bais.length === 0 && taoMoi == null ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
            Chưa có Bài nào cho khối {khoi}. Bấm <b>＋ Bài mới</b> để bắt đầu.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {bais.map((b, i) => (
              <BaiCard key={b.ma_bai} bai={b} thuTuHienThi={i + 1}
                soCau={counts[b.ma_bai] ?? 0} coLyThuyet={!!(lyThuyets[b.ma_bai]?.noi_dung?.trim() || lyThuyets[b.ma_bai]?.file_url)}
                onOpen={() => setOpenBai(b)} onLyThuyet={() => setLtBai(b)}
                onToggleDuyet={() => toggleDuyet(b)} />
            ))}
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

function BaiCard({ bai, thuTuHienThi, soCau, coLyThuyet, onOpen, onLyThuyet, onToggleDuyet }: {
  bai: HinhHocBai; thuTuHienThi: number; soCau: number; coLyThuyet: boolean
  onOpen: () => void; onLyThuyet: () => void; onToggleDuyet: () => void
}) {
  return (
    <div onClick={onOpen}
      className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-300">Bài {thuTuHienThi}</span>
            <Code>{bai.ma_bai}</Code>
          </div>
          <h3 className="mt-1 text-[15px] font-semibold leading-tight text-slate-900">{bai.ten_bai}</h3>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleDuyet() }}
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${bai.da_duyet ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
          {bai.da_duyet ? '✓ Đã duyệt' : '○ Chưa duyệt'}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[12px] text-slate-500">
        <span><b className="text-slate-800">{soCau}</b> câu</span>
        <span className="h-3 w-px bg-slate-200" />
        <button onClick={(e) => { e.stopPropagation(); onLyThuyet() }}
          className={`hover:underline ${coLyThuyet ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-500'}`}>
          {coLyThuyet ? '✓ Lý thuyết · xem/sửa' : '✗ Chưa · Gắn lý thuyết'}
        </button>
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
