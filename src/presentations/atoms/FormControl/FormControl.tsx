import { styled } from "@linaria/react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type FormContextValue = {
  readonly id: string;
  readonly isInvalid: boolean;
};

const FormControlContext = createContext<FormContextValue | null>(null);

const genId = () => `form-control-${Math.random().toString(32).substring(2)}`;

export const useFormControl = () => {
  const value = useContext(FormControlContext);
  if (!value) throw new Error("require to wrap FormControlProvider");
  return value;
};

type Props = {
  readonly fieldName: string;
  readonly isRequired?: boolean;
  readonly error?: string | undefined;
  readonly helperText?: ReactNode;
  readonly className?: string;
  readonly children: ReactNode;
};

const StyledWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const StyledLabel = styled.label`
  display: block;
  margin: 0 3px 4px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
`;

const StyledRequiredMark = styled.span`
  margin-left: 2px;
  color: #da3b26;
`;

const StyledHelper = styled.div`
  display: flex;
  margin: 4px 3px 0;
  font-size: 12px;
`;

const StyledHelperError = styled.div`
  flex: 1;
  color: #da3b26;
  text-align: left;
`;

const StyledHelperSpacer = styled.div`
  flex: 1;
`;

export const FormControl = ({
  fieldName,
  isRequired,
  error,
  helperText,
  className,
  children,
}: Props) => {
  const [value, setValue] = useState<FormContextValue>(() => ({
    id: genId(),
    isInvalid: !!error,
  }));

  useEffect(() => setValue((val) => ({ ...val, isInvalid: !!error })), [error]);

  return (
    <FormControlContext.Provider value={value}>
      <StyledWrapper className={className}>
        <StyledLabel htmlFor={value.id}>
          {fieldName}
          {isRequired ? <StyledRequiredMark>*</StyledRequiredMark> : null}
        </StyledLabel>
        {children}
        {error || helperText ? (
          <StyledHelper>
            {error ? (
              <StyledHelperError>{error}</StyledHelperError>
            ) : (
              <StyledHelperSpacer />
            )}
            {helperText}
          </StyledHelper>
        ) : null}
      </StyledWrapper>
    </FormControlContext.Provider>
  );
};
