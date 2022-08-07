import { styled } from "@linaria/react";
import type { ChangeEventHandler, ComponentProps } from "react";
import { useCallback } from "react";

import { Button } from "~/presentations/atoms/Button";
import { FormControl, Input } from "~/presentations/atoms/FormControl";

import { DownloadButton } from "./buttons/DownloadButton";
import { UploadButton } from "./buttons/UploadButton";

type Props = {
  readonly title: string;
  readonly version: string;
  readonly displaySettings: boolean;
  readonly apiToken: string;
  readonly likeProp: string;
  readonly isSaveButtonEnabled: boolean;
  readonly errors: {
    readonly apiToken?: string | undefined;
    readonly likeProp?: string | undefined;
  };
  readonly onApiTokenChange: (value: string) => void;
  readonly onLikePropChange: (value: string) => void;
  readonly onSave: () => void;
  readonly onUpload: ComponentProps<typeof UploadButton>["onUpload"];
  readonly onDownload: ComponentProps<typeof DownloadButton>["onDownload"];
};

const StyledWrapper = styled.div`
  width: 300px;
  padding: 20px;
  box-sizing: border-box;
  color: #37352f;
`;

const StyledLogo = styled.img`
  display: block;
  margin: 10px auto;
  width: 64px;
  height: 64px;
`;

const StyledTitle = styled.h1`
  font-size: 18px;
  text-align: center;
`;

const StyledVersion = styled.div`
  font-size: 14px;
  text-align: center;
  opacity: 0.8;
`;

const StyledHeaderButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0 0;

  & > * {
    margin-left: 10px;

    &:first-of-type {
      margin-left: 0;
    }
  }
`;

const StyledApiTokenFormControl = styled(FormControl)`
  margin-top: 40px;
`;

const StyledLikePropFormControl = styled(FormControl)`
  margin-top: 20px;
`;

const StyledApiTokenHelperLink = styled.a`
  display: block;
  color: #37352f;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledSaveButtonWrapper = styled.div`
  display: flex;
  margin: 20px 0 0;
  justify-content: flex-end;
`;

export const Settings = ({
  title,
  version,
  displaySettings,
  apiToken,
  likeProp,
  errors,
  isSaveButtonEnabled,
  onApiTokenChange,
  onLikePropChange,
  onSave,
  onUpload,
  onDownload,
}: Props) => {
  const handleApiTokenChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => onApiTokenChange(e.currentTarget.value), [onApiTokenChange]);

  const handleLikePropChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => onLikePropChange(e.currentTarget.value), [onLikePropChange]);

  return (
    <StyledWrapper>
      <StyledLogo src="/icon-128.png" alt="Logo" />
      <StyledTitle>{title}</StyledTitle>
      <StyledVersion>{version}</StyledVersion>

      {displaySettings ? (
        <>
          <StyledHeaderButtonWrapper>
            <UploadButton onUpload={onUpload}>Import</UploadButton>
            <DownloadButton onDownload={onDownload}>Export</DownloadButton>
          </StyledHeaderButtonWrapper>
          <StyledApiTokenFormControl
            fieldName="Notion API Token"
            isRequired
            error={errors.apiToken}
            helperText={
              <StyledApiTokenHelperLink
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noreferrer"
              >
                Create Token
              </StyledApiTokenHelperLink>
            }
          >
            <Input
              type="password"
              placeholder="secret_xxx"
              value={apiToken}
              onChange={handleApiTokenChange}
            />
          </StyledApiTokenFormControl>
          <StyledLikePropFormControl
            fieldName="Like Field Name"
            error={errors.likeProp}
          >
            <Input
              placeholder="Like"
              value={likeProp}
              onChange={handleLikePropChange}
            />
          </StyledLikePropFormControl>
          <StyledSaveButtonWrapper>
            <Button isDisabled={!isSaveButtonEnabled} onClick={onSave}>
              Save Changes
            </Button>
          </StyledSaveButtonWrapper>
        </>
      ) : null}
    </StyledWrapper>
  );
};
