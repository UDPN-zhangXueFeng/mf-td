import type { Meta, StoryObj } from '@storybook/react';
import { LibLayout } from './lib-layout';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof LibLayout> = {
  component: LibLayout,
  title: 'LibLayout'
};
export default meta;
type Story = StoryObj<typeof LibLayout>;

export const Primary = {
  args: {
    logo: '',
    title: '',
    topMenu: '',
    user: ''
  }
};

export const Heading: Story = {
  args: {
    logo: '',
    title: '',
    topMenu: '',
    user: ''
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to LibLayout!/gi)).toBeTruthy();
  }
};
