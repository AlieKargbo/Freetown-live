# Roadmap to First Deployment

This roadmap targets a small, playable first release of Freetown Life. The repo already has a Next.js game, local save support, and a separate WebSocket presence service. The main release decision is whether the first deployment is a private prototype or a public release with trusted accounts and durable saves.

## 1. Set the release boundary

- Choose a private playtest or public launch.
- For a private playtest, keep the game clearly labeled as a prototype and limit access while multiplayer has no server-side identity.
- For a public launch, add server-verified authentication and authorization before treating player identity, movement, or messages as trusted.
- Decide whether local browser saves are acceptable for the first release. They do not follow a player to another device and can be lost when browser storage is cleared.

**Exit condition:** release audience, multiplayer scope, and save expectations are written down.

## 2. Make the core game loop dependable

- Finish and manually walk through character creation, move-in, the welcome tour, map travel, entering and leaving buildings, and the main HUD.
- Walk through needs in-game: buy food at Fish Grill, use activities at the Night Club and Youth Sports Center, sleep, shower, and empty bladder at a toilet.
- Confirm wallet, needs, skills, job progress, and home state save and restore as intended.
- Check narrow mobile screens and desktop layouts, including menus, dialogs, and 3D controls.
- Fix broken links, placeholder text, console errors, and inaccessible controls found during the walkthrough.

**Exit condition:** a new player can complete the intended first session without a blocker.

## 3. Prepare multiplayer for the chosen audience

- If this is a solo or private prototype, disable public access to multiplayer or restrict it to trusted testers.
- If this is public, add server-side identity checks, validate authorization for player updates, and decide how chat, names, and reports are handled.
- Configure the WebSocket service with the deployed site origin, a secure `wss://` endpoint, connection limits, and an operational health check.
- Decide whether presence is enough for v1 or whether player progress must be stored on a server. The current README describes anonymous, per-tab IDs and warns that the WebSocket service is not a trusted production service.

**Exit condition:** multiplayer exposure matches the release boundary, with no anonymous identity being presented as verified.

## 4. Set up production operations

- Choose hosting for the Next.js app and a separate long-running Node WebSocket process.
- Add the production `NEXT_PUBLIC_MULTIPLAYER_URL` and server-side `ALLOWED_ORIGINS` configuration. Keep secrets out of client-prefixed variables and source control.
- Configure the production domain, HTTPS, and WebSocket TLS; verify the WebSocket host can run continuously and is not a short-lived serverless function.
- Add a deployment guide, health-check URL, basic error monitoring, and a rollback procedure.
- Decide on data handling: what is stored, for how long, and how players can reset or remove it.

**Exit condition:** production configuration and recovery steps are documented and can be repeated.

## 5. Release gate

- Run the production build and lint checks; fix all blocking errors.
- Run the realtime service tests and verify its health endpoint.
- Test the production build on desktop and mobile-sized screens.
- Test two separate browser sessions joining the same building, then leaving and reconnecting.
- Check the browser console and server logs for startup, network, asset, and WebSocket errors.
- Confirm environment variables, allowed origins, and the deployed WebSocket URL match the production domain.

**Exit condition:** every release check passes against a production-like environment.

## 6. Deploy and validate

- Deploy the WebSocket service first and confirm its health endpoint and secure connection.
- Deploy the web app and verify character creation, home entry, map travel, needs, food purchases, and saves.
- Invite a small group of testers and collect issues for one short stabilization pass.
- Keep the release reversible: know how to roll back the web app and stop multiplayer connections if a serious issue appears.

**First-deployment definition of done:** a new player can load the game over HTTPS, create a Sim, enter their home, complete the core loop, and return later with the expected saved progress. Multiplayer behavior and access are appropriate for the chosen audience.

## Current release risks

- The WebSocket service is a separate process from Next.js and needs its own persistent host and secure endpoint.
- The README documents multiplayer as anonymous and not production-trusted without server-side authentication and authorization.
- Browser-local saves are not account-backed or cross-device.
- The repo has build, lint, and realtime test scripts, but this roadmap has not run them.
