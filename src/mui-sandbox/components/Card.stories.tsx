import type { Meta, StoryObj } from '@storybook/react';
import MuiCard from './Card';

const meta = {
  title: 'MUI Sandbox/Card',
  component: MuiCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MuiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {};
