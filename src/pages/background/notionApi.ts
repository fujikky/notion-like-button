import { Client } from "@notionhq/client";
import embededSettings from "embeded-settings";

import type { SettingsValues } from "~/types";

type Page = Awaited<ReturnType<typeof Client.prototype.pages.retrieve>>;

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

const resolveLikedPeople = (page: Page, likeProp: string) => {
  if (!("properties" in page)) throw Error("Could not find properties in page");

  const like = page.properties[likeProp];
  if (!like || like.type !== "people")
    throw Error("Could not find like prop with peoople type");

  return like.people;
};

const createLikeInfo = (page: Page, userId: string, likeProp: string) => {
  const people = resolveLikedPeople(page, likeProp);
  const isLiked = people.some((people) => people.id === userId);
  const likeCount = people.length;
  return { isLiked, likeCount };
};

export const getLikeInfo = async (url: string, userId: string) => {
  const notion = await getNotion(url);
  if (!notion) return null;

  const { pageId, pageMode, likeProp, client } = notion;

  try {
    const page = await client.pages.retrieve({ page_id: pageId });
    return { ...createLikeInfo(page, userId, likeProp), pageMode, url };
  } catch {
    return null;
  }
};

export const createLike = async (url: string, userId: string) => {
  const notion = await getNotion(url);
  if (!notion) throw Error("Could not find valid api settings");

  const { pageId, pageMode, likeProp, client } = notion;
  const page = await client.pages.retrieve({ page_id: pageId });
  const people = resolveLikedPeople(page, likeProp);
  const newPeople = people.map((p) => ({ id: p.id })).concat({ id: userId });
  const newPage = await client.pages.update({
    page_id: pageId,
    properties: { [likeProp]: { type: "people", people: newPeople } },
  });
  return { ...createLikeInfo(newPage, userId, likeProp), pageMode, url };
};

export const deleteLike = async (url: string, userId: string) => {
  const notion = await getNotion(url);
  if (!notion) throw Error("Could not find valid api settings");

  const { pageId, pageMode, likeProp, client } = notion;
  const page = await client.pages.retrieve({ page_id: pageId });
  const people = resolveLikedPeople(page, likeProp);
  const newPeople = people
    .filter((p) => p.id !== userId)
    .map((p) => ({ id: p.id }));
  const newPage = await client.pages.update({
    page_id: pageId,
    properties: { [likeProp]: { type: "people", people: newPeople } },
  });
  return { ...createLikeInfo(newPage, userId, likeProp), pageMode, url };
};
