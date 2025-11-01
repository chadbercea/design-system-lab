import type { Meta, StoryObj } from '@storybook/react';
import { AgentWorkflow } from './AgentWorkflow';

const meta = {
  title: 'MUI Sandbox/Agent Workflow (Stock MUI)',
  component: AgentWorkflow,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'responsive' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AgentWorkflow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  parameters: {
    docs: {
      description: {
        story: '7-screen Docker Agent workflow built with 100% stock MUI. Navigate through tabs to see Configuration, Instructions, Tools, Tests, Logs, and Traces views. Zero custom styling - pure Material-UI defaults.',
      },
    },
  },
};
