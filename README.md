This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare backend

The Next.js app remains deployed on Vercel. The Cloudflare Worker in `realtime/` serves multiplayer WebSockets and a private D1 API used by the Vercel auth and save routes.

The D1 schema is in `migrations/0001_initial.sql`. Apply it locally with `npm run db:migrate:local` or remotely with `npm run db:migrate:remote`; both commands use the realtime Worker config.

Configure the same long random secret in both places:

- Cloudflare Worker secret: `APP_API_TOKEN` (set with `npx wrangler secret put APP_API_TOKEN --config realtime/wrangler.jsonc`).
- Vercel environment variables: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_API_URL`, set to the secret and the Worker base URL. Also set `NEXT_PUBLIC_MULTIPLAYER_URL` to the Worker WebSocket URL.

For local development, run `npm run dev` in `realtime/` to start the Worker on port 8787, then run the Next.js app with `npm run dev` from the project root. In `.env.local`, set `CLOUDFLARE_API_URL=http://localhost:8787`, `CLOUDFLARE_API_TOKEN` to match `APP_API_TOKEN` in `realtime/.dev.vars`, and `NEXT_PUBLIC_MULTIPLAYER_URL=ws://localhost:8787`.

Deploy the realtime Worker separately from the Vercel app. The app's GitHub push continues to deploy through Vercel; it does not deploy the Worker.

The realtime WebSocket room still accepts anonymous player identities and is not linked to account sessions. The D1 account API is protected separately by `APP_API_TOKEN`.

## D1 database

Player accounts, login sessions, and game saves use the Cloudflare D1 database bound to the realtime Worker. Game saves also keep a browser-local copy for offline recovery and sync to D1 when the player is signed in.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
