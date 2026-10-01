# Connecting a game to learning without ruining either — integration models, guardrails, measurement (as of Oct 2026)

Scope: BK Academy student app (grades 6–12), daily farm game (seeds bought with "effort points" earned only when a 10-question practice set is ≥70% correct, cap 30/day) and a Palworld-like creature-catching game (currently not tied to learning). Goal: more time in app, daily habit, inspiration, without hurting learning or parents' trust; business is tuition-based.

Evidence-strength legend used below: **[STRONG]** = meta-analysis or randomized trial, independent; **[MODERATE]** = single controlled study / small RCT / company A/B test with numbers; **[WEAK]** = correlational, vendor-commissioned, survey, or anecdote.

---

## Q1. Integration models and their evidence — which produce learning gains vs only engagement?

### Takeaway
The best-supported model for *learning* is (a) intrinsic integration — the learning action IS the core game action — and games help mainly when played over multiple sessions; extrinsic "earn currency by studying" (b/c) reliably raises quantity of activity and return visits but has weak or negative evidence for learning and intrinsic motivation, especially for children; a separate game sharing only identity (d) buys engagement with the *app*, not learning. Gamification overall shows small positive effects, but effects fade after ~4 weeks (novelty) and partially recover later.

### Cited Findings
**(a) Intrinsic integration**
- [MODERATE] Habgood & Ainsworth (2011), *Journal of the Learning Sciences*: math game "Zombie Division" for 7–11-year-olds. Study 1: 58 children played intrinsic, extrinsic, or control variants for 2 hours with their teacher; Study 2: 16 children had free choice between intrinsic and extrinsic versions. Children learned more from the intrinsic version under fixed time and spent **7× longer** playing it when free to choose. — [Habgood & Ainsworth 2011 (PDF)](https://tecfa.unige.ch/tecfa/teaching/BSEP/articles/Habgood_Ainsworth_2011.pdf); [ResearchGate record](https://www.researchgate.net/publication/233279860_Motivating_Children_to_Learn_Effectively_Exploring_the_Value_of_Intrinsic_Integration_in_Educational_Games)
- In the extrinsic variant, the math was a quiz between game levels (the "drill then reward" pattern); in the intrinsic variant, dividing was the combat mechanic itself (zombies carry numbers, weapons are divisors). — [Habgood & Ainsworth (SHU repository)](https://shura.shu.ac.uk/3556/1/Habgood_Ainsworth_final.pdf) (note: small sample, single game, primary age; not replicated at scale).
- Bruckman (1999) coined "chocolate-covered broccoli": "Fun is often treated like a sugar coating to be added to an educational core"; the typical pattern is drill-and-practice followed by a quick unrelated game, which assumes learning is unpleasant. — [KQED MindShift summary](https://www.kqed.org/mindshift/20765/whats-the-secret-sauce-to-a-great-educational-game); [ToonTalk "Does Easy Do It?"](http://toontalk.com/English/easydoit.htm)

**Games / gamification in general**
- [STRONG] Clark, Tanner-Smith & Killingsworth (2016), *Review of Educational Research*: digital games vs nongame conditions g = 0.33 (95% CI 0.19–0.48, k = 57); augmented vs standard game designs g = 0.34 — effects vary with game mechanics and design, "the key role of design beyond medium". — [ERIC EJ1090510](https://eric.ed.gov/?id=EJ1090510)
- [STRONG] Same meta-analysis: **multiple game sessions g = 0.44** (CI 0.29–0.59) vs **single session g = 0.08** (CI −0.24–0.39, not significant); games with vs without extra non-game instruction 0.36 vs 0.32 (little difference). — [SAGE / DOI 10.3102/0034654315582065](https://journals.sagepub.com/doi/10.3102/0034654315582065) (figures via search-result extract; full text not fetched — verify before quoting externally)
- [STRONG] Sailer & Homner (2020), *Educational Psychology Review*, meta-analysis of gamification: cognitive g = 0.49 (k = 19, N = 1,686), motivational g = 0.36 (k = 16, N = 2,246), behavioral g = 0.25 (k = 9, N = 951). The cognitive effect held in high-rigor studies; motivational and behavioral effects were **less stable** under rigor. — [ERIC EJ1245270](https://eric.ed.gov/?id=EJ1245270)
- [STRONG] Sailer & Homner moderators: game fiction (narrative) and **combining competition with collaboration** were particularly effective for behavioral outcomes; pure competition can thwart relatedness. — [Sailer & Homner full text (d-nb.info)](https://d-nb.info/1202307655/34)
- [MODERATE] Rodrigues et al. (2021/2022), longitudinal: gamification effect starts dropping **after ~4 weeks** (novelty effect), decline lasts 2–6 weeks, then recovers between weeks 6 and 10 (familiarization effect) — U-shape. — [IJETHE, SpringerOpen](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-021-00314-6)
- [MODERATE] Hanus & Fox (2015), *Computers & Education*, 71 students over a semester: gamified course (badges, leaderboard) students became **less** intrinsically motivated, satisfied and empowered over time, and scored **lower on the final exam**, mediated by lower intrinsic motivation. — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000)

**(b) Extrinsic: learning earns currency/energy (Prodigy, Duolingo gems, Habitica)**
- [STRONG] Deci, Koestner & Ryan (1999), 128 experiments: tangible rewards significantly undermine free-choice intrinsic motivation — engagement-contingent d = −0.40, completion-contingent d = −0.36, performance-contingent d = −0.28; positive verbal feedback **enhanced** free-choice behavior (d = +0.33) and interest (d = +0.31). Tangible rewards were **more detrimental for children** than college students. — [Deci, Koestner & Ryan 1999 (PDF)](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf); counter-view: Eisenberger, Pierce & Cameron comment disputing the analysis — [PubMed 10589298](https://pubmed.ncbi.nlm.nih.gov/10589298)
- [WEAK] Prodigy Math (curriculum-aligned math questions drive turn-based battles; currency/pets/gear): Johns Hopkins CRRE evaluation, **commissioned by Prodigy**, meets ESSA **Tier 3** (correlational): students in grades 1, 2, 4 who mastered more skills in Prodigy scored higher on spring MAP controlling for fall MAP. — [Prodigy "Does Prodigy work?"](https://www.prodigygame.com/main-en/blog/prodigy-works); [JHU evaluation](https://jscholarship.library.jhu.edu/bitstreams/c38fbad0-2746-4c00-8654-5d0854d2a99c/download)
- [WEAK, adversarial] Fairplay + 21 groups' FTC complaint (Feb 2021): in a given play period children saw up to **4× more advertisements than math exercises**; premium membership ($59.88–$107.40/yr) marketed to kids for swag and faster leveling; learning claims allegedly unsubstantiated. Prodigy disputes. — [Fairplay press release](https://fairplayforkids.org/feb-19-2021-advocates-to-ftc-prodigy-math-game-preys-on-kids-and-families/); [EdWeek](https://www.edweek.org/technology/popular-interactive-math-game-prodigy-is-target-of-complaint-to-federal-trade-commission/2021/02)
- [WEAK/qualitative] Duolingo leagues: weekly XP competition of 30 users; "XP farming" (doing whichever activity yields most XP for least effort) and league compulsion reported to disrupt learning for some users. — [arXiv: "When Gamification Spoils Your Learning" (qualitative case study)](https://arxiv.org/pdf/2203.16175); [Duolingo leagues guide](https://duoowl.com/duolingo-leagues-guide/)

**(c) Game as reward/break after study**
- No independent study found that isolates "play-after-study" as a learning intervention. Its theoretical risk is exactly Bruckman's critique and Deci et al.'s completion-contingent reward effect (d = −0.36 on free-choice motivation). — sources above.

**(d) Separate game sharing only identity/social**
- No rigorous evidence found that a separate, unlinked game improves learning outcomes. Clark et al. show effects come from what the game makes you *do* (design/mechanics), implying an unlinked game contributes ~0 to learning — [ERIC EJ1090510](https://eric.ed.gov/?id=EJ1090510).

### Inferences
- For BK: the farm game is model (b) gated on performance (≥70%) — this is the weakest-evidence combination for *learning* (performance-contingent tangible reward + output incentive, see Q3 Fryer). It is fine as a **habit/retention** device, but should not be presented to parents as "learning".
- The creature game can only produce learning value if at least one core verb (catching, battling, evolving) is performed *through* solving problems in BK's knowledge points (KP/`ma_dang`), i.e. move toward (a). A pure (d) design is defensible only as an app-retention feature and must be capped.
- Expect novelty decay around week 4; any pilot shorter than ~10 weeks will over- or under-estimate the long-run effect.
- Design toward narrative + collaboration-with-competition (Sailer & Homner), not individual leaderboards (Hanus & Fox).

### Gaps
- No large independent RCT of a commercial "earn currency by practice" product (Prodigy, Duolingo gems, Habitica) on learning outcomes was found.
- Intrinsic integration evidence is a small primary-school sample; no grade 6–12 replication found.
- Effect of a *separate* game on tutoring retention/renewal: no published evidence found.

---

## Q2. Specific mechanics to tie a creature game to study — evidence or case studies

### Takeaway
Of the proposed mechanics, only "boss fights as quiz battles" has a large-scale commercial precedent (Prodigy), and its evidence is correlational and vendor-commissioned; class-wide cooperative goals are supported by the meta-analytic finding that collaboration + competition works best, and Classcraft is a real-world precedent but with weak study designs; streaks have strong *retention* A/B evidence from Duolingo but nothing showing learning gains. "Skills unlocked by mastering topics" is the mechanic closest to intrinsic integration, but no direct study was found.

### Cited Findings
- **Quiz battles (Prodigy model)** — [WEAK for learning] Prodigy battles require answering curriculum math questions; Tier-3 correlational evidence only (see Q1). Critics count ads and cosmetic loops outnumbering math exercises 4:1 in a play window. — [Prodigy research page](https://www.prodigygame.com/main-en/research); [Fairplay "A Losing Equation"](https://fairplayforkids.org/prodigy-losing-equation/)
- **Intrinsic version of battles** — [MODERATE] Zombie Division's combat *was* division (choose the divisor that defeats the number) and beat a quiz-between-levels variant on both learning and voluntary time (7×). — [Habgood & Ainsworth 2011](https://tecfa.unige.ch/tecfa/teaching/BSEP/articles/Habgood_Ainsworth_2011.pdf)
- **Class-wide / team raids** — [STRONG for the principle] combining competition with collaboration was the most effective social configuration for behavioral outcomes. — [Sailer & Homner](https://d-nb.info/1202307655/34)
- [WEAK] Classcraft (team-based RPG classroom management: students earn points for behavior, level avatars, support teammates): small studies/surveys report better collaboration and engagement (e.g. one survey: 84% of 50 students reported improved motivation). — [Pressbooks summary](https://pressbooks.pub/techandcurr2019/chapter/gamified-classroom/); [ACM study](https://dl.acm.org/doi/pdf/10.1145/3316615.3316669)
- **Streaks** — [MODERATE, retention only] Duolingo (2017 post): "Streak Wager" (bet gems on keeping a 7-day streak) gave statistically significant gains in D1/D7/D14 retention, **D7 +14%**; "Weekend Amulet" (skip weekend without losing streak) made learners 4% more likely to return a week later and 5% less likely to lose their streak. Duolingo also found learners who **binge** lessons were much more likely to abandon than those who pace themselves. — [Duolingo blog, May 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
- [MODERATE, via search snippet — not fetched] Duolingo later reported separating daily goal from streak gave +3.3% D14 retention, +1% daily active learners; and >600 experiments on the streak alone over four years. — [Duolingo blog "Improving the streak"](https://blog.duolingo.com/improving-the-streak)
- **Practice-earned energy/balls** — no independent study found; theory = completion-/performance-contingent tangible reward (Deci et al. d = −0.28 to −0.36 on later free-choice motivation). — [Deci et al. 1999](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf)
- **Real homework engine as a baseline** — [STRONG] ASSISTments online math homework (immediate feedback, no game layer), RCT with 46 schools / 3,035 7th graders: g = 0.18 on end-of-year standardized math (~60% of a year's expected gain), with **low-prior-achievement students benefiting most**. — [Roschelle et al. 2016, AERA Open](https://journals.sagepub.com/doi/full/10.1177/2332858416673968)

### Inferences
- Ranked by expected learning value for BK: (1) creature abilities/evolution unlocked by **KP mastery** computed in Postgres (mastery is already derived per HS × `ma_dang`) — closest to intrinsic integration; (2) boss fights where each attack is a problem from the student's **weak KPs** (the boss "weakness" maps to a dạng) — quiz-battle but targeted; (3) class raids powered by homework/ET completion — supports habit + collaboration, little direct learning effect, but aligns with what ASSISTments shows matters (doing the homework with feedback); (4) catch balls/energy from practice — retention device only; (5) streaks — retention device only, add a "freeze/weekend amulet" equivalent to avoid streak anxiety and bingeing.
- Under BK's §1.6 rule every learning-tied mechanic must be scoped by `mon` (subject) — a raid or boss must be "Toán raid", not generic, if it consumes learning data.
- Prodigy's main reputational risk was monetization + ad load, not the battle mechanic itself; the xu wallet (redeemable) creates an analogous risk if game items can be bought with xu.

### Gaps
- No controlled study found of class-wide cooperative raids powered by homework completion.
- No study found on "skills unlocked by mastery" in a creature/collection game.
- No published Prodigy A/B results on retention vs learning trade-offs.

---

## Q3. Guardrails — time caps, study-first gates, effort vs correctness, cheating incentives, weaker students

### Takeaway
Reward inputs (effort/attempts done properly), not outputs (score thresholds): Fryer's large field experiments found input incentives raised achievement while output incentives did not. A ≥70%-correct gate is an output incentive that invites "gaming the system" (systematic guessing) — a behavior seen in 10–40% of tutor users and tied to worse learning — and structurally excludes weaker students, who are the ones who benefit most from practice. Vietnam law already imposes game time caps for under-18s.

### Cited Findings
- [STRONG] Fryer (2011, *QJE*), randomized trials in 250+ urban US schools: incentives for **inputs** (e.g. books read) raised achievement; incentives for **outputs** (test scores/grades) had little or no effect — students "do not know the educational production function". — [Fryer, Harvard page](https://fryer.scholars.harvard.edu//publications/financial-incentives-and-student-achievement-evidence-randomized-trials); [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1587225)
- [STRONG/replicated] "Gaming the system" (Baker et al.): exploiting system properties instead of learning — systematic guessing, hint abuse; students who game learn less than non-gamers with similar pretest; estimated 10–40% of students game at least intermittently; "harmful" gaming concentrates on the steps the student knows **least**. — [LearnLab Theory Wiki](https://learnlab.org/wiki/index.php?title=Gaming_the_system); [arXiv 2601.04487](https://arxiv.org/html/2601.04487); [Baker, detecting gaming (PDF)](https://learninganalytics.upenn.edu/ryanbaker/paper8.pdf)
- [STRONG] Low-achieving students benefited most from online homework with feedback (ASSISTments RCT) — so a gate that locks them out of the reward loop withholds engagement from the group with most upside. — [Roschelle et al. 2016](https://journals.sagepub.com/doi/full/10.1177/2332858416673968)
- [STRONG] Positive informational feedback increases intrinsic motivation (d ≈ +0.33), tangible rewards decrease it; so pair any reward with informational feedback about progress, not just currency. — [Deci et al. 1999](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf)
- [MODERATE] Duolingo: bingeing predicts abandonment → pacing/caps help retention, not only wellbeing. — [Duolingo blog 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
- [LEGAL, Vietnam] Decree 147/2024/NĐ-CP: for players under 18, max **60 minutes per game per day** and **180 minutes total per day**, applies to all game classes G1–G4; publishers must have technical systems to manage under-18 daily play time. A 2025 draft amendment proposes under-16s be limited to 60 min/day total. — [VTV](https://vtv.vn/cong-nghe/gioi-han-thoi-gian-choi-game-voi-nguoi-duoi-18-tuoi-20241118081729679.htm); [Thư viện pháp luật (draft amendment)](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/118304/de-xuat-gioi-han-gio-choi-game-cua-tre-con-60-phut-moi-ngay-thay-vi-180-phut); [Thanh Niên](https://thanhnien.vn/de-xuat-tre-duoi-16-tuoi-chi-duoc-choi-game-60-phut-ngay-lieu-co-kha-thi-185260725055817146.htm)
- [WEAK/qualitative] Leaderboards demoralize those who cannot compete and push others into excessive grinding; gamification can encourage cheating. — [arXiv qualitative case](https://arxiv.org/pdf/2203.16175); Hanus & Fox (leaderboards/badges lowered intrinsic motivation) — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000)

### Inferences
- Replace "≥70% correct ⇒ points" with an **input-based, anti-gaming** rule, e.g.: points for completing a set *with genuine attempts* (minimum time-per-question, no rapid-fire answer patterns, corrections reviewed), plus a **personal-improvement bonus** relative to the student's own KP mastery baseline (so a weak student improving from 30%→50% earns as much as a strong one at 90%). Keep the daily cap (already 30/day) — caps blunt farming.
- Serve questions at the student's level (weak KPs), not a fixed threshold — a fixed threshold rewards picking easy KPs if students can choose.
- Detect guessing server-side (Postgres function per §2.0): median seconds/question, answer-change patterns, accuracy collapse on harder items; flagged sets earn 0 points silently or "effort not counted, try again".
- Hard time caps should be enforced in DB/server, and the creature game would likely fall under Decree 147 if it is an online game for under-18s (legal classification needs checking); a self-imposed cap well under 60 min/day plus a **night curfew** (e.g. no play after 22:00 VN time) is a parent-trust feature.
- "Study first" gate: acceptable as habit design, but frame as "the game is powered by your study", not "study to unlock fun" (avoid the chocolate-broccoli message).
- Never let xu (redeemable) buy game advantage, or game earn redeemable xu — otherwise the game becomes a farming target with real value, maximizing cheating incentive.

### Gaps
- No study found that tests input-vs-output reward rules *inside* a learning game specifically (Fryer is cash, field setting).
- Legal classification of an in-app game inside a tutoring app under Decree 147 (G1–G4 licensing) not researched here.

---

## Q4. Measurement — metrics and experiments to judge success and detect harm

### Takeaway
Use a two-ledger scorecard — engagement/retention (DAU/WAU, D1/D7/D30, streak continuation) and learning/business (homework completion, KP mastery growth on held-out measures, test scores, renewal) — and treat learning metrics as **guardrails that can veto** an engagement win. Randomize by **class** (cluster), not by student, run ≥10 weeks to pass the novelty dip, and keep a no-game holdout. Industry practice (Duolingo) is many small A/B tests on retention; Khan Academy's efficacy work ties usage dosage to a normed external test.

### Cited Findings
- [MODERATE] Duolingo measures features by D1/D7/D14 retention and daily active learners (e.g. Streak Wager D7 +14%; Weekend Amulet +4% week-later return); >600 streak experiments in four years. — [Duolingo blog 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/); [Duolingo "Improving the streak"](https://blog.duolingo.com/improving-the-streak)
- [MODERATE] Duolingo growth lead's A/B testing tenets (First Round Review). — [First Round Review](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker/)
- [MODERATE/correlational] Khan Academy efficacy (Nov 2024): ~350K students grades 3–8 (2022–23); **30+ min/week (18+ h/year)** associated with ~20% greater-than-expected gains on NWEA MAP Growth (effect size 0.36); only ~9% of students reached that dosage; 9–18 h/year → ~7% greater-than-expected gains. — [Khan Academy blog, Nov 2024](https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/)
- [MODERATE] Khan Academy has used causal-inference methods for MAP Accelerator across subgroups. — [EDM 2022 industry track](https://educationaldatamining.org/edm2022/proceedings/2022.EDM-industry-track.112/index.html)
- [STRONG design precedent] ASSISTments RCT randomized at **school** level (46 schools), outcome = external standardized test, effect g = 0.18 reported against expected annual gain. — [Roschelle et al. 2016](https://journals.sagepub.com/doi/full/10.1177/2332858416673968); [SRI "How big is that?"](https://www.sri.com/publication/education-learning-pubs/digital-learning-pubs/how-big-is-that-reporting-the-effect-size-and-cost-of-assistments-in-the-maine-homework-efficacy-study/)
- [STRONG] Khan Academy/PERTS ran a growth-mindset message RCT within the platform on ~265,000 students (message vs neutral/no message above exercises) — precedent for in-product randomized messaging tests. — [EdSource 2015](https://edsource.org/2015/khan-academy-launches-ambitious-math-challenge/74454)
- [MODERATE] Novelty decline after ~4 weeks, recovery weeks 6–10. — [Rodrigues et al.](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-021-00314-6)
- [STRONG] Gamification's behavioral/motivational effects are less stable under rigorous designs than cognitive effects — i.e. engagement gains are the ones most likely to be over-estimated by weak designs. — [Sailer & Homner](https://eric.ed.gov/?id=EJ1245270)
- [MODERATE] Students who game the system learn less — so "more questions answered" can rise while learning falls; need accuracy and speed-pattern metrics. — [LearnLab](https://learnlab.org/wiki/index.php?title=Gaming_the_system)

### Inferences (proposed plan for BK)
- **Primary engagement metrics:** student DAU/WAU, D1/D7/D30 retention of app use, % students with ≥4 study-days/week, practice sets completed/week, streak continuation.
- **Primary learning/business metrics (veto power):** homework (BTVN) and ET completion rate; KP mastery growth per subject on questions *not* used for game rewards (held-out); in-center test scores; attendance; tuition renewal/churn per term; parent complaints.
- **Harm detectors:** game minutes/day distribution (p90), sessions after 22:00 and before 06:00 VN time, game-time vs study-time ratio, guessing signals (sub-N-seconds answers, accuracy drops), score trajectory of heavy players vs matched light players, weaker-student share of rewards (are bottom-quartile students earning anything?).
- **Design:** cluster-randomize by class (or by class-subject) — students in one class talk and share, so student-level A/B contaminates; stratify by grade and subject; keep a no-game (or delayed-access, waitlist) holdout as ASSISTments did; minimum 10–12 weeks to pass the novelty dip; pre-register decision rules ("ship only if engagement ↑ and no significant ↓ in mastery/test scores, and late-night play < X%").
- **Renewal** moves slowly (per term) and the center is small, so treat renewal as a long-run monitored metric, not a short A/B outcome; leading proxies = attendance and homework completion.
- Following CLAUDE.md §2.0, all these metrics must be computed by `fn_*` Postgres functions, not client-side.

### Gaps
- No public Prodigy or Duolingo experiment found that reports a learning metric used as a guardrail against an engagement win.
- No evidence found linking in-app games to tuition renewal/churn at tutoring centers.
- Duolingo numbers are company blog claims (2017); no independent replication.

---

## Q5. Parent communication — how edu companies present games to parents

### Takeaway
Leading game-based edu products sell parents on **visibility of learning** (dashboards, monthly progress reports with questions answered and curriculum progress), not on the game; the main trust failure on record (Prodigy FTC complaint) came from hidden monetization and ad load aimed at kids. In Vietnam, legal time caps for under-18 gaming give a ready-made framing for time controls.

### Cited Findings
- [WEAK/vendor] Prodigy parent accounts: dashboard with grade level, weekly questions answered, curriculum progress; a **monthly email report** comparing to previous month; paid members can set goals and send in-game "cheers". No screen-time control found in the search results. — [Prodigy parents page](https://www.prodigygame.com/main-en/parents); [Prodigy report card blog](https://www.prodigygame.com/main-en/blog/report-card-tool); [Prodigy Zendesk: Parent Membership Perks](https://prodigygame.zendesk.com/hc/en-us/articles/360045401352-Parent-Membership-Perks)
- [WEAK, adversarial] Trust failure: advocacy groups alleged Prodigy marketed as "free" while pushing premium to children, with up to 4× more ads than math in a play period. — [Fairplay complaint PDF](https://fairplayforkids.org/wp-content/uploads/2021/02/Prodigy_Complaint_Feb21.pdf); [EdWeek](https://www.edweek.org/technology/popular-interactive-math-game-prodigy-is-target-of-complaint-to-federal-trade-commission/2021/02)
- [LEGAL/public sentiment, Vietnam] Vietnamese media frame family and school as the key "checkpoint" for children's game time; public debate in 2025 on tightening to 60 min/day for under-16s. — [Trẻ em Việt Nam](https://treemvietnam.net.vn/gioi-han-thoi-gian-choi-game-voi-tre-duoi-16-tuoi-gia-dinh-va-nha-truong-la-chot-chan-quan-trong-nhat-d9168.html); [Thanh Niên](https://thanhnien.vn/de-xuat-tre-duoi-16-tuoi-chi-duoc-choi-game-60-phut-ngay-lieu-co-kha-thi-185260725055817146.htm)

### Inferences
- Present the games to parents as "the study app's reward for regular practice", show the **study** numbers first (practice sets, homework done, KP mastery by subject) and game minutes second, with an explicit daily cap and night curfew stated up front (aligned with Decree 147 spirit).
- Give parents a control (e.g. lower the cap, disable the creature game) — no evidence found on its effect, but it addresses the documented trust failure mode.
- Never let the game become a sales channel (no paid items, no xu-for-advantage); the Prodigy case shows this is what triggers parent/advocacy backlash.
- Report in the existing parent channel (monthly/weekly), contrasting "this month vs last month" as Prodigy does.

### Gaps
- No rigorous study found on parent trust or tuition retention effects of game features in tutoring/edtech.
- Duolingo/Khan Academy parent-facing game messaging not researched in depth (Khan Academy Kids, Duolingo family plan) — limited tool budget.
- Vietnamese parent attitudes specifically toward games inside tutoring apps: no survey data found.
