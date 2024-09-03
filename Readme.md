# Readme

## General info

The user page and admin pages are hosted separately, and the authentication is separate for both.

## Deployments

- The frontend is hosted on: [https://stackhack2-0.vercel.app/](https://stackhack2-0.vercel.app/)
- The backend is hosted on: [https://yearling-jazmin-priyanshu123-f20d5a70.koyeb.app/](https://yearling-jazmin-priyanshu123-f20d5a70.koyeb.app/)

### Admin Dashboard

The admin page is hosted on: [https://stackhack2-0-hj88.vercel.app/](https://stackhack2-0-hj88.vercel.app/)

**Note**: Admin auth is not working on the hosted backend, but it works on localhost.

## Running on Local Machine

```bash
cd server
npm install
npm start
```

```bash
cd frontend
npm install
npm run dev
```

**Important**: Uncomment the environment variable to localhost in both admin and frontend directories (if not already).
               **the render backend takes around 50 seconds to spin up to load the data if used after a long time**

**Dummy login credentials**:

- Email: x2@test.com
- Password: hsps1234

```bash
cd admin
npm install
npm run dev
```

This only works with localhost. The hosted backend using Render and Koyeb is not functioning as expected.

**Note**: Only an admin can register another admin inside the admin dashboard.

**Admin credentials**:

- Email: test@admin2.com
- Password: hsps1234
