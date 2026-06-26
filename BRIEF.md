# Portfolio REDESIGN Brief — READ FULLY AND FOLLOW EXACTLY

Two goals:
1. **Naming:** Use the real name **Ahmed** EVERYWHERE. REMOVE the "t.i1" handle entirely — do not show "(t.i1)" or "t.i1" in the title, nav brand, hero, bio, or footer. Page `<title>` = "Ahmed". Nav brand = "Ahmed". Avatar monogram = "A".
   - Exception: the YouTube channel is literally named "@t.i1" — that is fine to keep ONLY as the channel link label/URL in the Works/Links sections.
2. **Full theme redesign** inspired by https://jackiezhang.co.za — a LIGHT, clean, editorial, playful style. Drop the dark neon/glassmorphism look completely.

## Files (rebuild all in project root C:\Users\ahmed\projects\portfolio)
- `index.html`
- `styles.css`
- `script.js`
Vanilla HTML/CSS/JS, no build step, hostable on GitHub Pages/Netlify. Google Fonts + an icon set CDN allowed.

## NEW DESIGN DIRECTION (light editorial — like the reference)
- **Light / cream background** (e.g. off-white #f6f4ef or similar warm neutral), dark charcoal text. NOT dark mode.
- **Big, bold expressive typography.** Large editorial headlines with a personality. Use a strong display font (e.g. a bold geometric/grotesk sans, or a tasteful serif for accents) via Google Fonts. Generous whitespace and large margins.
- **Hero:** very large headline statement with personality, e.g. a big "Ahmed" + a tagline like "Building games & creating content." plus a location/availability micro-label row (e.g. a small pill that says his roles or a timezone-style tag). Keep it airy and minimal, not busy.
- **Playful infinite marquee strip:** a horizontally auto-scrolling row of small rounded tiles with little captions (like the reference's "Restaurant kid / Digital world / Night owl" tiles). Make Ahmed-relevant tiles with emoji or icon placeholders and captions such as: "Roblox dev", "Scripter", "YouTuber", "Video editor", "CS student", "Night owl", "Gamer", "Creator". Use emoji or icon placeholders (comment where real images can be swapped in). Loop seamlessly.
- **A "3 things I believe in" style section** (rename to something like "What I'm about" or "How I work") with 3 short editorial statement cards — clean, minimal, big text. Tasteful, real to Ahmed (e.g. about craft, learning, fun gameplay).
- Soft, subtle, smooth animations: gentle scroll-reveal, hover lifts, the marquee. Editorial and calm — NOT flashy neon. Respect prefers-reduced-motion.

## SECTIONS / CONTENT (keep these, restyled to the new light look)
Sticky minimal nav with links: About, Experience, Works, Links.

1. **Hero** — big "Ahmed" headline + tagline + small role/location-style label row. Optional subtle scroll cue.
2. **Marquee strip** — the auto-scrolling tiles described above.
3. **About ("Who Am I")** — engaging editorial bio: Ahmed is a 19-year-old Roblox developer focused on scripting, a YouTube content creator, a video editor, and a 2nd-year Computer Science student. (No "t.i1".)
4. **Experience** — clean list/timeline of 4 items: Roblox Scripting, Content Creation (YouTube), Video Editing, Computer Science Student. Real role descriptions.
5. **Works** — 3 cards, light style with placeholder image area (comment where to add a real screenshot), title, short description, and a "View" button `target="_blank" rel="noreferrer"`:
   - **Unnamed** → https://www.roblox.com/games/14875626099/unnamed
   - **Grow Your Leg** → https://www.roblox.com/games/106419822021709/Grow-Your-Leg
   - **YouTube @t.i1** → https://www.youtube.com/@t.i1
6. **Links** — buttons with icons: YouTube (https://www.youtube.com/@t.i1), Roblox Unnamed, Roblox Grow Your Leg.
7. **Footer:** © 2026 Ahmed.

## script.js must include
- Seamless infinite marquee animation (or pure-CSS; JS optional for it).
- IntersectionObserver scroll-reveal.
- Sticky nav active-section highlight.
- Working mobile hamburger menu.

## Acceptance criteria
- Light/cream editorial design clearly inspired by the reference (NOT dark). Big bold typography, whitespace, the scrolling marquee strip, and a "things I believe in"-style section all present.
- The word "t.i1" appears ONLY in the YouTube channel link label/URL — nowhere else. Title = "Ahmed".
- All 4 content sections + marquee + footer present; the 3 works link to the exact URLs in new tabs.
- Scroll-reveal, marquee, and mobile menu all work. No console errors.
- Report the absolute path of index.html when done.
