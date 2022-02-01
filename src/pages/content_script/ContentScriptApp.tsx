import { styled } from "@linaria/react";
import { VFC } from "react";

import { LikeButton } from "~/presentations/organisms/LikeButton";

import { useLikeButton } from "./useLikeButton";

const StyledLikeButtonContainer = styled.div`
  position: relative;
`;

export const ContentScriptApp: VFC = () => {
  const { isVisible, position, ...likeButtonProps } = useLikeButton();

  return isVisible ? (
    // eslint-disable-next-line react/forbid-component-props
    <StyledLikeButtonContainer style={position}>
      <LikeButton {...likeButtonProps} />
    </StyledLikeButtonContainer>
  ) : null;
};
