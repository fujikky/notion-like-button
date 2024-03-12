import type { Meta, StoryObj } from "@storybook/react";

import { Button } from ".";

type Story = StoryObj<typeof Button>;

export default {
  component: Button,
  args: {
    children: "button",
  },
} as Meta<typeof Button>;

export const Default: Story = {};

export const Label: Story = {
  args: {
    as: "label",
    htmlFor: "form-id",
    children: "label button",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
