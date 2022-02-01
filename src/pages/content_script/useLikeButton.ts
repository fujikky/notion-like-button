import {
  CSSProperties,
  ComponentProps,
  useCallback,
  useEffect,
  useState,
} from "react";

import { LikeButton } from "~/presentations/organisms/LikeButton";
import { RuntimeMessageRequest, TabMessageRequest } from "~/types";

import { getNotionInfo } from "./getNotionInfo";

type PageMode = "page" | "popup";

type LikeInfo = {
  readonly isLiked: boolean;
  readonly likeCount: number;
  readonly pageMode: PageMode;
  readonly withAnimation: boolean;
};

type HookResult = {
  readonly isVisible: boolean;
  readonly position: CSSProperties;
} & ComponentProps<typeof LikeButton>;

const POSITIONS_BY_PAGE_MODE: Record<PageMode, CSSProperties> = {
  page: { bottom: 16, right: 64 },
  popup: { bottom: 87, right: 86 },
};

export const useLikeButton = (): HookResult => {
  const [isVisible, setVisible] = useState(false);
  const [likeInfo, setLikeInfo] = useState<LikeInfo>({
    isLiked: false,
    likeCount: 0,
    pageMode: "page",
    withAnimation: false,
  });
  const [temporaryLikeInfo, setTemporaryLikeInfo] = useState<LikeInfo | null>(
    null
  );

  const handleCreateLike = useCallback(() => {
    const { userId, url } = getNotionInfo();
    if (!userId) return;

    setTemporaryLikeInfo({
      isLiked: true,
      likeCount: likeInfo.likeCount + 1,
      pageMode: likeInfo.pageMode,
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
      pageMode: likeInfo.pageMode,
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
            pageMode: request.pageMode,
            withAnimation: false,
          });
          setTemporaryLikeInfo(null);
          break;

        case "updateLikeButton":
          if (url !== request.url) return;
          setLikeInfo({
            isLiked: request.isLiked,
            likeCount: request.likeCount,
            pageMode: request.pageMode,
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
    isVisible,
    position: POSITIONS_BY_PAGE_MODE[currentLikeInfo.pageMode],
    isLiked: currentLikeInfo.isLiked,
    likeCount: currentLikeInfo.likeCount,
    withAnimation: currentLikeInfo.withAnimation,
    isSubmitting: !!temporaryLikeInfo,
    onCreateLike: handleCreateLike,
    onDeleteLike: handleDeleteLike,
  };
};
