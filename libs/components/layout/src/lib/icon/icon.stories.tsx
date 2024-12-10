import type { Meta, StoryObj } from '@storybook/react';
import { CustomIcon } from './icon';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof CustomIcon> = {
  component: CustomIcon,
  title: 'CustomIcon'
};
export default meta;
type Story = StoryObj<typeof CustomIcon>;

export const Primary = {
  args: {
    type: '',
    color: '',
    className: '',
    style: '',
    size: ''
  }
};

export const Heading: Story = {
  args: {
    type: '',
    color: '',
    className: '',
    style: '',
    size: ''
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to CustomIcon!/gi)).toBeTruthy();
  }
};
