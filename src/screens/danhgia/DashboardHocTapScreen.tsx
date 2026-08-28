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
import { listCandidatesLop, duyetLevel, getLevelLog, cuaSoHienTai, taoAiJob, getAiJob, listAiJobs, tienCuaLuot, getLichSuChuyenDe, MODEL_CHON, MODEL_MAC_DINH, type Candidate, type LevelLogRow, type AiJob, type LanLamChuyenDe, type DangStat } from '../../lib/danhgia'
import { moHoacGopCaseBoTroYeu, type NguonBoTroYeu } from '../../lib/botro_yeu'

// ⚠ HAI THANG LEVEL KHÁC NGHĨA — KHÔNG dùng chung nhãn (spec §4.1 vs §4.2).
// Kiến thức: L0 = bình thường HOẶC "cần theo dõi" (Thùy 08-18: "cần để ý" gộp về L0 — "theo dõi"
//   đã có khu riêng "Dưới ngưỡng" ở trên, không cần tách thành 1 mức) · L1 = bổ trợ mức 1 (trước/
//   sau giờ, TA) · L2 = bổ trợ mức 2 (buổi riêng, TA) · L3 = bổ trợ mức 2 đổi người (buổi riêng,
//   GV cao cấp). L1-L3 đều MỞ CASE `bo_tro_yeu` (xem `luu()` ở `DuyetKhoi`, gọi `botro_yeu.ts`).
// Thái độ  : L1 nhắc HS · L2 nhắc PHỤ HUYNH — KHÔNG mở case (PLAN-botro-yeu.md §0 mục 10). (Đã
//   suýt sai: thái độ L2 hiện "Cần bổ trợ" → nhân viên đọc xong sẽ đi xếp buổi bổ trợ trong khi
//   việc phải làm là gọi phụ huynh — giữ 2 nhãn tách biệt để không lặp lại.)
const CLS = ['bg-slate-100 text-slate-600 ring-slate-200', 'bg-amber-50 text-amber-700 ring-amber-200',
  'bg-orange-50 text-orange-700 ring-orange-200', 'bg-rose-50 text-rose-700 ring-rose-200']
const TEN_KT = ['Bình thường', 'Bổ trợ mức 1 · sau giờ', 'Bổ trợ mức 2 · TA riêng', 'Bổ trợ mức 2 · GV cao cấp']
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

// ── Header (Thùy 08-22 vòng 2: "bên trái quá rộng mà chẳng có gì, thừa chiều cao — co lại 80-90%
// cho vừa 1 màn hình") — CHỈ còn avatar+tên+chip+ưu tiên, 1 hàng gọn. 3 thẻ tóm tắt (level/thái độ/
// yếu ổn định) đã CHUYỂN vào cột trái ngay trên khối Duyệt (xem `MiniStat`/`ThongTinNhanh` trong
// `CandidateDetailBody`) — đúng nơi có không gian trống, đỡ header cao lêu nghêu.
export function CandidateHeader({ c, phu, uuTien, onDong }: { c: Candidate; phu?: string; uuTien?: number; onDong?: () => void }) {
  const initials = c.ho_ten.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="mb-2 flex items-center gap-2.5">
      <div className="grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-indigo-200 text-[12px] font-extrabold text-indigo-700 ring-1 ring-indigo-100">
        {initials}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span className="text-[15px] font-extrabold tracking-tight text-slate-800">{c.ho_ten}</span>
        {phu && <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10.5px] font-bold text-blue-700">{phu}</span>}
      </div>
      <div className="flex flex-none items-center gap-2">
        {uuTien != null && <span className="whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-extrabold text-rose-600">★ ưu tiên {uuTien}</span>}
        {onDong && <button onClick={onDong} className="rounded-lg border border-slate-200 px-2 py-1 text-slate-400 hover:bg-slate-100">✕</button>}
      </div>
    </div>
  )
}

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
// Export cho `DuyetBoTroYeuScreen.tsx` tái dùng NGUYÊN khối "vì sao cần lưu ý" (Thùy 08-18: card
// duyệt bổ trợ thiếu hẳn context, cần y hệt info của modal Dashboard, không phải bản rút gọn).
// `children` = chỗ chèn khối Duyệt (Vùng 4) — mỗi nơi gọi cần widget khác nhau (Dashboard: cả kiến
// thức lẫn thái độ; Duyệt bổ trợ: chỉ kiến thức) nên để caller tự quyết, không cứng trong này.
export function CandidateDetailBody({ c, children }: { c: Candidate; children?: React.ReactNode }) {
  const [log, setLog] = useState<LevelLogRow[]>([])
  useEffect(() => { getLevelLog(c.hoc_sinh_id, c.mon).then(setLog) }, [c.hoc_sinh_id, c.mon])

  // Detail lười (Thùy 08-18): "soi" chuyên đề = lịch sử làm bài; "soi" thái độ = danh sách buổi.
  // Chỉ 1 khối mở tại 1 thời điểm (đơn giản UI) — mở khối khác thì đóng khối cũ.
  const [moChiTiet, setMoChiTiet] = useState<string | null>(null) // 'thaido' | `cd:${ma_chuyen_de}` | null
  const [lichSuCd, setLichSuCd] = useState<Record<string, LanLamChuyenDe[]>>({})
  const [dangTaiCd, setDangTaiCd] = useState<string | null>(null)
  async function toggleCd(ma: string) {
    const key = `cd:${ma}`
    if (moChiTiet === key) { setMoChiTiet(null); return }
    setMoChiTiet(key)
    if (!lichSuCd[ma]) {
      setDangTaiCd(ma)
      try { const rows = await getLichSuChuyenDe(c.hoc_sinh_id, ma, c.mon); setLichSuCd((m) => ({ ...m, [ma]: rows })) }
      finally { setDangTaiCd(null) }
    }
  }

  const dangs = c.sheet.dangs
  // Vùng 1: dạng đổi MỨC giữa 2 cửa sổ (cần có `mucTruoc` mới so được).
  const doiMuc = dangs.filter((d) => d.mucTruoc && d.mucTruoc !== d.muc)
  const tut = doiMuc.filter((d) => MUC_RANK[d.muc] < MUC_RANK[d.mucTruoc!])
  const len = doiMuc.filter((d) => MUC_RANK[d.muc] > MUC_RANK[d.mucTruoc!])
  // Điểm chuyên đề: 2 cửa sổ có điểm gần nhất. Thùy 08-18: hiện lại TÊN (07-25 từng bỏ, giờ cần
  // đọc nhanh không phải tra mã) + cho soi detail (lịch sử làm bài của chuyên đề đó).
  const cdDelta = c.sheet.chuyenDes.map((cd) => {
    const pts = cd.chuoi.filter((p) => p.score != null)
    if (pts.length < 2) return null
    const tu = pts[pts.length - 2].score!, den = pts[pts.length - 1].score!
    return { ma: cd.ma_chuyen_de, ten: cd.ten_chuyen_de, tu, den, delta: den - tu }
  }).filter(Boolean) as { ma: string; ten: string; tu: number; den: number; delta: number }[]
  // Dạng CÓ thay đổi điểm (gồm "mới" nếu đáng chú ý) — dùng để LOẠI khỏi "yếu ổn định" bên dưới,
  // không còn render bảng riêng theo chuyên đề nữa (Thùy 08-22: gộp vào drawer cho gọn).
  const doiDang = dangs.filter((d) => d.scoreTruoc == null ? (d.trongDien || d.muc !== 'dat') : Math.abs(d.score - d.scoreTruoc) > 0.005)
  // Dạng đứng yên NHƯNG đang trong diện (yếu ổn định) — khối riêng để không bị bỏ sót (clarify #1).
  const dienYen = dangs.filter((d) => d.trongDien && !doiDang.includes(d))

  const [moDrawer, setMoDrawer] = useState(false)

  return (
    <>
      {/* 2 CỘT như mockup (Thùy 08-22: "để thừa siêu nhiều không gian trống theo chiều ngang,
          muốn quan sát toàn bộ trong 1 màn hình") — TRÁI 360px = Duyệt + lịch sử (gọn, không đổi
          theo nội dung); PHẢI = phần còn lại co giãn, chứa "vì sao cần lưu ý" + so lớp. */}
      <div className="grid items-start gap-3 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-3">
          {/* Tóm tắt nhanh — Thùy 08-22 vòng 2: chuyển từ header xuống đây, đúng chỗ cột trái đang
              trống, thay vì nằm phẳng lì trên đầu chiếm hết chiều rộng mà rỗng nội dung. */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px]">
              <span className="text-slate-400">▥ Level hiện tại</span>
              <span className="font-semibold text-slate-700">L{c.sheet.levelKienThuc} · {TEN_KT[c.sheet.levelKienThuc]}</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px]">
              <span className="text-slate-400">◫ Thái độ</span>
              <span className="truncate font-semibold text-slate-700">{thaiDoTomTat(c.sheet.thaiDo)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px]">
              <span className="text-slate-400">! Dạng yếu ổn định</span>
              <span className="font-semibold text-slate-700">{dienYen.length}</span>
            </div>
          </div>

          {/* ── Duyệt (máy đề xuất, người quyết) — caller tự chọn widget qua children ── */}
          {children}

          <Khoi ten={`Lịch sử duyệt (${log.length})`}>
            {log.length === 0 ? <p className="text-[11px] text-slate-400">Chưa có lượt duyệt nào.</p> : (
              <ul className="max-h-[140px] space-y-1 overflow-y-auto pr-1">
                {log.map((r) => (
                  <li key={r.id} className="text-[11px] text-slate-600">
                    <span className="text-slate-400">{new Date(r.created_at).toLocaleString('vi-VN')}</span>
                    {' · '}{r.loai === 'kien_thuc' ? 'Kiến thức' : 'Thái độ'}: L{r.level_cu} → <b>L{r.level_chot}</b>
                    {r.lechVoiMay && <span className="ml-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-700 ring-1 ring-amber-200">máy đề xuất L{r.level_may_de_xuat}</span>}
                    {r.ly_do_nguoi && <span className="text-slate-500"> — {r.ly_do_nguoi}</span>}
                  </li>
                ))}
              </ul>
            )}
          </Khoi>
        </div>

        <div className="min-w-0 space-y-3">
        {/* ── VÙNG 1 — Vì sao cần lưu ý ────────────────────────────────────────────── */}
        <Khoi ten="Vì sao cần lưu ý">
          <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="text-[11px] text-slate-500">Thái độ</span>
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-semibold text-slate-700">{thaiDoTomTat(c.sheet.thaiDo)}</span>
              {c.sheet.thaiDo.length > 0 && (
                <button onClick={() => setMoChiTiet((v) => v === 'thaido' ? null : 'thaido')}
                  className="text-[10.5px] font-bold text-indigo-600 hover:underline">
                  {moChiTiet === 'thaido' ? 'ẩn' : 'soi buổi'}
                </button>
              )}
            </div>
          </div>
          {moChiTiet === 'thaido' && (
            <ul className="mb-2 space-y-0.5 rounded-lg bg-slate-50 p-2 text-[11px]">
              {c.sheet.thaiDo.map((t, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-slate-400">{new Date(t.t).toLocaleDateString('vi-VN')}</span>
                  <span className={t.thai_do === 'nghiem_tuc' ? 'text-slate-600' : 'font-semibold text-amber-700'}>{t.thai_do}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="max-h-[220px] overflow-y-auto">
            <table className="w-full text-[11.5px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-2.5 py-1.5">Chuyên đề</th><th className="px-2 py-1.5">Cũ → Mới</th><th className="px-2 py-1.5">Thay đổi</th><th className="px-2 py-1.5 text-right">Lịch sử</th>
                </tr>
              </thead>
              <tbody>
                {cdDelta.length === 0 ? (
                  <tr><td colSpan={4} className="px-2.5 py-2 text-slate-400">Chưa đủ 2 cửa sổ để so.</td></tr>
                ) : cdDelta.flatMap((x) => [
                  <tr key={x.ma} className="border-t border-slate-100">
                    <td className="px-2.5 py-1">
                      <span className="font-semibold text-slate-700">{x.ten}</span>
                      <span className="ml-1 text-[10px] text-slate-400">{x.ma}</span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-1 tabular-nums text-slate-500">{x.tu.toFixed(2)} → {x.den.toFixed(2)}</td>
                    <td className={`whitespace-nowrap px-2 py-1 font-bold tabular-nums ${deltaCls(x.delta)}`}>{x.delta >= 0 ? '↑ +' : '↓ '}{x.delta.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right">
                      <button onClick={() => toggleCd(x.ma)} className="text-[10.5px] font-bold text-indigo-600 hover:underline">
                        {moChiTiet === `cd:${x.ma}` ? 'ẩn' : 'soi lịch sử'}
                      </button>
                    </td>
                  </tr>,
                  moChiTiet === `cd:${x.ma}` ? (
                    <tr key={`${x.ma}-d`}>
                      <td colSpan={4} className="bg-slate-50 px-2.5 py-2">
                        {dangTaiCd === x.ma ? <p className="text-[10.5px] text-slate-400">Đang tải…</p> : (
                          <table className="w-full text-[11px] normal-case">
                            <thead><tr className="text-left text-[9.5px] uppercase text-slate-400">
                              <th className="py-0.5 font-normal">Dạng</th><th className="py-0.5 font-normal">Loại bài</th><th className="py-0.5 font-normal">Ngày</th><th className="py-0.5 text-right font-normal">DCS</th>
                            </tr></thead>
                            <tbody>
                              {(lichSuCd[x.ma] ?? []).length === 0 ? (
                                <tr><td colSpan={4} className="py-1 text-slate-400">Chưa có lần làm nào.</td></tr>
                              ) : (lichSuCd[x.ma] ?? []).map((l, i) => (
                                <tr key={i} className="border-t border-white">
                                  <td className="py-0.5 text-slate-600">{l.ten_dang}</td>
                                  <td className="py-0.5 text-slate-500">{l.nguon}</td>
                                  <td className="py-0.5 text-slate-400">{new Date(l.ngay).toLocaleDateString('vi-VN')}</td>
                                  <td className="py-0.5 text-right font-bold">
                                    <span className={l.result === 'correct' ? 'text-emerald-600' : l.result === 'partial' ? 'text-amber-600' : 'text-rose-600'}>
                                      {l.result === 'correct' ? 'Đ' : l.result === 'partial' ? 'C' : 'S'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  ) : null,
                ])}
              </tbody>
            </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 text-[11px]">
              <div>
                <b className="text-slate-600">Dạng đổi mức</b>{' '}
                {tut.length === 0 && len.length === 0 ? <span className="text-slate-400">không dạng nào đổi mức giữa 2 cửa sổ</span> : (
                  <span className="text-slate-500">
                    {tut.length > 0 && <span className="font-semibold text-rose-600">▼ {tut.length} tụt</span>}
                    {tut.length > 0 && len.length > 0 && ' · '}
                    {len.length > 0 && <span className="font-semibold text-emerald-600">▲ {len.length} lên</span>}
                  </span>
                )}
              </div>
              {dienYen.length + tut.length + len.length > 0 && (
                <button onClick={() => setMoDrawer(true)}
                  className="whitespace-nowrap rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 font-bold text-blue-700 hover:bg-blue-100">
                  Xem {dienYen.length} dạng yếu ổn định ↗
                </button>
              )}
            </div>
          </div>
        </Khoi>

        {/* ── VÙNG 2 — So với trung bình lớp theo từng bài ────────────────────────── */}
        <Khoi ten="So với trung bình lớp — 8 bài giám sát gần nhất">
          {c.sheet.soLop.length === 0 ? <p className="text-[11px] text-slate-400">Chưa có bài giám sát nào.</p> : (
            <div className="grid grid-cols-4 gap-1.5">
              {c.sheet.soLop.map((b) => {
                const tot = b.diemHS >= b.tbLop - 0.005
                return (
                  <div key={b.buoi_hoc_id} className={`rounded-lg border px-2 py-1.5 text-center tabular-nums ${tot ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
                    <div className={`whitespace-nowrap text-[13px] font-black ${tot ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {b.diemHS.toFixed(2)} <span className="text-[10.5px] font-semibold text-slate-400">/ {b.tbLop.toFixed(2)}</span>
                    </div>
                    <div className="mt-0.5 text-[10px] font-semibold text-slate-400">#{b.hang}/{b.siSo}</div>
                  </div>
                )
              })}
            </div>
          )}
          <p className="mt-1.5 text-[10.5px] text-slate-400">Mỗi ô = 1 bài có giám sát: điểm của em / trung bình lớp cùng bài · hạng trong số bạn cùng làm.</p>
        </Khoi>
        </div>
      </div>

      {moDrawer && <YeuOnDinhDrawer tut={tut} len={len} dienYen={dienYen} onClose={() => setMoDrawer(false)} />}
    </>
  )
}

// Slide-in drawer (Thùy 08-22, theo mockup) — thay bảng "Chi tiết dạng có thay đổi" cồng kềnh cũ:
// dạng ĐỔI MỨC (tut/len) + dạng YẾU ỔN ĐỊNH (dienYen, chưa đổi mức nhưng vẫn cần bổ trợ) gộp 1 chỗ.
function YeuOnDinhDrawer({ tut, len, dienYen, onClose }: { tut: DangStat[]; len: DangStat[]; dienYen: DangStat[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/25 p-6" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[480px] overflow-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[19px] font-extrabold text-slate-800">Chi tiết dạng có thay đổi</h2>
            <p className="mt-1 text-[12.5px] text-slate-500">
              {tut.length === 0 && len.length === 0 ? 'Không dạng nào đổi mức giữa 2 cửa sổ.' : `${tut.length} dạng tụt, ${len.length} dạng lên giữa 2 cửa sổ.`}
            </p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        {(tut.length > 0 || len.length > 0) && (
          <div className="mt-4">
            <div className="mb-2 text-[13px] font-bold text-slate-700">Dạng đổi mức</div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {[...tut, ...len].map((d) => (
                <div key={d.ma_dang} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-3 text-[13px] last:border-0">
                  <span className="text-slate-700">{d.ten_dang}</span>
                  <span className={`whitespace-nowrap font-bold tabular-nums ${MUC_RANK[d.muc] < MUC_RANK[d.mucTruoc!] ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {d.scoreTruoc!.toFixed(2)} → {d.score.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-3.5 py-3">
          <div className="text-[13px] font-extrabold text-orange-700">Đang trong diện bổ trợ, chưa đổi mức ({dienYen.length})</div>
          <p className="mt-1 text-[11.5px] text-slate-500">Yếu ổn định qua các cửa sổ — không "thay đổi" nên không nằm bảng trên, nhưng vẫn là việc cần làm.</p>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          {dienYen.length === 0 ? <p className="px-3.5 py-3 text-[12.5px] text-slate-400">Không có dạng nào.</p> : dienYen.map((d) => (
            <div key={d.ma_dang} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-3 text-[13px] last:border-0">
              <span className="text-slate-700">{d.ten_dang}</span>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-extrabold text-rose-600">{d.score.toFixed(2)} yếu</span>
                <span className="text-slate-400">n {d.n}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Modal chrome (header/close/overlay) — nội dung THẬT nằm ở `CandidateDetailBody` (tái dùng ở
// DuyetBoTroYeuScreen.tsx). Tách để không lặp code chrome/nội dung.
function ChiTietModal({ c, onDong, onXong }: { c: Candidate; onDong: () => void; onXong: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/40 p-8" onClick={onDong}>
      <div className="w-full max-w-[1300px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <CandidateHeader c={c} phu={`${c.mon} · kỳ ${cuaSoHienTai()}`} onDong={onDong} />
        <CandidateDetailBody c={c}>
          <div className="space-y-4">
            <DuyetKhoi c={c} loai="kien_thuc" ten="Level kiến thức" hienTai={c.sheet.levelKienThuc} deXuat={c.deXuatKienThuc} onXong={onXong} />
            <DuyetKhoi c={c} loai="thai_do" ten="Level thái độ" hienTai={c.sheet.levelThaiDo} deXuat={c.deXuatThaiDo} onXong={onXong} />
          </div>
        </CandidateDetailBody>
      </div>
    </div>
  )
}

// Thùy 08-22 vòng 2: bỏ `mb-4` riêng (chồng với `space-y-3` của cột cha → thừa khoảng cách),
// giảm padding/tiêu đề cho gọn chiều cao.
const Khoi = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">{ten}</h4>
    {children}
  </div>
)

// ── Nhãn + màu cho popup chi tiết ─────────────────────────────────────────────
const MUC_RANK: Record<'dat' | 'can_luyen' | 'yeu', number> = { yeu: 0, can_luyen: 1, dat: 2 }
// Tụt = xấu = đỏ · lên = tốt = xanh (KHÔNG neon, theo design system). 0 = xám.
const deltaCls = (d: number) => d < -0.005 ? 'text-rose-600' : d > 0.005 ? 'text-green-700' : 'text-slate-400'
// Tóm thái độ: đếm buổi dưới chuẩn "nghiêm túc" trong dữ liệu đang có.
function thaiDoTomTat(td: { thai_do: string; t: string }[]): string {
  if (!td.length) return 'chưa có dữ liệu thái độ'
  const duoi = td.filter((x) => x.thai_do !== 'nghiem_tuc').length
  return duoi === 0 ? `${td.length}/${td.length} buổi nghiêm túc — không có tín hiệu` : `${duoi}/${td.length} buổi dưới nghiêm túc`
}

// Người duyệt: mặc định = đề xuất của máy, sửa được. Ghi log CẢ HAI VẾ ⇒ delta tự lộ.
// Export cho `DuyetBoTroYeuScreen.tsx` tái dùng nguyên logic duyệt + mở case (Thùy 08-18: tách
// "Duyệt bổ trợ" thành 1 tab riêng, KHÔNG viết lại — DRY, tránh 2 đường mở case lệch nhau).
export function DuyetKhoi({ c, loai, ten, hienTai, deXuat, onXong }: {
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
      // Kiến thức L1-L3 = đang bổ trợ → mở/gộp case `bo_tro_yeu` (PLAN-botro-yeu.md §0 mục 10:
      // thái độ KHÔNG BAO GIỜ mở case). Gọi cả khi `chot === hienTai` ("giữ nguyên & ghi log") vì
      // `dien` (dạng yếu) có thể đã lớn thêm từ lần duyệt trước — gộp dạng mới, không bỏ sót.
      if (loai === 'kien_thuc' && chot >= 1) {
        const nguon: NguonBoTroYeu = c.kenh.includes('chuong_do') ? 'chuong_do'
          : c.kenh.includes('tien_quyet') ? 'gv_tien_quyet' : 'ai_de_xuat'
        await moHoacGopCaseBoTroYeu({
          hocSinhId: c.hoc_sinh_id, mon: c.mon,
          maDangs: (deXuat.bangChung?.dien as string[] | undefined) ?? [],
          nguon, lyDo: lyDo.trim() || deXuat.lyDo.join('; ') || null,
        })
      }
      onXong()
    } finally { setBusy(false) }
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-2.5">
      <h4 className="text-[12px] font-extrabold text-slate-800">{loai === 'kien_thuc' ? '📘' : '🧭'} {ten}</h4>
      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
        <span>Hiện tại</span>
        <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 font-bold text-slate-700">{lvUI(hienTai, loai).ten}</span>
      </div>
      {deXuat.lyDo.length > 0 && (
        <div className="mt-1.5 max-h-[54px] space-y-0.5 overflow-y-auto rounded-lg border border-slate-100 bg-white px-2 py-1 text-[10.5px] text-slate-500">
          {deXuat.lyDo.map((l: string, i: number) => <div key={i}>· {l}</div>)}
        </div>
      )}
      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((lv) => (
          <button key={lv} onClick={() => setChot(lv)}
            className={`h-7 rounded-lg text-[11.5px] font-extrabold transition ${
              chot === lv ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200'
              : 'border border-slate-200 bg-white text-slate-500 hover:-translate-y-px hover:border-indigo-200'}`}>
            L{lv}{lv === deXuat.deXuat ? ' ★' : ''}
          </button>
        ))}
      </div>
      {lech && <p className="mt-1 text-[10px] font-medium text-amber-600">Khác đề xuất máy (L{deXuat.deXuat}) — nên ghi lý do.</p>}
      <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (tuỳ chọn)…"
        className="mt-1.5 h-7 w-full rounded-lg border border-slate-200 px-2 text-[11.5px] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50" />
      <button disabled={busy} onClick={luu}
        className="mt-1.5 h-7 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-[11.5px] font-extrabold text-white shadow-md shadow-indigo-200 transition hover:brightness-105 disabled:opacity-50">
        {busy ? 'Đang lưu…' : chot === hienTai ? 'Giữ nguyên & ghi log' : `Duyệt → L${chot}`}
      </button>
      <p className="mt-1.5 text-[10px] text-slate-400">★ = máy đề xuất. Mọi lượt duyệt đều được ghi lại.</p>
    </div>
  )
}
