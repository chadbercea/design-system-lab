# ILI-89 Implementation Checklist

**Issue:** ILI-89 - [Designer] Design the image crate
**Status:** Phase 1 Complete (Design) → Phase 2 Ready (Asset Creation)

---

## Phase 1: Design Specification ✅ COMPLETE

- [x] Research Docker image/container concepts
- [x] Create 5 design explorations
- [x] Select recommended design (Exploration D)
- [x] Define physical specifications (dimensions, proportions)
- [x] Specify materials and textures
- [x] Design animation sequences
- [x] Create technical implementation plan
- [x] Document visual reference with ASCII sketches
- [x] Define export specifications
- [x] Update project README with documentation links

**Deliverables Created:**
- ✅ `docs/IMAGE_CRATE_DESIGN_SPEC.md`
- ✅ `docs/IMAGE_CRATE_IMPLEMENTATION_GUIDE.md`
- ✅ `docs/IMAGE_CRATE_VISUAL_REFERENCE.md`
- ✅ `docs/ILI-89-SUMMARY.md`
- ✅ `docs/ILI-89-CHECKLIST.md` (this file)

---

## Phase 2: Asset Creation ⏳ READY TO START

### Design Review (1 hour)
- [ ] Stakeholder reviews design specifications
- [ ] Approve Exploration D or request changes
- [ ] Clarify open questions:
  - [ ] Logo treatment preference (embossed vs decal)?
  - [ ] Animation timing approval (1.5s entry)?
  - [ ] Glow effect desired?
  - [ ] Sound design needed?
- [ ] Assign 3D artist/designer

### 3D Modeling (3-4 hours)
- [ ] Set up Blender project
- [ ] Model base crate geometry (rounded rectangular prism)
  - [ ] Dimensions: 1.3 x 0.8 x 0.8 units (scale in-engine)
  - [ ] Corner radius: 0.04 units
  - [ ] Keep polygon count <2,000 triangles
- [ ] Add panel line details (0.005 unit recess)
- [ ] Model corner caps (metallic accents)
- [ ] Optional: Add handle recesses on sides
- [ ] Apply subdivision surface modifier (level 1-2)
- [ ] Triangulate mesh for export

### Materials & Textures (2-3 hours)
- [ ] Download Docker official logo from [Docker Media Kit](https://www.docker.com/company/newsroom/media-resources/)
- [ ] Create base color texture (1024x1024)
  - [ ] Docker blue gradient (#0db7ed → #4dc9f0)
  - [ ] Vertical gradient (bottom to top)
  - [ ] Export as PNG
- [ ] Create normal map (1024x1024)
  - [ ] Panel line detail
  - [ ] Surface imperfections
  - [ ] Export as PNG (Linear color space)
- [ ] Create roughness map (512x512)
  - [ ] Overall: 0.35-0.40 value
  - [ ] Corner caps: 0.15 (more metallic)
  - [ ] Export as PNG or JPEG
- [ ] Prepare Docker whale logo (512x512)
  - [ ] Extract whale + text
  - [ ] Ensure alpha transparency
  - [ ] Export as PNG with alpha

### Material Setup in Blender
- [ ] Create Principled BSDF material
- [ ] Set Base Color to gradient texture
- [ ] Set Roughness map
- [ ] Set Metallic: 0.1 (base), 0.85 (corner caps)
- [ ] Connect Normal map to Normal input
- [ ] Set up logo as separate material (for front face)

### Export & Optimization (30-60 min)
- [ ] Export as GLTF 2.0 Binary (.glb)
  - [ ] Enable Draco compression (level 10)
  - [ ] Include: Meshes, Materials, Textures
  - [ ] Apply all transforms
  - [ ] Triangulate faces
- [ ] Test exported GLB in gltf.report
  - [ ] Verify file size <500KB
  - [ ] Check triangle count <2,000
  - [ ] Validate texture dimensions
- [ ] Place assets in project:
  - [ ] `public/models/image-crate.glb`
  - [ ] `public/textures/docker-whale-logo.png`
  - [ ] `public/textures/crate-base-color.png` (if separate)
  - [ ] `public/textures/crate-normal.png`
  - [ ] `public/textures/crate-roughness.png`

### Concept Renders (30-60 min)
- [ ] Create high-quality renders for review:
  - [ ] Front view with logo visible
  - [ ] Isometric 3D view
  - [ ] In-context (inside container mockup)
  - [ ] All angles turnaround
- [ ] Export renders as PNG (1920x1080)
- [ ] Place in `docs/assets/` for documentation

---

## Phase 3: Component Development ⏳ PENDING ASSETS

### Environment Setup (15 min)
- [ ] Install Three.js dependencies:
  ```bash
  npm install three @react-three/fiber @react-three/drei
  npm install --save-dev @types/three
  ```
- [ ] Create directory structure:
  ```bash
  mkdir -p src/components/3d/ImageCrate
  mkdir -p public/models
  mkdir -p public/textures
  ```

### Core Components (3-4 hours)
- [ ] Create `src/components/3d/ImageCrate/types.ts`
  - [ ] Define AnimationState type
  - [ ] Define ImageCrateProps interface
  - [ ] Define CratePosition interface
- [ ] Create `src/components/3d/ImageCrate/useImageCrateAnimation.ts`
  - [ ] Implement easing functions
  - [ ] Implement entering animation
  - [ ] Implement settled state
  - [ ] Implement floating animation
  - [ ] Implement exiting animation
  - [ ] Add animation completion callbacks
- [ ] Create `src/components/3d/ImageCrate/ImageCrateModel.tsx`
  - [ ] Load GLB model with useGLTF
  - [ ] Load logo texture with useTexture
  - [ ] Create materials
  - [ ] Set up mesh geometry
  - [ ] Apply animation hook
  - [ ] Add glow effect (optional)
- [ ] Create `src/components/3d/ImageCrate/ImageCrate.tsx`
  - [ ] Set up Canvas component
  - [ ] Configure camera
  - [ ] Add lighting (ambient, directional, point)
  - [ ] Add Environment (warehouse preset)
  - [ ] Add ContactShadows
  - [ ] Add OrbitControls for demo
  - [ ] Integrate ImageCrateModel
- [ ] Create `src/components/3d/ImageCrate/index.ts`
  - [ ] Export main components
  - [ ] Export types

### Storybook Integration (1-2 hours)
- [ ] Create `src/components/3d/ImageCrate/ImageCrate.stories.tsx`
  - [ ] Add "Idle" story
  - [ ] Add "Entering" story
  - [ ] Add "Settled" story
  - [ ] Add "Floating" story
  - [ ] Add "WithGlow" story
  - [ ] Add "CustomColor" story
  - [ ] Add "Interactive" story with controls
- [ ] Test all stories in Storybook
- [ ] Verify animations work correctly
- [ ] Check performance in Storybook

### MUI Integration (1 hour)
- [ ] Create `src/mui-sandbox/components/ImageCrateShowcase.tsx`
  - [ ] Wrap ImageCrate in MUI Card
  - [ ] Add Typography for title/description
  - [ ] Style with MUI theme
- [ ] Create Storybook story for MUI wrapper
- [ ] Test integration with existing MUI components

### Testing (1-2 hours)
- [ ] Write unit tests (`ImageCrate.test.tsx`)
  - [ ] Test component renders
  - [ ] Test animation state changes
  - [ ] Test onAnimationComplete callbacks
  - [ ] Test prop variations
- [ ] Manual testing:
  - [ ] Test in Chrome, Firefox, Safari
  - [ ] Test on mobile devices
  - [ ] Test with DevTools (check FPS)
  - [ ] Test accessibility (keyboard, screen reader, reduced motion)
- [ ] Performance testing:
  - [ ] Measure initial load time
  - [ ] Monitor frame rate during animation
  - [ ] Check memory usage
  - [ ] Optimize if needed

---

## Phase 4: Integration & Polish ⏳ PENDING DEVELOPMENT

### Container Visualization Integration (2 hours)
- [ ] Identify container visualization component
- [ ] Add ImageCrate to container interior
- [ ] Connect to Docker image loading events
- [ ] Handle multiple images (if applicable)
- [ ] Test full workflow (image load → animation → settled)

### Responsive Design (1 hour)
- [ ] Test on mobile (320px - 480px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Adjust camera/lighting for different viewports
- [ ] Ensure touch controls work on mobile

### Accessibility (1 hour)
- [ ] Implement reduced-motion support:
  ```css
  @media (prefers-reduced-motion: reduce) {
    /* Disable arc trajectory, use simple fade */
  }
  ```
- [ ] Add keyboard navigation support
- [ ] Add ARIA labels for screen readers
- [ ] Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] Ensure color contrast meets WCAG AA

### Performance Optimization (1 hour)
- [ ] Lazy load ImageCrate component with `next/dynamic`
- [ ] Preload GLB model with `useGLTF.preload()`
- [ ] Memoize materials and geometry
- [ ] Implement LOD (Level of Detail) if needed
- [ ] Test with Chrome DevTools Performance tab
- [ ] Target: <50ms load time, 60fps animation

### Documentation Updates (30 min)
- [ ] Update README with usage examples
- [ ] Add JSDoc comments to components
- [ ] Document props in Storybook
- [ ] Create animated GIF demo
- [ ] Update changelog

---

## Phase 5: Review & Launch ⏳ PENDING INTEGRATION

### Internal Review (1 hour)
- [ ] Code review (peer review)
- [ ] Design review (stakeholder approval)
- [ ] UX review (user testing)
- [ ] Accessibility audit
- [ ] Performance review

### Bug Fixes & Refinements (2-3 hours)
- [ ] Address code review feedback
- [ ] Fix any bugs found in testing
- [ ] Refine animation timing based on feedback
- [ ] Polish visual details
- [ ] Update documentation as needed

### Production Deployment (30 min)
- [ ] Merge to main branch
- [ ] Create pull request with summary
- [ ] Tag release (e.g., v1.1.0-image-crate)
- [ ] Deploy to production
- [ ] Monitor Sentry for errors
- [ ] Verify in production environment

### Post-Launch (1 hour)
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Document lessons learned
- [ ] Plan future enhancements:
  - [ ] Layer visualization (crate splits apart)
  - [ ] Multi-image stacking
  - [ ] Sound effects
  - [ ] Version labels
  - [ ] Image size indicators

---

## Time Estimates Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Design | 2-3 hours | ✅ COMPLETE |
| Phase 2: Assets | 4-6 hours | ⏳ READY TO START |
| Phase 3: Development | 6-8 hours | ⏳ PENDING ASSETS |
| Phase 4: Integration | 2-3 hours | ⏳ PENDING DEV |
| Phase 5: Review & Launch | 3-4 hours | ⏳ PENDING INTEGRATION |
| **TOTAL** | **17-24 hours** | **~15% COMPLETE** |

---

## Key Resources

### Documentation
- [IMAGE_CRATE_DESIGN_SPEC.md](./IMAGE_CRATE_DESIGN_SPEC.md) - Design explorations & specs
- [IMAGE_CRATE_IMPLEMENTATION_GUIDE.md](./IMAGE_CRATE_IMPLEMENTATION_GUIDE.md) - Code implementation
- [IMAGE_CRATE_VISUAL_REFERENCE.md](./IMAGE_CRATE_VISUAL_REFERENCE.md) - Visual guide & assets
- [ILI-89-SUMMARY.md](./ILI-89-SUMMARY.md) - Project summary

### External Resources
- [Docker Media Kit](https://www.docker.com/company/newsroom/media-resources/)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Blender Download](https://www.blender.org/)
- [gltf-pipeline](https://github.com/AnalyticalGraphicsInc/gltf-pipeline)
- [gltf.report](https://gltf.report/)

---

## Quick Commands

### Development
```bash
# Install dependencies
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three

# Start Storybook
npm run storybook

# Start dev server
npm run dev

# Run tests
npm test
```

### Asset Optimization
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Optimize GLB
gltf-pipeline -i input.glb -o output.glb -d

# Analyze GLB
# Visit: https://gltf.report/
```

---

## Notes

- This checklist is a living document - update as needed
- Mark items complete with `[x]` as you go
- Add new items if discovered during implementation
- Track blockers in separate issue if needed
- Celebrate wins along the way! 🎉

---

**Last Updated:** 2025-11-01
**Next Review:** After Phase 2 (Asset Creation)
**Owner:** Assigned 3D Artist/Designer → Developer → Team
