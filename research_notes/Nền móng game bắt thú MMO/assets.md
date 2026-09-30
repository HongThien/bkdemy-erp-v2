# Rigged, animated cute/chibi 3D characters and creatures for a browser creature-catching game (as of 30 Sep 2026)

Scope: where to get the player character (trainer), many creature species (dogs of many breeds, chicken, cow, pig, sheep, wild/fantasy later, bosses) with idle/walk/run/attack/hit/faint/"being captured" animations. Output is glTF/GLB in WebGL, weakest device iPad 7th gen (A10, 3 GB RAM). Commercial use (paid tuition app). Style: cute, rounded, bright, chibi, Hay Day-like; Synty-like realism was rejected.

Research method note: several official pages returned HTTP 403 to the fetch tool (Mixamo FAQ, tripo3d.ai/pricing and /terms, CGTrader help, fab.com/eula). For those, the claims below come from search-engine snippets of the official page or from secondary sources, and they are flagged. Quaternius and KayKit do not publish triangle or bone counts on their pages. Measure those by loading the files, e.g. with `gltf-transform inspect`, before committing.

---

## 1. CC0 / permissive packs (Quaternius, KayKit, Kenney, Poly Pizza): license, animations, rig, poly, style

### Takeaway
The CC0 ecosystem covers the **player character** well. KayKit's chibi-proportioned Adventurers plus the 130–160-clip KayKit Character Animations library are both CC0 and ship as glTF. Quaternius's Universal Animation Library 1+2 is CC0, with 250+ humanoid clips including farming and fishing. The ecosystem is **thin for cute animals**. Quaternius's animal packs are faceted low-poly with 12 species, only a few of them farm animals. Kenney Cube Pets are blocky, with walk and run only. KayKit has no animal pack. None of these provides "faint/dizzy" or "being captured" clips, and none offers one shared quadruped skeleton across species that has been documented.

### Cited Findings
**Quaternius (all CC0, "free to use in personal, educational and commercial projects")**
- **Ultimate Monsters**: 50 animated monsters, created Oct 2022. Formats FBX, OBJ, Blend, glTF. License CC0. Free download, with optional Patreon tiers ($10–$50/mo) for source kits. The page does not list animation names, rig or poly counts. — [Quaternius – Ultimate Monsters](https://quaternius.com/packs/ultimatemonsters.html)
- A third-party sprite pack rendered from the CC0 Ultimate Monsters gives the clip sets it used. The "cute blob monsters" have Idle, Walk, Attack, Hit, Death. The "flying monsters (dragons, bees, ghosts)" have Idle, Fly, Attack, Hit, Death. The 3D pack may contain more clips; this is indirect evidence. — [itch.io release thread](https://itch.io/t/7029712/ultimate-monsters-49-animated-monsters-in-8-directions-3-sprite-packs-no-ai)
- **Cute Animated Monsters Pack**: 21 models, Aug 2020, FBX/OBJ/Blend/glTF, CC0. Animation names and rig are not listed. — [Quaternius – Cute Monsters](https://quaternius.com/packs/cutemonsters.html)
- **Ultimate Animated Animal Pack**: July 2021, CC0, FBX/OBJ/Blend/glTF. It has "12 different animals" with "more than 12 unique animations", for example "Attack, Death, Kicks, Gallops, Walk, Jump". The page gives no rig or poly info. — [Quaternius – Ultimate Animated Animals](https://quaternius.com/packs/ultimateanimatedanimals.html)
- The 12 animals are Cow, Donkey, Deer, Alpaca, Bull, Fox, Shiba Inu, Stag, Husky, Wolf, White Horse and Horse, all CC0 on Poly Pizza. — [Poly Pizza bundle](https://poly.pizza/bundle/Animated-Animal-Pack-ILAPXeUYiS)
- **Farm Animal Pack**: 7 models, marked "Animated", FBX/OBJ/Blend, June 2018, CC0. The page does not name the animals. — [Quaternius – Farm Animal Pack](https://quaternius.com/packs/farmanimal.html)
- **LowPoly Animated Animals** (older itch pack): 6 animated animals with Death, Idle, Jump, Run, Walk, tagged cow, horse, llama, pig, pug. CC0. — [quaternius.itch.io/lowpoly-animated-animals](https://quaternius.itch.io/lowpoly-animated-animals) (from a search snippet)
- **Universal Animation Library (UAL1)**: 120+ animations on a "universal humanoid rig compatible with Unreal Engine, Godot and Unity, ready for retargeting", CC0.
  - Standard tier (free) = "60-70%" of the pack in OBJ/FBX/glTF.
  - Pro and Source tiers are paid. Source adds .blend files and Unity URP/Unreal/Godot implementations.
  - [Quaternius – UAL](https://quaternius.com/packs/universalanimationlibrary.html)
- **Universal Animation Library 2**: released Jan 2026, 130+ animations, CC0. Categories include melee combos, parkour, **farming, fishing**, and zombie locomotion. It uses the same free/Pro/Source split. — [Quaternius – UAL2](https://quaternius.com/packs/universalanimationlibrary2.html)
- **Bestiary – Dungeon Monsters Kit**: 7 enemies × 3 colour variants on a humanoid rig "compatible with the Universal Animation Library", FBX and GLB. — [quaternius.itch.io/bestiary-dungeon-monsters-kit](https://quaternius.itch.io/bestiary-dungeon-monsters-kit)
- The Quaternius homepage also lists these creature packs: Animated Cute Fish, Animated Fish, Animated Dinosaur, Easy Enemy, Animated Monster, Universal Base Characters, and several modular human packs. — [quaternius.com](https://quaternius.com/)

**KayKit (Kay Lousberg), CC0**
- **KayKit Character Animations**
  - Counts: kaylousberg.com says "133 humanoid animations", split per rig into Rig_Medium and Rig_Large. FBX and glTF.
  - License: "Free for personal and commercial use, no attribution required. (CC0 Licensed)".
  - Categories: General (idle, hit, death, spawning, interacting), Movement, Melee, Ranged (shooting, bows, spellcasting), and Simulation (waving, cheering, sitting, lying down). — [kaylousberg.com – Character Animations](https://kaylousberg.com/game-assets/character-animations)
  - **Count conflict**: the itch page says **161** animations. It splits them as Rig_Medium "100+" and Rig_Large "25+". It adds a Tools category (digging, fishing, hammering, pickaxing) and a Source tier at $14.99+ for .blend files. It was last updated 10 Dec 2025. — [itch.io – KayKit Character Animations](https://kaylousberg.itch.io/kaykit-character-animations)
- **KayKit Adventurers**
  - Contents: 5 free characters, "fully textured/rigged/animated". Extra ($7.95+) adds 3 characters and 3 texture variants each. Source ($11.95+) adds .blend files. There are 25+ weapons and accessories.
  - Texture: a single **1024×1024 gradient atlas, downsampleable to 128×128**.
  - Formats and license: FBX and glTF, CC0, "should not resell unmodified copies". — [itch.io – KayKit Adventurers](https://kaylousberg.itch.io/kaykit-adventurers)
- The KayKit itch storefront lists Adventurers, Skeletons, Character Animations, the Mystery Monthly character series ($19.99 each, 14–15 rigged/animated characters), and The Complete KayKit ($150). **No animal or creature pack is listed.** — [kaylousberg.itch.io](https://kaylousberg.itch.io/)

**Kenney, CC0**
- **Cube Pets**: 16 animals with walk and run animations, 24 assets, CC0. Separate FBX/OBJ/GLTF files. Version 2.0 was "a complete remake, added animals & animations" (2026). Style is blocky and cube-shaped. — [Kenney – Cube Pets](https://kenney.nl/assets/cube-pets); [Kenney on X](https://x.com/KenneyNL/status/2032395051028959555)
- **Animated Characters** packs: rigged models with 4 skins and 3 animations (idle, jump, run), CC0. **Blocky Characters**: 20 assets, CC0. — [Kenney – Animated Characters 1](https://kenney.nl/assets/animated-characters-1); [Kenney – Blocky Characters](https://kenney.nl/assets/blocky-characters)
- All Kenney 3D models are CC0 1.0 and free for commercial games with no credit required. — [Kenney – Cube Pets](https://kenney.nl/assets/cube-pets)

**Poly Pizza**
- It hosts a mix of **CC0 and CC-BY 4.0** models, so the license must be checked per model. CC-BY needs credit such as "[Title] by [User] (poly.pizza) CC-BY 4.0". — [poly-pizza-api skill doc (third-party, GitHub)](https://github.com/jasonkneen/tiny-world-builder/blob/main/.agents/skills/poly-pizza-api/SKILL.md)
- Example: the Quaternius Shiba Inu is listed as "Public Domain (CC0)", FBX/GLTF, "Animated", published 7 Sep 2021. The page shows no triangle count or clip names. — [Poly Pizza – Shiba Inu](https://poly.pizza/m/y4wdQpg767)

### Inferences
- **Player character**: KayKit Adventurers is chibi-proportioned and uses a tiny gradient atlas. Pairing it with the KayKit Character Animations (Rig_Medium) is the lowest-risk, zero-cost, CC0, glTF-native choice.
  - Idle, run, hit, cheer and wave-style clips are covered.
  - "Throw" and "command/point" may be missing and would need authoring (see Gaps).
- UAL1/UAL2 are an alternative clip source for the trainer, e.g. farming for a farm hub. They target a standard-proportion humanoid, so retargeting onto big-head chibi bodies may need arm offsets.
- **Animals**: Quaternius Ultimate Animated Animals look faceted and semi-realistic in proportion (not chibi), with only 12 species. It is useful for prototyping locomotion, not as final Hay Day-style art. This style judgement is my inference from the "LowPoly" branding; the CEO should look at them visually.
- Quaternius Cute Monsters (21) and Ultimate Monsters (50) are the closest CC0 match to "cute fantasy creature". Their clip sets look minimal (idle/walk/attack/hit/death), so faint, dizzy and capture must be added.
- Kenney Cube Pets suit a Crossy Road-like blocky style, not rounded Hay Day charm.

### Gaps
- Triangle counts, bone counts and exact clip names for Quaternius animals and monsters are not published. Whether Quaternius animals share one armature is also unknown. Verify by inspecting the glTFs.
- Whether KayKit's library contains "Throw" specifically is unverified; categories mention shooting, bows and spellcasting, not throwing.
- The KayKit animation count conflicts (133 vs 161); the itch page is newer.

---

## 2. Can one shared quadruped skeleton + animation library be retargeted across many species? Tools

### Takeaway
Yes, but there is **no free off-the-shelf "Universal Animation Library for quadrupeds"**. The proven approach is a small number of **body-type skeleton families**, each with one clip set: Game Freak does this for 1,000+ Pokémon and Monster Hunter does it for monsters. Blender Rigify and Auto-Rig Pro provide the quadruped rigs and the retargeting.

Mixamo and AccuRIG are humanoid-only. Meshy and Tripo auto-rig quadrupeds but offer only a **walk** preset for them. Anything World claims animal-aware animation, but at a high price. In three.js, clips can be shared directly between meshes that use **identical bone names**. SkeletonUtils retargeting between *different* skeletons is reported as unreliable.

### Cited Findings
- **Rigify** ships meta-rigs for Basic Human, Basic Quadruped, Human, Cat, Wolf and Horse:
  - "Wolf/Dog Meta-Rig" includes claws, face bones and a tail option.
  - Horse includes an IK neck.
  - The Add > Armature menu also has bird and shark templates.
  - [Blender Manual – Rigify (2.81)](https://docs.blender.org/manual/en/2.81/addons/rigging/rigify.html); [CGDive Rigify series](https://cgdive.com/rig-anything-with-rigify-chapter-3-the-prebuilt-metarigs-human-and-quadruped/)
- **Auto-Rig Pro** has rig presets for "human, quadruped, bird (with wings)" and "3 bones IK for quadrupedal, digitigrade creatures". Its Remap tool "allows retargetting of any armature action to another one, with different bone names and bone orientations". — [Superhive – Auto-Rig Pro](https://superhivemarket.com/products/auto-rig-pro)
  - The Remap docs add these details:
    - Works with "any type of armature (Auto-Rig Pro, Rigify, custom rig…)".
    - Auto-Scale, IK pole modes, and additive location tweaks help with different proportions.
    - "Multiple Source Anim" batch-retargets many actions.
    - Rest poses must match directionally; retargeting is "a picky technical process".
    - Built-in presets are humanoid (Mixamo, Rokoko, XSens).
    - [ARP Remap docs](https://www.lucky3d.fr/auto-rig-pro/doc/remap_doc.html)
- **AccuRIG** (Reallusion) is for "human and other types of bipedal characters", with "no plans to support quadruped" (forum). It is free on Windows and exports FBX/USD. — [Reallusion forum – Animals](https://forum.reallusion.com/523069/Animals); [CG Channel – AccuRig 2.0](https://www.cgchannel.com/2025/07/rig-and-animate-3d-characters-for-free-with-accurig-2-0/)
- **Mixamo**: "The auto-rigger and animation libraries are for bipedal humanoids only." — [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html) (via search snippet; the page returned 403 to the fetch tool)
- **Meshy** auto-rig "supports humanoid and quadruped characters". — [Meshy Docs – Rigging](https://docs.meshy.ai/en/webapp/guides/3d-model/rigging)
  - However: "Currently, **walking** is the only animation we support for quadrupeds." — [Meshy Help Center](https://help.meshy.ai/en/articles/16231707-how-to-create-3d-animation-with-auto-rigging)
  - Its library of 631 presets "are humanoid". — [Meshy Animation Library FAQ](https://www.meshy.ai/animation-library)
- **Tripo** Rig v2.5-20260210 supports biped, quadruped, hexapod, octopod, avian, serpentine and aquatic, with GLB/FBX output. — [Tripo Developers – Auto Rig](https://developers.tripo3d.ai/en/docs/animations-rig)
  - Retarget presets for v2.5: biped gets idle, walk, run, dive, climb, jump, slash, shoot, hurt, fall, turn. Quadruped gets **only `preset:quadruped:walk`**. Hexapod and octopod get walk; serpentine and aquatic get march.
  - v1.0 has 90+ presets, biped only.
  - [Tripo Developers – Animation Retarget](https://developers.tripo3d.ai/en/docs/animations-retarget)
- **Anything World ("Animate Anything")**: supports quadrupeds, insects, fish and birds. For a fantasy quadruped you name a similar species, e.g. "horse" for a unicorn, or "quadruped". Exports FBX/GLB/GLTF/DAE. — [Anything World Blender add-on manual](https://anything-world.gitbook.io/anything-world/animate-anything-3d-software-plugins/animate-anything-blender-add-on-manual); [CG Channel](https://www.cgchannel.com/2023/10/animate-anything-uses-ai-to-rig-your-3d-characters/)
  - Pricing (secondary snippet): MICRO $60/mo for 300 credits, PRO $260/mo for 1,500 credits, 5 credits per generate/rig/animate operation. — [Cinevva guide](https://app.cinevva.com/guides/free-character-animations-rigging) (unverified on the official page)
- **three.js**: models with identical bone names can reuse the same AnimationClip without retargeting. SkeletonUtils.retargetClip exists, but a maintainer-level forum post says "I was not able to get good results retargeting between two different models". — [three.js forum – Fixing SkeletonUtils retarget](https://discourse.threejs.org/t/fixing-skeletonutils-retarget-and-retargetclip-functions/65149); [three.js docs – SkeletonUtils](https://threejs.org/docs/pages/module-SkeletonUtils.html)
- **Prior art for morphology-independent animation**:
  - Spore (SIGGRAPH 2008) recorded animator motion "in a morphology-independent form" and applied it at runtime "using inverse kinematics". — [Hecker et al., SIGGRAPH 2008 (PDF)](https://www.chrishecker.com/images/c/cb/Sporeanim-siggraph08.pdf)
  - David Rosen (GDC 2014) built responsive characters with procedural techniques "using only 13 keyframes in total". — [GDC Vault – An Indie Approach to Procedural Animation](https://www.gdcvault.com/play/1020583/Animation-Bootcamp-An-Indie-Approach)
  - The Flame in the Flood (GDC 2017) produced indie quadruped locomotion "without the need for transition animations", using a rigid-spine boar and a procedural-spine wolf. — [Game Developer](https://www.gamedeveloper.com/art/video-animating-pups-boars-other-quadrupeds-in-i-the-flame-in-the-flood-i-); [GDC Vault](https://gdcvault.com/play/1023209/Animating-Quadruped-Characters-in-The)

### Inferences
- The practical design is 4–6 **families**:
  - quadruped-small (dogs, cats, pigs, sheep)
  - quadruped-large (cows, horses, bosses)
  - biped-bird (chicken)
  - blob/slime
  - flyer
  - biped-monster (reuse the humanoid rig)
- Each family gets one Rigify- or ARP-derived skeleton with **fixed bone names**, and one clip set: idle, walk, run, attack, hit, dizzy, faint, victory.
- Keep chibi proportions within a family close (big head, short legs). Then rotation-only clips can be shared in three.js by bone name with no runtime retargeting. When proportions diverge, e.g. a corgi vs a greyhound, bake per-species clips offline with ARP Remap.
- "Being captured" and much of "faint" can be **procedural in code**: shrink, spin, dissolve shader, tilt-and-roll, swapping eye textures. This removes one or two clips per species, following the Rosen/Spore spirit.
- AI auto-riggers are useful only to get a skinned quadruped mesh quickly. With walk-only presets they cannot deliver the 7-clip creature set.

### Gaps
- No free CC0 quadruped animation library with a documented universal quadruped skeleton was found (as of Sep 2026).
- Anything World's current pricing and license were not verified on an official page.

---

## 3. Mixamo: commercial license, humanoid-only, chibi fit

### Takeaway
Mixamo is free with an Adobe ID. Its characters and animations are royalty-free for commercial games, including web games. You may not redistribute the raw files as an asset pack. It is **bipedal-humanoid-only**, so it is useless for creatures but fine for the trainer. Big-head chibi bodies often need manual fixes such as arm clipping and rest-pose mismatches.

### Cited Findings
- "Mixamo is available free for anyone with an Adobe ID and does not require a subscription to Creative Cloud." — [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html) (via search snippet; direct fetch returned 403)
- "You can use both characters and animations royalty free for personal, commercial, and non-profit projects, including creating video games." — [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)
- Restriction: you cannot create "asset packages for video game engines which redistribute character or animation raw files as the product", nor sell them on stock or asset stores. — [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)
- "The auto-rigger and animation libraries are for bipedal humanoids only." — [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)
- On stylized proportions (secondary): highly stylized proportions "often produce wonky results" and "require manual rigging adjustments". Arm clipping is usually a rest-pose mismatch. — [Cinevva guide (2026)](https://app.cinevva.com/guides/free-character-animations-rigging)
- Meshy's auto-rig uses Mixamo bone naming, so Meshy-rigged humanoids accept Mixamo clips. — [Meshy – AI Auto Rigging](https://www.meshy.ai/features/ai-auto-rigging)

### Inferences
- For the trainer, Mixamo is a legitimate *supplement* for clips KayKit/UAL lack (e.g. throw, point/command, celebrate), baked into the game's GLB. Retarget it onto the chibi rig in Blender and fix arm offsets there. Do not retarget at runtime.
- Web delivery serves GLB files that users could technically download. The FAQ forbids redistributing raw files "as the product", not shipping them inside a game. The risk is low but not zero, so keep the files packed and compressed.

### Gaps
- I could not load the Adobe FAQ page directly (403). The quotes are from Adobe's page as surfaced in search snippets; re-check the live page before relying on them.
- No Adobe statement was found about Mixamo's long-term service continuity in 2026.

---

## 4. AI 3D generation + auto-rig/animation (Meshy, Tripo, Rodin, Hunyuan3D, Sloyd, Kaedim)

### Takeaway
AI generators can produce cute creature **meshes** cheaply (roughly $0.20–$0.35 of credits per model on Meshy/Tripo APIs). **Paid** plans give commercial ownership. Low-poly remeshing to about 3k faces is supported.

However:
- **No tool delivers the quadruped animation set**: Meshy and Tripo offer only walk for quadrupeds.
- Keeping a consistent style across dozens of species depends on feeding **style-locked 2D concept art** into image-to-3D.
- Free tiers are unsuitable: they carry CC BY attribution, public visibility, or no commercial use (Tripo).
- Purely AI-generated outputs likely aren't copyrightable in the US, so "ownership" means contractual rights, not exclusivity.

### Cited Findings
**Meshy**
- Terms (last updated 19 Sep 2026):
  - Free plan: Meshy "owns all right, title, and interest" in output and licenses it under **CC BY 4.0**.
  - Paid plans: customers "own their Customer Output", with Meshy keeping a non-exclusive license.
  - Meshy may use non-Enterprise content to "train, validate, test, or improve Services".
  - Minimum age is 14; users under 18 need guardian permission.
  - [Meshy Terms of Use](https://www.meshy.ai/terms-of-use)
- Plans (Help Center):

  | Plan | Price | Credits/mo | Notes |
  |---|---|---|---|
  | Free | $0 | 100 | CC BY 4.0, no download, no API |
  | Pro | $20/mo | 1,000 | API, unlimited downloads |
  | Premium | $40/mo | 3,000 | |
  | Ultra | $100/mo | 8,000 | |
  | Studio | $70/seat | | team plan |

  Free gets 20 animation presets; paid gets 600+. — [Meshy Help – plans](https://help.meshy.ai/en/articles/12062933-meshy-pricing-plans-free-pro-studio-enterprise); [Meshy Pricing](https://www.meshy.ai/pricing)
- API credit costs:
  - Text-to-3D preview: 20 (meshy-6/7.1) or 5 (lite)
  - Image-to-3D: 20–35
  - Texture: 10 (2K/4K) or 15 (8K)
  - Remesh: 5
  - Rigging: 5
  - Animation: 3 per action
  - [Meshy API Pricing](https://docs.meshy.ai/en/api/pricing)
- Remesh presets are 3K/10K/30K/100K faces, a custom target "as low as 100 faces", or adaptive, with triangle or quad output. Meshy's own guidance is "under ~10K for mobile". — [Meshy Remesh docs](https://docs.meshy.ai/en/webapp/guides/3d-model/remesh) (via search snippet)
- The quadruped limitation (walk only) is covered in §2. — [Meshy Help](https://help.meshy.ai/en/articles/16231707-how-to-create-3d-animation-with-auto-rigging)

**Tripo**
- API: "1 credit = $0.01".
  - Text-to-3D: 10–20 credits. Image-to-3D: 20–30.
  - Smart retopology v2: 30. Basic: 10.
  - Auto Rig: 25. Animation Retarget: 10 per animation. Rig Check: free.
  - [Tripo Developers – Pricing](https://developers.tripo3d.ai/en/pricing)
  - Minor conflict: the Auto Rig doc example shows 30 credits. — [Tripo Auto Rig doc](https://developers.tripo3d.ai/en/docs/animations-rig)
- Web plans (secondary; the official pricing page returned 403):
  - Free: 300 credits, **no commercial use**, public models.
  - Pro: $19.90/mo, 3,000 credits, commercial rights.
  - Max: $89.90/mo. Team: $109.90/mo.
  - Sources disagree on Free credits (200 vs 300) and on whether Free output is CC BY or non-commercial.
  - [Costbench](https://costbench.com/software/ai-3d-generation/tripo-ai/); [aifreeapi summary](https://www.aifreeapi.com/en/posts/tripo-3d)
- Rig v2.5 types and the quadruped walk-only preset are covered in §2. — [Tripo – Animation Retarget](https://developers.tripo3d.ai/en/docs/animations-retarget)

**Hyper3D Rodin (Deemos)**
- Plans:
  - Creator: $30/mo ($24 billed annually), about 60 models/mo, "Unlimited export and any use".
  - Business: $120/mo ($96 annually), about 416 models/mo, full API, high-poly quads.
  - Credits outside a subscription: $1.5 each.
  - Enterprise includes custom LoRA fine-tuning and "AI+Artist support".
  - [Hyper3D Pricing](https://hyper3d.ai/pricing)
- A secondary source says Deemos licenses training data commercially, including a Shutterstock 3D agreement. — [makerstack review (secondary)](https://makerstack.co/reviews/hyper3d-rodin-review/)

**Tencent Hunyuan3D (open weights)**
- The license **excludes the EU, UK and South Korea**. Vietnam is inside the Territory.
- "Tencent claims no rights in Outputs You generate".
- More than 1M MAU requires a separate license.
- You may not use outputs "to improve any other AI model".
- [Hunyuan3D-2 LICENSE](https://github.com/Tencent-Hunyuan/Hunyuan3D-2/blob/main/LICENSE)

**Sloyd**
- Plus: $15/mo ($12.50 billed annually), "unlimited" text/image-to-3D under fair use, AI rigging, commercial license.
- Pro: $50/mo, adds 4K textures and 60 credits.
- You can set a target polycount and choose quad or triangle output. — [Sloyd blog – pricing](https://www.sloyd.ai/blog/ai-3d-model-generator-pricing); [Sloyd Pricing](https://www.sloyd.ai/pricing)
- A reference image can be saved as a reusable "style" for consistency. — [Sloyd – style consistency](https://www.sloyd.ai/blog/how-to-style-consistent)

**Kaedim**
- AI output is refined by in-house artists. Turnaround is days. Pricing is reported from about $300/mo up to $1,000+/mo, contract-based, with no self-serve. — [Toosio review (secondary)](https://toosio.com/tool/kaedim-3d-modeling-review); [aitoolsatlas (secondary)](https://aitoolsatlas.ai/tools/kaedim-3d/review)

**Style consistency**
- Recommended practice is two-stage: train or lock style in a 2D model (e.g. Scenario), then feed those concepts to image-to-3D. Clean silhouettes and even lighting matter. — [Meshy blog – best AI tools](https://www.meshy.ai/blog/best-ai-tools-for-3d-game-assets); [Tripo blog – concept art to 3D](https://www.tripo3d.ai/blog/convert-concept-art-into-a-3d-game-asset-with)

**Shipping usage (vendor-reported, treat as marketing)**
- 37 Interactive Entertainment used Meshy image-to-3D to "cut game asset modeling time by 50%" for character and creature production.
- Indie horror game *Famished* used Meshy.
- [Meshy use cases](https://www.meshy.ai/use-cases); [Meshy blog – Famished](https://www.meshy.ai/blog/3d-horror-game-assets-creation-for-famished)

**Copyright**
- The USCO Part 2 report (29 Jan 2025) says works "entirely generated by AI are not copyrightable" and that prompts alone are insufficient. Human modifications, selection and arrangement can be protected. — [Mintz summary](https://www.mintz.com/insights-center/viewpoints/54731/2025-02-07-us-copyright-office-publishes-second-part-report-ai); [Copyright Alliance](https://copyrightalliance.org/ai-report-part-2-copyrightability/)

### Inferences
- At 20–35 credits per model plus 5 remesh, one Meshy Pro month (1,000 credits) covers about 25 finished creature meshes including retries. On Tripo's API, one creature mesh costs about $0.30–$0.60.
- Cost is not the constraint. **Art direction and rigging are.**
- Recommended AI use:
  1. Generate a consistent 2D sheet for every species first.
  2. Run image-to-3D on a paid plan.
  3. Remesh to about 2–5k triangles.
  4. Bake the texture to a small palette.
  5. **Skin manually to the family skeleton** (§2) instead of using the AI auto-rig clips.
- Enterprise or paid tiers are needed to avoid Meshy training on inputs, if that matters. Meshy trains on all non-Enterprise content.
- Hand-editing each AI mesh (proportions, eyes, palette) also strengthens copyright claims.

### Gaps
- No public, independently verified post-mortem of a shipped *creature-collector* built mainly from AI-generated creatures was found.
- The quality of quadruped auto-rig skin weights on chibi shapes was not independently benchmarked.
- Hunyuan3D's hosted-service pricing was not checked.
- Tripo's official web-plan terms were not directly accessible (403).

---

## 5. Asset stores for stylized cute monsters/animals and license portability to a non-Unity web game

### Takeaway
There are strong **paid** cute-animal and cute-monster packs:
- **Omabuarts Quirky Series**: 180 rounded animals, 17–18 clips including Hit, Death and Fear, a 16×4 px palette texture, and LODs from 300 to 9k tris.
- **Meshtint Cute Series**: Pokémon-like monsters with 3 evolutions.
- **Dungeon Mason RPG Monster** packs: about 1k tris, 15 clips including *dizzy* and *victory*.
- CGTrader breed packs such as "Toon Dogs".

Unity Asset Store and Fab Standard licenses do not tie use to one engine. All store licenses (Unity, Fab, CGTrader) require assets to be *incorporated* and not extractable as standalone files. In a web game this means packing and compressing GLBs and never exposing an asset browser.

### Cited Findings
- **Omabuarts – Quirky Series Animals ULTIMATE**:
  - 180 animals across Arctic, Farm, Forest, Pets, Safari, Desert, Island, Jungle, River and Sea volumes.
  - Clips: Attack, Bounce, Clicked, Death, Eat, Fear, Fly, Hit, Idle_A/B/C, Jump, Roll, Run, Sit, Spin/Splash, Swim, Walk.
  - Rigged, "Tiny 16x4 px texture", "4 LOD [between 300-9,000 tris]", 26 blendshapes for facial expression, "No generative AI was used".
  - $299 minimum, 511 MB.
  - **The itch page states no license terms.**
  - [itch.io – Quirky Ultimate](https://omabuarts.itch.io/quirky-series-animals-ultimate-pack)
- **Quirky Series FREE Animals**: 45 animals (Colobus, Gecko, Herring, Muskrat, Pudu, Sparrow, Squid, Taipan…), with the same 18-clip set and specs. Commenters asked "What are the License?" and got no public reply. — [itch.io – Quirky FREE](https://omabuarts.itch.io/quirky-series-free-animals)
- **Meshtint "Cute Series"**:
  - Most monsters have "3 evolution forms". It is marketed for "games like Pokemon… educational games".
  - Characters are "humanoid mecanim ready", with 17+ animations per model.
  - Monsters Ultimate Pack 01 costs $139.99 on the Unity Asset Store under the "Standard Unity Asset Store EULA", single entity, as an "Extension Asset".
  - [Unity Asset Store – Monsters Ultimate Pack 01](https://assetstore.unity.com/packages/3d/characters/creatures/monsters-ultimate-pack-01-cute-series-167028); [Meshtint store listing](https://www.meshtint.com/pages/all-series-list-on-unity-asset-store) (search snippet)
- **Dungeon Mason – RPG Monster Duo PBR Polyart** (free):
  - Slime is 1,009 tris; Turtle Shell is 1,021 tris.
  - "15 animations each": idle ×2, attack ×2, die, **dizzy**, GetHit, sense-something, taunt, **victory**, 4-way walk, run, defend.
  - Sibling packs: Monster Wave, Monster Partners, Monster Couple.
  - [Unity Asset Store – RPG Monster Duo](https://assetstore.unity.com/packages/3d/characters/creatures/rpg-monster-duo-pbr-polyart-157762) (search snippet)
- **CGTrader "Toon Dogs Pack"** (secondary; the page did not load):
  - Breeds include Akita, Beagle, Border Collie, Corgi, Dalmatian, Golden Retriever, Husky, Pug, Shiba Inu and others.
  - 11,000–13,000 tris and **54–57 bones**, with mobile versions at 3,000–4,000 tris.
  - [CGTrader – Toon Dogs Pack](https://www.cgtrader.com/3d-models/animal/mammal/toon-dogs-pack) (search snippet)
- Very low-poly single breeds exist: Studio Ochi "Low Poly Corgi" at 599 faces and a Shiba pack at 642 faces each. — [Sketchfab Store – Corgi](https://sketchfab.com/3d-models/low-poly-corgi-dog-98a3af587dc3426bbb765d7655e00030)
- **Unity Asset Store EULA FAQ**:
  - Commercial use is fine when "the asset is embedded and integrated into your game".
  - Single-entity vs multi-entity: multi-entity covers "independent contractors that your team is supervising".
  - Extension assets need a seat per person.
  - "A product is not 'incorporated'… if it is designed to allow your end users to extract or download assets separately."
  - [Unity Asset Store EULA FAQ](https://assetstore.unity.com/browse/eula-faq)
- The Unity EULA "does not specify that you need to use Unity". "Restricted Assets" carry special terms. — [GameFromScratch](https://gamefromscratch.com/using-asset-store-assets-in-other-engines-is-it-legal/)
- **Fab**:
  - The Standard License "enables you to use the assets… in any game engine or tool you want".
  - Personal tier is for buyers with ≤$100,000 gross revenue in the past 12 months; Professional is above that.
  - Some free assets use CC-BY.
  - [Unreal Engine blog – Fab launch](https://www.unrealengine.com/en-US/blog/fab-epics-new-unified-content-marketplace-launches-today); [Fab docs – Licenses and Pricing](https://dev.epicgames.com/documentation/en-us/fab/licenses-and-pricing-in-fab)
- **CGTrader Royalty Free** (via search snippet; the help page returned 403):
  - The model must be incorporated so that "third parties cannot retrieve it". For games you must take "reasonable measures to prevent end users from accessing" it.
  - No sale as in-game items or mod-kits.
  - [CGTrader Help – Royalty Free License](https://help.cgtrader.com/hc/en-us/articles/360015124437-Royalty-Free-License)

### Inferences
- **Style fit ranking for "Hay Day-like cute"** (my visual inference from descriptions; needs CEO review):
  1. Omabuarts Quirky: rounded, big-eyed, huge species range, tiny palette texture, LODs, and a clip set with Fear/Hit/Death that maps to "scared while being captured".
  2. Meshtint Cute Series: evolutions suit fantasy creatures.
  3. Dungeon Mason: bosses and monsters with dizzy and victory clips.
  4. Quaternius Cute Monsters: CC0 fallback.
- Portability: Unity and Fab Standard licenses are engine-agnostic. The real risk in a *browser* game is that GLBs are downloadable by URL.
  - Ship meshopt/Draco-compressed GLBs bundled or packed behind app auth.
  - Never offer a model viewer or download.
  - Buy **multi-entity** or Professional tiers if contractors touch the files, or if company revenue exceeds $100k on Fab.
- Omabuarts' license must be confirmed by email or by buying through Unity or Fab, where the store's standard license applies, before it is used in a paid product.
- The 54–57-bone breed packs are heavy for iPad at 10+ on screen. Use their mobile versions or re-rig to a lighter family skeleton.

### Gaps
- Official license text for Omabuarts' direct and itch sales was not found.
- Current prices and animation lists for Meshtint and Dungeon Mason came from search snippets; confirm on the store pages.
- The Fab EULA page returned 403; the extraction clause wording was not verified.

---

## 6. How Pokémon and Palworld handle creature rigs/animations at scale

### Takeaway
**Pokémon (Game Freak, CEDEC 2022)** documents the model to copy:
- one delivery spec with a **standard material and a base skeleton**
- Pokémon grouped into **body-type "molds"** (humanoid, dog/cat, snake, dragon…)
- an in-house **motion-copy tool** that maps bone-to-bone, compensates for size, and retargets when bone structures differ slightly
- in-house mocap for species with no precedent

Monster Hunter uses the same "skeleton = body type" idea. **Palworld's** rig approach is not publicly documented beyond a paywalled CGWORLD feature. Modders report that Pals use distinct skeletons that aren't interchangeable.

### Cited Findings
- **Game Freak's CEDEC 2022 talk** was given by Keiichi Maezawa, CG technology director. Title: "Making two Pokémon games at once: the Pokémon model production environment" (Legends Arceus + Scarlet/Violet). — [CEDEC 2022 session page](https://cedec.cesa.or.jp/2022/session/detail/61.html)
  - Report of the talk: more than 1,000 species. Models are produced once to a unified delivery spec with "標準マテリアル" (standard material) and "基本骨格" (base skeleton); each title then post-processes for its own look. — [Denfaminicogamer report](https://news.denfaminicogamer.jp/kikakuthetower/220825t)
  - Pokémon are grouped as "人型 / 犬猫型 / ヘビ型 / ドラゴン型" (humanoid / dog-cat / snake / dragon) to enable "モーションコピー" (motion copy). This is done by "骨と骨をマッピングして同じ部位に該当するものをコピー", i.e. mapping bone to bone and copying equivalent parts. QA combines automatic validation and manual review, including polygon density at stress points such as ears and hips. — [Denfaminicogamer report](https://news.denfaminicogamer.jp/kikakuthetower/220825t)
  - Famitsu adds that the motion-copy tool automatically compensates for size differences and retargets when bone structures differ slightly. For species without precedent they used in-house motion capture to establish reference movement quickly. — [Famitsu report](https://www.famitsu.com/news/202208/27273621.html)
  - The English summary uses "moulds" such as "a snake-like, a dragon-like, a dog or cat-like, etc to copy the motion from one to another". — [GoNintendo](https://gonintendo.com/contents/8412-game-freak-at-cedec-2022-concept-art-character-models-game-development-and-more)
- **Pokémon Sword/Shield**: Masuda and Ohmori said models were rebuilt for Switch "with higher quality animations". Fans found some animations reused from 3DS titles, which caused backlash. — [Nintendo Life](https://www.nintendolife.com/news/2019/07/weve_re-translated_that_pokemon_sword_and_shield_interview_quote); [GameRevolution](https://www.gamerevolution.com/news/615992-pokemon-sword-and-shield-reused-models-results-in-huge-backlash)
- **Palworld**:
  - CGWORLD vol.312 (Aug 2024) has a 14-page feature on Pal production covering design, modeling, rig and motion. Details are in the paid issue only. — [CGWORLD vol.312](https://cgworld.jp/magazine/cgw312.html); [CGWORLD announcement](https://cgworld.jp/flashnews/cgw312-pr.html)
  - Pocketpair hired a self-taught 20-year-old hobbyist, found via X, for weapon animations. — [PC Gamer](https://www.pcgamer.com/palworld-struggled-to-find-a-dev-with-shooter-experience-in-japan-before-stumbling-on-a-self-taught-hobbyist-who-worked-at-a-convenience-store/); [80.lv](https://80.lv/articles/palworld-s-weapon-animations-were-made-by-convenience-store-worker)
  - A modding-framework author says putting meshes onto "incompatible Pals/NPCs that use different skeletons will completely break animations". This implies per-Pal (or per-group) skeletons in UE5. — [Nexus Mods – Altermatic](https://www.nexusmods.com/palworld/mods/1626)
- **Monster Hunter** (secondary wiki): monsters are built on a "single skeleton classified into a specific species" because dedicated skeletons for every monster would be too expensive. Monsters on the same skeleton "share rigid/attack motions", and animations become templates per skeleton. — [NamuWiki – Skeleton (Monster Hunter)](https://en.namu.wiki/w/%EA%B3%A8%EA%B2%A9(%EB%AA%AC%EC%8A%A4%ED%84%B0%20%ED%97%8C%ED%84%B0%20%EC%8B%9C%EB%A6%AC%EC%A6%88))

### Inferences
- This supports the family-skeleton plan in §2. Even a 1,000-species AAA pipeline standardizes a base skeleton per body type and copies motion by bone mapping. A small team should do the same with 4–6 families and a fixed bone-naming convention, so clips can be shared.
- Variety comes from mesh, colour, scale, a few unique signature clips per species or boss, and procedural layers (bounce, squash-stretch, look-at). Not from a unique rig per species.

### Gaps
- No English or Japanese free-to-read source details Palworld's skeleton families or animation reuse. The CGWORLD issue is paywalled.
- There is no official Monster Hunter developer quote in these sources, only a secondary wiki.
- There are no bone counts per Pokémon family.

---

## 7. Performance budget for iPad 7th gen and recommended sourcing pipeline

### Takeaway
Budget roughly **≤3–5k triangles, ≤40–60 bones, 1 material, tiny palette textures** per creature, and keep draw calls low.

The recommended pipeline:
1. A CC0 KayKit (or Quaternius UAL-rigged) chibi trainer.
2. 4–6 in-house **family skeletons**, each with one authored clip set.
3. Creature meshes sourced from paid cute packs (Quirky, Meshtint) and/or style-locked AI image-to-3D on paid plans.
4. All meshes skinned to the family skeletons in Blender.
5. "Capture" and "faint" done procedurally in code.

### Cited Findings
- Mobile guidance (secondary, lower-quality sources):
  - A mobile character should "ideally have fewer than 60 bones".
  - WebGL `MAX_VERTEX_UNIFORM_VECTORS` can be 256–512 on mobile GPUs, with a float-texture fallback for bones.
  - Keep draw calls "under 50" on mobile, at roughly 0.1 ms CPU each.
  - [technetexperts – R3F SkinnedMesh mobile](https://www.technetexperts.com/react-three-fiber-skinnedmesh-mobile-fix/); [Three.js Roadmap – Draw calls](https://threejsroadmap.com/blog/draw-calls-the-silent-killer)
- Meshy's guidance: "under ~10K [faces] for mobile"; NPC about 10K, prop about 3K. Remesh can target 3K or lower. — [Meshy Remesh docs](https://docs.meshy.ai/en/webapp/guides/3d-model/remesh) (search snippet)
- Palette-texture precedents are very light on memory: the KayKit 1024² gradient atlas can be downsampled to 128², and Omabuarts uses a 16×4 px texture. — [KayKit Adventurers](https://kaylousberg.itch.io/kaykit-adventurers); [Quirky Ultimate](https://omabuarts.itch.io/quirky-series-animals-ultimate-pack)
- Low-poly cute monster reference points: about 1,000 tris (Dungeon Mason slime/turtle); 300–9,000 tris across 4 LODs (Quirky). — [Unity Asset Store – RPG Monster Duo](https://assetstore.unity.com/packages/3d/characters/creatures/rpg-monster-duo-pbr-polyart-157762); [Quirky Ultimate](https://omabuarts.itch.io/quirky-series-animals-ultimate-pack)
- Identical bone names let three.js reuse clips across meshes. — [three.js forum](https://discourse.threejs.org/t/fixing-skeletonutils-retarget-and-retargetclip-functions/65149)

### Inferences (recommended pipeline — CTO proposal, not verified by a shipped example)

**1. Trainer (week 1, $0)**
- KayKit Adventurers base (chibi, CC0, glTF, gradient atlas) + KayKit Character Animations (Rig_Medium): idle, run, hit, cheer, wave.
- Missing "throw" and "command/point" clips: author them in Blender or take them from Mixamo. Mixamo is royalty-free in games, but don't redistribute the raw files. Retarget offline with ARP Remap.
- Alternative: Quaternius Universal Base Characters + UAL1/UAL2, which add farming and fishing for a farm hub.

**2. Creature skeleton families (in-house, one-off cost)**
Following Game Freak's "mold" approach, build these in Blender from Rigify or ARP quadruped/bird presets, simplified to about 25–40 bones with a **fixed bone-name convention**:
- A: quadruped-small (dogs, cats, pig, sheep)
- B: quadruped-large (cow, horse, bosses)
- C: bird-biped (chicken)
- D: blob/slime
- E: flyer
- F: humanoid-monster (reuse the KayKit or UAL rig)

Author one clip set per family: idle, walk, run, attack, hit, dizzy, faint, victory, and "struggle" for capture. Keep proportions within a family near-uniform (chibi) so clips play by bone name. For outliers, bake clips per species offline with ARP Remap rather than retargeting at runtime.

**3. Procedural layer in code**
Capture (shrink + spin + dissolve), faint (tilt + roll + "X" eyes texture swap), squash-and-stretch on landing, and look-at head turn. This removes per-species clip needs, in the spirit of Rosen and Spore.

**4. Mesh sourcing, in priority order**
- (a) **Omabuarts Quirky Series** for farm, pets and wild animals, *after confirming its license*. It is the best style match for Hay Day charm and has about 180 species. Keep its meshes but consider re-skinning to your family skeletons so all species share clips. Its own 18 clips can also be used directly if they share a rig across species (verify).
- (b) **Meshtint Cute Series** for fantasy creatures with 3-stage evolutions, and **Dungeon Mason** for monsters and bosses. Buy multi-entity if contractors are involved.
- (c) **AI for the long tail and new species**: a style-locked 2D sheet (one prompt template, same palette and eye style) → Meshy Pro ($20/mo) or the Tripo API (about $0.01/credit) image-to-3D → remesh to 2–5k tris → palette-bake → manual skinning to the family skeleton. Do not rely on the AI auto-rig clips: quadrupeds get walk only.
- (d) **CC0 fallback and prototypes**: Quaternius Cute and Ultimate Monsters, Ultimate Animated Animals, Kenney Cube Pets.

**5. Export and licensing hygiene**
- Export glTF with meshopt or Draco, KTX2 or tiny PNG palettes, one material per creature.
- Keep a license ledger per asset: source, license, tier, entity/seat.
- Prefer CC0 and paid-plan AI outputs. Avoid free-tier AI outputs (CC BY attribution, Meshy ownership, Tripo non-commercial).
- Serve GLBs packed and behind app auth to satisfy the "not extractable" clauses of the Unity, Fab and CGTrader licenses.

**6. Budgets to test on the real iPad 7th gen**
- Per creature: ≤5k tris at LOD0 and ≤1.5k at LOD1, ≤40 bones, one texture ≤256² (palette).
- Aim for ≤8–12 animated creatures on screen, with frustum-cull and LOD. Bosses ≤15k tris.
- These are my targets derived from the sources above; benchmark them early.

### Gaps
- There are no authoritative, device-specific WebGL benchmarks for skinned meshes on the A10 iPad. The bone and draw-call numbers above come from low-authority blogs.
- It is unverified whether the Omabuarts Quirky animals share one skeleton across species. This decides whether its 18 clips are reusable as-is.
- Time and cost of an in-house family-skeleton clip set (about 9 clips × 6 families) was not estimated from sources.
