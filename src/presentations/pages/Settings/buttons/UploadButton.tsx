import { styled } from "@linaria/react";
import type { ChangeEventHandler, ReactNode } from "react";
import { useCallback, useRef } from "react";

import { Button } from "~/presentations/atoms/Button";

type Props = {
  readonly className?: string;
  readonly onUpload: (result: FileReader["result"] | undefined) => void;
  readonly children: ReactNode;
};

const StyledInput = styled.input`
  display: none;
`;

const StyledIcon = styled.svg`
  width: 12px;
  height: 12px;
  margin-right: 5px;
  fill: currentColor;
`;

export const UploadButton = ({ className, children, onUpload }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(() => ref.current?.click(), []);
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const files = e.currentTarget.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;
      const mutableReader = new FileReader();
      mutableReader.onload = (e) => onUpload(e.target?.result);
      mutableReader.readAsText(file);
    },
    [onUpload]
  );

  return (
    <>
      <Button onClick={handleClick} className={className}>
        <StyledIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M16 288c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h112v-64zm489-183L407.1 7c-4.5-4.5-10.6-7-17-7H384v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H152c-13.3 0-24 10.7-24 24v264h128v-65.2c0-14.3 17.3-21.4 27.4-11.3L379 308c6.6 6.7 6.6 17.4 0 24l-95.7 96.4c-10.1 10.1-27.4 3-27.4-11.3V352H128v136c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H376c-13.2 0-24-10.8-24-24z" />
        </StyledIcon>
        {children}
      </Button>
      <StyledInput
        ref={ref}
        type="file"
        accept=".json,application/json"
        onChange={handleChange}
        aria-hidden="true"
      />
    </>
  );
};
