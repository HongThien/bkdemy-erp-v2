// BK Games — hiệu ứng TRÚNG TRÀ SỮA 🧋 (quà đặc biệt bản BUỔI HỌC, spec-game-buoi-hoc §5d — Thùy 28/09: "phải thật bùng nổ").
// DÙNG CHUNG cho mọi game bản lớp (Mở Rương, Chiếm Đất…): 1 file, không chép vào từng game. Tự chứa (DOM + canvas 2D + WebAudio),
// không phụ thuộc three.js của game. TV CHỈ DIỄN — trúng hay không do DB rút (fn_buoi_game_choi), file này không rút gì.
//   window.bkTraSua({ten, giai, exp, sound}) → Promise, xong khi người xem bấm "Tuyệt vời" / Space / Enter (khoá 2,8s đầu chống bấm lỡ).
//   Xem thử (không dữ liệu): Ctrl+Shift+M trên màn TV bản lớp.
(function () {
  'use strict'
  var dang = false
  var TIMER = /loop=timer/.test(location.search) // tab ẩn / khung xem thử: rAF đứng ⇒ dùng timer (cùng quy ước với game)
  var frame = TIMER ? function (f) { return setTimeout(function () { f(performance.now()) }, 16) } : function (f) { return requestAnimationFrame(f) }
  var GIAI = { 1: '🥇 Giải Nhất', 2: '🥈 Giải Nhì', 3: '🎖 Giải 3' }
  var MAU = ['#ffd166', '#ff5c5c', '#5ee08a', '#7cc4ff', '#ff7bd1', '#ffffff', '#c58cff', '#ffb347']

  var CSS = '' +
    '#bkts{position:fixed;inset:0;z-index:99999;overflow:hidden;font-family:"Segoe UI",Arial,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '#bkts .bg{position:absolute;inset:0;background:#05020f;opacity:0;transition:opacity .35s}' +
    '#bkts.on .bg{opacity:.9}' +
    '#bkts.boom .bg{opacity:.97;background:radial-gradient(circle at 50% 42%,#ff7bd1 0%,#a23cff 34%,#2a0a66 68%,#0b0324 100%);animation:bktsHue 4s linear infinite}' +
    '#bkts .rays{position:absolute;left:50%;top:42%;width:260vmax;height:260vmax;margin:-130vmax 0 0 -130vmax;opacity:0;' +
    'background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.2) 0 8deg,rgba(255,255,255,0) 8deg 20deg);animation:bktsSpin 16s linear infinite}' +
    '#bkts.boom .rays{opacity:1;transition:opacity .6s}' +
    '#bkts canvas{position:absolute;inset:0;width:100%;height:100%}' +
    '#bkts .flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}' +
    '#bkts.boom .flash{animation:bktsFlash 1s ease-out}' +
    '#bkts .mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2vh 3vw}' +
    '#bkts .cup{font-size:min(34vh,28vw);line-height:1.05;filter:drop-shadow(0 0 6vh rgba(255,255,255,.75))}' +
    '#bkts.pre .cup{animation:bktsRung .09s linear infinite,bktsLon 1.3s ease-in forwards}' +
    '#bkts.boom .cup{animation:bktsNo .9s cubic-bezier(.2,1.6,.35,1) both,bktsNhun 1.1s ease-in-out .9s infinite}' +
    '#bkts .pre-t{font-size:min(6vh,5vw);font-weight:900;color:#fff;letter-spacing:.2em;margin-top:2vh;animation:bktsNhay .35s ease-in-out infinite alternate}' +
    '#bkts.boom .pre-t{display:none}' +
    '#bkts .ttl{display:none;font-weight:900;font-size:min(14vh,9.6vw);line-height:1;margin-top:-1vh;white-space:nowrap}' +
    '#bkts.boom .ttl{display:block}' +
    '#bkts .ttl i{display:inline-block;font-style:normal;color:#ffe066;-webkit-text-stroke:.06em #4a0b3a;paint-order:stroke fill;' +
    'text-shadow:0 .07em 0 #c2185b,0 .14em 0 #6a0f4a,0 0 .5em rgba(255,255,255,.9);transform:scale(0);' +
    'animation:bktsChu .55s cubic-bezier(.2,1.8,.4,1) forwards,bktsSong 1.2s ease-in-out infinite,bktsHue 2.4s linear infinite}' +
    '#bkts .who{opacity:0;font-size:min(7.5vh,5.4vw);font-weight:900;color:#fff;margin-top:2vh;text-shadow:0 .08em .3em rgba(0,0,0,.6)}' +
    '#bkts .sub{opacity:0;font-size:min(3.6vh,2.7vw);font-weight:700;color:#ffe9f6;margin-top:1vh;text-shadow:0 2px 8px rgba(0,0,0,.6)}' +
    '#bkts.boom .who{animation:bktsHien .6s ease-out .75s forwards}' +
    '#bkts.boom .sub{animation:bktsHien .6s ease-out 1.1s forwards}' +
    '#bkts button{opacity:0;pointer-events:none;margin-top:3vh;font:900 min(4.4vh,3.2vw) "Segoe UI",Arial,sans-serif;padding:.5em 1.6em;border:0;border-radius:999px;cursor:pointer;' +
    'color:#3a0a2a;background:linear-gradient(180deg,#ffe066,#ffb020);box-shadow:0 .25em 0 #b26a00,0 0 2em rgba(255,224,102,.8)}' +
    '#bkts.san button{opacity:1;pointer-events:auto;animation:bktsNhay .5s ease-in-out infinite alternate;transition:opacity .4s}' +
    'html.bkts-rung body{animation:bktsDong 1.1s cubic-bezier(.3,.7,.4,1)}' +
    '@keyframes bktsHue{to{filter:hue-rotate(360deg)}}' +
    '@keyframes bktsSpin{to{transform:rotate(360deg)}}' +
    '@keyframes bktsFlash{0%{opacity:1}100%{opacity:0}}' +
    '@keyframes bktsRung{0%{translate:-1.2vw .6vh}25%{translate:1vw -.8vh}50%{translate:-.8vw -.6vh}75%{translate:1.2vw .8vh}100%{translate:0 0}}' +
    '@keyframes bktsLon{0%{transform:scale(.35) rotate(-6deg)}80%{transform:scale(1) rotate(6deg)}100%{transform:scale(1.25) rotate(0)}}' +
    '@keyframes bktsNo{0%{transform:scale(0) rotate(-200deg)}60%{transform:scale(1.35) rotate(12deg)}100%{transform:scale(1) rotate(0)}}' +
    '@keyframes bktsNhun{0%,100%{transform:translateY(0) rotate(-5deg) scale(1)}50%{transform:translateY(-3vh) rotate(5deg) scale(1.06)}}' +
    '@keyframes bktsChu{0%{transform:scale(0) rotate(-40deg)}100%{transform:scale(1) rotate(0)}}' +
    '@keyframes bktsSong{0%,100%{translate:0 0}50%{translate:0 -1.4vh}}' +
    '@keyframes bktsHien{0%{opacity:0;transform:translateY(3vh) scale(.8)}100%{opacity:1;transform:none}}' +
    '@keyframes bktsNhay{0%{transform:scale(1)}100%{transform:scale(1.08)}}' +
    '@keyframes bktsDong{0%,100%{transform:translate(0,0)}10%{transform:translate(-2.2vw,1.6vh)}20%{transform:translate(2vw,-1.8vh)}30%{transform:translate(-1.6vw,-1.2vh)}' +
    '40%{transform:translate(1.4vw,1.2vh)}55%{transform:translate(-.9vw,.7vh)}70%{transform:translate(.6vw,-.5vh)}85%{transform:translate(-.3vw,.2vh)}}'

  function bkTraSua(o) {
    o = o || {}
    if (dang) return Promise.resolve()
    dang = true
    var snd = o.sound !== false
    return new Promise(function (xong) {
      if (!document.getElementById('bkts-css')) { var st = document.createElement('style'); st.id = 'bkts-css'; st.textContent = CSS; document.head.appendChild(st) }
      var root = document.createElement('div'); root.id = 'bkts'
      var chu = 'TRÚNG TRÀ SỮA!'.split('').map(function (c, i) {
        return c === ' ' ? '<i style="width:.3em">&nbsp;</i>' : '<i style="animation-delay:' + (i * 0.06).toFixed(2) + 's,' + (0.6 + i * 0.08).toFixed(2) + 's,' + (i * -0.17).toFixed(2) + 's">' + c + '</i>'
      }).join('')
      root.innerHTML = '<div class="bg"></div><div class="rays"></div><canvas></canvas><div class="flash"></div>' +
        '<div class="mid"><div class="cup">🎁</div><div class="pre-t">QUÀ ĐẶC BIỆT…</div><div class="ttl">' + chu + '</div>' +
        '<div class="who"></div><div class="sub"></div><button type="button">Tuyệt vời ▶</button></div>'
      document.body.appendChild(root)
      var giai = GIAI[+o.giai] || ''
      root.querySelector('.who').textContent = (o.ten || '') + (o.ten && giai ? ' · ' : '') + giai
      root.querySelector('.sub').textContent = 'Quà đặc biệt SIÊU HIẾM — nhận trà sữa từ thầy cô nhé!' + (o.exp ? ' (+' + o.exp + ' EXP vẫn vào tài khoản)' : '')
      var cv = root.querySelector('canvas'), g = cv.getContext('2d'), DPR = Math.min(1.5, window.devicePixelRatio || 1), W = 0, H = 0
      function co() { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0) }
      co(); addEventListener('resize', co)
      // 🧋 vẽ sẵn 1 lần ra canvas phụ (fillText emoji mỗi khung hình rất chậm)
      var ly = document.createElement('canvas'); ly.width = ly.height = 96
      var lg = ly.getContext('2d'); lg.font = '76px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; lg.textAlign = 'center'; lg.textBaseline = 'middle'; lg.fillText('🧋', 48, 52)

      // ---------- âm thanh ----------
      var AC = null
      function ac() { if (!snd) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); return AC } catch (e) { return null } }
      function not(f, d, kieu, v, truot, tre) {
        var a = ac(); if (!a) return
        try {
          var t = a.currentTime + (tre || 0), os = a.createOscillator(), ga = a.createGain()
          os.type = kieu || 'triangle'; os.frequency.setValueAtTime(f, t); if (truot) os.frequency.exponentialRampToValueAtTime(truot, t + d)
          ga.gain.setValueAtTime(v || 0.1, t); ga.gain.exponentialRampToValueAtTime(0.0001, t + d)
          os.connect(ga); ga.connect(a.destination); os.start(t); os.stop(t + d + 0.03)
        } catch (e) { }
      }
      function no(tre, to) { // tiếng pháo: nhiễu trắng tắt dần qua lọc thấp
        var a = ac(); if (!a) return
        try {
          var n = Math.floor(a.sampleRate * 0.5), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0)
          for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4)
          var s = a.createBufferSource(), f = a.createBiquadFilter(), ga = a.createGain(), t = a.currentTime + (tre || 0)
          s.buffer = b; f.type = 'lowpass'; f.frequency.setValueAtTime(to ? 2600 : 1500, t); f.frequency.exponentialRampToValueAtTime(180, t + 0.45)
          ga.gain.setValueAtTime(to ? 0.5 : 0.22, t); s.connect(f); f.connect(ga); ga.connect(a.destination); s.start(t)
        } catch (e) { }
      }
      function trong() { for (var i = 0; i < 20; i++) not(150 + i * 26, 0.07, 'square', 0.035 + i * 0.003, null, i * 0.065) }
      function kenVang(tre) {
        tre = tre || 0;
        [523, 659, 784].forEach(function (f) { not(f, 0.9, 'sawtooth', 0.05, null, tre) });
        [523, 659, 784, 1047, 1319, 1568, 2093].forEach(function (f, i) { not(f, 0.45, 'triangle', 0.13, null, tre + 0.12 + i * 0.1) });
        [1047, 1319, 1568, 2093].forEach(function (f) { not(f, 1.4, 'triangle', 0.07, null, tre + 0.95) })
      }

      // ---------- hạt ----------
      var hat = []
      function phao(x, y, to) { // 1 bông pháo hoa
        var m1 = MAU[(Math.random() * MAU.length) | 0], m2 = MAU[(Math.random() * MAU.length) | 0], n = to ? 150 : 80
        for (var i = 0; i < n; i++) {
          var a = Math.random() * Math.PI * 2, v = (to ? 6 : 4) + Math.random() * (to ? 13 : 8)
          hat.push({ k: 0, x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 2 + Math.random() * 3.5, m: i % 2 ? m1 : m2, d: 1, td: 0.011 + Math.random() * 0.012 })
        }
      }
      function giay(n) { // pháo giấy từ 2 góc dưới bắn chéo lên
        for (var i = 0; i < n; i++) {
          var tr = i % 2 === 0
          hat.push({ k: 1, x: tr ? -10 : W + 10, y: H * (0.75 + Math.random() * 0.25), vx: (tr ? 1 : -1) * (6 + Math.random() * 16), vy: -(9 + Math.random() * 17), s: 6 + Math.random() * 9, m: MAU[(Math.random() * MAU.length) | 0], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5, d: 1, td: 0.004 + Math.random() * 0.004 })
        }
      }
      function mua(n) { // mưa ly trà sữa + trân châu
        for (var i = 0; i < n; i++) {
          var ly1 = Math.random() < 0.45
          hat.push({ k: ly1 ? 2 : 3, x: Math.random() * W, y: -40 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 2.4, vy: 3 + Math.random() * 6, s: ly1 ? 34 + Math.random() * 54 : 7 + Math.random() * 10, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.16, d: 1, td: 0, nay: 0 })
        }
      }
      function buoc() {
        g.clearRect(0, 0, W, H)
        for (var i = hat.length - 1; i >= 0; i--) {
          var p = hat[i]
          p.x += p.vx; p.y += p.vy
          if (p.k === 0) { p.vx *= 0.965; p.vy = p.vy * 0.965 + 0.13 } else if (p.k === 1) { p.vx *= 0.985; p.vy += 0.42; p.r += p.vr } else { p.vy += 0.12; p.r += p.vr }
          if (p.k === 3 && p.y > H - p.s && p.nay < 2) { p.y = H - p.s; p.vy *= -0.55; p.nay++ } // trân châu nảy dưới đáy
          p.d -= p.td
          if (p.d <= 0 || p.y > H + 120 || p.x < -200 || p.x > W + 200) { hat.splice(i, 1); continue }
          g.globalAlpha = Math.max(0, Math.min(1, p.d))
          if (p.k === 0) { g.fillStyle = p.m; g.beginPath(); g.arc(p.x, p.y, p.s * (0.4 + p.d * 0.6), 0, 6.283); g.fill() }
          else if (p.k === 1) { g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.m; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore() }
          else if (p.k === 2) { g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.drawImage(ly, -p.s / 2, -p.s / 2, p.s, p.s); g.restore() }
          else { g.fillStyle = '#2b1408'; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(p.x - p.s * 0.3, p.y - p.s * 0.3, p.s * 0.28, 0, 6.283); g.fill() }
        }
        g.globalAlpha = 1
        if (song) khung = frame(buoc)
      }

      // ---------- kịch bản ----------
      var song = true, khung = 0, hen = [], duocDong = false
      function sau(ms, f) { hen.push(setTimeout(function () { if (song) f() }, ms)) }
      function phaoNgauNhien(to) { phao(W * (0.12 + Math.random() * 0.76), H * (0.1 + Math.random() * 0.5), to); no(0, to) }
      root.classList.add('on', 'pre'); trong()          // 0 → 1,3s: hồi hộp — hộp quà rung + trống dồn
      khung = frame(buoc)
      sau(1300, function () {                           // BÙM
        root.classList.remove('pre'); root.classList.add('boom')
        root.querySelector('.cup').textContent = '🧋'
        document.documentElement.classList.add('bkts-rung')
        no(0, true); no(0.08, true); kenVang(0.05)
        phao(W / 2, H * 0.42, true); phao(W * 0.22, H * 0.3, true); phao(W * 0.78, H * 0.3, true)
        giay(260); mua(70)
      })
      sau(2400, function () { document.documentElement.classList.remove('bkts-rung') })
      for (var k = 0; k < 12; k++) (function (k) { sau(1700 + k * 520, function () { phaoNgauNhien(k % 3 === 0) }) })(k)   // dồn dập ~6s đầu
      sau(2600, function () { giay(200); mua(50) })
      sau(3500, function () { kenVang(0) })
      sau(4300, function () { giay(200); mua(50) })
      sau(5700, function () { kenVang(0); giay(160) })
      sau(2800, function () { duocDong = true; root.classList.add('san') })
      var lap = setInterval(function () { if (!song) return; phaoNgauNhien(false); if (Math.random() < 0.5) mua(14) }, 1400) // giữ không khí tới khi bấm
      sau(8000, function () { /* sau 8s chỉ còn pháo thưa do `lap` */ })

      function dong() {
        if (!duocDong || !song) return
        song = false; dang = false
        hen.forEach(clearTimeout); clearInterval(lap); if (TIMER) clearTimeout(khung); else cancelAnimationFrame(khung)
        removeEventListener('resize', co); removeEventListener('keydown', phim, true)
        document.documentElement.classList.remove('bkts-rung')
        root.style.transition = 'opacity .35s'; root.style.opacity = '0'
        setTimeout(function () { root.remove(); xong() }, 360)
      }
      // chặn phím xuống game bên dưới (Space/Enter của game = "bạn tiếp") trong lúc đang ăn mừng
      function phim(e) {
        e.stopImmediatePropagation(); e.preventDefault()
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') dong()
      }
      addEventListener('keydown', phim, true)
      root.addEventListener('pointerdown', function (e) { e.stopPropagation(); dong() })
    })
  }

  window.bkTraSua = bkTraSua
  // Xem thử hiệu ứng (không dữ liệu, không ghi gì): Ctrl+Shift+M — chỉ trên màn TV bản lớp
  if (/che_do=lop/.test(location.search)) addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key || '').toLowerCase() === 'm') { e.preventDefault(); bkTraSua({ ten: 'Xem thử hiệu ứng', giai: 1, exp: 0 }) }
  })
})()
