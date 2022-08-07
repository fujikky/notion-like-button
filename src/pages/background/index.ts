import type { RuntimeMessageRequest, TabMessageRequest } from "~/types";

import { createLike, deleteLike, getLikeInfo } from "./notionApi";

chrome.runtime.onMessage.addListener(
  async (request: RuntimeMessageRequest, sender) => {
    const tabId = sender.tab?.id;
    if (typeof tabId !== "number") return;

    switch (request.message) {
      case "init":
        {
          await chrome.storage.local.set({ userId: request.userId });

          const result = await getLikeInfo(request.url, request.userId);
          if (result) {
            chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
              message: "showLikeButton",
              ...result,
            });
          } else {
            chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
              message: "hideLikeButton",
            });
          }
        }
        break;
      case "createLike":
        try {
          const result = await createLike(request.url, request.userId);
          chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
            message: "updateLikeButton",
            ...result,
          });
        } catch (e) {
          chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
            message: "revertLikeButton",
          });
        }
        break;
      case "deleteLike":
        try {
          const result = await deleteLike(request.url, request.userId);
          chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
            message: "updateLikeButton",
            ...result,
          });
        } catch (e) {
          chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
            message: "revertLikeButton",
          });
        }
        break;
      default:
        break;
    }
  }
);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const url = changeInfo.url;
  if (!url) return;

  chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
    message: "hideLikeButton",
  });

  const { userId } = await chrome.storage.local.get(["userId"]);
  if (typeof userId !== "string") return;

  const result = await getLikeInfo(url, userId);
  if (!result) return;

  chrome.tabs.sendMessage<TabMessageRequest>(tabId, {
    message: "showLikeButton",
    ...result,
  });
});
