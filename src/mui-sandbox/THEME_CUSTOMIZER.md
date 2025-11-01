# MUI Theme Customizer Guide

## Overview

The MUI Theme Customizer is a visual tool for experimenting with Material-UI theme tokens in Storybook. It allows you to:

- Build full page layouts with stock MUI components
- Adjust theme values (colors, spacing, typography, borders) using visual controls
- See changes live in real-time
- Export only the changed values as JSON

**Key Principle:** Client-side only, no persistence. Pure experimentation sandbox.

## Getting Started

### 1. Start Storybook

```bash
npm run storybook
```

### 2. Navigate to the Theme Customizer

In the Storybook sidebar, go to:
**MUI Sandbox → Full Page Theme Customizer → Default**

## Using Visual Controls

### Controls Panel

The **Controls** panel (bottom of Storybook) provides visual inputs for all theme tokens:

#### Palette (Colors)
- **Primary**: Main, Light, Dark variants
- **Secondary**: Main, Light, Dark variants
- **Error, Warning, Info, Success**: Main colors
- Use color pickers to adjust values

#### Spacing
- **spacing**: Base spacing unit (2-16px)
- Controls margin/padding throughout the UI

#### Shape
- **borderRadius**: Global border radius (0-24px)
- Affects buttons, cards, inputs, etc.

#### Typography
- **fontFamily**: Base font stack
- **fontSize**: Base font size (12-20px)
- **h1-h6 sizes**: Heading sizes
- **fontWeightLight/Regular/Medium/Bold**: Font weights (100-900)

### Live Preview

All changes update **immediately** in the preview pane above. No page reload needed.

## Exporting Your Theme

### 1. Customize Values

Use the Controls panel to adjust theme tokens until you're happy with the result.

### 2. Export Theme Delta

Click the **"Export Theme"** tab in the addons panel (bottom), then click **"Export Theme"** button.

### 3. Get JSON Output

The addon generates JSON containing **only changed values** (delta from stock MUI):

```json
{
  "delta": {
    "spacing": 4,
    "shape": {
      "borderRadius": 12
    },
    "palette": {
      "primary": {
        "main": "#6366f1",
        "light": "#818cf8",
        "dark": "#4f46e5"
      }
    },
    "typography": {
      "fontFamily": "Inter, sans-serif",
      "fontSize": 16
    }
  },
  "timestamp": "2025-10-31T22:00:00Z",
  "baseline": "MUI v7.3.4 stock theme"
}
```

### 4. Copy to Clipboard

Click **"Copy to Clipboard"** to copy the JSON for use elsewhere.

## Using Exported JSON

### Option 1: Apply to MUI Theme

Update `src/mui-sandbox/theme/theme.ts`:

```typescript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  spacing: 4,
  shape: {
    borderRadius: 12
  },
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5'
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 16
  }
});
```

### Option 2: Convert to Figma Variables

Use the JSON as a reference to create matching Figma variables:

1. Open Figma → Local variables
2. Create variables for each token:
   - `color/primary/main` → `#6366f1`
   - `spacing/base` → `4px`
   - `shape/border-radius` → `12px`
   - etc.

### Option 3: Store for Later

Save the JSON to a file for version control or sharing:

```bash
# Save export
cat > theme-export-2025-10-31.json
# Paste JSON
# Ctrl+D to save
```

## Example Presets

The Theme Customizer includes example presets:

### Modern Preset
- Indigo/pink color scheme
- 12px border radius
- Inter font family

### Minimal Preset
- Black/gray color scheme
- 0px border radius (sharp corners)
- Helvetica font family

Switch between presets in the Storybook sidebar to see different styles.

## Advanced Usage

### Hot Module Reload

If you prefer editing `theme.ts` directly:

1. Edit `src/mui-sandbox/theme/theme.ts`
2. Save the file
3. Storybook auto-reloads with new theme

This works alongside the visual controls.

### Custom Components

To test theme changes on your own components:

1. Add component to `src/mui-sandbox/components/`
2. Create `.stories.tsx` file
3. Wrap story with ThemeProvider (see FullPage.stories.tsx)

## Limitations

### What the Visual Controls Support
- Palette colors (primary, secondary, error, warning, info, success)
- Spacing base unit
- Border radius
- Typography (font family, sizes, weights)

### What Requires Manual Editing
- Custom shadows
- Transitions/animations
- Breakpoints
- Component-specific style overrides
- Advanced palette (background, text, grey, etc.)
- Z-index layers

For these, edit `theme.ts` directly.

## Troubleshooting

### Controls Not Working

Make sure you're viewing the **"Full Page Theme Customizer"** story, not individual component stories.

### Export Shows "No theme found"

Navigate to the Full Page Theme Customizer story first, then export.

### Colors Not Updating

Try adjusting all three variants (Main, Light, Dark) for consistent results.

### Preview Looks Broken

Refresh Storybook (Cmd+R / Ctrl+R) to reset the theme.

## Best Practices

1. **Start with a preset** - Use Modern or Minimal as a starting point
2. **Export frequently** - Save your progress as you go
3. **Test on the full page** - Don't just tweak in isolation
4. **Document your changes** - Add notes about design decisions
5. **Use meaningful values** - Round numbers (8, 12, 16) work better than arbitrary ones

## Next Steps

After exporting your theme:

1. Apply to your MUI app
2. Create matching Figma variables
3. Test across different components
4. Refine and iterate

## Related Documentation

- [MUI Theming Documentation](https://mui.com/material-ui/customization/theming/)
- [MUI Default Theme Values](https://mui.com/material-ui/customization/default-theme/)
- [Figma Variables](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
