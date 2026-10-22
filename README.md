# ASTRA QUANT X

## Run locally

Requires Node.js 20.19 or newer (or 22.12 or newer).

```sh
npm ci
npm run dev
```

## Deploy to Vercel

Import the repository into Vercel and deploy from the project root. The included
`vercel.json` configures Vite, runs `npm run build`, and serves the generated
`dist` directory. No environment variables are required for the current app.

To verify a production build locally:

```sh
npm ci
npm run build
npm run preview
```
