import { VFC } from "react";

import { LikeButton } from "~/presentations/organisms/LikeButton";
import { NotionContainer } from "~/presentations/templates/NotionContainer";

import { useLikeButton } from "./useLikeButton";

export const ContentScriptApp: VFC = () => {
  const { isVisible, pageMode, ...likeButtonProps } = useLikeButton();

  return isVisible ? (
    <NotionContainer pageMode={pageMode}>
      <LikeButton {...likeButtonProps} />
    </NotionContainer>
  ) : null;
};
