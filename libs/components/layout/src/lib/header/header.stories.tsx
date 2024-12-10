import type { Meta, StoryObj } from '@storybook/react';
import { HeaderComponent } from './header';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof HeaderComponent> = {
  component: HeaderComponent,
  title: 'HeaderComponent',
  argTypes: {
    toggle: { action: 'toggle executed!' }
  }
};
export default meta;
type Story = StoryObj<typeof HeaderComponent>;

export const Primary = {
  args: {
    collapsed: false,
    logo: '',
    title: '',
    topMenu: '',
    user: '',
    isShowUser: false
  }
};

export const Heading: Story = {
  args: {
    collapsed: false,
    logo: '',
    title: '',
    topMenu: '',
    user: '',
    isShowUser: false
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to HeaderComponent!/gi)).toBeTruthy();
  }
};
