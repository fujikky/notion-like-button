import { styled } from "@linaria/react";
import type { ReactNode } from "react";

import type { Layout } from "~/types";

type Props = {
  readonly layout: Layout;
  readonly children: ReactNode;
};

const StylePageContainer = styled.div`
  z-index: 1000;
  pointer-events: none;
  position: fixed;
  right: 64px;
  bottom: 16px;
`;

const StyleCenterPeekContainer = styled.div`
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

const StyleCenterPeekInner = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
`;

export const NotionContainer = ({ layout, children }: Props) =>
  layout === "center-peek" ? (
    <StyleCenterPeekContainer>
      <StyleCenterPeekInner>{children}</StyleCenterPeekInner>
    </StyleCenterPeekContainer>
  ) : (
    <StylePageContainer>{children}</StylePageContainer>
  );
