import type { Meta, StoryObj } from '@storybook/react';
import MuiTypography from './Typography';

const meta = {
  title: 'MUI Sandbox/Typography',
  component: MuiTypography,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MuiTypography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {};
