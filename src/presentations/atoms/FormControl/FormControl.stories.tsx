import type { Meta, StoryObj } from "@storybook/react";

import { FormControl, Input } from ".";

type Story = StoryObj<typeof FormControl>;

export default {
  component: FormControl,
  args: {
    fieldName: "Name",
    children: <Input placeholder="test" />,
  },
} as Meta<typeof FormControl>;

export const Default: Story = {};

export const Required: Story = {
  args: { isRequired: true },
};

export const Invalid: Story = {
  args: { error: "invalid error" },
};

export const HelperText: Story = {
  args: { helperText: "helper text" },
};

export const InvalidWithHelperText: Story = {
  args: { error: "invalid error", helperText: "helper text" },
};
