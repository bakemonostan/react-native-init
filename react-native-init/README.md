# RN Init (web wizard)

Next.js UI that walks through the same **conceptual choices** as **`my-react-native-expo-template`** and produces a **copy-paste `.env`** aligned with that repo’s `app.config.ts` / `.env.example`.

**Closed source** for now (no public distribution or license in this README).

- **Wizard:** [http://localhost:3000/create](http://localhost:3000/create) when you run `npm run dev`.
- **How opt-in/out works today:** see [`docs/WIZARD_FLOW.md`](docs/WIZARD_FLOW.md).
- **Expo template side:** `my-react-native-expo-template/docs/WIZARD_AND_TEMPLATE.md` — open that file in your Expo clone (sibling folder to this repo on your machine).

## Scripts

```bash
npm install
npm run dev    # Next dev server
npm run lint
npx tsc --noEmit
```

## Output

1. **Copy .env snippet** — primary path; merges into your Expo clone.
2. **Try download ZIP** — calls `POST /api/generate` when implemented; otherwise the UI explains the gap.

---

Below is the original create-next-app boilerplate (generic Next.js tips).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) — learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) — an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) — your feedback and contributions are welcome.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
