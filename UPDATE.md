# Update Brief — 3 changes

Keep the overall light editorial layout, the avatar image logo, content, and animations unchanged unless specified below.

## 1) Use the Mochibop font (local font files)
Two local font files now exist in the project:
- `fonts/Mochibop-Demo.ttf` (regular)
- `fonts/Mochibop-Bold-Demo.ttf` (bold)

In `styles.css`, add `@font-face` rules to load them, e.g.:
```css
@font-face {
  font-family: 'Mochibop';
  src: url('fonts/Mochibop-Demo.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Mochibop';
  src: url('fonts/Mochibop-Bold-Demo.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}
```
Use **Mochibop** for the HEADINGS / display text (h1, h2, h3, hero name, nav brand, marquee captions). Keep **Fredoka** as the BODY/paragraph/nav-link font (Mochibop is a handwritten display font — using it for body text would hurt readability). Add Fredoka as the fallback after Mochibop.

## 2) Fix the "too thick / jumbled letters" problem
The user feels Mochibop looks too heavy and the letters feel cramped/jumbled. Make it more comfortable and visually pleasing:
- For Mochibop headings, prefer the **regular (400)** weight rather than the bold 700 for most headings, so it looks lighter (use bold only where a heading really needs emphasis, like the hero name — and even there keep it tasteful).
- Increase **letter-spacing** slightly on Mochibop headings (e.g. `letter-spacing: 0.02em`–`0.04em`) so letters don't feel jumbled together.
- Increase **line-height** on multi-line headings (e.g. `line-height: 1.15`–`1.25`) for breathing room.
- Make sure heading sizes aren't so huge that the handwritten letters overlap; reduce slightly if needed so it reads cleanly.
Goal: a soft, friendly, readable handwritten heading look — not a heavy cramped blob.

## 3) "Find Ahmed online" section — make it real LINKS (add Discord)
Currently the Links section seems to repeat the works. Replace its content so it lists Ahmed's actual social/contact LINKS (not the games as works). Include:
- **YouTube:** https://www.youtube.com/@t.i1  (label: "YouTube @t.i1")
- **Discord (server invite):** https://discord.gg/H6T2DgzWFj  (label: "Discord")
- Also show his **Discord username: 4pd_** (as text near the Discord button, e.g. a small caption "@4pd_").
Keep the two Roblox game links in the WORKS section (do not remove them from Works). The Links section is specifically for YouTube + Discord here. Use recognizable icons (YouTube, Discord) with `target="_blank" rel="noreferrer"` on the links.

## When done
Open the preview and report the absolute path of index.html.
