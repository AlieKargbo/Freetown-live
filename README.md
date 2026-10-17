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

## Local multiplayer prototype

Building interiors show connected players' customized Sims and synchronize their building and movement. The WebSocket service is a separate Node process:

1. In one terminal, run `npm run realtime`.
2. In the project root, add this to `.env.local`:

   ```text
   NEXT_PUBLIC_MULTIPLAYER_URL=ws://localhost:8787
   ```

   Then run `npm run dev` in another terminal.
3. Open the game in two browser tabs, create/customize a Sim in each tab, and enter the same building. Walk by clicking a destination on the floor.

Run `npm run test:realtime` to check presence and movement broadcasting. The service exposes `GET /health`; set `PORT` and `ALLOWED_ORIGINS` when hosting it. Configure the app's `NEXT_PUBLIC_MULTIPLAYER_URL` to the service's `wss://` endpoint in production and allow the deployed app origin.

This is an anonymous prototype: player IDs are created per browser tab, and the current client-side signup does not authenticate users to the WebSocket service. Do not expose it as a trusted production service until server-side authentication and authorization are added.

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
