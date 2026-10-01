# Case studies: shipped browser-based 3D multiplayer games that run on mobile (as of Sept 2026)

Scope note: research done 30 Sep 2026 via web search and fetch. Many figures come from the developer or platform (self-reported) or from secondary aggregators; each is labelled. Where a fetch failed or only a search snippet was available, that is flagged.

---

## Q1. Which browser 3D multiplayer games have real player bases, and which work on mobile browsers / iOS Safari?

### Takeaway
There is a real, profitable category of browser 3D multiplayer games with tens of thousands of concurrent users (CCU) and hundreds of millions of lifetime players: Krunker, Shell Shockers, Bloxd.io, Venge.io, Smash Karts, Narrow.One, Hordes.io and HYTOPIA. Almost all use lightweight web-native JS engines (three.js, Babylon.js, PlayCanvas, OGL, noa), not Unity. Almost none is a creature-collector. The only live web creature-collector MMO I found is 2D (MonsterMMORPG). "Works on mobile Safari" is rarely documented explicitly. It is usually claimed only as "mobile browsers supported", so each title has to be spot-tested on an iPad 7.

### Cited Findings

**Krunker.io (FPS): three.js, solo founder, acquired**
- Built with three.js as the 3D WebGL engine and "able to run fairly well on even low-end machines". First shared by Sidney de Vries (Yendis Entertainment) in May/June 2018. The server was reportedly rewritten from scratch in JavaScript — [ioground (secondary)](https://ioground.com/blog/the-history-behind-krunker-io)
- Same source claims a server tick rate of about 10 updates/s and lobbies capped at about 6–8 players because of JS performance. This is a secondary, unverified claim — [ioground](https://ioground.com/blog/the-history-behind-krunker-io)
- FRVR acquired Krunker.io on 12 May 2022. At that point it had been "played by over 200 million unique players" — [PocketGamer.biz](https://www.pocketgamer.biz/frvr-acquires-f2p-first-person-shooter-krunkerio/); [GamesBeat](https://gamesbeat.com/frvr-acquires-free-to-play-shooter-krunker-io/)

**Shell Shockers (egg FPS): Babylon.js, tiny indie, 200M lifetime players**
- Made by Blue Wizard Digital on Babylon.js and released 1 Sept 2017. The studio was founded in 2014 by PopCap co-founder Jason Kapalka — [Wikipedia](https://en.wikipedia.org/wiki/Shell_Shockers); [Wikipedia: Blue Wizard](https://en.wikipedia.org/wiki/Blue_Wizard_Digital)
- It passed "two hundred million lifetime players". It runs at "60fps on a Chromebook" through "aggressive asset budgets and cartoon shading instead of fighting for photoreal frames". Described as "a tiny indie studio" (article dated 10 Apr 2026) — [WebGPU.com showcase](https://www.webgpu.com/showcase/shell-shockers-babylonjs-browser-fps/)
- Supported browsers are listed as Chrome, Firefox, Edge and Chromebooks. iOS Safari is not explicitly named in this source — [search summary of same showcase](https://www.webgpu.com/showcase/shell-shockers-babylonjs-browser-fps/)

**Bloxd.io (voxel sandbox/minigames): noa engine on Babylon.js, the #4 web game, school-heavy audience**
- Built on the open-source noa voxel engine by Arthur Baker (UK) in 2021 — [VIVERSE news](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse)
- The noa README says it "Uses Babylon.js for 3D rendering". Games built on noa include bloxd.io, Mojang's "Minecraft Classic", CityCraft.io and others — [GitHub fenomas/noa](https://github.com/fenomas/noa)
- About 14,766 average CCU and a 24-hour peak of 27,049 (WebGameDB, May 2026). Ranked #4 among tracked web games. 8M+ registered accounts. 4.36M monthly visits in March 2026 — [VIVERSE news](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse)
- Runs in Chrome, Firefox, Safari and Edge on desktops, Chromebooks and mobile. Mobile load times on low-end devices were improved in early 2025. Reachable through 40+ "unblocked" (school-network) domains. Audience is about 52/48 male/female — [VIVERSE news](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse)
- Founder interview (June 2025): "8 million monthly active players", "peak concurrent users exceeding 17,000", a profitable, small, bootstrapped team — [London Issue](https://londonissue.co.uk/2025/06/12/bloxd-founder-arthur-baker-discusses-uk-gaming-industry-with-andy-ross-from-studio-vision-podcast/)
- The fan wiki counts 11 current and 5 former devs (fan source, low reliability) — [search summary: Bloxd wiki Developers](https://bloxd-io.fandom.com/wiki/Developers)

**Venge.io (FPS): PlayCanvas, 1 developer then a small studio**
- Made in PlayCanvas by Cem Demir (ONRUSH Studio, Turkey). Released on Poki on 1 June 2020. "Optimized for mobile phone and tablet web browsers". 50M+ gameplays on Poki — [EverybodyWiki (low reliability)](https://en.everybodywiki.com/Venge.io)
- The developer says development started 7 March 2020, about 3 months before launch. It uses PlayCanvas's built-in UI system because it "works properly on all browsers" and "respects different device sizes". A forum user reported playing it smoothly on a phone — [PlayCanvas forum showcase](https://forum.playcanvas.com/t/showcase-venge-io/13609)
- Custom netcode: "building custom solutions for matchmaking, latency compensation, and host migration" — [BrowserGamesHQ (promotional)](https://browsergameshq.com/blog/meet-onrush-studio)
- Still being updated in 2026 — [itch.io page](https://onrush.itch.io/vengeio)
- Poki lists Venge.io, Crazy Cars and Sword Masters as top PlayCanvas games — [Poki engine guide](https://developers.poki.com/guide/web-engine)

**Smash Karts (kart battle): Tall Team, web + iOS + Android**
- 30M+ players. Ads are about 70–80% of revenue (AdSense/AdMob/Ad Manager). The Discord has 70k members — [Google for Publishers case study](https://www.google.com/ads/publisher/stories/tall_team/)
- Platforms: Web, iOS and Android, distributed via CrazyGames, Poki and the app stores — [Tall Team](https://tall.team/smash-karts)

**Narrow.One (5v5 archery CTF): three.js**
- Made by Pelican Party Studios with three.js. Poki names it a top three.js game alongside Up Together and ZooDrop — [Poki engine guide](https://developers.poki.com/guide/web-engine); [Pelican Party devlog](https://pelicanparty.itch.io/narrow-one/devlog)

**Hordes.io (3D MMORPG, closest analogue to an "MMO-lite")**
- Free-to-play 3D browser MMORPG made by solo dev "Dek" since 2016. It started on three.js and moved to OGL, "modified heavily", because three.js had "performance issues primarily related to rendering many dynamically moving meshes with unique properties" and "tree shaking support was minimal". Batching draw calls was "massive" — [Web Game Dev interview](https://www.webgamedev.com/interviews/dek-hordes)
- Networking moved from JSON over Socket.io to custom serialization over uWebSockets. About 1,000 CCU per instance. It uses dynamic tick rates: "Even with a tick rate of only 10 updates a second, Hordes is still playable". It prioritises "game feel" over full client-side prediction — [Web Game Dev interview](https://www.webgamedev.com/interviews/dek-hordes)
- Monetised through cosmetics and utility purchases (mounts, pets), enough to support a solo dev plus freelancers. Animations are procedural. There is a custom multiplayer map editor and custom lossy compression for world props — [Web Game Dev interview](https://www.webgamedev.com/interviews/dek-hordes)
- Requires WebGL2 — [search summary of Hordes technical page](https://hordes.io/technical)

**HYTOPIA (web voxel UGC platform, MMO-capable, the most documented stack)**
- The SDK launched Feb 2025. By Sept 2025 it had 143k+ users, 1.93M minutes played and about 5,000 sessions/day. It uses three.js, a server-authoritative engine, geo-distributed servers and HTML/CSS UI — [HYTOPIA blog, Sep 2025](https://blog.hytopia.com/2025/09/30/seven-months-since-launch-hytopias-growth-story/)
- December 2025: daily active players peaked at 39.4k (Christmas Eve), "2.5M+ downloads on Google Play Store", and mobile tap-based UX upgrades — [HYTOPIA blog, Jan 2026](https://blog.hytopia.com/2026/01/01/hytopia-december-growth-metrics-and-milestones/)
- The mobile beta shipped as native apps (iOS via TestFlight, Android via Play), not documented as iOS Safari. SDK 0.4.2 added WebRTC networking with WebSocket fallback and moved networking to a separate thread — [HYTOPIA blog, May 2025](https://blog.hytopia.com/2025/05/01/hytopia-april-update-mobile-readiness-ai-tools-game-jam-winners-more/)
- Caution for an education buyer: it is crypto-linked. It launched a $HYBUX token (Jul 2025) and is "migrating to Base blockchain" — [GAMES.GG](https://games.gg/news/hytopia-is-migrating-to-base-blockchain/); [search summary](https://www.gamespress.com/en-US/UGC-GAMES-PLATFORM-HYTOPIA-DOUBLES-CREATOR-FUND-TO-250000-WELCOMES-TWO)

**Temple Run 2 (web port, single-player, mobile-first reference)**
- Imangi released Temple Run 2 for the web on Poki in Nov 2020. It is #BuiltWithBabylon and has full mobile swipe controls — [Babylon.js on X](https://x.com/babylonjs/status/1907115868661682384); [Poki](https://poki.com/en/g/temple-run-2)

**Miniblox.io (voxel sandbox)**
- An HTML5, no-install blocky multiplayer game with survival, creative and Eggwars modes. It "runs on mobile browsers with touch controls". Only aggregator sources were found and the engine is not identified — [miniblox.io](https://miniblox.io/game/no-download); [aggregator](https://gladihoppers.io/miniblox-io/)

**Creature-catching on the web (the closest genre matches)**
- *Catch a Pet* (catchapet.web.app, also on Poki): a browser/mobile simulation where you lasso wild animals across rarity tiers, upgrade the lasso to catch rarer tiers, and chase limited-time legendary pets. Credited to "Kimchi Soup Studios". The engine is not disclosed — [catchapet.web.app](https://catchapet.web.app/); [Poki](https://poki.com/en/g/catch-a-pet). Conflict: APK mirrors list a package "air.com.hamzagames.catchapet" (an Adobe AIR build by a different studio name), so this may be an unrelated same-name game — [HappyMod (low reliability)](https://www.happymod.to/catch-a-pet-mod/air.com.hamzagames.catchapet/)
- *MonsterMMORPG*: a browser Pokémon-like where you weaken and capture wild monsters, with 2,000+ monsters and 500+ maps. Built on ASP.NET by solo dev Furkan Gözükara, published 2011 and still in development. The Android app is a wrapper around the website. It is 2D — [Wikipedia](https://en.wikipedia.org/wiki/MonsterMMORPG)
- Upcoming 3D creature-catchers (Aniimo, 2026) target PC, console and mobile, not the browser — [Summer Engine list (secondary)](https://www.summerengine.com/blog/games-like-pokemon)

**Danny Limanseta's three.js demos (Little Habitats, Wildbrush, Poseidia): AI-built, assets generated in code**
- *Little Habitats*: a cosy island builder (Townscaper/Tiny Glade-like) with creatures that arrive when conditions are met. Built on three.js, "all assets are generated by Opus 5.5" (per LinkedIn comments, second-hand). Playable free on Wavedash and Vercel — [Little Habitats site](https://little-habitats.vercel.app/); [Wavedash](https://wavedash.com/games/little-habitats); [search summary of LinkedIn](https://www.linkedin.com/in/dannylimanseta/)
- *Wildbrush*: a Zelda-BotW-style open world with 2 biomes, paintbrush combat, 3 dungeons, 30+ enemies and a boss. "Vibe coded" with Opus 5.5. **Works only on desktop** — [Danny Limanseta on X](https://x.com/DannyLimanseta/status/2104215873120764032)
- *Poseidia*: an Atlantis flythrough in three.js that took about 2 hours with Opus 5.5 — [Danny Limanseta on X](https://x.com/DannyLimanseta/status/2103169095034400772)
- All three are single-player showcases, not multiplayer production games with player bases.

**Asian mini-game ecosystems (low-end-phone 3D at massive scale)**
- WeChat mini games passed 500M MAU (June 2025) — [TechNode](https://technode.com/2025/06/26/wechat-mini-program-games-hit-500-million-monthly-users-pc-usage-surges/). About 70 titles exceeded 1M DAU in 2025 — [Outlook Respawn](https://respawn.outlookindia.com/gaming/gaming-news/wechat-mini-games-reports-70-titles-above-1-million-dau-in-2025). China mini-games revenue in 2025 was RMB 53.5B (+34%) — [GameTeahouse](https://youxichaguan.com/en/archives/195287)
- "Cocos Creator is what most WeChat Mini Games are built in", and its runtime is baked into WeChat itself. LayaAir is second. Unity/Tuanjie is possible via transform SDKs. **Initial package max 4 MB**, with the rest in on-demand subpackages. "The constraint is package size and performance on low-end phones, not whether 3D is possible" — [Cinevva guide (secondary)](https://app.cinevva.com/guides/wechat-mini-game-engines)
- The WeChat Unity/Tuanjie transform SDK added an "iOS high performance+" mode that reduces WebContent process memory — [WeChat transform SDK changelog](https://github.com/wechat-miniprogram/minigame-tuanjie-transform-sdk/blob/main/CHANGELOG.md)
- Mini games are expected to "load in under 10 seconds" — [Meridian Play report](https://meridianplay.substack.com/p/china-wechat-mini-games-industry)
- Vietnam: a Zalo Mini App is a web app under 10 MB running inside Zalo — [Thế Giới Di Động](https://www.thegioididong.com/game-app/zalo-mini-app-la-gi-cach-su-dung-va-loi-ich-hap-dan-1579962). Developers integrate Cocos Creator with zmp-sdk — [Zalo developer community](https://developers.zalo.me/community/detail/f0c0193b257ecc20956f). Known Zalo mini games are mostly marketing-style (lucky draw, spin-to-win) — [same TGDĐ/GapOne search results](https://gapone.vn/mini-game-tren-mini-app-zalo/)

**Facebook Instant Games: a shrinking channel**
- Meta: Facebook "Web Games" sunset by 30 Sep 2026. Instant Games must move to "Zero Permissions" connection by that date — [PPC Land](https://ppc.land/meta-announces-web-games-sunset-by-september-2026/)
- Unity published a deprecation notice for its Facebook Instant Games support — [Unity Discussions](https://discussions.unity.com/t/deprecation-notice-unity-support-for-facebook-instant-games/1694214)

### Inferences
- The successful browser-3D multiplayer genre is dominated by **session-based arena games** (FPS, karts, archery, voxel minigames), not persistent-world creature collectors. A web Palworld/Pokémon-like with party bosses would be closest to **Hordes.io (persistent MMO)** plus **Bloxd/HYTOPIA (voxel worlds, school audience)**, with Catch a Pet as the proof of the catch loop in 2D/light 3D.
- Bloxd.io is the most relevant precedent for a school-age audience: it is a web-native JS engine, runs on Safari and mobile, spreads through school "unblocked" domains, and earns from a cosmetic-only subscription.
- Tiny teams (1–5 people) routinely ship these games. Small team size is not the blocker; content scope and mobile memory are.

### Gaps
- No source explicitly confirms Krunker, Shell Shockers, Venge or Narrow.One running well on **iPad 7th gen / A10 Safari**. Claims are generic ("mobile browsers"). Hands-on testing is needed.
- Smash Karts' engine and netcode could not be confirmed from a primary source.
- Miniblox's engine and team were not found.
- PokéMMO (widely described as a Java client, not web) was not verified in this pass.
- No Rodeo-Stampede-like 3D web multiplayer title was found.
- No player numbers were found for Catch a Pet, Narrow.One or Hordes.io in 2026.
- No Cocos 3D multiplayer title on Zalo with published metrics was found.

---

## Q2. Per-game stack details: engine, netcode, download size, mobile performance, team, monetization, postmortems

### Takeaway
The recurring stack is a **small JS 3D engine (three.js ~150 KB, Babylon ~130 KB, PlayCanvas ~300 KB)**, a **Node/Bun authoritative server over WebSocket (uWebSockets or custom binary serialization)**, and **low tick rates (10–30 Hz)**. Money comes from **ads (rewarded video) plus cosmetics or subscriptions**. The best public postmortems are Hordes.io (why three.js was dropped for OGL) and HYTOPIA's open-source engine (full architecture).

### Cited Findings

| Game | Renderer | Server / netcode | Team | Monetization | Scale (source) |
|---|---|---|---|---|---|
| Krunker.io | three.js | JS server rewrite, ~10 Hz tick (secondary claim) | solo founder, then FRVR | F2P + cosmetics | 200M+ unique players at May 2022 acquisition |
| Shell Shockers | Babylon.js | "matchmade" rooms, no detail | "tiny indie" | "live economy" | 200M lifetime players (Apr 2026) |
| Bloxd.io | noa → Babylon.js | not published | small team | cosmetic "Super Rank" subscription (Dec 2024), no pay-to-win | ~14.8k avg CCU, 27k peak (May 2026) |
| Venge.io | PlayCanvas | custom matchmaking, lag compensation, host migration | solo, then studio | Poki revenue share (ads) | 50M+ Poki gameplays |
| Smash Karts | not confirmed | not confirmed | Tall Team | ads 70–80% | 30M+ players |
| Hordes.io | OGL (custom, from three.js) | uWebSockets + custom serialization, ~1,000 CCU/instance, dynamic tick | solo + freelancers | cosmetics, mounts, pets | 100–200 CCU 2016–18, then "order of magnitude" more after 2019 |
| HYTOPIA | three.js | Node/Bun, Rapier 60 Hz, sync 30 Hz, msgpackr + gzip, WebTransport/WebSocket (plus WebRTC in SDK 0.4.2) | startup | marketplace + token | 39.4k peak DAU (Dec 2025) |

Sources for the table: [ioground](https://ioground.com/blog/the-history-behind-krunker-io), [PocketGamer.biz](https://www.pocketgamer.biz/frvr-acquires-f2p-first-person-shooter-krunkerio/), [WebGPU.com](https://www.webgpu.com/showcase/shell-shockers-babylonjs-browser-fps/), [VIVERSE](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse), [noa](https://github.com/fenomas/noa), [BrowserGamesHQ](https://browsergameshq.com/blog/meet-onrush-studio), [EverybodyWiki](https://en.everybodywiki.com/Venge.io), [Google for Publishers](https://www.google.com/ads/publisher/stories/tall_team/), [Web Game Dev interview](https://www.webgamedev.com/interviews/dek-hordes), [hytopia-source](https://github.com/hytopiagg/hytopia-source), [HYTOPIA blog](https://blog.hytopia.com/2026/01/01/hytopia-december-growth-metrics-and-milestones/).

**HYTOPIA engine internals (open source, MIT): the most reusable blueprint**
- Client: three.js WebGLRenderer plus EffectComposer (SMAA, selective bloom, outline). CSS2DRenderer for in-world UI. **"Block geometry is built in a Web Worker to avoid blocking the main thread."** **MeshBasicMaterial throughout**, with ambient and block lighting done "via custom logic and shader uniforms" instead of dynamic three.js lights — [GitHub hytopia-source](https://github.com/hytopiagg/hytopia-source)
- Server: Node.js/Bun, Rapier3D physics at 60 Hz, 16×16×16 chunks, world state synced at 30 Hz. The client sends input at about 60 Hz on unreliable channels. WebTransport (QUIC) is preferred with WebSocket fallback. msgpackr serialization with optional gzip. A MobileManager handles the touch joystick — [GitHub hytopia-source](https://github.com/hytopiagg/hytopia-source)
- SDK 0.4.2 moved networking off the physics/scripting thread ("slashing CPU usage"). Rapier SIMD gave "20–30% faster physics" — [HYTOPIA blog](https://blog.hytopia.com/2025/05/01/hytopia-april-update-mobile-readiness-ai-tools-game-jam-winners-more/)

**Engine build sizes and which top Poki games use them (Poki's official guide)**
- three.js: 151 KB compressed (122 KB Brotli). No built-in touch or responsive scaling. Top games: Narrow.One, Up Together, ZooDrop.
- PlayCanvas: 300 KB empty project, built-in mobile responsiveness. Top games: Venge.io, Crazy Cars, Sword Masters.
- Babylon.js: 132 KB compressed. Top games: Temple Run 2, Tunnel Rush.
- Unity: "~11MB unoptimized", "less well-suited for the web". Top games: Stunt Bike Extreme, Repuls.io.
- Godot: 10 MB. Cocos Creator: 709 KB (Merge Arena, Kawaii Fruits 3D). Defold: 1.03 MB.
- Source: [Poki engine guide](https://developers.poki.com/guide/web-engine)
- Vendor benchmark (2016, dated): PlayCanvas app 0.22 MB vs Unity 4.72 MB. On iPhone 5S/6, PlayCanvas ran at 60 FPS vs Unity at 17–28 FPS. Unity crashed on the iPhone 4S — [PlayCanvas blog (vendor)](https://blog.playcanvas.com/playcanvas-versus-unity-webgl/)

**Monetization evidence**
- Poki co-founder (2025): "Rewarded Video has become the gold standard for browser gaming". Poki has 100M monthly active players and 625M players in 2025. Games can earn "up to €1 million a year" (a ceiling, not typical) — [Mobidictum interview](https://mobidictum.com/pokis-web-gaming-interview-michiel-van-amerongen/)
- Bloxd's revenue is cosmetic-only ("no competitive advantage", no loot boxes) — [VIVERSE](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse)
- Hordes.io is cosmetics plus utility, with items shareable in-game and seen as "fair by the community" — [Web Game Dev interview](https://www.webgamedev.com/interviews/dek-hordes)

### Inferences
- **Hordes.io's lesson for a creature game:** many unique moving creature meshes is exactly the workload that hurt three.js for Hordes. Plan for instancing, batching and shared materials/atlases from day one, or budget for a custom render path.
- **HYTOPIA's choices fit weak GPUs:** unlit or simple materials (MeshBasicMaterial plus baked/shader lighting), geometry built in workers, and a 30 Hz state sync. They transfer well to an A10 iPad.
- A 10 Hz tick is proven "playable" for tab-target or turn-ish combat (Hordes, and reportedly Krunker). A creature battle with elemental skills does not need an FPS-grade tick.
- Unity WebGL is the weakest fit for an iPad 7 / Safari target: initial size around 11 MB, WASM heap growth crashes (see Q4), and deprecating channels (Facebook).

### Gaps
- No primary source gives download sizes (MB) for Krunker, Shell Shockers, Bloxd or Venge.
- No public GDC-style postmortem was found for Bloxd or Shell Shockers. There is an Arthur Baker YouTube interview ([YouTube](https://www.youtube.com/watch?v=aNlXd7WuMgg)) and a podcast that were not transcribed here.
- Team sizes for Shell Shockers, Tall Team and HYTOPIA were not found.

---

## Q3. Education-focused game platforms: what they run on and what to learn

### Takeaway
The biggest education games do **not** use browser 3D multiplayer. Prodigy (about 9M MAU in 2021) is a **2D Phaser** browser game, and Minecraft Education is a **native app** with separate iPad and Chromebook builds. So a browser-3D education MMO has no large proven precedent. The closest proven analogue is Bloxd.io's organic school traffic.

### Cited Findings
- Prodigy Math Game is built with **Phaser** (2D), runs in browsers plus Android/iOS, and was released in 2014. It had about 100M registered users and 9M monthly active users by Jan 2021. It is freemium with Core/Plus/Ultra memberships plus cosmetics. Fairplay (2021) criticised it as "manipulative" and filed FTC complaints — [Wikipedia](https://en.wikipedia.org/wiki/Prodigy_Math_Game)
- Prodigy requires WebGL support — [Prodigy FAQ](https://www.prodigygame.com/main-en/our-online-access-is-changing)
- Minecraft Education runs on Chromebook, iPad, Mac, PC and mobile as a native app. On Chromebooks it installs via Play Store and at least 4 GB RAM is recommended. Cross-platform multiplayer (Chromebook ↔ PC ↔ iPad) requires every participant to run **the exact same version** — [Microsoft Education blog](https://www.microsoft.com/en-us/education/blog/2020/08/minecraft-education-edition-available-on-chromebooks-for-back-to-school/); [Google Chrome Enterprise help](https://support.google.com/chrome/a/answer/10019965?hl=en)
- Bloxd.io reaches students through 40+ unblocked domains, with a roughly gender-balanced audience (52/48) — [VIVERSE](https://news.viverse.com/post/bloxd-io-free-browser-game-on-viverse)

### Inferences
- Prodigy shows the education creature-battle loop (turn-based battles gated by math questions, collectible pets) at 9M MAU **without 3D**. 3D is a differentiator, not a requirement for traction.
- Prodigy's membership backlash is a warning for a Vietnamese education company: pay-to-progress for minors draws regulatory and parent criticism. Cosmetic-only monetization (Bloxd model) is safer.
- Minecraft Education's "same version required" rule is what native apps pay for. A PWA avoids version skew because everyone loads the current build.

### Gaps
- I could not confirm whether Prodigy has shipped any 3D or WebGL-3D mode, or its current (2026) tech stack. The Prodigy tech blog is not public.
- No shipped browser-3D multiplayer education game with published metrics was found. Gimkit's or Blooket's engine could not be confirmed from primary sources.

---

## Q4. Recurring technical patterns: asset budgets, LOD, instancing, load strategy, iOS Safari memory

### Takeaway
Successful titles share a small initial download (**≤5 MB initial, ≤8 MB total on Poki; 4 MB initial on WeChat; <10 MB for Zalo Mini Apps**), stylised or cartoon unlit shading, draw-call batching, worker-side geometry, low tick rates, and on-demand subpackage streaming. On iOS Safari the hard constraint is **memory per tab** (a few hundred MB on older devices, and not a fixed number). Exceeding it silently reloads the page. The mitigations are compressed textures (KTX2/ASTC), capped DPR/canvas size, and not growing the heap.

### Cited Findings

**Download size and load time**
- Poki: the initial download should not exceed 5 MB, with the total under 8 MB. Target at least 30 FPS (60 ideal) on 3G+. Players leave if loading takes more than 10 s. Mobile controls must be forced on tablets — [Poki requirements](https://developers.poki.com/guide/requirements-quality); [Poki engine guide](https://developers.poki.com/guide/web-engine); [search summary of Poki docs](https://sdk.poki.com/new-requirements)
- Poki (2026): "For every extra megabyte a person has to download to play your game, you're going to lose a couple percent of players." Portrait mode dominates mobile web play and games must work in portrait. About **68% of Poki players had WebGPU support in June 2026**, so WebGL remains necessary as a fallback — [Poki blog 2026](https://poki.com/blog/building-web-browser-games-2026)
- WeChat: initial package max 4 MB, with the rest in on-demand subpackages — [Cinevva guide](https://app.cinevva.com/guides/wechat-mini-game-engines)
- Zalo Mini App: under 10 MB — [TGDĐ](https://www.thegioididong.com/game-app/zalo-mini-app-la-gi-cach-su-dung-va-loi-ich-hap-dan-1579962)

**Rendering budgets on low-end hardware**
- Cocos (search snippet; the article fetch failed): 3D models over 30,000 faces gave under 20 FPS on iPhone 6 and about 30 FPS on low-end Android. "Performance mode" raised FPS about 3× (13→49). Memory limits were about 1 GB on low-end and 1.4 GB on high-end devices (WeChat context) — [Cocos: Making 3D Mini Games](https://www.cocos.com/en/post/making-3d-mini-games-with-cocos-creator)
- Shell Shockers: "aggressive asset budgets and cartoon shading" is how it reaches 60 FPS on Chromebooks — [WebGPU.com](https://www.webgpu.com/showcase/shell-shockers-babylonjs-browser-fps/)
- Hordes.io: batching draw calls was "massive". Procedural animations. Custom lossy compression for props — [Web Game Dev interview](https://www.webgamedev.com/interviews/dek-hordes)
- HYTOPIA: MeshBasicMaterial plus shader-uniform lighting (no dynamic lights). Meshing in a Web Worker — [hytopia-source](https://github.com/hytopiagg/hytopia-source)

**iOS Safari memory behaviour (the iPad 7 risk)**
- The WebContent process gets whichever is lower, WebKit's memory-pressure limit or iOS jetsam. It varies with device RAM, system load and time since reboot. **There is no fixed per-tab limit.** Typical budgets on current devices were quoted at 300–450 MB (search snippet) — [Catch Metrics](https://www.catchmetrics.io/blog/deep-dive-ram-internals-webkit)
- Catch Metrics' approximate heap limits by device class: iPhone 6s/SE1 ~200–250 MB, iPhone 8/X ~300–350 MB, iPhone 11/12 ~350–400 MB, iPhone 13/14 ~400–450 MB, iPhone 15+ ~1 GB+. WebKit purges caches at 50%, **discards JIT code at 65%**, and kills the process at 100%. It recommends "shipping less JavaScript". These figures are from a vendor blog, are approximate, and iPad figures are not given — [Catch Metrics](https://www.catchmetrics.io/blog/deep-dive-ram-internals-webkit)
- Unity WebGL on iOS: when the WASM heap needs to grow from 256 MB to around 300–500 MB, "the browser tab crashes and does a force reload" (search snippet) — [Unity Discussions](https://discussions.unity.com/t/webgl-memory-increment-issue-and-crash-on-ios/894771)
- Reported fixes: compress textures (ASTC/KTX2), cap textures at 1024², lazy-load WebGL content, drop texture caching, and reduce compositing layers — [Bugnet blog (secondary)](https://bugnet.io/blog/how-to-fix-unity-webgl-build-crashing-on-safari-ios); [Ash Kyd dev log](https://ashk.au/2024/02/07/dev-log-debugging-safari-an-ogre-with-layers/)
- KTX2 stays compressed in VRAM, avoiding decompression spikes that cause mobile out-of-memory reloads — [Wawa Sensei tutorial (secondary)](https://wawasensei.dev/tuto/fix-loading-model-freezes-threejs-react-ktx2). Some three.js users reported intermittent .basis/.ktx2 issues on Safari — [three.js issue #19717](https://github.com/mrdoob/three.js/issues/19717)
- WebGL "context lost" crashes on iPads were reported after iOS 18.2/18.3 — [Apple Developer Forums](https://developer.apple.com/forums/thread/778735)
- Anecdotal (small indie repo): older-iPad Safari jetsams were fixed by capping tablet DPR at 1.0 (from 1.5) under a 1.2-megapixel budget. The play canvas went from ~8.7 MB to 3.87 MB. Menu canvases were shrunk to 64×64 when hidden and rAF paused when backgrounded — [GitHub PR](https://github.com/jpwarner-sys/blockball/pull/46)
- The WeChat Unity transform added "iOS high performance+" specifically to reduce WebContent memory — [WeChat transform changelog](https://github.com/wechat-miniprogram/minigame-tuanjie-transform-sdk/blob/main/CHANGELOG.md)

**Netcode patterns**
- Authoritative Node/Bun server, binary serialization (msgpackr or custom), 10–30 Hz state sync, networking on its own thread — [hytopia-source](https://github.com/hytopiagg/hytopia-source); [HYTOPIA blog](https://blog.hytopia.com/2025/05/01/hytopia-april-update-mobile-readiness-ai-tools-game-jam-winners-more/); [Hordes interview](https://www.webgamedev.com/interviews/dek-hordes)
- Poki provides a free "Netlib" networking library and a user data store for multiplayer web games (search snippet) — [Poki docs](https://sdk.poki.com/index.html)

### Inferences
- **Budget for an iPad 7 (3 GB RAM, A10):** treat about 300 MB total tab memory as the working ceiling (JS heap + GPU textures + canvas). Keep the render resolution at DPR ≤1.0 on tablets. Use KTX2/ASTC textures at 512–1024 px max, a small shared texture atlas, and a limited number of simultaneously visible creature species. This is inferred from the device-class figures and the anecdotal PR, not measured on an iPad 7.
- **Loading pattern:** a ≤5 MB first load (engine + login + hub), then stream biomes and creature packs as subpackages when needed (Poki/WeChat model). Every MB costs a few percent of players.
- **Art direction as a performance tool:** cartoon or unlit shading (Shell Shockers, HYTOPIA's MeshBasicMaterial) is the common thread. Low-poly or procedurally generated stylised assets (Danny Limanseta's approach) fit this, but his Wildbrush is desktop-only, so AI-generated scenes still need a mobile budget pass.
- **Engine choice for Safari/iPad:** web-native engines (three.js, Babylon, PlayCanvas; Cocos if the Zalo/WeChat mini-game channel matters) fit better than Unity WebGL. PlayCanvas and Cocos ship touch and responsive scaling built in. three.js and Babylon need custom mobile controls.
- **Stay on WebGL2:** WebGPU reached only about 68% of Poki players by mid-2026, and older iPads may be in the other 32%.

### Gaps
- No authoritative Apple or WebKit figure exists for per-tab memory on **iPad 7th gen (A10, 3 GB)**. The Catch Metrics table covers iPhones only. The "384 MB total canvas memory" Safari message appeared in a search snippet from an unrelated GitHub issue and was not verified.
- No published LOD or instancing numbers (draw calls, tris per frame) were found for any of the shipped titles. The only concrete poly figure is Cocos's 30k-face low-end test.
- No first-party load-time or size figures were found for Bloxd, Krunker or Shell Shockers on mobile.
- The fetch of the Cocos 3D mini-game article failed, so its figures come from a search-engine summary.
