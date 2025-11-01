import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FullPage } from './FullPage';
import { useState, useEffect } from 'react';

/**
 * Full Page Theme Customizer
 *
 * Use the Controls panel to customize theme tokens visually.
 * Click "Export Theme" in the Actions panel to get JSON output.
 */
const meta = {
  title: 'MUI Sandbox/Full Page Theme Customizer',
  component: FullPage,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'], // Disabled: causes importers error
  argTypes: {
    // Palette - Primary
    primaryMain: {
      control: 'color',
      description: 'Primary color',
      table: { category: 'Palette' },
    },
    primaryLight: {
      control: 'color',
      description: 'Primary light variant',
      table: { category: 'Palette' },
    },
    primaryDark: {
      control: 'color',
      description: 'Primary dark variant',
      table: { category: 'Palette' },
    },
    // Palette - Secondary
    secondaryMain: {
      control: 'color',
      description: 'Secondary color',
      table: { category: 'Palette' },
    },
    secondaryLight: {
      control: 'color',
      description: 'Secondary light variant',
      table: { category: 'Palette' },
    },
    secondaryDark: {
      control: 'color',
      description: 'Secondary dark variant',
      table: { category: 'Palette' },
    },
    // Palette - Error
    errorMain: {
      control: 'color',
      description: 'Error color',
      table: { category: 'Palette' },
    },
    // Palette - Warning
    warningMain: {
      control: 'color',
      description: 'Warning color',
      table: { category: 'Palette' },
    },
    // Palette - Info
    infoMain: {
      control: 'color',
      description: 'Info color',
      table: { category: 'Palette' },
    },
    // Palette - Success
    successMain: {
      control: 'color',
      description: 'Success color',
      table: { category: 'Palette' },
    },
    // Spacing
    spacing: {
      control: { type: 'number', min: 2, max: 16, step: 1 },
      description: 'Base spacing unit (px)',
      table: { category: 'Spacing' },
    },
    // Shape
    borderRadius: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Border radius (px)',
      table: { category: 'Shape' },
    },
    // Typography
    fontFamily: {
      control: 'text',
      description: 'Base font family',
      table: { category: 'Typography' },
    },
    fontSize: {
      control: { type: 'number', min: 12, max: 20, step: 1 },
      description: 'Base font size (px)',
      table: { category: 'Typography' },
    },
    h1FontSize: {
      control: { type: 'number', min: 60, max: 120, step: 2 },
      description: 'H1 font size (px)',
      table: { category: 'Typography' },
    },
    h2FontSize: {
      control: { type: 'number', min: 40, max: 80, step: 2 },
      description: 'H2 font size (px)',
      table: { category: 'Typography' },
    },
    h3FontSize: {
      control: { type: 'number', min: 32, max: 64, step: 2 },
      description: 'H3 font size (px)',
      table: { category: 'Typography' },
    },
    h4FontSize: {
      control: { type: 'number', min: 24, max: 48, step: 2 },
      description: 'H4 font size (px)',
      table: { category: 'Typography' },
    },
    h5FontSize: {
      control: { type: 'number', min: 16, max: 32, step: 1 },
      description: 'H5 font size (px)',
      table: { category: 'Typography' },
    },
    h6FontSize: {
      control: { type: 'number', min: 14, max: 28, step: 1 },
      description: 'H6 font size (px)',
      table: { category: 'Typography' },
    },
    fontWeightLight: {
      control: { type: 'number', min: 100, max: 900, step: 100 },
      description: 'Light font weight',
      table: { category: 'Typography' },
    },
    fontWeightRegular: {
      control: { type: 'number', min: 100, max: 900, step: 100 },
      description: 'Regular font weight',
      table: { category: 'Typography' },
    },
    fontWeightMedium: {
      control: { type: 'number', min: 100, max: 900, step: 100 },
      description: 'Medium font weight',
      table: { category: 'Typography' },
    },
    fontWeightBold: {
      control: { type: 'number', min: 100, max: 900, step: 100 },
      description: 'Bold font weight',
      table: { category: 'Typography' },
    },
  },
} satisfies Meta<typeof FullPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Get MUI default theme values for comparison
const defaultTheme = createTheme();

interface ThemeCustomizerProps {
  primaryMain?: string;
  primaryLight?: string;
  primaryDark?: string;
  secondaryMain?: string;
  secondaryLight?: string;
  secondaryDark?: string;
  errorMain?: string;
  warningMain?: string;
  infoMain?: string;
  successMain?: string;
  spacing?: number;
  borderRadius?: number;
  fontFamily?: string;
  fontSize?: number;
  h1FontSize?: number;
  h2FontSize?: number;
  h3FontSize?: number;
  h4FontSize?: number;
  h5FontSize?: number;
  h6FontSize?: number;
  fontWeightLight?: number;
  fontWeightRegular?: number;
  fontWeightMedium?: number;
  fontWeightBold?: number;
}

const ThemeCustomizer = (args: ThemeCustomizerProps) => {
  const [currentTheme, setCurrentTheme] = useState(() => createTheme());

  useEffect(() => {
    const customTheme = createTheme({
      spacing: args.spacing ?? defaultTheme.spacing(1),
      shape: {
        borderRadius: args.borderRadius ?? defaultTheme.shape.borderRadius,
      },
      palette: {
        primary: {
          main: args.primaryMain ?? defaultTheme.palette.primary.main,
          light: args.primaryLight ?? defaultTheme.palette.primary.light,
          dark: args.primaryDark ?? defaultTheme.palette.primary.dark,
        },
        secondary: {
          main: args.secondaryMain ?? defaultTheme.palette.secondary.main,
          light: args.secondaryLight ?? defaultTheme.palette.secondary.light,
          dark: args.secondaryDark ?? defaultTheme.palette.secondary.dark,
        },
        error: {
          main: args.errorMain ?? defaultTheme.palette.error.main,
        },
        warning: {
          main: args.warningMain ?? defaultTheme.palette.warning.main,
        },
        info: {
          main: args.infoMain ?? defaultTheme.palette.info.main,
        },
        success: {
          main: args.successMain ?? defaultTheme.palette.success.main,
        },
      },
      typography: {
        fontFamily: args.fontFamily ?? defaultTheme.typography.fontFamily,
        fontSize: args.fontSize ?? defaultTheme.typography.fontSize,
        h1: {
          fontSize: args.h1FontSize ? `${args.h1FontSize}px` : undefined,
        },
        h2: {
          fontSize: args.h2FontSize ? `${args.h2FontSize}px` : undefined,
        },
        h3: {
          fontSize: args.h3FontSize ? `${args.h3FontSize}px` : undefined,
        },
        h4: {
          fontSize: args.h4FontSize ? `${args.h4FontSize}px` : undefined,
        },
        h5: {
          fontSize: args.h5FontSize ? `${args.h5FontSize}px` : undefined,
        },
        h6: {
          fontSize: args.h6FontSize ? `${args.h6FontSize}px` : undefined,
        },
        fontWeightLight: args.fontWeightLight ?? defaultTheme.typography.fontWeightLight,
        fontWeightRegular: args.fontWeightRegular ?? defaultTheme.typography.fontWeightRegular,
        fontWeightMedium: args.fontWeightMedium ?? defaultTheme.typography.fontWeightMedium,
        fontWeightBold: args.fontWeightBold ?? defaultTheme.typography.fontWeightBold,
      },
    });

    setCurrentTheme(customTheme);

    // Store theme for export
    (window as any).__currentMuiTheme = customTheme;
    (window as any).__currentMuiThemeArgs = args;
  }, [args]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <FullPage />
    </ThemeProvider>
  );
};

/**
 * Default story with stock MUI theme
 */
export const Default: Story = {
  render: (args) => <ThemeCustomizer {...args} />,
  args: {
    // Stock MUI defaults
    primaryMain: defaultTheme.palette.primary.main,
    primaryLight: defaultTheme.palette.primary.light,
    primaryDark: defaultTheme.palette.primary.dark,
    secondaryMain: defaultTheme.palette.secondary.main,
    secondaryLight: defaultTheme.palette.secondary.light,
    secondaryDark: defaultTheme.palette.secondary.dark,
    errorMain: defaultTheme.palette.error.main,
    warningMain: defaultTheme.palette.warning.main,
    infoMain: defaultTheme.palette.info.main,
    successMain: defaultTheme.palette.success.main,
    spacing: 8,
    borderRadius: 4,
    fontFamily: defaultTheme.typography.fontFamily,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
};

/**
 * Example: Modern theme preset
 */
export const ModernPreset: Story = {
  render: (args) => <ThemeCustomizer {...args} />,
  args: {
    primaryMain: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondaryMain: '#ec4899',
    secondaryLight: '#f472b6',
    secondaryDark: '#db2777',
    errorMain: '#ef4444',
    warningMain: '#f59e0b',
    infoMain: '#3b82f6',
    successMain: '#10b981',
    spacing: 8,
    borderRadius: 12,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
};

/**
 * Example: Minimal theme preset
 */
export const MinimalPreset: Story = {
  render: (args) => <ThemeCustomizer {...args} />,
  args: {
    primaryMain: '#000000',
    primaryLight: '#333333',
    primaryDark: '#000000',
    secondaryMain: '#666666',
    secondaryLight: '#999999',
    secondaryDark: '#333333',
    errorMain: '#d32f2f',
    warningMain: '#ed6c02',
    infoMain: '#0288d1',
    successMain: '#2e7d32',
    spacing: 8,
    borderRadius: 0,
    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
};
