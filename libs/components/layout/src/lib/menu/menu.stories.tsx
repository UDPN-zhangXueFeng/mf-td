import type { Meta, StoryObj } from '@storybook/react';
import { MenuComponent } from './menu';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof MenuComponent> = {
  component: MenuComponent,
  title: 'MenuComponent',
  argTypes: {
    onChangeOpenKey: { action: 'onChangeOpenKey executed!' },
    onChangeSelectedKey: { action: 'onChangeSelectedKey executed!' }
  }
};
export default meta;
type Story = StoryObj<typeof MenuComponent>;

export const Primary = {
  args: {
    menuList: '',
    openKey: '',
    selectedKey: ''
  }
};

export const Heading: Story = {
  args: {
    menuList: '',
    openKey: '',
    selectedKey: ''
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to MenuComponent!/gi)).toBeTruthy();
  }
};
