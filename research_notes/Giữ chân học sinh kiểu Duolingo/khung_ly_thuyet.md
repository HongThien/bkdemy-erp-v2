# Behavioral-science frameworks for teen retention/motivation in an education app (as of Oct 2026)

Scope: BK Academy student app (grades 6–12, Vietnam) already has ranks, quests, season track, prize wheel with random EXP, badges, social show-off feed, EXP→coin wallet redeemable for real rewards. Question: which frameworks are evidence-based, what is teen-specific, what do regulators say, and what checklist to use before shipping a retention feature.

Evidence-strength legend used below: **[STRONG]** = meta-analyses / many replications · **[MODERATE]** = several controlled studies, some boundary conditions · **[WEAK]** = practitioner framework, few/no direct tests · **[CONTESTED]** = replication failure or active dispute.
Note on sourcing: items marked "(primary paper DOI, from prior knowledge, not re-fetched this session)" are well-known papers cited by DOI; their figures are as I recall them and should be spot-checked before quoting externally.

---

## 1. Frameworks — what each says and how strong the evidence is

### Takeaway
The academically strongest anchors are Self-Determination Theory (SDT) and habit research (context-dependent repetition); goal-gradient and streak effects have solid controlled-study support; Fogg B=MAP, Hooked and Octalysis are useful design vocabularies but have little or no direct empirical validation; the Zeigarnik effect largely failed replication in a 2025 meta-analysis.

### Cited Findings

**Self-Determination Theory (autonomy, competence, relatedness; motivation continuum) — [STRONG]**
- Howard et al. (2021) meta-analysis, 344 samples / 223,209 students, 26 outcomes: intrinsic motivation relates to student success and well-being; identified regulation (personal value) is especially linked to persistence; external regulation (rewards/avoid punishment) was **not** associated with performance or persistence but **was** associated with lower well-being — [Howard, Bureau, Guay, Chong & Ryan 2021, preprint](https://selfdeterminationtheory.org/wp-content/uploads/2021/02/2021_HowardBureauGuayChongRyan_Student-Motivation_PrePrint.pdf)
- Antecedents of autonomous vs controlled student motivation meta-analysed (teacher/parent need-support predicts autonomous motivation) — [Bureau et al. 2022, Review of Educational Research](https://journals.sagepub.com/doi/10.3102/00346543211042426)
- Need-supportive vs need-thwarting behaviours in student populations meta-analysed separately (thwarting is not just the absence of support) — [Howard, Slemp & Wang 2025, PSPB](https://journals.sagepub.com/doi/10.1177/01461672231225364) / [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12276404/)

**Fogg Behavior Model (B = Motivation × Ability × Prompt) and Tiny Habits — [WEAK as a tested theory; useful as a design heuristic]**
- The 2009 FBM paper was a conference paper; most citing works *apply* rather than *test* it; no RCTs directly test its core predictions; the "celebration" step of Tiny Habits has not been tested against a no-celebration control — [The Behavioral Scientist, FBM entry](https://www.thebehavioralscientist.com/articles/fogg-behavior-model) (secondary source; treat as commentary)
- A 2025 scoping review found only **6** studies that met inclusion criteria applying FBM in health interventions, with varied effectiveness; it calls FBM effective but "underutilized" — [Behavioral science meets public health, BMC Public Health 2025](https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-025-24525-y). Inference: 6 heterogeneous studies cannot isolate FBM's own contribution.

**Hooked model (Eyal: trigger → action → variable reward → investment) — [WEAK]**
- Critics note it is not built on tested science and that the book's own examples (Mint, Twitter onboarding) contradict the loop order — [Big Think review](https://bigthink.com/wikimind/an-incomplete-loop-a-review-of-hooked-by-nir-eyal/); [The Behavioral Scientist, Hooked entry](https://www.thebehavioralscientist.com/articles/hooked-model)
- Yu-kai Chou (Octalysis author) argues the Hook loop builds compulsion ("addicts, not habits") because it leans on black-hat drives — [yukaichou.com](https://yukaichou.com/gamification-analysis/hook-model-octalysis-habit-addiction/) (practitioner opinion, competing framework author)

**Octalysis (8 core drives; white hat = meaning/accomplishment/empowerment; black hat = scarcity/unpredictability/loss-avoidance) — [WEAK]**
- Academic reflection: only a few academic articles discuss its applicability; **no reviewed paper empirically validated the framework or its sub-areas**; in practice it is often simplified or overwhelming — [Reflection on the Octalysis framework, CEUR-WS Vol-3147](https://ceur-ws.org/Vol-3147/paper8.pdf)
- Bibliometric analysis of Octalysis use in training (shows usage, not validation) — [Humanities & Social Sciences Communications 2023](https://www.nature.com/articles/s41599-023-02243-3)
- Practical value: its white-hat/black-hat split maps onto SDT (white hat ≈ autonomous motivation; black hat ≈ controlled/pressure) — inference, see below.

**Habit formation — [STRONG for "context-dependent repetition builds automaticity"; MODERATE for the specific day counts]**
- Lally et al. (2010): automaticity rose asymptotically; median ~66 days to plateau, range ~18–254 days; missing a single opportunity did not materially derail the process (primary paper DOI, from prior knowledge, not re-fetched this session) — [Lally et al. 2010, EJSP, doi:10.1002/ejsp.674](https://doi.org/10.1002/ejsp.674)
- 2024 systematic review/meta-analysis (20 studies, health behaviours): median time to habit 59–66 days, means 106–154 days, individual range **4–335 days**; habit scores improved SMD 0.69 (95% CI 0.49–0.88); the "21 days" claim is a myth — [Singh et al. 2024, Healthcare 12(23):2488](https://www.mdpi.com/2227-9032/12/23/2488); [ScienceDaily summary](https://www.sciencedaily.com/releases/2025/01/250124151347.htm)
- Wood & Neal (2007): habits are cue–response associations learned through repetition in stable contexts; once formed they are triggered by context rather than goals (primary paper, from prior knowledge) — [Wood & Neal 2007, Psychological Review, doi:10.1037/0033-295X.114.4.843](https://doi.org/10.1037/0033-295X.114.4.843)

**Goal-gradient effect — [STRONG/MODERATE]**
- Kivetz, Urminsky & Zheng (2006): coffee-card members bought more frequently as they neared the free reward; also "illusionary" progress accelerated effort (primary paper, from prior knowledge) — [Kivetz et al. 2006, JMR, doi:10.1509/jmkr.43.1.39](https://doi.org/10.1509/jmkr.43.1.39)

**Endowed progress effect — [MODERATE]**
- Nunes & Drèze (2006): car-wash loyalty card needing 10 stamps with 2 pre-filled had higher completion (~34%) than an 8-stamp blank card (~19%) — same real effort (primary paper, from prior knowledge) — [Nunes & Drèze 2006, JCR, doi:10.1086/500480](https://doi.org/10.1086/500480)

**Streaks — [MODERATE; adult consumer samples]**
- Silverman & Barasch (2023), 7 studies: displaying an *intact* streak increases subsequent engagement vs displaying a *broken* one, independent of actual past behaviour (e.g., ~66% vs ~58% chose another exercise). Effect is **amplified** when people blame themselves for the break and **attenuated** when the streak can be "repaired"; people treat the streak as a goal in itself — [JCR 49(6), INSEAD page](https://www.insead.edu/faculty-research/publications/journal-articles/or-track-how-broken-streaks-affect-consumer); [Psychology Today summary](https://www.psychologytoday.com/gb/blog/ulterior-motives/202306/how-broken-streaks-sap-motivation)
- Collective (group) streaks were found to motivate prosocial behaviour (2026) — [Journal of Experimental Social Psychology 2026](https://www.sciencedirect.com/science/article/pii/S0022103126000715) (abstract-level only)

**Loss aversion (basis for "don't lose your streak") — [STRONG as a general phenomenon, CONTESTED in magnitude/generality]**
- Classic prospect theory (Kahneman & Tversky 1979); challenged by Gal & Rucker (2018) "The loss of loss aversion" arguing losses do not universally loom larger (both from prior knowledge) — [Gal & Rucker 2018, J Consumer Psychology, doi:10.1002/jcpy.1047](https://doi.org/10.1002/jcpy.1047)

**Zeigarnik effect (unfinished tasks remembered better) — [CONTESTED / largely failed]**
- 2025 meta-analysis (59 publications; 38 on Zeigarnik): recall ratio interrupted vs completed ≈ **0.99** once Zeigarnik's own 1927 data excluded; fewer than a third of replication attempts found an advantage. The **Ovsiankina effect** (urge to *resume* interrupted tasks) looks more robust — [Ghibellini & Meier 2025, Humanities & Social Sciences Communications](https://www.nature.com/articles/s41599-025-05000-w)

**Variable-ratio reinforcement — [STRONG in animal/operant literature for persistence; the same mechanism is what regulators target in loot boxes]**
- Loot boxes reproduce gambling mechanisms: variable-ratio reinforcement, near-misses, cognitive distortions — [Adolescents and loot boxes systematic review, PubMed 2025/26](https://pubmed.ncbi.nlm.nih.gov/42202489/)

**Gamification in learning overall — [MODERATE]**
- Sailer & Homner (2020) meta-analysis: small-to-medium effects on cognitive (g≈0.49), motivational and behavioural outcomes; combining competition **with** collaboration looked most effective — [Educational Psychology Review 32:77–112](https://www.researchgate.net/publication/335189630_The_Gamification_of_Learning_a_Meta-analysis)
- 2024 meta-analysis 2008–2023 on academic performance: leaderboard alone not significantly different; combos (points+badges+leaderboard+feedback) better — [Zeng et al. 2024, BJET](https://bera-journals.onlinelibrary.wiley.com/doi/full/10.1111/bjet.13471)

### Inferences
- Use SDT as the **judging theory** (why a feature helps/harms) and habit research as the **mechanism theory** (stable cue + small repeated action). Treat Fogg/Hooked/Octalysis as checklists of levers, not as evidence.
- Octalysis white-hat drives ≈ SDT autonomy/competence/relatedness; black-hat drives (scarcity, unpredictability, loss) ≈ controlled motivation — powerful short-term, associated with lower well-being (Howard 2021).
- Lally's "one miss doesn't break the habit" + Silverman & Barasch's "repairable streak softens the drop" both argue for **forgiving streaks** (freeze/repair/weekly-goal) rather than hard reset.
- The Zeigarnik claim ("leave a task unfinished so they come back") should not be used as justification; Ovsiankina (resumption) is the more defensible version — e.g., "resume where you stopped" works without guilt mechanics.
- Habit timelines (59–66 days median, up to ~1 year) mean daily-habit KPIs should be evaluated over ≥2–3 months, not after a 2-week campaign.

### Gaps
- No peer-reviewed study found that tests Duolingo's own streak/freeze mechanics or publishes effect sizes for teens; Duolingo's public claims are company blog/earnings material (not searched in depth here).
- Endowed progress and goal-gradient evidence comes from adult consumers; no teen-specific replication found.
- Variable-ratio *schedule* primary literature (Ferster & Skinner 1957) not fetched; cited only indirectly via loot-box review.

---

## 2. Strong vs popular-but-weak — summary table

### Takeaway
Rank by evidence: SDT, habit/context repetition, extrinsic-reward meta-analyses (strong) > goal-gradient, endowed progress, streak display effects, gamification meta-analyses (moderate) > Fogg, Hooked, Octalysis (weak, practitioner) > Zeigarnik (failed replication).

### Cited Findings
| Framework | Evidence | Key source |
|---|---|---|
| SDT / motivation continuum | STRONG | [Howard et al. 2021](https://selfdeterminationtheory.org/wp-content/uploads/2021/02/2021_HowardBureauGuayChongRyan_Student-Motivation_PrePrint.pdf) |
| Extrinsic rewards undermine intrinsic motivation (tangible, expected) | STRONG but debated scope | [Deci, Koestner & Ryan 1999](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf) vs [Cameron et al. comment](https://pubmed.ncbi.nlm.nih.gov/10589298) |
| Habit = context-dependent repetition; ~2 months median | STRONG / MODERATE | [Singh et al. 2024](https://www.mdpi.com/2227-9032/12/23/2488) |
| Gamification in learning | MODERATE (small–medium g) | [Sailer & Homner 2020](https://www.researchgate.net/publication/335189630_The_Gamification_of_Learning_a_Meta-analysis) |
| Streak display effect | MODERATE (adults) | [Silverman & Barasch 2023](https://www.insead.edu/faculty-research/publications/journal-articles/or-track-how-broken-streaks-affect-consumer) |
| Goal gradient / endowed progress | MODERATE (adults) | [Kivetz 2006](https://doi.org/10.1509/jmkr.43.1.39); [Nunes & Drèze 2006](https://doi.org/10.1086/500480) |
| Fogg B=MAP / Tiny Habits | WEAK (few tests) | [BMC PH scoping review 2025](https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-025-24525-y) |
| Hooked | WEAK | [Big Think](https://bigthink.com/wikimind/an-incomplete-loop-a-review-of-hooked-by-nir-eyal/) |
| Octalysis | WEAK (no empirical validation) | [CEUR-WS 2022](https://ceur-ws.org/Vol-3147/paper8.pdf) |
| Zeigarnik | CONTESTED / failed | [Ghibellini & Meier 2025](https://www.nature.com/articles/s41599-025-05000-w) |

### Inferences
- When a vendor/designer justifies a feature with "Hooked says…" or "Zeigarnik…", the team should ask for an SDT/habit-based rationale instead.

### Gaps
- No single source ranks all these frameworks side by side; the table is my synthesis.

---

## 3. Teen-specific evidence

### Takeaway
Adolescents are more reward- and peer-sensitive than adults (peer presence boosts reward-circuit activity), strongly need autonomy, and are harmed by late-night device use; leaderboards demotivate low performers and can reduce intrinsic motivation over a term; random paid/valued rewards (loot boxes) are consistently associated with problem gambling in youth.

### Cited Findings

**Reward sensitivity & peers**
- Chein, Albert, O'Brien, Uckert & Steinberg (2011): when watched by peers, adolescents (not adults) showed greater ventral striatum / orbitofrontal activation and more risk taking; cognitive-control activity did not vary with social context — [Developmental Science 14(2):F1–F10, PDF](https://local.psy.miami.edu/faculty/dmessinger/c_c/rsrcs/rdgs/emot/steinberg.devsci.2011.j.1467-7687.2010.01035.x.pdf)
- Counterpoint: adolescent ventral-striatum reward sensitivity can also promote health/learning, not only risk — [Developmental Cognitive Neuroscience 2016](https://www.sciencedirect.com/science/article/pii/S1878929315300438)
- Peers influence adolescent reward processing but not response inhibition — [Cognitive, Affective & Behavioral Neuroscience 2018](https://link.springer.com/article/10.3758/s13415-018-0569-5)
- Sherman et al. (2016): teens' reward circuitry responded to photos with many "likes", and they were more likely to like photos already popular (primary paper, from prior knowledge) — [Psychological Science, doi:10.1177/0956797616645673](https://doi.org/10.1177/0956797616645673)

**Leaderboards / social comparison**
- Hanus & Fox (2015) 16-week classroom study: gamified course (leaderboard + badges) students showed **lower** intrinsic motivation, satisfaction and empowerment over time and lower final exam scores than the non-gamified class; social comparison mediated part of it (college sample) — [Computers & Education, ResearchGate](https://www.researchgate.net/publication/265644737_Assessing_the_effects_of_gamification_in_the_classroom_A_longitudinal_study_on_intrinsic_motivation_social_comparison_satisfaction_effort_and_academic_performance)
- Leaderboard in lectures reduced female students' social engagement ("more competition, less interaction") — [J. Computing in Higher Education 2025](https://link.springer.com/article/10.1007/s12528-025-09438-4)
- Systematic mapping of negative effects of gamification in education software (loss of performance, undesired behaviour, indifference, declining effects) — [arXiv 2305.08346](https://arxiv.org/pdf/2305.08346)
- High-school & higher-ed systematic review of gamified strategies and motivation — [Heliyon 2023](https://www.sciencedirect.com/science/article/pii/S2405844023062412)
- Leaderboard alone not significant in 2024 meta-analysis; combos better — [Zeng et al. 2024](https://bera-journals.onlinelibrary.wiley.com/doi/full/10.1111/bjet.13471)

**Notifications & sleep**
- Common Sense Media (2023), 203 youth 11–17 tracked a week: median **237 notifications/day**, ~25% during school, ~5% at night; over half used phones on school nights between midnight and 5 a.m. — [Constant Companion report PDF](https://www.commonsensemedia.org/sites/default/files/research/report/2023-cs-smartphone-research-report_final-for-web.pdf); [press release](https://www.commonsensemedia.org/press-releases/teens-are-bombarded-with-hundreds-of-notifications-a-day)
- Nighttime (vs daytime) smartphone use specifically linked to poorer adolescent sleep quality — [Siebers, Beyens, Baumgartner & Valkenburg 2024, Communication Research](https://journals.sagepub.com/doi/10.1177/00936502241276793)
- Bedtime screen behaviours prospectively associated with worse sleep in early adolescents (ABCD cohort) — [Journal of Adolescent Health 2024](https://www.jahonline.org/article/S1054-139X(24)00289-1/fulltext)
- Screen time displaces sleep pathways and raises depressive symptoms over 12 months — [PMC 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11964217/)
- APA advisory: technology/social media use within one hour of bedtime linked to sleep disruption; use should not interfere with sleep and physical activity — [APA press release 2023](https://www.apa.org/news/press/releases/2023/05/adolescent-social-media-use-recommendations)

**Variable rewards for minors (loot boxes)**
- Systematic review of 26 studies (2017–2025) on adolescents & loot boxes: loot boxes reproduce variable-ratio reinforcement, near-miss and cognitive distortions; spending associated with problem gambling and problematic gaming, especially in adolescents — [PubMed 42202489](https://pubmed.ncbi.nlm.nih.gov/42202489/)
- Meta-synthesis: 12/13 publications positive link with problem gambling, mean r ≈ .27; with problem gaming r ≈ .40 (6 surveys) — [Spicer et al. 2022, New Media & Society](https://journals.sagepub.com/doi/abs/10.1177/14614448211027175)
- Longitudinal evidence: youth who bought loot boxes were more likely to gamble (and spend more) 6 months later — [International Gambling Studies 2025](https://www.tandfonline.com/doi/pdf/10.1080/14459795.2025.2488867)
- National survey of adolescent gamers: loot box engagement associated with problem gambling — [Zendle et al., ResearchGate](https://researchgate.net/publication/338092455_Loot_box_engagement_and_problem_gambling_among_adolescent_gamers_Findings_from_a_national_survey)

**Autonomy & fairness**
- SDT meta-analyses: need-thwarting (control, pressure) harms students beyond mere lack of support — [Howard, Slemp & Wang 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12276404/)

### Inferences
- BK's **prize wheel with random EXP** is structurally a free variable-ratio reward. It is not a loot box (no money in), but once EXP converts to **coins redeemable for real prizes**, a random draw becomes "chance → real-value prize" — the exact structure regulators and the loot-box literature worry about. Highest-risk existing feature.
- **Social show-off feed + ranks** exploit the peer-amplified reward response teens have (Chein 2011, Sherman 2016). Keep them, but make comparison opt-in, scoped to small cohorts/teams, and favour personal-best and team goals (Sailer & Homner: competition + collaboration).
- Streak reminders must not fire late at night; "save your streak" at 23:00 is the worst combination (loss framing + bedtime + teen).
- Correlational nature: loot-box and sleep findings are mostly correlational/longitudinal, not causal RCTs — but regulators act on them anyway (precautionary).

### Gaps
- No peer-reviewed study found on "streak anxiety" in teens specifically (evidence is anecdotal/journalistic, e.g. Snapchat streak stress); the Silverman & Barasch work is on adults.
- No Vietnam-specific research found on gamified learning apps and teen well-being.
- No study found directly on reward wheels (non-purchased random rewards) in educational apps for minors.

---

## 4. Extrinsic rewards vs intrinsic motivation (incl. money-like coins)

### Takeaway
Expected, tangible, task-contingent rewards reduce intrinsic motivation, more so for children than for college students; verbal/informational positive feedback increases it. Cameron & Pierce dispute the size/scope. Field experiments with cash for students show rewarding *inputs* (e.g., reading books) can help while rewarding *outputs* (grades) mostly doesn't, and measured crowd-out was small or temporary. External regulation predicts lower well-being and no gain in persistence.

### Cited Findings
- Deci, Koestner & Ryan (1999), 128 experiments: tangible rewards significantly undermine intrinsic motivation; undermining **stronger for children than college students**; engagement- and completion-contingent rewards undermine self-reported interest (d ≈ −0.15/−0.17); **positive feedback enhances** free-choice behaviour (d ≈ 0.33) and interest (d ≈ 0.31) — [Psychological Bulletin 125(6), PDF](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf); [INR summary](https://inr.institute/en/research/deci-koestner-ryan-1999-meta-analysis-rewards-and-intrinsic-motivation/)
- Education-specific re-analysis: [Deci, Koestner & Ryan 2001, Review of Educational Research](https://journals.sagepub.com/doi/10.3102/00346543071001001)
- Counterpoint: Eisenberger, Pierce & Cameron (1999) comment argue negative effects are limited to specific conditions (e.g., tangible, expected rewards for low-interest-irrelevant tasks) and that rewards contingent on performance quality can increase motivation — [PubMed 10589298](https://pubmed.ncbi.nlm.nih.gov/10589298); original Cameron & Pierce 1994 (from prior knowledge) — [RER, doi:10.3102/00346543064003363](https://doi.org/10.3102/00346543064003363)
- Fryer (2011), RCTs in 200+ schools (Chicago, Dallas, DC, NYC): incentives for **inputs** (reading books) showed suggestive gains; incentives for **outputs** (grades/test scores) had little/no effect; Intrinsic Motivation Inventory showed little evidence of crowd-out — [Fryer, QJE 2011 PDF](https://scholar.harvard.edu/files/fryer/files/financial_incentives_and_student_achievement_evidence_from_randomized_trials.pdf)
- Field experiment: incentives encourage learning but crowd out intrinsic motivation to perform on high-stakes tests; crowd-out was temporary (fades after ~a year) — [Economics of Education Review / fieldexperiments paper](http://fieldexperiments-papers2.s3.amazonaws.com/papers/00643.pdf)
- Review of responses to incentives in education — [Sadoff et al., Economics of Education Review 2021](https://rady.ucsd.edu/_files/faculty-research/sadoff/Response_to_Incentives_in_Education_EER_2021.pdf)
- External regulation: not associated with performance or persistence, associated with lower well-being — [Howard et al. 2021](https://selfdeterminationtheory.org/wp-content/uploads/2021/02/2021_HowardBureauGuayChongRyan_Student-Motivation_PrePrint.pdf)

### Inferences
- **Design rules to preserve intrinsic motivation** (derived from DKR 1999 + SDT):
  1. Make feedback **informational** ("you mastered 3/5 sub-skills of dạng X") rather than controlling ("do 10 more to keep your rank").
  2. Reward **effort/inputs and mastery evidence** (Fryer), not raw time-in-app or grades alone.
  3. Prefer **unexpected** recognition over announced "do X get Y" contracts for tasks that are already interesting.
  4. Give **choice** (which quest, which dạng, when to study) — autonomy is the most fragile need in teens.
  5. Keep coin→real-prize conversion **predictable, effort-based, capped**, not random, and not the headline of the app.
- BK's EXP→coin→prize pipeline is a money-like, tangible, expected reward: by DKR it carries undermining risk, by Fryer it can still raise effort if tied to learning *inputs*. The defensible position: keep it, but tie coins to verified learning actions (mastery measured by the system), never to random draws or pure login.

### Gaps
- No 2020s meta-analysis found that updates DKR 1999 specifically for digital points/badges with real-world redemption among adolescents.
- No study found on Vietnamese students' responses to token/coin systems.

---

## 5. Ethical/regulatory checklists (ICO, EU DSA, APA, 5Rights, CHT)

### Takeaway
Regulators converge on: high-protection defaults, no features that exploit reward/peer-pressure susceptibility to extend use, engagement features (streaks, push notifications) **off by default** for minors, no notifications during sleep hours, pause-without-losing-progress, and no nudging minors toward spending. These are not binding in Vietnam, but they are the global benchmark parents and press will use.

### Cited Findings

**UK ICO Age Appropriate Design Code (Children's Code)**
- Standard 5 (detrimental use of data): "sticky" features "can include mechanisms such as reward loops, continuous scrolling, notifications and auto-play"; designing data-driven features that "make it difficult for children to disengage" is likely to breach GDPR fairness; avoid features that "exploit human susceptibility to reward, anticipatory and pleasure seeking behaviours, or peer pressure"; avoid "personalised in-game advantages" to keep children engaged; provide **pause buttons** allowing a break "without losing their progress" — [ICO Standard 5](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/5-detrimental-use-of-data/)
- Standard 7: settings "high privacy" by default (data visible to others only if the child changes it) — [ICO Standard 7](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/7-default-settings/)
- Standard 13: no nudges toward giving more data / weaker privacy; asymmetric effort (1 click vs 6 clicks) is a nudge; **pro-wellbeing nudges** (breaks, supportive resources) encouraged; age bands 13–17: explain risks, support independent decisions — [ICO Standard 13](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/)

**EU DSA Article 28 guidelines on protection of minors (published 14 July 2025)**
- Recommends disabling **by default** features that contribute to excessive use — explicitly naming communication "streaks", ephemeral content, read receipts, autoplay and push notifications — and removing persuasive design aimed predominantly at engagement — [EC publication page](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors); [CMS summary](https://cms.law/en/hun/legal-updates/eu-issues-new-guidelines-on-online-safety-for-minors)
- Push notifications always off during "core sleep hours"; accounts private by default; no nudging minors (incl. via AI) toward commercial content or spending, since excessive exposure "may lead to … unwanted spending or addictive behaviours" — [Freshfields DSA decoded #6](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/dsa-decoded-6-the-european-commission-finalises-guidelines-on-the-protection-of-102kv4s)
- Guidelines are voluntary but are the Commission's benchmark for Art. 28(1) compliance; in Feb 2026 the Commission issued preliminary findings that TikTok's addictive-design features may breach the DSA — [CMS](https://cms.law/en/hun/legal-updates/eu-issues-new-guidelines-on-online-safety-for-minors); [EP Think Tank, May 2026](https://epthinktank.eu/2026/05/06/addictive-design-on-online-platforms/)
- Next step in EU: proposed "KIDS Act" / broader child-safety-by-design agenda beyond social-media bans — [Freshfields](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/the-eu-kids-act-europe-moves-online-child-safety-beyond-social-media-bans-102o1ld)

**APA Health Advisory on Social Media Use in Adolescence (May 2023)**
- 10 recommendations; features such as "like" buttons, recommended content, unrestricted time limits and endless scroll should be tailored to adolescents' social/cognitive abilities; use should not interfere with sleep/physical activity (≤1 h before bed linked to sleep disruption); encourage features that create social support; screen for problematic use — [APA press release](https://www.apa.org/news/press/releases/2023/05/adolescent-social-media-use-recommendations); [Advisory PDF](https://attcnetwork.org/wp-content/uploads/2023/05/health-advisory-adolescent-social-media-use.pdf)

### Inferences
- An education app is not a "very large online platform", and Vietnam is outside UK/EU jurisdiction, so these are **benchmarks**, not legal obligations — but they are the most precise public statements of "what counts as manipulative for minors". (Vietnam-side legal flags such as Decree 147/2024 are already tracked in the project's HANDOFF; out of scope here.)
- Direct mapping to BK features: streak = named by EU as default-off engagement feature → make streak opt-in or at least easily hideable, with forgiving rules; push reminders → quiet hours by default (e.g., 22:00–06:30 VN time); prize wheel → falls under "exploit reward/anticipatory behaviour"; show-off feed → falls under "peer pressure" and default-visibility rules (should be private/opt-in by default).

### Gaps
- 5Rights Foundation and Center for Humane Technology materials were not fetched in this session (budget); their principles (e.g., 5Rights "Disrupted Childhood" on persuasive design; CHT "humane design" ledger) are known to align with the above but are not cited here.
- I could not verify from fetched text whether the EU guidelines explicitly mention virtual currencies / loot boxes / random-reward items for minors (I believe the commercial-practices section does) — needs a read of the official guidelines PDF.
- No Vietnamese regulatory equivalent on persuasive design for minors was researched here.

---

## 6. Practical rubric — questions before shipping a teen retention feature

### Takeaway
A feature passes if it supports learning-linked habits through autonomy, competence and relatedness, and fails if it relies mainly on loss, randomness, peer pressure, night-time prompts or money-like chance rewards. The checklist below is a synthesis; each line points to its evidence base.

### Cited Findings (each question anchored to a source above)
1. **Learning linkage** — Is the rewarded action a real learning *input* or verified mastery, not just "opened the app"? ([Fryer 2011](https://scholar.harvard.edu/files/fryer/files/financial_incentives_and_student_achievement_evidence_from_randomized_trials.pdf); [Sailer & Homner 2020](https://www.researchgate.net/publication/335189630_The_Gamification_of_Learning_a_Meta-analysis))
2. **Competence (informational feedback)** — Does the student learn something about their skill from the feedback, or only about their rank/reward? ([Deci et al. 1999](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf))
3. **Autonomy** — Can the student choose (what, when, how much), opt out, hide, or pause without penalty / losing progress? ([ICO Std 5](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/5-detrimental-use-of-data/); [Howard et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12276404/))
4. **Relatedness without comparison harm** — Is the social element cooperative/team-based or small-cohort, with personal-best views, rather than a global ranking that buries low performers? ([Hanus & Fox 2015](https://www.researchgate.net/publication/265644737_Assessing_the_effects_of_gamification_in_the_classroom_A_longitudinal_study_on_intrinsic_motivation_social_comparison_satisfaction_effort_and_academic_performance); [Chein et al. 2011](https://local.psy.miami.edu/faculty/dmessinger/c_c/rsrcs/rdgs/emot/steinberg.devsci.2011.j.1467-7687.2010.01035.x.pdf))
5. **Default visibility** — Is anything shown to other students (feed, rank, streak) private by default and opt-in? ([ICO Std 7](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/7-default-settings/))
6. **Loss framing** — Does it threaten loss (streak reset, rank drop) as the main motivator? If yes: is there a repair/freeze, and is a break framed as normal? ([Silverman & Barasch 2023](https://www.insead.edu/faculty-research/publications/journal-articles/or-track-how-broken-streaks-affect-consumer); [Lally 2010](https://doi.org/10.1002/ejsp.674))
7. **Randomness × value** — Is any reward random **and** convertible to coins/real prizes? If yes → redesign (deterministic, effort-based). ([Spicer et al. 2022](https://journals.sagepub.com/doi/abs/10.1177/14614448211027175); [loot-box adolescent review](https://pubmed.ncbi.nlm.nih.gov/42202489/))
8. **Night & notifications** — Are pushes off in core sleep hours by default, capped per day, and never loss-framed after ~21:00–22:00? ([EU DSA guidelines](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/dsa-decoded-6-the-european-commission-finalises-guidelines-on-the-protection-of-102kv4s); [Siebers et al. 2024](https://journals.sagepub.com/doi/10.1177/00936502241276793); [Common Sense 2023](https://www.commonsensemedia.org/sites/default/files/research/report/2023-cs-smartphone-research-report_final-for-web.pdf))
9. **Stopping cues** — Does the session have a natural end ("done for today") instead of endless next-item / autoplay? ([ICO Std 5](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/5-detrimental-use-of-data/); [APA 2023](https://www.apa.org/news/press/releases/2023/05/adolescent-social-media-use-recommendations))
10. **Spending/commercial nudge** — Does it push students toward redeeming/spending or toward commercial content? ([EU DSA guidelines via Freshfields](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/dsa-decoded-6-the-european-commission-finalises-guidelines-on-the-protection-of-102kv4s))
11. **Parent test (transparency)** — Would we be comfortable showing a parent exactly how the mechanic works and what it optimises? (inference from ICO fairness principle, [ICO Std 13](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/))
12. **Low-performer test** — What does the bottom 20% of students see? Does the feature still give them a reachable goal? (Hanus & Fox; [negative-effects mapping](https://arxiv.org/pdf/2305.08346))
13. **Evidence-of-mechanism test** — Is the rationale grounded in SDT/habit evidence, or only in Hooked/Octalysis/Zeigarnik claims? ([Octalysis reflection](https://ceur-ws.org/Vol-3147/paper8.pdf); [Ghibellini & Meier 2025](https://www.nature.com/articles/s41599-025-05000-w))
14. **Measurement window & guardrail metrics** — Will we judge it over ≥8–12 weeks (habit timescale) and track learning (mastery) + well-being guardrails (late-night use, opt-out rate), not only DAU/streak length? ([Singh et al. 2024](https://www.mdpi.com/2227-9032/12/23/2488); [Howard et al. 2021](https://selfdeterminationtheory.org/wp-content/uploads/2021/02/2021_HowardBureauGuayChongRyan_Student-Motivation_PrePrint.pdf))

### Inferences
- Applied to BK's current stack (my assessment): **ranks/quests/season track/badges** = acceptable if goals are reachable for all and feedback is mastery-based; **prize wheel with random EXP + EXP→coin→real prize** = highest risk (fails Q7); **social show-off feed** = risky on Q4/Q5 unless opt-in and cohort-scoped; a new **daily streak** should ship with freeze/repair, weekly-goal alternative, quiet hours and an easy hide (Q3, Q6, Q8).
- A good "Duolingo-style" core that passes the rubric: small daily learning action (Fogg "tiny" + Wood & Neal stable cue such as after-school time), forgiving streak, informational mastery feedback per dạng, team/class goals instead of global leaderboards, deterministic coin earning from verified learning, no night pushes.

### Gaps
- The rubric is a synthesis; it has not itself been validated. No published, validated "teen retention feature" checklist was found.
