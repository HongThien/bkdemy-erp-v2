/* KHUNG MÔ HÌNH 3D CHO BÀI TẬP — phần dùng chung của mọi trang trong toan-site/the-tich/ (spec-day-hinh-3d.md).
   Trang bài chỉ khai VẬT THỂ + BẢNG LỜI GIẢI từng bước. Khung lo: sân khấu three.js, máy quay kéo-xoay, nét dày, nhãn bám điểm 3D,
   thanh bước, phím bút trình chiếu, công thức KaTeX, đồng hồ hoạt cảnh, công cụ soát bằng máy.

   Cách dùng (mẫu: coc-nghieng.html):
     const M = MoHinh({
       nhan, tieuDe,                         // dòng nhỏ + tên bài ở góc trái sân khấu
       buoc: ['Đề bài', …],                  // tên các bước (thanh bước ở đáy)
       nutGoc: [['mac_dinh', 'Góc ban đầu'], ['ngang', 'Nhìn ngang'], …],   // nút góc nhìn; 'mac_dinh' = gocMacDinh()
       goc:   { tên: { az, pol } },          // góc máy quay: az = phương vị, pol = góc từ đỉnh
       khung: { tên: { tx, ty, tz, r } },    // điểm ngắm + bán kính cần thấy hết
       khungNao: () => tên khung đang dùng,  gocMacDinh: () => tên góc mặc định,
       bang: n => html của bảng lời giải bước n,   sauBang: n => gắn sự kiện cho bảng vừa vẽ,
       truocBang: (n, prev, o) => đặt lại trạng thái riêng của bài trước khi vẽ bảng,
       khiDoiBuoc: async (n, prev, o, my) => đổi góc nhìn + diễn hoạt cảnh chuyển bước (kiểm M.alive(my) sau mỗi await),
       moiKhung: (now, dt) => cập nhật vật thể,   dongBo: () => bật/tắt vật thể theo trạng thái (ma trận thế giới đã mới),
       tiep: () => true nếu bài tự xử lý nút Tiếp / phím →,   nutTiep: () => ({ chu, tat }) | null,   phimCach: () => true nếu đã xử lý,
       thamSo: q => đọc tham số địa chỉ riêng của bài, trả về tuỳ chọn cho lần goStep đầu,
     })
     … dựng vật thể bằng M.scene, M.mkLine, M.label, M.dot …
     M.start()
   Luật A3 của spec: công thức TỔNG QUÁT (chữ) trước, THAY SỐ sau — khối `.fx` cho công thức chữ, `.fx.num` cho khối thay số. */
window.MoHinh = function (cfg) {
  'use strict'
  if (!window.THREE) { document.body.insertAdjacentHTML('beforeend', '<p class="err">Không tải được thư viện 3D — cần có mạng.</p>'); return null }

  // ── tiện ích ──
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (s, r) => (r || document).querySelector(s)
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)]
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  const z0 = v => (Math.abs(v) < 5e-7 ? 0 : v)
  const fmt = (v, d = 2) => z0(v).toFixed(d).replace('.', ',').replace('-', '−')   // số hiển thị kiểu Việt: 2,12
  const tn = (v, d = 2) => z0(v).toFixed(d).replace('.', '{,}')                    // số trong công thức TeX
  function tex(el, s, display) {   // KHÔNG đưa chữ có dấu vào \text{} — chú thích tiếng Việt để ở HTML
    if (!el) return
    if (window.katex) { try { katex.render(s, el, { throwOnError: false, displayMode: !!display }); return } catch (e) { /* rơi xuống chữ thường */ } }
    el.textContent = s.replace(/\\[a-zA-Z]+|[{}]/g, ' ')
  }

  // ── khung trang: sân khấu trái · bảng lời giải phải · thanh bước đáy ──
  const N = cfg.buoc.length
  const app = $('#app'); app.className = 'app'
  app.innerHTML = '<div class="stage" id="stage"><canvas id="cv" aria-label="Mô hình 3D, kéo để xoay"></canvas><div class="labels" id="labels" aria-hidden="true"></div>' +
    '<div class="head"><div class="eyebrow">' + cfg.nhan + '</div><h1>' + cfg.tieuDe + '</h1></div>' +
    '<div class="views" id="views">' + cfg.nutGoc.map(v => '<button type="button" data-view="' + v[0] + '"' + (v[0] === 'mac_dinh' ? ' id="vDef"' : '') + '>' + v[1] + '</button>').join('') + '</div>' +
    '<div class="hint" id="hint">Kéo để xoay · cuộn hoặc chụm hai ngón để phóng to</div></div>' +
    '<aside class="panel" id="panel" aria-live="polite"></aside>' +
    '<nav class="steps" aria-label="Các bước"><button type="button" class="nav" id="prev">‹ Trước</button><ol id="chips">' +
    cfg.buoc.map((s, i) => '<li><button type="button" class="chip" data-step="' + (i + 1) + '"><span class="no">' + (i + 1) + '</span><span class="tx">' + s + '</span></button></li>').join('') +
    '</ol><button type="button" class="nav next" id="next">Tiếp ›</button></nav>'
  const stage = $('#stage'), cv = $('#cv'), labelsEl = $('#labels'), panel = $('#panel')

  // ── three.js ──
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(cfg.fov || 32, 1, 0.5, 600)
  scene.add(camera)
  scene.add(new THREE.AmbientLight(0xffffff, 0.72))
  const headlight = new THREE.DirectionalLight(0xffffff, 0.62); headlight.position.set(-3, 6, 2); camera.add(headlight)

  // Nét dày (Line2) — TV cần nét ≥ 2px; WebGL thường chỉ vẽ được 1px. Thiếu thư viện thì lùi về nét 1px.
  // r128: LineMaterial chỉ ra nét đứt khi tự gán defines.USE_DASH.
  const FAT = !!(THREE.Line2 && THREE.LineMaterial && THREE.LineGeometry)
  const lineMats = []
  function mkLine(P, o) {
    o = o || {}
    const color = o.color === undefined ? 0xffffff : o.color, width = o.width || 2, dashed = !!o.dashed, opacity = o.opacity === undefined ? 1 : o.opacity
    let l
    if (FAT) {
      const g = new THREE.LineGeometry(); g.setPositions(P)
      const m = new THREE.LineMaterial({ color, linewidth: width, transparent: true, opacity, depthWrite: false, depthTest: o.depthTest !== false, dashed, dashSize: o.dash || 0.5, gapSize: o.gap || 0.36 })
      if (dashed) m.defines.USE_DASH = ''
      if (o.depthFunc !== undefined) m.depthFunc = o.depthFunc
      m.resolution.set(1, 1); lineMats.push(m)
      l = new THREE.Line2(g, m)
    } else {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
      const Mat = dashed ? THREE.LineDashedMaterial : THREE.LineBasicMaterial
      const m = new Mat({ color, transparent: true, opacity, depthWrite: false, depthTest: o.depthTest !== false, dashSize: o.dash || 0.5, gapSize: o.gap || 0.36 })
      if (o.depthFunc !== undefined) m.depthFunc = o.depthFunc
      l = new THREE.Line(g, m)
    }
    l.userData.dashed = dashed
    if (dashed) l.computeLineDistances()
    l.renderOrder = o.order === undefined ? 5 : o.order
    l.frustumCulled = false
    return l
  }
  function setLine(l, P) {   // cập nhật toạ độ; cùng số điểm thì ghi đè tại chỗ (gọi được mỗi khung hình)
    if (!FAT) { l.geometry.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)) }
    else {
      const a = l.geometry.attributes.instanceStart, n = P.length / 3 - 1
      if (a && a.data.array.length === n * 6) { const arr = a.data.array; for (let i = 0; i < n; i++) for (let k = 0; k < 6; k++) arr[i * 6 + k] = P[i * 3 + k]; a.data.needsUpdate = true }
      else l.geometry.setPositions(P)
    }
    if (l.userData.dashed) l.computeLineDistances()
  }

  // ── máy quay: az, pol, dist quanh điểm ngắm (tx, ty, tz); view đuổi theo goal ──
  const view = { az: 0, pol: 1.2, dist: 50, tx: 0, ty: 0, tz: 0 }, goal = Object.assign({}, view)
  let baseDist = 50
  function fitDist(r) {
    const half = THREE.MathUtils.degToRad(camera.fov / 2), hh = Math.atan(Math.tan(half) * camera.aspect)
    return Math.max(r / Math.sin(half), r / Math.sin(hh)) * 1.03
  }
  function setView(name, instant) {
    const c = cfg.khung[cfg.khungNao()], a = cfg.goc[name === 'mac_dinh' ? cfg.gocMacDinh() : name]
    let az = a.az; while (az - view.az > Math.PI) az -= 2 * Math.PI; while (az - view.az < -Math.PI) az += 2 * Math.PI
    baseDist = fitDist(c.r)
    Object.assign(goal, { az, pol: a.pol, tx: c.tx, ty: c.ty, tz: c.tz, dist: baseDist })
    if (instant) Object.assign(view, goal)
  }
  function placeCamera() {
    const sp = Math.sin(view.pol)
    camera.position.set(view.tx + view.dist * sp * Math.sin(view.az), view.ty + view.dist * Math.cos(view.pol), view.tz + view.dist * sp * Math.cos(view.az))
    camera.lookAt(view.tx, view.ty, view.tz)
  }
  const ptr = new Map(); let pinchD = 0
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button,a')) return
    ptr.set(e.pointerId, [e.clientX, e.clientY]); try { stage.setPointerCapture(e.pointerId) } catch (_) { }
    stage.classList.add('drag'); $('#hint').classList.add('off')
    if (ptr.size === 2) { const p = [...ptr.values()]; pinchD = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) }
  })
  stage.addEventListener('pointermove', e => {
    const p = ptr.get(e.pointerId); if (!p) return
    const dx = e.clientX - p[0], dy = e.clientY - p[1]; p[0] = e.clientX; p[1] = e.clientY
    if (ptr.size === 1) { goal.az -= dx * 0.0065; goal.pol = clamp(goal.pol - dy * 0.0065, 0.12, 2.7); view.az = goal.az; view.pol = goal.pol }
    else if (ptr.size === 2) {
      const q = [...ptr.values()], d = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1])
      if (pinchD > 0 && d > 0) goal.dist = clamp(goal.dist * pinchD / d, baseDist * 0.4, baseDist * 2.4)
      pinchD = d
    }
  })
  const ptrUp = e => { ptr.delete(e.pointerId); pinchD = 0; if (!ptr.size) stage.classList.remove('drag') }
  stage.addEventListener('pointerup', ptrUp); stage.addEventListener('pointercancel', ptrUp)
  stage.addEventListener('wheel', e => { e.preventDefault(); goal.dist = clamp(goal.dist * Math.exp(e.deltaY * 0.0012), baseDist * 0.4, baseDist * 2.4); $('#hint').classList.add('off') }, { passive: false })
  $$('#views button[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)))

  // ── đồng hồ + hoạt cảnh ──
  let skew = 0
  const clock = () => performance.now() + skew   // đồng hồ của MỌI hoạt cảnh; skew chỉ khác 0 khi máy soát tua nhanh (__dbg.run)
  const anims = []                               // mỗi phần tử: now => true khi xong

  // ── nhãn + chấm điểm bám toạ độ 3D (toạ độ trong hệ của M.local nếu có, không thì hệ thế giới) ──
  const M = { local: null }
  const L = [], D = [], v3 = new THREE.Vector3()
  const REM = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  function label(html, get, when, dx, dy, cls) {   // dx, dy tính bằng rem
    const el = document.createElement('div'); el.className = 'lb ' + (cls || ''); el.innerHTML = html; el.style.display = 'none'; labelsEl.appendChild(el)
    const it = { el, get, when, dx: dx || 0, dy: dy || 0, on: false, local: M.local }; L.push(it); return it
  }
  function dot(get, when, color, r) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r || 0.16, 16, 12), new THREE.MeshBasicMaterial({ color: color || 0xffffff, transparent: true, depthTest: false }))
    m.renderOrder = 9; (M.local || scene).add(m); D.push({ m, get, when }); return m
  }
  function placeLabels() {
    const w = stage.clientWidth, h = stage.clientHeight, rem = REM()
    for (const it of L) {
      let on = it.when()
      if (on) { const p = it.get(); v3.set(p[0], p[1], p[2]); if (it.local) it.local.localToWorld(v3); v3.project(camera); on = v3.z < 1
        if (on) it.el.style.transform = 'translate(' + ((v3.x * 0.5 + 0.5) * w + it.dx * rem).toFixed(1) + 'px,' + ((-v3.y * 0.5 + 0.5) * h + it.dy * rem).toFixed(1) + 'px) translate(-50%,-50%)' }
      if (on !== it.on) { it.el.style.display = on ? '' : 'none'; it.on = on }
    }
  }

  // ── bước ──
  let step = 1, token = 0
  function renderPanel(keep) {
    const y = panel.scrollTop
    panel.innerHTML = cfg.bang(step); panel.scrollTop = keep ? y : 0
    $$('[data-tex]', panel).forEach(el => tex(el, el.dataset.tex, el.hasAttribute('data-d')))   // data-d = chế độ trình bày (tích phân, phân số to)
    if (cfg.sauBang) cfg.sauBang(step)
  }
  function syncChips() {
    $$('#chips .chip').forEach((c, i) => { c.classList.toggle('done', i + 1 < step); if (i + 1 === step) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current') })
    const t = cfg.nutTiep ? cfg.nutTiep() : null
    $('#prev').disabled = step === 1
    $('#next').disabled = t ? !!t.tat : step === N
    $('#next').textContent = (t && t.chu) || 'Tiếp ›'
  }
  async function goStep(n, o) {
    n = clamp(n | 0, 1, N); o = o || {}
    const my = ++token, prev = step
    step = n
    if (cfg.truocBang) cfg.truocBang(n, prev, o)
    renderPanel(); syncChips()
    if (cfg.khiDoiBuoc) await cfg.khiDoiBuoc(n, prev, o, my)
  }
  const tiep = () => { if (cfg.tiep && cfg.tiep()) return; if (step < N) goStep(step + 1, { next: true }) }
  $$('#chips .chip').forEach(c => c.addEventListener('click', () => goStep(+c.dataset.step)))
  $('#prev').addEventListener('click', () => goStep(step - 1))
  $('#next').addEventListener('click', tiep)
  addEventListener('keydown', e => {   // bút trình chiếu gửi PageUp/PageDown
    if (e.target.matches && e.target.matches('input')) return
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); tiep() }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); if (step > 1) goStep(step - 1) }
    else if (e.key === ' ' && cfg.phimCach && cfg.phimCach()) e.preventDefault()
  })

  // ── vòng lặp ──
  function resize() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1, zoom = goal.dist / baseDist
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
    for (const m of lineMats) m.resolution.set(w, h)
    baseDist = fitDist(cfg.khung[cfg.khungNao()].r); goal.dist = baseDist * zoom
  }
  let last = clock()
  function tick(now) {
    const dt = clamp((now - last) / 1000, 0, 0.05); last = now
    for (let i = anims.length - 1; i >= 0; i--) if (anims[i](now)) anims.splice(i, 1)
    const k = RM ? 1 : 1 - Math.exp(-dt * 8)
    for (const key in view) view[key] += (goal[key] - view[key]) * k
    placeCamera()
    if (cfg.moiKhung) cfg.moiKhung(now, dt)
    scene.updateMatrixWorld()
    if (cfg.dongBo) cfg.dongBo()
    for (const d of D) { const on = d.when(); d.m.visible = on; if (on) { const p = d.get(); d.m.position.set(p[0], p[1], p[2]) } }
    renderer.render(scene, camera)
    placeLabels()
  }
  // Không dùng mốc giờ rAF đưa vào: nó là ĐẦU khung hình, có thể SỚM hơn t0 = clock() lấy trong sự kiện bấm cùng khung ⇒ tiến độ âm
  // (đã dính: chồng 80 lát, tiến độ −0,01 làm tròn thành lát thứ −1).
  function loop() { requestAnimationFrame(loop); tick(clock()) }
  function start() {   // gọi SAU khi trang bài đã dựng xong vật thể. Địa chỉ: ?buoc=N (+ tham số riêng của bài qua cfg.thamSo)
    const q = new URLSearchParams(location.search), o = Object.assign({ first: true }, cfg.thamSo ? cfg.thamSo(q) : {})
    new ResizeObserver(resize).observe(stage); resize()
    goStep(+q.get('buoc') || 1, o)
    requestAnimationFrame(loop)
  }

  // Soát bằng máy. Browser pane ẩn thì requestAnimationFrame KHÔNG chạy ⇒ run(ms) tua hoạt cảnh; snap() chụp canvas gửi về
  // server dev (scripts/serve-games.mjs nhận POST /_snap).
  window.__dbg = { goStep, setView, view, goal, fat: FAT,
    get step() { return step },
    run(ms) { const b = clock(); for (let t = 16; t <= ms; t += 16) tick(b + t); skew += ms },
    snap(name) { tick(clock()); return fetch('/_snap?name=' + (name || 'the-tich'), { method: 'POST', body: cv.toDataURL('image/jpeg', 0.9) }).then(r => r.text()) } }

  Object.assign(M, { RM, $, $$, clamp, fmt, tn, tex, stage, panel, views: $('#views'), scene, camera, renderer, mkLine, setLine, view, goal, setView,
    clock, anims, label, dot, renderPanel, syncChips, goStep, start,
    token: () => token, alive: my => my === token })   // token = số lượt chuyển bước; hoạt cảnh cũ tự dừng khi !alive(my)
  Object.defineProperty(M, 'step', { get: () => step })   // khai riêng vì Object.assign chép GIÁ TRỊ của getter
  return M
}
