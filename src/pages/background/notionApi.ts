import { Client } from "@notionhq/client";
import embededSettings from "embeded-settings";

import type { Layout, SettingsValues } from "~/types";

const DEFAULT_LIKE_PROP = "Like";

type NotionPageInfo = {
  readonly pageId: string;
  readonly layout: Layout;
};

type NotionPageContext = {
  readonly client: Client;
  readonly likeProp: string;
} & NotionPageInfo;

const resolvePageInfo = (url: string): NotionPageInfo | null => {
  const u = new URL(url);
  if (u.host !== "www.notion.so") return null;

  const queryPageId = u.searchParams.get("p");
  if (queryPageId) {
    return {
      pageId: queryPageId,
      layout: u.searchParams.get("pm") === "s" ? "side-peek" : "center-peek",
    };
  }

  const pathPageId = u.pathname.split(/(-|\/)/g).at(-1);
  if (pathPageId) {
    return {
      pageId: pathPageId,
      layout: "full-page",
    };
  }

  return null;
};

const getNotionContext = async (
  url: string
): Promise<NotionPageContext | null> => {
  const pageInfo = resolvePageInfo(url);
  if (!pageInfo) return null;

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

  return { ...pageInfo, likeProp, client };
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

  const mutableIds = [];
  // eslint-disable-next-line functional/no-loop-statement
  for (const item of property.results) {
    if (item.type !== "people") continue;
    mutableIds.push(item.people.id);
  }
  return mutableIds;
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
  const notion = await getNotionContext(url);
  if (!notion) return null;

  try {
    const ids = await getLikedPersonIds(
      notion.client,
      notion.pageId,
      notion.likeProp
    );
    return { ...createLikeInfo(ids, userId), layout: notion.layout, url };
  } catch {
    return null;
  }
};

export const createLike = async (url: string, userId: string) => {
  const notion = await getNotionContext(url);
  if (!notion) throw Error("Could not find valid api settings");

  const ids = await getLikedPersonIds(
    notion.client,
    notion.pageId,
    notion.likeProp
  );
  const people = ids.map((id) => ({ id })).concat({ id: userId });
  await notion.client.pages.update({
    page_id: notion.pageId,
    properties: { [notion.likeProp]: { type: "people", people } },
  });
  return {
    ...createLikeInfo(
      people.map((p) => p.id),
      userId
    ),
    layout: notion.layout,
    url,
  };
};

export const deleteLike = async (url: string, userId: string) => {
  const notion = await getNotionContext(url);
  if (!notion) throw Error("Could not find valid api settings");

  const ids = await getLikedPersonIds(
    notion.client,
    notion.pageId,
    notion.likeProp
  );
  const people = ids.filter((id) => id !== userId).map((id) => ({ id }));
  await notion.client.pages.update({
    page_id: notion.pageId,
    properties: { [notion.likeProp]: { type: "people", people } },
  });
  return {
    ...createLikeInfo(
      people.map((p) => p.id),
      userId
    ),
    layout: notion.layout,
    url,
  };
};
