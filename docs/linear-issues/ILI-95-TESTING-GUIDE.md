# ILI-95 Testing Guide: Docker Image Crate

Quick guide for testing the newly implemented Docker image crate geometry.

---

## 🚀 Quick Start

### 1. Start Development Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

### 2. Test Routes

#### **Image Crate Demo (Recommended)**
**URL:** http://localhost:3000/image-crate-demo

**Features:**
- Interactive animation controls
- Real-time parameter adjustments
- Visual options (logo, glow, scale, color)
- Educational control descriptions

**What to Test:**
- Click "Enter" to see entry animation (arc trajectory with spin)
- Click "Float" to see hover animation
- Click "Exit" to see exit animation
- Toggle "Show Docker Logo" to see the simplified whale
- Toggle "Enable Glow" to see rim light effect
- Adjust scale slider (0.5x to 2x)
- Try custom colors with color picker
- Use mouse to rotate, scroll to zoom

#### **Container Demo (Integration View)**
**URL:** http://localhost:3000/container-demo

**Features:**
- Full container with integrated crate
- State-based controls (Ready, Building, Running, Error)
- Shows crate in context of container

**What to Test:**
- Crate should be floating inside the container
- Glow effect appears when state is "Running"
- Rotation and zoom controls work smoothly

---

## 📚 Storybook Stories

### Start Storybook

```bash
npm run storybook
```

### Navigate to ImageCrate Stories

1. Open **http://localhost:6006**
2. Sidebar: "3D" → "ImageCrate"

### Available Stories

1. **Idle** - Hidden state
2. **Entering** - Entry animation (1.5s arc)
3. **Settled** - Static in container
4. **Floating** - Subtle hover
5. **Exiting** - Exit animation (1.0s)
6. **WithGlow** - Glow effect showcase
7. **WithoutLogo** - Plain crate
8. **CustomColor** - Red crate example
9. **LargeScale** - 1.5x size
10. **Interactive** - Full controls with toggle buttons
11. **AnimationSequence** - Complete lifecycle with event log

---

## ✅ What to Look For

### Visual Appearance

**✅ Geometry:**
- Rectangular prism shape (slightly wider than tall)
- Rounded corners with small cylindrical edges
- Clean, professional appearance
- Docker blue color (#0db7ed)

**✅ Logo (front face):**
- Simplified white Docker whale
- Centered on front face
- Clear and recognizable
- Dark blue background panel

**✅ Materials:**
- Matte finish (not too shiny)
- Subtle edge highlighting
- Clean wireframe outlines
- Optional soft glow around edges

### Animation Quality

**✅ Entering (1.5s):**
- Smooth arc trajectory
- Starts from upper right, flies in
- Gentle 15° rotation during flight
- Slight bounce on landing
- No stuttering or jank

**✅ Floating:**
- Very subtle up/down motion
- 4-second cycle
- Smooth sine wave
- Looks alive but not distracting

**✅ Exiting (1.0s):**
- Reverse trajectory
- Increases rotation (45°)
- Smooth acceleration
- Disappears gracefully

### Performance

**✅ Frame Rate:**
- Should be smooth 60fps
- No lag when rotating camera
- No stuttering during animations
- Multiple animations don't cause slowdown

**✅ Responsiveness:**
- Controls respond immediately
- State changes are instant
- Animation callbacks fire correctly
- No memory leaks over time

---

## 🐛 Known Issues & Limitations

### Current Limitations (Not Bugs)

1. **Logo is simplified:** Uses geometric shapes instead of detailed texture
   - **Why:** Keeps component self-contained, no external assets
   - **Future:** Could load actual Docker whale PNG if needed

2. **Single gradient direction:** Color is solid, not gradient
   - **Why:** Simplifies material creation
   - **Future:** Could add texture with gradient

3. **No sound effects:** Silent animations
   - **By design:** Not required for ILI-95
   - **Future:** Could add subtle whoosh/clunk sounds

### What Should NOT Happen

❌ **If you see these, report as bugs:**
- Crate doesn't appear at all
- Animations stutter or freeze
- Logo doesn't render
- Colors look wrong (should be blue, not amber)
- Crate clips through container walls
- Controls don't respond
- Console errors appear
- Page crashes or freezes

---

## 📊 Test Checklist

Use this checklist to verify implementation:

### Geometry
- [ ] Crate has rectangular shape (not cube)
- [ ] Corners are slightly rounded
- [ ] Edges are visible and clean
- [ ] Proportions look correct (golden ratio)

### Logo
- [ ] Docker whale is visible on front
- [ ] Logo is white/light colored
- [ ] Background panel is darker blue
- [ ] Logo can be toggled off

### Animations
- [ ] Entry animation is smooth
- [ ] Crate rotates during entry
- [ ] Landing has slight bounce
- [ ] Floating animation is subtle
- [ ] Exit animation works
- [ ] State transitions are clean

### Materials
- [ ] Color is Docker blue (#0db7ed)
- [ ] Finish is matte (not shiny)
- [ ] Glow can be enabled
- [ ] Custom colors work

### Controls (Demo Page)
- [ ] Animation buttons work
- [ ] Logo toggle works
- [ ] Glow toggle works
- [ ] Scale slider works
- [ ] Color picker works
- [ ] Reset button works

### Performance
- [ ] Animations run at 60fps
- [ ] No lag when rotating
- [ ] No console errors
- [ ] Build succeeds: `npm run build`

---

## 🎥 Expected Behavior Videos

### Entry Animation
1. Crate fades in from upper right
2. Follows curved arc path
3. Rotates ~15° during flight
4. Settles with small bounce
5. Total time: 1.5 seconds

### Floating Animation
1. Very gentle up/down motion
2. ±0.05 units amplitude
3. 4-second period
4. Continuous loop

### Exit Animation
1. Lifts off from container
2. Follows reverse arc
3. Rotates ~45° during exit
4. Disappears
5. Total time: 1.0 second

---

## 📸 Screenshots to Take

For documentation/PR:

1. **Default view** - Crate with logo in settled state
2. **Entry animation** - Mid-flight screenshot
3. **Glow effect** - Crate with glow enabled
4. **Custom color** - Crate in different color (e.g., red)
5. **In container** - Full container demo view
6. **Interactive demo** - Control panel interface

---

## 🔧 Development Tools

### Browser DevTools

**Performance Panel:**
- Check frame rate (should be ~60fps)
- Look for long tasks (should be <16ms)
- Monitor memory usage (should be stable)

**Console:**
- Should see "Crate animation complete" logs
- No errors or warnings
- No React warnings

**Three.js Inspector:**
If you have Three.js DevTools extension:
- Verify geometry polygon count (<2000 triangles)
- Check material properties
- Inspect scene hierarchy

---

## 📞 Support

### If Something Doesn't Work

1. **Check Console:** Look for error messages
2. **Check Build:** Run `npm run build` to verify no TypeScript errors
3. **Clear Cache:** Clear browser cache and rebuild
4. **Check Dependencies:** Run `npm install` again
5. **Check Docs:** Review implementation summary

### Files to Check

- Implementation: `src/components/three/ImageCrate/`
- Demo Page: `src/app/image-crate-demo/page.tsx`
- Integration: `src/components/three/Container3D.tsx`
- Materials: `src/lib/container-materials.ts`
- Colors: `src/lib/container-colors.ts`

---

## 🎯 Success Criteria

The implementation is successful if:

✅ All animations run smoothly at 60fps
✅ Visual appearance matches design spec (Docker blue, rounded corners, logo)
✅ All interactive controls work as expected
✅ Component integrates with existing container
✅ Production build succeeds
✅ No console errors or warnings
✅ Demo pages load and function correctly
✅ Storybook stories all work

---

## 🚢 Ready for Production?

Before considering this production-ready, verify:

- [ ] All tests pass in this guide
- [ ] Performance is acceptable on target devices
- [ ] Visual design approved by stakeholders
- [ ] Integration with full workflow tested
- [ ] Accessibility requirements met (if applicable)
- [ ] Browser compatibility verified
- [ ] Mobile/tablet testing complete (if applicable)

---

**Happy Testing!** 🎉

If everything works as described above, ILI-95 is complete and ready for deployment.
