# Multiplayer / netcode backend for a browser MMO-lite creature-catching game (BK Academy, as of 30 Sep 2026)

Scope: shared world zones (players see each other move), parties of 2–4 fighting bosses, server-authoritative catch/combat RNG (because it pays out real in-app currency "xu"), persistence and business logic in the existing Supabase Postgres (`fn_*` functions), browser/PWA clients (iPad 7th gen Safari, mid-range Android, school PCs), players in Vietnam, ~100–500 peak CCU at 18:00–22:00 ICT, tiny team, AI-written code, low ops and low cost.

Research date: 2026-09-30. GitHub stats below were read from the GitHub REST API on that date.

---

## Q1. Candidate comparison: authority model, zone/room fit, interest management, browser client, SEA hosting and price at ~500 CCU, ops, maturity, games shipped

### Takeaway
Only Colyseus (Node/TS, MIT) combines an authoritative room server with automatic binary delta state sync, per-client filtering (StateView), built-in reconnection and client prediction (0.18, Aug 2026), a small browser SDK, and a ~$15–24/month price point. Nakama and SpacetimeDB are mature but either expensive when managed (Heroic Cloud) or bring their own database of record (SpacetimeDB, Nakama). That clashes with the "all business logic in Supabase Postgres" rule. Photon Realtime is a relay unless you buy Enterprise. Supabase Realtime cannot be authoritative. Hathora shut down in May 2026. PartyKit/Durable Objects is a viable low-ops alternative, but you have to build state sync yourself.

### Cited Findings

**Colyseus (+ Colyseus Cloud)**
- Status: Colyseus 0.18 was released 20 Aug 2026 and is billed as "the last release before 1.0". It adds built-in client-side prediction and lag compensation. The server stays authoritative and runs a fixed-rate simulation that the client predicts against, using a shared `step` function. It also brings Schema 5.0 (~2.4× faster encoder, quantized floats, `.patchOnly()`/`.fullStateOnly()` delivery modifiers), request/response messaging, `@colyseus/database` (Drizzle ORM on PostgreSQL/SQLite), and the `@colyseus/admin` ops console. The browser bundle drops to ~58 KB gzip from ~191 KB — [Colyseus 0.18 blog](https://colyseus.io/blog/colyseus-018-is-here/)
- Colyseus 0.17 (6 Feb 2026) added automatic client reconnection. Callbacks and state listeners survive abnormal closures, with new `onDrop()`/`onReconnect()` lifecycle hooks, and the client can skip the handshake when local state exists. It also added `maxMessagesPerSecond` rate limiting, `room.ping()`, latency-based server selection, and an experimental PostgreSQL matchmaking driver — [Colyseus 0.17 blog](https://colyseus.io/blog/colyseus-017-is-here/); [Migrating to 0.17](https://docs.colyseus.io/migrating/0.17)
- State sync: the default `patchRate` is 50 ms (~20 Hz). `setFixedTimestep(step, tickRate)` is recommended for client-predicted games. `seatReservationTimeout` defaults to 15 s. The lifecycle hooks are `onCreate/onAuth/onJoin/onDrop/onReconnect/onLeave/onDispose`, and the `onAuth()` return value is exposed as `client.auth` — [Colyseus Room docs](https://docs.colyseus.io/room)
- Interest management: `StateView` gives per-client visibility (`client.view.add/remove/subscribe`, fields tagged `.view()`). Each StateView "is going to add a new encoding step". The docs warn: "Avoid relying on `StateView` for large datasets: it is not optimized for that yet". It suits private fields, area-based data and team-owned data — [Colyseus StateView docs](https://docs.colyseus.io/state/view)
- Maturity: MIT license, 7,327 GitHub stars, last push 2026-09-30, and package releases (`@colyseus/tools@0.18.7`, `@colyseus/auth@0.18.4`) on 29–30 Sep 2026 — [GitHub colyseus/colyseus](https://github.com/colyseus/colyseus/releases). The homepage claims 759K+ downloads and 80 contributors — [colyseus.io](https://colyseus.io/)
- Games shipped (vendor showcase): Pixels.xyz, Bloxd.io, Kirka.io, Cryzen.io, Sword Masters, Knight's Edge, SongTrivia2, Raft Wars Multiplayer. Animoca Brands is listed among "trusted" companies — [colyseus.io](https://colyseus.io/)
- Colyseus Cloud: "Starting at $15/mo", "No CCU/DAU/MAU limits", "Unlimited bandwidth". Billing is a flat compute-plan subscription charged upfront monthly and prorated on deletion — [Colyseus pricing](https://colyseus.io/pricing/); [Pricing & Billing docs](https://docs.colyseus.io/cloud/pricing-billing). It advertises "32 Global Locations", zero-downtime rolling deploys, monitoring/alerting and a 99.9% uptime SLA, but the public pages do not list the region names — [Colyseus Cloud](https://colyseus.io/cloud-managed-hosting/)
- Self-hosting: the open-source version is free, "No restrictions" — [Colyseus pricing](https://colyseus.io/pricing/). There is a one-click app on the Vultr Marketplace — [Vultr](https://www.vultr.com/marketplace/apps/colyseus/)

**Nakama (Heroic Labs)**
- Authoritative matches use 7 handler functions (init, joinAttempt, join, leave, loop, terminate, signal), and the server "will periodically call the match loop function". Tick rates range from ~1/s for turn-based games to "dozens of times per second". Runtimes are Go, Lua and TypeScript. State is **not** auto-synced: "These changes in state are not automatically send to connected clients. You must do this manually… broadcasting the appropriate op codes". The docs recommend keeping payloads within the 1500-byte MTU and "no more than 1 message per tick, per presence". Match labels (2 KB, JSON-queryable) drive match listing — [Nakama authoritative multiplayer docs](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)
- Maturity: Apache-2.0, 13,454 stars, v3.41.0 released 18 Sep 2026 (provider-agnostic authentication hooks and an `Authenticate` runtime function), v3.40.0 on 13 Jul 2026, v3.39.0 on 20 May 2026 — [GitHub heroiclabs/nakama releases](https://github.com/heroiclabs/nakama/releases)
- Heroic Cloud pricing comes from a dynamic calculator (Nakama CPU plus a dedicated DB CPU), with "No DAU/MAU/CCU limits" and a dedicated managed database. Support plans cost $2,000/mo (Studio Basic) and $6,000/mo (Studio Standard) — [Heroic Labs pricing](https://heroiclabs.com/pricing/). A third-party aggregator says Heroic Cloud Nakama "starts at $600/month" with tiers up to $6,000/month (unverified by vendor) — [Toolradar](https://toolradar.com/tools/nakama/pricing). Billing is usage-based and prorated daily — [Heroic Cloud billing docs](https://heroiclabs.com/docs/heroic-cloud/concepts/organizations/billing-support/index.html)
- Games: Highguard (Wildlight), Animal Company (500K DAU VR), Soccer Manager series; the vendor claims "over 1 billion players" — [Heroic Labs Feb 2026 newsletter](https://heroiclabs.com/blog/feb-2026-newsletter/index.html); [Heroic Labs customers](https://heroiclabs.com/customers/)

**SpacetimeDB (Clockwork Labs)**
- 2.x is current: v2.10.2 (29 Sep 2026), v2.10.1 (15 Sep), v2.10.0 (4 Sep). The repo has 25,240 stars. The license is "NOASSERTION" on GitHub; the FAQ says BSL 1.1, converting to AGPL v3 with a linking exception "after a few years" — [GitHub releases](https://github.com/clockworklabs/SpacetimeDB/releases/tag/v2.0.1); [SpacetimeDB FAQ](https://spacetimedb.com/docs/intro/faq/)
- Module languages are Rust, C#, TypeScript (new in 2.0) and C++ (new in 2.0). Client SDKs cover TypeScript (React/Vue/Svelte/Angular), C#/Unity, Rust and C++/Unreal. Auth is OIDC (SpacetimeAuth or third parties such as Auth0/Clerk/Keycloak). BitCraft Online runs on it — [SpacetimeDB FAQ](https://spacetimedb.com/docs/intro/faq/)
- The vendor claims "well over 100k transactions per second for TypeScript modules and up to 170k… for Rust" in 2.0 — [SpacetimeDB 2.0 release](https://github.com/clockworklabs/SpacetimeDB/releases/tag/v2.0.1)
- Maincloud pricing: Free $0 (2,500 TeV ≈ 3M function calls / 12.5 GB egress / 1 GB storage), Pro $25 (100,000 TeV ≈ 120M calls / 500 GB egress / 40 GB storage), Team $250 (250,000 TeV). Overage is 2,592 TeV per $ — [SpacetimeDB pricing](https://spacetimedb.com/pricing); [pricing blog](https://spacetimedb.com/blog/all-new-spacetimedb-pricing). Free-tier databases auto-pause when inactive; Pro/Team with pay-as-you-go never suspend — [Maincloud docs](https://spacetimedb.com/docs/how-to/deploy/maincloud/)
- Risk signal: open issue #5983 (24 Sep 2026, v2.10.1) reports Maincloud subscription deliveries freezing 7–63 s under fan-out. The setup was 230 subscribers receiving ~200 KB updates every 8 s. "Last-subscriber lag up to ~61 s" and "~25 % of deliveries arrived more than 2.5 s late", with no maintainer response yet — [GitHub issue #5983](https://github.com/clockworklabs/SpacetimeDB/issues/5983)

**PartyKit / Cloudflare Durable Objects (+ Agents)**
- PartyKit joined Cloudflare. PartyServer (the core library) enhances a Durable Object with WebSocket lifecycle hooks and broadcasting. The runtime is workerd on Cloudflare's edge, "within ~50 ms reach of about 95%" of Internet users — [PartyKit docs: How PartyKit works](https://docs.partykit.io/how-partykit-works/); [partyserver README](https://github.com/cloudflare/partykit/blob/main/packages/partyserver/README.md)
- Maturity: ISC license, 1,276 stars, `partyserver@0.5.10` released 3 Aug 2026 and `partysocket@1.3.0` on 23 Jun 2026 — [GitHub cloudflare/partykit](https://github.com/cloudflare/partykit)
- DO pricing (Workers Paid): requests 1M/month included then $0.15/M. Incoming WebSocket messages are billed at a 20:1 ratio. Duration is 400,000 GB-s included then $12.50/M GB-s, billed wall-clock while active or "idle but ineligible for hibernation". SQLite storage billing started Jan 2026: 25B row reads and 50M row writes included, then $1.00/M writes; storage 5 GB-month included, then $0.20/GB-month. Cloudflare's own worked example (100 DOs × 50 WebSockets, 1 msg/min, 8 h/day) comes to ≈ $142.95/month — [Cloudflare DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- Placement: by default a DO is created "close to where the initial get() request is made". Location hints include `apac` and `apac-se` (Southeast Asia) — [Cloudflare DO data location](https://developers.cloudflare.com/durable-objects/reference/data-location/)

**Photon (Exit Games)**
- Photon Realtime pricing: free dev plan with 20 CCU; 100 CCU one-time for $95/12 months; 500 CCU at $95/month (1.5 TB/month traffic, burst allowed, overage $0.10/GB in APAC); 1,000 CCU at $185/month; 2,000 CCU at $370/month. **"Server Authoritative Logic via Plug-Ins" is listed only under Enterprise Cloud** (custom pricing) — [Photon Realtime pricing](https://www.photonengine.com/realtime/pricing)
- Photon offers a JavaScript SDK alongside Unity/Unreal/.NET/C++ — [Photon SDK downloads](https://www.photonengine.com/sdks). All Photon Cloud regions are included in every plan, and Singapore is a region (per search-result summary of Photon pricing docs) — [Photon pricing docs](https://doc.photonengine.com/photon/current/pricing)

**Supabase Realtime** (details in Q2)
- Clients broadcast to each other directly through Supabase's Realtime servers. The only server-side control is authorization (RLS on `realtime.messages` for private channels), and there is no game-logic hook in the message path — [Supabase Broadcast docs](https://supabase.com/docs/guides/realtime/broadcast)

**Hathora: SHUT DOWN**
- Hathora announced on 4 Mar 2026 that it would close its game-server hosting, and the shutdown took effect 5 May 2026. It was acquired by Fireworks AI and handed customers over to Nitrado's GameFabric. Affected titles included Splitgate 2, Spectre Divide and Stormgate — [GamesBeat](https://gamesbeat.com/hathora-acquired-will-exit-game-infrastructure-biz-and-hand-over-customers-to-nitrado/); [Gameye](https://gameye.com/gameye-vs-hathora/); [Game Developer (Stormgate)](https://www.gamedeveloper.com/business/stormgate-rushing-offline-mode-after-losing-server-access-to-an-ai-company)

**Rivet**
- Rivet is now marketed as "The Orchestrator for Agentic Workloads" (stateful Actors). It is Apache-2.0 and self-hostable. Its older positioning covered game-server hosting, matchmaking, lobbies and parties — [rivet.dev](https://rivet.dev/); [GitHub rivet-dev/rivet](https://github.com/rivet-dev/rivet)
- Activity: 6,207 stars, v2.3.21 released 24 Sep 2026, and a Sep 2026 changelog adding "Durable Streams" support for Rivet Actors — [Rivet changelog](https://rivet.dev/changelog/2026-09-03-durable-streams-now-supports-rivet-actors/)

**Geckos.io (WebRTC DataChannels) and plain Node + uWebSockets.js**
- geckos.io: BSD-3, 1,490 stars, last push 27 Mar 2026, with no GitHub Releases published — [GitHub geckosio/geckos.io](https://github.com/geckosio/geckos.io)
- uWebSockets.js: Apache-2.0, 9,160 stars, v20.71.0 released 16 Sep 2026 (steady ~monthly cadence) — [GitHub uNetworking/uWebSockets.js](https://github.com/uNetworking/uWebSockets.js/releases)

**Transport support on the target devices**
- WebTransport shipped in Safari 26.4 (Mar 2026, macOS/iOS/iPadOS) and is now Baseline — [WebKit Safari 26.4](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/); [WebRTC.ventures](https://webrtc.ventures/2026/04/webtransport-is-now-baseline-what-it-means-for-real-time-media/)
- **The iPad 7th gen cannot run iPadOS 26.** It was the only model dropped from the iPadOS 18 list (its A10 chip lacks a Neural Engine), so it stays on iPadOS 18.x — [iClarified](https://www.iclarified.com/97601/ipados-26-supported-devices-the-full-list-of-compatible-ipads); [BGR](https://www.bgr.com/1964967/ipados-26-update-compatibility-list/)

### Inferences
- **WebSocket is mandatory.** The iPad 7th gen is stuck on iPadOS 18 / Safari 18, below Safari 26.4, so it has no WebTransport. Any WebTransport or WebRTC path would need a WebSocket fallback anyway. WebSocket-first stacks (Colyseus, PartyKit, Nakama, SpacetimeDB) are safe. WebRTC/UDP (geckos.io) adds TURN/UDP-port risk on school networks for little gain at 10 Hz. That network risk is unverified and should be tested on-site.
- Fit matrix (my synthesis of the findings above):

| Candidate | Authoritative? | State sync | Zone + party-instance fit | Browser SDK | SEA hosting | ~500 CCU cost/mo | Ops | Status 2026 |
|---|---|---|---|---|---|---|---|---|
| **Colyseus** (self-host SG VPS) | Yes (room = process-side authority) | Auto binary delta, 20 Hz default, StateView AOI, 0.18 prediction | Excellent: ZoneRoom + BossRoom; seat reservation | Yes, ~58 KB | Any SG VPS | ~$24–40 | Low–medium (1 Node process + PM2/Docker) | Very active, pre-1.0 |
| Colyseus Cloud | Yes | same | same | same | "32 locations", SG unconfirmed | from $15 | Lowest | Active |
| Nakama (self-host) | Yes (match handler) | Manual op-code broadcast, no delta | Good (matches + parties built in) | Yes | Any VPS | VPS + own Postgres | Medium (Go binary + DB + migrations) | Active (v3.41) |
| Heroic Cloud | Yes | same | same | same | unconfirmed | ~$600+ (3rd-party figure) | Low | Active |
| SpacetimeDB Maincloud | Yes (reducers) | Auto subscription sync | Good, but it is a second DB of record | Yes (TS) | Region not published | ~$400–800 est. (see Q5) | Low | Active; fan-out bug open |
| PartyKit / CF DO | Yes (DO is single-threaded authority) | DIY (no schema/delta lib) | Good (1 DO per zone / boss) | partysocket | apac-se hint | ~$25–65 est. | Very low | Active but small lib |
| Photon Realtime | **No** (relay) unless Enterprise | Client-owned | Rooms yes | JS SDK | SG | $95 (relay only) | Very low | Active |
| Supabase Realtime | **No** | None (pub/sub) | Channels only | supabase-js | Project region | Infeasible for positions (Q2) | None | Active |
| Hathora | — | — | — | — | — | — | — | **Shut down 5 May 2026** |
| Rivet | Yes (actors) | DIY | Possible | Yes | Self-host / cloud region unknown | unknown | Medium | Active, pivoted to AI agents |
| geckos.io | DIY | DIY | DIY | Yes (WebRTC) | Any VPS | VPS | High (UDP/TURN) | Low activity |
| uWS.js raw | DIY | DIY | DIY | native WS | Any VPS | VPS | High (build everything) | Active |

- SpacetimeDB and Nakama each keep their own authoritative store (SpacetimeDB's in-memory tables; Nakama's own Postgres/CockroachDB schema). Either one makes "business logic lives in Postgres `fn_*` functions" a two-database problem: you would need sync jobs and would get two sources of truth. That violates the project's CLAUDE.md §2.0 rule. Colyseus and Durable Objects are stateless with respect to persistence, so they can call Supabase RPCs as the single source of truth.
- Colyseus has the best "AI coding agent writes most code" profile. The whole stack is TypeScript, types are shared end-to-end (0.17 `defineServer()`), and the docs are good. The client-prediction helper in 0.18 is new (Aug 2026), so expect rough edges.
- Photon Realtime is disqualified by the server-authoritative RNG requirement unless the team buys Enterprise plugins, which are C# and custom-priced.

### Gaps
- The Colyseus Cloud region list (whether Singapore is among the "32 locations") and per-plan vCPU/RAM specs are behind the dashboard or pricing simulator and could not be read. Confirm before choosing Cloud over a self-hosted SG VPS.
- SpacetimeDB Maincloud region(s) are not published (FAQ and Maincloud docs are silent). The 2.0 GA date was not found. Whether Supabase Auth can serve as SpacetimeDB's OIDC issuer was not verified.
- Heroic Cloud list prices and regions are not published (calculator only). The $600/month figure is third-party.
- Vendor CCU-per-core benchmarks for Colyseus were not found. Capacity must be load-tested.
- Cloudflare Agents SDK specifics were not researched (it is built on DOs and not game-specific). Whether a DO-capable Cloudflare data center exists in Vietnam, versus Singapore/HK, is unknown.
- Photon Fusion/Quantum web support was not verified (assumed Unity-centric).

---

## Q2. Supabase Realtime specifics, and how to connect an authoritative game server to Supabase

### Takeaway
Supabase Realtime is a fine fit for low-rate social events (party invites, presence of friends, notifications), but it is unfit and unaffordable for position sync. Every recipient counts as a billed message, the per-project cap is 2,500 msgs/s even on Team, and there is no server-side logic in the message path. The authoritative game server should verify Supabase JWTs via JWKS and write every outcome through Postgres RPCs using a secret/service key.

### Cited Findings
- Quotas (Free / Pro / Pro no-spend-cap / Team):
  - Concurrent connections: 200 / 500 / 10,000 / 10,000.
  - Messages per second: 100 / 500 / 2,500 / 2,500.
  - Channel joins per second: 100 / 500 / 2,500 / 2,500.
  - Channels per connection: 100 (all plans).
  - Presence keys per object: 10.
  - Presence messages per second: 20 / 50 / 1,000 / 1,000.
  - Broadcast payload: 256 KB on Free, 3,000 KB on Pro and Team.

  Over-limit behaviour: "Connections will be disconnected if your project is generating too many messages per second", with errors such as `too_many_connections` and `too_many_joins` — [Supabase Realtime limits](https://supabase.com/docs/guides/realtime/limits)
- Billing counts fan-out: "Each broadcast message counts as one message sent plus one message per subscribed client that receives it… if you broadcast a message and 4 clients listen to it, it counts as 5 messages". Overage is $2.50 per 1M messages; the quota is 2M on Free and 5M on Pro/Team — [Supabase Realtime messages usage](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages)
- Latency benchmarks (Supabase's own):
  - Broadcast at 32,000 concurrent users and 224,000 msgs/s: median 6 ms, p95 28 ms, p99 213 ms.
  - Broadcast with RLS auth at 50,000 users: median 19 ms, p95 49 ms.
  - Broadcast-from-database: median 46 ms, p95 132 ms.
  - Postgres Changes run on a single thread, capped at 3,000 msgs/s with RLS on a Micro instance.

  — [Supabase Realtime benchmarks](https://supabase.com/docs/guides/realtime/benchmarks)
- Server-side sending: `POST /realtime/v1/api/broadcast/{topic}/events/{event}` (REST, no WebSocket needed), `realtime.send(payload, event, topic, private)` from SQL, and `realtime.broadcast_changes()` from triggers. Private channels require RLS policies on `realtime.messages`. There is also an `ack: true` option to confirm server receipt — [Supabase Broadcast docs](https://supabase.com/docs/guides/realtime/broadcast)
- JWT verification by a third-party server: use the JWKS at `https://<project>.supabase.co/auth/v1/.well-known/jwks.json` with asymmetric ES256 (recommended) or RS256. The endpoint is edge-cached for 10 min, and client libraries may cache keys for another 10 min. Legacy HS256 shared secrets are "not recommended for production". New `sb_publishable_…` / `sb_secret_…` keys replace the JWT-based `service_role` key — [Supabase JWT signing keys](https://supabase.com/docs/guides/auth/signing-keys)
- Colyseus `onAuth()` is the hook where the token is verified; its return value becomes `client.auth` — [Colyseus Room docs](https://docs.colyseus.io/room)

### Inferences
- **Position sync via Supabase Realtime, worked example.** One zone has 50 players each broadcasting at 10 Hz. That is 500 sends plus 500 × 49 receives, or ≈25,000 billed msgs/s per zone. Ten such zones (500 CCU) make ≈250,000 msgs/s, which is **100×** the 2,500 msgs/s Team cap. Even counting only sends (5,000/s) exceeds the cap. If it were allowed, 4 h/day for 30 days would be ≈1.08×10¹¹ messages, or ≈$270,000/month at $2.50/M. A downscaled 5 Hz with 20 players per zone still gives ≈50,000 msgs/s. Verdict: **never use Supabase Realtime for movement**.
- Supabase Realtime can still carry low-frequency, non-authoritative events for about 500 users:
  - party invite/accept,
  - "friend online" Presence (within 1,000 presence msgs/s on Team or Pro without a spend cap),
  - reward toasts pushed by `realtime.send()` from inside the same `fn_*` that credits xu.

  This keeps notifications consistent with the DB transaction.
- Connecting the game server:
  1. The client logs in with supabase-js (existing accounts).
  2. The client passes `session.access_token` in the Colyseus join options.
  3. `static onAuth` verifies it with `jose.createRemoteJWKSet(<jwks url>)` and `jwtVerify` (issuer and audience checks), then maps `sub` to the student id.
  4. The server writes outcomes with a server-only secret key via `supabase.rpc('fn_game_…', {...})`.
  5. Each `fn_game_*` is `SECURITY DEFINER` with `EXECUTE` revoked from `public`, `anon` and `authenticated` and granted only to the service role. CLAUDE.md records that functions applied through the SQL Editor get an explicit `anon` grant, so a `revoke … from public` alone is not enough.
  6. Every write carries a server-generated `event_id` with a unique constraint (idempotent upsert), so retries after network blips never double-pay xu.
- Place the Colyseus server in the **same region as the Supabase project** so that RPC round-trips are single-digit milliseconds. Ideally both are in Singapore (ap-southeast-1).

### Gaps
- Overage pricing for Realtime peak connections was not found on the pages fetched.
- The Supabase project's current region and compute size were not checked. If it is not in Singapore, game-server-to-DB latency will be higher.
- It is not explicit whether the messages/s *rate limit* (as opposed to billing) counts fan-out receipts.

---

## Q3. Recommended netcode patterns for a creature-catching MMO-lite on mobile browsers

### Takeaway
Use a server-authoritative room with client-side prediction only for the player's own movement. Render other players with ~100 ms interpolation at 10–20 Hz snapshots. Treat catching and combat as request→server-resolve→result events rather than predicted physics. Rely on Colyseus 0.17+ auto-reconnect with a held seat for spotty mobile links.

### Cited Findings
- Entity interpolation: the server sends at a fixed low rate (e.g. "10 times per second"). Clients render others one update in the past, so "you're always showing the user actual movement data, except you're showing it 100 ms 'late'", which "isn't generally noticeable". The trade-off appears only in aiming or shooting — [Gabriel Gambetta, Entity Interpolation](https://www.gabrielgambetta.com/entity-interpolation.html)
- Colyseus defaults to a 50 ms patch rate (20 Hz) with fixed-timestep simulation — [Colyseus Room docs](https://docs.colyseus.io/room). 0.18 adds built-in prediction and reconciliation ("server stays authoritative… client predicts against it") and quantized floats to shrink position payloads — [Colyseus 0.18 blog](https://colyseus.io/blog/colyseus-018-is-here/)
- Nakama's guidance: choose "the lowest possible tick rate that provides an acceptable player experience", keep payloads under the 1500-byte MTU, and send ≤1 message per tick per presence — [Nakama authoritative docs](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)
- Reconnection: Colyseus 0.17 keeps callbacks and state listeners across abnormal closures. The server's `onDrop()` can hold the player's seat and `onReconnect()` restores it, and the client can skip the handshake with cached state — [Colyseus 0.17 blog](https://colyseus.io/blog/colyseus-017-is-here/). The seat reservation timeout defaults to 15 s — [Colyseus Room docs](https://docs.colyseus.io/room)
- Latency budget: Singapore↔Ho Chi Minh City ping averages 43.5 ms (min 43.3, max 44.5; 30 pings, 2026-09-30) — [WonderNetwork](https://wondernetwork.com/pings/Singapore/Ho%20Chi%20Minh%20City)

### Inferences
- **Movement.** Clients send inputs (direction or target tile) at ≤10 Hz. The server validates speed and collisions and patches positions at 10 Hz (`patchRate = 100`) in overworld zones, which halves bandwidth versus the 20 Hz default for mid-range Android and old iPads. Use 20 Hz only inside boss rooms if the combat is real-time. Own avatar: predicted (0.18 helper, or simple tile-step prediction). Others: 100 ms interpolation buffer.
- **Zones.** Make one `ZoneRoom` per map area, capped at ~50–80 players. When full, spawn a parallel "channel" (instance) of the same map, the classic MMO channel pattern, via `joinOrCreate` with a zone filter. This bounds per-client fan-out without needing complex AOI. Use StateView only for per-player data such as private wild-creature spawns, not for crowd AOI, given the docs' own warning.
- **Parties and bosses.** Party membership is persistent social state, so it belongs in Postgres, with invites over Supabase Realtime. When the leader starts a fight, the server creates a `BossRoom` and reserves seats for exactly the 2–4 party members. Members leave the ZoneRoom and join the BossRoom, then return afterward. The BossRoom keeps dropped players' seats for ~30–60 s.
- **Catching.** Make it an RPC-style event, not a physics simulation.
  1. The client sends `throw(creatureInstanceId, ballType)`.
  2. The room checks proximity, that the creature exists and is not already caught, and a cooldown.
  3. The room calls `fn_game_bat_thu(...)`. Postgres does the RNG roll, item decrement, collection insert and xu/EXP in one transaction and returns the outcome.
  4. The room broadcasts the result to the zone. The 1–2 s throw/shake animation hides the ~50–100 ms round-trip.
- **Combat.** A turn-based or command-based (ATB) design, as in Pokémon, lets each action be resolved by a Postgres function called by the room. That fits CLAUDE.md §2.0's "one formula source = `fn_*`" rule. The load is low: e.g. 200 players in battle × 1 action per 3 s ≈ 70 RPC/s, which must still be validated against the Supabase compute tier. Real-time action combat (Palworld-like) would require the damage simulation in the TS room at 20 Hz, with Postgres only validating a server-produced battle summary and paying rewards. That splits formulas across two places, so it should be an explicit CEO decision.
- **Spotty connections.** Use the auto-reconnect above and idempotent server event ids. Never commit rewards on the client. Outcomes are persisted before being displayed as final, so a reconnecting client reads truth from the DB or room state.

### Gaps
- No public postmortem specific to browser creature-catching MMOs was found. The patterns above are general netcode practice plus vendor docs.
- The Hanoi↔Singapore ping was not retrieved (only HCMC).

---

## Q4. Security for a kids' platform: auth, anti-cheat basics, chat moderation

### Takeaway
Reuse Supabase Auth and verify JWTs server-side via JWKS. Keep every value-bearing decision (RNG, drops, xu) in Postgres, called only by the game server. Rate-limit and validate every client message. Avoid free-text chat entirely: use preset phrases and emotes.

### Cited Findings
- Supabase JWKS/ES256 verification and the new `sb_secret_…` keys (independent rotation) — [Supabase JWT signing keys](https://supabase.com/docs/guides/auth/signing-keys)
- Colyseus `onAuth()` for token verification — [Colyseus Room docs](https://docs.colyseus.io/room). `maxMessagesPerSecond` for per-client rate limiting — [Colyseus 0.17 blog](https://colyseus.io/blog/colyseus-017-is-here/)
- Authoritative multiplayer is recommended "where you don't want to trust game clients" — [Nakama authoritative docs](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)
- Photon Realtime (relay) only provides server-authoritative logic on Enterprise, so on public plans the clients own game state — [Photon Realtime pricing](https://www.photonengine.com/realtime/pricing)

### Inferences
- Anti-cheat baseline, in order of value:
  1. The client sends *intents* only; it never sends outcomes, damage, positions-as-truth or catch results.
  2. The server clamps movement (maximum speed per tick, no walking through walls) and checks range for throws and attacks.
  3. RNG runs server-side, preferably inside the Postgres `fn_*` via `random()` or pgcrypto so it is also auditable. The seed is never sent to the client.
  4. Enforce per-player caps on xu earned per day inside Postgres, so even a server bug cannot mint unbounded currency.
  5. Use idempotency keys and an append-only reward log. A trigger-based history, as in CLAUDE.md §4, allows audit and rollback.
  6. Rate-limit each client (`maxMessagesPerSecond`) and kick on violations.
  7. Use one active session per account: on join, disconnect the older socket.
- Chat for grades 6–12: ship **no free text** in v1. Use a quick-chat wheel of preset Vietnamese phrases and emotes, and party-only pings. If text is added later, use a whitelist dictionary, with any free text limited to the party and logged for staff review.
- Keep the game server's secret key server-side only, never in the Vercel client bundle, and give it access only to the `fn_game_*` functions. `fn_game_*` must be revoked from `anon` explicitly (see Q2).

### Gaps
- Vietnam-specific child-data rules (e.g. Decree 13/2023 on personal data) and their implications for a game with player-visible names were not researched here.
- No source-backed benchmark was found for what chat moderation approach schools accept.

---

## Q5. Recommended architecture (what runs where) and cost estimate

### Takeaway
Run a **self-hosted Colyseus 0.18 room server** (TypeScript) in **Singapore**, either on a ~$24/month VPS or on Colyseus Cloud if a Singapore region is confirmed. The room server handles movement, zones, party boss instances and turn orchestration. Every value-bearing outcome (catch roll, damage/turn resolution for turn-based combat, rewards, xu, EXP, collection) goes through **Supabase Postgres `fn_game_*` RPCs**. **Supabase Realtime** is used only for low-rate social notifications. The expected incremental cost is **≈$25–45/month**, versus ~$95 (Photon, but not authoritative), ~$400–800 (SpacetimeDB Maincloud, estimated) or ~$600+ (Heroic Cloud).

### Cited Findings
- DigitalOcean droplet prices: 1 vCPU/1 GB $6; 1 vCPU/2 GB $12; 2 vCPU/2 GB $18; 2 vCPU/4 GB $24 (4,000 GiB transfer included); 4 vCPU/8 GB $48; CPU-Optimized 2 vCPU/4 GB $42. Inbound bandwidth is free, and the 1 vCPU/1 GB plan includes 1,000 GiB. DigitalOcean operates a Singapore data center, and the page shows no regional price difference — [DigitalOcean droplet pricing](https://www.digitalocean.com/pricing/droplets)
- Colyseus Cloud "starting at $15/mo", no CCU limits, unlimited bandwidth — [Colyseus pricing](https://colyseus.io/pricing/)
- Photon Realtime 500 CCU costs $95/month and is a relay unless on Enterprise — [Photon Realtime pricing](https://www.photonengine.com/realtime/pricing)
- SpacetimeDB Pro costs $25 with 100,000 TeV ≈ 120M function calls ≈ 500 GB egress, and overage is 2,592 TeV/$ — [SpacetimeDB pricing](https://spacetimedb.com/pricing)
- Cloudflare DO: $0.15/M requests (incoming WebSocket messages 20:1), $12.50/M GB-s duration beyond 400k GB-s, with no duration billing when idle and hibernation-eligible — [Cloudflare DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- Heroic Cloud support plans cost $2,000–6,000/month, and a third-party source puts deployments from ~$600/month — [Heroic Labs pricing](https://heroiclabs.com/pricing/); [Toolradar](https://toolradar.com/tools/nakama/pricing)
- The Supabase Realtime overage price is $2.50/M messages, fan-out counted — [Supabase Realtime messages](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages)

### Inferences

**What runs where**

| Layer | Runs on | Responsibilities |
|---|---|---|
| Client (PWA) | Vercel (static) | Rendering, input, interpolation and prediction of own avatar; `supabase-js` login; `colyseus.js` over WSS; reads collection/inventory via `supabase.rpc('fn_game_*')` (RLS). Never computes rewards. |
| Realtime room server | Colyseus 0.18, Node 22, 1 process per vCPU, Docker/PM2 on a Singapore VPS (or Colyseus Cloud SG) | `ZoneRoom` channels (≤50–80 players, 10 Hz patches), `BossRoom` party instances (2–4, reserved seats), movement validation, spawn positions, turn timers, rate limits, JWT verification in `onAuth`. Holds only **ephemeral** state and calls Postgres for anything that persists. Does **not** use `@colyseus/database` for business data. |
| Business logic + persistence | Supabase Postgres (existing) | `fn_game_bat_thu` (catch RNG + insert + item use), `fn_game_luot_danh` / `fn_game_ket_thuc_boss` (turn resolution + rewards), `fn_game_cong_xu` with daily caps, idempotent `event_id`, append-only reward log with a history trigger. Tables carry `mon` only if the game data is learning data (CLAUDE.md §1.6); pure game-economy data follows the wallet rules. |
| Social / notifications | Supabase Realtime (private channels, RLS) | Party invites, friend presence, "you earned X xu" toasts via `realtime.send()` inside the same transaction. Never movement. |
| Why not Vercel for the room server | — | Vercel serverless functions are not long-lived WebSocket servers (prior knowledge, not re-verified in this session), so the room server needs its own host. |

**Capacity and bandwidth estimate for 500 CCU (my arithmetic, to be load-tested)**
- Downstream per client: ~50 visible entities × 10 Hz × ~12 B quantized delta ≈ 6 KB/s, plus WebSocket/TCP framing ≈ 6.5 KB/s ≈ 50 kbps. That is fine for mid-range Android on 4G.
- Server egress at 500 CCU: ≈3.3 MB/s ≈ 26 Mbps peak.
- Monthly transfer: at an average of 300 CCU over 4 h/day ≈ 0.85 TB/month, within the 4 TB included with a $24 droplet.
- CPU: 2 vCPUs should be enough for tile/2D movement plus turn-based combat for 500 CCU. This is unverified; run a load test before launch.

**Monthly cost comparison at ~500 peak CCU, 4 h/day peak (USD, incremental to the existing Supabase and Vercel spend)**

| Option | Estimate | Basis / caveat |
|---|---|---|
| **Colyseus self-host, DO SGP1 2 vCPU/4 GB + $6 staging** | **≈$30** (+ optional backups) | Droplet list prices; add a second $24 node only if the load test demands it. |
| Colyseus Cloud | from $15 (plan size for 500 CCU unknown) | Singapore region unconfirmed. |
| PartyKit / Cloudflare DO | ≈$25–65 | $5 Workers Paid base (not re-verified). 500 × 10 Hz × 4 h × 30 d = 2.16B incoming msgs ÷ 20 = 108M requests ≈ $16. Duration for ~12 always-ticking DOs at an assumed 128 MB ≈ $3 if they run 4 h/day, ≈ $43 if they tick 24/7. Excludes the effort of building a state-sync layer. |
| Photon Realtime 500 CCU | $95 | Relay, **not authoritative**, so it fails the requirement. |
| SpacetimeDB Maincloud Pro | ≈$400–800 | 10 Hz input reducers ≈ 2.16B calls ≈ 1.8M TeV, plus ~1.3 TB egress ≈ 0.26M TeV, minus the 100k credit, ÷ 2,592 ≈ $760 + $25. At 5 Hz ≈ $385. Rough, based on the published equivalences. Also a second database of record. |
| Heroic Cloud (Nakama) | ≈$600+ (+$2k support optional) | Third-party figure. |
| Supabase Realtime for movement | not possible (≈$270k theoretical, blocked by the 2,500 msg/s cap) | See Q2. |
| Hathora | n/a | Shut down 5 May 2026. |

- Supabase-side incremental load is small at this scale: roughly a few catches per player per minute plus turn RPCs (~50–150 RPC/s at peak). It may fit the current compute size, but this is unverified; check CPU during the load test.
- Upgrade path: if CCU grows past one VM, Colyseus scales horizontally with multiple processes or nodes (Redis presence/driver, or the experimental Postgres matchmaking driver from 0.17) without a rewrite. Colyseus Cloud is the managed fallback if ops becomes a burden.
- Rejected, with reasons:
  - SpacetimeDB: its own DB of record conflicts with Postgres-as-truth; no published region; open fan-out stall bug.
  - Nakama: manual state sync plus its own DB; Heroic Cloud is expensive.
  - Photon: not authoritative on affordable tiers.
  - Hathora: defunct.
  - Rivet: pivoting to AI workloads, so there is roadmap risk for games.
  - geckos.io: low activity, and UDP/TURN on school networks.
  - Raw uWS.js: the team would rebuild what Colyseus already provides.

### Gaps
- The current Supabase plan and price, compute add-on, and project region were not verified. Supabase compute upgrade costs were not fetched.
- The DO 128 MB billing assumption and the $5 Workers Paid base price were not re-verified in this session.
- There is no vendor benchmark for Colyseus CCU per vCPU. All capacity numbers are estimates pending a load test.
- The Colyseus Cloud price for a plan sized for 500 CCU, and whether it has a Singapore region, are unknown.
