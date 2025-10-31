import type { Meta, StoryObj } from '@storybook/react';
import MuiTextField from './TextField';

const meta = {
  title: 'MUI Sandbox/TextField',
  component: MuiTextField,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MuiTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {};
