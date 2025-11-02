# Docker Image Crate Design Specification

**Issue:** ILI-89 - [Designer] Design the image crate
**Date:** 2025-11-01
**Status:** Design Specification
**Priority:** High

---

## 1. Overview

The Docker image crate is a visual metaphor that makes the distinction between Docker images and containers immediately clear. This is the "aha moment" in understanding containerization - the image is a physical package that flies into and populates the container.

### Design Goal
Create a 3D crate/package object that:
- Clearly represents a Docker image
- Feels substantial and weighty
- Animates smoothly into the container
- Enhances understanding of image-vs-container relationship

---

## 2. Design Explorations

### Exploration A: Classic Shipping Crate
**Style:** Industrial, physical, tangible
**Shape:** Cube with wooden slats (like a cargo crate)
**Dimensions:** 120x120x120 units (relative to container)
**Material:** Wood texture with metal corner reinforcements
**Logo:** Docker whale printed/stenciled on front face (like shipping label)
**Animation:** Rotates slowly during flight, settles with slight bounce

**Pros:**
- Immediately recognizable as "package"
- Matches "shipping" metaphor of Docker
- Feels solid and substantial
- Wood texture provides visual warmth

**Cons:**
- May feel too literal/mundane
- Could look dated without proper styling
- Wood grain may be hard to render cleanly at small sizes

---

### Exploration B: Holographic Data Cube
**Style:** Futuristic, digital, ethereal
**Shape:** Perfect cube with beveled edges
**Dimensions:** 100x100x100 units
**Material:** Translucent glass/crystal with internal glow
**Logo:** Docker whale embossed/etched on front, glows from within
**Animation:** Gentle rotation + pulsing glow, particles trail during flight

**Pros:**
- Modern, tech-forward aesthetic
- Glow effect draws attention
- Matches digital nature of Docker images
- Can display layer information as internal strata

**Cons:**
- May be too abstract
- Glow effects could be distracting
- Harder to read as "container payload"
- Performance considerations for transparency/effects

---

### Exploration C: Metallic Cargo Pod
**Style:** Space-age, industrial-chic
**Shape:** Rectangular box (16:10:10 ratio) with rounded corners
**Dimensions:** 160x100x100 units
**Material:** Brushed aluminum/titanium finish with panel lines
**Logo:** Docker whale as raised emblem on front, backlit
**Animation:** Smooth glide-in with afterburner effect, magnetic docking sensation

**Pros:**
- Balances modern and industrial
- Rectangle shape suggests "cargo"
- Panel lines provide visual interest
- Backlit logo is elegant and functional
- Size variation adds realism

**Cons:**
- May look too "sci-fi"
- Reflections could be complex to render
- Requires careful lighting to avoid looking flat

---

### Exploration D: Stylized Docker Box (Recommended)
**Style:** Branded, approachable, clean
**Shape:** Slightly rounded rectangular prism (golden ratio: 1.618:1:1)
**Dimensions:** 130x80x80 units
**Material:** Matte finish with subtle gradient (Docker blue #0db7ed to lighter shade)
**Logo:** Docker whale as textured decal on front face, slight emboss
**Animation:** Smooth arc trajectory, gentle spin (15° rotation), soft landing with slight scale bounce (1.0 → 1.05 → 1.0)

**Pros:**
- Immediately recognizable as Docker-related
- Clean, professional appearance
- Approachable and friendly (not intimidating)
- Works well at various sizes
- Easy to render performantly
- Logo integration is natural

**Cons:**
- May be seen as "too branded"
- Less metaphorically rich than shipping crate

---

### Exploration E: Hexagonal Crystal Container
**Style:** Geometric, crystalline, scientific
**Shape:** Hexagonal prism (height = 1.2x diameter)
**Dimensions:** 110x132x110 units
**Material:** Frosted glass with color-coded bands (blue for official images)
**Logo:** Docker whale on top hexagonal face
**Animation:** Spins on vertical axis during flight, settles with hexagonal rotation lock

**Pros:**
- Unique shape stands out
- Hexagon has tech/efficiency connotations
- Color-coding system could indicate image types
- Geometric precision feels engineered

**Cons:**
- Less intuitive as "package"
- Hexagon may complicate collision/docking
- Docker whale less visible on top face

---

## 3. Recommended Design: Exploration D (Stylized Docker Box)

### Final Specifications

#### Physical Properties
- **Shape:** Rounded rectangular prism
- **Proportions:** 1.618:1:1 (golden ratio for width:height:depth)
- **Dimensions:** 130x80x80 units (scale relative to container interior)
- **Weight:** Appears substantial but not heavy

#### Material & Texture
- **Primary surface:** Matte finish
- **Color:** Gradient from Docker blue (#0db7ed) at bottom to lighter (#4dc9f0) at top
- **Finish:** Subtle roughness (roughness map: 0.3-0.4)
- **Specular:** Low specularity to maintain matte appearance
- **Edge treatment:** Slightly rounded corners (radius: 4 units) to catch light

#### Logo Integration
- **Position:** Centered on front face (largest surface)
- **Treatment:** Docker whale as raised emboss (2 units depth)
- **Color:** Slightly darker than base material (#0995ba)
- **Alternative:** White Docker whale decal (#ffffff, 80% opacity) for high contrast
- **Size:** Logo occupies 60% of front face area

#### Surface Details
- **Panel lines:** Subtle recessed lines suggesting paneling (0.5 unit depth)
- **Corner reinforcements:** Small rounded caps at corners (metallic accent)
- **Handle indicators:** Optional: recessed handle shapes on sides

---

## 4. Animation Specifications

### Entry Animation (Image Loads)
```
Timeline: 0-1.5s total

0.0s - 0.1s: Fade in at origin point (opacity 0 → 1)
0.1s - 0.9s: Arc trajectory toward container
  - Start position: 200 units away, 100 units up
  - End position: container entry point
  - Path: Bezier curve (ease-in-out)
  - Rotation: Gentle spin (15° on Y-axis)
0.9s - 1.2s: Glide into container interior
  - Linear motion, decelerate
  - Rotation slows to 0°
1.2s - 1.5s: Settle animation
  - Slight bounce (scale: 1.0 → 1.05 → 1.0)
  - Position lock
```

### Idle State
- **Position:** Centered or slightly offset in container
- **Animation:** Very subtle float (±2 units on Y-axis, 4s cycle)
- **Glow:** Optional: soft blue rim light (60% intensity)

### Exit Animation (Container Stops/Image Removed)
```
Timeline: 0-1.0s total

0.0s - 0.3s: Lift-off
  - Y-axis: +20 units
  - Rotation: Begins spinning (reverse of entry)
0.3s - 0.8s: Fly away
  - Arc trajectory in reverse
  - Accelerate
  - Spin rate increases (45° rotation)
0.8s - 1.0s: Fade out
  - Opacity: 1 → 0
  - Continue motion for smoothness
```

---

## 5. Technical Implementation Requirements

### 3D Model Format
- **Primary format:** GLTF/GLB (optimized for web)
- **Polygon count:** <2,000 triangles (performance target)
- **Texture resolution:** 1024x1024 base color + normal map
- **Separate logo texture:** 512x512 PNG with transparency

### Framework Integration
- **Library:** Three.js + React Three Fiber
- **Dependencies to add:**
  ```json
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0",
  "three": "^0.160.0"
  ```

### Component Structure
```
src/components/3d/ImageCrate/
├── ImageCrate.tsx              # Main component wrapper
├── ImageCrateModel.tsx         # Three.js model loader
├── ImageCrateAnimation.ts      # Animation logic
├── ImageCrate.stories.tsx      # Storybook integration
└── useImageCrateAnimation.ts   # Animation hook

public/models/
├── image-crate.glb             # 3D model
└── docker-whale-logo.png       # Logo texture
```

### Performance Considerations
- Use `useMemo` for geometry/material
- Implement LOD (Level of Detail) for distant views
- Lazy load 3D assets
- Target: 60fps on mid-range devices

---

## 6. Visual Reference Assets Needed

### To Create
1. **3D Model Files**
   - `image-crate.glb` - Optimized 3D model
   - `image-crate-highres.blend` - Source file (Blender)

2. **Texture Maps**
   - `crate-base-color.png` - Main color/gradient
   - `crate-normal.png` - Surface detail normals
   - `crate-roughness.png` - Roughness map
   - `docker-whale-logo.png` - Docker whale decal

3. **Concept Sketches** (For design review)
   - Front view with logo
   - Perspective view showing 3D form
   - Size comparison vs container
   - Animation sequence storyboard (6-8 frames)

4. **Storybook Examples**
   - Static display (all angles)
   - Entry animation demo
   - Exit animation demo
   - Interactive controls (rotation, scale)

---

## 7. Design Rationale

### Why This Matters
This visual element is crucial for educational clarity:
- **Images are templates:** The crate represents the immutable blueprint
- **Containers are instances:** The container receives and runs the image
- **Visual metaphor:** Physically separates the concepts
- **Movement = deployment:** The flight animation shows the "loading" process

### Alignment with Design System
- **Docker brand colors:** Uses official Docker blue palette
- **Material-UI integration:** Can be wrapped in MUI Paper/Card components
- **Consistent with AgentWorkflow:** Matches sophistication of existing UI (see `AgentWorkflow.tsx:969`)
- **Minimal customization:** Follows project philosophy of stock components where possible

---

## 8. Implementation Timeline

### Phase 1: Design Finalization (Current)
- [ ] Review this specification
- [ ] Approve design direction (Exploration D or alternative)
- [ ] Gather reference images

### Phase 2: Asset Creation (4-6 hours)
- [ ] Model crate in Blender (or Spline)
- [ ] Create texture maps
- [ ] Export optimized GLB
- [ ] Extract Docker whale logo

### Phase 3: Component Development (6-8 hours)
- [ ] Install Three.js dependencies
- [ ] Create ImageCrate component
- [ ] Implement animation system
- [ ] Add Storybook stories
- [ ] Performance optimization

### Phase 4: Integration (2-3 hours)
- [ ] Integrate with container visualization
- [ ] Add to relevant documentation
- [ ] Test across devices
- [ ] Final polish

**Total estimated time:** 12-17 hours

---

## 9. Open Questions for Review

1. **Design direction:** Approve Exploration D or select alternative?
2. **Logo treatment:** Embossed or decal? Both available?
3. **Animation timing:** 1.5s entry feel right, or faster/slower?
4. **Glow effect:** Add subtle rim light or keep matte only?
5. **Sound design:** Should crate make subtle sound on docking?
6. **Multiple images:** Should multiple crates stack/queue when loading multiple images?
7. **Layer visualization:** Should crate split apart to show Docker layers?

---

## 10. Success Metrics

This design will be successful if:
- [ ] Users immediately understand the image/container distinction
- [ ] Animation feels smooth and professional (60fps)
- [ ] Design is recognizable as Docker-related
- [ ] Component integrates cleanly with existing codebase
- [ ] Positive feedback from user testing
- [ ] Minimal performance impact (<50ms load time)

---

## Appendix A: Color Palette

```css
/* Docker Official Colors */
--docker-blue: #0db7ed;
--docker-blue-light: #4dc9f0;
--docker-blue-dark: #0995ba;
--docker-navy: #066da5;

/* Accent Colors for States */
--crate-loading: #0db7ed;    /* In flight */
--crate-running: #4dc9f0;    /* Settled in container */
--crate-stopped: #8899aa;    /* Idle/stopped */
--crate-error: #ff4444;      /* Error state */
```

## Appendix B: Alternative Use Cases

This crate design can be extended for:
- **Image layers:** Crate separates into stacked layers
- **Multi-stage builds:** Multiple crates combine
- **Image pulls:** Progress bar on crate surface
- **Registry visualization:** Crates on warehouse shelves
- **Version comparison:** Side-by-side crates with version labels

---

**Next Step:** Review this specification and approve design direction for asset creation phase.
