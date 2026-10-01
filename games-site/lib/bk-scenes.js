/* BK Scenes — bộ máy dựng tranh DÙNG CHUNG cho "Tìm Nhân Vật Ẩn" + "Tìm Điểm Khác Nhau" (Thùy 25/09):
   mỗi trận một cảnh khác (nền · bộ đồ vật · cách xếp) để bạn chơi sau không học thuộc được tranh của bạn trước.
   · 52 cảnh = 13 chủ đề × 4 biến thể (phông Kenney khác nhau · màu trời ngày/hoàng hôn/bình minh/đêm/tuyết · kiểu xếp)
   · Đồ vật: Microsoft Fluent Emoji 3D (MIT) · Nền: Kenney Background Elements Redux (CC0) — games-site/assets/scene/
   · Danh mục đồ vật: lib/bk-scenes-data.js (sinh bởi scripts/fetch-scene-assets.mjs)
   API: BKScenes.scene(seed,{n,dup}) · BKScenes.bgSvg(sc) · BKScenes.itemSvg(o) · BKScenes.imgUrl(key) · BKScenes.preload(sc)
        BKScenes.pool(sc) · BKScenes.W/H · BKScenes.CASES */
(function () {
'use strict';
const D = window.BK_SCENE_DATA, W = 1000, H = 625, BASE = 'assets/scene/';
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }

// ---------- nền Kenney: [file, vị trí đường chân trời (tỉ lệ chiều cao ảnh 1024)] ----------
const BG = {
  castles: ['backgroundCastles', .66], desert: ['backgroundDesert', .66], empty: ['backgroundEmpty', .65], forest: ['backgroundForest', .66],
  cDesert: ['backgroundColorDesert', .52], cFall: ['backgroundColorFall', .55], cForest: ['backgroundColorForest', .62], cGrass: ['backgroundColorGrass', .63],
}
// phủ màu trời/giờ (feColorMatrix) — ảnh Kenney nhạt nên phủ được mọi tông
const TINT = {
  day: null,
  sunset: '1.05 0 0 0 .10  0 .72 0 0 .03  0 0 .5 0 .02  0 0 0 1 0',
  dawn: '.98 0 0 0 .06  0 .85 0 0 .03  0 0 .96 0 .07  0 0 0 1 0',
  night: '.22 0 0 0 .02  0 .28 0 0 .05  0 0 .52 0 .16  0 0 0 1 0',
  snow: '.3 .3 .15 0 .05  .3 .34 .17 0 .09  .3 .36 .26 0 .17  0 0 0 1 0', // xám xanh nhạt — trắng quá thì gấu Bắc Cực/người tuyết chìm
  deep: '.07 0 0 0 .02  0 .06 0 0 .02  0 0 .2 0 .12  0 0 0 1 0',
  deep2: '.18 0 0 0 .1  0 .05 0 0 .02  0 0 .25 0 .16  0 0 0 1 0',
}
const STARS = { night: 40, deep: 90, deep2: 90 }
// chi tiết trang trí ven chân trời (Kenney sprites, không bấm được)
const DECO = {
  none: [], village: ['house1', 'houseSmall1', 'treeSmall_green1', 'house2', 'houseSmallAlt1', 'treeSmall_green2'],
  pines: ['treePine', 'tree', 'treePine', 'treeLong', 'treeSmall_green3'], autumn: ['treeOrange', 'treePineOrange', 'treeLongOrange', 'bushOrange1', 'treeSmall_orange1'],
  palms: ['treePalm', 'treePalm', 'bush1', 'treePalm'], desert: ['cactus1', 'cactus2', 'pyramid', 'treePalm', 'cactus3'],
  castle: ['castleSmall', 'tower', 'castleWall', 'towerSmall', 'castleSmallAlt'], snow: ['treePineSnow', 'treeSnow', 'treeLongSnow', 'houseSmallAlt1', 'treePineFrozen'],
  city: ['house1', 'houseAlt1', 'tower', 'house2', 'houseAlt2', 'towerAlt'], fence: ['fence', 'bush2', 'fenceIron', 'bushAlt1', 'fence'],
}
// ---------- 52 cảnh ----------
const V = (bg, tint, deco, layout, extra) => Object.assign({ bg, tint, deco, layout }, extra || {})
const PLAN = {
  trungthu: [V('castles', 'night', 'castle', 'scatter', { moon: 1 }), V('empty', 'night', 'village', 'clusters', { moon: 1 }), V('forest', 'night', 'pines', 'rows', { moon: 1 }), V('cGrass', 'night', 'fence', 'scatter', { moon: 1 })],
  farm: [V('cGrass', 'day', 'fence', 'scatter'), V('cGrass', 'sunset', 'village', 'rows'), V('empty', 'dawn', 'village', 'clusters'), V('cFall', 'day', 'fence', 'scatter')],
  forest: [V('cForest', 'day', 'pines', 'scatter'), V('forest', 'dawn', 'pines', 'clusters'), V('cFall', 'day', 'autumn', 'rows'), V('cForest', 'sunset', 'pines', 'scatter')],
  beach: [V('desert', 'day', 'palms', 'scatter', { sea: 1 }), V('empty', 'day', 'palms', 'rows', { sea: 1 }), V('cDesert', 'day', 'palms', 'clusters', { sea: 1 }), V('desert', 'sunset', 'palms', 'scatter', { sea: 1 })],
  fruit: [V('cGrass', 'day', 'village', 'rows'), V('empty', 'day', 'village', 'scatter'), V('cFall', 'day', 'autumn', 'clusters'), V('castles', 'dawn', 'castle', 'scatter')],
  party: [V('cGrass', 'day', 'fence', 'clusters'), V('castles', 'day', 'castle', 'scatter'), V('empty', 'sunset', 'village', 'rows'), V('cForest', 'day', 'pines', 'scatter')],
  toys: [V('castles', 'day', 'castle', 'scatter'), V('cGrass', 'dawn', 'fence', 'clusters'), V('empty', 'day', 'none', 'rows'), V('forest', 'day', 'pines', 'scatter')],
  garden: [V('cGrass', 'day', 'fence', 'scatter'), V('cForest', 'day', 'pines', 'clusters'), V('empty', 'dawn', 'fence', 'rows'), V('cGrass', 'sunset', 'village', 'scatter')],
  city: [V('empty', 'day', 'city', 'rows'), V('castles', 'day', 'city', 'scatter'), V('empty', 'sunset', 'city', 'clusters'), V('empty', 'night', 'city', 'scatter')],
  kitchen: [V('cGrass', 'day', 'fence', 'scatter'), V('cFall', 'day', 'autumn', 'clusters'), V('empty', 'dawn', 'village', 'rows'), V('cForest', 'day', 'pines', 'scatter')],
  winter: [V('forest', 'snow', 'snow', 'scatter'), V('castles', 'snow', 'snow', 'clusters'), V('empty', 'night', 'snow', 'rows', { moon: 1 }), V('forest', 'snow', 'snow', 'rows')],
  space: [V('empty', 'deep', 'none', 'scatter', { space: 1 }), V('empty', 'deep2', 'none', 'clusters', { space: 1 }), V('forest', 'deep', 'none', 'rows', { space: 1 }), V('castles', 'deep2', 'none', 'scatter', { space: 1 })],
  zoo: [V('cDesert', 'day', 'palms', 'scatter'), V('desert', 'day', 'desert', 'clusters'), V('cGrass', 'day', 'palms', 'rows'), V('cDesert', 'sunset', 'desert', 'scatter')],
}
const CASES = []
for (const w of Object.keys(PLAN)) if (D[w]) PLAN[w].forEach((v, i) => CASES.push(Object.assign({ id: w + '-' + (i + 1), world: w, vn: D[w].vn }, v)))

// ---------- vùng đặt đồ vật ----------
function zonesOf(c) {
  if (c.space) return { sky: [40, 600], ground: [40, 600], water: [40, 600] }
  if (c.sea) return { sky: [40, 280], ground: [322, 412], water: [452, 606] }
  return { sky: [40, 290], ground: [326, 604], water: [326, 604] }
}
// ô ứng viên theo kiểu xếp (đã xáo), trong khung [y0,y1]
function cands(layout, y0, y1, r) {
  const out = []
  if (layout === 'rows') {
    const rows = Math.max(1, Math.round((y1 - y0) / 92))
    for (let j = 0; j < rows; j++) { const y = y0 + (j + .5) * (y1 - y0) / rows, off = (j % 2) * 45; for (let x = 50 + off; x < W - 40; x += 88) out.push([x + (r() - .5) * 14, y + Math.sin(x / 90 + j) * 10]) }
  } else if (layout === 'clusters') {
    const k = 3 + Math.floor(r() * 3)
    for (let c = 0; c < k; c++) { const cx = 90 + r() * (W - 180), cy = y0 + 30 + r() * Math.max(10, y1 - y0 - 60); for (let t = 0; t < 26; t++) { const a = r() * 6.283, d = 30 + r() * 150; out.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * .6]) } }
    for (let t = 0; t < 40; t++) out.push([50 + r() * (W - 100), y0 + r() * (y1 - y0)])
  } else {
    const cols = 10, rows = Math.max(1, Math.round((y1 - y0) / 85))
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) out.push([(i + .5) * W / cols + (r() - .5) * 40, y0 + (j + .5) * (y1 - y0) / rows + (r() - .5) * 26])
  }
  return shuffle(out.filter(([x, y]) => x > 36 && x < W - 36 && y >= y0 - 4 && y <= y1 + 4), r)
}

/* scene(seed,{n,dup,sMin,sMax,caseIdx}) → {id, world, vn, c(case), items:[{id,key,vn,cx,cy,s,rot,flip,hue,zone}]}
   n: số đồ vật khác nhau · dup: số loại được đặt 2–3 bản (làm nhiễu, không làm mục tiêu) */
function scene(seed, o) {
  o = o || {}
  const r = mulberry32((seed >>> 0) * 2654435761 % 4294967296 + 97)
  const c = CASES[o.caseIdx != null ? o.caseIdx : Math.floor(r() * CASES.length)], Z = zonesOf(c)
  const pool = shuffle(D[c.world].items.filter((it, i, a) => a.findIndex(x => x[0] === it[0]) === i).slice(), r)
  const n = Math.min(o.n || 26, pool.length), picks = pool.slice(0, n)
  const dupKeys = shuffle(picks.slice(), r).slice(0, o.dup || 0)
  const list = picks.map(p => ({ p, copy: 0 }))
  for (const p of dupKeys) { const k = 1 + Math.floor(r() * 2); for (let i = 1; i <= k; i++) list.push({ p, copy: i }) }
  shuffle(list, r); list.sort((x, y) => (x.copy > 0) - (y.copy > 0)) // đồ vật chính xếp trước, bản sao làm nhiễu xếp sau (hết chỗ thì bỏ bản sao)
  const sMin = o.sMin || 54, sMax = o.sMax || 78
  const CZ = {}, items = []
  let id = 1
  const place = (zone, s) => {
    const key = zone in Z ? zone : 'ground'; if (!CZ[key]) CZ[key] = cands(c.layout, Z[key][0], Z[key][1], r)
    for (let t = 0; t < CZ[key].length; t++) {
      const [x, y] = CZ[key][t]
      if (items.some(q => Math.hypot(q.cx - x, q.cy - y) < (q.s + s) * .5 + 4)) continue
      CZ[key].splice(t, 1); return [x, y]
    }
    return null
  }
  for (const { p } of list) {
    const [key, vn, zone0, fl] = p
    const zone = zone0 === 'any' ? (r() < .45 ? 'sky' : 'ground') : zone0
    const s = sMin + r() * (sMax - sMin)
    // không vừa vùng của mình thì BỎ (không đẩy cá lên trời); chỉ đồ 'any' và đồ trên trời mới được sang vùng khác
    let pos = place(zone, s) || (zone0 === 'any' ? place(zone === 'sky' ? 'ground' : 'sky', s) : zone === 'sky' ? place('ground', s) : null)
    if (!pos) continue
    items.push({ id: id++, key, vn, fl: fl || '', cx: pos[0], cy: pos[1], s, rot: (r() - .5) * 16, flip: r() < .3, hue: 0, zone }) // fl: f=lật nhìn ra · r=xoay nhìn ra · c=đổi màu nhìn ra
  }
  return { id: c.id + '#' + seed, seed, world: c.world, vn: c.vn, c, items }
}
function pool(sc) { return D[sc.world].items.filter((it, i, a) => a.findIndex(x => x[0] === it[0]) === i) }

// ---------- vẽ (SVG string; toạ độ 1000×625) ----------
const imgUrl = key => BASE + 'obj/' + key + '.webp'
const bgUrl = f => BASE + 'bg/' + f + '.webp'
function defs() {
  let s = '<defs>'
  for (const [k, m] of Object.entries(TINT)) if (m) s += `<filter id="bkt-${k}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`
  for (const h of [90, 150, 210, 270]) s += `<filter id="bkh-${h}" color-interpolation-filters="sRGB"><feColorMatrix type="hueRotate" values="${h}"/></filter>`
  return s + '<linearGradient id="bk-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cc3ea"/><stop offset="1" stop-color="#1f78b8"/></linearGradient></defs>'
}
function bgSvg(sc) {
  const c = sc.c, [file, hz] = BG[c.bg], f = c.tint && TINT[c.tint] ? ` filter="url(#bkt-${c.tint})"` : ''
  const r = mulberry32(sc.seed * 31 + 7)
  // ảnh nền vuông 1024 → rộng 1000, dời lên để đường chân trời nằm ở y≈318
  let s = defs() + `<rect width="${W}" height="${H}" fill="#9fd4f2"${f}/>`
  s += `<image href="${bgUrl(file)}" x="0" y="${(318 - hz * 1000).toFixed(0)}" width="${W}" height="1000" preserveAspectRatio="none"${f}/>`
  if (STARS[c.tint]) for (let i = 0; i < STARS[c.tint]; i++) s += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * (c.space ? H : 280)).toFixed(0)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="#fff" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`
  if (c.moon) s += `<image href="${bgUrl('sp-moonFull')}" x="${(60 + r() * 820).toFixed(0)}" y="36" width="70" height="70" opacity=".95"/>`
  const deco = DECO[c.deco] || []
  for (let i = 0; i < deco.length; i++) {
    const h = 58 + r() * 44, x = (i + .15 + r() * .7) * W / deco.length - h * .4
    s += `<image href="${bgUrl('sp-' + deco[i])}" x="${x.toFixed(0)}" y="${(322 - h).toFixed(0)}" width="${(h * .8).toFixed(0)}" height="${h.toFixed(0)}" preserveAspectRatio="xMidYMax meet" opacity=".92"${f}/>`
  }
  if (c.sea) s += `<rect x="0" y="426" width="${W}" height="${H - 426}" fill="url(#bk-sea)"/><path d="M0 430 q25 -9 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#e8f8ff" stroke-width="5" opacity=".8"/>`
  return s
}
function itemSvg(o) {
  const tr = []
  if (o.rot) tr.push(`rotate(${o.rot.toFixed(1)} ${o.cx.toFixed(1)} ${o.cy.toFixed(1)})`)
  if (o.flip) tr.push(`translate(${(2 * o.cx).toFixed(1)} 0) scale(-1 1)`)
  return `<image href="${imgUrl(o.key)}" x="${(o.cx - o.s / 2).toFixed(1)}" y="${(o.cy - o.s / 2).toFixed(1)}" width="${o.s.toFixed(1)}" height="${o.s.toFixed(1)}"` +
    (tr.length ? ` transform="${tr.join(' ')}"` : '') + (o.hue ? ` filter="url(#bkh-${o.hue})"` : '') + '/>'
}
function preload(sc, extraKeys) {
  const urls = new Set([bgUrl(BG[sc.c.bg][0])]); (DECO[sc.c.deco] || []).forEach(d => urls.add(bgUrl('sp-' + d))); if (sc.c.moon) urls.add(bgUrl('sp-moonFull'))
  sc.items.forEach(o => urls.add(imgUrl(o.key))); (extraKeys || []).forEach(k => urls.add(imgUrl(k)))
  return Promise.all([...urls].map(u => new Promise(res => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = u })))
}
const zones = sc => zonesOf(sc.c)
window.BKScenes = { W, H, CASES, scene, pool, zones, bgSvg, itemSvg, imgUrl, preload, mulberry32, shuffle }
})();
