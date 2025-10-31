import type { Meta, StoryObj } from '@storybook/react';
import MuiButton from './Button';

const meta = {
  title: 'MUI Sandbox/Button',
  component: MuiButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MuiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {};
