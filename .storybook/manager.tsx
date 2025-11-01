import React, { useEffect, useState } from 'react';
import { addons, types } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';
import { styled } from '@storybook/theming';

const ADDON_ID = 'theme-export';
const PANEL_ID = `${ADDON_ID}/panel`;

// Styled components
const PanelContent = styled.div({
  padding: '20px',
  fontFamily: 'monospace',
});

const ExportButton = styled.button({
  backgroundColor: '#1EA7FD',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  fontSize: '14px',
  cursor: 'pointer',
  marginBottom: '16px',
  '&:hover': {
    backgroundColor: '#0d8adb',
  },
});

const JsonOutput = styled.pre({
  backgroundColor: '#f5f5f5',
  padding: '16px',
  borderRadius: '4px',
  overflow: 'auto',
  maxHeight: '500px',
  fontSize: '12px',
  border: '1px solid #ddd',
});

const CopyButton = styled.button({
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 16px',
  fontSize: '12px',
  cursor: 'pointer',
  marginTop: '8px',
  '&:hover': {
    backgroundColor: '#218838',
  },
});

const Message = styled.div({
  padding: '12px',
  borderRadius: '4px',
  marginBottom: '16px',
  backgroundColor: '#d1ecf1',
  color: '#0c5460',
  border: '1px solid #bee5eb',
});

// Get MUI default theme for comparison
const getMuiDefaults = () => {
  // These are the stock MUI v5 defaults
  return {
    spacing: 8,
    shape: {
      borderRadius: 4,
    },
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      error: {
        main: '#d32f2f',
      },
      warning: {
        main: '#ed6c02',
      },
      info: {
        main: '#0288d1',
      },
      success: {
        main: '#2e7d32',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
  };
};

const ThemeExportPanel = () => {
  const [exportedTheme, setExportedTheme] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExport = () => {
    const iframe = document.querySelector('#storybook-preview-iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) {
      setExportedTheme(JSON.stringify({ error: 'Cannot access preview iframe' }, null, 2));
      return;
    }

    const theme = (iframe.contentWindow as any).__currentMuiTheme;
    const args = (iframe.contentWindow as any).__currentMuiThemeArgs;

    if (!theme || !args) {
      setExportedTheme(JSON.stringify({
        error: 'No theme found. Make sure you are viewing the Full Page Theme Customizer story.'
      }, null, 2));
      return;
    }

    const defaults = getMuiDefaults();
    const delta: any = {};

    // Compare and extract only changed values
    if (args.spacing !== defaults.spacing) {
      delta.spacing = args.spacing;
    }

    if (args.borderRadius !== defaults.shape.borderRadius) {
      delta.shape = { borderRadius: args.borderRadius };
    }

    // Palette
    const palette: any = {};
    if (args.primaryMain !== defaults.palette.primary.main ||
        args.primaryLight !== defaults.palette.primary.light ||
        args.primaryDark !== defaults.palette.primary.dark) {
      palette.primary = {
        main: args.primaryMain,
        light: args.primaryLight,
        dark: args.primaryDark,
      };
    }

    if (args.secondaryMain !== defaults.palette.secondary.main ||
        args.secondaryLight !== defaults.palette.secondary.light ||
        args.secondaryDark !== defaults.palette.secondary.dark) {
      palette.secondary = {
        main: args.secondaryMain,
        light: args.secondaryLight,
        dark: args.secondaryDark,
      };
    }

    if (args.errorMain !== defaults.palette.error.main) {
      palette.error = { main: args.errorMain };
    }

    if (args.warningMain !== defaults.palette.warning.main) {
      palette.warning = { main: args.warningMain };
    }

    if (args.infoMain !== defaults.palette.info.main) {
      palette.info = { main: args.infoMain };
    }

    if (args.successMain !== defaults.palette.success.main) {
      palette.success = { main: args.successMain };
    }

    if (Object.keys(palette).length > 0) {
      delta.palette = palette;
    }

    // Typography
    const typography: any = {};
    if (args.fontFamily !== defaults.typography.fontFamily) {
      typography.fontFamily = args.fontFamily;
    }
    if (args.fontSize !== defaults.typography.fontSize) {
      typography.fontSize = args.fontSize;
    }
    if (args.h1FontSize) {
      typography.h1 = { fontSize: `${args.h1FontSize}px` };
    }
    if (args.h2FontSize) {
      typography.h2 = { fontSize: `${args.h2FontSize}px` };
    }
    if (args.h3FontSize) {
      typography.h3 = { fontSize: `${args.h3FontSize}px` };
    }
    if (args.h4FontSize) {
      typography.h4 = { fontSize: `${args.h4FontSize}px` };
    }
    if (args.h5FontSize) {
      typography.h5 = { fontSize: `${args.h5FontSize}px` };
    }
    if (args.h6FontSize) {
      typography.h6 = { fontSize: `${args.h6FontSize}px` };
    }
    if (args.fontWeightLight !== defaults.typography.fontWeightLight) {
      typography.fontWeightLight = args.fontWeightLight;
    }
    if (args.fontWeightRegular !== defaults.typography.fontWeightRegular) {
      typography.fontWeightRegular = args.fontWeightRegular;
    }
    if (args.fontWeightMedium !== defaults.typography.fontWeightMedium) {
      typography.fontWeightMedium = args.fontWeightMedium;
    }
    if (args.fontWeightBold !== defaults.typography.fontWeightBold) {
      typography.fontWeightBold = args.fontWeightBold;
    }

    if (Object.keys(typography).length > 0) {
      delta.typography = typography;
    }

    const exportData = {
      delta: Object.keys(delta).length > 0 ? delta : { note: 'No changes from stock MUI theme' },
      timestamp: new Date().toISOString(),
      baseline: 'MUI v7.3.4 stock theme',
    };

    setExportedTheme(JSON.stringify(exportData, null, 2));
    setCopySuccess(false);
  };

  const handleCopy = () => {
    if (exportedTheme) {
      navigator.clipboard.writeText(exportedTheme);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <PanelContent>
      <h3>Export MUI Theme</h3>
      <Message>
        Use the Controls panel to customize theme values, then click "Export Theme" to generate JSON
        with only the changed values (delta).
      </Message>
      <ExportButton onClick={handleExport}>Export Theme</ExportButton>
      {exportedTheme && (
        <>
          <JsonOutput>{exportedTheme}</JsonOutput>
          <CopyButton onClick={handleCopy}>
            {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
          </CopyButton>
        </>
      )}
    </PanelContent>
  );
};

// Register the addon
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Export Theme',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => (
      <AddonPanel active={active ?? false}>
        <ThemeExportPanel />
      </AddonPanel>
    ),
  });
});
