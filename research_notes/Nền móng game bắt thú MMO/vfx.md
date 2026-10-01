# Juicy skill/attack VFX and a polished "throw ball → capture creature" sequence in a browser 3D game (state as of 30 Sep 2026)

Scope: browser/PWA creature-catching game (Palworld/Pokémon-like) for Vietnamese students in grades 6–12. The weakest target is iPad 7th gen (A10, 3 GB RAM, WebGL2). The engine is not chosen yet. The team is tiny and an AI agent writes most of the code.
Research date: 2026-09-30. Where a source gives only a day and month, the year is inferred from context and marked as inferred.

---

## Q1. Particle/VFX libraries, editors and shader-based VFX approaches for the web

### Takeaway
The three.js ecosystem has two maintained, MIT-licensed particle libraries:
- **three.quarks** is the mature, editor-backed option. It supports trails, sub-emitters, batch rendering and Unity Shuriken import. It needs three ≥ r182 and targets the classic WebGLRenderer. WebGPU is still on its roadmap.
- **three-nebula** was revived in Aug–Sep 2026 with a TypeScript rewrite, a TSL/WebGPU batched renderer, ribbons and nested emitters. It releases very fast but is not proven yet.

Babylon.js ships the most integrated first-party tools: a Node Particle Editor since v8.14, the Node Material Editor, a GPUParticleSystem on WebGL2, and in 9.0 flow maps and attractors. NPE graphs are CPU-only, though. PlayCanvas and Cocos Creator have editor-driven built-in particles, and both have gaps around trails and sub-emitters.

### Cited Findings

**three.quarks (three.js)**
- It describes itself as "A General-Purpose Particle System for three.js". The latest npm version is **0.17.1**, with peerDependency **three >=0.182.0** and a dependency on `quarks.core`. — [npm registry: three.quarks/latest](https://registry.npmjs.org/three.quarks/latest)
- Recent commits:
  - 21 May 2026: "fix examples bugs, bump version" and "update publish script".
  - 19 May 2026: "ESM/NodeNext-compatible built .d.ts (#108)".
  - Feb 2026: "Upgrade Three.js from 0.165.0 to 0.182.0 (#106)", "Add quarks.r3f package - React Three Fiber integration", "Move examples to quarks.examples package and add WebGPU shader".
  - The GitHub Releases page is empty; versions ship to npm only.
  - Sources: [GitHub commits](https://github.com/Alchemist0823/three.quarks/commits/master); [GitHub releases](https://github.com/Alchemist0823/three.quarks/releases)
- Features:
  - Render modes: Billboard, Stretched Billboard, Mesh, Trail.
  - Emitter shapes: Point, Sphere, Hemisphere, Cone, Circle, Mesh Surface, Grid.
  - Behaviors: color/size/rotation over lifetime, force fields, orbital motion, texture (flipbook) animation, sub-emitters, custom behaviors.
  - Batched rendering "minimizes draw calls".
  - Unity Shuriken compatibility/import.
  - MIT license, ~1.0k stars.
  - Source: [three.quarks README](https://raw.githubusercontent.com/Alchemist0823/three.quarks/master/README.md); [GitHub repo](https://github.com/Alchemist0823/three.quarks)
- Packages: `three.quarks` (main), `quarks.core` (framework-agnostic math, behaviors, shapes), `quarks.r3f` (React Three Fiber), `quarks.nodes` ("Experimental node-based VFX with visual programming"), `quarks.examples`, `quarks.playground`. — [README](https://raw.githubusercontent.com/Alchemist0823/three.quarks/master/README.md)
- The roadmap marks the main library, the visual editor and R3F integration as done. Still planned: "WebGPU rendering support", WebAssembly simulation, node-based scriptable systems and native plugins. — [README](https://raw.githubusercontent.com/Alchemist0823/three.quarks/master/README.md)
- The visual editor, "three.quarks-editor", is WYSIWYG with real-time preview and JSON export, at quarks.art/create. The runtime loads the JSON. — [README](https://raw.githubusercontent.com/Alchemist0823/three.quarks/master/README.md); [GitHub repo](https://github.com/Alchemist0823/three.quarks)

**three-nebula (three.js)**
- It is a "WebGL based 3D particle engine that has been designed to work alongside three.js". MIT license, ~1.2k stars, not archived. It builds systems from JSON objects, supports sprites and 3D meshes, and offers optional WebGPU rendering via a batched `GPURenderer` at the `three-nebula/webgpu` entry point. It is "built and tested against three@0.185.1". — [GitHub repo](https://github.com/creativelifeform/three-nebula)
- Release history (the page shows no year; 2026 is inferred from the three r185 target and the npm latest tag of 13.3.0):
  - v12.0.0 (3 Aug): full TypeScript rewrite; removed the vendored three r106 math snapshot.
  - v12.1.0 (9 Aug): WebGPU support, "A node/TSL batched particle renderer...in a single draw call".
  - v13.0.0 (22 Aug): deterministic seeded simulation, `System.tick()`.
  - v13.1.0 (11 Sep): nested child emitters, `RibbonRenderer` for camera-facing strips (trails).
  - v13.2.0 (12 Sep): ribbon soft edges and tangent smoothing.
  - v13.3.0 (19 Sep): Vortex and CurlNoise behaviors; Ring, Disc, Cylinder and Cone zones.
  - Source: [GitHub releases](https://github.com/creativelifeform/three-nebula/releases)
- npm latest is 13.3.0. Older 9.x versions on npm declared `three: ^0.122.0`, which confirms the long dormant period before the 2026 revival. — [npm registry: three-nebula](https://registry.npmjs.org/three-nebula)
- The README does not mention a visual editor. — [GitHub repo](https://github.com/creativelifeform/three-nebula)

**three.js core: TSL / WebGPURenderer (relevant to custom VFX shaders)**
- Current release is **r186** (three@0.186.0), published 8 Sep 2026. — [Utsubo, "What's New in Three.js (2026)", updated 24 Sep 2026](https://www.utsubo.com/blog/threejs-2026-what-changed)
- Per the same article:
  - `WebGPURenderer` falls back to WebGL 2 where WebGPU isn't available.
  - r184 added "TSL and node materials on `WebGLRenderer` through a compatibility layer".
  - r183 renamed `PostProcessing` to `RenderPipeline`.
  - Note: the article expands TSL as "Texture Shading Language", but the name is Three.js Shading Language, so treat its details with some caution.
  - Source: [Utsubo](https://www.utsubo.com/blog/threejs-2026-what-changed)
- `ShaderMaterial`, `RawShaderMaterial` and `onBeforeCompile()` modifications are **not supported in `WebGPURenderer`**. They must be ported to node materials/TSL. One TSL graph compiles to WGSL on WebGPU and to GLSL on the WebGL2 fallback. The renderer logs "WebGPU is not available, running under WebGL2 backend". — [three.js manual: WebGPURenderer](https://threejs.org/manual/en/webgpurenderer.html); [three.js forum: TSL and webgl2 vs webgpu](https://discourse.threejs.org/t/tsl-and-webgl2-vs-webgpu/87974)
- Compute on the WebGL2 backend (sources conflict):
  - One secondary source says three.js emulates compute with transform feedback there, and that the official compute-particles example runs 200,000 particles that way. — [Utsubo migration guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide) / [threejsresources](https://threejsresources.com/webgpu/vs-webgl)
  - The same result set also says "compute work is the part that has no fallback, so treat it as an enhancement". **Conflicting claims; verify on-device.**

**Babylon.js**
- Babylon.js 9.0 was announced on 26 Mar 2026. Particle-related features:
  - The Node Particle Editor (NPE): "complete control… from emission shapes and sprite sheets to update behaviors and sub-emitters".
  - **Flow Maps** ("screen-aligned texture that controls the direction and intensity of forces", working with **both CPU and GPU** particle systems).
  - **Attractors**.
  - Frame Graph promoted to v1, with reported GPU memory savings of "40% or more in some cases".
  - Source: [Windows Developer Blog: Announcing Babylon.js 9.0](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/)
- NPE has been available since **v8.14**. It produces a `ParticleSystemSet`, which loads with `NodeParticleSystemSet.ParseFromSnippetAsync()` + `buildAsync()`. The graph has Create Particle/Emitter Shape blocks, update blocks, a System block, and Random/Gradient/Trigger blocks. **"NPE only generates CPU-based particle systems."** — [Babylon docs source: node_particle_editor.md](https://raw.githubusercontent.com/BabylonJS/Documentation/master/content/features/featuresDeepDive/particles/particle_system/node_particle_editor.md); [NPE tool](https://npe.babylonjs.com/); [forum announcement](https://forum.babylonjs.com/t/new-feature-the-node-particle-editor-npe/59303)
- In June 2025 the NPE roadmap listed a legacy→NPE converter, inspector/playground integration and attractors, tracked under milestone 9.0. — [GitHub issue #16740](https://github.com/BabylonJS/Babylon.js/issues/16740)
- `GPUParticleSystem`:
  - Requires **WebGL2**; check with `GPUParticleSystem.IsSupported`, otherwise fall back to the CPU `ParticleSystem` at reduced capacity.
  - Supports custom effects (since v5.0) and shares its API with the CPU system.
  - **Unsupported:** sub-emitters, ManualEmitCount, emit-rate gradients, start-size gradients, mesh emitters, dual gradient values, disposeOnStop.
  - Source: [Babylon docs source: gpu_particles.md](https://raw.githubusercontent.com/BabylonJS/Documentation/master/content/features/featuresDeepDive/particles/particle_system/gpu_particles.md)

**PlayCanvas**
- The engine API reference is at v2.21.4. — [PlayCanvas ParticleSystemComponent API](https://api.playcanvas.com/engine/classes/ParticleSystemComponent.html)
- Particle component features (editor-exposed):
  - Blend Type: Alpha, Additive or Multiply.
  - Depth Softening (soft particles).
  - Sort, including "None (GPU simulated, best performance)".
  - Velocity Stretch, sprite-sheet tiles and animation, Local Space.
  - Orientation: Screen, World Normal, Emitter Normal.
  - Mesh particles.
  - Curves for velocity, rotation, scale, color and opacity.
  - **No trails or sub-emitters are documented.**
  - Source: [PlayCanvas Particle System component](https://developer.playcanvas.com/user-manual/editor/scenes/components/particlesystem/)
- Particles "are not physically simulated", and soft particles need a camera with a depth map enabled. — [PlayCanvas Particles manual](https://developer.playcanvas.com/user-manual/graphics/particles/)

**Cocos Creator**
- In Cocos Creator 3.8, "the current GPU version does not support TrailModule and LimitVelocityOvertimeModule". Trails therefore require the CPU renderer. — [Cocos Creator 3.8 manual: Renderer](https://docs.cocos.com/creator/3.8/manual/en/particle-system/renderer.html); [Trail Module](https://docs.cocos.com/creator/3.8/manual/en/particle-system/trail-module.html)
- WebGPU has been a build option for **Web-Desktop** since 3.6.2. — [Cocos blog: Building New 3D Web Games With Cocos Creator and WebGPU](https://www.cocos.com/en/post/ODdxxWGryD6DiM6wPJ3yhPklSzCLCCxE)
- A search summary states the latest version is 3.8.6, "released December 2025". This is **unverified** and came from an aggregator summary, not a release page. — [Cocos download page](https://www.cocos.com/en/creator-download)

**Shader-based VFX craft (engine-agnostic)**
- Stylized VFX commonly uses:
  - hand-painted textures with dissolve maps and normal maps driving the effect in-engine;
  - flipbook textures, including hand-drawn stylized lightning flipbooks.
  - Source: [VFX Apprentice: Booms & Blasts](https://www.vfxapprentice.com/courses/booms-and-blasts); [VFX Apprentice: What are flipbooks](https://www.vfxapprentice.com/blog/what-are-flipbooks-in-games)
- step/smoothstep-based dissolve is a core stylized-VFX building block. — [torchinsky: Stylized VFX in Unity Part 1: Step, Smoothstep, Dissolve](https://torchinsky.me/stylized-vfx-unity-01/)
- Fresnel gives edge glow based on view angle (rim light, hologram and energy-shell looks). Procedural noise (Voronoi, gradient noise) produces patterns without textures. — [generalistprogrammer: Unity URP Shader Graph effects](https://generalistprogrammer.com/tutorials/unity-urp-shader-graph-effects-complete-vfx-tutorial) (search snippet)
- Community breakdowns of magic circles and stylized flipbooks: [realtimevfx: Magic Array breakdown](https://realtimevfx.com/t/realtime-vfx-tutorial-magic-array-vfx-breakdown/26533); [realtimevfx: Stylized flipbooks with After Effects + Unity](https://realtimevfx.com/t/stylized-flipbooks-vfx-using-after-effects-unity/27915)

### Inferences
- **three.quarks is the lowest-risk three.js choice for an AI-agent team.** It has a WYSIWYG editor that emits JSON, trails, sub-emitters, batching and multi-year history. Its catch is that its renderer is built on classic three.js materials. If the game adopts `WebGPURenderer` (TSL-only), three.quarks may not render until its WebGPU work lands, because ShaderMaterial is unsupported there. On iPad 7 you will run WebGL2 anyway (see Q4), so pairing **WebGLRenderer + three.quarks** is coherent.
- **three-nebula v13 is technically attractive:** TSL batched single-draw-call renderer, ribbons, nested emitters, determinism. However, it had 7 releases (two majors) in about 7 weeks after years of dormancy. Expect API churn. Evaluate it, but don't bet the capture sequence on it yet.
- **Babylon's split matters:** NPE authoring is CPU-only, while `GPUParticleSystem` lacks sub-emitters. For iPad 7 this is fine, because VFX for a creature battle rarely needs more than a few thousand particles, and CPU systems with sub-emitters are adequate at those counts.
- Most signature effects in this game are not really "particle system" problems. The capture beam, the creature-turns-to-light dissolve, lightning bolts, ground spikes and cone breath are better as **custom-shader meshes**: UV-scrolled noise, dissolve thresholds, fresnel rims, flipbooks on quads or cones, and ribbon/trail meshes. Particles provide the secondary sparks, debris and smoke. Budget engineering time for a small internal "VFX shader kit" (dissolve + scroll + fresnel + flipbook + ribbon), whatever the engine.

### Gaps
- No exact publish date was found for every three.quarks version. 0.17.1 aligns with the 21 May 2026 "bump version" commit; the registry timestamp suggests about 20–21 May 2026.
- Whether the quarks.art editor is still online and in sync with 0.17.1 was not verified.
- No direct confirmation was found that three.quarks renders correctly under the r184 "TSL on WebGLRenderer" compatibility layer or under `WebGPURenderer`.
- Babylon's `TrailMesh` and PlayCanvas trail alternatives were not researched in this pass.
- Cocos Creator's current version and release date are uncertain (see above).
- No iPad-7-specific benchmark of any of these libraries was found.

---

## Q2. Free/CC0 VFX texture resources and stylized VFX asset packs usable on the web commercially

### Takeaway
The safest licensing starting point is **CC0**:
- the Kenney Particle Pack (80 textures at 512×512), plus Kenney's Smoke Particles, Light Masks and Splat packs;
- the Brackeys VFX Bundle (CC0; particle textures, flipbooks and spritesheets gathered from Kenney, Thomas Iché and CodeManu);
- itch.io's CC0-filtered VFX listings.

Unity Asset Store VFX packs can generally be used outside Unity under the standard EULA, unless they are marked "Restricted/Non-standard". The textures still have to be re-authored into web shaders.

### Cited Findings
- **Kenney Particle Pack:** 80 files, 512×512, "Creative Commons CC0", v1.0 released 2018. Related Kenney packs: Splat Pack, Foliage Sprites, Smoke Particles, Light Masks. — [Kenney: Particle Pack](https://kenney.nl/assets/particle-pack)
- An OpenGameArt "Particle Pack (80+ sprites)" includes particle sprites, light cookies and shaders, plus a Unity sample package with fire, smoke, magic, hearts, sparks and electricity. — [OpenGameArt: Particle Pack (80+ sprites)](https://opengameart.org/content/particle-pack-80-sprites)
- **Brackeys' VFX Bundle:**
  - Contents: particle textures, flipbooks and pre-drawn spritesheets "gathered from texture-work by Kenney, Picster, Thomas Iché and CodeManu".
  - License: CC0 (commercial use OK, no attribution required); pay-what-you-want.
  - Source: [Brackeys VFX Bundle on itch.io](https://brackeysgames.itch.io/brackeys-vfx-bundle) (via search summary)
- itch.io offers filterable listings of free VFX/particle assets and a CC0 filter. Examples seen: "30 stylized hit effects for Godot 4" (hand-drawn textures, dissolve and distortion shaders) and 6 free textures (dirt, smoke, mist, cracks) by Leipea. **Licenses vary per pack.** — [itch.io free VFX](https://itch.io/game-assets/free/tag-vfx); [itch.io CC0 assets](https://itch.io/game-assets/assets-cc0/free); [itch.io free particles](https://itch.io/game-assets/free/tag-particles)
- Vefects sells "Flipbook VFX" packs for Unity, URP and Unreal on itch.io. The license was not checked. — [Vefects Flipbook VFX (Unity)](https://vefects.itch.io/flipbook-vfx-unity); [Unreal version](https://vefects.itch.io/flipbook-vfx-unreal-engine)
- **JangaFX:**
  - It has released free VDB simulations under **CC0**, and states plans to release game-ready flipbooks (explosions, fire, smoke, water splashes) to the public domain.
  - **IlluGen** generates 2D/3D flipbooks, tiling noise, flowmaps and mesh trails procedurally. It costs $300 for the first year and $150/yr maintenance, with a 14-day free trial.
  - Sources: [Digital Production: IlluGen drops](https://digitalproduction.com/2025/07/28/illugen-drops-node-based-vfx-tool-from-jangafx-now-public-and-free-for-14-days/); [JangaFX IlluGen](https://jangafx.com/software/illugen); [JangaFX licenses](https://jangafx.com/legal/licenses-we-use)
- **Unity Asset Store Standard EULA:**
  - It licenses assets for use as "embedded components of electronic games and digital media". It does not require Unity, so use in other engines is generally permitted.
  - Assets marked **"Restricted"/"Non-standard"** carry their own limits.
  - The Unity FAQ is "AS IS" and not legal advice.
  - Sources: [GameFromScratch: Using Asset Store assets in other engines](https://gamefromscratch.com/using-asset-store-assets-in-other-engines-is-it-legal/); [Unity Asset Store EULA FAQ](https://assetstore.unity.com/browse/eula-faq); [Unity Asset Store Terms](https://unity.com/legal/as-terms)

### Inferences
- **Recommended texture kit** for the six elements, mostly from Kenney and Brackeys CC0:
  - a soft round glow, a spark/star, a ring/shockwave, a smoke puff flipbook, a flame flipbook, a lightning strip, a splash/droplet, a leaf, an ice shard;
  - one or two tiling noise textures (Perlin/Voronoi) for UV-scroll and dissolve.
- **Pack them into 1–2 texture atlases** (see Q4) so one material or batch covers many effects.
- For a VN student audience, a **consistent stylized look beats realism**. Hand-drawn or anime-style flipbooks (the Brackeys and itch.io style) fit the "Anime RPG" skin direction better than photoreal smoke.

### Gaps
- No verified, currently maintained CC0 pack of *stylized elemental skill* flipbooks was found. The JangaFX flipbook release was announced as a plan, and its status as of Sept 2026 is unconfirmed.
- The Brackeys bundle license was confirmed only via a search summary. Re-check the itch page before shipping.
- No review was done of paid web-ready VFX packs (e.g., Hovl Studio, Gabriel Aguiar) or their licenses.

---

## Q3. Game-feel techniques, and how Palworld/Pokémon stage their capture sequences

### Takeaway
The canonical juice toolkit:
- particles, squash/stretch, tweening and sound ("Juice it or lose it", 2012);
- hit-stop ("sleep"), camera kick, knockback and screen shake ("The Art of Screenshake", 2013);
- trauma-driven noise shake (Eiserloh, GDC 2016).

Typical hit-stop runs about 35–120 ms, scaled by hit weight. Pokémon's capture grammar is fixed and well documented: up to 4 shake checks, shown as 0–3 wobbles followed by a "click". A critical capture shakes once, mid-air. Palworld runs 3 sphere shake checks whose exponents multiply back to the true catch probability.

### Cited Findings

**Canonical talks**
- **"Juice it or lose it":** Martin Jonasson & Petri Purho, Nordic Game Jam, May 2012. It takes a grey Breakout clone and adds effects live, with particles as the signature technique. A browser build exists with a slider per effect. — [Roblog summary](https://roblog.co.uk/2024/03/juicy-games/); [GDC Vault](https://www.gdcvault.com/play/1016487/juice-it-or-lose); [YouTube](https://www.youtube.com/watch?v=Fy0aCDmgnxg)
- **"The Art of Screenshake":** Jan Willem Nijman, Vlambeer, 2013. About 30 tricks, including muzzle flash, faster bullets, impact effects, hit animation, enemy knockback, camera lerp and position, screen shake, player knockback, **"sleep"** (a brief freeze on hit), gun kickback, **camera kick**, explosions and death animation. — [Mary Rose Cook's notes](http://notebook.maryrosecook.com/Theartofscreenshake,JanWillemNijman.html); [YouTube](https://www.youtube.com/watch?v=SkgkIXZ_13Y)
- **Eiserloh, "Math for Game Programmers: Juicing Your Cameras With Math" (GDC 2016):** shake is driven by a **"trauma"** value in [0,1] that decays over time; displacement comes from a noise function (Perlin), so the shake is smooth and continuous. — [GDC slides PDF](http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Eiserloh_Squirrel_JuicingYourCameras.pdf); [Bevy screen-shake example citing it](https://bevy.org/examples/camera/2d-screen-shake/); [Roystan: camera shake](https://roystan.net/articles/camera-shake/)
  - The PDF could not be fetched (TLS error). The usual "shake = trauma² or trauma³" detail is **not verified here**.

**Hit-stop numbers**
- Hit-stop freezes simulation for "a few dozen milliseconds" while rendering continues. Suggested tiers: **35 ms light, 70 ms heavy, 90 ms perfect**, capped around **120 ms**. Beyond that, it "starts reading as a dropped frame". — [Sword Arcade: Hit-stop and screen shake](https://swordarcade.xyz/guides/game-feel-hitstop-and-screen-shake/)
- Another source puts it at "3 to 12 frames (0.05 to 0.2 seconds)", scaling with attack strength. — [salivity: Maximizing game feel](https://salivity.github.io/game-development/article/maximizing-game-feel-in-action-game-development) (secondary)
- Fighting-game context: in Street Fighter 2, hit-stop extends the cancel window by about 10 frames. In Smash, characters vibrate during hit-stop. Games without it (e.g., Dark Souls 2) have "weakened impact". — [Critpoints: Hitstop](https://critpoints.net/2017/05/17/hitstophitfreezehitlaghitpausehitshit/)

**Web-specific game-feel recipe** ([valdemird, "Game feel on the web", 3 Jun 2026](https://valdemird.com/blog/game-feel-on-the-web/))
- Squash & stretch:
  - about **420 ms**, with `scaleX`/`scaleY` in opposition to conserve area;
  - easing `cubic-bezier(0.22,1,0.36,1)`, spring variant `cubic-bezier(0.34,1.56,0.64,1)`;
  - anchored at the bottom.
- Hit-stop: **60–90 ms**.
- Screen shake: 3 magnitudes, about 600 ms. Add "a few tenths of a degree of rotation"; pure translation "reads as a glitch".
- Particle bursts: 8–50+ particles, 0.55–0.95 s lifetime. Spread evenly, then add jitter.
- Escalation: bigger effects only at higher tiers, "preserves rarity".
- Everything respects `prefers-reduced-motion`.

**Telegraphs and damage numbers**
- A telegraph is a wind-up animation plus a visual cue plus an audio signal. It makes getting hit feel fair. Readability splits into telegraphing (before) and expectations (after). Don't make patterns more complex than players can chunk. — [Game Developer: Enemy Attacks and Telegraphing](https://www.gamedeveloper.com/design/enemy-attacks-and-telegraphing); [Game Developer: Readability in ARPGs](https://www.gamedeveloper.com/game-platforms/designing-for-difficulty-readability-in-arpgs); [GDKeys: Anatomy of an Attack](https://gdkeys.com/keys-to-combat-design-1-anatomy-of-an-attack/)
- Damage numbers:
  - readability comes first, and normal hits should be visually quiet;
  - crits spawn at **150–200% size** with a scale-up pop;
  - float up and/or bounce;
  - heals look different (slower, calmer);
  - beware popup overload.
  - Sources: [GameJuice: Damage numbers](https://www.gamejuice.co.uk/articles/damage-numbers-satisfying-feedback); [Shweep: Damage numbers in RPGs](https://shweep.medium.com/damage-numbers-in-rpgs-1f0e3b1bc23a) (via search summary)

**Pokémon mainline capture (Gen IX: Scarlet/Violet)**
- Each shake check compares a random 0–65535 against Y = ⌊65536 / (255/X)^(3/16)⌋.
- Non-critical captures get **up to 4 checks**. Visible outcomes:
  - **0 wobbles** = broke out on the 1st check;
  - **1/2/3 wobbles** = broke out on the 2nd/3rd/4th check;
  - **passing all four** = caught.
- A **critical capture** has **1 check** and "the ball will shake in the air" before one wobble.
- In SV, every *successful* catch of an already-registered species **is animated like a critical capture**, to save time.
- Source: [The Cave of Dragonflies: Gen IX capture mechanics](https://www.dragonflycave.com/mechanics/gen-ix-capturing/); [PokéBase discussion](https://pokemondb.net/pokebase/419474/did-the-critical-capture-mechanics-change-scarlet-and-violet)

**Pokémon Legends: Arceus**
- Throwing at an unaware Pokémon from behind triggers a **back strike**. It plays a special "satisfying animation" and raises the catch rate for that throw. — [Nintendo: Legends Arceus catching guide](https://www.nintendo.com/us/whatsnew/pokemon-legends-arceus-hone-your-catching-techniques-with-this-guide/); [iMore](https://www.imore.com/pokemon-legends-arceus-how-catch-alpha-pokemon)

**Palworld** (see Q5 for the display-percentage conflict)
- One probability roll decides the catch.
- After landing, the sphere does **3 shake checks** with pass rates P^(4/9), P^(3/9) and P^(2/9). The exponents sum to 1, so the product equals P.
- The first shake auto-passes on a sneak attack, at HP < 50%, or when the rate is ≥ 50%.
- Source: [LootLab: Palworld capture formula (2026-08-16, datamined v1.0)](https://lootlab.app/palworld/guides/capture-formula/)
- Separately, the Palworld wiki says the sphere animations "are independently generated", success shows "both shakes", and on failure "the sphere bounces off the Pal or fails to absorb it". — [Palworld Wiki: Capture Power](https://palworld.wiki.gg/wiki/Capture_Power)
  - **Conflict:** LootLab says 3 shake checks; the wiki text implies 2 displayed shakes.

### Inferences — recommended capture "beat sheet" (design proposal, not sourced timings)
1. **Aim (hold).** Show a shrinking target ring on the creature (see Q5). Keep the ball in hand with a slight idle bob. The camera eases in a little.
2. **Throw.** Use an anticipation wind-up of about 150–200 ms. Launch along a visible parabola. The ball spins and leaves a short ribbon trail in the ball's color.
3. **Hit.**
   - Hit-stop of about 60–90 ms (valdemird / Sword Arcade range).
   - A white flash on the creature using the emissive/fresnel rim.
   - A small ring shockwave, a ball squash on contact, and a light camera punch-in.
   - On a back strike or weak point, add a bigger flash plus a distinct sound and text ("Đánh lén!").
4. **Open and absorb.**
   - The ball hinges open and a beam or cone of light reaches the creature.
   - The creature's shader goes to full emissive white, then dissolves or scales toward the ball along a curve with particle streamers (0.5–0.8 s).
   - The ball snaps shut with a squash.
5. **Drop and shake.**
   - The ball falls with 1–2 small bounces and settles, then does 1–3 wobbles.
   - Each wobble needs anticipation, a tilt, a settle and a *pause that grows longer* (tension).
   - Follow Pokémon's grammar: wobbles shown equal checks passed before a breakout, so outcomes are honest and legible.
   - Optionally, a "critical" fast path: a mid-air shake, then 1 wobble, reusing SV's time-saving idea for re-catches of known species.
6. **Resolve.**
   - **Success:** a "click" star burst, confetti, a sparkle ring, a brief slow-mo and a creature card.
   - **Fail:** the ball jitters, a crack of light, then the ball pops open with a squash/stretch pop. The creature bursts out, shakes itself, plays an angry emote, and gets a short immunity window. Show *how close* it was (e.g., "3/3 lắc — suýt nữa!").
- Screen shake should drive camera **rotation plus small offset through noise with decaying trauma** (Eiserloh), not random jitter. Reserve large shake for heavy attacks and crits ("preserve rarity").
- Every attack and skill should have **wind-up (telegraph) → release (hit-stop + flash + particles + damage number) → follow-through (debris, smoke, knockback)**. Ground AoE should show a decal or ring *before* impact, color-coded by element and filling over time.

### Gaps
- No frame-accurate public breakdown was found of Pokémon SV/Legends Arceus or Palworld capture *timings* (seconds per wobble, absorb duration). Timings above are proposals to tune by playtest.
- No 80.lv or GDC breakdown specifically about Palworld's or Pokémon's capture VFX was found in this pass.
- The Eiserloh slide specifics (trauma exponent, max angle and offset) are unverified because the PDF fetch failed.

---

## Q4. Mobile performance rules for VFX in WebGL2 (target: iPad 7th gen)

### Takeaway
iPad 7 tops out at **iPadOS 18**, and iPadOS 26 (which brought Safari WebGPU) requires A12+. Plan for **WebGL2-only** on the weakest device. Its 2160×1620 panel makes **fill-rate/overdraw the main VFX cost**. The rules:
- cap the render resolution;
- keep particles few and large;
- use premultiplied alpha, so additive and alpha effects share batches, and atlases;
- avoid real-time lights for VFX;
- treat full-screen bloom as expensive. ARM measured 3 ms/frame for bloom in a mobile game, versus under 1 ms for faked "texture/plane bloom". Use dual-filter or low-res bloom only if needed.

### Cited Findings
- iPad 7th gen: "2160-by-1620-pixel resolution at 264 ppi", A10 Fusion; battery tests dated August 2019. — [Apple: iPad (7th gen) tech specs](https://support.apple.com/kb/SP807)
- **iPadOS 26 requires A12 or newer.** The 7th-gen iPad (A10) is "the only iPad model that supports iPadOS 18, but not iPadOS 26". — [MacRumors](https://www.macrumors.com/2025/06/09/ipados-26-compatible-ipads/); [Cybernews](https://cybernews.com/gadgets/ipad-ios26-release/)
- WebGPU shipped in **Safari 26** (iOS/iPadOS/macOS/visionOS 26, Sept 2025). Apple mobile had previously been the last major platform without it. — [WebKit: Safari 26.0 features](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/); [web.dev: WebGPU supported in major browsers](https://web.dev/blog/webgpu-supported-major-browsers)
- WebGL 2.0 has been supported in Safari since **Safari 15 / iOS 15** (Sept 2021), for all iOS browsers because they share WebKit. Some early WebGL2 bugs were reported. — [Khronos WebGL wiki: Safari iOS](https://wikis.khronos.org/webgl/Implementations/SafariiOS); [Khronos blog](https://www.khronos.org/blog/webgl-2-achieves-pervasive-support-from-all-major-web-browsers); [Babylon forum: iOS 15 and WebGL2 issues](https://forum.babylonjs.com/t/ios-15-and-webgl-2-issues/23984)
- Overdraw:
  - particle systems create overdraw through stacked transparent layers, "where most fill rate problems come from, especially on mobile";
  - you can only reduce the number of layers, screen coverage and shader cost;
  - use alpha-test for opaque-ish debris or thick smoke;
  - use **bigger, fewer particles** for explosions and smoke.
  - Sources: [researchandprogram: Fill rate, overdraw, transparency (Jan 2026)](https://researchandprogram.blogspot.com/2026/01/fill-rate-overdraw-transparency-in-unity.html); [TheGamedev.Guru: Unity overdraw](https://thegamedev.guru/unity-gpu-performance/overdraw-optimization/); [Android Developers: Reduce overdraw](https://developer.android.com/topic/performance/rendering/overdraw)
- Search summaries claim "additive blending is much cheaper than alpha blending on mobile". **Treat this as weakly sourced.** Both are blended writes, and additive's firm advantage is that it is order-independent (no sorting). — [researchandprogram](https://researchandprogram.blogspot.com/2026/01/fill-rate-overdraw-transparency-in-unity.html) (via search summary)
- **Premultiplied alpha** lets additive and alpha-blended particles share one blend mode, enabling "an entire scene… with one draw call". — [dtrebilco/PreMulAlpha](https://github.com/dtrebilco/PreMulAlpha); [realtimecollisiondetection: optimizing particle rendering](https://realtimecollisiondetection.net/blog/?p=91)
- Expensive particles can be rendered **off-screen at a fraction of frame-buffer resolution** and composited, which gives large overdraw savings. — [NVIDIA GPU Gems 3, ch. 23: High-Speed, Off-Screen Particles](https://developer.nvidia.com/gpugems/gpugems3/part-iv-image-effects/chapter-23-high-speed-screen-particles)
- Bloom on mobile ([ARM: "Post-processing effects on mobile: optimization and alternatives", A. Provenzano, 17 Apr 2018](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives)):
  - standard bloom (downscale + horizontal and vertical blur + compose) cost **~3 ms/frame** in the Spellsouls case study;
  - "texture-based" bloom (baked into texture alpha) and "plane-based" bloom (camera-facing glow planes) cost **< 1 ms** and were accepted by artists;
  - moving from RGB24 to R8 buffers cut bandwidth.
- **Dual Filtering** blur (Marius Bjørge, ARM, SIGGRAPH 2015) gives a larger effective blur radius at far lower cost, reported as **14× faster at 1080p** than the Gaussian baseline. ARM's case study saw a "smoother bloom at the same cost" because it had already downscaled. — [Bjørge: Bandwidth-Efficient Rendering (slides)](https://community.arm.com/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_slides.pdf); [ARM post](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives)
- Soft particles cost a depth texture. PlayCanvas "Depth Softening" requires the camera's depth map to be enabled. — [PlayCanvas Particles](https://developer.playcanvas.com/user-manual/graphics/particles/)
- Draw calls: three.quarks and three-nebula (WebGPU) both advertise batching or single-draw-call renderers. In PlayCanvas, "Sort: None (GPU simulated, best performance)" is the fast path. — [three.quarks](https://github.com/Alchemist0823/three.quarks); [three-nebula releases](https://github.com/creativelifeform/three-nebula/releases); [PlayCanvas component](https://developer.playcanvas.com/user-manual/editor/scenes/components/particlesystem/)

### Inferences (proposed iPad-7 budget; to validate with on-device profiling)
- **Resolution:**
  - Render 3D at a capped pixel ratio, e.g. about 1.0–1.5 instead of the native 2 (2160×1620 is about 3.5 MP).
  - Optionally render VFX to a half-resolution buffer and composite (GPU Gems 3 technique).
  - This is the single biggest fill-rate lever.
- **Blend policy:**
  - Author all VFX textures premultiplied, and use one blend mode so batches merge.
  - Prefer additive or premultiplied for glow, since there is no sorting.
  - Use alpha-test/cutout for debris, leaves and ice chunks.
- **Particle counts:** think in *screen coverage*, not counts. A dozen large full-screen smoke quads can cost more than 500 tiny sparks. Keep large overlapping soft quads to a handful per effect.
- **Lights:**
  - Don't spawn dynamic point lights per projectile.
  - Fake lighting with emissive materials, fresnel rims, additive glow sprites or planes, and ground "light decals".
  - If you use bloom, make it a low-res dual-filter threshold bloom, and consider disabling it on the lowest tier in favor of baked glow sprites (ARM's < 1 ms alternatives).
- **Atlases:** pack flipbooks and element textures into a few atlases, which cuts material and texture switches and helps batching.
- **Soft particles:** enable only for ground-intersecting smoke or fog, and only on higher tiers; hard-edged stylized VFX avoids the depth-texture cost.
- **Quality tiers:** detect WebGPU or GPU tier at start. iPad 7 is always "WebGL2 low" and newer iPads are "high". Tiers scale DPR, bloom, soft particles and the particle-count multiplier.

### Gaps
- No iPad 7 (A10 GPU) WebGL2 fill-rate or particle benchmarks were found.
- No authoritative, current source quantifies the additive vs alpha blending cost on Apple TBDR GPUs.
- No measured cost was found for three.js or Babylon bloom specifically on A10-class iPads.
- The sources confirm only that iPadOS 26 required A12+. It was not verified whether Safari 18 on iPadOS 18 offers WebGPU behind a feature flag; it is assumed off for real users.

---

## Q5. Catch-rate UX (Palworld %, Pokémon GO ring) and accessibility for kids

### Takeaway
Pokémon GO's ring is the reference throw-timing mechanic:
- a shrinking inner circle whose color encodes difficulty (green → yellow → orange → red);
- a throw bonus of **2 − r**, where r is the ring's radius ratio, giving Nice/Great/Excellent;
- a separate **×1.7 curveball** bonus.

Palworld shows a numeric % on the reticle, but the community disagrees on how that number relates to the true probability. That is a warning sign for a kids' game: **show an honest number**. For accessibility, pair color with number, icon and text; offer screen-shake and flash-reduction toggles; and respect the "≤ 3 flashes per second" rule.

### Cited Findings

**Pokémon GO**
- Ring and bonus:
  - every wild Pokémon shows a static white circle and a moving inner circle;
  - throw bonus = **2 − r** (r = 1.0 at max size, ~0 at smallest), inside a catch formula with ball (1.0–2.0), berry (1.5–2.5), medal (1.1–1.3) and **curveball 1.7** multipliers.
  - Source: [Pokémon GO Hub: Catch mechanics](https://pokemongohub.net/post/wiki/catch-mechanics/); [GamePress: Throw bonuses](https://pogo.gamepress.gg/node/15216)
- Tier ranges: Nice 1.0–1.3, Great 1.3–1.7, Excellent 1.7–2.0, scaling with circle size. — [Dexerto: Pokémon Go catch mechanics](https://www.dexerto.com/pokemon/pokemon-go-catch-mechanics-multipliers-447946/)
  - **Conflict:** another guide claims "Nice=1.3×, Great=1.5×, Excellent=1.7×" are the maximum values. That is inconsistent with the 2 − r formula. — [Switchblade Gaming: throw guide](https://www.switchbladegaming.com/pokemon-go/throw-guide/)
- Ring colors: **green** (easy), **yellow**, **orange**, **red** (hardest). Players hold the ball while the ring shrinks and release at its smallest; a smaller ring at contact gives a bigger bonus. — [Twinfinite: What the colored rings mean](https://twinfinite.net/ps4/pokemon-go-colored-ring/); [Bustle](https://www.bustle.com/articles/172593-what-do-the-different-colored-circles-around-the-pokemon-mean)

**Palworld display** (sources conflict)
- The Palworld wiki says the reticle number "is not your catch chance". It shows *actual^1.25*, which is **lower** than the real chance: displayed 50% ≈ actual 57%. — [Palworld Wiki: Capture Power](https://palworld.wiki.gg/wiki/Capture_Power)
- LootLab (datamined v1.0, 16 Aug 2026) says the reticle shows **P^(5/12)**, which is **higher** than the real chance: reticle 70% ≈ actual 44%. — [LootLab](https://lootlab.app/palworld/guides/capture-formula/)
- **These directly contradict each other.** Both agree the displayed % ≠ the true probability.
- Other Palworld modifiers:
  - sphere tiers act as "levels" (Pal 7 … Ancient 64);
  - status multiplier 1 + 0.3×ailments + 0.35×sleep;
  - bosses ≈ 0.7×;
  - hitting a weak or critical point shows a visual capture-bonus indicator;
  - the Back Bonus shows an indicator but reportedly doesn't change the rate unless a specific Pal (Wispaw) is in the party.
  - Source: [LootLab](https://lootlab.app/palworld/guides/capture-formula/); [Palworld Wiki: Capture Power](https://palworld.wiki.gg/wiki/Capture_Power); [Palworld Wiki: Spheres](https://palworld.wiki.gg/wiki/Spheres)

**Accessibility**
- Game Accessibility Guidelines say to avoid:
  - flashing sequences longer than 5 s;
  - **more than three flashes in one second covering ≥ 25% of the screen**;
  - moving repeated patterns covering ≥ 25% of the screen.
  - Such flashing also affects autistic players, people prone to migraine and people with sensory processing issues.
  - Source: [Game Accessibility Guidelines: Avoid flickering images](https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/)
- Avoid camera shake, bobbing and motion blur, or **provide an option to turn them off**. Common settings are "Disable Screen Shake", "Reduce Motion" and "Photosensitivity Mode". — [Xbox Accessibility Guideline 117](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117); [XAG 118](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/118); [Maddy Miller: Motion sickness accessibility](https://madelinemiller.dev/blog/motion-sickness-accessibility/)
- On the web, respect `prefers-reduced-motion`. — [web.dev: Animation and motion](https://web.dev/learn/accessibility/motion); [valdemird](https://valdemird.com/blog/game-feel-on-the-web/)

### Inferences (design proposals)
- **Show an honest catch %** derived by a single server-side function; per the project's CLAUDE.md, all computation lives in Postgres `fn_*`. Palworld's opaque display breeds confusion and "the game lied" feelings. Kids should learn cause and effect ("lower HP → higher %").
- Mirror the true math in the animation. Use Pokémon's rule: wobbles shown = checks passed before breakout. Alternatively, split P into 3 checks like Palworld's 4/9 + 3/9 + 2/9 exponents, so the *product* is exactly the displayed %. Each wobble then becomes a real, suspenseful roll, and the result is still honest.
- **Ring UI:**
  - A shrinking ring over the target, color-coded (green/yellow/orange/red), **plus** a number and an icon or word ("Dễ/Khó"), so meaning never relies on color alone.
  - Timing bonuses produce text popups ("Tốt! / Tuyệt! / Xuất sắc!").
  - Keep the timing window generous for younger players. Consider an assist mode that slows the ring.
- **Flash safety:**
  - Cap full-screen white flashes to one per event, well under 3 per second.
  - Keep lightning strobe local (under 25% of the screen) or offer reduced-flash mode.
  - Provide "Rung màn hình: Bật/Tắt" and honor `prefers-reduced-motion` by default.
- For an educational context, catch-rate modifiers can tie to learning: e.g., answering a question correctly weakens or "calms" the creature. Keep that mapping visible so the % change is attributable.

### Gaps
- No official documentation from Pocketpair or The Pokémon Company on catch UI was found. All mechanics come from datamining or community wikis.
- The Palworld display conflict is unresolved.
- Bulbapedia's GO catch-rate page returned 403, so the ring's shrink-cycle period was not verified.
- No research specific to kids aged 11–18 on catch-rate display or near-miss effects was found. "Near-miss" framing is an established gambling-psychology concern; it wasn't researched here, and caution is warranted for a student product.

---

## Q6. Recommended approach per engine family (synthesis of Q1–Q5)

### Takeaway
All engine families can deliver the target look on iPad 7 via WebGL2. The differentiator is tooling for a tiny, AI-agent-driven team:
- **three.js:** WebGLRenderer + three.quarks (JSON effects from an editor) + a small custom GLSL/TSL "VFX shader kit".
- **Babylon.js 9.x:** NPE + Node Material Editor, with GPUParticleSystem where counts are high.
- **PlayCanvas:** built-in GPU particles + custom shader meshes for trails and beams.
- **Cocos Creator 3.8:** CPU particles wherever trails are needed.

### Cited Findings
- three.quarks: batch rendering, trail mode, sub-emitters, JSON editor, three ≥ r182; WebGPU still planned. — [README](https://raw.githubusercontent.com/Alchemist0823/three.quarks/master/README.md); [npm](https://registry.npmjs.org/three.quarks/latest)
- three.js `WebGPURenderer` does not support ShaderMaterial/onBeforeCompile (TSL required) and falls back to WebGL2. r184 added TSL on WebGLRenderer via a compatibility layer. — [three.js manual](https://threejs.org/manual/en/webgpurenderer.html); [Utsubo](https://www.utsubo.com/blog/threejs-2026-what-changed)
- three-nebula v12.1+ has a TSL/WebGPU single-draw-call renderer; v13.1 has ribbons and nested emitters. — [releases](https://github.com/creativelifeform/three-nebula/releases)
- Babylon: NPE (CPU-only), GPUParticleSystem (WebGL2; no sub-emitters), and 9.0 flow maps and attractors. — [NPE docs](https://raw.githubusercontent.com/BabylonJS/Documentation/master/content/features/featuresDeepDive/particles/particle_system/node_particle_editor.md); [GPU particles docs](https://raw.githubusercontent.com/BabylonJS/Documentation/master/content/features/featuresDeepDive/particles/particle_system/gpu_particles.md); [Babylon 9.0](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/)
- PlayCanvas: GPU-simulated particles with Alpha/Additive/Multiply blending, depth softening, sprite sheets and mesh particles; no documented trails or sub-emitters. — [PlayCanvas component docs](https://developer.playcanvas.com/user-manual/editor/scenes/components/particlesystem/)
- Cocos 3.8: the GPU particle renderer lacks TrailModule; WebGPU is Web-Desktop only. — [Cocos renderer docs](https://docs.cocos.com/creator/3.8/manual/en/particle-system/renderer.html); [Cocos WebGPU post](https://www.cocos.com/en/post/ODdxxWGryD6DiM6wPJ3yhPklSzCLCCxE)

### Inferences
- **three.js family** (most flexible; the best-known web 3D stack, which suits an AI coding agent):
  - Use `WebGLRenderer` (not `WebGPURenderer`) for now, so three.quarks and custom GLSL `ShaderMaterial`s work on iPad 7.
  - Author secondary particles (sparks, smoke, debris, sub-emitter bursts) in quarks.art and load the JSON.
  - Hand-write a few shader materials for the hero moments: capture beam, creature-to-light dissolve, fresnel energy shell, UV-scrolling fire/water cones, lightning strips, ground-spike meshes with a rise-and-dissolve.
  - Use a camera-shake module (trauma + noise), a time-scale hook for hit-stop, and pooled text sprites or instanced quads for damage numbers.
  - Revisit three-nebula's WebGPU renderer or quarks' WebGPU work in 2027, once iPad 7 is no longer the floor.
- **Babylon.js family** (the most "batteries-included" first-party tooling):
  - NPE for particle graphs (CPU, sub-emitters OK) and NME for dissolve, fresnel and scroll shaders, both with snippet/JSON loading.
  - `GPUParticleSystem` only for high-count ambient effects that need no sub-emitters.
  - Flow maps and attractors are useful for the "sucked into the ball" motion.
  - Good fit if the team prefers visual editors over code.
- **PlayCanvas family:**
  - The editor-driven particle component is fast (GPU-simulated, unsorted).
  - Build trails, beams and ribbons as custom meshes and shaders, and compose multi-stage effects from several emitters, since sub-emitters and trails are not documented.
  - The hosted editor suits a small team but ties you to its cloud workflow.
- **Cocos Creator family:**
  - The Unity-like particle modules are familiar, but trails force the CPU renderer.
  - Its strongest point is mini-game and mobile export, and web WebGPU is desktop-only.
  - Choose it only if the wider game architecture favors Cocos.
- **Cross-engine rules to hard-code into the project's style guide:**
  - quality tiers with iPad 7 as "low";
  - DPR cap;
  - premultiplied-alpha atlases;
  - no dynamic lights for VFX;
  - bloom off or low-res on low tier;
  - flash and shake toggles plus `prefers-reduced-motion`;
  - one honest capture-probability function in the DB, with wobble animations derived from its per-check results.

### Gaps
- No head-to-head benchmark of these engines' particle systems on A10-class iPads was found.
- The quality of AI coding agents per engine was not researched; the claim of better training-data coverage for three.js is an assumption.
