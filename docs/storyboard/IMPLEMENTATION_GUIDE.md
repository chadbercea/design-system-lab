# Implementation Guide
From storyboard to production

## Quick Paths

### Figma (2-4 hours, rapid iteration)
1. Create 1920x1080 frames for 12 beats
2. Build components: container states, icons, status elements
3. Add Smart Animate transitions with timing
4. Export: Share link or PDF

### After Effects (8-16 hours, final production)
1. Comp: 1920x1080, 30fps, 30s
2. Folder structure by phase/beat
3. Animate using shape layers + expressions
4. Effects: Glow, motion blur, color correction
5. Export: H.264 for review, ProRes for delivery

### Web GSAP (6-12 hours, interactive)
```javascript
const tl = gsap.timeline();
tl.from("#files", {opacity: 0, scale: 0.8, duration: 2, stagger: 0.2});
tl.to("#wireframe", {strokeDashoffset: 0, duration: 2}, "+=0.5");
// Continue for all beats...
```

### Quick Animatic (1-2 hours, timing approval)
Keynote/PowerPoint with Magic Move transitions, 1 slide per beat

## After Effects Details

**Wireframe pulse expression:**
```javascript
baseline = 4;
pulse = Math.sin(time * 3) * 2;
baseline + pulse;
```

**File float expression:**
```javascript
wiggle(0.5, 10); // gentle float
```

## Production Checklist
- [ ] Style frame approved
- [ ] Phase 1 animated
- [ ] Phase 2 animated
- [ ] Phase 3 animated
- [ ] Transitions added
- [ ] Camera moves implemented
- [ ] Effects/polish
- [ ] Color correction
- [ ] Sound (if applicable)
- [ ] Test timing
- [ ] Revise based on feedback
- [ ] Export: MP4 (web), MOV (editing), source files

## Common Issues
**Timing feels off:** Do rough animatic first, focus on timing before detail
**Too complex:** Simplify. Well-executed simple > poorly-executed complex
**File too large:** Reduce resolution, lower to 24fps, use better compression
**Animations mechanical:** Add anticipation, proper easing (never linear), vary timing
**Color inconsistent:** Work in sRGB, test on multiple devices

## File Naming
`30s-sequence-v1-draft.mp4`
`30s-sequence-v2-review.mp4`
`30s-sequence-final-high.mov`
`30s-sequence-final-web.mp4`
