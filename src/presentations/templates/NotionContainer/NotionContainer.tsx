import { styled } from "@linaria/react";
import type { ReactNode } from "react";

type Props = {
  readonly pageMode: "page" | "popup";
  readonly children: ReactNode;
};

const StylePageContainer = styled.div`
  z-index: 1000;
  pointer-events: none;
  position: fixed;
  right: 64px;
  bottom: 16px;
`;

const StylePopupContainer = styled.div`
  z-index: 1000;
  pointer-events: none;
  position: fixed;
  top: 72px;
  left: 72px;
  right: 72px;
  margin: 0 auto;
  max-width: 960px;
  height: calc(100% - 144px);
`;

const StylePopupInner = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
`;

export const NotionContainer = ({ pageMode, children }: Props) =>
  pageMode === "page" ? (
    <StylePageContainer>{children}</StylePageContainer>
  ) : (
    <StylePopupContainer>
      <StylePopupInner>{children}</StylePopupInner>
    </StylePopupContainer>
  );
