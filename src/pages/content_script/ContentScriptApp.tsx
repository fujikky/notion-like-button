import { LikeButton } from "~/presentations/organisms/LikeButton";
import { NotionContainer } from "~/presentations/templates/NotionContainer";

import { useLikeButton } from "./useLikeButton";

export const ContentScriptApp = () => {
  const { isVisible, layout: pageMode, ...likeButtonProps } = useLikeButton();

  return isVisible ? (
    <NotionContainer layout={pageMode}>
      <LikeButton {...likeButtonProps} />
    </NotionContainer>
  ) : null;
};
