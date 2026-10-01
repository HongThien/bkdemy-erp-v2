# Retention & motivation mechanics in non-Duolingo learning, habit, pet and teen-social apps (as of Oct 2026)

Scope note: research pass of about 17 search/fetch calls on 2026-10-01. Many app-level numbers come from third-party estimators (Sensor Tower via blogs) or company blogs. They are flagged inline. Several apps named in the brief were not covered with sources in this pass; they are listed under Gaps instead of being described from memory.

## Q1. Ed apps (Khan Academy, Quizlet, Brilliant, Photomath/Gauth, Kahoot, Quizizz/Wayground, Prodigy, Byju's, Zuoyebang/Yuanfudao, Vietnamese apps): which retention features they use and what results are reported

### Takeaway
The edu apps with the best evidence tie motivation to doing the work: Khan's mastery and skills-to-proficient, a light streak where one problem counts, and live in-class quizzes such as Kahoot/Quizizz. Prodigy, the main "pets + battles" edu game, shows how a pet/collection layer can crowd out the learning and become a monetization funnel. In Vietnam the most-used lever is the ranked competition arena (VioEdu), not streaks.

### Cited Findings
**Khan Academy**
- Khan Academy says students using Khan for 30+ minutes a week (18+ hours a school year) see about 20% greater-than-expected gains on the MAP Growth assessment, consistent across demographic groups. This is correlational usage data from Khan itself. — [Khan Academy Efficacy Results, Nov 2024](https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/)
- Each extra skill practiced to proficient or mastered is linked to about 0.5 pp of learning gains. Students who added 15–30 skills (about 20K students, ~10% of the sample) averaged about 15 pp gains. — [Khan Academy Efficacy Results](https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/)
- Khan moved its success metric to "skills to proficient" rather than time or points, so the metric itself rewards mastery. — [Khan blog: skills to proficient](https://blog.khanacademy.org/why-khan-academy-will-be-using-skills-to-proficient-to-measure-learning-outcomes/)
- Streaks and Levels (post dated Apr 21, 2025): a "No zero days" framing in which "one practice problem is enough to keep the streak alive". Khan reports half a million students kept streaks alive in one week, 16M+ clicks on "Next Up", and says streak users "advance more rapidly toward proficiency". These are internal numbers with no control group. The post does not mention streak freezes. — [Khan blog: Keeping your streak alive](https://blog.khanacademy.org/?p=19368)
- A district study found that students who did 30–60 minutes a week of mastery practice grew 33% more in math than students who did under 15 minutes a week. — [search summary of Khan blog / Cult of Pedagogy](https://www.cultofpedagogy.com/khan-mastery-learning/) (weak: seen via search snippet, not fetched)

**Kahoot / Quizizz (live competition)**
- Meta-analysis of 36 experiments: Kahoot and Quizizz have a moderate-to-large positive effect on learning outcomes (combined ES 0.775). Quizizz performed better than Kahoot, and both worked best for procedural knowledge and for humanities/social sciences. — [ACM ICETC meta-analysis](https://dl.acm.org/doi/10.1145/3498765.3498781)
- Kahoot meta-analysis (Özdemir 2025, J. Computer Assisted Learning): achievement ES 0.772, retention of learning ES 1.492, motivation ES 0.960. Here "retention" means remembering content, not app retention. — [Wiley JCAL](https://onlinelibrary.wiley.com/doi/10.1111/jcal.13084)

**Prodigy (pets + battles, the closest analogue to BK's pet game)**
- Students win monster battles by solving math questions, and can "rescue" a defeated monster as a pet. — [Prodigy blog](https://www.prodigygame.com/main-en/blog/what-is-prodigy-math-game)
- Fairplay's FTC complaint (Feb 2021) reports an 8-year-old who spent almost the whole session on non-math activities (shopping, digging, looking at pets). It also counted 16 membership ads against 4 math problems in 19 minutes, and describes a "dull vs jewel-encrusted chest" upsell after each win. Premium costs up to $120 per child per year. This is an advocacy source, but specific and observational. — [Fairplay complaint PDF](https://fairplayforkids.org/wp-content/uploads/2021/02/Prodigy_Complaint_Feb21.pdf); [Fairplay: 7 reasons](https://fairplayforkids.org/pf/prodigy/)

**Zuoyebang / Yuanfudao (China)**
- Zuoyebang's core retention hook is a utility, not a game: photograph a problem, get the solution steps, and an "error notebook" is generated automatically that groups similar wrong problems. — [Baidu Baike: Zuoyebang](https://baike.baidu.com/en/item/Zuoyebang/649107)
- Yuanfudao "AI Big Reading" (announced for July 2026) includes "3D Companion Reading", AI dialogue, paper-book annotation and a "Boss Task" mechanic. — [Baidu Baike: Yuanfudao](https://baike.baidu.com/en/item/Yuanfudao/20702) (weak: feature list only, no outcome data)

**Vietnam: VioEdu (FPT)**
- "Đấu trường VioEdu" (grades 1–9) is FPT's online competition arena. It has had nearly 20M users over 5+ years, with about 4M students taking part each year. — [VietnamNet](https://vietnamnet.vn/vioedu-la-cuoc-thi-gi-2498741.html)
- Format: one round per week, a 20-minute test that can be taken only once, scored and ranked automatically. Ranking is by total score, then completion time. There are regional and national rounds, with badges plus leaderboards. Schools and the HCMC education department publish official rules for 2025–2026, so the arena is embedded in school life. — [VietnamNet](https://vietnamnet.vn/vioedu-la-cuoc-thi-gi-2498741.html); [Thể lệ Đấu trường VioEdu 2025–2026 (HCM edu)](https://fileth.hcm.edu.vn/data/doc/2025/thbinhtrieu/2025_9/23/the-le-dau-truong-vioedu-2025-2026_239202510.pdf); [VIO News](https://tintuc.vio.edu.vn/the-le-dau-truong-vioedu-khu-vuc-nam-hoc-2025-2026/)
- Earlier "Đấu trường toán học VioEdu" seasons ran as named seasons ("mùa 2", 2020). — [Tuổi Trẻ](https://tuoitre.vn/khoi-dong-dau-truong-toan-hoc-vioedu-mua-2-2020102310354454.htm)

### Inferences
- Khan's design choice that one problem keeps the streak alive is a low-friction streak. It protects habit without forcing long sessions, and it pairs the streak with a mastery metric so the streak cannot become the goal. BK already has per-subject Elo, so BK's streak unit could be "1 graded item in any subject", with mastery reported per subject.
- VioEdu shows that Vietnamese students and schools already accept a weekly, one-attempt, timed, ranked round. A weekly per-subject "đấu trường" inside BK (one attempt, ranked inside the class or khối) fits local norms and costs little to build on existing challenges and Elo.
- Prodigy is the warning case for BK's pet/farm game. If pets, shops and chests sit beside the learning instead of being produced by it, students will play the shell and skip the math. Coins and pet progress should come only from verified learning events, which BK's DB-side EXP→coin rule already allows.
- Zuoyebang's error notebook matches BK's (HS × dạng) model: auto-grouping a student's wrong items by dạng is a retention utility in its own right.

### Gaps
- Not covered with sources in this pass: Quizlet (study streaks, Learn mode), Brilliant, Photomath/Gauth, Byju's, Khanmigo usage data, the Quizizz→Wayground rebrand, and the Vietnamese apps Monkey, Hocmai, OLM, Elsa Speak and Edupia. No retention metrics were found for any of them.
- No independent (non-company) causal evidence found that Khan's streaks themselves improve learning.

## Q2. Habit/pet apps (Finch, Forest, Habitica, Tamagotchi/Pou, Pokémon Sleep, Pikmin Bloom): caring for a pet as a motivator; guilt and loss mechanics

### Takeaway
Finch is the strongest data point for BK's pet game. A pet that grows when you complete real goals, cannot be harmed by neglect, and has timed "adventures" that pull you back retains reportedly better than Duolingo (Sensor Tower estimate). Loss and punishment mechanics (Habitica damage, Forest tree dying) motivate some users, but the research shows counterproductive effects and abandonment. The social version (shared fate) is the only form of guilt with a clear positive story.

### Cited Findings
**Finch (self-care pet)**
- Sensor Tower data, via Deconstructor of Fun: about 10M MAU and D1/D7 retention of 54%/37%. This compares with Duolingo at 51%/35% and Royal Match at 40%/25%. These are third-party estimates attributed to Sam Aune (Sensor Tower). — [Deconstructor of Fun: Finch widgets](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)
- Mechanics: a bird that grows (egg → hatchling → toddler → adult, unlocking content); daily goals produce "energy"; a progress bar unlocks a timed adventure (around 8 hours), whose "in progress"/"completed" state shows on the home-screen widget so the user returns to collect it; a Rainbow Stones cosmetic economy (clothes, room decor); micro-events such as friend visits and chats after adventures, placed at morning and evening moments rather than through constant pushes; and a social "friends tree" with referrals. — [Deconstructor of Fun](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl); [search summary of same](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)
- Finch has no negative enforcement: a user can take a week off without the pet being punished. — [Deconstructor of Fun](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)
- Reported to have reached about $30M ARR without VC money. — [Sparrow Apps blog](https://blog.sparrowapps.io/p/finch-how-a-self-care-app-hit-30m-arr-without-vc-money) (weak: blog estimate, not fetched)

**Habitica (RPG party accountability)**
- Mechanics: missed Dailies cost HP; repeated misses can kill the character, costing a level and gear. In a party quest, a member's missed tasks damage the whole party. — [Habitica Wikipedia](https://en.wikipedia.org/wiki/Habitica); [Habitica wiki: damage](https://habitica.fandom.com/wiki/The_Keep:Handy_Tips_to_Manage_Damage_and_Avoid_Death_in_Habitica)
- Academic study (Diefenbach & Müssig, Int. J. Human-Computer Studies, 2019): all participants experienced counterproductive effects to some degree, for example being punished during productive periods when they could not tick tasks in time. How often this happened correlated with how inappropriate users found the reward system, and it predicted declining motivation over time. — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1071581918305135); [ResearchGate](https://www.researchgate.net/publication/327451529_Counterproductive_effects_of_gamification_An_analysis_on_the_example_of_the_gamified_task_manager_Habitica)
- A JMIR Serious Games 2024 paper argues that point systems like Habitica's can be harmful because they reward checking the box rather than doing the task. — [JMIR Serious Games 2024](https://games.jmir.org/2024/1/e43078) (summarized via search snippet, not fetched)
- One analysis says Habitica's 2023 social modules gave +39% retention and its 2024 multiplayer challenges brought 3.8M new users in six months. — [Trophy case study](https://trophy.so/blog/habitica-gamification-case-study). **Flag: unverified.** No primary Habitica source was found, and the numbers look like marketing-blog filler. Do not rely on them.
- Base rate: a JMIR scoping review found that across most studies over half of users drop health and habit apps within 100 days (median about 70% abandonment). — [JMIR 2024 scoping review](https://www.jmir.org/2024/1/e56897)

**Forest (focus tree)**
- The tree grows while you stay off your phone and dies if you leave the app. "Plant Together" puts a group in one session, and if anyone quits, the shared tree dies. — [Forest](https://www.forestapp.cc/); [Calmevo review 2026](https://calmevo.com/forest-app-review/)
- Forest has funded over 2M real trees through Trees for the Future since 2014. — [Forest site / reviews](https://www.forestapp.cc/)

**Pokémon Sleep / Pikmin Bloom (real-life behavior → creature collection)**
- Pokémon Sleep: 37% of first-year downloads and 70% of revenue came from Japan (Sensor Tower). It held more than 1M MAU in Japan a year after launch, about double the US. — [Automaton](https://automaton-media.com/en/news/pokemon-sleep-has-over-a-million-monthly-users-in-japan-doubling-us-figures/)
- Pokémon Sleep had 3.2M+ downloads shortly after its July 2023 launch and about $130K per day in revenue (Sensor Tower). — [Fitt Insider](https://insider.fitt.co/pokemon-cashes-in-on-gamified-sleep/)
- Pikmin Bloom made $473K from 2M downloads in its first two weeks, with 43% of downloads from Japan. — [PocketGamer.biz](https://www.pocketgamer.biz/news/77544/pikmin-bloom-two-million-downloads/)

### Inferences
- For BK's egg-hatching and pet game, Finch's loop maps almost one-to-one: graded study (ET/practice) → energy → the pet goes on a timed expedition and brings back a creature, egg or item → the student returns to collect it. This puts the appointment mechanic on top of learning rather than beside it.
- Finch's "no punishment" stance fits teens and BK's principles. A pet that is hurt or dies when the student misses study turns a school obligation into guilt. The Habitica evidence suggests this causes counterproductive effects and quitting, especially in busy periods such as exam weeks, when "being punished during productive times" is exactly what would happen.
- Shared-fate mechanics (Habitica party damage, Forest Plant Together) are stronger in BK's setting than in Habitica's because classmates know each other offline. That cuts both ways: real accountability, but also real blame. A safer variant is a positive-only group goal (the class unlocks a shared reward or boss) with no damage from one member.
- Pokémon Sleep and Pikmin Bloom show that "real-life behavior produces collectible creatures" works at scale, especially in East Asia. BK's "learning produces creatures" is the same pattern.

### Gaps
- No peer-reviewed study on Finch's effects, and no first-party Finch retention figures (only Sensor Tower estimates).
- Not covered: Tamagotchi, Pou, Dragon City retention data; academic work on virtual-pet attachment and guilt in adolescents.
- No D30 or long-term figures for Finch or Forest.

## Q3. Teen social apps (Snapchat Streaks, BeReal, Locket Widget, TikTok): what brings teens back daily; friend streaks and their risks

### Takeaway
Friend streaks (Snapchat) are a powerful daily-return mechanic for early adolescents, but research links them to FoMO, problematic smartphone use and felt social pressure. Locket, hugely popular in Vietnam, retains through a different route: a private small-circle widget with no follower counts. That model translates better to classmates who already know each other.

### Cited Findings
**Snapchat Streaks**
- Study of early adolescents (Antwerp; ScienceDirect, 2023): FoMO, problematic smartphone use and social media self-control correlated with how many people adolescents kept streaks with and for how many days. The full text was not accessible (403), so these findings come from the abstract and search snippets. — [ScienceDirect: Snapchat streaks and PSU/FoMO](https://www.sciencedirect.com/science/article/pii/S2772503023000476); [Antwerp repository](https://repository.uantwerpen.be/docstore/d:irua:18767)
- Qualitative findings: the relational expectations and frequent notifications around streaks caused stress. Friend emojis added perceived social pressure. Teens said streaks strengthened bonds but also reported anxiety about losing them and about "disappointing someone". — [ScienceDirect (abstract/snippet)](https://www.sciencedirect.com/science/article/pii/S2772503023000476); [ResearchGate](https://www.researchgate.net/publication/372726551_Snapchat_Streaks_-_how_are_these_forms_of_gamified_interactions_associated_with_smartphone_dependency_and_fear_of_missing_out_among_early_adolescents)
- Clinician and parent guides describe streaks as turning a voluntary act into a perceived daily obligation, with real distress when a streak breaks. — [Calm Kids Anxiety Skills Center](https://calmkidsasc.com/navigating-snap-streak-addiction-a-guide-for-parents-of-teens/) (weak: practitioner blog)

**Locket Widget (Vietnam)**
- Locket shows friends' real-time photos straight on the home-screen widget. It is built around a small circle (originally 20 friends) and is described by Vietnamese media as private, cute and easy, the "mạng xã hội yêu thích của Gen Z". — [FPT Shop](https://fptshop.com.vn/tin-tuc/danh-gia/locket-la-gi-162675); [VOH](https://voh.com.vn/apps/locket-la-gi-502156.html)
- Locket made Vietnam-specific widget frames for local holidays, each opened by more than 1.3M users, and onboarded 60+ Vietnamese A-list celebrities ("Celebrity Lockets", 1,000–15,000 fans each). Users value it as a private space without the pressure to "live virtually". — [Lao Động](https://news.laodong.vn/cong-nghe/ung-dung-chia-se-anh-locket-chinh-thuc-cong-bo-tinh-nang-moi-1554068.ldo)
- Global: 80M+ downloads, about 9M DAU, 10B+ photos shared. — [What a Startup (Substack)](https://whatastartup.substack.com/p/he-built-an-app-for-his-girlfriend-and-ended-up-having-80-million-total-downloads) (secondary source)
- Vietnamese press reports a scam around "upgrading to Locket Gold", in which teens lost devices or money. This shows strong teen demand for premium Locket features. — [Vietnam.vn](https://www.vietnam.vn/en/nang-cap-locket-gen-z-soc-khi-phai-chuoc-may-gan-10-trieu-dong)

### Inferences
- Widget presence (Locket, Finch) is a shared retention lever across these apps. BK's pet or class feed could show on the home screen as a widget, a cheaper and less annoying return trigger than push notifications. The BK app is web/PWA, so widget feasibility depends on the platform.
- Locket's "small closed circle of real friends" matches BK's class structure better than a public show-off feed. A class-scoped feed of photos or achievements (only classmates see it) copies the Locket pattern and lowers comparison pressure against strangers.
- Avoid one-to-one friend streaks for minors. The documented harm (FoMO, obligation, "disappointing someone") is stronger when the counterpart is a real classmate. If used, prefer group or class streaks with grace days and no public loss display.

### Gaps
- Not covered: BeReal (daily notification-window mechanic) and TikTok (feed and LIVE gifting) retention evidence for teens; Locket's Vietnam-specific DAU and its streak feature, if any.
- No longitudinal or causal study on Snapchat streaks found; the evidence is cross-sectional or qualitative.

## Q4. Live and classroom-linked mechanics (Kahoot/Quizizz, ClassDojo, Classcraft): connecting classroom behavior to app motivation

### Takeaway
Live in-class quizzes have the strongest learning evidence of any mechanic in this catalog (meta-analytic ES around 0.77). Classroom point systems (ClassDojo, Classcraft) have mixed or untested evidence, and a well-documented risk: public points shame low earners and make classmates over-competitive.

### Cited Findings
- Kahoot/Quizizz effect sizes: see Q1. Combined ES 0.775 across 36 experiments, Quizizz better than Kahoot. — [ACM](https://dl.acm.org/doi/10.1145/3498765.3498781); [Wiley JCAL](https://onlinelibrary.wiley.com/doi/10.1111/jcal.13084)
- ClassDojo: some studies report better behavior (one reports positive behaviors tripled in a first-grade class). An experimental study (Wang & Holcombe) found no significant effect on behavior or off-task disruptions. — [ResearchGate review of ClassDojo](https://www.researchgate.net/publication/355791131_A_Review_on_the_Contribution_of_ClassDojo_as_Point_System_Gamification_in_Education); [ERIC](https://files.eric.ed.gov/fulltext/EJ1110950.pdf); [Rowan thesis](https://rdw.rowan.edu/cgi/viewcontent.cgi?article=3446&context=etd)
- Documented criticisms of ClassDojo: points publicly shame students in front of classmates; some pupils became over-competitive, and others lost confidence because they felt unable to earn points; chasing points causes stress. — [Lincoln critical evaluation](https://rowandigitalmedia.blogs.lincoln.ac.uk/2016/02/13/research-critical-evaluation-of-class-dojo/); [Joe Bower blog](http://joe-bower.blogspot.com/2014/11/6-reasons-to-reject-classdojo.html) (opinion)
- Classcraft: over 30,000 teachers and 1M active students, but no rigorous RCT. The US IES funded an initial efficacy study. — [IES award page](https://ies.ed.gov/use-work/awards/initial-efficacy-study-classcraft-gamified-approach-classroom-management)

### Inferences
- BK already runs in-person classes, so live in-class quiz battles (Kahoot style, run from the BK app with results written to per-subject Elo and mastery) are probably the highest-evidence addition. They also give the offline friend group a shared moment that drives later app use.
- Classroom points shown publicly (a ClassDojo-style board) should be avoided or limited to positive, private-to-student views. BK's existing social show-off feed should show achievements, not deficits.
- For the parent loop (ClassDojo's parent feed), BK could send parents event-based positive updates. Effects on retention were not found in this pass.

### Gaps
- No data found on how ClassDojo's parent feed affects student motivation or retention.
- No evidence found on Classcraft outcomes beyond adoption numbers. Classcraft's current status in 2026 was not verified.

## Q5. Cheap-to-build, high-impact mechanics vs mechanics that backfire with teens

### Takeaway
Mechanics with the best evidence-to-cost ratio for BK reuse its existing core: a low-friction streak where one item counts, a weekly ranked one-attempt arena, live in-class quiz battles, and Finch-style timed pet expeditions unlocked by study. Mechanics that backfire with teens: one-to-one friend streaks, punishing or killing the pet, public deficit boards, and pets or shops detached from learning (the Prodigy failure).

### Cited Findings
- One-problem streak plus mastery metric (Khan): half a million students kept streaks in a week; streak users progress faster (internal, correlational). — [Khan blog](https://blog.khanacademy.org/?p=19368)
- Weekly one-attempt ranked arena (VioEdu): about 4M Vietnamese students a year, embedded in school rules. — [VietnamNet](https://vietnamnet.vn/vioedu-la-cuoc-thi-gi-2498741.html)
- Live quiz battles: ES around 0.77 for achievement. — [ACM](https://dl.acm.org/doi/10.1145/3498765.3498781)
- Timed adventure, widget pet and no punishment (Finch): D7 37% (Sensor Tower estimate). — [Deconstructor of Fun](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)
- Backfire: Habitica punishment has counterproductive effects for all participants studied. — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1071581918305135)
- Backfire: Snapchat friend streaks correlate with FoMO and problematic phone use in early adolescents. — [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2772503023000476)
- Backfire: public points shame students and cause over-competition. — [Lincoln critical evaluation](https://rowandigitalmedia.blogs.lincoln.ac.uk/2016/02/13/research-critical-evaluation-of-class-dojo/)
- Backfire: a pet/shop layer that crowds out learning and turns into an upsell funnel (Prodigy: 16 ads against 4 problems in 19 minutes). — [Fairplay](https://fairplayforkids.org/wp-content/uploads/2021/02/Prodigy_Complaint_Feb21.pdf)

### Inferences
- **Cheap and high impact for BK** (reuses existing ranks, Elo, quests and coins):
  1. Streak unit = one graded item (any subject), with grace days.
  2. Weekly per-subject one-attempt ranked arena, scoped to class or khối.
  3. In-class live quiz battle that writes to Elo.
  4. Pet expeditions unlocked only by study energy, with "collect when you return".
  5. Class-scoped Locket-style feed, positive only.
  6. Zuoyebang-style auto error notebook grouped by dạng.
- **Likely to backfire with teens:**
  1. One-to-one friend streaks with public break notices.
  2. A pet that gets sick or dies from missed study.
  3. Party damage where one student costs the group.
  4. Leaderboards that show the bottom of a real class.
  5. Coins farmable outside learning, which invites cheating and play-without-learning.
  6. Premium or chest upsells inside the learning loop.
- **Cheating risk:** any ranked arena or coin reward should be tied to DB-verified graded events, which BK's architecture already enforces. One-attempt timed rounds (VioEdu) also limit farming.

### Gaps
- No evidence found specific to teen cheating rates under coin rewards in edu apps.
- No A/B data comparing positive-only vs loss-based pet mechanics in teens; the recommendation rests on Habitica adult data and the Finch design rationale.
