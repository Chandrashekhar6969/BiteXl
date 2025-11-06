# InfoHub (ByteXL assignment)

This repository contains a minimal full-stack demo that integrates three utilities into a single-page app:

- Real-time Weather (via Open-Meteo)
- Currency Converter (INR → USD/EUR via exchangerate.host)
- Motivational Quote Generator (local mock data)

The backend is an Express server that provides three API endpoints and serves the client files.

## Run (Windows PowerShell)

1. Install Node.js (latest LTS).
2. Open PowerShell in the project root (`c:\Users\Public\projects\biteXl`).

3. Install server dependencies:

```powershell
cd .\server
npm install
```

4. Start the server:

```powershell
npm start
```

The server listens on port 3001 by default. Open http://localhost:3001 in your browser to view the app.

Notes:
- The client is a no-build demo that uses React and Babel from CDNs. It's intended for quick development/demoing.
- The backend uses free public APIs that do not require API keys.

Next steps (optional):
- Convert the client into a proper React app (Vite) and add a build step.
- Add tests and TypeScript.
