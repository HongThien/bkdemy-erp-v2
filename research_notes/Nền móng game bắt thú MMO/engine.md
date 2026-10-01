# Engine / renderer choice for a browser (PWA) creature-catching action game → MMO (as of 30 Sep 2026)

Scope: three.js (latest), Babylon.js 8/9, PlayCanvas, Cocos Creator 3.x/4.0, Unity 6 Web, Godot 4.x web, plus Needle Engine. Weakest device: iPad 7th gen (A10 Fusion, 3 GB RAM). Existing code: three.js r128, procedural chibi models, no skeletal animation.

Source-quality note: several comparison numbers come from utsubo.com (a three.js/web-3D studio blog, updated Sep 2026). It is a secondary source with a likely three.js bias; primary sources (official docs/blogs, GitHub issues) are preferred where available, and conflicts are flagged.

---

## Q1. What is the real baseline device? (iPad 7th gen: iPadOS/Safari ceiling, WebGL2 vs WebGPU)

### Takeaway
iPad 7th gen is capped at iPadOS 18.x (Safari 18), while WebGPU shipped in Safari 26 — so the weakest target is **WebGL2-only, permanently**. Whatever engine is chosen must run well on its WebGL2 path; WebGPU is an optional upgrade for newer devices only.

### Cited Findings
- iPadOS 26 dropped exactly one iPad line from the iPadOS 18 list: the 7th-gen iPad; owners stay on 18.x. Reason given: iPadOS 26 requires A12 or newer, the A10 Fusion lacks the Neural Engine. — [iClarified: iPadOS 26 supported devices](https://www.iclarified.com/97601/ipados-26-supported-devices-the-full-list-of-compatible-ipads); [AppleInsider](https://appleinsider.com/articles/25/06/09/what-iphones-and-ipads-will-run-ios-26-ipados-26); [EveryMac](https://everymac.com/systems/apple/ipad/ipad-faq/ipados-26-supported-devices-ipad-system-requirements.html)
- iPadOS 27 (announced June 2026) drops a further "wave" of iPads, i.e., the low-end installed base on older Safari keeps growing. — [MacRumors, 8 Jun 2026](https://www.macrumors.com/2026/06/08/ipados-27-drops-support-for-a-wave-of-ipads/)
- WebGPU shipped in **Safari 26.0** on macOS, iOS, iPadOS and visionOS (Sept 2025); Safari 26.2 added WebXR+WebGPU on Vision Pro. — [WebKit: Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/); [WebKit: Safari 26.2](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/); [WWDC25 WebKit post](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/)
- WebGL2 is available on Safari 15 and later ("Apple Safari doesn't support WebGL 2 in versions before Safari 15"). — [Unity 6 manual: Web browser compatibility](https://docs.unity3d.com/6000.4/Documentation/Manual/webgl-browsercompatibility.html)
- iOS Safari page memory limit is reported as ~2–3 GB depending on device model and *includes GPU memory*; iPhone 15 Pro reloads at ~3 GB. — [Apple Developer Forums: Browser memory limit on iOS](https://developer.apple.com/forums/thread/741624); [Apple Developer Forums: iPhone 12 Pro memory](https://developer.apple.com/forums/thread/761666)
- Safari attributes GPU memory to the page process (unlike Chrome's separate GPU process); a Babylon user measured ~900 MB in Safari vs ~300–400 MB in Chrome for the same basic scene, and iOS devices hit a ~2 GB limit and reloaded (2023, re-confirmed May 2024). — [Babylon forum: Safari memory footprint](https://forum.babylonjs.com/t/surprisingly-big-memory-footprint-on-safari-against-chromium/39130)
- Resizing an on-screen WebGL canvas in iOS Safari has been reported to leak memory. — [Apple Developer Forums thread 668999](https://developer.apple.com/forums/thread/668999)

### Inferences
- On iOS, Safari's engine version is tied to the OS (all iOS browsers use WebKit), so an iPad 7 cannot obtain WebGPU via a newer Safari or a different browser. Treat "WebGL2 on Safari 18 / A10 / 3 GB" as the hard floor for the whole product life.
- With 3 GB total RAM and a per-page limit that is "device dependent", a realistic budget for the whole page (JS heap + WASM heap + textures + geometry) on iPad 7 is likely well under 1 GB; engines that pre-reserve a large WASM heap (Unity, Godot) are structurally disadvantaged here.
- Canvas resize handling (orientation change, split view) should be tested explicitly on iPad because of the reported leak.

### Gaps
- No official Apple figure for the per-tab memory limit on a 3 GB A10 iPad was found; the 2–3 GB numbers are for newer/larger-RAM devices.
- No benchmark specifically of any engine on an A10 iPad under Safari 18 was found.

---

## Q2. Performance and stability on iOS Safari / iPad per engine

### Takeaway
Pure-JS/WebGL engines (three.js, Babylon, PlayCanvas, Cocos web) run in Safari's normal JS heap and have no structural iOS blocker. Unity Web and Godot 4 Web (WASM-heap engines) have a documented, recurring history of iOS Safari tab reloads/crashes tied to memory, and Godot 4 web is WebGL2-Compatibility-renderer-only with acknowledged Safari WebGL2 issues.

### Cited Findings
**three.js**
- `WebGPURenderer` automatically falls back to WebGL 2 where WebGPU isn't available, "so one codebase covers every user". — [utsubo: What's new in three.js (2026)](https://www.utsubo.com/blog/threejs-2026-what-changed)
- Caveat: "WebGPU isn't faster everywhere: three.js forum users report scenes where WebGPURenderer is slower than WebGLRenderer." — [utsubo: What's new in three.js (2026)](https://www.utsubo.com/blog/threejs-2026-what-changed)
- WebGL1 support was removed in r163 (WebGL2 required) — fine for iPad 7 (Safari 18 has WebGL2). — [three.js Migration Guide wiki](https://github.com/mrdoob/three.js/wiki/Migration-Guide)

**Babylon.js**
- Clustered lighting in 9.0 "works on both WebGPU and WebGL 2"; Frame Graph gives "substantial GPU memory savings (40% or more in some cases)". — [Windows Dev Blog: Announcing Babylon.js 9.0 (26 Mar 2026)](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/)
- Safari memory ~3x Chrome for the same scene reported (see Q1). — [Babylon forum](https://forum.babylonjs.com/t/surprisingly-big-memory-footprint-on-safari-against-chromium/39130)

**PlayCanvas**
- Engine is "built on WebGL2 & WebGPU"; claims full WebGPU (incl. compute) while keeping WebGL2. — [playcanvas/engine GitHub](https://github.com/playcanvas/engine); [playcanvas.com](https://playcanvas.com/)

**Unity 6 Web**
- Officially supported mobile browsers: iOS Safari 15+ and Chrome 58+ on Android; "Use the latest browser versions… Older versions might have issues". — [Unity 6000.4 manual: Web browser compatibility](https://docs.unity3d.com/6000.4/Documentation/Manual/webgl-browsercompatibility.html)
- Mobile (iOS/Android) browser support only arrived with Unity 6 (announced Nov 2023). — [Unity blog: Web runtime updates (30 Nov 2023, older)](https://unity.com/blog/engine-platform/web-runtime-updates-enhance-browser-experience)
- Long-running Unity thread: whenever the WASM heap needs to grow from 256 MB to ~300–500 MB, the iOS tab crashes/force-reloads; reported for older versions and Unity 6. — [Unity Discussions: WebGL memory increment crash on iOS](https://discussions.unity.com/t/webgl-memory-increment-issue-and-crash-on-ios/894771); [page 2](https://discussions.unity.com/t/webgl-memory-increment-issue-and-crash-on-ios/894771?page=2)
- Unity issue tracker: "Memory usage increased in newer versions when using Safari". — [Unity Issue Tracker](https://issuetracker.unity3d.com/issues/memory-usage-increased-in-newer-versions-when-using-safari)
- Practitioner guidance: iOS Safari enforces roughly a 300–500 MB WebGL heap ceiling; set Memory Size to 256 MB (384 if unavoidable, accepting some iPhones will fail). (Secondary blog.) — [Bugnet: Unity WebGL crashing on Safari iOS](https://bugnet.io/blog/how-to-fix-unity-webgl-build-crashing-on-safari-ios)
- Also: "Memory crash on iOS despite low resident memory, high untracked memory" (Unity Discussions). — [Unity Discussions thread 1648482](https://discussions.unity.com/t/memory-crash-on-ios-despite-low-resident-memory-usage-high-untracked-memory/1648482)
- Safari does not support IndexedDB for content in an iframe (affects Unity's data caching when embedded). — [Unity manual](https://docs.unity3d.com/6000.4/Documentation/Manual/webgl-browsercompatibility.html)

**Godot 4.x Web** (current stable docs = 4.7)
- Web export uses **only the Compatibility renderer (WebGL 2.0)**; "Forward+/Mobile are not supported on the web platform"; WebGPU not supported. C# projects cannot be exported to web in Godot 4. — [Godot docs: Exporting for the Web (stable/4.7)](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
- Safari has "several issues with WebGL 2.0 support" per Godot docs; single-threaded export works "very well" on macOS/iOS where threaded exports had problems. — [Godot docs: Exporting for the Web](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
- Threads require `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` (SharedArrayBuffer/cross-origin isolation); since 4.3 single-threaded export is the default precisely to avoid this. Godot devs admit they "underestimated the difficulty of configuring cross-origin isolated websites". — [Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html); [Godot blog: Web export in 4.3](https://godotengine.org/article/progress-report-web-export-in-4-3/)
- Single-threaded audio: default "Sample" playback is low-latency but lacks AudioEffects/reverb; "Stream" mode restores effects at higher latency. — [Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
- GitHub #107390 (Godot 4.5-dev5, 2025): web game crashes/reloads in iOS Safari and Chrome after a few minutes **if audio is used** (iPhone 15 Pro, iOS 18.5); fine with audio disabled; no crash on Android. — [godot#107390](https://github.com/godotengine/godot/issues/107390)
- GitHub #110187: web export crashes on iPads running iOS/iPadOS 17.x after some time, in every browser; updating to latest 18.x fixed it. — [godot#110187](https://github.com/godotengine/godot/issues/110187)
- GitHub #88321 (Feb 2024, 4.3-dev3): no-threads web builds crash/reload on iOS Safari (seconds for complex projects, minutes for minimal repro); root cause not found; closed "not planned". — [godot#88321](https://github.com/godotengine/godot/issues/88321)
- Forum reports for 4.3 (WebGL context loss on iOS) and 4.4.1 (mobile browser resets); a forum reply states web exports must stay below ~300 MB runtime memory or iOS force-reloads. — [Godot forum: WebGL context loss 4.3 iOS](https://forum.godotengine.org/t/webgl-context-loss-and-app-crash-in-godot-4-3-exported-web-on-ios-browsers/81024); [Godot forum: 4.4.1 mobile resets](https://forum.godotengine.org/t/godot-4-4-1-html-exports-resets-crashes-when-playing-on-mobile-browsers/114247); [Godot forum: iOS suddenly crashing](https://forum.godotengine.org/t/web-export-to-ios-suddenly-crashing-after-working-for-ages/120627/5)

**Cocos Creator**
- Since 3.8.0 several modules are WASM (Spine, WebGPU backend, Bullet and PhysX physics). — [Cocos docs 3.8: 3D Physics](https://docs.cocos.com/creator/3.8/manual/en/physics/physics.html) (as summarized by search; see also Q4)

### Inferences
- For iPad 7 specifically, the ranking of structural risk is: Unity Web and Godot 4 Web (high: WASM heap growth + documented iOS reloads + big binaries) > Cocos (medium: JS engine but WASM physics/Spine modules; strong mobile-web track record in China per its positioning) > Babylon (low–medium: heavier engine, Safari memory reports) > three.js / PlayCanvas (low: light JS engines, you control memory).
- Godot's iOS problems are clustered around audio and memory, and several were closed without root cause — i.e., the team would be depending on upstream WebKit/Emscripten fixes it cannot influence.
- three.js's safest path for iPad 7 is plain `WebGLRenderer` (the mature path); `WebGPURenderer` with WebGL2 fallback is viable but should be benchmarked on the iPad before adopting, given forum reports of it being slower in some scenes.

### Gaps
- No controlled benchmark of the same scene across engines on iOS Safari found.
- No iOS-crash reports specifically for Cocos Creator 3.8 web builds were researched (search budget); Cocos's iOS web stability is inferred, not verified.
- Unity 6 WebGPU status in 2026 not re-verified; latest source found (Nov 2023) said WebGPU was early access and "not recommend[ed] for production".

---

## Q3. Initial download size and mobile load time

### Takeaway
three.js is by far the smallest runtime (~170–185 KB gz; ~300 KB for `three/webgpu`), PlayCanvas ~615 KB, full Babylon core ~1.4–1.8 MB gz (tree-shakable), Unity 6 empty web ~2–2.5 MB compressed only after aggressive stripping (default ~10.7 MB raw), and Godot 4 ~5–9 MB compressed WASM for an empty project. For a Vietnamese school/mobile audience on variable 4G, the JS engines win clearly; the game's own assets (GLB, textures, audio) will dominate anyway.

### Cited Findings
- three.js ≈ 185 kB min+gz (full `three`), ≈ 300 kB for `three/webgpu`; PlayCanvas ≈ 615 kB; Babylon ≈ 1.8 MB (`@babylonjs/core`), updated 24 Sep 2026. — [utsubo: three.js vs Babylon.js vs PlayCanvas (2026)](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)
- Another comparison: three.js v0.175.0 ≈ 168.4 kB min+gz; Babylon.js v8.1.1 ≈ 1.4 MB, modular so tree-shaking reduces it; minimal three.js game bundles ~150–200 kB gz. — [LogRocket: Three.js vs Babylon.js](https://blog.logrocket.com/three-js-vs-babylon-js/) / [Cinevva guide](https://app.cinevva.com/guides/threejs-vs-babylonjs) (search-summary figures; **conflict**: 1.4 MB vs 1.8 MB for Babylon core — different versions/measurements)
- Babylon 8.0 ships all core shaders in both GLSL and WGSL, "essentially making Babylon.js 2x smaller when targeting WebGPU" (no runtime shader-conversion layer). — [Babylon.js 8.0 on Medium](https://babylonjs.medium.com/introducing-babylon-js-8-0-77644b31e2f9); [Windows Dev Blog: Babylon 8.0 (27 Mar 2025)](https://blogs.windows.com/windowsdeveloper/2025/03/27/announcing-babylon-js-8-0/)
- Unity 6.0.23 "empty" web build (Aras Pranckevičius, Oct 2024): default 3D URP template 10.7 MB (3.7 data + 6.9 code); 2D built-in 7.7 MB; after removing splash/packages, High stripping, "Faster (smaller) builds", no WASM exceptions, no UI/Input System, LTO → ~2.0 MB. — [aras-p gist: Unity 6 "empty" web build sizes](https://gist.github.com/aras-p/740c2d4f9977ce92b7de72b1394dd365)
- Brotli-compressed empty Unity web build ≈ 2.5 MB; Playgama reports 10 MB → 2 MB with optimization. — [Playgama: shrink empty Unity build 10MB→2MB](https://playgama.com/blog/unity/how-to-shrink-empty-unity-build-from-10mb-to-2mb/)
- Unity load-time example (older, 2023): "Ready, Set, Cook!" on Pixel 5 at 48 Mbps went from 12 s → 5.5 s after Unity 6 web optimizations. — [Unity blog: Web runtime updates](https://unity.com/blog/engine-platform/web-runtime-updates-enhance-browser-experience)
- Godot 4.4 vanilla web export ≈ 42 MB uncompressed, ≈ 9 MB zipped; custom build profile templates ≈ 17 MB raw / ≈ 3.7 MB zipped. — [jion.in: From 42MB to 3MB – lean Godot web templates](https://jion.in/devlog/godot-web-minification)
- Brotli compressed a Godot wasm from 37 MB to 5 MB. — [amann.dev: Optimize size of Godot releases (2025)](https://amann.dev/blog/2025/godot_web_size/) (via search summary); load tests: [JohannesDeml/Godot-Web-LoadingTest](https://github.com/JohannesDeml/Godot-Web-LoadingTest)
- Cocos Creator 3: an empty `web-mobile` build was 1.8 MB with 3D and physics disabled (forum, **2021 — old**); 3.8.6 cut the Spine module ~40% vs 3.8.4. — [Cocos forum: Cocos Creator 3 build size](https://forum.cocosengine.org/t/cocos-creator-3-build-size/53154)

### Inferences
- Approximate engine-only payload (compressed) for a minimal 3D game: three.js 0.2–0.3 MB < PlayCanvas ~0.6 MB < Babylon ~0.8–1.8 MB (depends on tree-shaking) ≈ Cocos 1.8 MB+ < Unity 2–7 MB < Godot 4–9 MB. Engine-only code also has parse/compile cost on an A10: WASM of 20–40 MB uncompressed (Godot) is much heavier to compile than a few hundred KB of JS.
- For a PWA, all can be cached by a service worker after first load; the first-visit cost matters most for students on phones/school PCs.

### Gaps
- No measured first-load time on an actual mid-range Android/iPad for each engine was found.
- PlayCanvas and Cocos sizes are not from primary benchmarks for 2026 builds.

---

## Q4. Built-in feature coverage (skeletal animation + blending/state machine, retargeting, glTF, instancing, particles/VFX, physics, navmesh, post-processing)

### Takeaway
Unity, Godot and Cocos ship the most complete "game" feature set (animation state machines, retargeting, physics, particles, navmesh) but carry the iOS/size/editor penalties above. Among web-native engines, **Babylon 9 is the most batteries-included** (Havok physics + character controller, animation retargeting, visual Node Particle Editor, Recast navmesh plugin, Inspector), PlayCanvas has an animation state graph + ammo.js physics, and three.js is a renderer that needs a curated stack (Rapier, recast-navigation-js, three.quarks, hand-written animation FSM).

### Cited Findings
**three.js (r186)**
- Physics: none built in; use Rapier or cannon-es. Animation system exists but "requires external solutions for state machines". — [utsubo comparison](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)
- Retargeting: `SkeletonUtils.retarget()` / `retargetClip()` exist in addons. — [three.js docs: SkeletonUtils](https://threejs.org/docs/pages/module-SkeletonUtils.html); but with known bugs/confusing params (off-by-one frame, documented params error; community "fixing retarget" thread). — [three.js#25288](https://github.com/mrdoob/three.js/issues/25288); [three.js#25751](https://github.com/mrdoob/three.js/issues/25751); [three.js forum: Fixing SkeletonUtils retarget](https://discourse.threejs.org/t/fixing-skeletonutils-retarget-and-retargetclip-functions/65149)
- r185/r186 animation improvements: `BezierInterpolant`, fix for timeScale reversal jump. — [three.js releases](https://github.com/mrdoob/three.js/releases)
- Navmesh: `@recast-navigation/three` (WASM port of Recast/Detour). — [npm @recast-navigation/three](https://www.npmjs.com/package/@recast-navigation/three)
- Particles/VFX: `three.quarks`, a general-purpose particle system for three.js (third-party). — [npm three.quarks](https://www.npmjs.com/package/three.quarks/v/0.3.1)
- Post-processing: since r155 inline tone mapping only applies when rendering to screen; post-processing chains need `OutputPass`. — [three.js Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)
- r186 adds `SunLight` addon with cascaded shadow maps for both renderers, `compileComputeAsync()`, Gaussian-splatting addon; r181 added a WebGPURenderer Inspector (performance/memory/timeline panels). — [utsubo: What's new in three.js (2026)](https://www.utsubo.com/blog/threejs-2026-what-changed)

**Babylon.js (9.0, Mar 2026; 9.x current)**
- 9.0: **animation retargeting** "even if they have different skeleton structures", plus an interactive Animation Retargeting Tool; **Node Particle Editor** (node-graph VFX: emission shapes, sprite sheets, sub-emitters, flow maps, attractors); Frame Graph; clustered lighting on WebGPU and WebGL2; all-new Inspector. — [Windows Dev Blog: Announcing Babylon.js 9.0](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/); [Part 2 tooling](https://blogs.windows.com/windowsdeveloper/2026/03/30/part-2-babylon-js-9-0-tooling-updates-and-new-geospatial-features/); [Part 3 OpenPBR](https://blogs.windows.com/windowsdeveloper/2026/04/02/part-3-babylon-js-9-0-openpbr-and-additional-engine-updates/)
- 8.0 (Mar 2025): **Havok character controller** ("start making character-centered games with just a few lines of code"), new audio engine, WGSL core shaders. — [Babylon.js 8.0 (Medium)](https://babylonjs.medium.com/introducing-babylon-js-8-0-77644b31e2f9); [Windows Dev Blog Part 2: audio, splats, physics](https://blogs.windows.com/windowsdeveloper/2025/03/31/part-2-babylon-js-8-0-audio-gaussian-splat-and-physics-updates/)
- Physics V2 architecture with Havok plugin (`@babylonjs/havok`, WASM). — [Babylon docs: Havok plugin](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin); [npm @babylonjs/havok](https://www.npmjs.com/package/@babylonjs/havok)
- Navmesh/crowd: `RecastJSPlugin` (can run navmesh build in a web worker, serialize navmesh to binary); community `recast-navigation-js` integration also exists. — [Babylon docs: Creating a navigation mesh](https://doc.babylonjs.com/features/featuresDeepDive/crowdNavigation/createNavMesh); [babylonjs-recast-navigation-js](https://github.com/RolandCsibrei/babylonjs-recast-navigation-js)
- Animation blending: `AnimationGroup.enableBlending`, `blendingSpeed`, `weight`, additive animations. — [Babylon docs: Grouping animations](https://doc.babylonjs.com/features/featuresDeepDive/animation/groupAnimations); [Advanced animation methods](https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations)
- **Conflict:** utsubo lists Babylon as having "animation state machines" built in — [utsubo comparison](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison); Babylon's own animation docs/forum describe weight-based blending via AnimationGroups and no built-in animation state-machine graph was found — [Babylon docs: Grouping animations](https://doc.babylonjs.com/features/featuresDeepDive/animation/groupAnimations); [Babylon forum: blending & weights](https://forum.babylonjs.com/t/animation-blending-and-animation-weights-using-animationgroup/2533). Treat "state machine" as something you write yourself in Babylon.

**PlayCanvas (engine 2.22.x)**
- "Full integration with 3D rigid-body physics engine ammo.js"; "Powerful state-based animations for characters and arbitrary scene properties"; glTF 2.0 with Draco + Basis; WebGL2 & WebGPU; MIT; engine written in TypeScript-friendly form with `playcanvas.d.ts`. — [playcanvas/engine GitHub](https://github.com/playcanvas/engine)
- Latest npm version 2.22.2 (late Sep 2026). — [npm playcanvas](https://www.npmjs.com/package/playcanvas)

**Cocos Creator (3.8.x LTS; 4.0 docs exist)**
- Marionette animation system (since 3.5): skeletal animation via **state machines**, pose graphs, events, IK, driven by the Animation Controller component. — [Cocos 3.8: Animation State Machine](https://docs.cocos.com/creator/3.8/manual/en/animation/marionette/animation-graph-basics.html); [Animation Controller](https://docs.cocos.com/creator/3.8/manual/en/animation/marionette/animation-controller.html); [Animation Graph assets](https://docs.cocos.com/creator/3.8/manual/en/animation/marionette/animation-graph.html)
- Physics backends: Bullet (default, asm.js/wasm), builtin (collision only), cannon.js, PhysX; since 3.8.0 Bullet, PhysX, Spine and the WebGPU backend are WASM. — [Cocos 3.8: 3D Physics System](https://docs.cocos.com/creator/3.8/manual/en/physics/physics.html)
- Engine repo lists a particle system and built-in animation system; WebGPU listed among graphics APIs. — [cocos/cocos-engine GitHub](https://github.com/cocos/cocos-engine)

**Unity 6 / Godot 4**
- Godot: animation retargeting via `SkeletonProfile`/`SkeletonProfileHumanoid` + `BoneMap` in the import dialog (since 4.0); `AnimationTree` state machines for blending/transitions. — [Godot blog: Animation retargeting in 4.0](https://godotengine.org/article/animation-retargeting-in-godot-4-0/); [Godot docs: Retargeting 3D skeletons](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/retargeting_3d_skeletons.html); [Godot docs: SkeletonProfile](https://docs.godotengine.org/en/4.4/classes/class_skeletonprofile.html); [KidsCanCode: AnimationTree StateMachine](https://kidscancode.org/godot_recipes/4.x/animation/using_animation_sm/index.html)
- Godot web is limited to the Compatibility renderer (reduced post-processing/feature set vs Forward+). — [Godot docs: Exporting for the Web](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)

**Needle Engine (three.js-based)**
- Built on three.js; integrates with Unity and Blender or code-only; built-in Rapier physics, WebXR (incl. iOS), **Multiplayer & VOIP**. Needle for Blender 1.0.0 released July 2026. — [needle.tools](https://needle.tools/); [Needle docs](https://engine.needle.tools/docs/); [Using Needle with three.js](https://engine.needle.tools/docs/three/)

### Inferences
- For this game's core loop (creature follows player, fights with elemental skills, capture-ball VFX, bosses): the must-haves are skinned GLB animation with crossfades + a small FSM, a VFX/particle system for elemental skills and the capture sequence, simple physics (ball arc, knockback — can even be kinematic), and navmesh/steering for wild creatures. All engines can do this; the difference is who writes the glue.
- Moving from procedural sphere animals + per-animal pose functions to **shared rigged GLB creatures (a common "quadruped chibi" skeleton) with shared clips** is the real upgrade, independent of engine. Retargeting across *different* skeletons is most mature in Unity (Humanoid, not verified this session), Godot (SkeletonProfile) and Babylon 9; in three.js `SkeletonUtils.retargetClip` works but is known-buggy — simplest is to author all creatures on one or a few shared skeletons so no retargeting is needed.
- Instancing (grass, trees, crowds of wild creatures): three.js has `InstancedMesh`/`BatchedMesh`, Babylon has thin instances, PlayCanvas/Cocos/Unity/Godot have GPU instancing — prior knowledge, not re-verified in this session.

### Gaps
- Not verified this session: PlayCanvas navmesh (believed none built in), PlayCanvas animation retargeting, Unity Humanoid retargeting details, three.js post-processing (`EffectComposer`/TSL `PostProcessing`) API state in r186, instancing APIs per engine.
- Whether Babylon 9 added any animation state-machine graph was not confirmed; evidence found says no.

---

## Q5. Tooling, scene format, TypeScript, AI-coding-agent fit, docs, community momentum

### Takeaway
For a tiny team where Claude Code writes most code, **code-first, text-only, huge-corpus engines win**: three.js is dominant (≈12.2 M weekly npm downloads, ~116K stars — ~39x Babylon and ~215x PlayCanvas) and needs no editor; Babylon is code-first, TypeScript-native, with a Playground and visual node editors whose outputs are JSON/serialized snippets. PlayCanvas is the only editor-first engine with an official MCP server for AI agents. Unity/Cocos/Godot are editor-first; Godot's scenes are text but web export is its weak side.

### Cited Findings
- npm weekly downloads (15–21 Sep 2026): three 12,184,549; @babylonjs/core 314,621; playcanvas 56,681. GitHub stars (Sep 2026): three.js ~116K, Babylon ~26K, PlayCanvas ~17K. — [utsubo comparison (updated 24 Sep 2026)](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison); [utsubo: three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed)
- cocos-engine repo: ~9.8K stars, 867 open issues; the **editor (Cocos Creator) is not open source**, only the runtime; user API in TypeScript. — [cocos/cocos-engine GitHub](https://github.com/cocos/cocos-engine)
- Editors: three.js code-first (no built-in editor); Babylon "Playground"; PlayCanvas "full cloud IDE" with real-time collaboration. — [utsubo comparison](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)
- Babylon 9.0 ships an all-new Inspector and node editors ("visual, code-free development workflows"). — [Babylon 9.0 announcement](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/)
- three.js r181+ ships a WebGPURenderer Inspector (performance, memory, timeline). — [utsubo: three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed)
- PlayCanvas Editor **MCP Server** (official, `@playcanvas/editor-mcp-server`): connects AI assistants (Claude Code, Codex, Cursor…) to a live Editor session; 30+ tools for entities, assets, scene settings, viewport, runtime (launch, capture, read logs, inject input); requires Node 22.18+. — [PlayCanvas docs: MCP Server](https://developer.playcanvas.com/user-manual/editor/mcp-server/); [GitHub playcanvas/editor-mcp-server](https://github.com/playcanvas/editor-mcp-server)
- PlayCanvas also offers code-only paths: **PlayCanvas React** component library and **Web Components** (`<pc-app>`, `<pc-entity>`, `<pc-camera>`; v0.26.0). — [playcanvas.com](https://playcanvas.com/); [playcanvas/web-components v0.26.0](https://github.com/playcanvas/web-components/releases/tag/v0.26.0)
- Release cadence: three.js monthly-ish (r173→r180 Jan–Sep 2025), latest r186 (Sep 2026); wiki already documents r187 changes. — [utsubo: three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed); [three.js releases](https://github.com/mrdoob/three.js/releases); [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide). **Date conflict:** utsubo says three@0.186.0 published 8 Sep 2026; GitHub releases page rendered r186 as 24 Sep — exact day uncertain.
- Babylon releases continuously after 9.0 (e.g., 9.26.0 on GitHub). — [newreleases: Babylon 9.26.0](https://newreleases.io/project/github/BabylonJS/Babylon.js/release/9.26.0); [Babylon forum: Welcome to 9.0](https://forum.babylonjs.com/t/welcome-to-babylon-js-9-0/62940)
- Godot 4 web: C# not exportable to web (GDScript/C++ only). — [Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
- A third-party "Godot MCP Pro" guide exists (community AI tooling for Godot). — [godot-mcp.abyo.net](https://godot-mcp.abyo.net/guides/godot4-animationtree)

### Inferences
- AI-agent fit ranking (code-first, text artifacts, corpus size): three.js > Babylon > PlayCanvas (engine-only/React/web components) > Godot (text `.tscn` but GDScript + editor-centric workflow) > Cocos (editor-first, closed editor, much documentation/community in Chinese) > Unity (editor-first, heavy binary assets/meta files; C# builds need the Unity Editor to produce web output).
- three.js's enormous corpus means an AI agent writes three.js code with fewer hallucinations, but the corpus is also full of *outdated* r1xx-era code (UMD globals, `outputEncoding`) — the agent must be pinned to current APIs (e.g., put the migration rules in CLAUDE.md).
- PlayCanvas's MCP server is a genuine differentiator if the team wants a visual editor *and* AI automation, but it binds work to a cloud SaaS editor (see Q6).
- Wrappers: React Three Fiber / Threlte add declarative component models over three.js; they help UI-heavy apps but add a framework layer to a game loop — not researched in depth here.

### Gaps
- Scene-file formats (Unity YAML/"Force Text", Cocos `.scene` JSON, Godot `.tscn`, Babylon `.babylon` JSON, PlayCanvas cloud JSON) are from prior knowledge, not verified this session.
- No quantitative study of AI-agent success rates per engine was found.

---

## Q6. Licensing and cost for commercial use

### Takeaway
three.js (MIT), Babylon.js (Apache-2.0, prior knowledge), PlayCanvas engine (MIT) and Cocos engine (MIT runtime; free editor for game development) cost nothing. PlayCanvas's *Editor* is SaaS ($15/mo personal, $50/seat/mo org for private projects). Unity's Runtime Fee is gone; Personal is free under $200K revenue+funding, Pro $2,200/seat/yr above that. Needle Engine requires a paid Pro license (€49/user/month) for commercial projects.

### Cited Findings
- **Unity:** Runtime Fee cancelled 12 Sep 2024, effective immediately, not applying to Unity 6 or any version; Unity Personal free with ceiling raised from $100K to $200K (effective with Unity 6 release, 17 Oct 2024); Unity Pro +8% to $2,200/seat/year, required above $200K revenue+funding; Enterprise required above $25M; effective 1 Jan 2025. — [Unity blog: Unity is canceling the Runtime Fee](https://unity.com/blog/unity-is-canceling-the-runtime-fee); [Unity pricing updates](https://unity.com/products/pricing-updates); [Unity terms update](https://unity.com/blog/terms-update-runtime-fee-cancellation); [CG Channel](https://www.cgchannel.com/2024/09/unity-scraps-controversial-runtime-fee-but-raises-prices/)
- **PlayCanvas Editor plans:** Free $0 (1 GB, public projects only); Personal $15/month (10 GB, unlimited private projects); Organization $50 per seat/month (50 GB, team management); Enterprise custom. All plans can download apps for self-hosting; private projects become inaccessible if subscription lapses unless made public; educational discounts "may be available upon request". Engine is "free and open source". — [PlayCanvas plans](https://playcanvas.com/plans)
- **PlayCanvas engine:** MIT. — [playcanvas/engine](https://github.com/playcanvas/engine)
- **Cocos:** Cocos Creator is free for developing games; runtime engine repo is MIT; editor closed-source. — [Cocos Software License & Services Agreement](https://download.cocos.com/CocosUdc/agreement/Cocos_User_Service_Agreement_en_20220901.html); [cocos/cocos-engine](https://github.com/cocos/cocos-engine)
- **Needle Engine:** Hobby (free, personal), Pro (commercial, from €49/user/month), Enterprise; standalone web/CI builds need the license via Needle License Server. — [Needle pricing](https://needle.tools/pricing/); [Needle FAQ](https://engine.needle.tools/docs/reference/faq.html)
- **Godot:** web export and engine usable commercially (MIT, prior knowledge) — not re-verified this session.

### Inferences
- For a company whose game is a free educational add-on, Unity Personal is free only while total company revenue+funding < $200K; BK Academy's total revenue (not the game's) is what counts — likely requiring Unity Pro seats. This is an inference from the "total annual revenue and funding" wording; confirm with Unity terms.
- A code-first open-source JS engine has zero licensing risk and zero lock-in; PlayCanvas Editor and Needle introduce recurring SaaS costs and vendor dependence.

### Gaps
- Babylon.js (Apache-2.0) and Godot (MIT) licenses were not re-fetched this session.
- Whether the Unity revenue threshold applies to the whole education company vs. a game subsidiary was not researched.

---

## Q7. Migration cost from the existing three.js r128 prototype

### Takeaway
Staying on three.js is a *mechanical* upgrade (ES modules/bundler, color-space renames, light-intensity units, WebGL2-only) — days, not weeks — and procedurally built geometry largely survives. Moving to any other engine is a *rewrite* of rendering/scene code (logic concepts transfer, code doesn't), though the planned switch to rigged GLB creatures would force re-doing the animal models regardless.

### Cited Findings
- r148 (listed under r147→r148): `examples/js` removed — addons (GLTFLoader, OrbitControls…) only as ES modules. — [three.js Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)
- r160: `build/three.js` and `build/three.min.js` removed — ES modules (import maps or a bundler) required. — [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)
- r152: `renderer.outputEncoding` → `outputColorSpace` (default `SRGBColorSpace`); `texture.encoding` → `texture.colorSpace`; `sRGBEncoding` → `SRGBColorSpace`; `ColorManagement.enabled = true` by default; shader chunk `encodings_fragment` → `colorspace_fragment`. — [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide); [PR #25756](https://github.com/mrdoob/three.js/pull/25756); [three.js forum: Color management in r152](https://discourse.threejs.org/t/updates-to-color-management-in-three-js-r152/50791)
- r155: `useLegacyLights` deprecated and defaulted to `false` (physically-correct light units) — existing light intensities will look different; tone mapping inline only to screen, post-processing needs `OutputPass`. — [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide)
- r157: bump-map scaling changed. r163: WebGL1 removed; stencil buffer off by default. r175: `CapsuleGeometry` `length` → `height`. r180: PBR energy conservation changed — rough materials appear brighter. r183: `Clock` deprecated. r186: `PCFSoftShadowMap` removed; minified builds removed, CommonJS deprecated; `Source` → `TextureSource`. — [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide); [utsubo: three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed); [three.js releases](https://github.com/mrdoob/three.js/releases)
- Moving to `WebGPURenderer` additionally means custom `ShaderMaterial`/`onBeforeCompile` shaders must be rewritten in TSL (node materials); a dedicated checklist exists. — [utsubo: Migrate three.js to WebGPU (2026)](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)

### Inferences
- r128 → r186 on `WebGLRenderer`: replace `<script>` globals with ES module imports (Vite), apply the color-space renames, re-tune light intensities (likely ×π-ish for physically-correct units), switch `PCFSoftShadowMap` → `PCFShadowMap`/`VSMShadowMap`, check `CapsuleGeometry`. For an AI agent, this is a well-scoped grep-and-fix job.
- Hand-written per-animal pose functions do not port to any engine's animation system as-is; the durable fix (shared skeleton + GLB clips + AnimationMixer crossfades + FSM) is required on three.js too, so "migration cost to Babylon/PlayCanvas" is lower than it first appears — the animal/animation layer is being rebuilt either way. What is lost by switching is the renderer glue, UI integration and the team's/agent's accumulated three.js know-how.

### Gaps
- Exact line count / scope of the current prototype was not examined (outside this research scope).

---

## Q8. Which 1–2 engines fit best, and why

### Takeaway
**Primary: three.js (latest, r186+) as a code-first stack**, using `WebGLRenderer` as the shipping path for iPad 7 (optionally `WebGPURenderer` with WebGL2 fallback after benchmarking), plus Rapier (physics), recast-navigation-js (navmesh), three.quarks or custom shaders (VFX), GLB rigged creatures on shared skeletons + AnimationMixer + a small hand-written FSM. **Runner-up: Babylon.js 9**, if the team prefers more built-in game systems (Havok character controller, animation retargeting, Node Particle Editor, Recast navmesh, Inspector) and accepts a rewrite plus a heavier bundle. Unity Web and Godot 4 Web are not recommended for an iPad-7-floor browser game; Cocos is viable only if the team goes editor-first; PlayCanvas is a reasonable alternative mainly if a visual editor with MCP automation is wanted.

### Cited Findings (evidence summary, see sections above)
- iPad 7 = iPadOS 18 max, WebGPU only in Safari 26 → WebGL2 floor. — [iClarified](https://www.iclarified.com/97601/ipados-26-supported-devices-the-full-list-of-compatible-ipads); [WebKit Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- three.js: smallest runtime (~185 kB gz), largest ecosystem (12.2 M weekly downloads), WebGL2 fallback built into WebGPURenderer, active monthly releases. — [utsubo comparison](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison); [utsubo: three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed)
- Babylon 9: retargeting, Node Particle Editor, Frame Graph (−40% GPU memory in some cases), WebGL2+WebGPU; Havok character controller since 8.0. — [Babylon 9.0](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/); [Babylon 8.0](https://babylonjs.medium.com/introducing-babylon-js-8-0-77644b31e2f9)
- Unity Web iOS heap-growth crashes; Godot web WebGL2-compat-only with iOS reload/audio issues and 5–9 MB compressed WASM. — [Unity Discussions](https://discussions.unity.com/t/webgl-memory-increment-issue-and-crash-on-ios/894771); [Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html); [godot#107390](https://github.com/godotengine/godot/issues/107390); [jion.in](https://jion.in/devlog/godot-web-minification)
- utsubo's own recommendation for browser *games* is "Babylon.js or PlayCanvas" (integrated physics/audio) — i.e., a pro-batteries view that counterbalances the three.js recommendation. — [utsubo comparison](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)

### Inferences
- Why three.js first: (1) continuity — the prototype and the team's/agent's knowledge are three.js; upgrade is mechanical (Q7); (2) best AI-agent fit (largest corpus, pure code, no editor state); (3) lightest on the A10/3 GB floor and on first load; (4) no license/SaaS lock-in; (5) MMO networking is engine-agnostic (WebSocket/WebTransport server), so no engine gives a decisive MMO advantage — Needle's built-in multiplayer is three.js-based if a turnkey layer is wanted later (paid for commercial use). Main cost: the team must assemble and own the "game engine" layer (FSM, VFX, physics/navmesh glue, asset pipeline) — which an AI agent can write, but must be kept disciplined via docs/conventions.
- Why Babylon as the alternative: it is also code-first TypeScript with good docs, and it removes several "assemble it yourself" items (retargeting, particle editor, character controller, navmesh plugin, inspector). Costs: full rewrite, ~5–10x larger engine download than three.js (mitigated by tree-shaking), reported higher Safari memory footprint — must be validated on an actual iPad 7 before committing.
- Decision test before committing (either engine): build one scene — field + 30 instanced trees/grass patches + player + 1 companion + 5 wild creatures (rigged GLB, crossfaded clips) + capture-ball VFX — and measure FPS, memory and load time on iPad 7 (Safari 18), a mid-range Android, and a school PC. This is cheap and replaces opinion with data.

### Gaps
- No head-to-head iPad 7 benchmark exists in the sources; the recommendation relies on structural reasoning (runtime size, heap model, documented iOS issues) plus ecosystem data.
- MMO networking stacks (Colyseus, Nakama, custom WebSocket, WebTransport support in Safari 18) were out of scope and not researched here.
- Cocos Creator 4.0 status (docs exist, release/stability unclear) not verified; latest engine tag seen on GitHub was v3.8.9.
