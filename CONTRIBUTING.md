# Contributing

This is a personal site, but fixes (typos, accessibility, broken links) are welcome.

## Setup

```sh
git clone https://github.com/LucaBonaldoIT/website.git
cd website
npm install
npm run dev
```

Node 20+ is required (`.nvmrc` pins 22).

## Before opening a pull request

```sh
npm run format   # Prettier
./build.sh       # production build must succeed
```

Keep changes small and focused, and check the page at desktop and ~390 px mobile widths.
