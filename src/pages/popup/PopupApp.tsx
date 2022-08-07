import embededSettings from "embeded-settings";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Settings } from "~/presentations/pages/Settings";
import type { SettingsValues } from "~/types";

type Errors = ComponentProps<typeof Settings>["errors"];

const invalidApiTokenMessage = (apiToken: unknown) => {
  if (!apiToken) return "API token is required";
  if (typeof apiToken !== "string" || !/^secret_/.test(apiToken))
    return "Invalid API token";
  return undefined;
};

const invalidLikePropMessage = (likeProp: unknown) => {
  if (typeof likeProp === "undefined" || typeof likeProp === "string")
    return undefined;
  return "Invalid Like prop";
};

const validateSettings = (data: unknown) => {
  const settings = (
    data && typeof data === "object" ? data : {}
  ) as SettingsValues;

  const errors: Errors = {
    apiToken: invalidApiTokenMessage(settings.apiToken),
    likeProp: invalidLikePropMessage(settings.likeProp),
  };

  return { settings, errors };
};

const safeJsonParse = (data: unknown): unknown => {
  try {
    return typeof data === "string" ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const PopupApp = () => {
  const [apiToken, setApiToken] = useState<string>();
  const [likeProp, setLikeProp] = useState<string>();
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const hasErrors = useMemo(
    () => Object.values(errors).filter((e) => !!e).length > 0,
    [errors]
  );

  const handleApiTokenChange = useCallback<
    ComponentProps<typeof Settings>["onApiTokenChange"]
  >((value) => {
    setApiToken(value);
    setHasChanges(true);

    const errorMessage = invalidApiTokenMessage(value);
    if (errorMessage) {
      setErrors((err) => ({ ...err, apiToken: errorMessage }));
    } else {
      setErrors((err) => ({ ...err, apiToken: undefined }));
    }
  }, []);

  const handleLikePropChange = useCallback<
    ComponentProps<typeof Settings>["onLikePropChange"]
  >((value) => {
    setLikeProp(value);
    setHasChanges(true);

    const errorMessage = invalidLikePropMessage(value);
    if (errorMessage) {
      setErrors((err) => ({ ...err, likeProp: errorMessage }));
    } else {
      setErrors((err) => ({ ...err, likeProp: undefined }));
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (hasErrors) return;

    setHasChanges(false);
    await chrome.storage.local.set({ apiToken, likeProp });
  }, [apiToken, hasErrors, likeProp]);

  const apply = useCallback((settings: SettingsValues, errors: Errors) => {
    setApiToken(typeof settings.apiToken === "string" ? settings.apiToken : "");
    setLikeProp(typeof settings.likeProp === "string" ? settings.likeProp : "");
    setErrors(errors);
  }, []);

  const handleUpload = useCallback<ComponentProps<typeof Settings>["onUpload"]>(
    async (data) => {
      const result = validateSettings(safeJsonParse(data));
      apply(result.settings, result.errors);

      if (Object.values(result.errors).filter((e) => !!e).length === 0) {
        setHasChanges(false);
        await chrome.storage.local.set(result.settings);
      }
    },
    [apply]
  );

  const handleDownload = useCallback<
    ComponentProps<typeof Settings>["onDownload"]
  >(() => {
    const content = JSON.stringify({ apiToken, likeProp });
    return {
      file: new Blob([content], { type: "text/plain" }),
      filename: "notion-like-button-settings.json",
    };
  }, [apiToken, likeProp]);

  useEffect(() => {
    const immediate = async () => {
      const data = await chrome.storage.local.get(["apiToken", "likeProp"]);
      const result = validateSettings(data);
      apply(result.settings, result.errors);
    };
    immediate().catch(console.error);
  }, [apply]);

  return (
    <Settings
      title={embededSettings.manifest.name}
      version={embededSettings.manifest.version}
      displaySettings={!embededSettings.apiToken}
      apiToken={apiToken ?? ""}
      likeProp={likeProp ?? ""}
      isSaveButtonEnabled={hasChanges && !hasErrors}
      errors={errors}
      onApiTokenChange={handleApiTokenChange}
      onLikePropChange={handleLikePropChange}
      onSave={handleSave}
      onUpload={handleUpload}
      onDownload={handleDownload}
    />
  );
};
