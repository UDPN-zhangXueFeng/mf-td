import type { Meta, StoryObj } from '@storybook/react';
import { User } from './user';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof User> = {
  component: User,
  title: 'User'
};
export default meta;
type Story = StoryObj<typeof User>;

export const Primary = {
  args: {
    cPwApi: '',
    cPwKey: '',
    outApi: ''
  }
};

export const Heading: Story = {
  args: {
    cPwApi: '',
    cPwKey: '',
    outApi: ''
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to User!/gi)).toBeTruthy();
  }
};
