import { styled } from "@linaria/react";
import type { ComponentPropsWithoutRef } from "react";

import { useFormControl } from "./FormControl";

const StyledInput = styled.input`
  width: 100%;
  min-width: 0px;
  outline: transparent solid 2px;
  outline-offset: 2px;
  position: relative;
  appearance: none;
  font-size: 16px;
  padding-inline-start: 16px;
  padding-inline-end: 16px;
  height: 40px;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: #e2e8f0;
  box-sizing: border-box;

  &[aria-invalid="true"] {
    border-color: #da3b26;
  }
`;

type Props = ComponentPropsWithoutRef<"input">;

export const Input = (props: Props) => {
  const { id, isInvalid } = useFormControl();
  return <StyledInput id={id} aria-invalid={isInvalid} {...props} />;
};
