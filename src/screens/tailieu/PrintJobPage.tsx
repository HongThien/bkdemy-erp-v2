// Trang IN cho WORKER SERVER (07-12, đời 2 gen-link) — KHÔNG dành cho người dùng. Worker
// (worker/index.mjs) mở `/#pvjob=<taiLieuId>&loai=<loai>&at=<access>&rt=<refresh>` bằng Chrome thật
// (Puppeteer), chờ tín hiệu `window.__pvState === 'ready'` rồi gọi page.pdf({printBackground:true})
// → PDF CHỮ THẬT, đúng từng pixel bản Thùy vẫn in tay qua "🖨 In / Microsoft Print to PDF" (cùng CSS
// buildPagedCss, cùng engine in Chrome — không còn html2canvas tự vẽ lại, hết lớp bug canvas).
// Đăng nhập: token truyền qua hash (không qua server nào), setSession xong mới render — không đụng
// luồng auth của App.
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ETPrintView from './ETPrintView'
import PrintView from './PrintView'
import MTPrintView from './MTPrintView'
import DeThiPrintView from './DeThiPrintView'
import BTPrintView from './BTPrintView'
import HinhPrintView, { type BanIn as HinhBanIn, type HinhPerHS } from '../kho/hinh/HinhPrintView'
import { resolveBanIn as resolveBanInHinh, resolveEtBansHinh } from '../kho/hinh/GiaoTrinhScreen'
import { getHinhBuoiMeta, listGtBai as listGtBaiHinh } from '../../lib/kho/hinhGiaoTrinh'
import { loadLuoi } from '../../lib/kho/hinh'

declare global { interface Window { __pvState?: string } }

export function parsePvJobHash(): Record<string, string> | null {
  if (!location.hash.startsWith('#pvjob=')) return null
  const p = new URLSearchParams(location.hash.slice(1))
  const out: Record<string, string> = {}
  p.forEach((v, k) => { out[k] = v })
  return out
}

export default function PrintJobPage({ params }: { params: Record<string, string> }) {
  const [authed, setAuthed] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const id = params.pvjob
  const loai = params.loai ?? ''

  useEffect(() => {
    supabase.auth.setSession({ access_token: params.at ?? '', refresh_token: params.rt ?? '' })
      .then(({ error }) => {
        if (error) { window.__pvState = 'error:auth: ' + error.message; setErr(error.message) }
        else setAuthed(true)
      })
  }, []) // eslint-disable-line

  useEffect(() => { if (err) window.__pvState = 'error:' + err }, [err])

  // DEBOUNCE onReady: loại btvn/giao_trinh_buoi dựng lại 2-3 lần (tự chuyển scope + nạp tên lớp async
  // cho header) — bắn 'ready' ngay lần đầu là worker in BẢN DỞ (thiếu "Lớp X ·" trên header). Chờ 1.2s
  // không có lần dựng mới nào nữa mới coi là xong thật. ET/MT/đề thi dựng 1 lần → chỉ tốn thêm 1.2s.
  const readyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onReady = () => {
    clearTimeout(readyTimer.current)
    readyTimer.current = setTimeout(() => { window.__pvState = 'ready' }, 1200)
  }

  if (err) return <p style={{ padding: 20 }}>Lỗi: {err}</p>
  if (!authed || !id) return <p style={{ padding: 20 }}>⏳ đang đăng nhập…</p>

  const sig = {
    onClose: () => { /* trang job không có nút đóng */ },
    onReady,
    onRenderErr: (msg: string) => { clearTimeout(readyTimer.current); window.__pvState = 'error:' + msg; setErr(msg) },
  }
  // Dispatch đúng như KhoTaiLieuScreen: et → ETPrintView · de_thi → DeThiPrintView · mt/mt_buoi →
  // MTPrintView · bo_tro → BTPrintView · còn lại (giao_trinh / giao_trinh_buoi / btvn) → PrintView.
  if (loai === 'et') return <ETPrintView id={id} {...sig} />
  if (loai === 'de_thi') return <DeThiPrintView id={id} {...sig} />
  if (loai === 'mt' || loai === 'mt_buoi') return <MTPrintView id={id} {...sig} />
  if (loai === 'bo_tro') return <BTPrintView id={id} {...sig} />
  // ⭐ 22/08 — Hình: id = buoiId (KHÔNG phải tai_lieu.id), cần thêm `phan` (worker truyền qua hash —
  // xem processHinhJob() trong worker/index.mjs). HinhPrintView nhận `ban: BanIn` dựng sẵn (khác Đại
  // id-based) nên phải resolve TRƯỚC ở đây, không dispatch thẳng như các nhánh trên.
  if (loai === 'hinh_gt_buoi') return <HinhPrintJobBridge buoiId={id} phan={(params.phan as 'lop' | 'nha' | 'et') ?? 'lop'} {...sig} />
  return <PrintView id={id} {...sig} />
}

function HinhPrintJobBridge({ buoiId, phan, onClose, onReady, onRenderErr }: {
  buoiId: string; phan: 'lop' | 'nha' | 'et'; onClose: () => void; onReady: () => void; onRenderErr: (msg: string) => void
}) {
  const [ban, setBan] = useState<HinhBanIn | null>(null)
  const [perHS, setPerHS] = useState<HinhPerHS[] | undefined>(undefined)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      const meta = await getHinhBuoiMeta(buoiId)
      if (!meta) throw new Error('Không tìm thấy buổi Hình ' + buoiId)
      const L = await loadLuoi(meta.khoi)
      // ⭐ 23/08 — ET: 3 "mã đề" bản trống (resolveEtBansHinh), KHÔNG phải 1 phiếu đơn như lop/nha.
      if (phan === 'et') {
        const ngayFmt = meta.ngay ? meta.ngay.split('-').reverse().join('/') : ''
        const r = await resolveEtBansHinh(L, buoiId, meta.tenLop ?? '', ngayFmt)
        if (alive) { setBan(r.ban); setPerHS(r.perHS) }
        return
      }
      const bais = await listGtBaiHinh(buoiId)
      const ten = meta.tenLop && meta.ngay ? `${meta.tenLop} ${meta.ngay.split('-').reverse().join('/')} · ${meta.tieuDe || 'Buổi'}` : `${meta.tenGiaoTrinh} — ${meta.tieuDe || 'Buổi'}`
      const b = await resolveBanInHinh(L, ten, bais, phan)
      if (alive) setBan(b)
    })().catch((e) => { if (alive) { const msg = e instanceof Error ? e.message : String(e); setErr(msg); onRenderErr(msg) } })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buoiId, phan])
  if (err) return <p style={{ padding: 20 }}>Lỗi: {err}</p>
  if (!ban) return <p style={{ padding: 20 }}>⏳ đang dựng dữ liệu Hình…</p>
  return <HinhPrintView ban={ban} perHS={perHS} onClose={onClose} onReady={onReady} onRenderErr={onRenderErr} />
}
