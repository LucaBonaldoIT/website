# lucabonaldo.dev

Personal website of Luca Bonaldo, Software Engineer. A static single-page site built
with [Vite](https://vite.dev), vanilla JavaScript and [p5.js](https://p5js.org) for the generative
dot-field backgrounds.

**Live:** <https://lucabonaldo.dev>

## Project layout

```
index.html          page markup, SEO meta tags and JSON-LD
src/
  main.js           entry point: imports styles, starts the scripts
  styles/           fonts.css (self-hosted @font-face) and main.css
  fonts/            self-hosted Inter and Fraunces (woff2)
  scripts/
    field.js        p5 dot fields (p5 is lazy-loaded; CSS fallback if it fails)
    reveal.js       scroll-reveal animations and footer year
    dom.js          small DOM helpers
public/             copied verbatim to the site root: icons, manifest, robots.txt,
                    sitemap.xml, CNAME, og-image.png, curriculum PDF
build.sh            clean production build into dist/ (git-ignored)
scripts/            og-image.sh and icons.sh regenerate the social card and favicons
```

## Develop

Node 20+ is required (`.nvmrc` pins 22).

```sh
npm install
npm run dev        # dev server with hot reload
npm run format     # Prettier
```

## Build and deploy

```sh
./build.sh         # installs dependencies if missing, then writes a clean dist/
npm run preview    # serve dist/ locally
```

`dist/` is a plain static site and can be hosted anywhere. The `CNAME` file in `public/` is copied
to the output for GitHub Pages custom-domain hosting.

## License

[MIT](LICENSE) for the source code. The curriculum PDF, photographs and personal content are not
licensed for reuse.
