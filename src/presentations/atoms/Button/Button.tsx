import { styled } from "@linaria/react";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type Props<As extends ElementType = "button"> = {
  readonly as?: As;
  readonly isDisabled?: boolean;
} & ComponentPropsWithoutRef<As>;

const StyledButton = styled.button`
  display: inline-flex;
  appearance: none;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: transparent solid 2px;
  outline-offset: 2px;
  width: auto;
  line-height: 1.2;
  border-radius: 6px;
  font-weight: 600;
  height: 32px;
  min-width: 32px;
  font-size: 14px;
  padding-inline-start: 12px;
  padding-inline-end: 12px;
  color #2d3748;
  border: 1px solid currentcolor;
  text-decoration: none;
  cursor: pointer;
  background: transparent;

  &:hover {
    background: #edf2f7;
  }

  &[disabled] {
    cursor: default;
    opacity: 0.4;

    &:hover {
      background: transparent;
    }
  }
`;

export const Button = <As extends ElementType = "button">({
  isDisabled,
  ...props
}: Props<As>) => <StyledButton disabled={isDisabled} {...props} />;
