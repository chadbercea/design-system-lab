# Container Story MVP - Execution Sequence

## How To Work These Tickets (Dependency Map)

---

## Phase 1: Foundation (Week 1)

### START IMMEDIATELY (No Dependencies) - Run in Parallel

**PM:**
- **ILI-84**: Write revised product brief ⚡ START NOW
- **ILI-86**: Source 5-8 people for feedback ⚡ START NOW

**Developer:**
- **ILI-90**: Spike: React Three Fiber setup ⚡ START NOW

These three can all run at the same time. No blockers.

---

### START AFTER PM DEFINES TIMING

**PM Must Finish First:**
- **ILI-85**: Define choreography timing (exact seconds)
  - ⏱️ Takes 2-4 hours
  - BLOCKS Designer and Developer work

**Then These Can Start (Run in Parallel):**

**Designer (needs ILI-85):**
- **ILI-87**: Storyboard the 30-second sequence
- **ILI-88**: Define visual style and materials
- **ILI-89**: Design the image crate

All three designer tasks can run in parallel once timing is locked.

**Developer (needs ILI-90 spike done):**
- **ILI-91**: Render static container with edges
- **ILI-92**: Implement OrbitControls
- **ILI-93**: Validate Docker Engine API access

All three dev tasks can run in parallel once spike proves R3F works.

---

## Phase 1 Dependency Flow

```
START
├─ ILI-84 (PM: Product brief) ────────────────────┐
├─ ILI-86 (PM: Source testers) ───────────────────┤
└─ ILI-90 (Dev: R3F spike) ───────────────────────┤
                                                   ├─> Week 1 Done
ILI-85 (PM: Timing) ◄── Must finish within 2 days │
    ├──> ILI-87 (Designer: Storyboard) ───────────┤
    ├──> ILI-88 (Designer: Style guide) ──────────┤
    ├──> ILI-89 (Designer: Crate design) ─────────┤
    └──> ILI-91 (Dev: Static container) ──────────┤
         ILI-92 (Dev: OrbitControls) ─────────────┤
         ILI-93 (Dev: Docker API) ────────────────┘
```

**Summary:**
- **Day 1-2:** Run 3 tickets in parallel (ILI-84, 86, 90)
- **Day 2:** PM finishes timing (ILI-85)
- **Day 3-7:** Run 6 tickets in parallel (ILI-87, 88, 89, 91, 92, 93)

---

## Phase 2: Choreography (Week 2-3)

### Critical Path: Must Be Sequential

**The Choreography Build Has a Strict Order:**

1. **ILI-94**: Build Phase: Dotted wireframe (START FIRST)
   - Needs: ILI-88 (style guide from Designer)
   - Duration: 1-2 days

2. **ILI-95**: Build image crate geometry (Can run parallel with ILI-94)
   - Needs: ILI-89 (crate design from Designer)
   - Duration: 1 day

3. **ILI-97**: Wireframe to solid transition (AFTER ILI-94)
   - Needs: ILI-94 complete
   - Duration: 4-6 hours

4. **ILI-96**: Animate image crate flying in (AFTER ILI-95 + ILI-97)
   - Needs: ILI-95 (crate exists) + ILI-97 (transition works)
   - Duration: 2-3 days
   - **This is the money shot - spend time here**

5. **ILI-98**: Walls materialize (Can overlap with ILI-96)
   - Needs: ILI-88 (material specs)
   - Duration: 2 days

6. **ILI-99**: Door closing animation (AFTER ILI-98)
   - Needs: ILI-98 (walls exist to attach doors to)
   - Duration: 1-2 days

7. **ILI-100**: Edge lighting (Can happen anytime after ILI-94)
   - Needs: ILI-94 (edges exist)
   - Duration: 4-6 hours

8. **ILI-101**: Idle state animation (LAST - after everything)
   - Needs: Full sequence done
   - Duration: 4-6 hours

---

## Phase 2 Dependency Flow

```
ILI-88 (Style guide) ────> ILI-94 (Dotted wireframe) ────> ILI-97 (Solid transition) ────┐
                                                                                           │
ILI-89 (Crate design) ───> ILI-95 (Crate geometry) ────────────────────────────────────> │
                                                                                           │
                                                                                           ├─> ILI-96 (Image flies in)
ILI-88 (Style guide) ────> ILI-98 (Walls materialize) ────> ILI-99 (Doors close) ────────┤     THE MONEY SHOT
                                                                                           │
ILI-94 (Edges exist) ────> ILI-100 (Edge lighting) ────────────────────────────────────> │
                                                                                           │
ALL ABOVE DONE ──────────> ILI-101 (Idle animation) ◄─────────────────────────────────────┘
```

### Parallel Opportunities in Phase 2

**Week 2 (can run parallel):**
- ILI-94 (dotted wireframe)
- ILI-95 (crate geometry)
- ILI-98 (walls materialize)

**Week 3 (sequential):**
- ILI-97 → ILI-96 (transition then flight) - **Critical path**
- ILI-99 (doors) - can overlap with ILI-96
- ILI-100 (lighting) - can happen anytime
- ILI-101 (idle) - must be last

**Bottleneck:** ILI-96 (image flying in) is the hardest and takes longest. Everything leads to this moment.

---

## Phase 3: Polish & Test (Week 4)

### Two Parallel Tracks

**Track 1: Developer (no dependencies)**
- **ILI-103**: Performance optimization ⚡ START IMMEDIATELY
- **ILI-104**: Add Replay button (needs ILI-103 done)
- **ILI-105**: Deploy to Vercel (after ILI-104)

**Track 2: PM (no dependencies)**
- **ILI-102**: Conduct user tests ⚡ START IMMEDIATELY
  - Needs: Working demo (all of Phase 2 done)
  - Duration: Spread across week (5-8 sessions)

**Track 3: Designer (waits for polish)**
- **ILI-106**: Capture demo video (LAST - after ILI-103 & 104)
  - Needs: Polished demo with Replay button
  - Duration: 2-4 hours

### Phase 3 Dependency Flow

```
PHASE 2 DONE ──┐
               ├──> ILI-103 (Performance) ──> ILI-104 (Replay) ──> ILI-105 (Deploy)
               │                                                            │
               └──> ILI-102 (User tests) ──────────────────────────────────┤
                                                                            │
                    ILI-106 (Demo video) ◄──────────────────────────────────┘
```

**PM runs tests while Dev polishes. Designer waits for final version to record.**

---

## Phase 4: Decide Next (Week 5)

### Sequential (Can't Parallelize)

1. **ILI-107**: PM synthesizes feedback (START FIRST)
   - Needs: ILI-102 (tests complete)
   - Duration: 2-3 days
   - **BLOCKING everything else in Phase 4**

2. **CONDITIONAL: If feedback is positive, then:**
   - **ILI-109**: Designer creates Future Vision mockups (2 days)
   - **ILI-110**: Developer writes tech retrospective (1 day)
   - Can run in parallel

3. **ILI-108**: PM prepares pitch deck (LAST)
   - Needs: ILI-107 (decision made) + ILI-109 (mockups) + ILI-110 (tech doc)
   - Duration: 2 days

### Phase 4 Dependency Flow

```
ILI-102 (Tests) ──> ILI-107 (Synthesize feedback & decide) ──┐
                                                              │
                    IF POSITIVE ───────────────────────────> │
                    ├──> ILI-109 (Future mockups) ──────────┤
                    └──> ILI-110 (Tech retro) ──────────────┤
                                                              │
                    ILI-108 (Pitch deck) ◄────────────────────┘
```

**Don't do ILI-109 or ILI-110 if feedback is negative - skip to ILI-108 with "park it" decision.**

---

## Maximum Parallelization Summary

### Week 1 (Foundation)
**Max parallel: 3 tickets → then 6 tickets**
- Start: ILI-84, 86, 90 (all at once)
- Then: ILI-87, 88, 89, 91, 92, 93 (after ILI-85)

### Week 2-3 (Choreography)
**Max parallel: 3 tickets at start, then sequential**
- Start: ILI-94, 95, 98 (all at once)
- Then: Sequential critical path through ILI-96 (money shot)

### Week 4 (Polish)
**Max parallel: 2 tracks (PM + Dev)**
- PM: ILI-102 (tests)
- Dev: ILI-103 → 104 → 105 (sequential)
- Designer: ILI-106 (last, after polish)

### Week 5 (Decide)
**Sequential: Can't parallelize much**
- Must wait for ILI-107 (synthesis) before anything else
- Then ILI-109 + 110 can run parallel
- Then ILI-108 (pitch) last

---

## Critical Path (Longest Dependency Chain)

The absolute critical path that determines minimum timeline:

```
ILI-85 (Timing - 0.5 days)
  ↓
ILI-88 (Style guide - 1 day)
  ↓
ILI-94 (Dotted wireframe - 2 days)
  ↓
ILI-97 (Solid transition - 0.5 days)
  ↓
ILI-96 (Image flies in - 3 days) ◄── BOTTLENECK
  ↓
ILI-99 (Doors close - 2 days)
  ↓
ILI-101 (Idle state - 0.5 days)
  ↓
ILI-102 (User tests - 5 days spread across week)
  ↓
ILI-107 (Synthesis - 2 days)
  ↓
ILI-108 (Pitch - 2 days)

TOTAL: ~18.5 days minimum on critical path
```

**With parallelization and full team: 5 weeks is realistic.**

---

## Recommended Work Assignment

### If You're Solo (Doing All Roles)
**Week by week:**

**Week 1:**
- Day 1-2: ILI-84, 85, 86 (PM work)
- Day 3-4: ILI-90, 91 (Dev spike + static container)
- Day 5: ILI-87, 88, 89 (Designer work)

**Week 2:**
- Day 1-2: ILI-94 (dotted wireframe)
- Day 3-4: ILI-95, 97 (crate + transition)
- Day 5: ILI-98 (walls materialize)

**Week 3:**
- Day 1-3: ILI-96 (IMAGE FLYING IN - take your time)
- Day 4: ILI-99 (doors close)
- Day 5: ILI-100, 101 (lighting + idle)

**Week 4:**
- Day 1-2: ILI-103, 104 (performance + replay)
- Day 3-5: ILI-102 (user tests spread across week)
- Day 5: ILI-105, 106 (deploy + video)

**Week 5:**
- Day 1-2: ILI-107 (synthesis)
- Day 3-4: ILI-109, 110 (future mockups + retro)
- Day 5: ILI-108 (pitch deck)

### If You Have Full Team (PM + Designer + Dev)

**Everyone works in parallel all the time:**

**Week 1:** PM does 84, 85, 86 | Designer does 87, 88, 89 | Dev does 90, 91, 92, 93
**Week 2-3:** Dev builds animations | Designer refines | PM reviews
**Week 4:** PM tests | Dev polishes | Designer records
**Week 5:** PM synthesizes | Designer mocks up future | Dev writes retro | PM pitches

---

## TL;DR: Start Here

### TODAY
1. **ILI-84** (PM: Write brief) - 2 hours
2. **ILI-85** (PM: Define timing) - 2 hours
3. **ILI-90** (Dev: R3F spike) - 4 hours

### TOMORROW
4. **ILI-86** (PM: Source testers) - 1 hour
5. **ILI-87, 88, 89** (Designer: All three) - Full day
6. **ILI-91, 92** (Dev: Container + controls) - Full day

### REST OF WEEK 1
7. **ILI-93** (Dev: Docker API) - 4 hours

Then you're ready for Week 2 choreography build.

---

## Pro Tips

1. **Don't skip ILI-85** (timing) - everything depends on this
2. **Spend extra time on ILI-96** (image flying in) - this is the magic moment
3. **Run ILI-86** (source testers) early - harder to book people last minute
4. **Don't start ILI-109/110** until you know feedback is positive
5. **ILI-102** (user tests) can't be rushed - spread across full week

**You can compress to 3-4 weeks if you skip polish, but don't skip testing.**

---

*Ready to execute. Start with ILI-84, 85, 90 today.*
