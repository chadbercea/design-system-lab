# Container Story MVP - Execution Plan

**Status:** Ready to Execute
**Team:** PM, Interaction Designer, Developer
**Project:** [Container Story MVP in Linear](https://linear.app/iliketobuild/project/container-story-mvp-3e3b5d7ce74d)

---

## What Changed From The Original PRD

### Original PRD Problems
- Solved a non-existent problem
- Too much scope (multi-container, navigation chrome, keyboard shortcuts, mobile)
- Unclear user and value proposition
- No validation plan

### What We Learned From Interview
- **User:** You (Staff Product Designer at Docker) + CLI-native devs who ignore Docker Desktop
- **Real Problem:** Docker Desktop is so boring people don't even open it
- **Goal:** Prove that "fun" is worth investing in at Docker
- **Vision:** Make Docker containers visible and delightful, not just functional
- **Key Insight:** The story of container → image → running is invisible in CLI and boring in GUI

### New MVP Scope
**ONE container. ONE perfect 30-second choreography. Nothing else.**

The sequence:
1. **Building** (0-10s): Dotted wireframe materializes, blue pulsing glow, machine vibes
2. **Image Load** (10-20s): Container solidifies, Docker image (crate) flies in and docks inside
3. **Seal & Run** (20-30s): Walls materialize, doors close, green glow, container is "alive"

**That's it.** No multi-container, no stats, no navigation UI. Just the magic moment.

---

## Success Criteria

We'll know this works if:
1. **Delight Test:** 8/10 people say "whoa" or "that's cool"
2. **Comprehension Test:** Person unfamiliar with Docker can explain image vs container after watching
3. **Rewatch Test:** People want to replay it multiple times
4. **Excitement Test:** Internal Docker folks want to see more

---

## Work Breakdown By Phase

### Phase 1: Foundation (Week 1)
**Goal:** Validate technical approach, align on vision

**PM Tasks:**
- [ILI-84] Write revised product brief (1-pager)
- [ILI-85] Define choreography timing (exact seconds per phase)
- [ILI-86] Source 5-8 people for feedback (internal + external devs)

**Designer Tasks:**
- [ILI-87] Storyboard the 30-second sequence (frame-by-frame)
- [ILI-88] Define visual style and materials (colors, materials, lighting)
- [ILI-89] Design the image crate (the thing that flies in)

**Developer Tasks:**
- [ILI-90] Spike: React Three Fiber setup in Next.js
- [ILI-91] Render static container with edges (BoxGeometry + EdgesGeometry)
- [ILI-92] Implement OrbitControls (rotation interaction)
- [ILI-93] Validate Docker Engine API access (can we trigger from real events?)

---

### Phase 2: Choreography (Week 2-3)
**Goal:** Build the animated sequence

**Developer Tasks:**
- [ILI-94] Build Phase: Dotted wireframe with pulsing blue glow
- [ILI-95] Build image crate geometry (based on Designer specs)
- [ILI-96] Animate image crate flying in and docking (the money shot)
- [ILI-97] Wireframe to solid transition (dotted → solid lines)
- [ILI-98] Walls materialize (opacity 0 → 1, Docker logo appears)
- [ILI-99] Door closing animation (weighted, satisfying)
- [ILI-100] Add edge lighting (blue building, green running)
- [ILI-101] Idle state animation after sequence (subtle breathing/pulse)

**PM:** Review builds, give feedback on timing and feel

**Designer:** Refine animations in collaboration with developer

---

### Phase 3: Polish & Test (Week 4)
**Goal:** Make it production-ready and test with users

**PM Tasks:**
- [ILI-102] Conduct 5-8 user tests and document feedback

**Developer Tasks:**
- [ILI-103] Performance optimization (target 60fps)
- [ILI-104] Add Replay button
- [ILI-105] Deploy demo to Vercel (shareable URL)

**Designer Tasks:**
- [ILI-106] Capture high-quality demo video (for sharing/presentations)

---

### Phase 4: Decide Next (Week 5)
**Goal:** Analyze results and decide future

**PM Tasks:**
- [ILI-107] Synthesize feedback into decision doc (Double Down / Pivot / Park It)
- [ILI-108] Prepare internal pitch deck with demo (for Docker leadership)

**Designer Tasks:**
- [ILI-109] Create Future Vision mockups for Phase 2 (if validated)

**Developer Tasks:**
- [ILI-110] Write technical retrospective (what worked, what was hard)

---

## What We Cut (Intentionally)

These are NOT in MVP scope:
- ❌ Multi-container grid
- ❌ Door opening interactions (doors close but don't re-open)
- ❌ Interior visualization (what's inside container)
- ❌ Real-time stats panels
- ❌ Logs viewer
- ❌ Start/stop controls
- ❌ Navigation chrome (top bar, side panel, FAB)
- ❌ Keyboard shortcuts
- ❌ Mobile responsive
- ❌ 2D fallback view

**Why?** None of these test the core hypothesis: "Is the choreography delightful enough to matter?"

---

## Technical Stack

- **Framework:** Next.js (existing app)
- **3D Library:** React Three Fiber + Drei
- **Approach:** Procedural geometry (BoxGeometry, EdgesGeometry, LineDashedMaterial)
- **No external models:** Everything generated in code
- **Animation:** CSS transitions, react-spring, or framer-motion-3d
- **Deployment:** Vercel

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Animation feels too slow/boring | High | Designer creates multiple timing variations, A/B test |
| React Three Fiber learning curve | Medium | Dev does spike in Week 1, flags issues early |
| People don't "get it" without explanation | Medium | Add minimal text overlays to guide the story |
| Technical metaphor is inaccurate | Medium | PM validates with Docker engineers early |
| Side project loses momentum | High | Keep scope ruthlessly small, ship every 2 weeks |

---

## What Happens After MVP?

### If Feedback Is Positive (Delight scores high, comprehension good):
**Phase 2 Scope:**
- Multi-container grid (see relationships)
- Door opening + interior view (processes, logs)
- Real-time stats integration
- Full Docker Desktop integration pitch

### If Feedback Is Mixed:
**Pivot Options:**
- Different timing/pacing
- Different visual metaphor
- Use as onboarding/tutorial tool instead of dashboard
- Simplified version for educational content

### If Feedback Is Negative:
**Park It Gracefully:**
- Document what we learned about 3D interfaces
- Share findings with team
- Move on to next experiment

---

## Key Metrics (From User Tests)

1. **Delight Score:** Average rating 1-10, aim for 8+
2. **Comprehension:** % who can explain image vs container, aim for 80%+
3. **Rewatch Rate:** % who replay without prompting, aim for 60%+
4. **Excitement:** % of internal stakeholders who want Phase 2, aim for 70%+

---

## Timeline Summary

- **Week 1:** Foundation (technical validation + design alignment)
- **Week 2-3:** Choreography (build the animation)
- **Week 4:** Polish & Test (user feedback)
- **Week 5:** Decide Next (synthesis + pitch)

**Total:** 5 weeks to validated MVP or pivot decision

---

## Linear Project

All issues tracked in Linear: [Container Story MVP Project](https://linear.app/iliketobuild/project/container-story-mvp-3e3b5d7ce74d)

**Total Issues Created:** 27
- Phase 1 (Foundation): 10 issues
- Phase 2 (Choreography): 8 issues
- Phase 3 (Polish): 5 issues
- Phase 4 (Decide): 4 issues

---

## Next Steps

1. **PM:** Start with ILI-84 (write product brief) and ILI-85 (define timing)
2. **Designer:** Start with ILI-87 (storyboard) after PM defines timing
3. **Developer:** Start with ILI-90 (React Three Fiber spike) immediately
4. **Team:** Sync weekly to review progress and unblock

---

## The Real Product Vision

This isn't about replacing Docker CLI or building a better dashboard.

**This is about proving that Docker can be delightful.**

If we succeed, we show Docker leadership that "fun" isn't frivolous—it's what makes people WANT to open your product instead of avoiding it.

The 3D visualization makes the invisible visible: the story of containers coming to life. That story is hidden in the CLI and boring in Docker Desktop today.

**We're making Docker worth watching.**

---

*Document created: 2025-11-01*
*Based on interview and PRD review*
*Ready to execute*
