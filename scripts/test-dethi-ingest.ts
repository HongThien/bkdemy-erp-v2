// Self-test CLI cho luồng bóc đề thi (DeThiScreen.tsx / bocDeTuFile) — chạy NGOÀI Browser, không phụ
// thuộc pdf.js-worker-in-browser hay preview server (môi trường Browser pane từng bị TREO ở bước render
// PDF, chặn hết việc verify — xem HANDOFF.md 07-14). Thùy yêu cầu: "m phải thiết lập lại để tự test
// đi tự lấy kết quả" — script này DÙNG THẬT prompt/schema/parse/Gemini-call từ kho/api.ts (import trực
// tiếp, không viết lại), chỉ thay phần render canvas (browser HTMLCanvasElement → @napi-rs/canvas, đã
// có sẵn trong node_modules) để chạy được trong Node. Mirror ĐÚNG thuật toán batch/try-catch-per-lượt/
// anh_idx-routing/chuan-phần-assignment của bocDeTuFile — sửa 1 bên thì nhớ soi lại bên kia.
//
// Chạy: npx vite-node scripts/test-dethi-ingest.ts <duong-dan.pdf> [--co-hinh] [--chuan]
// Output: in ra từng câu (loai_cau/stt_goc/phan/dap_an/lua_chon/box_hinh) + canhBao; nếu --co-hinh, lưu
// ảnh cắt được ra scripts/out-crops/ để xem trực tiếp bằng mắt (không upload lên Supabase storage thật).
//
// ⚠ GIỚI HẠN ĐÃ BIẾT (07-14): render PDF bằng pdfjs-dist + @napi-rs/canvas trong Node đôi khi in cảnh báo
// "getPathGenerator - ignoring character: ...isn't resolved yet" và MẤT 1 vài glyph (chữ/dấu) trong ảnh
// render ra — đây là lỗi tương thích pdfjs-dist/@napi-rs-canvas ở MÔI TRƯỜNG NODE, KHÔNG PHẢI lỗi
// production (browser dùng pdf.js render qua DOM canvas thật, không qua đường này). Vì vậy: KẾT QUẢ
// TRÍCH XUẤT (loai_cau/stt_goc/dap_an/lua_chon/phần) đáng tin để test batch/prompt/parse — nhưng ẢNH CẮT
// (scripts/out-crops/) có thể trông vỡ chữ vì lý do render Node, ĐỪNG kết luận đó là lỗi box_hinh/Gemini
// nếu chưa đối chiếu lại trên Browser thật.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, Image, type Canvas } from '@napi-rs/canvas'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import {
  buildDeThiIngestPrompt, DETHI_INGEST_SCHEMA, parseDeThiIngestJson, callGeminiRich,
} from '../src/lib/kho/api'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Giữ ĐÚNG hằng số DPI/scale như src/lib/pdfRender.ts — lệch số này là lệch cả độ nét lẫn token gửi Gemini ──
const HI = 400 / 72
const GEM_W = 1300
const MAX_SRC = 4200
const BATCH_TRANG = 6
const CHUAN_PHAN = ['Phần I. Trắc nghiệm', 'Phần II. Đúng/Sai', 'Phần III. Trả lời ngắn']
const CHUAN_SO_CAU = [12, 4, 6]

class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height)
    return { canvas, context: canvas.getContext('2d') }
  }
  reset(cc: { canvas: Canvas }, width: number, height: number) { cc.canvas.width = width; cc.canvas.height = height }
  destroy(cc: { canvas: Canvas | null }) { cc.canvas = null }
}

async function fileToCanvasesNode(pdfBytes: Uint8Array): Promise<Canvas[]> {
  const pdf = await (pdfjsLib as any).getDocument({ data: pdfBytes, canvasFactory: new NodeCanvasFactory() }).promise
  const out: Canvas[] = []
  for (let p = 1; p <= pdf.numPages; p++) {
    const pg = await pdf.getPage(p)
    let vp = pg.getViewport({ scale: HI })
    if (vp.width > MAX_SRC) vp = pg.getViewport({ scale: HI * (MAX_SRC / vp.width) })
    const canvas = createCanvas(Math.round(vp.width), Math.round(vp.height))
    await pg.render({ canvasContext: canvas.getContext('2d') as any, viewport: vp, canvasFactory: new NodeCanvasFactory() }).promise
    out.push(canvas)
  }
  return out
}
function canvasToJpegBase64Node(c: Canvas, maxW = GEM_W): string {
  const k = Math.min(1, maxW / c.width)
  const t = createCanvas(Math.round(c.width * k), Math.round(c.height * k))
  const img = new Image(); img.src = c.toBuffer('image/png')
  t.getContext('2d').drawImage(img as any, 0, 0, t.width, t.height)
  return t.toBuffer('image/jpeg', 0.85).toString('base64')
}
function cropCanvasBoxNode(c: Canvas, box: [number, number, number, number], pad = 0.04): Buffer {
  const [y0, x0, y1, x1] = box
  const bx0 = Math.min(x0, x1), bx1 = Math.max(x0, x1), by0 = Math.min(y0, y1), by1 = Math.max(y0, y1)
  const padX = (bx1 - bx0) * pad, padY = (by1 - by0) * pad
  const px0 = Math.max(0, bx0 - padX), px1 = Math.min(1000, bx1 + padX)
  const py0 = Math.max(0, by0 - padY), py1 = Math.min(1000, by1 + padY)
  const sx = Math.round(px0 / 1000 * c.width), sy = Math.round(py0 / 1000 * c.height)
  const sw = Math.round((px1 - px0) / 1000 * c.width), sh = Math.round((py1 - py0) / 1000 * c.height)
  const o = createCanvas(Math.max(1, sw), Math.max(1, sh))
  o.getContext('2d').drawImage(c as any, sx, sy, sw, sh, 0, 0, o.width, o.height)
  return o.toBuffer('image/png')
}

async function main() {
  const args = process.argv.slice(2)
  const pdfPath = args.find((a) => !a.startsWith('--'))
  const coHinh = args.includes('--co-hinh')
  const chuan = args.includes('--chuan')
  if (!pdfPath) { console.error('Dùng: npx vite-node scripts/test-dethi-ingest.ts <duong-dan.pdf> [--co-hinh] [--chuan]'); process.exit(1) }
  const bytes = new Uint8Array(fs.readFileSync(pdfPath!))
  console.log(`Đang render PDF (Node canvas, batchSize=${coHinh ? 1 : BATCH_TRANG})…`)
  const canvases = await fileToCanvasesNode(bytes)
  console.log(`→ ${canvases.length} trang.`)

  const outDir = path.join(__dirname, 'out-crops')
  fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true })

  type Item = { loai_cau: string; sttGoc: number | null; phanGoiY: string | null; noi_dung: string; dap_an: string | null; lua_chon: string[] | null; menh_de: any; box_hinh: [number, number, number, number] | null; anhIdx: number | null; batchTrang: string; anhFile: string | null }
  const items: Item[] = []
  const loiLuot: string[] = []
  let meta: any = {}
  const batchSize = coHinh ? 1 : BATCH_TRANG
  for (let start = 0; start < canvases.length; start += batchSize) {
    const end = Math.min(start + batchSize, canvases.length)
    const nhieuAnh = end - start > 1
    console.log(`— Lượt trang ${start + 1}-${end} (nhieuAnh=${nhieuAnh})…`)
    try {
      const files = canvases.slice(start, end).map((c) => ({ mimeType: 'image/jpeg' as const, dataBase64: canvasToJpegBase64Node(c) }))
      const { text, usage } = await callGeminiRich(buildDeThiIngestPrompt({ trangDau: start === 0, nhieuAnh, chuan }), { schema: DETHI_INGEST_SCHEMA, files })
      console.log(`  usage: in=${usage?.in ?? '?'} out=${usage?.out ?? '?'}`)
      const parsed = parseDeThiIngestJson(text)
      if (start === 0) meta = parsed.meta
      for (const cau of parsed.caus) {
        let anhFile: string | null = null
        if (coHinh && cau.coHinh && cau.box) {
          const c = canvases[start + Math.min(Math.max(cau.anhIdx ?? 0, 0), end - start - 1)]
          const png = cropCanvasBoxNode(c, cau.box)
          anhFile = path.join(outDir, `cau${items.length + 1}_stt${cau.sttGoc ?? 'x'}.png`)
          fs.writeFileSync(anhFile, png)
        }
        items.push({ loai_cau: cau.loai_cau, sttGoc: cau.sttGoc, phanGoiY: cau.phanGoiY, noi_dung: cau.noi_dung, dap_an: cau.dap_an, lua_chon: cau.lua_chon, menh_de: cau.menh_de, box_hinh: cau.box ?? null, anhIdx: cau.anhIdx ?? null, batchTrang: `${start + 1}-${end}`, anhFile })
      }
    } catch (e: any) {
      loiLuot.push(`trang ${start + 1}${end - start > 1 ? `-${end}` : ''}: ${e.message ?? String(e)}`)
    }
  }

  let canhBao: string | null = null
  if (chuan) {
    let phanIdx = 0, prevStt: number | null = null
    const dem = [0, 0, 0]
    for (const it of items) {
      if (prevStt != null && it.sttGoc != null && it.sttGoc <= prevStt) phanIdx = Math.min(phanIdx + 1, CHUAN_PHAN.length - 1)
      it.phanGoiY = CHUAN_PHAN[phanIdx]
      dem[phanIdx]++
      if (it.sttGoc != null) prevStt = it.sttGoc
    }
    if (phanIdx < CHUAN_PHAN.length - 1 || dem.some((n, i) => n !== CHUAN_SO_CAU[i])) {
      canhBao = `⚠ Bóc được ${dem.join('/')} câu (TN/ĐS/TLN), khác chuẩn 12/4/6.`
    }
  }
  if (loiLuot.length) canhBao = (canhBao ? canhBao + '\n' : '') + `⚠ Lỗi bóc: ${loiLuot.join(' · ')}`

  console.log('\n════ META ════'); console.log(JSON.stringify(meta, null, 2))
  console.log(`\n════ ${items.length} CÂU ════`)
  for (const [i, it] of items.entries()) {
    console.log(`\n[${i + 1}] trang ${it.batchTrang} · stt_goc=${it.sttGoc} · ${it.phanGoiY} · ${it.loai_cau}`)
    console.log(`  đề: ${it.noi_dung.slice(0, 80).replace(/\n/g, ' ')}…`)
    if (it.lua_chon) console.log(`  lựa_chọn (${it.lua_chon.length}): ${it.lua_chon.join(' | ').slice(0, 100)}`)
    if (it.menh_de) console.log(`  mệnh_đề (${it.menh_de.length}): ${it.menh_de.map((m: any) => m.dap_an).join(',')}`)
    console.log(`  đáp_án: ${it.dap_an ?? '(trống)'}`)
    if (it.box_hinh) console.log(`  hình: box=${JSON.stringify(it.box_hinh)} anh_idx=${it.anhIdx} → ${it.anhFile}`)
  }
  if (canhBao) console.log(`\n════ CẢNH BÁO ════\n${canhBao}`)
  console.log(`\n(Ảnh cắt được lưu ở ${outDir} — mở bằng mắt để đối chiếu phạm vi/đúng câu.)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
