import { LikeButton } from "~/presentations/organisms/LikeButton";
import { NotionContainer } from "~/presentations/templates/NotionContainer";

import { useLikeButton } from "./useLikeButton";

export const ContentScriptApp = () => {
  const { isVisible, layout, hasScrollBar, ...likeButtonProps } =
    useLikeButton();

  return isVisible ? (
    <NotionContainer layout={layout} hasScrollBar={hasScrollBar}>
      <LikeButton {...likeButtonProps} />
    </NotionContainer>
  ) : null;
};
