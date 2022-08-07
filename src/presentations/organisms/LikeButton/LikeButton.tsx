import { css, cx } from "@linaria/core";
import { styled } from "@linaria/react";
import { useCallback } from "react";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  opacity: 1;
  pointer-events: auto;
  justify-content: center;
  background: #fff;
  height: 36px;
  width: max-content;
  border-radius: 18px;
  font-size: 20px;
  box-shadow: rgb(15, 15, 15, 0.1) 0px 0px 0px 1px,
    rgb(15, 15, 15, 0.1) 0px 2px 4px;
  padding: 0 18px;
  cursor: pointer;
  color: #37352f;
  box-shadow: rgb(15, 15, 15, 0.1) 0px 0px 0px 1px,
    rgb(15, 15, 15, 0.1) 0px 2px 4px;

  &:hover {
    background: #efefee;
  }
`;

const isSubmittingStyle = css`
  cursor: default;
  &:hover {
    background: #fff;
  }
`;

const isLikedStyle = css`
  color: #ed230d;
  box-shadow: rgba(237, 35, 13, 0.4) 0px 0px 0px 1px,
    rgb(15, 15, 15, 0.1) 0px 2px 4px;
`;

const StyledCountLabel = styled.div`
  font-size: 16px;
  min-width: 10px;
`;

const StyledIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: currentColor;
  margin-right: 3px;
`;

const withAnimationStyle = css`
  @keyframes heart-animation {
    0% {
      transform: scale(1, 1) translate(0%, 0%);
    }
    15% {
      transform: scale(0.9, 0.9) translate(0%, 5%);
    }
    30% {
      transform: scale(1.3, 0.8) translate(0%, 10%);
    }
    50% {
      transform: scale(0.8, 1.3) translate(0%, -10%);
    }
    70% {
      transform: scale(1.1, 0.9) translate(0%, 5%);
    }
    100% {
      transform: scale(1, 1) translate(0%, 0%);
    }
  }

  & > svg {
    animation: heart-animation 0.5s;
  }
`;

const HeartLineIcon = () => (
  <StyledIcon viewBox="0,0,24,24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 3c3.314 0 6 2.636 6 5.887 0 4.51-4.393 8.71-8.976 11.633-.34.218-.6.373-.6.373a.895.895 0 0 1-.846.002s-.24-.144-.57-.355C6.412 17.615 2 13.407 2 8.887 2 5.636 4.686 3 8 3c1.537 0 2.938.567 4 1.499A6.043 6.043 0 0 1 16 3Zm0 1.962c-1 0-1.937.359-2.666 1l-.955.838a.583.583 0 0 1-.758 0l-.955-.839A4.02 4.02 0 0 0 8 4.962c-2.21 0-4 1.757-4 3.925 0 3.065 2.899 6.589 7.624 9.701.155.103.358.257.382.241C16.95 15.657 20 12.031 20 8.887c0-2.168-1.79-3.925-4-3.925Z"
      fillRule="evenodd"
    />
  </StyledIcon>
);

const HeartFilledIcon = () => (
  <StyledIcon viewBox="0,0,24,24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 3c1.537 0 2.938.567 4 1.499A6.043 6.043 0 0 1 16 3c3.314 0 6 2.636 6 5.887 0 4.51-4.393 8.71-8.976 11.633-.34.218-.6.373-.6.373a.895.895 0 0 1-.846.002s-.24-.144-.57-.355C6.412 17.615 2 13.407 2 8.887 2 5.636 4.686 3 8 3Z"
      fillRule="evenodd"
    />
  </StyledIcon>
);

type Props = {
  readonly isLiked: boolean;
  readonly likeCount: number;
  readonly isSubmitting: boolean;
  readonly withAnimation: boolean;
  readonly onCreateLike: () => void;
  readonly onDeleteLike: () => void;
};

export const LikeButton = ({
  isLiked,
  likeCount,
  isSubmitting,
  withAnimation,
  onCreateLike,
  onDeleteLike,
}: Props) => {
  const handleClick = useCallback(() => {
    if (isSubmitting) return;

    if (isLiked) {
      onDeleteLike();
    } else {
      onCreateLike();
    }
  }, [isLiked, isSubmitting, onCreateLike, onDeleteLike]);

  return (
    <StyledWrapper
      role="button"
      className={cx(
        isSubmitting && isSubmittingStyle,
        isLiked && isLikedStyle,
        withAnimation && withAnimationStyle
      )}
      onClick={handleClick}
    >
      {isLiked ? <HeartFilledIcon /> : <HeartLineIcon />}
      <StyledCountLabel>{likeCount}</StyledCountLabel>
    </StyledWrapper>
  );
};
