# Chrome Extension for Notion Like Button

## Installation

- Install from Chrome Web Store
  - https://chrome.google.com/webstore/detail/notion-like-button/dijaiapjgnkjknfoocnonoobnamcckbp
- How to use (Japanese)
    - https://zenn.dev/fujikky/articles/4e1471cd79ded9

## Development

### Setup

```shell
$ pnpm install
```

### Build

```shell
$ pnpm build
```

### Development server (HMR)

```
$ pnpm dev
```

Load the `dist` directory once (see below); further changes are reflected via Vite HMR without reloading the extension manually (background script changes trigger a full extension reload).

### Load extension to chrome

Load `dist` directory

