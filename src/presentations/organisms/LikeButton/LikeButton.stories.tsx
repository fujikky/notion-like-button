import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { useCallback, useState } from "react";

import { LikeButton } from ".";

type Story = ComponentStoryObj<typeof LikeButton>;

export default {
  component: LikeButton,
  args: {
    isLiked: false,
    likeCount: 0,
    isSubmitting: false,
    withAnimation: false,
  },
} as ComponentMeta<typeof LikeButton>;

export const Default: Story = {};

export const Liked: Story = {
  args: {
    isLiked: true,
    likeCount: 1,
  },
};

export const Submitting: Story = {
  args: {
    isLiked: true,
    likeCount: 1,
    isSubmitting: true,
  },
};

export const Toggle: Story = {
  render: (args) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [isLiked, setIsLiked] = useState(args.isLiked);
    const [likeCount, setLikeCount] = useState(args.likeCount);
    const [isSubmitting, setIsSubmitting] = useState(args.isSubmitting);
    const [withAnimation, setWithAnimation] = useState(args.withAnimation);
    const handleCreateLike = useCallback(() => {
      setIsLiked(true);
      setLikeCount((likeCount) => likeCount + 1);
      setIsSubmitting(true);
      setWithAnimation(true);
      setTimeout(() => setIsSubmitting(false), 1000);
    }, []);
    const handleDeleteLike = useCallback(() => {
      setIsLiked(false);
      setLikeCount((likeCount) => likeCount - 1);
      setIsSubmitting(true);
      setWithAnimation(false);
      setTimeout(() => setIsSubmitting(false), 1000);
    }, []);
    /* eslint-enable react-hooks/rules-of-hooks */

    return (
      <LikeButton
        isLiked={isLiked}
        likeCount={likeCount}
        isSubmitting={isSubmitting}
        withAnimation={withAnimation}
        onCreateLike={handleCreateLike}
        onDeleteLike={handleDeleteLike}
      />
    );
  },
};
