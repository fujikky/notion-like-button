import type { RuntimeMessageRequest, TabMessageRequest } from "~/types";

import { createLike, deleteLike, getLikeInfo } from "./notionApi";

// The receiving tab may not have the content script listening yet (e.g. it
// doesn't match the content script, or hasn't finished loading), in which
// case chrome.tabs.sendMessage rejects. These notifications are best-effort.
const sendTabMessage = (tabId: number, message: TabMessageRequest) =>
  chrome.tabs.sendMessage<TabMessageRequest>(tabId, message).catch(() => {});

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
            sendTabMessage(tabId, { message: "showLikeButton", ...result });
          } else {
            sendTabMessage(tabId, { message: "hideLikeButton" });
          }
        }
        break;
      case "createLike":
        try {
          const result = await createLike(request.url, request.userId);
          sendTabMessage(tabId, { message: "updateLikeButton", ...result });
        } catch {
          sendTabMessage(tabId, { message: "revertLikeButton" });
        }
        break;
      case "deleteLike":
        try {
          const result = await deleteLike(request.url, request.userId);
          sendTabMessage(tabId, { message: "updateLikeButton", ...result });
        } catch {
          sendTabMessage(tabId, { message: "revertLikeButton" });
        }
        break;
      default:
        break;
    }
  },
);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const url = changeInfo.url;
  if (!url) return;

  sendTabMessage(tabId, { message: "hideLikeButton" });

  const { userId } = await chrome.storage.local.get(["userId"]);
  if (typeof userId !== "string") return;

  const result = await getLikeInfo(url, userId);
  if (!result) return;

  sendTabMessage(tabId, { message: "showLikeButton", ...result });
});
