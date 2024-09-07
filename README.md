# NRL Live Ladder Website

This website (https://nrl-live-ladder.vercel.app) is built using [Next.js](https://nextjs.org/) - a modern React framework, and hosted on [Vercel](https://vercel.com/).

For a package manager, npm is preferred (Node.js must also be installed) - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.

### Installation

To clone the local repository and install the Node/NPM packages, run:

```bash
npx create-next-app@latest nrl-live-ladder --use-npm --example "https://github.com/ryanherkt3/nrl-live-ladder/tree/main"
npm install
```

For local development, Python is also required. To download version 3.12 go to https://www.python.org/downloads/.

Then, to install the required Python packages, run:

```bash
pip install -r requirements.txt
```

### Local Development

```bash
npm run dev
```

And browse to http://localhost:3000.

### Website Features

* Live ladder & fixtures - automatic updates of the ladder and fixtures as they happen, so you don't have to refresh the page.
* "No Byes" ladder - use the toggles at the top of the live ladder page to view the ladder as if bye points counted for nothing.
* Live "max points" page - see how high (or low) your team can finish on the ladder with a visual chart (or table if on mobile) showing where each team stands in the race for Finals Football.

### Future improvements

* Make SWR requests on the main page once a minute instead of infrequently.
* Have the game clock for live fixtures update every second.
* Ladder predictor page

### Bug reports, Feature requests

For any bugs or feature requests, create an issue on the repo's [Issues page](https://github.com/ryanherkt3/nrl-live-ladder/issues) with the appropriate label.