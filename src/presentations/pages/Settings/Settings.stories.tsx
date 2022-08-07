import { styled } from "@linaria/react";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Settings } from ".";

type Story = ComponentStoryObj<typeof Settings>;

const StyledWrapper = styled.div`
  width: max-content;
  outline: 1px solid #ccc;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.2);
`;

export default {
  component: Settings,
  args: {
    onDownload: () => ({
      file: new Blob([JSON.stringify({ foo: "bar" })], { type: "text/plain" }),
      filename: "notion-like-button-settings.json",
    }),
    isSaveButtonEnabled: false,
    errors: {},
  },
  decorators: [(story) => <StyledWrapper>{story()}</StyledWrapper>],
} as ComponentMeta<typeof Settings>;

export const Default: Story = {};

export const Changed: Story = {
  args: {
    isSaveButtonEnabled: true,
  },
};

export const Invalid: Story = {
  args: {
    errors: { apiToken: "Invalid API Token" },
  },
};
