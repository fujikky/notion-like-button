import { scrollbarWidth } from "@xobotyi/scrollbar-width";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";

import type { LikeButton } from "~/presentations/organisms/LikeButton";
import type { Layout, RuntimeMessageRequest, TabMessageRequest } from "~/types";

import { getNotionInfo } from "./getNotionInfo";

type LikeInfo = {
  readonly isLiked: boolean;
  readonly likeCount: number;
  readonly layout: Layout;
  readonly withAnimation: boolean;
};

type HookResult = {
  readonly isVisible: boolean;
  readonly layout: Layout;
  readonly hasScrollBar: boolean;
} & ComponentProps<typeof LikeButton>;

export const useLikeButton = (): HookResult => {
  const [isVisible, setVisible] = useState(false);
  const [likeInfo, setLikeInfo] = useState<LikeInfo>({
    isLiked: false,
    likeCount: 0,
    layout: "full-page",
    withAnimation: false,
  });
  const [temporaryLikeInfo, setTemporaryLikeInfo] = useState<LikeInfo | null>(
    null
  );
  const [hasScrollBar] = useState(() => (scrollbarWidth() ?? 0) > 0);

  const handleCreateLike = useCallback(() => {
    const { userId, url } = getNotionInfo();
    if (!userId) return;

    setTemporaryLikeInfo({
      isLiked: true,
      likeCount: likeInfo.likeCount + 1,
      layout: likeInfo.layout,
      withAnimation: true,
    });

    chrome.runtime.sendMessage<RuntimeMessageRequest>({
      message: "createLike",
      userId,
      url,
    });
  }, [likeInfo]);

  const handleDeleteLike = useCallback(() => {
    const { userId, url } = getNotionInfo();
    if (!userId) return;

    setTemporaryLikeInfo({
      isLiked: false,
      likeCount: likeInfo.likeCount - 1,
      layout: likeInfo.layout,
      withAnimation: false,
    });

    chrome.runtime.sendMessage<RuntimeMessageRequest>({
      message: "deleteLike",
      userId,
      url,
    });
  }, [likeInfo]);

  useEffect(() => {
    const handler = async (request: TabMessageRequest) => {
      const { url } = getNotionInfo();

      switch (request.message) {
        case "showLikeButton":
          if (url !== request.url) return;
          setVisible(true);
          setLikeInfo({
            isLiked: request.isLiked,
            likeCount: request.likeCount,
            layout: request.layout,
            withAnimation: false,
          });
          setTemporaryLikeInfo(null);
          break;

        case "updateLikeButton":
          if (url !== request.url) return;
          setLikeInfo({
            isLiked: request.isLiked,
            likeCount: request.likeCount,
            layout: request.layout,
            withAnimation: false,
          });
          setTemporaryLikeInfo(null);
          break;

        case "revertLikeButton":
          setTemporaryLikeInfo(null);
          break;

        case "hideLikeButton":
          setVisible(false);
          break;

        default:
          break;
      }
    };
    chrome.runtime.onMessage.addListener(handler);

    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  useEffect(() => {
    const { userId, url } = getNotionInfo();
    if (!userId) return;

    chrome.runtime.sendMessage<RuntimeMessageRequest>({
      message: "init",
      userId,
      url,
    });
  }, []);

  const currentLikeInfo = temporaryLikeInfo ?? likeInfo;

  return {
    ...currentLikeInfo,
    isVisible,
    isSubmitting: !!temporaryLikeInfo,
    hasScrollBar,
    onCreateLike: handleCreateLike,
    onDeleteLike: handleDeleteLike,
  };
};
