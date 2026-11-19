# Welcome to Toto Expenses! 
Toto Expenses is a Progressive Web App made for mobile devices that is meant to handle your expenses: that's categorizing them, monitoring them and helping you control them and getting insights into your spending habits.

It is part of the Toto ecosystem, which means that you can integrate it with other apps in that ecosystem and interesting services! :) 

# Development
The app is built with **Next.js (App Router) and TypeScript** (strict mode), following the same structure as the other Toto web apps:

* `app/` – routes (one `page.tsx` per route) and the root layout
* `components/` – shared UI components
* `api/` – one class per backend API (`ExpensesAPI`, `GamesAPI`, ...), built on `TotoAPI`
* `model/` – TypeScript interfaces of the API payloads
* `context/`, `utils/` – auth context and helpers
* `public/images/` – SVG icons, rendered with `MaskedSvgIcon` from `toto-react`

Commands:
* `npm run dev` – start the dev server
* `npm run build` / `npm start` – production build and server
* `npm test` – Jest unit tests
* `npm run lint`, `npm run typecheck`

Environment variables (set at build time, see `Config.ts` and the `Dockerfile`):
`NEXT_PUBLIC_EXPENSES_API_ENDPOINT`, `NEXT_PUBLIC_EXPENSES_V2_API_ENDPOINT`, `NEXT_PUBLIC_AUTH_API_ENDPOINT`, `NEXT_PUBLIC_EXPCAT_API_ENDPOINT`, `NEXT_PUBLIC_GAMES_API_ENDPOINT`, `NEXT_PUBLIC_INCAST_API_ENDPOINT`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

# Version 1.21.0
* Technical: migrated to Next.js (App Router) and strict TypeScript. No functional changes; detail and tag-edit screens now work on reload/deep link (data comes from the URL instead of in-memory router state)

# Version 1.20.0
* Insight Section: added the graph that shows the average monthly spend on every year since 2018 on a given category

# Version 1.19.0
* Insight Section: added a graph that shows the monthly spend for a given category