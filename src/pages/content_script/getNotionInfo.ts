const getUserId = () => {
  try {
    return JSON.parse(localStorage["LRU:KeyValueStore2:current-user-id"])
      .value as string;
  } catch (e) {
    return null;
  }
};

export const getNotionInfo = () => ({
  userId: getUserId(),
  url: location.href,
});
