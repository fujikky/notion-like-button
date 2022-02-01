export const waitFor = (selector: string): Promise<Element> =>
  new Promise((res) => {
    const onLoad = () => {
      const isReady = () => {
        const element = document.querySelector(selector);
        if (!element) return;
        clearInterval(interval);
        res(element);
      };
      const interval = setInterval(isReady, 100);
      isReady();
    };

    if (document.readyState === "complete") {
      onLoad();
      return;
    }

    document.addEventListener("readystatechange", () => {
      if (document.readyState !== "complete") return;
      onLoad();
    });
  });

export const html = (src: string) => {
  const range = document.createRange();
  const fragment = range.createContextualFragment(src);

  return fragment.children[0] as HTMLElement;
};
