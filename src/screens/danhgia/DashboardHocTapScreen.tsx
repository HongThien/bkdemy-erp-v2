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
import { listCandidatesLop, duyetLevel, getLevelLog, cuaSoHienTai, taoAiJob, getAiJob, getAiJobMoiNhat, type Candidate, type LevelLogRow, type AiJob } from '../../lib/danhgia'

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
                <div className="space-y-2">{duoiNguong.map((c) => <CandCard key={c.hoc_sinh_id} c={c} gon onMo={() => setMoHS(c)} />)}</div>
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
  const [job, setJob] = useState<AiJob | null>(null)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState(false)

  useEffect(() => { setJob(null); setLoi(null); if (lopId) getAiJobMoiNhat(lopId).then(setJob) }, [lopId])

  // Đang chạy thì hỏi lại mỗi 3s cho tới khi worker xong (job chạy nền, không giữ UI).
  useEffect(() => {
    if (!job || (job.trang_thai !== 'pending' && job.trang_thai !== 'processing')) return
    const t = setInterval(async () => { const m = await getAiJob(job.id); if (m) setJob(m) }, 3000)
    return () => clearInterval(t)
  }, [job?.id, job?.trang_thai])

  const hoi = async () => {
    setBusy(true); setLoi(null)
    try { const id = await taoAiJob(lopId); setJob(await getAiJob(id)); setMo(true) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
    finally { setBusy(false) }
  }

  const dangChay = job?.trang_thai === 'pending' || job?.trang_thai === 'processing'
  const kq = job?.trang_thai === 'done' ? job.ket_qua : null

  return (
    <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold text-slate-700">Nhận định của Claude</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Số liệu do hệ thống tính; Claude đọc rồi viết lý do và nêu độ tin. Vẫn là <b>đề xuất</b> — người duyệt mới đổi.
          </p>
        </div>
        <button disabled={busy || dangChay} onClick={hoi}
          className="rounded-lg bg-slate-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50">
          {dangChay ? 'Claude đang đọc…' : busy ? 'Đang gửi…' : kq ? 'Hỏi lại' : 'Nhờ Claude đọc'}
        </button>
      </div>

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
            {job?.model} · {job?.usage?.input_tokens?.toLocaleString('vi-VN')} token vào
            {job?.usage?.cache_read_input_tokens ? ` (${job.usage.cache_read_input_tokens.toLocaleString('vi-VN')} đọc từ cache)` : ''}
            {' · '}{job?.usage?.output_tokens?.toLocaleString('vi-VN')} token ra
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

function CandCard({ c, gon, onMo }: { c: Candidate; gon?: boolean; onMo: () => void }) {
  const ktDoi = c.deXuatKienThuc.deXuat !== c.sheet.levelKienThuc
  const tdDoi = c.deXuatThaiDo.deXuat !== c.sheet.levelThaiDo
  return (
    <button onClick={onMo} className="block w-full rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:ring-indigo-300">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-semibold text-slate-800">{c.ho_ten}</span>
        {c.kenh.map((k) => <Pill key={k} {...KENH_UI[k]} />)}
        <span className="ml-auto text-[11px] text-slate-400">ưu tiên {c.uuTien}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-slate-400">Kiến thức</span>
        <Pill {...lvUI(c.sheet.levelKienThuc, 'kien_thuc')} />
        {ktDoi && <><span className="text-slate-400">→ đề xuất</span><Pill {...lvUI(c.deXuatKienThuc.deXuat, 'kien_thuc')} /></>}
        <span className="ml-3 text-slate-400">Thái độ</span>
        <Pill {...lvUI(c.sheet.levelThaiDo, 'thai_do')} />
        {tdDoi && <><span className="text-slate-400">→ đề xuất</span><Pill {...lvUI(c.deXuatThaiDo.deXuat, 'thai_do')} /></>}
      </div>
      {!gon && (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3">
          {c.lyDo.map((l, i) => <li key={i} className="text-[13px] leading-relaxed text-slate-600">· {l}</li>)}
        </ul>
      )}
    </button>
  )
}

// ── Modal chi tiết + DUYỆT ────────────────────────────────────────────────────
function ChiTietModal({ c, onDong, onXong }: { c: Candidate; onDong: () => void; onXong: () => void }) {
  const [log, setLog] = useState<LevelLogRow[]>([])
  useEffect(() => { getLevelLog(c.hoc_sinh_id, c.mon).then(setLog) }, [c.hoc_sinh_id, c.mon])
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/40 p-8" onClick={onDong}>
      <div className="w-full max-w-[900px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-slate-800">{c.ho_ten}</h3>
            <p className="text-[12px] text-slate-500">{c.mon} · ưu tiên {c.uuTien}</p>
          </div>
          <button onClick={onDong} className="rounded-lg px-3 py-1.5 text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        <Khoi ten="Vì sao được nêu">
          <ul className="space-y-1">{c.lyDo.map((l, i) => <li key={i} className="text-[13px] text-slate-600">· {l}</li>)}</ul>
        </Khoi>

        <div className="grid gap-4 md:grid-cols-2">
          <DuyetKhoi c={c} loai="kien_thuc" ten="Level kiến thức" hienTai={c.sheet.levelKienThuc} deXuat={c.deXuatKienThuc} onXong={onXong} />
          <DuyetKhoi c={c} loai="thai_do" ten="Level thái độ" hienTai={c.sheet.levelThaiDo} deXuat={c.deXuatThaiDo} onXong={onXong} />
        </div>

        <Khoi ten={`Dạng trong diện bổ trợ (${c.deXuatKienThuc.bangChung.dien.length})`}>
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="pb-1">Dạng</th><th className="pb-1 text-right">Gộp</th><th className="pb-1 text-right">ET+MT</th><th className="pb-1 text-right">n</th><th className="pb-1">Mức</th>
            </tr></thead>
            <tbody>
              {c.sheet.dangs.filter((d) => d.trongDien || d.muc === 'yeu').slice(0, 12).map((d) => (
                <tr key={d.ma_dang} className="border-t border-slate-100">
                  <td className="py-1.5 pr-2 text-slate-700">{d.ten_dang}</td>
                  <td className="py-1.5 text-right font-semibold text-slate-800">{d.score.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-slate-500">{d.scoreEtMt?.toFixed(2) ?? '—'}</td>
                  <td className="py-1.5 text-right text-slate-400">{d.n}</td>
                  <td className="py-1.5 pl-2">{d.trongDien ? <Pill ten="Trong diện" cls="bg-orange-50 text-orange-700 ring-orange-200" /> : <span className="text-slate-400">{d.muc}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Khoi>

        <Khoi ten="Chuyên đề — trend">
          {c.sheet.chuyenDes.map((cd) => (
            <div key={cd.ma_chuyen_de} className="border-t border-slate-100 py-2 first:border-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-slate-700">{cd.ten_chuyen_de}</span>
                <span className="text-[12px] text-slate-500">
                  {cd.chuoi.map((p) => `${p.cuaSo.slice(5)}: ${p.score == null ? '—' : p.score.toFixed(2)}${p.itLanDo ? ' ⚠' : ''}`).join('   ')}
                </span>
              </div>
              {cd.dangDoiBucketXau.length > 0 && (
                <div className="mt-0.5 text-[12px] text-rose-600">▼ {cd.dangDoiBucketXau.length} dạng tụt: {cd.dangDoiBucketXau.map((d) => `${d.tu}→${d.den}`).join(', ')}</div>
              )}
            </div>
          ))}
          <p className="mt-2 text-[11px] text-slate-400">⚠ = cửa sổ đó ít lần đo, số vẫn tính nhưng độ tin thấp.</p>
        </Khoi>

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
