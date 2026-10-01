# Duolingo's retention & motivation system — mechanics, evidence, criticism (as of Oct 2026)

> Researcher notes for BK Academy. Every claim has a source. **[D]** = Duolingo-reported (blog, shareholder letter, employee interview). **[I]** = independent (academic, journalism). **[2nd]** = secondary/aggregator, lower confidence.
> Method caveat: Lenny's Newsletter / podcast pages were read through a summarising fetch tool. Figures from them are reliable when quoted with a number. Softer phrasing ("massive win", "23.5 hours referenced") may have lost detail.

## Q1. Growth model: DAU accounting (CURR/NURR/RURR), and which metric moved DAU most

### Takeaway
Duolingo splits every user into mutually exclusive activity states and models DAU as flows between them. A sensitivity analysis found that improving **CURR** (current-user retention) moved DAU about 5x more than the next-best lever. That result made CURR the north star and pushed the team toward streaks, leagues and notifications for users who were already active. In 2026 CURR is still the headline retention metric, at an all-time high of 84%.

### Cited Findings
- **[D]** There are 7 user states. **New** = first day. **Current** = active today and on at least one other day in the prior 6 days. **Reactivated** = first day back after 7–29 days away. **Resurrected** = back after 30+ days. **At-risk WAU** = inactive today but active in the prior 6 days. **At-risk MAU** = inactive for 7 days but active in the prior 23. **Dormant** = inactive 31+ days. DAU = new + current + reactivated + resurrected. — [Lenny's Newsletter, Jorge Mazal "How Duolingo reignited user growth"](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** The retention rates are CURR, NURR (new), RURR (reactivated), SURR (resurrected), plus iWAURR/iMAURR (reactivation of at-risk users). — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** The test applied a 2% quarterly improvement to each metric over 3 years. **CURR had about 5x the DAU impact of the second-best metric**, and its impact on DAU was about 6x its impact on MAU. The reason is compounding: retained current users stay in the "current" bucket. iWAURR came second for DAU. — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** Context: Mazal became Head of Product in late 2017. By mid-2018, DAU growth had fallen to single digits year over year. Over about 4 years: CURR +21%, daily churn of the best users down more than 40%, DAU up 4.5x. The share of DAU on a 7+ day streak nearly tripled, to "more than half of DAU". — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** In Q3 2022, nearly 70% of DAU had a streak longer than 7 days, and DAU grew 51% year over year. — [Duolingo Q3 2022 press release / shareholder materials (SEC)](https://www.sec.gov/Archives/edgar/data/1562088/000156208822000163/q3fy22pressrelease.htm)
- **[D]** Q2 2026: DAU 58.7M (+23% YoY), MAU 140.6M (+10%), paid subscribers 12.7M (+17%). **CURR reached "an all-time high of 84%, up by about 1% from last year."** — [Duolingo Q2 2026 shareholder letter (SEC 8-K)](https://www.sec.gov/Archives/edgar/data/1562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- **[D]** The 2026 strategy is stated as prioritising "user growth and teaching better", looking for "ways to monetize that are not at odds with user growth" (for example, longer free trials). — [Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/1562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- **[D]** Q2 2025: DAU 47.7M (+40% YoY), MAU 128.3M. — [Q2 2025 shareholder letter (SEC)](https://www.sec.gov/Archives/edgar/data/1562088/000156208825000165/q2fy25duolingo6-30x25share.htm)

### Inferences
- DAU/MAU rose from about 37% (Q2 2025) to about 42% (Q2 2026), computed from the figures above. Duolingo grows by deepening daily habit more than by reaching more people. That is the same logic as the CURR finding.
- For BK, the student population is fixed and enrolled, so new-user acquisition hardly matters. The CURR-style metric is the one that fits: the share of students active today, among those active on at least one other day this week. It can be computed in Postgres from the activity tables the app already has.
- A pure CURR focus ignores learning. Duolingo itself now says "teaching better" alongside growth (see Q5).

### Gaps
- I did not retrieve the exact 2026 values of NURR/RURR. Duolingo does not publish them routinely.
- I found no published breakdown of how much each mechanic contributed to the CURR gain.

## Q2. Streaks: freeze, repair, wager, amulet, society, earn-back, milestones, daily goal

### Takeaway
Duolingo treats the streak as its single most important retention mechanic. It has run 600+ streak experiments in about 4 years. The published wins mostly come from (a) making the streak easier to start and keep (one lesson counts; freezes; repair), (b) celebrating milestones, especially day 7, and (c) social streaks. The effect is strongest early: going from day 2 to day 3 raises the chance of continuing by 50%, while going from day 200 to 201 adds only 0.5%.

### Cited Findings
- **[D]** From the blog post by Osman Mansur, 31 Jan 2022:
  - More than 6 million people were on a 7+ day streak.
  - Extending a streak from 2 to 3 days raises the likelihood of continuing by **50%**. Extending it from 200 to 201 days raises it by only **0.5%**.
  - Learners who reach a 7-day streak are **3.6x** more likely to complete their course.
  - New streak milestone animations raised the chance that a new learner returns after 7 days by **+1.7%**.
  - Letting learners equip **two** Streak Freezes instead of one raised daily active learners by **+0.38%**.

  — [Duolingo blog, "How Duolingo's streak builds habit"](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- **[D]** Mazal: users who reached a 10-day streak were much less likely to drop out. Iterations included the streak-saver notification, calendar views, animations, changes to Streak Freeze and streak rewards. — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** Jackson Shuttleworth (Group PM, Retention), in the "Behind the product: Duolingo streaks" episode:
  - 600+ streak experiments over about 4 years. The streak is described as Duolingo's biggest growth lever.
  - Simplifying the rule to "complete one lesson a day" made streaks more effective. Tying the streak to an XP goal had confused users.
  - The first 7 days are the critical window.
  - Changing the CTA from "continue" to **"commit to my goal"** was a big win. No figure was given in my source.
  - Features discussed: Streak Freeze, Perfect Streak, Streak Repair, Friends Streak, iOS widget, daily-goal opt-out.
  - Principle: "Streaks are an engaging tool, but they can't make up for a weak product."

  — [Lenny's Newsletter, "Behind the product: Duolingo Streaks"](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks); [transcript on GitHub](https://github.com/ChatPRD/lennys-podcast-transcripts/blob/main/episodes/jackson-shuttleworth/transcript.md)
- **[D]** Friend Streak launched around Q2 2024; users can share a streak with up to 5 friends. By Q4 2024, **one-third of DAU had a Friend Streak**. Management called it a home run because users are accountable to friends as well as themselves. — [Duolingo Q4/FY2024 shareholder letter](https://investors.duolingo.com/static-files/99006c40-d8cf-41ca-b5b1-c5cb1fa5ba88) (figure surfaced via search summary; see also [Q3 2024 letter](https://investors.duolingo.com/static-files/a1b3dab2-4153-4e35-83a6-d32ffb38f2bf))
- **[D]** In June 2026, a one-time "streak revival" event let users restore their longest streak. **15.4 million learners revived their streaks, including nearly 8 million who had no active streak.** It was cited as one of three drivers of Q2 2026 DAU acceleration, alongside product changes and marketing. Duolingo calls it a one-time event. — [Q2 2026 shareholder letter](https://www.sec.gov/Archives/edgar/data/1562088/000162828026053299/q2fy26duolingo6-30x26share.htm)

### Inferences
- The 50% versus 0.5% gradient means streak design pays off most in **days 1–7**. Milestone celebrations and protection should be front-loaded there, for example at days 3 and 7, rather than at day 100.
- Repair and earn-back clearly work as **re-engagement** tools. The June 2026 revival brought back about 8M people with no active streak. This links streaks to the RURR/SURR buckets, not only to CURR.
- For teens at BK: one lesson a day must be enough to keep the streak, and the unit must be a small, clear action, such as one Tự luyện set, not an XP threshold. Exam weeks and holidays call for a freeze or amulet equivalent so students do not feel punished. Hand out freezes generously; Duolingo's +0.38% DAU came from *more* forgiveness, not less.

### Gaps
- **Weekend Amulet, Streak Wager ("Double or Nothing"), Streak Society, Perfect Streak and earn-back:** I found no Duolingo-published effect sizes for these in this pass. Their mechanics are documented by fan sites (e.g., duoplanet), which I did not verify. Treat any specific number for them as unverified.
- Daily goal tuning: the only sourced point is simplifying to "one lesson a day" and the opt-out/commit framing. I found no A/B numbers on goal levels.
- The "23.5 hours" notification-timing detail appears in the podcast summary without context. Check the transcript before citing it.

## Q3. Leagues / leaderboards

### Takeaway
Weekly leagues have 30 people in each cohort and 10 tiers (Bronze → Diamond), with promotion and demotion. Duolingo reports **+17% learning time** and **3x as many highly engaged learners** from leagues. Independent research finds that leagues are the main source of "gamification misuse": XP farming, competitiveness and stress.

### Cited Findings
- **[D]** Leaderboards raised learning time by **17%**. The number of highly engaged learners (1+ hour a day, 5 days a week) **tripled**. D1/D7 retention improved significantly. Users are auto opted-in and progress simply by studying. The design came from a structured borrowing process: why does it work there, why might it work or fail here, and what must be adapted. The team had earlier failed with a Gardenscapes-style "moves counter" and with a referral programme (+3% new users only). — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[2nd]** Structure:
  - Each league has 30 users of the same tier, grouped by when they earned their first XP of the week.
  - The 10 tiers are Bronze, Silver, Gold, Sapphire, Ruby, Emerald, Amethyst, Pearl, Obsidian, Diamond.
  - Promotion slots shrink with tier: Bronze top 20, Silver top 15, Gold top 10, Sapphire to Pearl top 7, Obsidian top 5. Diamond has no promotion.

  — [Duolingo Fandom wiki, "League"](https://duolingo.fandom.com/wiki/League); [duoplanet guide](https://duoplanet.com/duolingo-leagues-the-essential-guide-everything-you-need-to-know/)
- **[2nd]** One analysis site claims "+25% lesson completion" from leagues. I did not verify it and it is not traced to Duolingo. — [Deconstructor of Fun Duolingo mechanics page](https://duolingo.deconstructoroffun.com/mechanics/leagues)
- **[I]** Hadi Mogavi et al., ACM Learning@Scale 2022: 9 years of Duolingo forum data plus 15 interviews. They identify **"gamification misuse"**, where learners fixate on the game layer and drift from learning. It has three causes: competitiveness, overindulgence in playfulness, and herding. Consequences: wasted time, lower learning performance, harm to well-being, and ethical concerns. — [arXiv 2203.16175, "When Gamification Spoils Your Learning"](https://arxiv.org/abs/2203.16175)
- **[I]** A systematic review of Duolingo literature (2012–2020) reports learner concerns: the hearts/lives system makes learning feel truncated, league competition distracts from learning goals, and notifications feel frequent and annoying. — [Shortt et al., CALL journal, systematic review](https://www.tandfonline.com/doi/full/10.1080/09588221.2021.1933540)

### Inferences
- Why cohorts of 30 grouped by timing: the race stays winnable and fresh every week, and the shrinking promotion slots make the higher tiers feel earned. This is my reading. Duolingo's own published rationale beyond "auto opt-in, progress by studying" was not found.
- BK risk: if league points come from activity volume, teens will farm the easiest items, which is the Hadi Mogavi failure mode. BK already caps points monthly and weights homework/tests/exams, which is safer. Leagues should rank *quality-weighted* points (Elo-adjusted, MCQ correctness) rather than raw volume.
- Small classes cannot fill cohorts of 30 with similar students. Cohorts would need to span grades or be smaller.

### Gaps
- I found no published Duolingo data on burnout, quit rates after demotion, or league effects on minors specifically.

## Q4. Other mechanics: XP, gems, hearts→energy, path, quests, notifications

### Takeaway
Duolingo reports large wins for **notification optimisation** (bandit algorithm: +0.5% DAU, +2% new-user retention) and for **Energy** (rare simultaneous gains in DAU, time spent and conversion). The 2022 **path** redesign shipped during a period of 51% DAU growth. Energy was also the most user-hated change of 2025.

### Cited Findings
- **[D/peer-reviewed]** Yancey & Settles, KDD 2020, "A Sleeping, Recovering Bandit Algorithm for Optimizing Recurring Notifications":
  - The Recovering Difference Softmax algorithm picks a reminder template. It models **novelty decay** (a template "recovers" after it rests) and **arm eligibility** (some templates apply only in some states).
  - Result: **+0.5% total DAU and +2% new-user retention** over a strong baseline.
  - The public dataset has 200M practice-reminder notifications over 35 days, with a conversion label for activity within 2 hours.

  — [paper PDF](https://research.duolingo.com/papers/yancey.kdd20.pdf); [ACM DL](https://dl.acm.org/doi/10.1145/3394486.3403351); [Harvard Dataverse](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/23ZWVI)
- **[D]** "Protect the channel": the team could optimise timing, templates, images, copy and localisation, but **could not increase notification volume without CEO approval**. The rule was a lesson from Groupon over-mailing. Result: "dozens of small- and medium-size wins", adding up to substantial yearly DAU gains. — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** Energy replaced Hearts for free users from about April 2025. Duolingo calls it "a pacing system for free users." Claimed results: the iOS rollout "increased DAUs, median time spent learning… and subscriber conversion. We have rarely seen a feature move more than one of these metrics, let alone all three." — [Q2 2025 shareholder letter](https://www.sec.gov/Archives/edgar/data/1562088/000156208825000165/q2fy25duolingo6-30x25share.htm)
- **[D via 2nd]** Duolingo's stated reason for the change: under Hearts every mistake cost a heart, and beginners were **2x more likely to run out mid-lesson**, which punished mistakes. Energy is spent per exercise instead (25 energy for free users). — [Class Central](https://www.classcentral.com/report/duolingo-breaks-hearts-for-energy/); [duoplanet](https://duoplanet.com/duolingo-energy-system/)
- **[I]** Backlash: users said Energy limits free learning to a few lessons. There was a viral Reddit thread, a Change.org petition "Hearts, Not Energy", and r/duolingo moderators stopped giving free support. — [Class Central](https://www.classcentral.com/report/duolingo-breaks-hearts-for-energy/); [Android Authority](https://www.androidauthority.com/quitting-duolingo-energy-system-3599842/); [Change.org](https://www.change.org/p/duolingo-hearts-not-energy)
- **[D]** Path redesign (2022): a new home screen with a linear path, characters that unlock as learners progress, and optional Side Quests. It came during a quarter of 51% DAU growth. — [Q3 2022 press release (SEC)](https://www.sec.gov/Archives/edgar/data/1562088/000156208822000163/q3fy22pressrelease.htm); [Q2 2022 letter](https://www.sec.gov/Archives/edgar/data/1562088/000156208822000133/duolingo_q2-2022xshareho.htm)
- **[D]** Failed experiments: a "moves counter" scarcity mechanic copied from Gardenscapes was "completely neutral", because in a learning app there is no strategy to the scarcity. A referral programme gave only +3% new users. — [Lenny / Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **[D]** Q2 2026: AI Video Call access was expanded, framed as "higher-quality learning at scale." — [Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/1562088/000162828026053299/q2fy26duolingo6-30x26share.htm)

### Inferences
- The bandit's useful idea for BK is cheap to copy: rotate reminder templates and rest each template after it is used. A template that has just been used has lower pull, and a rested one recovers. Score each template by its 2-hour conversion rate per student. Pair it with a hard cap on how many notifications a student gets, following "protect the channel".
- Energy shows that a monetisation-motivated limit can be framed as pedagogy but still be read by users as punishment. BK sells no subscription, so it has no reason to copy Energy or Hearts.
- The moves-counter failure suggests that game mechanics which do not interact with learning decisions add nothing. BK's "Thử thách ≥8/10" is good because the challenge *is* the learning.

### Gaps
- I found no published numbers for XP boosts, gems/lingots economy, Daily Quests, Friend Quests, Monthly Challenges/badges, Duolingo Score or the Practice Hub. Duolingo mentions them as engagement tools but gives no effect sizes in the sources I retrieved.
- I found no quantified effect of the passive-aggressive owl tone or the "we'll stop sending reminders" message, and no published "best send time" result beyond the bandit's 2-hour conversion window.
- Onboarding "try before sign-up" (deferred registration): it is widely cited as a Duolingo pattern, but I found no Duolingo-published effect size in this pass.

## Q5. Criticism: dark patterns, anxiety, gamification vs learning, effectiveness evidence; teen relevance

### Takeaway
Most efficacy evidence is **commissioned by Duolingo**. Independent studies are small and poorly controlled. The best-documented harm is gamification misuse driven by leagues and XP. The 2025 Energy change shows the cost of mechanics that users see as monetisation. Evidence specific to teens is thin; one 2024 study looked at Chinese junior-high students and intrinsic motivation.

### Cited Findings
- **[I]** A systematic review of Duolingo research (2012–2020) found mostly positive reported effects. But it judges the accuracy of those results "debatable" because few studies have substantial samples or control for confounders. It also notes a lack of independent researchers; for example, Vesselinov & Grego (2012) was commissioned. — [Shortt et al., CALL systematic review](https://www.tandfonline.com/doi/full/10.1080/09588221.2021.1933540)
- **[D]** Duolingo hosts its own efficacy report (manuscript marked "Received: 28 October 2020"). It compares Duolingo learners with university semesters on reading and listening. I did not verify the authors or the exact findings in this pass. — [Duolingo efficacy report PDF](http://static.duolingo.com/s3/DuolingoReport_Final.pdf)
- **[I]** Hadi Mogavi et al. (L@S 2022) document gamification misuse: competitiveness, playfulness and herding lead to wasted time, lower learning and harm to well-being. — [arXiv 2203.16175](https://arxiv.org/abs/2203.16175)
- **[I]** Learners also report activities that are repetitive and translation- or receptive-heavy, with weak productive skills. — [CALL systematic review](https://www.tandfonline.com/doi/full/10.1080/09588221.2021.1933540)
- **[I, teen-relevant]** Zeng & Fisher (2024), ECNU Review of Education: out-of-class Duolingo use and the **intrinsic motivation** of Chinese **junior high school** students learning English. I could not retrieve the full text (fetch failed), so I cannot report its findings. — [SAGE](https://journals.sagepub.com/doi/full/10.1177/20965311231171606)
- **[D]** Duolingo itself said in 2026 that it is now prioritising "teaching better" and monetisation "not at odds with user growth". This implicitly concedes that the 2025 monetisation push created friction. — [Q2 2026 letter](https://www.sec.gov/Archives/edgar/data/1562088/000162828026053299/q2fy26duolingo6-30x26share.htm)

### Inferences
- **Which mechanics matter most** (ranked by published Duolingo evidence):
  1. **Streaks**, including protection, milestones and social Friend Streak: biggest by their own account; 600+ experiments; 7+ day streakers are more than half of DAU; Friend Streak reached 1/3 of DAU.
  2. **Leagues**: +17% learning time, 3x highly engaged learners.
  3. **Notification optimisation** under a volume cap: +0.5% DAU and +2% new-user retention from the bandit alone, plus many smaller wins.
  4. **Path and Energy**: large claimed effects, but confounded by monetisation and heavy criticism.
  5. **Referral programmes and scarcity mechanics unrelated to learning**: shown not to work.
- For a tutoring centre whose app is tied to real classes, the "gamification over learning" critique matters more than for Duolingo, because BK's goal is test performance. Every mechanic that awards points should award *verified learning events*, which BK already does through homework, tests and Elo. It should not award raw activity.
- For teens, the anxiety risks are loss-aversion on long streaks and public demotion. Generous streak protection (freezes, exam-week amulet, repair) and private or opt-in league views reduce these risks. This is my inference; I found no teen-specific RCT.

### Gaps
- I found no independent RCT on the retention or learning effects of streaks or leagues in adolescents.
- Zeng & Fisher (2024): full findings not retrieved.
- I did not search Vietnamese consumer-protection rules on gamified rewards for minors in this pass. A separate BK note covers Decree 147/2024 for game coin rewards.
