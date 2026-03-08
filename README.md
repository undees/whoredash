# WhoreDash

A grocery list app for wives who send their wives shopping.

## What it does

- Start a new grocery list (forgetting the old one)
- Add and remove items
- Share the list via your phone's native share sheet (iMessage, text, etc.)

That's it. No accounts, no subscriptions, no "premium tier" for the privilege of buying milk.

## Tech

- [Lit](https://lit.dev/) web components (~35KB bundled)
- [Bun](https://bun.sh/) for package management and bundling
- `localStorage` for persistence
- Web Share API for sending the list
- Deployed as a static site on [Render](https://render.com/)

## Development

```bash
bun install
bun run build
bun run serve
```

Then open http://localhost:3000.

For watch mode during development:

```bash
bun run dev
```

## Deployment

Push to a repo connected to Render. The `render.yaml` handles the rest.

## Licence

[Blue Oak Model License 1.0.0](LICENSE.md)
