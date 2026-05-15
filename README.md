# Agraja Apps Website

Static GitHub Pages website for public app downloads.

The site reads live update manifests from:

```text
https://raw.githubusercontent.com/agraja38/app-update-feeds/main/apps.json
```

Each app card fetches its own `update.json` from `app-update-feeds` at runtime with cache-busting enabled, so download buttons update when the public feed is updated. FetchLater releases update `fetchlater/update.json` automatically from the release workflow.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The GitHub Actions workflow exports the Next.js site and deploys it to GitHub Pages.
