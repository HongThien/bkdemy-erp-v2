// Dashboard học tập (leaf `db_hoctap`, nhóm "Quản lý chất lượng") — mặt tiền của module
// `spec-danhgia-hoctap.md`. KHÁC "Kết quả học tập" (leaf `ketqua`): bên đó TRA CỨU số liệu,
// bên này PHÁT HIỆN → ĐỀ XUẤT → NGƯỜI DUYỆT (Thùy 07-22).
//
// ⭐ Máy chỉ ĐỀ XUẤT, người duyệt mới đổi state (PLAN §1.F). Nút duyệt ghi `hs_level_log` cả
//   2 vế (máy đề xuất gì / người chốt gì) ⇒ delta lộ tự động, không cần ai tự khai.
// ⭐ Ưu tiên chỉ để XẾP THỨ TỰ ĐỌC, không phải "mức độ nặng". 4 kênh không cộng dồn thành 1
//   con số phán xét — mỗi kênh bắt một thứ khác nhau, nên luôn hiện `kenh[]` kèm lý do.
// ⭐ KHÔNG cắt âm thầm: dưới ngưỡng digest vẫn hiện (khu riêng), vì ẩn đi sẽ đọc thành
//   "chỉ ngần này em cần chú ý".
import { useEffect, useMemo, useState } from 'react'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { supabase } from '../../lib/supabase'
import { listCandidatesLop, duyetLevel, getLevelLog, cuaSoHienTai, taoAiJob, getAiJob, listAiJobs, tienCuaLuot, MODEL_CHON, MODEL_MAC_DINH, type Candidate, type LevelLogRow, type AiJob } from '../../lib/danhgia'

// ⚠ HAI THANG LEVEL KHÁC NGHĨA — KHÔNG dùng chung nhãn (spec §4.1 vs §4.2).
// Kiến thức: L1 để ý · L2 bổ trợ riêng · L3 vượt quy trình (team học thuật).
// Thái độ  : L1 nhắc HS · L2 nhắc PHỤ HUYNH. (Đã suýt sai: thái độ L2 hiện "Cần bổ trợ"
// → nhân viên đọc xong sẽ đi xếp buổi bổ trợ trong khi việc phải làm là gọi phụ huynh.)
const CLS = ['bg-slate-100 text-slate-600 ring-slate-200', 'bg-amber-50 text-amber-700 ring-amber-200',
  'bg-orange-50 text-orange-700 ring-orange-200', 'bg-rose-50 text-rose-700 ring-rose-200']
const TEN_KT = ['Bình thường', 'Cần để ý', 'Cần bổ trợ', 'Vượt quy trình']
const TEN_TD = ['Bình thường', 'Nhắc học sinh', 'Nhắc phụ huynh', 'Nhắc phụ huynh']
const lvUI = (lv: number, loai: 'kien_thuc' | 'thai_do') =>
  ({ ten: `L${lv} · ${(loai === 'thai_do' ? TEN_TD : TEN_KT)[lv]}`, cls: CLS[lv] })
const KENH_UI: Record<string, { ten: string; cls: string }> = {
  trend: { ten: 'Trend', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  thai_do: { ten: 'Thái độ', cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
  chuong_do: { ten: '③ Chuông đỏ', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  tien_quyet: { ten: '④ Lỗ nền', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}
const Pill = ({ ten, cls }: { ten: string; cls: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${cls}`}>{ten}</span>
)

export default function DashboardHocTapScreen() {
  const [lops, setLops] = useState<{ id: string; ten_lop: string; mon: string }[]>([])
  const [lopId, setLopId] = useState<string>('')
  const [cands, setCands] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [moHS, setMoHS] = useState<Candidate | null>(null)

  useEffect(() => {
    supabase.from('lop').select('id, ten_lop, mon').eq('trang_thai', 'dang_hoc').order('ten_lop').limit(500)
      .then(({ data }) => {
        const ls = (data ?? []) as any[]
        setLops(ls)
        if (!lopId && ls.length) setLopId(ls[0].id)
      })
  }, [])

  useEffect(() => {
    if (!lopId) return
    let huy = false
    setLoading(true); setCands([])
    listCandidatesLop(lopId)
      .then((r) => { if (!huy) setCands(r) })
      .finally(() => { if (!huy) setLoading(false) })
    return () => { huy = true }
  }, [lopId])

  const digest = useMemo(() => cands.filter((c) => c.trongDigest), [cands])
  const duoiNguong = useMemo(() => cands.filter((c) => !c.trongDigest), [cands])
  const lopOpts: Opt[] = lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: l.mon }))

  const reload = () => { const id = lopId; setLopId(''); setTimeout(() => setLopId(id), 0) }

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-slate-800">Dashboard học tập</h1>
            <p className="mt-1 text-[13px] text-slate-500">
              Hệ phát hiện và <b>đề xuất</b> — người duyệt mới đổi. Kỳ hiện tại: <b>{cuaSoHienTai()}</b>
            </p>
          </div>
          <div className="w-[280px]"><SearchSelect options={lopOpts} value={lopId} onChange={(id) => setLopId(id ?? '')} placeholder="Chọn lớp…" /></div>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tính…</div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-3">
              <Stat ten="Cần đọc tuần này" so={digest.length} nhan="ưu tiên cao" />
              <Stat ten="Dưới ngưỡng" so={duoiNguong.length} nhan="vẫn theo dõi" mo />
              <Stat ten="Đề xuất đổi level" so={cands.filter((c) => c.deXuatKienThuc.deXuat !== c.sheet.levelKienThuc || c.deXuatThaiDo.deXuat !== c.sheet.levelThaiDo).length} nhan="chờ duyệt" />
            </div>

            {digest.length === 0 && duoiNguong.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
                Lớp này chưa có tín hiệu nào cần chú ý.
              </div>
            )}

            <NhanDinhClaude lopId={lopId} />

            {digest.length > 0 && (
              <>
                <h2 className="mb-3 text-[15px] font-bold text-slate-700">Cần đọc tuần này</h2>
                <div className="mb-8 space-y-3">{digest.map((c) => <CandCard key={c.hoc_sinh_id} c={c} onMo={() => setMoHS(c)} />)}</div>
              </>
            )}

            {duoiNguong.length > 0 && (
              <>
                <h2 className="mb-1 text-[15px] font-bold text-slate-700">Dưới ngưỡng — theo dõi</h2>
                <p className="mb-3 text-[12px] text-slate-400">
                  Có tín hiệu nhưng chưa tới mức ưu tiên đọc trong tuần. Hiện ở đây để không bị bỏ sót.
                </p>
                <div className="space-y-2">{duoiNguong.map((c) => <CandCard key={c.hoc_sinh_id} c={c} onMo={() => setMoHS(c)} />)}</div>
              </>
            )}
          </>
        )}
      </div>
      {moHS && <ChiTietModal c={moHS} onDong={() => setMoHS(null)} onXong={() => { setMoHS(null); reload() }} />}
    </section>
  )
}

// ── NHẬN ĐỊNH CỦA CLAUDE (spec §0 "code tính số, Claude phán") ────────────────
// Khu này ĐỌC bổ sung, KHÔNG thay rule engine ở trên. Rule engine phát hiện +
// xếp ưu tiên (tất định, giải thích được); Claude đọc stat sheet rồi viết lý do,
// bắt chỗ số liệu mù, nêu độ tin. Người vẫn là người duyệt.
// Gọi qua bảng job → `worker/danhgia.mjs` (key Anthropic ở server, không vào bundle).
const PHAN_LOAI_UI: Record<string, { ten: string; cls: string }> = {
  on_dinh: { ten: 'Ổn định', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  can_theo_doi: { ten: 'Cần theo dõi', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  can_bo_tro: { ten: 'Cần bổ trợ', cls: 'bg-orange-50 text-orange-700 ring-orange-200' },
  can_can_thiep_gap: { ten: 'Cần can thiệp gấp', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}
const DO_TIN_UI: Record<string, string> = { cao: 'độ tin cao', trung_binh: 'độ tin trung bình', thap: 'độ tin thấp' }

function NhanDinhClaude({ lopId }: { lopId: string }) {
  const [jobs, setJobs] = useState<AiJob[]>([])   // các lượt đã chạy — để đặt cạnh nhau mà so model
  const [xemId, setXemId] = useState<string | null>(null)
  const [model, setModel] = useState<string>(MODEL_MAC_DINH)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState(false)

  const nap = async (id?: string) => {
    const ds = await listAiJobs(lopId)
    setJobs(ds)
    setXemId((cur) => id ?? cur ?? ds[0]?.id ?? null)
  }
  useEffect(() => { setJobs([]); setXemId(null); setLoi(null); if (lopId) nap() }, [lopId])

  const job = jobs.find((j) => j.id === xemId) ?? null

  // Đang chạy thì hỏi lại mỗi 3s cho tới khi worker xong (job chạy nền, không giữ UI).
  useEffect(() => {
    if (!job || (job.trang_thai !== 'pending' && job.trang_thai !== 'processing')) return
    const t = setInterval(async () => {
      const m = await getAiJob(job.id)
      if (m) setJobs((ds) => ds.map((j) => (j.id === m.id ? m : j)))
    }, 3000)
    return () => clearInterval(t)
  }, [job?.id, job?.trang_thai])

  const hoi = async () => {
    setBusy(true); setLoi(null)
    try { const id = await taoAiJob(lopId, { model }); await nap(id); setMo(true) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
    finally { setBusy(false) }
  }

  const dangChay = job?.trang_thai === 'pending' || job?.trang_thai === 'processing'
  const coAiDangChay = jobs.some((j) => j.trang_thai === 'pending' || j.trang_thai === 'processing')
  const kq = job?.trang_thai === 'done' ? job.ket_qua : null
  const tenModel = (j: AiJob) => MODEL_CHON.find((m) => j.model?.startsWith(m.id) || j.model_chon === m.id)?.ten ?? (j.model_chon ?? j.model ?? '?')

  return (
    <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold text-slate-700">Nhận định của Claude</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Số liệu do hệ thống tính; Claude đọc rồi viết lý do và nêu độ tin. Vẫn là <b>đề xuất</b> — người duyệt mới đổi.
          </p>
        </div>
        {/* Chọn model rồi chạy CÙNG một lớp nhiều lần → đọc cạnh nhau mới biết
            Sonnet có đủ dùng không. So bằng cảm giác thì không kết luận được. */}
        <div className="flex rounded-lg bg-slate-100 p-1">
          {MODEL_CHON.map((m) => (
            <button key={m.id} onClick={() => setModel(m.id)} title={m.mo_ta}
              className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${model === m.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {m.ten}
            </button>
          ))}
        </div>
        <button disabled={busy || coAiDangChay} onClick={hoi}
          className="rounded-lg bg-slate-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50">
          {coAiDangChay ? 'Đang đọc…' : busy ? 'Đang gửi…' : jobs.length ? 'Chạy lại' : 'Nhờ Claude đọc'}
        </button>
      </div>

      {jobs.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <span className="text-[12px] text-slate-500">Các lượt đã chạy — bấm để so:</span>
          {jobs.map((j) => {
            const d = tienCuaLuot(j)
            return (
              <button key={j.id} onClick={() => setXemId(j.id)}
                className={`rounded-lg px-2.5 py-1 text-[12px] transition ${j.id === xemId ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {tenModel(j)}
                <span className={j.id === xemId ? 'text-indigo-200' : 'text-slate-400'}>
                  {' · '}{new Date(j.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  {d != null ? ` · ${d.toLocaleString('vi-VN')}đ` : j.trang_thai === 'failed' ? ' · lỗi' : ' · …'}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {loi && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">{loi}</p>}
      {job?.trang_thai === 'failed' && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">Không chạy được: {job.error}</p>
      )}
      {dangChay && (
        <p className="mt-3 text-[12px] text-slate-500">
          Đang chạy nền — có thể rời màn này, quay lại vẫn thấy kết quả. (Cần <code className="rounded bg-slate-100 px-1">node worker/danhgia.mjs</code> đang bật.)
        </p>
      )}

      {kq && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-[14px] leading-relaxed text-slate-700">{kq.tong_quan}</p>

          {kq.canh_bao_he?.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-xl bg-amber-50 p-3">
              {kq.canh_bao_he.map((c: string, i: number) => <li key={i} className="text-[13px] text-amber-900">· {c}</li>)}
            </ul>
          )}

          <button onClick={() => setMo(!mo)} className="mt-3 text-[13px] font-semibold text-indigo-600 hover:text-indigo-700">
            {mo ? '▾ Thu gọn' : `▸ Xem từng em (${kq.hoc_sinh?.length ?? 0})`}
          </button>

          {mo && (
            <div className="mt-3 space-y-3">
              {kq.hoc_sinh?.map((h: any) => (
                <div key={h.hoc_sinh_id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-slate-800">{h.ho_ten}</span>
                    {PHAN_LOAI_UI[h.phan_loai] && <Pill {...PHAN_LOAI_UI[h.phan_loai]} />}
                    <span className="text-[11px] text-slate-400">{DO_TIN_UI[h.do_tin] ?? h.do_tin}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{h.ly_do}</p>
                  {h.viec_can_lam?.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {h.viec_can_lam.map((v: string, i: number) => <li key={i} className="text-[13px] text-slate-700">→ {v}</li>)}
                    </ul>
                  )}
                  {h.dang_uu_tien_bo_tro?.length > 0 && (
                    <p className="mt-2 text-[12px] text-slate-500">Dạng nên bổ trợ trước: {h.dang_uu_tien_bo_tro.join(', ')}</p>
                  )}
                  {h.con_thieu && <p className="mt-2 text-[12px] text-amber-700">Còn thiếu: {h.con_thieu}</p>}
                </div>
              ))}
            </div>
          )}

          <p className="mt-3 text-[11px] text-slate-400">
            <b className="text-slate-500">{job && tenModel(job)}</b>
            {' · '}{job?.usage?.input_tokens?.toLocaleString('vi-VN')} token vào
            {' · '}{job?.usage?.output_tokens?.toLocaleString('vi-VN')} token ra (gồm cả token suy nghĩ)
            {job && tienCuaLuot(job) != null ? ` · ~${tienCuaLuot(job)!.toLocaleString('vi-VN')} đ lượt này` : ''}
            {job?.done_at ? ` · ${new Date(job.done_at).toLocaleString('vi-VN')}` : ''}
          </p>
        </div>
      )}
    </div>
  )
}

function Stat({ ten, so, nhan, mo }: { ten: string; so: number; nhan: string; mo?: boolean }) {
  return (
    <div className={`min-w-[170px] rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 ${mo ? 'opacity-70' : ''}`}>
      <div className="text-[12px] font-medium text-slate-500">{ten}</div>
      <div className="mt-1 text-[26px] font-bold leading-none text-slate-800">{so}</div>
      <div className="mt-1 text-[11px] text-slate-400">{nhan}</div>
    </div>
  )
}

// Thanh ưu tiên bên trái: nóng→nguội theo mức đề xuất CAO NHẤT của 2 thang (spec màu ⑤).
// Chỉ để LIẾC thấy nặng-nhẹ; con số "ưu tiên N" cũ bỏ đi vì không có mốc so, đọc thành vô nghĩa.
const BAR = ['bg-slate-300', 'bg-amber-400', 'bg-orange-400', 'bg-rose-500']

// Card chính = TÊN + tín hiệu tối thiểu (Thùy 07-25: "tên là đủ, t sẽ click vào đọc").
// ③④ (chuông đỏ / lỗ nền) là phán đoán NGƯỜI đứng lớp, khẩn nhất → giữ nổi trên mặt card.
// Việc DUYỆT nằm trong popup, không nhồi lên đây.
function CandCard({ c, onMo }: { c: Candidate; onMo: () => void }) {
  const ktDoi = c.deXuatKienThuc.deXuat !== c.sheet.levelKienThuc
  const tdDoi = c.deXuatThaiDo.deXuat !== c.sheet.levelThaiDo
  const tier = Math.max(c.deXuatKienThuc.deXuat, c.deXuatThaiDo.deXuat)
  const co34 = c.kenh.filter((k) => k === 'chuong_do' || k === 'tien_quyet')
  return (
    <button onClick={onMo} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:ring-indigo-300">
      <span className={`h-9 w-1 flex-shrink-0 rounded ${BAR[tier] ?? BAR[0]}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-semibold text-slate-800">{c.ho_ten}</span>
          {co34.map((k) => <Pill key={k} {...KENH_UI[k]} />)}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[12px] text-slate-500">
          {ktDoi
            ? <span>Kiến thức <span className="text-slate-400 line-through">L{c.sheet.levelKienThuc}</span> → <b className="font-semibold text-slate-700">L{c.deXuatKienThuc.deXuat}</b></span>
            : <span className="text-slate-400">Kiến thức giữ L{c.sheet.levelKienThuc}</span>}
          {tdDoi
            ? <span>Thái độ <span className="text-slate-400 line-through">L{c.sheet.levelThaiDo}</span> → <b className="font-semibold text-slate-700">L{c.deXuatThaiDo.deXuat}</b></span>
            : <span className="text-slate-400">Thái độ giữ L{c.sheet.levelThaiDo}</span>}
        </div>
      </div>
      {(ktDoi || tdDoi) && <span className="flex-shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">máy đề xuất đổi</span>}
      <i className="text-slate-300" aria-hidden>›</i>
    </button>
  )
}

// ── Modal chi tiết + DUYỆT ────────────────────────────────────────────────────
function ChiTietModal({ c, onDong, onXong }: { c: Candidate; onDong: () => void; onXong: () => void }) {
  const [log, setLog] = useState<LevelLogRow[]>([])
  useEffect(() => { getLevelLog(c.hoc_sinh_id, c.mon).then(setLog) }, [c.hoc_sinh_id, c.mon])

  const dangs = c.sheet.dangs
  // Vùng 1: dạng đổi MỨC giữa 2 cửa sổ (cần có `mucTruoc` mới so được).
  const doiMuc = dangs.filter((d) => d.mucTruoc && d.mucTruoc !== d.muc)
  const tut = doiMuc.filter((d) => MUC_RANK[d.muc] < MUC_RANK[d.mucTruoc!])
  const len = doiMuc.filter((d) => MUC_RANK[d.muc] > MUC_RANK[d.mucTruoc!])
  // Điểm chuyên đề: 2 cửa sổ có điểm gần nhất (mã đủ, không cần tên — Thùy 07-25).
  const cdDelta = c.sheet.chuyenDes.map((cd) => {
    const pts = cd.chuoi.filter((p) => p.score != null)
    if (pts.length < 2) return null
    const tu = pts[pts.length - 2].score!, den = pts[pts.length - 1].score!
    return { ma: cd.ma_chuyen_de, tu, den, delta: den - tu }
  }).filter(Boolean) as { ma: string; tu: number; den: number; delta: number }[]
  // Vùng 3: dạng CÓ thay đổi điểm (gồm "mới" nếu đáng chú ý) — nhóm theo chuyên đề.
  const doiDang = dangs.filter((d) => d.scoreTruoc == null ? (d.trongDien || d.muc !== 'dat') : Math.abs(d.score - d.scoreTruoc) > 0.005)
  const nhomDoi = new Map<string, typeof dangs>()
  for (const d of doiDang) { const a = nhomDoi.get(d.ten_chuyen_de) ?? []; a.push(d); nhomDoi.set(d.ten_chuyen_de, a) }
  // Dạng đứng yên NHƯNG đang trong diện (yếu ổn định) — khối riêng để không bị bỏ sót (clarify #1).
  const dienYen = dangs.filter((d) => d.trongDien && !doiDang.includes(d))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/40 p-8" onClick={onDong}>
      <div className="w-full max-w-[900px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-slate-800">{c.ho_ten}</h3>
            <p className="text-[12px] text-slate-500">{c.mon} · kỳ {cuaSoHienTai()}</p>
          </div>
          <button onClick={onDong} className="rounded-lg px-3 py-1.5 text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        {/* ── VÙNG 1 — Vì sao cần lưu ý (tổng quan ngắn gọn) ─────────────────────── */}
        <Khoi ten="Vì sao cần lưu ý">
          <table className="w-full text-[13px]">
            <tbody>
              <tr>
                <td className="w-[132px] py-1.5 align-top text-slate-500">Level hiện tại</td>
                <td className="py-1.5"><Pill {...lvUI(c.sheet.levelKienThuc, 'kien_thuc')} /> <span className="mx-1 text-slate-300">·</span> <Pill {...lvUI(c.sheet.levelThaiDo, 'thai_do')} /></td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-1.5 align-top text-slate-500">Thái độ</td>
                <td className="py-1.5 text-slate-700">{thaiDoTomTat(c.sheet.thaiDo)}</td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-1.5 align-top text-slate-500">Điểm chuyên đề</td>
                <td className="py-1.5 tabular-nums">
                  {cdDelta.length === 0 ? <span className="text-slate-400">chưa đủ 2 cửa sổ để so</span> : cdDelta.map((x) => (
                    <div key={x.ma} className="leading-relaxed">
                      <span className="text-slate-400">{x.ma}</span> {x.tu.toFixed(2)} → {x.den.toFixed(2)} <span className={deltaCls(x.delta)}>({x.delta >= 0 ? '+' : ''}{x.delta.toFixed(2)})</span>
                    </div>
                  ))}
                </td>
              </tr>
              <tr className="border-t border-slate-100">
                <td className="py-1.5 align-top text-slate-500">Dạng đổi mức</td>
                <td className="py-1.5">
                  {tut.length === 0 && len.length === 0 ? <span className="text-slate-400">không dạng nào đổi mức giữa 2 cửa sổ</span> : <>
                    {tut.length > 0 && <div className="text-rose-600">▼ {tut.length} dạng tụt <span className="text-slate-400">— {goiDoiMuc(tut)}</span></div>}
                    {len.length > 0 && <div className="text-green-700">▲ {len.length} dạng lên <span className="text-slate-400">— {goiDoiMuc(len)}</span></div>}
                  </>}
                </td>
              </tr>
            </tbody>
          </table>
        </Khoi>

        {/* ── VÙNG 2 — So với trung bình lớp theo từng bài ────────────────────────── */}
        <Khoi ten="So với trung bình lớp — 8 bài giám sát gần nhất">
          {c.sheet.soLop.length === 0 ? <p className="text-[12px] text-slate-400">Chưa có bài giám sát nào.</p> : (
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {c.sheet.soLop.map((b) => {
                const tren = b.diemHS - b.tbLop
                const bg = tren > 0.01 ? 'bg-green-50 text-green-700' : tren < -0.01 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                return (
                  <div key={b.buoi_hoc_id} className="rounded-lg px-1 py-2 text-center tabular-nums">
                    <div className={`rounded-md py-1 text-[13px] font-semibold ${bg}`}>{b.diemHS.toFixed(2)}</div>
                    <div className="mt-1 text-[11px] text-slate-400">lớp {b.tbLop.toFixed(2)}</div>
                    <div className="text-[11px] font-medium text-slate-500">#{b.hang}/{b.siSo}</div>
                    <div className="mt-0.5 text-[10px] text-slate-400">{nhanKy(b.cuaSo)}</div>
                  </div>
                )
              })}
            </div>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Mỗi ô = 1 bài có giám sát (cũ→mới): điểm của em · trung bình lớp cùng bài · hạng trong số bạn cùng làm.</p>
        </Khoi>

        {/* ── VÙNG 3 — Chi tiết dạng có thay đổi (theo chuyên đề) ─────────────────── */}
        <Khoi ten="Chi tiết dạng có thay đổi">
          {nhomDoi.size === 0 ? <p className="text-[12px] text-slate-400">Không dạng nào đổi mức giữa 2 cửa sổ.</p> : [...nhomDoi.entries()].map(([cd, ds]) => (
            <div key={cd} className="mb-3 last:mb-0">
              <div className="mb-1 text-[13px] font-semibold text-slate-700">{ds[0].ma_dang.slice(0, 6)} <span className="font-normal text-slate-400">{cd}</span></div>
              <table className="w-full text-[13px] tabular-nums">
                <thead><tr className="text-left text-[11px] text-slate-400">
                  <th className="font-normal">Dạng</th><th className="w-[110px] font-normal">Trước</th><th className="w-[110px] font-normal">Hiện tại</th><th className="w-[60px] text-right font-normal">Delta</th>
                </tr></thead>
                <tbody>
                  {ds.map((d) => (
                    <tr key={d.ma_dang} className="border-t border-slate-100">
                      <td className="py-1.5 pr-2 text-slate-600">{d.ten_dang}</td>
                      <td className="py-1.5">{d.scoreTruoc == null ? <span className="text-slate-400">mới</span> : <span className={mucCls(d.mucTruoc!)}>{d.scoreTruoc.toFixed(2)} {MUC_TEXT[d.mucTruoc!]}</span>}</td>
                      <td className="py-1.5"><span className={mucCls(d.muc)}>{d.score.toFixed(2)} {MUC_TEXT[d.muc]}</span></td>
                      <td className="py-1.5 text-right">{d.scoreTruoc == null ? '—' : <span className={deltaCls(d.score - d.scoreTruoc)}>{d.score - d.scoreTruoc >= 0 ? '+' : ''}{(d.score - d.scoreTruoc).toFixed(2)}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {dienYen.length > 0 && (
            <div className="mt-3 border-t border-slate-200 pt-3">
              <div className="mb-1 text-[12px] font-semibold text-orange-700">Đang trong diện bổ trợ, chưa đổi mức ({dienYen.length})</div>
              <p className="mb-2 text-[11px] text-slate-400">Yếu ổn định qua các cửa sổ — không "thay đổi" nên không nằm bảng trên, nhưng vẫn là việc cần làm.</p>
              <table className="w-full text-[13px] tabular-nums">
                <tbody>
                  {dienYen.map((d) => (
                    <tr key={d.ma_dang} className="border-t border-slate-100 first:border-0">
                      <td className="py-1.5 pr-2 text-slate-600">{d.ten_dang}</td>
                      <td className="w-[110px] py-1.5"><span className={mucCls(d.muc)}>{d.score.toFixed(2)} {MUC_TEXT[d.muc]}</span></td>
                      <td className="w-[70px] py-1.5 text-right text-slate-400">n {d.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Khoi>

        {/* ── VÙNG 4 — Duyệt (máy đề xuất, người quyết) ──────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2">
          <DuyetKhoi c={c} loai="kien_thuc" ten="Level kiến thức" hienTai={c.sheet.levelKienThuc} deXuat={c.deXuatKienThuc} onXong={onXong} />
          <DuyetKhoi c={c} loai="thai_do" ten="Level thái độ" hienTai={c.sheet.levelThaiDo} deXuat={c.deXuatThaiDo} onXong={onXong} />
        </div>

        <Khoi ten={`Lịch sử duyệt (${log.length})`}>
          {log.length === 0 ? <p className="text-[12px] text-slate-400">Chưa có lượt duyệt nào.</p> : (
            <ul className="space-y-1.5">
              {log.map((r) => (
                <li key={r.id} className="text-[12px] text-slate-600">
                  <span className="text-slate-400">{new Date(r.created_at).toLocaleString('vi-VN')}</span>
                  {' · '}{r.loai === 'kien_thuc' ? 'Kiến thức' : 'Thái độ'}: L{r.level_cu} → <b>L{r.level_chot}</b>
                  {r.lechVoiMay && <span className="ml-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">máy đề xuất L{r.level_may_de_xuat}</span>}
                  {r.ly_do_nguoi && <span className="text-slate-500"> — {r.ly_do_nguoi}</span>}
                </li>
              ))}
            </ul>
          )}
        </Khoi>
      </div>
    </div>
  )
}

const Khoi = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div className="mb-4 rounded-xl bg-slate-50 p-4">
    <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-500">{ten}</h4>
    {children}
  </div>
)

// ── Nhãn + màu cho popup chi tiết ─────────────────────────────────────────────
const MUC_TEXT: Record<'dat' | 'can_luyen' | 'yeu', string> = { dat: 'đạt', can_luyen: 'cần luyện', yeu: 'yếu' }
const MUC_RANK: Record<'dat' | 'can_luyen' | 'yeu', number> = { yeu: 0, can_luyen: 1, dat: 2 }
const mucCls = (m: 'dat' | 'can_luyen' | 'yeu') => m === 'yeu' ? 'text-rose-600' : m === 'can_luyen' ? 'text-amber-600' : 'text-slate-600'
// Tụt = xấu = đỏ · lên = tốt = xanh (KHÔNG neon, theo design system). 0 = xám.
const deltaCls = (d: number) => d < -0.005 ? 'text-rose-600' : d > 0.005 ? 'text-green-700' : 'text-slate-400'
// '2026-07-B' → 'nửa sau 07' — bỏ chữ "14 ngày", cửa sổ thực chất là nửa tháng (Thùy 07-25).
const nhanKy = (win: string) => `${win.slice(8) === 'A' ? 'đầu' : 'sau'} ${win.slice(5, 7)}`
// Tóm thái độ: đếm buổi dưới chuẩn "nghiêm túc" trong dữ liệu đang có.
function thaiDoTomTat(td: { thai_do: string; t: string }[]): string {
  if (!td.length) return 'chưa có dữ liệu thái độ'
  const duoi = td.filter((x) => x.thai_do !== 'nghiem_tuc').length
  return duoi === 0 ? `${td.length}/${td.length} buổi nghiêm túc — không có tín hiệu` : `${duoi}/${td.length} buổi dưới nghiêm túc`
}
// Gộp "từ→đến" các dạng đổi mức thành chuỗi đếm: "đạt→cần luyện ×3, cần luyện→yếu ×2".
function goiDoiMuc(ds: { muc: 'dat' | 'can_luyen' | 'yeu'; mucTruoc: 'dat' | 'can_luyen' | 'yeu' | null }[]): string {
  const dem = new Map<string, number>()
  for (const d of ds) { const k = `${MUC_TEXT[d.mucTruoc!]}→${MUC_TEXT[d.muc]}`; dem.set(k, (dem.get(k) ?? 0) + 1) }
  return [...dem.entries()].map(([k, n]) => `${k}${n > 1 ? ` ×${n}` : ''}`).join(', ')
}

// Người duyệt: mặc định = đề xuất của máy, sửa được. Ghi log CẢ HAI VẾ ⇒ delta tự lộ.
function DuyetKhoi({ c, loai, ten, hienTai, deXuat, onXong }: {
  c: Candidate; loai: 'kien_thuc' | 'thai_do'; ten: string; hienTai: number; deXuat: any; onXong: () => void
}) {
  const [chot, setChot] = useState<number>(deXuat.deXuat)
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  const lech = chot !== deXuat.deXuat
  const luu = async () => {
    setBusy(true)
    try {
      await duyetLevel({
        hocSinhId: c.hoc_sinh_id, mon: c.mon, loai, levelChot: chot,
        levelMayDeXuat: deXuat.deXuat,
        lyDoMay: { lyDo: deXuat.lyDo, bangChung: deXuat.bangChung, kenh: c.kenh, uuTien: c.uuTien },
        lyDoNguoi: lyDo.trim() || null,
      })
      onXong()
    } finally { setBusy(false) }
  }
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-slate-500">{ten}</h4>
      <div className="mb-2 flex items-center gap-2 text-[12px]">
        <span className="text-slate-400">Hiện tại</span><Pill {...lvUI(hienTai, loai)} />
      </div>
      <ul className="mb-3 space-y-0.5">{deXuat.lyDo.map((l: string, i: number) => <li key={i} className="text-[12px] text-slate-600">· {l}</li>)}</ul>
      <div className="mb-2 flex gap-1.5">
        {[0, 1, 2, 3].map((lv) => (
          <button key={lv} onClick={() => setChot(lv)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${chot === lv ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-indigo-300'}`}>
            L{lv}{lv === deXuat.deXuat ? ' ★' : ''}
          </button>
        ))}
      </div>
      {lech && <p className="mb-2 text-[11px] text-amber-700">Khác đề xuất của máy (L{deXuat.deXuat}) — nên ghi lý do để sau này soi lại.</p>}
      <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (tuỳ chọn)…"
        className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
      <button disabled={busy} onClick={luu}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
        {busy ? 'Đang lưu…' : chot === hienTai ? 'Giữ nguyên & ghi log' : `Duyệt → L${chot}`}
      </button>
      <p className="mt-1 text-[11px] text-slate-400">★ = máy đề xuất. Mọi lượt duyệt đều được ghi lại.</p>
    </div>
  )
}
