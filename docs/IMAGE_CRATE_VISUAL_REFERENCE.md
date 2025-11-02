# Docker Image Crate - Visual Reference Guide

**Related:** IMAGE_CRATE_DESIGN_SPEC.md
**For:** Designers, 3D Artists, Developers
**Status:** Visual Reference

---

## 1. Concept Sketches

### View 1: Front Perspective (Recommended Design - Exploration D)

```
                     ╱─────────────────────╲
                    ╱                       ╲
                   ╱    ┌─────────────┐     ╲
                  ╱     │             │      ╲
                 ╱      │   .-"-.     │       ╲
                ╱       │  /     \    │        ╲
               ╱        │ |   🐋  |   │         ╲
              ╱         │  \     /    │          ╲
             ╱          │   '-.-'     │           ╲
            ╱           │             │            ╲
           ╱            │   DOCKER    │             ╲
          ╱             └─────────────┘              ╲
         ╱                                            ╲
        ╱______________________________________________╲
        │                                              │
        │                                              │
        │          [Docker Blue Gradient]             │
        │         #0db7ed → #4dc9f0                   │
        │                                              │
        │  ┌─┐                                  ┌─┐  │
        │  └─┘        Matte Finish             └─┘  │
        │         Slightly Rounded Corners            │
        └──────────────────────────────────────────────┘

        Proportions: 1.618 : 1 : 1 (Golden Ratio)
        Width: 130 units | Height: 80 units | Depth: 80 units
```

---

### View 2: Side Profile

```
                          TOP VIEW
        ┌────────────────────────────────────┐
        │                                    │
        │         [Subtle Panel Lines]       │
        │                                    │
        │  ○                              ○  │  ← Corner caps
        │                                    │
        └────────────────────────────────────┘


                        SIDE VIEW
                ┌──────────────────┐
                │                  │
                │                  │  } Gradient
                │                  │  } flows from
                │     [Side        │  } bottom to
                │      Panel]      │  } top
                │                  │
                │                  │
                │  ┌─┐             │  ← Handle recess
                │  └─┘             │     (optional)
                └──────────────────┘

        Depth: 80 units
        Rounded corners (4 unit radius)
```

---

### View 3: Isometric View

```
                    ╱──────────────────╲
                   ╱│                  │╲
                  ╱ │   Docker Logo    │ ╲
                 ╱  │                  │  ╲
                ╱   │  ┌──────────┐   │   ╲
               ╱    │  │          │   │    ╲
              ╱     │  │   🐳     │   │     ╲
             ╱      │  │          │   │      ╲
            ╱       │  └──────────┘   │       ╲
           ╱        │                  │        ╲
          ╱         │    (embossed)    │         ╲
         ╱          └──────────────────┘          ╲
        ╱___________________________________________╲
        │                                           │
        │        [Matte Docker Blue]                │
        │                                           │
        │    ┌─┐                             ┌─┐   │
        │    └─┘   Metallic corner caps     └─┘   │
        │                                           │
        └───────────────────────────────────────────┘
         ╲                                         ╱
          ╲         [Lighter Blue Top]           ╱
           ╲                                    ╱
            ╲                                  ╱
             ╲________________________________╱

        Shows: 3D depth, corner details, gradient direction
```

---

## 2. Animation Storyboard

### Frame 1: Off-screen (t=0.0s)
```
                                          ┌─────┐
                                         ╱       ╲
   [Container]                          │   🐋   │  ← Crate spawns
   ┌──────────┐                        │  Crate │     far away
   │          │                         ╲       ╱
   │          │                          └─────┘
   │          │                              ↗︎
   │          │                         (200 units away,
   │   EMPTY  │                          100 units up)
   │          │
   │          │
   └──────────┘

   State: Entering (0%)
   Opacity: 0 → 1 (fade in)
```

---

### Frame 2: In Flight (t=0.5s)
```
                        ┌─────┐
                       ╱   🐋  ╲
                      │  Crate  │  ← Flying in arc
                      ╲       ╱        trajectory
                       └─────┘
   [Container]            ↘︎
   ┌──────────┐          ∿∿∿  ← Motion blur
   │          │         ╱
   │          │        ╱  Rotating 15°
   │          │       ╱
   │          │
   │   EMPTY  │
   │          │
   └──────────┘

   State: Entering (33%)
   Position: Bezier curve interpolation
   Rotation: Gentle Y-axis spin
```

---

### Frame 3: Approaching (t=1.0s)
```
              ┌─────┐
             ╱   🐋  ╲
   [Container] Crate  │  ← Slowing down
   ┌──────────┐     ╱      approaching
   │     │    └─────┘         entry
   │     ↓                    point
   │   [Docking]
   │          │
   │          │
   │          │
   └──────────┘

   State: Entering (67%)
   Rotation: Straightening to 0°
   Speed: Decelerating
```

---

### Frame 4: Docking (t=1.2s)
```
   [Container]
   ┌──────────┐
   │  ┌─────┐ │
   │  │ 🐋  │ │  ← Entering container
   │  │Crate│ │     interior
   │  └─────┘ │
   │          │
   │          │
   │          │
   └──────────┘

   State: Entering (90%)
   Position: Linear glide inward
   Rotation: 0° (aligned)
```

---

### Frame 5: Settling (t=1.4s)
```
   [Container]
   ┌──────────┐
   │          │
   │  ┌─────┐ │
   │  │ 🐋  │ │  ← Slight bounce
   │  │Crate│ │     (scale pulse)
   │  └─────┘ │
   │          │
   │          │
   └──────────┘

   State: Settling
   Scale: 1.0 → 1.05 → 1.0
   Duration: 300ms
```

---

### Frame 6: Settled (t=1.5s+)
```
   [Container]
   ┌──────────┐
   │          │
   │  ┌─────┐ │
   │  │ 🐋  │ │  ← At rest
   │  │Crate│ │     (optional: subtle float)
   │  └─────┘ │
   │          │
   │    ∿∿    │  ← Contact shadow
   └──────────┘

   State: Settled / Floating
   Position: Locked or gentle float (±2 units)
   Optional: Soft blue rim glow
```

---

## 3. Logo Design Reference

### Docker Whale Logo Placement

```
Front Face (130 x 80 units surface):

┌────────────────────────────────────┐
│                                    │
│         ┌──────────────┐          │
│         │              │          │
│         │   .-"-.      │          │
│         │  /     \     │          │  Docker whale logo:
│         │ |   🐋  |    │          │  - Centered on front
│         │  \     /     │          │  - 60% of face area
│         │   '-.-'      │          │  - 78 x 48 units
│         │              │          │
│         │   DOCKER     │          │  Treatment options:
│         └──────────────┘          │  A) Embossed (2 units deep)
│                                    │  B) Decal (white, 80% opacity)
└────────────────────────────────────┘

Emboss Detail (Cross-section):
                    ┌───────┐
    ══════════════╱         ╲══════════
    Face surface  │    🐋    │ ← Raised 2 units
                   ╲         ╱
                    └───────┘
```

---

### Alternative Logo Configurations

**Option A: Front Only** (Recommended)
- Logo on front face only
- Clean, focused design
- Best for directional viewing

**Option B: All Sides**
- Logo on all visible faces
- Recognizable from any angle
- May be visually busy

**Option C: Top + Front**
- Logo on top and front
- Good for aerial views
- Balanced visibility

---

## 4. Material & Texture Details

### Color Gradient Specification

```
    TOP ─────────────────────────────────
    │                                    │
    │   Lighter Blue: #4dc9f0           │  ← Top edge
    │                                    │
    │          ▼ Gradient ▼             │
    │                                    │
    │   Mid Blue: #2ac4ed               │  ← Center
    │                                    │
    │          ▼ Gradient ▼             │
    │                                    │
    │   Docker Blue: #0db7ed            │  ← Bottom edge
    │                                    │
    BOTTOM ──────────────────────────────

    Gradient Type: Linear (top to bottom)
    Falloff: Smooth (easeInOutQuad)
```

---

### Surface Finish

```
    Roughness Map (0.0 = glossy, 1.0 = rough)

    Overall Roughness: 0.35-0.40 (matte)

    ┌──────────────────────────────────┐
    │  0.4   0.4   0.4   0.4   0.4    │  ← Top
    │                                  │
    │  0.35  0.35  0.35  0.35  0.35   │  ← Sides
    │                                  │     (slightly shinier)
    │  0.40  0.40  0.40  0.40  0.40   │
    │                                  │
    │  Corner Caps: 0.15 (metallic)   │  ← Accent details
    └──────────────────────────────────┘

    Metalness: 0.1 (mostly dielectric)
    Corner Caps: 0.85 (brushed metal)
```

---

### Panel Line Detail

```
    Front Face with Panel Lines:

    ┌─────────────┬─────────────┬──────────────┐
    │             │             │              │
    │             │             │              │
    │             │   DOCKER    │              │
    │             │    WHALE    │              │
    │             │     🐋      │              │  Panel lines:
    │             │             │              │  - 0.5 unit recess
    ├─────────────┼─────────────┼──────────────┤  - Subtle detail
    │             │             │              │  - Break up surface
    │             │             │              │  - Add visual interest
    │             │             │              │
    └─────────────┴─────────────┴──────────────┘

    Alternative: No panel lines for cleaner look
```

---

## 5. Lighting Reference

### Recommended Lighting Setup

```
                    Key Light (Directional)
                         ↓  ↓  ↓
                    Position: (5, 5, 5)
                    Intensity: 1.0
                         │
        Rim Light  ──→   │   ←── Rim Light
         (-5, 5, -5)     │       (5, 5, -5)
         Intensity: 0.5  │       Intensity: 0.5
                         │
                    ┌─────────┐
                    │   🐋    │  ← Crate
                    │  Crate  │
                    └─────────┘
                         │
                    ─────────────  Ground
                      (Shadow)

    Ambient Light: 0.5 intensity (prevents pure black)
    Environment: Warehouse HDRI (neutral, industrial)
```

---

### Glow Effect (Optional)

```
    Without Glow:              With Glow:

       ┌─────────┐               ╭─────────╮
       │   🐋    │               │▒ ┌───┐ ▒│  ← Soft halo
       │  Crate  │               │▒▒│🐋 │▒▒│    (BackSide material)
       └─────────┘               │▒▒└───┘▒▒│    Opacity: 0.3
                                 ╰─────────╯    Color: Lighter blue

    Glow shader:
    - Scale: 1.05x crate size
    - Color: #4dc9f0 (brightened)
    - Rendered with BackSide culling
    - Additive blending
```

---

## 6. Size Comparison Chart

```
    Relative Size: Crate vs Container

    [Container Interior - 800 x 600 x 600 units]

    ┌────────────────────────────────────────────────┐
    │                                                │
    │    ┌──────────────────────┐                   │
    │    │        CRATE          │  ← 130 x 80 x 80 │
    │    │    (16% of width)     │     (Recommended)│
    │    └──────────────────────┘                   │
    │                                                │
    │         Feels: Substantial but not cramped    │
    └────────────────────────────────────────────────┘


    Too Small (50 x 30 x 30):        Too Large (300 x 180 x 180):

    ┌───────────────────┐            ┌───────────────────┐
    │                   │            │ ┌───────────────┐ │
    │  ┌──┐            │            │ │               │ │
    │  └──┘            │            │ │     CRATE      │ │
    │   ↑              │            │ │               │ │
    │  Hard to see     │            │ └───────────────┘ │
    │                   │            │  ↑ Cramped        │
    └───────────────────┘            └───────────────────┘
```

---

## 7. State Variations

### Error State
```
    ┌─────────┐
    │   🐋    │  ← Red tint (#ff4444)
    │  ERROR  │    Slight shake animation
    │  Crate  │    Exclamation mark overlay (!)
    └─────────┘
       ↓↓↓
     ∿∿ƴ∿∿      ← Agitated movement
```

---

### Loading State
```
    ┌─────────┐
    │   🐋    │  ← Progress indicator
    │ [████░░]│    Shows layer download
    │  Crate  │    0-100%
    └─────────┘
       ↓
     ━━━━━      ← Pulse glow
```

---

### Multiple Images
```
    [Container]
    ┌──────────────────┐
    │  ┌───┐ ┌───┐     │  ← Queue animation
    │  │ 1 │ │ 2 │     │    Stacked or lined up
    │  └───┘ └───┘     │    Second waits for first
    │                  │
    └──────────────────┘

    Or vertical stack:

    ┌──────────┐
    │  ┌───┐   │
    │  │ 3 │   │  ← Layered appearance
    │  ├───┤   │    Shows image hierarchy
    │  │ 2 │   │
    │  ├───┤   │
    │  │ 1 │   │
    │  └───┘   │
    └──────────┘
```

---

## 8. Export Specifications for Assets

### 3D Model Export Settings

**Blender Export:**
- Format: GLTF 2.0 (.glb binary)
- Include: Meshes, Materials, Textures
- Transform: Apply all transforms
- Geometry: Triangulate faces
- Compression: Draco (level 10)
- Target size: <500KB

**Polygon Budget:**
- Crate body: 500 triangles
- Corner details: 200 triangles
- Logo plane: 2 triangles
- Total: <2,000 triangles

---

### Texture Export Settings

**Base Color Map:**
- Size: 1024 x 1024 px
- Format: PNG or JPEG (if no transparency)
- Color Space: sRGB
- Content: Docker blue gradient

**Normal Map:**
- Size: 1024 x 1024 px
- Format: PNG
- Color Space: Linear
- Content: Panel lines, surface detail

**Roughness Map:**
- Size: 512 x 512 px (can be smaller)
- Format: PNG or JPEG
- Color Space: Linear
- Content: Grayscale roughness values

**Docker Logo:**
- Size: 512 x 512 px
- Format: PNG with alpha
- Color Space: sRGB
- Content: Docker whale + text
- Source: https://www.docker.com/company/newsroom/media-resources/

---

## 9. Accessibility Considerations

### Reduced Motion
```
    When prefers-reduced-motion is enabled:

    STANDARD:                   REDUCED MOTION:
    ┌─────┐ ━━→ 〰️ ━━→          ┌─────┐ ━━→
    │ 🐋  │  Arc path            │ 🐋  │ Direct fade-in
    └─────┘  Rotation            └─────┘ No rotation
    1.5s animation               0.3s fade only

    Implementation:
    @media (prefers-reduced-motion: reduce) {
      // Skip arc trajectory
      // Use simple opacity fade
      // Disable rotation
    }
```

---

### Color Contrast (for UI text over crate)
```
    Docker Blue (#0db7ed) vs White text:
    Contrast ratio: 3.2:1 (AA Large only)

    Recommendation: Add dark overlay for text
    or use darker Docker navy (#066da5)
    which gives 7.8:1 contrast (AAA compliant)
```

---

## 10. Reference Images to Create

**Essential Assets:**
1. `crate-concept-front.png` - Front view with logo
2. `crate-concept-iso.png` - Isometric 3D view
3. `crate-animation-sequence.png` - 6-frame storyboard
4. `crate-size-comparison.png` - Crate in container context
5. `crate-materials.png` - Material/texture breakdown

**3D Files:**
1. `image-crate.blend` - Blender source file
2. `image-crate.glb` - Optimized web model
3. `image-crate-highres.glb` - High-res for renders

**Textures:**
1. `docker-whale-logo.png` - Docker logo (512x512)
2. `crate-base-color.png` - Gradient map (1024x1024)
3. `crate-normal.png` - Normal map (1024x1024)
4. `crate-roughness.png` - Roughness map (512x512)

---

## 11. Quick Reference: Key Dimensions

| Property | Value | Notes |
|----------|-------|-------|
| Width | 130 units | Golden ratio base |
| Height | 80 units | 1/1.618 of width |
| Depth | 80 units | Same as height |
| Corner Radius | 4 units | Subtle rounding |
| Logo Width | 78 units | 60% of front face |
| Logo Height | 48 units | Maintains whale proportion |
| Emboss Depth | 2 units | Subtle 3D effect |
| Panel Line Depth | 0.5 units | Surface detail |
| Container Scale | 800x600x600 | Crate is 16% of width |

---

## 12. Brand Compliance

### Docker Brand Colors (Official)
- **Primary Blue:** #0db7ed
- **Dark Blue:** #066da5
- **Light Blue:** #4dc9f0

### Logo Usage Guidelines
- Maintain clear space around logo (minimum 10% of logo size)
- Do not distort whale proportions
- Do not change Docker blue to other colors (except monochrome)
- Source official assets from Docker media kit

### Attribution
If publishing renders or examples:
> "Docker and the Docker logo are trademarks of Docker, Inc."

---

## Summary

This visual reference provides concrete specifications for creating the Docker image crate:

1. **Recommended design:** Exploration D (Stylized Docker Box)
2. **Key feature:** Docker whale logo centered on front face
3. **Proportions:** Golden ratio (1.618:1:1) for visual harmony
4. **Animation:** Smooth 1.5s entry with arc trajectory and gentle spin
5. **Style:** Matte finish, Docker blue gradient, subtle panel details
6. **Size:** 130x80x80 units (16% of container width)

**Next Actions:**
- Review and approve design direction
- Create 3D model in Blender or Spline
- Export optimized GLB file
- Extract Docker logo texture
- Begin implementation per IMPLEMENTATION_GUIDE.md

---

**Status:** Ready for asset creation
**Design Confidence:** High (addresses all requirements from ILI-89)
