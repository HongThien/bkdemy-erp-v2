// Server tĩnh cho games-site (hub + các game) để xem local — production là project Vercel bkdemy-games.
// Chạy: node scripts/serve-games.mjs [port]  (mặc định 5260)
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const ROOT = join(process.cwd(), 'games-site')
const PORT = +(process.argv[2] || process.env.PORT || 5260)
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' }

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (p.endsWith('/')) p += 'index.html'
    const f = normalize(join(ROOT, p))
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end() }
    const st = await stat(f)
    if (st.isDirectory()) { res.writeHead(302, { Location: p + '/' }); return res.end() }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
    res.end(await readFile(f))
  } catch { res.writeHead(404); res.end('404 ' + req.url) }
}).listen(PORT, () => console.log(`games: http://localhost:${PORT}/  (root ${ROOT})`))
