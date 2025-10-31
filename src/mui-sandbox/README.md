# MUI Sandbox

**Purpose:** Experimentation zone for exploring MUI's theme system and design token architecture.

## Philosophy

This sandbox is separate from the main Next.js app. The goal is to learn how much visual customization can be achieved through MUI's theme layer alone, without component-level styling overrides.

**Key Principle:** Control everything through `src/mui-sandbox/theme/theme.ts`

## What's Here

```
src/mui-sandbox/
├── theme/
│   └── theme.ts          # Your theme playground - customize here!
├── components/
│   ├── Button.tsx        # Example MUI Button variants
│   ├── TextField.tsx     # Example MUI TextField variants
│   ├── Card.tsx          # Example MUI Card variants
│   └── Typography.tsx    # Typography scale showcase
└── README.md            # You are here
```

## Getting Started

### 1. Start Storybook

```bash
npm run storybook
```

This launches Storybook at http://localhost:6006

### 2. Explore Components

Browse the **MUI Sandbox** section in Storybook sidebar:
- Button - All button variants and states
- TextField - Input field variants
- Card - Card component variants
- Typography - Complete typography scale

### 3. Customize the Theme

Open `src/mui-sandbox/theme/theme.ts` and start customizing:

```typescript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
  typography: {
    fontFamily: '"Your Font", sans-serif',
  },
  // ... explore more options!
});
```

**Hot-reload is enabled** - changes to `theme.ts` automatically update Storybook.

## Theme Customization Resources

MUI's theme object is powerful. Here's what you can customize:

### Palette (Colors)
- `palette.primary` - Primary brand color
- `palette.secondary` - Secondary color
- `palette.error` - Error states
- `palette.warning` - Warning states
- `palette.info` - Info states
- `palette.success` - Success states
- `palette.mode` - 'light' or 'dark'

### Typography
- `typography.fontFamily` - Base font
- `typography.h1` through `typography.h6` - Heading styles
- `typography.body1`, `typography.body2` - Body text
- `typography.button` - Button text
- `typography.caption` - Caption text

### Spacing & Sizing
- `spacing` - Base spacing unit (default: 8px)
- `shape.borderRadius` - Border radius
- `breakpoints` - Responsive breakpoints

### Component Overrides
- `components.MuiButton.styleOverrides` - Button-specific overrides
- `components.MuiTextField.styleOverrides` - TextField overrides
- etc.

**Documentation:** https://mui.com/material-ui/customization/theming/

## Goals

1. **Learn MUI's theme architecture** - How deep does it go?
2. **Match Tailwind/global.css styling** - Can we make MUI look like our main app through theme alone?
3. **Explore design token patterns** - What token structures work best?
4. **Document limitations** - What can't be done through theme?

## Current State

- ✅ Stock MUI theme (baseline)
- ✅ Example components in Storybook
- ✅ Hot-reload working
- 🎨 Ready for your customizations!

## Next Steps

1. Start with colors - customize the palette
2. Update typography to match your brand
3. Adjust spacing/sizing tokens
4. Try theme overrides for specific components
5. Document your learnings!

## Notes

- This sandbox is **completely isolated** from the main Next.js app
- MUI and shadcn/Radix UI never need to interact
- Experiment freely - you can't break anything!
- Eventually this will be Dockerized for consistent dev environments

---

**Happy theming!** 🎨
