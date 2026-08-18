// ============================================================================
// HocSinhApp — app HS-facing (mobile) làm BTVN online. Slice 1: trắc nghiệm + trả lời ngắn.
// Luồng (Thùy chốt): 1 câu/màn → chọn đáp án → "Xác nhận" (tránh ấn nhầm) → chấm tức thì
//   → hiện đáp án + lời giải chi tiết của câu → "Câu tiếp". BTVN reveal ngay, làm lại tới hạn.
// Skin = plain-clean; game (Fredoka/mascot/gradient) làm phiên design sau.
// ============================================================================
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { MathText } from '../kho/ui'
import {
  listBaiTestCuaHS, getBaiTestFull, moBaiLam, traLoiCau, baoSai, nopBai, chuCaiChon, chiSoCuaChu,
  getETDe, luuDapAnET, nopET, getETDapAnDaLuu, xemGoiY, daHetHan,
  type BaiTestCuaHS, type BaiTestFull, type BaiLamCau, type ETCauDe, type ETReveal,
} from '../../lib/testonline'
import { mucDeadline, nhanConLai } from '../../lib/tuan'
import { seededShuffleWithOrig, seededPermByDang } from '../../lib/shuffle'
import DoiMatKhau from './DoiMatKhau'

type Chon = number | string | (string | null)[] | null // TN=index · TLN=chuỗi · ĐS=mảng 'D'/'S'
type CauState = { chon: Chon; kq: { verdict: string; key: unknown; baiLamCauId: string } | null; baoRoi?: boolean }
type MenhDeSnap = { noi_dung: string; loi_giai?: string | null }

const LOAI_TEN: Record<string, string> = { btvn: 'BTVN', et: 'ET', giao_trinh: 'Bài tập', de_thi: 'Đề thi' }
// Chế độ THI (giấu đáp án tới khi nộp, chấm server, chỉ tính lần nộp đầu) — ET và đề thi trường/sở đều vậy.
const THI_LOAI = new Set(['et', 'de_thi'])

// ── MÀN CHÍNH = 6 Ô VUÔNG (Thùy chốt 17/08) ─────────────────────────────────
// 3 ô đầu nối THẲNG với tài liệu trên lớp: mỗi ô = 1 loại doc phát hành từ Kho
// (giáo trình buổi → giao_trinh · ET → et · BTVN → btvn). Không thêm gì ở tầng dữ
// liệu — chỉ tách danh sách phẳng cũ thành 3 cửa.
// 3 ô sau CHƯA build (spec đã có, xem spec-test-online.md §12): tự luyện (hệ tự sinh
// 10 câu theo dạng yếu, ĐẾM vào mastery) · thông tin học tập (dạng yếu + %Đ-C-S theo
// dạng/chuyên đề + xếp hạng lớp/khối) · làm đề thi thử (đề trường/sở, sắp nhập nhiều).
// 2 CỘT — màn điện thoại dọc (Thùy: "màn hình điện thoại là dọc mà").
type KhuId = 'giao_trinh' | 'et' | 'btvn' | 'tu_luyen' | 'thong_tin' | 'de_thi_thu'
const KHU: { id: KhuId; ten: string; icon: string; loai?: string }[] = [
  { id: 'giao_trinh', ten: 'Bài tập trên lớp', icon: '📓', loai: 'giao_trinh' },
  { id: 'et', ten: 'ET', icon: '📋', loai: 'et' },
  { id: 'btvn', ten: 'BTVN', icon: '🏠', loai: 'btvn' },
  { id: 'tu_luyen', ten: 'Tự luyện', icon: '🎯' },
  { id: 'thong_tin', ten: 'Thông tin học tập', icon: '📈' },
  { id: 'de_thi_thu', ten: 'Làm đề thi thử', icon: '📄' },
]

export default function HocSinhApp({ hocSinhId, hoTen, maHS }: { hocSinhId: string; hoTen: string; maHS: string }) {
  const [tests, setTests] = useState<BaiTestCuaHS[] | null>(null)
  const [active, setActive] = useState<BaiTestCuaHS | null>(null)
  const [tab, setTab] = useState<'chua' | 'xong'>('chua')
  const [doiMK, setDoiMK] = useState(false)
  const [khu, setKhu] = useState<KhuId | null>(null) // null = màn chính 6 ô

  useEffect(() => { listBaiTestCuaHS().then(setTests).catch(() => setTests([])) }, [])

  if (doiMK) return <DoiMatKhau maHS={maHS} batBuoc={false} onXong={() => setDoiMK(false)} />

  if (active) {
    const back = () => { setActive(null); listBaiTestCuaHS().then(setTests) }
    return THI_LOAI.has(active.loai)
      ? <LamET test={active} hocSinhId={hocSinhId} onXong={back} />
      : <LamBai baiTestId={active.id} hocSinhId={hocSinhId} onXong={back} />
  }

  const xongCua = (t: BaiTestCuaHS) => t.bai_lam?.trang_thai === 'da_nop'
  const cuaKhu = (id: KhuId) => {
    const loai = KHU.find((k) => k.id === id)?.loai
    return loai ? (tests ?? []).filter((t) => t.loai === loai) : []
  }
  // Danh tính hiển thị: lấy từ chính test HS thấy (đã qua RLS) — không query thêm bảng nào.
  const lopMon = tests?.[0] ? `${tests[0].lop_ten} · ${tests[0].mon}` : null

  const dinhDanh = (
    <div className="flex items-center gap-3 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[15px] font-semibold text-indigo-700">
        {hoTen.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-slate-900">{hoTen}</p>
        <p className="truncate text-[13px] text-slate-500">{maHS.toUpperCase()}{lopMon ? ` · ${lopMon}` : ''}</p>
      </div>
      <button onClick={() => setDoiMK(true)} title="Đổi mật khẩu"
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-500">🔑</button>
      <button onClick={() => supabase.auth.signOut()}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-500">Thoát</button>
    </div>
  )

  // ── MÀN CHÍNH: 6 ô vuông, 2 cột ───────────────────────────────────────────
  if (!khu) return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 px-4 pb-10">
      {dinhDanh}
      <div className="grid grid-cols-2 gap-3">
        {KHU.map((k) => {
          const sapCo = !k.loai
          const ds = sapCo ? [] : cuaKhu(k.id)
          // Badge = việc CÒN LÀM ĐƯỢC. Bài quá hạn vẫn hiện trong danh sách (Thùy: "hiện quá hạn
          // thôi") nhưng không đếm vào badge — badge mà đếm cả thứ không bấm được thì thành nhiễu.
          const nChuaLam = ds.filter((t) => !xongCua(t) && !daHetHan(t)).length
          const nQuaHan = ds.filter((t) => !xongCua(t) && daHetHan(t)).length
          return (
            <button key={k.id} disabled={sapCo} onClick={() => { setKhu(k.id); setTab('chua') }}
              className={`relative flex aspect-square flex-col justify-between rounded-2xl border p-3.5 text-left transition ${
                sapCo ? 'border-dashed border-slate-300 bg-slate-100' : 'border-slate-200 bg-white active:scale-[0.98]'}`}>
              <span className={`text-2xl ${sapCo ? 'opacity-40' : ''}`}>{k.icon}</span>
              <span>
                <span className={`block text-[15px] font-semibold ${sapCo ? 'text-slate-400' : 'text-slate-900'}`}>{k.ten}</span>
                <span className={`mt-0.5 block text-[12.5px] ${nChuaLam === 0 && nQuaHan > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {sapCo ? 'Sắp có' : tests === null ? '…'
                    : nChuaLam > 0 ? `${nChuaLam} bài chưa làm`
                    : nQuaHan > 0 ? `${nQuaHan} bài quá hạn`
                    : ds.length ? 'Xong hết rồi' : 'Chưa có bài'}
                </span>
              </span>
              {nChuaLam > 0 && (
                <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[12px] font-semibold text-white">{nChuaLam}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  // ── DANH SÁCH 1 KHU ───────────────────────────────────────────────────────
  const dsKhu = cuaKhu(khu)
  const nChua = dsKhu.filter((t) => !xongCua(t)).length
  const nXong = dsKhu.filter(xongCua).length
  const shown = dsKhu.filter((t) => (tab === 'xong' ? xongCua(t) : !xongCua(t)))
  const tenKhu = KHU.find((k) => k.id === khu)?.ten ?? ''

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 px-4 pb-10">
      <div className="flex items-center gap-2 py-4">
        <button onClick={() => setKhu(null)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-500">‹</button>
        <p className="text-lg font-semibold text-slate-900">{tenKhu}</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1">
        {([['chua', 'Chưa làm', nChua], ['xong', 'Hoàn thành', nXong]] as const).map(([k, label, n]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-lg py-2 text-[14px] font-medium transition ${tab === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            {label} {n > 0 && <span className="text-[12px] text-slate-400">({n})</span>}
          </button>
        ))}
      </div>

      {tests === null && <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>}
      {tests && shown.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-3xl">{tab === 'xong' ? '📭' : '🎉'}</p>
          <p className="mt-2 text-sm font-medium text-slate-700">{tab === 'xong' ? 'Chưa hoàn thành bài nào' : 'Không có bài nào cần làm'}</p>
          <p className="mt-1 text-[13px] text-slate-400">{tab === 'xong' ? 'Làm xong bài sẽ chuyển sang đây.' : `Khi thầy cô giao ${tenKhu.toLowerCase()}, bài sẽ hiện ở đây.`}</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {shown.map((t) => {
          const lam = t.bai_lam
          const daNop = xongCua(t)
          const laThi = THI_LOAI.has(t.loai)
          // Quá hạn mà CHƯA nộp → khoá, không mở được nữa. Đã nộp rồi thì vẫn xem lại được.
          const hetHan = daHetHan(t)
          const khoa = hetHan && !daNop
          const dlMs = t.deadline ? new Date(t.deadline).getTime() : null
          const muc = mucDeadline(dlMs)
          return (
            <button key={t.id} disabled={khoa} onClick={() => setActive(t)}
              className={`rounded-2xl border p-4 text-left transition ${
                khoa ? 'border-slate-200 bg-slate-100' : `bg-white active:scale-[0.99] ${laThi ? 'border-violet-200' : 'border-slate-200'}`}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[15px] font-semibold ${khoa ? 'text-slate-500' : 'text-slate-900'}`}>
                  {laThi && <span className="mr-1.5 rounded bg-violet-100 px-1.5 py-0.5 text-[11px] font-semibold text-violet-700">THI</span>}
                  {LOAI_TEN[t.loai] ?? 'Bài'} {t.mon} · {t.lop_ten}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  daNop ? 'bg-emerald-50 text-emerald-700' : khoa ? 'bg-rose-50 text-rose-700'
                  : lam ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'}`}>
                  {daNop ? '✓ hoàn thành' : khoa ? 'quá hạn' : lam ? 'đang làm' : 'mới'}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-slate-500">Buổi {fmtNgay(t.ngay)} · {t.so_cau} câu{laThi ? ' · nộp 1 lần' : ''}</p>
              {dlMs !== null && !daNop && (
                <p className={`mt-1 text-[12.5px] font-medium ${
                  muc === 'qua_han' ? 'text-rose-600' : muc === 'sat' ? 'text-orange-600' : muc === 'gan' ? 'text-amber-600' : 'text-slate-400'}`}>
                  ⏳ Hạn {fmtHan(t.deadline!)} · {nhanConLai(dlMs)}
                </p>
              )}
              <p className={`mt-2 text-[13px] font-medium ${khoa ? 'text-slate-400' : 'text-indigo-600'}`}>
                {khoa ? 'Đã đóng — không nộp được nữa' : `${daNop ? 'Xem lại' : lam ? 'Tiếp tục' : 'Bắt đầu'} →`}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LamBai({ baiTestId, hocSinhId, onXong }: { baiTestId: string; hocSinhId: string; onXong: () => void }) {
  const [full, setFull] = useState<BaiTestFull | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [st, setSt] = useState<Record<string, CauState>>({})
  const [busy, setBusy] = useState(false)
  const [nopped, setNopped] = useState(false)
  const [goiY, setGoiY] = useState(false)

  useEffect(() => {
    (async () => {
      const f = await getBaiTestFull(baiTestId)
      setFull(f)
      const bl = await moBaiLam(baiTestId, hocSinhId)
      setBaiLamId(bl.id)
      // Khôi phục câu đã làm (reveal lại kết quả)
      const init: Record<string, CauState> = {}
      for (const [cauId, r] of Object.entries(f.daLam)) {
        const c = f.caus.find((x) => x.id === cauId)
        init[cauId] = { chon: (r as BaiLamCau).dap_an_hs as number | string, kq: { verdict: (r as BaiLamCau).verdict ?? 'wrong', key: c?.dap_an_key, baiLamCauId: (r as BaiLamCau).id } }
      }
      setSt(init)
    })().catch(console.error)
  }, [baiTestId, hocSinhId])

  useEffect(() => { setGoiY(false) }, [idx]) // đổi câu → ẩn gợi ý

  // Làm xong HẾT câu → đánh dấu HOÀN THÀNH (bai_lam da_nop). Idempotent (claim atomic).
  useEffect(() => {
    if (!full || !baiLamId || nopped) return
    if (full.caus.length > 0 && full.caus.every((c) => st[c.id]?.kq)) { setNopped(true); nopBai(baiLamId).catch(() => {}) }
  }, [st, full, baiLamId, nopped])

  // Xáo THỨ TỰ CÂU theo (HS×bài) — ổn định (mở lại vẫn thấy đúng thứ tự cũ), khác nhau giữa các HS
  // (chống liếc bài). CHỈ xáo câu TRONG CÙNG 1 DẠNG, giữ nguyên khối/thứ tự các dạng (xem shuffle.ts).
  // Chấm/khôi phục vẫn khớp `cau.id`, không phụ thuộc vị trí → an toàn tuyệt đối.
  const caus = useMemo(() => (full ? seededPermByDang(full.caus, `${hocSinhId}:${baiTestId}:q`).map((i) => full.caus[i]) : []), [full, hocSinhId, baiTestId])

  if (!full) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải bài…</div>
  const total = caus.length
  const daXongHet = caus.every((c) => st[c.id]?.kq)
  const cau = caus[idx]
  const cs = cau ? st[cau.id] : undefined
  const daCham = !!cs?.kq
  const laTN = cau?.loai_cau === 'trac_nghiem'
  const laDS = cau?.loai_cau === 'dung_sai'
  const menhDe: MenhDeSnap[] = laDS ? ((cau!.menh_de as MenhDeSnap[]) ?? []) : []
  const keyDS: string[] = laDS ? ((cau!.dap_an_key as string[]) ?? []) : []
  const chonArr: (string | null)[] = laDS ? ((cs?.chon as (string | null)[]) ?? menhDe.map(() => null)) : []
  // Xáo THỨ TỰ ĐÁP ÁN hiển thị (TN 4 phương án · ĐS 4 mệnh đề) theo (HS×bài×câu) — orig = chỉ số GỐC
  // dùng để ghi state/so đáp án đúng; dispI = vị trí hiển thị (chỉ để đặt nhãn A/B/C/D · a/b/c/d).
  const optsShown = laTN && cau ? seededShuffleWithOrig(cau.lua_chon ?? [], `${hocSinhId}:${baiTestId}:${cau.id}:opt`) : []
  const correctOrigTN = laTN && daCham && cau ? chiSoCuaChu(cau.dap_an_key) : -1
  const menhOrder = laDS && cau ? seededShuffleWithOrig(menhDe, `${hocSinhId}:${baiTestId}:${cau.id}:ds`) : []
  // Đã chọn đủ để Xác nhận? TN=đã chọn 1 · TLN=nhập khác rỗng · ĐS=đủ 4 ý.
  const daDu = laTN ? typeof cs?.chon === 'number'
    : laDS ? (chonArr.length === menhDe.length && menhDe.length > 0 && chonArr.every((x) => x != null))
    : (typeof cs?.chon === 'string' && cs.chon.trim() !== '')

  function setChon(v: Chon) {
    if (!cau || daCham) return
    setSt((s) => ({ ...s, [cau.id]: { chon: v, kq: null } }))
  }
  function setDS(i: number, v: 'D' | 'S') {
    if (!cau || daCham) return
    const cur = (st[cau.id]?.chon as (string | null)[]) ?? menhDe.map(() => null)
    const next = [...cur]; next[i] = v
    setSt((s) => ({ ...s, [cau.id]: { chon: next, kq: null } }))
  }

  async function xacNhan() {
    if (!cau || !baiLamId || !cs || !daDu) return
    setBusy(true)
    try {
      const kq = await traLoiCau(baiLamId, cau, cs.chon)
      setSt((s) => ({ ...s, [cau.id]: { chon: cs.chon, kq: { verdict: kq.verdict, key: kq.key, baiLamCauId: kq.baiLamCauId } } }))
    } finally { setBusy(false) }
  }

  async function guiBaoSai() {
    if (!cau || !cs?.kq) return
    await baoSai(cs.kq.baiLamCauId, hocSinhId, 'Em nghĩ mình đúng.')
    setSt((s) => ({ ...s, [cau.id]: { ...s[cau.id], baoRoi: true } }))
  }

  // Màn kết quả cuối
  if (idx >= total) {
    const dung = caus.filter((c) => st[c.id]?.kq?.verdict === 'correct').length
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">🏆</div>
        <p className="mt-4 text-2xl font-bold text-slate-900">{dung} / {total} đúng</p>
        <p className="mt-1 text-[13px] text-slate-500">Làm lại được tới hạn nộp. Kết quả gửi thầy cô tham khảo.</p>
        <button onClick={onXong} className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white">Về danh sách</button>
      </div>
    )
  }

  const vd = daCham ? cs!.kq!.verdict : ''
  const boxCls = vd === 'correct' ? 'bg-emerald-50' : vd === 'partial' ? 'bg-amber-50' : 'bg-rose-50'
  const txtCls = vd === 'correct' ? 'text-emerald-700' : vd === 'partial' ? 'text-amber-700' : 'text-rose-700'
  const dsDung = laDS && daCham ? chonArr.filter((x, i) => x != null && String(x).toUpperCase() === String(keyDS[i]).toUpperCase()).length : 0
  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-slate-50">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onXong} className="text-slate-400">✕</button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="text-[12px] text-slate-500">{idx + 1}/{total}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-slate-400">Câu {idx + 1}</p>
            {cau.ly_thuyet && (
              <button onClick={() => setGoiY((v) => {
                const nv = !v
                // Ghi vết lúc MỞ (không cần lúc đóng) — GV xem live biết ai đang cần gợi ý. Fire-and-forget.
                if (nv && baiLamId) xemGoiY(baiLamId, cau.id).catch(() => {})
                return nv
              })}
                className={`rounded-full border px-3 py-1 text-[12px] font-medium transition ${goiY ? 'border-amber-300 bg-amber-100 text-amber-800' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                💡 Gợi ý
              </button>
            )}
          </div>
          {goiY && cau.ly_thuyet && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
              <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-amber-700">Lý thuyết dạng bài</p>
              <div className="text-[14px] leading-relaxed text-slate-700"><MathText>{cau.ly_thuyet}</MathText></div>
            </div>
          )}
          {cau.noi_dung && <div className="mb-3 text-[15px] leading-relaxed text-slate-800"><MathText>{cau.noi_dung}</MathText></div>}
          {cau.anh_de && <img src={cau.anh_de} alt="đề" className="mb-3 max-h-80 rounded-lg border border-slate-200" />}

          {laTN ? (
            <div className="flex flex-col gap-2.5">
              {optsShown.map(({ item: opt, orig }, dispI) => {
                const chon = cs?.chon === orig
                const laDapAn = daCham && orig === correctOrigTN
                const chonSai = daCham && chon && !laDapAn
                return (
                  <button key={orig} onClick={() => setChon(orig)} disabled={daCham}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-[15px] transition ${
                      laDapAn ? 'border-emerald-400 bg-emerald-50' : chonSai ? 'border-rose-400 bg-rose-50' : chon ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                      laDapAn ? 'bg-emerald-500 text-white' : chonSai ? 'bg-rose-500 text-white' : chon ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{chuCaiChon(dispI)}</span>
                    <span className="flex-1 pt-0.5"><MathText>{stripLabel(opt)}</MathText></span>
                  </button>
                )
              })}
            </div>
          ) : laDS ? (
            <div className="flex flex-col gap-2.5">
              {menhOrder.map(({ item: m, orig }, dispI) => {
                const key = String(keyDS[orig] ?? '').toUpperCase()
                const pick = chonArr[orig] ? String(chonArr[orig]).toUpperCase() : null
                return (
                  <div key={orig} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex gap-2 text-[15px] text-slate-800">
                      <span className="font-semibold text-slate-400">{'abcd'[dispI] ?? dispI + 1})</span>
                      <span className="flex-1"><MathText>{m.noi_dung}</MathText></span>
                    </div>
                    <div className="flex gap-2">
                      {(['D', 'S'] as const).map((v) => {
                        const on = pick === v
                        const dungChoi = daCham && v === key       // đáp án đúng của ý
                        const saiChoi = daCham && on && v !== key   // HS chọn sai
                        return (
                          <button key={v} onClick={() => setDS(orig, v)} disabled={daCham}
                            className={`flex-1 rounded-lg border py-1.5 text-[13px] font-medium transition ${
                              dungChoi ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : saiChoi ? 'border-rose-400 bg-rose-50 text-rose-700' : on ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`}>
                            {v === 'D' ? 'Đúng' : 'Sai'}
                          </button>
                        )
                      })}
                    </div>
                    {daCham && m.loi_giai && <div className="mt-2 border-t border-black/5 pt-1.5 text-[13px] text-slate-600"><MathText>{m.loi_giai}</MathText></div>}
                  </div>
                )
              })}
            </div>
          ) : (
            <input value={(cs?.chon as string) ?? ''} onChange={(e) => setChon(e.target.value)} disabled={daCham}
              placeholder="Nhập đáp án…" inputMode="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-indigo-500 disabled:bg-slate-50" />
          )}

          {daCham && (
            <div className={`mt-4 rounded-xl p-3 ${boxCls}`}>
              <p className={`text-[15px] font-semibold ${txtCls}`}>
                {vd === 'correct' ? '🎉 Đúng hết!' : vd === 'partial' ? '👍 Đúng một phần' : '😔 Chưa đúng'}
                {laDS && <span className="ml-1 text-[13px] font-normal">· {dsDung}/{menhDe.length} ý đúng</span>}
              </p>
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && <p className="mt-1 text-[13px] text-slate-600">Đáp án đúng: <b className="text-emerald-700">{String(cau.dap_an_key)}</b></p>}
              {cau.loi_giai && (
                <div className="mt-2 border-t border-black/5 pt-2 text-[14px] leading-relaxed text-slate-700">
                  <p className="mb-1 text-[12px] font-semibold uppercase text-slate-400">Lời giải</p>
                  <MathText>{cau.loi_giai}</MathText>
                </div>
              )}
              {cau.anh_dap_an && <img src={cau.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg border border-slate-200" />}
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && (
                cs!.baoRoi
                  ? <p className="mt-2 text-[12px] text-slate-400">✓ Đã gửi ý kiến cho thầy cô.</p>
                  : <button onClick={guiBaoSai} className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-[12px] text-slate-600">🚩 Em nghĩ mình đúng</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        {idx > 0 && <button onClick={() => setIdx((i) => i - 1)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500">‹</button>}
        {!daCham ? (
          <button onClick={xacNhan} disabled={busy || !daDu}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white disabled:opacity-40">
            {busy ? 'Đang chấm…' : 'Xác nhận'}
          </button>
        ) : (
          <button onClick={() => setIdx((i) => i + 1)}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white">
            {idx + 1 < total ? 'Câu tiếp →' : (daXongHet ? 'Xem kết quả →' : 'Câu tiếp →')}
          </button>
        )}
      </div>
    </div>
  )
}

// ── ET chế độ THI: làm không lộ đáp án → Nộp 1 lần → reveal cả bài ──────────
function LamET({ test, hocSinhId, onXong }: { test: BaiTestCuaHS; hocSinhId: string; onXong: () => void }) {
  const [de, setDe] = useState<ETCauDe[] | null>(null)
  const [baiLamId, setBaiLamId] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [ans, setAns] = useState<Record<string, Chon>>({})
  const [reveal, setReveal] = useState<Record<string, ETReveal> | null>(null)
  const [goiY, setGoiY] = useState(false)
  const [confNop, setConfNop] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      // moBaiLam TRƯỚC getETDe: bien_the (mã đề gán riêng HS) chốt lúc mở slot, et_de đọc đúng
      // bien_the đó để trả đề. Đảo thứ tự là et_de luôn mặc định mã 1 (bai_lam chưa kịp tồn tại).
      const bl = await moBaiLam(test.id, hocSinhId)
      const d = await getETDe(test.id)
      setDe(d); setBaiLamId(bl.id)
      setAns(await getETDapAnDaLuu(bl.id) as Record<string, Chon>)
      if (bl.trang_thai === 'da_nop') { const rev = await nopET(bl.id); setReveal(Object.fromEntries(rev.map((r) => [r.bai_test_cau_id, r]))) }
    })().catch(console.error)
  }, [test.id, hocSinhId])
  useEffect(() => { setGoiY(false) }, [idx])
  // Xáo THỨ TỰ CÂU theo (HS×bài) — cùng cơ chế LamBai (xem ghi chú ở đó): chỉ xáo trong cùng 1 dạng.
  const caus = useMemo(() => (de ? seededPermByDang(de, `${hocSinhId}:${test.id}:q`).map((i) => de[i]) : []), [de, hocSinhId, test.id])

  if (!de) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải đề…</div>
  const total = caus.length
  const daNop = !!reveal
  const daTraLoi = caus.filter((c) => ans[c.id] != null && ans[c.id] !== '' && !(Array.isArray(ans[c.id]) && (ans[c.id] as unknown[]).some((x) => x == null))).length

  async function luu(cauId: string, v: Chon) {
    if (daNop || !baiLamId) return
    setAns((s) => ({ ...s, [cauId]: v }))
    try { await luuDapAnET(baiLamId, cauId, v) } catch (e) { console.error(e) }
  }
  async function doNop() {
    if (!baiLamId) return
    setBusy(true)
    try { const rev = await nopET(baiLamId); setReveal(Object.fromEntries(rev.map((r) => [r.bai_test_cau_id, r]))); setIdx(0); setConfNop(false) }
    finally { setBusy(false) }
  }

  const cau = caus[idx]
  const rv = daNop && cau ? reveal![cau.id] : undefined
  const laTN = cau?.loai_cau === 'trac_nghiem'
  const laDS = cau?.loai_cau === 'dung_sai'
  const keyDS = (rv?.dap_an_key as string[] | undefined) ?? []
  const menhDeReveal = (rv?.menh_de as { loi_giai?: string | null }[] | undefined) ?? []
  const chonArr = laDS ? ((ans[cau.id] as (string | null)[]) ?? (cau.menh_de ?? []).map(() => null)) : []
  const vd = rv?.verdict ?? ''
  // Xáo THỨ TỰ ĐÁP ÁN hiển thị (cùng cơ chế LamBai) — orig ghi state/so đúng, dispI chỉ để đặt nhãn.
  const optsShown = laTN && cau ? seededShuffleWithOrig(cau.lua_chon ?? [], `${hocSinhId}:${test.id}:${cau.id}:opt`) : []
  const correctOrigTN = laTN && daNop ? chiSoCuaChu(rv?.dap_an_key) : -1
  const menhOrder = laDS && cau ? seededShuffleWithOrig(cau.menh_de ?? [], `${hocSinhId}:${test.id}:${cau.id}:ds`) : []

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-slate-50">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onXong} className="text-slate-400">✕</button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-violet-200">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="text-[12px] text-slate-500">{idx + 1}/{total}</span>
      </div>
      {!daNop && <p className="px-4 pb-1 text-center text-[12px] text-violet-600">📝 Bài THI · nộp xong mới hiện đáp án · đã trả lời {daTraLoi}/{total}</p>}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-slate-400">Câu {idx + 1}</p>
            {cau.ly_thuyet && <button onClick={() => setGoiY((v) => !v)} className={`rounded-full border px-3 py-1 text-[12px] font-medium ${goiY ? 'border-amber-300 bg-amber-100 text-amber-800' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>💡 Gợi ý</button>}
          </div>
          {goiY && cau.ly_thuyet && <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[14px] leading-relaxed text-slate-700"><MathText>{cau.ly_thuyet}</MathText></div>}
          {cau.noi_dung && <div className="mb-3 text-[15px] leading-relaxed text-slate-800"><MathText>{cau.noi_dung}</MathText></div>}
          {cau.anh_de && <img src={cau.anh_de} alt="đề" className="mb-3 max-h-80 rounded-lg border border-slate-200" />}

          {laTN ? (
            <div className="flex flex-col gap-2.5">
              {optsShown.map(({ item: opt, orig }, dispI) => {
                const chon = ans[cau.id] === orig
                const laDapAn = daNop && orig === correctOrigTN
                const chonSai = daNop && chon && !laDapAn
                return (
                  <button key={orig} onClick={() => luu(cau.id, orig)} disabled={daNop}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left text-[15px] ${laDapAn ? 'border-emerald-400 bg-emerald-50' : chonSai ? 'border-rose-400 bg-rose-50' : chon ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${laDapAn ? 'bg-emerald-500 text-white' : chonSai ? 'bg-rose-500 text-white' : chon ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{chuCaiChon(dispI)}</span>
                    <span className="flex-1 pt-0.5"><MathText>{stripLabel(opt)}</MathText></span>
                  </button>
                )
              })}
            </div>
          ) : laDS ? (
            <div className="flex flex-col gap-2.5">
              {menhOrder.map(({ item: m, orig }, dispI) => {
                const pick = chonArr[orig] ? String(chonArr[orig]).toUpperCase() : null
                const key = daNop ? String(keyDS[orig] ?? '').toUpperCase() : null
                return (
                  <div key={orig} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex gap-2 text-[15px] text-slate-800"><span className="font-semibold text-slate-400">{'abcd'[dispI] ?? dispI + 1})</span><span className="flex-1"><MathText>{m.noi_dung}</MathText></span></div>
                    <div className="flex gap-2">
                      {(['D', 'S'] as const).map((v) => {
                        const on = pick === v
                        const dung = daNop && v === key
                        const sai = daNop && on && v !== key
                        return <button key={v} onClick={() => { const cur = (ans[cau.id] as (string | null)[]) ?? (cau.menh_de ?? []).map(() => null); const next = [...cur]; next[orig] = v; luu(cau.id, next) }} disabled={daNop}
                          className={`flex-1 rounded-lg border py-1.5 text-[13px] font-medium ${dung ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : sai ? 'border-rose-400 bg-rose-50 text-rose-700' : on ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-500'}`}>{v === 'D' ? 'Đúng' : 'Sai'}</button>
                      })}
                    </div>
                    {daNop && menhDeReveal[orig]?.loi_giai && <div className="mt-2 border-t border-black/5 pt-1.5 text-[13px] text-slate-600"><MathText>{menhDeReveal[orig].loi_giai as string}</MathText></div>}
                  </div>
                )
              })}
            </div>
          ) : (
            <input value={(ans[cau.id] as string) ?? ''} onChange={(e) => setAns((s) => ({ ...s, [cau.id]: e.target.value }))} onBlur={(e) => luu(cau.id, e.target.value)} disabled={daNop}
              placeholder="Nhập đáp án…" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-violet-500 disabled:bg-slate-50" />
          )}

          {daNop && (
            <div className={`mt-4 rounded-xl p-3 ${vd === 'correct' ? 'bg-emerald-50' : vd === 'partial' ? 'bg-amber-50' : 'bg-rose-50'}`}>
              <p className={`text-[15px] font-semibold ${vd === 'correct' ? 'text-emerald-700' : vd === 'partial' ? 'text-amber-700' : 'text-rose-700'}`}>{vd === 'correct' ? '🎉 Đúng' : vd === 'partial' ? '👍 Đúng một phần' : '😔 Chưa đúng'}</p>
              {cau.loai_cau === 'tra_loi_ngan' && vd !== 'correct' && <p className="mt-1 text-[13px] text-slate-600">Đáp án đúng: <b className="text-emerald-700">{String(rv?.dap_an_key)}</b></p>}
              {rv?.loi_giai && <div className="mt-2 border-t border-black/5 pt-2 text-[14px] leading-relaxed text-slate-700"><p className="mb-1 text-[12px] font-semibold uppercase text-slate-400">Lời giải</p><MathText>{rv.loi_giai}</MathText></div>}
              {rv?.anh_dap_an && <img src={rv.anh_dap_an} alt="lời giải" className="mt-2 max-h-72 rounded-lg border border-slate-200" />}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        {idx > 0 && <button onClick={() => setIdx((i) => i - 1)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500">‹</button>}
        {idx + 1 < total
          ? <button onClick={() => setIdx((i) => i + 1)} className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white">Câu tiếp →</button>
          : daNop
            ? <button onClick={onXong} className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-medium text-white">Xong</button>
            : <button onClick={() => setConfNop(true)} className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white">Nộp bài</button>}
      </div>

      {confNop && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6" onClick={() => setConfNop(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-semibold text-slate-900">Nộp bài thi?</p>
            <p className="mt-1 text-[13px] text-slate-500">Đã trả lời {daTraLoi}/{total} câu. Nộp xong sẽ chấm và <b>không sửa được</b> nữa.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfNop(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm text-slate-600">Để xem lại</button>
              <button onClick={doNop} disabled={busy} className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white disabled:opacity-40">{busy ? 'Đang nộp…' : 'Nộp bài'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function fmtNgay(d: string): string { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}` }
// Hạn nộp = timestamptz → hiển thị GIỜ VN (đừng để trình duyệt tự đoán múi giờ).
function fmtHan(iso: string): string {
  const vn = new Date(new Date(iso).getTime() + 7 * 3600000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(vn.getUTCDate())}/${p(vn.getUTCMonth() + 1)} ${p(vn.getUTCHours())}:${p(vn.getUTCMinutes())}`
}
// Bỏ nhãn "A." / "B." đầu lựa chọn (kho lưu "B. nội dung"; phần tử [0] thường mất nhãn).
function stripLabel(s: string): string { return s.replace(/^\s*[A-F][.)]\s*/, '') }
