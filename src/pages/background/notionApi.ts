import { Client } from "@notionhq/client";
import embededSettings from "embeded-settings";

import type { SettingsValues } from "~/types";

const DEFAULT_LIKE_PROP = "Like";

const getNotion = async (url: string) => {
  const u = new URL(url);
  if (u.host !== "www.notion.so") return null;

  const queryPageId = u.searchParams.get("p");
  const pageId = queryPageId || u.pathname.split(/(-|\/)/g).at(-1);
  const pageMode = queryPageId ? "popup" : "page";
  if (!pageId) return null;

  const settings = embededSettings.apiToken
    ? (embededSettings as SettingsValues)
    : ((await chrome.storage.local.get([
        "apiToken",
        "likeProp",
      ])) as SettingsValues);
  if (!settings.apiToken) return null;

  const likeProp = settings.likeProp || DEFAULT_LIKE_PROP;

  const client = new Client({
    auth: settings.apiToken,
    fetch: (input, init) => {
      const method = init?.method?.toUpperCase();
      const newInit: RequestInit = {
        ...init,
        ...(method ? { method } : {}),
      };
      return fetch(input, newInit);
    },
  });

  return { pageId, pageMode, likeProp, client } as const;
};

const getLikedPersonIds = async (
  client: Client,
  pageId: string,
  likeProp: string
) => {
  const page = await client.pages.retrieve({ page_id: pageId });
  if (!("properties" in page)) throw new Error("page has not properties");
  const propertyId = page.properties[likeProp]?.id;
  if (!propertyId) throw new Error("page has not like prop");

  const property = await client.pages.properties.retrieve({
    page_id: page.id,
    property_id: propertyId,
  });
  if (property.object !== "list") throw Error("like property is not a list");

  const mutablePeople = [];
  // eslint-disable-next-line functional/no-loop-statement
  for (const item of property.results) {
    if (item.type !== "people") continue;
    mutablePeople.push(item.people.id);
  }
  return mutablePeople;
};

const createLikeInfo = (
  personIds: readonly string[],
  currentUserId: string
) => {
  const isLiked = personIds.some((id) => id === currentUserId);
  const likeCount = personIds.length;
  return { isLiked, likeCount };
};

export const getLikeInfo = async (url: string, userId: string) => {
  const notion = await getNotion(url);
  if (!notion) return null;

  const { pageId, pageMode, likeProp, client } = notion;

  try {
    const ids = await getLikedPersonIds(client, pageId, likeProp);
    return { ...createLikeInfo(ids, userId), pageMode, url };
  } catch {
    return null;
  }
};

export const createLike = async (url: string, userId: string) => {
  const notion = await getNotion(url);
  if (!notion) throw Error("Could not find valid api settings");

  const { pageId, pageMode, likeProp, client } = notion;
  const ids = await getLikedPersonIds(client, pageId, likeProp);
  const people = ids.map((id) => ({ id })).concat({ id: userId });
  await client.pages.update({
    page_id: pageId,
    properties: { [likeProp]: { type: "people", people } },
  });
  return {
    ...createLikeInfo(
      people.map((p) => p.id),
      userId
    ),
    pageMode,
    url,
  };
};

export const deleteLike = async (url: string, userId: string) => {
  const notion = await getNotion(url);
  if (!notion) throw Error("Could not find valid api settings");

  const { pageId, pageMode, likeProp, client } = notion;
  const ids = await getLikedPersonIds(client, pageId, likeProp);
  const people = ids.filter((id) => id !== userId).map((id) => ({ id }));
  await client.pages.update({
    page_id: pageId,
    properties: { [likeProp]: { type: "people", people } },
  });
  return {
    ...createLikeInfo(
      people.map((p) => p.id),
      userId
    ),
    pageMode,
    url,
  };
};
