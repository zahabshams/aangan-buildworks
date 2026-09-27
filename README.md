# Aangan Buildworks

Replica of [Aangan Buildworks](https://home-crafted-1.preview.emergentagent.com/) — a design + build site for landowners across Bihar.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

Live site (GitHub Pages): https://zahabshams.github.io/aangan-buildworks/

Admin lead desk: `/admin/login`  
Email: `admin@aanganbuildworks.example`  
Password: the `ADMIN_PASSWORD` in `.env`, or `admin123` only when that variable is unset on the local server. The password is checked on the server, not stored in the page.

`npm run dev` saves home briefs in `data/leads.json` on this machine, so any browser that uses this server sees the same desk.

The GitHub Pages build (`VITE_DATA=browser`) still keeps briefs in that browser only. Pages cannot run the API. A shared inbox needs this server, or a host such as Vercel, plus `NOTIFY_EMAIL` and `RESEND_API_KEY` if you want an email when a brief arrives. Set `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL`, and `VITE_PUBLIC_WHATSAPP` when you have verified company contacts.
