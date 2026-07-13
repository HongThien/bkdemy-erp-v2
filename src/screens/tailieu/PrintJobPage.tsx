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
  return <PrintView id={id} {...sig} />
}
