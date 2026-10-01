# Core loops & retention features of creature-collecting / MMO-lite games (for an incremental kid/teen browser build, Oct 2026)

Scope note: research done 01/10/2026 with ~20 web searches/fetches. Evidence quality varies: hard numbers come from Sensor Tower, Amplitude, Wikipedia (sourced), Alinea Analytics, a 2024 Journal of Consumer Research study; design descriptions of Roblox/Palworld loops come mostly from secondary analysis blogs (flagged). No GDC Vault talk transcripts or Deconstructor of Fun / Naavik pieces were successfully retrieved in this pass (see Gaps).

## 1. Core loop anatomy — what is the minimal fun loop?

### Takeaway
Every successful title in this space runs a short, loud "action → loot → upgrade → harder target" loop where the creature is both the reward and the tool for the next step (Palworld: pals = workers + gear unlock; Monster Hunter: monster parts = gear; Pet Sim 99: pets = damage on bigger chests). The minimal fun loop is **catch (with a moment of uncertainty) → it makes you stronger/opens something → reach a new creature/boss**; collection display and social show-off are the layers that turn that loop into long-term retention.

### Cited Findings
- **Palworld loop:** catch a Pal → build base → mine ore → craft better sphere → go catch rarer Pal that drops better loot — [COGconnected, 2026](https://cogconnected.com/2026/07/why-palworlds-loot-loop-is-so-satisfying/). The catch itself works because "the gap between actions is short and the feedback is loud": sphere wobbles, half-second of uncertainty, click on lock — [same](https://cogconnected.com/2026/07/why-palworlds-loot-loop-is-so-satisfying/).
- Palworld's progression is self-reinforcing: to explore further you need gear, gear needs base/levels, which are earned "predominately by capturing pals"; pals assigned to base automatically do jobs matching their proficiencies, so a player reaches "a little base with pals taking care of the simple stuff within 30 minutes of playing" — [Game Developer, "Lessons learned from Palworld's success"](https://www.gamedeveloper.com/design/the-lessons-learned-from-palworld-s-success). Article stresses accessibility (immediate gratification vs. Rust-style grind) and a hook pitch understood in seconds ("Pokémon with guns") — [same](https://www.gamedeveloper.com/design/the-lessons-learned-from-palworld-s-success).
- Palworld scale: ~30.5M units sold, ~$700M gross software revenue, ~40M total players; post-1.0 weekend ~3.7M DAU; on Steam 20% of owners played 100+ hours, but on Xbox only 8% crossed 100h and 50% stopped under 5h — [Alinea Analytics](https://alineaanalytics.substack.com/p/palworld-10-pushes-the-hit-over-30m). (Caveat: the date of 1.0 in my extraction of that article was unclear/possibly mis-extracted; treat the date as unverified, numbers as Alinea estimates.)
- **Monster Hunter loop:** accept quest → study monster → fight → gather/carve parts (breaking claws/horns/tail raises part drops) → craft weapons/armor at smithy → higher-rank quests unlock → harder monsters. Difficulty scales through gear — [vsquad.art core-loop explainer](https://vsquad.art/blog/what-gameplay-loop-types-core-loops-explained); [Wikipedia: Monster Hunter](https://en.wikipedia.org/wiki/Monster_Hunter).
- **Pet Simulator 99 (Roblox):** pets hit a chest → coins → buy egg → hatch slightly better pet → hit bigger chest; first tap-to-reward cycle fits in 15–20 s. Layered loops: eggs, prestige (Rebirth), hatch luck, achievements, trading, seasonal events; claimed day-30 drop-off "unusually flat" — [Game-Ace Roblox simulator guide](https://game-ace.com/blog/roblox-simulation-games/) (B2B vendor blog, no raw data shown — treat as opinion). Rebirth = prestige that unlocks features/rewards — [Pet Sim fandom wiki](https://pet-simulator.fandom.com/wiki/Rebirth_(Pet_Simulator_99)).
- Same source: a 9–13-year-old "can land in Pet Simulator 99, understand the goal without a tutorial, and feel measurable progress in a single short session"; best simulators layer 3–4 interlocking loops (collection, upgrade, prestige, trading) so a 5-minute login always finds one loop that "just rolled over" — [Game-Ace](https://game-ace.com/blog/roblox-simulation-games/).
- **Adopt Me! (Roblox):** launched 13 Jul 2017 as family roleplay (adopt children); the pivot that caused explosive growth was **pets hatched from eggs + rarity tiers + trading (summer 2019)**. Growth: 3B plays Dec 2019 → 680k CCU Apr 2020 → 10B plays Jul 2020 → 1.92M peak CCU Apr 2021 → ~160k avg CCU Sep 2022 → 40.8B visits Nov 2025. Studio ~40 people, ~$60M/yr — [Wikipedia: Adopt Me!](https://en.wikipedia.org/wiki/Adopt_Me!).
- Adopt Me! **Neon** mechanic: 4 fully grown pets of the same kind merge into a Neon; 4 Neons → Mega-Neon (a fusion/upgrade sink that turns duplicates into progress) — [Wikipedia](https://en.wikipedia.org/wiki/Adopt_Me!) / [Roblox fandom](https://roblox.fandom.com/wiki/Uplift_Games/Adopt_Me!).
- **Play Together (Haegin; VNG publishes in Vietnam since 30 Jun 2022):** social village game — knockout mini-games, home parties, fishing, school life, camping, pet raising, avatar customization, home decoration. By Aug 2021: 30M downloads and 4M daily players; later 103M+ players worldwide with "nearly 20%" from Vietnam — [LinkedIn case study](https://www.linkedin.com/pulse/from-zero-hero-get-inspired-how-korean-game-play-together-succeed); [Haegin hub](https://hub.playtogether.haegin.kr/homegame-guide/whats-the-play-together) (LinkedIn is a secondary source; numbers not independently verified).
- **Genshin daily loop:** 4 Daily Commissions (10 Primogems each + 10 bonus = 50/day) + spend Resin (stamina-like resource, regenerates, caps ~200) on domains/bosses; typical daily routine ≈ 15 minutes — [HoYoLAB guide](https://www.hoyolab.com/article/35566777); [Boostroom daily routine](https://boostroom.com/blog/genshin-impact-daily-routine-guide-what-to-do-every-day) (secondary).

### Inferences
- Minimal fun loop for BK (MVP): **encounter → weaken (element matchup) → throw ball with a visible wobble/uncertainty beat → creature added to a visible dex → creature levels/evolves → beats a boss that was previously too hard.** The "catch moment" juice (wobble, sound, click) is cheap and is what multiple analyses single out — invest there before breadth.
- The creature must be *useful* (power for the next target), not just a trophy — this is the common thread of Palworld, MH and Pet Sim. A boss arena that requires the right elements gives the dex a functional purpose.
- Adopt Me's history suggests the pet/egg/rarity/trading layer was worth more than the original roleplay content — collection + social exchange is the growth engine for kids.
- Play Together's VN popularity indicates VN kids value a *social hangout* (mini-games, avatar, decorating) as much as combat — a "town square" with avatars and pets is plausibly high-value for the local audience.
- A 10–20 min/day target is in line with Genshin's ~15 min daily routine — so a daily checklist of 3–4 short tasks + a capped energy/attempt budget is a proven format.

### Gaps
- No primary loop breakdowns found (in this pass) for Pokémon main series, Temtem's loop, Creatures of Sonaria, or Pokémon GO's moment-to-moment loop beyond raids/trading; no GDC talk retrieved.
- Pet Sim 99 retention claim (flat D30) has no published figure.

## 2. Collection psychology — dex, rarity, shiny, evolution, fusion, trading

### Takeaway
Completion pressure is strongest when the set is **clearly structured and close to complete** (peer-reviewed, including a Genshin experiment); for kids, **rarity as social capital + trading** is the documented long-term driver in the biggest Roblox pet games, and duplicate-merge mechanics (Neon) turn repetition into progress. Fusion/combination multiplies content cheaply (Cassette Beasts).

### Cited Findings
- Reimann, Brucks & Cao, *Journal of Consumer Research* (2024): collecting is driven by desire for control/structure; in a Genshin Impact study players were more motivated to keep collecting when the character set was **nearly complete and the collection structure was clear**; high desire-for-control people were willing to spend more time/money to complete — [University of Arizona news](https://news.arizona.edu/news/why-do-we-collect-u-study-shows-its-about-seeking-structure).
- For kids, owning rare pets (e.g., Shadow/Frost Dragon) is "social capital" — showing up with a Mega Neon "is the digital equivalent of wearing the trendiest sneakers to school" — [ScreenWise parent guide](https://screenwiseapp.com/guides/adopt-me) (opinion source).
- Adopt Me! has evolved into a trading economy where "the real game" is collecting rare pets and trading up — [ScreenWise](https://screenwiseapp.com/guides/parent-s-guide-to-roblox-adopt-me); [Financial Pipeline](https://www.financialpipeline.com/this-roblox-game-is-teaching-kids-about-the-markets/).
- Trading has real harm for kids: by 2021 scams ("trust trades") were endemic; Uplift added trade licenses and fraud detection in Nov 2020 — [Wikipedia: Adopt Me!](https://en.wikipedia.org/wiki/Adopt_Me!).
- Pokémon GO's June 2018 **friends + trading** update: average spend $2.5M/day after the 19 Jun update, +39% vs prior two months; >113M friendships formed and >2.2B gifts exchanged — [Sensor Tower](https://sensortower.com/blog/pokemon-go-daily-revenue); [Variety](https://variety.com/2018/gaming/news/pokemon-go-daily-revenue-sensor-tower-1202919174/). Activity up 35% since May 2018 — [Variety](https://variety.com/2018/gaming/news/pokemon-go-activity-increase-1202936669/).
- Cassette Beasts fusion: after its first DLC the roster is 141 monsters but **19,881 fusions** — combinatorial content from a small base — [TechRadar](https://www.techradar.com/gaming/consoles-pc/charming-indie-pokemon-homage-cassette-beasts-shows-off-its-first-big-dlc).
- Chance-based rewards and youth: systematic review finds consistent associations between random-reward monetization and gambling-related harm among youth — [ScienceDirect systematic review](https://www.sciencedirect.com/science/article/pii/S1875952126000443).

### Inferences
- Design the dex as a **visibly structured grid by element (6 elements) and region**, with sub-sets that are small enough to be "almost complete" often (e.g., "Fire set 5/6"). This directly applies the JCR finding.
- Rarity tiers + a rare variant ("shiny") are cheap (palette swap) and give kids something to show off; but avoid paid/random eggs for minors — the youth evidence on random reward mechanics is negative, and BK is an education brand. Rarity earned by play (catch in a specific boss zone, at an event) delivers social capital without gambling.
- Duplicate-merge (Neon-style "4 of the same → upgraded form") is a cheap sink that keeps common catches meaningful.
- Trading is a proven massive driver (Pokémon GO +39%, Adopt Me economy) but also the #1 scam vector for kids; build late, restricted (friends only, both online, confirm screen, untradeable starters/high-value items, trade log), or replace with **gifting** (Pokémon GO's 2.2B gifts shows gifting alone is heavily used).
- Evolution was not directly evidenced in sources found; it is a reasonable inference that it gives the "grow" step a visual payoff.

### Gaps
- No Niantic-published data separating which collection features (shiny, dex, evolution) drive retention; no Roblox platform-level metrics on pet games. No study specific to children aged 9–15 on completion motivation.

## 3. Social / MMO features for kids & teens — value vs cost, safe versions

### Takeaway
The highest-evidence social features are **friends lists + gifting/trading** (Pokémon GO 2018) and **co-op boss raids** (shared objective makes social interaction easy). For kids, preset/menu chat (Toontown SpeedChat, Club Penguin Ultimate Safe Chat) is a 20-year-proven safe pattern; showing off rare pets in a shared space is the social payoff in Roblox pet games.

### Cited Findings
- Pokémon GO raids (2017) gave "a direct reason to cooperate against powerful opponents"; pre-COVID players all described offline social experiences such as raids/Community Days; survey research links GO play with new connections and strengthened friendships via **shared objectives that make conversation easier** — [arXiv: Pokémon GO to Pokémon STAY](https://arxiv.org/pdf/2202.05185).
- Niantic later added joining raids from the friends list and a raid finder in its Campfire social app — [Pokémon GO Hub](https://pokemongohub.net/post/news/pokemon-go-friends-list-raid-update/); 2023 remote-raid price changes triggered the "Hear Us Niantic" backlash — [Nintendo Life](https://www.nintendolife.com/news/2023/04/hear-us-niantic-trends-on-social-media-in-response-to-pokemon-go-remote-raids-update) (shows how central raids had become).
- Friends + trading update → +39% daily spend, 113M friendships, 2.2B gifts — [Sensor Tower](https://sensortower.com/blog/pokemon-go-daily-revenue).
- **SpeedChat:** Disney's HercWorld team found free sentence-construction menus still let testers be rude, so they settled on a **list of pre-written sentences**; used in Toontown (patented 2003 by Shochet, Ranalli, Schell). Under-13s limited to SpeedChat; typed "SpeedChat Plus" + "True Friends" required parental enablement — [Toontown fandom wiki](https://toontown.fandom.com/wiki/SpeedChat); [Habitat Chronicles history](http://habitatchronicles.com/2007/03/the-untold-history-of-toontowns-speedchat-or-blockchattm-from-disney-finally-arrives/comment-page-1/).
- Club Penguin offered "Ultimate Safe Chat" (menu-only), plus filtering against swearing/personal info and human moderators — [Wikipedia: Club Penguin](https://en.wikipedia.org/wiki/Club_Penguin).
- Kids play Adopt Me partly for interacting with friends on shared servers and showing rare pets — [ScreenWise](https://screenwiseapp.com/guides/adopt-me); [Parent Zone](https://parentzone.org.uk/article/adopt-me).
- Temtem was built as an MMO creature-collector (co-op adventure, seeing other tamers) — [Wikipedia: Temtem](https://en.wikipedia.org/wiki/Temtem); its decline (section 5) shows MMO presence alone doesn't retain without endgame content.

### Inferences
- Cost/value ranking for a tiny team (inference):
  - **Cheap, high value:** friend codes/friend list (BK already has a student roster → friends can even be classmates by default), preset chat + emotes (SpeedChat model), seeing others' avatars + the lead pet following them (show-off), gifting a daily item to friends (Pokémon GO gifts), class/school leaderboard computed server-side.
  - **Medium:** async co-op (shared boss HP pool across a class over a day — no realtime sync needed), party boss with 2–4 players realtime.
  - **Expensive/risky:** free trading (scams, economy balance), free-text chat (moderation), guild systems, realtime PvP.
- Since all players are BK students with known identities, **class = guild** at near-zero cost, and preset-chat-only is both safe and culturally aligned with the SpeedChat precedent.

### Gaps
- No quantified data found comparing retention lift of emotes/leaderboards/guilds in kids' games. Nothing found specific to Vietnamese kids' social-game behavior beyond Play Together's popularity.

## 4. Daily habit mechanics without compulsion; short sessions

### Takeaway
A ~15-minute daily checklist (Genshin: 4 commissions + capped stamina) and recurring **appointment events** (Pokémon GO Community Day, monthly, short window) are the proven formats. Research from 2025 shows 11–13-year-olds recognise but normalise streak pressure (e.g., recruiting siblings to keep Adopt Me streaks) — so streaks should be forgiving.

### Cited Findings
- Genshin: daily commissions (50 Primogems/day total) + Resin cap (natural cap ~200; spending ~160/day avoids waste) → daily routine ~15 min — [HoYoLAB](https://www.hoyolab.com/article/35566777); [Boostroom](https://boostroom.com/blog/genshin-impact-daily-routine-guide-what-to-do-every-day); [games.lol](https://games.lol/blog/genshin-impact-managing-resins-daily-commissions-challenges/). Genshin has no in-game login calendar; check-in is via HoYoLAB web (60 Primogems/week) — [Facebook answer page](https://www.facebook.com/fb-answers/daily-login-genshin-impact/) (low-quality source).
- Pokémon GO's first **Community Day** was 20 Jan 2018: monthly, boosts spawn of one species and grants an exclusive move only if evolved during the window — [Sensor Tower / search summary](https://sensortower.com/blog/pokemon-go-revenue-december-2018); 2018 revenue $795M (+35% vs 2017), daily average ~$2.2M vs $1.6M in 2017, attributed to "a consistent rollout of new features and content" — [Sensor Tower](https://sensortower.com/blog/pokemon-go-revenue-december-2018).
- Pokémon GO weekly retention ~70% through Sep 2016, on par with Candy Crush/Clash of Clans; ~25% weekly churn — [Amplitude](https://amplitude.com/blog/pokemon-go-lost-players-won-game).
- ACM study (Jan–Mar 2025) of children 11–13 viewing five deceptive patterns including **daily reward streaks (Adopt Me)**: kids were aware of manipulation but normalised it; coping strategies included enlisting siblings to maintain streaks — [ACM DL](https://dl.acm.org/doi/10.1145/3773077.3806137).
- Analyses of top-grossing 2024 F2P games find daily rewards, opaque currencies, loot boxes and social incentives deployed densely as monetization dark patterns, especially on mobile — [arXiv "Level Up or Game Over"](https://arxiv.org/pdf/2412.05039); [ResearchGate empirical harmfulness study](https://www.researchgate.net/publication/390235729_Dark_Patterns_in_Games_An_Empirical_Study_of_Their_Harmfulness).

### Inferences
- For BK: daily = 3 short quests (catch 1 creature of element X, win 1 battle, help a friend/class boss) + a capped "energy" (e.g., N boss attempts/day) that *caps* playtime rather than selling refills — this enforces the 10–20 min target and aligns with the education mission.
- Streak design: allow freezes/grace days, reward cumulative days rather than punishing breaks (the ACM finding shows streak pressure spills into kids' family life).
- Appointment mechanics fit a school schedule: e.g., a weekly class raid at a fixed time window, monthly "Community Day"-style creature spotlight with an exclusive move — cheap to author (config change) and proven by GO.
- Tie rewards to learning (BK context): the energy/attempt budget could be refilled by study activity — inference, not evidenced in sources.

### Gaps
- No published retention lift numbers for daily quests vs. streaks vs. events in kids' games found. No data on energy systems' effect on kids' session length.

## 5. Live-ops cadence; small-team creature games — launch content & growth; why MMO-lites die

### Takeaway
Small creature games succeed as **finished single-player experiences** (Cassette Beasts, Coromon, Monster Sanctuary: 100+ creatures at launch) and add DLC; the MMO-lite Temtem shows the failure mode: huge launch spike, then decline because early access had only ~35–45% of the story and little endgame, and later content couldn't restore peaks — content cadence is what keeps an online creature game alive. Kid platforms show the opposite pattern: a frequent update cadence (Adopt Me, Pet Sim) with event-limited pets.

### Cited Findings
- **Temtem (Crema):** Steam Early Access 21 Jan 2020; >500k units on Steam in first month; peak 39,612 CCU at EA launch; full release 6 Sep 2022 (>1M players by then); on 4 Mar 2024 Crema announced end of new content by June 2024 — [Wikipedia](https://en.wikipedia.org/wiki/Temtem); [PlayerCounter](https://playercounter.com/temtem-player-count/). Est. 330–1,200 daily players in Aug 2026 — [mmostats](https://mmostats.com/game/temtem) (estimator site).
- Temtem community explanation of the decline: EA launched with ~35–45% of story and almost no endgame beyond breeding and non-ranked PvP, stabilised ~2k CCU; spikes on content updates but never near previous peaks — [Steam discussions](https://steamcommunity.com/app/745920/discussions/0/3265680636366279218/) (player opinion, not developer statement).
- **Cassette Beasts** (Bytten Studio, 26 Apr 2023): 96% positive Steam, Metacritic 84; first DLC added 12 monsters → 141 total, 19,881 fusions — [TechRadar](https://www.techradar.com/gaming/consoles-pc/charming-indie-pokemon-homage-cassette-beasts-shows-off-its-first-big-dlc); [Steam](https://store.steampowered.com/app/1321440/Cassette_Beasts/).
- **Coromon** (TRAGsoft, PC 31 Mar 2022): ~30k Steam buyers / ~$500k first month; 100k PC units in three months — [GameSensor](https://gamesensor.info/news/coromon); later spin-off *Coromon: Rogue Planet* — [VGChartz](https://www.vgchartz.com/article/462296/coromon-rogue-planet-announced-for-switch-pc-ios-and-android/).
- **Monster Sanctuary**: Kickstarter stretch goals expanded roster to 100+ monsters, NG+, Switch port and online PvP; full release 8 Dec 2020, Game Pass day one — [Wikipedia](https://en.wikipedia.org/wiki/Monster_Sanctuary).
- Temtem spin-offs after content end: free-to-play *Temtem: Showdown* (June 2023, no microtransactions) and *Temtem: Swarm* (2024, Vampire-Survivors-like) — [Wikipedia](https://en.wikipedia.org/wiki/Temtem).
- **Adopt Me!**: ~40-person studio; key growth came from adding a new system (pets/eggs/trading) two years after launch, not from launch content — [Wikipedia](https://en.wikipedia.org/wiki/Adopt_Me!).
- Pokémon GO 2018 revival attributed to "consistent rollout of new features and content" (Community Day Jan, friends/trading June) — [Sensor Tower](https://sensortower.com/blog/pokemon-go-revenue-december-2018).

### Inferences
- For a closed audience (BK students) the Temtem lesson translates to: **do not open the "world" with only a fraction of the content and no repeatable endgame.** Repeatable endgame cheaply = boss rotation (weekly boss with a different element weakness), rare variants, class leaderboards.
- Cadence (inference from the cases): one small "event" per 1–2 weeks (spotlight creature/boss rule change = config, no new art) and one content drop per month (2–4 new creatures or 1 boss). Fusion/variants multiply perceived content without new models.
- Launch size of successful premium indies (100+ monsters) is not the right benchmark for a free school game; better benchmark is Pet Sim/Adopt Me style "small core + frequent drops."

### Gaps
- No primary source found on exact launch creature counts for Coromon/Nexomon, nor on Pet Sim 99/Adopt Me update frequency (commonly said to be weekly — unverified here). No developer postmortem (GDC / Game Developer) retrieved for Temtem or other creature MMO-lites.

## 6. Concurrency reality — the "empty world" problem

### Takeaway
Small online worlds solve emptiness by **sharding into small fixed-cap instances and filling them densely**, prioritising friends; Roblox developers report that matchmaking spreading players over many 6–12-player servers hurts retention. Async multiplayer (shared goals across time) and fixed appointment windows concentrate a small population.

### Cited Findings
- Sharding: copies of the world with a fixed max player count, new instance spun up at load threshold and disposed when low; trade-off is players don't share one world — [Game-Ace MMORPG guide](https://game-ace.com/blog/mmorpg-games-and-how-to-develop-them/); [GameDev.net thread](https://gamedev.net/forums/topic/657588-mmos-and-modern-scaling-techniques/5159613/). Realistic indie first-MMO scope: one zone of 100–300 CCU, sharded — [Game-Ace](https://game-ace.com/blog/mmorpg-games-and-how-to-develop-them/).
- Roblox exposes "Fill each server as full as possible" vs "Roblox optimizes server fill"; devs report Roblox creating many small 6–12-player servers "which significantly hurts player retention," sometimes even 1-player servers; empty servers reduce engagement in games that rely on interaction — [Roblox DevForum](https://devforum.roblox.com/t/roblox-does-not-fill-servers-according-to-configured-settings/3530280); [DevForum](https://devforum.roblox.com/t/roblox-will-sometimes-fail-matchmaking-sending-every-single-new-player-into-their-own-server-only-filling-servers-up-to-1-player/3981356); [DevForum](https://devforum.roblox.com/t/empty-servers-despite-the-option-for-roblox-to-fill-them-as-much-as-possible-toggled/1862917).
- Players/devs ask for "join friends' server" options; joining via a friend's profile is common — [DevForum](https://devforum.roblox.com/t/join-publicfriends-server-option/46447).
- Pokémon GO turned raids into friend-list-joinable and remote, plus a raid finder app, to gather players for co-op — [Pokémon GO Hub](https://pokemongohub.net/post/news/pokemon-go-friends-list-raid-update/).
- Temtem at ~330–1,200 daily players shows what a post-peak MMO-lite population looks like — [mmostats](https://mmostats.com/game/temtem).

### Inferences
- BK's planned rule "see up to 10 others, friends prioritised" matches the evidence: small dense instances beat a big empty map. Fill rule: friends/classmates first, then same khối/class, then fill to cap; never show a player alone if anyone is online.
- With a few hundred students online at peak (school-time clustering), appointment windows (e.g., evening class raid) and async shared-HP bosses make the world feel alive even at low CCU; ghost/replay avatars (showing recent visitors' pets) are a cheap trick (inference — no source found).

### Gaps
- No published data found on bots/ghost players in kid games, or on minimum CCU needed for a "lively" feel.
