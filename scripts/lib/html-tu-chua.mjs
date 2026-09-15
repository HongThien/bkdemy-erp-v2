// HTML TỰ CHỨA để CEO xem trong trình xem của app (chặn CDN/ảnh ngoài): KaTeX render sẵn trong node + CSS/font nhúng base64,
// ảnh tải về nhúng data URI. Dùng cho mọi bảng duyệt (mcq-xem, nhapkho-file, hinh-dien).
import katex from 'katex'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const distDir = require.resolve('katex/dist/katex.min.css').replace(/katex\.min\.css$/, '')

let cssCache = null
export function katexCss() {
  if (cssCache) return cssCache
  let css = readFileSync(distDir + 'katex.min.css', 'utf8')
  // chỉ giữ woff2, nhúng base64; bỏ woff/ttf
  css = css.replace(/url\(fonts\/([^)]+?)\.woff2\)\s*format\("woff2"\),?/g, (m, f) => `url(data:font/woff2;base64,${readFileSync(distDir + 'fonts/' + f + '.woff2').toString('base64')}) format("woff2")`)
  css = css.replace(/,?url\(fonts\/[^)]+?\.(woff|ttf)\)\s*format\("(woff|truetype)"\)/g, '')
  cssCache = css; return css
}
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Text có $…$ → HTML (KaTeX inline), phần chữ escape. Không throw: lỗi thì hiện LaTeX đỏ.
export function mathHtml(text) {
  return String(text ?? '').split(/(\$[^$]+\$)/g).map((seg) => {
    if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) {
      try { return katex.renderToString(seg.slice(1, -1), { throwOnError: false, strict: 'ignore', output: 'html' }) } catch { return `<code style="color:#a33">${esc(seg)}</code>` }
    }
    return esc(seg)
  }).join('')
}
const imgCache = new Map()
export async function imgDataUri(url) {
  if (!url) return null
  if (imgCache.has(url)) return imgCache.get(url)
  try {
    const r = await fetch(url); if (!r.ok) throw new Error(r.status)
    const buf = Buffer.from(await r.arrayBuffer())
    let type = r.headers.get('content-type') || ''
    if (/svgxml$|\.svg$/.test(url) || buf.subarray(0, 200).toString().includes('<svg')) type = 'image/svg+xml'
    else if (!type.startsWith('image/')) type = /\.png$/i.test(url) ? 'image/png' : 'image/jpeg'
    const v = `data:${type};base64,${buf.toString('base64')}`; imgCache.set(url, v); return v
  } catch { imgCache.set(url, null); return null }
}
