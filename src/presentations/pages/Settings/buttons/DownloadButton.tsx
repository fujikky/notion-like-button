import { styled } from "@linaria/react";
import type { ReactNode } from "react";
import { useCallback, useRef } from "react";

import { Button } from "~/presentations/atoms/Button";

type Props = {
  readonly className?: string;
  readonly children: ReactNode;
  readonly onDownload: () => { readonly file: Blob; readonly filename: string };
};

const StyledAnchor = styled.a`
  display: none;
`;

const StyledIcon = styled.svg`
  width: 12px;
  height: 12px;
  margin-right: 5px;
  fill: currentColor;
`;

export const DownloadButton = ({ className, children, onDownload }: Props) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleClick = useCallback(() => {
    const mutableAnchor = ref.current;
    if (!mutableAnchor) return;

    const { file, filename } = onDownload();
    mutableAnchor.href = URL.createObjectURL(file);
    mutableAnchor.download = filename;
    mutableAnchor.click();
  }, [onDownload]);

  return (
    <>
      <Button onClick={handleClick} className={className}>
        <StyledIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path d="M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128zM571 308l-95.7-96.4c-10.1-10.1-27.4-3-27.4 11.3V288h-64v64h64v65.2c0 14.3 17.3 21.4 27.4 11.3L571 332c6.6-6.6 6.6-17.4 0-24zm-379 28v-32c0-8.8 7.2-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.8 0-16-7.2-16-16z" />
        </StyledIcon>
        {children}
      </Button>
      <StyledAnchor ref={ref} aria-hidden="true" />
    </>
  );
};
