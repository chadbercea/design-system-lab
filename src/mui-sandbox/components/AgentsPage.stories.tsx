import type { Meta, StoryObj } from '@storybook/react';
import { AgentsPage } from './AgentsPage';

/**
 * Agents Page - STOCK MUI ONLY
 *
 * Built with ZERO theme customization - pure MUI defaults.
 * This shows the baseline gap between stock MUI and the Figma design.
 *
 * NO theme controls, NO customization - just stock MUI components.
 */
const meta = {
  title: 'MUI Sandbox/Agents Page (Stock MUI)',
  component: AgentsPage,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Stock MUI - No Customization
 *
 * Pure out-of-the-box MUI with default theme.
 */
export const StockMUI: Story = {};
