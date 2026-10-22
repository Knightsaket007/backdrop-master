# BackdropMaster

BackdropMaster is a browser-based editor for creating cleaner, more considered product and portrait images. Remove a photo background, build a new composition, then finish it with text, stickers, filters, and simple image tools.

Try the editor without an account at `/editor/guest`. Guest work is stored in that browser. Sign in to create projects that are saved to your account.

**Repository:** [github.com/Knightsaket007/backdrop-master](https://github.com/Knightsaket007/backdrop-master)

## What you can do

- Remove image backgrounds with the browser-based `@imgly/background-removal` package.
- Add text and stickers, adjust colors, draw or erase, crop images, and apply filters.
- Export finished compositions from the editor.
- Try the editor as a guest, or sign in to save and reopen projects.
- Upload images to Cloudinary and browse stickers through Pixabay.

## Built with

Next.js App Router, React, TypeScript, Tailwind CSS, Clerk, MongoDB with Mongoose, Cloudinary, and `@imgly/background-removal`.

## Run locally

Use Node.js 20 or later and npm.

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Knightsaket007/backdrop-master.git
   cd backdrop-master
   npm install
   ```

2. Create a `.env.local` file in the project root and add the credentials for the services you plan to use. See [Environment variables](#environment-variables) below.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

To create and run a production build:

```bash
npm run build
npm run start
```

## Environment variables

Keep secrets in `.env.local`. Do not commit that file or expose private keys with a `NEXT_PUBLIC_` prefix.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk sign-in and account UI |
| `CLERK_SECRET_KEY` | Clerk server-side authentication |
| `MONGODB_URI` | MongoDB connection for user projects |
| `CLOUDINARY_ASSETS_CLOUD_NAME` | Cloudinary uploads for project images |
| `CLOUDINARY_ASSETS_API_KEY` | Cloudinary project-image uploads |
| `CLOUDINARY_ASSETS_API_SECRET` | Cloudinary project-image uploads |
| `CLOUDINARY_STICKER_CLOUD_NAME` | Cloudinary sticker uploads |
| `CLOUDINARY_STICKER_API_KEY` | Cloudinary sticker uploads |
| `CLOUDINARY_STICKER_API_SECRET` | Cloudinary sticker uploads |
| `NEXT_PUBLIC_PIXABAY_API_KEY` | Sticker search in the editor |
| `WEBHOOK_SECRET` | Verifying Clerk webhook events at `/api/webhooks/clerk` |

Clerk keys are needed for account features. MongoDB and Cloudinary credentials are needed for signed-in project persistence and image uploads. Pixabay is used for sticker search. Configure the Clerk webhook secret when connecting the webhook in your Clerk dashboard.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product home page and gallery |
| `/editor/guest` | Editor without sign-in; project state stays in the current browser |
| `/dashboard` | Signed-in user's saved projects |
| `/editor/[id]` | A saved editor project |
| `/sign-in` and `/sign-up` | Clerk authentication |
| `/Pricing` | Pricing information |

## Project layout

```text
app/
  api/                 Upload, project, and Clerk webhook routes
  components/          Home page, dashboard, and shared UI
  dashboard/           Saved project list
  editor/              Image editor and editor state handling
  models/              Mongoose models
  sign-in/             Clerk sign-in page
  sign-up/             Clerk sign-up page
lib/                   Database connection and upload helpers
public/assets/imgs/    Images used in the home page gallery
```

## Notes

- Guest editor state is saved in local storage and is not added to the signed-in project database.
- Background removal runs in the browser. The first use may take a little longer while its model assets load.
- Uploaded images use the configured Cloudinary account.
