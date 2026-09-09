# Elmi Muller — speaker website

A plain HTML/CSS/JS site (no build step) with a login-protected admin panel
for editing text, talks and events without touching code.

## What's in here

- `index.html`, `about.html`, `talks.html`, `events.html`, `contact.html` — the pages
- `style.css`, `script.js` — styling and behaviour (search/filter, dynamic content)
- `content/*.json` — the actual editable content (bio, topics, talks, events)
- `admin/` — the CMS (Decap CMS) that edits those JSON files through a web UI
- `netlify.toml` — tells Netlify how to serve the site

The talks library search works entirely by **title, topic and keyword** you enter per
talk — not by transcribing what's said in the recording. Add tags in the "Keywords"
field for anything you want a talk to be found by.

---

## 1. Put this on GitHub

1. Create a new repository at github.com (e.g. `elmi-muller-site`), no README/license needed.
2. From this folder:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/elmi-muller-site.git
   git push -u origin main
   ```

## 2. Deploy on Netlify (free tier)

1. Go to app.netlify.com → **Add new site → Import an existing project**.
2. Connect GitHub and pick the repo.
3. Build settings: leave the build command **empty** and set publish directory to `.`
   (this site has no build step — Netlify just serves the files).
4. Click **Deploy**. You'll get a URL like `random-name-123.netlify.app`.
   You can rename it under **Site settings → General → Site details → Change site name**,
   or add a custom domain later (also free to connect, domain purchase not included).

## 3. Turn on the login-editable CMS

1. In Netlify: **Site settings → Identity → Enable Identity**.
2. Under **Identity → Registration**, set it to **Invite only** (so random people can't sign up).
3. Under **Identity → Services**, enable **Git Gateway**. This lets the CMS commit
   content changes to GitHub on Elmi's behalf without her needing a GitHub account.
4. Go to the **Identity** tab (top-level, next to Deploys) → **Invite users** →
   enter Elmi's email. She'll get an email to set a password.
5. Open `admin/config.yml` in the repo and replace `https://example.netlify.app`
   with your real Netlify URL (both `site_url` and `display_url`), then commit/push.

## 4. Day-to-day editing

Elmi (or anyone invited) logs in at:

```
https://YOUR-SITE.netlify.app/admin/
```

From there she can edit, in plain forms — no code:
- **Homepage & Story** — headline, bio paragraphs, stats, keynote topics, testimonials
- **Talks & Recordings** — add/edit/remove talks, set topic + keywords for search, add a video link
- **Events** — upcoming and past speaking engagements

Saving in the CMS commits the change to GitHub, and the live site updates within
a minute or two — no rebuild step needed since the site reads the content files directly.

## 5. Booking form

`contact.html` uses **Netlify Forms** (free, built in) — submissions appear under
**Site settings → Forms** in Netlify, and you can turn on email notifications there
(Forms → Form notifications → Add notification → Email). No extra setup required.

## 6. Photos

Replace the placeholder portrait blocks by adding real images to the `images/`
folder (via git, or by uploading through the CMS's image picker) and swapping
the `<div class="hero-portrait">…</div>` / `<div class="bio-portrait">…</div>`
blocks in `index.html` / `about.html` for `<img>` tags pointing at them. Ask me
if you'd like this wired up as an editable field in the CMS too.

## Notes on the "old academic talks" question

The talks library only shows what's in `content/talks.json` — nothing is pulled
in automatically from anywhere else. So the site by default only ever shows the
talks you deliberately add, which fits the advice you got about not surfacing
older academic talks that send a mixed signal about the kind of speaker Elmi is now.
