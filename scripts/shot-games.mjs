// Chụp ảnh màn hình minh hoạ cho tờ luật dán tường (games-site/luat-choi.html) — Thùy 25/09.
// Điều khiển Edge headless qua Chrome DevTools Protocol (chụp được cả game 3D/WebGL), dựng đúng cảnh cần minh hoạ
// rồi lưu JPEG ×2 (đủ nét khi in A3/A2) vào games-site/luat-choi-img/<game>.jpg.
// Cần server game đang chạy: node scripts/serve-games.mjs 5260   ·   Chạy: node scripts/shot-games.mjs [tên-game ...]
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const BASE = process.env.GAMES_URL || 'http://localhost:5260'
const OUT = join(process.cwd(), 'games-site', 'luat-choi-img'); mkdirSync(OUT, { recursive: true })
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync)
if (!EDGE) throw new Error('Không thấy msedge.exe')
const PORT = 9333, sleep = ms => new Promise(r => setTimeout(r, ms))

// ---------- cảnh từng game ----------
const IPAD = { w: 1024, h: 768 }, TV = { w: 1400, h: 860 }
const SHOTS = [
  { name: 'doan-so', ...TV, url: '/doan-so.html', pre: `localStorage.removeItem('bk-doanso-v1')`, after: 9000, setup: `
    const $=id=>document.getElementById(id);$('btnSettings').click();$('cManual').checked=true;$('dlgSave').click(); // mở hộp trước để fillDlg nạp số, không thì Lưu đọc ô trống
    const set=(i,sel,v)=>{const el=document.querySelectorAll(sel)[i];el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))};
    [['An',47],['Bình',45],['Chi',51],['Dũng',60],['Hà',12]].forEach(([n,g],i)=>{set(i,'input.name',n);set(i,'input.guess',g)});
    $('manualNum').value=47;$('btnSpin').click();setTimeout(()=>{$('manualNum').style.display='none'},4900);` },
  { name: 'dap-chuot', ...IPAD, url: '/dap-chuot.html?role=player&slot=1&room=SHOT', after: 900, setup: `
    const $=id=>document.getElementById(id);['pLobby','pResult'].forEach(i=>$(i).classList.remove('show'));$('pGame').classList.add('show');$('pTop').style.display='none';
    const T={normal:'',fast:'⚡',gold:'👑',bomb:'💣',gift:'🎁'};
    [['normal',0],['fast',2],['gold',4],['bomb',6],['gift',8],['normal',5]].forEach(([t,h])=>{const el=$('m'+h);el.className='mole '+t+' up';const b=el.querySelector('.badge');b.textContent=T[t];b.style.display=t==='normal'?'none':''});
    $('m7').className='mole normal hit';$('hName').textContent='An';$('hScore').textContent='23';$('hCombo').textContent='🔥 12';$('hTime').textContent='14';` },
  { name: 'tim-nhan-vat-an', ...IPAD, url: '/tim-nhan-vat-an.html?role=player&slot=1&room=SHOT', after: 4200, setup: `document.getElementById('pPractice').click()` },
  { name: 'tim-diem-khac-nhau', ...IPAD, url: '/tim-diem-khac-nhau.html?role=player&slot=1&room=SHOT', after: 4200, setup: `document.getElementById('pPractice').click()` },
  { name: 'xep-thap', ...IPAD, url: '/xep-thap.html?role=player&slot=1&room=SHOT', after: 7600, setup: `
    document.getElementById('pPractice').click();
    const gc=document.querySelector('#pGame canvas')||document.querySelector('canvas:not(#confetti)');
    // thả 8 tầng, mỗi lần chờ bánh chạy tới gần giữa (ước lượng) — đủ để thấy tháp cao + có tầng bị cắt
    let k=0;setTimeout(function tap(){gc.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));if(++k<8)setTimeout(tap,560+((k*97)%180))},2600);` },
  { name: 'me-cung', ...IPAD, url: '/me-cung.html?role=player&slot=1&room=SHOT', after: 3200, setup: `document.getElementById('pPractice').click()` },
  { name: 'chiem-dat', ...TV, url: '/chiem-dat.html', after: 9000, setup: `` },
  { name: 'dua-vit', ...TV, url: '/dua-vit.html', after: 200, setup: `
    // nạp 3D chậm trong trình duyệt ngầm ⇒ chờ đồng hồ đua (⏱ x.xs) chạm 9s thay vì đoán thời gian
    await new Promise(r=>setTimeout(r,2500));document.getElementById('btnStart').click();
    const t0=Date.now();while(Date.now()-t0<60000){const m=document.body.innerText.match(/⏱s*(d+(?:.d)?)s/);if(m&&+m[1]>=9)break;await new Promise(r=>setTimeout(r,200))}` },
  { name: 'mo-ruong', ...TV, url: '/mo-ruong.html', after: 15500, setup: `
    const key=k=>dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));
    setTimeout(()=>key('3'),2500);setTimeout(()=>key('Enter'),3000);
    setTimeout(()=>key(' '),7000);setTimeout(()=>key(' '),9500);setTimeout(()=>key(' '),12000);` },
]

// ---------- CDP tối giản ----------
let ws, seq = 0; const pending = new Map()
function cdp(method, params = {}, sessionId) {
  const id = ++seq; ws.send(JSON.stringify({ id, method, params, sessionId }))
  return new Promise((res, rej) => pending.set(id, { res, rej, method }))
}
async function evalJs(sid, expr) {
  const r = await cdp('Runtime.evaluate', { expression: `(async()=>{${expr}})()`, awaitPromise: true, returnByValue: true }, sid)
  if (r.exceptionDetails) throw new Error('JS lỗi: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text))
  return r.result?.value
}
async function load(sid, url) {
  await cdp('Page.navigate', { url }, sid)
  for (let i = 0; i < 120; i++) { await sleep(250); try { if (await evalJs(sid, `return document.readyState`) === 'complete') return } catch {} }
  throw new Error('trang không tải xong: ' + url)
}

const only = process.argv.slice(2)
const prof = join(tmpdir(), 'bk-shot-edge')
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  '--hide-scrollbars', '--mute-audio', '--no-first-run', '--autoplay-policy=no-user-gesture-required', 'about:blank'], { stdio: 'ignore' })
try {
  let ver
  for (let i = 0; i < 40 && !ver; i++) { await sleep(250); try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json() } catch {} }
  if (!ver) throw new Error('Edge không mở cổng debug')
  ws = new WebSocket(ver.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(p.method + ': ' + m.error.message)) : p.res(m.result) } }
  for (const s of SHOTS) {
    if (only.length && !only.includes(s.name)) continue
    const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' })
    const { sessionId: sid } = await cdp('Target.attachToTarget', { targetId, flatten: true })
    await cdp('Page.enable', {}, sid); await cdp('Runtime.enable', {}, sid)
    await cdp('Emulation.setDeviceMetricsOverride', { width: s.w, height: s.h, deviceScaleFactor: 2, mobile: false }, sid)
    const t0 = Date.now()
    if (s.pre) { await load(sid, BASE + s.url); await evalJs(sid, s.pre) }
    await load(sid, BASE + s.url); await sleep(1200)
    if (s.setup) await evalJs(sid, s.setup)
    await sleep(s.after)
    const { data } = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 82 }, sid)
    const f = join(OUT, s.name + '.jpg'); writeFileSync(f, Buffer.from(data, 'base64'))
    console.log(`${s.name}: ${Math.round(Buffer.from(data, 'base64').length / 1024)}KB · ${((Date.now() - t0) / 1000).toFixed(1)}s`)
    await cdp('Target.closeTarget', { targetId })
  }
} finally { try { ws && ws.close() } catch {} edge.kill() }
